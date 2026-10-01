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
      page.waitForFunction(() => {
        if (!window.interior?.ready) return false;
        const studio = interior.studio;
        return Math.abs(studio.perspective.aspect - studio.host.clientWidth / studio.host.clientHeight) < 1e-9;
      }, null, {
        timeout: 180000,
      });
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
      const high = await capture("bedroom-high");
      assert.ok(await page.evaluate(() => interior.studio.renderer.getPixelRatio() >= 1.5));
      await page.selectOption("#renderQuality", "fast");
      await ready();
      const fast = await capture("bedroom-fast");
      assert.ok(
        Math.abs(high.luminance - fast.luminance) < 30,
        "PNG quality modes use the same display color space",
      );
      assert.ok(high.corner.every((value, i) => Math.abs(value - fast.corner[i]) <= 2), "Fast PNG exports use the same tone mapping as high quality");
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
    for (const name of ["Bedroom", "Kitchen & dining", "Small apartment"]) {
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
      await page.evaluate(() => {
        const s = interior.studio;
        interior.selectObject(s.model.objects.find((g) => g.userData.token.url));
      });
      assert.equal(
        await page.locator("#selectionCard a").getAttribute("rel"),
        "noopener noreferrer",
      );
      assert.match(await page.locator("#selectionCard a").getAttribute("href"), /^https:\/\//);
      if (!assetsOnly) await capture(name.toLowerCase().replaceAll(/[^a-z]+/g, "-"));
      console.log("Scene / safe product link:", name);
    }
    await page.selectOption("#exampleSelect", "Bedroom");
    await ready();
    const original = await page.evaluate(() => interior.editor.state.doc.toString());
    await page.locator(".cm-content").fill("ROOM broken");
    await page.locator(".cm-content").press("Control+Enter");
    await page.waitForFunction(
      () => document.querySelector("#message").classList.contains("error"),
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
    const unavailable = await context.newPage();
    await unavailable.setViewportSize({ width: 390, height: 844 });
    await unavailable.route("**/three.webgpu.js", (route) => route.abort());
    await unavailable.goto(url.href, { waitUntil: "domcontentloaded" });
    await unavailable.waitForFunction(
      () => document.querySelector("#message").textContent.includes("Could not initialize the editor"),
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
