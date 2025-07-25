# Getting Started with Mimic

Welcome to Mimic! This guide will help you get up and running with stress-testing your conversational AI agents.

## 🎯 What You'll Learn

By the end of this guide, you'll have:

- ✅ Mimic running locally
- ✅ Created your first agent via CLI
- ✅ Generated AI-powered personas and evaluations
- ✅ Set up Temporal workflows for agent bootstrap

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** 4.9.1+ (`npm install -g yarn`)
- **PostgreSQL** (for data persistence)
- **Temporal Cloud** (for workflow orchestration)
- **OpenAI API** (for persona and evaluation generation)

### Installing PostgreSQL

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows

- **PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mimic-ai-lab/mimic.git
cd mimic
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/mimic"

# Temporal Cloud (for workflow orchestration)
TEMPORAL_API_KEY="your-temporal-cloud-api-key"
TEMPORAL_NAMESPACE="your-temporal-namespace"
TEMPORAL_ADDRESS="your-temporal-cloud-address"

# OpenAI Configuration (for persona and evaluation generation)
OPENAI_API_KEY="your-openai-api-key"

# Clerk Authentication (for web dashboard)
CLERK_PUBLISHABLE_KEY="pk_test_your-clerk-publishable-key"
CLERK_SECRET_KEY="sk_test_your-clerk-secret-key"
CLERK_WEBHOOK_SECRET="whsec_your-clerk-webhook-secret"
```

### 4. Database Setup

Create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mimic;
CREATE USER mimic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mimic TO mimic_user;
```

### 5. Start Development Servers

```bash
yarn dev
```

This will start:

- **API Server** at http://localhost:4000
- **Dashboard** at http://localhost:3000
- **Temporal Worker** (background workflow processing)

## 🤖 Creating Your First Agent

### 1. Using the CLI (Recommended)

Create an agent using the CLI with API key authentication:

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
      "webhook_url": "https://your-bot.com/webhook",
      "phone_number": "+1234567890"
    }
  }'
```

**What happens automatically:**

- ✅ Agent is created in your team's database
- ✅ Temporal workflow triggers agent bootstrap
- ✅ OpenAI generates realistic persona for the agent
- ✅ OpenAI generates custom evaluation metrics
- ✅ Both persona and evaluations are saved to database

### 2. Using the Web Dashboard

Alternatively, create an agent through the web dashboard:

1. Open http://localhost:3000 in your browser
2. Navigate to **Agents** → **Create New**
3. Fill in the agent details
4. The system will automatically generate personas and evaluations

## 🧪 Monitoring Your Agent

### 1. Check Generated Personas

View the AI-generated personas for your agent:

```bash
# List agents to see your created agent
curl -X GET http://localhost:4000/api/cli/agents \
  -H "X-API-Key: your-team-api-key"
```

### 2. Check Generated Evaluations

The system automatically creates evaluation metrics for your agent:

- **Response Time Evaluation**: Measures agent response latency
- **Sentiment Analysis**: Evaluates customer satisfaction
- **Accuracy Metrics**: Tracks correct responses
- **Custom Metrics**: Platform-specific evaluations

### 3. Monitor Temporal Workflows

Check the worker logs to see the bootstrap process:

```bash
# In the worker terminal, you should see:
# 🚀 Starting agent bootstrap workflow for agent: [agent-id]
# 🎭 Generating personas...
# ✅ OpenAI persona generated: [persona details]
# ✅ Persona saved to database for agent: [agent-id]
# 📊 Generating evaluations...
# ✅ OpenAI evaluations generated: [evaluation details]
# ✅ X evaluations saved to database for agent: [agent-id]
```

## 🔧 Configuration Options

### Agent Configuration

Agents can be configured with different platforms and types:

```typescript
interface Agent {
  name: string;
  description: string;
  agent_type: 'chat' | 'voice';
  platform: string; // 'whatsapp', 'telegram', 'slack', etc.
  platform_config: Record<string, any>;
  status: 'draft' | 'active' | 'paused' | 'archived';
  is_active: boolean;
}
```

### Platform Configurations

#### WhatsApp Agent

```json
{
  "agent_type": "chat",
  "platform": "whatsapp",
  "platform_config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890",
    "welcome_message": "Hello! How can I help you today?"
  }
}
```

#### Telegram Agent

```json
{
  "agent_type": "chat",
  "platform": "telegram",
  "platform_config": {
    "bot_token": "your-telegram-bot-token",
    "webhook_url": "https://your-bot.com/webhook"
  }
}
```

### AI-Generated Data

The system automatically generates:

- **Personas**: Realistic user profiles with demographics, communication styles, and conversation patterns
- **Evaluations**: Custom metrics based on agent purpose and platform
- **Simulation Tags**: Categories for organizing test scenarios

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: Database connection failed
```

**Solution**: Check your DATABASE_URL and ensure PostgreSQL is running:

```bash
psql -U postgres -d mimic -c "SELECT 1;"
```

#### 2. Temporal Cloud Connection Error

```
Error: Temporal connection failed
```

**Solution**: Verify your Temporal Cloud credentials in the `.env` file:

```bash
# Check environment variables
echo $TEMPORAL_API_KEY
echo $TEMPORAL_NAMESPACE
echo $TEMPORAL_ADDRESS
```

#### 3. OpenAI API Error

```
Error: OpenAI API key invalid
```

**Solution**: Verify your OPENAI_API_KEY in the `.env` file.

#### 4. Worker Not Starting

```
Error: Worker failed to start
```

**Solution**: Check that the worker can load environment variables:

```bash
# In apps/worker directory
cd apps/worker
yarn dev
```

### Getting Help

- **Documentation**: Check the [docs/](./) directory
  - **Issues**: [GitHub Issues](https://github.com/mimic-ai-lab/mimic/issues)
  - **Discussions**: [GitHub Discussions](https://github.com/mimic-ai-lab/mimic/discussions)

## 🎉 Next Steps

Now that you have Mimic running, explore:

1. **[Architecture Guide](./architecture.md)** - Understand the system design
2. **[API Reference](./api-reference.md)** - Integrate with your own tools
3. **[CLI Documentation](./cli.md)** - Use the command-line interface
4. **[Deployment Guide](./deployment.md)** - Deploy to production

Happy agent building! 🚀
