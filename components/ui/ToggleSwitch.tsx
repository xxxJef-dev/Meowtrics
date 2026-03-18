"use client";

/**
 * ToggleSwitch — generic on/off toggle.
 * Track + thumb with smooth color/position transitions.
 * Min 48px touch target for mobile accessibility.
 */
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
}

export default function ToggleSwitch({
  enabled,
  onToggle,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className="min-w-[48px] min-h-[48px] flex items-center justify-center"
    >
      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          enabled
            ? "bg-[var(--color-primary)]"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}
