import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Target, Users, Zap, Terminal, Rocket, CheckCircle2, Sliders } from 'lucide-react';
import GlobalUserSearch from '../../components/ui/GlobalUserSearch';

const KineticNodeMatrix = ({ activeRectRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initNodes();
    };

    let nodes = [];
    const spacing = 35;
    
    const initNodes = () => {
      nodes = [];
      const cols = Math.floor(width / spacing) + 2;
      const rows = Math.floor(height / spacing) + 2;
      for (let i = -1; i <= cols; i++) {
        for (let j = -1; j <= rows; j++) {
          nodes.push({
            x: i * spacing,
            y: j * spacing,
            base_x: i * spacing,
            base_y: j * spacing,
            vx: 0,
            vy: 0,
            angle: Math.random() * Math.PI * 2
          });
        }
      }
    };

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const rect = activeRectRef.current;
      const isCardHovered = rect && rect.width > 0;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        let dx = mouse.x - node.base_x;
        let dy = mouse.y - node.base_y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = node.base_x;
        let targetY = node.base_y;
        let isActive = false;
        let isSwirling = false;
        
        if (isCardHovered && 
            node.base_x > rect.left && node.base_x < rect.right &&
            node.base_y > rect.top && node.base_y < rect.bottom) {
            
            node.angle += 0.08;
            let radius = 25;
            targetX = node.base_x + Math.cos(node.angle) * radius;
            targetY = node.base_y + Math.sin(node.angle) * radius;
            isActive = true;
            isSwirling = true;
        } 
        else if (dist < 150) {
            targetX = node.base_x + dx * 0.4;
            targetY = node.base_y + dy * 0.4;
            isActive = true;
        }

        node.vx += (targetX - node.x) * 0.15;
        node.vy += (targetY - node.y) * 0.15;
        node.vx *= 0.75;
        node.vy *= 0.75;
        
        node.x += node.vx;
        node.y += node.vy;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        
        if (isActive) {
           ctx.fillStyle = '#06B6D4';
           ctx.shadowBlur = 12;
           ctx.shadowColor = '#06B6D4';
        } else {
           ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
           ctx.shadowBlur = 0;
        }
        ctx.fill();

        if (isActive && !isSwirling && dist < 150) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 1 - (dist / 150);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeRectRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default function Features() {
  const [activeSection, setActiveSection] = useState('organizers');
  const activeRectRef = useRef({ left: 0, top: 0, right: 0, bottom: 0, width: 0 });
  
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    activeRectRef.current = rect;
  };
  
  const handleMouseLeave = () => {
    activeRectRef.current = { left: 0, top: 0, right: 0, bottom: 0, width: 0 };
  };

  const sections = [
    { id: 'organizers', label: 'For Organizers' },
    { id: 'judges', label: 'For Judges' },
    { id: 'participants', label: 'For Participants' }
  ];

  const handleScroll = () => {
    const scrollPos = window.scrollY + 200;
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(section.id);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
    }
  };

  const scoreX = useMotionValue(100);
  const score = useTransform(scoreX, [0, 200], [0, 10]);
  const [displayScore, setDisplayScore] = useState(5.0);

  useEffect(() => {
    return score.onChange(v => setDisplayScore(Number(v).toFixed(1)));
  }, [score]);

  const [triageCount, setTriageCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTriageCount(prev => (prev >= 100 ? 0 : prev + Math.floor(Math.random() * 5) + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-32 overflow-hidden bg-[#09090B]">
      <KineticNodeMatrix activeRectRef={activeRectRef} />
      
      <GlobalUserSearch isAuthenticated={false} />

      <div className="sticky top-20 z-40 flex justify-center mb-16 px-4">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeSection === section.id ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeFeatureNav"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/[0.05]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 space-y-32">
        
        <section id="organizers" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Mission Control</h2>
            <p className="text-white/50 text-lg max-w-xl">Automate triage, streamline communications, and visualize analytics in real-time.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="md:col-span-2 group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10">
                <Target className="text-[#8B5CF6] mb-4" size={28} />
                <h3 className="text-2xl font-bold text-white mb-2">Automated Triage</h3>
                <p className="text-white/50 text-sm max-w-sm">Smart routing processes applications instantly based on custom criteria.</p>
              </div>
              <div className="relative h-24 mt-auto rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between px-6 overflow-hidden">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Applications Processed</span>
                  <span className="text-3xl font-bold text-white tracking-tighter">{triageCount}</span>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
              </div>
            </motion.div>

            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10">
                <Zap className="text-[#06B6D4] mb-4" size={28} />
                <h3 className="text-2xl font-bold text-white mb-2">Real-time Analytics</h3>
                <p className="text-white/50 text-sm">Monitor metrics as they happen.</p>
              </div>
              <div className="flex gap-2 items-end h-20 mt-6 relative z-10">
                {[40, 70, 45, 90, 60, 100].map((h, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#06B6D4]/10 to-[#06B6D4] rounded-t-md opacity-80 group-hover:opacity-100" 
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="judges" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Zero-Distraction Evaluation</h2>
            <p className="text-white/50 text-lg max-w-xl">Focus purely on the code and presentation with an immersive, distraction-free scoring UI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[280px]">
            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <Shield className="text-[#8B5CF6] mb-4" size={28} />
                  <h3 className="text-2xl font-bold text-white mb-2">Live Scoring</h3>
                  <p className="text-white/50 text-sm max-w-xs">Drag to adjust parameters in real time.</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#8B5CF6] uppercase tracking-widest font-bold">Total Score</span>
                  <span className="text-5xl font-bold text-white tracking-tighter shadow-[#8B5CF6] drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{displayScore}</span>
                </div>
              </div>
              
              <div className="relative w-full h-12 bg-white/[0.02] border border-white/[0.05] rounded-full mt-8 flex items-center px-1 z-20" onMouseEnter={handleMouseLeave} onMouseLeave={handleMouseEnter}>
                <div className="absolute left-4 text-xs font-bold text-white/30 uppercase tracking-widest pointer-events-none z-0">Innovation Score</div>
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/50 rounded-full z-0 pointer-events-none"
                  style={{ width: useTransform(scoreX, [0, 200], ["0%", "100%"]) }}
                />
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 200 }}
                  style={{ x: scoreX }}
                  className="w-10 h-10 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-grab active:cursor-grabbing relative z-10 flex items-center justify-center"
                >
                  <Sliders size={14} className="text-[#09090B]" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10">
                <Users className="text-[#06B6D4] mb-4" size={28} />
                <h3 className="text-2xl font-bold text-white mb-2">One-Click Handshakes</h3>
                <p className="text-white/50 text-sm max-w-sm">Instant conflict resolution and feedback syncing.</p>
              </div>
              <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle2 className="text-[#06B6D4]" size={20} /></div>
                <div className="w-16 h-px bg-gradient-to-r from-white/10 via-[#06B6D4]/50 to-white/10" />
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform delay-75"><CheckCircle2 className="text-[#8B5CF6]" size={20} /></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="participants" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Builder Centric</h2>
            <p className="text-white/50 text-lg max-w-xl">Everything you need to form teams, build projects, and sync your portfolio globally.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10">
                <Rocket className="text-[#8B5CF6] mb-4" size={28} />
                <h3 className="text-2xl font-bold text-white mb-2">Global Team Matching</h3>
                <p className="text-white/50 text-sm">Find the perfect teammates instantly based on complementary skills.</p>
              </div>
            </motion.div>

            <motion.div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02, y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
              className="md:col-span-2 group relative rounded-[24px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-shadow duration-500 p-8 flex flex-col justify-between cursor-default"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-br from-[#8B5CF6]/30 to-transparent z-20" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                <div>
                  <Terminal className="text-[#06B6D4] mb-4" size={28} />
                  <h3 className="text-2xl font-bold text-white mb-2">Portfolio Sync</h3>
                  <p className="text-white/50 text-sm max-w-sm">Automatically sync hackathon wins to GitHub, LinkedIn, and Devixa Profiles.</p>
                </div>
                <div className="relative w-48 h-32 rounded-xl bg-[#09090B] border border-white/10 p-4 shadow-inner overflow-hidden flex flex-col gap-2">
                  <div className="w-full h-3 bg-white/5 rounded-full" />
                  <div className="w-3/4 h-3 bg-white/5 rounded-full" />
                  <div className="w-5/6 h-3 bg-white/5 rounded-full" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#09090B] to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] text-[#06B6D4] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} /> Synced
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
