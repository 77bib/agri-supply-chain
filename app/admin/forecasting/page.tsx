"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  Sun,
  Snowflake,
  Leaf,
  Thermometer,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useI18n } from "@/lib/i18n"

// Données de prévision fictives
const demandForecastData = [
  { month: "Jan", actual: 4200, predicted: 4100, demand: 4300 },
  { month: "Fév", actual: 3800, predicted: 3900, demand: 3750 },
  { month: "Mar", actual: 4500, predicted: 4400, demand: 4600 },
  { month: "Avr", actual: 5200, predicted: 5100, demand: 5300 },
  { month: "Mai", actual: 5800, predicted: 5900, demand: 5750 },
  { month: "Jun", actual: 6200, predicted: 6100, demand: 6400 },
  { month: "Jul", predicted: 6800, demand: 6900 },
  { month: "Aoû", predicted: 7200, demand: 7100 },
  { month: "Sep", predicted: 6500, demand: 6600 },
  { month: "Oct", predicted: 5800, demand: 5900 },
  { month: "Nov", predicted: 5200, demand: 5100 },
  { month: "Déc", predicted: 5600, demand: 5700 },
]

const seasonalTrends = [
  { season: "Printemps", orangeJuice: 85, strawberryJam: 120, appleCompote: 75 },
  { season: "Été", orangeJuice: 150, strawberryJam: 180, appleCompote: 60 },
  { season: "Automne", orangeJuice: 95, strawberryJam: 90, appleCompote: 140 },
  { season: "Hiver", orangeJuice: 110, strawberryJam: 70, appleCompote: 120 },
]

const productDemandData = [
  { name: "Jus d'Orange", current: 145, forecast: 162, growth: 11.7 },
  { name: "Confiture de Fraise", current: 89, forecast: 98, growth: 10.1 },
  { name: "Compote de Pomme", current: 67, forecast: 71, growth: 6.0 },
  { name: "Jus de Baies Mélangées", current: 45, forecast: 52, growth: 15.6 },
  { name: "Conserves de Pêche", current: 23, forecast: 28, growth: 21.7 },
]

const weatherImpactData = [
  { week: "Semaine 1", temperature: 18, rainfall: 5, demand: 4200 },
  { week: "Semaine 2", temperature: 22, rainfall: 12, demand: 4500 },
  { week: "Semaine 3", temperature: 25, rainfall: 8, demand: 5100 },
  { week: "Semaine 4", temperature: 28, rainfall: 2, demand: 5800 },
  { week: "Semaine 5", temperature: 31, rainfall: 0, demand: 6200 },
  { week: "Semaine 6", temperature: 29, rainfall: 15, demand: 5900 },
]

const alerts = [
  {
    id: 1,
    type: "seasonal",
    message: "Le pic d'été approche - augmentation de 40% attendue dans la demande de jus",
    priority: "high",
    impact: "Augmenter la capacité de production de 25%",
    timeframe: "Deux prochaines semaines",
  },
  {
    id: 2,
    type: "weather",
    message: "Vague de chaleur prévue - la demande de jus d'orange pourrait augmenter de 30%",
    priority: "medium",
    impact: "Sécuriser des matières premières supplémentaires",
    timeframe: "Prochaine semaine",
  },
  {
    id: 3,
    type: "trend",
    message: "La compote de pomme montre une tendance baissière (-5% sur 3 mois)",
    priority: "low",
    impact: "Envisager des campagnes promotionnelles",
    timeframe: "Mois prochain",
  },
  {
    id: 4,
    type: "supply",
    message: "Récolte de fraises retardée - risque de pénurie d'approvisionnement",
    priority: "high",
    impact: "Trouver des fournisseurs alternatifs",
    timeframe: "Immédiat",
  },
]

const accuracyMetrics = [
  { model: "Prévision de la Demande", accuracy: 92.5, trend: "up" },
  { model: "Prédiction Saisonnière", accuracy: 88.3, trend: "stable" },
  { model: "Impact Météorologique", accuracy: 76.8, trend: "up" },
  { model: "Planification d'Approvisionnement", accuracy: 94.1, trend: "up" },
]

