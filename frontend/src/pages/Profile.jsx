import React, { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Camera, GitBranch, Briefcase, Globe, Mail, User, Shield, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

import { useOutletContext } from 'react-router-dom';

export default function Profile() {
  const { user } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader 
        title="My Profile" 
        subtitle="Manage your personal information and developer portfolio" 
        action={
          <GradientButton onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </GradientButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-accent-start/20 flex items-center justify-center border-4 border-background shadow-xl overflow-hidden">
                <span className="text-4xl font-bold text-accent-start">DU</span>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-card border border-border rounded-full hover:bg-white/10 transition-colors">
                  <Camera size={16} className="text-white" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Demo User'}</h2>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {user?.capabilities?.map(cap => (
                <div key={cap} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                  <Shield size={12} className="text-accent-start" /> {cap}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"><GitBranch size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#0077b5] transition-colors"><Briefcase size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Globe size={18} /></a>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'TailwindCSS', 'TypeScript', 'UI/UX'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="font-semibold text-white mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">First Name</label>
                  <input type="text" disabled={!isEditing} defaultValue={user?.name?.split(' ')[0] || ''} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent-start outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Last Name</label>
                  <input type="text" disabled={!isEditing} defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent-start outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input type="email" disabled defaultValue={user?.email || ''} className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-white opacity-50 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
                <textarea disabled={!isEditing} rows="4" defaultValue="Passionate frontend developer building beautiful interfaces." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent-start outline-none transition-colors resize-none" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-white mb-6">Recent Achievements</h3>
            <div className="space-y-4">
              {[
                { title: '1st Place - Web3 Builders', date: 'Sep 2026', color: 'text-yellow-400' },
                { title: 'Top 10 - Global AI Summit', date: 'Aug 2026', color: 'text-slate-300' }
              ].map((ach, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Trophy size={18} className={ach.color} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{ach.title}</h4>
                    <p className="text-xs text-white/50">{ach.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          {user?.capabilities?.includes('ORGANIZER') && (
            <GlassCard>
              <h3 className="font-semibold text-white mb-4">Organizations</h3>
              <div className="p-4 rounded-xl border border-border bg-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-start/20 flex items-center justify-center font-bold text-accent-start">UC</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">University Coding Club</h4>
                  <p className="text-xs text-white/50">Verified Organizer</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
