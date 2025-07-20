'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentTypeCard } from './components/agent-type-card';
import { PlatformCard } from './components/platform-card';
import { BasicInfoForm } from './components/basic-info-form';
import { PlatformConfigForm } from './components/platform-config-form';
import { AgentPreview } from './components/agent-preview';
import { AdvancedSettings } from './components/advanced-settings';
import { agentTypes } from './data/agent-types';
import { AgentType, Platform, FormData } from './types';

export default function CreateAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType | null>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
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
    router.push('/agents');
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedPlatform(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedAgentType(null);
    } else {
      router.push('/agents');
    }
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
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
              <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Which assistant are you testing with Mimic?
              </h2>
              <p className="text-md text-gray-600 max-w-2xl mx-auto">
                Simulate real conversations and events—before your assistant
                ever goes live.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {agentTypes.map((agentType) => (
                <AgentTypeCard
                  key={agentType.id}
                  agentType={agentType}
                  onSelect={handleAgentTypeSelect}
                />
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
              <h2 className="text-2xl font-bold text-gray-900">
                Choose your {selectedAgentType.name.toLowerCase()} platform
              </h2>
              <p className="text-md text-gray-600 max-w-2xl mx-auto">
                Simulate real conversations on every platform. Mimic connects to
                your webhook, delivering the same events you’d get from the
                official API.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedAgentType.platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  agentType={selectedAgentType}
                  onSelect={handlePlatformSelect}
                />
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
                <BasicInfoForm
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
                <PlatformConfigForm
                  platform={selectedPlatform}
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <AgentPreview formData={formData} platform={selectedPlatform} />
                <AdvancedSettings
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
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
