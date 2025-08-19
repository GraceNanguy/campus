"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#141835] mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null // La redirection sera gérée par le useEffect
  }

  return <>{children}</>
}
