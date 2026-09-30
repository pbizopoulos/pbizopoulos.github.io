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
