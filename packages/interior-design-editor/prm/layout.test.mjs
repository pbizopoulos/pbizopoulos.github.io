import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

// Exercise the exact pure layout implementation shipped in script.js.
const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const core = source.split("const initializeStudio =")[0];
const {
  examples,
  parseProgram,
  parseToken,
  productUrl,
  furniturePosition,
  insideRoom,
  polygonArea,
  clipPolygon,
} = new Function(core + "\nreturn createLayoutCore();")();

const room = (row = ".") =>
  `GRID 1\nROOM main 4x4 AT 0,0\nWALLS north east south west\nLAYOUT main\n${row}\nEND`;
for (const [name, source] of Object.entries(examples))
  test(`bundled layout: ${name}`, () => assert.ok(parseProgram(source).rooms.length));
test("bundled layouts survive the formatter removing literal newlines", () => {
  const formatted = new Function(core.replace(/[\r\n]/gu, "") + "\nreturn createLayoutCore();")();
  assert.deepEqual(formatted.examples, examples);
  for (const text of Object.values(formatted.examples))
    assert.deepEqual(formatted.parseProgram(text), parseProgram(text));
});
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

test("mounted shelves preserve dimensions, children, links and bottom height", () => {
  const p = parseProgram(
    room().replace(
      "LAYOUT main",
      "MOUNT north 1 wall_shelf(laptop_on_top)[0.52x0.26x0.08]<https://example.com/shelf> HEIGHT 1.2\nLAYOUT main",
    ) + "\nLAYOUT laptop\nlaptop\nEND",
  );
  const mount = p.rooms[0].mounts[0];
  assert.deepEqual(mount.dimensions, [0.52, 0.26, 0.08]);
  assert.equal(mount.height, 1.2);
  assert.equal(mount.child, "laptop");
  assert.equal(mount.url, "https://example.com/shelf");
  for (const token of [
    "wall_shelf HEIGHT 9",
    "wall_shelf HEIGHT 1..2",
    "wall_shelf~north",
    "wall_shelf@90",
  ])
    assert.throws(() =>
      parseProgram(room().replace("LAYOUT main", `MOUNT north 1 ${token}\nLAYOUT main`)),
    );
  assert.throws(
    () =>
      parseProgram(
        room().replace("LAYOUT main", "MOUNT north 1 wall_shelf(missing_on_top)\nLAYOUT main"),
      ),
    /Missing LAYOUT/,
  );
});

test("mounted sub-layouts respect expanded asset and light budgets", () => {
  const many = Array(33)
    .fill("wall_shelf(items_on_top)")
    .map((token) => `MOUNT north 1 ${token}`)
    .join("\n");
  assert.throws(
    () =>
      parseProgram(
        room().replace("LAYOUT main", many + "\nLAYOUT main") +
          "\nLAYOUT items\n" +
          Array(33).fill("book").join(" | ") +
          "\nEND",
      ),
    /expanded furniture/,
  );
  assert.throws(
    () =>
      parseProgram(
        room().replace("LAYOUT main", "MOUNT north 1 wall_shelf(items_on_top)\nLAYOUT main") +
          "\nLAYOUT items\n" +
          Array(65).fill("table_lamp").join(" | ") +
          "\nEND",
      ),
    /64 light fixtures/,
  );
});

test("Apartment keeps mapped rooms and passages, exact balcony depth and raised product furniture", () => {
  const p = parseProgram(examples["Apartment"]);
  assert.equal(p.rooms.length, 7);
  assert.ok(Math.abs(p.rooms.find((room) => room.kind === "balcony").cols * p.grid - 1.56) < 1e-9);
  assert.ok(Math.abs(p.areas.indoor - 60) < 0.1);
  assert.ok(Math.abs(p.areas.total - p.areas.indoor - p.areas.outdoor) < 1e-9);
  assert.equal(
    p.rooms.find((room) => room.name === "study").mounts.find(({ name }) => name === "wall_shelf")
      .height,
    1.2,
  );
  assert.ok(
    p.rooms
      .find((room) => room.name === "living")
      .mounts.some(
        (mount) =>
          mount.name === "floating_tv_console" && mount.side === "north" && mount.height === 0.45,
      ),
  );
  assert.deepEqual(p.warnings, []);
});

