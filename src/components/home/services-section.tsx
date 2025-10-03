"use client"
import Image from "next/image"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ServicesSection() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState(3) // Default to "EMPRESA FAMILIAR"

 const content = {
  es: {
    title: "NUESTROS SERVICIOS",
    subtitle: "Itinerarios a medida, creados por nuestros expertos",
    tabs: ["A MEDIDA", "GUÍAS EXPERTOS", "GARANTÍA PRECIO", "EMPRESA FAMILIAR", "COMPENSACIÓN CARBONO"],
    tabContent: [
      { title: "A MEDIDA", description: "Creamos experiencias únicas adaptadas a tus preferencias y necesidades específicas. Cada itinerario es diseñado exclusivamente para ti." },
      { title: "GUÍAS EXPERTOS", description: "Nuestros guías locales certificados te brindarán conocimientos profundos sobre la historia, cultura y tradiciones del Perú." },
      { title: "GARANTÍA PRECIO", description: "Te garantizamos los mejores precios del mercado. Si encuentras una oferta mejor, igualamos el precio sin compromiso." },
      { title: "EMPRESA FAMILIAR", description: "Como empresa familiar, brindamos cuidado personal y atención a cada detalle de tu viaje. Nuestro compromiso con la excelencia abarca generaciones." },
      { title: "COMPENSACIÓN CARBONO", description: "Compensamos el 100% de las emisiones de carbono de tus viajes, contribuyendo a proyectos de reforestación en la Amazonía peruana." },
    ],
  },
  en: {
    title: "OUR SERVICES",
    subtitle: "Tailor-made itineraries, created by our experts",
    tabs: ["TAILOR-MADE", "EXPERT GUIDES", "PRICE GUARANTEE", "FAMILY BUSINESS", "CARBON OFFSET"],
    tabContent: [
      { title: "TAILOR-MADE", description: "We create unique experiences adapted to your preferences and specific needs. Each itinerary is designed exclusively for you." },
      { title: "EXPERT GUIDES", description: "Our certified local guides will provide you with deep knowledge about Peru's history, culture and traditions." },
      { title: "PRICE GUARANTEE", description: "We guarantee you the best prices in the market. If you find a better offer, we match the price without compromise." },
      { title: "FAMILY BUSINESS", description: "As a family business, we provide personal care and attention to every detail of your trip. Our commitment to excellence spans generations." },
      { title: "CARBON OFFSET", description: "We offset 100% of your travel's carbon emissions, contributing to reforestation projects in the Peruvian Amazon." },
    ],
  },
  fr: {
    title: "NOS SERVICES",
    subtitle: "Itinéraires sur mesure, créés par nos experts",
    tabs: ["SUR MESURE", "GUIDES EXPERTS", "GARANTIE PRIX", "ENTREPRISE FAMILIALE", "COMPENSATION CARBONE"],
    tabContent: [
      { title: "SUR MESURE", description: "Nous créons des expériences uniques adaptées à vos préférences et besoins spécifiques. Chaque itinéraire est conçu exclusivement pour vous." },
      { title: "GUIDES EXPERTS", description: "Nos guides locaux certifiés vous fourniront des connaissances approfondies sur l'histoire, la culture et les traditions du Pérou." },
      { title: "GARANTIE PRIX", description: "Nous vous garantissons les meilleurs prix du marché. Si vous trouvez une meilleure offre, nous égalons le prix sans compromis." },
      { title: "ENTREPRISE FAMILIALE", description: "En tant qu'entreprise familiale, nous offrons des soins personnels et une attention à chaque détail de votre voyage. Notre engagement envers l'excellence s'étend sur des générations." },
      { title: "COMPENSATION CARBONE", description: "Nous compensons 100% des émissions de carbone de vos voyages, contribuant aux projets de reforestation en Amazonie péruvienne." },
    ],
  },
  it: {
    title: "I NOSTRI SERVIZI",
    subtitle: "Itinerari su misura, creati dai nostri esperti",
    tabs: ["SU MISURA", "GUIDE ESPERTE", "GARANZIA DEL PREZZO", "AZIENDA FAMILIARE", "COMPENSAZIONE DEL CARBONIO"],
    tabContent: [
      { title: "SU MISURA", description: "Creiamo esperienze uniche adattate alle tue preferenze e necessità specifiche. Ogni itinerario è progettato esclusivamente per te." },
      { title: "GUIDE ESPERTE", description: "Le nostre guide locali certificate ti offriranno conoscenze approfondite sulla storia, cultura e tradizioni del Perù." },
      { title: "GARANZIA DEL PREZZO", description: "Ti garantiamo i migliori prezzi sul mercato. Se trovi un'offerta migliore, eguagliamo il prezzo senza impegno." },
      { title: "AZIENDA FAMILIARE", description: "Come azienda familiare, offriamo cura personale e attenzione a ogni dettaglio del tuo viaggio. Il nostro impegno per l'eccellenza si estende per generazioni." },
      { title: "COMPENSAZIONE DEL CARBONIO", description: "Compensiamo il 100% delle emissioni di carbonio dei tuoi viaggi, contribuendo a progetti di riforestazione nell'Amazzonia peruviana." },
    ],
  },
  de: {
    title: "UNSERE DIENSTLEISTUNGEN",
    subtitle: "Maßgeschneiderte Reisepläne, erstellt von unseren Experten",
    tabs: ["MASSGESCHNEIDERT", "EXPERTENFÜHRER", "PREISGARANTIE", "FAMILIENUNTERNEHMEN", "KOHLESTOFFAUSGLEICH"],
    tabContent: [
      { title: "MASSGESCHNEIDERT", description: "Wir erstellen einzigartige Erlebnisse, die auf Ihre Vorlieben und spezifischen Bedürfnisse zugeschnitten sind. Jeder Reiseplan wird exklusiv für Sie gestaltet." },
      { title: "EXPERTENFÜHRER", description: "Unsere zertifizierten lokalen Guides vermitteln Ihnen tiefgehendes Wissen über Geschichte, Kultur und Traditionen Perus." },
      { title: "PREISGARANTIE", description: "Wir garantieren Ihnen die besten Preise auf dem Markt. Finden Sie ein besseres Angebot, passen wir den Preis ohne Verpflichtung an." },
      { title: "FAMILIENUNTERNEHMEN", description: "Als Familienunternehmen bieten wir persönliche Betreuung und Aufmerksamkeit für jedes Detail Ihrer Reise. Unser Engagement für Exzellenz erstreckt sich über Generationen." },
      { title: "KOHLESTOFFAUSGLEICH", description: "Wir kompensieren 100% der Kohlenstoffemissionen Ihrer Reisen und tragen zu Wiederaufforstungsprojekten im peruanischen Amazonasgebiet bei." },
    ],
  }
};


  const currentContent = content[language as keyof typeof content] || content.es

  return (
    <section className="bg-slate-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
            <span className="text-amber-500">→</span>
            <span>{currentContent.title}</span>
            <span className="text-amber-500">←</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">{currentContent.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {currentContent.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-300 border-b-2 ${
                activeTab === index
                  ? "text-white border-amber-500"
                  : "text-slate-400 border-transparent hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1">
             <Image
      src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750786088/uploads/dla80zhfyecuagcjirwu.jpg"
      alt="Peru landscape"
      width={1920}
      height={1080}
      className="w-full h-80 object-cover rounded-lg"
    />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-3xl font-bold text-white">{currentContent.tabContent[activeTab].title}</h3>
            <p className="text-slate-300 text-lg leading-relaxed">{currentContent.tabContent[activeTab].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
