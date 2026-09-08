export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
export function monthLabel(value: string) {
  const [year, month] = value.split('-').map(Number);
  if (!year || month < 1 || month > 12) return 'Your month';
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}
export type TrackerConfig = {
  title: string;
  habits: string[];
  month: string;
  period: 'month' | 'week';
  paper: 'a4' | 'letter';
  ink: boolean;
  style?: 'editorial' | 'blueprint' | 'minimal';
};

export async function downloadTracker(config: TrackerConfig, svg: SVGSVGElement) {
  const { jsPDF } = await import('jspdf');
  const { svgToPng } = await import('./export');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: config.paper });
  const w = doc.internal.pageSize.getWidth(),
    h = doc.internal.pageSize.getHeight();
  // Render the same preview at print resolution, preserving Unicode text and layout.
  const blob = await svgToPng(svg, 3);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  doc.addImage(bytes, 'PNG', 0, 0, w, h);
  doc.setProperties({
    title: config.title,
    subject: 'Printable habit tracker',
    creator: 'ChartsAI by SupaMakers',
  });
  doc.save(`habit-tracker-${config.period === 'week' ? 'weekly' : config.month}-${config.paper}.pdf`);
}
