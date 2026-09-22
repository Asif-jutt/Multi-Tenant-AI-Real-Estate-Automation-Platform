'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertTriangle, Plus, ShieldCheck } from 'lucide-react';

export const AppointmentsModule: React.FC = () => {
  const { appointments, addToast } = useApp();
  const [viewTab, setViewTab] = useState<'calendar' | 'list'>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Viewing Schedule & Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synced with Google Calendar & WhatsApp confirmation notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Google Workspace Synced
          </div>
          <button
            onClick={() =>
              addToast({ type: 'success', title: 'Viewing Added', message: 'New viewing appointment scheduled.' })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow"
          >
            <Plus className="w-4 h-4" /> Book Viewing
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={app.status === 'confirmed' ? 'success' : 'warning'}>
                  {app.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-400">{app.customerTimezone}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{app.customerName}</h3>
                <p className="text-xs text-slate-500">{app.customerPhone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100">{app.propertyTitle}</div>
                <div className="text-slate-500">{app.propertyLocation}</div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <Clock className="w-4 h-4" />
                <span>{app.date} at {app.time}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Agent: {app.agentName}</span>
              <button
                onClick={() =>
                  addToast({ type: 'info', title: 'Reminder Sent', message: `WhatsApp reminder dispatched to ${app.customerName}.` })
                }
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Send Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
