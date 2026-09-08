import { findShowcase } from '../lib/showcase-specs';
import { useEffect, useState } from 'react';
import { ArrowDownToLine, Plus, X, FileSpreadsheet, Code2 } from 'lucide-react';
import EChartView from './EChartView';
import ImportData from './ImportData';
import { DataEntry, JourneyHeading, PreviewHeading, DownloadStep, useChartJourney } from './ChartJourney';
import type { ImportSettings } from '../lib/chart-journey';
import { ExportButton, StylePicker, usePresentation } from './ChartControls';
import { radarPresets } from '../lib/presets';
import { csv, readNumber, type Table, type NumberStyle } from '../lib/data';
import { download, emitUsage } from '../lib/export';
import { chartThemes, type RadarSpec } from '../lib/chart-options';
import { radarExample } from '../lib/chart-presets';
import { exportChartConfig } from '../lib/chart-export';

export default function RadarEditor({ initialSvg }: { initialSvg?: string }) {
  const p = radarExample();
  const [active, setActive] = useState('skills');
  const [title, setTitle] = useState(p.title);
  const [max, setMax] = useState(String(p.max));
  const [table, setTable] = useState<Table>([
    ['Dimension', ...p.series],
    ...p.axes.map((axis, i) => [axis, ...p.scores[i].map(String)]),
  ]);
  const [presentation, setPresentation] = usePresentation(p);
  const [tab, setTab] = useState<'data' | 'design'>('data');
  const [filled, setFilled] = useState(true);
  const [round, setRound] = useState(false);
  const journey = useChartJourney();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const axes = table.slice(1).map((row) => row[0]);
  const series = table[0].slice(1);
  const scores = table.slice(1).map((row) => row.slice(1).map((v) => readNumber(v)));
  const maxNumber = Number(max);
  let error = '';
  if (!max.trim() || !Number.isFinite(maxNumber) || maxNumber <= 0 || maxNumber > 1e6)
    error = 'Choose a scale maximum greater than zero and no larger than 1,000,000.';
  else if (axes.some((a) => !a.trim()) || series.some((s) => !s.trim()))
    error = 'Give each dimension and series a name.';
  else if (axes.some((a) => a.length > 30) || series.some((s) => s.length > 22))
    error =
      'Use dimension names up to 30 characters and series names up to 22 characters so labels remain readable.';
  else if (new Set(series.map((s) => s.trim())).size !== series.length)
    error = 'Give each series a different name so the legend is unambiguous.';
  else if (scores.some((row) => row.some((n) => n === null)))
    error = 'Every selected score needs a number. Empty scores are not treated as zero.';
  else if (scores.some((row) => row.some((n) => n! < 0 || n! > maxNumber)))
    error = `Scores must be between 0 and ${maxNumber}. Adjust the scale or check your values.`;
  const spec: RadarSpec = {
    ...presentation,
    kind: 'radar',
    axes,
    series,
    scores: scores as number[][],
    max: maxNumber,
    title,
    filled,
    round,
  };
  function markCustom() {
    if (active !== 'custom') {
      const sample = findShowcase(active, 'radar') ?? radarExample(active);
      if (title === sample.title) setTitle('Your radar chart');
    }
    setActive('custom');
    if (active !== 'custom')
      setPresentation((v) => ({
        ...v,
        source: v.source === (findShowcase(active, 'radar') ?? radarExample(active)).source ? '' : v.source,
        subtitle: '',
      }));
  }
  function edit(row: number, col: number, value: string) {
    setTable((t) => t.map((r, i) => (i === row ? r.map((c, j) => (j === col ? value : c)) : r)));
    markCustom();
  }
  function preset(id: string, track = true) {
    const example = radarExample(id);
    setTitle(example.title);
    setMax(String(example.max));
    setTable([
      ['Dimension', ...example.series],
      ...example.axes.map((axis, i) => [axis, ...example.scores[i].map(String)]),
    ]);
    setPresentation((v) => ({
      ...v,
      subtitle: example.subtitle,
      source: example.source,
    }));
    setActive(id);
    setNotice('Example loaded. The sample data is fictional.');
    if (track) emitUsage('radar-chart', 'sample');
  }
  function imported(t: Table, style: NumberStyle, _label?: string, settings?: ImportSettings) {
    if (
      t.slice(1).some((r) => !r[0].trim() || r[0].length > 30) ||
      t[0].slice(1).some((n) => !n.trim() || n.length > 22) ||
      new Set(t[0].slice(1)).size !== t[0].length - 1
    )
      throw Error('Use dimension names up to 30 characters and distinct series names up to 22 characters.');
    setTable(t.map((row, r) => row.map((v, c) => (r && c ? String(readNumber(v, style)) : v))));
    setMax(String(settings?.radarMax ?? maxNumber));
    markCustom();
    setNotice(
      `Your chart is ready: ${t.length - 1} dimensions added. Scores use the declared 0–${settings?.radarMax ?? maxNumber} scale.`,
    );
    setEditing(false);
    setTab('data');
    journey.focusPreview();
    emitUsage('radar-chart', 'render');
  }
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const p = findShowcase(query.get('showcase'), 'radar');
    if (p?.kind === 'radar') {
      setTable([['Dimension', ...p.series], ...p.axes.map((a, i) => [a, ...p.scores[i].map(String)])]);
      setTitle(p.title);
      setMax(String(p.max));
      setFilled(p.filled);
      setRound(p.round);
      setPresentation({ theme: p.theme, frame: p.frame, subtitle: p.subtitle, source: p.source });
      setActive(query.get('showcase')!);
      setNotice('Worked example loaded. All data is fictional.');
      return;
    }
    const id = query.get('example');
    if (radarPresets.some((p) => p.id === id)) preset(id!, false);
  }, []);
  return (
    <div id="editor" className="tool-workspace dot-journey">
      <JourneyHeading kind="radar" />
      <div className="workspace-body">
        <aside className="editor-sidebar dot-input-panel">
          <DataEntry
            kind="radar"
            active={active}
            examples={radarPresets}
            onExample={preset}
            editing={editing}
            design={tab === 'design'}
            onUpload={journey.upload}
            onPaste={journey.paste}
            onEdit={() => {
              setEditing(tab === 'design' ? true : !editing);
              setTab('data');
            }}
            onDesign={() => setTab(tab === 'design' ? 'data' : 'design')}
          />
          <div className="journey-chart-settings">
            <label className="field">
              Shared scale: 0 to
              <input
                type="number"
                min="0.01"
                max="1000000"
                step="any"
                value={max}
                onChange={(e) => {
                  setMax(e.target.value);
                }}
              />
            </label>
            <p className="fine-print">
              Compare like-for-like units. Higher should consistently mean more or better.
            </p>
          </div>
          {editing && tab === 'data' && (
            <div className="dot-values">
              <div className="table-scroll editable-data">
                <table>
                  <caption className="sr-only">Edit radar dimensions and series scores</caption>
                  <thead>
                    <tr>
                      <th scope="col">Dimension</th>
                      {series.map((name, s) => (
                        <th scope="col" key={s}>
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
                              aria-label={c === 0 ? `Dimension ${r + 1}` : `${series[c - 1]}, ${axes[r]}`}
                              type={c ? 'number' : 'text'}
                              step="any"
                              maxLength={c ? undefined : 30}
                              value={value}
                              onChange={(e) => edit(r + 1, c, e.target.value)}
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            className="icon-button tiny"
                            aria-label={`Remove dimension ${axes[r]}`}
                            disabled={axes.length <= 3}
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
                  disabled={axes.length >= 10}
                  onClick={() => {
                    setTable((t) => [...t, [`Dimension ${axes.length + 1}`, ...series.map(() => '0')]]);
                    markCustom();
                  }}
                >
                  <Plus size={13} /> Dimension
                </button>
                <button
                  className="text-button"
                  disabled={series.length >= 5}
                  onClick={() => {
                    setTable((t) =>
                      t.map((row, r) => [...row, r === 0 ? `Series ${series.length + 1}` : '0']),
                    );
                    markCustom();
                  }}
                >
                  <Plus size={13} /> Series
                </button>
              </div>
            </div>
          )}
          {tab === 'design' && (
            <div className="dot-design">
              <label className="field">
                Chart title
                <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <StylePicker value={presentation} onChange={setPresentation} />
              <label className="check-label">
                <input type="checkbox" checked={filled} onChange={(e) => setFilled(e.target.checked)} /> Fill
                the profile shapes
              </label>
              <label className="check-label">
                <input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} /> Use a
                circular grid
              </label>
            </div>
          )}
        </aside>
        <div
          className="canvas-panel"
          ref={journey.previewRef}
          tabIndex={-1}
          aria-label="Your radar chart preview"
        >
          <PreviewHeading
            kind="radar"
            origin={active === 'custom' ? 'custom' : 'sample'}
            notice={notice}
            theme={chartThemes[presentation.theme].name}
          />
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
          <DownloadStep>
            <ExportButton spec={spec} disabled={!!error} />
          </DownloadStep>
          <div className="radar-note">
            <span className="note-dot" />
            <p>
              A shape shows a profile, not an overall score. The order of the axes changes the shape; compare
              values along matching axes.
            </p>
          </div>
          <div className="canvas-bottom">
            <span>Hover a profile to inspect its scores.</span>
            <button
              className="text-button"
              onClick={() => {
                download(csv(table), 'text/csv;charset=utf-8', 'radar-chart-data.csv');
                emitUsage('radar', 'export', 'csv');
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
      <p className="import-notice" role="status">
        {notice}
      </p>
      {journey.importing && (
        <ImportData
          kind="radar"
          initialFile={journey.initialFile}
          radarMax={maxNumber}
          onClose={journey.close}
          onImport={imported}
        />
      )}
    </div>
  );
}
