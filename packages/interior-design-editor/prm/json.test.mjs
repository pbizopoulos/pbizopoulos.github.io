import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const core = new Function(
  source.split("const initializeStudio =")[0] + "return createLayoutCore();",
)();
const { parseProgram, formatDesign, freezePlacement, automaticExample } = core;
const scene = () => ({
  version: 3,
  units: "m",
  grid: 1,
  floorPlan: { rooms: { main: { size: [4, 4] } } },
  assets: { seat: { model: "chair" } },
  instances: { seat: { asset: "seat", room: "main" } },
});
const parse = (value) => parseProgram(JSON.stringify(value, null, 2));

test("JSON default example mixes fixed and automatic instances without collisions", () => {
  const program = parseProgram(automaticExample);
  assert.equal(program.version, 3);
  assert.equal(Object.keys(program.placements).length, 3);
  assert.deepEqual(program.placements.livingSofa, { position: [2.5, 0.6], rotation: 0 });
  assert.deepEqual(program.warnings, []);
  assert.equal(program.layouts.living[0][0].id, "coffeeTable");
});

test("placement is repeatable and independent of JSON attribute ordering", () => {
  const document = JSON.parse(automaticExample);
  const expected = parse(document).placements;
  document.instances = Object.fromEntries(Object.entries(document.instances).reverse());
  document.assets = Object.fromEntries(Object.entries(document.assets).reverse());
  for (let i = 0; i < 4; i += 1) assert.deepEqual(parse(document).placements, expected);
});

test("project and room algorithm settings override defaults", () => {
  const document = scene();
  const wall = parse(document).placements.seat;
  document.placement = { algorithm: "grid-pack", step: 0.2 };
  const grid = parse(document).placements.seat;
  assert.notDeepEqual(grid.position, wall.position);
  document.floorPlan.rooms.main.placement = { algorithm: "wall-first", step: 0.1 };
  assert.deepEqual(parse(document).placements.seat, wall);
});

test("manual instances are reserved before automatic instances regardless of ID", () => {
  const document = scene();
  const first = parse(document).placements.seat;
  document.instances.zzFixed = { asset: "seat", room: "main", placement: first };
  const program = parse(document);
  assert.deepEqual(program.placements.zzFixed, first);
  assert.notDeepEqual(program.placements.seat.position, first.position);
  assert.deepEqual(program.warnings, []);
});

test("partial placement honors wall and rotation constraints", () => {
  const document = scene();
  document.instances.seat.placement = { wall: "east" };
  const east = parse(document).placements.seat;
  assert.equal(east.rotation, 270);
  assert.ok(east.position[0] > 3);
  document.instances.seat.placement = { rotation: 35 };
  assert.equal(parse(document).placements.seat.rotation, 35);
  document.instances.seat.placement = { position: [2, 2] };
  assert.deepEqual(parse(document).placements.seat, { position: [2, 2], rotation: 0 });
});

test("missing supporting walls and oversized furniture remain unplaced with source diagnostics", () => {
  const document = scene();
  document.floorPlan.rooms.main.walls = [];
  document.instances.seat.placement = { wall: "north" };
  let program = parse(document);
  assert.deepEqual(program.placements, {});
  assert.equal(program.layouts.main[0].length, 0);
  assert.match(program.warnings[0], /seat could not be placed.*north wall/u);
  document.instances.seat.placement = {};
  document.assets.seat.size = [6, 6, 1];
  program = parse(document);
  assert.deepEqual(program.placements, {});
  assert.match(program.warnings[0], /could not be placed/u);
});

test("automatic furniture leaves space in front of explicit and implicit doors", () => {
  for (const explicit of [true, false]) {
    const document = scene();
    document.floorPlan.rooms.main.placement = { clearance: 0.1 };
    if (explicit)
      document.floorPlan.rooms.main.openings = [
        { type: "door", wall: "north", at: 0.6, width: 0.9 },
      ];
    else document.floorPlan.rooms.main.doors = ["north"];
    const at = explicit ? 0.6 : 2;
    for (let i = 0; i < 10; i += 1)
      document.instances[`seat${i}`] = { asset: "seat", room: "main" };
    const program = parse(document);
    for (const {
      position: [x, z],
      rotation,
    } of Object.values(program.placements)) {
      const angle = (rotation * Math.PI) / 180,
        halfX = (Math.abs(Math.cos(angle)) * 0.5 + Math.abs(Math.sin(angle)) * 0.54) / 2,
        halfZ = (Math.abs(Math.sin(angle)) * 0.5 + Math.abs(Math.cos(angle)) * 0.54) / 2,
        doorWidth = explicit ? 0.9 : 0.95,
        halfOpening = doorWidth / 2 + 0.1,
        reach = Math.max(0.9, doorWidth) + 0.1;
      assert.ok(
        z - halfZ >= reach - 1e-8 ||
          x + halfX <= at - halfOpening + 1e-8 ||
          x - halfX >= at + halfOpening - 1e-8,
        `${x},${z} blocks door`,
      );
    }
  }
});

