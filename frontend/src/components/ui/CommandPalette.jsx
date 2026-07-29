import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Users, Layout, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: Layout, path: '/app/dashboard' },
  { id: 'hackathons', label: 'Browse Hackathons', icon: Trophy, path: '/app/hackathons' },
  { id: 'teams', label: 'My Teams', icon: Users, path: '/app/teams' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const navigate = useNavigate();

  const filteredItems = navItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setUserResults([]);
      return;
    }
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await apiClient.get(`/users/search?q=${query}&limit=5`);
        setUserResults(res.users || []);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoadingUsers(false);
      }
    };
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [query]);

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
            className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[60vh]"
          >
            <div className="flex items-center px-4 py-3 border-b border-border gap-3 shrink-0">
              <Search size={20} className="text-foreground/40" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, or users..."
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground/40 text-lg"
              />
              <div className="text-[10px] font-medium px-2 py-1 rounded bg-foreground/5 text-foreground/40 border border-border">
                ESC
              </div>
            </div>

            <div className="overflow-y-auto hide-scrollbar p-2 flex-1">
              {query && (filteredItems.length > 0 || userResults.length > 0) ? (
                <>
                  {filteredItems.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 mb-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Navigation</div>
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.path)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                        >
                          <div className="p-1.5 rounded-lg bg-foreground/5 text-foreground/60">
                            <item.icon size={16} />
                          </div>
                          <span className="text-foreground text-sm font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {userResults.length > 0 && (
                    <div>
                      <div className="px-3 mb-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Users</div>
                      {userResults.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => handleSelect(`/u/${u.username}`)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-foreground/5 flex shrink-0 items-center justify-center">
                            {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : <User size={14} className="text-foreground/40" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground text-sm font-medium">{u.name}</span>
                            <span className="text-foreground/50 text-xs">@{u.username}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : !query ? (
                <div>
                  <div className="px-3 mb-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Navigation</div>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                    >
                      <div className="p-1.5 rounded-lg bg-foreground/5 text-foreground/60">
                        <item.icon size={16} />
                      </div>
                      <span className="text-foreground text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-foreground/40 text-sm">
                  {loadingUsers ? 'Searching...' : `No results found for "${query}"`}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
