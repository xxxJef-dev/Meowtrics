"use client";
import { X } from "lucide-react";
import { MaterialRowData } from "@/types/calculator";
import { materialRowTotal, formatCurrency } from "@/lib/calculations";

/**
 * MaterialRow — a single row in the COGS material table.
 * Desktop: inline grid row. Mobile: stacked card layout.
 * Total Cost = (costPerUnit / quantity) × unitsNeeded
 */
interface MaterialRowProps {
  row: MaterialRowData;
  onChange: (id: string, updates: Partial<MaterialRowData>) => void;
  onDelete: (id: string) => void;
}

export default function MaterialRow({
  row,
  onChange,
  onDelete,
}: MaterialRowProps) {
  return (
    <>
      {/* ── Desktop: inline grid row (hidden on mobile) ── */}
      <div className="animate-row-in hidden md:grid grid-cols-[1fr_50px_50px_80px_60px_80px_36px] gap-1.5 items-center">
        {/* Name */}
        <input
          type="text"
          value={row.name}
          onChange={(e) => onChange(row.id, { name: e.target.value })}
          placeholder="Material name"
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none"
        />

        {/* # (quantity purchased) */}
        <input
          type="number"
          value={row.quantity}
          onChange={(e) =>
            onChange(row.id, {
              quantity: parseFloat(e.target.value) || 0,
            })
          }
          min={1}
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-1.5 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
        />

        {/* Unit */}
        <input
          type="text"
          value={row.unit}
          onChange={(e) => onChange(row.id, { unit: e.target.value })}
          placeholder="pc"
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-1.5 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
        />

        {/* Cost/Unit */}
        <input
          type="number"
          value={row.costPerUnit}
          onChange={(e) =>
            onChange(row.id, {
              costPerUnit: parseFloat(e.target.value) || 0,
            })
          }
          min={0}
          step={0.01}
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-1.5 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-right"
        />

        {/* Units Needed */}
        <input
          type="number"
          value={row.unitsNeeded}
          onChange={(e) =>
            onChange(row.id, {
              unitsNeeded: parseFloat(e.target.value) || 0,
            })
          }
          min={0}
          step={0.1}
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-1.5 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
        />

        {/* Total Cost (readonly computed) */}
        <span className="text-sm font-medium text-[var(--color-text)] text-right px-1.5">
          {formatCurrency(materialRowTotal(row))}
        </span>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[var(--color-subtle)] hover:text-red-500 transition-colors rounded-lg"
          aria-label={`Delete ${row.name}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Mobile: stacked card layout (hidden on desktop) ── */}
      <div className="animate-row-in md:hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 space-y-2">
        {/* Top row: Name + Delete */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={row.name}
            onChange={(e) => onChange(row.id, { name: e.target.value })}
            placeholder="Material name"
            className="flex-1 border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm font-medium text-[var(--color-text)] outline-none"
          />
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[var(--color-subtle)] hover:text-red-500 transition-colors rounded-lg"
            aria-label={`Delete ${row.name}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Middle row: #, Unit, Cost/Unit, Units Needed */}
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="text-[10px] font-medium text-[var(--color-muted)] block mb-0.5">#</label>
            <input
              type="number"
              value={row.quantity}
              onChange={(e) =>
                onChange(row.id, {
                  quantity: parseFloat(e.target.value) || 0,
                })
              }
              min={1}
              className="w-full border border-[var(--color-border)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[var(--color-muted)] block mb-0.5">Unit</label>
            <input
              type="text"
              value={row.unit}
              onChange={(e) => onChange(row.id, { unit: e.target.value })}
              placeholder="pc"
              className="w-full border border-[var(--color-border)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[var(--color-muted)] block mb-0.5">Cost/Unit</label>
            <input
              type="number"
              value={row.costPerUnit}
              onChange={(e) =>
                onChange(row.id, {
                  costPerUnit: parseFloat(e.target.value) || 0,
                })
              }
              min={0}
              step={0.01}
              className="w-full border border-[var(--color-border)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-right"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[var(--color-muted)] block mb-0.5">Needed</label>
            <input
              type="number"
              value={row.unitsNeeded}
              onChange={(e) =>
                onChange(row.id, {
                  unitsNeeded: parseFloat(e.target.value) || 0,
                })
              }
              min={0}
              step={0.1}
              className="w-full border border-[var(--color-border)] bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
            />
          </div>
        </div>

        {/* Bottom row: Total */}
        <div className="flex justify-between items-center pt-1 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-muted)]">Total Cost</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {formatCurrency(materialRowTotal(row))}
          </span>
        </div>
      </div>
    </>
  );
}
