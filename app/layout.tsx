import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import RootNav from "@/components/root-nav"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "AY E-CAMPUS - Youth Education",
  description: "Des cours modernes pour apprendre les compétences de demain.",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <AuthProvider>
          <RootNav />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
