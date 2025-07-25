# API Reference

This document provides comprehensive documentation for the Mimic REST API.

## 🚀 Base URL

```
Development: http://localhost:4000
Production: https://api.mimic.dev
```

## 🔐 Authentication

Mimic supports two authentication methods:

### 1. Web Dashboard Authentication (JWT)

For web dashboard access, use Clerk JWT tokens:

```
Authorization: Bearer <your-clerk-jwt-token>
Content-Type: application/json
```

### 2. CLI Authentication (API Key)

For CLI and external integrations, use API keys:

```
X-API-Key: <your-team-api-key>
Content-Type: application/json
```

### API Key Management

API keys are team-scoped and provide access to CLI endpoints:

```bash
# Create an agent via CLI
curl -X POST http://localhost:4000/api/cli/agents \
  -H "X-API-Key: your-team-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Bot",
    "description": "AI agent for handling customer inquiries",
    "agent_type": "chat",
    "platform": "whatsapp",
    "platform_config": {
      "webhook_url": "https://your-bot.com/webhook"
    }
  }'
```

**Features:**

- Team-scoped access
- Automatic persona and evaluation generation
- Temporal workflow orchestration
- SHA-256 hashed storage

## 📋 API Endpoints

### CLI Endpoints (API Key Authentication)

#### Create Agent

```http
POST /api/cli/agents
```

**Headers:**

```
X-API-Key: your-team-api-key
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Customer Support Bot",
  "description": "AI agent for handling customer inquiries",
  "agent_type": "chat",
  "platform": "whatsapp",
  "platform_config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890"
  },
  "status": "draft",
  "is_active": true
}
```

**Response:**

```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "team_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_by": "api-key-user",
    "name": "Customer Support Bot",
    "description": "AI agent for handling customer inquiries",
    "agent_type": "chat",
    "platform": "whatsapp",
    "platform_config": {
      "webhook_url": "https://your-bot.com/webhook",
      "phone_number": "+1234567890"
    },
    "status": "draft",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Features:**

- Automatically triggers Temporal workflow for persona and evaluation generation
- Team-scoped access via API key
- Returns agent with generated persona and evaluation IDs

#### List Agents

```http
GET /api/cli/agents?limit=10&status=active&agent_type=chat&platform=whatsapp
```

**Headers:**

```
X-API-Key: your-team-api-key
```

**Query Parameters:**

- `limit` (number): Items per page (default: 10, max: 100)
- `nextToken` (string): Cursor for pagination
- `status` (string): Filter by status (draft, active, paused, archived)
- `agent_type` (string): Filter by type (chat, voice)
- `platform` (string): Filter by platform

**Response:**

```json
{
  "ok": true,
  "data": {
    "agents": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "team_id": "550e8400-e29b-41d4-a716-446655440000",
        "created_by": "api-key-user",
        "name": "Customer Support Bot",
        "description": "AI agent for handling customer inquiries",
        "agent_type": "chat",
        "platform": "whatsapp",
        "status": "active",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "nextToken": "eyJpZCI6ImFnZW50XzQ1NiIsImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiJ9",
    "hasMore": true
  }
}
```

#### Get Agent

```http
GET /api/cli/agents/{agentId}
```

#### Update Agent

```http
PUT /api/cli/agents/{agentId}
```

#### Delete Agent

```http
DELETE /api/cli/agents/{agentId}
```

### Web Dashboard Endpoints (JWT Authentication)

### Agents

#### Create Agent

```http
POST /api/agents
```

**Headers:**

```
Authorization: Bearer your-clerk-jwt-token
Content-Type: application/json
```

**Request Body:**

```json
{
  "team_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My WhatsApp Bot",
  "description": "AI agent for customer support",
  "agent_type": "chat",
  "platform": "whatsapp",
  "platform_config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890",
    "welcome_message": "Hello! How can I help you today?"
  },
  "status": "draft",
  "is_active": true
}
```

**Response:**

```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "team_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_by": "user_2abc123def456",
    "name": "My WhatsApp Bot",
    "description": "AI agent for customer support",
    "agent_type": "chat",
    "platform": "whatsapp",
    "platform_config": {
      "webhook_url": "https://your-bot.com/webhook",
      "phone_number": "+1234567890",
      "welcome_message": "Hello! How can I help you today?"
    },
    "status": "draft",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
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

