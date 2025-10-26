# Logging System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Application                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Components      │  │  Services        │  │  Hooks       │  │
│  │  - Forms         │  │  - API calls     │  │  - useLogger │  │
│  │  - Pages         │  │  - State mgmt    │  │  - useAsync  │  │
│  │  - Grids         │  │  - Utils         │  │  - useState  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                     │                    │           │
│           └─────────────────────┼────────────────────┘           │
│                                 │                                │
│                    ┌────────────▼────────────┐                  │
│                    │   Logger Singleton      │                  │
│                    │  (utils/logger.ts)      │                  │
│                    └────────────┬────────────┘                  │
│                                 │                                │
│         ┌───────────────────────┼───────────────────────┐       │
│         │                       │                       │       │
│    ┌────▼────┐          ┌──────▼──────┐        ┌──────▼──┐    │
│    │ Console │          │ LocalStorage│        │ Memory  │    │
│    │ Output  │          │ Persistence │        │ Buffer  │    │
│    └─────────┘          └─────────────┘        └─────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Debug Panel (components/common/DebugPanel.tsx)          │  │
│  │  - Real-time log viewer                                  │  │
│  │  - Filter & search                                       │  │
│  │  - Export functionality                                  │  │
│  │  - Keyboard shortcut: Ctrl+Shift+D                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── QueryClientProvider
├── ThemeProvider
├── NotificationProvider
│   ├── Router
│   │   ├── CommandPaletteProvider
│   │   │   └── AppShell
│   │   │       └── Routes
│   │   │           ├── Dashboard
│   │   │           ├── TransactionList
│   │   │           ├── TransactionForm
│   │   │           └── ...
│   │   └── DebugPanel ◄── NEW
│   └── DebugPanel ◄── NEW
```

## Data Flow

### 1. Component Logging Flow

```
Component
    │
    ├─► useLogger('ComponentName')
    │       │
    │       ├─► log.info(message, data)
    │       │       │
    │       └─► log.error(message, error)
    │
    └─► Logger.log()
            │
            ├─► Console Output
            │   └─► Browser DevTools
            │
            └─► LocalStorage
                └─► Debug Panel
```

### 2. API Request Flow

```
Component
    │
    ├─► log.logRequest(method, url, data)
    │       │
    │       └─► Logger.log(INFO, 'API', message, data)
    │
    ├─► fetch(url)
    │
    └─► log.logResponse(status, data)
            │
            └─► Logger.log(INFO, 'API', message, data)
```

### 3. Performance Timing Flow

```
Component
    │
    ├─► log.startTimer('operation')
    │       │
    │       └─► Store start time in Map
    │
    ├─► Perform operation
    │
    └─► log.endTimer('operation')
            │
            ├─► Calculate duration
            │
            └─► Logger.log(INFO, 'TIMER', message, { duration })
```

### 4. Form Submission Flow

```
Form Component
    │
    ├─► handleSubmit(formData)
    │       │
    │       ├─► log.logFormSubmit('FormName', formData)
    │       │
    │       ├─► Validate form
    │       │   └─► log.logFormValidation('FormName', errors)
    │       │
    │       ├─► API call
    │       │   ├─► log.logRequest(...)
    │       │   └─► log.logResponse(...)
    │       │
    │       └─► log.info('Success', { id, ... })
```

## File Structure

```
frontend/src/
├── utils/
│   ├── logger.ts                    ◄── Core Logger class
│   ├── LOGGING_GUIDE.md             ◄── Comprehensive guide
│   ├── INTEGRATION_EXAMPLES.md       ◄── Code examples
│   ├── QUICK_REFERENCE.md           ◄── Quick lookup
│   ├── LOGGING_SYSTEM_SUMMARY.md    ◄── Summary
│   └── ARCHITECTURE.md              ◄── This file
│
├── hooks/
│   └── useLogger.ts                 ◄── React hooks
│
├── components/
│   └── common/
│       └── DebugPanel.tsx           ◄── Debug UI
│
└── App.jsx                          ◄── Updated with DebugPanel
```

## Logger Class Structure

```
Logger
├── Properties
│   ├── config: LoggerConfig
│   ├── logs: LogEntry[]
│   ├── timers: Map<string, number>
│   └── requestId: string
│
├── Core Methods
│   ├── debug(message, data?, module?)
│   ├── info(message, data?, module?)
│   ├── warn(message, data?, module?)
│   └── error(message, error?, module?)
│
├── Specialized Methods
│   ├── logRequest(method, url, data?, module?)
│   ├── logResponse(status, data?, module?)
│   ├── logFormSubmit(formName, formData, module?)
│   ├── logFormValidation(formName, errors, module?)
│   └── logStateChange(storeName, oldState, newState, module?)
│
├── Performance Methods
│   ├── startTimer(label)
│   └── endTimer(label, module?)
│
├── Request Tracking
│   ├── generateRequestId()
│   ├── setRequestId(id)
│   └── getRequestId()
│
└── Management Methods
    ├── getLogs(filter?)
    ├── exportLogs()
    ├── exportLogsAsCSV()
    ├── clearLogs()
    └── printSummary()
