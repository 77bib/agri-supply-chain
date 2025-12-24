import { cookies } from "next/headers"
import type { Locale } from "@/lib/i18n"
import { HomePageClient } from "@/components/home-page-client"

export default function HomePage() {
  const localeCookie = cookies().get("locale")?.value
  const initialLocale: Locale = localeCookie === "ar" ? "ar" : "fr"

  return <HomePageClient initialLocale={initialLocale} />
}
