export type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function isSlowConnection(): boolean {
  const conn = getConnection();
  if (!conn) return false;
  if (conn.saveData) return true;
  const effectiveType = conn.effectiveType;
  return effectiveType === "slow-2g" || effectiveType === "2g";
}

export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return true;

  // Prefer explicit user/network hints first.
  if (isSlowConnection()) return true;

  const nav = navigator as Navigator & { deviceMemory?: number };

  // `deviceMemory` is in GB and is an optional hint; when present and small, disable heavy effects.
  const dm = nav.deviceMemory;
  if (typeof dm === "number" && dm > 0 && dm <= 2) return true;

  // `hardwareConcurrency` is logical cores; keep threshold conservative.
  const hc = nav.hardwareConcurrency;
  if (typeof hc === "number" && hc > 0 && hc <= 4) return true;

  return false;
}

export type PerfOverride = "low" | "full";

export function getPerfOverride(): PerfOverride | null {
  if (typeof window === "undefined") return null;

  const perf = new URLSearchParams(window.location.search).get("perf");
  if (perf === "low" || perf === "full") return perf;

  if (document.documentElement.dataset.perf === "low") return "low";
  return null;
}

// Use this to decide whether to disable expensive visual effects (blur layers, background animations, etc.).
export function shouldReduceEffects(): boolean {
  const override = getPerfOverride();
  if (override === "low") return true;
  if (override === "full") return false;

  return prefersReducedMotion() || isLowEndDevice();
}
