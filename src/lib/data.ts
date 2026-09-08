export type Table = string[][];
export type NumberStyle = 'us' | 'eu';

/** Parse quoted CSV/TSV without evaluating formulas or guessing business meaning. */
export function parseDelimited(text: string, delimiter: string): Table {
  const rows: Table = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const source = text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted || !cell.trim()) quoted = !quoted;
      else cell += c;
    } else if (!quoted && (c === delimiter || c === '\n')) {
      row.push(cell.trim());
      cell = '';
      if (c === '\n') {
        rows.push(row);
        row = [];
      }
    } else cell += c;
  }
  if (quoted)
    throw new Error(
      'A quoted cell is not closed. Check the quotation marks or paste cells directly from your spreadsheet.',
    );
  row.push(cell.trim());
  rows.push(row);
  while (rows.length && rows[rows.length - 1].every((c) => !c)) rows.pop();
  while (rows.length && rows[0].every((c) => !c)) rows.shift();
  return rows;
}

export function parseText(text: string, separator = 'auto'): Table {
  if (!text.trim()) return [];
  if (text.length > 2_000_000) throw new Error('Please paste a smaller table (under 2 MB).');
  const firstLine = text.trim().split(/\r?\n/)[0];
  let delimiter = separator;
  if (separator === 'auto') {
    delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';
    if (
      !/[\t;,]/.test(text) &&
      !/\n\s*\n/.test(text.trim()) &&
      text
        .trim()
        .split(/\s+/)
        .every((t) => Number.isFinite(Number(t)))
    ) {
      return text
        .trim()
        .split(/\s+/)
        .map((v) => [v]);
    }
  }
  const rows = parseDelimited(text, delimiter);
  if (
    separator === 'auto' &&
    rows.length === 1 &&
    rows[0].length > 1 &&
    rows[0].every((v) => readNumber(v) !== null)
  )
    return rows[0].map((v) => [v]);
  return rows;
}

export function readNumber(value: string, style: NumberStyle = 'us'): number | null {
  let s = value.trim().replace(/[\u00a0\u202f]/g, '');
  if (!s || /^(n\/?a|null|undefined|nan|-)$/i.test(s)) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  s = s.replace(/^[$€£₹¥]\s*/, '').replace(/\s*%$/, '');
  const decimal = style === 'us' ? '.' : ',';
  const grouping = style === 'us' ? ',' : '.';
  if (s.includes(grouping)) {
    if (
      s
        .split(decimal)
        .slice(1)
        .some((part) => part.includes(grouping))
    )
      return null;
    const integerPart = s.split(decimal)[0].replace(/^[+-]/, '');
    const parts = integerPart.split(grouping);
    if (
      parts.length < 2 ||
      parts[0].length < 1 ||
      parts[0].length > 3 ||
      parts.slice(1).some((p) => p.length !== 3)
    )
      return null;
    s = s.split(grouping).join('');
  }
  if (style === 'eu') s = s.replace(',', '.');
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const n = Number(s) * (negative ? -1 : 1);
  return Number.isFinite(n) && Math.abs(n) <= 1e12 ? n : null;
}

export function transpose(rows: Table): Table {
  const width = Math.max(0, ...rows.map((row) => row.length));
  return Array.from({ length: width }, (_, col) => rows.map((row) => row[col] ?? ''));
}

export function summarize(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const mean = values.reduce((sum, x) => sum + x / values.length, 0);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const counts = new Map<number, number>();
  sorted.forEach((n) => counts.set(n, (counts.get(n) ?? 0) + 1));
  return {
    mean,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    count: values.length,
    frequencies: [...counts].map(([value, count]) => ({ value, count })),
  };
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

export function csv(rows: Table) {
  return rows.map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

export async function readFileTables(file: File): Promise<Record<string, Table>> {
  if (file.size > 8_000_000)
    throw new Error('Choose a file smaller than 8 MB. You can also copy just the cells you need.');
  if (/\.(csv|tsv|txt)$/i.test(file.name))
    return {
      Data: parseText(await file.text(), /\.tsv$/i.test(file.name) ? '\t' : 'auto'),
    };
  if (!/\.xlsx$/i.test(file.name))
    throw new Error(
      'Choose a CSV, TSV, TXT or XLSX file. For other formats, copy the table and paste it here.',
    );
  const XLSX = await import('xlsx');
  const book = XLSX.read(await file.arrayBuffer(), {
    type: 'array',
    cellDates: false,
    sheetRows: 2002,
  });
  if (!book.SheetNames.length) throw new Error('This workbook has no readable sheets.');
  return Object.fromEntries(
    book.SheetNames.map((name) => {
      const sheet = book.Sheets[name];
      const range = sheet['!fullref'] || sheet['!ref'];
      if (range && XLSX.utils.decode_range(range).e.r >= 2001)
        throw new Error(
          'This sheet is larger than the 2,000-row import limit. Copy a smaller range so no records are silently omitted.',
        );
      return [
        name,
        XLSX.utils.sheet_to_json<string[]>(sheet, {
          header: 1,
          raw: false,
          defval: '',
          blankrows: true,
        }),
      ];
    }),
  );
}
