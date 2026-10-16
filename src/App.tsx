import { useState, useEffect, useRef } from 'react'
import {
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Package,
  ArrowRight,
  Info,
} from 'lucide-react'
import { useProducts } from './hooks/useProducts'
import { useCart } from './hooks/useCart'
import { useCheckout } from './hooks/useCheckout'
import { Navbar } from './components/Navbar'
import { ProductCard } from './components/ProductCard'
import { CartItemRow } from './components/CartItemRow'
import { CouponSection } from './components/CouponSection'
import { OrderSummary } from './components/OrderSummary'
import { ConfirmationModal } from './components/ConfirmationModal'

export default function App() {
  const { data: products, isLoading: isLoadingProducts, error: productsError, refetch: refetchProducts } = useProducts()
  const { items, addToCart, updateQuantity, removeFromCart, clearCart, totalUnits, tentativeSubtotal } = useCart()
  const checkoutMutation = useCheckout()

  const [activeTab, setActiveTab] = useState<'catalog' | 'cart'>('catalog')
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const cartDrawerRef = useRef<HTMLDivElement>(null)

  // Re-run backend checkout calculation whenever cart items or coupon code change
  useEffect(() => {
    if (items.length === 0) {
      checkoutMutation.reset()
      setGeneralError(null)
      return
    }

    const payload = {
      items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      })),
      coupon_code: appliedCouponCode || undefined,
    }

    checkoutMutation.mutate(payload, {
      onSuccess: () => {
        setGeneralError(null)
        setCouponError(null)
      },
      onError: (err) => {
        if (err.code.includes('COUPON') || err.code.includes('MIN_CART')) {
          setCouponError(err.message)
          // If the coupon was rejected, remove it from applied state
          setAppliedCouponCode(null)
        } else {
          setGeneralError(err.message)
        }
      },
    })
  }, [items, appliedCouponCode])

  const handleApplyCoupon = (code: string) => {
    setCouponError(null)
    setAppliedCouponCode(code)
  }

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null)
    setCouponError(null)
  }

  const handleProceedToCheckout = () => {
    if (items.length === 0) return
    setIsOrderConfirmed(true)
  }

  const handleNewOrder = () => {
    setIsOrderConfirmed(false)
    clearCart()
    setAppliedCouponCode(null)
    setCouponError(null)
    setGeneralError(null)
    setActiveTab('catalog')
  }

  const scrollToCartOrTab = () => {
    setActiveTab('cart')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar cartItemCount={totalUnits} onCartClick={scrollToCartOrTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner: Assessment context and live status */}
        <div className="mb-6 bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Production-Ready Stack
              </span>
              <span className="text-xs text-slate-300">Go 1.26 + PostgreSQL + React 19 + TanStack Query</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              E-Commerce Authoritative Checkout
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              All prices, line totals, discounts, and inventory validation are authoritatively computed on the Go backend using safe integer paise arithmetic.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-xs">
            <Info className="w-4 h-4 text-indigo-300 shrink-0" />
            <div className="text-slate-200">
              <span className="font-semibold">Backend Source of Truth</span>
              <div className="text-[11px] text-slate-300">No client price manipulation possible</div>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{generalError}</span>
            </div>
            <button
              onClick={() => setGeneralError(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Grid: 2 columns on lg screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Catalog & Cart Views) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* View Selector Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'catalog'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Product Catalog</span>
                  {products && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-white">
                      {products.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('cart')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'cart'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart Items</span>
                  {totalUnits > 0 && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-white">
                      {totalUnits}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === 'cart' && items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Catalog Tab Content */}
            {activeTab === 'catalog' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Available Products
                  </h2>
                  <button
                    onClick={() => refetchProducts()}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                    title="Refresh products"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {isLoadingProducts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 h-44 animate-pulse space-y-4">
                        <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                        <div className="h-8 bg-slate-100 rounded-xl w-1/3 pt-4"></div>
                      </div>
                    ))}
                  </div>
                ) : productsError ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-slate-900 text-sm">Failed to load catalog</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">{productsError.message}</p>
                    <button
                      onClick={() => refetchProducts()}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products?.map((product) => {
                      const cartItem = items.find((i) => i.productId === product.id)
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cartQuantity={cartItem?.quantity || 0}
                          onAddToCart={addToCart}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab Content */}
            {activeTab === 'cart' && (
              <div ref={cartDrawerRef} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Cart Items ({totalUnits})
                  </h2>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <span>Browse more products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">Your cart is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our product catalog to select items and test discount coupons.
                    </p>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Breakdown Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 sticky top-24">
            {/* Quick Cart summary if on Catalog tab */}
            {activeTab === 'catalog' && items.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {totalUnits}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {totalUnits} {totalUnits === 1 ? 'item' : 'items'} in cart
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Click to review quantities
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('cart')}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  View Cart
                </button>
              </div>
            )}

            {/* Coupon Application Box */}
            <CouponSection
              appliedCoupon={checkoutMutation.data?.coupon}
              couponCodeInput={appliedCouponCode || ''}
              errorMessage={couponError}
              isLoading={checkoutMutation.isPending}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              disabled={items.length === 0}
            />

            {/* Order Summary & Final Total */}
            <OrderSummary
              checkoutData={checkoutMutation.data}
              tentativeSubtotal={tentativeSubtotal}
              isCalculating={checkoutMutation.isPending}
              cartIsEmpty={items.length === 0}
              onCheckout={handleProceedToCheckout}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Checkout Assessment</span>
            <span>•</span>
            <span>Full-Stack Modular Monolith</span>
          </div>
          <div>All monetary calculations verified in 64-bit integer paise</div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOrderConfirmed}
        onClose={() => setIsOrderConfirmed(false)}
        checkoutData={checkoutMutation.data || null}
        onNewOrder={handleNewOrder}
      />
    </div>
  )
}
