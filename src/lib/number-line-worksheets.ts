import { defaults, fraction, numberLineSvg, type Inputs } from './math-tools';
import { escapeXml } from './coordinate-plane';

export const packIds = ['integers', 'fractions', 'jumps'] as const;
export type PackId = (typeof packIds)[number];
export type WorksheetSettings = {
  pack: PackId;
  count: 6 | 9 | 12;
  task: 'mixed' | 'plot' | 'read';
  denominator: 2 | 4 | 5 | 10;
  seed: number;
};
export const initialWorksheet: WorksheetSettings = {
  pack: 'integers',
  count: 6,
  task: 'mixed',
  denominator: 4,
  seed: 20260908,
};
export const packs: Record<
  PackId,
  { title: string; description: string; tip: string; example: string; mistake: string }
> = {
  integers: {
    title: 'Negative numbers',
    description:
      'Read and plot integers from −10 to 10. Alternate between locating a given number and identifying a marked point.',
    tip: 'Locate zero first. Each tick to the left is one less; each tick to the right is one more.',
    example:
      'A point three ticks left of zero has value −3. The point −7 is farther left because −7 is less than −3.',
    mistake:
      'Distance from zero does not determine which number is greater. −7 has a larger distance from zero than −3, but a smaller value.',
  },
  fractions: {
    title: 'Fractions on a number line',
    description:
      'Read and plot fractions on two-unit windows between 0 and 5. Start with quarters, then change the generator to halves, fifths or tenths.',
    tip: 'Count equal spaces in one whole unit to find the denominator. Count spaces from zero to find the numerator.',
    example:
      'With four equal spaces per unit, the third tick after zero is 3/4. Five ticks after zero is 5/4, which is between 1 and 2.',
    mistake:
      'Count the spaces, not the tick marks. Four spaces have five boundary marks. Equivalent fractions, such as 2/4 and 1/2, name the same point.',
  },
  jumps: {
    title: 'Addition & subtraction jumps',
    description:
      'Add or subtract 1–6 using unit jumps. Starting points and answers stay between −10 and 10; sets include both operations.',
    tip: 'Begin at the first number. Addition moves right; subtracting a positive number moves left. Draw one jump for each unit.',
    example: 'For −2 + 5, start at −2 and jump right five times: −1, 0, 1, 2, 3. The answer is 3.',
    mistake:
      'The starting point is not the first jump. Count the moves between ticks. These sheets subtract positive operands; subtracting a negative is outside this pack.',
  },
};
export type WorksheetQuestion = {
  id: number;
  kind: 'plot' | 'read' | 'jumps';
  prompt: string;
  answer: string;
  value: number;
  inputs: Inputs;
};
export function worksheetQuestions(s: WorksheetSettings): WorksheetQuestion[] {
  if (
    !packIds.includes(s.pack) ||
    ![6, 9, 12].includes(s.count) ||
    !['mixed', 'plot', 'read'].includes(s.task) ||
    ![2, 4, 5, 10].includes(s.denominator) ||
    !Number.isSafeInteger(s.seed) ||
    s.seed < 1 ||
    s.seed > 2147483647
  )
    throw new Error('Choose a supported worksheet setting.');
  let state = s.seed;
  const random = () => {
    state = Math.imul(state ^ (state >>> 16), 0x45d9f3b);
    state = Math.imul(state ^ (state >>> 16), 0x45d9f3b);
    state ^= state >>> 16;
    return (state >>> 0) / 4294967296;
  };
  const shuffle = <T>(a: T[]) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // A finite pool guarantees distinct exercises. Fraction halves use shifted windows
  // so twelve questions remain distinct without changing the fractional tick size.
  if (s.pack === 'jumps') {
    const pool = (sign: number) =>
      shuffle(
        Array.from({ length: 21 }, (_, i) => i - 10).flatMap((start) =>
          Array.from({ length: 6 }, (_, i) => i + 1)
            .filter((n) => Math.abs(start + sign * n) <= 10)
            .map((n) => ({ start, n, sign })),
        ),
      );
    const plus = pool(1),
      minus = pool(-1);
    return Array.from({ length: s.count }, (_, index) => {
      const { start, n, sign } = (index % 2 ? minus : plus)[Math.floor(index / 2)];
      const value = start + sign * n,
        equation = `${start} ${sign > 0 ? '+' : '−'} ${n}`;
      return {
        id: index + 1,
        kind: 'jumps',
        prompt: `${equation} = ____ . Draw ${n} unit ${n === 1 ? 'jump' : 'jumps'} ${sign > 0 ? 'right' : 'left'} from ${start}.`,
        answer: `${equation} = ${value}. ${n} ${n === 1 ? 'move' : 'moves'} ${sign > 0 ? 'right' : 'left'} from ${start} ${n === 1 ? 'ends' : 'end'} at ${value}.`,
        value,
        inputs: {
          ...defaults['number-line'],
          min: '-10',
          max: '10',
          start: String(start),
          jump: String(sign),
          count: String(n),
          mode: 'jumps',
        },
      };
    });
  }
  const candidates =
    s.pack === 'integers'
      ? shuffle(Array.from({ length: 19 }, (_, i) => ({ value: i - 9, min: -10, max: 10 })))
      : shuffle(
          [0, 1, 2, 3].flatMap((min) =>
            Array.from({ length: 2 * s.denominator - 1 }, (_, i) => ({
              value: min + (i + 1) / s.denominator,
              min,
              max: min + 2,
            })),
          ),
        );
  return candidates.slice(0, s.count).map(({ value, min, max }, index) => {
    const kind = s.task === 'mixed' ? (index % 2 === 0 ? 'plot' : 'read') : s.task;
    return {
      id: index + 1,
      kind,
      prompt:
        kind === 'plot'
          ? `Plot and label point A at ${fraction(value)}.`
          : 'What number does point A represent? A = ____',
      answer: `A = ${fraction(value)}. Each space represents ${s.pack === 'fractions' ? fraction(1 / s.denominator) : '1'}.`,
      value,
      inputs: {
        ...defaults['number-line'],
        mode: 'points',
        min: String(min),
        max: String(max),
        step: s.pack === 'fractions' ? String(1 / s.denominator) : '1',
        points: String(value),
      },
    };
  });
}
export function questionDiagram(q: WorksheetQuestion, answer: boolean, prefix = 'worksheet') {
  return numberLineSvg(q.inputs, answer || q.kind === 'read', {
    compact: true,
    anchorsOnly: q.kind === 'read',
    markerId: `${prefix}-${q.id}`,
  });
}
export function worksheetCode(s: WorksheetSettings) {
  return `NL1-${s.pack}-${s.count}-${s.task}-${s.denominator}-${s.seed}`;
}
export type WorksheetPage = { svg: string; answer: boolean; number: number };
export function worksheetPages(
  s: WorksheetSettings,
  paper: 'a4' | 'letter',
  includeKey = true,
): WorksheetPage[] {
  const questions = worksheetQuestions(s),
    pages: WorksheetPage[] = [];
  const height = paper === 'a4' ? 1131 : 1035,
    perPage = 3,
    total = Math.ceil(questions.length / perPage);
  const text = (x: number, y: number, value: string, size = 16) =>
    `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="#243c32">${escapeXml(value)}</text>`;
  for (const answer of includeKey ? [false, true] : [false])
    for (let p = 0; p < total; p++) {
      let body =
        `<rect width="800" height="${height}" fill="white"/>` +
        text(50, 55, packs[s.pack].title, 26) +
        text(
          50,
          85,
          answer
            ? 'Answer key — keep separate from question sheets'
            : 'Practice worksheet — show your working',
          16,
        ) +
        text(50, 115, `Set ${s.seed} · ${answer ? 'Key' : 'Questions'} ${p + 1} of ${total}`, 13);
      if (!answer) body += text(50, 148, 'Name: __________________________     Date: ______________', 15);
      questions.slice(p * perPage, (p + 1) * perPage).forEach((q, index) => {
        const y = 185 + index * ((height - 245) / 3);
        body += text(50, y, `${q.id}. ${q.prompt}`, 16);
        body += questionDiagram(q, answer, `sheet-${answer}-${p}`).replace(
          '<svg ',
          `<svg x="40" y="${y + 10}" `,
        );
        body += text(
          55,
          y + 225,
          answer ? q.answer : 'Working / answer: __________________________________________',
          15,
        );
      });
      body += text(
        50,
        height - 26,
        `${worksheetCode(s)} · ${paper === 'a4' ? 'A4' : 'US Letter'} · chartsai.com`,
        10,
      );
      pages.push({
        answer,
        number: p + 1,
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}" role="img" aria-label="${answer ? 'Answer key' : 'Practice questions'}, page ${p + 1}"><title>${escapeXml(packs[s.pack].title)} — ${answer ? 'answer key' : 'questions'} ${p + 1}</title>${body}</svg>`,
      });
    }
  return pages;
}
export function worksheetCsv(s: WorksheetSettings) {
  return [
    ['Question', 'Task', 'Answer', 'Set'],
    ...worksheetQuestions(s).map((q) => [q.id, q.prompt, q.answer, worksheetCode(s)]),
  ]
    .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    .join('\r\n');
}
