"use client"

import type React from "react"
import AnimatedHeader from "@/components/home/AnimatedHeader"
import Footer from "@/components/home/Footer"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedHeader useCustomScroll={false} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
