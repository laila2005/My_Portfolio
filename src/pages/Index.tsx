import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const HOME_TITLE = 'Laila Mohamed Fikry | Software Engineer — Full-Stack & Systems';

const Index = () => {
  // Sub-pages set their own document title; restore this one on return.
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);

  return (
    <div className="min-h-screen">
      {/* Keyboard users can jump past the nav straight to the content. */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:rounded-xl focus:bg-primary focus:text-white focus:font-bold focus:shadow-2xl"
      >
        Skip to content
      </a>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
