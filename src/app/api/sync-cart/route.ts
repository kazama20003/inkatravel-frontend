import { type NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/axiosInstance"
import { getPendingCart, clearPendingCart } from "@/lib/pending-cart"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting cart sync with token")

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      console.log("[v0] No token provided")
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const pendingItems = getPendingCart()
    console.log("[v0] Pending items to sync:", pendingItems)

    if (pendingItems.length === 0) {
      console.log("[v0] No pending items to sync")
      return NextResponse.json({ success: true, synced: 0 })
    }

    const cartData = {
      items: pendingItems,
      totalPrice: pendingItems.reduce((sum, item) => sum + item.total, 0),
    }

    console.log("[v0] Syncing cart with backend:", cartData)

    await api.post("/cart", cartData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    clearPendingCart()
    console.log("[v0] Cart synced successfully, pending items cleared")

    return NextResponse.json({ success: true, synced: pendingItems.length })
  } catch (error) {
    console.error("[v0] Error syncing cart:", error)
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 })
  }
}
