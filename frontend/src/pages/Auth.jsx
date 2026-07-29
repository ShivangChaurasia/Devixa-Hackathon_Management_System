import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { signInWithGoogle } from '../firebase.js';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { apiClient } from '../services/apiClient';

export default function Auth({ onAuthSuccess }) {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuccess = (data) => {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (onAuthSuccess) onAuthSuccess(data.user);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    const res = await signInWithGoogle();
    if (!res.success) {
      // Because Google Auth popup is often blocked or fails due to network/SSL errors in local dev,
      // we will automatically bypass it using our local API if we are in development mode.
      if (import.meta.env.DEV) {
        console.warn("Firebase Auth failed, bypassing with a mock DEV Google account.");
        try {
          const fallbackEmail = prompt("Google Auth Failed (Network/CORS).\n\nDEV BYPASS: Enter the email address you want to log in as:", formData.email || "dev-google@example.com");
          
          if (!fallbackEmail) {
            setError('Google Sign-In failed and bypass was cancelled.');
            setLoading(false);
            return;
          }

          const mockName = fallbackEmail.split('@')[0];
          const data = await apiClient.post('/auth/google', {
            email: fallbackEmail,
            name: mockName,
            avatar: '',
            googleId: 'dev-mock-google-id-' + fallbackEmail,
            role: 'PARTICIPANT',
          });
          handleSuccess(data);
          return;
        } catch (err) {
          setError(err.message || 'Mock Dev Authentication failed');
          setLoading(false);
          return;
        }
      }

      // If in production, show the actual error
      setError(res.error || 'Google Sign-In failed due to network settings.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.post('/auth/google', {
        email: res.user.email,
        name: res.user.name,
        avatar: res.user.avatar,
        googleId: res.user.uid,
        role: 'PARTICIPANT',
      });
      handleSuccess(data);
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role: 'PARTICIPANT' };

    try {
      const data = await apiClient.post(endpoint, payload);
      handleSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-start/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-end/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard hover={false} className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-border text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-accent-start"></div>
              Devixa Platform
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-foreground/60 text-sm">
              {isLogin ? 'Sign in to access your dashboard' : 'Join the developer ecosystem'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-status-error/10 border border-status-error/20 text-status-error text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            onClick={handleGoogleAuth} 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-foreground/5 border border-border hover:bg-foreground/10 hover:border-border-hover transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-foreground/40 uppercase font-medium tracking-wider">Or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:border-accent-start focus:ring-1 focus:ring-accent-start outline-none transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:border-accent-start focus:ring-1 focus:ring-accent-start outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:border-accent-start focus:ring-1 focus:ring-accent-start outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <GradientButton 
              type="submit" 
              className="w-full mt-2" 
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </GradientButton>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-accent-start hover:text-accent-end transition-colors font-medium ml-1"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
