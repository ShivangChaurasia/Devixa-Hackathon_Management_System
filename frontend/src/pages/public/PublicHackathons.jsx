import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';

export default function PublicHackathons() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [themeFilter, setThemeFilter] = useState('All');

  const { data, loading, execute: fetchHackathons } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathons('/hackathons');
  }, [fetchHackathons]);

  const allHackathons = Array.isArray(data) ? data : (data?.items || data?.hackathons || []);

  const filteredHackathons = allHackathons.filter((h) => {
    const matchesSearch = h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          h.organization?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
    const matchesTheme = themeFilter === 'All' || h.theme === themeFilter;
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const themes = [...new Set(allHackathons.map(h => h.theme).filter(Boolean))];
  const statuses = [...new Set(allHackathons.map(h => h.status).filter(Boolean))];

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#06B6D4] to-[#8B5CF6] rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4"
          >
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">Hackathons</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-lg text-lg"
          >
            Discover hackathons from universities, startups, and communities worldwide.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by title, organization, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all text-white placeholder:text-white/40 font-medium"
            />
          </div>
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="px-4 py-3.5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] text-white/70 hover:text-white transition-all cursor-pointer appearance-none min-w-[160px]"
          >
            <option value="All" className="bg-[#09090B] text-white">All Themes</option>
            {themes.map(t => <option key={t} value={t} className="bg-[#09090B] text-white">{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3.5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] text-white/70 hover:text-white transition-all cursor-pointer appearance-none min-w-[160px]"
          >
            <option value="All" className="bg-[#09090B] text-white">All Statuses</option>
            {statuses.map(s => <option key={s} value={s} className="bg-[#09090B] text-white">{s}</option>)}
          </select>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-white/50 py-20 font-medium tracking-wide">Loading hackathons...</div>
        ) : filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon._id || hackathon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -4, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                onClick={() => navigate(`/hackathons/${hackathon._id || hackathon.id}`)}
                className="group cursor-pointer relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
                
                <div className="relative h-48 overflow-hidden">
                  <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} alt={hackathon.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent" />
                  
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    hackathon.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    hackathon.status === 'Upcoming' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' :
                    'bg-white/5 text-white/50 border border-white/10'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
                
                <div className="p-6 relative z-10">
                  <p className="text-xs text-[#8B5CF6] font-medium tracking-wide mb-2 uppercase">{hackathon.organization || 'Community'}</p>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">{hackathon.title}</h3>
                  <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed">{hackathon.tagline}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hackathon.tags?.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-medium text-white/60 group-hover:border-white/10 transition-colors">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-white/40 pt-5 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1.5"><Trophy size={14} className="text-[#8B5CF6]" /> {hackathon.prizePool || 'TBA'}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-[#06B6D4]" /> {hackathon.participantsCount || 0} enrolled</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/[0.02] border border-white/[0.05] rounded-[24px] backdrop-blur-xl">
            <Filter className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No hackathons found</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setThemeFilter('All');
              }}
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
