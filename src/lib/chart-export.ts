import { chartFrames, createChartOption, type ChartSpec } from './chart-options';
import { download, svgMarkupToPng } from './export';
export type ChartExportFormat = 'png' | 'svg' | 'pdf';
export async function exportEChart(spec: ChartSpec, format: ChartExportFormat) {
  const { renderChartSvg } = await import('./echarts');
  const { width, height } = chartFrames[spec.frame];
  const svg = renderChartSvg(spec, width, height);
  const filename = spec.kind === 'dot' ? 'dot-plot' : 'radar-chart';
  if (format === 'svg') {
    download(svg, 'image/svg+xml;charset=utf-8', `${filename}.svg`);
    return;
  }
  const png = await svgMarkupToPng(svg, width, height);
  if (format === 'png') {
    download(png, 'image/png', `${filename}.png`);
    return;
  }
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: width >= height ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [width * 0.75, height * 0.75],
  });
  doc.addImage(
    new Uint8Array(await png.arrayBuffer()),
    'PNG',
    0,
    0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
  );
  doc.setProperties({ title: spec.title, creator: 'ChartsAI by SupaMakers' });
  doc.save(`${filename}.pdf`);
}
export function exportChartConfig(spec: ChartSpec) {
  const { width, height } = chartFrames[spec.frame];
  // Optional callbacks are omitted; the option remains valid ECharts JSON.
  download(
    JSON.stringify(createChartOption(spec, width, height), null, 2),
    'application/json',
    `${spec.kind}-echarts-option.json`,
  );
}
