// ── Theme persistence ─────────────────────────────────────────────────────────
// Stores the user's theme choice in localStorage and applies the .dark / .light
// class to <html> on load, before React even mounts (see the inline script in
// __root.tsx) to avoid a flash of the wrong theme.

const THEME_KEY = "studyai:theme";

export type Theme = "dark" | "light";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}