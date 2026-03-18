"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ExpensesInputs, ExpenseRowData } from "@/types/calculator";
import SectionCard from "@/components/ui/SectionCard";
import ExpenseRow from "@/components/ui/ExpenseRow";
import { formatCurrency, generateId } from "@/lib/calculations";

/**
 * ExpensesSection — toggleable dynamic expense table.
 * Supports adding/deleting rows with entry/exit animations.
 * Shows per-product and total costs.
 */
interface ExpensesSectionProps {
  expenses: ExpensesInputs;
  totalOtherExpenses: number;
  otherExpensesPerProduct: number;
  onChange: (updates: Partial<ExpensesInputs>) => void;
  onUpdateRows: (rows: ExpenseRowData[]) => void;
}

export default function ExpensesSection({
  expenses,
  totalOtherExpenses,
  otherExpensesPerProduct,
  onChange,
  onUpdateRows,
}: ExpensesSectionProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newRow: ExpenseRowData = {
      id: generateId(),
      category: "",
      quantity: 1,
      costPerUnit: 0,
    };
    onUpdateRows([...expenses.rows, newRow]);
  };

  const handleRowChange = (
    id: string,
    updates: Partial<ExpenseRowData>
  ) => {
    onUpdateRows(
      expenses.rows.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      )
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onUpdateRows(expenses.rows.filter((r) => r.id !== id));
      setDeletingId(null);
    }, 150);
  };

  return (
    <SectionCard
      icon="🧾"
      title="Other Expenses"
      toggleable
      enabled={expenses.enabled}
      onToggle={() => onChange({ enabled: !expenses.enabled })}
    >
      {/* Table header (desktop only — mobile uses card layout) */}
      <div className="hidden md:grid grid-cols-[1fr_60px_90px_90px_36px] gap-2 text-xs font-medium text-[var(--color-muted)] pb-1 border-b border-[var(--color-border)]">
        <span>Category</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Cost/Unit</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {expenses.rows.map((row) => (
          <div
            key={row.id}
            className="transition-opacity duration-150"
            style={{
              opacity: deletingId === row.id ? 0 : 1,
            }}
          >
            <ExpenseRow
              row={row}
              onChange={handleRowChange}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
        <span className="text-sm text-[var(--color-muted)]">Total:</span>
        <span className="text-sm font-bold text-[var(--color-text)]">
          {formatCurrency(totalOtherExpenses)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--color-muted)]">
          Per Product:
        </span>
        <span className="text-sm font-medium text-[var(--color-text)]">
          {formatCurrency(otherExpensesPerProduct)}
        </span>
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary)]/10 transition-colors"
      >
        <Plus size={16} />
        Add Expense
      </button>

      {/* Inline pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] dark:bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
          🧾 Other expenses per sticker:{" "}
          {formatCurrency(otherExpensesPerProduct)}
        </span>
      </div>
    </SectionCard>
  );
}
