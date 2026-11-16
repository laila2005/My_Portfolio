import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Butterfly } from './ButterflyField';

const KEY = 'intro-seen';

/**
 * A one-second opening: the butterfly draws itself in ink, then the page
 * appears. Shown once per browser session and never for visitors who ask for
 * reduced motion, so a returning recruiter goes straight to the content.
 */
const Intro = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
    } catch {
      seen = false;
    }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || still) return;
    setShow(true);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: the intro may show again, which is harmless */
    }
    const timer = window.setTimeout(() => setShow(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="paper night-sky fixed inset-0 z-[200] flex items-center justify-center"
          aria-hidden="true"
        >
          <Butterfly className="butterfly-draw h-24 w-28 text-primary" still />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
