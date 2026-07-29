import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} z-10`}
          >
            <GlassCard hover={false} className="shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
