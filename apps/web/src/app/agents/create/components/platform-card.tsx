'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Activity, ChevronRight } from 'lucide-react';
import { Platform, AgentType } from '../types';

interface PlatformCardProps {
  platform: Platform;
  agentType: AgentType;
  onSelect: (platform: Platform) => void;
}

export function PlatformCard({
  platform,
  agentType,
  onSelect,
}: PlatformCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50 relative overflow-hidden"
      onClick={() => onSelect(platform)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${agentType.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
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
              {platform.features.map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
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
  );
}
