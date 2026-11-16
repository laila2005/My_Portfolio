import { Building2, Trophy, Rocket, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Recognition strip shown straight under the hero. Every entry is stated
 * elsewhere on the site (Experience, the project pages, Certifications), so this
 * is a summary of them, never a new claim.
 */
const items = [
  {
    icon: Building2,
    label: 'Co-Founder',
    detail: 'LM Smart Solutions',
    href: '#experience',
  },
  {
    icon: Trophy,
    label: '3rd Place',
    detail: 'Agents at Work hackathon',
    to: '/projects/talentscout-ai-lili',
  },
  {
    icon: Rocket,
    label: 'NASA Space Apps 2026',
    detail: 'Galactic Problem Solver',
    to: '/projects/flamelens',
  },
  {
    icon: Medal,
    label: 'Best Squad',
    detail: 'Banque Misr program',
    href: '#experience',
  },
];

const cardClass =
  'group flex items-center gap-3 rounded-2xl border border-subtle bg-surface-elevated px-4 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const ProofStrip = () => (
  <section aria-label="Highlights" className="relative z-10 bg-surface py-8">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.ul
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map(({ icon: Icon, label, detail, href, to }) => {
          const body = (
            <>
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-poppins text-sm font-bold leading-tight text-heading">{label}</span>
                <span className="block font-inter text-xs leading-snug text-body">{detail}</span>
              </span>
            </>
          );
          return (
            <li key={label}>
              {to ? (
                <Link to={to} className={cardClass}>
                  {body}
                </Link>
              ) : (
                <a href={href} className={cardClass}>
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </motion.ul>
    </div>
  </section>
);

export default ProofStrip;
