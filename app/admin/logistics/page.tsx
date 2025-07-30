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
import { Truck, MapPin, Thermometer, Clock, Plus, Edit, Navigation, Fuel, AlertTriangle } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Dummy data
const trucks = [
  {
    id: "TR-001",
    model: "Refrigerated Truck A",
    driver: "John Smith",
    route: "Green Valley Farm → Factory",
    currentLocation: "Highway 101, Mile 45",
    temperature: 4.2,
    humidity: 65,
    fuel: 75,
    speed: 65,
    eta: "2:30 PM",
    status: "in-transit",
    progress: 75,
    lastUpdate: "2 min ago",
  },
  {
    id: "TR-002",
    model: "Refrigerated Truck B",
    driver: "Jane Doe",
    route: "Berry Fresh Co → Factory",
    currentLocation: "Farm Pickup Point",
    temperature: 3.8,
    humidity: 70,
    fuel: 60,
    speed: 0,
    eta: "4:15 PM",
    status: "loading",
    progress: 10,
    lastUpdate: "1 min ago",
  },
  {
    id: "TR-003",
    model: "Refrigerated Truck C",
    driver: "Bob Johnson",
    route: "Factory → SuperMart",
    currentLocation: "Distribution Center",
    temperature: 5.1,
    humidity: 68,
    fuel: 45,
    speed: 45,
    eta: "1:45 PM",
    status: "warning",
    progress: 90,
    lastUpdate: "30 sec ago",
  },
  {
    id: "TR-004",
    model: "Refrigerated Truck D",
    driver: "Mike Wilson",
    route: "Mountain Orchards → Factory",
    currentLocation: "Depot",
    temperature: null,
    humidity: null,
    fuel: 90,
    speed: 0,
    eta: "Tomorrow 10:00 AM",
    status: "scheduled",
    progress: 0,
    lastUpdate: "5 min ago",
  },
]

const deliveries = [
  {
    id: "DEL-001",
    truck: "TR-001",
    origin: "Green Valley Farm",
    destination: "FreshChain Factory",
    product: "Oranges",
    quantity: "500 kg",
    status: "in-transit",
    startTime: "10:15 AM",
    estimatedArrival: "2:30 PM",
    actualArrival: null,
  },
  {
    id: "DEL-002",
    truck: "TR-002",
    origin: "Berry Fresh Co",
    destination: "FreshChain Factory",
    product: "Strawberries",
    quantity: "200 kg",
    status: "loading",
    startTime: "1:00 PM",
    estimatedArrival: "4:15 PM",
    actualArrival: null,
  },
  {
    id: "DEL-003",
    truck: "TR-003",
    origin: "FreshChain Factory",
    destination: "SuperMart Downtown",
    product: "Mixed Products",
    quantity: "150 units",
    status: "warning",
    startTime: "11:30 AM",
    estimatedArrival: "1:45 PM",
    actualArrival: null,
  },
]

export default function LogisticsPage() {
  const [selectedTab, setSelectedTab] = useState("trucks")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(trucks[0])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
      case "loading":
        return <Badge className="bg-yellow-100 text-yellow-800">Loading</Badge>
      case "warning":
        return <Badge variant="destructive">Warning</Badge>
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTemperatureColor = (temp: number | null) => {
    if (temp === null) return "text-gray-500"
    if (temp <= 5) return "text-green-600"
    if (temp <= 7) return "text-yellow-600"
    return "text-red-600"
  }

  const getFuelColor = (fuel: number) => {
    if (fuel >= 50) return "text-green-600"
    if (fuel >= 25) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transport & Logistics</h1>
            <p className="text-muted-foreground">Monitor and manage your delivery fleet</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Data</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Truck
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Truck</DialogTitle>
                  <DialogDescription>Add a new truck to your fleet</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="truckId">Truck ID</Label>
                    <Input id="truckId" placeholder="Enter truck ID" />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="Enter truck model" />
                  </div>
                  <div>
                    <Label htmlFor="driver">Driver</Label>
                    <Input id="driver" placeholder="Enter driver name" />
                  </div>
                  <div>
                    <Label htmlFor="route">Route</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm-factory">Farm → Factory</SelectItem>
                        <SelectItem value="factory-store">Factory → Store</SelectItem>
                        <SelectItem value="store-customer">Store → Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Truck</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="trucks">Fleet Overview</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trucks" className="space-y-4">
            <div className="grid gap-6">
              {trucks.map((truck) => (
                <Card key={truck.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <span>{truck.id}</span>
                        </CardTitle>
                        <CardDescription>{truck.model}</CardDescription>
                      </div>
                      {getStatusBadge(truck.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Driver & Route</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Driver:</span>
                            <span>{truck.driver}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Route:</span>
                            <span>{truck.route}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{truck.currentLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Sensors & Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Thermometer className={`h-4 w-4 ${getTemperatureColor(truck.temperature)}`} />
                            <span>Temp: {truck.temperature ? `${truck.temperature}°C` : "N/A"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className={`h-4 w-4 ${getFuelColor(truck.fuel)}`} />
                            <span>Fuel: {truck.fuel}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-gray-500" />
                            <span>Speed: {truck.speed} km/h</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Progress & ETA</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{truck.progress}%</span>
                          </div>
                          <Progress value={truck.progress} className="h-2" />
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>ETA: {truck.eta}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Last update: {truck.lastUpdate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTruck(truck)}>
                        <MapPin className="h-4 w-4 mr-1" />
                        Track Live
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact Driver
                      </Button>
                      {truck.status === "warning" && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Alert
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Map View</CardTitle>
                  <CardDescription>Real-time truck positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive map would be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing {trucks.filter((t) => t.status === "in-transit").length} active trucks
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selected Truck: {selectedTruck.id}</CardTitle>
                  <CardDescription>Detailed tracking information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Current Location</Label>
                        <p className="text-sm">{selectedTruck.currentLocation}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <div>{getStatusBadge(selectedTruck.status)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Temperature</Label>
                        <p className={`text-sm font-medium ${getTemperatureColor(selectedTruck.temperature)}`}>
                          {selectedTruck.temperature ? `${selectedTruck.temperature}°C` : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Humidity</Label>
                        <p className="text-sm">{selectedTruck.humidity ? `${selectedTruck.humidity}%` : "N/A"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Route Progress</Label>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{selectedTruck.route}</span>
                        <span>{selectedTruck.progress}%</span>
                      </div>
                      <Progress value={selectedTruck.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Current Speed</Label>
                        <p className="text-sm">{selectedTruck.speed} km/h</p>
                      </div>
                      <div className="space-y-2">
                        <Label>ETA</Label>
                        <p className="text-sm font-medium">{selectedTruck.eta}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Call Driver
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deliveries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>Current delivery status and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Truck</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>{delivery.truck}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{delivery.origin}</div>
                            <div className="text-muted-foreground">→ {delivery.destination}</div>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.product}</TableCell>
                        <TableCell>{delivery.quantity}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>{delivery.estimatedArrival}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
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

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Performance</CardTitle>
                  <CardDescription>Key performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">On-Time Delivery Rate</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fuel Efficiency</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature Compliance</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fleet Utilization</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status Summary</CardTitle>
                  <CardDescription>Current fleet overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Trucks</span>
                      <span className="text-2xl font-bold">{trucks.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Deliveries</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {trucks.filter((t) => t.status === "in-transit").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Warnings</span>
                      <span className="text-2xl font-bold text-red-600">
                        {trucks.filter((t) => t.status === "warning").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scheduled</span>
                      <span className="text-2xl font-bold text-gray-600">
                        {trucks.filter((t) => t.status === "scheduled").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
