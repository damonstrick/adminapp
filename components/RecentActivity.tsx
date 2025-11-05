'use client';

const activities = [
  { text: "John Smith added to CC - Admin group", time: "3 hours ago" },
  { text: "Sarah Johnson updated Clear Contracts permissions", time: "3 hours ago" },
  { text: "New member Michael Brown joined organization", time: "3 hours ago" },
  { text: "Analytics - Viewer group permissions updated", time: "3 hours ago" },
  { text: "Emily Rodriguez removed from Product Managers group", time: "5 hours ago" },
  { text: "David Kim created new Security Team group", time: "6 hours ago" },
  { text: "Jessica Martinez assigned Admin role for Analyze product", time: "7 hours ago" },
  { text: "Robert Taylor invited 3 new members to organization", time: "8 hours ago" },
  { text: "Amanda White updated group description for Sales Team", time: "9 hours ago" },
];

export default function RecentActivity() {
  return (
    <div className="box-border flex flex-col gap-3 items-start pb-3 pt-6 px-0 relative shrink-0 w-full">
      <div className="flex gap-2 items-center relative shrink-0 w-full">
        <div className="overflow-clip relative shrink-0 w-4 h-4">
          <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 flex gap-2 grow items-center min-h-0 min-w-0 relative shrink-0">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-wide whitespace-pre">
            Recent Activity
          </p>
          <Badge count="9" />
        </div>
        <button className="px-3 py-1.5 text-sm text-[#16696d] hover:text-[#0d5256] font-medium">
          View All
        </button>
      </div>
      
      <div className="flex flex-col items-start relative shrink-0 w-full">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            text={activity.text}
            time={activity.time}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ text, time, isLast }: { text: string; time: string; isLast: boolean }) {
  return (
    <div
      className={`border-b border-gray-200 border-solid box-border flex flex-col font-normal gap-1 items-start px-0 py-3 relative shrink-0 w-full whitespace-pre ${
        isLast ? 'border-b-0' : ''
      }`}
    >
      <p className="leading-4 relative shrink-0 text-[#121313] text-xs tracking-wide">
        {text}
      </p>
      <p className="leading-4 relative shrink-0 text-[#6e8081] text-[11px] tracking-wide">
        {time}
      </p>
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
