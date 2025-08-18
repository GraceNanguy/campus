"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // IDs d'admin autorisés (en production, ça serait dans une base de données)
  const validAdmins = {
    PROF001: { name: "Marie Dubois", password: "admin123" },
    PROF002: { name: "Thomas Martin", password: "admin123" },
    PROF003: { name: "Sophie Laurent", password: "admin123" },
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulation d'une vérification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (validAdmins[adminId] && validAdmins[adminId].password === password) {
      // Stocker les infos admin (en production, utiliser des tokens JWT)
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: adminId,
          name: validAdmins[adminId].name,
        }),
      )
      router.push("/admin/dashboard")
    } else {
      setError("ID administrateur ou mot de passe incorrect")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center mx-auto">
            <Image src="/logo-placeholder.png" alt="AY E-ACADEMIE Logo" width={48} height={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Administration AY E-ACADEMIE</h1>
            <p className="text-muted-foreground">Accès réservé aux professeurs</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Connexion Administrateur</span>
            </CardTitle>
            <CardDescription>Connectez-vous avec votre ID professeur</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">ID Administrateur</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="PROF001"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Infos de test */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Comptes de test :</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>ID: PROF001 - Marie Dubois</p>
              <p>ID: PROF002 - Thomas Martin</p>
              <p>ID: PROF003 - Sophie Laurent</p>
              <p className="mt-2 font-medium">Mot de passe: admin123</p>
            </div>
          </CardContent>
        </Card>

        {/* Retour au site */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/">← Retour au site principal</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
