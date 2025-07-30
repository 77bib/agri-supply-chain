"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, MapPin, Thermometer, Clock, Package, CheckCircle, AlertTriangle, Navigation, Fuel } from "lucide-react"
import Link from "next/link"

// Dummy transporter data
const transporterProfile = {
  company: "FreshLogistics",
  contact: "Mike Wilson",
  phone: "+1 555-0201",
  email: "mike@freshlogistics.com",
  fleetSize: 5,
  rating: 4.7,
}

const activeDeliveries = [
  {
    id: "TR001",
    route: "Green Valley Farm → FreshChain Factory",
    product: "Oranges",
    quantity: "500 kg",
    driver: "John Smith",
    status: "in-transit",
    progress: 75,
    temperature: 4.2,
    estimatedArrival: "14:30",
    currentLocation: "Highway 101, Mile 45",
  },
  {
    id: "TR002",
    route: "Mountain Orchards → FreshChain Factory",
    product: "Apples",
    quantity: "300 kg",
    driver: "Jane Doe",
    status: "loading",
    progress: 10,
    temperature: 3.8,
    estimatedArrival: "16:00",
    currentLocation: "Mountain Orchards Loading Bay",
  },
  {
    id: "TR003",
    route: "FreshChain Factory → SuperMart Downtown",
    product: "Mixed Products",
    quantity: "200 units",
    driver: "Bob Johnson",
    status: "delivered",
    progress: 100,
    temperature: 4.5,
    estimatedArrival: "Completed",
    currentLocation: "SuperMart Downtown",
  },
]

const fleet = [
  {
    id: "V001",
    model: "Refrigerated Truck A",
    status: "active",
    driver: "John Smith",
    location: "Highway 101",
    fuel: 75,
  },
  {
    id: "V002",
    model: "Refrigerated Truck B",
    status: "active",
    driver: "Jane Doe",
    location: "Mountain Orchards",
    fuel: 60,
  },
  {
    id: "V003",
    model: "Refrigerated Truck C",
    status: "maintenance",
    driver: "N/A",
    location: "Service Center",
    fuel: 0,
  },
  { id: "V004", model: "Refrigerated Truck D", status: "available", driver: "N/A", location: "Depot", fuel: 90 },
  {
    id: "V005",
    model: "Refrigerated Truck E",
    status: "active",
    driver: "Bob Johnson",
    location: "SuperMart Downtown",
    fuel: 45,
  },
]

const deliveryHistory = [
  { id: 1, date: "2024-01-20", route: "Green Valley → Factory", product: "Oranges", status: "completed", rating: 5 },
  {
    id: 2,
    date: "2024-01-19",
    route: "Berry Fresh → Factory",
    product: "Strawberries",
    status: "completed",
    rating: 5,
  },
  { id: 3, date: "2024-01-18", route: "Factory → SuperMart", product: "Juices", status: "completed", rating: 4 },
  { id: 4, date: "2024-01-17", route: "Mountain → Factory", product: "Apples", status: "completed", rating: 5 },
]

export default function TransporterPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-transit":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            In Transit
          </Badge>
        )
      case "loading":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Loading
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        )
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "available":
        return <Badge variant="outline">Available</Badge>
      case "maintenance":
        return <Badge variant="destructive">Maintenance</Badge>
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTemperatureStatus = (temp: number) => {
    if (temp <= 5) return "text-green-600"
    if (temp <= 7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Transporter Portal</span>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Switch Role</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Profile */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{transporterProfile.company}</CardTitle>
                <CardDescription>Contact: {transporterProfile.contact}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-1">⭐</span>
                  <span className="font-medium">{transporterProfile.rating}</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{transporterProfile.phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{transporterProfile.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Fleet Size:</span>
                <p className="font-medium">{transporterProfile.fleetSize} vehicles</p>
              </div>
              <div>
                <span className="text-gray-600">Active Deliveries:</span>
                <p className="font-medium">{activeDeliveries.filter((d) => d.status !== "delivered").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeDeliveries.filter((d) => d.status !== "delivered").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently on road</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fleet.filter((v) => v.status === "active").length}/{fleet.length}
              </div>
              <p className="text-xs text-muted-foreground">Vehicles active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <span className="text-yellow-500">⭐</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transporterProfile.rating}</div>
              <p className="text-xs text-muted-foreground">Customer satisfaction</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deliveries" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Delivery Tracking</CardTitle>
                <CardDescription>Monitor your active deliveries in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{delivery.id}</h3>
                          <p className="text-sm text-gray-600">{delivery.route}</p>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {delivery.product} - {delivery.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Driver: {delivery.driver}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{delivery.currentLocation}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Thermometer className={`h-4 w-4 ${getTemperatureStatus(delivery.temperature)}`} />
                            <span className={`text-sm ${getTemperatureStatus(delivery.temperature)}`}>
                              {delivery.temperature}°C
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">ETA: {delivery.estimatedArrival}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Progress: {delivery.progress}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Delivery Progress</span>
                          <span>{delivery.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${delivery.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Track Live
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Driver
                        </Button>
                        {delivery.status === "in-transit" && (
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Report Issue
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Overview</CardTitle>
                <CardDescription>Manage your vehicle fleet and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Fuel Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fleet.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.id}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>{vehicle.driver}</TableCell>
                        <TableCell>{vehicle.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-4 w-4 text-gray-500" />
                            <span className={`text-sm ${vehicle.fuel < 30 ? "text-red-600" : "text-green-600"}`}>
                              {vehicle.fuel}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Assign
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

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>Past deliveries and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveryHistory.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.route}</TableCell>
                        <TableCell>{delivery.product}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {"⭐".repeat(delivery.rating)}
                            <span className="ml-2 text-sm text-gray-600">({delivery.rating}/5)</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
