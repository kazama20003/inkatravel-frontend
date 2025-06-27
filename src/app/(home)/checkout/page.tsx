"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  MapPin,
  Clock,
  Star,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CountrySelect } from "@/components/login/country-select"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import type { CreateMultiOrderDto, OrderItemDto, CustomerInfoDto } from "@/types/order"
import Image from "next/image"

// Cart interfaces
interface CartTour {
  _id: string
  title: string
  imageUrl?: string
  price: number
  slug?: string
  location?: string
  duration?: string
  rating?: number
  reviews?: number
}

interface CartItem {
  _id: string
  tour: CartTour
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

interface Cart {
  _id: string
  items: CartItem[]
  totalPrice: number
  userId: string
  isOrdered: boolean
  createdAt: string
  updatedAt: string
}

interface CartResponse {
  message: string
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: Cart[]
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoDto>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
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

      if (response.data.data && response.data.data.length > 0) {
        const cartData = response.data.data[0] // Get first cart
        console.log("Cart data:", cartData)

        if (cartData.items && cartData.items.length > 0) {
          setCart(cartData)
        } else {
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

  // Update item quantity
  const updateQuantity = async (tourId: string, newQuantity: number) => {
    if (newQuantity < 1 || !cart) return

    try {
      const response = await api.patch(`/cart/items/${tourId}`, {
        cartId: cart._id,
        people: newQuantity,
      })

      if (response.data) {
        // Update local state without reloading
        const updatedCart = { ...cart }
        const itemIndex = updatedCart.items.findIndex((item) => item.tour._id === tourId)
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
  const removeItem = async (tourId: string) => {
    if (!cart) return

    try {
      const response = await api.delete(`/cart/${cart._id}/items/${tourId}`)

      if (response.data) {
        // Update local state without reloading
        const updatedCart = { ...cart }
        updatedCart.items = updatedCart.items.filter((item) => item.tour._id !== tourId)
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
  const updateDate = async (tourId: string, newDate: string) => {
    if (!cart) return

    try {
      const response = await api.patch(`/cart/items/${tourId}`, {
        cartId: cart._id,
        startDate: newDate,
      })

      if (response.data) {
        // Update local state without reloading
        const updatedCart = { ...cart }
        const itemIndex = updatedCart.items.findIndex((item) => item.tour._id === tourId)
        if (itemIndex !== -1) {
          updatedCart.items[itemIndex].startDate = newDate
          setCart(updatedCart)
        }
        toast.success("Fecha actualizada")
      }
    } catch (err) {
      console.error("Error updating date:", err)
      toast.error("Error al actualizar la fecha")
    }
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return cart !== null && cart.items.length > 0
      case 2:
        return (
          customerInfo.fullName.trim() !== "" &&
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
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    } else {
      toast.error("Por favor completa todos los campos requeridos")
    }
  }

  // Go to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Submit order
  const submitOrder = async () => {
    if (!cart || !validateStep(2) || !validateStep(3)) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    try {
      setSubmitting(true)

      // Convert cart items to order items
      const orderItems: OrderItemDto[] = cart.items.map((item) => ({
        tour: item.tour._id,
        startDate: item.startDate,
        people: item.people,
        pricePerPerson: item.pricePerPerson,
        total: item.total,
        notes: item.notes,
      }))

      const orderData: CreateMultiOrderDto = {
        items: orderItems,
        customer: customerInfo,
        totalPrice: cart.totalPrice,
        paymentMethod,
        notes: orderNotes,
        discountCodeUsed: discountCode || undefined,
      }

      console.log("Submitting order:", orderData)

      const response = await api.post("/orders", orderData)

      if (response.data) {
        toast.success("¡Reserva creada exitosamente!")

        // Clear cart after successful order
        try {
          await api.delete(`/cart/${cart._id}`)
        } catch (err) {
          console.log("Error clearing cart:", err)
        }

        // Redirect to success page or user profile
        router.push("/users?tab=orders")
      }
    } catch (err: unknown) {
      console.error("Error submitting order:", err)
      toast.error("Error al crear la reserva")
    } finally {
      setSubmitting(false)
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
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

  if (error || !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-6">
          <Package className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Carrito Vacío</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.push("/tours")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Explorar Tours
            </Button>
            <Button variant="outline" onClick={loadCart}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Finalizar Reserva</h1>
            <p className="text-base sm:text-lg text-gray-600">Completa tu reserva en unos simples pasos</p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 sm:w-12 h-1 mx-2 ${
                      step < currentStep ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-4 gap-4 sm:gap-8 text-xs sm:text-sm text-center max-w-md">
              <span className={currentStep >= 1 ? "text-orange-600 font-medium" : "text-gray-500"}>Carrito</span>
              <span className={currentStep >= 2 ? "text-orange-600 font-medium" : "text-gray-500"}>Datos</span>
              <span className={currentStep >= 3 ? "text-orange-600 font-medium" : "text-gray-500"}>Pago</span>
              <span className={currentStep >= 4 ? "text-orange-600 font-medium" : "text-gray-500"}>Confirmar</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart Review */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
                    Revisa tu Carrito
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {cart.items.map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Tour Image */}
                          <div className="flex-shrink-0">
                            <Image
                              src={item.tour.imageUrl || "/placeholder.svg?height=120&width=180"}
                              alt={item.tour.title}
                              width={180}
                              height={120}
                              className="w-full sm:w-32 h-24 sm:h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Tour Info */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                  {item.tour.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                                    {item.tour.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                                    {item.tour.duration}
                                  </div>
                                  {item.tour.rating && (
                                    <div className="flex items-center">
                                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 fill-current" />
                                      {item.tour.rating} ({item.tour.reviews})
                                    </div>
                                  )}
                                </div>

                                {/* Date Selection */}
                                <div className="mb-3">
                                  <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                    Fecha del Tour
                                  </Label>
                                  <Input
                                    type="date"
                                    value={item.startDate.split("T")[0]}
                                    onChange={(e) => updateDate(item.tour._id, e.target.value)}
                                    min={getMinDate()}
                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                  />
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <Label className="text-xs sm:text-sm font-medium text-gray-700">Personas:</Label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.tour._id, item.people - 1)}
                                      disabled={item.people <= 1}
                                      className="w-8 h-8 p-0"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium">{item.people}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.tour._id, item.people + 1)}
                                      className="w-8 h-8 p-0"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Actions */}
                              <div className="text-right flex-shrink-0">
                                <p className="text-lg sm:text-xl font-bold text-orange-600 mb-2">S/ {item.total}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                                  S/ {item.pricePerPerson} por persona
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeItem(item.tour._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Customer Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
                    Información Personal
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Nombre Completo *</Label>
                      <Input
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                        placeholder="Tu nombre completo"
                        className="h-10 sm:h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Correo Electrónico *</Label>
                      <Input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="h-10 sm:h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono</Label>
                      <Input
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+51 999 999 999"
                        className="h-10 sm:h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Nacionalidad</Label>
                      <CountrySelect
                        value={customerInfo.nationality}
                        onValueChange={(value) => setCustomerInfo({ ...customerInfo, nationality: value })}
                        placeholder="Seleccionar país..."
                        className="h-10 sm:h-12"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
                    Método de Pago
                  </h2>

                  <div className="space-y-4">
                    {/* Payment Methods */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setPaymentMethod("bcp")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "bcp"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-orange-500 mr-3 flex items-center justify-center">
                            {paymentMethod === "bcp" && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">BCP</p>
                            <p className="text-sm text-gray-600">Banco de Crédito del Perú</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("interbank")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "interbank"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-orange-500 mr-3 flex items-center justify-center">
                            {paymentMethod === "interbank" && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Interbank</p>
                            <p className="text-sm text-gray-600">Banco Interbank</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("bbva")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "bbva"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-orange-500 mr-3 flex items-center justify-center">
                            {paymentMethod === "bbva" && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">BBVA</p>
                            <p className="text-sm text-gray-600">Banco BBVA Continental</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("scotiabank")}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "scotiabank"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-orange-500 mr-3 flex items-center justify-center">
                            {paymentMethod === "scotiabank" && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Scotiabank</p>
                            <p className="text-sm text-gray-600">Banco Scotiabank Perú</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Notas Adicionales (Opcional)
                      </Label>
                      <Textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Alguna solicitud especial o comentario..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
                    Confirmar Reserva
                  </h2>

                  {/* Order Summary */}
                  <div className="space-y-6">
                    {/* Customer Info Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <p>
                          <strong>Nombre:</strong> {customerInfo.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {customerInfo.email}
                        </p>
                        {customerInfo.phone && (
                          <p>
                            <strong>Teléfono:</strong> {customerInfo.phone}
                          </p>
                        )}
                        {customerInfo.nationality && (
                          <p>
                            <strong>Nacionalidad:</strong> {customerInfo.nationality}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tours Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Tours Reservados</h3>
                      <div className="space-y-3">
                        {cart.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.tour.title}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(item.startDate).toLocaleDateString("es-ES")} • {item.people} persona
                                {item.people > 1 ? "s" : ""}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">S/ {item.total}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Método de Pago</h3>
                      <p className="text-sm text-gray-700 capitalize">{paymentMethod}</p>
                    </div>

                    {/* Order Notes */}
                    {orderNotes && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Notas Adicionales</h3>
                        <p className="text-sm text-gray-700">{orderNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      onClick={submitOrder}
                      disabled={submitting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar Reserva
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 sticky top-24"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h3>

              {/* Tours List */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-2">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.tour.title}</p>
                      <p className="text-gray-600">
                        {item.people} × S/ {item.pricePerPerson}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">S/ {item.total}</p>
                  </div>
                ))}
              </div>

              {/* Discount Code Example */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Código de Descuento</Label>
                <div className="flex gap-2">
                  <Input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Ej: WELCOME10"
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-gray-500 cursor-not-allowed bg-transparent"
                    disabled
                  >
                    <Tag className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Funcionalidad próximamente disponible</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">S/ {cart.totalPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Total</span>
                  <span>S/ {cart.totalPrice}</span>
                </div>
              </div>

              {/* Example Discount Codes */}
              <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800 mb-2">Códigos de Ejemplo</h4>
                <div className="space-y-1 text-xs text-orange-700">
                  <p>• WELCOME10 - 10% de descuento</p>
                  <p>• SUMMER20 - 20% de descuento</p>
                  <p>• SAVE50 - S/ 50 de descuento</p>
                  <p className="text-orange-600 font-medium mt-2">*Solo para demostración</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
