import { motion } from 'framer-motion';

/**
 * The site's mark: a line-art butterfly with veined wings and spots, in the
 * spirit of the ink drawings it is inspired by. Drawn with currentColor so it
 * reads as ink on the paper (light) theme and as a pale-violet glow on the night
 * (dark) theme. Wings flap through the `.butterfly-wing` CSS animation; the
 * global reduced-motion rule switches that off. Pass `still` for a static mark
 * (logo, favicon-style uses).
 */
export const Butterfly = ({ className = '', still = false }: { className?: string; still?: boolean }) => (
  <svg
    viewBox="0 0 100 80"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* left wings */}
    <g className={still ? undefined : 'butterfly-wing butterfly-wing-left'}>
      <path d="M50 40 C40 10 5 4 8 30 C10 46 35 49 50 40 Z" fill="currentColor" fillOpacity="0.07" />
      <path d="M50 42 C38 50 15 52 20 70 C25 83 42 71 50 46 Z" fill="currentColor" fillOpacity="0.07" />
      {/* veins */}
      <path d="M47 39 C36 25 22 17 12 22" strokeWidth="0.9" />
      <path d="M47 41 C34 36 20 36 11 33" strokeWidth="0.9" />
      <path d="M46 44 C38 49 30 55 24 64" strokeWidth="0.9" />
      {/* spots */}
      <ellipse cx="20" cy="27" rx="4.2" ry="2.6" transform="rotate(-25 20 27)" fill="currentColor" fillOpacity="0.5" stroke="none" />
      <ellipse cx="30" cy="36" rx="3.2" ry="2" transform="rotate(-10 30 36)" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="29" cy="62" r="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
    </g>
    {/* right wings */}
    <g className={still ? undefined : 'butterfly-wing butterfly-wing-right'}>
      <path d="M50 40 C60 10 95 4 92 30 C90 46 65 49 50 40 Z" fill="currentColor" fillOpacity="0.07" />
      <path d="M50 42 C62 50 85 52 80 70 C75 83 58 71 50 46 Z" fill="currentColor" fillOpacity="0.07" />
      <path d="M53 39 C64 25 78 17 88 22" strokeWidth="0.9" />
      <path d="M53 41 C66 36 80 36 89 33" strokeWidth="0.9" />
      <path d="M54 44 C62 49 70 55 76 64" strokeWidth="0.9" />
      <ellipse cx="80" cy="27" rx="4.2" ry="2.6" transform="rotate(25 80 27)" fill="currentColor" fillOpacity="0.5" stroke="none" />
      <ellipse cx="70" cy="36" rx="3.2" ry="2" transform="rotate(10 70 36)" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="71" cy="62" r="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
    </g>
    {/* body and antennae */}
    <ellipse cx="50" cy="48" rx="2.2" ry="15" fill="currentColor" fillOpacity="0.25" />
    <circle cx="50" cy="31" r="2.6" fill="currentColor" fillOpacity="0.5" />
    <path d="M49 29 C46 21 41 16 35 13" />
    <path d="M51 29 C54 21 59 16 65 13" />
    <circle cx="35" cy="13" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="65" cy="13" r="1.3" fill="currentColor" stroke="none" />
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
