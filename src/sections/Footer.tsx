import { Heart, MapPin } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Skills", to: "/skills" },
  { label: "Projects", to: "/projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "Experience", to: "/experience" },
  { label: "Process", to: "/process" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full py-12 bg-navy-dark z-[90] border-t border-slate-800/50">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay z-[1] opacity-50" />

      <div className="relative z-[2] px-[10vw]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
            aria-label="Go to Home"
          >
            <div className="w-12 h-12 bg-teal/10 rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-lg text-teal">SB</span>
            </div>
            <div>
              <p className="font-display font-semibold text-slate-50">Saad Elsayed Barghouth</p>
              <p className="font-mono text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Team Leader GIS Analyst
              </p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-300 ${
                    isActive ? "text-teal" : "text-slate-400 hover:text-teal"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span></span>
            <Heart className="w-4 h-4 text-teal fill-teal" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-600">
            Team Leader GIS Analyst
          </p>
        </div>
      </div>
    </footer>
  );
}
