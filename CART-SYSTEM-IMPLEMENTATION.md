# نظام السلة والدفع - AgriChain

## نظرة عامة

تم تنفيذ نظام سلة متكامل للعملاء مع إمكانية إضافة المنتجات وتعديل الكميات والانتقال للدفع.

## الميزات المضافة

### 1. بطاقة المنتج المحسنة للعملاء

#### الموقع: `app/products/page.tsx`

**الميزات:**
- عرض عدد العناصر في السلة لكل منتج
- محدد كمية تفاعلي (+/-)
- إضافة المنتجات للسلة مع الكمية المحددة
- عرض ملخص السلة في أعلى الصفحة
- تحسينات في التصميم والتفاعل

**الوظائف الرئيسية:**
```typescript
// إضافة منتج للسلة
const handleAddToCart = (product: Product) => {
  const quantity = quantities[product._id] || 1
  const cartProduct = {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image || "",
    category: product.category,
    stock: product.quantity,
    batchId: "",
    harvestDate: "",
    expiryDate: "",
    farmer: product.supplier,
    certifications: []
  }
  addToCart(cartProduct, quantity)
}

// تعديل الكمية
const handleQuantityChange = (productId: string, newQuantity: number) => {
  if (newQuantity < 1) return
  setQuantities(prev => ({ ...prev, [productId]: newQuantity }))
}
```

### 2. صفحة السلة المتكاملة

#### الموقع: `app/cart/page.tsx`

**الميزات:**
- عرض جميع المنتجات في السلة
- تعديل الكميات مباشرة
- حذف منتجات منفردة
- مسح السلة بالكامل
- حساب التكلفة الإجمالية (المجموع الفرعي + الشحن + الضرائب)
- الانتقال لصفحة الدفع

**الوظائف الرئيسية:**
```typescript
// حساب التكاليف
const calculateSubtotal = () => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}

const calculateShipping = () => {
  return cart.length > 0 ? 10 : 0 // تكلفة شحن ثابتة
}

const calculateTax = () => {
  return calculateSubtotal() * 0.15 // ضريبة 15%
}

const calculateTotal = () => {
  return calculateSubtotal() + calculateShipping() + calculateTax()
}
```

### 3. صفحة الدفع المتكاملة

#### الموقع: `app/checkout/page.tsx`

**الميزات:**
- نموذج معلومات الشحن
- نموذج معلومات الدفع
- التحقق من صحة البيانات
- ملخص الطلب
- إنشاء الطلبات في قاعدة البيانات
- مسح السلة بعد الطلب الناجح

**الوظائف الرئيسية:**
```typescript
// التحقق من صحة النموذج
const validateForm = () => {
  const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
  const requiredPaymentFields = ['cardNumber', 'cardHolder', 'expiryMonth', 'expiryYear', 'cvv']

  for (const field of requiredShippingFields) {
    if (!shippingInfo[field as keyof ShippingInfo]) {
      toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
      return false
    }
  }
  return true
}

// إنشاء الطلب
const handlePlaceOrder = async () => {
  if (!validateForm()) return

  setLoading(true)
  try {
    const orderPromises = cart.map(item => 
      createOrder({
        productId: item.product.id,
        quantity: item.quantity
      })
    )

    await Promise.all(orderPromises)
    clearCart()
    toast.success("Order placed successfully!")
    router.push("/dashboard")
  } catch (error) {
    toast.error("Failed to place order. Please try again.")
  } finally {
    setLoading(false)
  }
}
```

### 4. تحديث Header

#### الموقع: `components/header.tsx`

**الميزات:**
- عداد السلة في الـ header
- عرض عدد العناصر في السلة
- روابط سريعة للسلة والدفع

## التدفق الكامل للمستخدم

1. **تصفح المنتجات**: المستخدم يتصفح المنتجات في `/products`
2. **إضافة للسلة**: يختار الكمية ويضيف المنتج للسلة
3. **عرض السلة**: ينتقل إلى `/cart` لمراجعة المنتجات
4. **تعديل السلة**: يمكن تعديل الكميات أو حذف منتجات
5. **الانتقال للدفع**: يضغط على "Proceed to Checkout"
6. **إدخال المعلومات**: يملأ معلومات الشحن والدفع
7. **إنشاء الطلب**: يضغط على "Place Order"
8. **التأكيد**: يتم إنشاء الطلب ومسح السلة

## التقنيات المستخدمة

- **Zustand**: لإدارة حالة السلة
- **React Hooks**: للتفاعل مع البيانات
- **Tailwind CSS**: للتصميم
- **Lucide React**: للأيقونات
- **Sonner**: للإشعارات
- **Next.js**: للتنقل والـ API

## الأمان والتحقق

- التحقق من تسجيل الدخول قبل الوصول للسلة
- التحقق من صحة البيانات في نموذج الدفع
- التحقق من توفر الكمية قبل الإضافة للسلة
- تشفير معلومات الدفع (وهمي)

## التحسينات المستقبلية

1. **حفظ السلة**: حفظ السلة في قاعدة البيانات
2. **كوبونات الخصم**: نظام كوبونات وخصومات
3. **طرق دفع متعددة**: PayPal, Stripe, إلخ
4. **تتبع الشحن**: تتبع حالة الشحن
5. **إشعارات البريد**: إرسال تأكيدات بالبريد الإلكتروني
6. **تقييم المنتجات**: نظام تقييم ومراجعات

## كيفية الاستخدام

1. **للمطورين**: 
   - تحديث المنتجات في قاعدة البيانات
   - إضافة منتجات جديدة
   - مراقبة الطلبات

2. **للمستخدمين**:
   - تصفح المنتجات
   - إضافة للسلة
   - إكمال عملية الشراء

## ملاحظات تقنية

- السلة محفوظة في localStorage عبر Zustand
- الطلبات تُنشأ في قاعدة البيانات MongoDB
- التحقق من المصادقة مطلوب للوصول للسلة
- التصميم متجاوب مع جميع الأجهزة 