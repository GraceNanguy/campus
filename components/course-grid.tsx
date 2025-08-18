"use client"

import CourseCard, { type Course } from "@/components/course-card"

type CourseGridProps = {
  courses: Course[]
  // When true, only the first card is clickable (Home requirement)
  firstCardLinksOnly?: boolean
}

export default function CourseGrid(
  { courses = [], firstCardLinksOnly = false }: CourseGridProps = { courses: [], firstCardLinksOnly: false },
) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} clickable={!firstCardLinksOnly || index === 0} />
      ))}
    </div>
  )
}
