"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { checkAuthStatus, saveUserToStore } from "@/lib/auth-service"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const { currentUser, isAdmin, _hasHydrated } = useStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!_hasHydrated) {
        return // انتظار حتى يتم hydration
      }

      try {
        // التحقق من حالة المصادقة إذا لم يكن المستخدم محمل
        if (!currentUser) {
          const authStatus = await checkAuthStatus()
          
          if (authStatus.isAuthenticated && authStatus.user) {
            saveUserToStore(authStatus.user, authStatus.isAdmin)
          }
        }

        // التحقق من المتطلبات
        if (requireAuth && !currentUser) {
          router.push(redirectTo)
          return
        }

        if (requireAdmin && !isAdmin) {
          router.push("/admin/login")
          return
        }

        setIsChecking(false)
      } catch (error) {
        console.error("خطأ في التحقق من المصادقة:", error)
        if (requireAuth) {
          router.push(redirectTo)
        }
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [currentUser, isAdmin, _hasHydrated, requireAuth, requireAdmin, redirectTo, router])

  // عرض loading أثناء التحقق
  if (isChecking || !_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    )
  }

  // إذا لم يتم تلبية المتطلبات، لا تعرض المحتوى
  if (requireAuth && !currentUser) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
} 