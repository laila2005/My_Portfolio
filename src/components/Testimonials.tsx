import { BadgeCheck, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Testimonials = () => {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="py-32 bg-surface-elevated transition-colors duration-500 relative overflow-hidden"
    >
      <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-heading tracking-tight"
          >
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Feedback</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-body max-w-2xl mx-auto"
          >
            What the people I've built for say about working together.
          </motion.p>
        </div>

        <div
          className={`grid gap-6 lg:gap-8 ${
            testimonials.length === 1
              ? 'max-w-3xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col bg-white/60 dark:bg-[#110B1D]/40 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/60 dark:border-purple-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl rounded-[2rem] p-8 sm:p-10"
            >
              <Quote className="text-primary/40 mb-5 shrink-0" size={36} aria-hidden="true" />

              {/* The original language first — dir/lang so Arabic renders RTL and
                  screen readers switch pronunciation. */}
              <blockquote
                lang={item.quoteLang}
                dir={item.quoteLang === 'ar' ? 'rtl' : undefined}
                className={`text-heading leading-loose text-lg sm:text-xl font-medium ${
                  item.quoteLang === 'ar' ? 'text-right' : 'font-inter'
                }`}
              >
                {item.quote}
              </blockquote>

              {item.translation && (
                <div className="mt-6 pt-6 border-t border-subtle">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle mb-3">
                    Translated from Arabic
                  </p>
                  <p className="font-inter text-body leading-relaxed italic">
                    “{item.translation}”
                  </p>
                </div>
              )}

              <figcaption className="mt-auto pt-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-poppins font-bold text-heading">{item.name}</div>
                  <div className="font-inter text-sm text-subtle">{item.role}</div>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/15 transition-colors"
                  >
                    <BadgeCheck size={14} />
                    Verified review{item.source ? ` on ${item.source}` : ''}
                  </a>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
