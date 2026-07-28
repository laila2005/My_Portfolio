import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dims from '@/data/image-dimensions.json';

const imageDimensions = dims as Record<string, { w: number; h: number } | undefined>;

const isRemote = (src: string) => /^https?:\/\//i.test(src);
/** Logos need a light plate; a dark-on-dark mark vanishes on the dark surface. */
const isLogo = (src: string) => /logo|icon/i.test(src);

export type GalleryShot = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Screenshot gallery for a project page.
 *
 * A vertical stack of phone screenshots meant thousands of pixels of scrolling
 * for one project, so this keeps the whole set inside roughly one viewport:
 * a swipeable stage plus a thumbnail rail. Swipe works natively via Embla's
 * drag, and the arrows, thumbnails, and arrow keys all drive the same instance.
 */
const ProjectGallery = ({ shots, title }: { shots: GalleryShot[]; title: string }) => {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: shots.length > 2,
    align: 'center',
    // One slide per gesture: without this a fast flick can skip several, which
    // makes a numbered walkthrough lose its place.
    skipSnaps: false,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on('select', onSelect);
    embla.on('reInit', onSelect);
    return () => {
      embla.off('select', onSelect);
      embla.off('reInit', onSelect);
    };
  }, [embla, onSelect]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  // A single image needs no carriage at all.
  if (shots.length === 1) {
    const only = shots[0];
    const size = imageDimensions[only.src];
    return (
      <figure
        className={`overflow-hidden rounded-3xl border border-subtle ${
          isLogo(only.src) ? 'bg-white/80 dark:bg-white/[0.06]' : 'bg-surface-overlay'
        }`}
      >
        <img
          src={only.src}
          alt={only.alt}
          width={size?.w}
          height={size?.h}
          decoding="async"
          referrerPolicy={isRemote(only.src) ? 'no-referrer' : undefined}
          className={
            isLogo(only.src)
              ? 'mx-auto h-auto max-h-[360px] w-auto max-w-full object-contain p-8'
              : 'h-auto w-full object-cover'
          }
        />
        {only.caption && (
          <figcaption className="border-t border-subtle px-4 py-3 font-inter text-xs leading-relaxed text-subtle sm:px-5">
            {only.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const active = shots[selected];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      className="overflow-hidden rounded-3xl border border-subtle bg-surface-elevated"
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      }}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ─── Stage ─── */}
        <div className="relative bg-surface-overlay/60 p-5 sm:p-8">
          {/* overflow-hidden here is Embla's viewport; the flex track sits inside. */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {shots.map((shot, index) => {
                const size = imageDimensions[shot.src];
                return (
                  <div
                    key={shot.src}
                    className="min-w-0 flex-[0_0_100%] px-2"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${shots.length}`}
                    aria-hidden={index !== selected}
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      width={size?.w}
                      height={size?.h}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                      referrerPolicy={isRemote(shot.src) ? 'no-referrer' : undefined}
                      className={`mx-auto h-auto max-h-[58vh] w-auto max-w-full rounded-2xl object-contain shadow-lg sm:max-h-[62vh] ${
                        isLogo(shot.src) ? 'bg-white/80 p-6 dark:bg-white/[0.06]' : ''
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrows sit over the stage on desktop, below it on mobile where the
              gesture is the primary control. */}
          <div className="mt-5 flex items-center justify-center gap-3 lg:absolute lg:inset-y-0 lg:left-0 lg:right-0 lg:mt-0 lg:justify-between lg:px-3">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous screenshot"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-surface/90 text-heading shadow-md outline-none backdrop-blur transition-all hover:bg-surface hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronLeft size={20} />
            </button>
            <span
              aria-live="polite"
              className="font-mono text-xs font-bold text-subtle lg:hidden"
            >
              {selected + 1} / {shots.length}
            </span>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next screenshot"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-surface/90 text-heading shadow-md outline-none backdrop-blur transition-all hover:bg-surface hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ─── Info rail ─── */}
        <div className="flex flex-col gap-5 border-t border-subtle p-5 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Step {selected + 1} of {shots.length}
            </span>
            <span className="hidden font-mono text-xs font-bold text-subtle lg:inline">
              {selected + 1} / {shots.length}
            </span>
          </div>

          {/* min-h keeps the rail from resizing as captions of different lengths
              come and go, which would jump the whole layout on every swipe. */}
          <p
            aria-live="polite"
            className="min-h-[5.5rem] font-inter text-sm leading-relaxed text-body"
          >
            {active.caption ?? active.alt}
          </p>

          <div>
            <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
              Jump to
            </span>
            <div className="flex flex-wrap gap-2">
              {shots.map((shot, index) => (
                <button
                  key={shot.src}
                  type="button"
                  onClick={() => embla?.scrollTo(index)}
                  aria-label={`Show screenshot ${index + 1}`}
                  aria-current={index === selected}
                  className={`overflow-hidden rounded-lg border-2 outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    index === selected
                      ? 'border-primary shadow-md shadow-primary/25'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={shot.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    referrerPolicy={isRemote(shot.src) ? 'no-referrer' : undefined}
                    className="h-[68px] w-[34px] bg-surface-overlay object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
