import {
  User,
  Organization,
  Lead,
  Property,
  Conversation,
  Appointment,
  ApprovalItem,
  AutomationWorkflow,
  DocumentItem,
  IntegrationItem,
  AuditLogEntry
} from '../types';

export const currentUser: User = {
  id: 'u-101',
  name: 'Tariq Mahmood',
  email: 'tariq.mahmood@estateflow.ai',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  organizationId: 'org-pak-01',
  organizationName: 'Zameen Choice Real Estate'
};

export const currentOrganization: Organization = {
  id: 'org-pak-01',
  name: 'Zameen Choice Real Estate',
  type: 'residential_sales',
  primaryLanguage: 'en_ur',
  country: 'Pakistan',
  memberCount: 14
};

export const mockProperties: Property[] = [
  {
    id: 'prop-lah-01',
    title: 'Modern 3-Bedroom Luxury Apartment',
    description: 'Corner 3-bedroom apartment with panoramic skyline views, modern kitchen fittings, 24/7 power backup, and basement parking.',
    price: 24500000, // 24.5 Million PKR
    location: 'Gulberg III, Near MM Alam Road',
    city: 'Lahore',
    area: 'Gulberg III',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqft: 1850,
    status: 'available',
    verifiedTimestamp: '2026-09-20 09:30 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Elevator', '24/7 Security', 'Power Backup Generator', 'Covered Parking', 'Gymnasium', 'Near Top Schools'],
    floorPlanUrl: '/floorplans/gulberg_3bed.pdf',
    viewingSlots: [
      { date: '2026-09-21', time: '11:00 AM', available: true },
      { date: '2026-09-21', time: '03:30 PM', available: true },
      { date: '2026-09-22', time: '02:00 PM', available: true }
    ],
    relatedLeadCount: 18,
    featured: true,
    ownerAgent: 'Zainab Ahmed'
  },
  {
    id: 'prop-lah-02',
    title: '1 Kanal Brand New Designer House',
    description: 'Architecturally designed double-story house in Phase 6 DHA, featuring imported marble flooring, 5 master beds, swimming pool provision, and lush green garden.',
    price: 88000000, // 88 Million PKR
    location: 'Phase 6, DHA',
    city: 'Lahore',
    area: 'DHA Phase 6',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 4500,
    status: 'available',
    verifiedTimestamp: '2026-09-19 04:15 PM',
    dataSource: 'Document Import',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Lush Garden', 'Servant Quarters', 'Solar Panel System', 'CCTV Security', 'Designer Bathrooms'],
    viewingSlots: [
      { date: '2026-09-21', time: '04:00 PM', available: true },
      { date: '2026-09-22', time: '11:30 AM', available: true }
    ],
    relatedLeadCount: 12,
    featured: true,
    ownerAgent: 'Hamza Malik'
  },
  {
    id: 'prop-isb-01',
    title: 'Executive Office Suite in Blue Area',
    description: 'Fully furnished commercial office space in prime Blue Area Islamabad with high-speed elevator access, fiber internet, and executive meeting room.',
    price: 38000000, // 38 Million PKR
    location: 'Blue Area, Near Metro Station',
    city: 'Islamabad',
    area: 'Blue Area',
    propertyType: 'commercial_office',
    bedrooms: 0,
    bathrooms: 2,
    sizeSqft: 2100,
    status: 'available',
    verifiedTimestamp: '2026-09-20 08:00 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Central Air Conditioning', 'High Speed Elevators', 'CCTV Monitoring', 'Fire Safety System', 'Valet Parking'],
    viewingSlots: [
      { date: '2026-09-21', time: '10:00 AM', available: true }
    ],
    relatedLeadCount: 7,
    ownerAgent: 'Ayesha Khan'
  },
  {
    id: 'prop-khi-01',
    title: 'Sea Facing 4-Bed Flat in Clifton Block 4',
    description: 'Spacious sea-view apartment with large balcony, renovated interiors, dedicated water filtration plant, and secure complex entry.',
    price: 49000000, // 49 Million PKR
    location: 'Block 4, Clifton',
    city: 'Karachi',
    area: 'Clifton',
    propertyType: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 2800,
    status: 'pending',
    verifiedTimestamp: '2026-09-18 06:45 PM',
    dataSource: 'Portal Feed',
    availabilityConfirmed: false,
    documentIndexingStatus: 'needs_review',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Sea View', 'Balcony', 'RO Water Plant', '2 Reserved Parking Bays'],
    viewingSlots: [],
    relatedLeadCount: 9,
    ownerAgent: 'Usman Chaudhry'
  },
  {
    id: 'prop-lah-03',
    title: '10 Marla Mediterranean Villa in Bahria Town',
    description: 'Beautiful 10 Marla Spanish elevation house in Sector C Bahria Town, near commercial hub and Grand Mosque.',
    price: 36000000,
    location: 'Sector C, Bahria Town',
    city: 'Lahore',
    area: 'Bahria Town',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 3100,
    status: 'available',
    verifiedTimestamp: '2026-09-20 10:00 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Gated Community', '24/7 Security Patrol', 'Near Grand Mosque', 'Parks & Playgrounds'],
    viewingSlots: [
      { date: '2026-09-22', time: '04:00 PM', available: true }
    ],
    relatedLeadCount: 14,
    ownerAgent: 'Hamza Malik'
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'Muhammad Bilal Khan',
    phone: '+92 300 8472910',
    email: 'bilal.khan@gmail.com',
    source: 'WhatsApp Business',
    channel: 'whatsapp',
    score: 85,
    temperature: 'hot',
    intent: 'Urgent Buy - 3-Bed Apartment',
    budget: 25000000,
    preferredLocation: 'Gulberg III / Johar Town',
    city: 'Lahore',
    status: 'viewing_scheduled',
    assignedAgent: 'Zainab Ahmed',
    assignedAgentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    lastActivity: '12 mins ago',
    createdDate: '2026-09-19',
    language: 'ur',
    tags: ['Hot Lead', 'Urdu Speaker', 'Bank Approved Loan', 'Viewing Pending'],
    scoreBreakdown: [
      { label: 'Explicit Viewing Request', points: 30 },
      { label: 'Confirmed Budget (25M PKR)', points: 20 },
      { label: 'Exact Location Match Found', points: 20 },
      { label: 'Responded in under 5 mins', points: 15 }
    ],
    slaCountdownMinutes: 18,
    aiSummary: 'Customer submitted WhatsApp message in Urdu asking for a 3-bedroom apartment in Lahore under PKR 25 Million. Matched prop-lah-01 in Gulberg III. Customer agreed to viewing tomorrow at 11:00 AM.',
    matchedPropertyIds: ['prop-lah-01', 'prop-lah-03'],
    notes: [
      'Buyer prefers ready-to-move-in condition with elevator.',
      'Bank financing already pre-approved by HBL.'
    ],
    tasks: [
      { id: 't-1', title: 'Confirm viewing arrival with Mr. Bilal', dueDate: 'Today, 5:00 PM', completed: false, assignedTo: 'Zainab Ahmed' },
      { id: 't-2', title: 'Send property brochure via WhatsApp', dueDate: 'Completed', completed: true, assignedTo: 'AI Assistant' }
    ]
  },
  {
    id: 'lead-002',
    name: 'Dr. Sarah Farooq',
    phone: '+92 321 4920192',
    email: 'dr.sarah.f@health.gov.pk',
    source: 'Website Inquiry Form',
    channel: 'website',
    score: 72,
    temperature: 'warm',
    intent: 'Luxury House Purchase',
    budget: 90000000,
    preferredLocation: 'DHA Phase 5 / Phase 6',
    city: 'Lahore',
    status: 'qualified',
    assignedAgent: 'Hamza Malik',
    assignedAgentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastActivity: '1 hour ago',
    createdDate: '2026-09-18',
    language: 'en',
    tags: ['Doctor', 'DHA Purchaser', 'High Net Worth'],
    scoreBreakdown: [
      { label: 'High Budget (>80M PKR)', points: 25 },
      { label: 'Verified Email & Contact', points: 20 },
      { label: 'Downloaded Floor Plan PDF', points: 15 },
      { label: 'Active Engagement', points: 12 }
    ],
    slaCountdownMinutes: 45,
    aiSummary: 'Dr. Sarah inquired about 1 Kanal houses in DHA Phase 6. Matched designer house prop-lah-02. She requested floor plan details and security specifications.',
    matchedPropertyIds: ['prop-lah-02'],
    notes: [
      'Wants minimum 5 beds with lawn.',
      'Husband works in overseas UK.'
    ],
    tasks: [
      { id: 't-3', title: 'Call Dr. Sarah to discuss DHA Phase 6 plot option', dueDate: 'Tomorrow, 11:00 AM', completed: false, assignedTo: 'Hamza Malik' }
    ]
  },
  {
    id: 'lead-003',
    name: 'Kamran & Sons Logistics (Represented by Omer Kamran)',
    phone: '+92 333 5192830',
    email: 'omer@kamranlogistics.com',
    source: 'Facebook Ad Campaign',
    channel: 'facebook',
    score: 64,
    temperature: 'warm',
    intent: 'Commercial Office Space Rent/Buy',
    budget: 40000000,
    preferredLocation: 'Blue Area / F-8',
    city: 'Islamabad',
    status: 'contacted',
    assignedAgent: 'Ayesha Khan',
    lastActivity: '3 hours ago',
    createdDate: '2026-09-20',
    language: 'en',
    tags: ['Commercial', 'Corporate Buyer', 'Islamabad'],
    scoreBreakdown: [
      { label: 'Corporate Entity', points: 20 },
      { label: 'Budget Provided (40M PKR)', points: 20 },
      { label: 'Responded to Form', points: 14 },
      { label: 'Pending Viewing Request', points: 10 }
    ],
    slaCountdownMinutes: 120,
    aiSummary: 'Omer Kamran wants a 2000+ sqft commercial office in Islamabad for a branch office. AI suggested prop-isb-01 in Blue Area.',
    matchedPropertyIds: ['prop-isb-01'],
    notes: ['Requires minimum 2 dedicated basement parking slots.'],
    tasks: []
  },
  {
    id: 'lead-004',
    name: 'Mrs. Shabana Yasmeen',
    phone: '+92 301 9283741',
    email: 'shabana.y@yahoo.com',
    source: 'Property Portal Zameen',
    channel: 'portal',
    score: 92,
    temperature: 'hot',
    intent: 'Family Villa in Bahria Town',
    budget: 35000000,
    preferredLocation: 'Sector C, Bahria Town',
    city: 'Lahore',
    status: 'negotiation',
    assignedAgent: 'Hamza Malik',
    lastActivity: '25 mins ago',
    createdDate: '2026-09-15',
    language: 'ur',
    tags: ['Negotiation Stage', 'High Priority', 'Cash Buyer'],
    scoreBreakdown: [
      { label: 'Offer Made', points: 35 },
      { label: 'Viewing Completed', points: 25 },
      { label: 'Immediate Cash Availability', points: 20 },
      { label: 'Daily Inquiry Follow-up', points: 12 }
    ],
    slaCountdownMinutes: 10,
    aiSummary: 'Mrs. Shabana inspected prop-lah-03 in Bahria Town Sector C and submitted a cash offer of PKR 34.5 Million. Pending approval from agency director.',
    matchedPropertyIds: ['prop-lah-03'],
    notes: ['Seller requested 35.5M final. Agent bridging gap.'],
    tasks: [
      { id: 't-4', title: 'Prepare Token Money agreement document', dueDate: 'Today, 6:00 PM', completed: false, assignedTo: 'Hamza Malik' }
    ]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    leadId: 'lead-001',
    customerName: 'Muhammad Bilal Khan',
    customerPhone: '+92 300 8472910',
    channel: 'whatsapp',
    status: 'needs_approval',
    priority: 'high',
    unreadCount: 1,
    assignedAgent: 'Zainab Ahmed',
    isAiActive: true,
    requiresApproval: true,
    lastMessage: 'جی میں کل صبح 11 بجے گلبرگ والے اپارٹمنٹ کے دورے کے لیے دستیاب ہوں۔ کیا کوئی نمائندہ ہوگا؟',
    lastMessageTime: '10:14 AM',
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        senderName: 'Muhammad Bilal Khan',
        text: 'السلام علیکم! مجھے لاہور میں 3 بیڈ روم کا اپارٹمنٹ چاہیے، بجٹ 25 ملین روپے تک ہے۔',
        timestamp: '10:02 AM',
        deliveryStatus: 'read',
        translation: {
          lang: 'en',
          text: 'Assalam-o-Alaikum! I need a 3-bedroom apartment in Lahore, budget up to PKR 25 Million.'
        }
      },
      {
        id: 'm-2',
        sender: 'ai',
        senderName: 'EstateFlow AI',
        text: 'وعلیکم السلام جناب بلال صاحب! ہمارے پاس گلبرگ III میں ایک بہترین 3 بیڈ روم لگژری اپارٹمنٹ (روپے 24.5 ملین) دستیاب ہے جس میں 24 گھنٹے بجلی کا بیک اپ اور پارکنگ شامل ہے۔',
        timestamp: '10:03 AM',
        confidenceScore: 0.96,
        citations: [
          {
            propertyId: 'prop-lah-01',
            propertyTitle: 'Modern 3-Bedroom Luxury Apartment',
            factType: 'price',
            excerpt: 'PKR 24,500,000 | 3 Beds | Gulberg III',
            verifiedTime: '2026-09-20 09:30 AM'
          }
        ],
        translation: {
          lang: 'en',
          text: 'Walaikum Assalam Mr. Bilal! We have an excellent 3-bedroom luxury apartment in Gulberg III (PKR 24.5 Million) available with 24/7 power backup and basement parking.'
        }
      },
      {
        id: 'm-3',
        sender: 'customer',
        senderName: 'Muhammad Bilal Khan',
        text: 'جی میں کل صبح 11 بجے گلبرگ والے اپارٹمنٹ کے دورے کے لیے دستیاب ہوں۔ کیا کوئی نمائندہ ہوگا؟',
        timestamp: '10:14 AM',
        deliveryStatus: 'delivered',
        translation: {
          lang: 'en',
          text: 'Yes, I am available tomorrow at 11:00 AM for viewing the Gulberg apartment. Will an agent be present?'
        }
      },
      {
        id: 'm-4',
        sender: 'ai',
        senderName: 'EstateFlow AI (Draft)',
        text: 'بالکل بلال صاحب! میں نے زینب احمد صاحبہ کے ساتھ آپ کا دورہ کل صبح 11:00 بجے طے کر دیا ہے۔ کیا آپ کو لوکیشن بھیج دوں؟',
        timestamp: '10:15 AM',
        isDraft: true,
        needsApproval: true,
        confidenceScore: 0.92,
        translation: {
          lang: 'en',
          text: 'Absolutely Mr. Bilal! I have scheduled your viewing with Ms. Zainab Ahmed tomorrow at 11:00 AM. Should I send you the location pin?'
        }
      }
    ],
    handoffReason: 'AI action requires human confirmation before booking appointment calendar and sending WhatsApp confirmation pin.'
  },
  {
    id: 'conv-002',
    leadId: 'lead-002',
    customerName: 'Dr. Sarah Farooq',
    customerPhone: '+92 321 4920192',
    channel: 'website',
    status: 'waiting_for_human',
    priority: 'high',
    unreadCount: 2,
    assignedAgent: 'Hamza Malik',
    isAiActive: false,
    requiresApproval: false,
    lastMessage: 'Could you confirm if the DHA Phase 6 house seller is open to a 3-month payment plan?',
    lastMessageTime: '09:45 AM',
    messages: [
      {
        id: 'm-20',
        sender: 'customer',
        senderName: 'Dr. Sarah Farooq',
        text: 'I inspected the listing details for the DHA Phase 6 Designer House.',
        timestamp: '09:30 AM'
      },
      {
        id: 'm-21',
        sender: 'customer',
        senderName: 'Dr. Sarah Farooq',
        text: 'Could you confirm if the DHA Phase 6 house seller is open to a 3-month payment plan?',
        timestamp: '09:45 AM'
      }
    ],
    handoffReason: 'Customer requested custom payment terms not found in verified database. AI automatically transferred to assigned agent Hamza Malik.',
    handoffTimestamp: '09:46 AM'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'app-101',
    leadId: 'lead-001',
    customerName: 'Muhammad Bilal Khan',
    customerPhone: '+92 300 8472910',
    propertyId: 'prop-lah-01',
    propertyTitle: 'Modern 3-Bedroom Luxury Apartment',
    propertyLocation: 'Gulberg III, Lahore',
    agentId: 'u-102',
    agentName: 'Zainab Ahmed',
    date: '2026-09-21',
    time: '11:00 AM',
    status: 'pending_approval',
    channel: 'whatsapp',
    customerTimezone: 'Asia/Karachi (PKT)',
    notes: 'Customer requested on-site meeting to inspect parking and power generator specs.'
  },
  {
    id: 'app-102',
    leadId: 'lead-002',
    customerName: 'Dr. Sarah Farooq',
    customerPhone: '+92 321 4920192',
    propertyId: 'prop-lah-02',
    propertyTitle: '1 Kanal Brand New Designer House',
    propertyLocation: 'Phase 6 DHA, Lahore',
    agentId: 'u-103',
    agentName: 'Hamza Malik',
    date: '2026-09-21',
    time: '04:00 PM',
    status: 'confirmed',
    channel: 'website',
    customerTimezone: 'Asia/Karachi (PKT)',
    notes: 'Google Calendar invitation synced.'
  },
  {
    id: 'app-103',
    leadId: 'lead-003',
    customerName: 'Omer Kamran (Kamran Logistics)',
    customerPhone: '+92 333 5192830',
    propertyId: 'prop-isb-01',
    propertyTitle: 'Executive Office Suite in Blue Area',
    propertyLocation: 'Blue Area, Islamabad',
    agentId: 'u-104',
    agentName: 'Ayesha Khan',
    date: '2026-09-22',
    time: '02:30 PM',
    status: 'confirmed',
    channel: 'facebook',
    customerTimezone: 'Asia/Karachi (PKT)',
    notes: 'Commercial space inspection with company engineers.'
  }
];

