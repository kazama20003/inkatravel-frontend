"use client"

import { useState, useEffect } from "react"
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
import Image from "next/image"
import "../../styles/izipay.css"
import type { Cart, CartItem, CartResponse } from "@/types/cart"
import { isAxiosError } from "axios"

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

interface PaymentResponse {
  formToken: string
  publicKey: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Cart | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await api.get<CartResponse>("/cart")
      const cartData = Array.isArray(response.data.data) && response.data.data.length > 0 ? response.data.data[0] : null
      setCart(cartData)
      setError(null)
    } catch (_err) {
      const message = isAxiosError(_err) ? _err.response?.data?.message : "Error loading cart"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toISOString().split("T")[0]
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!cart) return
    setCart({
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId ? { ...item, people: quantity, total: quantity * item.pricePerPerson } : item,
      ),
      totalPrice: cart.items.reduce(
        (sum, item) => sum + (item._id === itemId ? quantity * item.pricePerPerson : item.total),
        0,
      ),
    })
  }

  const updateDate = (itemId: string, date: string) => {
    if (!cart) return
    setCart({
      ...cart,
      items: cart.items.map((item) => (item._id === itemId ? { ...item, startDate: date } : item)),
    })
  }

  const removeItem = (itemId: string) => {
    if (!cart) return
    const newItems = cart.items.filter((item) => item._id !== itemId)
    const newTotal = newItems.reduce((sum, item) => sum + item.total, 0)
    setCart({
      ...cart,
      items: newItems,
      totalPrice: newTotal,
    })
  }

  const getItemDisplayData = (item: CartItem) => {
    return {
      title: item.productTitle || "Servicio",
      location: item.productSlug || "",
      imageUrl: item.productImageUrl,
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (cart?.items.length === 0) {
        toast.error("Tu carrito está vacío")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (!customerInfo.email) {
        toast.error("Por favor completa tu email")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      try {
        setIsProcessingPayment(true)

        const paymentData = {
          amount: cart?.totalPrice || 0,
          currency: "PEN",
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone,
          billingAddress: {
            zip: customerInfo.zipCode,
            country: customerInfo.country,
            city: customerInfo.city,
            state: customerInfo.state,
          },
        }

        const response = await api.post<PaymentResponse>("/payments/create-form-token", paymentData)
        const { publicKey } = response.data

        type IsotisWindow = Window & {
          Isotis?: {
            KRClient: {
              default: new (
                config: string,
              ) => {
                attachForm: (element: HTMLElement | null) => void
                showForm: () => void
              }
            }
          }
        }

        const paymentWindow = window as IsotisWindow

        setShowPaymentModal(true)

        setTimeout(() => {
          if (paymentWindow.Isotis) {
            const KRClient = paymentWindow.Isotis.KRClient.default
            const client = new KRClient(publicKey)
            client.attachForm(document.getElementById("kr-form"))
            client.showForm()
          }
        }, 500)
      } catch (_err) {
        const message = isAxiosError(_err) ? _err.response?.data?.message : "Error al procesar el pago"
        toast.error(message)
      } finally {
        setIsProcessingPayment(false)
      }
    }
  }

  const handlePaymentExpired = () => {
    setShowPaymentModal(false)
    toast.error("La sesión de pago ha expirado")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-peru-orange" />
          <p className="text-foreground/60">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  if (error || !cart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error al cargar el carrito</h2>
          <p className="text-foreground/60 mb-6">{error}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
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

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-lg font-bold mb-6">Dirección de Facturación</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="text-sm font-bold mb-1 block">Código Postal</Label>
                      <Input
                        value={customerInfo.zipCode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                        placeholder="12345"
                        className="h-10 rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 rounded-sm">
                      Atrás
                    </Button>
                    <Button onClick={handleNext} disabled={isProcessingPayment} className="flex-1 rounded-sm">
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Finalizar Pago"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      {showPaymentModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card rounded-sm max-w-md w-full relative"
            >
              <button
                onClick={() => handlePaymentExpired()}
                className="absolute right-4 top-4 p-2 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Procesando Pago</h3>
                <div id="kr-form" className="kr-form"></div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
