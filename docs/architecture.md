# Architecture Guide

This document provides a detailed overview of Mimic's system architecture, design decisions, and technical implementation.

## 🏗️ System Overview

Mimic is built as a **microservices architecture** with a **monorepo structure** using modern TypeScript tooling and cloud-native patterns.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │   API Server    │    │   Temporal      │
│   (Next.js 14)  │◄──►│   (Fastify)     │◄──►│   Worker        │
│   Port: 3000    │    │   Port: 4000    │    │   (Workflows)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │  Temporal Cloud │    │   OpenAI API    │
│   (Data Store)  │    │  (Orchestration)│    │   (AI Services) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Monorepo Structure

```
mimic/
├── apps/
│   ├── api/              # Fastify REST/GraphQL API
│   ├── web/              # Next.js 14 Dashboard
│   └── worker/           # Temporal Worker (Workflows)
├── packages/
│   ├── core/             # Shared Domain Logic
│   ├── temporal-workflows/ # Shared Temporal Workflows
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

**Technology**: Temporal + TypeScript

**Responsibilities**:

- Workflow orchestration and execution
- Activity execution (OpenAI calls, database operations)
- Agent bootstrap workflows
- Long-running process management

**Workflow Types**:

```typescript
interface WorkflowTypes {
  agentBootstrapWF: {
    agentId: string;
    teamId: string;
    createdBy: string;
    agentName: string;
    agentDescription: string;
    platform: string;
  };
}

interface ActivityTypes {
  generatePersona: {
    agentName: string;
    agentDescription: string;
    platform: string;
  };

