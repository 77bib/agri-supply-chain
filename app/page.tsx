"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, BarChart3, Shield, QrCode, Users, Star, ArrowRight, Leaf, Zap, Globe, Play, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { currentUser } = useStore()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 dark:from-blue-500/10 dark:to-green-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-6">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Smart Supply Chain Platform</span>
              </div>
              
              {/* Welcome message for logged-in users */}
              {isLoaded && currentUser && (
                <div className="mb-4 animate-fade-in-up">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-full border border-green-200 dark:border-green-700">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Welcome back, {currentUser.name}! 👋
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900 dark:text-gray-100">Smart Supply Chain for</span>
              <br />
              <span className="text-gradient">Fresh Produce</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              From farm to table, we ensure quality, traceability, and efficiency in every step of our supply chain
              using IoT, blockchain, and predictive analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isLoaded && currentUser ? (
                // Buttons for logged-in users
                <>
                  <Link href="/products">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
                      <Leaf className="mr-2 h-5 w-5" />
                      Shop Products
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button size="lg" variant="outline" className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      View Cart
                    </Button>
                  </Link>
                </>
              ) : (
                // Buttons for guests
                <>
                  <Link href="/products">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
                      <Leaf className="mr-2 h-5 w-5" />
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/trace">
                    <Button size="lg" variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
                      <QrCode className="mr-2 h-5 w-5" />
                      Trace Products
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">25%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Waste Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Partner Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">On-time Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Traceability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Smart Solutions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Revolutionizing agri-food supply chain management with cutting-edge technology</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/iot-monitoring">
              <Card className="text-center hover-lift cursor-pointer animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">IoT Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Real-time tracking of delivery trucks with temperature and location monitoring
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/blockchain-traceability">
              <Card className="text-center hover-lift cursor-pointer animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Blockchain Traceability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Complete transparency from farm to product with immutable records</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/predictive-analytics">
              <Card className="text-center hover-lift cursor-pointer animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">AI-powered demand forecasting to reduce waste and optimize inventory</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/partner-network">
              <Card className="text-center hover-lift cursor-pointer animate-fade-in-up group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Partner Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Seamless management of farmers, suppliers, and logistics partners</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Featured Videos</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Discover Our Platform</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Watch how our smart supply chain solutions are transforming the agri-food industry</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="animate-fade-in-up group">
              <Card className="overflow-hidden hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-green-500 group-hover:scale-105 transition-transform duration-500">
                  <iframe
                    src="https://www.youtube.com/embed/bN9PnrmnDSk?si=9PNINeRZNOsYLmWZ"
                    title="Bifa Supply Chain Platform Overview"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Platform Overview</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Discover how our smart supply chain platform works</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Video 2 */}
            <div className="animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <Card className="overflow-hidden hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
                <div className="relative aspect-video bg-gradient-to-br from-green-500 to-blue-500 group-hover:scale-105 transition-transform duration-500">
                  <iframe
                    src="https://www.youtube.com/embed/VJJmUKgqhJo?si=E0of5XwXdMGQ"
                    title="IoT Monitoring System"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">IoT Monitoring</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Real-time tracking and monitoring capabilities</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Video 3 */}
            <div className="animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <Card className="overflow-hidden hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-500 group-hover:scale-105 transition-transform duration-500">
                  <iframe
                    src="https://www.youtube.com/embed/wDHol8z31wM?si=h9z8KSq76g-hw7rt"
                    title="Blockchain Traceability"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Blockchain Technology</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Transparent and secure product traceability</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Video 4 */}
            <div className="animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
              <Card className="overflow-hidden hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-700">
                <div className="relative aspect-video bg-gradient-to-br from-green-500 to-purple-500 group-hover:scale-105 transition-transform duration-500">
                  <iframe
                    src="https://www.youtube.com/embed/0p4RAGh8z5M?si=AxUE9eAzepXECBzT"
                    title="Predictive Analytics"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Predictive Analytics</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">AI-powered forecasting and optimization</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Premium Products</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Fresh, traceable, and sustainable products from trusted partners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover-lift group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                <span className="text-6xl">🧃</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Fresh Juices</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">100% natural fruit juices with no preservatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">Organic</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300">
                      <ArrowRight className="h-4 w-4 ml-1" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover-lift group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700" style={{ animationDelay: '0.1s' }}>
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                <span className="text-6xl">🍯</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Artisan Jams</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Handcrafted jams from locally sourced fruits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">Local</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline" className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300">
                      <ArrowRight className="h-4 w-4 ml-1" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover-lift group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700" style={{ animationDelay: '0.2s' }}>
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                <span className="text-6xl">🥣</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Premium Compotes</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Slow-cooked compotes with traditional recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Traditional</Badge>
                  <Link href="/products">
                    <Button size="sm" variant="outline" className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all duration-300">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-5xl font-bold mb-3">25%</div>
              <div className="text-blue-100 text-lg">Waste Reduction</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold mb-3">150+</div>
              <div className="text-blue-100 text-lg">Partner Farmers</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold mb-3">98%</div>
              <div className="text-blue-100 text-lg">On-time Delivery</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-bold mb-3">100%</div>
              <div className="text-blue-100 text-lg">Traceability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Our Partners Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Trusted by farmers, retailers, and consumers worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  "Bifa has revolutionized how we manage our supply chain. The traceability features give our
                  customers complete confidence in our products."
                </p>
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Maria Rodriguez</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Green Valley Farm</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-8">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  "The IoT monitoring has reduced our spoilage by 30%. We can track temperature and location in
                  real-time, ensuring product quality."
                </p>
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">John Smith</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">FreshLogistics</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-white dark:bg-gray-700" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-8">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  "As a consumer, I love being able to scan the QR code and see exactly where my food comes from. It's
                  transparency at its best."
                </p>
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Sarah Johnson</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Customer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="container-custom text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Transform Your Supply Chain?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Join hundreds of agri-food companies already using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 btn-animate">
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Products
                </Button>
            </Link>
            <Link href="/contact">
                <Button size="lg" variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
                Contact Us
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
