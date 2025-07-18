'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Define breadcrumb mappings for different routes
  const getBreadcrumbs = () => {
    if (pathname === '/') {
      return [{ href: '/', label: 'Dashboard', current: true }];
    }

    if (pathname === '/agents') {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/agents', label: 'Agents', current: true },
      ];
    }

    if (pathname === '/agents/create') {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/agents', label: 'Agents' },
        { href: '/agents/create', label: 'Create Agent', current: true },
      ];
    }

    if (pathname.startsWith('/agents/')) {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/agents', label: 'Agents' },
        { href: pathname, label: 'Agent Details', current: true },
      ];
    }

    if (pathname === '/personas') {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/personas', label: 'Personas', current: true },
      ];
    }

    if (pathname === '/sessions') {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/sessions', label: 'Sessions', current: true },
      ];
    }

    if (pathname === '/settings') {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/settings', label: 'Settings', current: true },
      ];
    }

    // Default fallback
    return [
      { href: '/', label: 'Dashboard' },
      { href: pathname, label: 'Page', current: true },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {breadcrumb.current ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
