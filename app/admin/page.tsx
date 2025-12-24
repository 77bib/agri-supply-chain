"use client"

import { useMemo, useState } from "react"
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
  Wind,
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
import { useI18n } from "@/lib/i18n"
import { toast } from "sonner"

const monthlyProductionData = [
  { monthKey: "common.months.short.jan", production: 1200, objective: 1000 },
  { monthKey: "common.months.short.feb", production: 1350, objective: 1100 },
  { monthKey: "common.months.short.mar", production: 1100, objective: 1200 },
  { monthKey: "common.months.short.apr", production: 1400, objective: 1300 },
  { monthKey: "common.months.short.may", production: 1600, objective: 1400 },
  { monthKey: "common.months.short.jun", production: 1800, objective: 1500 },
] as const

const stockMinimumData = [
  { monthKey: "common.months.short.jan", stock: 95, minimum: 70 },
  { monthKey: "common.months.short.feb", stock: 88, minimum: 70 },
  { monthKey: "common.months.short.mar", stock: 72, minimum: 70 },
  { monthKey: "common.months.short.apr", stock: 110, minimum: 70 },
  { monthKey: "common.months.short.may", stock: 84, minimum: 70 },
  { monthKey: "common.months.short.jun", stock: 76, minimum: 70 },
] as const

const inventoryCategoryColors = {
  grains: "#10b981",
  vegetables: "#3b82f6",
  fruits: "#f59e0b",
} as const

type InventoryCategoryKey = keyof typeof inventoryCategoryColors

