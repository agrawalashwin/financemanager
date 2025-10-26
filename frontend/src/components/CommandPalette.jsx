import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, useKBar, useRegisterActions } from 'kbar';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Keyboard as KeyboardIcon,
} from '@mui/icons-material';
import { MAIN_NAV_ITEMS, ACTION_ITEMS, HELP_ITEMS } from '../config/navigation';

const CommandPaletteContent = () => {
  const navigate = useNavigate();
  const { query } = useKBar();
  const [showHelp, setShowHelp] = useState(false);

  const actions = useMemo(() => {
    const navActions = MAIN_NAV_ITEMS.map(item => ({
      id: item.id,
      name: item.label,
      shortcut: item.shortcut ? [item.shortcut] : [],
      keywords: item.keywords || '',
      section: item.section,
      perform: () => navigate(item.path),
    }));

    const actionActions = ACTION_ITEMS.map(item => ({
      id: item.id,
      name: item.label,
      shortcut: item.shortcut ? [item.shortcut] : [],
      keywords: item.keywords || '',
      section: item.section,
      perform: () => navigate(item.path),
    }));

    const helpAction = {
      id: 'help',
      name: 'Keyboard Shortcuts',
      shortcut: ['?'],
      keywords: 'help shortcuts keyboard',
      section: 'Help',
      perform: () => setShowHelp(true),
    };

    return [...navActions, ...actionActions, helpAction];
  }, [navigate]);

  // Register actions with Kbar
  useRegisterActions(actions, [actions]);

  // Safely access query.results with fallback
  const results = query?.results || [];

  return (
    <>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={{ maxWidth: '100%' }}>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                maxWidth: 600,
                mx: 'auto',
                mt: 2,
              }}
            >
              {/* Search Input */}
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <KBarSearch
                  style={{
                    padding: '12px 16px',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    outline: 'none',
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                  }}
                  placeholder="Search commands..."
                />
              </Box>

              {/* Results */}
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {results.length > 0 ? (
                  <RenderResults results={results} />
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography color="text.secondary">
                      No commands found
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Footer */}
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Chip label="↵ Enter" size="small" variant="outlined" />
                  <Chip label="↑↓ Navigate" size="small" variant="outlined" />
                  <Chip label="ESC Close" size="small" variant="outlined" />
                </Stack>
              </Box>
            </Paper>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>

      {/* Help Dialog */}
      <HelpDialog open={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

const RenderResults = ({ results }) => {
  const { query } = useKBar();
  let currentSection = '';

  return (
    <List sx={{ p: 0 }}>
      {results.map((result) => {
        const showSection = result.section !== currentSection;
        currentSection = result.section;

        return (
          <Box key={result.id}>
            {showSection && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                }}
              >
                {result.section}
              </Typography>
            )}
            <ListItem
              button
              onClick={() => {
                result.perform();
                query.setSearch('');
              }}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={result.name}
                secondary={result.shortcut?.length > 0 ? result.shortcut.join(' ') : undefined}
              />
            </ListItem>
          </Box>
        );
      })}
    </List>
  );
};

const HelpDialog = ({ open, onClose }) => {
  const shortcuts = [
    { category: 'Navigation', items: [
      { key: 'D', action: 'Dashboard' },
      { key: 'T', action: 'Transactions' },
      { key: 'B', action: 'Budgets' },
      { key: 'R', action: 'Reports' },
      { key: 'S', action: 'Settings' },
    ]},
    { category: 'Actions', items: [
      { key: 'A', action: 'Add Transaction' },
      { key: 'I', action: 'Import CSV' },
    ]},
    { category: 'General', items: [
      { key: 'Cmd/Ctrl+K', action: 'Open Command Palette' },
      { key: '?', action: 'Show Help' },
      { key: 'ESC', action: 'Close Command Palette' },
    ]},
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <KeyboardIcon />
        Keyboard Shortcuts
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {shortcuts.map((group) => (
            <Box key={group.category} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {group.category}
              </Typography>
              <Stack spacing={1}>
                {group.items.map((item) => (
                  <Stack key={item.key} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{item.action}</Typography>
                    <Chip label={item.key} size="small" variant="outlined" />
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CommandPaletteProvider = ({ children }) => {
  return (
    <KBarProvider>
      {children}
      <CommandPaletteContent />
    </KBarProvider>
  );
};

export default CommandPaletteContent;

