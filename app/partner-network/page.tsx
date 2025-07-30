"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Handshake, MapPin, Star, Truck, Award, CheckCircle, TrendingUp, Globe, Phone, Mail } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

const partnerStats = {
  totalPartners: 150,
  activeFarmers: 85,
  logisticsPartners: 12,
  retailers: 53,
  satisfaction: 4.8,
  onTimeDelivery: 98.5,
}

const featuredFarmers = [
  {
    id: "1",
    name: "Green Valley Farm",
    owner: "Maria Rodriguez",
    location: "California, USA",
    specialties: ["Organic Oranges", "Lemons", "Grapefruits"],
    rating: 4.9,
    yearsPartner: 5,
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    monthlySupply: "2,500kg",
    image: "/placeholder.svg?height=200&width=200",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "maria@greenvalley.com",
    },
  },
  {
    id: "2",
    name: "Berry Fresh Co",
    owner: "Sarah Johnson",
    location: "Oregon, USA",
    specialties: ["Strawberries", "Blueberries", "Raspberries"],
    rating: 4.8,
    yearsPartner: 3,
    certifications: ["Organic", "Local Grown"],
    monthlySupply: "1,800kg",
    image: "/placeholder.svg?height=200&width=200",
    contact: {
      phone: "+1 (555) 234-5678",
      email: "sarah@berryfresh.com",
    },
  },
  {
    id: "3",
    name: "Mountain Orchards",
    owner: "John Smith",
    location: "Washington, USA",
    specialties: ["Heritage Apples", "Pears", "Stone Fruits"],
    rating: 4.7,
    yearsPartner: 7,
    certifications: ["Organic", "Heritage Variety", "Sustainable"],
    monthlySupply: "3,200kg",
    image: "/placeholder.svg?height=200&width=200",
    contact: {
      phone: "+1 (555) 345-6789",
      email: "john@mountainorchards.com",
    },
  },
]

const logisticsPartners = [
  {
    id: "1",
    name: "FreshLogistics",
    specialization: "Cold Chain Transport",
    fleet: 25,
    coverage: "West Coast",
    rating: 4.7,
    onTimeRate: 99.2,
    features: ["Temperature Monitoring", "GPS Tracking", "24/7 Support"],
  },
  {
    id: "2",
    name: "ColdChain Express",
    specialization: "Refrigerated Delivery",
    fleet: 18,
    coverage: "National",
    rating: 4.5,
    onTimeRate: 97.8,
    features: ["IoT Sensors", "Route Optimization", "Real-time Updates"],
  },
  {
    id: "3",
    name: "AgriTransport",
    specialization: "Farm-to-Market",
    fleet: 32,
    coverage: "Regional",
    rating: 4.8,
    onTimeRate: 98.5,
    features: ["Bulk Transport", "Flexible Scheduling", "Quality Assurance"],
  },
]

const partnerBenefits = [
  {
    title: "Technology Integration",
    description: "Access to our IoT monitoring and blockchain traceability systems",
    icon: Globe,
  },
  {
    title: "Market Access",
    description: "Direct connection to premium retailers and conscious consumers",
    icon: TrendingUp,
  },
  {
    title: "Fair Pricing",
    description: "Transparent pricing models with guaranteed minimum rates",
    icon: CheckCircle,
  },
  {
    title: "Quality Support",
    description: "Training and certification programs to maintain high standards",
    icon: Award,
  },
]

