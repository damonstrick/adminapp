'use client';

import { useState } from 'react';

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEntityModal({ isOpen, onClose }: CreateEntityModalProps) {
  const [pointOfContactOpen, setPointOfContactOpen] = useState(true);
  const [assignProductsOpen, setAssignProductsOpen] = useState(true);
  const [addMembersOpen, setAddMembersOpen] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState(['Alice Johnson', 'Brian Smith', 'Catherine Lee', 'David Brown', 'Emma Wilson', 'Frank Garcia']);

  if (!isOpen) return null;

  const removeMember = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={onClose} style={{ paddingTop: '136px' }}>
      <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[calc(100vh-176px)] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
          <div className="flex-1">
            <h2 className="font-semibold text-base text-[#121313] mb-1">Create Entity</h2>
            <p className="font-medium text-xs text-[#6e8081]">
              Set up the entity profile. Entities are instances of organizations that act as a ....
            </p>
          </div>
          <button onClick={onClose} className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded">
            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Upload Logo */}
          <div className="border-2 border-dashed border-[#36c5ba] rounded p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-sm text-[#121313] mb-2">Upload Logo</h3>
              <p className="font-normal text-xs text-[#4b595c]">
                Upload .png, .jpg, or .gif. Recommended size 200x200px
              </p>
            </div>
            <button className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]">
              Choose an Image
            </button>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-xs font-medium text-[#121313] mb-2">Organization Name</label>
            <input
              type="text"
              placeholder="Hint Label"
              className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
            />
          </div>

          {/* Organization Type and Email */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">Organization Type</label>
              <input
                type="text"
                placeholder="Organization Type"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
          </div>

          {/* Tax ID and NPI */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">Tax ID Number (TIN)</label>
              <input
                type="text"
                placeholder="Tax ID Number (TIN)"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">National Provider ID (NPI)</label>
              <input
                type="text"
                placeholder="National Provider ID (NPI)"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-[#121313] mb-2">Address</label>
            <input
              type="text"
              placeholder="Address"
              className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
            />
          </div>

          {/* City, State, Zip */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">City</label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
            <div className="flex gap-6 flex-1">
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#121313] mb-2">State</label>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#121313] mb-2">Zip</label>
                <input
                  type="text"
                  placeholder="Zip"
                  className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                />
              </div>
            </div>
          </div>

          {/* Phone and Website */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#121313] mb-2">Website</label>
              <input
                type="url"
                placeholder="Website"
                className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
              />
            </div>
          </div>

          {/* Point Of Contact Accordion */}
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 pb-0">
          <button
            onClick={() => setPointOfContactOpen(!pointOfContactOpen)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-sm text-[#121313] mb-2">Point Of Contact</h3>
              <p className="font-normal text-xs text-[#6e8081]">
                Admin information for this organization. Admin info is not public.
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-[#121313] transition-transform ${pointOfContactOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {pointOfContactOpen && (
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#121313] mb-2">Support Contact Name</label>
                  <input
                    type="text"
                    placeholder="Support Contact Name"
                    className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#121313] mb-2">Support Phone</label>
                  <input
                    type="tel"
                    placeholder="Support Phone"
                    className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#121313] mb-2">Support Contact Email</label>
                <input
                  type="email"
                  placeholder="Support Contact Email"
                  className="w-full px-3 py-2 border border-[#e3e7ea] rounded-md text-sm text-[#121313] focus:outline-none focus:ring-2 focus:ring-[#16696d]"
                />
              </div>
            </div>
          )}
          </div>

          {/* Assign Products Accordion */}
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 pb-0">
          <button
            onClick={() => setAssignProductsOpen(!assignProductsOpen)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-sm text-[#121313] mb-2">Assign Products</h3>
              <p className="font-normal text-xs text-[#6e8081]">
                Select the products that this entity will have access to. The list of products below is dependent on the parent org has purchased
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-[#121313] transition-transform ${assignProductsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {assignProductsOpen && (
            <div className="space-y-3 pt-4">
              {/* Clear Contracts */}
              <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-xs text-[#121313] mb-1">Clear Contracts</p>
                    <p className="font-normal text-xs text-[#6e8081]">
                      Claims pricing analysis and optimization
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
                  </label>
                </div>
              </div>
              {/* Analyze */}
              <div className="border border-[#e3e7ea] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-xs text-[#121313] mb-1">Analyze</p>
                    <p className="font-normal text-xs text-[#6e8081]">
                      Enhanced compliance monitoring and reporting
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16696d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16696d]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Add Members Accordion */}
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 pb-0">
          <button
            onClick={() => setAddMembersOpen(!addMembersOpen)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-sm text-[#121313] mb-2">Add Members</h3>
              <p className="font-normal text-xs text-[#6e8081]">
                Search for new members to add to this entity
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-[#121313] transition-transform ${addMembersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {addMembersOpen && (
            <div className="space-y-4 pt-4">
              <div>
                <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg flex items-center h-8 px-3 gap-2">
                  <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for a member"
                    className="bg-transparent flex-1 text-xs text-[#121313] outline-none"
                  />
                  <div className="bg-white border border-[#e3e7ea] rounded px-1.5 py-0.5">
                    <span className="font-medium text-[11px] text-[#4b595c]">/</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member}
                    className="bg-[#f0f2f2] px-2 py-1 rounded text-xs font-medium text-[#121313] flex items-center gap-1"
                  >
                    <span>{member}</span>
                    <button
                      onClick={() => removeMember(member)}
                      className="hover:bg-[#e3e7ea] rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-[rgba(0,0,0,0.1)] p-4 flex justify-end gap-2 bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#e3e7ea] rounded-lg text-xs font-medium text-[#121313] hover:bg-[#f0f2f2]"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]">
            Create Entity
          </button>
        </div>
      </div>
    </div>
  );
}

