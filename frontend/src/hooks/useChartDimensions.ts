import { useEffect, useRef, useState } from 'react';

interface ChartDimensions {
  ref: React.RefObject<SVGSVGElement>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  boundedWidth: number;
  boundedHeight: number;
}

interface UseChartDimensionsOptions {
  minHeight?: number;
  minWidth?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export const useChartDimensions = (
  options: UseChartDimensionsOptions = {}
): ChartDimensions => {
  const {
    minHeight = 300,
    minWidth = 400,
    margin: customMargin = {},
  } = options;

  const ref = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: minWidth,
    height: minHeight,
  });

  const margin = {
    top: customMargin.top ?? 40,
    right: customMargin.right ?? 30,
    bottom: customMargin.bottom ?? 80,
    left: customMargin.left ?? 70,
  };

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, minWidth),
          height: Math.max(height, minHeight),
        });
      }
    });

    resizeObserver.observe(ref.current);

    // Initial measurement
    const { width, height } = ref.current.getBoundingClientRect();
    setDimensions({
      width: Math.max(width, minWidth),
      height: Math.max(height, minHeight),
    });

    return () => resizeObserver.disconnect();
  }, [minHeight, minWidth]);

  const boundedWidth = dimensions.width - margin.left - margin.right;
  const boundedHeight = dimensions.height - margin.top - margin.bottom;

  return {
    ref,
    width: dimensions.width,
    height: dimensions.height,
    margin,
    boundedWidth,
    boundedHeight,
  };
};

