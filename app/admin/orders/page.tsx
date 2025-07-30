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
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Eye,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Dummy orders data
const orders = [
  {
    id: "ORD-001",
    orderNumber: "2024-0001",
    customer: {
      name: "Fresh Market Co",
      email: "orders@freshmarket.com",
      phone: "+1 555-0101",
      address: "123 Market St, San Francisco, CA 94102",
    },
    orderDate: "2024-01-20",
    requiredDate: "2024-01-25",
    status: "processing",
    priority: "high",
    items: [
      { productId: "OJ-001", name: "Premium Orange Juice", quantity: 50, price: 4.99, total: 249.5 },
      { productId: "SJ-001", name: "Strawberry Jam", quantity: 25, price: 6.5, total: 162.5 },
    ],
    subtotal: 412.0,
    tax: 37.08,
    shipping: 25.0,
    total: 474.08,
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    assignedTruck: "TR-001",
    trackingNumber: "TRK-20240120-001",
    estimatedDelivery: "2024-01-25",
    notes: "Rush order - customer needs by Friday",
  },
  {
    id: "ORD-002",
    orderNumber: "2024-0002",
    customer: {
      name: "Green Grocery Store",
      email: "purchasing@greengrocery.com",
      phone: "+1 555-0102",
      address: "456 Green Ave, Portland, OR 97201",
    },
    orderDate: "2024-01-19",
    requiredDate: "2024-01-24",
    status: "shipped",
    priority: "medium",
    items: [
      { productId: "AC-001", name: "Apple Compote", quantity: 30, price: 5.75, total: 172.5 },
      { productId: "MBJ-001", name: "Mixed Berry Juice", quantity: 20, price: 5.25, total: 105.0 },
    ],
    subtotal: 277.5,
    tax: 24.98,
    shipping: 15.0,
    total: 317.48,
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer",
    assignedTruck: "TR-002",
    trackingNumber: "TRK-20240119-002",
    estimatedDelivery: "2024-01-24",
    notes: "Standard delivery",
  },
  {
    id: "ORD-003",
    orderNumber: "2024-0003",
    customer: {
      name: "City Supermarket",
      email: "orders@citysupermarket.com",
      phone: "+1 555-0103",
      address: "789 City Blvd, Los Angeles, CA 90210",
    },
    orderDate: "2024-01-18",
    requiredDate: "2024-01-23",
    status: "delivered",
    priority: "low",
    items: [
      { productId: "OJ-001", name: "Premium Orange Juice", quantity: 100, price: 4.99, total: 499.0 },
      { productId: "SJ-001", name: "Strawberry Jam", quantity: 50, price: 6.5, total: 325.0 },
      { productId: "AC-001", name: "Apple Compote", quantity: 40, price: 5.75, total: 230.0 },
    ],
    subtotal: 1054.0,
    tax: 94.86,
    shipping: 35.0,
    total: 1183.86,
    paymentStatus: "paid",
    paymentMethod: "Net 30",
    assignedTruck: "TR-003",
    trackingNumber: "TRK-20240118-003",
    estimatedDelivery: "2024-01-23",
    actualDelivery: "2024-01-23",
    notes: "Large bulk order - delivered successfully",
  },
  {
    id: "ORD-004",
    orderNumber: "2024-0004",
    customer: {
      name: "Organic Foods Market",
      email: "orders@organicfoods.com",
      phone: "+1 555-0104",
      address: "321 Organic Way, Seattle, WA 98101",
    },
    orderDate: "2024-01-21",
    requiredDate: "2024-01-26",
    status: "pending",
    priority: "medium",
    items: [
      { productId: "SJ-001", name: "Strawberry Jam", quantity: 75, price: 6.5, total: 487.5 },
      { productId: "MBJ-001", name: "Mixed Berry Juice", quantity: 35, price: 5.25, total: 183.75 },
    ],
    subtotal: 671.25,
    tax: 60.41,
    shipping: 20.0,
    total: 751.66,
    paymentStatus: "pending",
    paymentMethod: "Credit Card",
    assignedTruck: null,
    trackingNumber: null,
    estimatedDelivery: "2024-01-26",
    notes: "Waiting for payment confirmation",
  },
  {
    id: "ORD-005",
    orderNumber: "2024-0005",
    customer: {
      name: "Farm to Table Restaurant",
      email: "orders@farmtotable.com",
      phone: "+1 555-0105",
      address: "555 Farm Rd, Austin, TX 78701",
    },
    orderDate: "2024-01-21",
    requiredDate: "2024-01-24",
    status: "cancelled",
    priority: "high",
    items: [{ productId: "AC-001", name: "Apple Compote", quantity: 15, price: 5.75, total: 86.25 }],
    subtotal: 86.25,
    tax: 7.76,
    shipping: 12.0,
    total: 106.01,
    paymentStatus: "refunded",
    paymentMethod: "Credit Card",
    assignedTruck: null,
    trackingNumber: null,
    estimatedDelivery: null,
    notes: "Cancelled due to supply shortage",
  },
]

