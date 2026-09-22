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
  name: 'Asif Hussain',
  email: 'asifhussain5115@gmail.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  organizationId: 'org-estateflow-01',
  organizationName: 'EstateFlow Prime Real Estate'
};

export const currentOrganization: Organization = {
  id: 'org-estateflow-01',
  name: 'EstateFlow Prime Real Estate',
  type: 'residential_sales',
  primaryLanguage: 'en_ur',
  country: 'Pakistan',
  memberCount: 12
};

export const mockProperties: Property[] = [
  {
    id: 'prop-lah-01',
    title: 'Modern 3-Bedroom Luxury Apartment',
    description: 'Corner 3-bedroom apartment with panoramic skyline views, modern kitchen fittings, 24/7 power backup, and basement parking.',
    price: 24500000,
    location: 'Gulberg III, Near MM Alam Road',
    city: 'Lahore',
    area: 'Gulberg III',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    sizeSqft: 1850,
    status: 'available',
    verifiedTimestamp: '2026-09-22 09:30 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Elevator', '24/7 Security', 'Power Backup Generator', 'Covered Parking', 'Gymnasium'],
    floorPlanUrl: '/floorplans/gulberg_3bed.pdf',
    viewingSlots: [
      { date: '2026-09-23', time: '11:00 AM', available: true },
      { date: '2026-09-24', time: '03:00 PM', available: true }
    ],
    relatedLeadCount: 5,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-02',
    title: '1 Kanal Brand New Designer House',
    description: 'Architecturally designed double-story house in Phase 6 DHA, featuring imported marble flooring, 5 master beds, swimming pool, and solar system.',
    price: 88000000,
    location: 'Phase 6, DHA',
    city: 'Lahore',
    area: 'DHA Phase 6',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 4500,
    status: 'available',
    verifiedTimestamp: '2026-09-22 10:15 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Swimming Pool', 'Solar System', 'Servant Quarters', 'Lawn', 'Smart Home Automation'],
    viewingSlots: [
      { date: '2026-09-23', time: '02:00 PM', available: true }
    ],
    relatedLeadCount: 12,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-isb-01',
    title: 'Executive Office Suite in Blue Area',
    description: 'Fully furnished commercial office space in prime Blue Area Islamabad with high-speed elevator access, fiber internet, and executive meeting room.',
    price: 38000000,
    location: 'Blue Area, Near Metro Station',
    city: 'Islamabad',
    area: 'Blue Area',
    propertyType: 'commercial_office',
    bedrooms: 0,
    bathrooms: 2,
    sizeSqft: 2100,
    status: 'available',
    verifiedTimestamp: '2026-09-22 08:00 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Central Air Conditioning', 'High Speed Elevators', 'CCTV Monitoring', 'Fire Safety System'],
    viewingSlots: [
      { date: '2026-09-23', time: '10:00 AM', available: true }
    ],
    relatedLeadCount: 7,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-khi-01',
    title: 'Sea Facing 4-Bed Flat in Clifton Block 4',
    description: 'Spacious sea-view apartment with large balcony, renovated interiors, dedicated water filtration plant, and secure complex entry.',
    price: 49000000,
    location: 'Block 4, Clifton',
    city: 'Karachi',
    area: 'Clifton',
    propertyType: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 2800,
    status: 'available',
    verifiedTimestamp: '2026-09-21 06:45 PM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Sea View', 'Balcony', 'RO Water Plant', '2 Reserved Parking Bays'],
    viewingSlots: [
      { date: '2026-09-24', time: '04:00 PM', available: true }
    ],
    relatedLeadCount: 9,
    ownerAgent: 'Asif Hussain'
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
    verifiedTimestamp: '2026-09-22 10:00 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Gated Community', '24/7 Security Patrol', 'Near Grand Mosque', 'Parks'],
    viewingSlots: [
      { date: '2026-09-23', time: '04:00 PM', available: true }
    ],
    relatedLeadCount: 14,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-isb-02',
    title: '2 Bed Smart Apartment in Gulberg Greens',
    description: 'Modern luxury 2-bed apartment in high-rise tower at Gulberg Greens with scenic Margalla hill views.',
    price: 18500000,
    location: 'Gulberg Greens, Islamabad',
    city: 'Islamabad',
    area: 'Gulberg Greens',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1350,
    status: 'available',
    verifiedTimestamp: '2026-09-22 11:30 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Hill View', 'Smart Locks', 'Gym', 'Covered Parking'],
    viewingSlots: [],
    relatedLeadCount: 6,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-khi-02',
    title: '500 Sq Yds Luxury Residence in DHA Phase 8',
    description: 'Brand new minimalist modern house built on 500 sq yds with basement theater room and rooftop terrace garden.',
    price: 115000000,
    location: 'Phase 8, DHA',
    city: 'Karachi',
    area: 'DHA Phase 8',
    propertyType: 'house',
    bedrooms: 6,
    bathrooms: 7,
    sizeSqft: 5200,
    status: 'available',
    verifiedTimestamp: '2026-09-21 02:15 PM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Home Theater', 'Rooftop Garden', 'Servant Quarters', 'Solar Inverter'],
    viewingSlots: [],
    relatedLeadCount: 11,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-isb-03',
    title: '10 Marla Modern House in DHA Phase 2',
    description: 'Solid construction 10 Marla house featuring double unit layout, solid ash wood doors, and imported sanitary fittings.',
    price: 42000000,
    location: 'Phase 2, DHA',
    city: 'Islamabad',
    area: 'DHA Phase 2',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 5,
    sizeSqft: 3200,
    status: 'available',
    verifiedTimestamp: '2026-09-22 09:00 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Double Unit', 'Ash Wood Doors', 'Porch for 2 Cars', 'Servant Room'],
    viewingSlots: [],
    relatedLeadCount: 8,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-04',
    title: 'Commercial Showroom Plaza on MM Alam Road',
    description: 'Prime commercial building with front glass facade, dual elevators, high footfall location ideal for retail or bank branch.',
    price: 130000000,
    location: 'MM Alam Road, Gulberg III',
    city: 'Lahore',
    area: 'Gulberg III',
    propertyType: 'commercial_office',
    bedrooms: 0,
    bathrooms: 6,
    sizeSqft: 6500,
    status: 'available',
    verifiedTimestamp: '2026-09-22 08:30 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Glass Facade', 'Main Boulevard Location', 'Elevators', 'Basement Parking'],
    viewingSlots: [],
    relatedLeadCount: 15,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-isb-04',
    title: '3 Bed Executive Apartment in F-11 Markaz',
    description: 'Spacious 3-bedroom apartment with separate drawing/dining, servant quarter, and immediate transfer paperwork.',
    price: 32500000,
    location: 'Sector F-11 Markaz',
    city: 'Islamabad',
    area: 'F-11',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 2200,
    status: 'available',
    verifiedTimestamp: '2026-09-21 04:00 PM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Markaz Vicinity', 'Standby Generator', 'Dedicated Parking', 'Security Guards'],
    viewingSlots: [],
    relatedLeadCount: 4,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-05',
    title: 'Corner Commercial Plot in DHA Phase 9 Prism',
    description: '4 Marla commercial plot on 100ft wide main boulevard in DHA Phase 9 Prism. High investment potential.',
    price: 28000000,
    location: 'Main Boulevard, DHA Phase 9 Prism',
    city: 'Lahore',
    area: 'DHA Phase 9',
    propertyType: 'plot',
    bedrooms: 0,
    bathrooms: 0,
    sizeSqft: 1080,
    status: 'available',
    verifiedTimestamp: '2026-09-22 07:15 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Corner Plot', '100ft Boulevard', 'DHA Transferable', 'Clear Title'],
    viewingSlots: [],
    relatedLeadCount: 10,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-khi-03',
    title: 'Sea View Penthouse in Emaar Crescent Bay',
    description: 'Luxury 4-bed penthouse in Pearl Tower Emaar with private jacuzzi, wraparound balcony, and ocean panorama.',
    price: 85000000,
    location: 'Crescent Bay, DHA Phase 8',
    city: 'Karachi',
    area: 'DHA Phase 8',
    propertyType: 'apartment',
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 3600,
    status: 'available',
    verifiedTimestamp: '2026-09-22 09:45 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Jacuzzi', 'Emaar Security', 'Infinity Pool', 'Private Parking'],
    viewingSlots: [],
    relatedLeadCount: 16,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-06',
    title: '1 Kanal Park Facing House in Askari 11',
    description: 'Well-maintained 1 Kanal house directly facing sector park with lush front lawn and 5 spacious bedrooms.',
    price: 62000000,
    location: 'Sector B, Askari 11',
    city: 'Lahore',
    area: 'Askari 11',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 4500,
    status: 'available',
    verifiedTimestamp: '2026-09-21 05:20 PM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Park Facing', 'Secure Army Cantonment Entry', 'Lawn', 'Garbage Collection'],
    viewingSlots: [],
    relatedLeadCount: 7,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-khi-04',
    title: 'Corporate Office Floor on I.I. Chundrigar Road',
    description: 'Entire 4,500 sqft commercial floor in financial district with server room setup, central HVAC, and 24/7 security.',
    price: 75000000,
    location: 'I.I. Chundrigar Road',
    city: 'Karachi',
    area: 'Financial District',
    propertyType: 'commercial_office',
    bedrooms: 0,
    bathrooms: 4,
    sizeSqft: 4500,
    status: 'available',
    verifiedTimestamp: '2026-09-22 08:00 AM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Server Room', 'Central HVAC', 'Financial District Location', 'Elevators'],
    viewingSlots: [],
    relatedLeadCount: 3,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-rwp-01',
    title: '10 Marla House in Bahria Town Phase 8',
    description: 'Modern 5-bedroom house with elegant TV lounge, dirty kitchen, terrace, and close proximity to Bahria International Hospital.',
    price: 34000000,
    location: 'Phase 8, Bahria Town',
    city: 'Rawalpindi',
    area: 'Bahria Town',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 3100,
    status: 'available',
    verifiedTimestamp: '2026-09-22 10:45 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Near Hospital', 'Dirty Kitchen', 'Terrace', 'Car Porch'],
    viewingSlots: [],
    relatedLeadCount: 5,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-07',
    title: '2 Kanal Luxury Farmhouse Estate on Bedian Road',
    description: 'Exclusive 2 Kanal private farmhouse with landscaped lawns, swimming pool, gazebo, and perimeter security wall.',
    price: 140000000,
    location: 'Bedian Road, Near Ring Road Interchange',
    city: 'Lahore',
    area: 'Bedian Road',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 9000,
    status: 'available',
    verifiedTimestamp: '2026-09-20 03:00 PM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Pool', 'Gazebo', 'Landscaped Lawns', 'Security Guard Post'],
    viewingSlots: [],
    relatedLeadCount: 8,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-fsd-01',
    title: 'Prime Commercial Shop in Civil Lines',
    description: 'Ground floor 650 sqft commercial shop in main Civil Lines market with high customer traffic.',
    price: 22000000,
    location: 'Civil Lines, Near Clock Tower',
    city: 'Faisalabad',
    area: 'Civil Lines',
    propertyType: 'commercial_office',
    bedrooms: 0,
    bathrooms: 1,
    sizeSqft: 650,
    status: 'available',
    verifiedTimestamp: '2026-09-21 11:00 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Ground Floor Front', 'High Footfall', 'Commercial Meter', 'Shutters Installed'],
    viewingSlots: [],
    relatedLeadCount: 4,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-isb-05',
    title: '1 Kanal Designer Villa in Naval Anchorage',
    description: 'Modern elevation 1 Kanal house with 5 bedrooms, solar energy system, double garage, and basement multi-purpose hall.',
    price: 58000000,
    location: 'Naval Anchorage, Sector M',
    city: 'Islamabad',
    area: 'Naval Anchorage',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 4500,
    status: 'available',
    verifiedTimestamp: '2026-09-22 09:15 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Solar Power', 'Basement Hall', 'Double Garage', 'Naval Security Patrol'],
    viewingSlots: [],
    relatedLeadCount: 9,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-lah-08',
    title: 'Modern Studio Apartment in DHA Raya Golf Club',
    description: 'Fully furnished studio apartment overlooking the 18-hole Raya Golf Course with access to luxury clubhouse facilities.',
    price: 16800000,
    location: 'DHA Raya, Phase 6',
    city: 'Lahore',
    area: 'DHA Phase 6',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 750,
    status: 'available',
    verifiedTimestamp: '2026-09-22 10:00 AM',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Golf Course View', 'Clubhouse Access', 'Valet Parking', 'Concierge Service'],
    viewingSlots: [],
    relatedLeadCount: 6,
    ownerAgent: 'Asif Hussain'
  },
  {
    id: 'prop-khi-05',
    title: '5 Bed Luxury Villa in PECHS Block 6',
    description: 'Spacious 500 sq yds classic villa in quiet residential lane of PECHS Block 6 with lush front garden and updated plumbing/electric wiring.',
    price: 92000000,
    location: 'Block 6, PECHS',
    city: 'Karachi',
    area: 'PECHS',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 4800,
    status: 'available',
    verifiedTimestamp: '2026-09-21 01:30 PM',
    dataSource: 'Manual Entry',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Lush Garden', 'Quiet Neighborhood', 'Underground Water Tank', 'Servant Quarters'],
    viewingSlots: [],
    relatedLeadCount: 11,
    ownerAgent: 'Asif Hussain'
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
    assignedAgent: 'Asif Hussain',
    assignedAgentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastActivity: '12 mins ago',
    createdDate: '2026-09-22',
    language: 'ur',
    tags: ['Hot Lead', 'Urdu Speaker', 'Bank Approved Loan', 'Viewing Pending'],
    scoreBreakdown: [
      { label: 'Explicit Viewing Request', points: 30 },
      { label: 'Confirmed Budget (25M PKR)', points: 20 },
      { label: 'Exact Location Match Found', points: 20 },
      { label: 'Responded in under 5 mins', points: 15 }
    ],
    slaCountdownMinutes: 18,
    aiSummary: 'Customer submitted WhatsApp message in Urdu asking for a 3-bedroom apartment in Lahore under PKR 25 Million. Matched prop-lah-01 in Gulberg III.',
    matchedPropertyIds: ['prop-lah-01', 'prop-lah-03'],
    notes: [
      'Buyer prefers ready-to-move-in condition with elevator.',
      'Bank financing already pre-approved by HBL.'
    ],
    tasks: [
      { id: 't-1', title: 'Confirm viewing arrival with Mr. Bilal', dueDate: 'Today, 5:00 PM', completed: false, assignedTo: 'Asif Hussain' }
    ]
  }
];

export const mockConversations: Conversation[] = [];
export const mockApprovals: ApprovalItem[] = [];
export const mockAppointments: Appointment[] = [];
export const mockAutomations: AutomationWorkflow[] = [];
export const mockDocuments: DocumentItem[] = [];
export const mockIntegrations: IntegrationItem[] = [];
export const mockAuditLogs: AuditLogEntry[] = [];
