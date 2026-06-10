
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const sectionIds = navItems.map(item => item.href.replace('#', ''));

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      let found = 'home';
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && window.scrollY + 80 >= section.offsetTop) {
          found = sectionIds[i];
          break;
        }
      }
      setActive(found);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[hsl(270,50%,4%)]/95 border-b border-purple-200/50 dark:border-purple-900/30 shadow-xl backdrop-blur-lg'
        : 'bg-white/80 dark:bg-[hsl(270,50%,4%)]/80 border-b border-purple-100/50 dark:border-purple-900/20 shadow-md backdrop-blur'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-poppins font-bold text-xl text-heading flex items-center gap-2 drop-shadow-sm">
            <img src="/finaliconand logo.png" alt="Logo" style={{ height: '2.5rem', width: '2.5rem', marginRight: '0.3em', verticalAlign: 'middle', borderRadius: '0.4rem', boxShadow: '0 2px 8px 0 rgba(164,120,250,0.10)' }} />
            Laila Mohamed
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 relative items-center">
            {navItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                ref={el => (linkRefs.current[i] = el)}
                className={`text-heading hover:text-primary transition-colors duration-200 font-medium relative ${active === item.href.replace('#', '') ? 'font-bold' : ''}`}
                onClick={() => setActive(item.href.replace('#', ''))}
              >
                {item.name}
                {active === item.href.replace('#', '') && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </a>
            ))}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-overlay text-heading transition-all duration-300 border border-subtle"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-elevated text-heading transition-all duration-300 border border-subtle"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-heading hover:text-primary p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Solid Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden absolute top-full left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0614]/95 backdrop-blur-2xl border-b border-purple-100 dark:border-purple-500/20 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(168,85,247,0.15)] rounded-b-[2.5rem] overflow-hidden"
            >
              <div className="flex flex-col px-4 py-6 pb-8 space-y-2">
                {navItems.map((item, i) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    key={item.name}
                    href={item.href}
                    className={`block w-full px-6 py-4 rounded-2xl border transition-all duration-300 font-bold text-xl tracking-wide flex justify-between items-center ${active === item.href.replace('#', '') ? 'bg-purple-50 dark:bg-purple-500/10 text-primary border-purple-200 dark:border-purple-500/30 shadow-sm' : 'border-transparent text-heading hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    onClick={() => { setActive(item.href.replace('#', '')); setIsOpen(false); }}
                  >
                    {item.name}
                    {active === item.href.replace('#', '') && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    )}
                  </motion.a>
                ))}

                {/* Social Links Footer inside Menu */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-6 px-2 mt-4 flex justify-between items-center border-t border-gray-100 dark:border-white/10"
                >
                  <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Connect</span>
                  <div className="flex gap-4">
                     <a href="https://www.linkedin.com/in/laila-mohamed23/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 dark:bg-white/10 rounded-full text-heading hover:bg-primary hover:text-white transition-colors shadow-sm">
                       <Linkedin size={20} />
                     </a>
                     <a href="https://github.com/laila2005" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 dark:bg-white/10 rounded-full text-heading hover:bg-primary hover:text-white transition-colors shadow-sm">
                       <Github size={20} />
                     </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
