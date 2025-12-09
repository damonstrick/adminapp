'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useToast } from './ToastProvider';
import { ANALYZE_PRODUCT_NAME, MRF_SEARCH_PRODUCT_NAME } from '@/constants/products';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMembers?: string[]; // Emails of existing org members
  existingTqUsers?: string[]; // Emails of existing TQ users (not yet in this org)
}

type EmailStatus = 'existing-user' | 'new-user' | 'existing-member';

interface EmailTag {
  email: string;
  status: EmailStatus;
}

type RoleOption = 'None' | 'Viewer' | 'Editor' | 'Admin';

interface ProductRole {
  product: string;
  role: RoleOption;
}

interface MemberProductRoles {
  email: string;
  clearContracts: RoleOption;
  analyze: RoleOption;
  mrfSearch: RoleOption;
}

const PRODUCTS = ['Clear Contracts', ANALYZE_PRODUCT_NAME, MRF_SEARCH_PRODUCT_NAME];
const ROLE_OPTIONS: RoleOption[] = ['None', 'Viewer', 'Editor', 'Admin'];

// Mock data - in a real app, this would come from API calls
const DEFAULT_EXISTING_TQ_USERS = ['sammyvirji@email.com', 'jamison.mueller@email.com'];

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  existingMembers = [], 
  existingTqUsers = DEFAULT_EXISTING_TQ_USERS 
}: AddMemberModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputValue, setInputValue] = useState('');
  const [emailTags, setEmailTags] = useState<EmailTag[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0, width: 0 });
  const [memberProductRoles, setMemberProductRoles] = useState<MemberProductRoles[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAssignRoles, setQuickAssignRoles] = useState<{ [key: string]: RoleOption }>({
    'Clear Contracts': 'None',
    [ANALYZE_PRODUCT_NAME]: 'None',
    [MRF_SEARCH_PRODUCT_NAME]: 'None',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setInputValue('');
      setEmailTags([]);
      setShowAutocomplete(false);
      setMemberProductRoles([]);
      setSearchQuery('');
      setQuickAssignRoles({
        'Clear Contracts': 'None',
        [ANALYZE_PRODUCT_NAME]: 'None',
        [MRF_SEARCH_PRODUCT_NAME]: 'None',
      });
    }
  }, [isOpen]);

  // Initialize member product roles when moving to step 2
  useEffect(() => {
    if (step === 2 && emailTags.length > 0 && memberProductRoles.length === 0) {
      const initialRoles: MemberProductRoles[] = emailTags.map(tag => ({
        email: tag.email,
        clearContracts: 'None' as RoleOption,
        analyze: 'None' as RoleOption,
        mrfSearch: 'None' as RoleOption,
      }));
      setMemberProductRoles(initialRoles);
    }
  }, [step, emailTags, memberProductRoles.length]);

  // Get all available emails for autocomplete
  const getAllEmails = (): string[] => {
    return [...new Set([...existingMembers, ...existingTqUsers])];
  };

  // Get filtered autocomplete suggestions
  const getAutocompleteSuggestions = (): string[] => {
    if (!inputValue || inputValue.includes(',') || inputValue.includes(' ')) {
      return [];
    }
    const allEmails = getAllEmails();
    const lowerInput = inputValue.toLowerCase();
    return allEmails
      .filter(email => 
        email.toLowerCase().includes(lowerInput) && 
        !emailTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())
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
  }, [showAutocomplete, inputValue, emailTags]);

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

  const getEmailStatus = (email: string): EmailStatus => {
    if (existingMembers.some(m => m.toLowerCase() === email.toLowerCase())) {
      return 'existing-member';
    }
    if (existingTqUsers.some(u => u.toLowerCase() === email.toLowerCase())) {
      return 'existing-user';
    }
    return 'new-user';
  };

  const parseEmails = (text: string): string[] => {
    // Split by comma or space, trim, and filter out empty strings
    return text
      .split(/[,\s]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0 && e.includes('@'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

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
        const newEmails = emails.filter(
          email => !emailTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())
        );
        
        const newTags: EmailTag[] = newEmails.map(email => ({
          email,
          status: getEmailStatus(email),
        }));

        setEmailTags([...emailTags, ...newTags]);
        setInputValue('');
        setShowAutocomplete(false);
      }
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Remove last tag on backspace if input is empty
    if (e.key === 'Backspace' && inputValue === '' && emailTags.length > 0) {
      setEmailTags(emailTags.slice(0, -1));
    }
    // Add emails on Enter (if no autocomplete suggestions or if selecting first suggestion)
    if (e.key === 'Enter') {
      e.preventDefault();
      if (autocompleteSuggestions.length > 0 && inputValue) {
        // Select first autocomplete suggestion
        const selectedEmail = autocompleteSuggestions[0];
        if (!emailTags.some(tag => tag.email.toLowerCase() === selectedEmail.toLowerCase())) {
          const newTag: EmailTag = {
            email: selectedEmail,
            status: getEmailStatus(selectedEmail),
          };
          setEmailTags([...emailTags, newTag]);
          setInputValue('');
          setShowAutocomplete(false);
        }
      } else {
        const emails = parseEmails(inputValue);
        if (emails.length > 0) {
          const newEmails = emails.filter(
            email => !emailTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())
          );
          
          const newTags: EmailTag[] = newEmails.map(email => ({
            email,
            status: getEmailStatus(email),
          }));

          setEmailTags([...emailTags, ...newTags]);
          setInputValue('');
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
    if (!emailTags.some(tag => tag.email.toLowerCase() === email.toLowerCase())) {
      const newTag: EmailTag = {
        email,
        status: getEmailStatus(email),
      };
      setEmailTags([...emailTags, newTag]);
      setInputValue('');
      setShowAutocomplete(false);
    }
  };

  const removeTag = (emailToRemove: string) => {
    setEmailTags(emailTags.filter(tag => tag.email !== emailToRemove));
  };

  const existingMemberTag = emailTags.find(tag => tag.status === 'existing-member');
  const existingUserCount = emailTags.filter(tag => tag.status === 'existing-user').length;
  const hasExistingMember = existingMemberTag !== undefined;

  const handleContinue = () => {
    if (hasExistingMember) return;
    if (emailTags.length === 0) return;
    
    // Move to step 2
    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleRoleChange = (email: string, product: 'clearContracts' | 'analyze' | 'mrfSearch', role: RoleOption) => {
    setMemberProductRoles(prev => 
      prev.map(member => 
        member.email === email 
          ? { ...member, [product]: role }
          : member
      )
    );
  };

  const handleQuickAssignRoleChange = (product: string, role: RoleOption) => {
    setQuickAssignRoles(prev => ({ ...prev, [product]: role }));
    
    // Apply the role to all members for this product
    const productKey = product === 'Clear Contracts' ? 'clearContracts' : 
                       product === ANALYZE_PRODUCT_NAME ? 'analyze' : 'mrfSearch';
    
    setMemberProductRoles(prev => 
      prev.map(member => ({
        ...member,
        [productKey]: role
      }))
    );
  };

  const handleContinueToReview = () => {
    setStep(3);
  };

  const handleSendInvitations = () => {
    // Handle invite logic here
    console.log('Inviting members with roles:', memberProductRoles);
    
    // Count different types of members
    const newUsers = emailTags.filter(tag => tag.status === 'new-user');
    const existingUsers = emailTags.filter(tag => tag.status === 'existing-user');
    
    // Show appropriate toast messages
    if (existingUsers.length > 0 && newUsers.length > 0) {
      // Both types
      showToast(
        `${existingUsers.length} existing ${existingUsers.length === 1 ? 'user' : 'users'} added. ${newUsers.length} invite${newUsers.length === 1 ? '' : 's'} sent.`
      );
    } else if (existingUsers.length > 0) {
      // Only existing users
      showToast(
        `${existingUsers.length} existing ${existingUsers.length === 1 ? 'user' : 'users'} added.`
      );
    } else if (newUsers.length > 0) {
      // Only new users
      showToast(
        `${newUsers.length} invite${newUsers.length === 1 ? '' : 's'} sent.`
      );
    }
    
    setEmailTags([]);
    setInputValue('');
    setMemberProductRoles([]);
    setStep(1);
    onClose();
  };

  // Filter members based on search query
  const filteredMembers = memberProductRoles.filter(member =>
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const renderStep1 = () => (
    <>
      {/* Top Bar */}
      <div className="bg-white flex flex-col gap-2 items-start pb-1 pt-3 px-4 relative shrink-0 w-full rounded-t-[8px]">
        <div className="flex flex-col gap-2 items-start justify-center relative shrink-0 w-full">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] w-full">
            Invite Members
          </p>
          <p className="font-normal leading-4 relative shrink-0 text-[#4b595c] text-xs tracking-[0.12px] w-full">
            Invited members will be asked to create an account. Once their account is created, they will be added as a member to this organization
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white flex flex-col gap-4 items-start overflow-y-auto px-4 py-6 relative shrink-0 w-full" style={{ overflowX: 'visible' }}>
        <div className="flex flex-col gap-2 items-start relative shrink-0 w-full" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex gap-1 items-center relative shrink-0">
            <p className="font-normal leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px] whitespace-pre">
              Email Addresses
            </p>
          </div>
          <div ref={inputContainerRef} className="bg-white border border-[#e3e7ea] border-solid flex flex-wrap gap-2 items-center px-3 py-2 relative rounded w-full min-h-[40px]">
            {emailTags.map((tag) => (
              <div
                key={tag.email}
                className={`${getTagStyles(tag.status)} flex gap-1 h-4 items-center justify-center px-2 py-0.5 relative rounded shrink-0`}
              >
                {tag.status === 'existing-user' && (
                  <div className="relative shrink-0 w-3 h-3 text-[#36c5ba]">
                    {getTagIcon(tag.status)}
                  </div>
                )}
                {tag.status === 'new-user' && (
                  <div className="relative shrink-0 w-3 h-3">
                    {getTagIcon(tag.status)}
                  </div>
                )}
                <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-[11px] tracking-[0.11px] whitespace-pre">
                  {tag.email}
                </p>
                <button
                  onClick={() => removeTag(tag.email)}
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
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => {
                if (inputValue && !inputValue.includes(',') && !inputValue.includes(' ')) {
                  setShowAutocomplete(true);
                }
              }}
              placeholder={emailTags.length === 0 ? "Enter email addresses (comma or space separated)..." : ""}
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
                      <div className="w-3 h-3 text-[#36c5ba] shrink-0">
                        {getTagIcon(status)}
                      </div>
                    )}
                    {status === 'new-user' && (
                      <div className="w-3 h-3 shrink-0">
                        {getTagIcon(status)}
                      </div>
                    )}
                    {status === 'existing-member' && (
                      <svg className="w-3 h-3 text-[#ff471a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex gap-1 items-center px-0 py-0 relative shrink-0 w-full">
            <p className="basis-0 font-normal grow leading-3 min-h-px min-w-px relative shrink-0 text-[#4b595c] text-[11px] tracking-[0.11px]">
              You can invite or add multiple members at once.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {hasExistingMember && (
          <div className="flex gap-1 items-center px-0 py-0 relative shrink-0 w-full">
            <svg className="w-3 h-3 text-[#ff471a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="basis-0 font-normal grow leading-3 min-h-px min-w-px relative shrink-0 text-[#ff471a] text-[11px] tracking-[0.11px]">
              {existingMemberTag?.email} is already a member
            </p>
          </div>
        )}

        {/* Info Toast */}
        {existingUserCount > 0 && (
          <div className="bg-[#f7f8f8] border border-[#e3e7ea] border-solid flex gap-2 items-center px-4 py-3 relative rounded w-full">
            <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
              <svg className="w-5 h-5 text-[#16696d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
                {existingUserCount} existing {existingUserCount === 1 ? 'user' : 'users'} will be added immediately
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-[#d2d8dc] border-solid flex items-center justify-between px-4 py-3 relative shrink-0 w-full rounded-b-[8px]">
        <div className="basis-0 flex gap-2 grow items-center justify-end min-h-px min-w-px relative shrink-0">
          <button
            onClick={onClose}
            className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 hover:bg-[#f0f2f2]"
          >
            <p className="font-medium leading-4 relative shrink-0 text-[#4b595c] text-xs text-center tracking-[0.12px] whitespace-pre">
              Cancel
            </p>
          </button>
          <button
            onClick={handleContinue}
            disabled={hasExistingMember || emailTags.length === 0}
            className={`flex gap-2 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 ${
              hasExistingMember || emailTags.length === 0
                ? 'bg-[#d2d8dc] text-[#89989b] cursor-not-allowed'
                : 'bg-[#16696d] text-white hover:bg-[#0d5256]'
            }`}
          >
            <p className="font-medium leading-4 relative shrink-0 text-xs text-center tracking-[0.12px] whitespace-pre">
              Continue
            </p>
          </button>
        </div>
      </div>
    </>
  );

  const QuickAssignRoleDropdown = ({ product }: { product: string }) => {
    const selectedRole = quickAssignRoles[product] || 'None';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const getRoleIcon = (role: RoleOption) => {
      if (role === 'Admin') {
        return (
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      } else if (role === 'Editor') {
        return (
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      } else if (role === 'Viewer') {
        return (
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      } else { // None
        return (
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      }
    };

    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 px-3 pl-10 border border-[#e3e7ea] rounded flex items-center justify-between hover:bg-[#f0f2f2] text-xs text-[#121313] bg-white"
        >
          <div className="flex items-center gap-2 absolute left-3">
            {getRoleIcon(selectedRole as RoleOption)}
          </div>
          <span className="flex-1 text-left">{selectedRole}</span>
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-[#e3e7ea] rounded shadow-lg">
            {ROLE_OPTIONS.map(role => (
              <button
                key={role}
                onClick={() => {
                  handleQuickAssignRoleChange(product, role);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#121313] hover:bg-[#f0f2f2] flex items-center gap-2"
              >
                {getRoleIcon(role)}
                <span>{role}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const RoleDropdown = ({ email, product }: { email: string; product: 'clearContracts' | 'analyze' | 'mrfSearch' }) => {
    const member = memberProductRoles.find(m => m.email === email);
    const currentRole = member ? member[product] : 'None';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const getRoleIcon = (role: RoleOption) => {
      if (role === 'Admin') {
        return (
          <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      } else if (role === 'Editor') {
        return (
          <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      } else if (role === 'Viewer') {
        return (
          <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      } else { // None
        return (
          <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      }
    };

    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 px-3 border border-[#e3e7ea] rounded flex items-center justify-between hover:bg-[#f0f2f2] text-xs text-[#121313]"
        >
          <div className="flex items-center gap-2">
            {getRoleIcon(currentRole)}
            <span>{currentRole}</span>
          </div>
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-[#e3e7ea] rounded shadow-lg">
            {ROLE_OPTIONS.map(role => (
              <button
                key={role}
                onClick={() => {
                  handleRoleChange(email, product, role);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#121313] hover:bg-[#f0f2f2] flex items-center gap-2"
              >
                {getRoleIcon(role)}
                <span>{role}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep2 = () => {

    return (
      <>
        {/* Top Bar */}
        <div className="bg-white flex flex-col items-start pb-1 pt-3 px-4 relative shrink-0 w-full rounded-t-[8px]">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] w-full">
            Add Members
          </p>
        </div>

        {/* Breadcrumbs */}
        <div className="bg-white flex items-center justify-center px-4 py-3 border-b border-[#e3e7ea]">
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#16696d] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">1</span>
              </div>
              <span className="text-[#6e8081]">Add Emails</span>
              <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#16696d] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">2</span>
              </div>
              <span className="text-[#121313] font-medium">Product Access</span>
              <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#e3e7ea] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-[#6e8081] font-medium">3</span>
              </div>
              <span className="text-[#6e8081]">Review</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white flex flex-col gap-4 items-start overflow-y-auto px-4 py-4 relative shrink-0 w-full">
          {/* Quick assign to all members */}
          <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4 w-full">
            <div className="flex flex-col gap-3 w-full">
              <p className="text-xs text-[#6E8081] font-normal">Quick assign to all members</p>
              <div className="flex gap-4">
                {PRODUCTS.map((product) => {
                  const getProductIcon = (p: string) => {
                    if (p === 'Clear Contracts') {
                      return (
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      );
                    } else if (p === ANALYZE_PRODUCT_NAME) {
                      return (
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      );
                    } else if (p === MRF_SEARCH_PRODUCT_NAME) {
                      return (
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      );
                    }
                    return null;
                  };

                  return (
                    <div key={product} className="flex-1 flex flex-col gap-2">
                      <label className="text-xs text-[#121313] font-normal">{product}</label>
                      <QuickAssignRoleDropdown product={product} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="w-full">
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded flex items-center h-8 px-3 gap-2">
              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask a question or search"
                className="flex-1 bg-transparent text-xs text-[#121313] outline-none placeholder:text-[#89989b]"
              />
              <div className="bg-white border border-[#e3e7ea] rounded px-1.5 py-0.5">
                <span className="font-medium text-[11px] text-[#4b595c]">/</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full border border-[#e3e7ea] rounded">
            <div className="grid grid-cols-4 border-b border-[#e3e7ea]">
              <div className="px-3 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">Email</p>
              </div>
              <div className="px-3 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">Clear Contracts</p>
              </div>
              <div className="px-3 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">{ANALYZE_PRODUCT_NAME}</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-[#121313]">{MRF_SEARCH_PRODUCT_NAME}</p>
              </div>
            </div>
            {filteredMembers.map((member) => (
              <div key={member.email} className="grid grid-cols-4 border-b border-[#e3e7ea] last:border-b-0">
                <div className="px-3 py-3.5 border-r border-[#e3e7ea] min-w-0 overflow-hidden">
                  <p className="text-xs text-[#121313] truncate">{member.email}</p>
                </div>
                <div className="px-3 py-3.5 border-r border-[#e3e7ea]">
                  <RoleDropdown email={member.email} product="clearContracts" />
                </div>
                <div className="px-3 py-3.5 border-r border-[#e3e7ea]">
                  <RoleDropdown email={member.email} product="analyze" />
                </div>
                <div className="px-3 py-3.5">
                  <RoleDropdown email={member.email} product="mrfSearch" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-[#d2d8dc] border-solid flex items-center justify-between px-4 py-3 relative shrink-0 w-full rounded-b-[8px]">
          <button
            onClick={handleBack}
            className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 hover:bg-[#f0f2f2]"
          >
            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs text-center tracking-[0.12px] whitespace-pre">
              Back
            </p>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 hover:bg-[#f0f2f2]"
            >
              <p className="font-medium leading-4 relative shrink-0 text-[#4b595c] text-xs text-center tracking-[0.12px] whitespace-pre">
                Cancel
              </p>
            </button>
            <button
              onClick={handleContinueToReview}
              className="flex gap-2 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 bg-[#16696d] text-white hover:bg-[#0d5256]"
            >
              <p className="font-medium leading-4 relative shrink-0 text-xs text-center tracking-[0.12px] whitespace-pre">
                Continue
              </p>
            </button>
          </div>
        </div>
      </>
    );
  };

  const getTagStyles = (status: EmailStatus) => {
    switch (status) {
      case 'existing-user':
        return 'bg-[#e4f8f6] border border-[#36c5ba]';
      case 'existing-member':
        return 'bg-[#ffefeb] border border-[#ff471a]';
      default:
        return 'bg-[#e8ebeb]';
    }
  };

  const getTagIcon = (status: EmailStatus) => {
    if (status === 'existing-user') {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (status === 'new-user') {
      return (
        <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    return null;
  };

  const renderStep3 = () => {
    // Calculate counts
    const newUsers = emailTags.filter(tag => tag.status === 'new-user');
    const existingUsers = emailTags.filter(tag => tag.status === 'existing-user');
    
    // Calculate role counts per product
    const getRoleCounts = (product: 'clearContracts' | 'analyze' | 'mrfSearch') => {
      const counts = { Admin: 0, Editor: 0, Viewer: 0 };
      memberProductRoles.forEach(member => {
        const role = member[product];
        if (role !== 'None' && role in counts) {
          counts[role as keyof typeof counts]++;
        }
      });
      return counts;
    };

    const clearContractsCounts = getRoleCounts('clearContracts');
    const analyzeCounts = getRoleCounts('analyze');
    const mrfSearchCounts = getRoleCounts('mrfSearch');

    const getRoleIcon = (role: 'Admin' | 'Editor' | 'Viewer') => {
      if (role === 'Admin') {
        return (
          <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      } else if (role === 'Editor') {
        return (
          <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      } else { // Viewer
        return (
          <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      }
    };


    return (
      <>
        {/* Top Bar */}
        <div className="bg-white flex flex-col items-start pb-1 pt-3 px-4 relative shrink-0 w-full rounded-t-[8px]">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-[0.14px] w-full">
            Add Members
          </p>
        </div>

        {/* Breadcrumbs */}
        <div className="bg-white flex items-center justify-center px-4 py-3 border-b border-[#e3e7ea]">
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#16696d] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">1</span>
              </div>
              <span className="text-[#6e8081]">Add Emails</span>
              <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#16696d] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">2</span>
              </div>
              <span className="text-[#6e8081]">Product Access</span>
              <svg className="w-3 h-3 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-[#16696d] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">3</span>
              </div>
              <span className="text-[#121313] font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white flex flex-col gap-6 items-start overflow-y-auto px-4 py-4 relative shrink-0 w-full">
          {/* Header */}
          <div className="flex flex-col gap-2 w-full">
            <p className="font-semibold text-sm text-[#121313]">Review & Confirm</p>
            <p className="text-xs text-[#4b595c]">
              Please review the invitation details before sending
            </p>
          </div>

          {/* Info Cards */}
          <div className="flex flex-col gap-3 w-full">
            {/* New Invitations Card */}
            {newUsers.length > 0 && (
              <div className="bg-[#e8fdea] border border-[#d4fad7] rounded-lg p-3 w-full">
                <div className="flex gap-3 items-start">
                  <svg className="w-4 h-4 text-[#072e09] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-xs text-[#072e09]">
                      {newUsers.length} new invitation{newUsers.length === 1 ? '' : 's'} will be sent
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {newUsers.map((tag) => (
                        <span key={tag.email} className="text-xs text-[#072e09] opacity-66">
                          {tag.email}
                          {tag !== newUsers[newUsers.length - 1] && <span>,</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Users Card */}
            {existingUsers.length > 0 && (
              <div className="bg-[#fff6eb] border border-[#ffeed9] rounded-lg p-3 w-full">
                <div className="flex gap-3 items-start">
                  <svg className="w-4 h-4 text-[#4b2c00] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-xs text-[#4b2c00]">
                      {existingUsers.length} existing user{existingUsers.length === 1 ? '' : 's'} will be added
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {existingUsers.map((tag) => (
                        <span key={tag.email} className="text-xs text-[#804801] opacity-66">
                          {tag.email}
                          {tag !== existingUsers[existingUsers.length - 1] && <span>,</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Access Summary */}
          <div className="flex flex-col gap-4 w-full">
            <p className="font-semibold text-xs text-[#121313]">Product Access Summary</p>
            <div className="border border-[#e3e7ea] rounded-lg overflow-hidden">
              {/* Clear Contracts */}
              <div className="border-b border-[#e3e7ea] last:border-b-0">
                <div className="px-3 py-3 flex items-center justify-between">
                  <p className="font-medium text-xs text-[#121313]">Clear Contracts</p>
                  <div className="flex items-center gap-4">
                    {clearContractsCounts.Admin > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Admin')}
                        <span className="text-xs text-[#6e8081]">{clearContractsCounts.Admin}</span>
                      </div>
                    )}
                    {clearContractsCounts.Editor > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Editor')}
                        <span className="text-xs text-[#6e8081]">{clearContractsCounts.Editor}</span>
                      </div>
                    )}
                    {clearContractsCounts.Viewer > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Viewer')}
                        <span className="text-xs text-[#6e8081]">{clearContractsCounts.Viewer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Analyze */}
              <div className="border-b border-[#e3e7ea] last:border-b-0">
                <div className="px-3 py-3 flex items-center justify-between">
                  <p className="font-medium text-xs text-[#121313]">{ANALYZE_PRODUCT_NAME}</p>
                  <div className="flex items-center gap-4">
                    {analyzeCounts.Admin > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Admin')}
                        <span className="text-xs text-[#6e8081]">{analyzeCounts.Admin}</span>
                      </div>
                    )}
                    {analyzeCounts.Editor > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Editor')}
                        <span className="text-xs text-[#6e8081]">{analyzeCounts.Editor}</span>
                      </div>
                    )}
                    {analyzeCounts.Viewer > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Viewer')}
                        <span className="text-xs text-[#6e8081]">{analyzeCounts.Viewer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* MRF Search */}
              <div className="border-b border-[#e3e7ea] last:border-b-0">
                <div className="px-3 py-3 flex items-center justify-between">
                  <p className="font-medium text-xs text-[#121313]">{MRF_SEARCH_PRODUCT_NAME}</p>
                  <div className="flex items-center gap-4">
                    {mrfSearchCounts.Admin > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Admin')}
                        <span className="text-xs text-[#6e8081]">{mrfSearchCounts.Admin}</span>
                      </div>
                    )}
                    {mrfSearchCounts.Editor > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Editor')}
                        <span className="text-xs text-[#6e8081]">{mrfSearchCounts.Editor}</span>
                      </div>
                    )}
                    {mrfSearchCounts.Viewer > 0 && (
                      <div className="flex items-center gap-1">
                        {getRoleIcon('Viewer')}
                        <span className="text-xs text-[#6e8081]">{mrfSearchCounts.Viewer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-[#d2d8dc] border-solid flex items-center justify-between px-4 py-3 relative shrink-0 w-full rounded-b-[8px]">
          <button
            onClick={handleBack}
            className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 hover:bg-[#f0f2f2]"
          >
            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs text-center tracking-[0.12px] whitespace-pre">
              Back
            </p>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 border border-[#e3e7ea] hover:bg-[#f0f2f2]"
            >
              <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs text-center tracking-[0.12px] whitespace-pre">
                Cancel
              </p>
            </button>
            <button
              onClick={handleSendInvitations}
              className="flex gap-2 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 bg-[#16696d] text-white hover:bg-[#0d5256]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <p className="font-medium leading-4 relative shrink-0 text-xs text-center tracking-[0.12px] whitespace-pre">
                Send Invitations
              </p>
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={onClose} style={{ paddingTop: '136px' }}>
      <div className="bg-white rounded-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] w-[600px] max-h-[calc(100vh-176px)] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
      </div>
    </div>
  );
}

