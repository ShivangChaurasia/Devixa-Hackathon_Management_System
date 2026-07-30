import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal, Users, Target, Shield, Zap, Rocket } from 'lucide-react';

export default function ShowcaseHome({ currentUser, setUser, onLogout }) {
  const navigate = useNavigate();
  const isAuthenticated = !!currentUser;
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 400, damping: 40 });
  const textY = useTransform(smoothScrollY, [0, 1000], [0, -300]);
  const backgroundY = useTransform(smoothScrollY, [0, 1000], [0, -50]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const smoothCursorX = useSpring(cursorX, { stiffness: 400, damping: 40 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 400, damping: 40 });
  const maskY = useTransform(() => smoothCursorY.get() + smoothScrollY.get());
  const maskImage = useMotionTemplate`radial-gradient(600px circle at ${smoothCursorX}px ${maskY}px, black 0%, transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, cursorX, cursorY]);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  
  const specularX = useTransform(mouseX, [-0.5, 0.5], ['100%', '-100%']);
  const specularY = useTransform(mouseY, [-0.5, 0.5], ['100%', '-100%']);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  
  const devCount = useSpring(0, { duration: 2000, bounce: 0 });
  const hackCount = useSpring(0, { duration: 2000, bounce: 0 });
  const projCount = useSpring(0, { duration: 2000, bounce: 0 });

  useEffect(() => {
    if (statsInView) {
      devCount.set(10000);
      hackCount.set(500);
      projCount.set(2500);
    }
  }, [statsInView, devCount, hackCount, projCount]);

  const useAnimatedCounter = (springValue, format = (v) => v) => {
    const [display, setDisplay] = React.useState(0);
    useEffect(() => {
      return springValue.on("change", (latest) => {
        setDisplay(format(Math.floor(latest)));
      });
    }, [springValue, format]);
    return display;
  };

  const devDisplay = useAnimatedCounter(devCount, (v) => `${v.toLocaleString()}+`);
  const hackDisplay = useAnimatedCounter(hackCount, (v) => `${v.toLocaleString()}+`);
  const projDisplay = useAnimatedCounter(projCount, (v) => `${v.toLocaleString()}+`);

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 300, damping: 20 });
  const btnSpringY = useSpring(btnY, { stiffness: 300, damping: 20 });

  const handleBtnMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Magnetic pull is stronger closer to center
    btnX.set(x * 0.3);
    btnY.set(y * 0.3);
  };

  const handleBtnLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const roleData = [
    {
      title: "Participants",
      icon: Terminal,
      features: ["Global Matching", "Skill Verification", "Portfolio Sync"]
    },
    {
      title: "Organizers",
      icon: Target,
      features: ["Automated Triage", "One-Click Invites", "Analytics Engine"]
    },
    {
      title: "Judges",
      icon: Shield,
      features: ["Focus Mode UI", "Live Scoring", "Conflict Resolution"]
    }
  ];

  return (
    <div ref={containerRef}>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] rounded-full blur-[120px]" 
          />
        </motion.div>

        <motion.div style={{ y: textY }} className="relative z-10 text-center max-w-5xl mx-auto space-y-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight"
          >
            <span className="text-white/90">
              {isAuthenticated ? `Welcome back, ${currentUser.name}.` : "The Operating System for Hackathons."}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="mt-16 relative mx-auto w-full max-w-4xl aspect-video rounded-[24px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
            
            <motion.div 
              style={{ x: specularX, y: specularY }}
              className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none opacity-50 z-10 mix-blend-overlay"
            />

            <div className="absolute inset-0 p-6 flex flex-col">
              <div className="flex gap-2 items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white/5 rounded-xl border border-white/5" />
                <div className="col-span-1 bg-white/5 rounded-xl border border-white/5" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ maskImage, WebkitMaskImage: maskImage }}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center pt-20 pb-32 px-6"
        >
          <motion.div style={{ y: textY }} className="relative text-center max-w-5xl mx-auto space-y-8 w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">
                {isAuthenticated ? `Welcome back, ${currentUser.name}.` : "The Operating System for Hackathons."}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              className="mt-16 relative mx-auto w-full max-w-4xl aspect-video rounded-[24px] bg-transparent invisible"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
          <motion.div 
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="md:col-span-2 md:row-span-1 rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent" />
            <h3 className="text-xl font-medium tracking-tight mb-2">Organizer Mission Control</h3>
            <p className="text-white/50 text-sm tracking-wide mb-8">Live applicant tracking and metrics.</p>
            <div className="w-full h-32 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-white/50 font-mono tracking-widest uppercase">Live</span>
              </div>
              <div className="flex gap-1 items-end h-16 w-3/4">
                {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#8B5CF6]/20 to-[#8B5CF6]/80 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="md:col-span-1 md:row-span-2 rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 flex flex-col"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent" />
            <h3 className="text-xl font-medium tracking-tight mb-2">Judge Focus Mode</h3>
            <p className="text-white/50 text-sm tracking-wide mb-8">Zero-distraction scoring interface.</p>
            <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/5 p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2 w-1/3 bg-white/20 rounded" />
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(j => (
                      <div key={j} className={`h-8 flex-1 rounded ${j <= 3 ? 'bg-[#8B5CF6]/40' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="md:col-span-2 md:row-span-1 rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent" />
            <h3 className="text-xl font-medium tracking-tight mb-2">Real-time Sync</h3>
            <p className="text-white/50 text-sm tracking-wide mb-8">Instant multi-user collaboration.</p>
            <div className="flex justify-center items-center h-32 relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[50px] rounded-full" />
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md flex items-center justify-center relative z-10"
                  >
                    <Users size={24} className="text-white/50" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 px-6 max-w-5xl mx-auto space-y-16">
        {roleData.map((role, idx) => {
          const Icon = role.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="flex flex-col md:flex-row gap-8 items-center md:items-start"
            >
              <div className="w-24 h-24 rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] flex items-center justify-center relative shrink-0">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent" />
                <Icon size={40} className="text-[#8B5CF6]" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tight">{role.title}</h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {role.features.map((feature, fIdx) => (
                    <motion.div 
                      key={fIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (fIdx * 0.1) }}
                      className="px-4 py-2 rounded-full bg-white/5 text-sm tracking-wide font-medium border border-white/5 flex items-center gap-2"
                    >
                      <Zap size={14} className="text-[#8B5CF6]" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section ref={statsRef} className="relative py-32 border-y border-white/[0.05] bg-black/40">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{devDisplay}</div>
            <div className="text-sm tracking-widest uppercase text-[#8B5CF6] font-semibold">Developers</div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{hackDisplay}</div>
            <div className="text-sm tracking-widest uppercase text-[#8B5CF6] font-semibold">Hackathons</div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{projDisplay}</div>
            <div className="text-sm tracking-widest uppercase text-[#8B5CF6] font-semibold">Projects</div>
          </div>
        </div>
      </section>

      <section className="relative py-48 px-6 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#8B5CF6]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
            {isAuthenticated ? `Resume Command, ${currentUser.name}.` : "Ready to Build the Future?"}
          </h2>
          
          <motion.button
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
            whileTap={{ scale: 0.95 }}
            style={{ x: btnSpringX, y: btnSpringY }}
            onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/login')}
            className="group relative px-10 py-5 rounded-full bg-gradient-to-b from-[#9d77f7] to-[#8B5CF6] text-white font-semibold text-lg tracking-wide overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              {isAuthenticated ? "Enter Dashboard" : "Start Building"}
              <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
