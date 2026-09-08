import { describe, it, expect } from 'vitest';
import {
  algebraOption,
  buildMath,
  defaults,
  fraction,
  mathCsv,
  mathKinds,
  mathWorksheetSvg,
  numberLineResult,
  numberLineSvg,
  quadraticResult,
  slopeResult,
  transformationResult,
  transformationSvg,
} from '../src/lib/math-tools';
import { renderOptionSvg } from '../src/lib/echarts';

describe('number line', () => {
  it('keeps fractional and repeated values, zero, and signed jumps', () => {
    const r = numberLineResult({ ...defaults['number-line'], mode: 'points', points: '1/2,0,1/2,-2' });
    expect(r.points).toEqual([0.5, 0, 0.5, -2]);
    expect(numberLineResult({ ...defaults['number-line'], start: '3', jump: '-1', count: '5' }).end).toBe(-2);
    expect(fraction(0.75)).toBe('3/4');
    expect(
      numberLineResult({
        ...defaults['number-line'],
        min: '-0.3',
        max: '0.3',
        step: '0.1',
        start: '-0.3',
        jump: '0.1',
        count: '6',
      }).end,
    ).toBeCloseTo(0.3);
  });
  it('rejects an incomplete interval, malformed values, fractional counts and off-grid results', () => {
    for (const patch of [
      { step: '3' },
      { max: '-5' },
      { jump: '5' },
      { count: '1/2' },
      { mode: 'points', points: '1,nope' },
      { mode: 'interval', low: '4', high: '2' },
    ] as Record<string, string>[])
      expect(() => numberLineResult({ ...defaults['number-line'], ...patch })).toThrow();
  });
  it('draws distinct open/closed endpoints and keeps solutions off the question SVG', () => {
    const i = { ...defaults['number-line'], mode: 'interval' };
    const answer = numberLineSvg(i, true),
      question = numberLineSvg(i, false);
    expect(answer).toContain('fill="white" stroke="#315b84"');
    expect(answer).toContain('fill="#315b84" stroke="#315b84"');
    expect(question).not.toContain('<circle');
  });
});
describe('slope', () => {
  it('keeps signed rise and run, reverses consistently, and handles vertical/horizontal', () => {
    const r = slopeResult(defaults.slope);
    expect(r.rise).toBe(4);
    expect(r.run).toBe(6);
    expect(r.m).toBeCloseTo(2 / 3);
    expect(r.b).toBeCloseTo(1 / 3);
    expect(slopeResult({ x1: '4', y1: '3', x2: '-2', y2: '-1' }).m).toBe(r.m);
    expect(slopeResult({ x1: '2', y1: '-4', x2: '2', y2: '4' })).toMatchObject({
      m: null,
      b: null,
      equation: 'x = 2',
    });
    expect(slopeResult({ x1: '-2', y1: '0', x2: '3', y2: '0' }).m).toBe(0);
    expect(() => slopeResult({ x1: '2', y1: '3', x2: '2', y2: '3' })).toThrow(/different points/);
  });
  it('uses native equal-scale axes and exact points in actual render options', () => {
    const option = algebraOption('slope', defaults.slope, true) as any;
    const scatter = option.series.find((s: any) => s.type === 'scatter');
    expect(scatter.data.map((d: any) => d.value)).toEqual([
      [-2, -1],
      [4, 3],
    ]);
    expect(option.xAxis.max - option.xAxis.min).toBe(option.yAxis.max - option.yAxis.min);
    expect((algebraOption('slope', defaults.slope, false).series as any[]).length).toBe(1);
  });
});
describe('transformations', () => {
  it('preserves vertex correspondence for translation and all reflection lines', () => {
    expect(transformationResult(defaults.transformation).image.map((p) => [p.x, p.y])).toEqual([
      [-4, -1],
      [-1, -1],
      [-3, 2],
    ]);
    for (const [axis, xy] of [
      ['x', [2, -4]],
      ['y', [-2, 4]],
      ['diagonal', [4, 2]],
      ['negative', [-4, -2]],
    ] as const) {
      const r = transformationResult({ ...defaults.transformation, operation: 'reflect', axis });
      expect([r.image[2].x, r.image[2].y]).toEqual(xy);
    }
  });
  it('rotates around a nonzero centre and scales distances relative to it', () => {
    const i = { ...defaults.transformation, operation: 'rotate', cx: '1', cy: '1' };
    expect(transformationResult(i).image.map((p) => [p.x, p.y])).toEqual([
      [1, 1],
      [1, 4],
      [-2, 2],
    ]);
    expect(transformationResult({ ...i, angle: '270' }).image[1]).toMatchObject({ x: 1, y: -2 });
    expect(transformationResult({ ...i, operation: 'dilate', factor: '1/2' }).image[2]).toMatchObject({
      x: 1.5,
      y: 2.5,
    });
  });
  it('rejects degeneracy, crossing, duplicate and off-grid polygons', () => {
    for (const points of ['A,0,0\nB,1,1\nC,2,2', 'A,0,0\nB,2,3\nC,0,3\nD,3,0', 'A,1,1\nB,1,1\nC,3,2'])
      expect(() => transformationResult({ ...defaults.transformation, points })).toThrow();
    expect(() => transformationResult({ ...defaults.transformation, dx: '50' })).toThrow(/no vertex/);
    expect(() =>
      transformationResult({ ...defaults.transformation, operation: 'dilate', factor: '0' }),
    ).toThrow();
  });
  it('does not put image coordinates or image markers on the question graph', () => {
    expect(transformationSvg(defaults.transformation, false)).not.toContain('data-image-point');
    expect(transformationSvg(defaults.transformation, true)).toContain('data-image-point="A′"');
  });
});
describe('quadratics', () => {
  it('calculates vertex, discriminant and roots including zero and double roots', () => {
    expect(quadraticResult(defaults.quadratic)).toMatchObject({ h: 1, k: -4, d: 16, roots: [-1, 3] });
    expect(quadraticResult({ a: '1', b: '-4', c: '4' }).roots).toEqual([2]);
    const decimalDouble = quadraticResult({ a: '0.1', b: '0.6', c: '0.9' });
    expect(decimalDouble.d).toBe(0);
    expect(decimalDouble.roots).toHaveLength(1);
    expect(decimalDouble.roots[0]).toBeCloseTo(-3);
    expect(quadraticResult({ a: '1/10', b: '3/5', c: '9/10' }).d).toBe(0);
    expect(quadraticResult({ a: '1', b: '0', c: '2' }).roots).toEqual([]);
    expect(quadraticResult({ a: '-1', b: '2', c: '0' }).roots).toEqual([0, 2]);
    for (const a of ['0', '0.01', '11', '']) expect(() => quadraticResult({ a, b: '1', c: '2' })).toThrow();
  });
  it('plots computed roots and vertex, with no answer series in practice', () => {
    const option = algebraOption('quadratic', defaults.quadratic, true) as any;
    expect(option.series[0].data).toContainEqual([-1, 0]);
    expect(option.series[0].data).toContainEqual([1, -4]);
    expect(option.series[0].data).toContainEqual([3, 0]);
    expect(algebraOption('quadratic', defaults.quadratic, false).series).toEqual([]);
  });
});
describe('shared educational exports', () => {
  for (const kind of mathKinds)
    it(`${kind}: makes distinct question/answer pages and exact CSV`, () => {
      const r = buildMath(kind, defaults[kind], renderOptionSvg);
      const q = mathWorksheetSvg(r, 'letter', false),
        a = mathWorksheetSvg(r, 'letter', true);
      expect(q).not.toContain('ANSWER KEY');
      expect(a).toContain('ANSWER KEY');
      expect(q).not.toBe(a);
      expect(q).toContain('viewBox="0 0 800 1035.2941176470588"');
      expect(q).toMatch(/<svg x="[0-9.]+" y="[0-9.]+"/);
      expect(mathCsv(r)).toContain(r.headers[0]);
      expect(r.svg).not.toContain('NaN');
      expect(r.svg).not.toContain('Infinity');
    });
});
