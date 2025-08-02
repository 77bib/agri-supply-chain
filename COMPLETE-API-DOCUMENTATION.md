# 📚 توثيق شامل لـ API - Agri Supply Chain Backend

## 🎯 نظرة عامة

هذا التوثيق يغطي جميع endpoints المتاحة في backend مشروع Agri Supply Chain، بما في ذلك ميزات الـ admin الجديدة.

## 🔐 Authentication Endpoints

### 1. تسجيل مستخدم جديد
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "اسم المستخدم",
  "email": "user@example.com",
  "password": "كلمة المرور"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### 2. تسجيل الدخول
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "كلمة المرور"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### 3. إنشاء حساب Admin
```http
POST /api/auth/create-admin
```

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin_password",
  "adminSecret": "admin-secret-2024"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء حساب الـ admin بنجاح",
  "data": {
    "_id": "admin_id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### 4. التحقق من المصادقة
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📦 Product Endpoints

### 1. إنشاء منتج جديد
```http
POST /api/products
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "اسم المنتج",
  "description": "وصف المنتج",
  "category": "فئة المنتج",
  "price": 25.50,
  "quantity": 100,
  "supplier": "اسم المورد",
  "image": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "اسم المنتج",
    "description": "وصف المنتج",
    "category": "فئة المنتج",
    "price": 25.50,
    "quantity": 100,
    "supplier": "اسم المورد",
    "image": "https://example.com/image.jpg",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. جلب منتجات المستخدم
```http
GET /api/products
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "product_id_1",
      "name": "منتج 1",
      "description": "وصف المنتج 1",
      "category": "خضروات",
      "price": 25.50,
      "quantity": 100,
      "supplier": "مورد 1",
      "image": "https://example.com/image1.jpg",
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "product_id_2",
      "name": "منتج 2",
      "description": "وصف المنتج 2",
      "category": "فواكه",
      "price": 30.00,
      "quantity": 50,
      "supplier": "مورد 2",
      "image": "https://example.com/image2.jpg",
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. جلب منتج محدد
```http
GET /api/products/{product_id}
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "اسم المنتج",
    "description": "وصف المنتج",
    "category": "فئة المنتج",
    "price": 25.50,
    "quantity": 100,
    "supplier": "اسم المورد",
    "image": "https://example.com/image.jpg",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. تحديث منتج
```http
PUT /api/products/{product_id}
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "اسم المنتج المحدث",
  "description": "وصف محدث",
  "category": "فئة محدثة",
  "price": 30.00,
  "quantity": 150,
  "supplier": "مورد محدث",
  "image": "https://example.com/updated-image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "اسم المنتج المحدث",
    "description": "وصف محدث",
    "category": "فئة محدثة",
    "price": 30.00,
    "quantity": 150,
    "supplier": "مورد محدث",
    "image": "https://example.com/updated-image.jpg",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. حذف منتج
```http
DELETE /api/products/{product_id}
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم حذف المنتج بنجاح",
  "data": {
    "_id": "product_id",
    "name": "اسم المنتج",
    "description": "وصف المنتج",
    "category": "فئة المنتج",
    "price": 25.50,
    "quantity": 100,
    "supplier": "اسم المورد",
    "image": "https://example.com/image.jpg",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 👑 Admin Endpoints

### 1. جلب كل المنتجات (Admin فقط)
```http
GET /api/products/all
```

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "product_id_1",
      "name": "منتج 1",
      "description": "وصف المنتج 1",
      "category": "خضروات",
      "price": 25.50,
      "quantity": 100,
      "supplier": "مورد 1",
      "image": "https://example.com/image1.jpg",
      "userId": {
        "_id": "user_id_1",
        "name": "مستخدم 1",
        "email": "user1@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "product_id_2",
      "name": "منتج 2",
      "description": "وصف المنتج 2",
      "category": "فواكه",
      "price": 30.00,
      "quantity": 50,
      "supplier": "مورد 2",
      "image": "https://example.com/image2.jpg",
      "userId": {
        "_id": "user_id_2",
        "name": "مستخدم 2",
        "email": "user2@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. جلب كل المستخدمين (Admin فقط)
```http
GET /api/users
```

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "user_id_1",
      "name": "مستخدم 1",
      "email": "user1@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "user_id_2",
      "name": "مستخدم 2",
      "email": "user2@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "admin_id",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔒 الأمان والصلاحيات

### مستويات الصلاحيات:

1. **مستخدم عادي (user)**:
   - إنشاء/تعديل/حذف منتجاته الخاصة
   - جلب منتجاته الخاصة فقط
   - لا يمكنه الوصول لبيانات المستخدمين الآخرين

2. **مدير (admin)**:
   - جميع صلاحيات المستخدم العادي
   - جلب كل المنتجات من جميع المستخدمين
   - جلب قائمة كل المستخدمين
   - إدارة النظام بالكامل

### حماية الـ API:

- جميع endpoints (ما عدا signup/login/create-admin) تتطلب JWT token
- كل مستخدم يمكنه الوصول فقط لبياناته الخاصة
- Admin endpoints تتطلب دور "admin"
- التحقق من صحة البيانات في جميع الطلبات

## 📊 HTTP Status Codes

| الكود | المعنى | الاستخدام |
|-------|--------|-----------|
| 200 | OK | نجح الطلب |
| 201 | Created | تم إنشاء المورد بنجاح |
| 400 | Bad Request | بيانات غير صحيحة |
| 401 | Unauthorized | غير مصرح (بدون token) |
| 403 | Forbidden | صلاحيات غير كافية |
| 404 | Not Found | المورد غير موجود |
| 405 | Method Not Allowed | طريقة طلب غير مسموح بها |
| 409 | Conflict | تضارب في البيانات |
| 500 | Internal Server Error | خطأ في الخادم |

## 🧪 اختبار الـ API

### تشغيل الاختبارات الشاملة:

```bash
# تشغيل الاختبارات
npx ts-node utils/admin-api-test.ts
```

### أمثلة اختبار باستخدام cURL:

```bash
# إنشاء admin
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123456",
    "adminSecret": "admin-secret-2024"
  }'

