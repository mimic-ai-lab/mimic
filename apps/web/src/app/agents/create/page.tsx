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
  ArrowLeft,
  Play,
  Settings,
  Shield,
  Globe,
  Clock,
  Users,
  Activity,
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
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
  platforms: Platform[];
  preview: {
    title: string;
    description: string;
    features: string[];
    demo: string;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  demo: string;
}

const agentTypes: AgentType[] = [
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Perfect for messaging platforms and text-based interactions',
    icon: '/images/icons/chat-agent.png',
    color: 'from-blue-500 to-purple-600',
    features: ['WhatsApp', 'Slack', 'Teams', 'WebSocket'],
    preview: {
      title: 'Conversational AI at Scale',
      description:
        'Deploy intelligent chat agents across multiple messaging platforms with enterprise-grade reliability.',
      features: [
        'Multi-platform support',
        'Real-time responses',
        'Context awareness',
        'Analytics dashboard',
      ],
      demo: 'See how customers interact with your chat agent in real-time',
    },
    platforms: [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: '/images/icons/whatsapp.png',
        description: 'Connect to WhatsApp Business API for messaging',
        features: ['Business API', 'Webhook Support', 'Media Messages'],
        demo: 'Send and receive messages via WhatsApp Business',
      },
      {
        id: 'slack',
        name: 'Slack',
        icon: '/images/icons/slack.png',
        description: 'Integrate with Slack workspace for team communication',
        features: ['Slack API', 'Channel Integration', 'Direct Messages'],
        demo: 'Automate team workflows and customer support',
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: '/images/icons/teams.png',
        description: 'Connect to Teams channels for enterprise communication',
        features: ['Teams API', 'Channel Integration', 'Meeting Support'],
        demo: 'Enterprise-grade collaboration with AI assistance',
      },
      {
        id: 'sms',
        name: 'SMS',
        icon: '/images/icons/sms.png',
        description: 'Send and receive SMS messages via mobile networks',
        features: ['SMS API', 'Global Coverage', 'Delivery Reports'],
        demo: 'Reach customers anywhere with SMS automation',
      },
      {
        id: 'email',
        name: 'Email',
        icon: '/images/icons/email.png',
        description: 'Handle email communications and notifications',
        features: ['SMTP/IMAP', 'Email Templates', 'Auto-replies'],
        demo: 'Automated email responses and customer service',
      },
      {
        id: 'websocket',
        name: 'WebSocket',
        icon: '/images/icons/websocket.png',
        description: 'Custom WebSocket integration for real-time communication',
        features: ['Real-time', 'Custom Protocol', 'Bi-directional'],
        demo: 'Custom integrations for specialized use cases',
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
    preview: {
      title: 'Voice-First AI Experience',
      description:
        'Create natural voice interactions that feel human and deliver exceptional customer experiences.',
      features: [
        'Natural language processing',
        'Voice analytics',
        'Call recording',
        'IVR integration',
      ],
      demo: 'Experience voice agent capabilities with interactive demo',
    },
    platforms: [
      {
        id: 'twilio',
        name: 'Twilio Voice',
        icon: '/images/icons/websocket.png',
        description: 'Connect via Twilio Voice API for phone calls',
        features: ['Voice API', 'Call Recording', 'IVR Support'],
        demo: 'Professional voice interactions with Twilio',
      },
      {
        id: 'custom',
        name: 'Custom Voice',
        icon: '/images/icons/websocket.png',
        description: 'Custom voice integration for specialized needs',
        features: ['Custom API', 'Flexible Integration', 'Advanced Features'],
        demo: 'Tailored voice solutions for unique requirements',
      },
      {
        id: 'phone',
        name: 'Phone System',
        icon: '/images/icons/websocket.png',
        description: 'Traditional phone system integration',
        features: ['PSTN Support', 'Call Routing', 'Voicemail'],
        demo: 'Integrate with existing phone infrastructure',
      },
    ],
  },
];

