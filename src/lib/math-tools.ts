import {
  coordinateNumber,
  defaultPlane,
  escapeXml,
  parsePoints,
  planeGeometry,
  planeSvg,
  validatePlane,
  type Point,
  type Plane,
} from './coordinate-plane';

export const mathKinds = ['number-line', 'slope', 'transformation', 'quadratic'] as const;
export type MathKind = (typeof mathKinds)[number];
export type Inputs = Record<string, string>;
export const mathPaths: Record<MathKind, string> = {
  'number-line': 'number-line-generator',
  slope: 'slope-calculator',
  transformation: 'geometry-transformation-calculator',
  quadratic: 'quadratic-graph-calculator',
};
export const mathNames: Record<MathKind, string> = {
  'number-line': 'Number line generator',
  slope: 'Slope calculator',
  transformation: 'Geometry transformation calculator',
  quadratic: 'Quadratic graph calculator',
};
export const defaults: Record<MathKind, Inputs> = {
  'number-line': {
    min: '-5',
    max: '5',
    step: '1',
    mode: 'jumps',
    points: '-2,0,3',
    start: '-2',
    jump: '1',
    count: '5',
    low: '-2',
    high: '3',
    left: 'closed',
    right: 'open',
    labels: 'fraction',
  },
  slope: { x1: '-2', y1: '-1', x2: '4', y2: '3' },
  transformation: {
    points: 'A,1,1\nB,4,1\nC,2,4',
    operation: 'translate',
    dx: '-5',
    dy: '-2',
    axis: 'x',
    angle: '90',
    cx: '0',
    cy: '0',
    factor: '2',
  },
  quadratic: { a: '1', b: '-2', c: '-3' },
};
export const mathExamples: Record<MathKind, { name: string; values: Inputs }[]> = {
  'number-line': [
    { name: 'Five jumps across zero', values: defaults['number-line'] },
    {
      name: 'Fractions in quarters',
      values: {
        ...defaults['number-line'],
        min: '0',
        max: '2',
        step: '1/4',
        mode: 'points',
        points: '1/4,1/2,7/4',
      },
    },
    { name: 'Open and closed endpoints', values: { ...defaults['number-line'], mode: 'interval' } },
  ],
  slope: [
    { name: 'Positive slope: rise 4, run 6', values: defaults.slope },
    { name: 'Negative slope', values: { x1: '-3', y1: '4', x2: '3', y2: '-2' } },
    { name: 'Horizontal line', values: { x1: '-4', y1: '2', x2: '4', y2: '2' } },
    { name: 'Vertical line', values: { x1: '2', y1: '-4', x2: '2', y2: '4' } },
  ],
  transformation: [
    { name: 'Translate a triangle', values: defaults.transformation },
    {
      name: 'Reflect across the y-axis',
      values: { ...defaults.transformation, operation: 'reflect', axis: 'y' },
    },
    { name: 'Rotate 90° anticlockwise', values: { ...defaults.transformation, operation: 'rotate' } },
    { name: 'Enlarge by scale factor 2', values: { ...defaults.transformation, operation: 'dilate' } },
  ],
  quadratic: [
    { name: 'Two real roots', values: defaults.quadratic },
    { name: 'One repeated root', values: { a: '1', b: '-4', c: '4' } },
    { name: 'No real roots', values: { a: '1', b: '0', c: '2' } },
    { name: 'Downward parabola', values: { a: '-1', b: '2', c: '3' } },
  ],
};
export const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toPrecision(8))));
export function fraction(v: number) {
  for (let d = 1; d <= 100; d++) {
    const n = Math.round(v * d);
    if (Math.abs(v - n / d) < 1e-10) return d === 1 ? String(n) : `${n}/${d}`;
  }
  return fmt(v);
}
const read = (i: Inputs, k: string) => coordinateNumber(i[k] ?? '');
function bounded(n: number, min: number, max: number, label: string) {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new Error(`${label} must be between ${min} and ${max}.`);
  return n;
}
export function slopeResult(i: Inputs) {
  const x1 = read(i, 'x1'),
    y1 = read(i, 'y1'),
    x2 = read(i, 'x2'),
    y2 = read(i, 'y2');
  const run = x2 - x1,
    rise = y2 - y1;
  if (run === 0 && rise === 0)
    throw new Error('Choose two different points. One repeated point does not determine a unique line.');
  const m = run === 0 ? null : rise / run;
  const b = m === null ? null : y1 - m * x1;
  const equation =
    m === null
      ? `x = ${fraction(x1)}`
      : `y = ${fraction(m)}x ${b! < 0 ? '−' : '+'} ${fraction(Math.abs(b!))}`;
  return { x1, y1, x2, y2, run, rise, m, b, equation };
}
export function transformationResult(i: Inputs) {
  const points = parsePoints(i.points);
  if (points.length < 3 || points.length > 6) throw new Error('Use 3–6 vertices, in perimeter order.');
  // Reject duplicate/degenerate polygons; self-intersection is rejected below.
  if (new Set(points.map((p) => `${p.x},${p.y}`)).size !== points.length)
    throw new Error('Each polygon vertex must have a different position.');
  const cross = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const area =
    points.reduce((s, p, n) => {
      const q = points[(n + 1) % points.length];
      return s + p.x * q.y - p.y * q.x;
    }, 0) / 2;
  if (Math.abs(area) < 1e-10)
    throw new Error('These vertices have zero polygon area. Use a triangle or another simple polygon.');
  const on = (a: Point, b: Point, c: Point) =>
    Math.abs(cross(a, b, c)) < 1e-10 &&
    c.x >= Math.min(a.x, b.x) &&
    c.x <= Math.max(a.x, b.x) &&
    c.y >= Math.min(a.y, b.y) &&
    c.y <= Math.max(a.y, b.y);
  for (let a = 0; a < points.length; a++)
    for (let b = a + 1; b < points.length; b++) {
      if (b === a + 1 || (a === 0 && b === points.length - 1)) continue;
      const p = points[a],
        q = points[(a + 1) % points.length],
        r = points[b],
        s = points[(b + 1) % points.length];
      if (
        (cross(p, q, r) * cross(p, q, s) < 0 && cross(r, s, p) * cross(r, s, q) < 0) ||
        on(p, q, r) ||
        on(p, q, s) ||
        on(r, s, p) ||
        on(r, s, q)
      )
        throw new Error('The polygon crosses or touches itself. Enter vertices around its perimeter.');
    }
  let rule = '',
    apply: (p: Point) => [number, number];
  if (i.operation === 'translate') {
    const dx = read(i, 'dx'),
      dy = read(i, 'dy');
    rule = `(x, y) → (x + (${fraction(dx)}), y + (${fraction(dy)}))`;
    apply = (p) => [p.x + dx, p.y + dy];
  } else if (i.operation === 'reflect') {
    const rules: Record<string, { rule: string; apply: (p: Point) => [number, number] }> = {
      x: { rule: '(x, y) → (x, −y); reflect across y = 0', apply: (p) => [p.x, -p.y] },
      y: { rule: '(x, y) → (−x, y); reflect across x = 0', apply: (p) => [-p.x, p.y] },
      diagonal: { rule: '(x, y) → (y, x); reflect across y = x', apply: (p) => [p.y, p.x] },
      negative: { rule: '(x, y) → (−y, −x); reflect across y = −x', apply: (p) => [-p.y, -p.x] },
    };
    if (!rules[i.axis]) throw new Error('Choose a supported reflection line.');
    ({ rule, apply } = rules[i.axis]);
  } else if (i.operation === 'rotate' || i.operation === 'dilate') {
    const cx = read(i, 'cx'),
      cy = read(i, 'cy');
    if (i.operation === 'rotate') {
      const angle = Number(i.angle);
      if (![90, 180, 270].includes(angle)) throw new Error('Choose 90°, 180° or 270° anticlockwise.');
      rule = `Rotate ${angle}° anticlockwise about (${fraction(cx)}, ${fraction(cy)}).`;
      apply = (p) => {
        const x = p.x - cx,
          y = p.y - cy;
        return angle === 90 ? [cx - y, cy + x] : angle === 180 ? [cx - x, cy - y] : [cx + y, cy - x];
      };
    } else {
      const k = bounded(read(i, 'factor'), 0.1, 5, 'Scale factor');
      rule = `(x, y) → (${fraction(cx)} + ${fraction(k)}(x − (${fraction(cx)})), ${fraction(cy)} + ${fraction(k)}(y − (${fraction(cy)})))`;
      apply = (p) => [cx + k * (p.x - cx), cy + k * (p.y - cy)];
    }
  } else throw new Error('Choose a transformation.');
  const image = points.map((p) => {
    const [x, y] = apply(p);
    return { label: `${p.label}′`, x: Object.is(x, -0) ? 0 : x, y: Object.is(y, -0) ? 0 : y };
  });
  if (image.some((p) => Math.abs(p.x) > 50 || Math.abs(p.y) > 50))
    throw new Error(
      'The transformed shape exceeds −50 to 50. Adjust the shape or transformation; no vertex has been dropped.',
    );
  return { points, image, rule, area: Math.abs(area) };
}
// Classify the discriminant from the entered decimal/fraction values exactly.
// Floating subtraction alone can turn 0.6² − 4(0.1)(0.9) into a tiny negative.
function coefficientRatio(raw: string): [bigint, bigint] {
  if (raw.length > 24) throw new Error('Use coefficients of at most 24 characters.');
  const decimal = (part: string): [bigint, bigint] => {
    const v = part.trim(),
      negative = v.startsWith('-'),
      unsigned = v.replace(/^[+-]/, '');
    const pieces = unsigned.split('.'),
      digits = (pieces[0] || '0') + (pieces[1] || '');
    return [(negative ? -1n : 1n) * BigInt(digits), 10n ** BigInt((pieces[1] || '').length)];
  };
  const [first, second] = raw.split('/'),
    [n, d] = decimal(first);
  if (second === undefined) return [n, d];
  const [nn, dd] = decimal(second);
  return nn < 0n ? [-n * dd, -d * nn] : [n * dd, d * nn];
}
function discriminant(i: Inputs) {
  const [an, ad] = coefficientRatio(i.a),
    [bn, bd] = coefficientRatio(i.b),
    [cn, cd] = coefficientRatio(i.c);
  return Number(bn * bn * ad * cd - 4n * an * cn * bd * bd) / Number(bd * bd * ad * cd);
}
export function quadraticResult(i: Inputs) {
  const a = bounded(read(i, 'a'), -10, 10, 'a'),
    b = bounded(read(i, 'b'), -20, 20, 'b'),
    c = bounded(read(i, 'c'), -20, 20, 'c');
  if (Math.abs(a) < 0.1)
    throw new Error('Use a between −10 and −0.1 or 0.1 and 10. At a = 0 this is a line, not a quadratic.');
  const d = discriminant(i),
    h = -b / (2 * a),
    k = -d / (4 * a);
  // Stable quadratic formula preserves the smaller root when subtraction cancels.
  let roots: number[] = [];
  if (d === 0) roots = [h];
  else if (d > 0) {
    const q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(d));
    roots = [q / a, c / q].sort((x, y) => x - y).map((x) => (Object.is(x, -0) ? 0 : x));
  }
  return { a, b, c, h, k, d, roots, value: (x: number) => (a * x + b) * x + c };
}
export function numberLineResult(i: Inputs) {
  const min = read(i, 'min'),
    max = read(i, 'max'),
    step = read(i, 'step');
  const intervals = (max - min) / step;
  if (
    min >= max ||
    step <= 0 ||
    Math.round(intervals) < 2 ||
    Math.round(intervals) > 20 ||
    Math.abs(intervals - Math.round(intervals)) > 1e-8
  )
    throw new Error(
      'Choose an increasing range with 2–20 equal intervals. The step must divide the range exactly.',
    );
  const inside = (v: number) => {
    if (v < min - 1e-12 || v > max + 1e-12)
      throw new Error(
        'Every point, endpoint and jump must fit inside the range. Expand the range or edit the values.',
      );
    return v;
  };
  let points: number[] = [],
    end: number | undefined,
    start: number | undefined,
    jump: number | undefined,
    count: number | undefined,
    low: number | undefined,
    high: number | undefined;
  if (i.mode === 'points') {
    const raw = i.points.trim().split(/[\s,;]+/);
    if (!i.points.trim() || raw.length > 8)
      throw new Error('Enter 1–8 points separated by commas or spaces. Fractions such as 1/4 work.');
    points = raw.map((v) => inside(coordinateNumber(v)));
  } else if (i.mode === 'jumps') {
    start = inside(read(i, 'start'));
    jump = read(i, 'jump');
    count = bounded(read(i, 'count'), 1, 10, 'Number of jumps');
    if (!Number.isInteger(count) || jump === 0)
      throw new Error('Use 1–10 whole jumps and a nonzero jump size.');
    end = inside(start + jump * count);
  } else if (i.mode === 'interval') {
    low = inside(read(i, 'low'));
    high = inside(read(i, 'high'));
    if (low >= high) throw new Error('The left endpoint must be smaller than the right endpoint.');
    if (!['closed', 'open'].includes(i.left) || !['closed', 'open'].includes(i.right))
      throw new Error('Choose open or closed endpoints.');
  } else if (i.mode !== 'blank') throw new Error('Choose points, jumps, interval or blank.');
  return { min, max, step, points, start, jump, count, end, low, high };
}
export type MathResult = {
  title: string;
  given: string[];
  questions: string[];
  answers: string[];
  headers: string[];
  rows: (string | number)[][];
  svg: string;
  questionSvg: string;
  note: string;
};
const tx = (x: number, y: number, s: string, size = 16, color = '#263b34', anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escapeXml(s)}</text>`;
const wrapSvg = (body: string, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><rect width="720" height="720" fill="white"/>${body}</svg>`;
function autoPlane(points: Point[]): Plane {
  const n = Math.max(5, ...points.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)]));
  const step = n <= 9 ? 1 : n <= 18 ? 2 : 5;
  const bound = Math.min(50, Math.ceil((n + step) / step) * step);
  return { ...defaultPlane, xmin: -bound, xmax: bound, ymin: -bound, ymax: bound, step };
}
export function numberLineSvg(
  i: Inputs,
  answer: boolean,
  options: { compact?: boolean; anchorsOnly?: boolean; markerId?: string } = {},
) {
  const markerId = escapeXml(options.markerId ?? 'jump-arrow');
  const r = numberLineResult(i),
    x = (n: number) => 60 + ((n - r.min) * 600) / (r.max - r.min),
    y = 360;
  const label = i.labels === 'fraction' ? fraction : fmt;
  let body = `<defs><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#315b84"/></marker></defs>`;
  body += `<path d="M45 ${y} H675 M45 ${y} l10 -5 M45 ${y} l10 5 M675 ${y} l-10 -5 M675 ${y} l-10 5" fill="none" stroke="#39483f" stroke-width="2"/>`;
  const intervals = Math.round((r.max - r.min) / r.step);
  const tickValues = Array.from({ length: intervals + 1 }, (_, n) => r.min + n * r.step);
  const stagger = Math.max(...tickValues.map((v) => label(v).length)) * 7 > 600 / intervals - 5;
  for (let n = 0; n <= intervals; n++) {
    const v = r.min + n * r.step;
    body += `<path d="M${x(v)} ${y - 6} v12" stroke="#39483f"/>`;
    if (!options.anchorsOnly || n === 0 || n === intervals)
      body += tx(x(v), y + 30 + (stagger && n % 2 ? 18 : 0), label(v), 13, '#39483f', 'middle');
  }
  const dot = (v: number, open: boolean, name: string, offset = 0) =>
    `<circle cx="${x(v)}" cy="${y}" r="6" fill="${open ? 'white' : '#315b84'}" stroke="#315b84" stroke-width="2"/>${tx(x(v), y - 20 - offset, name, 15, '#254e76', 'middle')}`;
  if (answer && i.mode === 'points')
    r.points.forEach((v, n) => {
      const count = r.points.slice(0, n).filter((p) => p === v).length;
      body += dot(v, false, String.fromCharCode(65 + n), count * 22);
    });
  if (answer && i.mode === 'interval') {
    body += `<path d="M${x(r.low!)} ${y} H${x(r.high!)}" stroke="#315b84" stroke-width="5"/>`;
    body += dot(r.low!, i.left === 'open', '') + dot(r.high!, i.right === 'open', '');
  }
  if (i.mode === 'jumps') {
    body += dot(r.start!, false, 'Start');
    if (answer) {
      for (let n = 0; n < r.count!; n++) {
        const a = x(r.start! + n * r.jump!),
          b = x(r.start! + (n + 1) * r.jump!);
        body += `<path d="M${a} ${y - 10} Q${(a + b) / 2} ${y - 110} ${b} ${y - 13}" fill="none" stroke="#315b84" stroke-width="2" marker-end="url(#${markerId})"/>`;
      }
      body += dot(r.end!, false, 'End', Math.abs(x(r.end!) - x(r.start!)) < 55 ? -75 : 0);
    }
  }
  const caption =
    i.mode === 'blank'
      ? 'Make your own number-line activity'
      : i.mode === 'jumps'
        ? `${r.count} jumps of ${label(r.jump!)}, starting at ${label(r.start!)}`
        : i.mode === 'interval'
          ? `${i.left === 'closed' ? '[' : '('}${label(r.low!)}, ${label(r.high!)}${i.right === 'closed' ? ']' : ')'}`
          : `Plot ${r.points.map(label).join(', ')}`;
  if (options.compact)
    return wrapSvg(body, 'Number line with equally spaced ticks').replace(
      'width="720" height="720" viewBox="0 0 720 720"',
      'width="720" height="200" viewBox="0 230 720 200"',
    );
  wrapped(caption, 65).forEach((line, n) => {
    body += tx(360, 165 + n * 23, line, 17, '#263b34', 'middle');
  });
  body += tx(
    360,
    485,
    `Equal steps of ${label(r.step)}. Values increase to the right.`,
    15,
    '#526254',
    'middle',
  );
  return wrapSvg(body, answer ? 'Number line diagram' : 'Number line practice');
}
export function transformationSvg(i: Inputs, answer: boolean) {
  const r = transformationResult(i);
  const center = ['rotate', 'dilate'].includes(i.operation)
    ? [{ label: 'center', x: read(i, 'cx'), y: read(i, 'cy') }]
    : [];
  const p = autoPlane([...r.points, ...r.image, ...center]);
  validatePlane(p, [...r.points, ...r.image, ...center]);
  const g = planeGeometry(p);
  let svg = planeSvg({ ...p, connect: true }, r.points);
  let overlay = '';
  if (center.length)
    overlay += `<path d="M${g.x(center[0].x) - 5},${g.y(center[0].y)} h10 M${g.x(center[0].x)},${g.y(center[0].y) - 5} v10" stroke="#8b4f2f" stroke-width="2"/>${tx(g.x(center[0].x) + 8, g.y(center[0].y) + 18, 'Centre', 12, '#8b4f2f')}`;
  if (i.operation === 'reflect') {
    const bound = p.xmax;
    const a =
      i.axis === 'x'
        ? [-bound, 0]
        : i.axis === 'y'
          ? [0, -bound]
          : i.axis === 'diagonal'
            ? [-bound, -bound]
            : [-bound, bound];
    const b =
      i.axis === 'x'
        ? [bound, 0]
        : i.axis === 'y'
          ? [0, bound]
          : i.axis === 'diagonal'
            ? [bound, bound]
            : [bound, -bound];
    overlay += `<path d="M${g.x(a[0])},${g.y(a[1])} L${g.x(b[0])},${g.y(b[1])}" stroke="#8b4f2f" stroke-width="2" stroke-dasharray="8 5"/>`;
  }
  if (answer) {
    overlay += `<polygon points="${r.image.map((v) => `${g.x(v.x)},${g.y(v.y)}`).join(' ')}" fill="#c5693420" stroke="#9b4b24" stroke-width="2.5" stroke-dasharray="7 4"/>`;
    r.image.forEach(
      (v) =>
        (overlay += `<g data-image-point="${escapeXml(v.label)}"><circle cx="${g.x(v.x)}" cy="${g.y(v.y)}" r="5" fill="#9b4b24"/>${tx(g.x(v.x) + (g.x(v.x) > 510 ? -8 : 8), g.y(v.y) + 19, v.label, 14, '#9b4b24', g.x(v.x) > 510 ? 'end' : 'start')}</g>`),
    );
  }
  overlay += tx(
    30,
    28,
    answer ? 'Original: solid blue · Image: dashed orange' : 'Original shape · Draw the transformed image',
    14,
  );
  return svg.replace('</svg>', overlay + '</svg>');
}
// Native ECharts is injected by the caller so the number-line/geometry tools do not load it.
export type OptionRenderer = (
  option: import('echarts').EChartsOption,
  width: number,
  height: number,
) => string;
export function algebraOption(
  kind: 'slope' | 'quadratic',
  i: Inputs,
  answer: boolean,
): import('echarts').EChartsOption {
  const series: any[] = [];
  let xmin = -6,
    xmax = 6,
    ymin = -6,
    ymax = 6,
    interval: number | undefined = 1,
    caption = '';
  if (kind === 'slope') {
    const r = slopeResult(i),
      p = autoPlane([
        { label: 'A', x: r.x1, y: r.y1 },
        { label: 'B', x: r.x2, y: r.y2 },
      ]);
    ({ xmin, xmax, ymin, ymax } = p);
    interval = p.step;
    series.push({
      type: 'scatter',
      symbolSize: 11,
      data: [
        { value: [r.x1, r.y1], name: 'A' },
        { value: [r.x2, r.y2], name: 'B' },
      ],
      label: { show: true, formatter: '{b}', position: 'top', fontSize: 16 },
      itemStyle: { color: '#254e76' },
    });
    if (answer) {
      const line =
        r.m === null
          ? [
              [r.x1, ymin],
              [r.x1, ymax],
            ]
          : [
              [xmin, r.m * xmin + r.b!],
              [xmax, r.m * xmax + r.b!],
            ];
      series.unshift({
        type: 'line',
        data: line,
        showSymbol: false,
        lineStyle: { color: '#315b84', width: 2 },
        clip: true,
      });
      series.push({
        type: 'line',
        data: [
          [r.x1, r.y1],
          [r.x2, r.y1],
          [r.x2, r.y2],
        ],
        showSymbol: false,
        lineStyle: { color: '#9b4b24', width: 2, type: 'dashed' },
      });
    }
    caption = answer ? `Rise ${fmt(r.rise)} · Run ${fmt(r.run)}` : 'Find the rise, run and slope from A to B';
  } else {
    const r = quadraticResult(i),
      half = Math.max(3, ...r.roots.map((x) => Math.abs(x - r.h) + 1));
    xmin = Math.floor(Math.min(-1, r.h - half));
    xmax = Math.ceil(Math.max(1, r.h + half));
    const ys = [r.k, r.c, r.value(xmin), r.value(xmax), 0];
    const span = Math.max(...ys) - Math.min(...ys);
    ymin = Math.floor(Math.min(...ys) - span * 0.08 - 1);
    ymax = Math.ceil(Math.max(...ys) + span * 0.08 + 1);
    interval = undefined;
    if (answer) {
      const xs = [
        ...Array.from({ length: 401 }, (_, n) => xmin + ((xmax - xmin) * n) / 400),
        r.h,
        ...r.roots,
        0,
      ].sort((a, b) => a - b);
      series.push({
        type: 'line',
        data: [...new Set(xs)].map((x) => [x, r.value(x)]),
        showSymbol: false,
        clip: true,
        lineStyle: { color: '#315b84', width: 3 },
      });
      series.push({
        type: 'scatter',
        symbolSize: 10,
        data: [
          { value: [r.h, r.k], name: 'Vertex' },
          ...r.roots.filter((x) => x !== r.h).map((x) => ({ value: [x, 0], name: 'Root' })),
        ],
        label: { show: true, formatter: '{b}', position: 'top', fontSize: 13 },
        itemStyle: { color: '#9b4b24' },
      });
    }
    caption = 'Quadratic graph · X and Y use independent scales';
  }
  const axis = (name: string, min: number, max: number) => ({
    type: 'value' as const,
    name,
    min,
    max,
    interval,
    nameTextStyle: { fontSize: 16 },
    axisLine: { show: true, onZero: true, lineStyle: { color: '#56645b' } },
    axisTick: { show: true },
    axisLabel: { fontSize: 12, formatter: (n: number) => fmt(n), hideOverlap: true },
    splitLine: { show: true, lineStyle: { color: '#dfe5df' } },
  });
  return {
    animation: false,
    backgroundColor: '#fff',
    title: {
      text: caption,
      left: 'center',
      top: 20,
      textStyle: { fontSize: 15, fontWeight: 'normal', color: '#263b34' },
    },
    grid: { left: 80, right: 80, top: 80, bottom: 80 },
    xAxis: axis('x', xmin, xmax),
    yAxis: axis('y', ymin, ymax),
    series,
  };
}
export function buildMath(kind: MathKind, i: Inputs, render?: OptionRenderer): MathResult {
  if (kind === 'number-line') {
    const r = numberLineResult(i),
      label = i.labels === 'fraction' ? fraction : fmt;
    const given =
      i.mode === 'jumps'
        ? [`Start at ${label(r.start!)}. Make ${r.count} jumps of ${label(r.jump!)}.`]
        : i.mode === 'interval'
          ? [
              `Draw the interval ${i.left === 'closed' ? '[' : '('}${label(r.low!)}, ${label(r.high!)}${i.right === 'closed' ? ']' : ')'}.`,
            ]
          : i.mode === 'points'
            ? [`Plot these values: ${r.points.map(label).join(', ')}.`]
            : ['Use the number line for your own question.'];
    const answers =
      i.mode === 'jumps'
        ? [
            `${label(r.start!)} + ${r.count} × (${label(r.jump!)}) = ${label(r.end!)}`,
            `Each jump goes ${r.jump! > 0 ? 'right' : 'left'}.`,
          ]
        : i.mode === 'interval'
          ? [
              `${label(r.low!)} ${i.left === 'closed' ? '≤' : '<'} x ${i.right === 'closed' ? '≤' : '<'} ${label(r.high!)}`,
              `Left endpoint ${i.left === 'closed' ? 'included' : 'excluded'}; right endpoint ${i.right === 'closed' ? 'included' : 'excluded'}.`,
            ]
          : i.mode === 'points'
            ? r.points.map((v, n) => `${String.fromCharCode(65 + n)} = ${label(v)}`)
            : [];
    const values =
      i.mode === 'jumps'
        ? Array.from({ length: r.count! + 1 }, (_, n) => r.start! + n * r.jump!)
        : i.mode === 'interval'
          ? [r.low!, r.high!]
          : r.points;
    return {
      title: mathNames[kind],
      given,
      questions:
        i.mode === 'jumps'
          ? ['Draw the jumps. What is the final value?']
          : i.mode === 'interval'
            ? ['Which endpoints are included? Show this with open or filled circles.']
            : i.mode === 'points'
              ? ['Label each point A, B, C… in the supplied order.']
              : ['Write and solve your own number-line problem.'],
      answers,
      headers: ['Position', 'Value'],
      rows: values.map((v, n) => [i.mode === 'points' ? String.fromCharCode(65 + n) : n, v]),
      svg: numberLineSvg(i, true),
      questionSvg: numberLineSvg(i, false),
      note: 'Tick spacing is uniform. Fraction labels use denominators up to 100; other values display to 8 significant digits. CSV keeps numeric precision. Repeated positions remain in the table.',
    };
  }
  if (kind === 'transformation') {
    const r = transformationResult(i);
    return {
      title: mathNames[kind],
      given: [r.rule, r.points.map((v) => `${v.label} (${fraction(v.x)}, ${fraction(v.y)})`).join('; ')],
      questions: [
        'Draw and label the image of each vertex. Join in the original order.',
        'Does this transformation preserve side lengths?',
      ],
      answers: [
        ...r.image.map((v) => `${v.label} (${fraction(v.x)}, ${fraction(v.y)})`),
        i.operation === 'dilate'
          ? `Lengths multiply by ${fraction(read(i, 'factor'))}; area multiplies by ${fraction(read(i, 'factor') ** 2)}.`
          : 'Side lengths and angle measures are preserved.',
      ],
      headers: ['Vertex', 'Original X', 'Original Y', 'Image X', 'Image Y'],
      rows: r.points.map((p, n) => [p.label, p.x, p.y, r.image[n].x, r.image[n].y]),
      svg: transformationSvg(i, true),
      questionSvg: transformationSvg(i, false),
      note: 'One transformation at a time. Equal X/Y units, automatic range including every vertex. Original: solid blue; image: dashed orange. Overlapping vertices may overlap labels; the table preserves every coordinate.',
    };
  }
  if (!render) throw new Error('The graph renderer is still loading.');
  const svg = render(algebraOption(kind, i, true), 720, 720),
    questionSvg = render(algebraOption(kind, i, false), 720, 720);
  if (kind === 'slope') {
    const r = slopeResult(i);
    return {
      title: mathNames[kind],
      given: [`A (${fraction(r.x1)}, ${fraction(r.y1)}), B (${fraction(r.x2)}, ${fraction(r.y2)})`],
      questions: [
        'Find the rise (change in y) and run (change in x) from A to B.',
        'Find the slope and write an equation of the line.',
      ],
      answers: [
        `Rise = ${fraction(r.y2)} − (${fraction(r.y1)}) = ${fraction(r.rise)}`,
        `Run = ${fraction(r.x2)} − (${fraction(r.x1)}) = ${fraction(r.run)}`,
        r.m === null
          ? 'Slope is undefined: division by zero.'
          : `Slope = ${fraction(r.rise)} ÷ (${fraction(r.run)}) = ${fraction(r.m)}`,
        r.equation,
      ],
      headers: ['Point', 'X', 'Y'],
      rows: [
        ['A', r.x1, r.y1],
        ['B', r.x2, r.y2],
      ],
      svg,
      questionSvg,
      note: 'Equal X/Y units. The line extends across the displayed window; the dashed right-angle path shows rise and run. Coordinates −50 to 50; decimals and fractions supported.',
    };
  }
  const r = quadraticResult(i);
  return {
    title: mathNames[kind],
    given: [`y = (${fraction(r.a)})x² + (${fraction(r.b)})x + (${fraction(r.c)})`],
    questions: [
      'Find the vertex and axis of symmetry. Does the parabola open up or down?',
      'Find the real roots and the y-intercept. Sketch the curve.',
    ],
    answers: [
      `Vertex (${fmt(r.h)}, ${fmt(r.k)}); symmetry line x = ${fmt(r.h)}`,
      `Opens ${r.a > 0 ? 'up' : 'down'}; y-intercept (0, ${fmt(r.c)})`,
      `Discriminant b² − 4ac = ${fmt(r.d)}`,
      r.roots.length
        ? `${r.roots.length === 1 ? 'Repeated real root' : 'Real roots'}: ${r.roots.map(fmt).join(', ')}`
        : 'No real roots: the graph does not cross the x-axis.',
    ],
    headers: ['X', 'Y'],
    rows: [-2, -1, 0, 1, 2].map((n) => [r.h + n, r.value(r.h + n)]),
    svg,
    questionSvg,
    note: 'The curve uses 401 evenly spaced samples plus exact vertex/root X positions. Axes use independent scales to keep the vertex, intercepts and real roots visible. Labels round to 8 significant digits; CSV retains calculated precision. Real roots only.',
  };
}
function wrapped(s: string, max = 83): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) {
    if ((line + ' ' + w).length > max && line) {
      out.push(line);
      line = w;
    } else line += (line ? ' ' : '') + w;
  }
  if (line) out.push(line);
  return out;
}
export function mathWorksheetSvg(r: MathResult, paper: 'a4' | 'letter', answer: boolean, practice = true) {
  const height = paper === 'a4' ? (800 * 297) / 210 : (800 * 11) / 8.5;
  let y = 94;
  const textLines = (lines: string[], size = 15) =>
    lines
      .flatMap((s) =>
        wrapped(s).map((line) => {
          const svg = tx(40, y, line, size);
          y += 21;
          return svg;
        }),
      )
      .join('');
  let body =
    tx(40, 43, r.title, 24) +
    tx(
      40,
      69,
      answer
        ? 'ANSWER KEY'
        : practice
          ? 'Name: ________________________    Date: ______________'
          : 'Worked example',
      14,
    );
  body += textLines(r.given);
  const lines = answer || !practice ? r.answers : r.questions;
  const textHeight = lines.flatMap((s) => wrapped(s)).length * 21;
  const workSpace = !answer && practice ? 75 : 0;
  const plotY = y + 6;
  const numberLine = r.title === mathNames['number-line'];
  const plotSize = numberLine ? 720 : Math.min(660, height - 55 - plotY - 20 - textHeight - workSpace);
  const plotHeight = numberLine ? 390 : plotSize;
  const svg = answer || !practice ? r.svg : r.questionSvg;
  body += svg
    .replace('<svg ', `<svg x="${(800 - plotSize) / 2}" y="${plotY}" `)
    .replace('width="720"', `width="${plotSize}"`)
    .replace('height="720"', `height="${plotHeight}"`)
    .replace('viewBox="0 0 720 720"', numberLine ? 'viewBox="0 130 720 390"' : 'viewBox="0 0 720 720"');
  y = plotY + plotHeight + 20;
  body += textLines(lines);
  if (!answer && practice)
    for (let n = 0; n < 3; n++) {
      y += 25;
      body += `<path d="M40 ${y} H760" stroke="#d6ded8"/>`;
    }
  body += tx(40, height - 24, 'Original ChartsAI practice. Print at 100% / Actual size.', 11, '#526254');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}"><rect width="800" height="${height}" fill="white"/>${body}</svg>`;
}
export function mathCsv(r: MathResult) {
  return [r.headers, ...r.rows]
    .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    .join('\r\n');
}
