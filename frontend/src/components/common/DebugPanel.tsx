/**
 * Debug Panel Component
 * Displays logs in a collapsible panel for easy debugging
 * Access via keyboard shortcut: Ctrl+Shift+D (or Cmd+Shift+D on Mac)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { logger, LogLevel, LogEntry } from '../../utils/logger';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | ''>('');
  const [filterModule, setFilterModule] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Keyboard shortcut to open debug panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Refresh logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const filteredLogs = logger.getLogs({
        level: filterLevel || undefined,
        module: filterModule || undefined,
        limit: 100,
      });
      setLogs(filteredLogs);
    }, 500);

    return () => clearInterval(interval);
  }, [filterLevel, filterModule]);

  const toggleRowExpand = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const handleExportJSON = () => {
    const json = logger.exportLogs();
    downloadFile(json, 'logs.json', 'application/json');
    setShowExportDialog(false);
  };

  const handleExportCSV = () => {
    const csv = logger.exportLogsAsCSV();
    downloadFile(csv, 'logs.csv', 'text/csv');
    setShowExportDialog(false);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: LogLevel): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'default';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARN:
        return 'warning';
      case LogLevel.ERROR:
        return 'error';
      default:
        return 'default';
    }
  };

  if (!isOpen) {
    return (
      <Tooltip title="Open Debug Panel (Ctrl+Shift+D)">
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            borderRadius: '50%',
            width: 56,
            height: 56,
            zIndex: 9999,
            backgroundColor: '#0066cc',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0052a3',
            },
          }}
        >
          🐛
        </Button>
      </Tooltip>
    );
  }

  return (
    <>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: '90vw',
          maxWidth: 1000,
          maxHeight: '80vh',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            🐛 Debug Panel ({logs.length} logs)
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Print Summary">
              <IconButton
                size="small"
                onClick={() => logger.printSummary()}
              >
                📊
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Logs">
              <IconButton
                size="small"
                onClick={() => setShowExportDialog(true)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Logs">
              <IconButton
                size="small"
                onClick={() => {
                  logger.clearLogs();
                  setLogs([]);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Filters */}
        <Box sx={{ padding: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={filterLevel}
                label="Level"
                onChange={(e) => setFilterLevel(e.target.value as LogLevel | '')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={LogLevel.DEBUG}>DEBUG</MenuItem>
                <MenuItem value={LogLevel.INFO}>INFO</MenuItem>
                <MenuItem value={LogLevel.WARN}>WARN</MenuItem>
                <MenuItem value={LogLevel.ERROR}>ERROR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Module"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              placeholder="Filter by module"
            />
          </Stack>
        </Box>

        {/* Logs Table */}
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ width: 150 }}>Time</TableCell>
                <TableCell sx={{ width: 80 }}>Level</TableCell>
                <TableCell sx={{ width: 100 }}>Module</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    hover
                    onClick={() => toggleRowExpand(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      {(log.data || log.stackTrace) && (
                        <IconButton size="small">
                          {expandedRows.has(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.level}
                        size="small"
                        color={getLevelColor(log.level)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{log.module}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{log.message}</TableCell>
                  </TableRow>
                  {expandedRows.has(index) && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ backgroundColor: '#fafafa', padding: 2 }}>
                        <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {log.data && (
                            <Box sx={{ marginBottom: 1 }}>
                              <strong>Data:</strong>
                              <pre style={{ margin: 0, overflow: 'auto', maxHeight: 200 }}>
                                {JSON.stringify(log.data, null, 2)}
                              </pre>
                            </Box>
                          )}
                          {log.stackTrace && (
                            <Box>
                              <strong>Stack Trace:</strong>
                              <pre style={{ margin: 0, overflow: 'auto', maxHeight: 200, color: '#cc0000' }}>
                                {log.stackTrace}
                              </pre>
                            </Box>
                          )}
                          {log.requestId && (
                            <Box sx={{ marginTop: 1, color: '#666' }}>
                              <strong>Request ID:</strong> {log.requestId}
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
        <DialogTitle>Export Logs</DialogTitle>
        <DialogContent>
          <Typography>Choose export format:</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportJSON} variant="contained">
            Export as JSON
          </Button>
          <Button onClick={handleExportCSV} variant="contained">
            Export as CSV
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

