import { GraduationCap, Award, Users, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const About = () => {
  const achievements = [
    {
      icon: <GraduationCap className="text-purple-600" size={24} />,
      title: "El Sewedy University of Technology",
      description: "Bachelor of Computer Science (Polytechnic of Egypt)",
      year: "2025 - 2028"
    },
    {
      icon: <Award className="text-pink-600" size={24} />,
      title: "ALX Africa Graduate",
      description: "Intensive Full-Stack Software Engineering Program",
      year: "2023 - 2025",
      credential: "https://savanna.alxafrica.com/certificates/59enB3JY6M"
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "IEEE Technical Team",
      description: "Active contributor to technical initiatives and core project developments.",
      year: "2024 - Present"
    }
  ];

  const certifications = [
    {
      icon: <Shield className="text-emerald-600" size={24} />,
      title: "Green Digital Certificate",
      description: "Certification in sustainable development and green technology principles.",
      year: "2025",
      credential: "https://learning.inco-group.co/pluginfile.php/1/tool_certificate/issues/1760401251/6235986483LF.pdf"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl mb-6 text-gray-900"
          >
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Background</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
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
            <h3 className="font-poppins font-bold text-2xl mb-6 text-gray-900">
              My Engineering Philosophy
            </h3>
            
            <div className="space-y-5 text-gray-600 font-inter">
              <p className="text-lg leading-relaxed font-medium text-gray-800 border-l-4 border-purple-500 pl-4 bg-purple-50/30 py-2">
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

            <div className="mt-10 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-gray-900 mb-2">Languages</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Arabic (Native), English (Fluent), Turkish & Russian (Conversational)</p>
              </div>
              <div className="w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Cairo, Egypt &bull; Open to Remote Collaboration</p>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mt-12">
              <h4 className="font-poppins font-bold text-xl mb-6 text-gray-900 tracking-tight">
                Certifications
              </h4>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <Card key={index} className="border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/30 hover:border-emerald-300 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-100/50 rounded-xl">
                          {cert.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-poppins font-bold text-gray-900 text-base">
                              {cert.title}
                            </h5>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {cert.year}
                            </span>
                          </div>
                          <p className="text-gray-600 font-inter text-sm mb-3">
                            {cert.description}
                          </p>
                          {cert.credential && (
                            <a 
                              href={cert.credential} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-bold transition-colors w-fit bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm"
                            >
                              <ExternalLink size={14} />
                              Verify Credential
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
            <h3 className="font-poppins font-bold text-2xl mb-6 text-gray-900">
              Education & Experience
            </h3>
            
            <div className="relative border-l-2 border-purple-100 ml-4 space-y-8 pb-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute -left-[21px] top-1 w-10 h-10 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center z-10 shadow-sm">
                    <div className="w-6 h-6 flex items-center justify-center">
                       {achievement.icon}
                    </div>
                  </div>
                  
                  <Card className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-2xl group">
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-purple-600 mb-2 tracking-wider">
                          {achievement.year}
                        </span>
                        <h4 className="font-poppins font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-500 font-inter text-sm mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                        
                        {achievement.credential && (
                          <a 
                            href={achievement.credential} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-bold transition-colors w-fit border border-purple-100 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg"
                          >
                            <ExternalLink size={14} />
                            View Certificate
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
