"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter, 
  Eye, 
  Edit,
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Users,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Calendar
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { getAllOrders, updateOrderStatus } from "@/lib/order-service"
import { toast } from "sonner"

interface Order {
  _id: string
  productId?: {
    _id: string
    name: string
    price: number
    image?: string
    category: string
    supplier: string
  }
  userId?: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  quantity: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalPrice: number
  
  // معلومات الشحن
  shippingInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  
  // معلومات الدفع (مشفرة)
  paymentInfo?: {
    cardHolder: string
    cardLastFour: string
    expiryMonth: string
    expiryYear: string
    paymentMethod: string
  }
  
  // معلومات إضافية
  subtotal?: number
  shippingCost?: number
  tax?: number
  total?: number
  
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedUserId, setSelectedUserId] = useState("all")
  const [selectedProductId, setSelectedProductId] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
  ]

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getAllOrders({
        page,
        limit: 20,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        userId: selectedUserId === "all" ? undefined : selectedUserId,
        productId: selectedProductId === "all" ? undefined : selectedProductId,
        sortBy,
        sortOrder
      })
      
      if (response.success) {
        setOrders(response.data)
        setStats(response.stats || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
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
    fetchOrders()
  }, [page, selectedStatus, selectedUserId, selectedProductId, sortBy, sortOrder])

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      const response = await updateOrderStatus(selectedOrder._id, { status: newStatus as any })
      if (response.success) {
        toast.success("Order status updated successfully")
        setIsStatusDialogOpen(false)
        setSelectedOrder(null)
        setNewStatus("")
        fetchOrders()
      } else {
        toast.error(response.message || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Error updating order status")
    }
  }

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

  // Open status update dialog
  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsStatusDialogOpen(true)
  }

  // Get unique users and products for filters
  const uniqueUsers = Array.from(new Set(orders.map(order => order.userId?._id).filter(Boolean)))
  const uniqueProducts = Array.from(new Set(orders.map(order => order.productId?._id).filter(Boolean)))

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground">Manage customer orders and track their status</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchOrders} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
                  </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time revenue</p>
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
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

            {/* Filters */}
            <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
                    <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                  placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                      />
                    </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
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
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueUsers.map((userId) => {
                    const order = orders.find(o => o.userId?._id === userId)
                    return (
                      <SelectItem key={userId} value={userId}>
                        {order?.userId?.name || userId.slice(-8)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Product" />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map((productId) => {
                    const order = orders.find(o => o.productId?._id === productId)
                    return (
                      <SelectItem key={productId} value={productId}>
                        {order?.productId?.name || productId.slice(-8)}
                      </SelectItem>
                    )
                  })}
                      </SelectContent>
                    </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="totalPrice">Order Value</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
              <Card>
                <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders and their status</CardDescription>
                </CardHeader>
          <CardContent>
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
                        <p className="text-sm text-muted-foreground">
                          Customer: {order.userId?.name || 'Unknown'} ({order.userId?.email || 'No email'})
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{order.productId?.category || 'Unknown'}</Badge>
                          <Badge variant="outline">{order.productId?.supplier || 'Unknown'}</Badge>
                          <Badge variant="outline">Qty: {order.quantity}</Badge>
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
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openStatusDialog(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders found</p>
                    </div>
                  )}
                    </div>
                  )}
                </CardContent>
              </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
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

      {/* Enhanced Order Details Dialog */}
      <Dialog open={!!selectedOrder && !isStatusDialogOpen} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Order Details - #{selectedOrder?._id.slice(-8)}
            </DialogTitle>
            <DialogDescription>
              Complete order information and customer details
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {selectedOrder.productId?.image ? (
                      <img src={selectedOrder.productId.image} alt={selectedOrder.productId?.name || 'Product'} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedOrder.productId?.name || 'Product Not Found'}</h3>
                    <p className="text-sm text-muted-foreground">Order #{selectedOrder._id.slice(-8)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${selectedOrder.totalPrice.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Product Name:</span>
                        <span>{selectedOrder.productId?.name || 'Product Not Found'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <Badge variant="outline">{selectedOrder.productId?.category || 'Unknown'}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Supplier:</span>
                        <span>{selectedOrder.productId?.supplier || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Unit Price:</span>
                        <span>${(selectedOrder.totalPrice / selectedOrder.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Quantity:</span>
                        <Badge variant="secondary">{selectedOrder.quantity} items</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal:</span>
                        <span>${selectedOrder.subtotal?.toFixed(2) || selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Shipping Cost:</span>
                        <span>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tax:</span>
                        <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Customer Name:</span>
                        <span className="font-semibold">{selectedOrder.userId?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email Address:</span>
                        <span className="text-blue-600">{selectedOrder.userId?.email || 'No email'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone Number:</span>
                        <span>{selectedOrder.userId?.phone || 'No phone'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Customer ID:</span>
                        <span className="font-mono text-xs">{selectedOrder.userId?._id || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Order Date:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Order Time:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last Updated:</span>
                        <span>{new Date(selectedOrder.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span className="font-mono text-xs">{selectedOrder._id}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {selectedOrder.shippingInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-purple-600" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Full Name:</span>
                          <span className="font-semibold">{selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span className="text-blue-600">{selectedOrder.shippingInfo.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Phone:</span>
                          <span>{selectedOrder.shippingInfo.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Country:</span>
                          <Badge variant="outline">{selectedOrder.shippingInfo.country}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">City:</span>
                          <span>{selectedOrder.shippingInfo.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">State/Province:</span>
                          <span>{selectedOrder.shippingInfo.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">ZIP/Postal Code:</span>
                          <span>{selectedOrder.shippingInfo.zipCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Address:</span>
                          <span className="text-right max-w-xs">{selectedOrder.shippingInfo.address}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              {selectedOrder.paymentInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Card Holder:</span>
                          <span className="font-semibold">{selectedOrder.paymentInfo.cardHolder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Card Number:</span>
                          <span className="font-mono">**** **** **** {selectedOrder.paymentInfo.cardLastFour}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Expiry Date:</span>
                          <span>{selectedOrder.paymentInfo.expiryMonth}/{selectedOrder.paymentInfo.expiryYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Payment Method:</span>
                          <Badge variant="outline">{selectedOrder.paymentInfo.paymentMethod}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Created</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Order Confirmed</div>
                          <div className="text-sm text-muted-foreground">
                            Order was confirmed and is being processed
                          </div>
                        </div>
                      </div>
                    )}
                    {['shipped', 'delivered'].includes(selectedOrder.status) && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Order Shipped</div>
                          <div className="text-sm text-muted-foreground">
                            Order has been shipped to customer
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Order Delivered</div>
                          <div className="text-sm text-muted-foreground">
                            Order has been successfully delivered
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Order Cancelled</div>
                          <div className="text-sm text-muted-foreground">
                            Order has been cancelled
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setSelectedOrder(null)
                openStatusDialog(selectedOrder!)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the status for order #{selectedOrder?._id.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Status</label>
              <div className="flex items-center space-x-2 mt-1">
                {selectedOrder && getStatusIcon(selectedOrder.status)}
                {selectedOrder && getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedOrder && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Order Details</h4>
                <div className="text-sm space-y-1">
                  <div>Product: {selectedOrder.productId?.name || 'Product Not Found'}</div>
                  <div>Customer: {selectedOrder.userId?.name || 'Unknown'}</div>
                  <div>Quantity: {selectedOrder.quantity}</div>
                  <div>Total: ${selectedOrder.totalPrice.toFixed(2)}</div>
                  <div>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )}
      </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={!newStatus || newStatus === selectedOrder?.status}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
