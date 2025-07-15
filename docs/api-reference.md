# API Reference

This document provides comprehensive documentation for the Mimic REST API.

## 🚀 Base URL

```
Development: http://localhost:4000
Production: https://api.mimic.dev
```

## 🔐 Authentication

All API endpoints require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Getting an Access Token

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## 📋 API Endpoints

### Sessions

#### Create Session

```http
POST /api/sessions
```

**Request Body:**

```json
{
  "agentId": "agent-uuid",
  "personaId": "persona-uuid",
  "config": {
    "duration": 300,
    "maxMessages": 50,
    "messageInterval": 30
  }
}
```

**Response:**

```json
{
  "id": "session-uuid",
  "agentId": "agent-uuid",
  "personaId": "persona-uuid",
  "status": "pending",
  "config": {
    "duration": 300,
    "maxMessages": 50,
    "messageInterval": 30
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Get Session

```http
GET /api/sessions/{sessionId}
```

**Response:**

```json
{
  "id": "session-uuid",
  "agentId": "agent-uuid",
  "personaId": "persona-uuid",
  "status": "active",
  "messages": [
    {
      "id": "message-uuid",
      "sessionId": "session-uuid",
      "senderType": "persona",
      "content": "Hello, I need help with my order",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ],
  "metadata": {
    "startTime": "2024-01-15T10:30:00Z",
    "messageCount": 1
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:05Z"
}
```

#### List Sessions

```http
GET /api/sessions?page=1&limit=20&status=active
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (pending, active, completed, failed)
- `agentId` (string): Filter by agent ID
- `personaId` (string): Filter by persona ID

**Response:**

```json
{
  "data": [
    {
      "id": "session-uuid",
      "agentId": "agent-uuid",
      "personaId": "persona-uuid",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Stop Session

```http
DELETE /api/sessions/{sessionId}
```

**Response:**

```json
{
  "id": "session-uuid",
  "status": "stopped",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### Personas

#### Create Persona

```http
POST /api/personas
```

**Request Body:**

```json
{
  "name": "Frustrated Customer",
  "description": "A customer who is having trouble with their order",
  "prompt": "You are a frustrated customer who ordered a product online. The order was delayed, and you're calling customer service to get help. You're polite but clearly annoyed. You want a resolution quickly.",
  "traits": {
    "communication_style": "direct",
    "patience_level": "low",
    "urgency": "high"
  },
  "config": {
    "messageInterval": 30,
    "sessionDuration": 300
  }
}
```

**Response:**

```json
{
  "id": "persona-uuid",
  "name": "Frustrated Customer",
  "description": "A customer who is having trouble with their order",
  "prompt": "You are a frustrated customer...",
  "traits": {
    "communication_style": "direct",
    "patience_level": "low",
    "urgency": "high"
  },
  "config": {
    "messageInterval": 30,
    "sessionDuration": 300
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Get Persona

```http
GET /api/personas/{personaId}
```

#### List Personas

```http
GET /api/personas?page=1&limit=20
```

#### Update Persona

```http
PUT /api/personas/{personaId}
```

#### Delete Persona

```http
DELETE /api/personas/{personaId}
```

### Agents

#### Create Agent

```http
POST /api/agents
```

**Request Body:**

```json
{
  "name": "My WhatsApp Bot",
  "type": "whatsapp",
  "config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890",
    "api_key": "your-whatsapp-api-key"
  }
}
```

**Response:**

```json
{
  "id": "agent-uuid",
  "name": "My WhatsApp Bot",
  "type": "whatsapp",
  "config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890",
    "api_key": "your-whatsapp-api-key"
  },
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Get Agent

```http
GET /api/agents/{agentId}
```

#### List Agents

```http
GET /api/agents?page=1&limit=20&type=whatsapp
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `type` (string): Filter by agent type (whatsapp, voice, websocket)

#### Update Agent

```http
PUT /api/agents/{agentId}
```

#### Delete Agent

```http
DELETE /api/agents/{agentId}
```

### Analytics

#### Get Session Analytics

```http
GET /api/analytics/sessions?startDate=2024-01-01&endDate=2024-01-31
```

**Query Parameters:**

- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `agentId` (string): Filter by agent ID
- `personaId` (string): Filter by persona ID

**Response:**

```json
{
  "totalSessions": 150,
  "activeSessions": 25,
  "completedSessions": 120,
  "failedSessions": 5,
  "averageDuration": 245,
  "totalMessages": 1250,
  "successRate": 0.96,
  "dailyStats": [
    {
      "date": "2024-01-15",
      "sessions": 10,
      "messages": 85,
      "avgDuration": 230
    }
  ]
}
```

#### Get Agent Performance

```http
GET /api/analytics/agents/{agentId}?startDate=2024-01-01&endDate=2024-01-31
```

## 🔌 WebSocket API

### Real-time Updates

Connect to the WebSocket endpoint for real-time session updates:

```javascript
const ws = new WebSocket('ws://localhost:4000/api/ws');

// Subscribe to session updates
ws.send(
  JSON.stringify({
    type: 'subscribe',
    sessionId: 'session-uuid',
  })
);

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Session update:', data);
};
```

### WebSocket Events

#### Session Update

```json
{
  "type": "session_update",
  "sessionId": "session-uuid",
  "data": {
    "status": "active",
    "messageCount": 5,
    "lastMessage": "2024-01-15T10:35:00Z"
  }
}
```

#### New Message

```json
{
  "type": "new_message",
  "sessionId": "session-uuid",
  "data": {
    "id": "message-uuid",
    "senderType": "persona",
    "content": "Thank you for your help!",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

#### Session End

```json
{
  "type": "session_end",
  "sessionId": "session-uuid",
  "data": {
    "reason": "completed",
    "duration": 300,
    "messageCount": 12
  }
}
```

## 📊 Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "agentId",
        "message": "Agent ID is required"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_ERROR` - Invalid credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## 🔒 Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Anonymous users**: 100 requests per hour
- **WebSocket connections**: 10 concurrent connections per user

Rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642233600
```

## 📝 SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @mimic/sdk
```

```javascript
import { MimicClient } from '@mimic/sdk';

const client = new MimicClient({
  baseUrl: 'http://localhost:4000',
  token: 'your-jwt-token',
});

// Create a session
const session = await client.sessions.create({
  agentId: 'agent-uuid',
  personaId: 'persona-uuid',
  config: {
    duration: 300,
    maxMessages: 50,
  },
});

// Get session updates
client.sessions.subscribe(session.id, (update) => {
  console.log('Session update:', update);
});
```

### Python

```bash
pip install mimic-sdk
```

```python
from mimic_sdk import MimicClient

client = MimicClient(
    base_url="http://localhost:4000",
    token="your-jwt-token"
)

# Create a session
session = client.sessions.create(
    agent_id="agent-uuid",
    persona_id="persona-uuid",
    config={
        "duration": 300,
        "max_messages": 50
    }
)
```

## 🧪 Testing

### Test Environment

Use the test environment for development and testing:

```
Base URL: http://localhost:4000
Test Token: test-token-123
```

### Example Requests

```bash
# Create a test session
curl -X POST http://localhost:4000/api/sessions \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "test-agent",
    "personaId": "test-persona",
    "config": {
      "duration": 60,
      "maxMessages": 10
    }
  }'
```

## 📚 Additional Resources

- **[Getting Started](./getting-started.md)** - Quick start guide
- **[Architecture](./architecture.md)** - System design overview
- **[Plugin Development](./plugins.md)** - Building custom adapters
- **[WebSocket Guide](./websocket.md)** - Real-time communication
- **[Error Handling](./errors.md)** - Common error scenarios

---

For support and questions, visit our [GitHub Discussions](https://github.com/your-org/mimic/discussions).
