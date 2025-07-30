import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Truck, BarChart3, Shield, QrCode, Users, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container-custom text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Supply Chain for
              <span className="text-green-600"> Fresh Produce</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From farm to table, we ensure quality, traceability, and efficiency in every step of our supply chain
              using IoT, blockchain, and predictive analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Leaf className="mr-2 h-5 w-5" />
                  Browse Products
                </Button>
              </Link>
              <Link href="/trace">
                <Button size="lg" variant="outline">
                  <QrCode className="mr-2 h-5 w-5" />
                  Trace Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Smart Solutions</h2>
            <p className="text-lg text-gray-600">Revolutionizing agri-food supply chain management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/iot-monitoring">
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer">
                <CardHeader>
                  <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>IoT Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Real-time tracking of delivery trucks with temperature and location monitoring
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blockchain-traceability">
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer">
                <CardHeader>
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Blockchain Traceability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Complete transparency from farm to product with immutable records</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/predictive-analytics">
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">AI-powered demand forecasting to reduce waste and optimize inventory</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/partner-network">
              <Card className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer">
                <CardHeader>
                  <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle>Partner Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Seamless management of farmers, suppliers, and logistics partners</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-lg text-gray-600">Fresh, traceable, and sustainable</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">🧃</span>
              </div>
              <CardHeader>
                <CardTitle>Fresh Juices</CardTitle>
                <CardDescription>100% natural fruit juices with no preservatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Organic</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline">
                      <ArrowRight className="h-4 w-4 ml-1" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">🍯</span>
              </div>
              <CardHeader>
                <CardTitle>Artisan Jams</CardTitle>
                <CardDescription>Handcrafted jams from locally sourced fruits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Local</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline">
                      <ArrowRight className="h-4 w-4 ml-1" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">🥣</span>
              </div>
              <CardHeader>
                <CardTitle>Premium Compotes</CardTitle>
                <CardDescription>Slow-cooked compotes with traditional recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Traditional</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline">
                      <ArrowRight className="h-4 w-4 ml-1" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Waste Reduction</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-100">Partner Farmers</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">On-time Delivery</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Traceability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Partners Say</h2>
            <p className="text-lg text-gray-600">Trusted by farmers, retailers, and consumers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "AgriChain has revolutionized how we manage our supply chain. The traceability features give our
                  customers complete confidence in our products."
                </p>
                <div className="font-semibold">Maria Rodriguez</div>
                <div className="text-sm text-gray-500">Green Valley Farm</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The IoT monitoring has reduced our spoilage by 30%. We can track temperature and location in
                  real-time, ensuring product quality."
                </p>
                <div className="font-semibold">John Smith</div>
                <div className="text-sm text-gray-500">FreshLogistics</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a consumer, I love being able to scan the QR code and see exactly where my food comes from. It's
                  transparency at its best."
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Customer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Supply Chain?</h2>
          <p className="text-lg text-gray-600 mb-8">Join hundreds of agri-food companies already using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">Explore Products</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
