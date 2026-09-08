import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Upload, ArrowRight, Columns3, AlertCircle } from 'lucide-react';
import { parseText, readFileTables, readNumber, transpose, type Table, type NumberStyle } from '../lib/data';
import { chartInputs, type JourneyKind, type ImportSettings } from '../lib/chart-journey';

export default function ImportData({
  kind,
  initialFile,
  radarMax = 10,
  onClose,
  onImport,
}: {
  kind: JourneyKind;
  initialFile?: File;
  radarMax?: number;
  onClose: () => void;
  onImport: (table: Table, style: NumberStyle, columnLabel?: string, settings?: ImportSettings) => void;
}) {
  const guide = chartInputs[kind],
    single = kind === 'dot' || kind === 'histogram',
    paired = kind === 'scatter',
    grouped = kind === 'box',
    oneMeasure = grouped || kind === 'pareto';
  const [text, setText] = useState(''),
    [sheets, setSheets] = useState<Record<string, Table>>({}),
    [sheet, setSheet] = useState('');
  const [separator, setSeparator] = useState('auto'),
    [header, setHeader] = useState(false),
    [flipped, setFlipped] = useState(false);
  const [start, setStart] = useState(1),
    [end, setEnd] = useState(0),
    [column, setColumn] = useState(0),
    [labelColumn, setLabelColumn] = useState(0),
    [yColumn, setYColumn] = useState(1);
  const [selected, setSelected] = useState<number[]>([]),
    [style, setStyle] = useState<NumberStyle>('us'),
    [scale, setScale] = useState(String(radarMax)),
    [lineMode, setLineMode] = useState<ImportSettings['lineMode']>('category');
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null),
    fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(
    () => setError(''),
    [column, labelColumn, yColumn, selected, style, scale, lineMode, header, flipped, start, end],
  );
  const source = useMemo(() => sheets[sheet] ?? [], [sheets, sheet]);
  useEffect(() => {
    if (source.length) dialog.current?.querySelector<HTMLSelectElement>('select')?.focus();
    else dialog.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  }, [source]);
  const sourceRows = flipped ? transpose(source) : source;
  const table = sourceRows.slice(start - 1, end || undefined),
    width = Math.max(0, ...table.map((r) => r.length)),
    body = header ? table.slice(1) : table;
  const labels = Array.from({ length: width }, (_, i) =>
    header ? table[0]?.[i] || `Column ${i + 1}` : `Column ${i + 1}`,
  );
  function load(tables: Record<string, Table>, name = Object.keys(tables)[0]) {
    const rows = tables[name] ?? [];
    if (!rows.length) throw Error('No data cells were found. Choose another file or paste your values.');
    if (rows.length > 2001 || rows.some((r) => r.length > 100))
      throw Error('Select a smaller table: at most 2,000 rows and 100 columns.');
    const hasHeader =
      rows.length > 1 &&
      rows[0].some((v, i) => readNumber(v) === null && readNumber(rows[1]?.[i] ?? '') !== null);
    const first = rows[hasHeader ? 1 : 0] ?? [],
      numeric = first.map((v, i) => (readNumber(v) !== null ? i : -1)).filter((i) => i >= 0);
    const group = first.findIndex((v) => readNumber(v) === null);
    setSheets(tables);
    setSheet(name);
    setStart(1);
    setEnd(0);
    setFlipped(false);
    setHeader(hasHeader);
    setLabelColumn(grouped ? group : 0);
    setColumn(numeric[0] ?? 0);
    setYColumn(numeric[1] ?? Math.min(1, first.length - 1));
    if (oneMeasure) setColumn(numeric.find((i) => i !== (grouped ? group : 0)) ?? 0);
    setSelected(numeric.filter((i) => i !== 0).slice(0, 5));
    setError('');
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      load(await readFileTables(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (initialFile) void upload(initialFile);
  }, [initialFile]);
  function preview() {
    try {
      load({ Pasted: parseText(text, separator) });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const units = (n: number) =>
    guide.unit === 'category' ? (n === 1 ? 'category' : 'categories') : guide.unit + (n === 1 ? '' : 's');
  const selectedColumns = paired
    ? [column, yColumn]
    : single || oneMeasure
      ? [column]
      : selected.filter((i) => i !== labelColumn && i < width);
  const invalid = body.flatMap((row, r) =>
    selectedColumns
      .filter((c) => readNumber(row[c] ?? '', style) === null)
      .map((c) => `Row ${r + start + (header ? 1 : 0)}, ${labels[c] ?? 'column'}: “${row[c] || 'empty'}”`),
  );
  let validation = '';
  if (body.length < guide.min || body.length > guide.max)
    validation = `A ${guide.name} supports ${guide.min === 1 ? 'up to' : `${guide.min}–`}${guide.min === 1 ? ' ' : ''}${guide.max} ${units(guide.max)}. Select a suitable row range above; no values have been removed.`;
  else if (!selectedColumns.length) validation = 'Choose at least one numeric series.';
  else if ((kind === 'dumbbell' || kind === 'slopegraph') && selectedColumns.length !== 2)
    validation = 'Choose exactly two numeric series for this paired comparison.';
  else if (selectedColumns.length > 5) validation = 'Choose at most five numeric series.';
  else if (paired && column === yColumn) validation = 'Choose two different columns for X and Y.';
  else if (oneMeasure && column === labelColumn)
    validation = 'Choose a value column different from the group or category column.';
  else if (!single && !paired && labelColumn >= 0 && body.some((r) => !r[labelColumn]?.trim()))
    validation = 'Every selected row needs a label. Check the label column or row range.';
  else if (
    kind === 'radar' &&
    (!scale.trim() || !Number.isFinite(Number(scale)) || Number(scale) <= 0 || Number(scale) > 1e6)
  )
    validation = 'Choose a shared scale maximum greater than zero and no larger than 1,000,000.';
  else if (
    kind === 'radar' &&
    !invalid.length &&
    body.some((r) =>
      selectedColumns.some((c) => {
        const n = readNumber(r[c], style)!;
        return n < 0 || n > Number(scale);
      }),
    )
  )
    validation = `Scores must be between 0 and ${scale}. Adjust the shared scale or check the selected values.`;
  const canImport = body.length > 0 && !invalid.length && !validation;
  function commit() {
    if (!canImport || busy) return;
    const result: Table = single
      ? body.map((r) => [r[column]])
      : paired
        ? [[labels[column], labels[yColumn]], ...body.map((r) => [r[column], r[yColumn]])]
        : [
            [
              labelColumn < 0 ? (labels[column] === 'Group' ? 'Box group' : 'Group') : labels[labelColumn],
              ...selectedColumns.map((c) => labels[c]),
            ],
            ...body.map((r) => [
              labelColumn < 0 ? 'All values' : r[labelColumn],
              ...selectedColumns.map((c) => r[c]),
            ]),
          ];
    try {
      onImport(result, style, single && header ? labels[column] : undefined, {
        radarMax: Number(scale),
        lineMode,
      });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const columnOptions = labels.map((label, i) => (
    <option key={i} value={i}>
      {label}
    </option>
  ));
  const labelPrompt = grouped
    ? 'Group column (optional)'
    : kind === 'radar'
      ? 'Which column names the dimensions?'
      : kind === 'line' || kind === 'small-multiples'
        ? 'Which column contains the labels or X values?'
        : 'Category column';
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="import-modal dot-import-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-heading"
        ref={dialog}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'Tab') {
            const items = Array.from(
              dialog.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled), input:not(:disabled), select, textarea, [tabindex="0"]',
              ) ?? [],
            ).filter((el) => el.getClientRects().length > 0);
            if (!items.length) return;
            const first = items[0],
              last = items[items.length - 1];
            if (
              e.shiftKey &&
              (document.activeElement === first || document.activeElement === dialog.current)
            ) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">STEP {source.length ? '2' : '1'} OF 2 · ADD YOUR DATA</span>
            <h2 id="import-heading">
              {source.length
                ? 'Choose the values to plot'
                : initialFile
                  ? 'Read your spreadsheet'
                  : 'Paste numbers or cells'}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close import">
            <X size={20} />
          </button>
        </div>
        {!source.length && (
          <div className="import-source-entry">
            <p className="muted">Copy cells from Excel or Google Sheets. {guide.input}</p>
            <textarea
              aria-label="Paste your data"
              placeholder={
                single
                  ? 'Score\n64\n68\n72'
                  : paired
                    ? 'Height,Weight\n160,55\n175,70'
                    : grouped
                      ? 'Group,Value\nA,12\nA,15\nB,18'
                      : kind === 'radar'
                        ? 'Dimension,Alex,Sam\nResearch,8,5\nDesign,9,6\nWriting,7,8'
                        : 'Label,Value\nFirst,12\nSecond,18'
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
            />
            <div className="import-actions">
              <label>
                Separator
                <select value={separator} onChange={(e) => setSeparator(e.target.value)}>
                  <option value="auto">Detect automatically</option>
                  <option value=",">Comma</option>
                  <option value=";">Semicolon</option>
                  <option value={'\t'}>Tab</option>
                </select>
              </label>
              <button className="button small" onClick={preview} disabled={!text.trim() || busy}>
                Preview paste
                <ArrowRight size={16} />
              </button>
              <span className="muted">or</span>
              <button
                className="button secondary small"
                onClick={() => fileInput.current?.click()}
                disabled={busy}
              >
                <Upload size={15} />
                {busy ? 'Reading…' : 'Choose file'}
              </button>
              <input
                hidden
                ref={fileInput}
                type="file"
                accept=".csv,.tsv,.txt,.xlsx"
                onChange={(e) => {
                  void upload(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>
            <p className="fine-print">
              CSV, TSV, TXT or Excel (.xlsx), up to 8 MB. No file is uploaded to a server.
            </p>
          </div>
        )}
        {busy && <p role="status">Reading your file on this device…</p>}
        {!!source.length && (
          <div className="import-preview">
            <div className="dot-import-summary">
              <p>{guide.mapping}</p>
              <button
                className="text-button"
                onClick={() => {
                  setSheets({});
                  setSheet('');
                  setError('');
                }}
              >
                Choose different data
              </button>
            </div>
            {Object.keys(sheets).length > 1 && (
              <label className="mapping-choice">
                Sheet
                <select aria-label="Sheet" value={sheet} onChange={(e) => load(sheets, e.target.value)}>
                  {Object.keys(sheets).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
            {single ? (
              <label className="mapping-choice">
                Which column contains your values?
                <select value={column} onChange={(e) => setColumn(Number(e.target.value))}>
                  {columnOptions}
                </select>
              </label>
            ) : paired ? (
              <div className="journey-pair-mapping">
                <label className="mapping-choice">
                  X column (horizontal)
                  <select value={column} onChange={(e) => setColumn(Number(e.target.value))}>
                    {columnOptions}
                  </select>
                </label>
                <label className="mapping-choice">
                  Y column (vertical)
                  <select value={yColumn} onChange={(e) => setYColumn(Number(e.target.value))}>
                    {columnOptions}
                  </select>
                </label>
              </div>
            ) : (
              <>
                <label className="mapping-choice">
                  {labelPrompt}
                  <select value={labelColumn} onChange={(e) => setLabelColumn(Number(e.target.value))}>
                    {grouped && <option value={-1}>No groups — one box for all values</option>}
                    {columnOptions}
                  </select>
                </label>
                {oneMeasure ? (
                  <label className="mapping-choice">
                    {grouped ? 'Value column' : 'Measure column'}
                    <select value={column} onChange={(e) => setColumn(Number(e.target.value))}>
                      {columnOptions}
                    </select>
                  </label>
                ) : (
                  <fieldset>
                    <legend>
                      {kind === 'radar'
                        ? 'Choose the score series to compare'
                        : 'Choose the numeric series to plot'}
                    </legend>
                    <div className="check-row">
                      {labels.map(
                        (label, i) =>
                          i !== labelColumn && (
                            <label key={i}>
                              <input
                                type="checkbox"
                                checked={selected.includes(i)}
                                onChange={(e) =>
                                  setSelected(
                                    e.target.checked ? [...selected, i] : selected.filter((c) => c !== i),
                                  )
                                }
                              />
                              {label}
                            </label>
                          ),
                      )}
                    </div>
                  </fieldset>
                )}
              </>
            )}
            {kind === 'radar' && (
              <label className="mapping-choice">
                Shared scale: 0 to
                <input
                  type="number"
                  min="0.01"
                  max="1000000"
                  step="any"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                />
              </label>
            )}
            {(kind === 'line' || kind === 'small-multiples') && (
              <label className="mapping-choice">
                Horizontal spacing
                <select
                  value={lineMode}
                  onChange={(e) => setLineMode(e.target.value as ImportSettings['lineMode'])}
                >
                  <option value="category">Equal spacing — labels in row order</option>
                  <option value="number">Numeric distance</option>
                  <option value="time">Elapsed days — YYYY-MM-DD dates</option>
                </select>
              </label>
            )}
            <details className="import-advanced">
              <summary>Row range & number format (optional)</summary>
              <div className="mapping-grid">
                <label>
                  Start at row
                  <input
                    type="number"
                    min="1"
                    max={sourceRows.length}
                    value={start}
                    onChange={(e) => setStart(Math.max(1, Number(e.target.value) || 1))}
                  />
                </label>
                <label>
                  End at row
                  <input
                    type="number"
                    min={start}
                    max={sourceRows.length}
                    value={end || sourceRows.length}
                    onChange={(e) => setEnd(Math.max(start, Number(e.target.value) || sourceRows.length))}
                  />
                </label>
                <label>
                  Number format
                  <select value={style} onChange={(e) => setStyle(e.target.value as NumberStyle)}>
                    <option value="us">1,234.56</option>
                    <option value="eu">1.234,56</option>
                  </select>
                </label>
              </div>
            </details>
            <div className="check-row">
              <label>
                <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />
                First selected row is a header
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={flipped}
                  onChange={(e) => {
                    setFlipped(e.target.checked);
                    setStart(1);
                    setEnd(0);
                  }}
                />
                <Columns3 size={15} />
                Swap rows and columns
              </label>
            </div>
            <div className="table-scroll">
              <table>
                <caption>Preview of the first 6 selected rows. Your original values are preserved.</caption>
                <thead>
                  <tr>
                    {labels.map((label, i) => (
                      <th key={i}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.slice(0, 6).map((row, r) => (
                    <tr key={r}>
                      {labels.map((_, c) => (
                        <td key={c}>{row[c] || <span className="muted">empty</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fine-print">
              Currency formatting is read as numbers; 12% is read as 12. Use consistent units. Missing values
              are never replaced with zero.
            </p>
            {!!invalid.length && (
              <div className="notice error" role="status">
                <AlertCircle size={17} />
                <div>
                  {invalid.length} cell{invalid.length === 1 ? '' : 's'} need attention.{' '}
                  {invalid.slice(0, 2).join('; ')}. Check the selected columns, number format or source data.
                </div>
              </div>
            )}
            {validation && (
              <p className="notice error" role="status">
                {validation}
              </p>
            )}
            {error && (
              <p className="notice error" role="alert">
                {error}
              </p>
            )}
            {canImport && (
              <p className="dot-import-ready">
                Ready to plot{' '}
                <strong>
                  {body.length} {units(body.length)}
                </strong>
                {single ? (
                  <>
                    {' '}
                    from <strong>{labels[column]}</strong>
                  </>
                ) : paired ? (
                  <>
                    {' '}
                    using <strong>{labels[column]}</strong> and <strong>{labels[yColumn]}</strong>
                  </>
                ) : (
                  <>
                    {' '}
                    with <strong>{selectedColumns.length} numeric series</strong>
                  </>
                )}
                . Every selected row is kept.
              </p>
            )}
            <div className="dot-import-confirm">
              <button className="button" disabled={!canImport || busy} onClick={commit}>
                Create {guide.name} with {body.length} {units(body.length)}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        {!source.length && error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
