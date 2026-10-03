/* Reproduce metrics, scene-equivalence evidence and actual renderer/code comparisons.
 * node prm/language-review.mjs [--render] [http://localhost:8765/packages/interior-design-editor/]
 * For --render: set PLAYWRIGHT_MODULE and optionally CHROME_PATH / INTERIOR_BACKEND.
 */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
const require = createRequire(import.meta.url);
const root = new URL("./language-review/", import.meta.url);
mkdirSync(root, { recursive: true });
const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const core = new Function(
  source.split("const initializeStudio =")[0] + "\nreturn createLayoutCore();",
)();
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function metrics(source) {
  const statements = source.split("\n").filter((line) => line.trim());
  return {
    bytes: Buffer.byteLength(source),
    characters: source.length,
    lines: source.split("\n").length,
    nonblankLines: statements.length,
    emptyCells: (source.match(/(?:^|[\s|])\.(?=[\s|]|$)/gu) || []).length,
    inlineUrls: (source.match(/<https?:\/\/[^>]+>/gu) || []).length,
  };
}
function timing(source) {
  for (let i = 0; i < 15; i++) core.parseProgram(source);
  const values = Array.from({ length: 100 }, () => {
    const start = performance.now();
    core.parseProgram(source);
    return performance.now() - start;
  }).sort((a, b) => a - b);
  return { medianMs: +values[50].toFixed(3), p95Ms: +values[95].toFixed(3) };
}
const results = [];
for (const [name, legacy] of Object.entries(core.examples)) {
  if (process.argv.includes("--report-images")) continue;
  const modern = core.migrateDesign(legacy),
    slug = name
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/gu, "-")
      .replace(/-$/u, "");
  writeFileSync(new URL(`${slug}-v1.design`, root), legacy + "\n");
  writeFileSync(new URL(`${slug}-v2.design`, root), modern + "\n");
  const before = metrics(legacy),
    after = metrics(modern);
  assert.ok(after.bytes < before.bytes, `${name} must be smaller`);
  results.push({
    name,
    slug,
    before,
    after,
    reductionPercent: +(100 * (1 - after.bytes / before.bytes)).toFixed(1),
    parseV1: timing(legacy),
    parseV2: timing(modern),
  });
}
const css = `*{box-sizing:border-box}body{margin:0;background:#f1eee7;color:#292d2c;font:16px system-ui}main{max-width:1920px;margin:auto;padding:40px}h1{font-size:36px;margin:0 0 8px}h2{font-size:26px;margin:0}p{line-height:1.6}a{color:#365f50}section{margin:38px 0 64px}.meta{color:#58665d}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}.panel{background:#fff;border:1px solid #dcd8ce;border-radius:12px;padding:20px;min-width:0}.panel h3{margin:0 0 14px}.panel img{width:100%;display:block;background:#eae8df;border-radius:8px}.code-view{display:grid;grid-template-columns:1.1fr 1fr;gap:20px;align-items:start;margin-top:20px}pre{margin:0;font:13px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;background:#f8f8f3;padding:20px;border-radius:8px}table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:12px;border-bottom:1px solid #dcd8ce}details{margin-top:20px}summary{cursor:pointer;padding:12px;background:#e8e6de}.caption{font-size:13px;color:#5e665f}.badge{background:#dceadd;color:#31583c;padding:6px 12px;border-radius:20px;font-size:14px} @media(max-width:900px){.comparison,.code-view{grid-template-columns:1fr}main{padding:18px}}`;
const pages = [];
const url =
  process.argv.find((arg) => /^https?:/u.test(arg)) ||
  "http://localhost:8765/packages/interior-design-editor/";
