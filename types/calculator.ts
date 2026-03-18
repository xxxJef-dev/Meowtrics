// ── Section 1: Product ─────────────────────────────────
export interface ProductInfo {
  productName: string;
  materialType: string;
}

// ── Section 2: COGS ────────────────────────────────────
export interface MaterialRowData {
  id: string;
  name: string;          // e.g. "Itech Vinyl Sticker"
  quantity: number;       // # purchased (e.g. 20)
  unit: string;           // "pc", "sheet", "roll"
  costPerUnit: number;    // total cost for the purchased qty (e.g. ₱180.00)
  unitsNeeded: number;    // units needed per 1 product (e.g. 1.0)
}

export interface COGSInputs {
  materials: MaterialRowData[];
  quantityProduced: number;
}

// ── Section 3: Labor ───────────────────────────────────
export interface LaborInputs {
  enabled: boolean;
  hourlyRate: number;
  hoursToComplete: number;
  numberOfEmployees: number;
}

// ── Section 4: Other Expenses ──────────────────────────
export interface ExpenseRowData {
  id: string;
  category: string;
  quantity: number;
  costPerUnit: number;
}

export interface ExpensesInputs {
  enabled: boolean;
  rows: ExpenseRowData[];
}

// ── Section 5: Pricing Settings ────────────────────────
export interface PricingSettings {
  profitMargin: number;
  discountEnabled: boolean;
  discountPercent: number;
  taxEnabled: boolean;
  taxPercent: number;
}

// ── Master State ───────────────────────────────────────
export interface CalculatorState {
  product: ProductInfo;
  cogs: COGSInputs;
  labor: LaborInputs;
  expenses: ExpensesInputs;
  pricing: PricingSettings;
}

// ── Computed Results ───────────────────────────────────
export interface CalculatorResults {
  materialCostPerProduct: number;
  laborCost: number;
  laborCostPerProduct: number;
  totalOtherExpenses: number;
  otherExpensesPerProduct: number;
  cogsTotal: number;
  cogsPerProduct: number;
  sellingPricePerProduct: number;
  sellingPriceTotal: number;
  sheetPrice: number;
  discountAmount: number;
  discountedPrice: number;
  taxAmount: number;
  finalPrice: number;
  finalPricePerProduct: number;
  estimatedProfitPerProduct: number;
  estimatedProfitTotal: number;
  actualMarginPercent: number;
  profitStatus: ProfitStatus;
}

export type ProfitStatus = "great" | "okay" | "thin" | "none";

// ── Formula Step (for FormulaBreakdown component) ──────
export interface FormulaStep {
  label: string;
  formula: string;
  result: string;
}
