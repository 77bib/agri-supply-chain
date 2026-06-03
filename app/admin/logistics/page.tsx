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
import { useI18n } from "@/lib/i18n"

// Enhanced logistics data with real-world information
const trucks = [
  {
    id: "TR-001",
    model: "Mercedes-Benz Actros 2545 Frigorifique",
    driver: "Ahmed Hassan",
    driverPhone: "+20 123 456 789",
    licensePlate: "ABC-1234",
    route: "Ferme d'Alexandrie → Centre de Traitement du Caire",
    currentLocation: "Autoroute Le Caire-Alexandrie, KM 85",
    temperature: 4.2,
    humidity: 65,
    fuel: 75,
    speed: 65,
    eta: "14:30",
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
    model: "Volvo FH16 750 Frigorifique",
    driver: "Fatima Al-Zahra",
    driverPhone: "+20 987 654 321",
    licensePlate: "XYZ-5678",
    route: "Delta Farm → Alexandria Port",
    currentLocation: "Delta Agricultural Zone",
    temperature: 3.8,
    humidity: 70,
    fuel: 60,
    speed: 0,
    eta: "16:15",
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
    model: "Scania R500 Frigorifique",
    driver: "Mohammed Ali",
    driverPhone: "+20 555 123 456",
    licensePlate: "DEF-9012",
    route: "Cairo Processing Center → Giza Distribution",
    currentLocation: "Cairo Ring Road",
    temperature: 5.1,
    humidity: 68,
    fuel: 45,
    speed: 45,
    eta: "13:45",
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
    model: "MAN TGX 26.510 Frigorifique",
    driver: "Omar Khalil",
    driverPhone: "+20 777 888 999",
    licensePlate: "GHI-3456",
    route: "Sinai Farm → Cairo Market",
    currentLocation: "Suez Canal Bridge",
    temperature: null,
    humidity: null,
    fuel: 90,
    speed: 0,
    eta: "Demain 10:00",
    status: "scheduled",
    progress: 0,
    lastUpdate: "5 min ago",
    cargo: "Citrus, 3.0 tons",
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
    model: "Iveco Stralis Hi-Way Frigorifique",
    driver: "Youssef Mahmoud",
    driverPhone: "+20 111 222 333",
    licensePlate: "JKL-7890",
    route: "Fayoum Farm → Cairo Center",
    currentLocation: "Fayoum-Cairo Highway",
    temperature: 4.5,
    humidity: 72,
    fuel: 85,
    speed: 70,
    eta: "15:20",
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
    quantity: "2.5 tonnes",
    status: "in-transit",
    startTime: "10:15",
    estimatedArrival: "14:30",
    actualArrival: null,
    priority: "High",
    customer: "Cairo Central Market",
    value: "EGP 15,000",
    temperature: "4.2°C",
    humidity: "65%",
    route: "Alexandrie → Autoroute du Caire",
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
    startTime: "13:00",
    estimatedArrival: "16:15",
    actualArrival: null,
    priority: "Medium",
    customer: "Export Company Ltd",
    value: "EGP 8,000",
    temperature: "3.8°C",
    humidity: "70%",
    route: "Delta → Alexandrie",
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
    quantity: "1.2 tonnes",
    status: "warning",
    startTime: "11:30",
    estimatedArrival: "13:45",
    actualArrival: null,
    priority: "High",
    customer: "Giza Supermarket Chain",
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
    origin: "Ferme de Fayoum",
    destination: "Cairo Central Market",
    product: "Fresh Herbs",
    quantity: "500 kg",
    status: "in-transit",
    startTime: "12:00",
    estimatedArrival: "15:20",
    actualArrival: null,
    priority: "Moyenne",
    customer: "Groupe de Restaurants du Caire",
    value: "EGP 6,000",
    temperature: "4.5°C",
    humidity: "72%",
    route: "Fayoum → Le Caire",
    distance: "95 km",
    driver: "Youssef Mahmoud",
    notes: "Perishable goods - deliver before 4 PM"
  }
]

