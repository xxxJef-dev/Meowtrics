import {
  CalculatorState,
  CalculatorResults,
  FormulaStep,
} from "@/types/calculator";
import { formatCurrency, formatPercent, materialRowTotal } from "./calculations";

/**
 * Builds a human-readable formula trail for the FormulaBreakdown component.
 * Each step shows label, formula string, and computed result.
 */
export function buildFormulaSteps(
  state: CalculatorState,
  r: CalculatorResults
): FormulaStep[] {
  const steps: FormulaStep[] = [];
  const c = (v: number) => formatCurrency(v);
  const p = (v: number) => formatPercent(v);
  const qty = Math.max(1, state.cogs.quantityProduced);

  // Step 1 — Material cost per product
  const totalMaterialCost = state.cogs.materials.reduce(
    (sum, row) => sum + materialRowTotal(row),
    0
  );
  steps.push({
    label: "Total Material Cost",
    formula: state.cogs.materials.length > 0
      ? `Sum of ${state.cogs.materials.length} material(s)`
      : `No materials added`,
    result: c(totalMaterialCost),
  });
  steps.push({
    label: "Material Cost per Product",
    formula: `Total Material Cost ÷ Quantity = ${c(totalMaterialCost)} ÷ ${qty}`,
    result: c(r.materialCostPerProduct),
  });

  // Step 2 — Labor cost (if enabled)
  if (state.labor.enabled) {
    steps.push({
      label: "Labor Cost",
      formula: `Hourly Rate × Hours × Employees = ${c(state.labor.hourlyRate)} × ${state.labor.hoursToComplete} × ${state.labor.numberOfEmployees}`,
      result: c(r.laborCost),
    });
  }

  // Step 3 — Other expenses (if enabled)
  if (state.expenses.enabled && r.totalOtherExpenses > 0) {
    steps.push({
      label: "Total Other Expenses",
      formula: `Sum of all expense rows`,
      result: c(r.totalOtherExpenses),
    });
  }

  // Step 4 — COGS
  const cogsParts = [`Material ${c(totalMaterialCost)}`];
  if (state.labor.enabled) cogsParts.push(`Labor ${c(r.laborCost)}`);
  if (state.expenses.enabled)
    cogsParts.push(`Expenses ${c(r.totalOtherExpenses)}`);
  steps.push({
    label: "Total COGS",
    formula: cogsParts.join(" + "),
    result: c(r.cogsTotal),
  });

  steps.push({
    label: "COGS per Product",
    formula: `COGS Total ÷ Quantity = ${c(r.cogsTotal)} ÷ ${qty}`,
    result: c(r.cogsPerProduct),
  });

  // Step 5 — Selling price
  steps.push({
    label: "Selling Price per Product",
    formula: `COGS per Product × (1 + ${p(state.pricing.profitMargin)}) = ${c(r.cogsPerProduct)} × ${(1 + state.pricing.profitMargin / 100).toFixed(2)}`,
    result: c(r.sellingPricePerProduct),
  });

  steps.push({
    label: "Sheet Price (Total)",
    formula: `Selling Price per Product × Quantity = ${c(r.sellingPricePerProduct)} × ${qty}`,
    result: c(r.sheetPrice),
  });

  // Step 6 — Discount (if enabled)
  if (state.pricing.discountEnabled) {
    steps.push({
      label: `Discount (${p(state.pricing.discountPercent)})`,
      formula: `Selling Price Total × ${p(state.pricing.discountPercent)} = ${c(r.sellingPriceTotal)} × ${(state.pricing.discountPercent / 100).toFixed(2)}`,
      result: `−${c(r.discountAmount)}`,
    });
    steps.push({
      label: "Discounted Price",
      formula: `${c(r.sellingPriceTotal)} − ${c(r.discountAmount)}`,
      result: c(r.discountedPrice),
    });
  }

  // Step 7 — Tax (if enabled)
  if (state.pricing.taxEnabled) {
    steps.push({
      label: `Sales Tax (${p(state.pricing.taxPercent)})`,
      formula: `Discounted Price × ${p(state.pricing.taxPercent)} = ${c(r.discountedPrice)} × ${(state.pricing.taxPercent / 100).toFixed(2)}`,
      result: `+${c(r.taxAmount)}`,
    });
  }

  // Step 8 — Final price
  steps.push({
    label: "Final Price",
    formula:
      state.pricing.discountEnabled || state.pricing.taxEnabled
        ? `${c(r.discountedPrice)} + Tax ${c(r.taxAmount)}`
        : `Same as Selling Price Total`,
    result: c(r.finalPrice),
  });

  steps.push({
    label: "Final Price per Product",
    formula: `Final Price ÷ Quantity = ${c(r.finalPrice)} ÷ ${qty}`,
    result: c(r.finalPricePerProduct),
  });

  // Step 9 — Profit
  steps.push({
    label: "Estimated Profit (per unit)",
    formula: `Selling Price per Product − COGS per Product = ${c(r.sellingPricePerProduct)} − ${c(r.cogsPerProduct)}`,
    result: c(r.estimatedProfitPerProduct),
  });

  steps.push({
    label: "Estimated Profit (total)",
    formula: `Final Price − COGS Total = ${c(r.finalPrice)} − ${c(r.cogsTotal)}`,
    result: c(r.estimatedProfitTotal),
  });

  return steps;
}
