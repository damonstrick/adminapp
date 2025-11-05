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
  { icon: 'pen-line', title: 'Clear Contracts', activeMembers: 142, groups: 2 },
  { icon: 'chart-pie', title: 'Analyze', activeMembers: 142, groups: 2, configureHref: '/permissions/products/analyze' },
];

export default function ProductsContent() {
  return (
    <div className="flex flex-col gap-[12px] items-start relative w-full">
      <div className="border border-[#e3e7ea] border-solid box-border flex flex-col items-start justify-center relative rounded-lg shrink-0 w-full">
        {products.map((product, index) => (
          <div
            key={index}
            className="border-b border-[#e3e7ea] box-border flex items-start p-4 relative shrink-0 w-full"
          >
            <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <div className="overflow-clip relative shrink-0 w-4 h-4">
                    {getIcon(product.icon)}
                  </div>
                  <div className="basis-0 flex grow h-6 items-center min-h-px min-w-px relative shrink-0">
                    <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                      <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
                        {product.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-start relative shrink-0 w-full">
                <div className="flex gap-1 items-center leading-4 relative shrink-0 text-xs tracking-[0.12px] whitespace-pre">
                  <p className="font-normal relative shrink-0 text-[rgba(0,0,0,0.5)]">
                    Active Members:
                  </p>
                  <p className="font-medium relative shrink-0 text-[#121313]">
                    {product.activeMembers}
                  </p>
                </div>
                <div className="flex gap-1 h-4 items-center leading-4 relative shrink-0 text-xs tracking-[0.12px] whitespace-pre">
                  <p className="font-normal relative shrink-0 text-[rgba(0,0,0,0.5)]">
                    Groups:
                  </p>
                  <p className="font-medium relative shrink-0 text-[#121313]">
                    {product.groups}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-start justify-end relative shrink-0">
              <button className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]">
                Members
              </button>
              {product.configureHref ? (
                <Link
                  href={product.configureHref}
                  className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]"
                >
                  Configure
                </Link>
              ) : (
                <button className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]">
                  Configure
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-col h-12 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]">
          <div className="box-border flex flex-col gap-2 items-center justify-center p-3 relative shrink-0 w-full">
            <div className="flex gap-4 items-center relative shrink-0 w-full">
              <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                <div className="basis-0 flex flex-col gap-0.5 grow items-start min-h-px min-w-px relative shrink-0">
                  <p className="font-medium justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#121313] text-xs tracking-[0.12px] w-full">
                    Add Product
                  </p>
                </div>
              </div>
              <div className="flex h-4 items-center justify-center relative shrink-0 w-4">
                <div className="flex-none rotate-90">
                  <div className="overflow-clip relative w-4 h-4">
                    <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

