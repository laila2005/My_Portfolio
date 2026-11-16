import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Butterfly } from './ButterflyField';

/**
 * The path as a metamorphosis: egg, caterpillar, chrysalis, butterfly. Every
 * entry restates something already on the site (About story, Experience,
 * credentials, project pages); it adds no new claim.
 */
type Stage = {
  stage: string;
  when: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
  icon: 'egg' | 'caterpillar' | 'chrysalis' | 'butterfly';
};

const stages: Stage[] = [
  {
    icon: 'egg',
    stage: 'The spark',
    when: 'Elementary school',
    title: 'First line of code',
    body: 'Taught myself JavaScript: console.log("Hello, World"), before I had even heard of Scratch. It was not a school subject.',
  },
  {
    icon: 'caterpillar',
    stage: 'Learning by doing',
    when: '2023 – 2025',
    title: 'University and ALX Africa',
    body: 'Started a university degree in AI at the Egyptian Russian University, and completed the ALX Africa Software Engineering program (Oct 2023 – Jul 2025): full-stack, systems programming in C, and DevOps fundamentals.',
    link: { href: 'https://savanna.alxafrica.com/certificates/59enB3JY6M', label: 'View ALX Certificate' },
  },
  {
    icon: 'chrysalis',
    stage: 'Finding my field',
    when: '2025',
    title: 'Software development, for real',
    body: 'Transferred to El Sewedy University of Technology to study software development, and took over and shipped the Bagi Job platform as a freelance full-stack engineer (Aug – Oct 2025).',
  },
  {
    icon: 'butterfly',
    stage: 'Taking flight',
    when: 'Nov 2025 – now',
    title: 'Building, and being recognised',
    body: 'Co-founder of LM Smart Solutions, building LM-MS and LM Reservations. Best Squad at the Banque Misr Data Governance program, Galactic Problem Solver at NASA Space Apps 2026, and 3rd place, solo, at the Agents at Work hackathon. Expected graduation 2027.',
  },
];

const StageIcon = ({ kind }: { kind: Stage['icon'] }) => {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-7 w-7',
    'aria-hidden': true,
  };
  if (kind === 'egg') {
    return (
      <svg {...common}>
        <ellipse cx="24" cy="26" rx="10" ry="13" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 22 C21 19 25 19 28 22" />
      </svg>
    );
  }
  if (kind === 'caterpillar') {
    return (
      <svg {...common}>
        <circle cx="9" cy="32" r="5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="19" cy="28" r="5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="29" cy="28" r="5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="38" cy="22" r="6" fill="currentColor" fillOpacity="0.18" />
        <path d="M36 16 C35 12 33 10 31 9" />
        <path d="M41 16 C42 12 44 10 46 9" />
      </svg>
    );
  }
  if (kind === 'chrysalis') {
    return (
      <svg {...common}>
        <path d="M24 4 L24 12" />
        <path d="M24 12 C14 16 14 34 24 44 C34 34 34 16 24 12 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 24 C22 26 26 26 30 24" />
        <path d="M19 31 C22 33 26 33 29 31" />
      </svg>
    );
  }
  return <Butterfly className="h-8 w-9" still />;
};

const JourneyTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const butterflyTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative ml-2 pb-2">
      {/* the path: a faint dashed line, with ink drawn along it as you scroll */}
      <div className="absolute bottom-0 left-[19px] top-0 w-px border-l-2 border-dashed border-primary/20" aria-hidden="true" />
      <motion.div
        className="absolute left-[19px] top-0 w-0.5 origin-top bg-primary/60"
        style={{ scaleY: scrollYProgress, height: '100%' }}
        aria-hidden="true"
      />
      {/* the butterfly that flies down the path */}
      <motion.div
        className="absolute left-[19px] z-20 -ml-4 h-6 w-8 text-primary"
        style={{ top: butterflyTop }}
        aria-hidden="true"
      >
        <Butterfly className="h-full w-full -translate-y-1/2 drop-shadow-md" />
      </motion.div>

      <ol className="space-y-8">
        {stages.map(item => (
          <motion.li
            key={item.stage}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.55 }}
            className="relative pl-14"
          >
            <span className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-surface text-primary shadow-sm">
              <StageIcon kind={item.icon} />
            </span>

            <div className="group rounded-2xl border border-subtle bg-surface-elevated p-6 ring-1 ring-primary/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:ring-primary/20">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{item.stage}</span>
                <span className="font-mono text-[11px] font-bold text-subtle">{item.when}</span>
              </div>
              <h4 className="mb-2 font-poppins text-lg font-bold text-heading transition-colors group-hover:text-primary">
                {item.title}
              </h4>
              <p className="font-inter text-sm leading-relaxed text-body">{item.body}</p>
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                >
                  <ExternalLink size={14} />
                  {item.link.label}
                </a>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

export default JourneyTimeline;
