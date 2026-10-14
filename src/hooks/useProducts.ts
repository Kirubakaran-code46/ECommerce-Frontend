import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/api'
import type { Product } from '../types/product'

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
