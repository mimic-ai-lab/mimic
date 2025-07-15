# Getting Started with Mimic

Welcome to Mimic! This guide will help you get up and running with stress-testing your conversational AI agents.

## 🎯 What You'll Learn

By the end of this guide, you'll have:

- ✅ Mimic running locally
- ✅ Created your first persona
- ✅ Set up a test session
- ✅ Monitored results in the dashboard

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** 4.9.1+ (`npm install -g yarn`)
- **Redis** (for job processing)
- **PostgreSQL** (for data persistence)

### Installing Redis & PostgreSQL

#### macOS (using Homebrew)

```bash
# Install Redis
brew install redis
brew services start redis

# Install PostgreSQL
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian

```bash
# Install Redis
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows

- **Redis**: Download from [redis.io](https://redis.io/download)
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

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# OpenAI Configuration (for LLM personas)
OPENAI_API_KEY="your-openai-api-key"

# Optional: External Services
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
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
- **Worker** (background processing)

## 🎭 Creating Your First Persona

### 1. Access the Dashboard

Open http://localhost:3000 in your browser.

### 2. Create a Persona

Navigate to **Personas** → **Create New**:

```json
{
  "name": "Frustrated Customer",
  "description": "A customer who is having trouble with their order",
  "prompt": "You are a frustrated customer who ordered a product online. The order was delayed, and you're calling customer service to get help. You're polite but clearly annoyed. You want a resolution quickly.",
  "traits": {
    "communication_style": "direct",
    "patience_level": "low",
    "urgency": "high"
  }
}
```

### 3. Configure Your Agent

Go to **Agents** → **Add Agent**:

```json
{
  "name": "My WhatsApp Bot",
  "type": "whatsapp",
  "config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890"
  }
}
```

## 🧪 Running Your First Test

### 1. Create a Session

In the dashboard, go to **Sessions** → **New Session**:

- **Agent**: Select your configured agent
- **Persona**: Choose "Frustrated Customer"
- **Duration**: 5 minutes
- **Concurrent Users**: 10

### 2. Monitor the Session

Watch the real-time dashboard as:

- Virtual users start conversations
- Messages are exchanged
- Analytics are updated

### 3. Review Results

After the session completes:

- **Session Summary**: Overall performance metrics
- **Message Logs**: Full conversation history
- **Error Analysis**: Any issues encountered
- **Performance Metrics**: Response times, success rates

## 🔧 Configuration Options

### Persona Configuration

Personas can be customized with:

```typescript
interface Persona {
  name: string;
  description: string;
  prompt: string; // LLM prompt for behavior
  traits: {
    communication_style: 'formal' | 'casual' | 'direct';
    patience_level: 'low' | 'medium' | 'high';
    urgency: 'low' | 'medium' | 'high';
    technical_knowledge: 'none' | 'basic' | 'advanced';
  };
  message_interval: number; // Seconds between messages
  session_duration: number; // Maximum session length
}
```

### Agent Configuration

Different agent types support various configurations:

#### WhatsApp Agent

```json
{
  "type": "whatsapp",
  "config": {
    "webhook_url": "https://your-bot.com/webhook",
    "phone_number": "+1234567890",
    "api_key": "your-whatsapp-api-key"
  }
}
```

#### Voice Agent

```json
{
  "type": "voice",
  "config": {
    "twilio_account_sid": "your-sid",
    "twilio_auth_token": "your-token",
    "phone_number": "+1234567890"
  }
}
```

#### WebSocket Agent

```json
{
  "type": "websocket",
  "config": {
    "url": "wss://your-websocket-server.com",
    "protocol": "chat",
    "headers": {
      "Authorization": "Bearer your-token"
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Redis Connection Error

```
Error: Redis connection failed
```

**Solution**: Ensure Redis is running:

```bash
redis-cli ping
# Should return PONG
```

#### 2. Database Connection Error

```
Error: Database connection failed
```

**Solution**: Check your DATABASE_URL and ensure PostgreSQL is running:

```bash
psql -U postgres -d mimic -c "SELECT 1;"
```

#### 3. OpenAI API Error

```
Error: OpenAI API key invalid
```

**Solution**: Verify your OPENAI_API_KEY in the `.env` file.

#### 4. Port Already in Use

```
Error: Port 3000/4000 already in use
```

**Solution**: Kill the process or change ports in package.json.

### Getting Help

- **Documentation**: Check the [docs/](./) directory
- **Issues**: [GitHub Issues](https://github.com/mimic-ai-lab/mimic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mimic-ai-lab/mimic/discussions)

## 🎉 Next Steps

Now that you have Mimic running, explore:

1. **[Architecture Guide](./architecture.md)** - Understand the system design
2. **[API Reference](./api-reference.md)** - Integrate with your own tools
3. **[Plugin Development](./plugins.md)** - Build custom adapters
4. **[Deployment Guide](./deployment.md)** - Deploy to production

Happy testing! 🚀
