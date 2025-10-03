"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Calendar,
  MapPin,
  Users,
  Camera,
  Umbrella,
  Info,
  ChevronDown,
  Star,
  Award,
  TrendingUp,
} from "lucide-react"

const translations = {
  es: {
    // Hero Section
    heroTitle: "Cuándo Viajar",
    heroSubtitle: "al Perú",
    heroDescription:
      "Descubre el momento perfecto para cada destino y vive la experiencia de tu vida en el país de los incas",
    planYourTrip: "PLANIFICA TU VIAJE",

    // Stats
    stats: {
      days: "Días de aventura",
      regions: "Regiones climáticas",
      months: "Meses únicos",
      destinations: "Destinos increíbles",
    },

    // Navigation
    exploreByCategory: "Explora por categoría",
    choosePlanningMethod: "Elige cómo quieres planificar tu viaje perfecto",
    bySeasons: "Por Estaciones",
    monthByMonth: "Mes a Mes",
    byDestinations: "Por Destinos",

    // Seasons
    drySeasonTitle: "Temporada Seca",
    drySeasonMonths: "Mayo - Septiembre",
    drySeasonDescription: "La mejor época para visitar la mayoría del Perú",
    rainySeasonTitle: "Temporada de Lluvias",
    rainySeasonMonths: "Octubre - Abril",
    rainySeasonDescription: "Paisajes verdes y menos turistas",

    // Regions
    coast: "Costa",
    sierra: "Sierra",
    jungle: "Selva",
    weather: "Clima",
    temperature: "Temperatura",
    recommendedActivities: "Actividades recomendadas",
    whatToBring: "Qué llevar",

    // Monthly
    monthlyClimateTitle: "Clima Mes a Mes",
    monthlyDescription:
      "Información detallada del clima en cada región del Perú durante todo el año para planificar tu viaje perfecto.",
    popularity: "Popularidad",
    tourismLevel: "Nivel Turístico",
    advantages: "Ventajas",
    consider: "Considerar",

    // Tourism levels
    veryHigh: "Muy alta",
    high: "Alta",
    medium: "Media",
    low: "Baja",

    // Destinations
    bestTimeByDestination: "Mejor Época por Destino",
    destinationDescription:
      "Cada destino del Perú tiene su época ideal. Descubre cuándo visitar cada lugar para vivir la mejor experiencia.",
    bestMonthsToVisit: "Mejores meses para visitar",
    monthsToAvoid: "Meses a evitar",
    expertTips: "Consejos de expertos",

    // Why Choose Us
    whyChooseUs: "¿Por qué planificar con nosotros?",
    whyDescription:
      "Nuestra experiencia y conocimiento local te garantizan el viaje perfecto en cualquier época del año",

    // Features
    localExperts: "Expertos Locales",
    localExpertsDesc: "Guías certificados con más de 10 años de experiencia en cada región del Perú",
    perfectPlanning: "Planificación Perfecta",
    perfectPlanningDesc: "Te ayudamos a elegir las mejores dates según tus intereses y preferencias",
    guaranteedWeather: "Clima Garantizado",
    guaranteedWeatherDesc: "Monitoreamos las condiciones climáticas para asegurar tu mejor experiencia",
    optimizedRoutes: "Rutas Optimizadas",
    optimizedRoutesDesc: "Itinerarios diseñados para aprovechar al máximo cada destino en su mejor época",
    smallGroups: "Grupos Pequeños",
    smallGroupsDesc: "Experiencias más personales con grupos reducidos para mayor comodidad",
    uniqueMoments: "Momentos Únicos",
    uniqueMomentsDesc: "Captura los mejores momentos con condiciones climáticas y de luz ideales",

    // CTA
    ctaTitle: "Tu aventura perfecta",
    ctaSubtitle: "te está esperando",
    ctaDescription:
      "Ahora que conoces cuándo viajar, es momento de convertir tus sueños en realidad. Nuestros expertos están listos para diseñar tu experiencia única.",
    bookNow: "RESERVAR AHORA",
    freeConsultation: "CONSULTA GRATUITA",

    // Months
    months: {
      january: "Enero",
      february: "Febrero",
      march: "Marzo",
      april: "Abril",
      may: "Mayo",
      june: "Junio",
      july: "Julio",
      august: "Agosto",
      september: "Septiembre",
      october: "Octubre",
      november: "Noviembre",
      december: "Diciembre",
    },

    // Seasons short
    dry: "Seca",
    rainy: "Lluvias",
    transition: "Transición",
  },
  en: {
    // Hero Section
    heroTitle: "When to Travel",
    heroSubtitle: "to Peru",
    heroDescription:
      "Discover the perfect time for each destination and live the experience of your life in the land of the Incas",
    planYourTrip: "PLAN YOUR TRIP",

    // Stats
    stats: {
      days: "Days of adventure",
      regions: "Climate regions",
      months: "Unique months",
      destinations: "Incredible destinations",
    },

    // Navigation
    exploreByCategory: "Explore by category",
    choosePlanningMethod: "Choose how you want to plan your perfect trip",
    bySeasons: "By Seasons",
    monthByMonth: "Month by Month",
    byDestinations: "By Destinations",

    // Seasons
    drySeasonTitle: "Dry Season",
    drySeasonMonths: "May - September",
    drySeasonDescription: "The best time to visit most of Peru",
    rainySeasonTitle: "Rainy Season",
    rainySeasonMonths: "October - April",
    rainySeasonDescription: "Green landscapes and fewer tourists",

    // Regions
    coast: "Coast",
    sierra: "Highlands",
    jungle: "Jungle",
    weather: "Weather",
    temperature: "Temperature",
    recommendedActivities: "Recommended activities",
    whatToBring: "What to bring",

    // Monthly
    monthlyClimateTitle: "Month by Month Climate",
    monthlyDescription:
      "Detailed weather information for each region of Peru throughout the year to plan your perfect trip.",
    popularity: "Popularity",
    tourismLevel: "Tourism Level",
    advantages: "Advantages",
    consider: "Consider",

    // Tourism levels
    veryHigh: "Very high",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Destinations
    bestTimeByDestination: "Best Time by Destination",
    destinationDescription:
      "Each destination in Peru has its ideal time. Discover when to visit each place for the best experience.",
    bestMonthsToVisit: "Best months to visit",
    monthsToAvoid: "Months to avoid",
    expertTips: "Expert tips",

    // Why Choose Us
    whyChooseUs: "Why plan with us?",
    whyDescription: "Our experience and local knowledge guarantee you the perfect trip at any time of year",

    // Features
    localExperts: "Local Experts",
    localExpertsDesc: "Certified guides with over 10 years of experience in each region of Peru",
    perfectPlanning: "Perfect Planning",
    perfectPlanningDesc: "We help you choose the best dates according to your interests and preferences",
    guaranteedWeather: "Guaranteed Weather",
    guaranteedWeatherDesc: "We monitor weather conditions to ensure your best experience",
    optimizedRoutes: "Optimized Routes",
    optimizedRoutesDesc: "Itineraries designed to make the most of each destination in its best season",
    smallGroups: "Small Groups",
    smallGroupsDesc: "More personal experiences with small groups for greater comfort",
    uniqueMoments: "Unique Moments",
    uniqueMomentsDesc: "Capture the best moments with ideal weather and lighting conditions",

    // CTA
    ctaTitle: "Your perfect adventure",
    ctaSubtitle: "is waiting for you",
    ctaDescription:
      "Now that you know when to travel, it's time to turn your dreams into reality. Our experts are ready to design your unique experience.",
    bookNow: "BOOK NOW",
    freeConsultation: "FREE CONSULTATION",

    // Months
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
    },

    // Seasons short
    dry: "Dry",
    rainy: "Rainy",
    transition: "Transition",
  },
  fr: {
    // Hero Section
    heroTitle: "Quand Voyager",
    heroSubtitle: "au Pérou",
    heroDescription:
      "Découvrez le moment parfait pour chaque destination et vivez l'expérience de votre vie au pays des Incas",
    planYourTrip: "PLANIFIEZ VOTRE VOYAGE",

    // Stats
    stats: {
      days: "Jours d'aventure",
      regions: "Régions climatiques",
      months: "Mois uniques",
      destinations: "Destinations incroyables",
    },

    // Navigation
    exploreByCategory: "Explorer par catégorie",
    choosePlanningMethod: "Choisissez comment planifier votre voyage parfait",
    bySeasons: "Par Saisons",
    monthByMonth: "Mois par Mois",
    byDestinations: "Par Destinations",

    // Seasons
    drySeasonTitle: "Saison Sèche",
    drySeasonMonths: "Mai - Septembre",
    drySeasonDescription: "La meilleure période pour visiter la plupart du Pérou",
    rainySeasonTitle: "Saison des Pluies",
    rainySeasonMonths: "Octobre - Avril",
    rainySeasonDescription: "Paysages verts et moins de touristes",

    // Regions
    coast: "Côte",
    sierra: "Montagnes",
    jungle: "Jungle",
    weather: "Météo",
    temperature: "Température",
    recommendedActivities: "Activités recommandées",
    whatToBring: "Quoi apporter",

    // Monthly
    monthlyClimateTitle: "Climat Mois par Mois",
    monthlyDescription:
      "Informations météorologiques détaillées pour chaque région du Pérou tout au long de l'année pour planifier votre voyage parfait.",
    popularity: "Popularité",
    tourismLevel: "Niveau Touristique",
    advantages: "Avantages",
    consider: "À considérer",

    // Tourism levels
    veryHigh: "Très élevé",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",

    // Destinations
    bestTimeByDestination: "Meilleure Période par Destination",
    destinationDescription:
      "Chaque destination du Pérou a sa période idéale. Découvrez quand visiter chaque lieu pour la meilleure expérience.",
    bestMonthsToVisit: "Meilleurs mois pour visiter",
    monthsToAvoid: "Mois à éviter",
    expertTips: "Conseils d'experts",

    // Why Choose Us
    whyChooseUs: "Pourquoi planifier avec nous?",
    whyDescription:
      "Notre expérience et connaissance locale vous garantissent le voyage parfait à tout moment de l'année",

    // Features
    localExperts: "Experts Locaux",
    localExpertsDesc: "Guides certifiés avec plus de 10 ans d'expérience dans chaque région du Pérou",
    perfectPlanning: "Planification Parfaite",
    perfectPlanningDesc: "Nous vous aidons à choisir les meilleures dates selon vos intérêts et préférences",
    guaranteedWeather: "Météo Garantie",
    guaranteedWeatherDesc: "Nous surveillons les conditions météorologiques pour assurer votre meilleure expérience",
    optimizedRoutes: "Routes Optimisées",
    optimizedRoutesDesc: "Itinéraires conçus pour profiter au maximum de chaque destination en sa meilleure saison",
    smallGroups: "Petits Groupes",
    smallGroupsDesc: "Expériences plus personnelles avec des groupes réduits pour plus de confort",
    uniqueMoments: "Moments Uniques",
    uniqueMomentsDesc: "Capturez les meilleurs moments avec des conditions météorologiques et d'éclairage idéales",

    // CTA
    ctaTitle: "Votre aventure parfaite",
    ctaSubtitle: "vous attend",
    ctaDescription:
      "Maintenant que vous savez quand voyager, il est temps de transformer vos rêves en réalité. Nos experts sont prêts à concevoir votre expérience unique.",
    bookNow: "RÉSERVER MAINTENANT",
    freeConsultation: "CONSULTATION GRATUITE",

    // Months
    months: {
      january: "Janvier",
      february: "Février",
      march: "Mars",
      april: "Avril",
      may: "Mai",
      june: "Juin",
      july: "Juillet",
      august: "Août",
      september: "Septembre",
      october: "Octobre",
      november: "Novembre",
      december: "Décembre",
    },

    // Seasons short
    dry: "Sèche",
    rainy: "Pluies",
    transition: "Transition",
  },
}

