export const COURSE_IMAGES = [
  "/images/courses/course-1.png",
  "/images/courses/course-2.png",
  "/images/courses/course-3.png",
  "/images/courses/course-4.png",
] as const

/**
 * Return a stable image path among the 4 images, reusing them across all courses.
 */
export function getCourseImage(id: number): string {
  if (!Number.isFinite(id) || id <= 0) return COURSE_IMAGES[0]
  return COURSE_IMAGES[(id - 1) % COURSE_IMAGES.length]
}
