"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
  const [isSending, setIsSending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSending(true)
    // Simulation d'envoi
    await new Promise((r) => setTimeout(r, 1000))
    setIsSending(false)
    alert("Message envoyé (simulation).")
    ;(e.currentTarget as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required placeholder="Votre nom" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="vous@exemple.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" name="subject" required placeholder="Sujet de votre message" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required placeholder="Votre message..." rows={5} />
      </div>
      <Button type="submit" disabled={isSending} className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
        {isSending ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  )
}
