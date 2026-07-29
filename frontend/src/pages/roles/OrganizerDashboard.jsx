import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, Users, Clock, CheckCircle2, ArrowRight, Megaphone, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';
import RegistrationReviewModal from '../../components/modals/RegistrationReviewModal';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(null);

  const { data: hackathonsRes, loading, execute: fetchHackathons } = useApi(apiClient.get);
  const { data: regsRes, loading: regsLoading, execute: fetchRegistrations } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathons('/hackathons').catch(() => null); 
    fetchRegistrations('/registrations/organizer/all').catch(() => null);
  }, [fetchHackathons, fetchRegistrations]);

  const allHackathons = Array.isArray(hackathonsRes) ? hackathonsRes : (hackathonsRes?.hackathons || []);
  const myHackathons = allHackathons;

  const rawRegistrations = Array.isArray(regsRes) ? regsRes : (regsRes?.registrations || []);

  const handleApprove = async (id) => {
    try {
      await apiClient.patch(`/registrations/${id}/status`, { status: 'APPROVED' });
      fetchRegistrations('/registrations/organizer/all');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to approve registration');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.patch(`/registrations/${id}/status`, { status: 'REJECTED' });
      fetchRegistrations('/registrations/organizer/all');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to reject registration');
    }
  };

  const registrationColumns = [
    { header: 'Participant', accessorKey: 'userId.name', cell: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium">
          {(row.userId?.name || row.userId?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-foreground">{row.userId?.name || 'User'}</div>
          <div className="text-xs text-foreground/40">{row.userId?.email}</div>
        </div>
      </div>
    )},
    { header: 'Hackathon', accessorKey: 'hackathonId.title', cell: (row) => row.hackathonId?.title || 'Hackathon' },
    { header: 'Experience', accessorKey: 'experienceLevel', cell: (row) => row.experienceLevel || 'Not specified' },
    { header: 'Status', accessorKey: 'status', cell: (row) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
        row.status === 'APPROVED' ? 'bg-status-success/20 text-status-success' :
        row.status === 'REJECTED' ? 'bg-status-error/20 text-status-error' :
        'bg-status-warning/20 text-status-warning'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Action', cell: (row) => (
      <div className="flex gap-2">
        {row.status === 'PENDING' && (
          <button onClick={() => handleApprove(row._id)} className="text-xs font-medium text-status-success px-3 py-1 rounded-lg bg-status-success/10 hover:bg-status-success/20 transition-colors">Approve</button>
        )}
        <button onClick={() => setActiveReview({ ...row, user: row.userId, hackathon: row.hackathonId })} className="text-xs font-medium text-foreground/50 px-3 py-1 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">Review</button>
      </div>
    )},
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Organizer Dashboard"
        subtitle="Manage your hackathons, teams, and participants"
        action={<GradientButton onClick={() => navigate('/app/organizer/create')} icon={Plus}>Create Hackathon</GradientButton>}
      />

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Create Hackathon', icon: Plus, path: '/app/organizer/create', color: 'accent-start' },
          { label: 'Post Announcement', icon: Megaphone, path: '#', color: 'status-info' },
          { label: 'Assign Judges', icon: Users, path: '#', color: 'status-warning' },
          { label: 'View Submissions', icon: FileText, path: '#', color: 'status-success' },
        ].map((action) => (
          <GlassCard
            key={action.label}
            className="cursor-pointer text-center py-6"
            onClick={() => navigate(action.path)}
          >
            <div className={`w-12 h-12 rounded-xl bg-${action.color}/10 flex items-center justify-center mx-auto mb-3`}>
              <action.icon size={22} className={`text-${action.color}`} />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </GlassCard>
        ))}
      </motion.div>

      {/* My Hackathons */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">My Hackathons</h2>
        {loading ? (
          <div className="text-center py-10 text-foreground/50">Loading hackathons...</div>
        ) : myHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myHackathons.map((h) => (
              <GlassCard key={h._id || h.id} className="cursor-pointer" onClick={() => navigate(`/app/hackathons/${h._id || h.id}`)}>
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    h.status === 'Active' ? 'bg-status-success/20 text-status-success' :
                    h.status === 'Upcoming' ? 'bg-status-info/20 text-status-info' :
                    'bg-foreground/10 text-foreground/50'
                  }`}>
                    {h.status}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{h.title}</h3>
                <p className="text-xs text-foreground/40 mb-4">{h.organization || 'Organization'}</p>
                <div className="flex items-center justify-between text-xs text-foreground/30 pt-3 border-t border-border">
                  <span className="flex items-center gap-1"><Users size={12} /> {h.participantsCount || 0}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {h.startDate ? new Date(h.startDate).toLocaleDateString() : 'TBA'}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No hackathons yet"
            description="Create your first hackathon and start managing registrations."
            action={() => navigate('/app/organizer/create')}
            actionLabel="Create Hackathon"
          />
        )}
      </motion.div>

      {/* Pending Registrations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Participant Registrations</h2>
        <GlassCard className="p-0 overflow-hidden border-border bg-card/50">
          <Table columns={registrationColumns} data={rawRegistrations} />
        </GlassCard>
      </motion.div>

      <RegistrationReviewModal
        isOpen={!!activeReview}
        onClose={() => setActiveReview(null)}
        registration={activeReview}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
