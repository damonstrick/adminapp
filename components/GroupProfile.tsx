'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import IdBadge from './IdBadge';
import ShinyText from './ShinyText';
import PRODUCT_LOGOS from './productLogos';
import PhiAwarenessBanner from './PhiAwarenessBanner';
import { usePhiBanner } from './PhiBannerContext';
import DataTable from './DataTable';

interface GroupProfileProps {
  groupId: string;
}

const groups: { [key: string]: { name: string; description: string; members: number; products: string[]; id: string; org: string } } = {
  'company-admins': { name: 'Company Admins', description: 'Full administrative access to the Turquoise platform', members: 84, products: ['Clear Contracts', 'Analyze'], id: '92883745', org: 'CommonSpirit Health' },
  'product-managers': { name: 'Product Managers', description: 'Read-only access to the Emerald platform', members: 170, products: ['Clear Contracts', 'Analyze'], id: '92883745', org: 'CommonSpirit Health' },
};

const ALL_PRODUCTS = ['Analyze', 'Clear Contracts'];

interface GroupMember {
  name: string;
  email: string;
  department: string;
  groups: number;
  status: string;
  id: string;
}

const GROUP_MEMBERS: GroupMember[] = [
  { name: 'Sarah Johnson', email: 'sarah.johnson@commonspirit.org', department: 'Sales', groups: 3, status: 'Active', id: 'sj-001' },
  { name: 'Michael Chen', email: 'michael.chen@commonspirit.org', department: 'Marketing', groups: 5, status: 'Active', id: 'mc-002' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@commonspirit.org', department: 'Operations', groups: 2, status: 'Active', id: 'er-003' },
  { name: 'David Kim', email: 'david.kim@commonspirit.org', department: 'IT', groups: 4, status: 'Active', id: 'dk-004' },
  { name: 'Jessica Martinez', email: 'jessica.martinez@commonspirit.org', department: 'HR', groups: 1, status: 'Active', id: 'jm-005' },
  { name: 'Robert Taylor', email: 'robert.taylor@commonspirit.org', department: 'Finance', groups: 6, status: 'Active', id: 'rt-006' },
  { name: 'Amanda White', email: 'amanda.white@commonspirit.org', department: 'Sales', groups: 3, status: 'Active', id: 'aw-007' },
  { name: 'James Wilson', email: 'james.wilson@commonspirit.org', department: 'Marketing', groups: 4, status: 'Active', id: 'jw-008' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@commonspirit.org', department: 'Operations', groups: 2, status: 'Active', id: 'la-009' },
  { name: 'Christopher Brown', email: 'chris.brown@commonspirit.org', department: 'IT', groups: 5, status: 'Active', id: 'cb-010' },
  { name: 'Michelle Davis', email: 'michelle.davis@commonspirit.org', department: 'HR', groups: 2, status: 'Active', id: 'md-011' },
  { name: 'Daniel Garcia', email: 'daniel.garcia@commonspirit.org', department: 'Finance', groups: 4, status: 'Active', id: 'dg-012' },
  { name: 'Jennifer Lee', email: 'jennifer.lee@commonspirit.org', department: 'Sales', groups: 3, status: 'Active', id: 'jl-013' },
  { name: 'Matthew Harris', email: 'matthew.harris@commonspirit.org', department: 'Marketing', groups: 5, status: 'Active', id: 'mh-014' },
  { name: 'Nicole Thompson', email: 'nicole.thompson@commonspirit.org', department: 'Operations', groups: 2, status: 'Active', id: 'nt-015' },
  { name: 'Andrew Moore', email: 'andrew.moore@commonspirit.org', department: 'IT', groups: 4, status: 'Active', id: 'am-016' },
  { name: 'Stephanie Clark', email: 'stephanie.clark@commonspirit.org', department: 'HR', groups: 1, status: 'Active', id: 'sc-017' },
  { name: 'Kevin Lewis', email: 'kevin.lewis@commonspirit.org', department: 'Finance', groups: 6, status: 'Active', id: 'kl-018' },
  { name: 'Rachel Walker', email: 'rachel.walker@commonspirit.org', department: 'Sales', groups: 3, status: 'Active', id: 'rw-019' },
  { name: 'Brian Hall', email: 'brian.hall@commonspirit.org', department: 'Marketing', groups: 4, status: 'Active', id: 'bh-020' },
];

export default function GroupProfile({ groupId }: GroupProfileProps) {
  const { showPhiBanner } = usePhiBanner();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const memberId = searchParams.get('memberId');
  
  const group = groups[groupId] || groups['company-admins'];
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Initial/clean state
  const [initialBasicInfo, setInitialBasicInfo] = useState({
    name: group.name,
    description: group.description,
  });
  const [initialProducts, setInitialProducts] = useState<string[]>([]);
  
  // Current state
  const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
  const [products, setProducts] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberPage, setMemberPage] = useState(1);
  
  // Dirty state tracking
  const isBasicInfoDirty = JSON.stringify(basicInfo) !== JSON.stringify(initialBasicInfo);
  const isProductsDirty = JSON.stringify([...products].sort()) !== JSON.stringify([...initialProducts].sort());
  const dirtySectionsCount = [isBasicInfoDirty, isProductsDirty].filter(Boolean).length;
  
  const [addProductPopoverOpen, setAddProductPopoverOpen] = useState(false);
  const addProductRef = useRef<HTMLDivElement>(null);
  
  const handleSaveBasicInfo = () => {
    setInitialBasicInfo(basicInfo);
    console.log('Saving basic info:', basicInfo);
    setSavedSection('basicInfo');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('basicInfo');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveProducts = () => {
    setInitialProducts(products);
    console.log('Saving products:', products);
    setSavedSection('products');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('products');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveAll = () => {
    // Track which sections were dirty before saving
    const sectionsToSave: string[] = [];
    if (isBasicInfoDirty) sectionsToSave.push('basicInfo');
    if (isProductsDirty) sectionsToSave.push('products');
    
    handleSaveBasicInfo();
    handleSaveProducts();
    
    setSavedSection('all');
    setSavedSectionsFromAll(sectionsToSave);
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('all');
      setTimeout(() => {
        setSavedSection(null);
        setSavedSectionsFromAll([]);
      }, 300);
    }, 1700);
  };

  // Check for revoked product query parameter
  useEffect(() => {
    const revoked = searchParams.get('revoked');
    if (revoked) {
      setProducts(prevProducts => {
        if (prevProducts.includes(revoked)) {
          // Clean up URL by removing the query parameter
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          return prevProducts.filter(p => p !== revoked);
        }
        return prevProducts;
      });
    }
  }, [searchParams]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addProductRef.current && !addProductRef.current.contains(event.target as Node)) {
        setAddProductPopoverOpen(false);
      }
    };

    if (addProductPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [addProductPopoverOpen]);

  const availableProducts = ALL_PRODUCTS.filter(p => !products.includes(p));
  
  const addProduct = (product: string) => {
    console.log('Adding product:', product);
    if (!products.includes(product)) {
      const newProducts = [...products, product];
      setProducts(newProducts);
      // Auto-save: update initial state immediately
      setInitialProducts(newProducts);
    }
    setAddProductPopoverOpen(false);
  };

  const handleAddProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add Product button clicked');
    setAddProductPopoverOpen(!addProductPopoverOpen);
  };

  // Determine back URL based on context
  const backUrl = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : '/permissions/groups';
  
  const breadcrumbLabel = from === 'member' && memberId ? 'Members' : 'Groups';
  const breadcrumbHref = from === 'member' && memberId 
    ? `/permissions/members/${memberId}`
    : '/permissions/groups';

  const MEMBERS_PER_PAGE = 10;
  const filteredGroupMembers = GROUP_MEMBERS.filter((member) => {
    if (!memberSearch.trim()) return true;
    const searchLower = memberSearch.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.department.toLowerCase().includes(searchLower)
    );
  });
  const totalMemberPages = Math.max(1, Math.ceil(filteredGroupMembers.length / MEMBERS_PER_PAGE) || 1);
  const currentMemberPage = Math.min(memberPage, totalMemberPages);
  const memberStartIndex = (currentMemberPage - 1) * MEMBERS_PER_PAGE;
  const currentGroupMembers = filteredGroupMembers.slice(memberStartIndex, memberStartIndex + MEMBERS_PER_PAGE);

  useEffect(() => {
    if (memberPage > totalMemberPages) {
      setMemberPage(totalMemberPages);
    }
  }, [memberPage, totalMemberPages]);

  const memberPagination = (
    <>
      <button
        onClick={() => setMemberPage((prev) => Math.max(1, prev - 1))}
        disabled={currentMemberPage === 1}
        className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setMemberPage(page)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentMemberPage === page ? 'bg-[#16696d] text-white' : 'border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setMemberPage((prev) => Math.min(totalMemberPages, prev + 1))}
        disabled={currentMemberPage === totalMemberPages}
        className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </>
  );

  return (
    <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
      <div className="border-b border-[#e3e7ea] border-solid box-border flex gap-1 items-start pb-6 pt-4 px-0 relative shrink-0 w-full">
        <div className="basis-0 flex flex-col gap-6 grow items-start min-h-px min-w-px relative shrink-0">
          {/* Breadcrumbs */}
          <div className="flex gap-1 items-center text-xs text-[#6e8081] relative shrink-0">
            <Link href={breadcrumbHref} className="hover:underline">
              {breadcrumbLabel}
            </Link>
            <span>/</span>
            <span className="text-[#121313]">{group.name}</span>
          </div>

          {/* Header with back button, title, and tags */}
          <div className="flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 flex gap-1 grow items-start min-h-px min-w-px relative shrink-0">
              <Link href={backUrl} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex flex-col gap-1 h-11 items-start not-italic relative shrink-0 w-[380px]">
                <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-[0.16px] w-[380px]">
                  {group.name}
                </p>
                <p className="font-normal leading-4 min-w-full relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px]">
                  {group.members} Members
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-end relative shrink-0">
              <IdBadge id={group.id} />
            </div>
          </div>
        </div>
      </div>

      {/* PHI Awareness Banner */}
      {showPhiBanner && (
        <div className="px-0 pb-4 pt-0 w-full">
          <PhiAwarenessBanner />
        </div>
      )}

      {/* Basic Info Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <div className="flex items-center gap-2 flex-1 h-6">
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Basic Info</p>
            {isBasicInfoDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </div>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isBasicInfoDirty && savedSection !== 'basicInfo' && savedSection !== 'all' && (
              <button
                onClick={handleSaveBasicInfo}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'basicInfo' || (savedSection === 'all' && savedSectionsFromAll.includes('basicInfo'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'basicInfo' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
            <div className="flex gap-2 h-14 items-start relative shrink-0 w-full">
              <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
                <label className="font-normal leading-4 relative shrink-0 text-[#7d898d] text-xs tracking-[0.12px] whitespace-pre">
                  Group Name
                </label>
                <input
                  type="text"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="bg-white border border-[#e3e7ea] rounded px-3 py-2 h-8 w-full text-xs text-[#121313] outline-none focus:border-[#16696d]"
                />
              </div>
              <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
                <label className="font-normal leading-4 relative shrink-0 text-[#7d898d] text-xs tracking-[0.12px] whitespace-pre">
                  Organization
                </label>
                <div className="bg-[#ececec] border border-[#e3e7ea] border-solid box-border flex gap-2 h-8 items-center px-3 py-2 relative rounded w-full">
                  <p className="basis-0 font-normal grow leading-4 min-h-px min-w-px relative shrink-0 text-[#7d898d] text-xs tracking-[0.12px]">
                    {group.org}
                  </p>
                  <svg className="w-4 h-4 text-[#7d898d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
              <label className="font-normal leading-4 relative shrink-0 text-[#7d898d] text-xs tracking-[0.12px] whitespace-pre">
                Description
              </label>
              <input
                type="text"
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded px-3 py-2 h-8 w-full text-xs text-[#121313] outline-none focus:border-[#16696d]"
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Members and Products Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <div className="flex items-center gap-2 flex-1 h-6">
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Products</p>
            {isProductsDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </div>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isProductsDirty && savedSection !== 'products' && savedSection !== 'all' && (
              <button
                onClick={handleSaveProducts}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'products' || (savedSection === 'all' && savedSectionsFromAll.includes('products'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'products' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
          {/* Products Section */}
          <div className="bg-white border border-[#e3e7ea] border-solid relative rounded-lg shrink-0 w-full">
            <div className="flex flex-col items-start relative rounded-[inherit] w-full">
              {products.length === 0 ? (
                // Empty state: show "Add Product" button
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={handleAddProductClick}
                    className="flex flex-col h-12 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]"
                  >
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
                            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Add Product Popover */}
                  {addProductPopoverOpen && (
                    <div 
                      ref={addProductRef}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                    >
                      <div className="flex flex-col gap-[2px] items-start relative shrink-0">
                        {availableProducts.map((product) => (
                          <button
                            key={product}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addProduct(product);
                            }}
                            className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                          >
                            <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                              {product}
                            </p>
                          </button>
                        ))}
                        {availableProducts.length === 0 && (
                          <div className="w-full p-2 text-center">
                            <p className="font-normal text-xs text-[#6e8081]">All products added</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {products.map((product, index) => {
                const productHref = product === 'Analyze' 
                  ? `/permissions/groups/${groupId}/analyze${from === 'member' && memberId ? `?from=member&memberId=${memberId}` : `?from=group`}`
                  : product === 'Clear Contracts'
                  ? `/permissions/groups/${groupId}/clear-contracts${from === 'member' && memberId ? `?from=member&memberId=${memberId}` : `?from=group`}`
                  : undefined;
                
                const productContent = (
                  <>
                    <div className="box-border flex flex-col gap-2 items-center justify-center p-3 relative shrink-0 w-full">
                      <div className="flex gap-4 items-center relative shrink-0 w-full">
                        <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                          <div className="overflow-clip relative shrink-0 w-6 h-6 flex items-center justify-center">
                            {PRODUCT_LOGOS[product as keyof typeof PRODUCT_LOGOS] ? (
                              <div
                                className="w-6 h-6 flex items-center justify-center rounded-br-[10px] rounded-tl-[10px] border"
                                style={{
                                  backgroundColor: PRODUCT_LOGOS[product as keyof typeof PRODUCT_LOGOS].background,
                                  borderColor: PRODUCT_LOGOS[product as keyof typeof PRODUCT_LOGOS].border,
                                }}
                              >
                                <img
                                  src={PRODUCT_LOGOS[product as keyof typeof PRODUCT_LOGOS].image}
                                  alt={`${product} logo`}
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                            ) : (
                              <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                              </svg>
                            )}
                          </div>
                          <div className="basis-0 flex flex-col gap-0.5 grow items-start min-h-px min-w-px relative shrink-0">
                            <p className="font-medium justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#121313] text-xs tracking-[0.12px] w-full">
                              {product}
                            </p>
                          </div>
                        </div>
                        <div className="flex h-4 items-center justify-center relative shrink-0 w-4">
                          <div className="flex-none rotate-90">
                            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );

                if (productHref) {
                  return (
                    <Link
                      key={index}
                      href={productHref}
                      className={`border-solid box-border flex flex-col h-12 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8] ${
                        index < products.length - 1 ? 'border-b border-[#e3e7ea]' : ''
                      }`}
                    >
                      {productContent}
                    </Link>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`border-solid box-border flex flex-col h-12 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8] ${
                      index < products.length - 1 ? 'border-b border-[#e3e7ea]' : ''
                    }`}
                  >
                    {productContent}
                  </div>
                );
              })}
              {/* Add Product Button - only show if not all products are added */}
              {availableProducts.length > 0 && (
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={handleAddProductClick}
                    className={`border-solid box-border flex flex-col h-12 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8] ${
                      products.length > 0 ? 'border-t border-[#e3e7ea]' : ''
                    }`}
                  >
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
                            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Add Product Popover */}
                  {addProductPopoverOpen && (
                    <div 
                      ref={addProductRef}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                    >
                      <div className="flex flex-col gap-[2px] items-start relative shrink-0">
                        {availableProducts.map((product) => (
                          <button
                            key={product}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addProduct(product);
                            }}
                            className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                          >
                            <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                              {product}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
                </>
              )}
            </div>
          </div>

        </div>
        
        {/* Save All Button */}
        {dirtySectionsCount > 1 && (
          <div className="flex justify-end w-full mt-6 mb-4">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
            >
              Save All ({dirtySectionsCount} sections)
            </button>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <div className="flex items-center gap-2 flex-1 h-6">
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Members</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
          <DataTable
            searchValue={memberSearch}
            onSearchChange={(value) => {
              setMemberSearch(value);
              setMemberPage(1);
            }}
            searchPlaceholder="Search members..."
            searchTableGap="12px"
            data={currentGroupMembers}
            pagination={memberPagination}
            onRowClick={(member) => `/permissions/members/${member.id}`}
            columns={[
              {
                header: '',
                width: '40px',
                render: (_, index) => (
                  <div className="flex items-center justify-center px-2">
                    <p className="font-normal leading-4 text-xs text-[#6e8081] text-center tracking-[0.12px] whitespace-pre">
                      {memberStartIndex + index + 1}
                    </p>
                  </div>
                ),
              },
              {
                header: 'Member',
                headerIcon: (
                  <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                ),
                render: (member) => (
                  <div className="flex flex-col gap-2 items-start">
                    <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313]">{member.name}</p>
                    <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#6e8081]">{member.email}</p>
                  </div>
                ),
              },
              {
                header: 'Department',
                render: (member) => (
                  <p className="basis-0 font-normal grow leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px]">
                    {member.department}
                  </p>
                ),
              },
              {
                header: 'Groups',
                align: 'right',
                render: (member) => (
                  <p className="basis-0 font-normal grow h-full leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap text-right tracking-[0.12px]">
                    {member.groups}
                  </p>
                ),
              },
              {
                header: 'Status',
                render: (member) => (
                  <div className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium">
                    {member.status}
                  </div>
                ),
              },
              {
                header: ' ',
                align: 'center',
                width: 'auto',
                render: () => (
                  <button className="box-border flex gap-2 items-center p-0.5 relative rounded-sm shrink-0 hover:bg-[#f0f2f2]">
                    <div className="overflow-clip relative shrink-0 w-3 h-3">
                      <svg className="w-3 h-3 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>
                  </button>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Save All Button */}
      {dirtySectionsCount > 1 && (
        <div className="flex justify-end w-full mt-6 mb-4">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
          >
            Save All ({dirtySectionsCount} sections)
          </button>
        </div>
      )}

      {/* Group Actions Section */}
      <div className="box-border flex flex-col gap-4 items-start pb-[24px] pt-6 px-0 relative shrink-0 w-full">
        <div className="bg-white border border-[#e3e7ea] border-solid relative rounded-lg shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]">
          <div className="flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
            <div className="box-border flex flex-col gap-2 items-center justify-center p-3 relative shrink-0 w-full">
              <div className="flex gap-4 items-center relative shrink-0 w-full">
                <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                  <div className="overflow-clip relative shrink-0 w-4 h-4">
                    <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="basis-0 flex flex-col gap-0.5 grow items-start min-h-px min-w-px relative shrink-0">
                    <p className="font-medium justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#121313] text-xs tracking-[0.12px] w-full">
                      Group Preferences
                    </p>
                    <p className="font-normal justify-center leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px] w-full">
                      Non-product specific preferences for this group
                    </p>
                  </div>
                </div>
                <div className="flex h-4 items-center justify-center relative shrink-0 w-4">
                  <div className="flex-none rotate-90">
                    <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex flex-col gap-5 items-start p-6 relative rounded-lg shrink-0 w-full">
          <div className="flex flex-col gap-5 items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-3 items-start relative shrink-0">
              <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
                Deactivate Group
              </p>
              <div className="flex flex-col gap-2 items-start relative shrink-0">
                <p className="font-normal leading-4 relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px] w-full">
                  Once deactivated, all member assigned to this group will lose permissions that have been granted by this groups permissions.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
              Deactivate Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

