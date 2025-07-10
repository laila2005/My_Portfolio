
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

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

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.firstName + ' ' + form.lastName,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Message sent!');
        setForm({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        alert(data.error || 'Failed to send message.');
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

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
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input 
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Your first name" 
                        className="border-gray-200" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input 
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Your last name" 
                        className="border-gray-200" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input 
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com" 
                      className="border-gray-200" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or just say hello!"
                      rows={5}
                      className="border-gray-200 resize-none"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-gradient hover:shadow-lg transition-all duration-300" disabled={loading}>
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Message
                      </>
                    )}
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
