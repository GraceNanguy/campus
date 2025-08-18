"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import CourseGrid from "@/components/course-grid"
import { getAllCourses, searchCourses, getCoursesByCategory } from "@/lib/courses"
import { useSearchParams, useRouter } from "next/navigation"


export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSearchQuery = searchParams.get("search") || ""
  const urlCategory = searchParams.get("category") || ""

  const headerSection = useScrollAnimation(0.1, "-50px")
  const coursesSection = useScrollAnimation(0.1, "-50px")

  // Catégories strictement alignées avec la base de données (voir scripts SQL)
  const categories = ["Tous", "Design", "Développement", "Marketing", "Business"]

  // Détermine si une recherche correspond à une catégorie de la base (gère variantes/accents/fautes fréquentes)
  const normalizeCategoryTerm = (raw: string): string | null => {
    const q = raw.trim().toLowerCase()
    if (!q) return null
    const mappings: Record<string, string> = {
      design: "Design",
      // Développement (variantes)
      "développement": "Développement",
      developpement: "Développement",
      "dévelopement": "Développement",
      dev: "Développement",
      "developpement web": "Développement",
      "développement web": "Développement",
      // Marketing (variantes)
      marketing: "Marketing",
      "marketing digital": "Marketing",
      // Business (variantes)
      business: "Business",
      entrepreneuriat: "Business",
    }
    // Correspondance exacte sur le mapping
    if (mappings[q]) return mappings[q]
    // Correspondance par inclusion simple (ex: "design ui" → "Design")
    if (q.includes("design")) return "Design"
    if (q.includes("dev")) return "Développement"
    if (q.includes("marketing")) return "Marketing"
    if (q.includes("entrepren") || q.includes("business")) return "Business"
    return null
  }

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return

      // Si le terme est une catégorie, basculer en mode catégorie au lieu de recherche libre
      const maybeCategory = normalizeCategoryTerm(query)
      if (maybeCategory) {
        setSelectedCategory(maybeCategory)
        setLoading(true)
        try {
          const coursesData = await getCoursesByCategory(maybeCategory)
          setCourses(coursesData)
        } catch (error) {
          console.error("[v0] Error loading category:", error)
          setCourses([])
        } finally {
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        console.log("[v0] Searching for:", query)
        const coursesData = await searchCourses(query)
        setCourses(coursesData)
        console.log("[v0] Search results:", coursesData.length)
      } catch (error) {
        console.error("[v0] Error searching courses:", error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // Set initial state from URL params
        if (urlSearchQuery) {
          const maybeCategory = normalizeCategoryTerm(urlSearchQuery)
          if (maybeCategory) {
            setSelectedCategory(maybeCategory)
            // garder le texte saisi dans la barre, ne pas le vider
            setSearchQuery(urlSearchQuery)
          } else {
            setSearchQuery(urlSearchQuery)
            setSelectedCategory("Tous")
          }
        } else if (urlCategory && urlCategory !== "Tous") {
          const maybeCategory = normalizeCategoryTerm(urlCategory) || urlCategory
          setSelectedCategory(maybeCategory)
          // ne pas vider la recherche automatiquement
        }

        let coursesData
        if (urlSearchQuery) {
          const maybeCategory = normalizeCategoryTerm(urlSearchQuery)
          if (maybeCategory) {
            console.log("[v0] Loading category via search query:", maybeCategory)
            coursesData = await getCoursesByCategory(maybeCategory)
            // conserver le texte dans le champ; éviter de forcer l'URL ici
          } else {
            console.log("[v0] Loading search results for:", urlSearchQuery)
            coursesData = await searchCourses(urlSearchQuery)
          }
        } else if (urlCategory && urlCategory !== "Tous") {
          const maybeCategory = normalizeCategoryTerm(urlCategory) || urlCategory
          console.log("[v0] Loading category:", maybeCategory)
          coursesData = await getCoursesByCategory(maybeCategory)
        } else {
          console.log("[v0] Loading all courses")
          coursesData = await getAllCourses()
        }

        setCourses(coursesData)
        console.log("[v0] Loaded courses:", coursesData.length)
      } catch (error) {
        console.error("[v0] Error loading courses:", error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [urlSearchQuery, urlCategory]) // Removed searchQuery dependency to prevent loops

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value)

    if (value.trim()) {
      const maybeCategory = normalizeCategoryTerm(value)
      if (maybeCategory) {
        // Mode catégorie si la recherche correspond à une catégorie
        setSelectedCategory(maybeCategory)
        // ne pas changer l'URL à chaque frappe pour éviter les resets
        setLoading(true)
        try {
          const coursesData = await getCoursesByCategory(maybeCategory)
          setCourses(coursesData)
        } catch (error) {
          console.error("[v0] Error loading category:", error)
          setCourses([])
        } finally {
          setLoading(false)
        }
      } else {
        // ne pas pusher l'URL à chaque caractère; laisser la recherche debouncée faire le travail
        debouncedSearch(value)
      }
    } else {
      // Clear search immediately
      clearSearch()
    }
  }

  const clearSearch = async () => {
    setSearchQuery("")
    setSelectedCategory("Tous")
    router.push("/courses")

    // Reload all courses immediately
    setLoading(true)
    try {
      const coursesData = await getAllCourses()
      setCourses(coursesData)
      console.log("[v0] Cleared search, loaded all courses:", coursesData.length)
    } catch (error) {
      console.error("[v0] Error loading all courses:", error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchQuery("")
    if (category === "Tous") {
      router.push("/courses")
    } else {
      router.push(`/courses?category=${encodeURIComponent(category)}`)
    }
  }

  const getCategoryName = (course: any) =>
    typeof course?.category === "string" ? course.category : course?.category?.name

  const filteredCourses = courses.filter((course) => {
    return selectedCategory === "Tous" || getCategoryName(course) === selectedCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#141835]/10 via-[#141835]/5 to-background py-12 sm:py-16" ref={headerSection.ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center space-y-6 transition-all duration-1000 ${headerSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Rechercher un cours, une catégorie..."
                  className="pl-12 pr-12 h-12 text-base focus:ring-2 focus:ring-[#141835]/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-8 border-b bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className={`transition-all hover:scale-105 text-xs sm:text-sm ${selectedCategory === category ? "bg-[#141835] text-white hover:bg-[#1a1f4a]" : "border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white"}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cours */}
      <section className="py-12" ref={coursesSection.ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 transition-all duration-1000 ${coursesSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#141835]">
                {selectedCategory === "Tous" ? `${filteredCourses.length} cours disponibles` : `${filteredCourses.length} cours en ${selectedCategory}`}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Trier par popularité</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#141835]/20 border-t-[#141835] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des cours...</p>
            </div>
          ) : (
            <>
              <CourseGrid courses={filteredCourses} />

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full grid place-items-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#141835]">Aucun cours trouvé</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || urlSearchQuery ? `Aucun résultat pour "${searchQuery || urlSearchQuery}". Essayez d'autres mots-clés.` : "Essayez de modifier vos critères de recherche ou explorez d'autres catégories."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
