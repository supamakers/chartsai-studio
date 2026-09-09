// Fixed public identifiers shared by the gallery, editor and privacy boundary.
export const templateKinds = {
  'life-expectancy-gap': 'dumbbell',
  'commute-gap': 'dumbbell',
  'library-access': 'dumbbell',
  'delivery-times': 'dumbbell',
  'life-expectancy-change': 'slopegraph',
  'waiting-times': 'slopegraph',
  'league-points': 'slopegraph',
  'energy-use': 'slopegraph',
  'life-expectancy-paths': 'small-multiples',
  'library-visits': 'small-multiples',
  'seasonal-orders': 'small-multiples',
  'route-reliability': 'small-multiples',
} as const;
export type EditorialTemplateId = keyof typeof templateKinds;
export type TemplateKind = (typeof templateKinds)[EditorialTemplateId];
export function templateId(value: unknown): EditorialTemplateId | undefined {
  return typeof value === 'string' && Object.hasOwn(templateKinds, value)
    ? (value as EditorialTemplateId)
    : undefined;
}
export const templateCollectionPath = (kind: TemplateKind) => `/editorial-charts/${kind}-examples/`;
export function templateEditorPath(id: EditorialTemplateId) {
  const routes = {
    dumbbell: '/dumbbell-chart-maker/',
    slopegraph: '/slopegraph-maker/',
    'small-multiples': '/small-multiples-chart-maker/',
  };
  return `${routes[templateKinds[id]]}?template=${id}#editor`;
}
