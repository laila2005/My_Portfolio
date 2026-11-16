import { useState } from 'react';
import { BadgeCheck, ChevronDown, Linkedin, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Butterfly } from './ButterflyField';
import InkUnderline from './InkUnderline';

type Testimonial = {
  /** The client's own words, in the language they wrote them. */
  quote: string;
  /** BCP-47 tag for `quote`, e.g. 'ar'. Omit for English. */
  quoteLang?: string;
  /** Faithful translation, shown beneath the original and labelled as such. */
  translation?: string;
  name: string;
  /** Role and company, e.g. "Project owner, Media Gate". */
  role: string;
  /** Public permalink so a reader can verify the review themselves. */
  link?: string;
  /** Where the review lives, e.g. 'Mostaql'. */
  source?: string;
  /** Shown instead of a verify link when the text is a LinkedIn recommendation. */
  note?: string;
};

/**
 * Real client quotes only — never paraphrased, never invented.
 *
 * The section renders nothing while the array is empty, so the live site never
 * shows an empty shell. To add another, get the client's written permission (a
 * LinkedIn recommendation or a platform review both work) and paste their exact
 * words, keeping the original language plus a translation when it isn't English.
 */
const testimonials: Testimonial[] = [
  {
    // Verbatim from a LinkedIn recommendation dated 15 September 2026.
    quote:
      "It was a pleasure mentoring Laila during her Data Governance internship at Banque Misr. She was truly one of the standout interns, demonstrating great commitment, enthusiasm, and eagerness to learn.\n\nHer positive energy, collaborative spirit, and drive to grow make her a valuable addition to any team. I'm confident that Laila is ready for the professional world and will make a strong impact wherever she goes.\n\nWishing her continued success in her career journey!",
    name: 'Alaa Ghaly',
    role: "Assistant Manager, Credit Assessment at Banque Misr. Laila's mentor",
    note: 'LinkedIn recommendation, September 2026',
  },
  {
    // Verbatim from a LinkedIn recommendation dated 14 September 2026.
    quote:
      "Leila stood out as one of the most proactive interns in Banque Misr's Data Governance Internship Program. She was recognized among the program's six exceptional interns and was a member of the winning use case squad. Her initiative, enthusiasm for learning, and collaborative approach made her a valued contributor. I look forward to seeing her continued growth and future achievements.",
    name: 'Amr Elharony',
    role: 'Fintech Delivery Lead. Worked with Laila on the same team',
    note: 'LinkedIn recommendation, September 2026',
  },
  {
    // Verbatim from the client's public Mostaql review of the engagement.
    quote:
      'كلمة حق في المهندسة ليلى، ونعم الاشخاص اللي ممكن نتعامل معهم. كانت المتجاوبة، ولولا ظروف قاهرة واجهتنا لكان التسليم في الموعد المحدد. اتمنى لكي كل الخير والنجاح في مسيرتك، وانصح بشدة بالتعامل معها.',
    quoteLang: 'ar',
    translation:
      'A word of truth about Engineer Laila — she is among the very best people to work with. She was responsive, and were it not for the difficult circumstances we ran into, delivery would have been exactly on schedule. I wish you all the best and every success in your career, and I strongly recommend working with her.',
    name: 'Media G.',
    role: 'Project owner — custom web development engagement',
    link: 'https://mostaql.com/u/Laila_Mf/reviews/9186572',
    source: 'Mostaql',
  },
];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

/** Long quotes start collapsed so three cards stay balanced; the full text is one tap away. */
const CLAMP_AFTER = 330;

const TestimonialCard = ({ item, index }: { item: Testimonial; index: number }) => {
  const [open, setOpen] = useState(false);
  const isArabic = item.quoteLang === 'ar';
  const long = item.quote.length + (item.translation?.length ?? 0) > CLAMP_AFTER;
  const collapsed = long && !open;
  const fromLinkedIn = !item.link && item.note;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-subtle bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8"
    >
      {/* ink-and-night details: an accent edge and a faint butterfly watermark */}
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-pink-400 to-primary/30" aria-hidden="true" />
      <Butterfly
        still
        className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-40 -rotate-12 text-primary opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]"
      />

      <div className="relative mb-5 flex items-start justify-between gap-3">
        <Quote className="text-primary/30" size={34} aria-hidden="true" />
        {fromLinkedIn && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <Linkedin size={12} aria-hidden="true" />
            {item.note?.replace('LinkedIn recommendation, ', 'LinkedIn · ')}
          </span>
        )}
      </div>

      <div className="relative">
        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: collapsed ? '15rem' : '64rem' }}
        >
          <blockquote
            lang={item.quoteLang}
            dir={isArabic ? 'rtl' : undefined}
            className={`whitespace-pre-line text-heading ${
              isArabic
                ? 'text-right text-lg font-medium leading-loose'
                : 'font-inter text-[0.95rem] leading-relaxed sm:text-base'
            }`}
          >
            {item.quote}
          </blockquote>

          {item.translation && (
            <div className="mt-5 border-t border-subtle pt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Translated from Arabic</p>
              <p className="font-inter text-sm italic leading-relaxed text-body">“{item.translation}”</p>
            </div>
          )}
        </div>
        {collapsed && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {long && (
        <button
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          className="relative mt-3 flex w-fit items-center gap-1 rounded-lg text-sm font-bold text-primary outline-none transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {open ? 'Show less' : 'Read more'}
          <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      )}

      <figcaption className="relative mt-auto flex items-center justify-between gap-3 border-t border-subtle pt-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-400 font-poppins text-sm font-bold text-white shadow-md"
            aria-hidden="true"
          >
            {initialsOf(item.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate font-poppins font-bold text-heading">{item.name}</div>
            <div className="font-inter text-xs leading-snug text-subtle">{item.role}</div>
          </div>
        </div>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verified review${item.source ? ` on ${item.source}` : ''}`}
            title={`Verified review${item.source ? ` on ${item.source}` : ''}`}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/15"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            {item.source ?? 'Verified'}
          </a>
        )}
      </figcaption>
    </motion.figure>
  );
};

const Testimonials = () => {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-surface-elevated py-32 transition-colors duration-500"
    >
      <div className="pointer-events-none absolute left-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] filter mix-blend-multiply dark:mix-blend-screen" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 font-poppins text-4xl font-black tracking-tight text-heading sm:text-5xl lg:text-6xl"
          >
            Kind <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Words</span>
          </motion.h2>
          <InkUnderline />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl font-inter text-lg text-body"
          >
            From mentors, teammates and clients I&apos;ve worked with.
          </motion.p>
        </div>

        <div
          className={`grid items-stretch gap-6 lg:gap-8 ${
            testimonials.length === 1 ? 'mx-auto max-w-3xl' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {testimonials.map((item, index) => (
            <TestimonialCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
