import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollProgress() {
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const update = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      el.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] h-[2px] bg-teal/10">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-teal via-teal-light to-slate-50/60"
      />
    </div>
  );
}

