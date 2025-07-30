"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { QrCode, Leaf, Truck, Factory, Package, CheckCircle, LinkIcon, Plus, FileText, Shield } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy blockchain data
const batches = [
  {
    id: "BATCH-001",
    product: "Orange Juice Premium",
    rawMaterial: "Oranges",
    supplier: "Green Valley Farm",
    harvestDate: "2024-01-15",
    processingDate: "2024-01-17",
    quantity: "500 bottles",
    status: "verified",
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    blockNumber: "18,234,567",
    timestamp: "2024-01-19 14:32:15 UTC",
  },
  {
    id: "BATCH-002",
    product: "Apple Jam Organic",
    rawMaterial: "Apples",
    supplier: "Mountain Orchards",
    harvestDate: "2024-01-14",
    processingDate: "2024-01-16",
    quantity: "300 jars",
    status: "verified",
    txHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
    blockNumber: "18,234,570",
    timestamp: "2024-01-19 15:45:22 UTC",
  },
  {
    id: "BATCH-003",
    product: "Strawberry Compote",
    rawMaterial: "Strawberries",
    supplier: "Berry Fresh Co",
    harvestDate: "2024-01-16",
    processingDate: "2024-01-18",
    quantity: "200 jars",
    status: "processing",
    txHash: "Pending",
    blockNumber: "Pending",
    timestamp: "Pending",
  },
  {
    id: "BATCH-004",
    product: "Mixed Fruit Juice",
    rawMaterial: "Apples, Oranges, Berries",
    supplier: "Multiple",
    harvestDate: "2024-01-15",
    processingDate: "2024-01-18",
    quantity: "400 bottles",
    status: "registered",
    txHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
    blockNumber: "18,234,580",
    timestamp: "2024-01-19 16:30:45 UTC",
  },
]

const journeySteps = [
  {
    stage: "Farm Origin",
    icon: Leaf,
    color: "text-green-600",
    details: [
      { label: "Farm", value: "Green Valley Farm" },
      { label: "Location", value: "California, USA" },
      { label: "Harvest Date", value: "2024-01-15" },
      { label: "Farmer", value: "Maria Rodriguez" },
      { label: "Certifications", value: "Organic, Fair Trade" },
    ],
  },
  {
    stage: "Transportation",
    icon: Truck,
    color: "text-blue-600",
    details: [
      { label: "Transporter", value: "FreshLogistics" },
      { label: "Vehicle", value: "Refrigerated Truck A" },
      { label: "Driver", value: "John Smith" },
      { label: "Temperature", value: "4.2°C" },
      { label: "Departure", value: "2024-01-16 08:30" },
      { label: "Arrival", value: "2024-01-16 10:15" },
    ],
  },
  {
    stage: "Processing",
    icon: Factory,
    color: "text-orange-600",
    details: [
      { label: "Facility", value: "FreshChain Factory" },
      { label: "Process", value: "Juice Extraction" },
      { label: "Date", value: "2024-01-17" },
      { label: "Batch Size", value: "500 bottles" },
      { label: "Quality Check", value: "Passed" },
    ],
  },
  {
    stage: "Packaging",
    icon: Package,
    color: "text-purple-600",
    details: [
      { label: "Packaging Type", value: "Glass Bottles" },
      { label: "Date", value: "2024-01-17" },
      { label: "Expiry Date", value: "2024-07-17" },
      { label: "Batch Code", value: "BATCH-001" },
      { label: "Quality Check", value: "Passed" },
    ],
  },
  {
    stage: "Distribution",
    icon: Truck,
    color: "text-indigo-600",
    details: [
      { label: "Distributor", value: "FreshLogistics" },
      { label: "Destination", value: "SuperMart Downtown" },
      { label: "Departure", value: "2024-01-18 09:30" },
      { label: "Arrival", value: "2024-01-18 11:45" },
      { label: "Temperature", value: "4.5°C" },
    ],
  },
]

