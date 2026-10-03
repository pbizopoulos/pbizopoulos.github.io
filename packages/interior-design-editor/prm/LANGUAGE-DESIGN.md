# DESIGN 2: design decisions and verification

## Objective

Optimize authoring and maintaining the editor's existing interiors. Preserve their evaluated scenes and product metadata. Evaluate the four bundled examples rather than inventing a tiny example that favors a proposed syntax.

“Optimal” here has measurable, bounded meaning: fewer UTF-8 source bytes for every example, no empty-cell bookkeeping in these sparse scenes, fewer duplicated product definitions, consistent coordinate interpretation, and correct source mapping. It does not mean a mathematically shortest encoding, a proven usability improvement in a user study, or faster parsing.

## What the existing corpus needed

The Apartment uses a non-round grid size, fractional outlines and wall positions, millimetre-scale offsets, repeated product URLs, attached tableware and a hose underneath a chair. These make it a useful stress case: rounding values, flattening attachments, replacing every grid with positions, or changing wall attachment semantics would alter its design.

The smaller examples reveal the basic authoring overhead. The Bedroom has just three pieces of furniture but 53 empty cells. Kitchen & dining has seven furniture items spread across 49 empty cells. Small apartment has 99 empty cells. The Apartment adds another 157. Moving a furniture token in these documents requires maintaining surrounding cell counts.

## Decisions and alternatives

| Decision                                          | Reason and tradeoff                                                                                                                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version header, `DESIGN 2`                        | Allows changed units and scope without reinterpreting old drafts or shared links. Old source still uses the original parser.                                                                                  |
| `ROOM … END` owns its furniture                   | Keeps dimensions, openings and placement together. Prevents properties accidentally attaching to the previous room. Adds a closing line but removes the separate room-layout heading.                         |
| Explicit `m`, `cm`, `mm`, `g`                     | Avoids a hidden unit mode. Allows exact legacy grids as well as measured interiors. More characters than bare numbers, fewer interpretive rules.                                                              |
| Centre coordinates for PLACE/LIGHT/MOUNT/openings | Removes the half-cell discrepancy between mounts/lights and openings. Corners remain appropriate for room origins and polygon points.                                                                         |
| `PLACE token AT x,zunit`                          | Makes position edits local and allows continuous placement and several objects within one cell. Explicit words cost characters but are searchable and understandable.                                         |
| Keep `ROW` and nested `LAYOUT`                    | Dense grids can be shorter than coordinate lists. Nested grid shape affects child placement and cannot be discarded. The migrator compares sparse/dense lengths per room, while preserving reused room grids. |
| Retain compact furniture modifiers                | Existing users know `@`, `~` and `[size]`; replacing every modifier with long clauses made actual product-heavy examples larger. Units clarify the brackets without expanding every item into a block.        |
| Named `ASSET` definitions                         | Share model, size and URL across instances. Separate placement from reusable identity. Overrides are explicit and references are resolved before scene construction.                                          |
| Named `LINK` definitions                          | The same manual can appear on different models and in project notes. Asset reuse alone cannot remove that duplication.                                                                                        |
| Definitions before use                            | Avoids ambiguous resolution, recursive macros and implicit dependency reordering. No general arithmetic, loops or constraints in this version.                                                                |
| Preserve legacy scene defaults                    | Keeps migration small and predictable. Defaults remain documented, including three-sided indoor rooms. Fully enclosed examples explicitly say `WALLS all`.                                                    |
| Source-located syntax tree and lowering           | Separates version-2 syntax from the existing semantic/geometry validation. Reuses tested support-edge, polygon, overlap and instance-budget rules.                                                            |
| Source mapping after validation                   | Every rendered object selects its original token, including aliases and mounts. Errors and warnings point to the user's document, not generated legacy source.                                                |
| Formatting separate from migration                | Formatting preserves tokens and comments. Migration may remove redundant defaults and hoist comments; it is undoable and preserves the evaluated scene.                                                       |

A generic JSON/YAML scene schema would provide explicit structure but introduce substantial punctuation/property repetition and lose the useful compact furniture notation. A constraint solver (`chair beside table`, automatic packing, implicit room adjacency) would add unresolved placement and conflict behavior. Neither was necessary to improve these examples; both would need separate requirements and verification.

## Implementation boundary

The editor's pure core exposes `parseDesign`, `parseProgram`, `migrateDesign`, `formatDesign` and `modernExamples`. `parseDesign` returns a source-located block tree and lowered statements. `parseProgram` dispatches legacy documents unchanged or compiles DESIGN 2 into the same validated scene model. Direct placement adds an explicit physical centre to a furniture token; the shared placement function consumes it before applying offsets and wall alignment.

The renderer and asset geometry are not rewritten. Fractional version-2 lights are translated into the legacy cell-centre convention; legacy documents still reject fractional or negative light indices. The code editor gains room folding, language keywords, formatting, undoable upgrades, and navigation to error lines. Existing example names, saved drafts and sharing continue to work.

