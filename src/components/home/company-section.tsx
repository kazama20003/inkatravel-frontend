"use client"

import { useLanguage } from "@/contexts/LanguageContext"

const translations = {
  es: {
    title: "Inka Travel Peru",
    subtitle: "Agencia de Transportes y Turismo",
    description:
      "Inka Travel Peru es una empresa de transportes y turismo galardonada que se especializa en servicios de transporte de calidad, paquetes turísticos personalizados y experiencias únicas por todo el Perú. Ofrecemos los mejores transportes para turistas con calidad garantizada.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "CERO",
      zeroText: "CARGOS EXTRA",
      hundred: "100%",
      hundredText: "CALIDAD GARANTIZADA",
    },
  },
  en: {
    title: "Inka Travel Peru",
    subtitle: "Transport and Tourism Agency",
    description:
      "Inka Travel Peru is an award-winning transport and tourism company that specializes in quality transport services, personalized tourist packages and unique experiences throughout Peru. We offer the best transport for tourists with guaranteed quality.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "ZERO",
      zeroText: "EXTRA CHARGES",
      hundred: "100%",
      hundredText: "GUARANTEED QUALITY",
    },
  },
  fr: {
    title: "Inka Travel Peru",
    subtitle: "Agence de Transport et Tourisme",
    description:
      "Inka Travel Peru est une entreprise de transport et de tourisme primée qui se spécialise dans les services de transport de qualité, les forfaits touristiques personnalisés et les expériences uniques à travers le Pérou. Nous offrons les meilleurs transports pour les touristes avec une qualité garantie.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "ZÉRO",
      zeroText: "FRAIS SUPPLÉMENTAIRES",
      hundred: "100%",
      hundredText: "QUALITÉ GARANTIE",
    },
  },
  de: {
    title: "Inka Travel Peru",
    subtitle: "Transport- und Tourismusagentur",
    description:
      "Inka Travel Peru ist ein preisgekröntes Transport- und Tourismusunternehmen, das sich auf hochwertige Transportdienstleistungen, personalisierte Tourismuspakete und einzigartige Erfahrungen in ganz Peru spezialisiert hat. Wir bieten die besten Transporte für Touristen mit garantierter Qualität.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "NULL",
      zeroText: "ZUSATZKOSTEN",
      hundred: "100%",
      hundredText: "GARANTIERTE QUALITÄT",
    },
  },
  nl: {
    title: "Inka Travel Peru",
    subtitle: "Transport en Toerisme Bureau",
    description:
      "Inka Travel Peru is een bekroond transport- en toerismebedrijf dat gespecialiseerd is in kwaliteitsvervoersdiensten, gepersonaliseerde toerismepakketten en unieke ervaringen door heel Peru. Wij bieden het beste vervoer voor toeristen met gegarandeerde kwaliteit.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "NUL",
      zeroText: "EXTRA KOSTEN",
      hundred: "100%",
      hundredText: "GEGARANDEERDE KWALITEIT",
    },
  },
  it: {
    title: "Inka Travel Peru",
    subtitle: "Agenzia di Trasporti e Turismo",
    description:
      "Inka Travel Peru è un'azienda di trasporti e turismo pluripremiata specializzata in servizi di trasporto di qualità, pacchetti turistici personalizzati ed esperienze uniche in tutto il Perù. Offriamo i migliori trasporti per turisti con qualità garantita.",
    stats: {
      atol: "ATOL",
      atolNumber: "NO 12034",
      zero: "ZERO",
      zeroText: "COSTI EXTRA",
      hundred: "100%",
      hundredText: "QUALITÀ GARANTITA",
    },
  },
}

export default function CompanySection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="relative py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-12">
          <div className="flex-1 h-px bg-gray-400 max-w-20"></div>
          <div className="mx-6 inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
            <span className="text-xl font-bold text-white font-serif">I</span>
          </div>
          <div className="flex-1 h-px bg-gray-400 max-w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-xl text-gray-700 leading-relaxed font-light">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16">
          {/* ATOL Badge */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 border border-gray-300 rounded-full flex flex-col items-center justify-center relative">
              <div className="absolute -top-2 -right-2 text-orange-500 text-lg">+</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{t.stats.atol}</div>
              <div className="text-sm text-gray-500 font-light">{t.stats.atolNumber}</div>
            </div>
          </div>

          {/* Zero Extra Charges Badge */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 border border-gray-300 rounded-full flex flex-col items-center justify-center relative">
              <div className="absolute -top-2 -right-2 text-orange-500 text-lg">⊖</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{t.stats.zero}</div>
              <div className="text-sm text-gray-500 font-light">{t.stats.zeroText}</div>
            </div>
          </div>

          {/* 100% Quality Badge */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 border border-gray-300 rounded-full flex flex-col items-center justify-center relative">
              <div className="absolute -top-2 -right-2 text-orange-500 text-lg">+</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{t.stats.hundred}</div>
              <div className="text-sm text-gray-500 font-light">{t.stats.hundredText}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
