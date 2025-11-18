'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import PRODUCT_LOGOS from './productLogos';
import { ANALYZE_PRODUCT_NAME } from '@/constants/products';

interface Group {
  name: string;
  description: string;
  members: number;
  products: string[];
  id: string;
}

const baseGroups: Group[] = [
  { name: 'Company Admins', description: 'Full administrative access to all platform features and settings', members: 12, products: ['Clear Contracts', 'Analyze'], id: 'company-admins' },
  { name: 'Product Managers', description: 'Access to product configuration and analytics dashboard', members: 28, products: ['Clear Contracts', 'Analyze'], id: 'product-managers' },
  { name: 'Sales Team', description: 'Access to sales data, contracts, and customer information', members: 45, products: ['Clear Contracts'], id: 'sales-team' },
  { name: 'Marketing Department', description: 'Read-only access to marketing analytics and campaign data', members: 32, products: ['Clear Contracts', 'Analyze'], id: 'marketing-dept' },
  { name: 'IT Operations', description: 'System administration and technical support access', members: 18, products: ['Clear Contracts', 'Analyze'], id: 'it-ops' },
  { name: 'Finance & Accounting', description: 'Financial reporting and billing access', members: 24, products: ['Clear Contracts'], id: 'finance-accounting' },
  { name: 'Human Resources', description: 'Employee management and organizational data access', members: 15, products: ['Clear Contracts'], id: 'human-resources' },
  { name: 'Clinical Staff', description: 'Patient data and clinical workflow access', members: 156, products: ['Clear Contracts', 'Analyze'], id: 'clinical-staff' },
  { name: 'Data Analysts', description: 'Advanced analytics and reporting capabilities', members: 8, products: ['Analyze'], id: 'data-analysts' },
  { name: 'Compliance Officers', description: 'Regulatory compliance monitoring and reporting', members: 6, products: ['Clear Contracts', 'Analyze'], id: 'compliance-officers' },
  { name: 'Executive Leadership', description: 'High-level dashboard and strategic reporting access', members: 9, products: ['Clear Contracts', 'Analyze'], id: 'executive-leadership' },
  { name: 'Quality Assurance', description: 'Quality metrics and performance monitoring tools', members: 14, products: ['Analyze'], id: 'quality-assurance' },
  { name: 'Customer Support', description: 'Customer service tools and support ticket access', members: 22, products: ['Clear Contracts'], id: 'customer-support' },
  { name: 'Research & Development', description: 'R&D data and experimental feature access', members: 11, products: ['Analyze'], id: 'research-dev' },
  { name: 'Legal Department', description: 'Legal document management and compliance tracking', members: 7, products: ['Clear Contracts'], id: 'legal-dept' },
  { name: 'Operations Team', description: 'Day-to-day operational data and process management', members: 19, products: ['Clear Contracts', 'Analyze'], id: 'operations-team' },
  { name: 'Training & Development', description: 'Learning management system and training materials', members: 5, products: ['Clear Contracts'], id: 'training-dev' },
  { name: 'Security Team', description: 'Security monitoring and access control management', members: 10, products: ['Clear Contracts', 'Analyze'], id: 'security-team' },
  { name: 'External Consultants', description: 'Limited access for external consulting partners', members: 13, products: ['Clear Contracts'], id: 'external-consultants' },
  { name: 'Regional Managers', description: 'Regional data access and management capabilities', members: 17, products: ['Clear Contracts', 'Analyze'], id: 'regional-managers' },
];

const allGroups: Group[] = baseGroups.map((group) => ({
  ...group,
  products: group.products.map((product) =>
    product === 'Analyze' ? ANALYZE_PRODUCT_NAME : product
  ),
}));

const ROW_HEIGHT = 64; // h-16 = 64px
const TABLE_HEADER_HEIGHT = 32;
const SEARCH_BAR_HEIGHT = 32;
const PAGINATION_HEIGHT = 40;
const OVERHEAD_HEIGHT = 48 + 48 + 44 + 32 + 40 + 97; // top nav + banner + page header + search + pagination + padding

export const TOTAL_GROUPS = allGroups.length;

export default function GroupsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Filter groups based on search
  const filteredGroups = allGroups.filter(group => {
    if (!searchValue.trim()) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const availableHeight = window.innerHeight - OVERHEAD_HEIGHT - TABLE_HEADER_HEIGHT - SEARCH_BAR_HEIGHT - PAGINATION_HEIGHT;
      const rowsThatFit = Math.floor(availableHeight / ROW_HEIGHT);
      const newItemsPerPage = Math.max(1, rowsThatFit);
      setItemsPerPage(newItemsPerPage);
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  useEffect(() => {
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    // Reset to page 1 if current page is out of bounds after itemsPerPage changes
    const maxPage = Math.ceil(filteredGroups.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, currentPage, filteredGroups.length]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };
  const sortIcon = (
    <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );

  const actionsIcon = (
    <svg className="w-3 h-3 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );

  const pagination = (
    <>
      <button 
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentPage === page
              ? 'bg-[#16696d] text-white'
              : 'border border-[#e3e7ea] text-[#121313] hover:bg-[#f0f2f2]'
          }`}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </>
  );

  return (
    <DataTable
      searchPlaceholder="Search for groups..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      columns={[
        {
          header: '',
          width: '40px',
          render: (group, index) => (
            <div className="flex items-center justify-center px-2">
              <p className="font-normal leading-4 text-xs text-[#6e8081] text-center tracking-[0.12px] whitespace-pre">
                {startIndex + index + 1}
              </p>
            </div>
          ),
        },
        {
          header: 'Group Name',
          headerIcon: sortIcon,
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
            <div className="flex flex-wrap gap-2 items-start">
              {group.products.map((product, productIndex) => {
                const config = PRODUCT_LOGOS[product as keyof typeof PRODUCT_LOGOS];
                if (config) {
                  return (
                      <div
                        key={`${product}-${productIndex}`}
                        className="w-6 h-6 flex items-center justify-center"
                        title={product}
                      >
                        {config?.image ? (
                          <img
                            src={config.image}
                            alt={`${product} logo`}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <div className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium">
                            {product}
                          </div>
                        )}
                      </div>
                  );
                }
                return (
                  <div
                    key={`${product}-${productIndex}`}
                    className="bg-[#f0f2f2] px-2 py-0.5 rounded text-[#121313] text-xs font-medium"
                  >
                    {product}
                  </div>
                );
              })}
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
                {actionsIcon}
              </div>
            </button>
          ),
        },
      ]}
      data={currentGroups}
      onRowClick={(group) => `/permissions/groups/${group.id}`}
      pagination={pagination}
    />
  );
}
