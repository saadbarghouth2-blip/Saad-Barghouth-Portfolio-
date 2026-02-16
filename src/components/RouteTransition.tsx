import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function RouteTransition({ children }: Props) {
  const location = useLocation();

  return (
    <div className="relative">
      {/* Decorative sweep line on navigation */}
      <div
        key={`sweep-${location.pathname}`}
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden motion-reduce:hidden"
      >
        <div className="route-sweep absolute -inset-y-1/3 -left-1/2 w-[200%]" />
      </div>

      <div
        key={`page-${location.pathname}`}
        className="relative z-[4] animate-scale-in motion-reduce:animate-none"
      >
        {children}
      </div>
    </div>
  );
}
