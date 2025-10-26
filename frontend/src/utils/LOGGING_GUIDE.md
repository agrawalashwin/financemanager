# Comprehensive Logging System Guide

## Overview

This logging system provides detailed, structured logging for debugging and monitoring your application. It includes:

- **Multiple log levels** (DEBUG, INFO, WARN, ERROR)
- **Automatic stack traces** for errors
- **Performance timing** for operations
- **Request/Response logging** for API calls
- **Local storage persistence** for log history
- **Console grouping** for better readability
- **Debug panel UI** for viewing logs in the browser
- **Export functionality** (JSON/CSV)

## Quick Start

### 1. Basic Logging in Components

```typescript
import { useLogger } from '../hooks/useLogger';

function MyComponent() {
  const log = useLogger('MyComponent');

  useEffect(() => {
    log.info('Component initialized');
    log.debug('Debug info', { userId: 123 });
  }, []);

  return <div>...</div>;
}
```

### 2. Logging in Non-React Code

```typescript
import { logger } from '../utils/logger';

logger.info('Application started');
logger.debug('Debug message', { data: 'value' }, 'MODULE_NAME');
logger.warn('Warning message', { issue: 'something' }, 'MODULE_NAME');
logger.error('Error occurred', error, 'MODULE_NAME');
```

### 3. Open Debug Panel

Press **Ctrl+Shift+D** (or **Cmd+Shift+D** on Mac) to open the debug panel.

## API Reference

### Logger Methods

#### Basic Logging

```typescript
logger.debug(message: string, data?: any, module?: string)
logger.info(message: string, data?: any, module?: string)
logger.warn(message: string, data?: any, module?: string)
logger.error(message: string, error?: Error | any, module?: string)
```

#### API Logging

```typescript
logger.logRequest(method: string, url: string, data?: any, module?: string)
logger.logResponse(status: number, data?: any, module?: string)
```

#### Form Logging

```typescript
logger.logFormSubmit(formName: string, formData: any, module?: string)
logger.logFormValidation(formName: string, errors: any, module?: string)
```

#### Performance Timing

```typescript
logger.startTimer(label: string)
logger.endTimer(label: string, module?: string): number
```

#### Request Tracking

```typescript
logger.generateRequestId(): string
logger.setRequestId(id: string)
logger.getRequestId(): string
```

#### Log Management

```typescript
logger.getLogs(filter?: { level?: LogLevel; module?: string; limit?: number }): LogEntry[]
logger.exportLogs(): string  // JSON
logger.exportLogsAsCSV(): string
logger.clearLogs()
logger.printSummary()
```

### useLogger Hook

```typescript
const log = useLogger('ComponentName');

log.debug(message, data)
log.info(message, data)
log.warn(message, data)
log.error(message, error)
log.logFormSubmit(formName, formData)
log.logFormValidation(formName, errors)
log.logRequest(method, url, data)
log.logResponse(status, data)
log.startTimer(label)
log.endTimer(label)
log.generateRequestId()
log.getRequestId()
```

### useStateLogger Hook

```typescript
const state = useSelector(state => state.user);
useStateLogger('UserStore', state);
```

### useAsyncLogger Hook

```typescript
const asyncLog = useAsyncLogger('FetchUsers', 'UserService');

// Wrap async function
const users = await asyncLog.wrapAsync(
  () => fetchUsers(),
  'Fetching users'
);

// Or manual logging
asyncLog.logStart('Fetching users');
try {
  const users = await fetchUsers();
  asyncLog.logComplete('Fetching users', { count: users.length });
} catch (error) {
  asyncLog.logError(error, 'Fetching users');
}
```

## Usage Examples

### Example 1: Form Submission

```typescript
function TransactionForm() {
  const log = useLogger('TransactionForm');

  const handleSubmit = async (formData) => {
    log.logFormSubmit('AddTransaction', formData);

    try {
      log.logRequest('POST', '/api/transactions', formData);
      const response = await api.post('/api/transactions', formData);
      log.logResponse(response.status, response.data);
      log.info('✅ Transaction added successfully', { id: response.data.id });
    } catch (error) {
      log.error('Failed to add transaction', error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 2: Performance Monitoring

```typescript
function DataGrid() {
  const log = useLogger('DataGrid');

  useEffect(() => {
    log.startTimer('DataLoad');
    
    fetchData().then(data => {
      const duration = log.endTimer('DataLoad');
      log.info('Data loaded', { count: data.length, duration });
    });
  }, []);

  return <div>...</div>;
}
```

### Example 3: API Service

```typescript
// services/api.ts
import { logger } from '../utils/logger';

