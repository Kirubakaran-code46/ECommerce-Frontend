export interface CartItemInput {
  product_id: string
  quantity: number
}

export interface CheckoutRequest {
  items: CartItemInput[]
  coupon_code?: string
}

export interface CheckoutItemResponse {
  product_id: string
  name: string
  quantity: number
  unit_price: number // in paise
  line_total: number // in paise
}

export interface CouponSummaryResponse {
  code: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  discount_amount: number // in paise
}

export interface CheckoutResponse {
  items: CheckoutItemResponse[]
  subtotal: number // in paise
  discount: number // in paise
  total: number // in paise
  currency: string
  coupon?: CouponSummaryResponse | null
}

export interface ApiErrorDetail {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiErrorResponse {
  error: ApiErrorDetail
}
