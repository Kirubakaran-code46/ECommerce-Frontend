import React from 'react'
import { ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react'

interface NavbarProps {
  cartItemCount: number
  onCartClick: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ cartItemCount, onCartClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">NovaCommerce</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3" />
                Checkout Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Full-Stack Production Assessment</p>
          </div>
        </div>

        {/* Status & Cart Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Backend Authoritative Pricing</span>
          </div>

          <button
            onClick={onCartClick}
            type="button"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-indigo-900 bg-indigo-200 rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
