
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />,
      title: "Email",
      value: "laila.mohamed.fikry@gmail.com",
      href: "mailto:laila.mohamed.fikry@gmail.com"
    },
    {
      icon: <Phone className="text-purple-medium" size={24} />,
      title: "Phone",
      value: "+20-121-021-2792",
      href: "tel:+201210212792"
    },
    {
      icon: <MapPin className="text-accent" size={24} />,
      title: "Location",
      value: "Cairo, Egypt",
      href: "#"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-purple-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-4xl sm:text-5xl mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
            I'm always open to discussing new opportunities, collaborations, or just having a chat about technology and innovation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-slide-up">
            <h3 className="font-poppins font-semibold text-2xl mb-8 text-gray-dark">
              Let's Connect
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={info.title} className="border-0 shadow-md hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-light rounded-lg">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-gray-dark mb-1">
                          {info.title}
                        </h4>
                        {info.href !== "#" ? (
                          <a 
                            href={info.href}
                            className="text-gray-600 hover:text-primary transition-colors duration-200 font-inter"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-600 font-inter">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-light to-pink-light rounded-xl">
              <h4 className="font-poppins font-semibold text-lg mb-3 text-gray-dark">
                Why Work With Me?
              </h4>
              <ul className="space-y-2 text-gray-600 font-inter text-sm">
                <li>• Strong foundation in both systems and web development</li>
                <li>• Collaborative team player with leadership experience</li>
                <li>• Passionate about creating efficient, scalable solutions</li>
                <li>• Quick learner with excellent problem-solving skills</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-dark">
                  Send a Message
                </h3>
                
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input placeholder="Your first name" className="border-gray-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input placeholder="Your last name" className="border-gray-200" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input type="email" placeholder="your.email@example.com" className="border-gray-200" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input placeholder="What's this about?" className="border-gray-200" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea 
                      placeholder="Tell me about your project or just say hello!"
                      rows={5}
                      className="border-gray-200 resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-gradient hover:shadow-lg transition-all duration-300">
                    <Send size={18} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
