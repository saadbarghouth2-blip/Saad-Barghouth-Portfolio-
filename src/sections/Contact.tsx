import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github, Youtube, Facebook, Phone, MapPin, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { shouldReduceEffects } from '@/lib/perf';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { 
    icon: Mail, 
    label: 'Email', 
    href: 'mailto:saadbarghouth11@gmail.com', 
    value: 'saadbarghouth11@gmail.com',
    color: 'hover:bg-red-500/20 hover:text-red-400'
  },
  { 
    icon: Linkedin, 
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/saadbarghouth/', 
    value: 'linkedin.com/in/saadbarghouth',
    color: 'hover:bg-blue-500/20 hover:text-blue-400'
  },
  { 
    icon: Github, 
    label: 'GitHub', 
    href: 'https://github.com/saadbarghouth2-blip', 
    value: 'github.com/saadbarghouth2-blip',
    color: 'hover:bg-gray-500/20 hover:text-gray-400'
  },
  { 
    icon: Youtube, 
    label: 'YouTube', 
    href: 'https://www.youtube.com/@Saad_Barghouth', 
    value: '@Saad_Barghouth',
    color: 'hover:bg-red-600/20 hover:text-red-500'
  },
  { 
    icon: Facebook, 
    label: 'Facebook', 
    href: 'https://www.facebook.com/people/Saad-Elsayed-Barghouth/', 
    value: 'Saad Elsayed Barghouth',
    color: 'hover:bg-blue-600/20 hover:text-blue-500'
  },
  { 
    icon: Phone, 
    label: 'Phone', 
    href: 'tel:+201067431264', 
    value: '+20 106 743 1264',
    color: 'hover:bg-green-500/20 hover:text-green-400'
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const form = formRef.current;

    if (!section || !content || !form) return;
    if (shouldReduceEffects()) return;

    const contactItems = content.querySelectorAll('.contact-item');
    const formInputs = form.querySelectorAll('.form-input');

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(content.querySelector('h2'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo(content.querySelector('p'),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.1
        }
      );

      // Contact items animation
      contactItems.forEach((item, index) => {
        gsap.fromTo(item,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.08,
          }
        );
      });

      // Form animation
      gsap.fromTo(form,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Form inputs animation
      formInputs.forEach((input, index) => {
        gsap.fromTo(input,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: input,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.05,
          }
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Message Sent!", {
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setFormData({ name: '', email: '', organization: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen py-24 bg-navy z-[80]"
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay z-[1]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-[2]" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] px-[10vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <div ref={contentRef}>
            <h2 className="font-display font-bold text-display-2 text-slate-50 mb-6">
              Let's map your next project.
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Whether you need enterprise GIS solutions, remote sensing analysis, or web-based 
              mapping applications, I'm here to help. Let's discuss how we can turn your 
              spatial data into actionable insights.
            </p>

            {/* Contact Links */}
            <div className="space-y-3 mb-10">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`contact-item flex items-center gap-4 p-3 bg-slate-800/20 border border-slate-700/30 rounded-sm transition-all duration-300 group ${link.color}`}
                  >
                    <div className="w-10 h-10 bg-slate-700/50 rounded-sm flex items-center justify-center group-hover:bg-slate-600/50 transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-xs text-slate-500 uppercase tracking-wide">
                        {link.label}
                      </p>
                      <p className="text-slate-200 transition-colors duration-300">
                        {link.value}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                );
              })}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-slate-400 bg-slate-800/20 border border-slate-700/30 p-4 rounded-sm">
              <MapPin className="w-5 h-5 text-teal" />
              <div>
                <p className="text-sm text-slate-300">Giza, Egypt</p>
                <p className="text-xs text-slate-500">Available for remote collaboration worldwide</p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div
            ref={formRef}
            className="relative bg-slate-800/30 border border-slate-700/50 p-8 rounded-sm"
          >
            {/* Teal Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal" />

            <h3 className="font-display font-semibold text-xl text-slate-50 mb-2">
              Send a Message
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Fill out the form below and I'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-input">
                <label className="block font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-50 placeholder:text-slate-600 focus:border-teal focus:ring-teal/20"
                  placeholder="Your full name"
                />
              </div>

              <div className="form-input">
                <label className="block font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-50 placeholder:text-slate-600 focus:border-teal focus:ring-teal/20"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-input">
                <label className="block font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Organization
                </label>
                <Input
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="bg-slate-900/50 border-slate-700 text-slate-50 placeholder:text-slate-600 focus:border-teal focus:ring-teal/20"
                  placeholder="Company or organization name"
                />
              </div>

              <div className="form-input">
                <label className="block font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-slate-900/50 border-slate-700 text-slate-50 placeholder:text-slate-600 focus:border-teal focus:ring-teal/20 resize-none"
                  placeholder="Tell me about your project, requirements, and timeline..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal hover:bg-teal-dark text-navy font-semibold py-3 rounded-sm transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
