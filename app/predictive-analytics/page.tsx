"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
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

const demandForecastData = [
  { month: "Jan", actual: 4200, predicted: 4100, accuracy: 97.6 },
  { month: "Feb", actual: 3800, predicted: 3900, accuracy: 97.4 },
  { month: "Mar", actual: 4500, predicted: 4400, accuracy: 97.8 },
  { month: "Apr", actual: 5200, predicted: 5100, accuracy: 98.1 },
  { month: "May", actual: 5800, predicted: 5900, accuracy: 98.3 },
  { month: "Jun", actual: 6200, predicted: 6100, accuracy: 98.4 },
  { month: "Jul", predicted: 6800, confidence: 95 },
  { month: "Aug", predicted: 7200, confidence: 94 },
  { month: "Sep", predicted: 6900, confidence: 96 },
  { month: "Oct", predicted: 6400, confidence: 95 },
  { month: "Nov", predicted: 5800, confidence: 93 },
  { month: "Dec", predicted: 5200, confidence: 94 },
]

const productDemandData = [
  { product: "Orange Juice", current: 1200, predicted: 1450, change: 20.8 },
  { product: "Strawberry Jam", current: 800, predicted: 920, change: 15.0 },
  { product: "Apple Compote", current: 600, predicted: 580, change: -3.3 },
  { product: "Mixed Berry Juice", current: 950, predicted: 1100, change: 15.8 },
  { product: "Peach Jam", current: 450, predicted: 520, change: 15.6 },
  { product: "Pear Compote", current: 380, predicted: 400, change: 5.3 },
]

const seasonalTrendsData = [
  { season: "Spring", juices: 85, jams: 60, compotes: 45 },
  { season: "Summer", juices: 120, jams: 40, compotes: 30 },
  { season: "Fall", juices: 70, jams: 90, compotes: 80 },
  { season: "Winter", juices: 60, jams: 110, compotes: 95 },
]

const wasteReductionData = [
  { month: "Jan", waste: 8.5, optimized: 5.2 },
  { month: "Feb", waste: 9.1, optimized: 5.8 },
  { month: "Mar", waste: 7.8, optimized: 4.9 },
  { month: "Apr", waste: 6.9, optimized: 4.1 },
  { month: "May", waste: 5.8, optimized: 3.5 },
  { month: "Jun", waste: 5.2, optimized: 3.1 },
]

const riskFactors = [
  { factor: "Weather Conditions", impact: "High", probability: 75, mitigation: "Diversified sourcing" },
  { factor: "Seasonal Demand", impact: "Medium", probability: 90, mitigation: "Predictive stocking" },
  { factor: "Supply Chain Disruption", impact: "High", probability: 25, mitigation: "Multiple suppliers" },
  { factor: "Price Volatility", impact: "Medium", probability: 60, mitigation: "Flexible pricing" },
]

