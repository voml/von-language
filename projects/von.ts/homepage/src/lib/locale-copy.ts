/** Shared locale helpers for #locales message refresh after LocaleTransition. */

export type LocaleId = "zh-hans" | "en-us" | string;

export function readLocaleId(preferred?: string | null): LocaleId {
  if (preferred) return preferred;
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-locale") || "en-us";
  }
  return "en-us";
}

export function withLocaleHint<T>(localeId: LocaleId, fn: () => T): T {
  const g = typeof globalThis !== "undefined" ? (globalThis as Record<string, unknown>) : null;
  const prev = g ? g.__vmzLocaleIdHint : undefined;
  if (g) g.__vmzLocaleIdHint = localeId;
  try {
    return fn();
  } finally {
    if (g) {
      if (prev === undefined) delete g.__vmzLocaleIdHint;
      else g.__vmzLocaleIdHint = prev;
    }
  }
}

export function watchDocumentLocale(onChange: (localeId: string) => void): () => void {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }
  const el = document.documentElement;
  let last = el.getAttribute("data-locale") || "";
  const obs = new MutationObserver(() => {
    const next = el.getAttribute("data-locale") || "";
    if (next === last) return;
    last = next;
    if (next) onChange(next);
  });
  obs.observe(el, { attributes: true, attributeFilter: ["data-locale"] });
  return () => obs.disconnect();
}

export function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function isActivePath(href: string): boolean {
  const path = currentPath();
  if (href === "/") return path === "/" || path === "/en-us" || path === "/zh-hans";
  return path === href || path.endsWith(href);
}
