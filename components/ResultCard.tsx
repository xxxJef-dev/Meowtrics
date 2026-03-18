"use client";
import { useState, useEffect, useCallback } from "react";
import { Clipboard, Check, RotateCcw, X } from "lucide-react";
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
 * ResultCard — popup modal that shows the complete pricing breakdown,
 * final price, mascot reaction, copy & reset buttons.
 * Triggered by isOpen prop; calls onClose to dismiss.
 */
interface ResultCardProps {
  state: CalculatorState;
  results: CalculatorResults;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultCard({
  state,
  results: r,
  onReset,
  isOpen,
  onClose,
}: ResultCardProps) {
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm ${
          closing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            closing ? "animate-modal-out" : "animate-modal-in"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white rounded-2xl">
            {/* Product header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🐱</span>
                <h3 className="font-heading font-bold text-lg pr-8">
                  {state.product.productName || "Untitled Product"}
                </h3>
              </div>
              <p className="text-xs text-white/70 ml-9">
                {state.product.materialType || "No material specified"}
              </p>
            </div>

            {/* COGS Breakdown */}
            <div className="mx-5 bg-white/10 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-2">
                COGS Breakdown
              </h4>
              <div className="flex justify-between text-sm">
                <span>Material Cost</span>
                <span>
                  {formatCurrency(
                    state.cogs.materials.reduce(
                      (sum, row) => sum + materialRowTotal(row),
                      0
                    )
                  )}
                </span>
              </div>
              {state.labor.enabled && (
                <div className="flex justify-between text-sm">
                  <span>Labor Cost</span>
                  <span>{formatCurrency(r.laborCost)}</span>
                </div>
              )}
              {state.expenses.enabled && r.totalOtherExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Other Expenses</span>
                  <span>{formatCurrency(r.totalOtherExpenses)}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>COGS Total</span>
                  <span>{formatCurrency(r.cogsTotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-white/70 mt-1">
                  <span>COGS per Product</span>
                  <span>{formatCurrency(r.cogsPerProduct)}</span>
                </div>
              </div>
            </div>

            {/* Selling Price Details */}
            <div className="px-5 py-4 space-y-2 border-t border-white/10 mt-4">
              <div className="flex justify-between text-sm">
                <span>Selling Price</span>
                <span>{formatCurrency(r.sellingPriceTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sheet Price</span>
                <span>{formatCurrency(r.sheetPrice)}</span>
              </div>
              {state.pricing.discountEnabled && (
                <>
                  <div className="flex justify-between text-sm text-white/80">
                    <span>
                      Discount ({formatPercent(state.pricing.discountPercent)})
                    </span>
                    <span>−{formatCurrency(r.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discounted Price</span>
                    <span>{formatCurrency(r.discountedPrice)}</span>
                  </div>
                </>
              )}
              {state.pricing.taxEnabled && (
                <div className="flex justify-between text-sm text-white/80">
                  <span>
                    Sales Tax ({formatPercent(state.pricing.taxPercent)})
                  </span>
                  <span>+{formatCurrency(r.taxAmount)}</span>
                </div>
              )}
            </div>

            {/* FINAL PRICE */}
            <div className="px-5 py-5 text-center border-t border-white/10">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-1">
                Final Price
              </p>
              <p className="text-4xl font-black tracking-tight font-heading">
                {formatCurrency(r.finalPrice)}
              </p>
              <p className="text-lg text-white/90 mt-1">
                {formatCurrency(r.finalPricePerProduct)} per sticker
              </p>
            </div>

            {/* Profit summary */}
            <div className="px-5 py-4 space-y-2 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span>Profit per sticker</span>
                <span>{formatCurrency(r.estimatedProfitPerProduct)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total estimated profit</span>
                <span>{formatCurrency(r.estimatedProfitTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Actual margin</span>
                <span>{formatPercent(r.actualMarginPercent)}</span>
              </div>

              {/* Mascot badge */}
              <div className="flex justify-center pt-3">
                <MascotBadge
                  emoji={getProfitEmoji(r.profitStatus)}
                  message={getProfitMessage(r.profitStatus)}
                  variant={profitVariant}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-5 py-4 flex gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
                {copied ? "Copied!" : "Copy Price"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  handleClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
