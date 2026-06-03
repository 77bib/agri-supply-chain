"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useI18n } from "@/lib/i18n"
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/product-service"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  quantity: number
  supplier: string
  image?: string
  createdAt: string
  updatedAt: string
}

interface ProductStats {
  totalProducts: number
  totalValue: number
  averagePrice: number
  lowStockCount: number
}

export default function AdminProductsPage() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowStockCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    supplier: "",
    image: ""
  })

  const categories = [
    "Jus",
    "Confitures", 
    "Compotes",
    "Produits Frais",
    "Produits Laitiers",
    "Grains",
    "Boissons",
    "Collations"
  ]

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getAllProducts({
        page,
        limit: 20,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchTerm || undefined,
        sortBy,
        sortOrder
      })
      
      if (response.success) {
        setProducts(response.data)
        setStats(response.stats || {
          totalProducts: 0,
          totalValue: 0,
          averagePrice: 0,
          lowStockCount: 0
        })
        setTotalPages(response.pagination?.pages || 1)
      } else {
        toast.error("Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error fetching products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, selectedCategory, searchTerm, sortBy, sortOrder])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        supplier: formData.supplier.trim(),
        image: formData.image.trim() || undefined
      }

      if (editingProduct) {
        // Update existing product
        const response = await updateProduct(editingProduct._id, productData)
        if (response.success) {
          toast.success("Produit mis à jour avec succès")
          setIsEditDialogOpen(false)
          setEditingProduct(null)
          resetForm()
          fetchProducts()
        } else {
          toast.error(response.message || "Échec de la mise à jour du produit")
        }
      } else {
          // Create a new product
        const response = await createProduct(productData)
        if (response.success) {
          toast.success("Produit créé avec succès")
          setIsCreateDialogOpen(false)
          resetForm()
          fetchProducts()
        } else {
          toast.error(response.message || "Échec de la création du produit")
        }
      }
    } catch (error) {
    console.error("Error while saving the product:", error)
    toast.error("Error while saving the product")
    }
  }

  // Handle deletion
  const handleDelete = async () => {
    if (!deletingProduct) return

    try {
      const response = await deleteProduct(deletingProduct._id)
      if (response.success) {
        toast.success("Product deleted successfully")
        setDeletingProduct(null)
        fetchProducts()
      } else {
        toast.error(response.message || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error while deleting the product:", error)
      toast.error("Error while deleting the product")
    }
  }

  // Reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      quantity: "",
      supplier: "",
      image: ""
    })
  }

  // Open the edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      supplier: product.supplier,
      image: product.image || ""
    })
    setIsEditDialogOpen(true)
  }

  // Obtenir le badge de statut du stock
  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">{t("admin.common.outOfStock")}</Badge>
    } else if (quantity < 10) {
      return <Badge className="bg-orange-100 text-orange-800">{t("admin.common.lowStock")}</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800">{t("admin.common.inStock")}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("admin.products.title")}</h1>
            <p className="text-muted-foreground">{t("admin.products.subtitle")}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchProducts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t("admin.common.refresh")}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.products.add")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t("admin.products.create.title")}</DialogTitle>
                  <DialogDescription>{t("admin.products.create.subtitle")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t("admin.form.productName")} *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t("admin.form.productName.placeholder")}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("admin.form.category")} *</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("admin.form.category.placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t("admin.form.description")}</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={t("admin.form.description.placeholder")}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t("admin.form.price")} *</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("admin.form.quantity")} *</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("admin.form.supplier")} *</label>
                      <Input
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        placeholder={t("admin.form.supplier.placeholder")}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t("admin.form.imageUrl")}</label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                    <Button type="submit">{t("admin.products.create.submit")}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cartes de Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.products.stats.total")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">{t("admin.products.stats.total.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.products.stats.value")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t("admin.products.stats.value.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.products.stats.avgPrice")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averagePrice)}</div>
              <p className="text-xs text-muted-foreground">{t("admin.products.stats.avgPrice.desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.products.stats.lowStock")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</div>
              <p className="text-xs text-muted-foreground">{t("admin.products.stats.lowStock.desc")}</p>
            </CardContent>
          </Card>
        </div>

            {/* Filtres */}
            <Card>
          <CardHeader>
            <CardTitle>{t("admin.common.filtersSearch")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t("admin.products.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                      />
                    </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.form.category")} />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="all">{t("admin.common.allCategories")}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.common.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">{t("admin.common.sort.createdAt")}</SelectItem>
                  <SelectItem value="name">{t("admin.common.sort.name")}</SelectItem>
                  <SelectItem value="price">{t("admin.common.sort.price")}</SelectItem>
                  <SelectItem value="quantity">{t("admin.common.sort.quantity")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.common.sortOrder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{t("admin.common.sortOrder.desc")}</SelectItem>
                  <SelectItem value="asc">{t("admin.common.sortOrder.asc")}</SelectItem>
                </SelectContent>
              </Select>
                </div>
              </CardContent>
            </Card>

        {/* Tableau des Produits */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.products.table.title")}</CardTitle>
            <CardDescription>{t("admin.products.table.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t("admin.products.loading")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description.substring(0, 60)}...</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant="outline">{product.supplier}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(product.price)}</div>
                        <div className="text-sm text-muted-foreground">{t("admin.products.stockLabel")}: {product.quantity}</div>
                        {getStockBadge(product.quantity)}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                              onClick={() => setDeletingProduct(product)}
                        >
                              <Trash2 className="h-4 w-4" />
                        </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("admin.products.delete.title")}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("admin.products.delete.confirm", { name: product.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletingProduct(null)}>
                                {t("cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                {t("admin.common.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                
                {products.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
                  </div>
            )}
                </CardContent>
              </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
            >
              Suivant
            </Button>
                          </div>
        )}
            </div>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Update the product information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Product name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Entrez le nom du produit"
                  required
                      />
                    </div>
                        <div>
                <label className="text-sm font-medium">Category *</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
                  </div>
                  <div>
              <label className="text-sm font-medium">Description</label>
                    <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Entrez la description du produit"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
                      <div>
                <label className="text-sm font-medium">Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
                      </div>
                      <div>
                <label className="text-sm font-medium">Quantity *</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="0"
                  required
                />
                      </div>
                      <div>
                <label className="text-sm font-medium">Supplier *</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  placeholder="Entrez le nom du fournisseur"
                  required
                />
                </div>
                            </div>
                            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
