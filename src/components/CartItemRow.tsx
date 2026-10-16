import React from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import type { CartItem } from '../types/cart'
import { formatPaise } from '../utils/currency'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const lineTotal = item.product.price * item.quantity
  const isMaxStock = item.quantity >= item.product.stock_quantity

  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 last:border-b-0">
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 truncate">
          {item.product.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500">
            {formatPaise(item.product.price)} each
          </span>
          {isMaxStock && (
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
              Max available
            </span>
          )}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/50 p-0.5">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label={`Decrease quantity of ${item.product.name}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-center text-xs font-semibold text-slate-800">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          disabled={isMaxStock}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label={`Increase quantity of ${item.product.name}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Total & Remove Action */}
      <div className="text-right flex items-center gap-3">
        <div className="min-w-17.5">
          <span className="text-sm font-bold text-slate-900 block">
            {formatPaise(lineTotal)}
          </span>
        </div>

        <button
          onClick={() => onRemove(item.productId)}
          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          title="Remove from cart"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
