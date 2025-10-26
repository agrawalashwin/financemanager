import React from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';

interface AxisProps {
  scale: d3.AxisScale<any>;
  position: 'top' | 'right' | 'bottom' | 'left';
  label?: string;
  tickFormat?: (d: any) => string;
  tickCount?: number;
  transform?: string;
}

export const Axis: React.FC<AxisProps> = ({
  scale,
  position,
  label,
  tickFormat,
  tickCount,
  transform,
}) => {
  const theme = useTheme();
  const axisRef = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (!axisRef.current) return;

    let axis: d3.Axis<any>;
    switch (position) {
      case 'top':
        axis = d3.axisTop(scale);
        break;
      case 'right':
        axis = d3.axisRight(scale);
        break;
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      case 'left':
      default:
        axis = d3.axisLeft(scale);
    }

    if (tickFormat) {
      axis.tickFormat(tickFormat);
    }
    if (tickCount) {
      axis.ticks(tickCount);
    }

    d3.select(axisRef.current).call(axis);

    // Style axis
    d3.select(axisRef.current)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', theme.palette.text.secondary)
      .style('font-family', theme.typography.fontFamily);

    d3.select(axisRef.current)
      .selectAll('line')
      .style('stroke', theme.palette.divider)
      .style('stroke-width', '1px');

    d3.select(axisRef.current)
      .select('.domain')
      .style('stroke', theme.palette.divider)
      .style('stroke-width', '1px');
  }, [scale, position, tickFormat, tickCount, theme]);

  return (
    <g
      ref={axisRef}
      transform={transform}
      role="presentation"
      aria-hidden="true"
    />
  );
};

