"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Loader2, Save, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/axiosInstance"
import { toast } from "sonner"
import type { TransportOption } from "@/types/transport"
import { getTransportOptions } from "@/lib/transport-api"
import Image from "next/image"
import { TransportSelector } from "@/components/transport-selector"

interface TranslatedText {
  es?: string
  en?: string
  fr?: string
  de?: string
  it?: string
}

enum TourCategory {
  Aventura = "Aventura",
  Cultural = "Cultural",
  Relajacion = "Relajación",
  Naturaleza = "Naturaleza",
  Trekking = "Trekking",
  Panoramico = "Panoramico",
  TransporteTuristico = "Transporte Turistico",
}

enum PackageType {
  Basico = "Basico",
  Premium = "Premium",
}

enum Difficulty {
  Facil = "Facil",
  Moderado = "Moderado",
  Dificil = "Dificil",
}

interface RoutePoint {
  location: TranslatedText
  description?: TranslatedText
  imageId?: string
  imageUrl?: string
}

interface ItineraryDay {
  day: number
  title: TranslatedText
  description: TranslatedText
  activities: TranslatedText[]
  meals?: string[]
  accommodation?: string
  imageId?: string
  imageUrl?: string
  route: RoutePoint[]
}

interface Tour {
  _id?: string
  title: TranslatedText
  subtitle: TranslatedText
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: TranslatedText
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights: TranslatedText[]
  featured?: boolean
  transportOptionIds?: string[]
  itinerary: ItineraryDay[]
  includes?: TranslatedText[]
  notIncludes?: TranslatedText[]
  toBring?: TranslatedText[]
  conditions?: TranslatedText[]
  slug: string
  startTime: string
  createdAt?: string
  updatedAt?: string
}

type UpdateTourDto = Partial<Omit<Tour, "_id" | "createdAt" | "updatedAt">>

