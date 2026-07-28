import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileQuestion,
  Github,
  Lock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';
import dims from '@/data/image-dimensions.json';

/**
 * One project. Route: /projects/:slug
 *
 * Several of these repositories are private, so this page — not a GitHub link —
 * has to be the evidence. Everything it renders comes from src/data/projects.ts,
 * which carries the honesty contract: no fact appears here that was not already
 * published in this repo.
 *
 * `[[bracketed]]` markers inside section bodies render as a loud dashed-amber
 * <Fill> placeholder, matching src/pages/CaseStudyLMMS.tsx. They mark a real gap
 * (a screenshot, a metric, a date) rather than papering over it with a guess.
 */

const SITE = 'Laila Mohamed Fikry';
const EMAIL = 'laila.mohamed.fikry@gmail.com';

const imageDimensions = dims as Record<string, { w: number; h: number } | undefined>;

const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

/** Logos need letterboxing; screenshots and photographs should fill the frame. */
const isLogoImage = (src: string) => src.includes('logo');

/* ─── Inline placeholder ───────────────────────────────────────────────────
   Deliberately loud. If one of these reaches production it should look like a
   bug, not like copy. */
const Fill = ({ children }: { children: ReactNode }) => (
  <span className="inline whitespace-normal rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-amber-700 dark:text-amber-300">
    [{children}]
  </span>
);

