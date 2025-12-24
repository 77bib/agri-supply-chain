"use client"

import React, { useEffect, useState } from "react"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) 
    
  }, [])

  // Render children without the i18n context initially to avoid hydration mismatch
  // The useI18n hook will work after hydration
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
