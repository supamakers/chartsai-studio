import { init, use } from 'echarts/core';
import { ScatterChart, RadarChart, LineChart } from 'echarts/charts';
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
  const chart = init(null, undefined, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  });
  try {
    chart.setOption(createChartOption(spec, width, height));
    return chart.renderToSVGString();
  } finally {
    chart.dispose();
  }
}
