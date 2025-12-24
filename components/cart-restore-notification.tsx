"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { loadCart, loadCartFromLocalStorage, mergeCarts } from "@/lib/cart-service"
import { toast } from "sonner"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export function CartRestoreNotification() {
  const { currentUser, cart, setCart } = useStore()
  const [hasCheckedRestore, setHasCheckedRestore] = useState(false)

  useEffect(() => {
    if (currentUser && !hasCheckedRestore) {
      checkForSavedCart()
      setHasCheckedRestore(true)
    }
  }, [currentUser, hasCheckedRestore])

  const checkForSavedCart = async () => {
    try {
      // محاولة استرجاع من قاعدة البيانات
      const response = await loadCart()
      if (response.success && response.data.cart.length > 0) {
        const savedCart = response.data.cart
        
        // التحقق من وجود منتجات مختلفة في السلة المحفوظة
        const hasNewItems = savedCart.some(savedItem => 
          !cart.find(currentItem => currentItem.product.id === savedItem.product.id)
        )
        
        if (hasNewItems) {
          showRestoreNotification(savedCart, 'database')
        }
      }
    } catch (error) {
      console.error('Failed to load saved cart:', error)
      
      // محاولة استرجاع من localStorage
      try {
        const localCart = loadCartFromLocalStorage()
        if (localCart.length > 0) {
          const hasNewItems = localCart.some(savedItem => 
            !cart.find(currentItem => currentItem.product.id === savedItem.product.id)
          )
          
          if (hasNewItems) {
            showRestoreNotification(localCart, 'localStorage')
          }
        }
      } catch (localError) {
        console.error('Failed to load cart from localStorage:', localError)
      }
    }
  }

  const showRestoreNotification = (savedCart: any[], source: 'database' | 'localStorage') => {
    const totalItems = savedCart.reduce((total, item) => total + item.quantity, 0)
    const totalValue = savedCart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Saved Cart Found!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {totalItems} items ({formatCurrency(totalValue)}) from your previous session
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Source: {source === 'database' ? 'Cloud' : 'Local Storage'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              size="sm"
              onClick={() => {
                const mergedCart = mergeCarts(savedCart, cart)
                setCart(mergedCart, true) // تخطي الحفظ التلقائي لتجنب التكرار
                toast.success(`Restored ${totalItems} items to your cart!`)
                toast.dismiss(t.id)
              }}
            >
              Restore Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.dismiss(t.id)
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    ), {
      duration: 10000, // 10 seconds
    })
  }

  // هذا المكون لا يعرض أي شيء
  return null
} 