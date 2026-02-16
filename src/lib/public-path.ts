function isRemoteUrl(path: string) {
  return (
    /^https?:\/\//i.test(path) ||
    /^\/\//.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  );
}

export function publicPath(path: string) {
  if (isRemoteUrl(path)) return path;

  const base = import.meta.env.BASE_URL ?? "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const clean = path.startsWith("/") ? path.slice(1) : path;

  const encoded = clean
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  return `${prefix}${encoded}`;
}
