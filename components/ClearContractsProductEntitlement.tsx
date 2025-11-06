'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShinyText from './ShinyText';

export default function ClearContractsProductEntitlement() {
  const [customizeFeaturesOpen, setCustomizeFeaturesOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(true);
  
  // Preferences state
  const [initialPreferences, setInitialPreferences] = useState({
    msDrgSelected: true,
    hcpcsSelected: true,
  });
  const [msDrgSelected, setMsDrgSelected] = useState(initialPreferences.msDrgSelected);
  const [hcpcsSelected, setHcpcsSelected] = useState(initialPreferences.hcpcsSelected);
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Dirty state tracking
  const isPreferencesDirty = (msDrgSelected !== initialPreferences.msDrgSelected) || 
    (hcpcsSelected !== initialPreferences.hcpcsSelected);
  
  const handleSavePreferences = () => {
    setInitialPreferences({ msDrgSelected, hcpcsSelected });
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
            {/* Custom Service Lines */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Custom Service Lines</p>
                <p className="font-normal text-xs text-[#6e8081]">
                  Tailor insights
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Custom Utilization Profile */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Custom Utilization Profile</p>
                <p className="font-normal text-xs text-[#6e8081]">
                  Define custom utilization metrics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
              </label>
            </div>
            {/* Member Preferences */}
            <div className="flex items-start justify-between relative shrink-0 w-full">
              <div className="flex-1">
                <p className="font-medium text-xs text-[#121313] mb-1">Member Preferences</p>
                <p className="font-normal text-xs text-[#6e8081]">
                  Custom preferences for members
                </p>
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
        <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">

          {/* Code Types */}
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
        </div>
      )}
      </div>
    </div>
  );
}

