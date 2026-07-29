import React, { useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import { Trophy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

export default function Leaderboard() {
  const { data: leaderboardRes, loading, execute: fetchLeaderboard } = useApi(apiClient.get);

  useEffect(() => {
    // Ideally this would fetch for a specific hackathon, or globally
    fetchLeaderboard('/leaderboard').catch(() => null);
  }, [fetchLeaderboard]);

  const leaderboard = leaderboardRes?.leaderboard || [];
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Leaderboard"
        subtitle="Top teams and projects"
      />

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div></div>
      ) : leaderboard.length > 0 ? (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            {top3[1] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <GlassCard className="text-center pt-8 pb-6">
                  <div className="text-3xl mb-3">🥈</div>
                  <h3 className="font-semibold text-foreground text-sm">{top3[1].team?.name || top3[1].teamName}</h3>
                  <p className="text-xs text-foreground/40 mt-1">{top3[1].projectTitle}</p>
                  <div className="text-2xl font-bold text-foreground mt-3">{top3[1].score || top3[1].totalScore || 0}</div>
                  <p className="text-[10px] text-foreground/30 uppercase tracking-wider">points</p>
                </GlassCard>
              </motion.div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <GlassCard className="text-center pt-10 pb-8 border-accent-start/30 bg-gradient-to-b from-accent-start/5 to-card">
                  <div className="text-5xl mb-3">🥇</div>
                  <h3 className="font-bold text-foreground">{top3[0].team?.name || top3[0].teamName}</h3>
                  <p className="text-xs text-foreground/40 mt-1">{top3[0].projectTitle}</p>
                  <div className="text-3xl font-bold text-accent-start mt-3">{top3[0].score || top3[0].totalScore || 0}</div>
                  <p className="text-[10px] text-foreground/30 uppercase tracking-wider">points</p>
                </GlassCard>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <GlassCard className="text-center pt-6 pb-4">
                  <div className="text-3xl mb-3">🥉</div>
                  <h3 className="font-semibold text-foreground text-sm">{top3[2].team?.name || top3[2].teamName}</h3>
                  <p className="text-xs text-foreground/40 mt-1">{top3[2].projectTitle}</p>
                  <div className="text-2xl font-bold text-foreground mt-3">{top3[2].score || top3[2].totalScore || 0}</div>
                  <p className="text-[10px] text-foreground/30 uppercase tracking-wider">points</p>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Rest of Rankings */}
          {rest.length > 0 && (
            <GlassCard hover={false} className="p-0 overflow-hidden">
              <div className="divide-y divide-border">
                {rest.map((entry, index) => (
                  <div key={entry._id || index} className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground/30 w-8 text-center">{index + 4}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{entry.team?.name || entry.teamName}</h4>
                        <p className="text-xs text-foreground/40">{entry.projectTitle}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-foreground">{entry.score || entry.totalScore || 0}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No leaderboard data"
          description="Leaderboard rankings will appear here after hackathon judging is complete."
        />
      )}
    </div>
  );
}
