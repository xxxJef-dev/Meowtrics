"use client";
import { HelpCircle } from "lucide-react";

/**
 * InputField — generic labeled input with optional prefix, suffix,
 * tooltip, hint, and readOnly mode. Min 44px height, 16px font
 * to prevent iOS auto-zoom.
 */
interface InputFieldProps {
  label: string;
  hint?: string;
  tooltip?: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  prefix?: string;
  suffix?: string;
  readOnly?: boolean;
  min?: number;
  step?: number;
}

export default function InputField({
  label,
  hint,
  tooltip,
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
  readOnly = false,
  min,
  step,
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const raw = e.target.value;
      if (raw === "" || raw === "-") {
        onChange("0");
        return;
      }
      onChange(String(parseFloat(raw) || 0));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
        {tooltip && (
          <span title={tooltip} className="cursor-help">
            <HelpCircle
              size={14}
              className="text-[var(--color-subtle)] hover:text-[var(--color-primary)] transition-colors"
            />
          </span>
        )}
      </div>

      {/* Hint shown on mobile as permanent text */}
      {hint && (
        <p className="text-xs text-[var(--color-muted)]">{hint}</p>
      )}

      {/* Input wrapper */}
      <div
        className={`flex items-center border rounded-xl overflow-hidden transition-colors ${
          readOnly
            ? "border-[var(--color-border)] bg-gray-50 dark:bg-gray-800"
            : "border-[var(--color-border)] bg-transparent focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent"
        }`}
      >
        {prefix && (
          <span className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-[var(--color-muted)] text-sm border-r border-[var(--color-border)] select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          min={min}
          step={step}
          className={`flex-1 px-3 py-2 min-h-[44px] text-base bg-transparent outline-none ${
            readOnly
              ? "italic text-[var(--color-muted)] cursor-not-allowed"
              : "text-[var(--color-text)]"
          }`}
        />
        {suffix && (
          <span className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-[var(--color-muted)] text-sm border-l border-[var(--color-border)] select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
