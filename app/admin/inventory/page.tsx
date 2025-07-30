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
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Plus,
  Edit,
  Search,
  AlertTriangle,
  CheckCircle,
  Truck,
  Factory,
  Warehouse,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Dummy data
const inventoryItems = [
  {
    id: "INV-001",
    productId: "OJ-001",
    productName: "Premium Orange Juice",
    type: "Finished Product",
    batchOrigin: "Green Valley Farm",
    quantity: 150,
    unit: "bottles",
    minStock: 50,
    maxStock: 200,
    status: "stored",
    location: "Warehouse A",
    expiryDate: "2024-07-15",
    lastUpdated: "2024-01-20",
    value: "$747.50",
  },
  {
    id: "INV-002",
    productId: "SJ-001",
    productName: "Strawberry Jam",
    type: "Finished Product",
    batchOrigin: "Berry Fresh Co",
    quantity: 25,
    unit: "jars",
    minStock: 30,
    maxStock: 100,
    status: "low-stock",
    location: "Warehouse B",
    expiryDate: "2025-01-10",
    lastUpdated: "2024-01-19",
    value: "$162.50",
  },
  {
    id: "INV-003",
    productId: "RAW-001",
    productName: "Fresh Oranges",
    type: "Raw Material",
    batchOrigin: "Green Valley Farm",
    quantity: 500,
    unit: "kg",
    minStock: 200,
    maxStock: 800,
    status: "in-processing",
    location: "Processing Unit",
    expiryDate: "2024-02-15",
    lastUpdated: "2024-01-20",
    value: "$750.00",
  },
  {
    id: "INV-004",
    productId: "AC-001",
    productName: "Apple Compote",
    type: "Finished Product",
    batchOrigin: "Mountain Orchards",
    quantity: 120,
    unit: "jars",
    minStock: 40,
    maxStock: 150,
    status: "stored",
    location: "Warehouse A",
    expiryDate: "2024-12-08",
    lastUpdated: "2024-01-18",
    value: "$690.00",
  },
  {
    id: "INV-005",
    productId: "RAW-002",
    productName: "Fresh Strawberries",
    type: "Raw Material",
    batchOrigin: "Berry Fresh Co",
    quantity: 0,
    unit: "kg",
    minStock: 100,
    maxStock: 300,
    status: "out-of-stock",
    location: "Cold Storage",
    expiryDate: "N/A",
    lastUpdated: "2024-01-17",
    value: "$0.00",
  },
  {
    id: "INV-006",
    productId: "TR-001",
    productName: "Oranges Batch #001",
    type: "Raw Material",
    batchOrigin: "Green Valley Farm",
    quantity: 300,
    unit: "kg",
    minStock: 0,
    maxStock: 500,
    status: "in-transit",
    location: "Truck TR-001",
    expiryDate: "2024-02-20",
    lastUpdated: "2024-01-20",
    value: "$450.00",
  },
]

const productBatches = [
  {
    id: "BATCH-001",
    productName: "Premium Orange Juice",
    batchNumber: "OJ-2024-001",
    origin: "Green Valley Farm",
    harvestDate: "2024-01-15",
    processingDate: "2024-01-17",
    quantity: 500,
    unit: "bottles",
    status: "stored",
    quality: "A+",
    location: "Warehouse A",
    expiryDate: "2024-07-15",
    traceabilityId: "TRC-001",
  },
  {
    id: "BATCH-002",
    productName: "Strawberry Jam",
    batchNumber: "SJ-2024-002",
    origin: "Berry Fresh Co",
    harvestDate: "2024-01-10",
    processingDate: "2024-01-12",
    quantity: 200,
    unit: "jars",
    status: "in-processing",
    quality: "A",
    location: "Processing Unit",
    expiryDate: "2025-01-10",
    traceabilityId: "TRC-002",
  },
  {
    id: "BATCH-003",
    productName: "Apple Compote",
    batchNumber: "AC-2024-003",
    origin: "Mountain Orchards",
    harvestDate: "2024-01-08",
    processingDate: "2024-01-10",
    quantity: 300,
    unit: "jars",
    status: "stored",
    quality: "A+",
    location: "Warehouse B",
    expiryDate: "2024-12-08",
    traceabilityId: "TRC-003",
  },
  {
    id: "BATCH-004",
    productName: "Mixed Berry Juice",
    batchNumber: "MBJ-2024-004",
    origin: "Berry Fresh Co",
    harvestDate: "2024-01-12",
    processingDate: "2024-01-14",
    quantity: 400,
    unit: "bottles",
    status: "in-transit",
    quality: "A",
    location: "Truck TR-002",
    expiryDate: "2024-07-12",
    traceabilityId: "TRC-004",
  },
]

