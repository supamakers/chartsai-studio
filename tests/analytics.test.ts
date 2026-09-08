import { it, expect } from 'vitest';
import { analyticsUrl, usageEvent } from '../src/lib/analytics-policy';
it('only sends fixed properties and never forwards raw data', () => {
  expect(
    usageEvent({
      tool: 'line',
      action: 'export',
      format: 'pdf',
      title: 'SECRET',
      values: [123],
    }),
  ).toEqual({
    name: 'Chart Download',
    props: { tool: 'line-graph', format: 'pdf' },
  });
  expect(usageEvent({ tool: 'radar-chart', action: 'render' })).toEqual({
    name: 'Data Import',
    props: { tool: 'radar-chart' },
  });
  expect(usageEvent({ tool: 'habit-tracker', action: 'export', format: 'pdf' })).toEqual({
    name: 'Chart Download',
    props: { tool: 'habit-tracker', format: 'pdf' },
  });
  for (const tool of ['secret title', 'constructor', 'toString', '__proto__'])
    expect(usageEvent({ tool, action: 'sample' })).toBeNull();
  expect(usageEvent({ tool: 'dot', action: 'export', format: 'secret filename' })).toBeNull();
});
it('strips all queries and hashes, and groups unknown paths without exposing identifiers', () => {
  expect(analyticsUrl('https://www.chartsai.com/line-graph-maker/?title=SECRET#data')).toBe(
    'https://www.chartsai.com/line-graph-maker/',
  );
  expect(analyticsUrl('https://www.chartsai.com/private-customer-123')).toBe('https://www.chartsai.com/404/');
});
