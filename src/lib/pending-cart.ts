// Utility for managing pending cart in localStorage when user is not logged in
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
  productSlug: string
}

export function savePendingCart(items: PendingCartItem[]) {
  try {
    localStorage.setItem(PENDING_CART_KEY, JSON.stringify(items))
    console.log("[v0] Pending cart saved:", items)
  } catch (error) {
    console.error("[v0] Error saving pending cart:", error)
  }
}

export function getPendingCart(): PendingCartItem[] {
  try {
    const stored = localStorage.getItem(PENDING_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("[v0] Error retrieving pending cart:", error)
    return []
  }
}

export function clearPendingCart() {
  try {
    localStorage.removeItem(PENDING_CART_KEY)
    console.log("[v0] Pending cart cleared")
  } catch (error) {
    console.error("[v0] Error clearing pending cart:", error)
  }
}
