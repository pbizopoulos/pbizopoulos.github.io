/* Serve the repository, then run node prm/validate-renderer.cjs [URL].
 * PLAYWRIGHT_MODULE / CHROME_PATH select an existing browser installation.
 * INTERIOR_BACKEND=webgl checks WebGPURenderer's WebGL 2 fallback explicitly.
 * INTERIOR_OFFSCREEN=1 validates native GPU pixels without canvas presentation.
 * INTERIOR_SCREENSHOTS optionally saves desktop/mobile visual review captures.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const fallback = process.env.INTERIOR_BACKEND === 'webgl';
  const offscreen = process.env.INTERIOR_OFFSCREEN === '1';
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: ['--no-sandbox', '--enable-gpu', '--enable-unsafe-webgpu', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-gpu-watchdog', '--enable-features=Vulkan', '--use-vulkan=swiftshader', '--disable-vulkan-surface'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    const errors = [];
    page.on('pageerror', (error) => { if (!errors.includes(error.message)) { errors.push(error.message); console.error(error.stack); } });
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('favicon')) { errors.push(message.text()); console.error(message.text()); }
      if (message.type() === 'warning' && /WGSL|invalid|Device Lost/u.test(message.text())) errors.push(message.text());
    });
    await page.route('**/script.js', async (route) => {
      const response = await route.fetch();
      let source = await response.text();
      if (fallback) source = source.replace('forceWebGL: !gpu', 'forceWebGL: true');
      source = source.replace('  const requestedExample =',
        '  globalThis.renderCheck = { THREE, renderer, scene, sceneRoot, editor, camera, material, renderDetail, requestRender, get studio(){return assetStudio}, get ready(){return !!currentProgram&&!sceneBuilding&&compiledSource===editor.state.doc.toString()&&!renderDirty&&!motionResolution&&(document.querySelector("#renderQuality").value==="fast"||detailActive)} };\n  const requestedExample =');
      assert.ok(source.includes('globalThis.renderCheck'), 'Renderer instrumentation anchor');
      await route.fulfill({ response, body: source });
    });
    const ready = () => page.waitForFunction(() => globalThis.renderCheck?.ready, null, { timeout: fallback ? 240000 : 120000 });
    const capture = async (name) => {
      if (process.env.INTERIOR_SCREENSHOTS) {
        fs.mkdirSync(process.env.INTERIOR_SCREENSHOTS, { recursive: true });
        await page.screenshot({ path: path.join(process.env.INTERIOR_SCREENSHOTS, `${name}.png`) });
      }
    };
    await page.goto(process.argv[2] || 'http://localhost:8765/packages/interior-design-editor/?example=Bedroom');
    await ready();
    assert.equal(await page.evaluate(() => renderCheck.renderer.backend.isWebGPUBackend === true), !fallback, 'Actual renderer backend');
    await page.waitForFunction(() => renderCheck.material.wood.map.image.width === 512, null, { timeout: 20000 });
    await ready();
    const verifyImage = async () => {
      const result = await page.evaluate(async (offscreen) => {
        let url;
        if (offscreen) {
          const { THREE, renderer } = renderCheck;
          const size = renderer.getDrawingBufferSize(new THREE.Vector2());
          const target = new THREE.RenderTarget(size.x, size.y, { type: THREE.UnsignedByteType });
          target.texture.colorSpace = THREE.SRGBColorSpace;
          try {
            renderer.setRenderTarget(target); renderCheck.renderDetail();
            const pixels = await renderer.readRenderTargetPixelsAsync(target, 0, 0, size.x, size.y);
            // r181 readback retains WebGPU's 256-byte row padding.
            const packed = new Uint8ClampedArray(size.x * size.y * 4);
            const stride = Math.ceil(size.x * 4 / 256) * 256;
            for (let row = 0; row < size.y; row += 1) packed.set(pixels.subarray(row * stride, row * stride + size.x * 4), row * size.x * 4);
            const canvas = document.createElement('canvas'); canvas.width = size.x; canvas.height = size.y;
            canvas.getContext('2d').putImageData(new ImageData(packed, size.x, size.y), 0, 0);
            url = canvas.toDataURL('image/png');
          } finally {
            renderer.setRenderTarget(null); target.dispose();
          }
        } else {
          renderCheck.renderDetail();
          url = renderCheck.renderer.domElement.toDataURL('image/png');
        }
        const image = new Image(); image.src = url; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
        const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, image.width, image.height).data;
        const colors = new Set(); let opaque = 0;
        for (let index = 0; index < pixels.length; index += 64) {
          colors.add(`${pixels[index]},${pixels[index+1]},${pixels[index+2]}`);
          if (pixels[index+3]) opaque += 1;
        }
        return { colors: colors.size, opaque, bytes: url.length };
      }, offscreen);
      assert.ok(result.opaque > 100 && result.colors > 100 && result.bytes > 10000, `Rendered PNG must contain a scene: ${JSON.stringify(result)}`);
    };
    for (const quality of ['fast', 'balanced', 'high']) {
      await page.selectOption('#renderQuality', quality); await ready();
      await verifyImage(); await capture(`bedroom-${quality}`);
      console.log('Quality', quality);
    }
    for (const name of ['Decor gallery', 'Mediterranean three-level apartment', 'Kitchen & dining']) {
      await page.selectOption('#exampleSelect', name); await ready();
      await verifyImage(); await capture(name.replaceAll(' ', '-'));
      console.log('Scene', name);
    }
    await page.selectOption('#exampleSelect', 'Decor gallery'); await ready();
    const mirrors = await page.evaluate(() => {
      const mirrors = []; renderCheck.sceneRoot.traverse((node) => { if (node.isReflector) mirrors.push(node); });
      return mirrors.length > 0 && mirrors.every((node) => node.visible && node.reflection.target.parent === node);
    });
    assert.ok(mirrors, 'High quality enables owned node reflectors');
    for (let cycle = 0; cycle < 3; cycle += 1) {
      await page.selectOption('#renderQuality', 'fast'); await ready();
      assert.equal(await page.evaluate(() => { let visible = false; renderCheck.sceneRoot.traverse((node) => { if (node.isReflector && node.visible) visible = true; }); return visible; }), false);
      await page.selectOption('#renderQuality', 'high'); await ready();
    }
    const memory = await page.evaluate(() => ({ ...renderCheck.renderer.info.memory }));
    for (let cycle = 0; cycle < 3; cycle += 1) {
      await page.selectOption('#renderQuality', 'fast'); await ready();
      await page.selectOption('#renderQuality', 'high'); await ready();
    }
    assert.deepEqual(await page.evaluate(() => ({ ...renderCheck.renderer.info.memory })), memory, 'Quality switching releases effect textures and geometry');
    console.log('Effect disposal', memory);
    await page.click('#layoutToggle');
    await page.locator('#sunTime').evaluate((input) => { input.value = '00:00'; input.dispatchEvent(new Event('input', { bubbles: true })); }); await ready(); await verifyImage(); await capture('night');
    await page.locator('#sunTime').evaluate((input) => { input.value = '12:00'; input.dispatchEvent(new Event('input', { bubbles: true })); }); await ready();
    // The reference apartment exercises more than four simultaneous fixture lights.
    await page.selectOption('#exampleSelect', 'Mediterranean three-level apartment'); await ready();
    await page.locator('#sunTime').evaluate((input) => { input.value = '00:00'; input.dispatchEvent(new Event('input', { bubbles: true })); }); await ready();
    await verifyImage(); await capture('apartment-night');
    await page.locator('#sunTime').evaluate((input) => { input.value = '12:00'; input.dispatchEvent(new Event('input', { bubbles: true })); }); await ready();
    for (let cycle = 0; cycle < 2; cycle += 1) {
      await page.click('#assetsButton');
      await page.waitForFunction(() => renderCheck.studio?.object, null, { timeout: 120000 });
      assert.equal(await page.evaluate(() => renderCheck.studio.renderer.backend.isWebGPUBackend === true), !fallback);
      await page.fill('#assetSearch', 'arched_mirror'); await page.click('[data-asset="arched_mirror"]');
      await capture(`asset-${cycle}`); await page.click('#closeAssets'); await ready(); await verifyImage();
    }
    const renders = await page.evaluate(() => renderCheck.renderer.info.render.calls);
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => renderCheck.renderer.info.render.calls), renders, 'Settled views stop rendering');
    const download = page.waitForEvent('download'); await page.click('#saveViewButton');
    assert.equal((await download).suggestedFilename(), 'interior-view.png');
    await page.setViewportSize({ width: 390, height: 844 }); await ready(); await verifyImage(); await capture('mobile');
    await page.evaluate(() => renderCheck.editor.dispatch({ changes: { from: 0, to: renderCheck.editor.state.doc.length, insert: 'ROOM invalid' } }));
    await page.waitForFunction(() => document.querySelector('#message').classList.contains('error'));
    await page.selectOption('#exampleSelect', 'Bedroom'); await ready(); await verifyImage();
    assert.deepEqual(errors, [], 'No browser or shader errors');
    console.log(`${fallback ? 'WEBGL 2 FALLBACK' : offscreen ? 'WEBGPU OFFSCREEN' : 'WEBGPU'} / QUALITY / MIRRORS / NIGHT LIGHTING / PNG / ASSETS / IDLE / MOBILE / RECOVERY PASS`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
