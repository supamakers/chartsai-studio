import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { summarizeSearchCsv } from '../src/lib/search-measurement';
const args = process.argv.slice(2);
const flag = (key: string) => {
  const i = args.indexOf(key);
  return i < 0 ? undefined : args[i + 1];
};
const current = flag('--current'),
  period = flag('--period'),
  previous = flag('--previous'),
  previousPeriod = flag('--previous-period');
if (!current || !period || (previous && !previousPeriod))
  throw Error(
    'Usage: npm run report:search -- --current Pages.csv --period YYYY-MM-DD:YYYY-MM-DD [--previous PreviousPages.csv --previous-period YYYY-MM-DD:YYYY-MM-DD]',
  );
function days(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/.test(value))
    throw Error('Use explicit YYYY-MM-DD:YYYY-MM-DD periods.');
  const [a, b] = value.split(':');
  for (const d of [a, b])
    if (new Date(d).toISOString().slice(0, 10) !== d) throw Error('Invalid calendar date.');
  const n = (Date.parse(b) - Date.parse(a)) / 86400000 + 1;
  if (n < 1) throw Error('Period end precedes start.');
  return n;
}
const currentDays = days(period);
if (previousPeriod && days(previousPeriod) !== currentDays) throw Error('Compare equal-length date ranges.');
if (previousPeriod && previousPeriod.split(':')[1] >= period.split(':')[0])
  throw Error('Comparison periods must not overlap; previous must precede current.');
const now = summarizeSearchCsv(await readFile(current, 'utf8')),
  before = previous ? summarizeSearchCsv(await readFile(previous, 'utf8')) : [];
const rows = [...new Set([...now, ...before].map((r) => r.cluster))].sort().map((cluster) => {
  const n = now.find((r) => r.cluster === cluster),
    p = before.find((r) => r.cluster === cluster);
  return {
    cluster,
    clicks: n?.clicks ?? 0,
    impressions: n?.impressions ?? 0,
    ctr: n?.ctr ?? null,
    previousClicks: previous ? (p?.clicks ?? 0) : null,
    previousImpressions: previous ? (p?.impressions ?? 0) : null,
  };
});
const result = {
  generatedAt: new Date().toISOString(),
  period,
  previousPeriod: previousPeriod ?? null,
  days: currentDays,
  rows,
  limitations: [
    'Pages export totals can differ from property-level totals; exports may be limited.',
    'CTR is recalculated from summed clicks and impressions, not averaged across rows.',
    'This report measures Google Web search only. AI-feature impressions and Plausible visitors/downloads require separate observations.',
    'No source URLs, query text or filenames are included in the output. Missing comparison data is not represented as zero.',
  ],
};
await mkdir('artifacts/search-review', { recursive: true });
await writeFile('artifacts/search-review/report.json', JSON.stringify(result, null, 2));
await writeFile(
  'artifacts/search-review/report.md',
  `# ChartsAI search review\n\nPeriod: ${period}. Comparison: ${previousPeriod ?? 'not supplied'}.\n\n| Cluster | Clicks | Impressions | CTR | Prior clicks | Prior impressions |\n|---|---:|---:|---:|---:|---:|\n` +
    rows
      .map(
        (r) =>
          `| ${r.cluster} | ${r.clicks} | ${r.impressions} | ${r.ctr === null ? 'undefined' : (r.ctr * 100).toFixed(2) + '%'} | ${r.previousClicks ?? 'not supplied'} | ${r.previousImpressions ?? 'not supplied'} |`,
      )
      .join('\n') +
    '\n\n' +
    result.limitations.map((s) => '- ' + s).join('\n') +
    '\n',
);
console.log('Saved private local reports under artifacts/search-review/.');
