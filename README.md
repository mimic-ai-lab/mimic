# Mimic 🤖

> **Open-core platform for stress-testing conversational AI agents with realistic, LLM-driven virtual users**

[![License: Elastic 2.0](https://img.shields.io/badge/License-Elastic%202.0-blue.svg)](https://www.elastic.co/licensing/elastic-license)
[![Fair-code](https://img.shields.io/badge/Fair--code-Enabled-green.svg)](https://faircode.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4.9.1-blue.svg)](https://yarnpkg.com/)
[![Turbo](https://img.shields.io/badge/Turbo-2.5.4-blue.svg)](https://turbo.build/)

## 🎯 What is Mimic?

Mimic is an open-core platform that lets developers **stress-test** their conversational or voice AI agents with swarms of realistic, LLM-driven "virtual users."

Point Mimic at your WhatsApp bot, WebSocket server, or voice IVR, define a few persona prompts, and Mimic spins up hundreds of simulated parents, customers, or gamers that chat, call, and push your agent to its limits—so you can find edge-cases before real customers do.

### 🚀 Key Features

- **🔄 Multi-Protocol Support**: WhatsApp, Voice IVR, WebSocket, REST APIs
- **🎭 Dynamic Personas**: LLM-driven virtual users with realistic behaviors
- **📊 Real-time Monitoring**: Live dashboard for session tracking and analytics
- **⚡ Scalable Architecture**: Built with Fastify, Next.js, and BullMQ
- **🔌 Plugin System**: Extensible adapter system for custom protocols
- **🛠️ Developer-Friendly**: TypeScript, monorepo, hot-reload development

## 🏗️ Architecture

```
apps/
├── api/          # Fastify server (REST/GraphQL, webhooks, auth)
├── web/          # Next.js 14 dashboard (RSC / App Router)
└── worker/       # BullMQ executor (sessions & personas)

packages/
├── core/         # Domain types, ORM, logger (shared)
├── adapters/     # Protocol adapters (whatsapp, voice, ws...)
├── plugin-sdk/   # Public plugin API for community extensions
└── cli/          # `mimic <cmd>` helpers

infra/            # Terraform / Docker Compose / Helm (IaC)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Yarn** 4.9.1+
- **Redis** (for BullMQ)
- **PostgreSQL** (for data persistence)

### Installation

```bash
# Clone the repository
git clone https://github.com/mimic-ai-lab/mimic.git
cd mimic

# Install dependencies
yarn install

# Start development servers
yarn dev
```

This will start:

- **API** at http://localhost:4000
- **Dashboard** at http://localhost:3000
- **Worker** (background processing)

### Environment Setup

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mimic"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI (for LLM personas)
OPENAI_API_KEY="your-openai-key"

# Optional: External services
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
```

## 📖 Documentation

- **[Getting Started](./docs/getting-started.md)** - First steps with Mimic
- **[Architecture](./docs/architecture.md)** - Detailed system design
- **[API Reference](./docs/api-reference.md)** - REST API documentation
- **[Plugin Development](./docs/plugins.md)** - Building custom adapters
- **[Deployment](./docs/deployment.md)** - Production deployment guide
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to Mimic

## 🛠️ Development

### Monorepo Structure

This project uses **Yarn 4 workspaces** with **Turborepo** for build orchestration.

```bash
# Install dependencies
yarn install

# Development (all apps)
yarn dev

# Build all packages
yarn build

# Lint all code
yarn lint

# Type checking
yarn type-check

# Clean build artifacts
yarn clean
```

### Package Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `yarn dev`        | Start all apps in development mode |
| `yarn build`      | Build all packages for production  |
| `yarn lint`       | Lint all TypeScript code           |
| `yarn lint:fix`   | Fix linting issues automatically   |
| `yarn test`       | Run tests across all packages      |
| `yarn type-check` | Type check all packages            |

## 🎯 Use Cases

### 1. **Customer Service Bot Testing**

Test your WhatsApp customer service bot with hundreds of realistic customer personas, each with different pain points and communication styles.

### 2. **Voice IVR Stress Testing**

Simulate call center volumes with diverse caller personas to ensure your voice system handles edge cases gracefully.

### 3. **Gaming Chat Bot Validation**

Test your Discord or Twitch chat bot with various gamer personas, from casual players to hardcore enthusiasts.

### 4. **E-commerce Support Simulation**

Create personas for different customer types (first-time buyers, returns, complaints) to test your support automation.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the **Elastic License 2.0** and follows the [fair-code](https://faircode.io/) software model.

### What this means:

**✅ You CAN:**

- Use Mimic for personal projects
- Use Mimic within your company (even with 10,000+ employees)
- Modify and extend the code
- Contribute back to the community

**❌ You CANNOT:**

- Provide Mimic as a commercial hosted service
- Sell Mimic or modified versions
- Use Mimic for commercial consulting services

For commercial use inquiries, please [contact the Mimic team](mailto:your-email@example.com).

## 🙏 Acknowledgments

- Built with [Fastify](https://fastify.io/) for blazing-fast APIs
- Powered by [Next.js 14](https://nextjs.org/) for the dashboard
- Job processing with [BullMQ](https://docs.bullmq.io/)
- Monorepo orchestration with [Turborepo](https://turbo.build/)

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/mimic-ai-lab/mimic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mimic-ai-lab/mimic/discussions)
- **Discord**: [Join our community](https://discord.gg/mimic)

---

**Made with ❤️ by the Mimic team**
