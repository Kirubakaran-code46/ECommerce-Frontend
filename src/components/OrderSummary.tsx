import React from 'react'
import { ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import type { CheckoutResponse } from '../types/checkout'
import { formatPaise } from '../utils/currency'

interface OrderSummaryProps {
  checkoutData: CheckoutResponse | null | undefined
  tentativeSubtotal: number
  isCalculating: boolean
  cartIsEmpty: boolean
  onCheckout: () => void
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkoutData,
  tentativeSubtotal,
  isCalculating,
  cartIsEmpty,
  onCheckout,
}) => {
  const subtotal = checkoutData ? checkoutData.subtotal : tentativeSubtotal
  const discount = checkoutData ? checkoutData.discount : 0
  const total = checkoutData ? checkoutData.total : tentativeSubtotal

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 text-base">Order Summary</h3>
        {isCalculating && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Calculating...</span>
          </div>
        )}
      </div>

      {/* Breakdown lines */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">{formatPaise(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discount</span>
              {checkoutData?.coupon && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-mono">
                  {checkoutData.coupon.code}
                </span>
              )}
            </span>
            <span className="font-bold">-{formatPaise(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 block">Total</span>
            <span className="text-[11px] text-slate-400">Inclusive of all taxes</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatPaise(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={onCheckout}
        disabled={cartIsEmpty || isCalculating}
        className="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 cursor-pointer"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying with Backend...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Trust & Verification info */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Prices & discounts authoritatively verified by backend</span>
      </div>
    </div>
  )
}
