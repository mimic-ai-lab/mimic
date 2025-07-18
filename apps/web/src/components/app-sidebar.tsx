'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Bot,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
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
      title: 'Overview',
      url: '/',
      icon: PieChart,
      isActive: true,
    },
    {
      title: 'Agents',
      url: '/agents',
      icon: AudioWaveform,
    },
    {
      title: 'Personas',
      url: '/personas',
      icon: Bot,
    },
    {
      title: 'Sessions',
      url: '/sessions',
      icon: SquareTerminal,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
