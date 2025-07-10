
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="font-poppins font-bold text-2xl mb-4 text-gradient">
              Laila Mohamed Fikry
            </h3>
            <p className="font-inter text-gray-300 max-w-2xl mx-auto">
              Software Engineer passionate about creating beautiful, efficient solutions 
              that bridge technology and user experience.
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.linkedin.com/in/laila-mohamed23/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com/laila-mohamed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a 
              href="mailto:laila.mohamed.fikry@gmail.com"
              className="p-3 bg-white/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className="border-t border-gray-600 pt-8">
            <p className="font-inter text-gray-400 text-sm flex items-center justify-center gap-1">
              Made with <Heart size={16} className="text-accent" /> by Laila Fikry • © 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
