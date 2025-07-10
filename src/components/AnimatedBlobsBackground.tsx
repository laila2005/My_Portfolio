import { motion } from 'framer-motion';

export default function AnimatedBlobsBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="blobGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="blobGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#e5e7eb" /> {/* Gray-100 */}
          </linearGradient>
        </defs>
      </svg>
      {/* First blob */}
      <motion.svg
        style={{ position: 'absolute', top: '8%', left: '8%', width: '28vw', height: '28vw', zIndex: 0 }}
        viewBox="0 0 400 400"
        animate={{ y: [0, 60, 0], x: [0, 40, 0] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <path
          d="M300,200Q300,300,200,300Q100,300,100,200Q100,100,200,100Q300,100,300,200Z"
          fill="url(#blobGradient1)"
          opacity={0.7}
        />
      </motion.svg>
      {/* Second blob */}
      <motion.svg
        style={{ position: 'absolute', bottom: '5%', right: '10%', width: '32vw', height: '32vw', zIndex: 0 }}
        viewBox="0 0 400 400"
        animate={{ y: [0, -70, 0], x: [0, -50, 0] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <path
          d="M300,200Q300,300,200,300Q100,300,100,200Q100,100,200,100Q300,100,300,200Z"
          fill="url(#blobGradient2)"
          opacity={0.6}
        />
      </motion.svg>
    </div>
  );
} 