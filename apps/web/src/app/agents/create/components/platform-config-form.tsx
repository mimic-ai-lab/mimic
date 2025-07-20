'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { Platform, FormData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare } from 'lucide-react';

interface PlatformConfigFormProps {
  platform: Platform;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export function PlatformConfigForm({
  platform,
  formData,
  onFormDataChange,
}: PlatformConfigFormProps) {
  // Reusable function for checkbox change handling
  const handleCheckboxChange = (
    messageType: string,
    checked: boolean,
    currentFormData: FormData,
    onFormDataChange: (data: Partial<FormData>) => void
  ) => {
    const current = currentFormData.messageTypes || ['text'];
    const updated = checked
      ? [...current, messageType]
      : current.filter((t: string) => t !== messageType);
    onFormDataChange({ messageTypes: updated });
  };

  const renderPlatformFields = () => {
    switch (platform.id) {
      case 'whatsapp':
        return (
          <div className="grid gap-6">
            <div>
              <Label
                htmlFor="webhookUrl"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Webhook URL *
              </Label>
              <Input
                id="webhookUrl"
                placeholder="https://api.yourcompany.com/webhooks/whatsapp"
                value={formData.webhookUrl || ''}
                onChange={(e) =>
                  onFormDataChange({ webhookUrl: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Mimic will POST simulated messages to this endpoint.
              </p>
            </div>

            <div>
              <Label
                htmlFor="apiVersion"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                WhatsApp API Version
              </Label>
              <Select
                value={formData.apiVersion || 'v23.0'}
                onValueChange={(value) =>
                  onFormDataChange({ apiVersion: value })
                }
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select API version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v23.0">v23.0 (Latest)</SelectItem>
                  <SelectItem value="v22.0">v22.0</SelectItem>
                  <SelectItem value="v21.0">v21.0</SelectItem>
                  <SelectItem value="v20.0">v20.0</SelectItem>
                  <SelectItem value="v19.0">v19.0</SelectItem>
                  <SelectItem value="v18.0">v18.0</SelectItem>
                  <SelectItem value="v17.0">v17.0</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Emulate the Business API version (we recommend v23.0).
              </p>
            </div>

            {/* WhatsApp Message Types Configuration */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Message Types to Simulate
                    </h3>
                    <p className="text-sm text-gray-600">
                      Choose which types of messages your agent should be able
                      to handle and simulate.
                    </p>
                  </div>
                </div>

                {/* Received Messages */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Received Messages
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="text-messages"
                        checked={
                          formData.messageTypes?.includes('text') ?? true
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'text',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="text-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Text Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Basic text communication
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="reaction-messages"
                        checked={
                          formData.messageTypes?.includes('reaction') ?? true
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'reaction',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="reaction-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Reaction Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Emoji reactions to messages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="media-messages"
                        checked={
                          formData.messageTypes?.includes('media') ?? true
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'media',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="media-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Media Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Images, videos, documents
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="location-messages"
                        checked={
                          formData.messageTypes?.includes('location') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'location',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="location-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Location Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Location sharing capabilities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="contacts-messages"
                        checked={
                          formData.messageTypes?.includes('contacts') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'contacts',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="contacts-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Contacts Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Contact card sharing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="callback-messages"
                        checked={
                          formData.messageTypes?.includes('callback') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'callback',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="callback-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Quick Reply Buttons
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Interactive button responses
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="list-messages"
                        checked={
                          formData.messageTypes?.includes('list') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'list',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="list-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          List Messages
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Structured list responses
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="reply-messages"
                        checked={
                          formData.messageTypes?.includes('reply') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'reply',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="reply-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Reply Buttons
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Message reply buttons
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <Checkbox
                        id="ads-messages"
                        checked={
                          formData.messageTypes?.includes('ads') ?? false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleCheckboxChange(
                            'ads',
                            checked,
                            formData,
                            onFormDataChange
                          );
                        }}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="ads-messages"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Click to WhatsApp Ads
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Ad-triggered messages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'slack':
        return (
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
                  onFormDataChange({ slackToken: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Mimic will use this token to simulate Slack events and
                interactions.
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
                  onFormDataChange({ slackChannel: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Primary channel for simulated Slack messages (optional).
              </p>
            </div>
          </div>
        );

      case 'teams':
        return (
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
                placeholder="https://yourcompany.webhook.office.com/webhookb2/..."
                value={formData.teamsWebhook || ''}
                onChange={(e) =>
                  onFormDataChange({ teamsWebhook: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Mimic will POST simulated Teams messages to this webhook
                endpoint.
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
                  onFormDataChange({ teamsChannel: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Target channel for simulated Teams conversations (optional).
              </p>
            </div>
          </div>
        );

      case 'sms':
        return (
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
                placeholder="Twilio, Vonage, or your custom provider"
                value={formData.smsProvider || ''}
                onChange={(e) =>
                  onFormDataChange({ smsProvider: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Specify your SMS service provider for simulation.
              </p>
            </div>

            <div>
              <Label
                htmlFor="smsNumber"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                SMS Number
              </Label>
              <Input
                id="smsNumber"
                placeholder="+1234567890"
                value={formData.smsNumber || ''}
                onChange={(e) =>
                  onFormDataChange({ smsNumber: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Phone number for SMS simulation (optional).
              </p>
            </div>
          </div>
        );

      case 'email':
        return (
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
                placeholder="support@yourcompany.com"
                value={formData.emailAddress || ''}
                onChange={(e) =>
                  onFormDataChange({ emailAddress: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Email address for simulated email interactions.
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
                  onFormDataChange({ emailProvider: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Specify your email service provider (optional).
              </p>
            </div>
          </div>
        );

      case 'websocket':
        return (
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
                placeholder="wss://yourcompany.com/websocket"
                value={formData.websocketUrl || ''}
                onChange={(e) =>
                  onFormDataChange({ websocketUrl: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                WebSocket endpoint for real-time message simulation.
              </p>
            </div>

            <div>
              <Label
                htmlFor="websocketProtocol"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                WebSocket Protocol
              </Label>
              <Input
                id="websocketProtocol"
                placeholder="wss:// or ws://"
                value={formData.websocketProtocol || ''}
                onChange={(e) =>
                  onFormDataChange({ websocketProtocol: e.target.value })
                }
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Specify the WebSocket protocol (optional).
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Configuration options for {platform.name} will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">
              {platform.name} Configuration
            </CardTitle>
            <CardDescription>
              Connect Mimic to your {platform.name} flows
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">{renderPlatformFields()}</CardContent>
    </Card>
  );
}
