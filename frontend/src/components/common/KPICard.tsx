import { Card, CardContent, Stack, Typography, Box, keyframes } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { tokens } from '../../theme/tokens';

// Animation for delta value changes
const deltaSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface KPICardProps {
  label: string;
  value: string;
  delta?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'compact';
}

/**
 * KPI Card Component - Nestly Style
 * Displays a metric with optional trend indicator
 */
export function KPICard({
  label,
  value,
  delta,
  icon,
  tone = 'neutral',
  variant = 'default',
}: KPICardProps) {
  const isCompact = variant === 'compact';
  const toneColor = {
    neutral: tokens.grey[600],
    success: tokens.semantic.success,
    warning: tokens.semantic.warning,
    error: tokens.semantic.error,
    info: tokens.brand.primary,
  }[tone];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: tokens.radius.lg,
        transition: `all ${tokens.motion.micro}`,
        '&:hover': {
          boxShadow: tokens.shadow[2],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: isCompact ? 2 : 3 }}>
        <Stack spacing={isCompact ? 1 : 1.5}>
          {/* Header with icon and label */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography
              variant={isCompact ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {label}
            </Typography>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isCompact ? 32 : 40,
                  height: isCompact ? 32 : 40,
                  borderRadius: tokens.radius.sm,
                  backgroundColor: `${toneColor}14`,
                  color: toneColor,
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>

          {/* Value */}
          <Typography
            variant={isCompact ? 'h6' : 'h4'}
            sx={{
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              color: tokens.grey[900],
            }}
          >
            {value}
          </Typography>

          {/* Delta with animation */}
          {delta && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                animation: `${deltaSlideIn} ${tokens.motion.micro}`,
              }}
            >
              {delta.isPositive ? (
                <TrendingUpIcon
                  sx={{
                    fontSize: isCompact ? 16 : 18,
                    color: tokens.semantic.success,
                    transition: `transform ${tokens.motion.micro}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              ) : (
                <TrendingDownIcon
                  sx={{
                    fontSize: isCompact ? 16 : 18,
                    color: tokens.semantic.error,
                    transition: `transform ${tokens.motion.micro}`,
                    '&:hover': {
                      transform: 'translateY(2px)',
                    },
                  }}
                />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontVariantNumeric: 'tabular-nums',
                  color: delta.isPositive ? tokens.semantic.success : tokens.semantic.error,
                  fontWeight: 600,
                  transition: `color ${tokens.motion.micro}`,
                }}
              >
                {delta.isPositive ? '+' : ''}{delta.value}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default KPICard;

