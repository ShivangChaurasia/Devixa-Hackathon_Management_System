import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import GlassCard from '../../components/ui/GlassCard';
import { AlertTriangle, CheckCircle2, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await apiClient.get('/admin/hackathons');
      setHackathons(res.hackathons);
    } catch (error) {
      console.error('Failed to fetch hackathons', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (hackathonId, status) => {
    try {
      await apiClient.patch(`/admin/hackathons/${hackathonId}/status`, { status });
      setHackathons(hackathons.map(h => h._id === hackathonId ? { ...h, status } : h));
    } catch (error) {
      console.error('Failed to update hackathon status', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading hackathons...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/70">
            <thead className="text-xs uppercase bg-foreground/5 text-foreground/50">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Organizer</th>
                <th className="px-6 py-4 font-medium">Mode</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hackathons.map((h) => (
                <tr key={h._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{h.title}</div>
                    <div className="text-xs text-foreground/40">{new Date(h.startDate).toLocaleDateString()} - {new Date(h.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    {h.organizerId ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden">
                          {h.organizerId.avatar ? <img src={h.organizerId.avatar} alt="Avatar" /> : <span className="text-[10px]">{h.organizerId.name.charAt(0)}</span>}
                        </div>
                        <span>{h.organizerId.name}</span>
                      </div>
                    ) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-foreground/10 rounded text-xs">{h.mode}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      h.status === 'PUBLISHED' ? 'bg-status-success/20 text-status-success' :
                      h.status === 'BLOCKED' ? 'bg-status-error/20 text-status-error' :
                      'bg-foreground/10 text-foreground/70'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {h.status !== 'BLOCKED' ? (
                      <button onClick={() => updateStatus(h._id, 'BLOCKED')} className="p-2 bg-foreground/5 hover:bg-status-error/20 hover:text-status-error rounded text-foreground/50 transition-colors" title="Block Hackathon">
                        <Ban size={16} />
                      </button>
                    ) : (
                      <button onClick={() => updateStatus(h._id, 'PUBLISHED')} className="p-2 bg-foreground/5 hover:bg-status-success/20 hover:text-status-success rounded text-foreground/50 transition-colors" title="Unblock Hackathon">
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {hackathons.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-foreground/40">No hackathons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
