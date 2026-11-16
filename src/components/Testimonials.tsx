import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BadgeCheck, ChevronLeft, ChevronRight, Linkedin, Pause, Play, Quote } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { Butterfly } from './ButterflyField';
import InkUnderline from './InkUnderline';
import { type Testimonial } from '@/data/recommendations';
import { useRecommendations } from '@/hooks/useContent';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

const AUTOPLAY_MS = 7000;

const TestimonialCard = ({ item, active }: { item: Testimonial; active: boolean }) => {
  const isArabic = item.quoteLang === 'ar';
  const fromLinkedIn = !item.link && item.note;

  return (
    <figure
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface p-7 shadow-sm transition-all duration-500 sm:p-9 ${
        active ? 'scale-100 border-primary/30 opacity-100 shadow-xl' : 'scale-[0.96] border-subtle opacity-50'
      }`}
    >
      {/* ink-and-night details: an accent edge and a faint butterfly watermark */}
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-pink-400 to-primary/30" aria-hidden="true" />
      <Butterfly
        still
        className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-44 -rotate-12 text-primary opacity-[0.07]"
      />

      <div className="relative mb-5 flex items-start justify-between gap-3">
        <Quote className="text-primary/30" size={38} aria-hidden="true" />
        {fromLinkedIn && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <Linkedin size={12} aria-hidden="true" />
            {item.note?.replace('LinkedIn recommendation, ', 'LinkedIn · ')}
          </span>
        )}
      </div>

      <blockquote
        lang={item.quoteLang}
        dir={isArabic ? 'rtl' : undefined}
        className={`relative whitespace-pre-line text-heading ${
          isArabic
            ? 'text-right text-lg font-medium leading-loose sm:text-xl'
            : 'font-inter text-base leading-relaxed sm:text-lg'
        }`}
      >
        {item.quote}
      </blockquote>

      {item.translation && (
        <div className="relative mt-5 border-t border-subtle pt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Translated from Arabic</p>
          <p className="font-inter text-sm italic leading-relaxed text-body sm:text-base">“{item.translation}”</p>
        </div>
      )}

      <figcaption className="relative mt-auto flex items-center justify-between gap-3 border-t border-subtle pt-6">
        <div className="mt-0 flex min-w-0 items-center gap-3">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-400 font-poppins text-sm font-bold text-white shadow-md"
            aria-hidden="true"
          >
            {initialsOf(item.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate font-poppins font-bold text-heading">{item.name}</div>
            <div className="font-inter text-xs leading-snug text-subtle sm:text-sm">{item.role}</div>
          </div>
        </div>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verified review${item.source ? ` on ${item.source}` : ''}`}
            title={`Verified review${item.source ? ` on ${item.source}` : ''}`}
            tabIndex={active ? 0 : -1}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/15"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            {item.source ?? 'Verified'}
          </a>
        )}
      </figcaption>
    </figure>
  );
};

const Testimonials = () => {
  const testimonials = useRecommendations();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'center', duration: 30 });
  const [selected, setSelected] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on('select', onSelect);
    embla.on('reInit', onSelect);
    return () => {
      embla.off('select', onSelect);
      embla.off('reInit', onSelect);
    };
  }, [embla]);

  // Auto-advance. Depending on `selected` restarts the timer after any manual
  // move, so a visitor who clicks an arrow is never rushed to the next slide.
  const playing = !!embla && !reduced && !hovering && !userPaused && !document.hidden;
  useEffect(() => {
    if (!playing || !embla) return;
    const timer = window.setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [playing, embla, selected]);

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-surface-elevated py-32 transition-colors duration-500"
    >
      <div className="pointer-events-none absolute left-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] filter mix-blend-multiply dark:mix-blend-screen" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
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
          role="group"
          aria-roledescription="carousel"
          aria-label="Recommendations"
          className="mx-auto max-w-6xl"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') embla?.scrollPrev();
            if (event.key === 'ArrowRight') embla?.scrollNext();
          }}
        >
          <div className="overflow-hidden py-4" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {testimonials.map((item, index) => (
                <div
                  key={item.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${testimonials.length}`}
                  aria-hidden={index !== selected}
                  className="min-w-0 flex-[0_0_100%] px-2 sm:px-3 md:flex-[0_0_86%] lg:flex-[0_0_66%]"
                >
                  <TestimonialCard item={item} active={index === selected} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label="Previous recommendation"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-surface text-heading shadow-sm outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Choose a recommendation">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={index === selected}
                  aria-label={`Show recommendation from ${item.name}`}
                  onClick={() => embla?.scrollTo(index)}
                  className="group flex h-6 min-w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all duration-300 ${
                      index === selected ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25 group-hover:bg-primary/50'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label="Next recommendation"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-surface text-heading shadow-sm outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronRight size={20} />
            </button>

            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused(value => !value)}
                aria-label={userPaused ? 'Resume automatic slideshow' : 'Pause automatic slideshow'}
                aria-pressed={userPaused}
                className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-surface text-subtle outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {userPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
