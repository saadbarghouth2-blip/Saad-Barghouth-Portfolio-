import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowUpRight,
  Box,
  CheckCircle,
  Clock,
  Cog,
  FileText,
  Layers,
  MessagesSquare,
  Rocket,
  Search,
  ShieldCheck,
} from 'lucide-react';

import { shouldReduceEffects } from '@/lib/perf';
import { cn } from '@/lib/utils';

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  details: string[];
  deliverables: string[];
  tools: string[];
  duration: string;
  image: string;
  icon: typeof Search;
};

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'Scope, constraints, and the data reality check. Align on what "done" means before building anything.',
    duration: '1-3 days',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1400',
    details: ['Requirements', 'Data inventory', 'Risks', 'Plan'],
    deliverables: [
      'Requirements brief (scope + success criteria)',
      'Data inventory: sources, formats, gaps',
      'Risk list + mitigation options',
      'Delivery plan with milestones and review checkpoints',
    ],
    tools: ['Workshops', 'Data audit', 'ArcGIS Pro', 'Docs'],
    icon: Search,
  },
  {
    number: '02',
    title: 'Model',
    description: 'Build a schema that stays clean under real edits: domains, subtypes, rules, and relationships.',
    duration: '2-6 days',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1400',
    details: ['Schema', 'Topology', 'Rules', 'Validation'],
    deliverables: [
      'Geodatabase schema (diagram + structure)',
      'Domains, subtypes, relationship logic',
      'Topology + validation rules for integrity',
      'Data dictionary and naming conventions',
    ],
    tools: ['File/Enterprise GDB', 'Topology', 'Attribute Rules', 'QA checks'],
    icon: Box,
  },
  {
    number: '03',
    title: 'Automate',
    description: 'Turn repeat work into reliable pipelines: processing, QA/QC gates, and reporting you can rerun.',
    duration: '3-10 days',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1400',
    details: ['Python', 'Pipelines', 'Batch', 'Reports'],
    deliverables: [
      'Automation scripts (Python/ArcPy)',
      'Repeatable processing pipeline + logs',
      'QA/QC checklist with exceptions tracking',
      'Summary report outputs (CSV/PDF)',
    ],
    tools: ['Python', 'ArcPy', 'ModelBuilder', 'Git-ready structure'],
    icon: Cog,
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Publish, package, and hand over: maps, web layers, dashboards, and documentation that teams can use.',
    duration: '2-5 days',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400',
    details: ['Publish', 'Dashboards', 'Docs', 'Training'],
    deliverables: [
      'Map layouts and cartographic standards',
      'Published web layers + sharing settings',
      'Dashboards/StoryMaps (if required)',
      'Handover pack + training session',
    ],
    tools: ['ArcGIS Online/Enterprise', 'Dashboards', 'StoryMaps', 'Documentation'],
    icon: Rocket,
  },
];

