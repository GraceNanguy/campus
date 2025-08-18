"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Settings, Maximize, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { getCourseById, getLessonById, getLessonsByCourseId } from "@/lib/courses"
import type { Course, Lesson, CourseWithLessons } from "@/lib/types"

export default function LessonPage() {
  // Garder la référence à la vidéo
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams() as { id: string; lessonId: string }
  const { id: courseId, lessonId } = params
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime] = useState(0)
  const [duration] = useState(930)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseWithLessons | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données du cours et de la leçon depuis la base de données
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger la leçon
        const lessonData = await getLessonById(lessonId)
        if (!lessonData) {
          throw new Error("Leçon introuvable")
        }
        setLesson(lessonData)

        // Charger le cours et toutes ses leçons
        const courseData = await getCourseById(courseId)
        if (!courseData) {
          throw new Error("Cours introuvable")
        }
        const courseLessons = await getLessonsByCourseId(courseId)
        setCourse({
          ...courseData,
          lessons: courseLessons,
        })

        setLoading(false)
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }

    loadData()
  }, [courseId, lessonId])

  const currentLessonIndex = course.lessons.findIndex((l) => l.id === lessonId)
  const previousLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null
  const progress = ((currentLessonIndex + 1) / course.lessons.length) * 100

  const togglePlay = () => setIsPlaying((p) => !p)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Contenu principal */}
        <div className="flex-1 max-w-4xl mx-auto">
          <div className="lg:hidden p-4 border-b bg-muted/30">
            <h2 className="font-semibold mb-2 text-[#141835]">Développement Web avec React</h2>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {course.lessons.filter((l) => l.isCompleted).length} sur {course.lessons.length} leçons terminées
              </p>
            </div>
          </div>

          {/* Vidéo d'introduction uniquement pour la première leçon */}
          {lesson.hasVideo && (
            <div className="bg-[#141835] relative aspect-video">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-white text-center">
                  <button
                    type="button"
                    className="w-20 h-20 bg-white/20 rounded-full grid place-items-center mb-4 mx-auto hover:bg-white/30 transition-colors"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Mettre en pause" : "Lire"}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </button>
                  <p className="text-lg font-medium">Vidéo d'introduction</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="space-y-2">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all"
                      style={{ width: `${(0 / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <span className="text-sm">0:00 / {lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-[#141835]">{lesson.title}</h1>
              <p className="text-muted-foreground text-base sm:text-lg">{lesson.description}</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-lg border p-4 sm:p-8 shadow-sm">
                {lesson.content.split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("# ")) {
                    return (
                      <h1 key={index} className="text-xl sm:text-2xl font-bold mt-8 mb-4 first:mt-0 text-[#141835]">
                        {paragraph.slice(2)}
                      </h1>
                    )
                  } else if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="text-lg sm:text-xl font-semibold mt-6 mb-3 text-[#141835]">
                        {paragraph.slice(3)}
                      </h2>
                    )
                  } else if (paragraph.startsWith("### ")) {
                    return (
                      <h3 key={index} className="text-base sm:text-lg font-medium mt-4 mb-2 text-[#141835]">
                        {paragraph.slice(4)}
                      </h3>
                    )
                  } else if (paragraph.trim() === "") {
                    return <br key={index} />
                  } else if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.slice(2)}
                      </li>
                    )
                  } else {
                    return (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  }
                })}
              </div>
            </div>

            <div className="flex items-center justify-between py-6 border-t gap-2">
              <div className="flex-1">
                {previousLesson ? (
                  <Button
                    variant="outline"
                    asChild
                    className="border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    <Link href={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                      <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Leçon précédente</span>
                      <span className="sm:hidden">Précédente</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full sm:w-auto bg-transparent">
                    <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Leçon précédente</span>
                    <span className="sm:hidden">Précédente</span>
                  </Button>
                )}
              </div>

              <div className="flex-1 flex justify-end">
                {nextLesson ? (
                  <Button asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a] w-full sm:w-auto">
                    <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                      <span className="hidden sm:inline">Leçon suivante</span>
                      <span className="sm:hidden">Suivante</span>
                      <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a] w-full sm:w-auto">
                    <Link href={`/courses/${courseId}/lessons/quiz`}>
                      <span className="hidden sm:inline">Quiz final</span>
                      <span className="sm:hidden">Quiz</span>
                      <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-muted/30">
          <div className="hidden lg:block p-4 border-b">
            <h2 className="font-semibold mb-2 text-[#141835]">Développement Web avec React</h2>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {course.lessons.filter((l) => l.isCompleted).length} sur {course.lessons.length} leçons terminées
              </p>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-medium text-[#141835] mb-3 hidden lg:block">Contenu du cours</h3>
            {course.lessons.map((courseLesson, index) => (
              <Card
                key={courseLesson.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${courseLesson.id === Number.parseInt(lessonId) ? "ring-2 ring-[#141835] bg-[#141835]/5" : ""}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-medium flex-shrink-0 ${
                        courseLesson.isCompleted
                          ? "bg-green-500 text-white"
                          : courseLesson.id === Number.parseInt(lessonId)
                            ? "bg-[#141835] text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {courseLesson.isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/courses/${courseId}/lessons/${courseLesson.id}`}>
                        <h4 className="text-sm font-medium line-clamp-2 hover:text-[#141835] transition-colors">
                          {courseLesson.title}
                        </h4>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
