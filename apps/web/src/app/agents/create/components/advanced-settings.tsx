'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { FormData } from '../types';

interface AdvancedSettingsProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'it-IT', name: 'Italian (Italy)' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'ru-RU', name: 'Russian (Russia)' },
  { code: 'ja-JP', name: 'Japanese (Japan)' },
  { code: 'ko-KR', name: 'Korean (South Korea)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
  { code: 'hi-IN', name: 'Hindi (India)' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)' },
  { code: 'sv-SE', name: 'Swedish (Sweden)' },
  { code: 'da-DK', name: 'Danish (Denmark)' },
  { code: 'no-NO', name: 'Norwegian (Norway)' },
  { code: 'fi-FI', name: 'Finnish (Finland)' },
  { code: 'pl-PL', name: 'Polish (Poland)' },
  { code: 'tr-TR', name: 'Turkish (Turkey)' },
  { code: 'he-IL', name: 'Hebrew (Israel)' },
  { code: 'th-TH', name: 'Thai (Thailand)' },
  { code: 'vi-VN', name: 'Vietnamese (Vietnam)' },
  { code: 'id-ID', name: 'Indonesian (Indonesia)' },
  { code: 'ms-MY', name: 'Malay (Malaysia)' },
  { code: 'tl-PH', name: 'Filipino (Philippines)' },
];

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Europe/Rome', label: 'Central European Time (CET)' },
  { value: 'Europe/Madrid', label: 'Central European Time (CET)' },
  { value: 'Europe/Amsterdam', label: 'Central European Time (CET)' },
  { value: 'Europe/Brussels', label: 'Central European Time (CET)' },
  { value: 'Europe/Vienna', label: 'Central European Time (CET)' },
  { value: 'Europe/Zurich', label: 'Central European Time (CET)' },
  { value: 'Europe/Stockholm', label: 'Central European Time (CET)' },
  { value: 'Europe/Oslo', label: 'Central European Time (CET)' },
  { value: 'Europe/Copenhagen', label: 'Central European Time (CET)' },
  { value: 'Europe/Helsinki', label: 'Eastern European Time (EET)' },
  { value: 'Europe/Warsaw', label: 'Central European Time (CET)' },
  { value: 'Europe/Prague', label: 'Central European Time (CET)' },
  { value: 'Europe/Budapest', label: 'Central European Time (CET)' },
  { value: 'Europe/Bucharest', label: 'Eastern European Time (EET)' },
  { value: 'Europe/Sofia', label: 'Eastern European Time (EET)' },
  { value: 'Europe/Athens', label: 'Eastern European Time (EET)' },
  { value: 'Europe/Istanbul', label: 'Turkey Time (TRT)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
  { value: 'Asia/Bangkok', label: 'Indochina Time (ICT)' },
  { value: 'Asia/Manila', label: 'Philippine Time (PHT)' },
  { value: 'Asia/Jakarta', label: 'Western Indonesian Time (WIB)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Riyadh', label: 'Arabia Standard Time (AST)' },
  { value: 'Asia/Tehran', label: 'Iran Standard Time (IRST)' },
  { value: 'Asia/Jerusalem', label: 'Israel Standard Time (IST)' },
  { value: 'Africa/Cairo', label: 'Eastern European Time (EET)' },
  { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST)' },
  { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time (AET)' },
  { value: 'Australia/Perth', label: 'Australian Western Time (AWT)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)' },
];

export function AdvancedSettings({
  formData,
  onFormDataChange,
}: AdvancedSettingsProps) {
  const [timezoneSearch, setTimezoneSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  const filteredTimezones = timezones.filter((timezone) =>
    timezone.label.toLowerCase().includes(timezoneSearch.toLowerCase())
  );

  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Generic search handler function
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSearch: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSearch(e.target.value);
  };

  const handleTimezoneSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e, setTimezoneSearch);

  const handleLanguageSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e, setLanguageSearch);

  const handleTimezoneSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
  };

  const handleLanguageSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
  };

  return (
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
          <Select
            value={formData.timezone || 'UTC'}
            onValueChange={(value) => onFormDataChange({ timezone: value })}
          >
            <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search timezones..."
                    value={timezoneSearch}
                    onChange={handleTimezoneSearchChange}
                    onKeyDown={handleTimezoneSearchKeyDown}
                    className="pl-8 h-8 text-sm"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredTimezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
                {filteredTimezones.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No timezones found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            Select the base timezone for all simulated users. (Default: UTC)
          </p>
        </div>

        <div>
          <Label
            htmlFor="language"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Language
          </Label>
          <Select
            value={formData.language || 'en-US'}
            onValueChange={(value) => onFormDataChange({ language: value })}
          >
            <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={handleLanguageSearchChange}
                    onKeyDown={handleLanguageSearchKeyDown}
                    className="pl-8 h-8 text-sm"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredLanguages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
                {filteredLanguages.length === 0 && (
                  <div className="px-2 py-1 text-sm text-gray-500">
                    No languages found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            Choose the default language/locale for user personas. (e.g. English
            (UK), en-US)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
