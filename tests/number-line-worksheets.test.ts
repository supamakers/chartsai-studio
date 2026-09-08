import { describe, it, expect } from 'vitest';
import {
  initialWorksheet,
  packIds,
  worksheetQuestions,
  worksheetPages,
  questionDiagram,
  worksheetCsv,
} from '../src/lib/number-line-worksheets';
import { numberLineResult } from '../src/lib/math-tools';
import { analyticsUrl, showcaseDownloadEvent, usageEvent } from '../src/lib/analytics-policy';
describe('number-line worksheet sets', () => {
  it('is reproducible and produces a different set for the next seed', () => {
    for (const pack of packIds) {
      const s = { ...initialWorksheet, pack };
      expect(worksheetQuestions(s)).toEqual(worksheetQuestions(s));
      expect(worksheetQuestions({ ...s, seed: s.seed + 1 })).not.toEqual(worksheetQuestions(s));
    }
  });
  it('keeps every task unique, exactly on its ticks and within its range', () => {
    for (const pack of packIds)
      for (const denominator of [2, 4, 5, 10] as const)
        for (const task of ['mixed', 'read', 'plot'] as const)
          for (let seed = 1; seed <= 100; seed++) {
            const qs = worksheetQuestions({ ...initialWorksheet, pack, denominator, task, seed, count: 12 });
            expect(qs).toHaveLength(12);
            expect(new Set(qs.map((q) => JSON.stringify([q.kind, q.inputs]))).size).toBe(12);
            for (const q of qs) {
              const r = numberLineResult(q.inputs);
              expect(q.value).toBeGreaterThanOrEqual(r.min);
              expect(q.value).toBeLessThanOrEqual(r.max);
              expect((q.value - r.min) / r.step).toBeCloseTo(Math.round((q.value - r.min) / r.step), 8);
              if (q.kind === 'jumps')
                expect(q.value).toBe(Number(q.inputs.start) + Number(q.inputs.jump) * Number(q.inputs.count));
            }
          }
  });
  it('does not reveal plotting solutions or reading values in captions', () => {
    for (const pack of packIds) {
      const s = { ...initialWorksheet, pack };
      for (const q of worksheetQuestions(s)) {
        const svg = questionDiagram(q, false);
        expect(svg).not.toContain('Plot ');
        if (q.kind === 'plot') expect(svg).not.toContain('<circle');
        if (q.kind === 'read') {
          expect(svg).toContain('<circle');
          expect(svg.match(/<text /g)).toHaveLength(3);
        }
        if (q.kind === 'jumps') {
          expect(svg).not.toContain('marker-end=');
          expect(questionDiagram(q, true)).toContain('marker-end=');
        }
      }
    }
  });
  it('puts matching answers after all question pages for both paper sizes', () => {
    for (const paper of ['a4', 'letter'] as const)
      for (const count of [6, 9, 12] as const) {
        const s = { ...initialWorksheet, count };
        const pages = worksheetPages(s, paper, true),
          q = worksheetQuestions(s);
        expect(pages).toHaveLength((count / 3) * 2);
        expect(pages.map((p) => p.answer)).toEqual([
          ...Array(count / 3).fill(false),
          ...Array(count / 3).fill(true),
        ]);
        expect(worksheetPages(s, paper, false)).toEqual(pages.slice(0, count / 3));
        for (const item of q) {
          expect(pages.slice(0, count / 3).some((p) => p.svg.includes(item.answer))).toBe(false);
          expect(pages.slice(count / 3).some((p) => p.svg.includes(item.answer))).toBe(true);
        }
      }
  });
  it('rejects unsupported settings and exposes explicit text answers in CSV', () => {
    expect(() => worksheetQuestions({ ...initialWorksheet, seed: NaN })).toThrow();
    expect(() => worksheetQuestions({ ...initialWorksheet, count: 5 as 6 })).toThrow();
    expect(worksheetCsv(initialWorksheet).split('\r\n')).toHaveLength(7);
  });
  it('tracks only fixed worksheet paths and event properties', () => {
    expect(analyticsUrl('https://www.chartsai.com/number-line-worksheets/?name=private')).toBe(
      'https://www.chartsai.com/number-line-worksheets/',
    );
    expect(showcaseDownloadEvent('/worksheets/assets/integers-a4.pdf')?.props).toEqual({
      tool: 'number-line-worksheets',
      format: 'pdf',
    });
    expect(showcaseDownloadEvent('/worksheets/assets/private.pdf')).toBeNull();
    expect(usageEvent({ tool: 'number-line-worksheets', action: 'sample', seed: 123 })).toEqual({
      name: 'Example Loaded',
      props: { tool: 'number-line-worksheets' },
    });
  });
});
