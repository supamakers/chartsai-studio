import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseText } from '../src/lib/data';
import { irisSpeciesSpec } from '../src/lib/iris-comparison';
import { analyzeStat } from '../src/lib/statistics';
it('projects all 150 original Iris rows to their species and petal length without changing strings', () => {
  const full = parseText(readFileSync('public/datasets/assets/iris.csv', 'utf8'));
  const spec = irisSpeciesSpec(full);
  expect(spec.table.slice(1)).toEqual(full.slice(1).map((row) => [row[4], row[2]]));
  const groups = analyzeStat(spec).boxes!;
  expect(groups.map((g) => [g.count, g.median])).toEqual([
    [50, 1.5],
    [50, 4.35],
    [50, 5.55],
  ]);
  expect(groups.reduce((sum, g) => sum + g.count, 0)).toBe(150);
  expect(() => irisSpeciesSpec(full.slice(0, -1))).toThrow();
});
