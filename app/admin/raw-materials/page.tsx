"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { AlertTriangle, CalendarDays, Factory, Leaf, MapPin, Plus, ShieldCheck, Thermometer, Truck } from "lucide-react"
import { toast } from "sonner"

import AdminLayout from "@/components/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/lib/i18n"
import { cn, formatCurrency } from "@/lib/utils"

const STORAGE_KEY = "admin-raw-materials"

type LocalizedText = {
  fr: string
  ar: string
}

type RawMaterialStatus = "healthy" | "warning" | "critical"

interface RawMaterial {
  id: string
  name: LocalizedText
  category: LocalizedText
  unit: LocalizedText
  stock: number
  safetyStock: number
  location: LocalizedText
  status: RawMaterialStatus
  supplier: LocalizedText
  nextDelivery: LocalizedText
  value: number
  expiringSoon: boolean
}

interface RawMaterialFormState {
  nameFr: string
  nameAr: string
  categoryFr: string
  categoryAr: string
  unit: string
  stock: string
  safetyStock: string
  locationFr: string
  locationAr: string
  supplierFr: string
  supplierAr: string
  nextDeliveryFr: string
  nextDeliveryAr: string
  value: string
  status: RawMaterialStatus
  expiringSoon: boolean
}

type DeliveryStatus = "onSchedule" | "delayed" | "requiresInspection"

interface Supplier {
  id: string
  name: LocalizedText
  specialty: LocalizedText
  certification: LocalizedText
  contact: LocalizedText
  reliability: number
}

interface Delivery {
  id: string
  material: LocalizedText
  eta: LocalizedText
  status: DeliveryStatus
  origin: LocalizedText
  quantity: number
  unit: LocalizedText
  temperature: string
}

const statusConfig: Record<RawMaterialStatus, { className: string; labels: LocalizedText }> = {
  healthy: {
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100",
    labels: { fr: "Stable", ar: "مستقر" },
  },
  warning: {
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100",
    labels: { fr: "Under monitoring", ar: "تحت المراقبة" },
  },
  critical: {
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100",
    labels: { fr: "Critical", ar: "حرج" },
  },
}

const deliveryStatusConfig: Record<DeliveryStatus, { className: string; labels: LocalizedText }> = {
  onSchedule: {
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100",
    labels: { fr: "On time", ar: "في الموعد" },
  },
  delayed: {
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100",
    labels: { fr: "Slight delay", ar: "تأخير طفيف" },
  },
  requiresInspection: {
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100",
    labels: { fr: "Inspection required", ar: "يتطلب تفتيش" },
  },
}

const unitOptions: Array<{ value: string; label: LocalizedText }> = [
  { value: "tonnes", label: { fr: "Tons", ar: "طن" } },
  { value: "kg", label: { fr: "Kilograms", ar: "كيلوغرام" } },
  { value: "litres", label: { fr: "Liters", ar: "لتر" } },
  { value: "caisses", label: { fr: "Crates", ar: "صناديق" } },
  { value: "plateaux", label: { fr: "Trays", ar: "صواني" } },
  { value: "sacs", label: { fr: "Bags", ar: "أكياس" } },
]

const defaultRawMaterials: RawMaterial[] = [
  {
    id: "material-1",
    name: { fr: "Oranges Valencia", ar: "برتقال فالنسيا" },
    category: { fr: "Fruits", ar: "فاكهة" },
    unit: { fr: "Crates", ar: "صناديق" },
    stock: 360,
    safetyStock: 300,
    location: { fr: "Chambre froide A", ar: "غرفة التبريد أ" },
    status: "healthy",
    supplier: { fr: "Domaines Mitidja", ar: "ضيعات المتيجة" },
    nextDelivery: { fr: "20 mars · 120 caisses", ar: "20 مارس · 120 صندوق" },
    value: 216000,
    expiringSoon: false,
  },
  {
    id: "material-2",
    name: { fr: "Fraises Gariguette", ar: "فراولة غاريغيت" },
    category: { fr: "Fruits", ar: "فاكهة" },
    unit: { fr: "Trays", ar: "صواني" },
    stock: 180,
    safetyStock: 220,
    location: { fr: "Tunnel frais · Nord", ar: "نفق التبريد · الشمال" },
    status: "warning",
    supplier: { fr: "Coopérative Tizi Ouzou", ar: "تعاونية تيزي وزو" },
    nextDelivery: { fr: "16 mars · 90 plateaux", ar: "16 مارس · 90 صينية" },
    value: 162000,
    expiringSoon: true,
  },
  {
    id: "material-3",
    name: { fr: "Dattes Deglet Nour", ar: "تمر دقلة نور" },
    category: { fr: "Fruits", ar: "فاكهة" },
    unit: { fr: "Crates", ar: "صناديق" },
    stock: 420,
    safetyStock: 350,
    location: { fr: "Réserve sud", ar: "المستودع الجنوبي" },
    status: "healthy",
    supplier: { fr: "Collectif Biskra", ar: "تجمع بسكرة" },
    nextDelivery: { fr: "28 mars · 150 caisses", ar: "28 مارس · 150 صندوق" },
    value: 294000,
    expiringSoon: false,
  },
  {
    id: "material-4",
    name: { fr: "Abricots secs", ar: "مشمش مجفف" },
    category: { fr: "Fruits", ar: "فاكهة" },
    unit: { fr: "Bags", ar: "أكياس" },
    stock: 95,
    safetyStock: 150,
    location: { fr: "Entrepôt ouest", ar: "مستودع الغرب" },
    status: "critical",
    supplier: { fr: "Ferme Blida", ar: "مزرعة البليدة" },
    nextDelivery: { fr: "Programmation requise", ar: "يتطلب جدولة" },
    value: 142500,
    expiringSoon: false,
  },
]

