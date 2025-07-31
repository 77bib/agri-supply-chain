"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"

interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HydrationBoundary({ children, fallback = null }: HydrationBoundaryProps) {
  const { _hasHydrated } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !_hasHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 