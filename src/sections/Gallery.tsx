import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Images,
  Keyboard,
  Mail,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PUBLIC_IMAGES, type PublicImage } from "@/data/public-images";
import { shouldReduceEffects } from "@/lib/perf";
import { publicPath } from "@/lib/public-path";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const GROUP_STYLE: Record<
  PublicImage["group"],
  {
    badge: string;
    rail: string;
    mediaAccent: string;
    hoverBorder: string;
  }
> = {
  Highlights: {
    badge: "bg-teal/15 border-teal/30 text-teal",
    rail: "from-teal via-teal/35 to-transparent",
    mediaAccent: "from-teal/18 via-transparent to-transparent",
    hoverBorder: "hover:border-teal/35",
  },
  "Project Deliverables": {
    badge: "bg-cyan-300/10 border-cyan-300/25 text-cyan-100",
    rail: "from-cyan-200 via-cyan-200/30 to-transparent",
    mediaAccent: "from-cyan-200/14 via-transparent to-transparent",
    hoverBorder: "hover:border-cyan-200/25",
  },
  "Portfolio Photos": {
    badge: "bg-teal-light/10 border-teal-light/25 text-teal-light",
    rail: "from-teal-light via-teal/30 to-transparent",
    mediaAccent: "from-teal-light/14 via-transparent to-transparent",
    hoverBorder: "hover:border-teal/30",
  },
  Snapshots: {
    badge: "bg-slate-50/10 border-slate-50/15 text-slate-200",
    rail: "from-slate-200 via-slate-200/20 to-transparent",
    mediaAccent: "from-slate-50/10 via-transparent to-transparent",
    hoverBorder: "hover:border-slate-200/15",
  },
};

function styleFor(group: PublicImage["group"]) {
  return GROUP_STYLE[group];
}

type StoryCopy = {
  variant: 0 | 1 | 2;
  number: string;
  lead: string;
  bullets: string[];
  tags: string[];
  mediaAspectClass: string;
  mediaFitClass: string;
  politeNote: string;
  focus: string;
  outcome: string;
};

const STORY_GROUP_LEAD: Record<PublicImage["group"], string> = {
  Highlights:
    "The moments where clarity wins: briefings, demos, and visuals that move a decision forward.",
  "Project Deliverables":
    "Artifacts that ship: verified data, clear structure, and outputs designed for handover and reuse.",
  "Portfolio Photos":
    "The build side: screens, code, and small iterations that turn raw inputs into dependable outputs.",
  Snapshots:
    "Real delivery scenes: workshops, coordination, and on-the-ground work that keeps projects moving.",
};

const STORY_BULLETS: Record<PublicImage["group"], string[]> = {
  Highlights: [
    "Communicate the decision first, then show the evidence",
    "Keep visuals consistent: hierarchy, labels, and symbology",
    "Capture feedback quickly and iterate without breaking standards",
  ],
  "Project Deliverables": [
    "Structured data: schema, domains, rules, and metadata",
    "QA/QC gates: validation, issue tracking, and traceability",
    "Publish & package: web maps, dashboards, reports, and documentation",
  ],
  "Portfolio Photos": [
    "Automation and reproducible workflows (scripts, tools, templates)",
    "UI-heavy outputs: dashboards, web apps, and map viewers",
    "Performance mindset: clean data, fast interactions, predictable results",
  ],
  Snapshots: [
    "Delivery rhythm: meetings, training, and quick alignment",
    "Progress evidence: photos, notes, and clear action items",
    "On-site details: setup, maintenance, and practical fixes",
  ],
};

const STORY_TAGS: Record<PublicImage["group"], string[]> = {
  Highlights: ["Briefing", "Clarity", "Decision"],
  "Project Deliverables": ["QA/QC", "Handover", "Web Outputs"],
  "Portfolio Photos": ["Build", "Automation", "Dashboards"],
  Snapshots: ["Workshop", "Progress", "On-site"],
};

const STORY_MEDIA_ASPECT_CLASS: Record<PublicImage["group"], string> = {
  Highlights: "aspect-[4/3]",
  "Project Deliverables": "aspect-video",
  "Portfolio Photos": "aspect-[4/3]",
  Snapshots: "aspect-[4/3]",
};

