import type React from "react"
import type { Metadata } from "next"
import { api } from "@/lib/axiosInstance"

interface Props {
  params: Promise<{ slug: string }>
}

// Define the interface for the tour transport data based on your API response
interface TourTransport {
  _id: string
  title: string
  description: string
  termsAndConditions: string
  originCity: string
  destinationCity: string
  intermediateStops?: string[]
  availableDays: string[]
  departureTime?: string
  arrivalTime?: string
  durationInHours?: number
  duration?: string
  price: number
  rating?: number
  vehicleId?: string
  routeCode?: string
  isActive?: boolean
  slug?: string
  itinerary?: Array<{
    day: number
    title: string
    description: string
    imageUrl?: string
    imageId?: string
    route?: Array<{
      location: string
      description: string
      imageUrl?: string
      imageId?: string
      stopTime?: string
    }>
  }>
  imageUrl?: string
  imageId?: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  data: TourTransport[]
  total: number
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    // Obtener datos del transporte específico usando el endpoint correcto
    const response = await api.get<ApiResponse>("/tour-transport")
    const apiResponseData: ApiResponse = response.data
    const transport = apiResponseData.data.find((t: TourTransport) => t.slug === slug)

    if (!transport) {
      return {
        title: "Transporte no encontrado | Peru Travel",
        description:
          "El servicio de transporte que buscas no está disponible. Explora otros servicios de transporte en Perú.",
        openGraph: {
          title: "Transporte no encontrado | Peru Travel",
          description: "El servicio de transporte que buscas no está disponible.",
          url: `https://cabanacondecuscobybus.com/transport/${slug}`,
          siteName: "Peru Travel",
          type: "website",
        },
      }
    }

    const transportTitle = `${transport.title} - ${transport.originCity} a ${transport.destinationCity} | Peru Travel`
    const transportDescription = `${transport.description} Viaja de ${transport.originCity} a ${transport.destinationCity}. Precio desde $${transport.price} USD. ${transport.durationInHours ? `Duración: ${transport.durationInHours} horas.` : ""} Reserva online con Peru Travel.`

    const keywords = [
      transport.title.toLowerCase(),
      `transporte ${transport.originCity.toLowerCase()}`,
      `transporte ${transport.destinationCity.toLowerCase()}`,
      `${transport.originCity.toLowerCase()} ${transport.destinationCity.toLowerCase()}`,
      "peru travel",
      "transporte turistico peru",
      "viajes peru",
      "tours transporte peru",
    ]

    return {
      title: transportTitle,
      description: transportDescription,
      keywords: keywords.join(", "),
      openGraph: {
        title: transportTitle,
        description: transportDescription,
        url: `https://cabanacondecuscobybus.com/transport/${slug}`,
        siteName: "Peru Travel",
        images: [
          {
            url: transport.imageUrl || "/placeholder.svg?height=630&width=1200",
            width: 1200,
            height: 630,
            alt: transport.title,
          },
        ],
        locale: "es_PE",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: transportTitle,
        description: transportDescription,
        images: [transport.imageUrl || "/placeholder.svg?height=630&width=1200"],
      },
      alternates: {
        canonical: `https://cabanacondecuscobybus.com/transport/${slug}`,
        languages: {
          es: `https://cabanacondecuscobybus.com/es/transport/${slug}`,
          en: `https://cabanacondecuscobybus.com/en/transport/${slug}`,
          fr: `https://cabanacondecuscobybus.com/fr/transport/${slug}`,
          de: `https://cabanacondecuscobybus.com/de/transport/${slug}`,
        },
      },
      other: {
        "product:price:amount": transport.price.toString(),
        "product:price:currency": "USD",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:retailer_item_id": transport._id,
        "product:brand": "Peru Travel",
        "product:category": "Transport Service",
        "geo.region": "PE",
        "geo.placename": `${transport.originCity}, ${transport.destinationCity}`,
        ...(transport.durationInHours && { "travel:duration": `${transport.durationInHours} hours` }),
        "travel:type": "Transport",
        "travel:origin": transport.originCity,
        "travel:destination": transport.destinationCity,
      },
    }
  } catch (error) {
    console.error("Error generating transport metadata:", error)
    return {
      title: "Transporte | Peru Travel",
      description:
        "Descubre increíbles servicios de transporte en Perú con Peru Travel, tu agencia de turismo de confianza.",
      openGraph: {
        title: "Transporte | Peru Travel",
        description: "Descubre increíbles servicios de transporte en Perú con Peru Travel.",
        url: "https://cabanacondecuscobybus.com/transport",
        siteName: "Peru Travel",
        type: "website",
      },
    }
  }
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  return (
    <>
      {/* Schema.org para servicios de transporte */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: "Servicio de Transporte Turístico",
            description: "Servicios de transporte turístico en Perú",
            provider: {
              "@type": "TravelAgency",
              name: "Peru Travel",
              url: "https://cabanacondecuscobybus.com",
              logo: "https://cabanacondecuscobybus.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+51-987-654-321",
                contactType: "customer service",
                availableLanguage: ["Spanish", "English", "French", "German"],
              },
            },
            areaServed: {
              "@type": "Country",
              name: "Peru",
              alternateName: "República del Perú",
            },
            serviceType: "Transportation Service",
            category: "Tourist Transport",
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
              },
            },
          }),
        }}
      />

      {/* Schema.org adicional para breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: "https://cabanacondecuscobybus.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Transporte",
                item: "https://cabanacondecuscobybus.com/transport",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Detalle del Servicio",
              },
            ],
          }),
        }}
      />

      {children}
    </>
  )
}