export default function ForecastingPage() {
  const { t } = useI18n()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedProduct, setSelectedProduct] = useState("all")

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "seasonal":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "weather":
        return <Sun className="h-4 w-4 text-orange-600" />
      case "trend":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "supply":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">{t("admin.forecasting.priority.high")}</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">{t("admin.forecasting.priority.medium")}</Badge>
      case "low":
        return <Badge variant="outline">{t("admin.forecasting.priority.low")}</Badge>
      default:
        return <Badge variant="outline">{t("admin.forecasting.priority.unknown")}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("admin.forecasting.title")}</h1>
            <p className="text-muted-foreground">{t("admin.forecasting.subtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">{t("admin.forecasting.timeRange.3months")}</SelectItem>
                <SelectItem value="6months">{t("admin.forecasting.timeRange.6months")}</SelectItem>
                <SelectItem value="1year">{t("admin.forecasting.timeRange.1year")}</SelectItem>
                <SelectItem value="2years">{t("admin.forecasting.timeRange.2years")}</SelectItem>
              </SelectContent>
            </Select>
            <Button>{t("admin.forecasting.generateReport")}</Button>
          </div>
        </div>

        {/* Métriques Clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.forecasting.metrics.accuracy")}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.5%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.3%</span> {t("admin.forecasting.metrics.vsLastMonth")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.forecasting.metrics.demandGrowth")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.8%</div>
              <p className="text-xs text-muted-foreground">{t("admin.forecasting.metrics.projectedNextQuarter")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.forecasting.metrics.seasonalPeak")}</CardTitle>
              <Sun className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14 Jours</div>
              <p className="text-xs text-muted-foreground">{t("admin.forecasting.metrics.untilSummerPeak")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.forecasting.metrics.activeAlerts")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.filter((a) => a.priority === "high").length}</div>
              <p className="text-xs text-muted-foreground">{t("admin.forecasting.metrics.highPriorityAlerts")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("admin.forecasting.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="seasonal">{t("admin.forecasting.tabs.seasonal")}</TabsTrigger>
            <TabsTrigger value="products">{t("admin.forecasting.tabs.products")}</TabsTrigger>
            <TabsTrigger value="weather">{t("admin.forecasting.tabs.weather")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("admin.forecasting.tabs.alerts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.forecasting.charts.demand.title")}</CardTitle>
                  <CardDescription>{t("admin.forecasting.charts.demand.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={demandForecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        strokeWidth={2}
                        name={t("admin.forecasting.charts.demand.actual")}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={t("admin.forecasting.charts.demand.predicted")}
                      />
                      <Line
                        type="monotone"
                        dataKey="demand"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name={t("admin.forecasting.charts.demand.market")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Précision des Modèles</CardTitle>
                  <CardDescription>Performance des modèles de prévision</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {accuracyMetrics.map((metric) => (
                      <div key={metric.model} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{metric.model}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold">{metric.accuracy}%</span>
                            {metric.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : metric.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${metric.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prévision de Croissance de la Demande Produits</CardTitle>
                <CardDescription>Taux de croissance attendus pour le prochain trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productDemandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#e5e7eb" name="Demande Actuelle" />
                    <Bar dataKey="forecast" fill="#10b981" name="Demande Prévue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modèles de Demande Saisonnière</CardTitle>
                  <CardDescription>Demande produits par saison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={seasonalTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orangeJuice" fill="#f97316" name="Jus d'Orange" />
                      <Bar dataKey="strawberryJam" fill="#ef4444" name="Confiture Fraise" />
                      <Bar dataKey="appleCompote" fill="#10b981" name="Compote Pomme" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights Saisonniers</CardTitle>
                  <CardDescription>Tendances saisonnières clés et recommandations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Sun className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Pic d'Été (Juin-Août)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Les jus d'orange et de baies voient une augmentation de 60%. Préparer une capacité de stockage froid supplémentaire.
                        </p>
                        <Badge className="bg-orange-100 text-orange-800 mt-2">{t("admin.forecasting.seasonal.actionRequired")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Leaf className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Récolte d'Automne (Sep-Nov)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Apple compote demand peaks. Coordinate with apple orchards for bulk purchasing.
                        </p>
                        <Badge className="bg-green-100 text-green-800 mt-2">{t("admin.forecasting.seasonal.optimal")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Snowflake className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Vacances d'Hiver (Déc-Fév)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Preserve and jam sales increase for gift season. Plan promotional campaigns.
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 mt-2">{t("admin.forecasting.seasonal.planAhead")}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.forecasting.seasonalityCalendar.title")}</CardTitle>
                <CardDescription>{t("admin.forecasting.seasonalityCalendar.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
                  {[
                    { month: "Jan", demand: "Medium", color: "bg-blue-100" },
                    { month: "Feb", demand: "Low", color: "bg-gray-100" },
                    { month: "Mar", demand: "Medium", color: "bg-blue-100" },
                    { month: "Apr", demand: "High", color: "bg-green-100" },
                    { month: "May", demand: "High", color: "bg-green-100" },
                    { month: "Jun", demand: "Peak", color: "bg-red-100" },
                    { month: "Jul", demand: "Peak", color: "bg-red-100" },
                    { month: "Aug", demand: "Peak", color: "bg-red-100" },
                    { month: "Sep", demand: "High", color: "bg-green-100" },
                    { month: "Oct", demand: "Medium", color: "bg-blue-100" },
                    { month: "Nov", demand: "Medium", color: "bg-blue-100" },
                    { month: "Dec", demand: "High", color: "bg-green-100" },
                  ].map((item) => (
                    <div key={item.month} className={`p-3 rounded-lg text-center ${item.color}`}>
                      <div className="font-medium text-sm">{item.month}</div>
                      <div className="text-xs mt-1">{item.demand}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Product-Specific Forecasts</h3>
                <p className="text-sm text-muted-foreground">Individual product demand predictions</p>
              </div>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Produits</SelectItem>
                  <SelectItem value="orange-juice">Orange Juice</SelectItem>
                  <SelectItem value="strawberry-jam">Strawberry Jam</SelectItem>
                  <SelectItem value="apple-compote">Apple Compote</SelectItem>
                  <SelectItem value="mixed-berry">Mixed Berry Juice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              {productDemandData.map((product) => (
                <Card key={product.name}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>
                          {t("admin.forecasting.products.currentLabel", { value: product.current })}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          product.growth > 15
                            ? "bg-green-100 text-green-800"
                            : product.growth > 10
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        +{product.growth}% growth
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Forecast Progress</span>
                            <span>{Math.round((product.forecast / product.current) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (product.forecast / product.current) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Demande Actuelle :</span>
                            <p className="font-medium">{product.current} units</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Forecasted:</span>
                            <p className="font-medium text-green-600">{product.forecast} units</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Recommandations :</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {product.growth > 15 && (
                            <>
                              <li>• Increase production capacity by 20%</li>
                              <li>• Secure additional raw materials</li>
                              <li>• Consider expanding distribution</li>
                            </>
                          )}
                          {product.growth <= 15 && product.growth > 10 && (
                            <>
                              <li>• Moderate capacity increase needed</li>
                              <li>• Monitor supply chain closely</li>
                              <li>• Prepare for seasonal variations</li>
                            </>
                          )}
                          {product.growth <= 10 && (
                            <>
                              <li>• Maintain current production levels</li>
                              <li>• Focus on quality improvements</li>
                              <li>• Consider promotional campaigns</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.forecasting.weather.title")}</CardTitle>
                <CardDescription>{t("admin.forecasting.weather.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={weatherImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="temp" orientation="left" />
                    <YAxis yAxisId="demand" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="demand"
                      type="monotone"
                      dataKey="demand"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Demand"
                    />
                    <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f59e0b" name="Temperature °C" />
                    <Bar yAxisId="temp" dataKey="rainfall" fill="#3b82f6" name="Précipitations mm" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.forecasting.weather.tempCorrelation.title")}</CardTitle>
                  <CardDescription>{t("admin.forecasting.weather.tempCorrelation.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-sm">High Temperature &gt;25°C</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">+35% juice demand</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Moderate Temperature 15-25°C</span>
                      </div>
                      <span className="text-sm font-medium">Baseline demand</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Low Temperature &lt;15°C</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">-15% juice demand</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.forecasting.weather.forecastImpact.title")}</CardTitle>
                  <CardDescription>{t("admin.forecasting.weather.forecastImpact.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: "Monday", temp: 28, condition: "Sunny", impact: "+25%" },
                      { day: "Tuesday", temp: 31, condition: "Hot", impact: "+40%" },
                      { day: "Wednesday", temp: 29, condition: "Partly Cloudy", impact: "+30%" },
                      { day: "Thursday", temp: 24, condition: "Rainy", impact: "-10%" },
                      { day: "Friday", temp: 22, condition: "Cloudy", impact: "-5%" },
                      { day: "Saturday", temp: 26, condition: "Sunny", impact: "+20%" },
                      { day: "Sunday", temp: 27, condition: "Sunny", impact: "+25%" },
                    ].map((day) => (
                      <div key={day.day} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-20">{day.day}</span>
                          <span className="text-sm">{day.temp}°C</span>
                          <span className="text-sm text-muted-foreground">{day.condition}</span>
                        </div>
                        <Badge
                          className={
                            day.impact.startsWith("+") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {day.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.forecasting.alerts.title")}</CardTitle>
                <CardDescription>{t("admin.forecasting.alerts.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {alerts.map((alert) => (
                    <Card key={alert.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{alert.message}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{alert.impact}</p>
                            </div>
                            {getPriorityBadge(alert.priority)}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Timeframe: {alert.timeframe}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Dismiss
                              </Button>
                              <Button size="sm">{t("admin.forecasting.alerts.takeAction")}</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.forecasting.alertSummary.title")}</CardTitle>
                  <CardDescription>{t("admin.forecasting.alertSummary.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Priority</span>
                      <span className="text-sm font-medium text-red-600">
                        {alerts.filter((a) => a.priority === "high").length} alerts
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium Priority</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {alerts.filter((a) => a.priority === "medium").length} alerts
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Priority</span>
                      <span className="text-sm font-medium text-green-600">
                        {alerts.filter((a) => a.priority === "low").length} alerts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.forecasting.recommendedActions.title")}</CardTitle>
                  <CardDescription>{t("admin.forecasting.recommendedActions.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Increase juice production capacity</p>
                        <p className="text-xs text-muted-foreground">Due to summer peak forecast</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Monitor strawberry supply chain</p>
                        <p className="text-xs text-muted-foreground">Potential harvest delays detected</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Prepare promotional campaigns</p>
                        <p className="text-xs text-muted-foreground">For declining apple compote sales</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
