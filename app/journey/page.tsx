"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Search, ArrowRight } from "lucide-react"
import { ProductJourneyViewer } from "@/components/product-journey-viewer"
import Link from "next/link"

export default function JourneyPage() {
  const [batchId, setBatchId] = useState("")
  const [searchedBatchId, setSearchedBatchId] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setSearchedBatchId(batchId || "BATCH-001")
      setIsSearching(false)
    }, 1000)
  }

  const handleDemoSearch = () => {
    setBatchId("BATCH-001")
    setSearchedBatchId("BATCH-001")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">FreshChain</span>
            </Link>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Journey Tracker</h1>
          <p className="text-gray-600">
            Track the complete journey of your product from farm to table with blockchain verification
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Product Batch ID</CardTitle>
            <CardDescription>Enter the batch ID from your product label or scan the QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter batch ID (e.g., BATCH-001)"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
              </div>
              <Button onClick={handleSearch} disabled={!batchId || isSearching}>
                {isSearching ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Or try our demo:</p>
              <Button variant="outline" onClick={handleDemoSearch}>
                <QrCode className="h-4 w-4 mr-2" />
                Demo: Orange Juice (BATCH-001)
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Scan QR Code</p>
              <p className="text-sm text-gray-500">Point your camera at the QR code on the product</p>
              <Button variant="outline" className="mt-2 bg-transparent" size="sm">
                Open Camera
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journey Viewer */}
        {searchedBatchId && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold">Product Journey</h2>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{searchedBatchId}</span>
            </div>
            <ProductJourneyViewer batchId={searchedBatchId} />
          </div>
        )}
      </div>
    </div>
  )
}