const orderStats = {
  totalOrders: 245,
  pendingOrders: 18,
  processingOrders: 12,
  shippedOrders: 8,
  deliveredOrders: 207,
  totalRevenue: 125750.5,
  averageOrderValue: 513.06,
  onTimeDeliveryRate: 94.2,
}

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("orders")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(orders[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getOrderProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 10
      case "processing":
        return 30
      case "shipped":
        return 70
      case "delivered":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
            <p className="text-muted-foreground">Manage customer orders and track deliveries</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Export Orders</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>Add a new customer order to the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input id="customerName" placeholder="Enter customer name" />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input id="customerEmail" type="email" placeholder="customer@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input id="customerPhone" placeholder="+1 555-0123" />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea id="address" placeholder="Enter full delivery address" className="h-20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="requiredDate">Required Date</Label>
                      <Input id="requiredDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Order Items</Label>
                    <div className="space-y-2 mt-2">
                      <div className="grid grid-cols-4 gap-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oj-001">Premium Orange Juice</SelectItem>
                            <SelectItem value="sj-001">Strawberry Jam</SelectItem>
                            <SelectItem value="ac-001">Apple Compote</SelectItem>
                            <SelectItem value="mbj-001">Mixed Berry Juice</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Qty" type="number" />
                        <Input placeholder="Price" type="number" step="0.01" />
                        <Button variant="outline" size="sm">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea id="notes" placeholder="Special instructions or notes" className="h-16" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Create Order</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{orderStats.pendingOrders}</span> pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${orderStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${orderStats.averageOrderValue}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.onTimeDeliveryRate}%</div>
              <p className="text-xs text-muted-foreground">Success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders, customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{order.items.length} items</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            {getStatusBadge(order.status)}
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                        <TableCell>{order.requiredDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
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

          <TabsContent value="details" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                  <CardDescription>Order #{selectedOrder.orderNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Order Date</Label>
                      <p className="font-medium">{selectedOrder.orderDate}</p>
                    </div>
                    <div>
                      <Label>Required Date</Label>
                      <p className="font-medium">{selectedOrder.requiredDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                    </div>
                  </div>
                  <div>
                    <Label>Progress</Label>
                    <div className="space-y-2 mt-1">
                      <Progress value={getOrderProgress(selectedOrder.status)} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {getOrderProgress(selectedOrder.status)}% complete
                      </div>
                    </div>
                  </div>
                  {selectedOrder.assignedTruck && (
                    <div>
                      <Label>Assigned Truck</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{selectedOrder.assignedTruck}</span>
                      </div>
                    </div>
                  )}
                  {selectedOrder.trackingNumber && (
                    <div>
                      <Label>Tracking Number</Label>
                      <p className="font-medium font-mono text-sm">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                  <div>
                    <Label>Notes</Label>
                    <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Delivery and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Customer Name</Label>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm">{selectedOrder.customer.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm">{selectedOrder.customer.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Delivery Address</Label>
                    <p className="text-sm">{selectedOrder.customer.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Method</Label>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <Label>Payment Status</Label>
                      <div className="mt-1">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                    </div>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div>
                      <Label>Estimated Delivery</Label>
                      <p className="font-medium">{selectedOrder.estimatedDelivery}</p>
                    </div>
                  )}
                  {selectedOrder.actualDelivery && (
                    <div>
                      <Label>Actual Delivery</Label>
                      <p className="font-medium text-green-600">{selectedOrder.actualDelivery}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Products and quantities ordered</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.productId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>Order #{selectedOrder.orderNumber} progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      status: "Order Placed",
                      date: selectedOrder.orderDate,
                      time: "10:30 AM",
                      completed: true,
                      description: "Order received and confirmed",
                    },
                    {
                      status: "Payment Processed",
                      date: selectedOrder.orderDate,
                      time: "10:45 AM",
                      completed: selectedOrder.paymentStatus === "paid",
                      description:
                        selectedOrder.paymentStatus === "paid"
                          ? "Payment successfully processed"
                          : "Waiting for payment confirmation",
                    },
                    {
                      status: "Order Processing",
                      date: selectedOrder.orderDate,
                      time: "2:00 PM",
                      completed: ["processing", "shipped", "delivered"].includes(selectedOrder.status),
                      description: "Items prepared and packaged",
                    },
                    {
                      status: "Shipped",
                      date: selectedOrder.status === "shipped" ? selectedOrder.orderDate : null,
                      time: "4:30 PM",
                      completed: ["shipped", "delivered"].includes(selectedOrder.status),
                      description: selectedOrder.assignedTruck
                        ? `Assigned to truck ${selectedOrder.assignedTruck}`
                        : "Waiting for truck assignment",
                    },
                    {
                      status: "Out for Delivery",
                      date: selectedOrder.status === "shipped" ? selectedOrder.estimatedDelivery : null,
                      time: "9:00 AM",
                      completed: selectedOrder.status === "delivered",
                      description: "Package is out for delivery",
                    },
                    {
                      status: "Delivered",
                      date: selectedOrder.actualDelivery,
                      time: selectedOrder.actualDelivery ? "2:15 PM" : null,
                      completed: selectedOrder.status === "delivered",
                      description:
                        selectedOrder.status === "delivered"
                          ? "Successfully delivered to customer"
                          : `Expected delivery: ${selectedOrder.estimatedDelivery}`,
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            step.completed ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
                          }`}
                        >
                          {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        {index < 5 && (
                          <div className={`w-px h-12 mt-2 ${step.completed ? "bg-green-600" : "bg-gray-300"}`}></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? "text-green-600" : "text-gray-600"}`}>
                            {step.status}
                          </h4>
                          {step.date && (
                            <span className="text-sm text-muted-foreground">
                              {step.date} {step.time && `at ${step.time}`}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                  <CardDescription>Current order status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: "Pending", count: orderStats.pendingOrders, color: "bg-gray-500" },
                      { status: "Processing", count: orderStats.processingOrders, color: "bg-blue-500" },
                      { status: "Shipped", count: orderStats.shippedOrders, color: "bg-purple-500" },
                      { status: "Delivered", count: orderStats.deliveredOrders, color: "bg-green-500" },
                    ].map((item) => {
                      const percentage = (item.count / orderStats.totalOrders) * 100
                      return (
                        <div key={item.status} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.status}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.count} orders ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key order fulfillment metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">On-Time Delivery Rate</span>
                      <span className="text-sm font-medium text-green-600">{orderStats.onTimeDeliveryRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Order Value</span>
                      <span className="text-sm font-medium">${orderStats.averageOrderValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Order Fulfillment Time</span>
                      <span className="text-sm font-medium">2.3 days avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium text-green-600">96.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Return Rate</span>
                      <span className="text-sm font-medium">1.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest order updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order #2024-0003 delivered successfully</p>
                      <p className="text-xs text-muted-foreground">City Supermarket - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order #2024-0002 shipped via TR-002</p>
                      <p className="text-xs text-muted-foreground">Green Grocery Store - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order #2024-0001 moved to processing</p>
                      <p className="text-xs text-muted-foreground">Fresh Market Co - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order #2024-0005 cancelled</p>
                      <p className="text-xs text-muted-foreground">Farm to Table Restaurant - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
