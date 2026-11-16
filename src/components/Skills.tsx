import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Database, Terminal, Cloud, ChevronDown } from 'lucide-react';
import { m as motion } from 'framer-motion';
import InkUnderline from './InkUnderline';
import { useProjects, useRoles } from '@/hooks/useContent';
import type { Project } from '@/data/projects';
import type { Role } from '@/data/experience';

/**
 * Skills, each tied to the work that shows it.
 *
 * A skill counts as proven when a project or a role on this site lists a
 * matching technology (see `match`, compared in lower case). The "used in" links
 * are therefore built from the same data as the project and experience sections,
 * and update when you add or edit those in the admin. A skill that nothing lists
 * yet is shown with a dashed outline and no link, so the page never claims
 * evidence it does not have.
 */
type Skill = { name: string; match: string[] };

type Tone = 'dark' | 'glass' | 'indigo' | 'pink';

const GROUPS: Record<'stack' | 'data' | 'systems' | 'cloud', Skill[]> = {
  stack: [
    { name: 'React / Next.js', match: ['react', 'react.js', 'react 19', 'next.js', 'next.js 16'] },
    { name: 'TypeScript', match: ['typescript'] },
    { name: 'C# / ASP.NET', match: ['c# / .net', 'asp.net'] },
    { name: 'Node.js', match: ['node.js', 'serverless node.js'] },
    { name: 'Flutter / Dart', match: ['flutter', 'dart'] },
    { name: 'WebSockets / WebRTC', match: ['websockets', 'webrtc'] },
    { name: 'REST APIs', match: ['rest api', 'rest apis'] },
    { name: 'IoT Integration', match: ['iot telemetry', 'industrial protocols'] },
    { name: 'Tailwind CSS', match: ['tailwind css'] },
  ],
  data: [
    { name: 'Python', match: ['python'] },
    { name: 'FastAPI', match: ['fastapi'] },
    { name: 'SQL Server', match: ['sql server'] },
    { name: 'MongoDB', match: ['mongodb'] },
    { name: 'Supabase', match: ['supabase'] },
    { name: 'Neo4j', match: ['neo4j / cypher', 'neo4j'] },
    { name: 'PostgreSQL', match: ['postgresql'] },
    { name: 'MySQL', match: ['mysql'] },
  ],
  systems: [
    { name: 'C / C++', match: ['c', 'c++'] },
    { name: 'TensorFlow / Keras', match: ['tensorflow', 'keras'] },
    { name: 'Computer Vision', match: ['computer vision', 'opencv'] },
    { name: 'Deep Learning', match: ['deep learning', 'cnn', 'resnet-34'] },
    { name: 'AI agents & LLMs', match: ['ai agents', 'google gemini ai', 'gemini ai'] },
  ],
  cloud: [
    { name: 'Docker', match: ['docker'] },
    { name: 'Vercel', match: ['vercel'] },
    { name: 'Git / GitHub', match: ['git', 'github'] },
    { name: 'Linux (Ubuntu)', match: ['linux'] },
    { name: 'Bash Scripting', match: ['bash'] },
  ],
};

type Proof = { label: string; to?: string; href?: string };

const proofFor = (skill: Skill, projects: Project[], roles: Role[]): Proof[] => {
  const wanted = new Set(skill.match);
  const has = (names: string[] | undefined) => (names ?? []).some(name => wanted.has(name.toLowerCase()));
  const fromProjects = projects
    .filter(project => has([...(project.tech ?? []), ...(project.languages ?? [])]))
    .map(project => ({ label: project.title.split(' – ')[0], to: `/projects/${project.slug}` }));
  const fromRoles = roles
    .filter(role => has(role.tech))
    .map(role => ({ label: role.company, href: '#experience' }));
  return [...fromProjects, ...fromRoles];
};

const TONES: Record<Tone, { proven: string; open: string; plain: string; panel: string; link: string; count: string }> = {
  dark: {
    proven: 'bg-gray-800 border-gray-600 text-purple-200 hover:border-purple-400',
    open: 'bg-purple-500/25 border-purple-300 text-white',
    plain: 'border-dashed border-gray-600 text-gray-300',
    panel: 'bg-white/5 border-white/15 text-gray-200',
    link: 'text-purple-200 hover:text-white',
    count: 'bg-purple-400/25 text-purple-100',
  },
  glass: {
    proven: 'bg-white/10 border-white/30 text-white hover:bg-white/20',
    open: 'bg-white/30 border-white text-white',
    plain: 'border-dashed border-white/40 text-white',
    panel: 'bg-black/25 border-white/20 text-white',
    link: 'text-white hover:underline',
    count: 'bg-white/25 text-white',
  },
  indigo: {
    proven: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-700 dark:text-indigo-200 hover:border-indigo-500/60',
    open: 'bg-indigo-500/25 border-indigo-500 text-indigo-800 dark:text-white',
    plain: 'border-dashed border-indigo-500/40 text-body',
    panel: 'bg-indigo-500/5 border-indigo-500/20 text-body',
    link: 'text-indigo-700 dark:text-indigo-200 hover:underline',
    count: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-100',
  },
  pink: {
    proven: 'bg-pink-500/10 border-pink-500/25 text-pink-700 dark:text-pink-200 hover:border-pink-500/60',
    open: 'bg-pink-500/25 border-pink-500 text-pink-800 dark:text-white',
    plain: 'border-dashed border-pink-500/40 text-body',
    panel: 'bg-pink-500/5 border-pink-500/20 text-body',
    link: 'text-pink-700 dark:text-pink-200 hover:underline',
    count: 'bg-pink-500/20 text-pink-800 dark:text-pink-100',
  },
};