  generateEvals: {
    agentName: string;
    agentDescription: string;
    platform: string;
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

export interface AgentPersona {
  id: string;
  agentId: string;
  teamId: string;
  createdBy: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  goals: string[];
  frustrations: string[];
  typingStyle: Record<string, any>;
  samplePhrases: string[];
  stopConditions: string[];
  simulationTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentEvaluation {
  id: string;
  agentId: string;
  teamId: string;
  createdBy: string;
  name: string;
  metric:
    | 'latency_ms'
    | 'boolean'
    | 'sentiment_score'
    | 'accuracy_percentage'
    | 'count';
  description: string;
  method:
    | 'timestamp_diff'
    | 'LLM_match'
    | 'sentiment_analysis'
    | 'regex_match'
    | 'custom_script';
  passCriteria: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  llmPrompt?: string;
  regexExample?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Temporal Workflows Package (`packages/temporal-workflows`)

**Responsibilities**:

- Shared workflow definitions
- Reusable activities
- Workflow orchestration logic
- Cross-service workflow coordination

**Key Workflows**:

```typescript
// Agent Bootstrap Workflow
export async function agentBootstrapWF(
  args: AgentBootstrapArgs
): Promise<void> {
  // 1. Generate persona using OpenAI
  const persona = await generatePersona(args);

  // 2. Generate evaluations using OpenAI
  const evaluations = await generateEvals(args);

  // 3. Save both to database
  await savePersonaToDatabase(
    args.agentId,
    args.teamId,
    args.createdBy,
    persona
  );
  await saveEvaluationsToDatabase(
    args.agentId,
    args.teamId,
    args.createdBy,
    evaluations
  );
}
```

## 🔄 Data Flow

### 1. Agent Creation & Bootstrap Flow

```mermaid
sequenceDiagram
    participant C as CLI Client
    participant A as API Server
    participant T as Temporal Client
    participant W as Temporal Worker
    participant O as OpenAI API
    participant D as Database

    C->>A: POST /api/cli/agents (X-API-Key)
    A->>A: Validate API Key
    A->>A: Create Agent
    A->>D: Save Agent
    A->>T: Start agentBootstrapWF
    T->>W: Execute Workflow
    W->>O: Generate Persona
    O->>W: Return Persona
    W->>O: Generate Evaluations
    O->>W: Return Evaluations
    W->>D: Save Persona
    W->>D: Save Evaluations
    W->>A: Workflow Complete
    A->>C: Return Agent with IDs
```

### 2. Session Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant A as API
    participant W as Worker
    participant T as Temporal Cloud
    participant E as External API

    U->>D: Create Session
    D->>A: POST /api/sessions
    A->>A: Validate Config
    A->>T: Store Session
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
-- Teams table (multi-tenant)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agent_type VARCHAR(50) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent Personas table (AI-generated)
CREATE TABLE agent_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  created_by VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  occupation VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  goals JSONB NOT NULL, -- Array of strings
  frustrations JSONB NOT NULL, -- Array of strings
  typing_style JSONB NOT NULL, -- Object
  sample_phrases JSONB NOT NULL, -- Array of strings
  stop_conditions JSONB NOT NULL, -- Array of strings
  simulation_tags JSONB NOT NULL, -- Array of strings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent Evaluations table (AI-generated)
CREATE TABLE agent_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  created_by VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  metric VARCHAR(50) NOT NULL, -- 'latency_ms', 'boolean', 'sentiment_score', 'accuracy_percentage', 'count'
  description TEXT NOT NULL,
  method VARCHAR(50) NOT NULL, -- 'timestamp_diff', 'LLM_match', 'sentiment_analysis', 'regex_match', 'custom_script'
  pass_criteria JSONB NOT NULL, -- Object with pass, warning, fail thresholds
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  notes TEXT,
  llm_prompt TEXT,
  regex_example TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

-- Personas table (legacy)
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

- **JWT-based authentication** for web dashboard access
- **API key authentication** for CLI and external integrations
- **Team-scoped access control** with multi-tenant architecture
- **Rate limiting** to prevent abuse

### API Key System

**CLI Authentication**:

- SHA-256 hashed API keys stored in database
- Team-scoped access for multi-tenant isolation
- `X-API-Key` header for authentication
- Automatic persona and evaluation generation on agent creation

**Key Features**:

```typescript
interface ApiKey {
  id: string;
  teamId: string;
  name: string;
  keyHash: string; // SHA-256 hash
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

interface Team {
  id: string;
  name: string;
  apiKeys: ApiKey[];
  agents: Agent[];
  personas: AgentPersona[];
  evaluations: AgentEvaluation[];
}
```

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

# Temporal Cloud (Workflow Orchestration)
TEMPORAL_API_KEY=your-temporal-cloud-api-key
TEMPORAL_NAMESPACE=your-temporal-namespace
TEMPORAL_ADDRESS=your-temporal-cloud-address

# OpenAI (AI Services)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-2024-08-06

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

## 🤖 AI-Powered Features

### OpenAI Integration

**Persona Generation**:

- Uses GPT-4o-2024-08-06 for realistic persona creation
- Structured output with Zod schemas for consistency
- Platform-specific persona characteristics
- Detailed demographics, communication styles, and conversation patterns

**Evaluation Generation**:

- Custom evaluation metrics based on agent purpose and platform
- Multiple metric types: latency, boolean, sentiment, accuracy, count
- Evaluation methods: timestamp diff, LLM match, sentiment analysis, regex match, custom script
- Severity levels and pass/fail criteria

**Technical Implementation**:

```typescript
// Structured output with OpenAI
const completion = await openai.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'developer', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  response_format: zodResponseFormat(Schema, 'response_name'),
  temperature: 0.7,
  max_tokens: 2000,
});
```

## 📈 Future Architecture Considerations

### Planned Improvements

1. **Microservices**: Further service decomposition
2. **Event Sourcing**: For audit and replay capabilities
3. **GraphQL**: For flexible data querying
4. **Machine Learning**: For persona optimization
5. **Multi-tenancy**: For SaaS deployment
6. **Advanced AI**: Fine-tuned models for specific use cases

### Technology Evolution

- **Database**: Consider time-series databases for metrics
- **Message Queue**: Evaluate Apache Kafka for high throughput
- **Caching**: Implement distributed caching with Redis Cluster
- **Monitoring**: Advanced APM with distributed tracing

---

This architecture provides a solid foundation for Mimic's growth while maintaining flexibility for future enhancements and scale.
