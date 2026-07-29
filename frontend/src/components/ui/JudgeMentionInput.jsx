import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/apiClient';
import { User, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JudgeMentionInput({ selectedEmails = [], onChange, placeholder = "Type judge email or name..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchJudges = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setLoading(true);
      try {
        const res = await apiClient.get(`/users/search?role=JUDGE&query=${encodeURIComponent(query)}`);
        const usersList = res.users || res.data?.users || [];
        setSuggestions(usersList);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to search judges:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchJudges, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    const emailToAdd = user.email || user.username;
    if (emailToAdd && !selectedEmails.includes(emailToAdd)) {
      onChange([...selectedEmails, emailToAdd]);
    }
    setQuery('');
    setShowDropdown(false);
  };

  const handleAddManualEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = query.trim().replace(',', '');
      if (trimmed && !selectedEmails.includes(trimmed)) {
        onChange([...selectedEmails, trimmed]);
        setQuery('');
        setShowDropdown(false);
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    onChange(selectedEmails.filter(e => e !== emailToRemove));
  };

  return (
    <div className="relative space-y-3" ref={containerRef}>
      {/* Selected Tags */}
      {selectedEmails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-start/15 border border-accent-start/30 text-accent-start text-xs font-semibold"
            >
              <span>@{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveEmail(email)}
                className="hover:text-foreground transition-colors p-0.5 rounded-full"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Mention Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/40">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleAddManualEmail}
          placeholder={placeholder}
          className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded-xl text-foreground text-sm placeholder-foreground/30 focus:border-accent-start outline-none transition-all"
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-4 h-4 border-2 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Floating Mention Autocomplete Dropdown */}
      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-card border border-border rounded-xl shadow-2xl divide-y divide-border/50"
          >
            {suggestions.map((u) => {
              const isSelected = selectedEmails.includes(u.email) || selectedEmails.includes(u.username);
              return (
                <button
                  key={u._id || u.username}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  disabled={isSelected}
                  className="w-full flex items-center justify-between p-3 hover:bg-foreground/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent-start/20 flex items-center justify-center text-accent-start font-bold text-xs">
                        {u.name?.charAt(0) || 'J'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-sm">{u.name}</div>
                      <div className="text-xs text-foreground/50">@{u.username || u.email} • <span className="text-accent-start font-medium">{u.role}</span></div>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="text-xs font-semibold text-status-success flex items-center gap-1">
                      <Check size={14} /> Added
                    </span>
                  ) : (
                    <span className="text-xs text-foreground/40 hover:text-accent-start font-medium">
                      + Invite
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