export const mockApprovals: ApprovalItem[] = [
  {
    id: 'appr-301',
    actionType: 'schedule_appointment',
    customerName: 'Muhammad Bilal Khan',
    leadId: 'lead-001',
    proposedMessage: 'السلام علیکم بلال صاحب! آپ کی فرمائش پر 21 ستمبر صبح 11:00 بجے گلبرگ III اپارٹمنٹ کی وزٹ بک کر دی گئی ہے۔ لوکیشن پن منسلک ہے۔',
    proposedArgs: {
      propertyId: 'prop-lah-01',
      date: '2026-09-21',
      time: '11:00 AM',
      agent: 'Zainab Ahmed',
      calendarSync: true
    },
    riskLevel: 'medium',
    sourceEvidence: 'Verified prop-lah-01 availability for 2026-09-21 11:00 AM from CRM database.',
    requestedByAi: true,
    createdTime: '10:15 AM',
    expirySeconds: 900, // 15 mins
    status: 'pending'
  },
  {
    id: 'appr-302',
    actionType: 'send_whatsapp',
    customerName: 'Mrs. Shabana Yasmeen',
    leadId: 'lead-004',
    proposedMessage: 'Dear Mrs. Shabana, the seller of the Bahria Town Villa has agreed to lower the price to PKR 35.0 Million for a quick closing. Would you like to proceed with token money?',
    proposedArgs: {
      recipient: '+92 301 9283741',
      negotiatedPricePKR: 35000000
    },
    riskLevel: 'high',
    sourceEvidence: 'Manual note entered by Agent Hamza Malik on 2026-09-20 09:15 AM.',
    requestedByAi: true,
    createdTime: '09:40 AM',
    expirySeconds: 3600,
    status: 'pending'
  }
];

