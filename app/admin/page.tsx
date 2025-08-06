"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import {
  Truck,
  Users,
  Package,
  TrendingUp,
  Shield,
  MapPin,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  Leaf,
  Warehouse,
  Factory,
  Globe,
  Wifi,
  Battery,
  Signal,
  Lock,
  Unlock,
  Key,
  CreditCard,
  Truck as TruckIcon,
  Sun,
  Cloud,
  Rain,
  Wind,
  ThermometerSunny,
  Droplets,
  Gauge,
  Timer,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Phone,
  Map,
  Navigation,
  Compass,
  Flag,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Coins,
  Wallet,
  PiggyBank,
  Banknote,
  Receipt,
  Calculator,
  Percent,
  Hash,
  Target,
  Zap,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { toast } from "sonner"

// Mock data for demonstration
const mockData = {
  farmers: {
    total: 156,
    active: 142,
    newThisMonth: 12,
    averageYield: 85.6,
    topPerformers: [
      { name: "Ahmed Benali", farm: "Green Valley", yield: 95.2, quality: 92 },
      { name: "Fatima Zohra", farm: "Sunrise Farm", yield: 93.8, quality: 89 },
      { name: "Mohammed Kaci", farm: "Golden Fields", yield: 91.5, quality: 94 },
    ]
  },
  logistics: {
    activeShipments: 23,
    deliveredToday: 8,
    delayed: 3,
    totalVehicles: 45,
    alerts: [
      { type: "temperature", severity: "high", message: "Temp deviation in Truck-023" },
      { type: "delay", severity: "medium", message: "Delivery delayed by 2 hours" },
    ]
  },
  inventory: {
    totalBatches: 89,
    lowStock: 12,
    expiringSoon: 8,
    totalValue: 1250000,
    categories: [
      { name: "Grains", quantity: 45, value: 450000 },
      { name: "Vegetables", quantity: 23, value: 320000 },
      { name: "Fruits", quantity: 21, value: 480000 },
    ]
  },
  forecasts: {
    accuracy: 87.3,
    demandTrend: "increasing",
    nextMonthPrediction: 1250000,
    recommendations: [
      "Increase wheat production by 15%",
      "Optimize storage for seasonal crops",
      "Prepare for Ramadan demand spike",
    ]
  },
  traceability: {
    activeProducts: 234,
    verifiedToday: 45,
    blockchainTransactions: 1234,
    qrScans: 567,
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Dashboard data refreshed successfully!")
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      delayed: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800"
    }
    return <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    }
    return <Badge className={variants[severity as keyof typeof variants] || "bg-gray-100 text-gray-800"}>{severity}</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              BIFA Algeria - Supply Chain Dashboard
            </h1>
            <p className="text-muted-foreground">Comprehensive agricultural supply chain management system</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="traceability">Traceability</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockData.farmers.active}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{mockData.farmers.newThisMonth}</span> new this month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                  <Truck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{mockData.logistics.activeShipments}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600">{mockData.logistics.delayed}</span> delayed
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">${(mockData.inventory.totalValue / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-orange-600">{mockData.inventory.lowStock}</span> low stock alerts
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{mockData.forecasts.accuracy}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{mockData.forecasts.demandTrend}</span> trend
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Monthly Production Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { month: "Jan", production: 1200, target: 1000 },
                      { month: "Feb", production: 1350, target: 1100 },
                      { month: "Mar", production: 1100, target: 1200 },
                      { month: "Apr", production: 1400, target: 1300 },
                      { month: "May", production: 1600, target: 1400 },
                      { month: "Jun", production: 1800, target: 1500 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="production" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="target" stroke="#6b7280" fill="#6b7280" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Product Categories Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockData.inventory.categories.map(cat => ({
                          name: cat.name,
                          value: cat.quantity,
                          color: cat.name === "Grains" ? "#10b981" : cat.name === "Vegetables" ? "#3b82f6" : "#f59e0b"
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mockData.inventory.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Grains" ? "#10b981" : entry.name === "Vegetables" ? "#3b82f6" : "#f59e0b"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.logistics.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">Logistics Alert</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSeverityBadge(alert.severity)}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Farmers Management
                    </CardTitle>
                    <CardDescription>Manage farmer profiles, performance, and certifications</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Farmer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockData.farmers.topPerformers.map((farmer, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{farmer.name}</h3>
                          <p className="text-sm text-muted-foreground">{farmer.farm}</p>
                        </div>
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Yield:</span>
                          <span className="font-medium">{farmer.yield}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quality:</span>
                          <span className="font-medium">{farmer.quality}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Transport & Logistics
                    </CardTitle>
                    <CardDescription>Track shipments, vehicles, and delivery status</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Active Shipments</h3>
                        <p className="text-2xl font-bold text-blue-600">{mockData.logistics.activeShipments}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Delivered Today:</span>
                        <span className="font-medium text-green-600">{mockData.logistics.deliveredToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delayed:</span>
                        <span className="font-medium text-red-600">{mockData.logistics.delayed}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Fleet Status</h3>
                        <p className="text-2xl font-bold text-green-600">{mockData.logistics.totalVehicles}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className="font-medium text-green-600">32</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Transit:</span>
                        <span className="font-medium text-blue-600">13</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-orange-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Thermometer className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">Cold Chain</h3>
                        <p className="text-2xl font-bold text-orange-600">98.5%</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Compliance:</span>
                        <span className="font-medium text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alerts:</span>
                        <span className="font-medium text-red-600">2</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      Inventory & Batch Management
                    </CardTitle>
                    <CardDescription>Track inventory levels, batch quality, and storage conditions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Batch
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Warehouse className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Total Batches</h3>
                        <p className="text-2xl font-bold text-purple-600">{mockData.inventory.totalBatches}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold">Low Stock</h3>
                        <p className="text-2xl font-bold text-red-600">{mockData.inventory.lowStock}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">Expiring Soon</h3>
                        <p className="text-2xl font-bold text-orange-600">{mockData.inventory.expiringSoon}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Total Value</h3>
                        <p className="text-2xl font-bold text-green-600">${(mockData.inventory.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Predictive Analytics & Forecasting
                    </CardTitle>
                    <CardDescription>Demand forecasting and production planning</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Forecast
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Forecast Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">{mockData.forecasts.accuracy}%</div>
                        <p className="text-muted-foreground">Overall accuracy rate</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Next Month Prediction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">${(mockData.forecasts.nextMonthPrediction / 1000000).toFixed(1)}M</div>
                        <p className="text-muted-foreground">Expected revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockData.forecasts.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traceability Tab */}
          <TabsContent value="traceability" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Blockchain Traceability
                    </CardTitle>
                    <CardDescription>Product journey tracking and verification</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Package className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Active Products</h3>
                        <p className="text-2xl font-bold text-green-600">{mockData.traceability.activeProducts}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Verified Today</h3>
                        <p className="text-2xl font-bold text-blue-600">{mockData.traceability.verifiedToday}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Hash className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Blockchain TX</h3>
                        <p className="text-2xl font-bold text-purple-600">{mockData.traceability.blockchainTransactions}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <QrCode className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">QR Scans</h3>
                        <p className="text-2xl font-bold text-orange-600">{mockData.traceability.qrScans}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

// QrCode component for traceability
const QrCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)
