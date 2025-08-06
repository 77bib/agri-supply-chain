# 🔧 Complete API Documentation - Agri Supply Chain

## 📋 Overview
This document provides comprehensive documentation for the complete backend API system for the Agri Supply Chain e-commerce platform.

## 🗃️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  category: String (required),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  supplier: String (required),
  image: String (URL),
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: 'Product'),
  userId: ObjectId (ref: 'User'),
  quantity: Number (required, min: 1),
  status: String (enum: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  totalPrice: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 📡 API Endpoints

### 🔑 Authentication Endpoints

#### POST /api/auth/login
**Description:** User login
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/signup
**Description:** User registration
**Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
**Description:** Get current user info (protected)
**Headers:** Authorization: Bearer <token>

### 🛍️ Public Product Endpoints

#### GET /api/products/public
**Description:** Get all available products for customers
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `category` (string, optional)
- `search` (string, optional)
- `sortBy` (string, default: 'createdAt')
- `sortOrder` (string, default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "category": "Category",
      "price": 99.99,
      "quantity": 50,
      "supplier": "Supplier Name",
      "image": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "categories": ["Category1", "Category2"],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

#### GET /api/products/[id]
**Description:** Get specific product details
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "category": "Category",
    "price": 99.99,
    "quantity": 50,
    "supplier": "Supplier Name",
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 🛒 Order Endpoints (Customer)

#### POST /api/orders
**Description:** Create new order (protected)
**Headers:** Authorization: Bearer <token>
**Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```
**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "_id": "order_id",
    "productId": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "image": "https://example.com/image.jpg"
    },
    "userId": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "quantity": 2,
    "status": "pending",
    "totalPrice": 199.98,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/orders/my-orders
**Description:** Get user's orders (protected)
**Headers:** Authorization: Bearer <token>
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "productId": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "image": "https://example.com/image.jpg",
        "category": "Category",
        "supplier": "Supplier Name"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "quantity": 2,
      "status": "pending",
      "totalPrice": 199.98,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalOrders": 5,
    "totalSpent": 499.95,
    "averageOrderValue": 99.99,
    "pendingOrders": 2
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### 👨‍💼 Admin Product Endpoints

#### GET /api/admin/products
**Description:** Get all products (admin only)
**Headers:** Authorization: Bearer <token> (admin)
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)
- `sortBy` (string, default: 'createdAt')
- `sortOrder` (string, default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "category": "Category",
      "price": 99.99,
      "quantity": 50,
      "supplier": "Supplier Name",
      "image": "https://example.com/image.jpg",
      "userId": {
        "_id": "admin_id",
        "name": "Admin Name",
        "email": "admin@bifa.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalProducts": 100,
    "totalValue": 9999.00,
    "averagePrice": 99.99,
    "lowStock": 5
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### POST /api/admin/products
**Description:** Create new product (admin only)
**Headers:** Authorization: Bearer <token> (admin)
**Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "category": "Category",
  "price": 99.99,
  "quantity": 50,
  "supplier": "Supplier Name",
  "image": "https://example.com/image.jpg"
}
```

#### PATCH /api/admin/products/[id]
**Description:** Update product (admin only)
**Headers:** Authorization: Bearer <token> (admin)
**Body:** (any combination of fields)
```json
{
  "name": "Updated Product Name",
  "price": 149.99,
  "quantity": 75
}
```

#### DELETE /api/admin/products/[id]
**Description:** Delete product (admin only)
**Headers:** Authorization: Bearer <token> (admin)

### 👨‍💼 Admin Order Endpoints

#### GET /api/admin/orders
**Description:** Get all orders (admin only)
**Headers:** Authorization: Bearer <token> (admin)
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)
- `userId` (string, optional)
- `productId` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "productId": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "image": "https://example.com/image.jpg",
        "category": "Category",
        "supplier": "Supplier Name"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "quantity": 2,
      "status": "pending",
      "totalPrice": 199.98,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalOrders": 50,
    "totalRevenue": 4999.50,
    "averageOrderValue": 99.99
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### GET /api/admin/orders/[id]
**Description:** Get specific order (admin only)
**Headers:** Authorization: Bearer <token> (admin)

#### PATCH /api/admin/orders/[id]
**Description:** Update order status (admin only)
**Headers:** Authorization: Bearer <token> (admin)
**Body:**
```json
{
  "status": "confirmed"
}
```

#### DELETE /api/admin/orders/[id]
**Description:** Delete order (admin only)
**Headers:** Authorization: Bearer <token> (admin)

## 🚀 Frontend Integration Guide

### 1. Setting up API Services

Create service files in your frontend:

```typescript
// lib/product-service.ts
import { getPublicProducts, getProductById } from './product-service';

// lib/order-service.ts
import { createOrder, getMyOrders } from './order-service';
```

### 2. Using in Components

#### Display Products (Customer)
```typescript
import { useEffect, useState } from 'react';
import { getPublicProducts } from '../lib/product-service';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getPublicProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render products...
}
```

#### Create Order (Customer)
```typescript
import { createOrder } from '../lib/order-service';

const handleBuyNow = async (productId: string, quantity: number) => {
  try {
    const response = await createOrder({ productId, quantity });
    alert('Order created successfully!');
    // Redirect or update UI
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Failed to create order');
  }
};
```

#### Admin Dashboard
```typescript
import { getAllProducts, getAllOrders } from '../lib/product-service';

// Fetch products for admin
const fetchAdminProducts = async () => {
  const response = await getAllProducts();
  setProducts(response.data);
  setStats(response.stats);
};

// Fetch orders for admin
const fetchAdminOrders = async () => {
  const response = await getAllOrders();
  setOrders(response.data);
  setOrderStats(response.stats);
};
```

### 3. Error Handling

```typescript
try {
  const response = await createOrder(orderData);
  // Handle success
} catch (error) {
  if (error.message.includes('غير مصرح')) {
    // Handle unauthorized
    router.push('/login');
  } else if (error.message.includes('الكمية المطلوبة غير متوفرة')) {
    // Handle insufficient stock
    alert('Insufficient stock');
  } else {
    // Handle other errors
    alert('An error occurred');
  }
}
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing the API

### Test Product Creation (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "category": "Test Category",
    "price": 99.99,
    "quantity": 50,
    "supplier": "Test Supplier"
  }'
```

### Test Order Creation (Customer)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### Test Public Products
```bash
curl -X GET "http://localhost:3000/api/products/public?page=1&limit=10"
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## 🔒 Security Features

1. **JWT Authentication** - All protected routes require valid JWT tokens
2. **Role-based Access** - Admin routes check for admin role
3. **Input Validation** - All inputs are validated using Mongoose schemas
4. **Error Handling** - Comprehensive error handling with meaningful messages
5. **Data Sanitization** - Input data is trimmed and sanitized

## 🚀 Deployment

1. Set up environment variables in production
2. Ensure MongoDB is accessible
3. Deploy to your preferred platform (Vercel, Netlify, etc.)
4. Update `NEXT_PUBLIC_API_URL` to your production domain

## 📝 Notes

- All timestamps are in ISO format
- Prices are stored as numbers (not strings)
- Quantities are validated to be non-negative
- Product images should be valid URLs
- Order status follows a specific flow: pending → confirmed → shipped → delivered
- Cancelled orders can be set at any stage 