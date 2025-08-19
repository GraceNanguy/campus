// Récupère la moyenne des notes pour un cours
export async function getCourseAverageRating(courseId: string) {
  const { data, error } = await supabase
    .from("course_reviews")
    .select("rating")
    .eq("course_id", courseId);

  if (error) throw error;
  if (!data || data.length === 0) return null;
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return avg;
}

// Récupère le nombre d'étudiants ayant acheté le cours
export async function getCourseStudentCount(courseId: string) {
  const { count, error } = await supabase
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("status", "completed");

  if (error) throw error;
  return count || 0;
}
import { supabase } from "./supabase"
import type { Course } from "./supabase"

export async function searchCourses(query: string): Promise<Course[]> {
  try {
    if (!query.trim()) {
      return getAllCourses()
    }

    const searchTerm = query.trim().toLowerCase()
    console.log("[v0] Searching for:", searchTerm)

    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories(name, description),
        admin:admins(full_name)
      `)
      .eq("is_published", true)
      .or(`title.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Search error:", error)
      throw error
    }

    // Chercher aussi par catégorie via jointure
    const { data: byCategory, error: byCategoryError } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories!inner(name, description),
        admin:admins(full_name)
      `)
      .eq("is_published", true)
      .ilike("categories.name", `%${searchTerm}%`)
      .order("created_at", { ascending: false })

    const coursesByCategory: Course[] = byCategoryError || !byCategory ? [] : (byCategory as any)

    // Combiner les résultats et éliminer les doublons
    const allResults = [...(data || []), ...coursesByCategory]
    const uniqueResults = allResults.filter(
      (course, index, self) => index === self.findIndex((c) => c.id === course.id),
    )

    console.log("[v0] Search results:", uniqueResults.length)
    return uniqueResults
  } catch (error) {
    console.error("[v0] Error searching courses:", (error as any)?.message ?? error)
    return []
  }
}

export async function getCoursesByCategory(categoryName: string): Promise<Course[]> {
  try {
    const synonyms: Record<string, string> = {
      "Développement Web": "Développement",
      "Marketing Digital": "Marketing",
      "Entrepreneuriat": "Business",
    }
    const canonical = synonyms[categoryName] ?? categoryName

    // 1) Trouver exactement la catégorie (égalité stricte sur le nom)
    const { data: categoryRow, error: catErr } = await supabase
      .from("categories")
      .select("id")
      .eq("name", canonical)
      .maybeSingle()

    if (catErr) throw catErr
    if (!categoryRow) return []

    // 2) Charger les cours pour ce category_id
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories(name, description),
        admin:admins(full_name)
      `)
      .eq("is_published", true)
      .eq("category_id", categoryRow.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting courses by category:", (error as any)?.message ?? error)
    return []
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories(name, description),
        admin:admins(full_name)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting all courses:", error)
    return []
  }
}

export async function getCourseById(courseId: string) {
  try {
    // Récupérer le cours avec ses relations
    const { data: course, error } = await supabase
      .from("courses")
      .select(`
        *,
        category:categories(name, description),
        admin:admins(full_name)
      `)
      .eq("id", courseId)
      .maybeSingle()

    if (error) throw error
    if (!course) return null

    // Compter le nombre d'étudiants (achats complétés)
    const { count: studentsCount } = await supabase
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId)
      .eq("status", "completed")

    // Récupérer la note moyenne depuis les reviews (à implémenter plus tard)
    const rating = 0 // TODO: Implémenter le système de notation

    return {
      ...course,
      students_count: studentsCount || 0,
      rating
    }
  } catch (error) {
    console.error("Error getting course by id:", (error as any)?.message ?? error)
    return null
  }
}

export async function getLessonsByCourseId(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, content, video_url, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting lessons by course id:", (error as any)?.message ?? error)
    return []
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, content, video_url, order_index, course_id")
      .eq("id", lessonId)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting lesson by id:", (error as any)?.message ?? error)
    return null
  }
}
