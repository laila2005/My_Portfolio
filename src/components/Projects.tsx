import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="relative w-full h-full cursor-pointer group"
      style={{ perspective: 1200, minHeight: 320 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={() => setFlipped(f => !f)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: flipped ? '180deg' : '0deg' }}
        transition={{ duration: 1.2, ease: [0.4, 0.2, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: 'hidden', zIndex: flipped ? 0 : 2 }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 w-full h-full z-10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: flipped ? 2 : 0 }}
        >
          {back}
        </div>
      </motion.div>
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

  const handleClick = () => {
    if (!clicked) {
      const newCount = count + 1;
      setCount(newCount);
      setClicked(true);
      localStorage.setItem(key, String(newCount));
    }
  };

  return (
    <button
      aria-label="Heart reaction"
      onClick={handleClick}
      className="flex items-center gap-1 mx-auto mt-2 select-none focus:outline-none"
      disabled={clicked}
      style={{ cursor: clicked ? 'not-allowed' : 'pointer', userSelect: 'none' }}
    >
      <motion.span
        animate={clicked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl"
        style={{ color: clicked ? '#e11d48' : '#a78bfa', filter: clicked ? 'drop-shadow(0 0 6px #e11d48)' : 'none' }}
      >
        ❤️
      </motion.span>
      <span className="text-base font-semibold text-gray-500">{count}</span>
    </button>
  );
}

// Add ProjectCardDetails component
function ProjectCardDetails({ languages, tech }: { languages: string[]; tech: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const extraSkills = tech.length > 2 ? tech.slice(2) : [];
  return (
    <div className="mt-2">
      <button
        className="flex items-center gap-1 text-xs text-purple-700 font-semibold focus:outline-none hover:underline"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide Details' : 'Show Details'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        {expanded && (
          <div className="pt-2 pb-1 px-2 bg-purple-50 rounded-md shadow-inner">
            <div className="mb-1 text-xs text-gray-500">
              <span className="font-medium text-gray-700">Languages:</span> {languages.join(', ')}
            </div>
            <div className="flex flex-wrap gap-1 items-center">
              <span className="font-medium text-gray-700 text-xs">Skills:</span>
              {tech.slice(0, 2).map((skill) => (
                <span key={skill} className="bg-purple-light text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
              {extraSkills.length > 0 && !showAllSkills && (
                <button
                  className="text-xs text-purple-600 font-bold px-1 focus:outline-none"
                  onClick={() => setShowAllSkills(true)}
                  aria-label={`Show ${extraSkills.length} more skills`}
                >
                  +{extraSkills.length}
                </button>
              )}
              {showAllSkills &&
                extraSkills.map((skill) => (
                  <span key={skill} className="bg-purple-light text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const Projects = () => {
  const projects = [
    {
      title: "R-SkyOrb Mission Dashboard",
      description: "Comprehensive front-end dashboard for monitoring and controlling high-altitude balloon systems with real-time telemetry visualization and interactive controls.",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // Satellite/space dashboard
      tech: ["React.js", "JavaScript", "CSS3", "Real-time Data"],
      languages: ["JavaScript", "CSS"],
      github: "https://github.com/laila2005/R-SkyOrb-dashboard",
      featured: false
    },
    {
      title: "DishCraft",
      description: "ALX Africa portfolio project featuring comprehensive UI/UX design, user authentication, and seamless database integration for a culinary platform.",
      image: "/dishcraft.PNG", // User's uploaded image
      tech: ["React.js", "Node.js", "Database", "Authentication"],
      languages: ["JavaScript", "Node.js", "CSS"],
      github: "https://github.com/laila2005/DishCraft/tree/combined-branch",
      featured: true
    },
    {
      title: "3D Raycasting Maze Game",
      description: "Built in C using SDL2 with collision detection, player movement, enemy AI, and dynamic maze generation with textures.",
      image: "/MazeGame.png", // User's uploaded image
      tech: ["C", "SDL2", "Game Development", "3D Graphics"],
      languages: ["C"],
      github: "https://github.com/walid-mehelba/The_Maze",
      featured: true
    },
    {
      title: "Bagi Job Platform",
      description: "Professional freelance project developed as a full-stack developer through Mostaqel platform. Complete job portal with modern React frontend and robust backend architecture.",
      image: "/bagijob-logo.png",
      tech: ["React.js", "Full-Stack", "Web Development", "Freelance"],
      languages: ["JavaScript", "React"],
      github: "#", // No public repo for client work
      live: "https://bagijob.com",
      featured: true
    },
    {
      title: "TechRoad (In Progress)",
      description: "AI-powered career guidance platform. Leading development as Team Leader & Backend Developer with Flask API, JWT auth, and MongoDB.",
      image: "/techroad-logo.svg",
      tech: ["Flask", "Python", "MongoDB", "Team Leadership"],
      languages: ["Python", "JavaScript"],
      github: "https://github.com/laila2005/Tech-Road",
      featured: true,
      status: "In Progress"
    },
    {
      title: "Audio Visualization Tool",
      description: "Real-time MATLAB tool for pitch modification and waveform visualization with advanced signal processing capabilities.",
      image: "/Audiovisualization.png", // User's uploaded image
      tech: ["MATLAB", "Signal Processing", "GUI", "Audio"],
      languages: ["MATLAB"],
      github: "https://github.com/laila2005/Audio-Visualization-and-Pitch-Modification",
      featured: false
    },
    {
      title: "Project Management System",
      description: "Comprehensive task manager built in Java with SQL Server backend, featuring user authentication and progress visualization.",
      image: "/project managment system.webp", // User's uploaded image
      tech: ["Java", "SQL Server", "JDBC", "Desktop App"],
      languages: ["Java", "SQL"],
      github: "https://github.com/laila2005/FinalProjectManagmentSystem",
      featured: false
    },
    {
      title: "Simple Shell",
      description: "Unix-like shell implementation in C with built-in commands, process control, memory handling, and comprehensive error feedback.",
      image: "/shell.jpg", // User's uploaded image
      tech: ["C", "Unix", "System Programming", "Shell"],
      languages: ["C"],
      github: "https://github.com/laila2005/simple_shell",
      featured: false
    },
    {
      title: "Qayedny Landing Page",
      description: "Modern and responsive landing page designed and developed as a front-end developer, featuring clean UI/UX design and optimized user experience.",
      image: "/538shots_so.png",
      tech: ["HTML5", "CSS3", "Responsive Design", "Frontend"],
      languages: ["HTML", "CSS"],
      github: "https://github.com/laila2005/Qayedny",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-purple-light/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
            A showcase of my technical expertise across various domains, from systems programming to web development.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <FlipCard
              key={project.title}
              front={
                <Card className="border-0 shadow-lg hover-lift overflow-hidden animate-fade-in h-full sm:shadow-xl sm:animate-slide-up sm:min-h-[380px]" style={{ animationDelay: `${index * 0.2}s`, minHeight: '260px' }}>
                  <div className="relative overflow-hidden">
                    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110 p-4"
                      />
                    </div>
                    <div className="absolute top-4 left-4 sm:block hidden flex flex-col gap-2">
                      <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      {project.status && (
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {project.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col items-center justify-center min-h-[80px] sm:p-8 sm:min-h-[120px]">
                    <h4
                      className="font-poppins font-extrabold text-lg sm:text-2xl mb-1 text-center text-purple-900 drop-shadow-md sm:drop-shadow-lg"
                      style={{ letterSpacing: '0.01em', lineHeight: 1.1 }}
                    >
                      {project.title}
                    </h4>
                    <div className="mb-1 text-xs text-gray-600 text-center sm:mb-2">
                      <span className="font-semibold text-purple-800">Languages:</span> {project.languages.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              }
              back={
                <Card className="border-0 shadow-lg hover-lift overflow-hidden h-full bg-white/90 backdrop-blur-md sm:shadow-xl" style={{ minHeight: '260px' }}>
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px] text-center min-h-full sm:p-8 sm:min-h-[224px]" style={{paddingBottom: '2.5rem'}}>
                    <div className="flex-1 flex flex-col justify-start">
                      <h4 className="font-poppins font-semibold text-sm mb-2 text-gray-dark line-clamp-1 text-center sm:text-xl sm:mb-2 sm:line-clamp-none">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 font-inter text-xs mb-3 line-clamp-2 text-center sm:text-sm sm:mb-4 sm:leading-relaxed sm:line-clamp-none">
                        {project.description}
                      </p>
                      <div className="mb-2 sm:mb-4">
                        <h5 className="font-semibold text-xs text-purple-700 mb-0.5 text-center sm:mb-1">Details</h5>
                        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                          <span className="text-xs text-gray-500">Languages: <span className="font-medium text-gray-700">{project.languages.join(', ')}</span></span>
                          <span className="text-xs text-gray-500">Skills: <span className="font-medium text-gray-700">{project.tech.join(', ')}</span></span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center mb-3 sm:gap-2 sm:mb-4">
                        {project.tech.map((tech) => (
                          <span key={tech} className="bg-purple-light text-primary px-2 py-0.5 rounded-full text-xs font-medium sm:px-3 sm:py-1">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center mt-2 items-center w-full sm:gap-3 sm:mt-4">
                      {project.live ? (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs py-1 sm:text-base sm:py-2">
                            <ExternalLink size={12} className="mr-1 sm:mr-2" />
                            Live Site
                          </Button>
                        </a>
                      ) : (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs py-1 sm:text-base sm:py-2">
                            <Github size={12} className="mr-1 sm:mr-2" />
                            Code
                          </Button>
                        </a>
                      )}
                      <HeartReaction projectTitle={project.title} />
                    </div>
                  </CardContent>
                </Card>
              }
            />
          ))}
        </div>

        {/* Other Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherProjects.map((project, index) => (
            <FlipCard
              key={project.title}
              front={
                <Card className="border-0 shadow-lg hover-lift overflow-hidden animate-fade-in h-full" style={{ animationDelay: `${(index + 2) * 0.1}s`, minHeight: 260 }}>
                  <div className="relative overflow-hidden">
                    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110 p-4"
                      />
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col items-center justify-center min-h-[80px]">
                    <h4
                      className="font-poppins font-extrabold text-lg sm:text-xl mb-1 text-center text-purple-900 drop-shadow-md"
                      style={{ letterSpacing: '0.01em', lineHeight: 1.1 }}
                    >
                      {project.title}
                    </h4>
                    <div className="mb-1 text-xs text-gray-600 text-center">
                      <span className="font-semibold text-purple-800">Languages:</span> {project.languages.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              }
              back={
                <Card className="border-0 shadow-lg hover-lift overflow-hidden h-full bg-white/90 backdrop-blur-md" style={{ minHeight: 260 }}>
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px] text-center">
                    <div>
                      <h4 className="font-poppins font-semibold text-sm mb-2 text-gray-dark line-clamp-1 text-center">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 font-inter text-xs mb-3 line-clamp-2 text-center">
                        {project.description}
                      </p>
                      <div className="mb-2">
                        <h5 className="font-semibold text-xs text-purple-700 mb-0.5 text-center">Details</h5>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs text-gray-500">Languages: <span className="font-medium text-gray-700">{project.languages.join(', ')}</span></span>
                          <span className="text-xs text-gray-500">Skills: <span className="font-medium text-gray-700">{project.tech.join(', ')}</span></span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {project.tech.slice(0, 2).map((tech) => (
                          <span key={tech} className="bg-purple-light text-primary px-2 py-0.5 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 2 && (
                          <span className="text-gray-400 text-xs">+{project.tech.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center mt-2 items-center">
                      {project.live ? (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs py-1">
                            <ExternalLink size={12} className="mr-1" />
                            Live Site
                          </Button>
                        </a>
                      ) : (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs py-1">
                            <Github size={12} className="mr-1" />
                            Code
                          </Button>
                        </a>
                      )}
                      <HeartReaction projectTitle={project.title} />
                    </div>
                  </CardContent>
                </Card>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
