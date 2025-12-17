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
type QuickAssignRole = RoleOption | 'Mixed';

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

const availableGroups = [
  { id: 'company-admins', name: 'Company Admins', description: 'Full administrative access to all platform features and settings' },
  { id: 'product-managers', name: 'Product Managers', description: 'Access to product configuration and analytics dashboard' },
  { id: 'sales-team', name: 'Sales Team', description: 'Access to sales data, contracts, and customer information' },
  { id: 'marketing-dept', name: 'Marketing Department', description: 'Read-only access to marketing analytics and campaign data' },
  { id: 'it-ops', name: 'IT Operations', description: 'System administration and technical support access' },
  { id: 'finance-accounting', name: 'Finance & Accounting', description: 'Financial reporting and billing access' },
  { id: 'human-resources', name: 'Human Resources', description: 'Employee management and organizational data access' },
  { id: 'clinical-staff', name: 'Clinical Staff', description: 'Patient data and clinical workflow access' },
  { id: 'data-analysts', name: 'Data Analysts', description: 'Advanced analytics and reporting capabilities' },
  { id: 'compliance-officers', name: 'Compliance Officers', description: 'Regulatory compliance monitoring and reporting' },
  { id: 'executive-leadership', name: 'Executive Leadership', description: 'High-level dashboard and strategic reporting access' },
  { id: 'quality-assurance', name: 'Quality Assurance', description: 'Quality metrics and performance monitoring tools' },
  { id: 'customer-support', name: 'Customer Support', description: 'Customer service tools and support ticket access' },
  { id: 'research-dev', name: 'Research & Development', description: 'R&D data and experimental feature access' },
  { id: 'legal-dept', name: 'Legal Department', description: 'Legal document management and compliance tracking' },
  { id: 'operations-team', name: 'Operations Team', description: 'Day-to-day operational data and process management' },
  { id: 'training-dev', name: 'Training & Development', description: 'Learning management system and training materials' },
  { id: 'security-team', name: 'Security Team', description: 'Security monitoring and access control management' },
  { id: 'external-consultants', name: 'External Consultants', description: 'Limited access for external consulting partners' },
  { id: 'regional-managers', name: 'Regional Managers', description: 'Regional data access and management capabilities' },
];

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
  const [quickAssignRoles, setQuickAssignRoles] = useState<{ [key: string]: QuickAssignRole }>({
    'Clear Contracts': 'None',
    [ANALYZE_PRODUCT_NAME]: 'None',
    [MRF_SEARCH_PRODUCT_NAME]: 'None',
  });
  const [customizeFeaturesOpen, setCustomizeFeaturesOpen] = useState(false);
  const [customizeFeaturesMemberEmail, setCustomizeFeaturesMemberEmail] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string; description: string } | null>(null);
  const [uiOption, setUiOption] = useState<'option1' | 'option2' | 'option3' | 'option4'>('option1');
  const [overridePermissionsOpen, setOverridePermissionsOpen] = useState(false);
  const [overridePermissionsEnabled, setOverridePermissionsEnabled] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const groupDropdownRef = useRef<HTMLDivElement>(null);
  const groupInputRef = useRef<HTMLInputElement>(null);
  const [groupDropdownPosition, setGroupDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Customize Features state
  const [askTqContract, setAskTqContract] = useState(true);
  const [askTqPayerPolicy, setAskTqPayerPolicy] = useState(true);
  const [documentViewer, setDocumentViewer] = useState(true);
  const [rateSummary, setRateSummary] = useState(true);
  const [scenarioModeling, setScenarioModeling] = useState(true);
  const [analyzeExportRateLimit, setAnalyzeExportRateLimit] = useState('10');
  const [mrfSearchExportData, setMrfSearchExportData] = useState(false);
  const [mrfSearchExportRateLimit, setMrfSearchExportRateLimit] = useState('10');
  
  // Scope state
  type ScopeType = 'Providers' | 'Payers' | 'Payer Networks' | 'States' | 'Contract Types' | 'Plans' | 'Labels' | 'Document Type' | 'Services' | 'Billing Codes';
  interface Scope {
    id: string;
    type: ScopeType;
    tags: string[];
  }
  interface Condition {
    id: string;
    scopes: Scope[];
  }
  const SCOPE_TYPES: ScopeType[] = ['Providers', 'Payers', 'Payer Networks', 'States', 'Contract Types', 'Plans', 'Labels', 'Document Type', 'Services', 'Billing Codes'];
  const [scopeConditions, setScopeConditions] = useState<Condition[]>([]);
  const [addScopePopover, setAddScopePopover] = useState<{ conditionId: string | null; open: boolean } | null>(null);
  const [addTagPopover, setAddTagPopover] = useState<{ conditionId: string; scopeId: string; open: boolean } | null>(null);
  const [scopeSearchValue, setScopeSearchValue] = useState('');
  const [tagSearchValue, setTagSearchValue] = useState('');
  const addScopeRef = useRef<HTMLDivElement>(null);
  const addTagRef = useRef<HTMLDivElement>(null);

  // Compute quick assign roles based on member product roles
  const computeQuickAssignRole = (productKey: 'clearContracts' | 'analyze' | 'mrfSearch'): QuickAssignRole => {
    if (memberProductRoles.length === 0) return 'None';
    
    const firstRole = memberProductRoles[0][productKey];
    const allSame = memberProductRoles.every(member => member[productKey] === firstRole);
    
    return allSame ? firstRole : 'Mixed';
  };

  // Update quick assign roles when member product roles change
  useEffect(() => {
    if (step === 2 && memberProductRoles.length > 0) {
      setQuickAssignRoles({
        'Clear Contracts': computeQuickAssignRole('clearContracts'),
        [ANALYZE_PRODUCT_NAME]: computeQuickAssignRole('analyze'),
        [MRF_SEARCH_PRODUCT_NAME]: computeQuickAssignRole('mrfSearch'),
      });
    }
  }, [memberProductRoles, step]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Filter groups based on search query
  const filteredGroups = availableGroups.filter(group => {
    if (!groupSearchQuery.trim()) return true;
    const searchLower = groupSearchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower)
    );
  });

  // Close group dropdown when clicking outside and update position on scroll/resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(target)) {
        // Check if click is on the dropdown itself
        const dropdown = document.querySelector('[data-group-dropdown]');
        if (dropdown && dropdown.contains(target)) {
          return;
        }
        setGroupDropdownOpen(false);
      }
    };
    
    const updatePosition = () => {
      if (groupDropdownRef.current && groupDropdownOpen) {
        const rect = groupDropdownRef.current.getBoundingClientRect();
        setGroupDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (groupDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      updatePosition();
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [groupDropdownOpen]);

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
      setCustomizeFeaturesOpen(false);
      setCustomizeFeaturesMemberEmail(null);
      setSelectedGroup(null);
      setGroupSearchQuery('');
      setGroupDropdownOpen(false);
      setOverridePermissionsOpen(false);
      setOverridePermissionsEnabled(false);
      setUiOption('option1');
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
    
    // If a group is selected, skip steps 2 and 3 and send invites directly
    if (selectedGroup) {
      // Initialize member product roles with default 'None' for all members
      const defaultRoles: MemberProductRoles[] = emailTags.map(tag => ({
        email: tag.email,
        clearContracts: 'None',
        analyze: 'None',
        mrfSearch: 'None',
      }));
      setMemberProductRoles(defaultRoles);
      
      // Send invites immediately
      handleSendInvitations();
      return;
    }
    
    // If no group selected, proceed to step 2 for role assignment
    // Initialize member product roles if not already set
    if (memberProductRoles.length === 0) {
      const defaultRoles: MemberProductRoles[] = emailTags.map(tag => ({
        email: tag.email,
        clearContracts: 'None',
        analyze: 'None',
        mrfSearch: 'None',
      }));
      setMemberProductRoles(defaultRoles);
    }
    
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
    // Apply the role to all members for this product
    const productKey = product === 'Clear Contracts' ? 'clearContracts' : 
                       product === ANALYZE_PRODUCT_NAME ? 'analyze' : 'mrfSearch';
    
    setMemberProductRoles(prev => 
      prev.map(member => ({
        ...member,
        [productKey]: role
      }))
    );
    // quickAssignRoles will be updated automatically via useEffect
  };

  const handleContinueToReview = () => {
    setStep(3);
  };

  const handleSendInvitations = () => {
    // Handle invite logic here
    console.log('Inviting members with roles:', memberProductRoles);
    console.log('Selected group:', selectedGroup);
    
    // Count different types of members
    const newUsers = emailTags.filter(tag => tag.status === 'new-user');
    const existingUsers = emailTags.filter(tag => tag.status === 'existing-user');
    
    // Build group message if applicable
    const groupMessage = selectedGroup ? ` to ${selectedGroup.name}` : '';
    
    // Show appropriate toast messages
    if (existingUsers.length > 0 && newUsers.length > 0) {
      // Both types
      showToast(
        `${existingUsers.length} existing ${existingUsers.length === 1 ? 'user' : 'users'} added${groupMessage}. ${newUsers.length} invite${newUsers.length === 1 ? '' : 's'} sent${groupMessage}.`
      );
    } else if (existingUsers.length > 0) {
      // Only existing users
      showToast(
        `${existingUsers.length} existing ${existingUsers.length === 1 ? 'user' : 'users'} added${groupMessage}.`
      );
    } else if (newUsers.length > 0) {
      // Only new users
      showToast(
        `${newUsers.length} invite${newUsers.length === 1 ? '' : 's'} sent${groupMessage}.`
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

  // Scope helper functions
  const getScopeOptions = (scopeType: ScopeType): string[] => {
    switch (scopeType) {
      case 'Providers':
        return ['Cherry Creek Health', 'Banner Health', 'CommonSpirit', 'Mayo Health', 'HonorHealth', 'St. Mary\'s Medical Center', 'Regional Health Network', 'Community Care Clinic', 'Metro General Hospital', 'Riverside Medical Group'];
      case 'Payers':
        return ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Humana', 'Anthem', 'Kaiser Permanente', 'Medicaid', 'Medicare', 'Tricare'];
      case 'Payer Networks':
        return ['AL HMO', 'AZ PPO', 'Blue Choice', 'Gold Network', 'Silver Network', 'Platinum Network', 'Basic Network', 'Premium Network', 'Standard Network', 'Elite Network'];
      case 'States':
        return ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
      case 'Contract Types':
        return ['Base Language', 'Amendment', 'Addendum', 'Renewal', 'Termination', 'Modification', 'Original', 'Superseded', 'Active', 'Inactive'];
      case 'Plans':
        return ['Gold', 'Silver', 'Bronze', 'Platinum', 'Basic', 'Premium', 'Standard', 'Elite', 'HMO', 'PPO', 'EPO', 'POS'];
      case 'Labels':
        return ['Active', 'Pending', 'Expired', 'Draft', 'Approved', 'Rejected', 'Under Review', 'Archived', 'Renewal Due', 'Terminated'];
      case 'Document Type':
        return ['Base Language', 'Amendment', 'Addendum', 'Renewal', 'Termination', 'Modification', 'Original Contract', 'Superseded Contract', 'Active Contract', 'Inactive Contract'];
      case 'Services':
        return ['L37829', 'L26734', 'S27783', 'S27784', 'L37830', 'L26735', 'S27785', 'L37831', 'L26736', 'S27786'];
      case 'Billing Codes':
        return ['HCPCS C9741', 'HCPCS C9742', 'APC 62772', 'APC 62773', 'CPT 99213', 'CPT 99214', 'CPT 99215', 'ICD-10 Z00.00', 'ICD-10 Z00.01', 'MS-DRG 001', 'MS-DRG 002', 'MS-DRG 003'];
      default:
        return [];
    }
  };

  const getFilteredOptions = (scopeType: ScopeType, searchValue: string): string[] => {
    const options = getScopeOptions(scopeType);
    if (!searchValue.trim()) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getFilteredScopeTypes = (searchValue: string): ScopeType[] => {
    if (!searchValue.trim()) return SCOPE_TYPES;
    return SCOPE_TYPES.filter(type => 
      type.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Close scope popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addScopeRef.current && !addScopeRef.current.contains(event.target as Node)) {
        setAddScopePopover(null);
        setScopeSearchValue('');
      }
      if (addTagRef.current && !addTagRef.current.contains(event.target as Node)) {
        setAddTagPopover(null);
        setTagSearchValue('');
      }
    };

    if (addScopePopover || addTagPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [addScopePopover, addTagPopover]);

  const addScope = (conditionId: string | null, scopeType: ScopeType) => {
    if (conditionId === null) {
      const newCondition: Condition = {
        id: Date.now().toString(),
        scopes: [{ id: `${Date.now()}-1`, type: scopeType, tags: [] }],
      };
      setScopeConditions([newCondition]);
    } else {
      setScopeConditions(scopeConditions.map(condition => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            scopes: [...condition.scopes, { id: `${conditionId}-${Date.now()}`, type: scopeType, tags: [] }],
          };
        }
        return condition;
      }));
    }
    setAddScopePopover(null);
    setScopeSearchValue('');
  };

  const removeScope = (conditionId: string, scopeId: string) => {
    setScopeConditions(scopeConditions.map(condition => {
      if (condition.id === conditionId) {
        const newScopes = condition.scopes.filter(s => s.id !== scopeId);
        return { ...condition, scopes: newScopes };
      }
      return condition;
    }));
  };

  const findMatchingOption = (scopeType: ScopeType, inputValue: string): string | null => {
    const options = getScopeOptions(scopeType);
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return null;
    
    const normalizedInput = trimmedInput.toLowerCase();
    const exactMatch = options.find(opt => opt.toLowerCase() === normalizedInput);
    if (exactMatch) return exactMatch;
    
    if (normalizedInput.length >= 3) {
      const startsWithMatch = options.find(opt => opt.toLowerCase().startsWith(normalizedInput));
      if (startsWithMatch) return startsWithMatch;
    }
    
    const partialMatch = options.find(opt => {
      const optLower = opt.toLowerCase();
      return optLower.includes(normalizedInput) || normalizedInput.includes(optLower);
    });
    if (partialMatch) return partialMatch;
    
    return trimmedInput;
  };

  const addTagsFromCommaSeparated = (conditionId: string, scopeId: string, inputValue: string) => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    
    const condition = scopeConditions.find(c => c.id === conditionId);
    if (!condition) return;
    
    const scope = condition.scopes.find(s => s.id === scopeId);
    if (!scope) return;
    
    const values = trimmedInput.split(',').map(v => v.trim()).filter(v => v.length > 0);
    const tagsToAdd: string[] = [];
    const existingTagsLower = new Set(scope.tags.map(tag => tag.toLowerCase()));
    
    values.forEach(value => {
      if (!value) return;
      const matchingOption = findMatchingOption(scope.type, value);
      if (matchingOption && matchingOption.trim()) {
        const alreadyExists = existingTagsLower.has(matchingOption.toLowerCase());
        if (!alreadyExists) {
          tagsToAdd.push(matchingOption);
          existingTagsLower.add(matchingOption.toLowerCase());
        }
      }
    });
    
    if (tagsToAdd.length > 0) {
      setScopeConditions(scopeConditions.map(condition => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            scopes: condition.scopes.map(s => {
              if (s.id === scopeId) {
                return { ...s, tags: [...s.tags, ...tagsToAdd] };
              }
              return s;
            }),
          };
        }
        return condition;
      }));
    }
    
    setTagSearchValue('');
  };

  const addTag = (conditionId: string, scopeId: string, tagValue: string) => {
    const condition = scopeConditions.find(c => c.id === conditionId);
    if (!condition) return;
    
    const scope = condition.scopes.find(s => s.id === scopeId);
    if (!scope) return;
    
    const matchingOption = findMatchingOption(scope.type, tagValue);
    if (matchingOption) {
      setScopeConditions(scopeConditions.map(condition => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            scopes: condition.scopes.map(scope => {
              if (scope.id === scopeId) {
                const existingTagsLower = scope.tags.map(t => t.toLowerCase());
                if (existingTagsLower.includes(matchingOption.toLowerCase())) {
                  return scope;
                }
                return { ...scope, tags: [...scope.tags, matchingOption] };
              }
              return scope;
            }),
          };
        }
        return condition;
      }));
    }
    setAddTagPopover(null);
    setTagSearchValue('');
  };

  const removeScopeTag = (conditionId: string, scopeId: string, tagIndex: number) => {
    setScopeConditions(scopeConditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          scopes: condition.scopes.map(scope => {
            if (scope.id === scopeId) {
              const newTags = scope.tags.filter((_, i) => i !== tagIndex);
              return { ...scope, tags: newTags };
            }
            return scope;
          }),
        };
      }
      return condition;
    }));
  };

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
      <div className="bg-white flex flex-col gap-4 items-start overflow-y-auto px-4 py-6 relative flex-1 min-h-0 w-full" style={{ overflowX: 'visible' }}>
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

        {/* Group Selection */}
        <div className="flex flex-col gap-2 items-start relative shrink-0 w-full" style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex gap-1 items-center relative shrink-0">
            <p className="font-normal leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px] whitespace-pre">
              Add to Group <span className="text-[#6e8081]">(Optional)</span>
            </p>
          </div>
          <div ref={groupDropdownRef} className="relative w-full">
            {selectedGroup ? (
              <div className="bg-white border border-[#e3e7ea] rounded flex items-center justify-between px-3 py-2 min-h-[40px]">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#121313] truncate">{selectedGroup.name}</p>
                  <p className="text-[11px] text-[#6e8081] truncate">{selectedGroup.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    setGroupSearchQuery('');
                  }}
                  className="ml-2 w-4 h-4 flex items-center justify-center hover:opacity-70 shrink-0"
                >
                  <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white border border-[#e3e7ea] rounded flex items-center px-3 py-2 min-h-[40px]">
                  <svg className="w-4 h-4 text-[#4b595c] mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={groupInputRef}
                    type="text"
                    value={groupSearchQuery}
                    onChange={(e) => {
                      setGroupSearchQuery(e.target.value);
                      setGroupDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setGroupDropdownOpen(true);
                      if (groupDropdownRef.current) {
                        const rect = groupDropdownRef.current.getBoundingClientRect();
                        setGroupDropdownPosition({
                          top: rect.bottom + 4,
                          left: rect.left,
                          width: rect.width,
                        });
                      }
                    }}
                    placeholder="Search groups..."
                    className="flex-1 text-xs text-[#121313] outline-none bg-transparent placeholder:text-[#89989b]"
                  />
                  <svg className={`w-4 h-4 text-[#4b595c] shrink-0 transition-transform ${groupDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {groupDropdownOpen && filteredGroups.length > 0 && (
                  <div
                    data-group-dropdown
                    className="fixed bg-white border border-[#e3e7ea] rounded shadow-lg z-[9999] max-h-60 overflow-y-auto"
                    style={{
                      top: `${groupDropdownPosition.top}px`,
                      left: `${groupDropdownPosition.left}px`,
                      width: `${groupDropdownPosition.width}px`,
                    }}
                  >
                    {filteredGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setSelectedGroup(group);
                          setGroupSearchQuery('');
                          setGroupDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f0f2f2] border-b border-[#e3e7ea] last:border-b-0"
                      >
                        <p className="text-xs font-medium text-[#121313]">{group.name}</p>
                        <p className="text-[11px] text-[#6e8081] mt-0.5">{group.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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

    const getRoleIcon = (role: RoleOption | 'Mixed') => {
      if (role === 'Mixed') {
        return (
          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
      }
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
            {getRoleIcon(selectedRole)}
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


  const getRoleIcon = (role: RoleOption, size: 'sm' | 'md' = 'md', isSelected: boolean = false, isInButtonGroup: boolean = false) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3 h-3';
    const iconColor = isSelected && isInButtonGroup ? 'text-white' : isSelected ? 'text-[#121313]' : 'text-[#6E8081]';
    
    if (role === 'Admin') {
      return (
        <svg className={`${iconSize} ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    } else if (role === 'Editor') {
      return (
        <svg className={`${iconSize} ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    } else if (role === 'Viewer') {
      return (
        <svg className={`${iconSize} ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    } else { // None
      return (
        <svg className={`${iconSize} ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
    }
  };

  const RolePillDropdown = ({ email, product }: { email: string; product: 'clearContracts' | 'analyze' | 'mrfSearch' }) => {
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

    return (
      <div 
        ref={dropdownRef} 
        className="relative py-3.5 cursor-pointer flex items-center justify-between h-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-[#f0f2f2] flex items-center justify-center px-2 py-0.5 rounded-full">
          <p className="font-medium text-[11px] text-[#121313] leading-4 tracking-[0.11px] whitespace-nowrap">
            {currentRole}
          </p>
        </div>
        <svg className="w-4 h-4 text-[#4b595c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isOpen && (
          <div className="absolute z-50 top-full left-[-8px] right-[-8px] bg-white border border-[#e3e7ea] rounded shadow-lg p-2">
            {ROLE_OPTIONS.map(role => (
              <button
                key={role}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleChange(email, product, role);
                  setIsOpen(false);
                }}
                className="w-full px-2 py-1.5 hover:bg-[#f0f2f2] rounded flex items-center justify-start"
              >
                <div className="bg-[#f0f2f2] flex items-center justify-center px-2 py-0.5 rounded-full">
                  <p className="font-medium text-[11px] text-[#121313] leading-4 tracking-[0.11px] whitespace-nowrap">
                    {role}
                  </p>
                </div>
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

    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 px-3 border border-[#e3e7ea] rounded flex items-center justify-between hover:bg-[#f0f2f2] text-xs text-[#121313]"
        >
          <div className="flex items-center gap-2">
            {getRoleIcon(currentRole, 'md', true)}
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
                {getRoleIcon(role, 'md', role === currentRole)}
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
        <div className="bg-white flex flex-col gap-4 items-start px-4 py-4 relative flex-1 min-h-0 w-full">
          {/* UI Option Selector - Temporary for testing */}
          {selectedGroup && (
            <div className="w-full shrink-0 bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
              <label className="text-xs font-medium text-[#121313] mr-2">UI Option:</label>
              <select 
                value={uiOption} 
                onChange={(e) => setUiOption(e.target.value as 'option1' | 'option2' | 'option3' | 'option4')}
                className="text-xs border border-[#e3e7ea] rounded px-2 py-1"
              >
                <option value="option1">Option 1: Collapsible Section</option>
                <option value="option2">Option 2: Info Banner + De-emphasis</option>
                <option value="option3">Option 3: Advanced Options</option>
                <option value="option4">Option 4: Toggle Override</option>
              </select>
            </div>
          )}

          {/* Option 1: Collapsible "Override Permissions" Section */}
          {selectedGroup && uiOption === 'option1' && (
            <div className="w-full shrink-0">
              <div className="border border-[#e3e7ea] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOverridePermissionsOpen(!overridePermissionsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#f7f8f8] hover:bg-[#f0f2f2]"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-[#121313]">Override Group Permissions</p>
                    <span className="text-[10px] text-[#6e8081] bg-white px-2 py-0.5 rounded">Optional</span>
                    <svg className="w-4 h-4 text-[#6e8081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <svg className={`w-4 h-4 text-[#121313] transition-transform ${overridePermissionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {overridePermissionsOpen && (
                  <div className="px-4 py-3 bg-white border-t border-[#e3e7ea]">
                    <p className="text-[11px] text-[#6e8081] mb-3">
                      Members will inherit permissions from <span className="font-medium text-[#121313]">{selectedGroup.name}</span>. Use these settings to override if needed.
                    </p>
                    <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4">
                      <div className="flex flex-col w-full">
                        <p className="text-xs text-[#6E8081] font-normal mb-3">Quick assign to all members</p>
                        <div className="flex gap-4 mb-4">
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
                        <button 
                          onClick={() => {
                            setCustomizeFeaturesMemberEmail(null);
                            setCustomizeFeaturesOpen(true);
                          }}
                          className="w-full h-8 px-3 py-2 border border-[#e3e7ea] rounded flex items-center justify-center gap-2 bg-white hover:bg-[#f0f2f2]"
                        >
                          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          <p className="text-xs font-medium text-[#121313]">Customize Features</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Option 2: Info Banner + Visual De-emphasis */}
          {selectedGroup && uiOption === 'option2' && (
            <>
              <div className="w-full shrink-0 bg-[#e8f4f5] border border-[#16696d] rounded-lg p-3">
                <div className="flex gap-2 items-start">
                  <svg className="w-4 h-4 text-[#16696d] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-[#16696d]">
                    Members will inherit permissions from <span className="font-medium">{selectedGroup.name}</span>. The settings below are optional and will override group permissions.
                  </p>
                </div>
              </div>
              <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4 w-full shrink-0 opacity-60">
                <div className="flex flex-col w-full">
                  <p className="text-xs text-[#6E8081] font-normal mb-3">Quick assign to all members</p>
                  <div className="flex gap-4 mb-4">
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
                  <button 
                    onClick={() => {
                      setCustomizeFeaturesMemberEmail(null);
                      setCustomizeFeaturesOpen(true);
                    }}
                    className="w-full h-8 px-3 py-2 border border-[#e3e7ea] rounded flex items-center justify-center gap-2 bg-white hover:bg-[#f0f2f2]"
                  >
                    <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <p className="text-xs font-medium text-[#121313]">Customize Features</p>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Option 3: Advanced Options (Collapsible) */}
          {selectedGroup && uiOption === 'option3' && (
            <div className="w-full shrink-0 border border-[#e3e7ea] rounded-lg overflow-hidden">
              <button
                onClick={() => setOverridePermissionsOpen(!overridePermissionsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#f7f8f8] hover:bg-[#f0f2f2]"
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-[#121313]">Advanced Options</p>
                  <span className="text-[10px] text-[#6e8081] bg-white px-2 py-0.5 rounded">Override Permissions</span>
                </div>
                <svg className={`w-4 h-4 text-[#121313] transition-transform ${overridePermissionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {overridePermissionsOpen && (
                <div className="px-4 py-3 bg-white border-t border-[#e3e7ea]">
                  <p className="text-[11px] text-[#6e8081] mb-3">
                    These settings will override the permissions configured for <span className="font-medium text-[#121313]">{selectedGroup.name}</span>.
                  </p>
                  <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4">
                    <div className="flex flex-col w-full">
                      <p className="text-xs text-[#6E8081] font-normal mb-3">Quick assign to all members</p>
                      <div className="flex gap-4 mb-4">
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
                      <button 
                        onClick={() => {
                          setCustomizeFeaturesMemberEmail(null);
                          setCustomizeFeaturesOpen(true);
                        }}
                        className="w-full h-8 px-3 py-2 border border-[#e3e7ea] rounded flex items-center justify-center gap-2 bg-white hover:bg-[#f0f2f2]"
                      >
                        <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <p className="text-xs font-medium text-[#121313]">Customize Features</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Option 4: Toggle Override */}
          {selectedGroup && uiOption === 'option4' && (
            <>
              <div className="w-full shrink-0 bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={overridePermissionsEnabled}
                        onChange={(e) => setOverridePermissionsEnabled(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:bg-[#16696d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                    <p className="text-xs font-medium text-[#121313]">Override group permissions</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#6e8081]">
                  By default, members inherit permissions from <span className="font-medium text-[#121313]">{selectedGroup.name}</span>. Enable this to set custom permissions.
                </p>
              </div>
              {overridePermissionsEnabled && (
                <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4 w-full shrink-0">
                  <div className="flex flex-col w-full">
                    <p className="text-xs text-[#6E8081] font-normal mb-3">Quick assign to all members</p>
                    <div className="flex gap-4 mb-4">
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
                    <button 
                      onClick={() => {
                        setCustomizeFeaturesMemberEmail(null);
                        setCustomizeFeaturesOpen(true);
                      }}
                      className="w-full h-8 px-3 py-2 border border-[#e3e7ea] rounded flex items-center justify-center gap-2 bg-white hover:bg-[#f0f2f2]"
                    >
                      <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <p className="text-xs font-medium text-[#121313]">Customize Features</p>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Original Quick assign section - shown when no group selected */}
          {!selectedGroup && (
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-4 w-full shrink-0">
            <div className="flex flex-col w-full">
              <p className="text-xs text-[#6E8081] font-normal mb-3">Quick assign to all members</p>
              <div className="flex gap-4 mb-4">
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
              <button 
                onClick={() => {
                  setCustomizeFeaturesMemberEmail(null);
                  setCustomizeFeaturesOpen(true);
                }}
                className="w-full h-8 px-3 py-2 border border-[#e3e7ea] rounded flex items-center justify-center gap-2 bg-white hover:bg-[#f0f2f2]"
              >
                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <p className="text-xs font-medium text-[#121313]">Customize Features</p>
              </button>
            </div>
          </div>
          )}

          {/* Search - Fixed */}
          <div className="w-full shrink-0">
            <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded flex items-center h-8 px-3 gap-2">
              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email..."
                className="flex-1 bg-transparent text-xs text-[#121313] outline-none placeholder:text-[#89989b]"
              />
              <div className="bg-white border border-[#e3e7ea] rounded px-1.5 py-0.5">
                <span className="font-medium text-[11px] text-[#4b595c]">/</span>
              </div>
            </div>
          </div>

          {/* Table - Scrollable */}
          <div className="w-full border border-[#e3e7ea] rounded flex-1 min-h-0 overflow-y-auto">
            <div className="grid border-b border-[#e3e7ea] bg-[#f7f8f8]" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
              <div className="pl-3 pr-0 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">Email</p>
              </div>
              <div className="pl-2 pr-2 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">Clear Contracts</p>
              </div>
              <div className="pl-2 pr-2 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">{ANALYZE_PRODUCT_NAME}</p>
              </div>
              <div className="pl-2 pr-2 py-2 border-r border-[#e3e7ea]">
                <p className="text-xs font-medium text-[#121313]">{MRF_SEARCH_PRODUCT_NAME}</p>
              </div>
              <div className="pr-0 py-2 w-8">
                <div className="w-8 invisible pointer-events-none">
                  <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
            </div>
            {filteredMembers.map((member) => (
              <div key={member.email} className="grid border-b border-[#e3e7ea] last:border-b-0" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
                <div className="pl-3 pr-0 py-3.5 min-w-0 overflow-hidden border-r border-[#e3e7ea]">
                  <p className="text-xs text-[#121313] truncate" title={member.email}>{member.email}</p>
                </div>
                <div className="pl-2 pr-2 border-r border-[#e3e7ea] hover:bg-[#f0f2f2]">
                  <RolePillDropdown email={member.email} product="clearContracts" />
                </div>
                <div className="pl-2 pr-2 border-r border-[#e3e7ea] hover:bg-[#f0f2f2]">
                  <RolePillDropdown email={member.email} product="analyze" />
                </div>
                <div className="pl-2 pr-2 border-r border-[#e3e7ea] hover:bg-[#f0f2f2]">
                  <RolePillDropdown email={member.email} product="mrfSearch" />
                </div>
                <div className="pr-0 py-3.5 flex items-center justify-center w-auto">
                  <button 
                    onClick={() => {
                      setCustomizeFeaturesMemberEmail(member.email);
                      setCustomizeFeaturesOpen(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded cursor-pointer group"
                  >
                    <svg className="w-4 h-4 text-[#4b595c] group-hover:text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
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
        <div className="bg-white flex flex-col gap-6 items-start overflow-y-auto px-4 py-4 relative flex-1 min-h-0 w-full">
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

            {/* Group Assignment Card */}
            {selectedGroup && (
              <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg p-3 w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-[#121313]">Group Assignment</p>
                  <p className="text-xs font-medium text-[#121313] mt-1">{selectedGroup.name}</p>
                  <p className="text-[11px] text-[#6e8081] mt-0.5">{selectedGroup.description}</p>
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

  const renderCustomizeFeaturesModal = () => {
    const isQuickAssign = customizeFeaturesMemberEmail === null;
    const headerTitle = isQuickAssign ? 'Customize Features' : customizeFeaturesMemberEmail;
    const headerSubtext = isQuickAssign 
      ? 'Turn on and off featured based on products. These will be applied to all member in the list.'
      : 'Turn on and off featured based on products. These will be applied only to this member.';

    return (
      <>
        {/* Content Container */}
        <div className="bg-white flex flex-col gap-6 items-start overflow-y-auto px-4 py-4 relative flex-1 min-h-0 w-full">
          {/* Header Section */}
          <div className="bg-[#f7f8f8] rounded-lg p-3 w-full">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[#121313]">{headerTitle}</p>
              <p className="text-xs text-[#6e8081]">
                {headerSubtext}
              </p>
            </div>
          </div>

          {/* Clear Contracts Section */}
          <div className="border-b border-[#e3e7ea] flex flex-col gap-6 w-full pb-6">
            <p className="text-sm font-semibold text-[#121313]">Clear Contracts</p>
            <div className="flex flex-col gap-4 pl-4">
              {[
                { label: 'AskTQ Contract', value: askTqContract, setter: setAskTqContract },
                { label: 'Ask TQ Payer Policy', value: askTqPayerPolicy, setter: setAskTqPayerPolicy },
                { label: 'Document Viewer', value: documentViewer, setter: setDocumentViewer },
                { label: 'Rate Summary', value: rateSummary, setter: setRateSummary },
                { label: 'Scenario Modeling', value: scenarioModeling, setter: setScenarioModeling },
              ].map((toggle) => (
                <div key={toggle.label} className="flex items-center justify-between w-full">
                  <p className="text-xs font-medium text-[#121313] flex-1">{toggle.label}</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={toggle.value}
                      onChange={(e) => toggle.setter(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-[#e3e7ea] peer-focus:outline-none rounded-full peer peer-checked:bg-[#16696d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Scope Section */}
          <div className="flex flex-col gap-6 w-full">
            <p className="text-sm font-semibold text-[#121313]">Scope</p>
            {scopeConditions.length === 0 ? (
              <div className="border border-[#e3e7ea] rounded-lg flex flex-col items-start relative shrink-0 w-full">
                <div className="relative w-full flex justify-center">
                  <button
                    onClick={() => setAddScopePopover({ conditionId: null, open: true })}
                    className="flex flex-col h-8 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]"
                  >
                    <div className="box-border flex gap-4 items-center justify-center px-3 py-0 relative shrink-0 w-full">
                      <div className="flex gap-2 grow items-center">
                        <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
                          Add Scope
                        </p>
                      </div>
                      <div className="flex-none rotate-90">
                        <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {addScopePopover?.conditionId === null && addScopePopover?.open && (
                    <div 
                      ref={addScopeRef}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                    >
                      <div className="border-b border-[#e3e7ea] pb-3 mb-0">
                        <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                          <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={scopeSearchValue}
                            onChange={(e) => setScopeSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setAddScopePopover(null);
                                setScopeSearchValue('');
                              }
                            }}
                            placeholder="Search"
                            className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                        {getFilteredScopeTypes(scopeSearchValue).map((type) => (
                          <button
                            key={type}
                            onClick={() => addScope(null, type)}
                            className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                          >
                            <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                              {type}
                            </p>
                          </button>
                        ))}
                        {getFilteredScopeTypes(scopeSearchValue).length === 0 && (
                          <div className="w-full p-2 text-center">
                            <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              scopeConditions.map((condition) => (
                <div key={condition.id} className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                  <div className="border border-[#e3e7ea] rounded-lg flex flex-col items-start relative shrink-0 w-full">
                    {condition.scopes.map((scope) => (
                      <div key={scope.id} className="flex gap-2 items-start relative shrink-0 w-full">
                        <div className="border-b border-[#e3e7ea] flex gap-3 items-start p-3 relative shrink-0 w-full">
                          <div className="flex gap-1 items-start px-0.5 py-1 rounded shrink-0 w-[200px]">
                            <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px] whitespace-pre">
                              {scope.type}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 grow items-start px-0.5 py-1 relative min-h-[24px]">
                            {scope.tags.map((tag, tagIndex) => (
                              <div key={tagIndex} className="bg-[#e8ebeb] flex gap-1 h-5 items-center justify-center px-2 py-0.5 rounded shrink-0">
                                <p className="font-medium leading-4 relative shrink-0 text-[11px] text-[#121313] tracking-[0.11px] whitespace-pre">
                                  {tag}
                                </p>
                                <button 
                                  onClick={() => removeScopeTag(condition.id, scope.id, tagIndex)}
                                  className="w-3 h-3 flex items-center justify-center hover:bg-[#d2d8dc] rounded"
                                >
                                  <svg className="w-3 h-3 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            <div className="relative">
                              <button 
                                onClick={() => setAddTagPopover({ conditionId: condition.id, scopeId: scope.id, open: true })}
                                className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded"
                              >
                                <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              {addTagPopover?.conditionId === condition.id && addTagPopover?.scopeId === scope.id && addTagPopover?.open && (
                                <div 
                                  ref={addTagRef}
                                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                                >
                                  <div className="border-b border-[#e3e7ea] pb-3 mb-0">
                                    <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                                      <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      <input
                                        type="text"
                                        value={tagSearchValue}
                                        onChange={(e) => setTagSearchValue(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setAddTagPopover(null);
                                            setTagSearchValue('');
                                          } else if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const inputValue = tagSearchValue.trim();
                                            if (!inputValue) return;
                                            if (inputValue.includes(',')) {
                                              addTagsFromCommaSeparated(condition.id, scope.id, inputValue);
                                            } else {
                                              const matchingOption = findMatchingOption(scope.type, inputValue);
                                              if (matchingOption) {
                                                addTag(condition.id, scope.id, matchingOption);
                                              }
                                            }
                                          }
                                        }}
                                        placeholder="Search or paste comma-separated values"
                                        className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                                        autoFocus
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                                    {getFilteredOptions(scope.type, tagSearchValue)
                                      .filter(option => {
                                        const existingTagsLower = scope.tags.map(t => t.toLowerCase());
                                        return !existingTagsLower.includes(option.toLowerCase());
                                      })
                                      .map((option) => (
                                        <button
                                          key={option}
                                          onClick={() => addTag(condition.id, scope.id, option)}
                                          className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                                        >
                                          <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                                            {option}
                                          </p>
                                        </button>
                                      ))}
                                    {getFilteredOptions(scope.type, tagSearchValue).filter(option => {
                                      const existingTagsLower = scope.tags.map(t => t.toLowerCase());
                                      return !existingTagsLower.includes(option.toLowerCase());
                                    }).length === 0 && (
                                      <div className="w-full p-2 text-center">
                                        <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeScope(condition.id, scope.id)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-[#f0f2f2] rounded shrink-0"
                        >
                          <svg className="w-4 h-4 text-[#89989b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="relative w-full flex justify-center">
                      <button
                        onClick={() => setAddScopePopover({ conditionId: condition.id, open: true })}
                        className="flex flex-col h-8 items-start justify-center overflow-clip relative shrink-0 w-full cursor-pointer hover:bg-[#f7f8f8]"
                      >
                        <div className="box-border flex gap-4 items-center justify-center px-3 py-0 relative shrink-0 w-full">
                          <div className="flex gap-2 grow items-center">
                            <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs tracking-[0.12px]">
                              Add Scope
                            </p>
                          </div>
                          <div className="flex-none rotate-90">
                            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      {addScopePopover?.conditionId === condition.id && addScopePopover?.open && (
                        <div 
                          ref={addScopeRef}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#e3e7ea] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)] p-2 z-50 min-w-[224px]"
                        >
                          <div className="border-b border-[#e3e7ea] pb-3 mb-0">
                            <div className="bg-[#f7f8f8] border border-[#e3e7ea] rounded-lg flex gap-1 h-8 items-center px-3 py-2 relative shrink-0 w-full">
                              <svg className="w-4 h-4 text-[#4b595c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input
                                type="text"
                                value={scopeSearchValue}
                                onChange={(e) => setScopeSearchValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setAddScopePopover(null);
                                    setScopeSearchValue('');
                                  }
                                }}
                                placeholder="Search"
                                className="flex-1 bg-transparent font-normal leading-4 text-xs text-[#121313] placeholder:text-[#89989b] tracking-[0.12px] outline-none border-none"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-[2px] items-start relative shrink-0 max-h-[200px] overflow-y-auto mt-3">
                            {getFilteredScopeTypes(scopeSearchValue).map((type) => (
                              <button
                                key={type}
                                onClick={() => addScope(condition.id, type)}
                                className="w-full flex gap-2 items-center p-2 rounded hover:bg-[#f0f2f2] text-left"
                              >
                                <p className="font-normal leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px]">
                                  {type}
                                </p>
                              </button>
                            ))}
                            {getFilteredScopeTypes(scopeSearchValue).length === 0 && (
                              <div className="w-full p-2 text-center">
                                <p className="font-normal text-xs text-[#6e8081]">No options found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-[#e3e7ea] flex items-center justify-between px-4 py-3 relative shrink-0 w-full">
          <button
            onClick={() => {
              setCustomizeFeaturesOpen(false);
              setCustomizeFeaturesMemberEmail(null);
              setScopeConditions([]);
              setAddScopePopover(null);
              setAddTagPopover(null);
              setScopeSearchValue('');
              setTagSearchValue('');
            }}
            className="flex gap-1 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 hover:bg-[#f0f2f2]"
          >
            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <p className="font-medium leading-4 relative shrink-0 text-[#121313] text-xs text-center tracking-[0.12px] whitespace-pre">
              Back
            </p>
          </button>
          <button
            onClick={() => {
              setCustomizeFeaturesOpen(false);
              setCustomizeFeaturesMemberEmail(null);
              setScopeConditions([]);
              setAddScopePopover(null);
              setAddTagPopover(null);
              setScopeSearchValue('');
              setTagSearchValue('');
            }}
            className="flex gap-2 h-8 items-center justify-center px-3 py-2 relative rounded shrink-0 bg-[#16696d] text-white hover:bg-[#0d5256]"
          >
            <p className="font-medium leading-4 relative shrink-0 text-xs text-center tracking-[0.12px] whitespace-pre">
              Save
            </p>
          </button>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  if (customizeFeaturesOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={() => {
        setCustomizeFeaturesOpen(false);
        setCustomizeFeaturesMemberEmail(null);
      }} style={{ paddingTop: '136px' }}>
        <div className="bg-white rounded-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] w-[600px] max-h-[calc(100vh-176px)] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {renderCustomizeFeaturesModal()}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[100]" onClick={onClose} style={{ paddingTop: '136px' }}>
      <div className="bg-white rounded-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] w-[600px] max-h-[calc(100vh-176px)] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
      </div>
    </div>
  );
}

