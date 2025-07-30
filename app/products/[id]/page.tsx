"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Minus, Plus, QrCode, Truck, Shield, Leaf, Star, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { dummyProducts } from "@/lib/dummy-data"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const { products, setProducts, addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (products.length === 0) {
      setProducts(dummyProducts)
    }

    const foundProduct = products.find((p) => p.id === params.id) || dummyProducts.find((p) => p.id === params.id)
    setProduct(foundProduct)
  }, [params.id, products, setProducts])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center">
            <p className="text-gray-500">Product not found</p>
            <Link href="/products">
              <Button className="mt-4">Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // You could add a toast notification here
  }

  const traceabilityData = [
    {
      stage: "Farm Origin",
      icon: Leaf,
      details: [
        { label: "Farm", value: product.farmer },
        { label: "Harvest Date", value: product.harvestDate },
        { label: "Location", value: "California, USA" },
        { label: "Batch ID", value: product.batchId },
      ],
    },
    {
      stage: "Processing",
      icon: Shield,
      details: [
        { label: "Facility", value: "AgriChain Processing Center" },
        { label: "Process Date", value: "2024-01-16" },
        { label: "Quality Check", value: "Passed" },
        { label: "Certifications", value: product.certifications.join(", ") },
      ],
    },
    {
      stage: "Distribution",
      icon: Truck,
      details: [
        { label: "Packaging Date", value: "2024-01-17" },
        { label: "Expiry Date", value: product.expiryDate },
        { label: "Storage", value: "Temperature Controlled" },
        { label: "Transport", value: "Cold Chain Logistics" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/products" className="flex items-center text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div
              className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {product.stock < 20 && <Badge className="absolute top-4 right-4 bg-red-500">Low Stock</Badge>}
            </div>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Product QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div
                    className="w-28 h-28"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=112&width=112&query=QR code for ${product.batchId})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Scan to trace this product's journey</p>
                <p className="text-xs text-gray-500 mt-1">Batch: {product.batchId}</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-500">(4.8) • 127 reviews</span>
              </div>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert: string) => (
                  <Badge key={cert} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price and Stock */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-bold text-green-600">${product.price}</span>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Stock Available</div>
                  <div className="font-semibold">{product.stock} units</div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Product Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="traceability">Traceability</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{product.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Farmer:</span>
                        <p className="font-medium">{product.farmer}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Harvest Date:</span>
                        <p className="font-medium">{product.harvestDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Expiry Date:</span>
                        <p className="font-medium">{product.expiryDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Batch ID:</span>
                        <p className="font-medium font-mono">{product.batchId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <p className="font-medium">Refrigerated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="traceability" className="space-y-4">
                {traceabilityData.map((stage, index) => {
                  const Icon = stage.icon
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Icon className="h-5 w-5 mr-2 text-green-600" />
                          {stage.stage}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {stage.details.map((detail, idx) => (
                            <div key={idx}>
                              <span className="text-gray-500">{detail.label}:</span>
                              <p className="font-medium">{detail.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium">JS</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">John Smith</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Excellent quality! The traceability feature gives me confidence in what I'm buying. The
                            taste is amazing and knowing exactly where it comes from is a huge plus.
                          </p>
                          <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium">MJ</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">Maria Johnson</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Love the organic certification and the fact that I can trace it back to the farm. Fresh
                            taste and great packaging. Will definitely order again!
                          </p>
                          <p className="text-xs text-gray-500 mt-2">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
