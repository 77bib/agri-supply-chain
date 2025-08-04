# Frontend Implementation Guide

## نظرة عامة

تم إنشاء واجهة أمامية كاملة لإدارة المنتجات والطلبات في نظام سلسلة التوريد الزراعية. تتضمن الواجهة الأمامية صفحات للمديرين والعملاء مع وظائف متقدمة.

## الصفحات المحدثة والجديدة

### 1. صفحة إدارة المنتجات للمدير (`/admin/products`)

**الميزات:**
- عرض جميع المنتجات مع إحصائيات شاملة
- إضافة منتجات جديدة
- تعديل وحذف المنتجات الموجودة
- تصفية وبحث متقدم
- ترتيب حسب معايير مختلفة
- إدارة المخزون

**الوظائف الرئيسية:**
```typescript
// إضافة منتج جديد
const handleSubmit = async (e: React.FormEvent) => {
  const productData = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    category: formData.category,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    supplier: formData.supplier.trim(),
    image: formData.image.trim() || undefined
  }
  
  const response = await createProduct(productData)
}

// تحديث منتج موجود
const handleUpdate = async (productId: string, data: any) => {
  const response = await updateProduct(productId, data)
}

// حذف منتج
const handleDelete = async (productId: string) => {
  const response = await deleteProduct(productId)
}
```

### 2. صفحة إدارة الطلبات للمدير (`/admin/orders`)

**الميزات:**
- عرض جميع الطلبات مع تفاصيل شاملة
- تحديث حالة الطلبات
- تصفية حسب الحالة والعميل والمنتج
- إحصائيات الطلبات والإيرادات
- تتبع حالة التوصيل

**الوظائف الرئيسية:**
```typescript
// تحديث حالة الطلب
const handleStatusUpdate = async (orderId: string, status: string) => {
  const response = await updateOrderStatus(orderId, { status })
}

// تصفية الطلبات
const fetchOrders = async () => {
  const response = await getAllOrders({
    page,
    limit: 20,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    userId: selectedUserId === "all" ? undefined : selectedUserId,
    productId: selectedProductId === "all" ? undefined : selectedProductId,
    sortBy,
    sortOrder
  })
}
```

### 3. صفحة المنتجات العامة (`/products`)

**الميزات:**
- عرض المنتجات المتاحة للجمهور
- تصفية حسب الفئة والبحث
- إضافة المنتجات للعربة
- عرض حالة المخزون
- ترتيب متقدم

**الوظائف الرئيسية:**
```typescript
// جلب المنتجات العامة
const fetchProducts = async () => {
  const response = await getPublicProducts({
    page,
    limit: 12,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
    sortBy,
    sortOrder
  })
}

// إضافة للعربة
const handleAddToCart = async (product: Product) => {
  const response = await createOrder({
    productId: product._id,
    quantity: 1
  })
}
```

### 4. صفحة تفاصيل المنتج (`/products/[id]`)

**الميزات:**
- عرض تفاصيل شاملة للمنتج
- اختيار الكمية
- إضافة للعربة
- معلومات الشحن والعودة
- منتجات ذات صلة

**الوظائف الرئيسية:**
```typescript
// جلب تفاصيل المنتج
const fetchProduct = async () => {
  const response = await getProductById(productId)
}

// إضافة للعربة مع كمية
const handleAddToCart = async () => {
  const response = await createOrder({
    productId: product._id,
    quantity: quantity
  })
}
```

### 5. صفحة لوحة تحكم المستخدم (`/dashboard`)

**الميزات:**
- عرض طلبات المستخدم الشخصية
- إحصائيات الطلبات والإنفاق
- تصفية حسب حالة الطلب
- إجراءات سريعة

**الوظائف الرئيسية:**
```typescript
// جلب طلبات المستخدم
const fetchOrders = async () => {
  const response = await getMyOrders({
    page,
    limit: 10,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    sortBy,
    sortOrder
  })
}
```

## المكونات المستخدمة

### 1. مكونات UI الأساسية
- `Button` - أزرار تفاعلية
- `Card` - بطاقات عرض المعلومات
- `Input` - حقول الإدخال
- `Select` - قوائم منسدلة
- `Badge` - علامات الحالة
- `Dialog` - نوافذ منبثقة
- `AlertDialog` - نوافذ تأكيد

### 2. أيقونات Lucide React
- `ShoppingCart` - سلة التسوق
- `Package` - المنتجات
- `Truck` - الشحن
- `Clock` - الوقت
- `CheckCircle` - التأكيد
- `XCircle` - الإلغاء
- `RefreshCw` - التحديث

## إدارة الحالة

### 1. استخدام Zustand Store
```typescript
const { currentUser } = useStore()
```

### 2. إدارة الحالة المحلية
```typescript
const [products, setProducts] = useState<Product[]>([])
const [loading, setLoading] = useState(true)
const [page, setPage] = useState(1)
```

## معالجة الأخطاء

### 1. استخدام Toast Notifications
```typescript
import { toast } from "sonner"

// نجاح
toast.success("Product added successfully!")

// خطأ
toast.error("Failed to fetch products")
```

### 2. معالجة الأخطاء في API Calls
```typescript
try {
  const response = await createOrder(orderData)
  if (response.success) {
    toast.success("Order created successfully")
  } else {
    toast.error(response.message || "Failed to create order")
  }
} catch (error) {
  console.error("Error creating order:", error)
  toast.error("Error creating order")
}
```

## التصميم والتفاعل

### 1. تصميم متجاوب
- استخدام Tailwind CSS للتصميم
- تخطيط متجاوب مع Grid و Flexbox
- تصميم محسن للأجهزة المحمولة

### 2. تفاعلات المستخدم
- تحميل متحرك (Loading States)
- تحديث فوري للبيانات
- تأكيدات للحذف والتحديث
- تنقل سلس بين الصفحات

### 3. تحسينات الأداء
- تحميل تدريجي للبيانات
- ترقيم الصفحات (Pagination)
- تصفية على جانب الخادم
- تخزين مؤقت للبيانات

## الأمان والتحقق

### 1. التحقق من المستخدم
```typescript
if (!currentUser) {
  router.push("/login")
  return
}
```

### 2. حماية المسارات
- التحقق من دور المستخدم (Admin/User)
- إعادة التوجيه للمستخدمين غير المصرح لهم
- عرض رسائل مناسبة

## التكامل مع Backend

### 1. استخدام API Services
```typescript
import { getPublicProducts, createOrder } from "@/lib/product-service"
import { getAllOrders, updateOrderStatus } from "@/lib/order-service"
```

### 2. معالجة الاستجابات
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

## الاختبار والتصحيح

### 1. اختبار الوظائف
- اختبار إضافة المنتجات
- اختبار تحديث حالة الطلبات
- اختبار التصفية والبحث
- اختبار الترقيم

### 2. تصحيح الأخطاء
- استخدام Console.log للتصحيح
- معالجة أخطاء الشبكة
- عرض رسائل خطأ مناسبة للمستخدم

## التحسينات المستقبلية

### 1. ميزات إضافية
- نظام تقييم ومراجعات
- قائمة المفضلة
- إشعارات في الوقت الفعلي
- تتبع الشحن المتقدم

### 2. تحسينات الأداء
- تحميل كسول للصور
- تحسين استعلامات قاعدة البيانات
- تخزين مؤقت متقدم
- تحسين SEO

## دليل الاستخدام

### للمديرين:
1. **إدارة المنتجات:**
   - انتقل إلى `/admin/products`
   - انقر على "Add Product" لإضافة منتج جديد
   - استخدم أزرار التعديل والحذف لإدارة المنتجات الموجودة

2. **إدارة الطلبات:**
   - انتقل إلى `/admin/orders`
   - استخدم الفلاتر لتصفية الطلبات
   - انقر على أيقونة التعديل لتحديث حالة الطلب

### للعملاء:
1. **تصفح المنتجات:**
   - انتقل إلى `/products`
   - استخدم الفلاتر والبحث للعثور على المنتجات
   - انقر على "Add to Cart" لإضافة المنتج للعربة

2. **تتبع الطلبات:**
   - انتقل إلى `/dashboard`
   - عرض طلباتك الشخصية وحالتها
   - استخدم الفلاتر لتصفية الطلبات

## استكشاف الأخطاء

### مشاكل شائعة:
1. **عدم تحميل المنتجات:**
   - تحقق من اتصال قاعدة البيانات
   - تحقق من صحة API endpoints

2. **أخطاء في إضافة الطلبات:**
   - تأكد من تسجيل الدخول
   - تحقق من توفر المخزون

3. **مشاكل في التحديث:**
   - تحقق من صلاحيات المستخدم
   - تحقق من صحة البيانات المدخلة

## الخلاصة

تم إنشاء واجهة أمامية شاملة ومتطورة لإدارة المنتجات والطلبات. الواجهة الأمامية تتكامل بشكل مثالي مع Backend وتوفر تجربة مستخدم ممتازة للمديرين والعملاء على حد سواء. 