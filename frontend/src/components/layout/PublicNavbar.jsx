import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function PublicNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: 'Browse Hackathons', path: '/hackathons' },
    { name: 'For Organizers', path: '/hackathons' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1200px] mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-start to-accent-end flex items-center justify-center font-bold text-foreground shadow-lg">
            D
          </div>
          <span className="font-bold text-xl text-foreground">Devixa</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-5 py-2 rounded-full text-sm font-medium text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] transition-all"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-foreground/10 transition-colors" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1 overflow-hidden"
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              >
                {link.name}
              </NavLink>
            ))}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <button onClick={() => { navigate('/auth'); setIsMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5">Sign In</button>
              <button onClick={() => { navigate('/auth'); setIsMobileOpen(false); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium text-foreground bg-gradient-to-r from-accent-start to-accent-end">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
