"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Star, Leaf, Package, Calendar, CheckCircle, AlertTriangle, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy data
const suppliers = [
  {
    id: 1,
    name: "Green Valley Farm",
    type: "Farmer",
    contact: "Maria Rodriguez",
    phone: "+1 555-0101",
    email: "maria@greenvalley.com",
    location: "California, USA",
    rating: 4.8,
    products: ["Oranges", "Lemons"],
    status: "active",
    lastDelivery: "2024-01-20",
    image: "farm1",
  },
  {
    id: 2,
    name: "Mountain Orchards",
    type: "Farmer",
    contact: "John Smith",
    phone: "+1 555-0102",
    email: "john@mountainorchards.com",
    location: "Washington, USA",
    rating: 4.6,
    products: ["Apples", "Pears"],
    status: "active",
    lastDelivery: "2024-01-19",
    image: "farm2",
  },
  {
    id: 3,
    name: "Berry Fresh Co",
    type: "Farmer",
    contact: "Sarah Johnson",
    phone: "+1 555-0103",
    email: "sarah@berryfresh.com",
    location: "Oregon, USA",
    rating: 4.9,
    products: ["Strawberries", "Blueberries"],
    status: "active",
    lastDelivery: "2024-01-18",
    image: "farm3",
  },
  {
    id: 4,
    name: "FreshLogistics",
    type: "Transporter",
    contact: "Mike Wilson",
    phone: "+1 555-0201",
    email: "mike@freshlogistics.com",
    location: "California, USA",
    rating: 4.7,
    services: ["Cold Chain Transport", "Express Delivery"],
    status: "active",
    lastService: "2024-01-20",
    image: "transport1",
  },
  {
    id: 5,
    name: "ColdChain Express",
    type: "Transporter",
    contact: "Lisa Brown",
    phone: "+1 555-0202",
    email: "lisa@coldchain.com",
    location: "Nevada, USA",
    rating: 4.5,
    services: ["Refrigerated Transport", "Long Distance"],
    status: "active",
    lastService: "2024-01-19",
    image: "transport2",
  },
  {
    id: 6,
    name: "Packaging Solutions Inc",
    type: "Packaging",
    contact: "David Lee",
    phone: "+1 555-0301",
    email: "david@packagingsolutions.com",
    location: "Texas, USA",
    rating: 4.4,
    products: ["Bottles", "Jars", "Labels"],
    status: "active",
    lastDelivery: "2024-01-17",
    image: "packaging1",
  },
]

const orders = [
  {
    id: "ORD-001",
    supplier: "Green Valley Farm",
    items: [{ name: "Oranges", quantity: "500 kg", price: "DZ 750" }],
    status: "delivered",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
  },
  {
    id: "ORD-002",
    supplier: "Mountain Orchards",
    items: [{ name: "Apples", quantity: "300 kg", price: "DZ 450" }],
    status: "in-transit",
    orderDate: "2024-01-18",
    deliveryDate: "2024-01-22",
  },
  {
    id: "ORD-003",
    supplier: "Berry Fresh Co",
    items: [
      { name: "Strawberries", quantity: "100 kg", price: "DZ 400" },
      { name: "Blueberries", quantity: "50 kg", price: "DZ 300" },
    ],
    status: "processing",
    orderDate: "2024-01-19",
    deliveryDate: "2024-01-24",
  },
  {
    id: "ORD-004",
    supplier: "Packaging Solutions Inc",
    items: [
      { name: "Glass Bottles", quantity: "1000 units", price: "DZ 600" },
      { name: "Labels", quantity: "1000 units", price: "DZ 200" },
    ],
    status: "pending",
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-27",
  },
]

export default function SuppliersPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (selectedTab !== "all" && supplier.type.toLowerCase() !== selectedTab) {
      return false
    }
    if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        )
      case "in-transit":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            In Transit
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Processing
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSupplierIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "farmer":
        return <Leaf className="h-5 w-5 text-green-600" />
      case "transporter":
        return <Package className="h-5 w-5 text-blue-600" />
      case "packaging":
        return <Package className="h-5 w-5 text-purple-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-gray-600">Manage your suppliers, farmers, and service providers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>Add a new supplier to your network</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supplierName">Supplier Name</Label>
                    <Input id="supplierName" placeholder="Enter supplier name" />
                  </div>
                  <div>
                    <Label htmlFor="supplierType">Supplier Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="transporter">Transporter</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input id="contactName" placeholder="Contact person" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Phone number" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email address" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, Country" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Supplier</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Supplier Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Suppliers</TabsTrigger>
            <TabsTrigger value="farmer">Farmers</TabsTrigger>
            <TabsTrigger value="transporter">Transporters</TabsTrigger>
            <TabsTrigger value="packaging">Packaging</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-center"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=128&width=384&query=${supplier.type} supplier)`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className="mt-1">{getSupplierIcon(supplier.type)}</div>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.type}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(supplier.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{supplier.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {supplier.type === "Transporter"
                          ? `Last Service: ${supplier.lastService}`
                          : `Last Delivery: ${supplier.lastDelivery}`}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {supplier.products
                        ? supplier.products.map((product) => (
                            <Badge key={product} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))
                        : supplier.services?.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="farmer" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=128&width=384&query=farm with ${supplier.products?.[0] || "fruits"})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className="mt-1">{getSupplierIcon(supplier.type)}</div>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.contact}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(supplier.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{supplier.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">Last Delivery: {supplier.lastDelivery}</div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {supplier.products?.map((product) => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transporter" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=128&width=384&query=refrigerated transport truck)`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className="mt-1">{getSupplierIcon(supplier.type)}</div>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.contact}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(supplier.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{supplier.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">Last Service: {supplier.lastService}</div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {supplier.services?.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Schedule Pickup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packaging" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center"
                    style={{
                      backgroundImage: `url(/placeholder.svg?height=128&width=384&query=packaging materials bottles jars)`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className="mt-1">{getSupplierIcon(supplier.type)}</div>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.contact}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(supplier.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{supplier.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">Last Delivery: {supplier.lastDelivery}</div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {supplier.products?.map((product) => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track and manage your supplier orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{order.id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-600">Supplier: {order.supplier}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Ordered: {order.orderDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Delivery: {order.deliveryDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span>
                                {item.name} ({item.quantity})
                              </span>
                            </div>
                            <span className="font-medium">{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {order.status === "delivered" ? "View Receipt" : "Track Order"}
                        </Button>
                        {order.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
