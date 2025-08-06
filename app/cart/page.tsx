"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CartPage() {
  const router = useRouter()
  const { cart, updateCartQuantity, removeFromCart, clearCart, currentUser, _hasHydrated } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
  }, [currentUser, router])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      toast.success("Product removed from cart")
      return
    }
    
    const product = cart.find(item => item.product.id === productId)
    if (product && newQuantity > product.product.stock) {
      toast.error(`Only ${product.product.stock} items available in stock`)
      return
    }
    
    updateCartQuantity(productId, newQuantity)
    toast.success("Cart updated")
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    toast.success("Product removed from cart")
  }

  const handleClearCart = () => {
    clearCart()
    toast.success("Cart cleared")
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    router.push("/checkout")
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cart.length > 0 ? 10 : 0 // Fixed shipping cost
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.15 // 15% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  // Show loading while waiting for hydration
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600 text-lg">Redirecting to login...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/products">
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
          
          {cart.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCart}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Start exploring our premium products!
            </p>
            <Link href="/products">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate"
              >
                <Package className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    Cart Items ({totalItems})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cart.map((item, index) => (
                    <div 
                      key={item.product.id} 
                      className="border border-blue-100 rounded-xl p-6 hover-lift transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
                            style={{
                              backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!item.product.image && <Package className="h-10 w-10 text-gray-400" />}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 truncate mb-2">
                                {item.product.name}
                              </h3>
                              <p className="text-gray-600 mb-3 leading-relaxed">
                                {item.product.description.substring(0, 120)}
                                {item.product.description.length > 120 && "..."}
                              </p>
                              <div className="flex items-center space-x-3 mb-4">
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                  {item.product.category}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  {item.product.farmer}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-lg font-semibold min-w-[3rem] text-center text-gray-700">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gradient">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.product.price} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm sticky top-24">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-semibold text-lg">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">${calculateShipping().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax (15%)</span>
                      <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator className="bg-blue-200" />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gradient text-2xl">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 pt-4 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 text-sm text-blue-800">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-green-800">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-blue-800">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span>30-day return policy</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate text-lg font-semibold"
                    disabled={loading}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {loading ? "Processing..." : "Proceed to Checkout"}
                  </Button>

                  {/* Continue Shopping */}
                  <Link href="/products">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
