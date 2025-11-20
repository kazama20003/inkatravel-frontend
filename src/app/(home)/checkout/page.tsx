"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CountrySelect } from "@/components/login/country-select"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import { isAxiosError } from "axios"
import Image from "next/image"
import "../../styles/izipay.css"
import type { Cart, CartItem, CartResponse } from "@/types/cart"

interface CustomerInfoDto {
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  identityType?: string
  identityCode?: string
  address?: string
  country?: string
  city?: string
  state?: string
  zipCode?: string
  nationality?: string
  fullName?: string
}

interface CreatePaymentDto {
  amount: number
  currency: string
  orderId: string
  formAction: "PAID"
  contextMode?: "TEST" | "PRODUCTION"
  customer: CustomerInfoDto
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
  identityType?: string
  identityCode?: string
  state?: string
  zipCode?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Cart | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formToken, setFormToken] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const [customerInfo, setCustomerInfo] = useState<UserData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })
  const [orderNotes, setOrderNotes] = useState("")

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<CartResponse>("/cart")

      if (response.data.data && response.data.data.length > 0) {
        const cartData = response.data.data[0]
        setCart(cartData)
        if (!cartData.items || cartData.items.length === 0) {
          setError("Tu carrito está vacío")
        }
      } else {
        setError("Tu carrito está vacío")
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          toast.error("Debes iniciar sesión")
          router.push("/login")
          return
        }
      }
      setError("Error al cargar el carrito")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadCart()
  }, [loadCart])

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

  const cartItemToDto = (item: CartItem) => {
    let productId: string
    if (typeof item.productId === "string") {
      productId = item.productId
    } else if (item.productId && typeof item.productId === "object" && "_id" in item.productId) {
      productId = (item.productId as { _id: string })._id
    } else {
      productId = ""
    }

    return {
      productType: item.productType,
      productId: productId,
      startDate: item.startDate,
      people: item.people,
      pricePerPerson: item.pricePerPerson,
      total: item.total,
      notes: item.notes,
      productTitle: item.productTitle,
      productImageUrl: item.productImageUrl,
      productSlug: item.productSlug,
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !cart) return

    const updatedItems = cart.items.map((item) => {
      if (item._id === itemId) {
        return {
          ...item,
          people: newQuantity,
          total: newQuantity * item.pricePerPerson,
        }
      }
      return item
    })

    const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0)
    setCart({ ...cart, items: updatedItems, totalPrice: newTotalPrice })

    try {
      await api.patch("/cart", {
        items: updatedItems.map(cartItemToDto),
        totalPrice: newTotalPrice,
      })
      toast.success("Cantidad actualizada")
    } catch {
      await loadCart()
      toast.error("Error al actualizar")
    }
  }

  const removeItem = async (itemId: string) => {
    if (!cart) return

    const updatedItems = cart.items.filter((item) => item._id !== itemId)
    const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0)
    setCart({ ...cart, items: updatedItems, totalPrice: newTotalPrice })

    try {
      await api.delete(`/cart/items/${itemId}`)
      toast.success("Tour eliminado")
    } catch {
      await loadCart()
      toast.error("Error al eliminar")
    }
  }

  const updateDate = async (itemId: string, newDate: string) => {
    if (!cart) return

    const updatedItems = cart.items.map((item) =>
      item._id === itemId ? { ...item, startDate: `${newDate}T00:00:00.000Z` } : item,
    )

    setCart({ ...cart, items: updatedItems })

    try {
      await api.patch("/cart", {
        items: updatedItems.map(cartItemToDto),
        totalPrice: cart.totalPrice,
      })
      toast.success("Fecha actualizada")
    } catch {
      await loadCart()
      toast.error("Error al actualizar")
    }
  }

  const generatePaymentToken = async () => {
    if (!cart) return

    setIsProcessingPayment(true)
    setError(null)

    try {
      const customerData: CustomerInfoDto = {
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phoneNumber: customerInfo.phone || undefined,
        identityType: customerInfo.identityType || undefined,
        identityCode: customerInfo.identityCode || undefined,
        address: customerInfo.address || undefined,
        country: customerInfo.country || undefined,
        city: customerInfo.city || undefined,
      }

      // Convert PEN to USD (÷3.6) for izipay payment
      const amountInUSD = Number((cart.totalPrice / 3.6).toFixed(2))

      const payload: CreatePaymentDto = {
        amount: amountInUSD,
        currency: "USD",
        orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        formAction: "PAID",
        contextMode: "TEST",
        customer: customerData,
      }

      const response = await api.post<FormTokenResponse>("/payments/formtoken", payload)

      if (!response.data.formToken) {
        throw new Error("No se recibió el token de pago")
      }

      setFormToken(response.data.formToken)
      setShowPaymentModal(true)
    } catch (error: unknown) {
      let errorMessage = "Error en el pago"
      if (isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data as Record<string, unknown>
        if (responseData.message) {
          errorMessage = Array.isArray(responseData.message)
            ? responseData.message.join(", ")
            : String(responseData.message)
        }
      }
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return cart !== null && cart.items.length > 0
    }
    if (step === 2) {
      return (
        customerInfo.firstName.trim() !== "" &&
        customerInfo.lastName.trim() !== "" &&
        customerInfo.email.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
      )
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Por favor completa todos los campos")
      return
    }
    if (currentStep === 2) {
      generatePaymentToken()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const getMinDate = () => new Date().toISOString().split("T")[0]

  const getItemDisplayData = (item: CartItem) => ({
    id: item._id,
    title: item.productTitle || "Servicio",
    imageUrl: item.productImageUrl || "/placeholder.svg",
    location: item.notes?.split(" - ")[1] || "Ubicación no disponible",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  if (error || !cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-32">
        <div className="text-center max-w-sm">
          <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-foreground/50" />
          <h1 className="text-2xl font-bold mb-3">Carrito Vacío</h1>
          <p className="text-foreground/70 mb-8">Agrega tours o servicios para continuar</p>
          <Button onClick={() => router.push("/tours")} className="w-full">
            Ver Tours
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-32">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart Items */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Tus Servicios</h2>
                    <div className="space-y-4">
                      {cart.items.map((item) => {
                        const displayData = getItemDisplayData(item)
                        return (
                          <div key={item._id} className="bg-card border border-border overflow-hidden rounded-sm">
                            <div className="p-4 flex gap-4">
                              <Image
                                src={displayData.imageUrl || "/placeholder.svg?height=120&width=160"}
                                alt={displayData.title}
                                width={160}
                                height={120}
                                className="w-40 h-28 object-cover"
                              />

                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-bold text-foreground mb-1 line-clamp-2">{displayData.title}</h3>
                                  <p className="text-sm text-foreground/60">{displayData.location}</p>
                                </div>

                                {/* Date and Quantity */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                  <div className="flex-1">
                                    <label className="text-xs text-foreground/60 block mb-1">Fecha</label>
                                    <Input
                                      type="date"
                                      value={item.startDate.split("T")[0]}
                                      onChange={(e) => updateDate(item._id, e.target.value)}
                                      min={getMinDate()}
                                      className="text-sm h-8 rounded-sm"
                                    />
                                  </div>

                                  <div className="flex items-end gap-2">
                                    <label className="text-xs text-foreground/60 block">Personas</label>
                                    <div className="flex items-center border border-border bg-muted rounded-sm">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateQuantity(item._id, item.people - 1)}
                                        disabled={item.people <= 1}
                                        className="h-8 w-8 p-0 rounded-none"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="w-8 text-center text-sm font-semibold">{item.people}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateQuantity(item._id, item.people + 1)}
                                        className="h-8 w-8 p-0 rounded-none"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Delete */}
                              <div className="flex flex-col items-end justify-between">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeItem(item._id)}
                                  className="text-foreground/50 hover:text-destructive rounded-none"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="text-right">
                                  <p className="text-lg font-bold">$ {item.total.toFixed(2)}</p>
                                  <p className="text-xs text-foreground/60">$ {item.pricePerPerson.toFixed(2)}/pers.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <Label className="text-sm font-bold mb-2 block">Notas Especiales (Opcional)</Label>
                    <Textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Restricciones alimentarias, solicitudes especiales..."
                      className="min-h-24 resize-none text-sm rounded-sm"
                    />
                  </div>

                  <Button onClick={handleNext} className="w-full rounded-sm">
                    Continuar con Información
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Customer Info */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-lg font-bold mb-6">Información Personal</h2>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Nombre</Label>
                        <Input
                          value={customerInfo.firstName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                          placeholder="Tu nombre"
                          className="h-10 rounded-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Apellido</Label>
                        <Input
                          value={customerInfo.lastName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                          placeholder="Tu apellido"
                          className="h-10 rounded-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-bold mb-1 block">Email</Label>
                      <Input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="h-10 rounded-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-bold mb-1 block">Teléfono</Label>
                      <Input
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+51 999 999 999"
                        className="h-10 rounded-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Tipo de Documento</Label>
                        <Select
                          value={customerInfo.identityType}
                          onValueChange={(value) => setCustomerInfo({ ...customerInfo, identityType: value })}
                        >
                          <SelectTrigger className="h-10 rounded-sm">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                            <SelectItem value="CE">Carné de Extranjería</SelectItem>
                            <SelectItem value="RUC">RUC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Documento</Label>
                        <Input
                          value={customerInfo.identityCode}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, identityCode: e.target.value })}
                          placeholder="12345678"
                          className="h-10 rounded-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-bold mb-1 block">País</Label>
                      <CountrySelect
                        value={customerInfo.country}
                        onValueChange={(value) => setCustomerInfo({ ...customerInfo, country: value })}
                        placeholder="Seleccionar país..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Ciudad</Label>
                        <Input
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          placeholder="Lima"
                          className="h-10 rounded-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-bold mb-1 block">Región</Label>
                        <Input
                          value={customerInfo.state}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                          placeholder="Lima"
                          className="h-10 rounded-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 rounded-sm">
                      Atrás
                    </Button>
                    <Button onClick={handleNext} disabled={isProcessingPayment} className="flex-1 rounded-sm">
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Ir al Pago"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-sm p-6 sticky top-40 h-fit"
            >
              <h3 className="font-bold text-foreground mb-5">Resumen del Pedido</h3>

              <div className="space-y-3 mb-5 pb-5 border-b border-border max-h-72 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="text-sm">
                    <p className="font-semibold text-foreground line-clamp-2">{item.productTitle}</p>
                    <p className="text-foreground/70 text-xs mt-1">
                      {item.people} × $ {item.pricePerPerson.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-semibold">$ {cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>$ {cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-foreground/60 p-3 bg-muted rounded-sm">
                Pago seguro con encriptación bancaria
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-sm shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Completar Pago</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-muted rounded-sm p-4 mb-6">
                <p className="text-xs text-foreground/70 mb-1">Total a pagar</p>
                <p className="text-3xl font-bold">$ {cart?.totalPrice.toFixed(2)}</p>
              </div>

              {!formToken ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-foreground/50" />
                  <p className="text-sm text-foreground/60">Preparando formulario de pago...</p>
                </div>
              ) : (
                <div className="kr-embedded" kr-popin="true" kr-form-token={formToken}>
                  <div className="space-y-3">
                    <div className="kr-pan"></div>
                    <div className="flex gap-3">
                      <div className="kr-expiry flex-1"></div>
                      <div className="kr-security-code flex-1"></div>
                    </div>
                    <button className="kr-payment-button w-full">Pagar Ahora</button>
                    <div className="kr-form-error text-sm"></div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
