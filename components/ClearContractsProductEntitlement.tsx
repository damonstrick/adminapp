'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShinyText from './ShinyText';

export default function ClearContractsProductEntitlement() {
  const [customizeFeaturesOpen, setCustomizeFeaturesOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  
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
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Dirty state tracking
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
    setSavedSection('preferences');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('preferences');
      setTimeout(() => {
        setSavedSection(null);
        setFadingOut(null);
      }, 300);
    }, 2000);
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
        <button
          onClick={() => setCustomizeFeaturesOpen(!customizeFeaturesOpen)}
          className="w-full flex items-center gap-2 mb-4"
        >
          <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="font-semibold text-sm text-[#121313]">Customize Features</p>
          <svg
            className={`w-5 h-5 text-[#121313] transition-transform ml-auto ${customizeFeaturesOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {customizeFeaturesOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
            {/* AskTQ Contract */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AskTQ Contract</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* AskTQ Payer Policy */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AskTQ Payer Policy</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Document Viewer */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Document Viewer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Rate Summary */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Rate Summary</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Neaural Indexing */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Neaural Indexing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Auto Indexing */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Auto Indexing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Auto Extract Rate Tables */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Auto Extract Rate Tables</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* AI Context */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">AI Context</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Redacto */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Redacto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* CC Approval Workflow */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">CC Approval Workflow</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Claims Data Schema */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Claims Data Schema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
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
            {isPreferencesDirty && savedSection !== 'preferences' && (
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
            {savedSection === 'preferences' && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${fadingOut === 'preferences' ? 'opacity-0' : 'opacity-100'}`}>
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
    </div>
  );
}

