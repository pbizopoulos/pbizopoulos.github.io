import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

// Exercise the exact pure layout implementation shipped in script.js.
const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const core = source.split("const initializeStudio =")[0];
const { examples, parseProgram, parseToken, productUrl, furniturePosition } = new Function(
  core + "\nreturn createLayoutCore();",
)();

const room = (row = ".") =>
  `GRID 1\nROOM main 4x4 AT 0,0\nWALLS north east south west\nLAYOUT main\n${row}\nEND`;
for (const [name, source] of Object.entries(examples))
  test(`bundled layout: ${name}`, () => assert.ok(parseProgram(source).rooms.length));
test("modifier order, product fragments, and exact source spans", () => {
  const text = "desk(work_on_top)[1.2x0.6x0.7]~north<https://example.com/item#oak>";
  const token = parseToken(text, 9, 4);
  assert.equal(token.child, "work");
  assert.equal(token.wall, "north");
  assert.equal(token.start, 4);
  assert.equal(token.end, 4 + text.length);
  assert.deepEqual(token.dimensions, [1.2, 0.6, 0.7]);
  assert.equal(token.url, "https://example.com/item#oak");
  const p = parseProgram(room(`. | ${text}`).replace("END", "END\nLAYOUT work\nbook | mug\nEND"));
  assert.equal(p.layouts.main[0][1].url, token.url);
});
test("aliases and empty cells", () => {
  assert.equal(parseToken("1", 1).name, "sofa");
  for (const value of ["0", ".", "-"]) assert.equal(parseToken(value, 1), null);
});
test("dimensions and rotations reject NaN, duplicate modifiers and conflicting placement", () => {
  for (const value of [
    "sofa[0x1x1]",
    "sofa[11x1x1]",
    "sofa[1..2x1x1]",
    "sofa@1..2",
    "sofa@30~north",
    "sofa~north@30",
    "sofa@0@10",
    "sofa(bad)",
    "missing_asset",
  ])
    assert.throws(() => parseToken(value, 1));
});
test("product URLs reject script schemes and credentials", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "https://user:password@example.com/",
    "ftp://example.com/",
    "not a URL",
  ])
    assert.throws(() => productUrl(value, 2));
  assert.equal(productUrl("https://example.com/"), "https://example.com/");
});
test("negative coordinates and floors are centred correctly", () => {
  const p = parseProgram(room().replace("AT 0,0", "AT -4,-4"));
  assert.deepEqual(p.center, [-2, -2]);
  assert.deepEqual(furniturePosition(p, p.rooms[0], parseToken("plant", 1), 0, 0), [-1.5, 0, -1.5]);
});
test("errors retain useful line numbers", () => {
  assert.throws(
    () => parseProgram(room("unknown")),
    (e) => e.line === 5 && e.message.includes("Unknown asset"),
  );
});
test("room dimensions and openings are validated", () => {
  for (const source of [
    room().replace("4x4", "1x4"),
    room().replace("GRID 1", "GRID 9"),
    room().replace("WALLS north east south west", "WALLS north\nDOORS east"),
    room().replace("WALLS north east south west", "WALLS north\nDOORS north\nWINDOWS north"),
  ])
    assert.throws(() => parseProgram(source));
});
test("rows, separators and missing END are validated", () => {
  for (const source of [
    room(". . . . ."),
    room(". | . ."),
    room(". || ."),
    room().replace(/END$/, ""),
    room().replace("LAYOUT main", "LAYOUT missing"),
  ])
    assert.throws(() => parseProgram(source));
});
test("sub-layout cycles and missing references are rejected", () => {
  assert.throws(() => parseProgram(room("desk(work_on_top)")));
  assert.throws(
    () => parseProgram(room("desk(work_on_top)") + "\nLAYOUT work\ndesk(work_on_top)\nEND"),
    /cycles/,
  );
});
test("wall placement fits and has a supporting wall", () => {
  assert.throws(() => parseProgram(room("sofa~north")));
  assert.throws(() =>
    parseProgram(room(". | plant~south").replace("WALLS north east south west", "WALLS north")),
  );
});
test("same-floor overlap rejected, stacked floors accepted", () => {
  const second = "\nROOM upper 4x4 AT 0,0\nLAYOUT upper\n.\nEND";
  assert.throws(() => parseProgram(room() + second), /overlap/);
  assert.equal(parseProgram(room() + "\nFLOOR 1" + second).floors.length, 2);
});
test("untrusted layout names do not inherit object properties", () => {
  const p = parseProgram(room().replaceAll("main", "__proto__"));
  assert.equal(p.layouts.__proto__.length, 1);
});
test("site, facade, roof, mounts, lights and garden definitions", () => {
  const source =
    "SITE grass 3\nFACADE plaster\nROOF flat\n" +
    room().replace(
      "LAYOUT main",
      "WINDOWS north\nMOUNT east 1 mirror\nLIGHT ceiling_light AT 1,1 POWER 18\nLAYOUT main",
    ) +
    "\nGARDEN yard 4x4 AT 4,0\nSURFACE grass\nLAYOUT yard\nplant\nEND";
  const p = parseProgram(source);
  assert.equal(p.rooms[1].kind, "garden");
  assert.equal(p.rooms[0].lights[0].power, 18);
  assert.equal(p.rooms[0].mounts[0].side, "east");
});

test("placement warnings catch overflow and real rotated footprint overlaps", () => {
  assert.match(parseProgram(room("sofa")).warnings.join(" "), /extends beyond/);
  assert.match(
    parseProgram(
      room()
        .replace("GRID 1", "GRID 0.5")
        .replace("\n.\nEND", "\n. | . | . | .\n. | sofa | sofa@90 | .\nEND"),
    ).warnings.join(" "),
    /overlaps/,
  );
  for (const source of Object.values(examples)) assert.deepEqual(parseProgram(source).warnings, []);
});
test("expanded sub-layout budget prevents exponential scene construction", () => {
  const source =
    room("desk(a_on_top)") +
    "\nLAYOUT a\n" +
    Array(33).fill("desk(b_on_top)").join(" | ") +
    "\nEND\nLAYOUT b\n" +
    Array(33).fill("book").join(" | ") +
    "\nEND";
  assert.throws(() => parseProgram(source), /expanded furniture/);
  assert.throws(() => parseToken("constructor", 1), /Unknown asset/);
});

test("light budgets include lamps expanded from child layouts", () => {
  const source =
    room("desk(lamps_on_top)") +
    "\nLAYOUT lamps\n" +
    Array(65).fill("table_lamp").join(" | ") +
    "\nEND";
  assert.throws(() => parseProgram(source), /64 light fixtures/);
  assert.throws(() =>
    parseProgram(room().replace("LAYOUT main", "LIGHT wall_lamp AT 1,1\nLAYOUT main")),
  );
});
test("mounts require wall fixtures or decorations", () => {
  assert.throws(
    () => parseProgram(room().replace("LAYOUT main", "MOUNT north 1 bed\nLAYOUT main")),
    /wall decoration/,
  );
});
