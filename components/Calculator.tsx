"use client";
import { useMemo, useState } from "react";
import {
  CalculatorState,
  LaborInputs,
  COGSInputs,
  ProductInfo,
  PricingSettings,
  ExpensesInputs,
  ExpenseRowData,
  MaterialRowData,
} from "@/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculateResults, formatCurrency } from "@/lib/calculations";
import { buildFormulaSteps } from "@/lib/formulaSteps";
import Header from "@/components/Header";
import ProductSection from "@/components/sections/ProductSection";
import COGSSection from "@/components/sections/COGSSection";
import LaborSection from "@/components/sections/LaborSection";
import ExpensesSection from "@/components/sections/ExpensesSection";
import PricingSection from "@/components/sections/PricingSection";
import FormulaBreakdown from "@/components/FormulaBreakdown";
import ResultCard from "@/components/ResultCard";

/**
 * Default state — pre-fills a realistic sticker pricing example.
 * Exported so it can be reused in tests or other modules.
 */
export const defaultState: CalculatorState = {
  product: {
    productName: "Kiss-Cut Stickers",
    materialType: "Glossy Sticker Paper",
  },
  cogs: {
    materials: [
      {
        id: "mat1",
        name: "Itech Vinyl Sticker",
        quantity: 20,
        unit: "pc",
        costPerUnit: 180.0,
        unitsNeeded: 1.0,
      },
      {
        id: "mat2",
        name: "Matte Photo Top",
        quantity: 20,
        unit: "pc",
        costPerUnit: 69.0,
        unitsNeeded: 1.0,
      },
    ],
    quantityProduced: 20,
  },
  labor: {
    enabled: true,
    hourlyRate: 200.0,
    hoursToComplete: 0.15,
    numberOfEmployees: 1,
  },
  expenses: {
    enabled: true,
    rows: [
      {
        id: "ink",
        category: "Ink",
        quantity: 1,
        costPerUnit: 1.86,
      },
      {
        id: "electricity",
        category: "Electricity",
        quantity: 1,
        costPerUnit: 2.0,
      },
    ],
  },
  pricing: {
    profitMargin: 40,
    discountEnabled: true,
    discountPercent: 10,
    taxEnabled: true,
    taxPercent: 12,
  },
};

/**
 * Calculator — master parent component.
 * Single source of state for the entire app.
 * All calculations derived via useMemo.
 * State persisted to localStorage automatically.
 */
export default function Calculator() {
  const [state, setState, reset] = useLocalStorage<CalculatorState>(
    "meowtrics-v2",
    defaultState
  );
  const [resultOpen, setResultOpen] = useState(false);

  const results = useMemo(() => calculateResults(state), [state]);
  const formulaSteps = useMemo(
    () => buildFormulaSteps(state, results),
    [state, results]
  );

  // ── Update helpers ──
  const updateProduct = (updates: Partial<ProductInfo>) =>
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, ...updates },
    }));

  const updateCOGS = (updates: Partial<COGSInputs>) =>
    setState((prev) => ({
      ...prev,
      cogs: { ...prev.cogs, ...updates },
    }));

  const updateLabor = (updates: Partial<LaborInputs>) =>
    setState((prev) => ({
      ...prev,
      labor: { ...prev.labor, ...updates },
    }));

  const updateExpenses = (updates: Partial<ExpensesInputs>) =>
    setState((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, ...updates },
    }));

  const updateExpenseRows = (rows: ExpenseRowData[]) =>
    setState((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, rows },
    }));

  const updateMaterialRows = (materials: MaterialRowData[]) =>
    setState((prev) => ({
      ...prev,
      cogs: { ...prev.cogs, materials },
    }));

  const updatePricing = (updates: Partial<PricingSettings>) =>
    setState((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, ...updates },
    }));

  return (
    <div className="min-h-screen">
      <Header />

      {/* Page hero */}
      <div className="max-w-[680px] mx-auto px-4 pt-8 pb-4">
        <div
          className="text-center space-y-2 animate-fade-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <h2 className="font-heading text-3xl font-bold text-[var(--color-text)]">
            Sticker Pricing Calculator
          </h2>
          <p className="text-[var(--color-muted)] text-sm">
            Smart metrics for every business. Know your costs. Price with
            confidence.
          </p>
        </div>
      </div>

      {/* Calculator sections */}
      <div className="max-w-[680px] mx-auto px-4 pb-8 space-y-4">
        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "50ms" }}
        >
          <ProductSection
            product={state.product}
            onChange={updateProduct}
          />
        </div>

        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <COGSSection
            cogs={state.cogs}
            materialCostPerProduct={results.materialCostPerProduct}
            totalMaterialCost={
              state.cogs.materials.reduce(
                (sum, row) => {
                  const qty = Math.max(1, row.quantity);
                  return sum + (row.costPerUnit / qty) * row.unitsNeeded;
                },
                0
              )
            }
            onChange={updateCOGS}
            onUpdateMaterials={updateMaterialRows}
          />
        </div>

        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          <LaborSection
            labor={state.labor}
            laborCost={results.laborCost}
            laborCostPerProduct={results.laborCostPerProduct}
            onChange={updateLabor}
          />
        </div>

        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <ExpensesSection
            expenses={state.expenses}
            totalOtherExpenses={results.totalOtherExpenses}
            otherExpensesPerProduct={results.otherExpensesPerProduct}
            onChange={updateExpenses}
            onUpdateRows={updateExpenseRows}
          />
        </div>

        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "250ms" }}
        >
          <PricingSection
            pricing={state.pricing}
            onChange={updatePricing}
          />
        </div>

        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <FormulaBreakdown steps={formulaSteps} />
        </div>

        {/* View Results button */}
        <div
          className="animate-fade-slide-up"
          style={{ animationDelay: "350ms" }}
        >
          <button
            type="button"
            onClick={() => setResultOpen(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-heading font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>View Results</span>
            <span className="text-xl">🐱</span>
            <span className="text-sm font-normal opacity-80">
              {formatCurrency(results.finalPrice)}
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer
          className="animate-fade-slide-up text-center py-8 space-y-1"
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-sm text-[var(--color-muted)]">
            🐱 Built with love by{" "}
            <span className="font-heading font-bold text-[var(--color-primary)]">
              Meowtrics
            </span>
          </p>
          <p className="text-xs text-[var(--color-subtle)]">
            Your numbers, purrfected. © {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* Result popup modal */}
      <ResultCard
        state={state}
        results={results}
        onReset={reset}
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
      />
    </div>
  );
}
