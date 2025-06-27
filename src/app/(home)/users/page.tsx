"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  User,
  MapPin,
  Calendar,
  Users,
  Star,
  Phone,
  Mail,
  Globe,
  Edit3,
  Save,
  X,
  Package,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountrySelect } from "@/components/login/country-select"
import { toast } from "sonner"
import { api } from "@/lib/axiosInstance"
import type { UserProfileResponse, UpdateUserDto, User as UserType, Order, UserStats } from "@/types/user"
import Image from "next/image"

export default function UserProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "profile"

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form data for editing
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  })

  // Load user profile data
  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading user profile...")
      const response = await api.get<UserProfileResponse>("/users/profile")
      console.log("User profile response:", response.data)

      if (response.data && response.data.data) {
        const { user: userData, orders: ordersData } = response.data.data

        setUser(userData)
        setOrders(ordersData || [])

        // Set form data
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          country: userData.country || "",
        })

        // Calculate stats
        if (ordersData && ordersData.length > 0) {
          const uniqueTours = new Set(ordersData.flatMap((order) => order.items.map((item) => item.tour._id))).size
          const totalSpent = ordersData.reduce((sum, order) => sum + order.totalPrice, 0)
          const destinations = ordersData.flatMap((order) => order.items.map((item) => item.tour.location))
          const favoriteDestination = destinations.reduce(
            (acc, dest) => {
              acc[dest] = (acc[dest] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )
          const mostVisited = Object.entries(favoriteDestination).sort(([, a], [, b]) => b - a)[0]

          setStats({
            totalOrders: ordersData.length,
            uniqueTours,
            totalSpent,
            favoriteDestination: mostVisited ? mostVisited[0] : "N/A",
          })
        } else {
          setStats({
            totalOrders: 0,
            uniqueTours: 0,
            totalSpent: 0,
            favoriteDestination: "N/A",
          })
        }
      }
    } catch (err: unknown) {
      console.error("Error loading user profile:", err)
      setError("Error al cargar el perfil del usuario")

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          toast.error("Debes iniciar sesión para ver tu perfil")
          router.push("/login")
        }
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  // Update user profile
  const updateProfile = async () => {
    if (!user) return

    try {
      setUpdating(true)

      const response = await api.patch(`/users/${user._id}`, formData)

      if (response.data) {
        // Update local state without reloading
        setUser({ ...user, ...formData })
        setEditing(false)
        toast.success("Perfil actualizado correctamente")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error("Error al actualizar el perfil")
    } finally {
      setUpdating(false)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
      })
    }
    setEditing(false)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Creada
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Award className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el perfil</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={loadUserProfile} className="bg-orange-500 hover:bg-orange-600">
              Reintentar
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-base sm:text-lg text-gray-600">Gestiona tu información y reservas</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Reservas</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Tours Únicos</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.uniqueTours}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Gastado</p>
                    <p className="text-2xl sm:text-3xl font-bold">S/ {stats.totalSpent}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Destino Favorito</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.favoriteDestination}</p>
                  </div>
                  <Award className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={(value) => router.push(`/users?tab=${value}`)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Mis Reservas</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white shadow-xl border border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
                      Información Personal
                    </CardTitle>
                    {!editing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                        className="flex items-center"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={updating}
                          className="flex items-center bg-transparent"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={updateProfile}
                          disabled={updating}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center"
                        >
                          {updating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Nombre Completo</Label>
                      {editing ? (
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="h-10 sm:h-12"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="w-4 h-4 text-gray-500 mr-3" />
                          <span className="text-gray-900">{user.fullName || "No especificado"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Correo Electrónico</Label>
                      {editing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-10 sm:h-12"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-500 mr-3" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Teléfono</Label>
                      {editing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+51 999 999 999"
                          className="h-10 sm:h-12"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-500 mr-3" />
                          <span className="text-gray-900">{user.phone || "No especificado"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">País</Label>
                      {editing ? (
                        <CountrySelect
                          value={formData.country}
                          onValueChange={(value) => setFormData({ ...formData, country: value })}
                          placeholder="Seleccionar país..."
                          className="h-10 sm:h-12"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Globe className="w-4 h-4 text-gray-500 mr-3" />
                          <span className="text-gray-900">{user.country || "No especificado"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Cuenta</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Rol</p>
                          <p className="text-gray-900 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Proveedor de Autenticación</p>
                          <p className="text-gray-900 capitalize">{user.authProvider}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Fecha de Registro</p>
                          <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Última Actualización</p>
                          <p className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString("es-ES")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="bg-white shadow-xl border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500" />
                    Mis Reservas ({orders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes reservas aún</h3>
                      <p className="text-gray-600 mb-4">Explora nuestros tours y haz tu primera reserva</p>
                      <Button
                        onClick={() => router.push("/tours")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      >
                        Explorar Tours
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      <AnimatePresence>
                        {orders.map((order, index) => (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                          >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">Reserva #{order._id.slice(-8)}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(order.status)}
                                <div className="text-right">
                                  <p className="text-lg font-bold text-orange-600">S/ {order.totalPrice}</p>
                                  <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item._id}
                                  className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex-shrink-0">
                                    <Image
                                      src={item.tour.imageUrl || "/placeholder.svg?height=80&width=120"}
                                      alt={item.tour.title}
                                      width={120}
                                      height={80}
                                      className="w-full sm:w-20 h-16 sm:h-12 object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">{item.tour.title}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                      <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1 text-orange-500" />
                                        {new Date(item.startDate).toLocaleDateString("es-ES")}
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="w-3 h-3 mr-1 text-orange-500" />
                                        {item.people} persona{item.people > 1 ? "s" : ""}
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                                        {item.tour.location}
                                      </div>
                                      {item.tour.rating && (
                                        <div className="flex items-center">
                                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                          {item.tour.rating}
                                        </div>
                                      )}
                                    </div>
                                    {item.notes && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        <strong>Notas:</strong> {item.notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-gray-900">S/ {item.total}</p>
                                    <p className="text-xs text-gray-500">S/ {item.pricePerPerson} por persona</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Customer Info */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <h5 className="text-sm font-medium text-blue-900 mb-2">Información del Cliente</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800">
                                <p>
                                  <strong>Nombre:</strong> {order.customer.fullName}
                                </p>
                                <p>
                                  <strong>Email:</strong> {order.customer.email}
                                </p>
                                {order.customer.phone && (
                                  <p>
                                    <strong>Teléfono:</strong> {order.customer.phone}
                                  </p>
                                )}
                                {order.customer.nationality && (
                                  <p>
                                    <strong>Nacionalidad:</strong> {order.customer.nationality}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Order Notes */}
                            {order.notes && (
                              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                <h5 className="text-sm font-medium text-yellow-900 mb-1">Notas Adicionales</h5>
                                <p className="text-xs text-yellow-800">{order.notes}</p>
                              </div>
                            )}

                            {/* Applied Offer */}
                            {order.appliedOffer && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                <h5 className="text-sm font-medium text-green-900 mb-1">Oferta Aplicada</h5>
                                <p className="text-xs text-green-800">{order.appliedOffer}</p>
                              </div>
                            )}

                            {/* Order Actions */}
                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/tours/${order.items[0]?.tour.slug || order.items[0]?.tour._id}`)
                                }
                                className="flex items-center"
                              >
                                <Eye className="w-3 h-3 mr-2" />
                                Ver Tour
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
