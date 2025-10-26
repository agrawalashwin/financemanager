import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';
import { useChartDimensions } from '../../hooks/useChartDimensions';
import { nytimesColors, withOpacity } from '../../theme/nytimesColors';

interface WaterfallData {
  label: string;
  value: number;
  type: 'start' | 'add' | 'subtract' | 'end';
}

interface WaterfallProps {
  data: WaterfallData[];
  title?: string;
  height?: number;
}

export const Waterfall: React.FC<WaterfallProps> = ({
  data,
  title = 'Waterfall Chart',
  height = 300,
}) => {
  const theme = useTheme();
  const { ref, width, margin, boundedWidth, boundedHeight } = useChartDimensions({
    minHeight: height,
  });

  const processedData = useMemo(() => {
    let runningTotal = 0;
    return data.map((d, i) => {
      const isStart = d.type === 'start';
      const isEnd = d.type === 'end';
      const isAdd = d.type === 'add';

      let start = 0;
      let end = 0;

      if (isStart) {
        start = 0;
        end = d.value;
        runningTotal = d.value;
      } else if (isEnd) {
        start = 0;
        end = runningTotal;
      } else if (isAdd) {
        start = runningTotal;
        end = runningTotal + d.value;
        runningTotal = end;
      } else {
        start = runningTotal;
        end = runningTotal + d.value;
        runningTotal = end;
      }

      return {
        ...d,
        start,
        end,
        isPositive: d.value >= 0,
      };
    });
  }, [data]);

  const yMax = Math.max(...processedData.map((d) => Math.max(d.start, d.end)));
  const yMin = Math.min(...processedData.map((d) => Math.min(d.start, d.end)));

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(processedData.map((_, i) => i.toString()))
        .range([0, boundedWidth])
        .padding(0.3),
    [processedData, boundedWidth]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([yMin * 1.1, yMax * 1.1])
        .range([boundedHeight, 0]),
    [yMin, yMax, boundedHeight]
  );

  const getColor = (d: (typeof processedData)[0]) => {
    if (d.type === 'start' || d.type === 'end') return nytimesColors.net;
    if (d.isPositive) return nytimesColors.revenue;
    return nytimesColors.expense;
  };

  // Create gradient definitions
  const gradientId = `waterfall-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box ref={ref} sx={{ width: '100%', height }}>
      <svg
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
        role="img"
        aria-label={title}
      >
        <defs>
          {/* Gradient definitions - NY Times style */}
          <linearGradient id={`${gradientId}-primary`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={nytimesColors.net} stopOpacity={0.15} />
            <stop offset="100%" stopColor={nytimesColors.net} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${gradientId}-success`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={nytimesColors.revenue} stopOpacity={0.15} />
            <stop offset="100%" stopColor={nytimesColors.revenue} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${gradientId}-error`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={nytimesColors.expense} stopOpacity={0.15} />
            <stop offset="100%" stopColor={nytimesColors.expense} stopOpacity={0} />
          </linearGradient>
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines - NY Times minimal style */}
          {yScale.ticks(5).map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={0}
              x2={boundedWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={nytimesColors.chart.gridLine}
              strokeWidth={0.75}
              opacity={nytimesColors.chart.gridLineOpacity}
            />
          ))}

          {/* Bars */}
          {processedData.map((d, i) => {
            const x = xScale(i.toString()) || 0;
            const barWidth = xScale.bandwidth();
            const y0 = yScale(d.start);
            const y1 = yScale(d.end);
            const barHeight = Math.abs(y1 - y0);

            // Determine gradient ID based on color
            let gradId = `${gradientId}-primary`;
            if (d.type !== 'start' && d.type !== 'end') {
              gradId = d.isPositive ? `${gradientId}-success` : `${gradientId}-error`;
            }

            return (
              <g key={`bar-${i}`}>
                {/* Bar with NY Times styling */}
                <rect
                  x={x}
                  y={Math.min(y0, y1)}
                  width={barWidth}
                  height={barHeight}
                  fill={getColor(d)}
                  opacity={0.9}
                  rx={2}
                  strokeWidth={1.5}
                  stroke={getColor(d)}
                />
                {/* Subtle gradient overlay */}
                <rect
                  x={x}
                  y={Math.min(y0, y1)}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#${gradId})`}
                  rx={2}
                  pointerEvents="none"
                />

                {/* Connector line - NY Times style */}
                {i < processedData.length - 1 && (
                  <line
                    x1={x + barWidth}
                    y1={yScale(d.end)}
                    x2={xScale((i + 1).toString()) || 0}
                    y2={yScale(d.end)}
                    stroke={nytimesColors.chart.gridLine}
                    strokeDasharray="3,2"
                    opacity={0.25}
                    strokeWidth={1}
                  />
                )}

                {/* Label */}
                <text
                  x={x + barWidth / 2}
                  y={Math.min(y0, y1) - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill={nytimesColors.mediumGrey}
                  fontWeight="500"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {d.label}
                </text>

                {/* Value - tabular numerals */}
                <text
                  x={x + barWidth / 2}
                  y={Math.min(y0, y1) + barHeight / 2}
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="12"
                  fill={nytimesColors.white}
                  fontWeight="600"
                  fontFamily="'Roboto Mono', monospace"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  ${Math.abs(d.value).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Y Axis - NY Times style */}
          <g>
            {yScale.ticks(5).map((tick) => (
              <g key={`tick-${tick}`} transform={`translate(0,${yScale(tick)})`}>
                <line x1={-4} x2={0} stroke={nytimesColors.chart.axisLine} strokeWidth={0.75} />
                <text
                  x={-8}
                  textAnchor="end"
                  dy="0.3em"
                  fontSize="11"
                  fill={nytimesColors.chart.axisText}
                  fontFamily="'Roboto Mono', monospace"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  ${tick.toLocaleString()}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </Box>
  );
};

