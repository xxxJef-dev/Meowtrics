"use client";
import ToggleSwitch from "./ToggleSwitch";

/**
 * SectionCard — collapsible card wrapper for calculator sections.
 * Optional toggle dims header and collapses body with max-height animation.
 */
interface SectionCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  toggleable?: boolean;
  enabled?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

export default function SectionCard({
  icon,
  title,
  subtitle,
  toggleable = false,
  enabled = true,
  onToggle,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-6 transition-opacity duration-300 ${
          !enabled ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--color-text)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[var(--color-muted)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {toggleable && onToggle && (
          <ToggleSwitch
            enabled={enabled}
            onToggle={onToggle}
            label={`Toggle ${title}`}
          />
        )}
      </div>

      {/* Collapsible body */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: enabled ? "2000px" : "0px",
          opacity: enabled ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}
