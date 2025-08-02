# إعداد متغيرات البيئة - Agri Supply Chain Backend

## 📁 إنشاء ملف .env.local

قم بإنشاء ملف `.env.local` في المجلد الجذر للمشروع وأضف المتغيرات التالية:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/agri-supply-chain

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_SECRET=admin-secret-2024

# Environment
NODE_ENV=development
```

## 🔧 شرح المتغيرات

### MONGODB_URI
- **التطوير المحلي**: `mongodb://localhost:27017/agri-supply-chain`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain`

### JWT_SECRET
- مفتاح سري لتوقيع JWT tokens
- يجب أن يكون طويل ومعقد
- مثال: `my-super-secret-jwt-key-2024-agri-supply-chain`

### JWT_EXPIRES_IN
- مدة صلاحية JWT token
- أمثلة: `7d`, `24h`, `30m`

### ADMIN_SECRET
- رمز سري لإنشاء حساب admin
- يمكن تغييره حسب الحاجة

## 🚀 إعداد MongoDB

### للتطوير المحلي:
1. قم بتثبيت MongoDB على جهازك
2. شغل MongoDB service
3. استخدم: `mongodb://localhost:27017/agri-supply-chain`

### لـ MongoDB Atlas:
1. أنشئ حساب على MongoDB Atlas
2. أنشئ cluster جديد
3. أنشئ database user
4. احصل على connection string
5. استبدل `username`, `password`, `cluster` بالقيم الصحيحة

## 🔒 إعداد Vercel

### إضافة Environment Variables في Vercel:
1. اذهب إلى مشروعك في Vercel Dashboard
2. اذهب إلى Settings > Environment Variables
3. أضف المتغيرات التالية:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET=your-production-admin-secret
NODE_ENV=production
```

## ⚠️ ملاحظات الأمان

1. **لا تشارك JWT_SECRET** مع أي شخص
2. **استخدم كلمات مرور قوية** لـ MongoDB
3. **غير ADMIN_SECRET** في الإنتاج
4. **لا تضع .env.local** في Git repository

## 🧪 اختبار الإعداد

بعد إنشاء `.env.local`، قم بتشغيل:

```bash
npm run dev
```

ثم اختبر API endpoints:

```bash
# إنشاء admin
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "123456",
    "adminSecret": "admin-secret-2024"
  }'
```

## 📝 مثال كامل لملف .env.local

```env
# ==========================================
# Agri Supply Chain Backend Environment
# ==========================================

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/agri-supply-chain

# JWT Authentication
JWT_SECRET=agri-supply-chain-jwt-secret-2024-super-secure-key
JWT_EXPIRES_IN=7d

# Admin Access
ADMIN_SECRET=admin-secret-2024

# Environment
NODE_ENV=development

# ==========================================
# Production Settings (for Vercel)
# ==========================================
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
# JWT_SECRET=production-jwt-secret-2024
# ADMIN_SECRET=production-admin-secret-2024
# NODE_ENV=production
``` 