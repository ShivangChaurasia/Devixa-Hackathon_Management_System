import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { Bell, Shield, Key, Monitor, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { user, setUser } = useOutletContext();
  const [activeTab, setActiveTab] = useState('account');
  const isOrganizer = user?.capabilities?.includes('ORGANIZER');

  const tabs = [
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'organizer', label: isOrganizer ? 'Organization' : 'Become Organizer', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader title="Settings" subtitle="Manage your account preferences and capabilities" />

      <div className="flex flex-col md:flex-row gap-8">
        <GlassCard className="w-full md:w-64 h-fit p-4 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-start/20 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-accent-start' : ''} />
              {tab.label}
            </button>
          ))}
        </GlassCard>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && <AccountSettings key="account" user={user} />}
            {activeTab === 'organizer' && (
              isOrganizer ? <OrganizationSettings key="org-settings" /> : <BecomeOrganizerFlow key="org-flow" user={user} setUser={setUser} />
            )}
            {activeTab === 'notifications' && <NotificationSettings key="notifications" />}
            {activeTab === 'security' && <SecuritySettings key="security" />}
            {activeTab === 'appearance' && <AppearanceSettings key="appearance" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sub-components for Settings Tabs

function AccountSettings({ user }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Account Information</h3>
          <p className="text-sm text-white/50">Update your basic profile details.</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium text-white/70">Full Name</label>
               <input type="text" defaultValue={user?.name} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-white/70">Email Address</label>
               <input type="email" defaultValue={user?.email} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" disabled />
             </div>
          </div>
          <GradientButton className="mt-4">Save Changes</GradientButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function BecomeOrganizerFlow({ user, setUser }) {
  const [step, setStep] = useState(1);
  const [orgDetails, setOrgDetails] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBecomeOrganizer = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newCapabilities = [...(user.capabilities || []), 'ORGANIZER'];
      setUser({ ...user, capabilities: newCapabilities, activeView: 'ORGANIZER' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Become an Organizer</h3>
          <p className="text-sm text-white/50">Host and manage your own hackathons on Devixa.</p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-4 rounded-xl bg-accent-start/10 border border-accent-start/20">
              <h4 className="font-semibold text-white mb-2">Terms & Conditions</h4>
              <p className="text-sm text-white/70">By becoming an organizer, you agree to Devixa's platform guidelines. You must maintain fair judging practices and pay prize pools within 30 days of the hackathon ending.</p>
            </div>
            <GradientButton onClick={() => setStep(2)}>I Agree, Continue</GradientButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-white/70">Organization Name *</label>
                 <input 
                   type="text" 
                   required
                   value={orgDetails.name}
                   onChange={e => setOrgDetails({...orgDetails, name: e.target.value})}
                   placeholder="e.g. University Coding Club" 
                   className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-white/70">Description</label>
                 <textarea 
                   rows="3"
                   value={orgDetails.description}
                   onChange={e => setOrgDetails({...orgDetails, description: e.target.value})}
                   placeholder="What does your organization do?" 
                   className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" 
                 />
               </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setStep(1)} className="px-6 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors">Back</button>
              <GradientButton 
                onClick={handleBecomeOrganizer} 
                disabled={!orgDetails.name || isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Submit & Activate Profile'}
              </GradientButton>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function OrganizationSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Organization Settings</h3>
            <p className="text-sm text-white/50">Manage your active organization profile.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-success/20 text-status-success text-xs font-semibold">
            <CheckCircle2 size={14} /> Verified
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-sm font-medium text-white/70">Organization Name</label>
             <input type="text" defaultValue="Demo University Club" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
           </div>
           <GradientButton className="mt-4">Update Profile</GradientButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Placeholder for other settings
function NotificationSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard>
         <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
         <div className="text-sm text-white/50">Manage email and push notifications here.</div>
      </GlassCard>
    </motion.div>
  );
}

function SecuritySettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard>
         <h3 className="text-lg font-semibold text-white mb-4">Security & Sessions</h3>
         <div className="text-sm text-white/50">Manage 2FA and active sessions here.</div>
      </GlassCard>
    </motion.div>
  );
}

function AppearanceSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard>
         <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
         <div className="text-sm text-white/50">Theme settings are locked to dark mode for Devixa.</div>
      </GlassCard>
    </motion.div>
  );
}
