import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, Sparkles } from 'lucide-react';
import { shouldReduceEffects } from '@/lib/perf';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: 'Senior GIS Analyst | GIS Solutions Specialist',
    company: 'Geoinformatics for Information Systems',
    location: 'El Doki – Al Jizah, Egypt',
    period: 'Aug 2024 – Present',
    type: 'Full-time · On-site',
    description: [
      'Lead a team of GIS analysts and specialists, overseeing workflow, task delegation, and project delivery',
      'Design, implement, and optimize enterprise GIS workflows, automation, dashboards, and spatial data solutions',
      'Automate complex geoprocessing tasks using Python/ArcPy and improved QA/QC efficiency',
      'Build advanced Web GIS applications, dashboards, and mobile data-collection tools',
      'Perform remote sensing analysis and develop change-detection automation',
      'Deliver 3D visualizations, terrain modeling, and interactive geospatial products',
      'Provide technical leadership, training, and support for engineering and planning teams',
      'Lead the design and optimization of enterprise GIS data models and geospatial workflows',
    ],
  },
  {
    title: 'GIS Analyst | Geospatial Solutions Specialist',
    company: 'Geoinformatics for Information Systems',
    location: 'El Sheikh Zayed – Giza, Egypt',
    period: 'Jul 2023 – Aug 2024',
    type: 'On-site',
    description: [
      'Applied topology rules, attribute rules, and QA/QC checks to ensure spatial accuracy',
      'Created automation scripts for data processing, reporting, and performance monitoring',
      'Integrated GPR, GPS, and GNSS datasets into ArcGIS workflows for accuracy refinement',
      'Built dashboards, mobile apps, and analytical tools to support digital transformation',
      'Conducted satellite imagery analysis, construction monitoring, and geospatial reporting',
      'Produced thematic maps, infrastructure inventories, and spatial analytics',
    ],
  },
  {
    title: 'GIS Specialist',
    company: 'El-Temsah Contracting and Engineering Consultations',
    location: 'Shubra El-Kheima – Qalyubia, Egypt',
    period: 'Jan 2023 – Jul 2023',
    type: 'Full-time · On-site',
    description: [
      'Developed and maintained geodatabases for construction and engineering projects',
      'Performed spatial analyses, mapping, and geoprocessing to support project planning',
      'Created thematic maps, layouts, and geospatial visualizations for client reporting',
      'Designed workflows for data collection, validation, and quality control',
      'Supported integration of GPS and field survey data into GIS databases',
      'Assisted in developing dashboards and reporting tools to track project progress',
    ],
  },
];

const education = [
  {
    degree: 'Bachelor of Geomatics and Geographic Information Systems',
    school: 'KFS University',
    details: 'Grade: Very Good with Honors',
  },
];

