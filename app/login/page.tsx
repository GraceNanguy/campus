"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn } = useAuth()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("[v0] Login attempt for:", email)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      console.log("[v0] Login error:", signInError)
      setError(signInError.message)
      setIsLoading(false)
    } else {
      console.log("[v0] Login successful, redirecting to home")
      router.push("/")
    }
  }

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-5 shadow-sm sm:p-7 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141835]">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bon retour ! Connectez-vous pour continuer votre apprentissage.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" name="email" type="email" required className="pl-9" placeholder="vous@exemple.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" name="password" type="password" required className="pl-9" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Se souvenir de moi
              </label>
              <Link href="#" className="font-medium hover:underline text-[#141835]">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]">
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="font-medium hover:underline text-[#141835]">
                S'inscrire
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
