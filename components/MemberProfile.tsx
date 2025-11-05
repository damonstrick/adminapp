'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import IdBadge from './IdBadge';
import DataTable from './DataTable';
import ShinyText from './ShinyText';
import PhiAwarenessBanner from './PhiAwarenessBanner';
import { usePhiBanner } from './PhiBannerContext';

interface MemberProfileProps {
  memberId: string;
}

const ALL_PRODUCTS = ['Analyze', 'Clear Contracts'];

export default function MemberProfile({ memberId }: MemberProfileProps) {
  const { showPhiBanner } = usePhiBanner();
  
  // In a real app, you'd fetch member data based on memberId
  const member = {
    name: 'Sammy Virji',
    email: 'sammyvirji@email.com',
    role: 'Product Manager',
    department: 'Sales',
    id: '92883745',
    status: 'Active',
    organization: 'CommonSpirit Health',
    groups: [
      { name: 'Company Admins', description: 'Full administrative access to the Turquoise platform', members: 28, products: ['Clear Contracts', 'Analyze'], id: 'company-admins' },
      { name: 'Product Managers', description: 'Read-only access to the Emerald platform', members: 170, products: ['Clear Contracts', 'Analyze'], id: 'product-managers' },
      { name: 'UX Designers', description: 'Read-only access to the Emerald platform', members: 170, products: ['Clear Contracts'], id: 'ux-designers' },
      { name: 'Software Engineers', description: 'Read-only access to the Emerald platform', members: 15, products: ['Clear Contracts', 'Analyze'], id: 'software-engineers' },
      { name: 'Marketing Specialists', description: 'Data export functionality on the Diamond platform', members: 15, products: ['Clear Contracts', 'Analyze'], id: 'marketing-specialists' },
    ],
  };

  // Initial/clean state
  const [initialBasicInfo, setInitialBasicInfo] = useState({
    name: member.name,
    email: member.email,
    role: member.role,
    department: member.department,
  });
  const [initialProducts, setInitialProducts] = useState<string[]>([]);
  
  // Current state
  const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
  const [products, setProducts] = useState<string[]>([]);
  
  // Dirty state tracking
  const isBasicInfoDirty = JSON.stringify(basicInfo) !== JSON.stringify(initialBasicInfo);
  const isProductsDirty = JSON.stringify([...products].sort()) !== JSON.stringify([...initialProducts].sort());
  const dirtySectionsCount = [isBasicInfoDirty, isProductsDirty].filter(Boolean).length;
  
  const [addProductPopoverOpen, setAddProductPopoverOpen] = useState(false);
  const addProductRef = useRef<HTMLDivElement>(null);
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
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
  const searchParams = useSearchParams();
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

  return (
    <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
      <div className="border-b border-[#e3e7ea] border-solid box-border flex gap-1 items-start pb-6 pt-4 px-0 relative shrink-0 w-full">
        <div className="basis-0 flex flex-col gap-6 grow items-start min-h-px min-w-px relative shrink-0">
          {/* Breadcrumbs */}
          <div className="flex gap-1 items-center text-xs text-[#6e8081]">
            <Link href="/permissions/members" className="hover:underline">Members</Link>
            <span>/</span>
            <span className="text-[#121313]">{member.name}</span>
          </div>

          {/* Header with back button, title, and tags */}
          <div className="flex items-start justify-between relative shrink-0 w-full">
            <div className="basis-0 flex gap-1 grow items-start min-h-px min-w-px relative shrink-0">
              <Link href="/permissions/members" className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex flex-col gap-1 h-11 items-start not-italic relative shrink-0 w-[380px]">
                <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-[0.16px] w-[380px]">
                  {member.name}
                </p>
                <p className="font-normal leading-4 min-w-full relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px]">
                  {member.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-end relative shrink-0">
              <IdBadge id={member.id} />
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

      {/* Basic Information */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <div className="flex items-center gap-2 flex-1 h-6">
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Basic Information</p>
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
            <div className="flex gap-6 items-start relative shrink-0 w-full">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">Name</label>
                <div className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3">
                  <input 
                    type="text" 
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                    className="flex-1 outline-none border-none bg-transparent text-sm text-[#121313]" 
                  />
                  <svg className="w-4 h-4 text-[#4b595c] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">Email</label>
                <div className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3">
                  <input 
                    type="text" 
                    value={basicInfo.email}
                    onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                    className="flex-1 outline-none border-none bg-transparent text-sm text-[#121313]" 
                  />
                  <svg className="w-4 h-4 text-[#4b595c] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-6 items-start relative shrink-0 w-full">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">Role</label>
                <div className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3">
                  <input 
                    type="text" 
                    value={basicInfo.role}
                    onChange={(e) => setBasicInfo({ ...basicInfo, role: e.target.value })}
                    className="flex-1 outline-none border-none bg-transparent text-sm text-[#121313]" 
                  />
                  <svg className="w-4 h-4 text-[#4b595c] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">Department</label>
                <div className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3">
                  <input 
                    type="text" 
                    value={basicInfo.department}
                    onChange={(e) => setBasicInfo({ ...basicInfo, department: e.target.value })}
                    className="flex-1 outline-none border-none bg-transparent text-sm text-[#121313]" 
                  />
                  <svg className="w-4 h-4 text-[#4b595c] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Actions Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 py-4 relative shrink-0 w-full">
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
                      ? `/permissions/members/${memberId}/analyze`
                      : product === 'Clear Contracts'
                      ? `/permissions/members/${memberId}/clear-contracts`
                      : undefined;
                    
                    const productContent = (
                      <>
                        <div className="box-border flex flex-col gap-2 items-center justify-center p-3 relative shrink-0 w-full">
                          <div className="flex gap-4 items-center relative shrink-0 w-full">
                            <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                              <div className="overflow-clip relative shrink-0 w-4 h-4">
                                {product === 'Clear Contracts' ? (
                                  <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
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
                              <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
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

      {/* Groups Section */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-3 items-start px-0 py-6 relative shrink-0 w-full">
        <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
          <div className="flex h-5 items-center relative shrink-0 w-full">
            <div className="overflow-clip relative shrink-0 w-4 h-4" style={{ marginRight: '8px' }}>
              <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
              Groups
            </p>
            <div className="bg-white border border-[#e3e7ea] rounded p-0.5 flex items-center justify-center" style={{ marginLeft: '8px' }}>
              <p className="font-medium text-xs text-[#121313] leading-4 text-center tracking-[0.12px]">
                {member.groups.length > 99 ? '99+' : member.groups.length}
              </p>
            </div>
          </div>

          <DataTable
            columns={[
              {
                header: '',
                width: '40px',
                render: (group, index) => (
                  <div className="flex items-center justify-center px-2">
                    <p className="font-normal leading-4 text-xs text-[#6e8081] text-center tracking-[0.12px] whitespace-pre">
                      {index + 1}
                    </p>
                  </div>
                ),
              },
              {
                header: 'Group Name',
                headerIcon: (
                  <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                ),
                render: (group) => (
                  <p className="font-normal leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px] whitespace-pre">
                    {group.name}
                  </p>
                ),
              },
              {
                header: 'Description',
                render: (group) => (
                  <p className="basis-0 font-normal grow leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px]">
                    {group.description}
                  </p>
                ),
              },
              {
                header: 'Members',
                align: 'right',
                render: (group) => (
                  <p className="basis-0 font-normal grow h-full leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap text-right tracking-[0.12px]">
                    {group.members}
                  </p>
                ),
              },
              {
                header: 'Products',
                wrap: true,
                render: (group) => (
                  <>
                    {group.products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium"
                      >
                        {product}
                      </div>
                    ))}
                  </>
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
            data={member.groups}
            onRowClick={(group) => `/permissions/groups/${group.id}?from=member&memberId=${memberId}`}
            searchPlaceholder="Search groups..."
          />
        </div>
      </div>

      {/* Remove Member */}
      <div className="box-border flex flex-col gap-2 items-start pb-0 pt-6 px-0 relative shrink-0 w-full">
        <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex flex-col gap-3 items-start p-6 relative rounded-lg shrink-0 w-full">
          <div className="flex flex-col gap-5 items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-3 items-start relative shrink-0">
              <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
                Remove Member
              </p>
              <div className="flex flex-col gap-2 items-start relative shrink-0">
                <p className="font-normal leading-4 relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px] w-full">
                  Once removed, there is no going back. This will permanently remove this member from this org.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
              Remove Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

