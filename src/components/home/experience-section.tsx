"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
export default function ExperienceSection() {
  const { language } = useLanguage()

  const content = {
  es: {
    title: "Cómo Funciona Tu Experiencia",
    steps: [
      { number: "01", title: "Busca tu Transporte", description: "Encuentra el transporte perfecto para tu destino" },
      { number: "02", title: "Planifica tu Tour", description: "Organiza tu itinerario con nuestros expertos" },
      { number: "03", title: "Escoge tu Destino Ideal", description: "Selecciona entre los mejores destinos del Perú" },
      { number: "04", title: "Disfruta", description: "Vive una experiencia inolvidable" },
    ],
  },
  en: {
    title: "How Your Experience Works",
    steps: [
      { number: "01", title: "Find your Transport", description: "Find the perfect transport for your destination" },
      { number: "02", title: "Plan your Tour", description: "Organize your itinerary with our experts" },
      { number: "03", title: "Choose your Ideal Destination", description: "Select from the best destinations in Peru" },
      { number: "04", title: "Enjoy", description: "Live an unforgettable experience" },
    ],
  },
  fr: {
    title: "Comment Fonctionne Votre Expérience",
    steps: [
      { number: "01", title: "Trouvez votre Transport", description: "Trouvez le transport parfait pour votre destination" },
      { number: "02", title: "Planifiez votre Tour", description: "Organisez votre itinéraire avec nos experts" },
      { number: "03", title: "Choisissez votre Destination Idéale", description: "Sélectionnez parmi les meilleures destinations du Pérou" },
      { number: "04", title: "Profitez", description: "Vivez une expérience inoubliable" },
    ],
  },
  de: {
    title: "Wie Ihre Erfahrung Funktioniert",
    steps: [
      { number: "01", title: "Finde deinen Transport", description: "Finde den perfekten Transport zu deinem Ziel" },
      { number: "02", title: "Plane deine Tour", description: "Organisiere deinen Reiseplan mit unseren Experten" },
      { number: "03", title: "Wähle dein Ideales Reiseziel", description: "Wähle aus den besten Reisezielen in Peru" },
      { number: "04", title: "Genieße", description: "Erlebe ein unvergessliches Abenteuer" },
    ],
  },
  it: {
    title: "Come Funziona la Tua Esperienza",
    steps: [
      { number: "01", title: "Cerca il tuo Trasporto", description: "Trova il trasporto perfetto per la tua destinazione" },
      { number: "02", title: "Pianifica il tuo Tour", description: "Organizza il tuo itinerario con i nostri esperti" },
      { number: "03", title: "Scegli la Tua Destinazione Ideale", description: "Seleziona tra le migliori destinazioni del Perù" },
      { number: "04", title: "Goditi l’Esperienza", description: "Vivi un’esperienza indimenticabile" },
    ],
  }
}


  const currentContent = content[language as keyof typeof content] || content.es

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
          <Image
        src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750785978/uploads/zmtuozoralox9ph91ol0.jpg"          // archivo en /public
        alt="Peru landscape"
        fill                            // hace que la imagen llene el contenedor padre
        className="object-cover"        // equivalente a object-fit: cover
        priority                        // opcional: carga prioritaria
        unoptimized={false}             // por defecto está optimizada; para SVG no hace mucho
      />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 text-balance">{currentContent.title}</h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
          {currentContent.steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-full transition-all duration-300 hover:bg-white/20 hover:scale-105">
                <div className="text-6xl font-bold text-amber-400 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < currentContent.steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-amber-400/50 transform -translate-y-1/2 translate-x-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
