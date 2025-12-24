import { isDebug } from '@core/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'api';

class Logger {
  private isEnabled: boolean;

  constructor(enabled = isDebug) {
    this.isEnabled = enabled;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.isEnabled || level === 'error';
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${level.toUpperCase()}]`;

    /* eslint-disable no-console */
    switch (level) {
      case 'error':
        console.error(prefix, timestamp, ...args);
        break;
      case 'warn':
        console.warn(prefix, timestamp, ...args);
        break;
      default:
        console.log(prefix, timestamp, ...args);
    }
    /* eslint-enable no-console */
  }

  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }

  info(...args: unknown[]) {
    this.log('info', ...args);
  }

  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }

  error(...args: unknown[]) {
    this.log('error', ...args);
  }

  api(...args: unknown[]) {
    this.log('api', ...args);
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

export const logger = new Logger();

export { Logger };
