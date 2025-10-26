/**
 * React Hook for Logger Integration
 * Provides easy access to logging functionality in React components
 */

import { useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook for logging in React components
 * Automatically logs component mount/unmount and provides logging utilities
 */
export function useLogger(componentName: string) {
  const componentRef = useRef(componentName);

  useEffect(() => {
    logger.debug(`🚀 Component mounted`, { componentName }, componentName);

    return () => {
      logger.debug(`🛑 Component unmounted`, { componentName }, componentName);
    };
  }, []);

  return {
    /**
     * Log debug message
     */
    debug: (message: string, data?: any) => {
      logger.debug(message, data, componentName);
    },

    /**
     * Log info message
     */
    info: (message: string, data?: any) => {
      logger.info(message, data, componentName);
    },

    /**
     * Log warning message
     */
    warn: (message: string, data?: any) => {
      logger.warn(message, data, componentName);
    },

    /**
     * Log error message
     */
    error: (message: string, error?: Error | any) => {
      logger.error(message, error, componentName);
    },

    /**
     * Log form submission
     */
    logFormSubmit: (formName: string, formData: any) => {
      logger.logFormSubmit(formName, formData, componentName);
    },

    /**
     * Log form validation errors
     */
    logFormValidation: (formName: string, errors: any) => {
      logger.logFormValidation(formName, errors, componentName);
    },

    /**
     * Log API request
     */
    logRequest: (method: string, url: string, data?: any) => {
      logger.logRequest(method, url, data, componentName);
    },

    /**
     * Log API response
     */
    logResponse: (status: number, data?: any) => {
      logger.logResponse(status, data, componentName);
    },

    /**
     * Start a performance timer
     */
    startTimer: (label: string) => {
      logger.startTimer(`${componentName}:${label}`);
    },

    /**
     * End a performance timer
     */
    endTimer: (label: string) => {
      return logger.endTimer(`${componentName}:${label}`, componentName);
    },

    /**
     * Generate a request ID for tracking
     */
    generateRequestId: () => {
      return logger.generateRequestId();
    },

    /**
     * Get the current request ID
     */
    getRequestId: () => {
      return logger.getRequestId();
    },
  };
}

/**
 * Hook for logging state changes
 */
export function useStateLogger(storeName: string, state: any, previousState?: any) {
  const prevStateRef = useRef(previousState);

  useEffect(() => {
    if (prevStateRef.current !== undefined && prevStateRef.current !== state) {
      logger.logStateChange(storeName, prevStateRef.current, state, storeName);
    }
    prevStateRef.current = state;
  }, [state, storeName]);
}

/**
 * Hook for logging async operations
 */
export function useAsyncLogger(operationName: string, componentName: string = 'ASYNC') {
  return {
    /**
     * Wrap an async function with logging
     */
    wrapAsync: async <T,>(fn: () => Promise<T>, label: string = operationName): Promise<T> => {
      const timerId = `${componentName}:${label}`;
      logger.startTimer(timerId);
      logger.info(`⏳ Starting: ${label}`, {}, componentName);

      try {
        const result = await fn();
        const duration = logger.endTimer(timerId, componentName);
        logger.info(`✅ Completed: ${label}`, { duration }, componentName);
        return result;
      } catch (error) {
        logger.error(`❌ Failed: ${label}`, error, componentName);
        throw error;
      }
    },

    /**
     * Log the start of an operation
     */
    logStart: (label: string = operationName) => {
      logger.startTimer(`${componentName}:${label}`);
      logger.info(`⏳ Starting: ${label}`, {}, componentName);
    },

    /**
     * Log the completion of an operation
     */
    logComplete: (label: string = operationName, data?: any) => {
      const duration = logger.endTimer(`${componentName}:${label}`, componentName);
      logger.info(`✅ Completed: ${label}`, { duration, ...data }, componentName);
    },

    /**
     * Log an error in an operation
     */
    logError: (error: Error | any, label: string = operationName) => {
      logger.error(`❌ Failed: ${label}`, error, componentName);
    },
  };
}

