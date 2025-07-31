"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateCartQuantity, removeFromCart, clearCart, currentUser } = useStore()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center">
            <p className="text-gray-500">Redirecting to login...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ... rest of the component remains the same
}
