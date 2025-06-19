"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Star, Users, Calendar } from "lucide-react"

// Tours data organizados por categorías
const toursByCategory = {
  Arqueología: [
    {
      id: 1,
      title: "MACHU PICCHU",
      subtitle: "La ciudadela perdida de los Incas",
      description:
        "Descubre la majestuosa ciudadela inca en una experiencia única que combina historia, naturaleza y aventura en el corazón de los Andes peruanos.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      price: 899,
      duration: "4D/3N",
      rating: 4.9,
      reviews: 234,
      location: "Cusco",
      region: "Cusco",
      category: "Arqueología",
      difficulty: "Moderado" as const,
      featured: true,
      tourType: "Premium" as const,
      groupSize: "2-12 personas",
      nextDeparture: "2024-12-15",
      highlights: ["Machu Picchu", "Valle Sagrado", "Tren panorámico"],
    },
    {
      id: 2,
      title: "VALLE SAGRADO",
      subtitle: "Pisac, Ollantaytambo y más",
      description:
        "Explora los pueblos ancestrales del Valle Sagrado, donde la cultura inca sigue viva en cada rincón y las tradiciones se mantienen intactas.",
      image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
      price: 799,
      duration: "3D/2N",
      rating: 4.8,
      reviews: 167,
      location: "Cusco",
      region: "Cusco",
      category: "Arqueología",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-16 personas",
      nextDeparture: "2024-12-10",
      highlights: ["Pisac", "Ollantaytambo", "Mercados locales"],
    },
    {
      id: 3,
      title: "CHACHAPOYAS",
      subtitle: "Fortaleza de Kuelap",
      description:
        "Aventúrate en la misteriosa fortaleza de Kuelap, conocida como el 'Machu Picchu del norte', rodeada de bosques nubosos únicos.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      price: 1099,
      duration: "4D/3N",
      rating: 4.6,
      reviews: 134,
      location: "Chachapoyas",
      region: "Amazonas",
      category: "Arqueología",
      difficulty: "Moderado" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-10 personas",
      nextDeparture: "2024-12-20",
      highlights: ["Fortaleza Kuelap", "Sarcófagos de Karajía", "Catarata Gocta"],
    },
    {
      id: 4,
      title: "SILLUSTANI",
      subtitle: "Torres funerarias pre-incas",
      description:
        "Visita las impresionantes torres funerarias de Sillustani, testimonio de la avanzada cultura Colla en las orillas del lago Umayo.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
      price: 299,
      duration: "1D",
      rating: 4.4,
      reviews: 145,
      location: "Puno",
      region: "Puno",
      category: "Arqueología",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Básico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-05",
      highlights: ["Torres funerarias", "Lago Umayo", "Cultura Colla"],
    },
    {
      id: 17,
      title: "SACSAYHUAMÁN",
      subtitle: "Fortaleza inca de Cusco",
      description:
        "Explora la impresionante fortaleza inca con bloques de piedra perfectamente ensamblados, testimonio de la ingeniería inca.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      price: 199,
      duration: "1D",
      rating: 4.5,
      reviews: 189,
      location: "Cusco",
      region: "Cusco",
      category: "Arqueología",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Básico" as const,
      groupSize: "2-25 personas",
      nextDeparture: "2024-12-03",
      highlights: ["Sacsayhuamán", "Qenqo", "Tambomachay"],
    },
    {
      id: 18,
      title: "CARAL",
      subtitle: "La civilización más antigua de América",
      description:
        "Descubre la ciudad sagrada de Caral, la civilización más antigua del continente americano con más de 5000 años de antigüedad.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      price: 399,
      duration: "1D",
      rating: 4.3,
      reviews: 76,
      location: "Lima",
      region: "Lima",
      category: "Arqueología",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-11",
      highlights: ["Ciudad sagrada Caral", "Pirámides", "Museo de sitio"],
    },
  ],
  Naturaleza: [
    {
      id: 5,
      title: "AMAZONAS",
      subtitle: "Inmersión en la selva tropical",
      description:
        "Sumérgete en la biodiversidad amazónica más rica del planeta, donde cada día trae nuevos descubrimientos de flora y fauna únicas.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      price: 1599,
      duration: "6D/5N",
      rating: 4.7,
      reviews: 156,
      location: "Iquitos",
      region: "Loreto",
      category: "Naturaleza",
      difficulty: "Fácil" as const,
      featured: true,
      tourType: "Premium" as const,
      groupSize: "2-8 personas",
      nextDeparture: "2024-12-12",
      highlights: ["Río Amazonas", "Observación de delfines", "Comunidades nativas"],
    },
    {
      id: 6,
      title: "PACAYA SAMIRIA",
      subtitle: "Reserva Nacional del Amazonas",
      description:
        "Explora la reserva nacional más grande del Perú, hogar de jaguares, manatíes y más de 500 especies de aves en su hábitat natural.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      price: 1299,
      duration: "4D/3N",
      rating: 4.8,
      reviews: 92,
      location: "Iquitos",
      region: "Loreto",
      category: "Naturaleza",
      difficulty: "Moderado" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-12 personas",
      nextDeparture: "2024-12-18",
      highlights: ["Reserva Pacaya Samiria", "Pesca de pirañas", "Caminatas nocturnas"],
    },
    {
      id: 7,
      title: "MANU",
      subtitle: "Parque Nacional del Manu",
      description:
        "Descubre uno de los lugares con mayor biodiversidad del mundo, donde conviven más de 1000 especies de aves y 200 de mamíferos.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      price: 1899,
      duration: "7D/6N",
      rating: 4.9,
      reviews: 78,
      location: "Cusco",
      region: "Madre de Dios",
      category: "Naturaleza",
      difficulty: "Moderado" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-8 personas",
      nextDeparture: "2024-12-22",
      highlights: ["Parque Nacional Manu", "Collpa de guacamayos", "Observación de jaguares"],
    },
    {
      id: 8,
      title: "TAMBOPATA",
      subtitle: "Reserva Nacional Tambopata",
      description:
        "Vive la experiencia amazónica más accesible desde Puerto Maldonado, con lodges de lujo en medio de la selva virgen.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      price: 999,
      duration: "3D/2N",
      rating: 4.5,
      reviews: 123,
      location: "Puerto Maldonado",
      region: "Madre de Dios",
      category: "Naturaleza",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-16 personas",
      nextDeparture: "2024-12-08",
      highlights: ["Lago Sandoval", "Canopy walk", "Observación de nutrias"],
    },
    {
      id: 19,
      title: "PARACAS",
      subtitle: "Reserva Nacional y vida marina",
      description:
        "Explora la reserva nacional costera más importante del Perú, hogar de lobos marinos, pingüinos y aves guaneras.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
      price: 449,
      duration: "2D/1N",
      rating: 4.4,
      reviews: 167,
      location: "Paracas",
      region: "Ica",
      category: "Naturaleza",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-06",
      highlights: ["Islas Ballestas", "Reserva Nacional", "Candelabro de Paracas"],
    },
    {
      id: 20,
      title: "HUASCARÁN",
      subtitle: "Parque Nacional Huascarán",
      description:
        "Descubre la cordillera tropical más alta del mundo, con glaciares, lagunas turquesas y una biodiversidad única de alta montaña.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      price: 799,
      duration: "3D/2N",
      rating: 4.6,
      reviews: 134,
      location: "Huaraz",
      region: "Ancash",
      category: "Naturaleza",
      difficulty: "Moderado" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-12 personas",
      nextDeparture: "2024-12-19",
      highlights: ["Laguna 69", "Nevado Huascarán", "Pastoruri"],
    },
  ],
  Aventura: [
    {
      id: 9,
      title: "CAMINO INCA",
      subtitle: "Trekking por la ruta ancestral",
      description:
        "Recorre el legendario sendero inca hasta Machu Picchu, siguiendo los pasos de los antiguos chasquis en una aventura épica.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
      price: 1299,
      duration: "5D/4N",
      rating: 4.8,
      reviews: 189,
      location: "Cusco",
      region: "Cusco",
      category: "Aventura",
      difficulty: "Difícil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-12 personas",
      nextDeparture: "2024-12-14",
      highlights: ["Camino Inca clásico", "Paso Warmiwañusca", "Wiñay Wayna"],
    },
    {
      id: 10,
      title: "VALLE DEL COLCA",
      subtitle: "El cañón más profundo del Perú",
      description:
        "Contempla el majestuoso vuelo de los cóndores en el segundo cañón más profundo del mundo, rodeado de terrazas ancestrales.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
      price: 899,
      duration: "3D/2N",
      rating: 4.9,
      reviews: 87,
      location: "Arequipa",
      region: "Arequipa",
      category: "Aventura",
      difficulty: "Difícil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-14 personas",
      nextDeparture: "2024-12-16",
      highlights: ["Cruz del Cóndor", "Aguas termales", "Pueblos coloniales"],
    },
    {
      id: 11,
      title: "HUACACHINA",
      subtitle: "Aventura en el desierto",
      description:
        "Experimenta la adrenalina del sandboarding y los paseos en buggy en el único oasis natural de América del Sur.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
      price: 399,
      duration: "2D/1N",
      rating: 4.3,
      reviews: 78,
      location: "Ica",
      region: "Ica",
      category: "Aventura",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Básico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-06",
      highlights: ["Oasis de Huacachina", "Sandboarding", "Paseos en buggy"],
    },
    {
      id: 12,
      title: "COTAHUASI",
      subtitle: "El cuarto cañón más profundo del planeta",
      description:
        "Descubre el cañón más profundo de América, con paisajes dramáticos, aguas termales y una biodiversidad única.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      price: 899,
      duration: "4D/3N",
      rating: 4.7,
      reviews: 201,
      location: "Arequipa",
      region: "Arequipa",
      category: "Aventura",
      difficulty: "Moderado" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-10 personas",
      nextDeparture: "2024-12-25",
      highlights: ["Cañón de Cotahuasi", "Cascadas de Sipia", "Baños termales"],
    },
    {
      id: 21,
      title: "SALKANTAY",
      subtitle: "Trekking alternativo a Machu Picchu",
      description:
        "Recorre la ruta alternativa más espectacular hacia Machu Picchu, pasando por el nevado Salkantay y paisajes diversos.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
      price: 999,
      duration: "5D/4N",
      rating: 4.7,
      reviews: 156,
      location: "Cusco",
      region: "Cusco",
      category: "Aventura",
      difficulty: "Difícil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-14 personas",
      nextDeparture: "2024-12-17",
      highlights: ["Nevado Salkantay", "Laguna Humantay", "Llactapata"],
    },
    {
      id: 22,
      title: "CHOQUEQUIRAO",
      subtitle: "La hermana sagrada de Machu Picchu",
      description:
        "Aventúrate en el trekking más desafiante del Perú hacia la ciudadela inca menos visitada pero igualmente impresionante.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop",
      price: 1599,
      duration: "7D/6N",
      rating: 4.9,
      reviews: 67,
      location: "Cusco",
      region: "Cusco",
      category: "Aventura",
      difficulty: "Difícil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-8 personas",
      nextDeparture: "2024-12-28",
      highlights: ["Choquequirao", "Cañón del Apurímac", "Terrazas incas"],
    },
  ],
  Cultural: [
    {
      id: 13,
      title: "LAGO TITICACA",
      subtitle: "Islas flotantes y cultura viva",
      description:
        "Navega por el lago navegable más alto del mundo y conoce las tradiciones milenarias de los uros y taquileños.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
      price: 649,
      duration: "3D/2N",
      rating: 4.6,
      reviews: 98,
      location: "Puno",
      region: "Puno",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-18 personas",
      nextDeparture: "2024-12-09",
      highlights: ["Islas flotantes Uros", "Isla Taquile", "Textilería tradicional"],
    },
    {
      id: 14,
      title: "AREQUIPA",
      subtitle: "Ciudad Blanca del Perú",
      description:
        "Explora la arquitectura colonial de sillar blanco y degusta la exquisita gastronomía arequipeña en la ciudad de los volcanes.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
      price: 549,
      duration: "2D/1N",
      rating: 4.5,
      reviews: 123,
      location: "Arequipa",
      region: "Arequipa",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-07",
      highlights: ["Monasterio Santa Catalina", "Volcán Misti", "Gastronomía local"],
    },
    {
      id: 15,
      title: "TRUJILLO",
      subtitle: "Ciudad de la Eterna Primavera",
      description:
        "Descubre las culturas Moche y Chimú en esta ciudad colonial, famosa por sus huacas y la ciudadela de Chan Chan.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      price: 699,
      duration: "3D/2N",
      rating: 4.6,
      reviews: 167,
      location: "Trujillo",
      region: "La Libertad",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Premium" as const,
      groupSize: "2-16 personas",
      nextDeparture: "2024-12-13",
      highlights: ["Chan Chan", "Huacas del Sol y Luna", "Playa Huanchaco"],
    },
    {
      id: 16,
      title: "LIMA HISTÓRICA",
      subtitle: "Centro histórico y gastronomía",
      description:
        "Recorre el centro histórico de Lima, Patrimonio de la Humanidad, y disfruta de la mejor gastronomía del mundo.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      price: 299,
      duration: "1D",
      rating: 4.4,
      reviews: 234,
      location: "Lima",
      region: "Lima",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Básico" as const,
      groupSize: "2-25 personas",
      nextDeparture: "2024-12-04",
      highlights: ["Centro histórico", "Tour gastronómico", "Museos coloniales"],
    },
    {
      id: 23,
      title: "CHINCHERO",
      subtitle: "Pueblo textil del Valle Sagrado",
      description:
        "Conoce las técnicas ancestrales de textilería andina en este pintoresco pueblo donde el tiempo se detuvo.",
      image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1000&auto=format&fit=crop",
      price: 199,
      duration: "1D",
      rating: 4.3,
      reviews: 89,
      location: "Cusco",
      region: "Cusco",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Básico" as const,
      groupSize: "2-20 personas",
      nextDeparture: "2024-12-05",
      highlights: ["Textilería tradicional", "Mercado dominical", "Iglesia colonial"],
    },
    {
      id: 24,
      title: "AYACUCHO",
      subtitle: "Cuna de la artesanía peruana",
      description:
        "Descubre la ciudad de las 33 iglesias, famosa por su Semana Santa y sus increíbles retablos ayacuchanos.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      price: 599,
      duration: "3D/2N",
      rating: 4.5,
      reviews: 112,
      location: "Ayacucho",
      region: "Ayacucho",
      category: "Cultural",
      difficulty: "Fácil" as const,
      featured: false,
      tourType: "Clásico" as const,
      groupSize: "2-18 personas",
      nextDeparture: "2024-12-21",
      highlights: ["Iglesias coloniales", "Retablos ayacuchanos", "Artesanía local"],
    },
  ],
}

