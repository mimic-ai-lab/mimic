'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Phone,
  Info,
  TestTube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export default function CreateAgentPage() {
  const [step, setStep] = useState(1);
  const [agentType, setAgentType] = useState<string>('');
  const [chatPlatform, setChatPlatform] = useState<string>('');
  const [agentName, setAgentName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [apiVersion, setApiVersion] = useState<string>('');
  const [websocketUrl, setWebsocketUrl] = useState<string>('');
  const [messageFormat, setMessageFormat] = useState<string>('');
  const [responseFormat, setResponseFormat] = useState<string>('');

  const chatPlatforms = [
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { value: 'slack', label: 'Slack', icon: '💼' },
    { value: 'teams', label: 'Microsoft Teams', icon: '🏢' },
    { value: 'websocket', label: 'WebSocket', icon: '🔌' },
  ];

  const apiVersions = [
    { value: 'v2.40', label: 'v2.40' },
    { value: 'v2.41', label: 'v2.41' },
    { value: 'v2.42', label: 'v2.42' },
  ];

  const isFormValid = () => {
    if (!agentName || !description) return false;
    if (agentType === 'voice' && !phoneNumber) return false;
    if (agentType === 'chat' && !chatPlatform) return false;
    if (chatPlatform && chatPlatform !== 'websocket' && !webhookUrl)
      return false;
    if (chatPlatform === 'websocket' && !websocketUrl) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating agent:', {
      agentType,
      chatPlatform,
      agentName,
      description,
      phoneNumber,
      webhookUrl,
      apiVersion,
      websocketUrl,
      messageFormat,
      responseFormat,
    });
  };

  const getStepProgress = () => {
    if (agentType && agentName && description) return 100;
    if (agentType && agentName) return 66;
    if (agentType) return 33;
    return 0;
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Agent</h2>
            <p className="text-muted-foreground">
              Configure your AI agent for testing
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TestTube className="h-3 w-3" />
          Beta
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Configuration Progress</span>
          <span>{getStepProgress()}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${getStepProgress()}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                1
              </span>
              Basic Information
            </CardTitle>
            <CardDescription>
              Start by providing the essential details about your agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-sm font-medium">
                Agent Name *
              </Label>
              <Input
                id="agentName"
                value={agentName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAgentName(e.target.value)
                }
                placeholder="e.g., Customer Support Bot"
                className="max-w-md"
                required
              />
              <p className="text-xs text-muted-foreground">
                Choose a unique name for your agent. This will be used to
                identify it in your dashboard.
              </p>
            </div>

            {/* Agent Type */}
            <div className="space-y-2">
              <Label htmlFor="agentType" className="text-sm font-medium">
                Agent Type *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <div
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                    agentType === 'chat'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => setAgentType('chat')}
                >
                  <input
                    type="radio"
                    name="agentType"
                    value="chat"
                    checked={agentType === 'chat'}
                    onChange={() => setAgentType('chat')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Chat Agent</div>
                      <div className="text-sm text-muted-foreground">
                        For messaging platforms like WhatsApp, Slack, Teams
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                    agentType === 'voice'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => setAgentType('voice')}
                >
                  <input
                    type="radio"
                    name="agentType"
                    value="voice"
                    checked={agentType === 'voice'}
                    onChange={() => setAgentType('voice')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Voice Agent</div>
                      <div className="text-sm text-muted-foreground">
                        For phone calls and voice interactions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this agent does..."
                rows={3}
                className="max-w-md"
                required
              />
              <p className="text-xs text-muted-foreground">
                Help your team understand what this agent is for.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Platform Configuration */}
        {agentType && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  2
                </span>
                Platform Configuration
              </CardTitle>
              <CardDescription>
                Configure the specific platform settings for your{' '}
                {agentType === 'chat' ? 'chat' : 'voice'} agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Voice Agent Configuration */}
              {agentType === 'voice' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium"
                      >
                        Agent Phone Number *
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter your Twilio phone number or SIP endpoint
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPhoneNumber(e.target.value)
                      }
                      placeholder="e.g., +1234567890"
                      className="max-w-md"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This is where Mimic will send simulated calls for testing.
                    </p>
                  </div>
                </div>
              )}

              {/* Chat Agent Configuration */}
              {agentType === 'chat' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="chatPlatform"
                      className="text-sm font-medium"
                    >
                      Chat Platform *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md">
                      {chatPlatforms.map((platform) => (
                        <div
                          key={platform.value}
                          className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-primary/50 ${
                            chatPlatform === platform.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                          onClick={() => setChatPlatform(platform.value)}
                        >
                          <input
                            type="radio"
                            name="chatPlatform"
                            value={platform.value}
                            checked={chatPlatform === platform.value}
                            onChange={() => setChatPlatform(platform.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">{platform.icon}</div>
                            <div className="text-sm font-medium">
                              {platform.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform-specific configuration */}
                  {chatPlatform && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-sm">
                        {chatPlatform.charAt(0).toUpperCase() +
                          chatPlatform.slice(1)}{' '}
                        Configuration
                      </h4>

                      {/* Webhook/WebSocket URL */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="endpointUrl"
                            className="text-sm font-medium"
                          >
                            {chatPlatform === 'websocket'
                              ? 'WebSocket URL'
                              : 'Webhook Endpoint URL'}{' '}
                            *
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {chatPlatform === 'websocket'
                                    ? 'The endpoint for simulated clients to connect'
                                    : 'Where Mimic sends simulated user messages/events'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="endpointUrl"
                          value={
                            chatPlatform === 'websocket'
                              ? websocketUrl
                              : webhookUrl
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (chatPlatform === 'websocket') {
                              setWebsocketUrl(e.target.value);
                            } else {
                              setWebhookUrl(e.target.value);
                            }
                          }}
                          placeholder={
                            chatPlatform === 'websocket'
                              ? 'ws://localhost:8080/websocket'
                              : 'https://your-app.com/webhook'
                          }
                          className="max-w-md"
                          required
                        />
                      </div>

                      {/* API Version (for WhatsApp, Slack, Teams) */}
                      {chatPlatform !== 'websocket' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="apiVersion"
                              className="text-sm font-medium"
                            >
                              API Version
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    API version for the platform integration
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Select
                            value={apiVersion}
                            onValueChange={setApiVersion}
                          >
                            <SelectTrigger className="max-w-md">
                              <SelectValue placeholder="Select API version" />
                            </SelectTrigger>
                            <SelectContent>
                              {apiVersions.map((version) => (
                                <SelectItem
                                  key={version.value}
                                  value={version.value}
                                >
                                  {version.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Message Format (for WebSocket) */}
                      {chatPlatform === 'websocket' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="messageFormat"
                              className="text-sm font-medium"
                            >
                              Message Format
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>What format do you expect messages in?</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Textarea
                            id="messageFormat"
                            value={messageFormat}
                            onChange={(e) => setMessageFormat(e.target.value)}
                            placeholder='{"type": "message", "content": "Hello", "user": "user123"}'
                            rows={3}
                            className="max-w-md"
                          />
                        </div>
                      )}

                      {/* Response Format (for WebSocket) */}
                      {chatPlatform === 'websocket' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="responseFormat"
                              className="text-sm font-medium"
                            >
                              Response Format
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>How does your agent reply?</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Textarea
                            id="responseFormat"
                            value={responseFormat}
                            onChange={(e) => setResponseFormat(e.target.value)}
                            placeholder='{"type": "response", "content": "Hi there!", "agent": "bot123"}'
                            rows={3}
                            className="max-w-md"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Test & Create */}
        {isFormValid() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  3
                </span>
                Test & Create
              </CardTitle>
              <CardDescription>
                Test your configuration and create your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TestTube className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Test Endpoint</div>
                    <div className="text-sm text-muted-foreground">
                      Verify your configuration is working
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid()}
            className="min-w-[120px]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </form>
    </div>
  );
}
