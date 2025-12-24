// اختبار بسيط للاتصال بـ MongoDB Atlas
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/brijuice?retryWrites=true&w=majority&appName=Cluster0';

async function testSimpleConnection() {
  console.log('🚀 Testing Simple MongoDB Atlas Connection...');
  console.log('🔗 URI:', MONGODB_URI.replace(/\/\/[^:]*:[^@]*@/, '//***:***@'));
  
  try {
    // Use simplified connection options
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      family: 4
    });

    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Ready state:', mongoose.connection.readyState);
    
    // Test with a simple schema
    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('SimpleTest', TestSchema);
    
    // Try to save a document
    const testDoc = new TestModel({
      message: 'Vercel compatibility test'
    });
    
    const saved = await testDoc.save();
    console.log('💾 Document saved with ID:', saved._id);
    
    // Clean up
    await TestModel.deleteOne({ _id: saved._id });
    console.log('🗑️ Document cleaned up');
    
    console.log('🎉 All tests passed! MongoDB Atlas is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    // Detailed error analysis
    if (error.name === 'MongoServerSelectionError') {
      console.error('🔧 Server selection failed. Possible causes:');
      console.error('   - MongoDB Atlas IP whitelist doesn\'t include your current IP');
      console.error('   - Network connectivity issues');
      console.error('   - Incorrect connection string');
    } else if (error.name === 'MongoParseError') {
      console.error('🔧 Connection string parsing failed. Check your URI format.');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('🔧 Authentication failed. Check username/password.');
    } else {
      console.error('🔧 Other error:', error.name, error.code);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testSimpleConnection();