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
import { Truck, MapPin, Thermometer, Clock, Plus, Edit, Navigation, Fuel, AlertTriangle, Phone, Calendar, FileText, DollarSign, Package, Users, TrendingUp, Shield, Zap } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Enhanced logistics data with real-world information
const trucks = [
  {
    id: "TR-001",
    model: "Mercedes-Benz Actros 2545 Refrigerated",
    driver: "Ahmed Hassan",
    driverPhone: "+20 123 456 789",
    licensePlate: "ABC-1234",
    route: "Alexandria Farm → Cairo Processing Center",
    currentLocation: "Cairo-Alexandria Highway, KM 85",
    temperature: 4.2,
    humidity: 65,
    fuel: 75,
    speed: 65,
    eta: "2:30 PM",
    status: "in-transit",
    progress: 75,
    lastUpdate: "2 min ago",
    cargo: "Fresh Tomatoes, 2.5 tons",
    maintenanceDue: "2024-02-15",
    insuranceExpiry: "2024-12-31",
    totalDistance: "185 km",
    remainingDistance: "46 km",
    engineHours: 12450,
    avgFuelConsumption: "28 L/100km",
    alerts: [],
    image: "/images/truck-1.jpg"
  },
  {
    id: "TR-002",
    model: "Volvo FH16 750 Refrigerated",
    driver: "Fatima Al-Zahra",
    driverPhone: "+20 987 654 321",
    licensePlate: "XYZ-5678",
    route: "Delta Farm → Alexandria Port",
    currentLocation: "Delta Agricultural Zone",
    temperature: 3.8,
    humidity: 70,
    fuel: 60,
    speed: 0,
    eta: "4:15 PM",
    status: "loading",
    progress: 10,
    lastUpdate: "1 min ago",
    cargo: "Strawberries, 800 kg",
    maintenanceDue: "2024-01-28",
    insuranceExpiry: "2024-11-30",
    totalDistance: "120 km",
    remainingDistance: "108 km",
    engineHours: 8920,
    avgFuelConsumption: "32 L/100km",
    alerts: ["Low fuel warning"],
    image: "/images/truck-2.jpg"
  },
  {
    id: "TR-003",
    model: "Scania R500 Refrigerated",
    driver: "Mohammed Ali",
    driverPhone: "+20 555 123 456",
    licensePlate: "DEF-9012",
    route: "Cairo Processing → Giza Distribution",
    currentLocation: "Cairo Ring Road",
    temperature: 5.1,
    humidity: 68,
    fuel: 45,
    speed: 45,
    eta: "1:45 PM",
    status: "warning",
    progress: 90,
    lastUpdate: "30 sec ago",
    cargo: "Mixed Vegetables, 1.2 tons",
    maintenanceDue: "2024-02-10",
    insuranceExpiry: "2024-10-15",
    totalDistance: "25 km",
    remainingDistance: "2.5 km",
    engineHours: 15680,
    avgFuelConsumption: "30 L/100km",
    alerts: ["Temperature deviation", "Low fuel"],
    image: "/images/truck-3.jpg"
  },
  {
    id: "TR-004",
    model: "MAN TGX 26.510 Refrigerated",
    driver: "Omar Khalil",
    driverPhone: "+20 777 888 999",
    licensePlate: "GHI-3456",
    route: "Sinai Farm → Cairo Market",
    currentLocation: "Suez Canal Bridge",
    temperature: null,
    humidity: null,
    fuel: 90,
    speed: 0,
    eta: "Tomorrow 10:00 AM",
    status: "scheduled",
    progress: 0,
    lastUpdate: "5 min ago",
    cargo: "Citrus Fruits, 3.0 tons",
    maintenanceDue: "2024-03-01",
    insuranceExpiry: "2024-09-30",
    totalDistance: "350 km",
    remainingDistance: "350 km",
    engineHours: 6780,
    avgFuelConsumption: "35 L/100km",
    alerts: [],
    image: "/images/truck-4.jpg"
  },
  {
    id: "TR-005",
    model: "Iveco Stralis Hi-Way Refrigerated",
    driver: "Youssef Mahmoud",
    driverPhone: "+20 111 222 333",
    licensePlate: "JKL-7890",
    route: "Fayoum Farm → Cairo Central",
    currentLocation: "Fayoum-Cairo Highway",
    temperature: 4.5,
    humidity: 72,
    fuel: 85,
    speed: 70,
    eta: "3:20 PM",
    status: "in-transit",
    progress: 60,
    lastUpdate: "45 sec ago",
    cargo: "Fresh Herbs, 500 kg",
    maintenanceDue: "2024-02-20",
    insuranceExpiry: "2024-08-31",
    totalDistance: "95 km",
    remainingDistance: "38 km",
    engineHours: 11230,
    avgFuelConsumption: "29 L/100km",
    alerts: [],
    image: "/images/truck-5.jpg"
  }
]

