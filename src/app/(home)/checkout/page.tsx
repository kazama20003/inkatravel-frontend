"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  Plus,
  CreditCard,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  DollarSign,
  Gift,
  Phone,
  Mail,
  Globe,
  Loader2,
  AlertCircle,
  Trash2,
  MapPin,
  Clock,
  Star,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CountrySelect } from "@/components/login/country-select"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import type { CartsApiResponse, CartResponse, UpdateCartItemDto, CartItem } from "@/types/cart"
import type { CreateOrderDto, CustomerInfoDto, OrderItemDto } from "@/types/order-user"

// Componente de Calendario Personalizado
const CustomCalendar = ({
  onDateSelect,
  cartData,
}: { onDateSelect: (date: Date) => void; cartData: CartResponse | null }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()

  const daysInMonth = lastDayOfMonth.getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayWeekday }, () => null)

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day)
    return date < today
  }

  const getDayStyle = (day: number) => {
    if (!cartData?.items) return ""
    const date = new Date(year, month, day)

    const matchingItems = cartData.items.filter((item) => {
      const itemDate = new Date(item.startDate)
      return itemDate.toDateString() === date.toDateString()
    })

    if (matchingItems.length > 0) {
      if (matchingItems.length === 1) {
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
      } else {
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
      }
    }

    if (isDateDisabled(day)) {
      return "text-gray-300 cursor-not-allowed bg-gray-50"
    }

    return "text-gray-700 hover:bg-orange-100 hover:text-orange-700 bg-white border border-orange-200"
  }

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return
    const date = new Date(year, month, day)
    onDateSelect(date)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-10 w-10 p-0 hover:bg-orange-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-orange-600" />
        </Button>
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
          {monthNames[month]} {year}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="h-10 w-10 p-0 hover:bg-orange-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-orange-600" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-bold text-orange-700 py-2 bg-orange-100 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}
        {daysArray.map((day) => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            disabled={isDateDisabled(day)}
            className={`h-12 w-12 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 relative ${getDayStyle(day)}`}
          >
            {day}
            {cartData?.items &&
              cartData.items.filter((item) => {
                const itemDate = new Date(item.startDate)
                const date = new Date(year, month, day)
                return itemDate.toDateString() === date.toDateString()
              }).length > 1 && (
                <div className="absolute -top-1 -right-1 bg-white text-purple-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {
                    cartData.items.filter((item) => {
                      const itemDate = new Date(item.startDate)
                      const date = new Date(year, month, day)
                      return itemDate.toDateString() === date.toDateString()
                    }).length
                  }
                </div>
              )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Componente para editar cantidad inline
const QuantityEditor = ({
  item,
  onUpdate,
}: {
  item: CartItem
  onUpdate: (people: number) => void
}) => {
  const [people, setPeople] = useState(item.people)

  const handleDecrease = () => {
    if (people > 1) {
      const newPeople = people - 1
      setPeople(newPeople)
      onUpdate(newPeople)
    }
  }

  const handleIncrease = () => {
    const newPeople = people + 1
    setPeople(newPeople)
    onUpdate(newPeople)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPeople = Math.max(1, Number.parseInt(e.target.value) || 1)
    setPeople(newPeople)
    onUpdate(newPeople)
  }

  return (
    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrease}
        disabled={people <= 1}
        className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100 disabled:opacity-50"
      >
        <Minus className="w-4 h-4 text-orange-600" />
      </Button>
      <Input
        type="number"
        min="1"
        value={people}
        onChange={handleInputChange}
        className="text-center h-8 w-16 border-orange-300 focus:border-orange-500"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrease}
        className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100"
      >
        <Plus className="w-4 h-4 text-orange-600" />
      </Button>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartData, setCartData] = useState<CartResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+51",
    phone: "",
    fullName: "",
    visitorPhone: "",
    birthDate: "",
    nationality: "",
  })

  // Load cart data on component mount
  useEffect(() => {
    const loadCartData = async () => {
      try {
        setLoading(true)
        const response = await api.get<CartsApiResponse>("/cart")

        if (response.data.data && response.data.data.length > 0) {
          const cart = response.data.data[0]
          setCartData(cart)
        } else {
          setError("No hay productos en tu carrito")
          toast.error("Tu carrito está vacío")
          router.push("/tours")
        }
      } catch (err: unknown) {
        console.error("Error loading cart:", err)
        setError("Error al cargar el carrito")
        toast.error("Error al cargar tu carrito")

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number } }
          if (axiosError.response?.status === 401) {
            router.push("/login")
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadCartData()
  }, [router])

  // Update cart item quantity
  const updateCartItemQuantity = async (itemId: string, people: number) => {
    if (!cartData) return

    try {
      const updateData: UpdateCartItemDto = { people }
      await api.patch(`/cart/${cartData._id}/items/${itemId}`, updateData)

      // Update local state
      const updatedItems = cartData.items.map((item) => {
        if (item._id === itemId) {
          const newTotal = people * item.pricePerPerson
          return { ...item, people, total: newTotal }
        }
        return item
      })

      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0)
      setCartData({ ...cartData, items: updatedItems, totalPrice: newTotalPrice })

      toast.success("Cantidad actualizada correctamente")
    } catch (err) {
      console.error("Error updating cart item:", err)
      toast.error("Error al actualizar la cantidad")
    }
  }

  // Remove cart item using correct endpoint
  const removeCartItem = async (tourId: string) => {
    if (!cartData) return

    try {
      await api.delete(`/cart/${cartData._id}/items/${tourId}`)

      // Update local state
      const updatedItems = cartData.items.filter((item) => item.tour._id !== tourId)
      if (updatedItems.length === 0) {
        router.push("/tours")
        return
      }

      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
      setCartData({
        ...cartData,
        items: updatedItems,
        totalPrice: newTotal,
      })

      toast.success("Tour eliminado del carrito")
    } catch (err) {
      console.error("Error removing cart item:", err)
      toast.error("Error al eliminar el tour")
    }
  }

  // Update all cart items with new date
  const updateAllItemsDate = async (newDate: Date) => {
    if (!cartData) return

    try {
      const updatePromises = cartData.items.map(async (item) => {
        const updateData: UpdateCartItemDto = { startDate: newDate.toISOString() }
        return api.patch(`/cart/${cartData._id}/items/${item._id}`, updateData)
      })

      await Promise.all(updatePromises)

      // Update local state
      const updatedItems = cartData.items.map((item) => ({
        ...item,
        startDate: newDate.toISOString(),
      }))

      setCartData({ ...cartData, items: updatedItems })

      toast.success(`Fecha actualizada para todos los tours: ${newDate.toLocaleDateString("es-ES")}`)
    } catch (err) {
      console.error("Error updating all items date:", err)
      toast.error("Error al actualizar las fechas")
    }
  }

  // Update individual cart item date
  const updateItemDate = async (itemId: string, newDate: Date) => {
    if (!cartData) return

    try {
      const updateData: UpdateCartItemDto = { startDate: newDate.toISOString() }
      await api.patch(`/cart/${cartData._id}/items/${itemId}`, updateData)

      // Update local state
      const updatedItems = cartData.items.map((item) => {
        if (item._id === itemId) {
          return { ...item, startDate: newDate.toISOString() }
        }
        return item
      })

      setCartData({ ...cartData, items: updatedItems })
      toast.success("Fecha del tour actualizada correctamente")
    } catch (err) {
      console.error("Error updating item date:", err)
      toast.error("Error al actualizar la fecha")
    }
  }

  // Calculate totals with discount
  const basePrice = cartData?.totalPrice || 0
  const discount = discountApplied ? basePrice * 0.1 : 0
  const finalTotal = basePrice - discount

  // Precios directos en soles
  const basePriceSoles = cartData?.totalPrice || 0
  const discountSoles = discountApplied ? basePriceSoles * 0.1 : 0
  const finalTotalSoles = basePriceSoles - discountSoles

  const steps = [
    { id: 1, title: "Detalles del Tour", icon: Calendar, description: "Revisa y ajusta fechas" },
    { id: 2, title: "Información de Contacto", icon: User, description: "Datos personales" },
    { id: 3, title: "Información del Visitante", icon: FileText, description: "Datos para Machu Picchu" },
    { id: 4, title: "Pago", icon: DollarSign, description: "Método de pago y confirmación" },
  ]

  const countries = [
    { code: "+51", name: "Perú", flag: "🇵🇪" },
    { code: "+1", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "+34", name: "España", flag: "🇪🇸" },
    { code: "+33", name: "Francia", flag: "🇫🇷" },
    { code: "+49", name: "Alemania", flag: "🇩🇪" },
    { code: "+44", name: "Reino Unido", flag: "🇬🇧" },
    { code: "+39", name: "Italia", flag: "🇮🇹" },
    { code: "+55", name: "Brasil", flag: "🇧🇷" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
  ]

  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "💳", description: "Tarjeta de crédito/débito" },
    { id: "mastercard", name: "Mastercard", icon: "💳", description: "Tarjeta de crédito/débito" },
    { id: "bcp", name: "BCP", icon: "🏦", description: "Banco de Crédito del Perú" },
    { id: "interbank", name: "Interbank", icon: "🏦", description: "Banco Interbank" },
    { id: "culqi", name: "Culqi", icon: "💰", description: "Pago seguro online" },
  ]

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "descuento10") {
      setDiscountApplied(true)
      toast.success("¡Descuento del 10% aplicado!")
    } else {
      toast.error("Código de descuento inválido")
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return cartData?.items && cartData.items.length > 0
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 3:
        return formData.fullName && formData.visitorPhone && formData.birthDate && formData.nationality
      case 4:
        return selectedPayment && acceptTerms
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cartData) {
      toast.error("Faltan datos requeridos")
      return
    }

    try {
      setSubmitting(true)

      // Prepare customer info
      const customerInfo: CustomerInfoDto = {
        fullName: formData.fullName || `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
      }

      // Prepare order items from cart with their individual dates
      const orderItems: OrderItemDto[] = cartData.items.map((item) => ({
        tour: item.tour._id,
        startDate: item.startDate, // Use individual item date
        people: item.people,
        pricePerPerson: item.pricePerPerson,
        total: item.total,
        notes: item.notes,
      }))

      // Create single order with all items
      const orderData: CreateOrderDto = {
        items: orderItems,
        customer: customerInfo,
        totalPrice: finalTotal,
        paymentMethod: selectedPayment,
        notes: `Reserva realizada desde checkout. ${cartData.items.length} tours incluidos.`,
        discountCodeUsed: discountApplied ? discountCode : undefined,
      }

      await api.post("/orders", orderData)

      toast.success("¡Reserva confirmada exitosamente!")
      router.push("/booking")
    } catch (err: unknown) {
      console.error("Error creating order:", err)
      toast.error("Error al procesar tu reserva. Inténtalo nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu carrito...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !cartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el carrito</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/tours")} className="bg-orange-500 hover:bg-orange-600">
            Volver a Tours
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium mb-4 shadow-sm">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Reserva 100% Segura
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Finalizar Reserva</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Completa tu información para confirmar tu aventura peruana
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center min-w-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg"
                        : currentStep === step.id - 1
                          ? "bg-orange-100 border-orange-300 text-orange-600"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 md:w-16 lg:w-24 h-1 mx-1 sm:mx-2 transition-all rounded-full ${
                        currentStep > step.id ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Paso 1: Detalles del Tour */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Tours en el Carrito */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                        <Calendar className="mr-2 sm:mr-3 text-orange-500" size={20} />
                        Tours Seleccionados
                      </h2>
                      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {cartData?.items.length} {cartData?.items.length === 1 ? "Tour" : "Tours"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {cartData?.items && cartData.items.length > 0 ? (
                        cartData.items.map((item, index) => (
                          <div
                            key={item._id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col lg:flex-row gap-4">
                              {/* Imagen del Tour */}
                              <div className="relative flex-shrink-0">
                                <Image
                                  src={item.tour.imageUrl || "/placeholder.svg?height=120&width=200"}
                                  alt={item.tour.title}
                                  width={200}
                                  height={120}
                                  className="w-full lg:w-48 h-32 object-cover rounded-lg"
                                />
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-orange-600 shadow-md">
                                  #{index + 1}
                                </div>
                                {item.tour.rating && (
                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {item.tour.rating}
                                  </div>
                                )}
                              </div>

                              {/* Información del Tour */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                      {item.tour.title}
                                    </h3>

                                    {(item.tour.location || item.tour.duration) && (
                                      <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                                        {item.tour.location && (
                                          <>
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                                            {item.tour.location}
                                          </>
                                        )}
                                        {item.tour.location && item.tour.duration && <span className="mx-2">•</span>}
                                        {item.tour.duration && (
                                          <>
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                                            {item.tour.duration}
                                          </>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3">
                                      <div className="flex items-center">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-500" />
                                        {new Date(item.startDate).toLocaleDateString("es-ES")}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newDate = prompt("Ingresa nueva fecha (YYYY-MM-DD):")
                                          if (newDate) {
                                            const date = new Date(newDate)
                                            if (!isNaN(date.getTime())) {
                                              updateItemDate(item._id, date)
                                            } else {
                                              toast.error("Fecha inválida")
                                            }
                                          }
                                        }}
                                        className="h-6 px-2 text-xs hover:bg-orange-50"
                                      >
                                        Cambiar fecha
                                      </Button>
                                    </div>

                                    {item.notes && (
                                      <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mb-3">
                                        {item.notes}
                                      </p>
                                    )}
                                  </div>

                                  {/* Cantidad y Precio */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm font-medium text-gray-700">Personas:</span>
                                      </div>
                                      <QuantityEditor
                                        item={item}
                                        onUpdate={(people) => updateCartItemQuantity(item._id, people)}
                                      />
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3">
                                      <div className="text-right">
                                        <p className="text-lg sm:text-xl font-bold text-orange-600">S/{item.total}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                          S/{item.pricePerPerson} por persona
                                        </p>
                                      </div>

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeCartItem(item.tour._id)}
                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No hay tours en tu carrito</p>
                        </div>
                      )}
                    </div>

                    {/* Incluye Section */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Lo que incluye tu reserva:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Transporte turístico",
                          "Guía profesional certificado",
                          "Entradas incluidas",
                          "Almuerzo típico",
                        ].map((item: string, index: number) => (
                          <div key={index} className="flex items-center text-xs sm:text-sm text-gray-700">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add More Tours Button */}
                    <Button
                      variant="outline"
                      className="w-full mt-6 border-dashed border-2 hover:bg-orange-50 hover:border-orange-300 h-12 transition-colors"
                      onClick={() => router.push("/tours")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-sm sm:text-base">Agregar más tours</span>
                    </Button>
                  </div>

                  {/* Selección de Fecha */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <Calendar className="mr-2 sm:mr-3 text-orange-500" size={20} />
                      Calendario de Tours
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base font-semibold text-gray-900 mb-3 block">
                          Vista general de fechas
                        </Label>
                        <div className="max-w-md mx-auto lg:max-w-none">
                          <CustomCalendar onDateSelect={updateAllItemsDate} cartData={cartData} />
                        </div>
                      </div>

                      {cartData?.items && cartData.items.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                            Fechas confirmadas por tour:
                          </h4>
                          {cartData.items.map((item, index) => (
                            <div
                              key={item._id}
                              className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                            >
                              <div className="flex items-center mb-2">
                                <Check className="w-4 h-4 text-green-600 mr-2" />
                                <p className="text-sm font-semibold text-green-800">Tour #{index + 1}</p>
                              </div>
                              <p className="text-sm text-green-700 mb-1 font-medium">{item.tour.title}</p>
                              <p className="text-sm text-green-700">
                                <strong>
                                  {new Date(item.startDate).toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </strong>
                              </p>
                            </div>
                          ))}
                          <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                            💡 <strong>Tip:</strong> Cada tour tiene su fecha individual. Puedes hacer clic en cualquier
                            fecha del calendario para cambiar la fecha de todos los tours a la vez.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Información de Contacto */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Users className="mr-2 sm:mr-3 text-orange-500" size={20} />
                    Información de Contacto
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block"
                      >
                        Nombre *
                      </Label>
                      <Input
                        id="firstName"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block">
                        Apellido(s) *
                      </Label>
                      <Input
                        id="lastName"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                      Correo electrónico *
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
                    <div>
                      <Label
                        htmlFor="countryCode"
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block"
                      >
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                        País *
                      </Label>
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => updateFormData("countryCode", value)}
                      >
                        <SelectTrigger className="h-10 sm:h-12">
                          <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                        Teléfono *
                      </Label>
                      <Input
                        id="phone"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        placeholder="999 999 999"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Información Segura</p>
                        <p className="text-xs sm:text-sm text-blue-700">
                          Utilizaremos esta información para enviarte la confirmación de tu reserva y mantenerte
                          informado sobre tu tour.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Información del Visitante */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Información del Visitante
                  </h2>
                  <p className="text-gray-600 mb-4 sm:mb-6 bg-yellow-50 p-3 sm:p-4 rounded-xl border border-yellow-200">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline text-yellow-600 mr-2" />
                    <span className="text-xs sm:text-sm">
                      Esta información es requerida por las autoridades peruanas para el ingreso a sitios arqueológicos
                      como Machu Picchu.
                    </span>
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="fullName" className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block">
                        Nombre completo (como aparece en el documento) *
                      </Label>
                      <Input
                        id="fullName"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        required
                      />
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 bg-gray-50 p-2 sm:p-3 rounded-lg">
                        <strong>Importante:</strong> Debe coincidir exactamente con tu pasaporte o documento de
                        identidad.
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="visitorPhone"
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block"
                      >
                        Teléfono del visitante *
                      </Label>
                      <Input
                        id="visitorPhone"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        value={formData.visitorPhone}
                        onChange={(e) => updateFormData("visitorPhone", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="birthDate"
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block"
                      >
                        Fecha de nacimiento *
                      </Label>
                      <Input
                        type="date"
                        id="birthDate"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        value={formData.birthDate}
                        onChange={(e) => updateFormData("birthDate", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="nationality"
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-2 block"
                      >
                        Nacionalidad *
                      </Label>
                      <CountrySelect
                        value={formData.nationality}
                        onValueChange={(value) => updateFormData("nationality", value)}
                        placeholder="Seleccionar nacionalidad..."
                        className="h-10 sm:h-12"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 4: Pago */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Código de Descuento */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <button
                      type="button"
                      onClick={() => setShowDiscount(!showDiscount)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <div className="flex items-center">
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2 sm:mr-3" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          ¿Tienes un código de descuento?
                        </h3>
                      </div>
                      {showDiscount ? (
                        <ChevronUp className="text-gray-400" />
                      ) : (
                        <ChevronDown className="text-gray-400" />
                      )}
                    </button>

                    {showDiscount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="flex gap-3">
                          <Input
                            placeholder="Introduce tu código aquí"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="h-10 sm:h-12"
                          />
                          <Button onClick={applyDiscount} variant="outline" className="h-10 sm:h-12 px-4 sm:px-6">
                            Aplicar
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {discountApplied && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-green-800 font-medium text-xs sm:text-sm">
                          ¡Descuento del 10% aplicado correctamente!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Método de Pago */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <CreditCard className="mr-2 sm:mr-3 text-orange-500" size={20} />
                      Método de Pago
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-left transition-all ${
                            selectedPayment === method.id
                              ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="text-xl sm:text-2xl mr-3 sm:mr-4">{method.icon}</div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">{method.name}</div>
                              <div className="text-xs sm:text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-start space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed">
                        Acepto los{" "}
                        <a href="#" className="text-orange-600 hover:underline font-medium">
                          términos y condiciones
                        </a>{" "}
                        y la{" "}
                        <a href="#" className="text-orange-600 hover:underline font-medium">
                          política de privacidad
                        </a>
                        . Entiendo que esta reserva está sujeta a disponibilidad y confirmación.
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8 gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Anterior
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center h-10 sm:h-12 px-4 sm:px-6 shadow-lg text-sm sm:text-base"
                >
                  Siguiente
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center h-10 sm:h-12 px-4 sm:px-8 shadow-lg disabled:opacity-50 text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Confirmar y Pagar S/{finalTotalSoles.toFixed(0)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 sticky top-24 sm:top-28 md:top-36"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Resumen de Compra</h3>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {cartData?.items?.map((item) => (
                  <div key={item._id} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-700 text-xs sm:text-sm block line-clamp-2">{item.tour.title}</span>
                      <span className="text-xs text-gray-500">
                        {item.people} {item.people === 1 ? "persona" : "personas"}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-semibold text-sm sm:text-base">S/{item.total}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Cargando...</p>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Subtotal</span>
                    <div className="text-right">
                      <span className="block">S/{basePriceSoles}</span>
                    </div>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600 mb-1">
                      <span>Descuento (10%)</span>
                      <div className="text-right">
                        <span>-S/{discountSoles}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total</span>
                    <div className="text-right text-orange-600">
                      <span className="text-orange-600">S/{finalTotalSoles.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                  Confirmación inmediata
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                  Cancelación gratuita 24h antes
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                  Soporte 24/7
                </div>
                <div className="flex items-center">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                  Pago 100% seguro
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <p className="text-xs sm:text-sm text-orange-800">
                  <strong>¿Necesitas ayuda?</strong>
                  <br />
                  Contáctanos al +51 999 999 999 o envíanos un WhatsApp
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
