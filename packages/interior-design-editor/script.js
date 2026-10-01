/* eslint-disable oxc/no-rest-spread-properties, no-underscore-dangle, max-classes-per-file, unicorn/no-null, new-cap, unicorn/max-nested-calls, max-lines, max-lines-per-function, prefer-named-capture-group, no-magic-numbers, id-length, max-statements, max-params, complexity, max-depth, one-var, sort-vars, func-style, no-use-before-define, unicorn/consistent-function-scoping, no-ternary, no-nested-ternary, unicorn/no-nested-ternary, init-declarations, no-undefined, no-continue, unicorn/no-array-for-each, oxc/no-optional-chaining, oxc/no-async-await, unicorn/prefer-top-level-await */ const createLayoutCore =
  function createLayoutCore() {
    const catalog = {
        ac_condenser: [0.82, 0.36, 0.62],
        accent_chair: [0.72, 0.8, 0.86],
        air_conditioner: [1.02, 0.22, 0.31],
        aquarium: [1.8, 0.65, 1.45],
        arcade_machine: [0.75, 0.85, 1.7],
        arched_mirror: [0.7, 0.045, 1.1],
        archway: [3.6, 0.3, 2.6],
        armchair: [0.86, 0.83, 0.86],
        awning: [3.6, 1.8, 2.65],
        bar_stool: [0.42, 0.42, 0.69],
        bathroom_vanity: [0.62, 0.5, 0.85],
        bathtub: [1.6, 0.78, 0.58],
        bbq: [0.85, 0.55, 0.95],
        bed: [1.5, 2, 0.56],
        bench: [1.12, 0.43, 0.47],
        bistro_table: [0.75, 0.75, 0.72],
        bolster: [0.55, 0.18, 0.18],
        book: [0.23, 0.17, 0.045],
        book_stack: [0.3, 0.23, 0.14],
        bookshelf: [0.9, 0.36, 1.85],
        botanical_print: [0.42, 0.04, 0.58],
        bougainvillea: [1.2, 0.65, 2.2],
        breakfast_bar: [1.5, 0.48, 1.05],
        cafe_setting: [0.65, 0.38, 0.22],
        canopy_bed: [1.55, 2.05, 1.95],
        ceiling_fan: [1.2, 1.2, 2.65],
        ceiling_light: [0.5, 0.5, 2.7],
        ceramic_table_lamp: [0.34, 0.34, 0.52],
        ceramic_vessels: [0.48, 0.22, 0.32],
        chair: [0.5, 0.54, 0.87],
        citrus_bowl: [0.28, 0.28, 0.18],
        citrus_print: [0.42, 0.035, 0.6],
        citrus_tree: [2.2, 2.2, 2.8],
        coastal_print: [0.42, 0.035, 0.6],
        coat_rack: [0.6, 0.6, 1.75],
        coffee_maker: [0.25, 0.3, 0.35],
        coffee_table: [1.08, 0.64, 0.43],
        column: [0.55, 0.55, 2.6],
        console_table: [1.1, 0.35, 0.8],
        curtain_pair: [1.8, 0.18, 2.5],
        cypress: [1.2, 1.2, 3.5],
        desk: [1.35, 0.7, 0.75],
        dining_table: [1.55, 0.9, 0.75],
        downlight: [0.22, 0.22, 2.7],
        dresser: [1.03, 0.49, 0.92],
        dumbbells: [0.85, 0.48, 0.32],
        elevator: [1.6, 1.6, 3],
        filing_cabinet: [0.48, 0.55, 0.68],
        fireplace: [1.35, 0.65, 2.6],
        floor_drain: [0.18, 0.18, 0.015],
        flower_border: [2.4, 0.65, 0.65],
        fluorescent_light: [1.2, 0.3, 2.7],
        folding_chair: [0.5, 0.58, 0.88],
        fountain: [1.8, 1.8, 1.5],
        frameless_shower: [0.9, 0.95, 2.05],
        fridge: [0.73, 0.7, 1.82],
        garden_lamp: [0.22, 0.22, 0.9],
        garden_steps: [1.5, 1.5, 0.6],
        garment_rack: [1.05, 0.5, 1.7],
        globe_lamp: [0.42, 0.42, 1.65],
        grape_trellis: [2.4, 0.4, 2.5],
        gym_bench: [0.65, 1.45, 1.1],
        gym_mat: [1.8, 1.2, 0.025],
        hedge: [2, 0.65, 1.7],
        hot_tub: [2.2, 2.2, 0.85],
        hydroponic_rack: [1.8, 0.7, 2],
        jute_rug: [2, 1.4, 0.018],
        kilim_rug: [1.4, 0.8, 0.015],
        kitchen_accessories: [0.65, 0.32, 0.42],
        kitchen_chair: [0.5, 0.53, 0.86],
        kitchen_counter: [1.48, 0.62, 0.9],
        kitchen_island: [1.55, 0.85, 0.91],
        kitchen_table: [1.52, 0.86, 0.75],
        kitchenette: [2.4, 0.65, 2.25],
        lamp: [0.4, 0.4, 1.48],
        lantern: [0.3, 0.3, 0.5],
        laundry_basket: [0.44, 0.4, 0.56],
        linen_bench: [1.2, 0.42, 0.48],
        linen_pouf: [0.6, 0.6, 0.4],
        linen_throw: [1.2, 0.8, 0.16],
        mirror: [0.6, 0.06, 0.9],
        modular_sofa: [2.8, 1.5, 0.82],
        monitor: [0.48, 0.12, 0.39],
        mug: [0.11, 0.11, 0.12],
        nightstand: [0.49, 0.44, 0.52],
        ochre_table: [0.46, 0.46, 0.5],
        olive_tree: [2.5, 2.5, 2.8],
        ottoman: [0.62, 0.54, 0.42],
        outdoor_chair: [0.6, 0.6, 0.82],
        outdoor_kitchen: [2.4, 0.7, 0.95],
        painting: [0.85, 0.055, 0.65],
        palm: [2.4, 2.4, 2.6],
        parasol: [2.6, 2.6, 2.5],
        partition: [2, 0.18, 2.65],
        patio_chair: [0.5, 0.55, 0.82],
        pendant_light: [0.5, 0.5, 2.7],
        piano: [1.5, 0.65, 1.2],
        pillow: [0.38, 0.3, 0.1],
        plant: [0.48, 0.48, 1.12],
        planter: [1.05, 0.34, 0.46],
        pool: [5.6, 3.4, 0.85],
        poster: [0.6, 0.025, 0.85],
        retaining_wall: [2.4, 0.3, 0.65],
        retro_fridge: [0.6, 0.64, 1.55],
        roller_shutter: [1.8, 0.18, 2.5],
        roman_blind: [1.6, 0.12, 1.5],
        round_dining_table: [1.2, 1.2, 0.75],
        rug: [1.55, 1.15, 0.025],
        sculpture: [0.9, 0.9, 1.8],
        sea_table: [0.46, 0.46, 0.5],
        server_rack: [0.8, 0.9, 2.1],
        shoe_rack: [0.9, 0.32, 0.48],
        shower: [0.93, 0.93, 2.05],
        shower_set: [0.5, 0.2, 1.9],
        side_table: [0.48, 0.48, 0.54],
        sideboard: [1.38, 0.48, 0.83],
        sink: [1.08, 0.62, 0.9],
        slatted_table: [0.85, 0.85, 0.75],
        sleeping_loft: [3.4, 3.6, 3.35],
        sofa: [1.75, 0.82, 0.78],
        sofa_bed: [1.9, 0.85, 0.85],
        solar_panel: [1.8, 1.2, 0.8],
        stairs: [1.2, 3.6, 3],
        stone_path: [1.2, 3, 0.04],
        stove: [0.64, 0.65, 0.88],
        sun_lounger: [0.75, 1.95, 0.65],
        table_lamp: [0.28, 0.28, 0.4],
        telescope: [1.1, 1.2, 1.65],
        terracotta_pot: [0.5, 0.5, 0.7],
        terracotta_urn: [0.45, 0.45, 0.65],
        timber_pergola: [3.6, 2.8, 2.7],
        timber_rail: [2.4, 0.1, 1.05],
        timber_wardrobe: [0.9, 0.55, 1.95],
        toilet: [0.43, 0.65, 0.72],
        toilet_open: [0.43, 0.65, 0.94],
        topiary_tree: [2.2, 2.2, 3.2],
        towel_rack: [0.65, 0.32, 0.95],
        towel_rail: [0.65, 0.14, 1.25],
        towel_stack: [0.48, 0.32, 0.24],
        track_light: [1.2, 0.22, 2.7],
        treadmill: [0.9, 1.8, 1.3],
        trellis: [1.8, 0.12, 1.8],
        tufted_sofa: [1.9, 0.85, 0.86],
        tv: [0.93, 0.09, 0.6],
        tv_stand: [1.33, 0.42, 0.53],
        upholstered_bed: [1.7, 2.2, 1.05],
        vanity: [0.95, 0.52, 0.84],
        vase: [0.22, 0.22, 0.34],
        vending_machine: [0.95, 0.8, 1.9],
        wall_clock: [0.32, 0.06, 0.32],
        wall_coat_hooks: [0.7, 0.07, 0.18],
        wall_lamp: [0.22, 0.19, 0.3],
        wall_outlet: [0.16, 0.025, 0.085],
        wall_shelf: [0.8, 0.22, 0.32],
        wall_spot_pair: [0.52, 0.18, 0.18],
        wall_tv: [1.1, 0.07, 0.65],
        wardrobe: [1.25, 0.56, 1.95],
        washing_machine: [0.6, 0.64, 0.85],
        wicker_basket: [0.5, 0.36, 0.3],
        wishbone_chair: [0.55, 0.55, 0.8],
        woven_chair: [0.68, 0.75, 0.85],
        woven_pendant: [0.58, 0.58, 2.7],
      },
      examples = {
        Bedroom:
          "# Bedroom: 3.5 × 4 m. GRID is metres per cell.\n# Furniture: asset[width x depth x height]~wall<product URL>.\n# Links are product references; the renderer uses generic shapes.\nGRID 0.5\nROOM main 7x8 AT 0,0\nWALLS north east south west\nDOORS south\nWINDOWS north\nSURFACE wood\nMOUNT east 4 mirror\nLIGHT ceiling_light AT 3,4 POWER 18\nLAYOUT main\n. | . | . | . | . | . | .\n. | . | . | bed[1.5x2x0.56]~north<https://www.ikea.com/sg/en/p/malm-bed-frame-high-white-s89005264/> | . | . | .\n. | . | . | . | . | . | .\n. | . | . | . | . | . | .\n. | . | . | . | . | . | .\n. | side_table[0.55x0.55x0.45]<https://www.ikea.com/us/en/p/lack-side-table-white-30449908/> | . | . | . | . | .\n. | . | . | . | . | dresser~east | .\n. | . | . | . | . | . | .\nEND",
        "Kitchen & dining":
          "# Kitchen: 4 × 3.5 m. @ rotates furniture in degrees.\n# Append <https://...> to furniture to keep its product link.\nGRID 0.5\nROOM main 8x7 AT 0,0\nWALLS north east south west\nDOORS south\nWINDOWS east\nSURFACE tile\nLIGHT ceiling_light AT 4,3 POWER 18\nLAYOUT main\n. | . | . | . | . | . | . | .\n. | fridge~north | . | . | kitchen_counter[1.35x0.62x0.9]~north | . | stove~north | .\n. | . | . | . | . | . | . | .\n. | . | . | . | kitchen_chair | . | . | .\n. | . | . | . | . | . | . | .\n. | . | kitchen_chair@90 | . | kitchen_table[1.4x0.78x0.74]<https://www.ikea.com/us/en/p/lisabo-table-ash-veneer-70294339/> | . | kitchen_chair@270 | .\n. | . | . | . | . | . | . | .\nEND",
        "Small apartment":
          "# A 27 m² apartment: living/kitchen, bedroom and bathroom.\n# AT places rooms in grid cells; matching DOORS connect rooms.\n# Append <https://...> to furniture; click it to open the product.\n# Rendered furniture is generic. Set dimensions to your actual item.\nGRID 0.5\nROOM living 8x6 AT 0,0\nWALLS north east south west\nDOORS east south\nWINDOWS north west\nSURFACE wood\nLIGHT ceiling_light AT 3,5 POWER 18\nROOM bedroom 6x6 AT 8,0\nWALLS north east south west\nDOORS west south\nWINDOWS north east\nSURFACE wood\nLIGHT ceiling_light AT 3,4 POWER 12\nROOM bathroom 6x4 AT 8,6\nWALLS north east south west\nDOORS north\nWINDOWS none\nSURFACE tile\nLIGHT ceiling_light AT 3,2 POWER 12\nLAYOUT living\n. | . | . | . | . | . | . | .\n. | fridge~north | . | . | . | kitchenette[2.1x0.65x2.25]~north | . | .\n. | . | . | . | . | desk[1x0.6x0.74]<https://www.ikea.com/us/en/p/linnmon-adils-table-white-s29932181/> | . | .\n. | sofa~west | . | . | . | . | . | .\n. | . | . | . | coffee_table | . | . | .\n. | . | . | . | . | . | . | .\nEND\nLAYOUT bedroom\n. | . | . | . | . | .\n. | . | bed[1.5x2x0.56]~north<https://www.ikea.com/sg/en/p/malm-bed-frame-high-white-s89005264/> | . | . | .\n. | . | . | . | . | .\n. | . | . | . | . | .\n. | . | . | . | . | .\n. | . | . | . | . | .\nEND\nLAYOUT bathroom\n. | . | . | . | . | .\n. | shower~west | . | . | toilet~east | .\n. | . | . | . | . | .\n. | bathroom_vanity~south | . | . | . | .\nEND",
      },
      fixtureNames = new Set(
        Object.keys(catalog).filter((name) => /light|lamp|pendant|lantern/u.test(name)),
      ),
      mountNames = new Set([
        "mirror",
        "arched_mirror",
        "painting",
        "poster",
        "wall_clock",
        "wall_shelf",
        "botanical_print",
        "wall_tv",
        "wall_outlet",
        "wall_coat_hooks",
        "citrus_print",
        "coastal_print",
        "wall_spot_pair",
        "wall_lamp",
        "air_conditioner",
      ]),
      directions = ["north", "east", "south", "west"],
      aliases = Object.fromEntries(
        [
          "sofa",
          "coffee_table",
          "chair",
          "tv_stand",
          "tv",
          "bed",
          "desk",
          "dining_table",
          "plant",
          "lamp",
          "bookshelf",
          "rug",
        ].map((name, i) => [i + 1, name]),
      );
    class LayoutError extends Error {
      constructor(message, line) {
        super(`Line ${line}: ${message}`);
        this.line = line;
        this.name = "LayoutError";
      }
    }
    const fail = (message, line) => {
      throw new LayoutError(message, line);
    };
    function productUrl(value, line) {
      if (!value) {
        return;
      }
      let url;
      try {
        url = new URL(value);
      } catch {
        fail("Invalid product URL", line);
      }
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
        fail("Use an HTTP(S) product URL without credentials", line);
      }
      return url.href;
    }
    function parseToken(text, line, start = 0) {
      if ([".", "-", "0"].includes(text)) {
        return null;
      }
      const base = /^(\w+)/u.exec(text);
      if (!base) {
        fail("Invalid furniture token", line);
      }
      const [, raw] = base;
      let rest = text.slice(raw.length),
        child,
        d,
        h,
        link,
        rotation,
        w,
        wall;
      const seen = new Set();
      while (rest) {
        const modifier =
          /^(?:\[([\d.]+)x([\d.]+)x([\d.]+)\]|@(-?[\d.]+)|~(north|east|south|west)|\((\w+)_on_top\)|<([^<>]+)>)/iu.exec(
            rest,
          );
        if (!modifier) {
          fail("Invalid furniture modifier", line);
        }
        const key = modifier[1]
          ? "size"
          : modifier[4]
            ? "rotation"
            : modifier[5]
              ? "wall"
              : modifier[6]
                ? "child"
                : "link";
        if (seen.has(key)) {
          fail("Duplicate furniture modifier", line);
        }
        seen.add(key);
        if (modifier[1]) {
          [w, d, h] = modifier.slice(1, 4);
        }
        if (modifier[4]) {
          ({ 4: rotation } = modifier);
        }
        if (modifier[5]) {
          ({ 5: wall } = modifier);
        }
        if (modifier[6]) {
          ({ 6: child } = modifier);
        }
        if (modifier[7]) {
          ({ 7: link } = modifier);
        }
        rest = rest.slice(modifier[0].length);
      }
      if (wall && rotation !== undefined) {
        fail("Wall placement sets rotation; do not combine ~ and @", line);
      }
      const name = aliases[raw] || raw.toLowerCase();
      if (!Object.hasOwn(catalog, name)) {
        fail(`Unknown asset “${raw}”`, line);
      }
      const dimensions = w ? [w, d, h].map(Number) : [...catalog[name]];
      if (dimensions.some((value) => !Number.isFinite(value) || value <= 0 || value > 10)) {
        fail("Dimensions must be greater than 0 and at most 10 metres", line);
      }
      const yaw = wall
        ? { east: 270, north: 0, south: 180, west: 90 }[wall.toLowerCase()]
        : Number(rotation || 0);
      if (!Number.isFinite(yaw)) {
        fail("Invalid rotation", line);
      }
      return {
        child: child?.toLowerCase(),
        dimensions,
        end: start + text.length,
        line,
        name,
        start,
        text,
        url: productUrl(link, line),
        wall: wall?.toLowerCase(),
        yaw,
      };
    }
    function parseProgram(source) {
      if (source.length > 200_000) {
        fail("Layout exceeds 200,000 characters", 1);
      }
      const program = {
        exteriorWallThickness: 0.24,
        facade: "none",
        grid: 0.82,
        interiorWallThickness: 0.12,
        layouts: Object.create(null),
        margin: 5,
        roof: "none",
        rooms: [],
        site: "none",
        warnings: [],
      };
      let active,
        floor = 0,
        room;
      const roomNames = new Set(),
        lines = source.replaceAll("\r", "").split("\n");
      for (let index = 0; index < lines.length; index += 1) {
        const original = lines[index];
        let insideLink = false,
          end = original.length;
        for (let i = 0; i < original.length; i += 1) {
          if (original[i] === "<") {
            insideLink = true;
          }
          if (original[i] === ">") {
            insideLink = false;
          }
          if (original[i] === "#" && !insideLink) {
            end = i;
            break;
          }
        }
        const text = original.slice(0, end).trim(),
          line = index + 1;
        if (!text) {
          continue;
        }
        if (active) {
          if (/^END$/iu.test(text)) {
            active = undefined;
            continue;
          }
          if (/^(ROOM|BALCONY|GARDEN|LAYOUT|FLOOR)\b/iu.test(text)) {
            fail("Finish the layout with END", line);
          }
          const cells = [],
            matches = [...original.slice(0, end).matchAll(/(?:[^\s|<]+(?:<[^<>]*>)?)/gu)];
          if (matches.length === 0) {
            fail("Empty layout row", line);
          }
          for (const match of matches) {
            cells.push(parseToken(match[0], line, match.index));
          }
          if (
            text.includes("|") &&
            (matches
              .slice(1)
              .some(
                (m, i) =>
                  !original.slice(matches[i].index + matches[i][0].length, m.index).includes("|"),
              ) ||
              text.split("|").some((c) => !c.trim()))
          ) {
            fail("Separate every cell with |", line);
          }
          program.layouts[active].push(cells);
          continue;
        }
        let m;
        if ((m = /^GRID\s+([\d.]+)$/iu.exec(text))) {
          program.grid = Number(m[1]);
          if (program.grid < 0.2 || program.grid > 3 || !Number.isFinite(program.grid)) {
            fail("GRID must be 0.2–3 metres", line);
          }
        } else if ((m = /^FLOOR\s+(-?\d+)$/iu.exec(text))) {
          floor = Number(m[1]);
          room = undefined;
          if (floor < -8 || floor > 31) {
            fail("FLOOR must be −8–31", line);
          }
        } else if (
          (m = /^(ROOM|BALCONY|GARDEN)\s+(\w+)\s+(\d+)x(\d+)\s+AT\s+(-?\d+),(-?\d+)$/iu.exec(text))
        ) {
          const [, kind, name, cols, rows, x, z] = m;
          if (roomNames.has(name.toLowerCase())) {
            fail(`Duplicate room “${name}”`, line);
          }
          roomNames.add(name.toLowerCase());
          room = {
            cols: Number(cols),
            doors: [],
            elevation: floor * 3,
            floor,
            height: 2.6,
            kind: kind.toLowerCase(),
            lights: [],
            line,
            mounts: [],
            name: name.toLowerCase(),
            rails: kind.toLowerCase() === "balcony" ? ["east", "south", "west"] : [],
            rows: Number(rows),
            style: "warm",
            surface: kind.toLowerCase() === "garden" ? "grass" : "wood",
            walls: kind.toLowerCase() === "room" ? ["north", "east", "west"] : [],
            windows: [],
            x: Number(x),
            z: Number(z),
          };
          if (
            room.cols < 2 ||
            room.rows < 2 ||
            room.cols > 40 ||
            room.rows > 40 ||
            program.rooms.length >= 32
          ) {
            fail("Use at most 32 rooms, each 2–40 cells", line);
          }
          program.rooms.push(room);
        } else if ((m = /^LAYOUT\s+(\w+)$/iu.exec(text))) {
          active = m[1].toLowerCase();
          if (program.layouts[active]) {
            fail(`Duplicate layout “${active}”`, line);
          }
          program.layouts[active] = [];
        } else if ((m = /^(WALLS|WINDOWS|DOORS|RAILS)\s+(.+)$/iu.exec(text))) {
          if (!room) {
            fail("Define a room first", line);
          }
          const values = m[2].toLowerCase().split(/\s+/u);
          if (
            values.some((v) => ![...directions, "none"].includes(v)) ||
            (values.includes("none") && values.length > 1)
          ) {
            fail("Use north, east, south, west, or none", line);
          }
          room[m[1].toLowerCase()] = values[0] === "none" ? [] : [...new Set(values)];
        } else if ((m = /^(SURFACE|STYLE|HEIGHT)\s+(\S+)$/iu.exec(text))) {
          if (!room) {
            fail("Define a room first", line);
          }
          const key = m[1].toLowerCase(),
            value = m[2].toLowerCase();
          if (key === "height") {
            room.height = Number(value);
            if (!Number.isFinite(room.height) || room.height < 2.4 || room.height > 6) {
              fail("HEIGHT must be 2.4–6 metres", line);
            }
          } else {
            const choices =
              key === "surface"
                ? ["auto", "wood", "tile", "stone", "grass", "terracotta", "concrete"]
                : ["warm", "blue", "neutral", "liminal", "industrial", "aquatic", "mediterranean"];
            if (!choices.includes(value)) {
              fail(`Invalid ${key}`, line);
            }
            room[key] = value;
          }
        } else if (
          (m = /^LIGHT\s+(\w+)\s+AT\s+(\d+),(\d+)(?:\s+POWER\s+([\d.]+))?$/iu.exec(text))
        ) {
          if (!room) {
            fail("Define a room first", line);
          }
          const power = m[4] === undefined ? 18 : Number(m[4]);
          if (
            !Object.hasOwn(catalog, m[1].toLowerCase()) ||
            !fixtureNames.has(m[1].toLowerCase()) ||
            m[1].toLowerCase() === "wall_lamp" ||
            Number(m[2]) >= room.cols ||
            Number(m[3]) >= room.rows ||
            !Number.isFinite(power) ||
            power < 0 ||
            power > 200 ||
            room.lights.length >= 16
          ) {
            fail("LIGHT needs a fixture inside the room, POWER 0–200, at most 16 per room", line);
          }
          room.lights.push({
            line,
            name: m[1].toLowerCase(),
            power,
            x: Number(m[2]),
            z: Number(m[3]),
          });
        } else if (
          (m = /^MOUNT\s+(north|east|south|west)\s+(\d+)\s+(\w+)(?:<([^<>]+)>)?$/iu.exec(text))
        ) {
          if (!room || !mountNames.has(m[3].toLowerCase())) {
            fail("MOUNT needs a room and a wall decoration, wall_lamp or air_conditioner", line);
          }
          room.mounts.push({
            cell: Number(m[2]),
            line,
            name: m[3].toLowerCase(),
            side: m[1].toLowerCase(),
            url: productUrl(m[4], line),
          });
        } else if ((m = /^WALL_THICKNESS\s+([\d.]+)\s+([\d.]+)$/iu.exec(text))) {
          const values = [Number(m[1]), Number(m[2])];
          if (values.some((v) => !Number.isFinite(v) || v < 0.06 || v > 0.6)) {
            fail("Wall thickness must be 0.06–0.6 metres", line);
          }
          [program.exteriorWallThickness, program.interiorWallThickness] = values;
        } else if ((m = /^(SITE|FACADE|ROOF)\s+(\w+)(?:\s+([\d.]+))?$/iu.exec(text))) {
          const key = m[1].toLowerCase(),
            value = m[2].toLowerCase(),
            choices = {
              facade: ["none", "plaster", "brick", "timber", "concrete"],
              roof: ["none", "flat", "pitched", "terracotta"],
              site: ["none", "grass", "paving", "sand"],
            };
          if (!choices[key].includes(value) || (key !== "site" && m[3])) {
            fail(`Invalid ${key} setting`, line);
          }
          program[key] = value;
          if (m[3]) {
            program.margin = Number(m[3]);
            if (!Number.isFinite(program.margin) || program.margin < 1 || program.margin > 30) {
              fail("Site margin must be 1–30 metres", line);
            }
          }
        } else {
          fail(`Unknown statement “${text}”`, line);
        }
      }
      if (active) {
        fail(`LAYOUT ${active} needs END`, lines.length);
      }
      if (program.rooms.length === 0) {
        fail("Add a ROOM and its LAYOUT", 1);
      }
      const minX = Math.min(...program.rooms.map((r) => r.x)),
        minZ = Math.min(...program.rooms.map((r) => r.z));
      program.cols = Math.max(...program.rooms.map((r) => r.x + r.cols)) - minX;
      program.rows = Math.max(...program.rooms.map((r) => r.z + r.rows)) - minZ;
      if (program.cols > 40 || program.rows > 40) {
        fail("The floor plan must fit within 40×40 cells", 1);
      }
      program.center = [
        (minX + program.cols / 2) * program.grid,
        (minZ + program.rows / 2) * program.grid,
      ];
      program.floors = [...new Set(program.rooms.map((r) => r.floor))].toSorted((a, b) => a - b);
      for (const r of program.rooms) {
        const rows = program.layouts[r.name];
        if (!rows?.length) {
          fail(`Add LAYOUT ${r.name}`, r.line);
        }
        if (rows.length > r.rows || rows.some((row) => row.length > r.cols)) {
          fail(`Layout exceeds ${r.cols}×${r.rows} cells`, r.line);
        }
        for (const dir of [...r.doors, ...r.windows]) {
          if (!r.walls.includes(dir)) {
            fail(`${dir} opening needs a wall`, r.line);
          }
        }
        if (r.windows.some((dir) => r.doors.includes(dir))) {
          fail("A wall cannot have both WINDOWS and DOORS", r.line);
        }
        for (const mount of r.mounts) {
          if (
            !r.walls.includes(mount.side) ||
            mount.cell >= (["east", "west"].includes(mount.side) ? r.rows : r.cols)
          ) {
            fail("MOUNT needs an existing wall and a cell inside the room", mount.line);
          }
        }
        rows.forEach((row, z) =>
          row.forEach((token, x) => {
            if (token) {
              furniturePosition(program, r, token, x, z);
            }
          }),
        );
        for (const other of program.rooms) {
          if (
            other !== r &&
            r.x < other.x + other.cols &&
            r.x + r.cols > other.x &&
            r.z < other.z + other.rows &&
            r.z + r.rows > other.z &&
            r.elevation < other.elevation + other.height &&
            r.elevation + r.height > other.elevation
          ) {
            fail(`Rooms ${r.name} and ${other.name} overlap`, other.line);
          }
        }
      }
      const sizes = new Map(),
        lightCounts = new Map(),
        visit = (name, path = []) => {
          if (path.includes(name)) {
            fail("Sub-layouts cannot contain cycles", 1);
          }
          if (path.length > 4) {
            fail("Sub-layouts can be nested at most four levels", 1);
          }
          let count = 0,
            lights = 0;
          for (const row of program.layouts[name]) {
            for (const token of row) {
              if (!token) {
                continue;
              }
              count += 1;
              if (fixtureNames.has(token.name)) {
                lights += 1;
              }
              if (token.child) {
                if (!program.layouts[token.child]) {
                  fail(`Missing LAYOUT ${token.child}`, token.line);
                }
                count += visit(token.child, [...path, name]);
                lights += lightCounts.get(token.child);
              }
              if (count > 1024) {
                fail("A design supports at most 1,024 expanded furniture instances", token.line);
              }
            }
          }
          sizes.set(name, count);
          lightCounts.set(name, lights);
          return count;
        };
      for (const name of Object.keys(program.layouts)) {
        visit(name);
      }
      let fixtureCount = 0,
        instanceCount = 0;
      for (const r of program.rooms) {
        fixtureCount +=
          lightCounts.get(r.name) +
          r.lights.length +
          r.mounts.filter((mount) => fixtureNames.has(mount.name)).length;
        if (fixtureCount > 64) {
          fail("A design supports at most 64 light fixtures", r.line);
        }
        instanceCount += sizes.get(r.name) + r.mounts.length + r.lights.length;
        if (instanceCount > 1024) {
          fail("A design supports at most 1,024 expanded furniture instances", r.line);
        }
        placementWarnings(program, r);
      }
      return program;
    }
    function furniturePosition(program, room, token, col, row) {
      let x = (col + 0.5) * program.grid,
        z = (row + 0.5) * program.grid;
      if (token.wall) {
        if (!room.walls.includes(token.wall)) {
          fail(`No supporting ${token.wall} wall`, token.line);
        }
        const vertical = ["east", "west"].includes(token.wall),
          positive = ["east", "south"].includes(token.wall),
          along = vertical ? z : x,
          length = (vertical ? room.rows : room.cols) * program.grid,
          across = (vertical ? room.cols : room.rows) * program.grid;
        if (
          along - token.dimensions[0] / 2 < 0.02 ||
          along + token.dimensions[0] / 2 > length - 0.02 ||
          token.dimensions[1] > across - 0.04
        ) {
          fail("Furniture does not fit along the wall", token.line);
        }
        const offset = positive
          ? across - token.dimensions[1] / 2 - 0.03
          : token.dimensions[1] / 2 + 0.03;
        if (vertical) {
          x = offset;
        } else {
          z = offset;
        }
      }
      return [
        room.x * program.grid + x - program.center[0],
        room.elevation,
        room.z * program.grid + z - program.center[1],
      ];
    }
    function placementWarnings(program, room) {
      const entries = [],
        warn = (text) => {
          if (program.warnings.length < 24) {
            program.warnings.push(text);
          }
        },
        left = room.x * program.grid - program.center[0],
        top = room.z * program.grid - program.center[1];
      program.layouts[room.name].forEach((row, z) =>
        row.forEach((token, x) => {
          if (
            !token ||
            /rug|mat|light|lamp|pendant|print|painting|mirror|curtain|throw|floor_drain|stone_path/u.test(
              token.name,
            )
          ) {
            return;
          }
          const [px, , pz] = furniturePosition(program, room, token, x, z),
            angle = (token.yaw * Math.PI) / 180,
            corners = [
              [-1, -1],
              [1, -1],
              [1, 1],
              [-1, 1],
            ].map(([a, b]) => {
              const u = (a * token.dimensions[0]) / 2,
                v = (b * token.dimensions[1]) / 2;
              return [
                px + u * Math.cos(angle) + v * Math.sin(angle),
                pz + v * Math.cos(angle) - u * Math.sin(angle),
              ];
            });
          if (
            corners.some(
              ([a, b]) =>
                a < left - 0.02 ||
                a > left + room.cols * program.grid + 0.02 ||
                b < top - 0.02 ||
                b > top + room.rows * program.grid + 0.02,
            )
          ) {
            warn(`Line ${token.line}: ${token.name} extends beyond ${room.name}.`);
          }
          const entry = { corners, token };
          for (const other of entries) {
            const axes = [
                angle,
                angle + Math.PI / 2,
                (other.token.yaw * Math.PI) / 180,
                (other.token.yaw * Math.PI) / 180 + Math.PI / 2,
              ],
              overlap = axes.every((axis) => {
                const project = (points) =>
                    points.map(([a, b]) => a * Math.cos(axis) - b * Math.sin(axis)),
                  a = project(corners),
                  b = project(other.corners);
                return (
                  Math.min(Math.max(...a), Math.max(...b)) -
                    Math.max(Math.min(...a), Math.min(...b)) >
                  0.025
                );
              });
            if (overlap) {
              warn(
                `Line ${token.line}: ${token.name} overlaps ${other.token.name} in ${room.name}.`,
              );
            }
          }
          entries.push(entry);
        }),
      );
    }
    return {
      LayoutError,
      catalog,
      examples,
      fixtureNames,
      furniturePosition,
      parseProgram,
      parseToken,
      productUrl,
    };
  };
