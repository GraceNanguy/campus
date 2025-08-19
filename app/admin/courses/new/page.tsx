"use client"

import React, { ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"

interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: string;
  image: File | null;
  imagePreview: string | null;
  is_published: boolean;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  order_index: number;
}

interface AdminUser {
  id: string;
  name: string;
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, Save, Upload, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export default function NewCoursePage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // État du formulaire
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    image: null,
    imagePreview: null,
    is_published: false
  })

  // État initial avec une première leçon
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, title: "", content: "", order_index: 1 },
  ])

  // Réorganiser les leçons quand leur ordre change
  useEffect(() => {
    if (lessons.length > 1) {
      const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)
      const reindexedLessons = sortedLessons.map((lesson, index) => ({
        ...lesson,
        order_index: index + 1
      }))
      if (JSON.stringify(reindexedLessons) !== JSON.stringify(lessons)) {
        setLessons(reindexedLessons)
      }
    }
  }, [lessons])

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (user) {
      setAdminUser(JSON.parse(user))
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const categories = [
    "Développement Web",
    "Design",
    "Data Science",
    "Entrepreneuriat",
    "Marketing Digital",
    "Intelligence Artificielle",
    "Architecture",
    "Photographie",
  ]

  const levels = ["Débutant", "Intermédiaire", "Avancé"]

  const handleCourseChange = (field: keyof CourseData, value: string) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCourseData((prev) => ({
      ...prev,
      image: file,
    }))

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (result && typeof result === 'string') {
        setCourseData((prev) => ({
          ...prev,
          imagePreview: result,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

    const handleLessonChange = (lessonId: number, field: keyof Lesson, value: string | number) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              [field]: value,
            }
          : lesson,
      ),
    )
  }

  const addLesson = () => {
    const newId = Math.max(...lessons.map((l) => l.id)) + 1
    const nextOrderIndex = lessons.length + 1
    setLessons((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        content: "",
        order_index: nextOrderIndex,
        video_url: ""
      },
    ])
  }

  const removeLesson = (lessonId: number) => {
    if (lessons.length > 1) {
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validation des données requises
      if (!courseData.title || !courseData.description || !courseData.category || !courseData.level) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      // Préparation des données du cours
      const storedAdmin = localStorage.getItem('adminUser')
      if (!storedAdmin) {
        throw new Error("Vous devez être connecté pour créer un cours")
      }

      const formData = new FormData()
      formData.append("adminUser", storedAdmin)
      formData.append("title", courseData.title)
      formData.append("description", courseData.description)
      formData.append("category", courseData.category)
      formData.append("level", courseData.level)
      formData.append("price", courseData.price)
      formData.append("duration", courseData.duration)
      formData.append("is_published", String(courseData.is_published))
      
      if (courseData.image) {
        formData.append("image", courseData.image)
      }
      
      // Ajout des leçons (avec les champs correspondant au schéma de la base de données)
      const formattedLessons = lessons.map(lesson => ({
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.video_url,
        order_index: lesson.order_index
      }))
      formData.append("lessons", JSON.stringify(formattedLessons))

      // Envoi des données à l'API
      const response = await fetch("/api/courses/create", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la création du cours")
      }

      // Redirection vers le dashboard après succès
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Erreur:", error)
      // Ici vous pouvez ajouter une notification d'erreur pour l'utilisateur
      // Par exemple avec un composant Toast ou Alert
    } finally {
      setIsLoading(false)
    }
  }

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#141835] mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#141835]">Créer un nouveau cours</h1>
            <p className="text-muted-foreground">Remplissez les informations de votre cours et ajoutez vos leçons</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Informations générales du cours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#141835]">Informations générales</CardTitle>
                <CardDescription>Les informations de base de votre cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Image d'illustration du cours</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {courseData.imagePreview ? (
                      <div className="relative">
                        <img
                          src={courseData.imagePreview || "/placeholder.svg"}
                          alt="Aperçu"
                          className="w-32 h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                          onClick={() => setCourseData((prev) => ({ ...prev, image: null, imagePreview: null }))}
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir une image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Formats acceptés: JPG, PNG, WebP (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cours *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Développement Web avec React"
                      value={courseData.title}
                      onChange={(e) => handleCourseChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => handleCourseChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description courte *</Label>
                  <Textarea
                    id="description"
                    placeholder="Une description courte qui apparaîtra sur les cartes de cours"
                    value={courseData.description}
                    onChange={(e) => handleCourseChange("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau *</Label>
                    <Select value={courseData.level} onValueChange={(value) => handleCourseChange("level", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée totale</Label>
                    <Input
                      id="duration"
                      placeholder="Ex: 12"
                      value={courseData.duration}
                      onChange={(e) => handleCourseChange("duration", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (CFA)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Prix en CFA"
                      value={courseData.price}
                      onChange={(e) => handleCourseChange("price", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Leçons */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-[#141835]">Leçons du cours</CardTitle>
                    <CardDescription>Ajoutez et organisez les leçons de votre cours</CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={addLesson}
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une leçon
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="border-dashed">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline">Leçon {index + 1}</Badge>
                        </div>
                        {lessons.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeLesson(lesson.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Titre de la leçon *</Label>
                          <Input
                            placeholder="Ex: Introduction à React"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(lesson.id, "title", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ordre d'apparition</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Position dans le cours"
                              value={lesson.order_index}
                              onChange={(e) => handleLessonChange(lesson.id, "order_index", Math.max(1, parseInt(e.target.value) || 1))}
                              required
                            />
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                              sur {lessons.length}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Contenu de la leçon *</Label>
                        <Textarea
                          placeholder="Rédigez le contenu complet de votre leçon en Markdown..."
                          value={lesson.content}
                          onChange={(e) => handleLessonChange(lesson.id, "content", e.target.value)}
                          rows={8}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Vous pouvez utiliser Markdown pour formater votre contenu (# pour les titres, ** pour le gras,
                          etc.)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>URL de la vidéo (optionnel)</Label>
                        <Input
                          placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
                          value={lesson.video_url || ""}
                          onChange={(e) => handleLessonChange(lesson.id, "video_url", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/admin/dashboard">Annuler</Link>
              </Button>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Sauvegarder en brouillon
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#141835] text-white hover:bg-[#1a1f4a] w-full sm:w-auto"
                >
                  {isLoading ? (
                    "Création en cours..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Créer et publier
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
