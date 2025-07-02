"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Users, DollarSign } from "lucide-react"
import { api } from "@/lib/axiosInstance"
import { toast } from "sonner"

interface TourSelectionOption {
  _id: string
  title: string
  price: number
  duration: string
  region: string
}

interface UserOption {
  _id: string
  fullName: string
}

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  nationality: string
}

interface CreateOrderDto {
  tour: string
  customer: CustomerInfo
  startDate: string
  people: number
  totalPrice: number
  paymentMethod: string
  notes: string
  discountCodeUsed: string
  user: string
}

interface ApiResponse<T> {
  data: T
}

interface OrderFormDialogProps {
  trigger?: React.ReactNode
  onOrderCreated: () => void
}

export function OrderFormDialog({ trigger, onOrderCreated }: OrderFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<TourSelectionOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [selectedTour, setSelectedTour] = useState<TourSelectionOption | null>(null)

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

  const fetchTours = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<TourSelectionOption[]>>("/tours")
      const toursData = response.data.data || response.data
      setTours(
        Array.isArray(toursData)
          ? toursData.map((tour) => ({
              _id: tour._id,
              title: tour.title,
              price: tour.price,
              duration: tour.duration,
              region: tour.region,
            }))
          : [],
      )
    } catch (error) {
      console.error("Error fetching tours:", error)
      toast.error("Error al cargar los tours")
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<UserOption[]>>("/users/names")
      const usersData = response.data.data || response.data
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error al cargar los usuarios")
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchTours()
      fetchUsers()
    }
  }, [open, fetchTours, fetchUsers])

  useEffect(() => {
    if (selectedTour && formData.people > 0) {
      setFormData((prev) => ({
        ...prev,
        totalPrice: selectedTour.price * formData.people,
      }))
    }
  }, [selectedTour, formData.people])

  const handleTourChange = (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId)
    setSelectedTour(tour || null)
    setFormData((prev) => ({
      ...prev,
      tour: tourId,
      totalPrice: tour ? tour.price * prev.people : 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tour || !formData.customer.fullName || !formData.customer.email || !formData.startDate) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setLoading(true)
      await api.post("/orders", formData)
      toast.success("Reserva creada exitosamente")
      onOrderCreated()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating order:", error)
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al crear la reserva"
      toast.error(errorMessage || "Error al crear la reserva")
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
    setSelectedTour(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Reserva</DialogTitle>
          <DialogDescription>Completa la información para crear una nueva reserva</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Tour */}
          <div className="space-y-2">
            <Label htmlFor="tour">Tour *</Label>
            <Select value={formData.tour} onValueChange={handleTourChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tour" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour._id} value={tour._id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tour.title}</span>
                      <span className="text-sm text-muted-foreground">
                        ${tour.price} - {tour.duration} - {tour.region}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="PE, US, BR, etc."
                />
              </div>
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalles de la Reserva</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="people">Número de Personas *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="people"
                    type="number"
                    min="1"
                    value={formData.people}
                    onChange={(e) => setFormData((prev) => ({ ...prev, people: Number.parseInt(e.target.value) || 1 }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Precio Total</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, totalPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="bcp">BCP</SelectItem>
                    <SelectItem value="interbank">Interbank</SelectItem>
                    <SelectItem value="scotiabank">Scotiabank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user">Asignar a Usuario</Label>
                <Select
                  value={formData.user}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, user: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
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
                placeholder="Código de descuento (opcional)"
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
