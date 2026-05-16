import React from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download, Terminal } from 'lucide-react';
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
  return (
    <section id="home" className="min-h-[100dvh] flex flex-col justify-center relative overflow-hidden bg-gradient-glass dark:bg-none dark:bg-background pt-20 pb-24 lg:pt-32 lg:pb-12 lg:flex-row lg:items-center transition-colors duration-500">
      <AnimatedBlobsBackground />
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-400/20 dark:bg-purple-500/10 rounded-full animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-400/20 dark:bg-pink-500/10 rounded-full animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400/15 dark:bg-purple-500/8 rounded-full animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left w-full lg:w-1/2 flex flex-col justify-center z-20"
        >
          <h1 className="font-clash text-[clamp(2.5rem,8vw,5.5rem)] mb-2 sm:mb-4 text-heading font-black tracking-tight leading-[1.1]">
            Laila <span className="text-gradient">Mohamed</span>
          </h1>
          <span className="block font-outfit text-xl sm:text-2xl text-primary mb-6 sm:mb-8 min-h-[2rem] sm:min-h-[2.5rem] font-bold">
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

          <motion.div
            className="font-outfit text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Engineering seamless digital experiences. <br className="hidden sm:block" />
            Bridging the gap between <span className="font-bold text-gradient">systems engineering</span> and <span className="font-bold text-gradient">creative frontend</span>.
            
            {/* Terminal Window */}
            <div className="mt-10 sm:mt-12 rounded-xl overflow-hidden border border-subtle bg-surface/80 dark:bg-surface-elevated/85 backdrop-blur-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ring-1 ring-white/10 dark:ring-purple-500/15 w-full max-w-md cursor-text hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-shadow duration-500">
              <div className="bg-surface-elevated/80 px-4 py-3 border-b border-subtle flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-2 flex items-center gap-2 text-xs sm:text-sm font-mono text-subtle font-medium">
                  <Terminal size={14} />
                  <span>guest@laila-portfolio:~</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-sm text-heading h-28 sm:h-32 overflow-hidden flex flex-col leading-relaxed">
                <p className="text-primary mb-2">$ ./fetch_stats.sh</p>
                <div className="flex-1 whitespace-pre-wrap">
                  <Typewriter
                    words={[
                      "> Output:\n\n[\"React\", \"ASP.NET\", \"Python\", \"C#\", \"Node.js\", \"TensorFlow\"]\nLoading system architecture...",
                      "> Output:\n\nPassionate about scalable architectures\nBuilding the future of web and AI..."
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={40}
                    deleteSpeed={30}
                    delaySpeed={3000}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 justify-center items-center lg:items-start mb-8 sm:mb-12 w-full mt-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start w-full lg:w-auto px-4 sm:px-0">
              <MagneticButton className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] text-white font-bold px-6 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-xl shadow-purple-500/20 border-0 relative overflow-hidden group transition-all duration-300 w-full h-14 sm:h-16 text-base sm:text-lg"
                >
                  <a href="#projects" className="flex items-center justify-center gap-2 w-full">
                    <span className="relative z-10 whitespace-nowrap">My Work</span>
                    <ArrowDown size={18} className="relative z-10 shrink-0" />
                    <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm pointer-events-none"></span>
                  </a>
                </Button>
              </MagneticButton>
              
              <MagneticButton intensity={0.3} className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/30 dark:border-primary/40 text-primary font-bold px-6 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-surface/50 backdrop-blur-sm hover:bg-primary/5 w-full h-14 sm:h-16 text-base sm:text-lg"
                >
                  <a href="/Laila_Mohamed_Fikry_Software_Engineer.pdf" download="Laila_Mohamed_Fikry_Software_Engineer.pdf" className="flex items-center justify-center gap-2 w-full">
                    <span>Resume</span>
                    <Download size={18} className="shrink-0" />
                  </a>
                </Button>
              </MagneticButton>
            </div>
            
            <div className="flex gap-4 justify-center sm:justify-start w-full sm:w-auto">
              <MagneticButton intensity={0.4}>
                <a 
                  href="https://www.linkedin.com/in/laila-mohamed23/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-primary hover:-translate-y-1 block border border-subtle"
                >
                  <Linkedin size={22} />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.4}>
                <a 
                  href="https://github.com/laila2005" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-heading hover:-translate-y-1 block border border-subtle"
                >
                  <Github size={22} />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.4}>
                <a 
                  href="mailto:laila.mohamed.fikry@gmail.com"
                  className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-pink-500 hover:-translate-y-1 block border border-subtle"
                >
                  <Mail size={22} />
                </a>
              </MagneticButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex w-full lg:w-1/2 h-[320px] sm:h-[450px] lg:h-[600px] relative items-center justify-center group mt-2 lg:mt-0"
        >
          {/* Subtle glowing orb behind the robot to make it pop after multiply blend */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-[100px] pointer-events-none scale-75"></div>
          
          {/* Iframe wrapper applying multiply blend to drop the white/grey background */}
          <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply dark:mix-blend-screen overflow-hidden rounded-[2rem] sm:rounded-[3rem]">
            <iframe 
              src="https://my.spline.design/genkubgreetingrobot-kYNemr9EY0QslwnASSE05sz6/" 
              frameBorder="0" 
              width="100%" 
              height="100%" 
              className="w-[140%] h-[140%] sm:w-[120%] sm:h-[120%] transform sm:scale-110 -translate-y-8 sm:translate-y-0 pointer-events-auto transition-transform duration-700"
              title="Interactive Pink Robot"
            ></iframe>
          </div>

          {/* UI overlay strategically placed to hide the Spline watermark */}
          <div className="absolute bottom-[2px] right-[2px] sm:bottom-2 sm:right-2 z-20 bg-surface/90 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-bold text-heading shadow-xl border border-subtle pointer-events-none uppercase tracking-wider flex items-center justify-center min-w-[130px] min-h-[35px]">
            Interactive 3D Robot
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
