import { Suspense } from "react"
import UserProfileContent from "@/components/users/user-profile-content"
import { Loader2 } from 'lucide-react'

export default function UserProfilePage() {
  return (
    <Suspense fallback={<UserProfileFallback />}>
      <UserProfileContent />
    </Suspense>
  )
}

function UserProfileFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-24 md:pt-32 pb-8 flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    </div>
  )
}
