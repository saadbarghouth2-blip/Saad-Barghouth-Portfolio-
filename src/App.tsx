import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

import Navigation from '@/components/Navigation';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import RouteTransition from '@/components/RouteTransition';
import HomePage from '@/pages/HomePage';
import { prefetchRoute } from '@/lib/route-prefetch';
import Footer from '@/sections/Footer';
import { isLowEndDevice } from '@/lib/perf';

import './App.css';

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const ProcessPage = lazy(() => import('@/pages/ProcessPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

function RouteLoading() {
  return (
    <div className="site-gutter py-24">
      <div className="max-w-4xl">
        <div className="h-1.5 w-24 rounded-sm bg-teal/20 overflow-hidden">
          <div className="h-full w-1/2 bg-teal/60 animate-pulse motion-reduce:animate-none" />
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
          Loading…
        </p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Warm a single common route chunk after initial paint (helps mobile where there's no hover)
    // but skip on constrained devices to avoid competing with first interactions.
    if (isLowEndDevice()) return;

    const warm = () => {
      prefetchRoute('/projects');
    };

    // Use idle time when available; otherwise delay slightly so we don't compete with first render.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(warm, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }

    const t = window.setTimeout(warm, 800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative bg-navy min-h-screen">
      <ScrollToTop />
      <ScrollProgress />
      <Navigation />
      
      <main className="relative">
        <RouteTransition>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteTransition>
      </main>

      <Footer />
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            border: '1px solid rgba(46, 196, 182, 0.3)',
            color: '#F4F6FA',
          },
        }}
      />
    </div>
  );
}

export default App;
