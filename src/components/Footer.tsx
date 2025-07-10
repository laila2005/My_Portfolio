
import { Heart, Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
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
          className="fixed bottom-24 right-8 z-50 bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white p-3 rounded-full shadow-xl hover:scale-110 transition-all animate-fade-in"
          aria-label="Back to Top"
        >
          <ArrowUp size={24} />
        </button>
      )}
      <footer className="bg-gradient-to-b from-[#2d225a] via-[#3b2f63] to-[#4b386b] text-white py-14 relative shadow-inner">
        <div className="absolute left-0 right-0 top-0 h-1.5 z-10">
          <div className="w-full h-full bg-gradient-to-r from-[#a78bfa] via-[#fbc2eb] to-[#a1c4fd] blur-[2px] opacity-80 animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center">
            <div className="mb-8">
              <h3 className="font-poppins font-extrabold text-3xl mb-4 bg-gradient-to-r from-[#a78bfa] via-[#fbc2eb] to-[#7c3aed] bg-clip-text text-transparent drop-shadow-lg animate-glow">
                Laila Mohamed Fikry
              </h3>
              <p className="font-inter text-gray-200 max-w-2xl mx-auto">
                Software Engineer passionate about creating beautiful, efficient solutions 
                that bridge technology and user experience.
              </p>
            </div>
            <div className="flex justify-center gap-6 mb-8">
              <a 
                href="https://www.linkedin.com/in/laila-mohamed23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-gradient-to-r hover:from-[#a78bfa] hover:to-[#f472b6] hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/laila2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-gradient-to-r hover:from-[#a78bfa] hover:to-[#f472b6] hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:laila.mohamed.fikry@gmail.com"
                className="p-3 bg-white/10 rounded-full hover:bg-gradient-to-r hover:from-[#a78bfa] hover:to-[#f472b6] hover:text-white hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            <div className="pt-8">
              <p className="font-inter text-gray-400 text-sm flex items-center justify-center gap-1">
                © 2025 <span className="bg-gradient-to-r from-[#a78bfa] via-[#fbc2eb] to-[#7c3aed] bg-clip-text text-transparent font-bold">Laila Fikry</span>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
