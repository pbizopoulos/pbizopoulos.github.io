/* Serve the editor, then run node prm/validate-assets.cjs [URL] [baseline-script].
 * PLAYWRIGHT_MODULE and CHROME_PATH support an existing browser installation.
 * INTERIOR_SCREENSHOTS optionally saves visual review captures.
 * INTERIOR_CHECK=walls limits the run to wall finish and reference-view checks.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/';
const baseline = process.argv[3];
const output = process.env.INTERIOR_SCREENSHOTS;
const wallOnly = process.env.INTERIOR_CHECK === 'walls';
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
        '  document.querySelector("#renderQuality").value="fast"; globalThis.assetQuality = { THREE, catalog, makeFurniture, material, renderer, editor, sceneRoot, camera, get studio(){return assetStudio}, get program(){return currentProgram}, get warnings(){return findCollisions()}, get ready(){return !!currentProgram&&!sceneBuilding&&compiledSource===editor.state.doc.toString()}, get idle(){return !renderDirty&&performance.now()-lastCameraChange>250&&(document.querySelector("#renderQuality").value==="fast"||detailActive)} };\n  const requestedExample =');
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
    await page.waitForFunction(() => assetQuality.material.wood.map.image.width === 512, null, { timeout: 15000 });
    if (!wallOnly) {
      await page.click('#assetsButton');
      for (const name of ['sink', 'vanity', 'bathroom_vanity', 'kitchenette', 'wardrobe', 'fridge', 'dresser']) {
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
          const ray = new THREE.Raycaster(new THREE.Vector3(name === 'kitchenette' ? -0.48 : 0, name === 'kitchenette' ? 1.4 : h + 2, 0), new THREE.Vector3(0, -1, 0));
          const hit = ray.intersectObject(group, true)[0];
          return { height: h, hit: hit?.point.y, calls: studio.renderer.info.render.calls, triangles: studio.renderer.info.render.triangles };
        }, name);
        if (variant === 'after' && ['sink', 'vanity', 'bathroom_vanity', 'kitchenette'].includes(name)) {
          const limit = name === 'kitchenette' ? 0.85 : data.height - (name === 'bathroom_vanity' ? 0.08 : 0.09);
          assert.ok(data.hit < limit, `${name} must have an unobstructed recessed bowl`);
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
    }
    const frame = await page.evaluate(() => assetQuality.renderer.info.render.frame);
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => assetQuality.renderer.info.render.frame), frame, 'The settled renderer must sleep');
    assert.deepEqual(errors, [], 'Browser errors');
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
      assert.ok(after[name].calls <= before[name].calls + 3, `${name} draw budget`);
      assert.ok(after[name].triangles <= before[name].triangles * 1.06 + 2000, `${name} geometry budget`);
    }
  }
  console.log(wallOnly ? 'WALL FINISH / CONTINUITY / REFERENCE VIEWS / BROWSER / IDLE CHECKS PASS' : 'ASSET GEOMETRY / BASIN DEPTH / SCENES / BROWSER / IDLE / WORKLOAD CHECKS PASS');
})().catch((error) => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
