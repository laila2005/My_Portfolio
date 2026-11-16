import { Shield, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { certifications as certData } from '@/data/experience';
import JourneyTimeline from './JourneyTimeline';
import InkUnderline from './InkUnderline';

const certificationIcon = <Shield className="text-emerald-500" size={24} />;

const About = () => {
  const certifications = certData.map(cert => ({
    icon: certificationIcon,
    title: cert.title,
    description: cert.detail,
    year: cert.period,
    credential: cert.credential,
    localProof: cert.localProof,
  }));

  return (
    <section id="about" className="py-24 bg-surface transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-poppins font-black text-4xl sm:text-5xl mb-6 text-heading"
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Story</span>
          </motion.h2>
          <InkUnderline />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-lg text-body max-w-3xl mx-auto leading-relaxed"
          >
            A software engineer specializing in scalable backend architectures, full-stack systems, and robust web applications.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h3 className="font-poppins font-bold text-2xl mb-6 text-heading">
              How I Got Here
            </h3>
            
            <div className="space-y-5 text-body font-inter">
              <p className="text-lg leading-relaxed font-medium text-heading border-l-4 border-purple-500 pl-4 bg-primary/5 py-2 rounded-r-lg">
                My first lines of code were JavaScript: a console.log("Hello, World"), written on my own in elementary school, before I had even heard of Scratch. It wasn&apos;t a school subject.
              </p>

              <p className="text-base leading-relaxed">
                It was hard. Most people start with something gentler, and I didn&apos;t know that. I just kept going, taking courses on the side of school, and the love of it stuck.
              </p>

              <p className="text-base leading-relaxed">
                I started a university degree in AI in 2023 at the Egyptian Russian University. In 2025 I transferred to El Sewedy University of Technology (Polytechnic of Egypt) to study software development, the field I was most drawn to. I learn by doing, and I wanted to be somewhere I could build.
              </p>

              <p className="text-base leading-relaxed">
                What drives me is making real systems that work and help people. ALX Africa gave me the full-stack and C foundations, and since then I have built things like a C 3D engine, a real-time messaging platform, and LM-MS, the monitoring product I help build as co-founder of LM Smart Solutions.
              </p>
            </div>

            <div className="mt-10 p-6 bg-surface-elevated border border-subtle ring-1 ring-primary/5 rounded-2xl shadow-sm">
              <h4 className="font-poppins font-bold text-heading mb-3">Beyond the code</h4>
              <div className="space-y-3 text-body font-inter text-sm leading-relaxed">
                <p>
                  I&apos;m also an artist. I have loved painting and drawing since I was a kid, and I&apos;ve kept it alongside programming. When I feel overwhelmed or stressed, I paint: moving the brush is how I let it all go.
                </p>
                <p>
                  I care about details and feelings, and I&apos;m moved by things that make people feel something different. I like adventure and trying something new, or a little crazy. I love to travel too; I haven&apos;t been abroad yet, but it&apos;s on my bucket list.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href="https://www.instagram.com/p/C0xPO2vohax/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-subtle"
                  >
                    <img
                      src="/art-charcoal-butterflies.webp"
                      alt="Charcoal portrait of a woman with curly hair, a butterfly across one eye and butterflies around her face"
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/p/CNfH_UBhDtZ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-subtle"
                  >
                    <img
                      src="/art-ink-butterflies.webp"
                      alt="Black ink drawing of a woman holding a mask on a stick, her head open to a night sky with butterflies"
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </a>
                </div>
                <p>
                  <a
                    href="https://www.instagram.com/laloo_arts_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-primary hover:underline"
                  >
                    My paintings: @laloo_arts_ on Instagram
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-10 p-6 bg-surface-elevated border border-subtle ring-1 ring-primary/5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-heading mb-2">Languages</h4>
                <p className="text-body text-sm leading-relaxed">Arabic (Native), English (Fluent), Turkish (Proficient), Russian & German (Beginner)</p>
              </div>
              <div className="w-px bg-border hidden sm:block"></div>
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-heading mb-2">Location</h4>
                <p className="text-body text-sm leading-relaxed">Cairo, Egypt &bull; Open to Remote Collaboration</p>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mt-12">
              <h4 className="font-poppins font-bold text-xl mb-6 text-heading tracking-tight">
                Certifications
              </h4>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border border-emerald-500/20 shadow-sm bg-emerald-500/5 hover:border-emerald-500/40 transition-colors rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl">
                        {cert.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-poppins font-bold text-heading text-base">
                            {cert.title}
                          </h5>
                          <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {cert.year}
                          </span>
                        </div>
                        <p className="text-body font-inter text-sm mb-3">
                          {cert.description}
                        </p>
                        {/* The issuer's online verifier for this certificate no
                            longer resolves, so link the certificate itself. */}
                        {(cert.credential || cert.localProof) && (
                          <a
                            href={cert.credential ?? cert.localProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors w-fit bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                          >
                            {cert.credential ? <ExternalLink size={14} /> : <FileText size={14} />}
                            {cert.credential ? 'Verify Credential' : 'View Certificate'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* The path, told as a metamorphosis */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <h3 className="font-poppins font-bold text-2xl mb-6 text-heading">
              My Path
            </h3>

            <JourneyTimeline />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
