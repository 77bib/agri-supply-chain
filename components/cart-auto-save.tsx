"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { saveCart, saveCartToLocalStorage } from "@/lib/cart-service"

export function CartAutoSave() {
  const { cart, currentUser } = useStore()

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser && cart.length > 0) {
        try {
          // حفظ بيانات
          await saveCart(cart)
          // حفظ في localStorage كنسخة احتياطية
          saveCartToLocalStorage(cart)
        } catch (error) {
          console.error('Failed to save cart before unload:', error)
          // حفظ في localStorage فقط كنسخة احتياطية
          saveCartToLocalStorage(cart)
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentUser && cart.length > 0) {
        // حفظ عند إخفاء الصفحة
        saveCart(cart).catch(error => {
          console.error('Failed to save cart on visibility change:', error)
        })
        saveCartToLocalStorage(cart)
      }
    }

    // إضافة event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // تنظيف عند unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [cart, currentUser])

  // هذا المكون لا يعرض أي شيء
  return null
} 
