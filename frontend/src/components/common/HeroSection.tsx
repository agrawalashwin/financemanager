import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { tokens } from '../../theme/tokens';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
}

/**
 * Hero Section Component - Nestly Style
 * Large headline with supporting text and CTAs
 * Used on dashboard header and marketing pages
 */
export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, sm: 8, md: 10 },
        overflow: 'hidden',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': backgroundImage
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 1,
            }
          : undefined,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Subtitle */}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: tokens.brand.primary,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '32px', sm: '44px', md: '56px' },
              fontWeight: 800,
              letterSpacing: -0.8,
              lineHeight: 1.2,
              color: tokens.grey[900],
              maxWidth: '800px',
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          {description && (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                color: tokens.grey[600],
                maxWidth: '600px',
                lineHeight: 1.7,
              }}
            >
              {description}
            </Typography>
          )}

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              {primaryCTA && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={primaryCTA.onClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {primaryCTA.label}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={secondaryCTA.onClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {secondaryCTA.label}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default HeroSection;

