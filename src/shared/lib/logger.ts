import { env } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'api';

class Logger {
  private isEnabled = env.FEATURE_DEBUG;

  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.isEnabled && level !== 'error') return;

    const prefix = `[${level.toUpperCase()}]`;
    const timestamp = new Date().toISOString();

    /* eslint-disable no-console */
    switch (level) {
      case 'error':
        console.error(prefix, timestamp, ...args);
        break;
      case 'warn':
        console.warn(prefix, timestamp, ...args);
        break;
      case 'api':
        console.log(`[API]`, timestamp, ...args);
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
}

export const logger = new Logger();
