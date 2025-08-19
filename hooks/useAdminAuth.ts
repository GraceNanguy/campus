'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useAdminAuth() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<null | { id: string; email: string; name: string }>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'admin est connecté
    const checkAuth = async () => {
      const stored = localStorage.getItem('adminUser')
      if (!stored) {
        router.push('/admin/login')
        return
      }

      const admin = JSON.parse(stored)

      // Vérifier si l'admin existe toujours dans la base de données
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, full_name')
        .eq('id', admin.id)
        .single()

      if (error || !data) {
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
        return
      }

      setAdminData({
        id: data.id,
        email: data.email,
        name: data.full_name
      })
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  return { adminData, loading, logout }
}
