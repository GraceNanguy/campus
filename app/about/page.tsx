"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Target, Heart, Users, Lightbulb, Rocket } from "lucide-react"
import { useEffect, useState } from "react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#141835]/5 to-transparent rounded-full blur-3xl"></div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141835] mb-6">
            À propos de{" "}
            <span className="bg-gradient-to-r from-[#141835] to-[#2a3a6a] bg-clip-text text-transparent">
              AY E-ACADEMIE
            </span>
          </h1>
          <p className="relative text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AY E-ACADEMIE est né d'une idée simple: offrir aux jeunes des parcours d'apprentissage clairs, concrets et
            accessibles, pour développer des compétences utiles aujourd'hui et demain.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#141835]/10 rounded-full group-hover:bg-[#141835]/20 transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-[#141835]" />
              </div>
              <h2 className="text-3xl font-bold text-[#141835]">Notre histoire</h2>
            </div>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p className="group-hover:text-foreground transition-colors duration-300">
                L'idée d'AY E-ACADEMIE est venue sur le terrain, au contact de jeunes motivés mais souvent perdus face à
                des ressources trop dispersées. Nous avons voulu un endroit unique, simple et efficace.
              </p>
              <p className="group-hover:text-foreground transition-colors duration-300">
                Depuis, nous construisons des cours courts, pratiques et progressifs, avec des exercices concrets et des
                explications claires.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vision Section */}
      <section
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#141835]/10 rounded-full group-hover:bg-[#141835]/20 transition-colors duration-300">
                <Target className="h-6 w-6 text-[#141835]" />
              </div>
              <h2 className="text-3xl font-bold text-[#141835]">Notre vision</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6 group-hover:text-foreground transition-colors duration-300">
              Donner à chaque jeune la possibilité d'apprendre, pratiquer et réussir.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Lightbulb, text: "Des parcours simples et bien structurés" },
                { icon: Users, text: "Des compétences utiles pour la vie et le travail" },
                { icon: Rocket, text: "Un apprentissage accessible partout, sur mobile d'abord" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-[#141835]/5 transition-all duration-300 group/item"
                >
                  <div className="p-2 bg-[#141835]/10 rounded-full group-hover/item:bg-[#141835]/20 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-[#141835]" />
                  </div>
                  <p className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Values Section */}
      <section
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#141835]/10 rounded-full group-hover:bg-[#141835]/20 transition-colors duration-300">
                <Heart className="h-6 w-6 text-[#141835]" />
              </div>
              <h2 className="text-3xl font-bold text-[#141835]">Nos valeurs</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: "Simplicité", desc: "aller droit au but, sans jargon inutile." },
                { title: "Praticité", desc: "apprendre en faisant, par des exercices concrets." },
                { title: "Accessibilité", desc: "des contenus compréhensibles et inclusifs." },
              ].map((value, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-[#141835]/5 to-transparent hover:from-[#141835]/10 hover:to-[#141835]/5 transition-all duration-500 group/value border border-[#141835]/10 hover:border-[#141835]/20"
                >
                  <h3 className="text-xl font-semibold text-[#141835] mb-3 group-hover/value:scale-105 transition-transform duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground group-hover/value:text-foreground transition-colors duration-300">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section
        className={`mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 text-center transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#141835] mb-6">Prêt à commencer votre parcours ?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-[#141835] text-white hover:bg-[#1a1f4a] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href="/courses">Explorer les cours</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
