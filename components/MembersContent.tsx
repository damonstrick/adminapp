'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';

interface Member {
  name: string;
  email: string;
  department: string;
  groups: number;
  status: string;
  id: string;
}

const allMembers: Member[] = [
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
  { name: 'Lauren Allen', email: 'lauren.allen@commonspirit.org', department: 'Operations', groups: 2, status: 'Inactive', id: 'la-021' },
  { name: 'Ryan Young', email: 'ryan.young@commonspirit.org', department: 'IT', groups: 5, status: 'Active', id: 'ry-022' },
  { name: 'Megan King', email: 'megan.king@commonspirit.org', department: 'HR', groups: 2, status: 'Active', id: 'mk-023' },
  { name: 'Justin Wright', email: 'justin.wright@commonspirit.org', department: 'Finance', groups: 4, status: 'Active', id: 'jw-024' },
  { name: 'Hannah Lopez', email: 'hannah.lopez@commonspirit.org', department: 'Sales', groups: 3, status: 'Active', id: 'hl-025' },
];

const ROW_HEIGHT = 64; // h-16 = 64px
const TABLE_HEADER_HEIGHT = 32;
const SEARCH_BAR_HEIGHT = 32;
const PAGINATION_HEIGHT = 40;
const OVERHEAD_HEIGHT = 48 + 48 + 44 + 32 + 40 + 97; // top nav + banner + page header + search + pagination + padding

export const TOTAL_MEMBERS = allMembers.length;

export default function MembersContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Filter members based on search
  const filteredMembers = allMembers.filter(member => {
    if (!searchValue.trim()) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.department.toLowerCase().includes(searchLower)
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
    const maxPage = Math.ceil(filteredMembers.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, currentPage, filteredMembers.length]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

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
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      columns={[
        {
          header: '',
          width: '40px',
          render: (member, index) => (
            <div className="flex items-center justify-center px-2">
              <p className="font-normal leading-4 text-xs text-[#6e8081] text-center tracking-[0.12px] whitespace-pre">
                {startIndex + index + 1}
              </p>
            </div>
          ),
        },
        {
          header: 'Member',
          headerIcon: sortIcon,
          render: (member) => (
            <div className="flex flex-col gap-2 items-start">
              <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#121313]">
                {member.name}
              </p>
              <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-xs text-[#6e8081]">
                {member.email}
              </p>
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
                {actionsIcon}
              </div>
            </button>
          ),
        },
      ]}
      data={currentMembers}
      onRowClick={(member) => `/permissions/members/${member.id}`}
      searchPlaceholder="Search members..."
      searchTableGap="10px"
      searchActions={
        <button className="px-4 py-2 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2] whitespace-nowrap shrink-0">
          Bulk Import
        </button>
      }
      pagination={pagination}
    />
  );
}
