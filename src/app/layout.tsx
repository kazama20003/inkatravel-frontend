import "./globals.css"
import { bebasNeue, inter } from "./local-fonts"
import type React from "react"

export const metadata = {
  title: "Inka Travel Peru - Agencia de turismo",
  description: "A dynamic frame layout with modern typography for Peru Travel",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
