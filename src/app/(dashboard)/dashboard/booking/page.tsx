"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  User,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Phone,
  Mail,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import type { Order, OrdersQueryParams } from "@/types/order"
import { getOrders, deleteOrder } from "@/lib/orders-api"
import { OrderFormDialog } from "@/components/booking/order-form-dialog"
import Image from "next/image"
import { OrderEditDialog } from "@/components/booking/order-edit-dialog"

// Función helper para formatear precios de forma segura
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0"
  }
  return price.toLocaleString()
}

// Función helper para obtener precio seguro
const getSafePrice = (price: number | undefined | null): number => {
  if (price === undefined || price === null || isNaN(price)) {
    return 0
  }
  return price
}

export default function ReservasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, ] = useState(1)
  const [, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: OrdersQueryParams = {
        page: currentPage,
        limit: 100,
      }

      if (searchTerm) params.search = searchTerm
      if (statusFilter && statusFilter !== "all") params.status = statusFilter

      console.log("Fetching orders with params:", params) // Debug

      const response = await getOrders(params)

      console.log("Orders response:", response) // Debug

      // Verificar que la respuesta tenga la estructura esperada
      if (response && response.data && Array.isArray(response.data)) {
        setOrders(response.data)
        console.log("Orders set:", response.data.length) // Debug

        // Verificar que meta existe antes de acceder a sus propiedades
        if (response.meta) {
          setTotalPages(response.meta.totalPages || 1)
          setTotalOrders(response.meta.total || 0)
        } else {
          setTotalPages(1)
          setTotalOrders(response.data.length)
        }
      } else {
        // Si la respuesta no tiene la estructura esperada, establecer valores por defecto
        console.warn("Respuesta inesperada de la API:", response)
        setOrders([])
        setTotalPages(1)
        setTotalOrders(0)
        setError(response.message || "Formato de respuesta inesperado")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Error al cargar las reservas")
      if (error instanceof Error && error.message.includes("tours")) {
        setError("Error al cargar las reservas. El servidor devolvió tours en lugar de órdenes.")
      }
      toast.error("Error al cargar las reservas")
      // Set empty data on error to prevent crashes
      setOrders([])
      setTotalPages(1)
      setTotalOrders(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return

    try {
      await deleteOrder(orderId)
      toast.success("Reserva eliminada exitosamente")
      fetchOrders()
    } catch {
      toast.error("Error al eliminar la reserva")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500"
      case "created":
        return "bg-amber-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "created":
        return "Creada"
      case "cancelled":
        return "Cancelada"
      case "completed":
        return "Completada"
      default:
        return status
    }
  }

  // Funciones del calendario
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtener órdenes para un día específico
  const getOrdersForDay = (day: Date) => {
    return orders.filter((order) => {
      try {
        if (!order.startDate) return false
        return isSameDay(new Date(order.startDate), day)
      } catch {
        return false
      }
    })
  }

  // Navegación del calendario
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  // Estadísticas - con verificaciones de seguridad para precios
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length
  const createdOrders = orders.filter((o) => o.status === "created").length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const totalRevenue = orders.reduce((sum, order) => {
    const price = getSafePrice(order.totalPrice)
    return sum + price
  }, 0)

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
                  <BreadcrumbPage>Reservas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando reservas...</p>
          </div>
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
                <BreadcrumbPage>Reservas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Error Alert - Mejorado */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-red-800">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2">❌ Problema del Backend Detectado</h4>
                  <p className="text-sm mb-3">{error}</p>

                  {error.includes("tours") && (
                    <div className="bg-red-100 p-3 rounded-lg text-xs space-y-2">
                      <p>
                        <strong>🔍 Diagnóstico:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          El endpoint <code>/orders</code> está devolviendo datos de tours
                        </li>
                        <li>Debería devolver datos de órdenes/reservas</li>
                        <li>Verificar la configuración del controlador en el backend</li>
                      </ul>

                      <p>
                        <strong>🛠️ Solución requerida en el backend:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          Verificar que <code>GET /orders</code> llame al controlador correcto
                        </li>
                        <li>
                          Asegurar que devuelva órdenes con estructura:{" "}
                          <code>{`{customer, items, totalPrice, status}`}</code>
                        </li>
                        <li>
                          No debe devolver tours con estructura: <code>{`{title, subtitle, price, duration}`}</code>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchOrders}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reintentar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Reservas</CardTitle>
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">{format(currentDate, "MMM yyyy", { locale: es })}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Confirmadas</CardTitle>
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-emerald-600">{confirmedOrders}</div>
              <p className="text-xs text-muted-foreground">+{completedOrders} completadas</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-amber-600">{createdOrders}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">S/{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Total actual</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Calendario/Lista principal */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Calendario de Reservas</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {format(currentDate, "MMMM yyyy", { locale: es })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center border rounded-lg flex-1 sm:flex-none">
                      <Button
                        variant={viewMode === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                        className="rounded-r-none flex-1 sm:flex-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                        <span className="ml-1 sm:hidden">Cal</span>
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none flex-1 sm:flex-none"
                      >
                        <List className="h-4 w-4" />
                        <span className="ml-1 sm:hidden">Lista</span>
                      </Button>
                    </div>
                    <OrderFormDialog onOrderCreated={fetchOrders} />
                  </div>
                </div>

                {/* Controles del calendario */}
                {viewMode === "calendar" && (
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Anterior</span>
                    </Button>
                    <h3 className="text-base sm:text-lg font-semibold capitalize">
                      {format(currentDate, "MMMM yyyy", { locale: es })}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <span className="mr-1 hidden sm:inline">Siguiente</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Filtros para vista lista */}
                {viewMode === "list" && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por cliente, tour..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="created">Creadas</SelectItem>
                        <SelectItem value="confirmed">Confirmadas</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {viewMode === "calendar" ? (
                // Vista de Calendario
                <div className="p-3 sm:p-6">
                  {/* Encabezados de días */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                      <div
                        key={day}
                        className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-muted-foreground"
                      >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Días del calendario */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const dayOrders = getOrdersForDay(day)
                      const isCurrentDay = isToday(day)
                      const dayKey = day.toISOString()
                      const isExpanded = expandedDay === dayKey
                      const maxVisible = 2

                      return (
                        <div
                          key={dayKey}
                          className={cn(
                            "min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg hover:bg-muted/30 transition-colors",
                            isCurrentDay && "bg-blue-50 border-blue-200",
                          )}
                        >
                          <div
                            className={cn(
                              "text-xs sm:text-sm font-semibold mb-1 sm:mb-2",
                              isCurrentDay ? "text-blue-600" : "text-foreground",
                            )}
                          >
                            {format(day, "d")}
                            {isCurrentDay && (
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full inline-block ml-1"></div>
                            )}
                          </div>

                          <div className="space-y-1">
                            {/* Mostrar órdenes visibles */}
                            {(isExpanded ? dayOrders : dayOrders.slice(0, maxVisible)).map((order) => (
                              <div
                                key={order._id}
                                className="text-xs p-1 sm:p-1.5 rounded cursor-pointer hover:shadow-sm transition-shadow group relative"
                                style={{ backgroundColor: `${getStatusColor(order.status)}20` }}
                                onClick={() => setSelectedOrder(order)}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <div
                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                  ></div>
                                  <span className="font-medium truncate text-xs">
                                    {order.customer?.fullName || "Cliente"}
                                  </span>
                                </div>
                                <div className="truncate text-muted-foreground text-xs">
                                  {order.tour?.title || "Tour no disponible"}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  <span className="text-xs">{order.people || 0}</span>
                                  <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
                                  <span className="text-xs">S/{formatPrice(order.totalPrice)}</span>
                                </div>

                                {/* Botón de editar en hover - Solo visible en hover */}
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <OrderEditDialog
                                    order={order}
                                    onOrderUpdated={fetchOrders}
                                    trigger={
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 bg-white/90 hover:bg-white shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    }
                                  />
                                </div>
                              </div>
                            ))}

                            {/* Botón para mostrar más órdenes */}
                            {dayOrders.length > maxVisible && (
                              <div
                                className="text-xs text-center text-muted-foreground py-1 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"
                                onClick={() => setExpandedDay(isExpanded ? null : dayKey)}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                                <span>{isExpanded ? "Menos" : `+${dayOrders.length - maxVisible} más`}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Mensaje si no hay órdenes */}
                  {orders.length === 0 && !loading && !error && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium mb-1">No hay reservas este mes</p>
                      <p className="text-xs">Las reservas aparecerán aquí cuando se creen</p>
                    </div>
                  )}

                  {/* Mensaje si hay error del backend */}
                  {orders.length === 0 && !loading && error && (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-red-400" />
                      <p className="text-sm font-medium mb-1">No se pueden cargar las reservas</p>
                      <p className="text-xs">Problema del backend detectado</p>
                      <Button variant="outline" size="sm" onClick={fetchOrders} className="mt-3">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reintentar
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Vista de Lista
                <ScrollArea className="h-[400px] sm:h-[600px]">
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        {error ? (
                          <div className="text-muted-foreground">
                            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-red-400" />
                            <p className="text-sm font-medium mb-1">No se pueden cargar las reservas</p>
                            <p className="text-xs">Problema del backend detectado</p>
                            <Button variant="outline" size="sm" onClick={fetchOrders} className="mt-3">
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reintentar
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No hay reservas disponibles</p>
                        )}
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card
                          key={order._id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0">
                                <Image
                                  src={order.tour?.imageUrl || "/placeholder.svg?height=64&width=64&text=Tour"}
                                  alt={order.tour?.title || "Tour"}
                                  fill
                                  sizes="64px"
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-sm sm:text-base">
                                      {order.customer?.fullName || "Cliente"}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      {order.tour?.title || "Tour no disponible"}
                                    </p>
                                  </div>
                                  <Badge
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${getStatusColor(order.status)}20`,
                                      color: getStatusColor(order.status),
                                      borderColor: getStatusColor(order.status),
                                    }}
                                  >
                                    {getStatusText(order.status)}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                    <span>
                                      {order.startDate
                                        ? format(new Date(order.startDate), "dd/MM", { locale: es })
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-muted-foreground" />
                                    <span>{order.people || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span>S/{formatPrice(order.totalPrice)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="truncate">{order.tour?.region || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <OrderEditDialog
                                order={order}
                                onOrderUpdated={fetchOrders}
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteOrder(order._id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Panel de detalles - Responsive */}
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg">Detalles</CardTitle>
                  <CardDescription className="text-sm">
                    {selectedOrder ? "Información completa" : "Selecciona una reserva"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <ScrollArea className="h-[300px] sm:h-[500px] pr-4">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Header del cliente */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarFallback className="text-xs sm:text-sm">
                          {(selectedOrder.customer?.fullName || "C")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {selectedOrder.customer?.fullName || "Cliente"}
                        </h3>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                            color: getStatusColor(selectedOrder.status),
                            borderColor: getStatusColor(selectedOrder.status),
                          }}
                        >
                          {getStatusText(selectedOrder.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Información del tour */}
                    {selectedOrder.tour && (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="relative w-full h-20 sm:h-24">
                          <Image
                            src={selectedOrder.tour.imageUrl || "/placeholder.svg?height=96&width=200&text=Tour"}
                            alt={selectedOrder.tour.title}
                            fill
                            sizes="200px"
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm mb-1">{selectedOrder.tour.title}</h4>
                          {selectedOrder.tour.subtitle && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {selectedOrder.tour.subtitle}
                            </p>
                          )}
                          <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span>{selectedOrder.tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span>{selectedOrder.tour.region}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span>Precio base: S/{formatPrice(selectedOrder.tour.price)}</span>
                            </div>
                            {selectedOrder.tour.category && (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Categoría:</span>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedOrder.tour.category}
                                </Badge>
                              </div>
                            )}
                            {selectedOrder.tour.difficulty && (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Dificultad:</span>
                                <Badge variant="outline" className="text-xs">
                                  {selectedOrder.tour.difficulty}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Highlights del tour */}
                        {selectedOrder.tour.highlights && selectedOrder.tour.highlights.length > 0 && (
                          <div className="space-y-1">
                            <h6 className="font-medium text-xs text-muted-foreground">DESTACADOS</h6>
                            <ul className="text-xs space-y-1">
                              {selectedOrder.tour.highlights.slice(0, 3).map((highlight, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-green-500 mt-0.5">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Información de la reserva */}
                    <div className="space-y-2 sm:space-y-3 border-t pt-2 sm:pt-3">
                      <h5 className="font-semibold text-xs sm:text-sm text-muted-foreground">DETALLES DE LA RESERVA</h5>

                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-xs sm:text-sm">Fecha de inicio</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedOrder.startDate
                                ? format(new Date(selectedOrder.startDate), "PPP", { locale: es })
                                : "No especificada"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-xs sm:text-sm">{selectedOrder.people || 0} personas</p>
                            <p className="text-xs text-muted-foreground">
                              Total: S/{formatPrice(selectedOrder.totalPrice)}
                            </p>
                          </div>
                        </div>

                        {selectedOrder.paymentMethod && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-xs sm:text-sm">Método de pago</p>
                              <p className="text-xs text-muted-foreground capitalize">{selectedOrder.paymentMethod}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="space-y-2 sm:space-y-3 border-t pt-2 sm:pt-3">
                      <h5 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                        INFORMACIÓN DEL CLIENTE
                      </h5>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <span className="font-medium">Nombre:</span>
                            <span className="ml-1">{selectedOrder.customer?.fullName || "No especificado"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <span className="font-medium">Email:</span>
                            <span className="ml-1 break-all">{selectedOrder.customer?.email || "No especificado"}</span>
                          </div>
                        </div>

                        {selectedOrder.customer?.phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Teléfono:</span>
                              <span className="ml-1">{selectedOrder.customer.phone}</span>
                            </div>
                          </div>
                        )}

                        {selectedOrder.customer?.nationality && (
                          <div className="flex items-center gap-2 text-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Nacionalidad:</span>
                              <span className="ml-1">{selectedOrder.customer.nationality}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notas */}
                    {selectedOrder.notes && (
                      <div className="space-y-2 border-t pt-2 sm:pt-3">
                        <h5 className="font-semibold text-xs sm:text-sm text-muted-foreground">NOTAS ESPECIALES</h5>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 sm:p-3 rounded-lg">
                          <p>{selectedOrder.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Información de fechas del sistema */}
                    <div className="space-y-2 border-t pt-2 sm:pt-3">
                      <h5 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                        INFORMACIÓN DEL SISTEMA
                      </h5>

                      <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Creada:</span>
                          <span>
                            {selectedOrder.createdAt
                              ? format(new Date(selectedOrder.createdAt), "dd/MM/yy", { locale: es })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actualizada:</span>
                          <span>
                            {selectedOrder.updatedAt
                              ? format(new Date(selectedOrder.updatedAt), "dd/MM/yy", { locale: es })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-mono text-xs truncate">{selectedOrder._id.slice(-8)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
                      <OrderEditDialog
                        order={selectedOrder}
                        onOrderUpdated={fetchOrders}
                        trigger={
                          <Button size="sm" className="flex-1 text-xs sm:text-sm">
                            Editar
                          </Button>
                        }
                      />
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-6 sm:py-8">
                  <CalendarIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-30" />
                  <p className="text-xs sm:text-sm font-medium mb-1">Selecciona una reserva</p>
                  <p className="text-xs">Haz clic en cualquier reserva para ver sus detalles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
