"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ShoppingCart,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  User,
  Globe,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Shield,
  Gift,
  X,
  Plus,
  Minus,
} from "lucide-react"
import { api } from "@/lib/axiosInstance"
import type { Cart, CartItem } from "@/types/cart"
import type { Tour } from "@/types/tour"
import { toast } from "sonner"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { CountrySelect } from "@/components/login/country-select"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
    status?: number
  }
  message?: string
}

interface CartItemWithTour extends CartItem {
  tourDetails?: Tour
}

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  nationality: string
}

interface VisitorInfo {
  documentType: string
  documentNumber: string
  birthDate: string
  emergencyContact: string
  emergencyPhone: string
  medicalConditions: string
  dietaryRestrictions: string
}

interface CreateOrderDto {
  items: {
    tour: string
    startDate: string
    people: number
    pricePerPerson: number
    total: number
    notes?: string
  }[]
  customer: CustomerInfo
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartData, setCartData] = useState<Cart | null>(null)
  const [cartItems, setCartItems] = useState<CartItemWithTour[]>([])
  const [loading, setLoading] = useState(true)
  const [processingOrder, setProcessingOrder] = useState(false)

  // Form data states
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  })

  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>({
    documentType: "DNI",
    documentNumber: "",
    birthDate: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
    dietaryRestrictions: "",
  })

  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Discount states
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false)
  const [tempDate, setTempDate] = useState<Date>()
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get("/cart")
      if (response.data.data) {
        setCartData(response.data.data)

        // Fetch tour details for each item
        const itemsWithTours = await Promise.all(
          response.data.data.items.map(async (item: CartItem) => {
            try {
              const tourResponse = await api.get(`/tours/${item.tour}`)
              return {
                ...item,
                tourDetails: tourResponse.data.data,
              }
            } catch (error) {
              console.error(`Error fetching tour ${item.tour}:`, error)
              return item
            }
          }),
        )
        setCartItems(itemsWithTours)
      }
    } catch (err) {
      const apiError = err as ApiError
      console.error("Error fetching cart:", apiError)
      if (apiError.response?.status === 401) {
        toast.error("Debes estar autenticado para acceder al checkout")
        router.push("/login")
      } else {
        toast.error("Error al cargar el carrito")
        router.push("/tours")
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Update form data
  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const updateVisitorInfo = (field: keyof VisitorInfo, value: string) => {
    setVisitorInfo((prev) => ({ ...prev, [field]: value }))
  }

  // Update item date
  const updateItemDate = async (itemId: string, newDate: Date) => {
    try {
      const updatedItems = cartItems.map((item) =>
        item._id === itemId ? { ...item, startDate: newDate.toISOString() } : item,
      )
      setCartItems(updatedItems)

      // Update in backend
      await api.put("/cart", {
        items: updatedItems.map((item) => ({
          tour: item.tour,
          startDate: item.startDate,
          people: item.people,
          pricePerPerson: item.pricePerPerson,
          total: item.total,
          notes: item.notes,
        })),
        totalPrice: cartData?.totalPrice || 0,
      })

      toast.success("Fecha actualizada correctamente")
    } catch (error) {
      console.error("Error updating date:", error)
      toast.error("Error al actualizar la fecha")
    }
  }

  // Update all dates
  const updateAllDates = async (newDate: Date) => {
    try {
      const updatedItems = cartItems.map((item) => ({
        ...item,
        startDate: newDate.toISOString(),
      }))
      setCartItems(updatedItems)

      // Update in backend
      await api.put("/cart", {
        items: updatedItems.map((item) => ({
          tour: item.tour,
          startDate: item.startDate,
          people: item.people,
          pricePerPerson: item.pricePerPerson,
          total: item.total,
          notes: item.notes,
        })),
        totalPrice: cartData?.totalPrice || 0,
      })

      toast.success("Todas las fechas actualizadas correctamente")
    } catch (error) {
      console.error("Error updating all dates:", error)
      toast.error("Error al actualizar las fechas")
    }
  }

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      const updatedItems = cartItems.filter((item) => item._id !== itemId)
      setCartItems(updatedItems)

      if (updatedItems.length === 0) {
        await api.delete("/cart")
        toast.success("Carrito vaciado")
        router.push("/tours")
        return
      }

      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0)

      await api.put("/cart", {
        items: updatedItems.map((item) => ({
          tour: item.tour,
          startDate: item.startDate,
          people: item.people,
          pricePerPerson: item.pricePerPerson,
          total: item.total,
          notes: item.notes,
        })),
        totalPrice: newTotal,
      })

      setCartData((prev) => (prev ? { ...prev, totalPrice: newTotal } : null))
      toast.success("Tour eliminado del carrito")
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Error al eliminar el tour")
    }
  }

  // Update quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const updatedItems = cartItems.map((item) => {
        if (item._id === itemId) {
          const newTotal = item.pricePerPerson * newQuantity
          return { ...item, people: newQuantity, total: newTotal }
        }
        return item
      })
      setCartItems(updatedItems)

      const newCartTotal = updatedItems.reduce((sum, item) => sum + item.total, 0)

      await api.put("/cart", {
        items: updatedItems.map((item) => ({
          tour: item.tour,
          startDate: item.startDate,
          people: item.people,
          pricePerPerson: item.pricePerPerson,
          total: item.total,
          notes: item.notes,
        })),
        totalPrice: newCartTotal,
      })

      setCartData((prev) => (prev ? { ...prev, totalPrice: newCartTotal } : null))
      toast.success("Cantidad actualizada")
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Error al actualizar la cantidad")
    }
  }

  // Apply discount
  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "descuento10") {
      setDiscountApplied(true)
      setDiscountAmount(cartData ? cartData.totalPrice * 0.1 : 0)
      toast.success("¡Descuento del 10% aplicado!")
    } else {
      toast.error("Código de descuento inválido")
    }
  }

  // Remove discount
  const removeDiscount = () => {
    setDiscountApplied(false)
    setDiscountAmount(0)
    setDiscountCode("")
    toast.success("Descuento removido")
  }

  // Validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return cartItems.length > 0
      case 2:
        return !!(customerInfo.fullName && customerInfo.email && customerInfo.phone && customerInfo.nationality)
      case 3:
        return !!(
          visitorInfo.documentType &&
          visitorInfo.documentNumber &&
          visitorInfo.birthDate &&
          visitorInfo.emergencyContact &&
          visitorInfo.emergencyPhone
        )
      case 4:
        return !!(selectedPayment && acceptTerms)
      default:
        return false
    }
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    } else {
      toast.error("Por favor completa todos los campos requeridos")
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Process order
  const processOrder = async () => {
    if (!validateStep(4)) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    try {
      setProcessingOrder(true)

      const finalTotal = cartData ? cartData.totalPrice - discountAmount : 0

      const orderItems = cartItems.map((item) => ({
        tour: item.tour,
        startDate: item.startDate,
        people: item.people,
        pricePerPerson: item.pricePerPerson,
        total: item.total,
        notes: item.notes || `Tour: ${item.tourDetails?.title || "Tour"}`,
      }))

      const orderData: CreateOrderDto = {
        items: orderItems,
        customer: customerInfo,
        totalPrice: finalTotal,
        paymentMethod: selectedPayment,
        notes: `Reserva realizada desde checkout. ${cartData?.items.length} tours incluidos.`,
        discountCodeUsed: discountApplied ? discountCode : undefined,
      }

      const response = await api.post("/orders", orderData)

      if (response.data.success) {
        // Clear cart after successful order
        await api.delete("/cart")

        toast.success("¡Orden creada exitosamente!")
        router.push(`/booking-confirmation/${response.data.data._id}`)
      }
    } catch (error) {
      console.error("Error processing order:", error)
      toast.error("Error al procesar la orden. Inténtalo de nuevo.")
    } finally {
      setProcessingOrder(false)
    }
  }

  // Calendar handlers
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setTempDate(date)
  }

  const confirmDateChange = () => {
    if (!tempDate) return

    if (editingItemId) {
      updateItemDate(editingItemId, tempDate)
    } else {
      updateAllDates(tempDate)
    }

    setShowCalendar(false)
    setEditingItemId(null)
    setTempDate(undefined)
  }

  const cancelDateChange = () => {
    setShowCalendar(false)
    setEditingItemId(null)
    setTempDate(undefined)
  }

  // Get unique dates for calendar display
  const getUniqueDates = () => {
    const dates = cartItems.map((item) => new Date(item.startDate))
    const uniqueDates = dates.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)))
    return uniqueDates
  }

  // Count tours per date
  const getToursCountForDate = (date: Date) => {
    return cartItems.filter((item) => isSameDay(new Date(item.startDate), date)).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peru-orange mx-auto mb-4"></div>
          <p className="text-peru-dark body-text">Cargando checkout...</p>
        </div>
      </div>
    )
  }

  if (!cartData || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl brand-text text-peru-dark mb-4">Tu carrito está vacío</h1>
          <p className="text-peru-dark/70 body-text mb-8">Agrega algunos tours para continuar con el checkout.</p>
          <button
            onClick={() => router.push("/tours")}
            className="px-8 py-4 bg-peru-orange text-white brand-text hover:bg-peru-orange/90 transition-colors rounded-xl"
          >
            EXPLORAR TOURS
          </button>
        </div>
      </div>
    )
  }

  const finalTotal = cartData.totalPrice - discountAmount

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl brand-text text-peru-dark mb-4">Finalizar Reserva</h1>
          <p className="text-peru-dark/70 body-text">Completa tu información para confirmar la reserva</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep >= step ? "bg-peru-orange text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors ${
                      currentStep > step ? "bg-peru-orange" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-8 text-sm">
            <span className={currentStep >= 1 ? "text-peru-orange font-medium" : "text-gray-500"}>Carrito</span>
            <span className={currentStep >= 2 ? "text-peru-orange font-medium" : "text-gray-500"}>Contacto</span>
            <span className={currentStep >= 3 ? "text-peru-orange font-medium" : "text-gray-500"}>Visitante</span>
            <span className={currentStep >= 4 ? "text-peru-orange font-medium" : "text-gray-500"}>Pago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl brand-text text-peru-dark mb-6 flex items-center">
                    <ShoppingCart className="mr-3 text-peru-orange" size={24} />
                    Revisa tu Carrito
                  </h2>

                  {/* Calendar Section */}
                  <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg brand-text text-peru-dark mb-4 flex items-center">
                      <Calendar className="mr-2 text-blue-600" size={20} />
                      Fechas de Tours
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {getUniqueDates().map((date, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                          <div>
                            <p className="font-medium text-peru-dark">
                              {format(date, "EEEE, dd 'de' MMMM", { locale: es })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getToursCountForDate(date)} tour{getToursCountForDate(date) > 1 ? "s" : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setEditingItemId(null)
                              setTempDate(date)
                              setShowCalendar(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Cambiar fecha para todos los tours de este día"
                          >
                            <Edit3 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setEditingItemId(null)
                        setTempDate(addDays(new Date(), 7))
                        setShowCalendar(true)
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Cambiar Todas las Fechas
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.tourDetails?.imageUrl || "/placeholder.svg?height=80&width=80"}
                              alt={item.tourDetails?.title || "Tour"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg brand-text text-peru-dark mb-2">
                              {item.tourDetails?.title || "Tour"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1 text-peru-orange" />
                                {format(new Date(item.startDate), "dd/MM/yyyy", { locale: es })}
                              </div>
                              <div className="flex items-center">
                                <Users size={14} className="mr-1 text-peru-orange" />
                                {item.people} persona{item.people > 1 ? "s" : ""}
                              </div>
                              <div className="flex items-center">
                                <MapPin size={14} className="mr-1 text-peru-orange" />
                                {item.tourDetails?.location}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item._id!, item.people - 1)}
                                  disabled={item.people <= 1}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-medium">{item.people}</span>
                                <button
                                  onClick={() => updateQuantity(item._id!, item.people + 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => {
                                    setEditingItemId(item._id!)
                                    setTempDate(new Date(item.startDate))
                                    setShowCalendar(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-800 p-2"
                                  title="Cambiar fecha de este tour"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => removeItem(item._id!)}
                                  className="text-red-600 hover:text-red-800 p-2"
                                  title="Eliminar tour"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-peru-dark">S/ {item.total}</p>
                                  <p className="text-sm text-gray-500">S/ {item.pricePerPerson} c/u</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl brand-text text-peru-dark mb-6 flex items-center">
                    <User className="mr-3 text-peru-orange" size={24} />
                    Información de Contacto
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Nombre Completo *</label>
                      <input
                        type="text"
                        value={customerInfo.fullName}
                        onChange={(e) => updateCustomerInfo("fullName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Email *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => updateCustomerInfo("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => updateCustomerInfo("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Nacionalidad *</label>
                      <CountrySelect
                        value={customerInfo.nationality}
                        onValueChange={(value) => updateCustomerInfo("nationality", value)}
                        placeholder="Seleccionar nacionalidad..."
                        className="h-12"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Visitor Information */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl brand-text text-peru-dark mb-6 flex items-center">
                    <Globe className="mr-3 text-peru-orange" size={24} />
                    Información del Visitante
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Tipo de Documento *</label>
                      <select
                        value={visitorInfo.documentType}
                        onChange={(e) => updateVisitorInfo("documentType", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                      >
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Número de Documento *</label>
                      <input
                        type="text"
                        value={visitorInfo.documentNumber}
                        onChange={(e) => updateVisitorInfo("documentNumber", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="Número de documento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        value={visitorInfo.birthDate}
                        onChange={(e) => updateVisitorInfo("birthDate", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Contacto de Emergencia *</label>
                      <input
                        type="text"
                        value={visitorInfo.emergencyContact}
                        onChange={(e) => updateVisitorInfo("emergencyContact", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="Nombre del contacto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Teléfono de Emergencia *</label>
                      <input
                        type="tel"
                        value={visitorInfo.emergencyPhone}
                        onChange={(e) => updateVisitorInfo("emergencyPhone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">Condiciones Médicas</label>
                      <textarea
                        value={visitorInfo.medicalConditions}
                        onChange={(e) => updateVisitorInfo("medicalConditions", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="Alergias, medicamentos, etc. (opcional)"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-peru-dark mb-2">
                        Restricciones Alimentarias
                      </label>
                      <textarea
                        value={visitorInfo.dietaryRestrictions}
                        onChange={(e) => updateVisitorInfo("dietaryRestrictions", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                        placeholder="Vegetariano, vegano, sin gluten, etc. (opcional)"
                        rows={3}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl brand-text text-peru-dark mb-6 flex items-center">
                    <CreditCard className="mr-3 text-peru-orange" size={24} />
                    Método de Pago
                  </h2>

                  <div className="space-y-4 mb-6">
                    {[
                      { id: "tarjeta", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
                      { id: "transferencia", label: "Transferencia Bancaria", icon: CreditCard },
                      { id: "efectivo", label: "Pago en Efectivo", icon: CreditCard },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? "border-peru-orange bg-peru-orange/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="sr-only"
                        />
                        <method.icon className="w-5 h-5 mr-3 text-peru-orange" />
                        <span className="font-medium text-peru-dark">{method.label}</span>
                        {selectedPayment === method.id && <Check className="w-5 h-5 ml-auto text-peru-orange" />}
                      </label>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-peru-orange border-gray-300 rounded focus:ring-peru-orange"
                      />
                      <span className="text-sm text-gray-600">
                        Acepto los{" "}
                        <a href="/terms" className="text-peru-orange hover:underline">
                          términos y condiciones
                        </a>{" "}
                        y la{" "}
                        <a href="/privacy" className="text-peru-orange hover:underline">
                          política de privacidad
                        </a>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center px-6 py-3 bg-peru-orange text-white rounded-xl hover:bg-peru-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={processOrder}
                  disabled={processingOrder || !validateStep(4)}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Shield size={20} className="mr-2" />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl brand-text text-peru-dark mb-6">Resumen de Reserva</h3>

              {/* Tours Summary */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-peru-dark text-sm">{item.tourDetails?.title || "Tour"}</p>
                      <p className="text-xs text-gray-500">
                        {item.people} persona{item.people > 1 ? "s" : ""} × S/ {item.pricePerPerson}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.startDate), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                    <p className="font-bold text-peru-dark">S/ {item.total}</p>
                  </div>
                ))}
              </div>

              {/* Discount Section */}
              <div className="border-t pt-4 mb-6">
                {!discountApplied ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Gift className="w-4 h-4 mr-2 text-peru-orange" />
                      <span className="text-sm font-medium text-peru-dark">Código de Descuento</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Ingresa tu código"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-peru-orange focus:border-transparent"
                      />
                      <button
                        onClick={applyDiscount}
                        disabled={!discountCode.trim()}
                        className="px-4 py-2 bg-peru-orange text-white rounded-lg text-sm hover:bg-peru-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Gift className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Descuento aplicado</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-green-800 mr-2">-S/ {discountAmount.toFixed(2)}</span>
                      <button onClick={removeDiscount} className="text-red-600 hover:text-red-800">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">S/ {cartData.totalPrice}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600">Descuento:</span>
                    <span className="font-medium text-green-600">-S/ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold text-peru-dark border-t pt-2">
                  <span>Total:</span>
                  <span>S/ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Reserva Segura</span>
                </div>
                <p className="text-xs text-blue-700">Tu información está protegida con encriptación SSL de 256 bits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-peru-dark mb-4">
              {editingItemId ? "Cambiar Fecha del Tour" : "Cambiar Todas las Fechas"}
            </h3>

            <CalendarComponent
              mode="single"
              selected={tempDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              locale={es}
              className="rounded-md border"
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelDateChange}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDateChange}
                disabled={!tempDate}
                className="px-4 py-2 bg-peru-orange text-white rounded-lg hover:bg-peru-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