export default function CreateAgentPage() {
  const [step, setStep] = useState(1);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
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
    console.log('Creating agent:', {
      selectedAgentType,
      selectedPlatform,
      formData,
    });
    window.location.href = '/agents';
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedPlatform(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedAgentType(null);
    } else {
      window.location.href = '/agents';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/agents"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Agents</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Create New Agent
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Choose Your Agent Type</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                What type of agent do you need?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select the perfect agent type for your use case. Each type is
                optimized for specific interaction patterns.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {agentTypes.map((agentType) => (
                <div key={agentType.id} className="relative group">
                  <Card
                    className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden ${
                      hoveredAgent === agentType.id
                        ? 'ring-2 ring-blue-500/50 shadow-xl'
                        : ''
                    }`}
                    onClick={() => handleAgentTypeSelect(agentType)}
                    onMouseEnter={() => setHoveredAgent(agentType.id)}
                    onMouseLeave={() => setHoveredAgent(null)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${agentType.color} opacity-5 group-hover:opacity-10 transition-all duration-500`}
                    />
                    <CardContent className="p-8 relative">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={agentType.icon}
                              alt={agentType.name}
                              fill
                              className="object-cover p-3"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {agentType.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                            >
                              <Sparkles className="w-4 h-4 mr-1" />
                              Popular
                            </Badge>
                          </div>
                          <p className="text-base text-gray-600 mb-6 leading-relaxed">
                            {agentType.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {agentType.features.map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-sm bg-white/50 backdrop-blur-sm"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Zap className="w-4 h-4" />
                              <span>Ready to deploy</span>
                            </div>
                            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interactive Preview Panel */}
                  <div
                    className={`absolute -right-4 top-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transition-all duration-300 ease-out ${
                      hoveredAgent === agentType.id
                        ? 'opacity-100 transform translate-x-0'
                        : 'opacity-0 transform translate-x-4 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          {agentType.preview.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {agentType.preview.description}
                      </p>
                      <div className="space-y-2">
                        {agentType.preview.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {agentType.preview.demo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedAgentType && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Agent Types</span>
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Globe className="w-4 h-4" />
                <span>Select Your Platform</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Choose your {selectedAgentType.name.toLowerCase()} platform
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect your agent to the platforms your customers use most.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedAgentType.platforms.map((platform) => (
                <Card
                  key={platform.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50 relative overflow-hidden"
                  onClick={() => handlePlatformSelect(platform)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${selectedAgentType.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={platform.icon}
                            alt={platform.name}
                            fill
                            className="object-cover p-2"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {platform.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                          {platform.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
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
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Activity className="w-3 h-3" />
                            <span>Ready to connect</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedAgentType && selectedPlatform && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Platform Selection</span>
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Settings className="w-4 h-4" />
                <span>Final Configuration</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Configure your {selectedPlatform.name} agent
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Set up your agent with enterprise-grade configuration options.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Section */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Basic Information
                        </CardTitle>
                        <CardDescription>
                          Essential details about your agent
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
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
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Provide context for your team about this agent&apos;s
                          role and responsibilities
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Configuration Section */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedPlatform.name} Configuration
                        </CardTitle>
                        <CardDescription>
                          Connect your agent to {selectedPlatform.name}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            WhatsApp will send incoming messages to this secure
                            endpoint
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
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Specify WhatsApp Business API version (recommended:
                            v17.0)
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
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Primary channel for agent messages (optional)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Add other platform configurations here */}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Agent Preview */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Agent Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formData.name || 'Your Agent'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedPlatform.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">
                          Enterprise Security
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700">24/7 Availability</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700">
                          Real-time Analytics
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                          setFormData({ ...formData, timezone: e.target.value })
                        }
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
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
                          setFormData({ ...formData, language: e.target.value })
                        }
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                disabled={!formData.name || !formData.description}
              >
                Create Agent
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
