"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Filter, Star, Package, RefreshCw } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { getPublicProducts } from "@/lib/product-service"
import { createOrder } from "@/lib/order-service"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
}

export default function ProductsPage() {
  const router = useRouter()
  const { currentUser } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getPublicProducts({
        page,
        limit: 12,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchTerm || undefined,
        sortBy,
        sortOrder
      })
      
      if (response.success) {
        setProducts(response.data)
        setCategories(response.categories || [])
        setTotalPages(response.pagination?.pages || 1)
        setTotalProducts(response.pagination?.total || 0)
      } else {
        toast.error("Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error fetching products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, selectedCategory, searchTerm, sortBy, sortOrder])

  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      router.push("/login")
      return
    }

    try {
      const response = await createOrder({
        productId: product._id,
        quantity: 1
      })

      if (response.success) {
        toast.success("Product added to cart successfully!")
        // You could also update a cart state here if needed
      } else {
        toast.error(response.message || "Failed to add product to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Error adding product to cart")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">Discover our range of fresh, organic, and traceable products</p>
          {!currentUser && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                Please{" "}
                <Link href="/login" className="underline">
                  login
                </Link>{" "}
                or{" "}
                <Link href="/register" className="underline">
                  create an account
                </Link>{" "}
                to add products to your cart and make purchases.
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchProducts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <div
                    className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: product.image ? `url(${product.image})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!product.image && <Package className="h-12 w-12 text-gray-400" />}
                    {product.quantity < 10 && product.quantity > 0 && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                    )}
                    {product.quantity === 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {product.description.substring(0, 80)}
                        {product.description.length > 80 && "..."}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.8)</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.supplier}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-green-600">${product.price}</span>
                      <div className="text-sm text-gray-500">Stock: {product.quantity}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/products/${product._id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleAddToCart(product)} 
                      className="flex-1" 
                      disabled={product.quantity === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {currentUser ? "Add to Cart" : "Login to Buy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
