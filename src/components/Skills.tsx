import { Layers, Database, Terminal, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="skills" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-100/40 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-gray-900 tracking-tight"
          >
            SaaS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Full-Stack</span> Mastery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Specialized in architecting scalable backend systems and delivering end-to-end SaaS platforms.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 md:auto-rows-[minmax(240px,auto)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Main Card: Full-Stack SaaS Systems */}
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
                Full-Stack SaaS<br/>Architecture
              </h3>
              <p className="font-inter text-gray-400 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                Expertise in building scalable, multi-tenant Software-as-a-Service solutions. From database schema design and secure authentication to dynamic, highly responsive frontend dashboards.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
              {['React / Next.js', 'Node.js', 'NestJS', 'RESTful APIs', 'JWT Auth', 'Stripe / Payments', 'Microservices'].map(skill => (
                <span key={skill} className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-purple-200">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card: Backend & Databases */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-1 rounded-[2rem] p-8 shadow-xl relative group overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10 mb-6">
              <div>
                <h3 className="font-poppins font-bold text-2xl mb-2">Backend & Databases</h3>
                <p className="font-inter text-indigo-100 text-sm max-w-xs">
                  Robust data processing, complex queries, and optimized API development.
                </p>
              </div>
              <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 hidden sm:flex">
                <Database className="text-white" size={28} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              {['PostgreSQL', 'MongoDB', 'MySQL', 'Python / Flask', 'Prisma ORM'].map(skill => (
                <span key={skill} className="text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card: Systems & Security */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-8 shadow-lg relative group overflow-hidden bg-gray-50 border border-gray-100 flex flex-col justify-between"
          >
            <div className="mb-4 inline-flex p-3 rounded-xl bg-indigo-100 text-indigo-700">
              <Terminal size={24} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-gray-900">Systems & Logic</h3>
              <p className="font-inter text-gray-500 text-xs mb-6">
                Low-level systems programming and complex algorithmic problem solving.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['C / C++', 'Java', 'OS Concepts', 'Data Structures'].map(skill => (
                <span key={skill} className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card: Cloud & DevOps */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-8 shadow-lg relative group overflow-hidden bg-pink-50/50 border border-pink-100 flex flex-col justify-between"
          >
            <div className="mb-4 inline-flex p-3 rounded-xl bg-pink-100 text-pink-600">
              <Cloud size={24} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-gray-900">Cloud & DevOps</h3>
              <p className="font-inter text-gray-500 text-xs mb-6">
                Deploying and scaling applications with modern infrastructure.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Docker', 'Git / GitHub', 'Linux', 'Vercel / AWS'].map(skill => (
                <span key={skill} className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded bg-white border border-pink-100 text-pink-700 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
