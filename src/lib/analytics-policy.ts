import { showcaseSlugs, showcaseGroups, findShowcase } from './showcase-specs';
export const productionHosts = ['www.chartsai.com', 'chartsai.com'];
const pagePaths = new Set([
  '/',
  '/charts/',
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
  const match = pathname.match(/^\/examples\/assets\/([a-z-]+)\.(svg|png|csv|json)$/);
  if (!match) return null;
  const spec = findShowcase(match[1]);
  return spec ? usageEvent({ tool: spec.kind, action: 'export', format: match[2] }) : null;
}
