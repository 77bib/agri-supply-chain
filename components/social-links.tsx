import { Facebook, Instagram, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = {
  instagram: {
    href: "https://www.instagram.com/bri_juice?igsh=aHlmMTRkMXdmcXJ5",
    label: "Instagram",
    Icon: Instagram,
  },
  facebook: {
    href: "https://www.facebook.com/share/1B1CFCgwSq/",
    label: "Facebook",
    Icon: Facebook,
  },
  tiktok: {
    href: "https://www.tiktok.com/@bri.juice2?is_from_webapp=1&sender_device=pc",
    label: "TikTok",
    Icon: Music2,
  },
} as const

export function SocialLinks({
  className,
  iconClassName,
}: {
  className?: string
  iconClassName?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Object.values(LINKS).map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200",
            "transition-colors duration-300 hover:bg-white/10 hover:text-white",
          )}
        >
          <Icon className={cn("h-5 w-5", iconClassName)} aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  )
}
