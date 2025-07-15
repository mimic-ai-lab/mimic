# Architecture Guide

This document provides a detailed overview of Mimic's system architecture, design decisions, and technical implementation.

## 🏗️ System Overview

Mimic is built as a **microservices architecture** with a **monorepo structure** using modern TypeScript tooling and cloud-native patterns.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │   API Server    │    │   Worker Jobs   │
│   (Next.js 14)  │◄──►│   (Fastify)     │◄──►│   (BullMQ)      │
│   Port: 3000    │    │   Port: 4000    │    │   Background    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   External      │
│   (Data Store)  │    │   (Job Queue)   │    │   APIs          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Monorepo Structure

```
mimic/
├── apps/
│   ├── api/              # Fastify REST/GraphQL API
│   ├── web/              # Next.js 14 Dashboard
│   └── worker/           # BullMQ Background Jobs
├── packages/
│   ├── core/             # Shared Domain Logic
│   ├── adapters/         # Protocol Adapters
│   ├── plugin-sdk/       # Plugin Development Kit
│   └── cli/              # Command Line Tools
├── infra/                # Infrastructure as Code
└── docs/                 # Documentation
```

## 🎯 Core Components

### 1. API Server (`apps/api`)

**Technology**: Fastify + TypeScript

**Responsibilities**:

- REST/GraphQL API endpoints
- Webhook handling
- Authentication & authorization
- Real-time WebSocket connections
- Session management

**Key Features**:

- **High Performance**: Fastify's low-overhead architecture
- **Type Safety**: Full TypeScript integration
- **Plugin System**: Extensible middleware architecture
- **WebSocket Support**: Real-time dashboard updates

```typescript
// Example API structure
interface ApiServer {
  // Session Management
  createSession(session: SessionConfig): Promise<Session>;
  getSession(id: string): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session>;

  // Persona Management
  createPersona(persona: PersonaConfig): Promise<Persona>;
  listPersonas(): Promise<Persona[]>;

  // Agent Management
  createAgent(agent: AgentConfig): Promise<Agent>;
  listAgents(): Promise<Agent[]>;

  // Real-time Updates
  subscribeToSession(sessionId: string): WebSocket;
}
```

### 2. Web Dashboard (`apps/web`)

**Technology**: Next.js 14 + React + TypeScript

**Responsibilities**:

- Real-time session monitoring
- Persona and agent management
- Analytics and reporting
- User interface for all operations

**Key Features**:

- **App Router**: Modern Next.js routing
- **Server Components**: Optimized rendering
- **Real-time Updates**: WebSocket integration
- **Responsive Design**: Mobile-friendly interface

### 3. Worker (`apps/worker`)

**Technology**: BullMQ + Redis + TypeScript

**Responsibilities**:

- Background job processing
- Session execution
- LLM integration for personas
- External API communication

**Job Types**:

```typescript
interface JobTypes {
  'session.start': {
    sessionId: string;
    personaId: string;
    agentId: string;
    duration: number;
  };

  'session.message': {
    sessionId: string;
    message: string;
    timestamp: Date;
  };

  'session.end': {
    sessionId: string;
    reason: 'completed' | 'timeout' | 'error';
  };
}
```

### 4. Core Package (`packages/core`)

**Responsibilities**:

- Shared domain models
- Database schema and migrations
- Common utilities and helpers
- Type definitions

**Key Modules**:

```typescript
// Domain Models
export interface Session {
  id: string;
  agentId: string;
  personaId: string;
  status: SessionStatus;
  messages: Message[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  prompt: string;
  traits: PersonaTraits;
  config: PersonaConfig;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  config: AgentConfig;
  status: AgentStatus;
}
```

## 🔄 Data Flow

### 1. Session Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant A as API
    participant W as Worker
    participant R as Redis
    participant E as External API

    U->>D: Create Session
    D->>A: POST /api/sessions
    A->>A: Validate Config
    A->>R: Store Session
    A->>W: Queue Session Job
    W->>E: Start Conversation
    W->>A: Update Session Status
    A->>D: WebSocket Update
    D->>U: Real-time Display
```

### 2. Message Processing Flow

```mermaid
sequenceDiagram
    participant P as Persona (LLM)
    participant W as Worker
    participant A as Agent API
    participant S as Session Store
    participant D as Dashboard

    P->>W: Generate Message
    W->>A: Send Message
    A->>W: Agent Response
    W->>S: Store Messages
    W->>D: Real-time Update
    W->>P: Process Response
