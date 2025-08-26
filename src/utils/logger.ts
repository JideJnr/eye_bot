// src/logService.ts
const logs: string[] = [];

/**
 * Add a log message (stores only the last 20 messages)
 */
export const addLog = (message: string) => {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${message}`;
  logs.push(formatted);

  // Keep only last 20 logs
  if (logs.length > 20) {
    logs.shift(); // remove the oldest entry
  }

  addLog(formatted);
};

/**
 * Get all stored logs
 */
export const getLogs = () => logs;

/**
 * Clear all stored logs
 */
export const clearLogs = () => {
  logs.length = 0;
};
