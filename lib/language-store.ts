"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LanguageStore {
  language: "fr" | "ar"
  setLanguage: (lang: "fr" | "ar") => void
  toggleLanguage: () => void
  isRTL: boolean
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "fr",
      isRTL: false,
      setLanguage: (lang: "fr" | "ar") =>
        set({
          language: lang,
          isRTL: lang === "ar",
        }),
      toggleLanguage: () => {
        const current = get().language
        const newLang = current === "fr" ? "ar" : "fr"
        set({
          language: newLang,
          isRTL: newLang === "ar",
        })
      },
    }),
    {
      name: "language-storage",
    }
  )
)
