"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function SignupPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signUp } = useAuth()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirm = formData.get("confirm") as string

    console.log("[v0] Signup form submitted with:", { firstName, lastName, email })

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas")
      setIsSaving(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, firstName, lastName)

    if (signUpError) {
      console.log("[v0] Signup error:", signUpError)
      setError(signUpError.message)
      setIsSaving(false)
    } else {
      console.log("[v0] Signup successful, redirecting to home")
      alert("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.")
      router.push("/")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#141835]">Créer un compte</h1>
          <p className="mt-2 text-sm text-muted-foreground">Rejoignez AY E-CAMPUS et commencez votre parcours.</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={onSubmit} className="space-y-5">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" required placeholder="Votre prénom" />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" required placeholder="Votre nom" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="vous@exemple.com" />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <Input id="confirm" name="confirm" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]">
              {isSaving ? "Création du compte..." : "Créer mon compte"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-medium hover:underline text-[#141835]">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
