
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />, title: "Email", value: "laila.mohamed.fikry@gmail.com", href: "mailto:laila.mohamed.fikry@gmail.com"
    },
    { icon: <Phone className="text-purple-medium" size={24} />, title: "Phone", value: "+20-121-021-2792", href: "tel:+201210212792" },
    { icon: <MapPin className="text-accent" size={24} />, title: "Location", value: "Cairo, Egypt", href: "#" }
  ];

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [planeAnim, setPlaneAnim] = useState(false);
  const planeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Enhanced validation
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    
    let didTimeout = false;
    const timeout = setTimeout(() => {
      didTimeout = true;
      setLoading(false);
      setError('Request timed out. Please try again later.');
    }, 15000); // 15 seconds
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.firstName.trim() + ' ' + form.lastName.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      
      clearTimeout(timeout);
      if (didTimeout) return;
      
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setForm({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({ error: 'Server error' }));
        setError(data.error || `Failed to send message. (Status: ${res.status})`);
      }
    } catch (err) {
      clearTimeout(timeout);
      if (didTimeout) return;
      console.error('Contact form error:', err);
      setError('Failed to send message. Please check your connection or try again later.');
    } finally {
      if (!didTimeout) setLoading(false);
    }
  };

  const handlePlaneClick = () => {
    setPlaneAnim(true);
    if (planeTimeout.current) clearTimeout(planeTimeout.current);
    planeTimeout.current = setTimeout(() => setPlaneAnim(false), 500);
  };

  return (
    <section id="contact" className="relative py-24 px-2 bg-gradient-to-br from-[#f3e8ff] via-[#fbc2eb] to-[#e0e7ef] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at 60% 20%, #a78bfa22 0%, #fff0 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-extrabold text-5xl sm:text-6xl mb-4 bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#fbc2eb] bg-clip-text text-transparent drop-shadow-lg">
            Contact
          </h2>
          <p className="font-inter text-xl text-gray-800 max-w-2xl mx-auto mb-2">
            Let’s connect! I’d love to hear about your project, collaboration, or just chat about tech and creativity.
          </p>
          <span className="block text-base text-purple-600 font-medium mb-2">I reply to every message—let’s build something amazing together.</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-slide-up">
            <h3 className="font-poppins font-semibold text-2xl mb-8 text-purple-800">
              Let’s Connect
            </h3>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-purple-100 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group"
                  whileHover={{ y: -4, boxShadow: '0 8px 32px #a78bfa33' }}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <motion.div
                      className="p-3 bg-gradient-to-br from-[#ede9fe] to-[#fbc2eb22] rounded-xl shadow"
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {info.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-poppins font-semibold text-purple-900 mb-1">
                        {info.title}
                      </h4>
                      {info.href !== "#" ? (
                        <a 
                          href={info.href}
                          className="text-gray-800 hover:text-primary transition-colors duration-200 font-inter text-base"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-800 font-inter text-base">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ede9fe] via-[#fbc2eb] to-[#e0e7ef] shadow-lg border border-purple-100">
              <h4 className="font-poppins font-semibold text-lg mb-3 text-purple-800">
                Why Work With Me?
              </h4>
              <ul className="space-y-2 text-gray-800 font-inter text-base">
                <li>• Strong foundation in both systems and web development</li>
                <li>• Collaborative team player with leadership experience</li>
                <li>• Passionate about creating efficient, scalable solutions</li>
                <li>• Quick learner with excellent problem-solving skills</li>
              </ul>
            </div>
          </div>
          {/* Contact Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl">
              <CardContent className="p-10">
                <h3 className="font-poppins font-bold text-2xl mb-6 text-purple-800">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        First Name
                      </label>
                      <Input 
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Your first name" 
                        className="border-purple-100 bg-white focus:bg-white focus:border-purple-400 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        Last Name
                      </label>
                      <Input 
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Your last name" 
                        className="border-purple-100 bg-white focus:bg-white focus:border-purple-400 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Email
                    </label>
                    <Input 
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com" 
                      className="border-purple-100 bg-white focus:bg-white focus:border-purple-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Message
                    </label>
                    <Textarea 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or just say hello!"
                      rows={5}
                      className="border-purple-100 bg-white focus:bg-white focus:border-purple-400 transition-all resize-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 font-bold text-lg py-3 rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#fbc2eb] to-[#a1c4fd] shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                      style={{ boxShadow: '0 4px 32px 0 #a78bfa33, 0 1.5px 8px 0 #fbc2eb33' }}
                      disabled={loading}
                      onClick={handlePlaneClick}
                    >
                      <span>Send Message</span>
                      <motion.span
                        animate={planeAnim ? { x: [0, 8, 0], rotate: [0, -18, 0] } : { x: 0, rotate: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="inline-block"
                      >
                        <Send size={22} className="ml-1 text-purple-700 drop-shadow" />
                      </motion.span>
                    </Button>
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-2 p-3 rounded-lg bg-gradient-to-r from-[#ede9fe] via-[#fbc2eb] to-[#e0e7ef] text-purple-800 text-sm font-medium shadow"
                        >
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-2 p-3 rounded-lg bg-gradient-to-r from-[#a78bfa] via-[#fbc2eb] to-[#a1c4fd] text-purple-900 text-sm font-bold shadow"
                        >
                          Message sent! I’ll get back to you soon 💜
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* SVG Wave Divider */}
      <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none select-none" style={{ height: '90px', transform: 'translateY(100%)' }}>
        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 60 Q 360 0 720 60 T 1440 60 V90H0V60Z" fill="url(#wave)" />
          <defs>
            <linearGradient id="wave" x1="0" y1="0" x2="1440" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a78bfa" />
              <stop offset="0.5" stopColor="#fbc2eb" />
              <stop offset="1" stopColor="#e0e7ef" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Contact;
