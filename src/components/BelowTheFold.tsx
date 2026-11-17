import { useEffect } from 'react';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import ButterflyDivider from '@/components/ButterflyDivider';
import Footer from '@/components/Footer';

/**
 * Everything under the first screen, in one lazily loaded chunk. A visitor sees
 * the hero as soon as the small initial bundle runs; the heavier sections
 * (carousel, forms, project grid) download right after instead of delaying it.
 */
export const Sections = () => {
  // A link such as /#projects arrives before these sections exist. Once they
  // have mounted, take the visitor to the one they asked for.
  useEffect(() => {
    const target = window.location.hash;
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      try {
        document.querySelector(target)?.scrollIntoView();
      } catch {
        /* an unusual hash is not worth failing over */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Projects />
      <Testimonials />
      <ButterflyDivider />
      <Experience />
      <ButterflyDivider />
      <About />
      <ButterflyDivider />
      <Skills />
      <Contact />
    </>
  );
};

export const SiteFooter = Footer;
