"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/ui/image-upload"
import { api } from "@/lib/axiosInstance"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2, Save, Clock } from "lucide-react"
import type { CreateTourTransportDto } from "@/types/tour-transport"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const LANGUAGES = [
  { code: "es" as const, label: "Español" },
  { code: "en" as const, label: "English" },
  { code: "fr" as const, label: "Français" },
  { code: "de" as const, label: "Deutsch" },
  { code: "it" as const, label: "Italiano" },
]

export default function NewTourTransportPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const { register, control, handleSubmit, watch, setValue } = useForm<CreateTourTransportDto>({
    defaultValues: {
      title: {},
      description: {},
      termsAndConditions: {},
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      intermediateStops: [],
      availableDays: [],
      price: 0,
      isActive: true,
      isFeatured: false,
      slug: "",
      itinerary: [],
    },
  })

  const {
    fields: intermediateStopsFields,
    append: appendIntermediateStop,
    remove: removeIntermediateStop,
  } = useFieldArray({
    control,
    name: "intermediateStops",
  })

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  })

  const availableDays = watch("availableDays") || []
  const mainImageUrl = watch("imageUrl")
  const mainImageId = watch("imageId")

  const toggleDay = (day: string) => {
    const current = availableDays
    if (current.includes(day)) {
      setValue(
        "availableDays",
        current.filter((d: string) => d !== day),
      )
    } else {
      setValue("availableDays", [...current, day])
    }
  }

  const onSubmit = async (data: CreateTourTransportDto) => {
    try {
      setSubmitting(true)
      const formattedData = {
        ...data,
        departureTime: data.departureTime ? formatTimeForAPI(data.departureTime) : undefined,
        arrivalTime: data.arrivalTime ? formatTimeForAPI(data.arrivalTime) : undefined,
      }
      await api.post("/tour-transport", formattedData)
      toast.success("Creado exitosamente", {
        description: "El tour de transporte ha sido creado.",
      })
      router.push("/dashboard/tour-transport")
    } catch (err) {
      console.error("Error creating transport:", err)
      toast.error("Error al crear", {
        description: "No se pudo crear el tour de transporte. Intenta nuevamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimeForAPI = (time: string): string => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Panel Administrativo</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/tour-transport">Tours Transport</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Nuevo Transporte</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Crear Tour de Transporte</h1>
              <p className="text-muted-foreground">Complete todos los campos requeridos para crear un nuevo tour</p>
            </div>
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Main Image Upload */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Imagen Principal</CardTitle>
                <CardDescription>Imagen destacada del tour de transporte (opcional)</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={mainImageUrl}
                  imageId={mainImageId}
                  onChange={(url, id) => {
                    setValue("imageUrl", url)
                    setValue("imageId", id)
                  }}
                  onRemove={() => {
                    setValue("imageUrl", "")
                    setValue("imageId", "")
                  }}
                  disabled={submitting}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Título, descripción y términos en múltiples idiomas (requerido)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Title */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Título *</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {LANGUAGES.map((lang) => (
                      <div key={`title-${lang.code}`} className="space-y-2">
                        <Label htmlFor={`title-${lang.code}`} className="text-sm font-medium">
                          {lang.label}
                        </Label>
                        <Input
                          id={`title-${lang.code}`}
                          {...register(`title.${lang.code}`)}
                          placeholder={`Título en ${lang.label}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Descripción *</Label>
                  <div className="space-y-4">
                    {LANGUAGES.map((lang) => (
                      <div key={`description-${lang.code}`} className="space-y-2">
                        <Label htmlFor={`description-${lang.code}`} className="text-sm font-medium">
                          {lang.label}
                        </Label>
                        <Textarea
                          id={`description-${lang.code}`}
                          {...register(`description.${lang.code}`)}
                          placeholder={`Descripción en ${lang.label}`}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Términos y Condiciones *</Label>
                  <div className="space-y-4">
                    {LANGUAGES.map((lang) => (
                      <div key={`terms-${lang.code}`} className="space-y-2">
                        <Label htmlFor={`terms-${lang.code}`} className="text-sm font-medium">
                          {lang.label}
                        </Label>
                        <Textarea
                          id={`terms-${lang.code}`}
                          {...register(`termsAndConditions.${lang.code}`)}
                          placeholder={`Términos en ${lang.label}`}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicaciones</CardTitle>
                <CardDescription>Origen y destino con coordenadas GPS (requerido)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Origin */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Origen *</Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="origin-name">Nombre (opcional)</Label>
                      <Input id="origin-name" {...register("origin.name")} placeholder="Ej: Cabanaconde" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-lat">Latitud *</Label>
                      <Input
                        id="origin-lat"
                        type="number"
                        step="any"
                        {...register("origin.lat", { valueAsNumber: true })}
                        placeholder="-15.6167"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-lng">Longitud *</Label>
                      <Input
                        id="origin-lng"
                        type="number"
                        step="any"
                        {...register("origin.lng", { valueAsNumber: true })}
                        placeholder="-71.9833"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Destination */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Destino *</Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="destination-name">Nombre (opcional)</Label>
                      <Input id="destination-name" {...register("destination.name")} placeholder="Ej: Cusco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination-lat">Latitud *</Label>
                      <Input
                        id="destination-lat"
                        type="number"
                        step="any"
                        {...register("destination.lat", { valueAsNumber: true })}
                        placeholder="-13.5319"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination-lng">Longitud *</Label>
                      <Input
                        id="destination-lng"
                        type="number"
                        step="any"
                        {...register("destination.lng", { valueAsNumber: true })}
                        placeholder="-71.9675"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Intermediate Stops */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Paradas Intermedias (opcional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendIntermediateStop({ name: "", lat: 0, lng: 0 })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Parada
                    </Button>
                  </div>
                  {intermediateStopsFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Parada {index + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIntermediateStop(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input {...register(`intermediateStops.${index}.name`)} placeholder="Nombre de la parada" />
                        </div>
                        <div className="space-y-2">
                          <Label>Latitud</Label>
                          <Input
                            type="number"
                            step="any"
                            {...register(`intermediateStops.${index}.lat`, { valueAsNumber: true })}
                            placeholder="0.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitud</Label>
                          <Input
                            type="number"
                            step="any"
                            {...register(`intermediateStops.${index}.lng`, { valueAsNumber: true })}
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios y Duración</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Días disponibles (requerido) y tiempos de viaje - Hora de Perú (GMT-5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Available Days */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Días Disponibles *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${
                          availableDays.includes(day) ? "bg-primary/10 border-primary" : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => toggleDay(day)}
                      >
                        <Checkbox
                          id={`day-${day}`}
                          checked={availableDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <Label htmlFor={`day-${day}`} className="cursor-pointer font-normal flex-1 text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Time Inputs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime" className="flex items-center gap-2">
                      Hora de Salida (opcional)
                      <span className="text-xs text-muted-foreground">(GMT-5)</span>
                    </Label>
                    <Input id="departureTime" type="time" {...register("departureTime")} className="block w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime" className="flex items-center gap-2">
                      Hora de Llegada (opcional)
                      <span className="text-xs text-muted-foreground">(GMT-5)</span>
                    </Label>
                    <Input id="arrivalTime" type="time" {...register("arrivalTime")} className="block w-full" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración - Texto (opcional)</Label>
                    <Input id="duration" {...register("duration")} placeholder="Ej: 6h" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationInHours">Duración - Horas (opcional)</Label>
                    <Input
                      id="durationInHours"
                      type="number"
                      step="0.5"
                      {...register("durationInHours", { valueAsNumber: true })}
                      placeholder="6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Details */}
            <Card>
              <CardHeader>
                <CardTitle>Precio y Detalles</CardTitle>
                <CardDescription>Información de precio (requerido) y configuración del tour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="50.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Calificación (opcional, 0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      {...register("rating", { valueAsNumber: true })}
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">ID del Vehículo (opcional)</Label>
                    <Input id="vehicleId" {...register("vehicleId")} placeholder="ID del vehículo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routeCode">Código de Ruta (opcional)</Label>
                    <Input id="routeCode" {...register("routeCode")} placeholder="Ej: CAB-CUS-001" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug - URL amigable (opcional)</Label>
                  <Input id="slug" {...register("slug")} placeholder="transporte-cabanaconde-cusco" />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="cursor-pointer font-medium">
                        Activo
                      </Label>
                      <p className="text-sm text-muted-foreground">El tour estará visible para los usuarios</p>
                    </div>
                    <Switch id="isActive" {...register("isActive")} defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                      <Label htmlFor="isFeatured" className="cursor-pointer font-medium">
                        Destacado
                      </Label>
                      <p className="text-sm text-muted-foreground">Mostrar como tour destacado</p>
                    </div>
                    <Switch id="isFeatured" {...register("isFeatured")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Itinerario (opcional)</CardTitle>
                <CardDescription>Días del tour con descripciones detalladas e imágenes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Días del Itinerario</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendItinerary({
                        day: itineraryFields.length + 1,
                        title: {},
                        description: {},
                        imageUrl: "",
                        imageId: "",
                        route: [],
                      })
                    }
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Día
                  </Button>
                </div>

                {itineraryFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-6 p-6 border rounded-lg bg-gradient-to-br from-muted/30 to-muted/10"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Día {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItinerary(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Número de Día *</Label>
                      <Input
                        type="number"
                        {...register(`itinerary.${index}.day`, { valueAsNumber: true })}
                        placeholder="1"
                      />
                    </div>

                    {/* Image Upload for Itinerary Days */}
                    <div className="space-y-2">
                      <Label>Imagen del Día *</Label>
                      <ImageUpload
                        value={watch(`itinerary.${index}.imageUrl`)}
                        imageId={watch(`itinerary.${index}.imageId`)}
                        onChange={(url, id) => {
                          setValue(`itinerary.${index}.imageUrl`, url)
                          setValue(`itinerary.${index}.imageId`, id)
                        }}
                        onRemove={() => {
                          setValue(`itinerary.${index}.imageUrl`, "")
                          setValue(`itinerary.${index}.imageId`, "")
                        }}
                        disabled={submitting}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="font-medium">Título *</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {LANGUAGES.map((lang) => (
                          <div key={`itinerary-${index}-title-${lang.code}`} className="space-y-2">
                            <Label className="text-sm">{lang.label}</Label>
                            <Input
                              {...register(`itinerary.${index}.title.${lang.code}`)}
                              placeholder={`Título en ${lang.label}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-medium">Descripción *</Label>
                      <div className="space-y-3">
                        {LANGUAGES.map((lang) => (
                          <div key={`itinerary-${index}-desc-${lang.code}`} className="space-y-2">
                            <Label className="text-sm">{lang.label}</Label>
                            <Textarea
                              {...register(`itinerary.${index}.description.${lang.code}`)}
                              placeholder={`Descripción en ${lang.label}`}
                              rows={2}
                              className="resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {itineraryFields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">No hay días en el itinerario</p>
                    <p className="text-sm text-muted-foreground mt-1">{'Haz clic en "Agregar Día" para comenzar'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6 pb-8">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting} size="lg">
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2 min-w-[180px]" size="lg">
                <Save className="h-4 w-4" />
                {submitting ? "Creando..." : "Crear Transporte"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}
