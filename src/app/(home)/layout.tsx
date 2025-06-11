"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import AnimatedHeader from "@/components/home/AnimatedHeader"
import Footer from "@/components/home/Footer"
import Home from "./page"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const [customScrollPosition, setCustomScrollPosition] = useState(0)
  const [customIsScrollingDown, setCustomIsScrollingDown] = useState(false)

  // Handle custom scroll updates from home page
  const handleScrollChange = useCallback((scrollPosition: number, isScrollingDown: boolean) => {
    setCustomScrollPosition(scrollPosition)
    setCustomIsScrollingDown(isScrollingDown)
  }, [])

  // For home page, render with custom scroll handling and no native scroll
  if (isHomePage) {
    return (
      <div className="h-screen overflow-hidden">
        <AnimatedHeader
          customScrollPosition={customScrollPosition}
          customIsScrollingDown={customIsScrollingDown}
          useCustomScroll={true}
        />
        <main className="h-full">
          <Home onScrollChange={handleScrollChange} />
        </main>
        {/* Footer is included in the home page sections, not here */}
      </div>
    )
  }

  // For other pages, render normally with browser scroll
  return (
    <>
      <AnimatedHeader useCustomScroll={false} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
