import { type NextRequest, NextResponse } from "next/server"
import { clearPendingCart } from "@/lib/pending-cart"
import type { CartItem, SyncCartResponse } from "@/lib/cart-types"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting cart sync with token from cookies")

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      console.log("[v0] No token provided")
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Read pending items from localStorage (client-side call will provide them)
    const body = await request.json().catch(() => ({ items: [] }))
    const pendingItems = (body.items as CartItem[]) || []

    console.log("[v0] Pending items to sync:", pendingItems, "length:", pendingItems.length)

    if (pendingItems.length === 0) {
      console.log("[v0] No pending items to sync")
      return NextResponse.json({ success: true, synced: 0 })
    }

    const totalPrice = pendingItems.reduce((sum: number, item: CartItem) => sum + (item.total || 0), 0)

    console.log("[v0] Total price calculated:", totalPrice)

    // Call the cart endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: pendingItems,
        totalPrice,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Backend returned error:", response.status, errorData)
      throw new Error(`Backend error: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("[v0] Cart synced successfully:", responseData)

    // Clear pending cart after successful sync
    clearPendingCart()

    const syncResponse: SyncCartResponse = { success: true, synced: pendingItems.length, data: responseData }
    return NextResponse.json(syncResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error syncing cart:", errorMessage)
    return NextResponse.json({ success: false, error: "Failed to sync cart" }, { status: 500 })
  }
}
