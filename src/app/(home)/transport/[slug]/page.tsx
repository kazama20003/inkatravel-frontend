"use client"
import { api } from "@/lib/axiosInstance"
import type React from "react"

import { notFound } from "next/navigation"
import Image from "next/image"
import {
  Clock,
  MapPin,
  Star,
  Users,
  Phone,
  MessageCircle,
  Navigation,
  Shield,
  Award,
  Globe,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState, useRef, useCallback } from "react"
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api"
import { type CreateCartDto, CartItemType } from "@/types/cart"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TranslatedText {
  es?: string
  en?: string
  fr?: string
  de?: string
  it?: string
}

interface TourTransport {
  _id: string
  title: TranslatedText | string
  description: TranslatedText | string
  termsAndConditions: TranslatedText | string
  origin: {
    name: string
    lat: number
    lng: number
  }
  destination: {
    name: string
    lat: number
    lng: number
  }
  intermediateStops?: Array<{
    name: string
    lat: number
    lng: number
  }>
  availableDays: string[]
  departureTime?: string
  arrivalTime?: string
  durationInHours?: number
  duration?: string
  price: number
  rating?: number
  vehicleId?: string
  routeCode?: string
  isActive?: boolean
  slug?: string
  itinerary?: Array<{
    day: number
    title: TranslatedText | string
    description: TranslatedText | string
    imageUrl?: string
    imageId?: string
    route?: Array<{
      location: string
      description: TranslatedText | string
      imageUrl?: string
      imageId?: string
      stopTime?: string
    }>
  }>
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface Props {
  params: Promise<{ slug: string }>
}

const getTranslatedText = (text: TranslatedText | string | undefined, language: string): string => {
  if (!text) return ""
  if (typeof text === "string") return text
  return text[language as keyof TranslatedText] || text.es || text.en || ""
}

const translations = {
  es: {
    loading: "Cargando paquete turístico...",
    mapNotAvailable: "Mapa no disponible",
    mapApiKeyMissing: "La clave de API de Google Maps no está configurada.",
    origin: "Origen",
    destination: "Destino",
    loadingMap: "Cargando mapa...",
    interactiveMap: "Mapa Interactivo",
    roadRoute: "Ruta de Viaje",
    roadRouteCalculated: "Ruta por carretera calculada",
    showingLocations: "Mostrando ubicaciones",
    roadDistance: "Distancia por carretera",
    calculating: "Calculando...",
    estimatedTime: "Tiempo estimado",
    intermediateStops: "Paradas intermedias",
    yearsExperience: "Años de experiencia",
    satisfiedTourists: "Turistas satisfechos",
    safeReliable: "Seguro y confiable",
    supportAvailable: "Soporte disponible",
    packageDescription: "Descripción del Paquete",
    smallGroup: "Grupo Pequeño",
    smallGroupDesc: "Máximo 12 personas para una experiencia personalizada y cómoda",
    personalizedAttention: "Atención personalizada",
    flexibilityStops: "Más flexibilidad en paradas",
    familyEnvironment: "Ambiente familiar",
    expertGuide: "Guía Experto",
    expertGuideDesc: "Guía local certificado con conocimiento profundo de la región",
    officialCertification: "Certificación oficial",
    historicalKnowledge: "Conocimiento histórico",
    multilingual: "Multilingüe",
    tenMinuteStops: "Paradas de 10 minutos",
    tenMinuteStopsDesc: "Paradas de 10 minutos dependiendo de los turistas",
    travelInsurance: "Seguro de Viaje",
    travelInsuranceDesc: "Cobertura completa durante todo el recorrido",
    medicalInsurance: "Seguro médico",
    assistance24: "Asistencia 24/7",
    luggageCoverage: "Cobertura de equipaje",
    detailedItinerary: "Itinerario Detallado",
    dayStops: "Paradas del día",
    imageGallery: "Galería de Imágenes",
    perPerson: "por persona",
    specialPriceForForeigners: "¡Precio especial para extranjeros!",
    tourLanguage: "Idioma del tour",
    departureDate: "Fecha de Salida",
    numberOfTravelers: "Número de viajeros",
    person: "persona",
    people: "personas",
    availableDays: "Días Disponibles",
    reserveNow: "Reservar Ahora",
    consultWhatsApp: "Consultar por WhatsApp",
    callNow: "Llamar Ahora",
    schedules: "Horarios",
    departure: "Salida",
    arrival: "Llegada",
    securePayment: "Pago Seguro",
    certified: "Certificado",
    routeInfo: "Información de la Ruta",
    coordinates: "Coordenadas",
    duration: "Duración",
    hours: "horas",
    directTrip: "Viaje directo sin paradas intermedias",
    interactiveRouteMap: "Mapa interactivo de la ruta",
    travelHours: "horas de viaje",
    termsConditions: "Términos y Condiciones",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  },
  en: {
    loading: "Loading tour package...",
    mapNotAvailable: "Map not available",
    mapApiKeyMissing: "Google Maps API key is not configured.",
    origin: "Origin",
    destination: "Destination",
    loadingMap: "Loading map...",
    interactiveMap: "Interactive Map",
    roadRoute: "Travel Route",
    roadRouteCalculated: "Road route calculated",
    showingLocations: "Showing locations",
    roadDistance: "Road distance",
    calculating: "Calculating...",
    estimatedTime: "Estimated time",
    intermediateStops: "Intermediate stops",
    yearsExperience: "Years of experience",
    satisfiedTourists: "Satisfied tourists",
    safeReliable: "Safe and reliable",
    supportAvailable: "Support available",
    packageDescription: "Package Description",
    smallGroup: "Small Group",
    smallGroupDesc: "Maximum 12 people for a personalized and comfortable experience",
    personalizedAttention: "Personalized attention",
    flexibilityStops: "More flexibility in stops",
    familyEnvironment: "Family environment",
    expertGuide: "Expert Guide",
    expertGuideDesc: "Certified local guide with deep knowledge of the region",
    officialCertification: "Official certification",
    historicalKnowledge: "Historical knowledge",
    multilingual: "Multilingual",
    tenMinuteStops: "10-Minute Stops",
    tenMinuteStopsDesc: "10-minute stops depending on tourists",
    travelInsurance: "Travel Insurance",
    travelInsuranceDesc: "Complete coverage throughout the journey",
    medicalInsurance: "Medical insurance",
    assistance24: "24/7 assistance",
    luggageCoverage: "Luggage coverage",
    detailedItinerary: "Detailed Itinerary",
    dayStops: "Day stops",
    imageGallery: "Image Gallery",
    perPerson: "per person",
    specialPriceForForeigners: "Special price for foreigners!",
    tourLanguage: "Tour language",
    departureDate: "Departure Date",
    numberOfTravelers: "Number of travelers",
    person: "person",
    people: "people",
    availableDays: "Available Days",
    reserveNow: "Reserve Now",
    consultWhatsApp: "Consult via WhatsApp",
    callNow: "Call Now",
    schedules: "Schedules",
    departure: "Departure",
    arrival: "Arrival",
    securePayment: "Secure Payment",
    certified: "Certified",
    routeInfo: "Route Information",
    coordinates: "Coordinates",
    duration: "Duration",
    hours: "hours",
    directTrip: "Direct trip without intermediate stops",
    interactiveRouteMap: "Interactive route map",
    travelHours: "travel hours",
    termsConditions: "Terms and Conditions",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  fr: {
    loading: "Chargement du forfait touristique...",
    mapNotAvailable: "Carte non disponible",
    mapApiKeyMissing: "La clé API Google Maps n'est pas configurée.",
    origin: "Origine",
    destination: "Destination",
    loadingMap: "Chargement de la carte...",
    interactiveMap: "Carte Interactive",
    roadRoute: "Itinéraire de Voyage",
    roadRouteCalculated: "Itinéraire routier calculé",
    showingLocations: "Affichage des emplacements",
    roadDistance: "Distance routière",
    calculating: "Calcul en cours...",
    estimatedTime: "Temps estimé",
    intermediateStops: "Arrêts intermédiaires",
    yearsExperience: "Années d'expérience",
    satisfiedTourists: "Touristes satisfaits",
    safeReliable: "Sûr et fiable",
    supportAvailable: "Support disponible",
    packageDescription: "Description du Forfait",
    smallGroup: "Petit Groupe",
    smallGroupDesc: "Maximum 12 personnes pour une expérience personnalisée et confortable",
    personalizedAttention: "Attention personnalisée",
    flexibilityStops: "Plus de flexibilité dans les arrêts",
    familyEnvironment: "Environnement familial",
    expertGuide: "Guide Expert",
    expertGuideDesc: "Guide local certifié avec une connaissance approfondie de la région",
    officialCertification: "Certification officielle",
    historicalKnowledge: "Connaissances historiques",
    multilingual: "Multilingue",
    tenMinuteStops: "Arrêts de 10 minutes",
    tenMinuteStopsDesc: "Arrêts de 10 minutes selon les touristes",
    travelInsurance: "Assurance Voyage",
    travelInsuranceDesc: "Couverture complète tout au long du voyage",
    medicalInsurance: "Assurance médicale",
    assistance24: "Assistance 24/7",
    luggageCoverage: "Couverture bagages",
    detailedItinerary: "Itinéraire Détaillé",
    dayStops: "Arrêts de la journée",
    imageGallery: "Galerie d'Images",
    perPerson: "par personne",
    specialPriceForForeigners: "Prix spécial pour les étrangers!",
    tourLanguage: "Langue du tour",
    departureDate: "Date de Départ",
    numberOfTravelers: "Nombre de voyageurs",
    person: "personne",
    people: "personnes",
    availableDays: "Jours Disponibles",
    reserveNow: "Réserver Maintenant",
    consultWhatsApp: "Consulter via WhatsApp",
    callNow: "Appeler Maintenant",
    schedules: "Horaires",
    departure: "Départ",
    arrival: "Arrivée",
    securePayment: "Paiement Sécurisé",
    certified: "Certifié",
    routeInfo: "Informations sur l'Itinéraire",
    coordinates: "Coordennées",
    duration: "Durée",
    hours: "heures",
    directTrip: "Voyage direct sans arrêts intermédiaires",
    interactiveRouteMap: "Carte interactive de l'itinéraire",
    travelHours: "heures de voyage",
    termsConditions: "Termes et Conditions",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
  },
  de: {
    loading: "Tourpaket wird geladen...",
    mapNotAvailable: "Karte nicht verfügbar",
    mapApiKeyMissing: "Google Maps API-Schlüssel ist nicht konfiguriert.",
    origin: "Ursprung",
    destination: "Ziel",
    loadingMap: "Karte wird geladen...",
    interactiveMap: "Interaktive Karte",
    roadRoute: "Reiseroute",
    roadRouteCalculated: "Straßenroute berechnet",
    showingLocations: "Standorte anzeigen",
    roadDistance: "Straßenentfernung",
    calculating: "Berechnung...",
    estimatedTime: "Geschätzte Zeit",
    intermediateStops: "Zwischenstopps",
    yearsExperience: "Jahre Erfahrung",
    satisfiedTourists: "Zufriedene Touristen",
    safeReliable: "Sicher und zuverlässig",
    supportAvailable: "Support verfügbar",
    packageDescription: "Paketbeschreibung",
    smallGroup: "Kleine Gruppe",
    smallGroupDesc: "Maximal 12 Personen für ein personalisiertes und komfortables Erlebnis",
    personalizedAttention: "Persönliche Betreuung",
    flexibilityStops: "Mehr Flexibilität bei Stopps",
    familyEnvironment: "Familienumgebung",
    expertGuide: "Expertenführer",
    expertGuideDesc: "Zertifizierter lokaler Führer mit tiefem Wissen über die Region",
    officialCertification: "Offizielle Zertifizierung",
    historicalKnowledge: "Historisches Wissen",
    multilingual: "Mehrsprachig",
    tenMinuteStops: "10-Minuten-Stopps",
    tenMinuteStopsDesc: "10-minütige Stopps je nach Touristen",
    travelInsurance: "Reiseversicherung",
    travelInsuranceDesc: "Vollständige Abdeckung während der gesamten Reise",
    medicalInsurance: "Krankenversicherung",
    assistance24: "24/7 Unterstützung",
    luggageCoverage: "Gepäckabdeckung",
    detailedItinerary: "Detaillierter Reiseplan",
    dayStops: "Tagesstopps",
    imageGallery: "Bildergalerie",
    perPerson: "pro Person",
    specialPriceForForeigners: "Sonderpreis für Ausländer!",
    tourLanguage: "Tour-Sprache",
    departureDate: "Abfahrtsdatum",
    numberOfTravelers: "Anzahl der Reisenden",
    person: "Person",
    people: "Personen",
    availableDays: "Verfügbare Tage",
    reserveNow: "Jetzt Reservieren",
    consultWhatsApp: "Über WhatsApp konsultieren",
    callNow: "Jetzt Anrufen",
    schedules: "Zeitpläne",
    departure: "Abfahrt",
    arrival: "Ankunft",
    securePayment: "Sichere Zahlung",
    certified: "Zertifiziert",
    routeInfo: "Routeninformationen",
    coordinates: "Koordinaten",
    duration: "Dauer",
    hours: "Stunden",
    directTrip: "Direktreise ohne Zwischenstopps",
    interactiveRouteMap: "Interaktive Routenkarte",
    travelHours: "Reisestunden",
    termsConditions: "Geschäftsbedingungen",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
  },
  it: {
    loading: "Caricamento pacchetto turistico...",
    mapNotAvailable: "Mappa non disponibile",
    mapApiKeyMissing: "La chiave API di Google Maps non è configurata.",
    origin: "Origine",
    destination: "Destinazione",
    loadingMap: "Caricamento mappa...",
    interactiveMap: "Mappa Interattiva",
    roadRoute: "Percorso di Viaggio",
    roadRouteCalculated: "Percorso stradale calcolato",
    showingLocations: "Mostrando posizioni",
    roadDistance: "Distanza stradale",
    calculating: "Calcolando...",
    estimatedTime: "Tempo stimato",
    intermediateStops: "Fermate intermedie",
    yearsExperience: "Anni di esperienza",
    satisfiedTourists: "Turisti soddisfatti",
    safeReliable: "Sicuro e affidabile",
    supportAvailable: "Supporto disponibile",
    packageDescription: "Descrizione del Pacchetto",
    smallGroup: "Gruppo Piccolo",
    smallGroupDesc: "Massimo 12 persone per un'esperienza personalizzata e confortevole",
    personalizedAttention: "Attenzione personalizzata",
    flexibilityStops: "Più flessibilità nelle fermate",
    familyEnvironment: "Ambiente familiare",
    expertGuide: "Guida Esperta",
    expertGuideDesc: "Guida locale certificata con conoscenza approfondita della regione",
    officialCertification: "Certificazione ufficiale",
    historicalKnowledge: "Conoscenza storica",
    multilingual: "Multilingue",
    tenMinuteStops: "Fermate di 10 minuti",
    tenMinuteStopsDesc: "Fermate di 10 minuti a seconda dei turisti",
    travelInsurance: "Assicurazione di Viaggio",
    travelInsuranceDesc: "Copertura completa durante tutto il viaggio",
    medicalInsurance: "Assicurazione medica",
    assistance24: "Assistenza 24/7",
    luggageCoverage: "Copertura bagagli",
    detailedItinerary: "Itinerario Dettagliato",
    dayStops: "Fermate del giorno",
    imageGallery: "Galleria di Immagini",
    perPerson: "per persona",
    specialPriceForForeigners: "Prezzo speciale per stranieri!",
    tourLanguage: "Lingua del tour",
    departureDate: "Data di Partenza",
    numberOfTravelers: "Numero di viaggiatori",
    person: "persona",
    people: "persone",
    availableDays: "Giorni Disponibili",
    reserveNow: "Prenota Ora",
    consultWhatsApp: "Consulta via WhatsApp",
    callNow: "Chiama Ora",
    schedules: "Orari",
    departure: "Partenza",
    arrival: "Arrivo",
    securePayment: "Pagamento Sicuro",
    certified: "Certificato",
    routeInfo: "Informazioni sul Percorso",
    coordinates: "Coordinate",
    duration: "Durata",
    hours: "ore",
    directTrip: "Viaggio diretto senza fermate intermedie",
    interactiveRouteMap: "Mappa interattiva del percorso",
    travelHours: "ore di viaggio",
    termsConditions: "Termini e Condizioni",
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
  },
}

const GOOGLE_MAPS_LIBRARIES: ("geometry" | "places")[] = ["geometry", "places"]

const GoogleMapComponent = ({
  origin,
  destination,
  intermediateStops,
}: {
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  intermediateStops?: Array<{ name: string; lat: number; lng: number }>
}) => {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.es

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [routeDistance, setRouteDistance] = useState<string>("")
  const [routeDuration, setRouteDuration] = useState<string>("")
  const [mapError, setMapError] = useState<string | null>(null)
  const [routeCalculated, setRouteCalculated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
  const [isRouteInfoExpanded, setIsRouteInfoExpanded] = useState(false)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const mapRef = useRef<google.maps.Map | null>(null)

  const center = {
    lat: (origin.lat + destination.lat) / 2,
    lng: (origin.lng + destination.lng) / 2,
  }

  const mapContainerStyle = {
    width: "100%",
    height: "700px",
  }

  const mapOptions = {
    zoom: 8,
    center: center,
    mapTypeId: "roadmap" as const,
    mapId: "DEMO_MAP_ID",
  }

  const createMarkerContent = (color: string, label: string, size = 32) => {
    const markerDiv = document.createElement("div")
    markerDiv.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    `
    markerDiv.textContent = label
    return markerDiv
  }

  const createMarkers = () => {
    // Check if google is available in the global scope
    if (!window.google?.maps?.marker?.AdvancedMarkerElement || !mapRef.current) {
      console.log("[v0] Map or AdvancedMarkerElement not available yet")
      return
    }

    markersRef.current.forEach((marker) => {
      marker.map = null
    })
    markersRef.current = []

    try {
      const originMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: origin.lat, lng: origin.lng },
        title: `${t.origin}: ${origin.name}`,
        content: createMarkerContent("#10b981", "O"),
        map: mapRef.current,
      })
      markersRef.current.push(originMarker)

      const destinationMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: destination.lat, lng: destination.lng },
        title: `${t.destination}: ${destination.name}`,
        content: createMarkerContent("#f97316", "D"),
        map: mapRef.current,
      })
      markersRef.current.push(destinationMarker)

      if (intermediateStops && intermediateStops.length > 0) {
        intermediateStops.forEach((stop, index) => {
          const stopMarker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: stop.lat, lng: stop.lng },
            title: `Parada ${index + 1}: ${stop.name}`,
            content: createMarkerContent("#eab308", (index + 1).toString(), 28),
            map: mapRef.current,
          })
          markersRef.current.push(stopMarker)
        })
      }

      console.log("[v0] Created", markersRef.current.length, "advanced markers")
    } catch (error) {
      console.error("[v0] Error creating markers:", error)
    }
  }

  const directionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    console.log("[v0] Directions API response status:", status)

    if (status === "OK" && result) {
      console.log("[v0] Route calculated successfully")
      setDirectionsResponse(result)

      const route = result.routes[0]
      if (route) {
        let totalDistance = 0
        let totalDuration = 0

        route.legs.forEach((leg: google.maps.DirectionsLeg) => {
          totalDistance += leg.distance?.value || 0
          totalDuration += leg.duration?.value || 0
        })

        setRouteDistance(`${(totalDistance / 1000).toFixed(0)} km`)
        setRouteDuration(
          `${Math.floor(totalDuration / 3600)} ${t.hours} ${Math.round((totalDuration % 3600) / 60)} min`,
        )
      }

      setRouteCalculated(true)
      setMapError(null)
    } else {
      console.warn("[v0] Directions API failed:", status)
      setMapError("No se pudo calcular la ruta por carretera. Mostrando ubicaciones.")
      setRouteCalculated(false)
    }
  }

  const createWaypoints = (): Array<{ location: { lat: number; lng: number }; stopover: boolean }> => {
    // Check if google is available in the global scope
    if (!window.google?.maps || !isGoogleMapsLoaded) return []

    const waypoints: Array<{ location: { lat: number; lng: number }; stopover: boolean }> = []
    if (intermediateStops && intermediateStops.length > 0) {
      intermediateStops.forEach((stop) => {
        const latLng = new window.google.maps.LatLng(stop.lat, stop.lng)
        waypoints.push({
          location: { lat: latLng.lat(), lng: latLng.lng() },
          stopover: true,
        })
      })
    }
    return waypoints
  }

  const createDirectionsOptions = () => {
    // Check if google is available in the global scope
    if (!window.google?.maps || !isGoogleMapsLoaded) return null

    return {
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      waypoints: createWaypoints(),
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    }
  }

  const handleMapLoad = (map: google.maps.Map) => {
    console.log("[v0] Google Map loaded successfully")
    mapRef.current = map
    setIsGoogleMapsLoaded(true)
    setIsLoading(false)

    setTimeout(() => {
      createMarkers()
    }, 500)
  }

  const handleLoadError = () => {
    console.error("[v0] Failed to load Google Maps")
    setMapError("Error al cargar Google Maps. Verifica tu conexión a internet.")
    setIsLoading(false)
  }

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker: google.maps.marker.AdvancedMarkerElement) => {
        marker.map = null
      })
      markersRef.current = []
    }
  }, [])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return (
      <div className="w-full h-96 rounded-xl overflow-hidden relative bg-white border border-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t.mapNotAvailable}</h3>
          <p className="text-gray-500 mb-4">{t.mapApiKeyMissing}</p>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">
                {t.origin}: {origin.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">
                {t.destination}: {destination.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const directionsOptions = createDirectionsOptions()

  return (
    <div className="w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden relative border border-gray-200">
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        onLoad={() => setIsGoogleMapsLoaded(true)}
        onError={handleLoadError}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-600">{t.loadingMap}</p>
            </div>
          </div>
        )}

        <GoogleMap mapContainerStyle={mapContainerStyle} options={mapOptions} onLoad={handleMapLoad}>
          {isGoogleMapsLoaded && directionsOptions && !directionsResponse && !mapError && (
            <DirectionsService options={directionsOptions} callback={directionsCallback} />
          )}

          {isGoogleMapsLoaded && directionsResponse && (
            <DirectionsRenderer
              options={{
                directions: directionsResponse,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#f97316",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div className="absolute bottom-4 right-4 z-20">
        {/* Collapsed state - compact button */}
        {!isRouteInfoExpanded && (
          <button
            onClick={() => setIsRouteInfoExpanded(true)}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            aria-label="Show route information"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <div className="text-xs font-semibold text-gray-900">{t.roadRoute}</div>
                {routeDistance && <div className="text-xs text-orange-500 font-bold">{routeDistance}</div>}
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        )}

        {/* Expanded state - full info panel */}
        {isRouteInfoExpanded && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-xl max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-gray-800 text-sm">{t.roadRoute}</span>
              </div>
              <button
                onClick={() => setIsRouteInfoExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Hide route information"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {routeCalculated && (
              <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 mb-3">
                {t.roadRouteCalculated}
              </span>
            )}
            {mapError && (
              <span className="inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200 mb-3">
                {t.showingLocations}
              </span>
            )}

            <div className="space-y-2 text-sm mb-3">
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-700 text-xs">{t.origin}:</span>
                  <p className="text-gray-600 text-xs truncate">{origin.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-700 text-xs">{t.destination}:</span>
                  <p className="text-gray-600 text-xs truncate">{destination.name}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">{t.roadDistance}:</span>
                <span className="font-bold text-orange-500">{routeDistance || t.calculating}</span>
              </div>
              {routeDuration && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{t.estimatedTime}:</span>
                  <span className="font-bold text-green-600">{routeDuration}</span>
                </div>
              )}
              {intermediateStops && intermediateStops.length > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{t.intermediateStops}:</span>
                  <span className="font-bold text-yellow-600">{intermediateStops.length}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        {t.interactiveMap}
      </div>

      {mapError && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm max-w-xs">
          {mapError}
        </div>
      )}
    </div>
  )
}

const CustomCarousel = ({
  images,
  autoplayDelay = 5000,
}: {
  images: { url: string; title: string; description: string }[]
  autoplayDelay?: number
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  useEffect(() => {
    if (!isAutoplayEnabled || images.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoplayEnabled, images.length, autoplayDelay, goToNext])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsAutoplayEnabled(false)}
      onMouseLeave={() => setIsAutoplayEnabled(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={85}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=800&width=1600&query=${encodeURIComponent(image.title)}`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 md:h-16 md:w-16 bg-white/95 backdrop-blur-sm border-2 border-white shadow-2xl rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 md:h-16 md:w-16 bg-white/95 backdrop-blur-sm border-2 border-white shadow-2xl rounded-full flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "w-10 bg-white shadow-lg" : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function TransportPage({ params }: Props) {
  const { language } = useLanguage()

  const t = translations[language as keyof typeof translations] || translations.es
  const [transport, setTransport] = useState<TourTransport | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTravelers, setSelectedTravelers] = useState<number>(1)
  const [bookingNotes] = useState<string>("")
  const [isBooking, setIsBooking] = useState(false)

  const translateDay = (day: string): string => {
    const dayTranslations: { [key: string]: { [key: string]: string } } = {
      Monday: { es: "Lunes", en: "Monday", fr: "Lundi", de: "Montag", it: "Lunedì" },
      Tuesday: { es: "Martes", en: "Tuesday", fr: "Mardi", de: "Dienstag", it: "Martedì" },
      Wednesday: { es: "Miércoles", en: "Wednesday", fr: "Mercredi", de: "Mittwoch", it: "Mercoledì" },
      Thursday: { es: "Jueves", en: "Thursday", fr: "Jeudi", de: "Donnerstag", it: "Giovedì" },
      Friday: { es: "Viernes", en: "Friday", fr: "Vendredi", de: "Freitag", it: "Venerdì" },
      Saturday: { es: "Sábado", en: "Saturday", fr: "Samedi", de: "Samstag", it: "Sabato" },
      Sunday: { es: "Domingo", en: "Sunday", fr: "Dimanche", de: "Sonntag", it: "Domenica" },
    }
    return dayTranslations[day]?.[language] || day
  }

  useEffect(() => {
    async function loadTransport() {
      try {
        const resolvedParams = await params
        const { slug: paramSlug } = resolvedParams

        const langParam = language !== "es" ? `?lang=${language}` : ""
        console.log("[v0] Fetching transport with language:", language)

        const response = await api.get<{ data: TourTransport[] }>(`/tour-transport${langParam}`)
        const transports = response.data.data
        console.log("[v0] All transports received:", transports?.length || 0)

        if (transports && transports.length > 0) {
          console.log(
            "[v0] Available transport slugs:",
            transports.map((t) => t.slug),
          )
          console.log("[v0] Looking for slug:", paramSlug)
        }

        const foundTransport = transports?.find((t) => t.slug === paramSlug)
        console.log(
          "[v0] Found transport:",
          foundTransport ? getTranslatedText(foundTransport.title, language) : "Not found",
        )

        if (!foundTransport) {
          notFound()
        }

        setTransport(foundTransport)
      } catch (error) {
        console.error("Error fetching transport:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadTransport()
  }, [params, language])

  const galleryImages: { url: string; title: string; description: string }[] = []
  if (transport) {
    if (transport.imageUrl) {
      galleryImages.push({
        url: transport.imageUrl,
        title: getTranslatedText(transport.title, language),
        description: "Main transport image",
      })
    }
    if (transport.itinerary) {
      transport.itinerary.forEach((day) => {
        if (day.imageUrl) {
          galleryImages.push({
            url: day.imageUrl,
            title: getTranslatedText(day.title, language),
            description: getTranslatedText(day.description, language),
          })
        }
      })
    }

    if (galleryImages.length === 0) {
      galleryImages.push({
        url: `/placeholder.svg?height=800&width=1600&query=${encodeURIComponent(getTranslatedText(transport.title, language))}`,
        title: getTranslatedText(transport.title, language),
        description: "Transport tour image",
      })
    }
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl">{t.loading}</p>
          </div>
        </div>
      </>
    )
  }

  if (!transport) {
    notFound()
  }

  console.log("[v0] Transport data:", transport)

  const displayPrice = transport.price
  const originCoords = `${transport.origin.lat.toString()}, ${transport.origin.lng.toString()}`
  const destinationCoords = `${transport.destination.lat.toString()}, ${transport.destination.lng.toString()}`

  const handleReserveNow = async () => {
    if (!transport) return

    if (!selectedDate) {
      alert(language === "es" ? "Por favor selects una fecha" : "Please select a date")
      return
    }

    setIsBooking(true)

    try {
      const cartData: CreateCartDto = {
        items: [
          {
            productType: CartItemType.Transport,
            productId: transport._id,
            startDate: selectedDate,
            people: selectedTravelers,
            pricePerPerson: transport.price,
            total: transport.price * selectedTravelers,
            notes: bookingNotes || "",
            productTitle: getTranslatedText(transport.title, language),
            productImageUrl: transport.imageUrl,
            productSlug: transport.slug,
          },
        ],
        totalPrice: transport.price * selectedTravelers,
      }

      console.log("[v0] Sending cart data:", cartData)

      const response = await api.post("/cart", cartData)

      console.log("[v0] Cart created successfully:", response.data)

      toast.success(language === "es" ? "¡Agregado alCarrito exitosamente!" : "Successfully added to cart!", {
        description:
          language === "es"
            ? `${selectedTravelers} ${selectedTravelers === 1 ? "persona" : "personas"} - $${(displayPrice * selectedTravelers).toLocaleString()} USD`
            : `${selectedTravelers} ${selectedTravelers === 1 ? "person" : "people"} - $${(displayPrice * selectedTravelers).toLocaleString()} USD`,
        duration: 5000,
        action: {
          label: language === "es" ? "Ver Carrito" : "View Cart",
          onClick: () => {
            window.location.href = "/checkout"
          },
        },
      })
    } catch (error) {
      console.error("[v0] Error creating cart:", error)
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const responseError = error as { response?: { data?: { message?: string } } }
        errorMessage = responseError.response?.data?.message || "Unknown error"
      }

      toast.error(language === "es" ? "Error al agregar al carrito" : "Error adding to cart", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500">
        <div className="absolute inset-0">
          <CustomCarousel images={galleryImages} autoplayDelay={5000} />

          <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-5xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
                  {getTranslatedText(transport.title, language)}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl">
                    <div className="flex items-center gap-3 mb-1">
                      <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ruta</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {transport.origin.name} → {transport.destination.name}
                    </p>
                  </div>

                  {transport.durationInHours && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl">
                      <div className="flex items-center gap-3 mb-1">
                        <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duración</span>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        {transport.durationInHours.toString()} {t.hours}
                      </p>
                    </div>
                  )}

                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl">
                    <div className="flex items-center gap-3 mb-1">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{(transport.rating || 4.8).toString()}/5 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-4 md:right-8 z-20 bg-white rounded-2xl py-4 px-6 shadow-2xl border-4 border-orange-500">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-1">Desde</div>
              <div className="text-4xl md:text-5xl font-bold text-orange-500">${displayPrice.toLocaleString()}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">{t.perPerson} USD</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">12+</div>
              <p className="text-sm text-gray-600">{t.yearsExperience}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-7 h-7 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5000+</div>
              <p className="text-sm text-gray-600">{t.satisfiedTourists}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <p className="text-sm text-gray-600">{t.safeReliable}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-7 h-7 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <p className="text-sm text-gray-600">{t.supportAvailable}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.packageDescription}</h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  {getTranslatedText(transport.description, language)}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-5 border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{t.smallGroup}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.smallGroupDesc}</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {t.personalizedAttention}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {t.flexibilityStops}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {t.familyEnvironment}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{t.expertGuide}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.expertGuideDesc}</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        {t.officialCertification}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        {t.historicalKnowledge}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        {t.multilingual}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{t.travelInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.travelInsuranceDesc}</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {t.medicalInsurance}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {t.assistance24}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {t.luggageCoverage}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-5 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{t.tenMinuteStops}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{t.tenMinuteStopsDesc}</p>
                  </div>
                </div>
              </div>

              {transport.itinerary && transport.itinerary.length > 0 && (
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl">{t.detailedItinerary}</CardTitle>
                    <CardDescription className="text-sm md:text-base">Explora cada día de tu aventura</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {transport.itinerary.map((day, index) => (
                        <AccordionItem key={index} value={`day-${index}`}>
                          <AccordionTrigger className="text-base md:text-lg hover:no-underline">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm shadow-lg flex-shrink-0">
                                {day.day.toString()}
                              </div>
                              <span className="font-bold text-left">{getTranslatedText(day.title, language)}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 md:pt-6 pb-3 md:pb-4">
                            <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                              {getTranslatedText(day.description, language)}
                            </p>
                            {day.route && day.route.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 md:p-6">
                                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                                  {t.dayStops}
                                </h4>
                                <div className="space-y-3 md:space-y-4">
                                  {day.route.map((stop, stopIndex) => (
                                    <div key={stopIndex} className="flex items-start gap-3 md:gap-4">
                                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs md:text-sm mt-1">
                                        {stopIndex + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                          <span className="font-semibold text-gray-800 text-sm md:text-base">
                                            {stop.location}
                                          </span>
                                          {stop.stopTime && (
                                            <span className="text-xs md:text-sm bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full font-medium">
                                              {stop.stopTime}
                                            </span>
                                          )}
                                        </div>
                                        {stop.description && (
                                          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {getTranslatedText(stop.description, language)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl md:text-4xl">{t.roadRoute}</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Visualiza tu ruta de viaje completa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="map" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                      <TabsTrigger value="map" className="text-sm md:text-base">
                        Mapa Interactivo
                      </TabsTrigger>
                      <TabsTrigger value="info" className="text-sm md:text-base">
                        Información de Ruta
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="map" className="space-y-4">
                      <div className="rounded-xl overflow-hidden">
                        <GoogleMapComponent
                          origin={transport.origin}
                          destination={transport.destination}
                          intermediateStops={transport.intermediateStops}
                        />
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 text-center">
                        {t.interactiveRouteMap}: {transport.origin.name} a {transport.destination.name}
                        {transport.durationInHours && ` • ${transport.durationInHours.toString()} ${t.travelHours}`}
                      </p>
                    </TabsContent>
                    <TabsContent value="info" className="space-y-4 md:space-y-6">
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg">{t.origin}</h3>
                          </div>
                          <p className="text-gray-800 font-semibold mb-2 text-sm md:text-base">
                            {transport.origin.name}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {t.coordinates}: {originCoords}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-base md:text-lg">{t.destination}</h3>
                          </div>
                          <p className="text-gray-800 font-semibold mb-2 text-sm md:text-base">
                            {transport.destination.name}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {t.coordinates}: {destinationCoords}
                          </p>
                        </div>
                      </div>

                      {transport.durationInHours && (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                            <h3 className="font-bold text-base md:text-lg">{t.duration}</h3>
                          </div>
                          <p className="text-xl md:text-2xl font-bold text-gray-900">
                            {transport.durationInHours.toString()} {t.hours}
                          </p>
                        </div>
                      )}

                      {transport.intermediateStops && transport.intermediateStops.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 md:p-6">
                          <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            {t.intermediateStops}
                          </h3>
                          <ul className="space-y-2 md:space-y-3">
                            {transport.intermediateStops.map((stop, index) => (
                              <li key={index} className="flex items-center gap-3">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-gray-800 font-medium text-sm md:text-base">{stop.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {transport.termsAndConditions && (
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">{t.termsConditions}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {getTranslatedText(transport.termsAndConditions, language)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-center pb-6 border-b-2 border-gray-100">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-orange-500">${displayPrice.toLocaleString()}</span>
                    <span className="text-gray-600">USD / {t.person}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 font-medium">
                      {(transport.rating || 4.8).toString()}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-semibold">{t.specialPriceForForeigners}</p>
                </div>

                <div className="py-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">{t.departureDate}</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">{t.numberOfTravelers}</label>
                    <select
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      value={selectedTravelers}
                      onChange={(e) => setSelectedTravelers(Number(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? t.person : t.people}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total:</span>
                      <span className="text-2xl font-bold text-orange-500">
                        ${(displayPrice * selectedTravelers).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pb-6 border-b-2 border-gray-100">
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleReserveNow}
                    disabled={isBooking || !selectedDate}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isBooking ? (language === "es" ? "Procesando..." : "Processing...") : t.reserveNow}
                  </button>

                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    onClick={() =>
                      window.open(
                        `https://wa.me/51996407040?text=Hola, Vengo de la pagina web inca travel peru estoy interesado en el tour: ${getTranslatedText(transport.title, language)}`,
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>

                  <button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    onClick={() => window.open("tel:+51996407040", "_self")}
                  >
                    <Phone className="w-5 h-5" />
                    +51 996 407 040
                  </button>
                </div>

                {transport.availableDays && transport.availableDays.length > 0 && (
                  <div className="pt-6 pb-6 border-b-2 border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t.availableDays}</h3>
                    <div className="flex flex-wrap gap-2">
                      {transport.availableDays.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold"
                        >
                          {translateDay(day)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(transport.departureTime || transport.arrivalTime) && (
                  <div className="pt-6 pb-6 border-b-2 border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t.schedules}</h3>
                    <div className="space-y-2">
                      {transport.departureTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t.departure}:</span>
                          <span className="font-bold text-gray-900">{transport.departureTime}</span>
                        </div>
                      )}
                      {transport.arrivalTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t.arrival}:</span>
                          <span className="font-bold text-gray-900">{transport.arrivalTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-600 font-semibold">{t.securePayment}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                        <Award className="w-6 h-6 text-yellow-500" />
                      </div>
                      <span className="text-xs text-gray-600 font-semibold">{t.certified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
