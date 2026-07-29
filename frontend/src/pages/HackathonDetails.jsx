import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, ChevronLeft, CheckCircle2 } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';
import GlassCard from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';
import RegistrationModal from '../components/modals/RegistrationModal';

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hackathonRes, loading, error, execute: fetchHackathon } = useApi(apiClient.get);

  const { data: myRegsRes, execute: fetchMyRegs } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathon(`/hackathons/${id}`);
    fetchMyRegs('/registrations/my-registrations').catch(() => null);
  }, [id, fetchHackathon, fetchMyRegs]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hackathon = hackathonRes?.hackathon || hackathonRes?.data || hackathonRes;
  const myRegs = Array.isArray(myRegsRes) ? myRegsRes : (myRegsRes?.registrations || []);
  const isUserRegistered = myRegs.some(r => (r.hackathonId?._id || r.hackathonId) === (hackathon?._id || id));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = async (formData) => {
    try {
      setRegisterLoading(true);
      await apiClient.post('/registrations', {
        hackathonId: hackathon._id || hackathon.id,
        ...formData
      });
      setRegisterSuccess(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.message || 'Failed to register. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="text-center py-20 text-foreground/50">
        Hackathon not found.
        <br/><br/>
        <GradientButton onClick={() => navigate('/app/hackathons')}>Go Back</GradientButton>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      <button onClick={() => navigate('/app/hackathons')} className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6 text-sm font-medium">
        <ChevronLeft size={16} /> Back to Hackathons
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden h-[400px] mb-8 border border-border group">
        <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'} alt={hackathon.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-accent-start/20 border border-accent-start text-accent-start rounded-full text-xs font-bold uppercase tracking-wider">
              {hackathon.status}
            </span>
            {hackathon.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-foreground/10 border border-foreground/20 rounded-full text-xs text-foreground">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2 tracking-tight">
            {hackathon.title}
          </h1>
          <p className="text-xl text-foreground/70 font-medium">Organized by {hackathon.organization || 'Community'}</p>
        </div>
      </div>

      {/* Action Bar */}
      <GlassCard className="flex flex-wrap items-center justify-between gap-6 mb-12">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-foreground/5 text-foreground/60"><Calendar size={20} /></div>
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-wider">Dates</p>
              <p className="text-sm font-semibold text-foreground">{hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 'TBA'} - {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : 'TBA'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-foreground/5 text-foreground/60"><MapPin size={20} /></div>
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-wider">Location</p>
              <p className="text-sm font-semibold text-foreground">{hackathon.location || 'Online'}</p>
            </div>
          </div>
        </div>
        
        {user?.role === 'JUDGE' ? (
          <div className="flex items-center gap-2 text-accent-start font-semibold px-6 py-4 bg-accent-start/10 rounded-xl border border-accent-start/20">
            <Trophy size={20} /> Assigned Judge Panel
          </div>
        ) : user?.role === 'ORGANIZER' ? (
          <GradientButton 
            onClick={() => navigate('/app/organizer/dashboard')}
            className="w-full md:w-auto text-lg px-12 py-4"
          >
            Organizer Dashboard
          </GradientButton>
        ) : registerSuccess || isUserRegistered ? (
          <div className="flex items-center gap-2 text-status-success font-semibold px-6 py-4 bg-status-success/10 rounded-xl border border-status-success/20">
            <CheckCircle2 size={20} /> Application Submitted!
          </div>
        ) : (
          <GradientButton 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto text-lg px-12 py-4"
            disabled={registerLoading}
          >
            {registerLoading ? 'Processing...' : 'Register Now'}
          </GradientButton>
        )}
      </GlassCard>

      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hackathonTitle={hackathon.title}
        onSubmit={handleRegister}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <div className="prose prose-invert max-w-none text-foreground/70">
              <p>{hackathon.description || 'Join the most innovative minds in the industry for a weekend of building, networking, and pushing the boundaries of what\'s possible.'}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Rules & Eligibility</h2>
            <ul className="space-y-3">
              {[
                "Teams can consist of 1 to 4 members.",
                "All code must be written during the hackathon period.",
                "Open source libraries and frameworks are permitted.",
                "Submissions must include a working prototype and video demo."
              ].map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-foreground/70">
                  <CheckCircle2 className="text-accent-start shrink-0 mt-0.5" size={18} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="text-accent-start" /> Prizes
            </h3>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end mb-6">
              {hackathon.prizePool || 'TBA'}
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Trophy size={48} /></div>
                <div className="font-bold text-foreground mb-1">1st Place</div>
                <div className="text-sm text-foreground/60">Cash + Credits + Swag</div>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Trophy size={48} /></div>
                <div className="font-bold text-foreground mb-1">2nd Place</div>
                <div className="text-sm text-foreground/60">Cash + Swag</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="text-accent-start" /> Participants
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-foreground/10" />
                ))}
              </div>
              <div className="text-sm text-foreground/60">
                <strong className="text-foreground">{hackathon.participantsCount || 0}</strong> registered
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