## Corpus results

Metadata and product references are retained. Counts exclude an optional final file newline, consistently for both versions.

| Example          | Original UTF-8 bytes | DESIGN 2 bytes | Reduction | Nonblank lines | Empty cells |
| ---------------- | -------------------: | -------------: | --------: | -------------: | ----------: |
| Apartment        |               10,968 |          9,995 |      8.9% |      208 → 141 |     157 → 0 |
| Bedroom          |                  782 |            611 |     21.9% |        21 → 15 |      53 → 0 |
| Kitchen & dining |                  694 |            629 |      9.4% |        18 → 18 |      49 → 0 |
| Small apartment  |                1,454 |          1,153 |     20.7% |        45 → 33 |      99 → 0 |

The Kitchen has one extra blank separator line. It improves source size and placement clarity, not total physical line count. The Apartment's large amount of retained prose and unique URLs limits its percentage reduction; deleting that information would be an unfair comparison.

Maintenance benefits are structural: a direct position changes on one line, with no empty-cell edits; changing a shared chair model/size/link changes one definition; room renaming no longer requires a separate room `LAYOUT` header. Names in metadata and explicit references still require deliberate updates—there is no claim of automatic semantic refactoring.

The compiler does more work than the old parser: scanning, alias expansion, lowering and source mapping. `metrics.json` records median and p95 timings over 100 parses after 15 warm-ups. This is an authoring optimization, not a parser speed optimization. Timings are machine- and load-dependent; no timing assertions are used as correctness tests.

## Verification

`language.test.mjs` compares the complete normalized scene data for all four originals and migrations: room geometry, outlines, openings, supporting edges, wall partitions, fixture settings, furniture dimensions and physical transforms, attachments, metadata and URLs. Only source locations and equivalent sparse-grid storage are excluded; floating-point values are compared at nanometre precision.

Further cases cover explicit units, centre coordinates, same-cell objects, alias overrides, shared links, comments/escaped strings/CRLF, source selection spans, invalid scope and measurements, instance/light/cycle budgets, old-language compatibility, empty/dense rooms, repeated property overrides, reused room layouts and very small decimals. Sixty deterministic generated scenes vary grids, floors, room coordinates and furniture rotations. Migration and formatting are checked for idempotence.

`language-review.mjs --render` compiles both versions in a real browser. It compares actual rendered object world matrices and product references, captures the renderer's PNG output, and measures pixel differences. It then generates an offline HTML report and side-by-side source/render PNGs. Apartment illustrations explicitly show the balcony excerpt; full sources and all-room transform comparisons remain available.

See [the report](./language-review/index.html) and [machine-readable results](./language-review/metrics.json). Reproduction commands:

```sh
node --test packages/interior-design-editor/prm/layout.test.mjs packages/interior-design-editor/prm/language.test.mjs
node packages/interior-design-editor/prm/language-review.mjs
# Serve the repository on port 8765, then:
node packages/interior-design-editor/prm/language-review.mjs --render
# Existing broad renderer suite:
INTERIOR_BACKEND=webgl node packages/interior-design-editor/prm/validate-renderer.cjs
```

Browser scripts use `playwright` by default. `PLAYWRIGHT_MODULE` and `CHROME_PATH` select existing installations. The report uses WebGL 2 by default and accepts `INTERIOR_BACKEND=webgpu`. The production editor continues selecting its normal WebGPU/fallback backend.

## Completed verification run

- 70 parser, migration and geometry tests passed, including the original 46 tests and 60 generated-scene cases inside the language suite. The new Nix check runs both test files.
- The language UI suite passed with both WebGL and WebGPU configurations: upgrade, undo/redo, folding, formatting, source selection, error navigation, saved drafts, shared-document reload and mobile controls.
- The existing native WebGPU asset/regression suite passed: all four examples, geometry and walkability assertions, asset previews, live edits, failure recovery, PNG exports, sharing and mobile layout.
- All four old/new comparison pairs have zero changed pixels, zero object world-matrix differences, and byte-identical PNG files. Each capture contains 955,500 pixels. The Apartment image shows its balcony; semantic comparisons and object matrices cover the full seven-room design.
- Formatting checks, JavaScript lint and `git diff --check` passed.

The older suite contained stale Apartment assertions: it expected two passages and two wall sconces, but the original source already contains three of each. Its table-access probe also tested only a chair-occupied front point; the probe now permits side access, as it already did for beds. These test corrections do not change the sample design or renderer.

A separate full high-quality WebGL run timed out while waiting for damped camera panning to settle in the headless software renderer. It is not counted as a passing full-quality run. WebGL language workflows and all four image comparisons passed; the native WebGPU asset/regression run completed. This distinction avoids claiming unperformed or incomplete quality coverage.
