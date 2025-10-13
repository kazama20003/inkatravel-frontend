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
import { MapPin, Clock, Calendar, Star, Pencil, Trash2, Plus } from "lucide-react"
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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tours de Transporte</h1>
            <p className="text-muted-foreground mt-2">Gestiona los tours de transporte disponibles</p>
          </div>
          <Button onClick={() => router.push("/dashboard/tour-transport/new")} size="lg" className="gap-2 shadow-sm">
            <Plus className="h-5 w-5" />
            Crear Transporte
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 border border-destructive/20 animate-in fade-in-50">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : transports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-2">No hay tours de transporte disponibles</p>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Comienza creando tu primer tour de transporte para que aparezca aquí
              </p>
              <Button onClick={() => router.push("/dashboard/tour-transport/new")} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Primer Transporte
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {transports.map((transport) => (
              <Card
                key={transport._id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/30"
              >
                {transport.imageUrl && (
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <Image
                      src={transport.imageUrl || "/placeholder.svg"}
                      alt={getTranslatedText(transport.title)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {transport.isFeatured && (
                      <Badge className="absolute top-3 right-3 shadow-md bg-yellow-500 hover:bg-yellow-600 border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Destacado
                      </Badge>
                    )}
                    {!transport.isActive && (
                      <Badge className="absolute top-3 left-3 shadow-md" variant="secondary">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                )}

                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
                    {getTranslatedText(transport.title) || "Sin título"}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {getTranslatedText(transport.description) || "Sin descripción"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-medium text-foreground truncate">{transport.origin.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground">→</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <span className="font-medium text-foreground truncate">{transport.destination.name}</span>
                      </div>
                    </div>

                    {transport.duration && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{transport.duration}</span> de viaje
                        </span>
                      </div>
                    )}

                    {transport.availableDays && transport.availableDays.length > 0 && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
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
                      <span className="text-sm font-medium text-muted-foreground">$</span>
                      <span className="text-2xl font-bold text-primary">{transport.price.toFixed(2)}</span>
                    </div>

                    {transport.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-md">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                          {transport.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 bg-transparent"
                      onClick={() => handleEdit(transport._id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => setDeleteId(transport._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
            <AlertDialogTitle>¿Estás seguro de eliminar este tour?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El tour de transporte será eliminado permanentemente de la base de
              datos.
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
