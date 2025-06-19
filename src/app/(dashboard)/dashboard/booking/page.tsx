"use client"

import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  User,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Star,
  Phone,
  Mail,
  Mountain,
  Shield,
  X,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
// Tipos basados en el DTO del backend
type TourType = "Premium" | "Clásico" | "Básico"
type Difficulty = "Fácil" | "Moderado" | "Difícil"
type ReservaStatus = "confirmada" | "pendiente" | "cancelada" | "completada"

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals?: string[]
  accommodation?: string
  imageUrl?: string
}

interface TransportOption {
  type: TourType
  vehicle: string
  services: string[]
}

interface RoutePoint {
  location: string
  description?: string
  imageUrl?: string
}

interface RouteOption {
  type: TourType
  path: RoutePoint[]
  duration: string
}

interface Tour {
  id: string
  title: string
  subtitle: string
  image: string
  price: number
  priceGroup?: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  difficulty: Difficulty
  highlights: string[]
  nextDeparture: string
  featured?: boolean
  tourType: TourType
  transportOptions: TransportOption[]
  routeOptions: RouteOption[]
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
}

interface Reserva {
  id: string
  cliente: string
  email: string
  telefono: string
  avatar?: string
  fechaInicio: string
  fechaFin: string
  personas: number
  estado: ReservaStatus
  tour: Tour
  createdAt: string
  notas?: string
}

