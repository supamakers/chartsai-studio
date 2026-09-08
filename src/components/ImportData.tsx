import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Upload, ArrowRight, Columns3, AlertCircle } from 'lucide-react';
import { parseText, readFileTables, readNumber, transpose, type Table, type NumberStyle } from '../lib/data';

export default function ImportData({
  kind,
  onClose,
  onImport,
}: {
  kind: 'dot' | 'radar' | 'line';
  onClose: () => void;
  onImport: (table: Table, style: NumberStyle) => void;
}) {
  const [text, setText] = useState('');
  const [sheets, setSheets] = useState<Record<string, Table>>({});
  const [sheet, setSheet] = useState('');
  const [separator, setSeparator] = useState('auto');
  const [header, setHeader] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(0);
  const [column, setColumn] = useState(0);
  const [labelColumn, setLabelColumn] = useState(0);
  const [selected, setSelected] = useState<number[]>([1, 2]);
  const [style, setStyle] = useState<NumberStyle>('us');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  const source = sheets[sheet] ?? [];
  const sourceRows = flipped ? transpose(source) : source;
  const table = useMemo(
    () => (flipped ? transpose(source) : source).slice(start - 1, end || undefined),
    [source, flipped, start, end],
  );
  const width = Math.max(0, ...table.map((row) => row.length));
  const body = header ? table.slice(1) : table;
  const labels = Array.from({ length: width }, (_, i) =>
    header ? table[0]?.[i] || `Column ${i + 1}` : `Column ${i + 1}`,
  );
  function load(tables: Record<string, Table>, name = Object.keys(tables)[0]) {
    const rows = tables[name] ?? [];
    if (rows.length > 2001 || rows.some((row) => row.length > 100))
      throw new Error('Select a smaller table: at most 2,000 rows and 100 columns.');
    setSheets(tables);
    setSheet(name);
    setStart(1);
    setEnd(0);
    setFlipped(false);
    const hasHeader =
      rows.length > 1 &&
      rows[0].some((v, i) => readNumber(v) === null && readNumber(rows[1]?.[i] ?? '') !== null);
    setHeader(hasHeader);
    const firstValues = rows[hasHeader ? 1 : 0] ?? [];
    const numeric = firstValues.map((v, i) => (readNumber(v) !== null ? i : -1)).filter((i) => i >= 0);
    setColumn(numeric[0] ?? 0);
    setLabelColumn(0);
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
  function preview() {
    try {
      load({ Pasted: parseText(text, separator) });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const selectedColumns = kind === 'dot' ? [column] : selected.filter((i) => i !== labelColumn && i < width);
  const invalid = body.flatMap((row, r) =>
    selectedColumns
      .filter((c) => readNumber(row[c] ?? '', style) === null)
      .map((c) => `Row ${r + start + (header ? 1 : 0)}, ${labels[c] ?? 'column'}: “${row[c] || 'empty'}”`),
  );
  const canImport =
    body.length > 0 &&
    selectedColumns.length > 0 &&
    !invalid.length &&
    (kind === 'dot' || body.every((row) => !!row[labelColumn]?.trim()));
  function commit() {
    if (!canImport) return;
    if (kind === 'dot' && body.length > 300) {
      setError(
        'A dot plot supports up to 300 observations. Select a smaller range; no rows have been removed.',
      );
      return;
    }
    if (kind === 'radar' && (body.length < 3 || body.length > 10 || selectedColumns.length > 5)) {
      setError('Use 3–10 dimensions and 1–5 score series for a readable radar chart.');
      return;
    }
    if (kind === 'line' && (body.length < 2 || body.length > 300 || selectedColumns.length > 5)) {
      setError('Use 2–300 points and 1–5 numeric series for a line graph. No rows have been removed.');
      return;
    }
    const result =
      kind === 'dot'
        ? body.map((row) => [row[column]])
        : [
            [labels[labelColumn], ...selectedColumns.map((c) => labels[c])],
            ...body.map((row) => [row[labelColumn], ...selectedColumns.map((c) => row[c])]),
          ];
    onImport(result, style);
    onClose();
  }
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="import-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-heading"
        ref={dialog}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'Tab') {
            const items = dialog.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select, textarea, [tabindex="0"]',
            );
            if (!items?.length) return;
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
            <span className="eyebrow">YOUR DATA, YOUR DEVICE</span>
            <h2 id="import-heading">Bring your data along.</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close import">
            <X size={20} />
          </button>
        </div>
        <p className="muted">
          Paste cells from a spreadsheet or choose a file. Check the preview before using it.
        </p>
        <textarea
          aria-label="Paste your data"
          placeholder={
            kind === 'dot'
              ? 'Paste numbers or spreadsheet cells here…\n64, 68, 72, 72, 76, 80'
              : kind === 'line'
                ? 'Month\tOrders\tTarget\nJan\t120\t100\nFeb\t145\t125'
                : 'Dimension\tAlex\tSam\nResearch\t8\t5\nDesign\t9\t6\nWriting\t7\t8'
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
          <button className="button small" onClick={preview} disabled={!text.trim()}>
            Preview paste <ArrowRight size={16} />
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
          CSV, TSV, TXT or Excel (.xlsx), up to 8 MB. Commas separate values unless you choose another
          separator. No file is uploaded to a server.
        </p>
        {source.length > 0 && (
          <div className="import-preview">
            <div className="mapping-grid">
              <label>
                Sheet
                <select aria-label="Sheet" value={sheet} onChange={(e) => load(sheets, e.target.value)}>
                  {Object.keys(sheets).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
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
            <div className="check-row">
              <label>
                <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} /> First
                selected row is a header
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
                <Columns3 size={15} /> Swap rows and columns
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
            {kind === 'dot' ? (
              <label className="mapping-choice">
                Which column contains your values?
                <select value={column} onChange={(e) => setColumn(Number(e.target.value))}>
                  {labels.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label className="mapping-choice">
                  {kind === 'line'
                    ? 'Which column contains the horizontal labels?'
                    : 'Which column names the dimensions?'}
                  <select value={labelColumn} onChange={(e) => setLabelColumn(Number(e.target.value))}>
                    {labels.map((label, i) => (
                      <option key={i} value={i}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend>
                    {kind === 'line'
                      ? 'Choose the numeric series to plot'
                      : 'Choose the score series to compare'}
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
              </>
            )}
            <p className="fine-print">
              Currency formatting is read as numbers; 12% is read as 12. Choose columns with consistent units.
              Missing values are never replaced with zero.
            </p>
            {kind !== 'dot' && body.some((row) => !row[labelColumn]?.trim()) && (
              <p className="notice error" role="status">
                Every row needs a label. Check the label column or selected rows.
              </p>
            )}
            {invalid.length > 0 && (
              <div className="notice error" role="status">
                <AlertCircle size={17} />
                <div>
                  {invalid.length} cell{invalid.length === 1 ? '' : 's'} need attention.{' '}
                  {invalid.slice(0, 2).join('; ')}. Check the column, number format or source data.
                </div>
              </div>
            )}
            <button className="button" disabled={!canImport || busy} onClick={commit}>
              Use {body.length} {kind === 'dot' ? 'values' : kind === 'line' ? 'points' : 'dimensions'}{' '}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
