'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShinyText from './ShinyText';


export default function ClearContractsProductEntitlement() {
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  const [seatConfigOpen, setSeatConfigOpen] = useState(true);
  const [rateLimitOpen, setRateLimitOpen] = useState(true);
  const [processesOpen, setProcessesOpen] = useState(true);
  const [claimsDataSchemaOpen, setClaimsDataSchemaOpen] = useState(true);
  
  // Claims Data Schema state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Seat Configuration state
  const [initialSeatConfig, setInitialSeatConfig] = useState({
    seatMode: 'unlimited' as 'unlimited' | 'custom',
    numberOfSeats: '',
  });
  const [seatMode, setSeatMode] = useState<'unlimited' | 'custom'>(initialSeatConfig.seatMode);
  const [numberOfSeats, setNumberOfSeats] = useState(initialSeatConfig.numberOfSeats);
  
  // Features state (top section - no collapsible)
  const [initialFeatures, setInitialFeatures] = useState({
    askTqContract: false,
    askTqPayerPolicy: false,
    rateSummary: false,
    scenarioModeling: false,
  });
  
  const [askTqContract, setAskTqContract] = useState(initialFeatures.askTqContract);
  const [askTqPayerPolicy, setAskTqPayerPolicy] = useState(initialFeatures.askTqPayerPolicy);
  const [rateSummary, setRateSummary] = useState(initialFeatures.rateSummary);
  const [scenarioModeling, setScenarioModeling] = useState(initialFeatures.scenarioModeling);
  
  // Rate Limit Configuration state
  const [initialRateLimit, setInitialRateLimit] = useState({
    medicareApiRateLimit: '',
  });
  const [medicareApiRateLimit, setMedicareApiRateLimit] = useState(initialRateLimit.medicareApiRateLimit);
  
  // Processes state
  const [initialProcesses, setInitialProcesses] = useState({
    autoIndexing: false,
    neuralIndexing: false,
    autoExtractRateTables: false,
    redacto: false,
    claimsDataSchema: false,
    approvalWorkflow: false,
    aiContext: false,
    customTagTemplatesOnly: false,
  });
  
  const [autoIndexing, setAutoIndexing] = useState(initialProcesses.autoIndexing);
  const [neuralIndexing, setNeuralIndexing] = useState(initialProcesses.neuralIndexing);
  const [autoExtractRateTables, setAutoExtractRateTables] = useState(initialProcesses.autoExtractRateTables);
  const [redacto, setRedacto] = useState(initialProcesses.redacto);
  const [claimsDataSchema, setClaimsDataSchema] = useState(initialProcesses.claimsDataSchema);
  const [approvalWorkflow, setApprovalWorkflow] = useState(initialProcesses.approvalWorkflow);
  const [aiContext, setAiContext] = useState(initialProcesses.aiContext);
  const [customTagTemplatesOnly, setCustomTagTemplatesOnly] = useState(initialProcesses.customTagTemplatesOnly);
  
  // Preferences state
  const [initialPreferences, setInitialPreferences] = useState({
    notifyOnDocUpload: true,
    enableRenewalEmails: true,
    enableFolderView: false,
    enableDocumentHierarchy: false,
    enableIntakeStatuses: false,
    enableRenewalDates: false,
    renewalsMs2: false,
  });
  
  // Checkbox states for Preferences
  const [notifyOnDocUpload, setNotifyOnDocUpload] = useState(initialPreferences.notifyOnDocUpload);
  const [enableRenewalEmails, setEnableRenewalEmails] = useState(initialPreferences.enableRenewalEmails);
  const [enableFolderView, setEnableFolderView] = useState(initialPreferences.enableFolderView);
  const [enableDocumentHierarchy, setEnableDocumentHierarchy] = useState(initialPreferences.enableDocumentHierarchy);
  const [enableIntakeStatuses, setEnableIntakeStatuses] = useState(initialPreferences.enableIntakeStatuses);
  const [enableRenewalDates, setEnableRenewalDates] = useState(initialPreferences.enableRenewalDates);
  const [renewalsMs2, setRenewalsMs2] = useState(initialPreferences.renewalsMs2);
  
  // Track if saved
  const [isSaved, setIsSaved] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  
  // Individual feature dirty states
  const isAskTqContractDirty = askTqContract !== initialFeatures.askTqContract;
  const isAskTqPayerPolicyDirty = askTqPayerPolicy !== initialFeatures.askTqPayerPolicy;
  const isRateSummaryDirty = rateSummary !== initialFeatures.rateSummary;
  const isScenarioModelingDirty = scenarioModeling !== initialFeatures.scenarioModeling;
  
  // Dirty state tracking
  const isFeaturesDirty = JSON.stringify({
    askTqContract,
    askTqPayerPolicy,
    rateSummary,
    scenarioModeling,
  }) !== JSON.stringify(initialFeatures);
  
  const isRateLimitDirty = JSON.stringify({
    medicareApiRateLimit,
  }) !== JSON.stringify(initialRateLimit);
  
  const isProcessesDirty = JSON.stringify({
    autoIndexing,
    neuralIndexing,
    autoExtractRateTables,
    redacto,
    claimsDataSchema,
    approvalWorkflow,
    aiContext,
    customTagTemplatesOnly,
  }) !== JSON.stringify(initialProcesses);
  
  const isPreferencesDirty = JSON.stringify({
    notifyOnDocUpload,
    enableRenewalEmails,
    enableFolderView,
    enableDocumentHierarchy,
    enableIntakeStatuses,
    enableRenewalDates,
    renewalsMs2,
  }) !== JSON.stringify(initialPreferences);
  
  const isSeatConfigDirty = JSON.stringify({
    seatMode,
    numberOfSeats,
  }) !== JSON.stringify(initialSeatConfig);
  
  const dirtySectionsCount = [isAskTqContractDirty, isAskTqPayerPolicyDirty, isRateSummaryDirty, isScenarioModelingDirty, isSeatConfigDirty, isRateLimitDirty, isProcessesDirty, isPreferencesDirty].filter(Boolean).length;
  
  const handleSaveFeatures = () => {
    setInitialFeatures({
      askTqContract,
      askTqPayerPolicy,
      rateSummary,
      scenarioModeling,
    });
    console.log('Saving features:', {
      askTqContract,
      askTqPayerPolicy,
      rateSummary,
      scenarioModeling,
    });
  };
  
  const handleSaveAskTqContract = () => {
    setInitialFeatures(prev => ({ ...prev, askTqContract }));
  };
  
  const handleSaveAskTqPayerPolicy = () => {
    setInitialFeatures(prev => ({ ...prev, askTqPayerPolicy }));
  };
  
  const handleSaveRateSummary = () => {
    setInitialFeatures(prev => ({ ...prev, rateSummary }));
  };
  
  const handleSaveScenarioModeling = () => {
    setInitialFeatures(prev => ({ ...prev, scenarioModeling }));
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
  };
  
  const handleSaveRateLimit = () => {
    setInitialRateLimit({
      medicareApiRateLimit,
    });
    console.log('Saving rate limit:', {
      medicareApiRateLimit,
    });
  };
  
  const handleSaveProcesses = () => {
    setInitialProcesses({
      autoIndexing,
      neuralIndexing,
      autoExtractRateTables,
      redacto,
      claimsDataSchema,
      approvalWorkflow,
      aiContext,
      customTagTemplatesOnly,
    });
    console.log('Saving processes:', {
      autoIndexing,
      neuralIndexing,
      autoExtractRateTables,
      redacto,
      claimsDataSchema,
      approvalWorkflow,
      aiContext,
      customTagTemplatesOnly,
    });
  };
  
  const handleSavePreferences = () => {
    setInitialPreferences({
      notifyOnDocUpload,
      enableRenewalEmails,
      enableFolderView,
      enableDocumentHierarchy,
      enableIntakeStatuses,
      enableRenewalDates,
      renewalsMs2,
    });
    console.log('Saving preferences:', {
      notifyOnDocUpload,
      enableRenewalEmails,
      enableFolderView,
      enableDocumentHierarchy,
      enableIntakeStatuses,
      enableRenewalDates,
      renewalsMs2,
    });
  };
  
  // Check if any section is dirty
  const hasDirtySections = dirtySectionsCount > 0;
  
  const handleSaveAll = () => {
    // Save individual features
    if (isAskTqContractDirty) handleSaveAskTqContract();
    if (isAskTqPayerPolicyDirty) handleSaveAskTqPayerPolicy();
    if (isRateSummaryDirty) handleSaveRateSummary();
    if (isScenarioModelingDirty) handleSaveScenarioModeling();
    handleSaveSeatConfig();
    handleSaveRateLimit();
    handleSaveProcesses();
    handleSavePreferences();
    
    setIsSaved(true);
    setFadingOut(false);
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setIsSaved(false), 300);
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

      {/* Features Section - Individual toggles at top */}
      <div className="box-border flex flex-col gap-0 items-start px-0 relative shrink-0 w-full">
        {/* AskTQ Contract */}
        <div className="w-full flex items-center gap-2 pt-[24px] pb-[24px] border-b border-[#e3e7ea] border-solid">
          <button className="flex items-center gap-2 flex-1 h-6">
            <p className="font-semibold text-sm text-[#121313]">AskTQ Contract</p>
            {isAskTqContractDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <label className="relative inline-flex items-center cursor-pointer h-6">
            <input type="checkbox" className="sr-only peer" checked={askTqContract} onChange={(e) => setAskTqContract(e.target.checked)} />
            <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
          </label>
        </div>
        
        {/* AskTQ Payer Policy */}
        <div className="w-full flex items-center gap-2 pt-[24px] pb-[24px] border-b border-[#e3e7ea] border-solid">
          <button className="flex items-center gap-2 flex-1 h-6">
            <p className="font-semibold text-sm text-[#121313]">AskTQ Payer Policy</p>
            {isAskTqPayerPolicyDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <label className="relative inline-flex items-center cursor-pointer h-6">
            <input type="checkbox" className="sr-only peer" checked={askTqPayerPolicy} onChange={(e) => setAskTqPayerPolicy(e.target.checked)} />
            <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
          </label>
        </div>
        
        {/* Rate Summary */}
        <div className="w-full flex items-center gap-2 pt-[24px] pb-[24px] border-b border-[#e3e7ea] border-solid">
          <button className="flex items-center gap-2 flex-1 h-6">
            <p className="font-semibold text-sm text-[#121313]">Rate Summary</p>
            {isRateSummaryDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <label className="relative inline-flex items-center cursor-pointer h-6">
            <input type="checkbox" className="sr-only peer" checked={rateSummary} onChange={(e) => setRateSummary(e.target.checked)} />
            <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
          </label>
        </div>
        
        {/* Scenario Modeling */}
        <div className="w-full flex items-center gap-2 pt-[24px] pb-[24px] border-b border-[#e3e7ea] border-solid">
          <button className="flex items-center gap-2 flex-1 h-6">
            <p className="font-semibold text-sm text-[#121313]">Scenario Modeling</p>
            {isScenarioModelingDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <label className="relative inline-flex items-center cursor-pointer h-6">
            <input type="checkbox" className="sr-only peer" checked={scenarioModeling} onChange={(e) => setScenarioModeling(e.target.checked)} />
            <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
          </label>
        </div>
      </div>

      {/* Seat Configuration Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setSeatConfigOpen(!seatConfigOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Seat Configuration</p>
            {isSeatConfigDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
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

          </div>
        )}
      </div>

      {/* Rate Limit Configuration Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setRateLimitOpen(!rateLimitOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Rate Limit Configuration</p>
            {isRateLimitDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <button
            onClick={() => setRateLimitOpen(!rateLimitOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${rateLimitOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {rateLimitOpen && (
          <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
            <label className="text-xs font-normal text-[#121313]">Medicare API Rate Limit</label>
            <input
              type="text"
              value={medicareApiRateLimit}
              onChange={(e) => setMedicareApiRateLimit(e.target.value)}
              placeholder="Hint Label"
              className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
            />
          </div>
        )}
      </div>

      {/* Processes Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setProcessesOpen(!processesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Processes</p>
            {isProcessesDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <button
            onClick={() => setProcessesOpen(!processesOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${processesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {processesOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full" style={{ paddingLeft: '16px' }}>
          {/* Auto Indexing */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Auto Indexing</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={autoIndexing} onChange={(e) => setAutoIndexing(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Neural Indexing */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Neural Indexing</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={neuralIndexing} onChange={(e) => setNeuralIndexing(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Auto Extract Rate Tables */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Auto Extract Rate Tables</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={autoExtractRateTables} onChange={(e) => setAutoExtractRateTables(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Redacto */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Redacto</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={redacto} onChange={(e) => setRedacto(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Claims Data Schema */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Claims Data Schema</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={claimsDataSchema} onChange={(e) => setClaimsDataSchema(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Approval Workflow */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Approval Workflow</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={approvalWorkflow} onChange={(e) => setApprovalWorkflow(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* AI Context */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">AI Context</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={aiContext} onChange={(e) => setAiContext(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          
          {/* Custom Tag Templates Only */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Custom Tag Templates Only</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={customTagTemplatesOnly} onChange={(e) => setCustomTagTemplatesOnly(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
            </label>
          </div>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <p className="font-semibold text-sm text-[#121313]">Preferences</p>
            {isPreferencesDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
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
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full" style={{ paddingLeft: '16px' }}>
            {/* Notification on doc upload */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Notification on doc upload</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifyOnDocUpload} onChange={(e) => setNotifyOnDocUpload(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Renewal emails */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Renewal emails</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableRenewalEmails} onChange={(e) => setEnableRenewalEmails(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Folder view */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Folder view</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableFolderView} onChange={(e) => setEnableFolderView(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Rate summary customer */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Rate summary customer</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={false} onChange={() => {}} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Document hierarchy */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Document hierarchy</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableDocumentHierarchy} onChange={(e) => setEnableDocumentHierarchy(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Intake statuses */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Intake statuses</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableIntakeStatuses} onChange={(e) => setEnableIntakeStatuses(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Renewal dates */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Renewal dates</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableRenewalDates} onChange={(e) => setEnableRenewalDates(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            
            {/* Renewals MS2 */}
            <div className="flex items-center justify-between relative shrink-0 w-full h-5">
              <p className="font-medium text-xs text-[#121313]">Renewals MS2</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={renewalsMs2} onChange={(e) => setRenewalsMs2(e.target.checked)} />
                <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Claims Data Schema Section */}
      <div className="box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="w-full flex items-center gap-2 h-6">
            <button
              onClick={() => setClaimsDataSchemaOpen(!claimsDataSchemaOpen)}
              className="flex items-center gap-2 flex-1 h-6"
            >
              <p className="font-semibold text-sm text-[#121313]">Claims Data Schema</p>
            </button>
            <div className="w-[60px] h-6 flex items-center justify-center">
            </div>
            <button
              onClick={() => setClaimsDataSchemaOpen(!claimsDataSchemaOpen)}
              className="flex items-center h-6"
            >
              <svg
                className={`w-5 h-5 text-[#121313] transition-transform ${claimsDataSchemaOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-[#6e8081] leading-4">
            Upload a custom claims data schema to define how incoming data is mapped and interpreted.
          </p>
        </div>
        {claimsDataSchemaOpen && (
          <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
            <div className="flex gap-6 h-14 items-end relative rounded-lg shrink-0 w-full">
              <div className="basis-0 bg-[#f7f8f8] box-border flex gap-4 grow items-center min-h-px min-w-px p-3 relative rounded-lg shrink-0">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                  />
                  <div className="bg-[#16696d] flex gap-2 h-8 items-center justify-center max-h-8 px-3 py-2 relative rounded shrink-0">
                    <p className="font-medium leading-4 not-italic relative shrink-0 text-white text-xs text-center whitespace-pre">
                      Choose File
                    </p>
                  </div>
                </label>
                <p className="basis-0 font-normal grow leading-4 min-h-px min-w-px not-italic relative shrink-0 text-[#6e8081] text-xs">
                  {selectedFile ? selectedFile.name : 'Upload .pdf, .doc, or .txt'}
                </p>
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

