'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShinyText from './ShinyText';
import SectionHeader from './SectionHeader';

export default function DirectDataAccessProductEntitlement() {
  // Data Access section state
  const [initialDataAccess, setInitialDataAccess] = useState({
    hospitalData: true,
    payerData: false,
    visibleToUser: true,
  });
  
  const [hospitalData, setHospitalData] = useState(initialDataAccess.hospitalData);
  const [payerData, setPayerData] = useState(initialDataAccess.payerData);
  const [visibleToUser, setVisibleToUser] = useState(initialDataAccess.visibleToUser);
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Data Access section dirty state
  const isDataAccessDirty = JSON.stringify({
    hospitalData,
    payerData,
    visibleToUser,
  }) !== JSON.stringify(initialDataAccess);
  
  const handleSaveDataAccess = () => {
    setInitialDataAccess({
      hospitalData,
      payerData,
      visibleToUser,
    });
    console.log('Saving data access section:', {
      hospitalData,
      payerData,
      visibleToUser,
    });
    setSavedSection('dataAccess');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('dataAccess');
      setTimeout(() => setSavedSection(null), 300);
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
            <span className="text-[#121313]">Product Entitlement</span>
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
                  Direct Data Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Access Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-[24px] relative shrink-0 w-full">
        <SectionHeader title="Data Access" showDirtyDot={isDataAccessDirty} />
        <div className="flex flex-col gap-6 items-start relative shrink-0 w-full pl-4 pt-0">
          {/* Hospital Data */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <p className="font-medium text-xs text-[#121313]">Hospital Data</p>
            <input
              type="checkbox"
              checked={hospitalData}
              onChange={(e) => setHospitalData(e.target.checked)}
              className="w-4 h-4 text-[#16696d] border-[#e3e7ea] rounded focus:ring-[#16696d] focus:ring-2"
            />
          </div>
          
          {/* Payer Data */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <p className="font-medium text-xs text-[#121313]">Payer Data</p>
            <input
              type="checkbox"
              checked={payerData}
              onChange={(e) => setPayerData(e.target.checked)}
              className="w-4 h-4 text-[#16696d] border-[#e3e7ea] rounded focus:ring-[#16696d] focus:ring-2"
            />
          </div>
          
          {/* Visible To User */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-5">
            <p className="font-medium text-xs text-[#121313]">Visible To User</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={visibleToUser} onChange={(e) => setVisibleToUser(e.target.checked)} />
              <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16696d] relative"></div>
            </label>
          </div>
        </div>
        
        {/* Save button */}
        <div className="w-full flex justify-end mt-6">
          {isDataAccessDirty && savedSection !== 'dataAccess' && savedSection !== 'all' && (
            <button
              onClick={handleSaveDataAccess}
              className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
            >
              Save
            </button>
          )}
          {(savedSection === 'dataAccess' || (savedSection === 'all')) && (
            <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'dataAccess' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
              <ShinyText text="Saved" speed={3} />
            </div>
          )}
        </div>
      </div>

      {/* Trino Information Section */}
      <div className="box-border flex flex-col gap-2 items-start px-0 pt-[24px] pb-4 relative shrink-0 w-full">
        <SectionHeader
          title="Trino Information"
          action={
            <button className="px-4 py-2 bg-white border border-[#e3e7ea] text-[#121313] rounded-lg text-xs font-medium hover:bg-[#f0f2f2] flex items-center gap-2">
              View In Trino
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          }
        />
        <div className="flex flex-col gap-6 items-start relative shrink-0 w-full pl-4">
          {/* Trino UUID */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-4">
            <p className="font-medium text-xs text-[#121313]">Trino UUID</p>
            <p className="font-normal text-xs text-[#121313]">82773632</p>
          </div>
          
          {/* Organization Name */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-4">
            <p className="font-medium text-xs text-[#121313]">Organization Name</p>
            <p className="font-normal text-xs text-[#121313]">CommonSpirit Health</p>
          </div>
          
          {/* Access Configuration */}
          <div className="flex items-start justify-between relative shrink-0 w-full">
            <p className="font-medium text-xs text-[#121313]">Access Configuration</p>
            <div className="flex flex-col gap-3 items-end relative shrink-0">
              <div className="flex gap-2 items-center justify-center relative shrink-0">
                <div className="w-3 h-3 border border-dashed border-[#6e8081] rounded-full bg-transparent"></div>
                <p className="font-normal text-xs text-[#6e8081]">Claims Data Access</p>
              </div>
              <div className="flex gap-2 items-center justify-center relative shrink-0">
                <div className="w-3 h-3 border border-dashed border-[#6e8081] rounded-full bg-transparent"></div>
                <p className="font-normal text-xs text-[#6e8081]">Payer Data Access</p>
              </div>
              <div className="flex gap-2 items-center justify-center relative shrink-0">
                <div className="w-3 h-3 bg-[#16696d] border border-[#16696d] rounded-full"></div>
                <p className="font-normal text-xs text-[#121313]">Hospital Data Access</p>
              </div>
              <div className="flex gap-2 items-center justify-center relative shrink-0">
                <div className="w-3 h-3 bg-[#16696d] border border-[#16696d] rounded-full"></div>
                <p className="font-normal text-xs text-[#121313]">Hospital Historical Data Access</p>
              </div>
              <div className="flex gap-2 items-center justify-center relative shrink-0">
                <div className="w-3 h-3 bg-[#16696d] border border-[#16696d] rounded-full"></div>
                <p className="font-normal text-xs text-[#121313]">Reference Data Access</p>
              </div>
            </div>
          </div>
          
          {/* State Limitations */}
          <div className="flex items-center justify-between relative shrink-0 w-full h-4">
            <p className="font-medium text-xs text-[#121313]">State Limitations</p>
            <p className="font-normal text-xs text-[#6e8081]">No State Limitations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