/** The skill chips for one card, with a "used in" panel for the open one. */
const SkillChips = ({ skills, tone, id }: { skills: Skill[]; tone: Tone; id: string }) => {
  const { projects } = useProjects();
  const roles = useRoles();
  const [open, setOpen] = useState<string | null>(null);
  const style = TONES[tone];
  const openSkill = skills.find(skill => skill.name === open);
  const openProof = openSkill ? proofFor(openSkill, projects, roles) : [];

  return (
    <div className="relative z-10 mt-auto">
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => {
          const proof = proofFor(skill, projects, roles);
          const base = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm';
          if (proof.length === 0) {
            return (
              <span key={skill.name} className={`${base} ${style.plain}`}>
                {skill.name}
              </span>
            );
          }
          const isOpen = open === skill.name;
          return (
            <button
              key={skill.name}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-proof`}
              onClick={() => setOpen(isOpen ? null : skill.name)}
              className={`${base} cursor-pointer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/80 ${isOpen ? style.open : style.proven}`}
            >
              {skill.name}
              <span className={`rounded-full px-1.5 text-[10px] font-bold leading-4 ${style.count}`} aria-label={`used in ${proof.length}`}>
                {proof.length}
              </span>
              <ChevronDown size={12} aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          );
        })}
      </div>

      <div id={`${id}-proof`} role="region" aria-live="polite" className={openSkill ? 'mt-4' : 'hidden'}>
        {openSkill && (
          <div className={`rounded-2xl border p-4 text-sm ${style.panel}`}>
            <p className="mb-2 font-bold">Where I used {openSkill.name}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {openProof.map(item => (
                <li key={item.label + (item.to ?? item.href)}>
                  {item.to ? (
                    <Link to={item.to} className={`font-semibold underline-offset-2 ${style.link}`}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className={`font-semibold underline-offset-2 ${style.link}`}>
                      {item.label} <span className="font-normal opacity-80">(experience)</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  return (
    <section id="skills" className="py-32 bg-surface-elevated transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-heading tracking-tight"
          >
            What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Build</span> With
          </motion.h2>
          <InkUnderline />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg md:text-xl text-body max-w-3xl mx-auto"
          >
            Tap a skill to see the project or role where I used it.
          </motion.p>
          <p className="mt-3 font-inter text-sm text-subtle">
            Solid outline: used in work on this site. Dashed outline: a tool I know, without a project here yet.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 md:auto-rows-[minmax(240px,auto)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main card: full-stack systems */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative group overflow-hidden bg-gray-900 text-white border border-gray-800 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[100px] rounded-full group-hover:bg-purple-500/30 transition-colors duration-700 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                <Layers className="text-purple-300" size={36} />
              </div>
              <h3 className="font-poppins font-bold text-3xl mb-4 leading-tight">
                Full-Stack SaaS<br />Architecture
              </h3>
              <p className="font-inter text-gray-300 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                Expertise in building scalable, multi-tenant Software-as-a-Service solutions. From database schema design and secure authentication to dynamic, highly responsive frontend dashboards.
              </p>
            </div>

            <SkillChips id="skills-stack" skills={GROUPS.stack} tone="dark" />
          </motion.div>

          {/* Card: backend and databases */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1 rounded-[2rem] p-8 shadow-xl relative group overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 mb-6">
              <div>
                <h3 className="font-poppins font-bold text-2xl mb-2">Backend & Databases</h3>
                <p className="font-inter text-indigo-50 text-sm max-w-xs">
                  Robust data processing, complex queries, and optimized API development.
                </p>
              </div>
              <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 hidden sm:flex">
                <Database className="text-white" size={28} />
              </div>
            </div>

            <SkillChips id="skills-data" skills={GROUPS.data} tone="glass" />
          </motion.div>

          {/* Card: systems and AI */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-8 shadow-lg relative group overflow-hidden bg-surface border border-subtle flex flex-col justify-between"
          >
            <div className="mb-4 inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Terminal size={24} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-heading">Systems & AI</h3>
              <p className="font-inter text-subtle text-xs mb-6">
                Low-level programming, AI models, and computer vision.
              </p>
            </div>
            <SkillChips id="skills-systems" skills={GROUPS.systems} tone="indigo" />
          </motion.div>

          {/* Card: cloud and tooling */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-8 shadow-lg relative group overflow-hidden bg-pink-500/5 border border-pink-500/15 flex flex-col justify-between"
          >
            <div className="mb-4 inline-flex p-3 rounded-xl bg-pink-500/10 text-pink-500">
              <Cloud size={24} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-heading">Cloud & DevOps</h3>
              <p className="font-inter text-subtle text-xs mb-6">
                Deploying and scaling applications with modern infrastructure.
              </p>
            </div>
            <SkillChips id="skills-cloud" skills={GROUPS.cloud} tone="pink" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
