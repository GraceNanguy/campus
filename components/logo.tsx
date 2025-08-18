import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  mode?: "image" | "mark"
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
  imageSrc?: string
  imageAlt?: string
  className?: string
}

const sizes = {
  sm: { box: 28, text: "text-base" },
  md: { box: 32, text: "text-lg" },
  lg: { box: 40, text: "text-xl" },
}

export default function Logo({
  mode = "mark",
  size = "md",
  showWordmark = true,
  imageSrc = "/images/logo-placeholder.png",
  imageAlt = "Logo AY E-ACADEMIE",
  className,
}: LogoProps) {
  const S = sizes[size]
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {mode === "image" ? (
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          width={S.box}
          height={S.box}
          className="h-auto w-auto"
          priority
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: S.box, height: S.box, backgroundColor: "#141835" }}
          aria-hidden="true"
        >
          <span className="sr-only">Logo</span>
          <span className="text-xs font-bold text-white">LH</span>
        </div>
      )}
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", S.text)} style={{ color: "#141835" }}>
          AY E-ACADEMIE
        </span>
      )}
    </div>
  )
}
