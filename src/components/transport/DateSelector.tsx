"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DateSelectorProps {
  selectedDate: string
  onDateChange: (date: string) => void
  availableDays?: string[]
  className?: string
}

export default function DateSelector({ selectedDate, onDateChange, availableDays, className }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Generate next 30 days
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // If availableDays is specified, filter by those days
      if (availableDays && availableDays.length > 0 && !availableDays.includes("all")) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
        if (!availableDays.map((d) => d.toLowerCase()).includes(dayName)) {
          continue
        }
      }

      dates.push({
        value: date.toISOString().split("T")[0], // YYYY-MM-DD format
        label: date.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
      })
    }

    return dates
  }

  const availableDates = generateAvailableDates()
  const selectedDateObj = availableDates.find((date) => date.value === selectedDate)

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fecha de viaje</label>

      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-left font-normal"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{selectedDateObj ? selectedDateObj.label : "Seleccionar fecha"}</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {availableDates.map((date) => (
              <button
                key={date.value}
                onClick={() => {
                  onDateChange(date.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                  selectedDate === date.value ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : ""
                }`}
              >
                <div className="font-medium">{date.label}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
