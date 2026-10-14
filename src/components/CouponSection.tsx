import React, { useState } from 'react'
import { Tag, Check, X, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import type { CouponSummaryResponse } from '../types/checkout'
import { formatPaise } from '../utils/currency'

interface CouponSectionProps {
  appliedCoupon: CouponSummaryResponse | null | undefined
  couponCodeInput: string
  errorMessage?: string | null
  isLoading: boolean
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  disabled?: boolean
}

const SAMPLE_COUPONS = [
  { code: 'SAVE10', label: '10% OFF' },
  { code: 'SAVE20', label: '20% OFF (Capped)' },
  { code: 'FLAT500', label: '₹500 Flat' },
  { code: 'EXPIRED10', label: 'Expired Test' },
]

export const CouponSection: React.FC<CouponSectionProps> = ({
  appliedCoupon,
  couponCodeInput,
  errorMessage,
  isLoading,
  onApplyCoupon,
  onRemoveCoupon,
  disabled = false,
}) => {
  const [inputVal, setInputVal] = useState(couponCodeInput || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputVal.trim()) {
      onApplyCoupon(inputVal.trim().toUpperCase())
    }
  }

  const handleChipClick = (code: string) => {
    setInputVal(code)
    onApplyCoupon(code)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-900">Promo Code</h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 tracking-wide">
                  {appliedCoupon.code}
                </span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                  Applied
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                Saving {formatPaise(appliedCoupon.discount_amount)}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setInputVal('')
              onRemoveCoupon()
            }}
            disabled={isLoading}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold p-1 hover:bg-emerald-100 rounded-md transition-colors"
            title="Remove coupon"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE10"
              disabled={disabled || isLoading}
              className="flex-1 px-3.5 py-2 text-sm uppercase font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || disabled || isLoading}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Promo Suggestions */}
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Available Coupons to test:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_COUPONS.map((coupon) => (
                <button
                  key={coupon.code}
                  type="button"
                  onClick={() => handleChipClick(coupon.code)}
                  disabled={disabled || isLoading}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="font-semibold">{coupon.code}</span>
                  <span className="ml-1 text-[10px] text-slate-400">({coupon.label})</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
