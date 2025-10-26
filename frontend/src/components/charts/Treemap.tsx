import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Box, useTheme, Typography, Breadcrumbs, Link } from '@mui/material';
import { nytimesColors } from '../../theme/nytimesColors';

interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
  color?: string;
}

interface TreemapProps {
  data: TreemapNode;
  title?: string;
  height?: number;
  onNodeClick?: (node: TreemapNode) => void;
}

export const Treemap: React.FC<TreemapProps> = ({
  data,
  title = 'Category Distribution',
  height = 400,
  onNodeClick,
}) => {
  const theme = useTheme();
  const [selectedNode, setSelectedNode] = useState<TreemapNode>(data);
  const [breadcrumbs, setBreadcrumbs] = useState<TreemapNode[]>([data]);

  const width = 800;

  const hierarchy = useMemo(() => {
    const root = d3.hierarchy(selectedNode).sum((d) => d.value || 0);
    return d3.treemap().size([width, height]).paddingTop(0).paddingRight(2).paddingBottom(2).paddingLeft(2)(root);
  }, [selectedNode, width, height]);

  const leaves = hierarchy.leaves();

  const handleNodeClick = (node: TreemapNode) => {
    if (node.children && node.children.length > 0) {
      setSelectedNode(node);
      setBreadcrumbs([...breadcrumbs, node]);
    }
    onNodeClick?.(node);
  };

  const handleBreadcrumbClick = (index: number) => {
    let current = data;
    for (let i = 1; i <= index; i++) {
      const next = breadcrumbs[i];
      if (next) {
        current = next;
      }
    }
    setSelectedNode(current);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setSelectedNode(newBreadcrumbs[newBreadcrumbs.length - 1]);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  // NY Times color palette for treemap
  const colorScale = d3.scaleOrdinal(nytimesColors.series);

  return (
    <Box>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs>
          {breadcrumbs.map((node, index) => (
            <Link
              key={index}
              onClick={() => handleBreadcrumbClick(index)}
              sx={{ cursor: 'pointer', color: 'primary.main' }}
            >
              {node.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      {/* Treemap */}
      <Box
        sx={{
          width: '100%',
          height,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {leaves.map((node, i) => {
            const x0 = node.x0 || 0;
            const y0 = node.y0 || 0;
            const x1 = node.x1 || 0;
            const y1 = node.y1 || 0;
            const nodeData = node.data as TreemapNode;
            const color = nodeData.color || colorScale(i.toString());

            return (
              <g
                key={`node-${i}`}
                onClick={() => handleNodeClick(nodeData)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={y1 - y0}
                  fill={color}
                  opacity={0.85}
                  stroke={nytimesColors.white}
                  strokeWidth={1.5}
                  rx={2}
                  style={{
                    transition: 'opacity 150ms ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as SVGRectElement).style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as SVGRectElement).style.opacity = '0.85';
                  }}
                />
                <text
                  x={(x0 + x1) / 2}
                  y={(y0 + y1) / 2}
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="12"
                  fontWeight="600"
                  fill={nytimesColors.white}
                  pointerEvents="none"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {nodeData.name}
                </text>
                {nodeData.value && (
                  <text
                    x={(x0 + x1) / 2}
                    y={(y0 + y1) / 2 + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill={nytimesColors.white}
                    opacity={0.95}
                    pointerEvents="none"
                    fontFamily="'Roboto Mono', monospace"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ${nodeData.value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {leaves.map((node, i) => {
          const nodeData = node.data as TreemapNode;
          const color = nodeData.color || colorScale(i.toString());
          return (
            <Box key={`legend-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '2px',
                  backgroundColor: color,
                }}
              />
              <Typography variant="bodySmall">{nodeData.name}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

