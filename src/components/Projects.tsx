import { ExternalLink, Github, Video, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ParallaxMedia({ image, video, alt }: { image: string, video?: string, alt: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-100, 100], [-5, 5]);

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
      className="w-full h-56 flex items-center justify-center bg-surface-overlay relative group/media overflow-hidden"
    >
      <motion.div 
        style={{ translateZ: -10 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500"
      />
      
      <motion.img 
        src={image} 
        alt={alt}
        style={{ translateZ: 30 }}
        className="max-w-full max-h-full object-contain p-4 transition-all duration-700 z-20 group-hover/media:scale-105 group-hover/media:opacity-0"
      />

      {video && (
        <motion.div 
          style={{ translateZ: 20 }}
          className="absolute inset-0 w-full h-full z-10 opacity-0 group-hover/media:opacity-100 transition-all duration-500 overflow-hidden"
        >
          <video 
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 group-hover/media:scale-100 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 shadow-lg">
            <Video size={12} className="text-purple-300" /> Auto-playing
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const HEART_KEY_PREFIX = 'project-heart-';

function HeartReaction({ projectTitle }: { projectTitle: string }) {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const key = HEART_KEY_PREFIX + projectTitle;

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      setCount(Number(saved));
      setClicked(true);
    }
  }, [key]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!clicked) {
      const newCount = count + 1;
      setCount(newCount);
      setClicked(true);
      localStorage.setItem(key, String(newCount));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 focus:outline-none ${clicked ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-surface border-subtle text-subtle hover:bg-surface-overlay hover:border-primary/30'}`}
      disabled={clicked}
      aria-label="Like project"
    >
      <motion.span
        animate={clicked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-sm"
      >
        {clicked ? '❤️' : '🤍'}
      </motion.span>
      <span className="text-xs font-semibold">{count > 0 ? count : ''}</span>
    </button>
  );
}

const Projects = () => {
  const projects = [
    {
      title: "Inqaz-app – Egypt Emergency AI Response System",
      description: "Architected an end-to-end emergency response platform using computer vision to detect accidents and disasters from live mobile camera footage. Automatically dispatches emergency services in real time with GPS coordination.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80",
      tech: ["Python", "Computer Vision", "REST API", "Web Frontend", "AI"],
      languages: ["Python"],
      github: "https://github.com/laila2005",
      featured: true
    },
    {
      title: "Crash Detection and Classification Model",
      description: "Trained custom CNN and MobileNetV2 models on 3,000 real-world traffic images. Applied Grad-CAM explainability to generate thermal heatmaps identifying structural damage, deployed on Streamlit.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
      tech: ["Deep Learning", "CNN", "Transfer Learning", "Grad-CAM", "Streamlit"],
      languages: ["Python"],
      github: "https://github.com/laila2005",
      live: "https://github.com/laila2005",
      featured: true
    },

    {
      title: "Real-time Encrypted Messaging",
      description: "A secure, multi-threaded TCP messaging system featuring military-grade AES-256 encryption, an integrated SQLite database architecture, and both CLI and GUI interfaces.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      tech: ["Python", "TCP/IP", "AES-256", "Multi-threading", "SQLite"],
      languages: ["Python"],
      github: "https://github.com/laila2005/messaging-system",
      featured: true
    },
    {
      title: "DishCraft",
      description: "Full-stack culinary platform featuring comprehensive UI/UX design, secure JWT user authentication, and seamless database integration using Node.js.",
      image: "/dishcraft.PNG",
      tech: ["React.js", "Node.js", "MongoDB", "Express", "JWT"],
      languages: ["TypeScript", "Node.js"],
      github: "https://github.com/laila2005/DishCraft/tree/combined-branch",
      featured: true
    },
    {
      title: "3D Raycasting Maze Game",
      description: "Low-level graphics engine built in C using SDL2. Features complex collision detection, player movement physics, enemy AI, and dynamic maze texture rendering.",
      image: "/MazeGame.png", 
      tech: ["C", "SDL2", "Raycasting", "Algorithms", "Memory Management"],
      languages: ["C"],
      github: "https://github.com/walid-mehelba/The_Maze",
      featured: true
    },
    {
      title: "Bagi Job Platform",
      description: "Professional freelance job portal developed entirely from scratch. Engineered a scalable React frontend coupled with robust backend server architecture.",
      image: "/bagijob-logo.png",
      tech: ["React.js", "Redux", "REST API", "PostgreSQL"],
      languages: ["JavaScript"],
      github: "#", 
      live: "https://bagijob.com",
      featured: true
    },
    {
      title: "TechRoad",
      description: "AI-powered career guidance mapping platform. Leading backend development as a Team Leader, architecting the Flask API, load balancing, and MongoDB schemas.",
      image: "/techroad-logo.svg",
      tech: ["Flask", "Python", "MongoDB", "Docker", "System Design"],
      languages: ["Python"],
      github: "https://github.com/laila2005/Tech-Road",
      featured: true,
      status: "In Progress"
    }
  ];

  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const allTechTags = Array.from(new Set(projects.flatMap(p => p.tech)));
  const filteredProjects = filterTag 
    ? projects.filter(p => p.tech.includes(filterTag) && p.featured) 
    : projects.filter(p => p.featured);

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
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
          >
            <button 
              onClick={() => setFilterTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filterTag === null ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-surface-elevated text-body border border-subtle hover:border-primary/30'}`}
            >
              All
            </button>
            {allTechTags.slice(0, 10).map(tag => (
              <button 
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filterTag === tag ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-surface-elevated text-body border border-subtle hover:border-primary/30'}`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured Projects Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid lg:grid-cols-2 gap-10 mb-32">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col bg-surface-elevated border border-subtle hover:border-primary/30 ring-1 ring-transparent hover:ring-primary/20 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden border-b border-subtle flex-shrink-0">
                  <ParallaxMedia image={project.image} video={project.video} alt={project.title} />
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
                    <span className="bg-surface/90 backdrop-blur-md text-heading border border-subtle px-3 py-1 rounded-full text-xs font-bold shadow-sm tracking-wide">
                      Featured
                    </span>
                    {project.status && (
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wide">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col relative">
                  <h4 className="font-poppins font-bold text-2xl mb-3 text-heading group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-body text-sm md:text-base font-inter mb-6 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  
                  <div className="space-y-4 mt-auto">
                    <div>
                      <span className="text-[10px] font-bold text-subtle uppercase tracking-widest mb-2 block">Tech Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((lang, i) => (
                          <span key={i} className="text-xs font-semibold text-body bg-surface-overlay px-2.5 py-1 rounded-md border border-subtle">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* View Details hint */}
                  <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-primary/0 group-hover:text-primary transition-all duration-300">
                    <span>View Details</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="bg-surface-overlay p-4 px-8 border-t border-subtle flex items-center justify-between" onClick={e => e.stopPropagation()}>
                  <HeartReaction projectTitle={project.title} />
                  
                  <div className="flex gap-3">
                    {project.github !== "#" && (
                       <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="text-xs font-bold bg-surface hover:bg-surface-overlay transition-all rounded-xl h-9 px-4 shadow-sm border-subtle text-heading">
                          <Github size={14} className="mr-2" />
                          Code
                        </Button>
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <Button className="text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all rounded-xl h-9 px-4 shadow-md">
                          Live Site
                          <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-subtle"
              >
                <div className="relative h-64 sm:h-80 w-full flex-shrink-0 bg-surface-overlay flex items-center justify-center border-b border-subtle p-4">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-50 p-2 bg-surface/80 backdrop-blur rounded-full text-heading hover:text-primary hover:bg-surface shadow-sm transition-all border border-subtle"
                  >
                    <X size={20} />
                  </button>
                  {selectedProject.video ? (
                    <video src={selectedProject.video} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <img src={selectedProject.image} alt={selectedProject.title} className="max-w-full max-h-full object-contain rounded-xl drop-shadow-lg" />
                  )}
                </div>
                <div className="p-6 sm:p-10 overflow-y-auto flex-1">
                  <h3 className="font-poppins font-black text-3xl mb-4 text-heading">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tech.map((lang, i) => (
                      <span key={i} className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="max-w-none">
                    <p className="text-lg text-body leading-relaxed mb-6 font-inter">{selectedProject.description}</p>
                    <p className="text-base text-subtle leading-relaxed font-inter">
                      This project demonstrates strong engineering capabilities in {selectedProject.languages?.join(", ")}. It highlights an ability to architect scalable solutions, integrate complex logic, and deliver a seamless user experience.
                    </p>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-4 pt-6 border-t border-subtle">
                    {selectedProject.github !== "#" && (
                      <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                        <Button className="font-bold bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white rounded-xl h-12 px-6">
                          <Github size={18} className="mr-2" /> View Source Code
                        </Button>
                      </a>
                    )}
                    {selectedProject.live && selectedProject.live !== "#" && (
                      <a href={selectedProject.live} target="_blank" rel="noopener noreferrer">
                        <Button className="font-bold bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6">
                          Live Demo <ArrowRight size={18} className="ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
