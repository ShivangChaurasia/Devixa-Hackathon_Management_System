import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mb-6">
          <Icon size={28} className="text-foreground/25" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-foreground/50 max-w-sm mb-6">{description}</p>}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-2.5 rounded-full text-sm font-medium text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:scale-[1.02] transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
