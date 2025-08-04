"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingCart, 
  Search, 
  Package, 
  DollarSign, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Calendar,
  User
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { getMyOrders } from "@/lib/order-service"
import { toast } from "sonner"

interface Order {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    image?: string
    category: string
    supplier: string
  }
  quantity: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalPrice: number
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  pendingOrders: number
}

export default function DashboardPage() {
  const { currentUser } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
  ]

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getMyOrders({
        page,
        limit: 10,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        sortBy,
        sortOrder
      })
      
      if (response.success) {
        setOrders(response.data)
        setStats(response.stats || {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          pendingOrders: 0
        })
        setTotalPages(response.pagination?.pages || 1)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser, page, selectedStatus, sortBy, sortOrder])

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    if (statusOption) {
      return <Badge className={statusOption.color}>{statusOption.label}</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard</p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time spending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Track your order history and status</CardDescription>
              </div>
              <Button variant="outline" onClick={fetchOrders} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Ordered</SelectItem>
                  <SelectItem value="totalPrice">Order Value</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {order.productId.image ? (
                          <img src={order.productId.image} alt={order.productId.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.productId.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {order.quantity} • {order.productId.category}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{order.productId.supplier}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">${order.totalPrice.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders found</p>
                    <Button asChild className="mt-4">
                      <a href="/products">Browse Products</a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(page + 1)} 
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20">
              <a href="/products">
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <span>Browse Products</span>
                </div>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-20">
              <a href="/contact">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2" />
                  <span>Contact Support</span>
                </div>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-20">
              <a href="/trace">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2" />
                  <span>Track Orders</span>
                </div>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
