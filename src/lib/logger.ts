type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private format(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  info(message: string, data?: unknown) {
    const entry = this.format('info', message, data);
    console.log(`✅ [${entry.timestamp}] ${message}`, data ?? '');
  }

  warn(message: string, data?: unknown) {
    const entry = this.format('warn', message, data);
    console.warn(`⚠️ [${entry.timestamp}] ${message}`, data ?? '');
  }

  error(message: string, data?: unknown) {
    const entry = this.format('error', message, data);
    console.error(`❌ [${entry.timestamp}] ${message}`, data ?? '');
  }

  debug(message: string, data?: unknown) {
    if (this.isDev) {
      const entry = this.format('debug', message, data);
      console.debug(`🔍 [${entry.timestamp}] ${message}`, data ?? '');
    }
  }

  api(method: string, path: string, status: number, duration: number) {
    this.info(`${method} ${path} → ${status} (${duration}ms)`);
  }
}

export const logger = new Logger();
