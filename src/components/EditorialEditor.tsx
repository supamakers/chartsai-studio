import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, FolderOpen, Plus, X } from 'lucide-react';
import { templatesFor, templateById } from '../data/editorial-templates';
import {
  templateId,
  templateKinds,
  templateCollectionPath,
  type EditorialTemplateId,
} from '../lib/editorial-template-ids';
import { editorialExample } from '../data/editorial-examples';
import {
  animChartsProject,
  editorialOption,
  editorialNames,
  editorialDescription,
  publicationFrames,
  validateProject,
  parseProject,
  publicationHtml,
  editorialCsv,
  type EditorialKind,
  type EditorialProject,
} from '../lib/editorial';
import { chartThemes } from '../lib/chart-options';
import { csv, parseText, readNumber, type Table, type NumberStyle } from '../lib/data';
import { download, emitUsage, svgMarkupToPng } from '../lib/export';
import type { ImportSettings } from '../lib/chart-journey';
import { DataEntry, JourneyHeading, StepTitle, useChartJourney } from './ChartJourney';
import ImportData from './ImportData';
import '../styles/editorial.css';

export default function EditorialEditor({
  kind,
  initialSvg = '',
  initialProject,
  onBack,
}: {
  kind: EditorialKind;
  initialSvg?: string;
  initialProject?: EditorialProject;
  onBack?: () => void;
}) {
  const initial = initialProject ?? editorialExample(kind);
  const [selectedTemplate, setSelectedTemplate] = useState<EditorialTemplateId>();
  const sampleProject = useRef<EditorialProject | null>(initialProject && JSON.stringify(initialProject) !== JSON.stringify(editorialExample(kind)) ? null : initial);
  const [enlarged, setEnlarged] = useState(false);
  const [project, setProject] = useState(initial),
    [raw, setRaw] = useState(csv(initial.table)),
    [svg, setSvg] = useState(initialSvg),
    [renderedProject, setRenderedProject] = useState(''),
    [active, setActive] = useState(
      initialProject && JSON.stringify(initialProject) !== JSON.stringify(editorialExample(kind))
        ? 'custom'
        : 'source',
    ),
    [editing, setEditing] = useState(false),
    [design, setDesign] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [format, setFormat] = useState('png');
  const journey = useChartJourney(),
    projectInput = useRef<HTMLInputElement>(null);
  const trackedDesign = useRef(JSON.stringify(initial));
  function selectExample(id: string, track = true) {
    const known = templateId(id);
    if (known && templateKinds[known] !== kind) return;
    const p = structuredClone(known ? templateById(known).project : editorialExample(kind));
    sampleProject.current = p;
    trackedDesign.current = JSON.stringify(p);
    setProject(p);
    setRaw(csv(p.table));
    setActive(known ?? 'source');
    setSelectedTemplate(known);
    setError('');
    setEditing(false);
    setMessage(
      known
        ? `${templateById(known).name} loaded. Replace its data; colors, canvas and label settings stay selected.`
        : 'Sourced example loaded.',
    );
    if (track) emitUsage(kind, known ? 'template' : 'sample', undefined, known);
  }
  useEffect(() => {
    const id = templateId(new URLSearchParams(location.search).get('template'));
    if (id && templateKinds[id] === kind) selectExample(id, false);
  }, []);
  const dirty = raw !== csv(project.table);
  let validation = '';
  try {
    validateProject(project);
  } catch (e) {
    validation = (e as Error).message;
  }
  useEffect(() => {
    let cancelled = false;
    if (validation) return;
    void import('../lib/echarts')
      .then(({ renderOptionSvg }) => {
        const frame = publicationFrames[project.frame];
        const next = renderOptionSvg(
          editorialOption(project, frame.width, frame.height),
          frame.width,
          frame.height,
        );
        if (!cancelled) {
          setSvg(next);
          setRenderedProject(JSON.stringify(project));
        }
      })
      .catch(() => {
        if (!cancelled) setError('The chart could not render. Reload and try again.');
      });
    return () => {
      cancelled = true;
    };
  }, [project, validation]);
  const change = (patch: Partial<EditorialProject>) => setProject((p) => ({ ...p, ...patch }));
  function apply(table: Table, style: NumberStyle = 'us', settings?: ImportSettings) {
    const normalized = table.map((row, r) =>
      row.map((v, c) =>
        r && c
          ? String(readNumber(v, style) ?? v)
          : r && !c && settings?.lineMode === 'number'
            ? String(readNumber(v, style) ?? v)
            : v,
      ),
    );
    const sample = sampleProject.current;
    const next = validateProject({
      ...project,
      table: normalized,
      xMode: settings?.lineMode ?? project.xMode,
      annotations: [],
      unit: sample && project.unit === sample.unit ? 'Value' : project.unit,
      title:
        sample && project.title === sample.title
          ? 'Your ' + editorialNames[kind].toLowerCase()
          : project.title,
      subtitle: sample && project.subtitle === sample.subtitle ? '' : project.subtitle,
      source: sample && project.source === sample.source ? '' : project.source,
      sourceUrl: sample && project.sourceUrl === sample.sourceUrl ? '' : project.sourceUrl,
      date: sample && project.date === sample.date ? '' : project.date,
      caption: sample && project.caption === sample.caption ? '' : project.caption,
    });
    setProject(next);
    setRaw(csv(next.table));
    setActive('custom');
    setError('');
    setEditing(false);
    setMessage(
      `${table.length - 1} rows applied. Previous annotations were cleared; add notes for this data below.`,
    );
    journey.focusPreview();
    emitUsage(kind, 'render');
  }
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 250000) throw Error('Choose a project smaller than 250 KB.');
      const next = parseProject(await file.text());
      if (next.kind !== kind)
        throw Error(`This project is a ${editorialNames[next.kind]}. Open its maker to restore it.`);
      setProject(next);
      setRaw(csv(next.table));
      setActive('custom');
      setSelectedTemplate(undefined);
      sampleProject.current = null;
      trackedDesign.current = JSON.stringify(next);
      setError('');
      setMessage('Project restored with its data, styling, source and annotations.');
      emitUsage(kind, 'project-load');
      journey.focusPreview();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function save() {
    if (dirty || validation) return;
    setBusy(true);
    setError('');
    try {
      const p = validateProject(project),
        frame = publicationFrames[p.frame],
        name = `${kind}-publication`;
      const { renderOptionSvg } = await import('../lib/echarts');
      const markup = renderOptionSvg(
        editorialOption(p, frame.width, frame.height),
        frame.width,
        frame.height,
      );
      if (format === 'animcharts')
        download(
          JSON.stringify(animChartsProject(p), null, 2),
          'application/json',
          'animcharts-editorial-line.json',
        );
      else if (format === 'json') download(JSON.stringify(p, null, 2), 'application/json', `${name}.json`);
      else if (format === 'csv') download(editorialCsv(p), 'text/csv;charset=utf-8', `${name}.csv`);
      else if (format === 'html')
        download(publicationHtml(p, markup), 'text/html;charset=utf-8', `${name}.html`);
      else if (format === 'svg') download(markup, 'image/svg+xml;charset=utf-8', `${name}.svg`);
      else {
        const png = await svgMarkupToPng(markup, frame.width, frame.height);
        if (format === 'png') download(png, 'image/png', `${name}.png`);
        else {
          const { jsPDF } = await import('jspdf');
          const doc = new jsPDF({
            orientation: frame.width >= frame.height ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [frame.width * 0.75, frame.height * 0.75],
            compress: true,
          });
          doc.addImage(
            new Uint8Array(await png.arrayBuffer()),
            'PNG',
            0,
            0,
            frame.width * 0.75,
            frame.height * 0.75,
          );
          doc.setProperties({ title: p.title, creator: 'ChartsAI by SupaMakers' });
          doc.save(`${name}.pdf`);
        }
      }
      emitUsage(kind, 'export', format, selectedTemplate);
      setMessage('Your file is ready.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div id="editor" className="tool-workspace dot-journey editorial-workspace">
      <JourneyHeading kind={kind} />
      {onBack && (
        <div className="publication-return">
          <button className="text-button" onClick={onBack}>
            Back to standard maker
          </button>
          <span>Publication mode · data stays on your device</span>
        </div>
      )}
      <div className="workspace-body">
        <aside className="editor-sidebar dot-input-panel">
          <DataEntry
            kind={kind}
            active={active}
            examples={[
              {
                id: 'source',
                name: kind === 'line' ? 'NASA temperature record' : 'World Bank life expectancy',
              },
              ...templatesFor(kind).map((t) => ({ id: t.id, name: t.name })),
            ]}
            onExample={(id) => selectExample(id)}
            editing={editing}
            design={design}
            onUpload={(file) => {
              journey.upload(file);
            }}
            onPaste={() => {
              journey.paste();
            }}
            onEdit={() => {
              setEditing(!editing);
              setDesign(false);
            }}
            onDesign={() => {
              setDesign(!design);
              setEditing(false);
            }}
          />
          {templatesFor(kind).length > 0 && (
            <p className="template-import-hint">
              {selectedTemplate ? (
                <>
                  Design from <strong>{templateById(selectedTemplate).name}</strong>. Upload or paste your
                  data above. The palette, canvas and label settings stay; unchanged sample text and notes are
                  cleared.
                </>
              ) : (
                <>
                  Start with a finished visual from the{' '}
                  <a href={templateCollectionPath(kind as 'dumbbell' | 'slopegraph' | 'small-multiples')}>
                    example collection
                  </a>
                  .
                </>
              )}
            </p>
          )}
          <button className="text-button project-open" onClick={() => projectInput.current?.click()}>
            <FolderOpen size={16} /> Open saved chart project
          </button>
          <input
            hidden
            ref={projectInput}
            type="file"
            accept=".json"
            aria-label="Open chart project file"
            onChange={(e) => {
              void restore(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          {editing && (
            <div className="dot-values">
              <label className="field">
                Edit CSV data
                <textarea
                  rows={10}
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  aria-label="Publication CSV data"
                />
              </label>
              <button
                className="button secondary"
                onClick={() => {
                  try {
                    apply(parseText(raw));
                    emitUsage(kind, 'apply');
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Apply data
              </button>
            </div>
          )}
          {design && (
            <div
              className="dot-design"
              onBlur={() => {
                const snapshot = JSON.stringify(project);
                if (snapshot !== trackedDesign.current) {
                  emitUsage(kind, 'design');
                  trackedDesign.current = snapshot;
                }
              }}
            >
              <h3>Tell the reader what matters</h3>
              {(
                [
                  ['title', 'Headline', 90],
                  ['subtitle', 'Subtitle', 120],
                  ['unit', 'Unit', 40],
                  ['source', 'Source credit', 140],
                  ['sourceUrl', 'Source link', 400],
                  ['date', 'Data date or period', 60],
                  ['caption', 'Caption / limitations', 180],
                ] as const
              ).map(([key, label, max]) => (
                <label className="field" key={key}>
                  {label}
                  <input
                    value={project[key]}
                    maxLength={max}
                    onChange={(e) => change({ [key]: e.target.value })}
                  />
                </label>
              ))}
              <label className="field">
                Publication size
                <select
                  value={project.frame}
                  onChange={(e) => change({ frame: e.target.value as EditorialProject['frame'] })}
                >
                  {Object.entries(publicationFrames).map(([id, v]) => (
                    <option key={id} value={id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Chart style
                <select
                  value={project.theme}
                  onChange={(e) => change({ theme: e.target.value as EditorialProject['theme'] })}
                >
                  {Object.entries(chartThemes).map(([id, t]) => (
                    <option key={id} value={id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Displayed decimal places
                <select
                  value={project.decimals}
                  onChange={(e) => change({ decimals: Number(e.target.value) })}
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <p className="fine-print">
                Rounding affects displayed labels. CSV and projects retain the original values. Publication
                bar charts accept up to 30 categories; small multiples with three or more panels need a square
                canvas.
              </p>
              {(kind === 'line' || kind === 'small-multiples') && (
                <label className="field">
                  Horizontal spacing
                  <select
                    value={project.xMode}
                    onChange={(e) => change({ xMode: e.target.value as EditorialProject['xMode'] })}
                  >
                    <option value="category">Equal spacing — row order</option>
                    <option value="number">Numeric distance (including years)</option>
                    <option value="time">Elapsed days — YYYY-MM-DD</option>
                  </select>
                </label>
              )}
              {kind !== 'bar' && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={project.zero}
                    onChange={(e) => change({ zero: e.target.checked })}
                  />
                  Include zero in the value axis
                </label>
              )}
              {kind !== 'slopegraph' && kind !== 'small-multiples' && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={project.directLabels}
                    onChange={(e) => change({ directLabels: e.target.checked })}
                  />
                  Show direct labels
                </label>
              )}
            </div>
          )}
        </aside>
        <div
          className="canvas-panel"
          ref={journey.previewRef}
          tabIndex={-1}
          aria-label="Publication chart preview"
        >
          <StepTitle step={2}>Preview your publication chart</StepTitle>
          <p className="publication-origin">
            {active === 'source'
              ? 'Sourced example · replace with your own data'
              : templateId(active)
                ? templateById(templateId(active)!).provenance + ' · replace with your own data'
                : 'Your data'}{' '}
            · {project.table.length - 1} rows · {project.table[0].length - 1} series
          </p>
          <button
            className="text-button preview-zoom"
            aria-pressed={enlarged}
            onClick={() => setEnlarged(!enlarged)}
          >
            {enlarged ? 'Fit chart to screen' : 'Enlarge chart for reading'}
          </button>
          <div
            className={`chart-stage ${enlarged ? 'publication-enlarged' : ''}`}
            tabIndex={enlarged ? 0 : undefined}
            aria-label={enlarged ? 'Enlarged chart; scroll horizontally to read' : undefined}
          >
            {svg && (
              <img
                className="publication-preview"
                data-chart-ready={!validation && renderedProject === JSON.stringify(project)}
                src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
                alt={editorialDescription(project)}
                width={publicationFrames[project.frame].width}
                height={publicationFrames[project.frame].height}
              />
            )}
          </div>
          {(validation || error) && (
            <p role="alert" className="notice error">
              {validation || error}
            </p>
          )}
          {dirty && (
            <p className="notice">
              Apply your edited CSV before downloading. The preview still shows the last applied data.
            </p>
          )}
          <p role="status" className="notice" hidden={!message}>
            {message}
          </p>
          <details className="publication-annotations">
            <summary>Annotate a data point · {project.annotations.length}/3 notes</summary>
            <p>
              Choose a row and series. Numbered markers stay attached to their values; the full notes appear
              below the plot in every export.
            </p>
            {project.annotations.map((a, i) => (
              <fieldset key={i}>
                <legend>Annotation {i + 1}</legend>
                <label className="field">
                  Row
                  <select
                    value={a.label}
                    onChange={(e) =>
                      change({
                        annotations: project.annotations.map((v, j) =>
                          j === i ? { ...v, label: e.target.value } : v,
                        ),
                      })
                    }
                  >
                    {project.table.slice(1).map((row) => (
                      <option key={row[0]}>{row[0]}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Series
                  <select
                    value={a.series}
                    onChange={(e) =>
                      change({
                        annotations: project.annotations.map((v, j) =>
                          j === i ? { ...v, series: e.target.value } : v,
                        ),
                      })
                    }
                  >
                    {project.table[0].slice(1).map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Note
                  <input
                    value={a.text}
                    maxLength={100}
                    onChange={(e) =>
                      change({
                        annotations: project.annotations.map((v, j) =>
                          j === i ? { ...v, text: e.target.value } : v,
                        ),
                      })
                    }
                  />
                </label>
                <button
                  className="text-button"
                  onClick={() => change({ annotations: project.annotations.filter((_, j) => j !== i) })}
                >
                  <X size={14} />
                  Remove annotation {i + 1}
                </button>
              </fieldset>
            ))}
            <button
              className="text-button"
              disabled={project.annotations.length >= 3}
              onClick={() => {
                change({
                  annotations: [
                    ...project.annotations,
                    {
                      label: project.table[1][0],
                      series: project.table[0][1],
                      text: 'Explain this observation',
                    },
                  ],
                });
                emitUsage(kind, 'annotation');
              }}
            >
              <Plus size={16} />
              Add annotation
            </button>
          </details>
          <section className="publication-download">
            <StepTitle step={3}>Download for your publication</StepTitle>
            <p>
              No watermark. SVG stays vector; PNG and PDF use your selected canvas size. HTML includes the
              chart, caption and accessible data table, with no external scripts.
            </p>
            <div className="export-controls">
              <select
                aria-label="Publication download format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="png">PNG image</option>
                <option value="svg">Vector SVG</option>
                <option value="pdf">PDF document</option>
                <option value="html">Self-contained HTML</option>
                <option value="csv">Source values CSV</option>
                <option value="json">Editable chart project</option>
                {kind === 'line' && <option value="animcharts">AnimCharts animation project</option>}
              </select>
              <button
                className="button small"
                disabled={!!validation || dirty || busy}
                onClick={() => void save()}
              >
                <ArrowDownToLine size={16} />
                {busy ? 'Preparing…' : 'Download publication chart'}
              </button>
            </div>
            <p className="fine-print">
              {kind === 'line' && (
                <>
                  For animation, choose an AnimCharts project and open the downloaded file in{' '}
                  <a href="https://animcharts.com/editorial-lab/">AnimCharts</a>. Colors and layout adapt to
                  its video templates; the original project is retained in the file.{' '}
                </>
              )}
              Downloads stay on your device until you choose to publish them. A project contains all entered
              data and notes.
            </p>
          </section>
          <details className="publication-data">
            <summary>View all {project.table.length - 1} source rows</summary>
            <div className="table-scroll">
              <table>
                <caption>Exact source values · {project.unit}</caption>
                <thead>
                  <tr>
                    {project.table[0].map((v, i) => (
                      <th key={i} scope="col">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {project.table.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((v, j) =>
                        j ? (
                          <td key={j}>{v}</td>
                        ) : (
                          <th key={j} scope="row">
                            {v}
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
      {journey.importing && (
        <ImportData
          kind={kind}
          initialFile={journey.initialFile}
          onClose={journey.close}
          onImport={(table, style, _label, settings) => apply(table, style, settings)}
        />
      )}
    </div>
  );
}
