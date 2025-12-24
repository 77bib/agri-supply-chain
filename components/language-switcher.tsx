"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur px-2 py-1 shadow-sm">
      <span className="text-xs text-gray-600 dark:text-gray-300">{t("switcher.label")}</span>
      <Button
        size="sm"
        variant={locale === "fr" ? "default" : "outline"}
        onClick={() => setLocale("fr")}
      >
        🇫🇷 {t("switcher.fr")}
      </Button>
      <Button
        size="sm"
        variant={locale === "ar" ? "default" : "outline"}
        onClick={() => setLocale("ar")}
      >
        🇲🇦 {t("switcher.ar")}
      </Button>
    </div>
  )
}
