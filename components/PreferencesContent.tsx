'use client';

import { useState, useRef, useEffect } from 'react';
import ShinyText from './ShinyText';
import PhiAwarenessBanner from './PhiAwarenessBanner';
import { usePhiBanner } from './PhiBannerContext';

const ALL_PAYER_OPTIONS = ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Humana', 'Medicare', 'Medicaid', 'Anthem', 'Kaiser Permanente', 'AARP'];
const ALL_PROVIDER_OPTIONS = ['St. Mary\'s Medical Center', 'Regional Health Network', 'Community Care Clinic', 'Metro General Hospital', 'Riverside Medical Group', 'Central Health System'];

export default function PreferencesContent() {
  const { showPhiBanner } = usePhiBanner();
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);

  // Initial/clean state
  const [initialTopPayers, setInitialTopPayers] = useState<string[]>([]);
  const [initialTopProviders, setInitialTopProviders] = useState<string[]>([]);
  const [initialCodeTypes, setInitialCodeTypes] = useState({
    msDrgSelected: true,
    hcpcsSelected: true,
  });
  const [initialServiceLineFile, setInitialServiceLineFile] = useState<File | null>(null);

  // Current state
  const [topPayers, setTopPayers] = useState<string[]>([]);
  const [topProviders, setTopProviders] = useState<string[]>([]);
  const [msDrgSelected, setMsDrgSelected] = useState(true);
  const [hcpcsSelected, setHcpcsSelected] = useState(true);
  const [customServiceLineFile, setCustomServiceLineFile] = useState<File | null>(null);

  // Dirty state tracking
  const isTopPayersDirty = JSON.stringify([...topPayers].sort()) !== JSON.stringify([...initialTopPayers].sort());
  const isTopProvidersDirty = JSON.stringify([...topProviders].sort()) !== JSON.stringify([...initialTopProviders].sort());
  const isCodeTypesDirty = (msDrgSelected !== initialCodeTypes.msDrgSelected) || 
    (hcpcsSelected !== initialCodeTypes.hcpcsSelected);
  const isServiceLineFileDirty =
    (customServiceLineFile?.name || '') !== (initialServiceLineFile?.name || '') ||
    (customServiceLineFile?.size || 0) !== (initialServiceLineFile?.size || 0);
  const dirtySectionsCount = [
    isTopPayersDirty,
    isTopProvidersDirty,
    isCodeTypesDirty,
    isServiceLineFileDirty,
  ].filter(Boolean).length;

  // Accordion states
  const [topPayersOpen, setTopPayersOpen] = useState(true);
  const [topProvidersOpen, setTopProvidersOpen] = useState(true);
  const [codeTypesOpen, setCodeTypesOpen] = useState(true);
  const [serviceLineFileOpen, setServiceLineFileOpen] = useState(true);

  // Popover states
  const [payerPopoverOpen, setPayerPopoverOpen] = useState(false);
  const [providerPopoverOpen, setProviderPopoverOpen] = useState(false);
  const [payerSearchValue, setPayerSearchValue] = useState('');
  const [providerSearchValue, setProviderSearchValue] = useState('');
  const payerPopoverRef = useRef<HTMLDivElement>(null);
  const providerPopoverRef = useRef<HTMLDivElement>(null);
  const payerButtonRef = useRef<HTMLButtonElement>(null);
  const providerButtonRef = useRef<HTMLButtonElement>(null);
  const serviceLineFileInputRef = useRef<HTMLInputElement>(null);

  // Filter options
  const getFilteredPayers = (searchValue: string): string[] => {
    const available = ALL_PAYER_OPTIONS.filter(p => !topPayers.includes(p));
    if (!searchValue) return available;
    return available.filter(payer => 
      payer.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getFilteredProviders = (searchValue: string): string[] => {
    const available = ALL_PROVIDER_OPTIONS.filter(p => !topProviders.includes(p));
    if (!searchValue) return available;
    return available.filter(provider => 
      provider.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Add/remove functions
  const addPayer = (payer: string) => {
    if (!topPayers.includes(payer)) {
      setTopPayers([...topPayers, payer]);
    }
    setPayerPopoverOpen(false);
    setPayerSearchValue('');
  };

  const removePayer = (payer: string) => {
    setTopPayers(topPayers.filter(p => p !== payer));
  };

  const addProvider = (provider: string) => {
    if (!topProviders.includes(provider)) {
      setTopProviders([...topProviders, provider]);
    }
    setProviderPopoverOpen(false);
    setProviderSearchValue('');
  };

  const removeProvider = (provider: string) => {
    setTopProviders(topProviders.filter(p => p !== provider));
  };

  const handleServiceLineFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCustomServiceLineFile(file);
  };

  const handleClearServiceLineFile = () => {
    setCustomServiceLineFile(null);
    if (serviceLineFileInputRef.current) {
      serviceLineFileInputRef.current.value = '';
    }
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (payerPopoverRef.current && !payerPopoverRef.current.contains(event.target as Node) && 
          payerButtonRef.current && !payerButtonRef.current.contains(event.target as Node)) {
        setPayerPopoverOpen(false);
        setPayerSearchValue('');
      }
      if (providerPopoverRef.current && !providerPopoverRef.current.contains(event.target as Node) &&
          providerButtonRef.current && !providerButtonRef.current.contains(event.target as Node)) {
        setProviderPopoverOpen(false);
        setProviderSearchValue('');
      }
    };

    if (payerPopoverOpen || providerPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [payerPopoverOpen, providerPopoverOpen]);

  // Save handlers
  const handleSaveTopPayers = () => {
    setInitialTopPayers(topPayers);
    console.log('Saving top payers:', topPayers);
    setSavedSection('topPayers');
    setTimeout(() => setSavedSection(null), 2000);
  };

  const handleSaveTopProviders = () => {
    setInitialTopProviders(topProviders);
    console.log('Saving top providers:', topProviders);
    setSavedSection('topProviders');
    setTimeout(() => setSavedSection(null), 2000);
  };

  const handleSaveCodeTypes = () => {
    setInitialCodeTypes({ msDrgSelected, hcpcsSelected });
    console.log('Saving preferences:', { msDrgSelected, hcpcsSelected });
    setSavedSection('codeTypes');
    setTimeout(() => setSavedSection(null), 2000);
  };

  const handleSaveServiceLineFile = () => {
    setInitialServiceLineFile(customServiceLineFile);
    console.log('Saving custom service line file:', customServiceLineFile?.name || 'None');
    setSavedSection('serviceLineFile');
    setTimeout(() => setSavedSection(null), 2000);
  };

  const handleSaveAll = () => {
    const sectionsToSave: string[] = [];
    if (isTopPayersDirty) sectionsToSave.push('topPayers');
    if (isTopProvidersDirty) sectionsToSave.push('topProviders');
    if (isCodeTypesDirty) sectionsToSave.push('codeTypes');
    if (isServiceLineFileDirty) sectionsToSave.push('serviceLineFile');
    
    handleSaveTopPayers();
    handleSaveTopProviders();
    handleSaveCodeTypes();
    handleSaveServiceLineFile();
    
    setSavedSection('all');
    setSavedSectionsFromAll(sectionsToSave);
    setTimeout(() => {
      setSavedSection(null);
      setSavedSectionsFromAll([]);
    }, 2000);
  };

  return (
    <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
      {/* PHI Awareness Banner - conditionally shown */}
      {showPhiBanner && (
        <div className="px-0 pb-4 pt-0 w-full">
          <PhiAwarenessBanner />
        </div>
      )}

      {/* Top Payers Section */}
    <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setTopPayersOpen(!topPayersOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Top Payers</p>
            {isTopPayersDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isTopPayersDirty && savedSection !== 'topPayers' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveTopPayers();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'topPayers' || (savedSection === 'all' && savedSectionsFromAll.includes('topPayers'))) && (
              <div className="text-xs font-medium">
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setTopPayersOpen(!topPayersOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${topPayersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {topPayersOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            <div className="flex flex-wrap gap-2 items-start relative shrink-0 w-full">
              {topPayers.map((payer) => (
                <div key={payer} className="flex gap-1 items-center bg-[#f7f8f8] border border-[#e3e7ea] rounded-full px-2 py-0.5 relative shrink-0">
                  <p className="font-normal leading-4 relative shrink-0 text-[11px] text-[#121313] tracking-[0.11px]">
                    {payer}
                  </p>
                  <button
                    onClick={() => removePayer(payer)}
                    className="flex items-center justify-center w-3 h-3 rounded-full hover:bg-[#e3e7ea] relative shrink-0"
                  >
                    <svg className="w-2.5 h-2.5 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="relative">
                <button
                  ref={payerButtonRef}
                  onClick={() => setPayerPopoverOpen(!payerPopoverOpen)}
                  className="flex items-center justify-center w-5 h-5 rounded-full border border-dashed border-[#e3e7ea] hover:bg-[#f7f8f8] relative shrink-0"
                >
                  <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {payerPopoverOpen && (
                  <div 
                    ref={payerPopoverRef}
                    className="absolute top-full left-0 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                  >
                    <div className="border-b border-[#e3e7ea] border-solid pb-3 mb-0">
                      <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={payerSearchValue}
                          onChange={(e) => setPayerSearchValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setPayerPopoverOpen(false);
                              setPayerSearchValue('');
                            }
                          }}
                          placeholder="Search payers"
                          className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                      {getFilteredPayers(payerSearchValue).map((payer) => (
                        <button
                          key={payer}
                          onClick={() => addPayer(payer)}
                          className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                        >
                          <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                            {payer}
                          </p>
                        </button>
                      ))}
                      {getFilteredPayers(payerSearchValue).length === 0 && (
                        <div className="w-full p-2 text-center">
                          <p className="font-normal text-xs text-[#6e8081]">No payers available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    {/* Top Providers Section */}
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setTopProvidersOpen(!topProvidersOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Top Providers</p>
            {isTopProvidersDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isTopProvidersDirty && savedSection !== 'topProviders' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveTopProviders();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'topProviders' || (savedSection === 'all' && savedSectionsFromAll.includes('topProviders'))) && (
              <div className="text-xs font-medium">
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setTopProvidersOpen(!topProvidersOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${topProvidersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {topProvidersOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            <div className="flex flex-wrap gap-2 items-start relative shrink-0 w-full">
              {topProviders.map((provider) => (
                <div key={provider} className="flex gap-1 items-center bg-[#f7f8f8] border border-[#e3e7ea] rounded-full px-2 py-0.5 relative shrink-0">
                  <p className="font-normal leading-4 relative shrink-0 text-[11px] text-[#121313] tracking-[0.11px]">
                    {provider}
                  </p>
                  <button
                    onClick={() => removeProvider(provider)}
                    className="flex items-center justify-center w-3 h-3 rounded-full hover:bg-[#e3e7ea] relative shrink-0"
                  >
                    <svg className="w-2.5 h-2.5 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="relative">
                <button
                  ref={providerButtonRef}
                  onClick={() => setProviderPopoverOpen(!providerPopoverOpen)}
                  className="flex items-center justify-center w-5 h-5 rounded-full border border-dashed border-[#e3e7ea] hover:bg-[#f7f8f8] relative shrink-0"
                >
                  <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {providerPopoverOpen && (
                  <div 
                    ref={providerPopoverRef}
                    className="absolute top-full left-0 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                  >
                    <div className="border-b border-[#e3e7ea] border-solid pb-3 mb-0">
                      <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={providerSearchValue}
                          onChange={(e) => setProviderSearchValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setProviderPopoverOpen(false);
                              setProviderSearchValue('');
                            }
                          }}
                          placeholder="Search providers"
                          className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                      {getFilteredProviders(providerSearchValue).map((provider) => (
                        <button
                          key={provider}
                          onClick={() => addProvider(provider)}
                          className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                        >
                          <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                            {provider}
                          </p>
                        </button>
                      ))}
                      {getFilteredProviders(providerSearchValue).length === 0 && (
                        <div className="w-full p-2 text-center">
                          <p className="font-normal text-xs text-[#6e8081]">No providers available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Type Crosswalks Section */}
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setCodeTypesOpen(!codeTypesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Code Type Crosswalks</p>
            {isCodeTypesDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isCodeTypesDirty && savedSection !== 'codeTypes' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveCodeTypes();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'codeTypes' || (savedSection === 'all' && savedSectionsFromAll.includes('codeTypes'))) && (
              <div className="text-xs font-medium">
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setCodeTypesOpen(!codeTypesOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${codeTypesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {codeTypesOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
              <p className="font-semibold leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                Code Types
              </p>
              <p className="font-normal leading-4 relative shrink-0 text-xs text-[#4b595c] tracking-[0.12px]">
                Select your preferred coding system for how rates and codes are displayed across the platform.
              </p>
            </div>

            {/* MS-DRG vs APR-DRG */}
            <div className="flex gap-[80px] items-center relative shrink-0 w-full">
              <div className="flex gap-2 items-start relative shrink-0">
                <div className="flex gap-2 items-start relative shrink-0">
                  <button
                    onClick={() => setMsDrgSelected(true)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      msDrgSelected ? 'border-[#16696d]' : 'border-[#d2d8dc]'
                    }`}
                  >
                    {msDrgSelected && <div className="w-2 h-2 rounded-full bg-[#16696d]"></div>}
                  </button>
                  <div className="flex flex-col items-start relative shrink-0">
                    <div className="flex gap-1 items-start relative shrink-0">
                      <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                        MS-DRG
                      </p>
                      <p className="font-normal h-[15px] leading-4 relative shrink-0 text-[11px] text-[#6e8081] tracking-[0.11px] w-[54px]">
                        (Default)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-start relative shrink-0">
                  <button
                    onClick={() => setMsDrgSelected(false)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      !msDrgSelected ? 'border-[#16696d]' : 'border-[#d2d8dc]'
                    }`}
                  >
                    {!msDrgSelected && <div className="w-2 h-2 rounded-full bg-[#16696d]"></div>}
                  </button>
                  <div className="flex flex-col items-start justify-center relative shrink-0">
                    <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                      APR-DRG
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-normal leading-4 relative grow text-[11px] text-[#6e8081] tracking-[0.11px] break-words">
                Turquoise provides a crosswalk between the two most widely used DRG systems: MS-DRGs and APR-DRGs. This lets you view and compare rates consistently, regardless of which coding system a hospital uses.
              </p>
            </div>
            {/* HCPCS vs APC */}
            <div className="flex gap-[114px] items-center relative shrink-0 w-full">
              <div className="flex gap-2 items-start relative shrink-0">
                <div className="flex gap-2 items-start relative shrink-0">
                  <button
                    onClick={() => setHcpcsSelected(true)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      hcpcsSelected ? 'border-[#16696d]' : 'border-[#d2d8dc]'
                    }`}
                  >
                    {hcpcsSelected && <div className="w-2 h-2 rounded-full bg-[#16696d]"></div>}
                  </button>
                  <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    HCPCS
                  </p>
                  <p className="font-normal h-[15px] leading-4 relative shrink-0 text-[11px] text-[#6e8081] tracking-[0.11px] w-[54px]">
                    (Default)
                  </p>
                </div>
                <div className="flex gap-2 items-start relative shrink-0">
                  <button
                    onClick={() => setHcpcsSelected(false)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      !hcpcsSelected ? 'border-[#16696d]' : 'border-[#d2d8dc]'
                    }`}
                  >
                    {!hcpcsSelected && <div className="w-2 h-2 rounded-full bg-[#16696d]"></div>}
                  </button>
                  <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                    APC
                  </p>
                </div>
              </div>
              <p className="font-normal leading-4 relative grow text-[11px] text-[#6e8081] tracking-[0.11px] break-words">
                Turquoise also crosswalks HCPCS and APC codes, allowing outpatient rates to be compared consistently across both coding systems.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Service Line File */}
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setServiceLineFileOpen(!serviceLineFileOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Custom Service Line File</p>
            {isServiceLineFileDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isServiceLineFileDirty && savedSection !== 'serviceLineFile' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveServiceLineFile();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'serviceLineFile' || (savedSection === 'all' && savedSectionsFromAll.includes('serviceLineFile'))) && (
              <div className="text-xs font-medium">
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setServiceLineFileOpen(!serviceLineFileOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${serviceLineFileOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {serviceLineFileOpen && (
          <div className="flex flex-col gap-4 w-full">
            <p className="text-xs text-[#4b595c] leading-4">
              Upload a CSV or XLSX that defines the service lines this PRG should honor. Once saved, the file will power custom service line targeting anywhere these preferences are referenced.
            </p>
            <div className="w-full rounded-lg bg-[#f7f8f8] px-4 py-3 flex items-center gap-4">
              <button
                onClick={() => serviceLineFileInputRef.current?.click()}
                className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-semibold hover:bg-[#0d5256]"
              >
                Choose File
              </button>
              <div className="flex-1 flex items-center justify-between">
                {customServiceLineFile ? (
                  <>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm text-[#121313]">{customServiceLineFile.name}</p>
                      <p className="text-xs text-[#6e8081]">
                        {(customServiceLineFile.size / 1024).toFixed(1)} KB · CSV/XLSX
                      </p>
                    </div>
                    <button
                      onClick={handleClearServiceLineFile}
                      className="text-xs font-medium text-[#16696d] hover:text-[#0d5256]"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-[#6e8081]">Upload CSV or XLSX · 5MB max</p>
                )}
              </div>
              <input
                ref={serviceLineFileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleServiceLineFileChange}
              />
            </div>
            <div className="w-full bg-white border border-[#e3e7ea] rounded-lg p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#e6f4f3] flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-[#1b827e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M12 6v6"
                    />
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#121313]">CSV Format</p>
              </div>
              <div className="flex flex-col gap-3 text-xs text-[#4b595c] leading-5">
                <p>File must be a .csv and have the following three columns:</p>
                <p>
                  <span className="font-semibold text-[#121313]">1. code:</span>{' '}
                  The billing code (e.g. 99213). Do not list a code more than once.
                </p>
                <p>
                  <span className="font-semibold text-[#121313]">2. code_type:</span>{' '}
                  Billing code type. Allowed values are CPT, HCPCS, MS-DRG, APR-DRG, RC, APC, and EAPG; all other code type values will be excluded from the report.
                </p>
                <p>
                  <span className="font-semibold text-[#121313]">3. category_name:</span>{' '}
                  String identifying the service line or category. 20 characters recommended, maximum 30 characters.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg border border-[#d2d8dc] bg-white text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]">
                  Learn About The File Setup
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#d2d8dc] bg-white text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]">
                  Download Template
                </button>
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
