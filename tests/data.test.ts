import { describe, expect, it } from 'vitest';
import {
  csv,
  parseDelimited,
  parseText,
  readNumber,
  summarize,
  transpose,
  readFileTables,
} from '../src/lib/data';
import { daysInMonth } from '../src/lib/tracker';

describe('real spreadsheet input', () => {
  it('preserves quoted separators, line breaks, quotes and interior missing rows', () => {
    expect(parseDelimited('\uFEFFName,Value\r\n"A, B",2\r\n"A\nB",3\r\n"Say ""hi""",4', ',')).toEqual([
      ['Name', 'Value'],
      ['A, B', '2'],
      ['A\nB', '3'],
      ['Say "hi"', '4'],
    ]);
    expect(parseText('1\n\n2')).toEqual([['1'], [''], ['2']]);
    expect(() => parseText('"unfinished,2')).toThrow(/not closed/);
  });
  it('accepts lists, clipboard tables and explicit European separators', () => {
    expect(parseText('1, 2, 0, -3')).toEqual([['1'], ['2'], ['0'], ['-3']]);
    expect(parseText('Score\tGroup\n12\tA')).toEqual([
      ['Score', 'Group'],
      ['12', 'A'],
    ]);
    expect(parseText('Label;Value\nA;1.234,56')).toEqual([
      ['Label', 'Value'],
      ['A', '1.234,56'],
    ]);
    expect(transpose([['A', 'B'], ['1']])).toEqual([
      ['A', '1'],
      ['B', ''],
    ]);
  });
  it('roundtrips quotes and multiline CSV', () => {
    const table = [
      ['Name', 'Value'],
      ['A, "B"\nC', '0'],
    ];
    expect(parseDelimited(csv(table), ',')).toEqual(table);
  });
  it('reads actual XLSX sheets and retains missing cells', async () => {
    const XLSX = await import('xlsx');
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      book,
      XLSX.utils.aoa_to_sheet([
        ['Name', 'Score'],
        ['A', 0],
        ['B', null],
        ['C', 5],
      ]),
      'Scores',
    );
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['Other'], [7]]), 'Other');
    const buffer = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
    const tables = await readFileTables(new File([buffer], 'example.xlsx'));
    expect(tables.Scores).toEqual([
      ['Name', 'Score'],
      ['A', '0'],
      ['B', ''],
      ['C', '5'],
    ]);
    expect(tables.Other[1]).toEqual(['7']);
  });
});

describe('explicit numeric interpretation', () => {
  it.each([
    ['$1,234.50', 'us', 1234.5],
    ['(42)', 'us', -42],
    ['12%', 'us', 12],
    ['0', 'us', 0],
    ['€1.234,50', 'eu', 1234.5],
    ['-1,25', 'eu', -1.25],
    ['2e3', 'us', 2000],
  ] as const)('%s (%s) → %s', (input, style, result) => expect(readNumber(input, style)).toBe(result));
  it.each(['', 'NA', '-', 'NaN', 'Infinity', '1,23', '1.234,56', '1,234.5,6', '=SUM(A1:A2)', '1e13'])(
    'rejects ambiguous or missing %s',
    (value) => expect(readNumber(value)).toBeNull(),
  );
});

describe('observations and calendar correctness', () => {
  it('includes zeros, repeats and outliers in statistics', () => {
    const stats = summarize([0, 2, 2, 100])!;
    expect(stats).toMatchObject({ count: 4, mean: 26, median: 2, min: 0, max: 100 });
    expect(stats.frequencies).toEqual([
      { value: 0, count: 1 },
      { value: 2, count: 2 },
      { value: 100, count: 1 },
    ]);
    expect(summarize([5, -1, 3])?.median).toBe(3);
    expect(summarize([])).toBeNull();
  });
  it.each([
    [2024, 2, 29],
    [2000, 2, 29],
    [2100, 2, 28],
    [2026, 2, 28],
    [2026, 4, 30],
    [2026, 1, 31],
  ])('year %i month %i has %i days', (year, month, days) => expect(daysInMonth(year, month)).toBe(days));
});
