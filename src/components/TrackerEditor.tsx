import { forwardRef, useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, Check, CalendarDays, ShieldCheck, RotateCcw } from 'lucide-react';
import { daysInMonth, downloadTracker, monthLabel, type TrackerConfig } from '../lib/tracker';
import { emitUsage } from '../lib/export';

export const TrackerPreview = forwardRef<SVGSVGElement, { config: TrackerConfig }>(function TrackerPreview(
  { config },
  ref,
) {
  const theme =
    config.style === 'blueprint'
      ? { ink: '#254267', muted: '#61758a', line: '#9bafc6', header: '#eaf1fb', accent: '#3158df' }
      : { ink: '#222924', muted: '#647063', line: '#9ca695', header: '#edf0e6', accent: '#738f4f' };
  const plain = config.ink || config.style === 'minimal';
  const w = 1120,
    h = config.paper === 'a4' ? 792 : 865,
    margin = 60,
    labelW = 185;
  const [year, month] = config.month.split('-').map(Number);
  const count = config.period === 'week' ? 7 : daysInMonth(year, month);
  const cellW = (w - margin * 2 - labelW) / count,
    top = 252,
    rowH = Math.min(48, (h - 400) / Math.max(config.habits.length, 1));
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`${config.period === 'week' ? 'Weekly' : monthLabel(config.month)} habit tracker with ${config.habits.length} habits and ${count} checkboxes per habit.`}
      fontFamily="Arial, sans-serif"
    >
      <title>{config.title}</title>
      <desc>Blank printable tracker. Mark a box for each day you complete a habit.</desc>
      <rect width={w} height={h} fill="white" />
      {!plain && <rect x={margin} y="60" width="42" height="5" rx="2.5" fill={theme.accent} />}
      <text x={margin} y="121" fontSize="40" fontWeight="600" fill={theme.ink}>
        {config.title || 'A month of progress.'}
      </text>
      <text x={margin} y="165" fontSize="17" fill={theme.muted}>
        {config.period === 'week'
          ? 'One day at a time.  /  Week of: __________________'
          : `${monthLabel(config.month)}  /  One day at a time.`}
      </text>
      {!plain && (
        <rect x={margin} y={top - 39} width={w - margin * 2} height="39" rx="3" fill={theme.header} />
      )}
      <text x={margin + 10} y={top - 15} fontSize="11" letterSpacing="1.5" fill={theme.ink}>
        MAKE TIME FOR
      </text>
      {Array.from({ length: count }, (_, i) => (
        <text
          key={i}
          x={margin + labelW + cellW * (i + 0.5)}
          y={top - 15}
          textAnchor="middle"
          fontSize={config.period === 'week' ? 13 : 10}
          fill={theme.muted}
        >
          {config.period === 'week' ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i] : i + 1}
        </text>
      ))}
      {config.habits.map((habit, index) => {
        const y = top + index * rowH;
        return (
          <g key={index}>
            <text x={margin + 10} y={y + rowH / 2 + 5} fontSize="14" fill={theme.ink}>
              {habit}
            </text>
            <line x1={margin} x2={w - margin} y1={y + rowH} y2={y + rowH} stroke="#e5e8df" />
            {Array.from({ length: count }, (_, day) => {
              const box = Math.min(15, cellW - 7);
              return (
                <rect
                  data-tracker-box="true"
                  key={day}
                  x={margin + labelW + cellW * (day + 0.5) - box / 2}
                  y={y + rowH / 2 - box / 2}
                  width={box}
                  height={box}
                  rx="2"
                  fill="none"
                  stroke={plain ? '#737c70' : theme.line}
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}
      <text x={margin + 10} y={h - 127} fontSize="12" fill="#727b6d">
        SOMETHING WORTH REMEMBERING
      </text>
      <line x1={margin + 10} x2={w - margin} y1={h - 82} y2={h - 82} stroke="#d9dfd1" />
    </svg>
  );
});

export default function TrackerEditor() {
  const [month, setMonth] = useState('2026-09');
  const [period, setPeriod] = useState<'month' | 'week'>('month');
  const [paper, setPaper] = useState<'a4' | 'letter'>('a4');
  const [title, setTitle] = useState('A month of progress.');
  const [raw, setRaw] = useState(
    'Read a little\nMove my body\nDrink water\nMake something\nStep outside\nWind down early',
  );
  const [style, setStyle] = useState<'editorial' | 'blueprint' | 'minimal'>('editorial');
  const [ink, setInk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const date = new Date();
    setMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    if (new URLSearchParams(location.search).get('layout') === 'week') setPeriod('week');
  }, []);
  const habits = raw.split('\n').filter((h) => h.trim());
  const validMonth =
    /^\d{4}-(0[1-9]|1[0-2])$/.test(month) &&
    Number(month.slice(0, 4)) >= 1900 &&
    Number(month.slice(0, 4)) <= 2100;
  const error = !habits.length
    ? 'Add at least one habit.'
    : habits.length > 8
      ? 'Use up to 8 habits so there is room to write.'
      : habits.some((h) => [...h].length > 24)
        ? 'Keep each habit to 24 characters so the labels fit on the page.'
        : !validMonth
          ? 'Choose a month between 1900 and 2100.'
          : '';
  const config: TrackerConfig = {
    title,
    habits: habits.slice(0, 8),
    month: validMonth ? month : '2026-09',
    period,
    paper,
    ink,
    style,
  };
  async function save() {
    if (!svg.current || error) return;
    setBusy(true);
    setStatus('');
    try {
      await downloadTracker(config, svg.current);
      setStatus('Your PDF is ready. Print in landscape at actual size.');
      emitUsage('habit-tracker', 'export', 'pdf');
    } catch (e) {
      setStatus(`The PDF could not be created: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div id="editor" className="tool-workspace tracker-workspace">
      <div className="workspace-top">
        <div className="live-label">
          <span /> PRINTABLE STUDIO
        </div>
        <span className="privacy-label">
          <ShieldCheck size={14} /> No signup. No watermark.
        </span>
      </div>
      <div className="workspace-body">
        <aside className="editor-sidebar">
          <div className="panel-title">
            <h2>Your printable</h2>
            <CalendarDays size={18} />
          </div>
          <label className="field">
            Title
            <input value={title} maxLength={38} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <fieldset className="segmented-field">
            <legend>Layout</legend>
            <div className="segmented">
              <button onClick={() => setPeriod('month')} aria-pressed={period === 'month'}>
                Monthly
              </button>
              <button onClick={() => setPeriod('week')} aria-pressed={period === 'week'}>
                Weekly
              </button>
            </div>
          </fieldset>
          {period === 'month' && (
            <label className="field">
              Month
              <input
                type="month"
                min="1900-01"
                max="2100-12"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
          )}
          <label className="field">
            Your habits
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={7}
              aria-describedby="habit-hint"
            />
          </label>
          <p id="habit-hint" className="fine-print">
            One habit per line. Up to 8 habits, 24 characters each. Blank lines are ignored.
          </p>
          <div className="sidebar-divider" />
          <fieldset className="segmented-field">
            <legend>Paper size</legend>
            <div className="segmented">
              <button onClick={() => setPaper('a4')} aria-pressed={paper === 'a4'}>
                A4
              </button>
              <button onClick={() => setPaper('letter')} aria-pressed={paper === 'letter'}>
                US Letter
              </button>
            </div>
          </fieldset>
          <label className="field">
            Printable style
            <select
              aria-label="Printable style"
              value={style}
              onChange={(e) => setStyle(e.target.value as typeof style)}
            >
              <option value="editorial">Editorial</option>
              <option value="blueprint">Blueprint</option>
              <option value="minimal">Minimal ink</option>
            </select>
          </label>
          <label className="check-label">
            <input type="checkbox" checked={ink} onChange={(e) => setInk(e.target.checked)} /> Ink-friendly,
            no shaded header
          </label>
          <button className="button full-width" disabled={!!error || busy} onClick={() => void save()}>
            <ArrowDownToLine size={16} />
            {busy ? 'Preparing your PDF…' : 'Download free PDF'}
          </button>
          <p className="fine-print">
            Landscape · {paper === 'a4' ? '297 × 210 mm' : '11 × 8.5 in'} · Print at actual size
          </p>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
          <p className="download-status" role="status">
            {status}
          </p>
        </aside>
        <div className="print-canvas">
          <div className="print-canvas-top">
            <span className="canvas-status">
              <span /> Print preview
            </span>
            <span>{paper === 'a4' ? 'A4' : 'US Letter'} / Landscape</span>
          </div>
          <div className="paper-sheet">
            <TrackerPreview ref={svg} config={config} />
          </div>
          <div className="print-note">
            <Check size={15} /> A finished page. Ready for your routine.
          </div>
        </div>
      </div>
      <div className="preset-bar">
        <span>Try a different starting point</span>
        <button
          className="preset"
          onClick={() => {
            setRaw('Read 10 pages\nTake a short walk\nWrite one sentence\nTidy one small space');
            setTitle('Keep it small. Keep going.');
            emitUsage('habit-tracker', 'sample');
          }}
        >
          Small beginnings
        </button>
        <button
          className="preset"
          onClick={() => {
            setRaw('Make something\nCollect an idea\nSketch for 10 minutes\nPractice a skill\nShare my work');
            setTitle('A little more creative.');
            emitUsage('habit-tracker', 'sample');
          }}
        >
          Creative days
        </button>
        <button
          className="text-button"
          onClick={() => {
            setRaw('Read a little\nMove my body\nDrink water\nMake something\nStep outside\nWind down early');
            setTitle('A month of progress.');
          }}
        >
          <RotateCcw size={13} /> Reset labels
        </button>
      </div>
    </div>
  );
}
