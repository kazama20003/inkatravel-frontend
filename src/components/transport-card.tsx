"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import type { TourTransport } from "@/types/tour"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Users, Calendar } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation" // Added router for navigation

interface TransportCardProps {
  tour: TourTransport
  index: number
}

export function TransportCard({ tour, index }: TransportCardProps) {
  const { language } = useLanguage()
  const router = useRouter() // Added router hook

  type LanguageKey = "es" | "en" | "fr" | "de" | "it"

  const featuredTexts: Record<LanguageKey, string> = {
    es: "DESTACADO",
    en: "FEATURED",
    fr: "VEDETTE",
    de: "EMPFOHLEN",
    it: "IN EVIDENZA",
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
      // Handle both name and translatedName properties
      if ("name" in tour.origin) return tour.origin.name
      return "Origin"
    }
    return "Origin"
  }

  const getDestinationName = () => {
    if (typeof tour.destination === "string") return tour.destination
    if (tour.destination && typeof tour.destination === "object") {
      // Handle both name and translatedName properties
      if ("name" in tour.destination) return tour.destination.name
      return "Destination"
    }
    return "Destination"
  }

  const handleCardClick = () => {
    if (tour.slug) {
      router.push(`/transport/${tour.slug}`)
    }
  }

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking reserve button
    if (tour.slug) {
      router.push(`/transport/${tour.slug}`)
    }
  }

  const currentLanguage = language as LanguageKey

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card
        className="relative overflow-hidden border-0 hover:border-amber-200/20 transition-all duration-500 hover:scale-[1.02] h-[650px] cursor-pointer bg-white rounded-3xl"
        onClick={handleCardClick} // Added card click handler
      >
        <div className="absolute inset-0">
          <Image
            src={
              tour.imageUrl ||
              "/placeholder.svg?height=700&width=400&query=Peru transport tourism luxury scenic mountain landscape" ||
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
          {/* Top section with badges */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg w-fit">
                {featuredTexts[currentLanguage]}
              </Badge>
              <Badge className="bg-green-500/90 text-white font-medium text-xs px-3 py-1 rounded-full shadow-lg w-fit">
                {availableTexts[currentLanguage]}
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
                  <span className="font-medium">Diario</span>
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

            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/30">
              <h4 className="text-amber-300 font-semibold text-sm mb-2">Incluye:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  <span>Transporte privado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  <span>Guía profesional</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  <span>Seguro de viaje</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  <span>Agua mineral</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section with title and pricing */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-2xl leading-tight">{getTitle()}</h3>

            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{getDescription()}</p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-amber-400 text-sm">{fromTexts[currentLanguage]}</span>
                    <span className="text-white font-bold text-3xl">S/{tour.price || 0}</span>
                  </div>
                  <div className="text-white/60 text-xs">por persona</div>
                </div>
              </div>

              <motion.button
                className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px] min-w-[88px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReserveClick} // Added reserve button click handler
              >
                {reserveTexts[currentLanguage]}
              </motion.button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransportCard
