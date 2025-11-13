'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShinyText from './ShinyText';
import PhiAwarenessBanner from './PhiAwarenessBanner';
import { usePhiBanner } from './PhiBannerContext';

interface EntityProfileProps {
  entityId: string;
}

const entities: { [key: string]: { name: string; type: string; access: string[]; members: number; id: string } } = {
  '1': { name: 'St. Mary\'s Medical Center', type: 'Hospital', access: ['Clear Contracts', 'Analyze'], members: 342, id: '1' },
  '2': { name: 'Regional Health Network', type: 'Healthcare System', access: ['Clear Contracts'], members: 128, id: '2' },
  '3': { name: 'Community Care Clinic', type: 'Clinic', access: ['Analyze'], members: 45, id: '3' },
  '4': { name: 'Metro General Hospital', type: 'Hospital', access: ['Clear Contracts', 'Analyze'], members: 289, id: '4' },
  '5': { name: 'Riverside Medical Group', type: 'Medical Group', access: ['Clear Contracts'], members: 156, id: '5' },
  'organization-1': { name: 'CommonSpirit Health', type: 'Organization', access: ['Clear Contracts', 'Analyze'], members: 156, id: 'organization-1' },
};

const ALL_PRODUCTS = ['Analyze', 'Clear Contracts'];

export default function EntityProfile({ entityId }: EntityProfileProps) {
  const { showPhiBanner } = usePhiBanner();
  const entity = entities[entityId] || entities['1'];
  
  const [basicInfoOpen, setBasicInfoOpen] = useState(true);
  const [pointOfContactOpen, setPointOfContactOpen] = useState(true);
  const [assignProductsOpen, setAssignProductsOpen] = useState(true);
  const [addMembersOpen, setAddMembersOpen] = useState(true);
  
  // Track which sections just saved
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [savedSectionsFromAll, setSavedSectionsFromAll] = useState<string[]>([]);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  
  // Initial/clean state
  const [initialBasicInfo, setInitialBasicInfo] = useState({
    name: entity.name,
    type: entity.type,
    email: '',
    tin: '',
    npi: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
  });
  
  const [initialPointOfContact, setInitialPointOfContact] = useState({
    contactName: '',
    phone: '',
    email: '',
  });
  
  const [initialProducts, setInitialProducts] = useState<string[]>(entity.access);
  const [initialMembers, setInitialMembers] = useState<string[]>(['Gold Plan', 'Alice Johnson', 'Brian Smith', 'Catherine Lee', 'David Brown', 'Emma Wilson', 'Frank Garcia']);
  
  // Current state
  const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
  const [pointOfContact, setPointOfContact] = useState(initialPointOfContact);
  const [products, setProducts] = useState<string[]>(initialProducts);
  const [members, setMembers] = useState<string[]>(initialMembers);
  
  // Dirty state tracking
  const isBasicInfoDirty = JSON.stringify(basicInfo) !== JSON.stringify(initialBasicInfo);
  const isPointOfContactDirty = JSON.stringify(pointOfContact) !== JSON.stringify(initialPointOfContact);
  const isProductsDirty = JSON.stringify([...products].sort()) !== JSON.stringify([...initialProducts].sort());
  const isMembersDirty = JSON.stringify([...members].sort()) !== JSON.stringify([...initialMembers].sort());
  
  const dirtySectionsCount = entity.type === 'Organization' 
    ? [isBasicInfoDirty, isPointOfContactDirty].filter(Boolean).length
    : [isBasicInfoDirty, isPointOfContactDirty, isProductsDirty, isMembersDirty].filter(Boolean).length;
  
  const toggleProduct = (product: string) => {
    if (products.includes(product)) {
      setProducts(products.filter(p => p !== product));
    } else {
      setProducts([...products, product]);
    }
  };
  
  const handleSaveBasicInfo = () => {
    setInitialBasicInfo(basicInfo);
    // Here you would typically make an API call to save
    console.log('Saving basic info:', basicInfo);
    setSavedSection('basicInfo');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('basicInfo');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSavePointOfContact = () => {
    setInitialPointOfContact(pointOfContact);
    // Here you would typically make an API call to save
    console.log('Saving point of contact:', pointOfContact);
    setSavedSection('pointOfContact');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('pointOfContact');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveProducts = () => {
    setInitialProducts(products);
    // Here you would typically make an API call to save
    console.log('Saving products:', products);
    setSavedSection('products');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('products');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveMembers = () => {
    setInitialMembers(members);
    // Here you would typically make an API call to save
    console.log('Saving members:', members);
    setSavedSection('members');
    setFadingOut(null);
    setTimeout(() => {
      setFadingOut('members');
      setTimeout(() => setSavedSection(null), 300);
    }, 1700);
  };
  
  const handleSaveAll = () => {
    // Track which sections were dirty before saving
    const sectionsToSave: string[] = [];
    if (isBasicInfoDirty) sectionsToSave.push('basicInfo');
    if (isPointOfContactDirty) sectionsToSave.push('pointOfContact');
    if (isProductsDirty) sectionsToSave.push('products');
    if (isMembersDirty) sectionsToSave.push('members');
    
    handleSaveBasicInfo();
    handleSavePointOfContact();
    handleSaveProducts();
    handleSaveMembers();
    
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
  
  const removeMember = (member: string) => {
    setMembers(members.filter(m => m !== member));
  };

  return (
    <div className="bg-white flex flex-col items-start relative rounded-lg w-full">
      {/* Header */}
      <div className="border-b border-[#e3e7ea] border-solid box-border flex gap-1 items-start pb-6 pt-4 px-0 relative shrink-0 w-full">
        <div className="basis-0 flex flex-col gap-6 grow items-start min-h-px min-w-px relative shrink-0">
          {/* Breadcrumbs */}
          <div className="flex gap-1 items-center text-xs text-[#6e8081] relative shrink-0">
            {entity.type === 'Organization' ? (
              <>
                <Link href="/permissions" className="hover:underline">
                  Overview
                </Link>
                <span>/</span>
                <span className="text-[#121313]">{entity.name}</span>
              </>
            ) : (
              <>
                <Link href="/permissions/entities" className="hover:underline">
                  Entities
                </Link>
                <span>/</span>
                <span className="text-[#121313]">{entity.name}</span>
              </>
            )}
          </div>

          {/* Header with back button and title */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="basis-0 flex gap-1 grow items-center min-h-px min-w-px relative shrink-0">
              <Link href={entity.type === 'Organization' ? "/permissions" : "/permissions/entities"} className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f2f2] shrink-0">
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex flex-col gap-1 items-start not-italic relative shrink-0">
                <p className="font-semibold leading-6 relative shrink-0 text-[#121313] text-base tracking-[0.16px]">
                  {entity.name}
                </p>
              </div>
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

      {/* Logo Section */}
      <div className="bg-white border-b border-[#e3e7ea] border-solid box-border flex flex-col gap-2 items-start px-0 pt-6 pb-6 relative shrink-0 w-full">
        <div className="bg-white box-border flex flex-col gap-6 items-start px-0 pt-3 pb-6 relative shrink-0 w-full">
          <div className="flex gap-6 items-end relative shrink-0 w-full mb-5">
            <div className="flex flex-col gap-2 items-start relative shrink-0">
              <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
                Logo
              </p>
              <div className="bg-[#d1d5dc] rounded-full shrink-0" style={{ width: '40px', height: '40px' }} />
            </div>
            <button className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]">
              Choose an Image
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setBasicInfoOpen(!basicInfoOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Basic Information</p>
            {isBasicInfoDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isBasicInfoDirty && savedSection !== 'basicInfo' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveBasicInfo();
                }}
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
          <button
            onClick={() => setBasicInfoOpen(!basicInfoOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${basicInfoOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {basicInfoOpen && (
          <div className="bg-white box-border flex flex-col gap-6 items-start px-0 relative shrink-0 w-full">
            {/* Form Fields */}
          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Organization Name</label>
              <input 
                type="text" 
                value={basicInfo.name}
                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
          </div>

          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Organization Type</label>
              <input 
                type="text" 
                value={basicInfo.type}
                onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Email</label>
              <input 
                type="email" 
                placeholder="Email"
                value={basicInfo.email}
                onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
          </div>

          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Tax ID Number (TIN)</label>
              <input 
                type="text" 
                placeholder="Tax ID Number (TIN)"
                value={basicInfo.tin}
                onChange={(e) => setBasicInfo({ ...basicInfo, tin: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">National Provider ID (NPI)</label>
              <input 
                type="text" 
                placeholder="National Provider ID (NPI)"
                value={basicInfo.npi}
                onChange={(e) => setBasicInfo({ ...basicInfo, npi: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
          </div>

          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Address</label>
              <input 
                type="text" 
                placeholder="Address"
                value={basicInfo.address}
                onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
          </div>

          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">City</label>
              <input 
                type="text" 
                placeholder="City"
                value={basicInfo.city}
                onChange={(e) => setBasicInfo({ ...basicInfo, city: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
            <div className="flex gap-6 items-start flex-1">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">State</label>
                <input 
                  type="text" 
                  placeholder="State"
                  value={basicInfo.state}
                  onChange={(e) => setBasicInfo({ ...basicInfo, state: e.target.value })}
                  className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-[#6e8081]">Zip</label>
                <input 
                  type="text" 
                  placeholder="Zip"
                  value={basicInfo.zip}
                  onChange={(e) => setBasicInfo({ ...basicInfo, zip: e.target.value })}
                  className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-start relative shrink-0 w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Phone Number"
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-[#6e8081]">Website</label>
              <input 
                type="url" 
                placeholder="Website"
                value={basicInfo.website}
                onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
                className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
              />
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Point Of Contact Section */}
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setPointOfContactOpen(!pointOfContactOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Point Of Contact</p>
            {isPointOfContactDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isPointOfContactDirty && savedSection !== 'pointOfContact' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePointOfContact();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'pointOfContact' || (savedSection === 'all' && savedSectionsFromAll.includes('pointOfContact'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'pointOfContact' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setPointOfContactOpen(!pointOfContactOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${pointOfContactOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {pointOfContactOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex gap-3 items-start relative shrink-0 w-full" style={{ height: '56px' }}>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs text-[#6e8081]">Support Contact Name</label>
                  <input 
                    type="text" 
                    placeholder="Support Contact Name"
                    value={pointOfContact.contactName}
                    onChange={(e) => setPointOfContact({ ...pointOfContact, contactName: e.target.value })}
                    className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs text-[#6e8081]">Support Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Support Phone"
                    value={pointOfContact.phone}
                    onChange={(e) => setPointOfContact({ ...pointOfContact, phone: e.target.value })}
                    className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313]"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 w-full">
                <label className="text-xs text-[#6e8081]">Support Contact Email</label>
                <input 
                  type="email" 
                  placeholder="Support Contact Email"
                  value={pointOfContact.email}
                  onChange={(e) => setPointOfContact({ ...pointOfContact, email: e.target.value })}
                  className="bg-white border border-[#e3e7ea] rounded-md h-8 flex items-center px-3 outline-none text-sm text-[#121313] w-full"
                />
              </div>
              
            </div>
          )}
      </div>

      {/* Assign Products Section */}
      {entity.type !== 'Organization' && (
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setAssignProductsOpen(!assignProductsOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Assign Products</p>
            {isProductsDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isProductsDirty && savedSection !== 'products' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveProducts();
                }}
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
          <button
            onClick={() => setAssignProductsOpen(!assignProductsOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${assignProductsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {assignProductsOpen && (
          <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
              {/* Clear Contracts */}
              <div className={`border ${products.includes('Clear Contracts') ? 'bg-[#f7f8f8] border-[#e3e7ea]' : 'border-[#e3e7ea]'} border-solid box-border flex flex-col gap-3 items-start p-4 relative rounded-lg shrink-0 w-full`}>
                <div className="flex items-start justify-between relative shrink-0 w-full">
                  <div className="flex-1 grow min-h-px min-w-px relative shrink-0">
                    <div className="flex flex-col gap-1 items-start leading-4 not-italic relative text-xs tracking-[0.12px] w-full">
                      <p className="font-medium min-w-full relative shrink-0 text-[#121313]">
                        Clear Contracts
                      </p>
                      <p className="font-normal relative shrink-0 text-[#6e8081] w-full">
                        Claims pricing analysis and optimization
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={products.includes('Clear Contracts')}
                      onChange={() => toggleProduct('Clear Contracts')}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]`}></div>
                  </label>
                </div>
              </div>

              {/* Analyze */}
              <div className={`border ${products.includes('Analyze') ? 'bg-[#f7f8f8] border-[#e3e7ea]' : 'border-[#e3e7ea]'} border-solid box-border flex flex-col gap-3 items-start p-4 relative rounded-lg shrink-0 w-full`}>
                <div className="flex items-start justify-between relative shrink-0 w-full">
                  <div className="flex-1 grow min-h-px min-w-px relative shrink-0">
                    <div className="flex flex-col gap-1 items-start leading-4 not-italic relative text-xs tracking-[0.12px] w-full">
                      <p className="font-medium min-w-full relative shrink-0 text-[#121313]">
                        Analyze
                      </p>
                      <p className="font-normal relative shrink-0 text-[#6e8081] w-full">
                        Enhanced compliance monitoring and reporting
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={products.includes('Analyze')}
                      onChange={() => toggleProduct('Analyze')}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]`}></div>
                  </label>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Add Members Section */}
      {entity.type !== 'Organization' && (
      <div className="border-b border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col gap-2 items-start px-0 pt-4 pb-[24px] relative shrink-0 w-full">
        <div className="w-full flex items-center gap-2 mb-4 h-6">
          <button
            onClick={() => setAddMembersOpen(!addMembersOpen)}
            className="flex items-center gap-2 flex-1 h-6"
          >
            <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="font-semibold text-sm text-[#121313]">Add Members</p>
            {isMembersDirty && (
              <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1"></div>
            )}
          </button>
          <div className="w-[60px] h-6 flex items-center justify-center">
            {isMembersDirty && savedSection !== 'members' && savedSection !== 'all' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveMembers();
                }}
                className="px-4 py-1 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256] h-6"
              >
                Save
              </button>
            )}
            {(savedSection === 'members' || (savedSection === 'all' && savedSectionsFromAll.includes('members'))) && (
              <div className={`text-xs font-medium transition-opacity duration-300 ${(fadingOut === 'members' || fadingOut === 'all') ? 'opacity-0' : 'opacity-100'}`}>
                <ShinyText text="Saved" speed={3} />
              </div>
            )}
          </div>
          <button
            onClick={() => setAddMembersOpen(!addMembersOpen)}
            className="flex items-center h-6"
          >
            <svg
              className={`w-5 h-5 text-[#121313] transition-transform ${addMembersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {addMembersOpen && (
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex gap-2 items-center h-8 px-3 py-2 relative rounded-lg shrink-0 w-full">
                  <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for a member"
                    className="bg-transparent flex-1 font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-wide outline-none border-none"
                  />
                  <div className="flex gap-1 items-center relative shrink-0">
                    <div className="bg-white border border-[#e3e7ea] rounded px-1.5 py-0.5">
                      <span className="font-medium text-[11px] leading-4 text-[#4b595c]">/</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-start relative shrink-0 w-full">
                  {members.map((member) => (
                    <div key={member} className="bg-[#f0f2f2] px-2 py-1 rounded text-[#121313] text-xs font-medium flex items-center gap-1">
                      {member}
                      <svg 
                        className="w-3 h-3 text-[#4b595c] cursor-pointer" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={() => removeMember(member)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        )}
      </div>
      )}

      {/* Save All Button - appears when multiple sections have changes */}
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

      {/* Archive Entity Section */}
      <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid box-border flex flex-col gap-5 items-start p-6 relative rounded-lg shrink-0 w-full mt-6">
        <div className="flex flex-col gap-3 items-start relative shrink-0">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] whitespace-pre">
            Archive Entity
          </p>
          <div className="flex flex-col gap-2 items-start relative shrink-0">
            <p className="font-normal leading-4 relative shrink-0 text-[#6e8081] text-xs tracking-[0.12px] w-full">
              Once removed, there is no going back. This will permanently remove this Entity form this org
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
          Archive Entity
        </button>
      </div>
    </div>
  );
}

