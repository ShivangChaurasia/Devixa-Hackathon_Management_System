import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { GripVertical, Home, LayoutDashboard, Trophy, Users, Award, Plus, Shield, Settings, LogOut, Sun, Moon, Sparkles, Info, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function KineticDock({ user, onLogout, showThemeToggle = true }) {
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    setIsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsVisible(false), 15000);
  }, []);

  useEffect(() => {
    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  const navigationMap = {
    PARTICIPANT: [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
      { name: 'Hackathons', path: '/app/hackathons', icon: Trophy },
      { name: 'My Teams', path: '/app/teams', icon: Users },
      { name: 'Certificates', path: '/app/certificates', icon: Award },
    ],
    ORGANIZER: [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Dashboard', path: '/app/organizer', icon: LayoutDashboard },
      { name: 'Create', path: '/app/organizer/create', icon: Plus },
    ],
    JUDGE: [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Evaluations', path: '/app/judge', icon: Shield },
    ],
  };

  const isAuthenticated = !!user;
  const userRole = user?.role?.toUpperCase();
  
  const publicLinks = [
    { name: 'Features', path: '/#features', icon: Sparkles },
    { name: 'Hackathons', path: '/hackathons', icon: Trophy },
    { name: 'About', path: '/about', icon: Info },
  ];

  const authLinks = userRole === 'ADMIN' 
    ? [{ name: 'Home', path: '/', icon: Home }, { name: 'Admin', path: '/app/admin', icon: Settings }]
    : (navigationMap[user?.activeView] || navigationMap[userRole] || navigationMap['PARTICIPANT']);

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[90]" ref={constraintsRef} />
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        whileDrag={{ 
          scale: 0.98,
          boxShadow: '0 25px 50px -12px rgba(139,92,246,0.3)',
          backdropFilter: 'blur(24px)'
        }}
        initial={{ y: -100, opacity: 0, x: '-50%' }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed top-6 left-1/2 z-[100] flex items-center h-14 rounded-full bg-[#111115]/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] px-3 font-sans"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent rounded-full pointer-events-none" />
        
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="flex items-center justify-center h-full px-2 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors"
        >
          <GripVertical size={18} />
        </div>

        <div className="w-px h-7 bg-white/10 mx-1.5" />

        <div className="flex items-center gap-0.5 px-1">
          <AnimatePresence mode="popLayout">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.path}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                      relative flex items-center gap-1.5 px-3 h-9 rounded-full text-[13px] font-medium transition-all duration-300 whitespace-nowrap
                      ${isActive && (link.path !== '/' || window.location.pathname === '/') ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={15} />
                        <span className="hidden md:inline-block">{link.name}</span>
                        {isActive && (link.path !== '/' || window.location.pathname === '/') && (
                          <motion.div
                            layoutId="activeDockIndicator"
                            className="absolute inset-x-0 -bottom-2.5 h-[3px] bg-[#8B5CF6] rounded-t-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          <motion.div layout className="w-px h-7 bg-white/10 mx-1.5" />

          {showThemeToggle && (
            <motion.button
              layout
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-yellow-400 hover:bg-white/5 transition-all duration-300"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>
          )}
          
          <AnimatePresence mode="popLayout">
            {isAuthenticated ? (
              <motion.div
                key="auth-actions"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-1.5"
              >
                <NavLink
                  to="/app/profile"
                  className={({ isActive }) => `
                    relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
                    ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-[10px] font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </NavLink>
                
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-red-400 hover:bg-white/5 transition-all duration-300"
                >
                  <LogOut size={15} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="guest-actions"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-2 pr-1"
              >
                <Link to="/login" className="flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <LogIn size={14} />
                  Log In
                </Link>
                <Link to="/login?mode=signup" className="flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-medium bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300">
                  <UserPlus size={14} />
                  Sign Up
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
