import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Users, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: Layout, path: '/app/dashboard' },
  { id: 'hackathons', label: 'Browse Hackathons', icon: Trophy, path: '/app/hackathons' },
  { id: 'teams', label: 'My Teams', icon: Users, path: '/app/teams' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = navItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!isOpen) {
          // Open triggered by parent state usually, but this is for local state if needed.
          // Since it's controlled by Topbar, we rely on Topbar to handle the shortcut.
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10"
          >
            <div className="flex items-center px-4 py-3 border-b border-border gap-3">
              <Search size={20} className="text-white/40" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, or hackathons..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/40 text-lg"
              />
              <div className="text-[10px] font-medium px-2 py-1 rounded bg-white/5 text-white/40 border border-border">
                ESC
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto hide-scrollbar p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-white/60">
                      <item.icon size={16} />
                    </div>
                    <span className="text-white text-sm font-medium">{item.label}</span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-white/40 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
