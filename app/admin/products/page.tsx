"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Factory, Plus, Search, Edit, Eye, Star, ShoppingCart, Globe, Heart, Share2, DollarSign } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Dummy products data for public preview
const products = [
  {
    id: "PRD-001",
    name: "Premium Orange Juice",
    description:
      "Freshly squeezed orange juice from organic California oranges. Rich in Vitamin C and natural antioxidants.",
    longDescription:
      "Our Premium Orange Juice is made from carefully selected organic oranges grown in the sunny valleys of California. Each bottle contains the juice of approximately 12-15 oranges, providing you with a refreshing and nutritious beverage. The juice is cold-pressed to preserve maximum nutrients and flavor, then gently pasteurized for safety without compromising taste.",
    price: 4.99,
    originalPrice: 5.99,
    category: "Juices",
    image: "/placeholder.svg?height=300&width=300&text=Orange+Juice",
    gallery: [
      "/placeholder.svg?height=400&width=400&text=Orange+Juice+1",
      "/placeholder.svg?height=400&width=400&text=Orange+Juice+2",
      "/placeholder.svg?height=400&width=400&text=Orange+Juice+3",
    ],
    inStock: true,
    stockLevel: 150,
    isPublic: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 124,
    nutritionalInfo: {
      calories: 110,
      sugar: "22g",
      vitaminC: "120% DV",
      sodium: "2mg",
    },
    certifications: ["Organic", "Non-GMO", "Gluten-Free"],
    origin: "Green Valley Farm, California",
    shelfLife: "7 days refrigerated",
    volume: "500ml",
    tags: ["organic", "fresh", "vitamin-c", "breakfast"],
    seoTitle: "Premium Organic Orange Juice - Fresh & Natural",
    seoDescription: "Delicious organic orange juice packed with Vitamin C. Order fresh, natural orange juice online.",
    seoKeywords: "organic orange juice, fresh juice, vitamin c, natural",
  },
  {
    id: "PRD-002",
    name: "Strawberry Jam",
    description:
      "Homemade-style strawberry jam with real fruit pieces. Made with organic strawberries and minimal sugar.",
    longDescription:
      "Our artisanal Strawberry Jam is crafted using traditional methods with organic strawberries from local farms. We use only natural ingredients and minimal sugar to let the true strawberry flavor shine through. Perfect for breakfast toast, desserts, or as a gourmet addition to your cheese board.",
    price: 6.5,
    originalPrice: 7.5,
    category: "Jams & Preserves",
    image: "/placeholder.svg?height=300&width=300&text=Strawberry+Jam",
    gallery: [
      "/placeholder.svg?height=400&width=400&text=Strawberry+Jam+1",
      "/placeholder.svg?height=400&width=400&text=Strawberry+Jam+2",
      "/placeholder.svg?height=400&width=400&text=Strawberry+Jam+3",
    ],
    inStock: true,
    stockLevel: 85,
    isPublic: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 87,
    nutritionalInfo: {
      calories: 50,
      sugar: "12g",
      fiber: "1g",
      sodium: "0mg",
    },
    certifications: ["Organic", "Local", "No Artificial Preservatives"],
    origin: "Berry Fresh Co, Oregon",
    shelfLife: "12 months unopened, 30 days refrigerated after opening",
    volume: "340g",
    tags: ["organic", "homemade", "natural", "local"],
    seoTitle: "Organic Strawberry Jam - Homemade Style",
    seoDescription: "Artisanal organic strawberry jam made with real fruit. Perfect for breakfast and desserts.",
    seoKeywords: "organic strawberry jam, homemade jam, natural preserves",
  },
  {
    id: "PRD-003",
    name: "Apple Compote",
    description:
      "Traditional apple compote made from heritage variety apples. Slow-cooked to perfection with cinnamon.",
    longDescription:
      "Our Traditional Apple Compote is made from heritage variety apples that are slow-cooked with a touch of cinnamon and natural sweeteners. This versatile compote can be enjoyed on its own, paired with yogurt, or used as a topping for pancakes and desserts. Each jar contains chunks of tender apples in a lightly spiced syrup.",
    price: 5.75,
    originalPrice: 6.25,
    category: "Compotes",
    image: "/placeholder.svg?height=300&width=300&text=Apple+Compote",
    gallery: [
      "/placeholder.svg?height=400&width=400&text=Apple+Compote+1",
      "/placeholder.svg?height=400&width=400&text=Apple+Compote+2",
      "/placeholder.svg?height=400&width=400&text=Apple+Compote+3",
    ],
    inStock: true,
    stockLevel: 120,
    isPublic: true,
    isFeatured: false,
    rating: 4.7,
    reviews: 56,
    nutritionalInfo: {
      calories: 80,
      sugar: "18g",
      fiber: "2g",
      sodium: "1mg",
    },
    certifications: ["Organic", "Heritage Variety", "Traditional Recipe"],
    origin: "Mountain Orchards, Washington",
    shelfLife: "18 months unopened, 45 days refrigerated after opening",
    volume: "420g",
    tags: ["organic", "traditional", "heritage", "cinnamon"],
    seoTitle: "Heritage Apple Compote - Traditional Recipe",
    seoDescription:
      "Delicious apple compote made from heritage apples with cinnamon. Perfect for desserts and breakfast.",
    seoKeywords: "apple compote, heritage apples, traditional recipe, organic",
  },
  {
    id: "PRD-004",
    name: "Mixed Berry Juice",
    description:
      "A delightful blend of strawberries, blueberries, and raspberries. Packed with antioxidants and natural flavor.",
    longDescription:
      "Our Mixed Berry Juice combines the best of summer berries - strawberries, blueberries, and raspberries - into one delicious and nutritious drink. Rich in antioxidants, vitamins, and natural flavors, this juice is perfect for those seeking a healthy and refreshing beverage. No artificial colors or flavors added.",
    price: 5.25,
    originalPrice: 5.99,
    category: "Juices",
    image: "/placeholder.svg?height=300&width=300&text=Mixed+Berry+Juice",
    gallery: [
      "/placeholder.svg?height=400&width=400&text=Mixed+Berry+1",
      "/placeholder.svg?height=400&width=400&text=Mixed+Berry+2",
      "/placeholder.svg?height=400&width=400&text=Mixed+Berry+3",
    ],
    inStock: true,
    stockLevel: 95,
    isPublic: true,
    isFeatured: true,
    rating: 4.6,
    reviews: 73,
    nutritionalInfo: {
      calories: 120,
      sugar: "26g",
      vitaminC: "80% DV",
      antioxidants: "High",
    },
    certifications: ["Organic", "No Artificial Colors", "Antioxidant Rich"],
    origin: "Berry Fresh Co, Oregon",
    shelfLife: "7 days refrigerated",
    volume: "500ml",
    tags: ["organic", "antioxidants", "mixed-berry", "healthy"],
    seoTitle: "Mixed Berry Juice - Antioxidant Rich Blend",
    seoDescription: "Healthy mixed berry juice with strawberries, blueberries, and raspberries. Rich in antioxidants.",
    seoKeywords: "mixed berry juice, antioxidants, healthy juice, organic berries",
  },
  {
    id: "PRD-005",
    name: "Peach Preserves",
    description:
      "Sweet and tangy peach preserves made from tree-ripened Georgia peaches. Perfect for breakfast and baking.",
    longDescription:
      "Our Peach Preserves capture the essence of summer with tree-ripened Georgia peaches. Made using traditional methods with minimal processing to preserve the natural peach flavor and texture. These preserves are perfect for spreading on toast, filling pastries, or enjoying straight from the jar.",
    price: 7.25,
    originalPrice: 8.0,
    category: "Jams & Preserves",
    image: "/placeholder.svg?height=300&width=300&text=Peach+Preserves",
    gallery: [
      "/placeholder.svg?height=400&width=400&text=Peach+Preserves+1",
      "/placeholder.svg?height=400&width=400&text=Peach+Preserves+2",
      "/placeholder.svg?height=400&width=400&text=Peach+Preserves+3",
    ],
    inStock: false,
    stockLevel: 0,
    isPublic: false,
    isFeatured: false,
    rating: 4.5,
    reviews: 34,
    nutritionalInfo: {
      calories: 60,
      sugar: "14g",
      fiber: "1g",
      sodium: "0mg",
    },
    certifications: ["Organic", "Tree-Ripened", "Small Batch"],
    origin: "Sunny Farms, Georgia",
    shelfLife: "15 months unopened, 30 days refrigerated after opening",
    volume: "340g",
    tags: ["organic", "peach", "georgia", "seasonal"],
    seoTitle: "Georgia Peach Preserves - Tree-Ripened Sweetness",
    seoDescription:
      "Delicious peach preserves made from tree-ripened Georgia peaches. Perfect for breakfast and baking.",
    seoKeywords: "peach preserves, georgia peaches, organic preserves",
  },
]

