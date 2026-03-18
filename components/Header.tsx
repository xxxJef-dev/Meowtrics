"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Header — sticky top bar with logo, dark mode toggle, and tagline.
 * Persists dark mode preference to localStorage.
 */
export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("meowtrics-dark");
    const isDark = stored === "true";
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("meowtrics-dark", String(next));
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-[680px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐱</span>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl text-[var(--color-text)]">
              Meowtrics
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white rounded-full">
              Beta
            </span>
          </div>
        </div>

        {/* Right: Dark mode toggle */}
        <button
          type="button"
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-border)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? (
            <Sun size={20} className="text-[var(--color-text)]" />
          ) : (
            <Moon size={20} className="text-[var(--color-text)]" />
          )}
        </button>
      </div>

      {/* Sub-tagline */}
      <div className="max-w-[680px] mx-auto px-4 pb-2">
        <p className="text-xs text-[var(--color-muted)] italic">
          Your numbers, purrfected.
        </p>
      </div>
    </header>
  );
}
