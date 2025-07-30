"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Truck,
  Thermometer,
  MapPin,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const temperatureData = [
  { time: "00:00", temp: 4.2, humidity: 65 },
  { time: "02:00", temp: 4.1, humidity: 66 },
  { time: "04:00", temp: 4.3, humidity: 64 },
  { time: "06:00", temp: 4.0, humidity: 67 },
  { time: "08:00", temp: 4.2, humidity: 65 },
  { time: "10:00", temp: 4.4, humidity: 63 },
  { time: "12:00", temp: 4.1, humidity: 66 },
]

const truckData = [
  {
    id: "TR-001",
    driver: "John Smith",
    route: "Green Valley Farm → Processing Center",
    location: "Highway 101, Mile 45",
    temperature: 4.2,
    humidity: 65,
    battery: 85,
    signal: "Strong",
    status: "optimal",
    eta: "2:30 PM",
    cargo: "Fresh Oranges - 500kg",
    lastUpdate: "2 minutes ago",
  },
  {
    id: "TR-002",
    driver: "Sarah Johnson",
    route: "Berry Fresh Co → Distribution Center",
    location: "Farm Pickup Point",
    temperature: 3.8,
    humidity: 70,
    battery: 92,
    signal: "Strong",
    status: "optimal",
    eta: "4:15 PM",
    cargo: "Mixed Berries - 300kg",
    lastUpdate: "5 minutes ago",
  },
  {
    id: "TR-003",
    driver: "Mike Davis",
    route: "Processing Center → Retail Store",
    location: "Distribution Center",
    temperature: 5.1,
    humidity: 68,
    battery: 78,
    signal: "Weak",
    status: "warning",
    eta: "1:45 PM",
    cargo: "Processed Juices - 200 units",
    lastUpdate: "1 minute ago",
  },
]

export default function IoTMonitoringPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSignalStrength = (signal: string) => {
    switch (signal) {
      case "Strong":
        return 100
      case "Medium":
        return 60
      case "Weak":
        return 30
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Truck className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IoT Monitoring System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time tracking and monitoring of our delivery fleet with advanced IoT sensors for temperature, location,
            and cargo condition monitoring throughout the supply chain.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Thermometer className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Temperature Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Continuous temperature monitoring ensures cold chain integrity from farm to consumer, preventing
                spoilage and maintaining product quality.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>GPS Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Real-time location tracking with route optimization and delivery time predictions for improved logistics
                efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Activity className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Live Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Advanced analytics and alerts for proactive issue detection and resolution, reducing waste and improving
                delivery success rates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Live Fleet Dashboard
            </CardTitle>
            <CardDescription>Real-time monitoring of all active delivery vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
                <TabsTrigger value="analytics">Temperature Analytics</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6">
                  {truckData.map((truck) => (
                    <Card key={truck.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Truck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{truck.id}</h3>
                            <p className="text-gray-600">Driver: {truck.driver}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(truck.status)}>
                          {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{truck.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Temperature</p>
                            <p className="font-medium">{truck.temperature}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500">Battery</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={truck.battery} className="w-16 h-2" />
                              <span className="text-sm font-medium">{truck.battery}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Wifi className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500">Signal</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={getSignalStrength(truck.signal)} className="w-16 h-2" />
                              <span className="text-sm font-medium">{truck.signal}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Route</p>
                            <p className="font-medium">{truck.route}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cargo</p>
                            <p className="font-medium">{truck.cargo}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">ETA</p>
                            <p className="font-medium">{truck.eta}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-xs text-gray-500">Last update: {truck.lastUpdate}</p>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Trends (Last 12 Hours)</CardTitle>
                    <CardDescription>Temperature and humidity monitoring for optimal cargo conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={temperatureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="temp"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          name="Temperature (°C)"
                        />
                        <Area
                          type="monotone"
                          dataKey="humidity"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                          name="Humidity (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Average Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">4.2°C</div>
                      <p className="text-sm text-gray-500">Optimal range: 2-6°C</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Humidity Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">65%</div>
                      <p className="text-sm text-gray-500">Optimal range: 60-70%</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fleet Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">98.5%</div>
                      <p className="text-sm text-gray-500">On-time delivery rate</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <div className="space-y-4">
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-800">Temperature Warning</h4>
                          <p className="text-yellow-700 text-sm">
                            Truck TR-003 temperature above optimal range (5.1°C)
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">5 minutes ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-800">Delivery Completed</h4>
                          <p className="text-green-700 text-sm">
                            Truck TR-001 successfully delivered cargo to Processing Center
                          </p>
                          <p className="text-xs text-green-600 mt-1">1 hour ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-800">Route Optimization</h4>
                          <p className="text-blue-700 text-sm">
                            New optimal route suggested for TR-002, saving 15 minutes
                          </p>
                          <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Apply Route
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Reduced Spoilage</h4>
                  <p className="text-sm text-gray-600">
                    30% reduction in product waste through optimal temperature control
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Improved Efficiency</h4>
                  <p className="text-sm text-gray-600">25% faster delivery times with route optimization</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Enhanced Quality</h4>
                  <p className="text-sm text-gray-600">Consistent product quality through continuous monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Temperature Range</p>
                  <p className="font-medium">-20°C to +50°C</p>
                </div>
                <div>
                  <p className="text-gray-500">Accuracy</p>
                  <p className="font-medium">±0.1°C</p>
                </div>
                <div>
                  <p className="text-gray-500">GPS Accuracy</p>
                  <p className="font-medium">±3 meters</p>
                </div>
                <div>
                  <p className="text-gray-500">Battery Life</p>
                  <p className="font-medium">7-10 days</p>
                </div>
                <div>
                  <p className="text-gray-500">Data Transmission</p>
                  <p className="font-medium">4G/5G + WiFi</p>
                </div>
                <div>
                  <p className="text-gray-500">Update Frequency</p>
                  <p className="font-medium">Every 30 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Supply Chain?</h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of companies already using our IoT monitoring system to improve efficiency and reduce waste.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
