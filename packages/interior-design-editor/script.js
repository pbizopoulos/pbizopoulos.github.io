/* eslint-disable max-lines, max-lines-per-function, prefer-named-capture-group, no-magic-numbers, id-length, max-statements, max-params, complexity, max-depth, one-var, sort-vars, func-style, no-use-before-define, unicorn/consistent-function-scoping, no-ternary, no-nested-ternary, unicorn/no-nested-ternary, init-declarations, no-undefined, no-continue, unicorn/no-array-for-each, oxc/no-optional-chaining, oxc/no-async-await, unicorn/prefer-top-level-await */ (async () => {
  const defaultRoomHeight = 2.6,
    baseCameraExposure = 1.05,
    walkEyeHeight = 1.8,
    showerGlassOpacity = { edge: 0.36, face: 0.13 },
    roomStyles = ["warm", "blue", "neutral", "liminal", "industrial", "aquatic", "mediterranean"],
    floorFinishes = ["auto", "tile", "stone", "grass", "terracotta", "wood", "concrete"];
  const referenceCatalog = {
    ac_condenser: [0.82, 0.36, 0.62],
    accent_chair: [0.72, 0.8, 0.86],
    arched_mirror: [0.7, 0.045, 1.1],
    archway: [3.6, 0.3, defaultRoomHeight],
    awning: [3.6, 1.8, 2.65],
    bathroom_vanity: [0.62, 0.5, 0.85],
    bbq: [0.85, 0.55, 0.95],
    bolster: [0.55, 0.18, 0.18],
    book_stack: [0.3, 0.23, 0.14],
    botanical_print: [0.42, 0.04, 0.58],
    bougainvillea: [1.2, 0.65, 2.2],
    breakfast_bar: [1.5, 0.48, 1.05],
    cafe_setting: [0.65, 0.38, 0.22],
    canopy_bed: [1.55, 2.05, 1.95],
    ceiling_fan: [1.2, 1.2, 2.65],
    ceramic_table_lamp: [0.34, 0.34, 0.52],
    ceramic_vessels: [0.48, 0.22, 0.32],
    citrus_bowl: [0.28, 0.28, 0.18],
    citrus_print: [0.42, 0.035, 0.6],
    citrus_tree: [2.2, 2.2, 2.8],
    coastal_print: [0.42, 0.035, 0.6],
    curtain_pair: [1.8, 0.18, 2.5],
    cypress: [1.2, 1.2, 3.5],
    dumbbells: [0.85, 0.48, 0.32],
    fireplace: [1.35, 0.65, defaultRoomHeight],
    floor_drain: [0.18, 0.18, 0.015],
    flower_border: [2.4, 0.65, 0.65],
    folding_chair: [0.5, 0.58, 0.88],
    frameless_shower: [0.9, 0.95, 2.05],
    garden_steps: [1.5, 1.5, 0.6],
    garment_rack: [1.05, 0.5, 1.7],
    globe_lamp: [0.42, 0.42, 1.65],
    grape_trellis: [2.4, 0.4, 2.5],
    gym_bench: [0.65, 1.45, 1.1],
    gym_mat: [1.8, 1.2, 0.025],
    jute_rug: [2, 1.4, 0.018],
    kilim_rug: [1.4, 0.8, 0.015],
    kitchen_accessories: [0.65, 0.32, 0.42],
    kitchenette: [2.4, 0.65, 2.25],
    linen_bench: [1.2, 0.42, 0.48],
    linen_pouf: [0.6, 0.6, 0.4],
    linen_throw: [1.2, 0.8, 0.16],
    modular_sofa: [2.8, 1.5, 0.82],
    ochre_table: [0.46, 0.46, 0.5],
    olive_tree: [2.5, 2.5, 2.8],
    outdoor_kitchen: [2.4, 0.7, 0.95],
    palm: [2.4, 2.4, 2.6],
    patio_chair: [0.5, 0.55, 0.82],
    retaining_wall: [2.4, 0.3, 0.65],
    retro_fridge: [0.6, 0.64, 1.55],
    roller_shutter: [1.8, 0.18, 2.5],
    roman_blind: [1.6, 0.12, 1.5],
    round_dining_table: [1.2, 1.2, 0.75],
    sea_table: [0.46, 0.46, 0.5],
    shower_set: [0.5, 0.2, 1.9],
    slatted_table: [0.85, 0.85, 0.75],
    sleeping_loft: [3.4, 3.6, 3.35],
    sofa_bed: [1.9, 0.85, 0.85],
    stone_path: [1.2, 3, 0.04],
    terracotta_pot: [0.5, 0.5, 0.7],
    terracotta_urn: [0.45, 0.45, 0.65],
    timber_pergola: [3.6, 2.8, 2.7],
    timber_rail: [2.4, 0.1, 1.05],
    timber_wardrobe: [0.9, 0.55, 1.95],
    topiary_tree: [2.2, 2.2, 3.2],
    towel_rail: [0.65, 0.14, 1.25],
    towel_stack: [0.48, 0.32, 0.24],
    trellis: [1.8, 0.12, 1.8],
    tufted_sofa: [1.9, 0.85, 0.86],
    upholstered_bed: [1.7, 2.2, 1.05],
    wall_coat_hooks: [0.7, 0.07, 0.18],
    wall_outlet: [0.16, 0.025, 0.085],
    wall_spot_pair: [0.52, 0.18, 0.18],
    wall_tv: [1.1, 0.07, 0.65],
    wicker_basket: [0.5, 0.36, 0.3],
    wishbone_chair: [0.55, 0.55, 0.8],
    woven_chair: [0.68, 0.75, 0.85],
    woven_pendant: [0.58, 0.58, 2.7],
  };
  function addReferenceAsset(name, group) {
    const m = material;
    if (!referenceCatalog[name]) {
      return;
    }
    const [w, d, h] = referenceCatalog[name],
      timber = ["slatted_table", "folding_chair"].includes(name) ? m.woodDark : m.wood,
      b = (width, height, depth, x, y, z, finish = timber) =>
        box(group, width, height, depth, x, y, z, finish),
      rod = (startPoint, endPoint, radius = 0.018, finish = timber) => {
        const start = new THREE.Vector3(...startPoint),
          end = new THREE.Vector3(...endPoint),
          part = cylinder(group, radius, radius, start.distanceTo(end), 0, 0, 0, finish, 12);
        part.position.copy(start).add(end).multiplyScalar(0.5);
        part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
        return part;
      };
    if (name === "wishbone_chair") {
      for (const side of [-1, 1]) {
        rod([side * 0.235, 0, 0.22], [side * 0.19, 0.46, 0.15], 0.02);
        rod([side * 0.235, 0, -0.23], [side * 0.17, 0.79, -0.17], 0.02);
        rod([side * 0.19, 0.2, 0.16], [side * 0.19, 0.2, -0.18], 0.012);
      }
      b(0.45, 0.055, 0.44, 0, 0.455, 0.02, m.wicker);
      piping(group, 0.44, 0.43, 0, 0.48, 0.02, m.jute);
      curvedRod(
        group,
        [
          [-0.265, 0.67, 0.09],
          [-0.26, 0.75, -0.13],
          [0, 0.79, -0.25],
          [0.26, 0.75, -0.13],
          [0.265, 0.67, 0.09],
        ],
        0.025,
        timber,
        24,
      );
      curvedRod(
        group,
        [
          [0, 0.48, -0.2],
          [0, 0.62, -0.21],
          [-0.105, 0.76, -0.22],
        ],
        0.019,
        timber,
        12,
      );
      curvedRod(
        group,
        [
          [0, 0.6, -0.21],
          [0.105, 0.76, -0.22],
        ],
        0.019,
        timber,
        8,
      );
      rod([-0.18, 0.19, 0.17], [0.18, 0.19, 0.17], 0.012);
    } else if (name === "round_dining_table") {
      const profile = [
          [0.23, 0],
          [0.26, 0.025],
          [0.17, 0.11],
          [0.12, 0.3],
          [0.12, 0.64],
          [0.19, 0.7],
        ],
        pedestal = new THREE.Mesh(
          new THREE.LatheGeometry(
            profile.map(([r, y]) => new THREE.Vector2(r, y)),
            32,
          ),
          m.woodDark,
        );
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      group.add(pedestal);
      cylinder(group, w / 2, w / 2, 0.045, 0, h - 0.025, 0, timber, 48);
      cylinder(group, w / 2 - 0.015, w / 2 - 0.035, 0.035, 0, h - 0.058, 0, m.woodDark, 48);
    } else if (name === "upholstered_bed") {
      legs(group, w, d, 0.12);
      b(w, 0.25, d - 0.08, 0, 0.225, 0.02, m.fabricDark);
      cushion(group, w - 0.08, 0.23, d - 0.1, 0, 0.435, 0.035, m.cream, m.linen);
      cushion(group, w, 0.9, 0.16, 0, 0.6, -d / 2 + 0.08, m.fabricDark);
      for (const side of [-1, 1]) {
        cushion(group, 0.7, 0.15, 0.42, side * 0.41, 0.61, -0.64, m.cream).rotation.y = side * 0.06;
        cushion(group, 0.38, 0.13, 0.35, side * 0.36, 0.63, -0.36, m.stripedLinen).rotation.y =
          -side * 0.08;
      }
      drapedCover(group, w - 0.06, d * 0.67, 0, 0.565, 0.23, m.linen);
      drapedCover(group, w - 0.06, 0.4, 0, 0.58, 0.69, m.fabric);
    } else if (name === "modular_sofa") {
      for (let i = 0; i < 3; i += 1) {
        const x = (i - 1) * 0.88,
          chaise = i === 2,
          depth = chaise ? d - 0.05 : 0.87,
          z = chaise ? 0 : -0.3;
        b(0.85, 0.14, depth - 0.03, x, 0.13, z, m.woodDark);
        cushion(group, 0.86, 0.29, depth, x, 0.35, z, m.fabricDark);
        cushion(group, 0.85, 0.18, depth - 0.025, x, 0.48, z + 0.015, m.fabric, m.fabricDark);
        cushion(group, 0.86, 0.42, 0.22, x, 0.66, -0.61, m.fabric).rotation.x = -0.08;
      }
      for (const side of [-1, 1]) {
        cushion(group, 0.16, 0.38, 0.9, side * (w / 2 - 0.08), 0.55, -0.28, m.fabricDark);
        const pillow = cushion(
          group,
          0.35,
          0.35,
          0.14,
          side * 1.09,
          0.65,
          -0.34,
          side < 0 ? m.cream : m.mustard,
        );
        pillow.rotation.set(-0.17, side * 0.25, side * 0.14);
      }
    } else if (name === "ceramic_table_lamp") {
      const profile = [
          [0.075, 0],
          [0.09, 0.015],
          [0.105, 0.08],
          [0.09, 0.15],
          [0.045, 0.19],
          [0.035, 0.23],
        ],
        base = new THREE.Mesh(
          new THREE.LatheGeometry(
            profile.map(([r, y]) => new THREE.Vector2(r, y)),
            24,
          ),
          m.earthenware,
        );
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);
      cylinder(group, 0.012, 0.012, 0.12, 0, 0.24, 0, m.brass, 12);
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.17, 0.22, 32, 1, true),
        m.curtain,
      );
      shade.position.y = 0.4;
      shade.castShadow = true;
      shade.receiveShadow = true;
      group.add(shade);
      for (const [r, y] of [
        [0.115, 0.51],
        [0.17, 0.29],
      ]) {
        const seam = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 4, 32), m.cream);
        seam.rotation.x = Math.PI / 2;
        seam.position.y = y;
        group.add(seam);
      }
      cylinder(group, 0.025, 0.025, 0.06, 0, 0.35, 0, m.opal, 12);
      fixtureLight(group, 4, 0, 0.32, 0);
    } else if (name === "woven_pendant") {
      cylinder(group, 0.07, 0.07, 0.04, 0, h - 0.02, 0, m.brass, 16);
      rod([0, h - 0.05, 0], [0, h - 0.57, 0], 0.005, m.woodDark);
      for (let i = 0; i < 24; i += 1) {
        const angle = (i * Math.PI * 2) / 24,
          points = [
            [0.055, h - 0.55],
            [0.18, h - 0.63],
            [0.29, h - 0.79],
            [0.27, h - 0.9],
          ];
        curvedRod(
          group,
          points.map(([r, y]) => [Math.cos(angle) * r, y, Math.sin(angle) * r]),
          0.006,
          m.wicker,
          12,
        );
      }
      for (const [r, y] of [
        [0.07, h - 0.56],
        [0.16, h - 0.62],
        [0.23, h - 0.7],
        [0.285, h - 0.8],
        [0.27, h - 0.9],
      ]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 4, 32), m.jute);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        ring.castShadow = true;
        group.add(ring);
      }
      cylinder(group, 0.028, 0.028, 0.08, 0, h - 0.76, 0, m.opal, 12);
      fixtureLight(group, 12, 0, h - 0.89, 0);
    } else if (name === "arched_mirror") {
      const outline = archedOutline(w, h),
        inner = archedOutline(w, h, 0.027);
      outline.holes.push(inner);
      const frame = new THREE.Mesh(
        new THREE.ExtrudeGeometry(outline, { bevelEnabled: false, curveSegments: 24, depth: d }),
        m.brass,
      );
      frame.position.set(0, h / 2, -d / 2);
      frame.castShadow = true;
      frame.receiveShadow = true;
      group.add(frame);
      addMirrorSurface(group, w, d, h, m.chrome, inner);
    } else if (name === "tufted_sofa") {
      for (const x of [-0.78, 0.78]) {
        for (const z of [-0.28, 0.28]) {
          rod([x * 1.04, 0, z * 1.04], [x, 0.25, z], 0.028);
        }
      }
      b(w - 0.08, 0.09, d - 0.1, 0, 0.25, 0, m.woodDark);
      cushion(group, w, 0.2, d - 0.04, 0, 0.38, 0.025, m.ash, m.ash);
      const back = new THREE.Group();
      back.position.set(0, 0.64, -0.28);
      back.rotation.x = -0.13;
      group.add(back);
      const upholstery = cushion(back, w - 0.04, 0.46, 0.2, 0, 0, 0, m.ash),
        positions = upholstery.geometry.attributes.position;
      for (let i = 0; i < positions.count; i += 1) {
        if (positions.getZ(i) <= 0) {
          continue;
        }
        let inset = 0;
        for (const x of [-0.62, 0, 0.62]) {
          for (const y of [-0.09, 0.09]) {
            inset +=
              0.018 *
              Math.exp(-((positions.getX(i) - x) ** 2 + (positions.getY(i) - y) ** 2) / 0.004);
          }
        }
        positions.setZ(i, positions.getZ(i) - inset);
      }
      upholstery.geometry.computeVertexNormals();
      for (const x of [-0.62, 0, 0.62]) {
        for (const y of [-0.09, 0.09]) {
          const button = cylinder(back, 0.009, 0.009, 0.005, x, y, 0.085, m.ash, 8);
          button.rotation.x = Math.PI / 2;
        }
      }
      const pillow = cushion(group, 0.38, 0.4, 0.14, 0.64, 0.65, -0.08, m.mustard);
      pillow.rotation.set(-0.18, -0.1, -0.12);
    } else if (name === "sea_table" || name === "ochre_table") {
      const finish = name === "sea_table" ? m.sea : m.mustard;
      cylinder(group, w / 2, w / 2 - 0.006, 0.024, 0, h - 0.012, 0, finish, 32);
      cylinder(group, 0.035, 0.045, h - 0.1, 0, (h - 0.1) / 2 + 0.065, 0, finish, 16);
      cylinder(group, 0.14, 0.17, 0.035, 0, 0.018, 0, finish, 24);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 10), finish);
      bead.position.y = 0.12;
      group.add(bead);
    } else if (name === "citrus_print" || name === "coastal_print") {
      b(w, h, d, 0, h / 2, 0, m.wood);
      b(w - 0.02, h - 0.02, 0.009, 0, h / 2, d / 2 + 0.003, m.cream);
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 384;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#e6dcc2";
      ctx.fillRect(0, 0, 256, 384);
      ctx.fillStyle = "#29596a";
      ctx.fillRect(16, 16, 224, 328);
      if (name === "citrus_print") {
        for (let i = 0; i < 16; i += 1) {
          const x = 26 + ((i * 83) % 207),
            y = 35 + ((i * 61) % 270);
          ctx.strokeStyle = "#657650";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(x - 16, y + 32);
          ctx.lineTo(x + 8, y - 27);
          ctx.stroke();
          ctx.fillStyle = i % 2 ? "#dcb65a" : "#edcc73";
          ctx.beginPath();
          ctx.ellipse(x, y, 15, 22, -0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#81905c";
          ctx.beginPath();
          ctx.ellipse(x + 16, y - 22, 7, 20, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#83adae";
        ctx.fillRect(16, 16, 224, 143);
        ctx.fillStyle = "#c7d6c6";
        ctx.beginPath();
        ctx.arc(185, 70, 24, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 6; i += 1) {
          const x = 24 + i * 35,
            y = 206 + Math.sin(i * 1.7) * 30;
          ctx.fillStyle = i % 2 ? "#d4b48d" : "#efe2bd";
          ctx.fillRect(x, y, 39, 340 - y);
          ctx.fillStyle = "#b16d4b";
          ctx.fillRect(x - 2, y, 43, 6);
          ctx.fillStyle = "#456969";
          ctx.fillRect(x + 8, y + 18, 10, 18);
          ctx.fillRect(x + 24, y + 18, 8, 18);
        }
      }
      ctx.font = "16px Georgia";
      ctx.textAlign = "center";
      ctx.fillStyle = "#354c45";
      ctx.fillText(name === "citrus_print" ? "C I T R U S" : "A E G E A N", 128, 369);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      const paper = mat("#ffffff", 0.95);
      paper.map = texture;
      const print = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.055, h - 0.055), paper);
      print.position.set(0, h / 2, d / 2 + 0.009);
      group.add(print);
    } else if (name === "wall_spot_pair") {
      b(w, 0.065, 0.04, 0, h * 0.7, -0.065, m.white);
      for (const side of [-1, 1]) {
        rod([side * 0.19, h * 0.7, -0.04], [side * 0.2, h * 0.5, 0.04], 0.014, m.metal);
        const head = cylinder(group, 0.048, 0.045, 0.11, side * 0.2, h * 0.4, 0.04, m.white, 16);
        head.rotation.x = -0.55;
        const lens = cylinder(
          group,
          0.039,
          0.039,
          0.005,
          side * 0.2,
          h * 0.4 - 0.049,
          0.069,
          m.opal,
          16,
        );
        lens.rotation.x = -0.55;
        fixtureLight(group, 2.5, side * 0.2, h * 0.4 - 0.07, 0.1);
      }
    } else if (name === "bathroom_vanity") {
      cabinetShell(group, w, d - 0.025, 0.04, h - 0.055, m.white, -0.012);
      for (const y of [0.26, 0.59]) {
        b(w - 0.025, 0.3, 0.025, 0, y, d / 2 - 0.01, m.white);
        b(0.18, 0.015, 0.03, 0, y + 0.1, d / 2 + 0.016, m.brass);
      }
      for (const side of [-1, 1]) {
        b(0.065, 0.055, d + 0.01, side * (w / 2 - 0.0325), h - 0.0275, 0, m.porcelain);
        b(w - 0.13, 0.055, 0.075, 0, h - 0.0275, side * (d / 2 - 0.0325), m.porcelain);
      }
      rectangularBasin(group, w - 0.13, d - 0.14, 0, h - 0.005, 0);
      curvedRod(
        group,
        [
          [0, h, -0.2],
          [0, h + 0.17, -0.2],
          [0, h + 0.2, -0.11],
          [0, h + 0.15, -0.09],
        ],
        0.012,
        m.metal,
      );
      b(0.07, 0.012, 0.022, 0.025, h + 0.04, -0.2, m.metal);
    } else if (name === "frameless_shower") {
      b(w, 0.028, d, 0, 0.014, 0, m.stone);
      for (const side of [-1, 1]) {
        addGlassPane(
          group,
          d,
          h - 0.028,
          side * (w / 2 - 0.006),
          h / 2 + 0.014,
          0,
          (side * Math.PI) / 2,
        );
        rod([(side * w) / 2, h, -d / 2], [(side * w) / 2, h, d / 2], 0.006, m.metal);
      }
      addGlassPane(group, w - 0.012, h - 0.028, 0, h / 2 + 0.014, d / 2 - 0.006);
      for (const y of [0.3, 1.7]) {
        b(0.025, 0.045, 0.018, -w / 2 + 0.015, y, d / 2 + 0.008, m.metal);
      }
      rod([w / 2 - 0.08, 0.95, d / 2 + 0.03], [w / 2 - 0.08, 1.12, d / 2 + 0.03], 0.009, m.metal);
      const shower = new THREE.Group();
      addReferenceAsset("shower_set", shower);
      shower.position.set(0, 0, -d / 2 + 0.065);
      group.add(shower);
      const drain = new THREE.Group();
      addReferenceAsset("floor_drain", drain);
      drain.position.set(0.12, 0.028, -0.2);
      group.add(drain);
    } else if (name === "accent_chair") {
      for (const side of [-1, 1]) {
        rod([side * 0.28, 0.025, 0.3], [side * 0.25, 0.43, -0.26], 0.02, m.metal);
        rod([side * 0.28, 0.025, -0.3], [side * 0.25, 0.43, 0.26], 0.02, m.metal);
        b(0.055, 0.04, 0.62, side * 0.33, 0.59, 0, m.woodDark);
        rod([side * 0.3, 0.38, -0.23], [side * 0.32, 0.59, -0.26], 0.014, m.metal);
        rod([side * 0.3, 0.38, 0.23], [side * 0.32, 0.59, 0.26], 0.014, m.metal);
      }
      cushion(group, 0.6, 0.17, 0.66, 0, 0.43, 0.03, m.leather);
      cushion(group, 0.6, 0.47, 0.16, 0, 0.65, -0.27, m.leather).rotation.x = -0.16;
      cushion(group, 0.32, 0.22, 0.12, 0.04, 0.61, -0.13, m.cream).rotation.z = 0.15;
    } else if (name === "wall_tv") {
      b(w * 0.4, 0.24, 0.035, 0, h / 2, -0.01, m.metal);
      b(w, h, 0.045, 0, h / 2, 0, m.screen);
      b(w - 0.022, h - 0.022, 0.008, 0, h / 2, 0.026, m.screen);
      b(0.05, 0.006, 0.009, 0, 0.006, 0.03, m.metal);
    } else if (name === "wall_outlet") {
      b(w, h, d, 0, h / 2, 0, m.white);
      for (const x of [-0.039, 0.039]) {
        const face = cylinder(group, 0.025, 0.025, 0.004, x, h / 2, d / 2 + 0.002, m.porcelain, 16);
        face.rotation.x = Math.PI / 2;
        for (const pin of [-0.009, 0.009]) {
          const socket = cylinder(
            group,
            0.004,
            0.004,
            0.003,
            x + pin,
            h / 2,
            d / 2 + 0.005,
            m.screen,
            8,
          );
          socket.rotation.x = Math.PI / 2;
        }
      }
    } else if (name === "botanical_print") {
      b(w, h, d, 0, h / 2, 0, m.wood);
      b(w - 0.025, h - 0.025, 0.005, 0, h / 2, d / 2 + 0.002, m.cream);
      rod([0, 0.075, 0.027], [0.005, 0.44, 0.027], 0.003, m.olive);
      for (let i = 0; i < 7; i += 1) {
        const side = i % 2 ? -1 : 1,
          leaf = new THREE.Mesh(new THREE.CircleGeometry(0.07, 8), m.olive);
        leaf.scale.set(0.52, 1, 1);
        leaf.position.set(side * 0.042, 0.18 + i * 0.035, 0.028);
        leaf.rotation.z = side * -0.65;
        group.add(leaf);
      }
    } else if (name === "ceramic_vessels") {
      for (const [x, height, radius, finish] of [
        [-0.14, 0.24, 0.065, m.porcelain],
        [0, 0.32, 0.07, m.clay],
        [0.16, 0.14, 0.06, m.olive],
      ]) {
        const profile = [
            [0.7, 0],
            [1, 0.1],
            [1, 0.5],
            [0.55, 0.85],
            [0.55, 1],
            [0.4, 1],
            [0.4, 0.83],
          ],
          vessel = new THREE.Mesh(
            new THREE.LatheGeometry(
              profile.map(([r, y]) => new THREE.Vector2(r * radius, y * height)),
              20,
            ),
            finish,
          );
        vessel.position.x = x;
        vessel.castShadow = true;
        vessel.receiveShadow = true;
        group.add(vessel);
      }
    } else if (name === "roman_blind") {
      b(w + 0.04, 0.06, 0.08, 0, h - 0.03, 0, m.woodDark);
      for (let i = 0; i < 10; i += 1) {
        b(
          w,
          h / 10 + 0.015,
          0.026,
          0,
          h - 0.09 - (i * (h - 0.09)) / 10,
          Math.sin(i * 0.5) * 0.01,
          m.curtain,
        ).rotation.x = -0.06;
      }
      rod([w / 2 - 0.025, 0.08, 0.03], [w / 2 - 0.025, h - 0.08, 0.03], 0.003, m.cream);
    } else if (name === "citrus_bowl") {
      const bowl = new THREE.Mesh(
        new THREE.LatheGeometry(
          [
            [0.04, 0],
            [0.07, 0.02],
            [0.12, 0.06],
            [0.14, 0.08],
            [0.13, 0.08],
            [0.11, 0.045],
            [0.04, 0.014],
          ].map(([r, y]) => new THREE.Vector2(r, y)),
          20,
        ),
        m.porcelain,
      );
      group.add(bowl);
      for (let i = 0; i < 5; i += 1) {
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), m.amber);
        fruit.position.set(
          Math.cos(i * 2.4) * 0.064,
          0.087 + (i % 2) * 0.03,
          Math.sin(i * 2.4) * 0.064,
        );
        fruit.scale.set(1.1, 0.9, 0.9);
        fruit.castShadow = true;
        group.add(fruit);
      }
    } else if (name === "linen_throw") {
      drapedCover(group, w - 0.24, d, 0, 0.15, 0, m.linen);
    } else if (name === "book_stack") {
      for (let i = 0; i < 3; i += 1) {
        const book = new THREE.Group();
        b(w - i * 0.022, 0.034, d, 0, 0.017, 0, m.cream);
        for (const y of [0, 0.035]) {
          b(w - i * 0.022 + 0.008, 0.004, d + 0.008, 0, y, 0, i % 2 ? m.olive : m.clay);
        }
        book.position.y = 0.004 + i * 0.043;
        book.rotation.y = (i - 1) * 0.09;
        group.add(book);
      }
    } else if (name === "breakfast_bar") {
      b(w, 0.055, d, 0, h - 0.028, 0, m.woodDark);
      for (const x of [-0.55, 0.55]) {
        rod([x, h - 0.07, 0.18], [x, h - 0.48, -0.18], 0.025, m.wood);
        b(0.05, 0.5, 0.04, x, h - 0.3, -0.2);
      }
    } else if (name === "cafe_setting") {
      b(w, 0.025, d, 0, 0.014, 0, m.wicker);
      for (const x of [-0.2, 0.2]) {
        cylinder(group, 0.105, 0.09, 0.014, x, 0.04, 0, m.white);
        cylinder(group, 0.055, 0.042, 0.08, x, 0.087, 0, m.white);
        cylinder(group, 0.047, 0.047, 0.003, x, 0.129, 0, m.woodDark);
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.008, 5, 10), m.white);
        handle.position.set(x + 0.055, 0.092, 0);
        group.add(handle);
      }
      cylinder(group, 0.048, 0.055, 0.17, 0, 0.11, -0.06, m.clay);
      foliage(group, 0, 0.19, -0.06, 0.08, 0.07, 4);
    } else if (name === "kitchen_accessories") {
      b(0.28, 0.018, 0.26, -0.15, 0.01, 0, m.wood);
      for (const [x, height, finish] of [
        [0.08, 0.27, m.olive],
        [0.23, 0.22, m.clay],
      ]) {
        cylinder(group, 0.045, 0.045, height, x, height / 2, -0.06, finish);
        cylinder(group, 0.018, 0.021, 0.07, x, height + 0.035, -0.06, m.woodDark);
      }
      cylinder(group, 0.065, 0.055, 0.16, -0.2, 0.1, -0.04, m.white);
      for (let i = 0; i < 4; i += 1) {
        rod([-0.23 + i * 0.02, 0.12, -0.04], [-0.26 + i * 0.035, 0.39, -0.04], 0.008, m.wood);
        const spoon = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), m.wood);
        spoon.scale.set(0.019, 0.032, 0.009);
        spoon.position.set(-0.26 + i * 0.035, 0.39, -0.04);
        group.add(spoon);
      }
    } else if (name === "curtain_pair") {
      rod([-w / 2, h - 0.025, 0], [w / 2, h - 0.025, 0], 0.018, m.woodDark);
      for (const side of [-1, 1]) {
        const geometry = new THREE.PlaneGeometry(w * 0.12, h - 0.09, 24, 10),
          positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i += 1) {
          const x = positions.getX(i),
            y = positions.getY(i);
          const drop = ((h - 0.09) / 2 - y) / (h - 0.09),
            phase =
              (x / (w * 0.12)) * Math.PI * 8 + side * 0.65 + drop * 0.4 + Math.sin(y * 1.7) * 0.13,
            amplitude = 0.025 + drop * 0.016;
          positions.setXYZ(
            i,
            x * (0.85 + drop * 0.18) + side * 0.008 * Math.sin(drop * Math.PI),
            y + drop ** 8 * 0.009 * Math.sin(x * 22 + side),
            Math.cos(phase) * amplitude + 0.009 * Math.sin(y * 2.2 + side) * drop,
          );
          geometry.attributes.uv.setXY(
            i,
            x / m.curtain.userData.textureScale,
            y / m.curtain.userData.textureScale,
          );
        }
        geometry.computeVertexNormals();
        const panel = new THREE.Mesh(geometry, m.curtain);
        panel.position.set(side * w * 0.44, (h - 0.09) / 2 + 0.025, 0.025);
        panel.castShadow = true;
        panel.receiveShadow = true;
        group.add(panel);
        for (const offset of [-0.035, 0, 0.035]) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.023, 0.004, 4, 12), m.woodDark);
          ring.position.set(side * w * 0.44 + offset, h - 0.04, 0.01);
          group.add(ring);
        }
      }
    } else if (name === "towel_rail") {
      rod([-0.29, h - 0.025, 0.06], [0.29, h - 0.025, 0.06], 0.013, m.metal);
      for (const x of [-0.29, 0.29]) {
        rod([x, h - 0.025, -0.05], [x, h - 0.025, 0.06], 0.018, m.metal);
      }
      b(0.4, 0.6, 0.025, -0.03, h - 0.33, 0.075, m.linen);
      b(0.4, 0.022, 0.03, -0.03, h - 0.59, 0.078, m.cream);
    } else if (name === "flower_border") {
      b(w, 0.065, d, 0, 0.032, 0, m.soil);
      for (let i = 0; i < 15; i += 1) {
        const x = (i / 14 - 0.5) * (w - 0.2),
          z = Math.sin(i * 2.4) * 0.2;
        foliage(group, x, 0.055, z, 0.27 + (i % 3) * 0.08, 0.17, 5);
        for (let j = 0; j < 3; j += 1) {
          const flower = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.038, 0),
            i % 3 ? m.lavender : m.cream,
          );
          flower.position.set(
            x + Math.cos(j * 2.4) * 0.09,
            0.36 + (i % 3) * 0.08,
            z + Math.sin(j * 2.4) * 0.09,
          );
          flower.scale.y = 2;
          group.add(flower);
        }
      }
    } else if (name === "grape_trellis") {
      for (const x of [-w / 2, w / 2]) {
        b(0.045, h, 0.045, x, h / 2, 0, m.woodDark);
      }
      for (let i = 0; i < 5; i += 1) {
        rod([-w / 2, 0.5 + i * 0.47, 0], [w / 2, 0.5 + i * 0.47, 0], 0.009, m.metal);
        for (let j = 0; j < 4; j += 1) {
          foliage(group, -0.95 + j * 0.6, 0.3 + i * 0.45, 0, 0.35, 0.26, 6);
        }
      }
    } else if (["cypress", "citrus_tree", "olive_tree", "topiary_tree"].includes(name)) {
      cylinder(group, 0.07, 0.13, h * 0.62, 0, h * 0.31, 0, m.woodDark);
      const leaf = (x, y, z, sx, sy, sz, finish) => {
        const loose = name === "olive_tree" || name === "citrus_tree",
          pods = loose
            ? Array.from({ length: 5 }, (_, index) => {
                const angle = index * 2.4;
                return {
                  scale: 0.48 + (index % 3) * 0.07,
                  x: Math.cos(angle) * sx * 0.4,
                  y: ((index % 3) - 1) * sy * 0.28,
                  z: Math.sin(angle) * sz * 0.4,
                };
              })
            : [{ scale: 0.8, x: 0, y: 0, z: 0 }];
        for (const pod of pods) {
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, loose ? 6 : 8, loose ? 4 : 6),
            finish,
          );
          mesh.position.set(x + pod.x, y + pod.y, z + pod.z);
          mesh.scale.set(sx * pod.scale * 0.85, sy * pod.scale, sz * pod.scale * 0.85);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        }
        if (sx < 0.1) {
          return;
        }
        for (let i = 0; i < 48; i += 1) {
          const angle = i * 2.4,
            latitude = Math.acos(1 - (2 * (i + 0.5)) / 48),
            pod = pods[i % pods.length],
            tuft = new THREE.Mesh(gardenLeafGeometry.clone(), i % 5 ? finish : m.leafLight);
          tuft.position.set(
            x + pod.x + sx * pod.scale * Math.sin(latitude) * Math.cos(angle),
            y + pod.y + sy * pod.scale * Math.cos(latitude),
            z + pod.z + sz * pod.scale * Math.sin(latitude) * Math.sin(angle),
          );
          tuft.scale.set(0.48 + (i % 3) * 0.08, 0.7, name === "olive_tree" ? 0.5 : 1);
          tuft.rotation.set(angle, latitude, angle * 0.3);
          tuft.castShadow = true;
          tuft.receiveShadow = true;
          group.add(tuft);
        }
      };
      if (name === "cypress") {
        for (let i = 0; i < 5; i += 1) {
          leaf(0, 1 + i * 0.48, 0, 0.55 - i * 0.08, 0.7 - i * 0.065, 0.55 - i * 0.08, m.foliage);
        }
      } else if (name === "topiary_tree") {
        for (let i = 0; i < 14; i += 1) {
          const angle = i * 2.4,
            radius = 0.6 * Math.sqrt((i + 1) / 14);
          leaf(
            Math.cos(angle) * radius,
            2.2 + (i % 4) * 0.14,
            Math.sin(angle) * radius,
            0.5,
            0.56,
            0.5,
            i % 3 ? m.foliage : m.olive,
          );
        }
      } else {
        for (let i = 0; i < 9; i += 1) {
          const angle = i * 2.4,
            x = Math.cos(angle) * 0.63,
            z = Math.sin(angle) * 0.63,
            y = 1.65 + (i % 3) * 0.25;
          rod([0, 0.8, 0], [x, y, z], 0.04, m.woodDark);
          leaf(x, y, z, w * 0.23, 0.58, d * 0.23, name === "olive_tree" ? m.olive : m.foliage);
          if (name === "citrus_tree") {
            leaf(x * 1.45, y - 0.22, z * 1.45, 0.065, 0.08, 0.065, m.amber);
          }
        }
      }
    } else if (name === "palm") {
      cylinder(group, 0.13, 0.2, 1.65, 0, 0.825, 0, m.woodDark);
      for (let i = 0; i < 12; i += 1) {
        const angle = (i * Math.PI) / 6,
          frond = new THREE.Group();
        frond.rotation.y = angle;
        group.add(frond);
        for (let j = 0; j < 9; j += 1) {
          const t = j / 8,
            blade = box(
              frond,
              0.035,
              0.018,
              0.68 * (1 - t) + 0.12,
              0.12 + t * 1.02,
              1.7 + Math.sin(t * Math.PI) * 0.72,
              0,
              i % 3 ? m.foliage : m.olive,
            );
          blade.rotation.x = 0.2;
          blade.rotation.y = 0.35;
        }
      }
    } else if (name === "sleeping_loft") {
      const cupboard = new THREE.Group();
      addReferenceAsset("timber_wardrobe", cupboard);
      cupboard.position.set(0.33, 0, -1.42);
      group.add(cupboard);
      b(w - 0.85, 0.16, 2.2, -0.425, 2.15, -0.7, m.woodDark);
      for (const x of [-w / 2 + 0.06, w / 2 - 0.91]) {
        for (const z of [-1.72, 0.35]) {
          b(0.1, 2.15, 0.1, x, 1.075, z, m.woodDark);
        }
      }
      for (let i = 0; i < 14; i += 1) {
        b(0.035, 1.05, 0.035, -1.65 + i * 0.19, 2.755, 0.38, m.woodDark);
      }
      b(w - 0.85, 0.065, 0.065, -0.425, 3.31, 0.38, m.woodDark);
      for (const x of [-1.13, 0.05]) {
        b(0.95, 0.2, 1.95, x, 2.34, -0.72, m.cream);
        b(0.96, 0.055, 1.38, x, 2.465, -0.42, m.linen);
        cushion(group, 0.67, 0.12, 0.38, x, 2.5, -1.38, m.linen);
        rod([x, 2.57, -0.5], [x, 2.57, -0.22], 0.065, m.cream);
      }
      for (let i = 0; i < 12; i += 1) {
        const y = ((i + 1) * 2.23) / 12,
          z = 1.65 - i * 0.28;
        b(0.75, 0.055, 0.28, 1.29, y, z, m.woodDark);
        b(0.035, 0.85, 0.035, 1.65, y + 0.425, z, m.woodDark);
      }
      rod([1.65, 1.02, 1.65], [1.65, 3.08, -1.43], 0.035, m.woodDark);
      for (const x of [0.94, 1.64]) {
        rod([x, 0.08, 1.72], [x, 2.17, -1.48], 0.06, m.woodDark);
      }
    } else if (name === "patio_chair") {
      for (const side of [-1, 1]) {
        for (const front of [-1, 1]) {
          rod([side * 0.23, 0, front * 0.23], [side * 0.2, 0.45, front * 0.18], 0.025, m.cream);
        }
        rod([side * 0.2, 0.43, -0.18], [side * 0.22, h, -0.24], 0.024, m.cream);
      }
      for (let i = 0; i < 5; i += 1) {
        b(w - 0.045, 0.032, 0.067, 0, 0.45, -0.16 + i * 0.083, m.enamel);
      }
      for (const y of [0.58, 0.66, 0.74]) {
        const slat = b(w - 0.04, 0.055, 0.035, 0, y, -0.22 - (y - 0.58) * 0.1, m.enamel);
        slat.rotation.x = -0.1;
      }
    } else if (name === "ceiling_fan") {
      cylinder(group, 0.09, 0.07, 0.05, 0, h - 0.025, 0, m.white);
      cylinder(group, 0.022, 0.022, 0.22, 0, h - 0.14, 0, m.white);
      cylinder(group, 0.13, 0.1, 0.08, 0, h - 0.28, 0, m.white);
      for (let i = 0; i < 3; i += 1) {
        const blade = new THREE.Group();
        blade.rotation.y = (i * Math.PI * 2) / 3;
        group.add(blade);
        box(blade, 0.49, 0.022, 0.13, 0.34, h - 0.28, 0, m.white).rotation.x = 0.12;
      }
    } else if (name === "globe_lamp") {
      cylinder(group, 0.1, 0.14, 0.05, 0, 0.025, 0, m.screen);
      cylinder(group, 0.022, 0.032, h - 0.3, 0, (h - 0.3) / 2, 0, m.screen);
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 12), m.opal);
      globe.position.y = h - 0.2;
      group.add(globe);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 32), m.screen);
      ring.position.y = h - 0.21;
      group.add(ring);
      fixtureLight(group, 8, 0, h - 0.2, 0);
    } else if (name === "ac_condenser") {
      b(w, h - 0.1, d, 0, h / 2, 0, m.white);
      for (const x of [-0.28, 0.28]) {
        b(0.045, 0.06, d + 0.05, x, 0.03, 0, m.metal);
      }
      const fan = cylinder(group, 0.22, 0.22, 0.018, -0.1, 0.32, d / 2 + 0.012, m.slate, 32);
      fan.rotation.x = Math.PI / 2;
      for (let i = 1; i <= 6; i += 1) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(i * 0.033, 0.004, 4, 32), m.metal);
        ring.position.set(-0.1, 0.32, d / 2 + 0.025);
        group.add(ring);
      }
      for (const angle of [0, Math.PI / 3, -Math.PI / 3]) {
        b(0.012, 0.42, 0.012, -0.1, 0.32, d / 2 + 0.03, m.metal).rotation.z = angle;
      }
      b(0.12, 0.035, 0.012, 0.28, 0.46, d / 2 + 0.015, m.olive);
    } else if (name === "retro_fridge") {
      const enamel = (width, height, depth, x, y, z) => {
        const part = new THREE.Mesh(
          new RoundedBoxGeometry(width, height, depth, 3, Math.min(0.055, depth * 0.45)),
          m.enamel,
        );
        part.position.set(x, y, z);
        part.castShadow = true;
        part.receiveShadow = true;
        group.add(part);
      };
      enamel(w, h - 0.06, d - 0.03, 0, h / 2, 0);
      b(w - 0.035, 0.025, d - 0.08, 0, 0.025, 0, m.slate);
      for (const [y, height] of [
        [0.51, 0.91],
        [1.26, 0.52],
      ]) {
        b(w - 0.035, height + 0.006, 0.035, 0, y, d / 2 - 0.064, m.slate);
        enamel(w - 0.025, height, 0.08, 0, y, d / 2 - 0.03);
        curvedRod(
          group,
          [
            [-0.22, y + height * 0.25, d / 2 + 0.015],
            [-0.19, y + height * 0.25, d / 2 + 0.055],
            [-0.025, y + height * 0.25, d / 2 + 0.055],
            [0.005, y + height * 0.25, d / 2 + 0.015],
          ],
          0.012,
          m.chrome,
          12,
        );
      }
    } else if (name === "roller_shutter") {
      b(w, 0.24, d, 0, h - 0.12, 0, m.cream);
      for (const side of [-1, 1]) {
        b(0.035, h - 0.24, 0.045, side * (w / 2 - 0.02), (h - 0.24) / 2, 0, m.woodDark);
      }
      for (let i = 0; i < 7; i += 1) {
        b(w - 0.06, 0.044, 0.035, 0, h - 0.27 - i * 0.048, 0, m.woodDark);
      }
    } else if (name === "floor_drain") {
      b(w, h, d, 0, h / 2, 0, m.metal);
      for (let x = -2; x <= 2; x += 1) {
        for (let z = -2; z <= 2; z += 1) {
          cylinder(group, 0.008, 0.008, 0.002, x * 0.027, h + 0.001, z * 0.027, m.screen, 8);
        }
      }
    } else if (name === "shower_set") {
      rod([-0.16, 0.95, 0], [0.16, 0.95, 0], 0.027, m.metal);
      rod([0.05, 1.05, 0], [0.05, h - 0.12, 0], 0.015, m.metal);
      rod([0.05, h - 0.25, 0.02], [0.05, h - 0.06, 0.08], 0.022, m.metal);
      const head = cylinder(group, 0.055, 0.055, 0.018, 0.05, h - 0.06, 0.1, m.metal);
      head.rotation.x = Math.PI / 3;
      const points = [
          new THREE.Vector3(-0.08, 0.95, 0.05),
          new THREE.Vector3(-0.14, 0.42, 0.12),
          new THREE.Vector3(0.11, 0.48, 0.13),
          new THREE.Vector3(0.05, h - 0.24, 0.07),
        ],
        hose = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.009, 6, false),
          m.metal,
        );
      hose.castShadow = true;
      hose.receiveShadow = true;
      group.add(hose);
    } else if (name === "dumbbells") {
      for (const z of [-0.14, 0.14]) {
        rod([-0.32, 0.15, z], [0.32, 0.15, z], 0.02, m.terracotta);
        for (const x of [-0.25, -0.19, 0.19, 0.25]) {
          const plate = cylinder(group, 0.14, 0.14, 0.045, x, 0.15, z, m.screen, 12);
          plate.rotation.z = Math.PI / 2;
        }
      }
    } else if (name === "wicker_basket") {
      b(w, h, d, 0, h / 2, 0, m.wicker);
      b(w - 0.04, 0.012, d - 0.04, 0, h + 0.001, 0, m.soil);
      b(0.12, 0.035, 0.012, 0, h * 0.7, d / 2 + 0.003, m.woodDark);
    } else if (name === "kilim_rug") {
      const rug = b(w, h, d, 0, h / 2, 0, m.kilim);
      rug.geometry.attributes.uv.needsUpdate = true;
      for (const side of [-1, 1]) {
        for (let i = 0; i < 24; i += 1) {
          b(
            0.008,
            0.004,
            0.045,
            ((i - 11.5) * (w - 0.05)) / 24,
            0.004,
            side * (d / 2 + 0.015),
            m.cream,
          );
        }
      }
    } else if (name === "bbq") {
      for (const x of [-0.32, 0.32]) {
        for (const z of [-0.19, 0.19]) {
          rod([x, 0, z], [x, 0.77, z], 0.025, m.screen);
        }
      }
      b(w, 0.22, d, 0, 0.8, 0, m.screen);
      b(w * 0.82, 0.025, d * 0.8, 0, 0.92, 0, m.slate);
      for (let i = 0; i < 12; i += 1) {
        b(0.015, 0.015, d * 0.84, (i - 5.5) * 0.058, 0.94, 0, m.metal);
      }
      b(w * 0.85, 0.04, d * 0.8, 0, 0.28, 0, m.screen);
      rod([-0.46, 0.82, -0.14], [-0.46, 0.82, 0.14], 0.025, m.wood);
    } else if (name === "terracotta_pot") {
      cylinder(group, 0.25, 0.16, 0.4, 0, 0.2, 0, m.earthenware, 24);
      cylinder(group, 0.26, 0.26, 0.055, 0, 0.39, 0, m.clay);
      cylinder(group, 0.22, 0.22, 0.012, 0, 0.42, 0, m.soil);
      for (let i = 0; i < 3; i += 1) {
        const angle = i * 2.4;
        foliage(group, Math.cos(angle) * 0.08, 0.42, Math.sin(angle) * 0.08, 0.26, 0.17, 7);
      }
    } else if (name === "stone_path" || name === "gym_mat") {
      b(w, h, d, 0, h / 2, 0, name === "stone_path" ? m.flagstone : m.screen);
    } else if (name === "retaining_wall") {
      b(w, h - 0.05, d, 0, (h - 0.05) / 2, 0, m.flagstone);
      b(w + 0.06, 0.05, d + 0.06, 0, h - 0.025, 0, m.stone);
    } else if (name === "garden_steps") {
      for (let i = 0; i < 4; i += 1) {
        b(
          w,
          (h * (i + 1)) / 4,
          d / 4,
          0,
          (h * (i + 1)) / 8,
          d / 2 - (d * (i + 0.5)) / 4,
          m.flagstone,
        );
      }
    } else if (name === "timber_pergola") {
      for (const x of [-1, 1]) {
        for (const z of [-1, 1]) {
          b(0.12, h, 0.12, x * (w / 2 - 0.08), h / 2, z * (d / 2 - 0.08), m.woodDark);
        }
      }
      for (const z of [-1, 1]) {
        b(w, 0.15, 0.14, 0, h - 0.08, z * (d / 2 - 0.08), m.woodDark);
      }
      for (let i = 0; i < 12; i += 1) {
        b(0.075, 0.12, d, ((i - 5.5) * w) / 12, h - 0.06, 0, m.wood);
      }
    } else if (name === "trellis") {
      for (let i = 0; i < 10; i += 1) {
        const x = -w / 2 + (i * w) / 9;
        rod([x, 0, 0], [Math.min(w / 2, x + h), Math.min(h, w / 2 - x), 0], 0.018, m.woodDark);
        rod(
          [x, h, 0.025],
          [Math.min(w / 2, x + h), h - Math.min(h, w / 2 - x), 0.025],
          0.018,
          m.woodDark,
        );
        if (i > 0) {
          rod([-w / 2, (i * h) / 9, 0], [w / 2 - (i * w) / 9, h, 0], 0.018, m.woodDark);
          rod([-w / 2, h - (i * h) / 9, 0.025], [w / 2 - (i * w) / 9, 0, 0.025], 0.018, m.woodDark);
        }
      }
      for (const x of [-w / 2, w / 2]) {
        b(0.07, h, d, x, h / 2, 0, m.woodDark);
      }
    } else if (name === "outdoor_kitchen") {
      b(w, h - 0.08, d, 0, (h - 0.08) / 2, 0, m.plaster);
      b(w + 0.06, 0.08, d + 0.04, 0, h - 0.04, 0, m.stone);
      b(0.55, 0.012, 0.42, -0.7, h + 0.006, 0, m.metal);
      b(0.43, 0.014, 0.31, -0.7, h + 0.014, 0, m.slate);
      rod([-0.7, h, -0.24], [-0.7, h + 0.27, -0.24], 0.018, m.metal);
      rod([-0.7, h + 0.27, -0.24], [-0.7, h + 0.27, -0.04], 0.018, m.metal);
      for (const x of [-0.65, 0.65]) {
        b(0.95, 0.65, 0.035, x, 0.45, d / 2 + 0.01, m.woodDark);
      }
    } else if (name === "archway") {
      const shape = new THREE.Shape(),
        inner = w / 2 - 0.2,
        spring = h - 0.65;
      shape.moveTo(-w / 2, 0);
      shape.lineTo(-w / 2, h);
      shape.lineTo(w / 2, h);
      shape.lineTo(w / 2, 0);
      shape.lineTo(inner, 0);
      shape.lineTo(inner, spring);
      shape.quadraticCurveTo(inner, h - 0.18, inner - 0.5, h - 0.18);
      shape.lineTo(-inner + 0.5, h - 0.18);
      shape.quadraticCurveTo(-inner, h - 0.18, -inner, spring);
      shape.lineTo(-inner, 0);
      shape.closePath();
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, curveSegments: 12, depth: d }),
        m.plaster,
      );
      mesh.position.z = -d / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    } else if (name === "awning") {
      b(w, 0.12, 0.13, 0, h - 0.06, -d / 2, m.white);
      const canopy = b(w, 0.025, d, 0, h - 0.22, 0, m.ochre);
      const fabricGeometry = new THREE.BoxGeometry(w, 0.025, d, 20, 1, 12),
        positions = fabricGeometry.attributes.position;
      for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i),
          z = positions.getZ(i),
          sag =
            0.025 *
            Math.sin(((x + w / 2) / w) * Math.PI * 5) ** 2 *
            Math.sin(((z + d / 2) / d) * Math.PI);
        positions.setY(i, positions.getY(i) - sag);
      }
      fabricGeometry.computeVertexNormals();
      canopy.geometry.dispose();
      canopy.geometry = fabricGeometry;
      canopy.rotation.x = 0.2;
      for (let i = 1; i < 5; i += 1) {
        const seam = b(0.004, 0.029, d, -w / 2 + (i * w) / 5, h - 0.22, 0, m.ochre);
        seam.rotation.x = 0.2;
      }
      rod(
        [-w / 2, h - 0.22 - (Math.sin(0.2) * d) / 2, (Math.cos(0.2) * d) / 2],
        [w / 2, h - 0.22 - (Math.sin(0.2) * d) / 2, (Math.cos(0.2) * d) / 2],
        0.016,
        m.white,
      );
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
      valance.position.set(0, h - 0.22 - (Math.sin(0.2) * d) / 2, (Math.cos(0.2) * d) / 2);
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
      const hood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.68, h - 1.24, 4, 1),
        m.plaster,
      );
      hood.rotation.y = Math.PI / 4;
      hood.scale.z = 0.6;
      hood.position.set(0, (h + 1.24) / 2, -0.02);
      hood.castShadow = true;
      hood.receiveShadow = true;
      group.add(hood);
      rod([-0.3, 0.32, 0.07], [0.3, 0.34, 0.12], 0.055, m.woodDark);
    } else if (name === "canopy_bed") {
      b(w, 0.2, d, 0, 0.22, 0);
      cushion(group, w - 0.08, 0.22, d - 0.08, 0, 0.43, 0, m.cream, m.linen);
      drapedCover(group, w - 0.04, d * 0.7, 0, 0.59, 0.25, m.linen);
      drapedCover(group, w - 0.04, 0.36, 0, 0.602, 0.57, m.cream);
      for (const side of [-1, 1]) {
        rod(
          [side * (w / 2 - 0.035), 0, -d / 2 + 0.04],
          [side * (w / 2 - 0.035), h, -d / 2 + 0.04],
          0.028,
        );
        cushion(group, 0.6, 0.12, 0.38, side * 0.36, 0.57, -0.68, m.stripedLinen).rotation.y =
          side * 0.08;
      }
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
        b(w * 0.82, 0.025, d / 10, 0, 0.45, ((i - 3) * d) / 10, woven ? m.wicker : m.wood);
        b(w * 0.82, 0.035, 0.027, 0, 0.58 + i * 0.04, -d * 0.35, woven ? m.wicker : m.wood);
        if (woven) {
          b(0.04, 0.29, 0.032, ((i - 3) * w) / 9, 0.7, -d * 0.35 + 0.014, m.wicker);
        }
        if (woven) {
          b(0.045, 0.014, d * 0.7, ((i - 3) * w) / 9, 0.463, 0, m.wicker);
        }
      }
    } else if (name === "sofa_bed") {
      for (const x of [-0.78, 0.78]) {
        for (const z of [-0.28, 0.28]) {
          rod([x * 1.04, 0, z * 1.04], [x, 0.23, z], 0.035);
        }
      }
      b(w - 0.02, 0.22, d - 0.03, 0, 0.31, 0, m.cream);
      cushion(group, w - 0.035, 0.18, d - 0.07, 0, 0.45, 0.035, m.cream, m.linen);
      for (const side of [-1, 1]) {
        cushion(group, w / 2 - 0.03, 0.43, 0.19, (side * w) / 4, 0.65, -0.29, m.cream).rotation.x =
          -0.12;
      }
      const bolster = cylinder(group, 0.14, 0.14, 0.13, 0.64, 0.68, -0.13, m.linen, 24);
      bolster.rotation.x = Math.PI / 2;
      const button = cylinder(group, 0.016, 0.016, 0.012, 0.64, 0.68, -0.057, m.cream, 12);
      button.rotation.x = Math.PI / 2;
    } else if (name === "kitchenette") {
      b(w, 0.12, d - 0.08, 0, 0.06, 0, m.slate);
      cabinetShell(group, w, d - 0.04, 0.12, 0.8725, m.white, 0);
      cutWorktop(group, w + 0.03, d + 0.03, 0.055, 0, 0.9275, 0, m.wood, {
        d: 0.48,
        w: 0.68,
        x: -0.48,
        z: 0,
      });
      for (let i = 0; i < 4; i += 1) {
        const x = ((i - 1.5) * w) / 4;
        b(w / 4 - 0.018, 0.67, 0.035, x, 0.49, d / 2, m.white);
        b(w / 4 - 0.1, 0.54, 0.018, x, 0.49, d / 2 + 0.023, m.white);
        b(0.19, 0.02, 0.035, x, 0.73, d / 2 + 0.04);
        if (i < 2) {
          b(w / 4 - 0.016, 0.65, 0.025, x, h - 0.325, -0.3, m.white);
          for (const offset of [-0.27, 0, 0.27]) {
            b(0.035, 0.65, 0.32, x + offset, h - 0.325, -0.14, m.white);
          }
          for (const y of [h - 0.64, h - 0.43, h - 0.22, h - 0.02]) {
            b(w / 4 - 0.016, 0.025, 0.32, x, y, -0.14, m.white);
          }
          b(w / 4 - 0.08, 0.6, 0.012, x, h - 0.325, 0.03, m.cabinetGlass);
        } else {
          b(w / 4 - 0.016, 0.65, 0.32, x, h - 0.325, -0.16, m.white);
          b(w / 4 - 0.09, 0.55, 0.02, x, h - 0.325, 0.012, m.white);
        }
        b(0.018, 0.09, 0.03, x + 0.19, h - 0.54, 0.03);
      }
      insetBasin(group, 0.68, 0.48, -0.48, 0.94, 0);
      for (let i = 0; i < 4; i += 1) {
        b(0.018, 0.002, 0.34, -0.91 - i * 0.035, 0.93, 0, m.metal);
      }
      const accessories = new THREE.Group();
      addReferenceAsset("kitchen_accessories", accessories);
      accessories.position.set(0.05, 0.93, 0);
      group.add(accessories);
      for (const x of [-0.95, -0.7, -0.4]) {
        cylinder(group, 0.065, 0.06, 0.12, x, h - 0.36, -0.1, m.white);
      }
      b(0.53, 0.018, 0.48, 0.86, 0.94, 0, m.screen);
      for (const [x, z, radius] of [
        [0.73, -0.12, 0.075],
        [0.98, -0.12, 0.08],
        [0.73, 0.12, 0.07],
        [0.98, 0.12, 0.065],
      ]) {
        const burner = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.002, 4, 24), m.metal);
        burner.rotation.x = Math.PI / 2;
        burner.position.set(x, 0.95, z);
        group.add(burner);
      }
      b(0.5, 0.49, 0.014, 0.9, 0.47, d / 2 + 0.045, m.chrome);
      b(0.47, 0.46, 0.015, 0.9, 0.47, d / 2 + 0.055, m.screen);
      b(0.36, 0.025, 0.035, 0.9, 0.72, d / 2 + 0.075, m.metal);
      for (const x of [0.73, 0.9, 1.07]) {
        const knob = cylinder(group, 0.024, 0.024, 0.025, x, 0.81, d / 2 + 0.055, m.metal);
        knob.rotation.x = Math.PI / 2;
      }
    } else if (name === "timber_rail") {
      for (let i = 0; i <= 12; i += 1) {
        b(0.035, h - 0.1, 0.035, -w / 2 + (i * w) / 12, h / 2, 0, m.woodDark);
      }
      for (const y of [0.06, h - 0.03]) {
        b(w + 0.04, 0.06, d, 0, y, 0, m.woodDark);
      }
    } else if (name === "towel_stack") {
      rolledLinen(group, 0.3, 0.08, -0.12, 0.078, 0.012, m.cream).rotation.y = -0.09;
      rolledLinen(group, 0.3, 0.08, 0.12, 0.078, -0.012, m.cream).rotation.y = 0.1;
      rolledLinen(group, 0.28, 0.07, 0, 0.186, 0, m.linen).rotation.y = -0.04;
    } else if (name === "timber_wardrobe") {
      b(w, h - 0.1, d, 0, h / 2 + 0.02, 0, m.wood);
      b(w - 0.025, 0.09, d - 0.07, 0, 0.045, 0, m.woodDark);
      for (const side of [-1, 1]) {
        b(w / 2 - 0.012, h - 0.14, 0.03, (side * w) / 4, h / 2, d / 2, m.woodDark);
        b(w / 2 - 0.07, h - 0.2, 0.032, (side * w) / 4, h / 2, d / 2 + 0.012, m.wood);
        for (let i = 0; i < 24; i += 1) {
          const louver = b(
            w / 2 - 0.1,
            0.042,
            0.02,
            (side * w) / 4,
            0.2 + i * 0.066,
            d / 2 + 0.032,
            m.wood,
          );
          louver.rotation.x = 0.3;
        }
        rod([side * 0.04, 0.93, d / 2 + 0.06], [side * 0.04, 1.05, d / 2 + 0.06], 0.011, m.brass);
      }
    } else if (name === "linen_bench") {
      legs(group, w, d, 0.34, "wood");
      b(w, 0.08, d, 0, 0.34, 0);
      cushion(group, w - 0.03, 0.18, d - 0.025, 0, 0.4, 0, m.linen, m.cream);
    } else if (name === "linen_pouf") {
      cushion(group, w, h, d, 0, h / 2, 0, m.cream, m.linen);
      cushion(group, w * 0.75, 0.055, d * 0.75, 0, h - 0.025, 0, m.linen);
    } else if (name === "bolster") {
      rolledLinen(group, w, h / 2, 0, h / 2, 0, m.stripedLinen).rotation.y = Math.PI / 2;
    } else if (name === "jute_rug") {
      b(w, h, d, 0, h / 2, 0, m.jute);
      for (const side of [-1, 1]) {
        for (let i = 0; i < 24; i += 1) {
          rod(
            [-w / 2 + ((i + 0.5) * w) / 24, 0.007, (side * d) / 2],
            [-w / 2 + ((i + 0.5) * w) / 24, 0.007, side * (d / 2 + 0.035)],
            0.003,
            m.cream,
          );
        }
      }
    } else if (name === "terracotta_urn") {
      const profile = [
        [0.14, 0],
        [0.17, 0.05],
        [0.22, 0.22],
        [0.225, 0.35],
        [0.17, 0.48],
        [0.115, 0.56],
        [0.12, 0.63],
        [0.13, 0.65],
        [0.1, 0.65],
        [0.095, 0.56],
        [0.15, 0.47],
      ];
      const vessel = new THREE.Mesh(
        new THREE.LatheGeometry(
          profile.map(([r, y]) => new THREE.Vector2(r, y)),
          24,
        ),
        m.earthenware,
      );
      vessel.castShadow = true;
      vessel.receiveShadow = true;
      group.add(vessel);
      for (const side of [-1, 1]) {
        curvedRod(
          group,
          [
            [side * 0.16, 0.47, 0],
            [side * 0.24, 0.49, 0],
            [side * 0.25, 0.35, 0],
            [side * 0.21, 0.3, 0],
          ],
          0.017,
          m.earthenware,
          12,
        );
      }
    } else if (name === "wall_coat_hooks") {
      b(w, 0.13, 0.028, 0, h / 2, 0);
      for (const x of [-0.25, 0, 0.25]) {
        curvedRod(
          group,
          [
            [x, 0.06, 0.015],
            [x, 0.05, 0.045],
            [x, 0.11, 0.058],
          ],
          0.01,
          m.brass,
          8,
        );
      }
    } else if (name === "bougainvillea") {
      for (let branch = 0; branch < 5; branch += 1) {
        const x = (branch - 2) * 0.2;
        curvedRod(
          group,
          [
            [0, 0, 0],
            [x * 0.4, 0.6, -0.08],
            [x, 1.3, 0],
            [x * 0.8, 2.12, -0.05],
          ],
          0.012,
          m.woodDark,
          10,
        );
        for (let i = 0; i < 24; i += 1) {
          const y = 0.35 + i * 0.073,
            angle = i * 2.39996 + branch,
            leaf = new THREE.Mesh(gardenLeafGeometry, i % 3 ? m.foliage : m.leafLight);
          leaf.position.set((x * y) / 2 + Math.cos(angle) * 0.16, y, Math.sin(angle) * 0.24);
          leaf.rotation.set(angle, angle * 0.3, 0.4);
          leaf.scale.setScalar(0.7);
          leaf.receiveShadow = true;
          group.add(leaf);
          if (i > 11 && i % 2) {
            for (let petal = 0; petal < 3; petal += 1) {
              const flower = new THREE.Mesh(gardenLeafGeometry, m.flower);
              flower.position.copy(leaf.position);
              flower.rotation.set(0.6, petal * 2.1, angle);
              flower.scale.setScalar(0.42);
              group.add(flower);
            }
          }
        }
      }
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
        floor: floor - 1,
        items,
        name,
        rows,
        style: "mediterranean",
        surface: "tile",
        walls: ["north", "east", "south", "west"],
        x,
        z,
      };
      return Object.assign(area, extra);
    };
    return buildExample(
      "Photo study: basement −3 m, ground 0 m, upper +3 m with a timber sleeping loft.\n# Dimensions, loft clearance and unseen connections are estimates, not a surveyed plan.\n# HEIGHT sets room clearance (metres). Asset sizes use [width x depth x height] without spaces.\n# The sleeping_loft is a furnished visual assembly; use floor-to-floor stairs for walkthrough navigation.\n# References: 367513202 guest suite; 367513251/499 kitchen; 367489079 terrace;\n# 362410113/367513069 loft; 367513000/135 bedroom; 367512738/835 balcony;\n# 362407652/660 and 362409486 garden; 367489152 gym; 367513309/397 bathrooms.",
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
            [0, 2, "nightstand(bedside_on_top)"],
            [4, 2, "nightstand"],
            [6, 1, "garment_rack"],
            [1, 7, "tufted_sofa@90"],
            [2, 4, "kilim_rug"],
            [6, 8, "console_table(tea_on_top)~east"],
          ],
          {
            doors: ["east", "south"],
            mounts: [
              ["north", 2, "coastal_print"],
              ["west", 6, "citrus_print"],
              ["west", 7, "coastal_print"],
            ],
            windows: ["west"],
          },
        ),
        room(
          "lower_stair_hall",
          0,
          5,
          10,
          8,
          0,
          [
            [1, 4, "stairs[0.8x3.6x3]"],
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
            [4, 2, "gym_mat"],
            [3, 2, "dumbbells"],
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
            [0, 2, "bathroom_vanity~west"],
            [3, 1, "frameless_shower"],
            [2, 3, "toilet~south"],
            [2, 2, "floor_drain"],
            [4, 3, "towel_rail[0.6x0.14x1.25]~east"],
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
            [7, 2, "kitchenette(baskets_on_top)~east"],
            [7, 0, "retro_fridge~east"],
            [6, 8, "fireplace~east"],
            [1, 5, "sofa_bed@90"],
            [3, 7, "woven_chair@30"],
            [2, 8, "coffee_table(tea_on_top)"],
            [6, 2, "kilim_rug@90"],
            [0, 8, "plant"],
            [1, 7, "accent_chair@35"],
            [1, 1, "breakfast_bar(breakfast_on_top)~west"],
            [2, 1, "woven_chair@90"],
            [3, 9, "curtain_pair@180[2.4x0.18x2.5]"],
          ],
          {
            doors: ["east", "south"],
            mounts: [
              ["west", 3, "botanical_print"],
              ["east", 6, "wall_tv"],
              ["west", 7, "wall_shelf"],
              ["east", 1, "air_conditioner"],
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
            [3, 4, "stairs@180[0.8x3.6x3]"],
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
            [4, 1, "awning[5.2x2.8x2.65]"],
            [4, 2, "dining_table[1.55x0.8x0.75](tea_on_top)"],
            [3, 1, "patio_chair"],
            [5, 1, "patio_chair"],
            [3, 3, "patio_chair@180"],
            [5, 3, "patio_chair@180"],
            [4, 0, "ceiling_fan"],
            [1, 2, "bbq"],
            [4, 3, "archway[5.2x0.25x2.7]"],
            [0, 1, "grape_trellis@90[2.4x0.4x2.5]"],
          ],
          { kind: "balcony", rails: ["west"], surface: "stone" },
        ),
        room(
          "upper_bedroom",
          2,
          8,
          10,
          0,
          0,
          [
            [3, 2, "sleeping_loft"],
            [2, 6, "canopy_bed(towels_on_top)"],
            [0, 6, "sea_table"],
            [4, 6, "ochre_table"],
            [6, 6, "garment_rack"],
            [1, 8, "kilim_rug"],
            [6, 2, "washing_machine~east"],
            [6, 8, "wicker_basket"],
            [3, 9, "curtain_pair@180[2.4x0.18x2.5]"],
          ],
          {
            doors: ["east", "south"],
            height: 3.8,
            mounts: [
              ["west", 5, "coastal_print"],
              ["west", 6, "citrus_print"],
              ["north", 3, "wall_spot_pair"],
              ["north", 1, "wall_shelf"],
              ["east", 1, "air_conditioner"],
            ],
          },
        ),
        room("upper_landing", 2, 5, 10, 8, 0, [[1, 8, "console_table"]], {
          doors: ["west"],
          height: 3.8,
        }),
        room(
          "sunny_balcony",
          2,
          8,
          3,
          0,
          10,
          [
            [4, 0, "awning[5.2x2.1x2.65]"],
            [3, 1, "slatted_table(tea_on_top)"],
            [2, 1, "folding_chair@270"],
            [4, 1, "folding_chair@90"],
            [6, 1, "planter"],
            [7, 0, "ac_condenser@180"],
          ],
          { kind: "balcony", rails: ["south", "east", "west"], surface: "terracotta" },
        ),
        room(
          "mediterranean_garden",
          1,
          13,
          12,
          0,
          14,
          [
            [2, 3, "topiary_tree[3.6x3.6x5.8]"],
            [2, 8, "palm"],
            [10, 4, "citrus_tree[3.6x3.6x5.8]"],
            [10, 9, "topiary_tree[3.4x3.4x5.2]"],
            [7, 9, "cypress[1.2x1.2x5.8]"],
            [6, 5, "stone_path[1.2x7.5x0.04]"],
            [5, 10, "stone_path[8x1x0.04]"],
            [2, 0, "terracotta_pot"],
            [10, 0, "terracotta_pot"],
            [0, 6, "hedge[0.6x7.5x1.6]"],
            [12, 6, "hedge[0.6x7.5x1.6]"],
            [3, 11, "retaining_wall"],
            [9, 11, "retaining_wall"],
            [4, 3, "globe_lamp"],
            [8, 8, "globe_lamp"],
            [6, 1, "garden_steps"],
            [2, 1, "flower_border"],
            [10, 1, "flower_border"],
            [1, 5, "flower_border@90"],
            [11, 7, "flower_border@90"],
            [4, 6, "olive_tree[3.4x3.4x5.4]"],
            [1, 10, "terracotta_pot"],
            [11, 10, "terracotta_pot"],
          ],
          { kind: "garden", rails: [], surface: "grass" },
        ),
        room(
          "bbq_courtyard",
          1,
          5,
          4,
          8,
          10,
          [
            [2, 0, "outdoor_kitchen~north"],
            [3, 2, "bbq"],
            [0, 2, "terracotta_pot"],
          ],
          { kind: "balcony", rails: ["east"], surface: "stone" },
        ),
      ],
      {
        baskets: ["wicker_basket | wicker_basket"],
        bedside: ["table_lamp"],
        breakfast: ["citrus_bowl | cafe_setting"],
        pillows: ["pillow | pillow"],
        tea: ["cafe_setting"],
        towels: ["towel_stack"],
      },
    );
  }
  const [
      THREE,
      { mergeGeometries },
      { OrbitControls },
      { PointerLockControls },
      { default: SunCalc },
      { OBB },
      { default: RBush },
      { LRParser },
      { default: TinyQueue },
      { RoundedBoxGeometry },
      { RoomEnvironment },
      { Reflector },
      { GTAOPass },
      { EditorState, StateEffect, StateField },
      { EditorView, Decoration, keymap, lineNumbers, drawSelection },
      {
        LRLanguage,
        LanguageSupport,
        foldService,
        syntaxTree,
        foldGutter,
        codeFolding,
        foldKeymap,
        foldAll,
        unfoldAll,
        foldedRanges,
        unfoldEffect,
      },
      { defaultKeymap, history, historyKeymap, indentWithTab, redo, undo },
    ] = await Promise.all([
      import("three"),
      import("three/addons/utils/BufferGeometryUtils.js"),
      import("three/addons/controls/OrbitControls.js"),
      import("three/addons/controls/PointerLockControls.js"),
      import("suncalc"),
      import("three/addons/math/OBB.js"),
      import("rbush"),
      import("@lezer/lr"),
      import("tinyqueue"),
      import("three/addons/geometries/RoundedBoxGeometry.js"),
      import("three/addons/environments/RoomEnvironment.js"),
      import("three/addons/objects/Reflector.js"),
      import("three/addons/postprocessing/GTAOPass.js"),
      import("@codemirror/state"),
      import("@codemirror/view"),
      import("@codemirror/language"),
      import("@codemirror/commands"),
    ]),
    { Box3, Matrix3, Matrix4, Vector3 } = THREE,
    lightAssets = [
      "ceiling_light",
      "fluorescent_light",
      "pendant_light",
      "track_light",
      "downlight",
      "woven_pendant",
      "garden_lamp",
      "lantern",
      "lamp",
      "table_lamp",
      "ceramic_table_lamp",
      "wall_lamp",
      "globe_lamp",
      "wall_spot_pair",
    ],
    overheadLights = lightAssets.slice(0, 6);
  document.querySelector("#renderProgressText").textContent = "Preparing editor & materials…";
  await new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
  function celestialTime(date, time, offset) {
    return new Date(Date.parse(`${date}T${time}:00Z`) - offset * 3_600_000);
  }
  function solarPosition(date, time, latitude, longitude, offset) {
    const position = SunCalc.getPosition(celestialTime(date, time, offset), latitude, longitude);
    return {
      altitude: THREE.MathUtils.radToDeg(position.altitude),
      azimuth: (THREE.MathUtils.radToDeg(position.azimuth) + 180) % 360,
    };
  }
  function lunarDirection(date, time, latitude, longitude, offset, orientation) {
    const { altitude, azimuth } = SunCalc.getMoonPosition(
        celestialTime(date, time, offset),
        latitude,
        longitude,
      ),
      bearing = azimuth + Math.PI - THREE.MathUtils.degToRad(orientation);
    return new THREE.Vector3(
      Math.sin(bearing) * Math.cos(altitude),
      Math.sin(altitude),
      -Math.cos(bearing) * Math.cos(altitude),
    );
  }
  /* eslint-disable no-shadow -- Keep the consolidated helpers in their original scopes. */ const {
    createCollisionIndex,
    overlapWarnings,
  } = (() => {
    const trees = new Set(["olive_tree", "citrus_tree", "topiary_tree", "palm"]);
    const ignored = new Set([
      "rug",
      "kilim_rug",
      "jute_rug",
      "ceiling_fan",
      "floor_drain",
      "curtain_pair",
      "gym_mat",
      "stone_path",
      "archway",
      "timber_pergola",
      "awning",
    ]);
    function createCollisionIndex(entries) {
      const floors = new Map();
      const items = entries.map((entry, id) => {
        const { token, x, z } = entry;
        const [width, depth] = token.dimensions;
        const angle = (token.yaw * Math.PI) / 180;
        const rotation = new Matrix3().setFromMatrix4(new Matrix4().makeRotationY(angle));
        const box = new OBB(new Vector3(x, 0, z), new Vector3(width / 2, 1, depth / 2), rotation);
        const walkingBox = box.clone();
        walkingBox.halfSize.x += 0.2;
        walkingBox.halfSize.z += 0.2;
        const footprintWidth = trees.has(token.name) ? Math.max(0.3, width * 0.16) : width;
        const footprintDepth = trees.has(token.name) ? footprintWidth : depth;
        const boundWidth = Math.max(width, footprintWidth);
        const boundDepth = Math.max(depth, footprintDepth);
        const bounds = new Box3(
          new Vector3(-boundWidth / 2, -1, -boundDepth / 2),
          new Vector3(boundWidth / 2, 1, boundDepth / 2),
        )
          .applyMatrix4(new Matrix4().makeRotationY(angle))
          .translate(box.center);
        const warningBox = new OBB(
          box.center.clone(),
          new Vector3(
            Math.max(0, footprintWidth / 2 - 0.04),
            1,
            Math.max(0, footprintDepth / 2 - 0.04),
          ),
          rotation,
        );
        const item = {
          entry,
          id,
          maxX: bounds.max.x,
          maxY: bounds.max.z,
          minX: bounds.min.x,
          minY: bounds.min.z,
          walkingBox,
          warningBox,
        };
        if (!floors.has(token.floor)) {
          floors.set(token.floor, new RBush());
        }
        return item;
      });
      for (const [floor, index] of floors) {
        index.load(items.filter((item) => item.entry.token.floor === floor));
      }
      return { items, search: (floor, bounds) => floors.get(floor)?.search(bounds) || [] };
    }
    function overlapWarnings(index, overheadLights) {
      const warnings = [];
      const skip = (item) =>
        ignored.has(item.entry.token.name) || overheadLights.includes(item.entry.token.name);
      for (const a of index.items) {
        if (skip(a)) {
          continue;
        }
        const candidates = index.search(a.entry.token.floor, a).toSorted((a, b) => a.id - b.id);
        for (const b of candidates) {
          if (b.id <= a.id || skip(b)) {
            continue;
          }
          if (a.warningBox.intersectsOBB(b.warningBox)) {
            warnings.push(`${a.entry.token.name} overlaps ${b.entry.token.name}`);
          }
        }
      }
      return warnings;
    }
    return { createCollisionIndex, overlapWarnings };
  })();
  const { readLayout, layoutLanguage } = (() => {
    const keywords = new Set([
      "WALL_THICKNESS",
      "SITE",
      "FACADE",
      "ROOF",
      "LIGHT",
      "AT",
      "POWER",
      "FLOOR",
      "ROOM",
      "BALCONY",
      "GARDEN",
      "GRID",
      "WALLS",
      "RAILS",
      "WINDOWS",
      "DOORS",
      "HEIGHT",
      "SURFACE",
      "STYLE",
      "MOUNT",
      "LAYOUT",
      "END",
    ]);
    function specializeKeyword(value, stack) {
      const keyword = value.toUpperCase();
      return keywords.has(keyword) && stack.canShift(terms[keyword]) ? terms[keyword] : -1;
    }
    /* eslint-disable no-redeclare, no-bitwise, sort-keys -- Generated by Lezer. */ const terms =
      (() => {
        const WALL_THICKNESS = 1,
          SITE = 2,
          FACADE = 3,
          ROOF = 4,
          LIGHT = 5,
          AT = 6,
          POWER = 7,
          FLOOR = 8,
          ROOM = 9,
          BALCONY = 10,
          GARDEN = 11,
          GRID = 12,
          WALLS = 13,
          RAILS = 14,
          WINDOWS = 15,
          DOORS = 16,
          HEIGHT = 17,
          SURFACE = 18,
          STYLE = 19,
          MOUNT = 20,
          LAYOUT = 21,
          END = 22,
          Comment = 23,
          Program = 24,
          Statement = 25,
          WallThickness = 26,
          Number = 27,
          Site = 28,
          Name = 29,
          Facade = 30,
          Roof = 31,
          Light = 32,
          Point = 33,
          Floor = 34,
          SignedNumber = 35,
          Room = 36,
          Dimensions2 = 37,
          Grid = 38,
          Walls = 39,
          Directions = 40,
          Rails = 41,
          Windows = 42,
          Doors = 43,
          Height = 44,
          Surface = 45,
          Style = 46,
          Mount = 47,
          Link = 48,
          Layout = 49,
          End = 50,
          Row = 51,
          ObjectToken = 52,
          Empty = 53,
          Asset = 54,
          Rotation = 55,
          Size = 56,
          Dimensions3 = 57,
          Child = 58,
          Wall = 59;
        return {
          WALL_THICKNESS,
          SITE,
          FACADE,
          ROOF,
          LIGHT,
          AT,
          POWER,
          FLOOR,
          ROOM,
          BALCONY,
          GARDEN,
          GRID,
          WALLS,
          RAILS,
          WINDOWS,
          DOORS,
          HEIGHT,
          SURFACE,
          STYLE,
          MOUNT,
          LAYOUT,
          END,
          Comment,
          Program,
          Statement,
          WallThickness,
          Number,
          Site,
          Name,
          Facade,
          Roof,
          Light,
          Point,
          Floor,
          SignedNumber,
          Room,
          Dimensions2,
          Grid,
          Walls,
          Directions,
          Rails,
          Windows,
          Doors,
          Height,
          Surface,
          Style,
          Mount,
          Link,
          Layout,
          End,
          Row,
          ObjectToken,
          Empty,
          Asset,
          Rotation,
          Size,
          Dimensions3,
          Child,
          Wall,
        };
      })();
    const parser = LRParser.deserialize({
      version: 14,
      states:
        "-nQYQPOOO!vQPO'#CvO!{QPO'#CxO#QQPO'#CzO#VQPO'#C{O#[QPO'#C|O#aQQO'#DOO#fQSO'#DQO#nQPO'#DSO#sQPO'#DTO#sQPO'#DVO#sQPO'#DWO#sQPO'#DXO#xQPO'#DYO#}QPO'#DZO$SQPO'#D[O$XQPO'#D]O$^QPO'#D_OOQO'#D`'#D`OOQO'#Dd'#DdOOQO'#Db'#DbO$cQPO'#DbO%WQPO'#DaOOQO'#Cu'#CuOOQO'#Dj'#DjQ%lQPO'#DjQYQPOOO%qQPO,59bO%vQPO,59dOOQO,59f,59fOOQO,59g,59gO&RQPO,59hOOQO,59j,59jO&WQPO,59lO&cQSO,59lOOQO,59n,59nO&hQPO'#DUOOQO,59o,59oOOQO,59q,59qOOQO,59r,59rOOQO,59s,59sOOQO,59t,59tOOQO,59u,59uOOQO,59v,59vO&vQPO,59wOOQO,59y,59yO&{QQO'#DeO'QQWO'#DfO'VQPO'#DhO'[QPO'#DiOOQO,59|,59|O'aQPO,59|O'xQPO,59|O(PQPO,59|O(ZQPO,59|OOQO'#Dl'#DlO(hQPO'#DlO(sQPO,59{OOQO,5:U,5:UOOQO-E7h-E7hOOQO1G.|1G.|OOQO1G/O1G/OO)XQSO1G/SO)^QSO1G/WO)cQPO1G/WOOQO'#Dk'#DkO)nQPO'#DkO)sQPO,59pO*RQPO1G/cOOQO,5:P,5:PO*WQPO,5:QO*]QPO,5:SOOQO,5:T,5:TOOQO1G/h1G/hO*bQPO1G/hO*yQPO1G/hO+QQPO1G/hOOQO,5:W,5:WOOQO-E7j-E7jO+[QPO7+$nOOQO7+$r7+$rO+gQSO7+$rOOQO,5:V,5:VOOQO-E7i-E7iO+lQPO7+$}OOQO1G/l1G/lOOQO1G/n1G/nOOQO7+%S7+%SO+wQPO7+%SO,`QPO7+%SO,gQPO<<HYOOQO<<H^<<H^OOQO<<Hi<<HiOOQO<<Hn<<HnO,lQPO<<HnOOQOAN=tAN=tOOQOAN>YAN>Y",
      stateData:
        "-T~O!cOSgOS~OPPOQQORROSSOTTOWUOXVOYVOZVO[WO]XO^YO_ZO`[Oa]Ob^Oc_Od`OeaOfbOkcOmcO!VdO!lhO~OkkO~OmlO~OmmO~OmnO~OmoO~OspO~OmrOuqO~OksO~OmtO~OkyO~OmzO~Om{O~Om|O~Om}O~O!Q!SO!e!OO!f!PO!h!QO!j!ROk!UXm!UX!V!UX!a!UX!k!UX!l!UX~OkcOmcO!VdO!k!YO!a!TX!l!TX~O!l![O~Ok!^O~Ok!_O!ala!lla~OU!`O~OU!aO!ata!lta~Ou!bO~Om!cO!d!dO!axX!lxX~Ok!fO~Os!gO~O!Z!hO~Om!iO~Om!jO~O!Q!kOk!Uam!Ua!V!Ua!a!Ua!k!Ua!l!Ua~O!j!RO~P'aO!h!QO!j!RO~P'aO!f!PO!h!QO!j!RO~P'aOkcOmcO!VdO~OkcOmcO!VdO!k!YO!a!Ta!l!Ta~Oq!qO~Oq!rO~OU!sO!ati!lti~Om!tO~Om!cO!d!dO!axa!lxa~Om!vO~O!g!wO~O!i!xO~O!Q!yOk!Uim!Ui!V!Ui!a!Ui!k!Ui!l!Ui~O!j!RO~P*bO!h!QO!j!RO~P*bOV!|O!apq!lpq~Oq!}O~O!Q#OO!a!Pq!l!Pq~O!Q#POk!Uqm!Uq!V!Uq!a!Uq!k!Uq!l!Uq~O!j!RO~P+wOk#RO~O!Q#SOk!Uym!Uy!V!Uy!a!Uy!k!Uy!l!Uy~O",
      goto: "$`!aPPPPPPPPPPPPPPPPPPPPPPPPP!b!fP!fP!f!f!fP!fP!fP!f!f!j!f!f!f!f!f!f!fP!f!f!f!vP#R#Y#]P#c#m#|$S$YTiOjTgOjQuXQvYQwZRx[SfOjS!Xf!ZR!o!YZeOfj!Y!ZR!WeQ!VeR!n!WQ!UeS!m!V!WR!{!nQ!TeU!l!U!V!WS!z!m!nR#Q!{QjOR!]jQ!etR!u!eQ!ZfR!p!Z",
      nodeNames:
        "⚠ WALL_THICKNESS SITE FACADE ROOF LIGHT AT POWER FLOOR ROOM BALCONY GARDEN GRID WALLS RAILS WINDOWS DOORS HEIGHT SURFACE STYLE MOUNT LAYOUT END Comment Program Statement WallThickness Number Site Name Facade Roof Light Point Floor SignedNumber Room Dimensions2 Grid Walls Directions Rails Windows Doors Height Surface Style Mount Link Layout End Row ObjectToken Empty Asset Rotation Size Dimensions3 Child Wall",
      maxTerm: 74,
      skippedNodes: [0, 23],
      repeatNodeCount: 3,
      tokenData:
        ")s~RcXY!^YZ!l]^!^pq!^st!qxy#Yyz#_|}#d}!O#i!O!P$[!Q![$a!^!_(S!b!c(w!c!}(|!}#O)_#P#Q)d#T#o(|#p#q)i#r#s)n~!cR!c~XY!^]^!^pq!^~!qO!l~~!vSg~OY!qZ;'S!q;'S;=`#S<%lO!q~#VP;=`<%l!q~#_O!h~~#dO!i~~#iO!d~R#nP!VP!Q![#qQ#vQsQ!O!P#|!Q![#qQ$PP!Q![$SQ$XPsQ!Q![$SP$aO!VP_$hTkPsQ|}$w!O!P%h!Q![$a!z!{'k#l#m'kS$zP!Q![$}S%SQqS!O!P%Y!Q![$}S%]P!Q![%`S%ePqS!Q![%`_%kP!Q![%n_%uSkPsQ|}$w!Q![%n!z!{&R#l#m&RW&UP!Q![&XW&[S!O!P&h!Q![&X!z!{&z#l#m&zW&kP!Q![&nW&qR!Q![&n!z!{&z#l#m&zW&}P!Q!['QW'VQ!ZW!O!P']!Q!['QW'`P!Q!['cW'hP!ZW!Q!['c['nP!Q!['q['vSuS!O!P&h!Q!['q!z!{&z#l#m&z~(VVOY(SZ!^(S!_!`(S!`!a(l!a;'S(S;'S;=`(q<%lO(S~(qO!Q~~(tP;=`<%l(S~(|O!e~~)RSm~!Q![(|!c!}(|#R#S(|#T#o(|~)dO!f~~)iO!g~~)nO!k~~)sO!j~",
      tokenizers: [0, 1, 2, 3],
      topRules: { Program: [0, 24] },
      specialized: [
        {
          term: 29,
          get: (value, stack) => specializeKeyword(value, stack) << 1,
          external: specializeKeyword,
        },
      ],
      tokenPrec: 0,
    });
    /* eslint-enable no-redeclare, no-bitwise, sort-keys */ function textOf(source, node) {
      return node ? source.slice(node.from, node.to) : undefined;
    }
    function readLayout(source) {
      const tree = parser.parse(source);
      tree.iterate({
        enter(node) {
          if (node.type.isError) {
            const line = source.slice(0, node.from).split("\n").length;
            throw Object.assign(new Error("Invalid layout syntax"), { line });
          }
        },
      });
      return tree.topNode.getChildren("Statement").map((statement) => {
        const node = statement.firstChild;
        const lineStart = source.lastIndexOf("\n", node.from - 1) + 1;
        const get = (name) => textOf(source, node.getChild(name));
        return {
          areaKind: node.firstChild.name.toLowerCase(),
          dimensions: get("Dimensions2")?.split(/x/iu).map(Number),
          directions: node
            .getChild("Directions")
            ?.getChildren("Name")
            .map((child) => textOf(source, child).toLowerCase()),
          kind: node.name,
          line: source.slice(0, node.from).split("\n").length,
          names: node.getChildren("Name").map((child) => textOf(source, child)),
          number: Number(get("SignedNumber") || get("Number")),
          numbers: node.getChildren("Number").map((child) => Number(textOf(source, child))),
          point: get("Point")?.split(",").map(Number) || [0, 0],
          text: textOf(source, node),
          tokens: node.getChildren("ObjectToken").map((token) => {
            const part = (name) => textOf(source, token.getChild(name));
            return {
              child: part("Child")?.slice(1, -1),
              dimensions: part("Size")?.slice(1, -1).split(/x/iu).map(Number),
              end: token.to - lineStart,
              name: part("Asset"),
              start: token.from - lineStart,
              text: textOf(source, token),
              url: part("Link")?.slice(1, -1),
              wall: part("Wall")?.slice(1).toLowerCase(),
              yaw: part("Rotation")?.slice(1),
            };
          }),
          url: get("Link")?.slice(1, -1),
        };
      });
    }
    function layoutFold(state, from) {
      const line = state.doc.lineAt(from);
      const statements = syntaxTree(state)
        .topNode.getChildren("Statement")
        .map((node) => node.firstChild);
      const index = statements.findIndex((node) => node.from >= line.from && node.from <= line.to);
      const header = statements[index];
      if (!header || !["Layout", "Room", "Floor"].includes(header.name)) {
        return;
      }
      let end = header.to;
      let rooms = 0;
      for (const node of statements.slice(index + 1)) {
        if (node.name === "Room") {
          rooms += 1;
        }
        if (header.name === "Layout") {
          if (node.name === "End") {
            return { from: line.to, to: node.to };
          }
          if (["Layout", "Room", "Floor"].includes(node.name)) {
            return;
          }
        } else if (
          (header.name === "Floor" ? ["Floor", "Layout"] : ["Room", "Floor", "Layout"]).includes(
            node.name,
          )
        ) {
          break;
        }
        end = node.to;
      }
      if (end > line.to && (header.name !== "Floor" || rooms > 1)) {
        return { from: line.to, to: end };
      }
    }
    const layoutLanguage = new LanguageSupport(LRLanguage.define({ parser }), [
      foldService.of(layoutFold),
    ]);
    return { layoutLanguage, readLayout };
  })();
  /* eslint-enable no-shadow */ function sharedWall(room, other, dir) {
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
  function glazedDoor(program, room, side) {
    const neighbours = program.rooms.filter((other) => sharedWall(room, other, side));
    return (
      room.style === "mediterranean" &&
      (neighbours.length === 0 || neighbours.some((other) => other.kind === "balcony"))
    );
  }
  function doorwayWidth(program, room, side, length) {
    return Math.min(glazedDoor(program, room, side) ? 2.1 : 1.15, length * 0.4);
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
          doors = new Set(room.doors);
        const windows = room.windowsLine ? room.windows : eligible.filter((dir) => !doors.has(dir)),
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
          room.mounts.filter((mount) => ["wall_lamp", "wall_spot_pair"].includes(mount.name))
            .length +
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
                    ? room.style === "mediterranean"
                      ? "ceiling_light"
                      : "pendant_light"
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
    return `WALL_THICKNESS 0.24 0.12\nSITE ${site} 5\nFACADE ${facade}\nROOF ${/mediterranean/iu.test(name) ? "terracotta" : "flat"}\n${lines.join("\n")}`;
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
      roof = finish(
        program.roof === "terracotta"
          ? "#b96f48"
          : program.roof === "pitched"
            ? "#655149"
            : "#69716e",
      ),
      width = program.cols * program.grid,
      depth = program.rows * program.grid;
    if (program.site !== "none") {
      const group = new THREE.Group();
      root.add(group);
      group.userData.terrain = true;
      const ground = finish({ grass: "#748961", paving: "#a5aaa5", sand: "#bcad88" }[program.site]);
      if (program.site === "grass") {
        ground.map = material.grass.map;
        ground.userData.textureScale = 1.5;
      }
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
      if (program.margin >= 3 && program.site === "grass") {
        const bark = finish("#6c5843"),
          leaves = [finish("#4c653d"), finish("#60774b")],
          trees = [],
          treeLimit = Math.min(
            8,
            Math.max(
              4,
              Math.ceil((width * depth) / 70) + program.floors.filter((floor) => floor >= 0).length,
            ),
          ),
          setback = program.margin - 1.5,
          canopyHeight = Math.min(
            8,
            4 + Math.max(0, ...program.rooms.map((room) => room.elevation)) * 0.6,
          ),
          placeTree = (x, z) => {
            if (
              trees.length < treeLimit &&
              !trees.some((tree) => Math.hypot(tree.x - x, tree.z - z) < 2.3)
            ) {
              trees.push({ x, z });
            }
          };
        const sightlineRooms = program.rooms.toSorted(
          (a, b) =>
            Number(b.kind === "balcony") - Number(a.kind === "balcony") ||
            b.elevation - a.elevation,
        );
        for (const room of sightlineRooms) {
          if (room.floor < 0) {
            continue;
          }
          for (const opening of room.daylightOpenings || []) {
            if (opening.shared) {
              continue;
            }
            const vertical = opening.dir === "east" || opening.dir === "west",
              sign = opening.dir === "east" || opening.dir === "south" ? 1 : -1;
            placeTree(
              vertical ? sign * (width / 2 + setback) : opening.x,
              vertical ? opening.z : sign * (depth / 2 + setback),
            );
          }
        }
        for (const xSign of [-1, 1]) {
          for (const zSign of [-1, 1]) {
            placeTree(xSign * (width / 2 + setback), zSign * (depth / 2 + setback));
          }
        }
        leaves.forEach((leaf) => {
          leaf.side = THREE.DoubleSide;
        });
        trees.forEach(({ x, z }, index) => {
          const treeHeight = canopyHeight * (0.82 + (index % 3) * 0.12),
            spread = 1 + (index % 3) * 0.08,
            turn = index * 1.7;
          cylinder(group, 0.1, 0.17, treeHeight - 1, x, (treeHeight - 1) / 2 - 0.2, z, bark, 6);
          for (let i = 0; i < 6; i += 1) {
            const angle = i * 2.4 + turn,
              foliageFinish = leaves[(i + index) % 3 ? 0 : 1],
              crown = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), foliageFinish);
            crown.position.set(
              x + Math.cos(angle) * (0.48 + (i % 3) * 0.1) * spread,
              treeHeight - 0.85 + ((i % 3) - 1) * 0.32,
              z + Math.sin(angle) * (0.55 + (i % 2) * 0.12) * spread,
            );
            crown.scale.set(
              (0.4 + (i % 2) * 0.09) * spread,
              0.54 + (i % 3) * 0.08,
              (0.38 + (i % 3) * 0.05) * spread,
            );
            crown.rotation.y = angle;
            crown.castShadow = true;
            crown.receiveShadow = true;
            group.add(crown);
            const branchPath = new THREE.LineCurve3(
                new THREE.Vector3(x, treeHeight - 1.6, z),
                crown.position,
              ),
              branch = new THREE.Mesh(new THREE.TubeGeometry(branchPath, 1, 0.025, 5, false), bark);
            branch.castShadow = true;
            branch.receiveShadow = true;
            group.add(branch);
            for (let j = 0; j < 12; j += 1) {
              const latitude = Math.acos(1 - (2 * (j + 0.5)) / 12),
                tuft = new THREE.Mesh(gardenLeafGeometry.clone(), foliageFinish),
                leafTurn = j * 2.4 + turn;
              tuft.position
                .copy(crown.position)
                .add(
                  new THREE.Vector3(
                    Math.sin(latitude) * Math.cos(leafTurn) * crown.scale.x,
                    Math.cos(latitude) * crown.scale.y,
                    Math.sin(latitude) * Math.sin(leafTurn) * crown.scale.z,
                  ),
                );
              tuft.scale.set(1.25 * spread, 1.4 * spread, 0.95 * spread);
              tuft.rotation.set(leafTurn, latitude, angle);
              tuft.castShadow = true;
              tuft.receiveShadow = true;
              group.add(tuft);
            }
          }
        });
        batchFurniture(group);
      }
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
      cap.position.set(room.centerX, room.elevation + room.height + 0.07, room.centerZ);
      if (["pitched", "terracotta"].includes(program.roof)) {
        const shape = new THREE.Shape();
        shape.moveTo(-w / 2 - 0.2, 0);
        shape.lineTo(
          0,
          program.roof === "terracotta" ? Math.min(w * 0.15, 0.8) : Math.min(w * 0.3, 2),
        );
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
        if (program.roof === "terracotta") {
          const rise = Math.min(w * 0.15, 0.8),
            run = w / 2 + 0.2;
          for (let z = -d / 2 - 0.18; z <= d / 2 + 0.2; z += 0.22) {
            for (const side of [-1, 1]) {
              const start = new THREE.Vector3(0, rise + 0.035, z),
                end = new THREE.Vector3(side * run, 0.035, z),
                tile = cylinder(cap, 0.065, 0.065, start.distanceTo(end), 0, 0, 0, roof, 8);
              tile.position.copy(start).add(end).multiplyScalar(0.5);
              tile.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                end.sub(start).normalize(),
              );
            }
          }
        }
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
    wallDecor = [
      "arched_mirror",
      "poster",
      "painting",
      "mirror",
      "wall_clock",
      "wall_shelf",
      "botanical_print",
      "wall_tv",
      "wall_outlet",
      "wall_coat_hooks",
      "citrus_print",
      "coastal_print",
      "wall_spot_pair",
    ];
  let reflectingMirror = false;
  function archedOutline(w, h, inset = 0) {
    const shape = new THREE.Shape(),
      r = w / 2 - inset,
      bottom = -h / 2 + inset,
      spring = h / 2 - w / 2;
    shape.moveTo(-r, bottom);
    shape.lineTo(r, bottom);
    shape.lineTo(r, spring);
    shape.absarc(0, spring, r, 0, Math.PI, false);
    shape.lineTo(-r, bottom);
    shape.closePath();
    return shape;
  }
  function addMirrorSurface(group, w, d, h, silver, outline) {
    const geometry = outline
        ? new THREE.ShapeGeometry(outline, 24)
        : new THREE.PlaneGeometry(w - 0.05, h - 0.05),
      fallback = new THREE.Mesh(geometry, silver),
      surface = new Reflector(geometry.clone(), {
        clipBias: 0.003,
        color: "#eeeae3",
        multisample: 0,
        textureHeight: 512,
        textureWidth: 512,
      });
    surface.position.set(0, h / 2, d / 2 + 0.006);
    fallback.position.copy(surface.position);
    fallback.userData.mirrorFallback = true;
    fallback.receiveShadow = true;
    surface.visible = false;
    group.add(fallback, surface);
    const capture = surface.onBeforeRender;
    surface.onBeforeRender = function onBeforeRender(...args) {
      if (reflectingMirror || args[1].overrideMaterial) {
        return;
      }
      reflectingMirror = true;
      try {
        capture.apply(surface, args);
      } finally {
        reflectingMirror = false;
      }
    };
  }
  function updateMirrors(root, reflective) {
    root.traverse((node) => {
      if (node.isReflector) {
        node.visible = reflective;
      }
      if (node.userData.mirrorFallback) {
        node.visible = !reflective;
      }
    });
  }
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
        addMirrorSurface(group, w, d, h, silver);
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
      room.daylightAccess = openings.reduce((total, opening) => total + opening.z, 0);
      while (openings.length < 4) {
        openings.push(new THREE.Vector4());
      }
      roomMaterials.set(room.name, {
        base: room.elevation,
        bounds: new THREE.Vector4(
          room.centerX - (room.cols * program.grid) / 2,
          room.centerZ - (room.rows * program.grid) / 2,
          room.centerX + (room.cols * program.grid) / 2,
          room.centerZ + (room.rows * program.grid) / 2,
        ),
        materials: new Map(),
        openings,
        walls: new THREE.Vector4(
          ...["west", "north", "east", "south"].map((side) =>
            room.walls.includes(side) && !room.doors.includes(side) ? 1 : 0,
          ),
        ),
      });
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
              shader.uniforms.roomBounds = { value: entry.bounds };
              shader.uniforms.roomBase = { value: entry.base };
              shader.uniforms.roomWalls = { value: entry.walls };
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
                "uniform vec4 roomBounds; uniform vec4 roomWalls; uniform float roomBase;",
                shader.fragmentShader,
              ].join("\n");
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <lights_fragment_end>",
                [
                  "float daylightFill = 0.0;",
                  "vec3 skyNormal = inverseTransformDirection(normal, viewMatrix);",
                  "for (int i = 0; i < 4; i++) {",
                  "  float distanceToOpening = distance(daylightPosition.xz, daylightOpenings[i].xy);",
                  "  vec3 openingDirection = normalize(vec3(daylightOpenings[i].x - daylightPosition.x, roomBase + 1.6 - daylightPosition.y, daylightOpenings[i].y - daylightPosition.z) + vec3(0.0001));",
                  "  float facingOpening = 0.12 + 0.88 * max(0.0, dot(skyNormal, openingDirection));",
                  "  daylightFill += facingOpening * daylightOpenings[i].z / (1.0 + 0.18 * distanceToOpening * distanceToOpening);",
                  "}",
                  "vec3 windowSky = vec3(0.92, 0.96, 1.0) * min(daylightFill * 1.5, 0.95);",
                  "vec3 roomBounce = vec3(1.0, 0.93, 0.82) * min(daylightFill * 0.42, 0.24);",
                  "irradiance += (windowSky + roomBounce) * daylightStrength * daylightPass * PI;",
                  "#include <lights_fragment_end>",
                  "vec4 edge = abs(vec4(daylightPosition.xz - roomBounds.xy, roomBounds.zw - daylightPosition.xz));",
                  "vec4 nearWall = exp(-edge * 9.0) * roomWalls;",
                  "float contact = max(max(nearWall.x,nearWall.y),max(nearWall.z,nearWall.w)) * exp(-abs(daylightPosition.y-roomBase)*9.0);",
                  "reflectedLight.indirectDiffuse *= 1.0 - 0.22 * contact;",
                ].join("\n"),
              );
            };
            copy.customProgramCacheKey = () => "room-daylight-v4";
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
    const exteriorMaterials = new Map();
    root.traverse((node) => {
      if (!node.isMesh) {
        return;
      }
      const finish = (source) => {
        if (
          !source.isMeshStandardMaterial ||
          source.customProgramCacheKey() === "room-daylight-v4"
        ) {
          return source;
        }
        if (!exteriorMaterials.has(source)) {
          const copy = source.clone();
          daylightSourceMaterials.add(source);
          copy.userData.ownedTexture = false;
          copy.onBeforeCompile = (shader) => {
            shader.uniforms.daylightStrength = daylightStrength;
            shader.uniforms.daylightPass = daylightPass;
            shader.fragmentShader = `uniform float daylightStrength; uniform float daylightPass;\n${shader.fragmentShader}`;
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <lights_fragment_end>",
              "irradiance += vec3(0.32, 0.38, 0.46) * daylightStrength * daylightPass * PI;\n#include <lights_fragment_end>",
            );
          };
          copy.customProgramCacheKey = () => "exterior-sky-v1";
          exteriorMaterials.set(source, copy);
        }
        return exteriorMaterials.get(source);
      };
      node.material = Array.isArray(node.material)
        ? node.material.map(finish)
        : finish(node.material);
    });
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
          autoClearDepth: renderer.autoClearDepth,
          background: scene.background,
          clearAlpha: renderer.getClearAlpha(),
          clearColor: renderer.getClearColor(new THREE.Color()),
          environmentIntensity: scene.environmentIntensity,
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
        renderer.autoClearDepth = true;
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
            scene.environmentIntensity = 0;
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
        renderer.autoClearDepth = !saved.target?.depthTexture;
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
        scene.environmentIntensity = saved.environmentIntensity;
        scene.background = saved.background;
        renderer.toneMapping = saved.toneMapping;
        renderer.autoClear = saved.autoClear;
        renderer.autoClearDepth = saved.autoClearDepth;
        renderer.setClearColor(saved.clearColor, saved.clearAlpha);
        renderer.setRenderTarget(saved.target);
      }
    };
  }
  function createDetailRenderer(renderer, scene, sceneRoot, camera, renderBeauty) {
    const beauty = new THREE.WebGLRenderTarget(1, 1, {
        depthTexture: new THREE.DepthTexture(1, 1),
        samples: Math.min(2, renderer.capabilities.maxSamples),
        type: THREE.HalfFloatType,
      }),
      depthMaterial = new THREE.MeshDepthMaterial(),
      screen = new THREE.Scene(),
      screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      vertexShader =
        "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      ambient = new GTAOPass(
        scene,
        camera,
        1,
        1,
        undefined,
        { distanceFallOff: 1, radius: 0.4, samples: 12, scale: 0.85, thickness: 0.6 },
        { depthPhi: 2, normalPhi: 3, radius: 4, samples: 8 },
      ),
      compositeMaterial = new THREE.ShaderMaterial({
        depthTest: false,
        depthWrite: false,
        fragmentShader: [
          "varying vec2 vUv; uniform sampler2D colorMap,aoMap,depthMap; uniform vec2 texel;",
          "void main() {",
          " float centerDepth = texture2D(depthMap,vUv).r;",
          " float ao = texture2D(aoMap,vUv).r; float weightSum = 1.0;",
          " for (int x = -1; x <= 1; x++) { for (int y = -1; y <= 1; y++) {",
          "   if (x == 0 && y == 0) continue;",
          "   vec2 uv = vUv + vec2(float(x),float(y)) * texel;",
          "   float weight = exp(-abs(texture2D(depthMap,uv).r-centerDepth)*3000.0);",
          "   ao += texture2D(aoMap,uv).r * weight; weightSum += weight;",
          " }}",
          " gl_FragColor = vec4(texture2D(colorMap,vUv).rgb * clamp(ao/weightSum,0.45,1.0),1.0);",
          " #include <tonemapping_fragment>",
          " #include <colorspace_fragment>",
          "}",
        ].join("\n"),
        uniforms: {
          aoMap: { value: ambient.gtaoMap },
          colorMap: { value: beauty.texture },
          depthMap: { value: beauty.depthTexture },
          texel: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader,
      }),
      quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial),
      size = new THREE.Vector2();
    screen.add(quad);
    ambient.setGBuffer(beauty.depthTexture);
    ambient.output = GTAOPass.OUTPUT.Off;
    let allocated = false;
    return function renderDetail(detail = $("renderQuality").value !== "fast") {
      updateMirrors(sceneRoot, detail && $("renderQuality").value === "high");
      if (!detail || $("renderQuality").value === "fast") {
        if (allocated && $("renderQuality").value === "fast") {
          beauty.dispose();
          ambient.dispose();
          allocated = false;
        }
        renderBeauty();
        return;
      }
      renderer.getDrawingBufferSize(size);
      if (!allocated || beauty.width !== size.x || beauty.height !== size.y) {
        beauty.setSize(size.x, size.y);
        const scale = Math.min(0.5, Math.sqrt(500_000 / (size.x * size.y))),
          width = Math.max(1, Math.ceil(size.x * scale)),
          height = Math.max(1, Math.ceil(size.y * scale));
        ambient.setSize(width, height);
        compositeMaterial.uniforms.texel.value.set(1 / width, 1 / height);
        allocated = true;
      }
      const target = renderer.getRenderTarget(),
        { overrideMaterial } = scene,
        { background } = scene,
        { autoClearDepth } = renderer,
        shadowsEnabled = renderer.shadowMap.enabled,
        hidden = [];
      for (const node of scene.children) {
        if (node !== sceneRoot && node.visible && (node.isMesh || node.isGroup)) {
          hidden.push(node);
          node.visible = false;
        }
      }
      sceneRoot.traverseVisible((node) => {
        if (
          node.isLine ||
          node.userData.contact ||
          (node.isMesh && [node.material].flat().some((m) => m.transparent && m.opacity < 0.98))
        ) {
          hidden.push(node);
          node.visible = false;
        }
      });
      try {
        renderer.setRenderTarget(beauty);
        renderer.clear();
        scene.overrideMaterial = depthMaterial;
        scene.background = undefined;
        renderer.shadowMap.enabled = false;
        renderer.render(scene, camera);
        scene.overrideMaterial = overrideMaterial;
        scene.background = background;
        renderer.shadowMap.enabled = shadowsEnabled;
        hidden.forEach((node) => {
          node.visible = true;
        });
        renderBeauty();
        renderer.autoClearDepth = autoClearDepth;
        ambient.updateGtaoMaterial({ samples: $("renderQuality").value === "high" ? 24 : 12 });
        ambient.render(renderer);
        renderer.setRenderTarget(target);
        quad.material = compositeMaterial;
        renderer.render(screen, screenCamera);
      } finally {
        scene.overrideMaterial = overrideMaterial;
        scene.background = background;
        renderer.shadowMap.enabled = shadowsEnabled;
        renderer.autoClearDepth = autoClearDepth;
        hidden.forEach((node) => {
          node.visible = true;
        });
        renderer.setRenderTarget(target);
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
      ". | . | . | . | chair@0 | . | . | . | .",
      ". | . | chair@90 | . | dining_table(setting_on_top) | . | chair@270 | . | .",
      ". | . | . | . | chair@180 | . | . | . | .",
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
        `${room.kind === "garden" ? "GARDEN" : ["balcony", "garden"].includes(room.kind) ? "BALCONY" : "ROOM"} ${room.name} ${room.cols}x${room.rows} AT ${room.x},${room.z}`,
      );
      if (["balcony", "garden"].includes(room.kind)) {
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
      if (room.surface) {
        lines.push(`SURFACE ${room.surface}`);
      }
      if (room.height) {
        lines.push(`HEIGHT ${room.height}`);
      }
      if (room.style) {
        lines.push(`STYLE ${room.style}`);
      }
      for (const light of room.lights || []) {
        lines.push(`LIGHT ${light.name} AT ${light.x},${light.z} POWER ${light.power ?? 18}`);
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
        !["balcony", "garden"].includes(room.kind) &&
        room.windows?.length !== 0 &&
        !room.lights?.length &&
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
      column: [0.55, 0.55, defaultRoomHeight],
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
  const primaryTools = $("viewControls"),
    secondaryTools = $("sceneControls"),
    qualityControl = document.createElement("label");
  qualityControl.className = "quality-control";
  qualityControl.innerHTML =
    'Quality <select id="renderQuality" aria-label="Render quality"><option value="fast">Fast</option><option value="balanced" selected>Balanced</option><option value="high">High</option></select>';
  qualityControl.title =
    "Fast: lower resolution · Balanced: contact shading at rest · High: sharper shadows and more resolution";
  primaryTools.append(
    document.querySelector(".view-buttons"),
    qualityControl,
    $("saveViewButton"),
    $("fullscreenButton"),
  );
  secondaryTools.append(
    document.querySelector(".sun-panel"),
    $("floorFocus"),
    $("roomFocus"),
    $("photoView"),
    $("cutawayButton"),
    $("gridButton"),
    $("wallsButton"),
    $("ceilingsButton"),
    $("lightsButton"),
  );
  const sceneOptions = document.createElement("details"),
    sceneSummary = document.createElement("summary"),
    sceneOptionTools = document.createElement("div");
  sceneOptions.className = "scene-options";
  sceneSummary.className = "tool-button label-button";
  sceneSummary.textContent = "Scene";
  sceneOptionTools.className = "scene-option-tools";
  sceneOptions.append(sceneSummary, sceneOptionTools);
  sceneOptionTools.append(
    document.querySelector(".sun-panel"),
    $("cutawayButton"),
    $("gridButton"),
    $("wallsButton"),
    $("ceilingsButton"),
    $("lightsButton"),
  );
  secondaryTools.append(sceneOptions);
  sceneOptions.addEventListener("toggle", () => {
    if (!sceneOptions.open) {
      document.querySelector(".sun-panel").open = false;
    }
  });
  new ResizeObserver(() => {
    viewport.style.setProperty(
      "--preview-tools-height",
      `${document.querySelector(".preview-tools").offsetHeight}px`,
    );
  }).observe(document.querySelector(".preview-tools"));
  const photoViews = {
    "Mediterranean kitchen photo study": [
      { label: "Terrace → garden", room: "photo_terrace", x: 0.5, yaw: 180, z: 0.12 },
      { label: "Kitchen & fireplace", room: "photo_kitchen", x: 0.5, yaw: -25, z: 0.9 },
    ],
    "Mediterranean three-level apartment": [
      { label: "Terrace → garden", room: "garden_terrace", x: 0.4, yaw: 180, z: 0.12 },
      { label: "Garden → apartment", room: "mediterranean_garden", x: 0.55, yaw: 0, z: 0.82 },
      {
        label: "Kitchen & fireplace",
        lens: 75,
        room: "living_kitchen",
        x: 0.14,
        yaw: -65,
        z: 0.74,
      },
      { label: "Canopy bedroom", room: "upper_bedroom", x: 0.4, yaw: 0, z: 0.9 },
      { label: "Guest suite", room: "guest_suite", x: 0.7, yaw: 30, z: 0.85 },
      { label: "Bathroom", room: "lower_bath", x: 0.65, yaw: 145, z: 0.12 },
      {
        label: "Bedroom → balcony",
        lens: 60,
        pitch: -0.13,
        room: "upper_bedroom",
        x: 0.32,
        yaw: 180,
        z: 0.4,
      },
      {
        label: "Shaded balcony",
        lens: 60,
        pitch: -0.25,
        room: "sunny_balcony",
        x: 0.82,
        yaw: 55,
        z: 0.82,
      },
    ],
    "Warm modern apartment": [
      { label: "Living seating", pitch: -0.2, room: "living_dining", x: 0.15, yaw: -30, z: 0.8 },
      { label: "Timber dining", pitch: -0.19, room: "living_dining", x: 0.75, yaw: 170, z: 0.24 },
      { label: "Soft bedroom", room: "soft_bedroom", x: 0.8, yaw: 30, z: 0.85 },
    ],
  };
  $("photoView").addEventListener("change", () => {
    const preset = photoViews[select.value]?.[Number($("photoView").value)];
    if (!preset || $("photoView").value === "" || !currentProgram || sceneBuilding) {
      return;
    }
    const room = currentProgram.rooms.find((area) => area.name === preset.room),
      standing = findStandingPosition(
        room,
        room.centerX + (preset.x - 0.5) * room.cols * currentProgram.grid,
        room.centerZ + (preset.z - 0.5) * room.rows * currentProgram.grid,
      );
    if (!standing) {
      showStatus("No clear standing space for this view", "warn");
      return;
    }
    stopWalkthrough();
    focusRoom = room.name;
    focusFloor = room.floor;
    $("roomFocus").value = room.name;
    $("floorFocus").value = String(room.floor);
    if (!firstPerson) {
      setFirstPerson(true, standing);
    }
    camera.position.set(standing.x, room.elevation + walkEyeHeight, standing.z);
    camera.rotation.set(preset.pitch ?? -0.06, THREE.MathUtils.degToRad(preset.yaw), 0);
    $("walkLens").value = String(preset.lens || 60);
    camera.fov = Number($("walkLens").value);
    camera.updateProjectionMatrix();
    updateFloorVisibility();
    requestRender();
  });
  new ResizeObserver(() => {
    viewport.style.setProperty("--navigation-hint-height", `${$("navigationHint").offsetHeight}px`);
  }).observe($("navigationHint"));
  function renderProgress(message) {
    $("renderProgress").hidden = !message;
    $("renderProgressText").textContent = message || "";
    viewport.setAttribute("aria-busy", String(Boolean(message)));
  }
  function paintProgress(message) {
    renderProgress(message);
    return new Promise((resolve) => {
      requestAnimationFrame(() => setTimeout(resolve, 0));
    });
  }
  Object.assign(catalog, referenceCatalog, decorCatalog);
  let compileTimer,
    compiledSource,
    currentProgram,
    firstPerson = false,
    terrainCutaway = false,
    focusFloor,
    focusRoom,
    wallRoots = [],
    ceilingRoots = [],
    ceilingsCollapsed = true,
    orbitCeilingsCollapsed = true,
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
  let walkthrough,
    walkthroughRun = 0;
  let selectableGroups = [],
    collisionIndex = createCollisionIndex([]);
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
        layoutLanguage,
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
          stopWalkthrough();
          clearHover();
          select.value = "custom";
          $("photoView").hidden = true;
          $("editorState").textContent = "UPDATING…";
          clearTimeout(compileTimer);
          compileTimer = setTimeout(() => compile(), 350);
        }),
      ],
    });
  }
  const editor = new EditorView({ parent: editorHost, state: editorState("") });
  function setLayoutVisible(visible) {
    document.querySelector(".workspace").classList.toggle("scene-first", !visible);
    $("layoutToggle").setAttribute("aria-expanded", String(visible));
    $("layoutToggle").textContent = visible ? "Hide layout" : "Edit layout";
    if (visible) {
      editor.requestMeasure();
    }
  }
  setLayoutVisible(!matchMedia("(max-width: 900px)").matches);
  $("layoutToggle").addEventListener("click", () => {
    setLayoutVisible($("layoutToggle").getAttribute("aria-expanded") !== "true");
  });
  const divider = $("layoutDivider"),
    workspace = document.querySelector(".workspace");
  let dividerPointer;
  function resizeLayout(percent) {
    const width = THREE.MathUtils.clamp(percent, 24, 55);
    workspace.style.setProperty("--editor-width", `${width}%`);
    divider.setAttribute("aria-valuenow", String(Math.round(width)));
    editor.requestMeasure();
  }
  divider.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    dividerPointer = event.pointerId;
    divider.setPointerCapture(event.pointerId);
    divider.classList.add("resizing");
  });
  divider.addEventListener("pointermove", (event) => {
    if (dividerPointer !== event.pointerId) {
      return;
    }
    const bounds = workspace.getBoundingClientRect();
    resizeLayout(((event.clientX - bounds.left) / bounds.width) * 100);
  });
  function stopResizing() {
    dividerPointer = undefined;
    divider.classList.remove("resizing");
  }
  divider.addEventListener("pointerup", stopResizing);
  divider.addEventListener("lostpointercapture", stopResizing);
  divider.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const current = Number(divider.getAttribute("aria-valuenow"));
    resizeLayout(
      event.key === "Home"
        ? 24
        : event.key === "End"
          ? 55
          : current + (event.key === "ArrowLeft" ? -2 : 2),
    );
  });
  const assetBrowser = $("assetBrowser"),
    assetNames = Object.keys(catalog).toSorted();
  let selectedAsset, assetTarget, assetSourceDoc, assetStatements;
  function assetCell(range = editor.state.selection.main) {
    const line = editor.state.doc.lineAt(range.from);
    if (range.to > line.to) {
      return;
    }
    try {
      if (assetSourceDoc !== editor.state.doc) {
        assetStatements = readLayout(editor.state.doc.toString());
        assetSourceDoc = editor.state.doc;
      }
      let inLayout = false;
      for (const statement of assetStatements) {
        if (statement.kind === "Layout") {
          inLayout = true;
        } else if (statement.kind === "End") {
          inLayout = false;
        }
        if (inLayout && statement.line === line.number) {
          const token = statement.tokens.find(
            (item) => range.from >= line.from + item.start && range.to <= line.from + item.end,
          );
          if (token) {
            return {
              from: line.from + token.start,
              line: line.number,
              name: aliases[token.name] || token.name?.toLowerCase(),
              text: token.text,
              to: line.from + token.end,
            };
          }
        }
      }
    } catch {
      return false;
    }
  }
  let thumbnailManifest, thumbnailsLoading;
  async function loadAssetThumbnails() {
    if (thumbnailManifest || thumbnailsLoading) {
      return;
    }
    thumbnailsLoading = true;
    try {
      const response = await fetch(
        new URL("prm/assets/furniture-thumbnails.json", document.baseURI),
      );
      if (!response.ok) {
        return;
      }
      thumbnailManifest = await response.json();
      if (assetBrowser.open) {
        decorateAssetThumbnails();
      }
    } catch {
      thumbnailManifest = undefined;
    } finally {
      thumbnailsLoading = false;
    }
  }
  function decorateAssetThumbnails() {
    if (!thumbnailManifest) {
      return;
    }
    const { columns, rows, names } = thumbnailManifest;
    for (const button of $("assetResults").children) {
      const index = names.indexOf(button.dataset.asset),
        tile = button.firstElementChild;
      if (index === -1) {
        continue;
      }
      tile.style.backgroundImage = 'url("./prm/assets/furniture-thumbnails.webp")';
      tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
      tile.style.backgroundPosition = `${((index % columns) / (columns - 1)) * 100}% ${(Math.floor(index / columns) / (rows - 1)) * 100}%`;
    }
  }
  for (const option of $("assetCategory").options) {
    const count = assetNames.filter(
      (name) => option.value === "all" || assetCategory(name) === option.value,
    ).length;
    option.textContent += ` (${count})`;
  }
  function chooseAsset(name) {
    selectedAsset = name;
    for (const button of $("assetResults").children) {
      button.setAttribute("aria-pressed", String(button.dataset.asset === name));
    }
    $("assetName").textContent = name.replaceAll("_", " ");
    $("assetDimensions").textContent = `Width × depth × height: ${catalog[name].join(" × ")} m`;
    $("assetToken").textContent = name;
    $("assetContext").textContent = assetTarget
      ? `Replace the entire cell “${assetTarget.text}” on line ${assetTarget.line} with “${name}”. Uses the default size and orientation.`
      : "To place an asset, select a furniture cell or an empty cell (.) in a LAYOUT before opening Assets. You can also copy its token.";
    $("insertAsset").disabled = !assetTarget;
    if (assetBrowser.open) {
      previewAsset(name);
    }
  }
  function assetCategory(name) {
    if (lightAssets.includes(name) || /lamp|light|fan/u.test(name)) {
      return "lighting";
    }
    if (/vanity|toilet|shower|towel|drain|bathtub/u.test(name)) {
      return "bathroom";
    }
    if (/kitchen|fridge|coffee_maker|citrus_bowl|cafe_setting|breakfast|dining/u.test(name)) {
      return "kitchen";
    }
    if (/bed|wardrobe|dresser|garment|laundry|washing|bolster|shoe_rack/u.test(name)) {
      return "bedroom";
    }
    if (/sofa|chair|bench|pouf|ottoman|stool/u.test(name)) {
      return "seating";
    }
    if (/table|desk/u.test(name)) {
      return "tables";
    }
    if (
      /tree|plant|hedge|palm|cypress|flower|bougainvillea|garden|trellis|pergola|bbq|awning|terracotta|path|pool|fountain|parasol|outdoor|lounger|retaining/u.test(
        name,
      )
    ) {
      return "garden";
    }
    return "decor";
  }
  function filterAssets() {
    const words = $("assetSearch").value.toLowerCase().trim().split(/\s+/u),
      names = assetNames.filter(
        (name) =>
          ($("assetCategory").value === "all" ||
            assetCategory(name) === $("assetCategory").value) &&
          words.every((word) => name.replaceAll("_", " ").includes(word.replaceAll("_", " "))),
      );
    $("assetCount").textContent = `${names.length} of ${assetNames.length} assets`;
    $("assetResults").replaceChildren(
      ...names.map((name) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "asset-option";
        button.dataset.asset = name;
        const thumbnail = document.createElement("span"),
          label = document.createElement("span");
        thumbnail.className = "asset-thumbnail";
        thumbnail.setAttribute("aria-hidden", "true");
        label.textContent = name.replaceAll("_", " ");
        button.append(thumbnail, label);
        button.addEventListener("click", () => chooseAsset(name));
        return button;
      }),
    );
    $("assetResults").scrollTop = 0;
    decorateAssetThumbnails();
    $("assetBrowser").querySelector(".asset-detail").hidden = names.length === 0;
    if (names.length > 0) {
      chooseAsset(names.includes(selectedAsset) ? selectedAsset : names[0]);
    }
  }
  function openAssets(target = assetCell()) {
    pressedKeys.clear();
    stopWalkthrough();
    assetTarget = target;
    if (catalog[target?.name]) {
      selectedAsset = target.name;
      $("assetSearch").value = "";
      $("assetCategory").value = "all";
    }
    filterAssets();
    assetBrowser.showModal();
    loadAssetThumbnails();
    $("assetSearch").focus();
    previewAsset(selectedAsset);
    $("assetResults").querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: "nearest" });
  }
  $("assetsButton").disabled = false;
  $("assetsButton").addEventListener("click", () => openAssets());
  $("closeAssets").addEventListener("click", () => assetBrowser.close());
  $("assetSearch").addEventListener("input", filterAssets);
  $("assetCategory").addEventListener("change", filterAssets);
  $("insertAsset").addEventListener("click", () => {
    if (
      !assetTarget ||
      editor.state.doc.sliceString(assetTarget.from, assetTarget.to) !== assetTarget.text
    ) {
      return;
    }
    editor.dispatch({
      changes: { from: assetTarget.from, insert: selectedAsset, to: assetTarget.to },
      selection: { anchor: assetTarget.from + selectedAsset.length },
    });
    assetBrowser.close();
    setLayoutVisible(true);
    editor.focus();
  });
  $("copyAsset").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(selectedAsset);
      $("assetContext").textContent = `Copied ${selectedAsset}. Paste it into a layout cell.`;
    } catch {
      $("assetContext").textContent =
        "Could not copy. Select the token above and copy it manually.";
    }
  });
  let assetStudio;
  function clearAssetPreview() {
    if (!assetStudio?.object) {
      return;
    }
    assetStudio.scene.remove(assetStudio.object);
    assetStudio.object.traverse((node) => {
      if (node.isReflector) {
        node.getRenderTarget().dispose();
      }
      if (node.geometry && !templateGeometries.has(node.geometry)) {
        node.geometry.dispose();
      }
      for (const finish of [node.material].flat().filter(Boolean)) {
        if (!sharedMaterials.has(finish)) {
          finish.dispose();
        }
      }
    });
    assetStudio.object = undefined;
  }
  function fitAssetPreview(studio) {
    if (!studio.corners) {
      return;
    }
    studio.framing = true;
    for (let pass = 0; pass < 3; pass += 1) {
      studio.camera.updateMatrixWorld();
      const extent = Math.max(
        ...studio.corners.map((corner) => {
          const projected = corner.clone().project(studio.camera);
          return Math.max(Math.abs(projected.x), Math.abs(projected.y));
        }),
      );
      studio.camera.position.multiplyScalar(extent / 0.8);
      studio.controls.update();
    }
    studio.framing = false;
  }
  function previewAsset(name) {
    if (!name || !assetBrowser.open) {
      return;
    }
    if (!assetStudio) {
      const scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100),
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }),
        controls = new OrbitControls(camera, renderer.domElement);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const environmentRoom = new RoomEnvironment(),
        environmentGenerator = new THREE.PMREMGenerator(renderer),
        environment = environmentGenerator.fromScene(environmentRoom, 0.04, 0.1, 100);
      environmentRoom.dispose();
      environmentGenerator.dispose();
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.65;
      scene.add(new THREE.HemisphereLight("#fff9ec", "#95856c", 0.9));
      const key = new THREE.DirectionalLight("#ffffff", 2.6);
      key.position.set(3, 5, 4);
      scene.add(key);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          alphaMap: contactTexture,
          color: "#45503d",
          depthWrite: false,
          opacity: 0.3,
          transparent: true,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      scene.add(shadow);
      controls.enablePan = false;
      controls.addEventListener("change", () => {
        if (!assetStudio?.framing) {
          renderer.render(scene, camera);
        }
      });
      $("assetPreview").replaceChildren(renderer.domElement);
      const observer = new ResizeObserver(() => {
        if (!assetStudio || !assetBrowser.open) {
          return;
        }
        const width = $("assetPreview").clientWidth,
          height = $("assetPreview").clientHeight;
        if (!width || !height) {
          return;
        }
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        fitAssetPreview(assetStudio);
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
      });
      assetStudio = { camera, controls, environment, observer, renderer, scene, shadow };
      observer.observe($("assetPreview"));
    }
    clearAssetPreview();
    const count = selectableGroups.length,
      object = makeFurniture({ dimensions: catalog[name], name, yaw: 0 });
    selectableGroups.length = count;
    object.traverse((node) => {
      if (node.geometry && templateGeometries.has(node.geometry)) {
        node.geometry = node.geometry.clone();
      }
      if (node.isLight) {
        node.visible = false;
      }
    });
    const bounds = new THREE.Box3().setFromObject(object),
      center = bounds.getCenter(new THREE.Vector3()),
      size = bounds.getSize(new THREE.Vector3()),
      studio = assetStudio,
      width = Math.max(160, $("assetPreview").clientWidth),
      height = $("assetPreview").clientHeight;
    object.position.sub(center);
    studio.object = object;
    studio.scene.add(object);
    studio.shadow.scale.set(Math.max(size.x, 0.2) * 1.35, Math.max(size.z, 0.2) * 1.35, 1);
    studio.shadow.position.y = -size.y / 2 + 0.002;
    studio.camera.aspect = width / height;
    studio.camera.updateProjectionMatrix();
    const radius = Math.max(size.x, size.y, size.z) / 2,
      distance = (radius / Math.sin(THREE.MathUtils.degToRad(35) / 2)) * 1.25;
    studio.camera.position.set(distance * 0.68, distance * 0.42, distance * 0.68);
    studio.controls.target.set(0, 0, 0);
    studio.controls.minDistance = radius * 1.1;
    studio.controls.maxDistance = distance * 3;
    studio.controls.update();
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          corners.push(new THREE.Vector3(x, y, z).sub(center));
        }
      }
    }
    studio.corners = corners;
    fitAssetPreview(studio);
    studio.renderer.setSize(width, height, false);
    studio.renderer.render(studio.scene, studio.camera);
    $("assetPreview").setAttribute(
      "aria-label",
      `${name.replaceAll("_", " ")} · interactive 3D preview`,
    );
  }
  assetBrowser.addEventListener("close", () => {
    clearAssetPreview();
    if (assetStudio) {
      assetStudio.controls.dispose();
      assetStudio.observer.disconnect();
      assetStudio.shadow.geometry.dispose();
      assetStudio.shadow.material.dispose();
      assetStudio.environment.dispose();
      assetStudio.renderer.dispose();
      assetStudio.renderer.forceContextLoss();
      assetStudio = undefined;
      $("assetPreview").replaceChildren();
    }
  });
  function highlightSource(lineNumber, reveal) {
    const line = editor.state.doc.line(lineNumber),
      effects = [];
    if (reveal) {
      setLayoutVisible(true);
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
    if (selectionPinned || sceneBuilding || editor.state.doc.toString() !== compiledSource) {
      return;
    }
    const bounds = renderer.domElement.getBoundingClientRect(),
      mouse = new THREE.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      ),
      ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    sceneRoot.updateMatrixWorld(true);
    const candidates = [];
    sceneRoot.traverseVisible((node) => {
      if (node.isMesh && !node.userData.contact && !node.isReflector) {
        candidates.push(node);
      }
    });
    const hit = ray.intersectObjects(candidates, false).find(({ object }) => {
      for (let node = object; node; node = node.parent) {
        if (!node.visible) {
          return false;
        }
      }
      return object.isMesh && !object.userData.contact;
    });
    let group = hit?.object;
    while (group && !group.userData.token) {
      group = group.parent;
    }
    indicateGroup(group);
  }
  function roomAdjustments(room) {
    const sourceDoc = compiledSource;
    const adjustments = document.createElement("details"),
      summary = document.createElement("summary"),
      form = document.createElement("form"),
      fields = new Map();
    adjustments.className = "object-adjustments";
    summary.textContent = room.kind === "room" ? "Room finishes & height" : "Outdoor finishes";
    form.className = "object-dimensions";
    const settings = [
      ["Style", "Style", room.style, roomStyles],
      ["Surface", "Floor finish", room.surface, floorFinishes],
    ];
    if (room.kind === "room") {
      settings.unshift(["Height", "Ceiling height (m)", room.height]);
    }
    for (const [kind, caption, value, choices] of settings) {
      const wrapper = document.createElement("label"),
        input = document.createElement(choices ? "select" : "input");
      wrapper.textContent = caption;
      input.setAttribute(
        "aria-label",
        `${room.name.replaceAll("_", " ")} ${caption.toLowerCase()}`,
      );
      if (choices) {
        for (const choice of choices) {
          input.add(
            new Option(
              choice === "auto" ? "Automatic" : choice[0].toUpperCase() + choice.slice(1),
              choice,
            ),
          );
        }
      } else {
        input.type = "number";
        input.required = true;
        input.min = "2.4";
        input.max = "6";
        input.step = "any";
      }
      input.value = String(value);
      wrapper.append(input);
      form.append(wrapper);
      fields.set(kind, input);
    }
    const apply = document.createElement("button");
    apply.type = "submit";
    apply.className = "tool-button";
    apply.textContent = "Apply";
    form.append(apply);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity() || editor.state.doc.toString() !== sourceDoc) {
        return;
      }
      const statements = readLayout(sourceDoc),
        start = statements.findIndex(
          (statement) => statement.kind === "Room" && statement.line === room.line,
        ),
        region = [];
      for (const statement of statements.slice(start + 1)) {
        if (["Room", "Floor", "Layout"].includes(statement.kind)) {
          break;
        }
        region.push(statement);
      }
      const changes = [],
        missing = [];
      for (const [kind, , oldValue] of settings) {
        const input = fields.get(kind),
          value = kind === "Height" ? input.valueAsNumber : input.value;
        if (String(value) === String(oldValue)) {
          continue;
        }
        const replacement = `${kind.toUpperCase()} ${value}`,
          directive = region.findLast((statement) => statement.kind === kind);
        if (directive) {
          const line = editor.state.doc.line(directive.line),
            from = line.from + line.text.indexOf(directive.text);
          changes.push({ from, insert: replacement, to: from + directive.text.length });
        } else {
          missing.push(replacement);
        }
      }
      if (missing.length > 0) {
        changes.push({
          from: editor.state.doc.line(room.line).to,
          insert: `\n${missing.join("\n")}`,
        });
      }
      if (changes.length > 0) {
        editor.dispatch({ changes: changes.toSorted((a, b) => a.from - b.from) });
        clearHover();
      }
    });
    adjustments.append(summary, form);
    return adjustments;
  }
  function indicateGroup(group) {
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
    const room = currentProgram.rooms.find(
        (area) => area.line === token.line && area.name === token.room,
      ),
      roomSelection = room && token.name === room.kind;
    title.textContent = (roomSelection ? room.name : token.name).replaceAll("_", " ");
    const dimensions = document.createElement("span");
    dimensions.textContent = roomSelection
      ? `${token.dimensions
          .slice(0, 2)
          .map((x) => x.toFixed(2))
          .join(" × ")} m${room.kind === "room" ? ` · ${room.height.toFixed(2)} m ceiling` : ""}`
      : `${token.dimensions.map((x) => x.toFixed(2)).join(" × ")} m · ${token.yaw}°`;
    const source = document.createElement("span");
    source.textContent = `${roomSelection ? floorLabel(room.floor) : token.room.replaceAll("_", " ")} · line ${token.line}`;
    selectionCard.append(title, dimensions, source);
    const sourceLine = editor.state.doc.line(token.line),
      cell =
        Number.isInteger(token.start) && Number.isInteger(token.end)
          ? assetCell({ from: sourceLine.from + token.start, to: sourceLine.from + token.end })
          : undefined;
    if (cell) {
      const change = document.createElement("button");
      change.className = "text-button change-asset";
      change.type = "button";
      change.textContent = "Change asset…";
      const editCell = document.createElement("button");
      editCell.className = "text-button change-asset";
      editCell.type = "button";
      editCell.textContent = "Edit cell";
      editCell.addEventListener("click", () => {
        highlightSource(token.line, true);
        editor.dispatch({ selection: { anchor: cell.from, head: cell.to } });
        editor.focus();
      });
      selectionCard.append(editCell);
      change.addEventListener("click", () => openAssets(cell));
      selectionCard.append(change);
      const adjustments = document.createElement("details"),
        summary = document.createElement("summary"),
        form = document.createElement("form"),
        fields = [];
      adjustments.className = "object-adjustments";
      summary.textContent = "Size & rotation";
      form.className = "object-dimensions";
      for (const [index, label] of ["Width", "Depth", "Height", "Rotation"].entries()) {
        const wrapper = document.createElement("label"),
          input = document.createElement("input");
        wrapper.textContent = index === 3 ? `${label} (°)` : `${label} (m)`;
        input.type = "number";
        input.required = true;
        input.step = "any";
        if (index < 3) {
          input.min = "0.01";
          input.max = "10";
        }
        input.disabled = index === 3 && Boolean(token.wall);
        if (input.disabled) {
          input.title = `Facing direction is set by the ${token.wall} wall`;
        }
        input.value = String(index === 3 ? token.yaw : token.dimensions[index]);
        input.setAttribute(
          "aria-label",
          `${token.name.replaceAll("_", " ")} ${label.toLowerCase()}`,
        );
        wrapper.append(input);
        form.append(wrapper);
        fields.push(input);
      }
      const apply = document.createElement("button");
      apply.type = "submit";
      apply.className = "tool-button";
      apply.textContent = "Apply";
      form.append(apply);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (
          !form.checkValidity() ||
          editor.state.doc.sliceString(cell.from, cell.to) !== cell.text
        ) {
          return;
        }
        const values = fields.map((input) => input.valueAsNumber);
        if (!values.every((value) => Number.isFinite(value))) {
          return;
        }
        const yaw = ((values[3] % 360) + 360) % 360,
          prefix = cell.text.match(/^[\w]+(?:@[+-]?(?:\d+(?:\.\d+)?|\.\d+))?(?:\[[^\]]+\])?/u),
          suffix = cell.text.slice(prefix?.[0].length || 0),
          name = prefix?.[0].match(/^[\w]+/u)?.[0];
        if (!name) {
          return;
        }
        editor.dispatch({
          changes: {
            from: cell.from,
            insert: `${name}${token.wall ? "" : `@${yaw}`}[${values.slice(0, 3).join("x")}]${suffix}`,
            to: cell.to,
          },
        });
        clearHover();
      });
      if (token.wall) {
        const explanation = document.createElement("span");
        explanation.textContent = `Facing direction follows the ${token.wall} wall.`;
        form.append(explanation);
      }
      adjustments.append(summary, form);
      selectionCard.append(adjustments);
    }
    if (roomSelection) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "text-button change-asset";
      edit.textContent = "Edit room definition";
      edit.addEventListener("click", () => {
        highlightSource(token.line, true);
        editor.dispatch({ selection: { anchor: sourceLine.from, head: sourceLine.to } });
        editor.focus();
      });
      selectionCard.append(edit, roomAdjustments(room));
    }
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
    highlightSource(token.line, false);
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
  function parseToken(syntax, line) {
    const { text: token, yaw, wall, child, start, end } = syntax;
    if ([".", "0", "-"].includes(token)) {
      return;
    }
    const url = productUrl(syntax.url, line),
      name = aliases[syntax.name] || syntax.name.toLowerCase();
    if (!catalog[name]) {
      fail(`Unknown object "${syntax.name}"`, line);
    }
    const dimensions = syntax.dimensions || catalog[name];
    if (dimensions.some((n) => !Number.isFinite(n) || n <= 0 || n > 10)) {
      fail("Dimensions must be between 0 and 10 metres", line);
    }
    if (child && !/_on_top$/iu.test(child)) {
      fail(`Invalid object "${token}"`, line);
    }
    if (wall && !["north", "east", "south", "west"].includes(wall)) {
      fail(`Invalid wall "${wall}"`, line);
    }
    if (wall && (yaw !== undefined || ["stairs", "elevator"].includes(name))) {
      fail(
        "Wall placement sets the facing direction and cannot be used with @ or connectors",
        line,
      );
    }
    return {
      child: child?.slice(0, -7),
      dimensions,
      end,
      line,
      name,
      start,
      url,
      wall,
      yaw: wall ? { east: 270, north: 0, south: 180, west: 90 }[wall] : Number(yaw || 0),
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
          Math.abs(start + along - middle) <
            width / 2 + doorwayWidth(program, support, side, span) / 2
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
    readLayout(source).forEach((statement) => {
      const { line, text, kind } = statement;
      if (kind === "WallThickness") {
        const values = statement.numbers;
        if (
          active ||
          values.length !== 2 ||
          values.some((value) => !Number.isFinite(value) || value < 0.06 || value > 0.6)
        ) {
          fail("Use WALL_THICKNESS exterior interior outside layouts, each 0.06–0.6 metres", line);
        }
        [program.exteriorWallThickness, program.interiorWallThickness] = values;
      } else if (["Site", "Facade", "Roof"].includes(kind)) {
        if (active) {
          fail("Exterior settings belong outside layouts", line);
        }
        const setting = kind.toLowerCase(),
          value = statement.names[0].toLowerCase(),
          choices = {
            facade: ["none", "plaster", "brick", "timber", "concrete"],
            roof: ["none", "flat", "pitched", "terracotta"],
            site: ["none", "grass", "paving", "sand"],
          };
        if (!choices[setting].includes(value)) {
          fail(
            "Use SITE none/grass/paving/sand [margin], FACADE none/plaster/brick/timber/concrete, or ROOF none/flat/pitched/terracotta",
            line,
          );
        }
        if (setting === "site" && statement.numbers[0] !== undefined) {
          const [margin] = statement.numbers;
          if (!Number.isFinite(margin) || margin < 1 || margin > 30) {
            fail("SITE margin must be 1–30 metres", line);
          }
          program.margin = margin;
        }
        program[setting] = value;
      } else if (kind === "Light") {
        const name = statement.names[0].toLowerCase();
        if (!currentRoom || active || !lightAssets.includes(name)) {
          fail("Use LIGHT asset AT column,row [POWER 0–200] inside a room definition", line);
        }
        if (name === "wall_lamp") {
          fail("Use MOUNT east 2 wall_lamp for wall fixtures", line);
        }
        const [x, z] = statement.point,
          [power] = statement.numbers;
        if (
          x > currentRoom.cols - 1 ||
          z > currentRoom.rows - 1 ||
          (power !== undefined && (!Number.isFinite(power) || power > 200)) ||
          currentRoom.lights.length >= 64
        ) {
          fail("LIGHT must fit the room, with POWER 0–200 and at most 64 fixtures per room", line);
        }
        currentRoom.lights.push({ line, name, power, x, z });
      } else if (kind === "Floor") {
        const value = statement.number;
        if (!Number.isInteger(value) || value > 31 || value < -8 || active) {
          fail("Use FLOOR −8–31 outside a layout (0 = ground, −1 = basement)", line);
        }
        floor = value;
        currentRoom = undefined;
      } else if (kind === "Room") {
        if (active) {
          fail("Finish the current layout with END before another area", line);
        }
        const [cols, rows] = statement.dimensions,
          [x, z] = statement.point,
          areaKind = statement.areaKind === "garden" ? "balcony" : statement.areaKind,
          room = {
            cols,
            doors: [],
            elevation: floor * 3,
            floor,
            garden: statement.areaKind === "garden",
            height: areaKind === "room" ? defaultRoomHeight : 2.75,
            kind: areaKind,
            lights: [],
            line,
            mounts: [],
            name: (statement.names[0] || "main").toLowerCase(),
            rails: statement.areaKind === "balcony" ? ["west", "south", "east"] : [],
            rows,
            style: "warm",
            surface: statement.areaKind === "garden" ? "grass" : "auto",
            walls: areaKind === "balcony" ? [] : ["north", "east", "west"],
            x,
            z,
          };
        if (!Number.isInteger(room.x) || !Number.isInteger(room.z)) {
          fail("Room coordinates must be whole cells", line);
        }
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
      } else if (kind === "Grid") {
        program.grid = statement.number;
        if (program.grid < 0.2 || program.grid > 3) {
          fail("Grid size must be 0.2–3 metres", line);
        }
      } else if (kind === "Walls") {
        if (!currentRoom) {
          fail("Define a ROOM before its WALLS", line);
        }
        const { directions } = statement;
        if (directions.some((d) => !["north", "south", "east", "west", "none"].includes(d))) {
          fail("Walls must use north, south, east, west or none", line);
        }
        currentRoom.walls = directions.includes("none") ? [] : [...new Set(directions)];
        currentRoom.wallsLine = line;
      } else if (kind === "Rails") {
        if (!currentRoom || currentRoom.kind !== "balcony") {
          fail("RAILS applies to the most recent BALCONY", line);
        }
        const { directions } = statement;
        if (directions.some((d) => !["north", "south", "east", "west", "none"].includes(d))) {
          fail("Rails must use north, south, east, west or none", line);
        }
        currentRoom.rails = directions.includes("none") ? [] : [...new Set(directions)];
      } else if (kind === "Windows") {
        if (!currentRoom || currentRoom.kind === "balcony") {
          fail("WINDOWS needs an indoor ROOM", line);
        }
        const { directions } = statement;
        if (
          directions.some((dir) => !["north", "south", "east", "west", "none"].includes(dir)) ||
          (directions.includes("none") && directions.length > 1)
        ) {
          fail("Use WINDOWS north south east west, or WINDOWS none", line);
        }
        currentRoom.windows = directions.includes("none") ? [] : [...new Set(directions)];
        currentRoom.windowsLine = line;
      } else if (kind === "Doors") {
        if (!currentRoom) {
          fail("Define a ROOM before its DOORS", line);
        }
        const { directions } = statement;
        if (directions.some((d) => !["north", "south", "east", "west"].includes(d))) {
          fail("Doors must use north, south, east or west", line);
        }
        currentRoom.doors = [...new Set(directions)];
        currentRoom.doorsLine = line;
      } else if (kind === "Height") {
        const height = statement.number;
        if (active || !currentRoom || currentRoom.kind !== "room" || height < 2.4 || height > 6) {
          fail("Use HEIGHT 2.4–6 metres inside an indoor room definition", line);
        }
        currentRoom.height = height;
      } else if (kind === "Surface") {
        const surface = statement.names[0].toLowerCase();
        if (active || !currentRoom || !floorFinishes.includes(surface)) {
          fail(
            "Use SURFACE auto/tile/stone/grass/terracotta/wood/concrete inside an area definition",
            line,
          );
        }
        currentRoom.surface = surface;
      } else if (kind === "Style") {
        if (!currentRoom) {
          fail("Define a ROOM before its STYLE", line);
        }
        const style = statement.names[0].toLowerCase();
        if (!roomStyles.includes(style)) {
          fail(
            "STYLE must be warm, blue, neutral, liminal, industrial, aquatic, or mediterranean",
            line,
          );
        }
        currentRoom.style = style;
      } else if (kind === "Mount") {
        if (!currentRoom || currentRoom.kind === "balcony") {
          fail("MOUNT needs an indoor ROOM", line);
        }
        const [side, asset] = statement.names;
        if (
          !["north", "south", "east", "west"].includes(side.toLowerCase()) ||
          !Number.isInteger(statement.number)
        ) {
          fail("MOUNT requires a wall direction and a whole cell number", line);
        }
        if (!["air_conditioner", "wall_lamp", ...wallDecor].includes(asset.toLowerCase())) {
          fail("MOUNT requires a wall decoration, wall_lamp, or air_conditioner", line);
        }
        currentRoom.mounts.push({
          cell: statement.number,
          line,
          name: asset.toLowerCase(),
          side: side.toLowerCase(),
          url: productUrl(statement.url, line),
        });
      } else if (kind === "Layout") {
        active = statement.names[0].toLowerCase();
        if (program.layouts[active]) {
          fail(`Layout "${active}" is already defined`, line);
        }
        program.layouts[active] = [];
      } else if (kind === "End") {
        if (!active) {
          fail("END without a layout", line);
        }
        active = undefined;
      } else {
        if (!active) {
          fail(`Unexpected text "${text}"`, line);
        }
        const { tokens } = statement;
        const separators = tokens.slice(1).map((token, index) => {
          const previous = tokens[index];
          const original = raw[line - 1];
          return original.slice(previous.end, token.start);
        });
        if (
          separators.some((gap) => gap.includes("|")) &&
          separators.some((gap) => !gap.includes("|"))
        ) {
          fail("Separate every grid cell with |, or use whitespace throughout the row", line);
        }
        program.layouts[active].push(tokens.map((token) => parseToken(token, line)));
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
          a.elevation < b.elevation + b.height + 0.12 &&
          b.elevation < a.elevation + a.height + 0.12 &&
          a.x < b.x + b.cols &&
          a.x + a.cols > b.x &&
          a.z < b.z + b.rows &&
          a.z + a.rows > b.z
        ) {
          fail(`Rooms "${a.name}" and "${b.name}" overlap; check their floor and HEIGHT`, b.line);
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
          if (token.name === "archway" || token.name === "timber_pergola") {
            const nearPost =
                Math.abs(localX) > width / 2 - 0.22 - radius &&
                Math.abs(localX) < width / 2 + radius,
              alongPost =
                token.name === "archway"
                  ? Math.abs(localZ) < depth / 2 + radius
                  : Math.abs(Math.abs(localZ) - depth / 2) < 0.15 + radius;
            if (nearPost && alongPost) {
              return false;
            }
          } else if (token.name === "elevator") {
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
  renderer.info.autoReset = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const reflectionRoom = new RoomEnvironment(),
    reflectionGenerator = new THREE.PMREMGenerator(renderer),
    reflectionTarget = reflectionGenerator.fromScene(reflectionRoom, 0.04, 0.1, 100);
  scene.environment = reflectionTarget.texture;
  scene.environmentIntensity = 0.22;
  reflectionRoom.dispose();
  reflectionGenerator.dispose();
  viewport.prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement),
    lookControls = new PointerLockControls(camera, renderer.domElement);
  lookControls.enabled = false;
  lookControls.pointerSpeed = 1.5;
  lookControls.minPolarAngle = Math.PI * 0.02;
  lookControls.maxPolarAngle = Math.PI * 0.98;
  lookControls.addEventListener("change", requestRender);
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
    cameraExposureCompensation = 0,
    indoorExposureAdjustment = 0,
    desiredIndoorExposureAdjustment = 0,
    previousDaylight,
    renderDirty = true,
    lastBuildTime = 0;
  const lastView = new THREE.Matrix4(),
    renderFixtures = createFixtureRenderer(renderer, scene, camera, sunlight),
    renderDetail = createDetailRenderer(renderer, scene, sceneRoot, camera, renderFixtures);
  function requestRender() {
    renderDirty = true;
  }
  controls.addEventListener("change", requestRender);
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
        const intensity = enabled ? node.userData.litIntensity : 0;
        if (node.intensity !== intensity || node.visible !== enabled) {
          renderer.shadowMap.needsUpdate = true;
        }
        node.intensity = intensity;
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
  const qualityProfiles = {
    balanced: { pixels: 2_000_000, ratio: 1.5, shadow: 2048 },
    fast: { pixels: 1_000_000, ratio: 1, shadow: 1024 },
    high: { pixels: 4_000_000, ratio: 2, shadow: 4096 },
  };
  let motionResolution = false;
  $("renderQuality").addEventListener("change", () => {
    const profile = qualityProfiles[$("renderQuality").value],
      shadowSize = Math.min(profile.shadow, renderer.capabilities.maxTextureSize);
    if (sunlight.shadow.mapSize.x !== shadowSize) {
      sunlight.shadow.map?.dispose();
      /* eslint-disable unicorn/no-null -- Three.js recreates shadow targets only when map is null. */ sunlight.shadow.map =
        null;
      /* eslint-enable unicorn/no-null */ sunlight.shadow.mapSize.set(shadowSize, shadowSize);
      renderer.shadowMap.needsUpdate = true;
    }
    resize();
  });
  const sunFields = [
      "Date",
      "Time",
      "Latitude",
      "Longitude",
      "Offset",
      "Orientation",
      "Exposure",
      "ExposureMode",
    ],
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
  const skyUniforms = {
      day: { value: 1 },
      moonDirection: { value: new THREE.Vector3() },
      sunDirection: { value: new THREE.Vector3() },
      twilight: { value: 0 },
    },
    skyMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      fragmentShader: [
        "varying vec3 direction;",
        "uniform vec3 sunDirection;",
        "uniform vec3 moonDirection;",
        "uniform float day;",
        "uniform float twilight;",
        "float hash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }",
        "void main() {",
        "vec3 ray = normalize(direction);",
        "float height = max(ray.y, 0.0);",
        "float horizon = pow(1.0 - height, 5.0);",
        "vec3 night = mix(vec3(0.002,0.004,0.012), vec3(0.012,0.018,0.03), horizon);",
        "vec3 daylight = mix(vec3(0.12,0.32,0.64), vec3(0.65,0.76,0.8), horizon);",
        "vec3 color = mix(night, daylight, day);",
        "float facingSun = pow(max(dot(ray, normalize(vec3(sunDirection.x,0.001,sunDirection.z))),0.0),8.0);",
        "color += vec3(0.55,0.14,0.035) * twilight * horizon * facingSun;",
        "float sunAngle = dot(ray, sunDirection);",
        "color += vec3(1.0,0.65,0.3) * pow(max(sunAngle,0.0),256.0) * day * 0.35;",
        "color += vec3(8.0,6.5,4.0) * smoothstep(0.999986,0.999991,sunAngle) * step(0.0,ray.y);",
        "vec2 starUV = vec2(atan(ray.z,ray.x),asin(ray.y)) * 180.0;",
        "vec3 cell = vec3(floor(starUV),0.0);",
        "float star = step(0.992,hash(cell)) * (1.0-smoothstep(0.06,0.24,length(fract(starUV)-0.5)));",
        "color += vec3(star * 2.0) * (1.0-day) * (1.0-twilight) * smoothstep(0.0,0.15,ray.y);",
        "float moonCos = dot(ray,moonDirection);",
        "float moonRadius = 0.0045;",
        "if (moonCos > cos(moonRadius) && ray.y > 0.0) {",
        "vec3 tangent = (ray - moonDirection * moonCos) / moonRadius;",
        "vec3 normal = tangent - moonDirection * sqrt(max(0.0,1.0-dot(tangent,tangent)));",
        "float lit = max(dot(normal,sunDirection),0.0);",
        "color = vec3(0.008,0.01,0.016) + vec3(0.8,0.83,0.88) * lit;",
        "}",
        "color = mix(vec3(0.006,0.009,0.012) + vec3(0.12,0.16,0.1)*day, color, smoothstep(-0.025,0.0,ray.y));",
        "gl_FragColor = vec4(color,1.0);",
        "#include <tonemapping_fragment>",
        "#include <colorspace_fragment>",
        "}",
      ].join("\n"),
      side: THREE.BackSide,
      uniforms: skyUniforms,
      vertexShader: [
        "varying vec3 direction;",
        "void main() {",
        "direction = position;",
        "vec4 clip = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);",
        "gl_Position = clip.xyww;",
        "}",
      ].join("\n"),
    }),
    sky = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), skyMaterial);
  sky.frustumCulled = false;
  sky.renderOrder = -1000;
  scene.add(sky);
  function updateSun(event) {
    renderDirty = true;
    if (!$("sunSettings").checkValidity()) {
      $("sunStatus").textContent = "Enter a valid date, time, and values within the shown ranges.";
      return;
    }
    if (!["sunExposure", "sunExposureMode"].includes(event?.target?.id)) {
      renderer.shadowMap.needsUpdate = true;
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
      height = currentProgram
        ? Math.max(...currentProgram.rooms.map((room) => room.elevation + room.height)) -
          currentProgram.floors[0] * 3
        : 3,
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
    sunlight.target.position.set(0, height / 2 + (currentProgram?.floors[0] || 0) * 3, 0);
    sunlight.position
      .set(
        Math.sin(bearing) * Math.cos(elevation),
        Math.sin(elevation),
        -Math.cos(bearing) * Math.cos(elevation),
      )
      .multiplyScalar(radius * 3)
      .add(sunlight.target.position);
    cameraExposureCompensation = $("sunExposure").valueAsNumber;
    renderer.toneMappingExposure =
      baseCameraExposure * 2 ** (cameraExposureCompensation + indoorExposureAdjustment);
    daylightStrength.value = Math.min(1, daylight * 4);
    scene.environmentIntensity = daylightStrength.value * 0.22;
    sunlight.intensity = altitude > 0 ? 2.4 * Math.min(1, daylight * 4) : 0;
    sunlight.castShadow = altitude > 0;
    if (previousDaylight !== altitude > 0) {
      fixtureOverride = undefined;
    }
    previousDaylight = altitude > 0;
    updateIndoorLights();
    sunlight.color.setHSL(0.1, 0.15 + 0.55 * (1 - Math.min(1, daylight * 3)), 0.9);
    skyUniforms.sunDirection.value
      .copy(sunlight.position)
      .sub(sunlight.target.position)
      .normalize();
    skyUniforms.moonDirection.value.copy(
      lunarDirection(
        $("sunDate").value,
        $("sunTime").value,
        $("sunLatitude").valueAsNumber,
        $("sunLongitude").valueAsNumber,
        $("sunOffset").valueAsNumber,
        $("sunOrientation").valueAsNumber,
      ),
    );
    skyUniforms.day.value = THREE.MathUtils.smoothstep(altitude, -6, 12);
    skyUniforms.twilight.value =
      (1 - THREE.MathUtils.smoothstep(altitude, 0, 12)) *
      THREE.MathUtils.smoothstep(altitude, -12, -1);
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
                  ? 232 +
                    grain * 4 +
                    Math.sin((y / 256) * Math.PI * 146 + Math.sin(phase) * 4) * 2 +
                    noise * 5
                  : 232 +
                    5 * Math.sin((x * Math.PI) / 2) +
                    5 * Math.sin((y * Math.PI) / 2) +
                    noise * 8,
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
      ash: "#77766d",
      brass: "#bca46b",
      brushedSteel: "#929a9d",
      cabinetGlass: "#b9c5bb",
      ceiling: "#f5f2eb",
      chrome: "#e1e3e1",
      clay: "#b97861",
      concrete: "#b5bab6",
      cream: "#e7d5ba",
      curtain: "#e5dac6",
      earthenware: "#a8623f",
      enamel: "#f4eedf",
      fabric: "#8fa7a0",
      fabricDark: "#627f79",
      flagstone: "#9c9b8b",
      floor: "#9f7656",
      flower: "#bb4273",
      foliage: "#426b32",
      glow: "#d6fff1",
      grass: "#77934b",
      green: "#426c40",
      jute: "#c5af88",
      kilim: "#ffffff",
      lavender: "#82749a",
      leafLight: "#78934e",
      leather: "#a83f2b",
      linen: "#c2b69e",
      metal: "#586873",
      mustard: "#be963d",
      ochre: "#c96a16",
      olive: "#5d7045",
      opal: "#f3eddf",
      plaster: "#f1ede3",
      porcelain: "#f4f0e7",
      rubber: "#303332",
      rug: "#aa7055",
      screen: "#16232b",
      sea: "#567873",
      showerGlass: "#d5e2dc",
      slate: "#655f54",
      soil: "#6b5845",
      stone: "#c9c1b2",
      stripedLinen: "#ffffff",
      terracotta: "#ad6442",
      wall: "#d4d0c7",
      washerGlass: "#596b73",
      water: "#42bfd1",
      white: "#ebe9e2",
      wicker: "#b49464",
      wood: "#a87946",
      woodDark: "#754d2e",
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
    furnitureTemplates = new Map(),
    templateGeometries = new Set();
  material.ceiling.userData.enclosure = true;
  for (const item of [material.wood, material.woodDark]) {
    item.map = grainTexture;
    item.bumpMap = grainTexture;
    item.bumpScale = 0.001;
    item.roughness = 0.72;
    item.roughnessMap = grainTexture;
    item.userData.textureScale = 0.6;
    item.userData.woodGrain = true;
  }
  const floorTextures = makePlankSurfaces(
    grainTexture.image,
    grainTexture.image,
    grainTexture.image,
  );
  Object.assign(material.floor, floorTextures);
  material.floor.color.set("#b2916d");
  material.floor.roughness = 0.78;
  material.floor.bumpScale = 0.002;
  material.floor.userData.textureScale = 2.4;
  for (const key of [
    "ash",
    "mustard",
    "fabric",
    "fabricDark",
    "cream",
    "curtain",
    "rug",
    "linen",
    "ochre",
    "wicker",
  ]) {
    material[key].map = weaveTexture;
    material[key].bumpMap = weaveTexture;
    material[key].bumpScale = 0.002;
    material[key].userData.textureScale = 0.22;
  }
  material.curtain.side = THREE.DoubleSide;
  const stripeCanvas = document.createElement("canvas");
  stripeCanvas.width = 128;
  stripeCanvas.height = 128;
  const stripeContext = stripeCanvas.getContext("2d");
  stripeContext.fillStyle = "#c9c5b8";
  stripeContext.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 8) {
    stripeContext.fillStyle = "#8c938a";
    stripeContext.fillRect(x, 0, 2, 128);
    stripeContext.fillStyle = "#f1ead7";
    stripeContext.fillRect(x + 3, 0, 2, 128);
  }
  const stripeTexture = new THREE.CanvasTexture(stripeCanvas);
  stripeTexture.wrapS = THREE.RepeatWrapping;
  stripeTexture.wrapT = THREE.RepeatWrapping;
  stripeTexture.colorSpace = THREE.SRGBColorSpace;
  stripeTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  material.stripedLinen.map = stripeTexture;
  material.stripedLinen.userData.textureScale = 0.22;
  material.stripedLinen.bumpMap = weaveTexture;
  material.stripedLinen.bumpScale = 0.0015;
  const reedCanvas = document.createElement("canvas");
  reedCanvas.width = 256;
  reedCanvas.height = 256;
  const reeds = reedCanvas.getContext("2d"),
    reedPixels = reeds.createImageData(256, 256);
  for (let y = 0; y < 256; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const over = (Math.floor(x / 16) + Math.floor(y / 16)) % 2,
        across = (over ? x : y) % 16,
        edge =
          THREE.MathUtils.smoothstep(across, 0, 3) *
          (1 - THREE.MathUtils.smoothstep(across, 13, 16)),
        value = 145 + edge * 96 + Math.sin((over ? y : x) * 2) * 3,
        offset = (y * 256 + x) * 4;
      reedPixels.data[offset] = value;
      reedPixels.data[offset + 1] = value;
      reedPixels.data[offset + 2] = value;
      reedPixels.data[offset + 3] = 255;
    }
  }
  reeds.putImageData(reedPixels, 0, 0);
  const reedTexture = new THREE.CanvasTexture(reedCanvas);
  reedTexture.wrapS = THREE.RepeatWrapping;
  reedTexture.wrapT = THREE.RepeatWrapping;
  reedTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  material.wicker.map = reedTexture;
  material.wicker.bumpMap = reedTexture;
  material.wicker.bumpScale = 0.0015;
  material.wicker.userData.textureScale = 0.3;
  function makePlankSurfaces(colorSource, heightSource, roughnessSource) {
    const surfaces = {};
    let seed = 127;
    const random = () => {
      seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
      return seed / 4_294_967_296;
    };
    const boards = Array.from({ length: 12 }, (_, index) => ({
      offset: (index % 3) / 6,
      sourceWidth: 0.12 + random() * 0.17,
      sourceX: random() * 0.65,
      tint: 0.96 + random() * 0.08,
    }));
    for (const [slot, source] of [
      ["map", colorSource],
      ["bumpMap", heightSource],
      ["roughnessMap", roughnessSource],
    ]) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d"),
        width = 512 / boards.length;
      context.fillStyle = slot === "map" ? "#b0a99d" : slot === "bumpMap" ? "#303030" : "#eeeeee";
      context.fillRect(0, 0, 512, 512);
      for (const [index, board] of boards.entries()) {
        for (let row = -1; row < 3; row += 1) {
          const y = (row / 2 + board.offset) * 512;
          context.save();
          context.beginPath();
          context.rect(index * width + 0.5, y + 0.5, width - 1, 255);
          context.clip();
          context.filter = `brightness(${slot === "map" ? board.tint : slot === "roughnessMap" ? 1.08 : 1})`;
          context.drawImage(
            source,
            board.sourceX * source.width,
            0,
            board.sourceWidth * source.width,
            source.height,
            index * width,
            y,
            width,
            256,
          );
          context.restore();
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = slot === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      surfaces[slot] = texture;
    }
    return surfaces;
  }
  function tiledSurface(terracotta = false, wall = false) {
    const surfaces = {},
      canvases = [],
      pixels = [],
      size = wall ? 256 : 512,
      tileSize = size / 4,
      tiles = [];
    let seed = 93;
    const random = () => {
      seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
      return seed / 4_294_967_296;
    };
    for (let i = 0; i < 16; i += 1) {
      tiles.push((terracotta ? 140 : 224) + (random() - 0.5) * (terracotta ? 14 : 7));
    }
    for (const slot of ["map", "bumpMap", "roughnessMap"]) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d"),
        texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = slot === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      surfaces[slot] = texture;
      canvases.push(context);
      pixels.push(context.createImageData(size, size));
    }
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const edge = Math.min(
            (x % tileSize) + 0.5,
            tileSize - 0.5 - (x % tileSize),
            (y % tileSize) + 0.5,
            tileSize - 0.5 - (y % tileSize),
          ),
          grout = wall
            ? Math.max(0, Math.min(1, 0.66 - edge))
            : Math.max(0, 1 - edge / (terracotta ? 1.25 : 0.9)),
          noise = random() - 0.5,
          mineral =
            Math.sin(x * 0.065 + Math.sin(y * 0.037) * 1.5) * 1.4 + Math.sin((x + y) * 0.019) * 0.7,
          base =
            tiles[Math.floor(y / tileSize) * 4 + Math.floor(x / tileSize)] + mineral + noise * 1.5,
          values = [
            base * (1 - grout) + (terracotta ? 100 : wall ? 242 : 166) * grout,
            235 - grout * 95 + noise * 2,
            211 + grout * 35 + mineral * 2,
          ],
          offset = (y * size + x) * 4;
        for (let index = 0; index < 3; index += 1) {
          pixels[index].data[offset] = values[index];
          pixels[index].data[offset + 1] = values[index] * (index === 0 && terracotta ? 0.69 : 1);
          pixels[index].data[offset + 2] = values[index] * (index === 0 && terracotta ? 0.48 : 1);
          pixels[index].data[offset + 3] = 255;
        }
      }
    }
    canvases.forEach((context, index) => context.putImageData(pixels[index], 0, 0));
    return surfaces;
  }
  const plasterTexture = surfaceTexture("plaster"),
    tileTexture = tiledSurface(),
    clayTexture = tiledSurface(true);
  material.plaster.bumpMap = plasterTexture;
  material.plaster.bumpScale = 0.008;
  material.plaster.userData.textureScale = 0.5;
  material.plaster.roughness = 0.94;
  material.earthenware.bumpMap = plasterTexture;
  material.earthenware.bumpScale = 0.002;
  material.earthenware.roughness = 0.88;
  const kilimCanvas = document.createElement("canvas");
  kilimCanvas.width = 512;
  kilimCanvas.height = 256;
  const kilim = kilimCanvas.getContext("2d");
  kilim.fillStyle = "#e2d6bd";
  kilim.fillRect(0, 0, 512, 256);
  kilim.strokeStyle = "#5b6657";
  kilim.lineWidth = 4;
  kilim.strokeRect(12, 12, 488, 232);
  kilim.strokeRect(22, 24, 468, 208);
  for (let x = 30; x < 488; x += 10) {
    kilim.fillStyle = "#5b6657";
    kilim.fillRect(x, 28, 3, 15);
    kilim.fillRect(x, 213, 3, 15);
  }
  for (const center of [105, 256, 407]) {
    for (const [radius, color] of [
      [11, "#5b6657"],
      [8, "#e2d6bd"],
      [5, "#5b6657"],
      [2, "#e2d6bd"],
    ]) {
      kilim.fillStyle = color;
      for (let row = -radius; row <= radius; row += 1) {
        const half = radius - Math.abs(row);
        kilim.fillRect(center - half * 6 - 3, 128 + row * 6 - 3, half * 12 + 6, 6);
      }
    }
    kilim.fillStyle = "#5b6657";
    for (let step = -3; step <= 3; step += 1) {
      kilim.fillRect(center + step * 12 - 2, 72 + Math.abs(step) * 6, 4, 10);
      kilim.fillRect(center + step * 12 - 2, 174 - Math.abs(step) * 6, 4, 10);
    }
  }
  for (let y = 0; y < 256; y += 3) {
    kilim.fillStyle = y % 2 ? "#ffffff09" : "#00000007";
    kilim.fillRect(0, y, 512, 1);
  }
  material.kilim.map = new THREE.CanvasTexture(kilimCanvas);
  material.kilim.map.colorSpace = THREE.SRGBColorSpace;
  material.kilim.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  material.kilim.bumpMap = weaveTexture;
  material.kilim.bumpScale = 0.001;
  for (const key of ["stone", "terracotta"]) {
    Object.assign(material[key], key === "stone" ? tileTexture : clayTexture);
    material[key].bumpScale = key === "stone" ? 0.0015 : 0.002;
    material[key].userData.textureScale = key === "stone" ? 2.4 : 1.2;
    material[key].roughness = key === "stone" ? 0.72 : 0.98;
    material[key].color.set(key === "stone" ? "#eee9df" : "#efe5d6");
  }
  material.wallTile = material.stone.clone();
  Object.assign(material.wallTile, tiledSurface(false, true));
  material.wallTile.color.set("#ded8cc");
  material.wallTile.roughness = 0.64;
  material.wallTile.bumpScale = 0.0008;
  material.wallTile.userData.textureScale = 4.8;
  material.wallTile.userData.textureAspect = 0.5;
  sharedMaterials.add(material.wallTile);
  const pavingCanvas = document.createElement("canvas");
  pavingCanvas.width = 512;
  pavingCanvas.height = 512;
  const paving = pavingCanvas.getContext("2d"),
    pavingPixels = paving.createImageData(512, 512),
    pavingSites = [];
  let pavingSeed = 132;
  const pavingRandom = () => {
    pavingSeed = (pavingSeed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return pavingSeed / 4_294_967_296;
  };
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      pavingSites.push({
        shade: 146 + pavingRandom() * 48,
        x: (col + 0.15 + pavingRandom() * 0.7) / 5,
        y: (row + 0.15 + pavingRandom() * 0.7) / 5,
      });
    }
  }
  for (let y = 0; y < 512; y += 1) {
    for (let x = 0; x < 512; x += 1) {
      let closest = Infinity,
        second = Infinity,
        shade = 0;
      for (const site of pavingSites) {
        const dx = Math.abs(x / 512 - site.x),
          dy = Math.abs(y / 512 - site.y),
          distance = Math.hypot(Math.min(dx, 1 - dx), Math.min(dy, 1 - dy));
        if (distance < closest) {
          second = closest;
          closest = distance;
          ({ shade } = site);
        } else if (distance < second) {
          second = distance;
        }
      }
      const edge = THREE.MathUtils.smoothstep(second - closest, 0.001, 0.009),
        grain = pavingRandom() * 10 - 5 + 3 * Math.sin(x * 0.07 + Math.sin(y * 0.025) * 3),
        value = 120 * (1 - edge) + (shade + grain) * edge,
        offset = (y * 512 + x) * 4;
      pavingPixels.data[offset] = value + 3;
      pavingPixels.data[offset + 1] = value;
      pavingPixels.data[offset + 2] = value - 10;
      pavingPixels.data[offset + 3] = 255;
    }
  }
  paving.putImageData(pavingPixels, 0, 0);
  const pavingTexture = new THREE.CanvasTexture(pavingCanvas);
  pavingTexture.wrapS = THREE.RepeatWrapping;
  pavingTexture.wrapT = THREE.RepeatWrapping;
  pavingTexture.colorSpace = THREE.SRGBColorSpace;
  material.flagstone.map = pavingTexture;
  material.flagstone.bumpMap = pavingTexture;
  material.flagstone.bumpScale = 0.015;
  material.flagstone.userData.textureScale = 2.4;
  material.flagstone.color.set("#e3dfd4");
  material.flagstone.roughness = 0.85;
  pavingTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const lawnCanvas = document.createElement("canvas");
  lawnCanvas.width = 256;
  lawnCanvas.height = 256;
  const lawn = lawnCanvas.getContext("2d");
  lawn.fillStyle = "#8e995e";
  lawn.fillRect(0, 0, 256, 256);
  let lawnSeed = 47;
  const lawnRandom = () => {
    lawnSeed = (lawnSeed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return lawnSeed / 4_294_967_296;
  };
  for (let i = 0; i < 6500; i += 1) {
    const x = lawnRandom() * 256,
      z = lawnRandom() * 256;
    lawn.strokeStyle = ["#a9ad75", "#75834b", "#979b60", "#bbc18b"][i % 4];
    lawn.beginPath();
    lawn.moveTo(x, z);
    lawn.lineTo(x + Math.sin(i) * 2, z - 2 - (i % 4));
    lawn.stroke();
  }
  const lawnTexture = new THREE.CanvasTexture(lawnCanvas);
  lawnTexture.wrapS = THREE.RepeatWrapping;
  lawnTexture.wrapT = THREE.RepeatWrapping;
  lawnTexture.colorSpace = THREE.SRGBColorSpace;
  lawnTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  material.grass.map = lawnTexture;
  material.grass.color.set("#a2ad80");
  material.grass.bumpMap = lawnTexture;
  material.grass.bumpScale = 0.015;
  material.grass.userData.textureScale = 1.5;
  material.curtain.side = THREE.DoubleSide;
  material.linen.side = THREE.DoubleSide;
  material.leather.roughness = 0.48;
  material.leather.bumpMap = weaveTexture;
  material.leather.bumpScale = 0.0005;
  material.brass.metalness = 0.8;
  material.brass.roughness = 0.3;
  material.porcelain.roughness = 0.19;
  material.white.roughness = 0.38;
  material.enamel.roughness = 0.26;
  material.chrome.roughness = 0.18;
  material.chrome.metalness = 0.95;
  for (const key of ["chrome", "metal", "brass"]) {
    material[key].envMapIntensity = 1.5;
  }
  for (const key of ["enamel", "porcelain", "white", "screen"]) {
    material[key].envMapIntensity = 0.9;
  }
  material.jute.map = reedTexture;
  material.jute.bumpMap = reedTexture;
  material.jute.bumpScale = 0.002;
  material.jute.userData.textureScale = 0.16;
  material.flower.side = THREE.DoubleSide;
  material.cabinetGlass.transparent = true;
  material.cabinetGlass.opacity = 0.25;
  material.cabinetGlass.depthWrite = false;
  material.cabinetGlass.roughness = 0.12;
  material.brushedSteel.metalness = 0.9;
  material.brushedSteel.roughness = 0.42;
  material.brushedSteel.envMapIntensity = 0.65;
  material.showerGlass.transparent = true;
  material.showerGlass.opacity = showerGlassOpacity.edge;
  material.showerGlass.vertexColors = true;
  material.showerGlass.depthWrite = false;
  material.showerGlass.roughness = 0.09;
  material.showerGlass.envMapIntensity = 0.9;
  material.showerGlass.side = THREE.DoubleSide;
  material.showerGlass.forceSinglePass = true;
  material.washerGlass.transparent = true;
  material.washerGlass.opacity = 0.42;
  material.washerGlass.depthWrite = false;
  material.washerGlass.roughness = 0.16;
  material.washerGlass.envMapIntensity = 0.6;
  material.rubber.roughness = 0.95;
  material.rubber.envMapIntensity = 0.2;
  material.metal.metalness = 0.85;
  material.metal.roughness = 0.27;
  material.screen.roughness = 0.16;
  material.screen.metalness = 0.18;
  material.water.roughness = 0.12;
  material.water.metalness = 0.35;
  material.glow.emissive.set("#a0f8da");
  material.glow.emissiveIntensity = 0.8;
  material.opal.color.set("#d5d0c3");
  material.opal.roughness = 0.62;
  material.opal.emissive.set("#ffe4ba");
  material.opal.emissiveIntensity = 0.6;
  async function loadSurfaceScans() {
    await new Promise((resolve) => {
      const waitForScene = () => {
        if (sceneBuilding || renderDirty) {
          setTimeout(waitForScene, 200);
        } else {
          resolve();
        }
      };
      waitForScene();
    });
    const sources = [
        { fallback: grainTexture, path: "./prm/assets/wood-grain-height.jpg", slot: "bumpMap" },
        { fallback: weaveTexture, path: "./prm/assets/linen-weave-height.jpg", slot: "bumpMap" },
        { fallback: grainTexture, path: "./prm/assets/wood-grain-color.jpg", slot: "map" },
        { fallback: floorTextures.map, path: "./prm/assets/oak-planks-color.webp", slot: "map" },
        {
          fallback: floorTextures.bumpMap,
          path: "./prm/assets/oak-planks-height.webp",
          slot: "bumpMap",
        },
        {
          fallback: floorTextures.roughnessMap,
          path: "./prm/assets/oak-planks-roughness.webp",
          slot: "roughnessMap",
        },
        {
          fallback: grainTexture,
          path: "./prm/assets/wood-grain-roughness.jpg",
          slot: "roughnessMap",
        },
      ],
      results = await Promise.allSettled(
        sources.map(async ({ path, slot }) => {
          const controller = new AbortController(),
            timeout = setTimeout(() => controller.abort(), 5000);
          try {
            const response = await fetch(new URL(path, document.baseURI), {
              signal: controller.signal,
            });
            if (!response.ok) {
              throw new Error("Surface scan unavailable");
            }
            const url = URL.createObjectURL(await response.blob());
            try {
              const texture = await new THREE.TextureLoader().loadAsync(url);
              texture.colorSpace = slot === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
              return texture;
            } finally {
              URL.revokeObjectURL(url);
            }
          } finally {
            clearTimeout(timeout);
          }
        }),
      );
    const finishes = new Set([...sharedMaterials, ...daylightSourceMaterials]);
    sceneRoot.traverse((node) =>
      [node.material]
        .flat()
        .filter(Boolean)
        .forEach((finish) => finishes.add(finish)),
    );
    results.forEach((result, index) => {
      if (result.status !== "fulfilled") {
        return;
      }
      for (const finish of finishes) {
        const { fallback, slot } = sources[index];
        if (finish[slot] === fallback) {
          finish[slot] = result.value;
        }
      }
    });
    for (const fallback of new Set(sources.map((source) => source.fallback))) {
      if (
        ![...finishes].some((finish) =>
          [finish.map, finish.bumpMap, finish.roughnessMap].includes(fallback),
        )
      ) {
        fallback.dispose();
      }
    }
    requestRender();
    if (assetStudio) {
      assetStudio.renderer.render(assetStudio.scene, assetStudio.camera);
    }
  }
  const contactCanvas = document.createElement("canvas");
  contactCanvas.width = 64;
  contactCanvas.height = 64;
  const contactContext = contactCanvas.getContext("2d"),
    contactGradient = contactContext.createRadialGradient(32, 32, 6, 32, 32, 32);
  contactGradient.addColorStop(0, "#ffffff");
  contactGradient.addColorStop(0.5, "#989898");
  contactGradient.addColorStop(1, "#000000");
  contactContext.fillStyle = contactGradient;
  contactContext.fillRect(0, 0, 64, 64);
  const contactTexture = new THREE.CanvasTexture(contactCanvas),
    contactMaterial = new THREE.MeshBasicMaterial({
      alphaMap: contactTexture,
      color: "#000000",
      depthWrite: false,
      opacity: 0.18,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      toneMapped: false,
      transparent: true,
    }),
    contactAssets = new Set([
      "sofa",
      "sofa_bed",
      "tufted_sofa",
      "bathroom_vanity",
      "armchair",
      "accent_chair",
      "bed",
      "canopy_bed",
      "upholstered_bed",
      "modular_sofa",
      "wishbone_chair",
      "round_dining_table",
      "linen_bench",
      "linen_pouf",
      "kitchenette",
      "dining_table",
      "coffee_table",
      "side_table",
      "bistro_table",
      "sea_table",
      "ochre_table",
      "chair",
      "patio_chair",
      "woven_chair",
      "folding_chair",
      "garment_rack",
      "retro_fridge",
      "dresser",
      "sideboard",
      "wardrobe",
      "vanity",
      "terracotta_pot",
    ]);
  sharedMaterials.add(contactMaterial);
  function addContact(group, token) {
    if (!contactAssets.has(token.name)) {
      return;
    }
    const [w, d] = token.dimensions,
      footprint = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.2, d * 1.2), contactMaterial);
    footprint.rotation.x = -Math.PI / 2;
    footprint.position.set(group.position.x, group.position.y - 0.018, group.position.z);
    footprint.rotation.z = -group.rotation.y;
    footprint.userData.floor = token.floor;
    footprint.userData.contact = true;
    sceneRoot.add(footprint);
  }
  function batchContactShadows() {
    const byFloor = new Map();
    for (const mesh of sceneRoot.children.filter((node) => node.userData.contact)) {
      const { floor } = mesh.userData;
      if (!byFloor.has(floor)) {
        byFloor.set(floor, []);
      }
      mesh.updateMatrix();
      mesh.geometry.applyMatrix4(mesh.matrix);
      byFloor.get(floor).push(mesh.geometry);
      sceneRoot.remove(mesh);
    }
    for (const [floor, parts] of byFloor) {
      const geometry = mergeGeometries(parts);
      parts.forEach((part) => part.dispose());
      if (geometry) {
        const shadow = new THREE.Mesh(geometry, contactMaterial);
        shadow.userData.floor = floor;
        shadow.userData.contact = true;
        sceneRoot.add(shadow);
      }
    }
  }
  function surfaceUVs(geometry, finish, w, h, d) {
    if (finish.userData.textureScale) {
      const positions = geometry.attributes.position,
        normals = geometry.attributes.normal,
        { uv } = geometry.attributes,
        scale = finish.userData.textureScale,
        horizontalScale = scale * (finish.userData.textureAspect || 1);
      for (let i = 0; i < positions.count; i += 1) {
        const nx = Math.abs(normals.getX(i)),
          ny = Math.abs(normals.getY(i));
        const verticalGrain = finish.userData.woodGrain && h > Math.max(w, d);
        uv.setXY(
          i,
          (verticalGrain ? positions.getY(i) : nx > 0.7 ? positions.getZ(i) : positions.getX(i)) /
            horizontalScale,
          (verticalGrain
            ? nx > 0.7
              ? positions.getZ(i)
              : positions.getX(i)
            : ny > 0.7
              ? positions.getZ(i)
              : positions.getY(i)) / scale,
        );
      }
    }
  }
  function box(parent, w, h, d, x, y, z, m, detailed = parent.userData.detailed) {
    const upholstered = [
        material.fabric,
        material.fabricDark,
        material.cream,
        material.linen,
      ].includes(m),
      thickness = Math.min(w, h, d),
      thinFinish =
        thickness >= 0.018 &&
        thickness <= 0.06 &&
        [w, h, d].toSorted((a, b) => a - b)[1] >= 0.28 &&
        Math.max(w, h, d) >= 0.45 &&
        (m.userData.woodGrain || [material.white, material.enamel, material.chrome].includes(m)),
      radius = Math.min(upholstered ? 0.065 : thickness <= 0.06 ? 0.0025 : 0.012, thickness * 0.24),
      geometry =
        detailed && (thickness > 0.06 || thinFinish)
          ? new RoundedBoxGeometry(w, h, d, upholstered ? 2 : 1, radius)
          : new THREE.BoxGeometry(w, h, d);
    surfaceUVs(geometry, m, w, h, d);
    const mesh = new THREE.Mesh(geometry, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(parent, r1, r2, h, x, y, z, m, segments = 16) {
    const geometry = new THREE.CylinderGeometry(r1, r2, h, segments);
    if (m.userData.textureScale) {
      const { uv } = geometry.attributes,
        circumference = Math.PI * (r1 + r2),
        scale = m.userData.textureScale;
      for (let i = 0; i < uv.count; i += 1) {
        uv.setXY(i, (uv.getX(i) * circumference) / scale, (uv.getY(i) * h) / scale);
      }
    }
    const mesh = new THREE.Mesh(geometry, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cushion(parent, w, h, d, x, y, z, finish, seamFinish) {
    const geometry = new THREE.SphereGeometry(1, 20, 12),
      positions = geometry.attributes.position,
      soften = (value) => Math.sign(value) * Math.abs(value) ** 0.42;
    for (let i = 0; i < positions.count; i += 1) {
      const px = positions.getX(i),
        py = positions.getY(i),
        pz = positions.getZ(i),
        fold = 1 - 0.035 * Math.sin(px * 22 + pz * 13) ** 2 * (1 - Math.abs(py));
      positions.setXYZ(i, soften(px) * w * 0.5, soften(py) * h * 0.5 * fold, soften(pz) * d * 0.5);
    }
    geometry.computeVertexNormals();
    const { uv, normal } = geometry.attributes;
    for (let i = 0; i < positions.count; i += 1) {
      uv.setXY(
        i,
        positions.getX(i) / (finish.userData.textureScale || 0.22) + 0.5,
        (Math.abs(normal.getY(i)) > 0.5 ? positions.getZ(i) : positions.getY(i)) /
          (finish.userData.textureScale || 0.22) +
          0.5,
      );
    }
    const mesh = new THREE.Mesh(geometry, finish);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    if (seamFinish) {
      const points = Array.from({ length: 20 }, (_, index) => {
          const vertex = 6 * 21 + index;
          return new THREE.Vector3(
            positions.getX(vertex) * 1.012,
            positions.getY(vertex),
            positions.getZ(vertex) * 1.012,
          );
        }),
        seam = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points, true, "catmullrom", 0),
            80,
            0.0025,
            4,
            true,
          ),
          seamFinish,
        );
      mesh.add(seam);
    }
    return mesh;
  }
  function rolledLinen(parent, length, radius, x, y, z, finish) {
    const roll = new THREE.Group(),
      geometry = new THREE.CylinderGeometry(radius, radius, length, 24, 5),
      positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      const px = positions.getX(i),
        py = positions.getY(i),
        pz = positions.getZ(i),
        angle = Math.atan2(pz, px),
        edge = Math.abs(py) / (length / 2),
        wrinkle = 1 + 0.035 * Math.sin(angle * 5 + py * 33) + 0.02 * Math.sin(angle * 9),
        taper = 1 - edge * edge * 0.045;
      positions.setXYZ(
        i,
        px * wrinkle * taper,
        py + radius * 0.025 * Math.sin(angle * 3) * edge,
        pz * wrinkle * taper * 0.92,
      );
    }
    geometry.computeVertexNormals();
    const body = new THREE.Mesh(geometry, finish);
    body.rotation.x = Math.PI / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    roll.add(body);
    roll.position.set(x, y, z);
    parent.add(roll);
    for (const side of [-1, 1]) {
      const points = [];
      for (let i = 0; i <= 40; i += 1) {
        const angle = (i / 40) * Math.PI * 5,
          r = radius * (0.06 + (i / 40) * 0.8) * (1 + 0.04 * Math.sin(angle * 3));
        points.push([Math.cos(angle) * r, Math.sin(angle) * r * 0.92, side * (length / 2 + 0.001)]);
      }
      curvedRod(roll, points, 0.0012, material.linen, 40);
    }
    return roll;
  }
  function curvedRod(parent, points, radius, finish, segments = 16) {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
      mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 6, false), finish);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function pullHandle(parent, length, x, y, z, vertical = false) {
    const point = (along, reach) => [
      x + (vertical ? 0 : along),
      y + (vertical ? along : 0),
      z + reach,
    ];
    curvedRod(
      parent,
      [
        point(-length / 2, 0.004),
        point(-length / 2, 0.032),
        point(length / 2, 0.032),
        point(length / 2, 0.004),
      ],
      0.0075,
      material.metal,
      8,
    );
  }
  function cabinetShell(parent, w, d, bottom, top, finish, z = -0.02) {
    const height = top - bottom;
    for (const side of [-1, 1]) {
      box(parent, 0.025, height, d, side * (w / 2 - 0.0125), bottom + height / 2, z, finish, false);
    }
    box(parent, w - 0.05, height, 0.025, 0, bottom + height / 2, z - d / 2 + 0.0125, finish, false);
    box(parent, w - 0.05, 0.025, d - 0.025, 0, bottom + 0.0125, z + 0.0125, finish, false);
    box(parent, w - 0.05, 0.05, 0.025, 0, top - 0.025, z + d / 2 - 0.0125, finish, false);
  }
  function addGlassPane(parent, width, height, x, y, z, yaw = 0) {
    const geometry = new THREE.PlaneGeometry(width, height, 3, 3),
      edgeWidth = Math.min(0.003, width / 4, height / 4),
      xStops = [-width / 2, -width / 2 + edgeWidth, width / 2 - edgeWidth, width / 2],
      yStops = [height / 2, height / 2 - edgeWidth, -height / 2 + edgeWidth, -height / 2],
      vertexColors = [];
    for (let i = 0; i < geometry.attributes.position.count; i += 1) {
      const row = Math.floor(i / 4),
        column = i % 4,
        edgeVertex = row === 0 || row === 3 || column === 0 || column === 3;
      geometry.attributes.position.setXY(i, xStops[column], yStops[row]);
      geometry.attributes.uv.setXY(
        i,
        (xStops[column] + width / 2) / width,
        (yStops[row] + height / 2) / height,
      );
      vertexColors.push(
        ...(edgeVertex
          ? [0.72, 0.83, 0.78, 1]
          : [1, 1, 1, showerGlassOpacity.face / showerGlassOpacity.edge]),
      );
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(vertexColors, 4));
    const pane = new THREE.Mesh(geometry, material.showerGlass);
    pane.position.set(x, y, z);
    pane.rotation.y = yaw;
    parent.add(pane);
    return pane;
  }
  function piercedPanelGeometry(width, height, thickness, opening) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.closePath();
    const hole = new THREE.Path();
    hole.absellipse(
      opening.x,
      opening.y,
      opening.w * 0.48,
      opening.h * 0.48,
      0,
      Math.PI * 2,
      true,
      0,
    );
    shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
      curveSegments: 12,
      depth: thickness,
      steps: 1,
    });
    return geometry;
  }
  function cutWorktop(parent, w, d, thickness, x, y, z, finish, opening) {
    const geometry = piercedPanelGeometry(w, d, thickness, {
      h: opening.d,
      w: opening.w,
      x: opening.x,
      y: -opening.z,
    });
    geometry.rotateX(-Math.PI / 2);
    surfaceUVs(geometry, finish, w, thickness, d);
    const top = new THREE.Mesh(geometry, finish);
    top.position.set(x, y - thickness, z);
    top.castShadow = true;
    top.receiveShadow = true;
    parent.add(top);
  }
  function insetBasin(parent, w, d, x, y, z, finish = material.metal) {
    const profile = [
        [0.5, 0],
        [0.49, -0.02],
        [0.43, -0.1],
        [0.3, -0.14],
        [0.06, -0.145],
        [0, -0.145],
      ],
      bowl = new THREE.Mesh(
        new THREE.LatheGeometry(
          profile.map(([r, height]) => new THREE.Vector2(r, height)),
          24,
        ),
        finish,
      );
    bowl.scale.set(w, 1, d);
    bowl.position.set(x, y, z);
    bowl.castShadow = true;
    bowl.receiveShadow = true;
    parent.add(bowl);
    cylinder(parent, 0.029, 0.029, 0.006, x, y - 0.14, z, material.screen, 16);
    curvedRod(
      parent,
      [
        [x, y, z - d * 0.63],
        [x, y + 0.2, z - d * 0.63],
        [x, y + 0.28, z - d * 0.4],
        [x, y + 0.22, z - d * 0.15],
      ],
      0.013,
      material.metal,
    );
    cylinder(parent, 0.023, 0.023, 0.025, x, y + 0.013, z - d * 0.63, material.metal, 16);
    box(parent, 0.08, 0.012, 0.018, x + 0.035, y + 0.055, z - d * 0.63, material.metal);
  }
  function rectangularBasin(parent, w, d, x, y, z) {
    const vertices = [],
      indices = [],
      rings = [
        [w / 2, d / 2, 0],
        [w * 0.35, d * 0.3, -0.115],
      ];
    for (const [halfX, halfZ, height] of rings) {
      for (const [sideX, sideZ] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]) {
        vertices.push(sideX * halfX, height, sideZ * halfZ);
      }
    }
    for (let i = 0; i < 4; i += 1) {
      const next = (i + 1) % 4;
      indices.push(i, i + 4, next, next, i + 4, next + 4);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(
        [0, 0, 1, 0, 1, 1, 0, 1, 0.15, 0.2, 0.85, 0.2, 0.85, 0.8, 0.15, 0.8],
        2,
      ),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const basin = new THREE.Mesh(geometry, material.porcelain);
    basin.position.set(x, y, z);
    basin.castShadow = true;
    basin.receiveShadow = true;
    parent.add(basin);
    box(parent, w * 0.7, 0.015, d * 0.6, x, y - 0.12, z, material.porcelain);
    cylinder(parent, 0.021, 0.021, 0.003, x, y - 0.111, z, material.metal, 12);
  }
  function drapedCover(parent, w, d, x, y, z, finish) {
    const geometry = new THREE.PlaneGeometry(w + 0.24, d, 24, 20),
      positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      const px = positions.getX(i),
        pz = positions.getY(i),
        overhang = Math.max(0, Math.abs(px) - w / 2),
        crease = pz + px * 0.24 + Math.sin(px * 2.4) * 0.045 + d * 0.1,
        broadFold =
          0.022 * Math.exp(-crease * crease * 34) +
          0.009 * Math.sin(pz * 4.5 - px * 2.8) * Math.exp(-Math.abs(pz) / Math.max(d, 0.1)),
        ripple =
          broadFold +
          0.004 * Math.sin(pz * 8 + px * 6) +
          0.003 * Math.sin(pz * 17 - px * 13) +
          overhang * 0.06 * Math.sin(pz * 23 + px * 9);
      geometry.attributes.uv.setXY(
        i,
        px / (finish.userData.textureScale || 0.22),
        pz / (finish.userData.textureScale || 0.22),
      );
      positions.setXYZ(
        i,
        Math.sign(px) * Math.min(Math.abs(px), w / 2 + 0.012),
        -overhang * (px < 0 ? 1.65 : 2.05) + ripple,
        pz +
          (0.009 * Math.sin(px * 7 + 0.5) + 0.004 * Math.sin(px * 13)) *
            (Math.abs(pz) / (d / 2)) ** 6,
      );
    }
    geometry.computeVertexNormals();
    const cover = new THREE.Mesh(geometry, finish);
    cover.position.set(x, y, z);
    cover.castShadow = true;
    cover.receiveShadow = true;
    parent.add(cover);
    return cover;
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
  const gardenLeafGeometry = new THREE.BufferGeometry();
  gardenLeafGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        -0.13, 0, 0, -0.07, 0.015, -0.035, 0.02, 0.015, -0.055, 0.11, 0, -0.02, 0.13, 0, 0, 0.11, 0,
        0.02, 0.02, -0.005, 0.055, -0.07, -0.01, 0.035, 0, 0.026, 0,
      ],
      3,
    ),
  );
  gardenLeafGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(
      [0, 0.5, 0.23, 0.18, 0.58, 0, 0.92, 0.32, 1, 0.5, 0.92, 0.68, 0.58, 1, 0.23, 0.82, 0.5, 0.5],
      2,
    ),
  );
  gardenLeafGeometry.setIndex([
    0, 1, 8, 1, 2, 8, 2, 3, 8, 3, 4, 8, 4, 5, 8, 5, 6, 8, 6, 7, 8, 7, 0, 8,
  ]);
  gardenLeafGeometry.computeVertexNormals();
  for (const key of ["foliage", "olive", "leafLight"]) {
    material[key].side = THREE.DoubleSide;
    material[key].roughness = 0.76;
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
      const geometry = new THREE.SphereGeometry(1, 6, 4),
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
    for (const child of group.children) {
      if (child.isGroup && !child.userData.token) {
        batchFurniture(child);
      }
    }
    group.updateMatrixWorld(true);
    const inverse = group.matrixWorld.clone().invert(),
      descendants = [];
    group.traverse((node) => {
      if (
        node !== group &&
        node.isMesh &&
        node.parent !== group &&
        node.children.length === 0 &&
        !node.isReflector &&
        !node.userData.mirrorFallback
      ) {
        let ancestor = node.parent;
        while (
          ancestor !== group &&
          !ancestor.userData.token &&
          !ancestor.userData.fullHeight &&
          !ancestor.userData.openDoorLeaf &&
          !ceilingRoots.includes(ancestor)
        ) {
          ancestor = ancestor.parent;
        }
        if (ancestor === group) {
          descendants.push(node);
        }
      }
    });
    for (const mesh of descendants) {
      const matrix = inverse.clone().multiply(mesh.matrixWorld);
      mesh.parent.remove(mesh);
      matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      group.add(mesh);
    }
    const batches = new Map();
    for (const child of group.children) {
      if (
        !child.isMesh ||
        child.userData.terrain ||
        child.userData.contact ||
        child.userData.floor !== undefined ||
        child.userData.openDoorLeaf ||
        child.isReflector ||
        child.userData.mirrorFallback ||
        child.children.length > 0 ||
        Array.isArray(child.material) ||
        child.material.transparent
      ) {
        continue;
      }
      const attributes = Object.keys(child.geometry.attributes).toSorted().join(","),
        key = `${child.material.uuid}:${child.castShadow}:${child.receiveShadow}:${attributes}`;
      if (!batches.has(key)) {
        batches.set(key, []);
      }
      batches.get(key).push(child);
    }
    for (const meshes of batches.values()) {
      if (meshes.length < 2) {
        continue;
      }
      const indexed = meshes.every((mesh) => mesh.geometry.index),
        parts = meshes.map((mesh) => {
          mesh.updateMatrix();
          const geometry =
            mesh.geometry.index && !indexed ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
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
    function prune(parent) {
      for (let index = parent.children.length - 1; index >= 0; index -= 1) {
        const child = parent.children[index];
        if (child.isGroup && !child.userData.token) {
          prune(child);
          if (child.children.length === 0) {
            parent.remove(child);
          }
        }
      }
    }
    prune(group);
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
      if (furnitureTemplates.has(name)) {
        const cached = furnitureTemplates.get(name).clone(true);
        cached.scale.set(w / cw, h / ch, d / cd);
        cached.userData.token = token;
        selectableGroups.push(cached);
        return cached;
      }
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
          const alongX = cw >= cd,
            length = Math.max(cw, cd),
            thickness = Math.min(cw, cd),
            count = Math.max(4, Math.ceil(length / 0.35));
          for (let i = 0; i < count; i += 1) {
            const leaves = new THREE.Mesh(
                new THREE.SphereGeometry(1, 10, 8),
                i % 4 ? material.foliage : material.olive,
              ),
              along = ((i + 0.5) / count - 0.5) * length;
            leaves.position.set(alongX ? along : 0, ch * 0.5, alongX ? 0 : along);
            leaves.scale.set(
              alongX ? (length / count) * 0.75 : thickness * 0.5,
              ch * (0.49 + (i % 3) * 0.012),
              alongX ? thickness * 0.5 : (length / count) * 0.75,
            );
            leaves.castShadow = true;
            leaves.receiveShadow = true;
            group.add(leaves);
          }
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
          if (name === "garden_lamp") {
            const globe = new THREE.Mesh(new THREE.SphereGeometry(cw * 0.5, 16, 12), emitter);
            globe.position.y = ch - cw * 0.5;
            group.add(globe);
          } else {
            cylinder(group, cw * 0.35, cw * 0.35, ch * 0.25, 0, ch * 0.78, 0, emitter);
            cylinder(group, cw * 0.5, cw * 0.5, 0.04, 0, ch * 0.94, 0, material.metal);
          }
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
            cushion(
              group,
              seatWidth - 0.014,
              0.15,
              cd - 0.2,
              x,
              0.44,
              0.07,
              material.fabric,
              material.fabricDark,
            );
            const back = cushion(
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
          const scatterCushion = cushion(
            group,
            0.27,
            0.27,
            0.12,
            -cw * 0.25,
            0.62,
            -0.08,
            material.cream,
          );
          scatterCushion.rotation.set(-0.15, 0.1, 0.18);
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
          cushion(group, cw - 0.08, 0.23, cd - 0.11, 0, 0.39, 0, material.cream, material.linen);
          box(group, cw, ch, 0.1, 0, ch / 2, -cd / 2 + 0.05, material.wood);
          drapedCover(group, cw - 0.1, cd * 0.64, 0, 0.55, cd * 0.12, material.linen);
          box(group, cw - 0.1, 0.018, cd * 0.26, 0, 0.554, cd * 0.27, material.fabric);
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
            pullHandle(group, cw * 0.23, 0, y + drawerHeight * 0.2, cd / 2);
          }
          break;
        }
        case "wardrobe": {
          box(group, cw, ch - 0.035, cd - 0.035, 0, (ch + 0.035) / 2, -0.0175, material.woodDark);
          box(group, cw - 0.06, 0.035, cd - 0.07, 0, 0.0175, 0, material.woodDark);
          const doorWidth = (cw - 0.016) / 2;
          for (const side of [-1, 1]) {
            box(
              group,
              doorWidth - 0.005,
              ch - 0.065,
              0.025,
              (side * doorWidth) / 2,
              ch / 2 + 0.005,
              cd / 2 - 0.0125,
              material.wood,
            );
            pullHandle(group, 0.18, side * 0.1, ch * 0.52, cd / 2, true);
          }
          break;
        }
        case "kitchen_counter":
        case "sink":
        case "stove":
        case "kitchen_island": {
          box(group, cw - 0.06, 0.1, cd - 0.07, 0, 0.05, -0.02, material.woodDark);
          if (name === "sink") {
            cabinetShell(group, cw, cd - 0.015, 0.1, ch - 0.06, material.woodDark, -0.0075);
          } else {
            box(group, cw, ch - 0.15, cd - 0.04, 0, (ch + 0.05) / 2, -0.02, material.woodDark);
          }
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
            pullHandle(group, doorWidth * 0.45, x, ch - 0.19, cd / 2);
          }
          if (name === "sink") {
            const basinWidth = cw * 0.56,
              basinDepth = cd * 0.55;
            cutWorktop(group, cw + 0.025, cd + 0.025, 0.06, 0, ch, 0, material.white, {
              d: basinDepth,
              w: basinWidth,
              x: 0,
              z: 0,
            });
            insetBasin(group, basinWidth, basinDepth, 0, ch + 0.008, 0);
          } else {
            box(group, cw + 0.025, 0.06, cd + 0.025, 0, ch - 0.03, 0, material.white);
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
          const profile = [
              [0.3, 0.035],
              [0.4, 0.06],
              [0.47, 0.15],
              [0.5, ch - 0.06],
              [0.49, ch - 0.02],
              [0.46, ch],
              [0.43, ch - 0.025],
              [0.425, ch - 0.085],
              [0.39, 0.24],
              [0.31, 0.13],
              [0.2, 0.12],
              [0, 0.12],
            ],
            basin = new THREE.Mesh(
              new THREE.LatheGeometry(
                profile.map(([r, y]) => new THREE.Vector2(r, y)),
                40,
              ),
              material.porcelain,
            );
          basin.scale.set(cw, 1, cd);
          basin.castShadow = true;
          basin.receiveShadow = true;
          group.add(basin);
          cylinder(group, 0.025, 0.025, 0.004, -cw * 0.27, 0.124, 0, material.chrome, 16);
          curvedRod(
            group,
            [
              [-cw * 0.32, ch - 0.08, -cd * 0.36],
              [-cw * 0.32, ch - 0.015, -cd * 0.36],
              [-cw * 0.32, ch - 0.015, -cd * 0.2],
            ],
            0.014,
            material.chrome,
            12,
          );
          for (const offset of [-0.055, 0.055]) {
            cylinder(
              group,
              0.019,
              0.019,
              0.025,
              -cw * 0.32 + offset,
              ch - 0.038,
              -cd * 0.36,
              material.chrome,
              12,
            );
          }
          break;
        }
        case "toilet": {
          const profile = [
              [0.1, 0.02],
              [0.115, 0.07],
              [0.105, 0.2],
              [0.17, 0.32],
              [0.205, 0.39],
              [0.205, 0.41],
              [0.185, 0.41],
              [0.16, 0.34],
              [0.09, 0.25],
              [0.035, 0.24],
            ],
            bowl = new THREE.Mesh(
              new THREE.LatheGeometry(
                profile.map(([r, y]) => new THREE.Vector2(r, y)),
                28,
              ),
              material.porcelain,
            );
          bowl.scale.z = 1.25;
          bowl.position.z = 0.08;
          bowl.castShadow = true;
          bowl.receiveShadow = true;
          group.add(bowl);
          box(group, 0.37, 0.33, 0.17, 0, 0.535, -0.23, material.porcelain);
          box(group, 0.39, 0.028, 0.185, 0, 0.71, -0.23, material.porcelain);
          const seat = new THREE.Mesh(new THREE.TorusGeometry(0.187, 0.018, 6, 32), material.white);
          seat.rotation.x = Math.PI / 2;
          seat.scale.y = 1.27;
          seat.position.set(0, 0.431, 0.08);
          seat.castShadow = true;
          seat.receiveShadow = true;
          group.add(seat);
          cylinder(group, 0.065, 0.065, 0.004, 0, 0.253, 0.08, material.water, 20).scale.z = 1.25;
          cylinder(group, 0.025, 0.025, 0.006, 0.07, 0.728, -0.23, material.metal, 16);
          for (const x of [-0.11, 0.11]) {
            box(group, 0.045, 0.016, 0.04, x, 0.435, -0.15, material.metal);
          }
          break;
        }
        case "vanity": {
          cabinetShell(group, cw, cd - 0.015, 0.04, ch - 0.025, material.white, -0.0075);
          const drawerHeight = (ch - 0.075) / 2;
          for (let i = 0; i < 2; i += 1) {
            const y = 0.04 + drawerHeight * (i + 0.5);
            box(group, cw - 0.035, drawerHeight - 0.012, 0.025, 0, y, cd / 2, material.white);
            pullHandle(group, cw * 0.64, 0, y + drawerHeight * 0.2, cd / 2 + 0.0125);
          }
          cutWorktop(group, cw + 0.02, cd + 0.02, 0.05, 0, ch + 0.025, 0, material.porcelain, {
            d: cd - 0.16,
            w: cw - 0.28,
            x: 0,
            z: 0,
          });
          insetBasin(group, cw - 0.28, cd - 0.16, 0, ch + 0.025, 0, material.porcelain);
          break;
        }
        case "shower": {
          box(group, cw, 0.035, cd, 0, 0.0175, 0, material.white);
          for (const side of [-1, 1]) {
            box(group, 0.025, 0.028, cd, side * (cw / 2 - 0.0125), 0.049, 0, material.white);
            box(group, cw - 0.05, 0.028, 0.025, 0, 0.049, side * (cd / 2 - 0.0125), material.white);
          }
          const glassBottom = 0.064,
            glassTop = ch - 0.018,
            glassHeight = glassTop - glassBottom,
            glassY = (glassTop + glassBottom) / 2,
            frontZ = cd / 2 - 0.035,
            backZ = -cd / 2 + 0.018,
            sideDepth = frontZ - backZ,
            sideZ = (frontZ + backZ) / 2;
          for (const side of [-1, 1]) {
            const x = side * (cw / 2 - 0.018);
            addGlassPane(group, sideDepth, glassHeight, x, glassY, sideZ, (side * Math.PI) / 2);
            for (const z of [frontZ, backZ]) {
              box(group, 0.018, glassHeight + 0.018, 0.018, x, glassY + 0.009, z, material.metal);
            }
            for (const y of [glassBottom, glassTop]) {
              box(group, 0.018, 0.018, sideDepth, x, y, sideZ, material.metal);
            }
          }
          addGlassPane(group, cw - 0.036, glassHeight, 0, glassY, frontZ);
          for (const y of [glassBottom, glassTop]) {
            box(group, cw - 0.018, 0.018, 0.018, 0, y, frontZ, material.metal);
          }
          for (const y of [0.35, ch - 0.35]) {
            box(group, 0.033, 0.045, 0.024, -cw / 2 + 0.035, y, frontZ + 0.005, material.metal);
          }
          pullHandle(group, 0.18, cw / 2 - 0.11, 1.04, frontZ, true);
          const fixtures = new THREE.Group();
          addReferenceAsset("shower_set", fixtures);
          fixtures.position.set(0, 0.064, -cd / 2 + 0.065);
          group.add(fixtures);
          cylinder(group, 0.037, 0.037, 0.004, 0.13, 0.039, -cd * 0.23, material.metal, 16);
          break;
        }
        case "ottoman": {
          box(group, cw, 0.28, cd, 0, 0.25, 0, material.fabric);
          legs(group, cw, cd, 0.13);
          break;
        }
        case "fridge": {
          box(group, cw, ch, cd - 0.04, 0, ch / 2, -0.02, material.white);
          const split = ch * 0.65;
          box(group, cw - 0.012, split - 0.012, 0.04, 0, split / 2, cd / 2 - 0.02, material.white);
          box(
            group,
            cw - 0.012,
            ch - split - 0.012,
            0.04,
            0,
            (ch + split) / 2,
            cd / 2 - 0.02,
            material.white,
          );
          box(group, cw - 0.025, 0.01, 0.008, 0, split, cd / 2 - 0.006, material.rubber);
          pullHandle(group, 0.22, cw * 0.34, ch * 0.43, cd / 2, true);
          pullHandle(group, 0.18, cw * 0.34, ch * 0.79, cd / 2, true);
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
          cabinetShell(group, cw, cd - 0.08, 0.025, ch - 0.025, material.white, -0.04);
          box(group, cw, 0.025, cd, 0, ch - 0.0125, 0, material.white);
          box(group, cw - 0.055, 0.032, 0.018, 0, 0.041, cd / 2 - 0.065, material.rubber);
          for (const x of [-1, 1]) {
            for (const z of [-1, 1]) {
              cylinder(
                group,
                0.018,
                0.018,
                0.025,
                x * (cw / 2 - 0.06),
                0.0125,
                z * (cd / 2 - 0.055),
                material.rubber,
                8,
              );
            }
          }
          const doorY = ch * 0.435,
            faceY = ch / 2 + 0.005,
            front = new THREE.Mesh(
              piercedPanelGeometry(cw - 0.012, ch - 0.045, 0.028, {
                h: 0.39,
                w: 0.39,
                x: 0,
                y: doorY - faceY,
              }),
              material.white,
            );
          front.position.set(0, faceY, cd / 2 - 0.072);
          front.castShadow = true;
          front.receiveShadow = true;
          group.add(front);
          const drum = new THREE.Mesh(
            new THREE.LatheGeometry(
              [
                [0, -0.105],
                [0.174, -0.105],
                [0.174, 0.105],
                [0.168, 0.105],
                [0.168, -0.099],
                [0, -0.099],
              ].map(([r, y]) => new THREE.Vector2(r, y)),
              24,
            ),
            material.brushedSteel,
          );
          drum.rotation.x = Math.PI / 2;
          drum.position.set(0, doorY, cd / 2 - 0.14);
          drum.castShadow = true;
          drum.receiveShadow = true;
          group.add(drum);
          const back = cylinder(
            group,
            0.14,
            0.14,
            0.002,
            0,
            doorY,
            cd / 2 - 0.237,
            material.rubber,
            24,
          );
          back.rotation.x = Math.PI / 2;
          for (let i = 0; i < 3; i += 1) {
            const angle = (i * Math.PI * 2) / 3,
              drumLifter = box(
                group,
                0.03,
                0.02,
                0.14,
                Math.sin(angle) * 0.153,
                doorY + Math.cos(angle) * 0.153,
                cd / 2 - 0.13,
                material.brushedSteel,
                false,
              );
            drumLifter.rotation.z = -angle;
          }
          for (const [radius, tube, ringZ, finish] of [
            [0.182, 0.012, cd / 2 - 0.055, material.rubber],
            [0.204, 0.017, cd / 2 - 0.029, material.white],
          ]) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 6, 32), finish);
            ring.position.set(0, doorY, ringZ);
            ring.castShadow = true;
            ring.receiveShadow = true;
            group.add(ring);
          }
          const glass = new THREE.Mesh(
            new THREE.SphereGeometry(0.179, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2),
            material.washerGlass,
          );
          glass.scale.y = 0.17;
          glass.rotation.x = Math.PI / 2;
          glass.position.set(0, doorY, cd / 2 - 0.037);
          group.add(glass);
          box(group, 0.021, 0.068, 0.018, 0.207, doorY, cd / 2 - 0.02, material.white);
          const controlsY = ch - 0.09;
          box(
            group,
            0.16,
            0.003,
            0.003,
            -cw * 0.28,
            controlsY + 0.03,
            cd / 2 - 0.042,
            material.rubber,
            false,
          );
          box(
            group,
            0.085,
            0.034,
            0.004,
            cw * 0.28,
            controlsY,
            cd / 2 - 0.041,
            material.screen,
            false,
          );
          for (const [radius, depth, z, finish] of [
            [0.033, 0.007, cd / 2 - 0.038, material.brushedSteel],
            [0.028, 0.018, cd / 2 - 0.027, material.white],
          ]) {
            const dial = cylinder(group, radius, radius, depth, 0.018, controlsY, z, finish, 16);
            dial.rotation.x = Math.PI / 2;
          }
          box(
            group,
            0.002,
            0.012,
            0.003,
            0.018,
            controlsY + 0.012,
            cd / 2 - 0.016,
            material.rubber,
            false,
          );
          for (let i = 0; i < 3; i += 1) {
            const button = cylinder(
              group,
              0.004,
              0.004,
              0.004,
              cw * 0.22 + i * 0.024,
              controlsY - 0.034,
              cd / 2 - 0.038,
              material.white,
              8,
            );
            button.rotation.x = Math.PI / 2;
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
          cushion(group, cw, ch, cd, 0, ch / 2, 0, material.cream, material.linen);
          break;
        }
        default: {
          break;
        }
      }
      group.userData.supportHeight =
        name === "canopy_bed"
          ? 0.6
          : name === "upholstered_bed"
            ? 0.58
            : name === "modular_sofa"
              ? 0.52
              : undefined;
      addReferenceAsset(name, group);
      addDecoration(group, name, box);
      batchFurniture(group);
      if (
        name !== "mirror" &&
        !lightAssets.includes(name) &&
        !group.children.some((child) => child.isLight || child.isReflector)
      ) {
        furnitureTemplates.set(name, group.clone(true));
        group.traverse((node) => {
          if (node.geometry) {
            templateGeometries.add(node.geometry);
          }
          for (const finish of [node.material].flat().filter(Boolean)) {
            sharedMaterials.add(finish);
          }
        });
      }
      group.scale.set(w / cw, h / ch, d / cd);
    }
    group.userData.token = token;
    selectableGroups.push(group);
    return group;
  }
  function addArchitecture(program) {
    const outsideFinish = facadeMaterial(program.facade),
      trim = mat("#886f60");
    wallRoots = [];
    ceilingRoots = [];
    material.ceiling.transparent = true;
    material.ceiling.opacity = ceilingsCollapsed ? 0 : 1;
    material.ceiling.depthWrite = !ceilingsCollapsed;
    for (const room of program.rooms) {
      const wallHeight = room.height,
        roomRoot = new THREE.Group();
      roomRoot.position.y = room.elevation;
      roomRoot.userData.floor = room.floor;
      roomRoot.userData.token = {
        dimensions: [room.cols * program.grid, room.rows * program.grid, wallHeight],
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
          room.surface === "auto"
            ? room.style === "mediterranean"
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
                        ? material.stone
                        : /(kitchen)/u.test(room.name)
                          ? material.stone
                          : material.floor
            : material[
                {
                  concrete: "concrete",
                  grass: "grass",
                  stone: "flagstone",
                  terracotta: "terracotta",
                  tile: "stone",
                  wood: "floor",
                }[room.surface]
              ],
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
            const surface = box(
              parent,
              part.x2 - part.x1,
              h,
              part.z2 - part.z1,
              (part.x1 + part.x2) / 2,
              y,
              (part.z1 + part.z2) / 2,
              finish,
            );
            if (finish.userData.textureScale) {
              const { position, normal, uv } = surface.geometry.attributes,
                scale = finish.userData.textureScale;
              for (let vertex = 0; vertex < position.count; vertex += 1) {
                if (Math.abs(normal.getY(vertex)) > 0.7) {
                  uv.setXY(
                    vertex,
                    (position.getX(vertex) + surface.position.x) / scale,
                    (position.getZ(vertex) + surface.position.z) / scale,
                  );
                }
              }
            }
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
      const wallMaterial =
        room.style === "mediterranean"
          ? /(bath|wash)/u.test(room.name)
            ? material.wallTile
            : material.plaster
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
        for (
          let z = -depth / 2 + 0.36;
          room.surface !== "grass" && room.surface !== "stone" && z < depth / 2;
          z += 0.36
        ) {
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
          glazed = glazedDoor(program, room, dir),
          doorGap = doorwayWidth(program, room, dir, length),
          doorHeight = Math.min(glazed ? 2.3 : 2.16, wallHeight - 0.15),
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
            if (wallMaterial.userData.textureScale) {
              const { position, normal, uv } = wall.geometry.attributes,
                scale = wallMaterial.userData.textureScale,
                horizontalScale = scale * (wallMaterial.userData.textureAspect || 1);
              for (let i = 0; i < position.count; i += 1) {
                uv.setXY(
                  i,
                  (Math.abs(normal.getX(i)) > 0.7
                    ? position.getZ(i) + wall.position.z
                    : position.getX(i) + wall.position.x) / horizontalScale,
                  (Math.abs(normal.getY(i)) > 0.7
                    ? position.getZ(i) + wall.position.z
                    : position.getY(i) + wall.position.y) / scale,
                );
              }
            }
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
              hasDoor ? doorGap : Math.min(2.1, length * 0.48),
              thickness + 0.04,
              hasDoor ? doorHeight : 1.05,
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
          const gap = doorGap,
            segmentLength = (length - gap) / 2;
          room.daylightOpenings.push({
            area: gap * doorHeight,
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
          addWallPart(0, gap, wallHeight - doorHeight, (wallHeight + doorHeight) / 2);
          const pickMaterial = new THREE.MeshBasicMaterial({
            depthWrite: false,
            opacity: 0,
            side: THREE.DoubleSide,
            transparent: true,
          });
          box(
            opening,
            vertical ? 0.02 : gap,
            doorHeight,
            vertical ? gap : 0.02,
            vertical ? fixed : middle,
            doorHeight / 2,
            vertical ? middle : fixed,
            pickMaterial,
          ).castShadow = false;
          for (const offset of [-gap / 2, gap / 2]) {
            box(
              opening,
              vertical ? thickness + 0.02 : 0.055,
              doorHeight,
              vertical ? 0.055 : thickness + 0.02,
              vertical ? fixed : middle + offset,
              doorHeight / 2,
              vertical ? middle + offset : fixed,
              room.style === "mediterranean" ? material.wood : material.white,
            );
          }
          box(
            opening,
            vertical ? thickness + 0.02 : gap + 0.055,
            0.055,
            vertical ? gap + 0.055 : thickness + 0.02,
            vertical ? fixed : middle,
            doorHeight - 0.0275,
            vertical ? middle : fixed,
            room.style === "mediterranean" ? material.wood : material.white,
          );
          const leafHeight = doorHeight - 0.07,
            leafLength = glazed ? (gap - 0.12) / 2 : gap - 0.1,
            outward = { east: 1, north: -1, south: 1, west: -1 }[dir];
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
            glass.opacity = 0.12;
            glass.depthWrite = false;
            glass.userData.windowPane = true;
            for (const x of [-leafLength / 2 + 0.03, leafLength / 2 - 0.03]) {
              box(leaf, 0.06, leafHeight, 0.06, x, leafHeight / 2, 0, material.wood);
            }
            for (const y of [0.045, 0.68, leafHeight - 0.035]) {
              box(leaf, leafLength, 0.07, 0.06, 0, y, 0, material.wood);
            }
            for (const [y, height] of [
              [0.36, 0.56],
              [(0.72 + leafHeight - 0.08) / 2, leafHeight - 0.8],
            ]) {
              box(leaf, leafLength - 0.12, height, 0.018, 0, y, 0, glass).castShadow = false;
            }
            box(leaf, 0.025, 0.12, 0.035, leafLength / 2 - 0.05, 1.05, 0.045, material.metal);
            const secondLeaf = leaf.clone();
            if (vertical) {
              secondLeaf.position.z += gap - 0.11;
            } else {
              secondLeaf.position.x += gap - 0.11;
            }
            opening.add(secondLeaf);
            const shutter = new THREE.Group();
            addReferenceAsset("roller_shutter", shutter);
            shutter.scale.x = (gap + 0.15) / referenceCatalog.roller_shutter[0];
            shutter.scale.y = Math.min(1, (wallHeight - 0.02) / referenceCatalog.roller_shutter[2]);
            shutter.rotation.y = vertical ? Math.PI / 2 : 0;
            shutter.position.set(
              vertical ? fixed + outward * (thickness / 2 + 0.1) : middle,
              0,
              vertical ? middle : fixed + outward * (thickness / 2 + 0.1),
            );
            opening.add(shutter);
          } else if (
            !sharedEdge ||
            program.rooms.some(
              (other) =>
                sharedWall(room, other, dir) && /(hall|landing|corridor)/u.test(other.name),
            ) ||
            (!/(hall|landing|corridor)/u.test(room.name) &&
              ["east", "south"].includes(dir) &&
              !program.rooms.some(
                (other) =>
                  sharedWall(room, other, dir) && /(hall|landing|corridor)/u.test(other.name),
              ))
          ) {
            const leaf = box(
              opening,
              vertical ? leafLength : 0.055,
              leafHeight,
              vertical ? 0.055 : leafLength,
              vertical ? fixed + (outward * leafLength) / 2 : middle - gap / 2 + 0.055,
              leafHeight / 2,
              vertical ? middle - gap / 2 + 0.055 : fixed + (outward * leafLength) / 2,
              material.wood,
            );
            leaf.userData.openDoorLeaf = true;
          }
        } else if (hasWindow) {
          const span = Math.min(room.floor < 0 ? 1.2 : 2.1, length * 0.48),
            head = Math.min(room.floor < 0 ? 2.6 : 2.2, wallHeight - 0.15),
            sill = Math.min(room.floor < 0 ? 2.05 : 1.15, head - 0.4),
            windowHeight = head - sill,
            offset = THREE.MathUtils.clamp(
              (dir === "north" ? 0.16 : -0.13) * length,
              -length / 2 + span / 2 + 0.15,
              length / 2 - span / 2 - 0.15,
            ),
            leftLength = length / 2 + offset - span / 2,
            rightLength = length / 2 - offset - span / 2;
          addWallPart(-length / 2 + leftLength / 2, leftLength);
          addWallPart(length / 2 - rightLength / 2, rightLength);
          addWallPart(offset, span, sill, sill / 2);
          addWallPart(offset, span, wallHeight - head, (wallHeight + head) / 2);
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
            windowY = (sill + head) / 2,
            glass = mat("#b7d6d8", 0.12);
          glass.userData.windowPane = true;
          room.daylightOpenings.push({
            area: span * windowHeight,
            dir,
            shared: sharedEdge,
            span,
            x: vertical ? fixed : center,
            z: vertical ? center : fixed,
          });
          glass.transparent = true;
          glass.opacity = 0.16;
          glass.depthWrite = false;
          glass.side = THREE.DoubleSide;
          if (vertical) {
            box(
              opening,
              0.025,
              windowHeight - 0.07,
              span - 0.09,
              fixed,
              windowY,
              center,
              glass,
            ).castShadow = false;
            for (const y of [sill, head]) {
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
                windowHeight,
                0.055,
                fixed,
                windowY,
                z,
                room.style === "mediterranean" ? material.wood : material.white,
              );
            }
          } else {
            box(
              opening,
              span - 0.09,
              windowHeight - 0.07,
              0.025,
              center,
              windowY,
              fixed,
              glass,
            ).castShadow = false;
            for (const y of [sill, head]) {
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
                windowHeight,
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
          mount.name === "wall_spot_pair"
            ? Math.min(2.15, wallHeight - 0.3)
            : wallDecor.includes(mount.name)
              ? 1.65 - catalog[mount.name][2] / 2
              : mount.name === "air_conditioner"
                ? Math.min(2.13, wallHeight - catalog[mount.name][2] - 0.06)
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
          const [pw, pd] = catalog[parent.token.name];
          x = (c - (colCount - 1) / 2) * (pw / Math.max(colCount, 1)) * 0.67;
          z = (r - (rowCount - 1) / 2) * (pd / Math.max(rowCount, 1)) * 0.67;
          holder = parent.group;
        }
        const group = makeFurniture(token, false);
        group.userData.floor = room.floor;
        const ceilingOffset =
          isRoot && [...overheadLights, "ceiling_fan"].includes(token.name)
            ? room.height - token.dimensions[2]
            : 0;
        group.position.set(
          x,
          isRoot
            ? room.elevation + ceilingOffset
            : (parent.group.userData.supportHeight ?? catalog[parent.token.name][2]),
          z,
        );
        group.rotation.y = THREE.MathUtils.degToRad(token.yaw);
        holder.add(group);
        if (isRoot) {
          addContact(group, token);
        }
        entries.push({ group, token, x, z });
        if (token.child) {
          placeLayout(program, token.child, room, { group, token }, depth + 1, [...stack, name]);
        }
      }),
    );
    return entries;
  }
  function findCollisions() {
    return overlapWarnings(collisionIndex, overheadLights);
  }
  function resetCamera(top = false) {
    stopWalkthrough();
    if (!currentProgram) {
      return;
    }
    if (firstPerson) {
      setFirstPerson(false);
    }
    const room = currentProgram.rooms.find((item) => item.name === focusRoom),
      areas = room
        ? [room]
        : currentProgram.rooms.filter(
            (item) => focusFloor === undefined || item.floor === focusFloor,
          ),
      minX = Math.min(...areas.map((item) => item.x)),
      maxX = Math.max(...areas.map((item) => item.x + item.cols)),
      minZ = Math.min(...areas.map((item) => item.z)),
      maxZ = Math.max(...areas.map((item) => item.z + item.rows)),
      extent = Math.max(
        Math.max(maxX - minX, maxZ - minZ) * currentProgram.grid +
          (room || areas.length === 1 || focusFloor !== undefined || currentProgram.site === "none"
            ? 0
            : Math.min(currentProgram.margin, 1)),
        Math.max(...areas.map((area) => area.elevation + area.height)) -
          Math.min(...areas.map((area) => area.elevation)),
      ),
      framing = Math.max(1, 1.1 / camera.aspect),
      cx = ((minX + maxX - currentProgram.cols) / 2) * currentProgram.grid,
      cz = ((minZ + maxZ - currentProgram.rows) / 2) * currentProgram.grid,
      elevation =
        room?.elevation ??
        (focusFloor === undefined
          ? (currentProgram.floors.at(-1) + currentProgram.floors[0]) * 1.5
          : focusFloor * 3);
    controls.target.set(cx, elevation + 0.3, cz);
    camera.position.set(
      cx + (top ? 0 : extent * 0.18 * framing),
      elevation + (top ? extent * 1.65 : extent * 1.15) * framing,
      cz + (top ? 0.001 : extent * 1.1 * framing),
    );
    camera.lookAt(controls.target);
    controls.update();
    $("topButton").classList.toggle("active", top);
    $("topButton").setAttribute("aria-pressed", String(top));
    $("resetButton").classList.toggle("active", !top);
    $("resetButton").setAttribute("aria-pressed", String(!top));
  }
  function setFirstPerson(enabled, standingPosition) {
    if (!enabled) {
      stopWalkthrough();
    }
    if (firstPerson === enabled) {
      return;
    }
    firstPerson = enabled;
    camera.fov = enabled ? Number($("walkLens").value) : 45;
    $("walkLensControl").hidden = !enabled;
    $("touchNavigation").hidden = !enabled;
    camera.updateProjectionMatrix();
    if (enabled) {
      orbitCeilingsCollapsed = ceilingsCollapsed;
      ceilingsCollapsed = false;
    } else {
      ceilingsCollapsed = orbitCeilingsCollapsed;
    }
    syncCeilingButton();
    requestRender();
    lookControls.enabled = enabled;
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
    $("navigationHint").innerHTML =
      enabled && matchMedia("(pointer: coarse)").matches
        ? "Drag to look <span>·</span> Hold arrows to walk"
        : enabled
          ? "Click to look with mouse <span>·</span> WASD: move <span>·</span> E / Shift+E: up/down <span>·</span> Esc to release mouse"
          : "Drag to orbit <span>·</span> Scroll to zoom <span>·</span> Right drag to pan";
    if (enabled && currentProgram) {
      const room =
        currentProgram.rooms.find((item) => item.name === focusRoom) ||
        currentProgram.rooms.find(
          (item) => item.floor === (focusFloor ?? 0) && item.kind !== "balcony",
        ) ||
        currentProgram.rooms[0];
      camera.position.set(
        room.centerX,
        room.elevation + walkEyeHeight,
        room.centerZ +
          (room.kind === "balcony" ? -1 : 1) * Math.min(room.rows * currentProgram.grid * 0.3, 2),
      );
      const standing =
        standingPosition || findStandingPosition(room, camera.position.x, camera.position.z);
      if (!standing) {
        setFirstPerson(false);
        showStatus("No clear standing space in this room", "warn");
        return;
      }
      camera.position.x = standing.x;
      camera.position.z = standing.z;
      camera.rotation.order = "YXZ";
      aimInsideRoom(room);
      renderer.domElement.style.cursor = "crosshair";
    } else if (currentProgram) {
      resetCamera();
      renderer.domElement.style.cursor = "";
    }
    updateFloorVisibility();
  }
  $("walkLensControl").title = `Camera eye height: ${walkEyeHeight.toFixed(2)} m`;
  $("firstPersonButton").title = `Walk at ${walkEyeHeight.toFixed(2)} m camera height`;
  $("walkthroughButton").title = `Tour rooms at ${walkEyeHeight.toFixed(2)} m camera height`;
  $("walkLens").addEventListener("change", () => {
    if (firstPerson) {
      camera.fov = Number($("walkLens").value);
      camera.updateProjectionMatrix();
      requestRender();
    }
  });
  function updateFloorVisibility() {
    renderDirty = true;
    renderer.shadowMap.needsUpdate = true;
    clearHover();
    const gardens = new Set(
      currentProgram?.rooms.filter((room) => room.garden).map((room) => room.name),
    );
    for (const group of sceneRoot.children) {
      if (group.userData.terrain) {
        group.visible = !terrainCutaway && !(focusFloor < 0);
        continue;
      }
      if (group.userData.floor === undefined) {
        continue;
      }
      group.visible =
        focusFloor === undefined ||
        group.userData.floor === focusFloor ||
        (firstPerson && focusFloor >= 0 && gardens.has(group.userData.token?.room));
    }
    gridHelper.position.y = (focusFloor || 0) * 3 + 0.002;
    $("floorFocus").value = focusFloor === undefined ? "" : String(focusFloor);
  }
  function useConnector(down = false) {
    const floor = Math.round((camera.position.y - walkEyeHeight) / 3),
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
    camera.position.set(standing.x, destination.elevation + walkEyeHeight, standing.z);
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
      if (node.isReflector) {
        node.getRenderTarget().dispose();
      }
      if (node.isLight) {
        node.shadow?.dispose();
      }
    });
    const disposed = new Set();
    sceneRoot.traverse((node) => {
      if (node.geometry && !templateGeometries.has(node.geometry) && !disposed.has(node.geometry)) {
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
  let pendingCompile,
    sceneBuilding = false;
  /* eslint-disable no-await-in-loop -- Serialize builds so shader preparation cannot race scene disposal. */ async function compile(
    resetView = false,
  ) {
    pendingCompile = { resetView: resetView || pendingCompile?.resetView || false };
    if (sceneBuilding) {
      return;
    }
    sceneBuilding = true;
    try {
      while (pendingCompile) {
        const request = pendingCompile;
        pendingCompile = undefined;
        await paintProgress("Building scene…");
        const built = buildScene(request.resetView);
        if (built) {
          await paintProgress("Preparing materials & shadows…");
          await renderer.compileAsync(scene, camera);
        }
      }
      await paintProgress("Rendering view…");
      requestRender();
    } catch (error) {
      showStatus(`Could not render scene: ${error.message}`, "error");
      renderProgress();
    } finally {
      sceneBuilding = false;
      if (pendingCompile) {
        compile(pendingCompile.resetView);
      }
    }
  }
  /* eslint-enable no-await-in-loop */ function buildScene(resetView = false) {
    const buildStarted = performance.now();
    stopWalkthrough();
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
    collisionIndex = createCollisionIndex([]);
    currentProgram = program;
    compiledSource = editor.state.doc.toString();
    const sceneExtent = Math.max(
      program.cols * program.grid,
      program.rows * program.grid,
      (program.floors.at(-1) - program.floors[0] + 1) * 3,
    );
    controls.maxDistance = Math.max(100, sceneExtent * 4);
    camera.far = Math.max(250, sceneExtent * 8);
    camera.updateProjectionMatrix();
    addArchitecture(program);
    addExterior(program, sceneRoot, ceilingRoots, box);
    for (const group of selectableGroups) {
      if (["door", "window"].includes(group.userData.token?.name)) {
        batchFurniture(group);
      }
    }
    for (const child of sceneRoot.children) {
      if (child.isGroup) {
        batchFurniture(child);
      }
    }
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
      ...program.floors.map((floor) => new Option(floorLabel(floor), String(floor))),
    );
    floorSelect.hidden = program.floors.length < 2;
    floorSelect.value = focusFloor === undefined ? "" : String(focusFloor);
    const roomSelect = $("roomFocus");
    roomSelect.replaceChildren(
      new Option("All rooms", ""),
      ...program.rooms.map(
        (room) =>
          new Option(
            room.name === "mediterranean_garden" ? "Garden" : room.name.replaceAll("_", " "),
            room.name,
          ),
      ),
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
          group.position.set(
            x,
            room.elevation +
              (overheadLights.includes(fixture.name) ? room.height - token.dimensions[2] : 0),
            z,
          );
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
    collisionIndex = createCollisionIndex(entries);
    batchContactShadows();
    addDaylightFill(program, sceneRoot);
    updateIndoorLights();
    updateFloorVisibility();
    lastBuildTime = performance.now() - buildStarted;
    const warnings = findCollisions();
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
      !canStandAt(
        camera.position.x,
        camera.position.z,
        Math.round((camera.position.y - walkEyeHeight) / 3),
      )
    ) {
      setFirstPerson(false);
      setFirstPerson(true);
    }
    return true;
  }
  function resize() {
    renderDirty = true;
    const w = viewport.clientWidth,
      h = viewport.clientHeight;
    if (!w || !h) {
      return;
    }
    const actionTools = w < 560 ? secondaryTools : primaryTools;
    if ($("saveViewButton").parentElement !== actionTools) {
      actionTools.append($("saveViewButton"), $("fullscreenButton"));
    }
    viewport.style.setProperty("--viewport-height", `${h}px`);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const profile = qualityProfiles[$("renderQuality").value],
      pixelBudget = motionResolution ? Math.min(profile.pixels, 1_000_000) : profile.pixels,
      ratio = Math.min(devicePixelRatio, profile.ratio, Math.sqrt(pixelBudget / (w * h)));
    if (renderer.getPixelRatio() !== ratio) {
      renderer.setPixelRatio(ratio);
    }
    if (
      renderer.domElement.width !== Math.floor(w * ratio) ||
      renderer.domElement.height !== Math.floor(h * ratio)
    ) {
      renderer.setSize(w, h, false);
    }
  }
  new ResizeObserver(resize).observe(viewport);
  const standingPoint = new THREE.Vector3();
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
          const gap = room.doors.includes(side)
            ? doorwayWidth(currentProgram, room, side, length)
            : 0;
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
    for (const { entry, walkingBox } of collisionIndex.search(floor, {
      maxX: x + radius * Math.SQRT2,
      maxY: z + radius * Math.SQRT2,
      minX: x - radius * Math.SQRT2,
      minY: z - radius * Math.SQRT2,
    })) {
      const { token } = entry;
      if (
        token.floor !== floor ||
        [
          "rug",
          "kilim_rug",
          "jute_rug",
          "floor_drain",
          "curtain_pair",
          "ceiling_fan",
          "gym_mat",
          "stone_path",
          "awning",
          "stairs",
          ...overheadLights,
        ].includes(token.name)
      ) {
        continue;
      }
      const angle = (token.yaw * Math.PI) / 180,
        dx = x - entry.x,
        dz = z - entry.z,
        localX = dx * Math.cos(angle) - dz * Math.sin(angle),
        localZ = dx * Math.sin(angle) + dz * Math.cos(angle),
        [width, depth] = token.dimensions;
      if (["olive_tree", "citrus_tree", "topiary_tree", "palm"].includes(token.name)) {
        if (Math.hypot(localX, localZ) < radius + Math.max(0.15, width * 0.08)) {
          return false;
        }
      } else if (token.name === "sleeping_loft") {
        const lx = (localX * 3.4) / width,
          lz = (localZ * 3.6) / depth,
          clearance = radius * Math.max(3.4 / width, 3.6 / depth),
          nearPost = [-1.64, 0.79].some((px) =>
            [-1.72, 0.35].some(
              (pz) => Math.abs(lx - px) < 0.06 + clearance && Math.abs(lz - pz) < 0.06 + clearance,
            ),
          ),
          nearStairs =
            lx > 0.9 - clearance &&
            lx < 1.7 + clearance &&
            lz > -1.55 - clearance &&
            lz < 1.8 + clearance,
          nearCupboard =
            Math.abs(lx - 0.33) < 0.45 + clearance && Math.abs(lz + 1.42) < 0.275 + clearance;
        if (nearPost || nearStairs || nearCupboard || token.dimensions[2] < 3) {
          return false;
        }
      } else if (token.name === "archway" || token.name === "timber_pergola") {
        const nearPost =
            Math.abs(localX) > width / 2 - 0.22 - radius && Math.abs(localX) < width / 2 + radius,
          alongPost =
            token.name === "archway"
              ? Math.abs(localZ) < depth / 2 + radius
              : Math.abs(Math.abs(localZ) - depth / 2) < 0.15 + radius;
        if (nearPost && alongPost) {
          return false;
        }
      } else if (token.name === "elevator") {
        if (
          Math.abs(localX) < width / 2 + radius &&
          Math.abs(localZ) < depth / 2 + radius &&
          (Math.abs(localX) > width / 2 - radius - 0.08 || localZ < -depth / 2 + radius + 0.08)
        ) {
          return false;
        }
      } else if (walkingBox.containsPoint(standingPoint.set(x, 0, z))) {
        return false;
      }
    }
    return true;
  }
  function moveFirstPerson(direction, distance) {
    const floor = Math.round((camera.position.y - walkEyeHeight) / 3),
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
  function aimInsideRoom(room) {
    const centered =
      Math.hypot(camera.position.x - room.centerX, camera.position.z - room.centerZ) < 0.25;
    camera.lookAt(
      room.centerX,
      room.elevation + walkEyeHeight - 0.12,
      room.centerZ - (centered ? 1 : 0),
    );
  }
  function focusCamera() {
    stopWalkthrough();
    if (!firstPerson) {
      updateFloorVisibility();
      resetCamera($("topButton").getAttribute("aria-pressed") === "true");
      return;
    }
    pressedKeys.clear();
    const cameraFloor = Math.round((camera.position.y - walkEyeHeight) / 3),
      rooms = currentProgram.rooms.filter(
        (room) =>
          (!focusRoom || room.name === focusRoom) && room.floor === (focusFloor ?? cameraFloor),
      );
    if (!focusRoom && (focusFloor === undefined || focusFloor === cameraFloor)) {
      updateFloorVisibility();
      return;
    }
    for (const room of rooms) {
      const standing = findStandingPosition(
        room,
        room.centerX,
        room.centerZ + Math.min(room.rows * currentProgram.grid * 0.3, 2),
      );
      if (standing) {
        camera.position.set(standing.x, room.elevation + walkEyeHeight, standing.z);
        camera.rotation.order = "YXZ";
        aimInsideRoom(room);
        updateFloorVisibility();
        return;
      }
    }
    focusRoom = undefined;
    focusFloor = cameraFloor;
    $("roomFocus").value = "";
    updateFloorVisibility();
    showStatus("No clear standing space in this area. Choose another room or use 3D view.", "warn");
  }
  function stopWalkthrough(message) {
    walkthroughRun += 1;
    if (!walkthrough) {
      return;
    }
    const { previous } = walkthrough;
    walkthrough = undefined;
    const button = $("walkthroughButton");
    button.textContent = "Walkthrough";
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
    button.title = "Plan a short first-person route through all reachable areas";
    if (previous) {
      if (wallsCollapsed !== previous.walls) {
        $("wallsButton").click();
      }
      if (ceilingsCollapsed !== previous.ceilings) {
        $("ceilingsButton").click();
      }
      if (terrainCutaway !== previous.terrain) {
        $("cutawayButton").click();
      }
      updateFloorVisibility();
    }
    $("navigationHint").textContent = firstPerson
      ? "Click to look · WASD: move · E / Shift+E: up/down · Esc: exit"
      : "Drag to orbit · Scroll to zoom · Right drag to pan";
    showStatus(message || "Walkthrough stopped");
    requestRender();
  }
  function walkthroughClear(a, b) {
    const count = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.08));
    for (let i = 0; i <= count; i += 1) {
      const t = i / count;
      if (!walkthroughStanding(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, a.floor)) {
        return false;
      }
    }
    return true;
  }
  function walkthroughStanding(x, z, floor) {
    if (!canStandAt(x, z, floor)) {
      return false;
    }
    return !currentProgram.connectors.some(
      (link) =>
        link.token.name === "stairs" &&
        link.room.floor === floor &&
        Math.abs(x - (link.x - currentProgram.cols / 2) * currentProgram.grid) <
          link.halfX * currentProgram.grid + 0.2 &&
        Math.abs(z - (link.z - currentProgram.rows / 2) * currentProgram.grid) <
          link.halfZ * currentProgram.grid + 0.2,
    );
  }
  /* eslint-disable no-await-in-loop -- Sequential checkpoints keep planning cancellable. */ async function planWalkthrough(
    run,
  ) {
    const program = currentProgram,
      step = Math.min(0.25, program.grid / 2),
      width = program.cols * program.grid,
      depth = program.rows * program.grid,
      columns = Math.ceil(width / step) + 1,
      rows = Math.ceil(depth / step) + 1,
      nodes = [],
      cells = new Map(),
      key = (x, z, floor) => `${floor}:${x}:${z}`,
      checkpoint = async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        if (run !== walkthroughRun) {
          throw new Error("Walkthrough cancelled");
        }
      },
      eye = (node) => ({ x: node.x, y: node.floor * 3 + walkEyeHeight, z: node.z }),
      connect = (a, b, via) => {
        const points = via || [eye(a), eye(b)],
          distance = points
            .slice(1)
            .reduce(
              (total, point, i) =>
                total +
                Math.hypot(point.x - points[i].x, point.y - points[i].y, point.z - points[i].z),
              0,
            );
        a.edges.push({ distance, to: b.id, via });
        b.edges.push({ distance, to: a.id, via: via?.toReversed() });
      };
    const samples = program.floors.length * columns * rows;
    if (samples > 160_000) {
      throw new Error(
        "This property is too large for an automatic walkthrough. Tour a smaller layout.",
      );
    }
    for (const floor of program.floors) {
      for (let iz = 0; iz < rows; iz += 1) {
        for (let ix = 0; ix < columns; ix += 1) {
          const x = ix * step - width / 2,
            z = iz * step - depth / 2;
          if (walkthroughStanding(x, z, floor)) {
            const node = { edges: [], floor, id: nodes.length, ix, iz, x, z };
            nodes.push(node);
            cells.set(key(ix, iz, floor), node);
          }
        }
        if (iz % 8 === 0) {
          await checkpoint();
        }
      }
    }
    if (nodes.length === 0) {
      throw new Error("No clear walking space. Leave room around furniture and doorways.");
    }
    for (const node of nodes) {
      for (const [dx, dz] of [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
      ]) {
        const next = cells.get(key(node.ix + dx, node.iz + dz, node.floor));
        if (
          !next ||
          (dx &&
            dz &&
            (!cells.has(key(node.ix + dx, node.iz, node.floor)) ||
              !cells.has(key(node.ix, node.iz + dz, node.floor))))
        ) {
          continue;
        }
        if (walkthroughClear(node, next)) {
          connect(node, next);
        }
      }
      if (node.id % 512 === 0) {
        await checkpoint();
      }
    }
    for (const link of program.connectors) {
      const yaw = THREE.MathUtils.degToRad(link.token.yaw),
        centerX = (link.x - program.cols / 2) * program.grid,
        centerZ = (link.z - program.rows / 2) * program.grid,
        stairs = link.token.name === "stairs",
        half = link.token.dimensions[1] / 2,
        landing = (floor, along) => ({
          floor,
          x: centerX + Math.sin(yaw) * along,
          z: centerZ + Math.cos(yaw) * along,
        }),
        lower = landing(link.room.floor, stairs ? half + 0.4 : 0),
        upper = landing(link.upper.floor, stairs ? -half - 0.4 : 0),
        nearest = (point) =>
          nodes
            .filter(
              (node) =>
                node.floor === point.floor &&
                Math.hypot(node.x - point.x, node.z - point.z) < step * 1.5 &&
                walkthroughClear(node, point),
            )
            .toSorted(
              (a, b) =>
                Math.hypot(a.x - point.x, a.z - point.z) - Math.hypot(b.x - point.x, b.z - point.z),
            )[0],
        a = nearest(lower),
        b = nearest(upper);
      if (a && b) {
        connect(a, b, [
          eye(a),
          eye(lower),
          eye(landing(link.room.floor, stairs ? half : 0)),
          eye(landing(link.upper.floor, stairs ? -half : 0)),
          eye(upper),
          eye(b),
        ]);
      }
    }
    const inRoom = (node, room) =>
        node.floor === room.floor &&
        Math.abs(node.x - room.centerX) < (room.cols * program.grid) / 2 &&
        Math.abs(node.z - room.centerZ) < (room.rows * program.grid) / 2,
      stops = program.rooms.map((room) => ({
        node: nodes
          .filter((node) => inRoom(node, room))
          .toSorted(
            (a, b) =>
              Math.hypot(a.x - room.centerX, a.z - room.centerZ) -
              Math.hypot(b.x - room.centerX, b.z - room.centerZ),
          )[0],
        room,
      })),
      preferred =
        stops.find((stop) => stop.room.name === focusRoom && stop.node) ||
        stops.find((stop) => stop.room.floor === (focusFloor ?? 0) && stop.node) ||
        stops.find((stop) => stop.node),
      startFloor = Math.round((camera.position.y - walkEyeHeight) / 3),
      standing = firstPerson
        ? nodes
            .filter(
              (node) =>
                node.floor === startFloor &&
                Math.hypot(node.x - camera.position.x, node.z - camera.position.z) < 0.5 &&
                walkthroughClear(node, {
                  floor: startFloor,
                  x: camera.position.x,
                  z: camera.position.z,
                }),
            )
            .toSorted(
              (a, b) =>
                Math.hypot(a.x - camera.position.x, a.z - camera.position.z) -
                Math.hypot(b.x - camera.position.x, b.z - camera.position.z),
            )[0]
        : undefined,
      start = standing || preferred.node;
    const shortest = async (origin) => {
        const distance = new Float64Array(nodes.length).fill(Infinity),
          previous = new Int32Array(nodes.length).fill(-1),
          edges = Array.from({ length: nodes.length }),
          heap = new TinyQueue([], (a, b) => a.cost - b.cost);
        distance[origin.id] = 0;
        heap.push({ cost: 0, id: origin.id });
        let visited = 0;
        while (heap.length > 0) {
          const next = heap.pop();
          if (next.cost !== distance[next.id]) {
            continue;
          }
          for (const edge of nodes[next.id].edges) {
            const cost = next.cost + edge.distance;
            if (cost < distance[edge.to]) {
              distance[edge.to] = cost;
              previous[edge.to] = next.id;
              edges[edge.to] = edge;
              heap.push({ cost, id: edge.to });
            }
          }
          visited += 1;
          if (visited % 2048 === 0) {
            await checkpoint();
          }
        }
        return { distance, edges, previous };
      },
      first = await shortest(start);
    for (const stop of stops) {
      if (!stop.node || !Number.isFinite(first.distance[stop.node.id])) {
        [stop.node] = nodes
          .filter((node) => inRoom(node, stop.room) && Number.isFinite(first.distance[node.id]))
          .toSorted(
            (a, b) =>
              Math.hypot(a.x - stop.room.centerX, a.z - stop.room.centerZ) -
              Math.hypot(b.x - stop.room.centerX, b.z - stop.room.centerZ),
          );
      }
    }
    const reachable = stops.filter(
        (stop) => stop.node && Number.isFinite(first.distance[stop.node.id]),
      ),
      skipped = stops.filter((stop) => !reachable.includes(stop)).map((stop) => stop.room.name),
      paths = new Map([[start.id, first]]);
    for (const stop of reachable) {
      if (!paths.has(stop.node.id)) {
        paths.set(stop.node.id, await shortest(stop.node));
      }
      await checkpoint();
    }
    const remaining = [...reachable],
      order = [];
    let current = start;
    while (remaining.length > 0) {
      const distances = paths.get(current.id).distance;
      remaining.sort((a, b) => distances[a.node.id] - distances[b.node.id]);
      const next = remaining.shift();
      order.push(next);
      current = next.node;
    }
    const routeCost = (route) =>
      route.reduce(
        (total, stop, index) =>
          total + paths.get(index ? route[index - 1].node.id : start.id).distance[stop.node.id],
        0,
      );
    let best = routeCost(order);
    for (let pass = 0; pass < 8; pass += 1) {
      let improved = false;
      for (let i = 0; i < order.length - 1; i += 1) {
        for (let j = i + 1; j < order.length; j += 1) {
          const candidate = [
              ...order.slice(0, i),
              ...order.slice(i, j + 1).toReversed(),
              ...order.slice(j + 1),
            ],
            cost = routeCost(candidate);
          if (cost < best - 0.01) {
            order.splice(0, order.length, ...candidate);
            best = cost;
            improved = true;
          }
        }
      }
      if (!improved) {
        break;
      }
    }
    const points = [eye(start)];
    current = start;
    for (const stop of order) {
      const path = paths.get(current.id),
        routeLegs = [];
      let { id } = stop.node;
      while (id !== current.id) {
        routeLegs.push({ edge: path.edges[id], from: nodes[path.previous[id]], to: nodes[id] });
        id = path.previous[id];
      }
      let straight = [current];
      const flush = () => {
        let index = 0;
        while (index < straight.length - 1) {
          let end = index + 1;
          while (
            end + 1 < straight.length &&
            walkthroughClear(straight[index], straight[end + 1])
          ) {
            end += 1;
          }
          points.push(eye(straight[end]));
          index = end;
        }
      };
      for (const leg of routeLegs.toReversed()) {
        if (leg.edge.via) {
          flush();
          points.push(...leg.edge.via.slice(1));
          straight = [leg.to];
        } else {
          straight.push(leg.to);
        }
      }
      flush();
      points.at(-1).room = stop.room.name;
      current = stop.node;
    }
    const distance = points
      .slice(1)
      .reduce(
        (total, point, i) =>
          total + Math.hypot(point.x - points[i].x, point.y - points[i].y, point.z - points[i].z),
        0,
      );
    return { distance, points, rooms: reachable.length, skipped, start, total: stops.length };
  }
  /* eslint-enable no-await-in-loop */ async function startWalkthrough() {
    if (walkthrough) {
      stopWalkthrough();
      return;
    }
    if (!currentProgram || editor.state.doc.toString() !== compiledSource) {
      showStatus("Compile a valid layout before starting a walkthrough", "warn");
      return;
    }
    walkthroughRun += 1;
    const run = walkthroughRun,
      button = $("walkthroughButton");
    walkthrough = { planning: true };
    button.textContent = "Cancel planning";
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    showStatus("Planning a short walking route through the property…");
    try {
      const plan = await planWalkthrough(run);
      if (run !== walkthroughRun) {
        return;
      }
      const previous = {
        ceilings: ceilingsCollapsed,
        terrain: terrainCutaway,
        walls: wallsCollapsed,
      };
      focusRoom = currentProgram.rooms.find(
        (room) =>
          room.floor === plan.start.floor &&
          Math.abs(room.centerX - plan.start.x) < (room.cols * currentProgram.grid) / 2 &&
          Math.abs(room.centerZ - plan.start.z) < (room.rows * currentProgram.grid) / 2,
      )?.name;
      setFirstPerson(true, plan.start);
      camera.position.set(plan.start.x, plan.start.floor * 3 + walkEyeHeight, plan.start.z);
      focusRoom = undefined;
      focusFloor = undefined;
      $("roomFocus").value = "";
      if (!terrainCutaway) {
        $("cutawayButton").click();
      }
      updateFloorVisibility();
      if (wallsCollapsed) {
        $("wallsButton").click();
      }
      if (ceilingsCollapsed) {
        $("ceilingsButton").click();
      }
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }
      pressedKeys.clear();
      walkthrough = Object.assign(plan, { index: 0, pause: 0, previous, visited: 0 });
      button.textContent = "Stop walkthrough";
      button.title = "Stop walkthrough (Esc or move to take control)";
      const coverage = `${plan.rooms}/${plan.total} areas · ${Math.round(plan.distance)} m`;
      showStatus(
        plan.skipped.length > 0
          ? `${coverage} · Unreachable: ${plan.skipped.map((name) => name.replaceAll("_", " ")).join(", ")}. Check doors and landings.`
          : `Walkthrough · ${coverage}`,
        plan.skipped.length > 0 ? "warn" : "ok",
      );
    } catch (error) {
      if (run === walkthroughRun) {
        stopWalkthrough();
        showStatus(error.message, "warn");
      }
    }
  }
  function advanceWalkthrough(delta) {
    const tour = walkthrough;
    if (!tour || tour.planning) {
      return;
    }
    renderDirty = true;
    if (tour.pause > 0) {
      tour.pause = Math.max(0, tour.pause - delta);
      camera.rotation.y += delta * 0.45;
      return;
    }
    const target = tour.points[tour.index];
    if (!target) {
      stopWalkthrough(
        `Walkthrough complete · ${tour.rooms}/${tour.total} areas · ${Math.round(tour.distance)} m${tour.skipped.length > 0 ? " · Some areas were unreachable" : ""}`,
      );
      return;
    }
    const destination = new THREE.Vector3(target.x, target.y, target.z),
      offset = destination.clone().sub(camera.position),
      distance = offset.length(),
      travel = Math.min(distance, delta * 1.15);
    if (distance > 0.001) {
      camera.position.addScaledVector(offset, travel / distance);
      const yaw = Math.atan2(-offset.x, -offset.z),
        turn = Math.atan2(Math.sin(yaw - camera.rotation.y), Math.cos(yaw - camera.rotation.y));
      camera.rotation.y += turn * Math.min(1, delta * 4);
      camera.rotation.x += (-0.08 - camera.rotation.x) * Math.min(1, delta * 3);
    }
    if (distance <= travel + 0.001) {
      tour.index += 1;
      if (target.room) {
        tour.visited += 1;
        tour.pause = 2.5;
        $("navigationHint").textContent =
          `${target.room.replaceAll("_", " ")} · ${tour.visited}/${tour.rooms} areas · Stop or Esc to take control`;
      }
    }
  }
  $("walkthroughButton").addEventListener("click", startWalkthrough);
  function indoorExposureTarget() {
    if (sceneBuilding) {
      return indoorExposureAdjustment;
    }
    if (
      !firstPerson ||
      !currentProgram ||
      $("sunExposureMode").value !== "adaptive" ||
      daylightStrength.value === 0
    ) {
      return 0;
    }
    const floor = Math.round((camera.position.y - walkEyeHeight) / 3),
      room = currentProgram.rooms.find(
        (area) =>
          area.kind === "room" &&
          area.floor === floor &&
          Math.abs(camera.position.x - area.centerX) < (area.cols * currentProgram.grid) / 2 &&
          Math.abs(camera.position.z - area.centerZ) < (area.rows * currentProgram.grid) / 2,
      );
    return room
      ? 0.85 * (1 - Math.min(1, (room.daylightAccess ?? 0) / 1.2)) * daylightStrength.value
      : 0;
  }
  let lastFrameTime = performance.now(),
    lastCameraChange = 0,
    detailActive = false;
  function animate(time = performance.now()) {
    requestAnimationFrame(animate);
    const delta = Math.min(0.05, Math.max(0, time - lastFrameTime) / 1000),
      blend = 1 - Math.exp(-Math.max(0, time - lastFrameTime) * 0.012);
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
    if (walkthrough && !walkthrough.planning) {
      advanceWalkthrough(delta);
    } else if (firstPerson && pressedKeys.size > 0) {
      const forward =
          Number(pressedKeys.has("w") || pressedKeys.has("arrowup")) -
          Number(pressedKeys.has("s") || pressedKeys.has("arrowdown")),
        sideways =
          Number(pressedKeys.has("d") || pressedKeys.has("arrowright")) -
          Number(pressedKeys.has("a") || pressedKeys.has("arrowleft")),
        direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      const movement = new THREE.Vector3(-direction.z, 0, direction.x)
        .multiplyScalar(sideways)
        .addScaledVector(direction, forward);
      if (movement.lengthSq() > 0) {
        moveFirstPerson(movement.normalize(), 2.6 * delta);
      }
    } else if (!firstPerson) {
      controls.update();
    }
    if (hoverOutline) {
      hoverOutline.update();
    }
    camera.updateMatrixWorld();
    if (
      lastView.elements.some(
        (value, index) => Math.abs(value - camera.matrixWorld.elements[index]) > 0.000001,
      )
    ) {
      renderDirty = true;
      lastView.copy(camera.matrixWorld);
      lastCameraChange = time;
    }
    if (renderDirty) {
      desiredIndoorExposureAdjustment = indoorExposureTarget();
    }
    const exposureAdapting =
      Math.abs(desiredIndoorExposureAdjustment - indoorExposureAdjustment) > 0.001;
    if (indoorExposureAdjustment !== desiredIndoorExposureAdjustment) {
      indoorExposureAdjustment +=
        (desiredIndoorExposureAdjustment - indoorExposureAdjustment) * blend;
      if (Math.abs(desiredIndoorExposureAdjustment - indoorExposureAdjustment) < 0.001) {
        indoorExposureAdjustment = desiredIndoorExposureAdjustment;
      }
      renderer.toneMappingExposure =
        baseCameraExposure * 2 ** (cameraExposureCompensation + indoorExposureAdjustment);
      renderDirty = true;
    }
    const moving = Boolean(currentProgram) && (time - lastCameraChange <= 180 || exposureAdapting);
    if (moving !== motionResolution) {
      motionResolution = moving;
      resize();
    }
    const detailReady = $("renderQuality").value !== "fast" && !moving;
    if (detailReady !== detailActive) {
      detailActive = detailReady;
      renderDirty = true;
    }
    if (renderDirty && currentProgram && !sceneBuilding && !document.hidden) {
      renderer.info.reset();
      const renderStarted = performance.now();
      renderDetail(detailActive);
      const stats = $("renderStats");
      stats.textContent = `${renderer.info.render.calls.toLocaleString()} draw calls · ${renderer.info.render.triangles.toLocaleString()} triangles · ${lastBuildTime.toFixed(0)} ms build`;
      stats.title = `${renderer.info.memory.geometries} geometries · ${renderer.info.memory.textures} textures · ${(performance.now() - renderStarted).toFixed(1)} ms CPU submission (not GPU frame time)`;
      renderDirty = false;
      renderProgress();
    }
  }
  animate();
  examples["Decor gallery"] = decorationExample;
  examples["Mediterranean three-level apartment"] = referenceApartment();
  examples["Mediterranean kitchen photo study"] = buildExample(
    "A compact kitchen and shaded garden terrace, staged from 367513251 and 367513499.\n# Estimated proportions: 3.85 x 5.5 m kitchen, not a surveyed reconstruction.\n# First person restores the ceiling; Balanced and High add contact occlusion. Use Save view to export a clean PNG.",
    0.55,
    [
      {
        cols: 7,
        doors: ["south"],
        height: 2.7,
        items: [
          [6, 4, "kitchenette(baskets_on_top)~east"],
          [6, 1, "retro_fridge~east"],
          [6, 8, "fireplace[1.15x0.55x2.7]~east"],
          [0, 5, "sofa_bed~west"],
          [2, 7, "woven_chair@-25"],
          [0, 9, "side_table(books_on_top)"],
          [5, 4, "kilim_rug@90"],
          [1, 1, "breakfast_bar[1.2x0.4x1.05](tea_on_top)~west"],
          [2, 1, "woven_chair@90[0.55x0.6x0.85]"],
          [1, 8, "accent_chair@25[0.6x0.7x0.86]"],
          [3, 9, "curtain_pair@180[1.9x0.18x2.5]"],
        ],
        mounts: [
          ["east", 8, "wall_tv"],
          ["west", 2, "botanical_print"],
          ["west", 7, "wall_shelf"],
        ],
        name: "photo_kitchen",
        rows: 10,
        style: "mediterranean",
        surface: "tile",
        walls: ["north", "east", "south", "west"],
        windows: ["west"],
        x: 0,
        z: 0,
      },
      {
        cols: 7,
        items: [
          [3, 1, "awning[3.65x2.5x2.65]"],
          [3, 2, "dining_table[1.35x0.75x0.75](tea_on_top)"],
          [2, 0, "patio_chair"],
          [4, 0, "patio_chair"],
          [2, 4, "patio_chair@180"],
          [4, 4, "patio_chair@180"],
          [3, 4, "archway[3.65x0.25x2.7]"],
          [0, 4, "terracotta_pot"],
          [6, 4, "terracotta_pot"],
        ],
        kind: "balcony",
        name: "photo_terrace",
        rails: ["west", "east"],
        rows: 5,
        style: "mediterranean",
        surface: "stone",
        walls: [],
        x: 0,
        z: 10,
      },
      {
        cols: 7,
        items: [
          [1, 2, "cypress[0.9x0.9x3]"],
          [5, 3, "citrus_tree[1.6x1.6x2.5]"],
          [1, 6, "olive_tree[1.6x1.6x2.5]"],
          [3, 4, "stone_path[0.8x4x0.04]"],
          [0, 4, "hedge[0.35x4.4x1.3]"],
          [6, 4, "hedge[0.35x4.4x1.3]"],
          [3, 1, "flower_border[1.1x0.4x0.55]"],
          [4, 7, "flower_border[1.1x0.4x0.55]"],
          [2, 4, "globe_lamp[0.35x0.35x1.1]"],
          [4, 6, "globe_lamp[0.35x0.35x1.1]"],
        ],
        kind: "garden",
        name: "photo_garden",
        rails: [],
        rows: 8,
        style: "mediterranean",
        surface: "grass",
        walls: [],
        x: 0,
        z: 15,
      },
    ],
    { baskets: ["wicker_basket | wicker_basket"], books: ["book_stack"], tea: ["cafe_setting"] },
  );
  examples["Mediterranean asset study"] = buildExample(
    "Reusable details from the photo references. Hover an object to find its source token.\n# Rotate with @degrees; resize with [widthxdepthxheight]; append ~north/east/south/west to attach to a wall.\n# HEIGHT changes room clearance; sleeping_loft is a visual assembly, not a navigable floor.",
    1,
    [
      {
        cols: 39,
        items: [
          "tufted_sofa",
          "bathroom_vanity",
          "frameless_shower",
          "sea_table",
          "ochre_table",
          "wall_spot_pair",
          "citrus_print",
          "coastal_print",
          "accent_chair",
          "botanical_print",
          "ceramic_vessels",
          "wall_tv",
          "wall_outlet",
          "roman_blind",
          "citrus_bowl",
          "linen_throw",
          "book_stack",
          "sleeping_loft",
          "canopy_bed",
          "kitchenette",
          "retro_fridge",
          "archway",
          "awning",
          "patio_chair",
          "ceiling_fan",
          "roller_shutter",
          "ac_condenser",
          "slatted_table",
          "woven_chair",
          "globe_lamp",
          "topiary_tree",
          "palm",
          "wicker_basket",
          "kilim_rug",
          "dumbbells",
          "shower_set",
          "floor_drain",
          "breakfast_bar",
          "cafe_setting",
          "curtain_pair",
          "flower_border",
          "kitchen_accessories",
          "towel_rail",
          "grape_trellis",
          "timber_wardrobe",
          "linen_bench",
          "linen_pouf",
          "terracotta_urn",
          "jute_rug",
          "bolster",
          "bougainvillea",
          "wall_coat_hooks",
        ].map((name, index) => [3 + (index % 7) * 5, 2 + Math.floor(index / 7) * 5, name]),
        kind: "balcony",
        name: "reference_details",
        rails: [],
        rows: 39,
        style: "mediterranean",
        surface: "tile",
        walls: ["north", "west"],
        x: 0,
        z: 0,
      },
    ],
  );
  examples["Warm modern apartment"] = buildExample(
    "Soft upholstery, bent timber dining chairs and woven lighting.\n# Click furniture to change its asset, dimensions or rotation; edits can be undone with Ctrl/Cmd+Z.",
    0.9,
    [
      {
        cols: 8,
        doors: ["east", "south"],
        items: [
          [3, 2, "modular_sofa"],
          [3, 4, "coffee_table(books_on_top)"],
          [3, 3, "jute_rug[2.5x1.9x0.018]"],
          [5, 6, "round_dining_table"],
          [4, 6, "wishbone_chair@90"],
          [6, 6, "wishbone_chair@270"],
          [5, 5, "wishbone_chair"],
          [5, 7, "wishbone_chair@180"],
          [1, 1, "plant"],
          [6, 1, "console_table~north"],
        ],
        lights: [
          { name: "woven_pendant", power: 12, x: 5, z: 6 },
          { name: "downlight", power: 10, x: 1.5, z: 2 },
          { name: "downlight", power: 10, x: 6, z: 3 },
        ],
        mounts: [["west", 5, "arched_mirror"]],
        name: "living_dining",
        rows: 8,
        style: "neutral",
        surface: "wood",
        walls: ["north", "east", "south", "west"],
        windows: ["north", "west"],
        x: 0,
        z: 0,
      },
      {
        cols: 8,
        doors: ["west"],
        items: [
          [3, 2, "upholstered_bed~north"],
          [1, 1, "nightstand(lamp_on_top)~north"],
          [5, 1, "nightstand(lamp_on_top)~north"],
          [3, 5, "linen_bench"],
          [6, 2, "timber_wardrobe~east"],
          [1, 6, "plant"],
          [6, 6, "linen_pouf"],
          [3, 3, "jute_rug[2.4x2.2x0.018]"],
        ],
        lights: [
          { name: "woven_pendant", power: 12, x: 3, z: 5 },
          { name: "downlight", power: 8, x: 1.5, z: 5 },
          { name: "downlight", power: 8, x: 5.5, z: 5 },
        ],
        mounts: [["south", 1, "arched_mirror"]],
        name: "soft_bedroom",
        rows: 8,
        style: "neutral",
        surface: "wood",
        walls: ["north", "east", "south", "west"],
        windows: ["north", "east"],
        x: 8,
        z: 0,
      },
    ],
    { books: ["book_stack"], lamp: ["ceramic_table_lamp"] },
  );
  for (const name of Object.keys(examples)) {
    examples[name] = enrichExample(examples[name], parseProgram, name);
  }
  const exampleGroups = {
    "Apartments and open plans": [
      "Warm modern apartment",
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
      "Mediterranean asset study",
      "Mediterranean kitchen photo study",
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
  function floorLabel(floor) {
    return `${floor < 0 ? `Basement ${-floor}` : floor === 0 ? "Ground floor" : `Upper floor ${floor}`} · ${floor * 3} m`;
  }
  $("cutawayButton").addEventListener("click", (event) => {
    terrainCutaway = !terrainCutaway;
    event.currentTarget.classList.toggle("active", terrainCutaway);
    event.currentTarget.setAttribute("aria-pressed", String(terrainCutaway));
    updateFloorVisibility();
  });
  function loadExample(name) {
    clearTimeout(compileTimer);
    editor.setState(editorState(examples[name]));
    updateFoldButton(editor.state);
    focusRoom = undefined;
    focusFloor = undefined;
    select.value = name;
    const presets = photoViews[name] || [];
    $("photoView").replaceChildren(
      new Option("Photo views…", ""),
      ...presets.map((preset, index) => new Option(preset.label, String(index))),
    );
    $("photoView").hidden = presets.length === 0;
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
    indicateGroup(group);
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
    if (assetBrowser.open) {
      return;
    }
    const shortcutKey = event.key.toLowerCase();
    if (
      !editor.hasFocus &&
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      !event.target.closest("input, textarea, [contenteditable]")
    ) {
      const command =
        shortcutKey === "z"
          ? event.shiftKey
            ? redo
            : undo
          : shortcutKey === "y" && event.ctrlKey
            ? redo
            : undefined;
      if (command && command(editor)) {
        event.preventDefault();
        return;
      }
    }
    if (
      walkthrough &&
      (event.key === "Escape" ||
        (!editor.hasFocus &&
          ["w", "a", "s", "d", "e", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
            event.key.toLowerCase(),
          )))
    ) {
      stopWalkthrough();
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }
    }
    if (event.target.closest(".sun-settings, input, select, button")) {
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
  function pressTouchMovement(event) {
    if (!firstPerson) {
      return;
    }
    stopWalkthrough();
    event.preventDefault();
    const button = event.currentTarget;
    button.setPointerCapture(event.pointerId);
    pressedKeys.add(button.dataset.walkKey);
  }
  function releaseTouchMovement(event) {
    pressedKeys.delete(event.currentTarget.dataset.walkKey);
  }
  for (const button of document.querySelectorAll("[data-walk-key]")) {
    button.addEventListener("pointerdown", pressTouchMovement);
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(name, releaseTouchMovement);
    }
  }
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
  function syncCeilingButton() {
    const button = $("ceilingsButton");
    button.title = ceilingsCollapsed ? "Restore all ceilings" : "Collapse all ceilings";
    button.setAttribute("aria-label", button.title);
    button.classList.toggle("active", ceilingsCollapsed);
    button.setAttribute("aria-pressed", String(ceilingsCollapsed));
  }
  $("ceilingsButton").addEventListener("click", () => {
    ceilingsCollapsed = !ceilingsCollapsed;
    clearHover();
    syncCeilingButton();
    requestRender();
  });
  $("topButton").addEventListener("click", () => resetCamera(true));
  $("firstPersonButton").addEventListener("click", () => setFirstPerson(!firstPerson));
  $("roomFocus").addEventListener("change", (event) => {
    focusRoom = event.target.value || undefined;
    focusFloor = currentProgram.rooms.find((room) => room.name === focusRoom)?.floor;
    focusCamera();
  });
  $("floorFocus").addEventListener("change", (event) => {
    focusFloor = event.target.value === "" ? undefined : Number(event.target.value);
    focusRoom = undefined;
    $("roomFocus").value = "";
    focusCamera();
  });
  $("resetButton").addEventListener("click", () => {
    focusRoom = undefined;
    $("roomFocus").value = "";
    focusFloor = undefined;
    updateFloorVisibility();
    resetCamera();
  });
  $("saveViewButton").addEventListener("click", () => {
    motionResolution = false;
    resize();
    camera.updateMatrixWorld();
    renderer.info.reset();
    renderDetail();
    try {
      const link = document.createElement("a");
      link.href = renderer.domElement.toDataURL("image/png");
      link.download = "interior-view.png";
      document.body.append(link);
      link.click();
      link.remove();
      showStatus("View saved as PNG");
    } catch {
      showStatus("Could not save this view", "error");
    }
  });
  $("fullscreenButton").hidden = !viewport.requestFullscreen;
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
    if (walkthrough) {
      stopWalkthrough();
    }
    selectionPointer = { x: event.clientX, y: event.clientY };
    if (firstPerson && event.button === 0) {
      looking = true;
      lastPointer = { x: event.clientX, y: event.clientY };
      renderer.domElement.requestPointerLock?.()?.catch(() => false);
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
    if (!firstPerson && event.buttons === 0) {
      hoverObject(event);
    }
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
    loadExample(
      examples[requestedExample] ? requestedExample : "Mediterranean three-level apartment",
    );
  } else {
    editor.setState(editorState(sharedSource));
    updateFoldButton(editor.state);
    select.value = "custom";
    compile(true);
  }
  loadSurfaceScans();
})().catch((_error) => {
  document.querySelector("#renderProgress")?.setAttribute("hidden", "");
  document.querySelector("#viewport")?.setAttribute("aria-busy", "false");
  const message = document.querySelector("#message span:last-child");
  if (message) {
    message.textContent = "Could not load the editor or 3D libraries. Check your connection.";
    message.parentElement.hidden = false;
    message.parentElement.className = "message error";
  }
});
