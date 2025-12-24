const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User Schema (simplified for testing)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', UserSchema);

async function testDatabaseConnection() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test user creation
    console.log('\n👤 Testing user creation...');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@brijuice.com' });
    
    if (existingUser) {
      console.log('ℹ️  Test user already exists, skipping creation');
    } else {
      // Create test user
      const hashedPassword = await bcrypt.hash('12345678', 12);
      const testUser = new User({
        name: 'Test User',
        email: 'test@brijuice.com',
        password: hashedPassword,
        role: 'user'
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully!');
    }
    
    // Test user login
    console.log('\n🔐 Testing user login...');
    
    const user = await User.findOne({ email: 'test@brijuice.com' }).select('+password');
    
    if (!user) {
      console.log('❌ Test user not found!');
      return;
    }
    
    console.log('✅ User found:', user.name, `(${user.email})`);
    
    // Test password verification
    const isPasswordValid = await bcrypt.compare('12345678', user.password);
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }
    
    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({});
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the MongoDB Atlas cluster is running');
      console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
      console.log('4. Verify the connection string is correct');
    }
    
    if (error.name === 'MongoError' && error.code === 18) {
      console.log('\n💡 Authentication failed. Check your username and password.');
    }
    
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the test
testDatabaseConnection(); 