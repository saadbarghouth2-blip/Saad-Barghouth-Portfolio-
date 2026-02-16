import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight,
  Map,
  Database,
  Satellite,
  Palette,
  Code,
  Globe,
  Layers,
  Cpu,
  BarChart3,
  Binary,
  Boxes,
  Braces,
  Cable,
  FileText,
  LayoutTemplate,
  MapPin,
  Server,
  Smartphone,
  Terminal,
  Zap,
  Workflow,
} from 'lucide-react';

import { shouldReduceEffects } from '@/lib/perf';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type LucideIcon = typeof Code;

const TOOL_ICON_BY_KEY: Record<string, LucideIcon> = {
  // Esri desktop / platform
  'arcgis pro': Map,
  'arcmap': Map,
  'arccatalog': Database,
  'arcscene': Layers,
  'arcglobe': Globe,
  'arcgis earth': Globe,
  'arcgis image analyst': Satellite,

  // Esri web / apps
  'arcgis online': Globe,
  'dashboard': BarChart3,
  'dashboards': BarChart3,
  'story maps': FileText,
  'storymaps': FileText,
  'hub': Globe,
  'map viewer': Map,
  'web appbuilder': LayoutTemplate,
  'experience builder': LayoutTemplate,
  'instant apps': Zap,
  'power bi': BarChart3,

  // Field apps
  'survey123': FileText,
  'field maps': MapPin,
  'quickcapture': Smartphone,
  'collector': MapPin,
  'arcgis field apps': Smartphone,

  // Enterprise
  'arcgis server': Server,
  'portal for arcgis': Globe,
  'web adaptor': Cable,
  'data store': Database,
  'arcgis enterprise': Layers,

  // Databases / storage
  'postgresql': Database,
  'postgis': Database,
  'sql server': Database,
  'arcgis data store': Database,
  'geodatabase': Database,
  'geodatabase (file/enterprise)': Database,
  'geodatabase (file & enterprise)': Database,
  'geodatabase (file + enterprise)': Database,
  'geodatabase (file)': Database,
  'geodatabase (enterprise)': Database,

  // Open source GIS
  'qgis': Map,
  'geoserver': Server,
  'gdal/ogr': Cpu,
  'geopandas': Code,

  // Remote sensing
  'google earth engine': Satellite,
  'sentinel hub': Satellite,
  'snap (esa)': Satellite,
  'envi': Satellite,
  'erdas imagine': Satellite,
  'saga gis': Map,

  // Programming
  'python': Terminal,
  'arcpy': Terminal,
  'javascript': Braces,
  'html/css': Braces,
  'arcade': Code,
  'react': Code,
  'modelbuilder': Workflow,
  'c++': Binary,
  'oop': Boxes,
};

function iconForTool(label: string): LucideIcon {
  const key = label.trim().toLowerCase();
  return TOOL_ICON_BY_KEY[key] ?? Code;
}

