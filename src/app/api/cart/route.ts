import { type NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/axiosInstance"
import type { CartItem, SyncCartRequest, SyncCartResponse } from "@/lib/cart-types"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/cart - Starting cart sync")

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      console.log("[v0] POST /api/cart - No token provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as SyncCartRequest
    console.log("[v0] POST /api/cart - Request body:", body)

    if (!body.items || body.items.length === 0) {
      console.log("[v0] POST /api/cart - No items to sync")
      return NextResponse.json({ success: true, synced: 0 })
    }

    // Create cart with pending items
    const cartPayload = {
      items: body.items.map((item: CartItem) => ({
        productType: item.productType,
        productId: item.productId,
        startDate: item.startDate,
        people: item.people,
        pricePerPerson: item.pricePerPerson,
        total: item.total,
        notes: item.notes,
        productTitle: item.productTitle,
        productImageUrl: item.productImageUrl,
        productSlug: item.productSlug,
      })),
      totalPrice: body.totalPrice,
    }

    console.log("[v0] POST /api/cart - Sending to backend:", JSON.stringify(cartPayload))

    const response = await api.post("/cart", cartPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] POST /api/cart - Backend response:", response.data)

    const syncResponse: SyncCartResponse = {
      success: true,
      synced: body.items.length,
      data: response.data,
    }
    return NextResponse.json(syncResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] POST /api/cart - Error:", errorMessage)
    console.error("[v0] POST /api/cart - Full error:", error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Failed to sync cart",
      },
      { status: 500 },
    )
  }
}