```

## Log Entry Structure

```typescript
LogEntry {
  timestamp: string           // ISO 8601 timestamp
  level: LogLevel            // DEBUG | INFO | WARN | ERROR
  module: string             // Component/Service name
  message: string            // Log message
  data?: any                 // Additional data
  stackTrace?: string        // Error stack trace
  duration?: number          // Operation duration (ms)
  requestId?: string         // Request tracking ID
}
```

## Integration Points

### 1. React Components
```
Component
    ↓
useLogger('ComponentName')
    ↓
Logger.log()
    ↓
Console + LocalStorage
```

### 2. Services/Utils
```
Service
    ↓
logger.info/error/etc()
    ↓
Logger.log()
    ↓
Console + LocalStorage
```

### 3. State Management
```
Store
    ↓
logger.logStateChange()
    ↓
Logger.log()
    ↓
Console + LocalStorage
```

### 4. API Calls
```
API Service
    ↓
logger.logRequest()
logger.logResponse()
    ↓
Logger.log()
    ↓
Console + LocalStorage
```

## Storage Architecture

### LocalStorage
```
localStorage['app_logs']
    ↓
JSON Array of LogEntry objects
    ↓
Max 500 entries (~100-250 KB)
    ↓
Persists across page refreshes
```

### Memory
```
Logger.logs[]
    ↓
In-memory array
    ↓
Synced with localStorage
    ↓
Cleared on page refresh
```

## Debug Panel Architecture

```
DebugPanel Component
├── State
│   ├── isOpen: boolean
│   ├── logs: LogEntry[]
│   ├── filterLevel: LogLevel
│   ├── filterModule: string
│   └── expandedRows: Set<number>
│
├── Features
│   ├── Header
│   │   ├── Title with log count
│   │   ├── Print Summary button
│   │   ├── Export button
│   │   ├── Clear button
│   │   └── Close button
│   │
│   ├── Filters
│   │   ├── Level dropdown
│   │   └── Module search
│   │
│   ├── Table
│   │   ├── Time column
│   │   ├── Level column (with chip)
│   │   ├── Module column
│   │   ├── Message column
│   │   └── Expandable rows
│   │
│   └── Export Dialog
│       ├── JSON export
│       └── CSV export
│
└── Keyboard Shortcut
    └── Ctrl+Shift+D (Cmd+Shift+D on Mac)
```

## Configuration Flow

```
Logger Constructor
    ↓
Merge with DEFAULT_CONFIG
    ↓
Apply custom config
    ↓
Load logs from localStorage
    ↓
Ready to log
```

## Error Handling Flow

```
Error occurs
    ↓
catch (error)
    ↓
log.error(message, error)
    ↓
Extract stack trace
    ↓
Logger.log(ERROR, ...)
    ↓
Console + LocalStorage
    ↓
Debug Panel displays with red chip
```

## Performance Monitoring Flow

```
Operation starts
    ↓
log.startTimer('label')
    ↓
Store performance.now() in Map
    ↓
Operation completes
    ↓
log.endTimer('label')
    ↓
Calculate duration
    ↓
Logger.log(INFO, ..., { duration })
    ↓
Debug Panel shows duration
```

## Request Tracking Flow

```
Request starts
    ↓
generateRequestId()
    ↓
Create unique ID: REQ_timestamp_random
    ↓
Store in logger.requestId
    ↓
All subsequent logs include requestId
    ↓
Can filter by requestId in Debug Panel
```

## Lifecycle

```
App Initialization
    ↓
Logger singleton created
    ↓
Logs loaded from localStorage
    ↓
DebugPanel mounted
    ↓
Components use useLogger()
    ↓
Logs accumulated in memory + localStorage
    ↓
Debug Panel displays in real-time
    ↓
User can export/clear/filter
    ↓
Page refresh
    ↓
Logs persist from localStorage
```

## Security Considerations

```
Logging System
├── Client-side only
│   └── No server transmission
│
├── LocalStorage
│   └── Browser-specific
│
├── No sensitive data
│   ├── Avoid passwords
│   ├── Avoid tokens
│   └── Avoid PII
│
└── Export securely
    ├── Download locally
    └── Don't share publicly
```

## Scalability

```
Log Volume
├── 500 logs max (configurable)
├── ~200-500 bytes per log
├── Total: ~100-250 KB
│
└── Performance
    ├── Minimal memory impact
    ├── Negligible CPU usage
    └── No network overhead
```