export const mockAutomations: AutomationWorkflow[] = [
  {
    id: 'wf-01',
    name: 'New WhatsApp Lead → AI Qualification → CRM Entry',
    trigger: 'Incoming WhatsApp Message',
    appsUsed: ['WhatsApp Business', 'EstateFlow AI', 'Google Calendar', 'CRM Sync'],
    status: 'active',
    lastRun: '10 mins ago',
    successRate: 98.4,
    owner: 'Tariq Mahmood',
    executionHistory: [
      {
        stepName: 'Receive WhatsApp Payload',
        status: 'success',
        timestamp: '10:02 AM',
        inputSummary: 'Message from +923008472910: "3 bed apartment in Lahore under 25M"',
        outputSummary: 'Payload validated & normalized.'
      },
      {
        stepName: 'AI Intent & Property Extraction',
        status: 'success',
        timestamp: '10:02 AM',
        inputSummary: 'Text classification via GPT-4o fine-tuned',
        outputSummary: 'Extracted: City=Lahore, Beds=3, Budget=25,000,000 PKR, Type=apartment'
      },
      {
        stepName: 'RAG Property Search in Vector DB',
        status: 'success',
        timestamp: '10:03 AM',
        inputSummary: 'Vector query: 3bed apartment Gulberg/Johar Town <25M PKR',
        outputSummary: 'Matched 2 verified listings: prop-lah-01 (Gulberg III), prop-lah-03 (Bahria Town)'
      },
      {
        stepName: 'Generate Urdu Response & Require Approval for Appointment',
        status: 'success',
        timestamp: '10:15 AM',
        inputSummary: 'Customer requested viewing at 11am tomorrow',
        outputSummary: 'Draft generated and placed in Approvals Queue ID: appr-301'
      }
    ]
  },
  {
    id: 'wf-02',
    name: 'Website Inquiry → Smart Lead Routing to Local Agent',
    trigger: 'Web Form Submission',
    appsUsed: ['HubSpot CRM', 'EstateFlow AI', 'Gmail API'],
    status: 'active',
    lastRun: '1 hour ago',
    successRate: 100.0,
    owner: 'Zainab Ahmed',
    executionHistory: [
      {
        stepName: 'Form Validation',
        status: 'success',
        timestamp: '09:30 AM',
        inputSummary: 'Inquiry from Dr. Sarah Farooq for DHA Phase 6',
        outputSummary: 'Lead created ID: lead-002'
      }
    ]
  },
  {
    id: 'wf-03',
    name: 'Stale Property Data Availability Re-Verification Cron',
    trigger: 'Scheduled (Daily at 8:00 AM)',
    appsUsed: ['Property Database', 'Pinecone Vector DB', 'WhatsApp Notification'],
    status: 'failed',
    lastRun: 'Yesterday at 08:00 AM',
    successRate: 85.0,
    owner: 'System Auto',
    executionHistory: [
      {
        stepName: 'Fetch Listings Unverified > 48 hours',
        status: 'failed',
        timestamp: 'Yesterday 08:00 AM',
        inputSummary: 'Query database for unverified listings',
        outputSummary: 'Failed to connect to external Portal Sync API endpoint timeout (504 Gateway Timeout)',
        errorDetails: 'API response 504: External zameen portal bridge timeout after 30000ms.'
      }
    ]
  }
];

