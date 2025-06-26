"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError) {
      toast.error("Error de autenticación", {
        description: decodeURIComponent(urlError),
      })
    }
  }, [searchParams])

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

      // Verificar si la respuesta tiene el token
      if (response.data && response.data.access_token) {
        // Store token in cookies
        const maxAge = formData.rememberMe ? 2592000 : 86400 // 30 días o 1 día
        document.cookie = `token=${response.data.access_token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        // Mostrar notificación de éxito
        toast.success("¡Bienvenido de vuelta!", {
          description: `Hola ${response.data.user?.fullName || response.data.user?.email || ""}`,
        })

        console.log("Access token guardado, redirigiendo al dashboard...")

        // Pequeño delay para que se vea la notificación
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else if (response.data && response.data.token) {
        // En caso de que el backend use 'token' en lugar de 'access_token'
        const maxAge = formData.rememberMe ? 2592000 : 86400
        document.cookie = `token=${response.data.token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        toast.success("¡Bienvenido de vuelta!", {
          description: `Hola ${response.data.user?.fullName || response.data.user?.email || ""}`,
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        console.error("No se encontró token en la respuesta:", response.data)
        toast.error("Error de autenticación", {
          description: "No se recibió token de autenticación del servidor",
        })
      }
    } catch (error: unknown) {
      console.error("Error completo de login:", error)

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string }
            status?: number
          }
        }

        console.error("Respuesta de error:", axiosError.response)

        if (axiosError.response?.status === 401) {
          toast.error("Credenciales incorrectas", {
            description: "Verifica tu email y contraseña e intenta nuevamente",
          })
        } else if (axiosError.response?.status === 400) {
          toast.error("Datos inválidos", {
            description: axiosError.response?.data?.message || "Verifica los datos ingresados",
          })
        } else if (axiosError.response?.status === 429) {
          toast.error("Demasiados intentos", {
            description: "Has excedido el límite de intentos. Intenta más tarde",
          })
        } else if (axiosError.response?.data?.message) {
          toast.error("Error de autenticación", {
            description: axiosError.response.data.message,
          })
        } else if (axiosError.response?.data?.error) {
          toast.error("Error de autenticación", {
            description: axiosError.response.data.error,
          })
        } else {
          toast.error("Error del servidor", {
            description: "Hubo un problema con el servidor. Intenta nuevamente",
          })
        }
      } else {
        toast.error("Error de conexión", {
          description: "Verifica tu conexión a internet e intenta nuevamente",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleGoogleLogin = async () => {
    try {
      toast.loading("Redirigiendo a Google...", {
        description: "Te estamos llevando a la página de Google",
      })
      // This will redirect to Google OAuth
      window.location.href = `${api.defaults.baseURL}/auth/google`
    } catch (error) {
      console.error("Google login error:", error)
      toast.error("Error con Google", {
        description: "No se pudo iniciar sesión con Google. Intenta nuevamente",
      })
    }
  }

  const handleFacebookLogin = async () => {
    try {
      toast.loading("Redirigiendo a Facebook...", {
        description: "Te estamos llevando a la página de Facebook",
      })
      // This will redirect to Facebook OAuth
      window.location.href = `${api.defaults.baseURL}/auth/facebook`
    } catch (error) {
      console.error("Facebook login error:", error)
      toast.error("Error con Facebook", {
        description: "No se pudo iniciar sesión con Facebook. Intenta nuevamente",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-peru-dark hover:text-peru-orange transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="body-text">Volver al inicio</span>
          </Link>

          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center mr-3">
              <span className="text-xl brand-text text-peru-orange">P</span>
            </div>
            <span className="text-2xl brand-text text-peru-dark">PERU TRAVEL</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl text-peru-dark brand-text mb-4">INICIAR SESIÓN</h1>
          <p className="text-peru-dark/70 body-text text-lg">Accede a tu cuenta para continuar tu aventura por Perú</p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-peru-dark mb-2 body-text">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-peru-dark mb-2 body-text">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-peru-orange transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-peru-orange border-gray-300 rounded focus:ring-peru-orange"
              />
              <span className="ml-2 text-sm text-peru-dark body-text">Recordarme</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-peru-orange hover:text-peru-dark transition-colors body-text"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-peru-orange text-white py-3 px-6 hover:bg-peru-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors brand-text text-lg"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
          </motion.button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 body-text">o continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 hover:border-peru-orange disabled:opacity-50 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm body-text group-hover:text-peru-orange transition-colors">Google</span>
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 hover:border-peru-orange disabled:opacity-50 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm body-text group-hover:text-peru-orange transition-colors">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-peru-dark/70 body-text">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-peru-orange hover:text-peru-dark transition-colors font-medium">
              Regístrate aquí
            </Link>
          </p>
        </motion.form>
      </div>

      {/* Right Side - Image */}
      <motion.div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-peru-dark/80 via-peru-dark/20 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl brand-text text-peru-gold mb-4">BIENVENIDO DE VUELTA</h2>
            <p className="text-lg body-text text-white/90 max-w-md">
              Continúa explorando las maravillas de Perú. Tu próxima aventura te está esperando.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-dotted border-peru-gold flex items-center justify-center">
                <span className="text-peru-gold brand-text">→</span>
              </div>
              <span className="text-peru-gold body-text">Descubre Perú</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
