/**
 * Test setup configuration for the Mimic API server.
 *
 * Configures the testing environment and mocks external dependencies.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.LOG_LEVEL = 'error';

// Mock Sentry to avoid external calls during tests
jest.mock('@sentry/node', () => ({
    init: jest.fn(),
    setTag: jest.fn(),
})); 