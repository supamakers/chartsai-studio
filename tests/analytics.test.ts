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

import { datasetDownloadEvent } from '../src/lib/analytics-policy';
it('measures only known public dataset assets without transmitting dataset names or inputs', () => {
  for (const p of [
    '/datasets/assets/iris.csv',
    '/datasets/assets/abalone-chart.csv',
    '/datasets/assets/seeds-manifest.json',
    '/datasets/assets/wine.png',
  ])
    expect(datasetDownloadEvent(p)?.props.tool).toBe('public-dataset');
  expect(datasetDownloadEvent('/datasets/assets/iris.csv')).toEqual({
    name: 'Chart Download',
    props: { tool: 'public-dataset', format: 'csv' },
  });
  for (const p of [
    '/datasets/assets/customer.csv',
    '/datasets/assets/iris-chart.svg',
    '/datasets/assets/iris-manifest.csv',
    '/datasets/assets/iris.csv?secret=1',
    '/uploads/iris.csv',
  ])
    expect(datasetDownloadEvent(p)).toBeNull();
});
