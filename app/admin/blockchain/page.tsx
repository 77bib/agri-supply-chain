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
  QrCode,
  Plus,
  Search,
  Shield,
  CheckCircle,
  Clock,
  Truck,
  Factory,
  Warehouse,
  Eye,
  Copy,
  Download,
  Hash,
  Package,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { QRCodeSVG } from "qrcode.react"
import { useI18n } from "@/lib/i18n"

type TraceStageKey = "harvest" | "transport" | "processing" | "packaging" | "storage" | "quality"

const stageTranslationKeys: Record<TraceStageKey, string> = {
  harvest: "admin.blockchain.stages.harvest",
  transport: "admin.blockchain.stages.transport",
  processing: "admin.blockchain.stages.processing",
  packaging: "admin.blockchain.stages.packaging",
  storage: "admin.blockchain.stages.storage",
  quality: "admin.blockchain.stages.quality",
}

// Mock blockchain data
const blockchainBatches = [
  {
    id: "BLOCK-001",
    batchId: "BATCH-OJ-001",
    productName: "Premium Orange Juice",
    blockHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    transactionHash: "0x9876543210fedcba0987654321fedcba09876543",
    timestamp: "2024-01-20T10:30:00Z",
    status: "confirmed",
    confirmations: 12,
    gasUsed: "21000",
    farmer: "Green Valley Farm",
    quantity: "500 bottles",
    qualityGrade: "A+",
    certifications: ["Organic", "Fair Trade"],
    traceSteps: [
      {
        stageKey: "harvest" as TraceStageKey,
        location: "Ferme Green Valley, CA",
        timestamp: "2024-01-15T08:00:00Z",
        actor: "Maria Rodriguez",
        hash: "0xabc123...",
        details: "Organic oranges harvested at optimal ripeness",
      },
      {
        stageKey: "transport" as TraceStageKey,
        location: "Autoroute 101 → Usine",
        timestamp: "2024-01-15T14:30:00Z",
        actor: "Transport Co TR-001",
        hash: "0xdef456...",
        details: "Temperature maintained at 4°C during transport",
      },
      {
        stageKey: "processing" as TraceStageKey,
        location: "Usine de Traitement FreshChain",
        timestamp: "2024-01-16T09:00:00Z",
        actor: "John Smith (Quality Manager)",
        hash: "0x789xyz...",
        details: "Juice extracted and pasteurized according to standards",
      },
      {
        stageKey: "packaging" as TraceStageKey,
        location: "Usine de Traitement FreshChain",
        timestamp: "2024-01-16T15:00:00Z",
        actor: "Jane Doe (Chef de Production)",
        hash: "0x456def...",
        details: "Bottled in recycled glass containers with QR codes",
      },
      {
        stageKey: "storage" as TraceStageKey,
        location: "Warehouse A",
        timestamp: "2024-01-17T10:00:00Z",
        actor: "Mike Johnson (Warehouse Manager)",
        hash: "0x123abc...",
        details: "Stored at optimal temperature and humidity",
      },
    ],
  },
  {
    id: "BLOCK-002",
    batchId: "BATCH-SJ-002",
    productName: "Strawberry Jam",
    blockHash: "0x2b3c4d5e6f7890ab1234567890abcdef12345678",
    transactionHash: "0x8765432109fedcba9876543210fedcba98765432",
    timestamp: "2024-01-18T14:15:00Z",
    status: "pending",
    confirmations: 3,
    gasUsed: "18500",
    farmer: "Berry Fresh Co",
    quantity: "200 pots",
    qualityGrade: "A",
    certifications: ["Organic", "Local"],
    traceSteps: [
      {
        stageKey: "harvest" as TraceStageKey,
        location: "Berry Fresh Co, OR",
        timestamp: "2024-01-10T06:00:00Z",
        actor: "Sarah Johnson",
        hash: "0x111aaa...",
        details: "Fresh strawberries picked at dawn for maximum freshness",
      },
      {
        stageKey: "transport" as TraceStageKey,
        location: "Ferme → Traitement",
        timestamp: "2024-01-10T12:00:00Z",
        actor: "Transport Co TR-002",
        hash: "0x222bbb...",
        details: "Cold chain maintained throughout transport",
      },
      {
        stageKey: "processing" as TraceStageKey,
        location: "Usine de Traitement FreshChain",
        timestamp: "2024-01-12T10:00:00Z",
        actor: "Alice Brown (Processing Lead)",
        hash: "0x333ccc...",
        details: "Strawberries processed into jam with minimal sugar",
      },
    ],
  },
  {
    id: "BLOCK-003",
    batchId: "BATCH-AC-003",
    productName: "Apple Compote",
    blockHash: "0x3c4d5e6f7890ab1234567890abcdef123456789a",
    transactionHash: "0x7654321098fedcba7654321098fedcba76543210",
    timestamp: "2024-01-19T11:45:00Z",
    status: "confirmed",
    confirmations: 8,
    gasUsed: "19200",
    farmer: "Mountain Orchards",
    quantity: "300 pots",
    qualityGrade: "A+",
    certifications: ["Organic", "Heirloom Variety"],
    traceSteps: [
      {
        stageKey: "harvest" as TraceStageKey,
        location: "Mountain Orchards, WA",
        timestamp: "2024-01-08T07:00:00Z",
        actor: "John Smith",
        hash: "0x444ddd...",
        details: "Hand-picked heirloom apples",
      },
      {
        stageKey: "transport" as TraceStageKey,
        location: "Verger → Usine",
        timestamp: "2024-01-08T16:00:00Z",
        actor: "Transport Co TR-003",
        hash: "0x555eee...",
        details: "Apples transported in ventilated containers",
      },
      {
        stageKey: "processing" as TraceStageKey,
        location: "Usine de Traitement FreshChain",
        timestamp: "2024-01-10T08:00:00Z",
        actor: "Bob Wilson (Head Chef)",
        hash: "0x666fff...",
        details: "Compote cooked slowly according to the traditional recipe",
      },
      {
        stageKey: "quality" as TraceStageKey,
        location: "Quality Control Lab",
        timestamp: "2024-01-10T14:00:00Z",
        actor: "Dr. Emma Davis (QC Lead)",
        hash: "0x777ggg...",
        details: "Complies with all quality and safety standards",
      },
      {
        stageKey: "storage" as TraceStageKey,
        location: "Warehouse B",
        timestamp: "2024-01-11T09:00:00Z",
        actor: "Tom Anderson (Storage Lead)",
        hash: "0x888hhh...",
        details: "Stored under optimal conditions with batch tracking",
      },
    ],
  },
]