/** Turns `[[gap markers]]` inside a section body into <Fill> spans. */
const renderBody = (text: string): ReactNode[] =>
  text
    .split(/\[\[([^\]]+)\]\]/g)
    .map((part, i) => (i % 2 === 1 ? <Fill key={i}>{part}</Fill> : part));

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name=description]');
    const previousDescription = meta?.getAttribute('content') ?? null;

    document.title = project ? `${project.title} | ${SITE}` : `Project not found | ${SITE}`;
    if (project) meta?.setAttribute('content', project.tagline ?? project.description);
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [project]);

  const hasPublicRepo = Boolean(project?.github && project.github !== '#');
  const isPrivateSource = project?.sourceStatus === 'private' || project?.github === '#';
  const gallery = project?.gallery ?? [];

  // Judged from the first shot's intrinsic dimensions, so a set of phone
  // screenshots lays out differently from a set of wide desktop captures.
  const firstSize = gallery.length > 0 ? imageDimensions[gallery[0].src] : undefined;
  const galleryIsPortrait = !!firstSize && firstSize.h > firstSize.w * 1.3;

  return (
    <div className="relative min-h-screen bg-surface transition-colors duration-500">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-subtle bg-surface/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-body transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-subtle sm:block">
            Project
          </span>
        </div>
      </div>

      {/* Decorative background. Clipped by a fixed wrapper so the negative
          offsets can never produce horizontal page overflow on mobile. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-20%] top-24 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute right-[-20%] top-[60%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {!project ? (
        /* ─── Not found: no redirect, just an honest dead end with a way out ─── */
        <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6">
          <div className="rounded-3xl border border-dashed border-subtle bg-surface-elevated p-8 text-center sm:p-12">
            <FileQuestion size={30} className="mx-auto mb-4 text-primary/60" />
            <h1 className="mb-3 font-poppins text-2xl font-black tracking-tight text-heading sm:text-3xl">
              Project not found
            </h1>
            <p className="mx-auto mb-8 max-w-md font-inter text-[15px] leading-relaxed text-body">
              There is no project at{' '}
              <code className="break-all rounded-md border border-subtle bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.9em] text-heading">
                /projects/{slug}
              </code>
              . It may have been renamed, or the link may be mistyped.
            </p>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 font-inter text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <ArrowLeft size={15} />
              Back to all projects
            </Link>
          </div>
        </main>
      ) : (
        <article className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
          {/* ─── Hero ─── */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Project
              </span>
              {project.status && (
                <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-600/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                  {project.status}
                </span>
              )}
            </div>

            <h1 className="mb-5 font-poppins text-3xl font-black leading-[1.15] tracking-tight text-heading sm:text-4xl lg:text-[44px]">
              {project.title}
            </h1>

            {project.tagline && (
              <p className="mb-7 font-inter text-lg leading-relaxed text-body">{project.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary sm:text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {(project.role || (project.languages && project.languages.length > 0)) && (
              <dl className="mt-7 grid grid-cols-1 gap-4 rounded-2xl border border-subtle bg-surface-elevated p-5 sm:grid-cols-2 sm:gap-6">
                {project.role && (
                  <div>
                    <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
                      Role
                    </dt>
                    <dd className="font-inter text-sm font-semibold text-heading">{project.role}</dd>
                  </div>
                )}
                {project.languages && project.languages.length > 0 && (
                  <div>
                    <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
                      Languages
                    </dt>
                    <dd className="font-inter text-sm font-semibold text-heading">
                      {project.languages.join(' · ')}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </motion.header>

          {/* ─── Links ─── */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-14"
            aria-label="Project links"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* asChild throughout: an <a>/<Link> wrapping a <Button> renders a
                  link containing a button — two tab stops where the inner one
                  does nothing on Enter. */}
              {project.live && project.live !== '#' && (
                <Button
                  asChild
                  className="h-12 w-full rounded-xl font-bold shadow-md shadow-primary/25 sm:w-auto sm:flex-1 sm:min-w-[190px]"
                >
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </Button>
              )}

              {project.apk && (
                <Button
                  asChild
                  className="h-12 w-full rounded-xl bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 sm:w-auto sm:flex-1 sm:min-w-[190px]"
                >
                  <a href={project.apk} download>
                    <Download size={16} className="mr-2" />
                    Download App
                  </a>
                </Button>
              )}

              {hasPublicRepo && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-xl border-subtle bg-surface font-bold text-heading hover:bg-surface-overlay sm:w-auto sm:flex-1 sm:min-w-[190px]"
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github size={16} className="mr-2" />
                    Source
                  </a>
                </Button>
              )}
            </div>

            {isPrivateSource && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-subtle bg-surface-elevated p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2.5 font-inter text-sm leading-relaxed text-body">
                  <Lock size={15} className="mt-0.5 flex-shrink-0 text-subtle" />
                  <span>
                    <strong className="font-bold text-heading">Source is private.</strong>{' '}
                    {project.privateNote ?? project.note ?? 'Details available on request.'}
                  </span>
                </p>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Walkthrough — ${project.title}`)}`}
                  className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 font-inter text-sm font-bold text-primary transition-colors hover:bg-primary/20 sm:self-auto"
                >
                  <Mail size={15} />
                  Request a walkthrough
                </a>
              </div>
            )}
          </motion.section>

          {/* ─── Gallery ─── */}
          {gallery.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="mb-14"
              aria-label="Project gallery"
            >
              {/* Portrait phone screenshots get a third column on large screens —
                  at two columns, a seven-shot set ran to nearly 7,000px of page. */}
              <div
                className={`grid grid-cols-1 gap-4 ${
                  gallery.length > 1 ? 'sm:grid-cols-2' : ''
                } ${gallery.length > 3 && galleryIsPortrait ? 'lg:grid-cols-3' : ''}`}
              >
                {gallery.map((shot, index) => {
                  const size = imageDimensions[shot.src];
                  return (
                    <figure
                      key={shot.src}
                      /* Logos sit on a light plate: a dark-on-dark SVG would be
                         invisible against the dark-mode surface. */
                      className={`overflow-hidden rounded-3xl border border-subtle ${
                        isLogoImage(shot.src) ? 'bg-white/80 dark:bg-white/[0.06]' : 'bg-surface-overlay'
                      }`}
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        width={size?.w}
                        height={size?.h}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy={isRemoteImage(shot.src) ? 'no-referrer' : undefined}
                        className={
                          isLogoImage(shot.src)
                            ? 'mx-auto h-auto max-h-[360px] w-auto max-w-full object-contain p-8'
                            : 'h-auto w-full object-cover'
                        }
                      />
                      {shot.caption && (
                        <figcaption className="border-t border-subtle px-4 py-3 font-inter text-xs leading-relaxed text-subtle sm:px-5">
                          {shot.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>

              {/* Only a cover image so far. A private repo plus no screenshots is
                  exactly the gap this page exists to close, so say so out loud. */}
              {gallery.length < 2 && (
                <p className="mt-4 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 font-inter text-sm leading-relaxed text-body">
                  Only a cover image exists for this project so far:{' '}
                  <Fill>add real screenshots of the running app</Fill>. Drop the files into{' '}
                  <code className="rounded-md border border-subtle bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.85em] text-heading">
                    public/
                  </code>
                  , list them in the project&rsquo;s <code className="rounded-md border border-subtle bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.85em] text-heading">gallery</code>, and this note disappears.
                </p>
              )}
            </motion.section>
          )}

          {/* ─── Overview ─── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="mb-14"
          >
            <h2 className="mb-5 font-poppins text-2xl font-black tracking-tight text-heading sm:text-[28px]">
              Overview
            </h2>
            <p className="font-inter text-[17px] leading-[1.75] text-body">{project.description}</p>
          </motion.section>

          {/* ─── Engineering highlights ─── */}
          {project.highlights && project.highlights.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="mb-14"
            >
              <h2 className="mb-5 font-poppins text-2xl font-black tracking-tight text-heading sm:text-[28px]">
                Engineering highlights
              </h2>
              <ul className="space-y-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 font-inter text-[17px] leading-[1.7] text-body"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* ─── Long-form sections ─── */}
          {project.sections && project.sections.length > 0 && (
            <div className="mb-14 space-y-8">
              {project.sections.map((section, index) => (
                <motion.section
                  key={section.heading}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.05 }}
                  className="rounded-2xl border border-subtle bg-surface-elevated p-5 shadow-sm ring-1 ring-primary/5 sm:p-7"
                >
                  <h2 className="mb-3 font-poppins text-lg font-bold leading-snug text-heading sm:text-xl">
                    {section.heading}
                  </h2>
                  <p className="font-inter text-[15px] leading-relaxed text-body sm:text-base">
                    {renderBody(section.body)}
                  </p>
                </motion.section>
              ))}
            </div>
          )}

          {/* ─── Case study ─── */}
          {project.caseStudy && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <Link
                to={project.caseStudy}
                className="group flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/[0.06] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between sm:p-8"
              >
                <span className="block">
                  <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <BookOpen size={13} />
                    Deep dive
                  </span>
                  <span className="block font-poppins text-lg font-black leading-snug tracking-tight text-heading sm:text-xl">
                    Read the architecture write-up
                  </span>
                  <span className="mt-1 block font-inter text-sm leading-relaxed text-body">
                    The decisions behind {project.title}, with the trade-offs each one carries.
                  </span>
                </span>
                <ArrowRight
                  size={20}
                  className="flex-shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          )}

          {/* ─── CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-subtle bg-surface-elevated p-6 shadow-sm ring-1 ring-primary/5 sm:p-8"
          >
            <h2 className="mb-2 font-poppins text-xl font-black tracking-tight text-heading sm:text-2xl">
              Want to go deeper on this one?
            </h2>
            <p className="mb-6 font-inter text-sm leading-relaxed text-body">
              Happy to walk through the code, the schema, or the parts that did not work.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* asChild on both: a <Link>/<a> wrapping a <Button> renders a link
                  containing a button — two tab stops, the inner one inert. */}
              <Button
                asChild
                className="hover-glow h-12 w-full rounded-xl font-bold shadow-md shadow-primary/20 sm:flex-1"
              >
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(project.title)}`}>
                  <Mail size={16} className="mr-2" />
                  Discuss this project
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-xl border-subtle bg-surface font-bold text-heading hover:bg-surface-overlay sm:flex-1"
              >
                <Link to="/#projects">
                  All projects
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </article>
      )}
    </div>
  );
};

export default ProjectDetail;
