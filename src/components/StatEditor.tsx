import { datasetIds } from '../lib/resource-paths';
import { useEffect, useRef, useState } from 'react';
import type { EChartsType } from 'echarts/core';
import { statOption, analyzeStat, statDescription, type StatSpec, type StatKind } from '../lib/statistics';
import { defaultStat, findStatPreset, statFamilies, statPresetIds, statPresets } from '../lib/stat-presets';
import { chartFrames, chartThemes } from '../lib/chart-options';
import { parseText, csv, readNumber, type Table, type NumberStyle } from '../lib/data';
import { download, svgMarkupToPng, emitUsage } from '../lib/export';
import { StylePicker } from './ChartControls';
import ImportData from './ImportData';
export default function StatEditor({ kind, initialSvg }: { kind: StatKind; initialSvg: string }) {
  const initial = defaultStat(kind);
  const [spec, setSpec] = useState<StatSpec>(initial),
    [raw, setRaw] = useState(csv(initial.table)),
    [message, setMessage] = useState(''),
    [importing, setImporting] = useState(false),
    [format, setFormat] = useState('png'),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false);
  const host = useRef<HTMLDivElement>(null),
    chart = useRef<EChartsType | null>(null),
    latest = useRef(spec);
  latest.current = spec;
  let analysis: ReturnType<typeof analyzeStat> | undefined,
    error = '';
  try {
    analysis = analyzeStat(spec);
  } catch (e) {
    error = (e as Error).message;
  }
  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams(location.search),
      p = findStatPreset(q.get('example'), kind);
    if (p) {
      setSpec(p);
      setRaw(csv(p.table));
      setMessage('Worked example loaded. All data is fictional.');
    } else {
      const id = q.get('dataset');
      if (kind === 'scatter' && id && datasetIds.includes(id)) {
        void Promise.all([
          import('../data/datasets'),
          fetch(`/datasets/assets/${id}-chart.csv`).then((r) => {
            if (!r.ok) throw Error('Dataset download failed');
            return r.text();
          }),
        ])
          .then(([{ datasetSpec }, text]) => {
            const next = datasetSpec(id, parseText(text));
            analyzeStat(next);
            if (!cancelled) {
              setSpec(next);
              setRaw(csv(next.table));
              setMessage('UCI dataset selection loaded. Source and selection notes are on the dataset page.');
            }
          })
          .catch(() => {
            if (!cancelled) setMessage('The public dataset could not load. Reload to try again.');
          });
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    void import('../lib/echarts')
      .then(({ init }) => {
        if (cancelled || !host.current) return;
        const el = host.current;
        chart.current = init(el, undefined, { renderer: 'svg' });
        const draw = () => {
          try {
            chart.current?.resize();
            chart.current?.setOption(statOption(latest.current, el.clientWidth, el.clientHeight), {
              notMerge: true,
            });
            setReady(true);
          } catch {
            /* Invalid input is reported beside the editor. */
          }
        };
        draw();
        observer = new ResizeObserver(draw);
        observer.observe(el);
      })
      .catch(() => setMessage('The chart engine could not load. Reload to try again.'));
    return () => {
      cancelled = true;
      observer?.disconnect();
      chart.current?.dispose();
      chart.current = null;
    };
  }, []);
  useEffect(() => {
    if (!error && host.current && chart.current)
      chart.current.setOption(statOption(spec, host.current.clientWidth, host.current.clientHeight), {
        notMerge: true,
      });
  }, [spec, error]);
  const change = (patch: Partial<StatSpec>) => setSpec((s) => ({ ...s, ...patch }));
  function applyTable(table: Table) {
    const next = {
      ...spec,
      ...(kind === 'histogram' ? { binStart: '', binWidth: '' } : {}),
      table,
      subtitle: '',
      source:
        spec.source.startsWith('Source: fictional') || spec.source.startsWith('Source: UCI')
          ? ''
          : spec.source,
    };
    analyzeStat(next);
    setSpec(next);
    setRaw(csv(table));
    setMessage(
      'Data applied. Every selected row is included.' +
        (kind === 'histogram' ? ' Bin start and width reset to automatic for the new values.' : ''),
    );
    emitUsage(kind, 'render');
  }
  function paste() {
    try {
      applyTable(parseText(raw));
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  function imported(table: Table, style: NumberStyle) {
    try {
      const t =
        kind === 'histogram'
          ? [[spec.xLabel || 'Value'], ...table.map((row) => [String(readNumber(row[0], style))])]
          : table.map((row, r) =>
              row.map((v, c) => (r && (c > 0 || kind === 'scatter') ? String(readNumber(v, style)) : v)),
            );
      applyTable(t);
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function save() {
    if (error) return;
    setBusy(true);
    try {
      const { width, height } = chartFrames[spec.frame];
      if (format === 'csv') download(csv(spec.table), 'text/csv', `${kind}-data.csv`);
      else if (format === 'json')
        download(
          JSON.stringify(statOption(spec, width, height), null, 2),
          'application/json',
          `${kind}-echarts-option.json`,
        );
      else {
        const { renderOptionSvg } = await import('../lib/echarts');
        const svg = renderOptionSvg(statOption(spec, width, height), width, height);
        if (format === 'svg') download(svg, 'image/svg+xml', `${kind}.svg`);
        else {
          const png = await svgMarkupToPng(svg, width, height);
          if (format === 'png') download(png, 'image/png', `${kind}.png`);
          else {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({
              compress: true,
              orientation: width >= height ? 'landscape' : 'portrait',
              unit: 'pt',
              format: [width * 0.75, height * 0.75],
            });
            doc.addImage(new Uint8Array(await png.arrayBuffer()), 'PNG', 0, 0, width * 0.75, height * 0.75);
            doc.setProperties({ title: spec.title, creator: 'ChartsAI by SupaMakers' });
            doc.save(`${kind}.pdf`);
          }
        }
      }
      emitUsage(kind, 'export', format);
      setMessage('Your file is ready.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stat-editor" id="editor">
      <div className="stat-editor-heading">
        <span className="eyebrow">{statFamilies[kind].name.toUpperCase()} STUDIO</span>
        <span>Local data · Free downloads</span>
      </div>
      <div className="stat-workspace">
        <aside className="stat-controls">
          <label className="field">
            Start with an example
            <select
              aria-label="Worked example"
              onChange={(e) => {
                const p = findStatPreset(e.target.value, kind);
                if (p) {
                  setSpec(p);
                  setRaw(csv(p.table));
                  setMessage('Worked example loaded. All data is fictional.');
                  emitUsage(kind, 'sample');
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Choose an example
              </option>
              {statPresetIds
                .filter((id) => statPresets[id].kind === kind)
                .map((id) => (
                  <option key={id} value={id}>
                    {statPresets[id].title}
                  </option>
                ))}
            </select>
          </label>
          <button className="button secondary" onClick={() => setImporting(true)}>
            Paste or import a spreadsheet
          </button>
          <label className="field">
            Data table
            <textarea aria-label="Data table" value={raw} onChange={(e) => setRaw(e.target.value)} rows={8} />
          </label>
          <button className="button small" onClick={paste}>
            Apply data
          </button>
          <p className="fine-print">
            Include the header in this CSV or tab-separated table. Apply to update the chart. Spreadsheet
            import lets you choose columns and number formats.
          </p>
          {kind === 'histogram' && (
            <>
              <label className="field">
                Number of bins
                <input
                  aria-label="Number of bins"
                  type="number"
                  min="1"
                  max="50"
                  value={spec.bins}
                  onChange={(e) => change({ bins: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                Bin start (blank uses minimum)
                <input
                  aria-label="Bin start"
                  value={spec.binStart}
                  onChange={(e) => change({ binStart: e.target.value })}
                />
              </label>
              <label className="field">
                Bin width (overrides count)
                <input
                  aria-label="Bin width"
                  value={spec.binWidth}
                  onChange={(e) => change({ binWidth: e.target.value })}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={spec.relative}
                  onChange={(e) => change({ relative: e.target.checked })}
                />{' '}
                Show relative frequency (%)
              </label>
            </>
          )}
          {kind === 'box' && (
            <>
              <label className="field">
                Quartile method
                <select
                  aria-label="Quartile method"
                  value={spec.quartiles}
                  onChange={(e) => change({ quartiles: e.target.value as StatSpec['quartiles'] })}
                >
                  <option value="linear">Linear interpolation (R type 7)</option>
                  <option value="halves">Median of halves (exclude middle)</option>
                </select>
              </label>
              <label className="field">
                Whisker rule
                <select
                  aria-label="Whisker rule"
                  value={spec.whiskers}
                  onChange={(e) => change({ whiskers: e.target.value as StatSpec['whiskers'] })}
                >
                  <option value="iqr">Last observations within 1.5 × IQR</option>
                  <option value="range">Minimum to maximum</option>
                </select>
              </label>
            </>
          )}
          {kind === 'scatter' && (
            <label>
              <input
                type="checkbox"
                checked={spec.regression}
                onChange={(e) => change({ regression: e.target.checked })}
              />{' '}
              Show least-squares line
            </label>
          )}
          {kind === 'bar' && (
            <>
              <label className="field">
                Bar arrangement
                <select
                  aria-label="Bar arrangement"
                  value={spec.barMode}
                  onChange={(e) => change({ barMode: e.target.value as StatSpec['barMode'] })}
                >
                  <option value="grouped">Grouped</option>
                  <option value="stacked">Stacked values</option>
                  <option value="percent">100% stacked</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={spec.horizontal}
                  onChange={(e) => change({ horizontal: e.target.checked })}
                />{' '}
                Horizontal bars
              </label>
            </>
          )}
          <details>
            <summary>Title, labels and style</summary>
            <label className="field">
              Chart title
              <input
                aria-label="Chart title"
                value={spec.title}
                maxLength={60}
                onChange={(e) => change({ title: e.target.value })}
              />
            </label>
            <label className="field">
              X axis label
              <input
                value={spec.xLabel}
                maxLength={60}
                onChange={(e) => change({ xLabel: e.target.value })}
              />
            </label>
            <label className="field">
              Y axis label
              <input
                value={spec.yLabel}
                maxLength={60}
                onChange={(e) => change({ yLabel: e.target.value })}
              />
            </label>
            <StylePicker value={spec} onChange={change} />
          </details>
        </aside>
        <div className="stat-preview">
          <div
            className="stat-canvas"
            style={{
              aspectRatio: `${chartFrames[spec.frame].width}/${chartFrames[spec.frame].height}`,
              background: chartThemes[spec.theme].background,
            }}
            role="img"
            aria-label={statDescription(spec)}
            data-stat-ready={ready}
          >
            {!ready && <div className="stat-placeholder" dangerouslySetInnerHTML={{ __html: initialSvg }} />}
            <div className="stat-live" ref={host} style={{ opacity: ready && !error ? 1 : 0 }} />
            {error && (
              <p className="stat-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="stat-download">
            <label>
              Download format
              <select aria-label="Download format" value={format} onChange={(e) => setFormat(e.target.value)}>
                {['png', 'svg', 'pdf', 'csv', 'json'].map((f) => (
                  <option key={f} value={f}>
                    {f === 'json' ? 'ECharts JSON' : f.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <button className="button" onClick={() => void save()} disabled={!!error || busy}>
              {busy ? 'Preparing…' : 'Download'}
            </button>
          </div>
          <p className="stat-status" role="status">
            {message}
          </p>
          <h2>Calculated values</h2>
          <p className="fine-print">
            {kind === 'histogram'
              ? 'Bins include their lower boundary; only the last bin includes its upper boundary.'
              : kind === 'box'
                ? 'Whiskers end on observations. Flagged values remain in the data and appear as points.'
                : kind === 'scatter'
                  ? 'Pearson r measures linear association. A fitted line does not establish causation.'
                  : kind === 'pareto'
                    ? 'Categories are sorted by the supplied measure. The 80% reference is a guide, not a rule the data must follow.'
                    : '100% mode divides each series value by its category total. Other modes preserve the supplied values.'}
          </p>
          {analysis && (
            <div className="table-scroll stat-summary">
              <table>
                <thead>
                  <tr>
                    {analysis.summary[0].map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysis.summary.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((v, c) => (
                        <td key={c}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <details>
            <summary>Inspect every input row ({spec.table.length - 1})</summary>
            <div className="table-scroll stat-summary">
              <table>
                <thead>
                  <tr>
                    {spec.table[0].map((h, i) => (
                      <th key={i} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spec.table.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((v, c) => (
                        <td key={c}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
      {importing && (
        <ImportData
          kind={kind === 'histogram' ? 'numeric' : 'table'}
          onClose={() => setImporting(false)}
          onImport={imported}
        />
      )}
    </div>
  );
}
