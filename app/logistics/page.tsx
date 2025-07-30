"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Truck,
  MapPin,
  Thermometer,
  Clock,
  Package,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  Fuel,
  Navigation,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy data
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
    startTime: "10:15",
    supplier: "Green Valley Farm",
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
    startTime: "13:00",
    supplier: "Mountain Orchards",
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
    startTime: "09:30",
    supplier: "FreshChain Factory",
  },
  {
    id: "TR004",
    route: "Berry Fresh Co → FreshChain Factory",
    product: "Strawberries",
    quantity: "150 kg",
    driver: "Mike Wilson",
    status: "scheduled",
    progress: 0,
    temperature: null,
    estimatedArrival: "Tomorrow, 10:00",
    currentLocation: "Berry Fresh Co",
    startTime: "Tomorrow, 08:00",
    supplier: "Berry Fresh Co",
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
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
  },
  {
    id: "V002",
    model: "Refrigerated Truck B",
    status: "active",
    driver: "Jane Doe",
    location: "Mountain Orchards",
    fuel: 60,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
  },
  {
    id: "V003",
    model: "Refrigerated Truck C",
    status: "maintenance",
    driver: "N/A",
    location: "Service Center",
    fuel: 0,
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-01-22",
  },
  {
    id: "V004",
    model: "Refrigerated Truck D",
    status: "available",
    driver: "N/A",
    location: "Depot",
    fuel: 90,
    lastMaintenance: "2023-12-15",
    nextMaintenance: "2024-02-15",
  },
  {
    id: "V005",
    model: "Refrigerated Truck E",
    status: "active",
    driver: "Bob Johnson",
    location: "SuperMart Downtown",
    fuel: 45,
    lastMaintenance: "2023-12-20",
    nextMaintenance: "2024-02-20",
  },
]

const deliveryHistory = [
  {
    id: "TR-H001",
    date: "2024-01-20",
    route: "Green Valley → Factory",
    product: "Oranges",
    quantity: "450 kg",
    status: "completed",
    onTime: true,
    temperature: "Optimal",
    driver: "John Smith",
  },
  {
    id: "TR-H002",
    date: "2024-01-19",
    route: "Berry Fresh → Factory",
    product: "Strawberries",
    quantity: "200 kg",
    status: "completed",
    onTime: true,
    temperature: "Optimal",
    driver: "Mike Wilson",
  },
  {
    id: "TR-H003",
    date: "2024-01-18",
    route: "Factory → SuperMart",
    product: "Juices",
    quantity: "300 bottles",
    status: "completed",
    onTime: false,
    temperature: "Optimal",
    driver: "Bob Johnson",
  },
  {
    id: "TR-H004",
    date: "2024-01-17",
    route: "Mountain → Factory",
    product: "Apples",
    quantity: "350 kg",
    status: "completed",
    onTime: true,
    temperature: "Optimal",
    driver: "Jane Doe",
  },
]

const performanceMetrics = {
  onTimeDelivery: 95,
  temperatureCompliance: 98,
  fuelEfficiency: 87,
  driverPerformance: 92,
}

export default function LogisticsPage() {
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
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {status === "delivered" ? "Delivered" : "Completed"}
          </Badge>
        )
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
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
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTemperatureStatus = (temp: number | null) => {
    if (temp === null) return "text-gray-600"
    if (temp <= 5) return "text-green-600"
    if (temp <= 7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Logistics Management</h1>
            <p className="text-gray-600">Track deliveries, manage fleet, and optimize routes</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Export Data</Button>
            <Button>Schedule Delivery</Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold">{performanceMetrics.onTimeDelivery}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature Compliance</CardTitle>
              <Thermometer className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.temperatureCompliance}%</div>
              <p className="text-xs text-muted-foreground">Cold chain maintained</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deliveries" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
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
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{delivery.id}</h3>
                            {getStatusBadge(delivery.status)}
                          </div>
                          <p className="text-sm text-gray-600">{delivery.route}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Start: {delivery.startTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>ETA: {delivery.estimatedArrival}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
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
                          {delivery.temperature !== null && (
                            <div className="flex items-center space-x-2">
                              <Thermometer className={`h-4 w-4 ${getTemperatureStatus(delivery.temperature)}`} />
                              <span className={`text-sm ${getTemperatureStatus(delivery.temperature)}`}>
                                {delivery.temperature}°C
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Progress: {delivery.progress}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">From: {delivery.supplier}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Delivery Progress</span>
                          <span>{delivery.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              delivery.status === "scheduled"
                                ? "bg-gray-400"
                                : delivery.status === "loading"
                                  ? "bg-yellow-500"
                                  : "bg-blue-600"
                            }`}
                            style={{ width: `${delivery.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle ID</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Fuel Level</TableHead>
                        <TableHead>Maintenance</TableHead>
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
                            <div className="text-xs">
                              <div>Last: {vehicle.lastMaintenance}</div>
                              <div>Next: {vehicle.nextMaintenance}</div>
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
                </div>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>On Time</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryHistory.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.id}</TableCell>
                          <TableCell>{delivery.date}</TableCell>
                          <TableCell>{delivery.route}</TableCell>
                          <TableCell>{delivery.product}</TableCell>
                          <TableCell>{delivery.quantity}</TableCell>
                          <TableCell>{delivery.driver}</TableCell>
                          <TableCell>
                            {delivery.onTime ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={delivery.temperature === "Optimal" ? "text-green-600" : "text-yellow-600"}>
                              {delivery.temperature}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logistics Performance</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm font-medium">{performanceMetrics.onTimeDelivery}%</span>
                    </div>
                    <Progress value={performanceMetrics.onTimeDelivery} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Temperature Compliance</span>
                      <span className="text-sm font-medium">{performanceMetrics.temperatureCompliance}%</span>
                    </div>
                    <Progress value={performanceMetrics.temperatureCompliance} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Fuel Efficiency</span>
                      <span className="text-sm font-medium">{performanceMetrics.fuelEfficiency}%</span>
                    </div>
                    <Progress value={performanceMetrics.fuelEfficiency} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Driver Performance</span>
                      <span className="text-sm font-medium">{performanceMetrics.driverPerformance}%</span>
                    </div>
                    <Progress value={performanceMetrics.driverPerformance} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Opportunities</CardTitle>
                  <CardDescription>AI-suggested improvements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Route Optimization</h4>
                        <p className="text-sm text-blue-700">
                          Combining deliveries to Mountain Orchards and Berry Fresh Co could save 15% in fuel costs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Delivery Scheduling</h4>
                        <p className="text-sm text-green-700">
                          Shifting morning deliveries 30 minutes earlier could avoid peak traffic and improve on-time
                          rate by 5%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-start space-x-3">
                      <Thermometer className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Temperature Management</h4>
                        <p className="text-sm text-yellow-700">
                          Pre-cooling trucks for 15 minutes before loading could improve temperature stability for
                          berries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Fleet Utilization</h4>
                        <p className="text-sm text-purple-700">
                          Vehicle V004 has been idle for 3 days. Consider reassigning to upcoming deliveries.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
