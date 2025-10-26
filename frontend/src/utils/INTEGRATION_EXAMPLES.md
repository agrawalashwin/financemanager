# Logging System Integration Examples

## Real-World Examples for Your Application

### 1. TransactionForm Component

```typescript
import { useLogger } from '../hooks/useLogger';
import { useAsyncLogger } from '../hooks/useLogger';

function TransactionForm({ userId }) {
  const log = useLogger('TransactionForm');
  const asyncLog = useAsyncLogger('TransactionSubmit', 'TransactionForm');

  const handleSubmit = async (formData) => {
    try {
      // Log form submission
      log.logFormSubmit('AddTransaction', {
        ...formData,
        userId,
        timestamp: new Date().toISOString(),
      });

      // Start async operation
      asyncLog.logStart('Adding transaction');

      // Log API request
      log.logRequest('POST', '/api/transactions', formData);

      // Make API call
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Log response
      log.logResponse(response.status, { ok: response.ok });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Log completion
      asyncLog.logComplete('Adding transaction', {
        transactionId: data.id,
        amount: data.amount,
      });

      log.info('✅ Transaction added successfully', {
        id: data.id,
        amount: data.amount,
        category: data.category,
      });

      return data;
    } catch (error) {
      asyncLog.logError(error, 'Adding transaction');
      log.error('Failed to add transaction', error);
      throw error;
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleSubmit(Object.fromEntries(formData));
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### 2. API Service with Logging

```typescript
// services/transactionApi.ts
import { logger } from '../utils/logger';

export const transactionApi = {
  async fetchTransactions(userId: string) {
    const requestId = logger.generateRequestId();
    logger.startTimer('FetchTransactions');

    try {
      logger.logRequest('GET', `/api/transactions?userId=${userId}`);

      const response = await fetch(`/api/transactions?userId=${userId}`);
      logger.logResponse(response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const duration = logger.endTimer('FetchTransactions', 'TransactionAPI');

      logger.info('✅ Transactions fetched', {
        count: data.length,
        duration,
        requestId,
      }, 'TransactionAPI');

      return data;
    } catch (error) {
      logger.error('Failed to fetch transactions', error, 'TransactionAPI');
      throw error;
    }
  },

  async addTransaction(transaction: any) {
    const requestId = logger.generateRequestId();

    try {
      logger.logFormSubmit('AddTransaction', transaction);
      logger.logRequest('POST', '/api/transactions', transaction);

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      logger.logResponse(response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      logger.info('✅ Transaction created', {
        id: data.id,
        requestId,
      }, 'TransactionAPI');

      return data;
    } catch (error) {
      logger.error('Failed to add transaction', error, 'TransactionAPI');
      throw error;
    }
  },
};
```

### 3. State Management with Logging

```typescript
// store/transactionStore.ts
import { create } from 'zustand';
import { logger } from '../utils/logger';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  setTransactions: (transactions) => {
    const oldState = get().transactions;
    logger.logStateChange('TransactionStore', oldState, transactions, 'TransactionStore');
    set({ transactions });
  },

  addTransaction: (transaction) => {
    const oldTransactions = get().transactions;
    const newTransactions = [...oldTransactions, transaction];
    
    logger.debug('Adding transaction to store', {
      transactionId: transaction.id,
      count: newTransactions.length,
    }, 'TransactionStore');

    set({ transactions: newTransactions });
  },

  setLoading: (loading) => {
    logger.debug(`Loading state: ${loading}`, {}, 'TransactionStore');
    set({ loading });
  },

  setError: (error) => {
    if (error) {
      logger.error('Store error set', error, 'TransactionStore');
    } else {
      logger.debug('Store error cleared', {}, 'TransactionStore');
    }
    set({ error });
  },
}));
```

### 4. Custom Hook with Logging

```typescript
// hooks/useTransactionForm.ts
import { useState } from 'react';
import { useLogger, useAsyncLogger } from './useLogger';
import { transactionApi } from '../services/transactionApi';

export function useTransactionForm() {
  const log = useLogger('useTransactionForm');
  const asyncLog = useAsyncLogger('FormSubmit', 'useTransactionForm');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    log.debug(`Field changed: ${name}`, { name, value });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (data) => {
    log.debug('Validating form', { data });
    const newErrors = {};

    if (!data.amount) {
      newErrors.amount = 'Amount is required';
    }
    if (!data.category) {
      newErrors.category = 'Category is required';
    }

    if (Object.keys(newErrors).length > 0) {
      log.logFormValidation('TransactionForm', newErrors);
      setErrors(newErrors);
      return false;
    }

    log.debug('Form validation passed');
    return true;
  };

  const submit = async (data) => {
    if (!validate(data)) {
      return;
    }

    try {
      const result = await asyncLog.wrapAsync(
        () => transactionApi.addTransaction(data),
        'Adding transaction'
      );

      log.info('✅ Form submitted successfully', { id: result.id });
      setFormData({});
      setErrors({});
      return result;
    } catch (error) {
      log.error('Form submission failed', error);
      throw error;
    }
  };

  return {
    formData,
    errors,
    handleChange,
    submit,
  };
}
```

### 5. Component with Performance Monitoring

```typescript
// components/TransactionGrid.tsx
import { useEffect } from 'react';
import { useLogger } from '../hooks/useLogger';

function TransactionGrid({ transactions }) {
  const log = useLogger('TransactionGrid');

  useEffect(() => {
    log.startTimer('GridRender');

    return () => {
      const duration = log.endTimer('GridRender');
      log.debug('Grid render completed', {
        itemCount: transactions.length,
        duration,
      });
    };
  }, [transactions.length]);

  const handleRowClick = (transaction) => {
    log.debug('Row clicked', {
      transactionId: transaction.id,
      amount: transaction.amount,
      category: transaction.category,
    });
  };

  return (
    <div>
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          onClick={() => handleRowClick(transaction)}
        >
          {/* Row content */}
        </div>
      ))}
    </div>
  );
}
```

### 6. Error Boundary with Logging

```typescript
// components/ErrorBoundary.tsx
import { Component } from 'react';
import { logger } from '../utils/logger';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    logger.error('Error boundary caught error', error, 'ErrorBoundary');
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error boundary details', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    }, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => {
            logger.info('Error boundary reset');
            this.setState({ hasError: false });
          }}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Debugging Tips

### 1. View All Logs in Console
```javascript
// In browser console
__logger.getLogs()
```

### 2. Filter Logs by Module
```javascript
__logger.getLogs({ module: 'TransactionForm' })
```

### 3. Get Only Errors
```javascript
__logger.getLogs({ level: 'ERROR' })
```

### 4. Export Logs for Analysis
```javascript
const json = __logger.exportLogs();
console.save(json, 'logs.json');
```

### 5. Print Summary
```javascript
__logger.printSummary()
```

## Performance Considerations

- Logs are stored in localStorage (max 500 by default)
- Each log entry is ~200-500 bytes
- Total storage: ~100-250 KB
- Minimal performance impact
- Can be disabled in production if needed

## Production Recommendations

1. Set `minLogLevel` to `INFO` or `WARN`
2. Reduce `maxStoredLogs` to 100-200
3. Disable `enableGrouping` for better performance
4. Keep `enableStorage` enabled for debugging
5. Regularly export and clear logs

