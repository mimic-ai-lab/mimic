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
import { Textarea } from '@/components/ui/textarea';
import { Users } from 'lucide-react';
import { FormData } from '../types';

interface BasicInfoFormProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export function BasicInfoForm({
  formData,
  onFormDataChange,
}: BasicInfoFormProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Basic Information</CardTitle>
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
              placeholder="e.g. Customer Support Assistant"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
            <p className="text-xs text-gray-500 mt-2">
              Help your team identify this agent&apos;s role.
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
              placeholder="Describe what this assistant does and how it helps users..."
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ description: e.target.value })
              }
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-2">
              This summary guides Mimic’s virtual users and test personas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
