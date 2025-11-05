'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function SecondaryNav() {
  const pathname = usePathname();
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);
  const orgSwitcherRef = useRef<HTMLDivElement>(null);
  const [selectedOrg, setSelectedOrg] = useState({ name: 'CommonSpirit Health', type: 'Organization' as 'Organization' | 'Entity' });

  const organizations = [
    { name: 'CommonSpirit Health', type: 'Organization' as const, logo: true },
    { name: 'CS Health West', type: 'Entity' as const },
    { name: 'CS Health East', type: 'Entity' as const },
    { name: 'CommonSpirit / AZ Team', type: 'Entity' as const },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgSwitcherRef.current && !orgSwitcherRef.current.contains(event.target as Node)) {
        setOrgSwitcherOpen(false);
      }
    };

    if (orgSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [orgSwitcherOpen]);
  
  const allNavItems = [
    { icon: 'overview', label: 'Overview', href: '/permissions' },
    { icon: 'products', label: 'Products & Features', href: '/permissions/products' },
    { icon: 'groups', label: 'Groups', href: '/permissions/groups' },
    { icon: 'members', label: 'Members', href: '/permissions/members' },
    { icon: 'entities', label: 'Entities', href: '/permissions/entities' },
    { icon: 'preferences', label: 'Preferences', href: '/permissions/preferences' },
  ];

  // Filter out Entities nav item if selected org is an Entity
  const navItems = selectedOrg.type === 'Entity' 
    ? allNavItems.filter(item => item.icon !== 'entities')
    : allNavItems;
  
  return (
    <div className="bg-white box-border flex flex-col gap-6 items-start overflow-clip relative rounded-lg" style={{ padding: '16px', width: '250px' }}>
      <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
        {/* Org Switcher */}
        <div className="relative w-full" ref={orgSwitcherRef}>
          <button
            onClick={() => setOrgSwitcherOpen(!orgSwitcherOpen)}
            className={`bg-white border border-[#e3e7ea] border-solid relative rounded-lg w-full transition-colors cursor-pointer ${
              orgSwitcherOpen ? 'bg-[#f7f8f8]' : 'hover:bg-[#f7f8f8]'
            }`}
          >
            <div className="box-border flex flex-col gap-4 items-start justify-center overflow-clip p-2 relative rounded-[inherit] w-full">
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <div className="bg-gray-300 shrink-0" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                <p className="font-medium leading-5 relative shrink-0 text-[#121313] text-sm whitespace-pre">
                  {selectedOrg.name}
                </p>
              </div>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {orgSwitcherOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 w-full">
              <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                {organizations.map((org, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedOrg({ name: org.name, type: org.type });
                      setOrgSwitcherOpen(false);
                    }}
                    className={`w-full flex gap-2 items-center p-2 rounded text-left transition-colors ${
                      selectedOrg.name === org.name
                        ? 'bg-[#e4f8f6]'
                        : 'hover:bg-[#f0f2f2]'
                    }`}
                  >
                    {org.logo ? (
                      <div className="flex gap-1 items-center flex-1 min-w-0">
                        <div className="bg-gray-300 shrink-0" style={{ width: '16px', height: '16px', borderRadius: '2px' }} />
                        <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {org.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start justify-center flex-1 min-w-0">
                        <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px] w-full">
                          {org.name}
                        </p>
                        <p className="font-normal leading-3 relative shrink-0 text-[11px] text-[#4b595c] tracking-[0.11px] w-full">
                          {org.type}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Community Plan Tag */}
        <div className="bg-[#f0f2f2] box-border flex gap-2 items-center px-2 py-1 relative rounded w-fit">
          <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="font-medium text-[11px] leading-4 text-[#121313]">
            Community Plan
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-0.5 items-start max-w-[260px] relative rounded-lg shrink-0 w-full">
        <div className="box-border flex flex-col gap-0.5 items-start pb-0 pt-0 px-0 relative shrink-0 w-full">
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              icon={item.icon} 
              label={item.label} 
              href={item.href}
              active={pathname === item.href || (item.href === '/permissions' && pathname === '/permissions')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: string; label: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`box-border flex gap-2 items-center px-2 py-2 relative rounded w-full cursor-pointer hover:bg-[#f0f2f2] ${
        active ? 'bg-[#f0f2f2]' : ''
      }`}
    >
      <div className="overflow-clip relative shrink-0 w-4 h-4">
        {getIcon(icon)}
      </div>
      <div className="flex-1 flex flex-col items-start justify-center min-h-0 min-w-0 relative shrink-0">
        <p className="font-normal leading-4 relative shrink-0 text-[#121313] text-xs tracking-wide w-full">
          {label}
        </p>
      </div>
    </Link>
  );
}

function getIcon(icon: string) {
  const iconClass = "w-4 h-4 text-[#121313]";
  
  switch (icon) {
    case 'overview':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'products':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'groups':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'members':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'entities':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'preferences':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

