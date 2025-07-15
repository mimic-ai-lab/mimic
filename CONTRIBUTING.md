# Contributing to Mimic 🤝

Thank you for your interest in contributing to Mimic! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

We welcome contributions from the community! Here are the main ways you can help:

- 🐛 **Bug Reports**: Report bugs and issues
- 💡 **Feature Requests**: Suggest new features
- 📝 **Documentation**: Improve docs and guides
- 🔧 **Code Contributions**: Submit pull requests
- 🧪 **Testing**: Help test features and fixes
- 🌍 **Translations**: Help translate the interface

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)
- [License Information](#license-information)

## 🤝 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Yarn** 4.9.1+
- **Git**
- **Redis** (for development)
- **PostgreSQL** (for development)

### Quick Start

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/mimic.git
   cd mimic
   ```

2. **Set up the development environment**

   ```bash
   # Install dependencies
   yarn install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration

   # Start development servers
   yarn dev
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mimic"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI (for LLM personas)
OPENAI_API_KEY="your-openai-api-key"

# Development
NODE_ENV="development"
LOG_LEVEL="debug"
```

### Available Scripts

```bash
# Development
yarn dev              # Start all apps in development mode
yarn dev:api          # Start only the API server
yarn dev:web          # Start only the web dashboard
yarn dev:worker       # Start only the worker

# Building
yarn build            # Build all packages
yarn build:api        # Build only the API
yarn build:web        # Build only the web app
yarn build:worker     # Build only the worker

# Testing
yarn test             # Run all tests
yarn test:unit        # Run unit tests only
yarn test:integration # Run integration tests only
yarn test:e2e         # Run end-to-end tests

# Code Quality
yarn lint             # Lint all code
yarn lint:fix         # Fix linting issues
yarn type-check       # Type check all packages
yarn format           # Format code with Prettier

# Utilities
yarn clean            # Clean build artifacts
yarn reset            # Reset database and cache
```

### Database Setup

```bash
# Create database
createdb mimic

# Run migrations (when implemented)
yarn db:migrate

# Seed development data (when implemented)
yarn db:seed
```

## 📝 Coding Standards

### TypeScript Guidelines

- **Strict Mode**: All code must pass TypeScript strict mode
- **Type Safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use enums for constants with string values

```typescript
// ✅ Good
interface SessionConfig {
  agentId: string;
  personaId: string;
  duration: number;
  maxMessages?: number;
}

// ❌ Avoid
const config: any = {
  agentId: '123',
  personaId: '456',
};
```

### Code Style

We use **ESLint** and **Prettier** for consistent code formatting:

```bash
# Check code style
yarn lint

# Fix code style issues
yarn lint:fix

# Format code
yarn format
```

### File Naming

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
type(scope): description

feat(api): add session creation endpoint
fix(web): resolve dashboard loading issue
docs(readme): update installation instructions
test(worker): add job processing tests
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Testing Standards

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows
- **Coverage**: Aim for 80%+ code coverage

```typescript
// Example test structure
describe('SessionService', () => {
  describe('createSession', () => {
    it('should create a new session with valid config', async () => {
      // Test implementation
    });

    it('should throw error with invalid config', async () => {
      // Test implementation
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows our standards**

   ```bash
   yarn lint
   yarn type-check
   yarn test
   ```

2. **Update documentation** if needed
3. **Add tests** for new features
4. **Update changelog** if applicable

### PR Guidelines

1. **Title**: Use conventional commit format

   ```
   feat(api): add session management endpoints
   ```

2. **Description**: Include:
   - What the PR does
   - Why it's needed
   - How to test it
   - Screenshots (for UI changes)

3. **Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: At least one maintainer review required
3. **Approval**: Maintainer approval needed to merge
4. **Merge**: Squash and merge for clean history

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template and include:

- **Environment**: OS, Node.js version, dependencies
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Logs**: Error messages and stack traces

### Feature Requests

Use the feature request template and include:

- **Problem**: What problem does this solve?
- **Solution**: How should it work?
- **Alternatives**: What other solutions exist?
- **Additional Context**: Any other relevant information

## 🏷️ Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority
- `priority: low` - Low priority
- `status: in progress` - Currently being worked on
- `status: blocked` - Blocked by something else

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

### Release Steps

1. **Create Release Branch**

   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version**

   ```bash
   yarn version --new-version 1.0.0
   ```

3. **Update Changelog**
   - Document all changes
   - Credit contributors
   - Note breaking changes

4. **Create Release**
   - Tag the release
   - Write release notes
   - Publish to npm (if applicable)

## 📄 License Information

Mimic is licensed under the **Elastic License 2.0** and follows the [fair-code](https://faircode.io/) software model.

### What this means for contributors:

**✅ You CAN:**

- Use Mimic for personal projects
- Use Mimic within your company (even with 10,000+ employees)
- Modify and extend the code
- Contribute back to the community
- Distribute modified versions

**❌ You CANNOT:**

- Provide Mimic as a commercial hosted service
- Sell Mimic or modified versions
- Use Mimic to provide commercial consulting services
- Commercialize any derivative works

### Why Fair-code?

Fair-code ensures that:

- **Creators can sustain development** through commercial use
- **Community benefits** from open collaboration
- **Contributors are respected** for their work
- **Long-term viability** of the project

By contributing to Mimic, you agree that your contributions will be licensed under the [Elastic License 2.0](./LICENSE).

## 🎯 Areas for Contribution

### High Priority

- **Core Features**: Session management, persona system
- **Adapters**: WhatsApp, Voice, WebSocket implementations
- **Dashboard**: Real-time monitoring and analytics
- **Testing**: Unit and integration tests

### Medium Priority

- **Documentation**: API docs, tutorials, examples
- **Performance**: Optimization and caching
- **Security**: Authentication, authorization
- **Monitoring**: Metrics and alerting

### Low Priority

- **UI/UX**: Dashboard improvements
- **CLI Tools**: Command-line utilities
- **Plugins**: Third-party integrations
- **Translations**: Internationalization

## 🤝 Community

### Getting Help

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/mimic-ai-lab/mimic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mimic-ai-lab/mimic/discussions)
- **Discord**: [Join our community](https://discord.gg/6WjrYg7Q)

### Recognition

Contributors are recognized in:

- **README.md** - Contributors section
- **CHANGELOG.md** - Release notes
- **GitHub Contributors** - Profile badges

---

Thank you for contributing to Mimic! 🚀
