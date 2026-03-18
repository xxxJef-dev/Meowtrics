"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { COGSInputs, MaterialRowData } from "@/types/calculator";
import SectionCard from "@/components/ui/SectionCard";
import InputField from "@/components/ui/InputField";
import MaterialRow from "@/components/ui/MaterialRow";
import { formatCurrency, generateId } from "@/lib/calculations";

/**
 * COGSSection — material cost table and quantity produced.
 * Users add material rows (spreadsheet-style) and the total
 * material cost is auto-calculated. Always visible, no toggle.
 */
interface COGSSectionProps {
  cogs: COGSInputs;
  materialCostPerProduct: number;
  totalMaterialCost: number;
  onChange: (updates: Partial<COGSInputs>) => void;
  onUpdateMaterials: (materials: MaterialRowData[]) => void;
}

export default function COGSSection({
  cogs,
  materialCostPerProduct,
  totalMaterialCost,
  onChange,
  onUpdateMaterials,
}: COGSSectionProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newRow: MaterialRowData = {
      id: generateId(),
      name: "",
      quantity: 1,
      unit: "pc",
      costPerUnit: 0,
      unitsNeeded: 1,
    };
    onUpdateMaterials([...cogs.materials, newRow]);
  };

  const handleRowChange = (
    id: string,
    updates: Partial<MaterialRowData>
  ) => {
    onUpdateMaterials(
      cogs.materials.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      )
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onUpdateMaterials(cogs.materials.filter((r) => r.id !== id));
      setDeletingId(null);
    }, 150);
  };

  return (
    <SectionCard icon="💰" title="Cost of Goods (COGS)">
      {/* Section subtitle */}
      <p className="text-xs text-[var(--color-muted)] -mt-1">
        Enter all materials you&apos;ve used to produce 1 product
      </p>

      {/* Table header (desktop only — mobile uses card layout with inline labels) */}
      <div className="hidden md:grid grid-cols-[1fr_50px_50px_80px_60px_80px_36px] gap-1.5 text-[10px] font-medium text-[var(--color-muted)] pb-1 border-b border-[var(--color-border)]">
        <span>Material</span>
        <span className="text-center">#</span>
        <span className="text-center">Unit</span>
        <span className="text-right">Cost/Unit</span>
        <span className="text-center">Needed</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      {/* Material rows */}
      <div className="space-y-1">
        {cogs.materials.map((row) => (
          <div
            key={row.id}
            className="transition-opacity duration-150"
            style={{
              opacity: deletingId === row.id ? 0 : 1,
            }}
          >
            <MaterialRow
              row={row}
              onChange={handleRowChange}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary)]/10 transition-colors"
      >
        <Plus size={16} />
        Add Material
      </button>

      {/* Material cost total */}
      <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
        <span className="text-sm text-[var(--color-muted)]">
          Total Material Cost:
        </span>
        <span className="text-sm font-bold text-[var(--color-text)]">
          {formatCurrency(totalMaterialCost)}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--color-border)]" />

      {/* Quantity Produced */}
      <InputField
        label="Quantity Produced"
        tooltip="Total number of sticker pieces produced"
        value={cogs.quantityProduced}
        onChange={(v) =>
          onChange({ quantityProduced: Math.max(1, parseFloat(v) || 1) })
        }
        type="number"
        suffix="pcs"
        min={1}
        step={1}
      />

      {/* Divider */}
      <div className="border-t border-[var(--color-border)]" />

      <InputField
        label="Cost per Product"
        value={formatCurrency(materialCostPerProduct)}
        onChange={() => {}}
        readOnly
      />

      {/* Inline pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] dark:bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
          📦 Material cost per sticker: {formatCurrency(materialCostPerProduct)}
        </span>
      </div>
    </SectionCard>
  );
}
