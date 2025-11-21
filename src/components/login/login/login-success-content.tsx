"use client"

import React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

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
        toast.success("¡Autenticación exitosa! Redirigiendo a checkout...")

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
    <div>
      {status === "error" && <p>{message}</p>}
      {status === "success" && <p>{message}</p>}
    </div>
  )
}

export default LoginSuccessContent