// Données simulées pour la démonstration
const mockData = {
  farmers: {
    total: 156,
    active: 142,
    newThisMonth: 12,
    averageYield: 85.6,
    topPerformers: [
      { name: "Ahmed Benali", farm: "Vallée Verte", yield: 95.2, quality: 92 },
      { name: "Fatima Zohra", farm: "Ferme de l'Aube", yield: 93.8, quality: 89 },
      { name: "Mohammed Kaci", farm: "Champs Dorés", yield: 91.5, quality: 94 },
    ]
  },
  logistics: {
    activeShipments: 23,
    deliveredToday: 8,
    delayed: 3,
    totalVehicles: 45,
    alerts: [
      { type: "temperature", severity: "high", messageKey: "admin.logistics.alerts.temperatureMessage" },
      { type: "delay", severity: "medium", messageKey: "admin.logistics.alerts.delayMessage" },
    ]
  },
  inventory: {
    totalBatches: 89,
    lowStock: 12,
    expiringSoon: 8,
    totalValue: 1250000,
    categories: [
      { key: "grains" as InventoryCategoryKey, quantity: 45, value: 450000 },
      { key: "vegetables" as InventoryCategoryKey, quantity: 23, value: 320000 },
      { key: "fruits" as InventoryCategoryKey, quantity: 21, value: 480000 },
    ]
  },
  forecasts: {
    accuracy: 87.3,
    demandTrendKey: "admin.forecasting.trend.up",
    nextMonthPrediction: 1250000,
    recommendations: [
      "admin.forecasting.recommendations.increaseWheat",
      "admin.forecasting.recommendations.optimizeStorage",
      "admin.forecasting.recommendations.prepareRamadan",
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
  const { t } = useI18n()

  const handleRefresh = async () => {
    setLoading(true)
    // Simule un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t("admin.dashboard.refreshSuccess"))
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
    const labels = {
      active: t("admin.status.active"),
      inactive: t("admin.status.inactive"),
      delayed: t("admin.status.delayed"),
      processing: t("admin.status.processing"),
      completed: t("admin.status.completed"),
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    }
    const labels = {
      low: t("admin.severity.low"),
      medium: t("admin.severity.medium"),
      high: t("admin.severity.high"),
      critical: t("admin.severity.critical"),
    }
    return (
      <Badge className={variants[severity as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {labels[severity as keyof typeof labels] || severity}
      </Badge>
    )
  }

  const localizedProductionData = useMemo(
    () =>
      monthlyProductionData.map((entry) => ({
        ...entry,
        month: t(entry.monthKey),
      })),
    [t]
  )

  const localizedStockMinimumData = useMemo(
    () =>
      stockMinimumData.map((entry) => ({
        ...entry,
        month: t(entry.monthKey),
      })),
    [t]
  )

  const localizedCategories = useMemo(
    () =>
      mockData.inventory.categories.map((cat) => ({
        ...cat,
        label: t(`admin.inventory.category.${cat.key}`),
        color: inventoryCategoryColors[cat.key],
      })),
    [t]
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-muted-foreground">{t('admin.dashboard.subtitle')}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('admin.common.export')}
            </Button>
            <Button onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('admin.common.refresh')}
            </Button>
          </div>
        </div>

        {/* Onglets principaux du tableau de bord */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t('admin.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="farmers">{t('admin.tabs.farmers')}</TabsTrigger>
            <TabsTrigger value="logistics">{t('admin.tabs.logistics')}</TabsTrigger>
            <TabsTrigger value="inventory">{t('admin.tabs.inventory')}</TabsTrigger>
            <TabsTrigger value="forecasting">{t('admin.tabs.forecasting')}</TabsTrigger>
            <TabsTrigger value="traceability">{t('admin.tabs.traceability')}</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cartes d'indicateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.kpi.activeFarmers')}</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockData.farmers.active}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{mockData.farmers.newThisMonth}</span> {t('admin.kpi.newThisMonth', {count: mockData.farmers.newThisMonth})}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.kpi.activeShipments')}</CardTitle>
                  <Truck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{mockData.logistics.activeShipments}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600">{mockData.logistics.delayed}</span> {t('admin.kpi.delayed', {count: mockData.logistics.delayed})}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.kpi.inventoryValue')}</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{`DZ ${(mockData.inventory.totalValue / 1000000).toFixed(1)}M`}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-orange-600">{mockData.inventory.lowStock}</span> {t('admin.kpi.lowStockAlerts', {count: mockData.inventory.lowStock})}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.kpi.forecastAccuracy')}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{mockData.forecasts.accuracy}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{t(mockData.forecasts.demandTrendKey)}</span> {t('admin.kpi.trend')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ligne de graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    {t('admin.charts.monthlyProduction')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={localizedProductionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) => label}
                        formatter={(value, name) => [
                          value,
                          name === "production"
                            ? t("admin.charts.series.production")
                            : t("admin.charts.series.objective"),
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="production"
                        name={t("admin.charts.series.production")}
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="objective"
                        name={t("admin.charts.series.objective")}
                        stroke="#6b7280"
                        fill="#6b7280"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    {t("admin.charts.stockMinimum")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={localizedStockMinimumData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) => label}
                        formatter={(value, name) => [
                          value,
                          name === "stock"
                            ? t("admin.charts.series.stock")
                            : t("admin.charts.series.minimum"),
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="stock"
                        name={t("admin.charts.series.stock")}
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="minimum"
                        name={t("admin.charts.series.minimum")}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="6 6"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    {t('admin.charts.categories')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={localizedCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="quantity"
                        nameKey="label"
                      >
                        {localizedCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number | string) => [value, t("admin.charts.quantityLabel")]}
                        labelFormatter={(label) => label as string}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Section alertes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  {t('admin.alerts.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.logistics.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">{t(alert.messageKey)}</p>
                          <p className="text-sm text-muted-foreground">{t('admin.alerts.logistics')}</p>
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

          {/* Onglet Agriculteurs */}
          <TabsContent value="farmers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      {t('admin.farmers.title')}
                    </CardTitle>
                    <CardDescription>{t('admin.farmers.subtitle')}</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.farmers.add')}
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
                          <span>{t('admin.farmers.yield')}:</span>
                          <span className="font-medium">{farmer.yield}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('admin.farmers.quality')}:</span>
                          <span className="font-medium">{farmer.quality}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          {t('admin.common.view')}
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

          {/* Onglet Logistique */}
          <TabsContent value="logistics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      {t('admin.logistics.title')}
                    </CardTitle>
                    <CardDescription>{t('admin.logistics.subtitle')}</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.logistics.newShipment')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.logistics.activeShipments')}</h3>
                        <p className="text-2xl font-bold text-blue-600">{mockData.logistics.activeShipments}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.deliveredToday')}:</span>
                        <span className="font-medium text-green-600">{mockData.logistics.deliveredToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.delayed')}:</span>
                        <span className="font-medium text-red-600">{mockData.logistics.delayed}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.logistics.fleetStatus')}</h3>
                        <p className="text-2xl font-bold text-green-600">{mockData.logistics.totalVehicles}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.available')}:</span>
                        <span className="font-medium text-green-600">32</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.inTransit')}:</span>
                        <span className="font-medium text-blue-600">13</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-orange-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Thermometer className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.logistics.coldChain')}</h3>
                        <p className="text-2xl font-bold text-orange-600">98.5%</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.compliance')}:</span>
                        <span className="font-medium text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('admin.logistics.alerts')}:</span>
                        <span className="font-medium text-red-600">2</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Inventaire */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      {t('admin.inventory.title')}
                    </CardTitle>
                    <CardDescription>{t('admin.inventory.subtitle')}</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.inventory.addBatch')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Warehouse className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.inventory.totalBatches')}</h3>
                        <p className="text-2xl font-bold text-purple-600">{mockData.inventory.totalBatches}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.inventory.lowStock')}</h3>
                        <p className="text-2xl font-bold text-red-600">{mockData.inventory.lowStock}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.inventory.expiringSoon')}</h3>
                        <p className="text-2xl font-bold text-orange-600">{mockData.inventory.expiringSoon}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.inventory.totalValue')}</h3>
                        <p className="text-2xl font-bold text-green-600">{`DZ ${(mockData.inventory.totalValue / 1000000).toFixed(1)}M`}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Prévisions */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      {t('admin.forecasting.title')}
                    </CardTitle>
                    <CardDescription>{t('admin.forecasting.subtitle')}</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.forecasting.newForecast')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admin.forecasting.accuracy')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">{mockData.forecasts.accuracy}%</div>
                        <p className="text-muted-foreground">{t('admin.forecasting.overallAccuracy')}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('admin.forecasting.nextMonthPrediction')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{`DZ ${(mockData.forecasts.nextMonthPrediction / 1000000).toFixed(1)}M`}</div>
                        <p className="text-muted-foreground">{t('admin.forecasting.expectedRevenue')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t('admin.forecasting.recommendations')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockData.forecasts.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                          <span>{t(rec)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Traçabilité */}
          <TabsContent value="traceability" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      {t('admin.traceability.title')}
                    </CardTitle>
                    <CardDescription>{t('admin.traceability.subtitle')}</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.traceability.newProduct')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Package className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.traceability.activeProducts')}</h3>
                        <p className="text-2xl font-bold text-green-600">{mockData.traceability.activeProducts}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.traceability.verifiedToday')}</h3>
                        <p className="text-2xl font-bold text-blue-600">{mockData.traceability.verifiedToday}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Hash className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.traceability.blockchainTx')}</h3>
                        <p className="text-2xl font-bold text-purple-600">{mockData.traceability.blockchainTransactions}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <QrCode className="h-6 w-6 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">{t('admin.traceability.qrScans')}</h3>
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

// Composant QrCode pour la traçabilité
const QrCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)
