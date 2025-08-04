"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { checkAuthStatus, saveUserToStore } from "@/lib/auth-service"

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { setHasHydrated } = useStore()

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
    const initializeAuth = async () => {
      try {
        const authStatus = await checkAuthStatus()
        
        if (authStatus.isAuthenticated && authStatus.user) {
          // استعادة حالة المستخدم
          saveUserToStore(authStatus.user, authStatus.isAdmin)
        }
      } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error)
      } finally {
        // تعيين حالة hydration
        setHasHydrated(true)
      }
    }

    initializeAuth()
  }, [setHasHydrated])

  return <>{children}</>
} 