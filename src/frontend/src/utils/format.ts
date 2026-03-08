/**
 * Format price from paise to rupees with ₹ symbol
 */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)}k`;
  }
  return `₹${rupees.toFixed(rupees % 1 === 0 ? 0 : 2)}`;
}

/**
 * Format price as full rupee string
 */
export function formatPriceFull(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Generate a simple ID
 */
export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
}
