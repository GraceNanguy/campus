import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    console.log('Début de la requête POST')
    
    // Vérifier la connexion Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Configuration Supabase manquante')
    }
    
    const formData = await request.formData()
    console.log('FormData reçue:', Object.fromEntries(formData))
    
    // Extraire les données du cours
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const longDescription = formData.get('longDescription') as string
    const category = formData.get('category') as string
    const level = formData.get('level') as string
    const price = formData.get('price') as string
    const image = formData.get('image') as File
    const lessons = JSON.parse(formData.get('lessons') as string)

    console.log('Données extraites:', {
      title,
      description,
      category,
      level,
      price,
      hasImage: !!image,
      lessonCount: lessons.length
    })

    // 1. Upload de l'image si elle existe
    let imageUrl = null
    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const { data: imageData, error: imageError } = await supabase.storage
        .from('course-images')
        .upload(fileName, image)

      if (imageError) throw new Error('Erreur lors de l\'upload de l\'image')
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-images/${fileName}`
    }

    // 2. Créer le cours dans la base de données
    console.log('Tentative de création du cours...')
    
    // Trouver ou créer la catégorie
    let categoryId;
    const { data: existingCategory, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .maybeSingle()

    if (categoryError) {
      console.error('Erreur recherche catégorie:', categoryError)
      return NextResponse.json(
        { error: 'Erreur lors de la recherche de la catégorie' },
        { status: 500 }
      )
    }

    if (existingCategory) {
      categoryId = existingCategory.id
    } else {
      // Créer la catégorie si elle n'existe pas
      const { data: newCategory, error: insertError } = await supabase
        .from('categories')
        .insert([{ name: category }])
        .select('id')
        .single()

      if (insertError) {
        console.error('Erreur création catégorie:', insertError)
        return NextResponse.json(
          { error: 'Erreur lors de la création de la catégorie' },
          { status: 500 }
        )
      }
      categoryId = newCategory.id
    }

    // Récupérer l'admin depuis la requête
    const adminJson = formData.get('adminUser') as string
    if (!adminJson) {
      return NextResponse.json(
        { error: 'Non autorisé - Admin non connecté' },
        { status: 401 }
      )
    }

    let admin;
    try {
      admin = JSON.parse(adminJson)
      if (!admin.id) {
        throw new Error('ID admin manquant')
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Données admin invalides' },
        { status: 400 }
      )
    }

    // Vérifier que l'admin existe dans la base de données
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', admin.id)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json(
        { error: 'Admin non trouvé dans la base de données' },
        { status: 403 }
      )
    }

    // Préparer les données du cours
    const courseToInsert = {
      title,
      description,
      long_description: longDescription,
      level,
      price: parseFloat(price) || 0,
      image_url: imageUrl,
      duration: formData.get('duration') as string,
      category_id: categoryId,
      admin_id: admin.id,
      is_published: true
    }

    console.log('Données du cours à insérer:', courseToInsert)

    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([courseToInsert])
      .select()
      .single()

    if (courseError) {
      console.error('Erreur création cours:', courseError)
      throw courseError
    }

    console.log('Cours créé avec succès:', courseData)

    // 3. Créer les leçons pour ce cours
    const parsedLessons = JSON.parse(formData.get('lessons') as string)
    const lessonsToInsert = parsedLessons.map((lesson: any, index: number) => ({
      course_id: courseData.id,
      title: lesson.title,
      content: lesson.content,
      video_url: lesson.video_url || null,
      order_index: lesson.order_index || index + 1
    }))

    console.log('Leçons à insérer:', lessonsToInsert)

    const { data: insertedLessons, error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessonsToInsert)
      .select()

    if (lessonsError) {
      console.error('Erreur insertion leçons:', lessonsError)
      throw lessonsError
    }

    console.log('Leçons insérées avec succès:', insertedLessons)

    return NextResponse.json({ success: true, courseId: courseData.id })
  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
