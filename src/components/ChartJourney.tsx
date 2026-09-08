import { emitUsage } from '../lib/export';
import { useRef, useState, type ReactNode } from 'react';
import { Upload, ClipboardPaste } from 'lucide-react';
import { chartInputs, type JourneyKind } from '../lib/chart-journey';

export function useChartJourney() {
  const [importing, setImporting] = useState(false);
  const [initialFile, setInitialFile] = useState<File | undefined>();
  const previewRef = useRef<HTMLDivElement>(null);
  return {
    importing,
    initialFile,
    previewRef,
    upload: (file: File) => {
      setInitialFile(file);
      setImporting(true);
    },
    paste: () => {
      setInitialFile(undefined);
      setImporting(true);
    },
    close: () => {
      setImporting(false);
      setInitialFile(undefined);
    },
    focusPreview: () =>
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        previewRef.current?.focus({ preventScroll: true });
      }),
  };
}
export function JourneyHeading({ kind }: { kind: JourneyKind }) {
  return (
    <div className="dot-journey-heading">
      <span>From your spreadsheet to a finished {chartInputs[kind].name}</span>
      <span>No signup · Your data stays on your device</span>
    </div>
  );
}
export function StepTitle({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className="dot-step-title">
      <span>{step}</span>
      <h2>{children}</h2>
    </div>
  );
}
export function DataEntry({
  kind,
  onUpload,
  onPaste,
  active,
  examples,
  onExample,
  editing,
  design,
  onEdit,
  onDesign,
}: {
  kind: JourneyKind;
  onUpload: (file: File) => void;
  onPaste: () => void;
  active: string;
  examples: { id: string; name: string }[];
  onExample: (id: string) => void;
  editing: boolean;
  design: boolean;
  onEdit: () => void;
  onDesign: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  function choose(files: FileList | null) {
    if (!files?.length) return;
    if (files.length !== 1) {
      setError('Choose one file at a time. You can select its sheet and columns next.');
      return;
    }
    setError('');
    emitUsage(kind, 'upload-open');
    onUpload(files[0]);
  }
  return (
    <>
      <StepTitle step={1}>Add your data</StepTitle>
      <p className="journey-input-description">{chartInputs[kind].input}</p>
      <div
        className="dot-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files);
        }}
      >
        <button className="dot-upload" onClick={() => fileInput.current?.click()}>
          <Upload size={24} />
          <strong>Upload a file</strong>
          <span>or drop it here</span>
        </button>
        <span>CSV, Excel (.xlsx), TSV or TXT · Up to 8 MB</span>
        <input
          hidden
          ref={fileInput}
          type="file"
          accept=".csv,.tsv,.txt,.xlsx"
          aria-label="Upload data file"
          onChange={(e) => {
            choose(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      <button
        className="button secondary dot-paste"
        onClick={() => {
          emitUsage(kind, 'paste-open');
          onPaste();
        }}
      >
        <ClipboardPaste size={17} />
        Paste data
      </button>
      <p className="dot-input-help">
        Copy cells from Excel or Google Sheets. You’ll check the selection before replacing the chart.
      </p>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      <div className="dot-example-choice">
        <label className="field">
          Just exploring? Try an example
          <select
            aria-label="Worked example"
            value={examples.some((e) => e.id === active) ? active : ''}
            onChange={(e) => onExample(e.target.value)}
          >
            <option value="" disabled>
              {active === 'custom'
                ? 'Your data is loaded'
                : active === 'dataset'
                  ? 'Public dataset loaded'
                  : 'Worked example loaded'}
            </option>
            {examples.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="dot-edit-actions">
        <button className="text-button" aria-expanded={editing && !design} onClick={onEdit}>
          Edit values
        </button>
        <button className="text-button" aria-expanded={design} onClick={onDesign}>
          Design & details
        </button>
      </div>
    </>
  );
}
export function PreviewHeading({
  kind,
  origin,
  notice,
  theme,
}: {
  kind: JourneyKind;
  origin: 'sample' | 'custom' | 'dataset';
  notice?: string;
  theme: string;
}) {
  return (
    <div className="dot-preview-heading">
      <StepTitle step={2}>Preview your {chartInputs[kind].name}</StepTitle>
      <span className={`dot-data-badge ${origin === 'custom' ? 'is-custom' : ''}`}>
        {origin === 'custom'
          ? 'Your data'
          : origin === 'dataset'
            ? 'Public dataset · attributed source'
            : 'Sample data · replace with yours'}
      </span>
      <p>{notice || chartInputs[kind].preview}</p>
      <span className="canvas-status">{theme} style</span>
    </div>
  );
}
export function DownloadStep({ children }: { children: ReactNode }) {
  return (
    <div className="dot-download-step">
      <div>
        <StepTitle step={3}>Download your chart</StepTitle>
        <p>PNG for slides · SVG for editing · PDF for printing</p>
      </div>
      {children}
    </div>
  );
}
