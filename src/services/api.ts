import type { Product } from '../types/product'
import type { CheckoutRequest, CheckoutResponse, ApiErrorResponse } from '../types/checkout'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export class ApiClientError extends Error {
  code: string
  status: number
  details?: Record<string, unknown>

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
    this.status = status
    this.details = details
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorCode = 'UNKNOWN_ERROR'
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`
    let details: Record<string, unknown> | undefined

    try {
      const errorJson: ApiErrorResponse = await response.json()
      if (errorJson.error) {
        errorCode = errorJson.error.code || errorCode
        errorMessage = errorJson.error.message || errorMessage
        details = errorJson.error.details
      }
    } catch {
      // Fallback to generic message if response is not JSON
    }

    throw new ApiClientError(errorCode, errorMessage, response.status, details)
  }

  const json = await response.json()
  return json.data as T
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`, {
    headers: {
      'Accept': 'application/json',
    },
  })
  return handleResponse<Product[]>(response)
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
    headers: {
      'Accept': 'application/json',
    },
  })
  return handleResponse<Product>(response)
}

export async function calculateCheckout(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<CheckoutResponse>(response)
}
