# 🚀 دليل إعداد Backend - نظام إدارة المنتجات الزراعية

## 📋 نظرة عامة

تم إنشاء Backend كامل لنظام إدارة المنتجات الزراعية باستخدام:
- **Next.js API Routes** للـ backend
- **MongoDB** لقاعدة البيانات
- **JWT** للمصادقة
- **bcrypt** لتشفير كلمات المرور
- **Mongoose** لإدارة قاعدة البيانات

## 🎯 الميزات المنجزة

### ✅ نظام المصادقة
- [x] تسجيل حساب جديد (`POST /api/auth/signup`)
- [x] تسجيل الدخول (`POST /api/auth/login`)
- [x] التحقق من حالة المصادقة (`GET /api/auth/me`)
- [x] تشفير كلمات المرور باستخدام bcrypt
- [x] JWT tokens للمصادقة

### ✅ إدارة المنتجات
- [x] جلب جميع منتجات المستخدم (`GET /api/products`)
- [x] إضافة منتج جديد (`POST /api/products`)
- [x] جلب منتج محدد (`GET /api/products/[id]`)
- [x] تحديث منتج (`PUT /api/products/[id]`)
- [x] حذف منتج (`DELETE /api/products/[id]`)

### ✅ الأمان والحماية
- [x] حماية جميع عمليات المنتجات بـ JWT
- [x] كل مستخدم يرى منتجاته فقط
- [x] التحقق من ملكية المنتج قبل التعديل/الحذف
- [x] التحقق من صحة البيانات
- [x] رسائل خطأ واضحة ومفيدة

## 🛠️ المتطلبات

### البرامج المطلوبة
- Node.js (الإصدار 16 أو أحدث)
- npm أو pnpm
- MongoDB (محلي أو Atlas)

### التبعيات المثبتة
```json
{
  "mongoose": "^8.17.0",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.0",
  "@types/bcryptjs": "^3.0.0",
  "@types/jsonwebtoken": "^9.0.0"
}
```

## ⚙️ الإعداد

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env.local` في مجلد المشروع:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 3. تشغيل MongoDB
#### للمطورين (MongoDB محلي):
```bash
# تشغيل MongoDB
mongod

# أو باستخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### للإنتاج (MongoDB Atlas):
1. أنشئ حساب على [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ cluster جديد
3. أنشئ مستخدم لقاعدة البيانات
4. احصل على connection string
5. استبدل `MONGODB_URI` في متغيرات البيئة

### 4. تشغيل المشروع
```bash
npm run dev
```

## 📁 بنية الملفات

```
pages/api/
├── auth/
│   ├── signup.ts      # تسجيل حساب جديد
│   ├── login.ts       # تسجيل الدخول
│   ├── me.ts          # التحقق من المصادقة
│   └── check-email.ts # التحقق من البريد الإلكتروني
└── products/
    ├── index.ts       # جلب/إضافة المنتجات
    └── [id].ts        # إدارة منتج محدد

models/
├── User.ts            # نموذج المستخدم
└── Product.ts         # نموذج المنتج

lib/
├── mongodb.ts         # اتصال قاعدة البيانات
├── auth.ts            # دوال المصادقة
├── jwt.ts             # إدارة JWT
├── auth-middleware.ts # middleware المصادقة
└── validations.ts     # التحقق من البيانات
```

## 🔧 API Endpoints

### المصادقة
| الطريقة | المسار | الوصف |
|---------|--------|--------|
| POST | `/api/auth/signup` | تسجيل حساب جديد |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/me` | التحقق من المصادقة |

### المنتجات
| الطريقة | المسار | الوصف |
|---------|--------|--------|
| GET | `/api/products` | جلب جميع منتجات المستخدم |
| POST | `/api/products` | إضافة منتج جديد |
| GET | `/api/products/[id]` | جلب منتج محدد |
| PUT | `/api/products/[id]` | تحديث منتج |
| DELETE | `/api/products/[id]` | حذف منتج |

## 🧪 اختبار API

### تشغيل الاختبارات
```bash
# في المتصفح
# افتح console واكتب:
runAPITests()

# في Node.js
node -e "require('./utils/api-test.ts').runAPITests()"
```

### اختبار يدوي باستخدام cURL
```bash
# تسجيل حساب جديد
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"مستخدم اختبار","email":"test@example.com","password":"123456"}'

# تسجيل الدخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# جلب المنتجات (بعد الحصول على التوكن)
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 الأمان

### حماية البيانات
1. **تشفير كلمات المرور**: باستخدام bcrypt
2. **JWT Tokens**: مصادقة آمنة
3. **التحقق من الملكية**: كل مستخدم يرى منتجاته فقط
4. **التحقق من البيانات**: جميع المدخلات يتم التحقق من صحتها

### أفضل الممارسات
- استخدم JWT_SECRET قوي وطويل
- لا تشارك مفاتيح البيئة
- استخدم HTTPS في الإنتاج
- حدث التوكن بانتظام
- احذف التوكن عند تسجيل الخروج

## 🚀 النشر على Vercel

### 1. إعداد Vercel
```bash
npm install -g vercel
vercel login
```

### 2. إعداد متغيرات البيئة في Vercel
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
```

### 3. النشر
```bash
vercel --prod
```

## 📊 قاعدة البيانات

### Collection: Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  quantity: Number,
  supplier: String,
  userId: ObjectId (Reference to Users),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في الاتصال بـ MongoDB
```
خطأ: خطأ في الاتصال بقاعدة البيانات
```
**الحل**: تأكد من تشغيل MongoDB وتصحيح MONGODB_URI

#### 2. خطأ في JWT
```
خطأ: توكن المصادقة غير صحيح
```
**الحل**: تأكد من إرسال التوكن في header Authorization

#### 3. خطأ في التحقق من البيانات
```
خطأ: بيانات غير صحيحة
```
**الحل**: تأكد من إرسال جميع الحقول المطلوبة

### سجلات الأخطاء
- جميع الأخطاء تُسجل في console
- في الإنتاج، استخدم خدمة مراقبة مثل Sentry

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات الأخطاء
2. تأكد من إعداد متغيرات البيئة
3. اختبر الاتصال بـ MongoDB
4. راجع توثيق API

## 🔄 التحديثات المستقبلية

- [ ] إضافة نظام أدوار (Admin, User)
- [ ] إضافة صور للمنتجات
- [ ] إضافة نظام تقييمات
- [ ] إضافة نظام إشعارات
- [ ] إضافة API للتقارير والإحصائيات
- [ ] إضافة نظام نسخ احتياطي تلقائي 