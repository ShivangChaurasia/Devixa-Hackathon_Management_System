import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

export default function Hackathons() {
  const { data: hackathonsRes, loading, execute: fetchHackathons } = useApi(apiClient.get);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [themeFilter, setThemeFilter] = useState('All Themes');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons('/hackathons');
  }, [fetchHackathons]);

  const hackathons = Array.isArray(hackathonsRes) ? hackathonsRes : (hackathonsRes?.items || hackathonsRes?.hackathons || []);

  const filteredHackathons = hackathons?.filter((h) => {
    const matchesSearch = h.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All Statuses' || h.status === statusFilter;
    
    const matchesTheme = themeFilter === 'All Themes' || h.tags?.includes(themeFilter);
    
    return matchesSearch && matchesStatus && matchesTheme;
  });

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Browse Hackathons" 
        subtitle="Find the perfect hackathon to build your next big idea" 
      />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-xl outline-none focus:border-accent-start focus:ring-1 focus:ring-accent-start transition-all text-foreground placeholder:text-foreground/40"
          />
        </div>
        
        <select 
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-accent-start text-foreground/70 hover:text-foreground transition-colors cursor-pointer appearance-none"
        >
          <option>All Themes</option>
          <option>Web3</option>
          <option>AI</option>
          <option>Healthcare</option>
          <option>Fintech</option>
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-accent-start text-foreground/70 hover:text-foreground transition-colors cursor-pointer appearance-none"
        >
          <option>All Statuses</option>
          <option>Upcoming</option>
          <option>Active</option>
          <option>Judging</option>
          <option>Completed</option>
        </select>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:bg-foreground/5 transition-colors text-foreground font-medium">
          <Filter size={18} />
          More
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <GlassCard key={n} className="h-72 animate-pulse bg-foreground/5" hover={false} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons?.length > 0 ? (
            filteredHackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon._id || hackathon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard noPadding className="flex flex-col h-full group cursor-pointer" onClick={() => navigate(`/app/hackathons/${hackathon._id || hackathon.id}`)}>
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'} 
                      alt={hackathon.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      hackathon.status === 'Active' ? 'bg-status-success/20 text-status-success border border-status-success/30' :
                      hackathon.status === 'Upcoming' ? 'bg-status-info/20 text-status-info border border-status-info/30' :
                      'bg-foreground/10 text-foreground/60 border border-foreground/20'
                    }`}>
                      {hackathon.status}
                    </span>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-foreground/40 mb-1">{hackathon.organization}</p>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent-start transition-colors">{hackathon.title}</h3>
                    <p className="text-sm text-foreground/50 mb-4 line-clamp-2 flex-1">{hackathon.tagline}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hackathon.tags?.slice(0,3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] text-foreground/60 border border-foreground/10">
                          {tag}
                        </span>
                      ))}
                      {hackathon.tags?.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] text-foreground/60 border border-foreground/10">
                          +{hackathon.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium border-t border-border pt-4">
                      <div className="text-accent-start">{hackathon.prizePool || 'TBA'} Prize</div>
                      <div className="text-foreground/40">{hackathon.participantsCount || 0} participants</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-2xl bg-foreground/[0.01]">
              <Filter className="mx-auto text-foreground/20 mb-4" size={40} />
              <h3 className="text-lg font-semibold text-foreground mb-2">No hackathons found</h3>
              <p className="text-foreground/50 text-sm max-w-sm mx-auto">
                We couldn't find any hackathons matching your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All Statuses');
                  setThemeFilter('All Themes');
                }}
                className="mt-6 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-sm text-foreground transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
