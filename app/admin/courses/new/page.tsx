"use client"

import { Button } from "@/components/ui/button"
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
  const [adminUser, setAdminUser] = useState(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const fileInputRef = useRef(null)
  const pdfInputRef = useRef(null)

  // État du formulaire
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    level: "",
    price: "",
    originalPrice: "",
    language: "Français",
    image: null,
    imagePreview: null,
    totalHours: "",
  })

  const [lessons, setLessons] = useState([
    { id: 1, title: "", description: "", content: "", duration: "", hasVideo: false },
  ])

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

  const handleCourseChange = (field, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        image: file,
      }))

      // Créer un aperçu
      const reader = new FileReader()
      reader.onload = (e) => {
        setCourseData((prev) => ({
          ...prev,
          imagePreview: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setIsUploadingPdf(true)

      try {
        // Simulation d'extraction de texte PDF
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Texte simulé extrait du PDF
        const extractedText = `# Introduction au cours

Ce cours vous permettra d'apprendre les concepts fondamentaux.

## Chapitre 1: Les bases
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Chapitre 2: Concepts avancés
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Chapitre 3: Pratique
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`

        // Diviser le contenu en leçons basées sur les chapitres
        const chapters = extractedText.split("## ").filter((chapter) => chapter.trim())
        const newLessons = chapters.map((chapter, index) => ({
          id: index + 1,
          title: chapter
            .split("\n")[0]
            .replace("Chapitre ", "")
            .replace(/\d+:\s*/, ""),
          description: `Leçon ${index + 1} extraite du PDF`,
          content: "## " + chapter.trim(),
          duration: "15:00",
          hasVideo: index === 0, // Première leçon avec vidéo d'intro
        }))

        setLessons(newLessons)

        // Mettre à jour le titre du cours si vide
        if (!courseData.title) {
          handleCourseChange("title", "Cours extrait du PDF")
        }
      } catch (error) {
        console.error("Erreur lors de l'extraction du PDF:", error)
      } finally {
        setIsUploadingPdf(false)
      }
    }
  }

  const handleLessonChange = (lessonId, field, value) => {
    setLessons((prev) => prev.map((lesson) => (lesson.id === lessonId ? { ...lesson, [field]: value } : lesson)))
  }

  const addLesson = () => {
    const newId = Math.max(...lessons.map((l) => l.id)) + 1
    setLessons((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        description: "",
        content: "",
        duration: "",
        hasVideo: false,
      },
    ])
  }

  const removeLesson = (lessonId) => {
    if (lessons.length > 1) {
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Cours créé:", { courseData, lessons })

    // Redirection vers le dashboard
    router.push("/admin/dashboard")
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

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Description détaillée</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Une description complète qui apparaîtra sur la page du cours"
                    value={courseData.longDescription}
                    onChange={(e) => handleCourseChange("longDescription", e.target.value)}
                    rows={5}
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
                    <Label htmlFor="totalHours">Durée totale</Label>
                    <Input
                      id="totalHours"
                      placeholder="Ex: 12h"
                      value={courseData.totalHours}
                      onChange={(e) => handleCourseChange("totalHours", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="79"
                      value={courseData.price}
                      onChange={(e) => handleCourseChange("price", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Prix original (€)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="120"
                      value={courseData.originalPrice}
                      onChange={(e) => handleCourseChange("originalPrice", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#141835]">Import rapide depuis PDF</CardTitle>
                <CardDescription>
                  Téléchargez un PDF pour extraire automatiquement le contenu et créer les leçons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isUploadingPdf}
                    className="w-full sm:w-auto"
                  >
                    {isUploadingPdf ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Extraction en cours...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Importer un PDF
                      </>
                    )}
                  </Button>
                  <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                  <p className="text-sm text-muted-foreground">
                    Le système extraira automatiquement le texte et créera les leçons basées sur les chapitres détectés.
                  </p>
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
                          <Label>Durée estimée</Label>
                          <Input
                            placeholder="Ex: 15:30"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(lesson.id, "duration", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description de la leçon</Label>
                        <Textarea
                          placeholder="Décrivez brièvement ce que les étudiants apprendront"
                          value={lesson.description}
                          onChange={(e) => handleLessonChange(lesson.id, "description", e.target.value)}
                          rows={2}
                        />
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

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`video-${lesson.id}`}
                          checked={lesson.hasVideo}
                          onChange={(e) => handleLessonChange(lesson.id, "hasVideo", e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`video-${lesson.id}`}>Cette leçon contient une vidéo d'introduction</Label>
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
