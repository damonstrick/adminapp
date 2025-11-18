'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ShinyText from './ShinyText';
import PhiAwarenessBanner from './PhiAwarenessBanner';
import { usePhiBanner } from './PhiBannerContext';

interface ClearContractsProductSettingsProps {
  groupId: string;
}

type ScopeType = 'Providers' | 'Payers' | 'Payer Networks' | 'States' | 'Contract Types' | 'Plans' | 'Labels' | 'Document Type' | 'Services' | 'Billing Codes';

interface Scope {
  id: string;
  type: ScopeType;
  tags: string[];
}

interface Condition {
  id: string;
  scopes: Scope[];
}

const SCOPE_TYPES: ScopeType[] = ['Providers', 'Payers', 'Payer Networks', 'States', 'Contract Types', 'Plans', 'Labels', 'Document Type', 'Services', 'Billing Codes'];

type RoleOption = 'Viewer' | 'Editor' | 'Admin';

const ROLE_OPTIONS: RoleOption[] = ['Viewer', 'Editor', 'Admin'];

const CLEAR_CONTRACTS_ROLE_TAGS: Record<RoleOption, string[]> = {
  Viewer: [
    'Can View Contract Project',
    'Can View Unapproved Intake Statuses',
    'Can View Intake Attachments',
  ],
  Editor: [
    'Can Add Contracts Project',
    'Can Change Contract Project',
    'Can View Contract Project',
    'Can View Unapproved Intake Statuses',
    'Can Add Hierarchical Document',
  ],
  Admin: [
    'Can Add Contracts Project',
    'Can Change Contract Project',
    'Can Delete Contract Project',
    'Can View Contract Project',
    'Can View Unapproved Intake Statuses',
    'Can Add Hierarchical Document',
    'Can Approve Contract Project',
  ],
};

