/**
 * Comprehensive Logging System
 * Provides detailed, structured logging for debugging and monitoring
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - Automatic stack traces for errors
 * - Performance timing
 * - Request/Response logging
 * - Local storage persistence
 * - Console grouping for better readability
 * - Timestamp and context information
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  stackTrace?: string;
  duration?: number;
  requestId?: string;
}

export interface LoggerConfig {
  enableConsole: boolean;
  enableStorage: boolean;
  maxStoredLogs: number;
  minLogLevel: LogLevel;
  enableGrouping: boolean;
  enableTimestamps: boolean;
}

const LOG_STORAGE_KEY = 'app_logs';
const DEFAULT_CONFIG: LoggerConfig = {
  enableConsole: true,
  enableStorage: true,
  maxStoredLogs: 500,
  minLogLevel: LogLevel.DEBUG,
  enableGrouping: true,
  enableTimestamps: true,
};

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private timers: Map<string, number> = new Map();
  private requestId: string = '';

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadLogsFromStorage();
  }

  /**
   * Generate a unique request ID for tracking related logs
   */
  generateRequestId(): string {
    this.requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return this.requestId;
  }

  /**
   * Set the current request ID
   */
  setRequestId(id: string): void {
    this.requestId = id;
  }

  /**
   * Get the current request ID
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * Start a performance timer
   */
  startTimer(label: string): void {
    this.timers.set(label, performance.now());
    this.debug(`Timer started: ${label}`);
  }

  /**
   * End a performance timer and log the duration
   */
  endTimer(label: string, module: string = 'TIMER'): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      this.warn(`Timer "${label}" not found`, { module });
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);
    this.info(`⏱️ ${label}: ${duration.toFixed(2)}ms`, { module, duration });
    return duration;
  }

  /**
   * Log at DEBUG level
   */
  debug(message: string, data?: any, module: string = 'APP'): void {
    this.log(LogLevel.DEBUG, module, message, data);
  }

  /**
   * Log at INFO level
   */
  info(message: string, data?: any, module: string = 'APP'): void {
    this.log(LogLevel.INFO, module, message, data);
  }

  /**
   * Log at WARN level
   */
  warn(message: string, data?: any, module: string = 'APP'): void {
    this.log(LogLevel.WARN, module, message, data);
  }

  /**
   * Log at ERROR level with automatic stack trace
   */
  error(message: string, error?: Error | any, module: string = 'APP'): void {
    const stackTrace = error instanceof Error ? error.stack : undefined;
    const errorData = error instanceof Error ? { message: error.message } : error;
    this.log(LogLevel.ERROR, module, message, errorData, stackTrace);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any, module: string = 'API'): void {
    const requestId = this.generateRequestId();
    this.info(
      `📤 ${method} ${url}`,
      { requestId, method, url, payload: data },
      module
    );
  }

  /**
   * Log API response
   */
  logResponse(status: number, data?: any, module: string = 'API'): void {
    const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌';
    this.info(
      `📥 Response ${status}`,
      { requestId: this.requestId, status, response: data },
      module
    );
  }

  /**
   * Log form submission
   */
  logFormSubmit(formName: string, formData: any, module: string = 'FORM'): void {
    this.info(
      `📝 Form submitted: ${formName}`,
      { formName, data: formData },
      module
    );
  }

  /**
   * Log form validation
   */
  logFormValidation(formName: string, errors: any, module: string = 'FORM'): void {
    this.warn(
      `⚠️ Form validation failed: ${formName}`,
      { formName, errors },
      module
    );
  }

  /**
   * Log state changes
   */
  logStateChange(storeName: string, oldState: any, newState: any, module: string = 'STATE'): void {
    this.debug(
      `🔄 State changed: ${storeName}`,
      { storeName, oldState, newState },
      module
    );
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    module: string,
    message: string,
    data?: any,
    stackTrace?: string
  ): void {
    // Check if log level should be logged
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.config.minLogLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const entry: LogEntry = {
      timestamp,
      level,
      module,
      message,
      data,
      stackTrace,
      requestId: this.requestId,
    };

    // Store log
    if (this.config.enableStorage) {
      this.addLogToStorage(entry);
    }

    // Console output
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(entry: LogEntry): void {
    const { timestamp, level, module, message, data, stackTrace } = entry;
    const timeStr = this.config.enableTimestamps ? `[${timestamp}]` : '';
    const prefix = `${timeStr} [${level}] [${module}]`;
    const color = this.getLevelColor(level);

    if (this.config.enableGrouping && (data || stackTrace)) {
      console.group(`%c${prefix} ${message}`, `color: ${color}; font-weight: bold;`);
      if (data) {
        console.log('📊 Data:', data);
      }
      if (stackTrace) {
        console.log('📍 Stack:', stackTrace);
      }
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${message}`, `color: ${color}; font-weight: bold;`, data || '');
    }
  }

  /**
   * Get color for log level
   */
  private getLevelColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '#888888',
      [LogLevel.INFO]: '#0066cc',
      [LogLevel.WARN]: '#ff9900',
      [LogLevel.ERROR]: '#cc0000',
    };
    return colors[level];
  }

  /**
   * Add log to local storage
   */
  private addLogToStorage(entry: LogEntry): void {
    try {
      this.logs.push(entry);
      if (this.logs.length > this.config.maxStoredLogs) {
        this.logs.shift();
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to store log:', e);
    }
  }

  /**
   * Load logs from local storage
   */
  private loadLogsFromStorage(): void {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      this.logs = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load logs from storage:', e);
      this.logs = [];
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(filter?: { level?: LogLevel; module?: string; limit?: number }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.module) {
      filtered = filtered.filter(log => log.module === filter.module);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportLogsAsCSV(): string {
    const headers = ['Timestamp', 'Level', 'Module', 'Message', 'Data', 'RequestId'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.module,
      log.message,
      JSON.stringify(log.data || ''),
      log.requestId || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(LOG_STORAGE_KEY);
    this.info('📋 All logs cleared');
  }

  /**
   * Print logs summary to console
   */
  printSummary(): void {
    const summary = {
      totalLogs: this.logs.length,
      byLevel: {
        DEBUG: this.logs.filter(l => l.level === LogLevel.DEBUG).length,
        INFO: this.logs.filter(l => l.level === LogLevel.INFO).length,
        WARN: this.logs.filter(l => l.level === LogLevel.WARN).length,
        ERROR: this.logs.filter(l => l.level === LogLevel.ERROR).length,
      },
      byModule: this.logs.reduce((acc, log) => {
        acc[log.module] = (acc[log.module] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    console.group('%c📊 LOG SUMMARY', 'color: #0066cc; font-weight: bold; font-size: 14px;');
    console.table(summary);
    console.groupEnd();
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for use in window for debugging
if (typeof window !== 'undefined') {
  (window as any).__logger = logger;
}