export default function PartnerNetworkPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-100 rounded-full">
              <Users className="h-16 w-16 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building sustainable relationships with farmers, logistics providers, and retailers to create a transparent
            and efficient supply chain ecosystem.
          </p>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{partnerStats.totalPartners}+</div>
              <p className="text-sm text-gray-600">Total Partners</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{partnerStats.activeFarmers}</div>
              <p className="text-sm text-gray-600">Active Farmers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{partnerStats.logisticsPartners}</div>
              <p className="text-sm text-gray-600">Logistics Partners</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{partnerStats.retailers}</div>
              <p className="text-sm text-gray-600">Retail Partners</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{partnerStats.satisfaction}</div>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{partnerStats.onTimeDelivery}%</div>
              <p className="text-sm text-gray-600">On-Time Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Partner Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Handshake className="h-6 w-6 mr-2 text-orange-600" />
              Our Partner Network
            </CardTitle>
            <CardDescription>Discover the dedicated partners who make our supply chain possible</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="farmers" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="farmers">Farmers & Growers</TabsTrigger>
                <TabsTrigger value="logistics">Logistics Partners</TabsTrigger>
                <TabsTrigger value="benefits">Partner Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="farmers" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredFarmers.map((farmer) => (
                    <Card key={farmer.id} className="overflow-hidden">
                      <div
                        className="h-48 bg-gradient-to-br from-green-100 to-green-200"
                        style={{
                          backgroundImage: `url(${farmer.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{farmer.name}</CardTitle>
                            <CardDescription>{farmer.owner}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{farmer.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{farmer.location}</span>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {farmer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-2">Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {farmer.certifications.map((cert) => (
                              <Badge key={cert} className="text-xs bg-green-100 text-green-800">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Partnership</p>
                            <p className="font-medium">{farmer.yearsPartner} years</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Supply</p>
                            <p className="font-medium">{farmer.monthlySupply}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{farmer.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{farmer.contact.email}</span>
                          </div>
                        </div>

                        <Button className="w-full bg-transparent" variant="outline">
                          View Full Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Farmer Success Stories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-l-green-500 pl-4">
                      <p className="text-gray-600 italic">
                        "Partnering with AgriChain has transformed our business. The guaranteed pricing and direct
                        market access have increased our revenue by 40% while maintaining our commitment to sustainable
                        farming practices."
                      </p>
                      <p className="text-sm font-medium mt-2">- Maria Rodriguez, Green Valley Farm</p>
                    </div>
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <p className="text-gray-600 italic">
                        "The technology integration and quality support have helped us achieve organic certification and
                        reach premium markets we never thought possible."
                      </p>
                      <p className="text-sm font-medium mt-2">- Sarah Johnson, Berry Fresh Co</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {logisticsPartners.map((partner) => (
                    <Card key={partner.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            <CardDescription>{partner.specialization}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{partner.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Fleet Size</p>
                            <p className="font-medium">{partner.fleet} vehicles</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Coverage</p>
                            <p className="font-medium">{partner.coverage}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">On-Time Delivery</span>
                            <span className="font-medium">{partner.onTimeRate}%</span>
                          </div>
                          <Progress value={partner.onTimeRate} className="h-2" />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-2">Key Features:</p>
                          <div className="space-y-1">
                            {partner.features.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-transparent" variant="outline">
                          <Truck className="h-4 w-4 mr-2" />
                          View Services
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Logistics Excellence</CardTitle>
                    <CardDescription>Our commitment to reliable and efficient transportation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">98.5%</div>
                        <p className="text-sm text-gray-600">On-Time Delivery</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                        <p className="text-sm text-gray-600">Temperature Monitoring</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">75+</div>
                        <p className="text-sm text-gray-600">Fleet Vehicles</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-orange-600 mb-2">99.8%</div>
                        <p className="text-sm text-gray-600">Product Integrity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {partnerBenefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Icon className="h-6 w-6 mr-3 text-orange-600" />
                            {benefit.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Partnership Program</CardTitle>
                    <CardDescription>Join our growing network of sustainable agriculture partners</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">1</span>
                        </div>
                        <h3 className="font-semibold mb-2">Application</h3>
                        <p className="text-sm text-gray-600">
                          Submit your partnership application with required documentation
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">2</span>
                        </div>
                        <h3 className="font-semibold mb-2">Evaluation</h3>
                        <p className="text-sm text-gray-600">
                          Our team evaluates your capabilities and quality standards
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-600">3</span>
                        </div>
                        <h3 className="font-semibold mb-2">Integration</h3>
                        <p className="text-sm text-gray-600">
                          Onboarding and integration into our supply chain network
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button size="lg">
                        <Handshake className="h-5 w-5 mr-2" />
                        Become a Partner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Network?</h3>
            <p className="text-gray-600 mb-6">
              Whether you're a farmer, logistics provider, or retailer, we'd love to explore partnership opportunities.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact">
                <Button size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Partner With Us
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  View Our Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
