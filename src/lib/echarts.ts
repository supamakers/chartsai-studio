import type { EChartsOption } from 'echarts';
import { init, use } from 'echarts/core';
import { ScatterChart, RadarChart, LineChart, BarChart, BoxplotChart } from 'echarts/charts';
import {
  GridComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  AriaComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { createChartOption, type ChartSpec } from './chart-options';
use([
  BarChart,
  BoxplotChart,
  LineChart,
  ScatterChart,
  RadarChart,
  GridComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  AriaComponent,
  SVGRenderer,
]);
export { init };
export function renderChartSvg(spec: ChartSpec, width = 900, height = 600) {
  return renderOptionSvg(createChartOption(spec, width, height), width, height);
}
export function renderOptionSvg(option: EChartsOption, width = 1200, height = 800) {
  const chart = init(null, undefined, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  });
  try {
    chart.setOption(option);
    return chart.renderToSVGString();
  } finally {
    chart.dispose();
  }
}
