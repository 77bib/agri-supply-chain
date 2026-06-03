"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Search,
  Leaf,
  CheckCircle2,
  Factory,
  Package,
  Warehouse,
  Truck,
  Store,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Star,
  ArrowRight,
  Clock,
  Route,
  Leaf as LeafIcon,
  TrendingUp,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n"

interface TraceabilityData {
  productName: string
  batchId: string
  productionDate: string
  expirationDate: string
  quantity: string
  status: "In Transit" | "At Warehouse" | "In Distribution" | "Delivered"
  currentLocation: {
    city: string
    warehouse: string
    transportStatus: string
    estimatedArrival: string
  }
  journey: Array<{
    id: number
    stage: string
    location: string
    date: string
    time: string
    status: "completed" | "in-progress" | "pending"
    icon: any
    color: string
  }>
  quality: {
    temperature: string
    humidity: string
    qualityScore: number
    certifications: string[]
  }
  statistics: {
    distanceTraveled: string
    transitTime: string
    carbonFootprint: string
    deliveryPerformance: string
  }
}

export default function TracePage() {
  const { t } = useI18n()
  const [batchId, setBatchId] = useState("")
  const [traceResult, setTraceResult] = useState<TraceabilityData | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Realistic mock data
  const traceabilityData: Record<string, TraceabilityData> = {
    "PROD-2024-007851": {
      productName: "Premium Orange Juice",
      batchId: "PROD-2024-007851",
      productionDate: "2024-05-15",
      expirationDate: "2024-08-15",
      quantity: "1,200 units (250ml bottles)",
      status: "In Distribution",
      currentLocation: {
        city: "Los Angeles, CA",
        warehouse: "LA Distribution Hub - Building C",
        transportStatus: "Out for delivery",
        estimatedArrival: "Today by 6:00 PM",
      },
      journey: [
        {
          id: 1,
          stage: "Farm Harvested",
          location: "Green Valley Farm, Riverside, CA",
          date: "2024-05-15",
          time: "06:30 AM",
          status: "completed",
          icon: Leaf,
          color: "text-green-600",
        },
        {
          id: 2,
          stage: "Quality Inspection",
          location: "Regional Processing Center, Ontario, CA",
          date: "2024-05-15",
          time: "09:15 AM",
          status: "completed",
          icon: CheckCircle2,
          color: "text-blue-600",
        },
        {
          id: 3,
          stage: "Processing Facility",
          location: "BRIJUICE Advanced Factory, Los Angeles, CA",
          date: "2024-05-15",
          time: "02:45 PM",
          status: "completed",
          icon: Factory,
          color: "text-orange-600",
        },
        {
          id: 4,
          stage: "Packaging",
          location: "BRIJUICE Packaging Unit, Los Angeles, CA",
          date: "2024-05-16",
          time: "10:20 AM",
          status: "completed",
          icon: Package,
          color: "text-purple-600",
        },
        {
          id: 5,
          stage: "Warehouse Storage",
          location: "Central Warehouse, Los Angeles, CA",
          date: "2024-05-16",
          time: "04:00 PM",
          status: "completed",
          icon: Warehouse,
          color: "text-amber-600",
        },
        {
          id: 6,
          stage: "Transportation",
          location: "In Transit - I-10 Corridor",
          date: "2024-05-17",
          time: "08:00 AM",
          status: "completed",
          icon: Truck,
          color: "text-indigo-600",
        },
        {
          id: 7,
          stage: "Distribution Center",
          location: "LA Distribution Hub - Building C",
          date: "2024-05-17",
          time: "06:30 PM",
          status: "completed",
          icon: Store,
          color: "text-cyan-600",
        },
        {
          id: 8,
          stage: "Retail Delivery",
          location: "Premium Market Network Outlets",
          date: "2024-05-18",
          time: "06:00 PM",
          status: "in-progress",
          icon: CheckCircle2,
          color: "text-emerald-600",
        },
      ],
      quality: {
        temperature: "4.2°C",
        humidity: "65%",
        qualityScore: 95,
        certifications: ["USDA Organic", "Non-GMO Project Verified", "FDA Approved", "Kosher"],
      },
      statistics: {
        distanceTraveled: "47.5 km",
        transitTime: "3 days, 12 hours",
        carbonFootprint: "12.4 kg CO₂",
        deliveryPerformance: "On Schedule",
      },
    },
    "PROD-2024-005432": {
      productName: "Fresh Organic Strawberries",
      batchId: "PROD-2024-005432",
      productionDate: "2024-05-16",
      expirationDate: "2024-05-23",
      quantity: "500 cases (12 packs per case)",
      status: "Delivered",
      currentLocation: {
        city: "San Diego, CA",
        warehouse: "San Diego Retail Center",
        transportStatus: "Delivered and shelved",
        estimatedArrival: "Delivered at 2:15 PM",
      },
      journey: [
        {
          id: 1,
          stage: "Farm Harvested",
          location: "Sunlight Farms, Oxnard, CA",
          date: "2024-05-16",
          time: "04:00 AM",
          status: "completed",
          icon: Leaf,
          color: "text-green-600",
        },
        {
          id: 2,
          stage: "Quality Inspection",
          location: "Oxnard Quality Hub",
          date: "2024-05-16",
          time: "05:30 AM",
          status: "completed",
          icon: CheckCircle2,
          color: "text-blue-600",
        },
        {
          id: 3,
          stage: "Processing Facility",
          location: "Sorting & Packaging Facility, Ventura, CA",
          date: "2024-05-16",
          time: "07:45 AM",
          status: "completed",
          icon: Factory,
          color: "text-orange-600",
        },
        {
          id: 4,
          stage: "Packaging",
          location: "Premium Packaging Center, Ventura, CA",
          date: "2024-05-16",
          time: "09:00 AM",
          status: "completed",
          icon: Package,
          color: "text-purple-600",
        },
        {
          id: 5,
          stage: "Warehouse Storage",
          location: "Regional Distribution Hub, Ventura, CA",
          date: "2024-05-16",
          time: "11:00 AM",
          status: "completed",
          icon: Warehouse,
          color: "text-amber-600",
        },
        {
          id: 6,
          stage: "Transportation",
          location: "In Transit - US-101 South",
          date: "2024-05-16",
          time: "01:00 PM",
          status: "completed",
          icon: Truck,
          color: "text-indigo-600",
        },
        {
          id: 7,
          stage: "Distribution Center",
          location: "San Diego Distribution Hub",
          date: "2024-05-16",
          time: "05:00 PM",
          status: "completed",
          icon: Store,
          color: "text-cyan-600",
        },
        {
          id: 8,
          stage: "Retail Delivery",
          location: "San Diego Retail Network",
          date: "2024-05-17",
          time: "02:15 PM",
          status: "completed",
          icon: CheckCircle2,
          color: "text-emerald-600",
        },
      ],
      quality: {
        temperature: "2.8°C",
        humidity: "72%",
        qualityScore: 98,
        certifications: ["Certified Organic", "Fair Trade", "Local Harvest Partner"],
      },
      statistics: {
        distanceTraveled: "62.3 km",
        transitTime: "1 day, 10 hours",
        carbonFootprint: "8.9 kg CO₂",
        deliveryPerformance: "Early Delivery",
      },
    },
  }

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const result = traceabilityData[batchId as keyof typeof traceabilityData] || null
      setTraceResult(result)
      setIsSearching(false)
    }, 800)
  }

  const handleDemoSearch = (id: string) => {
    setBatchId(id)
    setIsSearching(true)
    setTimeout(() => {
      setTraceResult(traceabilityData[id as keyof typeof traceabilityData])
      setIsSearching(false)
    }, 800)
  }

  const getStatusColor = (status: string) => {
    const statusKey = status.toLowerCase().replace(/\s+/g, "")
    switch (statusKey) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300"
      case "indistribution":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "intransit":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "atwarehouse":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getCurrentProgress = (journey: any[]) => {
    const completed = journey.filter((j) => j.status === "completed").length
    return Math.round((completed / journey.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Header />

      <div className="container-custom py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              {t("trace.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("trace.subtitle")}
            </p>
          </div>

          {/* Search Section */}
          <Card className="max-w-3xl mx-auto shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b">
              <CardTitle className="text-2xl">{t("trace.search.title")}</CardTitle>
              <CardDescription>{t("trace.search.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Input Section */}
                <div className="flex gap-2">
                  <Input
                    placeholder={t("trace.search.placeholder")}
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 h-12 text-base"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!batchId || isSearching}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isSearching ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        {t("trace.search.searching")}
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t("trace.search.button")}
                      </>
                    )}
                  </Button>
                </div>

                {/* Demo Products */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{t("trace.search.demo")}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDemoSearch("PROD-2024-007851")}
                      className="justify-start h-auto py-3 px-4 border-blue-200 hover:bg-blue-50"
                    >
                      <div className="text-left">
                        <div className="font-medium">{t("trace.search.demo1.title")}</div>
                        <div className="text-xs text-gray-500">{t("trace.search.demo1.id")}</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDemoSearch("PROD-2024-005432")}
                      className="justify-start h-auto py-3 px-4 border-emerald-200 hover:bg-emerald-50"
                    >
                      <div className="text-left">
                        <div className="font-medium">{t("trace.search.demo2.title")}</div>
                        <div className="text-xs text-gray-500">{t("trace.search.demo2.id")}</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* QR Scanner */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">{t("trace.search.qr.title")}</p>
                  <p className="text-sm text-gray-500 mb-3">{t("trace.search.qr.description")}</p>
                  <Button variant="outline" size="sm" className="bg-white">
                    {t("trace.search.qr.button")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Not Found Message */}
          {batchId && !traceResult && !isSearching && (
            <Card className="max-w-2xl mx-auto mt-6 border-red-200 bg-red-50">
              <CardContent className="text-center py-8">
                <p className="text-red-800 font-medium">{t("trace.error.notfound")}</p>
                <p className="text-sm text-red-600 mt-1">{t("trace.error.message", { batchId })}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trace Results */}
        {traceResult && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{t("trace.progress.title")}</h3>
                  <span className="text-sm font-bold text-blue-600">{t("trace.progress.complete", { percent: getCurrentProgress(traceResult.journey) })}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 h-full transition-all duration-500"
                    style={{ width: `${getCurrentProgress(traceResult.journey)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info & Current Location - Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Information Card */}
              <Card className="shadow-lg border-0 md:col-span-1">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Package className="h-5 w-5" />
                    {t("trace.product.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t("trace.product.name")}</p>
                    <p className="text-lg font-semibold text-gray-900">{traceResult.productName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("trace.product.batchid")}</p>
                      <p className="font-mono text-sm font-medium text-gray-900 break-all">{traceResult.batchId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("trace.product.status")}</p>
                      <Badge className={`${getStatusColor(traceResult.status)} border`}>{t(`trace.status.${traceResult.status.toLowerCase().replace(/\s+/g, '')}`)}</Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t("trace.product.productiondate")}</p>
                        <p className="font-medium text-gray-900">{traceResult.productionDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t("trace.product.expirationdate")}</p>
                        <p className="font-medium text-gray-900">{traceResult.expirationDate}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t("trace.product.quantity")}</p>
                    <p className="font-medium text-gray-900">{traceResult.quantity}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">{t("trace.product.certifications")}</p>
                    <div className="flex flex-wrap gap-2">
                      {traceResult.quality.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="bg-emerald-100 text-emerald-800">
                          ✓ {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Location Card */}
              <Card className="shadow-lg border-0 md:col-span-1">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
                  <CardTitle className="flex items-center gap-2 text-emerald-900">
                    <MapPin className="h-5 w-5" />
                    {t("trace.location.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t("trace.location.city")}</p>
                    <p className="text-lg font-semibold text-gray-900">{traceResult.currentLocation.city}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t("trace.location.facility")}</p>
                    <p className="font-medium text-gray-900 text-sm">{traceResult.currentLocation.warehouse}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t("trace.location.status")}</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          {traceResult.currentLocation.transportStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t("trace.location.arrival")}</p>
                        <p className="font-medium text-gray-900">{traceResult.currentLocation.estimatedArrival}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quality Metrics */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Star className="h-5 w-5" />
                  {t("trace.quality.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Temperature */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Thermometer className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{t("trace.quality.temperature")}</p>
                    <p className="text-2xl font-bold text-gray-900">{traceResult.quality.temperature}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("trace.quality.temperature.range")}</p>
                  </div>

                  {/* Humidity */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-4 bg-cyan-100 rounded-full">
                        <Droplets className="h-6 w-6 text-cyan-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{t("trace.quality.humidity")}</p>
                    <p className="text-2xl font-bold text-gray-900">{traceResult.quality.humidity}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("trace.quality.humidity.range")}</p>
                  </div>

                  {/* Quality Score */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-4 bg-emerald-100 rounded-full">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{t("trace.quality.score")}</p>
                    <p className="text-2xl font-bold text-gray-900">{traceResult.quality.qualityScore}/100</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{t("trace.quality.score.excellent")}</p>
                  </div>

                  {/* Freshness */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-4 bg-green-100 rounded-full">
                        <LeafIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{t("trace.quality.freshness")}</p>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-xs text-gray-500 mt-1">{t("trace.quality.freshness.condition")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Clock className="h-5 w-5" />
                  {t("trace.timeline.title")}
                </CardTitle>
                <CardDescription>{t("trace.timeline.description")}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {traceResult.journey.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = step.status === "completed"
                    const isInProgress = step.status === "in-progress"

                    return (
                      <div key={step.id} className="relative">
                        {/* Connector Line */}
                        {index < traceResult.journey.length - 1 && (
                          <div
                            className={`absolute left-6 top-16 w-1 h-12 ${
                              isCompleted ? "bg-emerald-400" : isInProgress ? "bg-blue-400" : "bg-gray-200"
                            }`}
                          ></div>
                        )}

                        <div className="flex gap-4 relative">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 relative z-10">
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-full border-3 ${
                                isCompleted
                                  ? "bg-emerald-100 border-emerald-400"
                                  : isInProgress
                                    ? "bg-blue-100 border-blue-400"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                            >
                              <Icon
                                className={`h-6 w-6 ${
                                  isCompleted ? "text-emerald-600" : isInProgress ? "text-blue-600" : "text-gray-400"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{step.stage}</h4>
                              <Badge
                                className={
                                  isCompleted
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : isInProgress
                                      ? "bg-blue-100 text-blue-800 border-blue-300 animate-pulse"
                                      : "bg-gray-100 text-gray-600 border-gray-300"
                                }
                                variant="outline"
                              >
                                {isCompleted ? t("trace.timeline.completed") : isInProgress ? t("trace.timeline.inprogress") : t("trace.timeline.pending")}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{step.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{step.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{step.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Distance Traveled */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Route className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t("trace.statistics.distance")}</p>
                  <p className="text-2xl font-bold text-gray-900">{traceResult.statistics.distanceTraveled}</p>
                </CardContent>
              </Card>

              {/* Transit Time */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t("trace.statistics.transittime")}</p>
                  <p className="text-2xl font-bold text-gray-900">{traceResult.statistics.transitTime}</p>
                </CardContent>
              </Card>

              {/* Carbon Footprint */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <LeafIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t("trace.statistics.carbon")}</p>
                  <p className="text-2xl font-bold text-gray-900">{traceResult.statistics.carbonFootprint}</p>
                </CardContent>
              </Card>

              {/* Delivery Performance */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t("trace.statistics.performance")}</p>
                  <p className="text-2xl font-bold text-gray-900">{traceResult.statistics.deliveryPerformance}</p>
                </CardContent>
              </Card>
            </div>

            {/* Supply Chain Map */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <MapPin className="h-5 w-5" />
                  {t("trace.route.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="font-medium text-gray-900">{t("trace.route.origin")}</p>
                      <p className="text-xs text-gray-500 mt-1">{t("trace.route.origin.location")}</p>
                    </div>

                    <div className="flex-1 mx-4 flex items-center justify-center">
                      <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                      <ArrowRight className="h-5 w-5 text-blue-600 mx-2" />
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Store className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="font-medium text-gray-900">{t("trace.route.destination")}</p>
                      <p className="text-xs text-gray-500 mt-1">{t("trace.route.destination.location")}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {t("trace.route.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Section */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 border-b">
                <CardTitle className="flex items-center gap-2 text-pink-900">
                  <QrCode className="h-5 w-5" />
                  {t("trace.qr.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                      <QrCode className="h-32 w-32 text-gray-400" />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-4 font-mono">{traceResult.batchId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setTraceResult(null)}>
                {t("trace.actions.newsearch")}
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                <Truck className="h-4 w-4 mr-2" />
                {t("trace.actions.alerts")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
