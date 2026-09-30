/* Rebuild the static catalog atlas from the editor's own procedural models.
 * npm install --prefix /tmp/interior-thumbnails playwright
 * NODE_PATH=/tmp/interior-thumbnails/node_modules node prm/generate-thumbnails.cjs
 * Serve the editor first; pass its URL as the first argument if needed.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    await page.route('**/script.js', async (route) => {
      const response = await route.fetch();
      const source = (await response.text()).replace(
        '  const requestedExample =',
        '  document.querySelector("#renderQuality").value="fast"; globalThis.catalogStudio = { catalog, previewAsset, material, get studio(){return assetStudio}, get ready(){return !sceneBuilding&&!renderDirty&&!!currentProgram} };\n  const requestedExample =',
      );
      if (!source.includes('globalThis.catalogStudio')) throw new Error('Catalog instrumentation anchor was not found');
      await route.fulfill({ response, body: source });
    });
    const url = new URL(process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/');
    url.searchParams.set('example', 'Bedroom');
    await page.goto(url.href);
    await page.waitForFunction(() => globalThis.catalogStudio?.ready, null, { timeout: 120000 });
    await page.waitForFunction(() => catalogStudio.material.wood.map.image.width === 512, null, { timeout: 20000 });
    await page.click('#assetsButton');
    const names = await page.evaluate(() => Object.keys(catalogStudio.catalog).sort());
    const columns = 12, rows = Math.ceil(names.length / columns);
    await page.evaluate(({ columns, rows }) => {
      const atlas = document.createElement('canvas');
      atlas.width = columns * 160; atlas.height = rows * 128;
      globalThis.thumbnailAtlas = atlas;
      const context = atlas.getContext('2d');
      context.fillStyle = '#e9ede6'; context.fillRect(0, 0, atlas.width, atlas.height);
    }, { columns, rows });
    for (const [index, name] of names.entries()) {
      await page.evaluate(({ index, name, columns }) => {
        catalogStudio.previewAsset(name);
        const { renderer, camera, scene } = catalogStudio.studio;
        renderer.setPixelRatio(1); renderer.setSize(160, 128, false);
        camera.aspect = 1.25; camera.updateProjectionMatrix();
        renderer.render(scene, camera);
        thumbnailAtlas.getContext('2d').drawImage(renderer.domElement, (index % columns) * 160, Math.floor(index / columns) * 128);
      }, { index, name, columns });
    }
    const image = await page.evaluate(() => thumbnailAtlas.toDataURL('image/webp', 0.84).split(',')[1]);
    const output = path.join(__dirname, 'assets');
    fs.writeFileSync(path.join(output, 'furniture-thumbnails.webp'), Buffer.from(image, 'base64'));
    fs.writeFileSync(path.join(output, 'furniture-thumbnails.json'), JSON.stringify({ columns, rows, names }, null, 2) + '\n');
    process.stdout.write(`Generated ${names.length} thumbnails in one WebP atlas.\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
