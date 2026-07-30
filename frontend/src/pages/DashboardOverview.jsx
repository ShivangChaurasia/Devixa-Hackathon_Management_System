import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Clock, Users, ArrowRight, Calendar, Trophy, Mail, CheckCircle2, AlertCircle, Megaphone, Activity, Sparkles, ChevronRight, FileText } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';
import { SkeletonCockpit } from '../components/ui/Skeleton';
import GlobalUserSearch from '../components/ui/GlobalUserSearch';

export default function DashboardOverview({ user: propUser }) {
  const context = useOutletContext();
  const user = propUser || context?.user;
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'User';

  const { data: hackathonsRes, loading: loadingH, execute: fetchHackathons } = useApi(apiClient.get);
  const { data: teamsRes, loading: loadingT, execute: fetchTeams } = useApi(apiClient.get);
  const { data: notifsRes, loading: loadingN, execute: fetchNotifs } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathons('/hackathons?status=UPCOMING,REGISTRATION_OPEN,ONGOING');
    fetchTeams('/teams/my-teams').catch(() => {});
    fetchNotifs('/notifications').catch(() => {});
  }, [fetchHackathons, fetchTeams, fetchNotifs]);

  const activeHackathons = Array.isArray(hackathonsRes) ? hackathonsRes : (hackathonsRes?.items || hackathonsRes?.hackathons || hackathonsRes?.data || []);
  const myTeams = Array.isArray(teamsRes) ? teamsRes : (teamsRes?.teams || teamsRes?.data || []);
  const notifications = Array.isArray(notifsRes) ? notifsRes : (notifsRes?.notifications || notifsRes?.data || []);

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
    return <SkeletonCockpit />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* 1. Dynamic Hero Section */}
      <motion.div variants={itemVariants} className="relative w-full rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-br from-accent-start/10 via-background to-accent-end/10 border border-accent-start/20 shadow-lg">
        {/* Abstract Glow Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent-start/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-accent-end/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-start/15 border border-accent-start/30 text-accent-start text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> Welcome to your workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Ready to build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end">amazing</span> today?
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl font-medium leading-relaxed mb-8">
            {upcomingDeadlines.length > 0
              ? <>You have <strong className="text-foreground">{upcomingDeadlines.length} urgent deadline{upcomingDeadlines.length > 1 ? 's' : ''}</strong> approaching. Jump right back in and push your project across the finish line!</>
              : 'Discover new hackathons, join teams, and showcase your skills to the world.'
            }
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <GradientButton onClick={() => navigate('/app/hackathons')} className="px-8 py-3.5 text-sm font-semibold rounded-xl shadow-xl shadow-accent-start/20 flex items-center gap-2 group">
              Browse Hackathons
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </GradientButton>
            <button onClick={() => navigate('/app/profile')} className="px-8 py-3.5 text-sm font-semibold rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </motion.div>

      <GlobalUserSearch isAuthenticated={true} />

      {/* 2. Premium Stat Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-5 p-6 hover:border-accent-start/30 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-accent-start/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Trophy size={28} className="text-accent-start" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-1">Active Events</p>
            <h3 className="text-3xl font-bold text-foreground">{activeHackathons.length}</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-5 p-6 hover:border-status-info/30 transition-colors group cursor-pointer" onClick={() => navigate('/app/teams')}>
          <div className="w-14 h-14 rounded-2xl bg-status-info/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Mail size={28} className="text-status-info" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-1">Pending Invites</p>
            <h3 className="text-3xl font-bold text-foreground">{pendingInvites.length}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-5 p-6 hover:border-status-success/30 transition-colors group cursor-pointer" onClick={() => navigate('/app/teams')}>
          <div className="w-14 h-14 rounded-2xl bg-status-success/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Users size={28} className="text-status-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-1">My Teams</p>
            <h3 className="text-3xl font-bold text-foreground">{myTeams.length}</h3>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Active & Urgent */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Urgent: Upcoming Deadlines */}
          <AnimatePresence>
            {upcomingDeadlines.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-status-warning/15 rounded-lg border border-status-warning/30 shadow-inner">
                      <AlertCircle size={18} className="text-status-warning" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Urgent Deadlines</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingDeadlines.map(h => {
                    const deadline = new Date(h.submissionDeadline);
                    const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));
                    return (
                      <GlassCard
                        key={h._id || h.id}
                        className="group flex flex-col justify-between p-5 cursor-pointer border-status-warning/20 bg-gradient-to-b from-status-warning/[0.03] to-transparent hover:border-status-warning/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-status-warning/10"
                        onClick={() => navigate(`/app/hackathons/${h._id || h.id}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-status-warning/15 shadow-inner">
                            <Clock className="text-status-warning" size={24} />
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-warning/15 text-status-warning text-xs font-bold uppercase tracking-wide">
                            {daysLeft} Day{daysLeft !== 1 && 's'} Left
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-status-warning transition-colors line-clamp-1">{h.title}</h3>
                          <p className="text-sm text-foreground/60 line-clamp-1">{h.organization}</p>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Hackathons */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-accent-start/15 rounded-lg border border-accent-start/30 shadow-inner">
                  <Activity size={18} className="text-accent-start" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Active Hackathons</h2>
              </div>
              <button onClick={() => navigate('/app/hackathons')} className="group text-sm font-semibold text-accent-start hover:text-accent-end transition-colors flex items-center gap-1">
                View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {activeHackathons.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activeHackathons.slice(0, 3).map(hackathon => (
                  <GlassCard 
                    key={hackathon._id || hackathon.id} 
                    className="group flex flex-col sm:flex-row gap-5 p-4 cursor-pointer hover:border-accent-start/40 hover:bg-foreground/[0.02] transition-all duration-300 hover:shadow-xl shadow-accent-start/5" 
                    onClick={() => navigate(`/app/hackathons/${hackathon._id || hackathon.id}`)}
                  >
                    <div className="relative w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden shadow-md">
                      <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-foreground text-xl group-hover:text-accent-start transition-colors line-clamp-1 pr-4">{hackathon.title}</h3>
                          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-status-success/15 text-status-success text-[10px] font-bold border border-status-success/20 uppercase tracking-wider">
                            {hackathon.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60 mb-3 line-clamp-2">{hackathon.shortDescription || 'An exciting hackathon where developers compete to build innovative solutions.'}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
                          <Users size={14} className="text-foreground/40"/>
                          {hackathon.teamSize || '1-4'} Members
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
                          <Trophy size={14} className="text-foreground/40"/>
                          ${hackathon.prizePool || '10,000'}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-16 flex flex-col items-center justify-center border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5 shadow-inner">
                  <Calendar size={28} className="text-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Active Hackathons</h3>
                <p className="text-foreground/50 text-base mb-8 max-w-md">You aren't participating in any active hackathons right now. Discover upcoming events and build something amazing.</p>
                <GradientButton onClick={() => navigate('/app/hackathons')} className="px-8 py-3">
                  Explore Events
                </GradientButton>
              </GlassCard>
            )}
          </motion.div>
        </div>

        {/* Right Column: Invites & Announcements */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Pending Invitations */}
          {pendingInvites.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-status-info/15 rounded-lg border border-status-info/30 shadow-inner">
                  <Mail size={18} className="text-status-info" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Team Invites</h2>
              </div>
              
              <div className="space-y-3">
                {pendingInvites.map(invite => (
                  <GlassCard key={invite._id || invite.id} className="p-4 hover:border-status-info/30 transition-colors shadow-md">
                    <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-status-info/15 flex items-center justify-center shrink-0 shadow-inner">
                        <Users className="text-status-info" size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{invite.title}</h3>
                        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">{invite.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 py-2 rounded-lg bg-status-success/15 text-status-success text-xs font-bold uppercase tracking-wider hover:bg-status-success/25 transition-colors border border-status-success/20">Accept</button>
                      <button className="flex-1 py-2 rounded-lg bg-foreground/5 text-foreground/60 text-xs font-bold uppercase tracking-wider hover:bg-foreground/10 hover:text-foreground transition-colors border border-border">Decline</button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Announcements Sidebar */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-foreground/10 rounded-lg border border-border shadow-inner">
                <Megaphone size={18} className="text-foreground/80" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Announcements</h2>
            </div>
            
            <GlassCard className="p-0 overflow-hidden shadow-lg border-border">
              <div className="divide-y divide-border">
                {notifications.filter(n => n.type === 'ANNOUNCEMENT').slice(0, 5).map((ann, idx) => (
                  <div key={ann._id || ann.id} className="p-5 flex gap-4 hover:bg-foreground/[0.03] transition-colors cursor-pointer group" onClick={() => navigate('/app/notifications')}>
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent-start/15 group-hover:text-accent-start transition-colors shadow-inner">
                      <Megaphone size={14} className="text-foreground/50 group-hover:text-accent-start transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-accent-start transition-colors">{ann.title}</h4>
                      <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed mb-2">{ann.message}</p>
                      <div className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                    </div>
                  </div>
                ))}
                
                {notifications.filter(n => n.type === 'ANNOUNCEMENT').length === 0 && (
                   <div className="p-8 text-center flex flex-col items-center justify-center">
                     <FileText size={24} className="text-foreground/20 mb-3" />
                     <p className="text-foreground/50 text-sm font-medium">No recent announcements.</p>
                   </div>
                )}
              </div>
              {notifications.filter(n => n.type === 'ANNOUNCEMENT').length > 0 && (
                <button 
                  onClick={() => navigate('/app/notifications')} 
                  className="w-full p-3 text-xs font-bold text-foreground/60 uppercase tracking-widest hover:bg-foreground/5 hover:text-foreground transition-colors bg-foreground/[0.02] border-t border-border"
                >
                  View All Updates
                </button>
              )}
            </GlassCard>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
