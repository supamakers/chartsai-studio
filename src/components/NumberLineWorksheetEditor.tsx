import { useEffect, useMemo, useState } from 'react';
import {
  initialWorksheet,
  packIds,
  packs,
  worksheetQuestions,
  worksheetPages,
  worksheetCsv,
  worksheetCode,
  type WorksheetSettings,
  type PackId,
} from '../lib/number-line-worksheets';
import { download, emitUsage, svgMarkupToPng } from '../lib/export';

export default function NumberLineWorksheetEditor() {
  const [settings, setSettings] = useState<WorksheetSettings>(initialWorksheet);
  const [paper, setPaper] = useState<'a4' | 'letter'>('a4');
  const [key, setKey] = useState(true),
    [showKey, setShowKey] = useState(false),
    [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState('');
  useEffect(() => {
    const pack = new URLSearchParams(location.search).get('pack');
    if (packIds.includes(pack as PackId)) setSettings({ ...initialWorksheet, pack: pack as PackId });
  }, []);
  const pages = useMemo(() => worksheetPages(settings, paper, true), [settings, paper]);
  const questions = useMemo(() => worksheetQuestions(settings), [settings]);
  const total = settings.count / 3;
  const update = (patch: Partial<WorksheetSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    setShowKey(false);
    setPage(0);
    setStatus('Worksheet updated.');
  };
  async function save() {
    setBusy(true);
    setStatus('Preparing your PDF…');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paper, compress: true });
      const output = worksheetPages(settings, paper, key);
      for (const [index, p] of output.entries()) {
        if (index) doc.addPage();
        const png = await svgMarkupToPng(
          p.svg,
          2400,
          Math.round((2400 * (paper === 'a4' ? 1131 : 1035)) / 800),
        );
        doc.addImage(
          new Uint8Array(await png.arrayBuffer()),
          'PNG',
          0,
          0,
          doc.internal.pageSize.getWidth(),
          doc.internal.pageSize.getHeight(),
        );
      }
      doc.setProperties({ title: packs[settings.pack].title, creator: 'ChartsAI by SupaMakers' });
      download(
        doc.output('arraybuffer'),
        'application/pdf',
        `number-line-${settings.pack}-${settings.seed}-${paper}${key ? '-with-key' : ''}.pdf`,
      );
      emitUsage('number-line-worksheets', 'export', 'pdf');
      setStatus(
        `Downloaded ${output.length} pages: ${total} question pages${key ? ` followed by ${total} answer pages` : ''}.`,
      );
    } catch {
      setStatus('PDF could not be created. Try again, or use a ready-made PDF below.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="worksheet-workbench"
      id="worksheet-generator"
      aria-label="Number line worksheet generator"
    >
      <div className="worksheet-controls">
        <h2>
          <span className="coordinate-step">1</span> Make a fresh worksheet
        </h2>
        <label className="field">
          Practice pack
          <select value={settings.pack} onChange={(e) => update({ pack: e.target.value as PackId })}>
            {packIds.map((id) => (
              <option key={id} value={id}>
                {packs[id].title}
              </option>
            ))}
          </select>
        </label>
        <div className="worksheet-control-row">
          <label className="field">
            Questions
            <select
              value={settings.count}
              onChange={(e) => update({ count: Number(e.target.value) as WorksheetSettings['count'] })}
            >
              {[6, 9, 12].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          {settings.pack !== 'jumps' && (
            <label className="field">
              Question style
              <select
                value={settings.task}
                onChange={(e) => update({ task: e.target.value as WorksheetSettings['task'] })}
              >
                <option value="mixed">Read & plot</option>
                <option value="plot">Plot points</option>
                <option value="read">Read points</option>
              </select>
            </label>
          )}
        </div>
        {settings.pack === 'fractions' && (
          <label className="field">
            Fraction steps
            <select
              value={settings.denominator}
              onChange={(e) =>
                update({ denominator: Number(e.target.value) as WorksheetSettings['denominator'] })
              }
            >
              <option value="2">Halves (1/2)</option>
              <option value="4">Quarters (1/4)</option>
              <option value="5">Fifths (1/5)</option>
              <option value="10">Tenths (1/10)</option>
            </select>
          </label>
        )}
        <p>{packs[settings.pack].description}</p>
        <button
          className="button secondary"
          onClick={() => {
            update({ seed: settings.seed === 2147483647 ? 1 : settings.seed + 1 });
            setStatus('Fresh questions ready.');
            emitUsage('number-line-worksheets', 'sample');
          }}
        >
          Generate fresh questions
        </button>
        <p className="worksheet-small">Set {settings.seed}. Changing paper size keeps the same questions.</p>
        <h2>
          <span className="coordinate-step">3</span> Download your worksheet
        </h2>
        <label className="field">
          Paper size
          <select value={paper} onChange={(e) => setPaper(e.target.value as 'a4' | 'letter')}>
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </label>
        <label className="worksheet-check">
          <input type="checkbox" checked={key} onChange={(e) => setKey(e.target.checked)} /> Include separate
          answer pages
        </label>
        <p className="worksheet-small">
          {total} question pages{key ? ` + ${total} answer pages` : ''}. Three questions per page, with
          working space.
        </p>
        <button className="button primary" disabled={busy} onClick={save}>
          {busy ? 'Preparing PDF…' : 'Download worksheet PDF'}
        </button>
        <button
          className="worksheet-text-button"
          onClick={() => {
            download(worksheetCsv(settings), 'text/csv', `number-line-${settings.seed}-answers.csv`);
            emitUsage('number-line-worksheets', 'export', 'csv');
          }}
        >
          Download questions & answers as CSV
        </button>
        <p role="status" aria-live="polite">
          {status}
        </p>
      </div>
      <div className="worksheet-preview">
        <div className="worksheet-preview-top">
          <div>
            <h2>
              <span className="coordinate-step">2</span> {showKey ? 'Answer key' : 'Question sheets'}
            </h2>
          </div>
          <button className="button secondary" aria-pressed={showKey} onClick={() => setShowKey(!showKey)}>
            {showKey ? 'Hide answers' : 'Preview answer key'}
          </button>
        </div>
        <nav aria-label="Worksheet pages" className="worksheet-pagination">
          {Array.from({ length: total }, (_, n) => (
            <button key={n} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n)}>
              Page {n + 1}
            </button>
          ))}
        </nav>
        <div
          className="worksheet-paper"
          data-testid="worksheet-paper"
          dangerouslySetInnerHTML={{ __html: pages[Math.min(page, total - 1) + (showKey ? total : 0)].svg }}
        />
        <details className="worksheet-readable">
          <summary>Read this page as text</summary>
          <ol start={page * 3 + 1}>
            {questions.slice(page * 3, page * 3 + 3).map((q) => (
              <li key={q.id}>
                {q.prompt} Number line from {q.inputs.min} to {q.inputs.max}, equal steps of {q.inputs.step}.
                {showKey && <strong> {q.answer}</strong>}
              </li>
            ))}
          </ol>
          <p>
            Reading a marked point is a visual exercise. The text lists the task and scale; preview the key to
            read its answer.
          </p>
        </details>
        <p className="worksheet-small">
          {worksheetCode(settings)} · Print at actual size (100%). Question PDFs always hide worked answers,
          even while previewing the key.
        </p>
      </div>
    </section>
  );
}
