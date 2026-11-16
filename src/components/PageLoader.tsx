import { Butterfly } from './ButterflyField';

/** Shown while a lazily loaded page is on its way; fades in only if it is slow. */
const PageLoader = () => (
  <div className="page-loader flex min-h-screen items-center justify-center bg-surface" role="status" aria-label="Loading">
    <Butterfly className="h-14 w-16 text-primary" />
  </div>
);

export default PageLoader;
