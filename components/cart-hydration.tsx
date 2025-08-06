"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { loadCart, loadCartFromLocalStorage, mergeCarts } from "@/lib/cart-service"

export function CartHydration() {
  const { currentUser, cart, setCart, _hasHydrated } = useStore()

  useEffect(() => {
    const initializeCart = async () => {
      // Only run after hydration
      if (!_hasHydrated) return
      
      // If no user is logged in, clear the cart
      if (!currentUser) {
        setCart([], true) // Clear cart for logged-out users
        return
      }

      // Clear current cart first to ensure user isolation
      setCart([], true)

      try {
        // Try to load cart from database for the current user
        const response = await loadCart()
        if (response.success && response.data.cart && response.data.cart.length > 0) {
          console.log('Loading cart from database:', response.data.cart.length, 'items')
          setCart(response.data.cart, true) // Skip auto-save to prevent loops
          return
        } else {
          console.log('No saved cart found for this user')
        }
      } catch (error) {
        console.log('Database cart load failed, trying localStorage...')
      }

      try {
        // Fallback to localStorage
        const localCart = loadCartFromLocalStorage()
        if (localCart && localCart.length > 0) {
          console.log('Loading cart from localStorage:', localCart.length, 'items')
          setCart(localCart, true) // Skip auto-save to prevent loops
        } else {
          console.log('No cart found in localStorage either')
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }

    initializeCart()
  }, [_hasHydrated, currentUser, setCart])

  return null
}