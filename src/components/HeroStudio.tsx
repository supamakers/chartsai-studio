import { useEffect, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { chartThemes, type ChartTheme } from '../lib/chart-options';
export default function HeroStudio({ descriptions }: { descriptions: Record<'radar' | 'dot', string> }) {
  const [kind, setKind] = useState<'radar' | 'dot'>('radar');
  const [theme, setTheme] = useState<ChartTheme>('night');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className="hero-studio">
      <div className="hero-studio-toolbar">
        <div className="demo-tabs">
          <button disabled={!ready} aria-pressed={kind === 'radar'} onClick={() => setKind('radar')}>
            Radar chart
          </button>
          <button disabled={!ready} aria-pressed={kind === 'dot'} onClick={() => setKind('dot')}>
            Dot plot
          </button>
        </div>
        <span>
          <i /> CHART PREVIEW
        </span>
      </div>
      <img
        className="hero-chart-preview"
        src={`/previews/${kind}-${theme}.svg`}
        alt={descriptions[kind]}
        width={900}
        height={600}
        fetchPriority="high"
        style={{ background: chartThemes[theme].background }}
      />
      <div className="hero-studio-footer">
        <div className="demo-themes" aria-label="Preview chart style">
          {Object.entries(chartThemes).map(([id, t]) => (
            <button
              key={id}
              disabled={!ready}
              aria-label={`${t.name} style`}
              aria-pressed={theme === id}
              style={{ background: t.background, color: t.colors[0] }}
              onClick={() => setTheme(id as ChartTheme)}
            >
              {theme === id ? <Check size={12} /> : <i />}
            </button>
          ))}
          <span>{chartThemes[theme].name}</span>
        </div>
        <a
          href={`/${kind === 'radar' ? 'radar-chart' : 'dot-plot'}-maker/?example=${kind === 'radar' ? 'products' : 'scores'}&style=${theme}#editor`}
        >
          Make this yours <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
