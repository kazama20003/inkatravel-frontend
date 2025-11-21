"use client"

import React from "react"
import { useRouter } from "next/router"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"

const LoginPageContent = () => {
  const [formData,] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    try {
      console.log("Enviando datos de login:", { email: formData.email })

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      console.log("Respuesta del login:", response.data)

      if (response.data && response.data.access_token) {
        const maxAge = formData.rememberMe ? 2592000 : 86400
        document.cookie = `token=${response.data.access_token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        toast.success("¡Bienvenido de vuelta!", {
          description: `Hola ${response.data.user?.fullName || response.data.user?.email || ""}`,
        })

        console.log("Access token guardado, sincronizando carrito...")

        setTimeout(() => {
          router.push("/sync-cart?redirect=/checkout")
        }, 1000)
      } else if (response.data && response.data.token) {
        const maxAge = formData.rememberMe ? 2592000 : 86400
        document.cookie = `token=${response.data.token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        toast.success("¡Bienvenido de vuelta!", {
          description: `Hola ${response.data.user?.fullName || response.data.user?.email || ""}`,
        })

        setTimeout(() => {
          router.push("/sync-cart?redirect=/checkout")
        }, 1000)
      } else {
        console.error("No se encontró token en la respuesta:", response.data)
        toast.error("Error de autenticación", {
          description: "No se recibió token de autenticación del servidor",
        })
      }
    } catch (error: unknown) {
      console.error("Error en el proceso de login:", error)
      toast.error("Error en el proceso de login", {
        description: "Hubo un problema al intentar iniciar sesión",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ... existing code here ...

  return (
    <div>
      {/* ... existing JSX code here ... */}
      <form onSubmit={handleSubmit}>
        {/* ... existing form fields here ... */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  )
}

export default LoginPageContent
