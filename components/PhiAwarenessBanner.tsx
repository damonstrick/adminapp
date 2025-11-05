'use client';

export default function PhiAwarenessBanner() {
  return (
    <div className="bg-[#fff9e6] border border-[#ffd700] border-solid flex gap-2 items-start px-4 py-3 relative rounded w-full overflow-hidden">
      <svg className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="flex flex-col gap-1 items-start relative flex-1 min-w-0">
        <p className="font-semibold leading-4 text-xs text-[#92400e] tracking-[0.12px] w-full">
          Protected Health Information (PHI)
        </p>
        <p className="font-normal leading-4 text-xs text-[#78350f] tracking-[0.12px] w-full break-words">
          This system contains Protected Health Information (PHI) as defined by HIPAA. All users must comply with applicable privacy and security regulations. Unauthorized access or disclosure may result in disciplinary action and legal consequences.
        </p>
      </div>
    </div>
  );
}

