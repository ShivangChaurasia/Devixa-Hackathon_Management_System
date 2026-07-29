import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import Table from '../../components/ui/Table';
import SecondaryNav from '../../components/layout/SecondaryNav';
import { UserPlus, Shield, X, Mail, MessageSquare, FileText, CheckSquare, UploadCloud, Link as LinkIcon, Send } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: teamRes, loading, execute: fetchTeam } = useApi(apiClient.get);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    fetchTeam(`/teams/${id}`).catch(() => null);
  }, [id, fetchTeam]);

  const team = teamRes?.team;

  if (loading) return <div className="p-20 text-center"><div className="w-8 h-8 mx-auto border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div></div>;
  if (!team) return <div className="p-20 text-center text-foreground/50">Team not found.</div>;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title={team.name} 
        subtitle={`Workspace for Hackathon ${team.hackathon?.title || team.hackathonId || ''}`} 
        action={<GradientButton onClick={() => navigate(`/app/teams/${team._id || team.id}/submit`)}>Submit Project</GradientButton>}
      />

      <div className="border-b border-border flex gap-6 overflow-x-auto">
        {[
          { id: 'members', label: 'Members', icon: Shield },
          { id: 'chat', label: 'Team Chat', icon: MessageSquare },
          { id: 'files', label: 'Shared Files', icon: FileText },
          { id: 'tasks', label: 'Task Board', icon: CheckSquare },
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors border-b-2 ${
               activeTab === tab.id ? 'border-accent-start text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20'
             }`}
           >
             <tab.icon size={16} className={activeTab === tab.id ? 'text-accent-start' : ''} />
             {tab.label}
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'members' && <MembersTab key="members" members={team.members || []} />}
        {activeTab === 'chat' && <ChatTab key="chat" />}
        {activeTab === 'files' && <FilesTab key="files" />}
        {activeTab === 'tasks' && <TasksTab key="tasks" />}
      </AnimatePresence>
    </div>
  );
}

// Sub-components

function MembersTab({ members }) {
  const columns = [
    {
      header: 'Member',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium">{(row.user?.name || row.name || 'U').charAt(0)}</div>
          <span className="font-medium text-foreground">{row.user?.name || row.name}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (row) => (
        <span className="flex items-center gap-1.5 px-2 py-1 bg-foreground/5 border border-foreground/10 rounded-lg text-xs w-fit">
          {row.role === 'Leader' && <Shield size={12} className="text-accent-start" />}
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${row.status === 'Joined' ? 'bg-status-success/20 text-status-success' : 'bg-status-warning/20 text-status-warning'}`}>
          {row.status || 'Joined'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <button className="p-2 text-foreground/40 hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors">
          <X size={16} />
        </button>
      ),
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md flex items-center">
          <div className="absolute left-4 text-foreground/40"><Mail size={18} /></div>
          <input type="email" placeholder="Invite member by email..." className="w-full bg-card border border-border rounded-xl pl-12 pr-32 py-3 text-sm text-foreground focus:border-accent-start outline-none" />
          <button className="absolute right-2 px-4 py-1.5 bg-foreground/10 hover:bg-foreground/20 text-foreground text-sm font-medium rounded-lg transition-colors">Send Invite</button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border text-foreground/70 hover:text-foreground transition-colors text-sm font-medium">
            <LinkIcon size={16} /> Copy Invite Link
          </button>
        </div>
      </div>
      <Table columns={columns} data={members} />
    </motion.div>
  );
}

function ChatTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className="h-[500px] flex flex-col p-0 overflow-hidden border-border bg-card/50">
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end space-y-4">
          <div className="text-center text-xs text-foreground/30 uppercase tracking-wider mb-4">Today</div>
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0 mt-1" />
             <div className="bg-foreground/5 border border-border rounded-2xl rounded-tl-none p-3 max-w-[80%]">
               <p className="text-xs text-accent-start mb-1 font-medium">Sarah</p>
               <p className="text-sm text-foreground/80">I just updated the database schema. Can someone review?</p>
             </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
             <div className="bg-accent-start/20 border border-accent-start/30 rounded-2xl rounded-tr-none p-3 max-w-[80%]">
               <p className="text-sm text-foreground/90">Looks good! I'll connect the API endpoints now.</p>
             </div>
          </div>
        </div>
        <div className="p-4 border-t border-border bg-card">
          <div className="relative">
            <input type="text" placeholder="Message your team..." className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-foreground focus:border-accent-start outline-none" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-foreground/40 hover:text-accent-start transition-colors"><Send size={18} /></button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FilesTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-foreground/[0.02] transition-colors cursor-pointer mb-6">
        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4 text-foreground/50">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-foreground font-medium mb-1">Upload Files</h3>
        <p className="text-sm text-foreground/50">Drag and drop architecture diagrams, assets, or pitch decks.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="flex items-center gap-4 p-4 cursor-pointer hover:bg-foreground/[0.02]">
          <div className="p-3 rounded-lg bg-status-info/10 text-status-info"><FileText size={20} /></div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-0.5">System_Architecture.pdf</h4>
            <p className="text-xs text-foreground/40">Added by Sarah • 2.4 MB</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

function TasksTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex gap-4 items-center justify-between mb-6">
         <h3 className="font-semibold text-foreground">To-Do List</h3>
         <button className="px-4 py-2 bg-foreground/5 border border-border rounded-lg text-sm text-foreground hover:bg-foreground/10 transition-colors">+ Add Task</button>
      </div>
      <div className="space-y-3">
        {[
          { text: "Design database schema", done: true },
          { text: "Setup authentication flow", done: true },
          { text: "Integrate Devixa APIs", done: false },
          { text: "Record demo video", done: false },
        ].map((task, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${task.done ? 'bg-foreground/[0.02] border-transparent' : 'bg-card border-border'} transition-colors`}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${task.done ? 'bg-accent-start border-accent-start text-foreground' : 'border-foreground/20'}`}>
              {task.done && <CheckSquare size={12} />}
            </div>
            <span className={`text-sm ${task.done ? 'text-foreground/40 line-through' : 'text-foreground/80'}`}>{task.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
