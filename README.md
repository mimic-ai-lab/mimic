# Mimic 🤖

> **Source-available platform for stress-testing conversational AI agents with realistic, LLM-driven virtual users**

[![License: Elastic 2.0](https://img.shields.io/badge/License-Elastic%202.0-blue.svg)](https://www.elastic.co/licensing/elastic-license)
[![Fair-code](https://img.shields.io/badge/Fair--code-Enabled-green.svg)](https://faircode.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4.9.1-blue.svg)](https://yarnpkg.com/)
[![Turbo](https://img.shields.io/badge/Turbo-2.5.4-blue.svg)](https://turbo.build/)

## 🎯 What is Mimic?

Mimic is an immersive testing arena where lifelike virtual personas interact with your chat-, web-socket-, and voice-based assistants exactly as real people would—only faster, louder, and at limitless scale.

It's where product managers, conversational designers, and QA teams watch their assistants navigate everything from mundane small talk to once-in-a-lifetime emergencies, uncovering hidden flaws long before launch day.

## 🚀 Key Features

- **AI-Powered Agent Bootstrap**  
  Automatically generate realistic personas and evaluation metrics when creating new agents. Uses OpenAI to create platform-specific personas with detailed demographics, communication styles, and conversation patterns. Each agent gets custom evaluation criteria based on its purpose and platform.

- **Persona Swarms**  
  Instantly spin up hundreds—or thousands—of synthetic users, each with unique backstories, emotional tones, and conversation quirks. Mix and match demographics, languages, and typing styles (emoji-heavy, typo-prone, rapid-fire, etc.) to see how your assistant handles the glorious unpredictability of real human variety.

- **Voice Agents & IVR**  
  Run end-to-end phone calls with crystal-clear speech, silence detection, cross-talk, and interruptions. Test wake-word timing, DTMF menus, and caller patience thresholds—exposing awkward pauses, misrecognitions, and IVR dead ends before your customers do.

- **Time-Travel Scenarios**  
  Accelerate a user's life arc—simulate months or years in minutes, replay events on demand, and verify your assistant adapts to long-term changes, remembers promises, and evolves with the user.

- **Stress & Spike Testing**  
  Ramp your test bed from calm Monday mornings to holiday-season chaos with a click. Adjustable think-time jitter, concurrency, and burst profiles let you confirm backend resilience and latency safeguards under real-world surges.

- **Edge-Case Discovery**  
  Inject garbled audio, code-switched language, sarcasm, or double-negatives. Persona "troublemakers" push your assistant off script to expose hidden loops and "that should never happen" moments—because they always do.

- **Insightful Dashboard**  
  Get live transcripts, heat maps of slow responses, and persona-by-persona success rates. Export every session for deeper analysis in your BI stack, transforming conversations into actionable data.

- **Plugin-Ready & Extensible**  
  Add new channels—Slack, Telegram, SMS—via drop-in adapters. Create custom persona generators or analytics panels in TypeScript. The community (or your team) can extend Mimic without waiting for core releases.

- **Fair-Code Freedom**  
  Source available, free for personal and internal company use. Transparent roadmap, welcoming PRs—build trust with stakeholders while protecting your commercial edge.

## 🏗️ Architecture

```
apps/
├── api/          # Fastify server (REST/GraphQL, webhooks, auth)
├── web/          # Next.js 14 dashboard (RSC / App Router)
└── worker/       # Temporal worker (workflows & activities)

packages/
├── core/         # Domain types, ORM, logger (shared)
├── temporal-workflows/  # Shared Temporal workflows & activities
├── adapters/     # Protocol adapters (whatsapp, voice, ws...)
├── plugin-sdk/   # Public plugin API for community extensions
└── cli/          # `mimic <cmd>` helpers

infra/            # Terraform / Docker Compose / Helm (IaC)
```

### 🔄 Temporal Workflow Architecture

Mimic uses **Temporal** for orchestrating long-running processes like agent bootstrap workflows:

- **Agent Bootstrap Workflow**: Automatically generates personas and evaluations when agents are created
- **Shared Workflows**: Reusable workflow definitions in `packages/temporal-workflows`
- **Activities**: Discrete units of work (OpenAI calls, database operations)
- **Temporal Cloud**: Managed Temporal service for production reliability

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Yarn** 4.9.1+
- **PostgreSQL** (for data persistence)
- **Temporal Cloud** (for workflow orchestration)
- **OpenAI API** (for persona and evaluation generation)

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
# 💡 Suggested: Use [Neon](https://neon.tech) for PostgreSQL hosting

# Server Configuration
API_SERVER_PORT=4000
NODE_ENV=development
LOG_LEVEL=info

# Clerk Authentication
CLERK_PUBLISHABLE_KEY="pk_test_your-clerk-publishable-key"
CLERK_SECRET_KEY="sk_test_your-clerk-secret-key"
CLERK_WEBHOOK_SECRET="whsec_your-clerk-webhook-secret"
# 💡 Get your keys from [Clerk Dashboard](https://dashboard.clerk.com)

# Temporal Cloud (for workflow orchestration)
TEMPORAL_API_KEY="your-temporal-cloud-api-key"
TEMPORAL_NAMESPACE="your-temporal-namespace"
TEMPORAL_ADDRESS="your-temporal-cloud-address"
# 💡 Get your keys from [Temporal Cloud](https://cloud.temporal.io)

# OpenAI (for persona and evaluation generation)
OPENAI_API_KEY="your-openai-api-key"
# 💡 Get your key from [OpenAI Platform](https://platform.openai.com)

# Optional: Sentry for error tracking
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
```

## 📖 Documentation

- **[Getting Started](./docs/getting-started.md)** - First steps with Mimic
- **[Architecture](./docs/architecture.md)** - Detailed system design
- **[API Reference](./docs/api-reference.md)** - REST API documentation
- **[Plugin Development](./docs/plugins.md)** - Building custom adapters
- **[Deployment](./docs/deployment.md)** - Production deployment guide
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to Mimic

## 🔌 API Specification

- **OpenAPI Spec**: [apps/api/apispec.yaml](./apps/api/apispec.yaml)
- **Postman Collection**: [Import to Postman](https://go.postman.co/workspace/ebf1269a-f80c-4dd8-84b8-79d7aed9abbb/collection)

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

### CLI & API Key Authentication

Mimic supports both web dashboard (JWT auth) and CLI (API key auth) interfaces:

```bash
# CLI usage with API key
curl -X POST http://localhost:4000/api/cli/agents \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-team-api-key" \
  -d '{
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "agent_type": "chat",
    "platform": "whatsapp"
  }'
```

**API Key Features:**

- Team-scoped authentication
- Automatic persona and evaluation generation
- Temporal workflow orchestration
- Secure SHA-256 hashed storage

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

1. **Pre-launch Certification**  
   Can your retail assistant handle 2,000 shoppers asking for return labels at once? Mimic lets you find out—before launch day.

2. **Regression Testing in CI**  
   Every pull-request spins a mini swarm—fail the build if conversation quality drops.

3. **Localization QA**  
   Feed the same scenario through en-GB, hi-IN, and es-MX personas to catch cultural slip-ups and ensure your assistant is truly global-ready.

4. **Voice Prompt Tuning**  
   Measure how many callers bail out after hearing a 30-second disclaimer, then rewrite & retest instantly.

5. **Longitudinal Behavior Audits**  
   Time-travel five simulated years: did your wellness assistant keep its long-term diet advice consistent?

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

Mimic is **source-available** under the **Elastic License 2.0** and follows the [fair-code](https://faircode.io/) software model.

### What this means:

**✅ You CAN:**

- Use Mimic for personal projects
- Use Mimic within your company (even with 10,000+ employees)
- Modify and extend the code
- Contribute back to the community
- Self-host for internal use

**❌ You CANNOT:**

- Provide Mimic as a commercial hosted service
- Sell Mimic or modified versions
- Use Mimic for commercial consulting services
- Commercialize any derivative works

**📝 Important:** This is **source-available** software, not OSI-approved open source. The source code is publicly available, but commercial use is restricted to protect the project's sustainability.

For commercial use inquiries, please [contact the Mimic team](mailto:hello@mimicailab.com).

## 🙏 Acknowledgments

- Built with [Fastify](https://fastify.io/) for blazing-fast APIs
- Powered by [Next.js 14](https://nextjs.org/) for the dashboard
- Workflow orchestration with [Temporal](https://temporal.io/)
- AI-powered persona generation with [OpenAI](https://openai.com/)
- Monorepo orchestration with [Turborepo](https://turbo.build/)

## 📞 Support

- **Documentation**: [docs/](./docs/)
  - **Issues**: [GitHub Issues](https://github.com/mimic-ai-lab/mimic/issues)
  - **Discussions**: [GitHub Discussions](https://github.com/mimic-ai-lab/mimic/discussions)
- **Discord**: [Join our community](https://discord.gg/6WjrYg7Q)

---

**Made with ❤️ by the Mimic team**
