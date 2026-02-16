import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AppWindow,
  ArrowUpRight,
  Blocks,
  Briefcase,
  Filter,
  GalleryHorizontal,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Map,
  MapPin,
  Building2,
  Satellite,
  Sparkles,
  Waves,
  Route,
} from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { shouldReduceEffects } from '@/lib/perf';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const projectCategories = ['All', 'Ministry of Transport', 'NUCA', 'Environmental', 'Frontend', 'ArcGIS Online', 'Other'];

type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  details: string[];
  technologies: string[];
  icon: ComponentType<{ className?: string }>;
  featured: boolean;
  image?: string;
};

const projectImageById: Record<number, string> = {
  // Ministry of Transport
  1: 'https://images.pexels.com/photos/12929014/pexels-photo-12929014.jpeg?auto=compress&cs=tinysrgb&w=1200',
  2: 'https://images.pexels.com/photos/31338548/pexels-photo-31338548.jpeg?auto=compress&cs=tinysrgb&w=1200',
  3: 'https://images.pexels.com/photos/9764549/pexels-photo-9764549.jpeg?auto=compress&cs=tinysrgb&w=1200',
  4: 'https://images.pexels.com/photos/31486643/pexels-photo-31486643.jpeg?auto=compress&cs=tinysrgb&w=1200',
  5: 'https://images.pexels.com/photos/18411494/pexels-photo-18411494.jpeg?auto=compress&cs=tinysrgb&w=1200',
  6: 'https://images.pexels.com/photos/32642360/pexels-photo-32642360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  7: 'https://images.pexels.com/photos/7868930/pexels-photo-7868930.jpeg?auto=compress&cs=tinysrgb&w=1200',

  // NUCA
  8: 'https://images.pexels.com/photos/11142768/pexels-photo-11142768.jpeg?auto=compress&cs=tinysrgb&w=1200',
  9: 'https://images.pexels.com/photos/14664521/pexels-photo-14664521.jpeg?auto=compress&cs=tinysrgb&w=1200',
  10: 'https://images.pexels.com/photos/8246810/pexels-photo-8246810.jpeg?auto=compress&cs=tinysrgb&w=1200',
  11: 'https://images.pexels.com/photos/7412032/pexels-photo-7412032.jpeg?auto=compress&cs=tinysrgb&w=1200',

  // Environmental
  12: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg',
  13: 'https://images.pexels.com/photos/18646262/pexels-photo-18646262.jpeg?auto=compress&cs=tinysrgb&w=1200',
  14: 'https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg?auto=compress&cs=tinysrgb&w=1200',
  15: 'https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=1200',
  16: 'https://images.pexels.com/photos/5433126/pexels-photo-5433126.jpeg?auto=compress&cs=tinysrgb&w=1200',

  // Other
  17: 'https://images.pexels.com/photos/9822971/pexels-photo-9822971.jpeg?auto=compress&cs=tinysrgb&w=1200',
  18: 'https://images.pexels.com/photos/33947533/pexels-photo-33947533.jpeg?auto=compress&cs=tinysrgb&w=1200',
  19: 'https://images.pexels.com/photos/34060583/pexels-photo-34060583.jpeg?auto=compress&cs=tinysrgb&w=1200',
  20: 'https://images.pexels.com/photos/9618124/pexels-photo-9618124.jpeg?auto=compress&cs=tinysrgb&w=1200',

  // Frontend
  21: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  22: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  23: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  24: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
  25: 'https://images.pexels.com/photos/14629408/pexels-photo-14629408.jpeg?auto=compress&cs=tinysrgb&w=1200',
  26: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',

  // Additional Frontend
  27: '/images/projects/27-spatial.svg',
  28: '/images/projects/28-fieldops.svg',
  29: '/images/projects/29-widgets.svg',

  // ArcGIS Online / Web GIS Apps
  30: '/images/projects/30-incident-dashboard.svg',
  31: '/images/projects/31-field-collector.svg',
  32: '/images/projects/32-community-portal.svg',
  33: '/images/projects/33-permits-portal.svg',
};

const categoryAccent: Record<string, string> = {
  'Ministry of Transport': 'from-teal/18 via-transparent to-transparent',
  'NUCA': 'from-cyan-400/14 via-transparent to-transparent',
  'Environmental': 'from-emerald-400/14 via-transparent to-transparent',
  'Frontend': 'from-amber-400/14 via-transparent to-transparent',
  'ArcGIS Online': 'from-cyan-300/14 via-transparent to-transparent',
  'Other': 'from-slate-50/10 via-transparent to-transparent',
};

function accentFor(category: string) {
  return categoryAccent[category] ?? categoryAccent['Other'];
}

function ProjectMedia({
  src,
  alt,
  accent,
  className,
  fit = 'cover',
}: {
  src: string;
  alt: string;
  accent: string;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Reset when switching projects/filters so a previously failed image doesn't
    // permanently hide a new `src`.
    setFailed(false);
  }, [src]);

  const imageFitClass =
    fit === 'contain'
      ? 'object-contain p-2 sm:p-3 drop-shadow-[0_22px_40px_rgba(0,0,0,0.35)]'
      : 'object-cover object-center';

  return (
    <div className={cn('relative overflow-hidden bg-slate-900/30', className)}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full transition-transform duration-700 ease-out will-change-transform',
            imageFitClass,
            fit === 'cover' ? 'group-hover:scale-[1.05]' : 'group-hover:scale-[1.02]'
          )}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-slate-200/70">
            <GalleryHorizontal className="w-6 h-6" />
            <span className="font-mono text-xs">Preview unavailable</span>
            <span className="sr-only">{alt}</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
      <div className={cn('absolute inset-0 bg-gradient-to-br', accent)} />
    </div>
  );
}

const baseProjects: Project[] = [
  // Ministry of Transport Projects
  {
    id: 1,
    title: 'Land Use Development - El-Dabaa Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Designed and implemented a comprehensive GIS data model tailored to project requirements. Built spatial relationships and applied topology rules to validate field data.',
    details: [
      'Developed and deployed multiple Web GIS apps (Dashboards, StoryMaps, Survey123, Hub)',
      'Delivered specialized GIS training for ministry engineers in the New Administrative Capital',
      'Created Web AppBuilder, Experience Builder, and Instant Apps for stakeholder engagement',
      'Implemented Field Maps for mobile data collection'
    ],
    technologies: ['ArcGIS Pro', 'ArcGIS Online', 'Survey123', 'Dashboard', 'StoryMaps'],
    icon: MapPin,
    featured: true,
  },
  {
    id: 2,
    title: 'Land Use Development - Kalabsha Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Produced project-specific GIS data model and relational schema for land use analysis around Kalabsha Axis.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules to correct field data',
      'Created interactive dashboards and StoryMaps for stakeholders',
      'Developed automated QA/QC workflows'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Attribute Rules', 'Dashboard'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 3,
    title: 'Dahshour Southern Junction Land Use',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Built GIS data model and enforced topology rules for long-term development monitoring.',
    details: [
      'Developed dashboards and StoryMaps for development monitoring',
      'Trained survey teams on data capture standards',
      'Implemented field validation routines'
    ],
    technologies: ['ArcGIS Pro', 'StoryMaps', 'Field Maps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 4,
    title: 'Cairo/Suez Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Implemented ArcGIS Topology and Attribute Rules for comprehensive QA/QC processes.',
    details: [
      'Published StoryMaps and field apps to support survey teams',
      'Developed dashboards for management monitoring',
      'Created automated reporting workflows'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Survey123', 'Dashboard'],
    icon: Route,
    featured: false,
  },
  {
    id: 5,
    title: 'Regional Ring Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Built modular GIS database to track land-use changes along the Regional Ring Road.',
    details: [
      'Developed interactive dashboards to monitor spatial impacts',
      'Provided analysis reports to project planners',
      'Implemented change detection workflows'
    ],
    technologies: ['ArcGIS Pro', 'Dashboard', 'Change Detection'],
    icon: Route,
    featured: false,
  },
  {
    id: 6,
    title: 'Land Use Development - Qous Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Developed GIS workflows for land use comparison before and after construction.',
    details: [
      'Integrated field survey data with validation routines',
      'Published map viewers and StoryMaps to illustrate findings',
      'Created automated geoprocessing tasks using ModelBuilder'
    ],
    technologies: ['ArcGIS Pro', 'ModelBuilder', 'StoryMaps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 7,
    title: 'Qena/Luxor Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Analyzed pre- and post-upgrade land use through comprehensive GIS models.',
    details: [
      'Automated geoprocessing tasks using ModelBuilder',
      'Created dashboards and maps for reporting',
      'Implemented spatial analysis for impact assessment'
    ],
    technologies: ['ArcGIS Pro', 'ModelBuilder', 'Dashboard'],
    icon: Route,
    featured: false,
  },
  
  // NUCA Projects
  {
    id: 8,
    title: 'Utility Networks - New Obour City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to developing an integrated GIS geodatabase model for all utility networks across 23 sectors.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules for network integrity and QA/QC validation',
      'Developed Python scripts to automate data processing, schema validation, and progress reporting',
      'Supported the integration of radar (GPR) and GPS data into ArcGIS Pro',
      'Created web GIS dashboards and mobile monitoring apps'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'ArcPy', 'GPR', 'GPS', 'Topology'],
    icon: Waves,
    featured: true,
  },
  {
    id: 9,
    title: 'Utility Networks - 15th of May City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to building and managing the GIS data model for 37 sectors covering multiple utilities.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules to ensure spatial integrity and connectivity',
      'Developed Python geoprocessing scripts for batch QA/QC and automated reports',
      'Supported consolidation of Electricity, Water, Sewage, Irrigation, and Gas networks',
      'Developed web GIS dashboards and analytical tools'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'Enterprise GIS', 'Topology'],
    icon: Waves,
    featured: false,
  },
  {
    id: 10,
    title: 'Utility Networks - New Suez City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to designing the GIS data schema and spatial integration for 4 city sectors.',
    details: [
      'Applied ArcGIS Attribute Rules and Python-based QA/QC tools',
      'Processed GPR and GNSS data to refine spatial accuracy',
      'Developed web GIS dashboards and mobile apps for real-time monitoring'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'GPR', 'GNSS'],
    icon: Waves,
    featured: false,
  },
  {
    id: 11,
    title: 'Utility Networks - New Salhia City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to structuring the geospatial database covering 9 sectors and multiple utility networks.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules for NUCA standards compliance',
      'Developed Python scripts for automation and performance tracking',
      'Created customized web GIS dashboards for monitoring'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'ArcGIS Online'],
    icon: Waves,
    featured: false,
  },
  
  // Environmental Compliance Center (KSA) Projects
  {
    id: 12,
    title: 'West Upper Egypt & Abu Simbel Sector',
    client: 'Environmental Compliance Center (KSA)',
    category: 'Environmental',
    description: 'Performed monthly remote sensing monitoring of land-use change in West Upper Egypt and Abu Simbel.',
    details: [
      'Created automated image analysis workflows for planners',
      'Designed dashboards to synchronize field data with HQ',
      'Implemented change detection using Sentinel-2 and Landsat imagery'
    ],
    technologies: ['Remote Sensing', 'Google Earth Engine', 'ArcGIS Pro', 'Dashboard'],
    icon: Satellite,
    featured: true,
  },
  {
    id: 13,
    title: 'Satellite Imagery Construction Monitoring',
    client: 'Environmental Compliance Center (KSA)',
    category: 'Environmental',
    description: 'Analyzed satellite images to assess construction progress on major projects.',
    details: [
      'Validated changes against site reports using QC procedures',
      'Automated reporting workflows for timely updates',
      'Used multi-temporal analysis for progress tracking'
    ],
    technologies: ['Remote Sensing', 'Change Detection', 'ArcGIS Pro'],
    icon: Satellite,
    featured: false,
  },
  {
    id: 14,
    title: 'Parking & Waste Bin Inventory - Jalmouda',
    client: 'Environmental Compliance Center (KSA)',
    category: 'Environmental',
    description: 'Produced detailed maps and inventories for local infrastructure planning.',
    details: [
      'Analyzed accessibility and distribution of services',
      'Provided optimization recommendations to municipalities',
      'Created field data collection workflows'
    ],
    technologies: ['ArcGIS Pro', 'Survey123', 'Spatial Analysis'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 15,
    title: 'Environmental Remote Sensing Monitoring',
    client: 'Environmental Compliance Center (KSA)',
    category: 'Environmental',
    description: 'Created interactive maps for parking and waste bin locations across Saudi Arabia.',
    details: [
      'Performed density and proximity analysis for service optimization',
      'Generated planning reports with GIS insights',
      'Developed automated monitoring systems'
    ],
    technologies: ['Remote Sensing', 'ArcGIS Online', 'Dashboard'],
    icon: Satellite,
    featured: false,
  },
  {
    id: 16,
    title: 'Disposal Sites & Focal Points',
    client: 'Environmental Compliance Center (KSA)',
    category: 'Environmental',
    description: 'Managed geospatial data with GeoServer and PostGIS for environmental monitoring.',
    details: [
      'Published secure WMS/WFS services for users',
      'Performed spatial analysis to prioritize remediation zones',
      'Implemented enterprise geodatabase solutions'
    ],
    technologies: ['GeoServer', 'PostGIS', 'PostgreSQL', 'ArcGIS Enterprise'],
    icon: Building2,
    featured: false,
  },
  
  // Other Projects
  {
    id: 17,
    title: 'Tuwaik Reserve Control & Monitoring',
    client: 'Marafi Company',
    category: 'Other',
    description: 'Developed Web GIS apps and spatial models for marina site selection.',
    details: [
      'Integrated AI and IoT concepts for smart management',
      'Created decision-support simulations for stakeholders',
      'Developed suitability analysis workflows'
    ],
    technologies: ['ArcGIS Online', 'AI/IoT', 'Spatial Modeling'],
    icon: Briefcase,
    featured: false,
  },
  {
    id: 18,
    title: 'Marina Site Selection Study - Oman',
    client: 'Marafi Company',
    category: 'Other',
    description: 'Conducted suitability analysis using ArcGIS Online for marina development.',
    details: [
      'Built QA/QC apps for field validation and task management',
      'Proposed infrastructure network extensions with GIS mapping',
      'Created multi-criteria decision analysis models'
    ],
    technologies: ['ArcGIS Online', 'Survey123', 'Spatial Analysis'],
    icon: Briefcase,
    featured: false,
  },
  {
    id: 19,
    title: 'Salalah Commercial Port',
    client: 'Medar Company',
    category: 'Other',
    description: 'Designed dashboards for real-time construction monitoring at Salalah Port.',
    details: [
      'Performed spatial-statistical analyses of port operations',
      'Delivered GIS-based management reports',
      'Implemented real-time data integration'
    ],
    technologies: ['ArcGIS Dashboard', 'Real-time Data', 'Analytics'],
    icon: Building2,
    featured: false,
  },
  {
    id: 20,
    title: '3D Masterplan - Golden Beach Village',
    client: 'Golden Beach Village (Ras Sedr)',
    category: 'Other',
    description: 'Built 3D site models and terrain visualizations for resort development.',
    details: [
      'Analyzed topographic changes impacting development',
      'Delivered 3D planning maps for stakeholders',
      'Created interactive 3D visualizations'
    ],
    technologies: ['ArcGIS Pro', '3D Analyst', 'Terrain Modeling'],
    icon: Building2,
    featured: false,
  },

  // Frontend Projects
  {
    id: 21,
    title: 'Operations Insights Dashboard (React)',
    client: 'Frontend Dashboard',
    category: 'Frontend',
    description:
      'Built a fast analytics dashboard with KPI cards, drill-down charts, and export-ready reports for daily decision making.',
    details: [
      'Designed a responsive layout with reusable chart + filter components',
      'Implemented smart caching to keep filtering smooth and predictable',
      'Added export workflows (CSV/PDF) and role-aware views for different teams',
      'Focused on accessibility, keyboard navigation, and clear loading states'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind', 'Charting', 'REST APIs'],
    icon: LayoutDashboard,
    featured: true,
  },
  {
    id: 22,
    title: 'Kids Learning Website (Games + Lessons)',
    client: 'EdTech Web',
    category: 'Frontend',
    description:
      'A playful learning site for kids with short lessons, mini-games, and progress badges that keep learning fun and structured.',
    details: [
      'Age-friendly UI with large targets, calm motion, and clear typography',
      'Quizzes + badges + weekly goals to encourage continuity',
      'Safe content structure and parent-friendly settings',
      'Optimized for mobile and low bandwidth (lazy loading, image optimization)'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'PWA', 'Motion'],
    icon: GraduationCap,
    featured: true,
  },
  {
    id: 23,
    title: 'Corporate Website Starter (SEO + Performance)',
    client: 'Marketing Site',
    category: 'Frontend',
    description:
      'Delivered a clean multi-page website with SEO fundamentals, fast load times, and CMS-ready content sections.',
    details: [
      'Reusable content blocks (hero, features, testimonials, FAQ) with consistent tokens',
      'Performance tuning with a Lighthouse-first mindset (images, fonts, caching)',
      'Accessible navigation, forms, and error states'
    ],
    technologies: ['Next.js', 'Tailwind', 'SEO', 'Lighthouse', 'A11y'],
    icon: Globe,
    featured: false,
  },
  {
    id: 24,
    title: 'UI Component Library & Design System',
    client: 'Design System',
    category: 'Frontend',
    description:
      'Built a reusable component library to keep UIs consistent across apps: buttons, forms, tables, modals, and patterns.',
    details: [
      'Design tokens (spacing, typography, colors) + theming strategy',
      'Storybook-style documentation with examples and usage notes',
      'Accessible primitives and tested components for reliability'
    ],
    technologies: ['React', 'TypeScript', 'Storybook', 'Radix UI', 'Testing'],
    icon: Blocks,
    featured: false,
  },
  {
    id: 25,
    title: 'Interactive Web Map Explorer',
    client: 'Web Mapping App',
    category: 'Frontend',
    description:
      'Built an interactive web map with layer toggles, search, and popups to turn datasets into something people can explore.',
    details: [
      'Layer control, clustering, and clear popups for key attributes',
      'Shareable views (URL state) for quick collaboration',
      'Responsive side panel for filters, results, and details'
    ],
    technologies: ['React', 'Leaflet', 'GeoJSON', 'Mapbox', 'Spatial UI'],
    icon: Map,
    featured: false,
  },
  {
    id: 26,
    title: 'Project Tracker Web App (SPA)',
    client: 'Web Application',
    category: 'Frontend',
    description:
      'Built a single-page app for tracking tasks, milestones, and approvals with clean UX and predictable state.',
    details: [
      'Reusable tables with sorting, filtering, and pagination',
      'Inline editing and optimistic updates to reduce friction',
      'Role-aware views for admins vs contributors'
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Validation', 'REST APIs'],
    icon: AppWindow,
    featured: false,
  },

  // Extra Frontend projects (added)
  {
    id: 27,
    title: 'Spatial Visualization Studio',
    client: 'Frontend',
    category: 'Frontend',
    description: 'Map-driven visualization studio for exploratory data analysis and storyboarding.',
    details: [
      'Custom renderer pipelines with Deck.gl and D3 for high-density visualizations',
      'URL-driven state and shareable views for collaboration',
      'Performance-first rendering for large GeoJSON sets'
    ],
    technologies: ['React', 'Deck.gl', 'D3', 'WebGL'],
    icon: Globe,
    featured: false,
  },
  {
    id: 28,
    title: 'FieldOps PWA (Offline-first)',
    client: 'Field Operations',
    category: 'Frontend',
    description: 'Offline-capable progressive web app for field teams with conflict-aware sync.',
    details: [
      'IndexedDB sync queue + background sync',
      'Optimistic UI with conflict resolution UI',
      'Lightweight map viewer with cached tiles and vector sync'
    ],
    technologies: ['PWA', 'Service Worker', 'IndexedDB', 'React', 'ArcGIS API for JavaScript'],
    icon: AppWindow,
    featured: false,
  },
  {
    id: 29,
    title: 'Componentized Map Widgets',
    client: 'UI Toolkit',
    category: 'Frontend',
    description: 'Reusable React widgets for map interactions, filters, and analytics panels.',
    details: [
      'Storybook docs and automated visual tests',
      'Small, framework-agnostic primitives for map UIs',
      'Accessible keyboard-first UX for widget controls'
    ],
    technologies: ['React', 'TypeScript', 'ArcGIS API for JavaScript', 'Storybook'],
    icon: Blocks,
    featured: false,
  },

  // ArcGIS Online / App examples (invented)
  {
    id: 30,
    title: 'ArcGIS Online — Incident Response Dashboard',
    client: 'Emergency Services',
    category: 'ArcGIS Online',
    description: 'Real-time incident dashboard built with ArcGIS Online Dashboards and Instant Apps for first responders.',
    details: [
      'Real-time feature feeds with webhook-driven updates',
      'Role-based filtering and incident triage workflows',
      'Embedded Experience Builder widgets for operator control'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Experience Builder', 'ArcGIS API for JavaScript'],
    icon: Satellite,
    featured: true,
  },
  {
    id: 31,
    title: 'ArcGIS Online — Field Collector Suite',
    client: 'Public Works',
    category: 'ArcGIS Online',
    description: 'Mobile-first collection suite using Survey123, Field Maps and ArcGIS Instant Apps for survey workflows.',
    details: [
      'Offline Survey123 forms with attachments and validation',
      'Field Maps configuration for high-accuracy collection',
      'Automated dashboard reports and scheduled exports'
    ],
    technologies: ['ArcGIS Online', 'Survey123', 'Field Maps', 'ArcGIS Instant Apps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 32,
    title: 'ArcGIS Hub — Community Reporting Portal',
    client: 'City Council',
    category: 'ArcGIS Online',
    description: 'Public-facing Hub site and experience for civic reporting, data downloads and community engagement.',
    details: [
      'Custom Experience Builder pages and widgets',
      'Automations for routing and triage of incoming reports',
      'Open data feeds and scheduled exports for transparency'
    ],
    technologies: ['ArcGIS Hub', 'Experience Builder', 'ArcGIS Online', 'Automations'],
    icon: Globe,
    featured: false,
  },
  {
    id: 33,
    title: 'Experience Builder — Public Permits Portal',
    client: 'Planning Dept',
    category: 'ArcGIS Online',
    description: 'Public permits portal built in Experience Builder with custom widgets and permit status tracking.',
    details: [
      'Secure forms and file uploads',
      'Permit workflow integration with backend via webhooks',
      'Map-driven permit search and printable permit summaries'
    ],
    technologies: ['Experience Builder', 'ArcGIS Online', 'ArcGIS API for JavaScript'],
    icon: LayoutDashboard,
    featured: false,
  },
];

const allProjects = baseProjects.map((p) => ({
  ...p,
  image: p.image ?? projectImageById[p.id],
}));

export default function Projects() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const filterPillRef = useRef<HTMLDivElement>(null);
  const filterBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const featuredRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const reduceEffects = useMemo(() => shouldReduceEffects(), []);

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const c of projectCategories) acc[c] = 0;
    for (const p of allProjects) acc[p.category] = (acc[p.category] ?? 0) + 1;
    acc['All'] = allProjects.length;
    return acc;
  }, []);

  const featuredProjects = allProjects.filter((p) => p.featured);
  const visibleFeatured =
    activeFilter === 'All' ? featuredProjects : featuredProjects.filter((p) => p.category === activeFilter);
  const visibleProjects =
    activeFilter === 'All'
      ? allProjects.filter((p) => !p.featured)
      : allProjects.filter((p) => p.category === activeFilter && !p.featured);

  const activeProject = activeProjectId ? allProjects.find(p => p.id === activeProjectId) : null;
  const ActiveIcon = activeProject?.icon ?? Briefcase;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const filter = filterRef.current;

    if (!section || !heading || !filter) return;

    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const headingItems = heading.querySelectorAll('[data-anim]');
      gsap.fromTo(
        headingItems,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Filter animation
      gsap.fromTo(
        filter,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: filter,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion, reduceEffects]);

  useEffect(() => {
    const section = sectionRef.current;
    const featured = featuredRef.current;
    if (!section || !featured) return;
    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(featured.querySelectorAll<HTMLElement>('.project-card'));
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.06,
          clearProps: 'transform',
        }
      );
    }, section);

    return () => ctx.revert();
  }, [activeFilter, prefersReducedMotion, reduceEffects]);

  useEffect(() => {
    const section = sectionRef.current;
    const projects = projectsRef.current;
    if (!section || !projects) return;
    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(projects.querySelectorAll<HTMLElement>('.project-card'));
      gsap.fromTo(
        cards,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.04,
          clearProps: 'transform',
        }
      );
    }, section);
    return () => ctx.revert();
  }, [activeFilter, prefersReducedMotion, reduceEffects]);

  const setFilterBtnRef =
    (key: string) =>
    (el: HTMLButtonElement | null) => {
      filterBtnRefs.current[key] = el;
    };

  const moveFilterPillTo = (key: string, immediate = false) => {
    const container = filterWrapRef.current;
    const pill = filterPillRef.current;
    if (!container || !pill) return;

    const target = filterBtnRefs.current[key];
    if (!target) {
      pill.style.opacity = '0';
      return;
    }

    const c = container.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const x = Math.round(t.left - c.left);
    const y = Math.round(t.top - c.top);
    const w = Math.round(t.width);
    const h = Math.round(t.height);

    pill.style.opacity = '1';

    if (immediate || prefersReducedMotion) {
      const prev = pill.style.transitionDuration;
      pill.style.transitionDuration = '0ms';
      pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      pill.style.width = `${w}px`;
      pill.style.height = `${h}px`;
      pill.getBoundingClientRect();
      pill.style.transitionDuration = prev;
      return;
    }

    pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    pill.style.width = `${w}px`;
    pill.style.height = `${h}px`;
  };

  useLayoutEffect(() => {
    moveFilterPillTo(activeFilter, true);
  }, [activeFilter]);

  useEffect(() => {
    const onResize = () => moveFilterPillTo(activeFilter, true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeFilter]);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-navy z-40 py-24">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay z-[1]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-[2]" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        {/* Heading */}
        <div
          ref={headingRef}
          className="relative mb-14 overflow-hidden rounded-sm border border-slate-700/40 bg-slate-900/20"
        >
           <div className="projects-aurora" />
           <div className="absolute inset-0 grid-overlay opacity-20" />
           <div className="relative z-[1] p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 items-start">
              <div>
                <span
                  data-anim
                  className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
                >
                  Work
                </span>

                <h2
                  data-anim
                  className="font-display font-bold text-display-2 text-slate-50 mb-4"
                >
                  Projects that ship. Data you can trust.
                </h2>

                <p data-anim className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                  A selection of GIS and frontend delivery across government, utilities, and product work: enterprise
                  geodatabases, utility networks, field data capture, web mapping, dashboards, and UI-heavy web apps.
                  Each project emphasizes clarity, QA/QC, performance, and maintainable delivery.
                </p>

                <div data-anim className="mt-6 flex flex-wrap gap-2">
                  {['Web Apps', 'Dashboards', 'Web Mapping', 'Design Systems', 'Automation', 'QA/QC'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-900/35 border border-slate-700/50 text-slate-300 text-xs rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div data-anim className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('projects-featured');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Browse Highlights
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <GalleryHorizontal className="w-4 h-4" />
                    Related Visuals
                  </button>
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Mail className="w-4 h-4" />
                    Discuss a project
                  </a>
                </div>

                <p data-anim className="mt-6 font-mono text-xs text-slate-500 max-w-3xl">
                  Tip: click any card to open a detailed view (contributions, tools, and delivery notes).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div ref={featuredRef} id="projects-featured" className="mb-16 scroll-mt-24">
          <h3 className="font-display font-semibold text-xl text-teal mb-8 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Featured Projects
          </h3>
          {visibleFeatured.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleFeatured.map((project) => {
                const Icon = project.icon;
                return (
                  <div
                    key={project.id}
                    className="project-card group relative bg-slate-800/30 border border-slate-700/50 rounded-sm overflow-hidden card-hover cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveProjectId(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveProjectId(project.id);
                    }}
                  >
                    {project.image && (
                      <ProjectMedia
                        src={project.image}
                        alt={`${project.title} - ${project.client}`}
                        accent={accentFor(project.category)}
                        className="aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="w-5 h-5 text-teal" />
                          <span className="font-mono text-xs text-slate-500 uppercase tracking-wide truncate">
                            {project.client}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal transition-colors" />
                      </div>
                      <h4 className="font-display font-semibold text-lg text-slate-50 mb-3">
                        {project.title}
                      </h4>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <ul className="space-y-2">
                        {project.details.slice(0, 2).map((detail, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                            <span className="w-1 h-1 bg-teal/60 rounded-full mt-1.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-slate-700/50 bg-slate-900/20 p-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal mt-0.5" />
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No highlighted projects in this category yet. You can switch back to <span className="text-slate-100">All</span> to see the main highlights, or keep browsing below.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Show highlights
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter */}
        <div
          ref={filterRef}
          className="mb-10 rounded-sm border border-slate-700/50 bg-slate-900/20 p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-teal" />
              <span className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">
                Filter
              </span>
            </div>

            <div
              ref={filterWrapRef}
              className="relative flex flex-wrap items-center gap-2"
              onMouseLeave={() => moveFilterPillTo(activeFilter)}
            >
              <div
                ref={filterPillRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 rounded-sm border border-teal/25 bg-teal/10 opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out"
                style={{ width: 0, height: 0, transform: 'translate3d(0px, 0px, 0)' }}
              />

              {projectCategories.map((category) => {
                const isActive = activeFilter === category;
                const count = categoryCounts[category] ?? 0;
                return (
                  <button
                    key={category}
                    ref={setFilterBtnRef(category)}
                    onMouseEnter={() => moveFilterPillTo(category)}
                    onFocus={() => moveFilterPillTo(category)}
                    onBlur={() => moveFilterPillTo(activeFilter)}
                    onClick={() => setActiveFilter(category)}
                    className={cn(
                      'relative z-[1] inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-sm border border-transparent transition-colors duration-300',
                      isActive ? 'text-teal' : 'text-slate-300 hover:text-slate-50'
                    )}
                  >
                    <span>{category}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-sm border text-xs',
                        isActive
                          ? 'bg-teal/15 border-teal/25 text-teal'
                          : 'bg-slate-900/35 border-slate-700/50 text-slate-400'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* All Projects Grid */}
        <div ref={projectsRef} data-testid="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProjects.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="project-card group bg-slate-800/20 border border-slate-700/30 p-5 rounded-sm card-hover cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => setActiveProjectId(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveProjectId(project.id);
                }}
              >
                {project.image ? (
                  <ProjectMedia
                    src={project.image}
                    alt={`${project.title} - ${project.client}`}
                    accent={accentFor(project.category)}
                    className="aspect-[4/3] w-full rounded-sm border border-slate-700/40 mb-4 overflow-hidden"
                  />
                ) : null}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-teal" />
                    <span className="font-mono text-xs text-slate-500">{project.client}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal transition-colors" />
                </div>
                <h4 className="font-display font-medium text-base text-slate-50 mb-2">
                  {project.title}
                </h4>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-700/30 text-slate-400 text-xs rounded-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Count */}
        <div className="mt-12 text-center">
          <p className="font-mono text-sm text-slate-500">
            Showing {visibleFeatured.length + visibleProjects.length} of {allProjects.length} projects
            {activeFilter !== 'All' ? ` in ${activeFilter}` : ''}
          </p>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog
        open={activeProjectId != null}
        onOpenChange={(open) => {
          if (!open) setActiveProjectId(null);
        }}
      >
        <DialogContent className="bg-navy border border-slate-700/60 text-slate-100 sm:max-w-4xl">
          <DialogTitle className="sr-only">
            {activeProject ? activeProject.title : 'Project details'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeProject ? `${activeProject.client} - ${activeProject.category}` : 'Project details dialog'}
          </DialogDescription>
          {activeProject ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Visual */}
              <div className="lg:col-span-5">
                {activeProject.image ? (
                  <ProjectMedia
                    src={activeProject.image}
                    alt={`${activeProject.title} - ${activeProject.client}`}
                    accent={accentFor(activeProject.category)}
                    className="w-full aspect-[16/9] lg:h-full rounded-sm overflow-hidden border border-slate-700/50"
                  />
                ) : (
                  <div className="relative rounded-sm overflow-hidden border border-slate-700/50 bg-gradient-to-br from-teal/15 via-slate-900/40 to-navy h-56 lg:h-full flex items-center justify-center">
                    <ActiveIcon className="w-16 h-16 text-teal/70" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(46,196,182,0.18),transparent_55%)]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="lg:col-span-7">
                <p className="font-mono text-xs text-teal tracking-[0.12em] uppercase mb-2">
                  {activeProject.client} - {activeProject.category}
                </p>
                <h3 className="font-display font-semibold text-2xl text-slate-50 mb-3">
                  {activeProject.title}
                </h3>
                <p className="text-slate-300 leading-relaxed mb-5">
                  {activeProject.description}
                </p>

                {activeProject.details?.length ? (
                  <div className="mb-6">
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                      Key Contributions
                    </p>
                    <ul className="space-y-2">
                      {activeProject.details.map((d, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-teal/70 rounded-full mt-2 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                    Tools & Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 text-slate-200 text-xs font-mono rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-colors"
                  >
                    Discuss a similar project
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveProjectId(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
