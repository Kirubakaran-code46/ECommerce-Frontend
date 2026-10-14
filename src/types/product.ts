export interface Product {
  id: string
  name: string
  description: string
  price: number // in paise (e.g. 5000000 = ₹50,000)
  currency: string
  stock_quantity: number
  created_at: string
  updated_at: string
}
