
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
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

        {/* Mobile Navigation Full-Screen Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="md:hidden fixed inset-0 z-40 bg-white/60 dark:bg-[#110B1D]/80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-t border-white/20 dark:border-purple-500/20 pt-20"
            >
              <div className="flex flex-col items-center justify-center h-full pb-20 space-y-6 px-4">
                {navItems.map((item, i) => (
                  <motion.a
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                    key={item.name}
                    href={item.href}
                    className={`block w-full text-center px-4 py-4 rounded-2xl text-heading hover:text-primary transition-all duration-300 font-bold text-3xl sm:text-4xl tracking-wide ${active === item.href.replace('#', '') ? 'text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110' : ''}`}
                    onClick={() => { setActive(item.href.replace('#', '')); setIsOpen(false); }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
