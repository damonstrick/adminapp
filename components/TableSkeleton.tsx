'use client';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasSearch?: boolean;
  hasSearchActions?: boolean;
}

export default function TableSkeleton({ columns, rows = 5, hasSearch = true, hasSearchActions = false }: TableSkeletonProps) {
  return (
    <div className="flex flex-col items-start relative w-full" style={{ gap: hasSearch ? '12px' : '0' }}>
      {/* Search Bar Skeleton */}
      {hasSearch && (
        <div className="flex flex-col items-start relative shrink-0 w-full">
          {hasSearchActions ? (
            <div className="flex gap-2 items-start relative shrink-0 w-full">
              <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-2 items-center h-8 px-3 py-2 relative rounded-lg flex-1 animate-pulse">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="flex-1 h-4 bg-gray-300 rounded" />
              </div>
              <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse" />
            </div>
          ) : (
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-2 items-center h-8 px-3 py-2 relative rounded-lg shrink-0 w-full animate-pulse">
              <div className="w-4 h-4 bg-gray-300 rounded" />
              <div className="flex-1 h-4 bg-gray-300 rounded" />
            </div>
          )}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="border border-[#e3e7ea] border-solid relative rounded-lg shrink-0 w-full">
        <div className="box-border flex items-start overflow-clip px-px py-0 relative rounded-[inherit] w-full">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col items-start relative shrink-0 basis-0 grow min-h-px min-w-px">
              {/* Header */}
              <div className="bg-[#f7f8f8] border-b border-[#d2d8dc] border-solid box-border flex gap-1 items-center min-h-[33px] pl-3 pr-2 py-2 relative shrink-0 w-full">
                <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
              </div>

              {/* Rows */}
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`bg-white border-solid box-border h-16 min-h-[32px] py-2 relative shrink-0 w-full flex items-center pl-3 pr-2 ${
                    rowIndex < rows - 1 ? 'border-b border-[#e3e7ea]' : ''
                  }`}
                >
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex gap-2 items-center justify-center relative shrink-0 w-full">
        <div className="w-20 h-8 bg-gray-300 rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse" />
        <div className="w-20 h-8 bg-gray-300 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}


