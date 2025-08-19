"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 1. Se connecter avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        throw new Error('Email ou mot de passe incorrect')
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la connexion')
      }

      // 2. Vérifier si l'utilisateur est un admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id, email, full_name')
        .eq('id', authData.user.id)
        .single()

      if (adminError || !adminData) {
        // Si l'utilisateur n'est pas un admin, le déconnecter
        await supabase.auth.signOut()
        throw new Error('Vous n\'avez pas les droits administrateur')
      }

      // 3. Mettre à jour les métadonnées de l'utilisateur
      await supabase.auth.updateUser({
        data: {
          full_name: adminData.full_name,
          is_admin: true
        }
      })

      // La redirection sera gérée automatiquement par le layout admin
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      console.error('Erreur de connexion:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center mx-auto">
            <Image src="/logo-placeholder.png" alt="AY E-CAMPUS Logo" width={48} height={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Administration AY E-CAMPUS</h1>
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
                <Label htmlFor="email">Email administrateur</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
