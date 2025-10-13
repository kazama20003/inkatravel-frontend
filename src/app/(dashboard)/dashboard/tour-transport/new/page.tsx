"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { api } from "@/lib/axiosInstance"
import { transportApi } from "@/lib/transport-api"
import type { TransportOption } from "@/types/transport"
import type { CreateTourTransportDto } from "@/types/tour-transport"
import { toast } from "sonner"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  ImageIcon,
  FileText,
  Settings,
  Info,
  Star,
  Globe,
  Route,
  CheckCircle2,
} from "lucide-react"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const LANGUAGES = [
  { code: "es" as const, label: "Español", flag: "🇪🇸" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
  { code: "de" as const, label: "Deutsch", flag: "🇩🇪" },
  { code: "it" as const, label: "Italiano", flag: "🇮🇹" },
]

export default function NewTourTransportPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [vehicles, setVehicles] = useState<TransportOption[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)

  const { register, control, handleSubmit, watch, setValue } = useForm<CreateTourTransportDto>({
    defaultValues: {
      title: {},
      description: {},
      termsAndConditions: {},
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      intermediateStops: [],
      availableDays: [],
      departureTime: "",
      arrivalTime: "",
      durationInHours: 0,
      duration: "",
      price: 0,
      oldPrice: 0,
      rating: 0,
      vehicleId: "",
      routeCode: "",
      slug: "",
      imageUrl: "",
      imageId: "",
      serviceType: "basic",
      servicePrice: 0,
      isActive: true,
      isFeatured: false,
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
  const isActive = watch("isActive")
  const isFeatured = watch("isFeatured")
  const selectedVehicleId = watch("vehicleId")

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true)
        const response = await transportApi.getAll(1, 100)
        setVehicles(response.data)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        toast.error("Error al cargar vehículos", {
          description: "No se pudieron cargar los vehículos disponibles.",
        })
      } finally {
        setLoadingVehicles(false)
      }
    }

    fetchVehicles()
  }, [])

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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
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
      </header>

      <div className="flex flex-1 flex-col bg-muted/30">
        <div className="mx-auto w-full max-w-10xl px-4 py-6 md:py-10 md:px-8">
          <div className="mb-8 rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                    <Route className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Crear Tour de Transporte</h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                      Complete el formulario para agregar un nuevo tour
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => router.back()} className="gap-2 self-start md:self-auto">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </div>
          </div>

          <Alert className="mb-6 border-l-4 border-l-blue-500 bg-blue-50/50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>Importante:</strong> Todos los campos marcados con <span className="text-destructive">*</span> son
              obligatorios.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-5">
                <TabsTrigger
                  value="general"
                  className="flex-col gap-1.5 rounded-lg border-2 bg-card py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="locations"
                  className="flex-col gap-1.5 rounded-lg border-2 bg-card py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs font-medium">Ubicaciones</span>
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="flex-col gap-1.5 rounded-lg border-2 bg-card py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-medium">Horarios</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex-col gap-1.5 rounded-lg border-2 bg-card py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs font-medium">Precios</span>
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="col-span-2 flex-col gap-1.5 rounded-lg border-2 bg-card py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md md:col-span-1"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs font-medium">Itinerario</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB: Información General */}
              <TabsContent value="general" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Imagen Principal</CardTitle>
                        <CardDescription className="text-sm">
                          Imagen destacada del tour <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
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
                    <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>Formatos aceptados: JPG, PNG, WebP. Tamaño recomendado: 1200x800px</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Información Multiidioma</CardTitle>
                        <CardDescription className="text-sm">
                          Título, descripción y términos en 5 idiomas <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    {/* Títulos */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Título</Label>
                        <Badge variant="destructive" className="h-5 text-xs">
                          Requerido
                        </Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {LANGUAGES.map((lang) => (
                          <div key={`title-${lang.code}`} className="space-y-2">
                            <Label htmlFor={`title-${lang.code}`} className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{lang.flag}</span>
                              {lang.label}
                            </Label>
                            <Input
                              id={`title-${lang.code}`}
                              {...register(`title.${lang.code}`)}
                              placeholder={`Título en ${lang.label}`}
                              required
                              className="h-11"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Descripciones */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Descripción</Label>
                        <Badge variant="destructive" className="h-5 text-xs">
                          Requerido
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        {LANGUAGES.map((lang) => (
                          <div key={`description-${lang.code}`} className="space-y-2">
                            <Label htmlFor={`description-${lang.code}`} className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{lang.flag}</span>
                              {lang.label}
                            </Label>
                            <Textarea
                              id={`description-${lang.code}`}
                              {...register(`description.${lang.code}`)}
                              placeholder={`Descripción detallada en ${lang.label}`}
                              rows={4}
                              className="resize-none"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Términos y Condiciones */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Términos y Condiciones</Label>
                        <Badge variant="destructive" className="h-5 text-xs">
                          Requerido
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        {LANGUAGES.map((lang) => (
                          <div key={`terms-${lang.code}`} className="space-y-2">
                            <Label htmlFor={`terms-${lang.code}`} className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{lang.flag}</span>
                              {lang.label}
                            </Label>
                            <Textarea
                              id={`terms-${lang.code}`}
                              {...register(`termsAndConditions.${lang.code}`)}
                              placeholder={`Términos y condiciones en ${lang.label}`}
                              rows={4}
                              className="resize-none"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Ubicaciones */}
              <TabsContent value="locations" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Origen y Destino</CardTitle>
                        <CardDescription className="text-sm">
                          Ubicaciones con coordenadas GPS <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    {/* Origen */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <span className="text-sm font-bold">A</span>
                        </div>
                        <Label className="text-base font-semibold">Origen</Label>
                        <Badge variant="destructive" className="h-5 text-xs">
                          Requerido
                        </Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="origin-name" className="text-sm">
                            Nombre del Lugar
                          </Label>
                          <Input
                            id="origin-name"
                            {...register("origin.name")}
                            placeholder="Ej: Cabanaconde"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="origin-lat" className="text-sm">
                            Latitud <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="origin-lat"
                            type="number"
                            step="any"
                            {...register("origin.lat", { valueAsNumber: true })}
                            placeholder="-15.6167"
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="origin-lng" className="text-sm">
                            Longitud <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="origin-lng"
                            type="number"
                            step="any"
                            {...register("origin.lng", { valueAsNumber: true })}
                            placeholder="-71.9833"
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Destino */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
                          <span className="text-sm font-bold">B</span>
                        </div>
                        <Label className="text-base font-semibold">Destino</Label>
                        <Badge variant="destructive" className="h-5 text-xs">
                          Requerido
                        </Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="destination-name" className="text-sm">
                            Nombre del Lugar
                          </Label>
                          <Input
                            id="destination-name"
                            {...register("destination.name")}
                            placeholder="Ej: Cusco"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination-lat" className="text-sm">
                            Latitud <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="destination-lat"
                            type="number"
                            step="any"
                            {...register("destination.lat", { valueAsNumber: true })}
                            placeholder="-13.5319"
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination-lng" className="text-sm">
                            Longitud <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="destination-lng"
                            type="number"
                            step="any"
                            {...register("destination.lng", { valueAsNumber: true })}
                            placeholder="-71.9675"
                            required
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Paradas Intermedias</CardTitle>
                          <CardDescription className="text-sm">Puntos de parada durante el recorrido</CardDescription>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendIntermediateStop({ name: "", lat: 0, lng: 0, stopTime: "" })}
                        className="gap-2 self-start sm:self-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {intermediateStopsFields.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed bg-muted/30 py-12 text-center">
                        <MapPin className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                        <p className="font-medium text-muted-foreground">No hay paradas intermedias</p>
                        <p className="mt-1 text-sm text-muted-foreground">Haz clic en Agregar para añadir paradas</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {intermediateStopsFields.map((field, index) => (
                          <div key={field.id} className="space-y-4 rounded-lg border-2 bg-muted/20 p-4">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">Parada {index + 1}</Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeIntermediateStop(index)}
                                className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2">
                                <Label className="text-sm">Nombre</Label>
                                <Input
                                  {...register(`intermediateStops.${index}.name`)}
                                  placeholder="Nombre"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Latitud</Label>
                                <Input
                                  type="number"
                                  step="any"
                                  {...register(`intermediateStops.${index}.lat`, { valueAsNumber: true })}
                                  placeholder="0.0"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">Longitud</Label>
                                <Input
                                  type="number"
                                  step="any"
                                  {...register(`intermediateStops.${index}.lng`, { valueAsNumber: true })}
                                  placeholder="0.0"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-sm">
                                  <Clock className="h-3.5 w-3.5" />
                                  Hora
                                </Label>
                                <Input
                                  type="time"
                                  {...register(`intermediateStops.${index}.stopTime`)}
                                  className="h-10"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Horarios */}
              <TabsContent value="schedule" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Días Disponibles</CardTitle>
                        <CardDescription className="text-sm">
                          Selecciona los días de la semana <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = availableDays.includes(day)
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                                isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                            </div>
                            <span className="text-sm font-medium">{day}</span>
                          </button>
                        )
                      })}
                    </div>
                    {availableDays.length > 0 && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-800">
                          {availableDays.length}{" "}
                          {availableDays.length === 1 ? "día seleccionado" : "días seleccionados"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Horarios y Duración</CardTitle>
                        <CardDescription className="text-sm">
                          Tiempos de viaje - GMT-5 (Perú) <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="departureTime" className="flex items-center gap-2 text-sm">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                            <Clock className="h-3.5 w-3.5 text-green-700" />
                          </div>
                          Hora de Salida <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="departureTime"
                          type="time"
                          {...register("departureTime")}
                          className="h-11 text-base"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arrivalTime" className="flex items-center gap-2 text-sm">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                            <Clock className="h-3.5 w-3.5 text-red-700" />
                          </div>
                          Hora de Llegada <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="arrivalTime"
                          type="time"
                          {...register("arrivalTime")}
                          className="h-11 text-base"
                          required
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-sm">
                          Duración - Texto <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="duration"
                          {...register("duration")}
                          placeholder="Ej: 6h 30min"
                          required
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">Formato legible para usuarios</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="durationInHours" className="text-sm">
                          Duración - Horas <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="durationInHours"
                          type="number"
                          step="0.5"
                          {...register("durationInHours", { valueAsNumber: true })}
                          placeholder="6.5"
                          required
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">Valor numérico en horas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Precios */}
              <TabsContent value="pricing" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Precios</CardTitle>
                        <CardDescription className="text-sm">
                          Configuración de precios en USD <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          Precio Actual (USD) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          {...register("price", { valueAsNumber: true })}
                          placeholder="50.00"
                          required
                          className="h-11 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oldPrice" className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          Precio Anterior (USD) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="oldPrice"
                          type="number"
                          step="0.01"
                          {...register("oldPrice", { valueAsNumber: true })}
                          placeholder="75.00"
                          required
                          className="h-11 text-base"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-sm">
                          Tipo de Servicio <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={watch("serviceType") || ""}
                          onValueChange={(value) => setValue("serviceType", value as "basic" | "privatePremium")}
                          required
                        >
                          <SelectTrigger id="serviceType" className="h-11">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Básico</SelectItem>
                            <SelectItem value="privatePremium">Premium Privado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="servicePrice" className="text-sm">
                          Precio del Servicio (USD) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="servicePrice"
                          type="number"
                          step="0.01"
                          {...register("servicePrice", { valueAsNumber: true })}
                          placeholder="100.00"
                          required
                          className="h-11 text-base"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                        <Settings className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Configuración del Tour</CardTitle>
                        <CardDescription className="text-sm">
                          Detalles adicionales <span className="text-destructive">*</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="rating" className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          Calificación (0-5) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          {...register("rating", { valueAsNumber: true })}
                          placeholder="4.5"
                          required
                          className="h-11 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleId" className="text-sm">
                          Vehículo <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={selectedVehicleId || ""}
                          onValueChange={(value) => setValue("vehicleId", value)}
                          disabled={loadingVehicles || submitting}
                          required
                        >
                          <SelectTrigger id="vehicleId" className="h-11">
                            <SelectValue placeholder={loadingVehicles ? "Cargando..." : "Seleccionar vehículo"} />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle._id} value={vehicle._id}>
                                {vehicle.name} - {vehicle.vehicle}
                              </SelectItem>
                            ))}
                            {vehicles.length === 0 && !loadingVehicles && (
                              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                No hay vehículos disponibles
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="routeCode" className="text-sm">
                          Código de Ruta <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="routeCode"
                          {...register("routeCode")}
                          placeholder="CAB-CUS-001"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm">
                          Slug - URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="slug"
                          {...register("slug")}
                          placeholder="transporte-cabanaconde-cusco"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border-2 bg-card p-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="isActive" className="cursor-pointer text-sm font-semibold">
                            Estado Activo
                          </Label>
                          <p className="text-xs text-muted-foreground">Visible para usuarios</p>
                        </div>
                        <Switch
                          id="isActive"
                          checked={isActive}
                          onCheckedChange={(checked) => setValue("isActive", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border-2 bg-card p-4">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="isFeatured"
                            className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
                          >
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            Tour Destacado
                          </Label>
                          <p className="text-xs text-muted-foreground">Mostrar en página principal</p>
                        </div>
                        <Switch
                          id="isFeatured"
                          checked={isFeatured}
                          onCheckedChange={(checked) => setValue("isFeatured", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: Itinerario */}
              <TabsContent value="itinerary" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-2 shadow-sm">
                  <CardHeader className="border-b bg-muted/30">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Itinerario del Tour</CardTitle>
                          <CardDescription className="text-sm">
                            Días del tour con descripciones <span className="text-destructive">*</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="default"
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
                        className="gap-2 self-start sm:self-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar Día
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {itineraryFields.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed bg-muted/30 py-16 text-center">
                        <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                        <p className="text-lg font-semibold text-muted-foreground">No hay días en el itinerario</p>
                        <p className="mt-2 text-sm text-muted-foreground">Haz clic en Agregar Día para comenzar</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {itineraryFields.map((field, index) => (
                          <div key={field.id} className="space-y-6 rounded-xl border-2 bg-muted/20 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                              <Badge variant="default" className="px-3 py-1 text-sm">
                                Día {index + 1}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItinerary(index)}
                                className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">
                                Número de Día <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                {...register(`itinerary.${index}.day`, { valueAsNumber: true })}
                                placeholder="1"
                                required
                                className="h-11 max-w-xs"
                              />
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <Label className="text-sm">
                                <ImageIcon className="h-4 w-4" />
                                Imagen del Día <span className="text-destructive">*</span>
                              </Label>
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
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-semibold">Título del Día</Label>
                                <Badge variant="destructive" className="h-5 text-xs">
                                  Requerido
                                </Badge>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                {LANGUAGES.map((lang) => (
                                  <div key={`itinerary-${index}-title-${lang.code}`} className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs">
                                      <span>{lang.flag}</span>
                                      {lang.label}
                                    </Label>
                                    <Input
                                      {...register(`itinerary.${index}.title.${lang.code}`)}
                                      placeholder={`Título en ${lang.label}`}
                                      required
                                      className="h-10"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-semibold">Descripción del Día</Label>
                                <Badge variant="destructive" className="h-5 text-xs">
                                  Requerido
                                </Badge>
                              </div>
                              <div className="space-y-3">
                                {LANGUAGES.map((lang) => (
                                  <div key={`itinerary-${index}-desc-${lang.code}`} className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs">
                                      <span>{lang.flag}</span>
                                      {lang.label}
                                    </Label>
                                    <Textarea
                                      {...register(`itinerary.${index}.description.${lang.code}`)}
                                      placeholder={`Descripción en ${lang.label}`}
                                      rows={3}
                                      className="resize-none"
                                      required
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="sticky bottom-0 z-10 mt-8 flex flex-col gap-4 rounded-xl border-2 bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Todos los campos con * son obligatorios</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="w-full sm:w-auto sm:min-w-[120px]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full gap-2 shadow-md sm:w-auto sm:min-w-[180px]"
                  size="lg"
                >
                  <Save className="h-5 w-5" />
                  {submitting ? "Creando..." : "Crear Transporte"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}
