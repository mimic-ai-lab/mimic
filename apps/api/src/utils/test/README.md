# Test Structure

This directory contains test utilities and setup for the Mimic API server.

## Structure

```
src/
├── routes/
│   ├── health/
│   │   ├── index.ts
│   │   └── __tests__/
│   │       └── health.test.ts
│   ├── users/
│   │   ├── index.ts
│   │   └── __tests__/
│   │       └── users.test.ts
│   └── webhooks/
│       ├── index.ts
│       └── __tests__/
│           └── webhooks.test.ts
├── utils/
│   └── test/
│       ├── setup.ts      # Jest setup and mocks
│       ├── helpers.ts    # Test server utilities
│       └── README.md     # This file
└── server.ts
```

## Test Utilities

### `createTestServer()`

Creates a minimal Fastify server for testing without any plugins.

```typescript
import { createTestServer } from '@/utils/test/helpers';

const app = await createTestServer();
```

### `createTestServerWithRoutes(routeHandler)`

Creates a test server and registers routes with it.

```typescript
import { createTestServerWithRoutes } from '@/utils/test/helpers';

const app = await createTestServerWithRoutes(async (fastify) => {
  await fastify.register(YourRoutes);
});
```

## Writing Tests

### Example: Testing a Route

```typescript
// routes/health/__tests__/health.test.ts
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createTestServerWithRoutes } from '@/utils/test/helpers';
import HealthRoutes from '../index';

describe('Health Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestServerWithRoutes(async (fastify) => {
      await fastify.register(HealthRoutes);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns 200', async () => {
    const response = await request(app.server).get('/health').expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
});
```

## Benefits

- **Co-location**: Tests live next to the code they test
- **Simplicity**: No complex server building or environment setup
- **Discoverability**: Easy to find tests for specific features
- **Scalability**: Each route can have its own test suite
- **Open Source Friendly**: Standard pattern that contributors expect
- **Clean Imports**: Uses `@/` alias for consistent, readable imports

## Running Tests

```bash
# Run all tests
yarn test

# Run tests for a specific route
yarn test src/routes/health/__tests__/

# Run tests with coverage
yarn test --coverage
```
