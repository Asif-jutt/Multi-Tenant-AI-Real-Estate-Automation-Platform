export type Role = 'admin' | 'sales_manager' | 'agent' | 'customer';

export type Language = 'en' | 'ur';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  organizationId: string;
  organizationName: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'residential_sales' | 'rentals' | 'commercial' | 'property_management' | 'real_estate_development';
  primaryLanguage: 'en' | 'ur' | 'en_ur';
  country: string;
  memberCount: number;
}

export type LeadTemperature = 'hot' | 'warm' | 'cold' | 'unqualified';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'viewing_scheduled' | 'negotiation' | 'won' | 'lost';
export type LeadChannel = 'whatsapp' | 'website' | 'facebook' | 'instagram' | 'portal' | 'referral';

export interface LeadScoreFactor {
  label: string;
  points: number;
}

export interface LeadTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  channel: LeadChannel;
  score: number; // 0 - 100
  temperature: LeadTemperature;
  intent: string;
  budget: number; // PKR
  preferredLocation: string;
  city: 'Lahore' | 'Islamabad' | 'Karachi' | 'Rawalpindi' | 'Faisalabad';
  status: LeadStatus;
  assignedAgent: string;
  assignedAgentAvatar?: string;
  lastActivity: string;
  createdDate: string;
  language: 'en' | 'ur';
  tags: string[];
  scoreBreakdown: LeadScoreFactor[];
  slaCountdownMinutes: number;
  aiSummary: string;
  matchedPropertyIds: string[];
  notes: string[];
  tasks: LeadTask[];
}

export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented' | 'archived';
export type DocumentIndexStatus = 'indexed' | 'processing' | 'needs_review' | 'failed' | 'outdated';

export interface ViewingSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // PKR
  location: string;
  city: 'Lahore' | 'Islamabad' | 'Karachi' | 'Rawalpindi' | 'Faisalabad';
  area: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial_office' | 'plot';
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  status: PropertyStatus;
  verifiedTimestamp: string;
  dataSource: 'CRM Listing' | 'Document Import' | 'Portal Feed' | 'Manual Entry';
  availabilityConfirmed: boolean;
  documentIndexingStatus: DocumentIndexStatus;
  images: string[];
  amenities: string[];
  floorPlanUrl?: string;
  viewingSlots: ViewingSlot[];
  relatedLeadCount: number;
  featured?: boolean;
  ownerAgent: string;
}

export interface SourceCitation {
  propertyId: string;
  propertyTitle: string;
  factType: 'price' | 'availability' | 'bedrooms' | 'amenities' | 'location' | 'document';
  excerpt: string;
  verifiedTime: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'agent' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed';
  citations?: SourceCitation[];
  confidenceScore?: number; // 0.0 - 1.0
  isDraft?: boolean;
  needsApproval?: boolean;
  translation?: {
    lang: Language;
    text: string;
  };
  audioUrl?: string;
  attachedPropertyIds?: string[];
}

export type ConversationStatus = 'unread' | 'active' | 'waiting_for_human' | 'needs_approval' | 'closed';

export interface Conversation {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  channel: LeadChannel;
  status: ConversationStatus;
  priority: 'high' | 'medium' | 'low';
  unreadCount: number;
  assignedAgent: string;
  isAiActive: boolean;
  requiresApproval: boolean;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
  handoffReason?: string;
  handoffTimestamp?: string;
}

export type AppointmentStatus = 'requested' | 'pending_approval' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  agentId: string;
  agentName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  channel: LeadChannel;
  notes?: string;
  customerTimezone: string;
  isConflict?: boolean;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

export interface ApprovalItem {
  id: string;
  actionType: 'send_whatsapp' | 'send_email' | 'schedule_appointment' | 'change_status' | 'offer_discount' | 'bulk_message';
  customerName: string;
  leadId: string;
  proposedMessage: string;
  proposedArgs: Record<string, any>;
  riskLevel: RiskLevel;
  sourceEvidence: string;
  requestedByAi: boolean;
  createdTime: string;
  expirySeconds: number;
  status: ApprovalStatus;
}

export interface WorkflowExecutionStep {
  stepName: string;
  status: 'success' | 'running' | 'failed';
  timestamp: string;
  inputSummary: string;
  outputSummary: string;
  errorDetails?: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  appsUsed: string[];
  status: 'active' | 'draft' | 'failed';
  lastRun: string;
  successRate: number;
  owner: string;
  executionHistory: WorkflowExecutionStep[];
}

export interface DocumentItem {
  id: string;
  name: string;
  associatedPropertyId?: string;
  associatedPropertyTitle?: string;
  fileType: 'pdf' | 'docx' | 'csv' | 'image';
  pages: number;
  uploadedBy: string;
  uploadedDate: string;
  indexStatus: DocumentIndexStatus;
  lastIndexed: string;
  extractionWarnings?: string[];
  extractedTextPreview: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  key: string;
  category: 'Messaging' | 'CRM' | 'Calendar' | 'AI & LLM' | 'Workflow' | 'Voice';
  status: 'connected' | 'disconnected' | 'needs_auth' | 'syncing';
  lastSync: string;
  permissions: string[];
  iconName: string;
  description: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export interface DemoJourneyStep {
  stepIndex: number;
  title: string;
  description: string;
  activeModule: 'conversations' | 'approvals' | 'appointments' | 'leads' | 'analytics';
  actionPrompt?: string;
}
