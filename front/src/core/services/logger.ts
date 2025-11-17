/**
 * 환경별 로깅 서비스
 */

import env from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = env.REACT_APP_LOG_LEVEL;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const envPrefix = `[${env.REACT_APP_ENV.toUpperCase()}]`;
    return `${envPrefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  // 프로덕션 환경에서만 에러 리포팅
  reportError(error: Error, context?: Record<string, any>): void {
    if (env.REACT_APP_ENABLE_ERROR_REPORTING && env.REACT_APP_ENV === 'production') {
      // 실제 에러 리포팅 서비스 (Sentry, Bugsnag 등) 연동
      this.error('Error reported:', error.message, context);
      
      // 여기에 실제 에러 리포팅 서비스 호출 코드 추가
      // 예: Sentry.captureException(error, { extra: context });
    } else {
      this.error('Error occurred:', error.message, context);
    }
  }

  // 로컬 환경에서만 상세 로그
  dev(message: string, ...args: any[]): void {
    if (env.REACT_APP_ENV === 'local') {
      console.log(`[DEV] ${message}`, ...args);
    }
  }
}

// 싱글톤 인스턴스 생성
const logger = new Logger();

export default logger;
