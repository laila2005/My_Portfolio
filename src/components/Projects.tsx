import { ExternalLink, Github, Video, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ParallaxMedia({ image, video, alt, className = "h-56 lg:h-64" }: { image: string, video?: string, alt: string, className?: string }) {
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
      className={`w-full flex items-center justify-center bg-surface-overlay relative group/media overflow-hidden ${className}`}
    >
      <motion.div 
        style={{ translateZ: -10 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500"
      />
      
      <motion.img 
        src={image} 
        alt={alt}
        style={{ translateZ: 20 }}
        className={`w-full h-full object-cover transition-all duration-700 z-20 group-hover/media:scale-110 ${video ? 'group-hover/media:opacity-0' : ''}`}
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
      image: "/inqaz-cover.png",
      tech: ["Python", "Computer Vision", "REST API", "Web Frontend", "AI"],
      languages: ["Python"],
      github: "https://github.com/laila2005",
      featured: true
    },
    {
      title: "Crash Detection and Classification Model",
      description: "Trained custom CNN and MobileNetV2 models on 3,000 real-world traffic images. Applied Grad-CAM explainability to generate thermal heatmaps identifying structural damage, deployed on Streamlit.",
      image: "/crash-detection-cover-v2.png",
      tech: ["Deep Learning", "CNN", "Transfer Learning", "Grad-CAM", "Streamlit"],
      languages: ["Python"],
      github: "https://github.com/laila2005",
      live: "https://github.com/laila2005",
      featured: true
    },

    {
      title: "Zagel – Enterprise Real-Time Messaging",
      description: "A highly scalable unified communications platform bridging web, desktop, and mobile users. Features sub-millisecond WebSocket messaging, zero-latency WebRTC video conferencing, and JWT authentication. Wrapped natively via Electron and Capacitor.",
      image: "/chat-ui-cover.png",
      apk: "/zagel-app.apk",
      tech: ["Next.js", "FastAPI", "WebSockets", "WebRTC", "Capacitor"],
      languages: ["TypeScript", "Python"],
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
    },
    {
      title: "AirBnB Clone",
      description: "A complete full-stack web application mimicking core AirBnB functionalities. Built from the ground up featuring a custom command interpreter, MySQL database, and RESTful API.",
      image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=600&q=80",
      tech: ["Python", "Flask", "MySQL", "HTML", "CSS"],
      languages: ["Python", "HTML"],
      github: "https://github.com/laila2005/AirBnB_clone_v3",
      featured: true
    },
    {
      title: "ALX Files Manager",
      description: "A robust back-end file management API. Features JWT user authentication, background processing with Bull, Redis caching, and MongoDB for file metadata storage.",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
      tech: ["Node.js", "Express", "MongoDB", "Redis", "Bull"],
      languages: ["JavaScript"],
      github: "https://github.com/laila2005/alx-files_manager",
      featured: true
    }
  ];

  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const allTechTags = Array.from(new Set(projects.flatMap(p => p.tech)));
  const filteredProjects = filterTag 
    ? projects.filter(p => p.tech.includes(filterTag) && p.featured) 
    : projects.filter(p => p.featured);

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);

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

        {/* Featured Projects Bento Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 mb-32">
            {displayedProjects.map((project, index) => {
              const isHero = index === 0;
              const isWide = index === 3 || index === 6;
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
                key={project.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className={`group flex flex-col ${isHero ? 'lg:flex-row' : ''} bg-white/60 dark:bg-[#110B1D]/40 bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/60 dark:border-purple-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 hover:-translate-y-2 rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer ${spanClass}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className={`relative overflow-hidden border-subtle flex-shrink-0 ${isHero ? 'lg:w-[60%] lg:border-r border-b lg:border-b-0' : 'border-b w-full'}`}>
                  <ParallaxMedia 
                    image={project.image} 
                    video={project.video} 
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

                  {/* View Details hint */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10 dark:border-purple-500/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary/0 group-hover:text-primary transition-all duration-300">
                      <span>Explore Architecture</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    
                    {/* Action Footer (Hearts/Github inside card) */}
                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                      <HeartReaction projectTitle={project.title} />
                      {project.github !== "#" && (
                         <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="text-xs font-bold bg-surface/50 hover:bg-surface-overlay transition-all rounded-xl h-8 px-3 shadow-sm border-subtle text-heading">
                            <Github size={14} className="mr-1.5" />
                            Code
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </AnimatePresence>

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
                className="bg-surface rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-subtle"
              >
                <div className="relative h-48 sm:h-64 lg:h-80 w-full flex-shrink-0 bg-surface-overlay flex items-center justify-center border-b border-subtle p-4 sm:p-6">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 bg-surface/90 backdrop-blur-md rounded-full text-heading hover:text-primary hover:bg-surface shadow-md transition-all border border-subtle"
                  >
                    <X size={20} />
                  </button>
                  {selectedProject.video ? (
                    <video src={selectedProject.video} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <img src={selectedProject.image} alt={selectedProject.title} className="max-w-full max-h-full object-contain rounded-xl drop-shadow-lg" />
                  )}
                </div>
                <div className="p-5 sm:p-8 lg:p-10 overflow-y-auto flex-1">
                  <h3 className="font-poppins font-black text-2xl sm:text-3xl mb-4 text-heading">{selectedProject.title}</h3>
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
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 sm:p-6 border-t border-subtle bg-surface/95 backdrop-blur-md flex-shrink-0 flex flex-wrap gap-3 w-full">
                  {selectedProject.github !== "#" && (
                    <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                      <Button className="w-full font-bold bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white rounded-xl h-12 px-4 shadow-sm text-sm sm:text-base">
                        <Github size={18} className="mr-1.5 sm:mr-2" /> Source
                      </Button>
                    </a>
                  )}
                  {selectedProject.apk && (
                    <a href={selectedProject.apk} download className="flex-1 min-w-[120px]">
                      <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-4 shadow-md shadow-emerald-600/25 text-sm sm:text-base">
                        <Download size={18} className="mr-1.5 sm:mr-2" /> App
                      </Button>
                    </a>
                  )}
                  {selectedProject.live && selectedProject.live !== "#" && (
                    <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                      <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-4 shadow-md shadow-primary/25 text-sm sm:text-base">
                        Live Demo <ArrowRight size={18} className="ml-1.5 sm:ml-2" />
                      </Button>
                    </a>
                  )}
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
