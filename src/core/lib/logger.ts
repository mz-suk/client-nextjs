import { isDebug } from '@core/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'api';

class Logger {
  private enabled: boolean;

  constructor(enabled = isDebug) {
    this.enabled = enabled;
  }

  private shouldLog(level: LogLevel): boolean {
    return level === 'error' || this.enabled;
  }

  private formatMessage(level: LogLevel, args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${level.toUpperCase()}]`;
    const argsStr = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' ');
    return `${prefix} ${timestamp} ${argsStr}`;
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.shouldLog(level)) return;

    const message = this.formatMessage(level, args);

    /* eslint-disable no-console */
    switch (level) {
      case 'error':
        console.error(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      default:
        console.log(message);
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
}

export const logger = new Logger();