const capabilities = [
  {
    key: 'spatial-analysis',
    icon: Map,
    title: 'Spatial Analysis',
    description: 'Advanced overlay, proximity, suitability, and network analysis for complex geospatial problem solving.',
    bestFor: ['Site selection', 'Routing', 'Suitability', 'Impact'],
    outcomes: [
      'Decision-ready maps and summaries for stakeholders',
      'Documented assumptions and methodology to support review',
      'Reusable analysis model/pipeline for repeat runs',
    ],
    tools: ['Overlay Analysis', 'Proximity Analysis', 'Network Analysis', 'Suitability Modeling'],
    accent: 'from-teal/18 via-transparent to-transparent',
  },
  {
    key: 'geodatabase-design',
    icon: Database,
    title: 'Geodatabase Design',
    description: 'Enterprise-grade database schemas with topology rules, attribute validation, and data integrity frameworks.',
    bestFor: ['Utilities', 'Land use', 'Asset management', 'Multi-user editing'],
    outcomes: [
      'Schema + data dictionary for consistent handover',
      'Topology/rules that protect integrity during edits',
      'QA/QC checklist with exceptions tracking',
    ],
    tools: ['Topology Rules', 'Attribute Rules', 'QA/QC', 'Data Validation'],
    accent: 'from-cyan-400/14 via-transparent to-transparent',
  },
  {
    key: 'remote-sensing',
    icon: Satellite,
    title: 'Remote Sensing',
    description: 'Satellite imagery analysis including classification, change detection, and spectral indices.',
    bestFor: ['Change detection', 'Monitoring', 'Indices', 'Classification'],
    outcomes: [
      'Pre-processing and alignment for reliable comparisons',
      'Change maps with clear thresholds and interpretation notes',
      'Time-series summaries for reporting',
    ],
    tools: ['NDVI/NDBI/SAVI', 'Change Detection', 'Classification', 'Time Series'],
    accent: 'from-emerald-400/14 via-transparent to-transparent',
  },
  {
    key: 'cartography',
    icon: Palette,
    title: 'Cartography',
    description: 'Professional map design with strong visual hierarchy, clear symbology, and publication-ready layouts.',
    bestFor: ['Reports', 'Dashboards', 'Print layouts', 'Standards'],
    outcomes: [
      'Consistent symbology/typography across outputs',
      'Layout templates for repeatable production work',
      'Readable labeling and legend discipline',
    ],
    tools: ['Thematic Maps', 'Visual Hierarchy', 'Symbology', 'Layout Design'],
    accent: 'from-slate-50/10 via-transparent to-transparent',
  },
  {
    key: 'automation',
    icon: Code,
    title: 'Automation & Scripting',
    description: 'Python, ArcPy, and Arcade scripting for automated workflows and batch processing.',
    bestFor: ['Batch processing', 'QA/QC automation', 'Reporting', 'Schema checks'],
    outcomes: [
      'Automation scripts with stable, logged outputs',
      'Repeatable pipelines to reduce manual steps',
      'Batch exports and report generation',
    ],
    tools: ['Python/ArcPy', 'Arcade', 'ModelBuilder', 'Batch Processing'],
    accent: 'from-teal/16 via-transparent to-transparent',
  },
  {
    key: 'web-gis',
    icon: Globe,
    title: 'Web GIS Development',
    description: 'Interactive web applications, dashboards, and mobile solutions for data visualization.',
    bestFor: ['Dashboards', 'StoryMaps', 'Web apps', 'Stakeholders'],
    outcomes: [
      'Publish-ready web layers with correct access rules',
      'Dashboards/web apps for quick interpretation',
      'Handover-ready configuration and documentation',
    ],
    tools: ['Dashboards', 'StoryMaps', 'Web Apps', 'Mobile Apps'],
    accent: 'from-cyan-400/12 via-transparent to-transparent',
  },
  {
    key: 'enterprise-gis',
    icon: Layers,
    title: 'Enterprise GIS',
    description: 'ArcGIS Enterprise deployment, Portal management, and multi-user environment configuration.',
    bestFor: ['Publishing workflow', 'Portal management', 'Roles & access', 'Governance'],
    outcomes: [
      'Service organization and publishing discipline',
      'Portal content structure for teams and stakeholders',
      'Maintainable deployments with clear ownership',
    ],
    tools: ['ArcGIS Enterprise', 'Portal', 'Server', 'Data Store'],
    accent: 'from-teal/14 via-transparent to-transparent',
  },
  {
    key: 'data-integration',
    icon: Cpu,
    title: 'Data Integration',
    description: 'Integration of GPR, GPS, GNSS, and IoT data into comprehensive GIS workflows.',
    bestFor: ['Field-to-office', 'ETL', 'Schema alignment', 'Traceability'],
    outcomes: [
      'Standardized datasets with clean attribution',
      'Transform routines for repeat updates',
      'Validation rules that prevent schema drift',
    ],
    tools: ['GPR/GPS/GNSS', 'IoT Integration', 'Real-time Data', 'Field Collection'],
    accent: 'from-slate-50/10 via-transparent to-transparent',
  },
  {
    key: 'spatial-analytics',
    icon: BarChart3,
    title: 'Spatial Analytics',
    description: 'Statistical analysis and reporting for informed decision-making and project insights.',
    bestFor: ['KPI reporting', 'Trends', 'Charts', 'Insights'],
    outcomes: [
      'Clear KPI definitions and reporting cadence',
      'Maps + charts that tell one coherent story',
      'Exportable summary reports for stakeholders',
    ],
    tools: ['Statistical Analysis', 'Reporting', 'Charts', 'Insights'],
    accent: 'from-emerald-400/12 via-transparent to-transparent',
  },
  {
    key: '3d-visualization',
    icon: Workflow,
    title: '3D Visualization',
    description: 'Three-dimensional terrain modeling, site visualization, and interactive 3D scenes.',
    bestFor: ['Terrain models', '3D scenes', 'Planning', 'Stakeholder demos'],
    outcomes: [
      '3D terrain/site context for planning discussions',
      'Shareable scenes structured for review and export',
      'Consistent styling and navigation for demos',
    ],
    tools: ['3D Analyst', 'Terrain Modeling', 'Site Visualization', 'Scenes'],
    accent: 'from-slate-50/10 via-transparent to-transparent',
  },
];

