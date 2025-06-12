"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Clock, Calendar, Users, Star, ChevronRightIcon as Chevron, Check, X, Info, Shield } from "lucide-react"

interface Tour {
  id: number
  title: string
  subtitle: string
  image: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  groupSize: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  difficulty: "Fácil" | "Moderado" | "Difícil"
  highlights: string[]
  nextDeparture: string
  featured?: boolean
  tourType: "Premium" | "Clásico" | "Básico"
  transport: string
  route: string[]
  itinerary?: {
    day: number
    title: string
    description: string
    activities: string[]
    meals?: string[]
    accommodation?: string
  }[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
}

// Datos de ejemplo para un tour específico
const tourData: Tour = {
  id: 6,
  title: "VALLE DEL COLCA",
  subtitle: "El cañón más profundo del Perú",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
  price: 899,
  priceGroup: 4499,
  duration: "3D/2N",
  groupSize: "Sin límite",
  rating: 4.9,
  reviews: 87,
  location: "Arequipa",
  region: "Arequipa",
  category: "Trekking",
  difficulty: "Difícil",
  highlights: ["Mirador Cruz del Cóndor", "Baños termales", "Pueblos tradicionales"],
  nextDeparture: "2025-06-05",
  tourType: "Premium",
  transport: "Camioneta 4x4 con aire acondicionado",
  route: ["Arequipa", "Chivay", "Cabanaconde", "San Juan de Chuccho", "Oasis"],
  itinerary: [
    {
      day: 1,
      title: "AREQUIPA / CABANACONDE / SAN JUAN DE CHUCCHO",
      description: "Inicio de la aventura en el Cañón del Colca",
      activities: [
        "Recojo desde sus hoteles y salida con destino al pueblo de Chivay",
        "Arribo al pueblo de Chivay y desayuno",
        "Salida hacia el mirador Cruz del Cóndor",
        "Llegada a mirador de Cruz del Cóndor, apreciar el majestuoso vuelo de los cóndores",
        "Salida con destino al pueblo de Cabanaconde",
        "Almuerzo en el pueblo de Cabanaconde",
        "Salida al Mirador de San Miguel y descenso al Cañón de Colca",
        "Arribo a la primera comunidad San Juan de Chuccho e instalación",
        "Cena y pernocte en las casas de familias locales",
      ],
      meals: ["Desayuno", "Almuerzo", "Cena"],
      accommodation: "Casas de familias locales en San Juan de Chuccho",
    },
    {
      day: 2,
      title: "SAN JUAN DE CHUCCHO – VALLE DE SANGALLE – OASIS",
      description: "Exploración de comunidades y descanso en el Oasis",
      activities: [
        "Desayuno en la comunidad San Juan de Chuccho",
        "Salida a Cosñirhua, Malata y descendemos hacia el pueblo de Sangalle conocido como el Oasis",
        "Visita a los pueblos de Cosñirhua y Malata, observar restos arqueológicos, museo local y producción de miel de abeja",
        "Continuamos con nuestra caminata hacia el valle de Sangalle (Oasis)",
        "Llegada a Oasis, e instalación en sus respectivos bungalows para descansar",
        "Almuerzo en Oasis rodeado",
        "Tiempo Libre para disfrutar de la piscina y de actividades opcionales",
        "Cena y pernocte en bungalows o cabañas rústicas en Oasis",
      ],
      meals: ["Desayuno", "Almuerzo", "Cena"],
      accommodation: "Bungalows o cabañas rústicas en Oasis",
    },
    {
      day: 3,
      title: "SANGALLE / CABANACONDE / CHIVAY / AREQUIPA",
      description: "Retorno a Arequipa con paradas panorámicas",
      activities: [
        "Ascendemos el cañón desde Oasis con dirección hacia el pueblo de Cabanaconde",
        "Arribo al pueblo de Cabanaconde y desayuno",
        "Salida con destino a Chivay, con paradas en el recorrido",
        "Salida hacia el mirador Cruz del Cóndor",
        "Llegada a mirador de Cruz del Cóndor",
        "Arribo a Chivay y nos dirigimos a las aguas termales de la Calera",
        "Retorno al pueblo de Chivay con paradas en los pueblos de (Pincholo, Maca y Yanque)",
        "Arribo a Chivay y nos dirigimos a las aguas termales de la Calera",
        "Almuerzo Buffet en Chivay (no incluye almuerzo)",
        "Retorno a la ciudad de Arequipa realizando paradas en los lugares más importantes de la ruta",
        "Llegada a la ciudad de Arequipa y traslados a sus hoteles",
      ],
      meals: ["Desayuno"],
      accommodation: "No incluido",
    },
  ],
  includes: [
    "Asesoría un día antes del tour",
    "Botiquín de primeros auxilios",
    "Casa en San Juan y valle Sangalle Oasis",
    "Guía profesional en turismo de aventura, español/inglés",
    "Piscina temperada en el Valle del Colca",
    "Recojo de su hotel (cercado de Puno)",
    "Transporte turístico Arequipa - Chivay - Cañon del Colca - Arequipa",
    "Visita guiada a los atractivos a visitar",
  ],
  notIncludes: [
    "01 almuerzo",
    "Boleto Turístico: Peruanos S/.20, Latinos S/.40, Extranjeros S/.70",
    "Ingreso Baños Termales - S/.15",
    "Otros snacks y/o bebidas durante los recorridos",
    "Regalos, souvenirs",
    "Propinas por servicio (opcionales, voluntarias)",
  ],
  toBring: [
    "Cámara fotográfica, Papel higiénico y baterías extras",
    "Una botella de agua (1 litro)",
    "Lentes, Gorra y bloqueador solar",
    "Ropa ligera y abrigadora",
  ],
  conditions: [
    "Niños a partir de 05 años Pagan tarifa de adulto con derecho a asiento",
    "En caso de cancelar o querer cambiar de tour 24 horas antes de viajar, no habrá reembolso",
    "Puede reservar con el 50% y cancelar al momento del Tour",
  ],
}

// Datos de ejemplo para otro tour
const cotahuasiTour: Tour = {
  id: 8,
  title: "CAÑÓN DE COTAHUASI",
  subtitle: "El cuarto cañón más profundo del planeta",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
  price: 899,
  priceGroup: 4499,
  duration: "4D/3N",
  groupSize: "Sin límite",
  rating: 4.7,
  reviews: 201,
  location: "Arequipa",
  region: "Arequipa",
  category: "Aventura",
  difficulty: "Moderado",
  highlights: ["Cascadas de Sipia", "Baños termales de Luicho", "Nevado Coropuna"],
  nextDeparture: "2025-06-15",
  tourType: "Clásico",
  transport: "Minivan turística",
  route: ["Arequipa", "Valle de Majes", "Cotahuasi", "Tomepampa", "Alca"],
  itinerary: [
    {
      day: 1,
      title: "AREQUIPA – CORIRE – APLAO – CHUQUIBAMBA - VALLE DE MAJES",
      description: "Inicio del viaje hacia el Valle de Majes",
      activities: [
        "Te recogeremos de tu hotel en Arequipa y nos dirigiremos hacia el Valle de Majes pasaremos por los pueblos de Corire, Aplao y Chuquibamba",
        "Despues del almuerzo observaremos el hermosos Nevado de Coropuna 6330msnm. y veremos la Laguna de Pallarcocha, el Nevado Solimana, Yaretas, Vicuñas, etc.",
        "Bajaremos por una carretera, durante una hora, durante el recorrido veremos las hermosas andenerías hasta llegar al pueblo Cotahuasi aproximadamente a las 17. 00 hrs., traslado al hotel, acomodo. Por la noche cena y Alojamiento.",
      ],
      meals: ["Almuerzo", "Cena"],
      accommodation: "Hotel en Cotahuasi",
    },
    {
      day: 2,
      title: "COTAHUASI – TOMEPAMPA – ALCA – BAÑOS TERMALES DE LUICHO",
      description: "Exploración de pueblos y baños termales",
      activities: [
        "Despertamos temprano en el pueblo de Cotahuasi para tomar nuestro primer alimento (desayuno) luego visitaremos a los baños termales",
        "Después de visitar el pueblo continuaremos a con la excursión para visitar taurismo la cual posee una iglesia colonial. y tomar el bus a Tomepanpa para explorar el lugar. visitando su iglesia colonial y granja de apicultura",
        "en el transcurso del recorrido nos detendremos en el poblado de Alca para almorzar con un pequeño tiempo para relajar nuestros músculos en los baños termales de Luicho. Luego retornaremos hacia el poblado de cotahuasi.",
      ],
      meals: ["Desayuno", "Almuerzo", "Cena"],
      accommodation: "Hotel en Cotahuasi",
    },
    {
      day: 3,
      title: "COTAHUASI – CASCADAS DE SIPIA – COTAHUASI",
      description: "Visita a las majestuosas cascadas de Sipia",
      activities: [
        "Después de un nutritivo desayuno a las 7.00 am comenzaremos con la excursión en el bus, el trayecto tardara una hora aprox. después iniciaremos con la caminata con la ayuda de caballos.",
        "Durante nuestra excursión podremos apreciar la hermosa vista del camino de herradura rodeada de abúndate vegetación. Luego de una caminata llegaremos a nuestro destino a las majestuosas cascadas de Sipia.",
        "luego iniciamos con el retorno hacia nuestro punto de inicio que es el poblado de Cotahuasi, llegando durante la noche tendremos la cena para luego pernoctar.",
      ],
      meals: ["Desayuno", "Almuerzo", "Cena"],
      accommodation: "Hotel en Cotahuasi",
    },
    {
      day: 4,
      title: "COTAHUASI - CASTILLO DE MAJES - PIEDRA DE TORO MUERTO - AREQUIPA",
      description: "Retorno a Arequipa con visitas culturales",
      activities: [
        "Iniciamos el día con un delicioso desayuno energizante, para luego comenzar nuestro viaje de regreso hacia la ciudad Blanca de Arequipa.",
        "Durante nuestro retorno haremos algunas paradas, para visitar el Castillo de majes y las formaciones de Piedra de Toro Muerto que son asociadas con las culturas locales como wari y chuquipampa.",
        "Después de visitar estos maravillosos destinos y apreciar el maravilloso paisaje continuaremos con nuestro viaje de retorno hacia la ciudad de Arequipa, mientras disfrutamos de los maravillosos parajes que nos acompañaran hasta nuestro destino final.",
      ],
      meals: ["Desayuno"],
      accommodation: "No incluido",
    },
  ],
  includes: ["Paseo a pie con guía profesional", "Transporte", "Entradas Turísticas", "Recogida en el hotel"],
  notIncludes: ["Propinas", "Snack"],
  toBring: [
    "Gorro o sombrero",
    "Bloqueador solar",
    "Poncho para la lluvia",
    "Zapatillas ideales para caminatas",
    "Mochila con agua y snacks",
    "Documentos y dinero extra en efectivo",
  ],
  conditions: [
    "En caso de cancelar o querer cambiar de tour 24 horas antes de viajar, no habrá reembolso",
    "Puede reservar con el 50% y cancelar al momento del Tour",
  ],
}

// Colección de tours para buscar por ID
const toursCollection: Record<number, Tour> = {
  6: tourData,
  8: cotahuasiTour,
}

type TabKey = "itinerary" | "includes" | "bring" | "conditions"

export default function TourDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary")
  const params = useParams()
  const router = useRouter()
  const [tour, setTour] = useState<Tour | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [participants, setParticipants] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulamos la carga de datos
    setLoading(true)
    const tourId = Number(params.id)

