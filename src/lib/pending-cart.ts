// Manage pending cart items in localStorage before user login
const PENDING_CART_KEY = "pending_cart_items"

export interface PendingCartItem {
  productType: string
  productId: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  productTitle: string
  productImageUrl?: string
  productSlug?: string
}

export function getPendingCart(): PendingCartItem[] {
  if (typeof window === "undefined") return []

  try {
    const saved = localStorage.getItem(PENDING_CART_KEY)
    console.log("[v0] Reading from localStorage - key:", PENDING_CART_KEY, "value:", saved)
    const items = saved ? JSON.parse(saved) : []
    console.log("[v0] Parsed items:", items, "length:", items.length)
    return items
  } catch (error) {
    console.error("[v0] Error reading pending cart:", error)
    return []
  }
}

export function savePendingCart(items: PendingCartItem[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PENDING_CART_KEY, JSON.stringify(items))
    console.log("[v0] Saved pending cart items:", items.length)
  } catch (error) {
    console.error("[v0] Error saving pending cart:", error)
  }
}

export function addToPendingCart(item: PendingCartItem): void {
  const current = getPendingCart()
  const updated = [...current, item]
  savePendingCart(updated)
}

export function clearPendingCart(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(PENDING_CART_KEY)
    console.log("[v0] Cleared pending cart - key removed:", PENDING_CART_KEY)
  } catch (error) {
    console.error("[v0] Error clearing pending cart:", error)
  }
}
