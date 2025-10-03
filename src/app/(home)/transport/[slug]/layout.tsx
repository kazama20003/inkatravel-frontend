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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  console.log("[v0] Raw params object:", params)
  const resolvedParams = await params
  console.log("[v0] Resolved params:", resolvedParams)
  const { slug } = resolvedParams
  console.log("[v0] Extracted slug:", slug)
  console.log("[v0] Slug type:", typeof slug)
  console.log("[v0] Slug length:", slug?.length)

  try {
    console.log("[v0] Generating metadata for slug:", slug)
    const response = await api.get<{ data: TourTransport[] }>("/tour-transport")
    const transports = response.data.data
    console.log("[v0] All transports received:", transports?.length || 0)

    if (transports && transports.length > 0) {
      console.log(
        "[v0] Available transport slugs:",
        transports.map((t) => t.slug),
      )
      console.log("[v0] Looking for slug:", slug)
    }

    // Find the specific transport by slug
    const transport = transports?.find((t) => t.slug === slug)
    console.log("[v0] Found transport:", transport ? transport.title : "Not found")

    if (!transport) {
      console.log("[v0] Transport not found for slug:", slug)
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

    const safeTitle = transport.title || "Transporte"
    const safeOriginCity = transport.originCity || "Origen"
    const safeDestinationCity = transport.destinationCity || "Destino"
    const safeDescription = transport.description || "Servicio de transporte turístico"

    const transportTitle = `${safeTitle} - ${safeOriginCity} a ${safeDestinationCity} | Peru Travel`
    const transportDescription = `${safeDescription} Viaja de ${safeOriginCity} a ${safeDestinationCity}. Precio desde $${transport.price} USD. ${transport.durationInHours ? `Duración: ${transport.durationInHours} horas.` : ""} Reserva online con Peru Travel.`

    const keywords = [
      safeTitle.toLowerCase(),
      `transporte ${safeOriginCity.toLowerCase()}`,
      `transporte ${safeDestinationCity.toLowerCase()}`,
      `${safeOriginCity.toLowerCase()} ${safeDestinationCity.toLowerCase()}`,
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
            alt: safeTitle,
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
        "geo.placename": `${safeOriginCity}, ${safeDestinationCity}`,
        ...(transport.durationInHours && { "travel:duration": `${transport.durationInHours} hours` }),
        "travel:type": "Transport",
        "travel:origin": safeOriginCity,
        "travel:destination": safeDestinationCity,
      },
    }
  } catch (error) {
    console.error("Error generating transport metadata:", error)
    if (error instanceof Error) {
      console.log("[v0] Metadata error details:", {
        message: error.message,
        name: error.name,
        slug: slug,
      })
    }
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
