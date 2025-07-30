"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Printer } from "lucide-react"

interface QRCodeGeneratorProps {
  batchId: string
  productName: string
  size?: "small" | "medium" | "large"
}

export function QRCodeGenerator({ batchId, productName, size = "medium" }: QRCodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 1500)
  }

  const getQRSize = () => {
    switch (size) {
      case "small":
        return { width: 120, height: 120 }
      case "large":
        return { width: 200, height: 200 }
      case "medium":
      default:
        return { width: 160, height: 160 }
    }
  }

  const { width, height } = getQRSize()

  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        {isGenerated ? (
          <>
            <div
              className="mb-4 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
              style={{ width: width + 16, height: height + 16 }}
            >
              <div
                style={{
                  backgroundImage: `url(/placeholder.svg?height=${height}&width=${width}&query=QR code for ${batchId})`,
                  backgroundSize: "cover",
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              QR Code for <strong>{batchId}</strong>
              <br />
              <span className="text-xs">{productName}</span>
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </>
        ) : (
          <>
            <QrCode className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Generate QR Code</p>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
