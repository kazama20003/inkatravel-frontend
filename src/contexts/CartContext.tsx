"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { api } from "@/lib/axiosInstance"

interface CartContextType {
  cartCount: number
  loading: boolean
}

const CartContext = createContext<CartContextType>({ cartCount: 0, loading: true })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCartCount = useCallback(async () => {
    try {
      const response = await api.get("/cart")
      if (response.data.data && response.data.data.length > 0) {
        const cart = response.data.data[0]
        setCartCount(cart.items?.length || 0)
      } else {
        setCartCount(0)
      }
    } catch {
      setCartCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCartCount()
    // Recargar carrito cada 5 segundos para sincronizar
    const interval = setInterval(fetchCartCount, 5000)
    return () => clearInterval(interval)
  }, [fetchCartCount])

  return <CartContext.Provider value={{ cartCount, loading }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
