
import { GraduationCap, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const achievements = [
    {
      icon: <GraduationCap className="text-primary" size={24} />,
      title: "Egyptian Russian University",
      description: "Bachelor of Software Engineering, GPA: 3.4/4.0",
      year: "2023 - 2027"
    },
    {
      icon: <Award className="text-purple-medium" size={24} />,
      title: "ALX Africa Graduate",
      description: "Full-stack Software Engineering Program",
      year: "2023 - 2025"
    },
    {
      icon: <Heart className="text-accent" size={24} />,
      title: "Community Leader",
      description: "HR Team at Computality Community (worked for one year)",
      year: "2024"
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="animate-slide-up">
            <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-dark">
              My Journey in Tech
            </h3>
            <div className="space-y-4 text-gray-600 font-inter">
              <p className="text-lg leading-relaxed">
                I'm a passionate software engineering student at the Egyptian Russian University, currently diving deep into systems programming, algorithms, and full-stack development. My growth really took off through the intensive ALX Africa program, where I built everything from low-level C programs to dynamic web apps—bridging the gap between the fundamentals and modern tech.
              </p>
              <p className="text-lg leading-relaxed">
                What makes me different is how I blend logic with creativity. Whether I’m developing a 3D raycasting game in C, crafting engaging user interfaces with React, or sketching illustrations by hand—I love building things that not only work well but feel good and look beautiful.
              </p>
              <p className="text-lg leading-relaxed">
                As both a developer and an artist, I’m always exploring new ways to make technology more human, expressive, and inspiring.
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
          </div>

          {/* Achievements cards */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                      <p className="text-gray-600 font-inter text-sm">
                        {achievement.description}
                      </p>
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
