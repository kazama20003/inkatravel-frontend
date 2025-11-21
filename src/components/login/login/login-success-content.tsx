"use client"

import React from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"

const LoginSuccessContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = React.useState("")
  const [message, setMessage] = React.useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error) {
      setStatus("error")
      setMessage("Error en la autenticación")
      toast.error("Error en la autenticación")
      setTimeout(() => {
        router.push("/login?error=" + encodeURIComponent(error))
      }, 2000)
      return
    }

    if (token) {
      try {
        const maxAge = 7 * 24 * 60 * 60
        document.cookie = `token=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        setStatus("success")
        setMessage("¡Autenticación exitosa! Redirigiendo...")
        toast.success("¡Bienvenido de vuelta!", {
          description: "Sincronizando tu carrito y redirigiendo al checkout...",
        })

        setTimeout(() => {
          router.push("/sync-cart?redirect=/checkout")
        }, 1500)
      } catch (error) {
        console.error("Error storing token:", error)
        setStatus("error")
        setMessage("Error al procesar la autenticación")
        toast.error("Error al procesar la autenticación")
        setTimeout(() => {
          router.push("/login?error=Error al procesar la autenticación")
        }, 2000)
      }
    } else {
      setStatus("error")
      setMessage("No se recibió token de autenticación")
      toast.error("No se recibió token de autenticación")
      setTimeout(() => {
        router.push("/login?error=No se recibió token de autenticación")
      }, 2000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl brand-text text-peru-orange">P</span>
          </div>
        </div>

        {status === "success" && (
          <>
            <h1 className="text-3xl md:text-4xl text-peru-dark brand-text mb-4">¡Bienvenido!</h1>
            <p className="text-lg text-peru-dark/70 body-text mb-8">{message}</p>
            <div className="inline-flex items-center space-x-2">
              <div className="w-3 h-3 bg-peru-orange rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-peru-orange rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-peru-orange rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-3xl md:text-4xl text-red-600 brand-text mb-4">Error de Autenticación</h1>
            <p className="text-lg text-peru-dark/70 body-text">{message}</p>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default LoginSuccessContent
