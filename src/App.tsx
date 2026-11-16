import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, MotionConfig } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import { Analytics } from '@vercel/analytics/react';

// Sub-pages sit off the main route — load them on demand.
const Writing = React.lazy(() => import('./pages/Writing'));
const WritingPost = React.lazy(() => import('./pages/WritingPost'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const Admin = React.lazy(() => import('./pages/Admin'));

// The animation engine's heavier features download right after the first paint.
const loadMotionFeatures = () => import('./lib/motionFeatures').then(module => module.default);

const App = () => {
  return (
    // reducedMotion="user" makes every framer-motion animation honour the OS
    // setting; the CSS media query alone cannot reach JS-driven animation.
    <LazyMotion features={loadMotionFeatures}>
    <MotionConfig reducedMotion="user">
      {/* anchors lets Lenis own #hash navigation (offset clears the fixed nav);
          without it, disabling CSS smooth-scroll made anchor clicks jump hard. */}
      <ReactLenis root options={{ anchors: { offset: -80 } }}>
        <ErrorBoundary>
            <Analytics />
            <BrowserRouter>
              <React.Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/writing" element={<Writing />} />
                  <Route path="/writing/:slug" element={<WritingPost />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
            </BrowserRouter>
        </ErrorBoundary>
      </ReactLenis>
    </MotionConfig>
    </LazyMotion>
  );
};

export default App;
