import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 sm:bottom-12 right-6 sm:right-10 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
          aria-label="Back to Top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Ultra-Clean Premium Footer */}
      <footer className="bg-transparent relative pt-16 pb-8 border-t border-gray-200 dark:border-white/10 overflow-hidden">
        
        {/* Very subtle glow to soften the top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 relative z-20">
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-16">
            
            {/* Brand & Description */}
            <div className="flex flex-col items-center md:items-start max-w-md text-center md:text-left">
              <h3 className="font-poppins font-black text-3xl mb-4 text-gray-900 dark:text-white tracking-tight">
                Laila <span className="text-primary">Mohamed</span>
              </h3>
              <p className="font-inter text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                Software Engineer passionate about creating beautiful, efficient solutions 
                that bridge complex system architecture with stunning user experiences.
              </p>
            </div>

            {/* High-Contrast Social Icons */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <span className="font-poppins font-semibold text-gray-900 dark:text-white text-sm tracking-wide uppercase opacity-80">
                Connect
              </span>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/laila-mohamed23/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3.5 bg-gray-900 dark:bg-white/10 text-white dark:text-white rounded-xl hover:bg-primary dark:hover:bg-primary hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={22} />
                </a>
                <a 
                  href="https://github.com/laila2005" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3.5 bg-gray-900 dark:bg-white/10 text-white dark:text-white rounded-xl hover:bg-primary dark:hover:bg-primary hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
                  aria-label="GitHub"
                >
                  <Github size={22} />
                </a>
                <a 
                  href="mailto:laila.mohamed.fikry@gmail.com"
                  className="p-3.5 bg-gray-900 dark:bg-white/10 text-white dark:text-white rounded-xl hover:bg-primary dark:hover:bg-primary hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
                  aria-label="Email"
                >
                  <Mail size={22} />
                </a>
              </div>
            </div>

          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-white/10 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-inter text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium text-center md:text-left">
              © 2025 Laila Fikry. All rights reserved.
            </p>
            <p className="font-inter text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
              Designed & Built with <span className="text-red-500 animate-pulse">♥</span>
            </p>
          </div>
            
        </div>
      </footer>
    </>
  );
};

export default Footer;
