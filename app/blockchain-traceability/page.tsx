"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Shield, LinkIcon, CheckCircle, Leaf, Truck, Package, QrCode, Search, Eye, Lock, Globe } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useState } from "react"

const blockchainData = [
  {
    blockId: "0x1a2b3c4d",
    timestamp: "2024-01-15 08:30:00",
    stage: "Farm Origin",
    actor: "Green Valley Farm",
    action: "Harvest",
    details: {
      product: "Premium Oranges",
      quantity: "500kg",
      location: "California, USA",
      certifications: ["Organic", "Non-GMO"],
      temperature: "22°C",
      humidity: "65%",
    },
    hash: "0x8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a29",
    verified: true,
  },
  {
    blockId: "0x2b3c4d5e",
    timestamp: "2024-01-15 14:45:00",
    stage: "Transportation",
    actor: "FreshLogistics",
    action: "Pickup & Transport",
    details: {
      driver: "John Smith",
      vehicle: "TR-001",
      route: "Farm → Processing Center",
      temperature: "4.2°C",
      duration: "3.5 hours",
    },
    hash: "0x9g8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b",
    verified: true,
  },
  {
    blockId: "0x3c4d5e6f",
    timestamp: "2024-01-16 09:15:00",
    stage: "Processing",
    actor: "AgriChain Processing",
    action: "Quality Check & Processing",
    details: {
      inspector: "Sarah Johnson",
      qualityScore: "A+",
      processType: "Cold Press",
      batchId: "OJ-2024-001",
      yield: "450L",
    },
    hash: "0xah9g8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c",
    verified: true,
  },
  {
    blockId: "0x4d5e6f7g",
    timestamp: "2024-01-17 11:30:00",
    stage: "Packaging",
    actor: "AgriChain Processing",
    action: "Package & Label",
    details: {
      packagingType: "Glass Bottles",
      quantity: "180 units",
      expiryDate: "2024-07-15",
      qrCode: "Generated",
      labels: "Applied",
    },
    hash: "0xbiah9g8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d",
    verified: true,
  },
  {
    blockId: "0x5e6f7g8h",
    timestamp: "2024-01-17 16:20:00",
    stage: "Distribution",
    actor: "ColdChain Express",
    action: "Final Delivery",
    details: {
      destination: "Fresh Market Store",
      deliveryTime: "2.5 hours",
      temperature: "3.8°C",
      condition: "Excellent",
      signature: "Received",
    },
    hash: "0xcbiah9g8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6",
    verified: true,
  },
]

export default function BlockchainTraceabilityPage() {
  const [searchBatch, setSearchBatch] = useState("")
  const [selectedBlock, setSelectedBlock] = useState<any>(null)

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Farm Origin":
        return <Leaf className="h-5 w-5 text-green-600" />
      case "Transportation":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "Processing":
        return <Package className="h-5 w-5 text-purple-600" />
      case "Packaging":
        return <Package className="h-5 w-5 text-orange-600" />
      case "Distribution":
        return <Globe className="h-5 w-5 text-red-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full">
              <Shield className="h-16 w-16 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blockchain Traceability</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete transparency from farm to table with immutable blockchain records. Every step of your product's
            journey is permanently recorded and verifiable.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Lock className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <CardTitle className="text-lg">Immutable Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Once recorded, data cannot be altered or deleted, ensuring complete integrity.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <CardTitle className="text-lg">Full Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Every stakeholder can view and verify the complete product journey.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <CardTitle className="text-lg">Instant Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Scan QR codes for immediate access to complete traceability data.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-10 w-10 text-orange-500 mx-auto mb-3" />
              <CardTitle className="text-lg">Global Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Compliant with international food safety and traceability regulations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-6 w-6 mr-2 text-purple-600" />
              Product Traceability Demo
            </CardTitle>
            <CardDescription>
              Search for a batch ID or scan a QR code to see the complete product journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Enter batch ID (e.g., OJ-2024-001)"
                  value={searchBatch}
                  onChange={(e) => setSearchBatch(e.target.value)}
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Trace Product
              </Button>
            </div>

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain Blocks</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4">
                <div className="relative">
                  {blockchainData.map((block, index) => (
                    <div key={block.blockId} className="flex items-start space-x-4 pb-8">
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-white border-2 border-gray-200 rounded-full">
                          {getStageIcon(block.stage)}
                        </div>
                        {index < blockchainData.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>}
                      </div>

                      <Card className="flex-1">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{block.stage}</CardTitle>
                              <CardDescription>
                                {block.actor} • {block.action}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">{block.timestamp}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {Object.entries(block.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                <p className="font-medium">{Array.isArray(value) ? value.join(", ") : value}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <div className="text-xs text-gray-500">
                                Block Hash: <span className="font-mono">{block.hash}</span>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => setSelectedBlock(block)}>
                                View Block Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4">
                <div className="grid gap-4">
                  {blockchainData.map((block, index) => (
                    <Card key={block.blockId} className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <LinkIcon className="h-5 w-5 mr-2 text-purple-600" />
                              Block #{index + 1}
                            </CardTitle>
                            <CardDescription>ID: {block.blockId}</CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Timestamp</p>
                            <p className="font-medium">{block.timestamp}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Stage</p>
                            <p className="font-medium">{block.stage}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Actor</p>
                            <p className="font-medium">{block.actor}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Block Hash</p>
                          <p className="font-mono text-sm break-all">{block.hash}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Benefits and Statistics */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Enhanced Food Safety</h4>
                  <p className="text-sm text-gray-600">Rapid identification and containment of contamination sources</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Consumer Trust</h4>
                  <p className="text-sm text-gray-600">Complete transparency builds confidence in product quality</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Regulatory Compliance</h4>
                  <p className="text-sm text-gray-600">Automated compliance with food safety regulations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Fraud Prevention</h4>
                  <p className="text-sm text-gray-600">Immutable records prevent counterfeiting and fraud</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <p className="text-sm text-gray-600">Product Traceability</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2.5 sec</div>
                <p className="text-sm text-gray-600">Average Trace Time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <p className="text-sm text-gray-600">Faster Recall Response</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50+</div>
                <p className="text-sm text-gray-600">Supply Chain Partners</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Blockchain Traceability Works</CardTitle>
            <CardDescription>Understanding the technology behind transparent supply chains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Data Collection</h3>
                <p className="text-sm text-gray-600">
                  IoT sensors and manual inputs collect data at each stage of the supply chain
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Blockchain Recording</h3>
                <p className="text-sm text-gray-600">
                  Data is encrypted and permanently recorded on the blockchain with timestamps
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Instant Access</h3>
                <p className="text-sm text-gray-600">
                  Consumers and stakeholders can instantly access complete product history
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">Experience Complete Transparency</h3>
            <p className="text-gray-600 mb-6">
              Join the future of food traceability with blockchain technology that builds trust and ensures quality.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/trace">
                <Button size="lg">
                  <QrCode className="h-5 w-5 mr-2" />
                  Try Product Tracing
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Learn More
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
