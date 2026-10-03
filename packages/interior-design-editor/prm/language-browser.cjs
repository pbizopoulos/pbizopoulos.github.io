/* Serve the repository before running. Same PLAYWRIGHT_MODULE / CHROME_PATH overrides as browser-test.cjs. */
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
      "--enable-features=Vulkan",
      "--use-vulkan=swiftshader",
      "--disable-vulkan-surface",
    ],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const url = new URL(
      process.argv[2] || "http://localhost:8765/packages/interior-design-editor/",
    );
    url.searchParams.set("test", "");
    url.searchParams.set("example", "Bedroom");
    url.searchParams.set("backend", process.env.INTERIOR_BACKEND || "webgl");
    await page.goto(url.href);
    await page.waitForFunction(() => window.interior, null, { timeout: 180000 });
    await page.selectOption("#renderQuality", "fast");
    const ready = () => page.waitForFunction(() => interior.ready, null, { timeout: 180000 });
    await ready();
    assert.match(await page.evaluate(() => interior.editor.state.doc.toString()), /^DESIGN 2/u);
    const original = await page.evaluate(() => interior.legacyExamples.Bedroom);
    await page.locator(".cm-content").fill(original);
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    await page.click("#migrateButton");
    await ready();
    const modern = await page.evaluate(() => interior.editor.state.doc.toString());
    assert.equal(modern, await page.evaluate(() => interior.examples.Bedroom));
    await page.locator(".cm-content").press("Control+z");
    await ready();
    assert.equal(
      await page.evaluate(() => interior.editor.state.doc.toString()),
      original,
      "Upgrade is one undoable action",
    );
    await page.locator(".cm-content").press("Control+Shift+z");
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), modern);
    await page.click("#foldButton");
    assert.ok((await page.locator(".cm-foldPlaceholder").count()) > 0, "Room blocks fold");
    await page.click("#foldButton");
    await page.locator(".cm-content").fill(modern.replace("  WALLS all", "       WALLS all"));
    await page.click("#formatButton");
    await ready();
    assert.equal(await page.evaluate(() => interior.editor.state.doc.toString()), modern);
    await page.evaluate(() =>
      interior.selectObject(
        interior.studio.model.objects.find((g) => g.userData.token.name === "bed"),
      ),
    );
    assert.match(
      await page.evaluate(() =>
        interior.editor.state.sliceDoc(
          interior.editor.state.selection.main.from,
          interior.editor.state.selection.main.to,
        ),
      ),
      /^bed~north<https:/u,
    );
    await page.locator(".cm-content").fill(modern.replace("WALLS all", "WALLS invalid"));
    await page.locator(".cm-content").press("Control+Enter");
    await page.waitForFunction(() => !document.getElementById("errorLocation").hidden);
    await page.click("#errorLocation");
    assert.equal(
      (
        await page.evaluate(() =>
          interior.editor.state.sliceDoc(
            interior.editor.state.selection.main.from,
            interior.editor.state.selection.main.to,
          ),
        )
      ).trim(),
      "WALLS invalid",
    );
    assert.equal(
      await page.evaluate(() => interior.program.rooms.length),
      1,
      "Last valid scene survives the error",
    );
    await page.locator(".cm-content").fill(modern);
    await page.locator(".cm-content").press("Control+Enter");
    await ready();
    await page.click("#shareButton");
    await page.waitForFunction(
      () => document.getElementById("message").textContent === "Share link copied.",
    );
    const shared = new URL(await page.evaluate(() => navigator.clipboard.readText()));
    assert.equal(new URLSearchParams(shared.hash.slice(1)).get("scene"), modern);
    assert.equal(await page.evaluate(() => localStorage.getItem("interior-studio-draft")), modern);
    shared.searchParams.set("test", "");
    shared.searchParams.set("backend", process.env.INTERIOR_BACKEND || "webgl");
    await page.goto(shared.href);
    await page.waitForFunction(() => window.interior, null, { timeout: 180000 });
    assert.equal(
      await page.evaluate(() => interior.editor.state.doc.toString()),
      modern,
      "Shared source reloads intact",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator("#formatButton").isVisible(), true);
    assert.equal(await page.locator(".language-toolbar a").isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(
      "DESIGN 2 UI: migration / undo / redo / folding / formatting / source selection / diagnostics / sharing / saved draft / mobile PASS",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
