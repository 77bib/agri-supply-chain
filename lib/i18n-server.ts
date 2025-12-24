import type { Locale } from "@/lib/i18n"

type Messages = Record<string, string>

export async function getServerI18n() {
  const { cookies, headers } = await import("next/headers")
  const cookieLocale = cookies().get("locale")?.value as Locale | undefined
  let locale: Locale = (cookieLocale === "ar" || cookieLocale === "fr") ? cookieLocale : "fr"

  // If no cookie exists, keep the default locale as French.
  // We intentionally avoid auto-detecting from Accept-Language to prevent surprise switches.
  if (!cookieLocale) {
    void headers
  }

  const messages = (await import(`@/locales/${locale}.json`)).default as Messages
  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr"
  return { locale, dir, messages }
}
