'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useToast } from './ToastProvider';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMembers?: string[];
  existingTqUsers?: string[];
}

type EmailStatus = 'existing-member' | 'existing-user' | 'new-user';

interface EmailTag {
  email: string;
  status: EmailStatus;
}

// Mock data - in a real app, this would come from API calls
const DEFAULT_EXISTING_MEMBERS = [
  'sarah.johnson@commonspirit.org',
  'michael.chen@commonspirit.org',
  'emily.rodriguez@commonspirit.org',
  'david.kim@commonspirit.org',
  'jessica.martinez@commonspirit.org',
  'robert.taylor@commonspirit.org',
  'amanda.white@commonspirit.org',
  'james.wilson@commonspirit.org',
  'lisa.anderson@commonspirit.org',
  'chris.brown@commonspirit.org',
  'michelle.davis@commonspirit.org',
  'daniel.garcia@commonspirit.org',
  'jennifer.lee@commonspirit.org',
  'matthew.harris@commonspirit.org',
  'nicole.thompson@commonspirit.org',
  'andrew.moore@commonspirit.org',
  'stephanie.clark@commonspirit.org',
  'kevin.lewis@commonspirit.org',
  'rachel.walker@commonspirit.org',
  'brian.hall@commonspirit.org',
  'lauren.allen@commonspirit.org',
  'ryan.young@commonspirit.org',
  'megan.king@commonspirit.org',
  'justin.wright@commonspirit.org',
  'hannah.lopez@commonspirit.org',
  'jared.kaufman@gmail.com',
];

const DEFAULT_EXISTING_TQ_USERS = ['sammyvirji@email.com', 'jamison.mueller@email.com'];

