"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import type { Tour, TranslatedText } from "@/types/tour"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Users, Calendar, Mountain, Utensils, Heart, Zap } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface TourCardProps {
  tour: Tour
  index: number
}

export function TourCard({ tour, index }: TourCardProps) {
  const { language } = useLanguage()
  const router = useRouter()

  console.log("[v0] TourCard received tour:", tour)

  const handleCardClick = () => {
    router.push(`/tours/${tour.slug}`)
  }

  const featuredTexts = {
    es: "DESTACADO",
    en: "FEATURED",
    fr: "VEDETTE",
    de: "EMPFOHLEN",
    nl: "UITGELICHT",
    it: "IN EVIDENZA",
  }

  const reserveTexts = {
    es: "RESERVAR",
    en: "BOOK NOW",
    fr: "RÉSERVER",
    de: "BUCHEN",
    nl: "BOEKEN",
    it: "PRENOTA",
  }

  const fromTexts = {
    es: "Desde",
    en: "From",
    fr: "Depuis",
    de: "Von",
    nl: "Vanaf",
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
    nl: {
      easy: "Makkelijk",
      moderate: "Gemiddeld",
      challenging: "Uitdagend",
      extreme: "Extreem",
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

  const CategoryIcon = categoryIcons[tour.category?.toLowerCase() as keyof typeof categoryIcons] || Mountain

  const spinningTexts = {
    es: "• TOURS PERÚ • AVENTURA • CULTURA • NATURALEZA • HISTORIA • GASTRONOMÍA ",
    en: "• PERU TOURS • ADVENTURE • CULTURE • NATURE • HISTORY • GASTRONOMY ",
    fr: "• TOURS PÉROU • AVENTURE • CULTURE • NATUUR • HISTOIRE • GASTRONOMIE ",
    de: "• PERU TOUREN • ABENTEUER • KULTUR • NATUR • GESCHICHTE • GASTRONOMIE ",
    nl: "• PERU TOURS • AVONTUUR • CULTUUR • NATUUR • GESCHIEDENIS • GASTRONOMIE ",
    it: "• TOUR PERÙ • AVVENTURA • CULTURA • NATURA • STORIA • GASTRONOMIA ",
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
      return "bg-green-500/90"
    } else if (normalizedDifficulty === "moderado" || normalizedDifficulty === "moderate") {
      return "bg-yellow-500/90"
    } else if (normalizedDifficulty === "dificil" || normalizedDifficulty === "challenging") {
      return "bg-orange-500/90"
    } else {
      return "bg-red-500/90"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card
        onClick={handleCardClick}
        className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] h-[650px] cursor-pointer bg-white rounded-3xl"
      >
        <div className="absolute inset-0">
          <Image
            src={tour.imageUrl || "/placeholder.svg?height=700&width=400&query=Peru tour tourism scenic landscape"}
            alt={`${getTranslatedText(tour.title)} - ${tour.location}, ${tour.region}`}
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
                  <path id="circle" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                </defs>
                <text className="text-[6px] fill-white/90 font-bold tracking-wider">
                  <textPath href="#circle">{spinningTexts[language]}</textPath>
                </text>
              </svg>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <CategoryIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div className="flex justify-start items-start">
            <div className="flex flex-col gap-2">
              {tour.featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg w-fit">
                  {featuredTexts[language]}
                </Badge>
              )}
              <Badge
                className={`text-white font-medium text-xs px-3 py-1 rounded-full shadow-lg w-fit ${getDifficultyColor(tour.difficulty)}`}
              >
                {getDifficultyText(tour.difficulty)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{getDurationText(tour.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">2-12 personas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{tour.startTime || "Diario"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">
                    {tour.rating} ({tour.reviews || 150})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2 mt-3">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="font-medium">
                  {tour.location}, {tour.region}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/30">
              <h4 className="text-amber-300 font-semibold text-sm mb-2">Incluye:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {tour.highlights?.slice(0, 4).map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <span>{getTranslatedText(highlight)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-bold text-2xl leading-tight">{getTranslatedText(tour.title)}</h3>

            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{getTranslatedText(tour.subtitle)}</p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-amber-400 text-sm">{fromTexts[language]}</span>
                    <span className="text-white font-bold text-3xl">S/{tour.price}</span>
                  </div>
                  <div className="text-white/60 text-xs">por persona</div>
                </div>
              </div>

              <motion.button
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {reserveTexts[language]}
              </motion.button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TourCard
