import { useMutation } from '@tanstack/react-query'
import { calculateCheckout, ApiClientError } from '../services/api'
import type { CheckoutRequest, CheckoutResponse } from '../types/checkout'

export function useCheckout() {
  return useMutation<CheckoutResponse, ApiClientError, CheckoutRequest>({
    mutationFn: calculateCheckout,
  })
}
