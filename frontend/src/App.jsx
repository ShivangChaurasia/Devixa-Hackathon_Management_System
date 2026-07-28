import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import PublicHackathons from './pages/public/PublicHackathons';
import PublicHackathonDetails from './pages/public/PublicHackathonDetails';
import Auth from './pages/Auth';

// Authenticated Layout
import AppLayout from './components/layout/AppLayout';

// Authenticated Pages
import DashboardOverview from './pages/DashboardOverview';
import Hackathons from './pages/Hackathons';
import HackathonDetails from './pages/HackathonDetails';
import Teams from './pages/Teams';
import TeamManagement from './features/teams/TeamManagement';
import ProjectSubmission from './features/submissions/ProjectSubmission';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Certificates from './pages/Certificates';
import Leaderboard from './pages/Leaderboard';

// Role Pages
import JudgeDashboard from './pages/roles/JudgeDashboard';
import OrganizerDashboard from './pages/roles/OrganizerDashboard';
import CreateHackathonWizard from './features/organizer/CreateHackathonWizard';
import AdminDashboard from './pages/roles/AdminDashboard';

import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    } else if (accessToken) {
      setUser({
        name: 'Demo User',
        email: 'demo@example.com',
        capabilities: ['PARTICIPANT'],
        activeView: 'PARTICIPANT',
        avatar: '',
      });
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES (Anonymous Access)             */}
        {/* ============================================ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/hackathons" element={<PublicHackathons />} />
        <Route path="/hackathons/:id" element={<PublicHackathonDetails />} />
        <Route
          path="/auth"
          element={
            user ? <Navigate to="/app/dashboard" replace /> : <Auth onAuthSuccess={handleAuthSuccess} />
          }
        />

        {/* ============================================ */}
        {/* AUTHENTICATED ROUTES (under /app)            */}
        {/* ============================================ */}
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} setUser={setUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview user={user} />} />

          {/* Participant Routes */}
          <Route path="hackathons" element={<Hackathons />} />
          <Route path="hackathons/:id" element={<HackathonDetails />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:id" element={<TeamManagement />} />
          <Route path="submissions/:id" element={<ProjectSubmission />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="leaderboard" element={<Leaderboard />} />

          {/* Organizer Routes */}
          <Route path="organizer" element={<OrganizerDashboard />} />
          <Route path="organizer/create" element={<CreateHackathonWizard />} />

          {/* Judge Routes */}
          <Route path="judge" element={<JudgeDashboard />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* Legacy redirect: /dashboard/* → /app/* */}
        <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
