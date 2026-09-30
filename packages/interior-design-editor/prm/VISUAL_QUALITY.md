# Mediterranean reference study

The bundled three-level apartment is an estimated visual study of the supplied
photographs, not a measured reconstruction. The loft, cream kitchenette, canopy
bed, balcony, garden and terrace furniture share a restrained palette of warm
plaster, honey timber, striped linen, terracotta and greenery. View presets show
the kitchen, loft, bed facing the balcony, and the balcony facing into the room.
The walking camera uses a 60-degree lens; the small kitchen preset uses 75 degrees.

## Rendering decisions

Inspection of [Roometron](https://roometron.com/) and its publicly served example
viewer on September 30, 2026 found separate lighting/occlusion channels, compressed
KTX2 environment resources, GLB scene resources and reflector code. These observations
suggest a combination of prepared materials, static lighting and reflections; they
do not establish the complete production pipeline. No Roometron scene, model,
texture or source implementation is included here.

The editor must render rooms that are edited interactively, so it combines
prefiltered environment lighting, window daylight, sun shadows, warm room fill,
contact shadows and Three.js GTAO ambient occlusion. Three.js
[Reflector](https://threejs.org/docs/pages/Reflector.html) supplies mirrors in
settled High-quality views. Each reflection target is limited to 512 square pixels
with multisampling disabled and one reflection bounce. Balanced/Fast views and
camera movement use the cheaper silver surface. Mirrors release their render targets
when scenes change.

[Discussion feedback](https://news.ycombinator.com/item?id=41180504) informed
visible sample scenes, labelled walking/view controls, natural camera framing,
scene-first mobile layout and an asset browser with category filters and rotatable
previews. Garden scenery remains visible from upper-floor walking views; Top and
3D views still isolate the selected floor. Floor-plan import and billing are outside
this visual-quality change.

## Performance

- Static furniture parts sharing a finish are merged while preserving selectable
  items, doors and collapsible wall groups.
- Rounded silhouettes and curved textile meshes are concentrated on visible hero
  objects. Foliage uses reusable low-poly leaves and merged geometry.
- Render resolution follows the existing quality budgets and drops during movement.
  The scene renderer sleeps when idle. Asset previews render only on changes,
  release mesh buffers when selection changes, and dispose their own environment
  target, controls, observer and WebGL context on close.
- Two local CC0 surface relief maps add about 102 KiB. They load after the initial
  render settles, time out after five seconds, and retain procedural fallbacks.
  Provenance is in [assets/ATTRIBUTION.md](assets/ATTRIBUTION.md).

## Validation

Browser checks cover photo presets, new asset previews, category filtering,
mobile layout, collapsible walls, sample scenes, invalid-source recovery,
image export, idle rendering, mirror quality switching and day/night lighting.
Repeated scene changes are checked for stable renderer geometry/texture counts.
Draw-call and triangle counts are workload measurements, not hardware FPS claims;
the automated browser uses a software GPU.

The canonical repository formatter preserves supporting resources under `prm/`.
The Nix package and Pages workflow both copy this directory. Run `nix fmt` and
`nix build .#interior-design-editor --no-link` before publishing. Also inspect the
bedroom, kitchen, garden and bath at desktop and mobile sizes in all three quality
modes, and verify an exported image.

## Furniture and catalog refinement

The catalog now contains 161 assets, including a bent timber wishbone chair,
round pedestal dining table, upholstered bed, modular chaise sofa, ceramic
lamp, woven pendant and arched mirror. Static pieces share the existing cached
furniture templates. Light fixtures now merge their opaque meshes as well;
the woven pendant needs five object draws instead of 32 (excluding the studio
shadow). Mirror templates stay uncached so each reflector owns its target.

Reduced back-facing daylight fill restores interior contrast. Neutral scanned
timber grain and roughness retain editable material tints; terracotta has a
richer earth palette. Seats use soft cushion meshes, and draped covers and
rolled towels have low-cost asymmetric folds. Pulled-aside curtains expose
French-door frames more clearly.

The desktop source panel defaults to 30% and has a pointer/keyboard resizable
divider. Hovering furniture highlights its source without opening the panel;
Edit cell reveals the source deliberately. Assets has category counts and a
static thumbnail atlas alongside one live preview, retaining names and live
previews if thumbnails cannot load.

## Settled-view ambient occlusion

Three.js [GTAOPass](https://threejs.org/docs/pages/GTAOPass.html) replaces the
hand-written ambient occlusion kernel. It reuses the scene depth prepass and
reconstructs normals from depth, then denoises the result. Balanced uses 12 AO
samples; High uses 24. Both run at no more than half linear resolution and
500,000 pixels. Moving and Fast views bypass it; switching to Fast releases
its targets. Quality switching returns to stable geometry/texture counts and
still views stop drawing. The compositor keeps AO bounded to avoid black halos.

Opaque batches that are entirely indexed preserve their vertex indices;
heterogeneous batches retain the existing non-indexed compatibility path.
This lowers repeated foliage vertex storage without changing the silhouette.

## Editing and composition polish

Furniture details include an undoable size/rotation form with the same 0–10 m
bounds as the layout parser. Wall attachments retain their direction during
resizing, and child layouts and product links remain intact. CodeMirror's undo
and redo commands are available from the scene view as well as the source panel;
text inputs retain their own editing shortcuts. Attached objects explain their
locked direction. The details card scrolls within short/mobile viewports.

Nested furniture positions use their parent's canonical model coordinates before
parent scaling, so resizing a table no longer applies its height twice to objects
on top. Upholstered beds and modular sofas expose their actual cushion support
height instead of placing child objects above the back/headboard.

A Warm modern apartment example combines the new dining, seating and bedroom
assets. Its explicit woven pendant/downlight arrangements and three interior
presets make the catalog easier to assess in context. The default orbit frames
single rooms more tightly and uses a steeper view with a smaller scenery allowance
for apartments. Reference photo presets retain their authored walking positions.

Olive/citrus crowns and background scenery trees use irregular low-poly foliage
clusters rather than a single sphere. These remain merged by finish and cast
shadows without alpha-tested foliage textures. Pointer picking traverses visible
meshes before raycasting, excluding hidden floors and reflection/contact helpers.

The independent visual review caught wall-attachment rotation incompatibility,
parser size-limit mismatches, clipped asset labels, a sofa platform silhouette,
and details-card overflow; those findings were addressed before publishing.

Upholstery piping follows the cushion mesh's own outline with a small clearance,
instead of a separate rounded rectangle that intersects curved cushions. The
same treatment applies to standard sofas/armchairs, pillows, beds, benches,
poufs and tufted/convertible sofas. Living/dining presets stand farther back to
fit the featured furniture groups, and the showcase living room uses timber
rather than outdoor-style irregular stone flooring.

## Surface scale and textile silhouettes

Timber floors share an oak board field with staggered joints and varied grain
strips, using the existing CC0 scans. The three optional local floor maps add
about 98 KiB; procedural maps remain available if a scan fails. Roughness uses
256 square pixels, while color/height use 512. Replaced fallback GPU textures
are disposed once no material references them. Floors use one surface mesh per
stair-opening fragment instead of hundreds of modeled plank boxes. Horizontal
UVs share world coordinates so boards/grout stay continuous around stair holes.

Stone and terracotta now use separate color, shallow grout-height and roughness
maps. Restrained tile brightness and broad mineral variation reduce checkerboard
repetition. These are shared 512-pixel procedural textures; no per-tile geometry
or extra render pass is required. Kitchen/bathroom automatic floors use the tile
material instead of a flat fill.

Curtains have varying fold phase/amplitude, a gentle taper, an uneven hem and
small hanging rings. Bedding has broader diagonal creases and asymmetric side
hang, baked into its static mesh. Contact footprints also cover the new seating,
bed, dining and bench assets. The critic reviewed all reference views and found
no blocking visual issues.

Before/after Fast-view workload checks at 960×640 showed Bedroom dropping from
152 to 148 draws and 20,550 to 17,262 triangles. The two-room showcase retained
331 draws; the three-floor overview added two draws and approximately 1.5%
triangles. These measurements include the renderer's passes and use a software
GPU; they are not hardware FPS claims. Optional-map failure, color spaces,
collision warnings and idle sleep are checked separately.

## Human scale

Indoor rooms default to 2.6 m ceiling clearance. Explicit HEIGHT directives
remain authoritative, including the taller 3.8 m loft. Walk, photo-view, tour,
room-focus and floor-transition cameras share a 1.80 m eye-height constant;
floor detection subtracts the same value before choosing a storey. Storeys
remain 3 m apart, leaving space for slabs/services above a standard ceiling.

Ceiling fixtures now offset from their own declared model height, removing the
previous 5 cm mounting gap and keeping them attached when HEIGHT changes.
Standard doors use approximately 2.1 m leaves with complete headers; French
doors retain taller glazed leaves. Door picking, frames and daylight openings
use the same opening height. Default columns, archways and the fireplace hood
also fit the standard ceiling rather than protruding into it.


## Finished edges and exterior sightlines

Broad thin wood, enamel and white furniture surfaces receive a 2.5 mm bevel,
using Three.js RoundedBoxGeometry. Narrow slats, legs, handles and structural
parts keep inexpensive boxes. Hard solid corners use 12 mm radii; upholstered
forms retain their softer treatment. The initial broad bevel scope exceeded the
geometry budget and was narrowed before shipping.

Grass-site perimeter trees follow exterior openings, with a site-size/storey
budget of four to eight trees. Height and canopy width are independent: upper
floors get taller trunks rather than giant crowns. Smaller asymmetric clusters,
visible branches and double-sided leaf tufts break up silhouettes. Two shared
leaf finishes and bark are merged into three meshes, adding only one draw over
the previous two-material planting. Window glass is less heavily tinted.

The final representative Fast-view comparison added one draw per scene. Bedroom
used 20,646 triangles (previously 17,286); the showcase used 103,646 (97,742);
the three-level overview used 318,210 (298,326). No collision warnings or browser
errors occurred, and the renderer returned to sleep after settling. These are
software-GPU workload measurements, not hardware frame-rate measurements.


## Room controls and pointer workload

Room selection cards show the room name, width/depth, indoor ceiling clearance
and storey. Their existing expandable adjustment pattern now includes ceiling
height (2.4–6 m), style and floor finish; outdoor areas omit ceiling height.
Native labelled fields and the same Apply button follow the furniture controls.
Style and floor choices share the parser's supported option lists. Changes use
one CodeMirror transaction, preserve inline comments and other rooms, and replace
the final effective directive instead of appending repeated overrides. Missing
directives are inserted beneath the room header. Undo/redo remains available.
The source panel is revealed only by the explicit edit-definition action.

Source parsing for these controls happens on Apply rather than hover. Pinned
selection, active scene builds and uncompiled source skip viewport ray picking;
orbit drags also skip hover picking. Pointer movement no longer requests a full
render by itself. Camera changes, changed hover outlines and actual control
changes still request rendering. Browser checks verify zero picking calls and
no extra rendered frames during pinned pointer movement, while normal hovering,
source recompilation and 1.80 m walking remain functional.

Room-control checks cover invalid height rejection, new/replaced directives,
other-room preservation, history, duplicate effective directives and inline
comments, outdoor finishes, viewport fit at 390 px and idle sleep. The independent
critic found no material clarity or consistency issues in desktop/mobile views.
