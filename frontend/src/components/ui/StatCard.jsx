import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, trendUp = true, color = 'accent', children }) {
  const colors = {
    accent: 'from-accent-start to-accent-end shadow-accent-start/20',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-400 to-amber-600 shadow-amber-500/20',
    blue: 'from-blue-400 to-blue-600 shadow-blue-500/20',
  };

  return (
    <GlassCard hover={true} className="flex flex-col relative group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-foreground/60 text-sm font-medium mb-1">{title}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-foreground`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-status-success/15 text-status-success' : 'bg-status-error/15 text-status-error'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
        <span className="text-foreground/40 text-xs">{trendLabel}</span>
      </div>

      {children && (
        <div className="absolute bottom-0 inset-x-0 h-12 opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {children}
        </div>
      )}
    </GlassCard>
  );
}
