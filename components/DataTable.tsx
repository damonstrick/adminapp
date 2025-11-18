'use client';

import Link from 'next/link';

interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  headerIcon?: React.ReactNode;
  wrap?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T, index: number) => string | void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchActions?: React.ReactNode;
  pagination?: React.ReactNode;
  searchTableGap?: string;
}

export default function DataTable<T extends { id?: string }>({
  columns,
  data,
  onRowClick,
  searchPlaceholder = 'Ask a question or search',
  searchValue,
  onSearchChange,
  searchActions,
  pagination,
  searchTableGap = '12px',
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col items-start relative w-full" style={{ gap: searchTableGap }}>
      {/* Search Bar */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        {searchActions ? (
          <div className="flex gap-2 items-start relative shrink-0 w-full">
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-2 items-stretch px-3 py-0 relative rounded-lg flex-1" style={{ height: '32px' }}>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="bg-transparent flex-1 font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-wide outline-none border-none flex items-center"
              />
              <div className="flex gap-1 items-center relative shrink-0 pt-[2px] pb-[2px]">
                <div className="bg-white border border-[#e3e7ea] rounded px-1.5" style={{ paddingTop: '2px', paddingBottom: '2px', lineHeight: '1' }}>
                  <span className="font-medium text-[11px] leading-none text-[#4b595c] block" style={{ marginTop: '-2px' }}>/</span>
                </div>
              </div>
            </div>
            {searchActions}
          </div>
        ) : (
          <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-2 items-stretch px-3 py-0 relative rounded-lg shrink-0 w-full" style={{ height: '32px' }}>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="bg-transparent flex-1 font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-wide outline-none border-none flex items-center"
            />
            <div className="flex gap-1 items-center relative shrink-0 pt-[2px] pb-[2px]">
              <div className="bg-white border border-[#e3e7ea] rounded px-1.5" style={{ paddingTop: '2px', paddingBottom: '2px', lineHeight: '1' }}>
                <span className="font-medium text-[11px] leading-none text-[#4b595c] block" style={{ marginTop: '-2px' }}>/</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-[#e3e7ea] border-solid relative rounded-lg shrink-0 w-full">
        <div className="box-border flex items-start overflow-clip px-px py-0 relative rounded-[inherit] w-full">
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`flex flex-col items-start relative shrink-0 ${
                column.width ? '' : 'basis-0 grow min-h-px min-w-px'
              }`}
              style={column.width ? { width: column.width } : undefined}
            >
              {/* Header */}
              <div
                className={`bg-[#f7f8f8] border-b border-[#d2d8dc] border-solid box-border flex gap-1 items-center min-h-[33px] py-2 relative shrink-0 w-full ${
                  column.align === 'right' ? 'pl-2 pr-3 justify-end' : column.align === 'center' ? 'px-3 justify-center' : 'pl-3 pr-2'
                }`}
              >
                {column.headerIcon && (
                  <div className="overflow-clip relative shrink-0 w-3 h-3">
                    {column.headerIcon}
                  </div>
                )}
                <p
                  className={`font-semibold leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px] whitespace-pre ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''
                  }`}
                >
                  {column.header}
                </p>
              </div>

              {/* Rows */}
              {data.map((item, rowIndex) => {
                const href = onRowClick ? onRowClick(item, rowIndex) : undefined;
                const isLastRow = rowIndex === data.length - 1;
                const cellContent = column.render(item, rowIndex);

                const baseClasses = `bg-white border-solid box-border h-16 min-h-[32px] py-2 relative shrink-0 w-full ${
                  !isLastRow ? 'border-b border-[#e3e7ea]' : ''
                }`;

                const alignmentClasses = column.align === 'right' 
                  ? 'flex gap-2 items-center justify-end pl-2 pr-3' 
                  : column.align === 'center' 
                  ? 'flex gap-1 items-center justify-center px-3' 
                  : column.wrap
                  ? 'flex gap-2 items-start pl-3 pr-2'
                  : 'flex gap-2 items-start pl-3 pr-2';

                const wrapClass = column.wrap ? 'flex-wrap' : '';

                const cellClasses = `${baseClasses} ${alignmentClasses} ${wrapClass}`;

                if (href) {
                  return (
                    <Link
                      key={rowIndex}
                      href={href}
                      className={`${cellClasses} hover:bg-[#f7f8f8] cursor-pointer`}
                    >
                      {cellContent}
                    </Link>
                  );
                }

                return (
                  <div
                    key={rowIndex}
                    className={cellClasses}
                  >
                    {cellContent}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex gap-2 items-center justify-center relative shrink-0 w-full">
          {pagination}
        </div>
      )}
    </div>
  );
}