export const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-001',
    name: 'Gulberg_Luxury_Apartments_Brochure_2026.pdf',
    associatedPropertyId: 'prop-lah-01',
    associatedPropertyTitle: 'Modern 3-Bedroom Luxury Apartment',
    fileType: 'pdf',
    pages: 12,
    uploadedBy: 'Zainab Ahmed',
    uploadedDate: '2026-09-15',
    indexStatus: 'indexed',
    lastIndexed: '2026-09-15 02:00 PM',
    extractedTextPreview: 'Project specifications: 3 Bedrooms, 1850 SqFt, 100% standby generator for full load including air conditioners. Quarterly maintenance PKR 15,000...'
  },
  {
    id: 'doc-002',
    name: 'DHA_Phase6_House_Architectural_FloorPlan.pdf',
    associatedPropertyId: 'prop-lah-02',
    associatedPropertyTitle: '1 Kanal Brand New Designer House',
    fileType: 'pdf',
    pages: 6,
    uploadedBy: 'Hamza Malik',
    uploadedDate: '2026-09-18',
    indexStatus: 'indexed',
    lastIndexed: '2026-09-18 05:30 PM',
    extractedTextPreview: 'Ground Floor: Master Suite 1 (20x18), Drawing Room, Dining, Kitchen, Swimming Pool Provision. First Floor: 4 Master Suites...'
  },
  {
    id: 'doc-003',
    name: 'BlueArea_Commercial_Office_LeaseAgreement_Draft.docx',
    associatedPropertyId: 'prop-isb-01',
    associatedPropertyTitle: 'Executive Office Suite in Blue Area',
    fileType: 'docx',
    pages: 8,
    uploadedBy: 'Ayesha Khan',
    uploadedDate: '2026-09-19',
    indexStatus: 'needs_review',
    lastIndexed: '2026-09-19 11:20 AM',
    extractionWarnings: ['Contains conditional rent escalator clauses requiring manual verification by agency lawyer.'],
    extractedTextPreview: 'Lease Term: 3 Years renewable. Annual rent increment: 10%. Security deposit: 6 months advance...'
  }
];