const blockchainStats = {
  totalBatches: 156,
  confirmedBlocks: 142,
  pendingBlocks: 14,
  averageConfirmationTime: "4.2 minutes",
  totalTransactions: 1247,
  gasEfficiency: "98.5%",
}

export default function BlockchainPage() {
  const [selectedTab, setSelectedTab] = useState("batches")
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(blockchainBatches[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [qrCodeData, setQrCodeData] = useState("")
  const { t } = useI18n()

  const filteredBatches = blockchainBatches.filter(
    (batch) =>
      batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.farmer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      confirmed: t("admin.blockchain.status.confirmed"),
      pending: t("admin.blockchain.status.pending"),
      failed: t("admin.blockchain.status.failed"),
      default: t("admin.blockchain.status.unknown"),
    }

    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">{labels.confirmed}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{labels.pending}</Badge>
      case "failed":
        return <Badge variant="destructive">{labels.failed}</Badge>
      default:
        return <Badge variant="outline">{labels.default}</Badge>
    }
  }

  const getStageIcon = (stageKey: TraceStageKey | string) => {
    switch (stageKey) {
      case "harvest":
        return <Factory className="h-4 w-4 text-green-600" />
      case "transport":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Factory className="h-4 w-4 text-purple-600" />
      case "packaging":
        return <Package className="h-4 w-4 text-orange-600" />
      case "storage":
        return <Warehouse className="h-4 w-4 text-gray-600" />
      case "quality":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const generateQRCode = (batch: any) => {
    const qrData = JSON.stringify({
      batchId: batch.batchId,
      productName: batch.productName,
      blockHash: batch.blockHash,
      farmer: batch.farmer,
      timestamp: batch.timestamp,
      traceUrl: `https://brijuice.com/trace/${batch.batchId}`,
    })
    setQrCodeData(qrData)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("admin.blockchain.title")}</h1>
            <p className="text-muted-foreground">{t("admin.blockchain.subtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.blockchain.actions.registerLot")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("admin.blockchain.dialog.title")}</DialogTitle>
                  <DialogDescription>{t("admin.blockchain.dialog.description")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batchId">{t("admin.blockchain.fields.batchId")}</Label>
                    <Input id="batchId" placeholder={t("admin.blockchain.placeholders.batchId")} />
                  </div>
                  <div>
                    <Label htmlFor="productName">{t("admin.blockchain.fields.productName")}</Label>
                    <Input id="productName" placeholder={t("admin.blockchain.placeholders.productName")} />
                  </div>
                  <div>
                    <Label htmlFor="farmer">{t("admin.blockchain.fields.farmer")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.blockchain.placeholders.farmer")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green-valley">Ferme Green Valley</SelectItem>
                        <SelectItem value="berry-fresh">Berry Fresh Co</SelectItem>
                        <SelectItem value="mountain-orchards">Mountain Orchards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">{t("admin.blockchain.fields.quantity")}</Label>
                      <Input id="quantity" placeholder={t("admin.blockchain.placeholders.quantity")} />
                    </div>
                    <div>
                      <Label htmlFor="quality">{t("admin.blockchain.fields.quality")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t("admin.blockchain.placeholders.quality")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="certifications">{t("admin.blockchain.fields.certifications")}</Label>
                    <Input id="certifications" placeholder={t("admin.blockchain.placeholders.certifications")} />
                  </div>
                  <div>
                    <Label htmlFor="initialData">{t("admin.blockchain.fields.initialData")}</Label>
                    <Textarea
                      id="initialData"
                      placeholder={t("admin.blockchain.placeholders.initialData")}
                      className="h-20"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button onClick={() => setIsRegisterDialogOpen(false)}>
                      {t("admin.blockchain.actions.submit")}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.blockchain.stats.totalBatches.title")}
              </CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockchainStats.totalBatches}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{blockchainStats.confirmedBlocks}</span>{" "}
                {t("admin.blockchain.stats.totalBatches.subtitle")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.blockchain.stats.pending.title")}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockchainStats.pendingBlocks}</div>
              <p className="text-xs text-muted-foreground">
                {t("admin.blockchain.stats.pending.subtitle", {
                  time: blockchainStats.averageConfirmationTime,
                })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.blockchain.stats.transactions.title")}
              </CardTitle>
              <Hash className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockchainStats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {t("admin.blockchain.stats.transactions.subtitle")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.blockchain.stats.gas.title")}
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockchainStats.gasEfficiency}</div>
              <p className="text-xs text-muted-foreground">
                {t("admin.blockchain.stats.gas.subtitle")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="batches">{t("admin.blockchain.tabs.batches")}</TabsTrigger>
            <TabsTrigger value="trace">{t("admin.blockchain.tabs.trace")}</TabsTrigger>
            <TabsTrigger value="qr-codes">{t("admin.blockchain.tabs.qr")}</TabsTrigger>
            <TabsTrigger value="verification">{t("admin.blockchain.tabs.verification")}</TabsTrigger>
          </TabsList>

          <TabsContent value="batches" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("admin.blockchain.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Batches Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.blockchain.table.batchId")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.product")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.farmer")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.quantity")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.status")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.confirmations")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.timestamp")}</TableHead>
                      <TableHead>{t("admin.blockchain.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{batch.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {t("admin.blockchain.table.note")} {batch.qualityGrade}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{batch.farmer}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{batch.confirmations}/12</span>
                            <Progress value={(batch.confirmations / 12) * 100} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{new Date(batch.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedBatch(batch)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => generateQRCode(batch)}>
                              <QrCode className="h-4 w-4" />
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

          <TabsContent value="trace" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.details.title")}</CardTitle>
                  <CardDescription>
                    {t("admin.blockchain.details.selectedLot", { id: selectedBatch.batchId })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("admin.blockchain.fields.productName")}</Label>
                      <p className="font-medium">{selectedBatch.productName}</p>
                    </div>
                    <div>
                      <Label>{t("admin.blockchain.fields.quality")}</Label>
                      <Badge>{selectedBatch.qualityGrade}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("admin.blockchain.fields.farmer")}</Label>
                      <p className="font-medium">{selectedBatch.farmer}</p>
                    </div>
                    <div>
                      <Label>{t("admin.blockchain.fields.quantity")}</Label>
                      <p className="font-medium">{selectedBatch.quantity}</p>
                    </div>
                  </div>
                  <div>
                    <Label>{t("admin.blockchain.details.certifications")}</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBatch.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>{t("admin.blockchain.details.blockHash")}</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs bg-muted p-1 rounded flex-1 truncate">{selectedBatch.blockHash}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedBatch.blockHash)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>{t("admin.blockchain.details.transactionHash")}</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                        {selectedBatch.transactionHash}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedBatch.transactionHash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.timeline.title")}</CardTitle>
                  <CardDescription>{t("admin.blockchain.timeline.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBatch.traceSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          {getStageIcon(step.stageKey)}
                          {index < selectedBatch.traceSteps.length - 1 && (
                            <div className="w-px h-12 bg-border mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{t(stageTranslationKeys[step.stageKey])}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(step.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.location}</p>
                          <p className="text-sm">{step.details}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {t("admin.blockchain.timeline.actor")} {step.actor}
                            </span>
                            <code className="text-xs bg-muted px-1 rounded">{step.hash}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2"
                              onClick={() => copyToClipboard(step.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr-codes" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.qr.generator.title")}</CardTitle>
                  <CardDescription>{t("admin.blockchain.qr.generator.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="batchSelect">{t("admin.blockchain.qr.generator.selectLabel")}</Label>
                    <Select
                      onValueChange={(value) => {
                        const batch = blockchainBatches.find((b) => b.id === value)
                        if (batch) generateQRCode(batch)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.blockchain.qr.generator.selectPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {blockchainBatches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.batchId} - {batch.productName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {qrCodeData && (
                    <div className="space-y-4">
                      <div className="flex justify-center p-6 bg-white rounded-lg border">
                        <QRCodeSVG value={qrCodeData} size={200} />
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          {t("admin.blockchain.qr.generator.downloadPng")}
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          {t("admin.blockchain.qr.generator.downloadSvg")}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.qr.data.title")}</CardTitle>
                  <CardDescription>{t("admin.blockchain.qr.data.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {qrCodeData ? (
                    <div className="space-y-4">
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-80">
                        {JSON.stringify(JSON.parse(qrCodeData), null, 2)}
                      </pre>
                      <Button variant="outline" onClick={() => copyToClipboard(qrCodeData)} className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        {t("admin.blockchain.qr.data.copyJson")}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {t("admin.blockchain.qr.data.emptyState")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.blockchain.qr.gallery.title")}</CardTitle>
                <CardDescription>{t("admin.blockchain.qr.gallery.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {blockchainBatches.map((batch) => (
                    <Card key={batch.id} className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <QRCodeSVG
                          value={JSON.stringify({
                            batchId: batch.batchId,
                            productName: batch.productName,
                            blockHash: batch.blockHash,
                            traceUrl: `https://brijuice.com/trace/${batch.batchId}`,
                          })}
                          size={100}
                        />
                      </div>
                      <p className="text-xs font-medium">{batch.batchId}</p>
                      <p className="text-xs text-muted-foreground truncate">{batch.productName}</p>
                      <div className="flex space-x-1 mt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.blockchain.verification.title")}</CardTitle>
                <CardDescription>{t("admin.blockchain.verification.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="verifyInput">{t("admin.blockchain.verification.inputLabel")}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verifyInput"
                      placeholder={t("admin.blockchain.verification.inputPlaceholder")}
                      className="flex-1"
                    />
                    <Button>{t("admin.blockchain.verification.verifyButton")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.verification.results.title")}</CardTitle>
                  <CardDescription>{t("admin.blockchain.verification.results.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("admin.blockchain.verification.results.blockHashValid.title")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.blockchain.verification.results.blockHashValid.description")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("admin.blockchain.verification.results.transactionConfirmed.title")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.blockchain.verification.results.transactionConfirmed.description")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("admin.blockchain.verification.results.dataIntegrity.title")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.blockchain.verification.results.dataIntegrity.description")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("admin.blockchain.verification.results.certValid.title")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("admin.blockchain.verification.results.certValid.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.blockchain.network.title")}</CardTitle>
                  <CardDescription>{t("admin.blockchain.network.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.blockchain.network.statusLabel")}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {t("admin.blockchain.network.online")}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.blockchain.network.blockHeight")}</span>
                      <span className="text-sm font-medium">1 247 892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.blockchain.network.gasPrice")}</span>
                      <span className="text-sm font-medium">20 Gwei</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.blockchain.network.networkLoad")}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-16 h-2" />
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("admin.blockchain.network.avgConfirmationTime")}</span>
                      <span className="text-sm font-medium">4,2 min</span>
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
