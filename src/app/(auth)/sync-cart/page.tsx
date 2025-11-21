"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { getPendingCart } from "@/lib/pending-cart"

export default function SyncCartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"syncing" | "success" | "error">("syncing")
  const [message, setMessage] = useState("Sincronizando tu carrito...")

  useEffect(() => {
    const syncCart = async () => {
      try {
        const token = Cookies.get("token")

        if (!token) {
          setStatus("error")
          setMessage("Error: no hay sesión activa")
          setTimeout(() => {
            router.push("/login")
          }, 2000)
          return
        }

        const pendingItems = getPendingCart()
        console.log("[v0] Pending items from localStorage:", pendingItems)

        console.log("[v0] Starting cart sync with token from cookies")

        const response = await fetch("/api/sync-cart", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: pendingItems,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to sync cart")
        }

        const data = await response.json()
        console.log("[v0] Sync response:", data)

        setStatus("success")
        setMessage("Carrito sincronizado correctamente")

        const redirect = searchParams.get("redirect") || "/checkout"

        setTimeout(() => {
          router.push(redirect)
        }, 1500)
      } catch (error) {
        console.error("[v0] Error syncing cart:", error)
        setStatus("error")
        setMessage("Error al sincronizar el carrito")

        const redirect = searchParams.get("redirect") || "/checkout"

        setTimeout(() => {
          router.push(redirect)
        }, 2000)
      }
    }

    syncCart()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center mr-3">
            <span className="text-2xl brand-text text-peru-orange">P</span>
          </div>
          <span className="text-3xl brand-text text-peru-dark">PERU TRAVEL</span>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === "syncing" && (
            <div className="w-16 h-16 border-4 border-peru-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          )}

          {status === "success" && (
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <h1
            className={`text-2xl brand-text mb-4 ${
              status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-peru-dark"
            }`}
          >
            {status === "syncing" && "Sincronizando"}
            {status === "success" && "¡Sincronizado!"}
            {status === "error" && "Error"}
          </h1>

          <p className={`body-text ${status === "error" ? "text-red-600" : "text-peru-dark/70"}`}>{message}</p>
        </motion.div>
      </div>
    </div>
  )
}
