
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import AnimatedBlobsBackground from './AnimatedBlobsBackground';

const roles = [
  'Software Engineer',
  'Creative Developer',
  'AI Curious',
];

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-glass">
      <AnimatedBlobsBackground />
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pastel-purple/30 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-pastel-pink/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pastel-purple/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Animated profile frame placeholder */}
          <div className="mx-auto w-44 h-44 rounded-full bg-glass shadow-glass mb-8 flex items-center justify-center relative">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-pastel-purple to-pastel-pink animate-spin-slow"
              style={{ zIndex: 1 }}
            />
            <img 
              src="/profile.png"
              alt="Laila Mohamed Fikry"
              className="w-40 h-40 rounded-full object-cover scale-110 object-center relative z-10"
            />
          </div>

          <h1 className="font-clash text-5xl sm:text-6xl lg:text-7xl mb-4 text-gray-dark">
            Hi, I'm <span className="text-gradient">Laila</span>
          </h1>
          <span className="block font-outfit text-2xl text-white mb-6 min-h-[2.5rem]">
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

          <motion.p
            className="font-outfit text-lg sm:text-xl text-gray-900 mb-8 max-w-2xl mx-auto leading-relaxed tracking-wide"
            style={{ textShadow: '0 2px 8px rgba(124,58,237,0.15)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Passionate about creating beautiful, efficient solutions that bridge technology and user experience.<br />
            <span className="block mt-2">Currently pursuing <span className="font-bold bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#a78bfa] bg-clip-text text-transparent">Software Engineering</span> with expertise in <span className="font-bold bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">systems programming</span> and <span className="font-bold bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">web development</span>.</span>
          </motion.p>

          <div className="flex flex-col gap-6 justify-center items-center mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-pink-200/40 border-0 relative overflow-hidden group transition-all duration-300"
                style={{ boxShadow: '0 4px 32px 0 rgba(164, 120, 250, 0.25), 0 1.5px 8px 0 rgba(244, 114, 182, 0.18)' }}
              >
                <a href="#projects" className="flex items-center gap-2 text-lg">
                  <span className="relative z-10">View My Work</span>
                  <ArrowDown size={22} className="relative z-10" />
                  {/* Shine effect */}
                  <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm animate-shine" style={{ pointerEvents: 'none' }}></span>
                </a>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 text-purple-700 font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <a href="/Laila_Fikry_CV_final (1).pdf" download className="flex items-center gap-2 text-lg">
                  <span>Download My CV</span>
                  <Download size={22} />
                </a>
              </Button>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/laila-mohamed23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-primary"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://github.com/laila2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-gray-dark"
              >
                <Github size={24} />
              </a>
              <a 
                href="mailto:laila.mohamed.fikry@gmail.com"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-accent"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="animate-bounce"
          >
            <a href="#about">
              <ArrowDown className="mx-auto text-primary" size={32} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