const deliveries = [
  {
    id: "DEL-001",
    truck: "TR-001",
    origin: "Alexandria Farm",
    destination: "Cairo Processing Center",
    product: "Fresh Tomatoes",
    quantity: "2.5 tons",
    status: "in-transit",
    startTime: "10:15 AM",
    estimatedArrival: "2:30 PM",
    actualArrival: null,
    priority: "High",
    customer: "Cairo Central Market",
    value: "EGP 15,000",
    temperature: "4.2°C",
    humidity: "65%",
    route: "Alexandria → Cairo Highway",
    distance: "185 km",
    driver: "Ahmed Hassan",
    notes: "Handle with care - fragile cargo"
  },
  {
    id: "DEL-002",
    truck: "TR-002",
    origin: "Delta Farm",
    destination: "Alexandria Port",
    product: "Strawberries",
    quantity: "800 kg",
    status: "loading",
    startTime: "1:00 PM",
    estimatedArrival: "4:15 PM",
    actualArrival: null,
    priority: "Medium",
    customer: "Export Company Ltd",
    value: "EGP 8,000",
    temperature: "3.8°C",
    humidity: "70%",
    route: "Delta → Alexandria",
    distance: "120 km",
    driver: "Fatima Al-Zahra",
    notes: "Export shipment - customs clearance required"
  },
  {
    id: "DEL-003",
    truck: "TR-003",
    origin: "Cairo Processing Center",
    destination: "Giza Distribution Hub",
    product: "Mixed Vegetables",
    quantity: "1.2 tons",
    status: "warning",
    startTime: "11:30 AM",
    estimatedArrival: "1:45 PM",
    actualArrival: null,
    priority: "High",
    customer: "Giza Supermarkets Chain",
    value: "EGP 12,000",
    temperature: "5.1°C",
    humidity: "68%",
    route: "Cairo → Giza",
    distance: "25 km",
    driver: "Mohammed Ali",
    notes: "Temperature deviation detected - monitor closely"
  },
  {
    id: "DEL-004",
    truck: "TR-005",
    origin: "Fayoum Farm",
    destination: "Cairo Central Market",
    product: "Fresh Herbs",
    quantity: "500 kg",
    status: "in-transit",
    startTime: "12:00 PM",
    estimatedArrival: "3:20 PM",
    actualArrival: null,
    priority: "Medium",
    customer: "Cairo Restaurants Group",
    value: "EGP 6,000",
    temperature: "4.5°C",
    humidity: "72%",
    route: "Fayoum → Cairo",
    distance: "95 km",
    driver: "Youssef Mahmoud",
    notes: "Perishable goods - deliver before 4 PM"
  }
]

// Additional logistics statistics and data
const logisticsStats = {
  totalFleet: 5,
  activeTrucks: 3,
  totalDeliveries: 156,
  completedDeliveries: 142,
  onTimeDeliveries: 134,
  totalDistance: 2840,
  totalFuelUsed: 850,
  avgDeliveryTime: "3.2 hours",
  customerSatisfaction: 96,
  costPerKm: 2.8,
  carbonFootprint: 2.1,
  maintenanceAlerts: 2,
  insuranceExpiring: 1
}

const routes = [
  {
    id: "R001",
    name: "Alexandria → Cairo",
    distance: "185 km",
    avgTime: "2.5 hours",
    frequency: "Daily",
    avgLoad: "2.5 tons",
    cost: "EGP 520",
    status: "Active"
  },
  {
    id: "R002", 
    name: "Delta → Alexandria",
    distance: "120 km",
    avgTime: "1.8 hours",
    frequency: "3x/week",
    avgLoad: "1.2 tons",
    cost: "EGP 340",
    status: "Active"
  },
  {
    id: "R003",
    name: "Cairo → Giza",
    distance: "25 km",
    avgTime: "0.5 hours",
    frequency: "Daily",
    avgLoad: "1.5 tons",
    cost: "EGP 70",
    status: "Active"
  },
  {
    id: "R004",
    name: "Sinai → Cairo",
    distance: "350 km",
    avgTime: "4.2 hours",
    frequency: "2x/week",
    avgLoad: "3.0 tons",
    cost: "EGP 980",
    status: "Scheduled"
  },
  {
    id: "R005",
    name: "Fayoum → Cairo",
    distance: "95 km",
    avgTime: "1.3 hours",
    frequency: "Daily",
    avgLoad: "0.8 tons",
    cost: "EGP 270",
    status: "Active"
  }
]

