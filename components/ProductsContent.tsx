'use client';

import Link from 'next/link';

interface ProductItem {
  icon: string;
  title: string;
  activeMembers: number;
  groups: number;
  configureHref?: string;
}

const products: ProductItem[] = [
  { icon: 'pen-line', title: 'Clear Contracts', activeMembers: 142, groups: 2, configureHref: '/permissions/products/clear-contracts' },
  { icon: 'chart-pie', title: 'Analyze', activeMembers: 142, groups: 2, configureHref: '/permissions/products/analyze' },
];

export default function ProductsContent() {
  return (
    <div className="flex flex-col gap-[12px] items-start relative w-full">
      <div className="flex flex-wrap gap-[12px] items-start relative shrink-0 w-full">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white border border-[#e3e7ea] border-solid box-border flex flex-col gap-[12px] items-start p-4 relative rounded-[10px] shrink-0"
            style={{ minWidth: '280px', flex: '1 1 0' }}
          >
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              {/* Icon */}
              <div className="flex gap-2 items-center relative shrink-0">
                <div className="overflow-clip relative shrink-0 w-4 h-4">
                  {getIcon(product.icon)}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex flex-col gap-2 items-start relative shrink-0 w-full" style={{ paddingBottom: '24px' }}>
                <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px]">
                  {product.title}
                </p>
                <div className="flex flex-wrap gap-3 items-start relative shrink-0 w-full">
                  <div className="flex gap-1 items-center leading-4 relative shrink-0 text-xs tracking-[0.12px]">
                    <p className="font-normal relative shrink-0 text-[rgba(0,0,0,0.5)]">
                      Members:
                    </p>
                    <p className="font-medium relative shrink-0 text-[#121313]">
                      {product.activeMembers}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center leading-4 relative shrink-0 text-xs tracking-[0.12px]">
                    <p className="font-normal relative shrink-0 text-[rgba(0,0,0,0.5)]">
                      Groups:
                    </p>
                    <p className="font-medium relative shrink-0 text-[#121313]">
                      {product.groups}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 items-start relative shrink-0 w-full">
                <button className="flex-1 bg-white border border-[#e3e7ea] border-solid box-border flex gap-1 h-6 items-center justify-center px-2 py-1 rounded text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]">
                  <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Members</span>
                </button>
                {product.configureHref ? (
                  <Link
                    href={product.configureHref}
                    className="flex-1 bg-[#16696d] flex gap-1 h-6 items-center justify-center px-2 py-1 rounded text-xs font-medium text-white hover:bg-[#0d5256]"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configure</span>
                  </Link>
                ) : (
                  <button className="flex-1 bg-[#16696d] flex gap-1 h-6 items-center justify-center px-2 py-1 rounded text-xs font-medium text-white hover:bg-[#0d5256]">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configure</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getIcon(icon: string) {
  const iconClass = 'w-4 h-4 text-[#6e8081]';

  switch (icon) {
    case 'pen-line':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'chart-pie':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      );
    default:
      return null;
  }
}

