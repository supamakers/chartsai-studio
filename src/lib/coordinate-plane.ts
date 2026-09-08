import { parseDelimited } from './data';
export type Point = { label: string; x: number; y: number };
export type Plane = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  step: number;
  numbers: boolean;
  grid: boolean;
  connect: boolean;
};
export type Activity = 'blank' | 'diagram' | 'plot' | 'read';
export const defaultPlane: Plane = {
  xmin: -10,
  xmax: 10,
  ymin: -10,
  ymax: 10,
  step: 1,
  numbers: true,
  grid: true,
  connect: false,
};
export const coordinateExamples = {
  quadrants: {
    name: 'Explore four quadrants',
    raw: 'A,3,4\nB,-4,3\nC,-3,-4\nD,4,-3\nO,0,0',
    plane: defaultPlane,
  },
  triangle: {
    name: 'Plot a triangle',
    raw: 'A,1,1\nB,7,1\nC,4,6',
    plane: { ...defaultPlane, xmin: 0, ymin: 0, connect: true },
  },
  fractions: {
    name: 'Half-unit coordinates',
    raw: 'A,1/2,3/2\nB,-3/2,1\nC,0,-1/2',
    plane: { ...defaultPlane, xmin: -3, xmax: 3, ymin: -3, ymax: 3, step: 0.5 },
  },
};
export function coordinateNumber(value: string) {
  const v = value.trim();
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  const parts = v.split('/');
  if (parts.length > 2 || parts.some((p) => !decimal.test(p.trim())))
    throw new Error(
      `“${v || 'empty'}” is not a coordinate. Use a number or fraction such as -2, 0.5 or 1/2.`,
    );
  const n = Number(parts[0]) / (parts.length === 2 ? Number(parts[1]) : 1);
  if (!Number.isFinite(n) || Math.abs(n) > 50)
    throw new Error(
      'Coordinates must be finite numbers between -50 and 50. Fractions cannot have a zero denominator.',
    );
  return Object.is(n, -0) ? 0 : n;
}
export function parsePoints(raw: string): Point[] {
  if (raw.length > 10000) throw new Error('Use up to 12 points, with short labels.');
  const sep = raw.includes('\t') ? '\t' : ',';
  const rows = parseDelimited(raw, sep);
  if (!rows.length) throw new Error('Add at least one point, or choose Blank grid.');
  const header = rows[0].map((v) => v.toLowerCase());
  if (header.join(',') === 'label,x,y' || header.join(',') === 'x,y') rows.shift();
  if (!rows.length || rows.length > 12) throw new Error('Add between 1 and 12 points.');
  const points = rows.map((row, i) => {
    if (row.length !== 2 && row.length !== 3)
      throw new Error(
        `Row ${i + 1}: use X,Y or Label,X,Y. Commas or pasted spreadsheet tabs separate columns.`,
      );
    const label = row.length === 3 ? row[0] : String.fromCharCode(65 + i);
    if (!/^[A-Za-z0-9][A-Za-z0-9 _-]{0,7}$/.test(label))
      throw new Error(
        `Row ${i + 1}: give the point a label of 1–8 letters or numbers (spaces, hyphens and underscores are allowed).`,
      );
    try {
      return { label, x: coordinateNumber(row[row.length - 2]), y: coordinateNumber(row[row.length - 1]) };
    } catch (e) {
      throw new Error(`Row ${i + 1}: ${(e as Error).message}`);
    }
  });
  if (new Set(points.map((p) => p.label.toLowerCase())).size !== points.length)
    throw new Error('Give every point a different label. Repeated coordinates are allowed.');
  return points;
}
export function validatePlane(p: Plane, points: Point[] = []) {
  for (const n of [p.xmin, p.xmax, p.ymin, p.ymax])
    if (!Number.isFinite(n) || Math.abs(n) > 50)
      throw new Error('Axis limits must be numbers between -50 and 50.');
  if (p.xmin >= p.xmax || p.ymin >= p.ymax)
    throw new Error('Each axis minimum must be smaller than its maximum.');
  if (p.xmin > 0 || p.xmax < 0 || p.ymin > 0 || p.ymax < 0)
    throw new Error('Include zero on both axes so the origin stays visible.');
  if (![0.5, 1, 2, 5, 10].includes(p.step)) throw new Error('Choose a supported grid interval.');
  if ([p.xmin, p.xmax, p.ymin, p.ymax].some((n) => Math.abs(n / p.step - Math.round(n / p.step)) > 1e-8))
    throw new Error('Axis limits must be multiples of the grid interval.');
  const x = (p.xmax - p.xmin) / p.step,
    y = (p.ymax - p.ymin) / p.step;
  if (x > 40 || y > 40 || x < 2 || y < 2)
    throw new Error('Use 2–40 grid intervals on each axis. Change the limits or grid interval.');
  if (Math.max(x / y, y / x) > 4)
    throw new Error('Keep the longer axis within four times the shorter axis for a readable grid.');
  const outside = points.filter((v) => v.x < p.xmin || v.x > p.xmax || v.y < p.ymin || v.y > p.ymax);
  if (outside.length)
    throw new Error(
      `Outside this grid: ${outside.map((v) => v.label).join(', ')}. Expand the axis limits or edit those points; no points have been dropped.`,
    );
}
export function planeGeometry(p: Plane) {
  const scale = Math.min(560 / (p.xmax - p.xmin), 560 / (p.ymax - p.ymin));
  const width = (p.xmax - p.xmin) * scale,
    height = (p.ymax - p.ymin) * scale;
  const left = (720 - width) / 2,
    top = (720 - height) / 2;
  return {
    scale,
    left,
    top,
    width,
    height,
    x: (n: number) => left + (n - p.xmin) * scale,
    y: (n: number) => top + (p.ymax - n) * scale,
  };
}
export function pointRegion(p: Point) {
  if (!p.x && !p.y) return 'Origin';
  if (!p.x) return 'Y-axis';
  if (!p.y) return 'X-axis';
  return `Quadrant ${p.x > 0 ? (p.y > 0 ? 'I' : 'IV') : p.y > 0 ? 'II' : 'III'}`;
}
export const escapeXml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
const num = (v: number) => String(Number(v.toFixed(8)));
export function pointsCsv(points: Point[]) {
  return ['Label,X,Y', ...points.map((p) => `${p.label},${p.x},${p.y}`)].join('\r\n');
}
export function planeSvg(p: Plane, points: Point[], showCoordinates = false) {
  validatePlane(p, points);
  const g = planeGeometry(p),
    x0 = g.x(0),
    y0 = g.y(0);
  const lines: string[] = [];
  const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, width = 1) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`;
  const text = (x: number, y: number, value: string, size = 13, anchor = 'middle', color = '#39483f') =>
    `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${escapeXml(value)}</text>`;
  for (let i = 0; i <= (p.xmax - p.xmin) / p.step; i++) {
    const v = p.xmin + i * p.step,
      x = g.x(v);
    if (p.grid) lines.push(line(x, g.top, x, g.top + g.height, '#d6ded8'));
    lines.push(line(x, y0 - 4, x, y0 + 4, '#56645b'));
    if (p.numbers && v !== 0) lines.push(text(x, y0 + 21, num(v), 12));
  }
  for (let i = 0; i <= (p.ymax - p.ymin) / p.step; i++) {
    const v = p.ymin + i * p.step,
      y = g.y(v);
    if (p.grid) lines.push(line(g.left, y, g.left + g.width, y, '#d6ded8'));
    lines.push(line(x0 - 4, y, x0 + 4, y, '#56645b'));
    if (p.numbers && v !== 0) lines.push(text(x0 - 10, y + 4, num(v), 12, 'end'));
  }
  lines.push(
    line(g.left - 10, y0, g.left + g.width + 14, y0, '#39483f', 2),
    line(x0, g.top - 14, x0, g.top + g.height + 10, '#39483f', 2),
  );
  lines.push(text(g.left + g.width + 30, y0 + 5, 'x', 18), text(x0, g.top - 28, 'y', 18));
  if (p.numbers) lines.push(text(x0 - 10, y0 + 20, '0', 12, 'end'));
  if (p.connect && points.length > 1)
    lines.push(
      `<polyline points="${[...points, points[0]].map((v) => `${g.x(v.x)},${g.y(v.y)}`).join(' ')}" fill="none" stroke="#315b84" stroke-width="2"/>`,
    );
  points.forEach((v, i) => {
    const x = g.x(v.x),
      y = g.y(v.y);
    const coincident = points.slice(0, i).filter((q) => q.x === v.x && q.y === v.y).length;
    const label = showCoordinates ? `${v.label} (${num(v.x)}, ${num(v.y)})` : v.label;
    const right = x > 510,
      ly = Math.max(24, y - 12 - coincident * 18);
    lines.push(
      `<g data-point="${escapeXml(v.label)}"><circle cx="${x}" cy="${y}" r="5" fill="#254e76" stroke="white" stroke-width="1.5"/><text x="${x + (right ? -9 : 9)}" y="${ly}" text-anchor="${right ? 'end' : 'start'}" font-size="15" font-weight="600" fill="#254e76" stroke="white" stroke-width="3" paint-order="stroke">${escapeXml(label)}</text></g>`,
    );
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720" role="img" aria-label="Coordinate plane with ${points.length} labelled points" font-family="Arial, sans-serif"><title>Coordinate plane</title><desc>X from ${p.xmin} to ${p.xmax}; Y from ${p.ymin} to ${p.ymax}. Grid interval ${p.step}. Equal units on both axes.</desc><rect width="720" height="720" fill="white"/>${lines.join('')}</svg>`;
}
export function worksheetSvg(
  p: Plane,
  points: Point[],
  activity: Activity,
  paper: 'a4' | 'letter',
  title: string,
  answer = false,
) {
  validatePlane(p, points);
  const height = paper === 'a4' ? (800 * 297) / 210 : (800 * 11) / 8.5;
  const instruction =
    activity === 'blank'
      ? 'Use the grid for your own graph or construction.'
      : activity === 'plot'
        ? p.connect
          ? 'Plot and label each point. Join them in order and close the shape.'
          : 'Plot each ordered pair. Label each point.'
        : activity === 'read'
          ? 'Write the coordinates of each labelled point.'
          : 'Explore the labelled points and their coordinates.';
  const visiblePoints = activity === 'blank' || (activity === 'plot' && !answer) ? [] : points;
  const inner = planeSvg(p, visiblePoints, answer || activity === 'diagram').replace(
    '<svg ',
    '<svg x="40" y="105" ',
  );
  const heading = title || 'Coordinate plane';
  const headingSize = Math.min(24, 720 / (Math.max(1, [...heading].length) * 1.05));
  const rows =
    activity === 'blank'
      ? ''
      : points
          .map((v, i) => {
            const x = i < 6 ? 55 : 415,
              y = 855 + (i % 6) * 23;
            const values =
              activity === 'read' && !answer ? '( _____ , _____ )' : `(${num(v.x)}, ${num(v.y)})`;
            return `<text x="${x}" y="${y}" font-size="15" fill="#263b34">${escapeXml(v.label)}: ${values}</text>`;
          })
          .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}" font-family="Arial, sans-serif"><rect width="800" height="${height}" fill="white"/><text x="40" y="45" font-size="${headingSize}" fill="#263b34">${escapeXml(heading)}</text><text x="40" y="71" font-size="14" fill="#39483f">${answer ? 'ANSWER KEY' : 'Name: ________________________    Date: ______________'}</text><text x="40" y="95" font-size="14" fill="#39483f">${instruction}</text>${inner}${rows}<text x="40" y="${height - 24}" font-size="11" fill="#56645b">Grid interval: ${p.step}. Equal units on both axes. ${answer ? 'Answer key' : 'Worksheet'}.</text></svg>`;
}