if (process.argv.includes("--render")) {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
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
    const page = await browser.newPage({ viewport: { width: 1400, height: 980 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const target = new URL(url);
    target.searchParams.set("test", "");
    target.searchParams.set("example", "Bedroom");
    target.searchParams.set("backend", process.env.INTERIOR_BACKEND || "webgl");
    await page.goto(target.href);
    const ready = () =>
      page.waitForFunction(() => window.interior?.ready, null, { timeout: 240000 });
    await ready();
    for (const item of results) {
      let before;
      for (const version of [1, 2]) {
        const code =
          version === 1 ? core.examples[item.name] : core.migrateDesign(core.examples[item.name]);
        const snapshot = await page.evaluate(
          async ({ code, name }) => {
            const { editor, studio } = interior;
            editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: code } });
            await interior.compile(true);
            studio.setQuality("balanced");
            if (name === "Apartment") studio.options.room = "balcony";
            studio.setView("3d");
            studio.render();
            return studio.model.objects.map((group) => {
              group.updateWorldMatrix(true, false);
              return {
                name: group.userData.token.name,
                dimensions: group.userData.token.dimensions,
                url: group.userData.token.url,
                matrix: group.matrixWorld.toArray(),
              };
            });
          },
          { code, name: item.name },
        );
        await ready();
        const pixels = await page.evaluate(async () => {
          const blob = await interior.studio.capture(),
            bitmap = await createImageBitmap(blob),
            canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
          return { url: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
        });
        writeFileSync(
          new URL(`${item.slug}-v${version}.png`, root),
          Buffer.from(pixels.url.split(",")[1], "base64"),
        );
        if (version === 1) before = { snapshot, pixels };
        else {
          assert.equal(snapshot.length, before.snapshot.length);
          let maxTransformDifference = 0;
          for (let i = 0; i < snapshot.length; i++) {
            assert.equal(snapshot[i].name, before.snapshot[i].name);
            assert.equal(snapshot[i].url, before.snapshot[i].url);
            for (let j = 0; j < 16; j++)
              maxTransformDifference = Math.max(
                maxTransformDifference,
                Math.abs(snapshot[i].matrix[j] - before.snapshot[i].matrix[j]),
              );
          }
          assert.ok(maxTransformDifference < 1e-9);
          const difference = await page.evaluate(
            async ({ a, b }) => {
              const load = async (url) => {
                const img = await createImageBitmap(await (await fetch(url)).blob()),
                  c = document.createElement("canvas");
                c.width = img.width;
                c.height = img.height;
                const ctx = c.getContext("2d");
                ctx.drawImage(img, 0, 0);
                img.close();
                return ctx.getImageData(0, 0, c.width, c.height).data;
              };
              const x = await load(a),
                y = await load(b);
              let changed = 0,
                total = 0,
                max = 0;
              for (let i = 0; i < x.length; i += 4) {
                let different = false;
                for (let c = 0; c < 3; c++) {
                  const d = Math.abs(x[i + c] - y[i + c]);
                  total += d;
                  max = Math.max(max, d);
                  if (d > 0) different = true;
                }
                if (different) changed++;
              }
              return {
                changedPixels: changed,
                totalPixels: x.length / 4,
                meanChannelDifference: total / ((x.length / 4) * 3),
                maxChannelDifference: max,
              };
            },
            { a: before.pixels.url, b: pixels.url },
          );
          item.render = {
            backend: await page.evaluate(() => interior.studio.backend),
            objects: snapshot.length,
            maxTransformDifference,
            ...difference,
          };
          assert.ok(
            difference.meanChannelDifference < 0.1,
            `${item.name}: unexpected visual change`,
          );
        }
      }
      console.log(
        `${item.name}: rendered ${item.render.objects} objects, mean pixel difference ${item.render.meanChannelDifference}`,
      );
    }
    assert.deepEqual(errors, []);
    await page.close();
    buildReports();
    const report = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    for (const item of results)
      for (const kind of ["", "-preview"]) {
        await report.goto(new URL(`prm/language-review/${item.slug}${kind}.html`, url).href);
        await report
          .locator("img")
          .evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
        await report.screenshot({
          path: fileURLToPath(
            new URL(`${item.slug}${kind ? "-source-preview" : "-code-and-render"}.png`, root),
          ),
          fullPage: true,
        });
      }
    await browser.close();
  } catch (error) {
    await browser.close();
    throw error;
  }
} else {
  if (process.argv.includes("--report-images")) {
    results.push(...JSON.parse(readFileSync(new URL("metrics.json", root), "utf8")).examples);
    for (const item of results) {
      assert.equal(
        readFileSync(new URL(`${item.slug}-v1.design`, root), "utf8"),
        core.examples[item.name] + "\n",
        "Saved render source has changed; run --render",
      );
      assert.equal(
        readFileSync(new URL(`${item.slug}-v2.design`, root), "utf8"),
        core.migrateDesign(core.examples[item.name]) + "\n",
        "Migrated render source has changed; run --render",
      );
    }
  }
  buildReports();
}
if (process.argv.includes("--report-images")) {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    for (const item of results)
      for (const kind of ["", "-preview"]) {
        await page.goto(new URL(`prm/language-review/${item.slug}${kind}.html`, url).href);
        await page
          .locator("img")
          .evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
        await page.screenshot({
          path: fileURLToPath(
            new URL(`${item.slug}${kind ? "-source-preview" : "-code-and-render"}.png`, root),
          ),
          fullPage: true,
        });
      }
  } finally {
    await browser.close();
  }
}
function excerpt(source, version, name) {
  if (name !== "Apartment") return source;
  const lines = source.split("\n");
  if (version === 2) {
    const start = lines.findIndex((line) => line.startsWith("BALCONY balcony ")),
      end = lines.indexOf("END", start);
    return lines.slice(start, end + 1).join("\n");
  }
  const roomStart = lines.findIndex((line) => line.startsWith("BALCONY balcony ")),
    roomEnd = lines.findIndex((line, index) => index > roomStart && line.startsWith("LAYOUT ")),
    layoutStart = lines.indexOf("LAYOUT balcony"),
    layoutEnd = lines.indexOf("END", layoutStart);
  return [...lines.slice(roomStart, roomEnd), ...lines.slice(layoutStart, layoutEnd + 1)].join(
    "\n",
  );
}
function buildReports() {
  writeFileSync(
    new URL("metrics.json", root),
    JSON.stringify(
      {
        method:
          "Unchanged metadata and product references; UTF-8 bytes; 100 warm parser samples; physical equivalence tolerance 1e-9 metres; screenshots from actual renderer.",
        examples: results,
      },
      null,
      2,
    ) + "\n",
  );
  for (const item of results) {
    const old = core.examples[item.name],
      modern = core.migrateDesign(old),
      note =
        item.name === "Apartment"
          ? "Balcony excerpt shown; measurements cover the complete seven-room Apartment. Full source includes shared definitions and nested layouts."
          : "Complete source shown. Both versions render the same design.";
    const header = `<h1>${escape(item.name)}</h1><p class="meta">DESIGN 2 · <span class="badge">${item.reductionPercent}% fewer bytes</span> · ${item.before.emptyCells} → ${item.after.emptyCells} empty grid cells</p><p>${note}</p>`;
    const content = `${header}<div class="comparison">${[1, 2].map((version) => `<div class="panel"><h3>${version === 1 ? "Original language" : "DESIGN 2"} · ${version === 1 ? item.before.bytes : item.after.bytes} bytes</h3><img src="${item.slug}-v${version}.png" alt="${escape(item.name)} rendered from version ${version}"><p class="caption">Actual editor render. <a href="${item.slug}-v${version}.design">Complete source</a></p><pre>${escape(excerpt(version === 1 ? old : modern, version, item.name))}</pre></div>`).join("")}</div>`;
    const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(item.name)} — Language comparison</title><style>${css}</style><main>${content}<p><a href="index.html">All comparisons</a></p></main></html>`;
    writeFileSync(new URL(`${item.slug}.html`, root), page);
    writeFileSync(
      new URL(`${item.slug}-preview.html`, root),
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(item.name)} — Source and scene</title><style>${css}</style><main>${header}<div class="code-view"><div class="panel"><h3>DESIGN 2 source${item.name === "Apartment" ? " · balcony excerpt" : ""}</h3><pre>${escape(excerpt(modern, 2, item.name))}</pre></div><div class="panel"><h3>Rendered result · unchanged from original</h3><img src="${item.slug}-v2.png" alt="${escape(item.name)}"><p class="caption">${item.render ? `${item.render.changedPixels} changed pixels in before/after comparison.` : "Run --render to verify pixels."} <a href="${item.slug}.html">Before / after</a></p></div></div><p><a href="${item.slug}-v2.design">Complete source</a> · <a href="index.html">All examples</a></p></main></html>`,
    );
    pages.push(
      `<section><h2><a href="${item.slug}.html">${escape(item.name)}</a></h2><p>${item.reductionPercent}% fewer bytes · <a href="${item.slug}-source-preview.png">Code beside render image</a></p><div class="code-view"><pre>${escape(excerpt(modern, 2, item.name))}</pre><div><img style="width:100%" src="${item.slug}-v2.png" alt="${escape(item.name)}"><p class="caption">${note}</p><p><a href="${item.slug}-v1.design">Original source</a> · <a href="${item.slug}-v2.design">DESIGN 2 source</a></p></div></div></section>`,
    );
  }
  writeFileSync(
    new URL("index.html", root),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Interior language comparison</title><style>${css}</style><main><h1>A smaller, explicit interior language</h1><p>Four existing examples, unchanged scenes. Scoped rooms, direct placement, reusable assets and explicit units.</p><p>This is an optimization for authoring and maintenance, not a claim of globally minimal syntax or faster parsing. Metadata and product references are retained.</p><table><thead><tr><th>Example</th><th>Original bytes</th><th>DESIGN 2 bytes</th><th>Reduction</th><th>Empty cells</th></tr></thead><tbody>${results.map((item) => `<tr><td>${escape(item.name)}</td><td>${item.before.bytes}</td><td>${item.after.bytes}</td><td>${item.reductionPercent}%</td><td>${item.before.emptyCells} → ${item.after.emptyCells}</td></tr>`).join("")}</tbody></table><p><a href="metrics.json">Measured data and rendering comparison</a> · <a href="../LANGUAGE.md">Language reference</a> · <a href="../LANGUAGE-DESIGN.md">Design decisions and verification</a></p>${pages.join("")}</main></html>`,
  );
}
console.table(
  results.map(({ name, before, after, reductionPercent, parseV1, parseV2 }) => ({
    name,
    oldBytes: before.bytes,
    newBytes: after.bytes,
    reductionPercent,
    oldMedianMs: parseV1.medianMs,
    newMedianMs: parseV2.medianMs,
  })),
);
