/**
 * Formats an integer amount in paise (1 INR = 100 paise) into standard Indian Rupee notation (₹).
 * Example: 5000000 -> "₹50,000" or "₹50,000.00"
 */
export function formatPaise(paise: number, forceDecimals: boolean = false): string {
  if (isNaN(paise)) return '₹0'
  const rupees = paise / 100

  const hasFractions = forceDecimals || paise % 100 !== 0

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasFractions ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rupees)
}
