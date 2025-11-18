'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import PRODUCT_LOGOS from './productLogos';
import { ANALYZE_PRODUCT_NAME } from '@/constants/products';

interface Entity {
  id: string;
  name: string;
  type: string;
  access: string[];
  members: number;
}

const baseEntities: Entity[] = [
  { id: '1', name: 'St. Mary\'s Medical Center', type: 'Hospital', access: ['Clear Contracts', 'Analyze'], members: 342 },
  { id: '2', name: 'Regional Health Network', type: 'Healthcare System', access: ['Clear Contracts'], members: 128 },
  { id: '3', name: 'Community Care Clinic', type: 'Clinic', access: ['Analyze'], members: 45 },
  { id: '4', name: 'Metro General Hospital', type: 'Hospital', access: ['Clear Contracts', 'Analyze'], members: 289 },
  { id: '5', name: 'Riverside Medical Group', type: 'Medical Group', access: ['Clear Contracts'], members: 156 },
  { id: '6', name: 'Health Partners Alliance', type: 'Healthcare System', access: ['Clear Contracts', 'Analyze'], members: 421 },
  { id: '7', name: 'Valley View Hospital', type: 'Hospital', access: ['Analyze'], members: 203 },
  { id: '8', name: 'Primary Care Associates', type: 'Clinic', access: ['Clear Contracts', 'Analyze'], members: 67 },
  { id: '9', name: 'Coastal Medical Center', type: 'Hospital', access: ['Clear Contracts'], members: 178 },
  { id: '10', name: 'Mountain View Health System', type: 'Healthcare System', access: ['Clear Contracts', 'Analyze'], members: 534 },
  { id: '11', name: 'Urban Care Network', type: 'Medical Group', access: ['Analyze'], members: 92 },
  { id: '12', name: 'Sunrise Medical Group', type: 'Medical Group', access: ['Clear Contracts'], members: 134 },
  { id: '13', name: 'Central Valley Hospital', type: 'Hospital', access: ['Clear Contracts', 'Analyze'], members: 267 },
  { id: '14', name: 'Family Health Centers', type: 'Clinic', access: ['Clear Contracts'], members: 89 },
  { id: '15', name: 'Northwest Healthcare Partners', type: 'Healthcare System', access: ['Clear Contracts', 'Analyze'], members: 612 },
  { id: '16', name: 'Lakeside Medical Center', type: 'Hospital', access: ['Analyze'], members: 198 },
  { id: '17', name: 'Eastside Medical Group', type: 'Medical Group', access: ['Clear Contracts', 'Analyze'], members: 145 },
  { id: '18', name: 'Westgate Community Hospital', type: 'Hospital', access: ['Clear Contracts'], members: 223 },
  { id: '19', name: 'Downtown Health Clinic', type: 'Clinic', access: ['Clear Contracts', 'Analyze'], members: 56 },
  { id: '20', name: 'Highland Medical System', type: 'Healthcare System', access: ['Analyze'], members: 387 },
];

const allEntities: Entity[] = baseEntities.map((entity) => ({
  ...entity,
  access: entity.access.map((product) =>
    product === 'Analyze' ? ANALYZE_PRODUCT_NAME : product
  ),
}));

const ROW_HEIGHT = 64; // h-16 = 64px
const TABLE_HEADER_HEIGHT = 32;
const SEARCH_BAR_HEIGHT = 32;
const PAGINATION_HEIGHT = 40;
const OVERHEAD_HEIGHT = 48 + 48 + 44 + 32 + 40 + 97; // top nav + banner + page header + search + pagination + padding

export const TOTAL_ENTITIES = allEntities.length;

export default function AnalyzeContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Filter entities based on search
  const filteredEntities = allEntities.filter(entity => {
    if (!searchValue.trim()) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      entity.name.toLowerCase().includes(searchLower) ||
      entity.type.toLowerCase().includes(searchLower)
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
    const maxPage = Math.ceil(filteredEntities.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, currentPage, filteredEntities.length]);

  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntities = filteredEntities.slice(startIndex, endIndex);

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

  const handleRowClick = (entity: Entity) => {
    return `/permissions/entities/${entity.id}`;
  };

  return (
    <DataTable
      onRowClick={handleRowClick}
      searchPlaceholder="Search for entities..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      columns={[
        {
          header: '',
          width: '40px',
          render: (entity, index) => (
            <div className="flex items-center justify-center px-2">
              <p className="font-normal leading-4 text-xs text-[#6e8081] text-center tracking-[0.12px] whitespace-pre">
                {startIndex + index + 1}
              </p>
            </div>
          ),
        },
        {
          header: 'Entity',
          headerIcon: sortIcon,
          render: (entity) => (
            <p className="font-normal leading-4 overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px] whitespace-pre">
              {entity.name}
            </p>
          ),
        },
        {
          header: 'Type',
          render: (entity) => (
            <p className="basis-0 font-normal grow leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap tracking-[0.12px]">
              {entity.type}
            </p>
          ),
        },
        {
          header: 'Access',
          wrap: true,
          render: (entity) => (
            <div className="flex flex-wrap gap-2 items-start">
              {entity.access.map((product, productIndex) => {
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
          header: 'Members',
          align: 'right',
          render: (entity) => (
            <p className="basis-0 font-normal grow h-full leading-4 min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313] text-nowrap text-right tracking-[0.12px]">
              {entity.members}
            </p>
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
      data={currentEntities}
      pagination={pagination}
    />
  );
}
