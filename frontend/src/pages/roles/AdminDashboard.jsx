import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { Activity, ShieldAlert, Server, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/apiClient';

import AdminUsers from '../../features/admin/AdminUsers';
import AdminHackathons from '../../features/admin/AdminHackathons';
import AdminReports from '../../features/admin/AdminReports';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8">
      <SectionHeader title="Global Administration" subtitle="Platform-wide analytics, security, and moderation" />
      
      <div className="border-b border-border flex gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Overview' },
          { id: 'users', label: 'User Management' },
          { id: 'hackathons', label: 'Hackathon Moderation' },
          { id: 'reports', label: 'System Submissions' },
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
               activeTab === tab.id ? 'border-accent-start text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20'
             }`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="overview" />}
        {activeTab === 'users' && <AdminUsers key="users" />}
        {activeTab === 'hackathons' && <AdminHackathons key="hackathons" />}
        {activeTab === 'reports' && <AdminReports key="reports" />}
      </AnimatePresence>

    </div>
  );
}

function OverviewTab() {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    apiClient.get('/admin/analytics').then(res => setAnalytics(res));
  }, []);

  if (!analytics) return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading analytics...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-accent-start/20 w-fit"><Activity className="text-accent-start" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-foreground/50">System Uptime</h3>
            <p className="text-2xl font-bold text-foreground">99.99%</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-foreground/5 w-fit"><Users className="text-foreground" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-foreground/50">Total Platform Users</h3>
            <p className="text-2xl font-bold text-foreground">{analytics.totals.users}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-status-success/20 w-fit"><Server className="text-status-success" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-foreground/50">Total Hackathons</h3>
            <p className="text-2xl font-bold text-foreground">{analytics.totals.hackathons}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4 border-status-error/30">
          <div className="p-3 rounded-xl bg-status-error/20 w-fit"><ShieldAlert className="text-status-error" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-foreground/50">Total Submissions</h3>
            <p className="text-2xl font-bold text-foreground">{analytics.totals.submissions}</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
           <h3 className="text-lg font-semibold text-foreground mb-6">Users by Role</h3>
           <div className="space-y-4">
             {analytics.distribution.usersByRole.map((role, idx) => (
               <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                 <div>
                   <p className="text-sm font-medium text-foreground">{role._id || 'Participant'}</p>
                 </div>
                 <span className="text-sm font-bold text-foreground">{role.count}</span>
               </div>
             ))}
           </div>
        </GlassCard>
        
        <GlassCard>
           <h3 className="text-lg font-semibold text-foreground mb-6">Hackathons by Mode</h3>
           <div className="space-y-4">
             {analytics.distribution.hackathonsByMode.map((mode, idx) => (
               <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                 <div>
                   <p className="text-sm font-medium text-foreground">{mode._id}</p>
                 </div>
                 <span className="text-sm font-bold text-foreground">{mode.count}</span>
               </div>
             ))}
           </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
