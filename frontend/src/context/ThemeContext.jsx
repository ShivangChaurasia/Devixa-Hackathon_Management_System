import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

const ThemeContext = createContext({
  theme: 'system',
  toggleTheme: () => null,
  setTheme: () => null,
});

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    return localStorage.getItem('devixa-theme') || 'system';
  };

  const [theme, setThemeState] = useState(getInitialTheme);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync from backend on load
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        if (localStorage.getItem('accessToken')) {
          const res = await apiClient.get('/users/theme');
          if (res.theme) {
            setThemeState(res.theme);
            localStorage.setItem('devixa-theme', res.theme);
          }
        }
      } catch (err) {
        console.error('Failed to sync theme:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchTheme();
  }, []);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('devixa-theme', newTheme);
    applyTheme(newTheme);

    // Sync to backend
    if (localStorage.getItem('accessToken')) {
      try {
        await apiClient.patch('/users/theme', { theme: newTheme });
      } catch (err) {
        console.error('Failed to update theme on server:', err);
      }
    }
  };

  const applyTheme = (t) => {
    let resolvedTheme = t;
    if (t === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (resolvedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Watch theme state
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Watch system changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
