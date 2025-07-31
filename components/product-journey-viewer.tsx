"use client"
import React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Truck, Factory, Package, Store, CheckCircle } from "lucide-react"

interface JourneyStep {
  id: string
  title: string
  description: string
  icon: any
  color: string
  status: "completed" | "current" | "upcoming"
  details?: {
    label: string
    value: string
  }[]
}

export function ProductJourneyViewer({ batchId = "BATCH-001" }: { batchId?: string }) {
  const [currentStep, setCurrentStep] = useState(4)

  // Dummy journey data
  const journeySteps: JourneyStep[] = [
    {
      id: "farm",
      title: "Farm Origin",
      description: "Harvested at Green Valley Farm",
      icon: Leaf,
      color: "bg-green-100 text-green-800",
      status: "completed",
      details: [
        { label: "Farm", value: "Green Valley Farm" },
        { label: "Location", value: "California, USA" },
        { label: "Harvest Date", value: "2024-01-15" },
        { label: "Farmer", value: "Maria Rodriguez" },
      ],
    },
    {
      id: "transport1",
      title: "Transport to Factory",
      description: "Cold chain transport by FreshLogistics",
      icon: Truck,
      color: "bg-blue-100 text-blue-800",
      status: "completed",
      details: [
        { label: "Transporter", value: "FreshLogistics" },
        { label: "Vehicle", value: "Refrigerated Truck A" },
        { label: "Temperature", value: "4.2°C" },
        { label: "Duration", value: "1 hour 45 minutes" },
      ],
    },
    {
      id: "processing",
      title: "Processing",
      description: "Processed at FreshChain Factory",
      icon: Factory,
      color: "bg-orange-100 text-orange-800",
      status: "completed",
      details: [
        { label: "Facility", value: "FreshChain Factory" },
        { label: "Process", value: "Juice Extraction" },
        { label: "Date", value: "2024-01-17" },
        { label: "Quality Check", value: "Passed" },
      ],
    },
    {
      id: "packaging",
      title: "Packaging",
      description: "Packaged in glass bottles",
      icon: Package,
      color: "bg-purple-100 text-purple-800",
      status: "completed",
      details: [
        { label: "Packaging", value: "Glass Bottles" },
        { label: "Batch Size", value: "500 bottles" },
        { label: "Date", value: "2024-01-17" },
        { label: "Expiry", value: "2024-07-17" },
      ],
    },
    {
      id: "transport2",
      title: "Transport to Store",
      description: "Delivered to SuperMart Downtown",
      icon: Truck,
      color: "bg-blue-100 text-blue-800",
      status: "current",
      details: [
        { label: "Transporter", value: "FreshLogistics" },
        { label: "Vehicle", value: "Refrigerated Truck E" },
        { label: "Temperature", value: "4.5°C" },
        { label: "ETA", value: "2024-01-19 14:30" },
      ],
    },
    {
      id: "retail",
      title: "Retail",
      description: "Available at SuperMart Downtown",
      icon: Store,
      color: "bg-indigo-100 text-indigo-800",
      status: "upcoming",
      details: [
        { label: "Store", value: "SuperMart Downtown" },
        { label: "Location", value: "123 Main St" },
        { label: "Shelf Life", value: "6 months" },
        { label: "Storage", value: "Refrigerated" },
      ],
    },
  ]

  // Update journey steps based on current step
  const updatedJourneySteps = journeySteps.map((step, index) => ({
    ...step,
    status: index < currentStep ? "completed" : index === currentStep ? "current" : "upcoming",
  }))

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="space-y-6">
      {/* Journey Progress */}
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max">
            {updatedJourneySteps.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div
                  className={`flex flex-col items-center ${
                    index < updatedJourneySteps.length - 1 ? "mr-4" : ""
                  }`}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 rounded-full border-2 ${
                      step.status === "completed"
                        ? "bg-green-100 border-green-500 text-green-800"
                        : step.status === "current"
                        ? "bg-blue-100 border-blue-500 text-blue-800"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                    onClick={() => handleStepChange(index)}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${
                        step.status === "completed"
                          ? "text-green-800"
                          : step.status === "current"
                          ? "text-blue-800"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < updatedJourneySteps.length - 1 && (
                  <div
                    className={`absolute top-5 left-[calc(50%+20px)] right-[calc(50%-20px)] h-0.5 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Details */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`p-3 rounded-full ${
                updatedJourneySteps[currentStep].status === "completed"
                  ? "bg-green-100"
                  : updatedJourneySteps[currentStep].status === "current"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
                   {updatedJourneySteps[currentStep].status === "completed" ? (
       <CheckCircle className="h-6 w-6 text-green-800" />
     ) : (
       React.createElement(
         updatedJourneySteps[currentStep].icon,
         {
           className: `h-6 w-6 ${
             updatedJourneySteps[currentStep].status === "completed"
               ? "text-green-800"
               : updatedJourneySteps[currentStep].status === "current"
               ? "text-blue-800"
               : "text-gray-500"
           }`
         }
       )
     )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{updatedJourneySteps[currentStep].title}</h3>
              <p className="text-gray-600">{updatedJourneySteps[currentStep].description}</p>
            </div>
            <div className="ml-auto">
              <Badge
                variant="outline"
                className={
                  updatedJourneySteps[currentStep].status === "completed"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : updatedJourneySteps[currentStep].status === "current"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }
              >
                {updatedJourneySteps[currentStep].status === "completed"
                  ? "Completed"
                  : updatedJourneySteps[currentStep].status === "current"
                  ? "In Progress"
                  : "Upcoming"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {updatedJourneySteps[currentStep].details?.map((detail, index) => (
              <div key={index} className="text-sm">
                <p className="text-gray-500">{detail.label}</p>
                <p className="font-medium">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {updatedJourneySteps.length}
            </div>
            <Button
              variant="outline"
              onClick={() => handleStepChange(Math.min(updatedJourneySteps.length - 1, currentStep + 1))}
              disabled={currentStep === updatedJourneySteps.length - 1}
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>
          Batch ID: <span className="font-mono">{batchId}</span>
        </p>
        <p>Blockchain verified and secured with Algorand</p>
      </div>
    </div>
  )
}
