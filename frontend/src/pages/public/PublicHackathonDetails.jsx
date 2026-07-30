import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, ChevronLeft, CheckCircle2, Clock, ArrowRight, FileText, ExternalLink, HelpCircle, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';

export default function PublicHackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error, execute: fetchHackathon } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathon(`/hackathons/${id}`);
  }, [id, fetchHackathon]);

  const hackathon = data?.hackathon;

  if (loading) {
    return (
      <div className="relative pt-32 pb-20">
        <div className="text-center py-20 text-white/50 font-medium">Loading details...</div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="relative pt-32 pb-20">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Hackathon not found</h2>
          <button onClick={() => navigate('/hackathons')} className="text-[#8B5CF6] hover:underline text-sm font-medium">Back to hackathons</button>
        </div>
      </div>
    );
  }

  // Calculate countdown
  const deadlineDate = new Date(hackathon.submissionDeadline);
  const now = new Date();
  const diffMs = deadlineDate - now;
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'prizes', label: 'Prizes' },
    { id: 'rules', label: 'Rules & Resources' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="relative pt-32 pb-20">

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">
        <button onClick={() => navigate('/hackathons')} className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6 text-sm font-medium">
          <ChevronLeft size={16} /> All Hackathons
        </button>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden h-[360px] mb-8 border border-border">
          <img src={hackathon.coverImage} alt={hackathon.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                hackathon.status === 'Active' ? 'bg-status-success/20 text-status-success border border-status-success/30' :
                hackathon.status === 'Upcoming' ? 'bg-status-info/20 text-status-info border border-status-info/30' :
                'bg-foreground/10 text-foreground/60 border border-foreground/20'
              }`}>
                {hackathon.status}
              </span>
              {hackathon.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-foreground/10 border border-foreground/20 rounded-full text-xs text-foreground">{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">{hackathon.title}</h1>
            <p className="text-lg text-foreground/70 font-medium">Organized by {hackathon.organization}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-foreground/5 text-foreground/60"><Calendar size={20} /></div>
              <div>
                <p className="text-xs text-foreground/40 uppercase tracking-wider">Dates</p>
                <p className="text-sm font-semibold text-foreground">{hackathon.startDate} — {hackathon.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-foreground/5 text-foreground/60"><MapPin size={20} /></div>
              <div>
                <p className="text-xs text-foreground/40 uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-foreground">{hackathon.location}</p>
              </div>
            </div>
            {daysLeft > 0 && hackathon.status !== 'Completed' && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-status-warning/10 text-status-warning"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-foreground/40 uppercase tracking-wider">Deadline</p>
                  <p className="text-sm font-semibold text-status-warning">{daysLeft} days left</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full md:w-auto px-10 py-3.5 rounded-full text-base font-medium text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Register Now <ArrowRight size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex gap-6 overflow-x-auto mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id ? 'border-accent-start text-foreground' : 'border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                  <p className="text-foreground/70 leading-relaxed">{hackathon.description}</p>
                </section>
                {hackathon.tracks.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Tracks</h2>
                    <div className="space-y-3">
                      {hackathon.tracks.map(track => (
                        <div key={track.name} className="p-4 rounded-xl border border-border bg-card flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground">{track.name}</h3>
                            <p className="text-sm text-foreground/50 mt-1">{track.description}</p>
                          </div>
                          <span className="text-sm font-bold text-accent-start shrink-0 ml-4">{track.prize}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {hackathon.mentors.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Mentors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hackathon.mentors.map(m => (
                        <div key={m.name} className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent-start/20 flex items-center justify-center text-accent-start font-bold">{m.name.charAt(0)}</div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{m.name}</h4>
                            <p className="text-xs text-foreground/50">{m.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">Event Timeline</h2>
                <div className="relative pl-8">
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-6">
                    {hackathon.timeline.map((event, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div className={`absolute left-[-22px] w-6 h-6 rounded-full flex items-center justify-center ${event.completed ? 'bg-status-success text-foreground' : 'bg-card border-2 border-border text-foreground/40'}`}>
                          {event.completed ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-foreground/30" />}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${event.completed ? 'text-foreground' : 'text-foreground/60'}`}>{event.label}</h4>
                          <p className="text-xs text-foreground/40 mt-0.5">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'prizes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Prize Pool — {hackathon.prizePool}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hackathon.prizes.map((prize, idx) => (
                    <div key={idx} className={`rounded-2xl border p-6 text-center ${idx === 0 ? 'border-accent-start/40 bg-accent-start/5' : 'border-border bg-card'}`}>
                      <div className="text-4xl mb-3">{prize.icon}</div>
                      <h3 className="font-semibold text-foreground mb-1">{prize.place}</h3>
                      <div className="text-2xl font-bold text-accent-start">{prize.amount}</div>
                    </div>
                  ))}
                </div>
                {hackathon.sponsors.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Sponsors</h3>
                    <div className="flex flex-wrap gap-3">
                      {hackathon.sponsors.map(s => (
                        <span key={s} className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground/70">{s}</span>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'rules' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Rules & Eligibility</h2>
                  <ul className="space-y-3">
                    {hackathon.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-foreground/70">
                        <CheckCircle2 className="text-accent-start shrink-0 mt-0.5" size={18} />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                {hackathon.resources.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Resources</h2>
                    <div className="space-y-3">
                      {hackathon.resources.map((res, idx) => (
                        <a key={idx} href={res.url} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent-start/40 transition-colors group">
                          <FileText size={18} className="text-foreground/40 group-hover:text-accent-start" />
                          <span className="text-sm font-medium text-foreground flex-1">{res.name}</span>
                          <span className="text-xs text-foreground/30 uppercase">{res.type}</span>
                          <ExternalLink size={14} className="text-foreground/30" />
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'faq' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                {hackathon.faqs.length > 0 ? (
                  <div className="space-y-3">
                    {hackathon.faqs.map((faq, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-border bg-card">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-accent-start" /> {faq.q}</h4>
                        <p className="text-sm text-foreground/60 pl-6">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-foreground/40">
                    <HelpCircle size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No FAQs have been posted for this hackathon yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-accent-start/20 bg-gradient-to-br from-card to-accent-start/5 p-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Trophy className="text-accent-start" size={20} /> Prize Pool
              </h3>
              <div className="text-4xl font-bold text-foreground mb-6">{hackathon.prizePool}</div>
              <div className="space-y-3">
                {hackathon.prizes.map((prize, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                    <span className="font-semibold text-foreground text-sm">{prize.icon} {prize.place}</span>
                    <span className="text-accent-start font-bold text-sm">{prize.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Users className="text-foreground/60" size={20} /> Participants
              </h3>
              <div className="text-3xl font-bold text-foreground">{hackathon.participants.toLocaleString()}</div>
              <p className="text-sm text-foreground/50 mt-1">hackers registered</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-foreground/40">Team Size</dt><dd className="text-foreground font-medium">{hackathon.minTeamSize}–{hackathon.maxTeamSize}</dd></div>
                <div className="flex justify-between"><dt className="text-foreground/40">Theme</dt><dd className="text-foreground font-medium">{hackathon.theme}</dd></div>
                <div className="flex justify-between"><dt className="text-foreground/40">Location</dt><dd className="text-foreground font-medium">{hackathon.location}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
