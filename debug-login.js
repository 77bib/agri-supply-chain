const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User Schema
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

const User = mongoose.model('User', UserSchema);

async function debugLogin() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB Atlas!');
    
    // Test credentials
    const testEmail = 'admin@brijuice.com';
    const testPassword = 'admin123456';
    
    console.log(`\n🔍 Testing login for: ${testEmail}`);
    
    // Step 1: Check if user exists
    console.log('\n1️⃣ Checking if user exists...');
    const user = await User.findOne({ email: testEmail.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('💡 Available users:');
      const allUsers = await User.find({});
      allUsers.forEach((u, index) => {
        console.log(`   ${index + 1}. ${u.name} (${u.email})`);
      });
      return;
    }
    
    console.log('✅ User found:', user.name, `(${user.email})`);
    console.log('   Role:', user.role);
    console.log('   Has password field:', !!user.password);
    console.log('   Password length:', user.password ? user.password.length : 'N/A');
    
    // Step 2: Test password verification
    console.log('\n2️⃣ Testing password verification...');
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
      console.log('   Expected password:', testPassword);
      console.log('   Stored password hash:', user.password);
      
      // Try to hash the test password and compare
      const testHash = await bcrypt.hash(testPassword, 12);
      console.log('   Test hash:', testHash);
      console.log('   Hashes match:', user.password === testHash);
    }
    
    // Step 3: Test with different password
    console.log('\n3️⃣ Testing with wrong password...');
    const wrongPassword = 'wrongpassword';
    const isWrongPasswordValid = await bcrypt.compare(wrongPassword, user.password);
    console.log('   Wrong password result:', isWrongPasswordValid ? '✅ (should be false)' : '❌ (correct)');
    
    // Step 4: Test email case sensitivity
    console.log('\n4️⃣ Testing email case sensitivity...');
    const upperCaseEmail = testEmail.toUpperCase();
    const upperCaseUser = await User.findOne({ email: upperCaseEmail }).select('+password');
    console.log('   Uppercase email search result:', upperCaseUser ? 'Found' : 'Not found');
    
    // Step 5: Test direct database query
    console.log('\n5️⃣ Testing direct database query...');
    const directUser = await User.findOne({ email: testEmail }).select('+password');
    console.log('   Direct query result:', directUser ? 'Found' : 'Not found');
    
    console.log('\n🎉 Login debug completed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the debug
debugLogin(); 