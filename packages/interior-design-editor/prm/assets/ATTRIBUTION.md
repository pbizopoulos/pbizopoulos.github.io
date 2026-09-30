# Surface maps

These optional local relief maps are derived from Poly Haven assets distributed
under [CC0](https://polyhaven.com/license). The originals were resized from 1024
pixels to 512 pixels, encoded as JPEG at quality 82, and stripped of metadata.
Together they add approximately 102 KiB to a scene load. They retain the editor's
material colors; they supply small-scale surface relief rather than color maps.

- `wood-grain-height.jpg`: displacement map from
  [Wood Table 001](https://polyhaven.com/a/wood_table_001).
- `linen-weave-height.jpg`: displacement map from
  [Rough Linen](https://polyhaven.com/a/rough_linen).

Texture loading happens after initial scene construction, uses local URLs, and
falls back to generated relief if a map is unavailable. No remote asset API is
required at runtime. Reference apartment photographs and Roometron assets are
not redistributed with the editor.

## Timber color and roughness

`wood-grain-color.jpg` and `wood-grain-roughness.jpg` also derive from CC0
[Wood Table 001](https://polyhaven.com/a/wood_table_001). The 1K diffuse map was
resized to 512 pixels, converted to luminance and normalized around 222 (8-bit)
so it supplies real grain variation while the editor supplies the timber color.
The roughness map was resized to 512 pixels. Both use JPEG quality 85 with
metadata removed, adding approximately 93 KiB. Roughness and height are linear
maps; the grain color map uses sRGB. All four maps total approximately 195 KiB.

## Catalog thumbnails

`furniture-thumbnails.webp` is an original atlas rendered from this editor's
procedural furniture with Three.js. Its manifest names each tile explicitly,
so new catalog entries do not shift existing thumbnails. The 161 previews add
approximately 134 KiB and load only when opening Assets. They require no live
renderers per card. Rebuild with `prm/generate-thumbnails.cjs` after changing
furniture silhouettes or materials; see the script header for prerequisites.

## Oak floor boards

`oak-planks-color.webp`, `oak-planks-height.webp`, and
`oak-planks-roughness.webp` combine the same CC0 Wood Table 001 scans into a
2.4 m repeating field of staggered 0.2 m × 1.2 m boards. Each board samples a
different grain strip with restrained tint variation. Color/height maps are
512 square pixels; the roughness map is 256 square pixels. The three maps add
approximately 98 KiB. Height and roughness use linear color space; color uses
sRGB. Board joints are lower in the height map and rougher than the timber.
Rebuild using `prm/generate-surfaces.cjs`; it uses the editor's deterministic
canvas recipe and the attributed scans rather than generating new source imagery.