export const api = {
  async get(url: string) {
    const requestId = logger.generateRequestId();
    logger.logRequest('GET', url);

    try {
      const response = await fetch(url);
      logger.logResponse(response.status);
      return response.json();
    } catch (error) {
      logger.error('API request failed', error, 'API');
      throw error;
    }
  }
};
```

### Example 4: State Management

```typescript
// store/userStore.ts
import { create } from 'zustand';
import { logger } from '../utils/logger';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => {
    logger.logStateChange('UserStore', null, user, 'UserStore');
    set({ user });
  }
}));
```

## Debug Panel Features

### Keyboard Shortcut
- **Ctrl+Shift+D** (Windows/Linux)
- **Cmd+Shift+D** (Mac)

### Features
- **Filter by Level**: DEBUG, INFO, WARN, ERROR
- **Filter by Module**: Search by module name
- **Expand Details**: Click rows to see full data and stack traces
- **Print Summary**: View log statistics
- **Export Logs**: Download as JSON or CSV
- **Clear Logs**: Remove all stored logs

## Configuration

```typescript
import { logger } from '../utils/logger';

// Customize logger configuration
const customLogger = new Logger({
  enableConsole: true,      // Log to console
  enableStorage: true,      // Store in localStorage
  maxStoredLogs: 500,       // Maximum logs to keep
  minLogLevel: LogLevel.DEBUG,  // Minimum level to log
  enableGrouping: true,     // Group related logs
  enableTimestamps: true,   // Show timestamps
});
```

## Best Practices

1. **Use Descriptive Module Names**: Makes filtering easier
   ```typescript
   logger.info('User logged in', { userId: 123 }, 'AUTH');
   ```

2. **Include Relevant Data**: Helps with debugging
   ```typescript
   logger.debug('Processing transaction', { id, amount, type }, 'TRANSACTION');
   ```

3. **Use Appropriate Levels**:
   - **DEBUG**: Detailed information for debugging
   - **INFO**: General informational messages
   - **WARN**: Warning messages for potential issues
   - **ERROR**: Error messages with stack traces

4. **Log API Calls**: Track all network requests
   ```typescript
   logger.logRequest('POST', '/api/users', userData);
   logger.logResponse(200, responseData);
   ```

5. **Track Request IDs**: For correlating related logs
   ```typescript
   const requestId = logger.generateRequestId();
   // All subsequent logs will include this requestId
   ```

6. **Use Timers for Performance**: Monitor operation duration
   ```typescript
   logger.startTimer('DataFetch');
   // ... do work ...
   logger.endTimer('DataFetch');
   ```

## Accessing Logs Programmatically

```typescript
// Get all logs
const allLogs = logger.getLogs();

// Get only errors
const errors = logger.getLogs({ level: LogLevel.ERROR });

// Get logs from specific module
const apiLogs = logger.getLogs({ module: 'API' });

// Get last 50 logs
const recent = logger.getLogs({ limit: 50 });

// Export for analysis
const json = logger.exportLogs();
const csv = logger.exportLogsAsCSV();
```

## Browser Console Access

The logger is available globally in the browser console:

```javascript
// In browser console
__logger.getLogs()
__logger.printSummary()
__logger.exportLogs()
__logger.clearLogs()
```

## Troubleshooting

### Logs not appearing in Debug Panel
- Check if `enableStorage` is true in logger config
- Check browser's localStorage quota
- Try clearing logs and refreshing

### Performance impact
- Reduce `maxStoredLogs` if needed
- Set `minLogLevel` to INFO or WARN in production
- Disable `enableGrouping` if console is slow

### Storage quota exceeded
- Export and clear logs regularly
- Reduce `maxStoredLogs` value
- Check other apps using localStorage