test("project details preserve room inventory and safe links as parsed data", () => {
  const p = parseProgram(examples["Apartment"]);
  assert.ok(
    p.details.some(
      (detail) => detail.room === "living" && detail.text.includes("πλυντήριο πιάτων"),
    ),
  );
  assert.ok(
    p.details.some((detail) => detail.room === "study" && detail.text.includes("CMOS ML1220")),
  );
  assert.ok(
    p.details.some((detail) => detail.room === "balcony" && detail.url?.includes("freebox.gr")),
  );
  for (const source of Object.values(examples)) assert.ok(!/^\s*#/mu.test(source));
  const detail = 'Quotes " and # signs <script> remain text';
  const parsed = parseProgram(
    room() + `\nDETAIL main ${JSON.stringify(detail)} <https://example.com/item#part>`,
  );
  assert.equal(parsed.details[0].text, detail);
  assert.equal(parsed.details[0].url, "https://example.com/item#part");
  for (const line of [
    'DETAIL missing "Item"',
    'DETAIL project "Item" <javascript:alert(1)>',
    'DETAIL project ""',
    'DETAIL project "\\q"',
  ])
    assert.throws(() => parseProgram(room() + "\n" + line));
});

test("apartment matches the supplied map and the balcony continues beside the bedroom", () => {
  const p = parseProgram(examples.Apartment),
    rooms = Object.fromEntries(p.rooms.map((room) => [room.name, room]));
  assert.equal(rooms.study.z + rooms.study.rows, rooms.living.z);
  assert.equal(rooms.bathroom.z + rooms.bathroom.rows, rooms.passage.z);
  assert.equal(rooms.passage.z + rooms.passage.rows, rooms.living.z);
  assert.ok(rooms.bathroom.z < rooms.living.z);
  assert.equal(rooms.bedroom.z, rooms.living.z + rooms.living.rows);
  assert.equal(rooms.balcony.x, rooms.living.x + rooms.living.cols);
  assert.equal(rooms.balcony.x, rooms.bedroom.x + rooms.bedroom.cols);
  assert.equal(rooms.balcony.z + rooms.balcony.rows, rooms.bedroom.z + rooms.bedroom.rows);
  assert.ok(!p.rooms.some((room) => room.name === "kitchen"));
  assert.ok(p.layouts.living.flat().some((token) => token?.name === "stove"));
  assert.ok(p.layouts.living.flat().some((token) => token?.name === "grey_sofa"));
  assert.ok(!Object.keys(examples).some((name) => name.includes("Καλαμαριά")));
});

test("the mapped outline preserves recesses without adding floor to unmapped areas", () => {
  const p = parseProgram(examples.Apartment),
    rooms = Object.fromEntries(p.rooms.map((room) => [room.name, room]));
  assert.equal(insideRoom(rooms.bathroom, 0.5, 4.5), false);
  assert.equal(insideRoom(rooms.bathroom, 3, 4.5), true);
  assert.equal(insideRoom(rooms.bedroom, 0.5, 6.5), false);
  assert.equal(insideRoom(rooms.bedroom, 3, 6.5), true);
  assert.equal(insideRoom(rooms.hall, 0.25, 0.25), false);
  assert.equal(insideRoom(rooms.hall, 0.25, 4), true);
  assert.deepEqual(p.warnings, []);
  assert.ok(
    rooms.study.openings.some(
      ({ side, at, kind }) => side === "west" && at > rooms.study.rows / 2 && kind === "door",
    ),
  );
});

test("outline validation rejects crossing, repeated and unbounded edges", () => {
  for (const outline of [
    "0,0 4,0 4,4 0,4 0,0",
    "0,0 4,0 4,3 0,3",
    "0,0 4,0 4,4 1,4 1,1 3,1 3,3 0,3",
    "0,0 4,0 4,4 0,4 0,3 1,3 1,0 0,0",
    "0,0 4,0 4,NaN 0,4",
  ]) {
    assert.throws(
      () => parseProgram(room().replace("LAYOUT", `OUTLINE ${outline}\nLAYOUT`)),
      /OUTLINE/u,
    );
  }
  const counterclockwise = parseProgram(
    room().replace("LAYOUT", "OUTLINE 0,0 0,4 4,4 4,0\nLAYOUT"),
  );
  assert.deepEqual(counterclockwise.rooms[0].footprint, [[0, 0, 4, 4]]);
});

test("rooms can meet inside a recess and shaped walls support furniture", () => {
  const text = [
    "GRID 0.5",
    "ROOM main 4x4 AT 0,0",
    "OUTLINE 0,0 4,0 4,4 2,4 2,2 0,2",
    "WALLS north east south west",
    "DOOR south AT 3 WIDTH 0.8",
    "LAYOUT main",
    ".",
    ".",
    ".",
    ". | . | bookshelf[0.4x0.2x1]~west",
    "END",
    "ROOM inset 2x2 AT 0,2",
    "LAYOUT inset",
    ".",
    "END",
  ].join("\n");
  const p = parseProgram(text),
    token = p.layouts.main[3][2];
  assert.equal(insideRoom(p.rooms[0], 1, 3), false);
  assert.equal(insideRoom(p.rooms[0], 3, 3), true);
  assert.ok(Math.abs(furniturePosition(p, p.rooms[0], token, 2, 3)[0] - 0.13) < 0.001);
  assert.throws(() => parseProgram(text.replace("AT 0,2", "AT 1,2")), /overlap/u);
  assert.throws(() => parseProgram(text.replace("AT 3 WIDTH 0.8", "AT 2 WIDTH 0.8")), /DOOR/u);
});

test("diagonal outlines calculate polygon area, clip corners and share one wall", () => {
  const first = room().replace("LAYOUT", "OUTLINE 0,0 4,0 4,4 2,4 0,2\nLAYOUT"),
    second =
      "ROOM inset 2x2 AT 0,2\nOUTLINE 0,0 2,2 0,2 0,1\nWALLS north east south west\nLAYOUT inset\n.\nEND",
    p = parseProgram(first + "\n" + second),
    main = p.rooms[0],
    diagonal = p.wallSpecs.filter(({ axis }) => axis === "diagonal");
  assert.equal(main.area, 14);
  assert.equal(p.areas.indoor, 16);
  assert.equal(insideRoom(main, 0.1, 3), false);
  assert.equal(insideRoom(main, 1.1, 3), true);
  assert.equal(diagonal.length, 1);
  assert.equal(diagonal[0].rooms.length, 2);
  assert.ok(Math.abs(diagonal[0].max - diagonal[0].min - Math.sqrt(8)) < 1e-9);
  assert.throws(
    () => parseProgram(first + "\n" + second.replace("AT 0,2", "AT 0.25,2")),
    /overlap/,
  );
  const corner = clipPolygon(
    [
      [0, 2],
      [2, 2],
      [2, 4],
      [0, 4],
    ],
    [
      [0, 2],
      [4, 2],
      [4, 4],
      [2, 4],
    ],
  );
  assert.equal(polygonArea(corner), 2);
  assert.ok(corner.every(([x, z]) => insideRoom(main, x, z)));
});

test("areas exclude balconies and gardens from indoor totals and honor fractional dimensions", () => {
  const p = parseProgram(
    room() +
      "\nBALCONY terrace 2.5x4 AT 4.25,0\nLAYOUT terrace\n.\nEND\nGARDEN yard 4x2.25 AT 0,4.5\nLAYOUT yard\n.\nEND",
  );
  assert.deepEqual(p.areas, { indoor: 16, outdoor: 19, total: 35 });
  const diagonal = parseProgram(room().replace("LAYOUT", "OUTLINE 0,0 4,0 4,4 2,4 0,2\nLAYOUT"));
  assert.equal(diagonal.areas.total, 14);
});

test("apartment puts the requested fixtures on their confirmed walls", () => {
  const p = parseProgram(examples.Apartment),
    rooms = Object.fromEntries(p.rooms.map((r) => [r.name, r])),
    find = (roomName, name) => p.layouts[roomName].flat().find((token) => token?.name === name);
  for (const room of p.rooms) assert.deepEqual(room.windows, []);
  assert.equal(
    p.rooms.reduce(
      (count, room) =>
        count + (room.openings || []).filter(({ kind }) => kind === "shutter").length,
      0,
    ),
    3,
  );
  for (const name of ["living", "study", "bedroom"]) {
    assert.equal(rooms[name].openings.filter(({ kind }) => kind === "shutter").length, 1);
    assert.equal(rooms[name].openings.find(({ kind }) => kind === "shutter").side, "east");
  }
  const bathDoor = p.wallSpecs.find(
    (wall) => wall.rooms.includes(rooms.bathroom) && wall.opening?.kind === "door",
  );
  assert.equal(bathDoor.axis, "x");
  assert.equal(bathDoor.coordinate, rooms.bathroom.z + rooms.bathroom.rows);
  assert.ok(bathDoor.rooms.includes(rooms.passage));
  const studyDoor = p.wallSpecs.find(
    (wall) => wall.rooms.includes(rooms.study) && wall.opening?.kind === "door",
  );
  assert.equal(studyDoor.axis, "z");
  assert.equal(studyDoor.coordinate, rooms.study.x);
  assert.ok(studyDoor.rooms.includes(rooms.passage));
  const passageExit = p.wallSpecs.find(
    (wall) => wall.rooms.includes(rooms.passage) && wall.rooms.includes(rooms.living),
  );
  assert.equal(passageExit.opening.kind, "door");
  assert.ok(passageExit.opening.width > 1.5);
  for (const name of ["pitsos_fridge", "sink", "stove", "kitchen_counter"])
    assert.equal(find("living", name).wall, "south");
  assert.equal(find("living", "robot_vacuum").wall, "north");
  assert.equal(find("bedroom", "bed").wall, "south");
  assert.equal(find("bathroom", "toilet").wall, "east");
  assert.ok(
    p.layouts.bathroom
      .slice(0, 4)
      .flat()
      .some((token) => token?.name === "toilet"),
  );
  const air = rooms.living.mounts.find(({ name }) => name === "air_conditioner");
  assert.equal(air.side, "east");
  assert.ok(air.height > 2);
  const position = (roomName, name) => {
    const layout = p.layouts[roomName],
      token = find(roomName, name),
      row = layout.findIndex((cells) => cells.includes(token));
    return furniturePosition(p, rooms[roomName], token, layout[row].indexOf(token), row);
  };
  assert.equal(find("living", "aabenraa_table").yaw, 270);
  const localZ = (roomName, name) =>
    position(roomName, name)[2] + p.center[1] - rooms[roomName].z * p.grid;
  assert.ok(Math.abs(localZ("living", "aabenraa_table") - (air.cell + 0.5) * p.grid) < 0.001);
  assert.equal(find("living", "grey_sofa").yaw, 180);
  const sofa = position("living", "grey_sofa"),
    tv = rooms.living.mounts.find(({ name }) => name === "wall_tv");
  assert.equal(tv.side, "north");
  assert.ok(
    Math.abs((tv.cell + 0.5) * p.grid - (sofa[0] + p.center[0] - rooms.living.x * p.grid)) < 0.001,
  );
  for (const name of ["pitsos_fridge", "sink", "stove", "kitchen_counter"])
    assert.ok(position("living", name)[2] > sofa[2]);
  const curtains = p.rooms.flatMap(({ name: roomName, mounts }) =>
    mounts.filter((token) => token.name === "curtain_pair").map((token) => ({ roomName, token })),
  );
  assert.equal(curtains.length, 3);
  assert.deepEqual(curtains.map(({ roomName }) => roomName).sort(), ["bedroom", "living", "study"]);
  for (const { roomName, token } of curtains) {
    const shutter = rooms[roomName].openings.find(({ kind }) => kind === "shutter");
    assert.equal(token.side, shutter.side);
    assert.equal(token.height, 0);
    assert.ok(Math.abs((token.cell + 0.5) * p.grid - shutter.at * p.grid) < 0.001);
    assert.ok(Math.abs(token.dimensions[0] - shutter.width) < 0.05);
    assert.ok(Math.abs(shutter.width - rooms[roomName].rows * p.grid) < 0.001);
    assert.ok(shutter.full);
  }
  const condenser = find("balcony", "ac_condenser");
  assert.equal(condenser.yaw, 90);
  assert.ok(
    position("balcony", "ac_condenser")[0] + p.center[0] >
      (rooms.balcony.x + rooms.balcony.cols * 0.7) * p.grid,
  );
  const chairs = p.layouts.balcony.flat().filter((token) => token?.name === "hogsten_chair");
  assert.deepEqual(
    chairs.map(({ yaw }) => yaw),
    [0, 180],
  );
  assert.ok(rooms.bedroom.diagonal && rooms.hall.diagonal);
  assert.ok(find("study", "wardrobe") && find("study", "single_bed"));
  assert.ok(find("bathroom", "frameless_shower"));
  const washer = position("bathroom", "washing_machine");
  assert.ok(washer[0] + p.center[0] < (rooms.bathroom.x + rooms.bathroom.openings[0].at) * p.grid);
  assert.ok(rooms.bathroom.area * p.grid ** 2 > 4);
  assert.equal(find("bedroom", "builtin_wardrobe").yaw, 116.565051177078);
  assert.ok(
    !Object.values(p.layouts)
      .flat(2)
      .some((token) => token && /rug|nightstand/.test(token.name)),
  );
  const outsideDoors = p.wallSpecs.filter(
    (wall) => wall.opening?.kind === "door" && wall.rooms.length === 1,
  );
  assert.equal(outsideDoors.length, 1);
  assert.ok(outsideDoors[0].rooms.includes(rooms.hall));
});

test("room labels preserve Greek text, validate their position and stay within source limits", () => {
  const p = parseProgram(examples.Apartment),
    labelled = p.rooms.filter(({ label }) => label);
  assert.equal(labelled.length, 6);
  assert.equal(labelled.find(({ name }) => name === "living").label, "Σαλόνι / κουζίνα");
  for (const r of labelled) assert.ok(insideRoom(r, ...r.labelPoint));
  for (const label of [
    '""',
    JSON.stringify("x".repeat(61)),
    '"line\\nline"',
    '"bad\\q"',
    '"name" AT 5,2',
  ])
    assert.throws(() => parseProgram(room().replace("LAYOUT", `LABEL ${label}\nLAYOUT`)), /LABEL/u);
  assert.throws(() => parseProgram('LABEL "Unknown"\n' + room()), /LABEL/u);
});

test("explicit shared doors agree and remain within the rendered wall segment", () => {
  const first = room().replace("LAYOUT main", "DOOR east AT 1 WIDTH 0.8\nDOORS none\nLAYOUT main"),
    neighbor = room()
      .replaceAll("main", "next")
      .replace("AT 0,0", "AT 4,0")
      .replace("4x4", "2x2")
      .replace("LAYOUT next", "DOOR west AT 1 WIDTH 0.8\nLAYOUT next"),
    p = parseProgram(first + "\n" + neighbor),
    shared = p.wallSpecs.filter(({ rooms }) => rooms.length === 2);
  assert.equal(shared.length, 1);
  assert.equal(shared[0].opening.coordinate, 1);
  assert.equal(shared[0].opening.width, 0.8);
  assert.ok(p.rooms[0].doors.includes("east"));
  assert.throws(
    () => parseProgram(first + "\n" + neighbor.replace("WIDTH 0.8", "WIDTH 0.9")),
    /matching DOOR/u,
  );
  assert.throws(
    () => parseProgram(first.replace("AT 1 WIDTH", "AT 2 WIDTH") + "\n" + neighbor),
    /shared wall boundary/u,
  );
  assert.throws(
    () =>
      parseProgram(
        room().replace(
          "LAYOUT main",
          "DOOR north AT 1 WIDTH 0.8\nDOOR north AT 3 WIDTH 0.8\nLAYOUT main",
        ),
      ),
    /matching DOOR/u,
  );
  assert.throws(
    () =>
      parseProgram(
        room().replace("LAYOUT main", "DOOR north AT 1 WIDTH 0.8\n".repeat(9) + "LAYOUT main"),
      ),
    /eight DOOR/u,
  );
});

test("shaped rooms reject fixtures in recesses and unsupported pitched roofs", () => {
  const shaped = room().replace("LAYOUT main", "OUTLINE 0,0 4,0 4,4 2,4 2,2 0,2\nLAYOUT main");
  assert.throws(
    () => parseProgram(shaped.replace("LAYOUT main", "LIGHT ceiling_light AT 0,3\nLAYOUT main")),
    /LIGHT must be inside/u,
  );
  assert.ok(parseProgram(shaped.replace("LAYOUT main", "LIGHT ceiling_light AT 3,3\nLAYOUT main")));
  assert.ok(parseProgram("ROOF flat\n" + shaped));
  for (const roof of ["pitched", "terracotta"]) {
    assert.throws(() => parseProgram(`ROOF ${roof}\n` + shaped), /Pitched roofs need rectangular/u);
  }
});

test("mounted shelves fit their full supporting edge beside outline recesses", () => {
  const shaped = room().replace(
      "LAYOUT main",
      "OUTLINE 0,0 4,0 4,4 2,4 2,2 0,2\nMOUNT west 3 wall_shelf[0.8x0.2x0.08] HEIGHT 1.2\nLAYOUT main",
    ),
    p = parseProgram(shaped),
    shelf = p.rooms[0].mounts[0];
  assert.equal(shelf.edge.across, 2);
  assert.equal(shelf.edge.min, 2);
  assert.equal(shelf.edge.max, 4);
  assert.throws(
    () => parseProgram(shaped.replace("[0.8x0.2x0.08]", "[3.2x0.2x0.08]")),
    /MOUNT must fit/u,
  );
  assert.throws(
    () =>
      parseProgram(shaped.replace("west 3", "west 2").replace("[0.8x0.2x0.08]", "[1.2x0.2x0.08]")),
    /MOUNT must fit/u,
  );
  const apartment = parseProgram(examples.Apartment),
    study = apartment.rooms.find(({ name }) => name === "study"),
    mountedShelf = study.mounts.find(({ name }) => name === "wall_shelf");
  assert.equal(mountedShelf.side, "south");
  assert.equal(mountedShelf.cell, 2);
});

test("full balcony shutters span one continuous edge and preserve shared-wall ownership", () => {
  const text =
      room().replace("LAYOUT main", "SHUTTER east FULL\nLAYOUT main") +
      "\nBALCONY terrace 2x4 AT 4,0\nWALLS west\nLAYOUT terrace\n.\nEND",
    p = parseProgram(text),
    shutter = p.rooms[0].openings[0],
    shared = p.wallSpecs.find((wall) => wall.rooms.length === 2);
  assert.equal(shutter.at, 2);
  assert.equal(shutter.width, 4);
  assert.equal(shared.opening.kind, "shutter");
  assert.equal(shared.opening.width, 4);
  assert.throws(() => parseProgram(text.replace("SHUTTER east FULL", "DOOR east FULL")), /FULL/u);
  assert.throws(
    () => parseProgram(text.replace("2x4 AT 4,0", "2x2 AT 4,0")),
    /shared wall boundary/u,
  );
  assert.throws(
    () =>
      parseProgram(
        room().replace(
          "LAYOUT main",
          "OUTLINE 0,0 4,0 4,2 2,2 2,4 0,4\nSHUTTER east FULL\nLAYOUT main",
        ),
      ),
    /continuous wall edge/u,
  );
});

test("curtains can mount at fractional wall centres without overflowing their support", () => {
  const text = room().replace(
      "LAYOUT main",
      "MOUNT east 1.5 curtain_pair[3.95x0.12x2.16] HEIGHT 0\nLAYOUT main",
    ),
    curtain = parseProgram(text).rooms[0].mounts[0];
  assert.equal(curtain.cell, 1.5);
  assert.equal(curtain.height, 0);
  assert.throws(() => parseProgram(text.replace("east 1.5", "east 1.6")), /MOUNT must fit/u);
  assert.throws(() => parseProgram(text.replace("HEIGHT 0", "HEIGHT 1")), /MOUNT HEIGHT/u);
});
