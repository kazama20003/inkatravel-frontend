"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  MapPin,
  Clock,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  User,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Tag,
  Package,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CountrySelect } from "@/components/login/country-select"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import { useLanguage } from "@/contexts/LanguageContext"
import { isAxiosError } from "axios"
import Image from "next/image"
import "../../styles/izipay.css"
import type { Cart, CartItem, CartResponse } from "@/types/cart" // Import from shared types
import { CartItemType } from "@/types/cart"

// Exchange rate constant
const USD_TO_PEN_RATE = 3.75

// Interfaces for Izipay payment request
interface CustomerDto {
  email: string
  billingFirstName?: string
  billingLastName?: string
}

interface PaymentForm {
  type: string
  pan: string // Required - card number
  cardScheme: string // Required - card type (VISA, MASTERCARD, etc.)
  expiryMonth: string // Required - expiry month as string
  expiryYear: string // Required - expiry year as string
  securityCode: string // Required - CVV/CVC code
}

interface CreateFormTokenRequest {
  amount: number // Amount in cents
  currency: string
  orderId: string
  customer: CustomerDto
  formAction: "PAID" // Cambiar a "PAID"
  contextMode?: string // Add context mode for test/production
  paymentForms: PaymentForm[] // Array of payment form objects
}

interface FormTokenResponse {
  formToken: string
  publicKey: string
}

