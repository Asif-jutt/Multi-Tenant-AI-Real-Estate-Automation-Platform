'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Property } from '../../types';
import {
  Home,
  Search,
  Filter,
  Plus,
  Grid,
  List,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Building,
  BedDouble,
  Bath,
  Maximize2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';

export const PropertiesModule: React.FC = () => {
  const { properties, addToast } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filtered = properties.filter((p) => {
    if (filterCity !== 'all' && p.city.toLowerCase() !== filterCity.toLowerCase()) return false;
    if (filterType !== 'all' && p.propertyType !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Verified Property Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified database listings with RAG document indexing & availability timestamps
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-sm text-purple-600' : 'text-slate-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-sm text-purple-600' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties by title, area, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Cities</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
            <option value="karachi">Karachi</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Property Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House / Villa</option>
            <option value="commercial_office">Commercial Office</option>
          </select>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image header with badges */}
                <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="success">{p.status.toUpperCase()}</Badge>
                    {p.featured && <Badge variant="warning">FEATURED</Badge>}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="ai">RAG Index: {p.documentIndexingStatus}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" /> {p.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                    PKR {(p.price / 1000000).toFixed(1)} Million
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 py-2 border-y border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-purple-500" /> {p.bedrooms} Beds</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-purple-500" /> {p.bathrooms} Baths</span>
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-purple-500" /> {p.sizeSqft} SqFt</span>
                  </div>

                  {/* Trust indicator (CRITICAL TRUST UI REQUIREMENT) */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified: {p.verifiedTimestamp}
                    </span>
                    <span className="font-semibold text-slate-500">{p.dataSource}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedProperty(p)}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                >
                  View Full Property Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Listing Title</th>
                <th className="p-3">Location & City</th>
                <th className="p-3">Price</th>
                <th className="p-3">Beds / SqFt</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Verified</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{p.title}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{p.location}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">PKR {(p.price / 1000000).toFixed(1)}M</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{p.bedrooms} Beds • {p.sizeSqft} SqFt</td>
                  <td className="p-3"><Badge variant="success">{p.status}</Badge></td>
                  <td className="p-3 text-slate-500">{p.verifiedTimestamp}</td>
                  <td className="p-3">
                    <button onClick={() => setSelectedProperty(p)} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Detail Modal */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.title || 'Property Detail'}
        maxWidth="2xl"
      >
        {selectedProperty && (
          <div className="space-y-6 text-xs">
            {/* Gallery Image */}
            <div className="h-56 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={selectedProperty.images[0]} alt={selectedProperty.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{selectedProperty.title}</h3>
                <p className="text-slate-500 mt-0.5">{selectedProperty.location}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                  PKR {(selectedProperty.price / 1000000).toFixed(1)} Million
                </div>
                <Badge variant="success">{selectedProperty.status.toUpperCase()}</Badge>
              </div>
            </div>

            {/* Trust badge note */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Database Verified Fact: Price & Availability confirmed
              </span>
              <span>{selectedProperty.verifiedTimestamp}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Property Description</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProperty.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Amenities & Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.amenities.map((a, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  addToast({ type: 'success', title: 'Listing Link Shared', message: 'Shareable link copied to clipboard.' });
                  setSelectedProperty(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                Share Property Link
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
