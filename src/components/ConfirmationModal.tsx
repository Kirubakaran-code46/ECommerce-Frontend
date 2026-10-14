import React from 'react'
import { CheckCircle2, ShoppingBag, X } from 'lucide-react'
import type { CheckoutResponse } from '../types/checkout'
import { formatPaise } from '../utils/currency'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  checkoutData: CheckoutResponse | null
  onNewOrder: () => void
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  checkoutData,
  onNewOrder,
}) => {
  if (!isOpen || !checkoutData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Backend order calculation verified. Thank you for your purchase.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Purchased Items ({checkoutData.items.length})
          </div>

          <div className="divide-y divide-slate-200/60 max-h-48 overflow-y-auto pr-1">
            {checkoutData.items.map((item) => (
              <div key={item.product_id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900">{item.name}</span>
                  <span className="text-slate-500 ml-1.5">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {formatPaise(item.line_total)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPaise(checkoutData.subtotal)}</span>
            </div>
            {checkoutData.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({checkoutData.coupon?.code})</span>
                <span>-{formatPaise(checkoutData.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="text-indigo-600">{formatPaise(checkoutData.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNewOrder}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Place Another Order</span>
        </button>
      </div>
    </div>
  )
}
