"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Trash2, Car, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { TourFormData, TransportOption, TransportType } from "@/types/tour"

interface TransportFormProps {
  data: TourFormData
  onChange: (data: Partial<TourFormData>) => void
}

export function TransportForm({ data, onChange }: TransportFormProps) {
  const [newTransport, setNewTransport] = useState<TransportOption>({
    type: "Básico",
    vehicle: "",
    services: [],
  })
  const [newService, setNewService] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateTransport = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!newTransport.vehicle.trim()) {
      newErrors.vehicle = "El tipo de vehículo es requerido"
    }

    if (newTransport.services.length === 0) {
      newErrors.services = "Agrega al menos un servicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addService = () => {
    if (!newService.trim()) {
      setErrors({ ...errors, newService: "El servicio no puede estar vacío" })
      return
    }

    if (newTransport.services.includes(newService.trim())) {
      setErrors({ ...errors, newService: "Este servicio ya está agregado" })
      return
    }

    setNewTransport({
      ...newTransport,
      services: [...newTransport.services, newService.trim()],
    })
    setNewService("")
    setErrors({ ...errors, newService: "", services: "" })
  }

  const removeService = (index: number) => {
    setNewTransport({
      ...newTransport,
      services: newTransport.services.filter((_, i) => i !== index),
    })
  }

  const addTransportOption = () => {
    if (!validateTransport()) {
      toast.error("Información incompleta", {
        description: "Por favor completa todos los campos requeridos.",
      })
      return
    }

    // Inicializar transportOptions si es undefined
    const currentOptions = data.transportOptions || []
    onChange({
      transportOptions: [...currentOptions, { ...newTransport }],
    })

    setNewTransport({
      type: "Básico",
      vehicle: "",
      services: [],
    })

    toast.success("Transporte agregado", {
      description: "La opción de transporte se agregó correctamente.",
    })
  }

  const removeTransportOption = (index: number) => {
    // Verificar que transportOptions existe
    if (data.transportOptions) {
      onChange({
        transportOptions: data.transportOptions.filter((_, i) => i !== index),
      })

      toast.success("Transporte eliminado", {
        description: "La opción de transporte se eliminó correctamente.",
      })
    }
  }

  const getTransportTypeColor = (type: TransportType) => {
    switch (type) {
      case "Premium":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "Básico":
        return "bg-green-100 text-green-800 border-green-300"
    }
  }

  // Asegurar que transportOptions siempre sea un array
  const transportOptions = data.transportOptions || []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Opciones de Transporte</h3>
        <p className="text-sm text-muted-foreground">Define las opciones de transporte disponibles para este tour</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Agregar Opción de Transporte
          </CardTitle>
          <CardDescription>Configura el tipo de vehículo y servicios incluidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="transport-type">Tipo de Servicio</Label>
              <Select
                value={newTransport.type}
                onValueChange={(value: TransportType) => setNewTransport({ ...newTransport, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {newTransport.type === "Premium"
                  ? "Servicio de transporte de alta calidad con comodidades adicionales"
                  : "Servicio de transporte estándar"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle-type">Tipo de Vehículo *</Label>
              <Input
                id="vehicle-type"
                value={newTransport.vehicle}
                onChange={(e) => {
                  setNewTransport({ ...newTransport, vehicle: e.target.value })
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, vehicle: "" })
                  }
                }}
                placeholder="Ej: Bus turístico, Minivan, 4x4"
                className={errors.vehicle ? "border-red-500" : ""}
              />
              {errors.vehicle && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.vehicle}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Servicios Incluidos *</Label>
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => {
                  setNewService(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, newService: "" })
                  }
                }}
                placeholder="Ej: WiFi, Aire acondicionado, Guía bilingüe"
                className={errors.newService ? "border-red-500" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addService()
                  }
                }}
              />
              <Button type="button" onClick={addService}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.newService && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.newService}
              </p>
            )}
            {errors.services && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.services}
              </p>
            )}

            {/* Servicios agregados */}
            {newTransport.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newTransport.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    {service}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeService(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="button" onClick={addTransportOption} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Guardar Opción de Transporte
          </Button>
        </CardContent>
      </Card>

      {/* Opciones de transporte configuradas */}
      {transportOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Opciones de Transporte Configuradas ({transportOptions.length})
            </CardTitle>
            <CardDescription>Opciones de transporte agregadas al tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportOptions.map((transport, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getTransportTypeColor(transport.type)}>{transport.type}</Badge>
                      <span className="font-medium">{transport.vehicle}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTransportOption(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {transport.services.map((service, serviceIndex) => (
                      <Badge key={serviceIndex} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {transportOptions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay opciones de transporte</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Agrega opciones de transporte para que los clientes conozcan cómo se realizará el tour
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
