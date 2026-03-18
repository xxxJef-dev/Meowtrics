"use client";
import { LaborInputs } from "@/types/calculator";
import SectionCard from "@/components/ui/SectionCard";
import InputField from "@/components/ui/InputField";
import { formatCurrency } from "@/lib/calculations";

/**
 * LaborSection — toggleable labor cost inputs.
 * Shows hourly rate × hours × employees formula with computed totals.
 */
interface LaborSectionProps {
  labor: LaborInputs;
  laborCost: number;
  laborCostPerProduct: number;
  onChange: (updates: Partial<LaborInputs>) => void;
}

export default function LaborSection({
  labor,
  laborCost,
  laborCostPerProduct,
  onChange,
}: LaborSectionProps) {
  return (
    <SectionCard
      icon="👷"
      title="Labor Cost"
      toggleable
      enabled={labor.enabled}
      onToggle={() => onChange({ enabled: !labor.enabled })}
    >
      <InputField
        label="Hourly Rate"
        tooltip="Your hourly pay rate or staff wage"
        value={labor.hourlyRate}
        onChange={(v) => onChange({ hourlyRate: parseFloat(v) || 0 })}
        type="number"
        prefix="₱"
        suffix="/hr"
        min={0}
        step={1}
      />
      <InputField
        label="Hours to Complete"
        tooltip="Total hours for this order"
        hint="Use decimals — e.g. 0.5 = 30 minutes"
        value={labor.hoursToComplete}
        onChange={(v) =>
          onChange({ hoursToComplete: parseFloat(v) || 0 })
        }
        type="number"
        min={0}
        step={0.05}
      />
      <InputField
        label="No. of Employees"
        tooltip="How many people working on this order"
        value={labor.numberOfEmployees}
        onChange={(v) =>
          onChange({
            numberOfEmployees: Math.max(1, parseFloat(v) || 1),
          })
        }
        type="number"
        min={1}
        step={1}
      />

      {/* Divider */}
      <div className="border-t border-[var(--color-border)]" />

      <InputField
        label="Labor Cost Total"
        value={formatCurrency(laborCost)}
        onChange={() => {}}
        readOnly
      />
      <InputField
        label="Labor Cost per Product"
        value={formatCurrency(laborCostPerProduct)}
        onChange={() => {}}
        readOnly
      />

      {/* Formula reminder */}
      <p className="text-xs text-[var(--color-muted)]">
        Labor Cost = Hourly Rate × Hours × Employees
      </p>

      {/* Inline pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] dark:bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
          👷 Labor cost per sticker: {formatCurrency(laborCostPerProduct)}
        </span>
      </div>
    </SectionCard>
  );
}
