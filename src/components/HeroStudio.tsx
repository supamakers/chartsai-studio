import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import EChartView from './EChartView';
import { chartThemes, type ChartTheme, type ChartSpec } from '../lib/chart-options';
import { dotExample, radarExample } from '../lib/chart-presets';
export default function HeroStudio({ radarSvg, dotSvg }: { radarSvg: string; dotSvg: string }) {
  const [kind, setKind] = useState<'radar' | 'dot'>('radar');
  const [theme, setTheme] = useState<ChartTheme>('night');
  const spec: ChartSpec = {
    ...(kind === 'radar' ? radarExample('products') : dotExample('scores')),
    theme,
  };
  return (
    <div className="hero-studio">
      <div className="hero-studio-toolbar">
        <div className="demo-tabs">
          <button aria-pressed={kind === 'radar'} onClick={() => setKind('radar')}>
            Radar chart
          </button>
          <button aria-pressed={kind === 'dot'} onClick={() => setKind('dot')}>
            Dot plot
          </button>
        </div>
        <span>
          <i /> LIVE EXAMPLE
        </span>
      </div>
      <EChartView spec={spec} initialSvg={kind === 'radar' ? radarSvg : dotSvg} />
      <div className="hero-studio-footer">
        <div className="demo-themes" aria-label="Preview chart style">
          {Object.entries(chartThemes).map(([id, t]) => (
            <button
              key={id}
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
