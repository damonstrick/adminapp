'use client';

import { useState } from 'react';

interface IdBadgeProps {
  id: string;
}

export default function IdBadge({ id }: IdBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-[#f0f2f2] px-2 py-1 rounded text-[#4b595c] text-[11px] font-medium leading-4 flex items-center gap-1 hover:bg-[#e3e7ea] transition-colors"
    >
      {id}
      <svg className="w-3 h-3 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2M16 7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        )}
      </svg>
    </button>
  );
}