test("automatic placement fits concave and diagonal floor plans", () => {
  for (const outline of [
    [
      [0, 0],
      [4, 0],
      [4, 2],
      [2, 2],
      [2, 4],
      [0, 4],
    ],
    [
      [0, 0],
      [4, 0],
      [4, 2],
      [2, 4],
      [0, 4],
    ],
  ]) {
    const document = scene();
    document.floorPlan.rooms.main.outline = outline;
    document.placement = { algorithm: "grid-pack", step: 0.3 };
    for (let i = 0; i < 12; i += 1)
      document.instances[`seat${i}`] = { asset: "seat", room: "main" };
    const program = parse(document);
    assert.ok(Object.keys(program.placements).length >= 8);
    assert.ok(!program.warnings.some((warning) => /extends beyond|overlaps/u.test(warning)));
  }
});

test("manual invalid placements retain coordinates and warn", () => {
  const document = scene();
  document.instances.seat.placement = { position: [0, 0] };
  document.instances.other = { ...document.instances.seat };
  const program = parse(document);
  assert.deepEqual(program.placements.seat.position, [0, 0]);
  assert.ok(program.warnings.some((warning) => /extends beyond/u.test(warning)));
  assert.ok(program.warnings.some((warning) => /overlaps/u.test(warning)));
});

test("freeze and formatting preserve generated placements and instance identities", () => {
  const expected = parseProgram(automaticExample).placements;
  const frozen = freezePlacement(automaticExample);
  assert.deepEqual(parseProgram(frozen).placements, expected);
  assert.equal(freezePlacement(frozen), frozen);
  assert.deepEqual(parseProgram(formatDesign(automaticExample)).placements, expected);
  assert.equal(formatDesign(formatDesign(automaticExample)), formatDesign(automaticExample));
  const document = scene();
  document.instances.seat.placement = { wall: "south" };
  document.floorPlan.rooms.main.walls = [];
  assert.equal(
    JSON.parse(freezePlacement(JSON.stringify(document))).instances.seat.placement.wall,
    "south",
  );
});

test("source selection and diagnostics identify the original instance", () => {
  const program = parseProgram(automaticExample);
  const lines = automaticExample.split("\n");
  for (const token of program.layouts.living[0]) {
    assert.equal(lines[token.line - 1].slice(token.start, token.end), token.text);
    assert.ok(lines[token.line - 1].includes(`"${token.id}"`));
  }
  const document = scene();
  document.instances.seat.asset = "unknown";
  const json = JSON.stringify(document, null, 2),
    line = json.split("\n").findIndex((value) => value.includes('"asset": "unknown"')) + 1;
  assert.throws(
    () => parseProgram(json),
    (error) => error.line === line && /unknown asset reference/u.test(error.message),
  );
  document.instances.seat.asset = "seat";
  document.floorPlan.rooms.main.walls = ["north"];
  document.floorPlan.rooms.main.openings = [{ type: "door", wall: "south", at: 2 }];
  assert.throws(() => parse(document), /floorPlan.rooms.main.openings.0/u);
});

test("strict JSON and schema reject duplicate keys, typos, wrong types and invalid values", () => {
  for (const json of [
    '{"version":3,"version":3}',
    '{"version":3,}',
    "{} garbage",
    "[]",
    '{"x":Infinity}',
    '{"x":01}',
    '{"x":"\\q"}',
  ])
    assert.throws(() => parseProgram(json));
  const mutations = [
    (d) => (d.version = 2),
    (d) => (d.units = "cm"),
    (d) => (d.placement = { algorithm: "random" }),
    (d) => (d.placement = { step: 0 }),
    (d) => (d.assets.seat = { model: "unknown" }),
    (d) => (d.assets.seat.size = [-1, 1, 1]),
    (d) => (d.instances.seat.room = "unknown"),
    (d) => (d.instances.seat.placement = { position: ["1", 1] }),
    (d) => (d.instances.seat.placement = { positon: [1, 1] }),
    (d) => (d.instances.seat.placement = { position: [1, 1], wall: "north" }),
    (d) => (d.floorPlan.rooms.main.floor = 1.2),
    (d) => (d.floorPlan.rooms.main.size = [0, 0]),
    (d) => (d.assets.seat.url = "javascript:alert(1)"),
    (d) => (d.floorPlan.rooms.main.origin = [Infinity, 0]),
    (d) => (d.floorPlan.rooms.main.walls = "all"),
  ];
  for (const mutate of mutations) {
    const document = scene();
    mutate(document);
    assert.throws(() => parse(document));
  }
});

