# إعداد متغيرات البيئة

## 📋 المتطلبات

### 1. متغيرات البيئة المحلية (.env.local)

قم بإنشاء ملف `.env.local` في مجلد المشروع الرئيسي وأضف المتغيرات التالية:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 2. متغيرات البيئة في Vercel

عند نشر المشروع على Vercel، قم بإضافة المتغيرات التالية في إعدادات المشروع:

#### للمطورين:
```env
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

#### للإنتاج:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
JWT_SECRET=your-production-secret-key-very-long-and-secure
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## 🔧 إعداد MongoDB

### للمطورين (MongoDB محلي):
1. قم بتثبيت MongoDB على جهازك
2. شغل خدمة MongoDB
3. استخدم `mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

### للإنتاج (MongoDB Atlas):
1. أنشئ حساب على MongoDB Atlas
2. أنشئ cluster جديد
3. أنشئ مستخدم لقاعدة البيانات
4. احصل على connection string
5. استبدل `username` و `password` بالقيم الحقيقية

## 🔐 أمان JWT

- استخدم مفتاح JWT_SECRET قوي وطويل (32+ حرف)
- لا تشارك المفتاح مع أي شخص
- استخدم مفاتيح مختلفة للتطوير والإنتاج
- يمكنك توليد مفتاح آمن باستخدام:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## 🚀 تشغيل المشروع

1. قم بتثبيت التبعيات:
   ```bash
   npm install
   ```

2. تأكد من تشغيل MongoDB

3. شغل المشروع:
   ```bash
   npm run dev
   ```

## 📝 ملاحظات مهمة

- لا تقم برفع ملف `.env.local` إلى Git
- تأكد من إضافة `.env.local` إلى `.gitignore`
- استخدم متغيرات بيئة مختلفة للتطوير والإنتاج
- تأكد من تحديث JWT_SECRET في الإنتاج 