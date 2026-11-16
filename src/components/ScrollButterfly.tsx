import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Butterfly } from './ButterflyField';

/**
 * A small butterfly that flutters down the right edge as the page scrolls.
 * Desktop only and skipped for visitors who ask for reduced motion, so it never
 * competes with reading on a phone.
 */
const ScrollButterfly = () => {
  const [enabled, setEnabled] = useState(false);
  const { scrollYProgress } = useScroll();
  const top = useTransform(scrollYProgress, [0, 1], ['14vh', '82vh']);
  const x = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -28, 0, -28, 0, -28]);
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [12, -10, 14, -10, 14, -10]);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1280px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setEnabled(wide.matches && !still.matches);
    apply();
    wide.addEventListener('change', apply);
    still.addEventListener('change', apply);
    return () => {
      wide.removeEventListener('change', apply);
      still.removeEventListener('change', apply);
    };
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed right-6 z-40 h-9 w-11 text-primary/60"
      style={{ top, x, rotate }}
      aria-hidden="true"
    >
      <Butterfly className="h-full w-full drop-shadow" />
    </motion.div>
  );
};

export default ScrollButterfly;
