import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, GitBranch, Briefcase, MessageSquare, Code } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function RegistrationReviewModal({ isOpen, onClose, registration, onApprove, onReject }) {
  if (!isOpen || !registration) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
            <div>
              <h2 className="text-xl font-bold text-foreground">Review Application</h2>
              <p className="text-sm text-foreground/50">{registration.hackathon?.title}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-start/20 flex items-center justify-center text-accent-start font-bold text-xl">
                {registration.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{registration.user?.name || 'Applicant'}</h3>
                <p className="text-sm text-foreground/50">{registration.user?.email || 'email@example.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href={registration.githubProfile || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-accent-start/50 transition-colors">
                <GitBranch size={18} className="text-foreground/60" />
                <span className="text-sm font-medium text-foreground truncate">{registration.githubProfile ? 'GitHub Profile' : 'Not provided'}</span>
              </a>
              <a href={registration.linkedinProfile || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-accent-start/50 transition-colors">
                <Briefcase size={18} className="text-foreground/60" />
                <span className="text-sm font-medium text-foreground truncate">{registration.linkedinProfile ? 'LinkedIn Profile' : 'Not provided'}</span>
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground/70 mb-2">
                  <Code size={16} /> Experience Level
                </h4>
                <div className="inline-block px-3 py-1 rounded-full bg-foreground/10 text-xs font-medium text-foreground">
                  {registration.experienceLevel || 'Not specified'}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground/70 mb-2">
                  <MessageSquare size={16} /> Motivation to Join
                </h4>
                <div className="p-4 rounded-xl bg-background border border-border text-sm text-foreground/80 italic leading-relaxed">
                  "{registration.motivation || 'No motivation provided.'}"
                </div>
              </div>
            </div>

            {registration.status === 'PENDING' && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <button 
                  onClick={() => { onReject(registration._id); onClose(); }}
                  className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border border-status-error/30 text-status-error hover:bg-status-error/10 transition-colors font-semibold"
                >
                  <X size={18} /> Reject
                </button>
                <button 
                  onClick={() => { onApprove(registration._id); onClose(); }}
                  className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl bg-status-success text-white hover:bg-status-success/90 transition-colors font-semibold shadow-lg shadow-status-success/20"
                >
                  <Check size={18} /> Approve
                </button>
              </div>
            )}
            {registration.status !== 'PENDING' && (
              <div className="pt-4 border-t border-border text-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  registration.status === 'APPROVED' ? 'bg-status-success/20 text-status-success' : 'bg-status-error/20 text-status-error'
                }`}>
                  {registration.status}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
