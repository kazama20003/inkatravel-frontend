"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import { getPendingCart, clearPendingCart } from "@/lib/pending-cart"
import { Loader2 } from "lucide-react"

export default function LoginSyncPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const syncPendingCart = async () => {
      try {
        const pendingItems = getPendingCart()

        if (pendingItems.length > 0) {
          console.log("[v0] Syncing pending cart items:", pendingItems)

          const totalPrice = pendingItems.reduce((sum, item) => sum + item.total, 0)

          // Add pending items to backend cart
          await api.post("/cart", {
            items: pendingItems,
            totalPrice,
          })

          console.log("[v0] Pending cart synced successfully")
          clearPendingCart()
        }

        // Redirect to checkout or redirect param
        const redirect = searchParams.get("redirect") || "/checkout"
        router.push(redirect)
      } catch (error) {
        console.error("[v0] Error syncing pending cart:", error)
        // Still redirect to checkout even if sync fails
        const redirect = searchParams.get("redirect") || "/checkout"
        router.push(redirect)
      }
    }

    syncPendingCart()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-peru-orange" />
        <p className="text-foreground/60">Sincronizando tu reserva...</p>
      </div>
    </div>
  )
}
