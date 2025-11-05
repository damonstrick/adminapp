'use client';

import Link from 'next/link';

export default function StatsCards() {
  return (
    <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
      <div className="flex gap-3 items-center relative shrink-0 w-full">
        <StatCard value="156" label="Members" href="/permissions/members" />
        <StatCard value="2" label="Products" href="/permissions/products" />
        <StatCard value="16" label="Groups" href="/permissions/groups" />
      </div>
    </div>
  );
}

function StatCard({ value, label, href }: { value: string; label: string; href: string }) {
  return (
    <Link href={href} className="flex-1 border border-[#e3e7ea] border-solid box-border flex gap-3 grow items-center min-h-0 min-w-0 p-2 relative rounded-lg shrink-0 hover:bg-[#f7f8f8] hover:border-[#d2d8dc] transition-colors cursor-pointer">
      <div className="flex-1 flex flex-col gap-1 grow items-start min-h-0 min-w-0 relative shrink-0">
        <div className="flex gap-1 items-start relative shrink-0 w-full">
          <div className="flex gap-3 items-center relative shrink-0">
            <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-wide w-[87.5px]">
              {value}
            </p>
          </div>
        </div>
        <div className="flex gap-1 items-center relative shrink-0 w-full">
          <p className="font-normal leading-4 relative shrink-0 text-[#6e8081] text-xs tracking-wide whitespace-pre">
            {label}
          </p>
        </div>
      </div>
    </Link>
  );
}