export default function PredictiveAnalyticsPage() {
  const getChangeColor = (change: number) => {
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const getRiskColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-600 bg-red-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <BarChart3 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Predictive Analytics</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered demand forecasting and analytics to optimize inventory, reduce waste, and maximize efficiency
            across your entire supply chain.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">35%</div>
              <p className="text-xs text-muted-foreground">Compared to traditional methods</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">$125K</div>
              <p className="text-xs text-muted-foreground">Monthly optimization savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2.3s</div>
              <p className="text-xs text-muted-foreground">Real-time prediction updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-green-600" />
              AI-Powered Analytics Dashboard
            </CardTitle>
            <CardDescription>Real-time insights and predictions for optimal supply chain management</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="demand" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="demand">Demand Forecasting</TabsTrigger>
                <TabsTrigger value="products">Product Analysis</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal Trends</TabsTrigger>
                <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
              </TabsList>

              <TabsContent value="demand" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>12-Month Demand Forecast</CardTitle>
                    <CardDescription>AI predictions vs actual demand with confidence intervals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={demandForecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Demand" />
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

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Month Prediction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">6,800 units</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={95} className="flex-1" />
                        <span className="text-sm font-medium">95% confidence</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                        +9.7% from current month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Peak Season Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600 mb-2">August</div>
                      <p className="text-sm text-gray-600 mb-2">Expected peak demand month</p>
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Prepare inventory
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Model Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">98.2%</div>
                      <p className="text-sm text-gray-600 mb-2">Average prediction accuracy</p>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Highly reliable
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Demand Predictions</CardTitle>
                    <CardDescription>Individual product forecasts for next month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productDemandData.map((product) => (
                        <div key={product.product} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.product}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="text-sm">
                                <span className="text-gray-500">Current: </span>
                                <span className="font-medium">{product.current} units</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Predicted: </span>
                                <span className="font-medium">{product.predicted} units</span>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-1 ${getChangeColor(product.change)}`}>
                            {getChangeIcon(product.change)}
                            <span className="font-medium">{Math.abs(product.change)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Waste Reduction Impact</CardTitle>
                    <CardDescription>Comparison of waste levels before and after AI optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={wasteReductionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="waste"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                          name="Previous Waste %"
                        />
                        <Area
                          type="monotone"
                          dataKey="optimized"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Optimized Waste %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seasonal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Demand Patterns</CardTitle>
                    <CardDescription>Product category performance across seasons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={seasonalTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="season" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="juices" fill="#3b82f6" name="Juices" />
                        <Bar dataKey="jams" fill="#f59e0b" name="Jams" />
                        <Bar dataKey="compotes" fill="#8b5cf6" name="Compotes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Seasonal Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Summer Peak</h4>
                          <p className="text-sm text-gray-600">Juice demand increases 40% during summer months</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Winter Comfort</h4>
                          <p className="text-sm text-gray-600">Jams and compotes see 60% increase in winter</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Holiday Spikes</h4>
                          <p className="text-sm text-gray-600">All categories peak during holiday seasons</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">Summer Strategy</h4>
                        <p className="text-sm text-blue-700">Increase juice production by 35% in May-July</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-800">Winter Preparation</h4>
                        <p className="text-sm text-orange-700">Stock up on jam ingredients in September</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800">Year-round Balance</h4>
                        <p className="text-sm text-purple-700">Maintain compote production for steady demand</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment Matrix</CardTitle>
                    <CardDescription>Identified risks and mitigation strategies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {riskFactors.map((risk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{risk.factor}</h4>
                              <p className="text-sm text-gray-600 mt-1">Mitigation: {risk.mitigation}</p>
                            </div>
                            <Badge className={getRiskColor(risk.impact)}>{risk.impact} Impact</Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Probability</span>
                                <span>{risk.probability}%</span>
                              </div>
                              <Progress value={risk.probability} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Mitigation Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Diversify supplier base across regions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Implement dynamic pricing models</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Establish emergency inventory buffers</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Monitor weather patterns continuously</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">Low</div>
                          <p className="text-sm text-gray-600">Overall Risk Level</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">24/7</div>
                          <p className="text-sm text-gray-600">Continuous Monitoring</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">15min</div>
                          <p className="text-sm text-gray-600">Alert Response Time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Technology Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>AI Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Machine Learning Models</h4>
                  <p className="text-sm text-gray-600">Advanced algorithms for pattern recognition and prediction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Time Series Analysis</h4>
                  <p className="text-sm text-gray-600">Historical data analysis for trend identification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Real-time Processing</h4>
                  <p className="text-sm text-gray-600">Instant updates and predictions as new data arrives</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Automated Optimization</h4>
                  <p className="text-sm text-gray-600">Self-improving algorithms that learn from outcomes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Inventory Optimization</span>
                <span className="text-green-600 font-bold">+40%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Demand Accuracy</span>
                <span className="text-blue-600 font-bold">98.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Cost Reduction</span>
                <span className="text-purple-600 font-bold">-25%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">Waste Minimization</span>
                <span className="text-orange-600 font-bold">-35%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">Transform Your Supply Chain with AI</h3>
            <p className="text-gray-600 mb-6">
              Harness the power of predictive analytics to optimize your operations, reduce costs, and stay ahead of
              market demands.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact">
                <Button size="lg">
                  <Brain className="h-5 w-5 mr-2" />
                  Start Your AI Journey
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline">
                  View Live Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
