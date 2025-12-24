"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Search, Leaf, Truck, Factory, Package, CheckCircle, MapPin, Calendar, Thermometer } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TracePage() {
  const [batchId, setBatchId] = useState("")
  const [traceResult, setTraceResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Dummy traceability data
  const traceabilityData = {
    "OJ-2024-001": {
      productName: "Premium Orange Juice",
      batchId: "OJ-2024-001",
      status: "Delivered",
      stages: [
        {
          stage: "Farm Origin",
          location: "Green Valley Farm, California",
          farmer: "Maria Rodriguez",
          date: "2024-01-15",
          temperature: "22°C",
          status: "completed",
          details: "Organic oranges harvested at optimal ripeness",
          icon: Leaf,
          color: "text-green-600",
        },
        {
          stage: "Transportation",
          location: "En route to Factory",
          driver: "John Smith",
          date: "2024-01-16",
          temperature: "4°C",
          status: "completed",
          details: "Cold chain maintained throughout transport",
          icon: Truck,
          color: "text-blue-600",
        },
        {
          stage: "Processing",
          location: "BRIJUICE Factory, Los Angeles",
          operator: "Processing Team A",
          date: "2024-01-17",
          temperature: "18°C",
          status: "completed",
          details: "Juice extracted and pasteurized according to standards",
          icon: Factory,
          color: "text-orange-600",
        },
        {
          stage: "Packaging",
          location: "Packaging Line 2",
          operator: "Packaging Team B",
          date: "2024-01-18",
          temperature: "18°C",
          status: "completed",
          details: "Sealed in sterile containers with batch labeling",
          icon: Package,
          color: "text-purple-600",
        },
        {
          stage: "Distribution",
          location: "SuperMart Downtown",
          distributor: "FreshLogistics",
          date: "2024-01-19",
          temperature: "4°C",
          status: "completed",
          details: "Delivered to retail location, cold chain maintained",
          icon: Truck,
          color: "text-indigo-600",
        },
      ],
      certifications: ["Organic", "Non-GMO", "FDA Approved"],
      nutritionalInfo: {
        calories: "110 per 250ml",
        sugar: "22g",
        vitaminC: "120% DV",
        preservatives: "None",
      },
      blockchain: {
        txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        blockNumber: "18,234,567",
        timestamp: "2024-01-19 14:32:15 UTC",
        network: "Algorand Testnet",
      },
    },
  }

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const result = traceabilityData[batchId as keyof typeof traceabilityData] || null
      setTraceResult(result)
      setIsSearching(false)
    }, 1000)
  }

  const handleDemoSearch = () => {
    setBatchId("OJ-2024-001")
    setTimeout(() => {
      setTraceResult(traceabilityData["OJ-2024-001"])
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Traceability</h1>
          <p className="text-lg text-gray-600">
            Enter your product batch ID or scan QR code to trace the complete journey
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enter Product Batch ID</CardTitle>
            <CardDescription>Enter the batch ID from your product label or scan the QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter batch ID (e.g., OJ-2024-001)"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!batchId || isSearching}>
                {isSearching ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Trace
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Or try our demo:</p>
              <Button variant="outline" onClick={handleDemoSearch}>
                <QrCode className="h-4 w-4 mr-2" />
                Demo: Orange Juice (OJ-2024-001)
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">QR Code Scanner</p>
              <p className="text-sm text-gray-500">Point your camera at the QR code on the product</p>
              <Button variant="outline" className="mt-2 bg-transparent" size="sm">
                Open Camera
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {batchId && !traceResult && !isSearching && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No product found with batch ID: {batchId}</p>
              <p className="text-sm text-gray-500 mt-2">Please check the batch ID and try again</p>
            </CardContent>
          </Card>
        )}

        {/* Traceability Results */}
        {traceResult && (
          <div className="space-y-6">
            {/* Product Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{traceResult.productName}</CardTitle>
                    <CardDescription>Batch ID: {traceResult.batchId}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {traceResult.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {traceResult.certifications.map((cert: string) => (
                        <Badge key={cert} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Nutritional Information</h3>
                    <div className="text-sm space-y-1">
                      <p>Calories: {traceResult.nutritionalInfo.calories}</p>
                      <p>Sugar: {traceResult.nutritionalInfo.sugar}</p>
                      <p>Vitamin C: {traceResult.nutritionalInfo.vitaminC}</p>
                      <p>Preservatives: {traceResult.nutritionalInfo.preservatives}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Product Journey</CardTitle>
                <CardDescription>Complete traceability from farm to table</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {traceResult.stages.map((stage: any, index: number) => {
                    const Icon = stage.icon
                    return (
                      <div key={index} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center justify-center w-10 h-10 bg-white border-2 border-green-200 rounded-full ${stage.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < traceResult.stages.length - 1 && <div className="w-px h-16 bg-green-200 mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-8">
                          <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{stage.stage}</h3>
                                <Badge variant="outline" className="bg-green-50">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{stage.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>{stage.date}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Thermometer className="h-4 w-4 text-gray-500" />
                                    <span>{stage.temperature}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Operator:</span>
                                    <span>{stage.farmer || stage.driver || stage.operator || stage.distributor}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-3">{stage.details}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification</CardTitle>
                <CardDescription>Immutable record on blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Transaction Hash:</p>
                      <p className="font-mono text-xs break-all">{traceResult.blockchain.txHash}</p>
                    </div>
                    <div>
                      <p className="font-medium">Block Number:</p>
                      <p className="font-mono">{traceResult.blockchain.blockNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Timestamp:</p>
                      <p>{traceResult.blockchain.timestamp}</p>
                    </div>
                    <div>
                      <p className="font-medium">Network:</p>
                      <p>{traceResult.blockchain.network}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm">
                      View on Blockchain Explorer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
