"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormulaStep } from "@/types/calculator";

/**
 * FormulaBreakdown — collapsible accordion showing the complete
 * step-by-step formula trail. Hidden by default. User taps to expand.
 */
interface FormulaBreakdownProps {
  steps: FormulaStep[];
}

export default function FormulaBreakdown({
  steps,
}: FormulaBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-primary-light)]/30 dark:hover:bg-[var(--color-border)]/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧮</span>
          <span className="font-heading font-bold text-lg text-[var(--color-text)]">
            How was this calculated?
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-medium">
          <span>{isOpen ? "Hide steps" : "Show steps"}</span>
          {isOpen ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </button>

      {/* Body */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? "3000px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isFinalPrice = step.label === "Final Price per Product";

            return (
              <div
                key={step.label}
                className={`py-3 ${
                  index < steps.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : ""
                } ${
                  isFinalPrice
                    ? "bg-[var(--color-primary-light)]/30 dark:bg-[var(--color-primary)]/5 -mx-2 px-2 rounded-lg"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isFinalPrice
                          ? "text-[var(--color-primary)] font-bold"
                          : "text-[var(--color-text)]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] font-mono mt-0.5 break-all">
                      {step.formula}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold whitespace-nowrap ${
                      isFinalPrice || isLast
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text)]"
                    }`}
                  >
                    {step.result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
