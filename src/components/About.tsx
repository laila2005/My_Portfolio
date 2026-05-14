import { GraduationCap, Award, Users, Shield, ExternalLink, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const About = () => {
  const achievements = [
    {
      icon: <Briefcase className="text-blue-500" size={24} />,
      title: "LM Tech Solutions",
      description: "Lead Software Engineer - Architected RMS 3.0 Enterprise IoT Platform.",
      year: "Nov 2025 - Present"
    },
    {
      icon: <Briefcase className="text-emerald-500" size={24} />,
      title: "Media Gate Company",
      description: "Freelance Full Stack Developer - Engineered Payment and Admin Workflows for bagijob.com.",
      year: "Aug 2025 - Oct 2025"
    },
    {
      icon: <Award className="text-pink-500" size={24} />,
      title: "ALX Africa",
      description: "Software Engineering Intensive Training Program - Completed a 15-month full-stack and systems engineering program.",
      year: "Oct 2023 - July 2025",
      credential: "https://savanna.alxafrica.com/certificates/59enB3JY6M"
    },
    {
      icon: <GraduationCap className="text-purple-500" size={24} />,
      title: "El Sewedy University of Technology",
      description: "Bachelor of Science in Computer Science (Polytechnic of Egypt)",
      year: "Expected Graduation: 2027"
    },
    {
      icon: <Users className="text-indigo-500" size={24} />,
      title: "Computality Community",
      description: "HR Team - Conducted interviews and organized university technology events.",
      year: "2023 - 2024"
    }
  ];

  const certifications = [
    {
      icon: <Shield className="text-emerald-500" size={24} />,
      title: "Green Digital Certificate",
      description: "Certification in sustainable development and green technology principles.",
      year: "2025",
      credential: "https://learning.inco-group.co/pluginfile.php/1/tool_certificate/issues/1760401251/6235986483LF.pdf"
    }
  ];

  return (
    <section id="about" className="py-24 bg-surface transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl mb-6 text-heading"
          >
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Background</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-body max-w-3xl mx-auto leading-relaxed"
          >
            A software engineer specializing in scalable backend architectures, full-stack systems, and robust web applications.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h3 className="font-poppins font-bold text-2xl mb-6 text-heading">
              My Engineering Philosophy
            </h3>
            
            <div className="space-y-5 text-body font-inter">
              <p className="text-lg leading-relaxed font-medium text-heading border-l-4 border-purple-500 pl-4 bg-primary/5 py-2 rounded-r-lg">
                I build and architect scalable SaaS applications from the database up.
              </p>
              
              <p className="text-base leading-relaxed">
                Currently pursuing a Computer Science degree at El Sewedy University of Technology, my foundation is deeply rooted in systems programming, advanced algorithms, and low-level resource management. 
              </p>
              
              <p className="text-base leading-relaxed">
                My technical capabilities were forged in the rigorous ALX Africa Software Engineering Program. There, I mastered the process of bridging complex backend infrastructure with seamless, high-performance UIs. From developing custom C-based 3D engines to deploying cloud-native React and Node.js ecosystems, I focus entirely on shipping production-ready systems.
              </p>

              <p className="text-base leading-relaxed">
                My approach is pragmatic and systematic. I don't just write code—I engineer long-term solutions that solve actual business logic problems, focusing on clean architecture, minimal technical debt, and beautiful user experiences.
              </p>
            </div>

            <div className="mt-10 p-6 bg-surface-elevated border border-subtle ring-1 ring-primary/5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-heading mb-2">Languages</h4>
                <p className="text-body text-sm leading-relaxed">Arabic (Native), English (Fluent), Turkish & Russian (Conversational)</p>
              </div>
              <div className="w-px bg-border hidden sm:block"></div>
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-heading mb-2">Location</h4>
                <p className="text-body text-sm leading-relaxed">Cairo, Egypt &bull; Open to Remote Collaboration</p>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mt-12">
              <h4 className="font-poppins font-bold text-xl mb-6 text-heading tracking-tight">
                Certifications
              </h4>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border border-emerald-500/20 shadow-sm bg-emerald-500/5 hover:border-emerald-500/40 transition-colors rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl">
                        {cert.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-poppins font-bold text-heading text-base">
                            {cert.title}
                          </h5>
                          <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {cert.year}
                          </span>
                        </div>
                        <p className="text-body font-inter text-sm mb-3">
                          {cert.description}
                        </p>
                        {cert.credential && (
                          <a 
                            href={cert.credential} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors w-fit bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                          >
                            <ExternalLink size={14} />
                            Verify Credential
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Education & Experience cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <h3 className="font-poppins font-bold text-2xl mb-6 text-heading">
              Education & Experience
            </h3>
            
            <div className="relative border-l-2 border-primary/20 ml-4 space-y-8 pb-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute -left-[21px] top-1 w-10 h-10 bg-surface border-2 border-primary/20 rounded-full flex items-center justify-center z-10 shadow-sm">
                    <div className="w-6 h-6 flex items-center justify-center">
                       {achievement.icon}
                    </div>
                  </div>
                  
                  <div className="border border-subtle ring-1 ring-primary/10 shadow-sm hover:shadow-lg hover:ring-primary/20 transition-all duration-300 bg-surface-elevated rounded-2xl group p-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-primary mb-2 tracking-wider">
                        {achievement.year}
                      </span>
                      <h4 className="font-poppins font-bold text-heading text-lg mb-2 group-hover:text-primary transition-colors">
                        {achievement.title}
                      </h4>
                      <p className="text-body font-inter text-sm mb-4 leading-relaxed">
                        {achievement.description}
                      </p>
                      
                      {achievement.credential && (
                        <a 
                          href={achievement.credential} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-bold transition-colors w-fit border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
                        >
                          <ExternalLink size={14} />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
