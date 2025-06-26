"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import { CountrySelect } from "@/components/login/country-select"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  country?: string // Ahora guardará el código ISO (ej: "PE", "US", "ES")
  acceptTerms: boolean
  newsletter: boolean
}

interface RegisterResponse {
  access_token: string
  user: {
    _id: string
    fullName: string
    email: string
    role: string
    authProvider: string
    phone?: string
    country?: string
  }
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    acceptTerms: false,
    newsletter: false,
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError) {
      toast.error("Error de registro", {
        description: decodeURIComponent(urlError),
      })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Validaciones del frontend
    if (formData.password !== formData.confirmPassword) {
      toast.error("Error de validación", {
        description: "Las contraseñas no coinciden",
      })
      return
    }

    if (!formData.acceptTerms) {
      toast.error("Términos requeridos", {
        description: "Debes aceptar los términos y condiciones",
      })
      return
    }

    const allRequirementsMet = passwordRequirements.every((req) => req.met)
    if (!allRequirementsMet) {
      toast.error("Contraseña inválida", {
        description: "La contraseña no cumple con todos los requisitos",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para el backend según CreateUserDto
      const registerData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        authProvider: "local" as const,
        role: "user" as const,
        ...(formData.phone && { phone: formData.phone }), // Ya incluye el código de país
        ...(formData.country && { country: formData.country }), // Código ISO del país
      }

      console.log("Enviando datos de registro:", { ...registerData, password: "[HIDDEN]" })

      const response = await api.post<RegisterResponse>("/auth/register", registerData)

      console.log("Respuesta del registro:", { ...response.data, access_token: "[HIDDEN]" })

      if (response.data && response.data.access_token) {
        // Almacenar token en cookies
        const maxAge = 7 * 24 * 60 * 60 // 7 días
        document.cookie = `token=${response.data.access_token}; path=/; max-age=${maxAge}; secure; samesite=strict`

        // Mostrar notificación de éxito
        toast.success("¡Cuenta creada exitosamente!", {
          description: `¡Bienvenido ${response.data.user.fullName}! Tu cuenta ha sido creada.`,
        })

        // Redirigir según el rol (aunque por defecto será user)
        setTimeout(() => {
          if (response.data.user.role === "admin") {
            router.push("/dashboard")
          } else {
            router.push("/users")
          }
        }, 1500)
      } else {
        console.error("No se encontró token en la respuesta:", response.data)
        toast.error("Error de registro", {
          description: "No se recibió token de autenticación del servidor",
        })
      }
    } catch (error: unknown) {
      console.error("Error completo de registro:", error)

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string; errors?: string[] }
            status?: number
          }
        }

        console.error("Respuesta de error:", axiosError.response)

        if (axiosError.response?.status === 400) {
          const errorData = axiosError.response.data
          if (errorData?.errors && Array.isArray(errorData.errors)) {
            // Errores de validación múltiples
            toast.error("Errores de validación", {
              description: errorData.errors.join(", "),
            })
          } else if (errorData?.message) {
            toast.error("Datos inválidos", {
              description: errorData.message,
            })
          } else {
            toast.error("Datos inválidos", {
              description: "Verifica los datos ingresados",
            })
          }
        } else if (axiosError.response?.status === 409) {
          toast.error("Usuario ya existe", {
            description: "Ya existe una cuenta con este correo electrónico",
          })
        } else if (axiosError.response?.status === 422) {
          toast.error("Datos inválidos", {
            description: axiosError.response?.data?.message || "Los datos proporcionados no son válidos",
          })
        } else if (axiosError.response?.data?.message) {
          toast.error("Error de registro", {
            description: axiosError.response.data.message,
          })
        } else if (axiosError.response?.data?.error) {
          toast.error("Error de registro", {
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

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: phone,
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
    }))
  }

  const handleGoogleRegister = async () => {
    try {
      toast.loading("Redirigiendo a Google...", {
        description: "Te estamos llevando a la página de Google",
      })
      window.location.href = `${api.defaults.baseURL}/auth/google`
    } catch (error) {
      console.error("Google register error:", error)
      toast.error("Error con Google", {
        description: "No se pudo registrar con Google. Intenta nuevamente",
      })
    }
  }

  const handleFacebookRegister = async () => {
    try {
      toast.loading("Redirigiendo a Facebook...", {
        description: "Te estamos llevando a la página de Facebook",
      })
      window.location.href = `${api.defaults.baseURL}/auth/facebook`
    } catch (error) {
      console.error("Facebook register error:", error)
      toast.error("Error con Facebook", {
        description: "No se pudo registrar con Facebook. Intenta nuevamente",
      })
    }
  }

  const passwordRequirements = [
    { text: "Al menos 6 caracteres", met: formData.password.length >= 6 },
    { text: "Una letra mayúscula", met: /[A-Z]/.test(formData.password) },
    { text: "Una letra minúscula", met: /[a-z]/.test(formData.password) },
    { text: "Un número", met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <motion.div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
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
            <h2 className="text-4xl brand-text text-peru-gold mb-4">ÚNETE A LA AVENTURA</h2>
            <p className="text-lg body-text text-white/90 max-w-md">
              Crea tu cuenta y comienza a explorar los destinos más increíbles de Perú con nosotros.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-dotted border-peru-gold flex items-center justify-center">
                <span className="text-peru-gold brand-text">P</span>
              </div>
              <span className="text-peru-gold body-text">Peru Travel</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto py-6 md:py-8">
          <div className="min-h-full flex flex-col justify-center">
            {/* Back Button - Fixed at top */}
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-peru-dark hover:text-peru-orange transition-colors group"
              >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="body-text">Volver al inicio</span>
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Logo */}
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-dotted border-peru-orange flex items-center justify-center mr-3">
                  <span className="text-lg md:text-xl brand-text text-peru-orange">P</span>
                </div>
                <span className="text-xl md:text-2xl brand-text text-peru-dark">PERU TRAVEL</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl text-peru-dark brand-text mb-3 md:mb-4">CREAR CUENTA</h1>
              <p className="text-peru-dark/70 body-text text-base md:text-lg">
                Únete a miles de viajeros que han descubierto Perú
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              className="max-w-md mx-auto w-full lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-peru-dark mb-2 body-text">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
                    placeholder="Juan Pérez"
                  />
                </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Phone and Country Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-peru-dark mb-2 body-text">
                      Teléfono
                    </label>
                    <div className="phone-input-container">
                      <PhoneInput
                        country={"pe"}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                          name: "phone",
                          required: false,
                          autoFocus: false,
                        }}
                        containerStyle={{
                          width: "100%",
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          fontSize: "16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          paddingLeft: "48px",
                          fontFamily: "inherit",
                        }}
                        buttonStyle={{
                          border: "1px solid #d1d5db",
                          borderRadius: "6px 0 0 6px",
                          backgroundColor: "white",
                        }}
                        dropdownStyle={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                        }}
                        searchStyle={{
                          margin: "0",
                          width: "97%",
                          height: "30px",
                        }}
                        enableSearch={true}
                        searchPlaceholder="Buscar país..."
                        specialLabel=""
                        placeholder="999 999 999"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-peru-dark mb-2 body-text">
                      País
                    </label>
                    <CountrySelect
                      value={formData.country}
                      onValueChange={handleCountryChange}
                      placeholder="Seleccionar..."
                      className="border-gray-300 focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 h-12 rounded-md"
                    />
                  </div>
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
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
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

                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check size={14} className={`mr-2 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                          <span className={`body-text ${req.met ? "text-green-600" : "text-gray-500"}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-peru-dark mb-2 body-text">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:border-peru-orange focus:ring-2 focus:ring-peru-orange/20 outline-none transition-all body-text"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-peru-orange transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500 body-text">Las contraseñas no coinciden</p>
                  )}
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-peru-orange border-gray-300 rounded focus:ring-peru-orange mt-1 flex-shrink-0"
                    />
                    <span className="ml-3 text-sm text-peru-dark body-text leading-relaxed">
                      Acepto los{" "}
                      <Link href="/terms" className="text-peru-orange hover:text-peru-dark transition-colors">
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacy" className="text-peru-orange hover:text-peru-dark transition-colors">
                        política de privacidad
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-peru-orange border-gray-300 rounded focus:ring-peru-orange mt-1 flex-shrink-0"
                    />
                    <span className="ml-3 text-sm text-peru-dark body-text leading-relaxed">
                      Quiero recibir ofertas especiales y noticias sobre destinos de Perú
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !formData.acceptTerms || formData.password !== formData.confirmPassword}
                  className="w-full bg-peru-orange text-white py-3 px-6 rounded-md hover:bg-peru-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors brand-text text-lg"
                  whileHover={{ scale: !isLoading && formData.acceptTerms ? 1.02 : 1 }}
                  whileTap={{ scale: !isLoading && formData.acceptTerms ? 0.98 : 1 }}
                >
                  {isLoading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 body-text">o regístrate con</span>
                  </div>
                </div>

                {/* Social Registration */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:border-peru-orange disabled:opacity-50 transition-colors group"
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
                    onClick={handleFacebookRegister}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:border-peru-orange disabled:opacity-50 transition-colors group"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm body-text group-hover:text-peru-orange transition-colors">Facebook</span>
                  </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-peru-dark/70 body-text">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-peru-orange hover:text-peru-dark transition-colors font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom CSS for phone input */}
      <style jsx global>{`
        .phone-input-container .react-tel-input .form-control:focus {
          border-color: #d97706 !important;
          box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2) !important;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown:hover {
          background-color: #f9fafb !important;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown.open {
          background-color: #f9fafb !important;
        }
        
        .phone-input-container .react-tel-input .country-list {
          border-radius: 6px !important;
          border: 1px solid #d1d5db !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        
        .phone-input-container .react-tel-input .country-list .country:hover {
          background-color: #f3f4f6 !important;
        }
        
        .phone-input-container .react-tel-input .country-list .country.highlight {
          background-color: #fef3c7 !important;
        }
        
        .phone-input-container .react-tel-input .search-box {
          border-radius: 4px !important;
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          margin: 8px !important;
          width: calc(100% - 16px) !important;
        }
        
        .phone-input-container .react-tel-input .search-box:focus {
          border-color: #d97706 !important;
          box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.2) !important;
          outline: none !important;
        }
      `}</style>
    </div>
  )
}
export const dynamic = 'force-dynamic';