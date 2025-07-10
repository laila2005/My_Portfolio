
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Scrollspy logic
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

  // For Framer Motion underline
  const getUnderlineProps = () => {
    const idx = navItems.findIndex(item => item.href.replace('#', '') === active);
    const ref = linkRefs.current[idx];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      return {
        left: rect.left + window.scrollX,
        width: rect.width,
        top: rect.bottom + window.scrollY,
      };
    }
    return { left: 0, width: 0, top: 0 };
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 border-b border-purple-200 shadow-xl backdrop-blur-lg' : 'bg-white/80 border-b border-purple-100 shadow-md backdrop-blur'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="font-poppins font-bold text-xl text-purple-900 flex items-center gap-2 drop-shadow-sm">
            <img src="/finaliconand logo.png" alt="Logo" style={{ height: '2.5rem', width: '2.5rem', marginRight: '0.3em', verticalAlign: 'middle', borderRadius: '0.4rem', boxShadow: '0 2px 8px 0 rgba(164,120,250,0.10)' }} />
            Laila Mohamed
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 relative">
            {navItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                ref={el => (linkRefs.current[i] = el)}
                className={`text-purple-900 hover:text-primary transition-colors duration-200 font-medium relative ${active === item.href.replace('#', '') ? 'font-bold' : ''}`}
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200 font-medium ${active === item.href.replace('#', '') ? 'font-bold' : ''}`}
                  onClick={() => { setActive(item.href.replace('#', '')); setIsOpen(false); }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
