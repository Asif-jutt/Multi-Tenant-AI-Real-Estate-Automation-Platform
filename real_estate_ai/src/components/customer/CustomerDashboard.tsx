'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, Lead } from '../../types';
import {
  Sparkles,
  Building2,
  MapPin,
  Tag,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  Sliders,
  Check,
  PhoneCall,
  UserCheck,
  Eye,
  Plus,
  Bookmark,
  FileText,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export const CustomerDashboard: React.FC = () => {
  const { user, properties, addToast } = useApp();

  // Requirements form states
  const [city, setCity] = useState('Lahore');
  const [locality, setLocality] = useState('Gulberg III');
  const [propertyType, setPropertyType] = useState('apartment');
  const [maxBudgetPKR, setMaxBudgetPKR] = useState('25000000');
  const [bedrooms, setBedrooms] = useState('3');
  const [urgency, setUrgency] = useState('Within 30 Days');
  const [notes, setNotes] = useState('Looking for ready-to-move apartment with dedicated covered parking and 24/7 power backup.');

  // Customer's submitted requirements list
  const [submittedRequirements, setSubmittedRequirements] = useState<any[]>([
    {
      id: 'req-001',
      city: 'Lahore',
      locality: 'Gulberg III / Phase 6 DHA',
      propertyType: 'apartment',
      maxBudgetPKR: 25000000,
      bedrooms: 3,
      urgency: 'Within 30 Days',
      status: 'Active - Agency Matching',
      matchedCount: 3,
      submittedDate: '2026-09-22'
    }
  ]);

  // Customer's property inquiries list
  const [inquiries, setInquiries] = useState<any[]>([
    {
      id: 'inq-001',
      propertyId: 'prop-lah-01',
      propertyTitle: 'Modern 3-Bedroom Luxury Apartment',
      location: 'Gulberg III, Lahore',
      price: 24500000,
      agencyName: 'EstateFlow Prime Real Estate',
      agentName: 'Asif Hussain',
      agentPhone: '+92 300 1234567',
      status: 'Viewing Scheduled',
      viewingDate: '2026-09-23 at 11:00 AM',
      inquiryDate: '2026-09-22'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'submit_req' | 'inquiries' | 'viewings'>('overview');

  const handleRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `req-${Date.now()}`,
      city,
      locality,
      propertyType,
      maxBudgetPKR: parseFloat(maxBudgetPKR) || 25000000,
      bedrooms: parseInt(bedrooms) || 3,
      urgency,
      status: 'Active - Agency Matching',
      matchedCount: 2,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setSubmittedRequirements([newReq, ...submittedRequirements]);
    addToast({
      type: 'success',
      title: 'Property Requirement Submitted!',
      message: `Your requirement for a ${bedrooms}-bed ${propertyType} in ${locality}, ${city} was sent to EstateFlow Prime Real Estate.`
    });
    setActiveTab('overview');
  };

  // Filter AI matched properties based on customer's first active requirement
  const currentReq = submittedRequirements[0];
  const matchedProperties = properties.filter((p) => {
    if (!currentReq) return true;
    const matchesCity = p.city.toLowerCase() === currentReq.city.toLowerCase();
    const matchesPrice = p.price <= currentReq.maxBudgetPKR;
    return matchesCity && matchesPrice;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white border border-purple-800/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Buyer & Tenant Portal</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Manage your property requirements, track agency inquiries, and view scheduled property viewings.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit_req')}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-950/60 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit What You Are Looking For</span>
        </button>
      </div>

      {/* Portal Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Overview & Matched Properties</span>
        </button>

        <button
          onClick={() => setActiveTab('submit_req')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'submit_req'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Submit Requirements</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & MATCHED PROPERTIES */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Active Requirements Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">My Active Property Requirements</h3>
              </div>
              <button
                onClick={() => setActiveTab('submit_req')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                + Add Another Requirement
              </button>
            </div>

            {submittedRequirements.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white capitalize">
                      {req.bedrooms} Bed {req.propertyType} in {req.locality}, {req.city}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                    <span>Max Budget: <strong className="text-slate-900 dark:text-white font-bold">PKR {(req.maxBudgetPKR / 1000000).toFixed(1)}M</strong></span>
                    <span>•</span>
                    <span>Timeline: {req.urgency}</span>
                    <span>•</span>
                    <span>Submitted: {req.submittedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
                    {req.matchedCount} AI Verified Matches
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommended Matched Properties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Properties Matching Your Requirements</span>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified inventory from EstateFlow Prime Real Estate matching your PKR 25M budget & location.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedProperties.slice(0, 6).map((prop) => (
                <div key={prop.id} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold">
                        {prop.city}
                      </div>
                      <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-purple-300 text-base font-black">
                        PKR {(prop.price / 1000000).toFixed(1)}M
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{prop.location}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>{prop.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{prop.bathrooms} Baths</span>
                        <span>•</span>
                        <span>{prop.sizeSqft} sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        addToast({
                          type: 'success',
                          title: 'Inquiry Sent to Agency',
                          message: `Your inquiry for '${prop.title}' was assigned to agent ${prop.ownerAgent || 'Asif Hussain'}.`
                        });
                      }}
                      className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Contact Agency for This Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT PROPERTY REQUIREMENTS FORM */}
      {activeTab === 'submit_req' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 max-w-3xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Buyer Requirement Specification</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Submit Your Property Requirements</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tell us exactly what property you are looking for. Our AI system will match verified agency listings and notify assigned agents.
            </p>
          </div>

          <form onSubmit={handleRequirementSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Locality / Area</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Gulberg III, DHA Phase 6, Blue Area"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House / Villa</option>
                  <option value="commercial_office">Commercial Office</option>
                  <option value="plot">Land Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max Budget (PKR)</label>
                <input
                  type="number"
                  value={maxBudgetPKR}
                  onChange={(e) => setMaxBudgetPKR(e.target.value)}
                  placeholder="25000000"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bedrooms Needed</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="1">1 Bed Studio</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4 Beds</option>
                  <option value="5">5+ Beds / Villa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Purchase Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Immediate (Within 7 Days)">Immediate (Within 7 Days)</option>
                <option value="Within 30 Days">Within 30 Days</option>
                <option value="Exploring Options">Exploring Options</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Special Requirements & Preferences</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xl shadow-purple-950/60 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Property Requirement to Agency</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY INQUIRIES & VIEWINGS */}
      {activeTab === 'inquiries' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">My Agency Inquiries & Viewing Schedule</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track direct communications and booked viewings with EstateFlow Prime Real Estate.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">{inq.propertyTitle}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{inq.location} • PKR {(inq.price / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-bold pt-1">
                    Listing Agency: {inq.agencyName} (Agent: {inq.agentName} - {inq.agentPhone})
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-300 dark:border-purple-800">
                    {inq.status}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Viewing Date: {inq.viewingDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
