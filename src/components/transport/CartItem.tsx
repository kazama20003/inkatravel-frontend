"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
export interface CartItemData {
  id: string
  title: string
  originCity: string
  destinationCity: string
  price: number
  quantity: number
  imageUrl?: string
  departureTime?: string
  duration?: string
}

interface CartItemProps {
  item: CartItemData
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  currency: string
  exchangeRate: number
}

export default function CartItem({ item, onUpdateQuantity, onRemove, exchangeRate }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      onUpdateQuantity(item.id, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const totalPrice = item.price * item.quantity
  const totalPricePEN = totalPrice * exchangeRate

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          {item.imageUrl && (
            <div className="w-full md:w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <Image
    src={item.imageUrl || "/placeholder.svg"}
    alt={item.title}
    fill
    className="object-cover"
    sizes="100vw"
  />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

            {/* Route */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{item.originCity}</span>
              <ArrowRight className="w-4 h-4 mx-2" />
              <span>{item.destinationCity}</span>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              {item.departureTime && <span>Salida: {item.departureTime}</span>}
              {item.duration && <span>Duración: {item.duration}</span>}
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="font-semibold text-lg text-gray-900">${totalPrice.toFixed(2)} USD</div>
                <div className="text-sm text-gray-500">S/ {totalPricePEN.toFixed(0)} PEN</div>
                <div className="text-xs text-gray-400">${item.price.toFixed(2)} c/u</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
