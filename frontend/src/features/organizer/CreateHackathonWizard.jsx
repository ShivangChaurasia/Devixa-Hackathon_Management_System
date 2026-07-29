import React, { useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GradientButton from '../../components/ui/GradientButton';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import JudgeMentionInput from '../../components/ui/JudgeMentionInput';

export default function CreateHackathonWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    title: '',
    theme: 'Artificial Intelligence',
    mode: 'ONLINE',
    venue: '',
    minTeamSize: 1,
    maxTeamSize: 4,
    description: '',
    registrationDeadline: '',
    startDate: '',
    endDate: '',
    prizePool: '',
    judgeEmails: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError('');
    // Simple validation before proceeding
    if (step === 1 && (!formData.title || !formData.description)) {
      setError('Title and Description are required.');
      return;
    }
    if (step === 2 && (!formData.registrationDeadline || !formData.startDate || !formData.endDate)) {
      setError('All dates are required.');
      return;
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const handlePrev = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        theme: formData.theme,
        mode: formData.mode,
        venue: formData.venue,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
        prizePool: formData.prizePool,
        minTeamSize: parseInt(formData.minTeamSize, 10) || 1,
        maxTeamSize: parseInt(formData.maxTeamSize, 10) || 4,
        status: 'REGISTRATION_OPEN',
        pendingJudgeEmails: formData.judgeEmails 
          ? formData.judgeEmails.split(',').map(e => e.trim()).filter(e => e)
          : []
      };

      await apiClient.post('/hackathons', payload);
      navigate('/app/organizer');
    } catch (err) {
      console.error('Failed to create hackathon:', err);
      const errDetails = err.data?.errors?.length ? err.data.errors.join(' | ') : '';
      setError(`${err.message || 'Failed to create hackathon. Please check your inputs.'} ${errDetails}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader title="Create Hackathon" subtitle="Follow the steps to launch your hackathon to the world." />
      
      {/* Wizard Progress */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-foreground/5 -z-10 -translate-y-1/2"></div>
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
                isActive ? 'bg-accent-start text-foreground shadow-[0_0_15px_rgba(var(--color-accent-start),0.5)]' :
                isCompleted ? 'bg-status-success text-background' :
                'bg-foreground/10 text-foreground/50'
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : stepNumber}
              </div>
              <span className={`text-xs font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-foreground/40'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-foreground/5 pb-2">Basic Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Hackathon Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Global AI Summit 2026" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the purpose and goals of the hackathon..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Theme</label>
                    <select name="theme" value={formData.theme} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors appearance-none">
                      <option>Artificial Intelligence</option>
                      <option>Web3 & Blockchain</option>
                      <option>HealthTech</option>
                      <option>Open Innovation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Mode</label>
                    <select name="mode" value={formData.mode} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors appearance-none">
                      <option value="ONLINE">Online / Virtual</option>
                      <option value="OFFLINE">Offline / In-Person</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>

                {formData.mode !== 'ONLINE' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Venue Location</label>
                    <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g. Moscone Center, San Francisco" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Min Team Size</label>
                    <input type="number" min="1" max="10" name="minTeamSize" value={formData.minTeamSize} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Max Team Size</label>
                    <input type="number" min="1" max="10" name="maxTeamSize" value={formData.maxTeamSize} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-foreground/5 pb-2">Timeline</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Registration Deadline *</label>
                  <p className="text-xs text-foreground/50">When should participants stop forming teams and registering?</p>
                  <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Hackathon Start Date *</label>
                    <p className="text-xs text-foreground/50">When does the actual coding begin?</p>
                    <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Submission Deadline / End Date *</label>
                    <p className="text-xs text-foreground/50">When are projects due / winners announced?</p>
                    <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-foreground/5 pb-2">Judging Criteria, Prizes & Invites</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Total Prize Pool ($) or Description</label>
                  <input type="text" name="prizePool" value={formData.prizePool} onChange={handleChange} placeholder="e.g. $10,000 + Cloud Credits" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors" />
                </div>
                
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-foreground/70">Invite Judges (@mention Search)</label>
                  <p className="text-xs text-foreground/50">Search judges by name or email to auto-complete, or type manually and press Enter.</p>
                  <JudgeMentionInput
                    selectedEmails={formData.judgeEmails ? formData.judgeEmails.split(',').map(s => s.trim()).filter(Boolean) : []}
                    onChange={(newList) => setFormData(prev => ({ ...prev, judgeEmails: newList.join(', ') }))}
                    placeholder="Type @username, name, or email..."
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border mt-4">
                  <label className="text-sm font-medium text-foreground/70">Scoring Rubrics</label>
                  <div className="space-y-2 text-sm text-foreground/50">
                    <p>✔ Innovation (1-10)</p>
                    <p>✔ Technical Quality (1-10)</p>
                    <p>✔ Problem Solving (1-10)</p>
                    <p>✔ Presentation (1-10)</p>
                    <p className="mt-2 text-xs italic">Note: These default rubrics will be automatically applied to all assigned judges.</p>
                  </div>
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
              <h3 className="text-2xl font-bold text-foreground">Ready to Launch!</h3>
              <p className="text-foreground/60 max-w-md mx-auto">Your hackathon setup is complete. Click publish to make it visible to participants on Devixa.</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <button 
          onClick={handlePrev}
          disabled={step === 1 || loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/60 hover:text-foreground bg-foreground/5 hover:bg-foreground/10'}`}
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        {step < totalSteps ? (
          <GradientButton onClick={handleNext} className="flex items-center gap-2">
            Next Step <ChevronRight size={18} />
          </GradientButton>
        ) : (
          <GradientButton onClick={handlePublish} disabled={loading} className="flex items-center gap-2">
            {loading ? 'Publishing...' : 'Publish Hackathon'} <CheckCircle2 size={18} />
          </GradientButton>
        )}
      </div>
    </div>
  );
}
