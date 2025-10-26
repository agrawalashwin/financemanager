import React from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';

interface GridProps {
  xScale: d3.AxisScale<any>;
  yScale: d3.AxisScale<any>;
  width: number;
  height: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  tickCount?: number;
}

export const Grid: React.FC<GridProps> = ({
  xScale,
  yScale,
  width,
  height,
  direction = 'both',
  tickCount = 5,
}) => {
  const theme = useTheme();
  const gridRef = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (!gridRef.current) return;

    const gridColor = theme.palette.divider;
    const gridOpacity = 0.08;

    d3.select(gridRef.current).selectAll('*').remove();

    // Horizontal grid lines (from yScale)
    if (direction === 'horizontal' || direction === 'both') {
      d3.select(gridRef.current)
        .selectAll('.grid-line-horizontal')
        .data((yScale as d3.ScaleLinear<number, number>).ticks(tickCount))
        .enter()
        .append('line')
        .attr('class', 'grid-line-horizontal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => (yScale as d3.ScaleLinear<number, number>)(d))
        .attr('y2', (d) => (yScale as d3.ScaleLinear<number, number>)(d))
        .attr('stroke', gridColor)
        .attr('stroke-width', 1)
        .attr('opacity', gridOpacity)
        .attr('stroke-dasharray', '4');
    }

    // Vertical grid lines (from xScale)
    if (direction === 'vertical' || direction === 'both') {
      if (xScale instanceof d3.ScaleBand) {
        d3.select(gridRef.current)
          .selectAll('.grid-line-vertical')
          .data(xScale.domain())
          .enter()
          .append('line')
          .attr('class', 'grid-line-vertical')
          .attr('x1', (d) => (xScale as d3.ScaleBand<string>)(d) || 0)
          .attr('x2', (d) => (xScale as d3.ScaleBand<string>)(d) || 0)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', gridColor)
          .attr('stroke-width', 1)
          .attr('opacity', gridOpacity);
      }
    }
  }, [xScale, yScale, width, height, direction, tickCount, theme]);

  return <g ref={gridRef} role="presentation" aria-hidden="true" />;
};