interface UserData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [,] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Payment state
  const [formToken, setFormToken] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  // Form data
  const [customerInfo, setCustomerInfo] = useState<UserData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [discountCode, setDiscountCode] = useState("")

  // Load cart data
  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading cart...")
      const response = await api.get<CartResponse>("/cart")
      console.log("Cart response:", response.data)
      // Check if response.data.data exists and is a Cart object
      if (response.data.data && response.data.data.length > 0) {
        // Check if data array exists and has items
        const cartData = response.data.data[0] // Get the first cart object from the array
        console.log("Cart data:", cartData)
        setCart(cartData)
        if (!cartData.items || cartData.items.length === 0) {
          setError("Tu carrito está vacío. Agrega algunos tours para continuar con tu reserva.")
        }
      } else {
        setError("Tu carrito está vacío. Agrega algunos tours para continuar con tu reserva.")
      }
    } catch (err: unknown) {
      console.error("Error loading cart:", err)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 404) {
          setError("Tu carrito está vacío. Agrega algunos tours para continuar con tu reserva.")
        } else if (axiosError.response?.status === 401) {
          toast.error("Debes iniciar sesión para ver tu carrito")
          router.push("/login")
          return
        } else {
          setError("Error al cargar el carrito")
        }
      } else {
        setError("Error al cargar el carrito")
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Effect to load Izipay script when modal opens and formToken is available
  useEffect(() => {
    if (showPaymentModal && formToken) {
      const scriptId = "izipay-script"
      if (document.getElementById(scriptId)) {
        return
      }
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
      script.setAttribute("kr-public-key", process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY || "")
      script.setAttribute("kr-post-url-success", process.env.NEXT_PUBLIC_IZIPAY_SUCCESS_URL || "")
      script.setAttribute("kr-post-url-refused", process.env.NEXT_PUBLIC_IZIPAY_REFUSED_URL || "")
      document.body.appendChild(script)
      return () => {
        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          document.body.removeChild(existingScript)
        }
      }
    }
  }, [showPaymentModal, formToken])

  // Update item quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !cart) return
    try {
      const response = await api.patch(`/cart/items/${itemId}`, {
        cartId: cart._id,
        people: newQuantity,
      })
      if (response.data) {
        const updatedCart = { ...cart }
        const itemIndex = updatedCart.items.findIndex((item) => item._id === itemId)
        if (itemIndex !== -1) {
          updatedCart.items[itemIndex].people = newQuantity
          updatedCart.items[itemIndex].total = newQuantity * updatedCart.items[itemIndex].pricePerPerson
          updatedCart.totalPrice = updatedCart.items.reduce((sum, item) => sum + item.total, 0)
          setCart(updatedCart)
        }
        toast.success("Cantidad actualizada")
      }
    } catch (err) {
      console.error("Error updating quantity:", err)
      toast.error("Error al actualizar la cantidad")
    }
  }

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    if (!cart) return
    try {
      const response = await api.delete(`/cart/${cart._id}/items/${itemId}`)
      if (response.data) {
        const updatedCart = { ...cart }
        updatedCart.items = updatedCart.items.filter((item) => item._id !== itemId)
        updatedCart.totalPrice = updatedCart.items.reduce((sum, item) => sum + item.total, 0)
        if (updatedCart.items.length === 0) {
          setError("Tu carrito está vacío. Agrega algunos tours para continuar con tu reserva.")
          setCart(null)
        } else {
          setCart(updatedCart)
        }
        toast.success("Tour eliminado del carrito")
      }
    } catch (err) {
      console.error("Error removing item:", err)
      toast.error("Error al eliminar el tour")
    }
  }

  // Update item date
  const updateDate = async (itemId: string, newDate: string) => {
    if (!cart) return
    try {
      const response = await api.patch(`/cart/items/${itemId}`, {
        cartId: cart._id,
        startDate: `${newDate}T00:00:00.000Z`,
      })
      if (response.data) {
        const updatedCart = { ...cart }
        const itemIndex = updatedCart.items.findIndex((item) => item._id === itemId)
        if (itemIndex !== -1) {
          updatedCart.items[itemIndex].startDate = `${newDate}T00:00:00.000Z`
          setCart(updatedCart)
        }
        toast.success("Fecha actualizada")
      }
    } catch (err) {
      console.error("Error updating date:", err)
      toast.error("Error al actualizar la fecha")
    }
  }

  // Generate payment token
  const generatePaymentToken = async () => {
    if (!cart) return
    setIsProcessingPayment(true)
    setError(null)
    try {
      const totalAmountPEN = (cart.totalPrice * USD_TO_PEN_RATE).toFixed(0)
      const payload: CreateFormTokenRequest = {
        amount: Number.parseInt(totalAmountPEN) * 100, // Amount in cents
        currency: "PEN",
        orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer: {
          email: customerInfo.email,
          billingFirstName: customerInfo.firstName,
          billingLastName: customerInfo.lastName,
        },
        formAction: "PAID", // Cambiar de "PAYMENT" a "PAID"
        contextMode: "TEST",
        paymentForms: [
          {
            type: "card",
            pan: "4970100000000154", // Test card - this will be removed in production
            cardScheme: "VISA",
            expiryMonth: "12",
            expiryYear: "2026",
            securityCode: "123",
          },
        ],
      }
      const response = await api.post<FormTokenResponse>("/payments/formtoken", payload)
      setFormToken(response.data.formToken)
      setShowPaymentModal(true)
    } catch (err: unknown) {
      console.error("Error generating payment form token:", err)
      let errorMessage = t.errorProcessingPayment || "Error processing payment. Please try again."
      if (isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === "object" && "message" in err.response.data) {
          errorMessage = (err.response.data as { message: string }).message
        } else if (err.message) {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return cart !== null && cart.items.length > 0
      case 2:
        return (
          customerInfo.firstName.trim() !== "" &&
          customerInfo.lastName.trim() !== "" &&
          customerInfo.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
        )
      case 3:
        return paymentMethod !== ""
      default:
        return true
    }
  }

  // Go to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // Generate payment token when moving to payment step
        generatePaymentToken()
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 4))
      }
    } else {
      toast.error("Por favor completa todos los campos requeridos")
    }
  }

  // Go to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Helper function to get item display data
  const getItemDisplayData = (item: CartItem) => {
    const isTransport = item.productType === CartItemType.Transport
    let locationDisplay = "Ubicación no disponible"
    let durationDisplay = "Duración no disponible"
    if (item.notes) {
      const parts = item.notes.split(" - ")
      if (isTransport && parts.length >= 2) {
        locationDisplay = parts[1] // e.g., "Origin City → Destination City"
      } else if (parts.length >= 1) {
        locationDisplay = parts[0] // e.g., "Tour Title" or "Origin City"
      }
    }
    if (isTransport) {
      durationDisplay = "Transporte"
    } else {
      durationDisplay = "Duración del tour" // Placeholder, as tour.duration is no longer available
    }
    return {
      id: item._id,
      title: item.productTitle || (isTransport ? "Servicio de Transporte" : "Tour"),
      imageUrl: item.productImageUrl || "/placeholder.svg",
      location: locationDisplay,
      duration: durationDisplay,
      rating: undefined, // No longer available from CartItem directly
      reviews: undefined, // No longer available from CartItem directly
      productType: item.productType,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  if (error || !cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
            <h1 className="brand-text text-4xl md:text-5xl text-gray-800 mb-4">Tu Carrito Está Vacío</h1>
            <p className="body-text text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Descubre increíbles tours y servicios de transporte en Perú. ¡Comienza tu aventura ahora!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tours Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="brand-text text-2xl text-gray-800 mb-3">Tours Increíbles</h3>
              <p className="body-text text-gray-600 mb-4">
                Explora Machu Picchu, el Valle Sagrado, y muchos destinos más
              </p>
              <Button
                onClick={() => router.push("/tours")}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Ver Tours
              </Button>
            </div>
            {/* Transport Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="brand-text text-2xl text-gray-800 mb-3">Transporte</h3>
              <p className="body-text text-gray-600 mb-4">
                Viaja cómodo entre ciudades con nuestros servicios de transporte
              </p>
              <Button
                onClick={() => router.push("/transport")}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Ver Transporte
              </Button>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={loadCart}
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 pt-20 sm:pt-24 md:pt-32 pb-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 brand-text">Finalizar Reserva</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto body-text">
              Estás a solo unos pasos de vivir una experiencia increíble en Perú
            </p>
          </motion.div>
        </div>
      </div>
      <div className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-center">
              {[
                { step: 1, title: "Carrito", icon: ShoppingCart },
                { step: 2, title: "Datos", icon: User },
                { step: 3, title: "Pago", icon: CreditCard },
                { step: 4, title: "Confirmar", icon: CheckCircle },
              ].map((item, index) => (
                <div key={`progress-step-${item.step}`} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 ${
                        item.step <= currentStep
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.step < currentStep ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium ${
                        item.step <= currentStep ? "text-purple-600" : "text-gray-500"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-12 sm:w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                        item.step < currentStep ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Mejorado */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart Review - Rediseñado */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center brand-text">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      Tu Selección de Tours
                    </h2>
                    <p className="text-gray-600 mt-2 body-text">Revisa y personaliza tu experiencia</p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="space-y-6">
                      {cart.items.map((item, index) => {
                        const displayData = getItemDisplayData(item)
                        return (
                          <div
                            key={`cart-item-${item._id || index}`}
                            className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Image */}
                              <div className="flex-shrink-0">
                                <div className="relative overflow-hidden rounded-xl">
                                  <Image
                                    src={displayData.imageUrl || "/placeholder.svg?height=160&width=240"}
                                    alt={displayData.title}
                                    width={240}
                                    height={160}
                                    className="w-full lg:w-60 h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-3 left-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        displayData.productType === "TourTransport"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {displayData.productType === "TourTransport" ? "🚌 Transporte" : "🎯 Tour"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 brand-text">
                                      {displayData.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                      <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                                        <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                                        {displayData.location}
                                      </div>
                                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                        {displayData.duration}
                                      </div>
                                    </div>
                                    {/* Date Selection - Mejorado */}
                                    <div className="mb-4">
                                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                                        📅 Fecha del Tour
                                      </Label>
                                      <Input
                                        type="date"
                                        value={item.startDate.split("T")[0]}
                                        onChange={(e) => updateDate(item._id, e.target.value)}
                                        min={getMinDate()}
                                        className="w-full sm:w-auto border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                                      />
                                    </div>
                                    {/* Quantity Controls - Mejorado */}
                                    <div className="flex items-center gap-4">
                                      <Label className="text-sm font-semibold text-gray-700">👥 Personas:</Label>
                                      <div className="flex items-center bg-gray-50 rounded-lg border-2 border-gray-200">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => updateQuantity(item._id, item.people - 1)}
                                          disabled={item.people <= 1}
                                          className="w-10 h-10 hover:bg-purple-500 hover:text-white"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="px-4 py-2 text-lg font-bold text-gray-900 min-w-[3rem] text-center">
                                          {item.people}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => updateQuantity(item._id, item.people + 1)}
                                          className="w-10 h-10 hover:bg-purple-500 hover:text-white"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Price and Actions - Mejorado */}
                                  <div className="text-right flex-shrink-0 lg:ml-6">
                                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-4">
                                      <p className="text-2xl font-bold text-purple-700 mb-1">S/ {item.total}</p>
                                      <p className="text-sm text-gray-600">S/ {item.pricePerPerson} por persona</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeItem(item._id)}
                                      className="text-red-600 hover:text-white hover:bg-red-500 border-red-200 hover:border-red-500 transition-all duration-300"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Eliminar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                      <Button
                        onClick={nextStep}
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Continuar con mis Datos
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Step 2: Customer Information - Rediseñado */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center brand-text">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      Información Personal
                    </h2>
                    <p className="text-gray-600 mt-2 body-text">Necesitamos algunos datos para tu reserva</p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">👤</span> Nombre *
                        </Label>
                        <Input
                          value={customerInfo.firstName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                          placeholder="Tu nombre"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">👤</span> Apellido *
                        </Label>
                        <Input
                          value={customerInfo.lastName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                          placeholder="Tu apellido"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">📧</span> Correo Electrónico *
                        </Label>
                        <Input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="tu@email.com"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">📱</span> Teléfono
                        </Label>
                        <Input
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="+51 999 999 999"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🌍</span> País
                        </Label>
                        <CountrySelect
                          value={customerInfo.country}
                          onValueChange={(value) => setCustomerInfo({ ...customerInfo, country: value })}
                          placeholder="Seleccionar país..."
                          className="h-12 border-2 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🏙️</span> Ciudad
                        </Label>
                        <Input
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          placeholder="Tu ciudad"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        size="lg"
                        className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Anterior
                      </Button>
                      <Button
                        onClick={nextStep}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Continuar al Pago
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Step 3: Payment Method - Rediseñado */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center brand-text">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      Método de Pago
                    </h2>
                    <p className="text-gray-600 mt-2 body-text">Pago 100% seguro y protegido</p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="space-y-6">
                      {/* Payment Method Selection - Mejorado */}
                      <div className="grid grid-cols-1 gap-4">
                        <div
                          onClick={() => setPaymentMethod("izipay")}
                          className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            paymentMethod === "izipay"
                              ? "border-teal-500 bg-teal-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                                  paymentMethod === "izipay" ? "border-teal-500" : "border-gray-300"
                                }`}
                              >
                                {paymentMethod === "izipay" && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">💳 Tarjeta de Crédito/Débito</p>
                                <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">VISA</span>
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">MASTERCARD</span>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">AMEX</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-teal-600">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Order Notes - Mejorado */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">📝</span> Notas Adicionales (Opcional)
                        </Label>
                        <Textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="¿Alguna solicitud especial? ¿Restricciones alimentarias? ¡Cuéntanos!"
                          className="min-h-[100px] border-2 border-gray-200 focus:border-teal-500 rounded-lg resize-none"
                        />
                      </div>
                      {/* Security Info */}
                      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4">
                        <div className="flex items-center text-teal-700">
                          <CheckCircle className="w-5 h-5 mr-3" />
                          <div>
                            <p className="font-semibold">Pago 100% Seguro</p>
                            <p className="text-sm">Protegido con encriptación SSL de nivel bancario</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        size="lg"
                        className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Anterior
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={isProcessingPayment}
                        size="lg"
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            🚀 Proceder al Pago
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Order Summary Sidebar - Completamente rediseñado */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center brand-text">
                  <Package className="w-6 h-6 mr-3 text-purple-600" />
                  Resumen del Pedido
                </h3>
              </div>
              {/* Tours List */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {cart.items.map((item, index) => {
                    const displayData = getItemDisplayData(item)
                    return (
                      <div key={`summary-item-${item._id || index}`} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-3">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{displayData.title}</p>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.people} × S/ {item.pricePerPerson}
                            </p>
                            <div className="flex items-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  displayData.productType === "TourTransport"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {displayData.productType === "TourTransport" ? "🚌 Transporte" : "🎯 Tour"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">S/ {item.total}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Discount Code */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Código de Descuento
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Ej: WELCOME10"
                      className="flex-1 text-sm border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-500 border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 hover:text-gray-700"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Funcionalidad próximamente disponible</p>
                </div>
                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">S/ {cart.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuentos</span>
                    <span className="font-medium text-green-600">- S/ 0</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span className="text-purple-600">S/ {cart.totalPrice}</span>
                  </div>
                </div>
                {/* Example Discount Codes */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center">🎁 Códigos de Ejemplo</h4>
                  <div className="space-y-1 text-xs text-purple-700">
                    <p>• WELCOME10 - 10% de descuento</p>
                    <p>• SUMMER20 - 20% de descuento</p>
                    <p>• SAVE50 - S/ 50 de descuento</p>
                    <p className="text-purple-600 font-semibold mt-2">*Solo para demostración</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Payment Modal - Mejorado */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <div
              className="relative w-full max-w-lg h-full max-h-[95vh] bg-white rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
              {/* Header */}
              <div className="text-center mb-6 pt-2">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="brand-text text-3xl text-gray-800 mb-2">Pago Seguro</h2>
                <p className="body-text text-gray-600">Completa tu reserva de forma segura</p>
                {/* Amount Display */}
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
                  <p className="brand-text text-2xl text-gray-800">
                    S/ {cart ? (cart.totalPrice * USD_TO_PEN_RATE).toFixed(0) : "0"} PEN
                  </p>
                </div>
              </div>
              {!formToken ? (
                <div className="flex flex-col items-center justify-center flex-grow text-slate-600">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="body-text text-gray-600">Preparando formulario de pago...</p>
                </div>
              ) : (
                <div className="flex-grow overflow-auto">
                  {/* Izipay Payment Form Container */}
                  <div
                    className="kr-embedded bg-white rounded-xl p-4 border border-gray-200"
                    kr-popin="true"
                    kr-form-token={formToken}
                  >
                    <div className="space-y-4">
                      <div className="kr-pan"></div>
                      <div className="flex gap-3">
                        <div className="kr-expiry flex-1"></div>
                        <div className="kr-security-code flex-1"></div>
                      </div>
                      <button className="kr-payment-button w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                        Pagar Ahora
                      </button>
                      <div className="kr-form-error"></div>
                    </div>
                  </div>
                  {/* Security Info */}
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Pago 100% seguro con encriptación SSL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