const getSeasonalData = (t: typeof translations.es) => ({
  [t.drySeasonTitle]: {
    months: t.drySeasonMonths,
    description: t.drySeasonDescription,
    icon: Sun,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    regions: [
      {
        name: t.coast,
        weather: "Soleado y seco",
        temperature: "18°C - 25°C",
        description: "Cielos despejados, ideal para actividades al aire libre",
        activities: ["Playas", "Deportes acuáticos", "Senderismo costero"],
        clothing: ["Ropa ligera", "Protector solar", "Sombrero"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433028/Costa-de-Lima-pc_ula0tg.jpg",
        rating: 4.8,
      },
      {
        name: t.sierra,
        weather: "Seco y fresco",
        temperature: "5°C - 20°C",
        description: "Días soleados, noches frías, perfectos para trekking",
        activities: ["Machu Picchu", "Camino Inca", "City tours"],
        clothing: ["Capas de ropa", "Chaqueta abrigada", "Zapatos de trekking"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433084/Camino-Humantay-1_whk6rb.jpg",
        rating: 4.9,
      },
      {
        name: t.jungle,
        weather: "Menos lluvias",
        temperature: "22°C - 32°C",
        description: "Menor precipitación, mejor para navegación",
        activities: ["Safari amazónico", "Observación de fauna", "Navegación"],
        clothing: ["Ropa ligera", "Repelente", "Botas impermeables"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433099/manu_national_park_peru_opt_kjd7bv.jpg",
        rating: 4.7,
      },
    ],
  },
  [t.rainySeasonTitle]: {
    months: t.rainySeasonMonths,
    description: t.rainySeasonDescription,
    icon: CloudRain,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    regions: [
      {
        name: t.coast,
        weather: "Nublado y húmedo",
        temperature: "15°C - 22°C",
        description: "Garúa limeña, ambiente romántico",
        activities: ["Museos", "Gastronomía", "Vida nocturna"],
        clothing: ["Ropa abrigada", "Chaqueta ligera", "Paraguas"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433280/14785391664_21dd310edb_b_nszawm.jpg",
        rating: 4.3,
      },
      {
        name: t.sierra,
        weather: "Lluvioso",
        temperature: "3°C - 18°C",
        description: "Paisajes verdes, pero senderos difíciles",
        activities: ["Ciudades coloniales", "Museos", "Mercados"],
        clothing: ["Ropa impermeable", "Botas", "Poncho"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433337/659590ceafc51__400x209_pbwwdz.webp",
        rating: 4.1,
      },
      {
        name: t.jungle,
        weather: "Muy lluvioso",
        temperature: "24°C - 35°C",
        description: "Ríos altos, exuberante vegetación",
        activities: ["Lodges", "Observación de aves", "Pesca"],
        clothing: ["Ropa impermeable", "Botas altas", "Poncho"],
        image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433100/Peru-Rainforest-Tourism_pnhozg.jpg",
        rating: 4.4,
      },
    ],
  },
})

const getMonthlyData = (t: typeof translations.es) => [
  {
    month: t.months.january,
    season: t.rainy,
    coast: { temp: "20-26°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Muy lluvioso", rain: "Muy alta", icon: CloudRain },
    tourism: t.low,
    highlights: ["Menos turistas", "Paisajes verdes", "Precios bajos"],
    avoid: ["Camino Inca cerrado", "Senderos difíciles"],
    popularity: 65,
  },
  {
    month: t.months.february,
    season: t.rainy,
    coast: { temp: "21-27°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Muy alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Muy lluvioso", rain: "Muy alta", icon: CloudRain },
    tourism: t.low,
    highlights: ["Carnavales", "Menos multitudes"],
    avoid: ["Camino Inca cerrado", "Inundaciones posibles"],
    popularity: 60,
  },
  {
    month: t.months.march,
    season: t.rainy,
    coast: { temp: "20-26°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: t.low,
    highlights: ["Fin de lluvias", "Paisajes verdes"],
    avoid: ["Senderos embarrados"],
    popularity: 70,
  },
  {
    month: t.months.april,
    season: t.transition,
    coast: { temp: "18-24°C", weather: "Mixto", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-19°C", weather: "Mixto", rain: "Media", icon: Cloud },
    jungle: { temp: "23-31°C", weather: "Lluvioso", rain: "Media", icon: CloudRain },
    tourism: t.medium,
    highlights: ["Transición", "Buen clima", "Pocos turistas"],
    avoid: ["Clima impredecible"],
    popularity: 75,
  },
  {
    month: t.months.may,
    season: t.dry,
    coast: { temp: "16-22°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "3-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "22-30°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: t.high,
    highlights: ["Inicio temporada seca", "Excelente clima", "Camino Inca abierto"],
    avoid: ["Más turistas"],
    popularity: 90,
  },
  {
    month: t.months.june,
    season: t.dry,
    coast: { temp: "15-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "2-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "21-29°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: t.veryHigh,
    highlights: ["Mejor clima", "Inti Raymi", "Cielos despejados"],
    avoid: ["Multitudes", "Precios altos"],
    popularity: 95,
  },
  {
    month: t.months.july,
    season: t.dry,
    coast: { temp: "14-19°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "1-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "20-28°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: t.veryHigh,
    highlights: ["Temporada alta", "Clima perfecto"],
    avoid: ["Multitudes", "Reservas necesarias"],
    popularity: 98,
  },
  {
    month: t.months.august,
    season: t.dry,
    coast: { temp: "14-19°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "2-21°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "21-29°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: t.veryHigh,
    highlights: ["Excelente clima", "Vientos fuertes en sierra"],
    avoid: ["Vientos en montaña", "Multitudes"],
    popularity: 96,
  },
  {
    month: t.months.september,
    season: t.dry,
    coast: { temp: "15-20°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    sierra: { temp: "3-21°C", weather: "Seco", rain: "Muy baja", icon: Sun },
    jungle: { temp: "22-30°C", weather: "Seco", rain: "Baja", icon: Sun },
    tourism: t.high,
    highlights: ["Fin temporada seca", "Menos turistas", "Buen clima"],
    avoid: ["Vientos ocasionales"],
    popularity: 88,
  },
  {
    month: t.months.october,
    season: t.transition,
    coast: { temp: "16-22°C", weather: "Mixto", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-20°C", weather: "Mixto", rain: "Media", icon: Cloud },
    jungle: { temp: "23-31°C", weather: "Lluvioso", rain: "Media", icon: CloudRain },
    tourism: t.medium,
    highlights: ["Inicio lluvias", "Menos turistas", "Paisajes cambiantes"],
    avoid: ["Clima impredecible"],
    popularity: 78,
  },
  {
    month: t.months.november,
    season: t.rainy,
    coast: { temp: "17-23°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-19°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: t.low,
    highlights: ["Paisajes verdes", "Menos turistas"],
    avoid: ["Senderos difíciles"],
    popularity: 68,
  },
  {
    month: t.months.december,
    season: t.rainy,
    coast: { temp: "19-25°C", weather: "Nublado", rain: "Baja", icon: Cloud },
    sierra: { temp: "5-18°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    jungle: { temp: "24-32°C", weather: "Lluvioso", rain: "Alta", icon: CloudRain },
    tourism: t.medium,
    highlights: ["Fiestas navideñas", "Menos turistas"],
    avoid: ["Lluvias frecuentes"],
    popularity: 72,
  },
]

// Destinos específicos y sus mejores épocas
const destinationData = [
  {
    name: "Machu Picchu",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Enero", "Febrero"],
    description: "La ciudadela inca es mejor visitada durante la temporada seca",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748626558/machu-picchu-peru-1_eeheki.webp",
    tips: [
      "Reservar con 3-4 meses de anticipación",
      "El Camino Inca cierra en febrero",
      "Llevar ropa abrigada para las mañanas",
    ],
    rating: 4.9,
    visitors: "1.5M+",
  },
  {
    name: "Amazonas",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
    avoidMonths: ["Enero", "Febrero", "Marzo"],
    description: "Mejor navegación y observación de fauna en temporada seca",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433099/manu_national_park_peru_opt_kjd7bv.jpg",
    tips: [
      "Ríos más bajos facilitan la navegación",
      "Mayor concentración de animales",
      "Menos mosquitos en temporada seca",
    ],
    rating: 4.7,
    visitors: "800K+",
  },
  {
    name: "Cañón del Colca",
    bestMonths: ["Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Diciembre", "Enero", "Febrero"],
    description: "Ideal para observar cóndores y hacer trekking",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433526/colca-canyon-in-arequipa-297_rui1xh.jpg",
    tips: ["Cóndores más activos en la mañana", "Llevar ropa abrigada", "Evitar época de lluvias para trekking"],
    rating: 4.6,
    visitors: "400K+",
  },
  {
    name: "Líneas de Nazca",
    bestMonths: ["Todo el año"],
    avoidMonths: [],
    description: "El desierto ofrece condiciones estables todo el año",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433509/lineas-de-nazaca-desde-el-cielo_croclb.webp",
    tips: ["Vuelos pueden cancelarse por vientos fuertes", "Mejor visibilidad en mañanas", "Llevar protector solar"],
    rating: 4.4,
    visitors: "300K+",
  },
  {
    name: "Lago Titicaca",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    avoidMonths: ["Diciembre", "Enero", "Febrero"],
    description: "Cielos despejados para disfrutar las islas flotantes",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433585/Lago-Titicaca_esokwr.jpg",
    tips: ["Noches muy frías en temporada seca", "Llevar ropa abrigada", "Protección solar por la altitud"],
    rating: 4.5,
    visitors: "600K+",
  },
  {
    name: "Costa Norte",
    bestMonths: ["Diciembre", "Enero", "Febrero", "Marzo", "Abril"],
    avoidMonths: ["Junio", "Julio", "Agosto"],
    description: "Playas cálidas durante el verano costeño",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1750433616/118-imagen-1639161372018_roxwwm.jpg",
    tips: ["Temporada de playa en verano", "Evitar invierno costeño", "Ideal para deportes acuáticos"],
    rating: 4.3,
    visitors: "500K+",
  },
]

export default function WhenToGoPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<"seasons" | "monthly" | "destinations">("seasons")
  const [selectedSeason, setSelectedSeason] = useState<string>("")

  const t = translations[language as keyof typeof translations] || translations.es

  const seasonalData = getSeasonalData(t)
  const monthlyData = getMonthlyData(t)

  const seasonKeys = Object.keys(seasonalData)
  if (!selectedSeason && seasonKeys.length > 0) {
    setSelectedSeason(String(seasonKeys[0]))
  }

  const stats = [
    { number: "365", label: t.stats.days, icon: Calendar },
    { number: "3", label: t.stats.regions, icon: MapPin },
    { number: "12", label: t.stats.months, icon: Sun },
    { number: "100+", label: t.stats.destinations, icon: Camera },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg"
          alt="Paisajes del Perú en diferentes estaciones"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-none brand-text mb-6">
                {t.heroTitle}
                <br />
                <span className="text-peru-orange">{t.heroSubtitle}</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 body-text max-w-4xl mx-auto mb-8">{t.heroDescription}</p>
              <motion.button
                className="px-12 py-4 bg-peru-orange text-white brand-text text-xl hover:bg-peru-orange/90 transition-all duration-300 shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.planYourTrip}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown size={32} className="text-white/70" />
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-peru-orange/10 rounded-full flex items-center justify-center">
                      <IconComponent size={32} className="text-peru-orange" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-peru-dark brand-text mb-2">{stat.number}</div>
                  <div className="text-gray-600 body-text">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-light text-black brand-text mb-2">{t.exploreByCategory}</h3>
            <p className="text-gray-600 body-text">{t.choosePlanningMethod}</p>
          </div>
          <nav className="flex justify-center">
            <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl shadow-lg">
              {[
                { key: "seasons" as const, label: t.bySeasons, icon: Sun },
                { key: "monthly" as const, label: t.monthByMonth, icon: Calendar },
                { key: "destinations" as const, label: t.byDestinations, icon: MapPin },
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-6 md:px-8 rounded-lg font-medium text-sm md:text-base brand-text transition-all duration-300 flex items-center space-x-2 md:space-x-3 ${
                      activeTab === tab.key
                        ? "bg-white shadow-md text-peru-orange transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Seasons Tab */}
        {activeTab === "seasons" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Season Selector */}
            <div className="flex justify-center mb-16">
              <div className="flex bg-gray-100 p-2 rounded-xl">
                {Object.keys(seasonalData).map((season) => {
                  const seasonKey = season as keyof typeof seasonalData
                  const IconComponent = seasonalData[seasonKey].icon
                  return (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(String(seasonKey))}
                      className={`px-8 py-4 rounded-lg flex items-center space-x-3 transition-all duration-300 ${
                        selectedSeason === season
                          ? "bg-white shadow-lg text-black transform scale-105"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      <IconComponent size={24} className={seasonalData[seasonKey].color} />
                      <div className="text-left">
                        <div className="brand-text font-medium text-lg">{season}</div>
                        <div className="text-sm text-gray-500">{seasonalData[seasonKey].months}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Season Content */}
            {selectedSeason && seasonalData[selectedSeason] && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-light text-black brand-text mb-6">{selectedSeason}</h2>
                  <p className="text-xl body-text text-gray-600 max-w-3xl mx-auto">
                    {seasonalData[selectedSeason].description}
                  </p>
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {seasonalData[selectedSeason].regions.map(
                    (
                      region: {
                        name: string
                        weather: string
                        temperature: string
                        description: string
                        activities: string[]
                        clothing: string[]
                        image: string
                        rating: number
                      },
                      index: number,
                    ) => (
                      <motion.div
                        key={region.name}
                        className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                      >
                        {/* Region Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={region.image || "/placeholder.svg"}
                            alt={region.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-bold text-white brand-text">{region.name}</h3>
                              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-white text-sm font-medium">{region.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Region Content */}
                        <div className="p-6">
                          {/* Weather Info */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Cloud size={16} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 brand-text">{t.weather}</span>
                              </div>
                              <p className="text-sm text-gray-600 body-text">{region.weather}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Thermometer size={16} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 brand-text">{t.temperature}</span>
                              </div>
                              <p className="text-sm text-gray-600 body-text">{region.temperature}</p>
                            </div>
                          </div>

                          <p className="text-gray-600 body-text mb-6">{region.description}</p>

                          {/* Activities */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                              <Camera size={14} className="mr-2 text-peru-orange" />
                              {t.recommendedActivities}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {region.activities.map((activity: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-peru-orange/10 text-peru-orange text-sm body-text rounded-full border border-peru-orange/20"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Clothing */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                              <Users size={14} className="mr-2 text-peru-green" />
                              {t.whatToBring}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {region.clothing.map((item: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-peru-green/10 text-peru-green text-sm body-text rounded-full border border-peru-green/20"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-black brand-text mb-6">{t.monthlyClimateTitle}</h2>
              <p className="text-xl body-text text-gray-600 max-w-4xl mx-auto">{t.monthlyDescription}</p>
            </div>

            {/* Monthly Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlyData.map((month, index) => (
                <motion.div
                  key={month.month}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  {/* Month Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-black brand-text mb-2">{month.month}</h3>
                    <span
                      className={`px-4 py-2 text-sm brand-text rounded-full ${
                        month.season === t.dry
                          ? "bg-yellow-100 text-yellow-700"
                          : month.season === t.rainy
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {month.season}
                    </span>
                  </div>

                  {/* Popularity Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 brand-text">{t.popularity}</span>
                      <span className="text-sm text-gray-600">{month.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-peru-orange h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${month.popularity}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  {/* Regions Weather */}
                  <div className="space-y-4 mb-6">
                    {[
                      { name: t.coast, data: month.coast },
                      { name: t.sierra, data: month.sierra },
                      { name: t.jungle, data: month.jungle },
                    ].map(
                      (region: {
                        name: string
                        data: {
                          temp: string
                          weather: string
                          rain: string
                          icon: React.ComponentType<{ size: number; className: string }>
                        }
                      }) => {
                        const IconComponent = region.data.icon
                        return (
                          <div key={region.name} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <IconComponent size={16} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 brand-text">{region.name}</span>
                              </div>
                              <span className="text-xs text-gray-600 body-text">{region.data.temp}</span>
                            </div>
                            <p className="text-xs text-gray-500 body-text">{region.data.weather}</p>
                          </div>
                        )
                      },
                    )}
                  </div>

                  {/* Tourism Level */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 brand-text">{t.tourismLevel}</span>
                      <span
                        className={`px-3 py-1 text-xs brand-text rounded-full ${
                          month.tourism === t.veryHigh
                            ? "bg-red-100 text-red-700"
                            : month.tourism === t.high
                              ? "bg-orange-100 text-orange-700"
                              : month.tourism === t.medium
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {month.tourism}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                      <TrendingUp size={14} className="mr-2 text-green-500" />
                      {t.advantages}
                    </h4>
                    <ul className="space-y-2">
                      {month.highlights.map((highlight: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="body-text">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Avoid */}
                  {month.avoid && month.avoid.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 brand-text mb-3 flex items-center">
                        <Info size={14} className="mr-2 text-orange-500" />
                        {t.consider}
                      </h4>
                      <ul className="space-y-2">
                        {month.avoid.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="body-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-black brand-text mb-6">{t.bestTimeByDestination}</h2>
              <p className="text-xl body-text text-gray-600 max-w-4xl mx-auto">{t.destinationDescription}</p>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {destinationData.map(
                (
                  destination: {
                    name: string
                    bestMonths: string[]
                    avoidMonths: string[]
                    description: string
                    image: string
                    tips: string[]
                    rating: number
                    visitors: string
                  },
                  index: number,
                ) => (
                  <motion.div
                    key={destination.name}
                    className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Destination Image */}
                    <div className="relative h-80">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="text-3xl font-bold text-white brand-text mb-2">{destination.name}</h3>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Star size={16} className="text-yellow-400 fill-current" />
                                <span className="text-white font-medium">{destination.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Users size={16} className="text-white" />
                                <span className="text-white font-medium">{destination.visitors}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Destination Content */}
                    <div className="p-8">
                      <p className="text-gray-600 body-text mb-8 text-lg">{destination.description}</p>

                      {/* Best Months */}
                      <div className="mb-8">
                        <h4 className="text-lg font-medium text-gray-700 brand-text mb-4 flex items-center">
                          <Sun size={20} className="mr-3 text-green-500" />
                          {t.bestMonthsToVisit}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {destination.bestMonths.map((month: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-green-100 text-green-700 font-medium body-text rounded-full border border-green-200 hover:bg-green-200 transition-colors"
                            >
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Avoid Months */}
                      {destination.avoidMonths.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-lg font-medium text-gray-700 brand-text mb-4 flex items-center">
                            <Umbrella size={20} className="mr-3 text-red-500" />
                            {t.monthsToAvoid}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {destination.avoidMonths.map((month: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-red-100 text-red-700 font-medium body-text rounded-full border border-red-200"
                              >
                                {month}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-700 brand-text mb-4 flex items-center">
                          <Info size={20} className="mr-3 text-blue-500" />
                          {t.expertTips}
                        </h4>
                        <ul className="space-y-3">
                          {destination.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="flex items-start text-gray-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-4 flex-shrink-0" />
                              <span className="body-text text-lg">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-black brand-text mb-6">{t.whyChooseUs}</h2>
            <p className="text-xl body-text text-gray-600 max-w-3xl mx-auto">{t.whyDescription}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: t.localExperts,
                description: t.localExpertsDesc,
              },
              {
                icon: Calendar,
                title: t.perfectPlanning,
                description: t.perfectPlanningDesc,
              },
              {
                icon: Sun,
                title: t.guaranteedWeather,
                description: t.guaranteedWeatherDesc,
              },
              {
                icon: MapPin,
                title: t.optimizedRoutes,
                description: t.optimizedRoutesDesc,
              },
              {
                icon: Users,
                title: t.smallGroups,
                description: t.smallGroupsDesc,
              },
              {
                icon: Camera,
                title: t.uniqueMoments,
                description: t.uniqueMomentsDesc,
              },
            ].map(
              (
                feature: {
                  icon: React.ComponentType<{ size: number; className: string }>
                  title: string
                  description: string
                },
                index: number,
              ) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    className="bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-peru-orange/10 rounded-full flex items-center justify-center group-hover:bg-peru-orange/20 transition-colors">
                        <IconComponent size={32} className="text-peru-orange" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-black brand-text mb-4">{feature.title}</h3>
                    <p className="text-gray-600 body-text">{feature.description}</p>
                  </motion.div>
                )
              },
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-peru-dark py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-8 brand-text">
              {t.ctaTitle}
              <br />
              <span className="text-peru-orange">{t.ctaSubtitle}</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 body-text mb-12 max-w-3xl mx-auto">{t.ctaDescription}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                className="px-12 py-4 bg-peru-orange text-white brand-text text-xl hover:bg-peru-orange/90 transition-all duration-300 shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.bookNow}
              </motion.button>
              <motion.button
                className="px-12 py-4 border-2 border-white text-white brand-text text-xl hover:bg-white hover:text-peru-dark transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.freeConsultation}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
