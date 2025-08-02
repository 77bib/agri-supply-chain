# توثيق API - نظام إدارة المنتجات الزراعية

## 🔐 نظام المصادقة

### تسجيل حساب جديد
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "password": "كلمة المرور"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "كلمة المرور"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### التحقق من حالة المصادقة
```http
GET /api/auth/me
Authorization: Bearer jwt_token_here
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم التحقق من المصادقة بنجاح",
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📦 إدارة المنتجات

### جلب جميع منتجات المستخدم
```http
GET /api/products
Authorization: Bearer jwt_token_here
```

**الاستجابة:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "product_id_1",
      "name": "قمح",
      "description": "قمح عالي الجودة",
      "category": "حبوب",
      "price": 1500,
      "quantity": 100,
      "supplier": "مزرعة الأمل",
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### إضافة منتج جديد
```http
POST /api/products
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "قمح",
  "description": "قمح عالي الجودة",
  "category": "حبوب",
  "price": 1500,
  "quantity": 100,
  "supplier": "مزرعة الأمل"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "قمح",
    "description": "قمح عالي الجودة",
    "category": "حبوب",
    "price": 1500,
    "quantity": 100,
    "supplier": "مزرعة الأمل",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### جلب منتج محدد
```http
GET /api/products/product_id
Authorization: Bearer jwt_token_here
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "قمح",
    "description": "قمح عالي الجودة",
    "category": "حبوب",
    "price": 1500,
    "quantity": 100,
    "supplier": "مزرعة الأمل",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### تحديث منتج
```http
PUT /api/products/product_id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "قمح محسن",
  "description": "قمح عالي الجودة محسن",
  "category": "حبوب",
  "price": 1600,
  "quantity": 120,
  "supplier": "مزرعة الأمل"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "قمح محسن",
    "description": "قمح عالي الجودة محسن",
    "category": "حبوب",
    "price": 1600,
    "quantity": 120,
    "supplier": "مزرعة الأمل",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### حذف منتج
```http
DELETE /api/products/product_id
Authorization: Bearer jwt_token_here
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم حذف المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "قمح",
    "description": "قمح عالي الجودة",
    "category": "حبوب",
    "price": 1500,
    "quantity": 100,
    "supplier": "مزرعة الأمل",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔒 الأمان والحماية

### رؤوس HTTP المطلوبة
- `Authorization: Bearer <jwt_token>` - مطلوب لجميع عمليات المنتجات
- `Content-Type: application/json` - مطلوب للعمليات التي ترسل بيانات

### قواعد الأمان
1. **كل مستخدم يرى منتجاته فقط**: لا يمكن للمستخدم الوصول لمنتجات مستخدمين آخرين
2. **التحقق من الملكية**: لا يمكن تعديل أو حذف منتجات لا تملكها
3. **تشفير كلمات المرور**: جميع كلمات المرور مشفرة باستخدام bcrypt
4. **JWT Tokens**: نظام مصادقة آمن باستخدام JWT
5. **التحقق من البيانات**: جميع البيانات يتم التحقق من صحتها قبل الحفظ

## 📊 رموز الحالة HTTP

- `200` - نجح الطلب
- `201` - تم إنشاء المورد بنجاح
- `400` - بيانات غير صحيحة
- `401` - غير مصرح (توكن مفقود أو غير صحيح)
- `404` - المورد غير موجود
- `405` - طريقة طلب غير مسموح بها
- `409` - تضارب في البيانات (مثل البريد الإلكتروني المكرر)
- `500` - خطأ في الخادم

## 🚀 أمثلة الاستخدام

### JavaScript/TypeScript
```javascript
// تسجيل الدخول
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// جلب المنتجات
const productsResponse = await fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data: products } = await productsResponse.json();
```

### cURL
```bash
# تسجيل الدخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# جلب المنتجات
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 ملاحظات مهمة

1. **JWT Token**: احفظ التوكن في localStorage أو sessionStorage
2. **انتهاء الصلاحية**: التوكن صالح لمدة 7 أيام افتراضياً
3. **إعادة المصادقة**: عند انتهاء صلاحية التوكن، اطلب من المستخدم تسجيل الدخول مرة أخرى
4. **الأخطاء**: تحقق دائماً من حقل `success` في الاستجابة
5. **البيانات**: جميع البيانات المرسلة يجب أن تكون JSON صحيح 