"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo animé */}
        <div className="relative">
          <div className="w-24 h-24 flex items-center justify-center mx-auto">
            <Image
              src="/logo-placeholder.png"
              alt="AY E-ACADEMIE Logo"
              width={64}
              height={64}
              className="animate-pulse"
            />
          </div>
        </div>

        {/* Nom de l'app */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AY E-ACADEMIE</h1>
          <p className="text-muted-foreground">Votre plateforme d'apprentissage</p>
        </div>

        {/* Barre de progression */}
        <div className="w-64 mx-auto space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Chargement... {progress}%</p>
        </div>
      </div>
    </div>
  )
}
