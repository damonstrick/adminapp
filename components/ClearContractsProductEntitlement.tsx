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

export default function ClearContractsProductEntitlement() {
  const [customizeFeaturesOpen, setCustomizeFeaturesOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  const [seatConfigOpen, setSeatConfigOpen] = useState(true);
  const [dataConfigOpen, setDataConfigOpen] = useState(true);
  
  // Seat Configuration state
  const [initialSeatConfig, setInitialSeatConfig] = useState({
    seatMode: 'unlimited' as 'unlimited' | 'custom',
    numberOfSeats: '',
  });
  const [seatMode, setSeatMode] = useState<'unlimited' | 'custom'>(initialSeatConfig.seatMode);
  const [numberOfSeats, setNumberOfSeats] = useState(initialSeatConfig.numberOfSeats);
  
  // Data Configuration state - Initialize with empty state
  const [initialDataConfig, setInitialDataConfig] = useState<{
    conditions: Condition[];
    hospitalRatesConditions: Condition[];
    payerRatesConditions: Condition[];
  }>({
    conditions: [],
    hospitalRatesConditions: [],
    payerRatesConditions: [],
  });
  const [conditions, setConditions] = useState<Condition[]>(initialDataConfig.conditions);
  const [hospitalRatesConditions, setHospitalRatesConditions] = useState<Condition[]>(initialDataConfig.hospitalRatesConditions);
  const [payerRatesConditions, setPayerRatesConditions] = useState<Condition[]>(initialDataConfig.payerRatesConditions);
  
  // Popover states
  const [addScopePopover, setAddScopePopover] = useState<{ conditionId: string | null; section: 'clear' | 'hospital' | 'payer'; open: boolean } | null>(null);
  const [addTagPopover, setAddTagPopover] = useState<{ conditionId: string; scopeId: string; section: 'clear' | 'hospital' | 'payer'; open: boolean } | null>(null);
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
  const getConditions = (section: 'clear' | 'hospital' | 'payer'): Condition[] => {
    if (section === 'hospital') return hospitalRatesConditions;
    if (section === 'payer') return payerRatesConditions;
    return conditions;
  };
  
  const setConditionsForSection = (section: 'clear' | 'hospital' | 'payer', newConditions: Condition[]) => {
    if (section === 'hospital') {
      setHospitalRatesConditions(newConditions);
    } else if (section === 'payer') {
      setPayerRatesConditions(newConditions);
    } else {
      setConditions(newConditions);
    }
  };
  
  const addCondition = (section: 'clear' | 'hospital' | 'payer') => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      scopes: [],
    };
    const currentConditions = getConditions(section);
    setConditionsForSection(section, [...currentConditions, newCondition]);
  };
  
  const addScope = (section: 'clear' | 'hospital' | 'payer', conditionId: string | null, scopeType: ScopeType) => {
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
  
  const removeScope = (section: 'clear' | 'hospital' | 'payer', conditionId: string, scopeId: string) => {
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
  
  const addTag = (section: 'clear' | 'hospital' | 'payer', conditionId: string, scopeId: string, tagValue: string) => {
    if (!tagValue.trim()) return;
    const currentConditions = getConditions(section);
    setConditionsForSection(section, currentConditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          scopes: condition.scopes.map(scope => {
            if (scope.id === scopeId) {
              // Don't add if tag already exists
              if (scope.tags.includes(tagValue.trim())) {
                return scope;
              }
              return { ...scope, tags: [...scope.tags, tagValue.trim()] };
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
  
  const removeTag = (section: 'clear' | 'hospital' | 'payer', conditionId: string, scopeId: string, tagIndex: number) => {
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
  const renderConditionsSection = (section: 'clear' | 'hospital' | 'payer', sectionTitle: string) => {
    const sectionConditions = getConditions(section);
    const isEmpty = sectionConditions.length === 0;
    
    return (
      <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
        <p className="font-semibold leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
          {sectionTitle}
        </p>
        
        {isEmpty ? (
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
                                        setAddTagPopover(null);
                                        setTagSearchValue('');
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
                                {getFilteredOptions(scope.type, tagSearchValue)
                                  .filter(option => !scope.tags.includes(option)) // Filter out already added tags
                                  .map((option) => (
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
                                {getFilteredOptions(scope.type, tagSearchValue).filter(option => !scope.tags.includes(option)).length === 0 && (
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
        )}
      </div>
    );
  };
  
  // Customize Features state
  const [initialCustomizeFeatures, setInitialCustomizeFeatures] = useState({
    askTqContract: false,
    askTqPayerPolicy: false,
    documentViewer: false,
    rateSummary: false,
    neauralIndexing: false,
    autoIndexing: false,
    autoExtractRateTables: false,
    aiContext: false,
    redacto: false,
    ccApprovalWorkflow: false,
    claimsDataSchema: false,
  });
  
  const [askTqContract, setAskTqContract] = useState(initialCustomizeFeatures.askTqContract);
  const [askTqPayerPolicy, setAskTqPayerPolicy] = useState(initialCustomizeFeatures.askTqPayerPolicy);
  const [documentViewer, setDocumentViewer] = useState(initialCustomizeFeatures.documentViewer);
  const [rateSummary, setRateSummary] = useState(initialCustomizeFeatures.rateSummary);
  const [neauralIndexing, setNeauralIndexing] = useState(initialCustomizeFeatures.neauralIndexing);
  const [autoIndexing, setAutoIndexing] = useState(initialCustomizeFeatures.autoIndexing);
  const [autoExtractRateTables, setAutoExtractRateTables] = useState(initialCustomizeFeatures.autoExtractRateTables);
  const [aiContext, setAiContext] = useState(initialCustomizeFeatures.aiContext);
  const [redacto, setRedacto] = useState(initialCustomizeFeatures.redacto);
  const [ccApprovalWorkflow, setCcApprovalWorkflow] = useState(initialCustomizeFeatures.ccApprovalWorkflow);
  const [claimsDataSchema, setClaimsDataSchema] = useState(initialCustomizeFeatures.claimsDataSchema);
  
  // Preferences state
  const [initialPreferences, setInitialPreferences] = useState({
    notifyOnDocUpload: true,
    enableRenewalEmails: true,
    enableFolderView: false,
    rateSummaryCustomer: false,
    enableDocumentHierarchy: false,
    enableIntakeStatuses: false,
    enableRenewalDates: false,
    renewalsMs2: false,
  });
  
  // Checkbox states for Preferences
  const [notifyOnDocUpload, setNotifyOnDocUpload] = useState(initialPreferences.notifyOnDocUpload);
  const [enableRenewalEmails, setEnableRenewalEmails] = useState(initialPreferences.enableRenewalEmails);
  const [enableFolderView, setEnableFolderView] = useState(initialPreferences.enableFolderView);
  const [rateSummaryCustomer, setRateSummaryCustomer] = useState(initialPreferences.rateSummaryCustomer);
  const [enableDocumentHierarchy, setEnableDocumentHierarchy] = useState(initialPreferences.enableDocumentHierarchy);
  const [enableIntakeStatuses, setEnableIntakeStatuses] = useState(initialPreferences.enableIntakeStatuses);
  const [enableRenewalDates, setEnableRenewalDates] = useState(initialPreferences.enableRenewalDates);
  const [renewalsMs2, setRenewalsMs2] = useState(initialPreferences.renewalsMs2);
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Dirty state tracking
  const isCustomizeFeaturesDirty = JSON.stringify({
    askTqContract,
    askTqPayerPolicy,
    documentViewer,
    rateSummary,
    neauralIndexing,
    autoIndexing,
    autoExtractRateTables,
    aiContext,
    redacto,
    ccApprovalWorkflow,
    claimsDataSchema,
  }) !== JSON.stringify(initialCustomizeFeatures);
  
  const isPreferencesDirty = JSON.stringify({
    notifyOnDocUpload,
    enableRenewalEmails,
    enableFolderView,
    rateSummaryCustomer,
    enableDocumentHierarchy,
    enableIntakeStatuses,
    enableRenewalDates,
    renewalsMs2,
  }) !== JSON.stringify(initialPreferences);
  
  const isSeatConfigDirty = JSON.stringify({
    seatMode,
    numberOfSeats,
  }) !== JSON.stringify(initialSeatConfig);
  
  const isDataConfigDirty = JSON.stringify({
    conditions: conditions.sort((a, b) => a.id.localeCompare(b.id)),
    hospitalRatesConditions: hospitalRatesConditions.sort((a, b) => a.id.localeCompare(b.id)),
    payerRatesConditions: payerRatesConditions.sort((a, b) => a.id.localeCompare(b.id)),
  }) !== JSON.stringify({
    conditions: initialDataConfig.conditions.sort((a, b) => a.id.localeCompare(b.id)),
    hospitalRatesConditions: initialDataConfig.hospitalRatesConditions.sort((a, b) => a.id.localeCompare(b.id)),
    payerRatesConditions: initialDataConfig.payerRatesConditions.sort((a, b) => a.id.localeCompare(b.id)),
  });
  
  const dirtySectionsCount = [isCustomizeFeaturesDirty, isSeatConfigDirty, isDataConfigDirty, isPreferencesDirty].filter(Boolean).length;
  
  const handleSaveCustomizeFeatures = () => {
    setInitialCustomizeFeatures({
      askTqContract,
      askTqPayerPolicy,
      documentViewer,
      rateSummary,
      neauralIndexing,
      autoIndexing,
      autoExtractRateTables,
      aiContext,
      redacto,
      ccApprovalWorkflow,
      claimsDataSchema,
    });
    console.log('Saving customize features:', {
      askTqContract,
      askTqPayerPolicy,
      documentViewer,
      rateSummary,
      neauralIndexing,
      autoIndexing,
      autoExtractRateTables,
      aiContext,
      redacto,
      ccApprovalWorkflow,
      claimsDataSchema,
    });
    setSavedSection('customizeFeatures');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('customizeFeatures');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveSeatConfig = () => {
    setInitialSeatConfig({
      seatMode,
      numberOfSeats,
    });
    console.log('Saving seat configuration:', {
      seatMode,
      numberOfSeats,
    });
    setSavedSection('seatConfig');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('seatConfig');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveDataConfig = () => {
    setInitialDataConfig({
      conditions: [...conditions],
      hospitalRatesConditions: [...hospitalRatesConditions],
      payerRatesConditions: [...payerRatesConditions],
    });
    console.log('Saving data configuration:', {
      conditions,
      hospitalRatesConditions,
      payerRatesConditions,
    });
    setSavedSection('dataConfig');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('dataConfig');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSavePreferences = () => {
    setInitialPreferences({
      notifyOnDocUpload,
      enableRenewalEmails,
      enableFolderView,
      rateSummaryCustomer,
      enableDocumentHierarchy,
      enableIntakeStatuses,
      enableRenewalDates,
      renewalsMs2,
    });
    console.log('Saving preferences:', {
      notifyOnDocUpload,
      enableRenewalEmails,
      enableFolderView,
      rateSummaryCustomer,
      enableDocumentHierarchy,
      enableIntakeStatuses,
      enableRenewalDates,
      renewalsMs2,
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
    if (isCustomizeFeaturesDirty) sectionsToSave.push('customizeFeatures');
    if (isSeatConfigDirty) sectionsToSave.push('seatConfig');
    if (isDataConfigDirty) sectionsToSave.push('dataConfig');
    if (isPreferencesDirty) sectionsToSave.push('preferences');
    
    handleSaveCustomizeFeatures();
    handleSaveSeatConfig();
    handleSaveDataConfig();
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
            <span className="text-[#121313]">Clear Contracts</span>
          </div>

          {/* Header with back button and title */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="basis-0 flex gap-1 grow items-center min-h-px min-w-px relative shrink-0">
              <Link href="/permissions/products" className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
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
          </div>
        </div>
      </div>

      {/* Customize Features Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setCustomizeFeaturesOpen(!customizeFeaturesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Customize Features</p>
            {isCustomizeFeaturesDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isCustomizeFeaturesDirty && savedSection !== 'customizeFeatures' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveCustomizeFeatures();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'customizeFeatures' || (savedSection === 'all' && savedSectionsFromAll.includes('customizeFeatures'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'customizeFeatures' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setCustomizeFeaturesOpen(!customizeFeaturesOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${customizeFeaturesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {customizeFeaturesOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            {/* AskTQ Contract */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AskTQ Contract</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={askTqContract} onChange={(e) => setAskTqContract(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* AskTQ Payer Policy */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AskTQ Payer Policy</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={askTqPayerPolicy} onChange={(e) => setAskTqPayerPolicy(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Document Viewer */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Document Viewer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={documentViewer} onChange={(e) => setDocumentViewer(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Rate Summary */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Rate Summary</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={rateSummary} onChange={(e) => setRateSummary(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Neaural Indexing */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Neaural Indexing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={neauralIndexing} onChange={(e) => setNeauralIndexing(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Auto Indexing */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Auto Indexing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autoIndexing} onChange={(e) => setAutoIndexing(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Auto Extract Rate Tables */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Auto Extract Rate Tables</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autoExtractRateTables} onChange={(e) => setAutoExtractRateTables(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* AI Context */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AI Context</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={aiContext} onChange={(e) => setAiContext(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Redacto */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Redacto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={redacto} onChange={(e) => setRedacto(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* CC Approval Workflow */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">CC Approval Workflow</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={ccApprovalWorkflow} onChange={(e) => setCcApprovalWorkflow(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Claims Data Schema */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Claims Data Schema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={claimsDataSchema} onChange={(e) => setClaimsDataSchema(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Seat Configuration Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setSeatConfigOpen(!seatConfigOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Seat Configuration</p>
            {isSeatConfigDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isSeatConfigDirty && savedSection !== 'seatConfig' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveSeatConfig();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'seatConfig' || (savedSection === 'all' && savedSectionsFromAll.includes('seatConfig'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'seatConfig' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setSeatConfigOpen(!seatConfigOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${seatConfigOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {seatConfigOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            {/* Toggle Buttons */}
            <div className="flex gap-2 h-8 items-start relative shrink-0 w-full">
              <button
                onClick={() => setSeatMode('unlimited')}
                className={`flex-1 flex items-center justify-center h-8 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  seatMode === 'unlimited'
                    ? 'bg-[#16696d] text-white'
                    : 'bg-white border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
                }`}
              >
                Unlimited
              </button>
              <button
                onClick={() => setSeatMode('custom')}
                className={`flex-1 flex items-center justify-center h-8 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  seatMode === 'custom'
                    ? 'bg-[#16696d] text-white'
                    : 'bg-white border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Number of Seats Input - Only show when Custom is selected */}
            {seatMode === 'custom' && (
              <div className="w-full">
                <label className="block text-xs font-medium text-[#121313] mb-2">Number of Seats</label>
                <input
                  type="number"
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(e.target.value)}
                  placeholder="Hint Label"
                  className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                />
              </div>
            )}

            {/* Seat Usage */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 w-full">
              <div className="flex items-center gap-2 mb-4">
                <p className="font-semibold text-sm text-[#101828]">Seat Usage</p>
                <div className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium">
                  15
                </div>
              </div>
              <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                {/* Admin */}
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                  <div className="flex items-center gap-1 justify-between w-full">
                    <p className="font-medium text-[11px] text-[#6e8081]">Admin</p>
                    <p className="font-medium text-[11px] text-[#6e8081]">8</p>
                  </div>
                  <div className="h-1 relative shrink-0 w-full">
                    <div className="absolute bg-[#f0f2f2] inset-0 rounded-full" />
                    <div className="absolute bg-[#36c5ba] bottom-0 left-0 rounded-full top-0" style={{ right: '25%' }} />
                  </div>
                </div>
                {/* Editor */}
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                  <div className="flex items-center gap-1 justify-between w-full">
                    <p className="font-medium text-[11px] text-[#6e8081]">Editor</p>
                    <p className="font-medium text-[11px] text-[#6e8081]">4</p>
                  </div>
                  <div className="h-1 relative shrink-0 w-full">
                    <div className="absolute bg-[#f0f2f2] inset-0 rounded-full" />
                    <div className="absolute bg-[#36c5ba] bottom-0 left-0 rounded-full top-0" style={{ right: '50%' }} />
                  </div>
                </div>
                {/* Viewer */}
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                  <div className="flex items-center gap-1 justify-between w-full">
                    <p className="font-medium text-[11px] text-[#6e8081]">Viewer</p>
                    <p className="font-medium text-[11px] text-[#6e8081]">3</p>
                  </div>
                  <div className="h-1 relative shrink-0 w-full">
                    <div className="absolute bg-[#f0f2f2] inset-0 rounded-full" />
                    <div className="absolute bg-[#36c5ba] bottom-0 left-0 rounded-full top-0" style={{ right: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Configuration Section */}
      <div className="box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setDataConfigOpen(!dataConfigOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Data Configuration</p>
            {isDataConfigDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isDataConfigDirty && savedSection !== 'dataConfig' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveDataConfig();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'dataConfig' || (savedSection === 'all' && savedSectionsFromAll.includes('dataConfig'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'dataConfig' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setDataConfigOpen(!dataConfigOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${dataConfigOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {dataConfigOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
            {/* Clear Rates */}
            {renderConditionsSection('clear', 'Clear Rates')}

            {/* Hospital Rates */}
            {renderConditionsSection('hospital', 'Hospital Rates')}

            {/* Payer Rates */}
            {renderConditionsSection('payer', 'Payer Rates')}
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Preferences</p>
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
          <div className="flex flex-col gap-8 items-start relative shrink-0 w-full">
            {/* Notifications & Communication */}
            <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <p className="font-semibold leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                  Notifications & Communication
                </p>
                <p className="font-normal leading-4 relative shrink-0 text-xs text-[#6e8081] tracking-[0.12px]">
                  Controls for user notifications, emails, and approvals
                </p>
              </div>
              <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setNotifyOnDocUpload(!notifyOnDocUpload)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      notifyOnDocUpload
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {notifyOnDocUpload && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable notification on doc upload
                  </p>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setEnableRenewalEmails(!enableRenewalEmails)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      enableRenewalEmails
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {enableRenewalEmails && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable renewal emails
                  </p>
                </div>
              </div>
            </div>

            {/* Organization & Display */}
            <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <p className="font-semibold leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                  Organization & Display
                </p>
                <p className="font-normal leading-4 relative shrink-0 text-xs text-[#6e8081] tracking-[0.12px]">
                  UI and grouping behavior within the Clear Contracts product
                </p>
              </div>
              <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setEnableFolderView(!enableFolderView)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      enableFolderView
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {enableFolderView && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable folder view
                  </p>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setRateSummaryCustomer(!rateSummaryCustomer)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      rateSummaryCustomer
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {rateSummaryCustomer && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Rate summary customer
                  </p>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setEnableDocumentHierarchy(!enableDocumentHierarchy)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      enableDocumentHierarchy
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {enableDocumentHierarchy && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable document hierarchy
                  </p>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setEnableIntakeStatuses(!enableIntakeStatuses)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      enableIntakeStatuses
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {enableIntakeStatuses && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable intake statuses
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Lifecycle */}
            <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <p className="font-semibold leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                  Contract Lifecycle
                </p>
                <p className="font-normal leading-4 relative shrink-0 text-xs text-[#6e8081] tracking-[0.12px]">
                  Time-based features and automations
                </p>
              </div>
              <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setEnableRenewalDates(!enableRenewalDates)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      enableRenewalDates
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {enableRenewalDates && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Enable renewal dates
                  </p>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <button
                    onClick={() => setRenewalsMs2(!renewalsMs2)}
                    className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      renewalsMs2
                        ? 'bg-[#16696d] border-[#16696d]'
                        : 'bg-white border-[#d2d8dc] hover:bg-[#e8f2f4]'
                    }`}
                  >
                    {renewalsMs2 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    Renewals MS2
                  </p>
                </div>
              </div>
            </div>
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
  );
}

