/**
 * Library exports for the Mimic API server.
 *
 * This file provides a centralized export point for all library modules,
 * making imports cleaner and more maintainable throughout the application.
 */

// Database exports
export { getDatabase, initializeDatabase, closeDatabase } from './database';
export type { Database } from './database';

// Email service exports
export { getEmailService, isEmailConfigured, sendMagicLinkEmail } from './email';
export type { EmailService } from './email';

// Auth exports
export { auth } from './auth'; 