const certifications = [
  {
    title: 'University of California, Davis',
    items: [
      'Fundamentals of GIS',
      'GIS Data Formats, Design, and Quality',
      'Geospatial and Environmental Analysis',
      'Imagery, Automation, and Applications',
      'Geospatial Analysis Project'
    ],
  },
  {
    title: 'University of Toronto',
    items: [
      'Introduction to GIS Mapping',
      'GIS Data Acquisition and Map Design',
      'Spatial Analysis and Satellite Imagery in GIS',
      'GIS, Mapping, and Spatial Analysis Capstone'
    ],
  },
  {
    title: 'ESRI Certifications',
    items: [
      'ArcGIS Online Basics',
      'Getting Started with Spatial Analysis',
      'Getting Started with ArcGIS Pro',
      'ArcGIS Enterprise: Getting Started',
      'Performing ArcGIS Online Administrator Tasks',
      'Understanding Spatial Relationships',
      'ArcGIS Workflow Manager: Basic Concepts'
    ],
  },
  {
    title: 'Cisco Certifications',
    items: [
      'CCNAv7: Switching, Routing, and Wireless Essentials',
      'CCNAv7: Enterprise Networking, Security, and Automation',
      'Python Essentials'
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'certifications'>('experience');

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;
    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading,
        { y: 40, opacity: 0 },
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
    }, section);

    return () => ctx.revert();
  }, []);

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
  ] as const;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-screen py-20 bg-navy z-50"
    >
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div className="w-full max-w-7xl mx-auto">
          {/* Heading */}
          <div ref={headingRef} className="mb-16 text-center">
            <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-3 block">
              Professional Growth
            </span>
            <h2 className="font-display font-bold text-display-2 text-slate-50 mb-4 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-300/50 bg-clip-text text-transparent">
              Experience & Expertise
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Building enterprise GIS solutions across analysis, automation, dashboards, and team leadership. From geospatial analysis to enterprise deployment.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex gap-2 p-1.5 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "group flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm relative",
                    activeTab === id
                      ? "bg-gradient-to-br from-teal/25 to-teal/10 text-teal border border-teal/40 shadow-lg shadow-teal/20"
                      : "text-slate-300 hover:text-slate-50 hover:bg-slate-800/40"
                  )}
                >
                  {activeTab === id && (
                    <div className="absolute inset-0 border border-teal/20 rounded-lg animate-pulse" />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 transition-all",
                    activeTab === id ? "text-teal scale-110" : "text-slate-400 group-hover:text-slate-200"
                  )} />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="min-h-[500px]">
            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="animate-fade-in space-y-5">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-950/20 border border-slate-700/50 p-7 rounded-xl hover:border-teal/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal/10"
                  >
                    {/* Background Gradient Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal/0 via-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Index Badge */}
                    <div className="absolute top-4 right-6 w-10 h-10 rounded-lg bg-teal/10 border border-teal/30 flex items-center justify-center text-teal font-mono font-semibold text-sm group-hover:bg-teal/20 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Accent Bar */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-teal via-teal/50 to-transparent group-hover:w-1.5 transition-all" />

                    <div className="relative">
                      {/* Header */}
                      <div className="mb-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-xl text-slate-50 leading-snug mb-2 group-hover:text-teal transition-colors">
                              {exp.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-teal/15 border border-teal/30 flex items-center justify-center group-hover:bg-teal/25 transition-colors">
                                <Briefcase className="w-4 h-4 text-teal" />
                              </div>
                              <p className="text-teal/90 font-medium">{exp.company}</p>
                            </div>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-md group-hover:bg-slate-700/50 transition-colors">
                            <Calendar className="w-3.5 h-3.5 text-teal/70" />
                            <span className="font-mono">{exp.period}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-md group-hover:bg-slate-700/50 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-teal/70" />
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="border-t border-teal/10 pt-5">
                        <ul className="space-y-2.5">
                          {exp.description.slice(0, 4).map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-sm text-slate-300/90 leading-relaxed group-hover:text-slate-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-gradient-to-br from-teal to-teal/50 rounded-full mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {exp.description.length > 4 && (
                            <li className="flex items-center gap-2 text-sm text-teal/80 mt-3 pt-2 border-t border-slate-700/30">
                              <Sparkles className="w-4 h-4" />
                              <span className="font-medium">+{exp.description.length - 4} more responsibilities</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="animate-fade-in">
                <div className="group relative overflow-hidden bg-gradient-to-br from-teal/20 via-teal/5 to-slate-900/20 border border-teal/40 p-10 rounded-xl">
                  {/* Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity" />
                  
                  <div className="relative flex gap-8 items-start">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal/30 to-teal/10 border border-teal/40 flex items-center justify-center flex-shrink-0 group-hover:from-teal/40 group-hover:to-teal/20 transition-all">
                      <GraduationCap className="w-10 h-10 text-teal" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-2xl text-slate-50 mb-2 group-hover:text-teal transition-colors">
                        {education[0].degree}
                      </h3>
                      <p className="text-teal font-semibold text-lg mb-1">{education[0].school}</p>
                      <p className="text-slate-300 mb-4">{education[0].details}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-950/20 border border-slate-700/50 p-7 rounded-xl hover:border-teal/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal/10"
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal/0 via-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-teal/50 to-transparent group-hover:h-1.5 transition-all" />

                    <div className="relative">
                      <div className="flex items-start gap-3 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-teal/15 border border-teal/30 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/25 transition-colors">
                          <Award className="w-5 h-5 text-teal" />
                        </div>
                        <h4 className="font-display font-bold text-lg text-teal group-hover:text-teal/90 transition-colors flex-1 leading-snug">
                          {cert.title}
                        </h4>
                      </div>

                      <ul className="space-y-2.5">
                        {cert.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-slate-300/90 flex items-start gap-2.5 group-hover:text-slate-200 transition-colors">
                            <span className="w-1.5 h-1.5 bg-gradient-to-br from-teal/60 to-teal/30 rounded-full mt-1.5 flex-shrink-0 group-hover:from-teal group-hover:to-teal/60 transition-all" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Item Count Badge */}
                      <div className="mt-5 pt-4 border-t border-slate-700/30 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal/70" />
                        <span className="text-xs text-slate-400 font-mono">{cert.items.length} certifications</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
