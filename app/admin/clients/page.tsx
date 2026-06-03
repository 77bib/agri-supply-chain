"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Calendar,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useI18n } from "@/lib/i18n"
import { usersAPI, User, authAPI } from "@/lib/api-service"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

export default function AdminClientsPage() {
  const { t } = useI18n()
  const [clients, setClients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<User | null>(null)
  const [selectedClientDetails, setSelectedClientDetails] = useState<any>(null)
  const [loadingClientDetails, setLoadingClientDetails] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  })

  // Récupérer les clients depuis l'API
  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll()
      
      if (response.success && response.data) {
        setClients(response.data)
      } else {
        toast.error(response.message || "Échec de la récupération des clients")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error)
      toast.error("Échec de la récupération des clients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || client.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddClient = async () => {
    try {
      if (newClient.role === 'admin') {
        // Creating an admin account requires the administrator secret
        const adminSecret = prompt("Please enter the administrator secret:")
        if (!adminSecret) {
          toast.error("Administrator secret is required to create admin users")
          return
        }
        
        const response = await authAPI.createAdmin(
          newClient.name,
          newClient.email,
          newClient.password,
          adminSecret
        )
        
        if (response.success) {
          toast.success("Administrator user created successfully")
          fetchClients()
          setNewClient({ name: "", email: "", password: "", role: "user" })
          setIsAddDialogOpen(false)
        } else {
          toast.error(response.message || "Failed to create the administrator user")
        }
      } else {
        // Creating a regular user
        const response = await authAPI.signup(
          newClient.name,
          newClient.email,
          newClient.password
        )
        
        if (response.success) {
          toast.success("User created successfully")
          fetchClients()
          setNewClient({ name: "", email: "", password: "", role: "user" })
          setIsAddDialogOpen(false)
        } else {
          toast.error(response.message || "Failed to create the user")
        }
      }
    } catch (error) {
      console.error("Error while creating the user:", error)
      toast.error("Failed to create the user")
    }
  }

  const handleEditClient = () => {
    // User editing is not implemented in the backend yet
    toast.info("User editing is not implemented yet")
    setIsEditDialogOpen(false)
    setSelectedClient(null)
  }

  const handleDeleteClient = (id: string) => {
    // User deletion is not implemented in the backend yet
    toast.info("User deletion is not implemented yet")
  }

  const handleViewClient = async (client: User) => {
    setSelectedClient(client)
    setIsViewDialogOpen(true)
    setLoadingClientDetails(true)
    
    try {
      const response = await usersAPI.getById(client._id)
      if (response.success && response.data) {
        setSelectedClientDetails(response.data)
      } else {
        toast.error(response.message || "Failed to fetch client details")
      }
    } catch (error) {
      console.error("Error while fetching client details:", error)
      toast.error("Failed to fetch client details")
    } finally {
      setLoadingClientDetails(false)
    }
  }

  const openEditDialog = (client: User) => {
    setSelectedClient(client)
    setNewClient({
      name: client.name,
      email: client.email,
      password: "",
      role: client.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge className="bg-purple-100 text-purple-800">{t('admin.role.admin')}</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">{t('admin.role.user')}</Badge>
    )
  }

  const clientStats = {
    total: clients.length,
    admins: clients.filter((c) => c.role === "admin").length,
    users: clients.filter((c) => c.role === "user").length,
    recentRegistrations: clients.filter((c) => {
      const registrationDate = new Date(c.createdAt)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return registrationDate > oneWeekAgo
    }).length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('admin.clients.title')}</h1>
            <p className="text-muted-foreground">{t('admin.clients.subtitle')}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchClients} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('admin.common.refresh')}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('admin.clients.addUser')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.clients.addUser.title')}</DialogTitle>
                  <DialogDescription>{t('admin.clients.addUser.desc')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('admin.form.fullName')}</Label>
                    <Input
                      id="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder={t('admin.form.fullName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('admin.form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder={t('admin.form.email')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">{t('admin.form.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newClient.password}
                      onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                      placeholder={t('admin.form.password')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">{t('admin.form.role')}</Label>
                    <Select
                      value={newClient.role}
                      onValueChange={(value: "user" | "admin") => setNewClient({ ...newClient, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('admin.role.user')}</SelectItem>
                        <SelectItem value="admin">{t('admin.role.admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddClient} className="w-full">
                    {t('admin.clients.addUser.submit')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.admins')}</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{clientStats.admins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.regularUsers')}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{clientStats.users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.recentRegistrations')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.recentRegistrations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t('admin.filters.searchUsers')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('admin.filters.filterByRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.filters.allRoles')}</SelectItem>
                  <SelectItem value="admin">{t('admin.role.admin')}</SelectItem>
                  <SelectItem value="user">{t('admin.role.user')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.table.userDirectory')}</CardTitle>
            <CardDescription>{t('admin.table.userDirectory.desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('admin.loading.users')}</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('admin.empty.noUsers')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <Card key={client._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <p className="text-sm text-gray-500">{t('admin.user.userId')}: {client._id}</p>
                          </div>
                          {getRoleBadge(client.role)}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{t('admin.user.joinedOn', {date: new Date(client.createdAt).toLocaleDateString()})}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="capitalize">{client.role === 'admin' ? t('admin.role.admin') : t('admin.role.user')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleViewClient(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Client Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                    {t('admin.view.details.title', {name: selectedClient?.name || ''})}
              </DialogTitle>
                  <DialogDescription>
                    {t('admin.view.details.desc')}
                  </DialogDescription>
            </DialogHeader>
            {loadingClientDetails ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2">{t('admin.loading.clientDetails')}</span>
              </div>
            ) : selectedClient && (
              <div className="space-y-6">
                {/* Client Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                      <p className="text-sm text-muted-foreground">{t('admin.user.userId')}: {selectedClient._id.slice(-8)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleBadge(selectedClient.role)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t('admin.client.memberSince')}</div>
                    <div className="font-semibold">{new Date(selectedClient.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {t('admin.client.basicInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.form.fullName')}:</span>
                          <span className="font-semibold">{selectedClient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.emailAddress')}:</span>
                          <span className="text-blue-600">{selectedClient.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.userRole')}:</span>
                          <span>{getRoleBadge(selectedClient.role)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.accountStatus')}:</span>
                          <Badge className="bg-green-100 text-green-800">{t('admin.status.active')}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.userId')}:</span>
                          <span className="font-mono text-xs">{selectedClient._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.registrationDate')}:</span>
                          <span>{new Date(selectedClient.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.registrationTime')}:</span>
                          <span>{new Date(selectedClient.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.lastUpdated')}:</span>
                          <span>{new Date(selectedClient.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      {t('admin.client.accountStats')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.floor((Date.now() - new Date(selectedClient.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('admin.client.daysAsMember')}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedClient.role === 'admin' ? t('admin.role.admin') : t('admin.role.user')}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('admin.client.accountType')}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedClientDetails?.statistics?.total || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('admin.client.totalOrders')}</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(selectedClientDetails?.statistics?.totalSpent ?? 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('admin.client.totalSpent')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      {t('admin.client.recentOrders', {count: selectedClientDetails?.orders?.length || 0})}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClientDetails?.orders && selectedClientDetails.orders.length > 0 ? (
                      <div className="space-y-4">
                        {selectedClientDetails.orders.map((order: any) => (
                          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {order.productId?.name || 'Product Name'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {order.quantity} | {formatCurrency(order.totalPrice)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {t(`status.${order.status}`)}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{t('admin.client.noOrders')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Current Cart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      {t('admin.client.currentCart', {count: selectedClientDetails?.cart?.items?.length || 0})}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClientDetails?.cart && selectedClientDetails.cart.items && selectedClientDetails.cart.items.length > 0 ? (
                      <div className="space-y-4">
                        {selectedClientDetails.cart.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {item.product?.name || 'Product Name'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} | {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(item.quantity * item.price)}</div>
                              <div className="text-xs text-muted-foreground">{t('admin.client.inCart')}</div>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-medium">{t('admin.client.cartTotal')}:</span>
                          <span className="font-bold text-lg">
                            {formatCurrency(
                              selectedClientDetails.cart.items.reduce(
                                (total: number, item: any) => total + item.quantity * item.price,
                                0,
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{t('admin.client.noCartItems')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      {t('admin.client.securityInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.passwordStatus')}:</span>
                          <Badge className="bg-green-100 text-green-800">{t('admin.security.secure')}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.emailVerified')}:</span>
                          <Badge className="bg-green-100 text-green-800">{t('admin.common.yes')}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.lastLogin')}:</span>
                          <span>{t('admin.security.recently')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{t('admin.client.accountLocked')}:</span>
                          <Badge className="bg-green-100 text-green-800">{t('admin.common.no')}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                {t('admin.view.close')}
              </Button>
              <Button 
                onClick={() => {
                  setIsViewDialogOpen(false)
                  openEditDialog(selectedClient!)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('admin.view.editClient')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.edit.title')}</DialogTitle>
              <DialogDescription>{t('admin.edit.desc')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">{t('admin.form.fullName')}</Label>
                <Input
                  id="edit-name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">{t('admin.form.email')}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">{t('admin.form.role')}</Label>
                <Select
                  value={newClient.role}
                  onValueChange={(value: "user" | "admin") => setNewClient({ ...newClient, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t('admin.role.user')}</SelectItem>
                    <SelectItem value="admin">{t('admin.role.admin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEditClient} className="w-full">
                {t('admin.edit.updateUser')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
