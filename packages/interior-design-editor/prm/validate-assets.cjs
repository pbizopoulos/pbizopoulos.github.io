/* Serve the editor, then run node prm/validate-assets.cjs [URL] [baseline-script].
 * PLAYWRIGHT_MODULE and CHROME_PATH support an existing browser installation.
 * INTERIOR_SCREENSHOTS optionally saves visual review captures.
 * INTERIOR_CHECK=walls limits the run to wall finish and reference-view checks.
 * INTERIOR_CHECK=exposure compares scene workload and checks camera controls.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/';
const baseline = process.argv[3];
const output = process.env.INTERIOR_SCREENSHOTS;
const wallOnly = process.env.INTERIOR_CHECK === 'walls';
const exposureOnly = process.env.INTERIOR_CHECK === 'exposure';
const additionalSceneDrawAllowance = 6;
const sceneTriangleRatioLimit = 1.06;
const additionalSceneTriangleAllowance = 2000;
const scenes = wallOnly ? ['Mediterranean three-level apartment'] : ['Warm modern apartment', 'Mediterranean three-level apartment', 'Kitchen & dining'];
if (output) fs.mkdirSync(output, { recursive: true });

async function check(variant) {
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('favicon')) errors.push(message.text());
    });
    await page.route('**/script.js', async (route) => {
      const response = await route.fetch();
      const source = variant === 'before' ? fs.readFileSync(baseline, 'utf8') : await response.text();
      const body = source.replace('  const requestedExample =',
        '  document.querySelector("#renderQuality").value="fast"; globalThis.assetQuality = { THREE, catalog, makeFurniture, material, renderer, editor, sceneRoot, camera, get studio(){return assetStudio}, get program(){return currentProgram}, get warnings(){return findCollisions()}, get ready(){return !!currentProgram&&!sceneBuilding&&compiledSource===editor.state.doc.toString()}, get idle(){return (typeof indoorExposureAdjustment==="undefined"||indoorExposureAdjustment===desiredIndoorExposureAdjustment)&&!renderDirty&&performance.now()-lastCameraChange>250&&(document.querySelector("#renderQuality").value==="fast"||detailActive)} };\n  const requestedExample =');
      assert.ok(body.includes('globalThis.assetQuality'), 'The editor instrumentation anchor must exist');
      await route.fulfill({ response, body });
    });
    const ready = () => page.waitForFunction(() => globalThis.assetQuality?.ready && assetQuality.idle && document.querySelector('#viewport').getAttribute('aria-busy') === 'false', null, { timeout: 120000 });
    const capture = async (name) => {
      if (output) await page.screenshot({ path: path.join(output, `${variant}-${name}.png`) });
    };
    const url = new URL(baseURL);
    url.searchParams.set('example', wallOnly ? 'Mediterranean three-level apartment' : 'Bedroom');
    await page.goto(url.href);
    await ready();
    await page.evaluate(() => {
      globalThis.wallTileDisposals = 0;
      assetQuality.material.wallTile?.addEventListener('dispose', () => { globalThis.wallTileDisposals += 1; });
    });
    await page.waitForFunction(() => assetQuality.material.wood.map.image.width === 512, null, { timeout: 15000 });
    if (!wallOnly && !exposureOnly) {
      await page.click('#assetsButton');
      for (const name of ['sink', 'vanity', 'bathroom_vanity', 'kitchenette', 'wardrobe', 'fridge', 'dresser', 'washing_machine', 'shower', 'frameless_shower', 'toilet']) {
        await page.fill('#assetSearch', name);
        await page.click(`[data-asset="${name}"]`);
        const data = await page.evaluate((name) => {
          const { THREE, catalog, makeFurniture, studio } = assetQuality;
          const [w, d, h] = catalog[name];
          const group = makeFurniture({ name, dimensions: [w, d, h], yaw: 0, room: 'qa', line: 1 }, false);
          group.updateMatrixWorld(true);
          group.traverse((node) => {
            for (const attribute of Object.values(node.geometry?.attributes || {})) {
              if (!attribute.array.every(Number.isFinite)) throw new Error(`${name} has invalid geometry`);
            }
          });
          const ray = new THREE.Raycaster(new THREE.Vector3(name === 'kitchenette' ? -0.48 : 0, name === 'kitchenette' ? 1.4 : h + 2, name === 'toilet' ? 0.06 : 0), new THREE.Vector3(0, -1, 0));
          const hit = ray.intersectObject(group, true)[0];
          const panes = [];
          if (['shower', 'frameless_shower'].includes(name)) group.traverse((node) => {
            if (node.material?.transparent) panes.push({ triangles: node.geometry.index.count / 3, opacity: node.material.opacity * (node.geometry.attributes.color?.itemSize === 4 ? node.geometry.attributes.color.getW(5) : 1), edgeOpacity: node.material.opacity * (node.geometry.attributes.color?.itemSize === 4 ? node.geometry.attributes.color.getW(0) : 1), doubleSided: node.material.side === THREE.DoubleSide, singlePass: node.material.forceSinglePass, shadow: node.castShadow });
          });
          const doorRay = name === 'washing_machine' ? new THREE.Raycaster(new THREE.Vector3(0, h * 0.435, 1), new THREE.Vector3(0, 0, -1)) : undefined;
          const opaque = doorRay?.intersectObject(group, true).find((entry) => !entry.object.material.transparent);
          const bounds = ['washing_machine', 'toilet'].includes(name) ? new THREE.Box3().setFromObject(group) : undefined;
          return { height: h, hit: hit?.point.y, panes: panes.length ? panes : undefined, cavity: opaque?.point.z, bounds: bounds ? { min: bounds.min.toArray(), max: bounds.max.toArray() } : undefined, calls: studio.renderer.info.render.calls, triangles: studio.renderer.info.render.triangles };
        }, name);
        if (variant === 'after' && ['sink', 'vanity', 'bathroom_vanity', 'kitchenette'].includes(name)) {
          const limit = name === 'kitchenette' ? 0.85 : data.height - (name === 'bathroom_vanity' ? 0.08 : 0.09);
          assert.ok(data.hit < limit, `${name} must have an unobstructed recessed bowl`);
        }
        if (variant === 'after' && ['shower', 'frameless_shower'].includes(name)) {
          assert.equal(data.panes.length, 3, 'The enclosure must have a front and two side panes');
          for (const pane of data.panes) {
            assert.equal(pane.triangles, 18, 'Glass must use a single flat grid per pane');
            assert.ok(pane.edgeOpacity > pane.opacity, 'Exposed glass edges must remain legible');
            assert.ok(pane.opacity < 0.2, 'Enclosure glass must preserve interior clarity');
            assert.equal(pane.doubleSided, true, 'Glass must be visible from both sides');
            assert.equal(pane.singlePass, true, 'Flat glass must render in one pass');
            assert.equal(pane.shadow, false, 'Clear glass must not cast an opaque shadow');
          }
        }
        if (variant === 'after' && name === 'washing_machine') {
          assert.ok(data.cavity < 0.2, 'The washer door must reveal its recessed drum');
          assert.ok(data.bounds.min[1] >= -0.001 && data.bounds.min[1] <= 0.001, 'Washer feet must meet the floor');
          assert.ok(data.bounds.max[2] <= 0.325, 'The washer door must fit its declared depth');
          assert.ok(data.bounds.max[1] <= 0.855, 'The washer must fit its declared height');
        }
        if (variant === 'after' && name === 'toilet') {
          assert.ok(data.hit < 0.3, 'The toilet seat must leave its recessed bowl open');
          assert.ok(Math.abs(data.bounds.min[1]) < 0.001, 'The toilet pedestal must meet the floor');
          assert.ok(data.bounds.max[1] <= data.height + 0.001, 'The cistern must fit its declared height');
          assert.ok(Math.max(Math.abs(data.bounds.min[0]), Math.abs(data.bounds.max[0])) <= 0.216, 'The toilet must fit its declared width');
          assert.ok(Math.max(Math.abs(data.bounds.min[2]), Math.abs(data.bounds.max[2])) <= 0.326, 'The toilet must fit its declared depth');
        }
        console.log(variant, name, JSON.stringify(data));
        await capture(name);
      }
      await page.click('#closeAssets');
    }
    await page.click('#layoutToggle');
    const workload = {};
    for (const name of scenes) {
      if (await page.inputValue('#exampleSelect') !== name) await page.selectOption('#exampleSelect', name);
      await ready();
      const data = await page.evaluate(() => ({ calls: assetQuality.renderer.info.render.calls, triangles: assetQuality.renderer.info.render.triangles, warnings: assetQuality.warnings }));
      assert.deepEqual(data.warnings, [], `${name} placement warnings`);
      workload[name] = data;
      console.log(variant, name, JSON.stringify(data));
    }
    if (variant === 'after') {
      if (wallOnly) {
        await page.selectOption('#exampleSelect', 'Bedroom');
        await ready();
      }
      if (await page.inputValue('#exampleSelect') !== 'Mediterranean three-level apartment') await page.selectOption('#exampleSelect', 'Mediterranean three-level apartment');
      await ready();
      const tiles = await page.evaluate(() => {
        const { material, sceneRoot, THREE } = assetQuality;
        if (!material.wallTile) return undefined;
        const finish = material.wallTile, coordinates = new Map();
        let shared = 0, mismatch = 0, walls = 0;
        sceneRoot.updateMatrixWorld(true);
        sceneRoot.traverse((mesh) => {
          const finishes = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          if (!finishes.some((item) => item?.map === finish.map)) return;
          walls += 1;
          const geometry = mesh.geometry, { position, normal, uv } = geometry.attributes;
          const groups = geometry.groups.length ? geometry.groups : [{ start: 0, count: geometry.index.count, materialIndex: 0 }];
          for (const group of groups) {
            if (Array.isArray(mesh.material) && finishes[group.materialIndex]?.map !== finish.map) continue;
            for (let i = group.start; i < group.start + group.count; i += 1) {
              const vertex = geometry.index.getX(i);
              if (Math.abs(normal.getY(vertex)) > 0.7) continue;
              const point = new THREE.Vector3().fromBufferAttribute(position, vertex).applyMatrix4(mesh.matrixWorld);
              const key = [Math.abs(normal.getX(vertex)) > 0.7 ? 'x' : 'z', ...point.toArray().map((v) => v.toFixed(4))].join(':');
              const current = { owner: mesh.uuid, u: uv.getX(vertex), v: uv.getY(vertex) };
              const previous = coordinates.get(key);
              if (previous && previous.owner !== current.owner) {
                shared += 1;
                if (Math.abs(previous.u-current.u)>0.0001 || Math.abs(previous.v-current.v)>0.0001) mismatch += 1;
              } else if (!previous) coordinates.set(key, current);
            }
          }
        });
        return { walls, shared, mismatch, width: finish.userData.textureScale * finish.userData.textureAspect / 4, height: finish.userData.textureScale / 4, textureSize: finish.map.image.width };
      });
      if (tiles) {
        console.log('WALL TILE CONTINUITY', JSON.stringify(tiles));
        assert.ok(tiles.walls > 0 && tiles.shared > 0, 'Wall sections must meet');
        assert.equal(tiles.mismatch, 0, 'Tile seams must align across wall sections');
        assert.equal(tiles.width, 0.6);
        assert.equal(tiles.height, 1.2);
        assert.equal(tiles.textureSize, 256);
      }
      for (const view of ['2', '5']) {
        await page.selectOption('#photoView', view);
        await page.selectOption('#renderQuality', 'balanced');
        await ready();
        await capture(`reference-${view}`);
      }
      if (await page.locator('#sunExposureMode').count()) {
        const manualEV = Number(await page.inputValue('#sunExposure'));
        const baseExposure = 1.05 * 2 ** manualEV;
        const adaptiveExposure = await page.evaluate(() => assetQuality.renderer.toneMappingExposure);
        assert.ok(adaptiveExposure > baseExposure + 0.1, 'An enclosed daytime bathroom should adapt');
        assert.ok(adaptiveExposure <= baseExposure * 2 ** 0.85 + 0.001, 'Adaptation must stay within its exposure budget');
        await page.click('.scene-options > summary');
        await page.click('.sun-panel summary');
        await page.selectOption('#sunExposureMode', 'fixed');
        await ready();
        const fixedExposure = await page.evaluate(() => assetQuality.renderer.toneMappingExposure);
        assert.ok(Math.abs(fixedExposure - baseExposure) < 0.0001, 'Fixed exposure must restore the manual value');
        await page.click('.sun-panel summary');
        await capture('exposure-fixed');
        await page.click('.sun-panel summary');
        const exposureRebuildsShadows = await page.evaluate((value) => {
          const input = document.querySelector('#sunExposure');
          input.value = String(value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          return assetQuality.renderer.shadowMap.needsUpdate;
        }, manualEV + 1);
        assert.equal(exposureRebuildsShadows, false, 'Exposure changes must retain cached shadows');
        await ready();
        assert.ok(Math.abs(await page.evaluate(() => assetQuality.renderer.toneMappingExposure) - baseExposure * 2) < 0.0001, 'One EV must double exposure');
        await page.fill('#sunExposure', '');
        await ready();
        assert.ok(Number.isFinite(await page.evaluate(() => assetQuality.renderer.toneMappingExposure)), 'Incomplete exposure input must preserve a finite render');
        await page.fill('#sunExposure', String(manualEV));
        await page.selectOption('#sunExposureMode', 'adaptive');
        await ready();
        await capture('exposure-controls');
        await page.click('.scene-options > summary');
        await page.click('#resetButton');
        await ready();
        assert.ok(Math.abs(await page.evaluate(() => assetQuality.renderer.toneMappingExposure) - baseExposure) < 0.0001, '3D overview must use fixed exposure');
        console.log('CAMERA EXPOSURE', JSON.stringify({ adaptiveExposure, fixedExposure, manualEV }));
      }
    }
    const frame = await page.evaluate(() => assetQuality.renderer.info.render.frame);
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => assetQuality.renderer.info.render.frame), frame, 'The settled renderer must sleep');
    assert.deepEqual(errors, [], 'Browser errors');
    if (variant === 'after') assert.equal(await page.evaluate(() => wallTileDisposals), 0, 'Shared wall finishes must survive scene rebuilds');
    return workload;
  } finally {
    await browser.close();
  }
}

(async () => {
  const before = baseline ? await check('before') : undefined;
  const after = await check('after');
  if (before) {
    for (const name of scenes) {
      assert.ok(after[name].calls <= before[name].calls + additionalSceneDrawAllowance, `${name} draw budget`);
      assert.ok(after[name].triangles <= before[name].triangles * sceneTriangleRatioLimit + additionalSceneTriangleAllowance, `${name} geometry budget`);
    }
  }
  console.log(wallOnly || exposureOnly ? 'SCENES / WALL CONTINUITY / CAMERA EXPOSURE / BROWSER / IDLE / WORKLOAD CHECKS PASS' : 'ASSET GEOMETRY / BASIN DEPTH / SCENES / BROWSER / IDLE / WORKLOAD CHECKS PASS');
})().catch((error) => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
