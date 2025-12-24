"use client"

import { useState, useEffect, useMemo } from "react"
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
import { useI18n } from "@/lib/i18n"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

const STATUS_BASE_OPTIONS = [
  { value: "pending", color: "bg-yellow-100 text-yellow-800", labelKey: "admin.orders.status.pending" as const },
  { value: "confirmed", color: "bg-blue-100 text-blue-800", labelKey: "admin.orders.status.confirmed" as const },
  { value: "shipped", color: "bg-purple-100 text-purple-800", labelKey: "admin.orders.status.shipped" as const },
  { value: "delivered", color: "bg-green-100 text-green-800", labelKey: "admin.orders.status.delivered" as const },
  { value: "cancelled", color: "bg-red-100 text-red-800", labelKey: "admin.orders.status.cancelled" as const },
] as const

type StatusOption = {
  value: typeof STATUS_BASE_OPTIONS[number]["value"]
  color: typeof STATUS_BASE_OPTIONS[number]["color"]
  label: string
}

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
  
  // Informations d'expédition
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
  
  // Informations de paiement (chiffrées)
  paymentInfo?: {
    cardHolder: string
    cardLastFour: string
    expiryMonth: string
    expiryYear: string
    paymentMethod: string
  }
  
  // Informations supplémentaires
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
  const { t } = useI18n()
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

  const statusOptions: StatusOption[] = useMemo(
    () =>
      STATUS_BASE_OPTIONS.map((option) => ({
        value: option.value,
        color: option.color,
        label: t(option.labelKey),
      })),
    [t]
  )

  // Récupérer les commandes
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
        toast.error(t("admin.orders.toast.fetchFailed"))
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error)
      toast.error(t("admin.orders.toast.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, selectedStatus, selectedUserId, selectedProductId, sortBy, sortOrder])

  // Gestion de la mise à jour du statut
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      const response = await updateOrderStatus(selectedOrder._id, { status: newStatus as any })
      if (response.success) {
        toast.success(t("admin.orders.toast.updateSuccess"))
        setIsStatusDialogOpen(false)
        setSelectedOrder(null)
        setNewStatus("")
        fetchOrders()
      } else {
        toast.error(response.message || t("admin.orders.toast.updateFailed"))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error)
      toast.error(t("admin.orders.toast.updateError"))
    }
  }

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    if (statusOption) {
      return <Badge className={statusOption.color}>{statusOption.label}</Badge>
    }
    return <Badge variant="outline">{t("admin.orders.status.generic", { status })}</Badge>
  }

  // Obtenir l'icône de statut
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

  // Ouvrir le dialogue de mise à jour du statut
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
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("admin.orders.title")}</h1>
            <p className="text-muted-foreground">{t("admin.orders.subtitle")}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchOrders} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t("admin.common.refresh")}
                  </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.orders.stats.total")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{t("admin.orders.stats.total.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.orders.stats.revenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} DA</div>
              <p className="text-xs text-muted-foreground">{t("admin.orders.stats.revenue.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.orders.stats.average")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)} DA</div>
              <p className="text-xs text-muted-foreground">{t("admin.orders.stats.average.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.orders.stats.pending")}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.orders.stats.pending.desc")}</p>
            </CardContent>
          </Card>
        </div>

            {/* Filtres */}
            <Card>
          <CardHeader>
            <CardTitle>{t("admin.common.filtersSearch")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
                    <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                  placeholder={t("admin.orders.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                      />
                    </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.orders.filter.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.common.allStatuses")}</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.orders.filter.customer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.common.allCustomers")}</SelectItem>
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
                  <SelectValue placeholder={t("admin.orders.filter.product")} />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="all">{t("admin.orders.filter.allProducts")}</SelectItem>
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
                  <SelectValue placeholder={t("admin.common.sortBy")} />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="createdAt">{t("admin.common.sort.createdAt")}</SelectItem>
                  <SelectItem value="totalPrice">{t("admin.orders.sort.totalPrice")}</SelectItem>
                  <SelectItem value="status">{t("admin.orders.sort.status")}</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
              <Card>
                <CardHeader>
            <CardTitle>{t("admin.orders.table.title")}</CardTitle>
            <CardDescription>{t("admin.orders.table.subtitle")}</CardDescription>
                </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t("admin.orders.loading")}</p>
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
                        <h3 className="font-semibold">{order.productId?.name || t("admin.orders.productNotFound")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("admin.orders.customerLabel")}: {order.userId?.name || t("admin.common.unknown")} ({order.userId?.email || t("admin.common.noEmail")})
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{order.productId?.category || t("admin.common.unknown")}</Badge>
                          <Badge variant="outline">{order.productId?.supplier || t("admin.common.unknown")}</Badge>
                          <Badge variant="outline">{t("admin.orders.qtyLabel")}: {order.quantity}</Badge>
                  </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(order.totalPrice)}</div>
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
                    <p className="text-muted-foreground">{t("admin.orders.empty")}</p>
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
              {t("admin.orders.pagination.previous")}
            </Button>
            <span className="flex items-center px-4">
              {t("admin.orders.pagination.label", { page, total: totalPages })}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
            >
              {t("admin.orders.pagination.next")}
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
              {t("admin.orders.dialog.details.title", { id: selectedOrder ? selectedOrder._id.slice(-8) : "" })}
            </DialogTitle>
            <DialogDescription>
              {t("admin.orders.dialog.details.description")}
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
                    <h3 className="text-lg font-semibold">{selectedOrder.productId?.name || t("admin.orders.productNotFound")}</h3>
                    <p className="text-sm text-muted-foreground">{t("admin.orders.dialog.details.orderCode", { id: selectedOrder._id.slice(-8) })}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedOrder.totalPrice)}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("admin.orders.dialog.labels.dateTime", {
                      date: new Date(selectedOrder.createdAt).toLocaleDateString(),
                      time: new Date(selectedOrder.createdAt).toLocaleTimeString(),
                    })}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    {t("admin.orders.dialog.sections.product")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.productName")}</span>
                        <span>{selectedOrder.productId?.name || t("admin.orders.productNotFound")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.category")}</span>
                        <Badge variant="outline">{selectedOrder.productId?.category || t("admin.common.unknown")}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.supplier")}</span>
                        <span>{selectedOrder.productId?.supplier || t("admin.common.unknown")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.unitPrice")}</span>
                        <span>{formatCurrency(selectedOrder.totalPrice / selectedOrder.quantity)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.quantity")}</span>
                        <Badge variant="secondary">{t("admin.orders.dialog.labels.itemCount", { count: selectedOrder.quantity })}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.subtotal")}</span>
                        <span>{formatCurrency(selectedOrder.subtotal ?? selectedOrder.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.shipping")}</span>
                        <span>{formatCurrency(selectedOrder.shippingCost ?? 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.tax")}</span>
                        <span>{formatCurrency(selectedOrder.tax ?? 0)}</span>
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
                    {t("admin.orders.dialog.sections.customer")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.customerName")}</span>
                        <span className="font-semibold">{selectedOrder.userId?.name || t("admin.common.unknown")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.email")}</span>
                        <span className="text-blue-600">{selectedOrder.userId?.email || t("admin.common.noEmail")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.phone")}</span>
                        <span>{selectedOrder.userId?.phone || t("admin.common.noPhone")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.customerId")}</span>
                        <span className="font-mono text-xs">{selectedOrder.userId?._id || t("admin.common.unknown")}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.orderDate")}</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.orderTime")}</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.lastUpdated")}</span>
                        <span>{new Date(selectedOrder.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("admin.orders.dialog.labels.orderId")}</span>
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
                      {t("admin.orders.dialog.sections.shipping")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.fullName")}</span>
                          <span className="font-semibold">{selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.emailShort")}</span>
                          <span className="text-blue-600">{selectedOrder.shippingInfo.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.phoneShort")}</span>
                          <span>{selectedOrder.shippingInfo.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.country")}</span>
                          <Badge variant="outline">{selectedOrder.shippingInfo.country}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.city")}</span>
                          <span>{selectedOrder.shippingInfo.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.state")}</span>
                          <span>{selectedOrder.shippingInfo.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.zip")}</span>
                          <span>{selectedOrder.shippingInfo.zipCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.address")}</span>
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
                      {t("admin.orders.dialog.sections.payment")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.cardHolder")}</span>
                          <span className="font-semibold">{selectedOrder.paymentInfo.cardHolder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.cardNumber")}</span>
                          <span className="font-mono">**** **** **** {selectedOrder.paymentInfo.cardLastFour}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.expiryDate")}</span>
                          <span>{selectedOrder.paymentInfo.expiryMonth}/{selectedOrder.paymentInfo.expiryYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t("admin.orders.dialog.labels.paymentMethod")}</span>
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
                    {t("admin.orders.dialog.sections.timeline")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{t("admin.orders.dialog.timeline.created.title")}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("admin.orders.dialog.timeline.created.desc", {
                            timestamp: new Date(selectedOrder.createdAt).toLocaleString(),
                          })}
                        </div>
                      </div>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{t("admin.orders.dialog.timeline.confirmed.title")}</div>
                          <div className="text-sm text-muted-foreground">{t("admin.orders.dialog.timeline.confirmed.desc")}</div>
                        </div>
                      </div>
                    )}
                    {['shipped', 'delivered'].includes(selectedOrder.status) && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{t("admin.orders.dialog.timeline.shipped.title")}</div>
                          <div className="text-sm text-muted-foreground">{t("admin.orders.dialog.timeline.shipped.desc")}</div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{t("admin.orders.dialog.timeline.delivered.title")}</div>
                          <div className="text-sm text-muted-foreground">{t("admin.orders.dialog.timeline.delivered.desc")}</div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{t("admin.orders.dialog.timeline.cancelled.title")}</div>
                          <div className="text-sm text-muted-foreground">{t("admin.orders.dialog.timeline.cancelled.desc")}</div>
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
              {t("admin.common.close")}
            </Button>
            <Button 
              onClick={() => {
                setSelectedOrder(null)
                openStatusDialog(selectedOrder!)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("admin.orders.actions.updateStatus")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.orders.dialog.status.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.orders.dialog.status.description", { id: selectedOrder ? selectedOrder._id.slice(-8) : "" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("admin.orders.dialog.status.current")}</label>
              <div className="flex items-center space-x-2 mt-1">
                {selectedOrder && getStatusIcon(selectedOrder.status)}
                {selectedOrder && getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
            <div>
              <label className="text-sm font-medium">{t("admin.orders.dialog.status.new")}</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("admin.orders.dialog.status.placeholder")} />
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
                <h4 className="font-medium text-sm mb-2">{t("admin.orders.dialog.summary.title")}</h4>
                <div className="text-sm space-y-1">
                  <div>{t("admin.orders.dialog.summary.product", { value: selectedOrder.productId?.name || t("admin.orders.productNotFound") })}</div>
                  <div>{t("admin.orders.dialog.summary.customer", { value: selectedOrder.userId?.name || t("admin.common.unknown") })}</div>
                  <div>{t("admin.orders.dialog.summary.quantity", { value: selectedOrder.quantity })}</div>
                  <div>{t("admin.orders.dialog.summary.total", { value: selectedOrder.totalPrice.toFixed(2) })}</div>
                  <div>{t("admin.orders.dialog.summary.date", { value: new Date(selectedOrder.createdAt).toLocaleDateString() })}</div>
                </div>
              </div>
            )}
      </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              {t("admin.common.cancel")}
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={!newStatus || newStatus === selectedOrder?.status}
            >
              {t("admin.orders.actions.updateStatus")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
