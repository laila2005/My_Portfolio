import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function useCursorHover() {
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a,button,[role="button"],input,textarea,select')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };
    const onMouseOut = () => setHovered(false);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);
  return hovered;
}

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const hovered = useCursorHover();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      try {
        const isTouchDevice = 'ontouchstart' in window;
        setIsMobile(isTouchDevice);
      } catch (error) {
        setIsMobile(false);
      }
    };
    const timer = setTimeout(checkMobile, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isMobile) {
    return null;
  }

  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input,textarea,select')) {
        cursorRef.current?.classList.add('opacity-0');
      } else {
        cursorRef.current?.classList.remove('opacity-0');
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [isMobile]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999]"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          opacity: hovered ? 0 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[9998] border border-primary/40 backdrop-blur-sm"
        animate={{
          x: pos.x - (hovered ? 24 : 16),
          y: pos.y - (hovered ? 24 : 16),
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          backgroundColor: hovered ? "rgba(167, 139, 250, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
};

export default CustomCursor; 