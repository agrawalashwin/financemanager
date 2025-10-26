import { Box, Container, Typography, Stack, Grid, Button, Card, CardContent, Chip, TextField, Divider } from '@mui/material';
import { KPICard } from '../components/common/KPICard';
import { FAQAccordion } from '../components/common/FAQAccordion';
import { HeroSection } from '../components/common/HeroSection';
import { Sparkline } from '../components/charts/Sparkline';
import { tokens } from '../theme/tokens';
import { useNotification } from '../contexts/NotificationContext';

export default function ThemeShowcase() {
  const { success, error, warning, info } = useNotification();

  const mockSparklineData = [10, 15, 12, 18, 22, 20, 25, 23, 28, 26, 30, 28];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <HeroSection
        title="Nestly Design System"
        subtitle="Component Showcase"
        description="A comprehensive showcase of all Nestly-style components with the minimalist executive-grade aesthetic."
        primaryCTA={{
          label: 'Get Started',
          onClick: () => success('Welcome to the theme showcase!'),
        }}
        secondaryCTA={{
          label: 'Learn More',
          onClick: () => info('Explore all components below'),
        }}
      />

      <Divider sx={{ my: 6 }} />

      {/* KPI Cards Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          KPI Cards
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              label="Total Revenue"
              value="$45,230"
              delta={{ value: '+12.5%', isPositive: true }}
              tone="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              label="Total Expenses"
              value="$28,450"
              delta={{ value: '+5.2%', isPositive: false }}
              tone="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              label="Net Income"
              value="$16,780"
              delta={{ value: '+18.3%', isPositive: true }}
              tone="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              label="Budget Remaining"
              value="$8,920"
              delta={{ value: '-2.1%', isPositive: false }}
              tone="warning"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Buttons Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Buttons & Actions
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => success('Primary button clicked!')}>
            Primary
          </Button>
          <Button variant="outlined" onClick={() => info('Secondary button clicked!')}>
            Secondary
          </Button>
          <Button variant="text" onClick={() => warning('Tertiary button clicked!')}>
            Tertiary
          </Button>
          <Button variant="contained" color="error" onClick={() => error('Error action!')}>
            Destructive
          </Button>
          <Button variant="contained" disabled>
            Disabled
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Chips Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Chips & Tags
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label="Default" />
          <Chip label="Success" color="success" />
          <Chip label="Warning" color="warning" />
          <Chip label="Error" color="error" />
          <Chip label="Outlined" variant="outlined" />
          <Chip label="Deletable" onDelete={() => success('Chip deleted!')} />
        </Stack>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Form Inputs Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Form Inputs
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Text Input"
              placeholder="Enter text..."
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Input"
              type="email"
              placeholder="Enter email..."
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number Input"
              type="number"
              placeholder="Enter number..."
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Disabled Input"
              disabled
              placeholder="Disabled..."
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Sparkline Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Sparklines
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Revenue Trend
                </Typography>
                <Sparkline data={mockSparklineData} color={tokens.semantic.success} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Expense Trend
                </Typography>
                <Sparkline data={mockSparklineData.map(d => 35 - d)} color={tokens.semantic.error} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          FAQ Accordion
        </Typography>
        <FAQAccordion
          title="Frequently Asked Questions"
          items={[
            {
              question: 'What is the Nestly design system?',
              answer: 'Nestly is an executive-grade minimalist design system featuring low-noise UI, crisp typography, generous whitespace, and a monochrome base with a single accent color.',
            },
            {
              question: 'How do I use the design tokens?',
              answer: 'Import tokens from the theme/tokens.ts file and use them throughout your components. All values are token-driven for consistency and easy theming.',
            },
            {
              question: 'Can I customize the theme?',
              answer: 'Yes! The theme is fully customizable through the nestlyTheme.ts file. You can modify colors, spacing, typography, and component overrides.',
            },
            {
              question: 'What about dark mode?',
              answer: 'Dark mode is built into the theme with a complete color scheme. Use MUI\'s useColorScheme hook to toggle between light and dark modes.',
            },
          ]}
        />
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Color Palette Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Color Palette
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(tokens.grey).map(([key, value]) => (
            <Grid item xs={6} sm={4} md={2} key={key}>
              <Box
                sx={{
                  width: '100%',
                  height: 80,
                  backgroundColor: value,
                  borderRadius: tokens.radius.md,
                  border: `1px solid ${tokens.grey[200]}`,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  p: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {key}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Notification Examples */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
          Notifications
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Button variant="contained" color="success" onClick={() => success('Success notification!')}>
            Show Success
          </Button>
          <Button variant="contained" color="error" onClick={() => error('Error notification!')}>
            Show Error
          </Button>
          <Button variant="contained" color="warning" onClick={() => warning('Warning notification!')}>
            Show Warning
          </Button>
          <Button variant="contained" color="info" onClick={() => info('Info notification!')}>
            Show Info
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

