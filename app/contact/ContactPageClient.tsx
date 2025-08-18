"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPageClient() {
  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Infos */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "#141835" }}>
              Contact
            </h1>
            <p className="mt-3 text-muted-foreground">
              Une question, une suggestion ou un partenariat ? Écrivez-nous, nous répondons rapidement.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5" style={{ color: "#141835" }} />
                <a href="mailto:contact@ay-e-academie.com" className="hover:underline">
                  contact@ay-e-academie.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5" style={{ color: "#141835" }} />
                <a href="tel:+221000000000" className="hover:underline">
                  +221 00 00 00 00
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: "#141835" }} />
                <span>Dakar, Sénégal</span>
              </p>
            </div>
          </div>

          {/* Formulaire simple */}
          <div className="lg:col-span-3">
            <form
              className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 shadow-sm sm:p-6"
              onSubmit={(e) => {
                e.preventDefault()
                alert("Message envoyé ! Merci.")
              }}
            >
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" placeholder="Votre nom" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input id="phone" name="phone" placeholder="+221 ..." />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" name="subject" placeholder="Sujet du message" required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Écrivez votre message..." rows={6} required />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
                  Envoyer
                </Button>
                <p className="text-xs text-muted-foreground">Temps de réponse moyen: 24h</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
