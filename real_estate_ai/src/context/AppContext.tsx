'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Language, Theme, Lead, Property, Conversation, ApprovalItem, Appointment } from '../types';
import { currentUser, currentOrganization, mockLeads, mockProperties, mockConversations, mockApprovals, mockAppointments } from '../services/mockData';
import { EstateFlowApiService } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  user: User;
  setUser: (u: User) => void;
  organization: Organization;
  setOrganization: (o: Organization) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Auth state & modal control
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authViewTab: 'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'invite' | '2fa' | 'workspaces';
  setAuthViewTab: (tab: 'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'invite' | '2fa' | 'workspaces') => void;
  loginUser: (email: string, pass: string) => Promise<void>;
  registerUser: (payload: any) => Promise<void>;
  logoutUser: () => void;
  
  // Data state
  leads: Lead[];
  properties: Property[];
  conversations: Conversation[];
  approvals: ApprovalItem[];
  appointments: Appointment[];
  
  // Refresh & Mutation helpers
  refreshData: () => Promise<void>;
  approveAction: (id: string) => Promise<void>;
  rejectAction: (id: string) => Promise<void>;
  
  // Interactive Demo Journey State
  demoStep: number;
  runNextDemoStep: () => void;
  resetDemoJourney: () => void;
  isDemoActive: boolean;
  setIsDemoActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const guestUser: User = {
  id: 'guest-001',
  name: 'Public Viewer',
  email: 'guest@estateflow.ai',
  role: 'customer',
  organizationId: 'public',
  organizationName: 'Real Estate Marketplace'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(guestUser);
  const [organization, setOrganization] = useState<Organization>(currentOrganization);
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authViewTab, setAuthViewTab] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'invite' | '2fa' | 'workspaces'>('login');

  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Sync html lang and dir attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch initial live data on mount
  useEffect(() => {
    refreshData();
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('estateflow_token') : null;
    if (!token) {
      setUser(guestUser);
      return;
    }
    try {
      const profile = await EstateFlowApiService.getProfile();
      if (profile) {
        const mem = profile.memberships && profile.memberships[0];
        setUser({
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          role: (mem?.role === 'owner' ? 'admin' : mem?.role || 'agent') as any,
          organizationId: mem?.organization_id || 'org-001',
          organizationName: mem?.organization_name || 'Al-Rehman Real Estate'
        });
        if (mem?.organization_name) {
          setOrganization({
            ...currentOrganization,
            id: mem.organization_id,
            name: mem.organization_name
          });
        }
      } else {
        setUser(guestUser);
      }
    } catch (e) {
      console.log('No active backend session, setting guest user context');
      setUser(guestUser);
    }
  };

  const loginUser = async (email: string, pass: string) => {
    try {
      const res = await EstateFlowApiService.login(email, pass);
      addToast({
        type: 'success',
        title: 'Sign In Successful',
        message: `Authenticated as ${email}`
      });
      await checkActiveSession();
      await refreshData();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: err.message || 'Invalid credentials'
      });
      throw err;
    }
  };

  const registerUser = async (payload: any) => {
    try {
      await EstateFlowApiService.register(payload);
      addToast({
        type: 'success',
        title: 'Agency Registered',
        message: `Created organization '${payload.organization_name}'`
      });
      await checkActiveSession();
      await refreshData();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Error registering account'
      });
      throw err;
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('estateflow_token');
      localStorage.removeItem('estateflow_refresh_token');
    }
    setUser({
      id: 'guest-001',
      name: 'Logged Out',
      email: 'guest@estateflow.ai',
      role: 'customer',
      organizationId: 'org-001',
      organizationName: 'Public Visitor'
    });
    addToast({
      type: 'info',
      title: 'Signed Out Successfully',
      message: 'Tokens cleared. Sign in to access your agency dashboard.'
    });
    setAuthViewTab('login');
    setIsAuthModalOpen(true);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    addToast({
      type: 'info',
      title: lang === 'ur' ? 'زبان تبدیل ہو گئی' : 'Language Changed',
      message: lang === 'ur' ? 'اردو ڈسپلے فعال کر دیا گیا ہے۔' : 'Switched interface display to English.'
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    const l = await EstateFlowApiService.getLeads();
    const p = await EstateFlowApiService.getProperties();
    const c = await EstateFlowApiService.getConversations();
    const ap = await EstateFlowApiService.getApprovals();
    const appts = await EstateFlowApiService.getAppointments();
    setLeads(l);
    setProperties(p);
    setConversations(c);
    setApprovals(ap);
    setAppointments(appts);
  };

  const approveAction = async (id: string) => {
    await EstateFlowApiService.processApproval(id, 'approved');
    addToast({
      type: 'success',
      title: 'AI Action Approved',
      message: 'Viewing confirmation WhatsApp message dispatched and Google Calendar invite sent.'
    });
    await refreshData();
  };

  const rejectAction = async (id: string) => {
    await EstateFlowApiService.processApproval(id, 'rejected');
    addToast({
      type: 'warning',
      title: 'AI Action Rejected',
      message: 'The proposed action was declined and assigned to a human agent.'
    });
    await refreshData();
  };

  const runNextDemoStep = () => {
    if (demoStep < 5) {
      const nextStep = demoStep + 1;
      setDemoStep(nextStep);
      if (nextStep === 2) {
        addToast({
          type: 'info',
          title: 'Demo Flow: Lead Qualification',
          message: 'WhatsApp message received → AI extracted PKR 25M budget & Gulberg location.'
        });
      } else if (nextStep === 3) {
        addToast({
          type: 'info',
          title: 'Demo Flow: RAG Vector Search',
          message: 'Matched Property #prop-lah-01 (Gulberg III Luxury 3-Bed Apartment).'
        });
      } else if (nextStep === 4) {
        addToast({
          type: 'warning',
          title: 'Demo Flow: Approval Required',
          message: 'Viewing request requires agent verification in Approvals Queue.'
        });
      } else if (nextStep === 5) {
        addToast({
          type: 'success',
          title: 'Demo Flow Completed!',
          message: 'Appointment confirmed, Google Calendar synced, customer notified via WhatsApp.'
        });
      }
    }
  };

  const resetDemoJourney = () => {
    setDemoStep(1);
    setIsDemoActive(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        organization,
        setOrganization,
        language,
        setLanguage,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authViewTab,
        setAuthViewTab,
        loginUser,
        registerUser,
        logoutUser,
        leads,
        properties,
        conversations,
        approvals,
        appointments,
        refreshData,
        approveAction,
        rejectAction,
        demoStep,
        runNextDemoStep,
        resetDemoJourney,
        isDemoActive,
        setIsDemoActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