export default function CreateGroupModal({ 
  isOpen, 
  onClose,
  existingMembers = DEFAULT_EXISTING_MEMBERS,
  existingTqUsers = DEFAULT_EXISTING_TQ_USERS,
}: CreateGroupModalProps) {
  const { showToast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [membersInput, setMembersInput] = useState('');
  const [memberTags, setMemberTags] = useState<EmailTag[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
      setDescription('');
      setMembersInput('');
      setMemberTags([]);
      setShowAutocomplete(false);
    }
  }, [isOpen]);

  const getAllEmails = (): string[] => {
    return [...new Set([...existingMembers, ...existingTqUsers])];
  };

  const getEmailStatus = (email: string): EmailStatus => {
    if (existingMembers.some(m => m.toLowerCase() === email.toLowerCase())) {
      return 'existing-member';
    }
    if (existingTqUsers.some(u => u.toLowerCase() === email.toLowerCase())) {
      return 'existing-user';
    }
    return 'new-user';
  };

  // Get filtered autocomplete suggestions
  const getAutocompleteSuggestions = (): string[] => {
    if (!membersInput || membersInput.includes(',') || membersInput.includes(' ')) {
      return [];
    }
    const lowerInput = membersInput.toLowerCase();
    return getAllEmails()
      .filter(email => 
        email.toLowerCase().includes(lowerInput) && 
        !memberTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const autocompleteSuggestions = getAutocompleteSuggestions();

  // Update autocomplete position when it's shown
  useEffect(() => {
    if (showAutocomplete && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setAutocompletePosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showAutocomplete, membersInput, memberTags]);

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current && 
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAutocomplete]);

  const parseEmails = (text: string): string[] => {
    // Split by comma or space, trim, and filter out empty strings
    return text
      .split(/[,\s]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0 && e.includes('@'));
  };

  const handleMembersInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMembersInput(value);

    // Show autocomplete if there's input
    if (value && !value.includes(',') && !value.includes(' ')) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }

    // Parse emails when user types comma or space
    if (value.endsWith(',') || value.endsWith(' ')) {
      const emails = parseEmails(value);
      if (emails.length > 0) {
        const newTags = emails
          .filter(email => !memberTags.some(tag => tag.email.toLowerCase() === email.toLowerCase()))
          .map(email => ({
            email,
            status: getEmailStatus(email),
          }));
        if (newTags.length > 0) {
          setMemberTags([...memberTags, ...newTags]);
        }
        setMembersInput('');
        setShowAutocomplete(false);
      }
    }
  };

  const handleMembersInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Remove last member on backspace if input is empty
    if (e.key === 'Backspace' && membersInput === '' && memberTags.length > 0) {
      setMemberTags(memberTags.slice(0, -1));
    }
    // Add email on Enter (if no autocomplete suggestions or if selecting first suggestion)
    if (e.key === 'Enter') {
      e.preventDefault();
      if (autocompleteSuggestions.length > 0 && membersInput) {
        // Select first autocomplete suggestion
        const selectedEmail = autocompleteSuggestions[0];
        if (!memberTags.some(tag => tag.email.toLowerCase() === selectedEmail.toLowerCase())) {
          setMemberTags([
            ...memberTags,
            { email: selectedEmail, status: getEmailStatus(selectedEmail) },
          ]);
          setMembersInput('');
          setShowAutocomplete(false);
        }
      } else if (membersInput && membersInput.includes('@')) {
        // Add current input if it looks like an email
        if (!memberTags.some(tag => tag.email.toLowerCase() === membersInput.toLowerCase())) {
          setMemberTags([
            ...memberTags,
            { email: membersInput, status: getEmailStatus(membersInput) },
          ]);
          setMembersInput('');
          setShowAutocomplete(false);
        }
      }
    }
    // Close autocomplete on Escape
    if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const handleAutocompleteSelect = (email: string) => {
    if (!memberTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())) {
      setMemberTags([
        ...memberTags,
        { email, status: getEmailStatus(email) },
      ]);
      setMembersInput('');
      setShowAutocomplete(false);
    }
  };

  const removeMember = (email: string) => {
    setMemberTags(memberTags.filter(tag => tag.email !== email));
  };

  const handleCreate = () => {
    const members = memberTags.map(tag => tag.email);
    console.log('Creating group:', { groupName, description, members });
    
    // Show success toast
    showToast(`Group "${groupName}" created successfully.`);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={onClose} style={{ paddingTop: '136px' }}>
      <div className="bg-white rounded-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] w-[600px] max-h-[calc(100vh-176px)] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Top Bar */}
        <div className="bg-white flex flex-col gap-2 items-start pb-1 pt-3 px-4 relative shrink-0 w-full rounded-t-[8px]">
          <div className="flex flex-col gap-2 items-start justify-center relative shrink-0 w-full">
            <p className="font-semibold leading-5 text-[#121313] text-sm tracking-[0.14px] w-full">
              Create Group
            </p>
            <p className="font-normal leading-4 text-[#4b595c] text-xs tracking-[0.12px] w-full">
              Create a group to organize members. Add existing members to the group.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white flex flex-col gap-6 items-start overflow-clip px-4 py-6 relative shrink-0 w-full">
          {/* Group Name and Description - Side by Side */}
          <div className="flex gap-6 items-start relative shrink-0 w-full">
            {/* Group Name */}
            <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
              <div className="flex gap-1 items-center relative shrink-0">
                <p className="font-normal leading-4 text-[#121313] text-xs tracking-[0.12px] whitespace-pre">
                  Group Name
                </p>
              </div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter a group name"
                className="bg-white border border-[#e3e7ea] border-solid box-border flex gap-2 items-center px-3 py-2 relative rounded-[4px] shrink-0 w-full text-xs text-[#121313] placeholder:text-[#89989b] outline-none focus:border-[#16696d]"
              />
            </div>

            {/* Description */}
            <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
              <div className="flex gap-1 items-center relative shrink-0">
                <p className="font-normal leading-4 text-[#121313] text-xs tracking-[0.12px] whitespace-pre">
                  Description
                </p>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
                className="bg-white border border-[#e3e7ea] border-solid box-border flex gap-2 items-center px-3 py-2 relative rounded-[4px] shrink-0 w-full text-xs text-[#121313] placeholder:text-[#89989b] outline-none focus:border-[#16696d]"
              />
            </div>
          </div>

          {/* Add Members */}
          <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
            <div className="flex gap-1 items-center relative shrink-0">
              <p className="font-normal leading-4 text-[#121313] text-xs tracking-[0.12px] whitespace-pre">
                Add Members
              </p>
            </div>
            <div ref={inputContainerRef} className="bg-white border border-[#e3e7ea] border-solid flex flex-wrap gap-2 items-center px-3 py-2 relative rounded-[4px] shrink-0 w-full min-h-[40px]">
              {memberTags.map((tag) => (
                <div
                  key={tag.email}
                  className={`flex gap-1 h-4 items-center justify-center px-2 py-0.5 relative rounded shrink-0 ${
                    tag.status === 'existing-member'
                      ? 'bg-[#e8ebeb]'
                      : tag.status === 'existing-user'
                      ? 'bg-[#e4f8f6] border border-[#36c5ba]'
                      : 'bg-[#fef4e4] border border-[#ffbb57]'
                  }`}
                >
                  {tag.status !== 'existing-member' && (
                    <svg
                      className={`w-3 h-3 ${
                        tag.status === 'existing-user' ? 'text-[#36c5ba]' : 'text-[#c96a00]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {tag.status === 'existing-user' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </>
                      )}
                    </svg>
                  )}
                  <p className="font-medium leading-4 text-[#121313] text-[11px] tracking-[0.11px] whitespace-pre">
                    {tag.email}
                  </p>
                  <button
                    onClick={() => removeMember(tag.email)}
                    className="relative shrink-0 w-3 h-3 flex items-center justify-center hover:opacity-70"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={membersInput}
                onChange={handleMembersInputChange}
                onKeyDown={handleMembersInputKeyDown}
                onFocus={() => {
                  if (membersInput && !membersInput.includes(',') && !membersInput.includes(' ')) {
                    setShowAutocomplete(true);
                  }
                }}
                placeholder={memberTags.length === 0 ? "Enter email addresses (comma or space separated)..." : ""}
                className="basis-0 font-normal grow leading-4 min-h-px min-w-[120px] relative shrink-0 text-[#121313] text-xs tracking-[0.12px] outline-none border-none bg-transparent placeholder:text-[#89989b]"
              />
            </div>
            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div
                ref={autocompleteRef}
                className="fixed bg-white border border-[#e3e7ea] rounded shadow-lg z-[200] max-h-[200px] overflow-y-auto"
                style={{
                  top: `${autocompletePosition.top}px`,
                  left: `${autocompletePosition.left}px`,
                  width: `${autocompletePosition.width}px`,
                }}
              >
                {autocompleteSuggestions.map((email) => {
                  const status = getEmailStatus(email);
                  return (
                  <button
                    key={email}
                    onClick={() => handleAutocompleteSelect(email)}
                    className="w-full flex gap-2 items-center p-2 hover:bg-[#f0f2f2] text-left"
                  >
                    {status === 'existing-user' && (
                      <svg className="w-3 h-3 text-[#36c5ba] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {status === 'new-user' && (
                      <svg className="w-3 h-3 text-[#6e8081] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {status === 'existing-member' && (
                      <svg className="w-3 h-3 text-[#4b595c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className="font-normal leading-4 text-xs text-[#121313] tracking-[0.12px]">
                      {email}
                    </p>
                  </button>
                );
                })}
              </div>
            )}
            <div className="box-border flex gap-1 items-center px-0 py-0 relative shrink-0 w-full">
              <p className="basis-0 font-normal grow leading-3 min-h-px min-w-px text-[#4b595c] text-[11px] tracking-[0.11px]">
                Add existing members or invite new teammates by email. We’ll send invites for anyone not already in TQ.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-[#d2d8dc] border-solid box-border flex items-center justify-between px-4 py-3 relative shrink-0 w-full rounded-b-[8px]">
          <div className="basis-0 flex gap-2 grow items-center justify-end min-h-px min-w-px relative shrink-0">
            <button
              onClick={onClose}
              className="box-border flex gap-2 h-8 items-center justify-center max-h-8 px-3 py-2 relative rounded-[4px] shrink-0 hover:bg-[#f0f2f2]"
            >
              <p className="font-medium leading-4 text-[#4b595c] text-xs text-center tracking-[0.12px] whitespace-pre">
                Cancel
              </p>
            </button>
            <button
              onClick={handleCreate}
              className="bg-[#16696d] box-border flex gap-2 h-8 items-center justify-center max-h-8 px-3 py-2 relative rounded-[4px] shrink-0 hover:bg-[#0d5256]"
            >
              <p className="font-medium leading-4 text-white text-xs text-center tracking-[0.12px] whitespace-pre">
                Create Group
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
