
import { useState } from 'react';
import { Code, Database, Globe, Cog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');

  const skillCategories = {
    frontend: {
      icon: <Globe className="text-primary" size={24} />,
      title: "Frontend Development",
      skills: [
        "React.js",
        "JavaScript (ES6+)",
        "HTML5 & CSS3",
        "Next.js",
        "Bootstrap",
        "Responsive Design",
        "TailwindCSS"
      ]
    },
    backend: {
      icon: <Database className="text-purple-medium" size={24} />,
      title: "Backend & Databases",
      skills: [
        "Node.js",
        "NestJS",
        "Python",
        "Java",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "RESTful APIs"
      ]
    },
    systems: {
      icon: <Code className="text-accent" size={24} />,
      title: "Systems Programming",
      skills: [
        "C Programming",
        "C++",
        "Data Structures",
        "Algorithms",
        "Operating Systems",
        "Memory Management"
      ]
    },
    tools: {
      icon: <Cog className="text-gray-600" size={24} />,
      title: "Tools & Technologies",
      skills: [
        "Git & GitHub",
        "Linux/Ubuntu",
        "VSCode",
        "MATLAB",
        "SDL2",
        "Docker",
        "Postman"
      ]
    }
  };

  const tabKeys = Object.keys(skillCategories);

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl mb-6">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
            Demonstrated expertise across full-stack development, systems programming, and modern technologies. 
            Proficiency validated through hands-on projects and professional experience.
          </p>
        </div>

        {/* Category tabs with animated underline */}
        <div className="relative flex flex-wrap justify-center gap-4 mb-12 animate-slide-up">
          {tabKeys.map((key, idx) => {
            const category = skillCategories[key];
            const isActive = activeCategory === key;
            return (
              <motion.button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none group ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary'
                }`}
                style={{ background: isActive ? 'linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)' : '#f3f4f6' }}
                whileHover={{ scale: 1.08, boxShadow: isActive ? '0 4px 24px #f472b6aa' : '0 2px 8px #a78bfa44' }}
                whileTap={{ scale: 0.97 }}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.title}</span>
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute left-4 right-4 -bottom-1 h-1 rounded-full bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed]"
                    style={{ zIndex: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Skills display with animated content transition */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg hover-lift">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    {skillCategories[activeCategory].icon}
                    <h3 className="font-poppins font-semibold text-2xl text-gray-dark">
                      {skillCategories[activeCategory].title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {skillCategories[activeCategory].skills.map((skill, index) => (
                      <motion.div 
                        key={skill} 
                        className="group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-purple-200">
                          <span className="font-inter font-medium text-gray-800 text-sm group-hover:text-purple-700 transition-colors duration-300">
                            {skill}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
