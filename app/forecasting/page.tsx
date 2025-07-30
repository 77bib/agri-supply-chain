"use client"

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
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Target, Brain } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Dummy forecasting data
const demandForecast = [
  { month: "Jan", actual: 4000, predicted: 3800, juices: 2400, jams: 1000, compotes: 600 },
  { month: "Feb", actual: 3000, predicted: 3200, juices: 1800, jams: 800, compotes: 400 },
  { month: "Mar", actual: 2000, predicted: 2100, juices: 1200, jams: 500, compotes: 300 },
  { month: "Apr", actual: 2780, predicted: 2900, juices: 1680, jams: 700, compotes: 400 },
  { month: "May", actual: 1890, predicted: 2000, juices: 1134, jams: 500, compotes: 256 },
  { month: "Jun", actual: 2390, predicted: 2500, juices: 1434, jams: 600, compotes: 356 },
  { month: "Jul", predicted: 3200, juices: 1920, jams: 800, compotes: 480 },
  { month: "Aug", predicted: 4100, juices: 2460, jams: 1000, compotes: 640 },
  { month: "Sep", predicted: 3800, juices: 2280, jams: 950, compotes: 570 },
  { month: "Oct", predicted: 3200, juices: 1920, jams: 800, compotes: 480 },
  { month: "Nov", predicted: 2800, juices: 1680, jams: 700, compotes: 420 },
  { month: "Dec", predicted: 3500, juices: 2100, jams: 875, compotes: 525 },
]

const seasonalTrends = [
  { season: "Spring", demand: 85, color: "#10b981" },
  { season: "Summer", demand: 120, color: "#f59e0b" },
  { season: "Fall", demand: 95, color: "#ef4444" },
  { season: "Winter", demand: 70, color: "#3b82f6" },
]

const rawMaterialNeeds = [
  { material: "Oranges", current: 850, predicted: 1200, unit: "kg", trend: "up" },
  { material: "Apples", current: 650, predicted: 900, unit: "kg", trend: "up" },
  { material: "Strawberries", current: 200, predicted: 450, unit: "kg", trend: "up" },
  { material: "Peaches", current: 400, predicted: 350, unit: "kg", trend: "down" },
]

const alerts = [
  {
    type: "warning",
    message: "High demand predicted for summer juices - increase orange orders by 40%",
    priority: "high",
  },
  {
    type: "info",
    message: "Strawberry season approaching - prepare for seasonal production increase",
    priority: "medium",
  },
  { type: "alert", message: "Peach demand declining - consider reducing orders to prevent waste", priority: "high" },
]

export default function ForecastingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demand Forecasting</h1>
            <p className="text-gray-600">AI-powered predictions for optimal inventory management</p>
          </div>
          <div className="flex space-x-2">
            <Select defaultValue="12months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button>Update Forecast</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Month Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,200</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> vs current month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Season</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Summer</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">+20%</span> demand increase
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">High confidence level</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Forecasting Alerts</CardTitle>
            <CardDescription>Important predictions and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${alert.priority === "high" ? "text-red-600" : "text-yellow-600"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <Badge variant={alert.priority === "high" ? "destructive" : "secondary"} className="mt-1">
                      {alert.priority} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="demand" className="space-y-4">
          <TabsList>
            <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Analysis</TabsTrigger>
            <TabsTrigger value="materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="demand" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>12-Month Demand Forecast</CardTitle>
                <CardDescription>Predicted vs actual demand with product breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual Demand" />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Demand"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Category Forecast</CardTitle>
                <CardDescription>Breakdown by product type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="juices" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="jams" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="compotes" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Demand Patterns</CardTitle>
                <CardDescription>Historical seasonal trends analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seasonalTrends.map((season) => (
                    <div key={season.season} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: season.color }}>
                        {season.demand}%
                      </div>
                      <div className="text-sm text-gray-600">{season.season}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Material Requirements</CardTitle>
                <CardDescription>Predicted material needs based on demand forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rawMaterialNeeds.map((material) => (
                    <div key={material.material} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{material.material}</h3>
                          <p className="text-sm text-gray-600">
                            Current: {material.current} {material.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {material.predicted} {material.unit}
                          </div>
                          <div className="text-sm text-gray-600">Predicted need</div>
                        </div>
                        <div className="flex items-center">
                          {material.trend === "up" ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                          <span
                            className={`ml-1 text-sm ${material.trend === "up" ? "text-green-600" : "text-red-600"}`}
                          >
                            {Math.round(((material.predicted - material.current) / material.current) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Forecasting accuracy metrics and model insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Accuracy</span>
                      <span className="text-sm text-green-600">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "94.2%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Juices Forecast</span>
                      <span className="text-sm text-green-600">96.1%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "96.1%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Jams Forecast</span>
                      <span className="text-sm text-yellow-600">91.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "91.8%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Compotes Forecast</span>
                      <span className="text-sm text-orange-600">89.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: "89.5%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Model Information</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Algorithm:</span>
                        <span>LSTM Neural Network</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Training Data:</span>
                        <span>3 years historical</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span>2024-01-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Features:</span>
                        <span>15 variables</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Key Factors</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Seasonal patterns</span>
                          <span className="text-green-600">High impact</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weather data</span>
                          <span className="text-green-600">High impact</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Economic indicators</span>
                          <span className="text-yellow-600">Medium impact</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Marketing campaigns</span>
                          <span className="text-yellow-600">Medium impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
