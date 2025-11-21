import "./globals.css"
import { Inter, Bebas_Neue } from "next/font/google"
import type { Metadata } from "next"
import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cabanacondecuscobybus.com"),
  title: {
    default: "Inca Travel Peru - Agencia de Turismo | Tours Cusco, Cabanaconde, Arequipa",
    template: "%s | Inca Travel Peru - Agencia de Turismo",
  },
  description:
    "Agencia de turismo líder en Perú. Tours a Cusco, Cabanaconde, Arequipa, Machu Picchu. Transporte seguro Cabanaconde-Cusco. Paquetes turísticos, aventura y cultura peruana. Reserva online.",
  keywords: [
    "tours peru",
    "agencia turismo peru",
    "tours cusco",
    "cabanaconde cusco transporte",
    "tours arequipa",
    "machu picchu tours",
    "canyon colca tours",
    "inca travel peru",
    "turismo aventura peru",
    "paquetes turisticos peru",
    "transporte turistico peru",
    "tours famosos peru",
    "agencia viajes cusco",
    "tours culturales peru",
    "Cabanaconde transportes",
    "cabanaconde buss",
  ],
  authors: [{ name: "Inca Travel Peru" }],
  creator: "Inca Travel Peru",
  publisher: "Inca Travel Peru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    alternateLocale: ["en_US", "fr_FR", "de_DE", "it_IT"],
    url: "https://incatravelperu.com",
    siteName: "Inca Travel Peru",
    title: "Inca Travel Peru - Agencia de Turismo | Tours Cusco, Cabanaconde, Arequipa",
    description:
      "Agencia de turismo líder en Perú. Tours a Cusco, Cabanaconde, Arequipa, Machu Picchu. Transporte seguro Cabanaconde-Cusco. Reserva online.",
    images: [
      {
        url: "/screenshot/image.png",
        width: 1200,
        height: 630,
        alt: "Inca Travel Peru - Tours y Transporte en Perú",
      },
      {
        url: "/screenshot/image.png",
        width: 1200,
        height: 1200,
        alt: "Inca Travel Peru - Agencia de Turismo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@IncaTravelPeru",
    creator: "@IncaTravelPeru",
    title: "Inca Travel Peru - Agencia de Turismo | Tours Cusco, Cabanaconde",
    description: "Tours a Cusco, Cabanaconde, Arequipa, Machu Picchu. Transporte seguro y paquetes turísticos en Perú.",
    images: ["/twitter.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://incatravelperu.com",
    languages: {
      "es-PE": "https://incatravelperu.com",
      es: "https://incatravelperu.com/es",
      en: "https://incatravelperu.com/en",
      fr: "https://incatravelperu.com/fr",
      de: "https://incatravelperu.com/de",
      it: "https://incatravelperu.com/it",
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  category: "travel",
  classification: "Tourism Agency",
  other: {
    "geo.region": "PE",
    "geo.placename": "Arequipa, Peru",
    "geo.position": "-16.3988;-71.5369",
    ICBM: "-16.3988, -71.5369",
    "DC.title": "Inca Travel Peru - Agencia de Turismo en Arequipa",
    "DC.creator": "Inca Travel Peru",
    "DC.subject": "Tours Arequipa, Turismo, Cabanaconde, Cusco, Perú",
    "DC.description": "Agencia de turismo con sede en Arequipa especializada en tours por Perú.",
    rating: "general",
    distribution: "global",
    "revisit-after": "7 days",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        {/* Hreflang para SEO internacional */}
        <link rel="alternate" hrefLang="es" href="https://incatravelperu.com/es" />
        <link rel="alternate" hrefLang="en" href="https://incatravelperu.com/en" />
        <link rel="alternate" hrefLang="fr" href="https://incatravelperu.com/fr" />
        <link rel="alternate" hrefLang="de" href="https://incatravelperu.com/de" />
        <link rel="alternate" hrefLang="it" href="https://incatravelperu.com/it" />
        <link rel="alternate" hrefLang="x-default" href="https://incatravelperu.com" />

        {/* Optimización carga de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Prefetch DNS externos */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Iconos y manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/faviphone.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Schema para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Inca Travel Peru",
              description:
                "Agencia de turismo líder en Perú especializada en tours a Cusco, Cabanaconde, Arequipa y Machu Picchu",
              url: "https://incatravelperu.com",
              logo: "https://incatravelperu.com/logo.png",
              image: "https://incatravelperu.com/screenshot/image.png",
              telephone: "+51-996-407-040",
              email: "incatravelperu21@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Calle San Agustín 210",
                addressLocality: "Arequipa",
                postalCode: "04012",
                addressCountry: "PE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -16.3988,
                longitude: -71.5369,
              },
              openingHours: "Mo-Su 08:00-20:00",
              priceRange: "$$",
              servesCuisine: "Peruvian",
              areaServed: {
                "@type": "Country",
                name: "Peru",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Tours y Paquetes Turísticos",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "TouristTrip",
                      name: "Tours a Cusco y Machu Picchu",
                      description: "Tours completos a Cusco, Valle Sagrado y Machu Picchu",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "TouristTrip",
                      name: "Transporte Cabanaconde - Cusco",
                      description: "Servicio de transporte directo entre Cabanaconde y Cusco",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "TouristTrip",
                      name: "Tours Cañón del Colca",
                      description: "Aventuras en el Cañón del Colca desde Arequipa",
                    },
                  },
                ],
              },
              sameAs: [
                "https://www.facebook.com/IncaTravelPeru",
                "https://www.instagram.com/incatravelperu",
                "https://www.twitter.com/InkaTravelPeru",
                "https://www.youtube.com/InkaTravelPeru",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
         <LanguageProvider>
           <main className="relative">{children}</main>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#374151",
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