// Datos de prueba completos basados en el DTO
const toursData: Tour[] = [
  {
    id: "T001",
    title: "Europa Clásica Premium",
    subtitle: "Descubre los tesoros de París, Roma y Barcelona",
    image: "/placeholder.svg?height=300&width=400&text=Europa+Clásica",
    price: 3200,
    originalPrice: 3800,
    priceGroup: 2800,
    duration: "10 días",
    rating: 4.8,
    reviews: 156,
    location: "París",
    region: "Europa",
    category: "Cultural",
    difficulty: "Fácil",
    highlights: ["Torre Eiffel", "Coliseo Romano", "Sagrada Familia", "Louvre", "Vaticano"],
    nextDeparture: "2025-06-15",
    featured: true,
    tourType: "Premium",
    transportOptions: [
      {
        type: "Premium",
        vehicle: "Vuelo directo + Bus de lujo",
        services: ["WiFi", "Aire acondicionado", "Guía bilingüe", "Snacks incluidos"],
      },
    ],
    routeOptions: [
      {
        type: "Premium",
        path: [
          {
            location: "París",
            description: "Ciudad de la luz",
            imageUrl: "/placeholder.svg?height=200&width=300&text=París",
          },
          {
            location: "Roma",
            description: "Ciudad eterna",
            imageUrl: "/placeholder.svg?height=200&width=300&text=Roma",
          },
          {
            location: "Barcelona",
            description: "Arquitectura modernista",
            imageUrl: "/placeholder.svg?height=200&width=300&text=Barcelona",
          },
        ],
        duration: "10 días",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada a París",
        description: "Recepción en el aeropuerto y traslado al hotel",
        activities: ["Check-in hotel", "Cena de bienvenida", "Paseo nocturno por el Sena"],
        meals: ["Cena"],
        accommodation: "Hotel Le Marais 4*",
      },
      {
        day: 2,
        title: "París - Día completo",
        description: "Visita a los principales monumentos",
        activities: ["Torre Eiffel", "Museo del Louvre", "Campos Elíseos"],
        meals: ["Desayuno", "Almuerzo", "Cena"],
        accommodation: "Hotel Le Marais 4*",
      },
    ],
    includes: ["Vuelos", "Hoteles 4*", "Desayunos", "Guía especializado", "Entradas a museos"],
    notIncludes: ["Almuerzos", "Cenas", "Propinas", "Gastos personales"],
    toBring: ["Pasaporte vigente", "Ropa cómoda", "Cámara fotográfica", "Adaptador europeo"],
    conditions: ["Mínimo 2 personas", "Cancelación 15 días antes", "Seguro de viaje incluido"],
  },
  {
    id: "T002",
    title: "Caribe All Inclusive",
    subtitle: "Relájate en las mejores playas del Caribe mexicano",
    image: "/placeholder.svg?height=300&width=400&text=Caribe+Paradise",
    price: 2800,
    originalPrice: 3200,
    duration: "7 días",
    rating: 4.9,
    reviews: 203,
    location: "Cancún",
    region: "Caribe",
    category: "Playa",
    difficulty: "Fácil",
    highlights: ["Playa privada", "Snorkel en cenotes", "Chichen Itzá", "Tulum", "Cozumel"],
    nextDeparture: "2025-06-20",
    featured: true,
    tourType: "Premium",
    transportOptions: [
      {
        type: "Premium",
        vehicle: "Vuelo + Transfer privado",
        services: ["Transfer VIP", "Bebidas de cortesía", "Asistente personal"],
      },
    ],
    routeOptions: [
      {
        type: "Premium",
        path: [
          { location: "Cancún", description: "Resort todo incluido" },
          { location: "Chichen Itzá", description: "Maravilla del mundo" },
          { location: "Tulum", description: "Ruinas frente al mar" },
        ],
        duration: "7 días",
      },
    ],
    includes: ["Vuelos", "Resort 5* All Inclusive", "Excursiones", "Transfers"],
    notIncludes: ["Propinas", "Spa", "Actividades premium"],
    toBring: ["Traje de baño", "Protector solar", "Ropa ligera", "Cámara acuática"],
  },
  {
    id: "T003",
    title: "Aventura Patagonia",
    subtitle: "Trekking y naturaleza en el fin del mundo",
    image: "/placeholder.svg?height=300&width=400&text=Patagonia+Adventure",
    price: 1950,
    duration: "8 días",
    rating: 4.7,
    reviews: 89,
    location: "Bariloche",
    region: "Patagonia",
    category: "Aventura",
    difficulty: "Moderado",
    highlights: ["Cerro Catedral", "Lago Nahuel Huapi", "Trekking", "Rafting", "Avistaje fauna"],
    nextDeparture: "2025-06-18",
    tourType: "Clásico",
    transportOptions: [
      {
        type: "Clásico",
        vehicle: "Bus turístico",
        services: ["Aire acondicionado", "Guía especializado"],
      },
    ],
    routeOptions: [
      {
        type: "Clásico",
        path: [
          { location: "Bariloche", description: "Base de operaciones" },
          { location: "Cerro Catedral", description: "Trekking y vistas" },
          { location: "Villa La Angostura", description: "Pueblo pintoresco" },
        ],
        duration: "8 días",
      },
    ],
    includes: ["Transporte", "Alojamiento", "Guía", "Equipamiento trekking"],
    notIncludes: ["Comidas", "Seguro aventura", "Equipo personal"],
  },
  {
    id: "T004",
    title: "Mendoza Wine Experience",
    subtitle: "Cata de vinos en las mejores bodegas",
    image: "/placeholder.svg?height=300&width=400&text=Mendoza+Wine",
    price: 1200,
    duration: "4 días",
    rating: 4.6,
    reviews: 124,
    location: "Mendoza",
    region: "Argentina",
    category: "Gastronómico",
    difficulty: "Fácil",
    highlights: ["Cata de vinos", "Bodegas premium", "Aconcagua", "Gastronomía local"],
    nextDeparture: "2025-06-22",
    tourType: "Básico",
    transportOptions: [
      {
        type: "Básico",
        vehicle: "Minibus",
        services: ["Aire acondicionado", "Guía local"],
      },
    ],
    routeOptions: [
      {
        type: "Básico",
        path: [
          { location: "Mendoza", description: "Capital del vino" },
          { location: "Maipú", description: "Ruta del vino" },
          { location: "Luján de Cuyo", description: "Bodegas premium" },
        ],
        duration: "4 días",
      },
    ],
    includes: ["Transporte", "Catas", "Almuerzos", "Guía especializado"],
    notIncludes: ["Alojamiento", "Cenas", "Compras personales"],
  },
]

