# تعليمات الإعداد السريع - منصة سلسلة التوريد الزراعية

## الخطوات المطلوبة

### 1. تثبيت التبعيات
```bash
npm install mongoose --legacy-peer-deps
```

### 2. إعداد قاعدة البيانات
قم بإنشاء ملف `.env.local` في مجلد المشروع:
```env
MONGODB_URI=mongodb://localhost:27017/agri-supply-chain
```

### 3. تشغيل MongoDB
- **محلياً**: تأكد من تشغيل MongoDB على جهازك
- **MongoDB Atlas**: استخدم رابط الاتصال من Atlas

### 4. تشغيل المشروع
```bash
npm run dev
```

### 5. اختبار API
افتح المتصفح وانتقل إلى:
- `http://localhost:3000/api/test` - لاختبار الاتصال
- `http://localhost:3000/api/products` - لجلب المنتجات

## اختبار API باستخدام curl

### جلب جميع المنتجات:
```bash
curl http://localhost:3000/api/products
```

### إنشاء منتج جديد:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "عصير برتقال طازج",
    "description": "عصير برتقال طبيعي 100%",
    "category": "عصائر",
    "price": 15.99,
    "quantity": 100,
    "supplier": "مزرعة الوادي الأخضر"
  }'
```

## استكشاف الأخطاء

### إذا واجهت مشكلة في الاتصال:
1. تأكد من تشغيل MongoDB
2. تحقق من صحة رابط الاتصال في `.env.local`
3. تأكد من عدم وجود حظر في الجدار الناري

### إذا واجهت مشكلة في التبعيات:
```bash
npm install --legacy-peer-deps
```

## الملفات المهمة

- `lib/mongodb.ts` - إدارة الاتصال بقاعدة البيانات
- `models/Product.ts` - نموذج المنتج
- `pages/api/products/index.ts` - API للمنتجات
- `types/product.ts` - أنواع TypeScript
- `utils/api-test.ts` - أدوات اختبار API 