"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, Star, Play } from "lucide-react"
import { getCourseImage } from "@/lib/course-images"

export type Course = {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  rating: number
  price: string
  originalPrice?: string | null
  level: string
  category: string
  students?: number
  lessons?: number
}

type CourseCardProps = {
  course: Course
  index?: number
  clickable?: boolean
}

export default function CourseCard(
  { course, index = 0, clickable = true }: CourseCardProps = {
    course: {
      id: 1,
      title: "Cours de démonstration",
      description: "Description",
      instructor: "Instructeur",
      duration: "2h",
      rating: 4.5,
      price: "Gratuit",
      level: "Débutant",
      category: "Catégorie",
    },
    index: 0,
    clickable: true,
  },
) {
  const imageSrc = getCourseImage(course.id)
  const computeInitials = (value: unknown): string => {
    if (typeof value !== "string") return "IN"
    const trimmed = value.trim()
    if (!trimmed) return "IN"
    return trimmed
      .split(/\s+/)
      .filter(Boolean)
      .map((segment) => segment[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }
  const instructorName = typeof course?.instructor === "string" && course.instructor.trim() ? course.instructor : "Instructeur"
  const instructorInitials = computeInitials(instructorName)
  const categoryLabel = typeof (course as any)?.category === "string" ? (course as any).category : (course as any)?.category?.name ?? "Catégorie"

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:-translate-y-2 opacity-100 translate-y-0"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={course.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Prix et promotion */}
        <div className="absolute top-3 left-3">
          {course.originalPrice && (
            <Badge className="bg-red-500 text-white mb-1 block">
              -{Math.round((1 - Number.parseInt(course.price) / Number.parseInt(course.originalPrice)) * 100)}%
            </Badge>
          )}
          <Badge variant={course.price === "Gratuit" ? "secondary" : "default"} className="bg-white/90 text-gray-800">
            {course.price}
            {course.originalPrice && (
              <span className="line-through ml-1 text-xs opacity-60">{course.originalPrice}</span>
            )}
          </Badge>
        </div>

        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700">{course.level}</Badge>

        {/* Hover play */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
          <Button
            size="lg"
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12 bg-[#141835] text-white hover:bg-[#1a1f4a]"
            asChild={clickable}
            disabled={!clickable}
          >
            {clickable ? (
              <Link href={`/courses/${course.id}`}>
                <Play className="w-5 h-5" />
              </Link>
            ) : (
              <span>
                <Play className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs hover:bg-[#141835] hover:text-white transition-colors">
            {categoryLabel}
          </Badge>
          <div className="flex items-center space-x-1 group-hover:scale-110 transition-transform">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-[#141835] transition-colors text-base">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            {(course.lessons ?? 0) > 0 && (
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons} leçons</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src="/instructor-avatar.png" alt="Avatar instructeur" />
                <AvatarFallback className="text-xs">{instructorInitials}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{instructorName}</span>
            </div>
            {course.students && (
              <div className="text-xs text-muted-foreground">{course.students.toLocaleString()} étudiants</div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]" disabled={!clickable} asChild={clickable}>
          {clickable ? <Link href={`/courses/${course.id}`}>Voir le cours</Link> : <span>Voir le cours</span>}
        </Button>
      </CardFooter>
    </Card>
  )
}
