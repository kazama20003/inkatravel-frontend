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

    const body = await request.json().catch(() => ({ items: [] }))
    const pendingItems = (body.items as CartItem[]) || []
    const bodyTotalPrice = (body.totalPrice as number) || 0

    console.log("[v0] Pending items to sync:", pendingItems, "length:", pendingItems.length)
    console.log("[v0] Total price from body:", bodyTotalPrice)

    if (pendingItems.length === 0) {
      console.log("[v0] No pending items to sync")
      return NextResponse.json({ success: true, synced: 0 })
    }

    const totalPrice =
      bodyTotalPrice || pendingItems.reduce((sum: number, item: CartItem) => sum + (item.total || 0), 0)

    console.log("[v0] Total price to send:", totalPrice)
    console.log("[v0] Items structure being sent:", JSON.stringify({ items: pendingItems, totalPrice }, null, 2))

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    console.log("[v0] Calling backend at:", backendUrl)

    const response = await fetch(`${backendUrl}/cart`, {
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
      const errorText = await response.text()
      console.error("[v0] Backend error response:", response.status, response.statusText)
      console.error("[v0] Backend error body:", errorText)

      let errorData: unknown = { error: errorText }
      try {
        errorData = JSON.parse(errorText)
      } catch {
        // Si no es JSON, mantener el texto
      }

      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}`, details: errorData },
        { status: 500 },
      )
    }

    const responseData = await response.json()
    console.log("[v0] Cart synced successfully:", responseData)

    clearPendingCart()

    const syncResponse: SyncCartResponse = { success: true, synced: pendingItems.length, data: responseData }
    return NextResponse.json(syncResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error syncing cart:", errorMessage)
    if (error instanceof Error) {
      console.error("[v0] Stack trace:", error.stack)
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