const skillCategories = [
  {
    id: 'arcgis-desktop',
    icon: Map,
    title: 'ArcGIS Desktop',
    description: 'Authoring, editing, and production workflows in Pro and classic tools.',
    skills: ['ArcGIS Pro', 'ArcMap', 'ArcCatalog', 'ArcGIS Earth', 'ArcGIS Image Analyst', 'ArcScene', 'ArcGlobe'],
  },
  {
    id: 'web-gis-apps',
    icon: Globe,
    title: 'Web GIS & Apps',
    description: 'Publishing, dashboards, and stakeholder-facing web experiences.',
    skills: ['ArcGIS Online', 'Dashboard', 'StoryMaps', 'Instant Apps', 'Experience Builder', 'Web AppBuilder', 'Hub', 'Map Viewer', 'Power BI'],
  },
  {
    id: 'field-data',
    icon: Smartphone,
    title: 'Field Data Collection',
    description: 'Mobile capture workflows and structured survey collection.',
    skills: ['Survey123', 'Field Maps', 'QuickCapture', 'ArcGIS Field Apps', 'Collector'],
  },
  {
    id: 'databases',
    icon: Database,
    title: 'Databases & Storage',
    description: 'Spatial databases and geodatabase storage patterns for GIS.',
    skills: ['PostgreSQL', 'PostGIS', 'SQL Server', 'Geodatabase', 'ArcGIS Data Store'],
  },
  {
    id: 'arcgis-enterprise',
    icon: Server,
    title: 'Enterprise & Services',
    description: 'Publishing, portal organization, services, and multi-user configuration.',
    skills: ['ArcGIS Enterprise', 'Portal for ArcGIS', 'ArcGIS Server', 'Web Adaptor', 'Data Store'],
  },
  {
    id: 'open-source',
    icon: Code,
    title: 'Open Source GIS',
    description: 'Open ecosystem tools for processing, serving, and scripting.',
    skills: ['QGIS', 'GeoServer', 'GDAL/OGR', 'GeoPandas'],
  },
  {
    id: 'remote-sensing',
    icon: Satellite,
    title: 'Remote Sensing',
    description: 'Imagery processing, monitoring, and classification toolchain.',
    skills: ['Google Earth Engine', 'SNAP (ESA)', 'ENVI', 'ERDAS Imagine', 'Sentinel Hub', 'SAGA GIS'],
  },
  {
    id: 'programming',
    icon: Terminal,
    title: 'Programming & Automation',
    description: 'Automation, scripting, and delivery fundamentals.',
    skills: ['Python', 'ArcPy', 'ModelBuilder', 'Arcade', 'JavaScript', 'React', 'HTML/CSS', 'C++', 'OOP'],
  },
];

