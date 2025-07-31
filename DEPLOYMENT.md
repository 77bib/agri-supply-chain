# تعليمات النشر - نظام المصادقة

## النشر على Vercel

### الخطوات المطلوبة:

#### 1. إعداد Vercel CLI
```bash
npm install -g vercel
```

#### 2. تسجيل الدخول إلى Vercel
```bash
vercel login
```

#### 3. إعداد متغيرات البيئة
في لوحة تحكم Vercel أو باستخدام CLI:
```bash
vercel env add MONGODB_URI
```

أدخل رابط MongoDB Atlas:
```
mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
```

#### 4. النشر
```bash
vercel --prod
```

## النشر على منصات أخرى

### Railway
1. اربط مستودع GitHub
2. أضف متغير البيئة `MONGODB_URI`
3. النشر التلقائي

### Netlify
1. اربط مستودع GitHub
2. أضف متغير البيئة `MONGODB_URI`
3. تعيين build command: `npm run build`
4. تعيين publish directory: `.next`

### Heroku
1. إنشاء تطبيق Heroku
2. ربط المستودع
3. إضافة متغير البيئة:
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
```

## إعداد MongoDB Atlas

### 1. إنشاء حساب
- اذهب إلى [MongoDB Atlas](https://www.mongodb.com/atlas)
- أنشئ حساب مجاني

### 2. إنشاء Cluster
- اختر "Build a Database"
- اختر "FREE" tier
- اختر المنطقة الأقرب لك

### 3. إعداد الشبكة
- اذهب إلى "Network Access"
- أضف IP Address: `0.0.0.0/0` (للوصول من أي مكان)

### 4. إنشاء مستخدم قاعدة البيانات
- اذهب إلى "Database Access"
- أضف مستخدم جديد مع صلاحيات "Read and write"

### 5. الحصول على رابط الاتصال
- اذهب إلى "Database"
- اختر "Connect"
- اختر "Connect your application"
- انسخ رابط الاتصال

## اختبار النشر

### 1. اختبار API
```bash
# اختبار التسجيل
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "Password123"
  }'

# اختبار تسجيل الدخول
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Password123"
  }'
```

### 2. اختبار الاتصال
```bash
curl https://your-app.vercel.app/api/test
```

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الاتصال بقاعدة البيانات**
   - تحقق من صحة رابط MongoDB Atlas
   - تأكد من إعداد Network Access
   - تحقق من صحة بيانات المستخدم

2. **خطأ في النشر**
   - تحقق من متغيرات البيئة
   - تأكد من صحة package.json
   - تحقق من logs في Vercel

3. **خطأ في API**
   - تحقق من CORS settings
   - تأكد من صحة headers
   - تحقق من logs في console

## المراقبة

### Vercel Analytics
- تفعيل Vercel Analytics في لوحة التحكم
- مراقبة الأداء والأخطاء

### MongoDB Atlas
- مراقبة استخدام قاعدة البيانات
- تحقق من logs في MongoDB Atlas

### Logs
```bash
# عرض logs في Vercel
vercel logs

# عرض logs في Heroku
heroku logs --tail
``` 