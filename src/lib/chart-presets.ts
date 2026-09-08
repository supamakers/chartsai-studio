import { dotPresets, radarPresets, linePresets } from './presets';
import { defaultPresentation, type DotSpec, type RadarSpec, type LineSpec } from './chart-options';
export function dotExample(id = 'scores'): DotSpec {
  const p = dotPresets.find((p) => p.id === id) || dotPresets[0];
  return {
    ...defaultPresentation,
    kind: 'dot',
    values: p.values,
    title: p.title,
    label: p.label,
    meanLine: true,
    showCounts: false,
    subtitle: `${p.values.length} observations · ${p.label}`,
    source: 'Source: fictional example data. Replace with your own.',
  };
}
export function radarExample(id = 'skills'): RadarSpec {
  const p = radarPresets.find((p) => p.id === id) || radarPresets[0];
  return {
    ...defaultPresentation,
    kind: 'radar',
    axes: p.axes,
    series: p.series,
    scores: p.scores,
    max: p.max,
    title: p.title,
    filled: true,
    round: false,
    subtitle: 'Two profiles, compared on the same 0–10 scale.',
    source: 'Source: fictional example data. Replace with your own.',
  };
}

export function lineExample(id = 'monthly'): LineSpec {
  const p = linePresets.find((p) => p.id === id) || linePresets[0];
  return {
    ...defaultPresentation,
    ...p,
    kind: 'line',
    zeroBaseline: true,
    markers: true,
    subtitle:
      p.xMode === 'category'
        ? 'Two shops · six months · fictional data'
        : 'Original fictional example · replace with your own data',
    source: 'Source: fictional example data. Replace with your own.',
  };
}