// Statistiques et données logistiques supplémentaires
const logisticsStats = {
  totalFleet: 5,
  activeTrucks: 3,
  totalDeliveries: 156,
  completedDeliveries: 142,
  onTimeDeliveries: 134,
  totalDistance: 2840,
  totalFuelUsed: 850,
  avgDeliveryTime: "3.2 heures",
  customerSatisfaction: 96,
  costPerKm: 2.8,
  carbonFootprint: 2.1,
  maintenanceAlerts: 2,
  insuranceExpiring: 1
}

const routes = [
  {
    id: "R001",
    name: "Alexandrie → Le Caire",
    distance: "185 km",
    avgTime: "2.5 heures",
    frequency: "Quotidien",
    avgLoad: "2.5 tonnes",
    cost: "EGP 520",
    status: "Actif"
  },
  {
    id: "R002", 
    name: "Delta → Alexandrie",
    distance: "120 km",
    avgTime: "1.8 heures",
    frequency: "3x/semaine",
    avgLoad: "1.2 tonnes",
    cost: "EGP 340",
    status: "Actif"
  },
  {
    id: "R003",
    name: "Le Caire → Giza",
    distance: "25 km",
    avgTime: "0.5 heures",
    frequency: "Quotidien",
    avgLoad: "1.5 tonnes",
    cost: "EGP 70",
    status: "Actif"
  },
  {
    id: "R004",
    name: "Sinai → Cairo",
    distance: "350 km",
    avgTime: "4.2 heures",
    frequency: "2x/semaine",
    avgLoad: "3.0 tonnes",
    cost: "EGP 980",
    status: "Scheduled"
  },
  {
    id: "R005",
    name: "Fayoum → Le Caire",
    distance: "95 km",
    avgTime: "1.3 heures",
    frequency: "Quotidien",
    avgLoad: "0.8 tonnes",
    cost: "EGP 270",
    status: "Actif"
  }
]

const maintenanceSchedule = [
  {
    truckId: "TR-002",
    type: "Vidange d'Huile",
    dueDate: "2024-01-28",
    status: "En Retard",
    priority: "High",
    estimatedCost: "EGP 800"
  },
  {
    truckId: "TR-003",
    type: "Inspection des Freins",
    dueDate: "2024-02-10",
    status: "Scheduled",
    priority: "Moyenne",
    estimatedCost: "EGP 1,200"
  },
  {
    truckId: "TR-001",
    type: "Remplacement des Pneus",
    dueDate: "2024-02-15",
    status: "Planifiée",
    priority: "Moyenne",
    estimatedCost: "EGP 2,500"
  },
  {
    truckId: "TR-004",
    type: "Entretien du Moteur",
    dueDate: "2024-03-01",
    status: "Planifiée",
    priority: "Basse",
    estimatedCost: "EGP 3,500"
  }
]

