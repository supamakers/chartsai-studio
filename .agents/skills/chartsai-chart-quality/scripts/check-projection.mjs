import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export function checkProjection(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { passed: false, errors: ['Expected a projection contract object.'] };
  const { sourceRows, columns, plottedRows, numericColumns, coordinateScale } = input;
  const rowsValid = (rows) => Array.isArray(rows) && rows.length > 0 && rows.every((r) => Array.isArray(r) && r.length > 0 && r.every((v) => v === null || typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v))));
  if (!rowsValid(sourceRows) || !rowsValid(plottedRows)) return { passed: false, errors: ['Source and plotted rows must be nonempty scalar tables with finite numbers.'] };
  if (!Array.isArray(columns) || !columns.length || new Set(columns).size !== columns.length || columns.some((c) => !Number.isInteger(c) || c < 0 || sourceRows.some((r) => c >= r.length))) return { passed: false, errors: ['Select distinct valid source column indexes.'] };
  if (!Array.isArray(numericColumns) || numericColumns.some((c) => !Number.isInteger(c) || c < 0 || c >= columns.length)) return { passed: false, errors: ['Declare numeric output column indexes.'] };
  const expected = sourceRows.map((r) => columns.map((c) => r[c]));
  if (expected.length !== plottedRows.length) errors.push('Row count changed: missing or repeated rows must not be silently removed.');
  expected.forEach((r, i) => {
    if (!plottedRows[i] || JSON.stringify(r) !== JSON.stringify(plottedRows[i])) errors.push(`Output row ${i + 1} differs from the selected source values or column order.`);
    for (const c of numericColumns) if (typeof r[c] !== 'number' || !Number.isFinite(r[c])) errors.push(`Source row ${i + 1}, output column ${c + 1}: missing or nonnumeric value needs an explicit decision.`);
  });
  if (coordinateScale !== undefined) {
    if (!coordinateScale || ['xUnits','yUnits','width','height'].some((k) => typeof coordinateScale[k] !== 'number' || !Number.isFinite(coordinateScale[k]) || coordinateScale[k] <= 0)) errors.push('Coordinate scale requires positive finite units and plot dimensions.');
    else {
      const x = coordinateScale.width / coordinateScale.xUnits, y = coordinateScale.height / coordinateScale.yUnits;
      if (Math.abs(x - y) > 1e-9 * Math.max(x, y)) errors.push('Coordinate X/Y unit scales differ: geometry would be stretched.');
    }
  }
  return { passed: errors.length === 0, rowsChecked: sourceRows.length, errors };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node check-projection.mjs input.json');
    const report = checkProjection(JSON.parse(await readFile(process.argv[2], 'utf8')));
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (e) { console.log(JSON.stringify({ passed: false, errors: [e.message] })); process.exitCode = 1; }
}
