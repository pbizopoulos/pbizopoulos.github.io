# JSON interior designs — version 3

Describe the floor plan, reusable assets and named instances in strict JSON. The default **Automatic living room** example mixes fixed and automatic furniture. Existing DESIGN 2 and legacy sources still render; see the [DESIGN 2 guide](./LANGUAGE-V2.md).

```json
{
  "version": 3,
  "units": "m",
  "placement": { "algorithm": "wall-first", "clearance": 0.15 },
  "floorPlan": {
    "rooms": {
      "living": {
        "size": [5, 4],
        "origin": [0, 0],
        "openings": [{ "type": "door", "wall": "south", "at": 2.5, "width": 0.9 }]
      }
    }
  },
  "assets": {
    "sofa": { "model": "sofa", "size": [2.2, 0.9, 0.85] },
    "chair": { "model": "chair" }
  },
  "instances": {
    "livingSofa": {
      "asset": "sofa",
      "room": "living",
      "placement": { "position": [2.5, 0.6], "rotation": 0 }
    },
    "readingChair": { "asset": "chair", "room": "living" }
  }
}
```

## Coordinates and references

All lengths are metres. `units` is optional and only accepts `"m"`. Positions are `[x, z]`, with x east/right and z south/down. Room `origin` is the northwest bounding-box corner in project coordinates, default `[0, 0]`. Object positions are centres relative to that room corner. Asset `size` is `[width, depth, height]`; omission uses catalog dimensions. Rotations are degrees using the existing renderer's orientation.

An asset's `model` must name a catalog model. Optional `url` retains an HTTP(S) product reference; it does not load a model. Each instance has an `asset` ID and a `room` ID. Reuse an asset by defining several instance IDs. Definitions may appear in any order. Reference IDs are exact and case-sensitive; use lowercase room IDs since the underlying renderer normalizes room names. IDs contain letters, digits or underscores. Unknown properties, duplicate JSON keys, invalid references and wrong types produce source-located errors. JSON comments and trailing commas are unsupported.

## Automatic and manual placement

Omit an instance's `placement`, or give `{}`, to request automatic placement. Project `placement` supplies defaults; room `placement` overrides individual settings.

| Setting     | Default        | Meaning                                                     |
| ----------- | -------------- | ----------------------------------------------------------- |
| `algorithm` | `"wall-first"` | `"wall-first"` or `"grid-pack"`                             |
| `clearance` | `0.15`         | Minimum separation from room edges and furniture, 0–2m      |
| `step`      | `0.1`          | Candidate spacing, 0.05–1m; independent of the drawing grid |

`wall-first` searches supporting walls in north/east/south/west order, then falls back to the grid. Along each wall it scans increasing coordinates and rotates the furniture to face into the room. `grid-pack` scans increasing z, then x, starting at the room origin. Grid candidates try rotations 0°, 90°, 180°, 270°, unless constrained. Both strategies choose the first valid candidate. They are greedy geometric placement methods and do not infer relationships such as chairs surrounding tables.

Instance `placement` accepts:

- `position`: fixes the centre at `[x, z]`. `rotation` defaults to zero. Fixed furniture is reserved before any automatic furniture and is never moved by the algorithms.
- `rotation` without `position`: fixes orientation while the algorithm chooses the position.
- `wall` without `position`: restricts placement to one supporting `"north"`, `"east"`, `"south"` or `"west"` wall. Wall placement sets rotation, so it cannot be combined with `rotation` or `position`.

Automatic candidates must fit the full outline, respect rotated furniture footprints, avoid fixed furniture and substantial mounted cabinetry, and leave space in front of doors, passages and shutters. Opening keep-out depth is the larger of 0.9m and opening width, plus clearance. Between two furniture instances the larger clearance applies. Fixed positions retain their coordinates and receive warnings for overlaps, boundary violations and blocked openings.

