import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
export const core = new Function(
  source.split("const initializeStudio =")[0] + "\nreturn createLayoutCore();",
)();
const { parseProgram, parseDesign, migrateDesign, formatDesign, furniturePosition } = core;
const basic = (body = "PLACE chair AT 1.5,1.5m") =>
  `DESIGN 2\nGRID 1m\nROOM main 4x4m AT 0,0m\n  WALLS all\n  ${body}\nEND`;

// Compare physical values to a nanometre, not source spans or sparse-grid storage.
export function semanticSnapshot(program) {
  const clean = (value) => {
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(
            ([key]) =>
              !["line", "text", "outlineLine", "labelLine", "position"].includes(key) &&
              !(typeof value.text === "string" && ["start", "end"].includes(key)),
          )
          .map(([key, child]) => [key, clean(child)]),
      );
    return typeof value === "number" ? Math.round(value * 1e9) / 1e9 : value;
  };
  return {
    settings: clean({
      ...program,
      layouts: undefined,
      rooms: undefined,
      wallSpecs: undefined,
      warnings: undefined,
    }),
    rooms: clean(program.rooms),
    walls: clean(program.wallSpecs),
    warnings: program.warnings.map((message) => message.replace(/Line \d+:/gu, "Line:")),
    furniture: program.rooms.flatMap((room) =>
      program.layouts[room.name].flatMap((row, z) =>
        row.flatMap((token, x) =>
          token
            ? [
                {
                  room: room.name,
                  token: clean(token),
                  position: clean(furniturePosition(program, room, token, x, z)),
                },
              ]
            : [],
        ),
      ),
    ),
    arrangements: clean(
      Object.fromEntries(
        Object.entries(program.layouts).filter(
          ([name]) => !program.rooms.some((room) => room.name === name),
        ),
      ),
    ),
  };
}
for (const [name, old] of Object.entries(core.examples)) {
  test(`${name}: migration preserves the complete scene and reduces source`, () => {
    const modern = migrateDesign(old);
    assert.deepEqual(semanticSnapshot(parseProgram(modern)), semanticSnapshot(parseProgram(old)));
    assert.ok(modern.length < old.length, `${modern.length} < ${old.length}`);
    assert.ok(
      modern.split("\n").filter((line) => line.trim()).length <=
        old.split("\n").filter((line) => line.trim()).length,
    );
    assert.equal(migrateDesign(modern), modern);
    assert.equal(formatDesign(formatDesign(modern)), formatDesign(modern));
    assert.deepEqual(
      semanticSnapshot(parseProgram(formatDesign(modern))),
      semanticSnapshot(parseProgram(old)),
    );
  });
  test(`${name}: every selectable asset points at its original source token`, () => {
    const modern = migrateDesign(old),
      p = parseProgram(modern),
      lines = modern.split("\n");
    const tokens = [
      ...Object.values(p.layouts).flat(2).filter(Boolean),
      ...p.rooms.flatMap((room) => room.mounts),
    ];
    for (const token of tokens) {
      assert.equal(lines[token.line - 1].slice(token.start, token.end), token.text);
      assert.ok(token.text && !token.text.includes("PLACE "));
    }
  });
}
test("coordinate conventions agree for objects, lights, mounts and openings", () => {
  const p = parseProgram(
      basic(
        "PLACE chair AT 150,125cm\nLIGHT ceiling_light AT 150,125cm\nMOUNT north AT 150cm mirror HEIGHT 100cm\nDOOR south AT 150cm WIDTH 85cm",
      ),
    ),
    r = p.rooms[0],
    token = p.layouts.main[0][0];
  assert.deepEqual(furniturePosition(p, r, token, 0, 0), [-0.5, 0, -0.75]);
  assert.equal((r.lights[0].x + 0.5) * p.grid, 1.5);
  assert.equal((r.lights[0].z + 0.5) * p.grid, 1.25);
  assert.equal((r.mounts[0].cell + 0.5) * p.grid, 1.5);
  assert.equal(r.openings[0].at * p.grid, 1.5);
  assert.equal(r.mounts[0].height, 1);
});
test("metres, centimetres, millimetres and grid units describe the same point", () => {
  const result = ["1.5,1.5m", "150,150cm", "1500,1500mm", "1.5,1.5g"].map((point) =>
    semanticSnapshot(parseProgram(basic(`PLACE chair AT ${point}`))),
  );
  for (const item of result) assert.deepEqual(item, result[0]);
});
test("definitions centralize size and URL, with explicit per-instance overrides", () => {
  const source = basic(
    "PLACE dining@90 AT 1,1m\nPLACE dining[60x50x80cm]<https://example.com/other> AT 3,3m",
  ).replace("ROOM", "ASSET dining = chair[50x50x80cm]<https://example.com/#oak>\nROOM");
  const tokens = parseProgram(source).layouts.main[0];
  assert.deepEqual(tokens[0].dimensions, [0.5, 0.5, 0.8]);
  assert.equal(tokens[0].url, "https://example.com/#oak");
  assert.equal(tokens[0].yaw, 90);
  assert.deepEqual(tokens[1].dimensions, [0.6, 0.5, 0.8]);
  assert.equal(tokens[1].url, "https://example.com/other");
});
test("same-cell placements are independent and produce actionable overlap warnings", () => {
  const p = parseProgram(basic("PLACE chair AT 1.2,1.2m\nPLACE chair AT 1.3,1.3m"));
  assert.equal(p.layouts.main[0].length, 2);
  assert.match(p.warnings[0], /Line 6: chair overlaps chair/u);
});
test("ROW preserves dense grid and nested arrangement semantics", () => {
  const legacy =
    "GRID 1\nROOM main 4x4 AT 0,0\nLAYOUT main\n. | .\n. | desk(top_on_top)\nEND\nLAYOUT top\nbook | mug\nEND";
  assert.deepEqual(
    semanticSnapshot(parseProgram(migrateDesign(legacy))),
    semanticSnapshot(parseProgram(legacy)),
  );
  const p = parseProgram(basic("ROW . | chair\nROW chair | ."));
  assert.equal(p.layouts.main[0][1].name, "chair");
  assert.equal(p.layouts.main[1][0].name, "chair");
});
test("comments, quotes, fragments, CRLF and source spans survive", () => {
  const s =
    "# project\r\n" +
    basic("PLACE chair<https://example.com/#oak> AT 1,1m # furniture").replace(
      "ROOM",
      'DETAIL project "A # mark and \\"quoted\\" text" # note\nROOM',
    );
  const p = parseProgram(s);
  assert.equal(p.details[0].text, 'A # mark and "quoted" text');
  assert.equal(p.layouts.main[0][0].url, "https://example.com/#oak");
  const formatted = formatDesign(s);
  assert.match(formatted, /# furniture/u);
  assert.deepEqual(semanticSnapshot(parseProgram(formatted)), semanticSnapshot(p));
  const ast = parseDesign(s).ast;
  assert.equal(ast.source, s);
  assert.equal(ast.children.find((n) => n.type === "room").endLine, s.split("\n").length);
});
test("syntax and semantic errors use source lines after expansion", () => {
  const s = basic("PLACE chair AT 1,1m\nPLACE chair~north AT .1,1m");
  assert.throws(
    () => parseProgram(s),
    (e) => e.line === 6 && /fit along the wall/u.test(e.message),
  );
  assert.throws(
    () => parseProgram(basic("PLACE missing AT 1,1m")),
    (e) => e.line === 5,
  );
  assert.throws(() => parseProgram(basic("PLACE chair AT 1,1")), /explicit/u);
  assert.throws(
    () => parseProgram("DESIGN 2\nROOM main"),
    (error) => error.line === 2 && /Invalid ROOM syntax/u.test(error.message),
  );
});
test("invalid versions, scopes, units and definitions are rejected", () => {
  const cases = [
    basic().replace("DESIGN 2", "DESIGN 3"),
    basic().replace("GRID 1m", "GRID 1"),
    basic().replace("GRID 1m", "GRID 1g"),
    basic().replace("GRID 1m", "GRID 1m\nGRID 1m"),
    basic().replace("4x4m", "4x4"),
    basic().replace("4x4m", "4mx4m"),
    basic().replace("PLACE chair", "PLACE chair[.5x.5x.8]"),
    basic().replace("PLACE chair", "PLACE chair[1x1x1g]"),
    basic("PLACE chair AT 1,1m\nROW chair"),
    basic("ROW chair\nPLACE chair AT 1,1m"),
    basic("FLOOR 1"),
    basic("GRID 1m"),
    basic("ASSET seat = chair"),
    basic("LAYOUT child\nchair\nEND"),
    basic().replace("ROOM", "ASSET chair = chair\nROOM"),
    basic().replace("ROOM", "ASSET seat = chair@90\nROOM"),
    basic().replace("ROOM", "ASSET seat = chair@0\nROOM"),
    basic().replace("ROOM", "ASSET 0 = chair\nROOM"),
    basic().replace("ROOM", "ASSET seat = chair\nASSET seat = chair\nROOM"),
    basic().replace("ROOM", "ASSET seat = unknown\nROOM"),
    basic().replace("END", ""),
    basic() + "\nEND",
    basic("PLACE chair AT NaN,1m"),
    basic("PLACE chair AT 1e3,1m"),
    basic("PLACE chair AT 121,1m"),
    basic("MOUNT north 1 mirror"),
    basic("LIGHT ceiling_light AT 1,1"),
  ];
  for (const text of cases) assert.throws(() => parseProgram(text), undefined, text);
});
test("version 1 does not acquire fractional or negative light coordinates", () => {
  for (const point of [".5,1", "1.5,1", "-1,1"]) {
    assert.throws(() =>
      parseProgram(
        `GRID 1\nROOM main 4x4 AT 0,0\nLIGHT ceiling_light AT ${point}\nLAYOUT main\n.\nEND`,
      ),
    );
  }
});
test("expanded instance, light and cycle budgets still apply", () => {
  const cycle = basic("PLACE desk(top_on_top) AT 2,2m") + "\nLAYOUT top\nchair(top_on_top)\nEND";
  assert.throws(
    () => parseProgram(cycle),
    (error) => /cycles/u.test(error.message) && error.line === 8,
  );
  assert.throws(
    () => parseProgram(basic(Array(1025).fill("PLACE chair AT 1,1m").join("\n"))),
    /1,024/u,
  );
  assert.throws(
    () => parseProgram(basic(Array(65).fill("PLACE lamp AT 1,1m").join("\n"))),
    /64 light/u,
  );
  assert.throws(() => parseProgram("DESIGN 2\n" + "#".repeat(200001)), /200,000/u);
});
test("deterministic generated layouts preserve transforms through migration", () => {
  for (let i = 0; i < 60; i++) {
    const grid = [0.25, 0.5, 0.82, 1, 1.25][i % 5],
      x = (i % 5) - 2,
      z = ((i * 3) % 7) - 3;
    const s = `GRID ${grid}\nFLOOR ${(i % 3) - 1}\nROOM main 6x6 AT ${x},${z}\nWALLS north east south west\nLAYOUT main\n. | . | .\n. | chair[.4x.4x.8]@${i * 17} | .\n. | . | plant\nEND`;
    assert.deepEqual(
      semanticSnapshot(parseProgram(migrateDesign(s))),
      semanticSnapshot(parseProgram(s)),
    );
  }
});

test("shared links resolve in metadata, definitions and instances without rewriting prose", () => {
  const s = basic("PLACE seat AT 1,1m\nPLACE chair<$manual> AT 3,3m").replace(
    "ROOM",
    'LINK manual = <https://example.com/#spec>\nDETAIL project "Literal <$manual>" <$manual>\nASSET seat = chair<$manual>\nROOM',
  );
  const p = parseProgram(s);
  assert.equal(p.details[0].text, "Literal <$manual>");
  assert.equal(p.details[0].url, "https://example.com/#spec");
  assert.ok(p.layouts.main[0].every((token) => token.url === p.details[0].url));
  assert.throws(
    () => parseProgram(s.replace("<$manual> AT 3", "<$missing> AT 3")),
    /Unknown LINK/u,
  );
  assert.throws(
    () => parseProgram(s.replace("https://example.com/#spec", "javascript:alert(1)")),
    /URL/u,
  );
});
test("migration preserves repeated overrides and room layouts reused as arrangements", () => {
  const s =
    "GRID 1\nROOM main 4x4 AT 0,0\nWALLS north east south west\nDOORS south\nDOORS none\nSURFACE tile\nSURFACE wood\nROOM other 4x4 AT 4,0\nLAYOUT main\n. | . | .\n. | book | .\n. | . | .\nEND\nLAYOUT other\n. | desk(main_on_top)\nEND";
  assert.deepEqual(
    semanticSnapshot(parseProgram(migrateDesign(s))),
    semanticSnapshot(parseProgram(s)),
  );
});
test("very small decimal measurements stay decimal and do not get rounded to zero", () => {
  const p = parseProgram(basic("PLACE chair[.0000001x.5x.8m] AT 1,1m"));
  assert.equal(p.layouts.main[0][0].dimensions[0], 0.0000001);
});

test("a direct-placement room cannot silently change nested layout distribution", () => {
  const s =
    basic("PLACE desk(other_on_top) AT 1,1m") +
    "\nROOM other 4x4m AT 4,0m\nPLACE book AT 1,1m\nEND";
  assert.throws(() => parseProgram(s), /must use ROW/u);
});

test("URLs are opaque to unit parsing and grid separators, including IPv6 and query brackets", () => {
  for (const token of [
    "chair<https://[::1]/?items[x]=a|b>[50x50x80cm]@90",
    "chair[50x50x80cm]<https://example.com/?items[x]=a|b>@90",
  ]) {
    const s = basic(`ROW . | ${token} | .`),
      p = parseProgram(s),
      t = p.layouts.main[0][1];
    assert.deepEqual(t.dimensions, [0.5, 0.5, 0.8]);
    assert.equal(t.yaw, 90);
    assert.equal(s.split("\n")[t.line - 1].slice(t.start, t.end), token);
  }
  const s = basic("PLACE seat<https://example.com/?items[x]=a> AT 1,1m").replace(
    "ROOM",
    "ASSET seat = chair[40x40x80cm]\nROOM",
  );
  assert.deepEqual(parseProgram(s).layouts.main[0][0].dimensions, [0.4, 0.4, 0.8]);
});
