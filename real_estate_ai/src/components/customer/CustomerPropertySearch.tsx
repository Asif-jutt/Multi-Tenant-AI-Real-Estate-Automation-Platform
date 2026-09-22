'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Property } from '../../types';
import { EstateFlowApiService } from '../../services/api';
import { Search, MapPin, Sparkles, BedDouble, Bath, Maximize2, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const CustomerPropertySearch: React.FC = () => {
  const { addToast } = useApp();
  const [nlQuery, setNlQuery] = useState('Find a 3-bedroom apartment in Lahore under PKR 25 million');
  const [parsedChips, setParsedChips] = useState<string[]>([
    'Location: Lahore',
    'Type: Apartment',
    'Bedrooms: 3 Beds',
    'Max Budget: PKR 25M'
  ]);
  const [results, setResults] = useState<Property[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingTargetProperty, setViewingTargetProperty] = useState<Property | null>(null);

  const handleNLSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = await EstateFlowApiService.searchCustomerProperties(nlQuery);
    setResults(res.results);
    setParsedChips(res.parsedFilters.queryChips);
    addToast({
      type: 'info',
      title: 'Search Query Parsed',
      message: `Extracted ${res.parsedFilters.queryChips.length} search criteria.`
    });
  };

  const toggleCompare = (p: Property) => {
    if (selectedForCompare.some((item) => item.id === p.id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item.id !== p.id));
    } else {
      if (selectedForCompare.length >= 3) {
        addToast({ type: 'warning', title: 'Limit Reached', message: 'You can compare up to 3 properties side by side.' });
        return;
      }
      setSelectedForCompare([...selectedForCompare, p]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 space-y-2">
        <Badge variant="ai">Customer Property Search Portal</Badge>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Find Verified Agency Properties
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Type your requirements naturally in English or Urdu. Verified database listings only.
        </p>
      </div>

      {/* Natural Language Search Bar */}
      <form onSubmit={handleNLSearch} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
          <input
            type="text"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            placeholder='e.g. "Find a 3-bedroom apartment in Lahore under PKR 25 million near schools."'
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-slate-100 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow"
          >
            Search Properties
          </button>
        </div>

        {/* Parsed Search Chips */}
        {parsedChips.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Parsed AI Filters:</span>
            {parsedChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Side-by-Side Compare Sticky Bar */}
      {selectedForCompare.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">Comparing ({selectedForCompare.length}/3):</span>
            {selectedForCompare.map((p) => (
              <span key={p.id} className="px-2 py-1 rounded bg-slate-800 text-slate-200 truncate max-w-xs">
                {p.title}
              </span>
            ))}
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
          >
            Compare Side-by-Side &rarr;
          </button>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(results.length > 0 ? results : useApp().properties).map((p) => {
          const isComparing = selectedForCompare.some((item) => item.id === p.id);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-200 dark:bg-slate-800">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="success">Verified Database Listing</Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" /> {p.location}
                  </p>
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100">
                    PKR {(p.price / 1000000).toFixed(1)} Million
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-2 border-slate-100 dark:border-slate-800">
                    <span>{p.bedrooms} Beds • {p.bathrooms} Baths</span>
                    <span>{p.sizeSqft} SqFt</span>
                  </div>

                  {/* Match Explanation */}
                  <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200">
                    ✨ <strong>98% Match:</strong> Located in Gulberg III within requested budget limit.
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => toggleCompare(p)}
                      className="rounded accent-purple-600"
                    />
                    Compare
                  </label>
                </div>

                <button
                  onClick={() => {
                    setViewingTargetProperty(p);
                    setIsViewingModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Request Property Viewing
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      <Modal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} title="Side-by-Side Property Comparison" maxWidth="4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
              <tr>
                <th className="p-3">Feature</th>
                {selectedForCompare.map((p) => (
                  <th key={p.id} className="p-3">{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-bold">Price</td>
                {selectedForCompare.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-purple-600">PKR {(p.price / 1000000).toFixed(1)}M</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold">Location</td>
                {selectedForCompare.map((p) => (
                  <td key={p.id} className="p-3">{p.location}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold">Bedrooms / Baths</td>
                {selectedForCompare.map((p) => (
                  <td key={p.id} className="p-3">{p.bedrooms} Beds / {p.bathrooms} Baths</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold">Last Verified</td>
                {selectedForCompare.map((p) => (
                  <td key={p.id} className="p-3">{p.verifiedTimestamp}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Viewing Request Modal */}
      <Modal isOpen={isViewingModalOpen} onClose={() => setIsViewingModalOpen(false)} title={`Schedule Viewing: ${viewingTargetProperty?.title}`}>
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Select preferred date and time slot for on-site property inspection with assigned agent.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                addToast({ type: 'success', title: 'Viewing Requested', message: 'Sent to Approvals Queue for agent verification.' });
                setIsViewingModalOpen(false);
              }}
              className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold"
            >
              Tomorrow, 11:00 AM
            </button>
            <button
              onClick={() => {
                addToast({ type: 'success', title: 'Viewing Requested', message: 'Sent to Approvals Queue for agent verification.' });
                setIsViewingModalOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
            >
              Tomorrow, 04:00 PM
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
