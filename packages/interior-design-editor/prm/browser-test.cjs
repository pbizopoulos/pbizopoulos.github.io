const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

async function run({ assetsOnly = false } = {}) {
  const fallback = process.env.INTERIOR_BACKEND === "webgl";
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: [
      "--no-sandbox",
      "--enable-gpu",
      "--enable-unsafe-webgpu",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--disable-gpu-watchdog",
      "--enable-features=Vulkan",
      "--use-vulkan=swiftshader",
      "--disable-vulkan-surface",
    ],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 900, height: 700 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    page.setDefaultTimeout(180000);
    const errors = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
      console.error(error.stack);
    });
    page.on("console", (message) => {
      const text = message.text();
      if (
        (message.type() === "error" && !text.includes("404")) ||
        (message.type() === "warning" &&
          /WGSL|Invalid Command|Device Lost|synchronization scope/i.test(text))
      ) {
        errors.push(text);
        console.error(text);
      }
    });
    const url = new URL(
      process.argv[2] || "http://localhost:8765/packages/interior-design-editor/",
    );
    url.searchParams.set("test", "");
    url.searchParams.set("example", "Bedroom");
    if (fallback) url.searchParams.set("backend", "webgl");
    const ready = () =>
      page.waitForFunction(
        () => {
          if (!window.interior?.ready) return false;
          const studio = interior.studio;
          return (
            Math.abs(
              studio.perspective.aspect - studio.host.clientWidth / studio.host.clientHeight,
            ) < 1e-9
          );
        },
        null,
        {
          timeout: 180000,
        },
      );
    await page.goto(url.href, { waitUntil: "domcontentloaded" });
    await ready();
    assert.equal(
      await page.evaluate(() => interior.studio.backend),
      fallback ? "WebGL 2 fallback" : "WebGPU",
    );
    assert.equal(
      await page.evaluate(() => interior.studio.renderer.backend.isWebGPUBackend === true),
      !fallback,
    );
    assert.equal(await page.inputValue("#renderQuality"), "high");
    const capture = async (name) => {
      const result = await page.evaluate(async () => {
        const blob = await interior.studio.capture(),
          image = await createImageBitmap(blob),
          canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        image.close();
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data,
          colors = new Set();
        let luminance = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 64) {
          colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
          luminance += (data[i] + data[i + 1] + data[i + 2]) / 3;
          count++;
        }
        // The empty upper corner must remain the same background on every row.
        // Unaligned WebGPU readbacks used to turn it into colored horizontal bands.
        let cornerVariation = 0;
        for (let row = 1; row < 16; row++) {
          for (let channel = 0; channel < 3; channel++) {
            cornerVariation = Math.max(
              cornerVariation,
              Math.abs(data[row * canvas.width * 4 + channel] - data[channel]),
            );
          }
        }
        return {
          url: canvas.toDataURL(),
          colors: colors.size,
          luminance: luminance / count,
          width: canvas.width,
          height: canvas.height,
          cornerVariation,
          corner: [...data.subarray(0, 3)],
        };
      });
      assert.ok(result.colors > 100, `${name} has rendered geometry: ${result.colors} colors`);
      assert.ok(
        result.luminance > 10 && result.luminance < 250,
        `${name} has usable exposure: ${result.luminance}`,
      );
      assert.ok(result.cornerVariation <= 3, `${name} has correctly aligned PNG rows`);
      if (process.env.INTERIOR_SCREENSHOTS) {
        fs.mkdirSync(process.env.INTERIOR_SCREENSHOTS, { recursive: true });
        fs.writeFileSync(
          path.join(
            process.env.INTERIOR_SCREENSHOTS,
            `${fallback ? "webgl" : "webgpu"}-${name}.png`,
          ),
          Buffer.from(result.url.split(",")[1], "base64"),
        );
      }
      await ready();
      console.log(`Pixels / ${name}: ${result.colors} colors, ${result.width}×${result.height}`);
      return result;
    };
    if (!assetsOnly) {
      assert.equal(await page.evaluate(() => interior.studio.sun.shadow.autoUpdate), false);
      const cache = await page.evaluate(async () => {
        const s = interior.studio,
          shadow = s.sun.shadow,
          updateMatrices = shadow.updateMatrices,
          originalQuality = s.quality,
          originalSun = { ...s.sunSettings };
        let updates = 0;
        shadow.updateMatrices = function (...args) {
          updates++;
          return updateMatrices.apply(this, args);
        };
        try {
          s.setQuality("fast");
          shadow.needsUpdate = true;
          await s.capture();
          const initial = updates;
          await s.capture();
          const unchanged = updates;
          s.options.walls = true;
          await s.capture();
          const visibility = updates;
          s.options.walls = false;
          s.updateSun({ ...originalSun, orientation: originalSun.orientation + 20 });
          await s.capture();
          const daylight = updates;
          return { initial, unchanged, visibility, daylight };
        } finally {
          shadow.updateMatrices = updateMatrices;
          s.options.walls = false;
          s.updateSun(originalSun);
          s.setQuality(originalQuality);
        }
      });
      assert.ok(cache.initial > 0, "First image builds the sun shadow");
      assert.equal(cache.unchanged, cache.initial, "Unchanged views reuse the sun shadow");
      assert.ok(cache.visibility > cache.unchanged, "Wall visibility invalidates the sun shadow");
      assert.ok(cache.daylight > cache.visibility, "Daylight invalidates the sun shadow");
      await ready();
      console.log("Sun shadow reuse / visibility + daylight invalidation PASS");
      const high = await capture("bedroom-high");
      assert.ok(await page.evaluate(() => interior.studio.renderer.getPixelRatio() >= 1.5));
      await page.selectOption("#renderQuality", "fast");
      await ready();
      const fast = await capture("bedroom-fast");
      assert.ok(
        Math.abs(high.luminance - fast.luminance) < 30,
        "PNG quality modes use the same display color space",
      );
      assert.ok(
        high.corner.every((value, i) => Math.abs(value - fast.corner[i]) <= 2),
        "Fast PNG exports use the same tone mapping as high quality",
      );
      await page.selectOption("#renderQuality", "balanced");
      await ready();
      await capture("bedroom-balanced");
      await page.selectOption("#renderQuality", "high");
      await ready();
      await page.evaluate(() => {
        const s = interior.studio;
        s.camera.position.x = -Math.abs(s.camera.position.x);
        s.camera.lookAt(s.controls.target);
        s.controls.update();
        s.requestRender();
      });
      await ready();
      await capture("mirror-high");
      assert.equal(
        await page.evaluate(() =>
          interior.studio.reflectors.some((item) => item.face.material === item.material),
        ),
        true,
        "High uses actual planar reflections",
      );
      await page.click("#resetButton");
      await ready();
      await page.click("#topButton");
      await ready();
      assert.equal(await page.evaluate(() => interior.studio.camera.isOrthographicCamera), true);
      const targetBeforePan = await page.evaluate(() => interior.studio.controls.target.toArray());
      const canvasBox = await page.locator("#viewport canvas").boundingBox();
      await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        canvasBox.x + canvasBox.width / 2 + 30,
        canvasBox.y + canvasBox.height / 2 + 20,
        { steps: 3 },
      );
      await page.mouse.up();
      await ready();
      assert.notDeepEqual(
        await page.evaluate(() => interior.studio.controls.target.toArray()),
        targetBeforePan,
        "Floor plan supports dragging to pan",
      );
      await capture("floor-plan");
      const orbitExposure = await page.evaluate(() => interior.studio.renderer.toneMappingExposure);
      await page.click("#firstPersonButton");
      await ready();
      assert.equal(
        await page.locator("#projectSummary").isVisible(),
        true,
        "Area remains available while walking",
      );
      assert.equal(
        await page.evaluate(() =>
          Boolean(
            interior.studio.canStand(
              interior.studio.camera.position.x,
              interior.studio.camera.position.z,
            ),
          ),
        ),
        true,
      );
      assert.equal(
        await page.evaluate(() => interior.studio.model.ceilings.every((mesh) => mesh.visible)),
        true,
      );
      await page.evaluate(() => {
        const s = interior.studio;
        s.keys.add("s");
        for (let i = 0; i < 20; i++) s.stepWalk(0.05);
        s.keys.clear();
      });
      assert.equal(
        await page.evaluate(() =>
          Boolean(
            interior.studio.canStand(
              interior.studio.camera.position.x,
              interior.studio.camera.position.z,
            ),
          ),
        ),
        true,
        "Walking stays inside free space",
      );
      await page.locator("#viewport canvas").press("Escape");
      await ready();
      assert.equal(await page.evaluate(() => interior.studio.mode), "3d");
      assert.equal(
        await page.evaluate(() => interior.studio.renderer.toneMappingExposure),
        orbitExposure,
        "Escape restores orbit exposure",
      );
      await page.evaluate(() => {
        const s = interior.studio;
        s.setView("walk");
        s.planTour();
        window.tourLength = s.tour.length;
        s.tour = undefined;
        s.setView("3d");
      });
      await ready();
      assert.ok(
        await page.evaluate(() => window.tourLength > 2),
        "Walkthrough builds a reachable route",
      );
      await page.click("#sceneOptions summary");
      await page.fill("#sunTime", "23:00");
      await ready();
      assert.equal(await page.evaluate(() => interior.studio.sun.intensity), 0);
      assert.ok(
        await page.evaluate(() =>
          interior.studio.model.fixtures.some(({ light }) => light.intensity > 1),
        ),
      );
      await capture("night");
      await page.fill("#sunTime", "15:30");
      await ready();
      await page.click("#sceneOptions summary");
      const idle = await page.evaluate(() => interior.studio.renderer.info.calls);
      assert.ok(Number.isFinite(idle), "Idle verification uses a real renderer counter");
      await page.waitForTimeout(200);
      assert.equal(
        await page.evaluate(() => interior.studio.renderer.info.calls),
        idle,
        "Still scenes stop drawing",
      );
      const downloads = page.waitForEvent("download");
      await page.click("#saveViewButton");
      assert.equal((await downloads).suggestedFilename(), "interior-design.png");
      await ready();
    }
    for (const name of Object.keys(await page.evaluate(() => interior.examples))) {
      await page.selectOption("#exampleSelect", name);
      await ready();
      const floorBatches = await page.evaluate(() =>
        interior.studio.model.roomGroups.map((group) => {
          const floor = group.children.find((mesh) => mesh.isInstancedMesh);
          return floor ? { count: floor.count, receivesShadow: floor.receiveShadow } : null;
        }),
      );
      assert.ok(
        floorBatches.every((floor) => floor?.count > 0 && floor.receivesShadow),
        "Every room batches its floor without losing shadows",
      );
      if (name === "Kitchen & dining") {
        assert.equal(floorBatches[0].count, 42, "Tile batching includes partial perimeter tiles");
        const bounds = await page.evaluate(() => {
          const floor = interior.studio.model.roomGroups[0].children.find(
            (mesh) => mesh.isInstancedMesh,
          );
          floor.computeBoundingBox();
          return {
            min: floor.boundingBox.min.toArray(),
            max: floor.boundingBox.max.toArray(),
          };
        });
        assert.ok(Math.abs(bounds.max[0] - bounds.min[0] - 3.996) < 0.001);
        assert.ok(Math.abs(bounds.max[2] - bounds.min[2] - 3.496) < 0.001);
      }
      if (name === "Apartment") {
        assert.match(
          await page.locator("#projectSummary").textContent(),
          /60 m² indoors.*16\.3 m² outdoors.*76\.3 m² total/,
        );
        await page.click("#sceneOptions summary");
        await page.click("#projectDetailsButton");
        assert.equal(await page.locator("#projectDetails").evaluate((dialog) => dialog.open), true);
        assert.match(await page.locator("#projectDetailsContent").textContent(), /VATTENKAR/);
        assert.match(
          await page.locator("#projectDetailsContent").textContent(),
          /Grecostrom Structure/,
        );
        assert.doesNotMatch(
          await page.locator("#projectDetailsContent").textContent(),
          /Εκκρεμ|CMOS|πλυντήριο πιάτων/iu,
        );
        assert.equal(await page.locator('#projectDetailsContent a[href*="freebox.gr"]').count(), 0);
        assert.ok(
          await page
            .locator("#projectDetailsContent a")
            .evaluateAll((links) =>
              links.every(
                (link) => link.rel === "noopener noreferrer" && link.protocol === "https:",
              ),
            ),
        );
        await page.click("#closeProjectDetails");
        await page.click("#sceneOptions summary");
        const connections = await page.evaluate(() => {
          const s = interior.studio;
          return s.model.walls
            .filter((wall) => wall.rooms.length > 1 && wall.opening?.bottom === 0)
            .map((wall) => ({
              pair: wall.rooms
                .map((room) => room.name)
                .sort()
                .join("/"),
              clear: [-0.3, 0, 0.3].some((offset) => {
                const [x, z] = wall.opening.center,
                  distance = offset * wall.opening.width;
                return Boolean(
                  s.canStand(
                    x + (wall.axis === "x" ? distance : 0),
                    z + (wall.axis === "z" ? distance : 0),
                  ),
                );
              }),
            }));
        });
        for (const pair of [
          "bathroom/passage",
          "passage/study",
          "living/passage",
          "balcony/living",
          "balcony/bedroom",
          "balcony/study",
          "bedroom/hall",
          "hall/living",
        ]) {
          assert.ok(
            connections.some((connection) => connection.pair === pair && connection.clear),
            `The ${pair} doorway is shared and clear of furniture`,
          );
        }
        assert.ok(
          await page.evaluate(() => {
            const s = interior.studio,
              passage = s.model.walls.find((wall) => wall.opening?.kind === "passage"),
              entrance = s.model.walls.find(
                (wall) => wall.rooms.length === 1 && wall.opening?.kind === "door",
              );
            return (
              passage &&
              passage.opening.top === passage.room.height &&
              passage.elevation.children.every(
                (node) => !node.isGroup || node.children.length === 0,
              ) &&
              passage.elevation.children
                .filter((node) => node.isMesh)
                .every((node) => {
                  const half = node.geometry.parameters.width / 2;
                  return (
                    node.position.x + half <=
                      passage.opening.offset - passage.opening.width / 2 + 0.00001 ||
                    node.position.x - half >=
                      passage.opening.offset + passage.opening.width / 2 - 0.00001
                  );
                }) &&
              Boolean(s.canStand(...entrance.opening.center))
            );
          }),
          "The entrance stays clear and the living-room passage has no door frame or lintel",
        );
        const reachable = await page.evaluate(() => {
          const s = interior.studio,
            p = s.model.program,
            hall = p.rooms.find(({ name }) => name === "hall"),
            origin = [(hall.x + 4.5) * p.grid - p.center[0], (hall.z + 4) * p.grid - p.center[1]],
            step = 0.08,
            nodes = [[0, 0]],
            seen = new Set(["0,0"]),
            free = new Map(),
            rooms = new Set();
          s.model.root.updateMatrixWorld(true);
          const roomAt = (x, z) => {
            const key = `${x},${z}`;
            if (!free.has(key))
              free.set(key, s.canStand(origin[0] + x * step, origin[1] + z * step)?.name);
            return free.get(key);
          };
          if (!roomAt(0, 0)) return [];
          for (let i = 0; i < nodes.length && nodes.length < 16000; i += 1) {
            const [x, z] = nodes[i];
            rooms.add(roomAt(x, z));
            for (const [dx, dz] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ]) {
              const key = `${x + dx},${z + dz}`;
              if (seen.has(key)) continue;
              seen.add(key);
              if (
                roomAt(x + dx, z + dz) &&
                s.canStand(origin[0] + (x + dx / 2) * step, origin[1] + (z + dz / 2) * step)
              )
                nodes.push([x + dx, z + dz]);
            }
          }
          const reached = new Set(nodes.map(([x, z]) => `${x},${z}`)),
            fixtures = s.model.objects
              .filter(({ userData }) =>
                [
                  "bed",
                  "single_bed",
                  "builtin_wardrobe",
                  "wardrobe",
                  "frameless_shower",
                  "washing_machine",
                  "toilet",
                  "coat_rack",
                  "shoe_rack",
                  "pitsos_fridge",
                  "aabenraa_table",
                ].includes(userData.token.name),
              )
              .map((group) => {
                const token = group.userData.token,
                  yaw = (token.yaw * Math.PI) / 180,
                  distance = token.dimensions[1] / 2 + 0.28,
                  position = group.getWorldPosition(group.position.clone()),
                  x = position.x + Math.sin(yaw) * distance,
                  z = position.z + Math.cos(yaw) * distance,
                  gx = Math.round((x - origin[0]) / step),
                  gz = Math.round((z - origin[1]) / step);
                return {
                  name: `${group.userData.room.name}/${token.name}`,
                  occupied: !s.canStand(position.x, position.z),
                  reachable:
                    Boolean(s.canStand(x, z)) &&
                    [-1, 0, 1].some((dx) =>
                      [-1, 0, 1].some((dz) => reached.has(`${gx + dx},${gz + dz}`)),
                    ),
                };
              });
          return { rooms: [...rooms].sort(), fixtures };
        });
        assert.deepEqual(
          reachable.rooms,
          ["balcony", "bathroom", "bedroom", "hall", "living", "passage", "study"],
          "Continuous walking routes connect every area, including turns around furniture",
        );
        assert.equal(reachable.fixtures.length, 11);
        assert.ok(
          reachable.fixtures.every(({ occupied, reachable }) => occupied && reachable),
          JSON.stringify(reachable.fixtures),
        );
        const floorFits = await page.evaluate(() => {
          const s = interior.studio,
            p = s.model.program;
          return s.model.roomGroups.every((group) => {
            const r = group.userData.room,
              floor = group.children.find((mesh) => mesh.isInstancedMesh),
              matrix = floor.matrix.clone(),
              inside = (x, z) =>
                r.regions.some((region) =>
                  region.every(([ax, az], i) => {
                    const [bx, bz] = region[(i + 1) % region.length];
                    return (bx - ax) * (z - az) - (bz - az) * (x - ax) >= -0.00001;
                  }),
                );
            let covered = 0;
            for (let i = 0; i < floor.count; i += 1) {
              floor.getMatrixAt(i, matrix);
              const e = matrix.elements;
              if (e[0] <= 0 || e[10] <= 0) return false;
              covered += e[0] * e[10];
              for (const [a, b] of [
                [-1, -1],
                [1, -1],
                [1, 1],
                [-1, 1],
              ]) {
                const x = (e[12] + (a * e[0]) / 2) / p.grid + r.cols / 2,
                  z = (e[14] + (b * e[10]) / 2) / p.grid + r.rows / 2;
                if (!inside(x, z)) return false;
              }
            }
            const clipped = group.children.find((mesh) => mesh.userData.clippedFloor);
            if (r.diagonal && !clipped) return false;
            if (clipped) {
              if (
                !clipped.material.color.equals(floor.material.color) ||
                clipped.material.map !== floor.material.map
              )
                return false;
              const vertices = clipped.geometry.getAttribute("position");
              for (let i = 0; i < vertices.count; i++)
                if (
                  !inside(
                    vertices.getX(i) / p.grid + r.cols / 2,
                    vertices.getZ(i) / p.grid + r.rows / 2,
                  )
                )
                  return false;
              for (let i = 0; i < vertices.count; i += 3) {
                if (
                  vertices.getY(i) > 0 &&
                  Math.abs(vertices.getY(i) - vertices.getY(i + 1)) < 1e-8 &&
                  Math.abs(vertices.getY(i) - vertices.getY(i + 2)) < 1e-8
                ) {
                  const area =
                    ((vertices.getZ(i + 1) - vertices.getZ(i)) *
                      (vertices.getX(i + 2) - vertices.getX(i)) -
                      (vertices.getX(i + 1) - vertices.getX(i)) *
                        (vertices.getZ(i + 2) - vertices.getZ(i))) /
                    2;
                  if (area < -1e-9) return false;
                  covered += area;
                }
              }
            }
            return (
              covered / (r.area * p.grid ** 2) > 0.94 && covered <= r.area * p.grid ** 2 + 0.00001
            );
          });
        });
        assert.equal(floorFits, true, "Batched floor pieces remain inside the mapped outlines");
        await page.click("#topButton");
        await ready();
        assert.ok(
          await page.evaluate(() => {
            const m = interior.studio.model;
            return (
              m.walls.every((wall) => !wall.elevation.visible && wall.plan.visible) &&
              m.labels.length === 6 &&
              m.labels.every((label) => label.visible) &&
              m.objects
                .filter(({ userData }) => userData.token.name === "double_awning")
                .every((group) => !group.visible) &&
              m.root.children
                .filter((group) => group.userData.ceilingFixture)
                .every((group) => !group.visible)
            );
          }),
          "Plan view shows room labels and low walls without overhead lintels or fixtures",
        );
        assert.ok(
          await page.evaluate(() => {
            const walls = interior.studio.model.walls,
              shutters = walls.filter(
                (wall) =>
                  wall.opening?.kind === "shutter" &&
                  Math.abs(wall.opening.width - wall.length) < 0.00001,
              );
            return (
              shutters.length === 3 && shutters.every((wall) => wall.plan.children.length === 0)
            );
          }),
          "Full-wall shutters leave clear plan openings without zero-width wall pieces",
        );
        if (!assetsOnly) await capture("apartment-plan");
        await page.click("#resetButton");
        await ready();
        assert.ok(
          await page.evaluate(() => {
            const objects = interior.studio.model.objects,
              curtains = objects.filter(({ userData }) => userData.token.name === "curtain_pair"),
              air = objects.find(({ userData }) => userData.token.name === "air_conditioner");
            return (
              curtains.length === 3 &&
              curtains.every((group) => {
                const panels = group
                  .getObjectsByProperty("isMesh", true)
                  .filter(({ geometry }) => geometry.type === "PlaneGeometry");
                return (
                  group.visible &&
                  panels.length === 2 &&
                  panels.every(({ geometry }) => {
                    geometry.computeBoundingBox();
                    return (
                      Math.abs(
                        (geometry.boundingBox.max.x - geometry.boundingBox.min.x) * group.scale.x -
                          group.userData.token.dimensions[0] * 0.19,
                      ) < 0.00001
                    );
                  })
                );
              }) &&
              air.visible
            );
          }),
          "All three curtains and the A/C remain visible in the default cutaway",
        );
        assert.ok(
          await page.evaluate(() => interior.studio.model.labels.every((label) => !label.visible)),
          "Labels stay in plan view",
        );
        assert.ok(
          await page.evaluate(() => {
            const m = interior.studio.model,
              doubles = m.objects.filter(({ userData }) => userData.token.name === "double_awning"),
              singles = m.objects.filter(({ userData }) => userData.token.name === "side_awning"),
              balcony = m.roomGroups.find(({ userData }) => userData.room.kind === "balcony"),
              rails = balcony.children.filter(({ userData }) => userData.railing);
            return (
              doubles.length === 2 &&
              doubles.every(
                (group) =>
                  group.visible &&
                  group
                    .getObjectsByProperty("isMesh", true)
                    .filter(({ userData }) => userData.awningPanel).length === 2,
              ) &&
              singles.length === 1 &&
              singles[0].visible &&
              rails.length === 3 &&
              rails.every((rail) => {
                const posts = rail.children.find(({ userData }) => userData.railPosts),
                  bars = rail.children.find(({ userData }) => userData.horizontalRails),
                  matrix = rail.matrix.clone();
                let previous;
                for (let i = 0; i < posts.count; i += 1) {
                  posts.getMatrixAt(i, matrix);
                  if (i > 0 && matrix.elements[12] - previous > 1.500001) return false;
                  previous = matrix.elements[12];
                }
                return (
                  bars?.count === 4 &&
                  posts.material.metalness > 0.7 &&
                  bars.material === posts.material
                );
              })
            );
          }),
          "Two double awnings, one side awning and silver horizontal railing remain visible",
        );
        const mounted = await page.evaluate(() =>
          interior.studio.model.objects
            .filter((group) => group.userData.token.mount && group.userData.token.child)
            .map((group) => ({
              name: group.userData.token.name,
              y: group.position.y,
              child: group.children.some((node) => node.userData.token?.name === "laptop"),
            })),
        );
        assert.deepEqual(
          mounted,
          [{ name: "wall_shelf", y: 1.2, child: true }],
          "Product shelf is raised and carries its laptop",
        );
        await page.evaluate(() =>
          interior.selectObject(
            interior.studio.model.objects.find(
              (group) => group.userData.token.name === "wall_shelf",
            ),
          ),
        );
        assert.match(
          await page.evaluate(() =>
            interior.editor.state.sliceDoc(
              interior.editor.state.selection.main.from,
              interior.editor.state.selection.main.to,
            ),
          ),
          /^wall_shelf\(laptop_on_top\)/,
          "Clicking a mounted object selects its source token",
        );
      }
      await page.evaluate(() => {
        const s = interior.studio;
        interior.selectObject(s.model.objects.find((g) => g.userData.token.url));
      });
      assert.equal(
        await page.locator("#selectionCard a").getAttribute("rel"),
        "noopener noreferrer",
      );
      assert.match(await page.locator("#selectionCard a").getAttribute("href"), /^https:\/\//);
      if (name === "Apartment") {
        const instanceCounts = await page.evaluate(() => {
          let rails = 0,
            floors = 0,
            fringes = 0;
          window.retiredInstances = { expected: 0, disposed: 0 };
          window.retiredLabels = { expected: 0, disposed: 0 };
          window.retiredLabelScene = interior.studio.model.labelsScene;
          for (const label of interior.studio.model.labels) {
            for (const resource of [label.material, label.material.map]) {
              window.retiredLabels.expected++;
              resource.addEventListener("dispose", () => window.retiredLabels.disposed++);
            }
          }
          interior.studio.model.root.traverse((node) => {
            if (!node.isInstancedMesh) return;
            window.retiredInstances.expected++;
            node.addEventListener("dispose", () => window.retiredInstances.disposed++);
            if (node.userData.railPosts) rails++;
            else if (interior.studio.model.roomGroups.includes(node.parent)) floors++;
            else if (node.geometry.parameters?.width === 0.005) fringes++;
          });
          return { rails, floors, fringes };
        });
        assert.equal(instanceCounts.rails, 3, "Three balcony rails each batch all posts");
        assert.equal(
          instanceCounts.floors,
          7,
          "Mapped rooms and passages retain their floor batches",
        );
        assert.equal(instanceCounts.fringes, 0, "Apartment has no rug");
      }
      if (!assetsOnly)
        await capture(
          name === "Apartment" ? "apartment" : name.toLowerCase().replaceAll(/[^a-z]+/g, "-"),
        );
      console.log("Scene / safe product link:", name);
    }
    await page.selectOption("#exampleSelect", "Bedroom");
    await ready();
    const retired = await page.evaluate(() => window.retiredInstances);
    assert.ok(retired.expected > 0);
    assert.equal(
      retired.disposed,
      retired.expected,
      "Scene replacement disposes every instanced buffer",
    );
    const retiredLabels = await page.evaluate(() => ({
      ...window.retiredLabels,
      children: window.retiredLabelScene.children.length,
    }));
    assert.equal(retiredLabels.expected, 12);
    assert.equal(
      retiredLabels.disposed,
      retiredLabels.expected,
      "Scene replacement releases label textures and materials",
    );
    assert.equal(retiredLabels.children, 0);
    const original = await page.evaluate(() => interior.editor.state.doc.toString());
    await page.evaluate(async () => {
      interior.editor.dispatch({
        changes: {
          from: 0,
          to: interior.editor.state.doc.length,
          insert:
            "GRID 1\nROOF flat\nROOM main 4x4 AT 0,0\nOUTLINE 0,0 4,0 4,4 2,4 2,1.602 0,1.602\nWALLS north east south west\nLAYOUT main\n.\nEND",
        },
      });
      await interior.compile(true);
    });
    await ready();
    const roofsFit = await page.evaluate(() => {
      const { model } = interior.studio,
        { grid } = model.program;
      return (
        model.ceilings.length === 4 &&
        model.ceilings.every((mesh) => {
          const room = mesh.parent.userData.room;
          mesh.geometry.computeBoundingBox();
          mesh.updateMatrix();
          const bounds = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrix);
          for (const x of [bounds.min.x, bounds.max.x]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              const localX = x / grid + room.cols / 2,
                localZ = z / grid + room.rows / 2;
              if (
                !room.footprint.some(
                  ([left, top, right, bottom]) =>
                    localX >= left - 0.00001 &&
                    localX <= right + 0.00001 &&
                    localZ >= top - 0.00001 &&
                    localZ <= bottom + 0.00001,
                )
              )
                return false;
            }
          }
          return true;
        })
      );
    });
    assert.equal(roofsFit, true, "Ceilings and flat roofs preserve the room recess");
    assert.ok(
      await page.evaluate(() => {
        const floor = interior.studio.model.roomGroups[0].children.find(
            (mesh) => mesh.isInstancedMesh,
          ),
          matrix = floor.matrix.clone();
        for (let i = 0; i < floor.count; i++) {
          floor.getMatrixAt(i, matrix);
          if (matrix.elements[0] <= 0 || matrix.elements[10] <= 0) return false;
        }
        return true;
      }),
      "Thin floor pieces beside a fractional outline edge retain positive dimensions",
    );
    await page.evaluate(async () => {
      interior.editor.dispatch({
        changes: {
          from: 0,
          to: interior.editor.state.doc.length,
          insert:
            "GRID 1\nROOF flat\nROOM main 4x4 AT 0,0\nOUTLINE 0,0 4,0 4,4 2,4 0,2\nWALLS north east south west\nLAYOUT main\n.\nEND",
        },
      });
      await interior.compile(true);
    });
    await ready();
    const diagonalRendering = await page.evaluate(() => {
      const s = interior.studio,
        { model } = s,
        wall = model.walls.find(({ axis }) => axis === "diagonal"),
        inside = (distance) => wall.position.clone().addScaledVector(wall.normal, -distance),
        near = inside(0.06),
        free = inside(0.3),
        outside = inside(-0.3);
      model.root.updateMatrixWorld(true);
      const roofFits =
        model.ceilings.length === 2 &&
        model.ceilings.every((mesh) => {
          const positions = mesh.geometry.getAttribute("position");
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i) + 2,
              z = positions.getZ(i) + 2;
            if (x < -0.00001 || x > 4.00001 || z < -0.00001 || z > 4.00001 || z - x > 2.00001)
              return false;
          }
          return true;
        });
      const room = model.roomGroups[0],
        floor = room.children.find((mesh) => mesh.isInstancedMesh),
        clipped = room.children.find((mesh) => mesh.userData.clippedFloor),
        resources = new Set([
          ...model.ceilings.map((mesh) => mesh.geometry),
          clipped.geometry,
          clipped.material,
        ]);
      window.retiredDiagonal = { expected: resources.size, disposed: 0 };
      for (const resource of resources)
        resource.addEventListener("dispose", () => window.retiredDiagonal.disposed++);
      return {
        roofFits,
        wallLength: wall.length,
        nearBlocked: !s.canStand(near.x, near.z),
        freeInside: Boolean(s.canStand(free.x, free.z)),
        outsideBlocked: !s.canStand(outside.x, outside.z),
        finishMatches:
          clipped.material.color.equals(floor.material.color) &&
          clipped.material.map === floor.material.map,
      };
    });
    assert.ok(Math.abs(diagonalRendering.wallLength - Math.sqrt(8)) < 0.00001);
    for (const key of ["roofFits", "nearBlocked", "freeInside", "outsideBlocked", "finishMatches"])
      assert.equal(diagonalRendering[key], true, `Diagonal rendering: ${key}`);
    assert.equal(await page.locator("#projectSummary").textContent(), "14 m² total");
    for (const finish of ["wood", "tile"]) {
      await page.evaluate(async (surface) => {
        interior.editor.dispatch({
          changes: {
            from: 0,
            to: interior.editor.state.doc.length,
            insert: `GRID 1\nROOM main 4x4 AT 0,0\nOUTLINE 0,0 4,0 4,4 2.5,4 1.5,2 1,2 2,4 0,4\nWALLS north east south west\nSURFACE ${surface}\nLAYOUT main\n.\nEND`,
          },
        });
        await interior.compile(true);
      }, finish);
      await ready();
      const coverage = await page.evaluate(() => {
        const s = interior.studio,
          group = s.model.roomGroups[0],
          floor = group.children.find((mesh) => mesh.isInstancedMesh),
          matrix = floor.matrix.clone(),
          clipped = group.children.find((mesh) => mesh.userData.clippedFloor),
          vertices = clipped.geometry.getAttribute("position"),
          normals = clipped.geometry.getAttribute("normal"),
          inside = (x, z) => Boolean(s.roomAt(x + group.position.x, z + group.position.z));
        let area = 0;
        for (let i = 0; i < floor.count; i++) {
          floor.getMatrixAt(i, matrix);
          const e = matrix.elements;
          area += e[0] * e[10];
          if (!inside(e[12], e[14])) return -1;
        }
        for (let i = 0; i < vertices.count; i += 3) {
          if (normals.getY(i) < 0.5) continue;
          const x = [0, 1, 2].map((offset) => vertices.getX(i + offset)),
            z = [0, 1, 2].map((offset) => vertices.getZ(i + offset));
          area += Math.abs((x[1] - x[0]) * (z[2] - z[0]) - (z[1] - z[0]) * (x[2] - x[0])) / 2;
          if (!inside((x[0] + x[1] + x[2]) / 3, (z[0] + z[1] + z[2]) / 3)) return -1;
        }
        return area;
      });
      assert.ok(
        coverage > 15 * 0.94 && coverage <= 15.00001,
        `${finish} finish covers the angled recess without filling or duplicating its gap: ${coverage}`,
      );
      assert.equal(await page.locator("#projectSummary").textContent(), "15 m² total");
    }
    await page.locator(".cm-content").fill(original);
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    const retiredDiagonal = await page.evaluate(() => window.retiredDiagonal);
    assert.equal(retiredDiagonal.expected, 3);
    assert.equal(
      retiredDiagonal.disposed,
      retiredDiagonal.expected,
      "Diagonal floor and roof geometry and finish materials are disposed",
    );
    await page.locator(".cm-content").fill("ROOM broken");
    await page.locator(".cm-content").press("Control+Enter");
    await page.waitForFunction(() =>
      document.querySelector("#message").classList.contains("error"),
    );
    assert.match(await page.locator("#message").textContent(), /last valid layout/);
    assert.equal(await page.getAttribute("#designStatus", "data-state"), "error");
    assert.equal(await page.evaluate(() => interior.program.rooms[0].name), "main");
    await page.locator(".cm-content").fill(original);
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    assert.equal(await page.getAttribute("#designStatus", "data-state"), "ready");
    await page.evaluate(() =>
      interior.selectObject(
        interior.studio.model.objects.find((g) => g.userData.token.name === "bed"),
      ),
    );
    assert.equal(await page.locator("#selectionCard input, #selectionCard form").count(), 0);
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), original);
    assert.equal(
      await page.evaluate(() => {
        const { doc, selection } = interior.editor.state;
        return doc.sliceString(selection.main.from, selection.main.to);
      }),
      "bed[1.5x2x0.56]~north<https://www.ikea.com/sg/en/p/malm-bed-frame-high-white-s89005264/>",
      "Selecting an object highlights its source without editing it",
    );
    assert.equal(await page.locator("#selectionCard > *").count(), 1);
    assert.equal(await page.locator("#selectionCard a").textContent(), "Product reference ↗");
    await page.evaluate(() =>
      interior.selectObject(interior.studio.model.objects.find((g) => !g.userData.token.url)),
    );
    assert.equal(await page.locator("#selectionCard").isVisible(), false);
    assert.equal(await page.locator("#undoButton, #redoButton").count(), 0);
    await page.locator(".cm-content").fill(original.replace("bed[1.5x2x0.56]", "bed[1.4x2x0.56]"));
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    assert.equal(
      await page.evaluate(
        () =>
          interior.studio.model.objects.find((g) => g.userData.token.name === "bed").userData.token
            .dimensions[0],
      ),
      1.4,
      "Dimensions are edited through the source editor",
    );
    const beforeBrowsing = await page.evaluate(() => interior.editor.state.doc.toString());
    await page.click("#assetsButton");
    await page.fill("#assetSearch", "plant");
    await page.click("[data-asset=plant]");
    await page.waitForFunction(
      () => document.querySelector("#assetPreview img")?.naturalWidth === 512,
    );
    assert.equal(await page.locator("#assetPreview img").evaluate((img) => img.naturalWidth), 512);
    assert.equal(await page.locator("#insertAsset").count(), 0);
    await page.click("#copyAsset");
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "plant");
    await page.click("#closeAssets");
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), beforeBrowsing);
    await page
      .locator(".cm-content")
      .fill(beforeBrowsing.replace(". | . | . | . | . | . | .", "plant | . | . | . | . | . | ."));
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    assert.ok(
      await page.evaluate(() =>
        interior.studio.model.objects.some((g) => g.userData.token.name === "plant"),
      ),
    );
    const geometry = await page.evaluate(() => {
      const library = interior.studio.library,
        empty = [];
      for (const name of Object.keys(interior.catalog)) {
        const object = library.create(name);
        let meshes = 0;
        object.traverse((node) => {
          if (node.isMesh) meshes++;
        });
        if (!meshes) empty.push(name);
      }
      return empty;
    });
    assert.deepEqual(geometry, [], "Every catalog entry has geometry");
    const details = await page.evaluate(() => {
      const library = interior.studio.library,
        rug = library.create("jute_rug"),
        bed = library.create("bed"),
        table = library.create("aabenraa_table"),
        frame = table.getObjectByProperty("isInstancedMesh", true),
        frameClear = Array.from({ length: frame.count }, (_, i) => {
          const values = frame.instanceMatrix.array.slice(i * 16, (i + 1) * 16),
            dimensions = [values[0], values[5], values[10]];
          return (
            values.every(Number.isFinite) &&
            Math.min(...dimensions) > 0 &&
            dimensions.toSorted((a, b) => a - b)[1] < 0.06 &&
            values[13] - dimensions[1] / 2 >= -0.000001
          );
        }).every(Boolean);
      let rugMeshes = 0,
        fringes = 0,
        cloth = 0;
      rug.traverse((node) => {
        if (node.isMesh) rugMeshes++;
        if (node.isInstancedMesh) fringes += node.count;
      });
      bed.traverse((node) => {
        if (node.geometry?.type === "PlaneGeometry") {
          const normals = node.geometry.getAttribute("normal");
          if ([...normals.array].every(Number.isFinite)) cloth++;
        }
      });
      return {
        rugMeshes,
        fringes,
        cloth,
        frameClear,
        standard:
          library.material.wall.isMeshStandardNodeMaterial &&
          !library.material.wall.isMeshPhysicalNodeMaterial,
        glassCasts: library
          .create("shower")
          .getObjectsByProperty("isMesh", true)
          .some((mesh) => mesh.material.transparent && mesh.castShadow),
      };
    });
    assert.equal(details.rugMeshes, 2, "Rug body and all fringes need only two meshes");
    assert.ok(details.fringes > 40, "Instanced fringe retains its visible detail");
    assert.equal(details.cloth, 2, "Bedding has two draped surfaces with finite normals");
    assert.equal(details.frameClear, true, "The table has thin steel members and open leg space");
    assert.equal(details.standard, true, "Matte plaster uses standard shading");
    assert.equal(details.glassCasts, false, "Shower glass does not cast opaque shadows");
    await page.evaluate(async () => {
      const source =
        "GRID 1\nROOM main 4x4 AT 0,0\nWALLS north east south west\nMOUNT north 1 wall_lamp\nLAYOUT main\n. | . | . | .\n. | lamp | book | .\nEND";
      interior.editor.dispatch({
        changes: {
          from: 0,
          to: interior.editor.state.doc.length,
          insert: source,
        },
      });
      await interior.compile(true);
      interior.studio.options.lights = true;
      interior.studio.requestRender();
    });
    await ready();
    assert.equal(
      await page.evaluate(() => interior.studio.model.fixtures.length),
      2,
      "Cell lamps and mounted fixtures both illuminate",
    );
    assert.ok(
      await page.evaluate(() =>
        interior.studio.model.fixtures.every(({ light }) => light.intensity > 1),
      ),
    );
    console.log("Cell lamps / mounted lights PASS");
    await page.evaluate(() =>
      interior.selectObject(
        interior.studio.model.objects.find((group) => group.userData.token.name === "book"),
      ),
    );
    assert.equal(await page.locator("#selectionCard input, #selectionCard form").count(), 0);
    await page
      .locator(".cm-content")
      .fill(
        await page.evaluate(() =>
          interior.editor.state.doc.toString().replace("book |", "book[0.24x0.17x0.045] |"),
        ),
      );
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    assert.equal(
      await page.evaluate(
        () =>
          interior.studio.model.objects.find((group) => group.userData.token.name === "book")
            .userData.token.dimensions[2],
      ),
      0.045,
      "Resizing preserves fractional height",
    );
    await page.click("#shareButton");
    const share = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(new URL(share).hash.includes("scene="));
    const sourceBefore = await page.evaluate(() => interior.editor.state.doc.toString());
    const sharedUrl = new URL(share);
    sharedUrl.searchParams.set("test", "");
    if (fallback) sharedUrl.searchParams.set("backend", "webgl");
    await page.goto(sharedUrl.href, { waitUntil: "domcontentloaded" });
    await ready();
    assert.equal(
      await page.evaluate(() => interior.editor.state.doc.toString()),
      sourceBefore,
      "Share preserves the editable source",
    );
    await page.selectOption("#exampleSelect", "Small apartment");
    await ready();
    const orbitBeforeResize = await page.evaluate(() => interior.studio.camera.position.toArray());
    await page.setViewportSize({ width: 390, height: 844 });
    await ready();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= 390),
      true,
      "Mobile page has no horizontal overflow",
    );
    assert.equal(await page.locator("#layoutPanel").isVisible(), true);
    assert.ok(
      (await page.locator(".cm-layout-keyword").count()) > 0,
      "Visible source has syntax highlighting",
    );
    assert.equal(await page.locator("#viewport").isVisible(), true);
    assert.equal(await page.locator("#shareButton").isVisible(), true);
    await ready();
    assert.equal(
      await page.evaluate(
        () =>
          interior.studio.renderer.domElement.width * interior.studio.renderer.domElement.height <=
          3500000,
      ),
      true,
      "Resolution stays within its budget",
    );
    for (const width of [320, 801]) {
      await page.setViewportSize({ width, height: 844 });
      if (width === 801) {
        await page.evaluate(() =>
          document.querySelector(".workspace").style.setProperty("--editor-width", "55%"),
        );
      }
      await ready();
      const layout = await page.evaluate(() => {
        const viewport = document.querySelector("#viewport").getBoundingClientRect();
        const controls = [
          ...document.querySelectorAll(
            ".preview-bar button, .quality-control, .scene-toolbar > select:not([hidden]), .scene-toolbar > button, .scene-toolbar summary",
          ),
        ];
        const tabs = [...document.querySelectorAll(".view-buttons button span")];
        return {
          contained: controls.every((control) => {
            const rect = control.getBoundingClientRect();
            return rect.left >= viewport.left && rect.right <= viewport.right;
          }),
          singleLineLabels: tabs.every(
            (tab) =>
              tab.getBoundingClientRect().height <=
              parseFloat(getComputedStyle(tab).fontSize) * 1.6,
          ),
        };
      });
      assert.ok(layout.contained, `Controls fit the ${width}px layout, including a resized editor`);
      assert.ok(layout.singleLineLabels, "Camera labels stay on one line");
      await page.click("#sceneOptions summary");
      assert.ok(await page.locator("#sceneOptions").evaluate((element) => element.open));
      await page.locator("#sceneOptions summary").press("Escape");
      assert.equal(await page.locator("#sceneOptions").evaluate((element) => element.open), false);
    }
    await page.evaluate(() =>
      document.querySelector(".workspace").style.removeProperty("--editor-width"),
    );
    await page.setViewportSize({ width: 900, height: 700 });
    await ready();
    const orbitAfterResize = await page.evaluate(() => interior.studio.camera.position.toArray());
    assert.ok(
      orbitAfterResize.every((value, i) => Math.abs(value - orbitBeforeResize[i]) < 0.001),
      `Resizing preserves the user's orbit and restores framing: ${orbitBeforeResize} → ${orbitAfterResize}`,
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await ready();
    await page.selectOption("#exampleSelect", "Bedroom");
    await ready();
    await page.click("#resetButton");
    await ready();
    assert.ok(
      await page.evaluate(() => {
        const s = interior.studio,
          bounds = s.focusBounds();
        s.camera.updateMatrixWorld(true);
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              const point = bounds.min.clone().set(x, y, z).project(s.camera);
              if (Math.abs(point.x) > 0.9 || Math.abs(point.y) > 0.9 || Math.abs(point.z) >= 1)
                return false;
            }
          }
        }
        return true;
      }),
      "Default 3D framing includes every room corner with a visible margin",
    );
    const unavailable = await context.newPage();
    await unavailable.setViewportSize({ width: 390, height: 844 });
    await unavailable.route("**/three.webgpu.js", (route) => route.abort());
    await unavailable.goto(url.href, { waitUntil: "domcontentloaded" });
    await unavailable.waitForFunction(() =>
      document.querySelector("#message").textContent.includes("Could not initialize the editor"),
    );
    assert.equal(
      await unavailable.locator("#message").isVisible(),
      true,
      "Dependency failures remain visible on mobile",
    );
    assert.equal(await unavailable.getAttribute("#viewport", "aria-busy"), "false");
    await unavailable.close();
    assert.deepEqual(errors, [], "No JavaScript or GPU validation errors");
    console.log(
      `${fallback ? "WEBGL 2" : "NATIVE WEBGPU"} / ${assetsOnly ? "ASSETS" : "QUALITY + PIXELS + NAVIGATION"} / LIVE EDITS / RECOVERY / PNG / SHARING / MOBILE PASS`,
    );
  } finally {
    await browser.close();
  }
}
module.exports = { run };
