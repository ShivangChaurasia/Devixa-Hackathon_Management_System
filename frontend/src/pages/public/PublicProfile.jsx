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
          
          {/* Left Column (Role-Specific Stats & Skills) */}
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity size={18} className="text-accent-start" />
                {profile.role === 'ORGANIZER' ? 'Organizer Stats' : profile.role === 'JUDGE' ? 'Judge Activity' : 'Participant Metrics'}
              </h3>
              <div className="space-y-4">
                {profile.role === 'ORGANIZER' && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                      <span className="text-foreground/70 text-sm">Hackathons Organized</span>
                      <span className="text-foreground font-bold text-lg">{profile.stats?.hackathonsOrganized || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                      <span className="text-foreground/70 text-sm">Total Audience Hosted</span>
                      <span className="text-accent-start font-bold text-lg">{profile.stats?.totalParticipantsHosted || 0}</span>
                    </div>
                  </>
                )}

                {profile.role === 'JUDGE' && (
                  <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                    <span className="text-foreground/70 text-sm">Events Supervised & Judged</span>
                    <span className="text-accent-start font-bold text-lg">{profile.stats?.hackathonsJudged || 0}</span>
                  </div>
                )}

                {profile.role === 'PARTICIPANT' && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                      <span className="text-foreground/70 text-sm">Hackathons Entered</span>
                      <span className="text-foreground font-bold text-lg">{profile.stats?.hackathonsParticipated || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                      <span className="text-foreground/70 text-sm">Approved Applications</span>
                      <span className="text-status-success font-bold text-lg">{profile.stats?.approvedRegistrations || 0}</span>
                    </div>
                  </>
                )}
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

          {/* Right Column (Role-Specific Activity History) */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-6 min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Trophy size={18} className="text-accent-start" />
                  {profile.role === 'ORGANIZER' ? 'Hosted Hackathons' : profile.role === 'JUDGE' ? 'Judged Events' : 'Participated Events'}
                </h3>
              </div>

              {profile.activityList && profile.activityList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.activityList.map((item, idx) => (
                    <Link key={item._id || idx} to={`/app/hackathons/${item._id}`} className="block group">
                      <div className="p-4 rounded-xl bg-background border border-border group-hover:border-accent-start/50 transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-start/10 text-accent-start">
                              {item.status || 'ACTIVE'}
                            </span>
                          </div>
                          <h4 className="font-bold text-foreground group-hover:text-accent-start transition-colors">{item.title}</h4>
                        </div>
                        <div className="text-xs text-foreground/40 mt-4 pt-3 border-t border-border flex items-center gap-1">
                          <Calendar size={12} /> {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Active'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-foreground/30">
                  <Trophy size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No activity records found for this {profile.role?.toLowerCase() || 'user'}.</p>
                </div>
              )}
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
