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
