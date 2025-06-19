"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, X, Trash2, Calendar, MapPin } from "lucide-react"
import type { CreateTourDto, ItineraryDay, RoutePoint } from "@/types/tour"

// Arreglar el error de <img> reemplazándolo con <Image> de next/image
import Image from "next/image"

interface ItineraryFormProps {
  data: CreateTourDto
  onChange: (data: Partial<CreateTourDto>) => void
}

export function ItineraryForm({ data, onChange }: ItineraryFormProps) {
  const [newDay, setNewDay] = useState<ItineraryDay>({
    day: (data.itinerary?.length || 0) + 1,
    title: "",
    description: "",
    activities: [],
    meals: [],
    accommodation: "",
    imageUrl: "",
    imageId: "",
    route: [], // Agregado según el nuevo DTO
  })
  const [newActivity, setNewActivity] = useState("")
  const [newMeal, setNewMeal] = useState("")
  const [newRoutePoint, setNewRoutePoint] = useState<RoutePoint>({
    location: "",
    description: "",
    imageUrl: "",
    imageId: "",
  })

  const handleDayImageChange = (url: string, imageId: string) => {
    setNewDay({
      ...newDay,
      imageUrl: url,
      imageId: imageId || "",
    })
  }

  const handleDayImageRemove = () => {
    setNewDay({
      ...newDay,
      imageUrl: "",
      imageId: "",
    })
  }

  const handleRouteImageChange = (url: string, imageId: string) => {
    setNewRoutePoint({
      ...newRoutePoint,
      imageUrl: url,
      imageId: imageId || "",
    })
  }

  const handleRouteImageRemove = () => {
    setNewRoutePoint({
      ...newRoutePoint,
      imageUrl: "",
      imageId: "",
    })
  }

  const addActivity = () => {
    if (newActivity.trim()) {
      setNewDay({
        ...newDay,
        activities: [...newDay.activities, newActivity.trim()],
      })
      setNewActivity("")
    }
  }

  const removeActivity = (index: number) => {
    setNewDay({
      ...newDay,
      activities: newDay.activities.filter((_, i) => i !== index),
    })
  }

  const addMeal = () => {
    if (newMeal.trim()) {
      setNewDay({
        ...newDay,
        meals: [...(newDay.meals || []), newMeal.trim()],
      })
      setNewMeal("")
    }
  }

  const removeMeal = (index: number) => {
    setNewDay({
      ...newDay,
      meals: newDay.meals?.filter((_, i) => i !== index) || [],
    })
  }

  const addRoutePoint = () => {
    if (newRoutePoint.location.trim()) {
      setNewDay({
        ...newDay,
        route: [...newDay.route, { ...newRoutePoint }],
      })
      setNewRoutePoint({
        location: "",
        description: "",
        imageUrl: "",
        imageId: "",
      })
    }
  }

  const removeRoutePoint = (index: number) => {
    setNewDay({
      ...newDay,
      route: newDay.route.filter((_, i) => i !== index),
    })
  }

  const addItineraryDay = () => {
    if (newDay.title.trim() && newDay.description.trim() && newDay.activities.length > 0) {
      onChange({
        itinerary: [...(data.itinerary || []), { ...newDay }],
      })
      setNewDay({
        day: (data.itinerary?.length || 0) + 2,
        title: "",
        description: "",
        activities: [],
        meals: [],
        accommodation: "",
        imageUrl: "",
        imageId: "",
        route: [],
      })
    }
  }

  const removeItineraryDay = (index: number) => {
    const updatedItinerary = data.itinerary?.filter((_, i) => i !== index) || []
    // Reordenar los días
    const reorderedItinerary = updatedItinerary.map((day, i) => ({
      ...day,
      day: i + 1,
    }))
    onChange({ itinerary: reorderedItinerary })
    setNewDay({
      ...newDay,
      day: reorderedItinerary.length + 1,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Itinerario del Tour</h3>
        <p className="text-sm text-muted-foreground">Define el itinerario día a día del tour</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agregar Día {newDay.day}</CardTitle>
          <CardDescription>Configura las actividades del día</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="day-title">Título del Día</Label>
              <Input
                id="day-title"
                value={newDay.title}
                onChange={(e) => setNewDay({ ...newDay, title: e.target.value })}
                placeholder="Ej: Llegada a París"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="day-accommodation">Alojamiento</Label>
              <Input
                id="day-accommodation"
                value={newDay.accommodation || ""}
                onChange={(e) => setNewDay({ ...newDay, accommodation: e.target.value })}
                placeholder="Ej: Hotel Le Marais 4*"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="day-description">Descripción</Label>
            <Textarea
              id="day-description"
              value={newDay.description}
              onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
              placeholder="Descripción general del día"
              rows={2}
            />
          </div>

          <ImageUpload
            value={newDay.imageUrl}
            imageId={newDay.imageId}
            onChange={handleDayImageChange}
            onRemove={handleDayImageRemove}
            label="Imagen del Día"
            placeholder="Subir imagen del día o ingresar URL"
          />

          <div className="space-y-2">
            <Label>Actividades</Label>
            <div className="flex gap-2">
              <Input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Agregar actividad"
                onKeyPress={(e) => e.key === "Enter" && addActivity()}
              />
              <Button type="button" onClick={addActivity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newDay.activities.map((activity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {activity}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeActivity(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comidas Incluidas</Label>
            <div className="flex gap-2">
              <Input
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                placeholder="Ej: Desayuno, Almuerzo, Cena"
                onKeyPress={(e) => e.key === "Enter" && addMeal()}
              />
              <Button type="button" onClick={addMeal}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newDay.meals?.map((meal, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {meal}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeMeal(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Nueva sección para puntos de ruta */}
          <div className="space-y-2">
            <Label>Ruta del Día</Label>
            <Card className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="route-location">Ubicación</Label>
                    <Input
                      id="route-location"
                      value={newRoutePoint.location}
                      onChange={(e) => setNewRoutePoint({ ...newRoutePoint, location: e.target.value })}
                      placeholder="Ej: Torre Eiffel"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="route-description">Descripción</Label>
                    <Input
                      id="route-description"
                      value={newRoutePoint.description || ""}
                      onChange={(e) => setNewRoutePoint({ ...newRoutePoint, description: e.target.value })}
                      placeholder="Descripción del lugar"
                    />
                  </div>
                </div>

                <ImageUpload
                  value={newRoutePoint.imageUrl}
                  imageId={newRoutePoint.imageId}
                  onChange={handleRouteImageChange}
                  onRemove={handleRouteImageRemove}
                  label="Imagen del Lugar"
                  placeholder="Subir imagen del lugar"
                />

                <Button type="button" onClick={addRoutePoint} disabled={!newRoutePoint.location.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Punto de Ruta
                </Button>
              </div>
            </Card>

            <div className="flex flex-wrap gap-2">
              {newDay.route.map((point, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {point.location}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeRoutePoint(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={addItineraryDay}
            className="w-full"
            disabled={!newDay.title.trim() || !newDay.description.trim() || newDay.activities.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Día al Itinerario
          </Button>
        </CardContent>
      </Card>

      {data.itinerary && data.itinerary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itinerario Configurado</CardTitle>
            <CardDescription>Días agregados al tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Día {day.day}: {day.title}
                      </span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItineraryDay(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{day.description}</p>
                  {day.accommodation && (
                    <p className="text-sm mb-2">
                      <span className="font-medium">Alojamiento:</span> {day.accommodation}
                    </p>
                  )}
                  {/* Reemplazar el bloque de código que usa <img> con <Image> */}
                  {day.imageUrl && (
                    <div className="mb-2">
                      <Image
                        src={day.imageUrl || "/placeholder.svg?height=200&width=400&query=landscape"}
                        alt={day.title}
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Actividades:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {day.activities.map((activity, actIndex) => (
                          <Badge key={actIndex} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {day.meals && day.meals.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Comidas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {day.meals.map((meal, mealIndex) => (
                            <Badge key={mealIndex} variant="outline" className="text-xs">
                              {meal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {day.route && day.route.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Ruta:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {day.route.map((point, pointIndex) => (
                            <Badge key={pointIndex} variant="outline" className="text-xs flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {point.location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
