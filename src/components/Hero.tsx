import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download, Terminal, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import AnimatedBlobsBackground from './AnimatedBlobsBackground';
import MagneticButton from './MagneticButton';

const roles = [
  'Software Engineer',
  'Full Stack Developer',
  'AI & IoT Systems',
];

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSpline, setShowSpline] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkClass = document.documentElement.classList.contains('dark');
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDarkClass || (isSystemDark && !document.documentElement.classList.contains('light')));
    };
    
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    const checkWidth = () => {
      setShowSpline(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  return (
    <section id="home" className="min-h-[100dvh] flex flex-col justify-center relative overflow-hidden bg-gradient-glass dark:bg-none dark:bg-[#030014] pt-20 pb-24 lg:pt-32 lg:pb-12 transition-colors duration-500">
      <AnimatedBlobsBackground />
      
      {/* 3D FULL BLEED BACKGROUND */}
      {showSpline && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 z-0 w-full h-full mix-blend-multiply dark:mix-blend-screen pointer-events-auto overflow-hidden flex items-center justify-center"
          style={{ 
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
          }}
        >
          {/* Added 150px to width/height to guarantee the bottom-right Spline logo is fully pushed outside the hidden overflow bounds on all screen sizes */}
          <iframe 
            src="https://my.spline.design/r4xbot-W4o2DoAzOZpijadxTQZEON0j/?v=11" 
            frameBorder="0"
            loading="lazy"
            className="w-[calc(100%+150px)] h-[calc(100%+150px)] max-w-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            title="Interactive 3D Workspace"
          ></iframe>
        </motion.div>
      )}

      {/* Decorative floating elements */}
      <div className="absolute top-20 right-20 w-24 h-24 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-400/20 dark:bg-pink-500/10 rounded-full animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400/15 dark:bg-purple-500/8 rounded-full animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* GHOST GRID (Pointer events none allows mouse to pass through to 3D canvas) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 min-h-[85vh] flex flex-col-reverse lg:flex-row items-center justify-between gap-0 lg:gap-12 pb-12 pt-24 lg:pt-0 pointer-events-none">
        
        {/* LEFT HUD (Text, CTAs, Socials) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8 justify-center items-center lg:items-start w-full lg:w-[45%] z-20 text-center lg:text-left mt-0"
        >
          {/* Glassmorphism Text Container */}
          <div className="relative w-full flex flex-col items-center lg:items-start p-6 sm:p-8 lg:p-10 pt-24 sm:pt-28 lg:pt-10 rounded-[2rem] bg-white/40 dark:bg-[#110B1D]/60 backdrop-blur-2xl border border-white/50 dark:border-purple-500/30 shadow-2xl pointer-events-auto transition-transform duration-500 hover:scale-[1.02]">
            <h1 className="font-clash text-4xl sm:text-5xl lg:text-6xl mb-4 text-heading font-black tracking-tight leading-[1.1] drop-shadow-sm whitespace-nowrap">
              Laila <span className="text-gradient">Mohamed</span>
            </h1>
            <span className="block font-outfit text-xl sm:text-2xl lg:text-3xl text-primary mb-6 min-h-[2.5rem] sm:min-h-[3rem] font-bold drop-shadow-sm w-full whitespace-nowrap">
              <Typewriter
                words={roles}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>

            <p className="font-outfit text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 max-w-2xl leading-relaxed tracking-wide drop-shadow-sm">
              Building enterprise systems that run at <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600 dark:from-purple-400 dark:to-pink-400">national scale</span>. <br className="hidden sm:block" />
              From <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600 dark:from-purple-400 dark:to-pink-400">IoT backends</span> to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600 dark:from-purple-400 dark:to-pink-400">AI pipelines</span>.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center lg:items-start w-full lg:w-auto pointer-events-auto">
            <MagneticButton className="w-full sm:w-auto flex justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] text-white font-bold px-6 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-xl shadow-purple-500/20 hover-glow border-0 relative overflow-hidden group transition-all duration-300 w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg"
              >
                <a href="#projects" className="flex items-center justify-center gap-2 w-full">
                  <span className="relative z-10 whitespace-nowrap">My Work</span>
                  <ArrowDown size={18} className="relative z-10 shrink-0" />
                  <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm pointer-events-none"></span>
                </a>
              </Button>
            </MagneticButton>
            
            <MagneticButton intensity={0.3} className="w-full sm:w-auto flex justify-center lg:justify-start">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 dark:border-primary/40 text-primary font-bold px-6 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-lg hover-glow transition-all duration-300 bg-surface/50 backdrop-blur-sm hover:bg-primary/5 w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg"
              >
                <a href="/Laila_Fikry_CV.docx" download className="flex items-center justify-center gap-2 w-full">
                  <span>Resume</span>
                  <Download size={18} className="shrink-0" />
                </a>
              </Button>
            </MagneticButton>
          </div>
          
          {/* Socials */}
          <div className="flex gap-4 justify-center lg:justify-start w-full sm:w-auto pointer-events-auto">
            <MagneticButton intensity={0.4}>
              <a 
                href="https://www.linkedin.com/in/laila-mohamed23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover-glow transition-all duration-300 text-primary hover:-translate-y-1 block border border-subtle"
              >
                <Linkedin size={22} />
              </a>
            </MagneticButton>
            <MagneticButton intensity={0.4}>
              <a 
                href="https://github.com/laila2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover-glow transition-all duration-300 text-heading hover:-translate-y-1 block border border-subtle"
              >
                <Github size={22} />
              </a>
            </MagneticButton>
            <MagneticButton intensity={0.4}>
              <a 
                href="mailto:laila.mohamed.fikry@gmail.com"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover-glow transition-all duration-300 text-pink-500 hover:-translate-y-1 block border border-subtle"
              >
                <Mail size={22} />
              </a>
            </MagneticButton>
          </div>
        </motion.div>

        {/* RIGHT HUD (Floating ID Card & Terminal) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-10 sm:gap-12 justify-center items-center lg:items-end w-full lg:w-[45%] z-30 mb-[-70px] sm:mb-[-90px] lg:mb-0 mt-0 pointer-events-none"
        >
          {/* Floating Profile Photo ID Badge */}
          <div className="flex flex-shrink-0 z-40 relative w-[140px] sm:w-[180px] lg:w-[200px] h-[190px] sm:h-[240px] lg:h-[260px] bg-white/60 dark:bg-[#110B1D]/80 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(168,85,247,0.4)] border border-white/80 dark:border-purple-500/50 p-2 pointer-events-auto transition-transform duration-500 hover:scale-105 rotate-0 lg:rotate-3 hover:rotate-0">
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent mix-blend-overlay z-10 pointer-events-none"></div>
              <img src="/profile2.jpg" alt="Laila Mohamed" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Floating Terminal Box */}
          <div className="hidden lg:flex flex-col rounded-xl overflow-hidden border border-white/60 dark:border-purple-500/50 bg-white/50 dark:bg-[#110B1D]/70 backdrop-blur-[24px] shadow-[0_15px_40px_rgb(0,0,0,0.15)] dark:shadow-[0_0_30px_rgba(168,85,247,0.3)] ring-1 ring-white/50 dark:ring-purple-500/30 w-full lg:max-w-md pointer-events-auto cursor-text hover:shadow-[0_15px_40px_rgb(139,92,246,0.3)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-500 rotate-0 lg:-rotate-1 hover:rotate-0">
            <div className="bg-white/60 dark:bg-black/60 px-5 sm:px-6 py-3 sm:py-4 border-b border-white/30 dark:border-purple-500/40 flex items-center gap-2 backdrop-blur-xl">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-3 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-gray-900 dark:text-gray-400 font-medium tracking-tight">
                <Terminal size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>guest@laila-portfolio:~</span>
              </div>
            </div>
            <div className="p-5 sm:p-8 font-mono text-[10px] sm:text-xs md:text-sm text-gray-900 dark:text-purple-100 h-[220px] sm:h-[280px] lg:h-[340px] overflow-hidden flex flex-col leading-relaxed">
              <p className="text-purple-800 dark:text-purple-400 mb-2 sm:mb-3 font-bold">$ ./fetch_stats.sh</p>
              <div className="flex-1 whitespace-pre-wrap font-mono">
                <Typewriter
                  words={[
                    "> Resolving metrics...\n\n[OK] 300+ remote sites monitored\n[OK] Sub-millisecond WebSocket latency\n[OK] 99.9% CV inference accuracy\n\nSystem ready.",
                    "> Loading architecture...\n\n- Next.js / React (Frontend)\n- FastAPI / Node.js (Backend)\n- PostgreSQL / Redis (Data)\n- AI/ML Pipelines (Python)\n\nAll services operational."
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={30}
                  deleteSpeed={20}
                  delaySpeed={3500}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20"
      >
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="text-primary hover:text-purple-600 transition-colors" size={32} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
