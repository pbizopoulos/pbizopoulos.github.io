/* eslint-disable oxc/no-rest-spread-properties, no-underscore-dangle, max-classes-per-file, unicorn/no-null, new-cap, unicorn/max-nested-calls, max-lines, max-lines-per-function, prefer-named-capture-group, no-magic-numbers, id-length, max-statements, max-params, complexity, max-depth, one-var, sort-vars, func-style, no-use-before-define, unicorn/consistent-function-scoping, no-ternary, no-nested-ternary, unicorn/no-nested-ternary, init-declarations, no-undefined, no-continue, unicorn/no-array-for-each, oxc/no-optional-chaining, oxc/no-async-await, unicorn/prefer-top-level-await */ const createLayoutCore =
  function createLayoutCore() {
    const catalog = {
        aabenraa_table: [1.2, 0.8, 0.75],
        ac_condenser: [0.82, 0.36, 0.62],
        accent_chair: [0.72, 0.8, 0.86],
        air_conditioner: [1.02, 0.22, 0.31],
        air_quality_sensor: [0.09, 0.04, 0.1],
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
        builtin_wardrobe: [1.5, 0.48, 2.5],
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
        cooker_hood: [0.6, 0.43, 0.196],
        curtain_pair: [1.8, 0.18, 2.5],
        cypress: [1.2, 1.2, 3.5],
        desk: [1.35, 0.7, 0.75],
        dining_table: [1.55, 0.9, 0.75],
        double_awning: [4.4, 1.48, 0.42],
        downlight: [0.22, 0.22, 2.7],
        dresser: [1.03, 0.49, 0.92],
        dumbbells: [0.85, 0.48, 0.32],
        elevator: [1.6, 1.6, 3],
        filing_cabinet: [0.48, 0.55, 0.68],
        fireplace: [1.35, 0.65, 2.6],
        floating_tv_console: [1.35, 0.316, 0.25],
        floor_drain: [0.18, 0.18, 0.015],
        flower_border: [2.4, 0.65, 0.65],
        fluorescent_light: [1.2, 0.3, 2.7],
        folding_chair: [0.5, 0.58, 0.88],
        folding_table: [0.65, 0.65, 0.71],
        fountain: [1.8, 1.8, 1.5],
        frameless_shower: [0.9, 0.95, 2.05],
        fridge: [0.73, 0.7, 1.82],
        garden_lamp: [0.22, 0.22, 0.9],
        garden_steps: [1.5, 1.5, 0.6],
        garment_rack: [1.05, 0.5, 1.7],
        globe_lamp: [0.42, 0.42, 1.65],
        grape_trellis: [2.4, 0.4, 2.5],
        grey_armchair: [0.66, 0.68, 0.84],
        grey_sofa: [1.54, 0.84, 0.85],
        guitar: [0.37, 0.12, 1],
        gym_bench: [0.65, 1.45, 1.1],
        gym_mat: [1.8, 1.2, 0.025],
        hedge: [2, 0.65, 1.7],
        hogsten_chair: [0.73, 0.65, 0.83],
        hot_tub: [2.2, 2.2, 0.85],
        hydroponic_rack: [1.8, 0.7, 2],
        jute_rug: [2, 1.4, 0.018],
        kilim_rug: [1.4, 0.8, 0.015],
        kitchen_accessories: [0.65, 0.32, 0.42],
        kitchen_cabinet: [0.6, 0.6, 0.9],
        kitchen_chair: [0.52, 0.51, 0.79],
        kitchen_counter: [1.48, 0.62, 0.9],
        kitchen_island: [1.55, 0.85, 0.91],
        kitchen_table: [1.52, 0.86, 0.75],
        kitchenette: [2.4, 0.65, 2.25],
        lamp: [0.4, 0.4, 1.48],
        lantern: [0.3, 0.3, 0.5],
        laptop: [0.304, 0.2, 0.2],
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
        pedestal_fan: [0.41, 0.36, 1.2],
        pendant_light: [0.5, 0.5, 2.7],
        piano: [1.5, 0.65, 1.2],
        pillow: [0.38, 0.3, 0.1],
        pitsos_fridge: [0.6, 0.66, 1.86],
        plant: [0.48, 0.48, 1.12],
        planter: [1.05, 0.34, 0.46],
        plate: [0.26, 0.26, 0.025],
        pool: [5.6, 3.4, 0.85],
        poster: [0.6, 0.025, 0.85],
        radiator: [0.9, 0.12, 0.6],
        retaining_wall: [2.4, 0.3, 0.65],
        retracted_double_awning: [4.4, 0.16, 0.18],
        retracted_side_awning: [0.12, 0.12, 1.85],
        retro_fridge: [0.6, 0.64, 1.55],
        robot_vacuum: [0.35, 0.35, 0.095],
        roller_shutter: [1.8, 0.18, 2.5],
        roman_blind: [1.6, 0.12, 1.5],
        round_coffee_table: [0.8, 0.8, 0.4],
        round_dining_table: [1.2, 1.2, 0.75],
        rug: [1.55, 1.15, 0.025],
        sculpture: [0.9, 0.9, 1.8],
        sea_table: [0.46, 0.46, 0.5],
        server_rack: [0.8, 0.9, 2.1],
        shoe_rack: [0.9, 0.32, 0.48],
        shower: [0.93, 0.93, 2.05],
        shower_set: [0.5, 0.2, 1.9],
        side_awning: [1.44, 0.12, 1.85],
        side_table: [0.48, 0.48, 0.54],
        sideboard: [1.38, 0.48, 0.83],
        single_bed: [0.9, 2, 0.56],
        sink: [1.08, 0.62, 0.9],
        slatted_table: [0.85, 0.85, 0.75],
        sleeping_loft: [3.4, 3.6, 3.35],
        sofa: [1.75, 0.82, 0.78],
        sofa_bed: [1.9, 0.85, 0.85],
        solar_panel: [1.8, 1.2, 0.8],
        stairs: [1.2, 3.6, 3],
        stone_path: [1.2, 3, 0.04],
        stove: [0.64, 0.65, 0.88],
        suitcase: [0.4, 0.25, 0.65],
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
        usb_charger: [0.035, 0.028, 0.065],
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
        water_bottle: [0.09, 0.09, 0.3],
        water_glass: [0.085, 0.085, 0.12],
        watering_hose: [0.45, 0.45, 0.09],
        wicker_basket: [0.5, 0.36, 0.3],
        wishbone_chair: [0.55, 0.55, 0.8],
        woven_chair: [0.68, 0.75, 0.85],
        woven_pendant: [0.58, 0.58, 2.7],
      },
      examples = {
        Apartment: [
          'DETAIL project "Bedroom, balcony, living room, kitchen, guitar room and bathroom."',
          'DETAIL project "Map layout: room1 guitar room, room2 balcony, room3 living room/kitchen, room4 bedroom; bathroom at the top."',
          'DETAIL project "Scaled to approximately 62 m² indoors, excluding the balcony; balcony depth 1.56 m."',
          'DETAIL project "Map proportions are approximate, not a measured floor plan."',
          'DETAIL project "Furniture dimensions and shapes follow product references, with simplified geometry."',
          'DETAIL bedroom "Structure mattress: 26 cm high, 160×200 cm based on GRUSNARV; bed base is approximate."',
          'DETAIL project "Recesses follow the scanned outline and may represent walls or obstacles."',
          'DETAIL living "LIVING ROOM — GEDVED, UDSBJERG, Sharp 50FN2EL, Aristo, LG, Xiaomi S10."',
          'DETAIL living "Aristo: wall mounted, 135×31.6×25 cm; approximate bottom height 45 cm."',
          'DETAIL living "HAMA 220810 TV bracket" <https://web.archive.org/web/20260727101442/https://www.public.gr/product/tileoraseis/accessories-vision/baseis-tileoraseon/basi-tileorasis-epitoixia-hama-220810-me-klisi-32--65-eos-35-kg/1904844>',
          'DETAIL living "KITCHEN — Franke CA 52 M XS, Primato USA2GB12, Pitsos PKNB36NLE0."',
          'DETAIL living "Franke cooker hood" <https://web.archive.org/web/20260908154209/https://www.franke.com/gr/el/home-solutions/%CF%80%CF%81%CE%BF%CF%8A%CF%8C%CE%BD%CF%84%CE%B1/%CE%B1%CF%80%CE%BF%CF%81%CF%81%CE%BF%CF%86%CE%B7%CF%84%CE%AE%CF%81%CE%B5%CF%82/product-detail-page.html/315.0532.375.html>',
          'DETAIL living "GEYSER ARAGON EH replacement filter" <https://web.archive.org/web/20260727095943/https://www.skroutz.gr/s/24636659/Geyser-Antallaktiko-Filtro-Nerou-Ano-kai-Kato-Pagou-10-Aragon-EH-0-1-mm.html>',
          'DETAIL bedroom "BEDROOM — Grecostrom Structure."',
          'DETAIL bedroom "GRUSNARV mattress protector" <https://web.archive.org/web/20260823115455/https://www.ikea.gr/proioda/grusnarv-adiabroxo-prostateytiko-strwmatos-160x200-cm/60522129/>',
          'DETAIL study "GUITAR ROOM — Dell XPS 13 9343, classical guitar, clothes, suitcase and backpacks."',
          'DETAIL study "VATTENKAR 52×26 cm used as a shelf, with an approximate bottom height of 1.20 m."',
          'DETAIL study "No desk; the stand is used as a shelf."',
          'DETAIL bathroom "BATHROOM — washing machine (manual), Drop Gusto Wood Cut 60 cm mirror."',
          'DETAIL balcony "BALCONY — HÖGSTEN, SUNDSÖ, FRÖSÖN/DUVHOLMEN."',
          'DETAIL balcony "FRÖSÖN/DUVHOLMEN outdoor chair cushion" <https://www.ikea.gr/proioda/froson-duvholmen-maksilari-kareklas-ekswterikoy-xwroy/89291326/>',
          'DETAIL bedroom "ALPSTUGA" <https://web.archive.org/web/20260823111634/https://www.ikea.gr/en/products/alpstuga-smart-air-quality-sensor/50604187/>',
          'DETAIL bedroom "SMAHAGEL" <https://web.archive.org/web/20260823111932/https://www.ikea.com/ee/en/p/smahagel-1-port-usb-charger-white-10544077/>',
          "GRID 0.37419692305371843",
          "ROOM living 15x13 AT 0,9",
          'LABEL "Living room / kitchen" AT 4,8',
          "OUTLINE 0,0 15,0 15,13 3,13 3,11 0,11",
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE wood",
          "PASSAGE south AT 1.5 WIDTH 1.1",
          "PASSAGE west AT 12 WIDTH 0.7483938461074369",
          "SHUTTER east FULL",
          "MOUNT east 6 curtain_pair[4.82355999969834x0.12x2.16] HEIGHT 0",
          "MOUNT north 7 floating_tv_console[1.35x0.316x0.25]<https://web.archive.org/web/20260721131723/https://www.megapap.com/epiplo-tileorasis-epitoixio-aristo-megapap-me-led-xroma-sapphire-oak-135x31-6x25ek-el> HEIGHT 0.45",
          "MOUNT north 7 wall_tv[1.1164x0.0915x0.6513]<https://web.archive.org/web/20260727101118/https://www.public.gr/product/tileoraseis/tileoraseis/tileorasi-sharp-led-50-4k-android-50fn2el/1771820>",
          "MOUNT east 1.5 air_conditioner<https://web.archive.org/web/20260721145901/https://gscs-b2c.lge.com/open/downloadFile?fileId=KROWM000067734.pdf> HEIGHT 2.28",
          "MOUNT south 6 cooker_hood<https://web.archive.org/web/20260908154209/https://www.franke.com/gr/el/home-solutions/%CF%80%CF%81%CE%BF%CF%8A%CF%8C%CE%BD%CF%84%CE%B1/%CE%B1%CF%80%CE%BF%CF%81%CF%81%CE%BF%CF%86%CE%B7%CF%84%CE%AE%CF%81%CE%B5%CF%82/product-detail-page.html/315.0532.375.html> HEIGHT 1.6",
          "LIGHT downlight AT 7,6 POWER 6",
          "LIGHT downlight AT 8,6 POWER 6",
          "LIGHT downlight AT 9,6 POWER 6",
          "LIGHT downlight AT 2,6 POWER 6",
          "MOUNT west 1 wall_lamp HEIGHT 2.1",
          "MOUNT west 9 wall_lamp HEIGHT 2.1",
          "MOUNT north 13 radiator HEIGHT 0.15",
          "MOUNT south 7.3 kitchen_cabinet[0.35x0.6x0.9] HEIGHT 0",
          "MOUNT south 11.594849277072225 kitchen_cabinet[0.9x0.6x0.9] HEIGHT 0",
          "MOUNT south 3.850477244358109 kitchen_cabinet[0.9686892306880147x0.6x0.9] HEIGHT 0",
          "MOUNT south 4.28 kitchen_cabinet[0.55x0.32x0.7] HEIGHT 1.55",
          "MOUNT south 6 kitchen_cabinet[0.6x0.32x0.55] HEIGHT 2.02",
          "MOUNT south 8.5 kitchen_cabinet[0.6x0.32x0.7] HEIGHT 1.55",
          "MOUNT south 10.15 kitchen_cabinet[0.6x0.32x0.7] HEIGHT 1.55",
          "ROOM passage 5x2.5 AT 0,6.5",
          'LABEL "Passage" AT 2.5,1.25',
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE wood",
          "PASSAGE south AT 2.5 WIDTH 1.55",
          "ROOM study 10x7 AT 5,2",
          'LABEL "Guitar room" AT 6,6',
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE wood",
          "DOOR west AT 5.75 WIDTH 0.85",
          "SHUTTER east FULL",
          "MOUNT east 3 curtain_pair[2.578378461376029x0.12x2.16] HEIGHT 0",
          "MOUNT south 2 wall_shelf(laptop_on_top)[0.52x0.26x0.08]<https://web.archive.org/web/20260721132156/https://www.ikea.gr/en/products/vattenkar-laptop-monitor-stand-52x26-cm/80541565/> HEIGHT 1.2",
          "MOUNT south 8 radiator[0.8x0.12x0.6] HEIGHT 0.15",
          "LIGHT ceiling_light AT 5,3 POWER 12",
          "ROOM bathroom 6x7.5 AT -1,-1",
          'LABEL "Bathroom" AT 4.2,5',
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE tile",
          "DOOR south AT 2.9 WIDTH 0.65",
          "MOUNT east 3.5 radiator[0.28x0.1x0.55] HEIGHT 0.15",
          "MOUNT west 4.1 mirror[0.45x0.045x0.6]<https://www.praktiker.gr/p/kathreptis-epiplou-mpaniou-drop-gusto-wood-cut-60cm-77029> HEIGHT 1.2",
          "MOUNT west 4.1 wall_lamp[0.45x0.16x0.12] HEIGHT 1.95",
          "ROOM bedroom 12.875x8 AT 2.125,22",
          'LABEL "Bedroom" AT 7.375,1.1',
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE wood",
          "OUTLINE 0.875,0 12.875,0 12.875,8 2.875,8 2.5,7.25 1.5,7.75 0,4.75 1,4.25 0.875,4",
          "DOOR west AT 2.5 WIDTH 0.8",
          "SHUTTER east FULL",
          "MOUNT east 3.5 curtain_pair[2.9525753844297475x0.12x2.16] HEIGHT 0",
          "MOUNT west 5.75 builtin_wardrobe[1.2x0.3983648784596863x2.5] HEIGHT 0",
          "MOUNT south 11 radiator[0.8x0.12x0.6] HEIGHT 0.15",
          "LIGHT ceiling_light AT 8,4 POWER 12",
          "ROOM hall 6x6 AT -3,20",
          "WALLS north east south west",
          "DOORS none",
          "WINDOWS none",
          "SURFACE wood",
          "OUTLINE 3,0 6,0 6,6 3,6 3,5 1,6 0,5.25 0,2.75 1,2 3,2",
          "DOOR west AT 4 WIDTH 0.8",
          "MOUNT north 1.5 wall_coat_hooks[0.65x0.12x0.3] HEIGHT 1.45",
          "BALCONY balcony 4.168927919741478x28 AT 15,2",
          'LABEL "Balcony" AT 2.25,4',
          "WALLS west south",
          "DOORS none",
          "WINDOWS none",
          "SURFACE tile",
          "RAILS north east",
          "RAILING horizontal silver SPACING 1.5",
          "MOUNT west 7.5 retracted_double_awning HEIGHT 2.42",
          "MOUNT west 19.5 retracted_double_awning HEIGHT 2.42",
          "MOUNT north 0.2 retracted_side_awning HEIGHT 0.75",
          "LAYOUT living",
          ". | . | . | . | . | . | robot_vacuum~north<https://web.archive.org/web/20260721124503/https://www.mistore-greece.gr/xiaomi-hellas/media/xiaomi-greece/manuals/Smart%20Devices/Mi_Robot_Vacuum_15_10.pdf>",
          ". | . | . | . | . | . | . | . | . | . | kitchen_chair[0.52x0.51x0.79]@0<https://web.archive.org/web/20260721133228/https://jysk.gr/trapezaria/karekles-trapezarias/karekla-trapezarias-hvidovre-fysiki-drys-mayro-yfasma> | . | kitchen_chair[0.52x0.51x0.79]@0<https://web.archive.org/web/20260721133228/https://jysk.gr/trapezaria/karekles-trapezarias/karekla-trapezarias-hvidovre-fysiki-drys-mayro-yfasma> | . | .",
          ".",
          ".",
          ". | . | . | . | grey_armchair[0.66x0.68x0.84]@35<https://web.archive.org/web/20260721133830/https://jysk.gr/kathistiko/polythrones/polythrona-udsbjerg-gkri-yfasma-drys> | . | . | . | . | . | . | aabenraa_table(tableware_on_top)[1.5x1x0.75]@0<https://web.archive.org/web/20260721133032/https://jysk.gr/trapezaria/trapezia-trapezarias/trapezi-trapezarias-aabenraa-80x120-hromatism-th-drys-mayro?search_category=auto_suggestion&query=aabenraa>",
          ". | . | . | . | . | . | . | round_coffee_table",
          ".",
          ". | . | . | . | . | . | . | . | . | . | kitchen_chair[0.52x0.51x0.79]@180<https://web.archive.org/web/20260721133228/https://jysk.gr/trapezaria/karekles-trapezarias/karekla-trapezarias-hvidovre-fysiki-drys-mayro-yfasma> | . | kitchen_chair[0.52x0.51x0.79]@180<https://web.archive.org/web/20260721133228/https://jysk.gr/trapezaria/karekles-trapezarias/karekla-trapezarias-hvidovre-fysiki-drys-mayro-yfasma> | . | .",
          ". | . | . | . | . | . | . | grey_sofa[1.54x0.84x0.85]@180<https://jysk.gr/kathistiko/kanapedes/2-thesios-kanapes-gedved-anoihto-gkri-yfasma>",
          ".",
          ".",
          ".",
          ". | . | . | . | . | . | stove[0.6x0.6x0.88]~south<https://manuall.gr/franke-ca-52-m-xs-fournos/> | . | . | sink[0.9x0.6x0.9]~south<https://web.archive.org/web/20260727095439/https://www.primato.gr/products/water-filters/under-sink/usa2gb12-en.html?selected_section=product_reviews&page=2> | . | . | . | . | pitsos_fridge[-0.15,0]~south<https://web.archive.org/web/20260721125409/https://media3.bsh-group.com/Documents/9001805015_B.pdf>",
          "END",
          "LAYOUT study",
          ". | . | . | . | . | . | . | . | wardrobe[1.1x0.56x2.4][-0.009,0]~north",
          "single_bed~west",
          ".",
          ".",
          ".",
          ".",
          ". | . | . | . | . | . | guitar~south",
          "END",
          "LAYOUT bathroom",
          ". | . | . | toilet[0.32x0.68x0.8]~north",
          ".",
          "washing_machine[0.6x0.6x0.85][0,0.2]~west<https://web.archive.org/web/20260721130831/https://media3.bsh-group.com/Documents/9000129660_A.pdf>",
          ".",
          "bathroom_vanity[0.45x0.3x0.85][0,0.03741969230537184]~west",
          ".",
          ". | . | . | . | . | frameless_shower[0.7x0.8x2.05][0,0.00419692305371843]~east",
          "END",
          "LAYOUT bedroom",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ". | . | . | . | . | . | . | bed[1.6x2x0.56]~south<https://web.archive.org/web/20260721124835/https://grecostrom.gr/app/uploads/2024/03/BODYTOPIA_CATALOGUE.pdf>",
          "END",
          "LAYOUT balcony",
          ".",
          ". | . | ac_condenser@0<https://web.archive.org/web/20260721145901/https://gscs-b2c.lge.com/open/downloadFile?fileId=KROWM000067734.pdf>",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ".",
          ". | hogsten_chair(hose_underneath)[0.73x0.65x0.83][-0.12,0]<https://web.archive.org/web/20260727191836/https://www.ikea.com/jo/en/p/hoegsten-chair-with-armrests-outdoor-white-20209862/>",
          ".",
          ".",
          ". | folding_table[0.65x0.65x0.71][-0.12,0]<https://web.archive.org/web/20260724170149/https://www.ikea.gr/proioda/sundso-trapezi-ekswterikoy-xwroy-65x65-cm/80575560/>",
          ".",
          ".",
          ". | hogsten_chair[0.73x0.65x0.83]@180[-0.12,0]<https://web.archive.org/web/20260727191836/https://www.ikea.com/jo/en/p/hoegsten-chair-with-armrests-outdoor-white-20209862/>",
          ".",
          ".",
          ".",
          ".",
          "END",
          "LAYOUT hose",
          "watering_hose",
          "END",
          "LAYOUT passage",
          ".",
          ".",
          "END",
          "LAYOUT hall",
          ".",
          ".",
          ".",
          ".",
          ".",
          ". | . | . | . | shoe_rack[0.6x0.25x0.48]~south",
          "END",
          "LAYOUT tableware",
          "plate<https://www.ikea.gr/proioda/fargklar-piato-mat-4-tem-26-cm/70479644/> | water_bottle<https://www.e-jumbo.gr/kouzina/potiria-boukalia-koupes/gyalina-boukalia-nerou/boukalia-vidota/boukalia-vidota-diafana/boukali-nerou-gyalino-kymatisto-schedio-metalliko-kapaki-1.25lt_1642315/> | water_glass<https://www.ikea.com/lt/en/p/ikea-365-glass-clear-glass-60279711/>",
          "END",
          "LAYOUT laptop",
          "laptop<https://web.archive.org/web/20260422013443/https://dl.dell.com/manuals/all-products/esuprt_laptop/esuprt_xps_laptop/xps-13-9343-laptop_reference%20guide_en-us.pdf>",
          "END",
        ].join("\n"),
        Bedroom: [
          'DETAIL project "Bedroom: 3.5 × 4 m. GRID is metres per cell."',
          'DETAIL project "Furniture: asset[width x depth x height]~wall<product URL>."',
          'DETAIL project "Links are product references; the renderer uses generic shapes."',
          "GRID 0.5",
          "ROOM main 7x8 AT 0,0",
          "WALLS north east south west",
          "DOORS south",
          "WINDOWS north",
          "SURFACE wood",
          "MOUNT east 4 mirror",
          "LIGHT ceiling_light AT 3,4 POWER 18",
          "LAYOUT main",
          ". | . | . | . | . | . | .",
          ". | . | . | bed[1.5x2x0.56]~north<https://www.ikea.com/sg/en/p/malm-bed-frame-high-white-s89005264/> | . | . | .",
          ". | . | . | . | . | . | .",
          ". | . | . | . | . | . | .",
          ". | . | . | . | . | . | .",
          ". | side_table[0.55x0.55x0.45]<https://www.ikea.com/us/en/p/lack-side-table-white-30449908/> | . | . | . | . | .",
          ". | . | . | . | . | dresser~east | .",
          ". | . | . | . | . | . | .",
          "END",
        ].join("\n"),
        "Kitchen & dining": [
          'DETAIL project "Kitchen: 4 × 3.5 m. @ rotates furniture in degrees."',
          'DETAIL project "Append <https://...> to furniture to keep its product link."',
          "GRID 0.5",
          "ROOM main 8x7 AT 0,0",
          "WALLS north east south west",
          "DOORS south",
          "WINDOWS east",
          "SURFACE tile",
          "LIGHT ceiling_light AT 4,3 POWER 18",
          "LAYOUT main",
          ". | . | . | . | . | . | . | .",
          ". | fridge~north | . | . | kitchen_counter[1.35x0.62x0.9]~north | . | stove~north | .",
          ". | . | . | . | . | . | . | .",
          ". | . | . | . | kitchen_chair | . | . | .",
          ". | . | . | . | . | . | . | .",
          ". | . | kitchen_chair@90 | . | kitchen_table[1.4x0.78x0.74]<https://www.ikea.com/us/en/p/lisabo-table-ash-veneer-70294339/> | . | kitchen_chair@270 | .",
          ". | . | . | . | . | . | . | .",
          "END",
        ].join("\n"),
        "Small apartment": [
          'DETAIL project "A 27 m² apartment: living/kitchen, bedroom and bathroom."',
          'DETAIL project "AT places rooms in grid cells; matching DOORS connect rooms."',
          'DETAIL project "Append <https://...> to furniture; click it to open the product."',
          'DETAIL project "Rendered furniture is generic. Set dimensions to your actual item."',
          "GRID 0.5",
          "ROOM living 8x6 AT 0,0",
          "WALLS north east south west",
          "DOORS east south",
          "WINDOWS north west",
          "SURFACE wood",
          "LIGHT ceiling_light AT 3,5 POWER 18",
          "ROOM bedroom 6x6 AT 8,0",
          "WALLS north east south west",
          "DOORS west south",
          "WINDOWS north east",
          "SURFACE wood",
          "LIGHT ceiling_light AT 3,4 POWER 12",
          "ROOM bathroom 6x4 AT 8,6",
          "WALLS north east south west",
          "DOORS north",
          "WINDOWS none",
          "SURFACE tile",
          "LIGHT ceiling_light AT 3,2 POWER 12",
          "LAYOUT living",
          ". | . | . | . | . | . | . | .",
          ". | fridge~north | . | . | . | kitchenette[2.1x0.65x2.25]~north | . | .",
          ". | . | . | . | . | desk[1x0.6x0.74]<https://www.ikea.com/us/en/p/linnmon-adils-table-white-s29932181/> | . | .",
          ". | sofa~west | . | . | . | . | . | .",
          ". | . | . | . | coffee_table | . | . | .",
          ". | . | . | . | . | . | . | .",
          "END",
          "LAYOUT bedroom",
          ". | . | . | . | . | .",
          ". | . | bed[1.5x2x0.56]~north<https://www.ikea.com/sg/en/p/malm-bed-frame-high-white-s89005264/> | . | . | .",
          ". | . | . | . | . | .",
          ". | . | . | . | . | .",
          ". | . | . | . | . | .",
          ". | . | . | . | . | .",
          "END",
          "LAYOUT bathroom",
          ". | . | . | . | . | .",
          ". | shower~west | . | . | toilet~east | .",
          ". | . | . | . | . | .",
          ". | bathroom_vanity~south | . | . | . | .",
          "END",
        ].join("\n"),
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
        "tv_stand",
        "botanical_print",
        "wall_tv",
        "wall_outlet",
        "wall_coat_hooks",
        "citrus_print",
        "coastal_print",
        "wall_spot_pair",
        "wall_lamp",
        "air_conditioner",
        "floating_tv_console",
        "cooker_hood",
        "curtain_pair",
        "builtin_wardrobe",
        "kitchen_cabinet",
        "radiator",
        "double_awning",
        "side_awning",
        "retracted_double_awning",
        "retracted_side_awning",
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
        childPlacement,
        offset,
        d,
        h,
        link,
        rotation,
        w,
        wall;
      const seen = new Set();
      while (rest) {
        const modifier =
          /^(?:\[([\d.]+)x([\d.]+)x([\d.]+)\]|@(-?[\d.]+)|~(north|east|south|west)|\((\w+)_(on_top|underneath)\)|<([^<>]+)>|\[(-?[\d.]+),(-?[\d.]+)\])/iu.exec(
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
                : modifier[8]
                  ? "link"
                  : "offset";
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
          ({ 6: child, 7: childPlacement } = modifier);
        }
        if (modifier[8]) {
          ({ 8: link } = modifier);
        }
        if (modifier[9]) {
          offset = modifier.slice(9, 11).map(Number);
          if (offset.some((value) => !Number.isFinite(value) || Math.abs(value) > 10)) {
            fail("Position offsets must be between -10 and 10 metres", line);
          }
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
        childPlacement: childPlacement?.toLowerCase(),
        dimensions,
        end: start + text.length,
        line,
        name,
        offset,
        start,
        text,
        url: productUrl(link, line),
        wall: wall?.toLowerCase(),
        yaw,
      };
    }
    function sourceLines(source) {
      let from = 0;
      return source.split("\n").map((raw, index) => {
        let quote = false,
          link = false,
          escaped = false,
          end = raw.length;
        for (let i = 0; i < raw.length; i += 1) {
          const c = raw[i];
          if (quote) {
            if (escaped) {
              escaped = false;
            } else if (c === "\\") {
              escaped = true;
            } else if (c === '"') {
              quote = false;
            }
          } else if (c === '"' && !link) {
            quote = true;
          } else if (c === "<") {
            link = true;
          } else if (c === ">") {
            link = false;
          } else if (c === "#" && !link) {
            end = i;
            break;
          }
        }
        const result = {
          comment: raw.slice(end),
          from,
          line: index + 1,
          raw,
          text: raw.slice(0, end).trim(),
          to: from + raw.length,
        };
        from += raw.length + 1;
        return result;
      });
    }
    function decimal(value) {
      const text = String(Number(value));
      if (!text.includes("e")) {
        return text;
      }
      const [mantissa, exponent] = text.split("e"),
        sign = mantissa.startsWith("-") ? "-" : "",
        unsigned = mantissa.replace("-", ""),
        digits = unsigned.replace(".", ""),
        point =
          (unsigned.includes(".") ? unsigned.indexOf(".") : unsigned.length) + Number(exponent);
      return (
        sign +
        (point <= 0
          ? `0.${"0".repeat(-point)}${digits}`
          : point >= digits.length
            ? digits + "0".repeat(point - digits.length)
            : `${digits.slice(0, point)}.${digits.slice(point)}`)
      );
    }
    function measurement(text, grid, line, count = 1, separator = ",", physical = false) {
      const match = /^(.+?)(cm|mm|m|g)$/iu.exec(text);
      if (!match || (physical && match[2].toLowerCase() === "g")) {
        fail(
          `Use an explicit ${physical ? "m, cm or mm" : "m, cm, mm or g"} unit in “${text}”`,
          line,
        );
      }
      const values = match[1].split(separator),
        scale = { cm: 0.01, g: grid, m: 1, mm: 0.001 }[match[2].toLowerCase()];
      if (values.length !== count || values.some((v) => !/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v))) {
        fail(`Expected ${count} numeric component${count === 1 ? "" : "s"} in “${text}”`, line);
      }
      const result = values.map((v) => Number(v) * scale);
      if (result.some((v) => !Number.isFinite(v))) {
        fail("Measurements must be finite", line);
      }
      return result;
    }
    function tokenSource(token, units = false) {
      return (
        token.name +
        (token.child ? `(${token.child}_${token.childPlacement})` : "") +
        (token.dimensions.some((n, i) => n !== catalog[token.name][i])
          ? `[${token.dimensions.map((value) => decimal(value)).join("x")}${units ? "m" : ""}]`
          : "") +
        (token.wall ? `~${token.wall}` : token.yaw ? `@${decimal(token.yaw)}` : "") +
        (token.offset?.some(Boolean)
          ? `[${token.offset.map((value) => decimal(value)).join(",")}${units ? "m" : ""}]`
          : "") +
        (token.url ? `<${token.url}>` : "")
      );
    }
    function parseDesign(source) {
      if (source.length > 200_000) {
        fail("Layout exceeds 200,000 characters", 1);
      }
      const lines = sourceLines(source),
        first = lines.find((node) => node.text);
      if (!first || !/^DESIGN\b/iu.test(first.text)) {
        return;
      }
      if (!/^DESIGN\s+2$/iu.test(first.text)) {
        fail("Supported language version is DESIGN 2", first.line);
      }
      const ast = { children: [], from: 0, source, to: source.length, type: "design", version: 2 },
        definitions = new Map(),
        links = new Map(),
        output = [],
        mapping = [],
        places = new Map(),
        replacements = new Map();
      let grid = 0.82,
        scope,
        gridSeen = false,
        roomSeen = false;
      const emit = (text, node) => {
          output.push(text);
          mapping.push(node);
          return output.length;
        },
        lengths = (text, node, count = 1, separator = ",", physical = false) =>
          measurement(text, grid, node.line, count, separator, physical),
        cells = (text, node, count = 1, separator = ",") => {
          const values = lengths(text, node, count, separator);
          return /g$/iu.test(text)
            ? text
                .slice(0, -1)
                .split(separator)
                .map((value) => decimal(value))
                .join(separator)
            : values.map((v) => decimal(v / grid)).join(separator);
        },
        metres = (text, node) => decimal(lengths(text, node, 1, ",", true)[0]),
        resolveLinks = (text, node) =>
          text.replaceAll(/<\$(\w+)>/gu, (_, name) => {
            const url = links.get(name.toLowerCase());
            if (!url) {
              fail(`Unknown LINK “${name}”; define it before use`, node.line);
            }
            return `<${url}>`;
          }),
        expand = (sourceText, node) => {
          const text = resolveLinks(sourceText, node);
          if ([".", "-", "0"].includes(text)) {
            return text;
          }
          const normalized = text.replaceAll(/(<[^<>]*>)|\[([^\]]+)\]/gu, (_, link, content) => {
              if (link) {
                return link;
              }
              const sep = content.includes("x") ? "x" : ",",
                count = sep === "x" ? 3 : 2;
              return `[${lengths(content, node, count, sep, true)
                .map((value) => decimal(value))
                .join(sep)}]`;
            }),
            base = /^(\w+)/u.exec(normalized),
            definition = definitions.get(base?.[1].toLowerCase());
          if (!definition) {
            return tokenSource(parseToken(normalized, node.line));
          }
          const rest = normalized.slice(base[0].length),
            token = parseToken(definition.name + rest, node.line);
          if (!/\[[^\]]*x/u.test(rest.replaceAll(/<[^<>]*>/gu, ""))) {
            token.dimensions = definition.dimensions;
          }
          if (!rest.includes("<")) {
            token.url = definition.url;
          }
          return tokenSource(token);
        },
        statement = (node, type) => {
          node.type = type;
          (scope ? scope.node.children : ast.children).push(node);
        };
      for (const node of lines) {
        const { text } = node;
        if (node === first) {
          continue;
        }
        if (!text) {
          statement(node, node.comment ? "comment" : "blank");
          continue;
        }
        let m;
        if (/^END$/iu.test(text)) {
          if (!scope) {
            fail("END needs an open ROOM, BALCONY, GARDEN or LAYOUT", node.line);
          }
          scope.node.to = node.to;
          scope.node.endLine = node.line;
          if (scope.kind === "layout") {
            emit("END", node);
          } else {
            emit(`LAYOUT ${scope.name}`, scope.node);
            if (scope.rows.length > 0) {
              for (const row of scope.rows) {
                emit(row.text, row.node);
              }
            } else {
              emit(".", node);
            }
            emit("END", node);
            if (scope.placements.length > 0) {
              places.set(scope.name, scope.placements);
            }
          }
          scope = undefined;
        } else if ((m = /^LINK\s+(\w+)\s*=\s*<([^<>]+)>$/iu.exec(text))) {
          if (scope) {
            fail("LINK definitions belong outside rooms and layouts", node.line);
          }
          const name = m[1].toLowerCase();
          if (links.has(name)) {
            fail(`Duplicate LINK “${name}”`, node.line);
          }
          links.set(name, productUrl(m[2], node.line));
          statement(node, "link");
        } else if ((m = /^ASSET\s+(\w+)\s*=\s*(\S+)$/iu.exec(text))) {
          if (scope) {
            fail("ASSET definitions belong outside rooms and layouts", node.line);
          }
          const name = m[1].toLowerCase();
          if (
            name === "0" ||
            definitions.has(name) ||
            Object.hasOwn(catalog, name) ||
            Object.hasOwn(aliases, name)
          ) {
            fail(`Duplicate or reserved asset “${name}”`, node.line);
          }
          const token = parseToken(expand(m[2], node), node.line);
          if (
            !token ||
            /[@~(]|\[[^\]]*,/u.test(m[2].replaceAll(/<[^<>]*>/gu, "")) ||
            token.wall ||
            token.offset ||
            token.child ||
            token.yaw
          ) {
            fail(
              "ASSET defines a model, size and product URL; place and rotate each instance separately",
              node.line,
            );
          }
          definitions.set(name, token);
          statement(node, "asset");
        } else if ((m = /^(ROOM|BALCONY|GARDEN)\s+(\w+)\s+(\S+)\s+AT\s+(\S+)$/iu.exec(text))) {
          if (scope) {
            fail("Close the current block with END before starting a room", node.line);
          }
          const size = cells(m[3], node, 2, "x"),
            position = cells(m[4], node, 2);
          statement(node, "room");
          node.children = [];
          node.name = m[2].toLowerCase();
          scope = { kind: "room", name: node.name, node, placements: [], rows: [] };
          roomSeen = true;
          emit(`${m[1]} ${m[2]} ${size} AT ${position}`, node);
        } else if ((m = /^LAYOUT\s+(\w+)$/iu.exec(text))) {
          if (scope) {
            fail("LAYOUT definitions belong outside room blocks", node.line);
          }
          statement(node, "layout");
          node.children = [];
          node.name = m[1].toLowerCase();
          scope = { kind: "layout", name: node.name, node };
          emit(text, node);
        } else if (scope?.kind === "layout" || /^ROW\s/iu.test(text)) {
          if (!scope) {
            fail("ROW needs a room", node.line);
          }
          if (scope.kind === "room" && scope.placements.length > 0) {
            fail("Use either ROW grids or PLACE statements in a room", node.line);
          }
          const row = scope.kind === "layout" ? text : text.replace(/^ROW\s+/iu, ""),
            converted = row.replaceAll(/(?:<[^<>]*>|[^\s|<>])+/gu, (token) => expand(token, node));
          statement(node, "row");
          if (scope.kind === "layout") {
            emit(converted, node);
          } else {
            scope.rows.push({ node, text: converted });
          }
        } else if ((m = /^PLACE\s+(\S+)\s+AT\s+(\S+)$/iu.exec(text))) {
          if (scope?.kind !== "room") {
            fail("PLACE needs a room", node.line);
          }
          if (scope.rows.length > 0) {
            fail("Use either ROW grids or PLACE statements in a room", node.line);
          }
          const position = lengths(m[2], node, 2),
            expanded = expand(m[1], node),
            line = emit("# placement", node),
            token = parseToken(expanded, line);
          if (!token) {
            fail("PLACE needs an asset", node.line);
          }
          if (position.some((v) => Math.abs(v) > 120)) {
            fail("PLACE coordinates must be within ±120 metres", node.line);
          }
          token.position = position;
          scope.placements.push(token);
          replacements.set(token, { node, start: node.raw.indexOf(m[1]), text: m[1] });
          statement(node, "place");
        } else if ((m = /^GRID\s+(\S+)$/iu.exec(text))) {
          if (scope || gridSeen || roomSeen) {
            fail("Define GRID once, before rooms", node.line);
          }
          [grid] = lengths(m[1], node, 1, ",", true);
          if (grid < 0.2 || grid > 3) {
            fail("GRID must be 0.2–3 metres", node.line);
          }
          gridSeen = true;
          statement(node, "grid");
          emit(`GRID ${decimal(grid)}`, node);
        } else {
          const [firstWord] = text.split(/\s/u),
            keyword = firstWord.toUpperCase(),
            global = ["DETAIL", "FLOOR", "SITE", "FACADE", "ROOF", "WALL_THICKNESS"].includes(
              keyword,
            );
          if (
            [
              "ASSET",
              "LINK",
              "PLACE",
              "ROW",
              "ROOM",
              "BALCONY",
              "GARDEN",
              "LAYOUT",
              "GRID",
              "DESIGN",
              "END",
            ].includes(keyword)
          ) {
            fail(`Invalid ${keyword} syntax; see the language guide`, node.line);
          }
          if (global && scope) {
            fail(`${keyword} belongs outside room blocks`, node.line);
          }
          if (!global && scope?.kind !== "room") {
            fail(`${keyword} needs a room or is not a supported statement`, node.line);
          }
          let translated = text;
          if (keyword === "DETAIL") {
            const detail = /^(DETAIL\s+\w+\s+"(?:[^"\\]|\\.)*")(?:\s+(<[^<>]+>))?$/iu.exec(text);
            if (detail?.[2]) {
              translated = `${detail[1]} ${resolveLinks(detail[2], node)}`;
            }
          }
          if (
            (m =
              /^MOUNT\s+(north|east|south|west)\s+AT\s+(\S+)\s+(\S+)(?:\s+HEIGHT\s+(\S+))?$/iu.exec(
                text,
              ))
          ) {
            translated = `MOUNT ${m[1]} ${decimal(Number(cells(m[2], node)) - 0.5)} ${expand(m[3], node)}${m[4] ? ` HEIGHT ${metres(m[4], node)}` : ""}`;
          } else if ((m = /^LIGHT\s+(\w+)\s+AT\s+(\S+)(?:\s+POWER\s+(\S+))?$/iu.exec(text))) {
            const currentGrid = grid,
              point = lengths(m[2], node, 2).map((v) => decimal(v / currentGrid - 0.5));
            translated = `LIGHT ${m[1]} AT ${point.join(",")}${m[3] ? ` POWER ${m[3]}` : ""}`;
          } else if (
            (m =
              /^(DOOR|PASSAGE|SHUTTER)\s+(north|east|south|west)\s+AT\s+(\S+)(?:\s+WIDTH\s+(\S+))?$/iu.exec(
                text,
              ))
          ) {
            translated = `${m[1]} ${m[2]} AT ${cells(m[3], node)}${m[4] ? ` WIDTH ${metres(m[4], node)}` : ""}`;
          } else if ((m = /^OUTLINE\s+(.+)$/iu.exec(text))) {
            translated = `OUTLINE ${m[1]
              .split(/\s+/u)
              .map((v) => cells(v, node, 2))
              .join(" ")}`;
          } else if ((m = /^LABEL\s+("(?:[^"\\]|\\.)*")\s+AT\s+(\S+)$/iu.exec(text))) {
            translated = `LABEL ${m[1]} AT ${cells(m[2], node, 2)}`;
          } else if ((m = /^HEIGHT\s+(\S+)$/iu.exec(text))) {
            translated = `HEIGHT ${metres(m[1], node)}`;
          } else if ((m = /^WALL_THICKNESS\s+(\S+)\s+(\S+)$/iu.exec(text))) {
            translated = `WALL_THICKNESS ${metres(m[1], node)} ${metres(m[2], node)}`;
          } else if ((m = /^RAILING\s+(\w+)\s+(\w+)\s+SPACING\s+(\S+)$/iu.exec(text))) {
            translated = `RAILING ${m[1]} ${m[2]} SPACING ${metres(m[3], node)}`;
          } else if ((m = /^SITE\s+(\w+)\s+(\S+)$/iu.exec(text))) {
            translated = `SITE ${m[1]} ${metres(m[2], node)}`;
          } else if (/^(WALLS|DOORS|WINDOWS|RAILS) all$/iu.test(text)) {
            translated = text.replace(/all$/iu, directions.join(" "));
          } else if (
            ["MOUNT", "LIGHT", "OUTLINE", "HEIGHT", "WALL_THICKNESS", "RAILING"].includes(
              keyword,
            ) ||
            (/^(DOOR|PASSAGE|SHUTTER)\b/iu.test(text) && !/^SHUTTER\s+\w+\s+FULL$/iu.test(text))
          ) {
            fail(`Invalid ${keyword} syntax; lengths require explicit units`, node.line);
          }
          statement(node, keyword.toLowerCase());
          emit(translated, node);
        }
      }
      if (scope) {
        fail(`${scope.kind.toUpperCase()} ${scope.name} needs END`, scope.node.line);
      }
      return { ast, lowered: output.join("\n"), mapping, places, replacements };
    }
    function parseProgram(source) {
      const design = parseDesign(source);
      if (!design) {
        return parseLegacyProgram(source);
      }
      const { mapping, places, replacements } = design,
        loweredLines = design.lowered.split("\n");
      let program;
      try {
        program = parseLegacyProgram(design.lowered, places, true);
        for (const token of [
          ...Object.values(program.layouts).flat().flat(),
          ...program.rooms.flatMap((room) => room.mounts),
        ]) {
          if (token?.child && places.has(token.child)) {
            fail("A room reused as a nested layout must use ROW, not PLACE", token.line);
          }
        }
      } catch (error) {
        if (error instanceof LayoutError) {
          fail(error.message.replace(/^Line \d+: /u, ""), mapping[error.line - 1]?.line || 1);
        }
        throw error;
      }
      const relocated = new WeakSet();
      const relocate = (value) => {
        if (!value || typeof value !== "object" || relocated.has(value)) {
          return;
        }
        relocated.add(value);
        if (Number.isInteger(value.line)) {
          const node = mapping[value.line - 1];
          if (node) {
            if (typeof value.text === "string") {
              const replacement = replacements.get(value),
                raw = replacement?.text || node.raw.match(/(?:^|\s)([^\s]+)(?=\s+HEIGHT|$)/u)?.[1];
              if (replacement) {
                value.text = raw;
                value.start = replacement.start;
                value.end = value.start + raw.length;
              } else {
                const candidates = node.raw.match(/(?:<[^<>]*>|[^\s|<>])+/gu) || [],
                  candidate = /^\s*MOUNT\b/iu.test(node.raw) ? candidates[4] : undefined;
                if (candidate) {
                  value.text = candidate;
                  value.start = node.raw.indexOf(candidate);
                  value.end = value.start + candidate.length;
                } else {
                  const rowText = node.text.replace(/^ROW\s+/iu, ""),
                    tokens = [...rowText.matchAll(/(?:<[^<>]*>|[^\s|<>])+/gu)],
                    legacyRow = loweredLines[value.line - 1],
                    before = legacyRow.slice(0, value.start),
                    ordinal = [...before.matchAll(/(?:<[^<>]*>|[^\s|<>])+/gu)].length,
                    match = tokens[ordinal];
                  if (match) {
                    [value.text] = match;
                    value.start = node.raw.indexOf(rowText) + match.index;
                    value.end = value.start + value.text.length;
                  }
                }
              }
            }
            value.line = node.line;
          }
        }
        for (const key of ["outlineLine", "labelLine"]) {
          if (value[key]) {
            value[key] = mapping[value[key] - 1]?.line || value[key];
          }
        }
        for (const [key, child] of Object.entries(value)) {
          if (!["line", "outlineLine", "labelLine"].includes(key)) {
            relocate(child);
          }
        }
      };
      relocate(program);
      program.warnings = program.warnings.map((warning) =>
        warning.replaceAll(
          /Line (\d+):/gu,
          (_, line) => `Line ${mapping[Number(line) - 1]?.line || line}:`,
        ),
      );
      return program;
    }
    function migrateDesign(source) {
      if (parseDesign(source)) {
        parseProgram(source);
        return source;
      }
      const program = parseLegacyProgram(source),
        lines = sourceLines(source),
        assets = new Map(),
        definitions = [],
        used = new Set(Object.keys(catalog)),
        roomNames = new Set(program.rooms.map((room) => room.name));
      const key = (token) => JSON.stringify([token.name, token.dimensions, token.url]),
        allTokens = [
          ...Object.values(program.layouts).flat().flat().filter(Boolean),
          ...program.rooms.flatMap((room) => room.mounts),
        ];
      for (const token of allTokens) {
        const id = key(token),
          item = assets.get(id) || { count: 0, token };
        item.count += 1;
        assets.set(id, item);
      }
      for (const item of assets.values()) {
        if (item.count < 2) {
          continue;
        }
        const base = tokenSource(
          { ...item.token, child: undefined, offset: undefined, wall: undefined, yaw: 0 },
          true,
        );
        let name = `${item.token.name}_item`,
          suffix = 2;
        while (used.has(name)) {
          name = `${item.token.name}_item${(suffix += 1)}`;
        }
        if ((base.length - name.length) * item.count <= `ASSET ${name} = ${base}\n`.length) {
          continue;
        }
        used.add(name);
        item.alias = name;
        definitions.push(`ASSET ${name} = ${base}`);
      }
      const tokenText = (token) => {
          const item = assets.get(key(token));
          if (!item?.alias) {
            return tokenSource(token, true);
          }
          return (
            item.alias +
            (token.child ? `(${token.child}_${token.childPlacement})` : "") +
            (token.wall ? `~${token.wall}` : token.yaw ? `@${decimal(token.yaw)}` : "") +
            (token.offset?.some(Boolean)
              ? `[${token.offset.map((value) => decimal(value)).join(",")}m]`
              : "")
          );
        },
        physical = (value) => `${decimal(value)}m`,
        gridPoint = (values) => `${values.map((value) => decimal(value)).join(",")}g`,
        output = ["DESIGN 2", `GRID ${physical(program.grid)}`];
      for (const node of lines) {
        if (node.comment) {
          output.push(node.comment);
        }
        if (/^(DETAIL|SITE|FACADE|ROOF|WALL_THICKNESS)\b/iu.test(node.text)) {
          let { text } = node;
          text = text.replace(
            /^(WALL_THICKNESS)\s+(\S+)\s+(\S+)$/iu,
            (_, k, a, b) => `${k} ${physical(a)} ${physical(b)}`,
          );
          text = text.replace(
            /^SITE\s+(\w+)\s+(\S+)$/iu,
            (_, kind, margin) => `SITE ${kind} ${physical(margin)}`,
          );
          output.push(text);
        }
      }
      if (definitions.length > 0) {
        output.push("", ...definitions);
      }
      let floor = 0;
      for (const room of program.rooms) {
        output.push("");
        if (room.floor !== floor) {
          output.push(`FLOOR ${room.floor}`);
          ({ floor } = room);
        }
        output.push(
          `${room.kind.toUpperCase()} ${room.name} ${decimal(room.cols)}x${decimal(room.rows)}g AT ${gridPoint([room.x, room.z])}`,
        );
        const roomStatements = [];
        for (
          let i = room.line;
          i < lines.length && !/^(ROOM|BALCONY|GARDEN|LAYOUT|FLOOR)\b/iu.test(lines[i].text);
          i += 1
        ) {
          roomStatements.push(lines[i]);
        }
        const uniqueProperty = (text) =>
          roomStatements.filter(
            (node) =>
              node.text.split(/\s/u)[0].toUpperCase() === text.split(/\s/u)[0].toUpperCase(),
          ).length === 1;
        for (let i = room.line; i < lines.length; i += 1) {
          const node = lines[i];
          if (/^(ROOM|BALCONY|GARDEN|LAYOUT|FLOOR)\b/iu.test(node.text)) {
            break;
          }
          if (!node.text || /^(GRID|DETAIL|SITE|FACADE|ROOF|WALL_THICKNESS)\b/iu.test(node.text)) {
            continue;
          }
          let { text } = node,
            m;
          if (/^(DOORS|WINDOWS) none$/iu.test(text) && uniqueProperty(text)) {
            continue;
          }
          if (
            (text.toLowerCase() === `surface ${room.kind === "garden" ? "grass" : "wood"}` ||
              /^STYLE warm$/iu.test(text) ||
              /^HEIGHT 2\.6$/iu.test(text)) &&
            uniqueProperty(text)
          ) {
            continue;
          }
          if (
            (m = /^(WALLS|WINDOWS|DOORS|RAILS)\s+(.+)$/iu.exec(text)) &&
            directions.every((d) => m[2].toLowerCase().split(/\s+/u).includes(d))
          ) {
            text = `${m[1]} all`;
          } else if ((m = /^MOUNT\s+(\w+)\s+(\S+)\s+(\S+)(?:\s+HEIGHT\s+(\S+))?$/iu.exec(text))) {
            const mount = room.mounts.find((entry) => entry.line === node.line);
            text = `MOUNT ${m[1]} AT ${decimal(Number(m[2]) + 0.5)}g ${tokenText(mount)}${m[4] ? ` HEIGHT ${physical(m[4])}` : ""}`;
          } else if ((m = /^LIGHT\s+(\w+)\s+AT\s+(\d+),(\d+)(?:\s+POWER\s+(\S+))?$/iu.exec(text))) {
            text = `LIGHT ${m[1]} AT ${gridPoint([Number(m[2]) + 0.5, Number(m[3]) + 0.5])}${m[4] && Number(m[4]) !== 18 ? ` POWER ${m[4]}` : ""}`;
          } else if (
            (m = /^(DOOR|SHUTTER|PASSAGE)\s+(\w+)\s+AT\s+(\S+)(?:\s+WIDTH\s+(\S+))?$/iu.exec(text))
          ) {
            text = `${m[1]} ${m[2]} AT ${m[3]}g${m[4] ? ` WIDTH ${physical(m[4])}` : ""}`;
          } else if (/^OUTLINE\s/iu.test(text)) {
            text = text.replaceAll(/\S+,\S+/gu, (value) => `${value}g`);
          } else if (/^LABEL\s/iu.test(text)) {
            text = text.replace(/ AT (\S+)$/u, " AT $1g");
          } else if (/^HEIGHT\s/iu.test(text)) {
            text += "m";
          } else if (/^RAILING\s/iu.test(text)) {
            text += "m";
          }
          output.push(`  ${text}`);
        }
        const rows = program.layouts[room.name],
          dense = rows.map(
            (row) => `  ROW ${row.map((token) => (token ? tokenText(token) : ".")).join(" | ")}`,
          ),
          sparse = [];
        rows.forEach((row, z) =>
          row.forEach((token, x) => {
            if (token) {
              sparse.push(`  PLACE ${tokenText(token)} AT ${gridPoint([x + 0.5, z + 0.5])}`);
            }
          }),
        );
        output.push(
          ...(allTokens.some((token) => token.child === room.name) ||
          dense.join("\n").length < sparse.join("\n").length
            ? dense
            : sparse),
          "END",
        );
      }
      for (const [name, rows] of Object.entries(program.layouts)) {
        if (roomNames.has(name)) {
          continue;
        }
        output.push(
          "",
          `LAYOUT ${name}`,
          ...rows.map(
            (row) => `  ${row.map((token) => (token ? tokenText(token) : ".")).join(" | ")}`,
          ),
          "END",
        );
      }
      let migrated = output.join("\n");
      const references = new Map();
      for (const node of sourceLines(migrated)) {
        if (!node.text || node.text.startsWith("#")) {
          continue;
        }
        const searchable = /^DETAIL\b/iu.test(node.text)
          ? node.text.replace(/^DETAIL\s+\w+\s+"(?:[^"\\]|\\.)*"/iu, "")
          : node.text;
        for (const match of searchable.matchAll(/<https?:\/\/[^<>]+>/gu)) {
          references.set(match[0], (references.get(match[0]) || 0) + 1);
        }
      }
      const linkDefinitions = [];
      for (const [url, count] of references) {
        const name = `ref${linkDefinitions.length + 1}`,
          reference = `<$${name}>`,
          definition = `LINK ${name} = ${url}`;
        if ((url.length - reference.length) * count <= definition.length + 1) {
          continue;
        }
        linkDefinitions.push(definition);
        migrated = sourceLines(migrated)
          .map((node) => {
            const prose = /^DETAIL\s+\w+\s+"(?:[^"\\]|\\.)*"/iu.exec(node.text)?.[0];
            if (prose) {
              return (
                node.raw.slice(0, node.raw.indexOf(prose) + prose.length) +
                node.raw
                  .slice(
                    node.raw.indexOf(prose) + prose.length,
                    node.raw.length - node.comment.length,
                  )
                  .replaceAll(url, reference) +
                node.comment
              );
            }
            return (
              node.raw.slice(0, node.raw.length - node.comment.length).replaceAll(url, reference) +
              node.comment
            );
          })
          .join("\n");
      }
      if (linkDefinitions.length > 0) {
        migrated = migrated.replace("DESIGN 2\n", `DESIGN 2\n${linkDefinitions.join("\n")}\n`);
      }
      return migrated;
    }
    function formatDesign(source) {
      const design = parseDesign(source);
      if (!design) {
        fail("Migrate to DESIGN 2 before formatting", 1);
      }
      parseProgram(source);
      let depth = 0;
      return sourceLines(source)
        .map((node) => {
          if (/^END$/iu.test(node.text)) {
            depth -= 1;
          }
          const text = `${"  ".repeat(Math.max(0, depth))}${node.text}${node.comment ? `${node.text ? " " : ""}${node.comment}` : ""}`;
          if (/^(ROOM|BALCONY|GARDEN|LAYOUT)\b/iu.test(node.text)) {
            depth += 1;
          }
          return node.text || node.comment ? text : "";
        })
        .join("\n");
    }
    function parseLegacyProgram(source, placements = new Map(), version2 = false) {
      if (source.length > 200_000) {
        fail("Layout exceeds 200,000 characters", 1);
      }
      const program = {
        details: [],
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
          quoted = false,
          escaped = false,
          end = original.length;
        for (let i = 0; i < original.length; i += 1) {
          if (quoted) {
            if (escaped) {
              escaped = false;
            } else if (original[i] === "\\") {
              escaped = true;
            } else if (original[i] === '"') {
              quoted = false;
            }
            continue;
          }
          if (original[i] === '"' && !insideLink) {
            quoted = true;
            continue;
          }
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
            matches = [...original.slice(0, end).matchAll(/(?:<[^<>]*>|[^\s|<>])+/gu)];
          if (matches.length === 0) {
            fail("Empty layout row", line);
          }
          for (const match of matches) {
            cells.push(parseToken(match[0], line, match.index));
          }
          if (
            text.replaceAll(/<[^<>]*>/gu, "").includes("|") &&
            (matches
              .slice(1)
              .some(
                (m, i) =>
                  original.slice(matches[i].index + matches[i][0].length, m.index).trim() !== "|",
              ) ||
              original.slice(0, matches[0].index).trim() !== "" ||
              original.slice(matches.at(-1).index + matches.at(-1)[0].length, end).trim() !== "")
          ) {
            fail("Separate every cell with |", line);
          }
          program.layouts[active].push(cells);
          continue;
        }
        let m;
        if ((m = /^DETAIL\s+(\w+)\s+("(?:[^"\\]|\\.)*")(?:\s+<([^<>]+)>)?$/iu.exec(text))) {
          let detail;
          try {
            detail = JSON.parse(m[2]);
          } catch {
            fail("DETAIL needs a JSON string", line);
          }
          if (!detail.trim() || detail.length > 1000 || program.details.length >= 128) {
            fail("Use at most 128 details, each 1–1000 characters", line);
          }
          program.details.push({
            line,
            room: m[1].toLowerCase(),
            text: detail,
            url: productUrl(m[3], line),
          });
        } else if ((m = /^GRID\s+([\d.]+)$/iu.exec(text))) {
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
          (m =
            /^(ROOM|BALCONY|GARDEN)\s+(\w+)\s+(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)\s+AT\s+(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/iu.exec(
              text,
            ))
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
        } else if ((m = /^OUTLINE\s+(.+)$/iu.exec(text))) {
          if (!room || room.outline) {
            fail("Define one OUTLINE after its room", line);
          }
          const points = m[1].split(/\s+/u).map((point) => {
            if (!/^\d+(?:\.\d+)?,\d+(?:\.\d+)?$/u.test(point)) {
              fail("OUTLINE needs x,z points in grid cells", line);
            }
            return point.split(",").map(Number);
          });
          room.outline = points;
          room.outlineLine = line;
        } else if (
          (m = /^LABEL\s+("(?:[^"\\]|\\.)*")(?:\s+AT\s+(\d+(?:\.\d+)?),(\d+(?:\.\d+)?))?$/iu.exec(
            text,
          ))
        ) {
          if (!room || room.label) {
            fail("Define one LABEL after its room", line);
          }
          let label;
          try {
            label = JSON.parse(m[1]);
          } catch {
            fail("LABEL needs a JSON string", line);
          }
          if (!label.trim() || label.length > 60 || /[\r\n\t]/u.test(label)) {
            fail("LABEL must contain 1–60 characters on one line", line);
          }
          room.label = label;
          room.labelLine = line;
          if (m[2]) {
            room.labelPoint = [Number(m[2]), Number(m[3])];
          }
        } else if (
          (m =
            /^(DOOR|SHUTTER|PASSAGE)\s+(north|east|south|west)\s+(?:AT\s+(\d+(?:\.\d+)?)(?:\s+WIDTH\s+(\d+(?:\.\d+)?))?|(FULL))$/iu.exec(
              text,
            ))
        ) {
          if (!room) {
            fail(`Define a room before its ${m[1].toUpperCase()}`, line);
          }
          const kind = m[1].toLowerCase(),
            side = m[2].toLowerCase(),
            full = Boolean(m[5]),
            at = Number(m[3]),
            width = Number(m[4] || 0.85);
          room.openings ??= [];
          if (room.openings.length >= 8) {
            fail("Use at most eight DOOR, SHUTTER or PASSAGE statements per room", line);
          }
          if (full && kind !== "shutter") {
            fail("FULL is supported for balcony SHUTTER openings", line);
          }
          if (
            !full &&
            (!Number.isFinite(at) || !Number.isFinite(width) || width < 0.4 || width > 2.4)
          ) {
            fail(`${m[1].toUpperCase()} width must be 0.4–2.4 metres`, line);
          }
          room.openings.push({ at, full, kind, line, side, width });
          if (!room.doors.includes(side)) {
            room.doors.push(side);
          }
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
        } else if (
          (m = /^RAILING\s+(horizontal|vertical)\s+(silver|timber)\s+SPACING\s+([\d.]+)$/iu.exec(
            text,
          ))
        ) {
          const spacing = Number(m[3]);
          if (
            !room ||
            room.kind !== "balcony" ||
            !Number.isFinite(spacing) ||
            spacing < 0.1 ||
            spacing > 2
          ) {
            fail("RAILING needs a balcony and SPACING 0.1–2 metres", line);
          }
          room.railing = { finish: m[2].toLowerCase(), spacing, style: m[1].toLowerCase() };
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
          (m =
            /^LIGHT\s+(\w+)\s+AT\s+(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:\s+POWER\s+([\d.]+))?$/iu.exec(
              text,
            ))
        ) {
          if (!room) {
            fail("Define a room first", line);
          }
          const power = m[4] === undefined ? 18 : Number(m[4]);
          if (
            (!version2 &&
              (!Number.isInteger(Number(m[2])) ||
                !Number.isInteger(Number(m[3])) ||
                Number(m[2]) < 0 ||
                Number(m[3]) < 0)) ||
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
          (m =
            /^MOUNT\s+(north|east|south|west)\s+(-?\d+(?:\.\d+)?)\s+(\S+)(?:\s+HEIGHT\s+([\d.]+))?$/iu.exec(
              text,
            ))
        ) {
          const token = parseToken(m[3], line, original.indexOf(m[3])),
            height = m[4] === undefined ? undefined : Number(m[4]);
          if (
            !room ||
            (!version2 && Number(m[2]) < 0) ||
            !token ||
            !mountNames.has(token.name) ||
            token.wall ||
            token.offset ||
            token.yaw !== 0
          ) {
            fail(
              "MOUNT needs a room and a wall decoration or fixture without rotation or wall placement",
              line,
            );
          }
          if (
            height !== undefined &&
            (!Number.isFinite(height) || height < 0 || height + token.dimensions[2] > room.height)
          ) {
            fail("MOUNT HEIGHT places the bottom of the fixture inside the room", line);
          }
          room.mounts.push({
            ...token,
            cell: Number(m[2]),
            height,
            line,
            side: m[1].toLowerCase(),
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
      for (const detail of program.details) {
        if (detail.room !== "project" && !roomNames.has(detail.room)) {
          fail(`Unknown detail room “${detail.room}”`, detail.line);
        }
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
        roomGeometry(r);
        if (r.labelPoint && !insideRoom(r, ...r.labelPoint)) {
          fail("LABEL must be inside its room outline", r.labelLine);
        }
        for (const light of r.lights) {
          if (!insideRoom(r, light.x + 0.5, light.z + 0.5)) {
            fail("LIGHT must be inside its room outline", light.line);
          }
        }
        if (
          r.outline &&
          (r.diagonal || r.footprint.length > 1) &&
          ["pitched", "terracotta"].includes(program.roof)
        ) {
          fail("Pitched roofs need rectangular rooms", r.line);
        }
        r.doors = [...new Set([...r.doors, ...(r.openings || []).map(({ side }) => side)])];
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
        for (const opening of r.openings || []) {
          if (opening.full) {
            const sides = r.edges.filter(
              (edge) => edge.axis !== "diagonal" && edge.side === opening.side,
            );
            if (sides.length !== 1) {
              fail("SHUTTER FULL needs one continuous wall edge", opening.line);
            }
            opening.at = (sides[0].min + sides[0].max) / 2;
            opening.width = (sides[0].max - sides[0].min) * program.grid;
          }
          const half = opening.width / program.grid / 2,
            margin = opening.full || opening.kind === "passage" ? -0.00001 : 0.01,
            edges = r.edges.filter(
              (edge) =>
                edge.axis !== "diagonal" &&
                edge.side === opening.side &&
                opening.at - half >= edge.min + margin &&
                opening.at + half <= edge.max - margin,
            );
          if (!r.walls.includes(opening.side) || edges.length !== 1) {
            fail(
              `${opening.kind.toUpperCase()} must fit on one existing outline edge`,
              opening.line,
            );
          }
          opening.across = edges[0].across;
        }
        for (const mount of r.mounts) {
          const edge = supportingEdge(
            program,
            r,
            mount.side,
            (mount.cell + 0.5) * program.grid,
            mount.dimensions[0],
            mount.name === "builtin_wardrobe",
          );
          const railSupport =
            mount.name.endsWith("side_awning") &&
            r.kind === "balcony" &&
            r.rails.includes(mount.side);
          if ((!r.walls.includes(mount.side) && !railSupport) || !edge) {
            fail("MOUNT must fit within an existing outline edge", mount.line);
          }
          mount.edge = edge;
        }
        if (placements.has(r.name)) {
          program.layouts[r.name] = [placements.get(r.name)];
        }
        program.layouts[r.name].forEach((row, z) =>
          row.forEach((token, x) => {
            if (token) {
              furniturePosition(program, r, token, x, z);
            }
          }),
        );
        for (const other of program.rooms) {
          if (!other.footprint) {
            roomGeometry(other);
          }
          if (
            other !== r &&
            roomsOverlap(r, other) &&
            r.elevation < other.elevation + other.height &&
            r.elevation + r.height > other.elevation
          ) {
            fail(`Rooms ${r.name} and ${other.name} overlap`, other.line);
          }
        }
      }
      const sizes = new Map(),
        lightCounts = new Map(),
        visit = (name, path = [], referenceLine = 1) => {
          if (path.includes(name)) {
            fail("Sub-layouts cannot contain cycles", referenceLine);
          }
          if (path.length > 4) {
            fail("Sub-layouts can be nested at most four levels", referenceLine);
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
                count += visit(token.child, [...path, name], token.line);
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
          r.mounts.reduce(
            (total, mount) =>
              total +
              Number(fixtureNames.has(mount.name)) +
              (mount.child ? lightCounts.get(mount.child) || 0 : 0),
            0,
          );
        if (fixtureCount > 64) {
          fail("A design supports at most 64 light fixtures", r.line);
        }
        for (const mount of r.mounts) {
          if (mount.child && !program.layouts[mount.child]) {
            fail(`Missing LAYOUT ${mount.child}`, mount.line);
          }
        }
        instanceCount +=
          sizes.get(r.name) +
          r.lights.length +
          r.mounts.reduce(
            (total, mount) => total + 1 + (mount.child ? sizes.get(mount.child) : 0),
            0,
          );
        if (instanceCount > 1024) {
          fail("A design supports at most 1,024 expanded furniture instances", r.line);
        }
        placementWarnings(program, r);
      }
      program.wallSpecs = partitionWalls(program);
      const indoor = program.rooms
          .filter((r) => r.kind === "room")
          .reduce((sum, r) => sum + r.area * program.grid ** 2, 0),
        outdoor = program.rooms
          .filter((r) => r.kind !== "room")
          .reduce((sum, r) => sum + r.area * program.grid ** 2, 0);
      program.areas = { indoor, outdoor, total: indoor + outdoor };
      return program;
    }
    function polygonArea(points) {
      let area = 0;
      for (let i = 0; i < points.length; i += 1) {
        const [x, z] = points[i],
          [a, b] = points[(i + 1) % points.length];
        area += x * b - a * z;
      }
      return area / 2;
    }
    function clipPolygon(points, boundary) {
      let result = points;
      for (let i = 0; i < boundary.length && result.length > 0; i += 1) {
        const [ax, az] = boundary[i],
          [bx, bz] = boundary[(i + 1) % boundary.length],
          distance = ([x, z]) => (bx - ax) * (z - az) - (bz - az) * (x - ax),
          input = result;
        result = [];
        let previous = input.at(-1),
          previousDistance = distance(previous);
        for (const current of input) {
          const currentDistance = distance(current);
          if (currentDistance >= -1e-8 !== previousDistance >= -1e-8) {
            const t = previousDistance / (previousDistance - currentDistance);
            result.push([
              previous[0] + (current[0] - previous[0]) * t,
              previous[1] + (current[1] - previous[1]) * t,
            ]);
          }
          if (currentDistance >= -1e-8) {
            result.push(current);
          }
          previous = current;
          previousDistance = currentDistance;
        }
      }
      return result;
    }
    function roomsOverlap(room, other) {
      return room.footprint.some(([left, top, right, bottom], i) =>
        other.footprint.some(([a, b, c, d], j) => {
          if (
            room.x + left >= other.x + c ||
            room.x + right <= other.x + a ||
            room.z + top >= other.z + d ||
            room.z + bottom <= other.z + b
          ) {
            return false;
          }
          if (!room.diagonal && !other.diagonal) {
            return true;
          }
          const region = room.regions[i].map(([x, z]) => [x + room.x, z + room.z]),
            boundary = other.regions[j].map(([x, z]) => [x + other.x, z + other.z]);
          return Math.abs(polygonArea(clipPolygon(region, boundary))) > 1e-7;
        }),
      );
    }
    function roomGeometry(room) {
      const points = room.outline || [
          [0, 0],
          [room.cols, 0],
          [room.cols, room.rows],
          [0, room.rows],
        ],
        line = room.outlineLine || room.line;
      if (
        points.length < 4 ||
        points.length > 32 ||
        points.some(
          ([x, z]) => !Number.isFinite(x + z) || x < 0 || z < 0 || x > room.cols || z > room.rows,
        ) ||
        Math.min(...points.map(([x]) => x)) !== 0 ||
        Math.max(...points.map(([x]) => x)) !== room.cols ||
        Math.min(...points.map(([, z]) => z)) !== 0 ||
        Math.max(...points.map(([, z]) => z)) !== room.rows
      ) {
        fail("OUTLINE needs 4–32 points within the room and must reach each bound", line);
      }
      const segments = points.map(([x, z], i) => {
        const [a, b] = points[(i + 1) % points.length];
        if (x === a && z === b) {
          fail("OUTLINE edges must have length", line);
        }
        return {
          a,
          b,
          maxX: Math.max(x, a),
          maxZ: Math.max(z, b),
          minX: Math.min(x, a),
          minZ: Math.min(z, b),
          x,
          z,
        };
      });
      for (let i = 0; i < segments.length; i += 1) {
        for (let j = i + 2; j < segments.length; j += 1) {
          if (i === 0 && j === segments.length - 1) {
            continue;
          }
          const a = segments[i],
            b = segments[j];
          const turn = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]),
            p = [a.x, a.z],
            q = [a.a, a.b],
            r = [b.x, b.z],
            s = [b.a, b.b];
          if (
            a.minX <= b.maxX &&
            a.maxX >= b.minX &&
            a.minZ <= b.maxZ &&
            a.maxZ >= b.minZ &&
            turn(p, q, r) * turn(p, q, s) <= 0 &&
            turn(r, s, p) * turn(r, s, q) <= 0
          ) {
            fail("OUTLINE edges cannot cross or touch", line);
          }
        }
      }
      const area = polygonArea(points);
      if (Math.abs(area) < 1e-7) {
        fail("OUTLINE must enclose an area", line);
      }
      if (area < 0) {
        room.outline = [...points].toReversed();
        roomGeometry(room);
        return;
      }
      room.polygon = points;
      room.area = area;
      room.diagonal = segments.some(({ x, z, a, b }) => x !== a && z !== b);
      room.edges = segments.map(({ x, z, a, b, minX, maxX, minZ, maxZ }) => {
        const length = Math.hypot(a - x, b - z),
          normal = [(b - z) / length, (x - a) / length];
        return {
          across: x === a ? x : z,
          axis: x === a ? "z" : z === b ? "x" : "diagonal",
          end: [a, b],
          max: x === a ? maxZ : maxX,
          min: x === a ? minZ : minX,
          normal,
          side:
            Math.abs(normal[0]) > Math.abs(normal[1])
              ? normal[0] > 0
                ? "east"
                : "west"
              : normal[1] > 0
                ? "south"
                : "north",
          start: [x, z],
        };
      });
      room.footprint = [];
      room.regions = [];
      const rows = [...new Set(points.map(([, z]) => z))].toSorted((a, b) => a - b);
      for (let i = 1; i < rows.length; i += 1) {
        const top = rows[i - 1],
          bottom = rows[i],
          middle = (top + bottom) / 2,
          at = (edge, z) => edge.x + ((edge.a - edge.x) * (z - edge.z)) / (edge.b - edge.z),
          cuts = segments
            .filter(({ minZ, maxZ }) => middle > minZ && middle < maxZ)
            .toSorted((a, b) => at(a, middle) - at(b, middle));
        for (let j = 0; j < cuts.length; j += 2) {
          const region = [
            [at(cuts[j], top), top],
            [at(cuts[j + 1], top), top],
            [at(cuts[j + 1], bottom), bottom],
            [at(cuts[j], bottom), bottom],
          ];
          room.regions.push(region);
          room.footprint.push([
            Math.min(region[0][0], region[3][0]),
            top,
            Math.max(region[1][0], region[2][0]),
            bottom,
          ]);
        }
      }
    }
    function insideRoom(room, x, z, tolerance = 0) {
      let inside = false;
      for (let i = 0; i < room.polygon.length; i += 1) {
        const [ax, az] = room.polygon[i],
          [bx, bz] = room.polygon[(i + 1) % room.polygon.length],
          t = Math.max(
            0,
            Math.min(
              1,
              ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / ((bx - ax) ** 2 + (bz - az) ** 2),
            ),
          );
        if (Math.hypot(x - ax - t * (bx - ax), z - az - t * (bz - az)) <= tolerance + 1e-8) {
          return true;
        }
        if (az > z !== bz > z && x < ax + ((bx - ax) * (z - az)) / (bz - az)) {
          inside = !inside;
        }
      }
      return inside;
    }
    function partitionWalls(program) {
      const lines = new Map(),
        result = [];
      for (const room of program.rooms) {
        for (const edge of room.edges.filter(
          ({ axis, side }) => axis !== "diagonal" && room.walls.includes(side),
        )) {
          const { axis, side } = edge,
            acrossAxis = axis === "x" ? "z" : "x",
            coordinate = room[acrossAxis] + edge.across,
            key = [room.floor, axis, coordinate.toFixed(6)].join(":"),
            span = { max: room[axis] + edge.max, min: room[axis] + edge.min, room, side };
          if (!lines.has(key)) {
            lines.set(key, { axis, coordinate, spans: [] });
          }
          lines.get(key).spans.push(span);
        }
      }
      for (const { axis, coordinate, spans } of lines.values()) {
        const cuts = [...new Set(spans.flatMap(({ min, max }) => [min, max]))].toSorted(
          (a, b) => a - b,
        );
        for (let i = 1; i < cuts.length; i += 1) {
          const min = cuts[i - 1],
            max = cuts[i],
            covering = spans.filter(
              (span) => span.min <= min + 0.00001 && span.max >= max - 0.00001,
            );
          if (max - min < 0.00001 || covering.length === 0) {
            continue;
          }
          const rooms = [...new Set(covering.map(({ room }) => room))],
            sides = Object.create(null),
            specified = new Map();
          for (const span of covering) {
            sides[span.room.name] = span.side;
            for (const opening of span.room.openings || []) {
              const at = span.room[axis] + opening.at,
                across = span.room[axis === "x" ? "z" : "x"] + opening.across;
              if (
                opening.side !== span.side ||
                Math.abs(across - coordinate) > 0.00001 ||
                at < min ||
                at >= max
              ) {
                continue;
              }
              const half = opening.width / program.grid / 2;
              const margin = opening.full || opening.kind === "passage" ? -0.00001 : 0.01;
              if (at - half < min + margin || at + half > max - margin) {
                fail(`${opening.kind.toUpperCase()} crosses a shared wall boundary`, opening.line);
              }
              specified.set([at.toFixed(6), opening.width.toFixed(6), opening.kind].join(":"), {
                ...opening,
                coordinate: at,
              });
            }
          }
          if (specified.size > 1) {
            fail(
              "Use one matching DOOR, SHUTTER or PASSAGE per wall segment",
              [...specified.values()][1].line,
            );
          }
          const [opening] = specified.values();
          result.push({
            axis,
            coordinate,
            hasSharedSpan: covering.some((span) =>
              spans.some(
                (other) =>
                  other.room !== span.room &&
                  other.min < span.max - 0.00001 &&
                  other.max > span.min + 0.00001,
              ),
            ),
            max,
            min,
            opening,
            rooms,
            sides,
          });
        }
      }
      const diagonals = new Map();
      for (const room of program.rooms) {
        for (const edge of room.edges.filter(
          ({ axis, side }) => axis === "diagonal" && room.walls.includes(side),
        )) {
          const start = [edge.start[0] + room.x, edge.start[1] + room.z],
            end = [edge.end[0] + room.x, edge.end[1] + room.z],
            length = Math.hypot(end[0] - start[0], end[1] - start[1]),
            sign = end[0] > start[0] ? 1 : -1,
            tangent = [
              ((end[0] - start[0]) / length) * sign,
              ((end[1] - start[1]) / length) * sign,
            ],
            normal = [-tangent[1], tangent[0]],
            coordinate = start[0] * normal[0] + start[1] * normal[1],
            values = [start, end].map(([x, z]) => x * tangent[0] + z * tangent[1]),
            key = [room.floor, ...tangent, coordinate].map((v) => v.toFixed(6)).join(":"),
            span = { edge, max: Math.max(...values), min: Math.min(...values), room };
          if (!diagonals.has(key)) {
            diagonals.set(key, { coordinate, normal, spans: [], tangent });
          }
          diagonals.get(key).spans.push(span);
        }
      }
      for (const { coordinate, normal, spans, tangent } of diagonals.values()) {
        const cuts = [...new Set(spans.flatMap(({ min, max }) => [min, max]))].toSorted(
          (a, b) => a - b,
        );
        for (let i = 1; i < cuts.length; i += 1) {
          const min = cuts[i - 1],
            max = cuts[i],
            covering = spans.filter((span) => span.min <= min + 1e-7 && span.max >= max - 1e-7);
          if (covering.length === 0 || max - min < 1e-7) {
            continue;
          }
          result.push({
            axis: "diagonal",
            coordinate,
            end: [
              tangent[0] * max + normal[0] * coordinate,
              tangent[1] * max + normal[1] * coordinate,
            ],
            hasSharedSpan: covering.length > 1,
            max,
            min,
            normal: covering[0].edge.normal,
            rooms: covering.map(({ room }) => room),
            sides: Object.fromEntries(covering.map(({ room, edge }) => [room.name, edge.side])),
            start: [
              tangent[0] * min + normal[0] * coordinate,
              tangent[1] * min + normal[1] * coordinate,
            ],
          });
        }
      }
      return result;
    }
    function supportingEdge(program, room, side, along, width, diagonal = false) {
      return room.edges.find((edge) => {
        if (edge.side !== side || (edge.axis === "diagonal" && !diagonal)) {
          return false;
        }
        const axis = ["east", "west"].includes(side) ? 1 : 0,
          projection =
            edge.axis === "diagonal"
              ? Math.abs(edge.end[axis] - edge.start[axis]) /
                Math.hypot(edge.end[0] - edge.start[0], edge.end[1] - edge.start[1])
              : 1,
          min = Math.min(edge.start[axis], edge.end[axis]) * program.grid,
          max = Math.max(edge.start[axis], edge.end[axis]) * program.grid;
        return (
          along - (width * projection) / 2 >= min + 0.02 * projection &&
          along + (width * projection) / 2 <= max - 0.02 * projection
        );
      });
    }
    function furniturePosition(program, room, token, col, row) {
      let x = (token.position?.[0] ?? (col + 0.5) * program.grid) + (token.offset?.[0] || 0),
        z = (token.position?.[1] ?? (row + 0.5) * program.grid) + (token.offset?.[1] || 0);
      if (token.wall) {
        if (!room.walls.includes(token.wall)) {
          fail(`No supporting ${token.wall} wall`, token.line);
        }
        const vertical = ["east", "west"].includes(token.wall),
          positive = ["east", "south"].includes(token.wall),
          along = vertical ? z : x,
          edge = supportingEdge(program, room, token.wall, along, token.dimensions[0]),
          length = (vertical ? room.rows : room.cols) * program.grid;
        if (
          !edge ||
          along - token.dimensions[0] / 2 < 0.02 ||
          along + token.dimensions[0] / 2 > length - 0.02 ||
          token.dimensions[1] > (vertical ? room.cols : room.rows) * program.grid - 0.04
        ) {
          fail("Furniture does not fit along the wall", token.line);
        }
        const offset = positive
          ? edge.across * program.grid - token.dimensions[1] / 2 - 0.03
          : edge.across * program.grid + token.dimensions[1] / 2 + 0.03;
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
                !insideRoom(
                  room,
                  (a - left) / program.grid,
                  (b - top) / program.grid,
                  0.02 / program.grid,
                ),
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
      clipPolygon,
      examples,
      fixtureNames,
      formatDesign,
      furniturePosition,
      insideRoom,
      migrateDesign,
      get modernExamples() {
        return Object.fromEntries(
          Object.entries(examples).map(([name, source]) => [name, migrateDesign(source)]),
        );
      },
      parseDesign,
      parseProgram,
      parseToken,
      polygonArea,
      productUrl,
    };
  };
const {
  catalog,
  clipPolygon,
  modernExamples: examples,
  examples: legacyExamples,
  migrateDesign,
  formatDesign,
  parseDesign,
  fixtureNames,
  parseProgram,
  furniturePosition,
  insideRoom,
  polygonArea,
} = createLayoutCore();
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
    {
      EditorView,
      keymap,
      lineNumbers,
      drawSelection,
      highlightActiveLine,
      Decoration,
      MatchDecorator,
      ViewPlugin,
    },
    { defaultKeymap, indentWithTab, history, historyKeymap, isolateHistory },
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
              const u = (x / 256) * Math.PI * 2,
                v = (y / 256) * Math.PI * 2,
                warp = Math.sin(u) * 0.8 + Math.sin(u * 3 + Math.sin(v)) * 0.25,
                grain = v * 18 + warp;
              const value =
                kind === "wood"
                  ? 224 +
                    6 * Math.sin(grain) +
                    2 * Math.sin(grain * 3 + u) +
                    4 * Math.sin(v * 5 + warp) +
                    4 * noise
                  : kind === "fabric"
                    ? 231 + 7 * Math.sin(u * 64) * Math.sin(v * 64) + 5 * noise
                    : 237 + 10 * noise;
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
          new (options.sheen || options.clearcoat
            ? THREE.MeshPhysicalNodeMaterial
            : THREE.MeshStandardNodeMaterial)({ color, roughness: 0.7, ...options });
      this.material = {
        accent: physical("#b56e46", { map: weave, sheen: 0.5 }),
        applianceGrey: physical("#898e8d", { metalness: 0.15, roughness: 0.6 }),
        armchairFabric: physical("#7c7f80", {
          bumpMap: weave,
          bumpScale: 0.0015,
          map: weave,
          sheen: 0.5,
          sheenRoughness: 0.8,
        }),
        blackMetal: physical("#242725", { metalness: 0.5, roughness: 0.48 }),
        brass: physical("#b69b60", { metalness: 0.85, roughness: 0.26 }),
        ceramic: physical("#eee7d9", { clearcoat: 0.6, clearcoatRoughness: 0.2, roughness: 0.23 }),
        charcoalFabric: physical("#292c2b", {
          bumpMap: weave,
          bumpScale: 0.0015,
          map: weave,
          sheen: 0.3,
        }),
        clay: physical("#ad6549", { roughness: 0.78 }),
        concrete: physical("#a5a59b", { map: plaster, roughness: 0.92 }),
        darkWood: physical("#62503e", { map: woodMap, roughness: 0.48 }),
        fabric: physical("#84968b", {
          bumpMap: weave,
          bumpScale: 0.0015,
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
        greyFabric: physical("#969796", {
          bumpMap: weave,
          bumpScale: 0.0015,
          map: weave,
          sheen: 0.5,
          sheenRoughness: 0.8,
        }),
        ground: new THREE.MeshStandardNodeMaterial({ color: "#e3dfd5", roughness: 1 }),
        leaf: physical("#435941", { roughness: 0.82, side: THREE.DoubleSide }),
        leafLight: physical("#738261", { roughness: 0.85, side: THREE.DoubleSide }),
        linen: physical("#e6ddcc", { bumpMap: weave, bumpScale: 0.0015, map: weave, sheen: 0.6 }),
        metal: physical("#515855", { metalness: 0.85, roughness: 0.27 }),
        mirror: physical("#fafafa", { metalness: 1, roughness: 0.015 }),
        planWall: physical("#737a74", { roughness: 1 }),
        rug: physical("#c2b496", { bumpMap: weave, bumpScale: 0.015, map: weave }),
        screen: physical("#13242a", { metalness: 0.35, roughness: 0.17 }),
        sheer: physical("#f0ede3", {
          depthWrite: false,
          map: weave,
          opacity: 0.55,
          roughness: 0.95,
          side: THREE.DoubleSide,
          transparent: true,
        }),
        soil: physical("#45362a"),
        stainless: physical("#b8bcba", { metalness: 0.8, roughness: 0.34 }),
        stone: physical("#c5beb0", {
          bumpMap: plaster,
          bumpScale: 0.002,
          map: plaster,
          roughness: 0.5,
        }),
        terracotta: physical("#b27b5e", { roughness: 0.8 }),
        tile: physical("#d5d1c7", { clearcoat: 0.3, roughness: 0.24 }),
        wall: physical("#ebe4d9", {
          bumpMap: plaster,
          bumpScale: 0.002,
          map: plaster,
          roughness: 0.94,
        }),
        white: physical("#f2efe7", { clearcoat: 0.25, roughness: 0.42 }),
        wicker: physical("#edece5", {
          bumpMap: weave,
          bumpScale: 0.002,
          map: weave,
          roughness: 0.85,
        }),
        wood: physical("#b58a59", {
          bumpMap: woodMap,
          bumpScale: 0.002,
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
      mesh.castShadow = !material.transparent;
      parent.add(mesh);
      return mesh;
    }
    box(parent, w, h, d, x, y, z, material = this.material.wood, round = 0) {
      const key = `box:${w}:${h}:${d}:${round}`;
      return AssetLibrary.mesh(
        parent,
        this.geometry(key, () => {
          const geometry = round
              ? new RoundedBoxGeometry(w, h, d, 2, Math.min(round, w / 3, h / 3, d / 3))
              : new THREE.BoxGeometry(w, h, d),
            uv = geometry.getAttribute("uv"),
            normals = geometry.getAttribute("normal");
          for (let i = 0; i < uv.count; i += 1) {
            const nx = Math.abs(normals.getX(i)),
              ny = Math.abs(normals.getY(i)),
              nz = Math.abs(normals.getZ(i));
            uv.setXY(
              i,
              uv.getX(i) * (nx > ny && nx > nz ? d : w),
              uv.getY(i) * (ny > nx && ny > nz ? d : h),
            );
          }
          return geometry;
        }),
        material,
        [x, y, z],
      );
    }
    cloth(parent, w, d, x, y, z, material, drape = 0.08) {
      return AssetLibrary.mesh(
        parent,
        this.geometry(`cloth:${w}:${d}:${drape}`, () => {
          const geometry = new THREE.PlaneGeometry(w, d, 16, 12);
          geometry.rotateX(-Math.PI / 2);
          const positions = geometry.getAttribute("position"),
            uv = geometry.getAttribute("uv");
          for (let i = 0; i < positions.count; i += 1) {
            const px = positions.getX(i),
              pz = positions.getZ(i),
              edge = THREE.MathUtils.smoothstep(Math.abs(px) / (w / 2), 0.84, 1),
              fold =
                Math.sin(px * 17 + Math.sin(pz * 8)) * 0.008 + Math.sin(pz * 11 + px * 4) * 0.004;
            positions.setY(i, fold - edge * drape);
            uv.setXY(i, uv.getX(i) * w, uv.getY(i) * d);
          }
          geometry.computeVertexNormals();
          return geometry;
        }),
        material,
        [x, y, z],
      );
    }
    cylinder(parent, r1, r2, h, x, y, z, material = this.material.wood) {
      return AssetLibrary.mesh(
        parent,
        this.geometry(
          `cylinder:${r1}:${r2}:${h}`,
          () => new THREE.CylinderGeometry(r1, r2, h, Math.max(r1, r2) < 0.04 ? 12 : 24),
        ),
        material,
        [x, y, z],
      );
    }
    sphere(parent, x, y, z, sx, sy, sz, material) {
      const mesh = AssetLibrary.mesh(
        parent,
        this.geometry("sphere", () => new THREE.SphereGeometry(1, 20, 12)),
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
    rods(parent, segments, radius, material, taper = 1) {
      const mesh = new THREE.InstancedMesh(
          this.geometry(
            `batched-rod:${taper}`,
            () => new THREE.CylinderGeometry(1, taper, 1, taper === 1 ? 6 : 10, 1, true),
          ),
          material,
          segments.length,
        ),
        a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        direction = new THREE.Vector3(),
        position = new THREE.Vector3(),
        rotation = new THREE.Quaternion(),
        scale = new THREE.Vector3(),
        up = new THREE.Vector3(0, 1, 0),
        matrix = new THREE.Matrix4();
      segments.forEach(([start, end], i) => {
        a.set(...start);
        b.set(...end);
        direction.subVectors(b, a);
        scale.set(radius, direction.length(), radius);
        rotation.setFromUnitVectors(up, direction.normalize());
        position.addVectors(a, b).multiplyScalar(0.5);
        matrix.compose(position, rotation, scale);
        mesh.setMatrixAt(i, matrix);
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }
    shell(parent, key, width, depth, lower, upper, thickness, material) {
      return AssetLibrary.mesh(
        parent,
        this.geometry(key, () => {
          const positions = [],
            curvedFaces = [],
            steps = 24,
            point = (angle, inset, height) => [
              Math.sin(angle) * (width / 2 - inset),
              height,
              -Math.cos(angle) * (depth / 2 - inset),
            ],
            quad = (a, b, c, d) => positions.push(...a, ...b, ...c, ...a, ...c, ...d);
          for (let i = 0; i < steps; i += 1) {
            const a = -1.9 + (3.8 * i) / steps,
              b = -1.9 + (3.8 * (i + 1)) / steps,
              outerBottom = point(a, 0, lower(a)),
              ai = point(a, thickness, lower(a)),
              bo = point(b, 0, lower(b)),
              bi = point(b, thickness, lower(b)),
              at = point(a, 0, upper(a)),
              au = point(a, thickness, upper(a)),
              bt = point(b, 0, upper(b)),
              bu = point(b, thickness, upper(b));
            curvedFaces.push([positions.length / 3, 0, 1]);
            quad(outerBottom, at, bt, bo);
            curvedFaces.push([positions.length / 3, thickness, -1]);
            quad(ai, bi, bu, au);
            quad(at, au, bu, bt);
            quad(outerBottom, bo, bi, ai);
            if (i === 0) {
              quad(outerBottom, ai, au, at);
            }
            if (i === steps - 1) {
              quad(bo, bt, bu, bi);
            }
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
          geometry.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute(
              positions.flatMap((_, i) => (i % 3 === 0 ? [positions[i], positions[i + 1]] : [])),
              2,
            ),
          );
          geometry.computeVertexNormals();
          const normals = geometry.getAttribute("normal"),
            vertices = geometry.getAttribute("position"),
            normal = new THREE.Vector3();
          for (const [start, inset, sign] of curvedFaces) {
            for (let i = start; i < start + 6; i += 1) {
              normal
                .set(
                  vertices.getX(i) / (width / 2 - inset) ** 2,
                  0,
                  vertices.getZ(i) / (depth / 2 - inset) ** 2,
                )
                .normalize()
                .multiplyScalar(sign);
              normals.setXYZ(i, normal.x, normal.y, normal.z);
            }
          }
          return geometry;
        }),
        material,
      );
    }
    paddedShell(parent, width, depth, seat, height, material) {
      return AssetLibrary.mesh(
        parent,
        this.geometry(`padded-shell:${width}:${depth}:${seat}:${height}`, () => {
          const positions = [],
            uv = [],
            indices = [],
            steps = 24,
            sides = 12,
            thickness = 0.08;
          for (let i = 0; i <= steps; i += 1) {
            const angle = -2.4 + (4.8 * i) / steps,
              side = Math.min(Math.abs(angle), Math.PI / 2),
              back = Math.cos(side),
              front = Math.max(0, Math.abs(angle) - Math.PI / 2) / (2.4 - Math.PI / 2),
              shoulder = 1 - THREE.MathUtils.smoothstep(Math.abs(angle), 0.8, 1.8),
              top = seat + 0.16 + (height - seat - 0.16) * shoulder - front ** 4 * 0.035,
              bottom = seat - 0.07,
              nx = Math.sign(angle) * Math.sin(side),
              nz = -back;
            for (let j = 0; j < sides; j += 1) {
              const around = (j / sides) * Math.PI * 2,
                rise = (Math.sin(around) + 1) / 2,
                padding = (thickness / 2) * Math.cos(around),
                x = nx * (width / 2 - thickness / 2) * (0.92 + 0.08 * rise),
                z = -back * depth * 0.4 + front * depth * 0.43 + back * (1 - rise) * 0.07;
              positions.push(x + nx * padding, bottom + (top - bottom) * rise, z + nz * padding);
              uv.push((i / steps) * (width + depth), rise * (top - bottom));
              if (i < steps) {
                const a = i * sides + j,
                  b = i * sides + ((j + 1) % sides),
                  c = b + sides,
                  d = a + sides;
                indices.push(a, b, c, a, c, d);
              }
            }
          }
          for (let j = 1; j < sides - 1; j += 1) {
            indices.push(0, j + 1, j, steps * sides, steps * sides + j, steps * sides + j + 1);
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
          geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          geometry.setIndex(indices);
          geometry.computeVertexNormals();
          return geometry;
        }),
        material,
      );
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
          legs(h - 0.06, name === "round_coffee_table" ? 0.14 : 0.08);
          if (/round|bistro|slatted|sea_table|ochre_table/u.test(name)) {
            cyl(w / 2, w / 2, 0.055, 0, h - 0.028, 0);
          } else {
            box(w, 0.055, d, 0, h - 0.028, 0, m.wood, 0.02);
          }
        };
      if (name === "grey_armchair" || name === "kitchen_chair") {
        const upholstered = name === "grey_armchair",
          seat = 0.45,
          legMaterial = upholstered ? m.wood : m.blackMetal,
          segments = [];
        for (const x of [-1, 1]) {
          for (const z of [-1, 1]) {
            segments.push([
              [x * w * 0.4, 0.02, z * d * 0.4],
              [x * w * 0.3, seat - 0.06, z * d * 0.3],
            ]);
          }
        }
        this.rods(group, segments, upholstered ? 0.03 : 0.018, legMaterial, upholstered ? 0.65 : 1);
        box(
          w * 0.91,
          0.08,
          d * 0.83,
          0,
          seat - 0.04,
          d * 0.05,
          upholstered ? m.armchairFabric : m.charcoalFabric,
          0.035,
        );
        if (upholstered) {
          this.paddedShell(group, w, d, seat, h, m.armchairFabric);
          box(w * 0.79, 0.07, d * 0.69, 0, seat + 0.015, d * 0.13, m.armchairFabric, 0.034);
        } else {
          this.shell(
            group,
            `${name}-shell`,
            w,
            d * 0.88,
            (a) => seat + Math.max(0, Math.cos(a)) * 0.12,
            (a) => h - 0.14 * (Math.abs(a) / 1.9) ** 2,
            0.025,
            m.wood,
          );
        }
      } else if (name === "grey_sofa") {
        const feet = new THREE.InstancedMesh(
            this.geometry("sofa-foot", () => new THREE.CylinderGeometry(0.03, 0.018, 0.12, 12)),
            m.darkWood,
            4,
          ),
          matrix = new THREE.Matrix4(),
          pair = (width, height, depth, x, y, z, radius, tilt = 0) => {
            const template = box(width, height, depth, 0, 0, 0, m.greyFabric, radius),
              cushions = new THREE.InstancedMesh(template.geometry, template.material, 2);
            group.remove(template);
            for (let i = 0; i < 2; i += 1) {
              matrix.makeRotationX(tilt);
              matrix.setPosition((i === 0 ? -1 : 1) * x, y, z);
              cushions.setMatrixAt(i, matrix);
            }
            cushions.castShadow = true;
            cushions.receiveShadow = true;
            group.add(cushions);
          };
        let index = 0;
        for (const x of [-1, 1]) {
          for (const z of [-1, 1]) {
            matrix.makeTranslation(x * w * 0.4, 0.06, z * d * 0.35);
            feet.setMatrixAt(index, matrix);
            index += 1;
          }
        }
        feet.castShadow = true;
        feet.receiveShadow = true;
        group.add(feet);
        box(w, 0.26, d * 0.96, 0, 0.25, 0, m.greyFabric, 0.045);
        pair((w - 0.3) / 2 - 0.01, 0.14, d * 0.65, (w - 0.3) / 4, 0.43, d * 0.12, 0.045);
        pair((w - 0.035) / 2, 0.38, 0.18, (w - 0.02) / 4, h - 0.2, -d * 0.36, 0.055, -0.12);
        pair(0.13, 0.32, d * 0.9, w / 2 - 0.065, 0.34, 0, 0.045);
        pair(0.2, 0.14, d * 0.82, w / 2 - 0.1, 0.55, d * 0.035, 0.055, 0.025);
      } else if (
        /sofa|armchair|accent_chair|woven_chair|pouf|ottoman|linen_bench|bench/u.test(name) &&
        !/gym/u.test(name)
      ) {
        legs(0.15);
        box(w, 0.19, d, 0, 0.21, 0, m.darkWood);
        const back = !/bench|pouf|ottoman/u.test(name),
          upholstery = name.startsWith("grey_") ? m.greyFabric : m.fabric;
        box(w - 0.04, h * 0.35, d - 0.04, 0, h * 0.4, 0, upholstery, 0.055);
        const count = Math.max(1, Math.round(w / 0.8));
        for (let i = 0; i < count; i += 1) {
          box(
            (w - 0.12) / count - 0.018,
            0.13,
            d - 0.08,
            ((i - (count - 1) / 2) * (w - 0.12)) / count,
            h * 0.54,
            0,
            upholstery,
            0.045,
          );
        }
        if (back) {
          box(w - 0.02, h * 0.53, 0.18, 0, h * 0.71, -d / 2 + 0.1, upholstery, 0.06).rotation.x =
            -0.08;
          for (const s of [-1, 1]) {
            box(0.13, h * 0.42, d, s * (w / 2 - 0.07), h * 0.6, 0, upholstery, 0.04);
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
        box(w - 0.05, 0.26, d - 0.08, 0, 0.41, 0, m.linen, 0.055);
        this.cloth(group, w + 0.015, d * 0.66, 0, 0.56, d * 0.15, m.linen);
        this.cloth(group, w + 0.025, d * 0.24, 0, 0.58, d * 0.28, m.fabric, 0.1);
        for (const s of w < 1.2 ? [0] : [-1, 1]) {
          box(
            w * (w < 1.2 ? 0.65 : 0.4),
            0.14,
            d * 0.22,
            s * w * 0.23,
            0.57,
            -d * 0.28,
            m.linen,
            0.045,
          );
        }
        if (/canopy/u.test(name)) {
          for (const s of [-1, 1]) {
            for (const t of [-1, 1]) {
              cyl(0.02, 0.02, h, s * w * 0.48, h / 2, t * d * 0.48, m.darkWood);
            }
          }
        }
      } else if (name === "hogsten_chair") {
        const frame = [],
          weave = [],
          steps = 16,
          levels = 3,
          point = (angle, level) => [
            Math.sin(angle) * w * 0.48,
            0.42 + (h - 0.42 - 0.2 * (Math.abs(angle) / 1.9) ** 2) * level,
            -Math.cos(angle) * d * 0.42,
          ];
        for (let i = 0; i < steps; i += 1) {
          const a = -1.9 + (i * 3.8) / steps,
            b = -1.9 + ((i + 1) * 3.8) / steps;
          frame.push([point(a, 0), point(b, 0)], [point(a, 1), point(b, 1)]);
          for (let j = 0; j <= levels; j += 1) {
            weave.push([point(a, j / levels), point(b, j / levels)]);
          }
          for (let j = 0; j < levels; j += 1) {
            weave.push(
              [point(a, j / levels), point(b, (j + 1) / levels)],
              [point(b, j / levels), point(a, (j + 1) / levels)],
            );
          }
        }
        for (const side of [-1, 1]) {
          frame.push([point(side * 1.9, 0), point(side * 1.9, 1)]);
          const front = [side * w * 0.43, 0.025, d * 0.42],
            back = [side * w * 0.34, 0.025, -d * 0.4];
          frame.push(
            [[side * w * 0.31, 0.42, d * 0.24], front],
            [front, back],
            [back, [side * w * 0.31, 0.42, -d * 0.27]],
          );
        }
        this.rods(group, frame, 0.012, m.white);
        this.rods(group, weave, 0.0035, m.wicker);
        box(w * 0.8, 0.025, d * 0.73, 0, 0.42, d * 0.06, m.wicker, 0.012);
        box(0.5, 0.05, 0.5, 0, 0.46, d * 0.06, m.linen, 0.025);
      } else if (/outdoor_chair|patio_chair|woven_chair/u.test(name)) {
        for (const side of [-1, 1]) {
          for (const front of [-1, 1]) {
            this.rod(
              group,
              [side * w * 0.36, 0, front * d * 0.32],
              [side * w * 0.32, h * 0.5, front * d * 0.28],
              0.018,
              m.white,
            );
          }
          box(0.045, 0.05, d * 0.88, side * w * 0.45, h * 0.72, 0, m.wicker, 0.018);
          this.rod(
            group,
            [side * w * 0.45, h * 0.48, d * 0.3],
            [side * w * 0.45, h * 0.72, d * 0.3],
            0.012,
            m.white,
          );
        }
        box(w * 0.86, 0.065, d * 0.9, 0, h * 0.5, 0, m.wicker, 0.035);
        box(w * 0.9, h * 0.47, 0.075, 0, h * 0.75, -d * 0.4, m.wicker, 0.035).rotation.x = -0.12;
        box(w * 0.68, 0.055, d * 0.67, 0, h * 0.56, d * 0.05, m.greyFabric, 0.025);
      } else if (name === "aabenraa_table") {
        box(w, 0.03, d, 0, h - 0.015, 0, m.wood, 0.004);
        const frame = new THREE.InstancedMesh(
            this.geometry("steel-frame", () => new THREE.BoxGeometry(1, 1, 1)),
            m.blackMetal,
            10,
          ),
          matrix = new THREE.Matrix4(),
          halfWidth = (w - 0.14) / 2,
          halfDepth = (d - 0.07) / 2,
          legHeight = h - 0.03,
          apronHeight = legHeight - 0.025;
        let index = 0;
        for (const x of [-halfWidth, halfWidth]) {
          for (const z of [-halfDepth, halfDepth]) {
            matrix.makeScale(0.04, legHeight, 0.02);
            matrix.setPosition(x, legHeight / 2, z);
            frame.setMatrixAt(index, matrix);
            index += 1;
          }
          for (const y of [0.01, apronHeight]) {
            matrix.makeScale(0.04, y === 0.01 ? 0.02 : 0.05, halfDepth * 2 + 0.02);
            matrix.setPosition(x, y, 0);
            frame.setMatrixAt(index, matrix);
            index += 1;
          }
        }
        for (const z of [-halfDepth, halfDepth]) {
          matrix.makeScale(halfWidth * 2 - 0.04, 0.05, 0.02);
          matrix.setPosition(0, apronHeight, z);
          frame.setMatrixAt(index, matrix);
          index += 1;
        }
        frame.castShadow = true;
        frame.receiveShadow = true;
        group.add(frame);
      } else if (name === "folding_table") {
        box(w, 0.028, d, 0, h - 0.014, 0, m.white, 0.008);
        const supports = [];
        for (const side of [-1, 1]) {
          for (const front of [-1, 1]) {
            supports.push([
              [side * w * 0.37, 0.015, front * d * 0.4],
              [side * w * 0.37, h - 0.03, -front * d * 0.32],
            ]);
          }
        }
        this.rods(group, supports, 0.012, m.white);
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
        const count = Math.min(45, Math.floor(w * 24)),
          fringe = new THREE.InstancedMesh(
            this.geometry("rug-fringe", () => new THREE.BoxGeometry(0.005, 0.004, 0.05)),
            m.linen,
            count * 2,
          ),
          matrix = new THREE.Matrix4();
        for (let side = 0; side < 2; side += 1) {
          for (let i = 0; i < count; i += 1) {
            matrix.makeTranslation(
              -w / 2 + 0.025 + i * 0.04,
              h + 0.002,
              (side ? 1 : -1) * (d / 2 + 0.02),
            );
            fringe.setMatrixAt(side * count + i, matrix);
          }
        }
        fringe.receiveShadow = true;
        group.add(fringe);
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
        const count = name === "stove" ? 0 : Math.max(1, Math.round(w / 0.5));
        for (let i = 0; i < count; i += 1) {
          const x = ((i - (count - 1) / 2) * w) / count;
          box(
            w / count - 0.025,
            base - 0.16,
            0.028,
            x,
            base / 2,
            d / 2,
            name === "sink" ? m.darkWood : m.wood,
            0.008,
          );
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
          box(w * 0.9, 0.018, d * 0.83, 0, base + 0.029, 0, m.screen);
          for (const s of [-1, 1]) {
            for (const t of [-1, 1]) {
              cyl(0.065, 0.065, 0.01, s * w * 0.22, base + 0.045, t * d * 0.23, m.metal);
            }
          }
        }
        if (name === "stove") {
          box(w - 0.035, base * 0.66, 0.022, 0, base * 0.41, d / 2, m.screen, 0.012);
          box(w - 0.035, base * 0.15, 0.025, 0, base * 0.81, d / 2, m.metal, 0.003);
          box(w * 0.67, 0.016, 0.04, 0, base * 0.67, d / 2 + 0.031, m.metal, 0.005);
          for (const side of [-1, 1]) {
            const knob = cyl(
              0.022,
              0.022,
              0.016,
              side * w * 0.28,
              base * 0.81,
              d / 2 + 0.027,
              m.white,
            );
            knob.rotation.x = Math.PI / 2;
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
      } else if (name === "retracted_double_awning") {
        for (const side of [-1, 1]) {
          const center = (side * w) / 4;
          box(w / 2 - 0.025, h, d, center, h / 2, 0, m.white, 0.025);
          const roll = cyl(d * 0.3, d * 0.3, w / 2 - 0.06, center, h * 0.45, d * 0.2, m.linen);
          roll.rotation.z = Math.PI / 2;
          roll.userData.awningRoll = true;
          box(w / 2 - 0.05, 0.025, 0.025, center, 0.015, d / 2, m.stainless, 0.003);
        }
      } else if (name === "retracted_side_awning") {
        box(w, h, d, 0, h / 2, 0, m.white, 0.02);
        const roll = cyl(w * 0.3, w * 0.3, h - 0.06, 0, h / 2, d * 0.3, m.linen);
        roll.userData.awningRoll = true;
      } else if (name === "double_awning") {
        const frontHeight = 0.12,
          rise = h - frontHeight,
          slope = Math.atan2(rise, d),
          canvasDepth = Math.hypot(d, rise),
          frame = [
            [
              [-w / 2, h, -d / 2],
              [w / 2, h, -d / 2],
            ],
            [
              [-w / 2, frontHeight, d / 2],
              [w / 2, frontHeight, d / 2],
            ],
          ];
        for (const side of [-1, 1]) {
          const center = (side * w) / 4,
            panel = box(
              w / 2 - 0.025,
              0.016,
              canvasDepth,
              center,
              (h + frontHeight) / 2,
              0,
              m.linen,
              0,
            );
          panel.rotation.x = slope;
          panel.userData.awningPanel = true;
          box(w / 2 - 0.025, 0.085, 0.02, center, frontHeight - 0.0425, d / 2, m.linen, 0);
          for (const offset of [-w / 5, w / 5]) {
            const x = center + offset;
            frame.push(
              [
                [x, h - 0.04, -d / 2],
                [x + side * 0.12, (h + frontHeight) / 2 - 0.08, 0],
              ],
              [
                [x + side * 0.12, (h + frontHeight) / 2 - 0.08, 0],
                [x, frontHeight - 0.02, d / 2],
              ],
            );
          }
        }
        this.rods(group, frame, 0.014, m.stainless);
      } else if (name === "side_awning") {
        const panel = box(w - 0.055, h - 0.08, 0.014, 0, h / 2, 0, m.linen, 0);
        panel.userData.awningPanel = true;
        this.rods(
          group,
          [
            [
              [-w / 2, h, 0],
              [w / 2, h, 0],
            ],
            [
              [-w / 2, 0, 0],
              [w / 2, 0, 0],
            ],
            [
              [-w / 2, 0, 0],
              [-w / 2, h, 0],
            ],
            [
              [w / 2, 0, 0],
              [w / 2, h, 0],
            ],
          ],
          0.012,
          m.stainless,
        );
      } else if (name === "wall_coat_hooks") {
        for (let i = 0; i < 5; i += 1) {
          const x = ((i - 2) * w) / 5;
          const slat = box(w / 9, h, d * 0.3, x, h / 2, -d * 0.35, m.wood, 0.004);
          slat.userData.woodenCoatHook = true;
          this.rod(group, [x, h * 0.55, -d * 0.2], [x, h * 0.8, d * 0.5], w / 35, m.wood);
        }
      } else if (name === "watering_hose") {
        for (let i = 0; i < 5; i += 1) {
          const radius = w * 0.46 - i * w * 0.065;
          const ring = AssetLibrary.mesh(
            group,
            this.geometry(`hose-ring:${i}`, () => new THREE.TorusGeometry(radius, 0.012, 8, 48)),
            m.leaf,
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.018;
        }
        this.rod(group, [w * 0.2, 0.03, 0], [w * 0.38, 0.035, d * 0.25], 0.012, m.leaf);
        this.rod(group, [w * 0.38, 0.035, d * 0.25], [w * 0.38, 0.06, d * 0.42], 0.025, m.brass);
      } else if (name === "coat_rack") {
        const frame = [
          [
            [0, 0.08, 0],
            [0, h, 0],
          ],
        ];
        for (let i = 0; i < 4; i += 1) {
          const angle = (i * Math.PI) / 2;
          frame.push(
            [
              [0, 0.07, 0],
              [Math.cos(angle) * w * 0.45, 0.025, Math.sin(angle) * d * 0.45],
            ],
            [
              [0, h * 0.77, 0],
              [Math.cos(angle) * w * 0.35, h * 0.86, Math.sin(angle) * d * 0.35],
            ],
            [
              [Math.cos(angle) * w * 0.35, h * 0.86, Math.sin(angle) * d * 0.35],
              [Math.cos(angle) * w * 0.35, h * 0.91, Math.sin(angle) * d * 0.35],
            ],
          );
        }
        this.rods(group, frame, 0.015, m.darkWood);
      } else if (name === "shoe_rack") {
        box(w, h, d, 0, h / 2, 0, m.white, 0.006);
        for (const row of [0, 1]) {
          const y = ((row + 0.5) * h) / 2;
          box(w - 0.035, h / 2 - 0.025, 0.025, 0, y, d / 2, m.wood, 0.004);
          box(w * 0.3, 0.012, 0.025, 0, y + h / 4 - 0.04, d / 2 + 0.02, m.white, 0.003);
        }
      } else if (name === "garment_rack") {
        const frame = [
            [
              [-w * 0.45, 0.05, 0],
              [-w * 0.45, h - 0.04, 0],
            ],
            [
              [w * 0.45, 0.05, 0],
              [w * 0.45, h - 0.04, 0],
            ],
            [
              [-w * 0.45, h - 0.04, 0],
              [w * 0.45, h - 0.04, 0],
            ],
          ],
          hangers = [];
        for (const side of [-1, 1]) {
          frame.push([
            [side * w * 0.45, 0.025, -d * 0.45],
            [side * w * 0.45, 0.025, d * 0.45],
          ]);
        }
        this.rods(group, frame, 0.018, m.metal);
        for (let i = 0; i < 4; i += 1) {
          const x = (i - 1.5) * w * 0.18,
            top = h - 0.17,
            material = [m.greyFabric, m.linen, m.fabric, m.charcoalFabric][i];
          hangers.push(
            [
              [x, h - 0.05, 0],
              [x, top, 0],
            ],
            [
              [x - 0.12, top - 0.09, 0],
              [x, top, 0],
            ],
            [
              [x, top, 0],
              [x + 0.12, top - 0.09, 0],
            ],
          );
          box(w * 0.15, 0.5 + (i % 2) * 0.1, 0.05, x, top - 0.35, 0, material, 0.018);
          for (const side of [-1, 1]) {
            box(
              0.085,
              0.22,
              0.045,
              x + side * w * 0.085,
              top - 0.22,
              0,
              material,
              0.012,
            ).rotation.z = side * 0.35;
          }
        }
        this.rods(group, hangers, 0.003, m.metal);
      } else if (name === "radiator") {
        const fins = 16,
          parts = new THREE.InstancedMesh(
            this.geometry("radiator-part", () => new THREE.BoxGeometry(1, 1, 1)),
            m.white,
            fins + 4,
          ),
          matrix = new THREE.Matrix4();
        for (let i = 0; i < fins; i += 1) {
          matrix.makeScale((w / fins) * 0.78, h - 0.055, d * 0.8);
          matrix.setPosition(-w / 2 + ((i + 0.5) * w) / fins, h / 2, d * 0.1);
          parts.setMatrixAt(i, matrix);
        }
        for (let i = 0; i < 2; i += 1) {
          matrix.makeScale(w, 0.035, d * 0.7);
          matrix.setPosition(0, i === 0 ? 0.0175 : h - 0.0175, 0);
          parts.setMatrixAt(fins + i, matrix);
          matrix.makeScale(0.025, h * 0.55, d * 0.25);
          matrix.setPosition((i === 0 ? -1 : 1) * w * 0.28, h / 2, -d * 0.375);
          parts.setMatrixAt(fins + 2 + i, matrix);
        }
        parts.userData.radiatorParts = true;
        parts.castShadow = true;
        parts.receiveShadow = true;
        group.add(parts);
      } else if (name === "floating_tv_console") {
        box(w, 0.018, d, 0, h - 0.009, 0, m.wood, 0.003);
        box(w, 0.018, d, 0, 0.009, 0, m.wood, 0.003);
        box(w, h - 0.036, 0.018, 0, h / 2, -d / 2 + 0.009, m.darkWood, 0);
        for (const x of [-w / 2 + 0.009, 0, w / 2 - 0.009]) {
          box(0.018, h - 0.036, d, x, h / 2, 0, m.wood, 0);
        }
        for (const side of [-1, 1]) {
          box(w / 2 - 0.016, h - 0.028, 0.018, (side * w) / 4, h / 2, d / 2 - 0.009, m.wood, 0.003);
        }
        box(w - 0.04, 0.006, 0.008, 0, 0.006, d / 2 - 0.028, m.glow, 0);
      } else if (name === "builtin_wardrobe" || name === "wardrobe" || name === "kitchen_cabinet") {
        const finish = name === "kitchen_cabinet" ? m.darkWood : m.white;
        box(w, 0.07, d - 0.02, 0, 0.035, 0, finish, 0);
        box(w, h - 0.07, d - 0.02, 0, (h + 0.07) / 2, -0.01, finish, 0);
        const pulls = [];
        for (const side of [-1, 1]) {
          box(
            w / 2 - 0.01,
            h - 0.1,
            0.025,
            (side * w) / 4,
            (h + 0.05) / 2,
            d / 2 - 0.0125,
            finish,
            0.003,
          );
          pulls.push([
            [side * 0.035, h * 0.42, d / 2 + 0.018],
            [side * 0.035, h * 0.51, d / 2 + 0.018],
          ]);
        }
        this.rods(group, pulls, 0.005, m.metal);
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
      } else if (name === "air_conditioner") {
        box(w, h, d, 0, h / 2, 0, m.white, 0.045);
        box(w * 0.96, h * 0.57, 0.035, 0, h * 0.66, d / 2 - 0.012, m.white, 0.025);
        box(w * 0.86, h * 0.12, 0.018, 0, h * 0.16, d / 2 + 0.003, m.screen, 0.005);
        box(w * 0.88, 0.012, d * 0.22, 0, h * 0.23, d / 2 + 0.003, m.white, 0.003).rotation.x =
          -0.2;
        box(0.018, 0.009, 0.005, w * 0.36, h * 0.41, d / 2 + 0.007, m.metal, 0.002);
      } else if (name === "ac_condenser") {
        box(w, h - 0.06, d, 0, (h + 0.06) / 2, 0, m.white, 0.02);
        for (const side of [-1, 1]) {
          box(0.065, 0.06, d * 0.95, side * w * 0.32, 0.03, 0, m.metal, 0.006);
        }
        const radius = Math.min(w * 0.27, h * 0.35),
          fanX = -w * 0.16,
          fanY = h * 0.54,
          fan = cyl(radius, radius, 0.01, fanX, fanY, d / 2 + 0.005, m.screen),
          grille = [];
        fan.rotation.x = Math.PI / 2;
        for (let i = -4; i <= 4; i += 1) {
          const offset = (i * radius) / 5,
            length = Math.sqrt(radius ** 2 - offset ** 2);
          grille.push(
            [
              [fanX - length, fanY + offset, d / 2 + 0.018],
              [fanX + length, fanY + offset, d / 2 + 0.018],
            ],
            [
              [fanX + offset, fanY - length, d / 2 + 0.02],
              [fanX + offset, fanY + length, d / 2 + 0.02],
            ],
          );
        }
        this.rods(group, grille, 0.004, m.white);
        const ring = AssetLibrary.mesh(
          group,
          this.geometry("condenser-ring", () => new THREE.TorusGeometry(radius, 0.01, 6, 24)),
          m.white,
          [fanX, fanY, d / 2 + 0.015],
        );
        ring.castShadow = true;
        box(w * 0.21, h * 0.74, 0.014, w * 0.35, h * 0.54, d / 2 + 0.004, m.white, 0.008);
        box(w * 0.16, 0.045, 0.006, w * 0.35, h * 0.73, d / 2 + 0.014, m.metal, 0.003);
      } else if (name === "cooker_hood") {
        box(w, 0.012, d, 0, 0.012, 0, m.stainless, 0.003);
        box(w - 0.05, h - 0.061, d * 0.605, 0, (h + 0.019) / 2, -d * 0.1975, m.stainless, 0.004);
        box(w, 0.04, 0.018, 0, 0.026, d / 2 - 0.009, m.stainless, 0.003);
        cyl(0.075, 0.075, 0.021, 0, h - 0.0105, -d * 0.32, m.stainless);
        for (const side of [-1, 1]) {
          box(w * 0.42, 0.004, d * 0.7, side * w * 0.22, 0.001, d * 0.04, m.metal, 0);
          cyl(0.025, 0.025, 0.006, side * w * 0.29, 0, -d * 0.3, m.glow);
        }
      } else if (name === "pitsos_fridge") {
        const split = h * 0.42;
        box(w, h, d - 0.028, 0, h / 2, -0.014, m.applianceGrey, 0.009);
        box(
          w - 0.014,
          h - split - 0.01,
          0.028,
          0,
          (h + split + 0.002) / 2,
          d / 2 - 0.014,
          m.stainless,
          0.006,
        );
        box(
          w - 0.014,
          split - 0.027,
          0.028,
          0,
          (split + 0.003) / 2,
          d / 2 - 0.014,
          m.stainless,
          0.006,
        );
        box(w * 0.75, 0.012, 0.008, 0, split, d / 2 - 0.009, m.blackMetal, 0.003);
      } else if (/fridge|washer|washing|vending|server/u.test(name)) {
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
      } else if (name === "wall_lamp") {
        const plate = box(w * 0.55, h * 0.65, 0.025, 0, h / 2, -d / 2 + 0.0125, m.brass, 0.012);
        plate.userData.wallSconce = true;
        this.rod(group, [0, h * 0.42, -d / 2], [0, h * 0.42, d * 0.2], 0.012, m.brass);
        cyl(w * 0.3, w * 0.45, h * 0.6, 0, h * 0.62, d * 0.18, m.linen);
        cyl(w * 0.4, w * 0.4, 0.012, 0, h * 0.32, d * 0.18, m.glow);
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
        const display = /tv|monitor/u.test(name),
          bezel = display ? 0.012 : 0.04;
        box(w, h, d, 0, h / 2, 0, display ? m.blackMetal : m.darkWood, 0.008);
        box(
          w - bezel,
          h - bezel,
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
      } else if (name === "curtain_pair") {
        const geometry = this.geometry(`sheer-curtain:${w}:${d}:${h}`, () => {
          const panel = new THREE.PlaneGeometry(w * 0.19, h - 0.08, 16, 12),
            positions = panel.getAttribute("position");
          for (let i = 0; i < positions.count; i += 1) {
            positions.setZ(
              i,
              Math.sin((positions.getX(i) / (w * 0.19) + 0.5) * Math.PI * 10) * d * 0.28,
            );
          }
          panel.computeVertexNormals();
          return panel;
        });
        for (const side of [-1, 1]) {
          AssetLibrary.mesh(group, geometry, m.sheer, [side * w * 0.405, h / 2 - 0.04, 0]);
        }
        this.rods(
          group,
          [
            [
              [-w / 2, h - 0.04, -d * 0.3],
              [w / 2, h - 0.04, -d * 0.3],
            ],
          ],
          0.009,
          m.metal,
        );
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
      } else if (name === "wall_shelf") {
        box(w, 0.035, d, 0, h - 0.02, 0, m.wood, 0.006);
        for (const side of [-1, 1]) {
          box(0.022, h - 0.04, 0.025, side * w * 0.35, h / 2, -d / 2 + 0.02, m.metal, 0);
          this.rod(
            group,
            [side * w * 0.35, 0.03, -d / 2],
            [side * w * 0.35, h - 0.04, d / 2 - 0.02],
            0.009,
            m.metal,
          );
        }
      } else if (name === "laptop") {
        box(w, 0.012, d, 0, 0.006, 0, m.metal, 0.006);
        box(w * 0.85, 0.002, d * 0.45, 0, 0.014, -d * 0.12, m.screen, 0.002);
        box(w, h, 0.008, 0, h / 2, -d / 2 + 0.015, m.metal, 0.006);
        box(w - 0.018, h - 0.018, 0.004, 0, h / 2, -d / 2 + 0.022, m.screen, 0.002);
      } else if (name === "guitar") {
        this.sphere(group, 0, h * 0.22, 0, w / 2, h * 0.22, d / 2, m.wood);
        this.sphere(group, 0, h * 0.43, 0, w * 0.37, h * 0.16, d / 2, m.wood);
        box(w * 0.13, h * 0.48, d * 0.32, 0, h * 0.7, 0, m.darkWood, 0.004);
        box(w * 0.2, h * 0.12, d * 0.4, 0, h * 0.94, 0, m.wood, 0.005);
        const hole = cyl(w * 0.12, w * 0.12, 0.003, 0, h * 0.39, d * 0.49, m.soil);
        hole.rotation.x = Math.PI / 2;
      } else if (name === "pedestal_fan") {
        cyl(d * 0.45, d * 0.45, 0.04, 0, 0.02, 0, m.metal);
        cyl(0.02, 0.025, h * 0.75, 0, h * 0.4, 0, m.metal);
        const guard = new THREE.Mesh(
          this.geometry("fan-guard", () => new THREE.TorusGeometry(w * 0.48, 0.008, 6, 32)),
          m.metal,
        );
        guard.position.set(0, h - w / 2, 0);
        group.add(guard);
        const spokes = [];
        for (let i = 0; i < 8; i += 1) {
          const a = (i * Math.PI) / 4;
          spokes.push([
            [0, h - w / 2, 0.015],
            [Math.cos(a) * w * 0.46, h - w / 2 + Math.sin(a) * w * 0.46, 0.015],
          ]);
        }
        this.rods(group, spokes, 0.003, m.metal);
        this.sphere(group, 0, h - w / 2, 0.02, 0.035, 0.035, 0.018, m.white);
      } else if (name === "robot_vacuum") {
        cyl(w / 2, w / 2, h * 0.78, 0, h * 0.39, 0, m.white);
        cyl(w * 0.12, w * 0.12, h * 0.22, 0, h * 0.89, 0, m.screen);
      } else if (name === "air_quality_sensor" || name === "usb_charger") {
        box(w, h, d, 0, h / 2, 0, m.white, 0.008);
        box(w * 0.55, h * 0.2, 0.002, 0, h * 0.64, d / 2, m.screen, 0.001);
      } else if (name === "water_glass" || name === "water_bottle") {
        cyl(w * 0.45, w * 0.4, h * 0.78, 0, h * 0.39, 0, m.glass);
        if (name === "water_bottle") {
          cyl(w * 0.18, w * 0.4, h * 0.16, 0, h * 0.86, 0, m.glass);
          cyl(w * 0.2, w * 0.2, h * 0.06, 0, h * 0.97, 0, m.metal);
        }
      } else if (name === "plate") {
        cyl(w / 2, w * 0.43, h, 0, h / 2, 0, m.ceramic);
      } else if (name === "suitcase") {
        box(w, h * 0.88, d, 0, h * 0.44, 0, m.fabric, 0.035);
        box(w * 0.32, h * 0.08, d * 0.2, 0, h * 0.94, 0, m.metal, 0.008);
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
      labelsScene = new THREE.Group(),
      walls = [],
      ceilings = [],
      fixtures = [],
      objects = [],
      roomGroups = [],
      colliders = [],
      mirrors = [],
      labels = [],
      owned = [],
      m = library.material,
      box = (...args) => library.box(...args),
      addObject = (token, position, room, parent = root) => {
        const group = library.create(token.name),
          base = catalog[token.name],
          isCollider =
            !/rug|mat|lamp|light|pillow|book|towel|print|painting|mirror|curtain/u.test(
              token.name,
            ) && parent === root,
          localBounds = isCollider ? new THREE.Box3().setFromObject(group) : null;
        group.scale.set(
          token.dimensions[0] / base[0],
          token.dimensions[2] / base[2],
          token.dimensions[1] / base[1],
        );
        group.position.set(...position);
        group.rotation.y = THREE.MathUtils.degToRad(token.yaw);
        group.userData = { room, token };
        parent.add(group);
        group.traverse((node) => {
          if (node.isInstancedMesh) {
            owned.push(node);
          }
        });
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
        if (isCollider) {
          const bounds = new THREE.Box3().setFromObject(group);
          colliders.push({
            bounds,
            group,
            inverse: group.matrixWorld.clone().invert(),
            localBounds,
          });
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
                    ((x + 0.5 - cols / 2) * base[0]) / cols + (child.offset?.[0] || 0),
                    token.childPlacement === "underneath" ? 0 : base[2],
                    ((z + 0.5 - rows / 2) * base[1]) / rows + (child.offset?.[1] || 0),
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
      if (room.label) {
        const canvas = document.createElement("canvas"),
          context = canvas.getContext("2d"),
          font = "600 32px Arial, sans-serif";
        context.font = font;
        canvas.width = Math.ceil(context.measureText(room.label).width + 32);
        canvas.height = 64;
        context.font = font;
        context.fillStyle = "rgba(255,255,252,0.94)";
        context.beginPath();
        context.roundRect(1, 1, canvas.width - 2, 62, 12);
        context.fill();
        context.strokeStyle = "rgba(64,76,69,0.2)";
        context.stroke();
        context.fillStyle = "#243229";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(room.label, canvas.width / 2, 33);
        const texture = new THREE.CanvasTexture(canvas),
          material = new THREE.MeshBasicNodeMaterial({
            depthTest: false,
            depthWrite: false,
            map: texture,
            transparent: true,
          }),
          label = new THREE.Mesh(
            library.geometry("plan-label", () => new THREE.PlaneGeometry(1, 1)),
            material,
          ),
          [largest] = room.footprint.toSorted(
            (a, b) => (b[2] - b[0]) * (b[3] - b[1]) - (a[2] - a[0]) * (a[3] - a[1]),
          ),
          point = room.labelPoint || [(largest[0] + largest[2]) / 2, (largest[1] + largest[3]) / 2],
          width = Math.min((canvas.width / canvas.height) * 0.26, w * 0.8, 2.5);
        texture.colorSpace = THREE.SRGBColorSpace;
        material.toneMapped = false;
        label.scale.set(width, (width * canvas.height) / canvas.width, 1);
        label.rotation.x = -Math.PI / 2;
        label.position.set(
          room.x * program.grid + point[0] * program.grid - program.center[0],
          y + room.height + 0.25,
          room.z * program.grid + point[1] * program.grid - program.center[1],
        );
        label.userData.room = room;
        label.renderOrder = 10;
        label.visible = false;
        labelsScene.add(label);
        labels.push(label);
        owned.push(texture, material);
      }
      const floorRects = room.footprint.map(([left, top, right, bottom], i) => [
        left * program.grid - w / 2,
        top * program.grid - d / 2,
        right * program.grid - w / 2,
        bottom * program.grid - d / 2,
        room.diagonal
          ? room.regions[i].map(([x, z]) => [x * program.grid - w / 2, z * program.grid - d / 2])
          : undefined,
      ]);
      let outlineGeometry;
      if (room.diagonal) {
        const shape = new THREE.Shape();
        room.polygon.forEach(([x, z], i) => {
          if (i === 0) {
            shape.moveTo(x * program.grid - w / 2, d / 2 - z * program.grid);
          } else {
            shape.lineTo(x * program.grid - w / 2, d / 2 - z * program.grid);
          }
        });
        shape.closePath();
        outlineGeometry = new THREE.ExtrudeGeometry(shape, {
          bevelEnabled: false,
          depth: 1,
          steps: 1,
        });
        outlineGeometry.rotateX(-Math.PI / 2);
        owned.push(outlineGeometry);
        const slab = AssetLibrary.mesh(roomRoot, outlineGeometry, m.stone, [0, -0.145, 0]);
        slab.scale.y = 0.14;
      }
      for (const [left, top, right, bottom] of room.diagonal ? [] : floorRects) {
        box(
          roomRoot,
          right - left,
          0.14,
          bottom - top,
          (left + right) / 2,
          -0.075,
          (top + bottom) / 2,
          m.stone,
          0,
        );
      }
      const finish = room.surface === "auto" ? "wood" : room.surface,
        clippedPositions = [],
        clippedNormals = [],
        clippedUvs = [],
        clippedColors = [],
        cropFloor = (left, top, right, bottom, color, height, boundary) => {
          if (!room.diagonal) {
            return false;
          }
          const points = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom],
          ];
          if (
            points.every(([x, z]) =>
              boundary.every(([ax, az], i) => {
                const [bx, bz] = boundary[(i + 1) % boundary.length];
                return (bx - ax) * (z - az) - (bz - az) * (x - ax) >= -1e-8;
              }),
            )
          ) {
            return false;
          }
          const triangle = (a, b, c, normal) => {
            for (const point of [a, b, c]) {
              clippedPositions.push(...point);
              clippedNormals.push(...normal);
              clippedUvs.push(point[0], point[2]);
              clippedColors.push(color.r, color.g, color.b);
            }
          };
          const clipped = clipPolygon(points, boundary);
          if (clipped.length < 3 || Math.abs(polygonArea(clipped)) < 1e-8) {
            return true;
          }
          const bottomPoint = ([x, z]) => [x, -0.003, z],
            topPoint = ([x, z]) => [x, height - 0.003, z];
          for (let i = 2; i < clipped.length; i += 1) {
            triangle(
              topPoint(clipped[0]),
              topPoint(clipped[i]),
              topPoint(clipped[i - 1]),
              [0, 1, 0],
            );
            triangle(
              bottomPoint(clipped[0]),
              bottomPoint(clipped[i - 1]),
              bottomPoint(clipped[i]),
              [0, -1, 0],
            );
          }
          for (let i = 0; i < clipped.length; i += 1) {
            const a = clipped[i],
              b = clipped[(i + 1) % clipped.length],
              length = Math.hypot(b[0] - a[0], b[1] - a[1]);
            if (length < 1e-8) {
              continue;
            }
            const normal = [(b[1] - a[1]) / length, 0, (a[0] - b[0]) / length];
            triangle(bottomPoint(a), topPoint(b), bottomPoint(b), normal);
            triangle(bottomPoint(a), topPoint(a), topPoint(b), normal);
          }
          return true;
        };
      let floor;
      if (finish === "wood") {
        const plankLength = 1.2,
          plankWidth = 0.16,
          transforms = [],
          colors = [];
        for (const [minX, minZ, maxX, maxZ, boundary] of floorRects) {
          for (let z = minZ; z < maxZ - 0.001;) {
            const row = Math.floor((z + d / 2 + 0.00001) / plankWidth),
              offset = (row % 3) * 0.4,
              depth = Math.min(-d / 2 + (row + 1) * plankWidth, maxZ) - z,
              start =
                -w / 2 - offset + Math.floor((minX + w / 2 + offset) / plankLength) * plankLength;
            for (let x = start; x < maxX - 0.001; x += plankLength) {
              const left = Math.max(x, minX),
                right = Math.min(x + plankLength, maxX),
                shade = new THREE.Color().setScalar(
                  0.8 + ((((row * 13 + Math.round(x * 10)) % 7) + 7) % 7) * 0.035,
                ),
                gapX = Math.min(0.004, (right - left) / 4),
                gapZ = Math.min(0.003, depth / 4),
                matrix = new THREE.Matrix4().compose(
                  new THREE.Vector3((left + right) / 2, 0.003, z + depth / 2),
                  new THREE.Quaternion(),
                  new THREE.Vector3(
                    right - left - Math.min(0.004, (right - left) / 4),
                    0.012,
                    depth - Math.min(0.003, depth / 4),
                  ),
                );
              if (
                cropFloor(
                  left + gapX / 2,
                  z + gapZ / 2,
                  right - gapX / 2,
                  z + depth - gapZ / 2,
                  shade,
                  0.012,
                  boundary,
                )
              ) {
                continue;
              }
              transforms.push(matrix);
              colors.push(shade);
            }
            z += depth;
          }
        }
        floor = new THREE.InstancedMesh(
          library.geometry("floor-plank", () => {
            const geometry = new THREE.BoxGeometry(1, 1, 1),
              uv = geometry.getAttribute("uv");
            for (let i = 0; i < uv.count; i += 1) {
              uv.setXY(i, uv.getX(i) * plankLength, uv.getY(i) * plankWidth);
            }
            return geometry;
          }),
          m.wood,
          transforms.length,
        );
        transforms.forEach((transform, i) => {
          floor.setMatrixAt(i, transform);
          floor.setColorAt(i, colors[i]);
        });
      } else {
        const tileSize = finish === "tile" ? 0.6 : finish === "terracotta" ? 0.3 : 1.2,
          matrix = new THREE.Matrix4(),
          color = new THREE.Color(),
          transforms = [];
        for (const [minX, minZ, maxX, maxZ, boundary] of floorRects) {
          const cols = Math.ceil((maxX + w / 2 - 0.001) / tileSize),
            rows = Math.ceil((maxZ + d / 2 - 0.001) / tileSize);
          for (let col = Math.floor((minX + w / 2) / tileSize); col < cols; col += 1) {
            for (let row = Math.floor((minZ + d / 2) / tileSize); row < rows; row += 1) {
              const left = Math.max(minX, -w / 2 + col * tileSize),
                top = Math.max(minZ, -d / 2 + row * tileSize),
                right = Math.min(maxX, -w / 2 + (col + 1) * tileSize),
                bottom = Math.min(maxZ, -d / 2 + (row + 1) * tileSize),
                width = right - left,
                depth = bottom - top;
              const gapX = Math.min(0.004, width / 4),
                gapZ = Math.min(0.004, depth / 4);
              if (
                cropFloor(
                  left + gapX / 2,
                  top + gapZ / 2,
                  right - gapX / 2,
                  bottom - gapZ / 2,
                  color.setScalar(1),
                  0.014,
                  boundary,
                )
              ) {
                continue;
              }
              matrix.makeScale(
                width - Math.min(0.004, width / 4),
                0.014,
                depth - Math.min(0.004, depth / 4),
              );
              matrix.setPosition((left + right) / 2, 0.004, (top + bottom) / 2);
              transforms.push(matrix.clone());
            }
          }
        }
        floor = new THREE.InstancedMesh(
          library.geometry("unit-box", () => new THREE.BoxGeometry(1, 1, 1)),
          m[finish] || m.stone,
          transforms.length,
        );
        transforms.forEach((transform, i) => {
          floor.setMatrixAt(i, transform);
          if (finish === "terracotta") {
            floor.setColorAt(i, color.setScalar(0.94 + ((i * 17) % 7) * 0.01));
          }
        });
        floor.instanceMatrix.needsUpdate = true;
        if (floor.instanceColor) {
          floor.instanceColor.needsUpdate = true;
        }
      }
      floor.receiveShadow = true;
      owned.push(floor);
      roomRoot.add(floor);
      if (clippedPositions.length > 0) {
        const geometry = new THREE.BufferGeometry(),
          finishMaterial = m[finish] || m.wood,
          material = new finishMaterial.constructor(
            Object.fromEntries(
              [
                "bumpMap",
                "bumpScale",
                "clearcoat",
                "clearcoatRoughness",
                "color",
                "map",
                "metalness",
                "roughness",
              ]
                .filter((key) => finishMaterial[key] !== undefined)
                .map((key) => [key, finishMaterial[key]]),
            ),
          );
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(clippedPositions, 3));
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(clippedNormals, 3));
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(clippedUvs, 2));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(clippedColors, 3));
        material.vertexColors = true;
        const clipped = AssetLibrary.mesh(roomRoot, geometry, material);
        clipped.userData.clippedFloor = true;
        owned.push(geometry, material);
      }
      if (room.kind === "room" && outlineGeometry) {
        const ceiling = AssetLibrary.mesh(roomRoot, outlineGeometry, m.white, [0, room.height, 0]);
        ceiling.scale.y = 0.1;
        ceilings.push(ceiling);
        if (program.roof === "flat") {
          const roof = AssetLibrary.mesh(roomRoot, outlineGeometry, m.concrete, [
            0,
            room.height + 0.1,
            0,
          ]);
          roof.scale.y = 0.12;
          ceilings.push(roof);
        }
      } else if (room.kind === "room") {
        for (const [left, top, right, bottom] of floorRects) {
          const ceiling = box(
            roomRoot,
            right - left,
            0.1,
            bottom - top,
            (left + right) / 2,
            room.height + 0.05,
            (top + bottom) / 2,
            m.white,
            0,
          );
          ceiling.userData.room = room;
          ceilings.push(ceiling);
        }
        if (program.roof !== "none") {
          const roofRects =
            room.footprint.length === 1
              ? [[-w / 2 - 0.1, -d / 2 - 0.1, w / 2 + 0.1, d / 2 + 0.1]]
              : floorRects;
          for (const [left, top, right, bottom] of roofRects) {
            const roof = box(
              roomRoot,
              right - left,
              0.12,
              bottom - top,
              (left + right) / 2,
              room.height + 0.16,
              (top + bottom) / 2,
              program.roof === "terracotta" ? m.terracotta : m.concrete,
              0,
            );
            ceilings.push(roof);
          }
          if (["pitched", "terracotta"].includes(program.roof)) {
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
      for (const side of room.rails) {
        const rail = new THREE.Group(),
          vertical = ["east", "west"].includes(side),
          length = vertical ? d : w,
          setting = room.railing || { finish: "timber", spacing: 0.16, style: "vertical" },
          horizontal = setting.style === "horizontal",
          material = setting.finish === "silver" ? m.stainless : m.darkWood,
          intervals = Math.ceil(length / setting.spacing),
          count = horizontal ? intervals + 1 : Math.floor(length / setting.spacing) + 1;
        rail.userData.railing = setting;
        rail.position.set(
          side === "east" ? w / 2 : side === "west" ? -w / 2 : 0,
          0,
          side === "south" ? d / 2 : side === "north" ? -d / 2 : 0,
        );
        rail.rotation.y = turns[side];
        roomRoot.add(rail);
        box(rail, length, 0.045, 0.055, 0, 1.04, 0, material);
        const postWidth = horizontal ? 0.035 : 0.016,
          posts = new THREE.InstancedMesh(
            library.geometry(
              `rail-post:${postWidth}`,
              () => new THREE.BoxGeometry(postWidth, 1, postWidth),
            ),
            setting.finish === "silver" ? m.stainless : m.metal,
            count,
          ),
          matrix = new THREE.Matrix4();
        for (let i = 0; i < count; i += 1) {
          matrix.makeTranslation(
            -length / 2 + i * (horizontal ? length / intervals : setting.spacing),
            0.52,
            0,
          );
          posts.setMatrixAt(i, matrix);
        }
        posts.userData.railPosts = true;
        posts.castShadow = true;
        posts.receiveShadow = true;
        rail.add(posts);
        owned.push(posts);
        if (horizontal) {
          const bars = new THREE.InstancedMesh(
            library.geometry("horizontal-rail", () => new THREE.BoxGeometry(1, 0.025, 0.025)),
            material,
            4,
          );
          for (let i = 0; i < 4; i += 1) {
            matrix.makeScale(length, 1, 1);
            matrix.setPosition(0, 0.2 + i * 0.2, 0);
            bars.setMatrixAt(i, matrix);
          }
          bars.userData.horizontalRails = true;
          bars.castShadow = true;
          bars.receiveShadow = true;
          rail.add(bars);
          owned.push(bars);
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
        const { edge } = mount,
          [mw, md, mh] = mount.dimensions,
          vertical = ["east", "west"].includes(mount.side),
          along = (mount.cell + 0.5) * program.grid,
          alongAxis = vertical ? 1 : 0,
          fraction =
            edge.axis === "diagonal"
              ? (along / program.grid - edge.start[alongAxis]) /
                (edge.end[alongAxis] - edge.start[alongAxis])
              : 0,
          token = {
            ...mount,
            dimensions: [mw, md, mh],
            mount: true,
            yaw:
              edge.axis === "diagonal"
                ? THREE.MathUtils.radToDeg(Math.atan2(-edge.normal[0], -edge.normal[1]))
                : { east: 270, north: 0, south: 180, west: 90 }[mount.side],
          },
          x =
            edge.axis === "diagonal"
              ? (edge.start[0] + fraction * (edge.end[0] - edge.start[0])) * program.grid -
                w / 2 -
                edge.normal[0] * (md / 2 + 0.02)
              : vertical
                ? mount.side === "east"
                  ? edge.across * program.grid - w / 2 - md / 2 - 0.02
                  : edge.across * program.grid - w / 2 + md / 2 + 0.02
                : -w / 2 + along,
          z =
            edge.axis === "diagonal"
              ? (edge.start[1] + fraction * (edge.end[1] - edge.start[1])) * program.grid -
                d / 2 -
                edge.normal[1] * (md / 2 + 0.02)
              : vertical
                ? -d / 2 + along
                : mount.side === "south"
                  ? edge.across * program.grid - d / 2 - md / 2 - 0.02
                  : edge.across * program.grid - d / 2 + md / 2 + 0.02;
        addObject(token, [cx + x, y + (mount.height ?? Math.max(0.3, 1.5 - mh / 2)), cz + z], room);
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
        group.userData.ceilingFixture = true;
        root.add(group);
        const point = new THREE.PointLight("#ffe1b2", light.power * 0.9, Math.max(w, d) * 2, 2);
        point.position.set(group.position.x, y + room.height - 0.55, group.position.z);
        point.userData.room = room;
        root.add(point);
        fixtures.push({ light: point, power: light.power * 0.9 });
      }
    }
    for (const spec of program.wallSpecs) {
      const [room] = spec.rooms,
        side = spec.sides[room.name],
        normal = spec.normal || [normals[side][0], normals[side][2]],
        position = new THREE.Vector3(
          (spec.axis === "diagonal"
            ? (spec.start[0] + spec.end[0]) / 2
            : spec.axis === "x"
              ? (spec.min + spec.max) / 2
              : spec.coordinate) *
            program.grid -
            program.center[0],
          room.elevation,
          (spec.axis === "diagonal"
            ? (spec.start[1] + spec.end[1]) / 2
            : spec.axis === "z"
              ? (spec.min + spec.max) / 2
              : spec.coordinate) *
            program.grid -
            program.center[1],
        ),
        group = new THREE.Group();
      group.position.copy(position);
      group.rotation.y =
        spec.axis === "diagonal" ? Math.atan2(-normal[0], -normal[1]) : turns[side];
      group.userData.room = room;
      root.add(group);
      walls.push({
        axis: spec.axis,
        group,
        hasSharedSpan: spec.hasSharedSpan,
        length: (spec.max - spec.min) * program.grid,
        normal: new THREE.Vector3(normal[0], 0, normal[1]),
        position,
        room,
        rooms: spec.rooms,
        side,
        sides: new Map(spec.rooms.map((r) => [r, spec.sides[r.name]])),
        specified: spec.opening
          ? {
              ...spec.opening,
              coordinate:
                spec.opening.coordinate * program.grid - program.center[spec.axis === "x" ? 0 : 1],
            }
          : undefined,
      });
    }
    for (const entry of walls) {
      const { group, room, side, length, specified } = entry,
        shared = entry.rooms.length > 1,
        generic = entry.rooms.some(
          (r) =>
            r.doors.includes(entry.sides.get(r)) &&
            !(r.openings || []).some((opening) => opening.side === entry.sides.get(r)),
        ),
        door =
          entry.axis !== "diagonal" &&
          (Boolean(specified) || ((shared || !entry.hasSharedSpan) && generic)),
        outer =
          entry.position[entry.axis === "x" ? "z" : "x"] ===
          (room[entry.axis === "x" ? "z" : "x"] +
            (side === "east" ? room.cols : side === "south" ? room.rows : 0)) *
            program.grid -
            program.center[entry.axis === "x" ? 1 : 0],
        window =
          entry.axis !== "diagonal" && !door && !shared && outer && room.windows.includes(side),
        t = shared ? program.interiorWallThickness : program.exteriorWallThickness,
        { height } = room,
        offset = specified
          ? (specified.coordinate - entry.position[entry.axis]) *
            (["north", "east"].includes(side) ? 1 : -1)
          : 0;
      const width = door
        ? specified?.width || Math.min(0.95, length * 0.65)
        : window
          ? Math.min(1.9, length * 0.6)
          : 0;
      const bottom = window ? 0.85 : 0,
        top =
          specified?.kind === "passage"
            ? height
            : door
              ? Math.min(2.12, height - 0.12)
              : window
                ? Math.min(2.25, height - 0.16)
                : 0;
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
        wallBox = (w, h, x, y) => {
          if (w > 0.00001 && h > 0.00001) {
            box(group, w, h, t, x, y, -t / 2, shared ? wallMat : facade, 0);
          }
        };
      if (width) {
        wallBox(
          (length - width) / 2 + offset,
          height,
          -(length + width) / 4 + offset / 2,
          height / 2,
        );
        wallBox(
          (length - width) / 2 - offset,
          height,
          (length + width) / 4 + offset / 2,
          height / 2,
        );
        wallBox(width, height - top, offset, (height + top) / 2);
        if (bottom) {
          wallBox(width, bottom, offset, bottom / 2);
        }
      } else {
        wallBox(length, height, 0, height / 2);
      }
      for (const sign of [-1, 1]) {
        const len = door ? (length - width) / 2 - sign * offset : length;
        if (len > 0.00001 && (door || sign < 0)) {
          box(
            group,
            len,
            0.09,
            0.023,
            door ? (sign * (length + width)) / 4 + offset / 2 : 0,
            0.045,
            0.013,
            m.white,
            0.003,
          );
        }
      }
      if (specified?.kind !== "passage") {
        box(group, length, 0.07, 0.045, 0, height - 0.035, 0.025, m.white, 0.003);
      }
      const openingDecor = new THREE.Group();
      openingDecor.position.x = offset;
      group.add(openingDecor);
      if (window) {
        const wh = top - bottom;
        box(openingDecor, width, wh, 0.012, 0, (bottom + top) / 2, -t / 2, m.glass, 0);
        for (const s of [-1, 1]) {
          box(
            openingDecor,
            0.045,
            wh + 0.08,
            0.1,
            s * (width / 2 + 0.022),
            (bottom + top) / 2,
            -t / 2,
            m.white,
            0.003,
          );
          box(
            openingDecor,
            width + 0.1,
            0.045,
            0.1,
            0,
            s > 0 ? top : bottom,
            -t / 2,
            m.white,
            0.003,
          );
        }
        box(openingDecor, 0.035, wh, 0.055, 0, (top + bottom) / 2, -t / 2 + 0.022, m.white, 0.002);
        box(openingDecor, width + 0.18, 0.04, 0.24, 0, bottom - 0.02, 0.035, m.stone, 0.004);
        for (const s of [-1, 1]) {
          for (let i = 0; i < 7; i += 1) {
            box(
              openingDecor,
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
          openingDecor,
          [-width / 2 - 0.34, height - 0.14, 0.14],
          [width / 2 + 0.34, height - 0.14, 0.14],
          0.012,
          m.brass,
        );
      }
      if (door && specified?.kind !== "passage") {
        for (const s of [-1, 1]) {
          box(
            openingDecor,
            0.065,
            top + 0.035,
            0.09,
            s * (width / 2 + (specified?.full ? -0.032 : 0.032)),
            top / 2,
            0.025,
            m.white,
            0.003,
          );
        }
        box(
          openingDecor,
          width + (specified?.full ? 0 : 0.13),
          0.065,
          0.09,
          0,
          top + 0.032,
          0.025,
          m.white,
          0.003,
        );
        if (specified?.kind === "shutter") {
          const shutterHeight = 0.25,
            count = 5,
            slats = new THREE.InstancedMesh(
              library.geometry("shutter-slat", () => new THREE.BoxGeometry(1, 1, 1)),
              m.white,
              count,
            ),
            matrix = new THREE.Matrix4();
          for (let i = 0; i < count; i += 1) {
            matrix.makeScale(width - 0.02, shutterHeight / count - 0.003, 0.022);
            matrix.setPosition(0, top - ((i + 0.5) * shutterHeight) / count, -t - 0.025);
            slats.setMatrixAt(i, matrix);
          }
          slats.castShadow = true;
          slats.receiveShadow = true;
          openingDecor.add(slats);
          owned.push(slats);
          box(
            openingDecor,
            width + (specified.full ? 0 : 0.12),
            0.17,
            0.16,
            0,
            top + 0.09,
            -t - 0.08,
            m.white,
            0.008,
          );
          for (const sign of [-1, 1]) {
            box(
              openingDecor,
              0.025,
              top,
              0.035,
              sign * (width / 2 + (specified.full ? -0.015 : 0.015)),
              top / 2,
              -t - 0.025,
              m.metal,
              0,
            );
          }
        }
      }
      entry.opening = width
        ? {
            bottom,
            center: [
              entry.position.x +
                (entry.axis === "x" ? offset * (["north", "east"].includes(side) ? 1 : -1) : 0),
              entry.position.z +
                (entry.axis === "z" ? offset * (["north", "east"].includes(side) ? 1 : -1) : 0),
            ],
            kind: specified?.kind || (window ? "window" : "door"),
            offset,
            top,
            width,
          }
        : null;
      entry.thickness = t;
      const elevation = new THREE.Group(),
        plan = new THREE.Group();
      elevation.add(...group.children);
      group.add(elevation, plan);
      if (width) {
        for (const sign of [-1, 1]) {
          const span = (length - width) / 2 - sign * offset;
          if (span > 0.00001) {
            box(
              plan,
              span,
              0.09,
              t,
              (sign * (length + width)) / 4 + offset / 2,
              0.045,
              -t / 2,
              m.planWall,
              0,
            );
          }
        }
        if (window) {
          box(plan, width, 0.025, t * 0.65, offset, 0.015, -t / 2, m.glass, 0);
        }
      } else {
        box(plan, length, 0.09, t, 0, 0.045, -t / 2, m.planWall, 0);
      }
      entry.elevation = elevation;
      entry.plan = plan;
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
      m.ground,
      0,
    );
    ground.receiveShadow = true;
    ground.castShadow = false;
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
        labelsScene.clear();
      },
      fixtures,
      grid,
      labels,
      labelsScene,
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
      this.sun.shadow.autoUpdate = false;
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
      this.sun.shadow.needsUpdate = true;
      next.root.add(next.labelsScene);
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
      const aspect = width / height;
      if (this.model && this.mode === "3d" && aspect !== this.perspective.aspect) {
        const framing = Math.max(1, 1.15 / aspect) / Math.max(1, 1.15 / this.perspective.aspect);
        this.perspective.position
          .sub(this.controls.target)
          .multiplyScalar(framing)
          .add(this.controls.target);
      }
      this.perspective.aspect = aspect;
      this.perspective.updateProjectionMatrix();
      if (this.model && this.mode === "top") {
        const size = this.focusBounds().getSize(new THREE.Vector3());
        this.topSize = Math.max(size.z, size.x / Math.max(0.25, aspect)) * 0.62;
      }
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
      this.controls.mouseButtons.LEFT = mode === "top" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
      this.controls.touches.ONE = mode === "top" ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
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
          this.controls.mouseButtons.LEFT =
            previousMode === "top" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
          this.controls.touches.ONE = previousMode === "top" ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
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
          distance = radius * 1.25 * Math.max(1, 1.15 / this.perspective.aspect);
        this.controls.target.set(center.x, bounds.min.y + size.y * 0.28, center.z);
        this.camera.position.set(
          center.x + distance * 0.75,
          bounds.min.y + distance * 0.78,
          center.z + distance * 0.98,
        );
        this.camera.lookAt(this.controls.target);
        this.camera.updateMatrixWorld(true);
        const halfFov = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 0.88;
        let padding = 0;
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              const point = new THREE.Vector3(x, y, z).applyMatrix4(this.camera.matrixWorldInverse);
              padding = Math.max(
                padding,
                Math.max(
                  Math.abs(point.x) / (halfFov * this.perspective.aspect),
                  Math.abs(point.y) / halfFov,
                ) + point.z,
              );
            }
          }
        }
        if (padding > 0) {
          this.camera.position.addScaledVector(
            this.camera.position.clone().sub(this.controls.target).normalize(),
            padding,
          );
        }
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
          insideRoom(r, (x + p.center[0]) / g - r.x, (z + p.center[1]) / g - r.z),
      );
    }
    canStand(x, z) {
      const room = this.roomAt(x, z);
      if (!room) {
        return false;
      }
      const eye = room.elevation + 1.65;
      for (const { bounds, group, inverse, localBounds } of this.model.colliders) {
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
          const point = new THREE.Vector3(x, 0, z).applyMatrix4(inverse),
            marginX = 0.18 / group.scale.x,
            marginZ = 0.18 / group.scale.z;
          if (
            point.x > localBounds.min.x - marginX &&
            point.x < localBounds.max.x + marginX &&
            point.z > localBounds.min.z - marginZ &&
            point.z < localBounds.max.z + marginZ
          ) {
            return false;
          }
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
          Math.abs(local.z + wall.thickness / 2) < 0.18 + wall.thickness / 2 &&
          Math.abs(local.x) < wall.length / 2 + 0.1 &&
          (!wall.opening ||
            wall.opening.bottom > 0 ||
            Math.abs(local.x - wall.opening.offset) > wall.opening.width / 2 - 0.18)
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
        wall.elevation.visible = this.mode !== "top";
        wall.plan.visible = this.mode === "top";
        wall.group.visible =
          wall.rooms.some(visible) &&
          !this.options.walls &&
          (this.mode === "walk" || this.mode === "top" || !front);
      }
      for (const object of this.model.objects) {
        if (object.userData.token.name.endsWith("double_awning")) {
          object.visible = visible(object.userData.room) && this.mode !== "top";
          continue;
        }
        if (object.userData.token.name === "kitchen_cabinet") {
          object.visible =
            visible(object.userData.room) &&
            (this.mode !== "top" || object.userData.token.height === 0);
          continue;
        }
        if (
          !object.userData.token.mount ||
          object.userData.token.name === "radiator" ||
          [
            "curtain_pair",
            "air_conditioner",
            "side_awning",
            "retracted_side_awning",
            "builtin_wardrobe",
          ].includes(object.userData.token.name)
        ) {
          continue;
        }
        const wall = this.model.walls.find(
          (entry) =>
            entry.axis !== "diagonal" &&
            entry.sides.get(object.userData.room) === object.userData.token.side &&
            Math.abs(object.position[entry.axis] - entry.position[entry.axis]) <=
              entry.length / 2 + 0.00001,
        );
        if (
          wall &&
          (!wall.group.visible ||
            (this.mode === "top" &&
              !["wall_tv", "air_conditioner"].includes(object.userData.token.name)))
        ) {
          object.visible = false;
        }
      }
      for (const ceiling of this.model.ceilings) {
        ceiling.visible =
          visible(ceiling.userData.room || ceiling.parent.userData.room) &&
          this.mode !== "top" &&
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
          if (group.userData.ceilingFixture && this.mode === "top") {
            group.visible = false;
          }
        }
      }
      for (const label of this.model.labels) {
        label.visible = this.mode === "top" && visible(label.userData.room);
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
      this.sun.shadow.needsUpdate = true;
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
      const shadowState =
        JSON.stringify(this.options) +
        this.mode +
        this.model.walls.map((wall) => Number(wall.group.visible)).join("");
      if (this.shadowState !== shadowState) {
        this.shadowState = shadowState;
        this.sun.shadow.needsUpdate = true;
      }
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
      target.texture.colorSpace = THREE.LinearSRGBColorSpace;
      const { moving } = this,
        previousOutput = this.renderer.getOutputRenderTarget();
      this.moving = false;
      try {
        if (this.quality === "fast") {
          this.renderer.setOutputRenderTarget(target);
        }
        this.renderer.setRenderTarget(target);
        this.render();
        const pixels = await this.renderer.readRenderTargetPixelsAsync(target, 0, 0, width, height),
          packed = new Uint8ClampedArray(width * height * 4),
          stride = this.backend === "WebGPU" ? Math.ceil((width * 4) / 256) * 256 : width * 4;
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
        this.renderer.setOutputRenderTarget(previousOutput);
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
          stride = 512 * 4;
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
        object.traverse((node) => {
          if (node.isInstancedMesh) {
            node.dispose();
          }
        });
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
  const sourceMarks = Object.fromEntries(
      ["comment", "keyword", "number", "link", "separator"].map((name) => [
        name,
        Decoration.mark({ class: `cm-layout-${name}` }),
      ]),
    ),
    sourceMatcher = new MatchDecorator({
      decoration: (match) =>
        sourceMarks[
          match[1]
            ? "comment"
            : match[2]
              ? "link"
              : match[3]
                ? "keyword"
                : match[4]
                  ? "number"
                  : "separator"
        ],
      regexp:
        /(#[^\n]*)|(<(?:https?:\/\/[^>]*|\$\w+)>)|(\b(?:DESIGN|ASSET|LINK|PLACE|ROW|DETAIL|GRID|ROOM|BALCONY|GARDEN|OUTLINE|LABEL|WALLS|DOOR|PASSAGE|SHUTTER|DOORS|WINDOWS|RAILS|RAILING|SPACING|SURFACE|STYLE|MOUNT|LIGHT|LAYOUT|END|AT|FULL|WIDTH|POWER|FLOOR|HEIGHT|SITE|FACADE|ROOF|WALL_THICKNESS)\b)|([+-]?\d+(?:\.\d+)?)|([|]|\.(?=\s*(?:[|]|$)))/giu,
    }),
    sourceHighlighting = ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.decorations = sourceMatcher.createDeco(view);
        }
        update(update) {
          this.decorations = sourceMatcher.updateDeco(update, this.decorations);
        }
      },
      { decorations: (plugin) => plugin.decorations },
    );
  let compileTimer,
    compiledSource,
    editor,
    folded = false,
    previewRevision = 0,
    previewUrl,
    program,
    ready = false,
    revision = 0,
    selectedAsset = "sofa",
    studio;
  const doc = () => editor.state.doc.toString(),
    replaceSource = (source) =>
      editor.dispatch({
        annotations: isolateHistory.of("full"),
        changes: { from: 0, insert: source, to: editor.state.doc.length },
      }),
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
      $("errorLocation").hidden = true;
      const parsed = parseProgram(source);
      $("migrateButton").hidden = Boolean(parseDesign(source));
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
      renderProjectDetails();
      $("roomFocus").replaceChildren(
        new Option("Entire project", ""),
        ...program.rooms.map((r) => new Option(r.label || friendly(r.name), r.name)),
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
      const formatArea = (area) =>
          `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(area)} m²`,
        { indoor, outdoor, total } = program.areas;
      $("projectSummary").textContent = outdoor
        ? `${formatArea(indoor)} indoors · ${formatArea(outdoor)} outdoors · ${formatArea(total)} total`
        : `${formatArea(total)} total`;
      $("designStatus").textContent = "Preview up to date";
      $("designStatus").dataset.state = "ready";
      try {
        localStorage.setItem("interior-studio-draft", source);
      } catch {
        status("Browser storage unavailable. Use Share design to save your design.");
      }
    } catch (error) {
      if (version === revision) {
        status(`${error.message}${program ? " · Showing the last valid layout." : ""}`, true);
        $("errorLocation").hidden = !error.line;
        $("errorLocation").dataset.line = error.line || "";
        $("errorLocation").textContent = `Go to line ${error.line}`;
        $("designStatus").textContent = "Check layout source";
        $("designStatus").dataset.state = "error";
      }
    } finally {
      if (version === revision) {
        progress("");
      }
    }
  }
  function renderProjectDetails() {
    $("projectDetailsContent").replaceChildren();
    $("projectDetailsButton").disabled = program.details.length === 0;
    $("projectDetailsButton").hidden = program.details.length === 0;
    const scopes = [...new Set(program.details.map((detail) => detail.room))];
    for (const scope of scopes) {
      const section = document.createElement("section"),
        heading = document.createElement("h3"),
        list = document.createElement("ul");
      heading.textContent =
        scope === "project"
          ? "Project"
          : program.rooms.find(({ name }) => name === scope)?.label || friendly(scope);
      for (const detail of program.details.filter((item) => item.room === scope)) {
        const item = document.createElement("li"),
          text = document.createElement("span");
        text.textContent = detail.text;
        item.append(text);
        if (detail.url) {
          const link = document.createElement("a");
          link.href = detail.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "Product reference ↗";
          item.append(link);
        }
        list.append(item);
      }
      section.append(heading, list);
      $("projectDetailsContent").append(section);
    }
  }
  function clearSelection() {
    $("selectionCard").hidden = true;
  }
  function selectObject(group) {
    clearSelection();
    if (!group) {
      return;
    }
    const { token } = group.userData;
    if (token.url) {
      const link = document.createElement("a");
      link.href = token.url;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      link.textContent = "Product reference ↗";
      link.setAttribute("aria-label", `View product reference for ${friendly(token.name)}`);
      $("selectionCard").replaceChildren(link);
      $("selectionCard").hidden = false;
    }
    if (token.text && doc() === compiledSource) {
      const line = editor.state.doc.line(token.line);
      editor.dispatch({
        effects: EditorView.scrollIntoView(line.from, { y: "nearest" }),
        selection: { anchor: line.from + token.start, head: line.from + token.end },
      });
    }
  }
  function syncView(mode) {
    $("viewport").dataset.mode = mode;
    const touch = matchMedia("(pointer:coarse)").matches;
    $("navigationHint").textContent =
      mode === "walk"
        ? touch
          ? "Drag to look · Use arrows to move"
          : "Drag to look · WASD to move · Esc to leave"
        : mode === "top"
          ? touch
            ? "Drag to pan · Pinch to zoom"
            : "Drag to pan · Scroll to zoom · Click an object to find its source"
          : touch
            ? "Drag to orbit · Pinch to zoom"
            : "Drag to orbit · Scroll to zoom · Click an object to find its source";
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
    if (/kitchen|fridge|stove|sink|coffee|hood/u.test(name)) {
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
    $("assetContext").textContent =
      "Copy a token and edit the design source to place or change assets.";
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
        if (
          !/^(LAYOUT|ROOM|BALCONY|GARDEN)\b/iu.test(line.text.trim()) ||
          (!/^\s*DESIGN\s+2\s*(?:#.*)?$/imu.test(state.doc.toString()) &&
            !/^LAYOUT\b/iu.test(line.text.trim()))
        ) {
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
          history(),
          drawSelection(),
          highlightActiveLine(),
          foldGutter(),
          folding,
          sourceHighlighting,
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
              $("designStatus").textContent = "Updating preview…";
              $("designStatus").dataset.state = "pending";
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
      $("designStatus").textContent = "Preview unavailable";
      $("designStatus").dataset.state = "error";
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
    $("migrateButton").addEventListener(
      "click",
      guarded(() => {
        replaceSource(migrateDesign(doc()));
        compile();
      }),
    );
    $("formatButton").addEventListener(
      "click",
      guarded(() => {
        replaceSource(formatDesign(migrateDesign(doc())));
        compile();
      }),
    );
    $("errorLocation").addEventListener("click", () => {
      const number = Number($("errorLocation").dataset.line);
      if (!number || number > editor.state.doc.lines) {
        return;
      }
      const line = editor.state.doc.line(number);
      editor.dispatch({
        effects: EditorView.scrollIntoView(line.from, { y: "center" }),
        selection: { anchor: line.from, head: line.to },
      });
      editor.focus();
    });
    $("foldButton").addEventListener("click", () => {
      folded = foldedRanges(editor.state).size > 0;
      if (folded) {
        unfoldAll(editor);
      } else {
        foldAll(editor);
      }
      const label = folded ? "Fold layout sections" : "Unfold layout sections";
      $("foldButton").setAttribute("aria-label", label);
      $("foldButton").title = label;
      $("foldButton").setAttribute("aria-pressed", String(!folded));
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
      studio.keys.clear();
      $("assetBrowser").showModal();
      showAssetResults();
      selectAsset(selectedAsset);
    });
    $("projectDetailsButton").addEventListener("click", () => $("projectDetails").showModal());
    $("closeProjectDetails").addEventListener("click", () => $("projectDetails").close());
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
        $("sceneOptions").open = false;
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
    document.addEventListener("pointerdown", (event) => {
      if ($("sceneOptions").open && !$("sceneOptions").contains(event.target)) {
        $("sceneOptions").open = false;
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
        formatDesign,
        legacyExamples,
        migrateDesign,
        parseDesign,
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
    document.querySelector("#designStatus").textContent = "Studio unavailable";
    document.querySelector("#designStatus").dataset.state = "error";
  });