```

## 🗄️ Data Models

### Database Schema

```sql
-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  persona_id UUID NOT NULL REFERENCES personas(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  config JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id),
  sender_type VARCHAR(20) NOT NULL, -- 'persona' | 'agent'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Personas table
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  traits JSONB NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 Adapter System

Mimic uses a **plugin-based adapter system** to support different communication protocols.

### Adapter Interface

```typescript
interface ProtocolAdapter {
  name: string;
  version: string;

  // Connection management
  connect(config: AdapterConfig): Promise<void>;
  disconnect(): Promise<void>;

  // Message handling
  sendMessage(sessionId: string, message: string): Promise<void>;
  onMessage(callback: (sessionId: string, message: string) => void): void;

  // Session management
  createSession(config: SessionConfig): Promise<string>;
  endSession(sessionId: string): Promise<void>;
}
```

### Supported Protocols

1. **WhatsApp Business API**
2. **Twilio Voice**
3. **WebSocket**
4. **REST API**
5. **Discord Bot**
6. **Telegram Bot**

## 🔐 Security Architecture

### Authentication & Authorization

- **JWT-based authentication** for API access
- **Role-based access control** (RBAC)
- **API key management** for external integrations
- **Rate limiting** to prevent abuse

### Data Protection

- **Encryption at rest** for sensitive data
- **TLS/SSL** for all external communications
- **Input validation** and sanitization
- **Audit logging** for compliance

## 📊 Monitoring & Observability

### Metrics Collection

- **Application metrics** via Prometheus
- **Business metrics** (sessions, messages, success rates)
- **Infrastructure metrics** (CPU, memory, disk)
- **Custom dashboards** via Grafana

### Logging Strategy

- **Structured logging** with correlation IDs
- **Log levels** (debug, info, warn, error)
- **Centralized log aggregation**
- **Log retention policies**

### Alerting

- **Performance thresholds** (response time, error rate)
- **Business metrics** (session failures, agent downtime)
- **Infrastructure alerts** (disk space, memory usage)

## 🚀 Performance Considerations

### Scalability Patterns

1. **Horizontal Scaling**: Stateless API servers
2. **Job Queue**: Redis-based job processing
3. **Database Sharding**: Session-based partitioning
4. **Caching**: Redis for session state
5. **CDN**: Static asset delivery

### Optimization Strategies

- **Connection pooling** for database connections
- **Message batching** for high-volume scenarios
- **Lazy loading** for dashboard components
- **Compression** for API responses
- **Caching** for frequently accessed data

## 🔧 Configuration Management

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mimic
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Security
JWT_SECRET=your-jwt-secret
API_RATE_LIMIT=1000

# Monitoring
PROMETHEUS_PORT=9090
LOG_LEVEL=info
```

### Feature Flags

```typescript
interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableRealTimeMonitoring: boolean;
  enableMultiLanguageSupport: boolean;
  enableCustomPersonas: boolean;
}
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: Full user journey testing
4. **Load Tests**: Performance and stress testing
5. **Security Tests**: Vulnerability scanning

### Test Infrastructure

- **Jest** for unit and integration tests
- **Playwright** for E2E testing
- **Artillery** for load testing
- **Code coverage** reporting

## 🚀 Deployment Architecture

### Development Environment

- **Local development** with Docker Compose
- **Hot reload** for all services
- **Shared databases** for team development

### Production Environment

- **Kubernetes** orchestration
- **Terraform** infrastructure as code
- **CI/CD** with GitHub Actions
- **Blue-green deployments**
- **Auto-scaling** based on metrics

## 📈 Future Architecture Considerations

### Planned Improvements

1. **Microservices**: Further service decomposition
2. **Event Sourcing**: For audit and replay capabilities
3. **GraphQL**: For flexible data querying
4. **Machine Learning**: For persona optimization
5. **Multi-tenancy**: For SaaS deployment

### Technology Evolution

- **Database**: Consider time-series databases for metrics
- **Message Queue**: Evaluate Apache Kafka for high throughput
- **Caching**: Implement distributed caching with Redis Cluster
- **Monitoring**: Advanced APM with distributed tracing

---

This architecture provides a solid foundation for Mimic's growth while maintaining flexibility for future enhancements and scale.
