import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database
export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface Admin {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: string
  level: string
  image_url: string
  category_id: string
  admin_id: string
  is_published: boolean
  created_at: string
  category?: {
    name: string
    description: string
  }
}

export interface Category {
  id: string
  name: string
  description: string
}