const supplierNetwork: Supplier[] = [
  {
    id: "supplier-1",
    name: { fr: "Domaines Mitidja", ar: "ضيعات المتيجة" },
    specialty: { fr: "Agrumes premium", ar: "حمضيات ممتازة" },
    certification: { fr: "GlobalG.A.P.", ar: "جلوبال جاب" },
    contact: { fr: "Ahmed Benali · +213 540 000 111", ar: "أحمد بن علي · ‎+213 540 000 111" },
    reliability: 98,
  },
  {
    id: "supplier-2",
    name: { fr: "Coopérative Tizi Ouzou", ar: "تعاونية تيزي وزو" },
    specialty: { fr: "Fruits rouges", ar: "فاكهة حمراء" },
    certification: { fr: "Bio DZ", ar: "شهادة بيولوجية" },
    contact: { fr: "Nadia Ouadah · +213 541 220 345", ar: "نادية وعادة · ‎+213 541 220 345" },
    reliability: 95,
  },
  {
    id: "supplier-3",
    name: { fr: "Collectif Biskra", ar: "تجمع بسكرة" },
    specialty: { fr: "Dattes sélectionnées", ar: "تمور مختارة" },
    certification: { fr: "Label Qualité", ar: "علامة الجودة" },
    contact: { fr: "Karim Aït Saïd · +213 548 889 201", ar: "كريم آيت سعيد · ‎+213 548 889 201" },
    reliability: 87,
  },
]

const upcomingDeliveries: Delivery[] = [
  {
    id: "delivery-1",
    material: { fr: "Oranges Valencia", ar: "برتقال فالنسيا" },
    eta: { fr: "20 mars 2024", ar: "20 مارس 2024" },
    status: "onSchedule",
    origin: { fr: "Blida", ar: "البليدة" },
    quantity: 120,
    unit: { fr: "Crates", ar: "صناديق" },
    temperature: "4°C",
  },
  {
    id: "delivery-2",
    material: { fr: "Fraises Gariguette", ar: "فراولة غاريغيت" },
    eta: { fr: "16 mars 2024", ar: "16 مارس 2024" },
    status: "delayed",
    origin: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
    quantity: 90,
    unit: { fr: "Trays", ar: "صواني" },
    temperature: "2°C",
  },
  {
    id: "delivery-3",
    material: { fr: "Abricots secs", ar: "مشمش مجفف" },
    eta: { fr: "11 mars 2024", ar: "11 مارس 2024" },
    status: "requiresInspection",
    origin: { fr: "Ghardaïa", ar: "غرداية" },
    quantity: 60,
    unit: { fr: "Bags", ar: "أكياس" },
    temperature: "8°C",
  },
]

const initialFormState: RawMaterialFormState = {
  nameFr: "",
  nameAr: "",
  categoryFr: "",
  categoryAr: "",
  unit: unitOptions[0]?.value ?? "tonnes",
  stock: "",
  safetyStock: "",
  locationFr: "",
  locationAr: "",
  supplierFr: "",
  supplierAr: "",
  nextDeliveryFr: "",
  nextDeliveryAr: "",
  value: "",
  status: "healthy",
  expiringSoon: false,
}

