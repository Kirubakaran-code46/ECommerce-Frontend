import React from 'react'
import { Plus, Check, AlertCircle, Package } from 'lucide-react'
import type { Product } from '../types/product'
import { formatPaise } from '../utils/currency'

interface ProductCardProps {
  product: Product
  cartQuantity: number
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
}) => {
  const isOutOfStock = product.stock_quantity === 0
  const isMaxInCart = cartQuantity >= product.stock_quantity && !isOutOfStock

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header / Stock Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Package className="w-5 h-5" />
          </div>

          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            ) : product.stock_quantity <= 5 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Only {product.stock_quantity} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                In Stock ({product.stock_quantity})
              </span>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="font-semibold text-slate-900 text-base leading-snug tracking-tight mb-1">
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>

      {/* Pricing and Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Price</span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            {formatPaise(product.price)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock || isMaxInCart}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isMaxInCart
              ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
              : cartQuantity > 0
              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {isMaxInCart ? (
            <span>Max in Cart ({cartQuantity})</span>
          ) : cartQuantity > 0 ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added ({cartQuantity})</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
