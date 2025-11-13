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
        <div className="bg-white border border-[#e3e7ea] border-solid relative rounded-lg shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]">
          <div className="flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
            <div className="box-border flex flex-col gap-2 items-center justify-center p-3 relative shrink-0 w-full">
              <div className="flex gap-4 items-center relative shrink-0 w-full">
                <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                  <div className="overflow-clip relative shrink-0 w-4 h-4">
                    <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="basis-0 flex flex-col gap-0.5 grow items-start min-h-px min-w-px relative shrink-0">
                    <p className="font-medium justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#121313] text-xs tracking-[0.12px] w-full">
                      Organization Details
                    </p>
                    <p className="font-normal justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px] w-full">
                      View and edit organization details
                    </p>
                  </div>
                </div>
                <div className="flex h-4 items-center justify-center relative shrink-0 w-4">
                  <div className="flex-none rotate-90">
                    <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
