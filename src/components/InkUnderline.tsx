import { motion } from 'framer-motion';

/** A hand-drawn ink stroke that draws itself under a section heading. */
const InkUnderline = ({ className = '' }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 240 14"
    className={`mx-auto -mt-3 mb-8 h-3.5 w-48 text-primary sm:w-60 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <motion.path
      d="M4 8 C30 2 52 12 80 7 C108 2 130 12 158 7 C186 3 210 10 236 5"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.8 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    />
  </motion.svg>
);

export default InkUnderline;
