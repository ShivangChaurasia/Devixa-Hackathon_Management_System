import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', noPadding = false, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-[24px] bg-card border border-border shadow-xl backdrop-blur-xl ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {/* Subtle top inner highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
