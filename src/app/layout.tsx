import "./globals.css"
import { bebasNeue, inter } from "./local-fonts"
import type React from "react"
import { Toaster } from "@/components/ui/sonner"
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
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#374151",
            },
          }}
        />
      </body>
    </html>
  )
}
