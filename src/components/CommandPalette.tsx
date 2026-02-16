import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  GalleryHorizontal,
  Github,
  GraduationCap,
  Home,
  Linkedin,
  Mail,
  Phone,
  Quote,
  Search,
  Settings,
  Workflow,
  Youtube,
  Facebook,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type CommandAction = {
  label: string;
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  onSelect: () => void;
};

function isMacLike() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback for older browsers / restricted contexts.
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.left = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const modifier = useMemo(() => (isMacLike() ? "⌘" : "Ctrl"), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navActions: CommandAction[] = [
    { label: "Home", keywords: "hero", icon: Home, shortcut: "H", onSelect: () => navigate("/") },
    { label: "About", keywords: "profile bio", icon: GraduationCap, shortcut: "A", onSelect: () => navigate("/about") },
    { label: "Skills", keywords: "capabilities stack", icon: Settings, shortcut: "S", onSelect: () => navigate("/skills") },
    { label: "Projects", keywords: "work portfolio", icon: Briefcase, shortcut: "P", onSelect: () => navigate("/projects") },
    { label: "Gallery", keywords: "images photos", icon: GalleryHorizontal, shortcut: "G", onSelect: () => navigate("/gallery") },
    { label: "Experience", keywords: "career timeline", icon: Workflow, shortcut: "E", onSelect: () => navigate("/experience") },
    { label: "Process", keywords: "method", icon: Workflow, shortcut: "R", onSelect: () => navigate("/process") },
    { label: "Testimonials", keywords: "clients feedback", icon: Quote, shortcut: "T", onSelect: () => navigate("/testimonials") },
    { label: "Contact", keywords: "email phone", icon: Mail, shortcut: "C", onSelect: () => navigate("/contact") },
  ];

  const contactActions: CommandAction[] = [
    {
      label: "Email: saadbarghouth11@gmail.com",
      keywords: "mail contact",
      icon: Mail,
      onSelect: () => window.open("mailto:saadbarghouth11@gmail.com", "_self"),
    },
    {
      label: "Copy email",
      keywords: "copy mail",
      icon: Copy,
      onSelect: async () => {
        const ok = await copyToClipboard("saadbarghouth11@gmail.com");
        if (ok) toast.success("Email copied to clipboard.");
        else toast.error("Could not copy email.");
      },
    },
    {
      label: "Phone: +20 106 743 1264",
      keywords: "call tel",
      icon: Phone,
      onSelect: () => window.open("tel:+201067431264", "_self"),
    },
    {
      label: "Copy phone",
      keywords: "copy phone",
      icon: Copy,
      onSelect: async () => {
        const ok = await copyToClipboard("+20 106 743 1264");
        if (ok) toast.success("Phone copied to clipboard.");
        else toast.error("Could not copy phone.");
      },
    },
  ];

  const socialActions: CommandAction[] = [
    {
      label: "LinkedIn",
      keywords: "social",
      icon: Linkedin,
      onSelect: () => window.open("https://www.linkedin.com/in/saadbarghouth/", "_blank", "noopener,noreferrer"),
    },
    {
      label: "GitHub",
      keywords: "code",
      icon: Github,
      onSelect: () => window.open("https://github.com/saadbarghouth2-blip", "_blank", "noopener,noreferrer"),
    },
    {
      label: "YouTube",
      keywords: "videos",
      icon: Youtube,
      onSelect: () => window.open("https://www.youtube.com/@Saad_Barghouth", "_blank", "noopener,noreferrer"),
    },
    {
      label: "Facebook",
      keywords: "social",
      icon: Facebook,
      onSelect: () =>
        window.open("https://www.facebook.com/people/Saad-Elsayed-Barghouth/", "_blank", "noopener,noreferrer"),
    },
  ];

  const handleSelect = (action: CommandAction) => {
    setOpen(false);
    // Allow the dialog to close before navigation opens (avoids focus weirdness).
    setTimeout(() => action.onSelect(), 0);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-sm border border-slate-700/50 bg-slate-900/20 hover:bg-slate-800/40 text-slate-300 hover:text-slate-100 transition-colors"
        aria-label="Open command palette"
      >
        <Search className="w-4 h-4 text-teal" />
        <span className="text-sm">Search</span>
        <span className="ml-2 font-mono text-xs text-slate-500 border border-slate-700/60 px-2 py-0.5 rounded-sm">
          {modifier} K
        </span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command Palette"
        description="Navigate pages and quick actions."
        className="bg-navy border border-slate-700/60 text-slate-100 sm:max-w-2xl"
      >
        <CommandInput placeholder="Search pages or actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {navActions.map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.label} value={`${a.label} ${a.keywords ?? ""}`} onSelect={() => handleSelect(a)}>
                  <Icon className="w-4 h-4 text-teal" />
                  <span>{a.label}</span>
                  {a.shortcut ? <CommandShortcut>{a.shortcut}</CommandShortcut> : null}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Contact">
            {contactActions.map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.label} value={`${a.label} ${a.keywords ?? ""}`} onSelect={() => handleSelect(a)}>
                  <Icon className="w-4 h-4 text-teal" />
                  <span>{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Social">
            {socialActions.map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.label} value={`${a.label} ${a.keywords ?? ""}`} onSelect={() => handleSelect(a)}>
                  <Icon className="w-4 h-4 text-teal" />
                  <span>{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

