import { ArrowDown, Github, Linkedin, Mail, Download, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { m as motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import ButterflyField, { Butterfly } from './ButterflyField';
import { releaseSwarm } from './ButterflySwarm';
import MagneticButton from './MagneticButton';
import { trackEvent } from '@/lib/track';
import { useCvUrl } from '@/hooks/useCv';

const roles = [
  'Software Engineer',
  'Full Stack Developer',
  'AI & IoT Systems',
];

const Hero = () => {
  const cvUrl = useCvUrl();
  return (
    <section
      id="home"
      className="paper night-sky min-h-[100dvh] flex flex-col justify-center relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-12 transition-colors duration-500"
    >
      <ButterflyField />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 min-h-[85vh] flex flex-col-reverse lg:flex-row items-center justify-between gap-0 lg:gap-12 pb-12 pt-24 lg:pt-0">

        {/* LEFT: name, role, CTAs, socials */}
        <motion.div
          initial={{ x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8 justify-center items-center lg:items-start w-full lg:w-[48%] z-20 text-center lg:text-left mt-0"
        >
          <div className="relative w-full flex flex-col items-center lg:items-start pt-24 sm:pt-28 lg:pt-0">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface/60 px-4 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.18em] text-body backdrop-blur-sm">
              <Butterfly className="h-4 w-5 text-primary" />
              Cairo, Egypt
            </span>

            <h1 className="font-clash text-[2.4rem] min-[400px]:text-5xl sm:text-6xl lg:text-7xl mb-4 text-heading font-black tracking-tight leading-[1.05] whitespace-nowrap">
              Laila <span className="text-primary">Mohamed</span>
            </h1>
            <span className="block font-outfit text-xl sm:text-2xl lg:text-3xl text-heading/80 mb-6 min-h-[2.5rem] sm:min-h-[3rem] font-semibold w-full whitespace-nowrap">
              <Typewriter
                words={roles}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>

            <p className="font-outfit text-base sm:text-lg lg:text-xl text-body max-w-xl leading-relaxed tracking-wide">
              Building enterprise systems that run at <span className="font-bold text-primary">national scale</span>.{' '}
              <br className="hidden sm:block" />
              From <span className="font-bold text-primary">IoT backends</span> to <span className="font-bold text-primary">AI pipelines</span>.
            </p>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center lg:justify-start items-center lg:items-start w-full lg:w-auto">
            {/* asChild makes the anchor the rendered element. Previously a
                <Button> wrapped an <a>, so the focused button had no handler and
                pressing Enter did nothing. */}
            <MagneticButton className="col-span-2 w-full sm:w-auto flex justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 font-bold px-6 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-xl shadow-primary/25 transition-all duration-300 w-full sm:w-auto h-12 sm:h-16 text-base sm:text-lg"
              >
                <a href="#projects" onClick={() => trackEvent('hero_my_work')} className="flex items-center justify-center gap-2 w-full">
                  <span className="whitespace-nowrap">My Work</span>
                  <ArrowDown size={18} className="shrink-0" />
                </a>
              </Button>
            </MagneticButton>

            <MagneticButton intensity={0.3} className="w-full sm:w-auto flex justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-bold px-4 sm:px-8 py-6 sm:py-7 rounded-2xl shadow-lg transition-all duration-300 w-full sm:w-auto h-12 sm:h-16 text-base sm:text-lg"
              >
                <a
                  href={`mailto:laila.mohamed.fikry@gmail.com?subject=${encodeURIComponent("Let's talk")}`}
                  onClick={() => trackEvent('lets_talk_click')}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <Mail size={18} className="shrink-0" />
                  <span className="whitespace-nowrap">Let&apos;s talk</span>
                </a>
              </Button>
            </MagneticButton>

            <MagneticButton intensity={0.3} className="w-full sm:w-auto flex justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-gray-900/20 dark:border-white/25 text-heading font-bold px-4 sm:px-8 py-6 sm:py-7 rounded-2xl transition-all duration-300 bg-transparent hover:bg-primary/5 w-full sm:w-auto h-12 sm:h-16 text-base sm:text-lg"
              >
                {/* PDF opens inline in every browser; the .docx it replaced forced
                    a download recruiters on phones could not preview. */}
                <a
                  href={cvUrl}
                  onClick={() => trackEvent('resume_click')}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <span>Resume</span>
                  <Download size={18} className="shrink-0" />
                </a>
              </Button>
            </MagneticButton>
          </div>

          <p className="flex items-center justify-center gap-2 font-inter text-sm text-body lg:justify-start">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            Currently open to remote work
          </p>

          {/* Socials */}
          <div className="flex gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <MagneticButton intensity={0.4}>
              <a
                href="https://www.linkedin.com/in/laila-mohamed23/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md transition-all duration-300 text-primary hover:-translate-y-1 block border border-subtle"
              >
                <Linkedin size={22} />
              </a>
            </MagneticButton>
            <MagneticButton intensity={0.4}>
              <a
                href="https://github.com/laila2005"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md transition-all duration-300 text-heading hover:-translate-y-1 block border border-subtle"
              >
                <Github size={22} />
              </a>
            </MagneticButton>
            <MagneticButton intensity={0.4}>
              <a
                href="mailto:laila.mohamed.fikry@gmail.com"
                aria-label="Email Laila"
                className="p-3 bg-surface/70 backdrop-blur-md rounded-full shadow-md transition-all duration-300 text-primary hover:-translate-y-1 block border border-subtle"
              >
                <Mail size={22} />
              </a>
            </MagneticButton>
          </div>
        </motion.div>

        {/* RIGHT: portrait and terminal */}
        <motion.div
          initial={{ x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-10 sm:gap-12 justify-center items-center lg:items-end w-full lg:w-[44%] z-30 mb-[-70px] sm:mb-[-90px] lg:mb-0 mt-0"
        >
          {/* Portrait, framed like a print pinned to the page */}
          <div className="relative z-40 flex-shrink-0 w-[140px] sm:w-[180px] lg:w-[200px] h-[190px] sm:h-[240px] lg:h-[260px] rounded-[1.75rem] border border-subtle bg-surface-elevated p-2 shadow-[0_20px_50px_rgba(20,16,40,0.18)] transition-transform duration-500 hover:scale-105 rotate-0 lg:rotate-3 hover:rotate-0">
            <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
              <img
                src="/profile2.webp"
                alt="Laila Mohamed Fikry"
                width={600}
                height={600}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="Release a swarm of butterflies"
              title="Click me"
              onClick={event => {
                const r = event.currentTarget.getBoundingClientRect();
                releaseSwarm(r.left + r.width / 2, r.top + r.height / 2);
                trackEvent('butterfly_swarm');
              }}
              className="absolute -right-6 -top-6 z-10 flex h-12 w-14 rotate-12 items-center justify-center rounded-full text-primary outline-none transition-transform duration-300 hover:scale-125 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Butterfly className="h-10 w-12" />
            </button>
          </div>

          {/* Terminal */}
          <div className="hidden lg:flex flex-col rounded-xl overflow-hidden border border-subtle bg-surface-elevated shadow-[0_15px_40px_rgba(20,16,40,0.16)] w-full lg:max-w-md cursor-text transition-all duration-500 lg:-rotate-1 hover:rotate-0">
            <div className="bg-surface-overlay px-5 sm:px-6 py-3 sm:py-4 border-b border-subtle flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-3 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-body font-medium tracking-tight">
                <Terminal size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>laila.js</span>
              </div>
            </div>
            <div className="p-5 sm:p-8 font-mono text-[10px] sm:text-xs md:text-sm text-heading h-[220px] sm:h-[280px] lg:h-[340px] overflow-hidden flex flex-col leading-relaxed">
              <p className="text-primary mb-2 sm:mb-3 font-bold">$ node laila.js</p>
              <div className="flex-1 whitespace-pre-wrap font-mono">
                <Typewriter
                  words={[
                    // The first line is the story: JavaScript was the first language,
                    // written in elementary school. The metrics below it must stay
                    // defensible: 300+ is the deployed total across client
                    // installations (the LM-MS measurement set is one deployment).
                    '> console.log("Hello, World");\n\nHello, World\n\n// my first line of code,\n// written in elementary school.',
                    '> Resolving metrics...\n\n[OK] 300+ sites across client deployments\n[OK] 45s median fault to SMS dispatch\n[OK] 68% F1 crash detection (unseen data)\n\nSystem ready.',
                    '> Loading architecture...\n\n- Next.js / React (Frontend)\n- FastAPI / Node.js (Backend)\n- PostgreSQL / Redis (Data)\n- AI/ML Pipelines (Python)\n\nAll services operational.',
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={30}
                  deleteSpeed={20}
                  delaySpeed={3500}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20"
      >
        <a href="#projects" aria-label="Scroll to my work">
          <ArrowDown className="text-primary hover:text-primary/70 transition-colors" size={32} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
