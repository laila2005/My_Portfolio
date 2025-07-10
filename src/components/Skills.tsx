
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
        { name: "React.js", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "HTML5 & CSS3", level: 95 },
        { name: "Bootstrap", level: 80 },
        { name: "Responsive Design", level: 90 }
      ]
    },
    backend: {
      icon: <Database className="text-purple-medium" size={24} />,
      title: "Backend & Databases",
      skills: [
        { name: "Node.js", level: 75 },
        { name: "Python", level: 85 },
        { name: "Java", level: 80 },
        { name: "MySQL", level: 85 },
        { name: "MongoDB", level: 70 }
      ]
    },
    systems: {
      icon: <Code className="text-accent" size={24} />,
      title: "Systems Programming",
      skills: [
        { name: "C Programming", level: 90 },
        { name: "C++", level: 80 },
        { name: "Data Structures", level: 85 },
        { name: "Algorithms", level: 85 },
        { name: "Operating Systems", level: 75 }
      ]
    },
    tools: {
      icon: <Cog className="text-gray-600" size={24} />,
      title: "Tools & Technologies",
      skills: [
        { name: "Git & GitHub", level: 90 },
        { name: "Linux/Ubuntu", level: 80 },
        { name: "VSCode", level: 95 },
        { name: "MATLAB", level: 75 },
        { name: "SDL2", level: 70 }
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
            A comprehensive skill set spanning from low-level systems programming to modern web development.
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

                  <div className="grid gap-6">
                    {skillCategories[activeCategory].skills.map((skill, index) => (
                      <div key={skill.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-inter font-medium text-gray-700">{skill.name}</span>
                          <span className="text-primary font-semibold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 bg-purple-gradient rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
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
