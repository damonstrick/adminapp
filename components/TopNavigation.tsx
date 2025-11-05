'use client';

export default function TopNavigation() {
  return (
    <div className="fixed bg-white border-b border-[#e3e7ea] h-12 top-0 z-20 flex items-center m-0 p-0" style={{ left: '64px', right: '0', marginLeft: 0, marginRight: 0 }}>
      <div className="flex h-12 items-center justify-between px-4 py-0 w-full relative">
        <div className="flex gap-3 items-center relative shrink-0">
          <button className="flex gap-1 items-center justify-center max-h-8 min-w-8 relative rounded shrink-0 w-8 h-8 hover:bg-[#f0f2f2]">
            <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col items-start justify-center relative shrink-0">
            <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-wide w-full">
              Morning, Doug
            </p>
            <p className="font-normal leading-4 relative shrink-0 text-[#4b595c] text-xs tracking-wide w-full">
              Thursday, Feb 3
            </p>
          </div>
        </div>
        
        {/* Search box centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-1 h-8 items-center px-3 py-2 relative rounded-lg shrink-0 w-[400px]">
            <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="font-normal leading-4 relative shrink-0 text-[#89989b] text-xs tracking-wide whitespace-pre">
              Ask a question or search
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center justify-end relative shrink-0">
            <div className="flex gap-1 items-center justify-end relative shrink-0 w-[167px]">
              <button className="flex gap-1 items-center justify-center max-h-8 min-w-8 relative rounded shrink-0 w-8 h-8 hover:bg-[#f0f2f2]">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="flex gap-1 items-center justify-center max-h-8 min-w-8 relative rounded shrink-0 w-8 h-8 hover:bg-[#f0f2f2]">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="bg-white border border-white border-solid relative rounded-full shrink-0 w-6 h-6">
              <div className="flex gap-2.5 items-center justify-center overflow-clip relative rounded-[inherit] w-6 h-6">
                <div className="flex-1 grow h-full min-h-0 min-w-0 relative shrink-0 bg-[#6e8081] rounded-full" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
