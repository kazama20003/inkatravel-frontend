"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { api } from "@/lib/axiosInstance"
import type { Tour, TranslatedText } from "@/types/tour"
import type { CartItemType, CreateCartDto } from "@/types/cart"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Star,
  Clock,
  MapPin,
  Users,
  Calendar,
  Mountain,
  Utensils,
  Heart,
  Zap,
  ArrowLeft,
  Check,
  X,
  Backpack,
  Shield,
  Bus,
  Camera,
  Info,
  TrendingUp,
  Award,
  Globe,
  Phone,
  MessageCircle,
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XIcon,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function TourPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [people, setPeople] = useState(2)
  const [startDate, setStartDate] = useState("")
  const [addingToCart, setAddingToCart] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { language,  } = useLanguage()
  const router = useRouter()

  const backTexts = {
    es: "Volver",
    en: "Back",
    fr: "Retour",
    de: "Zurück",
    it: "Indietro",
  }
  const fromTexts = {
    es: "Desde",
    en: "From",
    fr: "Depuis",
    de: "Von",
    it: "Da",
  }

  const difficultyTexts = {
    es: {
      easy: "Fácil",
      moderate: "Moderado",
      challenging: "Desafiante",
      extreme: "Extremo",
    },
    en: {
      easy: "Easy",
      moderate: "Moderate",
      challenging: "Challenging",
      extreme: "Extreme",
    },
    fr: {
      easy: "Facile",
      moderate: "Modéré",
      challenging: "Difficile",
      extreme: "Extrême",
    },
    de: {
      easy: "Einfach",
      moderate: "Mäßig",
      challenging: "Herausfordernd",
      extreme: "Extrem",
    },
    it: {
      easy: "Facile",
      moderate: "Moderato",
      challenging: "Impegnativo",
      extreme: "Estremo",
    },
  }

  const categoryIcons = {
    cultural: MapPin,
    adventure: Mountain,
    nature: Heart,
    gastronomy: Utensils,
    spiritual: Zap,
  }

  const getTranslatedText = (translatedText: TranslatedText | string): string => {
    if (typeof translatedText === "string") {
      return translatedText
    }
    if (translatedText && typeof translatedText === "object") {
      return (
        translatedText[language] || translatedText.es || translatedText.en || Object.values(translatedText)[0] || ""
      )
    }
    return String(translatedText || "")
  }

  const getDurationText = (duration: TranslatedText | string): string => {
    if (typeof duration === "string") {
      return duration
    }
    if (duration && typeof duration === "object") {
      return duration[language] || duration.es || duration.en || Object.values(duration)[0] || "Sin fecha"
    }
    return "Sin fecha"
  }

  const getDifficultyText = (difficulty: string) => {
    const normalizedDifficulty = difficulty?.toLowerCase()
    if (normalizedDifficulty === "facil" || normalizedDifficulty === "easy") {
      return difficultyTexts[language].easy
    } else if (normalizedDifficulty === "moderado" || normalizedDifficulty === "moderate") {
      return difficultyTexts[language].moderate
    } else if (normalizedDifficulty === "dificil" || normalizedDifficulty === "challenging") {
      return difficultyTexts[language].challenging
    } else {
      return difficultyTexts[language].extreme
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const normalizedDifficulty = difficulty?.toLowerCase()
    if (normalizedDifficulty === "facil" || normalizedDifficulty === "easy") {
      return "bg-green-600 text-white"
    } else if (normalizedDifficulty === "moderado" || normalizedDifficulty === "moderate") {
      return "bg-yellow-600 text-white"
    } else if (normalizedDifficulty === "dificil" || normalizedDifficulty === "challenging") {
      return "bg-orange-600 text-white"
    } else {
      return "bg-red-600 text-white"
    }
  }

  const handleAddToCart = async () => {
    if (!tour) return

    if (!startDate) {
      toast.error(language === "es" ? "Por favor selecciona una fecha de inicio" : "Please select a start date")
      return
    }

    if (people < 1) {
      toast.error(language === "es" ? "Por favor selecciona al menos 1 persona" : "Please select at least 1 person")
      return
    }

    setAddingToCart(true)

    try {
      const cartItem = {
        productType: "Tour" as CartItemType,
        productId: tour._id,
        startDate: startDate,
        people: people,
        pricePerPerson: tour.price,
        total: tour.price * people,
        productTitle: getTranslatedText(tour.title),
        productImageUrl: tour.imageUrl,
        productSlug: tour.slug,
      }

      const cartData: CreateCartDto = {
        items: [cartItem],
        totalPrice: tour.price * people,
      }

      await api.post("/cart", cartData)

      toast.success(
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{language === "es" ? "Tour agregado al carrito" : "Tour added to cart"}</p>
          <p className="text-sm text-muted-foreground">
            {people}{" "}
            {people === 1 ? (language === "es" ? "persona" : "person") : language === "es" ? "personas" : "people"} - S/
            {tour.price * people}
          </p>
        </div>,
        {
          action: {
            label: language === "es" ? "Ir al checkout" : "Go to checkout",
            onClick: () => router.push("/checkout"),
          },
          duration: 5000,
        },
      )
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error(
        language === "es"
          ? "Error al agregar al carrito. Por favor intenta de nuevo."
          : "Error adding to cart. Please try again.",
      )
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `${language === "es" ? "Hola, estoy interesado en el tour:" : "Hi, I'm interested in the tour:"} ${getTranslatedText(tour?.title || "")}`,
    )
    const phoneNumber = "51999999999"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handlePhoneCall = () => {
    const phoneNumber = "+51999999999"
    window.location.href = `tel:${phoneNumber}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const galleryImages = tour
    ? [
        { url: tour.imageUrl, alt: getTranslatedText(tour.title), type: "main" },
        ...(tour.itinerary?.flatMap((day) => [
          ...(day.imageUrl ? [{ url: day.imageUrl, alt: getTranslatedText(day.title), type: "itinerary" }] : []),
          ...(day.route
            ?.filter((stop) => stop.imageUrl)
            .map((stop) => ({ url: stop.imageUrl!, alt: stop.location, type: "route" })) || []),
        ]) || []),
      ].filter((img) => img.url)
    : []

  useEffect(() => {
    async function fetchTour() {
      if (!slug || slug === "[slug]" || slug.includes("[")) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const response = await api.get<{ message: string; data: Tour }>(`/tours/slug/${slug}?lang=${language}`)
        setTour(response.data.data)
      } catch (err) {
        console.error("Error fetching tour:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [slug, language])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">{language === "es" ? "Cargando tour..." : "Loading tour..."}</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            {language === "es" ? "Tour no encontrado" : "Tour not found"}
          </h1>
          <p className="text-muted-foreground">
            {slug && slug !== "[slug]"
              ? language === "es"
                ? `El tour "${slug}" no existe o ha sido eliminado.`
                : `The tour "${slug}" does not exist or has been removed.`
              : language === "es"
                ? "Por favor selecciona un tour desde la página principal."
                : "Please select a tour from the main page."}
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all"
          >
            {language === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
      </div>
    )
  }

  const CategoryIcon = categoryIcons[tour.category?.toLowerCase() as keyof typeof categoryIcons] || Mountain
  const savings = tour.originalPrice && tour.originalPrice > tour.price ? tour.originalPrice - tour.price : 0
  const savingsPercent =
    tour.originalPrice && tour.originalPrice > tour.price
      ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
      : 0

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src={tour.imageUrl || "/placeholder.svg?height=800&width=1600&query=Peru tour scenic landscape"}
          alt={getTranslatedText(tour.title)}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-lg hover:bg-white transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">{backTexts[language]}</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`font-semibold text-sm px-3 py-1 ${getDifficultyColor(tour.difficulty)}`}>
                {getDifficultyText(tour.difficulty)}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                {tour.category}
              </Badge>
              {tour.featured && (
                <Badge className="bg-secondary text-secondary-foreground">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  {language === "es" ? "Destacado" : "Featured"}
                </Badge>
              )}
              {savings > 0 && (
                <Badge className="bg-green-600 text-white">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                  {language === "es" ? `Ahorra ${savingsPercent}%` : `Save ${savingsPercent}%`}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">{getTranslatedText(tour.title)}</h1>
            <p className="text-lg md:text-xl text-white/95 mb-4 max-w-3xl">{getTranslatedText(tour.subtitle)}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {tour.location}, {tour.region}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                <span>
                  {tour.rating} ({tour.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getDurationText(tour.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{tour.packageType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {galleryImages.length > 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  {language === "es" ? "Galería de fotos" : "Photo gallery"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryImages.slice(0, 8).map((img, idx) => (
                    <Dialog
                      key={idx}
                      open={galleryOpen && currentImageIndex === idx}
                      onOpenChange={(open) => {
                        setGalleryOpen(open)
                        if (open) setCurrentImageIndex(idx)
                      }}
                    >
                      <DialogTrigger asChild>
                        <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer group">
                          <Image
                            src={img.url || "/placeholder.svg"}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
                        <div className="relative w-full h-[80vh]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentImageIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="relative w-full h-full"
                            >
                              <Image
                                src={galleryImages[currentImageIndex].url || "/placeholder.svg"}
                                alt={galleryImages[currentImageIndex].alt}
                                fill
                                className="object-contain"
                              />
                            </motion.div>
                          </AnimatePresence>
                          <Button
                            onClick={prevImage}
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={nextImage}
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={() => setGalleryOpen(false)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                          >
                            <XIcon className="w-6 h-6" />
                          </Button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                            {currentImageIndex + 1} / {galleryImages.length}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
                {galleryImages.length > 8 && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    {language === "es"
                      ? `+${galleryImages.length - 8} fotos más`
                      : `+${galleryImages.length - 8} more photos`}
                  </p>
                )}
              </Card>
            )}

            {tour.highlights && tour.highlights.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6 text-primary" />
                  {language === "es" ? "Lo más destacado" : "Highlights"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{getTranslatedText(highlight)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tour.itinerary && tour.itinerary.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {language === "es" ? "Itinerario detallado" : "Detailed itinerary"}
                </h2>

                <Tabs defaultValue="day-0" className="w-full">
                  <TabsList className="w-full flex-wrap h-auto gap-2 mb-4">
                    {tour.itinerary.map((day, idx) => (
                      <TabsTrigger key={idx} value={`day-${idx}`} className="flex-1 min-w-[80px]">
                        {language === "es" ? `Día ${day.day}` : `Day ${day.day}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tour.itinerary.map((day, idx) => (
                    <TabsContent key={idx} value={`day-${idx}`} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{getTranslatedText(day.title)}</h3>
                          <p className="text-muted-foreground text-sm">{getTranslatedText(day.description)}</p>
                        </div>
                      </div>

                      {day.imageUrl && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={day.imageUrl || "/placeholder.svg"}
                            alt={getTranslatedText(day.title)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {day.activities && day.activities.length > 0 && (
                        <div className="bg-accent rounded-lg p-4">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-primary" />
                            {language === "es" ? "Actividades" : "Activities"}
                          </h4>
                          <ul className="space-y-2">
                            {day.activities.map((activity, actIdx) => (
                              <li key={actIdx} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{getTranslatedText(activity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {day.route && day.route.length > 0 && (
                        <div>
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {language === "es" ? "Ruta" : "Route"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {day.route.map((stop, stopIdx) => (
                              <Card key={stopIdx} className="overflow-hidden">
                                {stop.imageUrl && (
                                  <div className="relative w-full h-40">
                                    <Image
                                      src={stop.imageUrl || "/placeholder.svg"}
                                      alt={stop.location}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-3">
                                  <h5 className="font-bold text-sm mb-1">{stop.location}</h5>
                                  <p className="text-xs text-muted-foreground">{stop.description}</p>
                                  {stop.stopTime && (
                                    <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {stop.stopTime}
                                    </p>
                                  )}
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {(day.meals || day.accommodation) && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          {day.meals && day.meals.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-primary" />
                              <span>{day.meals.join(", ")}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center gap-2">
                              <Mountain className="w-4 h-4 text-primary" />
                              <span>{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.includes && tour.includes.length > 0 && (
                <Card className="p-6 border-green-200 dark:border-green-900">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    {language === "es" ? "Incluye" : "Includes"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{getTranslatedText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {tour.notIncludes && tour.notIncludes.length > 0 && (
                <Card className="p-6 border-red-200 dark:border-red-900">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                    <X className="w-5 h-5" />
                    {language === "es" ? "No incluye" : "Not included"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.notIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <X className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{getTranslatedText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {tour.toBring && tour.toBring.length > 0 && (
              <Card className="p-6 bg-accent/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Backpack className="w-6 h-6 text-primary" />
                  {language === "es" ? "Qué llevar" : "What to bring"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.toBring.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{getTranslatedText(item)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tour.conditions && tour.conditions.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  {language === "es" ? "Condiciones" : "Conditions"}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {tour.conditions.map((condition, idx) => (
                    <AccordionItem key={idx} value={`condition-${idx}`}>
                      <AccordionTrigger className="text-left text-sm">
                        <span className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          {language === "es" ? `Condición ${idx + 1}` : `Condition ${idx + 1}`}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {getTranslatedText(condition)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === "es" ? "Información del tour" : "Tour information"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-accent rounded-lg">
                  <Clock className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground mb-1">
                    {language === "es" ? "Duración" : "Duration"}
                  </span>
                  <span className="font-bold text-sm">{getDurationText(tour.duration)}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-accent rounded-lg">
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground mb-1">{language === "es" ? "Grupo" : "Group"}</span>
                  <span className="font-bold text-sm">{language === "es" ? "2-12 personas" : "2-12 people"}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-accent rounded-lg">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground mb-1">{language === "es" ? "Inicio" : "Start"}</span>
                  <span className="font-bold text-sm">
                    {tour.startTime || (language === "es" ? "Diario" : "Daily")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-accent rounded-lg">
                  <Mountain className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground mb-1">{language === "es" ? "Tipo" : "Type"}</span>
                  <span className="font-bold text-sm">{tour.packageType}</span>
                </div>
              </div>
            </Card>

            {tour.transportOptionIds && tour.transportOptionIds.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Bus className="w-6 h-6 text-primary" />
                  {language === "es" ? "Opciones de transporte" : "Transport options"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "es"
                    ? `Este tour incluye ${tour.transportOptionIds.length} opción(es) de transporte.`
                    : `This tour includes ${tour.transportOptionIds.length} transport option(s).`}
                </p>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-muted-foreground">{fromTexts[language]}</span>
                  <span className="text-4xl font-bold">S/{tour.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{language === "es" ? "por persona" : "per person"}</p>
                {tour.originalPrice && tour.originalPrice > tour.price && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground line-through">S/{tour.originalPrice}</p>
                    <Badge className="bg-green-600 text-white mt-1">
                      {language === "es" ? `Ahorra S/${savings}` : `Save S/${savings}`}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    {language === "es" ? "Fecha de inicio" : "Start date"}
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="startDate"
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="people" className="text-sm font-medium">
                    {language === "es" ? "Personas" : "People"}
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      max="12"
                      value={people}
                      onChange={(e) => setPeople(Number.parseInt(e.target.value) || 1)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-primary text-xl">S/{tour.price * people}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-primary hover:bg-primary/90 font-bold py-6 mb-3"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {language === "es" ? "Agregando..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {language === "es" ? "Agregar al carrito" : "Add to cart"}
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button onClick={handleWhatsApp} variant="outline" className="w-full bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm">WhatsApp</span>
                </Button>
                <Button onClick={handlePhoneCall} variant="outline" className="w-full bg-transparent">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm">{language === "es" ? "Llamar" : "Call"}</span>
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{language === "es" ? "Cancelación gratuita 24h antes" : "Free cancellation 24h before"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{language === "es" ? "Confirmación inmediata" : "Instant confirmation"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{language === "es" ? "Guía certificado" : "Certified guide"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{language === "es" ? "Seguro incluido" : "Insurance included"}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{language === "es" ? "Valoración" : "Rating"}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-bold">{tour.rating}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-bold">{tour.reviews}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