// Use contain for the story view so nothing is unintentionally cropped.
const STORY_MEDIA_FIT_DEFAULT = "object-contain";

const STORY_FOCUS: Record<PublicImage["group"], string> = {
  Highlights:
    "Make the visual serve a decision, not just display data.",
  "Project Deliverables":
    "Ship something the next team can run tomorrow, not just a one-off export.",
  "Portfolio Photos":
    "Keep workflows reproducible and the UI genuinely usable under real constraints.",
  Snapshots:
    "Stay aligned and keep momentum, even while priorities shift.",
};

const STORY_OUTCOME: Record<PublicImage["group"], string> = {
  Highlights:
    "Faster approvals, fewer follow-ups, and clearer outcomes.",
  "Project Deliverables":
    "Trustworthy data, repeatable delivery, and confident publishing.",
  "Portfolio Photos":
    "Less rework, more confidence, and outputs that stay maintainable.",
  Snapshots: "Quick alignment, documented decisions, and confident next steps.",
};

const STORY_PER_IMAGE: Partial<
  Record<
    PublicImage["filename"],
    Partial<{
      lead: string;
      bullets: string[];
      tags: string[];
      mediaAspectClass: string;
      mediaFitClass: string;
      politeNote: string;
    }>
  >
> = {
  "hero-main.jpg": {
    lead: "Project briefing snapshot — concise visual summary that drives stakeholder decisions.",
    bullets: [
      "Summarizes objectives, constraints, and recommended actions",
      "Layered maps and clear symbology for rapid interpretation",
      "Designed to accompany a one-page briefing or slide deck for approvals",
    ],
    tags: ["Briefing", "Cartography", "Decision"],
    mediaAspectClass: "aspect-[3/2]",
    politeNote: "Available as a printable brief — objective, data sources, key findings, and recommended next steps.",
  },
  "photo12.jpg": {
    lead: "Interactive city-model demo used for scenario planning and stakeholder walkthroughs.",
    bullets: [
      "3D massing and overlay comparison for alternative designs",
      "Used to validate transport and land‑use scenarios with stakeholders",
      "Exportable views for public consultation and reporting",
    ],
    tags: ["3D", "Scenario Planning", "Visualization"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can share the rendering settings and dataset schema on request.",
  },
  "photo8.jpg": {
    lead: "Presentation snapshot showing dashboard-led storytelling and clear takeaways for decision-makers.",
    bullets: [
      "Prioritises the decision first, then shows evidence and methods",
      "Interactive widgets tied to clear KPIs and thresholds",
      "Captures feedback and tracks agreed actions after the session",
    ],
    tags: ["Dashboards", "Web GIS", "Presentation"],
    mediaAspectClass: "aspect-square",
    politeNote: "Can produce a short slide deck summarizing the demo and follow-ups.",
  },
  "photo1.jpg": {
    lead: "Design-review image illustrating corridor and land‑use analysis used to align planning teams.",
    bullets: [
      "Spatial layers showing buffers, overlaps and impact zones",
      "Used to test alternative alignment and measure implications",
      "Includes notes for next-step surveys and validation",
    ],
    tags: ["Corridor Analysis", "Land Use", "Planning"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can provide the cartographic style guide and layer list if required.",
  },
  "photo2.jpg": {
    lead: "Operations monitoring — dashboard with live map overlays for timely checks and alerts.",
    bullets: [
      "Real-time feeds and threshold alerts for operational teams",
      "Time-series charts linked to map selections",
      "Designed for quick triage and escalation",
    ],
    tags: ["Monitoring", "Operations", "Dashboards"],
    mediaAspectClass: "aspect-square",
    politeNote: "Dashboard widgets can be adapted to different user roles on demand.",
  },
  "photo3.jpg": {
    lead: "Development snapshot showing automation and reproducible pipelines for data processing.",
    bullets: [
      "Scripted ETL steps with version control and tests",
      "Automated exports and packaging for publishing",
      "Designed to reduce manual steps and prevent regressions",
    ],
    tags: ["Automation", "Pipelines", "Testing"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can share representative scripts and CI recommendations.",
  },
  "1738948364829.jpg": {
    lead: "Multi‑screen analysis setup used for cross‑checking cartography, QA/QC, and result sign‑off.",
    bullets: [
      "Side‑by‑side views for visual QA and data validation",
      "Facilitates rapid comparison of outputs before publishing",
      "Supports multi‑role review (cartographer, analyst, reviewer)",
    ],
    tags: ["QA/QC", "Review", "Cartography"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can provide the QA checklist and acceptance criteria used in reviews.",
  },
  "Screenshot 2026-02-16 011055.jpg": {
    lead: "Developer environment used for model tuning, testing, and runtime checks.",
    bullets: [
      "Local test runs with sample datasets and logs",
      "Controlled experiments for data‑processing parameters",
      "Repeatable runs to reproduce outputs for verification",
    ],
    tags: ["Development", "Data Processing", "Testing"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can outline the core scripts and test cases upon request.",
  },
  "Screenshot 2026-02-16 010854.jpg": {
    lead: "Network and rack setup for field gateways, ensuring reliable telemetry and power.",
    bullets: [
      "Proper labelling and cable management for field reliability",
      "Redundancy and monitoring points for telemetry health",
      "Part of the field‑deployment acceptance checklist",
    ],
    tags: ["Field Hardware", "Telemetry", "Infrastructure"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can share the field‑deployment checklist and connector types.",
  },
  "Screenshot 2026-02-16 010959.jpg": {
    lead: "Patch‑panel verification and labeling performed as part of system handover.",
    bullets: [
      "Cable tracing and port verification steps",
      "Ensures repeatable connectivity for field devices",
      "Documented for the operations handover pack",
    ],
    tags: ["Testing", "Handover", "Documentation"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can export the acceptance checklist used during handover.",
  },
  "WhatsApp Image 2026-02-01 at 8.47.19 PM.jpeg": {
    lead: "Hands‑on workshop where workflows are demoed and participants validate steps.",
    bullets: [
      "Interactive exercises that replicate field‑to‑office workflows",
      "Collects immediate feedback to prioritise fixes",
      "Helps teams learn operational procedures and QA checks",
    ],
    tags: ["Workshop", "Training", "Validation"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can provide a short workshop agenda and sample exercises.",
  },
  "WhatsApp Image 2026-02-15 at 05.05.18.jpeg": {
    lead: "Delivery review: maps, story, and actions consolidated for stakeholder sign‑off.",
    bullets: [
      "Confirmed deliverables and acceptance criteria",
      "Captured action items, owners, and timelines",
      "Prepared final artefacts for handover",
    ],
    tags: ["Delivery", "Review", "Stakeholders"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can summarise review minutes into a one‑page decision log.",
  },
  "WhatsApp Image 2026-02-15 at 05.05.18 (2).jpeg": {
    lead: "Boardroom setup: visuals optimised for stakeholder briefings and printed handouts.",
    bullets: [
      "High‑contrast visuals for projector and print",
      "Key maps highlighted with clear legends and notes",
      "Designed to keep the conversation focused on decisions",
    ],
    tags: ["Presentation", "Boardroom", "Visuals"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can export presentation‑ready slides from the gallery images.",
  },
  "WhatsApp Image 2026-02-15 at 05.05.18 (5).jpeg": {
    lead: "Workshop room prepared for demos and participant exercises.",
    bullets: [
      "Workstations ready with sample datasets and dashboards",
      "Facilitates small‑group validation and hands‑on testing",
      "Collects observations for immediate improvement cycles",
    ],
    tags: ["Workshop", "Setup", "Demo"],
    mediaAspectClass: "aspect-[21/10]",
    politeNote: "I can share the demo dataset and step‑by‑step exercise notes.",
  },
  "WhatsApp Image 2026-02-15 at 2.31.17 AM.jpeg": {
    lead: "Team sync to review findings, assign actions, and agree timelines.",
    bullets: [
      "Short, focused standups to remove blockers",
      "Assigns clear owners and deadlines for follow‑ups",
      "Tracks progress with lightweight checklists",
    ],
    tags: ["Coordination", "Planning", "Team"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can create a sample action log template used in these syncs.",
  },
  "WhatsApp Image 2026-02-15 at 2.31.17 AM (1).jpeg": {
    lead: "Event snapshot capturing stakeholder conversations and follow‑up points.",
    bullets: [
      "Useful for documenting outreach and next steps",
      "Helps identify potential partners and contacts",
      "Feeds into post‑event communication plans",
    ],
    tags: ["Event", "Engagement", "Networking"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can extract and format key takeaways for communications.",
  },
  "WhatsApp Image 2026-02-15 at 2.31.18 AM.jpeg": {
    lead: "Milestone moment documenting visible project progress and presence.",
    bullets: [
      "Visual marker for reporting and stakeholder updates",
      "Useful when tracking timelines and delivery milestones",
    ],
    tags: ["Milestone", "Progress", "Reporting"],
    mediaAspectClass: "aspect-square",
    politeNote: "This image can be used in status reports and monthly updates.",
  },
  "WhatsApp Image 2026-02-15 at 2.31.19 AM.jpeg": {
    lead: "Workshop session focused on rapid prototyping and prioritised changes.",
    bullets: [
      "Fast feedback loops that feed backlog refinements",
      "Immediate prioritisation of high‑impact fixes",
    ],
    tags: ["Workshop", "Iteration", "Feedback"],
    mediaAspectClass: "aspect-[20/9]",
    politeNote: "I can produce a short change log based on workshop outcomes.",
  },
  "WhatsApp Image 2026-02-15 at 2.31.19 AM (1).jpeg": {
    lead: "Field visit photo giving on‑site context used for validation and reporting.",
    bullets: [
      "Photographic evidence used to verify features on mapping layers",
      "Supports QA entries and audit trails",
    ],
    tags: ["Field Visit", "Validation", "Evidence"],
    mediaAspectClass: "aspect-square",
    politeNote: "If available, I can attach geotagged notes to this image.",
  },
  "WhatsApp Image 2026-02-15 at 3.19.04 AM.jpeg": {
    lead: "On‑site coordination and reporting that keeps delivery measurable and auditable.",
    bullets: [
      "Routine checkpoints that reduce late surprises",
      "Clear decisions and assigned actions after each visit",
      "Documented findings that feed the QA process",
    ],
    tags: ["Coordination", "Reporting", "Operations"],
    politeNote: "I can provide the visit checklist and sample report used on site.",
  },
  "WhatsApp Image 2026-02-15 at 3.19.23 AM.jpeg": {
    lead: "Project wrap‑up snapshot used for final handover and documentation.",
    bullets: [
      "Final checks and acceptance items recorded",
      "Packaged deliverables (maps, metadata, and access rights)",
    ],
    tags: ["Handover", "Documentation", "Closeout"],
    mediaAspectClass: "aspect-square",
    politeNote: "I can prepare a one‑page handover summary for any project.",
  },
};

function buildStoryCopy(img: PublicImage, index: number): StoryCopy {
  const variant = (index % 3) as 0 | 1 | 2;
  const number = String(index + 1).padStart(2, "0");

  const politeNote =
    img.group === "Project Deliverables"
      ? "If you would like, I can provide a one-page breakdown: objective, data sources, processing steps, QA/QC checks, and how it was published."
      : "If you would like, I can add the context in one sentence: objective, setting, and outcome.";

  const lead = STORY_PER_IMAGE[img.filename]?.lead ?? STORY_GROUP_LEAD[img.group];
  const bullets = STORY_PER_IMAGE[img.filename]?.bullets ?? STORY_BULLETS[img.group];
  const tags = STORY_PER_IMAGE[img.filename]?.tags ?? STORY_TAGS[img.group];
  const mediaAspectClass =
    STORY_PER_IMAGE[img.filename]?.mediaAspectClass ?? STORY_MEDIA_ASPECT_CLASS[img.group];
  const mediaFitClass = STORY_PER_IMAGE[img.filename]?.mediaFitClass ?? STORY_MEDIA_FIT_DEFAULT;
  const politeNoteOut = STORY_PER_IMAGE[img.filename]?.politeNote ?? politeNote;

  return {
    variant,
    number,
    lead,
    bullets,
    tags,
    mediaAspectClass,
    mediaFitClass,
    politeNote: politeNoteOut,
    focus: STORY_FOCUS[img.group],
    outcome: STORY_OUTCOME[img.group],
  };
}

const STORY_BY_INDEX: StoryCopy[] = PUBLIC_IMAGES.map(buildStoryCopy);

export default function Gallery() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reduceEffects = useMemo(() => shouldReduceEffects(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const safeIndex = Math.max(0, Math.min(activeIndex, Math.max(0, PUBLIC_IMAGES.length - 1)));
  const activeImage = PUBLIC_IMAGES[safeIndex];
  const activeMeta = activeImage ? STORY_BY_INDEX[safeIndex] : null;
  const activeStyle = activeImage ? styleFor(activeImage.group) : null;

  const openAt = (index: number) => {
    if (PUBLIC_IMAGES.length === 0) return;
    setActiveIndex(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const prev = () => {
    if (PUBLIC_IMAGES.length === 0) return;
    setActiveIndex((i) => (i - 1 + PUBLIC_IMAGES.length) % PUBLIC_IMAGES.length);
  };

  const next = () => {
    if (PUBLIC_IMAGES.length === 0) return;
    setActiveIndex((i) => (i + 1) % PUBLIC_IMAGES.length);
  };

  const onLightboxTouchStart = (e: React.TouchEvent) => {
    const t = e.touches?.[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onLightboxTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    // Ignore if it looks like a scroll or a small gesture.
    if (Math.abs(dx) < 55) return;
    if (Math.abs(dy) > 90) return;

    if (dx < 0) next();
    else prev();
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const list = listRef.current;
    if (!section || !heading || !list) return;

    if (reduceEffects) return;

    const ctx = gsap.context(() => {
      const headingItems = heading.querySelectorAll("[data-anim]");
      gsap.fromTo(
        headingItems,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const items = Array.from(list.querySelectorAll<HTMLElement>(".story-item"));
      items.forEach((item) => {
        const dir = item.dataset.dir === "right" ? 1 : -1;
        const rail = item.querySelector<HTMLElement>(".story-rail");
        const media = item.querySelector<HTMLElement>(".story-media");
        const copy = item.querySelector<HTMLElement>(".story-copy");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        if (rail) {
          tl.fromTo(
            rail,
            { scaleY: 0, transformOrigin: "top" },
            { scaleY: 1, duration: 0.9, ease: "power2.out" },
            0
          );
        }

        if (media) {
          tl.fromTo(
            media,
            { x: 28 * dir, y: 12, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            0.02
          );
        }

        if (copy) {
          tl.fromTo(
            copy,
            { x: -18 * dir, y: 10, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
            0.08
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reduceEffects]);

  useEffect(() => {
    if (!isOpen) return;
    // Don't hijack arrow keys when a video is active; let the native player use them.
    if (activeImage?.kind === "video") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (PUBLIC_IMAGES.length === 0) return;
        setActiveIndex((i) => (i - 1 + PUBLIC_IMAGES.length) % PUBLIC_IMAGES.length);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (PUBLIC_IMAGES.length === 0) return;
        setActiveIndex((i) => (i + 1) % PUBLIC_IMAGES.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, activeImage?.kind]);

  return (
    <section ref={sectionRef} id="gallery" className="relative bg-navy z-[45] py-24">
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
          <div className="gallery-aurora" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
          <div className="relative z-[1] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <span
                  data-anim
                  className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
                >
                  Gallery
                </span>

                <h2
                  data-anim
                  className="font-display font-bold text-display-2 text-slate-50 mb-4"
                >
                  Behind the layers. Built for clarity.
                </h2>

                <p data-anim className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                  A curated, image-first walkthrough of how I deliver GIS work in practice: field
                  validation, enterprise geodatabase design, remote sensing monitoring, and
                  stakeholder-ready web outputs. Each entry highlights what you are looking at,
                  the decision it supports, and the standards used to keep results consistent.
                </p>

                <p data-anim className="text-sm text-slate-400 leading-relaxed mt-4 max-w-3xl">
                  If you would like deeper context on any item, I can summarize it in a simple
                  format: objective, data sources, tools, QA/QC checks, and the final outcome.
                </p>

                <div data-anim className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openAt(0)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4" />
                    Start Guided View
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore Projects
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </button>
                </div>

                <div data-anim className="mt-7 flex items-start gap-3 text-sm text-slate-400">
                  <Keyboard className="w-4 h-4 text-teal mt-0.5" />
                  <p className="leading-relaxed">
                    Tip: open any image full-screen, then use your arrow keys to move through the
                    gallery.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div data-anim className="bg-slate-900/35 border border-slate-700/50 rounded-sm p-5">
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-4">
                    What You Will Find
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Workflow className="w-5 h-5 text-teal mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-200 font-medium">Field to Office Workflow</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Validation gates, review cycles, and clean publishing practices.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-teal mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-200 font-medium">Quality and Traceability</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          QA/QC checks, topology rules, and consistent cartographic structure.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-teal mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-200 font-medium">Stakeholder Presentation</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Visual clarity for dashboards, web apps, and decision-ready reporting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story List (not grouped in a grid) */}
        <div ref={listRef} className="space-y-12">
          {PUBLIC_IMAGES.map((img, idx) => {
            const meta = STORY_BY_INDEX[idx];
            const st = styleFor(img.group);
            const isReversed = idx % 2 === 1;
            const isVariantA = meta.variant === 0;
            const isVariantB = meta.variant === 1;
            const isVariantC = meta.variant === 2;
            const isVideo = img.kind === "video";
            const posterSrc = isVideo && img.poster ? publicPath(img.poster) : null;
            const previewSrc = isVideo ? posterSrc : publicPath(img.filename);

            return (
              <article
                key={`${img.filename}-${idx}`}
                data-dir={isReversed ? "right" : "left"}
                className={cn(
                  "story-item group relative overflow-hidden bg-slate-800/15 hover:bg-slate-800/20 border border-slate-700/30 rounded-sm p-5 sm:p-6 transition-colors duration-300",
                  st.hoverBorder
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "story-rail absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b opacity-80 rounded-l-sm pointer-events-none",
                    st.rail
                  )}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <figure
                    className={cn(
                      "story-media lg:col-span-8",
                      isReversed ? "lg:order-2" : "lg:order-1"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openAt(idx)}
                      className={cn(
                        "group/media relative w-full overflow-hidden rounded-sm border border-slate-700/40 bg-slate-900/20 shadow-xl hover:shadow-glow cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 transition-colors transition-shadow",
                        st.hoverBorder,
                        meta.mediaAspectClass
                      )}
                      aria-label={`Open ${isVideo ? "video" : "image"}: ${img.title}`}
                    >
                      {meta.mediaFitClass === "object-contain" ? (
                        <div className="absolute inset-0 p-1.5 sm:p-2.5 transition-transform duration-700 ease-out group-hover/media:scale-[1.01]">
                          {previewSrc ? (
                            <img
                              src={previewSrc}
                              alt={img.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.35)]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900/35 border border-slate-700/40 text-slate-200">
                              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-navy/55 border border-slate-700/50 font-mono text-xs">
                                <Play className="w-4 h-4 text-teal" />
                                Video
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {previewSrc ? (
                            <img
                              src={previewSrc}
                              alt={img.title}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.03] saturate-[1.02]"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/35 border border-slate-700/40 text-slate-200">
                              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-navy/55 border border-slate-700/50 font-mono text-xs">
                                <Play className="w-4 h-4 text-teal" />
                                Video
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {/* Overlay caption on the image (transparent + animated) */}
                      <div className="absolute left-0 bottom-0 w-full px-4 py-3 bg-gradient-to-t from-black/65 via-black/30 to-transparent backdrop-blur-sm opacity-0 translate-y-3 group-hover/media:opacity-100 group-hover/media:translate-y-0 focus-visible:opacity-100 transition-all duration-300 ease-out">
                        <p className="text-sm font-semibold text-slate-50 leading-snug truncate">{img.title}</p>
                        <p className="mt-1 text-xs text-slate-300 line-clamp-2">{meta.lead}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {meta.tags.slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-navy/40 border border-slate-700/30 text-xs text-slate-300 rounded-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover/media:opacity-35 transition-opacity duration-500",
                          st.mediaAccent
                        )}
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-teal/25"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute left-3 top-3 flex items-center gap-2 pointer-events-none"
                      >
                        <span className="inline-flex px-2.5 py-1 rounded-sm bg-navy/65 border border-slate-700/60 font-mono text-xs text-slate-200">
                          {meta.number}/{String(PUBLIC_IMAGES.length).padStart(2, "0")}
                        </span>
                      </div>

                      <div aria-hidden="true" className="absolute right-3 top-3 pointer-events-none">
                        <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-navy/65 border border-slate-700/60 font-mono text-xs text-slate-200 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500">
                          {isVideo ? (
                            <>
                              <Play className="w-3.5 h-3.5 text-teal" />
                              Play
                            </>
                          ) : (
                            <>
                              <Images className="w-3.5 h-3.5 text-teal" />
                              View
                            </>
                          )}
                        </span>
                      </div>

                      {isVideo ? (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className="flex items-center gap-2 px-4 py-2 rounded-sm bg-navy/65 border border-slate-700/60 text-slate-50 font-mono text-xs opacity-0 group-hover/media:opacity-100 transition-opacity duration-500">
                            <Play className="w-4 h-4 text-teal" />
                            Play video
                          </div>
                        </div>
                      ) : null}
                    </button>
                    <figcaption className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-200 font-medium leading-snug truncate">
                          {img.title}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500 truncate">
                          {img.group}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                        <span className="inline-flex items-center gap-2">
                          {isVideo ? (
                            <>
                              <Play className="w-4 h-4 text-teal/80" />
                              Play video
                            </>
                          ) : (
                            <>
                              <Images className="w-4 h-4 text-teal/80" />
                              Inspect details
                            </>
                          )}
                        </span>
                        <span className="hidden sm:inline text-slate-700">|</span>
                        <span className="sm:hidden">Tap to open</span>
                        <span className="hidden sm:inline">Arrow keys for next/prev</span>
                      </div>
                    </figcaption>
                  </figure>

                  <div
                    className={cn(
                      "story-copy lg:col-span-4",
                      isReversed ? "lg:order-1" : "lg:order-2"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-sm border font-mono text-[11px] tracking-[0.14em] uppercase",
                            st.badge
                          )}
                        >
                          {img.group}
                        </span>
                        <span className="font-mono text-xs text-slate-500">#{meta.number}</span>
                      </div>
                      <p className="font-mono text-xs text-slate-500">
                        {idx + 1} / {PUBLIC_IMAGES.length}
                      </p>
                    </div>

                    <h3 className="font-display font-semibold text-xl text-slate-50 mb-3">
                      {img.title}
                    </h3>

                    <p className="text-slate-300 leading-relaxed">
                      {meta.lead}
                    </p>

                    {isVariantA ? (
                      <>
                        <div className="mt-5">
                          <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                            What it demonstrates
                          </p>
                          <ul className="space-y-2">
                            {meta.bullets.map((b) => (
                              <li key={b} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-teal/70 rounded-full mt-2 flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {meta.tags.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 text-slate-300 text-xs font-mono rounded-sm"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {isVariantB ? (
                      <>
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-slate-800/25 border border-slate-700/30 rounded-sm p-4">
                            <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                              Focus
                            </p>
                            <p className="text-sm text-slate-300">
                              {meta.focus}
                            </p>
                          </div>
                          <div className="bg-slate-800/25 border border-slate-700/30 rounded-sm p-4">
                            <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                              Outcome
                            </p>
                            <p className="text-sm text-slate-300">
                              {meta.outcome}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                            Presentation notes
                          </p>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {meta.politeNote}
                          </p>
                        </div>
                      </>
                    ) : null}

                    {isVariantC ? (
                      <>
                        <div className="mt-5 bg-teal/10 border border-teal/20 rounded-sm p-4">
                          <p className="font-mono text-xs text-teal uppercase tracking-wide mb-2">
                            A polite note
                          </p>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {meta.politeNote}
                          </p>
                        </div>

                        <div className="mt-5 bg-slate-900/25 border border-slate-700/40 rounded-sm p-4">
                          <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                            Why it matters
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {meta.outcome}
                          </p>
                        </div>

                        <div className="mt-5">
                          <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                            Quick checklist
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {meta.tags.map((t) => (
                              <span
                                key={t}
                                className="px-3 py-1.5 bg-slate-800/35 border border-slate-700/40 text-slate-300 text-xs rounded-sm"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openAt(idx)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {isVideo ? <Play className="w-4 h-4" /> : <Images className="w-4 h-4" />}
                        {isVideo ? "Play Video" : "View Image"}
                      </button>

                      {img.group === "Project Deliverables" ? (
                        <button
                          type="button"
                          onClick={() => navigate("/projects")}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                        >
                          Related Projects
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : close())}>
        <DialogContent
          className="p-0 sm:max-w-6xl bg-navy border border-slate-700/50 overflow-hidden"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {activeImage?.title ?? "Media preview"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeImage ? `${activeImage.group} · ${safeIndex + 1} / ${PUBLIC_IMAGES.length}` : ""}
          </DialogDescription>
          {activeImage && activeMeta && activeStyle ? (
            <div className="relative">
              {/* Top Bar */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/60 bg-navy/90">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-slate-50 truncate">
                    {activeImage.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-sm border font-mono text-[11px] tracking-[0.14em] uppercase",
                        activeStyle.badge
                      )}
                    >
                      {activeImage.group}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {safeIndex + 1} / {PUBLIC_IMAGES.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="w-9 h-9 rounded-sm border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="w-9 h-9 rounded-sm border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="w-9 h-9 rounded-sm border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Image */}
                <div
                  className="lg:col-span-8 bg-black/30 flex items-center justify-center"
                  onTouchStart={activeImage.kind === "video" ? undefined : onLightboxTouchStart}
                  onTouchEnd={activeImage.kind === "video" ? undefined : onLightboxTouchEnd}
                >
                  <div className="relative w-full flex items-center justify-center p-3 sm:p-5">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-10",
                        activeStyle.mediaAccent
                      )}
                    />
                    {activeImage.kind === "video" ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster={activeImage.poster ? publicPath(activeImage.poster) : undefined}
                        className="relative w-full max-h-[78vh] object-contain drop-shadow-[0_26px_55px_rgba(0,0,0,0.55)]"
                      >
                        <source src={publicPath(activeImage.filename)} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={publicPath(activeImage.filename)}
                        alt={activeImage.title}
                        className="relative w-full max-h-[78vh] object-contain drop-shadow-[0_26px_55px_rgba(0,0,0,0.55)]"
                      />
                    )}
                  </div>
                </div>

                {/* Info */}
                <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800/60 bg-navy/90">
                  <div className="p-4 sm:p-5 max-h-[46vh] lg:max-h-[78vh] overflow-y-auto">
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                      Overview
                    </p>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {activeMeta.lead}
                    </p>

                    <div className="mt-5">
                      <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                        Key points
                      </p>
                      <ul className="space-y-2">
                        {activeMeta.bullets.map((b) => (
                          <li key={b} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-teal/70 rounded-full mt-2 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {activeMeta.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-slate-800/35 border border-slate-700/40 text-slate-300 text-xs font-mono rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 bg-slate-900/30 border border-slate-700/40 rounded-sm p-4">
                      <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-2">
                        Notes
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeMeta.politeNote}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={publicPath(activeImage.filename)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Open original
                        <ArrowUpRight className="w-4 h-4" />
                      </a>

                      {activeImage.group === "Project Deliverables" ? (
                        <button
                          type="button"
                          onClick={() => {
                            close();
                            setTimeout(() => navigate("/projects"), 0);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                        >
                          Related Projects
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setTimeout(() => navigate("/contact"), 0);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </button>
                    </div>

                    <div className="mt-6 flex items-start gap-3 text-xs text-slate-500 font-mono">
                      <Keyboard className="w-4 h-4 text-teal mt-0.5" />
                      <p className="leading-relaxed">
                        {activeImage.kind === "video"
                          ? "Tip: use the built-in video controls, and the buttons above to move between items."
                          : "Desktop: use your arrow keys. Mobile: swipe left/right on the image."}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
