import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, FileQuestion } from 'lucide-react';
import { posts, type Block } from '@/data/posts';
import ShareLinks from '@/components/ShareLinks';

/**
 * Single post. Route: /writing/:slug
 *
 * Post bodies are structured blocks, not HTML strings — the renderer below owns
 * all article markup, so nothing in src/data/posts.ts can inject into the page
 * and every post is typographically identical.
 */

const SITE = 'Laila Mohamed Fikry';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Marks an unverified figure the author still owes the reader. Posts write these
 * as `[add: …]` / `[verify: …]`; styling them makes the gap read as deliberate
 * editorial honesty rather than unfinished copy left in by accident.
 */
const PendingFigure = ({ children }: { children: ReactNode }) => (
  <span className="mx-0.5 inline whitespace-normal rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.82em] font-medium text-amber-700 dark:text-amber-300">
    {children}
  </span>
);

/** Turns `backtick spans` into inline code and [add:/verify: …] into pending markers. */
const renderInline = (text: string): ReactNode[] =>
  text.split(/`([^`]+)`/g).flatMap((part, i) => {
    if (i % 2 === 1) {
      return [
        <code
          key={`c-${i}`}
          className="rounded-md border border-subtle bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.86em] text-heading"
        >
          {part}
        </code>,
      ];
    }
    // Split out bracketed pending-figure markers from the surrounding prose.
    return part.split(/(\[(?:add|verify):[^\]]*\])/gi).map((chunk, j) =>
      /^\[(?:add|verify):/i.test(chunk) ? (
        <PendingFigure key={`p-${i}-${j}`}>{chunk}</PendingFigure>
      ) : (
        chunk
      ),
    );
  });

const renderBlock = (block: Block, index: number): ReactNode => {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={key}
          className="mb-4 mt-12 font-poppins text-2xl font-black leading-tight tracking-tight text-heading first:mt-0 sm:text-[28px]"
        >
          {block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={key}
          className="mb-3 mt-9 font-poppins text-lg font-bold leading-snug text-heading sm:text-xl"
        >
          {block.text}
        </h3>
      );

    case 'p':
      return (
        <p key={key} className="mb-6 font-inter text-[17px] leading-[1.75] text-body">
          {renderInline(block.text)}
        </p>
      );

    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-8 rounded-r-2xl border-l-4 border-primary/60 bg-primary/[0.06] py-4 pl-5 pr-4 sm:pl-6"
        >
          <p className="font-inter text-[17px] font-medium italic leading-relaxed text-heading sm:text-lg">
            {renderInline(block.text)}
          </p>
        </blockquote>
      );

    case 'ul':
      return (
        <ul key={key} className="mb-7 space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-5 font-inter text-[17px] leading-[1.7] text-body before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'code':
      return (
        <div
          key={key}
          className="-mx-4 my-8 overflow-hidden border-y border-subtle bg-surface-overlay sm:mx-0 sm:rounded-2xl sm:border"
        >
          <div className="flex items-center justify-between border-b border-subtle px-4 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-subtle">
              {block.lang}
            </span>
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-primary/25" />
              <span className="h-2 w-2 rounded-full bg-primary/25" />
              <span className="h-2 w-2 rounded-full bg-primary/25" />
            </span>
          </div>
          <div className="overflow-x-auto">
            <pre className="p-4 sm:p-5">
              <code className="whitespace-pre font-mono text-[12.5px] leading-[1.65] text-heading sm:text-[13.5px]">
                {block.code}
              </code>
            </pre>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const WritingPost = () => {
  const { slug } = useParams<{ slug: string }>();

  // Newest first, so "newer/older" navigation reads the way a reader expects.
  const ordered = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const index = ordered.findIndex((p) => p.slug === slug);
  const post = index === -1 ? undefined : ordered[index];
  const newer = index > 0 ? ordered[index - 1] : undefined;
  const older = index !== -1 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name=description]');
    const previousDescription = meta?.getAttribute('content') ?? null;

    document.title = post ? `${post.title} | ${SITE}` : `Post not found | ${SITE}`;
    if (post) meta?.setAttribute('content', post.excerpt);
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [post]);

  return (
    <div className="relative min-h-screen bg-surface transition-colors duration-500">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-subtle bg-surface/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-body transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft size={16} />
            Back to portfolio
          </Link>
          <Link
            to="/writing"
            className="text-xs font-bold uppercase tracking-[0.18em] text-subtle transition-colors hover:text-primary"
          >
            All writing
          </Link>
        </div>
      </div>

      {/* Decorative background. Clipped by a fixed wrapper so the negative
          offsets can never produce horizontal page overflow on mobile. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-20%] top-24 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute right-[-20%] top-[60%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {!post ? (
        /* ─── Not found: no redirect, just an honest dead end with a way out ─── */
        <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6">
          <div className="rounded-3xl border border-dashed border-subtle bg-surface-elevated p-8 text-center sm:p-12">
            <FileQuestion size={30} className="mx-auto mb-4 text-primary/60" />
            <h1 className="mb-3 font-poppins text-2xl font-black tracking-tight text-heading sm:text-3xl">
              Post not found
            </h1>
            <p className="mx-auto mb-8 max-w-md font-inter text-[15px] leading-relaxed text-body">
              There is no post at{' '}
              <code className="rounded-md border border-subtle bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.9em] text-heading">
                /writing/{slug}
              </code>
              . It may have been renamed, or the link may be mistyped.
            </p>
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 font-inter text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <ArrowLeft size={15} />
              Back to writing
            </Link>
          </div>
        </main>
      ) : (
        <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
          {/* ─── Article header ─── */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 border-b border-subtle pb-10"
          >
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-xs font-semibold text-subtle">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true" className="text-subtle/50">
                &bull;
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} />
                {post.readingTime}
              </span>
            </div>

            <h1 className="mb-6 font-poppins text-3xl font-black leading-[1.15] tracking-tight text-heading sm:text-4xl lg:text-[44px]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.header>

          {/* ─── Article body ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-none"
          >
            {post.body.map(renderBlock)}
          </motion.div>

          {/* Share sits at the end of the article, where a reader who found it
              useful is most likely to pass it on. */}
          <div className="mt-14">
            <ShareLinks title={post.title} label="Share this post" />
          </div>

          {/* ─── Footer navigation ─── */}
          <footer className="mt-12 border-t border-subtle pt-10">
            {(newer || older) && (
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {newer ? (
                  <Link
                    to={`/writing/${newer.slug}`}
                    className="group rounded-2xl border border-subtle bg-surface-elevated p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
                  >
                    <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
                      <ArrowLeft size={12} />
                      Newer
                    </span>
                    <span className="block font-poppins text-[15px] font-bold leading-snug text-heading transition-colors group-hover:text-primary">
                      {newer.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}

                {older && (
                  <Link
                    to={`/writing/${older.slug}`}
                    className="group rounded-2xl border border-subtle bg-surface-elevated p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-primary/20 sm:text-right"
                  >
                    <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
                      Older
                      <ArrowRight size={12} />
                    </span>
                    <span className="block font-poppins text-[15px] font-bold leading-snug text-heading transition-colors group-hover:text-primary">
                      {older.title}
                    </span>
                  </Link>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/writing"
                className="inline-flex items-center gap-2 font-inter text-sm font-bold text-primary transition-colors hover:text-primary/80"
              >
                <ArrowLeft size={15} />
                Back to writing
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-inter text-sm font-bold text-body transition-colors hover:text-primary"
              >
                Back to portfolio
                <ArrowRight size={15} />
              </Link>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
};

export default WritingPost;
