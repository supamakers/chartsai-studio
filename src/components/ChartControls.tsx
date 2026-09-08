import { useEffect, useState } from 'react';
import { ArrowDownToLine, Check, ShieldCheck, SlidersHorizontal, Table2 } from 'lucide-react';
import { emitUsage } from '../lib/export';
import {
  chartThemes,
  chartFrames,
  type Presentation,
  type ChartSpec,
  type ChartTheme,
  type ChartFrame,
} from '../lib/chart-options';
import { exportEChart, type ChartExportFormat } from '../lib/chart-export';

export function ExportButton({ spec, disabled }: { spec: ChartSpec; disabled: boolean }) {
  const [format, setFormat] = useState<ChartExportFormat>('png');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function save() {
    if (disabled) return;
    setBusy(true);
    setMessage('');
    try {
      await exportEChart(spec, format);
      emitUsage(spec.kind, 'export', format);
      setMessage('Your file is ready.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="export-group">
      <div className="export-controls">
        <select
          aria-label="Download format"
          value={format}
          onChange={(e) => setFormat(e.target.value as ChartExportFormat)}
        >
          <option value="png">PNG image</option>
          <option value="svg">Vector SVG</option>
          <option value="pdf">PDF document</option>
        </select>
        <button className="button small" disabled={disabled || busy} onClick={() => void save()}>
          <ArrowDownToLine size={16} />
          {busy ? 'Preparing…' : 'Download'}
        </button>
      </div>
      <span className="export-message" role="status">
        {message}
      </span>
    </div>
  );
}
export function StylePicker({
  value,
  onChange,
}: {
  value: Presentation;
  onChange: (value: Presentation) => void;
}) {
  return (
    <div className="presentation-controls">
      <fieldset className="theme-picker">
        <legend>Chart style</legend>
        <div className="theme-options">
          {Object.entries(chartThemes).map(([id, theme]) => (
            <button
              key={id}
              type="button"
              aria-pressed={value.theme === id}
              className={`theme-choice ${value.theme === id ? 'selected' : ''}`}
              onClick={() => onChange({ ...value, theme: id as ChartTheme })}
            >
              <span className="theme-sample" style={{ background: theme.background, color: theme.colors[0] }}>
                <i />
                <i />
                <i />
                <i />
                {value.theme === id && <Check size={12} />}
              </span>
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <label className="field">
        Canvas size
        <select
          value={value.frame}
          onChange={(e) => onChange({ ...value, frame: e.target.value as ChartFrame })}
        >
          {Object.entries(chartFrames).map(([id, frame]) => (
            <option key={id} value={id}>
              {frame.name} · {frame.width} × {frame.height}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Subtitle
        <input
          value={value.subtitle}
          maxLength={90}
          placeholder="Add a little context"
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        />
      </label>
      <label className="field">
        Source or footnote
        <input
          value={value.source}
          maxLength={100}
          placeholder="e.g. Source: my class survey, September 2026"
          onChange={(e) => onChange({ ...value, source: e.target.value })}
        />
      </label>
    </div>
  );
}
export function WorkspaceHeader({ kind }: { kind: string }) {
  return (
    <div className="workspace-top">
      <div className="live-label">
        <span /> {kind.toUpperCase()} STUDIO
      </div>
      <span className="privacy-label">
        <ShieldCheck size={14} /> Private by design. Data stays here.
      </span>
    </div>
  );
}
export function SidebarTabs({
  tab,
  setTab,
}: {
  tab: 'data' | 'design';
  setTab: (tab: 'data' | 'design') => void;
}) {
  return (
    <div className="editor-tabs">
      <button aria-pressed={tab === 'data'} onClick={() => setTab('data')}>
        <Table2 size={15} /> Data
      </button>
      <button aria-pressed={tab === 'design'} onClick={() => setTab('design')}>
        <SlidersHorizontal size={15} /> Design & details
      </button>
    </div>
  );
}
export function usePresentation(initial: Presentation) {
  const [value, setValue] = useState<Presentation>(initial);
  useEffect(() => {
    const theme = new URLSearchParams(location.search).get('style');
    if (theme && Object.hasOwn(chartThemes, theme)) setValue((v) => ({ ...v, theme: theme as ChartTheme }));
  }, []);
  return [value, setValue] as const;
}
export function PreviewStatus({ presentation }: { presentation: Presentation }) {
  return (
    <div className="canvas-status">
      <span /> LIVE PREVIEW
      <small>
        {chartThemes[presentation.theme].name} / {chartFrames[presentation.frame].name}
      </small>
    </div>
  );
}
