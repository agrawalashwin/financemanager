import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CSVImport = ({ onImportComplete }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [preview, setPreview] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (csvFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
      
      setPreview(data.slice(0, 5)); // Show first 5 rows
    };
    reader.readAsText(csvFile);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          try {
            await axios.post(`${API_URL}/transactions`, {
              userId: user?.id,
              type: row.type || 'expense',
              category: row.category || 'personal',
              subcategory: row.subcategory || '',
              vendor: row.vendor || row.source || '',
              amount: parseFloat(row.amount) || 0,
              frequency: row.frequency || 'monthly',
              startDate: row.startdate || row.start_date || new Date().toISOString().split('T')[0],
              endDate: row.enddate || row.end_date || '',
              description: row.description || '',
              budgetName: row.budget || row.budget_name || '',
            });
            successCount++;
          } catch (error) {
            console.error('Error importing row:', error);
            errorCount++;
          }
        }

        setMessage(`Import complete! ${successCount} transactions imported, ${errorCount} failed.`);
        setMessageType(successCount > 0 ? 'success' : 'error');
        setFile(null);
        setPreview([]);
        
        if (successCount > 0) {
          setTimeout(() => {
            onImportComplete();
          }, 1500);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setMessage('Error importing file: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        📥 Import Transactions from CSV
      </Typography>

      {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          CSV Format: type, category, vendor, amount, frequency, startDate, endDate, description
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Frequency options: one-time, daily, weekly, biweekly, monthly, quarterly, annual
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Example: expense, personal, Rent, 1500, monthly, 2024-10-24, , Monthly rent payment
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Choose CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        
        {file && (
          <Typography variant="body2">
            Selected: {file.name}
          </Typography>
        )}
      </Box>

      {preview.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenPreview(true)}
            sx={{ mb: 2 }}
          >
            Preview ({preview.length} rows)
          </Button>
        </Box>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Button
        variant="contained"
        color="success"
        onClick={handleImport}
        disabled={!file || loading}
        fullWidth
      >
        {loading ? 'Importing...' : 'Import Transactions'}
      </Button>

      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>CSV Preview</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  {preview.length > 0 && Object.keys(preview[0]).map(key => (
                    <TableCell key={key}><strong>{key}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.map((row, idx) => (
                  <TableRow key={idx}>
                    {Object.values(row).map((val, i) => (
                      <TableCell key={i}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CSVImport;

