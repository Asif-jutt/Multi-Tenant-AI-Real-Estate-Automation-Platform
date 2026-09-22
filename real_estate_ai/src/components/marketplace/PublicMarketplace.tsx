'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Calendar,
  MessageSquare,
  UserPlus,
  LogIn,
  Eye,
  Tag,
  LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PublicMarketplaceProps {
  onSwitchToAgencyDashboard?: () => void;
}

export const PublicMarketplace: React.FC<PublicMarketplaceProps> = ({ onSwitchToAgencyDashboard }) => {
  const { user, properties, addToast, setIsAuthModalOpen, setAuthViewTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Filter properties in real-time
  const filteredProperties = properties.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      (p.ownerAgent && p.ownerAgent.toLowerCase().includes(q));

    const matchesCity = selectedCity === 'all' || p.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesType = selectedType === 'all' || p.propertyType === selectedType;

    let matchesPrice = true;
    if (selectedPriceRange === 'under_20m') matchesPrice = p.price < 20000000;
    else if (selectedPriceRange === '20m_50m') matchesPrice = p.price >= 20000000 && p.price <= 50000000;
    else if (selectedPriceRange === 'above_50m') matchesPrice = p.price > 50000000;

    return matchesSearch && matchesCity && matchesType && matchesPrice;
  });

  const isAuthenticated = user.id !== 'guest-001';

  const handleInquire = (property: Property) => {
    setSelectedProperty(property);

    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In / Create Account Required',
        message: `Please sign in or create an account to inquire about '${property.title}' with ${property.ownerAgent || 'the listing agency'}.`
      });
      setAuthViewTab('register');
      setIsAuthModalOpen(true);
    } else {
      setInquirySubmitted(true);
      addToast({
        type: 'success',
        title: 'Inquiry Submitted!',
        message: `Your inquiry for '${property.title}' was routed directly to ${property.ownerAgent || 'Listing Agent'}.`
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Hero Header Banner with High-Visibility Background Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 md:p-14 text-white shadow-2xl group min-h-[420px] flex items-center bg-slate-900">
        {/* Background Architectural Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Architectural Real Estate Background"
            className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
          />
          {/* Asymmetric Left Gradient Overlay: Leaves the right side image crisp & fully visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-purple-950/15 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/25 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Multi-Agency Real Estate Marketplace</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
            Discover Premium Verified Properties Across Top Agencies
          </h1>

          <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-sm">
            Browse live listings directly from verified real-estate agencies. View specs, verified legal titles, and connect directly with agents. Create an account to schedule viewings or submit offers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setAuthViewTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xl shadow-purple-950/80 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account to Contact Agencies</span>
                </button>

                <button
                  onClick={() => {
                    setAuthViewTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-slate-100 border border-slate-700/80 backdrop-blur-md text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <LogIn className="w-4 h-4 text-purple-400" />
                  <span>Sign In</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 backdrop-blur-md text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Signed in as {user.name} ({user.role === 'customer' ? 'Buyer Account' : user.organizationName})</span>
                </div>
                {user.role === 'customer' ? (
                  <Link
                    href="/customer/dashboard"
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Customer Dashboard</span>
                  </Link>
                ) : onSwitchToAgencyDashboard ? (
                  <button
                    onClick={onSwitchToAgencyDashboard}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Go to Agency Operations Dashboard</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Filter & Search Toolbar */}
      <div className="p-4 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties by title, locality, or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* City selector */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Cities</option>
                <option value="lahore" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Lahore</option>
                <option value="islamabad" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Islamabad</option>
                <option value="karachi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Karachi</option>
                <option value="rawalpindi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rawalpindi</option>
              </select>
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Types</option>
                <option value="apartment" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Apartment</option>
                <option value="house" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">House / Villa</option>
                <option value="commercial_office" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Commercial Office</option>
                <option value="plot" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Land Plot</option>
              </select>
            </div>

            {/* Price selector */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Any Price</option>
                <option value="under_20m" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Under PKR 20M</option>
                <option value="20m_50m" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">PKR 20M - 50M</option>
                <option value="above_50m" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Above PKR 50M</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredProperties.length}</strong> active listings across agencies</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setSelectedType('all');
                setSelectedPriceRange('all');
              }}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Property Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white text-[11px] font-bold">
                  <Building2 className="w-3 h-3 text-purple-400" />
                  <span>{prop.city}</span>
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  Verified Listing
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between">
                  <span className="text-lg font-black text-purple-300">
                    PKR {(prop.price / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[10px] text-slate-300 capitalize bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                    {prop.propertyType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {prop.description || 'Exclusive property listing with verified documentation and immediate availability.'}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Bed className="w-3.5 h-3.5 text-purple-500" />
                    <span>{prop.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Bath className="w-3.5 h-3.5 text-purple-500" />
                    <span>{prop.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Maximize className="w-3.5 h-3.5 text-purple-500" />
                    <span>{prop.sizeSqft} sqft</span>
                  </div>
                </div>

                {/* Listing agency tag */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Listing Agency: <strong className="text-slate-800 dark:text-slate-200 font-bold">{prop.ownerAgent || 'Al-Rehman Real Estate'}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedProperty(prop);
                  setIsDetailModalOpen(true);
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => handleInquire(prop)}
                className="py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details & Inquire Modal */}
      {isDetailModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md text-white font-extrabold text-lg">
                PKR {(selectedProperty.price / 1000000).toFixed(1)} Million
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedProperty.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedProperty.location}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedProperty.description || 'Full verified property record managed under EstateFlow AI multi-tenant architecture.'}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bedrooms</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedProperty.bedrooms} Beds</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bathrooms</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedProperty.bathrooms} Baths</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Area Size</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedProperty.sizeSqft} sqft</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Listing Agency & Contact</div>
                <div className="text-[11px] text-purple-300">{selectedProperty.ownerAgent || 'Al-Rehman Real Estate'}</div>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleInquire(selectedProperty);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow transition-all"
              >
                Submit Direct Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
