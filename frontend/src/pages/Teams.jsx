import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import Modal from '../components/ui/Modal';
import { Plus, Users, Shield, Link2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

export default function Teams() {
  const { data: teamsRes, loading, execute: fetchTeams } = useApi(apiClient.get);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams('/teams/my-teams').catch(() => null);
  }, [fetchTeams]);

  const teams = teamsRes?.teams || [];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="My Teams" 
        subtitle="Manage your teams and invitations" 
        action={<GradientButton onClick={() => setCreateModalOpen(true)}><Plus size={16} /> Create Team</GradientButton>}
      />

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div></div>
      ) : teams.length === 0 ? (
        <GlassCard className="text-center py-20">
          <Users className="mx-auto text-foreground/20 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-foreground mb-2">No teams yet</h3>
          <p className="text-foreground/50 mb-6">Create a team to register for hackathons or accept an invitation.</p>
          <GradientButton onClick={() => setCreateModalOpen(true)}>Create Your First Team</GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <GlassCard key={team._id || team.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-start/20 to-accent-end/20 border border-accent-start/30 flex items-center justify-center text-accent-start font-display font-bold text-xl shadow-lg">
                  {(team.name || 'T').charAt(0)}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${team.status === 'REGISTERED' ? 'bg-status-success/20 text-status-success' : 'bg-status-warning/20 text-status-warning'}`}>
                  {team.status || 'DRAFT'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">{team.name}</h3>
              <p className="text-foreground/50 text-sm mb-6 flex items-center gap-2"><Link2 size={14}/> Connected to Hackathon {team.hackathon?.title || team.hackathonId}</p>

              <div className="mt-auto border-t border-border pt-4">
                <p className="text-xs text-foreground/50 uppercase tracking-wider mb-3">Members ({team.members?.length || 0}/4)</p>
                <div className="flex flex-col gap-2">
                  {team.members?.map(member => (
                    <div key={member.user?._id || member.id} className="flex items-center justify-between p-2 rounded-lg bg-foreground/5 border border-foreground/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium text-foreground">{(member.user?.name || member.name || 'U').charAt(0)}</div>
                        <span className="text-sm text-foreground/80">{member.user?.name || member.name}</span>
                      </div>
                      <span className="text-[10px] text-foreground/40 flex items-center gap-1">
                        {member.role === 'Leader' && <Shield size={10} className="text-accent-start" />}
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                 <button onClick={() => navigate(`/app/teams/${team._id || team.id}/manage`)} className="flex-1 py-2 rounded-xl bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors text-sm font-medium border border-border">Manage</button>
                 <button onClick={() => navigate(`/app/teams/${team._id || team.id}/submit`)} className="flex-1 py-2 rounded-xl bg-accent-start/20 text-accent-start hover:bg-accent-start/30 transition-colors text-sm font-medium border border-accent-start/30">Submit Project</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Team">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCreateModalOpen(false); }}>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">Team Name</label>
            <input type="text" required placeholder="e.g. CyberPunks" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">Select Hackathon</label>
            <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors appearance-none">
              <option value="h1">Global AI Summit Hackathon</option>
              <option value="h2">Web3 Builders Challenge</option>
            </select>
          </div>
          <GradientButton type="submit" className="w-full py-3 mt-2">Create Team</GradientButton>
        </form>
      </Modal>
    </div>
  );
}
