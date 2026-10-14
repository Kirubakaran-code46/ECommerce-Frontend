import { describe, it, expect } from 'vitest'
import { formatPaise } from './currency'

describe('formatPaise', () => {
  it('formats whole rupee amounts correctly without fractions', () => {
    // 50,000 INR = 5,000,000 paise
    const formatted = formatPaise(5000000)
    expect(formatted).toContain('50,000')
    expect(formatted).toContain('₹')
  })

  it('formats smaller amounts correctly', () => {
    // 2,000 INR = 200,000 paise
    const formatted = formatPaise(200000)
    expect(formatted).toContain('2,000')
  })

  it('formats zero correctly', () => {
    const formatted = formatPaise(0)
    expect(formatted).toContain('0')
    expect(formatted).toContain('₹')
  })

  it('formats fractional paise amounts with decimals when present', () => {
    // 1,500.50 INR = 150050 paise
    const formatted = formatPaise(150050)
    expect(formatted).toContain('1,500.5')
  })

  it('handles NaN gracefully', () => {
    const formatted = formatPaise(NaN)
    expect(formatted).toBe('₹0')
  })
})
