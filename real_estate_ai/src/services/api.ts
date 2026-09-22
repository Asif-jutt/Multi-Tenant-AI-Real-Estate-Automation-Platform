import {
  mockProperties,
  mockLeads,
  mockConversations,
  mockAppointments,
  mockApprovals,
  mockAutomations,
  mockDocuments,
  mockIntegrations,
  mockAuditLogs
} from './mockData';
import {
  Property,
  Lead,
  Conversation,
  Appointment,
  ApprovalItem,
  AutomationWorkflow,
  DocumentItem,
  IntegrationItem,
  AuditLogEntry,
  ChatMessage
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('estateflow_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Map backend PropertyResponse to frontend Property format
function mapBackendPropertyToFrontend(p: any): Property {
  return {
    id: p.id,
    title: p.title,
    description: p.description || '',
    price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
    location: `${p.locality || ''}, ${p.city || ''}`.replace(/^,\s*/, ''),
    city: (['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad'].includes(p.city) ? p.city : 'Lahore') as any,
    area: p.locality || 'Central',
    propertyType: p.property_type === 'commercial' ? 'commercial_office' : (p.property_type as any || 'apartment'),
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    sizeSqft: p.area_sqft ? parseFloat(p.area_sqft) : 1200,
    status: p.status === 'published' ? 'available' : p.status === 'draft' ? 'pending' : 'available',
    verifiedTimestamp: p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Verified Today',
    dataSource: 'CRM Listing',
    availabilityConfirmed: true,
    documentIndexingStatus: 'indexed',
    images: p.images && p.images.length > 0
      ? p.images.map((img: any) => img.signed_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80')
      : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    amenities: Array.isArray(p.features) && p.features.length > 0 ? p.features : ['Parking', 'Power Backup'],
    viewingSlots: [
      { date: '2026-09-21', time: '11:00 AM', available: true },
      { date: '2026-09-22', time: '03:00 PM', available: true }
    ],
    relatedLeadCount: 2,
    ownerAgent: 'Tariq Mahmood'
  };
}

export class EstateFlowApiService {
  // Authentication API
  static async login(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('estateflow_token', data.access_token);
      localStorage.setItem('estateflow_refresh_token', data.refresh_token);
    }
    return data;
  }

  static async register(payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    organization_name: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('estateflow_token', data.access_token);
      localStorage.setItem('estateflow_refresh_token', data.refresh_token);
    }
    return data;
  }

  static async getProfile(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  }

  // Properties API - Connects to FastAPI backend with mock fallback
  static async getProperties(filters?: { city?: string; propertyType?: string; status?: string; search?: string }): Promise<Property[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.city && filters.city !== 'all') params.append('city', filters.city);
      if (filters?.propertyType && filters.propertyType !== 'all') params.append('property_type', filters.propertyType === 'commercial_office' ? 'commercial' : filters.propertyType);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status === 'available' ? 'published' : filters.status);
      if (filters?.search) params.append('q', filters.search);

      const url = `${API_BASE_URL}/api/v1/properties?${params.toString()}`;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const apiProps = data.items.map(mapBackendPropertyToFrontend);
          // Combine with mock properties if API total is small to keep UI rich
          const existingIds = new Set(apiProps.map((p: Property) => p.id));
          const remainingMocks = mockProperties.filter((p) => !existingIds.has(p.id));
          return [...apiProps, ...remainingMocks];
        }
      }
    } catch (e) {
      console.warn('Backend API connection offline, falling back to mock dataset:', e);
    }

    // Mock fallback
    let result = [...mockProperties];
    if (filters) {
      if (filters.city && filters.city !== 'all') {
        result = result.filter((p) => p.city.toLowerCase() === filters.city?.toLowerCase());
      }
      if (filters.propertyType && filters.propertyType !== 'all') {
        result = result.filter((p) => p.propertyType === filters.propertyType);
      }
      if (filters.status && filters.status !== 'all') {
        result = result.filter((p) => p.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter((p) => p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query) || p.city.toLowerCase().includes(query));
      }
    }
    return result;
  }

  static async getPropertyById(id: string): Promise<Property | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/properties/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return mapBackendPropertyToFrontend(data);
      }
    } catch (e) {
      console.warn('Property fetch by ID failed, falling back:', e);
    }
    return mockProperties.find((p) => p.id === id);
  }

  static async createProperty(newProp: Partial<Property>): Promise<Property> {
    try {
      const payload = {
        title: newProp.title || 'Untitled Listing',
        description: newProp.description || '',
        property_type: newProp.propertyType === 'commercial_office' ? 'commercial' : (newProp.propertyType || 'apartment'),
        listing_type: 'sale',
        price: newProp.price || 10000000,
        currency: 'PKR',
        area_sqft: newProp.sizeSqft || 1000,
        bedrooms: newProp.bedrooms || 2,
        bathrooms: newProp.bathrooms || 2,
        city: newProp.city || 'Lahore',
        locality: newProp.location || 'Gulberg III',
        features: newProp.amenities || ['Parking', 'Power Backup']
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const createdData = await res.json();
        const createdProp = mapBackendPropertyToFrontend(createdData);
        mockProperties.unshift(createdProp);
        return createdProp;
      }
    } catch (e) {
      console.warn('Create property API failed, creating locally:', e);
    }

    const fallbackCreated: Property = {
      id: `prop-new-${Date.now()}`,
      title: newProp.title || 'Untitled Listing',
      description: newProp.description || '',
      price: newProp.price || 0,
      location: newProp.location || 'Lahore',
      city: newProp.city || 'Lahore',
      area: newProp.area || 'Central',
      propertyType: newProp.propertyType || 'apartment',
      bedrooms: newProp.bedrooms || 2,
      bathrooms: newProp.bathrooms || 2,
      sizeSqft: newProp.sizeSqft || 1200,
      status: 'available',
      verifiedTimestamp: 'Just Now',
      dataSource: 'Manual Entry',
      availabilityConfirmed: true,
      documentIndexingStatus: 'indexed',
      images: newProp.images && newProp.images.length > 0 ? newProp.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
      amenities: newProp.amenities || ['Parking', 'Power Backup'],
      viewingSlots: [
        { date: '2026-09-21', time: '11:00 AM', available: true },
        { date: '2026-09-22', time: '03:00 PM', available: true }
      ],
      relatedLeadCount: 0,
      ownerAgent: 'Tariq Mahmood'
    };
    mockProperties.unshift(fallbackCreated);
    return fallbackCreated;
  }

  // Leads API
  static async getLeads(filters?: { status?: string; temperature?: string; search?: string }): Promise<Lead[]> {
    let result = [...mockLeads];
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        result = result.filter((l) => l.status === filters.status);
      }
      if (filters.temperature && filters.temperature !== 'all') {
        result = result.filter((l) => l.temperature === filters.temperature);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter((l) => l.name.toLowerCase().includes(query) || l.phone.includes(query) || l.intent.toLowerCase().includes(query));
      }
    }
    return result;
  }

  static async getLeadById(id: string): Promise<Lead | undefined> {
    return mockLeads.find((l) => l.id === id);
  }

  static async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || 'New Customer',
      phone: leadData.phone || '+92 300 0000000',
      email: leadData.email || 'customer@example.com',
      source: leadData.source || 'Website Form',
      channel: leadData.channel || 'website',
      score: 75,
      temperature: 'hot',
      intent: leadData.intent || 'Property Inquiry',
      budget: leadData.budget || 25000000,
      preferredLocation: leadData.preferredLocation || 'Lahore',
      city: leadData.city || 'Lahore',
      status: 'new',
      assignedAgent: leadData.assignedAgent || 'Zainab Ahmed',
      lastActivity: 'Just Now',
      createdDate: new Date().toISOString().split('T')[0],
      language: leadData.language || 'en',
      tags: ['New Inquiry', 'Unassigned'],
      scoreBreakdown: [
        { label: 'Website Inquiry Submitted', points: 30 },
        { label: 'Budget Specified', points: 25 },
        { label: 'Phone Number Verified', points: 20 }
      ],
      slaCountdownMinutes: 15,
      aiSummary: 'New customer inquiry created via manual form.',
      matchedPropertyIds: ['prop-lah-01'],
      notes: [],
      tasks: []
    };
    mockLeads.unshift(created);
    return created;
  }

  // Conversations API
  static async getConversations(filters?: { status?: string; channel?: string }): Promise<Conversation[]> {
    let result = [...mockConversations];
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        result = result.filter((c) => c.status === filters.status);
      }
      if (filters.channel && filters.channel !== 'all') {
        result = result.filter((c) => c.channel === filters.channel);
      }
    }
    return result;
  }

  static async sendMessage(conversationId: string, text: string, sender: 'agent' | 'ai' = 'agent'): Promise<ChatMessage> {
    const conv = mockConversations.find((c) => c.id === conversationId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'agent' ? 'Tariq Mahmood (Agent)' : 'EstateFlow AI',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'delivered'
    };
    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessage = text;
      conv.lastMessageTime = newMsg.timestamp;
    }
    return newMsg;
  }

  static async toggleHumanHandoff(conversationId: string, pauseAi: boolean, reason?: string): Promise<Conversation> {
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.isAiActive = !pauseAi;
      conv.status = pauseAi ? 'waiting_for_human' : 'active';
      if (pauseAi) {
        conv.handoffReason = reason || 'Human takeover activated by agent.';
        conv.handoffTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return conv!;
  }

  // Approvals API
  static async getApprovals(): Promise<ApprovalItem[]> {
    return [...mockApprovals];
  }

  static async processApproval(approvalId: string, status: 'approved' | 'rejected', updatedMessage?: string): Promise<ApprovalItem> {
    const item = mockApprovals.find((a) => a.id === approvalId);
    if (item) {
      item.status = status;
      if (updatedMessage) {
        item.proposedMessage = updatedMessage;
      }
      mockAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: 'Tariq Mahmood',
        action: status === 'approved' ? 'APPROVED_AI_ACTION' : 'REJECTED_AI_ACTION',
        target: `Approval ID: ${approvalId}`,
        details: `Action ${status.toUpperCase()} for customer ${item.customerName}.`
      });
    }
    return item!;
  }

  // Appointments API
  static async getAppointments(): Promise<Appointment[]> {
    return [...mockAppointments];
  }

  static async createAppointment(appData: Partial<Appointment>): Promise<Appointment> {
    const created: Appointment = {
      id: `app-${Date.now()}`,
      leadId: appData.leadId || 'lead-001',
      customerName: appData.customerName || 'Customer',
      customerPhone: appData.customerPhone || '+92 300 0000000',
      propertyId: appData.propertyId || 'prop-lah-01',
      propertyTitle: appData.propertyTitle || 'Gulberg Luxury Apartment',
      propertyLocation: appData.propertyLocation || 'Gulberg III, Lahore',
      agentId: appData.agentId || 'u-102',
      agentName: appData.agentName || 'Zainab Ahmed',
      date: appData.date || '2026-09-21',
      time: appData.time || '11:00 AM',
      status: 'confirmed',
      channel: appData.channel || 'whatsapp',
      customerTimezone: 'Asia/Karachi (PKT)',
      notes: appData.notes || 'Viewing scheduled via EstateFlow AI.'
    };
    mockAppointments.unshift(created);
    return created;
  }

  // Automations API
  static async getAutomations(): Promise<AutomationWorkflow[]> {
    return [...mockAutomations];
  }

  // Documents API
  static async getDocuments(): Promise<DocumentItem[]> {
    return [...mockDocuments];
  }

  // Integrations API
  static async getIntegrations(): Promise<IntegrationItem[]> {
    return [...mockIntegrations];
  }

  // Audit logs API - Connects to FastAPI backend audit trail
  static async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/audit-logs`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          return data.items.map((log: any) => ({
            id: log.id,
            timestamp: new Date(log.created_at).toLocaleString(),
            actor: log.actor_user_id || 'System / Admin',
            action: log.action.toUpperCase(),
            target: `${log.resource_type}: ${log.resource_id || 'Global'}`,
            details: `IP: ${log.ip_address || '127.0.0.1'} | Payload: ${JSON.stringify(log.payload || {})}`
          }));
        }
      }
    } catch (e) {
      console.warn('Audit logs API call offline, falling back:', e);
    }
    return [...mockAuditLogs];
  }

  // Customer Property Natural Language Search API
  static async searchCustomerProperties(queryText: string): Promise<{
    parsedFilters: { location?: string; propertyType?: string; bedrooms?: number; maxPricePKR?: number; queryChips: string[] };
    results: Property[];
  }> {
    const lower = queryText.toLowerCase();
    const parsed = {
      location: lower.includes('lahore') ? 'Lahore' : lower.includes('islamabad') ? 'Islamabad' : lower.includes('karachi') ? 'Karachi' : undefined,
      propertyType: lower.includes('apartment') || lower.includes('flat') ? 'apartment' : lower.includes('house') || lower.includes('villa') ? 'house' : lower.includes('office') ? 'commercial_office' : undefined,
      bedrooms: lower.includes('3') ? 3 : lower.includes('5') ? 5 : lower.includes('4') ? 4 : undefined,
      maxPricePKR: lower.includes('25') ? 25000000 : lower.includes('50') ? 50000000 : lower.includes('90') ? 90000000 : undefined,
      queryChips: [] as string[]
    };

    if (parsed.location) parsed.queryChips.push(`Location: ${parsed.location}`);
    if (parsed.propertyType) parsed.queryChips.push(`Type: ${parsed.propertyType}`);
    if (parsed.bedrooms) parsed.queryChips.push(`Bedrooms: ${parsed.bedrooms} Beds`);
    if (parsed.maxPricePKR) parsed.queryChips.push(`Max Budget: PKR ${(parsed.maxPricePKR / 1000000).toFixed(0)}M`);

    const allProps = await EstateFlowApiService.getProperties();
    let results = [...allProps];
    if (parsed.location) results = results.filter((p) => p.city === parsed.location);
    if (parsed.propertyType) results = results.filter((p) => p.propertyType === parsed.propertyType);
    if (parsed.bedrooms) results = results.filter((p) => p.bedrooms === parsed.bedrooms);
    if (parsed.maxPricePKR) results = results.filter((p) => p.price <= parsed.maxPricePKR!);

    if (results.length === 0) {
      results = allProps.slice(0, 3);
    }

    return { parsedFilters: parsed, results };
  }

  // Invitations API
  static async createInvitation(payload: { email: string; role: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/v1/organizations/me/invitations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to create invitation');
    }
    return await res.json();
  }

  static async listInvitations(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/organizations/me/invitations`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('List invitations failed:', e);
    }
    return [];
  }

  static async revokeInvitation(invitationId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/v1/organizations/me/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  }

  static async inspectInvitation(token: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/v1/invitations/${token}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Invalid or expired invitation token');
    }
    return await res.json();
  }

  static async acceptInvitation(token: string): Promise<{ detail: string; organization_id: string; role: string }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/invitations/${token}/accept`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to accept invitation');
    }
    return await res.json();
  }
}

