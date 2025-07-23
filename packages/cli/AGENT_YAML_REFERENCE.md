# Agent YAML Reference

This document provides a comprehensive reference for the `agent.yaml` file format used by the Mimic CLI.

## Basic Structure

```yaml
name: 'Agent Name'
description: 'Agent description'
agent_type: 'chat' # or "voice"
platform: 'whatsapp' # platform-specific
platform_config:
  # Platform-specific settings
```

## Field Reference

### Required Fields

| Field             | Type   | Description                      | Example                             |
| ----------------- | ------ | -------------------------------- | ----------------------------------- |
| `name`            | string | Agent name (1-255 chars)         | `"Customer Support Bot"`            |
| `description`     | string | Agent description (1-1000 chars) | `"AI agent for handling inquiries"` |
| `agent_type`      | enum   | Type of agent                    | `"chat"` or `"voice"`               |
| `platform`        | string | Communication platform           | `"whatsapp"`, `"slack"`, etc.       |
| `platform_config` | object | Platform-specific settings       | See platform sections below         |

### Optional Fields

| Field     | Type   | Description                   | Example                                  |
| --------- | ------ | ----------------------------- | ---------------------------------------- |
| `id`      | UUID   | Agent ID for updates/versions | `"550e8400-e29b-41d4-a716-446655440000"` |
| `version` | string | Version string                | `"1.0.0"`, `"v2.1.3"`                    |

## Agent Types

### Chat Agents (`agent_type: "chat"`)

Chat agents handle text-based conversations across messaging platforms.

**Supported Platforms:**

- `whatsapp` - WhatsApp Business API
- `slack` - Slack Bot API
- `teams` - Microsoft Teams
- `sms` - SMS messaging
- `email` - Email integration
- `websocket` - WebSocket connections

### Voice Agents (`agent_type: "voice"`)

Voice agents handle audio-based conversations and phone calls.

**Supported Platforms:**

- `twilio` - Twilio Voice API
- `custom` - Custom voice integration
- `phone` - Traditional phone systems

## Platform Configurations

### WhatsApp Configuration

```yaml
agent_type: 'chat'
platform: 'whatsapp'
platform_config:
  webhook_url: 'https://api.mimicai.co/webhooks/whatsapp'
  display_phone_number: '+1234567890'
  phone_number_id: '2331313123213'
  graph_api_version: 'v23.0'
```

**Required Fields:**

- `webhook_url` - Valid HTTPS URL for webhook endpoint
- `display_phone_number` - International phone number format (`+1234567890`)
- `phone_number_id` - WhatsApp phone number ID (non-empty string)
- `graph_api_version` - Facebook Graph API version (`vXX.X` format)

### Slack Configuration

```yaml
agent_type: 'chat'
platform: 'slack'
platform_config:
  slackToken: 'xoxb-your-bot-token'
  slackChannel: '#general' # optional
```

**Required Fields:**

- `slackToken` - Slack bot token (starts with `xoxb-`)

**Optional Fields:**

- `slackChannel` - Default channel for messages

### Teams Configuration

```yaml
agent_type: 'chat'
platform: 'teams'
platform_config:
  teamsWebhook: 'https://yourcompany.webhook.office.com/webhookb2/...'
  teamsChannel: 'General' # optional
```

**Required Fields:**

- `teamsWebhook` - Microsoft Teams webhook URL

**Optional Fields:**

- `teamsChannel` - Target channel name

## Validation Rules

### General Rules

1. **Name**: 1-255 characters, required
2. **Description**: 1-1000 characters, required
3. **Agent Type**: Must be `"chat"` or `"voice"`
4. **Platform**: Must be valid for the selected agent type
5. **ID**: If provided, must be a valid UUID format

### Platform Compatibility

| Agent Type | Valid Platforms                                           |
| ---------- | --------------------------------------------------------- |
| `chat`     | `whatsapp`, `slack`, `teams`, `sms`, `email`, `websocket` |
| `voice`    | `twilio`, `custom`, `phone`                               |

### URL Validation

- All webhook URLs must be valid HTTPS URLs
- Must include protocol (`https://`)
- Must have valid domain structure

### Phone Number Validation

- Must be in international format
- Must start with `+` followed by country code
- Must be 7-15 digits total
- Example: `+1234567890`

### Version Auto-Generation

If an `id` is provided but no `version` is specified, the CLI will:

- Auto-generate version numbers (v1, v2, v3, etc.)
- Show a warning about auto-generation
- Allow manual version specification

## Example Configurations

### Complete WhatsApp Agent

```yaml
name: 'Customer Support Bot'
id: '550e8400-e29b-41d4-a716-446655440000'
version: '1.0.0'
description: 'AI agent for handling customer inquiries and support tickets'
agent_type: 'chat'
platform: 'whatsapp'
platform_config:
  webhook_url: 'https://api.mimicai.co/webhooks/whatsapp'
  display_phone_number: '+1234567890'
  phone_number_id: '2331313123213'
  graph_api_version: 'v23.0'
```

### Minimal Slack Agent

```yaml
name: 'Slack Helper'
description: 'Slack bot for team assistance'
agent_type: 'chat'
platform: 'slack'
platform_config:
  slackToken: 'xoxb-your-bot-token'
```

### Voice Agent

```yaml
name: 'Call Center Agent'
description: 'Voice agent for customer calls'
agent_type: 'voice'
platform: 'twilio'
platform_config:
  accountSid: 'your-account-sid'
  authToken: 'your-auth-token'
  phoneNumber: '+1234567890'
```

## Common Validation Errors

### Schema Errors

```
❌ Agent name is required
❌ Description is required
❌ Agent type must be 'chat' or 'voice'
❌ Platform is required
```

### Platform Compatibility Errors

```
❌ Platform 'invalid_platform' is not valid for agent type 'chat'
Valid platforms: whatsapp, slack, teams, sms, email, websocket
```

### WhatsApp Configuration Errors

```
❌ Webhook URL must be a valid URL
❌ Phone number must be in international format (e.g., +1234567890)
❌ Phone number ID is required
❌ Graph API version must be in format vXX.X (e.g., v23.0)
```

### UUID Format Errors

```
❌ Agent ID must be a valid UUID
```

## Best Practices

1. **Use Descriptive Names**: Choose clear, descriptive agent names
2. **Provide Detailed Descriptions**: Explain what the agent does
3. **Validate Early**: Use `mimic agent validate` before deployment
4. **Version Control**: Use version strings for tracking changes
5. **Secure Configuration**: Keep sensitive tokens secure
6. **Test Configurations**: Validate with `--verbose` flag for details

## CLI Commands

```bash
# Validate agent configuration
mimic agent validate agent.yaml

# Verbose validation with details
mimic agent validate agent.yaml --verbose

# Show help
mimic agent --help
mimic agent validate --help
```
