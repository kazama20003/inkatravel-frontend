"use client"

import { Button } from "@/components/ui/button"
import Image from 'next/image';
export default function ContactSection() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Left Side - Image */}
        <div className="lg:col-span-3 relative h-[50vh] sm:h-[60vh] lg:h-screen">
          {/* Circular Badge */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-white/90 backdrop-blur-sm">
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                ENQUIRE
                <br />
                NOW
              </span>
            </div>
          </div>

          {/* Main Image */}
          <div className="w-full h-full relative overflow-hidden">
            <Image
        src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750114576/uploads/sgqkf6xncugoizwfbv7o.jpg"
        alt="Safari landscape with acacia tree at sunset"
        fill
        className="object-cover"
        priority // opcional: carga prioritaria
      />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="lg:col-span-2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-0 lg:h-screen">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full max-w-none">
            {/* Main Title */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 leading-tight">
                Start planning your tailor-made holiday
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">Speak to one of our travel specialists</p>
            </div>

            {/* Buttons */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <Button
                className="w-full bg-navy-900 hover:bg-navy-800 text-white py-4 sm:py-5 lg:py-6 px-6 sm:px-8 text-sm sm:text-base font-medium tracking-wider"
                size="lg"
              >
                ENQUIRE NOW
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-4 sm:py-5 lg:py-6 px-6 sm:px-8 text-sm sm:text-base font-medium tracking-wider bg-white hover:bg-gray-50"
                size="lg"
              >
                CALL US
              </Button>
            </div>

            {/* Available Now */}
            <div className="flex items-center space-x-3 lg:space-x-4 pt-2 sm:pt-4 lg:pt-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                  <Image
  src="https://res.cloudinary.com/dwvikvjrq/image/upload/v1750114576/uploads/sgqkf6xncugoizwfbv7o.jpg"
  alt="Travel specialist"
  width={800} // Ajusta según tu diseño
  height={600} // Ajusta según tu diseño
  className="w-full h-full object-cover"
/>
                </div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 tracking-wider">
                AVAILABLE NOW
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
