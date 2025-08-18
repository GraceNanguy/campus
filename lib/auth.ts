import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export async function signUpUser(email: string, password: string, fullName: string) {
  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user into database
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password_hash: passwordHash, full_name: fullName }])
      .select()
      .single()

    if (error) throw error
    return { user: data, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export async function signInUser(email: string, password: string) {
  try {
    // Get user from database
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { user: null, error: "Utilisateur non trouvé" }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { user: null, error: "Mot de passe incorrect" }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export async function signInAdmin(email: string, password: string) {
  try {
    // Get admin from database
    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).single()

    if (error || !admin) {
      return { admin: null, error: "Admin non trouvé" }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    if (!isValidPassword) {
      return { admin: null, error: "Mot de passe incorrect" }
    }

    return { admin, error: null }
  } catch (error) {
    return { admin: null, error: error.message }
  }
}