Room and instance IDs are sorted lexically, independently of JSON property order. With the same source values, catalog dimensions and implementation, evaluation produces the same placements. Adding or renaming instances can move other automatic instances. The placement search is capped at 200,000 candidates per document; exceeding it produces an error suggesting a larger step or more fixed positions. A failed fit is a warning: the instance remains in the source and is omitted from the rendered scene.

**Freeze placement** writes evaluated positions and rotations into every successfully placed instance. Unplaced instances retain their constraints. The action is undoable. **Format** indents JSON; folding handles objects and arrays. Clicking furniture selects its original instance source. Invalid source leaves the last valid scene visible. Saved drafts and shared links retain JSON verbatim. Older sources keep their existing formatting and upgrade tools.

## Additional floor-plan properties

`floorPlan.rooms` is a map of room IDs to room objects. `size` is required. Indoor rooms default to all four walls, 2.6m height, wood surface and warm style.

| Property                             | Meaning                                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`                               | `"room"` (default), `"balcony"`, or `"garden"`; outdoor defaults match DESIGN 2                                                                                                                                                                                                                   |
| `floor`                              | Integer −8 through 31; elevation is floor × 3m                                                                                                                                                                                                                                                    |
| `walls`, `windows`, `doors`, `rails` | Direction arrays; `[]` removes them. `doors` and `windows` use the renderer's automatic opening positions                                                                                                                                                                                         |
| `height`                             | 2.4–6m                                                                                                                                                                                                                                                                                            |
| `surface`, `style`                   | Same named choices as DESIGN 2                                                                                                                                                                                                                                                                    |
| `outline`                            | 4–32 `[x, z]` polygon points within the room bounding box, reaching every bound                                                                                                                                                                                                                   |
| `label`, `labelPosition`             | Display label and optional room-local `[x, z]` anchor                                                                                                                                                                                                                                             |
| `openings`                           | Up to eight `{ "type": "door", "wall": "south", "at": 2, "width": 0.9 }` objects. Type also accepts `"passage"` and `"shutter"`; width defaults to 0.85m. `at` is the centre along the wall measured from the bounding-box minimum. A full shutter uses `"full": true` and omits `at` and `width` |
| `lights`                             | Up to sixteen `{ "model": "downlight", "position": [2, 2], "power": 18 }` fixtures; power defaults to 18                                                                                                                                                                                          |
| `mounts`                             | `{ "asset": "mirror", "wall": "north", "at": 2, "height": 1 }`; height sets the bottom and may be omitted for the renderer default                                                                                                                                                                |
| `railing`                            | Balcony `{ "style": "horizontal", "finish": "silver", "spacing": 1.5 }`; choices match DESIGN 2                                                                                                                                                                                                   |
| `placement`                          | Room overrides for algorithm, clearance and step                                                                                                                                                                                                                                                  |

Optional project properties: `grid` (default 0.82m), `wallThickness` (`[exterior, interior]`), `site` (`{ "surface": "grass", "margin": 5 }`), `facade`, `roof`, and `details` (array of `{ "room": "project", "text": "Notes", "url": "https://example.com" }`, with optional URL and room). Named finishes and geometry rules match DESIGN 2.

Existing limits apply: at most 32 rooms, 1,024 instances and 64 total fixtures. Each room side spans 2–40 drawing-grid units; the entire floor plan fits 40×40 units. `grid` is 0.2–3m. Grid size affects these bounds, not placement spacing. Asset sizes are 0.001–10m per component. JSON source is limited to 200,000 characters and 64 nesting levels. This initial JSON format does not expose nested furniture attachments; existing documents containing them remain supported in their original format.

## Verification

```sh
node --test packages/interior-design-editor/prm/{layout,language,json}.test.mjs
# Serve the repository on port 8765, then:
node packages/interior-design-editor/prm/json-browser.cjs
node packages/interior-design-editor/prm/language-browser.cjs
```

Browser scripts accept `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `INTERIOR_BACKEND` overrides.
