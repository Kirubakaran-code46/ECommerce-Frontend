import { useState, useEffect, useCallback } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

const STORAGE_KEY = 'ecommerce_checkout_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to persist cart:', e)
    }
  }, [items])

  const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantityToAdd, product.stock_quantity)
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: nextQty, product }
            : item
        )
      }
      const initialQty = Math.min(quantityToAdd, product.stock_quantity)
      if (initialQty <= 0) return prev
      return [...prev, { productId: product.id, quantity: initialQty, product }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId)
      }
      return prev.map((item) => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.product.stock_quantity)
          return { ...item, quantity: clamped }
        }
        return item
      })
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const tentativeSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalUnits,
    tentativeSubtotal,
  }
}
