/* Serve the editor, then run node prm/validate-assets.cjs [URL].
 * PLAYWRIGHT_MODULE / CHROME_PATH select an existing browser installation.
 * INTERIOR_BACKEND=webgl checks the renderer's fallback.
 */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: ['--no-sandbox', '--enable-unsafe-webgpu', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    const errors = [], removedRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => { if (request.url().includes('/prm/assets/')) removedRequests.push(request.url()); });
    await page.route('**/script.js', async (route) => {
      const response = await route.fetch();
      let source = await response.text();
      if (process.env.INTERIOR_BACKEND === 'webgl') source = source.replace('forceWebGL: !gpu', 'forceWebGL: true');
      source = source.replace('  const requestedExample =',
        '  document.querySelector("#renderQuality").value="fast"; globalThis.assetCheck={parseProgram,productUrl,examples,editor,sceneRoot,indicateGroup,clearHover,findCollisions,get studio(){return assetStudio},get ready(){return !!currentProgram&&!sceneBuilding&&compiledSource===editor.state.doc.toString()&&!renderDirty}};\n  const requestedExample =');
      assert.ok(source.includes('globalThis.assetCheck'), 'Instrumentation anchor');
      await route.fulfill({ response, body: source });
    });
    const ready = () => page.waitForFunction(() => globalThis.assetCheck?.ready, null, { timeout: 120000 });
    await page.goto(process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/');
    await ready();
    assert.equal(await page.inputValue('#exampleSelect'), 'Small apartment');
    assert.deepEqual(await page.locator('#exampleSelect option').evaluateAll((options) => options.map((option) => option.value)), ['Bedroom', 'Kitchen & dining', 'Small apartment', 'custom']);
    for (const name of ['Bedroom', 'Kitchen & dining', 'Small apartment']) {
      await page.selectOption('#exampleSelect', name); await ready();
      assert.deepEqual(await page.evaluate(() => assetCheck.findCollisions()), [], `${name} has no furniture overlaps`);
      const urls = await page.evaluate(() => {
        const groups = []; assetCheck.sceneRoot.traverse((group) => { if (group.userData.token?.url) groups.push(group); });
        const group = groups[0]; assetCheck.clearHover(); assetCheck.indicateGroup(group);
        return groups.map((group) => group.userData.token.url);
      });
      assert.ok(urls.length > 0, `${name} contains linked furniture`);
      assert.equal(await page.locator('#selectionCard a').getAttribute('href'), urls[0]);
      assert.equal(await page.locator('#selectionCard a').getAttribute('rel'), 'noopener noreferrer');
      await page.evaluate(() => {
        let unlinked; assetCheck.sceneRoot.traverse((group) => { const token = group.userData.token; if (!unlinked && token && !token.url && !['room', 'balcony'].includes(token.name)) unlinked = group; });
        assetCheck.clearHover(); assetCheck.indicateGroup(unlinked);
      });
      assert.match(await page.locator('#selectionCard').textContent(), /No product link/);
      console.log('Example / links / spacing:', name);
    }
    assert.equal(await page.evaluate(() => ['javascript:alert(1)', 'https://user:password@example.com/'].every((url) => { try { assetCheck.productUrl(url, 1); return false; } catch { return true; } })), true, 'Unsafe product URLs are rejected');
    await page.click('#assetsButton');
    await page.fill('#assetSearch', 'bed');
    await page.click('[data-asset="bed"]');
    await page.waitForFunction(() => assetCheck.studio?.object, null, { timeout: 120000 });
    assert.equal(await page.locator('#assetName').textContent(), 'bed');
    await page.click('#closeAssets'); await ready();
    assert.deepEqual(removedRequests, [], 'No requests for deleted assets');
    assert.deepEqual(errors, [], 'No browser errors');
    console.log('EXAMPLES / PRODUCT LINKS / PROCEDURAL ASSET PREVIEW PASS');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
