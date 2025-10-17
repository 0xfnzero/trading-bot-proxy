import Config from './config';

// 日志级别配置
const LOG_LEVEL = Config.LOG_LEVEL;
const logLevels = ['error', 'warn', 'info', 'debug'];
const currentLogLevel = logLevels.indexOf(LOG_LEVEL);

export function log(level: string, message: string, ...args: any[]): void {
  const levelIndex = logLevels.indexOf(level);
  if (levelIndex <= currentLogLevel) {
    const now = new Date();
    const timestamp = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    const timestampWithMs = `${timestamp}.${milliseconds}`;
    console.log(`[${timestampWithMs}] [${level.toUpperCase()}] ${message}`, ...args);
  }
}

export function getLogLevel(): string {
  return LOG_LEVEL;
}

