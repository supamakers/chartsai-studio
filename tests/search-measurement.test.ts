import { it, expect } from 'vitest';
import { summarizeSearchCsv, searchCluster } from '../src/lib/search-measurement';
it('aggregates clicks and impressions and recalculates weighted CTR', () => {
  const rows = summarizeSearchCsv(
    'Top pages,Clicks,Impressions,CTR,Position\nhttps://www.chartsai.com/histogram-maker/,2,10,20%,1\nhttps://www.chartsai.com/examples/histograms/histogram-class-scores/,1,90,1.11%,8',
  );
  expect(rows).toEqual([{ cluster: 'histogram', rows: 2, clicks: 3, impressions: 100, ctr: 0.03 }]);
});
it('separates undefined CTR and rejects invalid or mismatched exports', () => {
  expect(
    summarizeSearchCsv('Page,Clicks,Impressions\nhttps://www.chartsai.com/datasets/iris/,0,0')[0].ctr,
  ).toBeNull();
  for (const text of [
    'Query,Clicks,Impressions\nsecret,1,2',
    'Page,Clicks,Impressions\nhttps://www.chartsai.com/,3,2',
    'Page,Clicks,Impressions\nhttps://example.com/,1,2',
    'Page,Clicks,Impressions\nhttps://www.chartsai.com/,1,2\nhttps://www.chartsai.com/,1,2',
  ])
    expect(() => summarizeSearchCsv(text)).toThrow();
});
it('uses bounded groups and never returns query strings or private page identifiers', () => {
  expect(searchCluster('https://www.chartsai.com/line-graph-maker/?title=SECRET')).toBe('line');
  expect(searchCluster('https://www.chartsai.com/private-id/')).toBe('legacy-or-unmapped');
  expect(searchCluster('https://www.chartsai.com/examples/dot-plot-fractions/')).toBe('dot');
});
it('retains separately reported host variants without confusing page totals with property totals', () => {
  const rows = summarizeSearchCsv(
    'Page,Clicks,Impressions\nhttps://chartsai.com/contact,0,4\nhttps://www.chartsai.com/contact,0,2',
  );
  expect(rows[0]).toMatchObject({ rows: 2, impressions: 6 });
});
