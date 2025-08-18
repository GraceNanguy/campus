"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkIfAdmin(session.user.email!)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await checkIfAdmin(session.user.email!)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkIfAdmin = async (email: string) => {
    const { data } = await supabase.from("admins").select("id").eq("email", email).single()

    setIsAdmin(!!data)
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log("[v0] Starting signup process for:", email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    })

    console.log("[v0] Supabase auth signup result:", { data, error })

    if (!error && data.user) {
      console.log("[v0] Creating user in users table:", data.user.id)

      const { data: userData, error: userError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
      })

      console.log("[v0] Users table insert result:", { userData, userError })

      if (userError) {
        console.error("[v0] Error inserting user:", userError)
      }
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log("[v0] Starting signin process for:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("[v0] Supabase auth signin result:", { data, error })

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
