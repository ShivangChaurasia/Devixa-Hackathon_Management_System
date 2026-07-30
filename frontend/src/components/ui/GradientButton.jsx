import React from 'react';
import { motion } from 'framer-motion';
import { buttonPress, smoothEase } from '../../theme/motionPresets';

export default function GradientButton({ children, className = '', icon: Icon, isLoading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={buttonPress}
      transition={smoothEase}
      className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_20px_0_rgba(168,85,247,0.35)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.45)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group ${className}`}
      disabled={isLoading}
      {...props}
    >
      {/* Convex Lighting Overlay */}
      <span className="absolute inset-0 rounded-full border border-white/20 pointer-events-none group-hover:border-white/40 transition-colors"></span>
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full opacity-60"></span>
      
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        Icon && <Icon size={16} className="shrink-0 transition-transform group-hover:scale-110" />
      )}
      <span className="relative z-10 tracking-wide">{children}</span>
    </motion.button>
  );
}
