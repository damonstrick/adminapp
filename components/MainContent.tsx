'use client';

import QuickActions from './QuickActions';
import StatsCards from './StatsCards';
import ProductUsage from './ProductUsage';
import RecentActivity from './RecentActivity';

export default function MainContent() {
  return (
    <div className="bg-white box-border flex flex-col items-start pb-0 pt-4 px-0 relative rounded-lg shrink-0 w-[600px]">
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-3 items-start pb-6 pt-0 px-0 relative shrink-0 w-full">
        <QuickActions />
        <StatsCards />
      </div>
      
      <ProductUsage />
      
      <RecentActivity />
    </div>
  );
}
