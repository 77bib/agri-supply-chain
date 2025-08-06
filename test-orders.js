const mongoose = require('mongoose');

async function testOrders() {
  try {
    await mongoose.connect('mongodb+srv://habib19092004:DnpishnxhAeX7ujf@cluster0.xgnc41h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // جلب جميع الطلبات
    const allOrders = await mongoose.connection.db.collection('orders').find({}).toArray();
    console.log(`📊 Total orders: ${allOrders.length}`);

    // تجميع الطلبات حسب المستخدم
    const ordersByUser = {};
    allOrders.forEach(order => {
      const userId = order.userId.toString();
      if (!ordersByUser[userId]) {
        ordersByUser[userId] = [];
      }
      ordersByUser[userId].push(order);
    });

    console.log('\n📋 Orders by user:');
    Object.keys(ordersByUser).forEach(userId => {
      console.log(`👤 User ${userId}: ${ordersByUser[userId].length} orders`);
      ordersByUser[userId].forEach(order => {
        console.log(`  - Order ${order._id}: ${order.quantity} items, Status: ${order.status}`);
      });
    });

    // اختبار البحث عن طلبات مستخدم محدد
    const testUserId = '688e313a08f6220809d49410';
    console.log(`\n🔍 Testing search for user: ${testUserId}`);
    
    // البحث كـ string
    const ordersAsString = await mongoose.connection.db.collection('orders').find({userId: testUserId}).toArray();
    console.log(`📝 Found ${ordersAsString.length} orders when searching as string`);

    // البحث كـ ObjectId
    const ordersAsObjectId = await mongoose.connection.db.collection('orders').find({userId: new mongoose.Types.ObjectId(testUserId)}).toArray();
    console.log(`🔗 Found ${ordersAsObjectId.length} orders when searching as ObjectId`);

    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testOrders(); 