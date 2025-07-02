import type React from "react"
import type { Metadata } from "next"
import { api } from "@/lib/axiosInstance"

interface Props {
  params: Promise<{ slug: string }>
}

interface TransportTour {
  _id: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  price: number
  duration: string
  location: string
  region: string
  category: string
  packageType: string
  slug: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    // Obtener datos del transporte específico
    const response = await api.get(`/tours/transport`)
    const tours: TransportTour[] = response.data.data || []
    const transport = tours.find((t: TransportTour) => t.slug === slug)

    if (!transport) {
      return {
        title: "Transporte no encontrado | Inka Travel Peru",
        description:
          "El servicio de transporte que buscas no está disponible. Explora otros servicios de transporte en Perú.",
      }
    }

    const transportTitle = `${transport.title} - ${transport.duration} | Inka Travel Peru`
    const transportDescription = `${transport.subtitle} Precio desde S/ ${transport.price}. Reserva online con Inka Travel Peru, agencia de turismo líder en Perú.`

    const keywords = [
      transport.title.toLowerCase(),
      `transporte ${transport.location.toLowerCase()}`,
      `${transport.category.toLowerCase()} peru`,
      `transporte ${transport.region.toLowerCase()}`,
      "inka travel peru",
      "agencia turismo peru",
      "transporte turistico peru",
    ]

    return {
      title: transportTitle,
      description: transportDescription,
      keywords: keywords,
      openGraph: {
        title: transportTitle,
        description: transportDescription,
        url: `https://cabanacondecuscobybus.com/transport/${slug}`,
        siteName: "Inka Travel Peru",
        images: [
          {
            url: transport.imageUrl || "/og-transport-default.jpg",
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
        images: [transport.imageUrl || "/twitter-transport-default.jpg"],
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
        "product:price:currency": "PEN",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:retailer_item_id": transport._id,
        "product:brand": "Inka Travel Peru",
        "product:category": transport.category,
        "geo.region": "PE",
        "geo.placename": transport.location,
        "travel:duration": transport.duration,
        "travel:type": transport.packageType,
      },
    }
  } catch (error) {
    console.error("Error generating transport metadata:", error)
    return {
      title: "Transporte | Inka Travel Peru",
      description:
        "Descubre increíbles servicios de transporte en Perú con Inka Travel Peru, tu agencia de turismo de confianza.",
    }
  }
}

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Schema.org para servicios de transporte */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Transportation Service",
            provider: {
              "@type": "TravelAgency",
              name: "Inka Travel Peru",
              url: "https://cabanacondecuscobybus.com",
            },
            areaServed: {
              "@type": "Country",
              name: "Peru",
            },
          }),
        }}
      />
      {children}
    </>
  )
}