test("instance and fixture limits still apply to JSON", () => {
  const document = scene();
  document.instances = Object.fromEntries(
    Array.from({ length: 1025 }, (_, i) => [`seat${i}`, { asset: "seat", room: "main" }]),
  );
  assert.throws(() => parse(document), /1,024 instances/u);
  document.assets.seat.model = "ceiling_light";
  document.instances = Object.fromEntries(
    Array.from({ length: 65 }, (_, i) => [
      `lamp${i}`,
      { asset: "seat", room: "main", placement: { position: [1, 1] } },
    ]),
  );
  assert.throws(() => parse(document), /64 light fixtures/u);
});

test("JSON retains room finishes, openings, mounted assets, lights and project metadata", () => {
  const document = scene();
  document.site = { surface: "grass", margin: 3 };
  document.facade = "plaster";
  document.wallThickness = [0.24, 0.12];
  document.details = [
    { room: "main", text: "Measured study", url: "https://example.com/spec#detail" },
  ];
  document.assets.mirror = { model: "mirror", url: "https://example.com/mirror" };
  document.floorPlan.rooms.main = {
    size: [4, 4],
    origin: [-4, 2],
    floor: 1,
    height: 2.8,
    label: "Study",
    labelPosition: [2, 2],
    surface: "tile",
    style: "neutral",
    mounts: [{ asset: "mirror", wall: "north", at: 2, height: 1 }],
    lights: [{ model: "downlight", position: [2, 2], power: 12 }],
    openings: [{ type: "passage", wall: "south", at: 2, width: 0.9 }],
  };
  const program = parse(document),
    room = program.rooms[0];
  assert.equal(room.floor, 1);
  assert.equal(room.elevation, 3);
  assert.equal(room.height, 2.8);
  assert.equal(room.surface, "tile");
  assert.equal(room.label, "Study");
  assert.deepEqual(room.labelPoint, [2, 2]);
  assert.equal(room.mounts[0].height, 1);
  assert.equal(room.mounts[0].url, "https://example.com/mirror");
  assert.equal(room.mounts[0].text, '"mirror"');
  assert.equal(room.lights[0].x, 1.5);
  assert.equal(room.openings[0].at, 2);
  assert.equal(room.openings[0].kind, "passage");
  assert.equal(program.site, "grass");
  assert.equal(program.margin, 3);
  assert.equal(program.details[0].text, "Measured study");
  assert.deepEqual(program.warnings, []);
});

test("explicit null values do not silently become default settings", () => {
  for (const mutate of [
    (d) => (d.placement = null),
    (d) => (d.assets = null),
    (d) => (d.instances = null),
    (d) => (d.instances.seat.placement = null),
    (d) => (d.floorPlan.rooms.main.origin = null),
    (d) => (d.floorPlan.rooms.main.floor = null),
    (d) => (d.floorPlan.rooms.main.walls = null),
    (d) => (d.floorPlan.rooms.main.kind = null),
    (d) => (d.floorPlan.rooms.main.lights = null),
  ]) {
    const document = scene();
    mutate(document);
    assert.throws(() => parse(document));
  }
});

test("shared openings declared by a neighboring room also reserve clearance", () => {
  const document = scene();
  document.floorPlan.rooms.annex = {
    size: [4, 4],
    origin: [0, -4],
    openings: [{ type: "door", wall: "south", at: 2, width: 0.9 }],
  };
  for (let i = 0; i < 8; i += 1)
    document.instances[`seat${i}`] = { asset: "seat", room: "main", placement: { wall: "north" } };
  document.instances.seat.placement = { wall: "north" };
  const program = parse(document);
  for (const {
    position: [x],
  } of Object.values(program.placements))
    assert.ok(Math.abs(x - 2) >= 0.85 - 1e-8);
  assert.ok(Object.keys(program.placements).length >= 2);
});
