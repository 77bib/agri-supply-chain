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
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CartPage() {
  const router = useRouter()
  const { cart, updateCartQuantity, removeFromCart, clearCart, currentUser } = useStore()
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          
          {cart.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">
                <Package className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart Items ({totalItems})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!item.product.image && <Package className="h-8 w-8 text-gray-400" />}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.product.description.substring(0, 100)}
                                {item.product.description.length > 100 && "..."}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.product.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.product.farmer}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
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
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${calculateShipping().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (15%)</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Package className="h-4 w-4 text-green-600" />
                      <span>30-day return policy</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {loading ? "Processing..." : "Proceed to Checkout"}
                  </Button>

                  {/* Continue Shopping */}
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
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
