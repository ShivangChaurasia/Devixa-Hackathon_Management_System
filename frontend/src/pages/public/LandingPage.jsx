import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Award, Shield, BarChart3, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import { apiClient } from '../../services/apiClient';
import { useApi } from '../../hooks/useApi';

const UI_PLATFORM_STATS = [
  { label: 'Developers', value: '50K+' },
  { label: 'Hackathons', value: '200+' },
  { label: 'Prizes Awarded', value: '$2M+' },
  { label: 'Organizations', value: '150+' },
];

const UI_TESTIMONIALS = [
  {
    id: 1,
    quote: "Devixa completely transformed how we run our annual university hackathon. The judging system is incredible.",
    author: "Sarah Chen",
    role: "Lead Organizer, HackTheFuture",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    quote: "The cleanest UI I've ever seen for a hackathon platform. Finding teammates and submitting projects was a breeze.",
    author: "Alex Morgan",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    quote: "As a judge, the unified rubric view saved me hours of time. Highly recommend for any scale event.",
    author: "Dr. James Wilson",
    role: "Senior Engineer, TechCorp",
    avatar: "https://i.pravatar.cc/150?img=68"
  }
];

const UI_ORGANIZATIONS = [
  { id: 1, name: 'TechCorp', logo: 'https://ui-avatars.com/api/?name=TC&background=1e1e1e&color=fff&size=64' },
  { id: 2, name: 'Web3 Foundation', logo: 'https://ui-avatars.com/api/?name=W3&background=1e1e1e&color=fff&size=64' },
  { id: 3, name: 'OpenSource Initiative', logo: 'https://ui-avatars.com/api/?name=OS&background=1e1e1e&color=fff&size=64' },
  { id: 4, name: 'University Coding Club', logo: 'https://ui-avatars.com/api/?name=UC&background=1e1e1e&color=fff&size=64' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: hackathonsResult, loading, execute: fetchHackathons } = useApi(apiClient.get);

  useEffect(() => {
    fetchHackathons('/hackathons?status=Active,Upcoming&limit=3');
  }, [fetchHackathons]);
  
  const hackathons = hackathonsResult?.hackathons || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-start/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-end/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-24 pb-20 md:pt-32 md:pb-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-sm font-medium text-foreground/70 mb-8">
              <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              200+ hackathons hosted and counting
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
              The platform for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end">
                world-class hackathons
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover, participate, organize, and judge hackathons — all in one place. From registration to certification, Devixa handles the entire lifecycle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/hackathons')}
                className="px-8 py-3.5 rounded-full text-base font-medium text-foreground bg-gradient-to-r from-accent-start to-accent-end shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                Browse Hackathons <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/auth', { state: { isSignUp: true } })}
                className="px-8 py-3.5 rounded-full text-base font-medium text-foreground/70 bg-foreground/5 border border-border hover:bg-foreground/10 hover:text-foreground transition-all"
              >
                Start Organizing
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
          >
            {UI_PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Hackathons</h2>
          <p className="text-foreground/50 max-w-lg mx-auto">Join thousands of developers building the future. Find the perfect hackathon for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-3 text-center text-foreground/50 py-10">Loading hackathons...</div>
          ) : hackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon._id || hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/hackathons/${hackathon._id || hackathon.id}`)}
              className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-accent-start/40 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} alt={hackathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${hackathon.status === 'Active' ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-status-info/20 text-status-info border border-status-info/30'}`}>
                  {hackathon.status}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-foreground/40 mb-1">{hackathon.organization}</p>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent-start transition-colors">{hackathon.title}</h3>
                <p className="text-sm text-foreground/50 mb-4 line-clamp-2">{hackathon.tagline}</p>
                <div className="flex items-center justify-between text-xs text-foreground/40">
                  <span>{hackathon.prizePool || 'TBA'} Prize Pool</span>
                  <span>{hackathon.participantsCount || 0} participants</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/hackathons')} className="text-sm font-medium text-accent-start hover:text-foreground transition-colors flex items-center gap-2 mx-auto">
            View all hackathons <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-card-secondary border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for every role</h2>
            <p className="text-foreground/50 max-w-lg mx-auto">Whether you're hacking, organizing, or judging — Devixa is designed for your workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'For Participants',
                description: 'Discover hackathons, form teams, collaborate in workspaces, submit projects, and earn certificates — all from one dashboard.',
                features: ['Browse & filter hackathons', 'Team workspace with tasks & files', 'Auto-saving submissions', 'Certificate gallery'],
              },
              {
                icon: BarChart3,
                title: 'For Organizers',
                description: 'Create hackathons with a guided wizard, manage registrations, assign judges, track submissions, and declare winners.',
                features: ['Multi-step hackathon creation', 'Registration management', 'Judge assignment & rubrics', 'Announcements & timeline'],
              },
              {
                icon: Award,
                title: 'For Judges',
                description: 'Evaluate submissions with structured rubrics, leave detailed feedback, and communicate privately with organizers.',
                features: ['Evaluation queue', 'Scoring rubrics (1-10)', 'Private discussion threads', 'Special mention recommendations'],
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-background border border-border hover:border-accent-start/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-start/10 flex items-center justify-center mb-6">
                  <feature.icon className="text-accent-start" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-foreground/60 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((f) => (
                    <li key={f} className="text-sm text-foreground/50 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-start shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Loved by builders</h2>
          <p className="text-foreground/50">Hear from participants, organizers, and judges who use Devixa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UI_TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-sm text-foreground/70 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full bg-foreground/10" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.author}</div>
                  <div className="text-xs text-foreground/40">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partner Organizations */}
      <section className="border-t border-border bg-card-secondary">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-wider text-foreground/40 font-medium">Trusted by leading organizations</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-60">
            {UI_ORGANIZATIONS.map((org) => (
              <div key={org.name} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                <img src={org.logo} alt={org.name} className="w-8 h-8 rounded-full" />
                <span className="font-semibold text-foreground/70">{org.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-start/10 to-accent-end/10 rounded-[3rem] -z-10" />
        <div className="absolute inset-0 border border-foreground/10 rounded-[3rem] -z-10" />
        
        <div className="text-center z-10 relative px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Start building your legacy</h2>
          <p className="text-foreground/60 max-w-xl mx-auto mb-10 text-lg">
            Join the fastest growing platform for hackathons. Create your account today and start hacking.
          </p>
          <button
            onClick={() => navigate('/auth', { state: { isSignUp: true } })}
            className="px-10 py-4 rounded-full text-lg font-bold text-foreground bg-foreground/10 border border-foreground/20 backdrop-blur-md hover:bg-foreground/20 hover:scale-105 transition-all shadow-xl"
          >
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
