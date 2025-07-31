"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { setHasHydrated } = useStore()

  useEffect(() => {
    setHasHydrated(true)
  }, [setHasHydrated])

  return <>{children}</>
} 