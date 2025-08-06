# 🗄️ MongoDB Atlas Setup Guide

## 📋 Your MongoDB Atlas Connection

You have provided your MongoDB Atlas connection string. Here's how to set it up:

### 🔗 Your Connection String
```
mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## ⚙️ Environment Setup

### 1. Create `.env.local` File

Create a new file called `.env.local` in your project root directory (same level as `package.json`) with the following content:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=bifa-agri-supply-chain-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=bifa-nextauth-secret-key-2024

# Database Name (optional - will use default from connection string)
DB_NAME=agri-supply-chain
```

### 2. File Structure
```
agri-supply-chain/
├── .env.local          ← Create this file
├── package.json
├── app/
├── pages/
├── lib/
└── models/
```

## 🔧 Database Connection Files

### Primary Connection (`lib/mongodb.ts`)
```typescript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
```

### Alternative Connection (`lib/db.ts`)
```typescript
const MONGODB_URI = process.env.MONGODB_URI!
```

## 🚀 Testing the Connection

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Database Connection
The application will automatically connect to MongoDB Atlas when you:
- Register a new user
- Login with existing user
- Access any API endpoint

### 3. Check Connection Status
Look for these messages in your terminal:
```
✅ Connected to MongoDB
```

## 📊 Database Collections

Once connected, your MongoDB Atlas cluster will automatically create these collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  quantity: Number,
  supplier: String,
  image: String,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  products: Array,
  totalAmount: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: Array,
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### 1. Password Hashing
- All passwords are hashed using bcryptjs
- 12 rounds of salting for maximum security

### 2. JWT Authentication
- Secure token-based authentication
- Tokens expire after 7 days
- Automatic token refresh

### 3. Data Validation
- Input validation using Zod
- SQL injection protection
- XSS protection

## 🧪 Testing Your Setup

### 1. Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "12345678"
  }'
```

### 2. Test User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "12345678"
  }'
```

### 3. Test Product Creation (with JWT token)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Fresh Apples",
    "description": "Organic red apples",
    "category": "Fruits",
    "price": 5.99,
    "quantity": 100,
    "supplier": "Green Valley Farm"
  }'
```

## 🔍 Monitoring Your Database

### 1. MongoDB Atlas Dashboard
- Log into [MongoDB Atlas](https://cloud.mongodb.com)
- Navigate to your cluster
- Check the "Collections" tab to see your data

### 2. Database Metrics
- Monitor connection count
- Check query performance
- View storage usage

## 🚨 Troubleshooting

### Common Issues:

#### 1. Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Check your internet connection and MongoDB Atlas cluster status

#### 2. Authentication Error
```
Error: Authentication failed
```
**Solution**: Verify your username and password in the connection string

#### 3. Network Error
```
Error: getaddrinfo ENOTFOUND
```
**Solution**: Check your DNS settings or try using a different network

#### 4. Environment Variable Not Found
```
Error: MONGODB_URI is not defined
```
**Solution**: Make sure `.env.local` file exists and is in the correct location

## 📞 Support

If you encounter any issues:

1. **Check MongoDB Atlas Status**: Visit [MongoDB Atlas Status Page](https://status.cloud.mongodb.com/)
2. **Verify Connection String**: Ensure the connection string is correct
3. **Check Environment Variables**: Confirm `.env.local` file is properly configured
4. **Review Logs**: Check your application logs for detailed error messages

## 🎯 Next Steps

After setting up the database:

1. **Test the Application**: Register a new user and create some products
2. **Explore the API**: Use the API endpoints to manage data
3. **Monitor Performance**: Check MongoDB Atlas dashboard for metrics
4. **Scale as Needed**: Upgrade your Atlas cluster as your application grows

Your MongoDB Atlas connection is now ready to use with your Bifa Agri Supply Chain application! 🚀 