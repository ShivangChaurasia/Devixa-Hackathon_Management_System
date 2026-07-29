import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { User, Link as LinkIcon, Calendar, Trophy, Briefcase, ExternalLink, Activity } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/${username}`);
        setProfile(res.profile);
      } catch (err) {
        setError(err.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-md w-full">
          <User size={48} className="mx-auto text-foreground/20 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-foreground/60 mb-6">{error || 'The user you are looking for does not exist.'}</p>
          <Link to="/" className="text-accent-start hover:text-accent-end font-medium transition-colors">
            Return Home
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Banner */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-accent-start/20 to-accent-end/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-end/30 blur-[100px] rounded-full" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-start/30 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24">
        {/* Profile Header */}
        <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background bg-surface shrink-0 relative z-10 shadow-2xl">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-start/20 to-accent-end/20 flex items-center justify-center text-4xl font-bold text-accent-start uppercase">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-grow w-full pt-2">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{profile.name}</h1>
                <p className="text-xl text-accent-start font-medium mb-3">@{profile.username}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-foreground/10 rounded-full text-xs font-semibold text-foreground tracking-wide uppercase">
                    {profile.role}
                  </span>
                  <span className="px-3 py-1 bg-foreground/5 rounded-full text-xs text-foreground/70 flex items-center gap-1">
                    <Calendar size={12} /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl text-foreground/70 hover:text-foreground transition-all">
                    <LinkIcon size={20} />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl text-foreground/70 hover:text-[#0077b5] transition-all">
                    <LinkIcon size={20} />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl text-foreground/70 hover:text-accent-start transition-all">
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="text-foreground/70 leading-relaxed max-w-3xl mt-4">
                {profile.bio}
              </p>
            )}
          </div>
        </GlassCard>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Stats & Skills) */}
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity size={18} className="text-accent-start" />
                Platform Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                  <span className="text-foreground/70 text-sm">Hackathons Attended</span>
                  <span className="text-foreground font-bold text-lg">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                  <span className="text-foreground/70 text-sm">Projects Submitted</span>
                  <span className="text-foreground font-bold text-lg">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                  <span className="text-foreground/70 text-sm">Teams Joined</span>
                  <span className="text-foreground font-bold text-lg">0</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-accent-start" />
                Skills & Tech
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-accent-start/10 border border-accent-start/20 text-accent-start text-xs font-medium rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/40 text-sm italic">No skills added yet.</p>
              )}
            </GlassCard>
          </div>

          {/* Right Column (Achievements & Projects) */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Trophy size={18} className="text-accent-start" />
                  Achievements
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center h-40 text-foreground/30">
                <Trophy size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No achievements unlocked yet.</p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ExternalLink size={18} className="text-accent-start" />
                  Recent Projects
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center h-48 text-foreground/30">
                <p className="text-sm">No public projects available.</p>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
