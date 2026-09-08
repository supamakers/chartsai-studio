import { guideSlugs, datasetIds } from './resource-paths';
import { statFamilies, statPresetIds, statExamplePath, findStatPreset } from './stat-presets';
import { showcaseSlugs, showcaseGroups, findShowcase } from './showcase-specs';
export const productionHosts = ['www.chartsai.com', 'chartsai.com'];
const pagePaths = new Set([
  '/',
  '/charts/',
  '/guides/',
  '/datasets/',
  ...guideSlugs.map((s) => `/guides/${s}/`),
  ...datasetIds.map((s) => `/datasets/${s}/`),
  ...Object.values(statFamilies).flatMap((f) => [`/${f.tool}/`, `/examples/${f.hub}/`]),
  ...statPresetIds.map(statExamplePath),
  '/examples/',
  ...showcaseSlugs.map((slug) => `/examples/${slug}/`),
  ...Object.values(showcaseGroups).map((group) => `/examples/${group.slug}/`),
  '/dot-plot-maker/',
  '/radar-chart-maker/',
  '/line-graph-maker/',
  '/printables/',
  '/printables/habit-tracker/',
  '/about/',
  '/source/',
  '/privacy/',
  '/terms/',
]);
export function analyticsUrl(raw: string) {
  const url = new URL(raw);
  return `https://www.chartsai.com${pagePaths.has(url.pathname) ? url.pathname : '/404/'}`;
}
export function usageEvent(detail: unknown) {
  if (!detail || typeof detail !== 'object') return null;
  const { tool, action, format } = detail as Record<string, unknown>;
  const names: Record<string, string> = {
    histogram: 'histogram',
    box: 'box-plot',
    scatter: 'scatter-plot',
    bar: 'bar-chart',
    pareto: 'pareto-chart',
    dot: 'dot-plot',
    'dot-plot': 'dot-plot',
    radar: 'radar-chart',
    'radar-chart': 'radar-chart',
    line: 'line-graph',
    'habit-tracker': 'habit-tracker',
  };
  if (typeof tool !== 'string' || !Object.hasOwn(names, tool)) return null;
  const props: Record<string, string> = { tool: names[tool] };
  if (action === 'export') {
    if (typeof format !== 'string' || !['png', 'svg', 'pdf', 'csv', 'json'].includes(format)) return null;
    props.format = format;
    return { name: 'Chart Download', props };
  }
  if (action === 'render') return { name: 'Data Import', props };
  if (action === 'sample') return { name: 'Example Loaded', props };
  return null;
}

export function showcaseDownloadEvent(pathname: string) {
  const statMatch = pathname.match(/^\/charts\/assets\/([a-z-]+)\.(svg|png|csv|json)$/);
  if (statMatch) {
    const spec = findStatPreset(statMatch[1]);
    return spec ? usageEvent({ tool: spec.kind, action: 'export', format: statMatch[2] }) : null;
  }
  const match = pathname.match(/^\/examples\/assets\/([a-z-]+)\.(svg|png|csv|json)$/);
  if (!match) return null;
  const spec = findShowcase(match[1]);
  return spec ? usageEvent({ tool: spec.kind, action: 'export', format: match[2] }) : null;
}

/** Public, fixed dataset files only. Never derive properties from arbitrary filenames. */
export function datasetDownloadEvent(pathname: string) {
  const match = pathname.match(/^\/datasets\/assets\/([a-z]+)(-chart|-manifest)?\.(csv|svg|png|json)$/);
  if (!match || !datasetIds.includes(match[1])) return null;
  const [, , suffix, format] = match;
  if (suffix === '-chart' && format !== 'csv') return null;
  if (suffix === '-manifest' && format !== 'json') return null;
  if (!suffix && !['csv', 'svg', 'png', 'json'].includes(format)) return null;
  return { name: 'Chart Download', props: { tool: 'public-dataset', format } };
}
