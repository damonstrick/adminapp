'use client';

export default function ProductUsage() {
  return (
    <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-3 items-start px-0 pt-6 pb-[48px] relative shrink-0 w-full">
      <div className="flex gap-2 items-center relative shrink-0 w-full">
        <div className="overflow-clip relative shrink-0 w-4 h-4">
          <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-wide whitespace-pre">
          Member Allocation
        </p>
      </div>
      
      <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
        <ProgressBar
          label="Analyze"
          label2="Clear Contracts"
          progress={75}
          remaining={25}
        />
      </div>
    </div>
  );
}

function ProgressBar({ label, label2, progress, remaining }: { label: string; label2: string; progress: number; remaining: number }) {
  return (
    <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" style={{ height: '20px' }}>
        <p className="absolute left-0 overflow-ellipsis overflow-hidden text-sm text-[#6e8081] font-normal leading-5">
          {label}
        </p>
        <p className="absolute overflow-ellipsis overflow-hidden text-sm text-[#6e8081] font-normal leading-5" style={{ left: `${progress}%` }}>
          {label2}
        </p>
      </div>
      <div className="relative shrink-0 w-full" style={{ height: '4px' }}>
        <div 
          className="absolute bg-[#7c8af4] rounded-full" 
          style={{ top: 0, left: 0, width: '100%', height: '4px' }} 
        />
        <div 
          className="absolute bg-[#36c5ba] rounded-full"
          style={{ 
            top: 0, 
            left: 0, 
            width: `${progress}%`, 
            height: '4px',
            borderRight: '2px solid white'
          }}
        />
      </div>
      <div className="relative shrink-0 w-full">
        <div className="absolute left-0">
          <Badge count={`${progress}%`} />
        </div>
        <div className="absolute" style={{ left: `${progress}%` }}>
          <Badge count={`${remaining}%`} />
        </div>
      </div>
    </div>
  );
}

function Badge({ count }: { count: string }) {
  return (
    <div className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#4b595c] text-xs font-medium">
      {count}
    </div>
  );
}
