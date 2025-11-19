'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ShinyText from './ShinyText';
import { MRF_SEARCH_PRODUCT_NAME } from '@/constants/products';

interface MRFSearchProductSettingsProps {
  groupId: string;
}

type RoleOption = 'Viewer' | 'Editor' | 'Admin';

const ROLE_OPTIONS: RoleOption[] = ['Viewer', 'Editor', 'Admin'];

const SEARCH_ROLE_PERMISSIONS: Record<RoleOption, string[]> = {
  Viewer: [
    'Can See Medicare Reference Pricing Rates',
    'Can Use All Filters',
    'Can Use Raw Charge Enterprise Tool',
    'Can View Payer Parsing Ingestion Status',
    'Can See The Care Search',
  ],
  Editor: [
    'Can See Medicare Reference Pricing Rates',
    'Can Use All Filters',
    'Can Use Raw Charge Enterprise Tool',
    'Can View Payer Parsing Ingestion Status',
    'Can See The Care Search',
    'Can Export Search Results',
  ],
  Admin: [
    'Can Manage Search Permissions',
    'Can Configure Filters',
    'Can View Payer Parsing Ingestion Status',
    'Can See Medicare Reference Pricing Rates',
    'Can Use The Care Search',
  ],
};

export default function MRFSearchProductSettings({ groupId }: MRFSearchProductSettingsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get('from');
  const memberId = searchParams.get('memberId');
  
  // Track if saved
  const [isSaved, setIsSaved] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  
  // Determine back URL based on context
  const backUrl = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : `/permissions/groups/${groupId}`;
  
  const breadcrumbLabel = from === 'member' && memberId ? 'Members' : 'Groups';
  const breadcrumbHref = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : `/permissions/groups/${groupId}`;

  const handleRevokeAccess = () => {
    const encodedName = encodeURIComponent(MRF_SEARCH_PRODUCT_NAME);
    const revokedUrl = from === 'member' && memberId
      ? `/permissions/members/${memberId}?revoked=${encodedName}`
      : `/permissions/groups/${groupId}?revoked=${encodedName}`;
    router.push(revokedUrl);
  };

  // Initial/clean state
  const [initialRolesPermissions, setInitialRolesPermissions] = useState({
    searchRole: 'Viewer' as RoleOption,
  });
  
  // Current state
  const [searchRole, setSearchRole] = useState<RoleOption>(initialRolesPermissions.searchRole);
  const [rolesPermissionsOpen, setRolesPermissionsOpen] = useState(true);
  
  // Dirty state tracking
  const isRolesPermissionsDirty = searchRole !== initialRolesPermissions.searchRole;
  
  // Check if any section is dirty
  const hasDirtySections = isRolesPermissionsDirty;
  
  const handleSaveRolesPermissions = () => {
    setInitialRolesPermissions({
      searchRole,
    });
    console.log('Saving roles & permissions:', { searchRole });
  };
  
  const handleSaveAll = () => {
    if (isRolesPermissionsDirty) {
      handleSaveRolesPermissions();
    }
    setIsSaved(true);
    setFadingOut(false);
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setIsSaved(false), 300);
    }, 1700);
  };

  const renderRoleSection = (
    title: string,
    role: RoleOption,
    setRole: (role: RoleOption) => void,
    permissions: Record<RoleOption, string[]>
  ) => {
    return (
      <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
        <div className="flex gap-2 items-center w-full">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setRole(option)}
              className={`flex-1 h-8 px-3 py-2 rounded text-xs font-medium transition-colors ${
                role === option
                  ? 'bg-[#16696d] text-white'
                  : 'bg-white border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-xs text-[#6e8081]">
            As a <span className="underline">{role}</span>, this member can:
          </p>
          <div className="flex flex-wrap gap-2 items-start w-full">
            {permissions[role].map((permission, index) => (
              <div
                key={index}
                className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium"
              >
                {permission}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
        {/* Header */}
        <div className="border-b border-[#e3e7ea] border-solid box-border flex gap-1 items-start pb-6 pt-4 px-0 relative shrink-0 w-full">
          <div className="basis-0 flex flex-col gap-6 grow items-start min-h-px min-w-px relative shrink-0">
            {/* Breadcrumbs */}
            <div className="flex gap-1 items-center text-xs text-[#6e8081] relative shrink-0">
              <Link href={breadcrumbHref} className="hover:underline">
                {breadcrumbLabel}
              </Link>
              <span>/</span>
              <span className="text-[#121313]">{MRF_SEARCH_PRODUCT_NAME}</span>
            </div>

            {/* Header with back button and title */}
            <div className="flex items-center justify-between relative shrink-0 w-full">
              <div className="basis-0 flex gap-1 grow items-center min-h-px min-w-px relative shrink-0">
                <Link href={backUrl} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
                  <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="flex flex-col gap-1 items-start not-italic relative shrink-0">
                  <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-[0.16px]">
                    {MRF_SEARCH_PRODUCT_NAME}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasDirtySections && !isSaved && (
                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
                  >
                    Save
                  </button>
                )}
                {isSaved && (
                  <div className={`text-xs font-medium transition-opacity duration-300 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
                    <ShinyText text="Saved" speed={3} />
                  </div>
                )}
                <button 
                  onClick={handleRevokeAccess}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 cursor-pointer"
                >
                  Revoke Access
                </button>
              </div>
            </div>
          </div>
        </div>
      
        {/* Roles & Permissions Section */}
        <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
          <div className="w-full flex items-center gap-2 mb-4 h-6">
            <button
              onClick={() => setRolesPermissionsOpen(!rolesPermissionsOpen)}
              className="flex items-center gap-2 flex-1 h-6"
            >
              <p className="font-semibold text-sm text-[#121313]">Roles & Permissions</p>
              {isRolesPermissionsDirty && (
                <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
              )}
            </button>
            <button
              onClick={() => setRolesPermissionsOpen(!rolesPermissionsOpen)}
              className="flex items-center h-6"
            >
              <svg
                className={`w-5 h-5 text-[#121313] transition-transform ${rolesPermissionsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {rolesPermissionsOpen && (
            <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
              {renderRoleSection('Search', searchRole, setSearchRole, SEARCH_ROLE_PERMISSIONS)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