const maintenanceSchedule = [
  {
    truckId: "TR-002",
    type: "Oil Change",
    dueDate: "2024-01-28",
    status: "Overdue",
    priority: "High",
    estimatedCost: "EGP 800"
  },
  {
    truckId: "TR-003",
    type: "Brake Inspection",
    dueDate: "2024-02-10",
    status: "Scheduled",
    priority: "Medium",
    estimatedCost: "EGP 1,200"
  },
  {
    truckId: "TR-001",
    type: "Tire Replacement",
    dueDate: "2024-02-15",
    status: "Scheduled",
    priority: "Medium",
    estimatedCost: "EGP 2,500"
  },
  {
    truckId: "TR-004",
    type: "Engine Service",
    dueDate: "2024-03-01",
    status: "Scheduled",
    priority: "Low",
    estimatedCost: "EGP 3,500"
  }
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
            <h1 className="text-3xl font-bold text-foreground">Transport & Logistics Management</h1>
            <p className="text-muted-foreground">Real-time fleet monitoring and delivery optimization for Egyptian agricultural supply chain</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span>{logisticsStats.totalFleet} Vehicles</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>{logisticsStats.activeTrucks} Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Navigation className="h-4 w-4" />
                <span>{logisticsStats.totalDistance} km this month</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle to Fleet</DialogTitle>
                  <DialogDescription>Register a new refrigerated truck for agricultural transport</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="truckId">Vehicle ID</Label>
                    <Input id="truckId" placeholder="TR-006" />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input id="licensePlate" placeholder="ABC-1234" />
                  </div>
                  <div>
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mercedes-actros">Mercedes-Benz Actros 2545</SelectItem>
                        <SelectItem value="volvo-fh16">Volvo FH16 750</SelectItem>
                        <SelectItem value="scania-r500">Scania R500</SelectItem>
                        <SelectItem value="man-tgx">MAN TGX 26.510</SelectItem>
                        <SelectItem value="iveco-stralis">Iveco Stralis Hi-Way</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Refrigeration Capacity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (0.5-1 ton)</SelectItem>
                        <SelectItem value="medium">Medium (1-2 tons)</SelectItem>
                        <SelectItem value="large">Large (2-3 tons)</SelectItem>
                        <SelectItem value="xl">Extra Large (3+ tons)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="driver">Driver Name</Label>
                    <Input id="driver" placeholder="Enter driver full name" />
                  </div>
                  <div>
                    <Label htmlFor="driverPhone">Driver Phone</Label>
                    <Input id="driverPhone" placeholder="+20 XXX XXX XXXX" />
                  </div>
                  <div>
                    <Label htmlFor="route">Primary Route</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alexandria-cairo">Alexandria → Cairo</SelectItem>
                        <SelectItem value="delta-alexandria">Delta → Alexandria</SelectItem>
                        <SelectItem value="cairo-giza">Cairo → Giza</SelectItem>
                        <SelectItem value="sinai-cairo">Sinai → Cairo</SelectItem>
                        <SelectItem value="fayoum-cairo">Fayoum → Cairo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenanceDue">Next Maintenance</Label>
                    <Input id="maintenanceDue" type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input id="notes" placeholder="Special requirements, equipment, etc." />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Fleet</p>
                  <p className="text-lg font-bold">{logisticsStats.totalFleet}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-lg font-bold">{logisticsStats.activeTrucks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Deliveries</p>
                  <p className="text-lg font-bold">{logisticsStats.totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">On-Time</p>
                  <p className="text-lg font-bold">{Math.round((logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Alerts</p>
                  <p className="text-lg font-bold">{logisticsStats.maintenanceAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost/km</p>
                  <p className="text-lg font-bold">{logisticsStats.costPerKm} EGP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="trucks">Fleet Overview</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Driver & Route</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Driver:</span>
                            <span className="font-medium">{truck.driver}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{truck.driverPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">License:</span>
                            <span className="font-mono text-xs">{truck.licensePlate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-xs">{truck.currentLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span>Cargo & Sensors</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Cargo:</span>
                            <span className="text-xs">{truck.cargo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className={`h-4 w-4 ${getTemperatureColor(truck.temperature)}`} />
                            <span>Temp: {truck.temperature ? `${truck.temperature}°C` : "N/A"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Humidity:</span>
                            <span>{truck.humidity ? `${truck.humidity}%` : "N/A"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className={`h-4 w-4 ${getFuelColor(truck.fuel)}`} />
                            <span>Fuel: {truck.fuel}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Navigation className="h-4 w-4" />
                          <span>Progress & ETA</span>
                        </h4>
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
                          <div className="text-xs text-muted-foreground">
                            {truck.remainingDistance} remaining
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last update: {truck.lastUpdate}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>Vehicle Info</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Engine Hours:</span>
                            <span>{truck.engineHours.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Fuel Avg:</span>
                            <span>{truck.avgFuelConsumption}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">Maintenance: {truck.maintenanceDue}</span>
                          </div>
                          {truck.alerts.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-600">{truck.alerts.length} alerts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTruck(truck)}>
                        <MapPin className="h-4 w-4 mr-1" />
                        Track Live
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Driver
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Documents
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {truck.alerts.length > 0 && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {truck.alerts.length} Alert{truck.alerts.length > 1 ? 's' : ''}
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
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive GPS tracking map</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing {trucks.filter((t) => t.status === "in-transit").length} active trucks
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>In Transit</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Loading</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Warning</span>
                        </div>
                      </div>
                    </div>
                    {/* Simulated truck positions */}
                    <div className="absolute top-8 left-8">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="text-xs mt-1">TR-001</div>
                    </div>
                    <div className="absolute top-16 right-16">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="text-xs mt-1">TR-002</div>
                    </div>
                    <div className="absolute bottom-16 left-16">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="text-xs mt-1">TR-003</div>
                    </div>
                    <div className="absolute bottom-8 right-8">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="text-xs mt-1">TR-005</div>
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
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Cargo Details</Label>
                          <p className="text-sm font-medium">{selectedTruck.cargo}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">License Plate</Label>
                          <p className="text-sm font-mono">{selectedTruck.licensePlate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Driver
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Priority</TableHead>
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
                            <div className="text-xs text-blue-600">{delivery.distance}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{delivery.product}</div>
                            <div className="text-xs text-muted-foreground">
                              {delivery.temperature} | {delivery.humidity}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.quantity}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{delivery.customer}</div>
                            <div className="text-xs text-muted-foreground">{delivery.driver}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{delivery.value}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            delivery.priority === "High" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {delivery.priority}
                          </Badge>
                        </TableCell>
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
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
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

          <TabsContent value="routes" className="space-y-4">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>Optimize delivery routes and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route ID</TableHead>
                        <TableHead>Route Name</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Avg Time</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Avg Load</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">{route.id}</TableCell>
                          <TableCell>{route.name}</TableCell>
                          <TableCell>{route.distance}</TableCell>
                          <TableCell>{route.avgTime}</TableCell>
                          <TableCell>{route.frequency}</TableCell>
                          <TableCell>{route.avgLoad}</TableCell>
                          <TableCell>{route.cost}</TableCell>
                          <TableCell>
                            <Badge className={route.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {route.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Track vehicle maintenance and repairs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Truck ID</TableHead>
                        <TableHead>Maintenance Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Estimated Cost</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceSchedule.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.truckId}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={item.status === "Overdue" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              item.priority === "High" ? "bg-red-100 text-red-800" :
                              item.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.estimatedCost}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalDeliveries}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round((logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {logisticsStats.onTimeDeliveries} of {logisticsStats.completedDeliveries} deliveries
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalDistance} km</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Used</CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalFuelUsed} L</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {logisticsStats.costPerKm} EGP/km
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">On-Time Delivery Rate</span>
                      <span className="text-sm font-medium">{Math.round((logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100)}%</span>
                    </div>
                    <Progress value={(logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">{logisticsStats.customerSatisfaction}%</span>
                    </div>
                    <Progress value={logisticsStats.customerSatisfaction} className="h-2" />
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
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Delivery Time</span>
                      <span className="text-sm font-medium">{logisticsStats.avgDeliveryTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status & Alerts</CardTitle>
                  <CardDescription>Current fleet overview and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Fleet</span>
                      <span className="text-2xl font-bold">{logisticsStats.totalFleet}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Trucks</span>
                      <span className="text-2xl font-bold text-blue-600">{logisticsStats.activeTrucks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maintenance Alerts</span>
                      <span className="text-2xl font-bold text-red-600">{logisticsStats.maintenanceAlerts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Insurance Expiring</span>
                      <span className="text-2xl font-bold text-yellow-600">{logisticsStats.insuranceExpiring}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span>Carbon Footprint: {logisticsStats.carbonFootprint} tons CO2</span>
                      </div>
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
