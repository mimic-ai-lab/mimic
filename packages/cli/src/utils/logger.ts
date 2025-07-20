import chalk from 'chalk';

/**
 * Log levels supported by the logger
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger configuration interface
 */
interface LoggerConfig {
    level: LogLevel;
    enableColors: boolean;
}

/**
 * Professional logger for CLI applications
 * Provides colored output, log levels, and consistent formatting
 */
class Logger {
    private config: LoggerConfig = {
        level: 'info',
        enableColors: true,
    };

    /**
     * Set the minimum log level
     * @param level - The minimum level to log
     */
    setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    /**
     * Enable or disable colored output
     * @param enabled - Whether to enable colors
     */
    setColors(enabled: boolean): void {
        this.config.enableColors = enabled;
    }

    /**
     * Check if a message at the given level should be logged
     * @param messageLevel - The level of the message
     * @returns True if the message should be logged
     */
    private shouldLog(messageLevel: LogLevel): boolean {
        const levels: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        return levels[messageLevel] >= levels[this.config.level];
    }

    /**
     * Format a log message with appropriate styling
     * @param level - The log level
     * @param message - The message to format
     * @returns Formatted message string
     */
    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const levelTag = `[${level.toUpperCase()}]`;

        if (!this.config.enableColors) {
            return `${timestamp} ${levelTag} ${message}`;
        }

        const coloredLevel = (() => {
            switch (level) {
                case 'debug':
                    return chalk.gray(levelTag);
                case 'info':
                    return chalk.blue(levelTag);
                case 'warn':
                    return chalk.yellow(levelTag);
                case 'error':
                    return chalk.red(levelTag);
                default:
                    return levelTag;
            }
        })();

        return `${chalk.gray(timestamp)} ${coloredLevel} ${message}`;
    }

    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            const formattedMessage = this.formatMessage('debug', message);
            console.log(formattedMessage, ...args);
        }
    }

    /**
     * Log an info message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            const formattedMessage = this.formatMessage('info', message);
            console.log(formattedMessage, ...args);
        }
    }

    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            const formattedMessage = this.formatMessage('warn', message);
            console.log(formattedMessage, ...args);
        }
    }

    /**
     * Log an error message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            const formattedMessage = this.formatMessage('error', message);
            console.error(formattedMessage, ...args);
        }
    }

    /**
     * Log a success message (special case for positive outcomes)
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    success(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            const timestamp = new Date().toISOString();
            const levelTag = '[SUCCESS]';

            if (this.config.enableColors) {
                const coloredTag = chalk.green(levelTag);
                const formattedMessage = `${chalk.gray(timestamp)} ${coloredTag} ${chalk.green(message)}`;
                console.log(formattedMessage, ...args);
            } else {
                const formattedMessage = `${timestamp} ${levelTag} ${message}`;
                console.log(formattedMessage, ...args);
            }
        }
    }

    /**
     * Get current logger configuration
     * @returns Current logger configuration
     */
    getConfig(): LoggerConfig {
        return { ...this.config };
    }
}

// Export a singleton instance
export const logger = new Logger(); 