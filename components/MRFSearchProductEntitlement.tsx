'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ShinyText from './ShinyText';

type ScopeType = 'State' | 'Billing Code' | 'CBSA' | 'NPI';

interface Scope {
  id: string;
  type: ScopeType;
  tags: string[];
}

interface Condition {
  id: string;
  scopes: Scope[];
}

const SCOPE_TYPES: ScopeType[] = ['State', 'Billing Code', 'CBSA', 'NPI'];

export default function MRFSearchProductEntitlement() {
  const [mrfSearchEnabled, setMrfSearchEnabled] = useState(false);
  const [dataConfigOpen, setDataConfigOpen] = useState(true);
  
  // Data Config subsection toggles
  const [hospitalRatesOpen, setHospitalRatesOpen] = useState(false);
  const [payerRatesOpen, setPayerRatesOpen] = useState(false);
  const [deviceRatesOpen, setDeviceRatesOpen] = useState(false);
  const [drugRatesOpen, setDrugRatesOpen] = useState(false);
  
  // Customize Features section state
  const [initialFeatures, setInitialFeatures] = useState({
    exportData: false,
    exportRateLimit: '',
  });
  
  const [exportData, setExportData] = useState(initialFeatures.exportData);
  const [exportRateLimit, setExportRateLimit] = useState(initialFeatures.exportRateLimit);
  
  // Track if saved
  const [isSaved, setIsSaved] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  
  // Customize Features section dirty state
  const isFeaturesDirty = JSON.stringify({
    exportData,
    exportRateLimit,
  }) !== JSON.stringify(initialFeatures);
  
  // Check if any section is dirty
  const hasDirtySections = isFeaturesDirty;
  
  const handleSaveAll = () => {
    if (isFeaturesDirty) {
      setInitialFeatures({
        exportData,
        exportRateLimit,
      });
      console.log('Saving Customize Features section:', {
        exportData,
        exportRateLimit,
      });
    }
    setIsSaved(true);
    setFadingOut(false);
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setIsSaved(false), 300);
    }, 1700);
  };

  // Initialize with empty state
  const [conditions, setConditions] = useState<Condition[]>([]);

  // Hospital Rates and Payer Rates start empty
  const [hospitalRatesConditions, setHospitalRatesConditions] = useState<Condition[]>([]);
  const [payerRatesConditions, setPayerRatesConditions] = useState<Condition[]>([]);
  const [deviceRatesConditions, setDeviceRatesConditions] = useState<Condition[]>([]);
  const [drugRatesConditions, setDrugRatesConditions] = useState<Condition[]>([]);

  // Popover states
  const [addScopePopover, setAddScopePopover] = useState<{ conditionId: string | null; section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug'; open: boolean } | null>(null);
  const [addTagPopover, setAddTagPopover] = useState<{ conditionId: string; scopeId: string; section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug'; open: boolean } | null>(null);
  const [tagSearchValue, setTagSearchValue] = useState('');
  const [scopeSearchValue, setScopeSearchValue] = useState('');
  const addScopeRef = useRef<HTMLDivElement>(null);
  const addTagRef = useRef<HTMLDivElement>(null);

  // Sample data for autocomplete options based on scope type
  const getScopeOptions = (scopeType: ScopeType): string[] => {
    switch (scopeType) {
      case 'State':
        return ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
      case 'Billing Code':
        return ['HCPCS C9741', 'HCPCS C9742', 'APC 62772', 'APC 62773', 'CPT 99213', 'CPT 99214', 'CPT 99215', 'ICD-10 Z00.00', 'ICD-10 Z00.01', 'MS-DRG 001', 'MS-DRG 002', 'MS-DRG 003'];
      case 'CBSA':
        return ['CBSA 10180', 'CBSA 10420', 'CBSA 10740', 'CBSA 10900', 'CBSA 11100', 'CBSA 11300', 'CBSA 11540', 'CBSA 11700', 'CBSA 12060', 'CBSA 12260', 'CBSA 12420', 'CBSA 12540', 'CBSA 12580', 'CBSA 12620', 'CBSA 12700', 'CBSA 12940', 'CBSA 12980', 'CBSA 13140', 'CBSA 13460', 'CBSA 13820'];
      case 'NPI':
        return ['NPI 1234567890', 'NPI 1234567891', 'NPI 1234567892', 'NPI 1234567893', 'NPI 1234567894', 'NPI 1234567895', 'NPI 1234567896', 'NPI 1234567897', 'NPI 1234567898', 'NPI 1234567899', 'NPI 0987654321', 'NPI 0987654322', 'NPI 0987654323', 'NPI 0987654324', 'NPI 0987654325'];
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
      const target = event.target as Node;
      
      if (addScopePopover?.open && addScopeRef.current && !addScopeRef.current.contains(target)) {
        setAddScopePopover(null);
        setScopeSearchValue('');
      }
      if (addTagPopover?.open && addTagRef.current && !addTagRef.current.contains(target)) {
        setAddTagPopover(null);
        setTagSearchValue('');
      }
    };

    if (addScopePopover?.open || addTagPopover?.open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [addScopePopover, addTagPopover]);

  // Helper functions - generic versions that work with any section
  const getConditions = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug'): Condition[] => {
    if (section === 'hospital') return hospitalRatesConditions;
    if (section === 'payer') return payerRatesConditions;
    if (section === 'device') return deviceRatesConditions;
    if (section === 'drug') return drugRatesConditions;
    return conditions;
  };

  const setConditionsForSection = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', newConditions: Condition[] | ((prev: Condition[]) => Condition[])) => {
    if (section === 'hospital') {
      setHospitalRatesConditions(newConditions as React.SetStateAction<Condition[]>);
    } else if (section === 'payer') {
      setPayerRatesConditions(newConditions as React.SetStateAction<Condition[]>);
    } else if (section === 'device') {
      setDeviceRatesConditions(newConditions as React.SetStateAction<Condition[]>);
    } else if (section === 'drug') {
      setDrugRatesConditions(newConditions as React.SetStateAction<Condition[]>);
    } else {
      setConditions(newConditions as React.SetStateAction<Condition[]>);
    }
  };

  const addCondition = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug') => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      scopes: [],
    };
    const currentConditions = getConditions(section);
    setConditionsForSection(section, [...currentConditions, newCondition]);
  };

  const addScope = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', conditionId: string | null, scopeType: ScopeType) => {
    const currentConditions = getConditions(section);
    
    // If conditionId is null, create a new condition with this scope
    if (conditionId === null) {
      const newCondition: Condition = {
        id: Date.now().toString(),
        scopes: [{ id: `${Date.now()}-1`, type: scopeType, tags: [] }],
      };
      setConditionsForSection(section, [...currentConditions, newCondition]);
    } else {
      // Add scope to existing condition
      setConditionsForSection(section, currentConditions.map(condition => {
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

  const removeScope = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', conditionId: string, scopeId: string) => {
    const currentConditions = getConditions(section);
    setConditionsForSection(section, currentConditions.map(condition => {
      if (condition.id === conditionId) {
        const newScopes = condition.scopes.filter(s => s.id !== scopeId);
        // If no scopes left, remove the entire condition
        if (newScopes.length === 0) {
          return null;
        }
        return { ...condition, scopes: newScopes };
      }
      return condition;
    }).filter(Boolean) as Condition[]);
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
  const addTagsFromCommaSeparated = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', conditionId: string, scopeId: string, inputValue: string) => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    
    // Get current conditions to find scope type
    const currentConditions = getConditions(section);
    const condition = currentConditions.find(c => c.id === conditionId);
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
    setConditionsForSection(section, (prevConditions) => {
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

  const addTag = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', conditionId: string, scopeId: string, tagValue: string) => {
    if (!tagValue.trim()) return;
    
    // Use findMatchingOption to get the correct case/formatted value
    const currentConditions = getConditions(section);
    const condition = currentConditions.find(c => c.id === conditionId);
    if (!condition) return;
    const scope = condition.scopes.find(s => s.id === scopeId);
    if (!scope) return;
    
    const matchingOption = findMatchingOption(scope.type, tagValue);
    if (!matchingOption) return;
    
    setConditionsForSection(section, (prevConditions) => {
      return prevConditions.map(condition => {
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
      });
    });
    setTagSearchValue('');
    setAddTagPopover(null);
  };

  const removeTag = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', conditionId: string, scopeId: string, tagIndex: number) => {
    const currentConditions = getConditions(section);
    setConditionsForSection(section, currentConditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          scopes: condition.scopes.map(scope => {
            if (scope.id === scopeId) {
              const newTags = scope.tags.filter((_, i) => i !== tagIndex);
              return { ...scope, tags: newTags };
            }
            return scope;
          }).filter(scope => scope.tags.length > 0 || condition.scopes.length > 1),
        };
      }
      return condition;
    }).map(condition => {
      // If condition has no scopes with tags, remove it
      if (condition.scopes.every(s => s.tags.length === 0)) {
        return null;
      }
      return condition;
    }).filter(Boolean) as Condition[]);
  };

  // Helper function to render a conditions section
  const renderConditionsSection = (section: 'clear' | 'hospital' | 'payer' | 'device' | 'drug', sectionTitle: string) => {
    const sectionConditions = getConditions(section);
    const isEmpty = sectionConditions.length === 0;
    
    // Get the toggle state based on section
    const getSectionOpen = () => {
      if (section === 'hospital') return hospitalRatesOpen;
      if (section === 'payer') return payerRatesOpen;
      if (section === 'device') return deviceRatesOpen;
      if (section === 'drug') return drugRatesOpen;
      return true;
    };
    
    const setSectionOpen = (open: boolean) => {
      if (section === 'hospital') setHospitalRatesOpen(open);
      else if (section === 'payer') setPayerRatesOpen(open);
      else if (section === 'device') setDeviceRatesOpen(open);
      else if (section === 'drug') setDrugRatesOpen(open);
    };
    
    const isSectionOpen = getSectionOpen();

    return (
      <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
        <div className="flex items-center gap-2 w-full">
          <p className="font-semibold leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
            {sectionTitle}
          </p>
          <label className="relative inline-flex items-center cursor-pointer h-6 ml-auto">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isSectionOpen} 
              onChange={(e) => setSectionOpen(e.target.checked)} 
            />
            <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
          </label>
        </div>
        
        {isSectionOpen && (isEmpty ? (
          // Empty state: just show "Add Scope" button
          <div className="border border-[#e3e7ea] border-solid rounded-lg flex flex-col items-start relative shrink-0 w-full">
            <div className="relative w-full flex justify-center">
              <button
                onClick={() => setAddScopePopover({ conditionId: null, section, open: true })}
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
              {addScopePopover?.conditionId === null && addScopePopover?.section === section && addScopePopover?.open && (
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
                        onClick={() => addScope(section, null, type)}
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
          // Non-empty state: show conditions
          <>
            {sectionConditions.map((condition, conditionIndex) => (
              <div key={condition.id} className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                {/* Condition Box */}
                <div className="border border-[#e3e7ea] border-solid rounded-lg flex flex-col items-start relative shrink-0 w-full">
                  {/* Scopes */}
                  {condition.scopes.map((scope, scopeIndex) => (
                    <div key={scope.id} className="flex gap-2 items-start relative shrink-0 w-full">
                      <div className={`border-b border-[#e3e7ea] border-solid flex gap-3 items-start p-3 relative shrink-0 w-full ${scopeIndex === condition.scopes.length - 1 ? '' : ''}`}>
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
                                onClick={() => removeTag(section, condition.id, scope.id, tagIndex)}
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
                              onClick={() => setAddTagPopover({ conditionId: condition.id, scopeId: scope.id, section, open: true })}
                              className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded"
                            >
                              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                            {/* Add Tag Popover - Searchable Select */}
                            {addTagPopover?.conditionId === condition.id && addTagPopover?.scopeId === scope.id && addTagPopover?.section === section && addTagPopover?.open && (
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
                                            addTagsFromCommaSeparated(section, condition.id, scope.id, inputValue);
                                          } else {
                                            // Single value - check if it matches an option
                                            const matchingOption = findMatchingOption(scope.type, inputValue);
                                            if (matchingOption) {
                                              addTag(section, condition.id, scope.id, matchingOption);
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
                                    .map((option, index) => (
                                    <button
                                      key={option}
                                      onClick={() => addTag(section, condition.id, scope.id, option)}
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
                        onClick={() => removeScope(section, condition.id, scope.id)}
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
                      onClick={() => setAddScopePopover({ conditionId: condition.id, section, open: true })}
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
                    {addScopePopover?.conditionId === condition.id && addScopePopover?.section === section && addScopePopover?.open && (
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
                              onClick={() => addScope(section, condition.id, type)}
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

                {/* OR Divider (only between conditions, not after last) */}
                {conditionIndex < sectionConditions.length - 1 && (
                  <div className="flex gap-2 items-center justify-center relative shrink-0 w-full">
                    <div className="flex-1 grow h-0 min-h-px min-w-px relative shrink-0">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px] h-px border-t border-dashed border-[#e3e7ea]"></div>
                    </div>
                    <p className="font-semibold leading-4 relative shrink-0 text-xs text-[#121313] text-center tracking-[0.12px] whitespace-pre">
                      OR
                    </p>
                    <div className="flex-1 grow h-0 min-h-px min-w-px relative shrink-0">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px] h-px border-t border-dashed border-[#e3e7ea]"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Condition Button */}
            <div className="flex justify-center items-center relative shrink-0 w-full">
              <button 
                onClick={() => addCondition(section)}
                className="flex gap-1 items-center justify-center px-2 py-1 rounded border border-dashed border-[#e3e7ea] bg-white hover:bg-[#f0f2f2] cursor-pointer"
              >
                <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="font-medium leading-4 relative shrink-0 text-[11px] text-[#121313] tracking-[0.11px] whitespace-pre">
                  Add Condition
                </p>
              </button>
            </div>
          </>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
      {/* Header */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex gap-1 items-start pb-6 pt-4 px-0 relative shrink-0 w-full">
        <div className="basis-0 flex flex-col gap-6 grow items-start min-h-px min-w-px relative shrink-0">
          {/* Breadcrumbs */}
          <div className="flex gap-1 items-center text-xs text-[#6e8081] relative shrink-0">
            <Link href="/permissions/products" className="hover:underline">
              Products & Features
            </Link>
            <span>/</span>
            <span className="text-[#121313]">MRF Search</span>
          </div>

          {/* Header with back button and title */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="basis-0 flex gap-1 grow items-center min-h-px min-w-px relative shrink-0">
              <Link href="/permissions/products" className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2 not-italic relative shrink-0">
                <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-[0.16px]">
                  MRF Search
                </p>
                <label className="relative inline-flex items-center cursor-pointer h-6">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={mrfSearchEnabled} 
                    onChange={(e) => setMrfSearchEnabled(e.target.checked)} 
                  />
                  <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
                </label>
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
            </div>
          </div>
        </div>
      </div>

      {/* Customize Features Section */}
      {mrfSearchEnabled && (
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 pt-[24px] mb-4">
          <p className="font-semibold text-sm text-[#121313]">Customize Features</p>
          {isFeaturesDirty && (
            <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
          )}
        </div>
        <div className="flex flex-col gap-6 items-start relative shrink-0 w-full pl-4">
          {/* Export Data */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <p className="font-medium text-xs text-[#121313]">Export Data</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={exportData} onChange={(e) => setExportData(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
            </label>
          </div>
          
          {/* Export Rate Limit */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <p className="font-medium text-xs text-[#121313]">Export Rate Limit</p>
            <input
              type="text"
              value={exportRateLimit}
              onChange={(e) => setExportRateLimit(e.target.value)}
              placeholder="10"
              className="bg-white border border-[#e3e7ea] rounded w-20 px-3 py-2 text-xs text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
            />
          </div>
        </div>
      </div>
      )}

      {/* Data Configuration Section */}
      {mrfSearchEnabled && (
      <div className="box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-4 relative shrink-0 w-full">
        <div className="w-full flex flex-col gap-2 mb-4">
          <p className="font-semibold text-sm text-[#121313]">Data Configuration</p>
          <p className="text-xs text-[#6e8081] leading-4">
            This will apply to both the Analyze and MRF Search products
          </p>
        </div>
        {dataConfigOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
            {/* Hospital & Payer Rates */}
            {renderConditionsSection('hospital', 'Hospital & Payer Rates')}

            {/* Procedure Rates */}
            {renderConditionsSection('payer', 'Procedure Rates')}

            {/* Device Rates */}
            {renderConditionsSection('device', 'Device Rates')}

            {/* Drug Rates */}
            {renderConditionsSection('drug', 'Drug Rates')}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

