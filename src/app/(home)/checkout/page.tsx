"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Minus,
  CreditCard,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  DollarSign,
  Star,
  Gift,
  Phone,
  Mail,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Componente de Calendario Personalizado
const CustomCalendar = ({
  selectedDate,
  onDateSelect,
}: { selectedDate: Date | null; onDateSelect: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()

  const daysInMonth = lastDayOfMonth.getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayWeekday }, () => null)

  const monthNames = [
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

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day)
    return date < today
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    const date = new Date(year, month, day)
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return
    const date = new Date(year, month, day)
    onDateSelect(date)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <Button variant="ghost" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}
        {daysArray.map((day) => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            disabled={isDateDisabled(day)}
            className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
              isDateSelected(day)
                ? "bg-orange-500 text-white"
                : isDateDisabled(day)
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("")

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+51",
    phone: "",
    fullName: "",
    visitorPhone: "",
    birthDate: "",
  })

  // Datos del tour seleccionado
  const selectedTour = {
    id: 1,
    title: "Machu Picchu Clásico",
    subtitle: "Tour de 1 día completo",
    image: "https://res.cloudinary.com/dwvikvjrq/image/upload/v1748624876/banner_waz5ov.jpg",
    price: 299,
    duration: "1 día",
    location: "Cusco - Machu Picchu",
    rating: 4.9,
    reviews: 1247,
    includes: ["Transporte", "Guía profesional", "Entrada a Machu Picchu", "Almuerzo"],
  }

  const steps = [
    { id: 1, title: "Detalles del Tour", icon: Calendar, description: "Selecciona fecha y cantidad" },
    { id: 2, title: "Información Personal", icon: User, description: "Datos de contacto" },
    { id: 3, title: "Información del Visitante", icon: FileText, description: "Datos para Machu Picchu" },
    { id: 4, title: "Pago", icon: DollarSign, description: "Método de pago y confirmación" },
  ]

  const timeSlots = [
    { value: "06:00", label: "6:00 AM - Salida Temprana", popular: true },
    { value: "08:00", label: "8:00 AM - Salida Estándar", popular: false },
    { value: "10:00", label: "10:00 AM - Salida Tardía", popular: false },
    { value: "12:00", label: "12:00 PM - Salida Tarde", popular: false },
  ]

  const basePrice = selectedTour.price * quantity
  const discount = discountApplied ? basePrice * 0.1 : 0
  const total = basePrice - discount

  const countries = [
    { code: "+51", name: "Perú", flag: "🇵🇪" },
    { code: "+1", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "+34", name: "España", flag: "🇪🇸" },
    { code: "+33", name: "Francia", flag: "🇫🇷" },
    { code: "+49", name: "Alemania", flag: "🇩🇪" },
    { code: "+44", name: "Reino Unido", flag: "🇬🇧" },
    { code: "+39", name: "Italia", flag: "🇮🇹" },
    { code: "+55", name: "Brasil", flag: "🇧🇷" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
  ]

  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "💳", description: "Tarjeta de crédito/débito" },
    { id: "mastercard", name: "Mastercard", icon: "💳", description: "Tarjeta de crédito/débito" },
    { id: "bcp", name: "BCP", icon: "🏦", description: "Banco de Crédito del Perú" },
    { id: "interbank", name: "Interbank", icon: "🏦", description: "Banco Interbank" },
    { id: "culqi", name: "Culqi", icon: "💰", description: "Pago seguro online" },
  ]

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "descuento10") {
      setDiscountApplied(true)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate !== null && selectedTime !== ""
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 3:
        return formData.fullName && formData.visitorPhone && formData.birthDate
      case 4:
        return selectedPayment && acceptTerms
      default:
        return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Procesando pago...")
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-32 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Reserva 100% Segura
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Finalizar Reserva</h1>
          <p className="text-lg text-gray-600">Completa tu información para confirmar tu aventura peruana</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg"
                        : currentStep === step.id - 1
                          ? "bg-orange-100 border-orange-300 text-orange-600"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 md:w-24 h-1 mx-2 transition-all rounded-full ${
                        currentStep > step.id ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Paso 1: Detalles del Tour */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Resumen del Tour */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Calendar className="mr-3 text-orange-500" />
                      Tu Selección
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative">
                        <Image
                          src={selectedTour.image || "/placeholder.svg"}
                          alt={selectedTour.title}
                          width={300}
                          height={200}
                          className="w-full md:w-48 h-32 object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-orange-600 shadow-md">
                          Más Popular
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTour.title}</h3>
                        <p className="text-gray-600 mb-3">{selectedTour.subtitle}</p>

                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedTour.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {selectedTour.rating} ({selectedTour.reviews} reseñas)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-orange-500" />
                            {selectedTour.duration}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            {selectedTour.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="h-10 w-10 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(quantity + 1)}
                              className="h-10 w-10 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600">${selectedTour.price}</p>
                            <p className="text-sm text-gray-500">por persona</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Incluye:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTour.includes.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6 border-dashed border-2 hover:bg-orange-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar más paquetes
                    </Button>
                  </div>

                  {/* Selección de Fecha y Hora */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Calendar className="mr-3 text-orange-500" />
                      Selecciona tu Fecha y Hora
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block">Fecha del Tour *</Label>
                        <CustomCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                      </div>

                      <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block">Hora de Salida *</Label>
                        <div className="space-y-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setSelectedTime(slot.value)}
                              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                selectedTime === slot.value
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{slot.label}</div>
                                  {slot.popular && (
                                    <div className="text-xs text-orange-600 font-medium mt-1">Más Popular</div>
                                  )}
                                </div>
                                <Clock className="w-5 h-5 text-gray-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Información Personal */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Users className="mr-3 text-orange-500" />
                    ¿A quién enviamos los tickets?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="firstName" className="text-base font-semibold text-gray-900 mb-2 block">
                        Nombre *
                      </Label>
                      <Input
                        id="firstName"
                        className="h-12 text-base"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-base font-semibold text-gray-900 mb-2 block">
                        Apellido(s) *
                      </Label>
                      <Input
                        id="lastName"
                        className="h-12 text-base"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="email" className="text-base font-semibold text-gray-900 mb-2 block">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Dirección de correo electrónico *
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      className="h-12 text-base"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="countryCode" className="text-base font-semibold text-gray-900 mb-2 block">
                        <Globe className="w-4 h-4 inline mr-2" />
                        País *
                      </Label>
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => updateFormData("countryCode", value)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone" className="text-base font-semibold text-gray-900 mb-2 block">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Número de teléfono *
                      </Label>
                      <Input
                        id="phone"
                        className="h-12 text-base"
                        placeholder="999 999 999"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Información Segura</p>
                        <p className="text-sm text-blue-700">
                          Utilizaremos este número de teléfono para notificarte el envío de las entradas por SMS y si
                          hay algún problema con tu pedido.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Información para Machu Picchu */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Información necesaria para Machu Picchu</h2>
                  <p className="text-gray-600 mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <FileText className="w-5 h-5 inline text-yellow-600 mr-2" />
                    Esta información es requerida por las autoridades peruanas para el ingreso a Machu Picchu.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="fullName" className="text-base font-semibold text-gray-900 mb-2 block">
                        Nombre y apellidos completos *
                      </Label>
                      <Input
                        id="fullName"
                        className="h-12 text-base"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg">
                        <strong>Importante:</strong> Introduce el nombre completo con caracteres latinos exactamente
                        igual que en tu pasaporte o carné de identidad.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="visitorPhone" className="text-base font-semibold text-gray-900 mb-2 block">
                        Número de teléfono del visitante *
                      </Label>
                      <Input
                        id="visitorPhone"
                        className="h-12 text-base"
                        value={formData.visitorPhone}
                        onChange={(e) => updateFormData("visitorPhone", e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Introduce el número de teléfono del visitante o su guardián legal.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="birthDate" className="text-base font-semibold text-gray-900 mb-2 block">
                        Fecha de nacimiento *
                      </Label>
                      <Input
                        type="date"
                        id="birthDate"
                        className="h-12 text-base"
                        value={formData.birthDate}
                        onChange={(e) => updateFormData("birthDate", e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Introduce la fecha de nacimiento en formato YYYY-MM-DD.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 4: Pago */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Código de Descuento */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <button
                      type="button"
                      onClick={() => setShowDiscount(!showDiscount)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <div className="flex items-center">
                        <Gift className="w-5 h-5 text-orange-500 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">¿Tienes un código de descuento?</h3>
                      </div>
                      {showDiscount ? (
                        <ChevronUp className="text-gray-400" />
                      ) : (
                        <ChevronDown className="text-gray-400" />
                      )}
                    </button>

                    {showDiscount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="flex gap-3">
                          <Input
                            placeholder="Introduce tu código aquí"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="h-12"
                          />
                          <Button onClick={applyDiscount} variant="outline" className="h-12 px-6">
                            Aplicar
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {discountApplied && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center"
                      >
                        <Check className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-green-800 font-medium">¡Descuento del 10% aplicado correctamente!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Método de Pago */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="mr-3 text-orange-500" />
                      Método de Pago
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            selectedPayment === method.id
                              ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="text-2xl mr-4">{method.icon}</div>
                            <div>
                              <div className="font-semibold text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-start space-x-3 mb-6 p-4 bg-gray-50 rounded-xl">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        Acepto los{" "}
                        <a href="#" className="text-orange-600 hover:underline font-medium">
                          términos y condiciones
                        </a>{" "}
                        y la{" "}
                        <a href="#" className="text-orange-600 hover:underline font-medium">
                          política de privacidad
                        </a>
                        . Entiendo que esta reserva está sujeta a disponibilidad y confirmación.
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center h-12 px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center h-12 px-6 shadow-lg"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center h-12 px-8 shadow-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Confirmar y Pagar ${total}
                </Button>
              )}
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-36"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu Pedido</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {selectedTour.title} x{quantity}
                  </span>
                  <span className="font-semibold">${basePrice}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (10%)</span>
                    <span>-${discount}</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">${total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-3" />
                  Confirmación inmediata
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-3" />
                  Cancelación gratuita 24h antes
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-3" />
                  Soporte 24/7
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-3" />
                  Pago 100% seguro
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>¿Necesitas ayuda?</strong>
                  <br />
                  Contáctanos al +51 999 999 999 o envíanos un WhatsApp
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
