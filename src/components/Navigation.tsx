import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Mail, Menu, X } from 'lucide-react';

import CommandPalette from '@/components/CommandPalette';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { publicPath } from '@/lib/public-path';
import { shouldReduceEffects } from '@/lib/perf';
import { prefetchRoute } from '@/lib/route-prefetch';
import { cn } from '@/lib/utils';

const PROFILE_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Experience', to: '/experience' },
] as const;

const WORK_LINKS = [
  { label: 'Projects', to: '/projects' },
  { label: 'Process', to: '/process' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Testimonials', to: '/testimonials' },
] as const;

const navLinks = [...PROFILE_LINKS, ...WORK_LINKS];

const COMPACT_PRIMARY_LINKS = [
  PROFILE_LINKS[0], // About
  WORK_LINKS[0], // Projects
  WORK_LINKS[2], // Gallery
] as const;

const COMPACT_MORE_PROFILE_LINKS = [PROFILE_LINKS[1], PROFILE_LINKS[2]] as const; // Skills, Experience
const COMPACT_MORE_WORK_LINKS = [WORK_LINKS[1], WORK_LINKS[3]] as const; // Process, Testimonials

const mobileItems = [
  { type: 'link' as const, label: 'Home', to: '/' },
  { type: 'divider' as const },
  { type: 'heading' as const, title: 'Profile' },
  ...PROFILE_LINKS.map((l) => ({ type: 'link' as const, label: l.label, to: l.to })),
  { type: 'heading' as const, title: 'Work' },
  ...WORK_LINKS.map((l) => ({ type: 'link' as const, label: l.label, to: l.to })),
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopPillRef = useRef<HTMLDivElement>(null);
  const desktopItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const mobileItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [mobileNavHighlighted, setMobileNavHighlighted] = useState<string | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScrollTop, setHasScrollTop] = useState(false);
  const [hasScrollBottom, setHasScrollBottom] = useState(false);
  const scrollRafRef = useRef<number | null>(null);
  const scrolledRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const reduceEffects = useMemo(() => shouldReduceEffects(), []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion || reduceEffects ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion, reduceEffects]);

  const onNavLinkClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, to: string) => {
      // Clicking the active route should still feel like a navigation action.
      if (to !== location.pathname) return;
      e.preventDefault();
      scrollToTop();
    },
    [location.pathname, scrollToTop]
  );

  useEffect(() => {
    const schedule = () => {
      if (scrollRafRef.current != null) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const next = window.scrollY > 100;
        if (scrolledRef.current === next) return;
        scrolledRef.current = next;
        setIsScrolled(next);
      });
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (scrollRafRef.current != null) window.cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Close the mobile menu on navigation (works with HashRouter + BrowserRouter).
    const t = window.setTimeout(() => {
      setIsMobileMenuOpen((open) => (open ? false : open));
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.key]);

  // For the push-down mobile menu we no longer lock body scroll —
  // the menu is rendered in-flow so it pushes content instead of overlaying it.


  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  // Listen for programmatic requests to open the mobile nav (e.g., from HomeFocus).
  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail ?? {};
      const to = detail?.to ?? null;
      setIsMobileMenuOpen(true);
      setMobileNavHighlighted(to ?? null);

      // Focus the matching mobile link if present (allow a short delay for rendering).
      setTimeout(() => {
        if (to && mobileItemRefs.current[to]) {
          mobileItemRefs.current[to]?.focus();
        } else {
          const first = document.querySelector('#mobile-nav a') as HTMLElement | null;
          first?.focus();
        }
      }, 120);

      if (to) {
        // clear highlight after a short duration
        window.setTimeout(() => setMobileNavHighlighted(null), 2500);
      }
    };

    window.addEventListener('open-mobile-nav', handler as EventListener);
    return () => window.removeEventListener('open-mobile-nav', handler as EventListener);
  }, []);

  // Track scroll state inside the in-flow mobile nav so we can show visible
  // top/bottom fade hints when content overflows.
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;

    const update = () => {
      const top = el.scrollTop > 6;
      const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > 6;
      setHasScrollTop(top);
      setHasScrollBottom(bottom);
    };

    // Run once to initialise, and while menu is open keep listening.
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isMobileMenuOpen]);

  const activeDesktopKey = useMemo(() => {
    return navLinks.find((l) => l.to === location.pathname)?.to ?? null;
  }, [location.pathname]);

  const activeDesktopKeyRef = useRef<string | null>(activeDesktopKey);
  useEffect(() => {
    activeDesktopKeyRef.current = activeDesktopKey;
  }, [activeDesktopKey]);

  const desktopRefCallbacks = useMemo(() => {
    const out: Record<string, (el: HTMLAnchorElement | null) => void> = {};
    for (const link of navLinks) {
      out[link.to] = (el) => {
        desktopItemRefs.current[link.to] = el;
      };
    }
    return out;
  }, []);

  const moveDesktopPillToKey = useCallback((key: string | null, immediate = false) => {
    const container = desktopNavRef.current;
    const pill = desktopPillRef.current;
    if (!container || !pill) return;

    const target = key ? desktopItemRefs.current[key] : null;
    if (!target) {
      pill.style.opacity = '0';
      return;
    }

    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const x = Math.round(tRect.left - cRect.left);
    const w = Math.round(tRect.width);

    pill.style.opacity = '1';
    if (immediate || prefersReducedMotion || reduceEffects) {
      const prev = pill.style.transitionDuration;
      pill.style.transitionDuration = '0ms';
      pill.style.transform = `translate3d(${x}px, -50%, 0)`;
      pill.style.width = `${w}px`;
      // Force style flush then restore transition duration.
      pill.getBoundingClientRect();
      pill.style.transitionDuration = prev;
      return;
    }

    pill.style.transform = `translate3d(${x}px, -50%, 0)`;
    pill.style.width = `${w}px`;
  }, [prefersReducedMotion, reduceEffects]);

  useLayoutEffect(() => {
    moveDesktopPillToKey(activeDesktopKey, true);
  }, [activeDesktopKey, moveDesktopPillToKey]);

  useEffect(() => {
    const container = desktopNavRef.current;
    if (!container) return;

    const reposition = () => moveDesktopPillToKey(activeDesktopKeyRef.current, true);
    reposition();

    // Fonts loading can change link widths and cause the pill to be misaligned.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(reposition).catch(() => {});

    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(reposition);
      ro.observe(container);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [moveDesktopPillToKey]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-colors duration-500',
          isScrolled
            ? 'bg-navy/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-navy/80 via-navy/30 to-transparent backdrop-blur-sm'
        )}
        >
          <div
            className={cn(
              'site-gutter transition-[padding] duration-300',
              isScrolled ? 'py-1.5 sm:py-2.5' : 'py-2 sm:py-3'
            )}
          >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              if (location.pathname === '/') {
                scrollToTop();
              } else {
                navigate('/');
              }
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 rounded-sm"
            aria-label="Go to Home"
          >
            <div
              className={cn(
                'w-8 h-8 sm:w-10 sm:h-10 rounded-sm overflow-hidden flex items-center justify-center border transition-colors duration-200',
                onHome
                  ? 'bg-teal/15 border-teal/35 shadow-[0_0_0_1px_rgba(46,196,182,0.10),0_14px_45px_rgba(0,0,0,0.25)]'
                  : isScrolled
                    ? 'bg-teal/10 border-teal/20'
                    : 'bg-slate-800/35 border-slate-700/50',
                'group-hover:bg-teal/15 group-hover:border-teal/30'
              )}
            >
              <img
                src={publicPath('logooo.png')}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover scale-[1.05] sm:scale-[1.25]"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="hidden lg:block">
              <span className={`font-display font-medium text-sm block transition-colors duration-300 ${
                onHome ? 'text-teal' : isScrolled ? 'text-slate-50' : 'text-slate-100'
              }`}>
                Saad Elsayed Barghouth
              </span>
              <span className={`text-xs block font-semibold transition-colors duration-300 ${
                onHome ? 'text-slate-300' : isScrolled ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Team Leader, GIS Analyst
              </span>
            </div>
          </button>

          {/* Desktop Links (center) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div
              className={cn(
                "rounded-sm border backdrop-blur-md p-1 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                isScrolled
                  ? "bg-slate-900/35 border-slate-700/55"
                  : "bg-slate-900/20 border-slate-700/45"
              )}
            >
              <div
                ref={desktopNavRef}
                className="relative flex items-center gap-0.5"
                onMouseLeave={() => moveDesktopPillToKey(activeDesktopKey)}
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (next && desktopNavRef.current?.contains(next)) return;
                  moveDesktopPillToKey(activeDesktopKey);
                }}
              >
                <div
                  ref={desktopPillRef}
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-0 top-1/2 h-9 lg:h-10 rounded-sm border border-teal/25",
                    "bg-gradient-to-b from-teal/16 via-teal/10 to-slate-50/5",
                    "shadow-[0_0_0_1px_rgba(46,196,182,0.08),0_18px_50px_rgba(0,0,0,0.25)]",
                    "nav-pill will-change-transform opacity-0 transition-[transform,width,opacity] duration-300"
                  )}
                  style={{ width: 0, transform: 'translate3d(0px, -50%, 0)' }}
                />

                {PROFILE_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    ref={desktopRefCallbacks[link.to]}
                    onClick={(e) => onNavLinkClick(e, link.to)}
                    onMouseEnter={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to);
                    }}
                    onFocus={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to);
                    }}
                    onPointerDown={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to, true);
                    }}
                    className={({ isActive }) =>
                      cn(
                        'relative z-[1] select-none text-sm lg:text-base font-medium px-3 lg:px-4 py-2 lg:py-2.5 rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60',
                        isScrolled ? 'text-slate-200/80 hover:text-slate-50' : 'text-slate-200/75 hover:text-slate-50',
                        isActive ? 'text-teal' : ''
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <span aria-hidden="true" className="mx-1 h-6 w-px bg-slate-700/60" />

                {WORK_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    ref={desktopRefCallbacks[link.to]}
                    onClick={(e) => onNavLinkClick(e, link.to)}
                    onMouseEnter={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to);
                    }}
                    onFocus={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to);
                    }}
                    onPointerDown={() => {
                      prefetchRoute(link.to);
                      moveDesktopPillToKey(link.to, true);
                    }}
                    className={({ isActive }) =>
                      cn(
                        'relative z-[1] select-none text-sm lg:text-base font-medium px-3 lg:px-4 py-2 lg:py-2.5 rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60',
                        isScrolled ? 'text-slate-200/80 hover:text-slate-50' : 'text-slate-200/75 hover:text-slate-50',
                        isActive ? 'text-teal' : ''
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Desktop Links (md only) */}
          <div className="hidden md:flex lg:hidden flex-1 items-center justify-center">
            <div
              className={cn(
                "rounded-sm border backdrop-blur-md p-1 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                isScrolled
                  ? "bg-slate-900/35 border-slate-700/55"
                  : "bg-slate-900/20 border-slate-700/45"
              )}
            >
              <div className="flex items-center gap-0.5">
                {COMPACT_PRIMARY_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={(e) => onNavLinkClick(e, link.to)}
                    onMouseEnter={() => prefetchRoute(link.to)}
                    onFocus={() => prefetchRoute(link.to)}
                    onPointerDown={() => prefetchRoute(link.to)}
                    className={({ isActive }) =>
                      cn(
                        'select-none text-sm font-medium px-3 py-2 rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60',
                        isScrolled ? 'text-slate-200/80 hover:text-slate-50' : 'text-slate-200/75 hover:text-slate-50',
                        isActive ? 'text-teal bg-teal/10' : ''
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <span aria-hidden="true" className="mx-1 h-6 w-px bg-slate-700/60" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-sm border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60',
                        (COMPACT_MORE_PROFILE_LINKS.some((l) => l.to === location.pathname) ||
                          COMPACT_MORE_WORK_LINKS.some((l) => l.to === location.pathname))
                          ? 'bg-teal/10 border-teal/35 text-teal'
                          : 'bg-transparent border-slate-700/40 text-slate-200/80 hover:text-slate-50 hover:border-teal/25 hover:bg-slate-900/20'
                      )}
                      aria-label="More pages"
                    >
                      More
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    sideOffset={10}
                    className="bg-navy/95 border-slate-700/60 text-slate-100 backdrop-blur-md shadow-2xl min-w-56"
                    align="end"
                  >
                    <DropdownMenuLabel className="font-mono text-[11px] text-slate-400 uppercase tracking-[0.14em]">
                      Profile
                    </DropdownMenuLabel>
                    {COMPACT_MORE_PROFILE_LINKS.map((l) => (
                      <DropdownMenuItem
                        key={l.to}
                        onSelect={() => {
                          if (l.to === location.pathname) {
                            scrollToTop();
                            return;
                          }
                          navigate(l.to);
                        }}
                        onMouseEnter={() => prefetchRoute(l.to)}
                        className={cn(
                          "cursor-pointer",
                          location.pathname === l.to ? "bg-teal/10 text-teal focus:bg-teal/10 focus:text-teal" : ""
                        )}
                      >
                        {l.label}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator className="bg-slate-700/60" />

                    <DropdownMenuLabel className="font-mono text-[11px] text-slate-400 uppercase tracking-[0.14em]">
                      Work
                    </DropdownMenuLabel>
                    {COMPACT_MORE_WORK_LINKS.map((l) => (
                      <DropdownMenuItem
                        key={l.to}
                        onSelect={() => {
                          if (l.to === location.pathname) {
                            scrollToTop();
                            return;
                          }
                          navigate(l.to);
                        }}
                        onMouseEnter={() => prefetchRoute(l.to)}
                        className={cn(
                          "cursor-pointer",
                          location.pathname === l.to ? "bg-teal/10 text-teal focus:bg-teal/10 focus:text-teal" : ""
                        )}
                      >
                        {l.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Desktop Actions (right) */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="hidden lg:block">
              <CommandPalette />
            </div>

            <NavLink
              to="/contact"
              title="Contact"
              onMouseEnter={() => prefetchRoute('/contact')}
              onFocus={() => prefetchRoute('/contact')}
              onPointerDown={() => prefetchRoute('/contact')}
              onClick={(e) => onNavLinkClick(e, '/contact')}
              className="flex items-center gap-2 px-3.5 lg:px-5 py-2 lg:py-2.5 bg-teal/10 border border-teal/30 hover:bg-teal/20 hover:border-teal/50 text-teal text-sm lg:text-base font-medium rounded-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden lg:inline">Contact</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-sm border flex items-center justify-center transition-colors duration-150',
              isScrolled ? 'bg-slate-900/40 border-slate-700/60 text-slate-200' : 'bg-navy/35 border-slate-700/50 text-slate-200',
              isMobileMenuOpen ? 'border-teal/40 text-teal' : 'hover:border-teal/30 hover:text-teal'
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Menu — push-down panel (mobile-first) */}
      <div
        id="mobile-nav"
        aria-hidden={!isMobileMenuOpen}
        data-has-scroll-top={hasScrollTop ? 'true' : undefined}
        data-has-scroll-bottom={hasScrollBottom ? 'true' : undefined}
        className={cn(
          'md:hidden w-full overflow-hidden transition-[max-height,opacity,transform] duration-250 ease-in-out',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="w-full bg-navy/95 border-t border-slate-700/60 backdrop-blur-sm shadow-lg relative">
          <div ref={mobileScrollRef} className="site-gutter py-4 mobile-nav-scroll">
            <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em] mb-3">
              Navigation
            </p>

            <div className="flex flex-col gap-3">
              {mobileItems.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div
                      key={`divider-${index}`}
                      aria-hidden="true"
                      className="h-px w-full bg-slate-700/60"
                      />
                  );
                }

                if (item.type === 'heading') {
                  return (
                    <p
                      key={`heading-${item.title}`}
                      className="mt-2 font-mono text-[11px] text-slate-500 uppercase tracking-[0.18em]"
                    >
                      {item.title}
                    </p>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    ref={(el) => { mobileItemRefs.current[item.to] = el; }}
                    data-highlighted={mobileNavHighlighted === item.to ? 'true' : undefined}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      setMobileNavHighlighted(null);
                      if (item.to === location.pathname) {
                        e.preventDefault();
                        scrollToTop();
                      }
                    }}
                    onPointerDown={() => prefetchRoute(item.to)}
                    className={({ isActive }) =>
                      cn(
                        'select-none w-full flex items-center justify-between px-4 py-2.5 rounded-sm border transition-colors duration-200',
                        isActive || mobileNavHighlighted === item.to
                          ? 'bg-teal/10 border-teal/35 text-teal'
                          : 'bg-transparent border-slate-700/30 text-slate-200 hover:text-teal hover:border-teal/30'
                      )
                    }
                  >
                    <span className="font-display text-lg">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center">
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal text-navy font-semibold rounded-sm touch-target"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
              </NavLink>
            </div>
          </div>

          {/* visible scroll hints */}
          <span aria-hidden className="mobile-nav-fade-top" />
          <span aria-hidden className="mobile-nav-fade-bottom" />
        </div>
      </div>
    </>
  );
}
