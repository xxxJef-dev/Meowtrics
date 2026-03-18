"use client";
import { X } from "lucide-react";
import { ExpenseRowData } from "@/types/calculator";
import { expenseRowTotal, formatCurrency } from "@/lib/calculations";

/**
 * ExpenseRow — a single row in the expenses table.
 * Desktop: inline grid row. Mobile: stacked card layout.
 */
interface ExpenseRowProps {
  row: ExpenseRowData;
  onChange: (id: string, updates: Partial<ExpenseRowData>) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseRow({
  row,
  onChange,
  onDelete,
}: ExpenseRowProps) {
  return (
    <>
      {/* ── Desktop: inline grid row (hidden on mobile) ── */}
      <div className="animate-row-in hidden md:grid grid-cols-[1fr_60px_90px_90px_36px] gap-2 items-center">
        {/* Category */}
        <input
          type="text"
          value={row.category}
          onChange={(e) =>
            onChange(row.id, { category: e.target.value })
          }
          placeholder="Category"
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none"
        />

        {/* Quantity */}
        <input
          type="number"
          value={row.quantity}
          onChange={(e) =>
            onChange(row.id, {
              quantity: parseFloat(e.target.value) || 0,
            })
          }
          min={0}
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-center"
        />

        {/* Cost per Unit */}
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
          className="border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm text-[var(--color-text)] outline-none text-right"
        />

        {/* Total (readonly computed) */}
        <span className="text-sm font-medium text-[var(--color-text)] text-right px-2">
          {formatCurrency(expenseRowTotal(row))}
        </span>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[var(--color-subtle)] hover:text-red-500 transition-colors rounded-lg"
          aria-label={`Delete ${row.category}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Mobile: stacked card layout (hidden on desktop) ── */}
      <div className="animate-row-in md:hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 space-y-2">
        {/* Top row: Category + Delete */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={row.category}
            onChange={(e) =>
              onChange(row.id, { category: e.target.value })
            }
            placeholder="Category"
            className="flex-1 border-0 bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] rounded-lg px-2 py-1.5 min-h-[36px] text-sm font-medium text-[var(--color-text)] outline-none"
          />
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[var(--color-subtle)] hover:text-red-500 transition-colors rounded-lg"
            aria-label={`Delete ${row.category}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Middle row: Qty + Cost/Unit */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium text-[var(--color-muted)] block mb-0.5">Qty</label>
            <input
              type="number"
              value={row.quantity}
              onChange={(e) =>
                onChange(row.id, {
                  quantity: parseFloat(e.target.value) || 0,
                })
              }
              min={0}
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
        </div>

        {/* Bottom row: Total */}
        <div className="flex justify-between items-center pt-1 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-muted)]">Total</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {formatCurrency(expenseRowTotal(row))}
          </span>
        </div>
      </div>
    </>
  );
}
