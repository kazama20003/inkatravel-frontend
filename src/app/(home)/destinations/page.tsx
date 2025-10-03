"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Bus, Mountain, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const translations = {
  es: {
    heroTitle: "Cabanaconde cusco by bus",
    heroSubtitle: "Express Destinations",
    heroDescription:
      "Descubre la ruta más espectacular del Perú con nuestro servicio de bus express de lujo, conectando los tesoros andinos más extraordinarios",
    bookJourney: "Reservar Experiencia",
    completeRoute: "Ruta Exclusiva",
    routeDescription:
      "Una experiencia de viaje curada meticulosamente que combina comodidad premium con los paisajes más impresionantes de los Andes peruanos",
    stop: "Destino",
    fromStart: "desde el inicio",
    travelComfort: "Lujo en Movimiento",
    comfortDescription:
      "Nuestros buses premium están diseñados para ofrecer la experiencia de viaje más refinada por los Andes",
    unforgettableExperience: "Una Experiencia",
    unforgettableAndean: "Andina Excepcional",
    planTrip: "Planificar Viaje",
    readyAdventure: "¿Listo para una Aventura Extraordinaria?",
    readyDescription:
      "Únete a nosotros en un viaje que redefine el lujo del transporte andino y descubre el Perú como nunca antes",
    checkSchedules: "Ver Itinerarios",
    contactUs: "Consultar Ahora",
    stops: {
      arequipa: {
        name: "Arequipa",
        description: "Ciudad Blanca - Punto de partida de tu aventura andina",
        duration: "2 horas",
        highlights: ["Arquitectura Colonial", "Monasterio de Santa Catalina", "Vistas del Volcán Misti"],
      },
      cabanaconde: {
        name: "Cabanaconde",
        description: "Puerta de entrada al Cañón del Colca - Uno de los cañones más profundos del mundo",
        duration: "4 horas",
        highlights: ["Vistas del Cañón del Colca", "Observación de Cóndores", "Pueblos Tradicionales"],
      },
      puno: {
        name: "Puno",
        description: "Capital del Folclore - Puerta de entrada al Lago Titicaca",
        duration: "6 horas",
        highlights: ["Lago Titicaca", "Islas Flotantes", "Textiles Tradicionales"],
      },
      cusco: {
        name: "Cusco",
        description: "Ciudad Imperial - Antigua capital del Imperio Inca",
        duration: "8 horas",
        highlights: ["Acceso a Machu Picchu", "Arquitectura Inca", "Valle Sagrado"],
      },
    },
    busFeatures: {
      comfortableSeating: {
        title: "Asientos Cómodos",
        description: "Asientos reclinables con espacio extra para las piernas",
      },
      scenicRoutes: {
        title: "Rutas Escénicas",
        description: "Vistas impresionantes de las montañas andinas",
      },
      photoStops: {
        title: "Paradas Fotográficas",
        description: "Paradas estratégicas en miradores",
      },
      flexibleSchedule: {
        title: "Horario Flexible",
        description: "Múltiples horarios de salida diarios",
      },
    },
    highlights: {
      colcaCanyon: {
        title: "Vistas del Cañón del Colca",
        description:
          "Contempla uno de los cañones más profundos del mundo y observa majestuosos cóndores andinos volando",
      },
      lakeTiticaca: {
        title: "Lago Titicaca",
        description: "Experimenta el lago navegable más alto del mundo y visita las famosas islas flotantes",
      },
      incaHeritage: {
        title: "Herencia Inca",
        description: "Llega a Cusco, la puerta de entrada a Machu Picchu y el corazón del antiguo Imperio Inca",
      },
    },
  },
  en: {
    heroTitle: "Premium Destinations",
    heroSubtitle: "Cabanaconde to Cusco",
    heroDescription:
      "Discover Peru's most spectacular route with our luxury bus express service, connecting the most extraordinary Andean treasures",
    bookJourney: "Book Experience",
    completeRoute: "Exclusive Route",
    routeDescription:
      "A meticulously curated travel experience that combines premium comfort with the most breathtaking landscapes of the Peruvian Andes",
    stop: "Destination",
    fromStart: "from start",
    travelComfort: "Luxury in Motion",
    comfortDescription:
      "Our premium buses are designed to deliver the most refined travel experience through the Andes",
    unforgettableExperience: "An Exceptional",
    unforgettableAndean: "Andean Experience",
    planTrip: "Plan Journey",
    readyAdventure: "Ready for an Extraordinary Adventure?",
    readyDescription:
      "Join us on a journey that redefines luxury Andean transportation and discover Peru like never before",
    checkSchedules: "View Schedules",
    contactUs: "Inquire Now",
    stops: {
      arequipa: {
        name: "Arequipa",
        description: "Ciudad Blanca - Starting point of your Andean adventure",
        duration: "2 hours",
        highlights: ["Colonial Architecture", "Monastery of Santa Catalina", "Misti Volcano Views"],
      },
      cabanaconde: {
        name: "Cabanaconde",
        description: "Gateway to Colca Canyon - One of the deepest canyons in the world",
        duration: "4 hours",
        highlights: ["Colca Canyon Views", "Condor Watching", "Traditional Villages"],
      },
      puno: {
        name: "Puno",
        description: "Folklore Capital - Gateway to Lake Titicaca",
        duration: "6 hours",
        highlights: ["Lake Titicaca", "Floating Islands", "Traditional Textiles"],
      },
      cusco: {
        name: "Cusco",
        description: "Imperial City - Ancient capital of the Inca Empire",
        duration: "8 hours",
        highlights: ["Machu Picchu Access", "Inca Architecture", "Sacred Valley"],
      },
    },
    busFeatures: {
      comfortableSeating: {
        title: "Comfortable Seating",
        description: "Reclining seats with extra legroom",
      },
      scenicRoutes: {
        title: "Scenic Routes",
        description: "Breathtaking Andean mountain views",
      },
      photoStops: {
        title: "Photo Stops",
        description: "Strategic stops at viewpoints",
      },
      flexibleSchedule: {
        title: "Flexible Schedule",
        description: "Multiple departure times daily",
      },
    },
    highlights: {
      colcaCanyon: {
        title: "Colca Canyon Views",
        description: "Witness one of the world's deepest canyons and spot majestic Andean condors soaring overhead",
      },
      lakeTiticaca: {
        title: "Lake Titicaca",
        description: "Experience the highest navigable lake in the world and visit the famous floating islands",
      },
      incaHeritage: {
        title: "Inca Heritage",
        description: "Arrive in Cusco, the gateway to Machu Picchu and the heart of the ancient Inca Empire",
      },
    },
  },
  fr: {
    heroTitle: "Destinations Premium",
    heroSubtitle: "Cabanaconde à Cusco",
    heroDescription:
      "Découvrez la route la plus spectaculaire du Pérou avec notre service de bus express de luxe, reliant les trésors andins les plus extraordinaires",
    bookJourney: "Réserver l'Expérience",
    completeRoute: "Route Exclusive",
    routeDescription:
      "Une expérience de voyage méticuleusement organisée qui combine le confort premium avec les paysages les plus époustouflants des Andes péruviennes",
    stop: "Destination",
    fromStart: "depuis le début",
    travelComfort: "Luxe en Mouvement",
    comfortDescription:
      "Nos bus premium sont conçus pour offrir l'expérience de voyage la plus raffinée à travers les Andes",
    unforgettableExperience: "Une Expérience",
    unforgettableAndean: "Andine Exceptionnelle",
    planTrip: "Planifier le Voyage",
    readyAdventure: "Prêt pour une Aventure Extraordinaire?",
    readyDescription:
      "Rejoignez-nous pour un voyage qui redéfinit le transport andin de luxe et découvrez le Pérou comme jamais auparavant",
    checkSchedules: "Voir les Horaires",
    contactUs: "Consulter Maintenant",
    stops: {
      arequipa: {
        name: "Arequipa",
        description: "Ciudad Blanca - Point de départ de votre aventure andine",
        duration: "2 heures",
        highlights: ["Architecture Coloniale", "Monastère de Santa Catalina", "Vues du Volcan Misti"],
      },
      cabanaconde: {
        name: "Cabanaconde",
        description: "Porte d'entrée du Canyon de Colca - L'un des canyons les plus profonds du monde",
        duration: "4 heures",
        highlights: ["Vues du Canyon de Colca", "Observation des Condors", "Villages Traditionnels"],
      },
      puno: {
        name: "Puno",
        description: "Capitale du Folklore - Porte d'entrée du Lac Titicaca",
        duration: "6 heures",
        highlights: ["Lac Titicaca", "Îles Flottantes", "Textiles Traditionnels"],
      },
      cusco: {
        name: "Cusco",
        description: "Ville Impériale - Ancienne capitale de l'Empire Inca",
        duration: "8 heures",
        highlights: ["Accès à Machu Picchu", "Architecture Inca", "Vallée Sacrée"],
      },
    },
    busFeatures: {
      comfortableSeating: {
        title: "Sièges Confortables",
        description: "Sièges inclinables avec espace supplémentaire pour les jambes",
      },
      scenicRoutes: {
        title: "Routes Panoramiques",
        description: "Vues à couper le souffle sur les montagnes andines",
      },
      photoStops: {
        title: "Arrêts Photo",
        description: "Arrêts stratégiques aux points de vue",
      },
      flexibleSchedule: {
        title: "Horaire Flexible",
        description: "Plusieurs heures de départ quotidiennes",
      },
    },
    highlights: {
      colcaCanyon: {
        title: "Vues du Canyon de Colca",
        description:
          "Contemplez l'un des canyons les plus profonds du monde et observez les majestueux condors andins planer",
      },
      lakeTiticaca: {
        title: "Lac Titicaca",
        description: "Découvrez le lac navigable le plus haut du monde et visitez les célèbres îles flottantes",
      },
      incaHeritage: {
        title: "Héritage Inca",
        description: "Arrivez à Cusco, la porte d'entrée du Machu Picchu et le cœur de l'ancien Empire Inca",
      },
    },
  },
  de: {
    heroTitle: "Premium Destinationen",
    heroSubtitle: "Cabanaconde nach Cusco",
    heroDescription:
      "Entdecken Sie Perus spektakulärste Route mit unserem Luxus-Bus-Express-Service, der die außergewöhnlichsten Anden-Schätze verbindet",
    bookJourney: "Erfahrung Buchen",
    completeRoute: "Exklusive Route",
    routeDescription:
      "Ein sorgfältig kuratiertes Reiseerlebnis, das Premium-Komfort mit den atemberaubendsten Landschaften der peruanischen Anden verbindet",
    stop: "Ziel",
    fromStart: "vom Start",
    travelComfort: "Luxus in Bewegung",
    comfortDescription:
      "Unsere Premium-Busse sind darauf ausgelegt, das raffinierteste Reiseerlebnis durch die Anden zu bieten",
    unforgettableExperience: "Ein Außergewöhnliches",
    unforgettableAndean: "Anden-Erlebnis",
    planTrip: "Reise Planen",
    readyAdventure: "Bereit für ein Außergewöhnliches Abenteuer?",
    readyDescription:
      "Begleiten Sie uns auf einer Reise, die den Luxus-Anden-Transport neu definiert und entdecken Sie Peru wie nie zuvor",
    checkSchedules: "Fahrpläne Ansehen",
    contactUs: "Jetzt Anfragen",
    stops: {
      arequipa: {
        name: "Arequipa",
        description: "Ciudad Blanca - Ausgangspunkt Ihres Anden-Abenteuers",
        duration: "2 Stunden",
        highlights: ["Koloniale Architektur", "Kloster Santa Catalina", "Misti-Vulkan-Aussichten"],
      },
      cabanaconde: {
        name: "Cabanaconde",
        description: "Tor zum Colca-Canyon - Einer der tiefsten Canyons der Welt",
        duration: "4 Stunden",
        highlights: ["Colca-Canyon-Aussichten", "Kondor-Beobachtung", "Traditionelle Dörfer"],
      },
      puno: {
        name: "Puno",
        description: "Folklore-Hauptstadt - Tor zum Titicacasee",
        duration: "6 Stunden",
        highlights: ["Titicacasee", "Schwimmende Inseln", "Traditionelle Textilien"],
      },
      cusco: {
        name: "Cusco",
        description: "Kaiserstadt - Alte Hauptstadt des Inka-Reiches",
        duration: "8 Stunden",
        highlights: ["Machu Picchu Zugang", "Inka-Architektur", "Heiliges Tal"],
      },
    },
    busFeatures: {
      comfortableSeating: {
        title: "Bequeme Sitze",
        description: "Verstellbare Sitze mit extra Beinfreiheit",
      },
      scenicRoutes: {
        title: "Landschaftsrouten",
        description: "Atemberaubende Anden-Bergblicke",
      },
      photoStops: {
        title: "Foto-Stopps",
        description: "Strategische Stopps an Aussichtspunkten",
      },
      flexibleSchedule: {
        title: "Flexibler Fahrplan",
        description: "Mehrere tägliche Abfahrtszeiten",
      },
    },
    highlights: {
      colcaCanyon: {
        title: "Colca-Canyon-Aussichten",
        description: "Erleben Sie einen der tiefsten Canyons der Welt und beobachten Sie majestätische Anden-Kondore",
      },
      lakeTiticaca: {
        title: "Titicacasee",
        description:
          "Erleben Sie den höchsten schiffbaren See der Welt und besuchen Sie die berühmten schwimmenden Inseln",
      },
      incaHeritage: {
        title: "Inka-Erbe",
        description: "Kommen Sie in Cusco an, dem Tor zu Machu Picchu und dem Herzen des alten Inka-Reiches",
      },
    },
  },
  it: {
    heroTitle: "Destinazioni Premium",
    heroSubtitle: "Cabanaconde a Cusco",
    heroDescription:
      "Scopri la rotta più spettacolare del Perù con il nostro servizio di bus express di lusso, che collega i tesori andini più straordinari",
    bookJourney: "Prenota Esperienza",
    completeRoute: "Rotta Esclusiva",
    routeDescription:
      "Un'esperienza di viaggio meticolosamente curata che combina comfort premium con i paesaggi più mozzafiato delle Ande peruviane",
    stop: "Destinazione",
    fromStart: "dall'inizio",
    travelComfort: "Lusso in Movimento",
    comfortDescription:
      "I nostri bus premium sono progettati per offrire l'esperienza di viaggio più raffinata attraverso le Ande",
    unforgettableExperience: "Un'Esperienza",
    unforgettableAndean: "Andina Eccezionale",
    planTrip: "Pianifica Viaggio",
    readyAdventure: "Pronto per un'Avventura Straordinaria?",
    readyDescription:
      "Unisciti a noi in un viaggio che ridefinisce il trasporto andino di lusso e scopri il Perù come mai prima d'ora",
    checkSchedules: "Visualizza Orari",
    contactUs: "Richiedi Ora",
    stops: {
      arequipa: {
        name: "Arequipa",
        description: "Ciudad Blanca - Punto di partenza della tua avventura andina",
        duration: "2 ore",
        highlights: ["Architettura Coloniale", "Monastero di Santa Catalina", "Viste del Vulcano Misti"],
      },
      cabanaconde: {
        name: "Cabanaconde",
        description: "Porta d'accesso al Canyon di Colca - Uno dei canyon più profondi del mondo",
        duration: "4 ore",
        highlights: ["Viste del Canyon di Colca", "Osservazione dei Condor", "Villaggi Tradizionali"],
      },
      puno: {
        name: "Puno",
        description: "Capitale del Folklore - Porta d'accesso al Lago Titicaca",
        duration: "6 ore",
        highlights: ["Lago Titicaca", "Isole Galleggianti", "Tessuti Tradizionali"],
      },
      cusco: {
        name: "Cusco",
        description: "Città Imperiale - Antica capitale dell'Impero Inca",
        duration: "8 ore",
        highlights: ["Accesso a Machu Picchu", "Architettura Inca", "Valle Sacro"],
      },
    },
    busFeatures: {
      comfortableSeating: {
        title: "Sedili Confortevoli",
        description: "Sedili reclinabili con spazio extra per le gambe",
      },
      scenicRoutes: {
        title: "Percorsi Panoramici",
        description: "Viste mozzafiato delle montagne andine",
      },
      photoStops: {
        title: "Soste Fotografiche",
        description: "Soste strategiche ai punti panoramici",
      },
      flexibleSchedule: {
        title: "Orario Flessibile",
        description: "Molteplici orari di partenza giornalieri",
      },
    },
    highlights: {
      colcaCanyon: {
        title: "Viste del Canyon di Colca",
        description: "Ammira uno dei canyon più profondi del mondo e osserva i maestosi condor andini volare",
      },
      lakeTiticaca: {
        title: "Lago Titicaca",
        description: "Sperimenta il lago navigabile più alto del mondo e visita le famose isole galleggianti",
      },
      incaHeritage: {
        title: "Eredità Inca",
        description: "Arriva a Cusco, la porta d'accesso a Machu Picchu e il cuore dell'antico Impero Inca",
      },
    },
  },
}

