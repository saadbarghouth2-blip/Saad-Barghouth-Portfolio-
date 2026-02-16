type RouteLoader = () => Promise<unknown>;

const ROUTE_LOADERS: Record<string, RouteLoader> = {
  '/about': () => import('@/pages/AboutPage'),
  '/skills': () => import('@/pages/SkillsPage'),
  '/projects': () => import('@/pages/ProjectsPage'),
  '/gallery': () => import('@/pages/GalleryPage'),
  '/experience': () => import('@/pages/ExperiencePage'),
  '/process': () => import('@/pages/ProcessPage'),
  '/testimonials': () => import('@/pages/TestimonialsPage'),
  '/contact': () => import('@/pages/ContactPage'),
};

const PREFETCHED = new Set<string>();

export function prefetchRoute(pathname: string) {
  const loader = ROUTE_LOADERS[pathname];
  if (!loader) return;

  // Avoid re-prefetching the same route on repeated hovers/focus.
  if (PREFETCHED.has(pathname)) return;
  PREFETCHED.add(pathname);

  // Fire-and-forget: warms the browser/module graph cache.
  void loader().catch(() => {
    // Allow retry if the fetch fails.
    PREFETCHED.delete(pathname);
  });
}
