"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Truck, Thermometer, MapPin, Package, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy data
const stockData = [
  { name: "Apples", current: 850, target: 1000, unit: "kg" },
  { name: "Oranges", current: 650, target: 800, unit: "kg" },
  { name: "Strawberries", current: 200, target: 300, unit: "kg" },
  { name: "Peaches", current: 400, target: 500, unit: "kg" },
]

const iotData = [
  { id: "TR001", location: "En route to Factory", temp: 4.2, status: "optimal", driver: "John Doe" },
  { id: "TR002", location: "Farm Pickup", temp: 3.8, status: "optimal", driver: "Jane Smith" },
  { id: "TR003", location: "Warehouse", temp: 5.1, status: "warning", driver: "Mike Johnson" },
]

const salesData = [
  { month: "Jan", juices: 4000, jams: 2400, compotes: 2400 },
  { month: "Feb", juices: 3000, jams: 1398, compotes: 2210 },
  { month: "Mar", juices: 2000, jams: 9800, compotes: 2290 },
  { month: "Apr", juices: 2780, jams: 3908, compotes: 2000 },
  { month: "May", juices: 1890, jams: 4800, compotes: 2181 },
  { month: "Jun", juices: 2390, jams: 3800, compotes: 2500 },
]

const wasteData = [
  { name: "Saved", value: 75, color: "#10b981" },
  { name: "Wasted", value: 25, color: "#ef4444" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring and analytics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Report</Button>
            <Button>Refresh Data</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">3</span> arriving today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-5%</span> this quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="iot">IoT Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="juices" stackId="1" stroke="#10b981" fill="#10b981" />
                        <Area type="monotone" dataKey="jams" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                        <Area type="monotone" dataKey="compotes" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Waste Reduction</CardTitle>
                  <CardDescription>Current waste vs saved produce</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {wasteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Saved (75%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Wasted (25%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest supply chain events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Delivery TR001 completed successfully</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Temperature alert for truck TR003</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                    <Badge variant="outline">Warning</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New batch of strawberries received</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                    <Badge variant="secondary">Received</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Material Stock Levels</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stockData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">
                          {item.current}/{item.target} {item.unit}
                        </span>
                      </div>
                      <Progress value={(item.current / item.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round((item.current / item.target) * 100)}% of target</span>
                        <span className={item.current < item.target * 0.3 ? "text-red-600" : "text-green-600"}>
                          {item.current < item.target * 0.3 ? "Low Stock" : "Good Stock"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live IoT Monitoring</CardTitle>
                <CardDescription>Real-time truck and temperature monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {iotData.map((truck) => (
                    <Card key={truck.id} className="p-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{truck.id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{truck.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{truck.temp}°C</span>
                          </div>
                          <Badge variant={truck.status === "optimal" ? "secondary" : "destructive"}>
                            {truck.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Driver: {truck.driver}</div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demand Forecasting</CardTitle>
                <CardDescription>Predicted demand for next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ minHeight: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="juices" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="jams" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="compotes" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
