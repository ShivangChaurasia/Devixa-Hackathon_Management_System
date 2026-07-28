import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import { Bell, Check, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

const CATEGORIES = ['All', 'Platform', 'Hackathon', 'Team', 'Submission', 'Evaluation', 'Certificate'];

export default function Notifications() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: notifsRes, loading, execute: fetchNotifs } = useApi(apiClient.get);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifs('/notifications').catch(() => null);
  }, [fetchNotifs]);

  useEffect(() => {
    if (notifsRes?.notifications) {
      setNotifications(notifsRes.notifications);
    }
  }, [notifsRes]);

  const filtered = activeCategory === 'All'
    ? notifications
    : notifications.filter(n => {
        // Map backend types to frontend categories if necessary, or just use raw type
        const cat = n.type || n.category || 'Platform';
        return cat.toUpperCase().includes(activeCategory.toUpperCase());
      });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    // Optimistic update
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // Need backend endpoint for this
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Notifications"
        subtitle={loading ? "Loading..." : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={
          unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-border hover:bg-white/10 text-sm font-medium text-white/60 hover:text-white transition-colors">
              <Check size={16} /> Mark all read
            </button>
          )
        }
      />

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-accent-start/20 text-accent-start border border-accent-start/30'
                : 'bg-white/5 text-white/50 border border-border hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((note, index) => (
            <motion.div
              key={note._id || note.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <GlassCard
                hover={false}
                className={`flex items-start gap-4 cursor-pointer transition-colors ${!note.read ? 'border-accent-start/20 bg-accent-start/[0.03]' : ''}`}
              >
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${!note.read ? 'bg-accent-start' : 'bg-white/10'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{note.title || 'Notification'}</h4>
                      <p className="text-sm text-white/60 mt-1">{note.message}</p>
                    </div>
                    <span className="text-xs text-white/30 whitespace-nowrap shrink-0">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : note.time}</span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-white/5 text-white/40">{note.type || note.category || 'System'}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Notifications about hackathons, teams, and submissions will appear here."
        />
      )}
    </div>
  );
}
