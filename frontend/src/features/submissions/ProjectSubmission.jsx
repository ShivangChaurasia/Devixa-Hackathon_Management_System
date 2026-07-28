import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import { UploadCloud, GitBranch, Video, Link as LinkIcon, FileText, CheckCircle2, Clock, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectSubmission() {
  const [step, setStep] = useState(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Draft not saved');
  
  // Fake auto-save
  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(() => {
        setIsAutoSaving(true);
        setTimeout(() => {
          setIsAutoSaving(false);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSaved(`Draft auto-saved at ${time}`);
        }, 1000);
      }, 15000); // auto save every 15s
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Move to review
  };

  const handleFinalSubmit = () => {
    setStep(3); // Under Review state
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-status-success/20 text-status-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-4">Submission Received</h2>
        <p className="text-white/60 mb-8">Your project is now under review. You cannot modify it further unless the organizer reopens the submission window.</p>
        <div className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-4 text-left">
           <div className="p-3 bg-white/5 rounded-xl"><Clock className="text-accent-start" size={24} /></div>
           <div>
             <h4 className="font-semibold text-white">Next Step: Evaluation</h4>
             <p className="text-xs text-white/50">Judges will review your project shortly.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader 
        title="Project Submission" 
        subtitle={step === 1 ? "Fill out the required details for your hackathon project." : "Review your submission before finalizing."} 
        action={
          step === 1 && (
            <div className="flex items-center gap-2 text-xs font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
               {isAutoSaving ? <span className="animate-pulse flex items-center gap-1"><Save size={14}/> Saving...</span> : lastSaved}
            </div>
          )
        }
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-white border-b border-white/5 pb-2">Basic Details</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Project Name *</label>
                <input type="text" required placeholder="e.g. HealthTracker AI" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Tagline *</label>
                <input type="text" required placeholder="A short, catchy description" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Problem Statement & Description *</label>
                <textarea required rows="4" placeholder="Describe the problem you are solving..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Technology Stack *</label>
                <input type="text" required placeholder="e.g. React, Node, MongoDB, OpenAI" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-white border-b border-white/5 pb-2">Links & Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="url" required placeholder="GitHub Repository URL *" className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
                </div>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="url" required placeholder="Live Deployment URL *" className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
                </div>
              </div>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="url" placeholder="Demo Video URL (Optional)" className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <h3 className="font-semibold text-white">Supporting Documents</h3>
                <span className="text-xs font-medium text-status-warning">Max Total Size: 10 MB</span>
              </div>
              <p className="text-sm text-white/50">Upload presentations, API docs, or Figma exports (PDF, DOCX, ZIP, PNG, JPG).</p>
              
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent-start/50 transition-colors cursor-pointer bg-background/50">
                <UploadCloud className="mx-auto text-white/40 mb-3" size={32} />
                <span className="text-sm font-medium text-white/70">Drag & Drop files here or click to browse</span>
              </div>

              {/* Mock Uploaded File */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                   <FileText size={16} className="text-accent-start" />
                   <div>
                     <p className="text-sm font-medium text-white">Pitch_Deck.pdf</p>
                     <p className="text-[10px] text-white/40">2.4 MB</p>
                   </div>
                </div>
                <button type="button" className="p-2 text-white/40 hover:text-status-error transition-colors"><Trash2 size={16}/></button>
              </div>
            </GlassCard>

            <div className="flex justify-end pt-4">
              <GradientButton type="submit">Review Submission</GradientButton>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <GlassCard className="bg-status-warning/10 border-status-warning/20">
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-status-warning" size={24} />
                 <div>
                   <h3 className="font-semibold text-white">Final Review</h3>
                   <p className="text-sm text-white/70">Please verify all links and documents. You will not be able to edit this after submitting.</p>
                 </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-2">HealthTracker AI</h3>
              <p className="text-sm text-white/70 mb-4">A comprehensive dashboard for predicting health issues using wearable data.</p>
              
              <div className="space-y-4 pt-4 border-t border-border">
                 <div className="flex items-center gap-2 text-sm text-white/60"><GitBranch size={16} className="text-accent-start"/> github.com/team/health-tracker</div>
                 <div className="flex items-center gap-2 text-sm text-white/60"><LinkIcon size={16} className="text-accent-start"/> healthtracker.demo.app</div>
                 <div className="flex items-center gap-2 text-sm text-white/60"><FileText size={16} className="text-accent-start"/> Pitch_Deck.pdf (2.4 MB)</div>
              </div>
            </GlassCard>

            <div className="flex justify-end gap-4 pt-4">
              <button onClick={() => setStep(1)} className="px-6 py-2 rounded-xl font-medium text-white/60 hover:text-white transition-colors">Go Back & Edit</button>
              <GradientButton onClick={handleFinalSubmit}>Confirm & Final Submit</GradientButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
