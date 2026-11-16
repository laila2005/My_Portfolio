import { motion } from 'framer-motion';

/**
 * Line-art butterfly, drawn with currentColor so it reads as ink on the paper
 * (light) theme and as a pale-violet glow on the night (dark) theme. The wings
 * flap through the `.butterfly-wing` CSS animation; the global reduced-motion
 * rule switches that off.
 */
export const Butterfly = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 80"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* left wings */}
    <g className="butterfly-wing butterfly-wing-left">
      <path d="M50 40 C40 10 5 5 8 30 C10 45 35 48 50 40 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M50 42 C38 50 15 52 20 70 C25 82 42 70 50 46 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M46 38 C36 22 22 18 16 28" />
      <path d="M44 48 C36 55 28 60 26 68" />
    </g>
    {/* right wings */}
    <g className="butterfly-wing butterfly-wing-right">
      <path d="M50 40 C60 10 95 5 92 30 C90 45 65 48 50 40 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M50 42 C62 50 85 52 80 70 C75 82 58 70 50 46 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M54 38 C64 22 78 18 84 28" />
      <path d="M56 48 C64 55 72 60 74 68" />
    </g>
    {/* body and antennae */}
    <path d="M50 30 L50 64" strokeWidth="2" />
    <path d="M50 31 C47 22 42 17 37 15" />
    <path d="M50 31 C53 22 58 17 63 15" />
  </svg>
);

const flights = [
  {
    pos: 'top-[14%] left-[6%]',
    size: 'w-16 sm:w-28',
    rotate: -18,
    path: { x: [0, 60, 20, 0], y: [0, -30, 40, 0] },
    duration: 22,
    tone: 'opacity-70',
  },
  {
    pos: 'top-[58%] right-[4%]',
    size: 'w-14 sm:w-24',
    rotate: 14,
    path: { x: [0, -50, -10, 0], y: [0, 36, -24, 0] },
    duration: 26,
    tone: 'opacity-60',
  },
  {
    pos: 'bottom-[10%] left-[36%]',
    size: 'w-10 sm:w-16',
    rotate: -6,
    path: { x: [0, 40, -30, 0], y: [0, -40, -10, 0] },
    duration: 30,
    tone: 'opacity-50',
  },
];

/** A few butterflies drifting slowly behind the hero content. */
const ButterflyField = () => (
  <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
    {flights.map((f, i) => (
      <motion.div
        key={i}
        className={`absolute ${f.pos} ${f.size} ${f.tone} text-gray-900 dark:text-violet-300`}
        style={{ rotate: f.rotate }}
        animate={f.path}
        transition={{ duration: f.duration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Butterfly className="h-auto w-full" />
      </motion.div>
    ))}
  </div>
);

export default ButterflyField;
