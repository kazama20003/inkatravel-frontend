"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import AnimatedHeader from "@/components/home/AnimatedHeader"
import Footer from "@/components/home/Footer"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const [customScrollPosition, setCustomScrollPosition] = useState(0)
  const [customIsScrollingDown, setCustomIsScrollingDown] = useState(false)

  // Listen for scroll changes from home page
  useEffect(() => {
    if (!isHomePage) return

    const handleScrollChange = (event: CustomEvent) => {
      const { scrollPosition, isScrollingDown } = event.detail
      setCustomScrollPosition(scrollPosition)
      setCustomIsScrollingDown(isScrollingDown)
    }

    window.addEventListener("homeScrollChange", handleScrollChange as EventListener)

    return () => {
      window.removeEventListener("homeScrollChange", handleScrollChange as EventListener)
    }
  }, [isHomePage])

  // For home page, render with custom scroll handling and no native scroll
  if (isHomePage) {
    return (
      <div className="h-screen overflow-hidden">
        <AnimatedHeader
          customScrollPosition={customScrollPosition}
          customIsScrollingDown={customIsScrollingDown}
          useCustomScroll={true}
        />
        <main className="h-full">{children}</main>
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
