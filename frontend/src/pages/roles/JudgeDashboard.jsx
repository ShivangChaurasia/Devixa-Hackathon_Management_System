import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import Table from '../../components/ui/Table';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import { CheckCircle2, Clock, GitBranch, Link as LinkIcon, FileText, Video, Send, ChevronLeft, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';

export default function JudgeDashboard() {
  const [activeEvaluation, setActiveEvaluation] = useState(null);

  const { data: invitesRes, loading: invitesLoading, execute: fetchInvites } = useApi(apiClient.get);
  const { data: evalsRes, loading: evalsLoading, execute: fetchEvals } = useApi(apiClient.get);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchInvites('/hackathons/judging/invites').catch(() => null);
    fetchEvals('/submissions').catch(() => null);
  }, [fetchInvites, fetchEvals]);

  const handleInviteAction = async (hackathonId, action) => {
    setActionLoading(hackathonId);
    try {
      await apiClient.post(`/hackathons/${hackathonId}/judges/${action}`);
      fetchInvites('/hackathons/judging/invites');
    } catch (err) {
      console.error(`Failed to ${action} invite:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const invites = Array.isArray(invitesRes) ? invitesRes : (invitesRes?.data || []);
  const evaluations = Array.isArray(evalsRes) ? evalsRes : (evalsRes?.data || evalsRes?.submissions || []);

  const columns = [
    { header: 'Project', accessorKey: 'project', cell: (row) => <span className="font-semibold text-foreground">{row.project}</span> },
    { header: 'Team', accessorKey: 'team' },
    { header: 'Hackathon', accessorKey: 'hackathon' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => (
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs w-fit ${row.status === 'Completed' ? 'bg-status-success/20 text-status-success' : 'bg-status-warning/20 text-status-warning'}`}>
          {row.status === 'Completed' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
          {row.status}
        </span>
      )
    },
    { header: 'Score/Due', cell: (row) => row.score || row.dueDate },
    { 
      header: 'Action', 
      cell: (row) => (
        <button 
          onClick={() => setActiveEvaluation(row)}
          className="text-accent-start hover:text-accent-start/80 text-sm font-medium transition-colors"
        >
          {row.status === 'Completed' ? 'View Feedback' : 'Evaluate Now'}
        </button>
      ) 
    }
  ];

  if (activeEvaluation) {
    return (
      <EvaluationScreen 
        project={activeEvaluation} 
        onBack={() => setActiveEvaluation(null)} 
      />
    );
  }

  return (
    <div className="space-y-8">
      {invites.length > 0 && (
        <div className="space-y-4">
          <SectionHeader title="Pending Invites" subtitle="Hackathons requesting your expertise" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invites.map(invite => (
              <GlassCard key={invite._id} className="flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{invite.title}</h3>
                  <p className="text-sm text-foreground/50 mt-1">Organized by {invite.organization || 'Community'}</p>
                </div>
                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                  <button 
                    disabled={actionLoading === invite._id}
                    onClick={() => handleInviteAction(invite._id, 'accept')}
                    className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-status-success/20 text-status-success hover:bg-status-success/30 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button 
                    disabled={actionLoading === invite._id}
                    onClick={() => handleInviteAction(invite._id, 'decline')}
                    className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-status-error/20 text-status-error hover:bg-status-error/30 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <X size={16} /> Decline
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      <SectionHeader title="Evaluation Queue" subtitle="Review and score assigned project submissions" />
      <GlassCard className="p-0 overflow-hidden">
        <Table columns={columns} data={evaluations} />
      </GlassCard>
    </div>
  );
}

function EvaluationScreen({ project, onBack }) {
  const [rubrics, setRubrics] = useState({ innovation: 0, tech: 0, ui: 0, presentation: 0 });
  const totalScore = rubrics.innovation + rubrics.tech + rubrics.ui + rubrics.presentation;
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ChevronLeft size={16} /> Back to Queue
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{project.project}</h2>
          <p className="text-foreground/60">Submitted by <span className="font-semibold text-foreground">{project.team}</span> • {project.hackathon}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-accent-start">{totalScore} <span className="text-lg text-foreground/40">/ 40</span></div>
          <p className="text-xs text-foreground/50 uppercase tracking-wider">Total Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Project Materials */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
             <h3 className="font-semibold text-foreground mb-4">Project Description</h3>
             <p className="text-sm text-foreground/70 leading-relaxed mb-6">
               HealthTracker AI is a revolutionary platform that aggregates biometric data from various wearables and uses a fine-tuned LLM to predict early signs of fatigue, stress, and illness.
             </p>
             <h4 className="text-sm font-medium text-foreground mb-2">Tech Stack</h4>
             <div className="flex gap-2">
               {['React', 'Python', 'TensorFlow', 'PostgreSQL'].map(t => <span key={t} className="px-2 py-1 rounded bg-foreground/5 text-xs text-foreground/80">{t}</span>)}
             </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-foreground mb-4">Links & Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-accent-start/50 transition-colors group">
                 <GitBranch className="text-foreground/40 group-hover:text-accent-start" size={20} />
                 <span className="text-sm font-medium text-foreground">GitHub Repo</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-accent-start/50 transition-colors group">
                 <LinkIcon className="text-foreground/40 group-hover:text-accent-start" size={20} />
                 <span className="text-sm font-medium text-foreground">Live Demo</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-accent-start/50 transition-colors group">
                 <Video className="text-foreground/40 group-hover:text-accent-start" size={20} />
                 <span className="text-sm font-medium text-foreground">Pitch Video</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-accent-start/50 transition-colors group">
                 <FileText className="text-foreground/40 group-hover:text-accent-start" size={20} />
                 <span className="text-sm font-medium text-foreground">Pitch_Deck.pdf</span>
               </a>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col h-[400px] p-0 overflow-hidden">
             <div className="p-4 border-b border-border bg-foreground/5 flex justify-between items-center">
               <h3 className="font-semibold text-foreground">Judge ↔ Organizer Discussion</h3>
               <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded">Private Thread</span>
             </div>
             <div className="flex-1 p-4 overflow-y-auto space-y-4">
               <div className="flex flex-col items-start gap-1">
                 <span className="text-xs font-medium text-foreground/50">Organizer</span>
                 <div className="px-3 py-2 rounded-xl rounded-tl-none bg-foreground/5 text-sm text-foreground/80 max-w-[80%]">
                   Hi Judge! Please note that this team submitted their video 5 minutes late due to YouTube rendering issues. We have approved it.
                 </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                 <span className="text-xs font-medium text-foreground/50">You</span>
                 <div className="px-3 py-2 rounded-xl rounded-tr-none bg-accent-start/20 text-sm text-foreground max-w-[80%]">
                   Noted. I'll evaluate the video without penalties.
                 </div>
               </div>
             </div>
             <div className="p-4 border-t border-border bg-background/50 relative">
               <input type="text" placeholder="Send a message to organizers..." className="w-full bg-card border border-border pl-4 pr-12 py-3 rounded-xl text-sm text-foreground focus:border-accent-start outline-none transition-colors" />
               <button className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-accent-start hover:bg-accent-end transition-colors text-foreground">
                  <Send size={14} />
               </button>
             </div>
          </GlassCard>
        </div>

        {/* Right Col: Scoring Rubric */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="sticky top-24">
             <h3 className="font-semibold text-foreground mb-6">Evaluation Rubric</h3>
             
             <div className="space-y-6">
               {[
                 { id: 'innovation', label: 'Innovation & Originality' },
                 { id: 'tech', label: 'Technical Quality' },
                 { id: 'ui', label: 'UI/UX Design' },
                 { id: 'presentation', label: 'Presentation & Docs' }
               ].map(rubric => (
                 <div key={rubric.id} className="space-y-2">
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-foreground/70">{rubric.label}</span>
                     <span className="font-bold text-accent-start">{rubrics[rubric.id]} / 10</span>
                   </div>
                   <input 
                     type="range" 
                     min="0" max="10" 
                     value={rubrics[rubric.id]}
                     onChange={e => setRubrics({...rubrics, [rubric.id]: parseInt(e.target.value)})}
                     className="w-full accent-accent-start cursor-pointer"
                   />
                 </div>
               ))}
             </div>
             
             <div className="mt-8 space-y-2">
               <label className="text-sm font-medium text-foreground/70">Private Remarks (Only Organizers see this)</label>
               <textarea rows="3" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:border-accent-start outline-none transition-colors" placeholder="Leave your notes..."></textarea>
             </div>

             <div className="mt-6 flex flex-col gap-3">
               <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
                 <input type="checkbox" className="rounded accent-accent-start bg-background border-border" />
                 Recommend for Special Mention
               </label>
               <GradientButton className="w-full">Submit Final Score</GradientButton>
             </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
