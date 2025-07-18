'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'User',
    email: 'user@example.com',
    avatar: '/avatars/user.jpg',
  },
  teams: [
    {
      name: 'Mimic AI Lab',
      logo: Bot,
      plan: 'Pro',
    },
    {
      name: 'Test Environment',
      logo: SquareTerminal,
      plan: 'Development',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/',
        },
        {
          title: 'Analytics',
          url: '/analytics',
        },
        {
          title: 'Reports',
          url: '/reports',
        },
      ],
    },
    {
      title: 'Sessions',
      url: '/sessions',
      icon: SquareTerminal,
      items: [
        {
          title: 'Active Sessions',
          url: '/sessions/active',
        },
        {
          title: 'Session History',
          url: '/sessions/history',
        },
        {
          title: 'Create Session',
          url: '/sessions/create',
        },
      ],
    },
    {
      title: 'Personas',
      url: '/personas',
      icon: Bot,
      items: [
        {
          title: 'All Personas',
          url: '/personas',
        },
        {
          title: 'Create Persona',
          url: '/personas/create',
        },
        {
          title: 'Templates',
          url: '/personas/templates',
        },
      ],
    },
    {
      title: 'Agents',
      url: '/agents',
      icon: AudioWaveform,
      items: [
        {
          title: 'All Agents',
          url: '/agents',
        },
        {
          title: 'Add Agent',
          url: '/agents/create',
        },
        {
          title: 'Protocols',
          url: '/agents/protocols',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'Account',
          url: '/settings/account',
        },
        {
          title: 'API Keys',
          url: '/settings/api-keys',
        },
        {
          title: 'Billing',
          url: '/settings/billing',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'WhatsApp Bot Testing',
      url: '/projects/whatsapp',
      icon: Frame,
    },
    {
      name: 'Voice IVR Testing',
      url: '/projects/voice',
      icon: AudioWaveform,
    },
    {
      name: 'WebSocket Testing',
      url: '/projects/websocket',
      icon: SquareTerminal,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
