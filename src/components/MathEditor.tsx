import { coordinateNumber } from '../lib/coordinate-plane';
import { useEffect, useMemo, useState } from 'react';
import {
  buildMath,
  defaults,
  mathExamples,
  mathPaths,
  mathWorksheetSvg,
  mathCsv,
  type MathKind,
  type MathResult,
  type OptionRenderer,
} from '../lib/math-tools';
import { download, emitUsage, svgMarkupToPng } from '../lib/export';

function sliderValue(raw: string) {
  try {
    return coordinateNumber(raw);
  } catch {
    return 0;
  }
}

export default function MathEditor({ kind, initial }: { kind: MathKind; initial: MathResult }) {
  const [inputs, setInputs] = useState({ ...defaults[kind] });
  const [renderer, setRenderer] = useState<OptionRenderer>();
  const [loadError, setLoadError] = useState('');
  const [practice, setPractice] = useState(false),
    [reveal, setReveal] = useState(false);
  const [paper, setPaper] = useState<'a4' | 'letter'>('a4'),
    [format, setFormat] = useState('pdf'),
    [answerKey, setAnswerKey] = useState(true);
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState('');
  useEffect(() => {
    if (kind === 'slope' || kind === 'quadratic') {
      let alive = true;
      import('../lib/echarts')
        .then((m) => {
          if (alive) setRenderer(() => m.renderOptionSvg);
        })
        .catch(() => {
          if (alive)
            setLoadError(
              'The graph library could not load. Reload the page to try again. Ready-made downloads below still work.',
            );
        });
      return () => {
        alive = false;
      };
    }
  }, [kind]);
  const calculated = useMemo(() => {
    if ((kind === 'slope' || kind === 'quadratic') && !renderer) return { result: initial, error: loadError };
    try {
      return { result: buildMath(kind, inputs, renderer), error: '' };
    } catch (e) {
      return { result: null, error: (e as Error).message };
    }
  }, [kind, inputs, renderer, initial, loadError]);
  const { result, error } = calculated;
  const loading = (kind === 'slope' || kind === 'quadratic') && !renderer;
  const shown = !practice || reveal;
  function change(key: string, value: string) {
    setInputs((v) => ({ ...v, [key]: value }));
    setReveal(false);
    setStatus('');
  }
  const field = (key: string, label: string, hint?: string) => (
    <label className="field" key={key}>
      {label}
      <input
        type="text"
        inputMode="text"
        maxLength={key === 'points' ? 160 : 24}
        value={inputs[key]}
        onChange={(e) => change(key, e.target.value)}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
  const select = (key: string, label: string, options: [string, string][]) => (
    <label className="field" key={key}>
      {label}
      <select value={inputs[key]} onChange={(e) => change(key, e.target.value)}>
        {options.map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
  async function save() {
    if (error || !result || loading || busy) return;
    setBusy(true);
    setStatus('');
    try {
      const name = mathPaths[kind];
      if (format === 'csv') download(mathCsv(result), 'text/csv;charset=utf-8', `${name}.csv`);
      else if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paper, compress: true });
        const pages = practice && answerKey ? [false, true] : [false];
        for (const [n, answer] of pages.entries()) {
          if (n) doc.addPage();
          const svg = mathWorksheetSvg(result, paper, answer, practice),
            h = paper === 'a4' ? (800 * 297) / 210 : (800 * 11) / 8.5;
          const png = await svgMarkupToPng(svg, 2400, Math.round(h * 3));
          doc.addImage(
            new Uint8Array(await png.arrayBuffer()),
            'PNG',
            0,
            0,
            doc.internal.pageSize.getWidth(),
            doc.internal.pageSize.getHeight(),
          );
        }
        doc.setProperties({ title: result.title, creator: 'ChartsAI by SupaMakers' });
        doc.save(`${name}-${practice ? 'practice' : 'worked'}-${paper}.pdf`);
      } else {
        const svg = shown ? result.svg : result.questionSvg;
        if (format === 'svg') download(svg, 'image/svg+xml;charset=utf-8', `${name}.svg`);
        else download(await svgMarkupToPng(svg, 2160, 2160), 'image/png', `${name}.png`);
      }
      emitUsage(kind, 'export', format);
      setStatus(
        format === 'pdf'
          ? `PDF ready${practice && answerKey ? ' — answer key on page 2' : ''}. Print in portrait at 100%.`
          : 'Your download is ready.',
      );
    } catch (e) {
      setStatus(`Download failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`coordinate-workspace math-workspace math-${kind}`} id="editor">
      <div className="coordinate-top">
        <span>EXPLORE · PRACTISE · PRINT</span>
        <span>Free · No signup · Stays on your device</span>
      </div>
      <div className="coordinate-body">
        <aside className="coordinate-settings">
          <h2>
            <span className="coordinate-step">1</span> Set up your example
          </h2>
          <label className="field">
            Try an example
            <select
              value=""
              disabled={loading}
              onChange={(e) => {
                setInputs({ ...mathExamples[kind][Number(e.target.value)].values });
                setReveal(false);
                setStatus('');
                emitUsage(kind, 'sample');
              }}
            >
              <option value="" disabled>
                Choose an example…
              </option>
              {mathExamples[kind].map((e, n) => (
                <option key={n} value={n}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <p className="coordinate-help">
            Start with a worked example, or change the values below. Decimals use a dot; fractions such as 1/2
            work.
          </p>
          <fieldset disabled={loading} className="math-fields">
            <legend className="sr-only">Your values</legend>
            {kind === 'number-line' && (
              <>
                {select('mode', 'Number-line activity', [
                  ['jumps', 'Show equal jumps'],
                  ['points', 'Plot points'],
                  ['interval', 'Shade an interval'],
                  ['blank', 'Blank number line'],
                ])}
                <div className="coordinate-ranges">
                  {field('min', 'Minimum')}
                  {field('max', 'Maximum')}
                </div>
                {field('step', 'Tick interval', 'Use 2–20 equal intervals across the range.')}
                {select('labels', 'Tick labels', [
                  ['fraction', 'Fractions'],
                  ['decimal', 'Decimals'],
                ])}
                {inputs.mode === 'points' &&
                  field('points', 'Point values', '1–8 values separated by commas or spaces.')}
                {inputs.mode === 'jumps' && (
                  <>
                    {field('start', 'Start value')}
                    {field('jump', 'Jump size', 'Negative jumps go left.')}
                    {field('count', 'Number of jumps', '1–10 whole jumps.')}
                  </>
                )}
                {inputs.mode === 'interval' && (
                  <>
                    <div className="coordinate-ranges">
                      {field('low', 'Left endpoint')}
                      {field('high', 'Right endpoint')}
                    </div>
                    {select('left', 'Left endpoint type', [
                      ['closed', 'Closed — included'],
                      ['open', 'Open — excluded'],
                    ])}
                    {select('right', 'Right endpoint type', [
                      ['closed', 'Closed — included'],
                      ['open', 'Open — excluded'],
                    ])}
                  </>
                )}
              </>
            )}
            {kind === 'slope' && (
              <>
                <h3>Point A</h3>
                <div className="coordinate-ranges">
                  {field('x1', 'A: X')}
                  {field('y1', 'A: Y')}
                </div>
                <h3>Point B</h3>
                <div className="coordinate-ranges">
                  {field('x2', 'B: X')}
                  {field('y2', 'B: Y')}
                </div>
                <label className="field">
                  Move B up or down
                  <input
                    aria-label="Move point B vertically"
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={Math.max(-10, Math.min(10, sliderValue(inputs.y2)))}
                    onChange={(e) => change('y2', e.target.value)}
                  />
                  <small>Slider: −10 to 10. The fields accept −50 to 50.</small>
                </label>
              </>
            )}
            {kind === 'transformation' && (
              <>
                {select('operation', 'Transformation', [
                  ['translate', 'Translation'],
                  ['reflect', 'Reflection'],
                  ['rotate', 'Rotation'],
                  ['dilate', 'Dilation / enlargement'],
                ])}
                {inputs.operation === 'translate' && (
                  <div className="coordinate-ranges">
                    {field('dx', 'Horizontal shift')}
                    {field('dy', 'Vertical shift')}
                  </div>
                )}
                {inputs.operation === 'reflect' &&
                  select('axis', 'Reflect across', [
                    ['x', 'X-axis (y = 0)'],
                    ['y', 'Y-axis (x = 0)'],
                    ['diagonal', 'y = x'],
                    ['negative', 'y = −x'],
                  ])}
                {inputs.operation === 'rotate' &&
                  select('angle', 'Rotation angle', [
                    ['90', '90° anticlockwise'],
                    ['180', '180°'],
                    ['270', '270° anticlockwise / 90° clockwise'],
                  ])}
                {inputs.operation === 'dilate' &&
                  field('factor', 'Scale factor', 'Positive factors 0.1–5. Less than 1 shrinks the shape.')}
                {['rotate', 'dilate'].includes(inputs.operation) && (
                  <div className="coordinate-ranges">
                    {field('cx', 'Centre X')}
                    {field('cy', 'Centre Y')}
                  </div>
                )}
                <label className="field">
                  Polygon vertices
                  <textarea
                    value={inputs.points}
                    rows={5}
                    maxLength={2000}
                    onChange={(e) => change('points', e.target.value)}
                  />
                </label>
                <p className="coordinate-help">
                  One row per vertex: A,1,1 means label A, X 1, Y 1. Or paste X/Y spreadsheet columns. Use 3–6
                  vertices around the perimeter; labels 1–8 letters/numbers. Coordinates and transformed
                  results must fit −50 to 50.
                </p>
              </>
            )}
            {kind === 'quadratic' && (
              <>
                <p className="math-formula">y = ax² + bx + c</p>
                {field('a', 'a: quadratic coefficient', '−10 to −0.1 or 0.1 to 10; a cannot be zero.')}
                {field('b', 'b: linear coefficient', '−20 to 20.')}
                {field('c', 'c: constant', '−20 to 20.')}
                <label className="field">
                  Shift c up or down
                  <input
                    aria-label="Move the parabola vertically"
                    type="range"
                    min="-20"
                    max="20"
                    step="0.5"
                    value={sliderValue(inputs.c)}
                    onChange={(e) => change('c', e.target.value)}
                  />
                  <small>Changing c shifts the whole curve vertically.</small>
                </label>
              </>
            )}
          </fieldset>
          <label className="field">
            Learning mode
            <select
              value={practice ? 'practice' : 'explore'}
              onChange={(e) => {
                setPractice(e.target.value === 'practice');
                setReveal(false);
                setStatus('');
              }}
            >
              <option value="explore">Explore with explanations</option>
              <option value="practice">Practise, then reveal answers</option>
            </select>
          </label>
        </aside>
        <section className="coordinate-preview" aria-label="Math preview">
          <div className="coordinate-preview-heading">
            <h2>
              <span className="coordinate-step">2</span> {practice ? 'Try it & check' : 'See how it works'}
            </h2>
            <span>{loading ? 'Loading controls…' : practice ? 'Practice mode' : 'Live preview'}</span>
          </div>
          {error ? (
            <div role="alert" className="coordinate-error">
              <h3>Check your values</h3>
              <p>{error}</p>
              <p>Correct the fields to restore the graph and downloads.</p>
            </div>
          ) : (
            result && (
              <>
                <div className="math-given">
                  {result.given.map((g, n) => (
                    <p key={n}>{g}</p>
                  ))}
                </div>
                <div
                  className="coordinate-drawing"
                  dangerouslySetInnerHTML={{ __html: shown ? result.svg : result.questionSvg }}
                />
                {practice && (
                  <div className="math-practice">
                    <h3>Your turn</h3>
                    <ol>
                      {result.questions.map((q, n) => (
                        <li key={n}>{q}</li>
                      ))}
                    </ol>
                    <button
                      className="button secondary"
                      aria-pressed={reveal}
                      onClick={() => setReveal(!reveal)}
                    >
                      {reveal ? 'Hide answers' : 'Reveal answers'}
                    </button>
                    <p className="coordinate-help">
                      Work on paper, then compare. This tool does not grade your response.
                    </p>
                  </div>
                )}
                {shown && (
                  <section className="math-answer" aria-label="Worked solution">
                    <h3>{practice ? 'Check your work' : 'Step by step'}</h3>
                    {result.answers.length ? (
                      result.answers.map((a, n) => <p key={n}>{a}</p>)
                    ) : (
                      <p>A blank number line for your own activity.</p>
                    )}
                  </section>
                )}
                {shown && result.rows.length > 0 && (
                  <div className="coordinate-data">
                    <table>
                      <caption>
                        {kind === 'quadratic'
                          ? 'Five calculated points around the vertex'
                          : 'Values used in this example'}
                      </caption>
                      <thead>
                        <tr>
                          {result.headers.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, n) => (
                          <tr key={n}>
                            {row.map((v, c) => (
                              <td key={c}>{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="coordinate-help">{result.note}</p>
              </>
            )
          )}
        </section>
      </div>
      <section className="coordinate-download">
        <div>
          <h2>
            <span className="coordinate-step">3</span> Download & use it
          </h2>
          <p>
            PDF includes the problem and space to work. Practice mode can add a separate answer key; Explore
            mode gives a worked page.
          </p>
          <p>
            SVG and PNG match the diagram currently shown. CSV includes calculated values, even in practice
            mode.
          </p>
        </div>
        <div className="coordinate-download-controls">
          <label className="field">
            Download format
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="pdf">PDF worksheet / worked example</option>
              <option value="svg">SVG diagram (vector)</option>
              <option value="png">PNG diagram (2160 × 2160)</option>
              <option value="csv">Values CSV (includes answers)</option>
            </select>
          </label>
          {format === 'pdf' && (
            <>
              <label className="field">
                Paper size
                <select value={paper} onChange={(e) => setPaper(e.target.value as typeof paper)}>
                  <option value="a4">A4</option>
                  <option value="letter">US Letter</option>
                </select>
              </label>
              {practice && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={answerKey}
                    onChange={(e) => setAnswerKey(e.target.checked)}
                  />{' '}
                  Include separate answer key
                </label>
              )}
              <p className="coordinate-help">
                Practice PDF page 1 keeps the answers hidden, even after revealing them on screen. PDF pages
                use high-resolution images.
              </p>
            </>
          )}
          <button className="button" disabled={!!error || loading || busy} onClick={() => void save()}>
            {busy ? 'Preparing…' : 'Download free'}
          </button>
          <p role="status">{status}</p>
        </div>
      </section>
    </div>
  );
}
