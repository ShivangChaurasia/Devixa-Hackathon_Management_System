import React from 'react';
import { motion } from 'framer-motion';

export default function GradientButton({ children, className = '', icon: Icon, isLoading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:from-purple-400 hover:to-indigo-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading}
      {...props}
    >
      {/* Optional Top Highlight */}
      <span className="absolute inset-0 rounded-full border border-foreground/20 pointer-events-none"></span>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-foreground/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        Icon && <Icon size={16} />
      )}
      <span>{children}</span>
    </motion.button>
  );
}
