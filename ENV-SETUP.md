# إعداد متغيرات البيئة

## إنشاء ملف .env.local

قم بإنشاء ملف `.env.local` في المجلد الجذر للمشروع وأضف المتغيرات التالية:

```env
# MongoDB Connection String
# استبدل هذا الرابط برابط قاعدة البيانات الخاصة بك
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# أو استخدم MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain?retryWrites=true&w=majority

# JWT Secret (للمصادقة المستقبلية)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Environment
NODE_ENV=development
```

## خيارات قاعدة البيانات

### 1. MongoDB المحلي
إذا كنت تستخدم MongoDB محلياً:
```env
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 2. MongoDB Atlas (موصى به للإنتاج)
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ حساب جديد أو سجل دخولك
3. أنشئ cluster جديد
4. احصل على رابط الاتصال
5. استبدل `username` و `password` ببياناتك

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain?retryWrites=true&w=majority
```

## خطوات الإعداد

1. **إنشاء ملف .env.local**:
   ```bash
   touch .env.local
   ```

2. **إضافة المتغيرات المطلوبة** (انظر أعلاه)

3. **إعادة تشغيل الخادم**:
   ```bash
   npm run dev
   ```

## التحقق من الاتصال

بعد إعداد المتغيرات، يمكنك اختبار الاتصال بزيارة:
- `http://localhost:3000/api/test` - لاختبار الاتصال بقاعدة البيانات

## ملاحظات أمنية

- لا تشارك ملف `.env.local` في Git
- استخدم كلمات مرور قوية لـ JWT_SECRET
- في الإنتاج، استخدم متغيرات بيئة آمنة 