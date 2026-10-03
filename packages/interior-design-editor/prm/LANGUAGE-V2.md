# Interior layout language — DESIGN 2

DESIGN 2 describes the same scenes as the original editor with explicit units, scoped rooms, direct furniture placement and reusable definitions. Existing source and shared links without a version header still use the original language.

```text
DESIGN 2
GRID 50cm
ASSET dining = kitchen_chair[52x51x79cm]<https://example.com/chair>

ROOM kitchen 4x3.5m AT 0,0m
  WALLS all
  SURFACE tile
  DOOR south AT 2m WIDTH 85cm
  LIGHT ceiling_light AT 2,1.75m POWER 18
  PLACE kitchen_table AT 2,2.5m
  PLACE dining AT 2,1.5m
  PLACE dining@90 AT 1,2.5m
  PLACE dining@270 AT 3,2.5m
END
```

The editor starts its bundled examples in DESIGN 2. **Upgrade language** converts a valid older document; **Format** upgrades if necessary and indents blocks. Ctrl/Cmd+Z undoes either action. Ctrl/Cmd+Enter renders immediately. Invalid source leaves the last valid scene visible, and **Go to line** selects the offending source line.

## Coordinates and units

- `m`, `cm`, `mm`: physical lengths. `g`: drawing-grid units, whose size is set by `GRID`. Keywords and units are case-insensitive.
- A unit suffix applies to the entire vector: `150,200cm`, `4x3m`, `50x60x80cm`. Do not write `150cm,200cm` or `4mx3m`.
- All explicit lengths require a suffix. Furniture sizes, offsets, heights, widths, grid size, railing spacing and wall thickness require physical units. Room sizes, outlines and positions, object positions, labels, openings and wall positions may also use `g`.
- Coordinates are `x,z`: x increases east/right, z increases south/down in floor-plan view. Room positions use the project origin. Positions inside a room use its northwest bounding-box corner, including rooms with polygonal outlines.
- `PLACE` and `LIGHT` locate the **object centre**. `MOUNT ... AT` and `DOOR ... AT` measure the **centre along the wall**, starting from the minimum coordinate of the room bounding box. There is no implicit half-cell adjustment in DESIGN 2.
- North/south walls measure their along-wall position in x; east/west walls in z. These are coordinates, not distances walked around a polygon. Outlines and supporting edges retain the original renderer's rules.
- Angles use the compact `@degrees` modifier. Bare `POWER` is the renderer's intensity parameter, not a calibrated wattage.
- `GRID` defaults to `0.82m`. Declare it once, before any room. Changing it scales `g` coordinates and dense-grid spacing; physical sizes and `m` coordinates retain their physical values.
- Numbers are decimal, optionally negative where supported; exponent notation, expressions and non-finite values are not accepted.

## Blocks and scope

```text
ROOM living 8x6g AT 0,0g
  LABEL "Living room" AT 4,3g
  WALLS all
  WINDOWS north west
  PLACE sofa~west AT 1.5,3.5g
END

BALCONY terrace 4x8g AT 8,0g
  WALLS west
  RAILS north east south
  SURFACE tile
END
```

`ROOM`, `BALCONY`, `GARDEN`, and reusable `LAYOUT` definitions each end with `END`. Room properties and furniture belong inside their room block. Blocks do not nest. An empty room is valid and needs no placeholder layout. Room/layout identifiers share the legacy namespace and must be unique as applicable.

`FLOOR`, `DETAIL`, `SITE`, `FACADE`, `ROOF`, `WALL_THICKNESS`, `ASSET`, `LINK` and `GRID` belong at the top level. `FLOOR n` applies to subsequent rooms until changed; floor elevations remain `n × 3m`.

Comments start with `#` outside quoted strings and `<links>`. Labels and detail text use JSON double-quoted strings, including JSON escaping.

## Furniture

```text
PLACE sofa AT 2,1.5m
PLACE chair@35 AT 1,2m
PLACE bed[160x200x56cm]~south AT 3,2m
PLACE desk(work_on_top) AT 2,2m
PLACE chair(hose_underneath) AT 1,1m
```

`PLACE token AT x,zunit` gives a continuous position. Several objects may occupy the same drawing-grid cell. Overlaps and furniture extending outside the room produce warnings; supporting-wall failures remain errors.

A token is an asset name followed by optional modifiers:

| Modifier                             | Meaning                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `[widthxdepthxheightm]`              | Override the model dimensions; any physical suffix works.                                         |
| `@angle`                             | Rotate in degrees using the existing renderer's orientation.                                      |
| `~north`, `~east`, `~south`, `~west` | Align against a supporting wall, with automatic rotation and existing clearance.                  |
| `[dx,dzm]`                           | Add a physical offset. For wall-aligned objects, only the along-wall component affects placement. |
| `(layout_on_top)`                    | Attach a nested arrangement on top of the model.                                                  |
| `(layout_underneath)`                | Attach an arrangement at its base.                                                                |
| `<https://...>`                      | Product reference; does not import a 3D model.                                                    |
| `<$reference>`                       | Use a named `LINK`.                                                                               |

Modifiers may appear in any order. Each kind may appear once. `@` and `~` cannot be combined. Sizes are width/depth/height; scene transforms use x/y/z internally. Model default dimensions come from the asset catalog. Use explicit dimensions when an item must retain a fixed size independently of catalog defaults.

Wall alignment intentionally overrides the perpendicular coordinate. For example, `sofa~west AT 1,2m` takes its position along the west wall from z = 2m. The x coordinate does not set a wall gap; the existing placement clearance does.

## Reusable assets and links