const categories = ["All", "Juices", "Jams & Preserves", "Compotes"]

export default function ProductsPreviewPage() {
  const [selectedTab, setSelectedTab] = useState("catalog")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showPublicOnly, setShowPublicOnly] = useState(true)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    const matchesPublic = !showPublicOnly || product.isPublic
    return matchesSearch && matchesCategory && matchesPublic
  })

  const getStockBadge = (product: any) => {
    if (!product.inStock) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stockLevel < 50) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products Preview</h1>
            <p className="text-muted-foreground">Preview how products appear to customers on the public site</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              View Public Site
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Create a new product for the catalog</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input id="productName" placeholder="Enter product name" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="juices">Juices</SelectItem>
                          <SelectItem value="jams">Jams & Preserves</SelectItem>
                          <SelectItem value="compotes">Compotes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input id="originalPrice" type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea id="description" placeholder="Brief product description" className="h-20" />
                  </div>
                  <div>
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea id="longDescription" placeholder="Detailed product description" className="h-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="volume">Volume/Size</Label>
                      <Input id="volume" placeholder="e.g., 500ml, 340g" />
                    </div>
                    <div>
                      <Label htmlFor="origin">Origin</Label>
                      <Input id="origin" placeholder="e.g., Green Valley Farm" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="organic, fresh, natural" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stockLevel">Stock Level</Label>
                      <Input id="stockLevel" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Status</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="inStock" />
                          <Label htmlFor="inStock">In Stock</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="isPublic" />
                          <Label htmlFor="isPublic">Public</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="isFeatured" />
                          <Label htmlFor="isFeatured">Featured</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input id="seoTitle" placeholder="SEO optimized title" />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea id="seoDescription" placeholder="SEO meta description" className="h-16" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Create Product</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
            <TabsTrigger value="preview">Product Preview</TabsTrigger>
            <TabsTrigger value="seo">SEO & Marketing</TabsTrigger>
            <TabsTrigger value="analytics">Product Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Switch id="publicOnly" checked={showPublicOnly} onCheckedChange={setShowPublicOnly} />
                      <Label htmlFor="publicOnly">Public Only</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.isFeatured && <Badge className="absolute top-2 left-2 bg-blue-600">Featured</Badge>}
                    {!product.isPublic && <Badge className="absolute top-2 right-2 bg-gray-600">Draft</Badge>}
                    {product.originalPrice > product.price && (
                      <Badge className="absolute bottom-2 left-2 bg-red-600">Sale</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {getStockBadge(product)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center space-x-2">
                        {renderStars(product.rating)}
                        <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {product.certifications.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.certifications.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>How customers see your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedProduct.rating)}
                      <span className="text-sm text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">${selectedProduct.price.toFixed(2)}</span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${selectedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <Badge className="bg-red-100 text-red-800">
                          Save ${(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Product Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="ml-2">{selectedProduct.volume}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Origin:</span>
                        <span className="ml-2">{selectedProduct.origin}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Shelf Life:</span>
                        <span className="ml-2">{selectedProduct.shelfLife}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Certifications</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedProduct.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {getStockBadge(selectedProduct)}
                  <div className="flex space-x-2">
                    <Button className="flex-1" disabled={!selectedProduct.inStock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {selectedProduct.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Information</CardTitle>
                  <CardDescription>Per serving nutrition facts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Nutrition Facts</h3>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedProduct.nutritionalInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm text-muted-foreground">{selectedProduct.longDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Gallery</CardTitle>
                <CardDescription>Additional product images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {selectedProduct.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>What customers are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      date: "2024-01-18",
                      review:
                        "Absolutely delicious! The quality is exceptional and you can really taste the difference.",
                    },
                    {
                      name: "Mike R.",
                      rating: 4,
                      date: "2024-01-15",
                      review: "Great product, fast delivery. Will definitely order again.",
                    },
                    {
                      name: "Emily K.",
                      rating: 5,
                      date: "2024-01-12",
                      review: "Love supporting local farmers and this product is amazing. Highly recommend!",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Search engine optimization for {selectedProduct.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input id="seoTitle" value={selectedProduct.seoTitle} className="mt-1" readOnly />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedProduct.seoTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Meta Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={selectedProduct.seoDescription}
                      className="mt-1 h-20"
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedProduct.seoDescription.length}/160 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoKeywords">Keywords</Label>
                    <Input id="seoKeywords" value={selectedProduct.seoKeywords} className="mt-1" readOnly />
                  </div>
                  <div>
                    <Label>URL Slug</Label>
                    <div className="mt-1 p-2 bg-muted rounded text-sm font-mono">
                      /products/{selectedProduct.name.toLowerCase().replace(/\s+/g, "-")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Preview</CardTitle>
                  <CardDescription>How your product appears when shared</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 space-y-3">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-blue-600 hover:underline cursor-pointer">
                        {selectedProduct.seoTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProduct.seoDescription}</p>
                      <p className="text-xs text-muted-foreground mt-1">agrichain.com • {selectedProduct.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
                <CardDescription>Active and planned marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Summer Fresh Campaign</h4>
                        <p className="text-sm text-muted-foreground">Promoting seasonal products with 15% discount</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Impressions:</span>
                        <p className="font-medium">12,450</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clicks:</span>
                        <p className="font-medium">1,234</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversions:</span>
                        <p className="font-medium">87</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Back to School Promotion</h4>
                        <p className="text-sm text-muted-foreground">Healthy lunch options for families</p>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="ml-2">August 15, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,947</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Add to Cart</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+8.2%</span> conversion rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Purchases</CardTitle>
                  <Factory className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">891</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+15.3%</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,447</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>Sales and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products
                      .filter((p) => p.isPublic)
                      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.reviews} reviews • {product.rating} stars
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(product.price * Math.floor(Math.random() * 100 + 50)).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                  <CardDescription>Customer behavior and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Returning Customers</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Order Value</span>
                      <span className="text-sm font-medium">$24.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium text-green-600">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recommendation Rate</span>
                      <span className="text-sm font-medium text-green-600">92%</span>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Top Search Terms</h4>
                      <div className="space-y-1">
                        {["organic juice", "strawberry jam", "fresh fruit", "natural products", "healthy snacks"].map(
                          (term, index) => (
                            <div key={term} className="flex justify-between text-sm">
                              <span>{term}</span>
                              <span className="text-muted-foreground">{100 - index * 15} searches</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
