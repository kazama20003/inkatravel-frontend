"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Plus, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { CreateOrderDto, UserOption, TourSelectionOption } from "@/types/order"
import { createOrder, getUsers, getToursForSelection } from "@/lib/orders-api"

interface OrderFormDialogProps {
  onOrderCreated: () => void
  trigger?: React.ReactNode
}

export function OrderFormDialog({ onOrderCreated, trigger }: OrderFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<TourSelectionOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState<CreateOrderDto>({
    tour: "",
    customer: {
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
    },
    startDate: "",
    people: 1,
    totalPrice: 0,
    paymentMethod: "",
    notes: "",
    discountCodeUsed: "",
    user: "",
  })

  useEffect(() => {
    if (open) {
      fetchTours()
      fetchUsers()
    }
  }, [open])

  const fetchTours = async () => {
    try {
      const toursData = await getToursForSelection()
      setTours(toursData)
    } catch {
      toast.error("Error al cargar los tours")
    }
  }

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers()
      setUsers(usersData)
    } catch {
      toast.error("Error al cargar los usuarios")
    }
  }

  const selectedTour = tours.find((tour) => tour._id === formData.tour)
  const selectedUser = users.find((user) => user._id === formData.user)

  const calculateTotalPrice = useCallback(() => {
    return formData.totalPrice
  }, [formData.totalPrice])

  useEffect(() => {
    calculateTotalPrice()
  }, [calculateTotalPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) {
      toast.error("Selecciona una fecha de inicio")
      return
    }

    if (!formData.tour) {
      toast.error("Selecciona un tour")
      return
    }

    if (!formData.customer.fullName || !formData.customer.email) {
      toast.error("Completa la información del cliente")
      return
    }

    if (formData.totalPrice <= 0) {
      toast.error("Ingresa un precio total válido")
      return
    }

    try {
      setLoading(true)
      const orderData: CreateOrderDto = {
        ...formData,
        startDate: selectedDate.toISOString(),
      }

      // Solo incluir user si tiene un valor válido
      if (formData.user && formData.user.trim() !== "") {
        orderData.user = formData.user
      }

      // Remover el campo user si está vacío para evitar enviarlo
      if (!formData.user || formData.user.trim() === "") {
        delete orderData.user
      }

      console.log("Datos a enviar:", orderData) // Para debug

      await createOrder(orderData)
      toast.success("Reserva creada exitosamente")
      setOpen(false)
      resetForm()
      onOrderCreated()
    } catch (error) {
      console.error("Error al crear reserva:", error) // Para debug
      toast.error("Error al crear la reserva")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      tour: "",
      customer: {
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
      },
      startDate: "",
      people: 1,
      totalPrice: 0,
      paymentMethod: "",
      notes: "",
      discountCodeUsed: "",
      user: "",
    })
    setSelectedDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nueva Reserva</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-lg sm:text-xl">Crear Nueva Reserva</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="sm:hidden">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Selección de Tour */}
            <div className="space-y-2">
              <Label htmlFor="tour">Tour *</Label>
              <Select
                value={formData.tour}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tour: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tour" />
                </SelectTrigger>
                <SelectContent>
                  {tours.map((tour) => (
                    <SelectItem key={tour._id} value={tour._id}>
                      {tour.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Información del Cliente */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Información del Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    value={formData.customer.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, fullName: e.target.value },
                      }))
                    }
                    placeholder="Nombre completo del cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, email: e.target.value },
                      }))
                    }
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.customer.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, phone: e.target.value },
                      }))
                    }
                    placeholder="+51 999 999 999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidad</Label>
                  <Input
                    id="nationality"
                    value={formData.customer.nationality}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, nationality: e.target.value },
                      }))
                    }
                    placeholder="Peruana"
                  />
                </div>
              </div>
            </div>

            {/* Detalles de la Reserva */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Detalles de la Reserva</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">
                          {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="people">Número de Personas *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      value={formData.people}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, people: Number.parseInt(e.target.value) || 1 }))
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Precio Total */}
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Precio Total (S/) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  S/
                </span>
                <Input
                  id="totalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, totalPrice: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Tour Seleccionado */}
            {selectedTour && (
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{selectedTour.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{formData.people} personas</p>
                    {selectedUser && (
                      <p className="text-xs sm:text-sm text-muted-foreground">Asignado a: {selectedUser.fullName}</p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">S/</span>
                      <span className="text-xl sm:text-2xl font-bold">{formData.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información Adicional */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Información Adicional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="yape">Yape</SelectItem>
                      <SelectItem value="plin">Plin</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">Usuario Asignado</Label>
                  <Select
                    value={formData.user}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, user: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountCode">Código de Descuento</Label>
                <Input
                  id="discountCode"
                  value={formData.discountCodeUsed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discountCodeUsed: e.target.value }))}
                  placeholder="CODIGO2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas adicionales sobre la reserva..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 order-1 sm:order-2">
                {loading ? "Creando..." : "Crear Reserva"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
