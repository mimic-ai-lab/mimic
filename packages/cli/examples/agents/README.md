# Agent YAML Examples

This folder contains example `agent.yaml` files for testing and reference purposes.

## Example Files

### ✅ Valid Examples

- **`test-agent.yaml`** - Basic valid WhatsApp agent configuration

  ```bash
  mimic agent validate test-agent.yaml
  # ✅ Agent configuration is valid!
  ```

- **`example-agent.yaml`** - Comprehensive example with comments and documentation

  ```bash
  mimic agent validate example-agent.yaml --verbose
  # ✅ Agent configuration is valid!
  # 📋 Validation Summary: Basic schema, Platform compatibility, Platform configuration
  ```

- **`test-agent-with-id.yaml`** - Valid agent with ID but no version (shows warning)
  ```bash
  mimic agent validate test-agent-with-id.yaml
  # ✅ Agent configuration is valid!
  # ⚠️  Warnings: Agent ID provided but no version specified...
  ```

### ❌ Invalid Examples (for testing error handling)

- **`test-invalid-agent.yaml`** - Invalid platform for chat agent type

  ```bash
  mimic agent validate test-invalid-agent.yaml
  # ❌ Agent configuration is invalid!
  # Errors: Platform 'invalid_platform' is not valid for agent type 'chat'
  ```

- **`test-whatsapp-invalid.yaml`** - WhatsApp agent with invalid configuration
  ```bash
  mimic agent validate test-whatsapp-invalid.yaml
  # ❌ Agent configuration is invalid!
  # Errors:
  #   1. Webhook URL must be a valid URL
  #   2. Phone number must be in international format
  #   3. Phone number ID is required
  #   4. Graph API version must be in format vXX.X
  ```

## Usage

```bash
# Test with valid examples
mimic agent validate test-agent.yaml
mimic agent validate example-agent.yaml --verbose

# Test error handling with invalid examples
mimic agent validate test-invalid-agent.yaml
mimic agent validate test-whatsapp-invalid.yaml

# Test warning scenarios
mimic agent validate test-agent-with-id.yaml
```

## File Structure

```
examples/agents/
├── README.md                    # This file
├── test-agent.yaml             # Basic valid WhatsApp agent
├── example-agent.yaml          # Comprehensive example with comments
├── test-agent-with-id.yaml    # Valid agent with ID (shows warning)
├── test-invalid-agent.yaml    # Invalid platform error test
└── test-whatsapp-invalid.yaml # WhatsApp validation error test
```

## Testing Different Scenarios

### Valid Configurations

- Basic required fields only
- Complete configuration with all optional fields
- Agent with ID but no version (warning scenario)

### Error Scenarios

- Invalid platform for agent type
- Invalid WhatsApp configuration (URL, phone, API version)
- Missing required fields
- Invalid data formats

### Warning Scenarios

- ID provided without version
- Empty platform configuration

Use these examples to test the validation system and understand different error and warning scenarios.