# تسجيل دخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# إنشاء منتج
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "منتج جديد",
    "description": "وصف المنتج",
    "category": "خضروات",
    "price": 25.50,
    "quantity": 100,
    "supplier": "مورد معروف",
    "image": "https://example.com/image.jpg"
  }'

# جلب كل المنتجات (admin)
curl -X GET http://localhost:3000/api/products/all \
  -H "Authorization: Bearer ADMIN_TOKEN"

# جلب كل المستخدمين (admin)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🚀 النشر على Vercel

### إعداد Environment Variables في Vercel:

1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Settings > Environment Variables
4. أضف المتغيرات التالية:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET=your-production-admin-secret
NODE_ENV=production
```

### إعادة النشر:

```bash
git add .
git commit -m "Add admin features and complete API"
git push
```

Vercel سيقوم تلقائياً بإعادة النشر مع الميزات الجديدة.

## 📝 ملاحظات مهمة

1. **الأمان**: تأكد من تغيير `JWT_SECRET` و `ADMIN_SECRET` في الإنتاج
2. **MongoDB**: استخدم MongoDB Atlas للإنتاج
3. **النسخ الاحتياطية**: قم بإعداد نسخ احتياطية لقاعدة البيانات
4. **المراقبة**: راقب أداء الـ API في Vercel Analytics
5. **التوثيق**: حافظ على تحديث هذا التوثيق عند إضافة ميزات جديدة

## 🎯 الخطوات التالية

1. ✅ إنشاء ملف `.env.local` مع المتغيرات المطلوبة
2. ✅ تشغيل `npm run dev` لاختبار التطوير المحلي
3. ✅ تشغيل الاختبارات الشاملة
4. ✅ إعداد MongoDB Atlas للإنتاج
5. ✅ نشر المشروع على Vercel
6. ✅ اختبار جميع الميزات في الإنتاج 