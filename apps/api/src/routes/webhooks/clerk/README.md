# Clerk Webhook Integration

This module handles Clerk webhook events for user synchronization with the database.

## Overview

The Clerk webhook integration provides a robust, production-ready endpoint for handling user lifecycle events from Clerk authentication service. It includes comprehensive error handling, rate limiting, security headers, and monitoring capabilities.

## Features

- ✅ **Signature Verification**: Svix-based webhook signature verification (configurable)

- ✅ **Security Headers**: Comprehensive security headers for production
- ✅ **Database Transactions**: Atomic database operations with rollback support
- ✅ **Structured Logging**: Detailed logging with environment-based verbosity
- ✅ **Error Handling**: Comprehensive error responses with error codes
- ✅ **Health Monitoring**: Dedicated health check endpoint
- ✅ **Type Safety**: Full TypeScript support with Zod validation
- ✅ **OpenAPI Documentation**: Auto-generated API documentation

## Endpoints

### POST `/webhooks/clerk`

Handles Clerk webhook events for user synchronization.

**Headers Required:**

- `Content-Type: application/json`
- `svix-id`: Unique webhook event ID
- `svix-timestamp`: Event timestamp
- `svix-signature`: Webhook signature for verification

**Supported Events:**

- `user.created`: Creates new user in database
- `user.updated`: Updates existing user information
- `user.deleted`: Soft-deletes user (sets `is_active: false`)

**Response Format:**

```json
{
  "ok": true,
  "message": "Successfully processed user.created",
  "eventType": "user.created",
  "userId": "user_123",
  "processingTimeMs": 45
}
```

### GET `/webhooks/clerk/health`

Health check endpoint for monitoring webhook service status.

**Response:**

```json
{
  "ok": true,
  "status": "healthy",
  "checks": {
    "endpoint": true,
    "database": true,
    "environment": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "service": "clerk-webhook",
  "version": "1.0.0"
}
```

## Configuration

### Email Requirements

The webhook requires all users to have a valid email address:

- **User Creation**: Email address is required and must be provided in the webhook payload
- **User Updates**: Email address is required for updates
- **Database Constraint**: Email field is `NOT NULL` and `UNIQUE` in the database
- **Error Handling**: Webhook will return an error if no email is provided

### Environment Variables

| Variable               | Description                               | Required |
| ---------------------- | ----------------------------------------- | -------- |
| `CLERK_WEBHOOK_SECRET` | Secret for webhook signature verification | Yes      |
| `DATABASE_URL`         | PostgreSQL connection string              | Yes      |
| `NODE_ENV`             | Environment (development/production)      | Yes      |

## Error Handling

The webhook implements comprehensive error handling with structured error responses:

### Error Response Format

```json
{
  "ok": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error context
  }
}
```

### Error Codes

| Code                | Description                           | HTTP Status |
| ------------------- | ------------------------------------- | ----------- |
| `MISSING_HEADERS`   | Required Svix headers missing         | 400         |
| `MISSING_SECRET`    | Webhook secret not configured         | 500         |
| `INVALID_SIGNATURE` | Webhook signature verification failed | 401         |
| `INVALID_PAYLOAD`   | Invalid webhook payload format        | 400         |
| `UNSUPPORTED_EVENT` | Unsupported event type                | 400         |
| `PROCESSING_ERROR`  | Error during event processing         | 500         |

| `INVALID_CONTENT_TYPE` | Invalid content type | 400 |

## Security

### Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

### Signature Verification

Webhook signature verification is implemented using Svix and is enabled by default:

```typescript
const webhook = new Webhook(secret);
event = webhook.verify(payload, headers);
```

## Database Operations

### User Creation

- Checks for existing users by `clerk_id` to prevent duplicates
- Uses database transactions for atomicity

- **Requires email address** - throws error if no email provided
- Handles profile images and sign-in timestamps
- Handles email addresses, profile images, and sign-in timestamps
- Sets `is_active: true` for new users

### User Updates

- Updates user information including email, name, and profile image
- Updates `last_sign_in_at` timestamp
- Maintains `is_active: true`

### User Deletion

- Implements soft delete by setting `is_active: false`
- Updates `updated_at` timestamp
- Preserves user data for audit purposes

## Logging

### Development Mode

- Debug logs enabled for detailed troubleshooting
- Request/response body logging
- Database operation details
- Processing time measurements

### Production Mode

- Info-level logs only for operational visibility
- Error logs for monitoring and alerting
- Structured logging with correlation IDs

### Log Levels

- `debug`: Detailed debugging information
- `info`: General operational information
- `warn`: Warning conditions
- `error`: Error conditions

## Monitoring

### Health Checks

- Database connectivity verification
- Environment variable validation
- Endpoint accessibility testing

### Metrics

- Processing time per event type
- Error rates and types
- Rate limiting statistics

## Testing

### Manual Testing

```bash
# Test user creation
curl -X POST http://localhost:4000/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: test_123" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: test_sig" \
  -d '{
    "data": {
      "id": "user_123",
      "email_addresses": [{"email_address": "test@example.com"}],
      "first_name": "Test",
      "last_name": "User"
    },
    "object": "event",
    "type": "user.created",
    "timestamp": 1234567890,
    "instance_id": "ins_test"
  }'

# Test health check
curl http://localhost:4000/webhooks/clerk/health
```

### Automated Testing

See `__tests__/` directory for comprehensive test coverage.

## Best Practices

1. **Always verify webhook signatures in production**
2. **Monitor webhook processing times and error rates**
3. **Use database transactions for data consistency**
4. **Implement proper error handling and logging**
5. **Set up alerts for webhook failures**
6. **Regularly test webhook endpoints**
7. **Keep webhook secrets secure and rotate regularly**

## Troubleshooting

### Common Issues

1. **Missing Headers**: Ensure all required Svix headers are present
2. **Invalid Signature**: Verify webhook secret configuration
3. **Database Errors**: Check database connectivity and schema
4. **Rate Limiting**: Monitor request frequency and adjust limits
5. **Environment Variables**: Verify all required env vars are set

### Debug Mode

Set `NODE_ENV=development` for detailed debug logging.

## Contributing

When contributing to this webhook implementation:

1. Follow the existing code structure and patterns
2. Add comprehensive error handling
3. Include appropriate logging
4. Update documentation
5. Add tests for new functionality
6. Follow security best practices
