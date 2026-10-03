/* Serve the repository before running; supports PLAYWRIGHT_MODULE / CHROME_PATH / INTERIOR_BACKEND. */
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    headless: true,
    args: [
      "--no-sandbox",
      "--enable-gpu",
      "--enable-unsafe-webgpu",
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
    ],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1000, height: 700 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const url = new URL(
      process.argv[2] || "http://localhost:8765/packages/interior-design-editor/",
    );
    url.searchParams.set("test", "");
    url.searchParams.set("backend", process.env.INTERIOR_BACKEND || "webgl");
    await page.goto(url.href);
    const ready = () =>
      page.waitForFunction(() => window.interior?.ready, null, { timeout: 120000 });
    await ready();
    await page.selectOption("#renderQuality", "fast");
    await ready();
    const original = await page.evaluate(() => interior.editor.state.doc.toString());
    assert.equal(JSON.parse(original).version, 3);
    assert.equal(await page.locator("#migrateButton").isVisible(), false);
    assert.equal(await page.locator("#freezeButton").isVisible(), true);
    const placements = await page.evaluate(() => interior.program.placements);
    assert.equal(Object.keys(placements).length, 3);
    assert.deepEqual(await page.evaluate(() => interior.program.warnings), []);
    assert.equal(await page.evaluate(() => interior.studio.model.objects.length), 3);
    await page.evaluate(() =>
      interior.selectObject(
        interior.studio.model.objects.find((object) => object.userData.token.id === "readingChair"),
      ),
    );
    assert.match(
      await page.evaluate(() =>
        interior.editor.state.sliceDoc(
          interior.editor.state.selection.main.from,
          interior.editor.state.selection.main.to,
        ),
      ),
      /readingChair/u,
    );
    await page.click("#freezeButton");
    await ready();
    const frozen = await page.evaluate(() => interior.editor.state.doc.toString());
    assert.deepEqual(JSON.parse(frozen).instances.readingChair.placement, placements.readingChair);
    assert.deepEqual(await page.evaluate(() => interior.program.placements), placements);
    await page.locator(".cm-content").press("Control+z");
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), original);
    await page.locator(".cm-content").press("Control+Shift+z");
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), frozen);
    await page.click("#foldButton");
    assert.ok((await page.locator(".cm-foldPlaceholder").count()) > 0);
    await page.click("#foldButton");
    await page.locator(".cm-content").fill(JSON.stringify(JSON.parse(original)));
    await page.click("#formatButton");
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), original);
    const invalid = JSON.parse(original);
    invalid.instances.readingChair.asset = "missing";
    await page.locator(".cm-content").fill(JSON.stringify(invalid, null, 2));
    await page.locator(".cm-content").press("Control+Enter");
    await page.waitForFunction(() => !document.querySelector("#errorLocation").hidden);
    assert.deepEqual(await page.evaluate(() => interior.program.placements), placements);
    await page.click("#errorLocation");
    assert.match(
      await page.evaluate(() =>
        interior.editor.state.sliceDoc(
          interior.editor.state.selection.main.from,
          interior.editor.state.selection.main.to,
        ),
      ),
      /missing/u,
    );
    await page.locator(".cm-content").fill(original);
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    await page.reload();
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), original);
    await page.click("#shareButton");
    await page.waitForFunction(
      () => document.querySelector("#message").textContent === "Share link copied.",
    );
    const shared = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal(new URLSearchParams(new URL(shared).hash.slice(1)).get("scene"), original);
    const sharedUrl = new URL(shared);
    sharedUrl.searchParams.set("test", "");
    sharedUrl.searchParams.set("backend", process.env.INTERIOR_BACKEND || "webgl");
    await page.goto(sharedUrl.href);
    await ready();
    assert.deepEqual(await page.evaluate(() => interior.program.placements), placements);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator("#freezeButton").isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(
      "JSON UI: rendering / manual and automatic placement / source selection / freeze / undo / redo / folding / formatting / diagnostics / saved draft / sharing / mobile PASS",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