### AI-Generated Data

#### Agent Personas

When agents are created via CLI, the system automatically generates realistic personas using OpenAI:

```json
{
  "id": "persona-uuid",
  "agent_id": "550e8400-e29b-41d4-a716-446655440001",
  "team_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_by": "api-key-user",
  "name": "Sarah Johnson",
  "age": 34,
  "occupation": "Marketing Manager",
  "location": "San Francisco, CA",
  "goals": [
    "Resolve order issue quickly",
    "Get clear communication about delivery status",
    "Receive compensation for inconvenience"
  ],
  "frustrations": [
    "Long wait times on hold",
    "Unclear communication",
    "Multiple transfers between departments"
  ],
  "typing_style": {
    "formality": "casual",
    "emoji_usage": "moderate",
    "response_speed": "fast",
    "communication_style": "direct"
  },
  "sample_phrases": [
    "Hi, I need help with my order #12345",
    "This is taking way too long",
    "Can you please escalate this?"
  ],
  "stop_conditions": [
    "Issue resolved satisfactorily",
    "Clear timeline provided",
    "Compensation offered"
  ],
  "simulation_tags": ["customer_service", "order_issue", "frustrated"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Agent Evaluations

The system also generates custom evaluation metrics for each agent:

```json
{
  "id": "evaluation-uuid",
  "agent_id": "550e8400-e29b-41d4-a716-446655440001",
  "team_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_by": "api-key-user",
  "name": "Response Time Evaluation",
  "metric": "latency_ms",
  "description": "Measures the time between customer message and agent response",
  "method": "timestamp_diff",
  "pass_criteria": {
    "pass": "<= 5000",
    "warning": "5001-10000",
    "fail": "> 10000"
  },
  "severity": "high",
  "notes": "Critical for customer satisfaction",
  "llm_prompt": "Calculate the time difference between customer message timestamp and agent response timestamp",
  "regex_example": null,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
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
  "ok": false,
  "error": "Invalid request data",
  "details": [
    {
      "field": "agentId",
      "message": "Agent ID is required"
    }
  ]
}
```

### API Key Authentication Errors

```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

### Team Scoping Errors

```json
{
  "ok": false,
  "error": "Agent not found or access denied"
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

// Web Dashboard Client (JWT)
const webClient = new MimicClient({
  baseUrl: 'http://localhost:4000',
  token: 'your-clerk-jwt-token',
});

// CLI Client (API Key)
const cliClient = new MimicClient({
  baseUrl: 'http://localhost:4000',
  apiKey: 'your-team-api-key',
});

// Create an agent via CLI
const agent = await cliClient.cli.agents.create({
  name: 'Customer Support Bot',
  description: 'AI agent for handling customer inquiries',
  agent_type: 'chat',
  platform: 'whatsapp',
  platform_config: {
    webhook_url: 'https://your-bot.com/webhook',
  },
});

// List agents
const agents = await cliClient.cli.agents.list({
  limit: 10,
  status: 'active',
});
```

### Python

```bash
pip install mimic-sdk
```

```python
from mimic_sdk import MimicClient

# CLI Client (API Key)
client = MimicClient(
    base_url="http://localhost:4000",
    api_key="your-team-api-key"
)

# Create an agent
agent = client.cli.agents.create(
    name="Customer Support Bot",
    description="AI agent for handling customer inquiries",
    agent_type="chat",
    platform="whatsapp",
    platform_config={
        "webhook_url": "https://your-bot.com/webhook"
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
