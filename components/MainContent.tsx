'use client';

import QuickActions from './QuickActions';
import StatsCards from './StatsCards';

export default function MainContent() {
  return (
    <div className="bg-white box-border flex flex-col items-start pb-0 pt-4 px-0 relative rounded-lg shrink-0 w-[600px]">
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-3 items-start pb-6 pt-0 px-0 relative shrink-0 w-full">
        <QuickActions />
        <StatsCards />
      </div>
      
      {/* Organization Details Button */}
      <div className="pt-6 w-full">
        <button className="bg-white border border-[#e3e7ea] border-solid rounded-lg w-full hover:bg-[#f7f8f8] hover:border-[#d2d8dc] transition-colors cursor-pointer">
          <div className="flex flex-col gap-2 items-center justify-center p-3 w-full">
            <div className="flex gap-4 items-center w-full">
              <div className="flex gap-2 items-center flex-1 min-w-0">
                <div className="relative shrink-0 w-4 h-4">
                  <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p className="font-medium leading-4 text-[#121313] text-xs tracking-[0.12px] overflow-ellipsis overflow-hidden w-full">
                    Organization Details
                  </p>
                  <p className="font-normal leading-4 text-[#6e8081] text-xs tracking-[0.12px] overflow-ellipsis overflow-hidden w-full">
                    View and edit organization details
                  </p>
                </div>
              </div>
              <div className="flex-none rotate-90">
                <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
