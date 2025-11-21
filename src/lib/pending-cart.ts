export interface PendingCartItem {
  productType: string
  productId: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  productTitle: string
  productImageUrl: string | undefined
  productSlug: string
}

const CART_KEY = "pending_cart"

export function savePendingCart(items: PendingCartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function getPendingCart(): PendingCartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearPendingCart(): void {
  localStorage.removeItem(CART_KEY)
}

export function addToPendingCart(item: PendingCartItem): void {
  const existing = getPendingCart()
  savePendingCart([...existing, item])
}
