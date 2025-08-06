// اختبار الاتصال بـ MongoDB Atlas للتأكد من عمله مع Vercel
const mongoose = require('mongoose');

// MongoDB Atlas connection strings to test
const connections = [
  // Original (without database name)
  'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  
  // With database name
  'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/agri-supply-chain?retryWrites=true&w=majority&appName=Cluster0',
  
  // Alternative with test database
  'mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
];

async function testConnection(uri, label) {
  console.log(`\n🧪 Testing: ${label}`);
  console.log(`🔗 URI: ${uri.replace(/\/\/[^:]*:[^@]*@/, '//***:***@')}`);
  
  try {
    const connection = await mongoose.createConnection(uri, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      heartbeatFrequencyMS: 10000,
    });

    console.log('✅ Connection successful!');
    console.log(`📊 Database: ${connection.db?.databaseName || 'default'}`);
    console.log(`🔗 Ready state: ${connection.readyState}`);
    console.log(`🌐 Host: ${connection.host}`);
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = connection.model('ConnectionTest', TestSchema);
    
    const testDoc = new TestModel({
      message: 'Vercel MongoDB Atlas connection test'
    });
    
    const saved = await testDoc.save();
    console.log('💾 Test document saved:', saved._id);
    
    // Clean up test document
    await TestModel.deleteOne({ _id: saved._id });
    console.log('🗑️ Test document cleaned up');
    
    await connection.close();
    console.log('🔌 Connection closed');
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName
    });
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting MongoDB Atlas Connection Tests');
  console.log('=' .repeat(50));
  
  let successCount = 0;
  
  for (let i = 0; i < connections.length; i++) {
    const success = await testConnection(connections[i], `Connection ${i + 1}`);
    if (success) successCount++;
    
    // Wait between tests
    if (i < connections.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`🎯 Results: ${successCount}/${connections.length} connections successful`);
  
  if (successCount > 0) {
    console.log('✅ MongoDB Atlas is accessible from this environment');
    console.log('💡 Recommend using the successful connection string in Vercel');
  } else {
    console.log('❌ No connections succeeded');
    console.log('🔧 Possible issues:');
    console.log('   - Network access restrictions in MongoDB Atlas');
    console.log('   - Invalid credentials');
    console.log('   - Firewall blocking connections');
    console.log('   - Vercel IP not whitelisted in MongoDB Atlas');
  }
  
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});