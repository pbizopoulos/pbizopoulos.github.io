/* Serve the editor, then run node prm/validate-assets.cjs [URL] [baseline-script].
 * PLAYWRIGHT_MODULE and CHROME_PATH support an existing browser installation.
 * INTERIOR_SCREENSHOTS optionally saves visual review captures.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/';
const baseline = process.argv[3];
const output = process.env.INTERIOR_SCREENSHOTS;
const scenes = ['Warm modern apartment', 'Mediterranean three-level apartment', 'Kitchen & dining'];
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
    url.searchParams.set('example', 'Bedroom');
    await page.goto(url.href);
    await ready();
    await page.waitForFunction(() => assetQuality.material.wood.map.image.width === 512, null, { timeout: 15000 });
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
    await page.click('#layoutToggle');
    const workload = {};
    for (const name of scenes) {
      await page.selectOption('#exampleSelect', name);
      await ready();
      const data = await page.evaluate(() => ({ calls: assetQuality.renderer.info.render.calls, triangles: assetQuality.renderer.info.render.triangles, warnings: assetQuality.warnings }));
      assert.deepEqual(data.warnings, [], `${name} placement warnings`);
      workload[name] = data;
      console.log(variant, name, JSON.stringify(data));
    }
    if (variant === 'after') {
      await page.selectOption('#exampleSelect', 'Mediterranean three-level apartment');
      await ready();
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
  console.log('ASSET GEOMETRY / BASIN DEPTH / SCENES / BROWSER / IDLE / WORKLOAD CHECKS PASS');
})().catch((error) => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
