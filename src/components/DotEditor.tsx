import { findShowcase } from '../lib/showcase-specs';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, FileSpreadsheet, ChevronDown, Code2 } from 'lucide-react';
import EChartView from './EChartView';
import ImportData from './ImportData';
import { DataEntry, JourneyHeading, PreviewHeading, DownloadStep } from './ChartJourney';
import { ExportButton, StylePicker, usePresentation } from './ChartControls';
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
import { chartThemes, type DotSpec } from '../lib/chart-options';
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
  const [editing, setEditing] = useState(false);
  const [initialFile, setInitialFile] = useState<File | undefined>();
  const previewRef = useRef<HTMLDivElement>(null);
  const [mean, setMean] = useState(true);
  const [counts, setCounts] = useState(false);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState('');
  let values: number[] = [],
    error = '';
  try {
    const rows = parseText(raw);
    if (rows.some((row) => row.length > 1)) error = 'Use Paste data to choose a value column from a table.';
    else if (rows.length > 300)
      error = 'Use up to 300 values so individual dots remain useful. No values have been removed.';
    else {
      const parsed = rows.map((row) => readNumber(row[0]));
      const invalid = parsed.findIndex((v) => v === null);
      if (invalid >= 0)
        error = `Value ${invalid + 1} (“${rows[invalid][0] || 'empty'}”) is not a number. Edit it or use Paste data for other number formats.`;
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
  function selectPreset(id: string, track = true) {
    const p = dotExample(id);
    setActive(id);
    setRaw(p.values.join('\n'));
    setTitle(p.title);
    setLabel(p.label);
    setPresentation((v) => ({ ...v, subtitle: p.subtitle, source: p.source }));
    setNotice('Example loaded. Replace it with your data whenever you’re ready.');
    if (track) emitUsage('dot-plot', 'sample');
  }
  function customData(text: string) {
    setRaw(text);
    setActive('custom');
    if (active !== 'custom') {
      const sample = findShowcase(active, 'dot') ?? dotExample(active);
      if (title === sample.title) setTitle('Your dot plot');
      if (sample.kind === 'dot' && label === sample.label) setLabel('Value');
    }
    if (active !== 'custom')
      setPresentation((v) => ({
        ...v,
        source: v.source === (findShowcase(active, 'dot') ?? dotExample(active)).source ? '' : v.source,
        subtitle: '',
      }));
    setNotice('');
  }
  function importValues(table: Table, style: NumberStyle, columnLabel?: string) {
    customData(table.map((row) => String(readNumber(row[0], style))).join('\n'));
    if (columnLabel) setLabel(columnLabel.slice(0, 60));
    setEditing(false);
    setTab('data');
    setNotice(
      `Your chart is ready: ${table.length} values added. You can change its labels or download it below.`,
    );
    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      previewRef.current?.focus({ preventScroll: true });
    });
    emitUsage('dot-plot', 'render');
  }
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const p = findShowcase(query.get('showcase'), 'dot');
    if (p?.kind === 'dot') {
      setRaw(p.values.join('\n'));
      setTitle(p.title);
      setLabel(p.label);
      setMean(p.meanLine);
      setCounts(p.showCounts);
      setPresentation({ theme: p.theme, frame: p.frame, subtitle: p.subtitle, source: p.source });
      setActive(query.get('showcase')!);
      setNotice('Worked example loaded. All data is fictional.');
      return;
    }
    const id = query.get('example');
    if (dotPresets.some((p) => p.id === id)) selectPreset(id!, false);
  }, []);
  return (
    <div id="editor" className="tool-workspace dot-journey">
      <JourneyHeading kind="dot" />
      <div className="workspace-body">
        <aside className="editor-sidebar dot-input-panel">
          <DataEntry
            kind="dot"
            active={active}
            examples={dotPresets}
            onExample={selectPreset}
            editing={editing}
            design={tab === 'design'}
            onUpload={(file) => {
              setInitialFile(file);
              setImporting(true);
            }}
            onPaste={() => {
              setInitialFile(undefined);
              setImporting(true);
            }}
            onEdit={() => {
              setEditing(tab === 'design' ? true : !editing);
              setTab('data');
            }}
            onDesign={() => setTab(tab === 'design' ? 'data' : 'design')}
          />
          {editing && tab === 'data' && (
            <div className="dot-values">
              <label className="field">
                Values
                <textarea
                  aria-label="Values"
                  aria-describedby="dot-data-hint"
                  value={raw}
                  onChange={(e) => customData(e.target.value)}
                  rows={5}
                  spellCheck={false}
                />
              </label>
              <p id="dot-data-hint" className="fine-print">
                One value per line or a comma-separated list. Up to 300 values. Each number becomes one dot.
              </p>
            </div>
          )}
          {tab === 'design' && (
            <div className="dot-design">
              <label className="field">
                Chart title
                <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="field">
                Axis label
                <input value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} />
              </label>
              <StylePicker value={presentation} onChange={setPresentation} />
              <label className="check-label">
                <input type="checkbox" checked={mean} onChange={(e) => setMean(e.target.checked)} />
                Show the mean reference line
              </label>
              <label className="check-label">
                <input type="checkbox" checked={counts} onChange={(e) => setCounts(e.target.checked)} />
                Label repeated-value counts
              </label>
            </div>
          )}
        </aside>
        <div className="canvas-panel" ref={previewRef} tabIndex={-1} aria-label="Your dot plot preview">
          <PreviewHeading
            kind="dot"
            origin={active === 'custom' ? 'custom' : 'sample'}
            notice={notice}
            theme={chartThemes[presentation.theme].name}
          />
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
          <DownloadStep>
            <ExportButton spec={spec} disabled={!stats || !!error} />
          </DownloadStep>
          <div className="stats-strip">
            {[
              { name: 'Observations', value: stats?.count },
              { name: 'Mean', value: stats?.mean },
              { name: 'Median', value: stats?.median },
              {
                name: 'Range',
                value: stats ? stats.max - stats.min : undefined,
              },
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
              onClick={() => {
                download(
                  csv([['Value'], ...values.map((v) => [String(v)])]),
                  'text/csv;charset=utf-8',
                  'dot-plot-data.csv',
                );
                emitUsage('dot', 'export', 'csv');
              }}
            >
              <ArrowDownToLine size={13} /> Data CSV
            </button>
            <button className="text-button" disabled={!stats} onClick={() => exportChartConfig(spec)}>
              <Code2 size={14} /> ECharts config
            </button>
          </div>
        </div>
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
      {importing && (
        <ImportData
          kind="dot"
          initialFile={initialFile}
          onClose={() => {
            setImporting(false);
            setInitialFile(undefined);
          }}
          onImport={importValues}
        />
      )}
    </div>
  );
}
