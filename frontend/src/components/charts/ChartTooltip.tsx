import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface TooltipData {
  label: string;
  value: string | number;
  color?: string;
}

interface ChartTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  data: TooltipData[];
  title?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  visible,
  x,
  y,
  data,
  title,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'none',
        zIndex: 1000,
        p: 1.5,
        minWidth: 200,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        boxShadow: theme.shadows[8],
      }}
    >
      {title && (
        <Typography variant="labelMedium" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      {data.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mb: idx < data.length - 1 ? 0.5 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.color && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
            )}
            <Typography variant="bodySmall" color="textSecondary">
              {item.label}
            </Typography>
          </Box>
          <Typography variant="bodySmall" sx={{ fontWeight: 600 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

