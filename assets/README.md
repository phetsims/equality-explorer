Equality Explorer assets
================

## Basics screen icons

Images for the items in the "Basics" screen are found in `basics-artwork-without-shadows.ai` and
`basics-artwork-shadows.ai`. Steps to create PNG files from these .ai files:
1. open .ai file in Illustrator
1. select artwork from a layer and copy it to the clipboard (Edit > Copy)
2. paste to a new document (File > New, Edit > Paste)
3. save as PNG with height 200 (File > Save For Web)
4. open the PNG in Photoshop
5. trim transparent pixels around the image (Image > Trim)
6. size the image to height 50 (Image > Image Size)
7. save the PNG (File > Save)

## Balance Scale

File in the "scale" folder contain the artwork for the balance scale's plates. `PlateNode` is composed of scenery `Paths` that render SVG descriptions of the pieces of the plate, as found in `inside.svg`, `plate.svg` and `wall.svg`. The .svg files were created in Illustrator by selecting pieces (subpaths) of `scale.ai` and doing "Save As" SVG. The contents of the `"d=..."` field from these .svg files were copied to strings in `PlateNode.js`.

## Organize button

`OrganizeButton` creates its icon using a scenery `Path` that renders an SVG description of the icon. The artwork
for the icon appears in `organize-icon.ai`. In Illustrator, `Object > Compound Path > Make` was used to turn the icon
into a single path, then "Save As" `organize-icon.svg`. The contents of the `"d=..."` field from `organize-icon.svg` 
was copied to a string in `OrganizeButton.js`.
