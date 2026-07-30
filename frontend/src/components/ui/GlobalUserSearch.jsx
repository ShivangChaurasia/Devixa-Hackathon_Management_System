import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Lock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCKED_USERS = [
  { id: 1, name: 'Alex Rivera', role: 'Fullstack Engineer', badges: ['Global Hack 2025', 'Top 1% React'] },
  { id: 2, name: 'Sarah Chen', role: 'AI Researcher', badges: ['LLM Pioneer', 'Stanford Hacks'] },
  { id: 3, name: 'David Kim', role: 'UI/UX Architect', badges: ['Design Award', 'Pixel Perfect'] },
  { id: 4, name: 'Elena Rostova', role: 'Smart Contract Dev', badges: ['Web3 Master', 'EthDenver Winner'] },
];

export default function GlobalUserSearch({ isAuthenticated = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = MOCKED_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="relative z-50 max-w-2xl mx-auto px-4 mt-8 mb-16">
        <motion.div
          animate={isSearchFocused ? { scale: 1.01 } : { scale: 1 }}
          className={`relative rounded-2xl bg-[#09090B] bg-white/[0.02] backdrop-blur-xl ring-1 ring-white/10 overflow-hidden transition-shadow duration-300 ${isSearchFocused ? 'shadow-[0_0_30px_rgba(139,92,246,0.3)]' : ''}`}
        >
          <div className="flex items-center px-6 py-4">
            <Search className="text-white/40 mr-4" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search builders, roles, or skills..."
              className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-xl"
            />
          </div>
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10 bg-[#09090B]/95"
              >
                {filteredUsers.length > 0 ? (
                  <div className="py-2">
                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => { setSelectedUser(user); setSearchQuery(''); setIsSearchFocused(false); }}
                        className="px-6 py-4 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium text-lg">{user.name}</p>
                          <p className="text-[#06B6D4] text-sm font-medium">{user.role}</p>
                        </div>
                        <div className="flex gap-2">
                          {user.badges.map((b, i) => <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">{b}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-white/40">No builders found matching that criteria.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#09090B]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#09090B] rounded-[32px] border border-white/10 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 z-20 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"><X size={20}/></button>
              
              <div className="p-10 relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-3xl font-black text-white shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{selectedUser.name}</h2>
                    <p className="text-[#06B6D4] font-semibold text-lg">{selectedUser.role}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedUser.badges.map((b, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium flex items-center gap-2">
                      <Shield size={14} className="text-[#8B5CF6]"/> {b}
                    </span>
                  ))}
                </div>

                <div className="relative mt-8 pt-8 border-t border-white/5">
                  {!isAuthenticated ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-8" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent pointer-events-none" />
                      <Link to="/login?mode=signup" className="relative z-20 flex items-center gap-3 px-8 py-4 rounded-full bg-[#06B6D4] text-[#09090B] font-black tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform duration-300">
                        <Lock size={18} /> Sign In to Unlock Full Profile & Connect
                      </Link>
                    </div>
                  ) : null}
                  
                  <div className={`space-y-6 ${!isAuthenticated ? 'opacity-30 select-none' : ''}`}>
                    <div>
                      <h4 className="text-white/40 text-sm uppercase font-black tracking-widest mb-3">Past Projects</h4>
                      {!isAuthenticated ? (
                        <>
                          <div className="h-20 bg-white/5 rounded-xl w-full mb-3" />
                          <div className="h-20 bg-white/5 rounded-xl w-full" />
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-white font-medium text-lg">DeFi Exchange Protocol</p>
                            <p className="text-white/60 text-sm mt-1">Won 1st place at Global Hack 2025.</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-white font-medium text-lg">AI Agent Workflow Builder</p>
                            <p className="text-white/60 text-sm mt-1">Top 10 Finalist.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white/40 text-sm uppercase font-black tracking-widest mb-3">Tech Stack</h4>
                      {!isAuthenticated ? (
                        <div className="flex gap-3"><div className="h-8 w-24 bg-white/5 rounded-md" /><div className="h-8 w-32 bg-white/5 rounded-md" /><div className="h-8 w-20 bg-white/5 rounded-md" /></div>
                      ) : (
                        <div className="flex gap-3 text-sm">
                           <span className="px-3 py-1.5 rounded-md font-medium bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">React 19</span>
                           <span className="px-3 py-1.5 rounded-md font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">Node.js</span>
                           <span className="px-3 py-1.5 rounded-md font-medium bg-white/10 text-white border border-white/20">PostgreSQL</span>
                        </div>
                      )}
                    </div>
                    <div>
                       <h4 className="text-white/40 text-sm uppercase font-black tracking-widest mb-3">Win Rate</h4>
                       {!isAuthenticated ? (
                         <div className="h-10 w-40 bg-white/5 rounded-md" />
                       ) : (
                         <div className="flex items-center gap-4">
                           <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">42%</span>
                           <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Across 12<br/>Hackathons</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