const categories = ["Arqueología", "Naturaleza", "Aventura", "Cultural"]

// Componente para el texto circular giratorio
const SpinningText = ({ text = "RESERVAR • RESERVAR • " }: { text?: string }) => {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <path id="circle" d="M 50, 50 m -28, 0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
          </defs>
          <text className="text-[6px] md:text-[8px] lg:text-[10px] fill-white font-medium tracking-wider brand-text">
            <textPath href="#circle" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const [activeCategory, setActiveCategory] = useState("Arqueología")
  const [currentTours, setCurrentTours] = useState<(typeof toursByCategory)[keyof typeof toursByCategory]>(
    toursByCategory["Arqueología"],
  )

  useEffect(() => {
    setCurrentTours(toursByCategory[activeCategory as keyof typeof toursByCategory])
  }, [activeCategory])

  const getCategoryTitle = (category: string) => {
    const titles = {
      Arqueología: "Descubre las Maravillas Arqueológicas del Perú",
      Naturaleza: "Explora la Biodiversidad Natural del Perú",
      Aventura: "Vive Aventuras Extremas en el Perú",
      Cultural: "Sumérgete en la Cultura Viva del Perú",
    }
    return titles[category as keyof typeof titles]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Compacto */}
      <div className="pt-32 pb-4 md:pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-black leading-none brand-text">
              Tours del Perú
            </h1>
            <p className="text-base md:text-lg text-gray-600 mt-2 body-text max-w-2xl">
              Descubre los destinos más increíbles del Perú
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <div className="flex flex-wrap gap-2 md:gap-0">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium tracking-wider transition-all duration-300 md:border-r border-gray-300 last:border-r-0 ${
                    activeCategory === category
                      ? "bg-black text-white"
                      : "bg-gray-100 md:bg-white text-black hover:bg-gray-200 md:hover:bg-gray-100"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Section Title */}
          <motion.div
            key={`section-title-${activeCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-black leading-tight">
              {getCategoryTitle(activeCategory)}
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Tours Grid - Ocupa toda la pantalla */}
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={`tours-grid-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {currentTours.map((tour, index) => (
              <motion.div
                key={`tour-${tour.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/tours/${tour.id}`}>
                  <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={tour.image || "/placeholder.svg"}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-peru-orange rounded-full"></div>
                        <span className="text-xs font-medium text-gray-800 brand-text">{tour.category}</span>
                        <span className="text-xs text-gray-500 body-text">{formatDate(tour.nextDeparture)}</span>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {tour.featured === true && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-peru-gold text-white px-3 py-1.5 text-xs font-medium brand-text">
                          DESTACADO
                        </div>
                      </div>
                    )}

                    {/* Spinning Text - Aparece en hover */}
                    <div className="absolute top-16 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                      <SpinningText />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                      {/* Top Section - Title */}
                      <div className="mt-12 md:mt-16">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white brand-text mb-2 leading-tight">
                          {tour.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base body-text mb-3 leading-relaxed">
                          {tour.subtitle}
                        </p>
                      </div>

                      {/* Middle Section - Description (visible en hover) */}
                      <div className="flex-1 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <p className="text-white/90 text-sm md:text-base body-text leading-relaxed line-clamp-3">
                          {tour.description}
                        </p>
                      </div>

                      {/* Bottom Section - Tour Info */}
                      <div className="bg-black/60 backdrop-blur-sm p-4 md:p-5 space-y-3">
                        {/* Price and Duration */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl md:text-2xl font-bold text-white brand-text">${tour.price}</span>
                            <span className="text-white/70 text-sm ml-2 body-text">por persona</span>
                          </div>
                          <div className="flex items-center text-white/90 text-sm">
                            <Clock size={16} className="mr-1" />
                            <span className="body-text">{tour.duration}</span>
                          </div>
                        </div>

                        {/* Location and Rating */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-white/90 text-sm">
                            <MapPin size={16} className="mr-1" />
                            <span className="body-text">{tour.location}</span>
                          </div>
                          <div className="flex items-center text-white/90 text-sm">
                            <Star size={16} className="mr-1 text-yellow-400 fill-current" />
                            <span className="body-text">
                              {tour.rating} ({tour.reviews})
                            </span>
                          </div>
                        </div>

                        {/* Group Size and Difficulty */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-white/90 text-sm">
                            <Users size={16} className="mr-1" />
                            <span className="body-text">{tour.groupSize}</span>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs brand-text ${
                              tour.difficulty === "Fácil"
                                ? "bg-green-500 text-white"
                                : tour.difficulty === "Moderado"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                            }`}
                          >
                            {tour.difficulty}
                          </span>
                        </div>

                        {/* Next Departure */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/20">
                          <div className="flex items-center text-white/90 text-sm">
                            <Calendar size={16} className="mr-1" />
                            <span className="body-text">Próxima salida</span>
                          </div>
                          <span className="text-white text-sm font-medium brand-text">
                            {formatDate(tour.nextDeparture)}
                          </span>
                        </div>

                        {/* Tour Type */}
                        <div className="flex justify-center pt-2">
                          <span
                            className={`px-3 py-1 text-xs brand-text ${
                              tour.tourType === "Premium"
                                ? "bg-peru-gold text-white"
                                : tour.tourType === "Clásico"
                                  ? "bg-peru-orange text-white"
                                  : "bg-gray-600 text-white"
                            }`}
                          >
                            {tour.tourType}
                          </span>
                        </div>

                        {/* Highlights - Visible en hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 pt-2 border-t border-white/20">
                          <div className="flex flex-wrap gap-1">
                            {tour.highlights.slice(0, 3).map((highlight, idx) => (
                              <span key={idx} className="text-xs bg-white/20 text-white px-2 py-1 body-text">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-peru-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8 md:h-12"></div>
    </div>
  )
}
