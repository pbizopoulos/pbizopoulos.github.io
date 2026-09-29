/* eslint-disable max-lines, max-lines-per-function, prefer-named-capture-group, no-magic-numbers, id-length, max-statements, max-params, complexity, max-depth, one-var, sort-vars, func-style, no-use-before-define, unicorn/consistent-function-scoping, no-ternary, no-nested-ternary, unicorn/no-nested-ternary, init-declarations, no-undefined, no-continue, unicorn/no-array-for-each, oxc/no-optional-chaining, oxc/no-async-await, unicorn/prefer-top-level-await */ (async () => {
  const referenceCatalog = {
    awning: [3.6, 1.8, 2.65],
    canopy_bed: [1.55, 2.05, 1.95],
    fireplace: [1.35, 0.65, 2.7],
    folding_chair: [0.5, 0.58, 0.88],
    garment_rack: [1.05, 0.5, 1.7],
    gym_bench: [0.65, 1.45, 1.1],
    kitchenette: [2.4, 0.65, 2.25],
    slatted_table: [0.85, 0.85, 0.75],
    sofa_bed: [1.9, 0.85, 0.85],
    timber_rail: [2.4, 0.1, 1.05],
    towel_stack: [0.48, 0.32, 0.24],
    woven_chair: [0.68, 0.75, 0.85],
  };
  function addReferenceAsset(name, group) {
    const m = material;
    if (!referenceCatalog[name]) {
      return;
    }
    const [w, d, h] = referenceCatalog[name],
      b = (width, height, depth, x, y, z, finish = m.wood) =>
        box(group, width, height, depth, x, y, z, finish),
      rod = (startPoint, endPoint, radius = 0.018, finish = m.wood) => {
        const start = new THREE.Vector3(...startPoint),
          end = new THREE.Vector3(...endPoint),
          part = cylinder(group, radius, radius, start.distanceTo(end), 0, 0, 0, finish, 12);
        part.position.copy(start).add(end).multiplyScalar(0.5);
        part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
        return part;
      };
    if (name === "awning") {
      b(w, 0.12, 0.13, 0, h - 0.06, -d / 2, m.white);
      const canopy = b(w, 0.025, d, 0, h - 0.22, 0, m.ochre);
      canopy.rotation.x = 0.2;
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, 0);
      shape.lineTo(w / 2, 0);
      shape.lineTo(w / 2, -0.12);
      for (let i = 8; i > 0; i -= 1) {
        const x = -w / 2 + (i * w) / 8;
        shape.quadraticCurveTo(x - w / 16, -0.26, x - w / 8, -0.12);
      }
      shape.closePath();
      const valance = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, curveSegments: 4, depth: 0.018 }),
        m.ochre,
      );
      valance.position.set(0, h - 0.4, d / 2 - 0.02);
      valance.castShadow = true;
      valance.receiveShadow = true;
      group.add(valance);
      for (const side of [-1, 1]) {
        rod([side * w * 0.4, h - 0.15, -d / 2], [side * w * 0.3, h - 0.5, 0], 0.018, m.white);
        rod([side * w * 0.3, h - 0.5, 0], [side * w * 0.4, h - 0.43, d / 2], 0.018, m.white);
      }
    } else if (name === "fireplace") {
      b(w, 0.22, d, 0, 0.11, 0, m.plaster);
      b(w + 0.08, 0.055, d + 0.05, 0, 0.25, 0, m.slate);
      b(w - 0.24, 0.85, 0.07, 0, 0.68, -d / 2 + 0.04, m.stone);
      for (const side of [-1, 1]) {
        b(0.14, 0.88, d, side * (w / 2 - 0.07), 0.7, 0, m.plaster);
      }
      for (let row = 0; row < 6; row += 1) {
        b(w - 0.28, 0.008, 0.01, 0, 0.32 + row * 0.13, -d / 2 + 0.08, m.slate);
        for (let col = 0; col < 3; col += 1) {
          b(
            0.008,
            0.12,
            0.01,
            -0.42 + col * 0.34 + (row % 2) * 0.12,
            0.38 + row * 0.13,
            -d / 2 + 0.08,
            m.slate,
          );
        }
      }
      b(w + 0.13, 0.07, d + 0.07, 0, 1.17, 0, m.woodDark);
      const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.68, 1.46, 4, 1), m.plaster);
      hood.rotation.y = Math.PI / 4;
      hood.scale.z = 0.6;
      hood.position.set(0, 1.97, -0.02);
      hood.castShadow = true;
      hood.receiveShadow = true;
      group.add(hood);
      rod([-0.3, 0.32, 0.07], [0.3, 0.34, 0.12], 0.055, m.woodDark);
    } else if (name === "canopy_bed") {
      b(w, 0.2, d, 0, 0.22, 0);
      b(w - 0.08, 0.2, d - 0.08, 0, 0.42, 0, m.cream);
      b(w - 0.04, 0.07, d * 0.7, 0, 0.55, 0.25, m.linen);
      b(w - 0.02, 0.018, 0.4, 0, 0.592, 0.55, m.cream);
      for (const side of [-1, 1]) {
        rod(
          [side * (w / 2 - 0.035), 0, -d / 2 + 0.04],
          [side * (w / 2 - 0.035), h, -d / 2 + 0.04],
          0.028,
        );
        b(0.6, 0.12, 0.38, side * 0.36, 0.57, -0.68, m.linen).rotation.y = side * 0.08;
      }
      rod([-0.15, 0.67, 0.3], [-0.15, 0.67, 0.58], 0.075, m.cream);
      rod([0.06, 0.67, 0.3], [0.06, 0.67, 0.58], 0.075, m.cream);
      rod([-w / 2, h - 0.03, -d / 2 + 0.04], [w / 2, h - 0.03, -d / 2 + 0.04], 0.028);
      rod([-w / 2, 0.7, d / 2 - 0.04], [w / 2, 0.7, d / 2 - 0.04], 0.026);
      for (const side of [-1, 1]) {
        rod(
          [side * (w / 2 - 0.035), 0, d / 2 - 0.04],
          [side * (w / 2 - 0.035), 0.72, d / 2 - 0.04],
          0.026,
        );
      }
    } else if (name === "garment_rack") {
      for (const side of [-1, 1]) {
        for (const front of [-1, 1]) {
          rod([(side * w) / 2, 0, (front * d) / 2], [side * w * 0.4, h, 0], 0.025);
        }
      }
      rod([-w / 2, h - 0.04, 0], [w / 2, h - 0.04, 0], 0.024);
      for (let i = 0; i < 7; i += 1) {
        b(0.025, 0.025, d - 0.06, -0.43 + i * 0.143, 0.22, 0);
      }
      for (const x of [-0.25, 0.12]) {
        rod([x, h - 0.1, 0], [x - 0.17, h - 0.28, 0], 0.012);
        rod([x - 0.17, h - 0.28, 0], [x + 0.17, h - 0.28, 0], 0.012);
        rod([x + 0.17, h - 0.28, 0], [x, h - 0.1, 0], 0.012);
      }
    } else if (name === "slatted_table") {
      for (const x of [-1, 1]) {
        for (const z of [-1, 1]) {
          b(0.045, h - 0.04, 0.045, x * (w / 2 - 0.06), (h - 0.04) / 2, z * (d / 2 - 0.06));
        }
      }
      for (let i = 0; i < 9; i += 1) {
        b(w / 10, 0.045, d, ((i - 4) * w) / 9, h - 0.023, 0);
      }
      for (const side of [-1, 1]) {
        b(w, 0.075, 0.035, 0, h - 0.08, side * (d / 2 - 0.03));
      }
    } else if (name === "folding_chair" || name === "woven_chair") {
      const woven = name === "woven_chair";
      for (const side of [-1, 1]) {
        rod([side * w * 0.42, 0, -d * 0.4], [side * w * 0.42, 0.5, d * 0.3], 0.023);
        rod([side * w * 0.42, 0, d * 0.4], [side * w * 0.42, h, -d * 0.38], 0.023);
        if (woven) {
          b(0.06, 0.035, d * 0.8, side * w * 0.46, 0.63, 0);
        }
      }
      for (let i = 0; i < 7; i += 1) {
        b(w * 0.82, 0.025, d / 10, 0, 0.45, ((i - 3) * d) / 10, woven ? m.linen : m.wood);
        b(w * 0.82, 0.035, 0.027, 0, 0.58 + i * 0.04, -d * 0.35, woven ? m.linen : m.wood);
        if (woven) {
          b(0.04, 0.29, 0.032, ((i - 3) * w) / 9, 0.7, -d * 0.35 + 0.014, m.cream);
        }
      }
    } else if (name === "sofa_bed") {
      for (const x of [-0.78, 0.78]) {
        for (const z of [-0.28, 0.28]) {
          rod([x, 0, z], [x, 0.23, z], 0.035);
        }
      }
      b(w, 0.16, d, 0, 0.3, 0, m.woodDark);
      for (let i = 0; i < 3; i += 1) {
        b(w / 3 - 0.012, 0.15, d - 0.1, ((i - 1) * w) / 3, 0.45, 0.04, m.linen);
        b(w / 3 - 0.012, 0.42, 0.16, ((i - 1) * w) / 3, 0.65, -0.32, m.linen).rotation.x = -0.12;
      }
      b(0.32, 0.32, 0.13, 0.65, 0.67, -0.15, m.ochre).rotation.z = -0.18;
    } else if (name === "kitchenette") {
      b(w, 0.12, d - 0.08, 0, 0.06, 0, m.slate);
      b(w, 0.75, d - 0.04, 0, 0.49, 0, m.white);
      b(w + 0.03, 0.055, d + 0.03, 0, 0.9, 0);
      for (let i = 0; i < 4; i += 1) {
        const x = ((i - 1.5) * w) / 4;
        b(w / 4 - 0.018, 0.67, 0.035, x, 0.49, d / 2, m.white);
        b(w / 4 - 0.1, 0.54, 0.018, x, 0.49, d / 2 + 0.023, m.plaster);
        b(0.19, 0.02, 0.035, x, 0.73, d / 2 + 0.04);
        b(w / 4 - 0.016, 0.65, 0.32, x, h - 0.325, -0.16, m.white);
        b(w / 4 - 0.09, 0.55, 0.02, x, h - 0.325, 0.012, i < 2 ? m.screen : m.plaster);
        b(0.018, 0.09, 0.03, x + 0.19, h - 0.54, 0.03);
      }
      b(0.65, 0.012, 0.43, -0.48, 0.934, 0.02, m.metal);
      b(0.52, 0.013, 0.32, -0.48, 0.941, 0.02, m.slate);
      rod([-0.48, 0.94, -0.21], [-0.48, 1.22, -0.21], 0.018, m.metal);
      rod([-0.48, 1.22, -0.21], [-0.48, 1.22, -0.04], 0.018, m.metal);
      b(0.53, 0.018, 0.48, 0.86, 0.94, 0, m.screen);
      b(0.47, 0.46, 0.015, 0.9, 0.47, d / 2 + 0.055, m.screen);
      b(0.36, 0.025, 0.035, 0.9, 0.72, d / 2 + 0.075, m.metal);
    } else if (name === "timber_rail") {
      for (let i = 0; i <= 12; i += 1) {
        b(0.035, h - 0.1, 0.035, -w / 2 + (i * w) / 12, h / 2, 0, m.woodDark);
      }
      for (const y of [0.06, h - 0.03]) {
        b(w + 0.04, 0.06, d, 0, y, 0, m.woodDark);
      }
    } else if (name === "towel_stack") {
      for (const x of [-0.12, 0.12]) {
        rod([x, 0.08, -0.15], [x, 0.08, 0.15], 0.08, m.cream);
      }
      rod([0, 0.19, -0.14], [0, 0.19, 0.14], 0.07, m.linen);
    } else if (name === "gym_bench") {
      for (const z of [-0.5, 0.5]) {
        b(w, 0.055, 0.065, 0, 0.04, z, m.screen);
        rod([0, 0.06, z], [0, 0.4, z * 0.5], 0.035, m.metal);
      }
      b(0.42, 0.1, 0.45, 0, 0.43, 0.4, m.screen);
      b(0.42, 0.1, 0.9, 0, 0.75, -0.18, m.screen).rotation.x = 0.7;
    }
  }
  function referenceApartment() {
    const room = (name, floor, cols, rows, x, z, items, extra = {}) => {
      const area = {
        cols,
        floor,
        items,
        name,
        rows,
        style: "mediterranean",
        walls: ["north", "east", "south", "west"],
        x,
        z,
      };
      return Object.assign(area, extra);
    };
    return buildExample(
      "",
      0.75,
      [
        room(
          "guest_suite",
          0,
          8,
          10,
          0,
          0,
          [
            [2, 2, "bed(pillows_on_top)"],
            [0, 2, "nightstand"],
            [4, 2, "nightstand"],
            [6, 1, "garment_rack"],
            [1, 7, "sofa_bed@90"],
            [4, 5, "rug"],
          ],
          { doors: ["east", "south"], mounts: [["north", 2, "painting"]] },
        ),
        room(
          "lower_stair_hall",
          0,
          5,
          10,
          8,
          0,
          [
            [1, 4, "stairs"],
            [3, 1, "washing_machine"],
            [3, 8, "laundry_basket"],
          ],
          { doors: ["west", "south"] },
        ),
        room(
          "fitness_room",
          0,
          8,
          4,
          0,
          10,
          [
            [2, 1, "gym_bench"],
            [5, 1, "desk"],
            [5, 2, "chair@180"],
          ],
          { doors: ["north"], mounts: [["south", 2, "poster"]] },
        ),
        room(
          "lower_bath",
          0,
          5,
          4,
          8,
          10,
          [
            [0, 2, "vanity~west"],
            [4, 2, "shower"],
            [2, 3, "toilet~south"],
          ],
          { doors: ["north"], mounts: [["west", 2, "mirror"]] },
        ),
        room(
          "living_kitchen",
          1,
          8,
          10,
          0,
          0,
          [
            [5, 1, "kitchenette~north"],
            [7, 2, "fridge~east"],
            [1, 1, "fireplace~north"],
            [1, 5, "sofa_bed@90"],
            [3, 7, "woven_chair@30"],
            [5, 6, "coffee_table"],
            [5, 3, "rug"],
            [0, 8, "plant"],
          ],
          {
            doors: ["east", "south"],
            mounts: [
              ["west", 3, "painting"],
              ["east", 8, "air_conditioner"],
            ],
          },
        ),
        room(
          "main_stair_hall",
          1,
          5,
          10,
          8,
          0,
          [
            [3, 4, "stairs@180"],
            [0, 8, "shoe_rack"],
          ],
          { doors: ["west", "north"] },
        ),
        room(
          "garden_terrace",
          1,
          8,
          4,
          0,
          10,
          [
            [4, 1, "awning[5.7x2.8x2.65]"],
            [4, 2, "dining_table"],
            [2, 2, "folding_chair@90"],
            [6, 2, "folding_chair@270"],
            [0, 2, "planter@90"],
          ],
          { kind: "balcony", rails: ["east", "west"] },
        ),
        room(
          "upper_bedroom",
          2,
          8,
          10,
          0,
          0,
          [
            [1, 1, "bed[0.9x2x0.56]"],
            [3, 1, "bed[0.9x2x0.56]"],
            [2, 6, "canopy_bed"],
            [0, 6, "side_table"],
            [4, 6, "side_table(towels_on_top)"],
            [6, 1, "garment_rack"],
            [1, 8, "rug"],
          ],
          {
            doors: ["east", "south"],
            mounts: [
              ["west", 5, "painting"],
              ["east", 1, "air_conditioner"],
            ],
          },
        ),
        room("upper_landing", 2, 5, 10, 8, 0, [[1, 8, "console_table"]], { doors: ["west"] }),
        room(
          "sunny_balcony",
          2,
          8,
          3,
          0,
          10,
          [
            [4, 1, "awning[5.7x2.1x2.65]"],
            [2, 1, "slatted_table"],
            [1, 1, "folding_chair@90"],
            [3, 1, "folding_chair@270"],
            [6, 1, "planter"],
          ],
          { kind: "balcony", rails: ["south", "east", "west"] },
        ),
      ],
      { pillows: ["pillow | pillow"], towels: ["towel_stack"] },
    );
  }
  const THREE = await import("three"),
    { mergeGeometries } = await import("three/addons/utils/BufferGeometryUtils.js"),
    { OrbitControls } = await import("three/addons/controls/OrbitControls.js"),
    { RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js"),
    { EditorState, StateEffect, StateField } = await import("@codemirror/state"),
    { EditorView, Decoration, keymap, lineNumbers, drawSelection } =
      await import("@codemirror/view"),
    {
      foldService,
      foldGutter,
      codeFolding,
      foldKeymap,
      foldAll,
      unfoldAll,
      foldedRanges,
      unfoldEffect,
    } = await import("@codemirror/language"),
    { defaultKeymap, history, historyKeymap, indentWithTab } = await import("@codemirror/commands"),
    lightAssets = [
      "ceiling_light",
      "fluorescent_light",
      "pendant_light",
      "track_light",
      "downlight",
      "garden_lamp",
      "lantern",
      "lamp",
      "table_lamp",
      "wall_lamp",
    ],
    overheadLights = lightAssets.slice(0, 5);
  function sharedWall(room, other, dir) {
    if (room === other || room.floor !== other.floor) {
      return false;
    }
    const horizontalOverlap = other.x < room.x + room.cols && other.x + other.cols > room.x,
      verticalOverlap = other.z < room.z + room.rows && other.z + other.rows > room.z;
    return dir === "north"
      ? other.z + other.rows === room.z && horizontalOverlap
      : dir === "south"
        ? other.z === room.z + room.rows && horizontalOverlap
        : dir === "east"
          ? other.x === room.x + room.cols && verticalOverlap
          : other.x + other.cols === room.x && verticalOverlap;
  }
  function wallThickness(program, room, side) {
    return program.rooms.some((other) => sharedWall(room, other, side))
      ? program.interiorWallThickness
      : program.exteriorWallThickness;
  }
  function enrichExample(source, parse, name = "") {
    const program = parse(source),
      lines = source.split("\n");
    for (const room of program.rooms) {
      const additions = [];
      if (room.kind !== "balcony") {
        const exterior = ["north", "east", "south", "west"].filter(
            (dir) => !program.rooms.some((other) => sharedWall(room, other, dir)),
          ),
          walls = [...new Set([...room.walls, ...exterior])],
          wallCommand = `WALLS ${walls.join(" ") || "none"}`;
        if (room.wallsLine) {
          lines[room.wallsLine - 1] = wallCommand;
        } else {
          additions.push(wallCommand);
        }
        const eligible = exterior.filter(
            (dir) =>
              (dir === "east" || dir === "west" ? room.rows : room.cols) * program.grid > 2.2,
          ),
          doors = [...room.doors];
        if (
          eligible.length > 0 &&
          eligible.every((dir) => doors.includes(dir)) &&
          doors.length > 1
        ) {
          doors.splice(doors.indexOf(eligible[0]), 1);
          const doorCommand = `DOORS ${doors.join(" ")}`;
          if (room.doorsLine) {
            lines[room.doorsLine - 1] = doorCommand;
          } else {
            additions.push(doorCommand);
          }
        }
        const windows = eligible.filter((dir) => !doors.includes(dir)),
          command = `WINDOWS ${windows.join(" ") || "none"}`;
        if (room.windowsLine) {
          lines[room.windowsLine - 1] = command;
        } else {
          additions.push(command);
        }
        if (windows.length === 0) {
          additions.push("# Enclosed room: artificial lighting; no eligible exterior window wall.");
        }
      }
      const existing =
          program.layouts[room.name]
            .flat()
            .filter((token) => token && lightAssets.includes(token.name)).length +
          room.mounts.filter((mount) => mount.name === "wall_lamp").length +
          room.lights.length,
        desired = Math.max(
          room.kind === "balcony" ? 1 : 2,
          Math.min(6, Math.ceil((room.cols * room.rows * program.grid ** 2) / 24)),
        ),
        occupiedLights = [];
      for (let i = existing; i < desired; i += 1) {
        const fraction = (i + 1) / (desired + 1);
        let x = ((room.cols - 1) * fraction).toFixed(1),
          z = ((room.rows - 1) * (i % 2 ? 0.65 : 0.35)).toFixed(1);
        const asset =
          room.kind === "balcony"
            ? i % 2
              ? "lantern"
              : "garden_lamp"
            : room.style === "industrial"
              ? "track_light"
              : room.style === "liminal"
                ? "fluorescent_light"
                : room.style === "aquatic"
                  ? "downlight"
                  : i % 2
                    ? "pendant_light"
                    : "downlight";
        if (room.kind === "balcony") {
          const candidates = [],
            layout = program.layouts[room.name];
          for (let row = 0; row < room.rows; row += 1) {
            for (let col = 0; col < room.cols; col += 1) {
              const clear =
                !layout[row]?.[col] &&
                !occupiedLights.some((p) => Math.hypot(p.x - col, p.z - row) < 1) &&
                layout.every((tokens, r) =>
                  tokens.every((token, c) => {
                    if (!token) {
                      return true;
                    }
                    const angle = (token.yaw * Math.PI) / 180,
                      [w, d] = token.dimensions,
                      halfX =
                        (Math.abs(w * Math.cos(angle)) + Math.abs(d * Math.sin(angle)) + 0.35) / 2,
                      halfZ =
                        (Math.abs(w * Math.sin(angle)) + Math.abs(d * Math.cos(angle)) + 0.35) / 2;
                    return (
                      Math.abs((col - c) * program.grid) > halfX ||
                      Math.abs((row - r) * program.grid) > halfZ
                    );
                  }),
                );
              if (clear) {
                candidates.push({ x: col, z: row });
              }
            }
          }
          const [nearest] = candidates.toSorted(
            (a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z),
          );
          if (!nearest) {
            continue;
          }
          ({ x, z } = nearest);
          occupiedLights.push(nearest);
        }
        additions.push(`LIGHT ${asset} AT ${x},${z} POWER ${room.kind === "balcony" ? 8 : 18}`);
      }
      lines[room.line - 1] += additions.length > 0 ? `\n${additions.join("\n")}` : "";
    }
    const site = /lunar/iu.test(name)
        ? "sand"
        : /cloud city/iu.test(name)
          ? "none"
          : /rooftop|drowned/iu.test(name)
            ? "paving"
            : "grass",
      facade = /lunar|museum/iu.test(name)
        ? "concrete"
        : /loft|library/iu.test(name)
          ? "brick"
          : "plaster";
    return `WALL_THICKNESS 0.24 0.12\nSITE ${site} 5\nFACADE ${facade}\nROOF flat\n${lines.join("\n")}`;
  }
  function facadeMaterial(kind) {
    if (kind === "none") {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d"),
      colors = { brick: "#a56e50", concrete: "#a6aaa7", plaster: "#d6cdbb", timber: "#9e7955" };
    ctx.fillStyle = colors[kind];
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = kind === "brick" ? "#c5bcb0" : "#776d60";
    ctx.lineWidth = kind === "brick" ? 3 : 1;
    if (kind === "brick" || kind === "timber") {
      for (let y = 0; y <= 128; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(128, y);
        ctx.stroke();
        if (kind === "brick") {
          for (let x = ((y / 16) % 2) * 32; x <= 128; x += 64) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 16);
            ctx.stroke();
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const material = new THREE.MeshStandardMaterial({
      bumpMap: texture,
      bumpScale: kind === "brick" ? 0.018 : 0.004,
      map: texture,
      roughness: 0.85,
    });
    material.userData.ownedTexture = true;
    return material;
  }
  function applyFacade(mesh, dir, finish) {
    if (!finish) {
      return;
    }
    const index = { east: 0, north: 5, south: 4, west: 1 }[dir];
    mesh.material = Array.from({ length: 6 }).fill(mesh.material);
    mesh.material[index] = finish;
    const { position, uv } = mesh.geometry.attributes,
      face = mesh.geometry.groups[index],
      indices = mesh.geometry.index;
    for (let i = face.start; i < face.start + face.count; i += 1) {
      const vertex = indices.getX(i);
      uv.setXY(
        vertex,
        dir === "east" || dir === "west"
          ? position.getZ(vertex) + mesh.position.z
          : position.getX(vertex) + mesh.position.x,
        position.getY(vertex) + mesh.position.y,
      );
    }
  }
  function addExterior(program, root, ceilings, addBox) {
    const finish = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.9 }),
      trim = finish("#aaa497"),
      roof = finish(program.roof === "pitched" ? "#655149" : "#69716e"),
      width = program.cols * program.grid,
      depth = program.rows * program.grid;
    if (program.site !== "none") {
      const group = new THREE.Group();
      root.add(group);
      const ground = finish({ grass: "#748961", paving: "#a5aaa5", sand: "#bcad88" }[program.site]);
      addBox(
        group,
        width + program.margin * 2,
        0.12,
        depth + program.margin * 2,
        0,
        -0.27,
        0,
        ground,
      );
      for (const sign of [-1, 1]) {
        addBox(group, width + 2, 0.04, 1, 0, -0.19, sign * (depth / 2 + 0.5), trim);
        addBox(group, 1, 0.04, depth, sign * (width / 2 + 0.5), -0.19, 0, trim);
      }
    }
    for (const room of program.rooms) {
      if (room.kind === "balcony") {
        continue;
      }
      const w = room.cols * program.grid,
        d = room.rows * program.grid,
        base = new THREE.Group();
      base.userData.floor = room.floor;
      root.add(base);
      if (room.floor === 0 && program.site !== "none") {
        addBox(base, w + 0.14, 0.18, d + 0.14, room.centerX, -0.19, room.centerZ, trim);
      }
      const covered = program.rooms.some(
        (other) =>
          other.floor > room.floor &&
          other.x < room.x + room.cols &&
          other.x + other.cols > room.x &&
          other.z < room.z + room.rows &&
          other.z + other.rows > room.z,
      );
      if (covered || program.roof === "none") {
        continue;
      }
      const cap = new THREE.Group();
      cap.userData.floor = room.floor;
      root.add(cap);
      ceilings.push(cap);
      cap.position.set(room.centerX, room.elevation + 2.82, room.centerZ);
      if (program.roof === "pitched") {
        const shape = new THREE.Shape();
        shape.moveTo(-w / 2 - 0.2, 0);
        shape.lineTo(0, Math.min(w * 0.3, 2));
        shape.lineTo(w / 2 + 0.2, 0);
        shape.closePath();
        const geometry = new THREE.ExtrudeGeometry(shape, {
          bevelEnabled: false,
          depth: d + 0.4,
          steps: 1,
        });
        geometry.translate(0, 0, -d / 2 - 0.2);
        const mesh = new THREE.Mesh(geometry, roof);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cap.add(mesh);
      } else {
        addBox(cap, w + 0.24, 0.12, d + 0.24, 0, 0, 0, roof);
        for (const dir of room.walls) {
          if (program.rooms.some((other) => sharedWall(room, other, dir))) {
            continue;
          }
          const vertical = dir === "east" || dir === "west";
          addBox(
            cap,
            vertical ? 0.12 : w + 0.24,
            0.2,
            vertical ? d + 0.24 : 0.12,
            dir === "east" ? w / 2 : dir === "west" ? -w / 2 : 0,
            0.12,
            dir === "south" ? d / 2 : dir === "north" ? -d / 2 : 0,
            trim,
          );
        }
      }
    }
  }
  function mergedEnclosure(root, material) {
    const copy = root.clone(true),
      parts = [];
    copy.traverse((node) => {
      node.visible = true;
      if (node.userData.fullHeight) {
        node.scale.y = 1;
      }
    });
    copy.updateMatrixWorld(true);
    copy.traverse((node) => {
      if (!node.isMesh || !node.castShadow) {
        return;
      }
      const geometry = node.geometry.index ? node.geometry.toNonIndexed() : node.geometry.clone();
      geometry.applyMatrix4(node.matrixWorld);
      for (const name of Object.keys(geometry.attributes)) {
        if (name !== "position") {
          geometry.deleteAttribute(name);
        }
      }
      parts.push(geometry);
    });
    if (parts.length === 0) {
      return;
    }
    const geometry = mergeGeometries(parts);
    parts.forEach((part) => part.dispose());
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  }
  const decorCatalog = {
      mirror: [0.6, 0.06, 0.9],
      painting: [0.85, 0.055, 0.65],
      poster: [0.6, 0.025, 0.85],
      vase: [0.22, 0.22, 0.34],
      wall_clock: [0.32, 0.06, 0.32],
      wall_shelf: [0.8, 0.22, 0.32],
    },
    wallDecor = ["poster", "painting", "mirror", "wall_clock", "wall_shelf"];
  function addDecoration(group, name, addBox) {
    if (!decorCatalog[name]) {
      return;
    }
    group.userData.detailed = false;
    const [w, d, h] = decorCatalog[name],
      material = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.78 }),
      frame = material("#6a4a35"),
      paper = material("#f3e4c7"),
      ink = material("#285d64"),
      accent = material("#c36d42"),
      mesh = (geometry, finish, x = 0, y = 0, z = 0) => {
        const part = new THREE.Mesh(geometry, finish);
        part.position.set(x, y, z);
        part.castShadow = true;
        part.receiveShadow = true;
        group.add(part);
        return part;
      };
    if (name === "vase") {
      const profile = [
        [0.055, 0],
        [0.09, 0.025],
        [0.11, 0.11],
        [0.075, 0.23],
        [0.045, 0.3],
        [0.05, 0.34],
        [0.04, 0.34],
        [0.035, 0.3],
        [0.065, 0.23],
        [0.1, 0.11],
        [0.075, 0.025],
      ];
      mesh(
        new THREE.LatheGeometry(
          profile.map(([x, y]) => new THREE.Vector2(x, y)),
          24,
        ),
        accent,
      );
    } else if (name === "wall_clock") {
      const rim = mesh(new THREE.CylinderGeometry(w / 2, w / 2, d, 32), frame, 0, h / 2);
      rim.rotation.x = Math.PI / 2;
      for (let i = 0; i < 12; i += 1) {
        const angle = (i * Math.PI) / 6,
          tick = addBox(
            group,
            0.009,
            0.02,
            0.005,
            Math.sin(angle) * w * 0.36,
            h / 2 + Math.cos(angle) * w * 0.36,
            d / 2 + 0.006,
            ink,
          );
        tick.rotation.z = -angle;
      }
      addBox(group, 0.009, h * 0.28, 0.007, 0, h * 0.62, d / 2 + 0.01, ink);
      const hand = addBox(group, w * 0.24, 0.009, 0.009, w * 0.1, h / 2, d / 2 + 0.012, accent);
      hand.rotation.z = -0.35;
    } else if (name === "wall_shelf") {
      addBox(group, w, 0.04, d, 0, 0.02, 0, frame);
      for (let i = 0; i < 5; i += 1) {
        addBox(
          group,
          0.07,
          0.18 + (i % 2) * 0.04,
          d * 0.65,
          -w * 0.3 + i * 0.085,
          0.14 + (i % 2) * 0.02,
          0,
          i % 2 ? accent : ink,
        );
      }
      for (const x of [-w * 0.36, w * 0.36]) {
        addBox(group, 0.03, h, 0.025, x, h / 2, -d / 2 + 0.015, frame);
      }
    } else {
      addBox(group, w, h, d, 0, h / 2, 0, frame);
      if (name === "mirror") {
        const silver = new THREE.MeshStandardMaterial({
          color: "#c0d4d7",
          metalness: 0.92,
          roughness: 0.08,
        });
        addBox(group, w - 0.05, h - 0.05, 0.004, 0, h / 2, d / 2 + 0.002, silver);
      } else {
        addBox(group, w - 0.025, h - 0.025, 0.003, 0, h / 2, d / 2 + 0.002, paper);
        addBox(group, w * 0.62, h * 0.3, 0.003, -w * 0.07, h * 0.35, d / 2 + 0.006, ink);
        mesh(new THREE.CircleGeometry(w * 0.16, 24), accent, w * 0.17, h * 0.69, d / 2 + 0.009);
        for (let i = 0; i < 3; i += 1) {
          addBox(
            group,
            w * (0.55 - i * 0.08),
            0.009,
            0.003,
            0,
            h * (0.85 + i * 0.035),
            d / 2 + 0.006,
            ink,
          );
        }
      }
    }
  }
  const decorationExample =
      "# Posters, artwork, a clock, a shelf, and a ceramic vase\nGRID 1\nROOM gallery 8x8 AT 0,0\nWALLS north east south west\nDOORS south\nWINDOWS north east west\nMOUNT south 1 poster\nMOUNT south 6 mirror\nMOUNT east 0 painting\nMOUNT east 7 wall_shelf\nMOUNT north 0 wall_clock\nLIGHT track_light AT 2,2 POWER 24\nLIGHT pendant_light AT 5,5 POWER 18\nLAYOUT gallery\n. | . | . | . | . | . | . | .\n. | . | . | . | . | . | . | .\n. | . | . | . | . | . | . | .\n. | . | . | . | . | . | . | .\n. | . | . | . | . | . | . | .\n. | . | . | . | . | . | . | .\n. | . | vase | . | . | . | . | .\n. | . | . | . | . | . | . | .\nEND",
    daylightStrength = { value: 0 },
    daylightPass = { value: 1 },
    daylightSourceMaterials = new Set(),
    daylightCeilings = new Set();
  function addDaylightFill(program, root) {
    const sources = new Map(
        program.rooms.map((room) => [
          room,
          room.daylightOpenings
            .filter((opening) => !opening.shared)
            .reduce((area, opening) => area + opening.area, 0),
        ]),
      ),
      roomMaterials = new Map();
    for (const room of program.rooms) {
      const area = room.cols * room.rows * program.grid ** 2,
        openings = room.daylightOpenings.map((opening) => {
          let weight = opening.area;
          if (opening.shared) {
            weight = 0;
            for (const other of program.rooms) {
              if (!sharedWall(room, other, opening.dir)) {
                continue;
              }
              const opposite = { east: "west", north: "south", south: "north", west: "east" },
                linked = other.daylightOpenings.some(
                  (candidate) =>
                    candidate.dir === opposite[opening.dir] &&
                    Math.hypot(candidate.x - opening.x, candidate.z - opening.z) <
                      (candidate.span + opening.span) / 2,
                );
              if (linked) {
                weight +=
                  opening.area *
                  0.2 *
                  Math.min(
                    1,
                    sources.get(other) / Math.sqrt(other.cols * other.rows * program.grid ** 2),
                  );
              }
            }
          }
          return new THREE.Vector4(opening.x, opening.z, weight / Math.sqrt(area), 0);
        });
      while (openings.length < 4) {
        openings.push(new THREE.Vector4());
      }
      roomMaterials.set(room.name, { materials: new Map(), openings });
    }
    function visit(node, roomName) {
      const name = node.userData.token?.room || roomName,
        entry = roomMaterials.get(name);
      if (node.isMesh && entry) {
        const finish = (source) => {
          if (!source.isMeshStandardMaterial || source.userData.windowPane) {
            return source;
          }
          if (!entry.materials.has(source)) {
            const copy = source.clone();
            daylightSourceMaterials.add(source);
            copy.userData.ownedTexture = false;
            if (source === material.ceiling) {
              daylightCeilings.add(copy);
            }
            copy.onBeforeCompile = (shader) => {
              shader.uniforms.daylightStrength = daylightStrength;
              shader.uniforms.daylightPass = daylightPass;
              shader.uniforms.daylightOpenings = { value: entry.openings };
              shader.vertexShader = `varying vec3 daylightPosition;\n${shader.vertexShader}`;
              shader.vertexShader = shader.vertexShader.replace(
                "#include <project_vertex>",
                "#include <project_vertex>\ndaylightPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;",
              );
              shader.fragmentShader = [
                "varying vec3 daylightPosition;",
                "uniform float daylightStrength;",
                "uniform float daylightPass;",
                "uniform vec4 daylightOpenings[4];",
                shader.fragmentShader,
              ].join("\n");
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <lights_fragment_end>",
                [
                  "float daylightFill = 0.0;",
                  "for (int i = 0; i < 4; i++) {",
                  "  float distanceToOpening = distance(daylightPosition.xz, daylightOpenings[i].xy);",
                  "  daylightFill += daylightOpenings[i].z / (1.0 + 0.18 * distanceToOpening * distanceToOpening);",
                  "}",
                  "irradiance += vec3(0.82, 0.9, 1.0) * min(daylightFill, 0.8) * daylightStrength * daylightPass * PI;",
                  "#include <lights_fragment_end>",
                ].join("\n"),
              );
            };
            copy.customProgramCacheKey = () => "room-daylight-v1";
            entry.materials.set(source, copy);
          }
          return entry.materials.get(source);
        };
        node.material = Array.isArray(node.material)
          ? node.material.map(finish)
          : finish(node.material);
      }
      node.children.forEach((child) => visit(child, name));
    }
    visit(root);
  }
  function createFixtureRenderer(renderer, scene, camera, sunlight) {
    const passTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
      sumTarget = new THREE.WebGLRenderTarget(1, 1, {
        depthBuffer: false,
        type: THREE.HalfFloatType,
      }),
      quadScene = new THREE.Scene(),
      quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      vertexShader =
        "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      sumMaterial = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        fragmentShader:
          "uniform sampler2D source; varying vec2 vUv; void main() { gl_FragColor = texture2D(source, vUv); }",
        toneMapped: false,
        transparent: true,
        uniforms: { source: { value: passTarget.texture } },
        vertexShader,
      }),
      outputMaterial = new THREE.ShaderMaterial({
        depthTest: false,
        depthWrite: false,
        fragmentShader:
          "uniform sampler2D source; varying vec2 vUv;\n      void main() { gl_FragColor = vec4(texture2D(source, vUv).rgb, 1.0);\n        #include <tonemapping_fragment>\n        #include <colorspace_fragment>\n      }",
        uniforms: { source: { value: sumTarget.texture } },
        vertexShader,
      }),
      quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sumMaterial);
    quadScene.add(quad);
    const size = new THREE.Vector2(),
      black = new THREE.Color(0);
    return function renderFixtures() {
      const lights = [],
        materials = new Set();
      scene.traverseVisible((node) => {
        if (node.isPointLight && node.intensity > 0) {
          lights.push(node);
        }
        for (const material of [node.material].flat().filter(Boolean)) {
          materials.add(material);
        }
      });
      if (lights.length <= 4) {
        renderer.render(scene, camera);
        return;
      }
      renderer.getDrawingBufferSize(size);
      if (passTarget.width !== size.x || passTarget.height !== size.y) {
        passTarget.setSize(size.x, size.y);
        sumTarget.setSize(size.x, size.y);
      }
      const saved = {
          autoClear: renderer.autoClear,
          background: scene.background,
          clearAlpha: renderer.getClearAlpha(),
          clearColor: renderer.getClearColor(new THREE.Color()),
          shadows: renderer.shadowMap.needsUpdate,
          sunVisible: sunlight.visible,
          target: renderer.getRenderTarget(),
          toneMapping: renderer.toneMapping,
        },
        emission = [...materials].filter((m) => m.emissive).map((m) => [m, m.emissiveIntensity]),
        unlit = [...materials]
          .filter((m) => !m.isMeshStandardMaterial && !m.isMeshPhysicalMaterial && m.colorWrite)
          .map((m) => [m, m.colorWrite]);
      try {
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.setClearColor(0, 1);
        renderer.setRenderTarget(sumTarget);
        renderer.clear();
        for (let start = 0; start < lights.length; start += 4) {
          lights.forEach((light, index) => {
            light.visible = index >= start && index < start + 4;
          });
          if (start > 0) {
            scene.background = black;
            sunlight.visible = false;
            daylightPass.value = 0;
            emission.forEach(([material]) => {
              material.emissiveIntensity = 0;
            });
            unlit.forEach(([material]) => {
              material.colorWrite = false;
            });
          }
          renderer.shadowMap.needsUpdate = saved.shadows;
          renderer.autoClear = true;
          renderer.setRenderTarget(passTarget);
          renderer.render(scene, camera);
          renderer.autoClear = false;
          renderer.setRenderTarget(sumTarget);
          quad.material = sumMaterial;
          renderer.render(quadScene, quadCamera);
        }
        renderer.toneMapping = saved.toneMapping;
        renderer.setRenderTarget(saved.target);
        renderer.autoClear = true;
        quad.material = outputMaterial;
        renderer.render(quadScene, quadCamera);
      } finally {
        lights.forEach((light) => {
          light.visible = true;
        });
        emission.forEach(([material, intensity]) => {
          material.emissiveIntensity = intensity;
        });
        unlit.forEach(([material, colorWrite]) => {
          material.colorWrite = colorWrite;
        });
        sunlight.visible = saved.sunVisible;
        daylightPass.value = 1;
        scene.background = saved.background;
        renderer.toneMapping = saved.toneMapping;
        renderer.autoClear = saved.autoClear;
        renderer.setClearColor(saved.clearColor, saved.clearAlpha);
        renderer.setRenderTarget(saved.target);
      }
    };
  }
  const examples = {
    Bedroom: [
      "# A calm bedroom",
      "ROOM 8x7",
      "GRID 0.88",
      "WALLS north east south west",
      "DOORS south",
      "MOUNT north 6 air_conditioner",
      "LAYOUT main",
      ". | . | . | . | . | . | . | .",
      ". | nightstand(lamp_on_top)~north | . | bed(pillows_on_top)~north | . | . | dresser~north | .",
      ". | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | .",
      ". | plant | . | . | rug | . | . | .",
      ". | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | .",
      "END",
      "",
      "LAYOUT pillows",
      "pillow | pillow",
      "END",
      "",
      "LAYOUT lamp",
      "table_lamp",
      "END",
    ].join("\n"),
    "Creative studio": [
      "# Work, make, think",
      "ROOM 10x7",
      "GRID 0.8",
      "WALLS north east south west",
      "DOORS south",
      "LAYOUT main",
      ". | . | . | . | bookshelf~north | . | . | . | . | .",
      ". | plant | . | . | . | . | . | . | lamp | .",
      ". | . | desk(work_on_top) | . | . | . | side_table | . | . | .",
      ". | . | chair@180 | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | . | .",
      ". | . | . | . | rug | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | . | .",
      "END",
      "",
      "LAYOUT work",
      "book | monitor | mug",
      "END",
    ].join("\n"),
    "Dining room": [
      "# A table ready for dinner",
      "ROOM 9x8",
      "GRID 0.85",
      "WALLS north east south west",
      "DOORS south",
      "LAYOUT main",
      ". | . | . | . | . | . | . | . | .",
      ". | plant | . | . | . | . | . | bookshelf~north | .",
      ". | . | . | chair@0 | . | . | . | . | .",
      ". | . | chair@90 | . | dining_table(setting_on_top) | . | chair@270 | . | .",
      ". | . | . | chair@180 | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | .",
      "END",
      "",
      "LAYOUT setting",
      "mug | . | mug",
      "END",
    ].join("\n"),
    "Kitchen & dining": [
      "# Kitchen cabinets, appliances, and a dining set",
      "ROOM 10x8",
      "GRID 0.85",
      "WALLS north east south west",
      "DOORS south",
      "LAYOUT main",
      ". | . | . | . | . | . | . | . | . | .",
      ". | fridge~north | . | kitchen_counter~north | . | . | sink~north | . | stove~north | .",
      ". | . | . | . | . | kitchen_chair@0 | . | . | . | .",
      ". | . | . | . | . | . | . | . | . | .",
      ". | . | . | kitchen_chair@90 | . | kitchen_table(place_setting_on_top) | . | kitchen_chair@270 | . | .",
      ". | . | . | . | . | kitchen_chair@180 | . | . | . | .",
      ". | plant | . | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | . | .",
      "END",
      "",
      "LAYOUT place_setting",
      "mug | . | mug",
      "END",
    ].join("\n"),
    "Living room": [
      "# A relaxed living room",
      "ROOM 9x7",
      "GRID 0.82",
      "WALLS north east south west",
      "DOORS south",
      "STYLE blue",
      "MOUNT north 7 air_conditioner",
      "MOUNT north 1 wall_lamp",
      "LAYOUT main",
      ". | . | . | . | bookshelf~north | . | . | . | .",
      ". | . | . | . | . | . | . | plant | .",
      ". | sofa~west | . | . | coffee_table(top_on_top) | . | tv_stand(tv_on_top)~east | . | .",
      ". | . | . | . | . | . | . | . | .",
      ". | . | armchair@135 | . | rug | . | . | . | .",
      ". | lamp | . | . | . | . | . | . | .",
      ". | . | . | . | . | . | . | . | .",
      "END",
      "",
      "LAYOUT top",
      "book | . | mug",
      "END",
      "",
      "LAYOUT tv",
      "tv",
      "END",
    ].join("\n"),
  };
  for (const name of [
    "Bedroom",
    "Creative studio",
    "Dining room",
    "Kitchen & dining",
    "Living room",
  ]) {
    const lines = examples[name].split("\n");
    lines.splice(lines.indexOf("DOORS south") + 1, 0, "WINDOWS north east west");
    for (const index of [lines.indexOf("LAYOUT main") + 1, lines.indexOf("END") - 1]) {
      const cells = lines[index].split(" | ");
      cells[index === lines.indexOf("END") - 1 ? cells.length - 3 : 2] = "ceiling_light";
      lines[index] = cells.join(" | ");
    }
    examples[name] = lines.join("\n");
  }
  function buildExample(description, grid, rooms, sublayouts = {}) {
    const lines = description ? [`# ${description}`, `GRID ${grid}`] : [`GRID ${grid}`];
    for (const room of rooms) {
      lines.push(
        `FLOOR ${room.floor || 0}`,
        `${room.kind === "balcony" ? "BALCONY" : "ROOM"} ${room.name} ${room.cols}x${room.rows} AT ${room.x},${room.z}`,
      );
      if (room.kind === "balcony") {
        lines.push(`RAILS ${room.rails?.join(" ") || "none"}`);
      } else {
        lines.push(`WALLS ${room.walls?.join(" ") || "none"}`);
      }
      if (room.doors?.length) {
        lines.push(`DOORS ${room.doors.join(" ")}`);
      }
      if (room.windows) {
        lines.push(`WINDOWS ${room.windows.join(" ") || "none"}`);
      }
      if (room.style) {
        lines.push(`STYLE ${room.style}`);
      }
      for (const [side, cell, name] of room.mounts || []) {
        lines.push(`MOUNT ${side} ${cell} ${name}`);
      }
    }
    for (const room of rooms) {
      const cells = Array.from({ length: room.rows }, () =>
        Array.from({ length: room.cols }).fill("."),
      );
      for (const [col, row, token] of room.items) {
        if (col < 0 || col >= room.cols || row < 0 || row >= room.rows || cells[row][col] !== ".") {
          throw new Error(`Invalid example placement in ${room.name}`);
        }
        cells[row][col] = token;
      }
      if (
        room.kind !== "balcony" &&
        room.windows?.length !== 0 &&
        !["liminal", "industrial", "aquatic", "mediterranean"].includes(room.style) &&
        !room.items.some((item) => ["ceiling_light", "fluorescent_light"].includes(item[2]))
      ) {
        const count = room.cols * room.rows * grid ** 2 >= 18 ? 2 : 1;
        for (let i = 0; i < count; i += 1) {
          const targetCol = ((i + 1) * (room.cols - 1)) / (count + 1),
            targetRow = ((i + 1) * (room.rows - 1)) / (count + 1),
            [free] = cells
              .flatMap((row, z) => row.flatMap((cell, x) => (cell === "." ? [{ x, z }] : [])))
              .toSorted(
                (a, b) =>
                  Math.hypot(a.x - targetCol, a.z - targetRow) -
                  Math.hypot(b.x - targetCol, b.z - targetRow),
              );
          if (free) {
            cells[free.z][free.x] = "ceiling_light";
          }
        }
      }
      lines.push("", `LAYOUT ${room.name}`, ...cells.map((row) => row.join(" | ")), "END");
    }
    for (const [name, rows] of Object.entries(sublayouts)) {
      lines.push("", `LAYOUT ${name}`, ...rows, "END");
    }
    return lines.join("\n");
  }
  Object.assign(examples, {
    "Balcony garden": buildExample("A furnished outdoor balcony", 0.82, [
      {
        cols: 8,
        items: [
          [1, 1, "planter"],
          [6, 1, "planter"],
          [2, 3, "outdoor_chair@90"],
          [4, 3, "bistro_table"],
          [6, 3, "outdoor_chair@270"],
        ],
        kind: "balcony",
        name: "terrace",
        rails: ["west", "south", "east"],
        rows: 5,
        x: 0,
        z: 0,
      },
    ]),
    "City apartment + balcony": buildExample(
      "A living room, kitchen, bedroom, and outdoor terrace",
      0.82,
      [
        {
          cols: 9,
          doors: ["south", "east", "west"],
          items: [
            [1, 1, "bookshelf~north"],
            [7, 1, "tv_stand(tv_on_top)~east"],
            [2, 3, "sofa@90"],
            [5, 3, "coffee_table"],
            [2, 5, "armchair@135"],
            [7, 5, "plant"],
          ],
          mounts: [["north", 7, "air_conditioner"]],
          name: "living",
          rows: 7,
          style: "blue",
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 7,
          doors: ["south"],
          items: [
            [1, 1, "fridge~north"],
            [3, 1, "sink~north"],
            [5, 1, "stove~north"],
            [3, 4, "kitchen_table"],
            [1, 5, "kitchen_chair@90"],
            [5, 4, "kitchen_chair@270"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["north", "east", "south"],
          x: 9,
          z: 0,
        },
        {
          cols: 9,
          items: [
            [1, 1, "planter"],
            [3, 2, "outdoor_chair@90"],
            [5, 2, "bistro_table"],
            [7, 1, "outdoor_chair@270"],
          ],
          kind: "balcony",
          name: "terrace",
          rails: ["west", "south", "east"],
          rows: 3,
          x: 0,
          z: 7,
        },
        {
          cols: 7,
          doors: [],
          items: [
            [1, 1, "wardrobe~north"],
            [4, 2, "bed@0(pillows_on_top)"],
            [1, 4, "nightstand"],
            [5, 4, "dresser"],
          ],
          name: "bedroom",
          rows: 6,
          walls: ["east", "south", "west"],
          x: 9,
          z: 7,
        },
      ],
      { pillows: ["pillow | pillow"], tv: ["tv"] },
    ),
    "Family home": buildExample(
      "Four rooms with shared circulation",
      0.82,
      [
        {
          cols: 9,
          doors: ["east", "south", "west"],
          items: [
            [1, 1, "bookshelf~north"],
            [7, 1, "tv_stand(tv_on_top)~east"],
            [2, 3, "sofa@90"],
            [5, 3, "coffee_table"],
            [2, 5, "armchair@135"],
            [7, 5, "plant"],
            [5, 5, "rug"],
          ],
          name: "living",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 7,
          doors: ["south"],
          items: [
            [1, 1, "fridge~north"],
            [3, 1, "sink~north"],
            [5, 1, "stove~north"],
            [3, 4, "kitchen_island"],
            [1, 5, "bar_stool"],
            [5, 5, "bar_stool"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["north", "east", "south"],
          x: 9,
          z: 0,
        },
        {
          cols: 9,
          doors: ["east"],
          items: [
            [1, 1, "wardrobe~north"],
            [4, 2, "bed@0(pillows_on_top)"],
            [7, 2, "nightstand"],
            [1, 5, "dresser"],
            [6, 5, "rug"],
          ],
          name: "bedroom",
          rows: 7,
          walls: ["east", "south", "west"],
          x: 0,
          z: 7,
        },
        {
          cols: 7,
          doors: [],
          items: [
            [1, 1, "bathtub@90"],
            [5, 1, "shower"],
            [2, 4, "vanity"],
            [5, 4, "toilet"],
          ],
          name: "bath",
          rows: 7,
          walls: ["east", "south"],
          x: 9,
          z: 7,
        },
      ],
      { pillows: ["pillow | pillow"], tv: ["tv"] },
    ),
    "Galley kitchen": buildExample(
      "A compact cooking room with an island",
      0.84,
      [
        {
          cols: 10,
          doors: ["south"],
          items: [
            [1, 1, "fridge~north"],
            [3, 1, "kitchen_counter(coffee_on_top)~north"],
            [6, 1, "sink~north"],
            [8, 1, "stove~north"],
            [5, 4, "kitchen_island(prep_on_top)"],
            [3, 5, "bar_stool"],
            [7, 5, "bar_stool"],
            [1, 5, "plant"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
      ],
      { coffee: ["coffee_maker | mug"], prep: ["book | . | mug"] },
    ),
    "Home office": buildExample(
      "A focused work room with a lounge corner",
      0.82,
      [
        {
          cols: 8,
          doors: ["south"],
          items: [
            [1, 1, "bookshelf~north"],
            [5, 1, "desk(work_on_top)"],
            [5, 3, "chair@180"],
            [7, 2, "filing_cabinet"],
            [1, 4, "armchair@135"],
            [3, 5, "rug"],
            [7, 5, "plant"],
            [0, 5, "lamp"],
          ],
          name: "office",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
      ],
      { work: ["book | monitor | mug"] },
    ),
    "Micro apartment": buildExample("A small living space and separate bathroom", 0.78, [
      {
        cols: 8,
        doors: ["south", "east"],
        items: [
          [1, 1, "bed@0"],
          [5, 1, "wardrobe~north"],
          [1, 4, "sofa@90"],
          [4, 4, "coffee_table"],
          [6, 1, "kitchen_counter~east"],
          [6, 6, "fridge~east"],
          [3, 6, "rug"],
        ],
        name: "studio",
        rows: 8,
        walls: ["north", "east", "south", "west"],
        x: 0,
        z: 0,
      },
      {
        cols: 5,
        doors: [],
        items: [
          [1, 1, "shower"],
          [3, 2, "vanity"],
          [1, 5, "toilet"],
          [3, 6, "plant"],
        ],
        name: "bath",
        rows: 8,
        walls: ["north", "east", "south"],
        x: 8,
        z: 0,
      },
    ]),
    "One-bedroom apartment": buildExample(
      "A lounge, kitchen, and bedroom",
      0.82,
      [
        {
          cols: 8,
          doors: ["east", "south", "west"],
          items: [
            [1, 1, "bookshelf~north"],
            [7, 1, "tv_stand(tv_on_top)~east"],
            [2, 3, "sofa@90"],
            [5, 3, "coffee_table"],
            [1, 5, "lamp"],
            [5, 5, "rug"],
          ],
          name: "living",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 7,
          items: [
            [1, 1, "fridge~north"],
            [3, 1, "sink~north"],
            [5, 1, "stove~north"],
            [3, 4, "kitchen_table"],
            [1, 5, "kitchen_chair@90"],
            [5, 4, "kitchen_chair@270"],
            [6, 6, "plant"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["north", "east", "south"],
          x: 8,
          z: 0,
        },
        {
          cols: 8,
          doors: [],
          items: [
            [1, 1, "wardrobe~north"],
            [4, 2, "bed@0(pillows_on_top)"],
            [1, 4, "nightstand"],
            [6, 4, "dresser"],
          ],
          name: "bedroom",
          rows: 6,
          walls: ["east", "south", "west"],
          x: 0,
          z: 7,
        },
      ],
      { pillows: ["pillow | pillow"], tv: ["tv"] },
    ),
    "Open-plan loft": buildExample(
      "Living and dining rooms in one open plan",
      0.84,
      [
        {
          cols: 9,
          doors: ["south"],
          items: [
            [1, 1, "bookshelf~north"],
            [4, 1, "tv_stand(tv_on_top)~north"],
            [7, 1, "plant"],
            [4, 5, "sofa@180"],
            [4, 3, "coffee_table"],
            [2, 6, "armchair@135"],
            [7, 6, "lamp"],
            [5, 6, "rug"],
          ],
          name: "lounge",
          rows: 8,
          walls: ["north", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 8,
          items: [
            [1, 1, "sideboard~north"],
            [6, 1, "plant"],
            [4, 2, "kitchen_chair@0"],
            [2, 4, "kitchen_chair@90"],
            [4, 4, "dining_table(tabletop_on_top)"],
            [6, 4, "kitchen_chair@270"],
            [4, 6, "kitchen_chair@180"],
          ],
          name: "dining",
          rows: 8,
          walls: ["north", "east", "south"],
          x: 9,
          z: 0,
        },
      ],
      { tabletop: ["mug | . | mug"], tv: ["tv"] },
    ),
    "Reading nook": buildExample(
      "A quiet corner with a chair and books",
      0.8,
      [
        {
          cols: 6,
          doors: ["south"],
          items: [
            [1, 1, "bookshelf~north"],
            [4, 1, "plant"],
            [2, 3, "armchair@135"],
            [4, 3, "side_table(tea_on_top)"],
            [1, 5, "lamp"],
          ],
          name: "nook",
          rows: 6,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
      ],
      { tea: ["mug | book"] },
    ),
    "Six-room house": buildExample(
      "A larger home with living, dining, kitchen, bedrooms, office, and bath",
      0.78,
      [
        {
          cols: 9,
          doors: ["east", "south", "west"],
          items: [
            [1, 1, "bookshelf~north"],
            [7, 1, "tv_stand(tv_on_top)~east"],
            [2, 3, "sofa@90"],
            [5, 3, "coffee_table"],
            [2, 6, "armchair@135"],
            [6, 6, "rug"],
            [8, 6, "plant"],
          ],
          mounts: [
            ["north", 7, "air_conditioner"],
            ["west", 2, "wall_lamp"],
          ],
          name: "living",
          rows: 8,
          style: "blue",
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 8,
          doors: ["south"],
          items: [
            [1, 1, "sideboard~north"],
            [6, 1, "plant"],
            [4, 2, "kitchen_chair@0"],
            [2, 4, "kitchen_chair@90"],
            [4, 4, "dining_table"],
            [6, 4, "kitchen_chair@270"],
            [2, 6, "kitchen_chair@180"],
          ],
          name: "dining",
          rows: 8,
          walls: ["north", "east", "south"],
          x: 9,
          z: 0,
        },
        {
          cols: 9,
          doors: ["east", "south"],
          items: [
            [1, 1, "fridge~north"],
            [1, 3, "kitchen_counter~west"],
            [6, 1, "sink~north"],
            [7, 1, "stove~north"],
            [4, 4, "kitchen_island"],
            [2, 5, "bar_stool"],
            [6, 5, "bar_stool"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["east", "south", "west"],
          x: 0,
          z: 8,
        },
        {
          cols: 8,
          doors: ["south"],
          items: [
            [2, 1, "bathtub@90"],
            [6, 1, "shower"],
            [2, 4, "vanity"],
            [6, 4, "toilet"],
          ],
          name: "bath",
          rows: 7,
          walls: ["east", "south"],
          x: 9,
          z: 8,
        },
        {
          cols: 9,
          doors: ["east"],
          items: [
            [1, 1, "wardrobe~north"],
            [4, 3, "bed@0(pillows_on_top)"],
            [6, 2, "nightstand"],
            [1, 5, "dresser"],
            [7, 5, "plant"],
          ],
          name: "bedroom",
          rows: 7,
          walls: ["east", "south", "west"],
          x: 0,
          z: 15,
        },
        {
          cols: 8,
          doors: [],
          items: [
            [1, 1, "bookshelf~north"],
            [5, 2, "desk(work_on_top)"],
            [5, 3, "chair@180"],
            [1, 5, "armchair@90"],
            [3, 5, "side_table"],
          ],
          name: "office",
          rows: 7,
          walls: ["east", "south"],
          x: 9,
          z: 15,
        },
      ],
      { pillows: ["pillow | pillow"], tv: ["tv"], work: ["book | monitor | mug"] },
    ),
    "Spa bathroom": buildExample("A bathroom with tub, shower, and vanity", 0.82, [
      {
        cols: 8,
        doors: ["south"],
        items: [
          [2, 1, "bathtub@90"],
          [6, 1, "shower"],
          [2, 4, "vanity"],
          [6, 4, "toilet"],
          [4, 1, "towel_rack"],
          [0, 4, "laundry_basket"],
          [1, 6, "plant"],
        ],
        name: "bath",
        rows: 7,
        walls: ["north", "east", "south", "west"],
        x: 0,
        z: 0,
      },
    ]),
    "Work-from-home flat": buildExample(
      "An office, bedroom, kitchen, and lounge",
      0.8,
      [
        {
          cols: 8,
          doors: ["east", "south", "west"],
          items: [
            [1, 1, "bookshelf~north"],
            [5, 1, "desk(work_on_top)"],
            [5, 3, "chair@180"],
            [1, 5, "armchair@90"],
            [2, 5, "side_table"],
          ],
          name: "office",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          x: 0,
          z: 0,
        },
        {
          cols: 8,
          doors: ["south"],
          items: [
            [1, 1, "wardrobe~north"],
            [4, 2, "bed@0"],
            [6, 4, "dresser"],
            [1, 5, "plant"],
          ],
          name: "bedroom",
          rows: 7,
          walls: ["north", "east", "south"],
          x: 8,
          z: 0,
        },
        {
          cols: 8,
          doors: ["east"],
          items: [
            [1, 2, "tv_stand(tv_on_top)~west"],
            [5, 2, "sofa@270"],
            [3, 3, "coffee_table"],
            [1, 5, "ottoman"],
            [6, 5, "lamp"],
          ],
          name: "living",
          rows: 7,
          walls: ["east", "south", "west"],
          x: 0,
          z: 7,
        },
        {
          cols: 8,
          doors: [],
          items: [
            [1, 1, "fridge~west"],
            [2, 1, "sink~north"],
            [6, 1, "stove~north"],
            [4, 4, "kitchen_table"],
            [2, 4, "kitchen_chair@90"],
            [6, 4, "kitchen_chair@270"],
          ],
          name: "kitchen",
          rows: 7,
          walls: ["east", "south"],
          x: 8,
          z: 7,
        },
      ],
      { tv: ["tv"], work: ["book | monitor | mug"] },
    ),
  });
  examples["Two-storey home"] = buildExample("Two floors connected by stairs and an elevator", 1, [
    {
      cols: 10,
      doors: ["south"],
      floor: 0,
      items: [
        [2, 3, "stairs"],
        [7, 2, "elevator"],
        [6, 6, "sofa"],
      ],
      name: "downstairs",
      rows: 8,
      walls: ["north", "east", "south", "west"],
      x: 0,
      z: 0,
    },
    {
      cols: 10,
      floor: 1,
      items: [
        [7, 2, "elevator"],
        [6, 6, "bed"],
        [8, 6, "nightstand"],
      ],
      name: "upstairs",
      rows: 8,
      walls: ["north", "east", "south", "west"],
      x: 0,
      z: 0,
    },
  ]);
  examples["Three-storey townhouse"] = buildExample(
    "A narrow townhouse with separate living, kitchen, study, and sleeping areas",
    1,
    [
      {
        cols: 8,
        doors: ["south", "east"],
        floor: 0,
        items: [
          [1, 3, "stairs"],
          [5, 3, "sofa"],
          [5, 5, "coffee_table"],
          [6, 6, "plant"],
        ],
        name: "living",
        rows: 8,
        walls: ["north", "east", "south", "west"],
        windows: ["west"],
        x: 0,
        z: 0,
      },
      {
        cols: 8,
        floor: 0,
        items: [
          [1, 1, "fridge~north"],
          [2, 1, "sink~north"],
          [5, 1, "stove~north"],
          [4, 3, "kitchen_table"],
        ],
        name: "kitchen",
        rows: 5,
        walls: ["east", "south", "west"],
        windows: ["south"],
        x: 0,
        z: 8,
      },
      {
        cols: 8,
        doors: ["south"],
        floor: 1,
        items: [
          [6, 3, "stairs@180"],
          [3, 2, "desk"],
          [3, 3, "chair@180"],
          [3, 6, "bookshelf"],
        ],
        name: "study",
        rows: 8,
        style: "blue",
        walls: ["north", "east", "south", "west"],
        windows: ["east"],
        x: 0,
        z: 0,
      },
      {
        cols: 8,
        floor: 1,
        items: [
          [1, 3, "planter"],
          [4, 2, "bistro_table"],
          [3, 2, "outdoor_chair@90"],
          [5, 2, "outdoor_chair@270"],
        ],
        kind: "balcony",
        name: "terrace",
        rails: ["west", "east", "south"],
        rows: 5,
        x: 0,
        z: 8,
      },
      {
        cols: 8,
        floor: 2,
        items: [
          [2, 3, "bed"],
          [4, 3, "nightstand"],
          [2, 6, "wardrobe"],
        ],
        name: "bedroom",
        rows: 8,
        walls: ["north", "east", "south", "west"],
        windows: ["north", "west"],
        x: 0,
        z: 0,
      },
    ],
  );
  examples["Three-floor library"] = buildExample(
    "A broad library with a lift, reading rooms, and a rooftop garden",
    1,
    [
      {
        cols: 14,
        doors: ["south"],
        floor: 0,
        items: [
          [11, 2, "elevator"],
          [3, 2, "desk"],
          [3, 3, "chair@180"],
          [2, 6, "bookshelf"],
          [4, 6, "bookshelf"],
          [6, 6, "bookshelf"],
          [10, 7, "sofa@180"],
          [10, 5, "coffee_table"],
        ],
        name: "reception",
        rows: 10,
        walls: ["north", "east", "south", "west"],
        windows: ["north", "east"],
        x: 0,
        z: 0,
      },
      {
        cols: 14,
        floor: 1,
        items: [
          [11, 2, "elevator"],
          [2, 2, "bookshelf"],
          [4, 2, "bookshelf"],
          [2, 5, "desk"],
          [5, 5, "desk"],
          [8, 5, "desk"],
          [2, 6, "chair@180"],
          [5, 6, "chair@180"],
          [8, 6, "chair@180"],
          [11, 8, "armchair@270"],
        ],
        name: "reading",
        rows: 10,
        style: "neutral",
        walls: ["north", "east", "south", "west"],
        windows: ["west", "east"],
        x: 0,
        z: 0,
      },
      {
        cols: 6,
        doors: ["west"],
        floor: 2,
        items: [
          [3, 2, "elevator"],
          [3, 7, "sofa@180"],
          [3, 5, "coffee_table"],
        ],
        name: "sky_lounge",
        rows: 10,
        style: "blue",
        walls: ["north", "east", "south", "west"],
        windows: ["east"],
        x: 8,
        z: 0,
      },
      {
        cols: 8,
        floor: 2,
        items: [
          [1, 1, "planter"],
          [4, 1, "planter"],
          [1, 8, "planter"],
          [4, 8, "planter"],
          [3, 4, "bistro_table"],
          [2, 4, "outdoor_chair@90"],
          [4, 4, "outdoor_chair@270"],
        ],
        kind: "balcony",
        name: "roof_garden",
        rails: ["north", "south", "west"],
        rows: 10,
        x: 0,
        z: 0,
      },
    ],
  );
  examples["Four-floor tower"] = buildExample(
    "A stepped tower with three distinct stairwells, a lift, and a penthouse",
    1,
    [
      {
        cols: 14,
        doors: ["south"],
        floor: 0,
        items: [
          [2, 3, "stairs"],
          [11, 2, "elevator"],
          [5, 8, "sofa@180"],
          [8, 8, "armchair@225"],
          [6, 6, "coffee_table"],
        ],
        name: "lobby",
        rows: 12,
        walls: ["north", "east", "south", "west"],
        windows: ["north"],
        x: 0,
        z: 0,
      },
      {
        cols: 14,
        floor: 1,
        items: [
          [5, 3, "stairs@180"],
          [11, 2, "elevator"],
          [3, 7, "desk"],
          [3, 8, "chair@180"],
          [8, 7, "desk"],
          [8, 8, "chair@180"],
        ],
        name: "office",
        rows: 10,
        style: "blue",
        walls: ["north", "east", "south", "west"],
        windows: ["west", "east"],
        x: 0,
        z: 0,
      },
      {
        cols: 11,
        floor: 2,
        items: [
          [5, 3, "stairs"],
          [8, 2, "elevator"],
          [2, 7, "bench"],
          [5, 7, "bench"],
          [8, 7, "plant"],
        ],
        name: "gallery",
        rows: 10,
        style: "neutral",
        walls: ["north", "east", "south", "west"],
        windows: ["north", "west"],
        x: 3,
        z: 0,
      },
      {
        cols: 8,
        floor: 3,
        items: [
          [5, 2, "elevator"],
          [2, 6, "bed"],
          [4, 6, "nightstand"],
        ],
        name: "penthouse",
        rows: 8,
        walls: ["north", "east", "south", "west"],
        windows: ["north", "east"],
        x: 6,
        z: 0,
      },
    ],
  );
  Object.assign(examples, {
    Entryway: buildExample(
      "Storage beside a clear path from the front door",
      0.8,
      [
        {
          cols: 7,
          doors: ["north", "south"],
          items: [
            [1, 1, "coat_rack"],
            [1, 3, "shoe_rack~west"],
            [5, 2, "console_table(welcome_on_top)~east"],
            [5, 4, "bench~east"],
            [1, 5, "plant"],
          ],
          name: "entry",
          rows: 7,
          walls: ["north", "east", "south", "west"],
          windows: [],
          x: 0,
          z: 0,
        },
      ],
      { welcome: ["table_lamp | book"] },
    ),
    "Laundry room": buildExample("Appliances face an open working aisle", 0.8, [
      {
        cols: 7,
        doors: ["south"],
        items: [
          [1, 1, "washing_machine~north"],
          [3, 1, "sink~north"],
          [5, 1, "kitchen_counter~north"],
          [1, 4, "laundry_basket"],
          [5, 4, "towel_rack~east"],
        ],
        name: "laundry",
        rows: 6,
        walls: ["north", "east", "south", "west"],
        windows: ["east"],
        x: 0,
        z: 0,
      },
    ]),
  });
  function labyrinthExample() {
    const size = 19,
      width = size * 2 + 1,
      passages = Array.from({ length: width }, () => Array.from({ length: width }).fill(false)),
      visited = new Set(["0,0"]),
      stack = [[0, 0]],
      items = [];
    let seed = 20_260_929;
    passages[1][1] = true;
    while (stack.length > 0) {
      const [x, z] = stack.at(-1),
        choices = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
        ].filter(
          ([dx, dz]) =>
            x + dx >= 0 &&
            x + dx < size &&
            z + dz >= 0 &&
            z + dz < size &&
            !visited.has(`${x + dx},${z + dz}`),
        );
      if (choices.length === 0) {
        stack.pop();
        continue;
      }
      seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
      const [dx, dz] = choices[seed % choices.length];
      passages[z * 2 + 1 + dz][x * 2 + 1 + dx] = true;
      passages[(z + dz) * 2 + 1][(x + dx) * 2 + 1] = true;
      visited.add(`${x + dx},${z + dz}`);
      stack.push([x + dx, z + dz]);
    }
    passages[0][1] = true;
    passages[width - 1][width - 2] = true;
    for (let z = 0; z < width; z += 1) {
      for (let x = 0; x < width;) {
        if (passages[z][x]) {
          x += 1;
          continue;
        }
        let length = 1;
        while (length < 7 && x + length < width && !passages[z][x + length]) {
          length += 1;
        }
        if (length % 2 === 0) {
          length -= 1;
        }
        items.push([x + (length - 1) / 2, z, `hedge[${(length * 1.2).toFixed(1)}x1.2x2.4]`]);
        x += length;
      }
    }
    return buildExample(
      "The Minotaur's circuit — 361 chambers. Enter north-west; escape south-east. Top view reveals the route; first person hides it.",
      1.2,
      [
        {
          cols: width,
          items,
          kind: "balcony",
          name: "labyrinth",
          rails: [],
          rows: width,
          x: 0,
          z: 0,
        },
      ],
    );
  }
  examples["The Minotaur's labyrinth"] = labyrinthExample();
  examples.Backrooms = buildExample(
    "Level yellow — four connected departments, offset partitions, abandoned workstations and a room that thinks it is a swimming pool. Restore ceilings for fluorescent claustrophobia.",
    1,
    Array.from({ length: 4 }, (_, index) => {
      const items = [];
      for (let row = 2; row < 17; row += 4) {
        for (let col = 2; col < 17; col += 4) {
          items.push(
            [
              col,
              row,
              (col + row + index) % 3 === 0
                ? "column"
                : (Math.floor(col / 4) + Math.floor(row / 4) + index) % 2 === 0
                  ? "partition[2.8x0.18x2.65]"
                  : "partition@90[2.8x0.18x2.65]",
            ],
            [col, row + 1, "fluorescent_light"],
          );
        }
      }
      items.push(
        [6, 0, index === 3 ? "vending_machine~north" : "filing_cabinet~north"],
        [12, 0, "desk~north"],
        [12, 1, "chair@180"],
      );
      if (index === 3) {
        items.push([4, 16, "pool[3x2x0.6]"]);
      }
      return {
        cols: 18,
        doors: ["north", "east", "south", "west"],
        items,
        name: ["intake", "duplicate_office", "lost_records", "poolrooms"][index],
        rows: 18,
        style: "liminal",
        walls: ["north", "east", "south", "west"],
        windows: [],
        x: (index % 2) * 18,
        z: Math.floor(index / 2) * 18,
      };
    }),
  );
  const towerThemes = [
    ["arrival", "sofa", "aquarium", "sculpture"],
    ["coworking", "desk", "bookshelf", "vending_machine"],
    ["archive", "bookshelf", "desk", "filing_cabinet"],
    ["robot_garden", "hydroponic_rack", "planter", "server_rack"],
    ["arcade", "arcade_machine", "arcade_machine", "vending_machine"],
    ["wellness", "treadmill", "sun_lounger", "hot_tub"],
    ["music", "piano", "sofa", "sculpture"],
    ["cloud_suite", "bed", "wardrobe", "aquarium"],
  ];
  examples["Cloud city skyscraper"] = buildExample(
    "24 floors / 72 metres — a vertical city of gardens, archives, arcades and sky suites. Two aligned lifts serve every floor. Select a floor; E / Shift+E travels at either lift.",
    1,
    Array.from({ length: 24 }, (_, floor) => {
      const [theme, left, middle, right] = towerThemes[floor % towerThemes.length],
        rooftop = floor === 23,
        items = [
          [3, 3, "elevator"],
          [14, 3, "elevator"],
        ];
      if (rooftop) {
        items.push(
          [8, 10, "pool"],
          [3, 10, "sun_lounger"],
          [14, 10, "sun_lounger"],
          [3, 15, "telescope"],
          [14, 15, "solar_panel"],
          [8, 16, "parasol"],
        );
      } else {
        items.push(
          [3, 9, left],
          [8, 9, middle],
          [14, 9, right],
          [3, 14, "bench"],
          [8, 14, "sculpture"],
          [14, 14, "planter"],
        );
      }
      return {
        cols: 18,
        doors: floor === 0 ? ["south"] : [],
        floor,
        items,
        kind: rooftop ? "balcony" : "room",
        name: rooftop ? "sky_pool_observatory" : `level_${floor}_${theme}`,
        rails: ["north", "east", "south", "west"],
        rows: 18,
        style: floor % 3 === 0 ? "blue" : "industrial",
        walls: ["north", "east", "south", "west"],
        windows: rooftop
          ? undefined
          : floor === 0
            ? ["north", "east", "west"]
            : ["north", "east", "south", "west"],
        x: 0,
        z: 0,
      };
    }),
  );
  const destinations = [
    [
      "Rooftop Riviera",
      "riviera",
      "aquatic",
      "balcony",
      "An above-ground pool club with a plunge spa, shade, loungers and a fountain court.",
      [
        [6, 7, "pool"],
        [14, 5, "hot_tub"],
        [2, 7, "sun_lounger"],
        [10, 7, "sun_lounger"],
        [2, 12, "parasol"],
        [6, 13, "bistro_table"],
        [5, 15, "outdoor_chair"],
        [8, 15, "outdoor_chair"],
        [14, 13, "fountain"],
        [2, 2, "planter"],
        [10, 2, "planter"],
      ],
    ],
    [
      "Lunar seed vault",
      "moon_greenhouse",
      "industrial",
      "room",
      "A lunar botanical station: hydroponic farms, an algae aquarium, solar collectors and the last reading chair on the moon.",
      [
        [3, 3, "hydroponic_rack"],
        [8, 3, "hydroponic_rack"],
        [13, 3, "hydroponic_rack"],
        [3, 8, "hydroponic_rack"],
        [8, 8, "aquarium"],
        [13, 8, "server_rack"],
        [3, 13, "solar_panel"],
        [8, 13, "armchair"],
        [13, 13, "telescope"],
      ],
    ],
    [
      "The drowned arcade",
      "tidal_arcade",
      "aquatic",
      "room",
      "After closing time, the arcade became a bathhouse. Islands of games surround a luminous pool; the vending machine is still working.",
      [
        [8, 9, "pool"],
        [2, 3, "arcade_machine"],
        [5, 3, "arcade_machine"],
        [11, 3, "arcade_machine"],
        [14, 3, "vending_machine"],
        [2, 10, "aquarium"],
        [14, 10, "aquarium"],
        [3, 15, "bench"],
        [13, 15, "bench"],
      ],
    ],
    [
      "Midnight observatory",
      "star_salon",
      "neutral",
      "balcony",
      "A roofless salon for listening to piano music while waiting for meteor showers.",
      [
        [3, 3, "telescope"],
        [8, 3, "telescope@90"],
        [13, 3, "telescope@180"],
        [4, 10, "piano"],
        [10, 10, "sculpture"],
        [3, 15, "sofa@180"],
        [8, 15, "fountain"],
        [13, 15, "sofa@180"],
      ],
    ],
    [
      "Museum of tomorrow's ruins",
      "future_ruins",
      "industrial",
      "room",
      "An archaeological gallery from the future: server monoliths, an overgrown colonnade and one surviving arcade cabinet.",
      [
        [3, 3, "column"],
        [8, 3, "column"],
        [13, 3, "column"],
        [3, 7, "server_rack"],
        [8, 7, "sculpture"],
        [13, 7, "arcade_machine"],
        [3, 12, "hedge"],
        [8, 12, "fountain"],
        [13, 12, "hydroponic_rack"],
        [5, 16, "bench"],
        [11, 16, "bench"],
      ],
    ],
  ];
  for (const [title, name, style, kind, description, items] of destinations) {
    examples[title] = buildExample(description, 1, [
      {
        cols: 18,
        doors: kind === "room" ? ["south"] : [],
        items,
        kind,
        name,
        rails: ["north", "east", "south", "west"],
        rows: 18,
        style,
        walls: ["north", "east", "south", "west"],
        windows: kind === "room" ? ["north", "east", "west"] : undefined,
        x: 0,
        z: 0,
      },
    ]);
  }
  const catalog = {
      air_conditioner: [1.02, 0.22, 0.31],
      aquarium: [1.8, 0.65, 1.45],
      arcade_machine: [0.75, 0.85, 1.7],
      armchair: [0.86, 0.83, 0.86],
      bar_stool: [0.42, 0.42, 0.69],
      bathtub: [1.6, 0.78, 0.58],
      bed: [1.5, 2, 0.56],
      bench: [1.12, 0.43, 0.47],
      bistro_table: [0.75, 0.75, 0.72],
      book: [0.23, 0.17, 0.045],
      bookshelf: [0.9, 0.36, 1.85],
      ceiling_light: [0.5, 0.5, 2.7],
      chair: [0.5, 0.54, 0.87],
      coat_rack: [0.6, 0.6, 1.75],
      coffee_maker: [0.25, 0.3, 0.35],
      coffee_table: [1.08, 0.64, 0.43],
      column: [0.55, 0.55, 2.7],
      console_table: [1.1, 0.35, 0.8],
      desk: [1.35, 0.7, 0.75],
      dining_table: [1.55, 0.9, 0.75],
      downlight: [0.22, 0.22, 2.7],
      dresser: [1.03, 0.49, 0.92],
      elevator: [1.6, 1.6, 3],
      filing_cabinet: [0.48, 0.55, 0.68],
      fluorescent_light: [1.2, 0.3, 2.7],
      fountain: [1.8, 1.8, 1.5],
      fridge: [0.73, 0.7, 1.82],
      garden_lamp: [0.22, 0.22, 0.9],
      hedge: [2, 0.65, 1.7],
      hot_tub: [2.2, 2.2, 0.85],
      hydroponic_rack: [1.8, 0.7, 2],
      kitchen_chair: [0.5, 0.53, 0.86],
      kitchen_counter: [1.48, 0.62, 0.9],
      kitchen_island: [1.55, 0.85, 0.91],
      kitchen_table: [1.52, 0.86, 0.75],
      lamp: [0.4, 0.4, 1.48],
      lantern: [0.3, 0.3, 0.5],
      laundry_basket: [0.44, 0.4, 0.56],
      monitor: [0.48, 0.12, 0.39],
      mug: [0.11, 0.11, 0.12],
      nightstand: [0.49, 0.44, 0.52],
      ottoman: [0.62, 0.54, 0.42],
      outdoor_chair: [0.6, 0.6, 0.82],
      parasol: [2.6, 2.6, 2.5],
      partition: [2, 0.18, 2.65],
      pendant_light: [0.5, 0.5, 2.7],
      piano: [1.5, 0.65, 1.2],
      pillow: [0.38, 0.3, 0.1],
      plant: [0.48, 0.48, 1.12],
      planter: [1.05, 0.34, 0.46],
      pool: [5.6, 3.4, 0.85],
      rug: [1.55, 1.15, 0.025],
      sculpture: [0.9, 0.9, 1.8],
      server_rack: [0.8, 0.9, 2.1],
      shoe_rack: [0.9, 0.32, 0.48],
      shower: [0.93, 0.93, 2.05],
      side_table: [0.48, 0.48, 0.54],
      sideboard: [1.38, 0.48, 0.83],
      sink: [1.08, 0.62, 0.9],
      sofa: [1.75, 0.82, 0.78],
      solar_panel: [1.8, 1.2, 0.8],
      stairs: [1.2, 3.6, 3],
      stove: [0.64, 0.65, 0.88],
      sun_lounger: [0.75, 1.95, 0.65],
      table_lamp: [0.28, 0.28, 0.4],
      telescope: [1.1, 1.2, 1.65],
      toilet: [0.43, 0.65, 0.72],
      towel_rack: [0.65, 0.32, 0.95],
      track_light: [1.2, 0.22, 2.7],
      treadmill: [0.9, 1.8, 1.3],
      tv: [0.93, 0.09, 0.6],
      tv_stand: [1.33, 0.42, 0.53],
      vanity: [0.95, 0.52, 0.84],
      vending_machine: [0.95, 0.8, 1.9],
      wall_lamp: [0.22, 0.19, 0.3],
      wardrobe: [1.25, 0.56, 1.95],
      washing_machine: [0.6, 0.64, 0.85],
    },
    aliases = {
      1: "sofa",
      10: "lamp",
      11: "bookshelf",
      12: "rug",
      2: "coffee_table",
      3: "chair",
      4: "tv_stand",
      5: "tv",
      6: "bed",
      7: "desk",
      8: "dining_table",
      9: "plant",
    },
    $ = (id) => document.querySelector(`#${id}`),
    editorHost = $("editor"),
    select = $("exampleSelect"),
    viewport = $("viewport"),
    status = $("message"),
    selectionCard = $("selectionCard");
  Object.assign(catalog, referenceCatalog, decorCatalog);
  let compileTimer,
    compiledSource,
    currentProgram,
    firstPerson = false,
    focusFloor,
    focusRoom,
    wallRoots = [],
    ceilingRoots = [],
    ceilingsCollapsed = true,
    gridHelper,
    gridVisible = false,
    hoverOutline,
    hoveredGroup,
    lastPointer,
    looking = false,
    selectionPinned = false,
    selectionPointer,
    wallRoot,
    wallsCollapsed = false;
  const pressedKeys = new Set();
  let selectableGroups = [],
    collisionEntries = [];
  function grammarFold(state, from) {
    const header = state.doc.lineAt(from),
      kind = header.text
        .trim()
        .match(/^(LAYOUT|ROOM|BALCONY|FLOOR)\b/iu)?.[1]
        .toUpperCase();
    if (!kind) {
      return;
    }
    let last = header,
      roomCount = 0;
    for (let number = header.number + 1; number <= state.doc.lines; number += 1) {
      const line = state.doc.line(number),
        text = line.text.trim();
      if (/^(ROOM|BALCONY)\b/iu.test(text)) {
        roomCount += 1;
      }
      if (kind === "LAYOUT") {
        if (/^END(?:\s*#.*)?$/iu.test(text)) {
          return { from: header.to, to: line.to };
        }
        if (/^(LAYOUT|ROOM|BALCONY|FLOOR)\b/iu.test(text)) {
          return;
        }
      } else if (
        (kind === "FLOOR" ? /^(FLOOR|LAYOUT)\b/iu : /^(ROOM|BALCONY|FLOOR|LAYOUT)\b/iu).test(text)
      ) {
        break;
      }
      if (text) {
        last = line;
      }
    }
    return kind !== "LAYOUT" && last.number > header.number && (kind !== "FLOOR" || roomCount > 1)
      ? { from: header.to, to: last.to }
      : undefined;
  }
  const highlightLine = StateEffect.define(),
    highlightedLine = StateField.define({
      create: () => Decoration.none,
      provide: (field) => EditorView.decorations.from(field),
      update(value, transaction) {
        /* eslint-disable unicorn/no-array-callback-reference -- DecorationSet.map takes a ChangeDesc, not an array callback. */ let next =
          value.map(transaction.changes);
        /* eslint-enable unicorn/no-array-callback-reference */ for (const effect of transaction.effects) {
          if (effect.is(highlightLine)) {
            next =
              effect.value === -1
                ? Decoration.none
                : Decoration.set([
                    Decoration.line({ class: "cm-scene-highlight" }).range(effect.value),
                  ]);
          }
        }
        return next;
      },
    });
  function updateFoldButton(state) {
    const collapsed = foldedRanges(state).size > 0,
      button = $("foldButton");
    button.title = collapsed ? "Expand all layout sections" : "Collapse all layout sections";
    button.setAttribute("aria-label", button.title);
    button
      .querySelector("path")
      .setAttribute(
        "d",
        collapsed ? "m8 7 4-4 4 4M4 12h16m-12 5 4 4 4-4" : "m8 3 4 4 4-4M4 12h16m-12 9 4-4 4 4",
      );
  }
  function editorState(doc) {
    return EditorState.create({
      doc,
      extensions: [
        lineNumbers(),
        drawSelection(),
        history(),
        highlightedLine,
        foldService.of(grammarFold),
        codeFolding(),
        foldGutter(),
        EditorState.tabSize.of(2),
        EditorView.contentAttributes.of({ "aria-label": "Design source", spellcheck: "false" }),
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              clearTimeout(compileTimer);
              compile();
              return true;
            },
          },
          indentWithTab,
          ...foldKeymap,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          updateFoldButton(update.state);
          if (!update.docChanged) {
            return;
          }
          clearHover();
          select.value = "custom";
          $("editorState").textContent = "UPDATING…";
          clearTimeout(compileTimer);
          compileTimer = setTimeout(() => compile(), 350);
        }),
      ],
    });
  }
  const editor = new EditorView({ parent: editorHost, state: editorState("") });
  function highlightSource(lineNumber, reveal) {
    const line = editor.state.doc.line(lineNumber),
      effects = [];
    if (reveal) {
      foldedRanges(editor.state).between(0, editor.state.doc.length, (from, to) => {
        if (from < line.to && to >= line.from) {
          effects.push(unfoldEffect.of({ from, to }));
        }
      });
      effects.push(EditorView.scrollIntoView(line.from, { y: "nearest" }));
    }
    effects.push(highlightLine.of(line.from));
    editor.dispatch({ effects });
  }
  function clearHover() {
    requestRender();
    selectionPinned = false;
    hoveredGroup = undefined;
    selectionCard.hidden = true;
    if (editor.state.field(highlightedLine).size > 0) {
      editor.dispatch({ effects: highlightLine.of(-1) });
    }
    renderer.domElement.style.cursor = firstPerson ? "crosshair" : "";
    if (hoverOutline) {
      scene.remove(hoverOutline);
      hoverOutline.geometry.dispose();
      hoverOutline.material.dispose();
      hoverOutline = undefined;
    }
  }
  function hoverObject(event) {
    const bounds = renderer.domElement.getBoundingClientRect(),
      mouse = new THREE.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      ),
      ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    sceneRoot.updateMatrixWorld(true);
    const hit = ray.intersectObjects(sceneRoot.children, true).find(({ object }) => {
      for (let node = object; node; node = node.parent) {
        if (!node.visible) {
          return false;
        }
      }
      return object.isMesh;
    });
    let group = hit?.object;
    while (group && !group.userData.token) {
      group = group.parent;
    }
    indicateGroup(group);
  }
  function indicateGroup(group, fromEditor = false) {
    if (selectionPinned) {
      return;
    }
    if (group === hoveredGroup) {
      return;
    }
    clearHover();
    if (!group || editor.state.doc.toString() !== compiledSource) {
      return;
    }
    const { token } = group.userData;
    hoveredGroup = group;
    hoveredGroup.userData.token = token;
    hoverOutline = new THREE.BoxHelper(group, "#4a9e69");
    requestRender();
    scene.add(hoverOutline);
    selectionCard.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = token.name.replaceAll("_", " ");
    const dimensions = document.createElement("span");
    dimensions.textContent = `${token.dimensions.map((x) => x.toFixed(2)).join(" × ")} m · ${token.yaw}°`;
    const source = document.createElement("span");
    source.textContent = `${token.room.replaceAll("_", " ")} · line ${token.line}`;
    selectionCard.append(title, dimensions, source);
    if (token.url) {
      const link = document.createElement("a");
      link.href = token.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `View product · ${new URL(token.url).hostname}`;
      selectionCard.append(link);
    }
    const hint = document.createElement("span");
    hint.className = "selection-hint";
    hint.textContent = "Click the object to keep details open";
    const close = document.createElement("button");
    close.className = "close-button";
    close.type = "button";
    close.setAttribute("aria-label", "Close object details");
    close.textContent = "×";
    close.addEventListener("click", clearHover);
    selectionCard.append(hint, close);
    selectionCard.hidden = false;
    renderer.domElement.style.cursor = "pointer";
    highlightSource(token.line, !fromEditor);
  }
  function showStatus(message, kind = "ok") {
    status.hidden = kind === "ok" && !message;
    status.className = `message${kind === "ok" ? "" : ` ${kind}`}`;
    status.lastElementChild.textContent = message;
    $("editorState").textContent =
      kind === "error" ? "NEEDS ATTENTION" : kind === "warn" ? "CHECK PLACEMENT" : "READY TO EDIT";
  }
  function fail(message, line) {
    const error = new Error(message);
    error.line = line;
    throw error;
  }
  function productUrl(value, line) {
    if (value === undefined) {
      return;
    }
    let url;
    try {
      url = new URL(value);
    } catch {
      fail("Product links need a complete http:// or https:// URL", line);
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      /\s/u.test(value)
    ) {
      fail("Product links must use HTTP(S), without spaces or credentials", line);
    }
    return url.href;
  }
  function pinSelection() {
    if (hoveredGroup) {
      selectionPinned = true;
      selectionCard.querySelector(".selection-hint").textContent = "Object details pinned";
    }
  }
  function parseToken(token, line) {
    if (token === "." || token === "0" || token === "-") {
      return;
    }
    const linked = token.match(/^(.*)<([^<>]*)>$/u),
      url = productUrl(linked?.[2], line),
      object = linked ? linked[1] : token,
      match = object.match(
        /^([a-z][a-z0-9_]*|[1-9]\d*)(?:@(-?\d+(?:\.\d+)?))?(?:\[(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)\])?(?:\(([a-z][a-z0-9_]*_on_top)\))?(?:~(north|east|south|west))?$/iu,
      );
    if (!match) {
      fail(`Invalid object "${token}"`, line);
    }
    const name = aliases[match[1]] || match[1].toLowerCase();
    if (!catalog[name]) {
      fail(`Unknown object "${match[1]}"`, line);
    }
    const dimensions = match[3]
      ? [Number(match[3]), Number(match[4]), Number(match[5])]
      : catalog[name];
    if (dimensions.some((n) => n <= 0 || n > 10)) {
      fail("Dimensions must be between 0 and 10 metres", line);
    }
    const wall = match[7]?.toLowerCase();
    if (wall && (match[2] !== undefined || ["stairs", "elevator"].includes(name))) {
      fail(
        "Wall placement sets the facing direction and cannot be used with @ or connectors",
        line,
      );
    }
    return {
      child: match[6]?.slice(0, -7),
      dimensions,
      line,
      name,
      url,
      wall,
      yaw: wall ? { east: 270, north: 0, south: 180, west: 90 }[wall] : Number(match[2] || 0),
    };
  }
  function floorPosition(program, room, token, col, row) {
    let x = (col + 0.5) * program.grid,
      z = (row + 0.5) * program.grid;
    if (token.wall) {
      const vertical = ["east", "west"].includes(token.wall),
        positive = ["east", "south"].includes(token.wall),
        [width, depth] = token.dimensions,
        length = (vertical ? room.rows : room.cols) * program.grid,
        across = (vertical ? room.cols : room.rows) * program.grid,
        along = vertical ? z : x,
        start = (vertical ? room.z : room.x) * program.grid,
        edge = (vertical ? room.x : room.z) * program.grid + (positive ? across : 0),
        opposite = { east: "west", north: "south", south: "north", west: "east" }[token.wall],
        supports = program.rooms.filter((other) => {
          if (other === room) {
            return room.walls.includes(token.wall);
          }
          const otherEdge =
            (vertical ? other.x : other.z) * program.grid +
            (positive ? 0 : (vertical ? other.cols : other.rows) * program.grid);
          return (
            other.floor === room.floor &&
            other.walls.includes(opposite) &&
            Math.abs(otherEdge - edge) < 0.000001 &&
            start + along - width / 2 >= (vertical ? other.z : other.x) * program.grid &&
            start + along + width / 2 <=
              (vertical ? other.z + other.rows : other.x + other.cols) * program.grid
          );
        });
      if (supports.length === 0) {
        fail(`No supporting ${token.wall} wall for ${token.name}`, token.line);
      }
      if (along - width / 2 < 0.06 || along + width / 2 > length - 0.06 || depth > across - 0.12) {
        fail(`Wall placement of ${token.name} does not fit inside the room`, token.line);
      }
      for (const support of supports) {
        const side = support === room ? token.wall : opposite,
          span = (vertical ? support.rows : support.cols) * program.grid,
          middle = (vertical ? support.z : support.x) * program.grid + span / 2;
        if (
          support.doors.includes(side) &&
          Math.abs(start + along - middle) < width / 2 + Math.min(1.15, span * 0.4) / 2
        ) {
          fail(`Wall placement of ${token.name} blocks a door`, token.line);
        }
      }
      const inset = depth / 2 + wallThickness(program, room, token.wall) / 2;
      if (vertical) {
        x = positive ? across - inset : inset;
      } else {
        z = positive ? across - inset : inset;
      }
    }
    return {
      x: (room.x - program.cols / 2) * program.grid + x,
      z: (room.z - program.rows / 2) * program.grid + z,
    };
  }
  function parseProgram(source) {
    const program = {
        cols: 0,
        exteriorWallThickness: 0.24,
        facade: "none",
        grid: 0.82,
        interiorWallThickness: 0.12,
        layouts: {},
        margin: 5,
        roof: "none",
        rooms: [],
        rows: 0,
        site: "none",
        warnings: [],
      },
      raw = source.split("\n");
    let active,
      currentRoom,
      floor = 0;
    raw.forEach((original, index) => {
      const line = index + 1,
        text = original
          .replaceAll(/<[^>]*>|#[^\n]*/gu, (part) => (part.startsWith("#") ? "" : part))
          .trim();
      if (!text) {
        return;
      }
      if (/^WALL_THICKNESS\b/iu.test(text)) {
        const fields = text.split(/\s+/u),
          values = fields.slice(1).map(Number);
        if (
          active ||
          values.length !== 2 ||
          values.some((value) => !Number.isFinite(value) || value < 0.06 || value > 0.6)
        ) {
          fail("Use WALL_THICKNESS exterior interior outside layouts, each 0.06–0.6 metres", line);
        }
        [program.exteriorWallThickness, program.interiorWallThickness] = values;
      } else if (/^(SITE|FACADE|ROOF)\b/iu.test(text)) {
        if (active) {
          fail("Exterior settings belong outside layouts", line);
        }
        const fields = text.toLowerCase().split(/\s+/u),
          [setting, value] = fields,
          choices = {
            facade: ["none", "plaster", "brick", "timber", "concrete"],
            roof: ["none", "flat", "pitched"],
            site: ["none", "grass", "paving", "sand"],
          };
        if (!choices[setting].includes(value) || fields.length > (setting === "site" ? 3 : 2)) {
          fail(
            "Use SITE none/grass/paving/sand [margin], FACADE none/plaster/brick/timber/concrete, or ROOF none/flat/pitched",
            line,
          );
        }
        if (setting === "site" && fields[2] !== undefined) {
          const margin = Number(fields[2]);
          if (!Number.isFinite(margin) || margin < 1 || margin > 30) {
            fail("SITE margin must be 1–30 metres", line);
          }
          program.margin = margin;
        }
        program[setting] = value;
      } else if (/^LIGHT\b/iu.test(text)) {
        const match = text.match(
          /^LIGHT\s+(\w+)\s+AT\s+(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(?:\s+POWER\s+(\d+(?:\.\d+)?))?$/iu,
        );
        if (!currentRoom || active || !match || !lightAssets.includes(match[1].toLowerCase())) {
          fail("Use LIGHT asset AT column,row [POWER 0–200] inside a room definition", line);
        }
        if (match[1].toLowerCase() === "wall_lamp") {
          fail("Use MOUNT east 2 wall_lamp for wall fixtures", line);
        }
        const x = Number(match[2]),
          z = Number(match[3]),
          power = match[4] === undefined ? undefined : Number(match[4]);
        if (
          x > currentRoom.cols - 1 ||
          z > currentRoom.rows - 1 ||
          (power !== undefined && (!Number.isFinite(power) || power > 200)) ||
          currentRoom.lights.length >= 64
        ) {
          fail("LIGHT must fit the room, with POWER 0–200 and at most 64 fixtures per room", line);
        }
        currentRoom.lights.push({ line, name: match[1].toLowerCase(), power, x, z });
      } else if (/^FLOOR\s+/iu.test(text)) {
        const match = text.match(/^FLOOR\s+(\d+)$/iu);
        if (!match || Number(match[1]) > 31 || active) {
          fail("Use FLOOR 0–31 outside a layout", line);
        }
        floor = Number(match[1]);
        currentRoom = undefined;
      } else if (/^(ROOM|BALCONY)\s+/iu.test(text)) {
        if (active) {
          fail("Finish the current layout with END before another area", line);
        }
        const m = text.match(
          /^(ROOM|BALCONY)\s+(?:([a-z][a-z0-9_]*)\s+)?(\d+)x(\d+)(?:\s+AT\s+(\d+),(\d+))?$/iu,
        );
        if (!m) {
          fail("Use ROOM 9x7, ROOM kitchen 8x6 AT 9,0, or BALCONY terrace 8x3 AT 0,7", line);
        }
        const kind = m[1].toLowerCase(),
          room = {
            cols: Number(m[3]),
            doors: [],
            elevation: floor * 3,
            floor,
            kind,
            lights: [],
            line,
            mounts: [],
            name: (m[2] || "main").toLowerCase(),
            rails: kind === "balcony" ? ["west", "south", "east"] : [],
            rows: Number(m[4]),
            style: "warm",
            walls: kind === "balcony" ? [] : ["north", "east", "west"],
            x: Number(m[5] || 0),
            z: Number(m[6] || 0),
          };
        if (room.cols > 40 || room.rows > 40 || room.cols < 2 || room.rows < 2) {
          fail("Room dimensions must be 2–40 cells", line);
        }
        if (program.rooms.some((r) => r.name === room.name)) {
          fail(`Room "${room.name}" is already defined`, line);
        }
        if (program.rooms.length >= 32) {
          fail("A program supports up to 32 rooms", line);
        }
        program.rooms.push(room);
        currentRoom = room;
      } else if (/^GRID\s+/iu.test(text)) {
        const m = text.match(/^GRID\s+(\d+(?:\.\d+)?)$/iu);
        if (!m) {
          fail("Use GRID metres, such as GRID 0.85", line);
        }
        program.grid = Number(m[1]);
        if (program.grid < 0.2 || program.grid > 3) {
          fail("Grid size must be 0.2–3 metres", line);
        }
      } else if (/^WALLS\s+/iu.test(text)) {
        if (!currentRoom) {
          fail("Define a ROOM before its WALLS", line);
        }
        const directions = text
          .slice(6)
          .trim()
          .toLowerCase()
          .split(/[\s,]+/u);
        if (directions.some((d) => !["north", "south", "east", "west", "none"].includes(d))) {
          fail("Walls must use north, south, east, west or none", line);
        }
        currentRoom.walls = directions.includes("none") ? [] : [...new Set(directions)];
        currentRoom.wallsLine = line;
      } else if (/^RAILS\s+/iu.test(text)) {
        if (!currentRoom || currentRoom.kind !== "balcony") {
          fail("RAILS applies to the most recent BALCONY", line);
        }
        const directions = text
          .slice(6)
          .trim()
          .toLowerCase()
          .split(/[\s,]+/u);
        if (directions.some((d) => !["north", "south", "east", "west", "none"].includes(d))) {
          fail("Rails must use north, south, east, west or none", line);
        }
        currentRoom.rails = directions.includes("none") ? [] : [...new Set(directions)];
      } else if (/^WINDOWS\s+/iu.test(text)) {
        if (!currentRoom || currentRoom.kind === "balcony") {
          fail("WINDOWS needs an indoor ROOM", line);
        }
        const directions = text
          .slice(8)
          .trim()
          .toLowerCase()
          .split(/[\s,]+/u);
        if (
          directions.some((dir) => !["north", "south", "east", "west", "none"].includes(dir)) ||
          (directions.includes("none") && directions.length > 1)
        ) {
          fail("Use WINDOWS north south east west, or WINDOWS none", line);
        }
        currentRoom.windows = directions.includes("none") ? [] : [...new Set(directions)];
        currentRoom.windowsLine = line;
      } else if (/^DOORS\s+/iu.test(text)) {
        if (!currentRoom) {
          fail("Define a ROOM before its DOORS", line);
        }
        const directions = text
          .slice(6)
          .trim()
          .toLowerCase()
          .split(/[\s,]+/u);
        if (directions.some((d) => !["north", "south", "east", "west"].includes(d))) {
          fail("Doors must use north, south, east or west", line);
        }
        currentRoom.doors = [...new Set(directions)];
        currentRoom.doorsLine = line;
      } else if (/^STYLE\s+/iu.test(text)) {
        if (!currentRoom) {
          fail("Define a ROOM before its STYLE", line);
        }
        const style = text.slice(6).trim().toLowerCase();
        if (
          ![
            "warm",
            "blue",
            "neutral",
            "liminal",
            "industrial",
            "aquatic",
            "mediterranean",
          ].includes(style)
        ) {
          fail(
            "STYLE must be warm, blue, neutral, liminal, industrial, aquatic, or mediterranean",
            line,
          );
        }
        currentRoom.style = style;
      } else if (/^MOUNT\s+/iu.test(text)) {
        if (!currentRoom || currentRoom.kind === "balcony") {
          fail("MOUNT needs an indoor ROOM", line);
        }
        const m = text.match(/^MOUNT\s+(north|south|east|west)\s+(\d+)\s+(\w+)(?:<([^<>]*)>)?$/iu);
        if (!m) {
          fail("Use MOUNT north 3 poster, MOUNT east 2 wall_lamp, or another wall asset", line);
        }
        if (!["air_conditioner", "wall_lamp", ...wallDecor].includes(m[3].toLowerCase())) {
          fail("MOUNT requires a wall decoration, wall_lamp, or air_conditioner", line);
        }
        currentRoom.mounts.push({
          cell: Number(m[2]),
          line,
          name: m[3].toLowerCase(),
          side: m[1].toLowerCase(),
          url: productUrl(m[4], line),
        });
      } else if (/^LAYOUT\s+/iu.test(text)) {
        const m = text.match(/^LAYOUT\s+([a-z][a-z0-9_]*)$/iu);
        if (!m) {
          fail("Use LAYOUT followed by a name", line);
        }
        active = m[1].toLowerCase();
        if (program.layouts[active]) {
          fail(`Layout "${active}" is already defined`, line);
        }
        program.layouts[active] = [];
      } else if (/^END$/iu.test(text)) {
        if (!active) {
          fail("END without a layout", line);
        }
        active = undefined;
      } else {
        if (!active) {
          fail(`Unexpected text "${text}"`, line);
        }
        const tokens = text.replaceAll(/<[^>]*>/gu, "").includes("|")
          ? text.split(/\|(?![^<]*>)/u).map((x) => x.trim())
          : text.split(/\s+(?![^<]*>)/u);
        if (tokens.some((x) => !x)) {
          fail("Empty grid cell; use . for an empty cell", line);
        }
        let searchFrom = 0;
        program.layouts[active].push(
          tokens.map((t) => {
            const start = original.indexOf(t, searchFrom);
            searchFrom = start + t.length;
            const token = parseToken(t, line);
            if (token) {
              token.start = start;
              token.end = searchFrom;
            }
            return token;
          }),
        );
      }
    });
    if (active) {
      fail(`Layout "${active}" needs END`, raw.length);
    }
    if (program.rooms.length === 0) {
      fail("Add a ROOM before the layouts", 1);
    }
    program.cols = Math.max(...program.rooms.map((room) => room.x + room.cols));
    program.rows = Math.max(...program.rooms.map((room) => room.z + room.rows));
    if (program.cols > 40 || program.rows > 40) {
      fail("The full floor plan must fit within 40×40 cells", 1);
    }
    for (const room of program.rooms) {
      const layout = program.layouts[room.name];
      if (!layout?.length) {
        fail(`Add a LAYOUT ${room.name} for room "${room.name}"`, room.line);
      }
      if (layout.length > room.rows || layout.some((row) => row.length > room.cols)) {
        fail(`LAYOUT ${room.name} exceeds its ${room.cols}×${room.rows} room`, room.line);
      }
      layout.forEach((row, r) =>
        row.forEach((token, c) => {
          if (token?.wall) {
            floorPosition(program, room, token, c, r);
          }
        }),
      );
      if (room.doors.some((dir) => !room.walls.includes(dir))) {
        fail(`DOORS must also appear in WALLS for room "${room.name}"`, room.line);
      }
      for (const dir of room.windows || []) {
        if (!room.walls.includes(dir) || room.doors.includes(dir)) {
          fail("WINDOWS must use an existing wall without a door", room.line);
        }
        if ((["north", "south"].includes(dir) ? room.cols : room.rows) * program.grid <= 2.2) {
          fail("Window walls must be longer than 2.2 metres", room.line);
        }
      }
      for (const mount of room.mounts) {
        if (
          !room.walls.includes(mount.side) ||
          mount.cell >= (["north", "south"].includes(mount.side) ? room.cols : room.rows)
        ) {
          fail(
            `MOUNT on line ${mount.line} must use an existing wall and a cell inside the room`,
            mount.line,
          );
        }
      }
    }
    for (let i = 0; i < program.rooms.length; i += 1) {
      for (let j = i + 1; j < program.rooms.length; j += 1) {
        const a = program.rooms[i],
          b = program.rooms[j];
        if (
          a.floor === b.floor &&
          a.x < b.x + b.cols &&
          a.x + a.cols > b.x &&
          a.z < b.z + b.rows &&
          a.z + a.rows > b.z
        ) {
          fail(`Rooms "${a.name}" and "${b.name}" overlap`, b.line);
        }
      }
    }
    for (const [name, layout] of Object.entries(program.layouts)) {
      if (
        !program.rooms.some((room) => room.name === name) &&
        (layout.length > 12 || layout.some((r) => r.length > 12))
      ) {
        fail(`Sub-layout "${name}" exceeds 12×12 cells`, 1);
      }
      for (const row of layout) {
        for (const token of row) {
          if (token?.child && !program.layouts[token.child]) {
            fail(`Missing LAYOUT ${token.child} for object on line ${token.line}`, token.line);
          }
          if (token?.child && program.layouts[token.child].flat().some((item) => item?.wall)) {
            fail("Wall placement is only available in a main layout", token.line);
          }
        }
      }
    }
    program.floors = [...new Set(program.rooms.map((room) => room.floor))].toSorted(
      (a, b) => a - b,
    );
    program.connectors = [];
    const elevatorStops = [];
    for (const room of program.rooms) {
      program.layouts[room.name].forEach((row, r) =>
        row.forEach((token, c) => {
          if (!token || !["stairs", "elevator"].includes(token.name)) {
            return;
          }
          if (token.yaw % 90 !== 0 || token.dimensions[2] !== 3 || token.child) {
            fail(
              "Stairs and elevators need 3m height, 90° rotation steps, and no sub-layout",
              token.line,
            );
          }
          const [w, d] = token.dimensions,
            turned = Math.abs(token.yaw % 180) === 90,
            halfX = (turned ? d : w) / program.grid / 2,
            halfZ = (turned ? w : d) / program.grid / 2,
            x = room.x + c + 0.5,
            z = room.z + r + 0.5,
            fits = (area) =>
              x - halfX >= area.x &&
              x + halfX <= area.x + area.cols &&
              z - halfZ >= area.z &&
              z + halfZ <= area.z + area.rows,
            upper = program.rooms.find((area) => area.floor === room.floor + 1 && fits(area));
          if (token.name === "elevator") {
            if (!fits(room)) {
              fail("Elevator must fit inside its room", token.line);
            }
            elevatorStops.push({ halfX, halfZ, room, token, x, z });
            return;
          }
          if (!fits(room) || !upper) {
            fail(
              "Stairs/elevator must fit inside this room and a room one floor above",
              token.line,
            );
          }
          program.connectors.push({ halfX, halfZ, room, token, upper, x, z });
        }),
      );
    }
    const stairs = program.connectors.filter((link) => link.token.name === "stairs");
    for (let i = 0; i < stairs.length; i += 1) {
      for (let j = i + 1; j < stairs.length; j += 1) {
        const a = stairs[i],
          b = stairs[j];
        if (Math.abs(a.x - b.x) < a.halfX + b.halfX && Math.abs(a.z - b.z) < a.halfZ + b.halfZ) {
          fail(
            "Stair footprints must not overlap or sit on top of each other; move the next flight to a separate landing",
            b.token.line,
          );
        }
      }
    }
    for (const stop of elevatorStops) {
      const aligned = elevatorStops.filter(
          (other) =>
            other !== stop &&
            other.x === stop.x &&
            other.z === stop.z &&
            other.halfX === stop.halfX &&
            other.halfZ === stop.halfZ &&
            (other.token.yaw - stop.token.yaw) % 360 === 0,
        ),
        upper = aligned.find((other) => other.room.floor === stop.room.floor + 1);
      if (!upper && !aligned.some((other) => other.room.floor === stop.room.floor - 1)) {
        fail(
          "Elevators need aligned stops with matching size and rotation on at least two consecutive floors",
          stop.token.line,
        );
      }
      if (upper) {
        program.connectors.push({
          halfX: stop.halfX,
          halfZ: stop.halfZ,
          room: stop.room,
          token: stop.token,
          upper: upper.room,
          x: stop.x,
          z: stop.z,
        });
      }
    }
    for (const [name, rows] of Object.entries(program.layouts)) {
      if (
        !program.rooms.some((room) => room.name === name) &&
        rows.flat().some((token) => token && ["stairs", "elevator"].includes(token.name))
      ) {
        fail("Place stairs and elevators in a main layout", 1);
      }
    }
    return program;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#eff2ee");
  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 250),
    renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  viewport.prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2.06;
  controls.minDistance = 3;
  controls.maxDistance = 100;
  controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
  const sunlight = new THREE.DirectionalLight("#ffedd3", 2.4);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(2048, 2048);
  sunlight.shadow.camera.left = -12;
  sunlight.shadow.camera.right = 12;
  sunlight.shadow.camera.top = 12;
  sunlight.shadow.camera.bottom = -12;
  sunlight.shadow.normalBias = 0.025;
  sunlight.shadow.radius = 3;
  scene.add(sunlight, sunlight.target);
  const sceneRoot = new THREE.Group();
  scene.add(sceneRoot);
  const shadowRoot = new THREE.Group(),
    shadowMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  let fixtureOverride,
    previousDaylight,
    renderDirty = true;
  const lastView = new THREE.Matrix4(),
    renderFixtures = createFixtureRenderer(renderer, scene, camera, sunlight);
  function requestRender() {
    renderDirty = true;
  }
  controls.addEventListener("change", requestRender);
  viewport.addEventListener("pointermove", requestRender);
  viewport.addEventListener("pointerleave", requestRender);
  document.addEventListener("input", requestRender);
  document.addEventListener("click", requestRender);
  scene.add(shadowRoot);
  function updateShadowEnclosure() {
    shadowRoot.clear();
    const enclosure = mergedEnclosure(sceneRoot, shadowMaterial);
    sceneRoot.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
      }
    });
    if (enclosure) {
      shadowRoot.add(enclosure);
    }
    renderer.shadowMap.needsUpdate = true;
  }
  function fixtureLight(parent, intensity, x, y, z) {
    const light = new THREE.PointLight("#ffe4ba", intensity, 0, 2);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.shadow.mapSize.set(256, 256);
    light.shadow.camera.near = 0.01;
    light.shadow.normalBias = 0.005;
    parent.add(light);
    return light;
  }
  function updateIndoorLights() {
    renderDirty = true;
    renderer.shadowMap.needsUpdate = true;
    const enabled = fixtureOverride ?? sunlight.intensity === 0,
      button = $("lightsButton"),
      label = enabled ? "Turn all fixture lights off" : "Turn all fixture lights on";
    button.classList.toggle("active", enabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", label);
    button.title = label;
    $("indoorLights").textContent =
      `All fixtures ${enabled ? "on" : "off"} · ${fixtureOverride === undefined ? "automatic" : "manual until sunrise/sunset"}`;
    sceneRoot.traverse((node) => {
      if (node.isLight) {
        if (node.userData.litIntensity === undefined) {
          node.userData.litIntensity = node.intensity;
        }
        node.intensity = enabled ? node.userData.litIntensity : 0;
        node.visible = enabled;
      }
      for (const item of [node.material].flat().filter(Boolean)) {
        if (item.emissive && item.emissive.getHex() !== 0) {
          if (item.userData.litIntensity === undefined) {
            item.userData.litIntensity = item.emissiveIntensity;
          }
          item.emissiveIntensity = enabled ? item.userData.litIntensity : 0;
        }
      }
    });
  }
  $("lightsButton").addEventListener("click", () => {
    fixtureOverride = $("lightsButton").getAttribute("aria-pressed") !== "true";
    updateIndoorLights();
  });
  $("renderQuality").addEventListener("change", () => {
    const quality = $("renderQuality").value;
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, quality === "fast" ? 1 : quality === "high" ? 2 : 1.5),
    );
    resize();
  });
  const sunFields = ["Date", "Time", "Latitude", "Longitude", "Offset", "Orientation", "Exposure"],
    sharedSettings = new URLSearchParams(location.hash.slice(1)),
    today = new Date();
  $("sunDate").value =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  for (const field of sunFields) {
    const input = $(`sun${field}`),
      sharedValue = sharedSettings.get(`sun${field}`),
      fallback = input.value;
    if (sharedValue !== null) {
      input.value = sharedValue;
      if (!input.checkValidity()) {
        input.value = fallback;
      }
    }
  }
  function solarPosition(date, time, latitude, longitude, offset) {
    const radians = Math.PI / 180,
      [year, month, day] = date.split("-").map(Number),
      [hour, minute] = time.split(":").map(Number),
      start = Date.UTC(year, 0, 1),
      days = (Date.UTC(year + 1, 0, 1) - start) / 86_400_000,
      dayOfYear = (Date.UTC(year, month - 1, day) - start) / 86_400_000 + 1,
      gamma = ((2 * Math.PI) / days) * (dayOfYear - 1 + (hour + minute / 60 - 12) / 24),
      equation =
        229.18 *
        (0.000075 +
          0.001868 * Math.cos(gamma) -
          0.032077 * Math.sin(gamma) -
          0.014615 * Math.cos(2 * gamma) -
          0.040849 * Math.sin(2 * gamma)),
      declination =
        0.006918 -
        0.399912 * Math.cos(gamma) +
        0.070257 * Math.sin(gamma) -
        0.006758 * Math.cos(2 * gamma) +
        0.000907 * Math.sin(2 * gamma) -
        0.002697 * Math.cos(3 * gamma) +
        0.00148 * Math.sin(3 * gamma),
      hourAngle =
        ((hour * 60 + minute + equation + 4 * longitude - 60 * offset) / 4 - 180) * radians,
      lat = latitude * radians,
      east = -Math.cos(declination) * Math.sin(hourAngle),
      north =
        Math.cos(lat) * Math.sin(declination) -
        Math.sin(lat) * Math.cos(declination) * Math.cos(hourAngle),
      up =
        Math.sin(lat) * Math.sin(declination) +
        Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
    return {
      altitude: Math.asin(Math.max(-1, Math.min(1, up))) / radians,
      azimuth: (Math.atan2(east, north) / radians + 360) % 360,
    };
  }
  function updateSun() {
    renderDirty = true;
    renderer.shadowMap.needsUpdate = true;
    if (!$("sunSettings").checkValidity()) {
      $("sunStatus").textContent = "Enter a valid date, time, and values within the shown ranges.";
      return;
    }
    const { altitude, azimuth } = solarPosition(
        $("sunDate").value,
        $("sunTime").value,
        $("sunLatitude").valueAsNumber,
        $("sunLongitude").valueAsNumber,
        $("sunOffset").valueAsNumber,
      ),
      elevation = (altitude * Math.PI) / 180,
      bearing = ((azimuth - $("sunOrientation").valueAsNumber) * Math.PI) / 180,
      height = currentProgram ? (currentProgram.floors.at(-1) + 1) * 3 : 3,
      radius = currentProgram
        ? Math.hypot(
            currentProgram.cols * currentProgram.grid,
            currentProgram.rows * currentProgram.grid,
            height,
          ) /
            2 +
          2
        : 12,
      daylight = Math.max(0, Math.sin(elevation));
    sunlight.target.position.set(0, height / 2, 0);
    sunlight.position
      .set(
        Math.sin(bearing) * Math.cos(elevation),
        Math.sin(elevation),
        -Math.cos(bearing) * Math.cos(elevation),
      )
      .multiplyScalar(radius * 3)
      .add(sunlight.target.position);
    renderer.toneMappingExposure = 1.05 * 2 ** $("sunExposure").valueAsNumber;
    daylightStrength.value = Math.min(1, daylight * 4);
    sunlight.intensity = altitude > 0 ? 2.4 * Math.min(1, daylight * 4) : 0;
    sunlight.castShadow = altitude > 0;
    if (previousDaylight !== altitude > 0) {
      fixtureOverride = undefined;
    }
    previousDaylight = altitude > 0;
    updateIndoorLights();
    sunlight.color.setHSL(0.1, 0.15 + 0.55 * (1 - Math.min(1, daylight * 3)), 0.9);
    scene.background.set("#000000").lerp(new THREE.Color("#eff2ee"), Math.min(1, daylight * 4));
    Object.assign(sunlight.shadow.camera, {
      bottom: -radius,
      far: radius * 5,
      left: -radius,
      near: radius,
      right: radius,
      top: radius,
    });
    sunlight.shadow.camera.updateProjectionMatrix();
    $("sunStatus").textContent =
      `${altitude > 0 ? "Daylight" : "Sun below horizon · no direct sunlight"} · Elevation ${altitude.toFixed(1)}° · Bearing ${azimuth.toFixed(1)}° from true north`;
  }
  $("sunSettings").addEventListener("submit", (event) => event.preventDefault());
  $("sunSettings").addEventListener("input", updateSun);
  $("sunSettings").addEventListener("focusin", () => pressedKeys.clear());
  function surfaceTexture(kind) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d"),
      pixels = context.createImageData(256, 256);
    let seed = 71;
    for (let y = 0; y < 256; y += 1) {
      for (let x = 0; x < 256; x += 1) {
        seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
        const noise = seed / 4_294_967_296,
          phase = (x / 256) * Math.PI * 2,
          grain = Math.sin(
            (y / 256) * Math.PI * 48 + 1.8 * Math.sin(phase) + 0.5 * Math.sin(phase * 3),
          ),
          value =
            kind === "plaster"
              ? 235 + noise * 20
              : kind === "tile"
                ? x < 2 || y < 2
                  ? 180
                  : 228 + noise * 9 + 4 * Math.sin(phase + y / 32)
                : kind === "wood"
                  ? 216 +
                    grain * 8 +
                    Math.sin((y / 256) * Math.PI * 146 + Math.sin(phase) * 4) * 3 +
                    noise * 8
                  : 218 + (x % 4 < 2 === y % 4 < 2 ? 12 : -12) + noise * 12,
          offset = (y * 256 + x) * 4;
        pixels.data[offset] = value;
        pixels.data[offset + 1] = value;
        pixels.data[offset + 2] = value;
        pixels.data[offset + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }
  const grainTexture = surfaceTexture("wood"),
    weaveTexture = surfaceTexture("fabric"),
    colors = {
      amber: "#edb956",
      ceiling: "#f5f2eb",
      clay: "#b97861",
      concrete: "#b5bab6",
      cream: "#e7d5ba",
      fabric: "#8fa7a0",
      fabricDark: "#627f79",
      floor: "#9f7656",
      glow: "#d6fff1",
      green: "#5c956f",
      linen: "#a49d8e",
      metal: "#586873",
      ochre: "#c96a16",
      plaster: "#f1ede3",
      rug: "#aa7055",
      screen: "#16232b",
      slate: "#655f54",
      stone: "#c9c1b2",
      terracotta: "#ad6442",
      wall: "#d4d0c7",
      water: "#42bfd1",
      white: "#ebe9e2",
      wood: "#ae8060",
      woodDark: "#694d3e",
      yellow: "#cfc18a",
    },
    mat = (color, roughness = 0.82, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, envMapIntensity: 0.45, metalness, roughness }),
    material = Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [
        k,
        mat(v, k === "screen" ? 0.32 : 0.84, k === "metal" ? 0.55 : 0),
      ]),
    ),
    sharedMaterials = new Set(Object.values(material)),
    woodPlanks = ["#a58a69", "#aa9070", "#a38968", "#b09576"].map((color) => mat(color, 0.76));
  woodPlanks.forEach((item) => sharedMaterials.add(item));
  material.ceiling.userData.enclosure = true;
  for (const item of [material.wood, material.woodDark, material.floor, ...woodPlanks]) {
    item.map = grainTexture;
    item.bumpMap = grainTexture;
    item.bumpScale = 0.001;
    item.roughness = 0.56;
    item.userData.textureScale = 0.6;
  }
  for (const key of ["fabric", "fabricDark", "cream", "rug", "linen", "ochre"]) {
    material[key].map = weaveTexture;
    material[key].bumpMap = weaveTexture;
    material[key].bumpScale = 0.002;
    material[key].userData.textureScale = 0.22;
  }
  const plasterTexture = surfaceTexture("plaster"),
    tileTexture = surfaceTexture("tile");
  material.plaster.bumpMap = plasterTexture;
  material.plaster.bumpScale = 0.008;
  material.plaster.userData.textureScale = 0.5;
  material.plaster.roughness = 0.94;
  for (const key of ["stone", "terracotta"]) {
    material[key].map = tileTexture;
    material[key].bumpMap = tileTexture;
    material[key].bumpScale = 0.002;
    material[key].userData.textureScale = key === "stone" ? 0.6 : 0.3;
    material[key].roughness = 0.72;
  }
  material.white.roughness = 0.3;
  material.metal.metalness = 0.85;
  material.metal.roughness = 0.27;
  material.screen.roughness = 0.16;
  material.water.roughness = 0.12;
  material.water.metalness = 0.35;
  material.glow.emissive.set("#a0f8da");
  material.glow.emissiveIntensity = 0.8;
  function box(parent, w, h, d, x, y, z, m) {
    const upholstered = [
        material.fabric,
        material.fabricDark,
        material.cream,
        material.linen,
      ].includes(m),
      radius = Math.min(upholstered ? 0.065 : 0.018, Math.min(w, h, d) * 0.24),
      geometry =
        parent.userData.detailed && Math.min(w, h, d) > 0.06
          ? new RoundedBoxGeometry(w, h, d, 2, radius)
          : new THREE.BoxGeometry(w, h, d);
    if (m.userData.textureScale) {
      const positions = geometry.attributes.position,
        normals = geometry.attributes.normal,
        { uv } = geometry.attributes,
        scale = m.userData.textureScale;
      for (let i = 0; i < positions.count; i += 1) {
        const nx = Math.abs(normals.getX(i)),
          ny = Math.abs(normals.getY(i));
        uv.setXY(
          i,
          (nx > 0.7 ? positions.getZ(i) : positions.getX(i)) / scale,
          (ny > 0.7 ? positions.getZ(i) : positions.getY(i)) / scale,
        );
      }
    }
    const mesh = new THREE.Mesh(geometry, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(parent, r1, r2, h, x, y, z, m, segments = 16) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, segments), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function legs(group, w, d, h, materialKey = "woodDark") {
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) {
        cylinder(
          group,
          0.033,
          0.023,
          h,
          x * (w / 2 - 0.11),
          h / 2,
          z * (d / 2 - 0.1),
          material[materialKey],
        );
      }
    }
  }
  function piping(group, w, d, x, y, z, finish) {
    const radius = Math.min(w, d) * 0.12,
      shape = new THREE.Shape();
    shape.moveTo(-w / 2 + radius, -d / 2);
    shape.lineTo(w / 2 - radius, -d / 2);
    shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + radius);
    shape.lineTo(w / 2, d / 2 - radius);
    shape.quadraticCurveTo(w / 2, d / 2, w / 2 - radius, d / 2);
    shape.lineTo(-w / 2 + radius, d / 2);
    shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - radius);
    shape.lineTo(-w / 2, -d / 2 + radius);
    shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + radius, -d / 2);
    const curve = new THREE.CatmullRomCurve3(
        shape.getPoints(6).map((p) => new THREE.Vector3(p.x, 0, p.y)),
        true,
      ),
      seam = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.003, 4, true), finish);
    seam.position.set(x, y, z);
    group.add(seam);
  }
  function foliage(group, x, y, z, height, spread, count) {
    cylinder(group, 0.005, 0.012, height * 0.86, x, y + height * 0.43, z, material.woodDark, 8);
    for (let i = 0; i < count; i += 1) {
      const angle = i * 2.39996,
        base = new THREE.Vector3(x, y + height * (0.22 + (i / count) * 0.62), z),
        tip = new THREE.Vector3(
          x + Math.cos(angle) * spread,
          base.y + height * 0.15,
          z + Math.sin(angle) * spread,
        ),
        stem = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.LineCurve3(base, tip), 1, 0.004, 5, false),
          material.green,
        );
      group.add(stem);
      const geometry = new THREE.SphereGeometry(1, 16, 10),
        positions = geometry.attributes.position;
      for (let j = 0; j < positions.count; j += 1) {
        const along = positions.getY(j);
        positions.setZ(j, positions.getZ(j) * 0.06 + along * along * 0.22);
      }
      geometry.computeVertexNormals();
      const leaf = new THREE.Mesh(geometry, material.green);
      leaf.scale.set(spread * 0.27, spread * 0.75, spread * 0.5);
      leaf.position.copy(tip);
      leaf.rotation.set(0.65, -angle, -0.7);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      group.add(leaf);
    }
  }
  function batchFurniture(group) {
    const batches = new Map();
    for (const child of group.children) {
      if (
        !child.isMesh ||
        child.children.length > 0 ||
        Array.isArray(child.material) ||
        child.material.transparent
      ) {
        continue;
      }
      const key = `${child.material.uuid}:${child.castShadow}:${child.receiveShadow}`;
      if (!batches.has(key)) {
        batches.set(key, []);
      }
      batches.get(key).push(child);
    }
    for (const meshes of batches.values()) {
      if (meshes.length < 2) {
        continue;
      }
      const parts = meshes.map((mesh) => {
          mesh.updateMatrix();
          const geometry = mesh.geometry.index
            ? mesh.geometry.toNonIndexed()
            : mesh.geometry.clone();
          geometry.applyMatrix4(mesh.matrix);
          return geometry;
        }),
        geometry = mergeGeometries(parts);
      parts.forEach((part) => part.dispose());
      if (!geometry) {
        continue;
      }
      const combined = new THREE.Mesh(geometry, meshes[0].material);
      combined.castShadow = meshes[0].castShadow;
      combined.receiveShadow = meshes[0].receiveShadow;
      for (const mesh of meshes) {
        group.remove(mesh);
        mesh.geometry.dispose();
      }
      group.add(combined);
    }
  }
  function makeFurniture(token, semantic = false) {
    const [w, d, h] = token.dimensions,
      group = new THREE.Group(),
      { name } = token;
    if (semantic) {
      const sw = w,
        sh = h,
        sd = d,
        semanticMat = mat(
          name === "plant" ? "#6ea987" : name === "rug" ? "#b67e6e" : "#86baa9",
          0.75,
        );
      box(group, sw, sh, sd, 0, sh / 2, 0, semanticMat);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(sw + 0.005, sh + 0.005, sd + 0.005)),
        new THREE.LineBasicMaterial({ color: "#d9f6e8", opacity: 0.7, transparent: true }),
      );
      edges.position.y = sh / 2;
      group.add(edges);
    } else {
      group.userData.detailed = true;
      const [cw, cd, ch] = catalog[name];
      switch (name) {
        case "pool":
        case "hot_tub": {
          box(group, cw, 0.12, cd, 0, 0.06, 0, material.white);
          box(group, cw - 0.24, 0.035, cd - 0.24, 0, ch - 0.18, 0, material.water);
          for (const side of [-1, 1]) {
            box(group, cw, ch, 0.12, 0, ch / 2, side * (cd / 2 - 0.06), material.white);
            box(group, 0.12, ch, cd, side * (cw / 2 - 0.06), ch / 2, 0, material.white);
            box(
              group,
              cw + 0.04,
              0.07,
              0.2,
              0,
              ch - 0.035,
              side * (cd / 2 - 0.06),
              material.concrete,
            );
          }
          for (let i = 0; i < 4; i += 1) {
            box(group, cw * 0.65, 0.008, 0.015, 0, ch - 0.157, ((i - 1.5) * cd) / 5, material.glow);
          }
          for (const side of [-1, 1]) {
            cylinder(group, 0.025, 0.025, ch, side * 0.22, ch / 2, cd / 2 - 0.22, material.metal);
          }
          for (let step = 0; step < 3; step += 1) {
            box(group, 0.48, 0.035, 0.1, 0, 0.2 + step * 0.2, cd / 2 - 0.22, material.metal);
          }
          break;
        }
        case "sun_lounger": {
          legs(group, cw, cd, 0.25, "metal");
          box(group, cw, 0.12, cd, 0, 0.3, 0, material.wood);
          box(group, cw - 0.08, 0.08, cd * 0.6, 0, 0.4, cd * 0.18, material.cream);
          const back = box(group, cw - 0.08, 0.09, cd * 0.4, 0, 0.48, -cd * 0.28, material.cream);
          back.rotation.x = -0.4;
          break;
        }
        case "parasol": {
          cylinder(group, 0.3, 0.36, 0.1, 0, 0.05, 0, material.concrete);
          cylinder(group, 0.025, 0.025, ch - 0.2, 0, (ch - 0.2) / 2, 0, material.wood);
          cylinder(group, 0.02, cw / 2, 0.45, 0, ch - 0.225, 0, material.cream, 8);
          break;
        }
        case "fountain": {
          cylinder(group, cw / 2, cw / 2, 0.25, 0, 0.125, 0, material.concrete);
          cylinder(group, cw * 0.43, cw * 0.43, 0.02, 0, 0.26, 0, material.water);
          cylinder(group, 0.12, 0.22, 1, 0, 0.75, 0, material.concrete);
          cylinder(group, 0.46, 0.15, 0.18, 0, 1.22, 0, material.white);
          cylinder(group, 0.035, 0.06, 0.25, 0, 1.375, 0, material.water);
          for (let i = 0; i < 8; i += 1) {
            const angle = (i * Math.PI) / 4;
            cylinder(
              group,
              0.012,
              0.022,
              0.85,
              Math.cos(angle) * 0.4,
              0.75,
              Math.sin(angle) * 0.4,
              material.water,
              6,
            );
          }
          break;
        }
        case "hedge": {
          group.userData.detailed = false;
          box(group, cw, ch, cd, 0, ch / 2, 0, material.green);
          box(group, cw * 0.94, 0.08, cd * 0.9, 0, ch - 0.04, 0, material.fabricDark);
          break;
        }
        case "partition": {
          group.userData.detailed = false;
          box(group, cw, ch, cd, 0, ch / 2, 0, material.yellow);
          box(group, cw, 0.09, cd + 0.015, 0, 0.045, 0, material.woodDark);
          break;
        }
        case "column": {
          cylinder(group, cw * 0.4, cw * 0.4, ch, 0, ch / 2, 0, material.concrete, 12);
          box(group, cw, 0.12, cd, 0, 0.06, 0, material.white);
          box(group, cw, 0.12, cd, 0, ch - 0.06, 0, material.white);
          break;
        }
        case "pendant_light": {
          cylinder(group, 0.07, 0.07, 0.06, 0, ch - 0.03, 0, material.metal);
          cylinder(group, 0.008, 0.008, 0.55, 0, ch - 0.3, 0, material.metal);
          cylinder(group, 0.08, cw / 2, 0.2, 0, ch - 0.65, 0, material.white);
          fixtureLight(group, 18, 0, ch - 0.78, 0);
          break;
        }
        case "track_light": {
          box(group, cw, 0.055, 0.07, 0, ch - 0.03, 0, material.metal);
          for (const x of [-cw * 0.32, 0, cw * 0.32]) {
            cylinder(group, 0.065, 0.085, 0.14, x, ch - 0.12, 0, material.metal);
          }
          fixtureLight(group, 24, 0, ch - 0.22, 0);
          break;
        }
        case "garden_lamp":
        case "lantern": {
          const emitter = mat("#fff2d5");
          emitter.emissive.set("#ffd496");
          emitter.emissiveIntensity = 1;
          cylinder(group, cw * 0.48, cw * 0.5, 0.06, 0, 0.03, 0, material.metal);
          if (name === "garden_lamp") {
            cylinder(group, 0.035, 0.05, ch * 0.7, 0, ch * 0.35, 0, material.metal);
          }
          cylinder(group, cw * 0.35, cw * 0.35, ch * 0.25, 0, ch * 0.78, 0, emitter);
          cylinder(group, cw * 0.5, cw * 0.5, 0.04, 0, ch * 0.94, 0, material.metal);
          fixtureLight(group, 8, 0, ch * 0.78, cw * 0.45);
          break;
        }
        case "downlight":
        case "ceiling_light": {
          cylinder(group, cw / 2, cw / 2, 0.08, 0, ch - 0.04, 0, material.white);
          const diffuser = mat("#fff1d8", 0.65);
          diffuser.emissive.set("#ffe3b0");
          diffuser.emissiveIntensity = 1;
          cylinder(group, cw * 0.42, cw * 0.42, 0.015, 0, ch - 0.085, 0, diffuser);
          fixtureLight(group, 18, 0, ch - 0.12, 0);
          break;
        }
        case "fluorescent_light": {
          fixtureLight(group, 18, 0, ch - 0.13, 0);
          box(group, cw, 0.07, cd, 0, ch - 0.035, 0, material.metal);
          for (const side of [-1, 1]) {
            box(group, cw - 0.08, 0.025, 0.07, 0, ch - 0.075, side * 0.075, material.glow);
          }
          break;
        }
        case "vending_machine":
        case "arcade_machine":
        case "server_rack": {
          box(group, cw, ch, cd, 0, ch / 2, 0, material.metal);
          box(group, cw - 0.12, ch * 0.54, 0.035, 0, ch * 0.61, cd / 2, material.screen);
          box(group, cw - 0.08, 0.14, 0.04, 0, ch - 0.1, cd / 2, material.glow);
          if (name === "server_rack") {
            for (let i = 0; i < 9; i += 1) {
              box(group, cw - 0.16, 0.1, 0.05, 0, 0.2 + i * 0.19, cd / 2 + 0.01, material.screen);
              box(
                group,
                0.045,
                0.025,
                0.06,
                cw * 0.3,
                0.2 + i * 0.19,
                cd / 2 + 0.02,
                material.glow,
              );
            }
          } else if (name === "vending_machine") {
            for (let row = 0; row < 3; row += 1) {
              for (let col = 0; col < 4; col += 1) {
                box(
                  group,
                  0.12,
                  0.17,
                  0.07,
                  (col - 1.5) * 0.18,
                  0.8 + row * 0.25,
                  cd / 2 + 0.03,
                  col % 2 ? material.amber : material.fabric,
                );
              }
            }
            box(group, cw * 0.6, 0.18, 0.04, 0, 0.25, cd / 2 + 0.01, material.screen);
          } else {
            box(group, cw - 0.1, 0.3, 0.04, 0, 1.12, cd / 2 + 0.025, material.water);
            box(group, cw, 0.09, 0.22, 0, 0.8, cd / 2 - 0.07, material.amber);
            cylinder(group, 0.03, 0.03, 0.12, -0.18, 0.9, cd / 2, material.screen);
            cylinder(group, 0.05, 0.05, 0.025, 0.18, 0.87, cd / 2, material.glow);
          }
          break;
        }
        case "aquarium": {
          box(group, cw, 0.55, cd, 0, 0.275, 0, material.woodDark);
          const glass = mat("#5cc7cf", 0.12);
          glass.transparent = true;
          glass.opacity = 0.28;
          glass.depthWrite = false;
          box(group, cw, ch - 0.55, cd, 0, (ch + 0.55) / 2, 0, glass);
          box(group, cw, 0.06, cd, 0, ch - 0.03, 0, material.metal);
          box(group, cw - 0.08, 0.05, cd - 0.08, 0, 0.58, 0, material.cream);
          for (let i = 0; i < 5; i += 1) {
            const fish = cylinder(
              group,
              0.06,
              0.015,
              0.18,
              (i - 2) * 0.27,
              0.85 + (i % 2) * 0.25,
              ((i % 3) - 1) * 0.15,
              material.amber,
              8,
            );
            fish.rotation.z = Math.PI / 2;
          }
          break;
        }
        case "telescope": {
          cylinder(group, 0.05, 0.05, 1.1, 0, 0.55, 0, material.metal);
          for (let i = 0; i < 3; i += 1) {
            const angle = (i * Math.PI * 2) / 3,
              leg = cylinder(
                group,
                0.025,
                0.025,
                0.95,
                Math.cos(angle) * 0.22,
                0.42,
                Math.sin(angle) * 0.22,
                material.metal,
              );
            leg.rotation.set(Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5);
          }
          const scope = new THREE.Group();
          cylinder(scope, 0.14, 0.12, 0.9, 0, 0, 0, material.white);
          cylinder(scope, 0.12, 0.12, 0.02, 0, 0.46, 0, material.water);
          cylinder(scope, 0.05, 0.05, 0.17, 0, -0.5, 0, material.screen);
          scope.rotation.x = -Math.PI / 3;
          scope.position.y = 1.3;
          group.add(scope);
          break;
        }
        case "treadmill": {
          box(group, cw, 0.18, cd, 0, 0.09, 0, material.metal);
          box(group, cw - 0.15, 0.02, cd - 0.15, 0, 0.19, 0, material.screen);
          for (const side of [-1, 1]) {
            cylinder(
              group,
              0.035,
              0.035,
              1.1,
              side * (cw / 2 - 0.05),
              0.65,
              -cd * 0.35,
              material.metal,
            );
          }
          box(group, cw, 0.15, 0.3, 0, 1.2, -cd * 0.35, material.screen);
          box(group, 0.3, 0.02, 0.16, 0, 1.285, -cd * 0.35, material.water);
          break;
        }
        case "piano": {
          box(group, cw, ch, cd * 0.6, 0, ch / 2, -cd * 0.2, material.woodDark);
          box(group, cw, 0.1, cd, 0, 0.73, 0, material.woodDark);
          for (let i = 0; i < 24; i += 1) {
            box(group, 0.051, 0.035, 0.22, (i - 11.5) * 0.057, 0.8, cd * 0.27, material.white);
            if (![2, 6].includes(i % 7)) {
              box(group, 0.029, 0.035, 0.13, (i - 11) * 0.057, 0.83, cd * 0.2, material.screen);
            }
          }
          break;
        }
        case "sculpture": {
          box(group, cw * 0.7, 0.55, cd * 0.7, 0, 0.275, 0, material.concrete);
          const knot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.28, 0.075, 64, 8),
            material.amber,
          );
          knot.position.y = 1.18;
          knot.scale.y = 1.5;
          group.add(knot);
          break;
        }
        case "solar_panel": {
          legs(group, cw, cd, 0.32, "metal");
          const panel = new THREE.Group();
          box(panel, cw, 0.06, cd, 0, 0, 0, material.metal);
          for (let row = 0; row < 3; row += 1) {
            for (let col = 0; col < 6; col += 1) {
              box(
                panel,
                0.27,
                0.015,
                0.35,
                (col - 2.5) * 0.29,
                0.04,
                (row - 1) * 0.38,
                material.screen,
              );
            }
          }
          panel.position.y = 0.52;
          panel.rotation.x = 0.4;
          group.add(panel);
          break;
        }
        case "hydroponic_rack": {
          for (const side of [-1, 1]) {
            box(group, 0.06, ch, cd, side * (cw / 2 - 0.03), ch / 2, 0, material.metal);
          }
          for (let shelf = 0; shelf < 3; shelf += 1) {
            const y = 0.2 + shelf * 0.6;
            box(group, cw, 0.12, cd, 0, y, 0, material.white);
            box(group, cw - 0.15, 0.025, 0.08, 0, y + 0.48, 0, material.glow);
            for (let plant = 0; plant < 5; plant += 1) {
              cylinder(group, 0.12, 0.07, 0.23, (plant - 2) * 0.32, y + 0.18, 0, material.green, 6);
            }
          }
          break;
        }
        case "stairs": {
          for (let i = 0; i < 16; i += 1) {
            const height = (ch * (i + 1)) / 16;
            box(
              group,
              cw,
              height,
              cd / 16,
              0,
              height / 2,
              cd / 2 - ((i + 0.5) * cd) / 16,
              material.wood,
            );
          }
          for (const side of [-1, 1]) {
            for (let i = 0; i < 12; i += 1) {
              const z = cd / 2 - ((i + 0.5) * cd) / 12,
                y = (ch * (i + 0.5)) / 12;
              box(
                group,
                0.035,
                0.85,
                0.035,
                side * (cw / 2 - 0.045),
                y + 0.425,
                z,
                material.woodDark,
              );
            }
            const rail = box(
              group,
              0.065,
              0.065,
              Math.hypot(cd, ch),
              side * (cw / 2 - 0.045),
              ch / 2 + 0.85,
              0,
              material.woodDark,
            );
            rail.rotation.x = Math.atan2(ch, cd);
          }
          break;
        }
        case "elevator": {
          box(group, cw, 0.08, cd, 0, 0.04, 0, material.metal);
          box(group, cw, ch, 0.08, 0, ch / 2, -cd / 2, material.white);
          for (const side of [-1, 1]) {
            box(group, 0.08, ch, cd, (side * cw) / 2, ch / 2, 0, material.metal);
          }
          box(group, 0.12, 0.25, 0.04, cw * 0.35, 1.2, cd / 2, material.fabricDark);
          break;
        }
        case "sofa":
        case "armchair": {
          box(group, cw - 0.05, 0.22, cd - 0.04, 0, 0.28, 0, material.fabricDark);
          box(
            group,
            cw - 0.06,
            ch - 0.24,
            0.15,
            0,
            (ch + 0.24) / 2,
            -cd / 2 + 0.08,
            material.fabricDark,
          );
          for (const x of [-1, 1]) {
            box(group, 0.16, 0.4, cd - 0.02, x * (cw / 2 - 0.08), 0.43, 0, material.fabricDark);
          }
          const seats = name === "sofa" ? 3 : 1,
            seatWidth = (cw - 0.35) / seats;
          for (let i = 0; i < seats; i += 1) {
            const x = (i - (seats - 1) / 2) * seatWidth;
            box(group, seatWidth - 0.014, 0.15, cd - 0.2, x, 0.44, 0.07, material.fabric);
            piping(group, seatWidth - 0.04, cd - 0.23, x, 0.487, 0.07, material.fabricDark);
            const back = box(
              group,
              seatWidth - 0.016,
              ch - 0.43,
              0.15,
              x,
              (ch + 0.42) / 2,
              -cd * 0.29,
              material.fabric,
            );
            back.rotation.x = -0.1;
          }
          const cushion = box(group, 0.27, 0.27, 0.12, -cw * 0.25, 0.62, -0.08, material.cream);
          cushion.rotation.set(-0.15, 0.1, 0.18);
          legs(group, cw, cd, 0.17);
          break;
        }
        case "coffee_table":
        case "dining_table":
        case "kitchen_table":
        case "desk":
        case "side_table":
        case "console_table":
        case "bench": {
          legs(group, cw, cd, ch - 0.1, name === "desk" ? "metal" : "woodDark");
          box(group, cw, 0.11, cd, 0, ch - 0.055, 0, material.wood);
          if (name === "desk") {
            box(group, cw - 0.16, 0.1, 0.18, 0, ch - 0.17, -cd / 2 + 0.12, material.woodDark);
          }
          break;
        }
        case "chair":
        case "kitchen_chair": {
          legs(group, cw, cd, 0.44);
          box(group, cw, 0.1, cd, 0, 0.46, 0, material.wood);
          box(group, cw - 0.04, 0.045, cd - 0.07, 0, 0.52, 0.015, material.fabric);
          box(
            group,
            cw,
            0.39,
            0.1,
            0,
            0.69,
            -cd / 2 + 0.05,
            name === "kitchen_chair" ? material.wood : material.fabric,
          );
          break;
        }
        case "bar_stool": {
          legs(group, cw, cd, ch - 0.08, "metal");
          cylinder(group, 0.19, 0.19, 0.08, 0, ch - 0.04, 0, material.wood, 18);
          break;
        }
        case "outdoor_chair": {
          legs(group, cw, cd, 0.43, "metal");
          for (let i = -2; i <= 2; i += 1) {
            box(group, cw * 0.14, 0.055, cd * 0.78, i * cw * 0.16, 0.46, 0, material.wood);
          }
          for (let i = 0; i < 4; i += 1) {
            box(group, cw * 0.84, 0.06, 0.035, 0, 0.59 + i * 0.07, -cd * 0.4, material.wood);
          }
          break;
        }
        case "bistro_table": {
          cylinder(group, 0.28, 0.28, 0.045, 0, 0.025, 0, material.metal);
          cylinder(group, 0.035, 0.035, ch - 0.08, 0, ch / 2, 0, material.metal);
          cylinder(group, cw * 0.48, cw * 0.48, 0.055, 0, ch - 0.028, 0, material.wood, 24);
          break;
        }
        case "planter": {
          box(group, cw, ch * 0.62, cd, 0, ch * 0.31, 0, material.clay);
          box(group, cw * 0.91, 0.025, cd * 0.8, 0, ch * 0.63, 0, material.woodDark);
          for (let i = 0; i < 3; i += 1) {
            foliage(group, (i - 1) * cw * 0.28, ch * 0.63, 0, ch * 0.3, cd * 0.25, 7);
          }
          break;
        }
        case "bed": {
          box(group, cw, 0.22, cd, 0, 0.2, 0, material.woodDark);
          box(group, cw - 0.08, 0.23, cd - 0.11, 0, 0.39, 0, material.cream);
          box(group, cw, ch, 0.1, 0, ch / 2, -cd / 2 + 0.05, material.wood);
          box(group, cw - 0.12, 0.07, cd * 0.64, 0, 0.515, cd * 0.12, material.cream);
          box(group, cw - 0.1, 0.018, cd * 0.26, 0, 0.554, cd * 0.27, material.fabric);
          piping(group, cw - 0.14, cd - 0.17, 0, 0.44, 0, material.white);
          break;
        }
        case "tv_stand":
        case "nightstand":
        case "dresser":
        case "sideboard": {
          legs(group, cw, cd, 0.12);
          box(group, cw, ch - 0.16, cd - 0.04, 0, (ch + 0.08) / 2, -0.02, material.woodDark);
          box(group, cw, 0.04, cd, 0, ch - 0.02, 0, material.wood);
          const drawers = name === "dresser" ? 3 : 2,
            drawerHeight = (ch - 0.19) / drawers;
          for (let i = 0; i < drawers; i += 1) {
            const y = 0.14 + drawerHeight * (i + 0.5);
            box(
              group,
              cw - 0.045,
              drawerHeight - 0.014,
              0.028,
              0,
              y,
              cd / 2 - 0.014,
              material.wood,
            );
            box(
              group,
              cw * 0.23,
              0.013,
              0.025,
              0,
              y + drawerHeight * 0.2,
              cd / 2 + 0.006,
              material.metal,
            );
          }
          break;
        }
        case "wardrobe": {
          box(group, cw, ch, cd, 0, ch / 2, 0, material.wood);
          box(group, 0.018, ch * 0.88, 0.018, 0, ch / 2, cd / 2 + 0.015, material.woodDark);
          for (const x of [-0.1, 0.1]) {
            box(group, 0.018, 0.18, 0.03, x, ch * 0.52, cd / 2 + 0.04, material.metal);
          }
          break;
        }
        case "kitchen_counter":
        case "sink":
        case "stove":
        case "kitchen_island": {
          box(group, cw - 0.06, 0.1, cd - 0.07, 0, 0.05, -0.02, material.woodDark);
          box(group, cw, ch - 0.15, cd - 0.04, 0, (ch + 0.05) / 2, -0.02, material.woodDark);
          const doors = Math.max(1, Math.round(cw / 0.55)),
            doorWidth = (cw - 0.025) / doors;
          for (let i = 0; i < doors; i += 1) {
            const x = (i - (doors - 1) / 2) * doorWidth;
            box(
              group,
              doorWidth - 0.012,
              ch - 0.19,
              0.025,
              x,
              ch / 2 - 0.005,
              cd / 2 - 0.012,
              material.wood,
            );
            box(
              group,
              doorWidth * 0.45,
              0.014,
              0.024,
              x,
              ch - 0.19,
              cd / 2 + 0.005,
              material.metal,
            );
          }
          box(group, cw + 0.025, 0.06, cd + 0.025, 0, ch - 0.03, 0, material.white);
          if (name === "sink") {
            box(group, cw * 0.56, 0.015, cd * 0.55, 0, ch + 0.006, 0, material.metal);
            box(group, cw * 0.47, 0.008, cd * 0.45, 0, ch + 0.015, 0, mat("#839da1", 0.25, 0.3));
            cylinder(group, 0.012, 0.012, 0.2, cw * 0.22, ch + 0.1, -cd * 0.18, material.metal, 10);
            box(group, 0.16, 0.02, 0.02, cw * 0.18, ch + 0.2, -cd * 0.18, material.metal);
          }
          if (name === "stove") {
            box(group, cw * 0.88, ch * 0.45, 0.012, 0, ch * 0.42, cd / 2 + 0.005, material.metal);
            box(group, cw * 0.75, ch * 0.31, 0.008, 0, ch * 0.41, cd / 2 + 0.014, material.screen);
            box(group, cw * 0.7, 0.025, 0.03, 0, ch * 0.63, cd / 2 + 0.026, material.metal);
            for (const x of [-0.2, -0.07, 0.07, 0.2]) {
              const knob = cylinder(
                group,
                0.019,
                0.019,
                0.018,
                x,
                ch * 0.84,
                cd / 2 + 0.015,
                material.metal,
                16,
              );
              knob.rotation.x = Math.PI / 2;
            }
            for (const x of [-0.17, 0.17]) {
              for (const z of [-0.16, 0.16]) {
                cylinder(group, 0.07, 0.07, 0.008, x, ch + 0.007, z, material.screen, 20);
              }
            }
          }
          break;
        }
        case "bathtub": {
          box(group, cw, 0.08, cd, 0, 0.04, 0, material.white);
          for (const x of [-1, 1]) {
            box(
              group,
              0.075,
              ch - 0.08,
              cd,
              x * (cw / 2 - 0.037),
              ch / 2 + 0.04,
              0,
              material.white,
            );
          }
          for (const z of [-1, 1]) {
            box(
              group,
              cw,
              ch - 0.08,
              0.075,
              0,
              ch / 2 + 0.04,
              z * (cd / 2 - 0.037),
              material.white,
            );
          }
          box(group, cw - 0.17, 0.018, cd - 0.17, 0, 0.17, 0, mat("#afcbd0", 0.25));
          break;
        }
        case "toilet": {
          cylinder(group, 0.18, 0.17, 0.4, 0, 0.2, 0.1, material.white, 20);
          box(group, 0.39, 0.37, 0.16, 0, 0.53, -cd / 2 + 0.1, material.white);
          cylinder(group, 0.19, 0.19, 0.05, 0, 0.42, 0.1, material.white, 20);
          break;
        }
        case "vanity": {
          box(group, cw, ch - 0.04, cd, 0, (ch - 0.04) / 2, 0, material.wood);
          box(group, cw + 0.02, 0.05, cd + 0.02, 0, ch - 0.025, 0, material.white);
          cylinder(group, 0.16, 0.16, 0.012, 0, ch + 0.006, 0, material.metal, 24);
          cylinder(group, 0.013, 0.013, 0.13, 0, ch + 0.075, -cd * 0.28, material.metal, 10);
          break;
        }
        case "shower": {
          box(group, cw, 0.08, cd, 0, 0.04, 0, material.white);
          for (const x of [-1, 1]) {
            for (const z of [-1, 1]) {
              box(
                group,
                0.025,
                ch - 0.08,
                0.025,
                x * (cw / 2 - 0.04),
                ch / 2 + 0.04,
                z * (cd / 2 - 0.04),
                material.metal,
              );
            }
          }
          const glass = mat("#c5dadd", 0.2);
          glass.transparent = true;
          glass.opacity = 0.32;
          glass.depthWrite = false;
          box(group, cw - 0.06, ch - 0.18, 0.018, 0, ch / 2, cd / 2 - 0.03, glass).castShadow =
            false;
          cylinder(
            group,
            0.02,
            0.02,
            ch * 0.72,
            -cw * 0.31,
            ch * 0.42,
            -cd * 0.28,
            material.metal,
            10,
          );
          cylinder(group, 0.11, 0.11, 0.025, -cw * 0.31, ch * 0.79, -cd * 0.28, material.metal, 16);
          break;
        }
        case "ottoman": {
          box(group, cw, 0.28, cd, 0, 0.25, 0, material.fabric);
          legs(group, cw, cd, 0.13);
          break;
        }
        case "fridge": {
          box(group, cw, ch, cd, 0, ch / 2, 0, material.white);
          box(group, cw * 0.9, 0.025, 0.012, 0, ch * 0.58, cd / 2 + 0.012, material.metal);
          box(group, 0.035, 0.22, 0.035, cw * 0.34, ch * 0.37, cd / 2 + 0.035, material.metal);
          box(group, 0.035, 0.22, 0.035, cw * 0.34, ch * 0.73, cd / 2 + 0.035, material.metal);
          break;
        }
        case "tv": {
          box(group, cw, ch * 0.8, 0.055, 0, ch * 0.58, 0, material.screen);
          box(group, cw * 0.91, ch * 0.68, 0.009, 0, ch * 0.58, 0.033, mat("#263e48", 0.15));
          box(group, 0.04, 0.15, 0.05, 0, 0.13, 0, material.metal);
          box(group, 0.27, 0.025, 0.16, 0, 0.025, 0, material.metal);
          break;
        }
        case "air_conditioner": {
          box(group, cw, ch * 0.85, cd, 0, ch * 0.55, 0, material.white);
          box(group, cw * 0.91, 0.045, cd * 0.82, 0, ch * 0.94, 0.005, mat("#d9e1df"));
          box(group, cw * 0.84, 0.038, 0.012, 0, ch * 0.22, cd / 2 + 0.008, material.metal);
          box(group, cw * 0.72, 0.015, 0.014, 0, ch * 0.13, cd / 2 + 0.013, material.screen);
          box(group, 0.065, 0.025, 0.012, cw * 0.38, ch * 0.54, cd / 2 + 0.012, mat("#8aadae"));
          break;
        }
        case "wall_lamp": {
          box(group, 0.08, 0.17, 0.16, 0, 0.13, -cd * 0.18, material.metal);
          cylinder(group, 0.095, 0.16, 0.18, 0, ch * 0.61, cd * 0.2, material.cream, 16);
          const glow = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 12, 8),
            new THREE.MeshStandardMaterial({
              color: "#ffe5b5",
              emissive: "#ffb14e",
              emissiveIntensity: 1.3,
            }),
          );
          glow.position.set(0, ch * 0.55, cd * 0.26);
          group.add(glow);
          fixtureLight(group, 5, 0, ch * 0.55, cd * 0.48);
          break;
        }
        case "bookshelf": {
          box(group, cw, ch, 0.025, 0, ch / 2, -cd / 2 + 0.0125, material.woodDark);
          for (const side of [-1, 1]) {
            box(group, 0.045, ch, cd, side * (cw / 2 - 0.0225), ch / 2, 0, material.wood);
          }
          for (let shelf = 0; shelf < 5; shelf += 1) {
            const y = 0.06 + (shelf * (ch - 0.1)) / 4;
            box(group, cw - 0.06, 0.035, cd, 0, y, 0, material.wood);
            if (shelf === 4) {
              continue;
            }
            for (let i = 0; i < 7 - (shelf % 2); i += 1) {
              const height = 0.19 + ((i * 7 + shelf * 3) % 5) * 0.022,
                x = -cw * 0.37 + i * 0.087,
                cover = [material.clay, material.fabricDark, material.cream, material.woodDark][
                  (i + shelf) % 4
                ];
              box(group, 0.065, height, cd * 0.65, x, y + 0.02 + height / 2, 0.02, cover);
              for (const band of [0.04, height - 0.035]) {
                box(
                  group,
                  0.053,
                  0.006,
                  0.003,
                  x,
                  y + 0.02 + band,
                  cd * 0.325 + 0.022,
                  material.cream,
                );
              }
            }
          }
          break;
        }
        case "lamp": {
          fixtureLight(group, 8, 0, ch - 0.32, 0);
          cylinder(group, 0.16, 0.19, 0.055, 0, 0.025, 0, material.metal);
          cylinder(group, 0.025, 0.025, ch * 0.69, 0, ch * 0.36, 0, material.metal);
          const shade = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.195, 0.31, 48, 1, true),
            material.cream.clone(),
          );
          shade.material.side = THREE.DoubleSide;
          shade.material.emissive.set("#ffe0ae");
          shade.material.emissiveIntensity = 0.16;
          shade.position.y = ch - 0.155;
          shade.castShadow = true;
          group.add(shade);
          for (const [radius, y] of [
            [0.12, ch - 0.004],
            [0.195, ch - 0.306],
          ]) {
            const rim = new THREE.Mesh(
              new THREE.TorusGeometry(radius, 0.004, 6, 48),
              material.cream,
            );
            rim.rotation.x = Math.PI / 2;
            rim.position.y = y;
            group.add(rim);
          }
          break;
        }
        case "plant": {
          cylinder(group, 0.18, 0.14, 0.31, 0, 0.155, 0, material.clay);
          cylinder(group, 0.167, 0.167, 0.012, 0, 0.305, 0, material.woodDark);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.174, 0.012, 8, 40), material.clay);
          rim.rotation.x = Math.PI / 2;
          rim.position.y = 0.305;
          group.add(rim);
          foliage(group, 0, 0.31, 0, ch - 0.34, 0.16, 15);
          break;
        }
        case "rug": {
          box(group, cw, 0.018, cd, 0, 0.011, 0, material.rug);
          for (const inset of [0.045, 0.085, 0.16]) {
            piping(group, cw - inset * 2, cd - inset * 2, 0, 0.022, 0, material.cream);
          }
          break;
        }
        case "monitor": {
          box(group, cw, ch * 0.77, 0.035, 0, ch * 0.61, 0, material.screen);
          box(group, 0.025, 0.1, 0.03, 0, 0.11, 0, material.metal);
          box(group, 0.17, 0.018, 0.11, 0, 0.02, 0, material.metal);
          break;
        }
        case "book": {
          box(group, cw * 0.94, ch - 0.01, cd * 0.94, 0, ch / 2, 0, material.cream);
          for (const y of [0.003, ch - 0.003]) {
            box(group, cw, 0.006, cd, 0, y, 0, material.clay);
          }
          box(group, 0.008, ch, cd, -cw / 2 + 0.004, ch / 2, 0, material.clay);
          break;
        }
        case "mug": {
          const profile = [
              [0, 0],
              [0.033, 0],
              [0.04, 0.006],
              [0.044, ch - 0.009],
              [0.042, ch],
              [0.036, ch],
              [0.034, 0.017],
              [0, 0.017],
            ],
            cup = new THREE.Mesh(
              new THREE.LatheGeometry(
                profile.map(([r, y]) => new THREE.Vector2(r, y)),
                32,
              ),
              material.white,
            );
          cup.castShadow = true;
          group.add(cup);
          cylinder(group, 0.035, 0.035, 0.002, 0, ch * 0.78, 0, material.woodDark);
          const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.027, 0.008, 8, 24),
            material.white,
          );
          handle.position.set(0.045, ch * 0.57, 0);
          group.add(handle);
          break;
        }
        case "coat_rack": {
          cylinder(group, 0.27, 0.29, 0.05, 0, 0.025, 0, material.metal);
          cylinder(group, 0.024, 0.03, ch - 0.05, 0, (ch + 0.05) / 2, 0, material.wood);
          for (let i = 0; i < 4; i += 1) {
            const angle = (i * Math.PI) / 2,
              x = Math.cos(angle) * 0.12,
              z = Math.sin(angle) * 0.12,
              hook = box(group, 0.25, 0.035, 0.035, x, 1.5 + (i % 2) * 0.13, z, material.wood);
            hook.rotation.y = -angle;
            cylinder(
              group,
              0.018,
              0.018,
              0.09,
              x * 2,
              hook.position.y + 0.035,
              z * 2,
              material.wood,
            );
          }
          break;
        }
        case "shoe_rack": {
          for (const y of [0.08, 0.28, 0.46]) {
            box(group, cw, 0.04, cd, 0, y, 0, material.wood);
          }
          for (const x of [-cw / 2 + 0.025, cw / 2 - 0.025]) {
            box(group, 0.05, ch, cd, x, ch / 2, 0, material.woodDark);
          }
          for (const x of [-0.26, -0.12, 0.12, 0.26]) {
            box(group, 0.1, 0.09, 0.23, x, 0.145, 0.015, material.fabricDark);
          }
          break;
        }
        case "filing_cabinet": {
          box(group, cw, ch, cd - 0.04, 0, ch / 2, -0.02, material.metal);
          for (const y of [0.19, 0.5]) {
            box(group, cw - 0.04, 0.28, 0.02, 0, y, cd / 2 - 0.03, material.white);
            box(group, 0.15, 0.025, 0.025, 0, y + 0.065, cd / 2 - 0.0125, material.metal);
          }
          break;
        }
        case "washing_machine": {
          box(group, cw, ch, cd - 0.04, 0, ch / 2, -0.02, material.white);
          box(group, cw - 0.04, 0.11, 0.025, 0, 0.755, 0.292, material.metal);
          box(group, 0.18, 0.05, 0.01, -0.13, 0.755, 0.308, material.screen);
          const rim = cylinder(group, 0.22, 0.22, 0.035, 0, 0.37, 0.302, material.metal),
            glass = cylinder(group, 0.175, 0.175, 0.012, 0, 0.37, 0.314, material.screen),
            dial = cylinder(group, 0.032, 0.032, 0.02, 0.18, 0.755, 0.31, material.white);
          for (const part of [rim, glass, dial]) {
            part.rotation.x = Math.PI / 2;
          }
          break;
        }
        case "laundry_basket": {
          box(group, cw, 0.035, cd, 0, 0.0175, 0, material.wood);
          for (const side of [-1, 1]) {
            for (let i = 0; i < 7; i += 1) {
              box(
                group,
                0.035,
                ch,
                0.025,
                (i - 3) * 0.06,
                ch / 2,
                side * (cd / 2 - 0.0125),
                material.wood,
              );
              box(
                group,
                0.025,
                ch,
                0.03,
                side * (cw / 2 - 0.0125),
                ch / 2,
                (i - 3) * 0.055,
                material.wood,
              );
            }
            box(group, cw, 0.045, 0.03, 0, ch - 0.0225, side * (cd / 2 - 0.015), material.woodDark);
            box(group, 0.03, 0.045, cd, side * (cw / 2 - 0.015), ch - 0.0225, 0, material.woodDark);
          }
          box(group, cw - 0.07, 0.12, cd - 0.07, 0, 0.43, 0, material.cream);
          break;
        }
        case "towel_rack": {
          for (const side of [-1, 1]) {
            box(group, 0.045, 0.04, cd, side * (cw / 2 - 0.03), 0.02, 0, material.metal);
            cylinder(group, 0.018, 0.018, ch, side * (cw / 2 - 0.03), ch / 2, 0, material.metal);
          }
          box(group, cw, 0.035, 0.035, 0, ch - 0.0175, 0, material.metal);
          box(group, 0.4, 0.47, 0.065, 0, ch - 0.235, 0, material.cream);
          box(group, 0.4, 0.025, 0.07, 0, ch - 0.43, 0, material.fabric);
          break;
        }
        case "table_lamp": {
          fixtureLight(group, 3, 0, ch - 0.18, 0);
          cylinder(group, 0.095, 0.1, 0.03, 0, 0.015, 0, material.metal);
          cylinder(group, 0.015, 0.015, 0.23, 0, 0.14, 0, material.wood);
          cylinder(group, 0.08, 0.14, 0.17, 0, ch - 0.085, 0, material.cream);
          break;
        }
        case "coffee_maker": {
          box(group, cw, 0.035, cd, 0, 0.0175, 0, material.metal);
          box(group, cw, ch - 0.035, 0.11, 0, (ch + 0.035) / 2, -0.095, material.screen);
          box(group, cw, 0.08, cd, 0, ch - 0.04, 0, material.metal);
          cylinder(group, 0.045, 0.035, 0.075, 0, 0.075, 0.055, material.white);
          box(group, 0.06, 0.025, 0.06, 0, 0.255, 0.04, material.metal);
          break;
        }
        case "pillow": {
          box(group, cw, ch, cd, 0, ch / 2, 0, material.cream);
          piping(group, cw - 0.02, cd - 0.02, 0, ch / 2, 0, material.white);
          break;
        }
        default: {
          break;
        }
      }
      addReferenceAsset(name, group);
      addDecoration(group, name, box);
      if (!lightAssets.includes(name)) {
        batchFurniture(group);
      }
      group.scale.set(w / cw, h / ch, d / cd);
    }
    group.userData.token = token;
    selectableGroups.push(group);
    return group;
  }
  function addArchitecture(program) {
    const outsideFinish = facadeMaterial(program.facade),
      trim = mat("#886f60"),
      wallHeight = 2.75,
      largeScene =
        program.rooms.reduce((area, room) => area + room.cols * room.rows * program.grid ** 2, 0) >
        1200;
    wallRoots = [];
    ceilingRoots = [];
    material.ceiling.transparent = true;
    material.ceiling.opacity = ceilingsCollapsed ? 0 : 1;
    material.ceiling.depthWrite = !ceilingsCollapsed;
    for (const room of program.rooms) {
      const roomRoot = new THREE.Group();
      roomRoot.position.y = room.elevation;
      roomRoot.userData.floor = room.floor;
      roomRoot.userData.token = {
        dimensions: [room.cols * program.grid, room.rows * program.grid, 3],
        floor: room.floor,
        line: room.line,
        name: room.kind,
        room: room.name,
        yaw: 0,
      };
      selectableGroups.push(roomRoot);
      sceneRoot.add(roomRoot);
      wallRoot = new THREE.Group();
      wallRoot.userData.fullHeight = true;
      wallRoot.scale.y = wallsCollapsed ? 0.045 : 1;
      wallRoots.push(wallRoot);
      roomRoot.add(wallRoot);
      const width = room.cols * program.grid,
        depth = room.rows * program.grid,
        centerX = (room.x + room.cols / 2 - program.cols / 2) * program.grid,
        centerZ = (room.z + room.rows / 2 - program.rows / 2) * program.grid;
      room.centerX = centerX;
      room.centerZ = centerZ;
      room.daylightOpenings = [];
      for (const dir of ["north", "east", "south", "west"]) {
        if (!room.walls.includes(dir)) {
          const vertical = dir === "east" || dir === "west",
            span = vertical ? depth : width;
          room.daylightOpenings.push({
            area: span * wallHeight,
            dir,
            shared: program.rooms.some((other) => sharedWall(room, other, dir)),
            span,
            x: centerX + (dir === "east" ? width / 2 : dir === "west" ? -width / 2 : 0),
            z: centerZ + (dir === "south" ? depth / 2 : dir === "north" ? -depth / 2 : 0),
          });
        }
      }
      const floorMaterial =
          room.style === "mediterranean"
            ? room.kind === "balcony"
              ? material.terracotta
              : material.stone
            : room.style === "liminal"
              ? material.yellow
              : room.style === "industrial"
                ? material.concrete
                : room.style === "aquatic"
                  ? material.white
                  : room.kind === "balcony"
                    ? mat("#b9aa95")
                    : /(bath|wash)/u.test(room.name)
                      ? mat("#d6e0db")
                      : /(kitchen)/u.test(room.name)
                        ? mat("#ccc7b9")
                        : material.floor,
        openings = program.connectors
          .filter((link) => link.upper === room)
          .map((link) => ({
            x1: (link.x - link.halfX - program.cols / 2) * program.grid,
            x2: (link.x + link.halfX - program.cols / 2) * program.grid,
            z1: (link.z - link.halfZ - program.rows / 2) * program.grid,
            z2: (link.z + link.halfZ - program.rows / 2) * program.grid,
          })),
        floorPart = (w, h, d, x, y, z, finish, parent = roomRoot, holes = openings) => {
          let parts = [{ x1: x - w / 2, x2: x + w / 2, z1: z - d / 2, z2: z + d / 2 }];
          for (const hole of holes) {
            parts = parts.flatMap((part) => {
              const x1 = Math.max(part.x1, hole.x1),
                x2 = Math.min(part.x2, hole.x2),
                z1 = Math.max(part.z1, hole.z1),
                z2 = Math.min(part.z2, hole.z2);
              if (x1 >= x2 || z1 >= z2) {
                return [part];
              }
              return [
                { x1: part.x1, x2: x1, z1: part.z1, z2: part.z2 },
                { x1: x2, x2: part.x2, z1: part.z1, z2: part.z2 },
                { x1, x2, z1: part.z1, z2: z1 },
                { x1, x2, z1: z2, z2: part.z2 },
              ].filter((piece) => piece.x2 > piece.x1 && piece.z2 > piece.z1);
            });
          }
          for (const part of parts) {
            box(
              parent,
              part.x2 - part.x1,
              h,
              part.z2 - part.z1,
              (part.x1 + part.x2) / 2,
              y,
              (part.z1 + part.z2) / 2,
              finish,
            );
          }
        };
      floorPart(width + 0.02, 0.17, depth + 0.02, centerX, -0.105, centerZ, floorMaterial);
      if (room.kind !== "balcony") {
        const ceiling = new THREE.Group(),
          ceilingOpenings = program.connectors
            .filter((link) => link.room === room)
            .map((link) => ({
              x1: (link.x - link.halfX - program.cols / 2) * program.grid,
              x2: (link.x + link.halfX - program.cols / 2) * program.grid,
              z1: (link.z - link.halfZ - program.rows / 2) * program.grid,
              z2: (link.z + link.halfZ - program.rows / 2) * program.grid,
            }));
        ceiling.visible = !ceilingsCollapsed;
        roomRoot.add(ceiling);
        ceilingRoots.push(ceiling);
        floorPart(
          width,
          0.06,
          depth,
          centerX,
          wallHeight + 0.03,
          centerZ,
          material.ceiling,
          ceiling,
          ceilingOpenings,
        );
      }
      if (
        !largeScene &&
        !["liminal", "industrial", "aquatic", "mediterranean"].includes(room.style) &&
        room.kind !== "balcony" &&
        !/(bath|wash|kitchen)/u.test(room.name)
      ) {
        let plank = 0;
        for (let z = -depth / 2 + 0.018; z < depth / 2 - 0.018; z += 0.24) {
          const boardDepth = Math.min(0.234, depth / 2 - 0.018 - z);
          for (let x = -width / 2 - (plank % 3) * 0.48; x < width / 2 - 0.018; x += 1.44) {
            const start = Math.max(x, -width / 2 + 0.018),
              end = Math.min(x + 1.434, width / 2 - 0.018);
            if (end <= start) {
              continue;
            }
            floorPart(
              end - start,
              0.012,
              boardDepth,
              centerX + (start + end) / 2,
              -0.012,
              centerZ + z + boardDepth / 2,
              woodPlanks[(plank + Math.floor((x + width) / 1.44)) % woodPlanks.length],
            );
          }
          plank += 1;
        }
      }
      const wallMaterial =
        room.style === "mediterranean"
          ? material.plaster
          : room.style === "liminal"
            ? material.yellow
            : room.style === "industrial"
              ? material.concrete
              : room.style === "aquatic"
                ? mat("#a8d8d7")
                : room.style === "blue"
                  ? mat("#4e9bc0")
                  : room.style === "neutral"
                    ? mat("#d9dedb")
                    : material.wall;
      if (room.kind === "balcony") {
        const seam = mat("#8e8579");
        for (let z = -depth / 2 + 0.36; z < depth / 2; z += 0.36) {
          floorPart(width - 0.04, 0.006, 0.012, centerX, 0.004, centerZ + z, seam);
        }
        const railMaterial = mat("#718881", 0.55, 0.25);
        for (const dir of room.rails) {
          const vertical = dir === "east" || dir === "west",
            length = vertical ? depth : width,
            fixed = vertical
              ? centerX + (dir === "east" ? width / 2 : -width / 2)
              : centerZ + (dir === "south" ? depth / 2 : -depth / 2),
            middle = vertical ? centerZ : centerX,
            x = vertical ? fixed : middle,
            z = vertical ? middle : fixed;
          if (room.style === "mediterranean") {
            box(
              wallRoot,
              vertical ? 0.16 : length,
              0.95,
              vertical ? length : 0.16,
              x,
              0.475,
              z,
              material.plaster,
            );
            box(
              wallRoot,
              vertical ? 0.2 : length,
              0.045,
              vertical ? length : 0.2,
              x,
              0.97,
              z,
              material.stone,
            );
            continue;
          }
          box(
            wallRoot,
            vertical ? 0.045 : length,
            0.045,
            vertical ? length : 0.045,
            x,
            1.04,
            z,
            railMaterial,
          );
          box(
            wallRoot,
            vertical ? 0.025 : length,
            0.025,
            vertical ? length : 0.025,
            x,
            0.53,
            z,
            railMaterial,
          );
          const postCount = Math.max(2, Math.ceil(length / 1.1) + 1);
          for (let i = 0; i < postCount; i += 1) {
            const along = middle - length / 2 + (i * length) / (postCount - 1);
            box(
              wallRoot,
              0.04,
              1.06,
              0.04,
              vertical ? fixed : along,
              0.53,
              vertical ? along : fixed,
              railMaterial,
            );
          }
        }
      }
      for (const dir of room.walls) {
        const vertical = dir === "east" || dir === "west",
          length = vertical ? depth : width,
          fixed = vertical
            ? centerX + (dir === "east" ? width / 2 : -width / 2)
            : centerZ + (dir === "south" ? depth / 2 : -depth / 2),
          middle = vertical ? centerZ : centerX,
          thickness = wallThickness(program, room, dir),
          hasDoor = room.doors.includes(dir),
          sharedEdge = program.rooms.some((other) => sharedWall(room, other, dir)),
          hasWindow =
            room.windows === undefined
              ? !hasDoor && !sharedEdge && length > 2.2
              : room.windows.includes(dir),
          opening = new THREE.Group(),
          wallParent = wallRoot,
          addWallPart = (offset, spanLength, height = wallHeight, y = wallHeight / 2) => {
            const spanCenter = middle + offset,
              wall = box(
                wallParent,
                vertical ? thickness : spanLength,
                height,
                vertical ? spanLength : thickness,
                vertical ? fixed : spanCenter,
                y,
                vertical ? spanCenter : fixed,
                wallMaterial,
              );
            wall.castShadow = true;
            if (!sharedEdge) {
              applyFacade(wall, dir, outsideFinish);
            }
          };
        if (hasDoor || hasWindow) {
          wallRoot.add(opening);
          const line = (hasDoor ? room.doorsLine : room.windowsLine) || room.wallsLine || room.line,
            source = editor.state.doc.toString().split("\n")[line - 1],
            start = source.toLowerCase().indexOf(dir);
          opening.userData.token = {
            dimensions: [
              hasDoor ? Math.min(1.15, length * 0.4) : Math.min(2.1, length * 0.48),
              thickness + 0.04,
              hasDoor ? 2.29 : 1.05,
            ],
            end: start === -1 ? source.length : start + dir.length,
            floor: room.floor,
            line,
            name: hasDoor ? "door" : "window",
            room: room.name,
            start: Math.max(0, start),
            yaw: vertical ? 90 : 0,
          };
          selectableGroups.push(opening);
        }
        if (hasDoor) {
          const gap = Math.min(1.15, length * 0.4),
            segmentLength = (length - gap) / 2;
          room.daylightOpenings.push({
            area: gap * 2.29,
            dir,
            shared: sharedEdge,
            span: gap,
            x: vertical ? fixed : middle,
            z: vertical ? middle : fixed,
          });
          for (const offset of [-(gap + segmentLength) / 2, (gap + segmentLength) / 2]) {
            addWallPart(offset, segmentLength);
            box(
              wallRoot,
              vertical ? thickness + 0.02 : segmentLength,
              0.085,
              vertical ? segmentLength : thickness + 0.02,
              vertical ? fixed : middle + offset,
              0.09,
              vertical ? middle + offset : fixed,
              trim,
            );
          }
          addWallPart(0, gap, 0.46, wallHeight - 0.23);
          const pickMaterial = new THREE.MeshBasicMaterial({
            depthWrite: false,
            opacity: 0,
            side: THREE.DoubleSide,
            transparent: true,
          });
          box(
            opening,
            vertical ? 0.02 : gap,
            2.29,
            vertical ? gap : 0.02,
            vertical ? fixed : middle,
            1.145,
            vertical ? middle : fixed,
            pickMaterial,
          ).castShadow = false;
          for (const offset of [-gap / 2, gap / 2]) {
            box(
              opening,
              vertical ? thickness + 0.02 : 0.055,
              2.28,
              vertical ? 0.055 : thickness + 0.02,
              vertical ? fixed : middle + offset,
              1.14,
              vertical ? middle + offset : fixed,
              room.style === "mediterranean" ? material.wood : material.white,
            );
          }
          const leafLength = gap - 0.1,
            outward = { east: 1, north: -1, south: 1, west: -1 }[dir],
            glazed =
              room.style === "mediterranean" &&
              (!sharedEdge ||
                program.rooms.some(
                  (other) => other.kind === "balcony" && sharedWall(room, other, dir),
                ));
          if (glazed) {
            const leaf = new THREE.Group();
            leaf.position.set(
              vertical ? fixed + (outward * leafLength) / 2 : middle - gap / 2 + 0.055,
              0,
              vertical ? middle - gap / 2 + 0.055 : fixed + (outward * leafLength) / 2,
            );
            leaf.rotation.y = vertical ? 0 : Math.PI / 2;
            leaf.userData.openDoorLeaf = true;
            opening.add(leaf);
            const glass = mat("#cedcda", 0.15);
            glass.transparent = true;
            glass.opacity = 0.22;
            glass.depthWrite = false;
            glass.userData.windowPane = true;
            for (const x of [-leafLength / 2 + 0.03, leafLength / 2 - 0.03]) {
              box(leaf, 0.06, 2.12, 0.06, x, 1.06, 0, material.wood);
            }
            for (const y of [0.045, 0.68, 2.085]) {
              box(leaf, leafLength, 0.07, 0.06, 0, y, 0, material.wood);
            }
            for (const [y, height] of [
              [0.36, 0.56],
              [1.38, 1.32],
            ]) {
              box(leaf, leafLength - 0.12, height, 0.018, 0, y, 0, glass).castShadow = false;
            }
            box(leaf, 0.025, 0.12, 0.035, leafLength / 2 - 0.05, 1.05, 0.045, material.metal);
          } else {
            const leaf = box(
              opening,
              vertical ? leafLength : 0.055,
              2.12,
              vertical ? 0.055 : leafLength,
              vertical ? fixed + (outward * leafLength) / 2 : middle - gap / 2 + 0.055,
              1.06,
              vertical ? middle - gap / 2 + 0.055 : fixed + (outward * leafLength) / 2,
              material.wood,
            );
            leaf.userData.openDoorLeaf = true;
          }
        } else if (hasWindow) {
          const span = Math.min(2.1, length * 0.48),
            offset = THREE.MathUtils.clamp(
              (dir === "north" ? 0.16 : -0.13) * length,
              -length / 2 + span / 2 + 0.15,
              length / 2 - span / 2 - 0.15,
            ),
            leftLength = length / 2 + offset - span / 2,
            rightLength = length / 2 - offset - span / 2;
          addWallPart(-length / 2 + leftLength / 2, leftLength);
          addWallPart(length / 2 - rightLength / 2, rightLength);
          addWallPart(offset, span, 1.14, 0.57);
          addWallPart(offset, span, wallHeight - 2.2, (wallHeight + 2.2) / 2);
          box(
            wallRoot,
            vertical ? thickness + 0.02 : length,
            0.085,
            vertical ? length : thickness + 0.02,
            vertical ? fixed : middle,
            0.09,
            vertical ? middle : fixed,
            trim,
          );
          const center = middle + offset,
            windowY = 1.67,
            glass = mat("#b7d6d8", 0.12);
          glass.userData.windowPane = true;
          room.daylightOpenings.push({
            area: span * 1.05,
            dir,
            shared: sharedEdge,
            span,
            x: vertical ? fixed : center,
            z: vertical ? center : fixed,
          });
          glass.transparent = true;
          glass.opacity = 0.34;
          glass.depthWrite = false;
          glass.side = THREE.DoubleSide;
          if (vertical) {
            box(opening, 0.025, 0.98, span - 0.09, fixed, windowY, center, glass).castShadow =
              false;
            for (const y of [1.15, 2.2]) {
              box(
                opening,
                thickness + 0.04,
                0.055,
                span,
                fixed,
                y,
                center,
                room.style === "mediterranean" ? material.wood : material.white,
              );
            }
            for (const z of [center - span / 2, center, center + span / 2]) {
              box(
                opening,
                thickness + 0.04,
                1.05,
                0.055,
                fixed,
                windowY,
                z,
                room.style === "mediterranean" ? material.wood : material.white,
              );
            }
          } else {
            box(opening, span - 0.09, 0.98, 0.025, center, windowY, fixed, glass).castShadow =
              false;
            for (const y of [1.15, 2.2]) {
              box(
                opening,
                span,
                0.055,
                thickness + 0.04,
                center,
                y,
                fixed,
                room.style === "mediterranean" ? material.wood : material.white,
              );
            }
            for (const x of [center - span / 2, center, center + span / 2]) {
              box(
                opening,
                0.055,
                1.05,
                thickness + 0.04,
                x,
                windowY,
                fixed,
                room.style === "mediterranean" ? material.wood : material.white,
              );
            }
          }
        } else {
          addWallPart(0, length);
          box(
            wallRoot,
            vertical ? thickness + 0.02 : length,
            0.085,
            vertical ? length : thickness + 0.02,
            vertical ? fixed : middle,
            0.09,
            vertical ? middle : fixed,
            trim,
          );
        }
      }
      for (const mount of room.mounts) {
        const token = {
            dimensions: catalog[mount.name],
            floor: room.floor,
            line: mount.line,
            name: mount.name,
            room: room.name,
            url: mount.url,
            yaw: 0,
          },
          fixture = makeFurniture(token, false),
          horizontal = mount.side === "north" || mount.side === "south",
          along = (mount.cell - ((horizontal ? room.cols : room.rows) - 1) / 2) * program.grid,
          inset = wallThickness(program, room, mount.side) / 2 + catalog[mount.name][1] / 2 + 0.01;
        fixture.position.set(
          horizontal
            ? centerX + along
            : centerX + (mount.side === "east" ? width / 2 - inset : -width / 2 + inset),
          wallDecor.includes(mount.name)
            ? 1.65 - catalog[mount.name][2] / 2
            : mount.name === "air_conditioner"
              ? 2.13
              : 1.85,
          horizontal
            ? centerZ + (mount.side === "south" ? depth / 2 - inset : -depth / 2 + inset)
            : centerZ + along,
        );
        fixture.rotation.y = THREE.MathUtils.degToRad(
          { east: -90, north: 0, south: 180, west: 90 }[mount.side],
        );
        wallRoot.add(fixture);
      }
    }
    const fullWidth = program.cols * program.grid,
      fullDepth = program.rows * program.grid;
    gridHelper = new THREE.GridHelper(
      Math.max(fullWidth, fullDepth) + 0.2,
      Math.max(program.cols, program.rows),
      "#718f8d",
      "#718f8d",
    );
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.21;
    gridHelper.position.y = 0.002;
    gridHelper.visible = gridVisible;
    sceneRoot.add(gridHelper);
  }
  function placeLayout(program, name, room, parent, depth = 0, stack = []) {
    if (depth > 5 || stack.includes(name)) {
      fail("Sub-layouts must not form a cycle", 1);
    }
    const rows = program.layouts[name],
      isRoot = !parent,
      rowCount = rows.length,
      colCount = Math.max(...rows.map((row) => row.length)),
      entries = [];
    rows.forEach((row, r) =>
      row.forEach((token, c) => {
        if (!token) {
          return;
        }
        token.room = room.name;
        token.floor = room.floor;
        let holder, x, z;
        if (isRoot) {
          ({ x, z } = floorPosition(program, room, token, c, r));
          holder = sceneRoot;
        } else {
          const [pw, pd] = parent.token.dimensions;
          x = (c - (colCount - 1) / 2) * (pw / Math.max(colCount, 1)) * 0.67;
          z = (r - (rowCount - 1) / 2) * (pd / Math.max(rowCount, 1)) * 0.67;
          holder = parent.group;
        }
        const group = makeFurniture(token, false);
        group.userData.floor = room.floor;
        group.position.set(x, isRoot ? room.elevation : parent.token.dimensions[2], z);
        group.rotation.y = THREE.MathUtils.degToRad(token.yaw);
        holder.add(group);
        entries.push({ group, token, x, z });
        if (token.child) {
          placeLayout(program, token.child, room, { group, token }, depth + 1, [...stack, name]);
        }
      }),
    );
    return entries;
  }
  function findCollisions(entries) {
    const warnings = [],
      broad = (e) => {
        const [w, d] = e.token.dimensions,
          a = THREE.MathUtils.degToRad(e.token.yaw);
        return {
          d: Math.abs(w * Math.sin(a)) + Math.abs(d * Math.cos(a)),
          w: Math.abs(w * Math.cos(a)) + Math.abs(d * Math.sin(a)),
          x: e.x,
          z: e.z,
        };
      };
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const a = entries[i],
          b = entries[j];
        if (
          a.token.floor !== b.token.floor ||
          ["rug", "awning", ...overheadLights].includes(a.token.name) ||
          ["rug", "awning", ...overheadLights].includes(b.token.name)
        ) {
          continue;
        }
        const A = broad(a),
          B = broad(b);
        if (
          Math.abs(A.x - B.x) < (A.w + B.w) / 2 - 0.08 &&
          Math.abs(A.z - B.z) < (A.d + B.d) / 2 - 0.08
        ) {
          warnings.push(`${a.token.name} overlaps ${b.token.name}`);
        }
      }
    }
    return warnings;
  }
  function resetCamera(top = false) {
    if (!currentProgram) {
      return;
    }
    if (firstPerson) {
      setFirstPerson(false);
    }
    const room = currentProgram.rooms.find((item) => item.name === focusRoom),
      extent = Math.max(
        Math.max(room?.cols || currentProgram.cols, room?.rows || currentProgram.rows) *
          currentProgram.grid +
          (room || currentProgram.site === "none" ? 0 : Math.min(currentProgram.margin, 5)),
        focusFloor === undefined && !room ? (currentProgram.floors.at(-1) + 1) * 3 : 3,
      ),
      framing = Math.max(1, 1.1 / camera.aspect),
      cx = room?.centerX || 0,
      cz = room?.centerZ || 0,
      elevation =
        room?.elevation ??
        (focusFloor === undefined ? currentProgram.floors.at(-1) * 1.5 : focusFloor * 3);
    controls.target.set(cx, elevation + 0.3, cz);
    camera.position.set(
      cx + (top ? 0 : extent * 0.18 * framing),
      elevation + (top ? extent * 1.65 : extent * 0.95) * framing,
      cz + (top ? 0.001 : extent * 1.4 * framing),
    );
    camera.lookAt(controls.target);
    controls.update();
    $("topButton").classList.toggle("active", top);
    $("topButton").setAttribute("aria-pressed", String(top));
    $("resetButton").classList.toggle("active", !top);
    $("resetButton").setAttribute("aria-pressed", String(!top));
  }
  function setFirstPerson(enabled) {
    if (firstPerson === enabled) {
      return;
    }
    firstPerson = enabled;
    looking = false;
    if (!enabled && document.pointerLockElement === renderer.domElement) {
      document.exitPointerLock();
    }
    pressedKeys.clear();
    controls.enabled = !enabled;
    const button = $("firstPersonButton");
    button.classList.toggle("active", enabled);
    button.setAttribute("aria-pressed", enabled);
    if (enabled) {
      $("topButton").classList.remove("active");
      $("topButton").setAttribute("aria-pressed", "false");
      $("resetButton").classList.remove("active");
      $("resetButton").setAttribute("aria-pressed", "false");
    }
    $("navigationHint").innerHTML = enabled
      ? "Click to look with mouse <span>·</span> WASD: move <span>·</span> E / Shift+E: up/down <span>·</span> Esc to release mouse"
      : "Drag to orbit <span>·</span> Scroll to zoom <span>·</span> Right drag to pan";
    if (enabled && currentProgram) {
      const room =
        currentProgram.rooms.find((item) => item.name === focusRoom) ||
        currentProgram.rooms.find(
          (item) =>
            (focusFloor === undefined || item.floor === focusFloor) && item.kind !== "balcony",
        ) ||
        currentProgram.rooms[0];
      camera.position.set(
        room.centerX,
        room.elevation + 1.65,
        room.centerZ + Math.min(room.rows * currentProgram.grid * 0.3, 2),
      );
      const standing = findStandingPosition(room, camera.position.x, camera.position.z);
      if (!standing) {
        setFirstPerson(false);
        showStatus("No clear standing space in this room", "warn");
        return;
      }
      camera.position.x = standing.x;
      camera.position.z = standing.z;
      camera.rotation.order = "YXZ";
      camera.rotation.set(0, 0, 0);
      renderer.domElement.style.cursor = "crosshair";
    } else if (currentProgram) {
      resetCamera();
      renderer.domElement.style.cursor = "";
    }
  }
  function updateFloorVisibility() {
    renderDirty = true;
    renderer.shadowMap.needsUpdate = true;
    clearHover();
    for (const group of sceneRoot.children) {
      if (group.userData.floor === undefined) {
        continue;
      }
      group.visible = focusFloor === undefined || group.userData.floor === focusFloor;
    }
    gridHelper.position.y = (focusFloor || 0) * 3 + 0.002;
    $("floorFocus").value = focusFloor === undefined ? "" : String(focusFloor);
  }
  function useConnector(down = false) {
    const floor = Math.round((camera.position.y - 1.65) / 3),
      nearby = currentProgram.connectors.filter((item) => {
        const x = (item.x - currentProgram.cols / 2) * currentProgram.grid,
          z = (item.z - currentProgram.rows / 2) * currentProgram.grid;
        return (
          [item.room.floor, item.upper.floor].includes(floor) &&
          Math.abs(camera.position.x - x) <= item.halfX * currentProgram.grid + 0.5 &&
          Math.abs(camera.position.z - z) <= item.halfZ * currentProgram.grid + 0.5
        );
      }),
      link = nearby.find((item) => (down ? item.upper.floor : item.room.floor) === floor);
    if (!link) {
      showStatus(
        down
          ? "No lower floor here; move near stairs or an elevator"
          : "No upper floor here; move near stairs or an elevator",
        "warn",
      );
      return;
    }
    const destination = floor === link.room.floor ? link.upper : link.room,
      standing = findStandingPosition(
        destination,
        (link.x - currentProgram.cols / 2) * currentProgram.grid,
        (link.z - currentProgram.rows / 2) * currentProgram.grid,
      );
    if (!standing) {
      showStatus("The destination has no clear landing", "warn");
      return;
    }
    camera.position.set(standing.x, destination.elevation + 1.65, standing.z);
    focusRoom = destination.name;
    focusFloor = destination.floor;
    $("roomFocus").value = focusRoom;
    updateFloorVisibility();
    showStatus(`Floor ${focusFloor} · ${link.token.name}`);
  }
  function clearScene() {
    clearHover();
    for (const child of shadowRoot.children) {
      child.geometry?.dispose();
    }
    shadowRoot.clear();
    sceneRoot.traverse((node) => {
      if (node.isLight) {
        node.shadow?.dispose();
      }
    });
    const disposed = new Set();
    sceneRoot.traverse((node) => {
      if (node.geometry && !disposed.has(node.geometry)) {
        node.geometry.dispose();
        disposed.add(node.geometry);
      }
      for (const item of [node.material].flat().filter(Boolean)) {
        if (!sharedMaterials.has(item) && !disposed.has(item)) {
          if (item.userData.ownedTexture) {
            item.map?.dispose();
          }
          item.dispose();
          disposed.add(item);
        }
      }
    });
    for (const item of daylightSourceMaterials) {
      if (!sharedMaterials.has(item) && !disposed.has(item)) {
        if (item.userData.ownedTexture) {
          item.map?.dispose();
        }
        item.dispose();
      }
    }
    daylightSourceMaterials.clear();
    daylightCeilings.clear();
    sceneRoot.clear();
  }
  function compile(resetView = false) {
    let program;
    try {
      program = parseProgram(editor.state.doc.toString());
    } catch (error) {
      showStatus(`Line ${error.line || "?"}: ${error.message}`, "error");
      return;
    }
    const shouldReset =
      resetView ||
      !currentProgram ||
      currentProgram.cols !== program.cols ||
      currentProgram.rows !== program.rows ||
      currentProgram.floors.join(",") !== program.floors.join(",");
    clearScene();
    selectableGroups = [];
    collisionEntries = [];
    currentProgram = program;
    compiledSource = editor.state.doc.toString();
    const sceneExtent = Math.max(
      program.cols * program.grid,
      program.rows * program.grid,
      (program.floors.at(-1) + 1) * 3,
    );
    controls.maxDistance = Math.max(100, sceneExtent * 4);
    camera.far = Math.max(250, sceneExtent * 8);
    camera.updateProjectionMatrix();
    addArchitecture(program);
    addExterior(program, sceneRoot, ceilingRoots, box);
    updateShadowEnclosure();
    updateSun();
    if (!program.rooms.some((room) => room.name === focusRoom)) {
      focusRoom = undefined;
    }
    if (!program.floors.includes(focusFloor)) {
      focusFloor = undefined;
    }
    const floorSelect = $("floorFocus");
    floorSelect.replaceChildren(
      new Option("All floors", ""),
      ...program.floors.map((floor) => new Option(`Floor ${floor}`, String(floor))),
    );
    floorSelect.hidden = program.floors.length < 2;
    floorSelect.value = focusFloor === undefined ? "" : String(focusFloor);
    const roomSelect = $("roomFocus");
    roomSelect.replaceChildren(
      new Option("All rooms", ""),
      ...program.rooms.map((room) => new Option(room.name.replaceAll("_", " "), room.name)),
    );
    roomSelect.hidden = program.rooms.length < 2;
    roomSelect.value = focusRoom || "";
    const entries = [];
    try {
      for (const room of program.rooms) {
        entries.push(...placeLayout(program, room.name, room));
        for (const fixture of room.lights) {
          const token = {
              dimensions: catalog[fixture.name],
              end: editor.state.doc.line(fixture.line).length,
              floor: room.floor,
              line: fixture.line,
              name: fixture.name,
              room: room.name,
              start: 0,
              yaw: 0,
            },
            group = makeFurniture(token),
            x = room.centerX + (fixture.x - (room.cols - 1) / 2) * program.grid,
            z = room.centerZ + (fixture.z - (room.rows - 1) / 2) * program.grid;
          group.position.set(x, room.elevation, z);
          group.userData.floor = room.floor;
          if (fixture.power !== undefined) {
            let initialPower = 0;
            group.traverse((node) => {
              if (node.isLight) {
                initialPower += node.intensity;
              }
            });
            const factor = initialPower ? fixture.power / initialPower : 0;
            group.traverse((node) => {
              if (node.isLight) {
                node.intensity *= factor;
              }
              if (node.material?.emissive?.getHex()) {
                node.material = node.material.clone();
                node.material.emissiveIntensity *= factor;
              }
            });
          }
          sceneRoot.add(group);
          entries.push({ group, token, x, z });
        }
      }
    } catch (error) {
      showStatus(error.message, "error");
      return;
    }
    collisionEntries = entries;
    addDaylightFill(program, sceneRoot);
    updateIndoorLights();
    updateFloorVisibility();
    const warnings = findCollisions(entries);
    showStatus(
      warnings.length > 0
        ? `${warnings.length} overlap warning${warnings.length === 1 ? "" : "s"} · ${warnings[0]}`
        : "",
      warnings.length > 0 ? "warn" : "ok",
    );
    if (shouldReset) {
      resetCamera();
    } else if (
      firstPerson &&
      !canStandAt(camera.position.x, camera.position.z, Math.round((camera.position.y - 1.65) / 3))
    ) {
      setFirstPerson(false);
      setFirstPerson(true);
    }
  }
  function resize() {
    renderDirty = true;
    const w = viewport.clientWidth,
      h = viewport.clientHeight;
    if (!w || !h) {
      return;
    }
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  new ResizeObserver(resize).observe(viewport);
  function canStandAt(x, z, floor) {
    const radius = 0.2,
      { grid } = currentProgram,
      gx = x / grid + currentProgram.cols / 2,
      gz = z / grid + currentProgram.rows / 2,
      rooms = currentProgram.rooms.filter((room) => room.floor === floor);
    for (const dx of [-radius, radius]) {
      for (const dz of [-radius, radius]) {
        if (
          !rooms.some(
            (room) =>
              gx + dx / grid >= room.x &&
              gx + dx / grid <= room.x + room.cols &&
              gz + dz / grid >= room.z &&
              gz + dz / grid <= room.z + room.rows,
          )
        ) {
          return false;
        }
      }
    }
    for (const room of rooms) {
      for (const side of [...room.walls, ...room.rails]) {
        const vertical = side === "east" || side === "west",
          length = (vertical ? room.rows : room.cols) * grid,
          center =
            ((vertical ? room.z + room.rows / 2 : room.x + room.cols / 2) -
              (vertical ? currentProgram.rows : currentProgram.cols) / 2) *
            grid,
          fixed =
            ((vertical
              ? room.x + (side === "east" ? room.cols : 0)
              : room.z + (side === "south" ? room.rows : 0)) -
              (vertical ? currentProgram.cols : currentProgram.rows) / 2) *
            grid,
          along = (vertical ? z : x) - center,
          across = Math.abs((vertical ? x : z) - fixed);
        if (
          across <
            radius +
              (room.walls.includes(side) ? wallThickness(currentProgram, room, side) / 2 : 0.06) &&
          Math.abs(along) < length / 2 + radius
        ) {
          const gap = room.doors.includes(side) ? Math.min(1.15, length * 0.4) : 0;
          if (Math.abs(along) + radius >= gap / 2) {
            return false;
          }
        }
      }
    }
    for (const link of currentProgram.connectors) {
      if (
        link.token.name === "stairs" &&
        link.upper.floor === floor &&
        Math.abs(gx - link.x) < link.halfX + radius / grid &&
        Math.abs(gz - link.z) < link.halfZ + radius / grid
      ) {
        return false;
      }
    }
    for (const entry of collisionEntries) {
      const { token } = entry;
      if (
        token.floor !== floor ||
        ["rug", "awning", "stairs", ...overheadLights].includes(token.name)
      ) {
        continue;
      }
      const angle = (token.yaw * Math.PI) / 180,
        dx = x - entry.x,
        dz = z - entry.z,
        localX = dx * Math.cos(angle) - dz * Math.sin(angle),
        localZ = dx * Math.sin(angle) + dz * Math.cos(angle),
        [width, depth] = token.dimensions;
      if (token.name === "elevator") {
        if (
          Math.abs(localX) < width / 2 + radius &&
          Math.abs(localZ) < depth / 2 + radius &&
          (Math.abs(localX) > width / 2 - radius - 0.08 || localZ < -depth / 2 + radius + 0.08)
        ) {
          return false;
        }
      } else if (Math.abs(localX) < width / 2 + radius && Math.abs(localZ) < depth / 2 + radius) {
        return false;
      }
    }
    return true;
  }
  function moveFirstPerson(direction, distance) {
    const floor = Math.round((camera.position.y - 1.65) / 3),
      steps = Math.max(1, Math.ceil(Math.abs(distance) / 0.08));
    for (let i = 0; i < steps; i += 1) {
      const x = camera.position.x + (direction.x * distance) / steps,
        z = camera.position.z + (direction.z * distance) / steps;
      if (canStandAt(x, camera.position.z, floor)) {
        camera.position.x = x;
      }
      if (canStandAt(camera.position.x, z, floor)) {
        camera.position.z = z;
      }
    }
  }
  function findStandingPosition(room, x = room.centerX, z = room.centerZ) {
    if (canStandAt(x, z, room.floor)) {
      return { x, z };
    }
    const positions = [];
    for (let row = 0; row < room.rows; row += 1) {
      for (let col = 0; col < room.cols; col += 1) {
        const px = room.centerX + (col - (room.cols - 1) / 2) * currentProgram.grid,
          pz = room.centerZ + (row - (room.rows - 1) / 2) * currentProgram.grid;
        if (canStandAt(px, pz, room.floor)) {
          positions.push({ x: px, z: pz });
        }
      }
    }
    return positions.toSorted(
      (a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z),
    )[0];
  }
  let lastFrameTime = performance.now();
  function animate(time = performance.now()) {
    requestAnimationFrame(animate);
    const blend = 1 - Math.exp(-Math.max(0, time - lastFrameTime) * 0.012);
    lastFrameTime = time;
    const ceilingTarget = ceilingsCollapsed ? 0 : 1;
    if (material.ceiling.opacity !== ceilingTarget) {
      renderDirty = true;
    }
    material.ceiling.opacity += (ceilingTarget - material.ceiling.opacity) * blend;
    if (Math.abs(ceilingTarget - material.ceiling.opacity) < 0.001) {
      material.ceiling.opacity = ceilingTarget;
    }
    material.ceiling.depthWrite = material.ceiling.opacity === 1;
    for (const ceiling of daylightCeilings) {
      ceiling.opacity = material.ceiling.opacity;
      ceiling.depthWrite = material.ceiling.depthWrite;
    }
    for (const ceiling of ceilingRoots) {
      ceiling.visible = material.ceiling.opacity > 0;
    }
    for (const walls of wallRoots) {
      const target = wallsCollapsed ? 0.045 : 1;
      if (walls.scale.y !== target) {
        renderDirty = true;
        renderer.shadowMap.needsUpdate = true;
      }
      walls.scale.y += (target - walls.scale.y) * blend;
      if (Math.abs(target - walls.scale.y) < 0.001) {
        walls.scale.y = target;
      }
    }
    if (firstPerson) {
      const speed = 0.065,
        direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      if (pressedKeys.has("w") || pressedKeys.has("arrowup")) {
        moveFirstPerson(direction, speed);
      }
      if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) {
        moveFirstPerson(direction, -speed);
      }
      const right = new THREE.Vector3(-direction.z, 0, direction.x);
      if (pressedKeys.has("d") || pressedKeys.has("arrowright")) {
        moveFirstPerson(right, speed);
      }
      if (pressedKeys.has("a") || pressedKeys.has("arrowleft")) {
        moveFirstPerson(right, -speed);
      }
    } else {
      controls.update();
    }
    if (hoverOutline) {
      hoverOutline.update();
    }
    camera.updateMatrixWorld();
    if (!lastView.equals(camera.matrixWorld)) {
      renderDirty = true;
      lastView.copy(camera.matrixWorld);
    }
    if (renderDirty) {
      renderFixtures();
      renderDirty = false;
    }
  }
  animate();
  examples["Decor gallery"] = decorationExample;
  examples["Mediterranean three-level apartment"] = referenceApartment();
  for (const name of Object.keys(examples)) {
    examples[name] = enrichExample(examples[name], parseProgram, name);
  }
  const exampleGroups = {
    "Apartments and open plans": [
      "Micro apartment",
      "Open-plan loft",
      "One-bedroom apartment",
      "City apartment + balcony",
    ],
    "Impossible destinations": [
      "The Minotaur's labyrinth",
      "Backrooms",
      "Cloud city skyscraper",
      "Lunar seed vault",
      "The drowned arcade",
      "Midnight observatory",
      "Museum of tomorrow's ruins",
    ],
    "Multiple floors": [
      "Mediterranean three-level apartment",
      "Two-storey home",
      "Three-storey townhouse",
      "Three-floor library",
      "Four-floor tower",
    ],
    "Outdoor areas": ["Balcony garden", "Rooftop Riviera"],
    "Single rooms": [
      "Decor gallery",
      "Living room",
      "Bedroom",
      "Creative studio",
      "Dining room",
      "Kitchen & dining",
      "Reading nook",
      "Home office",
      "Spa bathroom",
      "Galley kitchen",
      "Entryway",
      "Laundry room",
    ],
    "Whole homes": ["Family home", "Work-from-home flat", "Six-room house"],
  };
  for (const [label, names] of Object.entries(exampleGroups)) {
    const group = document.createElement("optgroup");
    group.label = label;
    for (const name of names) {
      const option = document.createElement("option");
      option.textContent = name;
      option.value = name;
      group.append(option);
    }
    select.append(group);
  }
  select.add(new Option("Custom scene", "custom"));
  function loadExample(name) {
    clearTimeout(compileTimer);
    editor.setState(editorState(examples[name]));
    updateFoldButton(editor.state);
    focusRoom = undefined;
    focusFloor = undefined;
    select.value = name;
    compile(true);
  }
  select.addEventListener("change", () => {
    if (select.value !== "custom") {
      loadExample(select.value);
    }
  });
  function indicateSource(event) {
    if (
      editor.state.doc.toString() !== compiledSource ||
      event.target.closest(".cm-foldPlaceholder")
    ) {
      clearHover();
      return;
    }
    const position = editor.posAtCoords({ x: event.clientX, y: event.clientY });
    if (position === null) {
      clearHover();
      return;
    }
    const line = editor.state.doc.lineAt(position),
      column = position - line.from,
      group = selectableGroups.find((item) => {
        const { token } = item.userData;
        return (
          token.line === line.number &&
          column >= (token.start || 0) &&
          column < (token.end ?? Infinity) &&
          (focusFloor === undefined || token.floor === focusFloor)
        );
      });
    indicateGroup(group, true);
  }
  editor.contentDOM.addEventListener("pointermove", indicateSource);
  editor.contentDOM.addEventListener("click", (event) => {
    clearHover();
    indicateSource(event);
    pinSelection();
  });
  editor.contentDOM.addEventListener("pointerleave", () => {
    if (!selectionPinned) {
      clearHover();
    }
  });
  $("foldButton").addEventListener("click", () => {
    const collapsed = foldedRanges(editor.state).size > 0;
    clearHover();
    if (collapsed) {
      unfoldAll(editor);
    } else {
      foldAll(editor);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.target.closest(".sun-settings")) {
      return;
    }
    if (event.key === "Escape" && selectionPinned) {
      clearHover();
    }
    if (
      event.key === "Escape" &&
      firstPerson &&
      document.pointerLockElement !== renderer.domElement
    ) {
      setFirstPerson(false);
      return;
    }
    if (firstPerson && !editor.hasFocus && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const key = event.key.toLowerCase();
      if (key === "e" && !event.repeat) {
        useConnector(event.shiftKey);
      }
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
        pressedKeys.add(key);
      }
    }
  });
  document.addEventListener("keyup", (event) => pressedKeys.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => pressedKeys.clear());
  $("gridButton").addEventListener("click", (event) => {
    gridVisible = !gridVisible;
    if (gridHelper) {
      gridHelper.visible = gridVisible;
    }
    event.currentTarget.classList.toggle("active", gridVisible);
    event.currentTarget.setAttribute("aria-pressed", gridVisible);
  });
  $("wallsButton").addEventListener("click", (event) => {
    wallsCollapsed = !wallsCollapsed;
    event.currentTarget.title = wallsCollapsed ? "Restore all walls" : "Collapse all walls";
    event.currentTarget.setAttribute("aria-label", event.currentTarget.title);
    event.currentTarget.classList.toggle("active", wallsCollapsed);
    event.currentTarget.setAttribute("aria-pressed", wallsCollapsed);
  });
  $("ceilingsButton").addEventListener("click", (event) => {
    ceilingsCollapsed = !ceilingsCollapsed;
    clearHover();
    event.currentTarget.title = ceilingsCollapsed
      ? "Restore all ceilings"
      : "Collapse all ceilings";
    event.currentTarget.setAttribute("aria-label", event.currentTarget.title);
    event.currentTarget.classList.toggle("active", ceilingsCollapsed);
    event.currentTarget.setAttribute("aria-pressed", ceilingsCollapsed);
  });
  $("topButton").addEventListener("click", () => resetCamera(true));
  $("firstPersonButton").addEventListener("click", () => setFirstPerson(!firstPerson));
  $("roomFocus").addEventListener("change", (event) => {
    focusRoom = event.target.value || undefined;
    focusFloor = currentProgram.rooms.find((room) => room.name === focusRoom)?.floor;
    updateFloorVisibility();
    resetCamera();
  });
  $("floorFocus").addEventListener("change", (event) => {
    focusFloor = event.target.value === "" ? undefined : Number(event.target.value);
    focusRoom = undefined;
    $("roomFocus").value = "";
    updateFloorVisibility();
    resetCamera();
  });
  $("resetButton").addEventListener("click", () => {
    focusRoom = undefined;
    $("roomFocus").value = "";
    focusFloor = undefined;
    updateFloorVisibility();
    resetCamera();
  });
  $("fullscreenButton").addEventListener("click", () =>
    document.fullscreenElement ? document.exitFullscreen() : viewport.requestFullscreen(),
  );
  document.addEventListener("fullscreenchange", () => {
    const active = document.fullscreenElement === viewport;
    $("fullscreenButton").title = active ? "Exit fullscreen" : "Enter fullscreen";
    $("fullscreenButton").setAttribute("aria-label", $("fullscreenButton").title);
    $("fullscreenButton").classList.toggle("active", active);
    $("fullscreenButton").setAttribute("aria-pressed", active);
    resize();
  });
  $("copyButton").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(editor.state.doc.toString());
      showStatus("Layout copied");
    } catch {
      showStatus("Clipboard access is unavailable here", "warn");
    }
  });
  $("shareButton").addEventListener("click", async () => {
    const url = new URL(location.href);
    url.searchParams.delete("example");
    url.hash = new URLSearchParams({ scene: editor.state.doc.toString() }).toString();
    const settings = new URLSearchParams(url.hash.slice(1));
    for (const field of sunFields) {
      settings.set(`sun${field}`, $(`sun${field}`).value);
    }
    url.hash = settings.toString();
    try {
      await navigator.clipboard.writeText(url.href);
      showStatus("Share URL copied");
    } catch {
      showStatus(
        "Could not copy the share URL. Check clipboard permissions and try again.",
        "warn",
      );
    }
  });
  renderer.domElement.addEventListener("pointerdown", (event) => {
    selectionPointer = { x: event.clientX, y: event.clientY };
    if (firstPerson && event.button === 0) {
      looking = true;
      lastPointer = { x: event.clientX, y: event.clientY };
      renderer.domElement.requestPointerLock()?.catch(() => false);
    }
  });
  globalThis.addEventListener("pointerup", () => {
    looking = false;
    lastPointer = undefined;
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (
      firstPerson &&
      looking &&
      lastPointer &&
      document.pointerLockElement !== renderer.domElement
    ) {
      camera.rotation.y -= (event.clientX - lastPointer.x) * 0.003;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - (event.clientY - lastPointer.y) * 0.003,
        -Math.PI * 0.48,
        Math.PI * 0.48,
      );
      lastPointer = { x: event.clientX, y: event.clientY };
    }
    if (!firstPerson) {
      hoverObject(event);
    }
  });
  document.addEventListener("mousemove", (event) => {
    if (!firstPerson || document.pointerLockElement !== renderer.domElement) {
      return;
    }
    camera.rotation.y -= event.movementX * 0.003;
    camera.rotation.x = THREE.MathUtils.clamp(
      camera.rotation.x - event.movementY * 0.003,
      -Math.PI * 0.48,
      Math.PI * 0.48,
    );
  });
  renderer.domElement.addEventListener("click", (event) => {
    if (firstPerson) {
      return;
    }
    if (
      !selectionPointer ||
      Math.hypot(event.clientX - selectionPointer.x, event.clientY - selectionPointer.y) > 5
    ) {
      return;
    }
    clearHover();
    hoverObject(event);
    pinSelection();
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    if (!selectionPinned) {
      clearHover();
    }
  });
  const requestedExample = new URLSearchParams(location.search).get("example"),
    sharedSource = new URLSearchParams(location.hash.slice(1)).get("scene");
  if (sharedSource === null) {
    loadExample(examples[requestedExample] ? requestedExample : "Living room");
  } else {
    editor.setState(editorState(sharedSource));
    updateFoldButton(editor.state);
    select.value = "custom";
    compile(true);
  }
})().catch((_error) => {
  const message = document.querySelector("#message span:last-child");
  if (message) {
    message.textContent = "Could not load the editor or 3D libraries. Check your connection.";
    message.parentElement.hidden = false;
    message.parentElement.className = "message error";
  }
});
