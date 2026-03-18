import {
  CalculatorState,
  CalculatorResults,
  ExpenseRowData,
  MaterialRowData,
  ProfitStatus,
} from "@/types/calculator";

/**
 * Clamps a number to be at least `min`, returning `min` for NaN/Infinity.
 * Use this on every raw number input — never call parseFloat without it.
 */
export function safe(n: number, min = 0): number {
  return isNaN(n) || !isFinite(n) ? min : Math.max(min, n);
}

/**
 * Main calculation engine — derives all results from calculator state.
 * Pure function, no side effects.
 */
export function calculateResults(
  state: CalculatorState
): CalculatorResults {
  const qty = safe(state.cogs.quantityProduced, 1);

  // ── Material ──────────────────────────────────────────
  const materialCost = state.cogs.materials.reduce(
    (sum, row) => sum + materialRowTotal(row),
    0
  );
  const materialCostPerProduct = materialCost / qty;

  // ── Labor ─────────────────────────────────────────────
  const laborCost = state.labor.enabled
    ? safe(state.labor.hourlyRate) *
    safe(state.labor.hoursToComplete) *
    safe(state.labor.numberOfEmployees, 1)
    : 0;
  const laborCostPerProduct = laborCost / qty;

  // ── Other Expenses ────────────────────────────────────
  const totalOtherExpenses = state.expenses.enabled
    ? state.expenses.rows.reduce(
      (sum, row) => sum + safe(row.quantity) * safe(row.costPerUnit),
      0
    )
    : 0;
  const otherExpensesPerProduct = totalOtherExpenses / qty;

  // ── COGS ──────────────────────────────────────────────
  const cogsTotal = materialCost + laborCost + totalOtherExpenses;
  const cogsPerProduct = cogsTotal / qty;

  // ── Selling Price ─────────────────────────────────────
  const sellingPricePerProduct =
    cogsPerProduct * (1 + safe(state.pricing.profitMargin) / 100);
  const sellingPriceTotal = sellingPricePerProduct * qty;
  const sheetPrice = sellingPricePerProduct * qty;

  // ── Discount ──────────────────────────────────────────
  const discountAmount = state.pricing.discountEnabled
    ? sellingPriceTotal *
    (Math.min(100, safe(state.pricing.discountPercent)) / 100)
    : 0;
  const discountedPrice = sellingPriceTotal - discountAmount;

  // ── Tax ───────────────────────────────────────────────
  const taxAmount = state.pricing.taxEnabled
    ? discountedPrice * (safe(state.pricing.taxPercent) / 100)
    : 0;

  // ── Final Price ───────────────────────────────────────
  const finalPrice = discountedPrice + taxAmount;
  const finalPricePerProduct = finalPrice / qty;

  // ── Profit ────────────────────────────────────────────
  const estimatedProfitPerProduct =
    sellingPricePerProduct - cogsPerProduct;
  const estimatedProfitTotal = finalPrice - cogsTotal;
  const actualMarginPercent =
    cogsTotal > 0 ? ((finalPrice - cogsTotal) / cogsTotal) * 100 : 0;

  const profitStatus = getProfitStatus(safe(state.pricing.profitMargin));

  return {
    materialCostPerProduct,
    laborCost,
    laborCostPerProduct,
    totalOtherExpenses,
    otherExpensesPerProduct,
    cogsTotal,
    cogsPerProduct,
    sellingPricePerProduct,
    sellingPriceTotal,
    sheetPrice,
    discountAmount,
    discountedPrice,
    taxAmount,
    finalPrice,
    finalPricePerProduct,
    estimatedProfitPerProduct,
    estimatedProfitTotal,
    actualMarginPercent,
    profitStatus,
  };
}

/** Calculates the total cost of a single expense row. */
export function expenseRowTotal(row: ExpenseRowData): number {
  return safe(row.quantity) * safe(row.costPerUnit);
}

/** Calculates the total cost of a single material row. */
export function materialRowTotal(row: MaterialRowData): number {
  const qty = safe(row.quantity, 1);
  return (safe(row.costPerUnit) / qty) * safe(row.unitsNeeded);
}

/** Maps a margin percentage to a profit status tier. */
export function getProfitStatus(margin: number): ProfitStatus {
  if (margin >= 40) return "great";
  if (margin >= 20) return "okay";
  if (margin > 0) return "thin";
  return "none";
}

/** Returns the mascot emoji for a given profit status. */
export function getProfitEmoji(status: ProfitStatus): string {
  const map: Record<ProfitStatus, string> = {
    great: "😸",
    okay: "🐱",
    thin: "🙀",
    none: "😿",
  };
  return map[status];
}

/** Returns the mascot message for a given profit status. */
export function getProfitMessage(status: ProfitStatus): string {
  const map: Record<ProfitStatus, string> = {
    great: "Purrfect margins!",
    okay: "Looking good — room to grow.",
    thin: "Cutting it close... raise your margin.",
    none: "No profit at 0%. Meowtrics is worried.",
  };
  return map[status];
}

/** Formats a number as currency with the given symbol. */
export function formatCurrency(value: number, symbol = "₱"): string {
  return `${symbol}${value.toFixed(2)}`;
}

/** Formats a number as a percentage string. */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Generates a short random ID for dynamic expense rows. */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
