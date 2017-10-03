Equality Explorer assets
================

Images for the items in the "Basics" screen are found in `basics-artwork-without-shadow.ai` and
`basics-artwork-shadows.ai`. PNG files were exported with height=100. Some of the PNG files required
additional processing (trimming transparent pixels, resizing to height=100) in Photoshop.

`PlateNode` is composed of scenery Paths that render SVG descriptions of the pieces of the plates, as found
in `inside.svg`, `plate.svg` and `wall.svg`. The contents of `"d=..."` field from these .svg files appears in the code.
The .svg files were created in Illustrator by selecting pieces (subpaths) of `scale.ai` and doing "Save As" SVG.

`OrganizeButton` creates its icon using a scenery Path that renders an SVG description of the icon. The artwork
for the icon appears in `organize-icon.ai`. In Illustrator, `Object > Compound Path > Make` was used to turn the icon
into a single path, then "Save As" `organize-icon.svg`. The contents of the `"d=..."` field appears in the code.
