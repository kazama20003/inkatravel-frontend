"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/axiosInstance"
import type { TourTransport, TourTransportApiResponse } from "@/types/tour-transport"
import { getTranslatedText } from "@/types/tour-transport"
import { MapPin, Clock, Calendar, Star, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ToursTransportPage() {
  const [transports, setTransports] = useState<TourTransport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setLoading(true)
        const response = await api.get<TourTransportApiResponse>("/tour-transport")
        const transportData = response.data.data || []
        setTransports(transportData)
        setError(null)
      } catch (err) {
        console.error("Error fetching tour transports:", err)
        setError("Error al cargar los transportes. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchTransports()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      await api.delete(`/tour-transport/${deleteId}`)
      setTransports((prev) => prev.filter((t) => t._id !== deleteId))
      toast.success("Eliminado exitosamente", {
        description: "El tour de transporte ha sido eliminado.",
      })
      setDeleteId(null)
    } catch (err) {
      console.error("Error deleting transport:", err)
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar el tour de transporte. Intenta nuevamente.",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/tour-transport/edit/${id}`)
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
                <BreadcrumbPage>Tours Transport</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tours de Transporte</h1>
            <p className="text-muted-foreground mt-2">Gestiona los tours de transporte disponibles</p>
          </div>
          <Button onClick={() => router.push("/dashboard/tour-transport/new")} size="lg" className="gap-2">
            <MapPin className="h-5 w-5" />
            Crear Transporte
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 border border-destructive/20">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : transports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No hay tours de transporte disponibles</p>
              <p className="text-sm text-muted-foreground mt-2">Los tours aparecerán aquí cuando se agreguen</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {transports.map((transport) => (
              <Card
                key={transport._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
              >
                {transport.imageUrl && (
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <Image
                      src={transport.imageUrl || "/placeholder.svg"}
                      alt={getTranslatedText(transport.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {transport.isFeatured && (
                      <Badge className="absolute top-3 right-3 shadow-lg" variant="default">
                        ⭐ Destacado
                      </Badge>
                    )}
                    {!transport.isActive && (
                      <Badge className="absolute top-3 left-3 shadow-lg" variant="secondary">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                    {getTranslatedText(transport.title) || "Sin título"}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {getTranslatedText(transport.description) || "Sin descripción"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-medium text-foreground">{transport.origin.name}</span>
                        <div className="h-px bg-border w-8" />
                        <span className="font-medium text-foreground">{transport.destination.name}</span>
                      </div>
                    </div>

                    {transport.duration && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{transport.duration}</span> de viaje
                        </span>
                      </div>
                    )}

                    {transport.availableDays && transport.availableDays.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{transport.availableDays.length}</span> días
                          disponibles
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-primary">S/</span>
                      <span className="text-2xl font-bold text-primary">{transport.price}</span>
                      <span className="text-sm text-muted-foreground">Soles</span>
                    </div>

                    {transport.rating && (
                      <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                          {transport.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => handleEdit(transport._id)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => setDeleteId(transport._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El tour de transporte será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