export default function BlockchainPage() {
  const [selectedBatch, setSelectedBatch] = useState(batches[0])
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [qrGenerated, setQrGenerated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBatches = batches.filter(
    (batch) =>
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGenerateQR = () => {
    setIsGeneratingQR(true)
    // Simulate QR code generation
    setTimeout(() => {
      setIsGeneratingQR(false)
      setQrGenerated(true)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Verified
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Processing
          </Badge>
        )
      case "registered":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Registered
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Traceability</h1>
            <p className="text-gray-600">Register and track product batches on the blockchain</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Input
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Register New Batch</DialogTitle>
                  <DialogDescription>Register a new product batch on the blockchain</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="batchId">Batch ID</Label>
                      <Input id="batchId" placeholder="Enter batch ID" defaultValue="BATCH-005" />
                    </div>
                    <div>
                      <Label htmlFor="product">Product</Label>
                      <Select defaultValue="orange-juice">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orange-juice">Orange Juice Premium</SelectItem>
                          <SelectItem value="apple-jam">Apple Jam Organic</SelectItem>
                          <SelectItem value="strawberry-compote">Strawberry Compote</SelectItem>
                          <SelectItem value="mixed-juice">Mixed Fruit Juice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rawMaterial">Raw Material</Label>
                      <Input id="rawMaterial" placeholder="Enter raw material" defaultValue="Oranges" />
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select defaultValue="green-valley">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green-valley">Green Valley Farm</SelectItem>
                          <SelectItem value="mountain-orchards">Mountain Orchards</SelectItem>
                          <SelectItem value="berry-fresh">Berry Fresh Co</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Input id="harvestDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="processingDate">Processing Date</Label>
                      <Input id="processingDate" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" placeholder="Enter quantity" defaultValue="400 bottles" />
                  </div>
                  <div>
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea id="additionalInfo" placeholder="Enter any additional information" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsRegisterDialogOpen(false)}>Register on Blockchain</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="batches" className="space-y-4">
          <TabsList>
            <TabsTrigger value="batches">Registered Batches</TabsTrigger>
            <TabsTrigger value="journey">Product Journey</TabsTrigger>
            <TabsTrigger value="qr">QR Code Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="batches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Registered Batches</CardTitle>
                <CardDescription>Products registered on the blockchain for traceability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Processing Date</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.id}</TableCell>
                          <TableCell>{batch.product}</TableCell>
                          <TableCell>{batch.supplier}</TableCell>
                          <TableCell>{batch.processingDate}</TableCell>
                          <TableCell>{batch.quantity}</TableCell>
                          <TableCell>{getStatusBadge(batch.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedBatch(batch)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedBatch && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Batch Details: {selectedBatch.id}</CardTitle>
                      <CardDescription>{selectedBatch.product}</CardDescription>
                    </div>
                    {getStatusBadge(selectedBatch.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Product Information</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-sm">
                            <span className="text-gray-500">Raw Material:</span>
                            <p>{selectedBatch.rawMaterial}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Supplier:</span>
                            <p>{selectedBatch.supplier}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Harvest Date:</span>
                            <p>{selectedBatch.harvestDate}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Processing Date:</span>
                            <p>{selectedBatch.processingDate}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Quantity:</span>
                            <p>{selectedBatch.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Blockchain Information</h3>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <div className="text-sm">
                            <span className="text-gray-500">Transaction Hash:</span>
                            <p className="font-mono text-xs break-all">{selectedBatch.txHash}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Block Number:</span>
                            <p>{selectedBatch.blockNumber}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Timestamp:</span>
                            <p>{selectedBatch.timestamp}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Network:</span>
                            <p>Algorand Testnet</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      View on Explorer
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      Generate QR
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Export Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="journey" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Journey Visualization</CardTitle>
                <CardDescription>Complete traceability from farm to product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {journeySteps.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={index} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center justify-center w-10 h-10 bg-white border-2 border-green-200 rounded-full ${step.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < journeySteps.length - 1 && <div className="w-px h-16 bg-green-200 mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-8">
                          <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{step.stage}</h3>
                                <Badge variant="outline" className="bg-green-50">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                {step.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-start space-x-2">
                                    <span className="text-gray-500">{detail.label}:</span>
                                    <span>{detail.value}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>Generate QR codes for product traceability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="qrBatch">Select Batch</Label>
                      <Select defaultValue="BATCH-001">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.id} - {batch.product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="qrSize">QR Code Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="qrInfo">Additional Information</Label>
                      <Textarea
                        id="qrInfo"
                        placeholder="Enter any additional information to include in QR code"
                        className="h-24"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={handleGenerateQR} disabled={isGeneratingQR}>
                        {isGeneratingQR ? (
                          <>
                            <span className="animate-spin mr-2">◌</span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                    {qrGenerated ? (
                      <div className="text-center">
                        <div className="w-48 h-48 mx-auto mb-4 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                          <div
                            style={{
                              backgroundImage: `url(/placeholder.svg?height=160&width=160&query=QR code for BATCH-001)`,
                              backgroundSize: "cover",
                              width: "160px",
                              height: "160px",
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          QR Code for <strong>BATCH-001</strong>
                        </p>
                        <div className="flex space-x-2 justify-center">
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            Print
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">QR Code Preview</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Select a batch and click "Generate QR Code" to create a QR code
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification</CardTitle>
                <CardDescription>How blockchain ensures product traceability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <CardHeader>
                      <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <CardTitle className="text-lg">Immutable Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Once data is recorded on the blockchain, it cannot be altered or deleted, ensuring the integrity
                        of product information.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <LinkIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <CardTitle className="text-lg">Transparent Chain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Every step in the supply chain is recorded and visible to all authorized participants, creating
                        complete transparency.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <QrCode className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <CardTitle className="text-lg">Consumer Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        QR codes allow consumers to verify product authenticity and view the complete journey from farm
                        to table.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
