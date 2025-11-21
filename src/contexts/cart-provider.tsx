"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"
import type { CartResponse, Cart } from "@/types/cart"
import { clearPendingCart } from "@/lib/pending-cart"
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  productTitle?: string
  productImageUrl?: string
}

interface CartContextType {
  cartCount: number
  items: CartItem[]
  backendItems: Cart["items"]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  loadCartFromBackend: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const LOCAL_STORAGE_KEY = "cart_items_local"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [backendItems, setBackendItems] = useState<Cart["items"]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (error) {
        console.error("[v0] Error parsing localStorage cart:", error)
      }
    }

    loadCartFromBackend()

    const handleCartUpdate = () => {
      loadCartFromBackend()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const loadCartFromBackend = async () => {
    try {
      setIsLoading(true)
      const token = Cookies.get("token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://e0912ca3e512.ngrok-free.app/api"}/cart`,
        {
          method: "GET",
          headers,
        },
      )

      if (response.status === 401) {
        console.log("[v0] User not authenticated, keeping local cart")
        return
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: CartResponse = await response.json()

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const cart = data.data[0]
        if (cart.items && Array.isArray(cart.items)) {
          setBackendItems(cart.items)

          const convertedItems: CartItem[] = cart.items.map((item) => ({
            id: item._id,
            name: item.productTitle || "Product",
            price: item.pricePerPerson,
            quantity: item.people,
            productTitle: item.productTitle,
            productImageUrl: item.productImageUrl,
          }))

          setItems(convertedItems)

          clearPendingCart()
        } else {
          setItems([])
          setBackendItems([])
        }
      } else {
        setItems([])
        setBackendItems([])
      }
    } catch (error) {
      console.error("[v0] Error loading cart from backend:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
    setBackendItems([])
  }

  return (
    <CartContext.Provider
      value={{ cartCount, items, backendItems, addItem, removeItem, clearCart, loadCartFromBackend, isLoading }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
