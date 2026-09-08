import { useEffect, useRef, useState } from 'react';
import type { EChartsType } from 'echarts/core';
import {
  chartDescription,
  chartFrames,
  chartThemes,
  createChartOption,
  type ChartSpec,
} from '../lib/chart-options';

export default function EChartView({
  spec,
  initialSvg = '',
  className = '',
}: {
  spec: ChartSpec;
  initialSvg?: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const instance = useRef<EChartsType | null>(null);
  const latest = useRef(spec);
  latest.current = spec;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    async function mount() {
      try {
        const { init } = await import('../lib/echarts');
        if (cancelled || !host.current) return;
        const el = host.current;
        const chart = init(el, undefined, { renderer: 'svg' });
        instance.current = chart;
        const draw = () => {
          if (cancelled) return;
          chart.resize();
          chart.setOption(createChartOption(latest.current, el.clientWidth, el.clientHeight), {
            notMerge: true,
          });
        };
        draw();
        observer = new ResizeObserver(draw);
        observer.observe(el);
        setReady(true);
      } catch {
        if (!cancelled) setError('The interactive chart could not load. Reload the page to try again.');
      }
    }
    void mount();
    return () => {
      cancelled = true;
      observer?.disconnect();
      instance.current?.dispose();
      instance.current = null;
    };
  }, []);
  useEffect(() => {
    const el = host.current;
    if (el && instance.current)
      instance.current.setOption(createChartOption(spec, el.clientWidth, el.clientHeight), {
        notMerge: true,
      });
  }, [spec]);
  const frame = chartFrames[spec.frame];
  return (
    <div
      className={`echart-view ${className}`}
      data-chart-kind={spec.kind}
      data-observation-count={spec.kind === 'dot' ? spec.values.length : undefined}
      data-chart-ready={ready}
      role="img"
      aria-label={chartDescription(spec)}
      style={{
        aspectRatio: `${frame.width}/${frame.height}`,
        background: chartThemes[spec.theme].background,
      }}
    >
      {!ready && (
        <div
          className="echart-placeholder"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: initialSvg }}
        />
      )}
      <div ref={host} className="echart-live" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }} />
      {error && (
        <p className="chart-load-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
