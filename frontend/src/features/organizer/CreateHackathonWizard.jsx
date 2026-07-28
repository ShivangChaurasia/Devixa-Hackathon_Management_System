import React, { useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export default function CreateHackathonWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader title="Create Hackathon" subtitle="Follow the steps to launch your hackathon to the world." />
      
      {/* Wizard Progress */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-start to-accent-end -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        
        {['Basic Info', 'Timeline', 'Prizes', 'Publish'].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;
          
          return (
            <div key={label} className="flex flex-col items-center gap-2 bg-background px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                isActive ? 'bg-accent-start text-white shadow-[0_0_15px_rgba(var(--color-accent-start),0.5)]' :
                isCompleted ? 'bg-status-success text-background' :
                'bg-white/10 text-white/50'
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : stepNumber}
              </div>
              <span className={`text-xs font-medium ${isActive || isCompleted ? 'text-white' : 'text-white/40'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-white border-b border-white/5 pb-2">Basic Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Hackathon Title *</label>
                  <input type="text" placeholder="e.g. Global AI Summit 2026" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Theme</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors appearance-none">
                    <option>Artificial Intelligence</option>
                    <option>Web3 & Blockchain</option>
                    <option>HealthTech</option>
                    <option>Open Innovation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Allowed Tech Stack</label>
                  <input type="text" placeholder="Leave empty to allow any tech stack, or specify (e.g. React, Python)" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-white border-b border-white/5 pb-2">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Registration Opens</label>
                  <input type="datetime-local" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Submission Deadline</label>
                  <input type="datetime-local" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors [color-scheme:dark]" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-white border-b border-white/5 pb-2">Judging Criteria & Prizes</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Total Prize Pool ($)</label>
                <input type="number" placeholder="e.g. 10000" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-accent-start outline-none transition-colors" />
              </div>
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-white/70">Scoring Rubrics</label>
                <div className="space-y-2 text-sm text-white/50">
                  <p>✔ Innovation (1-10)</p>
                  <p>✔ Technical Quality (1-10)</p>
                  <p>✔ Problem Solving (1-10)</p>
                  <p>✔ Presentation (1-10)</p>
                  <p className="mt-2 text-xs italic">Note: These rubrics will be automatically applied to all assigned judges.</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <GlassCard className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-accent-start/20 text-accent-start rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">Ready to Launch!</h3>
              <p className="text-white/60 max-w-md mx-auto">Your hackathon setup is complete. Click publish to make it visible to participants on Devixa.</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <button 
          onClick={handlePrev}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        {step < totalSteps ? (
          <GradientButton onClick={handleNext} className="flex items-center gap-2">
            Next Step <ChevronRight size={18} />
          </GradientButton>
        ) : (
          <GradientButton className="flex items-center gap-2">
            Publish Hackathon <CheckCircle2 size={18} />
          </GradientButton>
        )}
      </div>
    </div>
  );
}
