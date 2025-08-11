// src/logService.ts
const logs: string[] = [];

/**
 * Add a log message (stored in memory and printed to console)
 */
export const addLog = (message: string) => {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${message}`;
  logs.push(formatted);
  console.log(formatted); // Print to console
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