export default function EditTourPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([])
  const [loadingTransports, setLoadingTransports] = useState(false)
  const [selectedTransportIds, setSelectedTransportIds] = useState<string[]>([]) // State for selected transport IDs

  const selectedTransportIdsRef = useRef<string[]>([])

  const hasLoadedTour = useRef(false)
  const hasLoadedTransports = useRef(false)

  const [formData, setFormData] = useState<Partial<Tour>>({
    title: { es: "", en: "", fr: "", de: "", it: "" },
    subtitle: { es: "", en: "", fr: "", de: "", it: "" },
    duration: { es: "", en: "", fr: "", de: "", it: "" },
    imageUrl: "",
    imageId: "",
    price: 0,
    originalPrice: 0,
    rating: 0,
    reviews: 0,
    location: "",
    region: "",
    category: TourCategory.Aventura,
    difficulty: Difficulty.Facil,
    packageType: PackageType.Basico,
    startTime: "",
    featured: false,
    slug: "",
    highlights: [],
    itinerary: [],
    includes: [],
    notIncludes: [],
    toBring: [],
    conditions: [],
  })

  const fetchTour = useCallback(async () => {
    if (!id || hasLoadedTour.current) return

    try {
      setLoading(true)
      hasLoadedTour.current = true
      const response = await api.get(`/tours/all/${id}`)
      const tourData = response.data.data

      setTour(tourData)
      const initialTransportIds = (tourData.transportOptionIds || []).map((id: string | { _id: string }) =>
        typeof id === "string" ? id : id._id,
      )
      selectedTransportIdsRef.current = initialTransportIds
      setSelectedTransportIds(initialTransportIds)

      setFormData({
        title: tourData.title || { es: "", en: "", fr: "", de: "", it: "" },
        subtitle: tourData.subtitle || { es: "", en: "", fr: "", de: "", it: "" },
        duration: tourData.duration || { es: "", en: "", fr: "", de: "", it: "" },
        imageUrl: tourData.imageUrl || "",
        imageId: tourData.imageId || "",
        price: tourData.price || 0,
        originalPrice: tourData.originalPrice || 0,
        rating: tourData.rating || 0,
        reviews: tourData.reviews || 0,
        location: tourData.location || "",
        region: tourData.region || "",
        category:
          tourData.category && Object.values(TourCategory).includes(tourData.category)
            ? tourData.category
            : TourCategory.Aventura,
        difficulty:
          tourData.difficulty && Object.values(Difficulty).includes(tourData.difficulty)
            ? tourData.difficulty
            : Difficulty.Facil,
        packageType:
          tourData.packageType && Object.values(PackageType).includes(tourData.packageType)
            ? tourData.packageType
            : PackageType.Basico,
        startTime: tourData.startTime || "",
        featured: tourData.featured || false,
        slug: tourData.slug || "",
        highlights: tourData.highlights || [],
        transportOptionIds: tourData.transportOptionIds || [],
        itinerary: tourData.itinerary || [],
        includes: tourData.includes || [],
        notIncludes: tourData.notIncludes || [],
        toBring: tourData.toBring || [],
        conditions: tourData.conditions || [],
      })
    } catch (error: unknown) {
      console.error("Error fetching tour:", error)
      const errorMessage = error instanceof Error ? error.message : "No se pudo cargar la información del tour"
      toast.error(errorMessage)
      hasLoadedTour.current = false
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchTransportOptions = useCallback(async () => {
    if (hasLoadedTransports.current) return

    try {
      setLoadingTransports(true)
      hasLoadedTransports.current = true
      const options = await getTransportOptions()
      setTransportOptions(options)
    } catch (error: unknown) {
      console.error("Error fetching transport options:", error)
      const errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las opciones de transporte"
      toast.error(errorMessage)
      hasLoadedTransports.current = false
    } finally {
      setLoadingTransports(false)
    }
  }, [])

  const handleTransportSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedTransportIds(selectedIds) // Update state
    selectedTransportIdsRef.current = selectedIds // Update ref as well
  }, [])

  useEffect(() => {
    fetchTour()
    fetchTransportOptions()
  }, [fetchTour, fetchTransportOptions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tour?._id) return

    try {
      setSaving(true)

      const cleanedItinerary = formData.itinerary?.map((day) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: dayId, ...dayWithoutId } = day as ItineraryDay & { _id?: string }

        // Clean route points - remove _id from each point
        const cleanedRoute = dayWithoutId.route?.map((point) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id: pointId, ...pointWithoutId } = point as RoutePoint & { _id?: string }
          return pointWithoutId
        })

        return {
          ...dayWithoutId,
          route: cleanedRoute || [],
        }
      })

      const cleanedTransportIds = selectedTransportIdsRef.current.map((id: string | { _id: string }) =>
        typeof id === "string" ? id : id._id,
      )

      const updateData: UpdateTourDto = {
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl,
        imageId: formData.imageId,
        price: formData.price,
        originalPrice: formData.originalPrice,
        duration: formData.duration,
        location: formData.location,
        region: formData.region,
        category: formData.category,
        difficulty: formData.difficulty,
        packageType: formData.packageType,
        startTime: formData.startTime,
        rating: formData.rating,
        reviews: formData.reviews,
        featured: formData.featured,
        slug: formData.slug,
        highlights: formData.highlights,
        itinerary: cleanedItinerary,
        includes: formData.includes,
        notIncludes: formData.notIncludes,
        toBring: formData.toBring,
        conditions: formData.conditions,
        transportOptionIds: cleanedTransportIds,
      }

      console.log("[v0] Update data being sent:", JSON.stringify(updateData, null, 2))

      await api.patch(`/tours/${tour._id}`, updateData)

      toast.success("Tour actualizado correctamente")
      router.push("/dashboard/tours")
    } catch (error: unknown) {
      console.error("Error updating tour:", error)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } }
        console.log("[v0] Error response data:", axiosError.response?.data)
      }
      const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el tour"
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), { es: "", en: "", fr: "", de: "", it: "" }],
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => {
      const newHighlights = [...(prev.highlights || [])]
      newHighlights.splice(index, 1)
      return { ...prev, highlights: newHighlights }
    })
  }

  const updateHighlight = (index: number, lang: keyof TranslatedText, value: string) => {
    setFormData((prev) => {
      const newHighlights = [...(prev.highlights || [])]
      newHighlights[index] = { ...newHighlights[index], [lang]: value }
      return { ...prev, highlights: newHighlights }
    })
  }

  const addArrayItem = (field: "includes" | "notIncludes" | "toBring" | "conditions") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), { es: "", en: "", fr: "", de: "", it: "" }],
    }))
  }

  const removeArrayItem = (field: "includes" | "notIncludes" | "toBring" | "conditions", index: number) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }

  const updateArrayItem = (
    field: "includes" | "notIncludes" | "toBring" | "conditions",
    index: number,
    lang: keyof TranslatedText,
    value: string,
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])]
      newArray[index] = { ...newArray[index], [lang]: value }
      return { ...prev, [field]: newArray }
    })
  }

  const addItineraryDay = () => {
    setFormData((prev) => {
      const newDay: ItineraryDay = {
        day: (prev.itinerary?.length || 0) + 1,
        title: { es: "", en: "", fr: "", de: "", it: "" },
        description: { es: "", en: "", fr: "", de: "", it: "" },
        activities: [],
        meals: [],
        accommodation: "",
        route: [],
      }
      return {
        ...prev,
        itinerary: [...(prev.itinerary || []), newDay],
      }
    })
  }

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary.splice(index, 1)
      // Renumber days
      newItinerary.forEach((day, idx) => {
        day.day = idx + 1
      })
      return { ...prev, itinerary: newItinerary }
    })
  }

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: unknown) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[index] = { ...newItinerary[index], [field]: value }
      return { ...prev, itinerary: newItinerary }
    })
  }

  const updateItineraryDayTranslation = (
    index: number,
    field: "title" | "description",
    lang: keyof TranslatedText,
    value: string,
  ) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[index] = {
        ...newItinerary[index],
        [field]: { ...newItinerary[index][field], [lang]: value },
      }
      return { ...prev, itinerary: newItinerary }
    })
  }

  const addActivity = (dayIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].activities = [
        ...(newItinerary[dayIndex].activities || []),
        { es: "", en: "", fr: "", de: "", it: "" },
      ]
      return { ...prev, itinerary: newItinerary }
    })
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].activities.splice(activityIndex, 1)
      return { ...prev, itinerary: newItinerary }
    })
  }

  const updateActivity = (dayIndex: number, activityIndex: number, lang: keyof TranslatedText, value: string) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].activities[activityIndex] = {
        ...newItinerary[dayIndex].activities[activityIndex],
        [lang]: value,
      }
      return { ...prev, itinerary: newItinerary }
    })
  }

  const addMeal = (dayIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].meals = [...(newItinerary[dayIndex].meals || []), ""]
      return { ...prev, itinerary: newItinerary }
    })
  }

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].meals?.splice(mealIndex, 1)
      return { ...prev, itinerary: newItinerary }
    })
  }

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      if (!newItinerary[dayIndex].meals) newItinerary[dayIndex].meals = []
      newItinerary[dayIndex].meals![mealIndex] = value
      return { ...prev, itinerary: newItinerary }
    })
  }

  const addRoutePoint = (dayIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].route = [
        ...(newItinerary[dayIndex].route || []),
        {
          location: { es: "", en: "", fr: "", de: "", it: "" },
          description: { es: "", en: "", fr: "", de: "", it: "" },
        },
      ]
      return { ...prev, itinerary: newItinerary }
    })
  }

  const removeRoutePoint = (dayIndex: number, routeIndex: number) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].route.splice(routeIndex, 1)
      return { ...prev, itinerary: newItinerary }
    })
  }

  const updateRoutePoint = (
    dayIndex: number,
    routeIndex: number,
    field: "location" | "description",
    lang: keyof TranslatedText,
    value: string,
  ) => {
    setFormData((prev) => {
      const newItinerary = [...(prev.itinerary || [])]
      newItinerary[dayIndex].route[routeIndex] = {
        ...newItinerary[dayIndex].route[routeIndex],
        [field]: { ...newItinerary[dayIndex].route[routeIndex][field], [lang]: value },
      }
      return { ...prev, itinerary: newItinerary }
    })
  }

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
                  <BreadcrumbLink href="/dashboard/tours">Paquetes Turísticos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar Paquete</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SidebarInset>
    )
  }

  if (!tour) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
                  <BreadcrumbLink href="/dashboard/tours">Paquetes Turísticos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Editar Paquete</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Tour no encontrado</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
                <BreadcrumbLink href="/dashboard/tours">Paquetes Turísticos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Paquete</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-8 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            Editar Tour
          </h1>
          <p className="text-muted-foreground text-lg">
            Editando: <span className="font-medium text-foreground">{tour.title?.es || "Sin título"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-2">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                  <CardTitle className="text-2xl">Información Básica</CardTitle>
                  <CardDescription className="text-base mt-1">Datos principales del tour</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Slug and Featured */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="slug" className="text-base font-medium">
                    Slug (URL) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center space-x-3 h-11 px-4 rounded-lg border bg-muted/30">
                    <Checkbox
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked as boolean }))}
                    />
                    <Label htmlFor="featured" className="cursor-pointer font-medium text-base">
                      Tour Destacado
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Image URL and ID */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">📷</span> Imagen Principal
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="imageUrl" className="text-base font-medium">
                      URL de Imagen <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      required
                      className="h-11"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="imageId" className="text-base font-medium">
                      ID de Imagen <span className="text-muted-foreground text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="imageId"
                      value={formData.imageId || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageId: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                </div>
                {formData.imageUrl && (
                  <div className="mt-4 border-2 rounded-lg overflow-hidden bg-muted/20 relative h-48">
                    <Image src={formData.imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Title Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">🌐</span> Título (Multiidioma)
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      { lang: "es", label: "Español", flag: "🇪🇸" },
                      { lang: "en", label: "Inglés", flag: "🇬🇧" },
                      { lang: "fr", label: "Francés", flag: "🇫🇷" },
                      { lang: "de", label: "Alemán", flag: "🇩🇪" },
                      { lang: "it", label: "Italiano", flag: "🇮🇹" },
                    ] as const
                  ).map(({ lang, label, flag }) => (
                    <div key={lang} className="space-y-2">
                      <Label htmlFor={`title-${lang}`} className="flex items-center gap-2 text-sm font-medium">
                        <span>{flag}</span>
                        {label}
                      </Label>
                      <Input
                        id={`title-${lang}`}
                        value={formData.title?.[lang] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: { ...prev.title, [lang]: e.target.value },
                          }))
                        }
                        className="h-10"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Subtitle Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">📝</span> Subtítulo (Multiidioma)
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      { lang: "es", label: "Español", flag: "🇪🇸" },
                      { lang: "en", label: "Inglés", flag: "🇬🇧" },
                      { lang: "fr", label: "Francés", flag: "🇫🇷" },
                      { lang: "de", label: "Alemán", flag: "🇩🇪" },
                      { lang: "it", label: "Italiano", flag: "🇮🇹" },
                    ] as const
                  ).map(({ lang, label, flag }) => (
                    <div key={lang} className="space-y-2">
                      <Label htmlFor={`subtitle-${lang}`} className="flex items-center gap-2 text-sm font-medium">
                        <span>{flag}</span>
                        {label}
                      </Label>
                      <Textarea
                        id={`subtitle-${lang}`}
                        value={formData.subtitle?.[lang] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subtitle: { ...prev.subtitle, [lang]: e.target.value },
                          }))
                        }
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Duration Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">⏱️</span> Duración (Multiidioma)
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      { lang: "es", label: "Español", flag: "🇪🇸", placeholder: "Ej: 3 días / 2 noches" },
                      { lang: "en", label: "Inglés", flag: "🇬🇧", placeholder: "Ex: 3 days / 2 nights" },
                      { lang: "fr", label: "Francés", flag: "🇫🇷", placeholder: "Ex: 3 jours / 2 nuits" },
                      { lang: "de", label: "Alemán", flag: "🇩🇪", placeholder: "Bsp: 3 Tage / 2 Nächte" },
                      { lang: "it", label: "Italiano", flag: "🇮🇹", placeholder: "Es: 3 giorni / 2 notti" },
                    ] as const
                  ).map(({ lang, label, flag, placeholder }) => (
                    <div key={lang} className="space-y-2">
                      <Label htmlFor={`duration-${lang}`} className="flex items-center gap-2 text-sm font-medium">
                        <span>{flag}</span>
                        {label}
                      </Label>
                      <Input
                        id={`duration-${lang}`}
                        value={formData.duration?.[lang] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            duration: { ...prev.duration, [lang]: e.target.value },
                          }))
                        }
                        placeholder={placeholder}
                        className="h-10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                  <CardTitle className="text-2xl">Precios y Detalles</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Información de precios, ubicación y categorización
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Precio y Duración */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">💰</span> Precios y Horario
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-base font-medium">
                      Precio <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="originalPrice" className="text-base font-medium">
                      Precio Original <span className="text-muted-foreground text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          originalPrice: Number(e.target.value),
                        }))
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="startTime" className="text-base font-medium">
                      Hora de Inicio <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="startTime"
                      type="text"
                      value={formData.startTime || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                      placeholder="08:00 AM"
                      required
                      className="h-11"
                    />
                  </div>
                  {formData.originalPrice && formData.price && formData.originalPrice > formData.price && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Descuento</Label>
                      <div className="h-11 flex items-center justify-center bg-green-500/10 border-2 border-green-500/20 rounded-lg">
                        <span className="text-lg font-bold text-green-600">
                          {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Ubicación y Región */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">📍</span> Ubicación
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-base font-medium">
                      Ubicación <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="region" className="text-base font-medium">
                      Región <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="region"
                      value={formData.region || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categoría, Dificultad y Tipo de Paquete */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">🏷️</span> Categorización
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-base font-medium">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category || TourCategory.Aventura}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, category: value as TourCategory }))
                      }}
                    >
                      <SelectTrigger id="category" className="h-11">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TourCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="difficulty" className="text-base font-medium">
                      Dificultad <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.difficulty || Difficulty.Facil}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, difficulty: value as Difficulty }))
                      }}
                    >
                      <SelectTrigger id="difficulty" className="h-11">
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Difficulty.Facil}>Fácil</SelectItem>
                        <SelectItem value={Difficulty.Moderado}>Moderado</SelectItem>
                        <SelectItem value={Difficulty.Dificil}>Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="packageType" className="text-base font-medium">
                      Tipo de Paquete <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.packageType || PackageType.Basico}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, packageType: value as PackageType }))
                      }}
                    >
                      <SelectTrigger id="packageType" className="h-11">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PackageType.Basico}>Básico</SelectItem>
                        <SelectItem value={PackageType.Premium}>Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rating y Reviews */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">⭐</span> Valoraciones
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="rating" className="text-base font-medium">
                      Rating <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="reviews" className="text-base font-medium">
                      Número de Reviews <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={formData.reviews || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reviews: Number(e.target.value) }))}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                  <CardTitle className="text-2xl">Highlights</CardTitle>
                  <CardDescription className="text-base mt-1">Puntos destacados del tour (multiidioma)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.highlights?.map((highlight, index) => (
                <div key={index} className="border-2 rounded-xl p-6 space-y-4 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-lg">Highlight {index + 1}</h4>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        { lang: "es", label: "Español", flag: "🇪🇸" },
                        { lang: "en", label: "Inglés", flag: "🇬🇧" },
                        { lang: "fr", label: "Francés", flag: "🇫🇷" },
                        { lang: "de", label: "Alemán", flag: "🇩🇪" },
                        { lang: "it", label: "Italiano", flag: "🇮🇹" },
                      ] as const
                    ).map(({ lang, label, flag }) => (
                      <div key={lang} className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <span>{flag}</span>
                          {label}
                        </Label>
                        <Input
                          value={highlight[lang] || ""}
                          onChange={(e) => updateHighlight(index, lang, e.target.value)}
                          className="h-10 bg-background"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addHighlight}
                className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
              >
                <Plus className="mr-2 h-5 w-5" />
                Agregar Highlight
              </Button>
            </CardContent>
          </Card>

          <TransportSelector
            transportOptions={transportOptions}
            initialSelectedIds={selectedTransportIds}
            loading={loadingTransports}
            onSelectionChange={handleTransportSelectionChange}
          />

          {(
            [
              { field: "includes", title: "Incluye", icon: "✅", description: "Qué incluye el tour" },
              { field: "notIncludes", title: "No Incluye", icon: "❌", description: "Qué no incluye el tour" },
              { field: "toBring", title: "Qué Traer", icon: "🎒", description: "Qué debe traer el turista" },
              {
                field: "conditions",
                title: "Condiciones",
                icon: "📋",
                description: "Términos y condiciones del tour",
              },
            ] as const
          ).map(({ field, title, icon, description }) => (
            <Card key={field} className="border-2">
              <CardHeader className="space-y-3 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <span>{icon}</span> {title}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData[field]?.map((item, index) => (
                  <div key={index} className="border-2 rounded-xl p-6 space-y-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-lg">Item {index + 1}</h4>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem(field, index)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(
                        [
                          { lang: "es", label: "Español", flag: "🇪🇸" },
                          { lang: "en", label: "Inglés", flag: "🇬🇧" },
                          { lang: "fr", label: "Francés", flag: "🇫🇷" },
                          { lang: "de", label: "Alemán", flag: "🇩🇪" },
                          { lang: "it", label: "Italiano", flag: "🇮🇹" },
                        ] as const
                      ).map(({ lang, label, flag }) => (
                        <div key={lang} className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <span>{flag}</span>
                            {label}
                          </Label>
                          {field === "conditions" ? (
                            <Textarea
                              value={item[lang] || ""}
                              onChange={(e) => updateArrayItem(field, index, lang, e.target.value)}
                              className="min-h-[80px] resize-none bg-background"
                            />
                          ) : (
                            <Input
                              value={item[lang] || ""}
                              onChange={(e) => updateArrayItem(field, index, lang, e.target.value)}
                              className="h-10 bg-background"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem(field)}
                  className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar {field === "conditions" ? "Condición" : "Item"}
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="border-2">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span>🗓️</span> Itinerario
                  </CardTitle>
                  <CardDescription className="text-base mt-1">Días y rutas del tour</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.itinerary?.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-2 rounded-xl p-6 space-y-6 bg-gradient-to-br from-muted/30 to-muted/10"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <span className="text-primary font-bold text-2xl">Día {day.day}</span>
                      </div>
                      <h4 className="font-semibold text-xl">Día {day.day}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeItineraryDay(dayIndex)}
                      >
                        <Trash2 className="h-4 w-4" /> Eliminar Día
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">🗺️</span> Título del Día (Multiidioma)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(
                        [
                          { lang: "es", label: "Español", flag: "🇪🇸" },
                          { lang: "en", label: "Inglés", flag: "🇬🇧" },
                          { lang: "fr", label: "Francés", flag: "🇫🇷" },
                          { lang: "de", label: "Alemán", flag: "🇩🇪" },
                          { lang: "it", label: "Italiano", flag: "🇮🇹" },
                        ] as const
                      ).map(({ lang, label, flag }) => (
                        <div key={lang} className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <span>{flag}</span>
                            {label}
                          </Label>
                          <Input
                            value={day.title?.[lang] || ""}
                            onChange={(e) => updateItineraryDayTranslation(dayIndex, "title", lang, e.target.value)}
                            className="h-10 bg-background"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">📝</span> Descripción del Día (Multiidioma)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(
                        [
                          { lang: "es", label: "Español", flag: "🇪🇸" },
                          { lang: "en", label: "Inglés", flag: "🇬🇧" },
                          { lang: "fr", label: "Francés", flag: "🇫🇷" },
                          { lang: "de", label: "Alemán", flag: "🇩🇪" },
                          { lang: "it", label: "Italiano", flag: "🇮🇹" },
                        ] as const
                      ).map(({ lang, label, flag }) => (
                        <div key={lang} className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <span>{flag}</span>
                            {label}
                          </Label>
                          <Textarea
                            value={day.description?.[lang] || ""}
                            onChange={(e) =>
                              updateItineraryDayTranslation(dayIndex, "description", lang, e.target.value)
                            }
                            className="min-h-[100px] resize-none bg-background"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">🏃</span> Actividades (Multiidioma)
                    </h3>
                    {day.activities?.map((activity, activityIndex) => (
                      <div key={activityIndex} className="border-2 rounded-xl p-6 space-y-4 bg-muted/10">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium text-base">Actividad {activityIndex + 1}</h5>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {(
                            [
                              { lang: "es", label: "Español", flag: "🇪🇸" },
                              { lang: "en", label: "Inglés", flag: "🇬🇧" },
                              { lang: "fr", label: "Francés", flag: "🇫🇷" },
                              { lang: "de", label: "Alemán", flag: "🇩🇪" },
                              { lang: "it", label: "Italiano", flag: "🇮🇹" },
                            ] as const
                          ).map(({ lang, label, flag }) => (
                            <div key={lang} className="space-y-2">
                              <Label className="flex items-center gap-2 text-sm font-medium">
                                <span>{flag}</span>
                                {label}
                              </Label>
                              <Input
                                value={activity[lang] || ""}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, lang, e.target.value)}
                                className="h-10 bg-background"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addActivity(dayIndex)}
                      className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Agregar Actividad
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">🍽️</span> Comidas
                    </h3>
                    {day.meals?.map((meal, mealIndex) => (
                      <div key={mealIndex} className="flex items-center gap-3">
                        <Input
                          value={meal}
                          onChange={(e) => updateMeal(dayIndex, mealIndex, e.target.value)}
                          className="h-10 bg-background flex-grow"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(dayIndex, mealIndex)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMeal(dayIndex)}
                      className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Agregar Comida
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">🛌</span> Alojamiento
                    </h3>
                    <Textarea
                      value={day.accommodation || ""}
                      onChange={(e) => updateItineraryDay(dayIndex, "accommodation", e.target.value)}
                      className="min-h-[80px] resize-none bg-background"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">📍</span> Puntos de Ruta (Multiidioma)
                    </h3>
                    {day.route?.map((routePoint, routeIndex) => (
                      <div key={routeIndex} className="border-2 rounded-xl p-6 space-y-4 bg-muted/10">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium text-base">Punto de Ruta {routeIndex + 1}</h5>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoutePoint(dayIndex, routeIndex)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Ubicación (Multiidioma)</Label>
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                              {(
                                [
                                  { lang: "es", label: "Español", flag: "🇪🇸" },
                                  { lang: "en", label: "Inglés", flag: "🇬🇧" },
                                  { lang: "fr", label: "Francés", flag: "🇫🇷" },
                                  { lang: "de", label: "Alemán", flag: "🇩🇪" },
                                  { lang: "it", label: "Italiano", flag: "🇮🇹" },
                                ] as const
                              ).map(({ lang, label, flag }) => (
                                <div key={lang} className="space-y-1">
                                  <Label className="flex items-center gap-1 text-xs font-normal">
                                    <span>{flag}</span>
                                    {label}
                                  </Label>
                                  <Input
                                    value={routePoint.location?.[lang] || ""}
                                    onChange={(e) =>
                                      updateRoutePoint(dayIndex, routeIndex, "location", lang, e.target.value)
                                    }
                                    className="h-9 bg-background"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Descripción (Multiidioma)</Label>
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                              {(
                                [
                                  { lang: "es", label: "Español", flag: "🇪🇸" },
                                  { lang: "en", label: "Inglés", flag: "🇬🇧" },
                                  { lang: "fr", label: "Francés", flag: "🇫🇷" },
                                  { lang: "de", label: "Alemán", flag: "🇩🇪" },
                                  { lang: "it", label: "Italiano", flag: "🇮🇹" },
                                ] as const
                              ).map(({ lang, label, flag }) => (
                                <div key={lang} className="space-y-1">
                                  <Label className="flex items-center gap-1 text-xs font-normal">
                                    <span>{flag}</span>
                                    {label}
                                  </Label>
                                  <Textarea
                                    value={routePoint.description?.[lang] || ""}
                                    onChange={(e) =>
                                      updateRoutePoint(dayIndex, routeIndex, "description", lang, e.target.value)
                                    }
                                    className="min-h-[70px] resize-none bg-background"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addRoutePoint(dayIndex)}
                      className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Agregar Punto de Ruta
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItineraryDay}
                className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-base bg-transparent"
              >
                <Plus className="mr-2 h-5 w-5" />
                Agregar Día al Itinerario
              </Button>
            </CardContent>
          </Card>

          <div className="sticky bottom-6 z-10">
            <div className="flex gap-4 justify-end bg-background/95 backdrop-blur-sm p-6 border-2 rounded-xl shadow-2xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/tours")}
                disabled={saving}
                className="h-12 px-8 text-base"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="h-12 px-8 text-base">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </SidebarInset>
  )
}
