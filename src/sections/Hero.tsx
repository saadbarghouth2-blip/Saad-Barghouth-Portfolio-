import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowDown, Briefcase, GalleryHorizontal, MapPin, Mail, Send } from 'lucide-react';

import { shouldReduceEffects } from '@/lib/perf';
import { publicPath } from '@/lib/public-path';

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!section || !image || !overlay || !content) return;

    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        image,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.25, ease: 'power2.out' }
      )
        .fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.9'
        )
        .fromTo(
          content.querySelectorAll('.hero-panel'),
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          content.querySelectorAll('.hero-item'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
          '-=0.45'
        );

      // Keep it subtle: a slow, barely-noticeable drift once the entrance finishes.
      gsap.to(image, {
        scale: 1.03,
        duration: 16,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
    }, section);

    return () => ctx.revert();

  }, []);

  const scrollToExplore = () => {
    const target = document.getElementById("home-overview");
    if (target) {
      target.scrollIntoView({ behavior: shouldReduceEffects() ? "auto" : "smooth", block: "start" });
      return;
    }

    navigate("/about");
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100svh] overflow-x-hidden bg-navy"
    >
      {/* Full-screen Background Image - YOUR PHOTO */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <img
          src={publicPath('hero-main.jpg')}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center will-change-transform"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] bg-gradient-to-t from-navy via-navy/60 to-navy/25"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 vignette z-[3]" />
      <div className="absolute inset-0 noise-overlay z-[4]" />
      <div className="absolute inset-0 grid-overlay z-[5] opacity-20" />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-[6] flex flex-col justify-end pb-12 sm:pb-16 site-gutter"
      >
        <div className="w-full max-w-6xl">
          <div className="hero-panel text-shadow p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
              <div className="lg:col-span-7">
                <div className="hero-item mb-5">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal/15 border border-teal/30 rounded-sm">
                    <span className="font-mono text-sm text-teal tracking-[0.15em] uppercase">
                      Team Leader, GIS Analyst
                    </span>
                  </span>
                </div>

                <h1 className="hero-item font-display font-bold text-[clamp(42px,7vw,84px)] text-slate-50 leading-[0.98] text-balance">
                  Saad Elsayed Barghouth
                </h1>

                <p className="hero-item text-lg sm:text-xl md:text-2xl text-slate-300 mt-4 max-w-2xl text-balance">
                  <span className="text-gradient font-semibold">Team Leader, GIS Analyst</span>
                </p>

                <div className="hero-item flex flex-wrap items-center gap-6 mt-6 text-slate-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal" />
                    Giza, Egypt
                  </span>
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="flex items-center gap-2 hover:text-slate-200 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-teal" />
                    saadbarghouth11@gmail.com
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">


                <div className="hero-item flex flex-wrap gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-sm transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <Briefcase className="w-4 h-4" />
                    View Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-sm transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <GalleryHorizontal className="w-4 h-4" />
                    Browse Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-sm transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    <Send className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToExplore}
            className="hero-item mt-7 inline-flex items-center gap-2 text-slate-300 hover:text-teal transition-colors duration-300 group"
          >
            <span className="font-mono text-sm tracking-wide">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
