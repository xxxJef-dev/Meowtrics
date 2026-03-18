"use client";
import { PricingSettings } from "@/types/calculator";
import SectionCard from "@/components/ui/SectionCard";
import InputField from "@/components/ui/InputField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { getProfitEmoji, getProfitStatus } from "@/lib/calculations";

/**
 * PricingSection — profit margin slider, discount toggle, and tax toggle.
 * Always visible. Inner toggles for discount and tax.
 */
interface PricingSectionProps {
  pricing: PricingSettings;
  onChange: (updates: Partial<PricingSettings>) => void;
}

export default function PricingSection({
  pricing,
  onChange,
}: PricingSectionProps) {
  const status = getProfitStatus(pricing.profitMargin);
  const emoji = getProfitEmoji(status);

  return (
    <SectionCard icon="📊" title="Pricing Settings">
      {/* Profit Margin Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Profit Margin
          </label>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {pricing.profitMargin}% {emoji}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={pricing.profitMargin}
          onChange={(e) =>
            onChange({ profitMargin: parseInt(e.target.value, 10) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[var(--color-subtle)]">
          <span>0%</span>
          <span>100%</span>
          <span>200%</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--color-border)]" />

      {/* Discount toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">
            Enable Discount
          </span>
          <ToggleSwitch
            enabled={pricing.discountEnabled}
            onToggle={() =>
              onChange({ discountEnabled: !pricing.discountEnabled })
            }
            label="Enable Discount"
          />
        </div>
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: pricing.discountEnabled ? "200px" : "0px",
            opacity: pricing.discountEnabled ? 1 : 0,
          }}
        >
          <InputField
            label="Discount %"
            tooltip="Percentage off the selling price"
            hint="Applied before sales tax"
            value={pricing.discountPercent}
            onChange={(v) =>
              onChange({
                discountPercent: Math.min(
                  100,
                  Math.max(0, parseFloat(v) || 0)
                ),
              })
            }
            type="number"
            suffix="%"
            min={0}
            step={1}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--color-border)]" />

      {/* Sales Tax toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">
            Enable Sales Tax
          </span>
          <ToggleSwitch
            enabled={pricing.taxEnabled}
            onToggle={() =>
              onChange({ taxEnabled: !pricing.taxEnabled })
            }
            label="Enable Sales Tax"
          />
        </div>
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: pricing.taxEnabled ? "200px" : "0px",
            opacity: pricing.taxEnabled ? 1 : 0,
          }}
        >
          <InputField
            label="Tax %"
            tooltip="VAT or sales tax added after discount. PH VAT = 12%"
            hint="Philippine VAT is 12%"
            value={pricing.taxPercent}
            onChange={(v) =>
              onChange({
                taxPercent: Math.max(0, parseFloat(v) || 0),
              })
            }
            type="number"
            suffix="%"
            min={0}
            step={0.5}
          />
        </div>
      </div>
    </SectionCard>
  );
}
