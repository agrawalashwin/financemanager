import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, area } from 'd3-shape';
import { tokens } from '../../theme/tokens';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  ariaLabel?: string;
}

/**
 * D3 Sparkline Component - Nestly Style
 * Minimal inline chart for KPI cards and trends
 * Adheres to minimalist visual language: 2px stroke, subtle grid, accessible
 */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = tokens.brand.primary,
  showArea = false,
  ariaLabel = 'trend sparkline',
}: SparklineProps) {
  const margin = 4;

  const { pathD, areaD, minValue, maxValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { pathD: '', areaD: '', minValue: 0, maxValue: 0 };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([margin, width - margin]);

    const yScale = scaleLinear()
      .domain([min - range * 0.1, max + range * 0.1])
      .range([height - margin, margin]);

    // Line path
    const lineGenerator = line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d));

    const pathD = lineGenerator(data) ?? '';

    // Area path (optional)
    let areaD = '';
    if (showArea) {
      const areaGenerator = area<number>()
        .x((_, i) => xScale(i))
        .y0(height - margin)
        .y1((d) => yScale(d));

      areaD = areaGenerator(data) ?? '';
    }

    return { pathD, areaD, minValue: min, maxValue: max };
  }, [data, width, height, margin]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{
        display: 'block',
        overflow: 'visible',
      }}
    >
      {/* Area fill (optional) */}
      {showArea && areaD && (
        <path
          d={areaD}
          fill={color}
          fillOpacity={0.1}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Line stroke */}
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={tokens.chart.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Data points (optional, subtle) */}
      {data.map((value, i) => {
        const xScale = scaleLinear()
          .domain([0, data.length - 1])
          .range([margin, width - margin]);

        const yScale = scaleLinear()
          .domain([minValue, maxValue])
          .range([height - margin, margin]);

        return (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(value)}
            r={1.5}
            fill={color}
            opacity={0.6}
            style={{ pointerEvents: 'none' }}
          />
        );
      })}
    </svg>
  );
}

export default Sparkline;