export default function ClearContractsProductSettings({ groupId }: ClearContractsProductSettingsProps) {
  const { showPhiBanner } = usePhiBanner();
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get('from');
  const memberId = searchParams.get('memberId');
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Determine back URL based on context
  const backUrl = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : `/permissions/groups/${groupId}`;
  
  const breadcrumbLabel = from === 'member' && memberId ? 'Members' : 'Groups';
  const breadcrumbHref = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : `/permissions/groups/${groupId}`;

  const handleRevokeAccess = () => {
    const revokedUrl = from === 'member' && memberId
      ? `/permissions/members/${memberId}?revoked=Clear Contracts`
      : `/permissions/groups/${groupId}?revoked=Clear Contracts`;
    router.push(revokedUrl);
  };

  // Initial/clean state
  const [initialRolesPermissions, setInitialRolesPermissions] = useState<{ selectedRole: RoleOption }>({
    selectedRole: 'Editor',
  });
  const [initialScope, setInitialScope] = useState<Condition[]>([
    {
      id: '1',
      scopes: [
        { id: '1-1', type: 'States', tags: ['California'] },
        { id: '1-2', type: 'Billing Codes', tags: ['HCPCS C9741'] },
      ],
    },
  ]);
  const [initialFeatureToggles, setInitialFeatureToggles] = useState({
    askTqContract: true,
    askTqPayerPolicy: true,
    documentViewer: true,
    rateSummary: true,
    scenarioModeling: true,
  });
  
  // Current state
  const [selectedRole, setSelectedRole] = useState<RoleOption>(initialRolesPermissions.selectedRole);
  
  const [rolesPermissionsOpen, setRolesPermissionsOpen] = useState(true);
  const [scopeOpen, setScopeOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  const [askTqContract, setAskTqContract] = useState(initialFeatureToggles.askTqContract);
  const [askTqPayerPolicy, setAskTqPayerPolicy] = useState(initialFeatureToggles.askTqPayerPolicy);
  const [documentViewer, setDocumentViewer] = useState(initialFeatureToggles.documentViewer);
  const [rateSummary, setRateSummary] = useState(initialFeatureToggles.rateSummary);
  const [scenarioModeling, setScenarioModeling] = useState(initialFeatureToggles.scenarioModeling);

  // Initialize with 1 condition group (no OR conditions)
  const [conditions, setConditions] = useState<Condition[]>(initialScope);
  
  // Available permissions list
  const isRolesPermissionsDirty = selectedRole !== initialRolesPermissions.selectedRole;
  const isScopeDirty = JSON.stringify(conditions.sort((a, b) => a.id.localeCompare(b.id))) !== 
    JSON.stringify(initialScope.sort((a, b) => a.id.localeCompare(b.id)));
  const isPreferencesDirty =
    askTqContract !== initialFeatureToggles.askTqContract ||
    askTqPayerPolicy !== initialFeatureToggles.askTqPayerPolicy ||
    documentViewer !== initialFeatureToggles.documentViewer ||
    rateSummary !== initialFeatureToggles.rateSummary ||
    scenarioModeling !== initialFeatureToggles.scenarioModeling;
  const dirtySectionsCount = [isRolesPermissionsDirty, isScopeDirty, isPreferencesDirty].filter(Boolean).length;
  
  const handleSaveRolesPermissions = () => {
    setInitialRolesPermissions({
      selectedRole,
    });
    console.log('Saving roles & permissions:', { selectedRole });
    setSavedSection('rolesPermissions');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('rolesPermissions');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveScope = () => {
    setInitialScope([...conditions]);
    console.log('Saving scope:', conditions);
    setSavedSection('scope');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('scope');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSavePreferences = () => {
    setInitialFeatureToggles({
      askTqContract,
      askTqPayerPolicy,
      documentViewer,
      rateSummary,
      scenarioModeling,
    });
    console.log('Saving customize features:', {
      askTqContract,
      askTqPayerPolicy,
      documentViewer,
      rateSummary,
      scenarioModeling,
    });
    setSavedSection('preferences');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('preferences');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveAll = () => {
    // Track which sections were dirty before saving
    const sectionsToSave: string[] = [];
    if (isRolesPermissionsDirty) sectionsToSave.push('rolesPermissions');
    if (isScopeDirty) sectionsToSave.push('scope');
    if (isPreferencesDirty) sectionsToSave.push('preferences');
    
    handleSaveRolesPermissions();
    handleSaveScope();
    handleSavePreferences();
    
    setSavedSection('all');
    setSavedSectionsFromAll(sectionsToSave);
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('all');
      setTimeout(() => {
        setSavedSection(null);
        setSavedSectionsFromAll([]);
      }, 300);
    }, 1700);
  };

  // Popover states
  const [addScopePopover, setAddScopePopover] = useState<{ conditionId: string | null; open: boolean } | null>(null);
  const [addTagPopover, setAddTagPopover] = useState<{ conditionId: string; scopeId: string; open: boolean } | null>(null);
  const [tagSearchValue, setTagSearchValue] = useState('');
  const [scopeSearchValue, setScopeSearchValue] = useState('');
  const addScopeRef = useRef<HTMLDivElement>(null);
  const addTagRef = useRef<HTMLDivElement>(null);

  // Sample data for autocomplete options based on scope type
  const getScopeOptions = (scopeType: ScopeType): string[] => {
    switch (scopeType) {
      case 'Providers':
        return ['Cherry Creek Health', 'Banner Health', 'CommonSpirit', 'Mayo Health', 'HonorHealth', 'St. Mary\'s Medical Center', 'Regional Health Network', 'Community Care Clinic', 'Metro General Hospital', 'Riverside Medical Group'];
      case 'Payers':
        return ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Humana', 'Anthem', 'Kaiser Permanente', 'Medicaid', 'Medicare', 'Tricare'];
      case 'Payer Networks':
        return ['AL HMO', 'AZ PPO', 'Blue Choice', 'Gold Network', 'Silver Network', 'Platinum Network', 'Basic Network', 'Premium Network', 'Standard Network', 'Elite Network'];
      case 'States':
        return ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
      case 'Contract Types':
        return ['Base Language', 'Amendment', 'Addendum', 'Renewal', 'Termination', 'Modification', 'Original', 'Superseded', 'Active', 'Inactive'];
      case 'Plans':
        return ['Gold', 'Silver', 'Bronze', 'Platinum', 'Basic', 'Premium', 'Standard', 'Elite', 'HMO', 'PPO', 'EPO', 'POS'];
      case 'Labels':
        return ['Active', 'Pending', 'Expired', 'Draft', 'Approved', 'Rejected', 'Under Review', 'Archived', 'Renewal Due', 'Terminated'];
      case 'Document Type':
        return ['Base Language', 'Amendment', 'Addendum', 'Renewal', 'Termination', 'Modification', 'Original Contract', 'Superseded Contract', 'Active Contract', 'Inactive Contract'];
      case 'Services':
        return ['L37829', 'L26734', 'S27783', 'S27784', 'L37830', 'L26735', 'S27785', 'L37831', 'L26736', 'S27786'];
      case 'Billing Codes':
        return ['HCPCS C9741', 'HCPCS C9742', 'APC 62772', 'APC 62773', 'CPT 99213', 'CPT 99214', 'CPT 99215', 'ICD-10 Z00.00', 'ICD-10 Z00.01', 'MS-DRG 001', 'MS-DRG 002', 'MS-DRG 003'];
      default:
        return [];
    }
  };

  const getFilteredOptions = (scopeType: ScopeType, searchValue: string): string[] => {
    const options = getScopeOptions(scopeType);
    if (!searchValue.trim()) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getFilteredScopeTypes = (searchValue: string): ScopeType[] => {
    if (!searchValue.trim()) return SCOPE_TYPES;
    return SCOPE_TYPES.filter(type => 
      type.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addScopeRef.current && !addScopeRef.current.contains(event.target as Node)) {
        setAddScopePopover(null);
        setScopeSearchValue('');
      }
      if (addTagRef.current && !addTagRef.current.contains(event.target as Node)) {
        setAddTagPopover(null);
        setTagSearchValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addScope = (conditionId: string | null, scopeType: ScopeType) => {
    // If conditionId is null, create a new condition with this scope
    if (conditionId === null) {
      const newCondition: Condition = {
        id: Date.now().toString(),
        scopes: [{ id: `${Date.now()}-1`, type: scopeType, tags: [] }],
      };
      setConditions([newCondition]);
    } else {
      // Add scope to existing condition
      setConditions(conditions.map(condition => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            scopes: [...condition.scopes, { id: `${conditionId}-${Date.now()}`, type: scopeType, tags: [] }],
          };
        }
        return condition;
      }));
    }
    setAddScopePopover(null);
    setScopeSearchValue('');
  };

  const removeScope = (conditionId: string, scopeId: string) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        const newScopes = condition.scopes.filter(s => s.id !== scopeId);
        // If no scopes left, keep the condition but with empty scopes
        return { ...condition, scopes: newScopes };
      }
      return condition;
    }));
  };

  // Function to find matching option from available options (case-insensitive)
  const findMatchingOption = (scopeType: ScopeType, inputValue: string): string | null => {
    const options = getScopeOptions(scopeType);
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return null;
    
    const normalizedInput = trimmedInput.toLowerCase();
    
    // First try exact match (case-insensitive) - this is the most common case
    const exactMatch = options.find(opt => opt.toLowerCase() === normalizedInput);
    if (exactMatch) return exactMatch;
    
    // Try matching by starting with the input (case-insensitive) - for partial typing
    // Only use this if the input is at least 3 characters to avoid false matches
    if (normalizedInput.length >= 3) {
      const startsWithMatch = options.find(opt => opt.toLowerCase().startsWith(normalizedInput));
      if (startsWithMatch) return startsWithMatch;
    }
    
    // Then try partial match (case-insensitive) - input contains option or option contains input
    const partialMatch = options.find(opt => {
      const optLower = opt.toLowerCase();
      return optLower.includes(normalizedInput) || normalizedInput.includes(optLower);
    });
    if (partialMatch) return partialMatch;
    
    // If no match found, return the input value as-is (user can add custom values)
    return trimmedInput;
  };

  // Function to add multiple tags from comma-separated values
  const addTagsFromCommaSeparated = (conditionId: string, scopeId: string, inputValue: string) => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    
    // Find the scope to get its type
    const condition = conditions.find(c => c.id === conditionId);
    if (!condition) return;
    
    const scope = condition.scopes.find(s => s.id === scopeId);
    if (!scope) return;
    
    // Split by comma and process each value
    const values = trimmedInput.split(',').map(v => v.trim()).filter(v => v.length > 0);
    const tagsToAdd: string[] = [];
    const existingTagsLower = new Set(scope.tags.map(tag => tag.toLowerCase()));
    
    values.forEach(value => {
      if (!value) return;
      
      // Find matching option or use the value as-is
      const matchingOption = findMatchingOption(scope.type, value);
      if (matchingOption && matchingOption.trim()) {
        // Check if tag already exists (case-insensitive)
        const alreadyExists = existingTagsLower.has(matchingOption.toLowerCase());
        if (!alreadyExists) {
          tagsToAdd.push(matchingOption);
          existingTagsLower.add(matchingOption.toLowerCase()); // Track added tags to avoid duplicates in same batch
        }
      }
    });
    
    // If no tags to add, just close the popover
    if (tagsToAdd.length === 0) {
      setTagSearchValue('');
      setAddTagPopover(null);
      return;
    }
    
    // Add all tags at once using functional update
    setConditions((prevConditions) => {
      return prevConditions.map(condition => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            scopes: condition.scopes.map(s => {
              if (s.id === scopeId) {
                // Get existing tags and add new ones, avoiding duplicates
                const existingTags = s.tags;
                const existingLower = new Set(existingTags.map(t => t.toLowerCase()));
                const newTags = tagsToAdd.filter(tag => !existingLower.has(tag.toLowerCase()));
                return { ...s, tags: [...existingTags, ...newTags] };
              }
              return s;
            }),
          };
        }
        return condition;
      });
    });
    
    setTagSearchValue('');
    setAddTagPopover(null);
  };

  const addTag = (conditionId: string, scopeId: string, tagValue: string) => {
    if (!tagValue.trim()) return;
    
    // Use findMatchingOption to get the correct case/formatted value
    const condition = conditions.find(c => c.id === conditionId);
    if (!condition) return;
    const scope = condition.scopes.find(s => s.id === scopeId);
    if (!scope) return;
    
    const matchingOption = findMatchingOption(scope.type, tagValue);
    if (!matchingOption) return;
    
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          scopes: condition.scopes.map(scope => {
            if (scope.id === scopeId) {
              // Don't add if tag already exists (case-insensitive)
              const existingTagsLower = scope.tags.map(t => t.toLowerCase());
              if (existingTagsLower.includes(matchingOption.toLowerCase())) {
                return scope;
              }
              return { ...scope, tags: [...scope.tags, matchingOption] };
            }
            return scope;
          }),
        };
      }
      return condition;
    }));
    setTagSearchValue('');
    setAddTagPopover(null);
  };

  const removeTag = (conditionId: string, scopeId: string, tagIndex: number) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          scopes: condition.scopes.map(scope => {
            if (scope.id === scopeId) {
              const newTags = scope.tags.filter((_, i) => i !== tagIndex);
              return { ...scope, tags: newTags };
            }
            return scope;
          }),
        };
      }
      return condition;
    }));
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
            <span className="text-[#121313]">Clear Contracts</span>
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
                  Clear Contracts
                </p>
              </div>
            </div>
            <button 
              onClick={handleRevokeAccess}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 cursor-pointer"
            >
              Revoke Access
            </button>
          </div>
        </div>
      </div>

      {/* PHI Awareness Banner */}
      {showPhiBanner && (
        <div className="px-0 pb-4 pt-0 w-full">
          <PhiAwarenessBanner />
        </div>
      )}
      
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
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isRolesPermissionsDirty && savedSection !== 'rolesPermissions' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveRolesPermissions();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'rolesPermissions' || (savedSection === 'all' && savedSectionsFromAll.includes('rolesPermissions'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'rolesPermissions' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
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
            <div className="bg-white box-border flex flex-col gap-4 items-start pb-4 w-full">
              <div className="flex gap-2 h-8 items-start w-full">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex-1 flex items-center justify-center h-8 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      selectedRole === role
                        ? 'bg-[#16696d] text-white'
                        : 'bg-white border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 items-start w-full">
              <p className="text-xs text-[#6e8081]">
                As an <span className="underline">{selectedRole}</span>, this member can:
              </p>
              <div className="flex flex-wrap gap-2 items-start w-full">
                {CLEAR_CONTRACTS_ROLE_TAGS[selectedRole].map((tag) => (
                  <div key={`${selectedRole}-${tag}`} className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scope Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setScopeOpen(!scopeOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Scope</p>
            {isScopeDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isScopeDirty && savedSection !== 'scope' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveScope();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'scope' || (savedSection === 'all' && savedSectionsFromAll.includes('scope'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'scope' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setScopeOpen(!scopeOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${scopeOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {scopeOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
            {conditions.length === 0 ? (
              // Empty state: just show "Add Scope" button
              <div className="border border-[#e3e7ea] border-solid rounded-lg flex flex-col items-start relative shrink-0 w-full">
                <div className="relative w-full flex justify-center">
                  <button
                    onClick={() => setAddScopePopover({ conditionId: null, open: true })}
                    className="flex flex-col h-8 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]"
                  >
                    <div className="box-border flex gap-4 items-center justify-center px-3 py-0 relative shrink-0 w-full">
                      <div className="flex gap-2 grow items-center">
                        <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
                          Add Scope
                        </p>
                      </div>
                      <div className="flex-none rotate-90">
                        <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {/* Add Scope Popover - Searchable Select */}
                  {addScopePopover?.conditionId === null && addScopePopover?.open && (
                    <div 
                      ref={addScopeRef}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                    >
                      {/* Search Box */}
                      <div className="border-b border-[#e3e7ea] border-solid pb-3 mb-0">
                        <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={scopeSearchValue}
                            onChange={(e) => setScopeSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setAddScopePopover(null);
                                setScopeSearchValue('');
                              }
                            }}
                            placeholder="Search"
                            className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Options List */}
                      <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                        {getFilteredScopeTypes(scopeSearchValue).map((type) => (
                          <button
                            key={type}
                            onClick={() => addScope(null, type)}
                            className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                          >
                            <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                              {type}
                            </p>
                          </button>
                        ))}
                        {getFilteredScopeTypes(scopeSearchValue).length === 0 && (
                          <div className="w-full p-2 text-center">
                            <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Non-empty state: show condition (no OR dividers, no Add Condition button)
              conditions.map((condition) => (
                <div key={condition.id} className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                  {/* Condition Box */}
                  <div className="border border-[#e3e7ea] border-solid rounded-lg flex flex-col items-start relative shrink-0 w-full">
                    {/* Scopes */}
                    {condition.scopes.map((scope) => (
                      <div key={scope.id} className="flex gap-2 items-start relative shrink-0 w-full">
                        <div className="border-b border-[#e3e7ea] border-solid flex gap-3 items-start p-3 relative shrink-0 w-full">
                          <div className="flex gap-1 items-start px-0.5 py-1 rounded shrink-0 w-[200px]">
                            <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px] whitespace-pre">
                              {scope.type}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 grow items-start px-0.5 py-1 relative min-h-[24px]">
                            {/* Tags */}
                            {scope.tags.map((tag, tagIndex) => (
                              <div key={tagIndex} className="bg-[#e8ebeb] flex gap-1 h-5 items-center justify-center px-2 py-0.5 rounded shrink-0">
                                <p className="font-medium leading-4 relative shrink-0 text-[11px] text-[#121313] tracking-[0.11px] whitespace-pre">
                                  {tag}
                                </p>
                                <button 
                                  onClick={() => removeTag(condition.id, scope.id, tagIndex)}
                                  className="w-3 h-3 flex items-center justify-center hover:bg-[#d2d8dc] rounded"
                                >
                                  <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            {/* Add Tag Button */}
                            <div className="relative">
                              <button 
                                onClick={() => setAddTagPopover({ conditionId: condition.id, scopeId: scope.id, open: true })}
                                className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded"
                              >
                                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              {/* Add Tag Popover - Searchable Select */}
                              {addTagPopover?.conditionId === condition.id && addTagPopover?.scopeId === scope.id && addTagPopover?.open && (
                                <div 
                                  ref={addTagRef}
                                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                                >
                                {/* Search Box */}
                                <div className="border-b border-[#e3e7ea] border-solid pb-3 mb-0">
                                  <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                                    <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                      type="text"
                                      value={tagSearchValue}
                                      onChange={(e) => setTagSearchValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          e.preventDefault();
                                          setAddTagPopover(null);
                                          setTagSearchValue('');
                                        } else if (e.key === 'Enter') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const inputValue = tagSearchValue.trim();
                                          if (!inputValue) return;
                                          
                                          // Check if input contains commas (multiple values)
                                          if (inputValue.includes(',')) {
                                            addTagsFromCommaSeparated(condition.id, scope.id, inputValue);
                                          } else {
                                            // Single value - check if it matches an option
                                            const matchingOption = findMatchingOption(scope.type, inputValue);
                                            if (matchingOption) {
                                              addTag(condition.id, scope.id, matchingOption);
                                            }
                                          }
                                        }
                                      }}
                                      placeholder="Search or paste comma-separated values"
                                      className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                
                                {/* Options List */}
                                <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                                  {getFilteredOptions(scope.type, tagSearchValue)
                                    .filter(option => {
                                      // Filter out already added tags (case-insensitive)
                                      const existingTagsLower = scope.tags.map(t => t.toLowerCase());
                                      return !existingTagsLower.includes(option.toLowerCase());
                                    })
                                    .map((option) => (
                                    <button
                                      key={option}
                                      onClick={() => addTag(condition.id, scope.id, option)}
                                      className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                                    >
                                      <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                                        {option}
                                      </p>
                                    </button>
                                  ))}
                                  {getFilteredOptions(scope.type, tagSearchValue).filter(option => {
                                    const existingTagsLower = scope.tags.map(t => t.toLowerCase());
                                    return !existingTagsLower.includes(option.toLowerCase());
                                  }).length === 0 && (
                                    <div className="w-full p-2 text-center">
                                      <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                                    </div>
                                  )}
                                </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Remove Scope Button */}
                        <button 
                          onClick={() => removeScope(condition.id, scope.id)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded shrink-0"
                        >
                          <svg className="w-4 h-4 text-[#89989b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {/* Add Scope Button */}
                    <div className="relative w-full flex justify-center">
                      <button
                        onClick={() => setAddScopePopover({ conditionId: condition.id, open: true })}
                        className="flex flex-col h-8 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]"
                      >
                        <div className="box-border flex gap-4 items-center justify-center px-3 py-0 relative shrink-0 w-full">
                          <div className="flex gap-2 grow items-center">
                            <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
                              Add Scope
                            </p>
                          </div>
                          <div className="flex-none rotate-90">
                            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      {/* Add Scope Popover - Searchable Select */}
                      {addScopePopover?.conditionId === condition.id && addScopePopover?.open && (
                        <div 
                          ref={addScopeRef}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                        >
                          {/* Search Box */}
                          <div className="border-b border-[#e3e7ea] border-solid pb-3 mb-0">
                            <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input
                                type="text"
                                value={scopeSearchValue}
                                onChange={(e) => setScopeSearchValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setAddScopePopover(null);
                                    setScopeSearchValue('');
                                  }
                                }}
                                placeholder="Search"
                                className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Options List */}
                          <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                            {getFilteredScopeTypes(scopeSearchValue).map((type) => (
                              <button
                                key={type}
                                onClick={() => addScope(condition.id, type)}
                                className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                              >
                                <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                                  {type}
                                </p>
                              </button>
                            ))}
                            {getFilteredScopeTypes(scopeSearchValue).length === 0 && (
                              <div className="w-full p-2 text-center">
                                <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* AI Suggestion */}
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg flex gap-4 items-start p-4 relative shrink-0 w-full">
              <div className="overflow-clip relative shrink-0 w-4 h-4">
                <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="font-medium leading-4 relative grow text-xs text-[#121313] tracking-[0.12px] break-words">
                John Smith's current scope includes providers such as Cherry Creak Health, Banner Health, CommonSpirit, Mayo Health, and HonorHealth. He has access to multiple payer networks (AL HMO, AZ PPO, Blue Choice) across states like AL and AZ, with coverage for Gold and Silver plans and the "Active" label. His services include codes L37829, L26734, and S27783, with code type crosswalks set to HCPCS and MS-DRG. He also has advanced filters applied for the provider Banner and document types Amendment and Base Language.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Customize Features Section */}
      <div className="box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Customize Features</p>
            {isPreferencesDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isPreferencesDirty && savedSection !== 'preferences' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePreferences();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'preferences' || (savedSection === 'all' && savedSectionsFromAll.includes('preferences'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'preferences' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${preferencesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {preferencesOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            {[
              { label: 'AskTQ Contract', value: askTqContract, setter: setAskTqContract },
              { label: 'AskTQ Payer Policy', value: askTqPayerPolicy, setter: setAskTqPayerPolicy },
              { label: 'Document Viewer', value: documentViewer, setter: setDocumentViewer },
              { label: 'Rate Summary', value: rateSummary, setter: setRateSummary },
              { label: 'Scenario Modeling', value: scenarioModeling, setter: setScenarioModeling },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between w-full gap-4">
                <p className="font-normal leading-4 text-xs text-[#121313] tracking-[0.12px] pl-4 flex-1">{toggle.label}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={toggle.value}
                    onChange={(e) => toggle.setter(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:bg-[#16696d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Save All Button */}
      {dirtySectionsCount > 1 && (
        <div className="flex justify-end w-full mt-6 mb-4">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
          >
            Save All ({dirtySectionsCount} sections)
          </button>
        </div>
      )}
      </div>
      
    </>
  );
}

