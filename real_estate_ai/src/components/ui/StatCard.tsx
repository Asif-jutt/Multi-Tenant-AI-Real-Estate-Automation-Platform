import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  linkUrl?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
  sparklineData?: number[];
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  linkUrl = '#',
  linkLabel = 'View details',
  icon,
  sparklineData = [12, 19, 15, 22, 28, 24, 32],
  badgeText
}) => {
  // Sparkline path generation
  const max = Math.max(...sparklineData, 1);
  const min = Math.min(...sparklineData, 0);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 80;
      const y = 28 - ((val - min) / range) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
            {badgeText && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {badgeText}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</div>
        </div>
        {icon && <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{icon}</div>}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {trend === 'up' && (
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500">vs last period</span>
        </div>

        {/* Sparkline chart */}
        <div className="w-20 h-7 overflow-hidden">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 80 28">
            <polyline
              fill="none"
              stroke={trend === 'down' ? '#f43f5e' : '#10b981'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {linkUrl && (
        <div className="mt-2 text-right">
          <Link
            href={linkUrl}
            className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline inline-flex items-center"
          >
            {linkLabel} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};
