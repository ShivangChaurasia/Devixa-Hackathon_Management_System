import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
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

  const allHackathons = Array.isArray(data) ? data : (data?.hackathons || []);

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
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Browse Hackathons</h1>
          <p className="text-foreground/50 max-w-lg">Discover hackathons from universities, startups, and communities worldwide.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input
              type="text"
              placeholder="Search by title, organization, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-xl outline-none focus:border-accent-start transition-all text-foreground placeholder:text-foreground/40"
            />
          </div>
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-accent-start text-foreground/70 transition-colors cursor-pointer"
          >
            <option value="All">All Themes</option>
            {themes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-accent-start text-foreground/70 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-foreground/50 py-20">Loading hackathons...</div>
        ) : filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon._id || hackathon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/hackathons/${hackathon._id || hackathon.id}`)}
                className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-accent-start/40 transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    hackathon.status === 'Active' ? 'bg-status-success/20 text-status-success border border-status-success/30' :
                    hackathon.status === 'Upcoming' ? 'bg-status-info/20 text-status-info border border-status-info/30' :
                    'bg-foreground/10 text-foreground/60 border border-foreground/20'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-foreground/40 mb-1">{hackathon.organization || 'Community'}</p>
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-accent-start transition-colors">{hackathon.title}</h3>
                  <p className="text-sm text-foreground/50 mb-4 line-clamp-2">{hackathon.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hackathon.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] text-foreground/60">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-foreground/40 pt-4 border-t border-border">
                    <span>{hackathon.prizePool || 'TBA'} Prize Pool</span>
                    <span>{hackathon.participantsCount || 0} participants</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Filter className="mx-auto text-foreground/20 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No hackathons found</h3>
            <p className="text-foreground/50 mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setThemeFilter('All');
              }}
              className="px-4 py-2 rounded-lg bg-foreground/5 border border-border text-sm text-foreground/80 hover:bg-foreground/10 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