export const mockIntegrations: IntegrationItem[] = [
  {
    id: 'int-01',
    name: 'WhatsApp Business API',
    key: 'whatsapp_business',
    category: 'Messaging',
    status: 'connected',
    lastSync: '2 mins ago',
    permissions: ['Send WhatsApp template messages', 'Receive inbound customer messages', 'Read message status receipts'],
    iconName: 'MessageSquare',
    description: 'Direct integration with Meta Cloud API for instant automated WhatsApp property qualification & support.'
  },
  {
    id: 'int-02',
    name: 'Google Calendar API',
    key: 'google_calendar',
    category: 'Calendar',
    status: 'connected',
    lastSync: '5 mins ago',
    permissions: ['Read free/busy availability', 'Create viewing appointment events', 'Send Google Meet & location invites'],
    iconName: 'Calendar',
    description: 'Sync real-estate agent viewing schedules with Google Workspace calendar.'
  },
  {
    id: 'int-03',
    name: 'Pinecone Vector DB',
    key: 'pinecone',
    category: 'AI & LLM',
    status: 'connected',
    lastSync: '10 mins ago',
    permissions: ['Query property embeddings', 'Index PDF brochures & floorplans', 'RAG retrieval for verified answers'],
    iconName: 'Database',
    description: 'Vector database store for instant natural-language search over agency property inventory.'
  },
  {
    id: 'int-04',
    name: 'HubSpot CRM',
    key: 'hubspot',
    category: 'CRM',
    status: 'connected',
    lastSync: '1 hour ago',
    permissions: ['Read deal pipelines', 'Create & update lead contacts', 'Sync call notes & tasks'],
    iconName: 'Share2',
    description: 'Bi-directional sync of qualified leads, contact lifecycle stages, and property deal pipelines.'
  },
  {
    id: 'int-05',
    name: 'ElevenLabs Voice AI',
    key: 'elevenlabs',
    category: 'Voice',
    status: 'disconnected',
    lastSync: 'Never',
    permissions: ['Synthesize realistic Urdu & English voice notes', 'Automate missed-call voice callbacks'],
    iconName: 'PhoneCall',
    description: 'Voice synthesis engine for automated phone voice calls and WhatsApp audio notes.'
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-09-20 10:15 AM',
    actor: 'EstateFlow AI Engine',
    action: 'CREATED_APPROVAL_REQUEST',
    target: 'Approval ID: appr-301',
    details: 'Generated appointment booking draft for customer Muhammad Bilal Khan for property prop-lah-01.'
  },
  {
    id: 'aud-02',
    timestamp: '2026-09-20 09:45 AM',
    actor: 'EstateFlow AI Engine',
    action: 'HUMAN_HANDOFF_TRIGGERED',
    target: 'Conversation ID: conv-002',
    details: 'Customer Dr. Sarah Farooq asked custom payment terms. Conversation transferred to Hamza Malik.'
  },
  {
    id: 'aud-03',
    timestamp: '2026-09-20 09:30 AM',
    actor: 'Zainab Ahmed',
    action: 'VERIFIED_PROPERTY_DATA',
    target: 'Property ID: prop-lah-01',
    details: 'Confirmed price (24.5M PKR) and elevator availability timestamp updated.'
  }
];
