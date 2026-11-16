import { lazy, Suspense, useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProofStrip from '@/components/ProofStrip';
import Intro from '@/components/Intro';

// Loaded after the first screen is on the page, so the hero never waits on them.
const Sections = lazy(() => import('@/components/BelowTheFold').then(m => ({ default: m.Sections })));
const SiteFooter = lazy(() => import('@/components/BelowTheFold').then(m => ({ default: m.SiteFooter })));
const ButterflySwarm = lazy(() => import('@/components/ButterflySwarm'));
const ScrollButterfly = lazy(() => import('@/components/ScrollButterfly'));

const HOME_TITLE = 'Laila Mohamed Fikry | Software Engineer — Full-Stack & Systems';

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Run `job` once the browser has a quiet moment (or after a short wait). */
const whenIdle = (job: () => void) => {
  const w = window as IdleWindow;
  if (w.requestIdleCallback && w.cancelIdleCallback) {
    const id = w.requestIdleCallback(job, { timeout: 1200 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(job, 250);
  return () => window.clearTimeout(id);
};

const Index = () => {
  const [later, setLater] = useState(false);

  // Sub-pages set their own document title; restore this one on return.
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);

  useEffect(() => whenIdle(() => setLater(true)), []);

  return (
    <div className="min-h-screen">
      {/* Keyboard users can jump past the nav straight to the content. */}
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:rounded-xl focus:bg-primary focus:text-white focus:font-bold focus:shadow-2xl"
      >
        Skip to content
      </a>
      <Intro />
      <Navigation />
      {later && (
        <Suspense fallback={null}>
          <ButterflySwarm />
          <ScrollButterfly />
        </Suspense>
      )}
      <main className="overflow-x-clip">
        <Hero />
        <ProofStrip />
        {later && (
          <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
            <Sections />
          </Suspense>
        )}
      </main>
      {later && (
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
