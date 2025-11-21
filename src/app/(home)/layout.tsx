"use client"

import type React from "react"
import Footer from "@/components/home/Footer"
import Header from "@/components/home/header"
import { CartProvider } from "@/contexts/CartContext"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CartProvider>
        <Header/>
      {children}
      <Footer />
      </CartProvider>
    </>
  )
}