// Reservas de prueba con múltiples reservas por día
const reservasData: Reserva[] = [
  // 15 de junio - 3 reservas
  {
    id: "R001",
    cliente: "María González",
    email: "maria.gonzalez@email.com",
    telefono: "+54 11 1234-5678",
    avatar: "/placeholder.svg?height=40&width=40&text=MG",
    fechaInicio: "2025-06-15",
    fechaFin: "2025-06-25",
    personas: 2,
    estado: "confirmada",
    tour: toursData[0],
    createdAt: "2025-05-14",
    notas: "Aniversario de bodas, solicita habitación con vista",
  },
  {
    id: "R002",
    cliente: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+54 11 2345-6789",
    avatar: "/placeholder.svg?height=40&width=40&text=CR",
    fechaInicio: "2025-06-15",
    fechaFin: "2025-06-19",
    personas: 1,
    estado: "pendiente",
    tour: toursData[3],
    createdAt: "2025-05-13",
    notas: "Viajero solo, interesado en tours gastronómicos",
  },
  {
    id: "R003",
    cliente: "Ana Martínez",
    email: "ana.martinez@email.com",
    telefono: "+54 11 3456-7890",
    avatar: "/placeholder.svg?height=40&width=40&text=AM",
    fechaInicio: "2025-06-15",
    fechaFin: "2025-06-22",
    personas: 3,
    estado: "confirmada",
    tour: toursData[2],
    createdAt: "2025-05-12",
    notas: "Grupo de amigas, experiencia en trekking",
  },
  // 18 de junio - 4 reservas
  {
    id: "R004",
    cliente: "Luis Fernández",
    email: "luis.fernandez@email.com",
    telefono: "+54 11 4567-8901",
    avatar: "/placeholder.svg?height=40&width=40&text=LF",
    fechaInicio: "2025-06-18",
    fechaFin: "2025-06-25",
    personas: 2,
    estado: "confirmada",
    tour: toursData[1],
    createdAt: "2025-05-11",
    notas: "Luna de miel, solicita servicios especiales",
  },
  {
    id: "R005",
    cliente: "Sofia López",
    email: "sofia.lopez@email.com",
    telefono: "+54 11 5678-9012",
    avatar: "/placeholder.svg?height=40&width=40&text=SL",
    fechaInicio: "2025-06-18",
    fechaFin: "2025-06-25",
    personas: 4,
    estado: "pendiente",
    tour: toursData[2],
    createdAt: "2025-05-10",
    notas: "Familia con 2 niños, necesita habitaciones conectadas",
  },
  {
    id: "R006",
    cliente: "Roberto Silva",
    email: "roberto.silva@email.com",
    telefono: "+54 11 6789-0123",
    avatar: "/placeholder.svg?height=40&width=40&text=RS",
    fechaInicio: "2025-06-18",
    fechaFin: "2025-06-28",
    personas: 1,
    estado: "confirmada",
    tour: toursData[0],
    createdAt: "2025-05-09",
    notas: "Viajero frecuente, solicita upgrade",
  },
  {
    id: "R007",
    cliente: "Carmen Díaz",
    email: "carmen.diaz@email.com",
    telefono: "+54 11 7890-1234",
    avatar: "/placeholder.svg?height=40&width=40&text=CD",
    fechaInicio: "2025-06-18",
    fechaFin: "2025-06-22",
    personas: 2,
    estado: "cancelada",
    tour: toursData[3],
    createdAt: "2025-05-08",
    notas: "Cancelado por motivos de salud",
  },
  // 20 de junio - 2 reservas
  {
    id: "R008",
    cliente: "Miguel Torres",
    email: "miguel.torres@email.com",
    telefono: "+54 11 8901-2345",
    avatar: "/placeholder.svg?height=40&width=40&text=MT",
    fechaInicio: "2025-06-20",
    fechaFin: "2025-06-27",
    personas: 2,
    estado: "confirmada",
    tour: toursData[1],
    createdAt: "2025-05-15",
    notas: "Aniversario, solicita mesa especial en restaurantes",
  },
  {
    id: "R009",
    cliente: "Patricia Ruiz",
    email: "patricia.ruiz@email.com",
    telefono: "+54 11 9012-3456",
    avatar: "/placeholder.svg?height=40&width=40&text=PR",
    fechaInicio: "2025-06-20",
    fechaFin: "2025-06-24",
    personas: 1,
    estado: "pendiente",
    tour: toursData[3],
    createdAt: "2025-05-07",
    notas: "Primera vez en Mendoza, muy entusiasmada",
  },
  // 22 de junio - 3 reservas
  {
    id: "R010",
    cliente: "Diego Morales",
    email: "diego.morales@email.com",
    telefono: "+54 11 0123-4567",
    avatar: "/placeholder.svg?height=40&width=40&text=DM",
    fechaInicio: "2025-06-22",
    fechaFin: "2025-06-29",
    personas: 3,
    estado: "confirmada",
    tour: toursData[2],
    createdAt: "2025-05-06",
    notas: "Grupo de trabajo, team building",
  },
  {
    id: "R011",
    cliente: "Valentina Castro",
    email: "valentina.castro@email.com",
    telefono: "+54 11 1234-5679",
    avatar: "/placeholder.svg?height=40&width=40&text=VC",
    fechaInicio: "2025-06-22",
    fechaFin: "2025-07-02",
    personas: 2,
    estado: "confirmada",
    tour: toursData[0],
    createdAt: "2025-05-05",
    notas: "Graduación universitaria, regalo de padres",
  },
  {
    id: "R012",
    cliente: "Fernando Vega",
    email: "fernando.vega@email.com",
    telefono: "+54 11 2345-6780",
    avatar: "/placeholder.svg?height=40&width=40&text=FV",
    fechaInicio: "2025-06-22",
    fechaFin: "2025-06-26",
    personas: 1,
    estado: "completada",
    tour: toursData[3],
    createdAt: "2025-04-20",
    notas: "Tour completado, excelente experiencia",
  },
  // Reservas adicionales distribuidas
  {
    id: "R013",
    cliente: "Isabella Herrera",
    email: "isabella.herrera@email.com",
    telefono: "+54 11 3456-7891",
    avatar: "/placeholder.svg?height=40&width=40&text=IH",
    fechaInicio: "2025-06-25",
    fechaFin: "2025-07-05",
    personas: 2,
    estado: "pendiente",
    tour: toursData[0],
    createdAt: "2025-05-04",
    notas: "Solicita información sobre extensión del tour",
  },
  {
    id: "R014",
    cliente: "Alejandro Paz",
    email: "alejandro.paz@email.com",
    telefono: "+54 11 4567-8902",
    avatar: "/placeholder.svg?height=40&width=40&text=AP",
    fechaInicio: "2025-06-28",
    fechaFin: "2025-07-05",
    personas: 4,
    estado: "confirmada",
    tour: toursData[1],
    createdAt: "2025-05-03",
    notas: "Familia numerosa, necesita descuentos grupales",
  },
]

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export default function ReservasPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 14)) // 14 de junio 2025
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null)
  const [showAllReservas, setShowAllReservas] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Obtener primer día del mes y días en el mes
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generar días del calendario
  const calendarDays = []

  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Función para obtener reservas de un día específico
  const getReservasForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return reservasData.filter((reserva) => {
      const inicio = new Date(reserva.fechaInicio)
      const fin = new Date(reserva.fechaFin)
      const currentDay = new Date(dateStr)
      return currentDay >= inicio && currentDay <= fin
    })
  }

  // Función para obtener color según estado
  const getEstadoColor = (estado: ReservaStatus) => {
    switch (estado) {
      case "confirmada":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
      case "pendiente":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      case "cancelada":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      case "completada":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }
  }

  // Función para obtener color según tipo de tour
  const getTourTypeColor = (type: TourType) => {
    switch (type) {
      case "Premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "Clásico":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "Básico":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyIcon = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Fácil":
        return <Shield className="h-3 w-3 text-green-600" />
      case "Moderado":
        return <Mountain className="h-3 w-3 text-yellow-600" />
      case "Difícil":
        return <Mountain className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Estadísticas del mes actual
  const reservasDelMes = reservasData.filter((reserva) => {
    const reservaDate = new Date(reserva.fechaInicio)
    return reservaDate.getMonth() === month && reservaDate.getFullYear() === year
  })

  const confirmadas = reservasDelMes.filter((r) => r.estado === "confirmada").length
  const pendientes = reservasDelMes.filter((r) => r.estado === "pendiente").length
  const completadas = reservasDelMes.filter((r) => r.estado === "completada").length
  const ingresosMes = reservasDelMes.reduce((sum, r) => sum + r.tour.price * r.personas, 0)

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
                <BreadcrumbPage>Calendario de Reservas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Estadísticas del mes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas del Mes</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservasDelMes.length}</div>
              <p className="text-xs text-muted-foreground">
                {meses[month]} {year}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{confirmadas}</div>
              <p className="text-xs text-muted-foreground">+{completadas} completadas</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendientes}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ingresosMes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Proyectado del mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendario */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Calendario de Reservas</CardTitle>
                  <CardDescription className="text-base">
                    {meses[month]} {year}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="ml-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Reserva
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Encabezados de días */}
              <div className="grid grid-cols-7 border-b">
                {diasSemana.map((dia) => (
                  <div key={dia} className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted/30">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Días del calendario */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-36 border-r border-b bg-muted/10"></div>
                  }

                  const reservasDelDia = getReservasForDay(day)
                  const isToday = new Date(2025, 5, 14).toDateString() === new Date(year, month, day).toDateString()
                  const maxVisible = 2

                  return (
                    <div
                      key={day}
                      className={cn(
                        "h-36 border-r border-b p-2 hover:bg-muted/30 transition-colors relative",
                        isToday && "bg-blue-50 border-blue-200",
                      )}
                    >
                      <div className={cn("text-sm font-semibold mb-2", isToday ? "text-blue-600" : "text-foreground")}>
                        {day}
                        {isToday && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block ml-1"></div>}
                      </div>

                      {reservasDelDia.length > 0 && (
                        <ScrollArea className="h-24">
                          <div className="space-y-1">
                            {/* Mostrar reservas visibles */}
                            {reservasDelDia.slice(0, maxVisible).map((reserva) => (
                              <div
                                key={reserva.id}
                                className={cn(
                                  "text-xs p-1.5 rounded-md border cursor-pointer transition-all hover:shadow-sm",
                                  getEstadoColor(reserva.estado),
                                )}
                                onClick={() => setSelectedReserva(reserva)}
                              >
                                <div className="flex items-center gap-1.5 mb-1">
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full flex-shrink-0",
                                      getTourTypeColor(reserva.tour.tourType),
                                    )}
                                  ></div>
                                  <span className="font-medium truncate text-xs">{reserva.cliente}</span>
                                </div>
                                <div className="truncate text-muted-foreground text-xs">{reserva.tour.title}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Users className="h-3 w-3" />
                                  <span className="text-xs">{reserva.personas}</span>
                                  {getDifficultyIcon(reserva.tour.difficulty)}
                                </div>
                              </div>
                            ))}

                            {/* Botón para mostrar más reservas */}
                            {reservasDelDia.length > maxVisible && (
                              <div
                                className="text-xs text-center text-muted-foreground py-1.5 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"
                                onClick={() => setShowAllReservas(showAllReservas === day ? null : day)}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                                <span>+{reservasDelDia.length - maxVisible} más</span>
                              </div>
                            )}

                            {/* Mostrar todas las reservas si está expandido */}
                            {showAllReservas === day && reservasDelDia.length > maxVisible && (
                              <div className="space-y-1 mt-1 border-t pt-1">
                                {reservasDelDia.slice(maxVisible).map((reserva) => (
                                  <div
                                    key={reserva.id}
                                    className={cn(
                                      "text-xs p-1.5 rounded-md border cursor-pointer transition-all hover:shadow-sm",
                                      getEstadoColor(reserva.estado),
                                    )}
                                    onClick={() => setSelectedReserva(reserva)}
                                  >
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <div
                                        className={cn(
                                          "w-2 h-2 rounded-full flex-shrink-0",
                                          getTourTypeColor(reserva.tour.tourType),
                                        )}
                                      ></div>
                                      <span className="font-medium truncate text-xs">{reserva.cliente}</span>
                                    </div>
                                    <div className="truncate text-muted-foreground text-xs">{reserva.tour.title}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Users className="h-3 w-3" />
                                      <span className="text-xs">{reserva.personas}</span>
                                      {getDifficultyIcon(reserva.tour.difficulty)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Panel de detalles */}
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detalles de Reserva</CardTitle>
                  <CardDescription>
                    {selectedReserva ? "Información completa" : "Selecciona una reserva"}
                  </CardDescription>
                </div>
                {selectedReserva && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReserva(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedReserva ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Header del cliente */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedReserva.avatar || "/placeholder.svg"} alt={selectedReserva.cliente} />
                        <AvatarFallback>
                          {selectedReserva.cliente
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedReserva.cliente}</h3>
                        <Badge className={cn("text-xs", getEstadoColor(selectedReserva.estado))}>
                          {selectedReserva.estado.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Información del tour */}
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
  <Image
    src={selectedReserva.tour.image || "/placeholder.svg"}
    alt={selectedReserva.tour.title}
    fill
    className="object-cover"
  />
</div>
                        <div
                          className={cn(
                            "absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white",
                            getTourTypeColor(selectedReserva.tour.tourType),
                          )}
                        >
                          {selectedReserva.tour.tourType}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-base mb-1">{selectedReserva.tour.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{selectedReserva.tour.subtitle}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{selectedReserva.tour.rating}</span>
                            <span className="text-muted-foreground">({selectedReserva.tour.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedReserva.tour.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalles de la reserva */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Fechas</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedReserva.fechaInicio} - {selectedReserva.fechaFin}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{selectedReserva.personas} personas</p>
                            <p className="text-xs text-muted-foreground">{selectedReserva.tour.duration}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              ${(selectedReserva.tour.price * selectedReserva.personas).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${selectedReserva.tour.price} x {selectedReserva.personas}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getDifficultyIcon(selectedReserva.tour.difficulty)}
                          <div>
                            <p className="font-medium text-sm">{selectedReserva.tour.difficulty}</p>
                            <p className="text-xs text-muted-foreground">{selectedReserva.tour.category}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Contacto</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedReserva.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedReserva.telefono}</span>
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <p className="font-medium text-sm mb-2">Highlights del Tour</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedReserva.tour.highlights.slice(0, 5).map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Servicios incluidos */}
                    {selectedReserva.tour.includes && (
                      <div>
                        <p className="font-medium text-sm mb-2">Incluye</p>
                        <div className="space-y-1">
                          {selectedReserva.tour.includes.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    {selectedReserva.notas && (
                      <div>
                        <p className="font-medium text-sm mb-2">Notas</p>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{selectedReserva.notas}</p>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        Ver Completo
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Selecciona una reserva</p>
                  <p className="text-sm">
                    Haz clic en cualquier reserva del calendario para ver sus detalles completos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
