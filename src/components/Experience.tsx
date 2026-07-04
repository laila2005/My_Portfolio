import { Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: "Co-Founder & Lead Software Engineer",
    company: "LM Smart Solutions",
    link: "https://lm-tech-solutions.tech/",
    duration: "Present",
    description: "Working remotely as a Full-Stack Developer on the RMS (LM-Remote Monitoring System). Responsible for architecting and deploying scalable web applications and enterprise-grade software solutions.",
    tech: ["React", "Node.js", "TypeScript", "Full-Stack"],
  },
  {
    role: "Full-Stack Engineer / Freelancer",
    company: "Bagi Job Platform",
    link: null,
    duration: "August 2025 – Oct 2025",
    description: "Professional freelance job portal developed entirely from scratch. Engineered a scalable React frontend coupled with robust backend server architecture. Delivered a seamless user experience for both freelancers and clients.",
    tech: ["React.js", "Redux", "REST API", "PostgreSQL", "Tailwind CSS"],
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-32 bg-surface transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-40 left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-heading tracking-tight"
          >
            Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Experience</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-body max-w-2xl mx-auto"
          >
            My professional journey delivering production-ready platforms for clients and leading engineering initiatives.
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-indigo-500/50 to-transparent -translate-x-1/2"></div>

          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className={`mb-16 relative flex flex-col md:flex-row items-start ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[28px] md:left-1/2 w-10 h-10 bg-white dark:bg-[#110B1D] border-4 border-purple-500 rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Briefcase size={16} className="text-purple-600 dark:text-purple-400" />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <div className="bg-white/60 dark:bg-[#110B1D]/40 backdrop-blur-xl border border-white/60 dark:border-purple-500/20 shadow-xl rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
                    
                    <div className={`flex items-center gap-2 mb-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                      <Calendar size={16} />
                      {exp.duration}
                    </div>

                    <h3 className="font-poppins font-black text-2xl text-gray-900 dark:text-white mb-1">
                      {exp.role}
                    </h3>
                    
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                      {exp.link ? (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-purple-500 transition-colors">
                          {exp.company} ↗
                        </a>
                      ) : (
                        exp.company
                      )}
                    </div>

                    <p className="font-inter text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {exp.description}
                    </p>

                    <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                      {exp.tech.map((tech, i) => (
                        <span key={i} className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