    // Simulamos una petición a la API
    setTimeout(() => {
      const foundTour = toursCollection[tourId]
      if (foundTour) {
        setTour(foundTour)
        setSelectedDate(foundTour.nextDeparture)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  // Fechas disponibles (simuladas)
  const availableDates = [
    { date: "2025-06-05", spots: 12 },
    { date: "2025-06-15", spots: 8 },
    { date: "2025-06-25", spots: 15 },
    { date: "2025-07-05", spots: 20 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peru-orange"></div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className="text-3xl brand-text text-peru-dark mb-4">Tour no encontrado</h1>
          <p className="text-peru-dark/70 body-text mb-8">Lo sentimos, el tour que buscas no está disponible.</p>
          <button
            onClick={() => router.push("/tours")}
            className="px-6 py-3 bg-peru-orange text-white brand-text hover:bg-peru-orange/90 transition-colors"
          >
            VER TODOS LOS TOURS
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-32">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-white mb-2">
              <button onClick={() => router.push("/tours")} className="text-sm hover:underline">
                Tours
              </button>
              <Chevron size={16} />
              <span className="text-sm">{tour.category}</span>
              <Chevron size={16} />
              <span className="text-sm">{tour.title}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center space-x-4 mb-4">
                <span
                  className={`px-3 py-1 text-xs brand-text text-white ${
                    tour.tourType === "Premium"
                      ? "bg-peru-gold"
                      : tour.tourType === "Clásico"
                        ? "bg-peru-orange"
                        : "bg-gray-600"
                  }`}
                >
                  {tour.tourType}
                </span>
                {tour.featured && <span className="px-3 py-1 text-xs brand-text bg-red-500 text-white">DESTACADO</span>}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl brand-text text-white mb-4">{tour.title}</h1>
              <p className="text-lg md:text-xl text-white/90 body-text mb-6">{tour.subtitle}</p>

              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  <span className="body-text">{tour.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  <span className="body-text">{tour.region}</span>
                </div>
                <div className="flex items-center">
                  <Star size={20} className="mr-2 text-yellow-400 fill-current" />
                  <span className="body-text">
                    {tour.rating} ({tour.reviews} reseñas)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  <span className="body-text">{tour.groupSize}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2">
            {/* Ruta */}
            <motion.div
              className="bg-white p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl brand-text text-peru-dark mb-4">Ruta del Tour</h2>
              <div className="flex flex-wrap items-center gap-2">
                {tour.route.map((stop, idx) => (
                  <div key={idx} className="flex items-center">
                    {idx > 0 && <Chevron size={16} className="mx-2 text-gray-400" />}
                    <span className="px-3 py-1 bg-peru-light/30 text-peru-dark text-sm brand-text">{stop}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { key: "itinerary" as TabKey, label: "Itinerario" },
                    { key: "includes" as TabKey, label: "Incluye/No Incluye" },
                    { key: "bring" as TabKey, label: "Qué Llevar" },
                    { key: "conditions" as TabKey, label: "Condiciones" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm brand-text transition-colors ${
                        activeTab === tab.key
                          ? "border-peru-orange text-peru-orange"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Itinerario Tab */}
                {activeTab === "itinerary" && tour.itinerary && (
                  <div className="space-y-8">
                    {tour.itinerary.map((day, index) => (
                      <motion.div
                        key={day.day}
                        className="border-l-4 border-peru-orange pl-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex items-center mb-3">
                          <span className="bg-peru-orange text-white px-3 py-1 text-sm brand-text mr-4">
                            DÍA {day.day}
                          </span>
                          <h3 className="text-lg brand-text text-peru-dark">{day.title}</h3>
                        </div>
                        <p className="text-peru-dark/70 body-text mb-4">{day.description}</p>

                        <div className="space-y-2 mb-4">
                          {day.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="flex items-start">
                              <div className="w-2 h-2 bg-peru-orange rounded-full mt-2 mr-3 flex-shrink-0" />
                              <p className="text-sm text-peru-dark/80 body-text">{activity}</p>
                            </div>
                          ))}
                        </div>

                        {day.meals && (
                          <div className="flex items-center text-sm text-peru-dark/60 mb-2">
                            <span className="font-medium mr-2">Comidas:</span>
                            <span className="body-text">{day.meals.join(", ")}</span>
                          </div>
                        )}

                        {day.accommodation && (
                          <div className="flex items-center text-sm text-peru-dark/60">
                            <span className="font-medium mr-2">Alojamiento:</span>
                            <span className="body-text">{day.accommodation}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Includes Tab */}
                {activeTab === "includes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg brand-text text-peru-dark mb-4 flex items-center">
                        <Check size={20} className="mr-2 text-green-600" />
                        Incluye
                      </h3>
                      <ul className="space-y-2">
                        {tour.includes?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={16} className="mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm body-text text-peru-dark/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg brand-text text-peru-dark mb-4 flex items-center">
                        <X size={20} className="mr-2 text-red-600" />
                        No Incluye
                      </h3>
                      <ul className="space-y-2">
                        {tour.notIncludes?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X size={16} className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm body-text text-peru-dark/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Bring Tab */}
                {activeTab === "bring" && (
                  <div>
                    <h3 className="text-lg brand-text text-peru-dark mb-4 flex items-center">
                      <Info size={20} className="mr-2 text-blue-600" />
                      Qué Llevar
                    </h3>
                    <ul className="space-y-2">
                      {tour.toBring?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm body-text text-peru-dark/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conditions Tab */}
                {activeTab === "conditions" && (
                  <div>
                    <h3 className="text-lg brand-text text-peru-dark mb-4 flex items-center">
                      <Shield size={20} className="mr-2 text-orange-600" />
                      Condiciones
                    </h3>
                    <ul className="space-y-2">
                      {tour.conditions?.map((condition, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm body-text text-peru-dark/80">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white p-6 sticky top-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl brand-text text-peru-dark mb-6">Reservar Tour</h3>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-peru-dark brand-text">${tour.price}</span>
                  <span className="text-sm text-gray-500 ml-2 body-text">por persona</span>
                </div>
                {tour.originalPrice && (
                  <span className="text-lg text-gray-500 line-through body-text">${tour.originalPrice}</span>
                )}
                {tour.priceGroup && (
                  <div className="mt-2">
                    <span className="text-lg text-peru-dark brand-text">${tour.priceGroup}</span>
                    <span className="text-sm text-gray-500 ml-2 body-text">precio grupal</span>
                  </div>
                )}
              </div>

              {/* Fecha */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-peru-dark mb-2 body-text">Fecha de salida</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-peru-orange focus:ring-1 focus:ring-peru-orange outline-none body-text"
                >
                  {availableDates.map((dateOption) => (
                    <option key={dateOption.date} value={dateOption.date}>
                      {new Date(dateOption.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      - {dateOption.spots} espacios
                    </option>
                  ))}
                </select>
              </div>

              {/* Participantes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-peru-dark mb-2 body-text">
                  Número de participantes
                </label>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 body-text">{participants}</span>
                  <button
                    onClick={() => setParticipants(participants + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg brand-text text-peru-dark">Total:</span>
                  <span className="text-2xl font-bold text-peru-dark brand-text">${tour.price * participants}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 body-text">
                  {participants} participante{participants > 1 ? "s" : ""} × ${tour.price}
                </p>
              </div>

              {/* Botones */}
              <div className="space-y-3">
                <button className="w-full bg-peru-orange text-white py-3 brand-text hover:bg-peru-orange/90 transition-colors">
                  RESERVAR AHORA
                </button>
                <button className="w-full border border-peru-dark text-peru-dark py-3 brand-text hover:bg-peru-dark hover:text-white transition-colors">
                  CONSULTAR
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 text-xs text-gray-500 space-y-2">
                <div className="flex items-center">
                  <Shield size={14} className="mr-2" />
                  <span className="body-text">Reserva segura</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span className="body-text">Cancelación gratuita hasta 24h antes</span>
                </div>
                <div className="flex items-center">
                  <Info size={14} className="mr-2" />
                  <span className="body-text">Confirmación inmediata</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
