# Logging System - Quick Reference

## 🚀 Quick Start

### In React Components
```typescript
import { useLogger } from '../hooks/useLogger';

function MyComponent() {
  const log = useLogger('MyComponent');
  
  log.info('Message', { data: 'value' });
  log.error('Error occurred', error);
}
```

### In Services/Utils
```typescript
import { logger } from '../utils/logger';

logger.info('Message', { data: 'value' }, 'MODULE_NAME');
logger.error('Error occurred', error, 'MODULE_NAME');
```

## 📊 Log Levels

| Level | Usage | Color |
|-------|-------|-------|
| **DEBUG** | Detailed debugging info | Gray |
| **INFO** | General information | Blue |
| **WARN** | Warnings/potential issues | Orange |
| **ERROR** | Errors with stack traces | Red |

## 🎯 Common Patterns

### Form Submission
```typescript
log.logFormSubmit('FormName', formData);
log.logFormValidation('FormName', errors);
```

### API Calls
```typescript
log.logRequest('POST', '/api/endpoint', data);
log.logResponse(200, responseData);
```

### Performance Timing
```typescript
log.startTimer('operation');
// ... do work ...
log.endTimer('operation');
```

### State Changes
```typescript
log.logStateChange('StoreName', oldState, newState);
```

### Async Operations
```typescript
const asyncLog = useAsyncLogger('Operation', 'Component');
await asyncLog.wrapAsync(() => fetchData(), 'Fetching');
```

## 🔍 Debug Panel

**Keyboard Shortcut:** `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)

**Features:**
- Filter by level and module
- Expand rows to see details
- Export as JSON/CSV
- View log summary
- Clear all logs

## 💾 Browser Console

```javascript
// View all logs
__logger.getLogs()

// Filter by level
__logger.getLogs({ level: 'ERROR' })

// Filter by module
__logger.getLogs({ module: 'API' })

// Get last N logs
__logger.getLogs({ limit: 50 })

// Print summary
__logger.printSummary()

// Export
__logger.exportLogs()
__logger.exportLogsAsCSV()

// Clear
__logger.clearLogs()
```

## 📝 Method Reference

### Basic Logging
```typescript
log.debug(message, data?, module?)
log.info(message, data?, module?)
log.warn(message, data?, module?)
log.error(message, error?, module?)
```

### Specialized Logging
```typescript
log.logRequest(method, url, data?, module?)
log.logResponse(status, data?, module?)
log.logFormSubmit(formName, formData, module?)
log.logFormValidation(formName, errors, module?)
log.logStateChange(storeName, oldState, newState, module?)
```

### Performance
```typescript
log.startTimer(label)
log.endTimer(label, module?)
```

### Request Tracking
```typescript
log.generateRequestId()
log.setRequestId(id)
log.getRequestId()
```

### Log Management
```typescript
log.getLogs(filter?)
log.exportLogs()
log.exportLogsAsCSV()
log.clearLogs()
log.printSummary()
```

## 🎨 Log Entry Structure

```typescript
{
  timestamp: "2024-01-15T10:30:45.123Z",
  level: "INFO",
  module: "TransactionForm",
  message: "Transaction added",
  data: { id: 123, amount: 1000 },
  stackTrace?: "Error: ...",
  duration?: 245,
  requestId?: "REQ_1234567890_abc123"
}
```

## ⚡ Performance Tips

1. **Use appropriate log levels** - DEBUG for development, INFO/WARN for production
2. **Include relevant data** - Makes debugging easier
3. **Use request IDs** - Track related operations
4. **Monitor timers** - Identify performance bottlenecks
5. **Export regularly** - Keep localStorage clean

## 🔧 Configuration

```typescript
import { Logger } from '../utils/logger';

const customLogger = new Logger({
  enableConsole: true,        // Log to console
  enableStorage: true,        // Store in localStorage
  maxStoredLogs: 500,         // Max logs to keep
  minLogLevel: 'DEBUG',       // Minimum level
  enableGrouping: true,       // Group in console
  enableTimestamps: true,     // Show timestamps
});
```

## 📚 Documentation Files

- **LOGGING_GUIDE.md** - Comprehensive guide with examples
- **INTEGRATION_EXAMPLES.md** - Real-world integration examples
- **QUICK_REFERENCE.md** - This file

## 🐛 Debugging Workflow

1. **Open Debug Panel** - `Ctrl+Shift+D`
2. **Filter by module** - Find relevant logs
3. **Expand rows** - See detailed data
4. **Check stack traces** - For errors
5. **Export logs** - For further analysis
6. **Use browser console** - `__logger.getLogs()`

## 💡 Best Practices

✅ **DO:**
- Use descriptive module names
- Include relevant data in logs
- Log API requests and responses
- Track request IDs for correlation
- Use timers for performance monitoring
- Log form submissions and validations

❌ **DON'T:**
- Log sensitive data (passwords, tokens)
- Log too much data per entry
- Use ERROR level for warnings
- Forget to handle errors
- Leave debug logs in production code

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Logs not appearing | Check `enableStorage` and localStorage quota |
| Console too verbose | Set `minLogLevel` to INFO or WARN |
| Performance slow | Disable `enableGrouping` or reduce `maxStoredLogs` |
| Storage full | Export and clear logs regularly |

## 📞 Support

For issues or questions:
1. Check LOGGING_GUIDE.md for detailed documentation
2. Review INTEGRATION_EXAMPLES.md for code examples
3. Use Debug Panel to inspect logs
4. Export logs for analysis

