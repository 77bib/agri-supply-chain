"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Leaf, 
  ArrowLeft,
  RefreshCw,
  Heart,
  Share2
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { getProductById } from "@/lib/product-service"
import { createOrder } from "@/lib/order-service"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  quantity: number
  supplier: string
  image?: string
  createdAt: string
  updatedAt: string
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { currentUser } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const productId = params.id as string

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await getProductById(productId)
      
      if (response.success) {
        setProduct(response.data)
      } else {
        toast.error("Product not found")
        router.push("/products")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Error loading product")
      router.push("/products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (!product) return

    try {
      setAddingToCart(true)
      const response = await createOrder({
        productId: product._id,
        quantity: quantity
      })

      if (response.success) {
        toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
        setQuantity(1)
      } else {
        toast.error(response.message || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Error adding to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (quantity < 10) {
      return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
    }
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product?.quantity || 1))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Product not found</p>
            <Link href="/products">
              <Button className="mt-4">Back to Products</Button>
            </Link>
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <div
                className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: product.image ? `url(${product.image})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!product.image && <Package className="h-24 w-24 text-gray-400" />}
                {product.quantity < 10 && product.quantity > 0 && (
                  <Badge className="absolute top-4 right-4 bg-orange-500">Low Stock</Badge>
                )}
                {product.quantity === 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">By {product.supplier}</span>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-green-600">{formatCurrency(product.price)}</span>
                  <span className="text-sm text-gray-500 ml-2">per unit</span>
                </div>
                {getStockBadge(product.quantity)}
              </div>

              <div className="text-sm text-gray-600">
                <p>Stock: {product.quantity} units available</p>
                <p>Added on {new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0 rounded-none"
                    min="1"
                    max={product.quantity}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    className="rounded-l-none"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || addingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "Adding..." : currentUser ? "Add to Cart" : "Login to Buy"}
              </Button>

              {!currentUser && (
                <p className="text-sm text-center text-gray-600">
                  Please{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    login
                  </Link>{" "}
                  to add this product to your cart
                </p>
              )}
            </div>

            <Separator />

            {/* Product Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Organic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Quality Assured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Fresh Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 space-y-8">
          <Separator />

          {/* Product Details Tabs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Product Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium">{product.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{product.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added:</span>
                    <span className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Free shipping on orders over DZ 50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Standard delivery: 2-3 business days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Eco-friendly packaging</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products Placeholder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">You Might Also Like</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Related Product {i}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatCurrency(0)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
