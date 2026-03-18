"use client";
import { useState, useEffect } from "react";
import { ChevronUp, Clipboard, Check, RotateCcw } from "lucide-react";
import { CalculatorState, CalculatorResults } from "@/types/calculator";
import MascotBadge from "@/components/ui/MascotBadge";
import {
  formatCurrency,
  formatPercent,
  getProfitEmoji,
  getProfitMessage,
  materialRowTotal,
} from "@/lib/calculations";

/**
 * ResultCard — the most important component.
 * Shows complete pricing breakdown, final price (text-5xl),
 * mascot reaction, copy & reset buttons.
 * Mobile: compact sticky bar at bottom with expandable bottom sheet.
 */
interface ResultCardProps {
  state: CalculatorState;
  results: CalculatorResults;
  onReset: () => void;
}

export default function ResultCard({
  state,
  results: r,
  onReset,
}: ResultCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setSheetOpen(false);
      setClosing(false);
    }, 300);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatCurrency(r.finalPrice));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const profitVariant =
    r.profitStatus === "great"
      ? "success"
      : r.profitStatus === "okay"
        ? "info"
        : r.profitStatus === "thin"
          ? "warning"
          : "danger";

  // ── Full card content (shared between desktop and mobile sheet) ──
  const cardContent = (isSheet = false) => (
    <div className={`bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white overflow-hidden ${isSheet ? 'rounded-none' : 'rounded-2xl'}`}>
      {/* Product header */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl md:text-2xl">🐱</span>
          <h3 className="font-heading font-bold text-lg md:text-xl">
            {state.product.productName || "Untitled Product"}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-white/70 ml-8 md:ml-9">
          {state.product.materialType || "No material specified"}
        </p>
      </div>

      {/* COGS Breakdown */}
      <div className="mx-4 md:mx-6 bg-white/10 rounded-xl p-3 md:p-4 space-y-1.5 md:space-y-2">
        <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white/70 mb-2 md:mb-3">
          COGS Breakdown
        </h4>
        <div className="flex justify-between text-xs md:text-sm">
          <span>Material Cost</span>
          <span>{formatCurrency(state.cogs.materials.reduce((sum, row) => sum + materialRowTotal(row), 0))}</span>
        </div>
        {state.labor.enabled && (
          <div className="flex justify-between text-xs md:text-sm">
            <span>Labor Cost</span>
            <span>{formatCurrency(r.laborCost)}</span>
          </div>
        )}
        {state.expenses.enabled && r.totalOtherExpenses > 0 && (
          <div className="flex justify-between text-xs md:text-sm">
            <span>Other Expenses</span>
            <span>{formatCurrency(r.totalOtherExpenses)}</span>
          </div>
        )}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="flex justify-between text-xs md:text-sm font-bold">
            <span>COGS Total</span>
            <span>{formatCurrency(r.cogsTotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] md:text-xs text-white/70 mt-1">
            <span>COGS per Product</span>
            <span>{formatCurrency(r.cogsPerProduct)}</span>
          </div>
        </div>
      </div>

      {/* Selling Price Details */}
      <div className="px-4 md:px-6 py-3 md:py-4 space-y-1.5 md:space-y-2 border-t border-white/10 mt-3 md:mt-4">
        <div className="flex justify-between text-xs md:text-sm">
          <span>Selling Price</span>
          <span>{formatCurrency(r.sellingPriceTotal)}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span>Sheet Price</span>
          <span>{formatCurrency(r.sheetPrice)}</span>
        </div>
        {state.pricing.discountEnabled && (
          <>
            <div className="flex justify-between text-xs md:text-sm text-white/80">
              <span>
                Discount ({formatPercent(state.pricing.discountPercent)})
              </span>
              <span>−{formatCurrency(r.discountAmount)}</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span>Discounted Price</span>
              <span>{formatCurrency(r.discountedPrice)}</span>
            </div>
          </>
        )}
        {state.pricing.taxEnabled && (
          <div className="flex justify-between text-xs md:text-sm text-white/80">
            <span>
              Sales Tax ({formatPercent(state.pricing.taxPercent)})
            </span>
            <span>+{formatCurrency(r.taxAmount)}</span>
          </div>
        )}
      </div>

      {/* FINAL PRICE — largest text on page */}
      <div className="px-4 md:px-6 py-4 md:py-6 text-center border-t border-white/10">
        <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/70 mb-1 md:mb-2">
          Final Price
        </p>
        <p className="text-3xl md:text-5xl font-black tracking-tight font-heading">
          {formatCurrency(r.finalPrice)}
        </p>
        <p className="text-base md:text-xl text-white/90 mt-1">
          {formatCurrency(r.finalPricePerProduct)} per sticker
        </p>
      </div>

      {/* Profit summary */}
      <div className="px-4 md:px-6 py-3 md:py-4 space-y-1.5 md:space-y-2 border-t border-white/10">
        <div className="flex justify-between text-xs md:text-sm">
          <span>Profit per sticker</span>
          <span>{formatCurrency(r.estimatedProfitPerProduct)}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span>Total estimated profit</span>
          <span>{formatCurrency(r.estimatedProfitTotal)}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span>Actual margin</span>
          <span>{formatPercent(r.actualMarginPercent)}</span>
        </div>

        {/* Mascot badge */}
        <div className="flex justify-center pt-2 md:pt-3">
          <MascotBadge
            emoji={getProfitEmoji(r.profitStatus)}
            message={getProfitMessage(r.profitStatus)}
            variant={profitVariant}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row gap-2 md:gap-3 border-t border-white/10 pb-[env(safe-area-inset-bottom,12px)]">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-xs md:text-sm font-medium"
        >
          {copied ? (
            <Check size={16} />
          ) : (
            <Clipboard size={16} />
          )}
          {copied ? "Copied!" : "Copy Final Price"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs md:text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  // ── Desktop: inline card ──
  if (!isMobile) {
    return <div className="mt-4">{cardContent()}</div>;
  }

  // ── Mobile: sticky bar + bottom sheet ──
  return (
    <>
      {/* Compact sticky bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-2xl cursor-pointer"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={() => setSheetOpen(true)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Final Price
            </p>
            <p className="text-xl font-black font-heading">
              {formatCurrency(r.finalPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/80">
              {formatCurrency(r.finalPricePerProduct)}/pc
            </p>
            <ChevronUp size={18} className="text-white/70" />
          </div>
        </div>
      </div>

      {/* Bottom padding so content doesn't hide behind bar */}
      <div className="h-20" />

      {/* Bottom sheet overlay + sheet */}
      {sheetOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 ${
              closing ? "animate-fade-out" : "animate-fade-in"
            }`}
            onClick={handleClose}
          />
          {/* Sheet */}
          <div
            className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              closing ? "animate-sheet-down" : "animate-sheet-up"
            }`}
          >
            {/* Drag handle — tap to close */}
            <div
              className="sticky top-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-t-3xl pt-2 pb-2 flex flex-col items-center z-10 cursor-pointer"
              onClick={handleClose}
            >
              <div className="w-12 h-1.5 rounded-full bg-white/30 mb-1" />
              <span className="text-[10px] text-white/50 tracking-wide uppercase">Tap to close</span>
            </div>
            {cardContent(true)}
          </div>
        </>
      )}
    </>
  );
}
