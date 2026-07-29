import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function RegistrationModal({ isOpen, onClose, hackathonTitle, onSubmit }) {
  const [formData, setFormData] = useState({
    githubProfile: '',
    linkedinProfile: '',
    experienceLevel: 'BEGINNER',
    motivation: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Register for {hackathonTitle}</h2>
            <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">GitHub Profile Link</label>
              <input
                type="url"
                value={formData.githubProfile}
                onChange={e => setFormData({...formData, githubProfile: e.target.value})}
                placeholder="https://github.com/username"
                className="w-full bg-background border border-border px-4 py-2 rounded-xl text-foreground focus:border-accent-start outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">LinkedIn Profile Link</label>
              <input
                type="url"
                value={formData.linkedinProfile}
                onChange={e => setFormData({...formData, linkedinProfile: e.target.value})}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-background border border-border px-4 py-2 rounded-xl text-foreground focus:border-accent-start outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                className="w-full bg-background border border-border px-4 py-2 rounded-xl text-foreground focus:border-accent-start outline-none"
                required
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Why do you want to join? *</label>
              <textarea
                value={formData.motivation}
                onChange={e => setFormData({...formData, motivation: e.target.value})}
                placeholder="Tell the organizer about your skills and goals..."
                rows="4"
                className="w-full bg-background border border-border px-4 py-2 rounded-xl text-foreground focus:border-accent-start outline-none"
                required
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <GradientButton type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Registration'}
              </GradientButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
