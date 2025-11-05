'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useToast } from './ToastProvider';

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

// Mock data - in a real app, this would come from API calls
const DEFAULT_EXISTING_TQ_USERS = ['sammyvirji@email.com', 'jamison.mueller@email.com'];

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  existingMembers = [], 
  existingTqUsers = DEFAULT_EXISTING_TQ_USERS 
}: AddMemberModalProps) {
  const { showToast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [emailTags, setEmailTags] = useState<EmailTag[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setEmailTags([]);
      setShowAutocomplete(false);
    }
  }, [isOpen]);

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

  const handleInvite = () => {
    if (hasExistingMember) return;
    
    // Handle invite logic here
    console.log('Inviting members:', emailTags);
    
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
    onClose();
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={onClose} style={{ paddingTop: '136px' }}>
      <div className="bg-white rounded-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] w-[600px] max-h-[calc(100vh-176px)] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
              onClick={handleInvite}
              disabled={hasExistingMember || emailTags.length === 0}
              className={`flex gap-2 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 ${
                hasExistingMember || emailTags.length === 0
                  ? 'bg-[#d2d8dc] text-[#89989b] cursor-not-allowed'
                  : 'bg-[#16696d] text-white hover:bg-[#0d5256]'
              }`}
            >
              <p className="font-medium leading-4 relative shrink-0 text-xs text-center tracking-[0.12px] whitespace-pre">
                Invite Members
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

