import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';

// Lazy load ChatbotWidget to avoid mobile issues
const ChatbotWidget = React.lazy(() => import('./components/ChatbotWidget'));

const queryClient = new QueryClient();

const App = () => {
  // Only render CustomCursor if not a touch device
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {!isTouch && <CustomCursor />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <React.Suspense fallback={null}>
            <ChatbotWidget />
          </React.Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
