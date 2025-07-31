# نظام المصادقة - منصة سلسلة التوريد الزراعية

## نظرة عامة

نظام مصادقة كامل مبني باستخدام Next.js API Routes مع MongoDB و TypeScript. يدعم التسجيل وتسجيل الدخول والتحقق من وجود المستخدمين.

## الميزات

- ✅ **تسجيل المستخدمين** مع تشفير كلمات المرور
- ✅ **تسجيل الدخول** مع التحقق من صحة البيانات
- ✅ **التحقق من وجود البريد الإلكتروني** قبل التسجيل
- ✅ **التحقق من صحة البيانات** باستخدام Zod
- ✅ **تشفير كلمات المرور** باستخدام bcryptjs
- ✅ **معالجة شاملة للأخطاء** مع رسائل باللغة العربية
- ✅ **أنواع TypeScript** للتنمية الآمنة
- ✅ **جاهز للنشر** على Vercel

## الإعداد

### 1. تثبيت التبعيات
```bash
npm install mongoose bcryptjs zod --legacy-peer-deps
```

### 2. إعداد قاعدة البيانات
قم بإنشاء ملف `.env.local` في مجلد المشروع:
```env
MONGODB_URI=mongodb://localhost:27017/agri-supply-chain
```

### 3. تشغيل المشروع
```bash
npm run dev
```

## API Endpoints

### 1. تسجيل مستخدم جديد
```bash
POST /api/auth/signup
```

**البيانات المطلوبة:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

**الاستجابة الناجحة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. تسجيل الدخول
```bash
POST /api/auth/login
```

**البيانات المطلوبة:**
```json
{
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

**الاستجابة الناجحة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. التحقق من وجود البريد الإلكتروني
```bash
POST /api/auth/check-email
```

**البيانات المطلوبة:**
```json
{
  "email": "ahmed@example.com"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "exists": true,
  "message": "البريد الإلكتروني مستخدم بالفعل"
}
```

## متطلبات كلمة المرور

- **الحد الأدنى**: 6 أحرف
- **الحد الأقصى**: 100 حرف
- **حرف كبير**: واحد على الأقل
- **حرف صغير**: واحد على الأقل
- **رقم**: واحد على الأقل

## رموز الحالة

- **200**: نجح الطلب
- **201**: تم إنشاء المستخدم بنجاح
- **400**: خطأ في البيانات المرسلة
- **401**: بيانات تسجيل الدخول غير صحيحة
- **405**: طريقة طلب غير مسموح بها
- **409**: البريد الإلكتروني مستخدم بالفعل
- **500**: خطأ في الخادم

## اختبار API

### باستخدام curl

**تسجيل مستخدم جديد:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "Password123"
  }'
```

**تسجيل الدخول:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Password123"
  }'
```

**التحقق من البريد الإلكتروني:**
```bash
curl -X POST http://localhost:3000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com"
  }'
```

### باستخدام JavaScript

```javascript
import { AuthAPI } from './utils/auth-test';

// تسجيل مستخدم جديد
const signupResult = await AuthAPI.signup({
  name: "أحمد محمد",
  email: "ahmed@example.com",
  password: "Password123"
});

// تسجيل الدخول
const loginResult = await AuthAPI.login({
  email: "ahmed@example.com",
  password: "Password123"
});

// التحقق من البريد الإلكتروني
const emailCheck = await AuthAPI.checkEmail("ahmed@example.com");
```

## النشر على Vercel

### 1. إعداد متغيرات البيئة
في لوحة تحكم Vercel، أضف متغير البيئة:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
```

### 2. النشر
```bash
vercel --prod
```

## الأمان

- **تشفير كلمات المرور**: باستخدام bcryptjs مع 12 salt rounds
- **التحقق من صحة البيانات**: باستخدام Zod
- **منع تكرار البريد الإلكتروني**: فهرس فريد في قاعدة البيانات
- **رسائل خطأ آمنة**: لا تكشف معلومات حساسة في الإنتاج
- **معالجة الأخطاء**: شاملة لجميع الحالات

## الملفات المهمة

- `models/User.ts` - نموذج المستخدم
- `lib/validations.ts` - التحقق من صحة البيانات
- `lib/auth.ts` - تشفير كلمات المرور
- `pages/api/auth/signup.ts` - API التسجيل
- `pages/api/auth/login.ts` - API تسجيل الدخول
- `pages/api/auth/check-email.ts` - API التحقق من البريد الإلكتروني
- `types/user.ts` - أنواع TypeScript
- `utils/auth-test.ts` - أدوات اختبار API

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الاتصال بقاعدة البيانات**
   - تأكد من تشغيل MongoDB
   - تحقق من صحة رابط الاتصال

2. **خطأ في التبعيات**
   - استخدم `--legacy-peer-deps` عند التثبيت

3. **خطأ في التحقق من البيانات**
   - تأكد من تنسيق البريد الإلكتروني
   - تحقق من قوة كلمة المرور

4. **خطأ في النشر على Vercel**
   - تأكد من إعداد متغيرات البيئة
   - تحقق من إعدادات MongoDB Atlas 