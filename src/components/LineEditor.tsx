import { findShowcase } from '../lib/showcase-specs';
import { useEffect, useState } from 'react';
import { Upload, RotateCcw, Plus, X, FileSpreadsheet, ArrowDownToLine, Code2 } from 'lucide-react';
import EChartView from './EChartView';
import ImportData from './ImportData';
import {
  ExportButton,
  StylePicker,
  WorkspaceHeader,
  SidebarTabs,
  usePresentation,
  PreviewStatus,
} from './ChartControls';
import { linePresets } from '../lib/presets';
import { lineExample } from '../lib/chart-presets';
import { validateLineTable } from '../lib/line-data';
import { csv, readNumber, type Table, type NumberStyle } from '../lib/data';
import { download, emitUsage } from '../lib/export';
import { exportChartConfig } from '../lib/chart-export';
import type { LineSpec } from '../lib/chart-options';

const asTable = (p: LineSpec): Table => [
  [p.xLabel, ...p.series],
  ...p.labels.map((label, i) => [label, ...p.values[i].map(String)]),
];
export default function LineEditor({ initialSvg }: { initialSvg?: string }) {
  const initial = lineExample();
  const [active, setActive] = useState('monthly');
  const [table, setTable] = useState<Table>(asTable(initial));
  const [title, setTitle] = useState(initial.title);
  const [xLabel, setXLabel] = useState(initial.xLabel);
  const [yLabel, setYLabel] = useState(initial.yLabel);
  const [xMode, setXMode] = useState<LineSpec['xMode']>(initial.xMode);
  const [zeroBaseline, setZero] = useState(true);
  const [markers, setMarkers] = useState(true);
  const [presentation, setPresentation] = usePresentation(initial);
  const [tab, setTab] = useState<'data' | 'design'>('data');
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState('');
  const checked = validateLineTable(table, xMode);
  const { error, labels, series, values } = checked;
  const spec: LineSpec = {
    ...presentation,
    kind: 'line',
    labels,
    series,
    values,
    title,
    xLabel,
    yLabel,
    xMode,
    zeroBaseline,
    markers,
  };
  function markCustom() {
    setActive('custom');
    if (active !== 'custom')
      setPresentation((v) => ({
        ...v,
        subtitle: '',
        source: v.source.startsWith('Source: fictional example data.') ? '' : v.source,
      }));
  }
  function edit(r: number, c: number, value: string) {
    setTable((t) => t.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? value : cell)) : row)));
    markCustom();
  }
  function preset(id: string, track = true) {
    const p = lineExample(id);
    setTable(asTable(p));
    setTitle(p.title);
    setXLabel(p.xLabel);
    setYLabel(p.yLabel);
    setXMode(p.xMode);
    setPresentation((v) => ({ ...v, subtitle: p.subtitle, source: p.source }));
    setActive(id);
    setNotice('');
    if (track) emitUsage('line', 'sample');
  }
  function imported(t: Table, style: NumberStyle) {
    setTable(t.map((row, r) => row.map((v, c) => (r && c ? String(readNumber(v, style)) : v))));
    setXLabel(t[0][0]);
    setYLabel('Value');
    setXMode('category');
    markCustom();
    setNotice(
      'Imported in the supplied order. Labels are equally spaced; choose numeric or date spacing when distances matter.',
    );
    emitUsage('line', 'render');
  }
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const p = findShowcase(query.get('showcase'), 'line');
    if (p?.kind === 'line') {
      setTable(asTable(p));
      setTitle(p.title);
      setXLabel(p.xLabel);
      setYLabel(p.yLabel);
      setXMode(p.xMode);
      setZero(p.zeroBaseline);
      setMarkers(p.markers);
      setPresentation({ theme: p.theme, frame: p.frame, subtitle: p.subtitle, source: p.source });
      setActive(query.get('showcase')!);
      setNotice('Worked example loaded. All data is fictional.');
      return;
    }
    const id = query.get('example');
    if (linePresets.some((p) => p.id === id)) preset(id!, false);
  }, []);
  return (
    <div id="editor" className="tool-workspace">
      <WorkspaceHeader kind="Line graph" />
      <div className="workspace-body radar-workspace line-workspace">
        <aside className="editor-sidebar">
          <SidebarTabs tab={tab} setTab={setTab} />
          {tab === 'data' ? (
            <div className="sidebar-tab-content">
              <div className="panel-title">
                <h2>Your series</h2>
                <button className="text-button" onClick={() => preset('monthly')}>
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
              <button className="button secondary import-button" onClick={() => setImporting(true)}>
                <Upload size={15} /> Paste or import a spreadsheet
              </button>
              <label className="field">
                Horizontal spacing
                <select value={xMode} onChange={(e) => setXMode(e.target.value as LineSpec['xMode'])}>
                  <option value="category">Equal spacing — labels in row order</option>
                  <option value="number">Numeric distance</option>
                  <option value="time">Elapsed days — YYYY-MM-DD dates</option>
                </select>
              </label>
              <p className="fine-print">
                Use comparable units for all series. Numeric positions and dates must increase; rows are never
                sorted automatically.
              </p>
              <div className="table-scroll editable-data line-data-table">
                <table>
                  <caption className="sr-only">Edit line graph labels and values</caption>
                  <thead>
                    <tr>
                      <th scope="col">Point</th>
                      {table[0].slice(1).map((name, s) => (
                        <th key={s} scope="col">
                          <input
                            aria-label={`Series ${s + 1} name`}
                            value={name}
                            maxLength={22}
                            onChange={(e) => edit(0, s + 1, e.target.value)}
                          />
                          {series.length > 1 && (
                            <button
                              className="remove-series"
                              aria-label={`Remove series ${name}`}
                              onClick={() => {
                                setTable((t) => t.map((row) => row.filter((_, c) => c !== s + 1)));
                                markCustom();
                              }}
                            >
                              <X size={11} />
                            </button>
                          )}
                        </th>
                      ))}
                      <th>
                        <span className="sr-only">Remove</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(1).map((row, r) => (
                      <tr key={r}>
                        {row.map((value, c) => (
                          <td key={c}>
                            <input
                              aria-label={c === 0 ? `Point ${r + 1} label` : `${table[0][c]}, point ${r + 1}`}
                              value={value}
                              type={c ? 'number' : 'text'}
                              step="any"
                              maxLength={c ? undefined : 40}
                              onChange={(e) => edit(r + 1, c, e.target.value)}
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            className="icon-button tiny"
                            aria-label={`Remove point ${r + 1}`}
                            disabled={labels.length <= 2}
                            onClick={() => {
                              setTable((t) => t.filter((_, i) => i !== r + 1));
                              markCustom();
                            }}
                          >
                            <X size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="data-add">
                <button
                  className="text-button"
                  disabled={labels.length >= 300}
                  onClick={() => {
                    setTable((t) => [
                      ...t,
                      [xMode === 'category' ? `Point ${labels.length + 1}` : '', ...series.map(() => '')],
                    ]);
                    markCustom();
                  }}
                >
                  <Plus size={13} /> Point
                </button>
                <button
                  className="text-button"
                  disabled={series.length >= 5}
                  onClick={() => {
                    let i = 1;
                    while (series.includes(`Series ${i}`)) i++;
                    setTable((t) => t.map((row, r) => [...row, r ? '' : `Series ${i}`]));
                    markCustom();
                  }}
                >
                  <Plus size={13} /> Series
                </button>
              </div>
            </div>
          ) : (
            <div className="sidebar-tab-content">
              <label className="field">
                Chart title
                <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="field">
                Horizontal axis label
                <input value={xLabel} maxLength={40} onChange={(e) => setXLabel(e.target.value)} />
              </label>
              <label className="field">
                Vertical axis label and unit
                <input value={yLabel} maxLength={40} onChange={(e) => setYLabel(e.target.value)} />
              </label>
              <StylePicker value={presentation} onChange={setPresentation} />
              <label className="check-label">
                <input type="checkbox" checked={zeroBaseline} onChange={(e) => setZero(e.target.checked)} />{' '}
                Include zero on the vertical axis
              </label>
              <label className="check-label">
                <input type="checkbox" checked={markers} onChange={(e) => setMarkers(e.target.checked)} />{' '}
                Show a marker at each observation
              </label>
            </div>
          )}
        </aside>
        <div className="canvas-panel">
          <div className="canvas-toolbar">
            <PreviewStatus presentation={presentation} />
            <ExportButton spec={spec} disabled={!!error} />
          </div>
          <div className="chart-stage">
            {error ? (
              <div className="chart-error" role="alert">
                <FileSpreadsheet size={30} />
                <h3>Let’s check the data.</h3>
                <p>{error}</p>
              </div>
            ) : (
              <EChartView spec={spec} initialSvg={initialSvg} />
            )}
          </div>
          <div className="radar-note">
            <span className="note-dot" />
            <p>
              {xMode === 'category'
                ? 'Equal spacing: labels follow your row order. Use numeric or date spacing for irregular intervals.'
                : xMode === 'number'
                  ? 'Horizontal distances reflect your numeric positions.'
                  : 'Horizontal distances reflect elapsed days, using UTC dates.'}{' '}
              {!zeroBaseline && 'The vertical scale is fitted to your values and may not include zero.'}
            </p>
          </div>
          <div className="canvas-bottom">
            <span>Straight lines. Original values. Hover to inspect.</span>
            <button
              className="text-button"
              onClick={() => {
                download(
                  csv([[xLabel, ...table[0].slice(1)], ...table.slice(1)]),
                  'text/csv;charset=utf-8',
                  'line-graph-data.csv',
                );
                emitUsage('line', 'export', 'csv');
              }}
            >
              <ArrowDownToLine size={13} /> Data CSV
            </button>
            <button className="text-button" disabled={!!error} onClick={() => exportChartConfig(spec)}>
              <Code2 size={14} /> ECharts config
            </button>
          </div>
        </div>
      </div>
      <div className="preset-bar">
        <span>Load an example</span>
        {linePresets.map((p) => (
          <button
            key={p.id}
            className={`preset ${active === p.id ? 'active' : ''}`}
            onClick={() => preset(p.id)}
          >
            {p.name}
          </button>
        ))}
        <span className="sample-label">Fictional data · editable by you</span>
      </div>
      <p className="import-notice" role="status">
        {notice}
      </p>
      {importing && <ImportData kind="line" onClose={() => setImporting(false)} onImport={imported} />}
    </div>
  );
}
