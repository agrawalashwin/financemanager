import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color = 'primary',
  variant = 'elevated',
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    const colorMap = {
      primary: theme.palette.primary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTonalBackground = () => {
    const colorMap = {
      primary: '#F3EDF7',
      success: '#E6F4EA',
      warning: '#FEF7E0',
      error: '#FADBD8',
      info: '#E8F0FE',
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTrendColor = () => {
    if (!trend) return 'textSecondary';
    return trend === 'up' ? 'success.main' : 'error.main';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: variant === 'tonal' ? getTonalBackground() : 'background.paper',
        border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header with icon and title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="labelMedium"
            sx={{
              color: 'textSecondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: getTonalBackground(),
                color: getBackgroundColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
          )}
        </Box>

        {/* Main value */}
        <Typography
          variant="headlineMedium"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </Typography>

        {/* Subtitle and trend */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          {subtitle && (
            <Typography variant="bodySmall" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {trend && trendValue && (
            <Chip
              icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={trendValue}
              size="small"
              sx={{
                backgroundColor: trend === 'up' ? '#E6F4EA' : '#FADBD8',
                color: getTrendColor(),
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: getTrendColor(),
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;

