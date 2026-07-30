import React from 'react';
import { motion } from 'framer-motion';
import { cardHoverLift, smoothEase } from '../../theme/motionPresets';

export default function GlassCard({ children, className = '', noPadding = false, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? cardHoverLift : {}}
      transition={smoothEase}
      className={`relative overflow-hidden rounded-[24px] bg-card border border-border/80 shadow-2xl backdrop-blur-2xl transition-colors duration-300 ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
      {...props}
    >
      {/* Specular Inner Highlight (Apple/Linear signature top edge reflection) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10" />
      {children}
    </motion.div>
  );
}
