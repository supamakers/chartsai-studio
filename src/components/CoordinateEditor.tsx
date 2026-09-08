import { useState } from 'react';
import { ArrowDownToLine, Eye, EyeOff } from 'lucide-react';
import {
  coordinateExamples,
  defaultPlane,
  parsePoints,
  planeSvg,
  pointRegion,
  pointsCsv,
  validatePlane,
  worksheetSvg,
  type Plane,
  type Activity,
} from '../lib/coordinate-plane';
import { download, emitUsage, svgMarkupToPng } from '../lib/export';

export default function CoordinateEditor() {
  const [activity, setActivity] = useState<Activity>('diagram');
  const [raw, setRaw] = useState(coordinateExamples.quadrants.raw);
  const [range, setRange] = useState({ xmin: '-10', xmax: '10', ymin: '-10', ymax: '10' });
  const [step, setStep] = useState(1);
  const [numbers, setNumbers] = useState(true),
    [grid, setGrid] = useState(true),
    [connect, setConnect] = useState(false);
  const [reveal, setReveal] = useState(false),
    [paper, setPaper] = useState<'a4' | 'letter'>('a4');
  const [title, setTitle] = useState('Explore the coordinate plane');
  const [format, setFormat] = useState('pdf'),
    [key, setKey] = useState(true);
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState('');
  const p: Plane = {
    ...defaultPlane,
    ...Object.fromEntries(Object.entries(range).map(([k, v]) => [k, v.trim() ? Number(v) : NaN])),
    step,
    numbers,
    grid,
    connect,
  };
  let error = '',
    points: ReturnType<typeof parsePoints> = [];
  try {
    points = activity === 'blank' ? [] : parsePoints(raw);
    validatePlane(p, points);
  } catch (e) {
    error = (e as Error).message;
  }
  const practice = activity === 'plot' || activity === 'read';
  const visible = !error && (activity !== 'plot' || reveal) ? points : [];
  const duplicates = points.length !== new Set(points.map((v) => `${v.x},${v.y}`)).size;
  const shownCoordinates = activity === 'diagram' || reveal;
  function resetFeedback() {
    setReveal(false);
    setStatus('');
  }
  function example(id: keyof typeof coordinateExamples) {
    const sample = coordinateExamples[id];
    setRaw(sample.raw);
    setRange({
      xmin: String(sample.plane.xmin),
      xmax: String(sample.plane.xmax),
      ymin: String(sample.plane.ymin),
      ymax: String(sample.plane.ymax),
    });
    setStep(sample.plane.step);
    setConnect(sample.plane.connect);
    setActivity('diagram');
    resetFeedback();
    emitUsage('coordinate-plane', 'sample');
  }
  async function save() {
    if (error || busy) return;
    setBusy(true);
    setStatus('');
    try {
      if (format === 'csv') download(pointsCsv(points), 'text/csv;charset=utf-8', 'coordinate-points.csv');
      else if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paper, compress: true });
        const h = paper === 'a4' ? (800 * 297) / 210 : (800 * 11) / 8.5;
        const pages = practice && key ? [false, true] : [false];
        for (const [i, answer] of pages.entries()) {
          if (i) doc.addPage();
          const svg = worksheetSvg(p, points, activity, paper, title, answer);
          const image = await svgMarkupToPng(svg, 2400, Math.round(h * 3));
          doc.addImage(
            new Uint8Array(await image.arrayBuffer()),
            'PNG',
            0,
            0,
            doc.internal.pageSize.getWidth(),
            doc.internal.pageSize.getHeight(),
          );
        }
        doc.setProperties({ title, subject: 'Coordinate plane activity', creator: 'ChartsAI by SupaMakers' });
        doc.save(`coordinate-plane-${activity}-${paper}.pdf`);
      } else {
        const svg = planeSvg(p, visible, shownCoordinates);
        if (format === 'svg') download(svg, 'image/svg+xml;charset=utf-8', 'coordinate-plane.svg');
        else download(await svgMarkupToPng(svg, 2160, 2160), 'image/png', 'coordinate-plane.png');
      }
      emitUsage('coordinate-plane', 'export', format);
      setStatus(
        format === 'pdf'
          ? `Your ${paper === 'a4' ? 'A4' : 'US Letter'} PDF is ready${practice && key ? ', with the answer key on page 2' : ''}. Print in portrait at 100%.`
          : 'Your download is ready.',
      );
    } catch (e) {
      setStatus(`Download failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="coordinate-workspace" id="editor">
      <div className="coordinate-top">
        <span>MAKE IT · EXPLORE IT · PRINT IT</span>
        <span>Free · No signup · Stays on your device</span>
      </div>
      <div className="coordinate-body">
        <aside className="coordinate-settings">
          <h2>
            <span className="coordinate-step">1</span> Choose your activity
          </h2>
          <label className="field">
            Activity
            <select
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value as Activity);
                if (e.target.value === 'blank' && format === 'csv') setFormat('pdf');
                resetFeedback();
              }}
            >
              <option value="blank">Blank grid</option>
              <option value="diagram">Labelled diagram</option>
              <option value="plot">Practise plotting points</option>
              <option value="read">Practise reading coordinates</option>
            </select>
          </label>
          <p className="coordinate-help">
            {activity === 'blank'
              ? 'Print an empty coordinate plane for your own work.'
              : activity === 'diagram'
                ? 'See each point, its coordinates and its position on the plane.'
                : activity === 'plot'
                  ? 'Use the ordered pairs to plot on paper, then reveal the positions to check.'
                  : 'Read each point from the graph. Reveal the coordinates when you are ready.'}
          </p>
          <label className="field">
            Grid range
            <select
              value=""
              onChange={(e) => {
                const q = e.target.value;
                setRange(
                  q === 'first'
                    ? { xmin: '0', xmax: '10', ymin: '0', ymax: '10' }
                    : q === 'small'
                      ? { xmin: '-5', xmax: '5', ymin: '-5', ymax: '5' }
                      : { xmin: '-10', xmax: '10', ymin: '-10', ymax: '10' },
                );
                setStep(1);
                resetFeedback();
              }}
            >
              <option value="" disabled>
                Choose a preset range…
              </option>
              <option value="four">Four quadrants: −10 to 10</option>
              <option value="small">Four quadrants: −5 to 5</option>
              <option value="first">First quadrant: 0 to 10</option>
            </select>
          </label>
          <details className="coordinate-details">
            <summary>Adjust axes & grid</summary>
            <div className="coordinate-ranges">
              {(['xmin', 'xmax', 'ymin', 'ymax'] as const).map((k) => (
                <label className="field" key={k}>
                  {k[0].toUpperCase()} {k.endsWith('min') ? 'minimum' : 'maximum'}
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    step="0.5"
                    value={range[k]}
                    onChange={(e) => {
                      setRange({ ...range, [k]: e.target.value });
                      resetFeedback();
                    }}
                  />
                </label>
              ))}
            </div>
            <label className="field">
              Grid interval
              <select
                value={step}
                onChange={(e) => {
                  setStep(Number(e.target.value));
                  resetFeedback();
                }}
              >
                {[0.5, 1, 2, 5, 10].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="check-label">
              <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Show
              axis numbers
            </label>
            <label className="check-label">
              <input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} /> Show grid
              lines
            </label>
            <p className="coordinate-help">
              Both axes include zero. Limits −50 to 50; 2–40 intervals per axis. One X unit always equals one
              Y unit.
            </p>
          </details>
          {activity !== 'blank' && (
            <details className="coordinate-details">
              <summary>Edit or paste points</summary>
              <label className="field">
                Points
                <textarea
                  rows={7}
                  value={raw}
                  maxLength={10000}
                  onChange={(e) => {
                    setRaw(e.target.value);
                    resetFeedback();
                  }}
                  aria-describedby="coordinate-input-hint"
                />
              </label>
              <p id="coordinate-input-hint" className="coordinate-help">
                One point per line: <code>A,3,4</code> means label A, X 3, Y 4. Or paste two X/Y columns from
                a spreadsheet. Optional header: Label,X,Y or X,Y. Up to 12 points; decimals use a dot;
                fractions such as 1/2 work.
              </p>
              <label className="check-label">
                <input type="checkbox" checked={connect} onChange={(e) => setConnect(e.target.checked)} />{' '}
                Join points in order and close the shape
              </label>
            </details>
          )}
          <label className="field">
            Try a worked example
            <select value="" onChange={(e) => example(e.target.value as keyof typeof coordinateExamples)}>
              <option value="" disabled>
                Choose an example…
              </option>
              {Object.entries(coordinateExamples).map(([id, e]) => (
                <option value={id} key={id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <p className="coordinate-help">
            Examples replace the points and range. These are original teaching examples.
          </p>
        </aside>
        <section className="coordinate-preview" aria-label="Coordinate plane preview">
          <div className="coordinate-preview-heading">
            <h2>
              <span className="coordinate-step">2</span> {practice ? 'Explore & check' : 'Preview your grid'}
            </h2>
            <span>
              {error
                ? 'Check your settings'
                : activity === 'blank'
                  ? 'Blank grid'
                  : `${points.length} points · Equal scale`}
            </span>
          </div>
          {error ? (
            <div className="coordinate-error" role="alert">
              <h3>Let’s check the inputs</h3>
              <p>{error}</p>
              <p>
                Open “Edit or paste points” or “Adjust axes & grid” to make a correction. Downloads are paused
                until everything fits.
              </p>
            </div>
          ) : (
            <>
              <div
                className="coordinate-drawing"
                dangerouslySetInnerHTML={{ __html: planeSvg(p, visible, shownCoordinates) }}
              />
              {practice && (
                <button className="button secondary" onClick={() => setReveal(!reveal)} aria-pressed={reveal}>
                  {reveal ? <EyeOff size={17} /> : <Eye size={17} />}{' '}
                  {reveal ? 'Hide answers' : 'Reveal answers'}
                </button>
              )}
              {activity !== 'blank' && (
                <div className="coordinate-data">
                  <table>
                    <caption>
                      {activity === 'read' && !reveal
                        ? 'Write down the coordinates before revealing the answers.'
                        : activity === 'plot' && !reveal
                          ? 'Plot these ordered pairs on your worksheet.'
                          : 'Exact point values'}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Point</th>
                        <th scope="col">X</th>
                        <th scope="col">Y</th>
                        {shownCoordinates && <th scope="col">Position</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {points.map((v) => (
                        <tr key={v.label}>
                          <th scope="row">{v.label}</th>
                          <td>{activity === 'read' && !reveal ? '___' : v.x}</td>
                          <td>{activity === 'read' && !reveal ? '___' : v.y}</td>
                          {shownCoordinates && <td>{pointRegion(v)}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {duplicates && (
                <p className="coordinate-help">
                  Some points share a position. Every point remains in the table and CSV; labels may overlap
                  on the diagram.
                </p>
              )}
            </>
          )}
        </section>
      </div>
      <section className="coordinate-download">
        <div>
          <h2>
            <span className="coordinate-step">3</span> Download & use it
          </h2>
          <p>
            PDF is a complete page. SVG and PNG contain the graph currently shown. CSV always includes all
            point values.
          </p>
        </div>
        <div className="coordinate-download-controls">
          <label className="field">
            Download format
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="pdf">PDF worksheet</option>
              <option value="svg">SVG graph (vector)</option>
              <option value="png">PNG graph (2160 × 2160)</option>
              {activity !== 'blank' && <option value="csv">Points CSV</option>}
            </select>
          </label>
          {format === 'pdf' && (
            <>
              <label className="field">
                Worksheet title
                <input value={title} maxLength={42} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="field">
                Paper size
                <select value={paper} onChange={(e) => setPaper(e.target.value as typeof paper)}>
                  <option value="a4">A4</option>
                  <option value="letter">US Letter</option>
                </select>
              </label>
              {practice && (
                <label className="check-label">
                  <input type="checkbox" checked={key} onChange={(e) => setKey(e.target.checked)} /> Include
                  separate answer key
                </label>
              )}
              <p className="coordinate-help">
                Portrait · Print at 100%. Practice PDFs keep answers off page 1, even after revealing them on
                screen.
              </p>
            </>
          )}
          <button
            className="button"
            disabled={!!error || busy || (activity === 'blank' && format === 'csv')}
            onClick={() => void save()}
          >
            <ArrowDownToLine size={18} />
            {busy ? 'Preparing…' : 'Download free'}
          </button>
          <p role="status">{status}</p>
        </div>
      </section>
    </div>
  );
}
