'use client';

import {
  Plus,
  Bot,
  MessageSquare,
  Phone,
  X,
  ChevronRight,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Image from 'next/image';

interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
  platforms: Platform[];
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
}

const agentTypes: AgentType[] = [
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Perfect for messaging platforms and text-based interactions',
    icon: '/images/icons/chat-agent.png',
    color: 'from-blue-500 to-purple-600',
    features: ['WhatsApp', 'Slack', 'Teams', 'WebSocket'],
    platforms: [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: '/images/icons/whatsapp.png',
        description: 'Connect to WhatsApp Business API for messaging',
        features: ['Business API', 'Webhook Support', 'Media Messages'],
      },
      {
        id: 'slack',
        name: 'Slack',
        icon: '/images/icons/slack.png',
        description: 'Integrate with Slack workspace for team communication',
        features: ['Slack API', 'Channel Integration', 'Direct Messages'],
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: '/images/icons/teams.png',
        description: 'Connect to Teams channels for enterprise communication',
        features: ['Teams API', 'Channel Integration', 'Meeting Support'],
      },
      {
        id: 'sms',
        name: 'SMS',
        icon: '/images/icons/sms.png',
        description: 'Send and receive SMS messages via mobile networks',
        features: ['SMS API', 'Global Coverage', 'Delivery Reports'],
      },
      {
        id: 'email',
        name: 'Email',
        icon: '/images/icons/email.png',
        description: 'Handle email communications and notifications',
        features: ['SMTP/IMAP', 'Email Templates', 'Auto-replies'],
      },
      {
        id: 'websocket',
        name: 'WebSocket',
        icon: '/images/icons/websocket.png',
        description: 'Custom WebSocket integration for real-time communication',
        features: ['Real-time', 'Custom Protocol', 'Bi-directional'],
      },
    ],
  },
  {
    id: 'voice',
    name: 'Voice Agent',
    description: 'Ideal for phone calls and voice-based interactions',
    icon: '/images/icons/voice-agent.png',
    color: 'from-orange-500 to-red-600',
    features: ['Twilio', 'Custom Voice', 'Phone Systems'],
    platforms: [
      {
        id: 'twilio',
        name: 'Twilio Voice',
        icon: '/images/icons/websocket.png',
        description: 'Connect via Twilio Voice API for phone calls',
        features: ['Voice API', 'Call Recording', 'IVR Support'],
      },
      {
        id: 'custom',
        name: 'Custom Voice',
        icon: '/images/icons/websocket.png',
        description: 'Custom voice integration for specialized needs',
        features: ['Custom API', 'Flexible Integration', 'Advanced Features'],
      },
      {
        id: 'phone',
        name: 'Phone System',
        icon: '/images/icons/websocket.png',
        description: 'Traditional phone system integration',
        features: ['PSTN Support', 'Call Routing', 'Voicemail'],
      },
    ],
  },
];

