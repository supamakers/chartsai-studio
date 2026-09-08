import type { EChartsOption } from 'echarts';
import { dotExample, lineExample } from './chart-presets';
import { defaults, numberLineSvg } from './math-tools';
export const homeInk = '#123ac0';
export const homePink = '#d32f79';
const axis = {
  axisLine: { show: true, lineStyle: { color: homeInk, width: 1 } },
  axisTick: { show: true },
  axisLabel: { color: homeInk, fontSize: 14, fontFamily: 'Arial' },
  splitLine: { show: false },
};
const common = {
  animation: false,
  textStyle: { fontFamily: 'Arial', color: homeInk },
  backgroundColor: 'transparent',
};
export function homeDotOption(): EChartsOption {
  const seen = new Map<number, number>();
  const points = dotExample('scores').values.map((x) => {
    const y = (seen.get(x) || 0) + 1;
    seen.set(x, y);
    return [x, y];
  });
  return {
    ...common,
    grid: { left: 28, right: 15, top: 12, bottom: 30 },
    xAxis: { ...axis, type: 'value', min: 48, max: 104, interval: 16 },
    yAxis: { type: 'value', min: 0, max: 9, show: false },
    series: [{ type: 'scatter', symbolSize: 7, data: points, itemStyle: { color: homeInk, opacity: 1 } }],
  };
}
export function homeLineOption(): EChartsOption {
  const sample = lineExample();
  return {
    ...common,
    grid: { left: 32, right: 14, top: 12, bottom: 30 },
    xAxis: {
      ...axis,
      type: 'category',
      data: sample.labels,
      axisLabel: { ...axis.axisLabel, interval: 0, fontSize: 12 },
    },
    yAxis: {
      ...axis,
      type: 'value',
      min: 0,
      splitNumber: 3,
      splitLine: { show: true, lineStyle: { color: '#a8bcd3', type: 'dashed' } },
    },
    series: sample.series.map((name, n) => ({
      type: 'line' as const,
      name,
      data: sample.values.map((row) => row[n]),
      symbolSize: 5,
      lineStyle: { color: n ? homeInk : homePink, width: 2 },
      itemStyle: { color: n ? homeInk : homePink },
    })),
  };
}
export function homeSlopeOption(): EChartsOption {
  // 300 / 10 = 180 / 6: both axes use 30 pixels per unit.
  return {
    ...common,
    grid: { left: 30, top: 12, width: 300, height: 180 },
    xAxis: {
      ...axis,
      type: 'value',
      min: -4,
      max: 6,
      interval: 1,
      axisLine: { onZero: true, lineStyle: { color: homeInk } },
      axisLabel: { ...axis.axisLabel, fontSize: 14 },
      splitLine: { show: true, lineStyle: { color: '#d3b5ce' } },
    },
    yAxis: {
      ...axis,
      type: 'value',
      min: -2,
      max: 4,
      interval: 1,
      axisLine: { onZero: true, lineStyle: { color: homeInk } },
      axisLabel: { ...axis.axisLabel, fontSize: 14 },
      splitLine: { show: true, lineStyle: { color: '#d3b5ce' } },
    },
    series: [
      {
        type: 'line',
        data: [
          [-4, -5 / 3],
          [4.5, 4],
        ],
        showSymbol: false,
        lineStyle: { color: homePink, width: 2 },
      },
      {
        type: 'scatter',
        data: [
          [0, 1],
          [3, 3],
        ],
        symbolSize: 6,
        itemStyle: { color: homePink },
      },
    ],
  };
}
export function homeNumberLine(answer = false) {
  return numberLineSvg(
    { ...defaults['number-line'], mode: 'points', min: '-4', max: '4', step: '1', points: '3' },
    answer,
    { compact: true, anchorsOnly: false, markerId: 'home-number-line' },
  )
    .replace('viewBox="0 230 720 200"', 'viewBox="0 295 720 200"')
    .replaceAll('font-size="13"', 'font-size="34"')
    .replaceAll('font-size="15"', 'font-size="26"')
    .replaceAll('stroke-width="2"', 'stroke-width="3"')
    .replaceAll('r="6"', 'r="9"')
    .replaceAll('v12" stroke="#39483f"', 'v12" stroke-width="2.5" stroke="#39483f"')
    .replaceAll('#39483f', homeInk)
    .replaceAll('#315b84', homeInk)
    .replaceAll('#254e76', homeInk);
}
