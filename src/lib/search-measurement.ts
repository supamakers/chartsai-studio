import { parseText, readNumber } from './data';
import { showcaseSpecs, showcaseGroups } from './showcase-specs';
import { statFamilies } from './stat-presets';
export function searchCluster(raw: string) {
  const u = new URL(raw, 'https://www.chartsai.com');
  if (!['www.chartsai.com', 'chartsai.com'].includes(u.hostname))
    throw Error('The export contains a page outside ChartsAI.');
  const path = u.pathname.endsWith('/') ? u.pathname : u.pathname + '/';
  for (const [kind, f] of Object.entries(statFamilies))
    if (path === `/${f.tool}/` || path.startsWith(`/examples/${f.hub}/`)) return kind;
  for (const [kind, g] of Object.entries(showcaseGroups))
    if (path === g.tool || path === `/examples/${g.slug}/`) return kind;
  const legacy = path.match(/^\/examples\/([^/]+)\/$/)?.[1];
  if (legacy && Object.hasOwn(showcaseSpecs, legacy))
    return showcaseSpecs[legacy as keyof typeof showcaseSpecs].kind;
  if (path.startsWith('/guides/')) return 'guides';
  if (path.startsWith('/datasets/')) return 'datasets';
  if (path.startsWith('/printables/')) return 'printables';
  if (['/', '/charts/', '/examples/', '/about/', '/source/', '/privacy/', '/terms/'].includes(path))
    return 'site-and-collections';
  return 'legacy-or-unmapped';
}
export function summarizeSearchCsv(text: string) {
  const table = parseText(text),
    headers = table[0]?.map((h) => h.trim().toLowerCase()) ?? [];
  const pageIndex = headers.findIndex((h) => ['top pages', 'page', 'pages', 'landing page'].includes(h)),
    clickIndex = headers.indexOf('clicks'),
    impressionIndex = headers.indexOf('impressions');
  if ([pageIndex, clickIndex, impressionIndex].some((n) => n < 0))
    throw Error(
      'Use the Pages CSV export with Page/Top pages, Clicks and Impressions columns. Query exports are not accepted.',
    );
  const groups = new Map<string, { cluster: string; rows: number; clicks: number; impressions: number }>();
  const seen = new Set<string>();
  for (const row of table.slice(1)) {
    if (row.length !== headers.length) throw Error('Every CSV row must match the header.');
    const url = new URL(row[pageIndex]);
    const key = url.href;
    if (seen.has(key)) throw Error('Duplicate landing pages: use a single Pages export for one period.');
    seen.add(key);
    const cluster = searchCluster(url.href),
      clicks = readNumber(row[clickIndex]),
      impressions = readNumber(row[impressionIndex]);
    if (
      clicks === null ||
      impressions === null ||
      !Number.isSafeInteger(clicks) ||
      !Number.isSafeInteger(impressions) ||
      clicks < 0 ||
      impressions < clicks
    )
      throw Error(
        'Clicks and impressions must be nonnegative integer counts, with clicks no greater than impressions.',
      );
    const g = groups.get(cluster) ?? { cluster, rows: 0, clicks: 0, impressions: 0 };
    g.rows++;
    g.clicks += clicks;
    g.impressions += impressions;
    groups.set(cluster, g);
  }
  return [...groups.values()]
    .map((g) => ({ ...g, ctr: g.impressions ? g.clicks / g.impressions : null }))
    .sort((a, b) => b.impressions - a.impressions || a.cluster.localeCompare(b.cluster));
}
