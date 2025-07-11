import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility to detect if hovering a link or button
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

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null;
  }

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Hide cursor on text input/textarea
  useEffect(() => {
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
  }, []);

  // After rotation, tip is at (8,8) but visually up/right, so offset by 8
  const offset = 8;

  return (
    <AnimatePresence>
      <motion.div
        ref={cursorRef}
        key="cursor"
        initial={false}
        animate={{
          x: pos.x - offset,
          y: pos.y - offset,
          scale: hovered ? 1.18 : 1,
          filter: hovered ? 'drop-shadow(0 0 12px #c4b5fd)' : 'drop-shadow(0 0 8px #a78bfa)',
        }}
        transition={{ type: 'spring', stiffness: 900, damping: 30 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 32,
          height: 32,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'normal',
        }}
      >
        {hovered ? (
          // Glowing purple ring with animated outline
          <motion.svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <defs>
              <radialGradient id="ring" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
              </radialGradient>
              <linearGradient id="outline" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#a78bfa" />
                <stop offset="0.5" stopColor="#c084fc" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <circle
              cx="16"
              cy="16"
              r="10"
              fill="none"
              stroke="url(#outline)"
              strokeWidth="4"
              style={{ filter: 'blur(1.5px)' }}
            />
            <circle
              cx="16"
              cy="16"
              r="8.5"
              fill="url(#ring)"
              stroke="none"
              opacity={0.7}
            />
            <motion.circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke="url(#outline)"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.svg>
        ) : (
          // Purple teardrop pointer, tip at (8,8), rotated 45deg for pointer up/right
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ transform: 'rotate(150deg)' }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="60%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M8 8 Q16 2, 24 8 Q30 16, 16 30 Q2 16, 8 8Z"
              fill="url(#grad)"
              filter="url(#glow)"
              stroke="#a78bfa"
              strokeWidth="2"
              style={{ transition: 'all 0.3s' }}
            />
            <ellipse
              cx="14"
              cy="13"
              rx="2.5"
              ry="1.2"
              fill="#fff"
              opacity="0.18"
            />
          </svg>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomCursor; 