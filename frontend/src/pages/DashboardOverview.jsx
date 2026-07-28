import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Clock, Users, ArrowRight, Calendar, Trophy, Mail, Award, CheckCircle2, AlertCircle, Megaphone, FileText } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

export default function DashboardOverview({ user: propUser }) {
  const context = useOutletContext();
  const user = propUser || context?.user;
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'User';

  const { data: hackathonsRes, loading: loadingH, execute: fetchHackathons } = useApi(apiClient.get);
  const { data: teamsRes, loading: loadingT, execute: fetchTeams } = useApi(apiClient.get);
  const { data: notifsRes, loading: loadingN, execute: fetchNotifs } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathons('/hackathons?status=Active,Upcoming');
    // Ignore errors for these if endpoints don't fully exist yet
    fetchTeams('/teams/my-teams').catch(() => {});
    fetchNotifs('/notifications').catch(() => {});
  }, [fetchHackathons, fetchTeams, fetchNotifs]);

  const activeHackathons = hackathonsRes?.hackathons || [];
  const myTeams = teamsRes?.teams || [];
  const notifications = notifsRes?.notifications || [];

  const pendingInvites = notifications.filter(n => n.type === 'TEAM_INVITE' && !n.read);
  
  // Calculate upcoming deadlines from active hackathons
  const upcomingDeadlines = activeHackathons.filter(h => {
    if (!h.submissionDeadline) return false;
    const deadline = new Date(h.submissionDeadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 14;
  });

  const loading = loadingH || loadingT || loadingN;

  if (loading) {
    return <div className="text-white/50 text-center py-20">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative pb-8 border-b border-border">
        <h1 className="text-[36px] font-bold tracking-tight text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end">{firstName}</span>
        </h1>
        <p className="text-white/60 text-base max-w-2xl">
          {upcomingDeadlines.length > 0
            ? <>You have <strong className="text-white">{upcomingDeadlines.length} upcoming deadline{upcomingDeadlines.length > 1 ? 's' : ''}</strong> this week.</>
            : 'Here\'s what\'s happening across your hackathons.'
          }
        </p>
        <div className="absolute top-0 right-10 w-[300px] h-[300px] bg-accent-start/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      </motion.div>

      {/* Urgent: Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-status-warning" />
            <h2 className="text-lg font-semibold text-white">Upcoming Deadlines</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingDeadlines.map(h => {
              const deadline = new Date(h.submissionDeadline);
              const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));
              return (
                <GlassCard
                  key={h._id || h.id}
                  className="flex items-center gap-4 cursor-pointer border-status-warning/20 bg-status-warning/[0.03]"
                  onClick={() => navigate(`/app/hackathons/${h._id || h.id}`)}
                >
                  <div className="p-3 rounded-xl bg-status-warning/10">
                    <Clock className="text-status-warning" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{h.title}</h3>
                    <p className="text-xs text-white/50">Submission closes in <strong className="text-status-warning">{daysLeft} day{daysLeft > 1 ? 's' : ''}</strong></p>
                  </div>
                  <ArrowRight size={18} className="text-white/30" />
                </GlassCard>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-4">
            <Mail size={18} className="text-status-info" />
            <h2 className="text-lg font-semibold text-white">Pending Invitations</h2>
          </div>
          <div className="space-y-3">
            {pendingInvites.map(invite => (
              <GlassCard key={invite._id || invite.id} className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/app/teams')}>
                <div className="p-3 rounded-xl bg-status-info/10">
                  <Users className="text-status-info" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">{invite.title}</h3>
                  <p className="text-xs text-white/50">{invite.message}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-status-success/10 text-status-success text-xs font-medium hover:bg-status-success/20 transition-colors">Accept</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-colors">Decline</button>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Hackathons */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-accent-start" />
            <h2 className="text-lg font-semibold text-white">Active Hackathons</h2>
          </div>
          <button onClick={() => navigate('/app/hackathons')} className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
            View All <ArrowRight size={14} />
          </button>
        </div>
        
        {activeHackathons.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeHackathons.slice(0, 2).map(hackathon => (
              <GlassCard key={hackathon._id || hackathon.id} className="group cursor-pointer p-5" onClick={() => navigate(`/app/hackathons/${hackathon._id || hackathon.id}`)}>
                <div className="flex gap-4">
                  <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=200&q=80'} alt={hackathon.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-base group-hover:text-accent-start transition-colors">{hackathon.title}</h3>
                    <p className="text-xs text-white/50 mb-2">{hackathon.organization}</p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-status-success/10 text-status-success text-[10px] font-medium border border-status-success/20 uppercase tracking-wider">
                        {hackathon.status}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center py-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Calendar size={20} className="text-white/30" />
            </div>
            <h3 className="text-white font-medium mb-1">No Active Hackathons</h3>
            <p className="text-white/50 text-sm mb-6 max-w-sm">You aren't participating in any active hackathons right now. Explore upcoming events to get started.</p>
            <GradientButton onClick={() => navigate('/app/hackathons')}>
              Browse Hackathons
            </GradientButton>
          </GlassCard>
        )}
      </motion.div>

      {/* Announcements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={18} className="text-status-info" />
          <h2 className="text-lg font-semibold text-white">Recent Announcements</h2>
        </div>
        <GlassCard className="p-0 overflow-hidden divide-y divide-border">
          {notifications.filter(n => n.type === 'ANNOUNCEMENT').slice(0, 3).map(ann => (
            <div key={ann._id || ann.id} className="p-4 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate('/app/notifications')}>
              <div className="w-8 h-8 rounded-full bg-status-info/10 flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone size={14} className="text-status-info" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">{ann.title}</h4>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-2">{ann.message}</p>
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{new Date(ann.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {notifications.filter(n => n.type === 'ANNOUNCEMENT').length === 0 && (
             <div className="p-6 text-center text-white/50 text-sm">No new announcements at this time.</div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
