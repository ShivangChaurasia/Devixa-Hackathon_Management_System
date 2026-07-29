import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown, LogOut, Award, Trophy, Sun, Moon } from 'lucide-react';
import CommandPalette from '../ui/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const { data: notifsRes, execute: fetchNotifs } = useApi(apiClient.get);

  useEffect(() => {
    fetchNotifs('/notifications').catch(() => null);
  }, [fetchNotifs]);

  const notifications = notifsRes?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation links based on active view
  const navigationMap = {
    PARTICIPANT: [
      { name: 'Dashboard', path: '/app/dashboard' },
      { name: 'Hackathons', path: '/app/hackathons' },
      { name: 'My Teams', path: '/app/teams' },
      { name: 'Certificates', path: '/app/certificates' },
    ],
    ORGANIZER: [
      { name: 'Dashboard', path: '/app/organizer' },
      { name: 'Create Hackathon', path: '/app/organizer/create' },
    ],
    JUDGE: [
      { name: 'Evaluations', path: '/app/judge' },
    ],
  };

  const userRole = user?.role?.toUpperCase();
  const navLinks = userRole === 'ADMIN' 
    ? [{ name: 'Admin Panel', path: '/app/admin' }]
    : (navigationMap[user?.activeView] || navigationMap[userRole] || navigationMap['PARTICIPANT']);

  // Only show switchable capabilities (exclude ADMIN)
  const switchableCapabilities = (user?.capabilities || []).filter(c => c !== 'ADMIN');

  const switchContext = (view) => {
    setUser({ ...user, activeView: view });
    setIsContextDropdownOpen(false);
    // Navigate to the default route for that view
    const defaultRoutes = { PARTICIPANT: '/app/dashboard', ORGANIZER: '/app/organizer', JUDGE: '/app/judge' };
    navigate(defaultRoutes[view] || '/app/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1400px] mx-auto gap-6">

        {/* Logo & Context Switcher */}
        <div className="flex items-center gap-3">
          <NavLink to={user?.role === 'ADMIN' ? "/app/admin" : "/app/dashboard"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-start to-accent-end flex items-center justify-center font-bold text-foreground shadow-lg">
              D
            </div>
            <span className="font-bold text-xl hidden sm:block">Devixa</span>
          </NavLink>

          {switchableCapabilities.length > 1 && user?.role !== 'ADMIN' && (
            <div className="relative">
              <button
                onClick={() => setIsContextDropdownOpen(!isContextDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors text-xs font-semibold text-foreground/60 hover:text-foreground uppercase tracking-wider"
              >
                {user?.activeView}
                <ChevronDown size={12} className={`transition-transform ${isContextDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isContextDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsContextDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 w-44 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl p-1.5 z-50"
                    >
                      <div className="text-[10px] font-semibold text-foreground/30 px-3 py-2 uppercase tracking-wider">Switch Context</div>
                      {switchableCapabilities.map(cap => (
                        <button
                          key={cap}
                          onClick={() => switchContext(cap)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${user?.activeView === cap ? 'bg-accent-start/20 text-accent-start font-medium' : 'hover:bg-foreground/5 text-foreground/70 hover:text-foreground'}`}
                        >
                          {cap}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-foreground/10 text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {/* Search/Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 text-foreground/40 transition-colors w-48"
          >
            <Search size={14} />
            <span className="text-xs font-medium flex-1 text-left">Search...</span>
            <kbd className="hidden lg:inline-flex px-1.5 rounded bg-background text-[10px] font-mono border border-border">⌘K</kbd>
          </button>

          <button onClick={() => setIsCommandOpen(true)} className="sm:hidden p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
            <Search size={20} />
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
            {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Notifications */}
          <button onClick={() => navigate('/app/notifications')} className="relative p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-error ring-4 ring-background" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-start/20 to-accent-end/20 border border-border flex items-center justify-center hover:border-accent-start/50 transition-colors shadow-inner"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-foreground">{(user?.name || 'U').charAt(0).toUpperCase()}</span>
              )}
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-2 z-50 divide-y divide-border"
                  >
                    <div className="px-3 py-3">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-foreground/50 truncate">{user?.email}</p>

                      {userRole === 'PARTICIPANT' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Trophy size={14} className="text-accent-start" />
                          <span className="text-xs font-medium text-foreground/80">300 Global Points</span>
                        </div>
                      )}
                    </div>

                    <div className="p-1">
                      <button onClick={() => { setIsProfileDropdownOpen(false); navigate('/app/profile'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors">
                        My Profile
                      </button>
                      {userRole === 'PARTICIPANT' && (
                        <>
                          <button onClick={() => { setIsProfileDropdownOpen(false); navigate('/app/leaderboard'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors">
                            Leaderboard
                          </button>
                          <button onClick={() => { setIsProfileDropdownOpen(false); navigate('/app/certificates'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors">
                            Certificates
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-status-error/80 hover:text-status-error hover:bg-status-error/10 transition-colors"
                      >
                        Sign out
                        <LogOut size={14} />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-2 p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              <div className="text-[10px] font-semibold text-foreground/30 px-2 uppercase tracking-wider mb-1">Navigation</div>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-foreground/10 text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} user={user} />
    </header>
  );
}
