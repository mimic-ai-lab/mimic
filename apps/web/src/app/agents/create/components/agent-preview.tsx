'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Shield, Clock, Activity } from 'lucide-react';
import { Platform, FormData } from '../types';

interface AgentPreviewProps {
  formData: FormData;
  platform: Platform;
}

export function AgentPreview({ formData, platform }: AgentPreviewProps) {
  return (
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
            <p className="text-sm text-gray-600">{platform.name}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-gray-700">Enterprise-grade security</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">24/7 availability</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="text-gray-700">Real-time analytics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
