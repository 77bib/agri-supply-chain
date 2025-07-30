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
import { Package, Users, Truck, Plus, Edit, Trash2, MapPin, Phone, Mail, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy data
const rawMaterials = [
  {
    id: 1,
    name: "Oranges",
    quantity: 850,
    unit: "kg",
    minStock: 500,
    supplier: "Green Valley Farm",
    status: "good",
    lastUpdated: "2024-01-20",
  },
  {
    id: 2,
    name: "Apples",
    quantity: 650,
    unit: "kg",
    minStock: 400,
    supplier: "Mountain Orchards",
    status: "good",
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    name: "Strawberries",
    quantity: 200,
    unit: "kg",
    minStock: 300,
    supplier: "Berry Fresh Co",
    status: "low",
    lastUpdated: "2024-01-19",
  },
  {
    id: 4,
    name: "Peaches",
    quantity: 400,
    unit: "kg",
    minStock: 250,
    supplier: "Sunny Farms",
    status: "good",
    lastUpdated: "2024-01-20",
  },
  {
    id: 5,
    name: "Sugar",
    quantity: 150,
    unit: "kg",
    minStock: 200,
    supplier: "Sweet Supply Inc",
    status: "low",
    lastUpdated: "2024-01-18",
  },
]

const finishedProducts = [
  {
    id: 1,
    name: "Orange Juice Premium",
    quantity: 120,
    unit: "bottles",
    minStock: 50,
    status: "good",
    lastProduced: "2024-01-20",
  },
  {
    id: 2,
    name: "Apple Jam Organic",
    quantity: 80,
    unit: "jars",
    minStock: 40,
    status: "good",
    lastProduced: "2024-01-19",
  },
  {
    id: 3,
    name: "Strawberry Compote",
    quantity: 25,
    unit: "jars",
    minStock: 30,
    status: "low",
    lastProduced: "2024-01-18",
  },
  {
    id: 4,
    name: "Mixed Fruit Juice",
    quantity: 95,
    unit: "bottles",
    minStock: 60,
    status: "good",
    lastProduced: "2024-01-20",
  },
]

const suppliers = [
  {
    id: 1,
    name: "Green Valley Farm",
    contact: "Maria Rodriguez",
    phone: "+1 555-0101",
    email: "maria@greenvalley.com",
    location: "California, USA",
    rating: 4.8,
    products: ["Oranges", "Lemons"],
    status: "active",
    lastDelivery: "2024-01-20",
  },
  {
    id: 2,
    name: "Mountain Orchards",
    contact: "John Smith",
    phone: "+1 555-0102",
    email: "john@mountainorchards.com",
    location: "Washington, USA",
    rating: 4.6,
    products: ["Apples", "Pears"],
    status: "active",
    lastDelivery: "2024-01-19",
  },
  {
    id: 3,
    name: "Berry Fresh Co",
    contact: "Sarah Johnson",
    phone: "+1 555-0103",
    email: "sarah@berryfresh.com",
    location: "Oregon, USA",
    rating: 4.9,
    products: ["Strawberries", "Blueberries"],
    status: "active",
    lastDelivery: "2024-01-18",
  },
]

const transporters = [
  {
    id: 1,
    name: "FreshLogistics",
    contact: "Mike Wilson",
    phone: "+1 555-0201",
    email: "mike@freshlogistics.com",
    vehicles: 5,
    rating: 4.7,
    status: "active",
    currentDeliveries: 3,
  },
  {
    id: 2,
    name: "ColdChain Express",
    contact: "Lisa Brown",
    phone: "+1 555-0202",
    email: "lisa@coldchain.com",
    vehicles: 8,
    rating: 4.5,
    status: "active",
    currentDeliveries: 2,
  },
]

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = useState("materials")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Good Stock
          </Badge>
        )
      case "low":
        return <Badge variant="destructive">Low Stock</Badge>
      case "out":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStockPercentage = (current: number, min: number) => {
    return Math.max(0, Math.min(100, (current / (min * 2)) * 100))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage suppliers, stock levels, and logistics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Data</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>Add a new item to your inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input id="itemName" placeholder="Enter item name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="bottles">Bottles</SelectItem>
                          <SelectItem value="jars">Jars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rawMaterials.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">2</span> low stock items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finished Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{finishedProducts.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">1</span> low stock item
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-muted-foreground">All suppliers active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transporters</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transporters.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">5</span> active deliveries
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="products">Finished Products</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="transporters">Transporters</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Materials Inventory</CardTitle>
                <CardDescription>Current stock levels and supplier information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>
                              {material.quantity} {material.unit}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  material.status === "low" ? "bg-red-500" : "bg-green-500"
                                }`}
                                style={{ width: `${getStockPercentage(material.quantity, material.minStock)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(material.status)}</TableCell>
                        <TableCell>{material.supplier}</TableCell>
                        <TableCell>{material.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Finished Products</CardTitle>
                <CardDescription>Ready-to-sell product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Produced</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finishedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>
                              {product.quantity} {product.unit}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  product.status === "low" ? "bg-red-500" : "bg-green-500"
                                }`}
                                style={{ width: `${getStockPercentage(product.quantity, product.minStock)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{product.lastProduced}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid gap-6">
              {suppliers.map((supplier) => (
                <Card key={supplier.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <CardDescription>Contact: {supplier.contact}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{supplier.rating}</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{supplier.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{supplier.location}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Products</h4>
                        <div className="flex flex-wrap gap-1">
                          {supplier.products.map((product) => (
                            <Badge key={product} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Last Delivery:</span>
                          <span className="ml-2">{supplier.lastDelivery}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            View Orders
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transporters" className="space-y-4">
            <div className="grid gap-6">
              {transporters.map((transporter) => (
                <Card key={transporter.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{transporter.name}</CardTitle>
                        <CardDescription>Contact: {transporter.contact}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{transporter.rating}</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{transporter.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{transporter.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Fleet Size:</span>
                          <span className="ml-2 font-medium">{transporter.vehicles} vehicles</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Active Deliveries:</span>
                          <span className="ml-2 font-medium">{transporter.currentDeliveries}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Track Deliveries
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