const { catalog, examples, fixtureNames, parseProgram, furniturePosition } = createLayoutCore();
const initializeStudio = async function initializeStudio() {
  const [
    THREE,
    { RoundedBoxGeometry },
    { pass, vec4, reflector },
    { ao },
    { denoise },
    { fxaa },
    { OrbitControls },
    { RoomEnvironment },
    { default: SunCalc },
    { EditorState },
    { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine },
    { history, defaultKeymap, historyKeymap, indentWithTab, undo, redo },
    { foldService, foldGutter, foldAll, unfoldAll, foldedRanges },
  ] = await Promise.all([
    import("three/webgpu"),
    import("three/addons/geometries/RoundedBoxGeometry.js"),
    import("three/tsl"),
    import("three/addons/tsl/display/GTAONode.js"),
    import("three/addons/tsl/display/DenoiseNode.js"),
    import("three/addons/tsl/display/FXAANode.js"),
    import("three/addons/controls/OrbitControls.js"),
    import("three/addons/environments/RoomEnvironment.js"),
    import("suncalc"),
    import("@codemirror/state"),
    import("@codemirror/view"),
    import("@codemirror/commands"),
    import("@codemirror/language"),
  ]);
  class AssetLibrary {
    constructor(renderer) {
      this.geometries = new Map();
      this.textures = [];
      const texture = (kind) => {
          const canvas = document.createElement("canvas");
          canvas.height = 256;
          canvas.width = canvas.height;
          const context = canvas.getContext("2d"),
            pixels = context.createImageData(256, 256);
          let seed = 418;
          for (let y = 0; y < 256; y += 1) {
            for (let x = 0; x < 256; x += 1) {
              seed = (Math.imul(seed, 1_664_525) + 1_013_904_223 + 4_294_967_296) % 4_294_967_296;
              const noise = seed / 4_294_967_296;
              const value =
                kind === "wood"
                  ? 208 + 18 * Math.sin(y * 0.48 + Math.sin(x * 0.024) * 3) + 11 * noise
                  : kind === "fabric"
                    ? 215 + 14 * Math.sin(x * Math.PI) + 14 * Math.cos(y * Math.PI) + 12 * noise
                    : 225 + 25 * noise;
              const i = (y * 256 + x) * 4;
              pixels.data[i + 2] = value;
              pixels.data[i + 1] = pixels.data[i + 2];
              pixels.data[i] = pixels.data[i + 1];
              pixels.data[i + 3] = 255;
            }
          }
          context.putImageData(pixels, 0, 0);
          const map = new THREE.CanvasTexture(canvas);
          map.wrapT = THREE.RepeatWrapping;
          map.wrapS = map.wrapT;
          map.anisotropy = Math.min(8, renderer.getMaxAnisotropy());
          this.textures.push(map);
          return map;
        },
        woodMap = texture("wood"),
        weave = texture("fabric"),
        plaster = texture("plaster"),
        physical = (color, options = {}) =>
          new THREE.MeshPhysicalNodeMaterial({ color, roughness: 0.7, ...options });
      this.material = {
        accent: physical("#b56e46", { map: weave, sheen: 0.5 }),
        brass: physical("#b69b60", { metalness: 0.85, roughness: 0.26 }),
        ceramic: physical("#eee7d9", { clearcoat: 0.6, clearcoatRoughness: 0.2, roughness: 0.23 }),
        clay: physical("#ad6549", { roughness: 0.78 }),
        concrete: physical("#a5a59b", { map: plaster, roughness: 0.92 }),
        darkWood: physical("#62503e", { map: woodMap, roughness: 0.48 }),
        fabric: physical("#84968b", {
          bumpMap: weave,
          bumpScale: 0.007,
          map: weave,
          sheen: 0.7,
          sheenColor: new THREE.Color("#b8c6ba"),
          sheenRoughness: 0.8,
        }),
        glass: physical("#d0e0dc", {
          depthWrite: false,
          metalness: 0.15,
          opacity: 0.18,
          roughness: 0.06,
          transparent: true,
        }),
        glow: physical("#fff2d8", { emissive: "#ffdfad", emissiveIntensity: 1.5, roughness: 0.5 }),
        grass: physical("#8a946d", { map: plaster, roughness: 1 }),
        leaf: physical("#435941", { roughness: 0.82, side: THREE.DoubleSide }),
        leafLight: physical("#738261", { roughness: 0.85, side: THREE.DoubleSide }),
        linen: physical("#e6ddcc", { bumpMap: weave, bumpScale: 0.008, map: weave, sheen: 0.6 }),
        metal: physical("#515855", { metalness: 0.85, roughness: 0.27 }),
        mirror: physical("#fafafa", { metalness: 1, roughness: 0.015 }),
        rug: physical("#c2b496", { bumpMap: weave, bumpScale: 0.015, map: weave }),
        screen: physical("#13242a", { metalness: 0.35, roughness: 0.17 }),
        soil: physical("#45362a"),
        stone: physical("#c5beb0", {
          bumpMap: plaster,
          bumpScale: 0.006,
          map: plaster,
          roughness: 0.5,
        }),
        terracotta: physical("#b27b5e", { roughness: 0.8 }),
        tile: physical("#d5d1c7", { clearcoat: 0.3, roughness: 0.24 }),
        wall: physical("#ebe4d9", {
          bumpMap: plaster,
          bumpScale: 0.012,
          map: plaster,
          roughness: 0.94,
        }),
        white: physical("#f2efe7", { clearcoat: 0.25, roughness: 0.42 }),
        wood: physical("#b58a59", {
          bumpMap: woodMap,
          bumpScale: 0.018,
          map: woodMap,
          roughness: 0.45,
        }),
      };
    }
    geometry(key, make) {
      if (!this.geometries.has(key)) {
        this.geometries.set(key, make());
      }
      return this.geometries.get(key);
    }
    static mesh(parent, geometry, material, position = [0, 0, 0]) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.receiveShadow = true;
      mesh.castShadow = mesh.receiveShadow;
      parent.add(mesh);
      return mesh;
    }
    box(parent, w, h, d, x, y, z, material = this.material.wood, round = 0) {
      const key = `box:${w}:${h}:${d}:${round}`;
      return AssetLibrary.mesh(
        parent,
        this.geometry(key, () =>
          round
            ? new RoundedBoxGeometry(w, h, d, 2, Math.min(round, w / 3, h / 3, d / 3))
            : new THREE.BoxGeometry(w, h, d),
        ),
        material,
        [x, y, z],
      );
    }
    cylinder(parent, r1, r2, h, x, y, z, material = this.material.wood) {
      return AssetLibrary.mesh(
        parent,
        this.geometry(`cylinder:${r1}:${r2}:${h}`, () => new THREE.CylinderGeometry(r1, r2, h, 32)),
        material,
        [x, y, z],
      );
    }
    sphere(parent, x, y, z, sx, sy, sz, material) {
      const mesh = AssetLibrary.mesh(
        parent,
        this.geometry("sphere", () => new THREE.SphereGeometry(1, 24, 16)),
        material,
        [x, y, z],
      );
      mesh.scale.set(sx, sy, sz);
      return mesh;
    }
    rod(parent, start, end, r, material) {
      const a = new THREE.Vector3(...start),
        b = new THREE.Vector3(...end),
        length = a.distanceTo(b),
        mesh = this.cylinder(
          parent,
          r,
          r,
          length,
          ...a.clone().add(b).multiplyScalar(0.5).toArray(),
          material,
        );
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
      return mesh;
    }
    create(name) {
      const group = new THREE.Group(),
        m = this.material,
        [w, d, h] = catalog[name],
        box = (a, b, c, x, y, z, mat = m.wood, r = 0.012) =>
          this.box(group, a, b, c, x, y, z, mat, r),
        cyl = (a, b, c, x, y, z, mat = m.wood) => this.cylinder(group, a, b, c, x, y, z, mat),
        legs = (height, inset = 0.08, radius = 0.025) => {
          for (const x of [-1, 1]) {
            for (const z of [-1, 1]) {
              cyl(
                radius,
                radius * 1.15,
                height,
                x * (w / 2 - inset),
                height / 2,
                z * (d / 2 - inset),
                m.darkWood,
              );
            }
          }
        },
        table = () => {
          legs(h - 0.06);
          if (/round|bistro|slatted|sea_table|ochre_table/u.test(name)) {
            cyl(w / 2, w / 2, 0.055, 0, h - 0.028, 0);
          } else {
            box(w, 0.055, d, 0, h - 0.028, 0, m.wood, 0.02);
          }
        };
      if (
        /sofa|armchair|accent_chair|woven_chair|pouf|ottoman|linen_bench|bench/u.test(name) &&
        !/gym/u.test(name)
      ) {
        legs(0.15);
        box(w, 0.19, d, 0, 0.21, 0, m.darkWood);
        const back = !/bench|pouf|ottoman/u.test(name);
        box(w - 0.04, h * 0.35, d - 0.04, 0, h * 0.4, 0, m.fabric, 0.055);
        const count = Math.max(1, Math.round(w / 0.8));
        for (let i = 0; i < count; i += 1) {
          box(
            (w - 0.12) / count - 0.018,
            0.13,
            d - 0.08,
            ((i - (count - 1) / 2) * (w - 0.12)) / count,
            h * 0.54,
            0,
            m.fabric,
            0.045,
          );
        }
        if (back) {
          box(w - 0.02, h * 0.53, 0.18, 0, h * 0.71, -d / 2 + 0.1, m.fabric, 0.06).rotation.x =
            -0.08;
          for (const s of [-1, 1]) {
            box(0.13, h * 0.42, d, s * (w / 2 - 0.07), h * 0.6, 0, m.fabric, 0.04);
          }
          for (const s of [-1, 1]) {
            const pillow = box(
              Math.min(0.34, w * 0.23),
              0.32,
              0.12,
              s * w * 0.28,
              h * 0.73,
              -d * 0.23,
              s < 0 ? m.linen : m.accent,
              0.045,
            );
            pillow.rotation.set(-0.2, s * 0.15, s * 0.12);
          }
        }
      } else if (/bed|sleeping_loft/u.test(name)) {
        legs(0.12);
        box(w, 0.2, d, 0, 0.21, 0, m.darkWood, 0.035);
        box(
          w + 0.03,
          Math.max(0.65, h),
          0.12,
          0,
          Math.max(0.65, h) / 2,
          -d / 2 + 0.02,
          m.fabric,
          0.045,
        );
        box(w - 0.05, 0.2, d - 0.08, 0, 0.4, 0, m.linen, 0.055);
        box(w - 0.03, 0.045, d * 0.66, 0, 0.515, d * 0.15, m.linen, 0.014);
        box(w + 0.01, 0.09, d * 0.24, 0, 0.535, d * 0.28, m.fabric, 0.022);
        for (const s of [-1, 1]) {
          box(w * 0.4, 0.14, d * 0.22, s * w * 0.23, 0.57, -d * 0.28, m.linen, 0.045);
        }
        if (/canopy/u.test(name)) {
          for (const s of [-1, 1]) {
            for (const t of [-1, 1]) {
              cyl(0.02, 0.02, h, s * w * 0.48, h / 2, t * d * 0.48, m.darkWood);
            }
          }
        }
      } else if (/chair|stool/u.test(name)) {
        const seat = Math.min(0.46, h * 0.65);
        legs(seat, 0.055, 0.018);
        box(w, 0.055, d, 0, seat, 0, m.wood, 0.025);
        if (!/stool/u.test(name)) {
          for (const s of [-1, 1]) {
            this.rod(
              group,
              [s * w * 0.39, seat, -d * 0.38],
              [s * w * 0.4, h - 0.04, -d * 0.43],
              0.017,
              m.wood,
            );
          }
          box(w, 0.15, 0.06, 0, h - 0.09, -d * 0.4, m.wood, 0.025);
          for (let i = -2; i <= 2; i += 1) {
            this.rod(
              group,
              [i * w * 0.13, seat + 0.02, -d * 0.4],
              [i * w * 0.13, h - 0.15, -d * 0.4],
              0.009,
              m.wood,
            );
          }
        }
      } else if (/table|desk|breakfast_bar/u.test(name) && !/lamp/u.test(name)) {
        table();
        if (/desk/u.test(name)) {
          box(w * 0.35, 0.09, d * 0.8, w * 0.26, h - 0.11, 0, m.darkWood);
          box(0.1, 0.01, 0.014, w * 0.26, h - 0.11, d * 0.41, m.brass);
        }
      } else if (/rug|mat|linen_throw/u.test(name)) {
        box(w, Math.max(0.012, h), d, 0, h / 2, 0, m.rug, 0.003);
        for (const s of [-1, 1]) {
          for (let i = 0; i < Math.min(45, w * 24); i += 1) {
            box(
              0.005,
              0.004,
              0.05,
              -w / 2 + 0.025 + i * 0.04,
              h + 0.002,
              s * (d / 2 + 0.02),
              m.linen,
              0,
            );
          }
        }
      } else if (/plant|tree|palm|cypress|bougainvillea|flower|hedge|topiary|trellis/u.test(name)) {
        const potHeight = h * 0.28,
          radius = Math.min(w, d) * 0.28;
        cyl(radius * 0.95, radius * 0.7, potHeight, 0, potHeight / 2, 0, m.clay);
        cyl(radius * 0.99, radius * 0.99, 0.028, 0, potHeight, 0, m.soil);
        const leafGeo = this.geometry("leaf", () => {
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.bezierCurveTo(0.2, 0.1, 0.22, 0.45, 0, 0.66);
          shape.bezierCurveTo(-0.2, 0.4, -0.16, 0.1, 0, 0);
          return new THREE.ShapeGeometry(shape, 8);
        });
        for (let i = 0; i < 19; i += 1) {
          const angle = i * 2.399,
            level = i / 19,
            start = [0, potHeight, 0],
            end = [
              Math.cos(angle) * w * 0.3 * (1 - level * 0.4),
              potHeight + (h - potHeight) * (0.45 + level * 0.5),
              Math.sin(angle) * d * 0.3 * (1 - level * 0.4),
            ];
          this.rod(group, start, end, 0.006, m.leaf);
          const leaf = AssetLibrary.mesh(group, leafGeo, i % 3 ? m.leaf : m.leafLight, end);
          leaf.rotation.set(-0.6 + level * 0.7, angle, 0.45);
          leaf.scale.set(w * 0.55, h * 0.48, 1);
        }
      } else if (/counter|island|kitchenette|outdoor_kitchen|sink|vanity|stove/u.test(name)) {
        const base = Math.min(0.88, h);
        box(w - 0.04, base - 0.09, d - 0.04, 0, base / 2, 0, m.white, 0.006);
        box(w, 0.045, d, 0, base, 0, m.stone, 0.012);
        const count = Math.max(1, Math.round(w / 0.5));
        for (let i = 0; i < count; i += 1) {
          const x = ((i - (count - 1) / 2) * w) / count;
          box(w / count - 0.025, base - 0.16, 0.028, x, base / 2, d / 2, m.wood, 0.008);
          box((w / count) * 0.35, 0.012, 0.022, x, base - 0.15, d / 2 + 0.024, m.brass);
        }
        if (/sink|vanity|kitchenette/u.test(name)) {
          box(w * 0.38, 0.012, d * 0.52, -w * 0.2, base + 0.03, 0, m.metal, 0.03);
          this.rod(
            group,
            [-w * 0.2, base, -d * 0.25],
            [-w * 0.2, base + 0.25, -d * 0.25],
            0.016,
            m.brass,
          );
          this.rod(
            group,
            [-w * 0.2, base + 0.25, -d * 0.25],
            [-w * 0.2, base + 0.25, 0],
            0.016,
            m.brass,
          );
        }
        if (/stove|kitchenette/u.test(name)) {
          box(w * 0.36, 0.018, d * 0.65, w * 0.24, base + 0.029, 0, m.screen);
          for (const s of [-1, 1]) {
            for (const t of [-1, 1]) {
              cyl(0.065, 0.065, 0.01, w * 0.24 + s * w * 0.09, base + 0.045, t * d * 0.17, m.metal);
            }
          }
        }
        if (/kitchenette/u.test(name)) {
          box(w, h - base - 0.4, 0.32, 0, (h + base + 0.4) / 2, -d / 2 + 0.16, m.white);
          for (let i = 0; i < count; i += 1) {
            box(
              w / count - 0.018,
              h - base - 0.42,
              0.018,
              ((i - (count - 1) / 2) * w) / count,
              (h + base + 0.4) / 2,
              -d / 2 + 0.33,
              m.wood,
            );
          }
        }
      } else if (
        /wardrobe|dresser|sideboard|nightstand|bookshelf|rack|cabinet|console|tv_stand|shoe_rack/u.test(
          name,
        )
      ) {
        legs(0.1);
        box(w, h - 0.12, d, 0, (h + 0.12) / 2, 0, m.wood, 0.012);
        if (/bookshelf|rack/u.test(name)) {
          box(w - 0.09, h - 0.12, 0.018, 0, (h + 0.12) / 2, d / 2 + 0.005, m.darkWood);
          for (let y = 0.24; y < h - 0.1; y += 0.38) {
            box(w - 0.05, 0.035, d + 0.02, 0, y, 0, m.wood);
            for (let i = 0; i < Math.floor(w / 0.13); i += 1) {
              box(
                0.05,
                0.18 + (i % 3) * 0.032,
                d * 0.48,
                -w / 2 + 0.09 + i * 0.11,
                y + 0.13,
                0,
                [m.linen, m.fabric, m.accent][i % 3],
              );
            }
          }
        } else {
          const count = /dresser|nightstand/u.test(name) ? 3 : 2;
          for (let i = 0; i < count; i += 1) {
            const drawer = /dresser|nightstand/u.test(name),
              x = drawer ? 0 : ((i - 0.5) * w) / 2,
              y = drawer ? 0.12 + ((i + 0.5) * (h - 0.12)) / count : (h + 0.12) / 2;
            box(
              drawer ? w - 0.04 : w / 2 - 0.025,
              drawer ? (h - 0.12) / count - 0.02 : h - 0.16,
              0.024,
              x,
              y,
              d / 2 + 0.005,
              m.wood,
              0.004,
            );
            box(0.12, 0.012, 0.023, x, drawer ? y : y + 0.05, d / 2 + 0.025, m.brass);
          }
        }
      } else if (/fridge|washer|washing|vending|server|ac_condenser|air_conditioner/u.test(name)) {
        box(w, h, d, 0, h / 2, 0, m.white, 0.035);
        box(w - 0.04, h * 0.7, 0.025, 0, h * 0.61, d / 2 + 0.005, m.white, 0.012);
        if (/washing/u.test(name)) {
          const ring = cyl(w * 0.31, w * 0.31, 0.028, 0, h * 0.47, d / 2 + 0.025, m.metal);
          ring.rotation.x = Math.PI / 2;
          const glass = cyl(w * 0.26, w * 0.26, 0.03, 0, h * 0.47, d / 2 + 0.043, m.screen);
          glass.rotation.x = Math.PI / 2;
        } else {
          box(0.024, h * 0.3, 0.035, w * 0.34, h * 0.6, d / 2 + 0.035, m.metal);
        }
      } else if (/light|lamp|pendant|lantern/u.test(name)) {
        const ceiling = /ceiling|pendant|downlight|fluorescent|track/u.test(name);
        if (ceiling) {
          cyl(0.04, 0.04, 0.035, 0, h - 0.02, 0, m.brass);
          cyl(0.006, 0.006, 0.28, 0, h - 0.16, 0, m.metal);
          cyl(w * 0.22, w * 0.5, 0.17, 0, h - 0.38, 0, m.white);
          cyl(w * 0.43, w * 0.43, 0.015, 0, h - 0.47, 0, m.glow);
        } else {
          cyl(w * 0.25, w * 0.32, 0.035, 0, 0.025, 0, m.brass);
          cyl(0.015, 0.015, h * 0.7, 0, h * 0.36, 0, m.brass);
          cyl(w * 0.25, w * 0.5, h * 0.25, 0, h * 0.82, 0, m.linen);
          cyl(w * 0.42, w * 0.42, 0.02, 0, h * 0.7, 0, m.glow);
        }
      } else if (/shower/u.test(name)) {
        box(w, 0.075, d, 0, 0.037, 0, m.ceramic, 0.025);
        box(w, h, 0.018, 0, h / 2, -d / 2, m.glass, 0);
        box(0.018, h, d, w / 2, h / 2, 0, m.glass, 0);
        for (const x of [-w / 2, w / 2]) {
          box(0.015, h, 0.02, x, h / 2, -d / 2, m.brass, 0);
        }
        this.rod(group, [0, 0.4, -d / 2 + 0.05], [0, h * 0.86, -d / 2 + 0.05], 0.017, m.brass);
        this.rod(group, [0, h * 0.86, -d / 2 + 0.05], [0, h * 0.86, 0], 0.017, m.brass);
        cyl(0.12, 0.12, 0.018, 0, h * 0.86, 0, m.brass);
      } else if (/toilet/u.test(name)) {
        this.sphere(group, 0, h * 0.3, 0.03, w * 0.42, h * 0.28, d * 0.42, m.ceramic);
        cyl(w * 0.29, w * 0.36, h * 0.38, 0, h * 0.19, -d * 0.08, m.ceramic);
        box(w * 0.84, h * 0.53, d * 0.23, 0, h * 0.73, -d * 0.33, m.ceramic, 0.05);
        const seat = this.sphere(group, 0, h * 0.55, d * 0.1, w * 0.46, 0.025, d * 0.34, m.white);
        if (/open/u.test(name)) {
          seat.rotation.x = 1.2;
        }
      } else if (/bathtub|hot_tub|pool|fountain/u.test(name)) {
        box(w, h, d, 0, h / 2, 0, m.ceramic, 0.05);
        box(w - 0.12, 0.012, d - 0.12, 0, h + 0.01, 0, m.glass, 0.04);
        for (const s of [-1, 1]) {
          box(w, 0.06, 0.09, 0, h, s * (d / 2 - 0.045), m.ceramic);
          box(0.09, 0.06, d, s * (w / 2 - 0.045), h, 0, m.ceramic);
        }
      } else if (/mirror|painting|print|tv|monitor|wall_outlet|wall_coat/u.test(name)) {
        box(w, h, d, 0, h / 2, 0, m.darkWood, 0.008);
        box(
          w - 0.04,
          h - 0.04,
          0.009,
          0,
          h / 2,
          d / 2 + 0.005,
          /mirror/u.test(name) ? m.mirror : /tv|monitor/u.test(name) ? m.screen : m.linen,
          0.002,
        );
        if (/print|painting/u.test(name)) {
          this.sphere(group, w * 0.1, h * 0.55, d / 2 + 0.011, w * 0.25, h * 0.28, 0.001, m.accent);
          box(w * 0.65, 0.05, 0.006, -w * 0.06, h * 0.24, d / 2 + 0.012, m.fabric);
        }
      } else if (/stairs|garden_steps/u.test(name)) {
        const count = 12;
        for (let i = 0; i < count; i += 1) {
          box(
            w,
            (h / count) * (i + 1),
            d / count,
            0,
            ((h / count) * (i + 1)) / 2,
            -d / 2 + ((i + 0.5) * d) / count,
            m.wood,
            0,
          );
        }
        for (const s of [-1, 1]) {
          this.rod(
            group,
            [s * w * 0.48, 0.85, -d / 2],
            [s * w * 0.48, h + 0.85, d / 2],
            0.025,
            m.metal,
          );
          for (let i = 0; i < 4; i += 1) {
            this.rod(
              group,
              [s * w * 0.48, (h * i) / 3, -d / 2 + (d * i) / 3],
              [s * w * 0.48, 0.85 + (h * i) / 3, -d / 2 + (d * i) / 3],
              0.012,
              m.metal,
            );
          }
        }
      } else if (/curtain|blind|shutter/u.test(name)) {
        for (let i = 0; i < 18; i += 1) {
          box(
            (w / 18) * 0.9,
            h,
            d * (i % 2 ? 0.8 : 1),
            -w / 2 + ((i + 0.5) * w) / 18,
            h / 2,
            0,
            m.linen,
            0.008,
          );
        }
      } else if (/book/u.test(name)) {
        box(w, h, d, 0, h / 2, 0, m.accent, 0.002);
        box(w - 0.01, h * 0.7, d - 0.01, 0, h / 2, 0, m.linen, 0);
      } else if (/pillow|bolster|towel/u.test(name)) {
        box(w, h, d, 0, h / 2, 0, m.linen, 0.04);
      } else if (/pot|urn|vessel|basket|mug|bowl/u.test(name)) {
        cyl(w * 0.3, w * 0.4, h, 0, h / 2, 0, /basket/u.test(name) ? m.rug : m.clay);
        cyl(w * 0.27, w * 0.27, 0.005, 0, h + 0.003, 0, m.soil);
      } else {
        box(w, h, d, 0, h / 2, 0, m.stone, 0.02);
        for (const s of [-1, 1]) {
          box(w * 0.88, 0.015, d + 0.005, 0, h * (s > 0 ? 0.7 : 0.3), 0, m.darkWood, 0.003);
        }
      }
      const bounds = new THREE.Box3().setFromObject(group),
        size = bounds.getSize(new THREE.Vector3());
      group.scale.set(w / size.x, h / Math.max(bounds.max.y, 0.001), d / size.z);
      const model = new THREE.Group();
      model.add(group);
      model.name = name;
      return model;
    }
    dispose() {
      for (const g of this.geometries.values()) {
        g.dispose();
      }
      for (const m of Object.values(this.material)) {
        m.dispose();
      }
      for (const t of this.textures) {
        t.dispose();
      }
    }
  }
  const normals = { east: [1, 0, 0], north: [0, 0, -1], south: [0, 0, 1], west: [-1, 0, 0] },
    turns = { east: -Math.PI / 2, north: 0, south: Math.PI, west: Math.PI / 2 };
  function buildScene(program, library) {
    const root = new THREE.Group(),
      walls = [],
      ceilings = [],
      fixtures = [],
      objects = [],
      roomGroups = [],
      colliders = [],
      mirrors = [],
      owned = [],
      m = library.material,
      edgeMap = new Map(),
      box = (...args) => library.box(...args),
      addObject = (token, position, room, parent = root) => {
        const group = library.create(token.name),
          base = catalog[token.name];
        group.scale.set(
          token.dimensions[0] / base[0],
          token.dimensions[2] / base[2],
          token.dimensions[1] / base[1],
        );
        group.position.set(...position);
        group.rotation.y = THREE.MathUtils.degToRad(token.yaw);
        group.userData = { room, token };
        parent.add(group);
        objects.push(group);
        if (fixtureNames.has(token.name)) {
          const power = /wall/u.test(token.name) ? 6 : 15,
            fixture = new THREE.PointLight("#ffe1b2", power, 8, 2),
            height = /ceiling|pendant|downlight|track|fluorescent/u.test(token.name)
              ? base[2] - 0.5
              : base[2] * 0.75;
          fixture.position.set(0, height, base[1] * 0.05);
          fixture.userData.room = room;
          group.add(fixture);
          fixtures.push({ light: fixture, power });
        }
        if (
          !/rug|mat|lamp|light|pillow|book|towel|print|painting|mirror|curtain/u.test(token.name) &&
          parent === root
        ) {
          const bounds = new THREE.Box3().setFromObject(group);
          colliders.push({ bounds, group });
        }
        if (/mirror/u.test(token.name)) {
          mirrors.push(group);
        }
        if (token.child) {
          const layout = program.layouts[token.child],
            cols = Math.max(...layout.map((row) => row.length)),
            rows = layout.length;
          layout.forEach((row, z) =>
            row.forEach((child, x) => {
              if (child) {
                addObject(
                  child,
                  [
                    ((x + 0.5 - cols / 2) * base[0]) / cols,
                    base[2],
                    ((z + 0.5 - rows / 2) * base[1]) / rows,
                  ],
                  room,
                  group,
                );
              }
            }),
          );
        }
        return group;
      };
    for (const room of program.rooms) {
      const w = room.cols * program.grid,
        d = room.rows * program.grid,
        cx = (room.x + room.cols / 2) * program.grid - program.center[0],
        cz = (room.z + room.rows / 2) * program.grid - program.center[1],
        y = room.elevation,
        roomRoot = new THREE.Group();
      roomRoot.position.set(cx, y, cz);
      roomRoot.userData.room = room;
      root.add(roomRoot);
      roomGroups.push(roomRoot);
      box(roomRoot, w, 0.14, d, 0, -0.075, 0, m.stone, 0);
      const finish = room.surface === "auto" ? "wood" : room.surface;
      if (finish === "wood") {
        const plankLength = 1.2,
          plankWidth = 0.16,
          transforms = [],
          colors = [];
        for (let z = -d / 2; z < d / 2 - 0.001; z += plankWidth) {
          const row = Math.round((z + d / 2) / plankWidth),
            offset = (row % 3) * 0.4;
          for (let x = -w / 2 - offset; x < w / 2 - 0.001; x += plankLength) {
            const left = Math.max(x, -w / 2),
              right = Math.min(x + plankLength, w / 2),
              depth = Math.min(plankWidth, d / 2 - z),
              matrix = new THREE.Matrix4().compose(
                new THREE.Vector3((left + right) / 2, 0.003, z + depth / 2),
                new THREE.Quaternion(),
                new THREE.Vector3(right - left - 0.004, 0.012, depth - 0.003),
              );
            transforms.push(matrix);
            colors.push(
              new THREE.Color().setScalar(
                0.8 + ((((row * 13 + Math.round(x * 10)) % 7) + 7) % 7) * 0.035,
              ),
            );
          }
        }
        const floor = new THREE.InstancedMesh(
          library.geometry("unit-box", () => new THREE.BoxGeometry(1, 1, 1)),
          m.wood,
          transforms.length,
        );
        transforms.forEach((matrix, i) => {
          floor.setMatrixAt(i, matrix);
          floor.setColorAt(i, colors[i]);
        });
        owned.push(floor);
        floor.receiveShadow = true;
        roomRoot.add(floor);
      } else {
        const tileSize = finish === "tile" ? 0.6 : finish === "terracotta" ? 0.3 : 1.2;
        const material = m[finish] || m.stone;
        for (let x = -w / 2; x < w / 2 - 0.001; x += tileSize) {
          for (let z = -d / 2; z < d / 2 - 0.001; z += tileSize) {
            const width = Math.min(tileSize, w / 2 - x),
              depth = Math.min(tileSize, d / 2 - z);
            box(
              roomRoot,
              width - 0.004,
              0.014,
              depth - 0.004,
              x + width / 2,
              0.004,
              z + depth / 2,
              material,
              0,
            );
          }
        }
      }
      if (room.kind === "room") {
        const ceiling = box(roomRoot, w, 0.1, d, 0, room.height + 0.05, 0, m.white, 0);
        ceiling.userData.room = room;
        ceilings.push(ceiling);
        if (program.roof !== "none") {
          const roof = box(
            roomRoot,
            w + 0.2,
            0.12,
            d + 0.2,
            0,
            room.height + 0.16,
            0,
            program.roof === "terracotta" ? m.terracotta : m.concrete,
            0,
          );
          ceilings.push(roof);
          if (["pitched", "terracotta"].includes(program.roof)) {
            roof.visible = false;
            const rise = Math.min(w, d) * 0.22,
              geometry = new THREE.BufferGeometry(),
              vertices = [
                -w / 2,
                0,
                -d / 2,
                w / 2,
                0,
                -d / 2,
                0,
                rise,
                -d / 2,
                -w / 2,
                0,
                d / 2,
                0,
                rise,
                d / 2,
                w / 2,
                0,
                d / 2,
                -w / 2,
                0,
                -d / 2,
                0,
                rise,
                -d / 2,
                0,
                rise,
                d / 2,
                -w / 2,
                0,
                -d / 2,
                0,
                rise,
                d / 2,
                -w / 2,
                0,
                d / 2,
                w / 2,
                0,
                -d / 2,
                w / 2,
                0,
                d / 2,
                0,
                rise,
                d / 2,
                w / 2,
                0,
                -d / 2,
                0,
                rise,
                d / 2,
                0,
                rise,
                -d / 2,
              ];
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();
            owned.push(geometry);
            const pitched = AssetLibrary.mesh(
              roomRoot,
              geometry,
              program.roof === "terracotta" ? m.terracotta : m.concrete,
              [0, room.height + 0.12, 0],
            );
            ceilings.push(pitched);
          }
        }
      }
      for (const side of room.walls) {
        const vertical = ["east", "west"].includes(side),
          length = vertical ? d : w,
          pos = [
            cx + (side === "east" ? w / 2 : side === "west" ? -w / 2 : 0),
            y,
            cz + (side === "south" ? d / 2 : side === "north" ? -d / 2 : 0),
          ],
          key = [
            room.floor,
            vertical ? "x" : "z",
            ...[pos[0], pos[2], length].map((value) => value.toFixed(6)),
          ].join(":"),
          previous = edgeMap.get(key);
        if (previous) {
          previous.rooms.push(room);
          continue;
        }
        const wall = new THREE.Group();
        wall.position.set(...pos);
        wall.rotation.y = turns[side];
        wall.userData.room = room;
        const entry = {
          group: wall,
          length,
          normal: new THREE.Vector3(...normals[side]),
          position: new THREE.Vector3(...pos),
          room,
          rooms: [room],
          side,
        };
        edgeMap.set(key, entry);
        root.add(wall);
        walls.push(entry);
      }
      for (const side of room.rails) {
        const rail = new THREE.Group(),
          vertical = ["east", "west"].includes(side),
          length = vertical ? d : w;
        rail.position.set(
          side === "east" ? w / 2 : side === "west" ? -w / 2 : 0,
          0,
          side === "south" ? d / 2 : side === "north" ? -d / 2 : 0,
        );
        rail.rotation.y = turns[side];
        roomRoot.add(rail);
        box(rail, length, 0.045, 0.055, 0, 1.04, 0, m.darkWood);
        for (let x = -length / 2; x <= length / 2; x += 0.16) {
          box(rail, 0.016, 1, 0.016, x, 0.52, 0, m.metal, 0);
        }
      }
      program.layouts[room.name].forEach((row, z) =>
        row.forEach((token, x) => {
          if (token) {
            addObject(token, furniturePosition(program, room, token, x, z), room);
          }
        }),
      );
      for (const mount of room.mounts) {
        const [mw, md, mh] = catalog[mount.name],
          vertical = ["east", "west"].includes(mount.side),
          along = (mount.cell + 0.5) * program.grid,
          token = {
            ...mount,
            dimensions: [mw, md, mh],
            mount: true,
            yaw: { east: 270, north: 0, south: 180, west: 90 }[mount.side],
          },
          x = vertical
            ? mount.side === "east"
              ? w / 2 - md / 2 - 0.02
              : -w / 2 + md / 2 + 0.02
            : -w / 2 + along,
          z = vertical
            ? -d / 2 + along
            : mount.side === "south"
              ? d / 2 - md / 2 - 0.02
              : -d / 2 + md / 2 + 0.02;
        addObject(token, [cx + x, y + Math.max(0.3, 1.5 - mh / 2), cz + z], room);
      }
      for (const light of room.lights) {
        const group = library.create(light.name),
          { 2: fixtureHeight } = catalog[light.name];
        group.position.set(
          cx + (light.x + 0.5) * program.grid - w / 2,
          y + room.height - fixtureHeight,
          cz + (light.z + 0.5) * program.grid - d / 2,
        );
        group.userData.room = room;
        root.add(group);
        const point = new THREE.PointLight("#ffe1b2", light.power * 0.9, Math.max(w, d) * 2, 2);
        point.position.set(group.position.x, y + room.height - 0.55, group.position.z);
        point.userData.room = room;
        root.add(point);
        fixtures.push({ light: point, power: light.power * 0.9 });
      }
    }
    for (const entry of walls) {
      const { group, room, side, length } = entry,
        opposite = { east: "west", north: "south", south: "north", west: "east" }[side],
        shared = entry.rooms.length > 1,
        door =
          room.doors.includes(side) || entry.rooms.slice(1).some((r) => r.doors.includes(opposite)),
        window = !door && !shared && room.windows.includes(side),
        t = shared ? program.interiorWallThickness : program.exteriorWallThickness,
        { height } = room;
      const width = door ? Math.min(0.95, length * 0.65) : window ? Math.min(1.9, length * 0.6) : 0;
      const bottom = window ? 0.85 : 0,
        top = door ? Math.min(2.12, height - 0.12) : window ? Math.min(2.25, height - 0.16) : 0;
      const wallMat =
        room.style === "industrial"
          ? m.concrete
          : room.style === "blue" || room.style === "aquatic"
            ? m.fabric
            : m.wall;
      const facade =
          program.facade === "timber"
            ? m.wood
            : program.facade === "brick"
              ? m.terracotta
              : program.facade === "concrete"
                ? m.concrete
                : wallMat,
        wallBox = (w, h, x, y) => box(group, w, h, t, x, y, -t / 2, shared ? wallMat : facade, 0);
      if (width) {
        wallBox((length - width) / 2, height, -(length + width) / 4, height / 2);
        wallBox((length - width) / 2, height, (length + width) / 4, height / 2);
        wallBox(width, height - top, 0, (height + top) / 2);
        if (bottom) {
          wallBox(width, bottom, 0, bottom / 2);
        }
      } else {
        wallBox(length, height, 0, height / 2);
      }
      for (const sign of [-1, 1]) {
        const len = door ? (length - width) / 2 : length;
        if (door || sign < 0) {
          box(
            group,
            len,
            0.09,
            0.023,
            door ? (sign * (length + width)) / 4 : 0,
            0.045,
            0.013,
            m.white,
            0.003,
          );
        }
      }
      box(group, length, 0.07, 0.045, 0, height - 0.035, 0.025, m.white, 0.003);
      if (window) {
        const wh = top - bottom;
        box(group, width, wh, 0.012, 0, (bottom + top) / 2, -t / 2, m.glass, 0);
        for (const s of [-1, 1]) {
          box(
            group,
            0.045,
            wh + 0.08,
            0.1,
            s * (width / 2 + 0.022),
            (bottom + top) / 2,
            -t / 2,
            m.white,
            0.003,
          );
          box(group, width + 0.1, 0.045, 0.1, 0, s > 0 ? top : bottom, -t / 2, m.white, 0.003);
        }
        box(group, 0.035, wh, 0.055, 0, (top + bottom) / 2, -t / 2 + 0.022, m.white, 0.002);
        box(group, width + 0.18, 0.04, 0.24, 0, bottom - 0.02, 0.035, m.stone, 0.004);
        for (const s of [-1, 1]) {
          for (let i = 0; i < 7; i += 1) {
            box(
              group,
              0.052,
              height - 0.3,
              0.075,
              s * (width / 2 + 0.07) + i * 0.025 * s,
              (height - 0.3) / 2 + 0.1,
              0.12 + Math.sin(i * 1.6) * 0.03,
              m.linen,
              0.012,
            );
          }
        }
        library.rod(
          group,
          [-width / 2 - 0.34, height - 0.14, 0.14],
          [width / 2 + 0.34, height - 0.14, 0.14],
          0.012,
          m.brass,
        );
      }
      if (door) {
        for (const s of [-1, 1]) {
          box(
            group,
            0.065,
            top + 0.035,
            0.09,
            s * (width / 2 + 0.032),
            top / 2,
            0.025,
            m.white,
            0.003,
          );
        }
        box(group, width + 0.13, 0.065, 0.09, 0, top + 0.032, 0.025, m.white, 0.003);
      }
      entry.opening = width ? { bottom, top, width } : null;
      entry.thickness = t;
    }
    let terrain;
    if (program.site !== "none") {
      terrain = box(
        root,
        program.cols * program.grid + program.margin * 2,
        0.1,
        program.rows * program.grid + program.margin * 2,
        0,
        -0.22,
        0,
        program.site === "grass" ? m.grass : program.site === "sand" ? m.rug : m.stone,
        0.015,
      );
    }
    const ground = box(
      root,
      200,
      0.1,
      200,
      0,
      Math.min(-0.3, ...program.rooms.map((r) => r.elevation - 0.3)),
      0,
      m.stone,
      0,
    );
    ground.receiveShadow = true;
    const grid = new THREE.GridHelper(
      Math.max(program.cols, program.rows) * program.grid,
      Math.max(program.cols, program.rows),
      "#848c7e",
      "#bbbdb0",
    );
    grid.position.y = 0.025;
    grid.visible = false;
    root.add(grid);
    owned.push(grid.geometry, grid.material);
    return {
      ceilings,
      colliders,
      dispose() {
        for (const resource of owned) {
          resource.dispose();
        }
        root.clear();
      },
      fixtures,
      grid,
      mirrors,
      objects,
      program,
      roomGroups,
      root,
      terrain,
      walls,
    };
  }
  class InteriorRenderer {
    constructor(host, onError) {
      this.host = host;
      this.onError = onError;
      this.quality = "high";
      this.mode = "3d";
      this.effects = new Map();
      this.keys = new Set();
      this.reflectors = [];
      this.options = {
        ceilings: false,
        cutaway: false,
        floor: "",
        grid: false,
        lights: false,
        room: "",
        walls: false,
      };
      this.dirty = false;
      this.frame = 0;
      this.lastTime = 0;
      this.walkYaw = 0;
      this.walkPitch = 0;
      this.disposed = false;
    }
    async init() {
      this.renderer = new THREE.WebGPURenderer({
        alpha: false,
        antialias: true,
        forceWebGL: new URLSearchParams(location.search).get("backend") === "webgl",
      });
      await this.renderer.init();
      this.backend = this.renderer.backend.isWebGPUBackend ? "WebGPU" : "WebGL 2 fallback";
      this.renderer.backend.device?.addEventListener("uncapturederror", (event) =>
        this.onError(new Error(event.error.message)),
      );
      this.renderer.toneMapping = THREE.AgXToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.info.autoReset = false;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.onDeviceLost = (info) =>
        this.onError(
          new Error(`Graphics device lost: ${info.message || info.reason}. Reload to reconnect.`),
        );
      const canvas = this.renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute(
        "aria-label",
        "Interactive interior. Drag to orbit, scroll to zoom. In Walk, drag to look and use WASD to move.",
      );
      this.host.prepend(canvas);
      this.library = new AssetLibrary(this.renderer);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#e5e3db");
      this.perspective = new THREE.PerspectiveCamera(42, 1, 0.04, 300);
      this.orthographic = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.04, 300);
      this.camera = this.perspective;
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.12;
      this.controls.minDistance = 0.6;
      this.controls.maxDistance = 100;
      this.controls.maxPolarAngle = Math.PI * 0.49;
      this.controls.addEventListener("change", () => this.requestRender());
      this.controls.addEventListener("start", () => {
        this.moving = true;
        this.resize();
      });
      this.controls.addEventListener("end", () => {
        this.moving = false;
        this.resize();
      });
      this.skyLight = new THREE.HemisphereLight("#e8f0ff", "#c0a88a", 1.15);
      this.scene.add(this.skyLight);
      this.sun = new THREE.DirectionalLight("#fff0db", 3.2);
      this.sun.castShadow = true;
      this.sun.shadow.mapSize.set(2048, 2048);
      this.sun.shadow.bias = -0.0002;
      this.sun.shadow.normalBias = 0.025;
      this.sun.shadow.radius = 3;
      this.sun.shadow.intensity = 0.88;
      this.scene.add(this.sun, this.sun.target);
      const roomEnvironment = new RoomEnvironment(),
        generator = new THREE.PMREMGenerator(this.renderer);
      this.environment = generator.fromScene(roomEnvironment, 0.025);
      this.scene.environment = this.environment.texture;
      this.scene.environmentIntensity = 0.35;
      roomEnvironment.dispose();
      generator.dispose();
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.host);
      this.bindNavigation();
      this.resize();
    }
    bindNavigation() {
      const canvas = this.renderer.domElement;
      let pointer;
      canvas.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
          return;
        }
        canvas.focus({ preventScroll: true });
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
        if (this.mode === "walk") {
          canvas.setPointerCapture(event.pointerId);
        }
      });
      canvas.addEventListener("pointermove", (event) => {
        if (this.mode === "walk" && pointer?.id === event.pointerId && event.buttons) {
          this.walkYaw -= (event.clientX - pointer.x) * 0.004;
          this.walkPitch = THREE.MathUtils.clamp(
            this.walkPitch - (event.clientY - pointer.y) * 0.004,
            -1.35,
            1.35,
          );
          this.camera.rotation.set(this.walkPitch, this.walkYaw, 0, "YXZ");
          pointer.x = event.clientX;
          pointer.y = event.clientY;
          this.requestRender();
        }
      });
      const release = () => {
        pointer = undefined;
      };
      canvas.addEventListener("pointerup", release);
      canvas.addEventListener("pointercancel", release);
      canvas.addEventListener("keydown", (event) => {
        if (this.mode !== "walk") {
          return;
        }
        if (
          ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
            event.key.toLowerCase(),
          )
        ) {
          event.preventDefault();
          this.tour = undefined;
          this.keys.add(event.key.toLowerCase());
          this.requestRender();
        }
        if (event.key === "Escape") {
          this.keys.clear();
          this.setView("3d");
          this.onModeChange?.("3d");
        }
      });
      globalThis.addEventListener("keyup", (event) => this.keys.delete(event.key.toLowerCase()));
      window.addEventListener("blur", () => this.keys.clear());
      canvas.addEventListener("blur", () => this.keys.clear());
      document.addEventListener("visibilitychange", () => {
        this.keys.clear();
        if (!document.hidden) {
          this.requestRender();
        }
      });
    }
    setProgram(program, reset = false) {
      const next = buildScene(program, this.library),
        previous = this.model;
      this.tour = undefined;
      this.disposeReflections();
      this.model = next;
      this.scene.add(next.root);
      if (previous) {
        this.scene.remove(previous.root);
        previous.dispose();
      }
      this.setupReflections();
      if (!program.rooms.some((r) => r.name === this.options.room)) {
        this.options.room = "";
      }
      if (!program.floors.includes(Number(this.options.floor))) {
        this.options.floor = "";
      }
      const minY = Math.min(...program.rooms.map((room) => room.elevation)),
        maxY = Math.max(...program.rooms.map((room) => room.elevation + room.height));
      this.sun.target.position.set(0, (minY + maxY) / 2, 0);
      const radius =
        Math.max(Math.max(program.cols, program.rows) * program.grid, maxY - minY) * 0.8 + 3;
      this.sun.shadow.camera.bottom = -radius;
      this.sun.shadow.camera.left = this.sun.shadow.camera.bottom;
      this.sun.shadow.camera.top = radius;
      this.sun.shadow.camera.right = this.sun.shadow.camera.top;
      this.sun.shadow.camera.near = 0.1;
      this.sun.shadow.camera.far = Math.max(150, radius * 6);
      this.sun.shadow.camera.updateProjectionMatrix();
      if (reset || !previous) {
        this.setView("3d");
      } else if (
        this.mode === "walk" &&
        !this.canStand(this.camera.position.x, this.camera.position.z)
      ) {
        this.setView("walk");
      }
      if (this.sunSettings) {
        this.updateSun(this.sunSettings);
      }
      this.requestRender();
    }
    setupReflections() {
      for (const group of this.model.mirrors) {
        let face;
        group.traverse((child) => {
          if (child.isMesh && child.material === this.library.material.mirror) {
            face = child;
          }
        });
        if (!face) {
          continue;
        }
        face.castShadow = false;
        face.receiveShadow = false;
        const reflected = reflector({ bounces: false, resolutionScale: 0.5, samples: 0 });
        face.add(reflected.target);
        const material = new THREE.MeshBasicNodeMaterial();
        material.colorNode = reflected;
        this.reflectors.push({ face, material, node: reflected, original: face.material });
      }
    }
    disposeReflections() {
      for (const item of this.reflectors) {
        item.face.material = item.original;
        item.face.remove(item.node.target);
        item.material.dispose();
        item.node.reflector.dispose();
      }
      this.reflectors = [];
    }
    setQuality(value) {
      this.quality = value;
      this.resize();
      this.requestRender();
    }
    resize() {
      if (!this.renderer || !this.camera) {
        return;
      }
      const width = Math.max(1, this.host.clientWidth),
        height = Math.max(1, this.host.clientHeight),
        scale = this.moving
          ? 0.85
          : this.quality === "high"
            ? Math.max(1.5, devicePixelRatio)
            : this.quality === "balanced"
              ? Math.min(1.5, devicePixelRatio)
              : 1;
      this.renderer.setPixelRatio(Math.min(scale, Math.sqrt(3_500_000 / (width * height))));
      this.renderer.setSize(width, height);
      this.perspective.aspect = width / height;
      this.perspective.updateProjectionMatrix();
      const half = this.topSize || 5;
      this.orthographic.left = (-half * width) / height;
      this.orthographic.right = (half * width) / height;
      this.orthographic.top = half;
      this.orthographic.bottom = -half;
      this.orthographic.updateProjectionMatrix();
      this.requestRender();
    }
    focusBounds() {
      const rooms = this.model.program.rooms.filter(
          (r) =>
            (!this.options.room || r.name === this.options.room) &&
            (this.options.floor === "" || r.floor === Number(this.options.floor)),
        ),
        { grid } = this.model.program,
        { center } = this.model.program,
        bounds = new THREE.Box3();
      for (const r of rooms) {
        bounds
          .expandByPoint(
            new THREE.Vector3(r.x * grid - center[0], r.elevation, r.z * grid - center[1]),
          )
          .expandByPoint(
            new THREE.Vector3(
              (r.x + r.cols) * grid - center[0],
              r.elevation + r.height,
              (r.z + r.rows) * grid - center[1],
            ),
          );
      }
      return bounds;
    }
    setView(mode) {
      if (!this.model) {
        return;
      }
      const previousMode = this.mode,
        previousCamera = this.camera;
      this.mode = mode;
      this.keys.clear();
      this.tour = undefined;
      const bounds = this.focusBounds(),
        center = bounds.getCenter(new THREE.Vector3()),
        size = bounds.getSize(new THREE.Vector3());
      this.camera = mode === "top" ? this.orthographic : this.perspective;
      this.controls.object = this.camera;
      this.controls.enabled = mode !== "walk";
      this.controls.enableRotate = mode !== "top";
      if (mode === "walk") {
        this.camera.fov = 60;
        this.camera.rotation.order = "YXZ";
        this.walkYaw = 0;
        this.walkPitch = 0;
        let spawn;
        try {
          spawn = this.findSpawn();
        } catch (error) {
          this.mode = previousMode;
          this.camera = previousCamera;
          this.controls.object = previousCamera;
          this.controls.enabled = previousMode !== "walk";
          this.controls.enableRotate = previousMode !== "top";
          throw error;
        }
        this.camera.position.set(spawn.x, spawn.y, spawn.z);
        this.camera.rotation.set(0, 0, 0, "YXZ");
        this.renderer.domElement.focus({ preventScroll: true });
      } else if (mode === "top") {
        this.topSize = Math.max(size.z, size.x / Math.max(0.25, this.perspective.aspect)) * 0.62;
        this.camera.position.set(center.x, bounds.max.y + 30, center.z);
        this.camera.up.set(0, 0, -1);
        this.controls.target.set(center.x, bounds.min.y, center.z);
        this.camera.lookAt(this.controls.target);
      } else {
        this.perspective.fov = 42;
        this.camera.up.set(0, 1, 0);
        const radius = Math.max(size.x, size.z, size.y, 3),
          distance = radius * 1.55 * Math.max(1, 1.15 / this.perspective.aspect);
        this.controls.target.set(center.x, bounds.min.y + size.y * 0.28, center.z);
        this.camera.position.set(
          center.x + distance * 0.75,
          bounds.min.y + distance * 0.78,
          center.z + distance * 0.98,
        );
        this.camera.lookAt(this.controls.target);
      }
      this.camera.updateProjectionMatrix();
      this.controls.update();
      this.resize();
      this.requestRender();
    }
    roomAt(x, z) {
      const p = this.model.program,
        g = p.grid;
      return p.rooms.find(
        (r) =>
          (this.options.floor === "" || r.floor === Number(this.options.floor)) &&
          (this.mode !== "walk" || this.walkFloor === undefined || r.floor === this.walkFloor) &&
          x >= r.x * g - p.center[0] &&
          x <= (r.x + r.cols) * g - p.center[0] &&
          z >= r.z * g - p.center[1] &&
          z <= (r.z + r.rows) * g - p.center[1],
      );
    }
    canStand(x, z) {
      const room = this.roomAt(x, z);
      if (!room) {
        return false;
      }
      const eye = room.elevation + 1.65;
      for (const { bounds, group } of this.model.colliders) {
        if (
          group.userData.room.floor !== room.floor ||
          bounds.max.y < room.elevation + 0.15 ||
          bounds.min.y > eye + 0.1
        ) {
          continue;
        }
        if (
          x > bounds.min.x - 0.18 &&
          x < bounds.max.x + 0.18 &&
          z > bounds.min.z - 0.18 &&
          z < bounds.max.z + 0.18
        ) {
          return false;
        }
      }
      for (const wall of this.model.walls) {
        if (wall.room.floor !== room.floor) {
          continue;
        }
        const local = new THREE.Vector3(x, room.elevation + 0.5, z).applyMatrix4(
          wall.group.matrixWorld.clone().invert(),
        );
        if (
          Math.abs(local.z) < 0.18 + wall.thickness / 2 &&
          Math.abs(local.x) < wall.length / 2 + 0.1 &&
          (!wall.opening ||
            wall.opening.bottom > 0 ||
            Math.abs(local.x) > wall.opening.width / 2 - 0.18)
        ) {
          return false;
        }
      }
      return room;
    }
    findSpawn() {
      this.model.root.updateMatrixWorld(true);
      const p = this.model.program,
        preferred = p.rooms
          .filter(
            (r) =>
              (!this.options.room || r.name === this.options.room) &&
              (this.options.floor === "" || r.floor === Number(this.options.floor)),
          )
          .toSorted((a, b) => a.floor - b.floor);
      for (const r of preferred) {
        this.walkFloor = r.floor;
        for (let z = 0.5; z < r.rows; z += 0.5) {
          for (let x = 0.5; x < r.cols; x += 0.5) {
            const px = (r.x + x) * p.grid - p.center[0],
              pz = (r.z + z) * p.grid - p.center[1];
            if (this.canStand(px, pz)) {
              return { x: px, y: r.elevation + 1.65, z: pz };
            }
          }
        }
      }
      throw new Error("No free walking space. Move furniture or enlarge the room.");
    }
    stepWalk(dt) {
      if (this.keys.size === 0) {
        return;
      }
      const x =
        Number(this.keys.has("d") || this.keys.has("arrowright")) -
        Number(this.keys.has("a") || this.keys.has("arrowleft"));
      const z =
        Number(this.keys.has("s") || this.keys.has("arrowdown")) -
        Number(this.keys.has("w") || this.keys.has("arrowup"));
      const length = Math.hypot(x, z);
      if (!length) {
        return;
      }
      const speed = (1.7 * dt) / length,
        dx = (x * Math.cos(this.walkYaw) + z * Math.sin(this.walkYaw)) * speed,
        dz = (z * Math.cos(this.walkYaw) - x * Math.sin(this.walkYaw)) * speed,
        count = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.05));
      for (let i = 0; i < count; i += 1) {
        const px = this.camera.position.x,
          pz = this.camera.position.z,
          rx = this.canStand(px + dx / count, pz);
        if (rx) {
          this.camera.position.x += dx / count;
          this.camera.position.y = rx.elevation + 1.65;
        }
        const rz = this.canStand(this.camera.position.x, pz + dz / count);
        if (rz) {
          this.camera.position.z += dz / count;
          this.camera.position.y = rz.elevation + 1.65;
        }
      }
    }
    planTour() {
      this.model.root.updateMatrixWorld(true);
      const step = Math.min(0.25, this.model.program.grid / 2),
        origin = this.camera.position.clone(),
        key = (x, z) => `${x},${z}`;
      const nodes = [{ parent: -1, x: 0, z: 0 }],
        seen = new Map([[key(0, 0), 0]]),
        edge = (a, b) => {
          const divisions = Math.ceil(step / 0.06);
          for (let i = 1; i <= divisions; i += 1) {
            if (
              !this.canStand(
                origin.x + (a.x + ((b.x - a.x) * i) / divisions) * step,
                origin.z + (a.z + ((b.z - a.z) * i) / divisions) * step,
              )
            ) {
              return false;
            }
          }
          return true;
        };
      for (let head = 0; head < nodes.length && nodes.length < 12_000; head += 1) {
        const current = nodes[head];
        for (const [dx, dz] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const next = { parent: head, x: current.x + dx, z: current.z + dz },
            id = key(next.x, next.z);
          if (seen.has(id) || !edge(current, next)) {
            continue;
          }
          seen.set(id, nodes.length);
          nodes.push(next);
        }
      }
      if (nodes.length < 3) {
        throw new Error("Not enough free space for a walkthrough.");
      }
      let distance = 0,
        target = 0;
      nodes.forEach((node, index) => {
        const d = node.x ** 2 + node.z ** 2;
        if (d > distance) {
          distance = d;
          target = index;
        }
      });
      const route = [];
      while (target > 0) {
        const node = nodes[target];
        route.unshift(
          new THREE.Vector3(origin.x + node.x * step, origin.y, origin.z + node.z * step),
        );
        target = node.parent;
      }
      this.tour = route;
      this.requestRender();
      return route.length;
    }
    stepTour(dt) {
      if (!this.tour) {
        return;
      }
      if (this.tour.length === 0) {
        this.tour = undefined;
        this.onTourEnd?.();
        return;
      }
      const [target] = this.tour,
        direction = target.clone().sub(this.camera.position);
      direction.y = 0;
      const distance = direction.length(),
        travel = Math.min(distance, dt * 0.9);
      if (distance < 0.03) {
        this.tour.shift();
        return;
      }
      direction.normalize();
      this.camera.position.addScaledVector(direction, travel);
      this.walkYaw = Math.atan2(-direction.x, -direction.z);
      this.walkPitch = 0;
      this.camera.rotation.set(0, this.walkYaw, 0, "YXZ");
    }
    updateVisibility() {
      if (!this.model) {
        return;
      }
      const visible = (r) =>
        (!this.options.room || r.name === this.options.room) &&
        (this.options.floor === "" || r.floor === Number(this.options.floor));
      for (const group of this.model.roomGroups) {
        group.visible = visible(group.userData.room);
      }
      for (const object of this.model.objects) {
        if (object.parent === this.model.root) {
          object.visible = visible(object.userData.room);
        }
      }
      for (const wall of this.model.walls) {
        const onlyVisible = wall.rooms.filter(visible),
          sign = onlyVisible.length === 1 && onlyVisible[0] !== wall.room ? -1 : 1,
          front = this.camera.position.clone().sub(wall.position).dot(wall.normal) * sign > 0;
        wall.group.visible =
          wall.rooms.some(visible) &&
          !this.options.walls &&
          (this.mode === "walk" || (this.mode !== "top" && !front));
      }
      for (const object of this.model.objects) {
        if (!object.userData.token.mount) {
          continue;
        }
        const wall = this.model.walls.find(
          (entry) =>
            entry.rooms.includes(object.userData.room) && entry.side === object.userData.token.side,
        );
        if (wall && !wall.group.visible) {
          object.visible = false;
        }
      }
      for (const ceiling of this.model.ceilings) {
        ceiling.visible =
          visible(ceiling.userData.room || ceiling.parent.userData.room) &&
          (this.mode === "walk" || this.options.ceilings);
      }
      for (const group of this.model.root.children) {
        if (
          group.userData.room &&
          !this.model.objects.includes(group) &&
          !this.model.roomGroups.includes(group) &&
          !this.model.walls.some((w) => w.group === group)
        ) {
          group.visible = visible(group.userData.room);
        }
      }
      this.model.grid.visible = this.options.grid && this.mode !== "walk";
      this.model.grid.position.y =
        (this.options.floor === ""
          ? Math.min(...this.model.program.floors)
          : Number(this.options.floor)) *
          3 +
        0.025;
      if (this.model.terrain) {
        this.model.terrain.visible = !this.options.cutaway;
      }
      for (const { light, power } of this.model.fixtures) {
        light.intensity =
          (this.options.lights || this.night ? power : power * 0.07) *
          Number(visible(light.userData.room));
      }
      for (const item of this.reflectors) {
        item.face.material =
          this.quality === "high" && !this.moving ? item.material : item.original;
      }
    }
    updateSun(settings) {
      this.sunSettings = settings;
      const date = new Date(
          Date.parse(`${settings.date}T${settings.time}:00Z`) - settings.offset * 3_600_000,
        ),
        position = SunCalc.getPosition(date, settings.latitude, settings.longitude),
        { altitude } = position,
        bearing = position.azimuth + Math.PI - THREE.MathUtils.degToRad(settings.orientation);
      this.night = altitude < 0;
      const day = THREE.MathUtils.smoothstep(altitude, -0.1, 0.3),
        radius = Math.max(45, this.sun.shadow.camera.right * 3);
      this.sun.position.set(
        Math.sin(bearing) * Math.cos(altitude) * radius,
        Math.sin(altitude) * radius,
        -Math.cos(bearing) * Math.cos(altitude) * radius,
      );
      this.sun.position.add(this.sun.target.position);
      this.sun.intensity = altitude > 0 ? 2.6 * THREE.MathUtils.smoothstep(altitude, 0, 0.15) : 0;
      this.sun.color.set(altitude < 0.25 ? "#ffd7a2" : "#fff3e0");
      this.skyLight.intensity = 0.12 + day * 0.7;
      this.scene.environmentIntensity = 0.08 + day * 0.22;
      this.scene.background.set(this.night ? "#25303c" : "#e5e3db");
      this.renderer.toneMappingExposure =
        0.95 * 2 ** settings.exposure * (this.mode === "walk" && settings.adaptive ? 1.35 : 1);
      this.requestRender();
      return {
        altitude: THREE.MathUtils.radToDeg(altitude),
        bearing: (THREE.MathUtils.radToDeg(position.azimuth) + 180 + 360) % 360,
      };
    }
    effectFor(camera) {
      if (this.effects.has(camera)) {
        return this.effects.get(camera);
      }
      const scenePass = pass(this.scene, camera, { samples: 0 }),
        beauty = scenePass.getTextureNode("output"),
        depth = scenePass.getTextureNode("depth"),
        ambient = ao(depth, null, camera),
        filtered = denoise(ambient.getTextureNode(), depth, null, camera);
      ambient.radius.value = 0.35;
      ambient.thickness.value = 0.5;
      ambient.scale.value = 0.9;
      filtered.radius.value = 4;
      const antialias = fxaa(vec4(beauty.rgb.mul(filtered.r.clamp(0.5, 1)), beauty.a)),
        processing = new THREE.PostProcessing(this.renderer);
      processing.outputNode = antialias;
      const effect = { ambient, antialias, filtered, processing, scenePass };
      this.effects.set(camera, effect);
      return effect;
    }
    render() {
      this.renderer.info.reset();
      this.updateVisibility();
      this.scene.updateMatrixWorld(true);
      this.camera.updateMatrixWorld(true);
      if (this.quality === "fast" || this.moving) {
        this.renderer.render(this.scene, this.camera);
      } else {
        const effect = this.effectFor(this.camera);
        effect.ambient.resolutionScale = this.quality === "high" ? 0.75 : 0.5;
        effect.ambient.samples.value = this.quality === "high" ? 24 : 12;
        effect.processing.render();
      }
      this.onRender?.({
        calls: this.renderer.info.render.drawCalls,
        triangles: this.renderer.info.render.triangles,
      });
    }
    requestRender() {
      if (this.disposed) {
        return;
      }
      this.dirty = true;
      if (this.frame || document.hidden) {
        return;
      }
      this.frame = requestAnimationFrame((time) => {
        this.frame = 0;
        if (this.busy) {
          this.dirty = true;
          return;
        }
        const dt = Math.min(0.05, (time - this.lastTime) / 1000 || 0.016);
        this.lastTime = time;
        try {
          this.dirty = false;
          if (this.mode === "walk") {
            this.stepWalk(dt);
            this.stepTour(dt);
          } else {
            this.controls?.update();
          }
          if (this.model) {
            this.render();
          }
          if (this.dirty || this.keys.size > 0 || this.tour) {
            this.requestRender();
          }
        } catch (error) {
          this.keys.clear();
          this.onError(error);
        }
      });
    }
    capture() {
      const result = (this.readbackQueue || Promise.resolve()).then(() => this.captureImage());
      this.readbackQueue = result.catch((error) => error);
      return result;
    }
    async captureImage() {
      this.busy = true;
      const size = this.renderer.getDrawingBufferSize(new THREE.Vector2()),
        width = Math.round(size.x),
        height = Math.round(size.y),
        target = new THREE.RenderTarget(width, height, { type: THREE.UnsignedByteType });
      target.texture.colorSpace =
        this.quality === "fast" ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
      const { moving } = this;
      this.moving = false;
      try {
        this.renderer.setRenderTarget(target);
        this.render();
        const pixels = await this.renderer.readRenderTargetPixelsAsync(target, 0, 0, width, height),
          packed = new Uint8ClampedArray(width * height * 4),
          stride = pixels.length / height;
        for (let row = 0; row < height; row += 1) {
          const source = this.backend === "WebGPU" ? row : height - 1 - row;
          packed.set(
            pixels.subarray(source * stride, source * stride + width * 4),
            row * width * 4,
          );
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").putImageData(new ImageData(packed, width, height), 0, 0);
        return await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });
      } finally {
        this.renderer.setRenderTarget(null);
        target.dispose();
        this.moving = moving;
        this.busy = false;
        this.requestRender();
      }
    }
    preview(name) {
      const result = (this.readbackQueue || Promise.resolve()).then(() => this.previewImage(name));
      this.readbackQueue = result.catch((error) => error);
      return result;
    }
    async previewImage(name) {
      this.busy = true;
      const target = new THREE.RenderTarget(512, 384, { type: THREE.UnsignedByteType });
      target.texture.colorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#e5e3db");
      scene.environment = this.environment.texture;
      scene.environmentIntensity = 0.6;
      const object = this.library.create(name);
      scene.add(object);
      const bounds = new THREE.Box3().setFromObject(object),
        size = bounds.getSize(new THREE.Vector3()),
        center = bounds.getCenter(new THREE.Vector3()),
        camera = new THREE.PerspectiveCamera(35, 512 / 384, 0.01, 100),
        distance = Math.max(size.x, size.y, size.z) * 2.5;
      camera.position
        .copy(center)
        .add(new THREE.Vector3(distance * 0.75, distance * 0.55, distance));
      camera.lookAt(center);
      scene.add(new THREE.HemisphereLight("#f5f3ec", "#b4aa97", 2));
      const light = new THREE.DirectionalLight("#fff0dc", 3);
      light.position.set(3, 5, 4);
      scene.add(light);
      try {
        this.renderer.setRenderTarget(target);
        this.renderer.render(scene, camera);
        const pixels = await this.renderer.readRenderTargetPixelsAsync(target, 0, 0, 512, 384),
          packed = new Uint8ClampedArray(512 * 384 * 4),
          stride = pixels.length / 384;
        for (let row = 0; row < 384; row += 1) {
          const source = this.backend === "WebGPU" ? row : 383 - row;
          packed.set(pixels.subarray(source * stride, source * stride + 2048), row * 2048);
        }
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 384;
        canvas.getContext("2d").putImageData(new ImageData(packed, 512, 384), 0, 0);
        return await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });
      } finally {
        this.renderer.setRenderTarget(null);
        target.dispose();
        scene.clear();
        this.busy = false;
        this.requestRender();
      }
    }
    dispose() {
      this.disposed = true;
      cancelAnimationFrame(this.frame);
      this.observer?.disconnect();
      this.controls?.dispose();
      this.disposeReflections();
      this.model?.dispose();
      for (const effect of this.effects.values()) {
        effect.processing.dispose();
        effect.scenePass.dispose();
        effect.ambient.dispose();
        effect.filtered.dispose();
      }
      this.library?.dispose();
      this.environment?.dispose();
      this.renderer?.dispose();
    }
  }
  const $ = (id) => document.querySelector(`#${id}`),
    params = new URLSearchParams(location.search),
    shared = new URLSearchParams(location.hash.slice(1)),
    status = (text, error = false) => {
      $("message").textContent = text;
      $("message").classList.toggle("error", error);
      $("message").hidden = !text;
    },
    progress = (text) => {
      $("renderProgress").hidden = !text;
      $("renderProgressText").textContent = text || "";
      $("viewport").setAttribute("aria-busy", String(Boolean(text)));
    },
    friendly = (name) => name.replaceAll("_", " ");
  let assetCell,
    compileTimer,
    compiledSource,
    editor,
    folded = false,
    previewRevision = 0,
    previewUrl,
    program,
    ready = false,
    revision = 0,
    _selected,
    selectedAsset = "sofa",
    studio;
  const doc = () => editor.state.doc.toString(),
    replaceSource = (source) =>
      editor.dispatch({ changes: { from: 0, insert: source, to: editor.state.doc.length } }),
    guarded =
      (action) =>
      (...args) =>
        Promise.resolve()
          .then(() => action(...args))
          .catch((error) => status(error.message, true));
  async function compile(reset = false) {
    clearTimeout(compileTimer);
    const source = doc(),
      version = revision + 1;
    revision = version;
    try {
      const parsed = parseProgram(source);
      progress("Rendering…");
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      if (version !== revision) {
        return;
      }
      clearSelection();
      studio.setProgram(parsed, reset);
      syncView(studio.mode);
      program = parsed;
      compiledSource = source;
      studio.render();
      ready = true;
      $("roomFocus").replaceChildren(
        new Option("Entire project", ""),
        ...program.rooms.map((r) => new Option(friendly(r.name), r.name)),
      );
      $("roomFocus").value = studio.options.room;
      $("floorFocus").replaceChildren(
        new Option("All floors", ""),
        ...program.floors.map(
          (f) =>
            new Option(
              f < 0 ? `Basement ${-f}` : f === 0 ? "Ground floor" : `Floor ${f}`,
              String(f),
            ),
        ),
      );
      $("floorFocus").hidden = program.floors.length < 2;
      $("floorFocus").value = studio.options.floor;
      status(program.warnings.join(" "));
      try {
        localStorage.setItem("interior-studio-draft", source);
      } catch {
        status("Browser storage unavailable. Use Share design to save your design.");
      }
    } catch (error) {
      if (version === revision) {
        status(`${error.message}${program ? " · Showing the last valid layout." : ""}`, true);
      }
    } finally {
      if (version === revision) {
        progress("");
      }
    }
  }
  function clearSelection() {
    _selected = undefined;
    $("selectionCard").hidden = true;
    if (studio?.selectionOutline) {
      studio.scene.remove(studio.selectionOutline);
      studio.selectionOutline.geometry.dispose();
      studio.selectionOutline.material.dispose();
      studio.selectionOutline = undefined;
      studio.requestRender();
    }
  }
  function selectObject(group) {
    clearSelection();
    if (!group) {
      return;
    }
    _selected = group;
    const { token, room } = group.userData,
      card = $("selectionCard");
    card.replaceChildren();
    card.hidden = false;
    const close = document.createElement("button");
    close.textContent = "✕";
    close.className = "close";
    close.setAttribute("aria-label", "Close object details");
    close.addEventListener("click", clearSelection);
    const heading = document.createElement("h3");
    heading.textContent = friendly(token.name);
    const info = document.createElement("p");
    info.textContent = `${friendly(room.name)} · ${token.dimensions.map((v) => v.toFixed(2)).join(" × ")} m`;
    card.append(close, heading, info);
    const link = document.createElement(token.url ? "a" : "p");
    if (token.url) {
      link.href = token.url;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      link.textContent = "View product reference ↗";
    } else {
      link.textContent = "No product link";
    }
    card.append(link);
    if (token.text && doc() === compiledSource) {
      const form = document.createElement("form");
      ["Width", "Depth", "Height", "Rotation"].forEach((label, i) => {
        const wrapper = document.createElement("label"),
          input = document.createElement("input");
        wrapper.textContent = label + (i < 3 ? " · m" : " · °");
        input.type = "number";
        input.name = label.toLowerCase();
        input.value = String(i < 3 ? token.dimensions[i] : token.yaw);
        input.min = i < 3 ? "0.01" : "-360";
        input.max = i < 3 ? "10" : "360";
        input.step = "any";
        input.required = true;
        if (i === 3 && token.wall) {
          input.disabled = true;
        }
        wrapper.append(input);
        form.append(wrapper);
      });
      const apply = document.createElement("button");
      apply.type = "submit";
      apply.textContent = "Apply dimensions";
      form.append(apply);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (doc() !== compiledSource) {
          status("Wait for the layout to update before changing this object.", true);
          return;
        }
        const values = [...form.querySelectorAll("input")].map((i) => Number(i.value)),
          replacement = `${token.name}[${values.slice(0, 3).join("x")}]${token.wall ? `~${token.wall}` : `@${values[3]}`}${token.child ? `(${token.child}_on_top)` : ""}${token.url ? `<${token.url}>` : ""}`,
          line = editor.state.doc.line(token.line);
        editor.dispatch({
          changes: {
            from: line.from + token.start,
            insert: replacement,
            to: line.from + token.end,
          },
        });
      });
      card.append(form);
      const line = editor.state.doc.line(token.line);
      editor.dispatch({
        effects: EditorView.scrollIntoView(line.from, { y: "nearest" }),
        selection: { anchor: line.from + token.start, head: line.from + token.end },
      });
    }
    studio.selectionOutline = new THREE.BoxHelper(group, "#738b58");
    studio.selectionOutline.material.depthTest = false;
    studio.selectionOutline.renderOrder = 100;
    studio.scene.add(studio.selectionOutline);
    studio.requestRender();
  }
  function syncView(mode) {
    for (const [id, value] of [
      ["resetButton", "3d"],
      ["topButton", "top"],
      ["firstPersonButton", "walk"],
    ]) {
      $(id).classList.toggle("active", mode === value);
      $(id).setAttribute("aria-pressed", String(mode === value));
    }
    $("walkLensControl").hidden = mode !== "walk";
    $("touchNavigation").hidden = mode !== "walk" || !matchMedia("(pointer:coarse)").matches;
  }
  function setView(mode) {
    clearSelection();
    studio.setView(mode);
    if (mode === "walk") {
      studio.camera.fov = Number($("walkLens").value);
      studio.camera.updateProjectionMatrix();
    }
    studio.updateSun(readSun());
    syncView(mode);
  }
  function readSun() {
    return {
      adaptive: $("sunExposureMode").value === "adaptive",
      date: $("sunDate").value,
      exposure: Number($("sunExposure").value),
      latitude: Number($("sunLatitude").value),
      longitude: Number($("sunLongitude").value),
      offset: Number($("sunOffset").value),
      orientation: Number($("sunOrientation").value),
      time: $("sunTime").value,
    };
  }
  function updateSun() {
    if (!$("sunSettings").checkValidity()) {
      return;
    }
    const sun = studio.updateSun(readSun());
    $("sunStatus").textContent =
      `${sun.altitude > 0 ? "Daylight" : "Night · fixtures on"} · Elevation ${sun.altitude.toFixed(1)}° · Bearing ${sun.bearing.toFixed(1)}°`;
  }
  function category(name) {
    if (/light|lamp|pendant|lantern/u.test(name)) {
      return "lighting";
    }
    if (/shower|bath|toilet|towel|vanity|drain/u.test(name)) {
      return "bathroom";
    }
    if (/chair|sofa|bench|pouf|stool|ottoman/u.test(name)) {
      return "seating";
    }
    if (/bed|wardrobe|dresser|rack|sideboard|nightstand|cabinet/u.test(name)) {
      return "bedroom";
    }
    if (/table|desk/u.test(name)) {
      return "tables";
    }
    if (/kitchen|fridge|stove|sink|coffee/u.test(name)) {
      return "kitchen";
    }
    if (/tree|plant|garden|pergola|flower|trellis|palm|pot|bbq|hedge/u.test(name)) {
      return "garden";
    }
    return "decor";
  }
  function showAssetResults() {
    const query = $("assetSearch").value.toLowerCase(),
      filter = $("assetCategory").value,
      names = Object.keys(catalog)
        .filter(
          (name) =>
            (filter === "all" || category(name) === filter) && friendly(name).includes(query),
        )
        .toSorted();
    $("assetCount").textContent = `${names.length} assets · Dimensions are metres`;
    $("assetResults").replaceChildren();
    for (const name of names) {
      const button = document.createElement("button");
      button.className = "asset-option";
      button.dataset.asset = name;
      button.setAttribute("aria-pressed", String(name === selectedAsset));
      const icon = document.createElement("span");
      icon.textContent = {
        bathroom: "◡",
        bedroom: "▥",
        decor: "◇",
        garden: "♧",
        kitchen: "▤",
        lighting: "☼",
        seating: "▱",
        tables: "⊓",
      }[category(name)];
      const label = document.createElement("div");
      label.textContent = friendly(name);
      button.append(icon, label);
      button.addEventListener("click", () => selectAsset(name));
      $("assetResults").append(button);
    }
    if (names.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No assets match this search.";
      $("assetResults").append(empty);
    }
  }
  async function selectAsset(name) {
    selectedAsset = name;
    for (const button of $("assetResults").querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.asset === name));
    }
    $("assetName").textContent = friendly(name);
    $("assetDimensions").textContent = `${catalog[name].join(" × ")} m · Width × depth × height`;
    $("assetToken").textContent = name;
    $("assetContext").textContent = assetCell
      ? "Replaces the cell at your editor cursor."
      : "Place the editor cursor in a layout cell, then open the library.";
    $("insertAsset").disabled = !assetCell;
    const version = previewRevision + 1;
    previewRevision = version;
    $("assetPreview").textContent = "Rendering preview…";
    try {
      const blob = await studio.preview(name);
      if (version !== previewRevision || !$("assetBrowser").open) {
        return;
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      previewUrl = URL.createObjectURL(blob);
      const img = document.createElement("img");
      img.src = previewUrl;
      img.alt = `${friendly(name)} dimensional study model`;
      $("assetPreview").replaceChildren(img);
    } catch (error) {
      if (version === previewRevision) {
        $("assetPreview").textContent = `Preview unavailable: ${error.message}`;
      }
    }
  }
  function cursorCell() {
    const position = editor.state.selection.main.head,
      line = editor.state.doc.lineAt(position);
    let inLayout = false;
    for (let n = 1; n < line.number; n += 1) {
      const text = editor.state.doc.line(n).text.trim();
      if (/^LAYOUT\b/iu.test(text)) {
        inLayout = true;
      }
      if (/^END\b/iu.test(text)) {
        inLayout = false;
      }
    }
    if (!inLayout || /^\s*(END|#)/iu.test(line.text)) {
      return;
    }
    const tokens = [...line.text.matchAll(/(?:[^\s|<]+(?:<[^<>]*>)?)/gu)],
      match = tokens.find(
        (m) => position - line.from >= m.index && position - line.from <= m.index + m[0].length,
      );
    return match
      ? { from: line.from + match.index, to: line.from + match.index + match[0].length }
      : undefined;
  }
  async function startStudio() {
    for (const name of Object.keys(examples)) {
      $("exampleSelect").add(new Option(name, name));
    }
    const editedDesign = new Option("Edited design", "custom");
    editedDesign.disabled = true;
    editedDesign.hidden = true;
    $("exampleSelect").add(editedDesign);
    const folding = foldService.of((state, from) => {
        const line = state.doc.lineAt(from);
        if (!/^LAYOUT\b/iu.test(line.text.trim())) {
          return null;
        }
        for (let n = line.number + 1; n <= state.doc.lines; n += 1) {
          const end = state.doc.line(n);
          if (/^END\b/iu.test(end.text.trim())) {
            return { from: line.to, to: end.from - 1 };
          }
        }
        return null;
      }),
      initialName = examples[params.get("example")] ? params.get("example") : "Small apartment";
    let saved;
    try {
      saved = localStorage.getItem("interior-studio-draft");
    } catch {
      saved = undefined;
    }
    const source =
      shared.get("scene") ??
      (params.get("example") ? examples[initialName] : saved || examples[initialName]);
    $("exampleSelect").value = source === examples[initialName] ? initialName : "custom";
    editor = new EditorView({
      parent: $("editor"),
      state: EditorState.create({
        doc: source,
        extensions: [
          lineNumbers(),
          drawSelection(),
          highlightActiveLine(),
          history(),
          foldGutter(),
          folding,
          EditorView.contentAttributes.of({ "aria-label": "Design source", spellcheck: "false" }),
          EditorState.tabSize.of(2),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                compile();
                return true;
              },
            },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              ready = false;
              revision += 1;
              clearSelection();
              $("exampleSelect").value = "custom";
              clearTimeout(compileTimer);
              compileTimer = setTimeout(() => compile(), 300);
            }
          }),
        ],
      }),
    });
    studio = new InteriorRenderer($("viewport"), (error) => {
      ready = false;
      progress("");
      status(error.message, true);
    });
    await studio.init();
    studio.onModeChange = (mode) => {
      syncView(mode);
      updateSun();
    };
    for (const key of [
      "Date",
      "Time",
      "Latitude",
      "Longitude",
      "Offset",
      "Orientation",
      "Exposure",
      "ExposureMode",
    ]) {
      const input = $(`sun${key}`),
        value = shared.get(`sun${key}`);
      if (value !== null) {
        input.value = value;
      }
    }
    $("sunSettings").addEventListener("submit", (event) => event.preventDefault());
    $("sunSettings").addEventListener("input", updateSun);
    updateSun();
    $("exampleSelect").addEventListener("change", () => {
      const name = $("exampleSelect").value;
      if (examples[name]) {
        replaceSource(examples[name]);
        $("exampleSelect").value = name;
        studio.options.room = "";
        studio.options.floor = "";
        compile(true);
      }
    });
    $("copyButton").addEventListener(
      "click",
      guarded(async () => {
        await navigator.clipboard.writeText(doc());
        status("Layout copied.");
      }),
    );
    $("shareButton").addEventListener(
      "click",
      guarded(async () => {
        const url = new URL(location.href);
        url.searchParams.delete("example");
        url.searchParams.delete("test");
        url.searchParams.delete("backend");
        const hash = new URLSearchParams({ scene: doc() });
        for (const key of [
          "Date",
          "Time",
          "Latitude",
          "Longitude",
          "Offset",
          "Orientation",
          "Exposure",
          "ExposureMode",
        ]) {
          hash.set(`sun${key}`, $(`sun${key}`).value);
        }
        url.hash = hash.toString();
        await navigator.clipboard.writeText(url.href);
        status("Share link copied.");
      }),
    );
    $("saveViewButton").addEventListener(
      "click",
      guarded(async () => {
        const button = $("saveViewButton");
        button.disabled = true;
        try {
          const blob = await studio.capture();
          if (!blob) {
            throw new Error("Image export failed");
          }
          const url = URL.createObjectURL(blob),
            link = document.createElement("a");
          link.href = url;
          link.download = "interior-design.png";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 10_000);
          status("Image exported.");
        } finally {
          button.disabled = false;
        }
      }),
    );
    $("undoButton").addEventListener("click", () => undo(editor));
    $("redoButton").addEventListener("click", () => redo(editor));
    $("foldButton").addEventListener("click", () => {
      folded = foldedRanges(editor.state).size > 0;
      if (folded) {
        unfoldAll(editor);
      } else {
        foldAll(editor);
      }
      $("foldButton").textContent = folded ? "Fold" : "Unfold";
    });
    for (const [id, mode] of [
      ["resetButton", "3d"],
      ["topButton", "top"],
      ["firstPersonButton", "walk"],
    ]) {
      $(id).addEventListener(
        "click",
        guarded(() => setView(mode)),
      );
    }
    $("renderQuality").addEventListener("change", () =>
      studio.setQuality($("renderQuality").value),
    );
    $("roomFocus").addEventListener(
      "change",
      guarded(() => {
        studio.options.room = $("roomFocus").value;
        const room = program.rooms.find((r) => r.name === studio.options.room);
        studio.options.floor = room ? String(room.floor) : "";
        $("floorFocus").value = studio.options.floor;
        setView(studio.mode);
      }),
    );
    $("floorFocus").addEventListener(
      "change",
      guarded(() => {
        studio.options.floor = $("floorFocus").value;
        studio.options.room = "";
        $("roomFocus").value = "";
        setView(studio.mode);
      }),
    );
    for (const [id, key] of [
      ["wallsButton", "walls"],
      ["ceilingsButton", "ceilings"],
      ["gridButton", "grid"],
      ["lightsButton", "lights"],
      ["cutawayButton", "cutaway"],
    ]) {
      const activeStudio = studio;
      $(id).addEventListener("click", () => {
        activeStudio.options[key] = !activeStudio.options[key];
        $(id).setAttribute("aria-pressed", String(activeStudio.options[key]));
        activeStudio.requestRender();
      });
    }
    $("walkLens").addEventListener("change", () => {
      studio.camera.fov = Number($("walkLens").value);
      studio.camera.updateProjectionMatrix();
      studio.requestRender();
    });
    $("fullscreenButton").hidden = !$("viewport").requestFullscreen;
    $("fullscreenButton").addEventListener(
      "click",
      guarded(() =>
        document.fullscreenElement ? document.exitFullscreen() : $("viewport").requestFullscreen(),
      ),
    );
    for (const button of document.querySelectorAll("[data-walk-key]")) {
      const activeStudio = studio;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        activeStudio.keys.add(button.dataset.walkKey);
        activeStudio.requestRender();
      });
      const release = () => activeStudio.keys.delete(button.dataset.walkKey);
      for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
        button.addEventListener(event, release);
      }
    }
    const canvas = studio.renderer.domElement;
    let down;
    canvas.addEventListener("pointerdown", (event) => {
      down = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener("click", (event) => {
      if (
        studio.mode === "walk" ||
        !down ||
        Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5
      ) {
        return;
      }
      const rect = canvas.getBoundingClientRect(),
        pointer = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((event.clientY - rect.top) / rect.height) * 2,
        ),
        ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, studio.camera);
      const [hit] = ray.intersectObjects(
        studio.model.objects.filter((g) => g.visible),
        true,
      );
      let group = hit?.object;
      while (group && !group.userData.token) {
        group = group.parent;
      }
      selectObject(group);
    });
    $("assetsButton").disabled = false;
    $("assetsButton").addEventListener("click", () => {
      assetCell = cursorCell();
      studio.keys.clear();
      $("assetBrowser").showModal();
      showAssetResults();
      selectAsset(selectedAsset);
    });
    $("closeAssets").addEventListener("click", () => $("assetBrowser").close());
    $("assetBrowser").addEventListener("close", () => {
      previewRevision += 1;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = undefined;
      }
    });
    $("assetSearch").addEventListener("input", showAssetResults);
    $("assetCategory").addEventListener("change", showAssetResults);
    $("insertAsset").addEventListener("click", () => {
      if (!assetCell) {
        return;
      }
      editor.dispatch({ changes: { ...assetCell, insert: selectedAsset } });
      $("assetBrowser").close();
      editor.focus();
    });
    $("copyAsset").addEventListener(
      "click",
      guarded(async () => {
        await navigator.clipboard.writeText(selectedAsset);
        $("assetContext").textContent = "Token copied.";
      }),
    );
    const divider = $("layoutDivider"),
      resize = (percent) => {
        const value = Math.min(55, Math.max(22, percent));
        document.querySelector(".workspace").style.setProperty("--editor-width", `${value}%`);
        divider.setAttribute("aria-valuenow", String(Math.round(value)));
      };
    divider.addEventListener("pointerdown", (event) => {
      divider.setPointerCapture(event.pointerId);
    });
    divider.addEventListener("pointermove", (event) => {
      if (divider.hasPointerCapture(event.pointerId)) {
        resize((event.clientX / window.innerWidth) * 100);
      }
    });
    divider.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        resize(
          Number(divider.getAttribute("aria-valuenow")) + (event.key === "ArrowLeft" ? -2 : 2),
        );
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        clearSelection();
      }
      if (studio.mode === "walk" && event.key.toLowerCase() === "e" && event.target === canvas) {
        event.preventDefault();
        const near = studio.model.objects.find(
          (g) =>
            ["stairs", "elevator"].includes(g.userData.token.name) &&
            g.position.distanceTo(studio.camera.position) < 3.5,
        );
        if (!near) {
          status("Move near stairs or an elevator to change floors.");
          return;
        }
        const floor = near.userData.room.floor + (event.shiftKey ? -1 : 1);
        if (!program.floors.includes(floor)) {
          status("No connecting floor in that direction.");
          return;
        }
        studio.options.floor = String(floor);
        studio.options.room = "";
        $("floorFocus").value = String(floor);
        $("roomFocus").value = "";
        setView("walk");
      }
    });
    $("walkthroughButton").addEventListener(
      "click",
      guarded(async () => {
        setView("walk");
        $("sceneOptions").open = false;
        progress("Planning a route through free space…");
        try {
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          studio.planTour();
        } finally {
          progress("");
        }
      }),
    );
    studio.onTourEnd = () => {
      syncView("walk");
      status("Walkthrough complete.");
    };
    await compile(true);
    syncView("3d");
    if (params.has("test")) {
      globalThis.interior = {
        catalog,
        compile,
        editor,
        examples,
        parseProgram,
        get program() {
          return program;
        },
        get ready() {
          return ready && !studio.dirty && !studio.frame;
        },
        selectObject,
        studio,
      };
    }
  }
  await startStudio();
};
const controls = [...document.querySelectorAll("button:not(:disabled), select")];
for (const control of controls) {
  control.disabled = true;
}
initializeStudio()
  .then(() => {
    for (const control of controls) {
      control.disabled = false;
    }
  })
  .catch((error) => {
    document.querySelector("#renderProgress").hidden = true;
    document.querySelector("#viewport").setAttribute("aria-busy", "false");
    const message = document.querySelector("#message");
    message.hidden = false;
    message.className = "message error";
    message.textContent = `Could not initialize the editor: ${error.message}. Reload to try again.`;
  });
