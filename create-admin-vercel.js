// إنشاء admin user للعمل مع Vercel
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User schema (نسخة مبسطة)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  address: String,
  registrationDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect with timeout settings
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@bifa.com' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@bifa.com');
      console.log('🔑 Password: admin123456');
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('admin123456', 12);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'Bifa Admin',
      email: 'admin@bifa.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+213 123 456 789',
      address: 'Alger Centre, Algeria'
    });

    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@bifa.com');
    console.log('🔑 Password: admin123456');
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 11000) {
      console.log('ℹ️  Admin user may already exist with this email');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the function
createAdminUser();