import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import GlassCard from '../../components/ui/GlassCard';
import { ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminReports() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await apiClient.get('/admin/submissions');
      setSubmissions(res.submissions);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading reports...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/70">
            <thead className="text-xs uppercase bg-foreground/5 text-foreground/50">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Hackathon</th>
                <th className="px-6 py-4 font-medium">Team</th>
                <th className="px-6 py-4 font-medium">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <FileText size={16} className="text-foreground/40" />
                      {sub.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">{sub.hackathonId?.title || 'Unknown'}</td>
                  <td className="px-6 py-4">{sub.teamId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {sub.githubUrl && (
                        <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground flex items-center gap-1 text-xs">
                          <ExternalLink size={14} /> Source
                        </a>
                      )}
                      {sub.demoUrl && (
                        <a href={sub.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent-start hover:text-accent-end flex items-center gap-1 text-xs">
                          <ExternalLink size={14} /> Demo
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-foreground/40">No reports/submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
