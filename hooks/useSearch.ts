"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (query: string) => {
    console.log("[v0] Handling search for:", query)

    if (!query.trim()) {
      // Si la recherche est vide, aller à la page des cours
      router.push("/courses")
      return
    }

    setIsSearching(true)

    try {
      // Rediriger vers la page des cours avec le paramètre de recherche
      const searchParams = new URLSearchParams({ search: query.trim() })
      router.push(`/courses?${searchParams.toString()}`)
    } catch (error) {
      console.error("[v0] Search navigation error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, query: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch(query)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    handleSearch,
    handleKeyPress,
  }
}
