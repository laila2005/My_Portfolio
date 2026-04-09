import { ExternalLink, Github, Video, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';

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
      className="w-full h-56 flex items-center justify-center bg-gray-50/50 relative group/media overflow-hidden"
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 focus:outline-none ${clicked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}
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
      title: "R-SkyOrb Mission Dashboard",
      description: "Comprehensive front-end dashboard for monitoring and controlling high-altitude balloon systems with real-time telemetry visualization and interactive controls.",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", 
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      tech: ["React.js", "TypeScript", "Real-time Data", "WebSocket"],
      languages: ["JavaScript"],
      github: "https://github.com/laila2005/R-SkyOrb-dashboard",
      featured: false
    },
    {
      title: "DishCraft",
      description: "Full-stack culinary platform featuring comprehensive UI/UX design, secure JWT user authentication, and seamless database integration using Node.js.",
      image: "/dishcraft.PNG",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      tech: ["React.js", "Node.js", "MongoDB", "Express", "JWT"],
      languages: ["TypeScript", "Node.js"],
      github: "https://github.com/laila2005/DishCraft/tree/combined-branch",
      featured: true
    },
    {
      title: "3D Raycasting Maze Game",
      description: "Low-level graphics engine built in C using SDL2. Features complex collision detection, player movement physics, enemy AI, and dynamic maze texture rendering.",
      image: "/MazeGame.png", 
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      tech: ["C", "SDL2", "Raycasting", "Algorithms", "Memory Management"],
      languages: ["C"],
      github: "https://github.com/walid-mehelba/The_Maze",
      featured: true
    },
    {
      title: "Bagi Job Platform",
      description: "Professional freelance job portal developed entirely from scratch. Engineered a scalable React frontend coupled with robust backend server architecture.",
      image: "/bagijob-logo.png",
      video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
      title: "Audio Visualization Tool",
      description: "Real-time MATLAB tool for pitch modification and waveform visualization with advanced signal processing capabilities.",
      image: "/Audiovisualization.png", 
      tech: ["MATLAB", "Signal Processing", "GUI", "Audio"],
      languages: ["MATLAB"],
      github: "https://github.com/laila2005/Audio-Visualization-and-Pitch-Modification",
      featured: false
    },
    {
      title: "Project Management System",
      description: "Comprehensive enterprise task manager built in Java with SQL Server backend, featuring role-based access control and progress visualization.",
      image: "/project managment system.webp", 
      tech: ["Java", "SQL Server", "JDBC", "Desktop App"],
      languages: ["Java", "SQL"],
      github: "https://github.com/laila2005/FinalProjectManagmentSystem",
      featured: false
    },
    {
      title: "Simple Shell",
      description: "Unix-like shell implementation in C handling built-in commands, child process control, meticulous memory handling, and comprehensive error feedback.",
      image: "/shell.jpg", 
      tech: ["C", "Unix", "System Programming", "Shell"],
      languages: ["C"],
      github: "https://github.com/laila2005/simple_shell",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-32 bg-[#fafafa] relative overflow-hidden">
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-gray-900 tracking-tight"
          >
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Portfolio</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-gray-500 max-w-2xl mx-auto"
          >
            A selection of production-grade applications, robust backend architectures, and core system engineering experiments.
          </motion.p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mb-32">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group flex flex-col bg-white border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-2xl hover:shadow-purple-900/5 rounded-3xl overflow-hidden transition-all duration-500"
            >
              <div className="relative overflow-hidden border-b border-gray-100 flex-shrink-0 bg-white">
                <ParallaxMedia image={project.image} video={project.video} alt={project.title} />
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm tracking-wide">
                    Featured
                  </span>
                  {project.status && (
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm tracking-wide">
                      {project.status}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col relative bg-white">
                <h4 className="font-poppins font-bold text-2xl mb-3 text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                  {project.title}
                </h4>
                <p className="text-gray-500 text-sm md:text-base font-inter mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>
                
                <div className="space-y-4 mt-auto">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((lang, i) => (
                        <span key={i} className="text-xs font-semibold text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-md border border-gray-200/60">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-gray-50 p-4 px-8 border-t border-gray-100 flex items-center justify-between">
                <HeartReaction projectTitle={project.title} />
                
                <div className="flex gap-3">
                  {project.github !== "#" && (
                     <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="text-xs font-bold bg-white hover:bg-gray-100 transition-all rounded-xl h-9 px-4 shadow-sm border-gray-200">
                        <Github size={14} className="mr-2" />
                        Code
                      </Button>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <Button className="text-xs font-bold bg-gray-900 text-white hover:bg-purple-700 transition-all rounded-xl h-9 px-4 shadow-md">
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

        {/* Other Projects Section */}
        <div className="text-center mb-12">
          <h3 className="font-poppins font-bold text-2xl text-gray-800 flex items-center justify-center gap-3">
            More <span className="text-purple-600">Experiments & Systems</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
              className="group flex flex-col bg-white border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="relative overflow-hidden h-48 flex-shrink-0 bg-gray-50 border-b border-gray-100">
                <ParallaxMedia image={project.image} alt={project.title} />
              </div>
              <CardContent className="p-6 flex flex-col flex-1 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-poppins font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {project.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span key={tech} className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-gray-400 text-[10px] font-bold px-1 py-0.5">+{project.tech.length - 3}</span>
                  )}
                </div>
              </CardContent>
              
              <div className="bg-gray-50/80 p-3 px-6 border-t border-gray-100 flex items-center justify-between">
                 <HeartReaction projectTitle={project.title} />
                 
                 {project.github !== "#" && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-gray-600 hover:text-purple-700 hover:bg-purple-50">
                        View Source <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </a>
                  )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
