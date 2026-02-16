export type PublicImageGroup =
  | "Highlights"
  | "Project Deliverables"
  | "Portfolio Photos"
  | "Snapshots";

export type PublicMediaKind = "image" | "video";

export type PublicImage = {
  filename: string;
  title: string;
  group: PublicImageGroup;
  kind?: PublicMediaKind;
  poster?: string;
};

const RAW_PUBLIC_IMAGES: PublicImage[] = [
  // Highlights
  { filename: "hero-main.jpg", title: "GIS Briefing: From Plans to Decisions", group: "Highlights" },
  { filename: "photo12.jpg", title: "Expo Demo: Interactive City Model", group: "Highlights" },
  { filename: "photo8.jpg", title: "Conference Session: Mobility + Geospatial", group: "Highlights" },

  // Portfolio Photos
  { filename: "photo1.jpg", title: "Design Review: Corridor & Land Use", group: "Portfolio Photos" },
  { filename: "photo2.jpg", title: "Monitoring Station: Dashboards + Maps", group: "Portfolio Photos" },
  { filename: "photo3.jpg", title: "Build Mode: Code + Automation", group: "Portfolio Photos" },
  { filename: "1738948364829.jpg", title: "Workstation: Multi-Screen Analysis", group: "Portfolio Photos" },
  { filename: "Screenshot 2026-02-16 011055.jpg", title: "Deep Work: Dual-Laptop Workflow", group: "Portfolio Photos" },

  // Snapshots
  { filename: "Screenshot 2026-02-16 010854.jpg", title: "Network Rack Setup: Clean Cabling & Layout", group: "Snapshots" },
  { filename: "Screenshot 2026-02-16 010959.jpg", title: "Patch Panel Work: Labeling, Testing, Handover", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-01 at 8.47.19 PM.jpeg", title: "Hands-on Session: Explain, Demo, Align", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 05.05.18.jpeg", title: "Delivery Review: Map, Story, Next Steps", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 05.05.18 (2).jpeg", title: "Boardroom Setup: Dashboards Ready", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 05.05.18 (5).jpeg", title: "Workshop Room: Before the Talk", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 2.31.17 AM.jpeg", title: "Team Sync: Review and Decisions", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 2.31.17 AM (1).jpeg", title: "Event Day: Conversations that Move Work Forward", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 2.31.18 AM.jpeg", title: "Milestone Moment: Project Presence", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 2.31.19 AM.jpeg", title: "Workshop: Align, Iterate, Deliver", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 2.31.19 AM (1).jpeg", title: "Field Visit: On-Site Context", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 3.19.04 AM.jpeg", title: "Team Briefing: Clear Actions", group: "Snapshots" },
  { filename: "WhatsApp Image 2026-02-15 at 3.19.23 AM.jpeg", title: "Wrap-up: Document and Hand Over", group: "Snapshots" },
];

const seen = new Set<string>();
export const PUBLIC_IMAGES: PublicImage[] = RAW_PUBLIC_IMAGES.filter((img) => {
  // Keep gallery content clean (no logo media) and avoid duplicates by filename.
  if (img.filename === "logooo.png") return false;
  if (img.filename === "New_logo.mp4") return false;
  if (seen.has(img.filename)) return false;
  seen.add(img.filename);
  return true;
});