export default function AgentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    webhookUrl: '',
    apiVersion: '',
    slackToken: '',
    slackChannel: '',
    teamsWebhook: '',
    teamsChannel: '',
    smsProvider: '',
    smsNumber: '',
    emailAddress: '',
    emailProvider: '',
    websocketUrl: '',
    websocketProtocol: '',
    timezone: '',
    language: '',
  });

  const handleAgentTypeSelect = (agentType: AgentType) => {
    setSelectedAgentType(agentType);
    setStep(2);
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setStep(3);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Creating agent:', {
      selectedAgentType,
      selectedPlatform,
      formData,
    });
    setIsOpen(false);
    setStep(1);
    setSelectedAgentType(null);
    setSelectedPlatform(null);
    setFormData({
      name: '',
      description: '',
      webhookUrl: '',
      apiVersion: '',
      slackToken: '',
      slackChannel: '',
      teamsWebhook: '',
      teamsChannel: '',
      smsProvider: '',
      smsNumber: '',
      emailAddress: '',
      emailProvider: '',
      websocketUrl: '',
      websocketProtocol: '',
      timezone: '',
      language: '',
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setSelectedAgentType(null);
    setSelectedPlatform(null);
    setFormData({
      name: '',
      description: '',
      webhookUrl: '',
      apiVersion: '',
      slackToken: '',
      slackChannel: '',
      teamsWebhook: '',
      teamsChannel: '',
      smsProvider: '',
      smsNumber: '',
      emailAddress: '',
      emailProvider: '',
      websocketUrl: '',
      websocketProtocol: '',
      timezone: '',
      language: '',
    });
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="text-center">
                <DialogTitle className="text-xl font-semibold mb-2">
                  Create New Agent
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mb-4">
                  {step === 1 && 'Choose the type of agent you want to create'}
                  {step === 2 &&
                    `Configure your ${selectedAgentType?.name.toLowerCase()}`}
                  {step === 3 && 'Finalize your agent configuration'}
                </DialogDescription>
              </div>

              {/* Progress indicator */}
              <div className="mt-2">
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                        step >= 1
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}
                    >
                      {step > 1 ? <Check className="h-4 w-4" /> : 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">
                      Agent Type
                    </span>
                  </div>

                  <div
                    className={`h-0.5 w-8 ${step > 1 ? 'bg-primary' : 'bg-muted'}`}
                  />

                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                        step >= 2
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}
                    >
                      {step > 2 ? <Check className="h-4 w-4" /> : 2}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">
                      Platform
                    </span>
                  </div>

                  <div
                    className={`h-0.5 w-8 ${step > 2 ? 'bg-primary' : 'bg-muted'}`}
                  />

                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                        step >= 3
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}
                    >
                      {step > 3 ? <Check className="h-4 w-4" /> : 3}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">
                      Configure
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {agentTypes.map((agentType) => (
                      <Card
                        key={agentType.id}
                        className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 relative overflow-hidden"
                        onClick={() => handleAgentTypeSelect(agentType)}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${agentType.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <Image
                                  src={agentType.icon}
                                  alt={agentType.name}
                                  fill
                                  className="object-cover p-2"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {agentType.name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                {agentType.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {agentType.features.map((feature, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Zap className="w-3 h-3" />
                                  <span>Ready to deploy</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      Can&apos;t find what you&apos;re looking for?{' '}
                      <button className="text-primary hover:underline font-medium">
                        Contact support
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && selectedAgentType && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="secondary">{selectedAgentType.name}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Select platform
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {selectedAgentType.platforms.map((platform) => (
                      <Card
                        key={platform.id}
                        className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 relative overflow-hidden"
                        onClick={() => handlePlatformSelect(platform)}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${selectedAgentType.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <Image
                                  src={platform.icon}
                                  alt={platform.name}
                                  fill
                                  className="object-cover p-2"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {platform.name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Recommended
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                {platform.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {platform.features.map((feature, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Zap className="w-3 h-3" />
                                  <span>Ready to connect</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Back to Agent Types
                  </Button>
                </div>
              )}

              {step === 3 && selectedAgentType && selectedPlatform && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {selectedAgentType.name}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {selectedPlatform.name}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Final Configuration
                    </span>
                  </div>

                  <div className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Basic Information
                          </h3>
                          <p className="text-sm text-gray-600">
                            Essential details about your agent
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            Agent Name *
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g., Customer Support Bot, Sales Assistant"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Choose a descriptive name that reflects the
                            agent&apos;s purpose
                          </p>
                        </div>

                        <div>
                          <Label
                            htmlFor="description"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            Description *
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe what this agent does, its capabilities, and how it helps users..."
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Provide context for your team about this
                            agent&apos;s role and responsibilities
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Platform Configuration Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedPlatform.name} Configuration
                          </h3>
                          <p className="text-sm text-gray-600">
                            Connect your agent to {selectedPlatform.name}
                          </p>
                        </div>
                      </div>

                      {selectedPlatform.id === 'whatsapp' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="webhookUrl"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Webhook Endpoint URL *
                            </Label>
                            <Input
                              id="webhookUrl"
                              placeholder="https://api.yourcompany.com/webhooks/whatsapp"
                              value={formData.webhookUrl}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  webhookUrl: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              WhatsApp will send incoming messages to this
                              secure endpoint
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="apiVersion"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              API Version
                            </Label>
                            <Input
                              id="apiVersion"
                              placeholder="v17.0"
                              value={formData.apiVersion}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  apiVersion: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Specify WhatsApp Business API version
                              (recommended: v17.0)
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.id === 'slack' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="slackToken"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Slack Bot Token *
                            </Label>
                            <Input
                              id="slackToken"
                              placeholder="xoxb-your-bot-token"
                              value={formData.slackToken || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slackToken: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Obtain this from your Slack app settings in the
                              Slack API dashboard
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="slackChannel"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Default Channel
                            </Label>
                            <Input
                              id="slackChannel"
                              placeholder="#general"
                              value={formData.slackChannel || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slackChannel: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Primary channel for agent messages (optional)
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.id === 'teams' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="teamsWebhook"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Teams Webhook URL *
                            </Label>
                            <Input
                              id="teamsWebhook"
                              placeholder="https://outlook.office.com/webhook/..."
                              value={formData.teamsWebhook || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  teamsWebhook: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Create this webhook in your Microsoft Teams
                              channel settings
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="teamsChannel"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Teams Channel
                            </Label>
                            <Input
                              id="teamsChannel"
                              placeholder="General"
                              value={formData.teamsChannel || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  teamsChannel: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Target channel for agent messages (optional)
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.id === 'sms' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="smsProvider"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              SMS Provider *
                            </Label>
                            <Input
                              id="smsProvider"
                              placeholder="Twilio, Vonage, or your preferred provider"
                              value={formData.smsProvider || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smsProvider: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Your SMS service provider for sending and
                              receiving messages
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="smsNumber"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Phone Number *
                            </Label>
                            <Input
                              id="smsNumber"
                              placeholder="+1 (555) 123-4567"
                              value={formData.smsNumber || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smsNumber: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Phone number for sending and receiving SMS
                              messages
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.id === 'email' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="emailAddress"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Email Address *
                            </Label>
                            <Input
                              id="emailAddress"
                              placeholder="agent@yourcompany.com"
                              value={formData.emailAddress || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  emailAddress: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Dedicated email address for the agent
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="emailProvider"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Email Provider
                            </Label>
                            <Input
                              id="emailProvider"
                              placeholder="Gmail, Outlook, or custom SMTP"
                              value={formData.emailProvider || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  emailProvider: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Email service provider (optional)
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPlatform.id === 'websocket' && (
                        <div className="grid gap-6">
                          <div>
                            <Label
                              htmlFor="websocketUrl"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              WebSocket URL *
                            </Label>
                            <Input
                              id="websocketUrl"
                              placeholder="wss://your-server.com/ws"
                              value={formData.websocketUrl || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  websocketUrl: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              WebSocket server endpoint for real-time
                              communication
                            </p>
                          </div>

                          <div>
                            <Label
                              htmlFor="websocketProtocol"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Protocol
                            </Label>
                            <Input
                              id="websocketProtocol"
                              placeholder="JSON, Protocol Buffers, or custom"
                              value={formData.websocketProtocol || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  websocketProtocol: e.target.value,
                                })
                              }
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Message protocol format (optional)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Advanced Settings Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Advanced Settings
                          </h3>
                          <p className="text-sm text-gray-600">
                            Optional configurations for power users
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        <div>
                          <Label
                            htmlFor="timezone"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            Timezone
                          </Label>
                          <Input
                            id="timezone"
                            placeholder="UTC"
                            value={formData.timezone || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                timezone: e.target.value,
                              })
                            }
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Timezone for message timestamps (defaults to UTC)
                          </p>
                        </div>

                        <div>
                          <Label
                            htmlFor="language"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            Language
                          </Label>
                          <Input
                            id="language"
                            placeholder="en-US"
                            value={formData.language || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                language: e.target.value,
                              })
                            }
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Primary language for the agent (defaults to en-US)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!formData.name || !formData.description}
                    >
                      Create Agent
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first agent to start building conversational AI
                experiences. Choose from chat or voice agents.
              </p>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Agent
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
