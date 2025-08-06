# Quick Start Guide - BIFA Algeria Advanced Dashboard

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

### 2. Installation

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd agri-supply-chain

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 3. Environment Configuration

Edit `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: MongoDB Atlas (if using cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-supply-chain
```

### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (recommended for production)
# Create cluster at https://cloud.mongodb.com
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

## 📊 Dashboard Access

### Admin Login
1. Navigate to `http://localhost:3000/admin/login`
2. Use demo credentials:
   - Email: `admin@bifa.com`
   - Password: `admin123456`

### Dashboard Modules
- **Overview**: Main dashboard with KPIs and charts
- **Farmers**: Farmer management and performance tracking
- **Logistics**: Transport and delivery management
- **Inventory**: Batch and stock management
- **Forecasting**: Predictive analytics
- **Traceability**: Blockchain and QR code tracking

## 🎯 Key Features Overview

### 1. Transport & Logistics
- Real-time shipment tracking
- Vehicle fleet management
- Cold chain monitoring
- Route optimization
- Delivery analytics

### 2. Farmers Management
- Farmer profiles and performance
- Geographic distribution
- Certification tracking
- Yield analytics
- Top performers ranking

### 3. Inventory Management
- Batch tracking and quality control
- Stock level monitoring
- Expiry date management
- Storage conditions tracking
- Value analytics

### 4. Predictive Analytics
- Demand forecasting
- Supply planning
- Price prediction
- Seasonal analysis
- Automated recommendations

### 5. Blockchain Traceability
- Product journey tracking
- QR code verification
- Quality check records
- Environmental data
- Consumer access portal

## 🔧 API Endpoints

### Base URL: `http://localhost:3000/api/admin`

#### Farmers
```bash
GET    /farmers              # Get all farmers
POST   /farmers              # Create farmer
GET    /farmers/[id]         # Get farmer details
PUT    /farmers/[id]         # Update farmer
DELETE /farmers/[id]         # Delete farmer
```

#### Logistics
```bash
GET    /logistics            # Get all shipments
POST   /logistics            # Create shipment
GET    /logistics/[id]       # Get shipment details
PUT    /logistics/[id]       # Update shipment
GET    /logistics/tracking/[id] # Get tracking data
```

#### Inventory
```bash
GET    /inventory            # Get all batches
POST   /inventory            # Create batch
GET    /inventory/[id]       # Get batch details
PUT    /inventory/[id]       # Update batch
GET    /inventory/alerts     # Get alerts
```

## 📱 Mobile Responsiveness

The dashboard is fully responsive and works on:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (320px+)

## 🎨 Customization

### Colors
The dashboard uses an agricultural green theme:
- Primary: `#10b981` (Emerald)
- Secondary: `#3b82f6` (Blue)
- Accent: `#f59e0b` (Amber)
- Warning: `#ef4444` (Red)

### Components
All UI components are built with:
- Tailwind CSS for styling
- Radix UI for accessibility
- Recharts for data visualization
- Lucide React for icons

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control
- Secure session management
- Password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection
- HTTPS enforcement

## 📈 Performance

### Optimization Features
- Code splitting for faster loading
- Image optimization
- Database indexing
- API response caching
- Bundle size optimization

### Monitoring
- Real-time performance metrics
- Error tracking
- User analytics
- System health monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📞 Support

### Documentation
- [Advanced Dashboard Documentation](./ADVANCED-ADMIN-DASHBOARD.md)
- [API Documentation](./API-DOCUMENTATION.md)
- [Setup Guide](./SETUP.md)

### Common Issues

#### MongoDB Connection
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### Port Issues
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. **Explore the Dashboard**: Navigate through all modules
2. **Add Sample Data**: Create test farmers, shipments, and inventory
3. **Configure Alerts**: Set up notification preferences
4. **Customize Settings**: Adjust dashboard preferences
5. **Test Features**: Try all CRUD operations
6. **Deploy to Production**: Set up production environment

## 📊 Sample Data

### Create Test Farmer
```json
{
  "name": "Ahmed Benali",
  "email": "ahmed@greenvalley.com",
  "phone": "+213 123 456 789",
  "farmName": "Green Valley Farm",
  "farmSize": 150,
  "farmLocation": {
    "address": "Route Nationale 1",
    "city": "Algiers",
    "state": "Algiers",
    "coordinates": {
      "lat": 36.7538,
      "lng": 3.0588
    }
  },
  "certifications": ["organic", "fair_trade"],
  "crops": ["wheat", "vegetables"]
}
```

### Create Test Shipment
```json
{
  "vehicleId": "TRUCK-001",
  "vehicleType": "refrigerated_truck",
  "licensePlate": "12345-A-6",
  "driver": {
    "name": "Mohammed Kaci",
    "phone": "+213 987 654 321",
    "licenseNumber": "DL-2024-001",
    "experience": 5
  },
  "route": {
    "origin": {
      "address": "Green Valley Farm, Algiers",
      "coordinates": { "lat": 36.7538, "lng": 3.0588 }
    },
    "destination": {
      "address": "Central Market, Oran",
      "coordinates": { "lat": 35.6971, "lng": -0.6337 }
    }
  },
  "shipment": {
    "orderId": "ORDER-001",
    "products": [
      {
        "productId": "PROD-001",
        "quantity": 1000,
        "weight": 500
      }
    ],
    "totalWeight": 500,
    "specialRequirements": ["refrigeration"]
  },
  "schedule": {
    "departureTime": "2024-01-15T08:00:00Z",
    "estimatedArrival": "2024-01-15T14:00:00Z"
  }
}
```

---

**Ready to start managing your agricultural supply chain! 🌱**

For detailed information, refer to the [Advanced Dashboard Documentation](./ADVANCED-ADMIN-DASHBOARD.md). 