import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const StaggeredText = ({ text }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-3 md:mr-4"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
};

export default function About() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <div className="relative min-h-screen pt-32 pb-40 overflow-hidden">
      
      <svg className="hidden">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{ filter: 'url(#goo)' }}>
        <motion.div
          animate={{
            x: ["-20%", "20%", "-10%", "-20%"],
            y: ["-20%", "10%", "30%", "-20%"],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{
            x: ["20%", "-10%", "30%", "20%"],
            y: ["30%", "-20%", "10%", "30%"],
            scale: [0.9, 1.1, 1.3, 0.9]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#06B6D4] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{
            x: ["0%", "40%", "-30%", "0%"],
            y: ["0%", "-40%", "30%", "0%"],
            scale: [1, 1.4, 0.8, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8B5CF6]/50 rounded-full mix-blend-screen"
        />
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 max-w-[1200px] mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-5xl mix-blend-plus-lighter text-white">
            <StaggeredText text="Built by developers, for the ecosystem. We grew tired of the friction between writing code and managing logistics." />
          </h1>
        </section>

        <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 max-w-[1200px] mx-auto mt-20">
          <h2 className="text-[10px] text-[#8B5CF6] uppercase tracking-widest font-bold mb-8">The Architecture of Innovation</h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl leading-snug text-white/80">
            <StaggeredText text="Zero-latency evaluations, cryptographic security for intellectual property, and real-time team synchronization." />
          </p>
        </section>

        <section className="py-32 w-full overflow-hidden border-y border-white/[0.05] bg-white/[0.01] backdrop-blur-sm my-20">
          <div className="flex w-[200%] md:w-max">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 mx-8">100K+ Builders</span>
                  <span className="text-2xl text-[#8B5CF6]">●</span>
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-white/40 mx-8">Zero Downtime</span>
                  <span className="text-2xl text-[#8B5CF6]">●</span>
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 mx-8">Borderless Innovation</span>
                  <span className="text-2xl text-[#8B5CF6]">●</span>
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-white/40 mx-8">Algorithmic Team Matching</span>
                  <span className="text-2xl text-[#8B5CF6] mr-8">●</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 max-w-[1200px] mx-auto pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-12">
              You build the future.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">We handle the rest.</span>
            </h2>
            
            <Link 
              to="/login?mode=signup"
              className="group relative px-10 py-5 rounded-full bg-white/[0.05] border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] -z-10" />
              <span className="relative z-10 text-lg font-bold text-white tracking-wide uppercase">Start Organizing</span>
            </Link>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
