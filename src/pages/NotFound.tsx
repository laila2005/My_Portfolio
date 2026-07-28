import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found | Laila Mohamed Fikry";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-6 py-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-lg">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-primary mb-6">
          Error 404
        </p>
        <h1 className="font-poppins font-black text-6xl sm:text-7xl mb-6 text-heading tracking-tight">
          Page not <span className="text-gradient">found</span>
        </h1>
        <p className="font-inter text-lg text-body mb-4">
          This page doesn't exist or has moved.
        </p>
        <p className="font-mono text-sm text-subtle mb-10 break-all">{location.pathname}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] shadow-lg hover-glow transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            <Home size={18} />
            Back to portfolio
          </Link>
          <Link
            to="/writing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-heading bg-surface-elevated border border-subtle hover:bg-surface-overlay transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            <BookOpen size={18} />
            Read the writing
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
