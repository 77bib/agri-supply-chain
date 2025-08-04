"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock,
  RefreshCw,
  ShoppingBag
} from "lucide-react"
import { useStore } from "@/lib/store"
import { getMyOrders } from "@/lib/order-service"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

interface Order {
  _id: string
  productId?: {
    _id: string
    name: string
    price: number
    image?: string
  }
  quantity: number
  totalPrice: number
  status: string
  createdAt: string
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
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your orders and manage your account</p>
          </div>

          {/* Welcome Section */}
          {currentUser && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Welcome back, {currentUser.name}!</h2>
                    <p className="text-gray-600">Here's what's happening with your orders</p>
                  </div>
                  <Button variant="outline" onClick={fetchOrders} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
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
                <p className="text-xs text-muted-foreground">Total amount spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date</SelectItem>
                    <SelectItem value="totalPrice">Amount</SelectItem>
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
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card>
            <CardContent className="pt-6">
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
                          {order.productId?.image ? (
                            <img src={order.productId.image} alt={order.productId?.name || 'Product'} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{order.productId?.name || 'Product Not Found'}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                          <p className="text-sm text-muted-foreground">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${order.totalPrice.toFixed(2)}</div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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
        </div>
      </div>
    </AuthGuard>
  )
}
