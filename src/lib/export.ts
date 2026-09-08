export function emitUsage(tool: string, action: 'render' | 'export' | 'sample', format?: string) {
  // No network request or data values. A deployment may listen to this event.
  window.dispatchEvent(
    new CustomEvent('chartsai:usage', { detail: { tool, action, ...(format ? { format } : {}) } }),
  );
}

export function download(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function serialize(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('font-family', 'Arial, sans-serif');
  return new XMLSerializer().serializeToString(clone);
}

export async function svgToPng(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  return svgMarkupToPng(
    serialize(svg),
    svg.viewBox.baseVal.width * scale,
    svg.viewBox.baseVal.height * scale,
  );
}

export async function svgMarkupToPng(markup: string, width: number, height: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The image could not be rendered. Try the SVG download.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('PNG export is unavailable in this browser. Try SVG instead.');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('The PNG could not be created. Try SVG instead.');
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportChart(svg: SVGSVGElement, format: 'svg' | 'png', filename: string) {
  if (format === 'svg') download(serialize(svg), 'image/svg+xml;charset=utf-8', `${filename}.svg`);
  else download(await svgToPng(svg), 'image/png', `${filename}.png`);
}
