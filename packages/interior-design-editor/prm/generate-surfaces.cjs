/* Rebuild floor PBR maps from the attributed CC0 timber scans using the editor's
 * deterministic canvas recipe. Serve the repository first. Dependencies and
 * PLAYWRIGHT_MODULE / CHROME_PATH overrides match generate-thumbnails.cjs.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.route('**/script.js', async route => {
      const response = await route.fetch();
      const source = (await response.text()).replace('  const requestedExample =',
        '  document.querySelector("#renderQuality").value="fast";globalThis.surfaceStudio={material,makePlankSurfaces,get ready(){return !!currentProgram&&!sceneBuilding&&!renderDirty}};\n  const requestedExample =');
      if (!source.includes('globalThis.surfaceStudio')) throw new Error('Surface instrumentation anchor not found');
      await route.fulfill({response,body:source});
    });
    const url = new URL(process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/');
    url.searchParams.set('example', 'Bedroom');
    await page.goto(url.href);
    await page.waitForFunction(() => globalThis.surfaceStudio?.ready &&
      surfaceStudio.material.wood.map.image.width === 512 &&
      surfaceStudio.material.wood.bumpMap.image.width === 512 &&
      surfaceStudio.material.wood.roughnessMap.image.width === 512, null, { timeout: 120000 });
    const maps = await page.evaluate(() => {
      const { material, makePlankSurfaces } = surfaceStudio;
      const surfaces = makePlankSurfaces(material.wood.map.image,material.wood.bumpMap.image,material.wood.roughnessMap.image);
      return Object.entries(surfaces).map(([slot, texture]) => {
        const canvas=document.createElement('canvas');
        canvas.width=slot==='roughnessMap'?256:512;canvas.height=canvas.width;
        canvas.getContext('2d').drawImage(texture.image,0,0,canvas.width,canvas.height);
        return {slot,image:canvas.toDataURL('image/webp',slot==='roughnessMap'?.85:slot==='map'?.9:.92).split(',')[1]};
      });
    });
    const names = {map:'color',bumpMap:'height',roughnessMap:'roughness'};
    for (const {slot,image} of maps) {
      const bytes = Buffer.from(image,'base64');
      fs.writeFileSync(path.join(__dirname,'assets',`oak-planks-${names[slot]}.webp`),bytes);
      process.stdout.write(`${slot}: ${bytes.length} bytes\n`);
    }
  } finally { await browser.close(); }
})().catch(error => {process.stderr.write(error.stack+'\n');process.exitCode=1});
