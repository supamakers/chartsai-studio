import type { EChartsOption, SeriesOption } from 'echarts';
import { chartThemes, type ChartTheme } from './chart-options';
import { csv, readNumber, type Table } from './data';
import { validateLineTable } from './line-data';

export const editorialKinds = ['line', 'bar', 'dumbbell', 'slopegraph', 'small-multiples'] as const;
export type EditorialKind = (typeof editorialKinds)[number];
export const editorialNames: Record<EditorialKind, string> = {
  line: 'Annotated line graph',
  bar: 'Publication bar chart',
  dumbbell: 'Dumbbell chart',
  slopegraph: 'Slopegraph',
  'small-multiples': 'Small multiples',
};
export const publicationFrames = {
  article: { width: 1200, height: 900, name: 'Article · 1200 × 900' },
  square: { width: 1200, height: 1200, name: 'Square · 1200 × 1200' },
  wide: { width: 1600, height: 900, name: 'Presentation · 1600 × 900' },
};
export type Annotation = { label: string; series: string; text: string };
export type EditorialProject = {
  format: 'supamakers-chart';
  version: 1;
  kind: EditorialKind;
  table: Table;
  title: string;
  subtitle: string;
  unit: string;
  source: string;
  sourceUrl: string;
  date: string;
  caption: string;
  theme: ChartTheme;
  frame: keyof typeof publicationFrames;
  xMode: 'category' | 'number' | 'time';
  zero: boolean;
  directLabels: boolean;
  decimals: number;
  annotations: Annotation[];
};
export const projectDefaults = {
  format: 'supamakers-chart' as const,
  version: 1 as const,
  title: 'Your chart',
  subtitle: '',
  unit: 'Value',
  source: '',
  sourceUrl: '',
  date: '',
  caption: '',
  theme: 'editorial' as const,
  frame: 'article' as const,
  xMode: 'category' as const,
  zero: true,
  directLabels: true,
  decimals: 1,
  annotations: [] as Annotation[],
};
const fail = (message: string): never => {
  throw Error(message);
};
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const clean = (v: unknown, name: string, max: number, required = false) => {
  if (typeof v !== 'string' || v.length > max || /[\u0000-\u001f]/.test(v) || (required && !v.trim()))
    fail(`${name}: use ${required ? '1–' : 'up to '}${max} characters on one line.`);
  return v as string;
};
/** Pick known fields, reject invalid complete selections; never drop, aggregate or fill cells. */
export function validateProject(raw: unknown): EditorialProject {
  if (!record(raw) || raw.format !== 'supamakers-chart' || raw.version !== 1)
    fail('Choose a SupaMakers chart project, version 1. ECharts options are a different file format.');
  const r = raw as Record<string, any>;
  if (!editorialKinds.includes(r.kind)) fail('Choose a supported publication chart type.');
  if (!Object.hasOwn(chartThemes, r.theme) || !Object.hasOwn(publicationFrames, r.frame))
    fail('Choose a supported style and canvas size.');
  if (
    !['category', 'number', 'time'].includes(r.xMode) ||
    typeof r.zero !== 'boolean' ||
    typeof r.directLabels !== 'boolean' ||
    ![0, 1, 2, 3].includes(r.decimals)
  )
    fail('Check axis, labels and decimal settings.');
  const pair = r.kind === 'dumbbell' || r.kind === 'slopegraph';
  const limit = r.kind === 'slopegraph' ? 12 : r.kind === 'dumbbell' ? 30 : r.kind === 'bar' ? 30 : 300;
  if (!Array.isArray(r.table) || r.table.length < 2 || r.table.length > limit + 1)
    fail(`Use 1–${limit} data rows plus a header. No rows have been removed.`);
  const table: Table = r.table.map((row: unknown, i: number) => {
    if (!Array.isArray(row) || row.length < 2 || row.length > 6)
      fail(`Row ${i + 1}: include a label and 1–5 value columns.`);
    return (row as unknown[]).map((v, j) =>
      clean(v, `Row ${i + 1}, column ${j + 1}`, i && j ? 40 : 40, true),
    );
  });
  if (table.some((row) => row.length !== table[0].length))
    fail('Every row must have the same number of columns. Missing cells are not zero.');
  if (pair && table[0].length !== 3)
    fail('Choose exactly two value columns: the first and second comparison.');
  if (new Set(table[0].slice(1)).size !== table[0].length - 1) fail('Give every series a unique name.');
  if (
    table
      .slice(1)
      .some((row) => row.slice(1).some((v) => readNumber(v) === null || Math.abs(readNumber(v)!) > 1e12))
  )
    fail(
      'Every selected cell needs a finite number between −1 trillion and 1 trillion. Missing values are not zero.',
    );
  if (new Set(table.slice(1).map((row) => row[0])).size !== table.length - 1)
    fail('Use unique row labels. Repeated categories are never combined automatically.');
  if (r.kind === 'line' || r.kind === 'small-multiples') {
    const checked = validateLineTable(table, r.xMode);
    if (checked.error) fail(checked.error);
    checked.labels.forEach((label, i) => {
      table[i + 1][0] = label;
    });
  }
  if (r.kind === 'small-multiples' && table[0].length > 3 && r.frame !== 'square')
    fail('Choose the square canvas for three or more panels so labels and source notes have room.');
  const sourceUrl = clean(r.sourceUrl, 'Source URL', 400);
  if (sourceUrl) {
    try {
      if (!['https:', 'http:'].includes(new URL(sourceUrl).protocol))
        fail('Use an HTTP or HTTPS source URL.');
    } catch {
      fail('Use a complete HTTP or HTTPS source URL.');
    }
  }
  if (!Array.isArray(r.annotations) || r.annotations.length > 3) fail('Use up to three annotations.');
  const annotations: Annotation[] = r.annotations.map((a: unknown) => {
    if (!record(a)) fail('Check annotation settings.');
    const item = a as Record<string, unknown>;
    const label = clean(item.label, 'Annotation row', 40, true),
      series = clean(item.series, 'Annotation series', 40, true),
      text = clean(item.text, 'Annotation text', 100, true);
    if (!table.slice(1).some((row) => row[0] === label) || !table[0].slice(1).includes(series))
      fail(
        'Each annotation must reference an existing row and series. Update or remove it after changing data.',
      );
    return { label, series, text };
  });
  if (new Set(annotations.map((a) => JSON.stringify([a.label, a.series]))).size !== annotations.length)
    fail('Combine notes that refer to the same point.');
  return {
    format: 'supamakers-chart',
    version: 1,
    kind: r.kind,
    table,
    title: clean(r.title, 'Headline', 90, true),
    subtitle: clean(r.subtitle, 'Subtitle', 120),
    unit: clean(r.unit, 'Unit', 40),
    source: clean(r.source, 'Source', 140),
    sourceUrl,
    date: clean(r.date, 'Data date', 60),
    caption: clean(r.caption, 'Caption', 180),
    theme: r.theme,
    frame: r.frame,
    xMode: r.xMode,
    zero: r.zero,
    directLabels: r.directLabels,
    decimals: r.decimals,
    annotations,
  };
}
export function parseProject(text: string) {
  if (text.length > 250000) fail('Choose a project smaller than 250 KB.');
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    fail('This is not readable JSON. Choose a saved chart project.');
  }
  return validateProject(raw);
}
export function editorialValues(p: EditorialProject) {
  return p.table.slice(1).map((row) => row.slice(1).map((v) => readNumber(v)!));
}
export const editorialCsv = (p: EditorialProject) => csv(p.table);
export const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export function editorialDescription(p: EditorialProject) {
  return `${p.title}. ${editorialNames[p.kind]}; ${p.table.length - 1} rows. Unit: ${p.unit || 'not specified'}. ${p.caption} Exact values follow in the data table.`;
}
const wrap = (s: string, length: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of s.split(/\s+/)) {
    if (line.length + word.length + 1 > length && line) {
      lines.push(line);
      line = '';
    }
    const chunks = word.match(new RegExp(`.{1,${length}}`, 'g')) || [''];
    for (let i = 0; i < chunks.length; i++) {
      line += (line ? ' ' : '') + chunks[i];
      if (i < chunks.length - 1) {
        lines.push(line);
        line = '';
      }
    }
  }
  if (line) lines.push(line);
  return lines.join('\n');
};
/** Native ECharts axes/series are shared by the preview and every image export. */
export function editorialOption(p: EditorialProject, width = 1200, height = 900): EChartsOption {
  validateProject(p);
  const theme = chartThemes[p.theme],
    s = Math.min(width / 1200, height / 900),
    f = (n: number) => n * s;
  const labels = p.table.slice(1).map((row) => row[0]),
    names = p.table[0].slice(1),
    values = editorialValues(p);
  const number = (v: number) =>
    v.toLocaleString('en-US', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals });
  const footer = [
    ...p.annotations.map((a, i) => `${i + 1}. ${a.label} · ${a.series}: ${a.text}`),
    p.caption,
    p.source && `Source: ${p.source}`,
    p.date && `Data date: ${p.date}`,
  ]
    .filter(Boolean)
    .map((v) => wrap(v, 108))
    .join('\n');
  const footerHeight = (footer.split('\n').length * 23 + 25) * s;
  const headerBottom =
    30 +
    wrap(p.title, 58).split('\n').length * 38 +
    (p.subtitle ? 10 + wrap(p.subtitle, 95).split('\n').length * 23 : 0);
  const top = f(headerBottom + (p.kind === 'small-multiples' ? 90 : p.kind === 'line' ? 55 : 70)),
    bottom = footerHeight + f(65),
    titles: any[] = [
      {
        text: wrap(p.title, 58),
        subtext: wrap(p.subtitle, 95),
        left: f(40),
        top: f(30),
        textStyle: { fontSize: f(32), fontWeight: 600, lineHeight: f(38), color: theme.ink },
        subtextStyle: { fontSize: f(17), lineHeight: f(23), color: theme.muted },
      },
      {
        text: footer,
        left: f(40),
        bottom: f(22),
        textStyle: { fontWeight: 'normal', fontSize: f(16), lineHeight: f(23), color: theme.ink },
      },
    ];
  if (p.kind === 'line' || p.kind === 'small-multiples' || p.kind === 'slopegraph')
    titles.push({
      text: p.unit,
      left: f(40),
      top: f(headerBottom + 14),
      textStyle: { fontSize: f(16), fontWeight: 'normal', color: theme.muted },
    });
  const base: EChartsOption = {
    backgroundColor: theme.background,
    animation: false,
    textStyle: { fontFamily: 'Arial, sans-serif', color: theme.ink },
    title: titles,
    aria: { enabled: true, label: { description: editorialDescription(p) } },
    tooltip: { trigger: 'item', renderMode: 'richText', confine: true },
  };
  const axis = {
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { fontSize: f(17), color: theme.muted },
    splitLine: { lineStyle: { color: theme.line, type: 'dashed' as const } },
  };
  const flat = values.flat();
  let min = Math.min(...flat),
    max = Math.max(...flat);
  if (p.zero || p.kind === 'bar') {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const span = max - min || Math.max(1, Math.abs(max) * 0.1);
  min -= p.zero && min === 0 ? 0 : span * 0.08;
  max += span * 0.12;
  const order = 10 ** Math.floor(Math.log10(span / 4));
  const tick = ([1, 2, 5, 10].find((n) => n * order >= span / 4) ?? 10) * order;
  min = Math.floor(min / tick) * tick;
  max = Math.ceil(max / tick) * tick;
  const markers = (series: string, coord: (row: number, column: number) => any[]) => ({
    symbol: 'circle',
    symbolSize: f(26),
    symbolOffset: p.kind === 'dumbbell' ? [0, -f(25)] : [0, 0],
    itemStyle: { color: theme.ink },
    label: { color: theme.background, fontSize: f(15), formatter: (item: any) => item.name },
    data: p.annotations.flatMap((a, i) =>
      a.series === series
        ? [{ name: String(i + 1), coord: coord(labels.indexOf(a.label), names.indexOf(a.series)) }]
        : [],
    ),
  });
  const lineData = (column: number) =>
    labels.map((label, r) =>
      p.xMode === 'category'
        ? values[r][column]
        : [p.xMode === 'time' ? Date.parse(label + 'T00:00:00Z') : Number(label), values[r][column]],
    );
  if (p.kind === 'small-multiples') {
    const cols = names.length === 1 ? 1 : 2,
      rows = Math.ceil(names.length / cols),
      gap = f(68),
      panelH = (height - top - bottom - gap * (rows - 1)) / rows,
      panelW = (width - f(180) - (cols - 1) * f(90)) / cols;
    const grids = names.map((_, i) => ({
      left: f(85) + (i % cols) * (panelW + f(90)),
      top: top + Math.floor(i / cols) * (panelH + gap),
      width: panelW,
      height: panelH,
    }));
    names.forEach((name, i) =>
      titles.push({
        text: name,
        left: grids[i].left,
        top: grids[i].top - f(29),
        textStyle: { fontSize: f(19), color: theme.ink },
      }),
    );
    return {
      ...base,
      grid: grids,
      xAxis: names.map((_, i) => ({
        ...axis,
        gridIndex: i,
        type: p.xMode === 'category' ? 'category' : p.xMode === 'time' ? 'time' : 'value',
        ...(p.xMode === 'category'
          ? { data: labels, boundaryGap: false }
          : p.xMode === 'number'
            ? { scale: true, min: 'dataMin', max: 'dataMax' }
            : {}),
        axisLabel: {
          ...axis.axisLabel,
          hideOverlap: true,
          ...(p.xMode === 'number' ? { formatter: (v: number) => String(v) } : {}),
        },
        splitLine: { show: false },
      })),
      yAxis: names.map((_, i) => ({
        ...axis,
        gridIndex: i,
        type: 'value',
        min,
        max,
        splitNumber: 3,
        name: '',
        nameTextStyle: { fontSize: f(15) },
      })),
      series: names.map((name, i) => ({
        type: 'line',
        name,
        xAxisIndex: i,
        yAxisIndex: i,
        data: lineData(i),
        showSymbol: false,
        lineStyle: { width: f(3) },
        itemStyle: { color: theme.colors[0] },
        markPoint: markers(name, (r, c) => [
          p.xMode === 'category'
            ? r
            : p.xMode === 'time'
              ? Date.parse(labels[r] + 'T00:00:00Z')
              : Number(labels[r]),
          values[r][c],
        ]),
      })),
    } as EChartsOption;
  }
  if (p.kind === 'dumbbell') {
    const series: SeriesOption[] = labels.map((name, i) => ({
      type: 'line',
      name,
      data: [
        [values[i][0], i],
        [values[i][1], i],
      ],
      symbol: 'none',
      lineStyle: { color: theme.line, width: f(5) },
      silent: true,
    }));
    names.forEach((name, c) =>
      series.push({
        type: 'scatter',
        name,
        symbol: c ? 'diamond' : 'circle',
        symbolSize: f(14),
        itemStyle: { color: theme.colors[c], opacity: 1 },
        data: values.map((v, i) => [v[c], i]),
        label: {
          show: p.directLabels,
          position: c ? 'right' : 'left',
          fontSize: f(16),
          color: theme.ink,
          formatter: (v: any) => number(v.value[0]),
        },
        markPoint: markers(name, (r, col) => [values[r][col], r]),
      }),
    );
    return {
      ...base,
      legend: {
        top: top - f(30),
        left: f(200),
        data: names,
        selectedMode: false,
        textStyle: { fontSize: f(17) },
      },
      grid: { top: top + f(10), left: f(200), right: f(95), bottom },
      xAxis: { ...axis, type: 'value', min, max, name: p.unit, nameLocation: 'middle', nameGap: f(38) },
      yAxis: {
        ...axis,
        type: 'category',
        data: labels,
        inverse: true,
        splitLine: { show: false },
        axisLabel: { ...axis.axisLabel, width: f(160), overflow: 'break' },
      },
      series,
    } as EChartsOption;
  }
  if (p.kind === 'slopegraph') {
    return {
      ...base,
      grid: { top, left: f(225), right: f(235), bottom },
      xAxis: {
        ...axis,
        type: 'category',
        data: names,
        boundaryGap: false,
        splitLine: { show: false },
        position: 'top',
      },
      yAxis: {
        ...axis,
        type: 'value',
        min,
        max,
        name: '',
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      series: labels.map((name, r) => ({
        type: 'line',
        name,
        showSymbol: true,
        symbolSize: f(10),
        lineStyle: { width: f(2.5) },
        itemStyle: { color: theme.colors[r % theme.colors.length] },
        labelLayout: { moveOverlap: 'shiftY' },
        data: values[r].map((v, c) => ({
          value: v,
          label: {
            show: true,
            position: c ? 'right' : 'left',
            formatter: `${name}  ${number(v)}`,
            color: theme.ink,
            fontSize: f(17),
          },
        })),
        markPoint: {
          symbol: 'circle',
          symbolSize: f(26),
    symbolOffset: p.kind === 'dumbbell' ? [0, -f(25)] : [0, 0],
          label: { color: theme.background, formatter: (item: any) => item.name },
          itemStyle: { color: theme.ink },
          data: p.annotations.flatMap((a, i) =>
            a.label === name
              ? [
                  {
                    name: String(i + 1),
                    coord: [names.indexOf(a.series), values[r][names.indexOf(a.series)]],
                  },
                ]
              : [],
          ),
        },
      })),
    } as EChartsOption;
  }
  if (p.kind === 'bar') {
    return {
      ...base,
      legend: {
        top: top - f(30),
        left: f(200),
        data: names,
        selectedMode: false,
        textStyle: { fontSize: f(17) },
      },
      grid: { top: top + f(10), left: f(200), right: f(105), bottom },
      xAxis: { ...axis, type: 'value', scale: false, name: p.unit, nameLocation: 'middle', nameGap: f(40) },
      yAxis: {
        ...axis,
        type: 'category',
        data: labels,
        inverse: true,
        splitLine: { show: false },
        axisLabel: { ...axis.axisLabel, width: f(165), overflow: 'break' },
      },
      series: names.map((name, c) => ({
        type: 'bar',
        name,
        data: values.map((row) => ({ value: row[c], label: { position: row[c] < 0 ? 'left' : 'right' } })),
        itemStyle: { color: theme.colors[c] },
        label: {
          show: p.directLabels,
          position: 'right',
          fontSize: f(15),
          color: theme.ink,
          formatter: (v: any) => number(v.value),
        },
        markPoint: markers(name, (r, col) => [values[r][col], r]),
      })),
    } as EChartsOption;
  }
  return {
    ...base,
    useUTC: true,
    legend: {
      show: !p.directLabels,
      bottom: footerHeight + f(15),
      data: names,
      selectedMode: false,
      textStyle: { fontSize: f(17) },
    },
    grid: { top, left: f(95), right: p.directLabels ? f(190) : f(50), bottom },
    xAxis: {
      ...axis,
      type: p.xMode === 'category' ? 'category' : p.xMode === 'time' ? 'time' : 'value',
      ...(p.xMode === 'category'
        ? { data: labels, boundaryGap: false }
        : p.xMode === 'number'
          ? { scale: true, min: 'dataMin', max: 'dataMax' }
          : {}),
      axisLabel: {
        ...axis.axisLabel,
        hideOverlap: true,
        ...(p.xMode === 'number' ? { formatter: (v: number) => String(v) } : {}),
      },
      splitLine: { show: false },
    },
    yAxis: { ...axis, type: 'value', min, max, name: '', nameTextStyle: { fontSize: f(16) } },
    series: names.map((name, c) => ({
      type: 'line',
      name,
      data: lineData(c),
      showSymbol: false,
      lineStyle: { width: f(3), type: c % 2 ? 'dashed' : 'solid' },
      itemStyle: { color: theme.colors[c] },
      endLabel: {
        show: p.directLabels,
        formatter: name,
        color: theme.ink,
        fontSize: f(17),
        width: f(170),
        overflow: 'break',
      },
      labelLayout: { moveOverlap: 'shiftY' },
      markPoint: markers(name, (r, col) => [
        p.xMode === 'category'
          ? r
          : p.xMode === 'time'
            ? Date.parse(labels[r] + 'T00:00:00Z')
            : Number(labels[r]),
        values[r][col],
      ]),
    })),
  } as EChartsOption;
}
export function publicationHtml(p: EditorialProject, svg: string) {
  const e = escapeHtml;
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(p.title)}</title><style>body{margin:24px auto;padding:0 20px;max-width:1000px;font:16px/1.6 Arial,sans-serif;color:#202322}img{width:100%;height:auto}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd}.data{overflow:auto}h1{line-height:1.2}a{color:#174cc1}</style><h1>${e(p.title)}</h1><figure><img alt="${e(editorialDescription(p))}" src="data:image/svg+xml,${encodeURIComponent(svg)}"><figcaption>${e(p.caption)} ${p.sourceUrl ? `<a href="${e(p.sourceUrl)}">${e(p.source || 'Source')}</a>` : e(p.source)} ${e(p.date)}</figcaption></figure>${p.annotations.length ? `<ol>${p.annotations.map((a) => `<li>${e(a.label)} · ${e(a.series)}: ${e(a.text)}</li>`).join('')}</ol>` : ''}<div class="data"><table><caption>Source values · ${e(p.unit)}</caption><thead><tr>${p.table[0].map((v) => `<th scope="col">${e(v)}</th>`).join('')}</tr></thead><tbody>${p.table
    .slice(1)
    .map(
      (row) =>
        `<tr>${row.map((v, i) => (i ? `<td>${e(v)}</td>` : `<th scope="row">${e(v)}</th>`)).join('')}</tr>`,
    )
    .join('')}</tbody></table></div></html>`;
}

/** Adapter for AnimCharts' observed editorial-line v1 contract, kept independent of that repository. */
export function animChartsProject(p: EditorialProject) {
  validateProject(p);
  if (p.kind !== 'line' || p.table.length > 151 || p.table[0].length > 4)
    fail('AnimCharts supports dated line projects with up to 150 rows and three series.');
  if (p.xMode === 'category' || p.table.slice(1).some((row) => !/^\d{4}(?:-\d{2}-\d{2})?$/.test(row[0])))
    fail('For AnimCharts, use numeric years (YYYY) or real YYYY-MM-DD dates.');
  if (
    p.decimals > 2 ||
    p.caption.length > 100 ||
    p.subtitle.length > 100 ||
    p.table[0].slice(1).some((n) => n.length > 24) ||
    editorialValues(p)
      .flat()
      .some((n) => Math.abs(n) > 1e9)
  )
    fail(
      'For AnimCharts, use up to two decimals, 100-character subtitle/caption, 24-character series names, and values within ±1 billion.',
    );
  const source = [p.source, p.date].filter(Boolean).join(' · ');
  if (source.length > 130)
    fail('For AnimCharts, shorten the combined source credit and date to 130 characters.');
  if (new Set(p.annotations.map((a) => a.label)).size !== p.annotations.length)
    fail('AnimCharts allows one annotation per date. Combine notes on the same date.');
  return {
    version: 1,
    tool: 'editorial-line',
    settings: {
      csv: csv([
        p.table[0],
        ...p.table.slice(1).map((row, r) => [row[0], ...editorialValues(p)[r].map(String)]),
      ]),
      title: p.title,
      subtitle: p.subtitle,
      unit: p.unit,
      source,
      note: p.caption,
      palette: p.theme === 'night' ? 'teal' : 'blue',
      decimals: String(p.decimals),
      zero: String(p.zero),
      annotations: p.annotations.map((a) => ({
        date: a.label,
        series: p.table[0].indexOf(a.series) - 1,
        text: a.text,
      })),
      size: p.frame === 'square' ? 'square' : 'landscape',
      duration: '18',
      layout: 'standard',
      format: 'mp4',
      resolution: '720',
      rangeStart: '',
      rangeEnd: '',
      rangeLabel: '',
    },
    supamakersProject: p,
  };
}
