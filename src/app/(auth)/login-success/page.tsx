"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

function LoginSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Iniciando sesión...")

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error) {
      setStatus("error")
      setMessage("Error en la autenticación")
      setTimeout(() => {
        router.push("/login?error=" + encodeURIComponent(error))
      }, 2000)
      return
    }

    if (token) {
      try {
        // Guardar token en cookies de forma segura
        const maxAge = 7 * 24 * 60 * 60 // 7 días en segundos
        document.cookie = `token=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        setStatus("success")
        setMessage("¡Autenticación exitosa! Redirigiendo...")

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } catch (error) {
        console.error("Error storing token:", error)
        setStatus("error")
        setMessage("Error al procesar la autenticación")
        setTimeout(() => {
          router.push("/login?error=Error al procesar la autenticación")
        }, 2000)
      }
    } else {
      setStatus("error")
      setMessage("No se recibió token de autenticación")
      setTimeout(() => {
        router.push("/login?error=No se recibió token de autenticación")
      }, 2000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center mr-3">
            <span className="text-2xl brand-text text-peru-orange">P</span>
          </div>
          <span className="text-3xl brand-text text-peru-dark">PERU TRAVEL</span>
        </motion.div>

        {/* Loading/Success/Error Animation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === "loading" && (
            <div className="w-16 h-16 border-4 border-peru-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          )}

          {status === "success" && (
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Message */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <h1
            className={`text-2xl brand-text mb-4 ${
              status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-peru-dark"
            }`}
          >
            {status === "loading" && "Procesando autenticación"}
            {status === "success" && "¡Bienvenido!"}
            {status === "error" && "Error de autenticación"}
          </h1>

          <p className={`body-text ${status === "error" ? "text-red-600" : "text-peru-dark/70"}`}>{message}</p>

          {status === "success" && (
            <motion.div
              className="mt-6 flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-dotted border-peru-gold flex items-center justify-center">
                <span className="text-peru-gold brand-text">→</span>
              </div>
              <span className="text-peru-gold body-text">Preparando tu aventura</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function LoginSuccessLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-peru-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-peru-dark body-text">Cargando...</p>
      </div>
    </div>
  )
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={<LoginSuccessLoading />}>
      <LoginSuccessContent />
    </Suspense>
  )
}
export const dynamic = 'force-dynamic';