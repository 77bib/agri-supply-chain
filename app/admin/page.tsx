"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Package,
  Truck,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Thermometer,
  ShoppingCart,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Dummy data for dashboard
const kpiData = {
  ordersToday: 12,
  ordersChange: 8.2,
  stockLevel: 85,
  stockChange: -2.1,
  delays: 2,
  delaysChange: -50,
  wastage: 3.2,
  wastageChange: -15.3,
}

const demandTrendData = [
  { month: "Jan", demand: 4200, forecast: 4100 },
  { month: "Feb", demand: 3800, forecast: 3900 },
  { month: "Mar", demand: 4500, forecast: 4400 },
  { month: "Apr", demand: 5200, forecast: 5100 },
  { month: "May", demand: 5800, forecast: 5900 },
  { month: "Jun", demand: 6200, forecast: 6100 },
]

const categoryData = [
  { name: "Juices", value: 45, color: "#10b981" },
  { name: "Jams", value: 35, color: "#f59e0b" },
  { name: "Compotes", value: 20, color: "#8b5cf6" },
]

const truckLocations = [
  {
    id: "TR-001",
    location: "Highway 101, Mile 45",
    temperature: 4.2,
    status: "optimal",
    eta: "2:30 PM",
    route: "Green Valley → Factory",
  },
  {
    id: "TR-002",
    location: "Farm Pickup Point",
    temperature: 3.8,
    status: "optimal",
    eta: "4:15 PM",
    route: "Berry Fresh → Factory",
  },
  {
    id: "TR-003",
    location: "Distribution Center",
    temperature: 5.1,
    status: "warning",
    eta: "1:45 PM",
    route: "Factory → Store",
  },
]

const recentAlerts = [
  {
    id: 1,
    type: "warning",
    message: "Truck TR-003 temperature above optimal range",
    time: "5 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    type: "info",
    message: "New batch of strawberries ready for processing",
    time: "15 minutes ago",
    priority: "medium",
  },
  {
    id: 3,
    type: "success",
    message: "Delivery TR-001 completed successfully",
    time: "1 hour ago",
    priority: "low",
  },
]

const recentOrders = [
  { id: "ORD-012", customer: "Fresh Market", items: 5, total: 124.5, status: "processing" },
  { id: "ORD-011", customer: "Green Grocery", items: 3, total: 89.25, status: "shipped" },
  { id: "ORD-010", customer: "City Supermarket", items: 8, total: 245.75, status: "delivered" },
]

export default function AdminDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimal":
        return <Badge className="bg-green-100 text-green-800">Optimal</Badge>
      case "warning":
        return <Badge variant="destructive">Warning</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your supply chain.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Report</Button>
            <Button>Refresh Data</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.ordersToday}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{kpiData.ordersChange}%</span> from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Level</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.stockLevel}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{kpiData.stockChange}%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Delays</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.delays}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpiData.delaysChange}%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wastage Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.wastage}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpiData.wastageChange}%</span> improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Demand Trend</CardTitle>
              <CardDescription>Monthly demand vs forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={demandTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={2} name="Actual Demand" />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by product type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Truck Locations and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Truck Locations</CardTitle>
              <CardDescription>Real-time tracking of delivery vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {truckLocations.map((truck) => (
                  <Card key={truck.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{truck.id}</span>
                      </div>
                      {getStatusBadge(truck.status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{truck.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        <span>{truck.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route: {truck.route}</span>
                        <span className="font-medium">ETA: {truck.eta}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <Badge
                          variant={
                            alert.priority === "high"
                              ? "destructive"
                              : alert.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-sm">
                      <p>{order.items} items</p>
                      <p className="font-medium">${order.total}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.status)}
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
