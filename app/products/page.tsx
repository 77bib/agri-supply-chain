"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Filter, Star, Package, RefreshCw, Plus, Minus, Eye, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { getPublicProducts } from "@/lib/product-service"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
}

export default function ProductsPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { currentUser, cart, addToCart, updateCartQuantity, _hasHydrated } = useStore()
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
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getPublicProducts(
        page,
        12,
        selectedCategory === "all" ? undefined : selectedCategory,
        searchTerm || undefined,
        sortBy,
        sortOrder
      )
      
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

  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const quantity = quantities[product._id] || 1
    const cartProduct = {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || "",
      category: product.category,
      stock: product.quantity,
      batchId: "",
      harvestDate: "",
      expiryDate: "",
      farmer: product.supplier,
      certifications: []
    }

    addToCart(cartProduct, quantity)
    toast.success(t('productsPage.addedToCart', { quantity, product: product.name }))
    setQuantities(prev => ({ ...prev, [product._id]: 1 }))
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities(prev => ({ ...prev, [productId]: newQuantity }))
  }

  const getCartItemQuantity = (productId: string) => {
    if (!_hasHydrated) return 0
    const cartItem = cart.find(item => item.product.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge className="bg-red-500 text-white">{t('productsPage.outOfStock')}</Badge>
    } else if (quantity < 10) {
      return <Badge className="bg-orange-500 text-white">{t('productsPage.lowStock')}</Badge>
    } else {
      return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">{t('productsPage.inStock')}</Badge>
    }
  }

  const cartItemsCount = _hasHydrated ? cart.reduce((total, item) => total + item.quantity, 0) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('productsPage.premiumCollection')}</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('productsPage.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('productsPage.subtitle')}
          </p>
          
          {/* Cart Summary */}
          {currentUser && cartItemsCount > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 border border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-800 dark:text-blue-200 font-semibold text-lg">
                      {t('productsPage.cartItems', { count: cartItemsCount })}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{t('productsPage.readyCheckout')}</p>
                  </div>
                </div>
                
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 border border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg animate-fade-in-up">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium text-lg">
                    {t('productsPage.loginMessage', {
                      login: t('productsPage.login'),
                      register: t('productsPage.register')
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-8 border border-blue-100 dark:border-blue-700 animate-fade-in-up">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 dark:text-blue-500 h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600">
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={fetchProducts} 
              disabled={loading}
              className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{products.length}</span> of{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">{totalProducts}</span> products
            </p>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Filtered Results</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => {
              const cartQuantity = getCartItemQuantity(product._id)
              const selectedQuantity = quantities[product._id] || 1
              
              return (
                <Card 
                  key={product._id} 
                  className="overflow-hidden hover-lift group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div
                      className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden"
                      style={{
                        backgroundImage: product.image ? `url(${product.image})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {!product.image && <Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {product.quantity < 10 && product.quantity > 0 && (
                        <Badge className="absolute top-3 right-3 bg-orange-500 text-white shadow-lg">Low Stock</Badge>
                      )}
                      {product.quantity === 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white shadow-lg">Out of Stock</Badge>
                      )}
                    </div>
                    
                    {/* Cart Quantity Badge */}
                    {cartQuantity > 0 && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg animate-pulse">
                        {cartQuantity} in cart
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                          {product.description.substring(0, 80)}
                          {product.description.length > 80 && "..."}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(4.8)</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-green-200 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950">
                        {product.supplier}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-3xl font-bold text-gradient">{formatCurrency(product.price)}</span>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stock: {product.quantity}</div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    {currentUser && product.quantity > 0 && (
                      <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(product._id, selectedQuantity - 1)}
                          disabled={selectedQuantity <= 1}
                          className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center text-gray-700 dark:text-gray-200">
                          {selectedQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(product._id, selectedQuantity + 1)}
                          disabled={selectedQuantity >= product.quantity}
                          className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      
                      <Button 
                        onClick={() => handleAddToCart(product)} 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate"
                        disabled={product.quantity === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {currentUser ? "Add to Cart" : "Login to Buy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">No products found matching your criteria.</p>
            <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filter options.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-3 mt-12 animate-fade-in-up">
            <Button 
              variant="outline" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
              className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
            >
              Previous
            </Button>
            <div className="flex items-center px-6 py-2 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600 shadow-sm">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Page {page} of {totalPages}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
              className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
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
