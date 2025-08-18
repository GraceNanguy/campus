"use client"

import React, { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Star, Search, Play, Award, Users, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { useRouter } from "next/navigation"
import { getAllCourses } from "@/lib/courses"

export default function HomePage() {
  const coursesSection = useScrollAnimation(0.1, "-50px")
  const howSection = useScrollAnimation(0.1, "-50px")
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/courses?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.push("/courses")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, query: string) => {
    if (e.key === "Enter") {
      handleSearch(query)
    }
  }

  const [homeCourses, setHomeCourses] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const all = await getAllCourses()
        setHomeCourses(all.slice(0, 8))
      } catch (e) {
        setHomeCourses([])
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#141835]/10 via-[#141835]/5 to-background py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🎓 Nouvelle plateforme d'apprentissage
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-slide-in-left text-[#141835]">
                  Apprenez les compétences de{" "}
                  <span className="bg-gradient-to-r from-[#141835] to-[#141835]/70 bg-clip-text text-transparent">
                    demain
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg animate-fade-in delay-300">
                  Découvrez des cours en ligne de qualité, créés par des experts. Développez vos compétences à votre
                  rythme, où que vous soyez.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up delay-500">
                <div className="relative flex-1 max-w-md group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-[#141835] transition-colors duration-300" />
                  <Input
                    placeholder="Rechercher un cours..."
                    className="pl-10 focus:ring-2 focus:ring-[#141835]/20 transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, searchQuery)}
                  />
                </div>
                <Button
                  size="lg"
                  className="sm:w-auto hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl bg-[#141835] text-white hover:bg-[#1a1f4a]"
                  onClick={() => handleSearch(searchQuery)}
                >
                  Explorer les cours
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground animate-fade-in delay-700">
                <div className="flex items-center space-x-2 hover:text-[#141835] transition-colors duration-300 cursor-pointer">
                  <Clock className="w-4 h-4" />
                  <span>Cours de qualité</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-[#141835] transition-colors duration-300 cursor-pointer">
                  <Award className="w-4 h-4" />
                  <span>Certificats inclus</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-[#141835] transition-colors duration-300 cursor-pointer">
                  <Clock className="w-4 h-4" />
                  <span>À votre rythme</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 group">
                <Image
                  src="/images/courses/course-1.png"
                  alt="Étudiants en ligne"
                  width={600}
                  height={400}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <Button
                  size="lg"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 hover:scale-110 transition-all duration-300 bg-[#141835] text-white hover:bg-[#1a1f4a]"
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu des cours */}
      <section className="py-12 sm:py-16" ref={coursesSection.ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 transition-all duration-1000 ${
              coursesSection.isVisible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 -translate-x-20 -rotate-2"
            }`}
          >
            <div className="space-y-2 mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#141835]">Découvrez nos cours</h2>
              <p className="text-muted-foreground">Un aperçu de notre catalogue de formations</p>
            </div>
            <Button
              asChild
              size="lg"
              className="hover:scale-105 transition-transform duration-300 bg-[#141835] text-white hover:bg-[#1a1f4a]"
            >
              <Link href="/courses">Voir tous les cours</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {homeCourses.slice(0, 4).map((course, index) => (
              <Card
                key={course.id}
                className={`group hover:shadow-xl transition-all duration-700 overflow-hidden border-0 shadow-md hover:-translate-y-2 ${
                  coursesSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{
                  transitionDelay: coursesSection.isVisible ? `${index * 150}ms` : "0ms",
                }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={(course.image_url ?? "/placeholder.svg") as string}
                    alt={(course.title ?? "Cours") as string}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <Badge
                    className="absolute top-3 left-3"
                    variant={(course.price ?? 0) === 0 ? "secondary" : "default"}
                  >
                    {(course.price ?? 0) === 0 ? "Gratuit" : `${course.price}€`}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700">{course.level}</Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="text-xs hover:bg-[#141835] hover:text-white transition-colors duration-300"
                    >
                      {typeof course?.category === "string" ? course.category : course?.category?.name}
                    </Badge>
                    <div className="flex items-center space-x-1 group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-[#141835] transition-colors duration-300 text-base">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1 hover:text-[#141835] transition-colors duration-300">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6 hover:scale-110 transition-transform duration-300">
                        <AvatarImage src="/instructor-avatar.png" alt="Avatar instructeur" />
                        <AvatarFallback className="text-xs">
                          {(course?.admin?.full_name || "Instructeur")
                            .split(" ")
                            .filter(Boolean)
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs hover:text-[#141835] transition-colors duration-300">
                        {course?.admin?.full_name || "Instructeur"}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full hover:scale-105 transition-all duration-300 bg-[#141835] text-white hover:bg-[#1a1f4a]"
                    asChild
                  >
                    <Link href={`/courses/${course.id}`}>Voir le cours</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi AY E-ACADEMIE */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141835]">Pourquoi choisir AY E-ACADEMIE ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Une plateforme pensée pour votre réussite</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu texte à gauche */}
            <div className="space-y-8">
              {[
                {
                  icon: Award,
                  title: "Certifications reconnues",
                  description:
                    "À la fin de chaque formation, vous obtenez un certificat attestant vos compétences, valorisable sur votre CV ou LinkedIn.",
                },
                {
                  icon: Clock,
                  title: "Flexibilité totale",
                  description: "Apprenez où vous voulez et quand vous voulez, sans contrainte d'emploi du temps.",
                },
                {
                  icon: Users,
                  title: "Formateurs qualifiés",
                  description:
                    "Tous nos cours sont animés par des experts et professionnels, avec une pédagogie claire et adaptée à tous les niveaux.",
                },
                {
                  icon: BookOpen,
                  title: "Apprentissage interactif et à jour",
                  description:
                    "Cours régulièrement mis à jour, avec quiz, exercices pratiques et études de cas pour appliquer immédiatement vos connaissances.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#141835]/10 rounded-xl flex items-center justify-center group-hover:bg-[#141835]/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-[#141835]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#141835] group-hover:text-[#1a1f4a] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image avec bordure asymétrique à droite */}
            <div className="relative">
              <div className="relative asymmetric-border overflow-hidden">
                <Image
                  src="/images/courses/course-2.png"
                  alt="Étudiante en formation en ligne"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Badge flottant */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#141835]/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#141835]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#141835]">Cours disponibles</p>
                    <p className="text-xs text-muted-foreground">24h/24</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-br from-[#141835]/5 via-background to-[#141835]/10"
        ref={howSection.ref}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-1000 ${
              howSection.isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141835]">Comment ça marche ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Commencez votre apprentissage en 3 étapes simples</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                number: 1,
                title: "Choisissez votre cours",
                description: "Parcourez notre catalogue et sélectionnez le cours qui vous intéresse",
              },
              {
                number: 2,
                title: "Apprenez à votre rythme",
                description: "Suivez les leçons vidéo, faites les exercices et progressez étape par étape",
              },
              {
                number: 3,
                title: "Obtenez votre certificat",
                description: "Validez vos acquis et recevez votre certificat de réussite",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur ${
                  howSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{
                  transitionDelay: howSection.isVisible ? `${(index + 1) * 200}ms` : "0ms",
                }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#141835] rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full animate-ping group-hover:animate-bounce"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#141835]">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className={`text-center transition-all duration-1500 ${
              howSection.isVisible
                ? "opacity-100 translate-y-0 scale-100 rotate-0"
                : "opacity-0 translate-y-20 scale-75 rotate-6"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 bg-[#141835] text-white hover:bg-[#1a1f4a]"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo-placeholder.png" alt="AY E-ACADEMIE Logo" width={24} height={24} />
                <span className="text-xl font-bold">AY E-ACADEMIE</span>
              </div>
              <p className="text-muted-foreground text-sm">Votre nouvelle plateforme d'apprentissage en ligne.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#141835]">Cours</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Développement Web
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Entrepreneuriat
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#141835]">Plateforme</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Aide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#141835]">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#141835] transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AY E-ACADEMIE. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Added asymmetric border styling with concave corner */
        .asymmetric-border {
          position: relative;
          border-radius: 2rem 1rem 2rem 0;
          box-shadow: 0 20px 40px rgba(20, 24, 53, 0.1);
          background: white;
          padding: 0.5rem;
        }
        
        .asymmetric-border::before {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: -0.5rem;
          width: 3rem;
          height: 3rem;
          background: white;
          border-radius: 50%;
          box-shadow: inset 0.5rem 0.5rem 0 rgba(20, 24, 53, 0.05);
          z-index: -1;
        }
        
        .asymmetric-border::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 2rem;
          height: 2rem;
          background: #f8fafc;
          border-radius: 0 2rem 0 0;
          box-shadow: -0.5rem -0.5rem 0 white;
        }
      `}</style>
    </div>
  )
}
