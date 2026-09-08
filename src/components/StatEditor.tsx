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
import { DataEntry, JourneyHeading, PreviewHeading, DownloadStep, useChartJourney } from './ChartJourney';
import { chartInputs } from '../lib/chart-journey';
export default function StatEditor({ kind, initialSvg }: { kind: StatKind; initialSvg: string }) {
  const initial = defaultStat(kind);
  const [spec, setSpec] = useState<StatSpec>(initial),
    [raw, setRaw] = useState(csv(initial.table)),
    [message, setMessage] = useState(''),
    [active, setActive] = useState(statPresetIds.find((id) => statPresets[id].kind === kind) ?? ''),
    [editing, setEditing] = useState(false),
    [design, setDesign] = useState(false),
    [format, setFormat] = useState('png'),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false);
  const journey = useChartJourney();
  const sampleRef = useRef(initial);
  const dirty = raw !== csv(spec.table);
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
      sampleRef.current = p;
      setActive(q.get('example')!);
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
              sampleRef.current = next;
              setActive('dataset');
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
    if (!table[0]?.length)
      throw Error('Add a header and at least one data row, or use Upload a file / Paste data.');
    const next = {
      ...spec,
      ...(kind === 'histogram' ? { binStart: '', binWidth: '' } : {}),
      table,
      title: spec.title === sampleRef.current.title ? `Your ${chartInputs[kind].name}` : spec.title,
      xLabel: spec.xLabel === sampleRef.current.xLabel ? table[0][0].slice(0, 60) : spec.xLabel,
      yLabel:
        spec.yLabel === sampleRef.current.yLabel
          ? kind === 'histogram'
            ? 'Frequency'
            : table[0].length === 2
              ? table[0][1].slice(0, 60)
              : 'Value'
          : spec.yLabel,
      subtitle: '',
      source:
        spec.source === sampleRef.current.source &&
        (spec.source.startsWith('Source: fictional') || spec.source.startsWith('Source: UCI'))
          ? ''
          : spec.source,
    };
    analyzeStat(next);
    setActive('custom');
    setSpec(next);
    setRaw(csv(table));
    setMessage(
      'Your chart is ready. Every selected row is included.' +
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
  function imported(table: Table, style: NumberStyle, columnLabel?: string) {
    const t =
      kind === 'histogram'
        ? [[columnLabel || 'Value'], ...table.map((row) => [String(readNumber(row[0], style))])]
        : table.map((row, r) =>
            row.map((v, c) => (r && (c > 0 || kind === 'scatter') ? String(readNumber(v, style)) : v)),
          );
    applyTable(t);
    setEditing(false);
    setDesign(false);
    journey.focusPreview();
  }
  function preset(id: string) {
    const p = findStatPreset(id, kind);
    if (!p) return;
    sampleRef.current = p;
    setActive(id);
    setSpec(p);
    setRaw(csv(p.table));
    setMessage('Worked example loaded. All data is fictional.');
    emitUsage(kind, 'sample');
  }
  async function save() {
    if (error || dirty) return;
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
    <div className="stat-editor tool-workspace dot-journey" id="editor">
      <JourneyHeading kind={kind} />
      <div className="workspace-body">
        <aside className="editor-sidebar dot-input-panel stat-controls">
          <DataEntry
            kind={kind}
            active={active}
            examples={statPresetIds
              .filter((id) => statPresets[id].kind === kind)
              .map((id) => ({ id, name: statPresets[id].title }))}
            onExample={preset}
            editing={editing}
            design={design}
            onUpload={journey.upload}
            onPaste={journey.paste}
            onEdit={() => {
              setEditing(design ? true : !editing);
              setDesign(false);
            }}
            onDesign={() => setDesign(!design)}
          />
          {editing && !design && (
            <div className="dot-values">
              <label className="field">
                Data table
                <textarea
                  aria-label="Data table"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  rows={8}
                />
              </label>
              <button className="button small" onClick={paste}>
                Apply data
              </button>
              <p className="fine-print">
                Include the header in this CSV or tab-separated table. Apply to update the chart. Spreadsheet
                import lets you choose columns and number formats.
              </p>
            </div>
          )}
          {design && (
            <div className="dot-design">
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
              <div className="journey-labels">
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
              </div>
            </div>
          )}
        </aside>
        <div
          className="stat-preview canvas-panel"
          ref={journey.previewRef}
          tabIndex={-1}
          aria-label={`Your ${chartInputs[kind].name} preview`}
        >
          <PreviewHeading
            kind={kind}
            origin={active === 'custom' ? 'custom' : active === 'dataset' ? 'dataset' : 'sample'}
            notice={
              dirty ? 'You have unapplied edits. Apply the data or fix it before downloading.' : message
            }
            theme={chartThemes[spec.theme].name}
          />
          <div className="chart-stage">
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
              {!ready && (
                <div className="stat-placeholder" dangerouslySetInnerHTML={{ __html: initialSvg }} />
              )}
              <div className="stat-live" ref={host} style={{ opacity: ready && !error ? 1 : 0 }} />
              {error && (
                <p className="stat-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
          <DownloadStep>
            <div className="stat-download">
              <label>
                Download format
                <select
                  aria-label="Download format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  {['png', 'svg', 'pdf', 'csv', 'json'].map((f) => (
                    <option key={f} value={f}>
                      {f === 'json' ? 'ECharts JSON' : f.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button" onClick={() => void save()} disabled={!!error || dirty || busy}>
                {busy ? 'Preparing…' : 'Download'}
              </button>
            </div>
          </DownloadStep>
          <div className="journey-results">
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
      </div>
      {journey.importing && (
        <ImportData
          kind={kind}
          initialFile={journey.initialFile}
          onClose={journey.close}
          onImport={imported}
        />
      )}
    </div>
  );
}
