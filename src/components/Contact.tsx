
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
    { icon: <Phone className="text-primary" size={24} />, title: "Phone", value: "+20-121-021-2792", href: "tel:+201210212792" },
    { icon: <MapPin className="text-primary" size={24} />, title: "Location", value: "Cairo, Egypt", href: "#" }
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
    <section id="contact" className="relative py-24 px-2 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5 dark:from-purple-900/10 dark:via-pink-900/5 dark:to-indigo-900/10 overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-extrabold text-5xl sm:text-6xl mb-4 text-gradient drop-shadow-lg">
            Contact
          </h2>
          <p className="font-inter text-xl text-body max-w-2xl mx-auto mb-2">
            Let's connect! I'd love to hear about your project, collaboration, or just chat about tech and creativity.
          </p>
          <span className="block text-base text-primary font-medium mb-2">I reply to every message—let's build something amazing together.</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-slide-up">
            <h3 className="font-poppins font-semibold text-2xl mb-8 text-heading">
              Let's Connect
            </h3>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="rounded-2xl bg-surface-elevated backdrop-blur-md shadow-lg border border-subtle hover:shadow-xl hover:scale-[1.03] transition-all duration-300 group"
                  whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(167,139,250,0.12)' }}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <motion.div
                      className="p-3 bg-primary/10 rounded-xl shadow-sm"
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {info.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-poppins font-semibold text-heading mb-1">
                        {info.title}
                      </h4>
                      {info.href !== "#" ? (
                        <a 
                          href={info.href}
                          className="text-body hover:text-primary transition-colors duration-200 font-inter text-base"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-body font-inter text-base">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 shadow-lg border border-primary/10">
              <h4 className="font-poppins font-semibold text-lg mb-3 text-heading">
                Why Work With Me?
              </h4>
              <ul className="space-y-2 text-heading font-inter text-base opacity-80">
                <li>• Strong foundation in both systems and web development</li>
                <li>• Collaborative team player with leadership experience</li>
                <li>• Passionate about creating efficient, scalable solutions</li>
                <li>• Quick learner with excellent problem-solving skills</li>
              </ul>
            </div>
          </div>
          {/* Contact Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="border border-subtle shadow-2xl bg-surface-elevated backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10">
              <h3 className="font-poppins font-bold text-2xl mb-6 text-heading">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      First Name
                    </label>
                    <Input 
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Your first name" 
                      className="border-subtle bg-surface focus:bg-surface focus:border-primary transition-all text-heading placeholder:text-subtle"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Last Name
                    </label>
                    <Input 
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Your last name" 
                      className="border-subtle bg-surface focus:bg-surface focus:border-primary transition-all text-heading placeholder:text-subtle"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <Input 
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com" 
                    className="border-subtle bg-surface focus:bg-surface focus:border-primary transition-all text-heading placeholder:text-subtle"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Message
                  </label>
                  <Textarea 
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or just say hello!"
                    rows={5}
                    className="border-subtle bg-surface focus:bg-surface focus:border-primary transition-all resize-none text-heading placeholder:text-subtle"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 font-bold text-lg py-3 rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] text-white shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
                    style={{ boxShadow: '0 4px 32px 0 rgba(167,139,250,0.15)' }}
                    disabled={loading}
                    onClick={handlePlaneClick}
                  >
                    <span>Send Message</span>
                    <motion.span
                      animate={planeAnim ? { x: [0, 8, 0], rotate: [0, -18, 0] } : { x: 0, rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="inline-block"
                    >
                      <Send size={22} className="ml-1 text-white/80 drop-shadow" />
                    </motion.span>
                  </Button>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-2 p-3 rounded-lg bg-rose-500/10 text-rose-500 text-sm font-medium shadow border border-rose-500/20"
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-bold shadow border border-emerald-500/20"
                      >
                        Message sent! I'll get back to you soon 💜
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
