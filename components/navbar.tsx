"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/courses", label: "Cours" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Aller à l'accueil">
            <Image src="/logo-placeholder.png" alt="AY E-CAMPUS Logo" width={32} height={32} />
            <span className="text-lg font-semibold tracking-tight text-[#141835]">AY E-CAMPUS</span>
          </Link>
          <div className="animate-pulse">Chargement...</div>
        </nav>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Aller à l'accueil">
          <Image src="/logo-placeholder.png" alt="AY E-CAMPUS Logo" width={32} height={32} />
          <span className="text-lg font-semibold tracking-tight text-[#141835]">AY E-CAMPUS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-4">
            {links.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#141835]",
                      active ? "text-[#141835]" : "text-gray-600",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/courses/new">
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Nouveau cours
                  </Button>
                </Link>
              )}

              <span className="hidden sm:inline text-sm text-gray-600">
                Bonjour, {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-[#141835] text-white hover:bg-[#1a1f4a]">Connexion</Button>
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[380px] p-0">
              <SheetHeader className="px-4 pb-2 pt-4">
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Image src="/logo-placeholder.png" alt="AY E-CAMPUS Logo" width={32} height={32} />
                    <span className="text-base font-semibold text-[#141835]">AY E-CAMPUS</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <div className="flex flex-col gap-1 p-2">
                {links.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-4 py-3 text-base font-medium transition-colors",
                        active ? "bg-[#141835]/5 text-[#141835]" : "text-gray-700 hover:bg-gray-100",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="p-4 space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin/courses/new" className="block">
                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                          <Plus className="h-4 w-4" />
                          Nouveau cours
                        </Button>
                      </Link>
                    )}
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full justify-start gap-2 bg-transparent"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]">Connexion</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
