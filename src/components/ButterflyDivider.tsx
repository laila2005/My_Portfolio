import { m as motion } from 'framer-motion';
import { Butterfly } from './ButterflyField';

/** A thin ink line with a butterfly at its centre, used between sections. */
const ButterflyDivider = () => (
  <div className="relative bg-surface" aria-hidden="true">
    <div className="mx-auto flex max-w-5xl items-center gap-5 px-6 py-2">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/40" />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 0.6 }}
        className="text-primary"
      >
        <Butterfly className="h-8 w-10" />
      </motion.div>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/40" />
    </div>
  </div>
);

export default ButterflyDivider;
