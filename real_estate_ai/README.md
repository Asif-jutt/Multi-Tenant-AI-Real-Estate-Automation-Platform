# EstateFlow AI — Multi-Tenant AI Real-Estate Operations Platform

EstateFlow AI is a production-quality frontend UI for a multi-tenant AI real-estate operations SaaS platform tailored for property agencies in Pakistan and global markets.

---

## 🌟 Key Features & Modules

1. **Overview Dashboard (`/`)**: Real-time agency metrics (New Leads, Hot Leads, Open Conversations, Viewing Schedules, AI Resolution Rate), Lead Conversion Funnel, "Needs Attention" Panel, Recent Conversations & Quick Shortcuts.
2. **Interactive End-to-End Demo Flow**: Click **"⚡ Launch Live Demo Flow"** in the top header bar to walk through the 5-step live journey:
   - *Customer WhatsApp Inquiry* (Urdu/English)
   - *AI Lead Extraction & Intent Parsing*
   - *Verified Database RAG Property Match*
   - *Safety Approval Queue & Agent Handoff*
   - *Google Calendar Sync & WhatsApp Confirmation*
3. **Lead Management Pipeline (`/leads`)**: Full CRM lead registry with AI score factor explanations, temperature badges (Hot/Warm/Cold), SLA countdown timers, matched inventory & agent assignments.
4. **Omnichannel AI & Human Inbox (`/conversations`)**: 3-column inbox featuring WhatsApp Business, Website chat, AI auto-draft composer, source citations for verified property facts, Urdu/English translation indicators, and Human Takeover controls.
5. **Internal Staff AI Assistant (`/assistant`)**: Natural-language staff Q&A over agency inventory, lead history, appointment schedules, and automation error diagnostics with 4-part structured answer cards (Verified Database Facts, Retrieved Doc Info, AI Summary, Next Action).
6. **Verified Property Inventory (`/properties`)**: Grid/Table view, filters by city (Lahore, Islamabad, Karachi), property type, bedrooms, RAG index status, and trust verification badges.
7. **Customer Property Search Portal (`/customer/properties`)**: Public customer search with natural language parsing (parsed query chips), 3-property side-by-side comparison modal, and viewing request trigger.
8. **Property Document RAG Indexing (`/documents`)**: PDF/DOCX floor plan brochure indexing with security notice treating document content as data (not instructions).
9. **Viewing Schedule & Calendar (`/appointments`)**: Calendar and list views synced with Google Workspace Calendar.
10. **AI Safety & Action Approval Queue (`/approvals`)**: Human-in-the-loop review queue for sensitive AI actions (WhatsApp messages, appointment bookings, price terms).
11. **Agency Automation Workflows (`/automations`)**: n8n / Zapier webhook integrations, execution timelines, and step-by-step logs.
12. **Agency Analytics (`/analytics`)**: Recharts graphs for lead funnel, response time trends, channel performance, AI vs Human resolution, model cost & token metrics.
13. **Connected Apps & API Integrations (`/integrations`)**: Meta Cloud WhatsApp API, Google Workspace, Pinecone Vector DB, HubSpot CRM with explicit permission scopes.
14. **Agency Platform Settings (`/settings`)**: AI confidence thresholds, LLM budget caps, security webhook keys & audit log history.
15. **Authentication Suite (`/login`)**: 8 authentication views (Login, Register Organization, Forgot Password, Reset Password, Email Verify, Invite Accept, 2FA, Workspace Select).
16. **Agency Onboarding Wizard (`/onboarding`)**: 10-step wizard for new agency setup.

---

## 🛠️ Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  ESTATEFLOW AI UI                                 |
+-----------------------------------------------------------------------------------+
|  AppShell Layout (Header, Sidebar Navigation, Global Search, Toast Notifications) |
+-----------------------------------------------------------------------------------+
|                                 CONTEXT & STATE LAYER                             |
|  - AppContext (Multi-tenant org, User, EN/UR Language, Light/Dark Theme, Demo)    |
+-----------------------------------------------------------------------------------+
|                               MOCK API SERVICE LAYER                              |
|  - EstateFlowApiService (Isolates mock data fetch & delay from UI components)     |
+-----------------------------------------------------------------------------------+
|                                  DATA MODULES                                     |
|  - Overview Dashboard    - Leads CRM Pipeline      - Omnichannel Inbox            |
|  - Staff AI Assistant    - Property Inventory      - Customer NL Search           |
|  - RAG Document Index    - Viewing Appointments    - AI Safety Approvals          |
|  - Workflow Automations  - Recharts Analytics      - App Integrations & Settings  |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 How to Run locally

1. Navigate to the project root directory:
   ```bash
   cd real_estate_ai
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   **http://localhost:3000**

---

## 🌐 Language & Theme Controls

- **Language Switcher**: Click the `EN / اردو` toggle in the top header to switch between English and Urdu font layouts.
- **Theme Toggle**: Click the 🌙 / ☀️ icon in the top header to toggle between Dark Mode and Light Mode.
