import { Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projects, categories, projectInCategory } from '@/data/projects';
import dims from '@/data/image-dimensions.json';

/**
 * Intrinsic dimensions for every locally hosted cover image, keyed by public path.
 * Setting width/height on the <img> reserves the correct box before decode and
 * removes the layout shift the covers used to cause.
 */
const imageDimensions = dims as Record<string, { w: number; h: number } | undefined>;

const isRemoteImage = (src: string) => /^https?:\/\//i.test(src);

function ParallaxMedia({ image, alt, className = "h-56 lg:h-64" }: { image: string, alt: string, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-100, 100], [-5, 5]);

  const size = imageDimensions[image];

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={`w-full flex items-center justify-center bg-surface-overlay relative group/media overflow-hidden ${className}`}
    >
      <motion.div
        style={{ translateZ: -10 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500"
      />

      <motion.img
        src={image}
        alt={alt}
        width={size?.w}
        height={size?.h}
        loading="lazy"
        decoding="async"
        referrerPolicy={isRemoteImage(image) ? 'no-referrer' : undefined}
        style={{ translateZ: 20 }}
        className={`w-full h-full ${image.includes('logo') ? 'object-contain p-8 bg-white/80 dark:bg-white/10 backdrop-blur-md' : 'object-cover'} transition-all duration-700 z-20 group-hover/media:scale-110`}
      />
    </motion.div>
  );
}

const Projects = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const featured = projects.filter(p => p.featured);

  // Counts are derived, not stored, so a group can never advertise more
  // projects than it can actually show.
  const categoryCounts = categories.map(category => ({
    ...category,
    count: featured.filter(project => projectInCategory(project, category)).length,
  }));

  const selected = categories.find(c => c.id === activeCategory);
  const filteredProjects = selected
    ? featured.filter(project => projectInCategory(project, selected))
    : featured;

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);

  // Collapse back to the first page whenever the filter changes, so the
  // "See More Projects" button always reflects the current result set.
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  return (
    <section id="projects" className="py-32 bg-surface transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-heading tracking-tight"
          >
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Portfolio</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-body max-w-2xl mx-auto mb-10"
          >
            A selection of production-grade applications, robust backend architectures, and core system engineering experiments.
          </motion.p>

          {/* Grouped filters. One row of lenses instead of 39 raw tech tags —
              each project's full stack is still listed on its own card. */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            role="group"
            aria-label="Filter projects by area"
            className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl border border-subtle bg-surface-elevated/60 p-1.5 backdrop-blur-sm"
          >
            <button
              onClick={() => setActiveCategory(null)}
              aria-pressed={activeCategory === null}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                activeCategory === null
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-body hover:bg-surface-overlay hover:text-heading'
              }`}
            >
              All
              <span className="ml-1.5 font-mono text-[11px] opacity-60">{featured.length}</span>
            </button>
            {categoryCounts.map(category => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={isActive}
                  disabled={category.count === 0}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'text-body hover:bg-surface-overlay hover:text-heading'
                  }`}
                >
                  {category.label}
                  <span className="ml-1.5 font-mono text-[11px] opacity-60">{category.count}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Featured Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 mb-32">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => {
              const isHero = index === 0;
              const isTall = index === 2;

              const bentoClasses = [
                "md:col-span-2 lg:col-span-6", // 0
                "md:col-span-1 lg:col-span-3", // 1
                "md:col-span-1 lg:col-span-3", // 2
                "md:col-span-2 lg:col-span-4", // 3
                "md:col-span-1 lg:col-span-2", // 4
                "md:col-span-1 lg:col-span-2", // 5
                "md:col-span-2 lg:col-span-4", // 6
              ];
              const spanClass = bentoClasses[index % bentoClasses.length];

              return (
              <motion.div
                layout
                key={project.slug}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className={`group flex flex-col ${isHero ? 'lg:flex-row' : ''} bg-white/60 dark:bg-[#110B1D]/40 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/60 dark:border-purple-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 hover:-translate-y-2 rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${spanClass}`}
                /* Mouse convenience only: a plain div, not a control, so the card
                   is never announced as a button containing other buttons. The
                   keyboard/screen-reader path is the real "Explore Architecture"
                   link below, which goes to the same place. */
                onClick={() => navigate(`/projects/${project.slug}`)}
              >
                <div className={`relative overflow-hidden border-subtle flex-shrink-0 ${isHero ? 'lg:w-[60%] lg:border-r border-b lg:border-b-0' : 'border-b w-full'}`}>
                  <ParallaxMedia
                    image={project.image}
                    alt={project.title}
                    className={isHero ? 'h-64 sm:h-80 lg:h-full min-h-[300px] sm:min-h-[400px]' : isTall ? 'h-72 lg:h-80' : 'h-56 lg:h-64'}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
                    <span className="bg-white/95 dark:bg-[#110B1D]/90 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-purple-500/30 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-md tracking-wider uppercase">
                      Featured
                    </span>
                    {project.status && (
                      <span className="bg-indigo-600/95 backdrop-blur-md text-white border border-indigo-400/30 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-md tracking-wider uppercase">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`p-6 sm:p-8 lg:p-10 flex-1 flex flex-col relative ${isHero ? 'lg:w-[40%] lg:justify-center' : ''}`}>
                  <h4 className={`font-poppins font-black tracking-tight ${isHero ? 'text-3xl sm:text-4xl lg:text-5xl leading-tight' : 'text-2xl'} mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300`}>
                    {project.title}
                  </h4>
                  <p className={`text-gray-600 dark:text-gray-300 font-inter mb-8 leading-relaxed flex-1 ${isHero ? 'text-base sm:text-lg lg:text-xl' : 'text-sm md:text-base'}`}>
                    {project.description}
                  </p>

                  <div className="space-y-4 mt-auto">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((lang, i) => (
                          <span key={i} className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10 dark:border-purple-500/10">
                    {/* The card's real control: a genuine anchor, so Tab reaches
                        it and Enter activates it for free, and it names the
                        project for screen readers. Stays visually subtle until
                        hover or focus. */}
                    <Link
                      to={`/projects/${project.slug}`}
                      aria-label={`Explore the architecture of ${project.title}`}
                      className="flex items-center gap-1.5 text-xs font-bold rounded-lg text-primary/0 group-hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none transition-all duration-300"
                    >
                      <span>Explore Architecture</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>

                    {/* Action Footer (Github inside card) */}
                    <div className="flex items-center gap-3">
                      {project.github && project.github !== "#" && (
                        <Button
                          asChild
                          variant="outline"
                          className="text-xs font-bold bg-surface/50 hover:bg-surface-overlay transition-all rounded-xl h-8 px-3 shadow-sm border-subtle text-heading"
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={event => event.stopPropagation()}
                            aria-label={`View source code for ${project.title} on GitHub`}
                          >
                            <Github size={14} className="mr-1.5" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>

        {filteredProjects.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <Button
              onClick={() => setShowAll(!showAll)}
              className="bg-surface border border-subtle hover:bg-surface-overlay text-heading font-bold rounded-full px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {showAll ? 'View Less' : 'See More Projects'}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