export default function Skills() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const reduceEffects = useMemo(() => shouldReduceEffects(), []);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;
    if (reduceEffects) return;

    const ctx = gsap.context(() => {
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
    }, section);

    return () => ctx.revert();
  }, [reduceEffects]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full min-h-screen py-16 bg-navy z-30"
    >
      <div className="skills-aurora z-[0]" />
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div ref={headingRef} className="mb-16 text-center">
            <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-3 block">
              Skills & Capabilities
            </span>
            <h2 className="font-display font-bold text-display-2 text-slate-50 mb-4">
              GIS Delivery Stack
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mx-auto">
              From analysis to enterprise deployment. Specialized in geospatial solutions that scale.
            </p>
          </div>

          {/* Capabilities Timeline */}
          <div className="mb-20">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal/20 to-transparent top-1/3 z-0" aria-hidden="true" />

            {/* Timeline Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={cap.key}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "group text-left rounded-lg border p-6 transition-all duration-300",
                      isActive
                        ? "bg-teal/10 border-teal/40 shadow-[0_0_0_1px_rgba(46,196,182,0.10),0_18px_50px_rgba(0,0,0,0.28)] -translate-y-1"
                        : "bg-slate-900/25 border-slate-700/40 hover:border-teal/25 hover:bg-slate-800/30"
                    )}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                          isActive
                            ? "bg-teal/15 border-teal/40"
                            : "bg-slate-900/30 border-slate-700/50 group-hover:bg-teal/10 group-hover:border-teal/30"
                        )}
                      >
                        <Icon className="w-6 h-6 text-teal" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-lg text-slate-50 leading-snug">
                          {cap.title}
                        </p>
                        {isActive && (
                          <p className="mt-1 text-xs text-teal/80 font-mono">Active</p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {cap.description}
                    </p>

                    {isActive && (
                      <div className="pt-4 border-t border-teal/20 space-y-3">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Best For:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cap.bestFor.map((b) => (
                              <span key={b} className="px-2 py-1 bg-teal/10 border border-teal/25 text-teal text-xs rounded">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Tools:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cap.tools.slice(0, 4).map((t) => (
                              <span key={t} className="px-2 py-1 bg-slate-800/40 border border-slate-700/40 text-slate-200 text-xs rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="font-display font-semibold text-2xl text-slate-50 mb-2">
                Technical Toolkit
              </h3>
              <p className="text-slate-300">Core tools and platforms across all delivery work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="group rounded-lg bg-slate-900/20 border border-slate-700/35 p-5 hover:border-teal/30 hover:bg-slate-800/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                      <cat.icon className="w-5 h-5 text-teal" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-base text-slate-50 leading-snug">
                        {cat.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {cat.skills.length} tools
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.slice(0, 3).map((skill) => {
                      const ToolIcon = iconForTool(skill);
                      return (
                        <span
                          key={skill}
                          className="group/item inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/30 border border-slate-700/40 text-slate-200 text-xs rounded hover:border-teal/30 hover:text-teal transition-colors"
                          title={skill}
                        >
                          <ToolIcon className="w-3 h-3 text-teal/70 group-hover/item:text-teal" />
                          <span className="truncate">{skill}</span>
                        </span>
                      );
                    })}
                    {cat.skills.length > 3 && (
                      <span className="px-2.5 py-1 text-xs text-slate-400">
                        +{cat.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-gradient-to-br from-teal/10 via-slate-900/20 to-slate-900/20 border border-teal/20 p-8 text-center">
            <h3 className="font-display font-semibold text-2xl text-slate-50 mb-3">
              Ready to discuss a project?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              I can propose a stackmatched to your scope: data model, QA/QC gates, and delivery workflow.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                View Work
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
