'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, ChevronRight, Play, Check } from 'lucide-react';
import { AgentType } from '../types';

interface AgentTypeCardProps {
  agentType: AgentType;
  onSelect: (agentType: AgentType) => void;
}

export function AgentTypeCard({ agentType, onSelect }: AgentTypeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      <Card
        className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden ${
          isHovered ? 'ring-2 ring-blue-500/50 shadow-xl' : ''
        }`}
        onClick={() => onSelect(agentType)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${agentType.color} opacity-5 group-hover:opacity-10 transition-all duration-500`}
        />
        <CardContent className="py-2 px-6 relative">
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
          isHovered
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
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">{agentType.preview.demo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
