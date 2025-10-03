"use client"

import type React from "react"

import { memo, useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { TransportOption } from "@/types/transport"

const TransportCard = memo(
  ({
    transport,
    isSelected,
    onToggle,
  }: {
    transport: TransportOption
    isSelected: boolean
    onToggle: (id: string) => void
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        onToggle(transport._id)
      },
      [transport._id, onToggle],
    )

    return (
      <div
        className={`flex items-start space-x-3 border-2 rounded-xl p-5 transition-all cursor-pointer hover:shadow-md ${
          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="checkbox"
          id={`transport-${transport._id}`}
          checked={isSelected}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
        <div className="flex-1 space-y-2">
          <Label htmlFor={`transport-${transport._id}`} className="cursor-pointer font-semibold text-base">
            {transport.name || transport.vehicle || "Transporte sin nombre"}
          </Label>
          <p className="text-sm text-muted-foreground leading-relaxed">{transport.description || "Sin descripción"}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {transport.type}
            </span>
            <span className="text-xs text-muted-foreground">{transport.vehicle}</span>
          </div>
        </div>
      </div>
    )
  },
)

TransportCard.displayName = "TransportCard"

interface TransportSelectorProps {
  transportOptions: TransportOption[]
  initialSelectedIds: string[]
  loading: boolean
  onSelectionChange: (selectedIds: string[]) => void
}

export const TransportSelector = memo(function TransportSelector({
  transportOptions,
  initialSelectedIds,
  loading,
  onSelectionChange,
}: TransportSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)

  useEffect(() => {
    // Only notify if the selection has actually changed
    const hasChanged =
      selectedIds.length !== initialSelectedIds.length || selectedIds.some((id) => !initialSelectedIds.includes(id))

    if (hasChanged) {
      onSelectionChange(selectedIds)
    }
  }, [selectedIds, onSelectionChange, initialSelectedIds])

  const handleToggle = useCallback((transportId: string) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(transportId) ? prev.filter((id) => id !== transportId) : [...prev, transportId]

      return newSelection
    })
  }, [])

  return (
    <Card className="border-2">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <div>
            <CardTitle className="text-2xl">Opciones de Transporte</CardTitle>
            <CardDescription className="text-base mt-1">
              Selecciona las opciones de transporte disponibles para este tour
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transportOptions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No hay opciones de transporte disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transportOptions.map((transport) => (
              <TransportCard
                key={transport._id}
                transport={transport}
                isSelected={selectedIds.includes(transport._id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
