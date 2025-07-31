# دليل الإعداد الشامل - AgriChain

## المتطلبات الأساسية

### 1. Node.js
- **الإصدار المطلوب**: 16.0.0 أو أحدث
- **الإصدار الموصى به**: 18.17.0 أو أحدث
- **التحقق من الإصدار**: `node --version`

### 2. MongoDB
- **الإصدار المطلوب**: 4.0 أو أحدث
- **التحقق من الإصدار**: `mongod --version`

### 3. npm أو yarn
- **التحقق من الإصدار**: `npm --version`

## خطوات الإعداد

### الخطوة 1: استنساخ المشروع
```bash
git clone <repository-url>
cd agri-supply-chain
```

### الخطوة 2: تثبيت التبعيات
```bash
# حذف التبعيات القديمة (إذا وجدت)
rm -rf node_modules package-lock.json

# تثبيت التبعيات الجديدة
npm install
```

### الخطوة 3: إعداد متغيرات البيئة
إنشاء ملف `.env.local` في المجلد الجذر:
```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/agri-supply-chain

# JWT Secret (للمصادقة المستقبلية)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Environment
NODE_ENV=development
```

### الخطوة 4: تشغيل MongoDB

#### خيار أ: MongoDB المحلي
```bash
# إنشاء مجلد البيانات (إذا لم يكن موجوداً)
mkdir -p C:/data/db

# تشغيل MongoDB
mongod --dbpath C:/data/db --port 27017
```

#### خيار ب: MongoDB كخدمة (Windows)
```bash
# تشغيل خدمة MongoDB
net start MongoDB
```

#### خيار ج: MongoDB Atlas (موصى به للإنتاج)
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ حساب جديد أو سجل دخولك
3. أنشئ cluster جديد
4. احصل على رابط الاتصال
5. استبدل `MONGODB_URI` في `.env.local`

### الخطوة 5: تشغيل التطبيق
```bash
npm run dev
```

## اختبار التطبيق

### 1. اختبار الاتصال بقاعدة البيانات
```bash
curl http://localhost:3000/api/test
```
**النتيجة المتوقعة**:
```json
{
  "success": true,
  "message": "تم الاتصال بقاعدة البيانات بنجاح",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### 2. اختبار التسجيل
1. اذهب إلى `http://localhost:3000/register`
2. املأ النموذج:
   - الاسم الكامل: `أحمد محمد`
   - البريد الإلكتروني: `ahmed@example.com`
   - كلمة المرور: `password123`
   - تأكيد كلمة المرور: `password123`
3. اضغط "إنشاء الحساب"
4. تأكد من ظهور رسالة النجاح

### 3. اختبار تسجيل الدخول
1. اذهب إلى `http://localhost:3000/login`
2. أدخل البيانات:
   - البريد الإلكتروني: `ahmed@example.com`
   - كلمة المرور: `password123`
3. اضغط "تسجيل الدخول"
4. تأكد من الانتقال إلى صفحة المنتجات

## استكشاف الأخطاء

### مشكلة: "Cannot read properties of undefined (reading '_id')"
**الحل**: تم إصلاح هذه المشكلة في التحديثات الأخيرة. تأكد من:
- تحديث جميع الملفات
- إعادة تشغيل الخادم
- مسح cache المتصفح

### مشكلة: "Internal Server Error" في API
**الحل**:
1. تأكد من تشغيل MongoDB
2. تحقق من متغيرات البيئة
3. تحقق من سجلات الخادم

### مشكلة: "Hydration Mismatch"
**الحل**: تم إصلاح هذه المشكلة باستخدام `HydrationBoundary`

### مشكلة: "Node.js version not supported"
**الحل**:
1. تحديث Node.js إلى الإصدار 18 أو أحدث
2. أو استخدام الإعدادات المحدثة في `package.json`

## هيكل المشروع

```
agri-supply-chain/
├── app/                    # صفحات التطبيق (Next.js 13+)
│   ├── login/             # صفحة تسجيل الدخول
│   ├── register/          # صفحة التسجيل
│   └── ...
├── components/            # مكونات React
│   ├── ui/               # مكونات UI الأساسية
│   ├── header.tsx        # رأس الصفحة
│   └── ...
├── lib/                  # مكتبات ووظائف مساعدة
│   ├── mongodb.ts        # اتصال قاعدة البيانات
│   ├── store.ts          # إدارة الحالة (Zustand)
│   └── ...
├── models/               # نماذج MongoDB
│   ├── User.ts           # نموذج المستخدم
│   └── Product.ts        # نموذج المنتج
├── pages/                # API Routes
│   └── api/              # نقاط النهاية API
│       ├── auth/         # مصادقة المستخدمين
│       └── products/     # إدارة المنتجات
└── ...
```

## الميزات المدعومة

✅ **إنشاء حسابات جديدة** في قاعدة البيانات
✅ **تسجيل الدخول** باستخدام البيانات المحفوظة
✅ **تشفير كلمات المرور** باستخدام bcryptjs
✅ **التحقق من صحة البيانات** باستخدام Zod
✅ **واجهة مستخدم باللغة العربية**
✅ **إصلاح مشاكل hydration**
✅ **إدارة الحالة** باستخدام Zustand
✅ **تصميم متجاوب** مع Tailwind CSS

## الملفات المهمة

- `ENV-SETUP.md` - إعداد متغيرات البيئة
- `DATABASE-INTEGRATION.md` - تكامل قاعدة البيانات
- `HYDRATION-FIX.md` - إصلاح مشاكل hydration
- `NODE-VERSION-FIX.md` - إصلاح مشاكل إصدار Node.js

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات الخادم
2. تأكد من تشغيل MongoDB
3. تحقق من متغيرات البيئة
4. اقرأ ملفات التوثيق المذكورة أعلاه 