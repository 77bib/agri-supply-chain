"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Leaf, Calendar, Thermometer, Droplets, Sun, Package, TrendingUp } from "lucide-react"
import Link from "next/link"

// Dummy farmer data
const farmerProfile = {
  name: "Green Valley Farm",
  owner: "Maria Rodriguez",
  location: "California, USA",
  farmSize: "150 acres",
  established: "1995",
  certifications: ["Organic", "Fair Trade", "Sustainable"],
}

const crops = [
  {
    id: 1,
    name: "Oranges",
    planted: "2023-03-15",
    expectedHarvest: "2024-02-15",
    status: "growing",
    progress: 85,
    acres: 50,
  },
  {
    id: 2,
    name: "Lemons",
    planted: "2023-04-01",
    expectedHarvest: "2024-03-01",
    status: "growing",
    progress: 78,
    acres: 30,
  },
  {
    id: 3,
    name: "Apples",
    planted: "2023-02-20",
    expectedHarvest: "2024-01-20",
    status: "ready",
    progress: 100,
    acres: 40,
  },
  {
    id: 4,
    name: "Peaches",
    planted: "2023-03-10",
    expectedHarvest: "2024-02-10",
    status: "harvesting",
    progress: 95,
    acres: 30,
  },
]

const deliveries = [
  {
    id: 1,
    product: "Oranges",
    quantity: 500,
    unit: "kg",
    destination: "FreshChain Factory",
    status: "delivered",
    date: "2024-01-20",
    driver: "John Smith",
  },
  {
    id: 2,
    product: "Apples",
    quantity: 300,
    unit: "kg",
    destination: "FreshChain Factory",
    status: "in-transit",
    date: "2024-01-21",
    driver: "Mike Johnson",
  },
  {
    id: 3,
    product: "Peaches",
    quantity: 200,
    unit: "kg",
    destination: "FreshChain Factory",
    status: "scheduled",
    date: "2024-01-22",
    driver: "TBD",
  },
]

const weatherData = {
  temperature: 22,
  humidity: 65,
  rainfall: 12,
  sunshine: 8.5,
}

export default function FarmerPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "growing":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Growing
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Ready
          </Badge>
        )
      case "harvesting":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Harvesting
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
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Farmer Portal</span>
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
        {/* Farm Profile */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{farmerProfile.name}</CardTitle>
                <CardDescription>Owner: {farmerProfile.owner}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {farmerProfile.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{farmerProfile.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Farm Size:</span>
                <p className="font-medium">{farmerProfile.farmSize}</p>
              </div>
              <div>
                <span className="text-gray-600">Established:</span>
                <p className="font-medium">{farmerProfile.established}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Crops:</span>
                <p className="font-medium">{crops.length} varieties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather & Farm Conditions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
              <p className="text-xs text-muted-foreground">Optimal for growth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weatherData.humidity}%</div>
              <p className="text-xs text-muted-foreground">Good moisture level</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rainfall</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weatherData.rainfall}mm</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sunshine</CardTitle>
              <Sun className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weatherData.sunshine}h</div>
              <p className="text-xs text-muted-foreground">Daily average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="crops" className="space-y-4">
          <TabsList>
            <TabsTrigger value="crops">My Crops</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crop Management</CardTitle>
                <CardDescription>Monitor your crop growth and harvest schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {crops.map((crop) => (
                    <Card key={crop.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{crop.name}</h3>
                          <p className="text-sm text-gray-600">{crop.acres} acres</p>
                        </div>
                        {getStatusBadge(crop.status)}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Planted:</span>
                          <p className="font-medium">{crop.planted}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Expected Harvest:</span>
                          <p className="font-medium">{crop.expectedHarvest}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Growth Progress:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={crop.progress} className="flex-1" />
                            <span className="text-sm font-medium">{crop.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Harvest
                        </Button>
                        <Button size="sm" variant="outline">
                          <Package className="h-4 w-4 mr-1" />
                          Request Pickup
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Schedule</CardTitle>
                <CardDescription>Track your product deliveries to processing facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.product}</TableCell>
                        <TableCell>
                          {delivery.quantity} {delivery.unit}
                        </TableCell>
                        <TableCell>{delivery.destination}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.driver}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
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
                  <CardTitle>Yield Performance</CardTitle>
                  <CardDescription>Crop yield comparison over seasons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Oranges</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">+15%</span>
                      </div>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Apples</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">+8%</span>
                      </div>
                    </div>
                    <Progress value={78} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Peaches</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">+12%</span>
                      </div>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                  <CardDescription>Product quality scores from buyers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Freshness</span>
                      <span className="text-sm font-bold">9.2/10</span>
                    </div>
                    <Progress value={92} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Size Consistency</span>
                      <span className="text-sm font-bold">8.8/10</span>
                    </div>
                    <Progress value={88} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Organic Compliance</span>
                      <span className="text-sm font-bold">10/10</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
