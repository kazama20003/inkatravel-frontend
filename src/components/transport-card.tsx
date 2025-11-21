"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import type { TourTransport } from "@/types/tour-transport"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Users, Calendar, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import { CartItemType } from "@/types/cart"
import { useState } from "react"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { savePendingCart, getPendingCart } from "@/lib/pending-cart"

interface TransportCardProps {
  tour: TourTransport
  index: number
}

export function TransportCard({ tour, index }: TransportCardProps) {
  const { language } = useLanguage()
  const router = useRouter()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  type LanguageKey = "es" | "en" | "fr" | "de" | "it"

  const featuredTexts: Record<LanguageKey, string> = {
    es: "DESTACADO",
    en: "FEATURED",
    fr: "VEDETTE",
    de: "EMPFOHLEN",
    it: "IN EVIDENZA",
  }

  const detailsTexts: Record<LanguageKey, string> = {
    es: "VER DETALLES",
    en: "VIEW DETAILS",
    fr: "VOIR DÉTAILS",
    de: "DETAILS ANSEHEN",
    it: "VEDI DETTAGLI",
  }

  const reserveTexts: Record<LanguageKey, string> = {
    es: "RESERVAR",
    en: "BOOK NOW",
    fr: "RÉSERVER",
    de: "BUCHEN",
    it: "PRENOTA",
  }

  const fromTexts: Record<LanguageKey, string> = {
    es: "Desde",
    en: "From",
    fr: "Depuis",
    de: "Von",
    it: "Da",
  }

  const availableTexts: Record<LanguageKey, string> = {
    es: "Disponible",
    en: "Available",
    fr: "Disponible",
    de: "Verfügbar",
    it: "Disponibile",
  }

  const spinningTexts: Record<LanguageKey, string> = {
    es: "• PERÚ TOURS • AVENTURA • CULTURA • NATURALEZA • HISTORIA • GASTRONOMÍA ",
    en: "• PERU TOURS • ADVENTURE • CULTURE • NATURE • HISTORY • GASTRONOMY ",
    fr: "• TOURS PÉROU • AVENTURE • CULTURE • NATURE • HISTOIRE • GASTRONOMIE ",
    de: "• PERU TOUREN • ABENTEUER • KULTUR • NATUR • GESCHICHTE • GASTRONOMIE ",
    it: "• TOUR PERÙ • AVVENTURA • CULTURA • NATURA • STORIA • GASTRONOMIA ",
  }

  const addedToCartTexts: Record<LanguageKey, string> = {
    es: "Agregado al carrito",
    en: "Added to cart",
    fr: "Ajouté au panier",
    de: "Zum Warenkorb hinzugefügt",
    it: "Aggiunto al carrello",
  }

  const loginRequiredTexts: Record<LanguageKey, string> = {
    es: "Iniciando sesión para completar tu reserva...",
    en: "Logging in to complete your booking...",
    fr: "Connexion pour terminer votre réservation...",
    de: "Anmelden, um Ihre Buchung abzuschließen...",
    it: "Accesso per completare la prenotazione...",
  }

  const serviceTypeTexts: Record<LanguageKey, Record<string, string>> = {
    es: {
      basic: "Servicio Básico",
      privatePremium: "Servicio Premium Privado",
    },
    en: {
      basic: "Basic Service",
      privatePremium: "Private Premium Service",
    },
    fr: {
      basic: "Service de Base",
      privatePremium: "Service Premium Privé",
    },
    de: {
      basic: "Basis-Service",
      privatePremium: "Privater Premium-Service",
    },
    it: {
      basic: "Servizio Base",
      privatePremium: "Servizio Premium Privato",
    },
  }

  const savingsTexts: Record<LanguageKey, string> = {
    es: "Ahorra",
    en: "Save",
    fr: "Économisez",
    de: "Sparen Sie",
    it: "Risparmia",
  }

  const perPersonTexts: Record<LanguageKey, string> = {
    es: "por persona",
    en: "per person",
    fr: "par personne",
    de: "pro Person",
    it: "a persona",
  }

  const dollarPriceTexts: Record<LanguageKey, string> = {
    es: "USD",
    en: "USD",
    fr: "USD",
    de: "USD",
    it: "USD",
  }

  const dayTranslations: Record<LanguageKey, Record<string, string>> = {
    es: {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
      daily: "Diario",
    },
    en: {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
      daily: "Daily",
    },
    fr: {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim",
      daily: "Quotidien",
    },
    de: {
      monday: "Mo",
      tuesday: "Di",
      wednesday: "Mi",
      thursday: "Do",
      friday: "Fr",
      saturday: "Sa",
      sunday: "So",
      daily: "Täglich",
    },
    it: {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Gio",
      friday: "Ven",
      saturday: "Sab",
      sunday: "Dom",
      daily: "Giornaliero",
    },
  }

  const getTitle = () => {
    if (typeof tour.title === "string") return tour.title
    if (tour.title && typeof tour.title === "object") {
      const titleObj = tour.title as Record<string, string>
      return titleObj[language] || titleObj.es || titleObj.en || "Tour Title"
    }
    return "Tour Title"
  }

  const getDescription = () => {
    if (typeof tour.description === "string") return tour.description
    if (tour.description && typeof tour.description === "object") {
      const descObj = tour.description as Record<string, string>
      return descObj[language] || descObj.es || descObj.en || "Tour Description"
    }
    return "Tour Description"
  }

  const getOriginName = () => {
    if (typeof tour.origin === "string") return tour.origin
    if (tour.origin && typeof tour.origin === "object") {
      if ("name" in tour.origin) return tour.origin.name
      return "Origin"
    }
    return "Origin"
  }

  const getDestinationName = () => {
    if (typeof tour.destination === "string") return tour.destination
    if (tour.destination && typeof tour.destination === "object") {
      if ("name" in tour.destination) return tour.destination.name
      return "Destination"
    }
    return "Destination"
  }

  const getAvailableDays = () => {
    const currentLanguage = language as LanguageKey
    const translations = dayTranslations[currentLanguage]

    if (!tour.availableDays || tour.availableDays.length === 0) {
      return translations.daily
    }

    if (tour.availableDays.length === 7) {
      return translations.daily
    }

    const translatedDays = tour.availableDays
      .map((day) => {
        const dayLower = day.toLowerCase()
        return translations[dayLower] || day
      })
      .join(", ")

    return translatedDays
  }

  const getServiceTypeText = () => {
    const currentLang = language as LanguageKey
    const serviceType = tour.serviceType || "basic"
    return serviceTypeTexts[currentLang][serviceType] || serviceTypeTexts.es[serviceType]
  }

  const getFinalPrice = () => {
    // For premium service, add service price to base price
    if (tour.serviceType === "privatePremium" && tour.servicePrice) {
      return tour.price + tour.servicePrice
    }
    // For basic service, just return the base price
    return tour.price
  }

  const getDollarPrice = () => {
    const finalPrice = getFinalPrice()
    return finalPrice.toFixed(2)
  }

  const getOldDollarPrice = () => {
    if (tour.oldPrice) {
      return tour.oldPrice.toFixed(2)
    }
    return null
  }

  const getDiscountPercentage = () => {
    const finalPrice = getFinalPrice()
    if (tour.oldPrice && tour.oldPrice > finalPrice) {
      const discount = ((tour.oldPrice - finalPrice) / tour.oldPrice) * 100
      return Math.round(discount)
    }
    return 0
  }

  const getSavingsAmount = () => {
    const finalPrice = getFinalPrice()
    if (tour.oldPrice && tour.oldPrice > finalPrice) {
      return tour.oldPrice - finalPrice
    }
    return 0
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (tour.slug) {
      router.push(`/transport/${tour.slug}`)
    }
  }

  const handleReserveClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setIsAddingToCart(true)

    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const startDate = tomorrow.toISOString()

      const people = 1
      const pricePerPerson = getFinalPrice()
      const total = pricePerPerson * people

      const cartItem = {
        productType: CartItemType.Transport,
        productId: tour._id,
        startDate,
        people,
        pricePerPerson,
        total,
        productTitle: getTitle(),
        productImageUrl: tour.imageUrl,
        productSlug: tour.slug,
      }

      const token = Cookies.get("token")

      if (!token) {
        console.log("[v0] User not logged in, saving to pending cart")
        const pendingItems = getPendingCart()
        savePendingCart([...pendingItems, cartItem])

        toast.info(loginRequiredTexts[language as LanguageKey])

        router.push("/login?redirect=/checkout")
        return
      }

      const cartData = {
        items: [cartItem],
        totalPrice: total,
      }

      console.log("[v0] Adding to cart:", cartData)

      await api.post("/cart", cartData)

      toast.success(addedToCartTexts[language as LanguageKey], {
        description: getTitle(),
      })

      router.push("/checkout")
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)

      toast.error("Error al reservar. Por favor intenta de nuevo.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const currentLanguage = language as LanguageKey
  const finalPrice = getFinalPrice()
  const discountPercentage = getDiscountPercentage()
  const savingsAmount = getSavingsAmount()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card
        className="relative overflow-hidden border-0 hover:border-amber-200/20 transition-all duration-500 hover:scale-[1.02] h-[700px] cursor-pointer bg-white rounded-3xl"
        onClick={handleViewDetails}
      >
        <div className="absolute inset-0">
          <Image
            src={
              tour.imageUrl ||
              "/placeholder.svg?height=700&width=400&query=Peru transport tourism luxury scenic mountain landscape" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={getTitle()}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        <div className="absolute top-4 right-4 z-20">
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <path id="circle" d="M 50, 50 m -30, 0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
                </defs>
                <text className="text-[6px] fill-white/80 font-bold tracking-wider">
                  <textPath href="#circle">{spinningTexts[currentLanguage]}</textPath>
                </text>
              </svg>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg w-fit">
                {featuredTexts[currentLanguage]}
              </Badge>
              <Badge className="bg-green-500/90 text-white font-medium text-xs px-3 py-1 rounded-full shadow-lg w-fit">
                {availableTexts[currentLanguage]}
              </Badge>
              <Badge
                className={`${
                  tour.serviceType === "privatePremium" ? "bg-purple-500/90" : "bg-blue-500/90"
                } text-white font-medium text-xs px-3 py-1 rounded-full shadow-lg w-fit`}
              >
                {getServiceTypeText()}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{tour.duration || "1 día"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">2-8 personas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{getAvailableDays()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{tour.rating || 4.8} (150)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2 mt-3">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="font-medium">
                  {getOriginName()} → {getDestinationName()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-bold text-2xl leading-tight">{getTitle()}</h3>

            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{getDescription()}</p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-2xl p-4 border border-amber-500/30 shadow-xl">
                <div className="flex flex-col gap-2">
                  {tour.oldPrice && tour.oldPrice > finalPrice && (
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-base line-through font-medium">
                          ${getOldDollarPrice()} {dollarPriceTexts[currentLanguage]}
                        </span>
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                          -{discountPercentage}%
                        </Badge>
                      </div>
                      <div className="text-green-400 text-xs font-bold bg-green-500/20 px-2 py-1 rounded-full">
                        {savingsTexts[currentLanguage]} ${savingsAmount.toFixed(2)}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">
                      {fromTexts[currentLanguage]}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-black text-4xl tracking-tight">${getDollarPrice()}</span>
                      <span className="text-amber-400/80 font-bold text-lg">{dollarPriceTexts[currentLanguage]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs font-medium">{perPersonTexts[currentLanguage]}</span>
                      <Badge
                        className={`${
                          tour.serviceType === "privatePremium"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        } text-white text-xs px-2 py-1 rounded-full shadow-md`}
                      >
                        {getServiceTypeText()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-xs px-4 py-3 rounded-full shadow-md hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewDetails}
                >
                  <Eye className="w-4 h-4" />
                  {detailsTexts[currentLanguage]}
                </motion.button>

                <motion.button
                  className="flex-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white font-semibold text-xs px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                  whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                  onClick={handleReserveClick}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isAddingToCart ? "..." : reserveTexts[currentLanguage]}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransportCard
