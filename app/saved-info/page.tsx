"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Save, 
  Download, 
  Trash2, 
  Package, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { saveCart, loadCart, saveCartToLocalStorage, loadCartFromLocalStorage } from "@/lib/cart-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

export default function SavedInfoPage() {
  const router = useRouter()
  const { currentUser, cart, setCart } = useStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedCart, setSavedCart] = useState<any[]>([])
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    loadSavedCart()
  }, [currentUser, router])

  const loadSavedCart = async () => {
    try {
      setLoading(true)
      const response = await loadCart()
      if (response.success) {
        setSavedCart(response.data.cart)
        setLastSaved(response.data.updatedAt ? new Date(response.data.updatedAt).toLocaleString() : null)
      }
    } catch (error) {
      console.error('Error loading saved cart:', error)
      // محاولة استرجاع من localStorage
      const localCart = loadCartFromLocalStorage()
      setSavedCart(localCart)
      const savedAt = localStorage.getItem('cart-saved-at')
      setLastSaved(savedAt ? new Date(savedAt).toLocaleString() : null)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCart = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    try {
      setSaving(true)
      await saveCart(cart)
      saveCartToLocalStorage(cart) // نسخة احتياطية
      setSavedCart(cart)
      setLastSaved(new Date().toLocaleString())
      toast.success("Cart saved successfully!")
    } catch (error) {
      console.error('Error saving cart:', error)
      toast.error("Failed to save cart")
    } finally {
      setSaving(false)
    }
  }

  const handleRestoreCart = () => {
    if (savedCart.length === 0) {
      toast.error("No saved cart to restore")
      return
    }

    setCart(savedCart)
    toast.success("Cart restored successfully!")
  }

  const handleClearSavedCart = async () => {
    try {
      setLoading(true)
      // حذف من قاعدة البيانات
      await saveCart([])
      // حذف من localStorage
      localStorage.removeItem('saved-cart')
      localStorage.removeItem('cart-saved-at')
      setSavedCart([])
      setLastSaved(null)
      toast.success("Saved cart cleared")
    } catch (error) {
      console.error('Error clearing saved cart:', error)
      toast.error("Failed to clear saved cart")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-gray-500">Redirecting to login...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Information</h1>
          <p className="text-gray-600">Manage your saved cart and preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Current Cart ({cart.length} items)
              </CardTitle>
              <CardDescription>
                Your current shopping cart items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!item.product.image && <Package className="h-6 w-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(calculateTotal(cart))}
                    </span>
                  </div>
                  <Button 
                    onClick={handleSaveCart} 
                    disabled={saving || cart.length === 0}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Cart"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Saved Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Saved Cart ({savedCart.length} items)
              </CardTitle>
              <CardDescription>
                {lastSaved ? `Last saved: ${lastSaved}` : "No saved cart found"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-gray-500">Loading saved cart...</p>
                </div>
              ) : savedCart.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No saved cart found</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Save your current cart to see it here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {savedCart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!item.product.image && <Package className="h-6 w-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(calculateTotal(savedCart))}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleRestoreCart}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Restore Cart
                    </Button>
                    <Button 
                      onClick={handleClearSavedCart}
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Auto Save
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your cart is automatically saved when you logout or navigate away from the site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                Manual Save
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                You can manually save your cart at any time using the "Save Cart" button.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <RefreshCw className="h-4 w-4 mr-2 text-purple-600" />
                Restore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Restore your saved cart to continue shopping where you left off.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
} 