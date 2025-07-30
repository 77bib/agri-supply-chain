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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Plus,
  Edit,
  CalendarIcon,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Dummy data
const farmers = [
  {
    id: "F001",
    name: "Green Valley Farm",
    owner: "Maria Rodriguez",
    location: "California, USA",
    phone: "+1 555-0101",
    email: "maria@greenvalley.com",
    rating: 4.8,
    status: "active",
    cropTypes: ["Oranges", "Lemons"],
    farmSize: "150 acres",
    certifications: ["Organic", "Fair Trade"],
    joinDate: "2020-03-15",
    lastDelivery: "2024-01-20",
    totalDeliveries: 45,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "F002",
    name: "Berry Fresh Co",
    owner: "Sarah Johnson",
    location: "Oregon, USA",
    phone: "+1 555-0102",
    email: "sarah@berryfresh.com",
    rating: 4.9,
    status: "active",
    cropTypes: ["Strawberries", "Blueberries", "Raspberries"],
    farmSize: "85 acres",
    certifications: ["Organic", "Local"],
    joinDate: "2019-07-22",
    lastDelivery: "2024-01-18",
    totalDeliveries: 62,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "F003",
    name: "Mountain Orchards",
    owner: "John Smith",
    location: "Washington, USA",
    phone: "+1 555-0103",
    email: "john@mountainorchards.com",
    rating: 4.7,
    status: "active",
    cropTypes: ["Apples", "Pears"],
    farmSize: "200 acres",
    certifications: ["Organic", "Heritage Variety"],
    joinDate: "2018-11-10",
    lastDelivery: "2024-01-19",
    totalDeliveries: 78,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "F004",
    name: "Sunny Farms",
    owner: "Mike Davis",
    location: "Georgia, USA",
    phone: "+1 555-0104",
    email: "mike@sunnyfarms.com",
    rating: 4.6,
    status: "inactive",
    cropTypes: ["Peaches", "Plums"],
    farmSize: "120 acres",
    certifications: ["Organic"],
    joinDate: "2021-05-08",
    lastDelivery: "2023-12-15",
    totalDeliveries: 23,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const batches = [
  {
    id: "BATCH-001",
    farmerId: "F001",
    farmerName: "Green Valley Farm",
    product: "Oranges",
    quantity: "500 kg",
    harvestDate: "2024-01-15",
    status: "delivered",
    quality: "A+",
    price: "$750",
  },
  {
    id: "BATCH-002",
    farmerId: "F002",
    farmerName: "Berry Fresh Co",
    product: "Strawberries",
    quantity: "200 kg",
    harvestDate: "2024-01-16",
    status: "in-transit",
    quality: "A",
    price: "$600",
  },
  {
    id: "BATCH-003",
    farmerId: "F003",
    farmerName: "Mountain Orchards",
    product: "Apples",
    quantity: "300 kg",
    harvestDate: "2024-01-14",
    status: "processing",
    quality: "A+",
    price: "$450",
  },
  {
    id: "BATCH-004",
    farmerId: "F001",
    farmerName: "Green Valley Farm",
    product: "Lemons",
    quantity: "150 kg",
    harvestDate: "2024-01-17",
    status: "scheduled",
    quality: "A",
    price: "$300",
  },
]

const deliverySchedule = [
  {
    id: "SCH-001",
    farmerId: "F002",
    farmerName: "Berry Fresh Co",
    product: "Blueberries",
    scheduledDate: "2024-01-22",
    estimatedQuantity: "180 kg",
    status: "confirmed",
    truckAssigned: "TR-002",
  },
  {
    id: "SCH-002",
    farmerId: "F003",
    farmerName: "Mountain Orchards",
    product: "Pears",
    scheduledDate: "2024-01-23",
    estimatedQuantity: "250 kg",
    status: "pending",
    truckAssigned: null,
  },
  {
    id: "SCH-003",
    farmerId: "F001",
    farmerName: "Green Valley Farm",
    product: "Oranges",
    scheduledDate: "2024-01-24",
    estimatedQuantity: "400 kg",
    status: "confirmed",
    truckAssigned: "TR-001",
  },
]

export default function FarmersPage() {
  const [selectedTab, setSelectedTab] = useState("farmers")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
      case "processing":
        return <Badge className="bg-purple-100 text-purple-800">Processing</Badge>
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "A+":
        return <Badge className="bg-green-100 text-green-800">A+</Badge>
      case "A":
        return <Badge className="bg-blue-100 text-blue-800">A</Badge>
      case "B":
        return <Badge className="bg-yellow-100 text-yellow-800">B</Badge>
      default:
        return <Badge variant="outline">{quality}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farmers Management</h1>
            <p className="text-muted-foreground">Manage your network of farmers and suppliers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Input
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Farmer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Farmer</DialogTitle>
                  <DialogDescription>Add a new farmer to your network</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input id="farmName" placeholder="Enter farm name" />
                  </div>
                  <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" placeholder="Enter owner name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Phone number" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Email address" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, State, Country" />
                  </div>
                  <div>
                    <Label htmlFor="cropTypes">Crop Types</Label>
                    <Input id="cropTypes" placeholder="e.g., Apples, Oranges" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Farmer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="farmers">Farmers Directory</TabsTrigger>
            <TabsTrigger value="batches">Product Batches</TabsTrigger>
            <TabsTrigger value="schedule">Delivery Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="farmers" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFarmers.map((farmer) => (
                <Card key={farmer.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r from-green-50 to-green-100"
                    style={{
                      backgroundImage: `url(${farmer.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{farmer.name}</CardTitle>
                        <CardDescription>{farmer.owner}</CardDescription>
                      </div>
                      {getStatusBadge(farmer.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{farmer.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{farmer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{farmer.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{farmer.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{farmer.totalDeliveries} deliveries</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Crop Types:</div>
                      <div className="flex flex-wrap gap-1">
                        {farmer.cropTypes.map((crop) => (
                          <Badge key={crop} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Certifications:</div>
                      <div className="flex flex-wrap gap-1">
                        {farmer.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Farm Size:</span>
                        <p className="font-medium">{farmer.farmSize}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Delivery:</span>
                        <p className="font-medium">{farmer.lastDelivery}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Package className="h-4 w-4 mr-1" />
                        View Batches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Product Batches</h3>
                <p className="text-sm text-muted-foreground">Track batches from farmers to processing</p>
              </div>
              <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Batch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Batch</DialogTitle>
                    <DialogDescription>Register a new product batch from farmer</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="batchId">Batch ID</Label>
                      <Input id="batchId" placeholder="Enter batch ID" />
                    </div>
                    <div>
                      <Label htmlFor="farmer">Farmer</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmers.map((farmer) => (
                            <SelectItem key={farmer.id} value={farmer.id}>
                              {farmer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product">Product</Label>
                        <Input id="product" placeholder="e.g., Oranges" />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" placeholder="e.g., 500 kg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quality">Quality Grade</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" placeholder="e.g., $750" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsBatchDialogOpen(false)}>Add Batch</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Harvest Date</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.farmerName}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{batch.harvestDate}</TableCell>
                        <TableCell>{getQualityBadge(batch.quality)}</TableCell>
                        <TableCell className="font-medium">{batch.price}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Truck className="h-4 w-4" />
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

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Delivery Schedule</h3>
                <p className="text-sm text-muted-foreground">Manage pickup and delivery schedules</p>
              </div>
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Pickup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Pickup</DialogTitle>
                    <DialogDescription>Schedule a pickup from farmer</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scheduleFarmer">Farmer</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmers
                            .filter((f) => f.status === "active")
                            .map((farmer) => (
                              <SelectItem key={farmer.id} value={farmer.id}>
                                {farmer.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduleProduct">Product</Label>
                        <Input id="scheduleProduct" placeholder="e.g., Apples" />
                      </div>
                      <div>
                        <Label htmlFor="scheduleQuantity">Est. Quantity</Label>
                        <Input id="scheduleQuantity" placeholder="e.g., 300 kg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="scheduleDate">Pickup Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="truck">Assign Truck</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select truck" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TR-001">TR-001 - Refrigerated Truck A</SelectItem>
                          <SelectItem value="TR-002">TR-002 - Refrigerated Truck B</SelectItem>
                          <SelectItem value="TR-003">TR-003 - Refrigerated Truck C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Additional notes or instructions" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsScheduleDialogOpen(false)}>Schedule Pickup</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Est. Quantity</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Truck Assigned</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliverySchedule.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.id}</TableCell>
                        <TableCell>{schedule.farmerName}</TableCell>
                        <TableCell>{schedule.product}</TableCell>
                        <TableCell>{schedule.estimatedQuantity}</TableCell>
                        <TableCell>{schedule.scheduledDate}</TableCell>
                        <TableCell>
                          {schedule.truckAssigned ? (
                            <Badge variant="outline">{schedule.truckAssigned}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4" />
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

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{farmers.filter((f) => f.status === "active").length}</span> active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{batches.filter((b) => b.status !== "delivered").length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">{batches.filter((b) => b.status === "in-transit").length}</span> in
                    transit
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Pickups</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deliverySchedule.length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      {deliverySchedule.filter((s) => s.status === "confirmed").length}
                    </span>{" "}
                    confirmed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(farmers.reduce((acc, f) => acc + f.rating, 0) / farmers.length).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Farmer satisfaction</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Farmers</CardTitle>
                  <CardDescription>Based on delivery count and rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farmers
                      .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
                      .slice(0, 3)
                      .map((farmer, index) => (
                        <div key={farmer.id} className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{farmer.name}</p>
                            <p className="text-sm text-muted-foreground">{farmer.totalDeliveries} deliveries</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{farmer.rating}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                  <CardDescription>Products by farmer count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Oranges", "Apples", "Strawberries", "Peaches"].map((crop) => {
                      const count = farmers.filter((f) => f.cropTypes.includes(crop)).length
                      const percentage = (count / farmers.length) * 100
                      return (
                        <div key={crop} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{crop}</span>
                            <span className="text-sm text-muted-foreground">{count} farmers</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
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
