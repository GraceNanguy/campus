"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Settings, Maximize, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { getCourseById, getLessonById, getLessonsByCourseId } from "@/lib/courses"
import type { Course, Lesson, CourseWithLessons } from "@/lib/types"

export default function LessonPage() {
  // 1. Refs et paramètres de route
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams() as { id: string; lessonId: string }
  const { id: courseId, lessonId } = params

  // 2. States de données
  const [course, setCourse] = useState<CourseWithLessons | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 3. States de la vidéo
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // 4. Effects
  // 4.1 Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Charger les données en parallèle
        const [lessonData, courseData, courseLessons] = await Promise.all([
          getLessonById(lessonId) as Promise<Lesson>,
          getCourseById(courseId) as Promise<Course>,
          getLessonsByCourseId(courseId) as Promise<Lesson[]>
        ]);

        if (!lessonData || !courseData) {
          throw new Error("Données introuvables");
        }

        // S'assurer que toutes les leçons ont une date de création
        const now = new Date().toISOString();
        const validatedLessons = courseLessons.map(l => ({
          ...l,
          created_at: l.created_at || now
        }));

        // Mettre à jour les états
        setLesson({
          ...lessonData,
          created_at: lessonData.created_at || now
        });

        setCourse({
          ...courseData,
          lessons: validatedLessons
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, lessonId]);

    // 3.2 Protection contre la copie (toujours actif)
  useEffect(() => {
    const preventCopy = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const preventSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('keydown', preventSave);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('keydown', preventSave);
    };
  }, []);

  // 4.3 Gestion de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(Math.floor(video.currentTime));
    const updateDuration = () => setDuration(Math.floor(video.duration));
    const handleEnd = () => setIsPlaying(false);

    if (lesson?.video_url) {
      video.src = lesson.video_url;
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      video.src = '';
      return;
    }

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnd);
      video.src = '';
    };
  }, [lesson?.video_url]);



  // 4. Computed values (après tous les hooks)
  const currentLessonIndex = course?.lessons?.findIndex((l: Lesson) => l.id === lessonId) ?? -1;
  const completedLessons = course?.lessons?.filter((l: Lesson) => l.isCompleted)?.length ?? 0;
  const totalLessons = course?.lessons?.length ?? 0;
  
  const navigation = {
    previous: currentLessonIndex > 0 ? course?.lessons?.[currentLessonIndex - 1] : null,
    next: course?.lessons && currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null,
    progress: course?.lessons ? ((currentLessonIndex + 1) / course.lessons.length) * 100 : 0,
    isFirstLesson: currentLessonIndex === 0
  };

  const hasVideo = navigation.isFirstLesson && lesson?.video_url;

  // 5. Event Handlers
  const togglePlay = useCallback(() => {
    if (!videoRef.current || !lesson?.video_url) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying, lesson?.video_url]);



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#141835]/20 border-t-[#141835] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-[#141835]">Erreur</h2>
          <p className="text-muted-foreground">{error || "Impossible de charger la leçon"}</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Retour aux cours</Link>
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Contenu principal */}
        <div className="flex-1 max-w-4xl mx-auto">
          <div className="lg:hidden p-4 border-b bg-muted/30">
            <h2 className="font-semibold mb-2 text-[#141835]">Développement Web avec React</h2>
            <div className="space-y-2">
              <Progress value={navigation.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} sur {totalLessons} leçons terminées
              </p>
            </div>
          </div>

          {/* Vidéo d'introduction uniquement pour la première leçon */}
          {hasVideo && (
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
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <span className="text-sm">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                      </span>
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
              <p className="text-muted-foreground text-base sm:text-lg">{lesson.content.split('\n')[0]}</p>
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
                {navigation.previous ? (
                  <Button
                    variant="outline"
                    asChild
                    className="border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    <Link href={`/courses/${courseId}/lessons/${navigation.previous.id}`}>
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
                {navigation.next ? (
                  <Button asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a] w-full sm:w-auto">
                    <Link href={`/courses/${courseId}/lessons/${navigation.next.id}`}>
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
              <Progress value={navigation.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} sur {totalLessons} leçons terminées
              </p>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-medium text-[#141835] mb-3 hidden lg:block">Contenu du cours</h3>
            {course.lessons.map((courseLesson, index) => (
              <Card
                key={courseLesson.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${courseLesson.id === lessonId ? "ring-2 ring-[#141835] bg-[#141835]/5" : ""}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-medium flex-shrink-0 ${
                        courseLesson.isCompleted
                          ? "bg-green-500 text-white"
                          : courseLesson.id === lessonId
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
