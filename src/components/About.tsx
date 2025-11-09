
import { GraduationCap, Award, Heart, Users, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const achievements = [
    {
      icon: <GraduationCap className="text-primary" size={24} />,
      title: "El Sewedy University of Technology",
      description: "Bachelor of Computer Science (Polytechnic of Egypt) - Transferred from Egyptian Russian University",
      year: "2025 - 2028"
    },
    {
      icon: <Award className="text-purple-medium" size={24} />,
      title: "ALX Africa Graduate",
      description: "Full-stack Software Engineering Program",
      year: "2023 - 2025",
      credential: "https://savanna.alxafrica.com/certificates/59enB3JY6M"
    },
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: "IEEE Technical Team Member",
      description: "Active member contributing to technical initiatives and projects",
      year: "2024 - Present"
    },
    {
      icon: <Heart className="text-accent" size={24} />,
      title: "Community Leader",
      description: "HR Team at Computality Community (worked for one year)",
      year: "2024"
    }
  ];

  const certifications = [
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: "Green Digital Certificate",
      description: "Certification in sustainable development awareness and green technology principles",
      year: "2024",
      credential: "https://learning.inco-group.co/pluginfile.php/1/tool_certificate/issues/1760401251/6235986483LF.pdf"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-purple-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl mb-6">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
            A passionate software engineer with a unique blend of technical expertise and creative problem-solving. 
            I love building solutions that make a difference.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text content */}
          <div className="animate-slide-up">
            <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-dark">
              My Journey in Tech
            </h3>
            <div className="space-y-4 text-gray-600 font-inter">
              <p className="text-lg leading-relaxed">
                I'm a passionate Computer Science student at El Sewedy University (Polytechnic of Egypt), deeply exploring systems programming, algorithms, and full-stack development. My growth accelerated through the ALX Africa Software Engineering Program, where I built everything from low-level C programs to dynamic web applications—bridging the gap between core fundamentals and modern technologies.
              </p>
              <p className="text-lg leading-relaxed">
                What sets me apart is how I blend logic with creativity. Whether I'm developing a 3D raycasting game in C, crafting engaging user interfaces with React and Next.js, or sketching illustrations by hand, I strive to build solutions that are both functional and visually appealing.
              </p>
              <p className="text-lg leading-relaxed">
                As both a developer and an artist, I'm constantly exploring ways to make technology more human, expressive, and inspiring.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-poppins font-semibold text-primary mb-2">Languages</h4>
                <p className="text-gray-600 text-sm">Arabic (Native), English (Fluent), Turkish & Russian (Conversational)</p>
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-primary mb-2">Location</h4>
                <p className="text-gray-600 text-sm">Cairo, Egypt</p>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mt-10">
              <h4 className="font-poppins font-semibold text-xl mb-4 text-gray-dark">
                Certifications & Specializations
              </h4>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <Card key={index} className="hover-lift border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          {cert.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-poppins font-semibold text-gray-dark text-sm">
                              {cert.title}
                            </h5>
                            <span className="text-xs text-green-600 font-medium">
                              {cert.year}
                            </span>
                          </div>
                          <p className="text-gray-600 font-inter text-xs mb-2">
                            {cert.description}
                          </p>
                          {cert.credential && (
                            <a 
                              href={cert.credential} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
                            >
                              <ExternalLink size={10} />
                              Verify Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Experience cards */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-poppins font-semibold text-xl mb-4 text-gray-dark">
              Education & Experience
            </h3>
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover-lift border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-light rounded-lg">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-poppins font-semibold text-gray-dark">
                          {achievement.title}
                        </h4>
                        <span className="text-sm text-primary font-medium">
                          {achievement.year}
                        </span>
                      </div>
                      <p className="text-gray-600 font-inter text-sm mb-2">
                        {achievement.description}
                      </p>
                      {achievement.credential && (
                        <a 
                          href={achievement.credential} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                        >
                          <ExternalLink size={12} />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
