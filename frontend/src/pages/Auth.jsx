import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { signInWithGoogle } from '../firebase.js';
import { apiClient } from '../services/apiClient';
import GradientButton from '../components/ui/GradientButton';

const PremiumInput = ({ label, type, name, value, onChange, placeholder, isInvalid, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  const shakeAnimation = isInvalid ? {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.4 }
  } : {};

  return (
    <motion.div animate={shakeAnimation} className="relative w-full mb-6">
      <motion.label
        initial={false}
        animate={{
          y: isFocused || value ? -24 : 12,
          scale: isFocused || value ? 0.8 : 1,
          color: isFocused ? '#8B5CF6' : 'rgba(255,255,255,0.5)'
        }}
        className="absolute left-0 text-sm pointer-events-none origin-left transition-colors duration-300"
      >
        {label}
      </motion.label>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white outline-none focus:border-transparent transition-colors"
        placeholder={isFocused ? placeholder : ''}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
};

export default function Auth({ onAuthSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const from = location.state?.from?.pathname || '/app/dashboard';
  
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (invalidFields.includes(e.target.name)) {
      setInvalidFields(invalidFields.filter(f => f !== e.target.name));
    }
  };

  const handleSuccess = (data) => {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (onAuthSuccess) onAuthSuccess(data.user);
    navigate(from, { replace: true });
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    const res = await signInWithGoogle();
    if (!res.success) {
      if (import.meta.env.DEV) {
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
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      const invalid = [];
      if (!formData.email) invalid.push('email');
      if (!formData.password) invalid.push('password');
      if (!isLogin && !formData.name) invalid.push('name');
      setInvalidFields(invalid);
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role: 'PARTICIPANT' };

    try {
      const data = await apiClient.post(endpoint, payload);
      handleSuccess(data);
    } catch (err) {
      setError(err.message);
      setInvalidFields(['email', 'password']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden flex items-center justify-center font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <motion.div 
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#8B5CF6]/30 rounded-full blur-[150px] pointer-events-none z-0"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div 
        className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/20 rounded-full blur-[150px] pointer-events-none z-0"
        style={{ x: mouseX, y: mouseY, translateX: '10%', translateY: '10%' }}
      />

      <div className="relative z-10 w-full max-w-md p-6">
        <motion.div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-white/50 text-sm">
                  {isLogin ? 'Enter your credentials to continue.' : 'Join the premier developer ecosystem.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mb-8 mt-4">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <PremiumInput
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Satoshi Nakamoto"
                        isInvalid={invalidFields.includes('name')}
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <PremiumInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  isInvalid={invalidFields.includes('email')}
                  required
                />

                <PremiumInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  isInvalid={invalidFields.includes('password')}
                  required
                />

                <div className="mt-8">
                  <GradientButton type="submit" disabled={loading} className="w-full h-12">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </GradientButton>
                </div>
              </form>

              <div className="relative flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-white/30 font-medium uppercase tracking-widest">Or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all text-sm font-medium disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-white/50">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white hover:text-[#8B5CF6] transition-colors font-medium underline decoration-white/20 underline-offset-4"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
