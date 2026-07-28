import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, PenLine } from 'lucide-react';
import { posts } from '@/data/posts';

/** Blog index. Route: /writing — reads everything from src/data/posts.ts */

const PAGE_TITLE = 'Writing | Laila Mohamed Fikry';
const PAGE_DESCRIPTION =
  'Engineering notes by Laila Mohamed Fikry on real-time architecture, WebSockets and WebRTC, computer vision evaluation, and the trade-offs behind systems she has built.';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const Writing = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name=description]');
    const previousDescription = meta?.getAttribute('content') ?? null;

    document.title = PAGE_TITLE;
    meta?.setAttribute('content', PAGE_DESCRIPTION);
    window.scrollTo(0, 0);

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, []);

  // Newest first, without mutating the exported array.
  const ordered = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

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
          <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-subtle sm:block">
            Writing
          </span>
        </div>
      </div>

      {/* Decorative background. Clipped by a fixed wrapper so the negative
          offsets can never produce horizontal page overflow on mobile. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-20%] top-24 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute right-[-20%] top-[55%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <PenLine size={12} />
            Writing
          </span>
          <h1 className="mb-5 font-poppins text-3xl font-black leading-[1.1] tracking-tight text-heading sm:text-4xl lg:text-5xl">
            Engineering{' '}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              notes
            </span>
          </h1>
          <p className="font-inter text-lg leading-relaxed text-body">
            Notes on systems I&rsquo;ve built — architecture decisions, the trade-offs behind them,
            and the parts that did not work. Written to be useful rather than impressive, which
            occasionally means saying a number I published needs checking.
          </p>
        </motion.header>

        {ordered.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-dashed border-subtle bg-surface-elevated p-8 text-center sm:p-12"
          >
            <PenLine size={28} className="mx-auto mb-4 text-primary/60" />
            <h2 className="mb-2 font-poppins text-xl font-bold text-heading">Nothing published yet</h2>
            <p className="mx-auto mb-7 max-w-md font-inter text-sm leading-relaxed text-body">
              The first pieces are being written. In the meantime, the LM-MS case study covers the
              architecture I spend most of my time in.
            </p>
            <Link
              to="/case-study/lm-ms"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 font-inter text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              Read the LM-MS case study
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {ordered.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <Link
                  to={`/writing/${post.slug}`}
                  className="group block rounded-3xl border border-subtle bg-surface-elevated p-6 shadow-sm ring-1 ring-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-xs font-semibold text-subtle">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true" className="text-subtle/50">
                      &bull;
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readingTime}
                    </span>
                  </div>

                  <h2 className="mb-3 font-poppins text-xl font-black leading-snug tracking-tight text-heading transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    {post.title}
                  </h2>

                  <p className="mb-6 font-inter text-[15px] leading-relaxed text-body">
                    {post.excerpt}
                  </p>

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

                  <span className="mt-6 inline-flex items-center gap-1.5 font-inter text-sm font-bold text-primary">
                    Read the post
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Writing;
