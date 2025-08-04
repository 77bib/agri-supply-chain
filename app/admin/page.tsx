"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Users,
  Mail,
  Calendar,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  TrendingUp,
  Activity,
  Database,
  Shield,
  Bell,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  UserPlus,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Globe,
  Wifi,
  Battery,
  Signal,
  Lock,
  Unlock,
  Key,
  CreditCard,
  Truck as TruckIcon,
  Warehouse,
  Factory,
  Leaf,
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
  Hash as HashIcon,
  Hash as HashIcon2,
  Hash as HashIcon3,
  Hash as HashIcon4,
  Hash as HashIcon5,
  Hash as HashIcon6,
  Hash as HashIcon7,
  Hash as HashIcon8,
  Hash as HashIcon9,
  Hash as HashIcon10,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { usersAPI, User } from "@/lib/api-service"
import { getAllOrders } from "@/lib/order-service"
import { toast } from "sonner"

// Real data fetching functions
const fetchDashboardData = async () => {
  try {
    // Fetch all data in parallel
    const [usersResponse, ordersResponse] = await Promise.all([
      usersAPI.getAll(),
      getAllOrders()
    ])

    return {
      users: usersResponse.success ? usersResponse.data : [],
      orders: ordersResponse.success ? ordersResponse.data : [],
      stats: ordersResponse.stats || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return { users: [], orders: [], stats: { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0, pendingOrders: 0 } }
  }
}

// Enhanced dashboard data
const getEnhancedKPIs = (users: User[], orders: any[], stats: any) => {
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const regularUsers = users.filter(u => u.role === 'user').length
  const newUsersThisWeek = users.filter(u => {
    const registrationDate = new Date(u.createdAt)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return registrationDate > oneWeekAgo
  }).length

  const totalOrders = stats.totalOrders || 0
  const totalRevenue = stats.totalRevenue || 0
  const averageOrderValue = stats.averageOrderValue || 0
  const pendingOrders = stats.pendingOrders || 0

  // Calculate additional metrics
  const completedOrders = orders.filter(o => o.status === 'delivered').length
  const processingOrders = orders.filter(o => o.status === 'processing').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length

  return {
    totalUsers,
    adminUsers,
    regularUsers,
    newUsersThisWeek,
    totalOrders,
    totalRevenue,
    averageOrderValue,
    pendingOrders,
    completedOrders,
    processingOrders,
    shippedOrders
  }
}

// Enhanced charts data
const getChartData = (orders: any[]) => {
  // Monthly orders data
  const monthlyData = [
    { month: "Jan", orders: 0, revenue: 0 },
    { month: "Feb", orders: 0, revenue: 0 },
    { month: "Mar", orders: 0, revenue: 0 },
    { month: "Apr", orders: 0, revenue: 0 },
    { month: "May", orders: 0, revenue: 0 },
    { month: "Jun", orders: 0, revenue: 0 },
  ]

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt)
    const monthIndex = orderDate.getMonth()
    if (monthIndex < 6) {
      monthlyData[monthIndex].orders += 1
      monthlyData[monthIndex].revenue += order.totalPrice || 0
    }
  })

  // Order status distribution
  const statusData = [
    { name: "Pending", value: orders.filter(o => o.status === 'pending').length, color: "#f59e0b" },
    { name: "Processing", value: orders.filter(o => o.status === 'processing').length, color: "#3b82f6" },
    { name: "Shipped", value: orders.filter(o => o.status === 'shipped').length, color: "#8b5cf6" },
    { name: "Delivered", value: orders.filter(o => o.status === 'delivered').length, color: "#10b981" },
  ]

  return { monthlyData, statusData }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    users: [] as User[],
    orders: [] as any[],
    stats: { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0, pendingOrders: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await fetchDashboardData()
      setDashboardData(data)
      toast.success("Dashboard data refreshed successfully!")
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to refresh dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const kpis = getEnhancedKPIs(dashboardData.users, dashboardData.orders, dashboardData.stats)
  const charts = getChartData(dashboardData.orders)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      : <Badge className="bg-blue-100 text-blue-800">User</Badge>
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleEditUser = (user: User) => {
    toast.info(`Edit user: ${user.name}`)
    // TODO: Implement edit user functionality
  }

  const handleDeleteUser = (user: User) => {
    toast.info(`Delete user: ${user.name}`)
    // TODO: Implement delete user functionality
  }

  const handleExportData = () => {
    toast.info("Exporting dashboard data...")
    // TODO: Implement export functionality
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Comprehensive overview of your supply chain system</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpis.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpis.regularUsers}</span> regular users
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{kpis.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600">Administrators</span> in system
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{kpis.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">${kpis.totalRevenue.toFixed(2)}</span> total revenue
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{kpis.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">Awaiting</span> processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users (Week)</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpis.newUsersThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">New registrations</span> this week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${kpis.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Per order</span> average
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{kpis.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Successfully</span> delivered
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpis.processingOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">Currently</span> processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Monthly Orders & Revenue
              </CardTitle>
              <CardDescription>Orders and revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="Orders" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>Distribution of orders by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {charts.statusData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Users Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  All Users
                </CardTitle>
                <CardDescription>Complete list of registered users with actions</CardDescription>
              </div>
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.users.map((user) => (
                  <Card key={user._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-sm">{user.name}</h3>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Orders Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest customer orders with detailed information</CardDescription>
              </div>
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.orders.slice(0, 10).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.userId?.name || 'Unknown Customer'}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p>{order.quantity} items</p>
                        <p className="font-medium">${order.totalPrice}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{getRoleBadge(selectedUser.role)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">{selectedUser._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined:</span>
                    <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleEditUser(selectedUser)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                  <Button variant="outline" onClick={() => handleDeleteUser(selectedUser)} className="flex-1 text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Order Details Dialog */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Order Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Order #{selectedOrder._id.slice(-8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.userId?.name || 'Unknown Customer'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{selectedOrder.quantity} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="font-semibold">${selectedOrder.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {selectedOrder.shippingInfo && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Shipping Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                      <p><strong>Email:</strong> {selectedOrder.shippingInfo.email}</p>
                      <p><strong>Phone:</strong> {selectedOrder.shippingInfo.phone}</p>
                      <p><strong>Address:</strong> {selectedOrder.shippingInfo.address}</p>
                      <p><strong>City:</strong> {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
