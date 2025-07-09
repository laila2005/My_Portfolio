import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      title: "R-SkyOrb Mission Dashboard",
      description: "Comprehensive front-end dashboard for monitoring and controlling high-altitude balloon systems with real-time telemetry visualization and interactive controls.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tech: ["React.js", "JavaScript", "CSS3", "Real-time Data"],
      github: "#",
      demo: "#",
      featured: true
    },
    {
      title: "DishCraft",
      description: "ALX Africa portfolio project featuring comprehensive UI/UX design, user authentication, and seamless database integration for a culinary platform.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      tech: ["React.js", "Node.js", "Database", "Authentication"],
      github: "#",
      demo: "#",
      featured: true
    },
    {
      title: "3D Raycasting Maze Game",
      description: "Built in C using SDL2 with collision detection, player movement, enemy AI, and dynamic maze generation with textures.",
      image: "https://images.unsplash.com/photo-1509048191080-d2e2678e0c4c?w=600&h=400&fit=crop",
      tech: ["C", "SDL2", "Game Development", "3D Graphics"],
      github: "#",
      demo: "#",
      featured: false
    },
    {
      title: "Audio Visualization Tool",
      description: "Real-time MATLAB tool for pitch modification and waveform visualization with advanced signal processing capabilities.",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
      tech: ["MATLAB", "Signal Processing", "GUI", "Audio"],
      github: "#",
      demo: "#",
      featured: false
    },
    {
      title: "Project Management System",
      description: "Comprehensive task manager built in Java with SQL Server backend, featuring user authentication and progress visualization.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      tech: ["Java", "SQL Server", "JDBC", "Desktop App"],
      github: "#",
      demo: "#",
      featured: false
    },
    {
      title: "Simple Shell",
      description: "Unix-like shell implementation in C with built-in commands, process control, memory handling, and comprehensive error feedback.",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=400&fit=crop",
      tech: ["C", "Unix", "System Programming", "Shell"],
      github: "#",
      demo: "#",
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
            <Card key={project.title} className="border-0 shadow-xl hover-lift overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-poppins font-semibold text-xl mb-3 text-gray-dark">
                  {project.title}
                </h3>
                <p className="text-gray-600 font-inter mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="bg-purple-light text-primary px-3 py-1 rounded-full text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Github size={16} className="mr-2" />
                    Code
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-gradient">
                    <ExternalLink size={16} className="mr-2" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherProjects.map((project, index) => (
            <Card key={project.title} className="border-0 shadow-lg hover-lift overflow-hidden animate-fade-in" style={{ animationDelay: `${(index + 2) * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-poppins font-semibold text-sm mb-2 text-gray-dark line-clamp-1">
                  {project.title}
                </h4>
                <p className="text-gray-600 font-inter text-xs mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.slice(0, 2).map((tech) => (
                    <span key={tech} className="bg-purple-light text-primary px-2 py-0.5 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 2 && (
                    <span className="text-gray-400 text-xs">+{project.tech.length - 2}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs py-1">
                    <Github size={12} className="mr-1" />
                    Code
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-gradient text-xs py-1">
                    <ExternalLink size={12} className="mr-1" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
