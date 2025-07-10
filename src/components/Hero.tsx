
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-light via-white to-pink-light"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          {/* Profile image placeholder */}
          <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-r from-primary to-purple-medium mb-8 flex items-center justify-center shadow-2xl hover-lift">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face" 
              alt="Laila Mohamed Fikry"
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>

          <h1 className="font-poppins font-bold text-5xl sm:text-6xl lg:text-7xl mb-6">
            <span className="text-gray-dark">Hi, I'm </span>
            <span className="text-gradient">Laila</span>
          </h1>

          <p className="font-inter text-xl sm:text-2xl text-gray-600 mb-4">
            Software Engineer & Full-Stack Developer
          </p>

          <p className="font-inter text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Passionate about creating beautiful, efficient solutions that bridge technology and user experience. 
            Currently pursuing Software Engineering with expertise in systems programming and web development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-purple-gradient hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium px-8 py-3"
            >
              <a href="#projects" className="flex items-center gap-2">
                View My Work
                <ArrowDown size={18} />
              </a>
            </Button>
            
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/laila-mohamed23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-primary"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://github.com/laila-mohamed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-gray-dark"
              >
                <Github size={24} />
              </a>
              <a 
                href="mailto:laila.mohamed.fikry@gmail.com"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 text-accent"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="animate-bounce">
            <a href="#about">
              <ArrowDown className="mx-auto text-primary" size={32} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