export default function Process() {
  const navigate = useNavigate();
  const reduceEffects = useMemo(() => shouldReduceEffects(), []);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const activeStep = useMemo(() => steps[Math.max(0, Math.min(activeStepIndex, steps.length - 1))] ?? steps[0], [activeStepIndex]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();

    // Safari < 14 uses addListener/removeListener instead of addEventListener/removeEventListener.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const imagePanel = imagePanelRef.current;
    const contentPanel = contentPanelRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const stepsContainer = stepsRef.current;

    if (!section || !imagePanel || !contentPanel || !headline || !body || !stepsContainer) return;
    if (reduceEffects) return;

    const stepItems = stepsContainer.querySelectorAll('.step-item');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(contentPanel, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65 }, 0)
        .fromTo(imagePanel, { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65 }, 0)
        .fromTo(headline, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.08)
        .fromTo(body, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.14)
        .fromTo(stepItems, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06 }, 0.2);
    }, section);

    return () => ctx.revert();
  }, [reduceEffects]);

  return (
    <>
      <section
        ref={sectionRef}
        id="process"
        className="relative w-full min-h-screen py-24 bg-navy z-[60]"
      >
        {/* Aurora */}
        <div className="process-aurora z-[0]" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay z-[1]" />

        {/* Vignette */}
        <div className="absolute inset-0 vignette z-[2]" />

        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-[3]" />

        <div className="relative z-[4] site-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content Panel */}
            <div ref={contentPanelRef} className="lg:col-span-6">
              <div className="max-w-none lg:max-w-2xl">
                <div className="mb-6">
                  <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase">
                    Process
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "4 phases",
                      "QA/QC gates",
                      "Handover-ready",
                    ].map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 bg-slate-900/25 border border-slate-700/50 text-slate-200/85 text-xs font-mono rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Headline */}
                <h2
                  ref={headlineRef}
                  className="font-display font-bold text-display-2 text-slate-50 mb-5"
                >
                  From data to decision.
                </h2>

                {/* Body */}
                <p
                  ref={bodyRef}
                  className="text-base md:text-lg text-slate-300 leading-relaxed mb-8"
                >
                  A repeatable process designed for clarity and adoption: structured data, defensible QA/QC,
                  and deliverables that remain easy to maintain after handover.
                </p>

                <p className="font-mono text-xs text-slate-500 uppercase tracking-[0.14em] mb-4">
                  {isDesktop ? "Hover a step to preview deliverables" : "Tap a step to preview deliverables"}
                </p>

                {/* Steps */}
                <div ref={stepsRef} className="space-y-3">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStepIndex;

                    return (
                      <button
                        key={step.number}
                        type="button"
                        onMouseEnter={() => setActiveStepIndex(index)}
                        onFocus={() => setActiveStepIndex(index)}
                        onClick={() => setActiveStepIndex(index)}
                        aria-pressed={isActive}
                        className={cn(
                          "step-item group w-full text-left flex items-start gap-4 p-4 rounded-sm border transition-all duration-300",
                          isActive
                            ? "bg-teal/10 border-teal/40 shadow-[0_0_0_1px_rgba(46,196,182,0.10),0_18px_50px_rgba(0,0,0,0.35)]"
                            : "bg-slate-800/15 border-slate-700/35 hover:bg-slate-800/20 hover:border-teal/25"
                        )}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-sm border flex items-center justify-center transition-colors duration-300",
                            isActive
                              ? "bg-teal/15 border-teal/35"
                              : "bg-slate-900/30 border-slate-700/50 group-hover:bg-teal/10 group-hover:border-teal/25"
                          )}
                        >
                          <Icon className="w-6 h-6 text-teal" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono text-xs text-teal tracking-[0.18em]">
                                  {step.number}
                                </span>
                                <h3 className="font-display font-semibold text-lg text-slate-50">
                                  {step.title}
                                </h3>
                              </div>
                            </div>

                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px] px-2.5 py-1 rounded-sm border",
                                isActive
                                  ? "border-teal/35 bg-teal/10 text-teal"
                                  : "border-slate-700/50 bg-slate-900/20 text-slate-400 group-hover:border-teal/25 group-hover:text-slate-300"
                              )}
                            >
                              <Clock className="w-3.5 h-3.5 text-teal/80" />
                              {step.duration}
                            </span>
                          </div>

                          <p className="text-sm text-slate-400 leading-relaxed">
                            {step.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.details.map((detail) => (
                              <span
                                key={detail}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-mono",
                                  isActive
                                    ? "border-slate-50/10 bg-slate-900/35 text-slate-200/90"
                                    : "border-slate-700/40 bg-slate-900/25 text-slate-300/80"
                                )}
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-teal/70" />
                                {detail}
                              </span>
                            ))}
                          </div>

                          {!isDesktop && isActive ? (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {step.deliverables.slice(0, 4).map((d) => (
                                <div key={d} className="flex items-start gap-2 text-xs text-slate-300">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal/70 flex-shrink-0" />
                                  <span className="leading-relaxed">{d}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Image Panel */}
            <div ref={imagePanelRef} className="lg:col-span-6 lg:sticky lg:top-24">
              <div className="relative rounded-sm overflow-hidden border border-slate-700/50 bg-slate-900/20 h-[260px] sm:h-[340px] lg:h-[calc(100vh-12rem)]">
                <img
                  key={activeStep.image}
                  src={activeStep.image}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover animate-fade-in"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-navy/25 to-navy/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />

                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-2">
                  {steps.map((s, i) => (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => setActiveStepIndex(i)}
                      className={cn(
                        "w-8 h-8 rounded-sm border backdrop-blur-md transition-colors flex items-center justify-center",
                        i === activeStepIndex
                          ? "bg-teal/15 border-teal/35 text-teal"
                          : "bg-navy/35 border-slate-700/60 text-slate-200/80 hover:text-teal hover:border-teal/35"
                      )}
                      aria-label={`Preview step ${s.number}: ${s.title}`}
                    >
                      <span className="font-mono text-[11px]">{s.number}</span>
                    </button>
                  ))}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <div className="text-shadow">
                    <p className="font-mono text-[11px] text-teal tracking-[0.16em] uppercase">
                      Step {activeStep.number} - {activeStep.duration}
                    </p>
                    <h3 className="mt-2 font-display font-semibold text-2xl text-slate-50">
                      {activeStep.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-200/90 leading-relaxed max-w-[60ch]">
                      {activeStep.description}
                    </p>

                    <div className="mt-4 hidden sm:block">
                      <p className="font-mono text-xs text-slate-300/80 uppercase tracking-wide mb-2">
                        Deliverables
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeStep.deliverables.slice(0, 4).map((d) => (
                          <div key={d} className="flex items-start gap-2 text-xs text-slate-100/90">
                            <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeStep.tools.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-slate-900/25 border border-slate-50/10 text-slate-100/90 text-xs font-mono rounded-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="process-details"
        className="relative w-full py-24 bg-navy z-[50]"
      >
        <div className="process-aurora z-[0]" />
        <div className="absolute inset-0 grid-overlay z-[1]" />
        <div className="absolute inset-0 vignette z-[2]" />
        <div className="absolute inset-0 noise-overlay z-[3]" />

        <div className="relative z-[4] site-gutter">
          <div className="w-full max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block">
                What You Get
              </span>
              <h2 className="font-display font-bold text-display-3 text-slate-50 mb-4">
                Deliverables you can trust and reuse.
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl">
                The goal is not "a map". It is a clean dataset, clear rules, and a publishable package that
                supports decisions and survives handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-800/15 border border-slate-700/35 rounded-sm p-6 hover:border-teal/25 transition-colors">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-teal" />
                </div>
                <p className="font-display font-semibold text-lg text-slate-50 mb-2">
                  Handover Pack
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Documentation that makes the deliverable maintainable by the next team.
                </p>
                <ul className="space-y-2">
                  {["Data dictionary", "Runbook / SOP", "Change log", "Quickstart guide"].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/15 border border-slate-700/35 rounded-sm p-6 hover:border-teal/25 transition-colors">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-teal" />
                </div>
                <p className="font-display font-semibold text-lg text-slate-50 mb-2">
                  QA/QC Gates
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Validation checkpoints that keep data defensible and review cycles fast.
                </p>
                <ul className="space-y-2">
                  {["Topology checks", "Attribute validation", "Schema consistency", "Exceptions tracking"].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/15 border border-slate-700/35 rounded-sm p-6 hover:border-teal/25 transition-colors">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-teal" />
                </div>
                <p className="font-display font-semibold text-lg text-slate-50 mb-2">
                  Publishing Ready
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Outputs designed for ArcGIS Online/Enterprise delivery and stakeholder clarity.
                </p>
                <ul className="space-y-2">
                  {["Web layers", "Dashboards", "StoryMaps / reports", "Access & sharing rules"].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/15 border border-slate-700/35 rounded-sm p-6 hover:border-teal/25 transition-colors">
                <div className="w-12 h-12 rounded-sm bg-teal/10 border border-teal/25 flex items-center justify-center mb-4">
                  <MessagesSquare className="w-6 h-6 text-teal" />
                </div>
                <p className="font-display font-semibold text-lg text-slate-50 mb-2">
                  Clear Reviews
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  A simple cadence so stakeholders can approve quickly and confidently.
                </p>
                <ul className="space-y-2">
                  {["Kickoff + scope alignment", "Step demos", "Issue list", "Final walkthrough"].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-800/12 border border-slate-700/35 rounded-sm p-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                  Typical Timeline
                </p>
                <p className="mt-2 font-display font-semibold text-xl text-slate-50">
                  Four phases, predictable checkpoints.
                </p>
                <div className="mt-5 divide-y divide-slate-700/50 border border-slate-700/35 rounded-sm overflow-hidden">
                  {steps.map((s) => (
                    <div
                      key={s.number}
                      className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-900/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-teal tracking-[0.18em]">
                          {s.number}
                        </span>
                        <span className="text-sm text-slate-200 font-medium truncate">
                          {s.title}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-teal/70" />
                        {s.duration}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  Timelines vary by data readiness and publishing scope, but the checkpoints remain the same:
                  validate early, review often, and document decisions.
                </p>
              </div>

              <div className="lg:col-span-5 bg-slate-800/12 border border-slate-700/35 rounded-sm p-6">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                  Inputs
                </p>
                <p className="mt-2 font-display font-semibold text-xl text-slate-50">
                  What I need from you.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Goal: the decision you need to make (or the KPI you need to track)",
                    "Data access: samples, schemas, and constraints",
                    "Stakeholders: who approves what, and when",
                    "Delivery format: Pro project, web apps, dashboards, or reports",
                  ].map((x) => (
                    <li key={x} className="text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-teal/70 mt-0.5" />
                      <span className="leading-relaxed">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 rounded-sm border border-slate-700/45 bg-gradient-to-br from-teal/10 via-slate-900/20 to-slate-900/20 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-teal tracking-[0.15em] uppercase">
                    Next Step
                  </p>
                  <h3 className="mt-2 font-display font-semibold text-2xl text-slate-50">
                    Want a one-page process plan for your project?
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                    I can send a short plan with scope, data sources, QA/QC gates, timeline, and delivery outputs.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Start a project
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    See projects
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