export default function DestinationsPage() {
  const { language } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.es

  const routeStops = [
    {
      id: "arequipa",
      name: t.stops.arequipa.name,
      description: t.stops.arequipa.description,
      duration: t.stops.arequipa.duration,
      highlights: t.stops.arequipa.highlights,
      image: "/arequipa-peru-colonial-white-stone-architecture-pl.jpg",
    },
    {
      id: "cabanaconde",
      name: t.stops.cabanaconde.name,
      description: t.stops.cabanaconde.description,
      duration: t.stops.cabanaconde.duration,
      highlights: t.stops.cabanaconde.highlights,
      image: "/colca-canyon-peru-condors-flying-deep-canyon-lands.jpg",
    },
    {
      id: "puno",
      name: t.stops.puno.name,
      description: t.stops.puno.description,
      duration: t.stops.puno.duration,
      highlights: t.stops.puno.highlights,
      image: "/lake-titicaca-peru-floating-islands-traditional-bo.jpg",
    },
    {
      id: "cusco",
      name: t.stops.cusco.name,
      description: t.stops.cusco.description,
      duration: t.stops.cusco.duration,
      highlights: t.stops.cusco.highlights,
      image: "/cusco-peru-inca-stone-walls-colonial-architecture-.jpg",
    },
  ]

  const busFeatures = [
    {
      icon: Bus,
      title: t.busFeatures.comfortableSeating.title,
      description: t.busFeatures.comfortableSeating.description,
    },
    { icon: Mountain, title: t.busFeatures.scenicRoutes.title, description: t.busFeatures.scenicRoutes.description },
    { icon: Camera, title: t.busFeatures.photoStops.title, description: t.busFeatures.photoStops.description },
    {
      icon: Clock,
      title: t.busFeatures.flexibleSchedule.title,
      description: t.busFeatures.flexibleSchedule.description,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg"
            alt="Peru Andes Mountains Bus Route"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 text-balance leading-[0.9] tracking-tight">
            {t.heroTitle}
            <span className="block text-3xl md:text-5xl lg:text-6xl font-light mt-4 opacity-90">{t.heroSubtitle}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light mb-10 text-pretty max-w-3xl mx-auto leading-relaxed opacity-95">
            {t.heroDescription}
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-lg font-medium rounded-full"
          >
            {t.bookJourney}
          </Button>
        </div>
      </section>

      {/* Route Overview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-8 text-foreground tracking-tight">
              {t.completeRoute}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
              {t.routeDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {routeStops.map((stop, index) => (
              <Card
                key={stop.id}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-card/50 backdrop-blur-sm"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={stop.image || "/placeholder.svg"}
                    alt={stop.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge variant="secondary" className="bg-white/95 text-foreground font-medium px-3 py-1">
                      {t.stop} {index + 1}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-light text-foreground">{stop.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{stop.description}</p>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">
                      {stop.duration} {t.fromStart}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stop.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Star className="h-3 w-3 text-accent fill-current" />
                        <span className="text-sm text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bus Features */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-8 text-foreground tracking-tight">
              {t.travelComfort}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {t.comfortDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {busFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-105">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-light mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Highlights */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-10 text-foreground text-balance tracking-tight leading-tight">
                {t.unforgettableExperience}
                <span className="block">{t.unforgettableAndean}</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-light mb-3 text-foreground">{t.highlights.colcaCanyon.title}</h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {t.highlights.colcaCanyon.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-light mb-3 text-foreground">{t.highlights.lakeTiticaca.title}</h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {t.highlights.lakeTiticaca.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-light mb-3 text-foreground">{t.highlights.incaHeritage.title}</h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {t.highlights.incaHeritage.description}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full"
              >
                {t.planTrip}
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/peru-andes-mountains-traditional-llamas-machu-picc.jpg"
                alt="Peru Andes landscape with traditional llamas"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-8 text-balance tracking-tight">
            {t.readyAdventure}
          </h2>
          <p className="text-lg md:text-xl mb-10 text-pretty opacity-95 max-w-3xl mx-auto leading-relaxed">
            {t.readyDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="px-10 py-4 text-lg font-medium rounded-full">
              {t.checkSchedules}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg font-medium rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              {t.contactUs}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
