# Unchanged projection contract

Run `node scripts/check-projection.mjs input.json`. Node 22+; no dependencies or network. Exit 0 means the stated projection passed. Exit 1 means invalid input or a mismatch. The script reads only the explicitly supplied local JSON file and writes a JSON report to stdout.

Required fields:
- `sourceRows`: original rows, no header; nonempty arrays containing strings, finite numbers or null.
- `columns`: distinct zero-based source column indexes in the intended output order.
- `plottedRows`: rows extracted from the actual rendering configuration or export, no header.
- `numericColumns`: zero-based columns in the projected output expected to contain finite numbers; missing/string numbers require explicit parsing before this stage.

Optional `coordinateScale`: `{xUnits, yUnits, width, height}` using the drawable plot width and height in the same physical unit, not the entire image dimensions. This check applies only to coordinate geometry that should preserve shapes. All four must be finite and positive. It compares width/xUnits with height/yUnits within floating-point tolerance.

The checker requires all source rows, their original order and every repeated row to remain. It performs no selection, sorting, normalization, rounding or aggregation. If a user intentionally selected a row range, `sourceRows` should contain that declared range and the task report should record it. It cannot prove that a caller supplied authentic source/render data or that an image is readable.

`fixtures/identity.json` is a hand-authored example including zero and repeated coordinates. The automated tests inject failures into this fixture to test the checker itself.
