"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Users, BarChart3, Settings, Edit, Trash2, Eye } from "lucide-react"

type AdminUser = {
  name: string
  email?: string
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (user) {
      setAdminUser(JSON.parse(user))
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  // Données des cours du professeur (normalement depuis une API)
  const myCourses = [
    {
      id: 1,
      title: "Développement Web avec React",
      category: "Développement Web",
      students: 1250,
      lessons: 6,
      status: "Publié",
      rating: 4.8,
      revenue: "2,450€",
    },
    {
      id: 2,
      title: "JavaScript Avancé",
      category: "Développement Web",
      students: 890,
      lessons: 8,
      status: "Brouillon",
      rating: 4.7,
      revenue: "1,780€",
    },
  ]

  const stats = {
    totalCourses: myCourses.length,
    totalStudents: myCourses.reduce((sum, course) => sum + course.students, 0),
    totalRevenue: "4,230€",
    avgRating: 4.75,
  }

  if (!adminUser) {
    return <div className="px-4 py-6 sm:px-6 lg:px-8">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* NOTE: Pas de header local ici. La Navbar globale (composant) vient du layout. */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* En-tête avec actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141835]">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Gérez vos cours et suivez vos performances</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
              <Link href="/admin/courses/new">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau cours
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours créés</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cours (responsive) */}
        <Card>
          <CardHeader>
            <CardTitle>Mes cours</CardTitle>
            <CardDescription>Gérez et modifiez vos cours existants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  className="grid gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  {/* Infos */}
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <Badge variant={course.status === "Publié" ? "default" : "secondary"}>{course.status}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.category}
                      </span>
                      <span>{course.students} étudiants</span>
                      <span>{course.lessons} leçons</span>
                      <span>Note: {course.rating}/5</span>
                      <span>Revenus: {course.revenue}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Button variant="ghost" size="sm" asChild aria-label="Voir le cours">
                      <Link href={`/courses/${course.id}`}>
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">Voir le cours</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild aria-label="Modifier le cours">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Modifier le cours</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" aria-label="Supprimer le cours">
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Supprimer le cours</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-shadow hover:shadow-md" asChild>
            <Link href="/admin/courses/new">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Créer un cours</span>
                </CardTitle>
                <CardDescription>Commencez un nouveau cours avec nos outils</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md" asChild>
            <Link href="/admin/analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytiques</span>
                </CardTitle>
                <CardDescription>Suivez les performances de vos cours</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md" asChild>
            <Link href="/admin/settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </CardTitle>
                <CardDescription>Configurez votre profil professeur</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
