'use client';

export default function Banner() {
  return (
    <div className="fixed bg-[#ff7a4e] left-0 right-0 z-20 flex items-center" style={{ top: '48px', left: '64px' }}>
      <div className="flex items-center justify-between px-4 py-3 w-full gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="overflow-clip relative shrink-0 flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
            <svg className="text-[#fff6eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="font-medium leading-4 text-[#fff6eb] text-xs tracking-[0.12px] flex-1 min-w-0">
            <span>Impersonating </span>
            <span className="font-semibold underline">CommonSpirit Health Admin</span>
            <span className="underline"> </span>
            <span>as TQ Staff</span>
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <button className="px-4 py-2 bg-white/20 rounded-lg text-xs font-medium text-[#fff6eb] hover:bg-white/30">
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

