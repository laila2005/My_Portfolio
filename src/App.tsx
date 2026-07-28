import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from './components/ErrorBoundary';

// Sub-pages sit off the main route — load them on demand.
const CaseStudyLMMS = React.lazy(() => import('./pages/CaseStudyLMMS'));
const Writing = React.lazy(() => import('./pages/Writing'));
const WritingPost = React.lazy(() => import('./pages/WritingPost'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

const App = () => {
  return (
    // reducedMotion="user" makes every framer-motion animation honour the OS
    // setting; the CSS media query alone cannot reach JS-driven animation.
    <MotionConfig reducedMotion="user">
      {/* anchors lets Lenis own #hash navigation (offset clears the fixed nav);
          without it, disabling CSS smooth-scroll made anchor clicks jump hard. */}
      <ReactLenis root options={{ anchors: { offset: -80 } }}>
        <ErrorBoundary>
          <TooltipProvider>
            <BrowserRouter>
              <React.Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/case-study/lm-ms" element={<CaseStudyLMMS />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/writing" element={<Writing />} />
                  <Route path="/writing/:slug" element={<WritingPost />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ErrorBoundary>
      </ReactLenis>
    </MotionConfig>
  );
};

export default App;