const stockMovements = [
  {
    id: "MOV-001",
    productName: "Premium Orange Juice",
    type: "inbound",
    quantity: 100,
    unit: "bottles",
    from: "Processing Unit",
    to: "Warehouse A",
    date: "2024-01-20",
    reason: "Production completion",
    operator: "John Smith",
  },
  {
    id: "MOV-002",
    productName: "Strawberry Jam",
    type: "outbound",
    quantity: 50,
    unit: "jars",
    from: "Warehouse B",
    to: "Customer Order",
    date: "2024-01-19",
    reason: "Order fulfillment",
    operator: "Jane Doe",
  },
  {
    id: "MOV-003",
    productName: "Fresh Oranges",
    type: "inbound",
    quantity: 500,
    unit: "kg",
    from: "Green Valley Farm",
    to: "Processing Unit",
    date: "2024-01-18",
    reason: "Raw material delivery",
    operator: "Mike Johnson",
  },
]

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = useState("inventory")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchOrigin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stored":
        return <Badge className="bg-green-100 text-green-800">Stored</Badge>
      case "in-processing":
        return <Badge className="bg-blue-100 text-blue-800">In Processing</Badge>
      case "in-transit":
        return <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "A+":
        return <Badge className="bg-green-100 text-green-800">A+</Badge>
      case "A":
        return <Badge className="bg-blue-100 text-blue-800">A</Badge>
      case "B":
        return <Badge className="bg-yellow-100 text-yellow-800">B</Badge>
      default:
        return <Badge variant="outline">{quality}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stored":
        return <Warehouse className="h-4 w-4 text-green-600" />
      case "in-processing":
        return <Factory className="h-4 w-4 text-blue-600" />
      case "in-transit":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "low-stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStockLevel = (current: number, min: number, max: number) => {
    if (current === 0) return 0
    return Math.min(100, (current / max) * 100)
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return "out-of-stock"
    if (current <= min) return "low-stock"
    return "good"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory & Product Batches</h1>
            <p className="text-muted-foreground">Manage your inventory, track batches, and monitor stock levels</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                  <DialogDescription>Add a new item to your inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="Enter product name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw-material">Raw Material</SelectItem>
                          <SelectItem value="finished-product">Finished Product</SelectItem>
                          <SelectItem value="packaging">Packaging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="origin">Batch Origin</Label>
                      <Input id="origin" placeholder="e.g., Green Valley Farm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="bottles">bottles</SelectItem>
                          <SelectItem value="jars">jars</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                          <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                          <SelectItem value="cold-storage">Cold Storage</SelectItem>
                          <SelectItem value="processing">Processing Unit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minStock">Min Stock</Label>
                      <Input id="minStock" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="maxStock">Max Stock</Label>
                      <Input id="maxStock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Item</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{inventoryItems.filter((i) => i.status === "stored").length}</span> in
                stock
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryItems.filter((i) => i.status === "low-stock" || i.status === "out-of-stock").length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{inventoryItems.filter((i) => i.status === "out-of-stock").length}</span>{" "}
                out of stock
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Processing</CardTitle>
              <Factory className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryItems.filter((i) => i.status === "in-processing").length}
              </div>
              <p className="text-xs text-muted-foreground">Active batches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {inventoryItems
                  .reduce((sum, item) => sum + Number.parseFloat(item.value.replace("$", "").replace(",", "")), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory Overview</TabsTrigger>
            <TabsTrigger value="batches">Product Batches</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="stored">Stored</SelectItem>
                        <SelectItem value="in-processing">In Processing</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Raw Material">Raw Material</SelectItem>
                        <SelectItem value="Finished Product">Finished Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">{item.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.batchOrigin}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                {item.quantity} {item.unit}
                              </span>
                              <span
                                className={`${
                                  getStockStatus(item.quantity, item.minStock) === "low-stock"
                                    ? "text-yellow-600"
                                    : getStockStatus(item.quantity, item.minStock) === "out-of-stock"
                                      ? "text-red-600"
                                      : "text-green-600"
                                }`}
                              >
                                {Math.round(getStockLevel(item.quantity, item.minStock, item.maxStock))}%
                              </span>
                            </div>
                            <Progress
                              value={getStockLevel(item.quantity, item.minStock, item.maxStock)}
                              className="h-2"
                            />
                            <div className="text-xs text-muted-foreground">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.value}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Package className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Batches</CardTitle>
                <CardDescription>Track product batches from harvest to storage</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                        <TableCell>{batch.productName}</TableCell>
                        <TableCell>{batch.origin}</TableCell>
                        <TableCell>
                          {batch.quantity} {batch.unit}
                        </TableCell>
                        <TableCell>{getQualityBadge(batch.quality)}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>{batch.location}</TableCell>
                        <TableCell>{batch.expiryDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              View Trace
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movements</CardTitle>
                <CardDescription>Track all inventory movements and transactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movement ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Operator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.id}</TableCell>
                        <TableCell>{movement.productName}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              movement.type === "inbound" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {movement.type === "inbound" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {movement.quantity} {movement.unit}
                        </TableCell>
                        <TableCell>{movement.from}</TableCell>
                        <TableCell>{movement.to}</TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.operator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Health</CardTitle>
                  <CardDescription>Stock level distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Good Stock</span>
                      <span className="text-sm font-medium text-green-600">
                        {inventoryItems.filter((i) => getStockStatus(i.quantity, i.minStock) === "good").length} items
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Stock</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {inventoryItems.filter((i) => i.status === "low-stock").length} items
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Out of Stock</span>
                      <span className="text-sm font-medium text-red-600">
                        {inventoryItems.filter((i) => i.status === "out-of-stock").length} items
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Transit</span>
                      <span className="text-sm font-medium text-purple-600">
                        {inventoryItems.filter((i) => i.status === "in-transit").length} items
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value</CardTitle>
                  <CardDescription>Value distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Raw Materials</span>
                      <span className="text-sm font-medium">
                        $
                        {inventoryItems
                          .filter((i) => i.type === "Raw Material")
                          .reduce(
                            (sum, item) => sum + Number.parseFloat(item.value.replace("$", "").replace(",", "")),
                            0,
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Finished Products</span>
                      <span className="text-sm font-medium">
                        $
                        {inventoryItems
                          .filter((i) => i.type === "Finished Product")
                          .reduce(
                            (sum, item) => sum + Number.parseFloat(item.value.replace("$", "").replace(",", "")),
                            0,
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Value</span>
                        <span className="text-lg font-bold">
                          $
                          {inventoryItems
                            .reduce(
                              (sum, item) => sum + Number.parseFloat(item.value.replace("$", "").replace(",", "")),
                              0,
                            )
                            .toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest inventory updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Low stock alert: Strawberry Jam</p>
                      <p className="text-xs text-muted-foreground">Current stock: 25 jars (Min: 30)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Stock replenished: Premium Orange Juice</p>
                      <p className="text-xs text-muted-foreground">Added 100 bottles to Warehouse A</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Out of stock: Fresh Strawberries</p>
                      <p className="text-xs text-muted-foreground">Immediate restocking required</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">In transit: Oranges Batch #001</p>
                      <p className="text-xs text-muted-foreground">300 kg arriving from Green Valley Farm</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
