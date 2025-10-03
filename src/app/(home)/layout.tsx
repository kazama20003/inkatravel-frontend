"use client"

import type React from "react"
import Footer from "@/components/home/Footer"
import Header from "@/components/home/header"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header/>
      <main>{children}</main>
      <Footer />
    </>
  )
}