```text
LINK manual = <https://example.com/product#specifications>
ASSET dining = kitchen_chair[52x51x79cm]<$manual>
DETAIL project "Chair specifications" <$manual>

ROOM dining_room 4x4m AT 0,0m
  WALLS all
  PLACE dining AT 1,1m
  PLACE dining@180 AT 1,3m
  PLACE dining[60x55x85cm] AT 3,3m
END
```

Definitions must precede use. Asset and link names are case-insensitive and occupy separate namespaces. An `ASSET` name cannot shadow a catalog name or legacy numeric alias. An asset defines a model, size and optional product URL; rotation, wall alignment, offsets and nested layouts belong to instances. An instance can override its definition's size or URL. A definition can reuse an earlier asset; recursive and forward definitions are not supported.

`LINK` values must be HTTP(S) URLs without credentials. References in prose are literal; only a link position resolves `<$name>`.

## Dense grids and nested arrangements

Use `ROW` inside a room when a compact drawing grid is easier than coordinates:

```text
DESIGN 2
GRID 1m
ROOM study 4x4g AT 0,0g
  ROW . | . | .
  ROW . | desk(work_on_top) | .
END

LAYOUT work
  book | mug
END
```

Each `ROW` advances one cell row from the northwest corner. The first cell centre is `0.5,0.5g`. `.` is empty; the legacy `-` and `0` alternatives remain accepted. Use either `ROW` or `PLACE` in one room, not both. A room need not fill every cell.

A reusable `LAYOUT` retains the original cell syntax without `ROW`. Its full row/column shape matters: the renderer distributes its items over their parent's footprint. Empty edge cells must therefore remain intact. Layouts may refer to other layouts up to four levels, without cycles. A room layout may be reused as an arrangement when represented with `ROW`; direct `PLACE` rooms are not reusable arrangements.

## Room and project statements

| Statement                            | Example / meaning                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `LABEL`                              | `LABEL "Kitchen" AT 2,1m`; position optional.                                                                          |
| `OUTLINE`                            | `OUTLINE 0,0g 6,0g 6,6g 3,6g 3,3g 0,3g`; one simple polygon inside the room bounds.                                    |
| `WALLS`, `WINDOWS`, `DOORS`, `RAILS` | Direction list, `all` or `none`. Plural `DOORS`/`WINDOWS` retain automatic placement.                                  |
| `DOOR`, `PASSAGE`, `SHUTTER`         | `DOOR south AT 2m WIDTH 85cm`; `SHUTTER east FULL` spans a supported edge.                                             |
| `HEIGHT`                             | `HEIGHT 2.8m`; room height.                                                                                            |
| `SURFACE`                            | `auto`, `wood`, `tile`, `stone`, `grass`, `terracotta`, `concrete`.                                                    |
| `STYLE`                              | `warm`, `blue`, `neutral`, `liminal`, `industrial`, `aquatic`, `mediterranean`.                                        |
| `MOUNT`                              | `MOUNT north AT 2m mirror HEIGHT 1m`; HEIGHT sets the bottom of the item, optional asset-specific default.             |
| `LIGHT`                              | `LIGHT downlight AT 2,1.5m POWER 12`; POWER defaults to 18.                                                            |
| `RAILING`                            | `RAILING horizontal silver SPACING 1.5m`; balcony only, orientation `horizontal`/`vertical`, finish `silver`/`timber`. |
| `FLOOR`                              | `FLOOR -1`; subsequent rooms use that floor.                                                                           |
| `DETAIL`                             | `DETAIL project "Notes"` or `DETAIL bedroom "Product" <https://example.com>`; retained in project details.             |
| `WALL_THICKNESS`                     | `WALL_THICKNESS 24cm 12cm`; exterior then interior.                                                                    |
| `SITE`                               | `SITE grass 5m`; `none`, `grass`, `paving`, `sand`; optional margin.                                                   |
| `FACADE`                             | `none`, `plaster`, `brick`, `timber`, `concrete`.                                                                      |
| `ROOF`                               | `none`, `flat`, `pitched`, `terracotta`; shape restrictions unchanged.                                                 |

Legacy defaults remain: indoor room walls north/east/west, wood flooring, warm style, 2.6m height, no openings. Balcony defaults include east/south/west rails and no walls. Gardens default to grass and no walls. Use `WALLS all` for an enclosed room. Explicit properties may override earlier settings in the same block; repeated definitions and duplicate geometry statements still follow legacy validation.

## Bounds and compatibility

Existing scene limits still apply: at most 32 rooms, each 2–40 grid units per side; project bounds at most 40×40 grid units; grid 0.2–3m; floors −8 through 31; at most 1,024 expanded furniture instances and 64 fixtures. Sizes must be positive and no more than 10m per component; offsets are within ±10m; direct coordinates within ±120m. Opening widths, ceiling heights, supporting edges and polygon validation retain their existing limits.

Migration preserves evaluated scene geometry, product references and detail text. It removes redundant catalog-size overrides and default properties, extracts repeated assets/URLs only when they save source, and chooses direct placement or a dense grid by source length. It retains grid shape when a room layout is reused. Comments are retained but may move to the document header; migration is a semantic conversion, not a lossless text-formatting operation. Formatting DESIGN 2 changes indentation and surrounding whitespace, not token spelling, numeric precision, prose or comments.

The migrated Apartment deliberately retains its precise grid size and offsets. Do not round those measurements merely to shorten the text: some objects sit at validation boundaries.

See [the illustrated comparisons](./language-review/index.html) and [design decisions](./LANGUAGE-DESIGN.md).
