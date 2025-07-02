import type React from "react"
import type { Metadata } from "next"
import { api } from "@/lib/axiosInstance"

interface Props {
  params: Promise<{ slug: string }>
}

interface Tour {
  _id: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  price: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  packageType: string
  slug: string
  highlights: string[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    // Obtener datos del tour específico
    const response = await api.get(`/tours/slug/${slug}`)
    const tour: Tour = response.data.data

    if (!tour) {
      return {
        title: "Tour no encontrado | Inka Travel Peru",
        description: "El tour que buscas no está disponible. Explora otros increíbles tours en Perú.",
      }
    }

    const tourTitle = `${tour.title} - ${tour.duration} | Inka Travel Peru`
    const tourDescription = `${tour.subtitle} Precio desde S/ ${tour.price}. Reserva online con Inka Travel Peru, agencia de turismo líder en Perú.`

    const keywords = [
      tour.title.toLowerCase(),
      `tour ${tour.location.toLowerCase()}`,
      `${tour.category.toLowerCase()} peru`,
      `tour ${tour.region.toLowerCase()}`,
      "inka travel peru",
      "agencia turismo peru",
      "tours peru",
      ...tour.highlights.map((h: string) => h.toLowerCase()),
    ]

    return {
      title: tourTitle,
      description: tourDescription,
      keywords: keywords,
      openGraph: {
        title: tourTitle,
        description: tourDescription,
        url: `https://cabanacondecuscobybus.com/tours/${slug}`,
        siteName: "Inka Travel Peru",
        images: [
          {
            url: tour.imageUrl || "/og-tour-default.jpg",
            width: 1200,
            height: 630,
            alt: tour.title,
          },
        ],
        locale: "es_PE",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: tourTitle,
        description: tourDescription,
        images: [tour.imageUrl || "/twitter-tour-default.jpg"],
      },
      alternates: {
        canonical: `https://cabanacondecuscobybus.com/tours/${slug}`,
        languages: {
          es: `https://cabanacondecuscobybus.com/es/tours/${slug}`,
          en: `https://cabanacondecuscobybus.com/en/tours/${slug}`,
          fr: `https://cabanacondecuscobybus.com/fr/tours/${slug}`,
          de: `https://cabanacondecuscobybus.com/de/tours/${slug}`,
        },
      },
      other: {
        "product:price:amount": tour.price.toString(),
        "product:price:currency": "PEN",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:retailer_item_id": tour._id,
        "product:brand": "Inka Travel Peru",
        "product:category": tour.category,
        "geo.region": "PE",
        "geo.placename": tour.location,
        "travel:duration": tour.duration,
        "travel:type": tour.packageType,
        "travel:rating": tour.rating.toString(),
        "travel:reviews": tour.reviews.toString(),
      },
    }
  } catch (error) {
    console.error("Error generating tour metadata:", error)
    return {
      title: "Tours | Inka Travel Peru",
      description: "Descubre increíbles tours en Perú con Inka Travel Peru, tu agencia de turismo de confianza.",
    }
  }
}

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Schema.org para tours */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: "Tour en Perú",
            provider: {
              "@type": "TravelAgency",
              name: "Inka Travel Peru",
              url: "https://cabanacondecuscobybus.com",
            },
            touristType: "Turismo Cultural",
            itinerary: {
              "@type": "ItemList",
              name: "Itinerario del Tour",
            },
          }),
        }}
      />
      {children}
    </>
  )
}