export default function LogisticsPage() {
  const { t } = useI18n()
  const [selectedTab, setSelectedTab] = useState("trucks")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(trucks[0])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-800">{t("admin.logistics.status.inTransit")}</Badge>
      case "loading":
        return <Badge className="bg-yellow-100 text-yellow-800">{t("admin.logistics.status.loading")}</Badge>
      case "warning":
        return <Badge variant="destructive">{t("admin.logistics.status.alert")}</Badge>
      case "scheduled":
        return <Badge variant="outline">{t("admin.logistics.status.scheduled")}</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">{t("admin.logistics.status.delivered")}</Badge>
      default:
        return <Badge variant="outline">{t("admin.common.unknown")}</Badge>
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
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("admin.logistics.title")}</h1>
            <p className="text-muted-foreground">{t("admin.logistics.subtitle")}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span>{t("admin.logistics.header.vehicles", { value: logisticsStats.totalFleet })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>{t("admin.logistics.header.active", { value: logisticsStats.activeTrucks })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Navigation className="h-4 w-4" />
                <span>{t("admin.logistics.header.kmThisMonth", { value: logisticsStats.totalDistance })}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              {t("admin.logistics.exportReport")}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.logistics.addVehicle")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t("admin.logistics.addDialog.title")}</DialogTitle>
                  <DialogDescription>{t("admin.logistics.addDialog.subtitle")}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="truckId">{t("admin.logistics.form.vehicleId")}</Label>
                    <Input id="truckId" placeholder="TR-006" />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">{t("admin.logistics.form.licensePlate")}</Label>
                    <Input id="licensePlate" placeholder="ABC-1234" />
                  </div>
                  <div>
                    <Label htmlFor="model">{t("admin.logistics.form.vehicleModel")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.logistics.form.vehicleModel.placeholder")} />
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
                    <Label htmlFor="capacity">{t("admin.logistics.form.refrigeration")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.logistics.form.refrigeration.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t("admin.logistics.form.refrigeration.small")}</SelectItem>
                        <SelectItem value="medium">{t("admin.logistics.form.refrigeration.medium")}</SelectItem>
                        <SelectItem value="large">{t("admin.logistics.form.refrigeration.large")}</SelectItem>
                        <SelectItem value="xl">{t("admin.logistics.form.refrigeration.xl")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="driver">{t("admin.logistics.form.driverName")}</Label>
                    <Input id="driver" placeholder={t("admin.logistics.form.driverName.placeholder")} />
                  </div>
                  <div>
                    <Label htmlFor="driverPhone">{t("admin.logistics.form.driverPhone")}</Label>
                    <Input id="driverPhone" placeholder="+20 XXX XXX XXXX" />
                  </div>
                  <div>
                    <Label htmlFor="route">{t("admin.logistics.form.mainRoute")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.logistics.form.mainRoute.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alexandria-cairo">Alexandrie → Le Caire</SelectItem>
                        <SelectItem value="delta-alexandria">Delta → Alexandrie</SelectItem>
                        <SelectItem value="cairo-giza">Le Caire → Giza</SelectItem>
                        <SelectItem value="sinai-cairo">Sinaï → Le Caire</SelectItem>
                        <SelectItem value="fayoum-cairo">Fayoum → Le Caire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenanceDue">{t("admin.logistics.form.nextMaintenance")}</Label>
                    <Input id="maintenanceDue" type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">{t("admin.logistics.form.notes")}</Label>
                    <Input id="notes" placeholder={t("admin.logistics.form.notes.placeholder")} />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.logistics.addVehicle")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Aperçu des Statistiques Rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.totalFleet")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.active")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.deliveries")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.onTime")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.alerts")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("admin.logistics.quickStats.costPerKm")}</p>
                  <p className="text-lg font-bold">{logisticsStats.costPerKm} EGP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="trucks">{t("admin.logistics.tabs.trucks")}</TabsTrigger>
            <TabsTrigger value="tracking">{t("admin.logistics.tabs.tracking")}</TabsTrigger>
            <TabsTrigger value="deliveries">{t("admin.logistics.tabs.deliveries")}</TabsTrigger>
            <TabsTrigger value="routes">{t("admin.logistics.tabs.routes")}</TabsTrigger>
            <TabsTrigger value="maintenance">{t("admin.logistics.tabs.maintenance")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("admin.logistics.tabs.analytics")}</TabsTrigger>
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
                          <span>{t("admin.logistics.sections.driverRoute")}</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.driver")}</span>
                            <span className="font-medium">{truck.driver}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{truck.driverPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.licensePlate")}</span>
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
                          <span>{t("admin.logistics.sections.cargoSensors")}</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.cargo")}</span>
                            <span className="text-xs">{truck.cargo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className={`h-4 w-4 ${getTemperatureColor(truck.temperature)}`} />
                            <span>{t("admin.logistics.labels.temp")} {truck.temperature ? `${truck.temperature}°C` : t("admin.logistics.na")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.humidity")}</span>
                            <span>{truck.humidity ? `${truck.humidity}%` : t("admin.logistics.na")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className={`h-4 w-4 ${getFuelColor(truck.fuel)}`} />
                            <span>{t("admin.logistics.labels.fuel")} {truck.fuel}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Navigation className="h-4 w-4" />
                          <span>{t("admin.logistics.sections.progressEta")}</span>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t("admin.logistics.labels.progress")}</span>
                            <span>{truck.progress}%</span>
                          </div>
                          <Progress value={truck.progress} className="h-2" />
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{t("admin.logistics.labels.eta")} {truck.eta}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("admin.logistics.remainingDistance", { value: truck.remainingDistance })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("admin.logistics.lastUpdate", { value: truck.lastUpdate })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>{t("admin.logistics.sections.vehicleInfo")}</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.engineHours")}</span>
                            <span>{truck.engineHours.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{t("admin.logistics.labels.avgFuel")}</span>
                            <span>{truck.avgFuelConsumption}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{t("admin.logistics.labels.maintenance")} {truck.maintenanceDue}</span>
                          </div>
                          {truck.alerts.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-600">{t("admin.logistics.alertCount", { count: truck.alerts.length })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTruck(truck)}>
                        <MapPin className="h-4 w-4 mr-1" />
                        {t("admin.logistics.actions.liveTracking")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        {t("admin.logistics.actions.callDriver")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        {t("admin.logistics.actions.documents")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        {t("admin.logistics.actions.edit")}
                      </Button>
                      {truck.alerts.length > 0 && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {t("admin.logistics.actions.alerts", { count: truck.alerts.length })}
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
                  <CardTitle>{t("admin.logistics.tracking.mapTitle")}</CardTitle>
                  <CardDescription>{t("admin.logistics.tracking.mapDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t("admin.logistics.tracking.mapPlaceholder")}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {t("admin.logistics.tracking.showingActive", { count: trucks.filter((t) => t.status === "in-transit").length })}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>{t("admin.logistics.status.inTransit")}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>{t("admin.logistics.status.loading")}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>{t("admin.logistics.status.alert")}</span>
                        </div>
                      </div>
                    </div>
                    {/* Positions de camion simulées */}
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
                  <CardTitle>{t("admin.logistics.tracking.selectedTruck", { id: selectedTruck.id })}</CardTitle>
                  <CardDescription>{t("admin.logistics.tracking.selectedTruckDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.tracking.currentLocation")}</Label>
                        <p className="text-sm">{selectedTruck.currentLocation}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.tracking.status")}</Label>
                        <div>{getStatusBadge(selectedTruck.status)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.tracking.temperature")}</Label>
                        <p className={`text-sm font-medium ${getTemperatureColor(selectedTruck.temperature)}`}>
                          {selectedTruck.temperature ? `${selectedTruck.temperature}°C` : t("admin.logistics.na")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.tracking.humidity")}</Label>
                        <p className="text-sm">{selectedTruck.humidity ? `${selectedTruck.humidity}%` : t("admin.logistics.na")}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("admin.logistics.tracking.routeProgress")}</Label>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{selectedTruck.route}</span>
                        <span>{selectedTruck.progress}%</span>
                      </div>
                      <Progress value={selectedTruck.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.tracking.currentSpeed")}</Label>
                        <p className="text-sm">{selectedTruck.speed} km/h</p>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("admin.logistics.labels.eta").trim()}</Label>
                        <p className="text-sm font-medium">{selectedTruck.eta}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label className="text-xs">{t("admin.logistics.tracking.cargoDetails")}</Label>
                          <p className="text-sm font-medium">{selectedTruck.cargo}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">{t("admin.logistics.labels.licensePlate")}</Label>
                          <p className="text-sm font-mono">{selectedTruck.licensePlate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {t("admin.logistics.actions.callDriver")}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          {t("admin.logistics.actions.sendMessage")}
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
                <CardTitle>{t("admin.logistics.deliveries.title")}</CardTitle>
                <CardDescription>{t("admin.logistics.deliveries.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.logistics.deliveries.table.id")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.truck")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.route")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.product")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.quantity")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.customer")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.value")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.priority")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.status")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.eta")}</TableHead>
                      <TableHead>{t("admin.logistics.deliveries.table.actions")}</TableHead>
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
                            delivery.priority === "Élevée" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {delivery.priority === "Élevée"
                              ? t("admin.logistics.priority.high")
                              : t("admin.logistics.priority.medium")}
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
                  <CardTitle>{t("admin.logistics.routes.title")}</CardTitle>
                  <CardDescription>{t("admin.logistics.routes.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.logistics.routes.table.id")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.name")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.distance")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.avgTime")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.frequency")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.avgLoad")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.cost")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.status")}</TableHead>
                        <TableHead>{t("admin.logistics.routes.table.actions")}</TableHead>
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
                            <Badge className={route.status === "Actif" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {route.status === "Actif" ? t("admin.logistics.routes.status.active") : t("admin.logistics.routes.status.planned")}
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
                  <CardTitle>{t("admin.logistics.maintenance.title")}</CardTitle>
                  <CardDescription>{t("admin.logistics.maintenance.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.logistics.maintenance.table.truckId")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.type")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.dueDate")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.status")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.priority")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.estimatedCost")}</TableHead>
                        <TableHead>{t("admin.logistics.maintenance.table.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceSchedule.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.truckId}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={item.status === "En Retard" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                              {item.status === "En Retard" ? t("admin.logistics.maintenance.status.overdue") : t("admin.logistics.maintenance.status.scheduled")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              item.priority === "Élevée" ? "bg-red-100 text-red-800" :
                              item.priority === "Moyenne" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {item.priority === "Élevée"
                                ? t("admin.logistics.priority.high")
                                : item.priority === "Moyenne"
                                  ? t("admin.logistics.priority.medium")
                                  : t("admin.logistics.priority.low")}
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
                  <CardTitle className="text-sm font-medium">{t("admin.logistics.analytics.totalDeliveries")}</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalDeliveries}</div>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.logistics.analytics.vsLastMonth", { value: 12 })}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.logistics.analytics.onTimeRate")}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round((logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.logistics.analytics.onTimeCount", { onTime: logisticsStats.onTimeDeliveries, total: logisticsStats.completedDeliveries })}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.logistics.analytics.totalDistance")}</CardTitle>
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalDistance} km</div>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.logistics.analytics.thisMonth")}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("admin.logistics.analytics.fuelUsed")}</CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{logisticsStats.totalFuelUsed} L</div>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.logistics.analytics.avgCostPerKm", { value: logisticsStats.costPerKm })}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.logistics.performance.title")}</CardTitle>
                  <CardDescription>{t("admin.logistics.performance.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("admin.logistics.performance.onTimeDelivery")}</span>
                      <span className="text-sm font-medium">{Math.round((logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100)}%</span>
                    </div>
                    <Progress value={(logisticsStats.onTimeDeliveries / logisticsStats.completedDeliveries) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("admin.logistics.performance.customerSatisfaction")}</span>
                      <span className="text-sm font-medium">{logisticsStats.customerSatisfaction}%</span>
                    </div>
                    <Progress value={logisticsStats.customerSatisfaction} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("admin.logistics.performance.temperatureCompliance")}</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("admin.logistics.performance.fleetUtilization")}</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("admin.logistics.performance.avgDeliveryTime")}</span>
                      <span className="text-sm font-medium">{logisticsStats.avgDeliveryTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.logistics.fleetAlerts.title")}</CardTitle>
                  <CardDescription>{t("admin.logistics.fleetAlerts.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.logistics.quickStats.totalFleet")}</span>
                      <span className="text-2xl font-bold">{logisticsStats.totalFleet}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.logistics.fleetAlerts.activeTrucks")}</span>
                      <span className="text-2xl font-bold text-blue-600">{logisticsStats.activeTrucks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.logistics.fleetAlerts.maintenanceAlerts")}</span>
                      <span className="text-2xl font-bold text-red-600">{logisticsStats.maintenanceAlerts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.logistics.fleetAlerts.insuranceExpiring")}</span>
                      <span className="text-2xl font-bold text-yellow-600">{logisticsStats.insuranceExpiring}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span>{t("admin.logistics.fleetAlerts.carbonFootprint", { value: logisticsStats.carbonFootprint })}</span>
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
