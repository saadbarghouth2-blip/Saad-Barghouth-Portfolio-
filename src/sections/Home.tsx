import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Cog,
  Database,
  GalleryHorizontal,
  MapPinned,
  Satellite,
  Sparkles,
} from "lucide-react";

import Hero from "@/sections/Hero";
import { shouldReduceEffects } from "@/lib/perf";
import { publicPath } from "@/lib/public-path";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function FramedImage({
  src,
  alt,
  aspectClass = "aspect-[3/2]",
  accentClass = "from-teal/18 via-transparent to-transparent",
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  aspectClass?: string;
  accentClass?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-sm border border-slate-700/40 bg-slate-900/20 shadow-xl",
        aspectClass,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent" />
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", accentClass)} />
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-contain p-2 sm:p-3 drop-shadow-[0_22px_40px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out group-hover:scale-[1.015]",
          imgClassName
        )}
        loading="lazy"
        decoding="async"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-teal/25"
      />
    </div>
  );
}

function HomeOverview() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !cards) return;

    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      const headingItems = heading.querySelectorAll("[data-anim]");
      gsap.fromTo(
        headingItems,
        { y: 16, opacity: 0 },
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

      const items = cards.querySelectorAll<HTMLElement>("[data-card]");
      gsap.fromTo(
        items,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: cards,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home-overview"
      className="relative bg-navy z-[35] py-24 scroll-mt-24"
    >
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div
          ref={headingRef}
          className="relative mb-12 overflow-hidden rounded-sm border border-slate-700/40 bg-slate-900/20"
        >
          <div className="absolute inset-0 grid-overlay opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_30%,rgba(46,196,182,0.16),transparent_55%)]" />
          <div className="relative z-[1] p-6 sm:p-10">
            <span
              data-anim
              className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
            >
              Overview
            </span>
            <h2
              data-anim
              className="font-display font-bold text-display-2 text-slate-50 mb-4"
            >
              GIS delivery that stays clean, consistent, and usable.
            </h2>
            <p
              data-anim
              className="text-lg text-slate-200 leading-relaxed max-w-4xl"
            >
              I help teams turn spatial data into decision-ready products: structured geodatabases,
              QA/QC you can trust, and web maps and dashboards that stakeholders can actually use.
              The goal is simple: reduce rework, keep outputs consistent, and make handover easy.
            </p>

            <div data-anim className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Explore Work
              </button>
              <button
                type="button"
                onClick={() => navigate("/gallery")}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <GalleryHorizontal className="w-4 h-4" />
                See Visuals
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div ref={cardsRef} className="lg:col-span-7 space-y-5">
            <div
              data-card
              className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center">
                  <Database className="w-6 h-6 text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-lg text-slate-50">
                    Data modeling that scales
                  </p>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Domains, subtypes, rules, and relationship logic designed for maintainability.
                    The schema stays readable for new team members and reliable for publishing.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-card
              className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-lg text-slate-50">
                    QA/QC that reduces rework
                  </p>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Topology checks, attribute validation, and issue tracking that help teams spot
                    problems early and ship cleaner datasets.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-card
              className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center">
                  <MapPinned className="w-6 h-6 text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-lg text-slate-50">
                    Maps built for stakeholders
                  </p>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Clear symbology, smart labeling, and web delivery that makes insights easy to
                    read and easy to act on.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-6">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                In Practice
              </p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Short moments of delivery: stakeholder reviews, training sessions, and real-world
                handover.
              </p>
              <div className="mt-5">
                <FramedImage
                  src={publicPath("photo8.jpg")}
                  alt="Professional GIS collaboration and project briefing"
                  aspectClass="aspect-[3/2]"
                  accentClass="from-teal/18 via-transparent to-transparent"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["ArcGIS Pro", "ArcGIS Online", "Topology", "Dashboards", "StoryMaps"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 bg-slate-800/35 border border-slate-700/40 text-slate-200 text-xs font-mono rounded-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FocusKey = "enterprise" | "sensing" | "automation";

function HomeFocus() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<FocusKey>("enterprise");

  const focusItems = useMemo(
    () => [
      {
        key: "enterprise" as const,
        label: "Enterprise GIS",
        icon: Database,
        accent: "from-teal/18 via-transparent to-transparent",
        title: "Enterprise GIS that stays organized",
        body: "I design schemas and workflows that are consistent across teams: predictable layer structure, clean attribution, and publishing discipline that avoids messy handovers.",
        points: [
          "Geodatabase design: domains, subtypes, rules, and relationship logic",
          "QA/QC gates: topology checks, attribute validation, exception tracking",
          "Publishing-ready layers with documentation and repeatable steps",
        ],
        tags: ["Geodatabases", "ArcGIS Enterprise", "Standards"],
        cta: { label: "See Projects", to: "/projects" },
      },
      {
        key: "sensing" as const,
        label: "Remote Sensing",
        icon: Satellite,
        accent: "from-emerald-400/14 via-transparent to-transparent",
        title: "Monitoring and change insight",
        body: "From multi-temporal analysis to reporting, I focus on outputs that explain change clearly, with checks that keep results defensible and easy to communicate.",
        points: [
          "Pre-processing and alignment for reliable comparison",
          "Change detection and clear reporting for stakeholders",
          "Packaging results for dashboards, maps, and decision notes",
        ],
        tags: ["Sentinel/Landsat", "Change Detection", "Reporting"],
        cta: { label: "Browse Work", to: "/projects" },
      },
      {
        key: "automation" as const,
        label: "Automation",
        icon: Cog,
        accent: "from-cyan-400/14 via-transparent to-transparent",
        title: "Automation that saves hours",
        body: "I automate repetitive GIS processing and QA/QC steps so teams can focus on analysis and decisions, not manual cleanup.",
        points: [
          "Python tooling for validation, schema checks, and reporting",
          "Batch processing pipelines for consistent outputs",
          "Simple documentation so others can run and maintain the workflow",
        ],
        tags: ["Python", "ArcPy", "QA/QC"],
        cta: { label: "View Gallery", to: "/gallery" },
      },
    ],
    []
  );

  const activeItem = focusItems.find((i) => i.key === active) ?? focusItems[0];
  const ActiveIcon = activeItem.icon;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      const items = heading.querySelectorAll("[data-anim]");
      gsap.fromTo(
        items,
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="home-focus" className="relative bg-navy z-[35] py-24">
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div ref={headingRef} className="mb-12">
          <span
            data-anim
            className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
          >
            Focus
          </span>
          <h2
            data-anim
            className="font-display font-bold text-display-2 text-slate-50 mb-4"
          >
            Three pillars that shape every delivery.
          </h2>
          <p data-anim className="text-lg text-slate-200 leading-relaxed max-w-4xl">
            Clean data structure, clear monitoring insight, and automation that keeps QA/QC fast and
            consistent. Pick a pillar to see what it looks like in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-5">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-4">
                Choose a pillar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {focusItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === active;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setActive(item.key);
                        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 420px)').matches) {
                          window.dispatchEvent(new CustomEvent('open-mobile-nav', { detail: { to: item.cta.to } }));
                        }
                      }}
                      className={cn(
                        "relative group w-full flex items-start gap-4 px-4 py-4 rounded-md border transition-transform duration-200 shadow-sm",
                        isActive
                          ? "bg-teal/10 border-teal/30 text-teal shadow-[0_8px_30px_rgba(46,196,182,0.06)]"
                          : "bg-slate-900/20 border-slate-700/50 text-slate-200 hover:-translate-y-0.5 hover:shadow-glow"
                      )}
                    >
                      <span
                        className={cn(
                          "flex-shrink-0 w-11 h-11 rounded-md border flex items-center justify-center transition-colors duration-200",
                          isActive ? "bg-teal/10 border-teal/30 text-teal" : "bg-slate-900/30 border-slate-700/50 text-slate-300"
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </span>

                      <span className="min-w-0">
                        <span className="block font-display font-semibold text-sm leading-tight">{item.label}</span>
                        <span className="block text-xs text-slate-400 mt-1 line-clamp-2">{item.title}</span>
                      </span>

                      <ArrowUpRight className={cn("ml-auto mt-1 w-4 h-4 transition-all", isActive ? "text-teal" : "text-slate-500 group-hover:text-teal")} />

                      {/* subtle accent stripe when active */}
                      {isActive ? (
                        <span aria-hidden className="absolute -left-1 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-teal/60" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-5">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-4">
                A real moment
              </p>
              <FramedImage
                src={publicPath("WhatsApp Image 2026-02-15 at 3.19.23 AM.jpeg")}
                alt="Professional training and team delivery session"
                aspectClass="aspect-[4/3]"
                accentClass={activeItem.accent}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              key={activeItem.key}
              className="rounded-sm border border-slate-700/45 bg-slate-900/20 p-6 sm:p-8 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-teal tracking-[0.12em] uppercase">
                    Selected pillar
                  </p>
                  <h3 className="mt-2 font-display font-semibold text-2xl text-slate-50">
                    {activeItem.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                  <ActiveIcon className="w-6 h-6 text-teal" />
                </div>
              </div>

              <p className="mt-4 text-slate-300 leading-relaxed">
                {activeItem.body}
              </p>

              <div className="mt-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                  What you get
                </p>
                <ul className="space-y-2">
                  {activeItem.points.map((p) => (
                    <li key={p} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-teal/70 rounded-full mt-2 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {activeItem.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 bg-slate-800/35 border border-slate-700/40 text-slate-200 text-xs font-mono rounded-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(activeItem.cta.to)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  {activeItem.cta.label}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Discuss a project
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeNext() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !cards) return;

    if (shouldReduceEffects()) return;

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

      const items = cards.querySelectorAll<HTMLElement>("[data-card]");
      gsap.fromTo(
        items,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: cards,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="home-next" className="relative bg-navy z-[35] py-24">
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        <div ref={headingRef} className="mb-12">
          <span
            data-anim
            className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
          >
            Next
          </span>
          <h2
            data-anim
            className="font-display font-bold text-display-2 text-slate-50 mb-4"
          >
            Want to see the details?
          </h2>
          <p data-anim className="text-lg text-slate-200 leading-relaxed max-w-4xl">
            Browse project write-ups, open visual walkthroughs, or jump straight to contact. I keep
            the story simple: objective, method, QA/QC checks, and the outcome.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div
            data-card
            className="lg:col-span-5 rounded-sm border border-slate-700/45 bg-slate-900/20 overflow-hidden"
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                    Portfolio
                  </p>
                  <p className="mt-2 font-display font-semibold text-xl text-slate-50">
                    Work and Deliverables
                  </p>
                </div>
                <div className="w-11 h-11 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center">
                  <Blocks className="w-5 h-5 text-teal" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                A curated list of projects: enterprise geodatabases, field workflows, web GIS apps,
                dashboards, and monitoring.
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Go to Work
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            data-card
            className="lg:col-span-4 rounded-sm border border-slate-700/45 bg-slate-900/20 overflow-hidden"
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                    Visuals
                  </p>
                  <p className="mt-2 font-display font-semibold text-xl text-slate-50">
                    Gallery Walkthrough
                  </p>
                </div>
                <div className="w-11 h-11 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center">
                  <GalleryHorizontal className="w-5 h-5 text-teal" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Image-first context: behind-the-scenes delivery moments, reviews, training, and
                packaging notes.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate("/gallery")}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Open Gallery
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div data-card className="lg:col-span-3 rounded-sm border border-slate-700/45 bg-slate-900/20 overflow-hidden">
            <div className="p-6 sm:p-7">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                Quick
              </p>
              <p className="mt-2 font-display font-semibold text-xl text-slate-50">
                Contact
              </p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                If you want a one-page summary of any deliverable: objective, data sources,
                workflow steps, QA/QC, and output formats.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in touch
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-5xl">
          <FramedImage
            src={publicPath("WhatsApp Image 2026-02-15 at 05.05.18 (5).jpeg")}
            alt="Client review meeting and project discussion"
            aspectClass="aspect-[21/10]"
            accentClass="from-teal/14 via-transparent to-transparent"
            imgClassName="p-1 sm:p-2"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <HomeOverview />
      <HomeFocus />
      <HomeNext />
    </>
  );
}
