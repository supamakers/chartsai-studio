import { describe, expect, it } from 'vitest';
import {
  coordinateNumber,
  defaultPlane,
  parsePoints,
  planeGeometry,
  planeSvg,
  pointRegion,
  pointsCsv,
  validatePlane,
  worksheetSvg,
} from '../src/lib/coordinate-plane';
import { analyticsUrl, usageEvent, showcaseDownloadEvent } from '../src/lib/analytics-policy';
describe('coordinate data and geometry', () => {
  it('retains zero, signs, decimal and fractional values with repeated positions', () => {
    const p = parsePoints('Label,X,Y\nA,0,-2\nB,1/2,1.5\nC,1/2,1.5');
    expect(p.map((v) => [v.x, v.y])).toEqual([
      [0, -2],
      [0.5, 1.5],
      [0.5, 1.5],
    ]);
    expect(pointsCsv(p)).toBe('Label,X,Y\r\nA,0,-2\r\nB,0.5,1.5\r\nC,0.5,1.5');
  });
  it('accepts one unlabeled point and pasted spreadsheet columns', () => {
    expect(parsePoints('0,2')).toEqual([{ label: 'A', x: 0, y: 2 }]);
    expect(parsePoints('X\tY\n-3\t4\n0\t0')).toEqual([
      { label: 'A', x: -3, y: 4 },
      { label: 'B', x: 0, y: 0 },
    ]);
  });
  it('rejects missing values, formula-like values, malformed fractions and duplicate labels', () => {
    for (const raw of [
      'A,,2',
      'A,NaN,2',
      'A,1/0,2',
      'A,1/2/3,2',
      'A,2,3\nA,4,5',
      'Label,X,Y',
      'A,51,0',
      '<script>,2,3',
      'A,2,3\n\nB,3,4',
    ])
      expect(() => parsePoints(raw)).toThrow();
    for (const value of ['', 'Infinity', '0x10', '1e5', '3-1'])
      expect(() => coordinateNumber(value)).toThrow();
  });
  it('enforces point count and unique names', () => {
    expect(() => parsePoints(Array.from({ length: 13 }, (_, i) => `P${i},0,0`).join('\n'))).toThrow(/12/);
  });
  it('rejects out-of-grid points without changing them', () => {
    const points = parsePoints('A,-12,3');
    expect(() => validatePlane(defaultPlane, points)).toThrow(/A/);
    expect(points[0].x).toBe(-12);
  });
  it('rejects invalid, excessive and origin-free ranges', () => {
    for (const change of [
      { xmin: NaN },
      { xmin: 1 },
      { xmax: -11 },
      { xmax: 100 },
      { step: 0 },
      { step: 0.5, xmin: -20, xmax: 20 },
      { step: 2, xmax: 9 },
      { xmin: 0, xmax: 1 },
    ])
      expect(() => validatePlane({ ...defaultPlane, ...change })).toThrow();
  });
  it('keeps perpendicular unit distances equal on a rectangular domain', () => {
    const g = planeGeometry({ ...defaultPlane, ymin: 0, ymax: 5 });
    expect(g.x(1) - g.x(0)).toBeCloseTo(g.y(0) - g.y(1));
    expect(g.x(-10)).toBeCloseTo(g.left);
    expect(g.y(5)).toBeCloseTo(g.top);
    expect(g.y(0)).toBeCloseTo(g.top + g.height);
  });
  it('distinguishes axis points, origin and all four quadrants', () => {
    expect(
      [
        [0, 0],
        [0, 2],
        [2, 0],
        [2, 2],
        [-2, 2],
        [-2, -2],
        [2, -2],
      ].map(([x, y]) => pointRegion({ label: 'A', x, y })),
    ).toEqual(['Origin', 'Y-axis', 'X-axis', 'Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV']);
  });
  it('separates plotting questions from answers using the same values', () => {
    const p = parsePoints('A,2,3');
    const question = worksheetSvg(defaultPlane, p, 'plot', 'a4', 'My <grid> & notes');
    const answer = worksheetSvg(defaultPlane, p, 'plot', 'a4', 'My <grid> & notes', true);
    expect(question).not.toContain('data-point="A"');
    expect(answer).toContain('data-point="A"');
    expect(question).toContain('A: (2, 3)');
    expect(answer).toContain('A: (2, 3)');
    expect(question).toContain('My &lt;grid&gt; &amp; notes');
    expect(question).not.toContain('<grid>');
  });
  it('withholds reading answers from both visible graph labels and worksheet text', () => {
    const p = parsePoints('A,2,3');
    const q = worksheetSvg(defaultPlane, p, 'read', 'letter', 'Practice');
    expect(q).toContain('data-point="A"');
    expect(q).not.toContain('(2, 3)');
    expect(q).toContain('A: ( _____ , _____ )');
    expect(worksheetSvg(defaultPlane, p, 'read', 'letter', 'Practice', true)).toContain('A: (2, 3)');
    expect(planeSvg(defaultPlane, p, false)).not.toContain('(2, 3)');
  });
  it('only measures fixed tool and file identifiers', () => {
    expect(analyticsUrl('https://www.chartsai.com/coordinate-plane-generator/?points=secret')).toBe(
      'https://www.chartsai.com/coordinate-plane-generator/',
    );
    expect(
      usageEvent({ tool: 'coordinate-plane', action: 'export', format: 'pdf', points: 'secret' }),
    ).toEqual({ name: 'Chart Download', props: { tool: 'coordinate-plane', format: 'pdf' } });
    expect(showcaseDownloadEvent('/coordinate/assets/triangle-letter.pdf')).toEqual({
      name: 'Chart Download',
      props: { tool: 'coordinate-plane', format: 'pdf' },
    });
    expect(showcaseDownloadEvent('/coordinate/assets/user-private.pdf')).toBeNull();
  });
});
