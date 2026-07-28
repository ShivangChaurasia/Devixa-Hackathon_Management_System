import React, { useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import Table from '../../components/ui/Table';
import { Activity, ShieldAlert, Server, Users, Search, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8">
      <SectionHeader title="Global Administration" subtitle="Platform-wide analytics, security, and moderation" />
      
      <div className="border-b border-border flex gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Overview' },
          { id: 'moderation', label: 'User Moderation' },
          { id: 'verification', label: 'Verification Queue' },
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
               activeTab === tab.id ? 'border-accent-start text-white' : 'border-transparent text-white/50 hover:text-white hover:border-white/20'
             }`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="overview" />}
        {activeTab === 'moderation' && <ModerationTab key="moderation" />}
        {activeTab === 'verification' && <VerificationTab key="verification" />}
      </AnimatePresence>

    </div>
  );
}

function OverviewTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-accent-start/20 w-fit"><Activity className="text-accent-start" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-white/50">System Uptime</h3>
            <p className="text-2xl font-bold text-white">99.99%</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-white/5 w-fit"><Users className="text-white" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-white/50">Total Platform Users</h3>
            <p className="text-2xl font-bold text-white">124,592</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-status-success/20 w-fit"><Server className="text-status-success" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-white/50">Active Hackathons</h3>
            <p className="text-2xl font-bold text-white">48</p>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-4 border-status-error/30">
          <div className="p-3 rounded-xl bg-status-error/20 w-fit"><ShieldAlert className="text-status-error" size={24}/></div>
          <div>
            <h3 className="text-sm font-medium text-white/50">Security Alerts</h3>
            <p className="text-2xl font-bold text-status-error">0</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
           <h3 className="text-lg font-semibold text-white mb-6">Recent Audit Logs</h3>
           <div className="space-y-4">
             {[
               { action: 'API Key Rotated', user: 'Admin Jane', time: '10 mins ago' },
               { action: 'Role Updated (User -> Organizer)', user: 'System', time: '1 hour ago' },
               { action: 'Failed Login Attempt (IP: 192.168.1.1)', user: 'Unknown', time: '3 hours ago' }
             ].map((log, idx) => (
               <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                 <div>
                   <p className="text-sm font-medium text-white">{log.action}</p>
                   <p className="text-xs text-white/50">{log.user}</p>
                 </div>
                 <span className="text-xs text-white/40">{log.time}</span>
               </div>
             ))}
           </div>
        </GlassCard>
        
        <GlassCard>
           <h3 className="text-lg font-semibold text-white mb-6">Platform Settings Quick Access</h3>
           <div className="space-y-3">
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white">Manage Roles & Permissions</button>
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white">Global Email Templates</button>
             <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white">Database Backup & Health</button>
             <button className="w-full text-left px-4 py-3 rounded-xl bg-status-error/10 hover:bg-status-error/20 transition-colors text-sm font-medium text-status-error border border-status-error/20 mt-4">Trigger Platform Maintenance Mode</button>
           </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

function ModerationTab() {
  const columns = [
    { header: 'Reported User', accessorKey: 'user' },
    { header: 'Reason', accessorKey: 'reason' },
    { header: 'Reported By', accessorKey: 'reporter' },
    { 
      header: 'Severity', 
      cell: (row) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${row.severity === 'High' ? 'bg-status-error/20 text-status-error' : 'bg-status-warning/20 text-status-warning'}`}>
          {row.severity}
        </span>
      )
    },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex gap-2">
          <button className="text-xs font-medium text-status-error hover:text-white px-3 py-1 rounded-lg bg-status-error/10 hover:bg-status-error transition-colors">Ban</button>
          <button className="text-xs font-medium text-white/60 hover:text-white px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Dismiss</button>
        </div>
      ) 
    }
  ];

  const data = [
    { id: '1', user: 'SpamBot99', reason: 'Spamming team invites', reporter: 'Alex', severity: 'Medium' },
    { id: '2', user: 'CodeThief', reason: 'Plagiarized submission repo', reporter: 'Organizer_Dev', severity: 'High' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex items-center gap-4 bg-status-error/10 border border-status-error/20 p-4 rounded-xl">
        <AlertOctagon className="text-status-error" size={24} />
        <div>
          <h4 className="font-semibold text-white">2 Pending Reports</h4>
          <p className="text-sm text-white/70">Review these urgently to maintain platform integrity.</p>
        </div>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <Table columns={columns} data={data} />
      </GlassCard>
    </motion.div>
  );
}

function VerificationTab() {
  const columns = [
    { header: 'Organization', accessorKey: 'org' },
    { header: 'Requested By', accessorKey: 'requester' },
    { header: 'Documents Provided', cell: () => <span className="text-accent-start hover:underline cursor-pointer">Tax_ID.pdf, Charter.pdf</span> },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-xs font-medium text-status-success hover:text-white px-3 py-1 rounded-lg bg-status-success/10 hover:bg-status-success transition-colors">
            <CheckCircle2 size={12} /> Approve
          </button>
          <button className="text-xs font-medium text-white/60 hover:text-white px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Reject</button>
        </div>
      ) 
    }
  ];

  const data = [
    { id: '1', org: 'Stanford ACM', requester: 'John Doe' },
    { id: '2', org: 'NextGen Innovators', requester: 'Jane Smith' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <GlassCard className="p-0 overflow-hidden">
        <Table columns={columns} data={data} />
      </GlassCard>
    </motion.div>
  );
}