const parseNumericInput = (value: string): number => {
  const normalized = value.replace(/[^0-9.,-]/g, "").replace(",", ".")
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

const buildLocalizedValue = (primary: string, fallback: string): string => {
  const trimmed = primary.trim()
  if (trimmed.length > 0) {
    return trimmed
  }
  const backup = fallback.trim()
  return backup.length > 0 ? backup : "-"
}

export default function AdminRawMaterialsPage() {
  const { t, locale } = useI18n()
  const [materials, setMaterials] = useState<RawMaterial[]>(defaultRawMaterials)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formState, setFormState] = useState<RawMaterialFormState>({ ...initialFormState })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored) as RawMaterial[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMaterials(parsed)
      }
    } catch (error) {
      console.warn("Unable to load raw materials from localStorage", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(materials))
    } catch (error) {
      console.error("Unable to persist raw materials to localStorage", error)
      toast.error(t("admin.rawMaterials.storage.unsupported"))
    }
  }, [materials, t])

  const lowStockMaterials = useMemo(
    () => materials.filter((item) => item.stock <= item.safetyStock),
    [materials]
  )
  const expiringMaterials = useMemo(
    () => materials.filter((item) => item.expiringSoon),
    [materials]
  )
  const deliveriesNeedingAttention = useMemo(
    () => upcomingDeliveries.filter((delivery) => delivery.status !== "onSchedule"),
    []
  )
  const totalValue = useMemo(
    () => materials.reduce((sum, item) => sum + item.value, 0),
    [materials]
  )

  const totalMaterials = materials.length
  const certifiedSuppliers = supplierNetwork.length
  const inTransitDeliveries = upcomingDeliveries.length
  const lowStockCount = lowStockMaterials.length
  const expiringCount = expiringMaterials.length

  const resetForm = () => {
    setFormState({ ...initialFormState })
  }

  const handleAddMaterial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const unitLabels = unitOptions.find((option) => option.value === formState.unit)?.label ?? unitOptions[0]!.label

    const stock = parseNumericInput(formState.stock)
    const safetyStock = parseNumericInput(formState.safetyStock)
    const estimatedValue = parseNumericInput(formState.value)

    const newMaterial: RawMaterial = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `material-${Date.now()}`,
      name: {
        fr: buildLocalizedValue(formState.nameFr, formState.nameFr),
        ar: buildLocalizedValue(formState.nameAr, formState.nameFr),
      },
      category: {
        fr: buildLocalizedValue(formState.categoryFr, formState.nameFr),
        ar: buildLocalizedValue(formState.categoryAr, formState.categoryFr),
      },
      unit: unitLabels,
      stock,
      safetyStock,
      location: {
        fr: buildLocalizedValue(formState.locationFr, formState.nameFr),
        ar: buildLocalizedValue(formState.locationAr, formState.locationFr),
      },
      status: formState.status,
      supplier: {
        fr: buildLocalizedValue(formState.supplierFr, formState.nameFr),
        ar: buildLocalizedValue(formState.supplierAr, formState.supplierFr),
      },
      nextDelivery: {
        fr: buildLocalizedValue(formState.nextDeliveryFr, formState.nameFr),
        ar: buildLocalizedValue(formState.nextDeliveryAr, formState.nextDeliveryFr),
      },
      value: estimatedValue,
      expiringSoon: formState.expiringSoon,
    }

    setMaterials((previous) => [...previous, newMaterial])
    setAddDialogOpen(false)
    resetForm()
    toast.success(t("admin.rawMaterials.toast.saved"))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("admin.rawMaterials.title")}</h1>
            <p className="text-muted-foreground">{t("admin.rawMaterials.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{t("admin.rawMaterials.scheduleDelivery")}</span>
            </Button>
            <Dialog
              open={addDialogOpen}
              onOpenChange={(open) => {
                setAddDialogOpen(open)
                if (!open) {
                  resetForm()
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{t("admin.rawMaterials.addMaterial")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleAddMaterial} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("admin.rawMaterials.form.title")}</DialogTitle>
                    <DialogDescription>{t("admin.rawMaterials.form.description")}</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nameFr">{t("admin.rawMaterials.form.name.fr")}</Label>
                        <Input
                          id="nameFr"
                          value={formState.nameFr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, nameFr: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameAr">{t("admin.rawMaterials.form.name.ar")}</Label>
                        <Input
                          id="nameAr"
                          value={formState.nameAr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, nameAr: event.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="categoryFr">{t("admin.rawMaterials.form.category.fr")}</Label>
                        <Input
                          id="categoryFr"
                          value={formState.categoryFr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, categoryFr: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryAr">{t("admin.rawMaterials.form.category.ar")}</Label>
                        <Input
                          id="categoryAr"
                          value={formState.categoryAr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, categoryAr: event.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="unit">{t("admin.rawMaterials.form.unit")}</Label>
                        <Select
                          value={formState.unit}
                          onValueChange={(value) => setFormState((prev) => ({ ...prev, unit: value }))}
                        >
                          <SelectTrigger id="unit">
                            <SelectValue placeholder={unitOptions[0]?.label[locale]} />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label[locale]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">{t("admin.rawMaterials.form.stock")}</Label>
                        <Input
                          id="stock"
                          type="number"
                          min={0}
                          step="0.01"
                          value={formState.stock}
                          onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="safetyStock">{t("admin.rawMaterials.form.safetyStock")}</Label>
                        <Input
                          id="safetyStock"
                          type="number"
                          min={0}
                          step="0.01"
                          value={formState.safetyStock}
                          onChange={(event) => setFormState((prev) => ({ ...prev, safetyStock: event.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="locationFr">{t("admin.rawMaterials.form.location.fr")}</Label>
                        <Input
                          id="locationFr"
                          value={formState.locationFr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, locationFr: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="locationAr">{t("admin.rawMaterials.form.location.ar")}</Label>
                        <Input
                          id="locationAr"
                          value={formState.locationAr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, locationAr: event.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="supplierFr">{t("admin.rawMaterials.form.supplier.fr")}</Label>
                        <Input
                          id="supplierFr"
                          value={formState.supplierFr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, supplierFr: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplierAr">{t("admin.rawMaterials.form.supplier.ar")}</Label>
                        <Input
                          id="supplierAr"
                          value={formState.supplierAr}
                          onChange={(event) => setFormState((prev) => ({ ...prev, supplierAr: event.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nextDeliveryFr">{t("admin.rawMaterials.form.nextDelivery.fr")}</Label>
                        <Input
                          id="nextDeliveryFr"
                          value={formState.nextDeliveryFr}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, nextDeliveryFr: event.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextDeliveryAr">{t("admin.rawMaterials.form.nextDelivery.ar")}</Label>
                        <Input
                          id="nextDeliveryAr"
                          value={formState.nextDeliveryAr}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, nextDeliveryAr: event.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="value">{t("admin.rawMaterials.form.value")}</Label>
                        <Input
                          id="value"
                          type="number"
                          min={0}
                          step="0.01"
                          value={formState.value}
                          onChange={(event) => setFormState((prev) => ({ ...prev, value: event.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">{t("admin.rawMaterials.form.status")}</Label>
                        <Select
                          value={formState.status}
                          onValueChange={(value) => setFormState((prev) => ({ ...prev, status: value as RawMaterialStatus }))}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder={t("admin.rawMaterials.form.status.healthy")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="healthy">{t("admin.rawMaterials.form.status.healthy")}</SelectItem>
                            <SelectItem value="warning">{t("admin.rawMaterials.form.status.warning")}</SelectItem>
                            <SelectItem value="critical">{t("admin.rawMaterials.form.status.critical")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-md border border-dashed p-3">
                      <Checkbox
                        id="expiringSoon"
                        checked={formState.expiringSoon}
                        onCheckedChange={(checked) =>
                          setFormState((prev) => ({ ...prev, expiringSoon: checked === true }))
                        }
                      />
                      <Label htmlFor="expiringSoon" className="text-sm">
                        {t("admin.rawMaterials.form.expiring")}
                      </Label>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAddDialogOpen(false)
                        resetForm()
                      }}
                    >
                      {t("admin.rawMaterials.form.cancel")}
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>{t("admin.rawMaterials.form.submit")}</span>
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.rawMaterials.metrics.totalMaterials")}</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaterials}</div>
              <p className="text-xs text-muted-foreground">{t("admin.rawMaterials.overview.currentStock")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.rawMaterials.metrics.certified")}</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certifiedSuppliers}</div>
              <p className="text-xs text-muted-foreground">{t("admin.rawMaterials.overview.certificationStatus")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.rawMaterials.metrics.inTransit")}</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransitDeliveries}</div>
              <p className="text-xs text-muted-foreground">{t("admin.rawMaterials.deliveries.timeline")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.rawMaterials.metrics.stockValue")}</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t("admin.rawMaterials.overview.alerts")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="pb-0">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-xl">{t("admin.rawMaterials.title")}</CardTitle>
                  <CardDescription>{t("admin.rawMaterials.subtitle")}</CardDescription>
                </div>
                <TabsList className="grid w-full grid-cols-3 lg:w-auto">
                  <TabsTrigger value="overview">{t("admin.rawMaterials.tabs.overview")}</TabsTrigger>
                  <TabsTrigger value="suppliers">{t("admin.rawMaterials.tabs.suppliers")}</TabsTrigger>
                  <TabsTrigger value="deliveries">{t("admin.rawMaterials.tabs.deliveries")}</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>{t("admin.rawMaterials.overview.currentStock")}</CardTitle>
                      <CardDescription>{t("admin.rawMaterials.subtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("admin.rawMaterials.table.material")}</TableHead>
                            <TableHead>{t("admin.rawMaterials.table.category")}</TableHead>
                            <TableHead>{t("admin.rawMaterials.table.stock")}</TableHead>
                            <TableHead>{t("admin.rawMaterials.table.location")}</TableHead>
                            <TableHead>{t("admin.rawMaterials.table.status")}</TableHead>
                            <TableHead className="text-right">{t("admin.rawMaterials.table.nextDelivery")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materials.map((item) => {
                            const status = statusConfig[item.status]
                            const safeCapacity = Math.max(item.safetyStock * 1.5, item.stock, 1)
                            const stockRatio = Math.min(100, Math.round((item.stock / safeCapacity) * 100))

                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{item.name[locale]}</span>
                                    <span className="text-xs text-muted-foreground">{item.supplier[locale]}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.category[locale]}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>
                                        {item.stock} {item.unit[locale]}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {t("admin.inventory.stock.min")}: {item.safetyStock} {item.unit[locale]}
                                      </span>
                                    </div>
                                    <Progress value={stockRatio} />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{item.location[locale]}</span>
                                    <span className="text-xs text-muted-foreground">{formatCurrency(item.value)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn("font-normal", status.className)}>{status.labels[locale]}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end">
                                    <span>{item.nextDelivery[locale]}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          {t("admin.rawMaterials.overview.alerts")}
                        </CardTitle>
                        <CardDescription>{t("admin.rawMaterials.overview.currentStock")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="rounded-lg border border-border p-3">
                          <p className="font-medium">
                            {t("admin.rawMaterials.alerts.lowStock", { count: lowStockCount })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("admin.rawMaterials.table.material")}: {" "}
                            {lowStockMaterials.length > 0
                              ? lowStockMaterials.map((item) => item.name[locale]).join(" • ")
                              : "-"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className="font-medium">
                            {t("admin.rawMaterials.alerts.expiring", { count: expiringCount })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("admin.rawMaterials.table.nextDelivery")}: {" "}
                            {expiringMaterials.length > 0
                              ? expiringMaterials.map((item) => item.nextDelivery[locale]).join(" • ")
                              : "-"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className="font-medium">
                            {t("admin.rawMaterials.alerts.disruptions", {
                              count: deliveriesNeedingAttention.length,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("admin.rawMaterials.tabs.deliveries")}: {" "}
                            {deliveriesNeedingAttention.length > 0
                              ? deliveriesNeedingAttention.map((delivery) => delivery.material[locale]).join(" • ")
                              : "-"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">
                          {t("admin.rawMaterials.overview.certificationStatus")}
                        </CardTitle>
                        <CardDescription>{t("admin.rawMaterials.suppliers.subtitle")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {supplierNetwork.map((supplier) => (
                          <div key={supplier.id} className="rounded-lg border border-dashed p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{supplier.name[locale]}</p>
                                <p className="text-xs text-muted-foreground">{supplier.specialty[locale]}</p>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
                                {supplier.certification[locale]}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{supplier.contact[locale]}</span>
                              <span>{supplier.reliability}% SLA</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suppliers">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {supplierNetwork.map((supplier) => (
                    <Card key={supplier.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{supplier.name[locale]}</CardTitle>
                        <CardDescription>{supplier.specialty[locale]}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t("admin.rawMaterials.metrics.certified")}</span>
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
                            {supplier.certification[locale]}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">SLA</span>
                          <span className="font-semibold">{supplier.reliability}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("admin.form.supplier")}</span>
                          <p className="font-medium">{supplier.contact[locale]}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="deliveries" className="space-y-4">
                {upcomingDeliveries.map((delivery) => {
                  const status = deliveryStatusConfig[delivery.status]
                  return (
                    <Card key={delivery.id}>
                      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-base">{delivery.material[locale]}</CardTitle>
                          <CardDescription>
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              {delivery.eta[locale]}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge className={cn("w-fit", status.className)}>{status.labels[locale]}</Badge>
                      </CardHeader>
                      <CardContent className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{delivery.origin[locale]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {delivery.quantity} {delivery.unit[locale]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>{delivery.temperature}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  )
}