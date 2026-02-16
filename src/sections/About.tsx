import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Lightbulb, Award, Users, MapPin, Briefcase, Clock, GraduationCap, BadgeCheck } from 'lucide-react';

import { shouldReduceEffects } from '@/lib/perf';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Target,
    title: 'Precision Focus',
    description: 'Every project receives meticulous attention to detail, ensuring accurate spatial data and reliable results.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Constantly exploring new GIS technologies and automation techniques to deliver cutting-edge solutions.'
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Rigorous QA/QC processes and topology validation ensure data integrity across all deliverables.'
  },
  {
    icon: Users,
    title: 'Client Centric',
    description: 'Collaborative approach with clear communication, training, and ongoing support for all projects.'
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    const aside = asideRef.current;
    const highlights = highlightsRef.current;

    if (!section || !heading || !content || !aside || !highlights) return;
    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Content animation
      const contentItems = content.querySelectorAll('[data-anim]');
      gsap.fromTo(contentItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      const asideItems = aside.querySelectorAll('[data-anim]');
      gsap.fromTo(asideItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aside,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Highlights animation
      const highlightCards = highlights.querySelectorAll('.highlight-card');
      highlightCards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen py-24 bg-navy z-20"
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay z-[1]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-[2]" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div className="w-full max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            ref={headingRef}
            className="relative mb-14 overflow-hidden rounded-sm border border-slate-700/40 bg-slate-900/20"
          >
            <div className="absolute inset-0 grid-overlay opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_26%,rgba(46,196,182,0.18),transparent_60%)]" />
            <div className="relative z-[1] p-6 sm:p-10">
              <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block">
                About
              </span>
              <h2 className="font-display font-bold text-display-2 text-slate-50 mb-4">
                Precision in every layer.
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                GIS delivery focused on clean data models, defensible QA/QC, and handover-ready outputs.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Markets', value: 'EG + KSA', icon: MapPin },
                  { label: 'Focus', value: 'QA/QC', icon: BadgeCheck },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-teal" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-lg text-slate-50 leading-none">{value}</p>
                      <p className="mt-2 font-mono text-[11px] text-slate-400 uppercase tracking-[0.16em]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
            {/* Left - Text Content */}
            <div ref={contentRef} className="lg:col-span-7 space-y-6">
              <p data-anim className="text-lg text-slate-200 leading-relaxed">
                I am a <span className="text-teal font-semibold">Senior GIS Analyst</span> with experience focused on improving productivity by designing and implementing efficient geospatial workflows.
              </p>

              <p data-anim className="text-base text-slate-300 leading-relaxed">
                I care about delivery quality and adoption: clear schemas, consistent naming, validation rules,
                and documentation that makes the handover easy for the next team.
              </p>

              <p data-anim className="text-base text-slate-300 leading-relaxed">
                My work spans ESRI products (ArcGIS Pro, ArcGIS Online, ArcGIS Enterprise), remote sensing
                (Sentinel-2, Landsat, MODIS), and enterprise geodatabase design. I have delivered projects across
                government and private sectors in Egypt and Saudi Arabia.
              </p>

              <div data-anim className="rounded-sm border border-slate-700/40 bg-slate-900/20 p-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">
                  What I Deliver
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    'A clean geodatabase model (domains, subtypes, relationships) built for real edits',
                    'QA/QC gates using topology and attribute rules to keep data defensible',
                    'Automation scripts for repeatable processing, reporting, and validation',
                    'Web delivery when needed: layers, dashboards, StoryMaps, and field apps',
                    'Handover pack: data dictionary, runbook, and a short walkthrough/training',
                  ].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal/70 flex-shrink-0" />
                      <span className="leading-relaxed">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Skills Tags */}
              <div data-anim className="pt-2">
                <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-3">Core Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {['ArcGIS Pro', 'ArcGIS Enterprise', 'Remote Sensing', 'Python/ArcPy', 'Web GIS', 'Geodatabase Design'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-slate-800/35 border border-slate-700/50 text-slate-200/85 text-sm rounded-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div ref={asideRef} className="lg:col-span-5 space-y-5">
              <div data-anim className="rounded-sm border border-slate-700/40 bg-slate-900/20 p-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">
                  Quick Facts
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: MapPin, label: 'Location', value: 'Giza, Egypt' },
                    { icon: Briefcase, label: 'Delivery', value: 'Government + private sector GIS projects' },
                    { icon: BadgeCheck, label: 'Quality', value: 'Topology, rules, and reproducible QA/QC' },
                    { icon: Clock, label: 'Style', value: 'Fast iterations with clear review checkpoints' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-teal" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                          {label}
                        </p>
                        <p className="mt-1 text-sm text-slate-200/90 leading-relaxed">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div data-anim className="rounded-sm border border-slate-700/40 bg-slate-900/20 p-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">
                  Education & Certifications
                </p>
                <div className="mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-teal" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200/90 leading-relaxed">
                        Bachelor's degree in Geomatics & Geographic Information Systems (KFS University, Very Good with Honors).
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-sm border border-slate-700/40 bg-slate-900/15 p-4">
                    <p className="font-mono text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                      Training
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['UC Davis', 'University of Toronto', 'Esri', 'Cisco'].map((x) => (
                        <span
                          key={x}
                          className="px-3 py-1.5 bg-slate-900/25 border border-slate-700/50 text-slate-200/85 text-xs font-mono rounded-sm"
                        >
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div ref={highlightsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="highlight-card bg-slate-800/20 border border-slate-700/30 p-6 rounded-sm hover:border-teal/30 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-teal/10 rounded-sm flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
