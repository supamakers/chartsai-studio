import { useEffect, useState } from 'react';
import { ArrowDownToLine, Upload, RotateCcw, FileSpreadsheet, ChevronDown, Code2 } from 'lucide-react';
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
import { dotPresets } from '../lib/presets';
import {
  csv,
  parseText,
  readNumber,
  summarize,
  formatNumber,
  type Table,
  type NumberStyle,
} from '../lib/data';
import { download, emitUsage } from '../lib/export';
import type { DotSpec } from '../lib/chart-options';
import { dotExample } from '../lib/chart-presets';
import { exportChartConfig } from '../lib/chart-export';

export default function DotEditor({ initialSvg }: { initialSvg?: string }) {
  const initial = dotExample();
  const [active, setActive] = useState('scores');
  const [raw, setRaw] = useState(initial.values.join('\n'));
  const [title, setTitle] = useState(initial.title);
  const [label, setLabel] = useState(initial.label);
  const [presentation, setPresentation] = usePresentation(initial);
  const [tab, setTab] = useState<'data' | 'design'>('data');
  const [mean, setMean] = useState(true);
  const [counts, setCounts] = useState(false);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState('');
  let values: number[] = [],
    error = '';
  try {
    const rows = parseText(raw);
    if (rows.some((row) => row.length > 1)) error = 'Use Import data to choose a value column from a table.';
    else if (rows.length > 300)
      error = 'Use up to 300 values so individual dots remain useful. No values have been removed.';
    else {
      const parsed = rows.map((row) => readNumber(row[0]));
      const invalid = parsed.findIndex((v) => v === null);
      if (invalid >= 0)
        error = `Value ${invalid + 1} (“${rows[invalid][0] || 'empty'}”) is not a number. Edit it or use Import data for other number formats.`;
      else values = parsed as number[];
    }
  } catch (e) {
    error = (e as Error).message;
  }
  const stats = summarize(values);
  const spec: DotSpec = {
    ...presentation,
    kind: 'dot',
    values,
    title,
    label,
    meanLine: mean,
    showCounts: counts,
  };
  function selectPreset(id: string) {
    const p = dotExample(id);
    setActive(id);
    setRaw(p.values.join('\n'));
    setTitle(p.title);
    setLabel(p.label);
    setPresentation((v) => ({ ...v, subtitle: p.subtitle, source: p.source }));
    setNotice('Example loaded. The sample data is fictional.');
    emitUsage('dot-plot', 'sample');
  }
  function customData(text: string) {
    setRaw(text);
    setActive('custom');
    if (active !== 'custom')
      setPresentation((v) => ({
        ...v,
        source: v.source.startsWith('Source: fictional example data.') ? '' : v.source,
        subtitle: '',
      }));
    setNotice('');
  }
  function importValues(table: Table, style: NumberStyle) {
    customData(table.map((row) => String(readNumber(row[0], style))).join('\n'));
    setNotice(`Imported ${table.length} values. All selected observations are included.`);
    emitUsage('dot-plot', 'render');
  }
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('example');
    if (dotPresets.some((p) => p.id === id)) selectPreset(id!);
  }, []);
  return (
    <div id="editor" className="tool-workspace">
      <WorkspaceHeader kind="Dot plot" />
      <div className="workspace-body">
        <aside className="editor-sidebar">
          <SidebarTabs tab={tab} setTab={setTab} />
          {tab === 'data' ? (
            <div className="sidebar-tab-content">
              <div className="panel-title">
                <h2>Your observations</h2>
                <button className="text-button" onClick={() => selectPreset('scores')}>
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
              <button className="button secondary import-button" onClick={() => setImporting(true)}>
                <Upload size={15} /> Paste or import a spreadsheet
              </button>
              <label className="field">
                Values
                <textarea
                  aria-label="Values"
                  aria-describedby="dot-data-hint"
                  value={raw}
                  onChange={(e) => customData(e.target.value)}
                  rows={8}
                  spellCheck={false}
                />
              </label>
              <p id="dot-data-hint" className="fine-print">
                One value per line, or a comma-separated list. Up to 300 observations. Zero is a value; an
                empty cell needs attention.
              </p>
              <label className="field">
                Axis label
                <input value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} />
              </label>
              <div className="sidebar-tip">
                <span>START ANYWHERE</span>
                <p>
                  Have a messy table? Import lets you select the sheet, rows, columns and number format before
                  plotting.
                </p>
              </div>
            </div>
          ) : (
            <div className="sidebar-tab-content">
              <label className="field">
                Chart title
                <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <StylePicker value={presentation} onChange={setPresentation} />
              <label className="check-label">
                <input type="checkbox" checked={mean} onChange={(e) => setMean(e.target.checked)} /> Show the
                mean reference line
              </label>
              <label className="check-label">
                <input type="checkbox" checked={counts} onChange={(e) => setCounts(e.target.checked)} /> Label
                repeated-value counts
              </label>
            </div>
          )}
        </aside>
        <div className="canvas-panel">
          <div className="canvas-toolbar">
            <PreviewStatus presentation={presentation} />
            <ExportButton spec={spec} disabled={!stats || !!error} />
          </div>
          <div className="chart-stage">
            {error || !stats ? (
              <div className="chart-error" role="alert">
                <FileSpreadsheet size={30} />
                <h3>{error ? 'A data check first.' : 'Your chart starts here.'}</h3>
                <p>{error || 'Enter a few numbers or load an example.'}</p>
              </div>
            ) : (
              <EChartView spec={spec} initialSvg={initialSvg} />
            )}
          </div>
          <div className="stats-strip">
            {[
              { name: 'Observations', value: stats?.count },
              { name: 'Mean', value: stats?.mean },
              { name: 'Median', value: stats?.median },
              { name: 'Range', value: stats ? stats.max - stats.min : undefined },
            ].map((s) => (
              <div key={s.name}>
                <span>{s.name}</span>
                <strong>{s.value === undefined ? '—' : formatNumber(s.value)}</strong>
              </div>
            ))}
          </div>
          <div className="canvas-bottom">
            <span>Hover a dot to inspect its value.</span>
            <button
              className="text-button"
              disabled={!stats}
              onClick={() =>
                download(
                  csv([['Value'], ...values.map((v) => [String(v)])]),
                  'text/csv;charset=utf-8',
                  'dot-plot-data.csv',
                )
              }
            >
              <ArrowDownToLine size={13} /> Data CSV
            </button>
            <button className="text-button" disabled={!stats} onClick={() => exportChartConfig(spec)}>
              <Code2 size={14} /> ECharts config
            </button>
          </div>
        </div>
      </div>
      <div className="preset-bar">
        <span>Load an example</span>
        {dotPresets.map((p) => (
          <button
            key={p.id}
            className={`preset ${active === p.id ? 'active' : ''}`}
            onClick={() => selectPreset(p.id)}
          >
            {p.name}
          </button>
        ))}
        <span className="sample-label">Fictional data · editable by you</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>
      {stats && (
        <details className="data-details">
          <summary>
            Inspect the frequency table <ChevronDown size={16} />
          </summary>
          <div className="table-scroll">
            <table>
              <caption>Exact values used in your dot plot</caption>
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Frequency</th>
                  <th>Share of observations</th>
                </tr>
              </thead>
              <tbody>
                {stats.frequencies.map((f) => (
                  <tr key={f.value}>
                    <td>{formatNumber(f.value)}</td>
                    <td>{f.count}</td>
                    <td>{formatNumber((f.count / stats.count) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
      {importing && <ImportData kind="dot" onClose={() => setImporting(false)} onImport={importValues} />}
    </div>
  );
}
